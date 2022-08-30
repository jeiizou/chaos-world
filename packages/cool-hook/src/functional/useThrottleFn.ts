import { throttle, ThrottleSettings } from 'lodash-es';
import { useMemo } from 'react';
import { useLatest } from '../basic/useLatest';
import { useUnmount } from '../basic/useUnmount';

type noop = (...args: any) => any;

export function useThrottleFn<T extends noop>(
    fn: T,
    options: {
        wait?: number;
    } & ThrottleSettings,
) {
    const fnRef = useLatest(fn);
    const wait = options?.wait ?? 1000;

    const throttled = useMemo(
        () =>
            throttle(
                (...args: Parameters<T>): ReturnType<T> => {
                    return fnRef.current(...(args as any[]));
                },
                wait,
                options,
            ),
        [],
    );

    useUnmount(() => {
        throttled.cancel();
    });

    return {
        run: throttled,
        cancel: throttled.cancel,
        flush: throttled.flush,
    };
}
