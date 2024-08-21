import { useI18n } from "vue-i18n"

export interface ArticleInfo {
    id: number,
    title: string,
    link: string,
    tag: string,
    appendTime: number, // timestamp
    neededTime: number, // unit: min
    description?: string,
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch { }
    return false
}

const intervals = {
    'year': 31536000,
    'month': 2628000,
    'week': 604800,
    'day': 86400,
    'hour': 3600,
    'minute': 60,
}
export function timeAgo(timestamp: number): string {
    const { t } = useI18n()
    const difference = Math.floor((Date.now() - timestamp) / 1000)

    for (const intervalName in intervals) {
        const interval = intervals[intervalName]
        if (difference >= interval) {
            const count = Math.floor(difference / interval)
            return t('list.appendTime.general', {
                unit: t('list.appendTime.units.' + intervalName, count)
            })
        }
    }

    return t('list.appendTime.just-now')
}
