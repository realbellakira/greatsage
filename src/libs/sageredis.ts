import {createClient} from 'redis'

import {ISage} from './sage'
import {getWithFrequencyLimit, setWithFrequencyLimit} from './redis'
import {SAGE_FREQUENCY_IN_SECONDS} from './settings'
import {getLastestBilibiliSagesByUID} from './sagebilibili'


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
