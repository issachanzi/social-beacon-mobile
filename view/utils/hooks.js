import React from "react";
import {FG_HIGHIGHT, FG_PRIMARY} from '../Colors';
import * as Rnra from 'react-native-reanimated';
import {withTiming} from 'react-native-reanimated';

export function usePromise (promise, defaultValue = null, deps = [], debug = false) {
    const [state, setState] = React.useState(defaultValue);
    React.useDebugValue(state);
    React.useEffect(() => {
        if (promise !== undefined && promise !== null) {
            promise.then (result => {
                setState(result);
            }).catch (err => {
                console.log (err);
            });
        }
    }, deps)

    return state;
}

export function usePoll (
    pollFunction,
    pollIntervalMillis,
    defaultValue = null,
    deps = []
) {
    const [cachedResult, setCachedResult] = React.useState(defaultValue);
    const [shouldPollAgain, setShouldPollAgain] = React.useState(false);

    React.useEffect(() => {
        if (shouldPollAgain) {
            setShouldPollAgain(false);

            const newResult = pollFunction ();
            setCachedResult(newResult);

            if (pollIntervalMillis !== null) {
                setTimeout(() => {
                    setShouldPollAgain(true);
                }, pollIntervalMillis);
            }
        }
    }, [shouldPollAgain, pollFunction, pollIntervalMillis]);

    React.useEffect (() => {
        setShouldPollAgain (true);
    }, deps);

    return cachedResult;
}

export function useRefresh () {
    const [state, setState] = React.useState(0);

    return () => setState(n => n + 1);
}

export function useHighlight () {
    const anim = Rnra.useSharedValue (FG_HIGHIGHT);

    React.useEffect(() => {
        anim.value = Rnra.withRepeat(
            withTiming (
                FG_PRIMARY,
                {
                    duration: 1000
                }
            ),
            0,
            true
        );
    }, []);

    return anim;
}

