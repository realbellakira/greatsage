
import {useCallback, useEffect, useRef, DependencyList, MutableRefObject} from 'react'


export default function useCallbackRef<T extends (...args: ANY[]) => ANY> (
    callback: T, deps: DependencyList
): MutableRefObject<T> {
    const f = useCallback(callback, deps)
    const $ref = useRef(f)
    useEffect(() => {
        $ref.current = f
    }, [f])

    return $ref
}
