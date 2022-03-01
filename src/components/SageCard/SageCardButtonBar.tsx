
import bilibiliNumberFormat from 'src/libs/bilibilinumberformat'
import {IProps} from './SageSpecs'


export default function SageCardButtonBar ({sage}: IProps) {
    const {stats} = sage

    return (
        <div className="button-bar">
            <SingleButton icon="bp-svg-icon single-icon transmit" value={stats?.repost} />
            <SingleButton icon="bp-svg-icon single-icon comment" value={stats?.comment} />
            <SingleButton icon="custom-like-icon zan" value={stats?.like} />
        </div>
    )
}

function SingleButton ({icon, value}: {
    icon: string
    value: number
}) {
    return (
        <div className="single-button">
            <span className="text-bar">
                <i className={icon} />
                <span className="text-offset">{bilibiliNumberFormat(value)}</span>
            </span>
        </div>
    )
}
