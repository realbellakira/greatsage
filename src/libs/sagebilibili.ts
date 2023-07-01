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
 *
 * To see what it looks like
 * http://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=[dynamic_id]
 * Or fully JSON parsed
 * http://localhost:3000/api/dynamic?dynamic_id=[dynamic_id]
 */
function serializeBilibiliSage (rawSage: ANY): ISage {
    rawSage.card = JSON.parse(rawSage.card)
    if (rawSage.card.origin) {
        rawSage.card.origin = JSON.parse(rawSage.card.origin)
    }

    const id = rawSage.desc.dynamic_id_str
    const url = `https://t.bilibili.com/${id}`
    const timestamp = rawSage.desc.timestamp

    return {
        id,
        url,
        timestamp,
        type: serializeBilibiliSageType(rawSage),
        user: serializeBilibiliSageUser(rawSage),
        stats: serializeBilibiliSageStats(rawSage),
        content: serializeBilibiliSageContent(rawSage),
        originSage: serializeBilibiliOriginSage(rawSage),
    } as ISage
}

function serializeBilibiliSageStats (rawSage: ANY): ISage['stats'] {
    const type = serializeBilibiliSageType(rawSage)
    const {repost, like} = rawSage.desc
    const comment = type === 'video'
        ? rawSage.card.stat.reply
        : type === 'article'
            ? rawSage.card.stats.reply
            : type === 'audio'
                ? rawSage.card.replyCnt
                : rawSage.desc.comment

    return {
        repost,
        like,
        comment,
    }
}

function serializeBilibiliSageType (rawSage: ANY): ISage['type'] {
    const type = rawSage.type || rawSage.desc.type

    if (type === 1) return 'repost'
    if (type === 2) return 'image'
    if (type === 4) return 'text'
    // tslint:disable-next-line: no-magic-numbers
    if (type === 8 || type === 16) return 'video'
    // tslint:disable-next-line: no-magic-numbers
    if (type === 64) return 'article'
    if (type === 256) return 'audio'
    return 'text'
}

function serializeBilibiliSageContent (rawSage: ANY): ISage['content'] {
    const type = serializeBilibiliSageType(rawSage)
    const card = rawSage.card

    return serializeBilibiliSageCard(type, card)
}

function serializeBilibiliSageCard (type: ISage['type'], card: ANY): ISage['content'] {
    const item = card.item

    if (type === 'repost') return {
        content: item.content,
    }
    if (type === 'text') return {
        content: item.content,
    }
    if (type === 'image') return {
        content: item.description,
        pictures: item.pictures.map((p: ANY) => p.img_src),
    }
    if (type === 'video') return {
        title: card.title,
        description: card.desc,
        dynamic: card.dynamic,
        picture: card.pic,
        url: card.short_link_v2,
        duration: card.duration,
        stats: {
            view: card.stat.view,
            danmaku: card.stat.danmaku,
            like: card.stat.like,
            coin: card.stat.coin,
        },
    }
    if (type === 'audio') return {
        title: card.title,
        dynamic: card.intro,
        description: card.typeInfo,
        picture: card.cover,
        stats: {
            play: card.playCnt,
            comment: card.replyCnt,
        }
    }

    return {
        url: `https://www.bilibili.com/read/cv${card.id}`,
        title: card.title,
        content: card.summary,
        pictures: card.image_urls,
    }
}

function serializeBilibiliOriginSage (rawSage: ANY): ISage['originSage'] {
    // TODO: @sy reposted reposted sage
    if (!rawSage.card.origin) return

    const originDesc = rawSage.desc.origin
    const originCard = rawSage.card.origin
    const id = originDesc.dynamic_id_str

    return {
        id,
        url: `https://t.bilibili.com/${id}`,
        timestamp: originDesc.timestamp,
        user: serializeBilibiliOriginSageUser(rawSage),
        stats: {
            repost: originDesc.repost,
            like: originDesc.like,
            comment: originCard.stat?.comment || originCard.stat?.reply || originCard.stats?.reply,
        },
        type: serializeBilibiliSageType(originDesc),
        content: serializeBilibiliOriginSageContent(rawSage),
    }
}

function serializeBilibiliOriginSageContent (rawSage: ANY): ISage['content'] {
    const type = serializeBilibiliSageType(rawSage.desc.origin)
    const card = rawSage.card.origin
    return serializeBilibiliSageCard(type, card)
}

function serializeBilibiliSageUser (rawSage: ANY): ISageUser {
    const userProfile = rawSage.desc.user_profile
    const decorateCard = userProfile.decorate_card && {
        card: userProfile.decorate_card.card_url,
        number: userProfile.decorate_card.fan?.num_desc,
        color: userProfile.decorate_card.fan?.color,
        url: userProfile.decorate_card.jump_url,
    }

    return {
        decorateCard,
        ...serializeBilibiliSageInfoUser(userProfile),
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
