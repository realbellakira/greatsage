
import {useEffect} from 'react'


export default function useVisibilityChange (callback: () => void) {
    useEffect(() => {
        document.addEventListener('visibilitychange', callback)
        return () => {
            document.removeEventListener('visibilitychange', callback)
        }
    }, [])
}
