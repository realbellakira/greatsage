// tslint:disable: no-magic-numbers

// also used in front-end, remember to add these to `next.config.js`
export const PUSHER_KEY = process.env.PUSHER_KEY!

// only appears in api
export const PUSHER_APPID = process.env.PUSHER_APPID!
export const PUSHER_SECRET = process.env.PUSHER_SECRET!
export const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER || 'mt1'
export const REDIS_ENDPOINT = process.env.REDIS_ENDPOINT!
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD!
export const SAGE_FREQUENCY_IN_SECONDS = parseInt(process.env.SAGE_FREQUENCY_IN_SECONDS || '0', 10) || 30
export const SAGE_COUNT = parseInt(process.env.SAGE_COUNT || '0', 10) || 10

// TODO: @sy get account informations at client-side
export const BILIBILI_UIDS = (process.env.BILIBILI_UIDS || '672353429,351609538').split(',')
