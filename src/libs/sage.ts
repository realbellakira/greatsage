/**
 * @file it's called sage as it maybe include tiktok dynamics someday
 *
 * @info We are saving user infos into sages.
 * If we meet storage short, it saves a lot of space to erase all of them except uid.
 */

import {createClient} from 'redis'

import {getWithFrequencyLimit, setWithFrequencyLimit} from './redis'
import {SAGE_FREQUENCY_IN_SECONDS} from './settings'
import {getLastestBilibiliSagesByUID} from './sagebilibili'


export interface ISage {
    id: string
    url: string
    user: ISageUser
    timestamp: number
    type: 'repost' | 'text' | 'image' | 'video' | 'article' // TODO: @sy strict type for type&content
    stats: {
        repost: number
        like: number
        comment: number
    }
    content: object
    originSage?: ISage
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

export function getLatestSagesFromRedisByID (client: ReturnType<typeof createClient>) {
    return async (id: string): Promise<[ISage[], ISage[]]> => {
        const bilibiliKey = `bilibili:${id}`
        const [rawSages, locked] = await getWithFrequencyLimit(client, bilibiliKey)

        let sages: ISage[] = JSON.parse(rawSages || '[]')
        let updatedSages: ISage[] = []

        if (!locked) {
            const latestSages = [...sages]
            sages = await getLastestBilibiliSagesByUID(id)
            updatedSages = sages.filter(sage => !latestSages.find(latestSage => latestSage.id === sage.id))
            await setWithFrequencyLimit(client, bilibiliKey, JSON.stringify(sages), SAGE_FREQUENCY_IN_SECONDS)
        }

        return [updatedSages, sages]
    }
}
