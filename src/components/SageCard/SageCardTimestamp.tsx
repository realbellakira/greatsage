
import {IProps} from './SageSpecs'


export default function SageCardTimestamp ({sage}: IProps) {
    const {timestamp} = sage

    return (
        <a href={sage.url} target="_blank">
            <div className="time" title={localeTimestamp(timestamp)}>{formatTimestampInBilibiliStyle(timestamp)}</div>
        </a>
    )
}

function formatTimestampInBilibiliStyle (timestamp: number) {
    const now = new Date()
    const date = new Date(timestamp * 1000)
    const timeString = date.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'})
    const dateString = new Date(timestamp * 1000 - new Date().getTimezoneOffset() * 60 * 1000).toJSON().split('T')[0]

    const oneDayMilliseconds = 24 * 60 * 60 * 1000
    const passedMilliseconds = +now - +date

    if (passedMilliseconds < oneDayMilliseconds) {
        if (passedMilliseconds < 60 * 1000) return `${Math.floor(passedMilliseconds / 1000)} 秒前`
        if (passedMilliseconds < 60 * 60 * 1000) return `${Math.floor(passedMilliseconds / 1000 / 60)} 分钟前`
        return `${Math.floor(passedMilliseconds / 1000 / 60 / 60)} 小时前`
    }
    if (isOnSameDay(date, new Date(+now - oneDayMilliseconds))) return `昨天 ${timeString}`
    return `${dateString} ${timeString}`
}

function isOnSameDay (l: Date, r: Date) {
    return (
        l.getFullYear() === r.getFullYear() &&
        l.getMonth() === r.getMonth() &&
        l.getDate() === r.getDate()
    )
}

function localeTimestamp (timestamp: number) {
    return new Date(timestamp * 1000 - new Date().getTimezoneOffset() * 60 * 1000).toJSON().split('.')[0].replace('T', ' ')
}
