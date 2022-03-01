/**
 * @file it's called sage as it maybe include tiktok dynamics someday
 *
 * @info We are saving user infos into sages.
 * If we meet storage short, it saves a lot of space to erase all of them except uid.
 */


export type ISage = IRepostSage | ITextSage | IImageSage | IVideoSage | IArticleSage

interface IBaseSage {
    id: string
    url: string
    user: ISageUser
    timestamp: number
    type: 'repost' | 'text' | 'image' | 'video' | 'article'
    stats: {
        repost: number
        like: number
        comment: number
    }
    content: object
    originSage?: ANY // ISage // TODO: @sy
}

interface IRepostSage extends IBaseSage {
    type: 'repost'
    content: {
        content: string
    }
    originSage: ISage
}

interface ITextSage extends IBaseSage {
    type: 'text'
    content: {
        content: string
    }
}

interface IImageSage extends IBaseSage {
    type: 'image'
    content: {
        content: string
        pictures: string[]
    }
}

interface IVideoSage extends IBaseSage {
    type: 'video'
    content: {
        title: string
        description: string
        dynamic: string
        picture: string
        url: string
        /** @description seconds */
        duration: number
        stats: {
            view: number
            danmaku: number
            like: number
            coin: number
        }
    }
}

interface IArticleSage extends IBaseSage {
    type: 'article'
    content: {
        url: string
        title: string
        content: string
        pictures: string[]
    }
}

export interface ISageUser {
    name: string
    avatar: string
    url: string
    decorateCard?: {
        card: string
        number: string
        color: string
        url: string
    }
}
