import { useEffect } from 'react';

export function useMount(fn: () => any) {
    useEffect(() => {
        fn?.();
    }, []);
}
