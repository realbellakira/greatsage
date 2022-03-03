
import {useRef} from 'react'

import {IProps} from './SageSpecs'
import SageCardTimestamp from './SageCardTimestamp'
import SageCardContent from './SageCardContent'
import SageCardButtonBar from './SageCardButtonBar'
import useInterSectionObserver from '@csszen/hooks.useintersectionobserver'


interface ICardProps extends IProps {
    className?: string
    onViewed?: (id: string) => void
}

export default function SageCard ({sage, className = '', onViewed}: ICardProps) {
    const {user} = sage
    const viewed = useRef(false)

    const $anchor = useInterSectionObserver<HTMLDivElement>(entry => {
        if (entry.isIntersecting) {
            if (viewed.current) {
                if (onViewed) onViewed(sage.id)
            } else {
                viewed.current = true
            }
        }
    }, {
        threshold: Array.from(Array(100), (_, i) => i / 100),
    })

    return (
        <div ref={$anchor} className={`card ${className}`}>
            <a className="user-head">
                <div className="bili-avatar">
                    <img className="bili-avatar-img bili-avatar-face bili-avatar-img-radius" src={user.avatar} />
                </div>
            </a>

            <div className="main-content">
                <div className="user-name">
                    <a href={user.url} style={{color: user.decorateCard?.color}} target="_blank">{user.name}</a>
                </div>
                <SageCardTimestamp sage={sage} />
                <SageCardContent sage={sage} />
                <SageCardButtonBar sage={sage} />
            </div>

            {user.decorateCard && (
                <div className={`card-decorator${user.decorateCard.number ? ' has-number' : ''}`}>
                    <img className="fans-card" src={user.decorateCard.card} />
                    <div className="fans-card-text" style={{color: user.decorateCard.color}}>{user.decorateCard.number}</div>
                </div>
            )}
        </div>
    )
}
