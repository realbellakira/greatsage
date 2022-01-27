import type {ISage, ISageUser} from './sage'
import {SAGE_COUNT} from './settings'


export async function getLastestBilibiliSagesByUID (uid: string, takeNumber: number = SAGE_COUNT) {
    const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${uid}`

    const response = await fetch(url).then(r => r.json())
    return (response?.data?.cards || []).slice(0, takeNumber).map(serializeBilibiliSage)
}

/**
 * @document
 * <https://github.com/SocialSisterYi/bilibili-API-collect/blob/a7a743dffdb0e22ef735a8639dd3c3ead82665e4/dynamic/get_dynamic_detail.md>
 */
function serializeBilibiliSage (rawSage: ANY): ISage {
    // TODO: @sy implement this
    rawSage.card = JSON.parse(rawSage.card)
    if (rawSage.card.origin) {
        rawSage.card.origin = JSON.parse(rawSage.card.origin)
    }

    const id = rawSage.desc.dynamic_id_str
    const timestamp = rawSage.desc.timestamp
    const type = serializeBilibiliSageType(rawSage)
    const originSage = rawSage.card.origin ? serializeBilibiliOriginSage(rawSage) : undefined

    return {
        id,
        url: `https://t.bilibili.com/${id}`,
        timestamp,
        user: serializeBilibiliSageUser(rawSage),
        stats: {
            repost: rawSage.desc.repost,
            like: rawSage.desc.like,
            comment: rawSage.desc.comment,
        },
        type,
        content: serializeBilibiliSageContent(rawSage),
        originSage,
    }
}

function serializeBilibiliSageType (rawSage: ANY): ISage['type'] {
    const {type} = rawSage.desc
    if (type === 1) return 'repost'
    if (type === 2) return 'image'
    if (type === 4) return 'text'
    // tslint:disable-next-line: no-magic-numbers
    if (type === 8 || type === 16) return 'video'
    // tslint:disable-next-line: no-magic-numbers
    if (type === 64) return 'article'
    return 'text'
}

function serializeBilibiliSageContent (rawSage: ANY): object { // TODO: @sy implement this
    const type = serializeBilibiliSageType(rawSage)
    const item = rawSage.card.item
    // pictures = (rawSage.card.pictures || []).map((p: ANY) => p.img_src)

    if (type === 'repost') return { // TODO: @sy serialize reposted content
        content: item.content,
    }
    if (type === 'text') return {
        content: item.content,
    }
    if (type === 'image') return {
        content: item.description,
        pictures: item.pictures.map((p: ANY) => p.image_src),
    }
    if (type === 'video') return { // TODO: @sy serialize video content
        //
    }

    return {}
}

function serializeBilibiliOriginSage (rawSage: ANY): ISage {
    const origin = rawSage.desc.origin
    const id = origin.dynamic_id_str

    return {
        id,
        url: `https://t.bilibili.com/${id}`,
        timestamp: origin.timestamp,
        user: serializeBilibiliOriginSageUser(rawSage),
        stats: {
            repost: 0,
            like: 0,
            comment: 0,
        },
        type: 'repost', // TODO: @sy serialize reposted content
        content: { // TODO: @sy serialize reposted content
            content: origin.description,
            pictures: (origin.pictures || []).map((p: ANY) => p.img_src),
        },
    }
}

function serializeBilibiliSageUser (rawSage: ANY): ISageUser {
    const decorateCard = rawSage.desc.user_profile.decorate_card && {
        card: rawSage.desc.user_profile.decorate_card.card_url,
        number: rawSage.desc.user_profile.decorate_card.fan.num_desc,
        color: rawSage.desc.user_profile.decorate_card.fan.color,
        url: rawSage.desc.user_profile.decorate_card.jump_url,
    }

    return {
        decorateCard,
        ...serializeBilibiliSageInfoUser(rawSage.desc.user_profile),
    }
}

function serializeBilibiliOriginSageUser (rawSage: ANY): ISageUser {
    return serializeBilibiliSageInfoUser(rawSage.card.origin_user)
}

function serializeBilibiliSageInfoUser (userProfile: ANY): ISageUser {
    return {
        name: userProfile.info.uname,
        avatar: userProfile.info.face,
        url: `https://space.bilibili.com/${userProfile.info.uid}`,
    }
}
