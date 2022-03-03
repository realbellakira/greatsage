/// <reference lib="webworker" />

declare var self: ServiceWorkerGlobalScope

try {
    self.addEventListener('notificationclick', (e: ANY) => {
        console.info('click', e)
        const notification: Notification = e.notification
        notification.close()

        e.waitUntil(self.clients.matchAll({type: 'window'}).then(clientsArr => {
            const hadWindowToFocus = clientsArr.some(
                // tslint:disable-next-line: ban-comma-operator
                windowClient => windowClient.url === notification.data.url ? (windowClient.focus(), true) : false
            )
            if (!hadWindowToFocus) {
                self.clients.openWindow(e.notification.data.url).then(windowClient => windowClient?.focus())
            }
        }))
    })

    console.info('Notification Service Installed!')
} catch (error) {
    console.error(error)
}

export {}
