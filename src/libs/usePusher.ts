
import Pusher from 'pusher-js'
import {useEffect} from 'react'

import {PUSHER_KEY} from 'src/libs/settings'


export default function usePusher () {
    useEffect(() => {
        Pusher.logToConsole = true

        const pusher = new Pusher(PUSHER_KEY, {
            cluster: 'mt1',
        })

        const channel = pusher.subscribe('sage')
        channel.bind('new', (data: ANY) => {
            alert(JSON.stringify(data))
        })

        return () => {
            pusher.unbind_all()
        }
    }, [])
}
