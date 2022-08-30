import { debounce, DebounceSettings } from 'lodash-es';
import { useEffect, useMemo, useRef } from 'react';
import { useLatest } from '../basic/useLatest';
import { useUnmount } from '../basic/useUnmount';

type noop = (...args: any) => any;

const rafThrottle = (callback: noop) => {
    let requestId: number | null = null;

    let lastArgs: any;

    const later = (context: any) => () => {
        requestId = null;
        callback.apply(context, lastArgs);
    };

    const throttled = function (this: any, ...args: Parameters<any>) {
        lastArgs = args;
        if (requestId === null) {
            requestId = requestAnimationFrame(later(this));
        }
    };

    throttled.cancel = () => {
        if (requestId) {
            cancelAnimationFrame(requestId);
        }
        requestId = null;
    };

    return throttled;
};

export function useSmoothFn<T extends noop>(fn: T) {
    const fnRef = useLatest(fn);

    const throttled = useMemo(
        () =>
            rafThrottle((...args: Parameters<T>): ReturnType<T> => {
                return fnRef.current(...(args as any[]));
            }),
        [],
    );

    useUnmount(() => {
        throttled.cancel();
    });

    return {
        run: throttled,
        cancel: throttled.cancel,
    };
}
