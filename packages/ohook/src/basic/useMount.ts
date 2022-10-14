import { useEffect, useState } from 'react';

export function useMount(fn: () => any) {
    useEffect(() => {
        fn?.();
    }, []);
}
