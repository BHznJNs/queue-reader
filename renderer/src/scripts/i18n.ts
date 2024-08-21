import { createI18n } from 'vue-i18n'

const messages = {
    'zh': {
        title: '阅读列表',
        list: {
            clickToQueue: '点击 + 添加文章',
            neededTime: '预计需要 {0} 分钟',
            appendTime: {
                units: {
                    year: '{n} 年',
                    month: '{n} 月',
                    week: '{n} 周',
                    day: '{n} 天',
                    hour: '{n} 小时',
                    minute: '{n} 分钟',
                },
                general: '约 {unit}前',
                'just-now': '刚刚',
            },
        },
        newArticle: {
            title: '添加到队列',
            url: '文章链接',
            tag: '文章标签',
            tagDesc: '如果不存在，则新建',
            actions: {
                cancel: '取消',
                confirm: '确定',
            },
        },
        sidebar: {
            queue: '待读',
            tags: '标签',
            archives: '归档',
            setting: '设置',
        },
        setting: {
            title: '设置',
            theme: '主题',
            language: '语言',
            themes: {
                light: '白天',
                dark: '夜晚',
                auto: '自动',
            },
            actions: {
                cancel: '取消',
                save: '保存',
            }
        }
    },
    'en': {
        title: 'Reading Queue',
        list: {
            clickToQueue: 'Click "+" to Queue',
            neededTime: '{0} min read',
            appendTime: {
                units: {
                    year: '1 year | {n} years',
                    month: '1 month | {n} months',
                    week: '1 week | {n} weeks',
                    day: '1 day | {n} days',
                    hour: '1 hour | {n} hours',
                    minute: '1 minute | {n} minutes',
                },
                general: 'about {unit} ago',
                'just-now': '刚刚',
            },
        },
        newArticle: {
            title: 'Add to Queue',
            url: 'Article URL',
            tag: 'Article Tag',
            tagDesc: 'If not exists, create new',
            actions: {
                cancel: 'Cancel',
                confirm: 'Confirm',
            },
        },
        sidebar: {
            queue: 'Queue',
            tags: 'Tags',
            archives: 'Archives',
            setting: 'Setting',
        },
        setting: {
            title: 'Setting',
            theme: 'Theme',
            language: 'Language',
            themes: {
                light: 'Light',
                dark: 'Dark',
                auto: 'Auto',
            },
            actions: {
                cancel: 'Cancel',
                save: 'Save',
            }
        }
    }
}

export type Language = 'zh' | 'en'
export function createI18nWith(language: Language) {
    return createI18n({
        legacy: false,
        locale: language,
        fallbackLocale: 'en',
        messages,
    })
}

