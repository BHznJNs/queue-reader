import { DataPath, GlobalFsOption } from './path'
import { DataStoreFactory, DataStoreFromData, StackStore } from './store'
import type { SettingThemeState } from '../wrapper/ThemeProvider'
import { createDir, exists, readTextFile, writeTextFile } from '@tauri-apps/api/fs'

async function existsOrCreate(path: string) {
    const isFolder = path.endsWith("/")
    const isExists = await exists(path, GlobalFsOption)

    if (isExists) {
        return
    }

    if (isFolder) {
        await createDir(path, GlobalFsOption)
    } else {
        await writeTextFile(path, DataDefaultContent[path], GlobalFsOption)
    }
}

const DataDefaultContent = Object.freeze({
    [DataPath.general]: JSON.stringify({
        language: (() => {
            switch (navigator.language) {
                case 'zh-CN': return 'zh'
                case 'en':
                case 'en-GB':
                case 'en-US':
                default:
                    return 'en'
            }
        })(),
        theme: 'auto' as SettingThemeState,
        tags: [],
        increment: 0,
        archives: 0,
    }),
    [DataPath.queue]: JSON.stringify([]),
    [DataPath.archives]: JSON.stringify([]),
})

await existsOrCreate(DataPath.dataFolder)
await existsOrCreate(DataPath.general)
await existsOrCreate(DataPath.queue)
console.log("[DEBUG] config exist check finished")

// --- --- --- --- --- ---

interface GlobalConfig {
    language: string,
    theme: SettingThemeState,
    tags: string[],
    increment: number,
    archives: number,
}

const config = JSON.parse(await readTextFile(
    DataPath.general, GlobalFsOption
)) as GlobalConfig

globalThis.__CONFIG__ = DataStoreFromData(DataPath.general, {
    language: config.language,
    theme: config.theme,
    tags: new Set(config.tags),
    increment: config.increment,
    archives: config.archives,
})

globalThis.__QUEUE__ = await DataStoreFactory(DataPath.queue)
globalThis.__ARCHIVES__ = await StackStore.create(
    DataPath.archives,
    globalThis.__CONFIG__.archives,
)
globalThis.__ARCHIVES__.addResizeEvent((newSize: number, _) =>
    globalThis.__CONFIG__.archives = newSize)

console.log("[DEBUG] config reading finished")
