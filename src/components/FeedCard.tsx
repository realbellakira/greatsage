
import {useEffect, useState} from 'react'

import usePusher from 'src/libs/usePusher'
import useNotification from 'src/libs/useNotification'
import useCallbackRef from 'src/libs/useCallbackRef'
import useVisibilityChange from 'src/libs/useVisibilityChange'
import type {ISage} from 'src/libs/sage'
import {formatSageAction, formatSageNotification} from 'src/libs/sageformat'
import SageCard from 'src/components/SageCard'


export default function FeedCard () {
    const [lastTimeStamp, setLastTimeStamp] = useState('')
    const [sages, setSages] = useState<ISage[]>([])
    const $notificationService = useNotification()

    useEffect(() => {
        fetch('/api/relay').then(r => r.json()).then(({timestamp, sages: responseSages}) => {
            setSages(responseSages.reverse())
            setLastTimeStamp(timestamp)
        })
    }, [])

    const [newSageIds, setNewSageIds] = useState<string[]>([])
    const $savedResetNewSageIds = useCallbackRef(() => {
        setNewSageIds(prev => prev.filter(id => !newSageIds.includes(id)))
    }, [newSageIds])

    useVisibilityChange(() => {
        if (document.hidden) return
        const savedResetNewSageIds = $savedResetNewSageIds.current
        setTimeout(savedResetNewSageIds, 2 * 1000)
    })

    const handleCardViewed = (viewedId: string) => {
        setTimeout(() => setNewSageIds(prev => prev.filter(id => id !== viewedId)), 1000)
    }

    usePusher(({event, data}) => {
        if (event === 'new') {
            const sage: ISage = data.sage

            // TODO: @sy animation for list rendering
            setSages(prev => [sage, ...prev])
            setNewSageIds(prev => [sage.id, ...prev])
            setLastTimeStamp(data.timestamp)
            $notificationService.current?.showNotification(
                formatSageAction(sage),
                formatSageNotification(sage)
            )
        }
    })

    if (!lastTimeStamp) return <FeedLoading />

    return (
        <div className="content">
            {sages.map(sage => (
                <SageCard key={sage.id}
                    sage={sage}
                    className={newSageIds.includes(sage.id) ? 'new' : ''}
                    onViewed={handleCardViewed}
                />
            ))}
        </div>
    )
}

function FeedLoading () {
    // TODO: @sy make it look nice
    return (
        <div className="loading-content">
            <div className="loading-text">Loading...</div>
        </div>
    )
}
