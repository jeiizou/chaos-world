import { debounce, DebounceSettings } from 'lodash-es';
import { useMemo } from 'react';
import { useLatest } from './useLatest';
import { useUnmount } from './useUnmount';

type noop = (...args: any) => any;

export function useSmoothFn<T extends noop>(
    fn: T,
    options: {
        wait?: number;
    } & DebounceSettings,
) {
    const fnRef = useLatest(fn);

    // TODO
}
