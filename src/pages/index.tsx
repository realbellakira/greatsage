
import {useEffect, useState} from 'react'
import usePusher from 'src/libs/usePusher'

import type {ISage} from 'src/libs/sage'
import SageCard from 'src/components/SageCard'


export default function Index () {
    const [lastTimeStamp, setLastTimeStamp] = useState('')
    const [sages, setSages] = useState<ISage[]>([])

    useEffect(() => {
        fetch('/api/relay').then(r => r.json()).then(({timestamp, value}) => {
            setSages(value.reverse())
            setLastTimeStamp(timestamp)
        })
    }, [])

    usePusher(({event, data}) => {
        if (event === 'new') {
            alert(JSON.stringify(data))
        }
    })


    return (
        <div>
            {/* <aside>Last Updated: {lastTimeStamp}</aside> */}
            <div className="feed-card">
                {!lastTimeStamp
                    ? <FeedLoading />
                    : (
                        <div className="content">
                            {sages.map(sage => (
                                <SageCard key={sage.id} sage={sage} />
                            ))}
                        </div>
                    )
                }
            </div>
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
