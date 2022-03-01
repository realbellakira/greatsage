import type {NextApiRequest, NextApiResponse} from 'next'


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {dynamic_id} = req.query

    const url = `http://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${dynamic_id}`

    fetch(url).then(r => r.json()).then(r => {
        const card = r.data.card
        if (card) {
            card.card = JSON.parse(r.data.card.card)
            if (card.extend_json) {
                card.extend_json = JSON.parse(card.extend_json)
            }
            if (card.card.origin) {
                card.card.origin = JSON.parse(card.card.origin)
            }
            if (card.card.origin_extend_json) {
                card.card.origin_extend_json = JSON.parse(card.card.origin_extend_json)
            }
        }

        // tslint:disable-next-line: no-magic-numbers
        res.status(200).send(r)
    })
}
