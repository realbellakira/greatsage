import type {NextApiRequest, NextApiResponse} from 'next'
import Pusher from 'pusher'

import {PUSHER_APPID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER, BILIBILI_UIDS} from 'src/libs/settings'
import useRedis from 'src/libs/redis'
import {getLatestSagesFromRedisByID} from 'src/libs/sage'


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const pusher = new Pusher({
        appId: PUSHER_APPID,
        key: PUSHER_KEY,
        secret: PUSHER_SECRET,
        cluster: PUSHER_CLUSTER,
        useTLS: true,
    })

    const sageGroups = await getSages()
    sageGroups.filter(([updated]) => updated).forEach(([, sages]) => {
        pusher.trigger('sage', 'new', {
            message: sages[0],
        })
    })
    const value = (sageGroups
        .map(([, sages]) => sages)
        .reduce((r, sages) => r.concat(sages), [])
        .sort((l, r) => l.timestamp - r.timestamp)
    )

    // tslint:disable-next-line: no-magic-numbers
    return res.status(200).send({
        timestamp: new Date(),
        value,
    })
}

async function getSages () {
    return getLatestSagesFromRedis()
}

async function getLatestSagesFromRedis () {
    return useRedis(async client => {
        return Promise.all(BILIBILI_UIDS.map(getLatestSagesFromRedisByID(client)))
    })
}
