import { BaseDirectory } from '@tauri-apps/api/fs'

export const GlobalFsOption = { dir: BaseDirectory.Resource }
export const DataPath = Object.freeze({
    dataFolder: 'userData/',
    general: 'userData/general.json',
    queue: 'userData/queue.json',
    archives: 'userData/archives-{}.json',
})

export type ListId = typeof QUEUE | typeof ARCHIVES | string
export const QUEUE = Symbol("queue")
export const ARCHIVES  = Symbol("archives")
