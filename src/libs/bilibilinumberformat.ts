// tslint:disable: no-magic-numbers

/** @description 叔叔见不得五位数捏 */
export default function bilibiliNumberFormat (n: number) {
    if (!n) return n
    if (!(n >> 13)) return n

    if (n > 10000 * 10000) return `${(n / (10000 * 10000)).toFixed(1).replace(/\.0$/, '')}亿`
    if (n > 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, '')}万`
    return n.toString()
}
