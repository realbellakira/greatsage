
import Pusher from 'pusher-js'
import {useEffect} from 'react'

import {PUSHER_KEY} from 'src/libs/settings'


type IEventType = 'new'

type IEventHandler = ({event, data}: {
    event: IEventType
    data: ANY
}) => void

export default function usePusher (onMessage: IEventHandler) {
    useEffect(() => {
        Pusher.logToConsole = !true

        const pusher = new Pusher(PUSHER_KEY, {
            cluster: 'mt1',
        })

        const channel = pusher.subscribe('sage')

        channel.bind('new', (data: ANY) => onMessage({
            event: 'new',
            data,
        }))

        return () => {
            pusher.unbind()
            pusher.disconnect()
        }
    }, [])
}
