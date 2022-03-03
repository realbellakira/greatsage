import {useEffect, useRef} from 'react'

export default function useNotification () {
    const $service = useRef<ServiceWorkerRegistration>()

    useEffect(() => {
        if (!window.Notification) return
        if (Notification.permission !== 'default') registerService()
        else Notification.requestPermission().then(registerService)
    }, [])

    function registerService () {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register(new URL('../libs/notification.service.ts', import.meta.url))
                .then(registration => {
                    console.info('Service Worker registration successful with scope:', registration.scope)
                    $service.current = registration
                }, err => {
                    console.error('Service Worker registration failed:', err)
                })
        }
    }

    return $service
}
