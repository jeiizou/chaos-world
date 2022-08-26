import { useEffect, useMemo, useState } from 'react';

export interface UseMoveConfig {
    container: HTMLElement | string;
    handle: HTMLElement | string;
}

function getTarget(target: HTMLElement | string): HTMLElement | null {
    if (typeof target === 'string') {
        const domTarget = document.querySelector(target);
        if (!domTarget) {
            console.warn('[cool-hooks]:', 'no target element');
        }
        return domTarget as HTMLElement;
    } else {
        return target;
    }
}

export function useMove(config: UseMoveConfig) {
    const [position, serPosition] = useState([0, 0]);

    const containerHandler = useMemo(
        () => getTarget(config.container),
        [config.container],
    );

    const handleHandler = useMemo(
        () => getTarget(config.handle),
        [config.container],
    );

    const startMove = () => {
        console.log('mouse down !');
    };

    const endMove = () => {
        console.log('mouse up !');
    };

    useEffect(() => {
        handleHandler?.addEventListener('mousedown', startMove);
        handleHandler?.addEventListener('mouseup', endMove);

        return () => {
            handleHandler?.removeEventListener('mousedown', startMove);
            handleHandler?.removeEventListener('mouseup', endMove);
        };
    }, [containerHandler, handleHandler]);

    return {
        position,
    };
}
