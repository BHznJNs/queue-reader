import { readTextFile, renameFile, writeTextFile } from '@tauri-apps/api/fs'
import { GlobalFsOption } from './path'

const replacer = (_: string, value: any) => (value instanceof Set)
    ? Array.from(value)
    : value

export function DataStoreFromData<T extends object>(path: string, data: T): T {
    const updater = () =>
        writeTextFile(path, JSON.stringify(data, replacer), GlobalFsOption)

    const proxyHandler: ProxyHandler<T> = {
        get(obj: object, prop: string): any {
            const value = Reflect.get(obj, prop)
            if (typeof value === 'function') {
                return function(...args: readonly any[]) {
                    const ret = Reflect.apply(value, obj, args)
                    updater()
                    return ret
                }
            }
            if (typeof value === 'object' && value !== null) {
                return new Proxy(value, proxyHandler)
            }
            return value
        },
        set(obj: object, prop: string, newVal: any): boolean {
            const ret = Reflect.set(obj, prop, newVal)
            updater()
            return ret
        },
    }
    return new Proxy(data, proxyHandler) as T
}

export async function DataStoreFactory(path: string): Promise<any> {
    const data = await readTextFile(path, GlobalFsOption)
    const topLevelObj = JSON.parse(data)
    return DataStoreFromData(path, topLevelObj)
}

// --- --- --- --- --- ---

interface ManualDataStore<T> {
    value: T;
    updater: () => Promise<void>;
}
export async function ManualDataStore<T extends object>(path: string): Promise<ManualDataStore<T>> {
    const data = await readTextFile(path, GlobalFsOption)
    const value = JSON.parse(data)

    const replacer = (_: string, value: any) => (value instanceof Set)
        ? Array.from(value)
        : value
    const updater = () =>
        writeTextFile(path, JSON.stringify(value, replacer), GlobalFsOption)
    return { updater, value }
}

const PAGEING_FACTOR = 8
const REACLLOC_FACTOR = PAGEING_FACTOR / 4

type ResizeEventCallback = (newSize: number, oldSize: number) => void
export class StackStore<T> {
    // path: 'path-to-file-{}.json'
    // '{}' will be replaced with file index
    pathFmt!: string
    size!: number
    top!: ManualDataStore<T[]>
    onResize!: (ResizeEventCallback)[]

    static async create(
        pathFmt: string,
        size: number,
    ): Promise<StackStore<any>> {
        const ret = new StackStore
        const getPath = (index: number) =>
            pathFmt.replace('{}', index.toString())
        ret.pathFmt = pathFmt
        ret.size = size
        ret.onResize = []

        if (size === 0) {
            ret.size += 1
            await writeTextFile(getPath(0), '[]', GlobalFsOption)
        }
        ret.top = await ManualDataStore(getPath(ret.size - 1))
        return ret
    }

    async #realloc(store: ManualDataStore<T[]>, index: number) {
        const toBeExtended = store.value.length >= (PAGEING_FACTOR + REACLLOC_FACTOR)
        const toBeShrinked = store.value.length === 0
        if (!toBeExtended && !toBeShrinked) {
            await store.updater()
            return
        }

        const oldSize = this.size
        if (index === 1) {
            // operations at the top chunk
            if (toBeExtended) {
                const diff = store.value.length - PAGEING_FACTOR
                const removed = this.top.value.splice(-diff)
                await writeTextFile(this.#getPath(this.size), JSON.stringify(removed), GlobalFsOption)

                this.top.updater()
                this.top = await ManualDataStore(this.#getPath(this.size))
                this.top.updater()
                this.size += 1
            }
            if (toBeShrinked && this.size > 1) {
                this.top.updater()
                this.top = await ManualDataStore(this.#getPath(this.size - 2))
                this.size -= 1
            }
            this.onResize
                .forEach((handler) =>
                    handler(this.size, oldSize))
            return
        }

        // for `insert` and `remove` operation
        if (toBeExtended) {
            // since there is no `insert` method now, this is unreachable
        }
        if (toBeShrinked) {
            const actualFileIndex = this.size - index
            for (let i=actualFileIndex; i<this.size; i++) {
                const curPath = this.#getPath(i)
                const nextPath = this.#getPath(i + 1)
                renameFile(nextPath, curPath)
            }
            this.size -= 1
            this.onResize
                .forEach((handler) =>
                    handler(this.size, oldSize))
        }
    }

    async #getPage(index: number): Promise<ManualDataStore<T[]>> {
        if (index === 1) {
            return this.top
        }
        if (index > this.size) {
            throw new RangeError("Invalid index, with size : " + this.size)
        }
        const path = this.#getPath(this.size - index)
        return await ManualDataStore(path)
    }

    #getPath(index: number) {
        return this.pathFmt.replace("{}", index.toString())
    }

    async push(element: T) {
        this.top.value.push(element)
        await this.#realloc(this.top, 1)
    }

    async pop(): Promise<T | undefined> {
        const ret = this.top.value.pop()
        await this.#realloc(this.top, 1)
        return ret
    }

    async findAndRemove(pageIndex: number, cmp: (element: any) => boolean): Promise<{
        value: T,
        index: number,
    }> {
        const page = await this.#getPage(pageIndex)
        const index = page.value.findIndex(cmp)
        const removed = page.value.splice(index, 1)[0]
        await this.#realloc(page, pageIndex)
        return { value: removed, index }
    }

    addResizeEvent(callback: ResizeEventCallback) {
        this.onResize.push(callback)
    }

    async getPage(index: number): Promise<T[]> {
        return (await this.#getPage(index))
            .value
            .toReversed()
    }
}
