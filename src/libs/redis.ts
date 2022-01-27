/**
 * @file make sure no business logic involved
 */
import {createClient} from 'redis'

import {REDIS_ENDPOINT, REDIS_PASSWORD} from 'src/libs/settings'


export default async function useRedis<T> (
    action: (client: ReturnType<typeof createClient>) => Promise<T>
) {
    const client = createClient({
        url: `redis://${REDIS_ENDPOINT}`,
        password: REDIS_PASSWORD,
    })

    return new Promise<T>((resolve, reject) => {
        client.on('error', reject)
        client.connect()
            .then(() => action(client)
                .then(resolve)
                .catch(reject)
                .finally(() => client.disconnect())
            )
            .catch(reject)
    })
}

export async function testRedis () {
    return useRedis(async client => {
        const testKey = 'test'
        const testValue = performance.now().toString()

        await client.set(testKey, testValue)
        const value = await client.get(testKey)

        if (value !== testValue) throw new Error()

        return 'success'
    })
}

export async function getWithFrequencyLimit (client: ReturnType<typeof createClient>, key: string) {
    return client.multi()
        .get(key)
        .get(`setlock:${key}`)
        .exec() as Promise<[string, string]>
}

export async function setWithFrequencyLimit (client: ReturnType<typeof createClient>, key: string, value: string, EX: number) {
    return client.multi()
        .set(key, value)
        .set(`setlock:${key}`, '1', {EX})
        .exec() as Promise<[string, string]>
}
