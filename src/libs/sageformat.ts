
import {ISage} from './sage'


export function formatSageAction (sage: ISage) {
    const action = {
        video: '投稿了视频',
        article: '发布了文章',
        image: '发布了图片',
        text: '发布了动态',
        audio: '发布了音频',
        repost: `转发了${sage.originSage?.user?.name || ''}${formatOriginSageAction(sage)}`,
    }[sage.type]

    return `${sage.user.name}${action}`
}

export function formatOriginSageAction (sage: ISage) {
    if (sage.type !== 'repost') return ''

    return `的${{
        video: '投稿视频',
        article: '文章',
        image: '图片',
        text: '动态',
        repost: '动态',
        audio: '音频',
    }[sage.originSage.type]}`
}

export function formatSageNotification (sage: ISage): NotificationOptions {
    return {
        body: formatSageNotificationBody(sage),
        icon: sage.user.avatar,
        badge: sage.user.avatar,
        timestamp: sage.timestamp * 1000,
        data: {
            url: sage.url,
        },
    }
}

function formatSageNotificationBody (sage: ISage) {
    if (sage.type === 'text') return sage.content.content
    if (sage.type === 'image') return sage.content.content
    if (sage.type === 'video') return sage.content.title
    if (sage.type === 'article') return sage.content.title
    if (sage.type === 'repost') {
        const {originSage} = sage
        if (originSage.type === 'text') return originSage.content.content
        if (originSage.type === 'image') return originSage.content.content
        if (originSage.type === 'video') return originSage.content.title
        if (originSage.type === 'article') return originSage.content.title
        return ''
    }
    return ''
}
