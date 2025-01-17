import React from "react";
import {FG_HIGHIGHT, FG_PRIMARY} from '../Colors';
import * as Rnra from 'react-native-reanimated';
import {withTiming} from 'react-native-reanimated';
import {asyncStorage} from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePromise (promise, defaultValue = null, deps = []) {
    const [state, setState] = React.useState(defaultValue);
    React.useEffect(() => {
        if (promise !== undefined && promise !== null) {
            promise.then (setState).catch (err => {
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

export function useAsyncPoll (
    pollFunction,
    pollIntervalMillis,
    defaultValue = null,
    deps = []
) {
    const promise = usePoll (
        pollFunction,
        pollIntervalMillis,
        new Promise (resolve => resolve (defaultValue))
    );

    return usePromise(promise, defaultValue, deps);
}

export function useAsyncStoragePoll (
    pollFunction,
    pollIntervalMillis,
    defaultValue = null,
    storageKey,
    saveFunction = JSON.stringify,
    loadFunction = JSON.parse,
    deps = []
) {
    const promise = usePoll (
        pollFunction,
        pollIntervalMillis,
        async () => {
            const storageValue = await AsyncStorage.getItem (storageKey);

            if (storageValue !== null) {
                const value = await loadFunction(storageValue);

                return value;
            }
            else {
                return defaultValue;
            }
        },
        deps
    );

    const result = usePromise(promise, defaultValue, [promise]);

    React.useEffect (() => {
        (async () => {
            const storageValue = await saveFunction (result);

            await AsyncStorage.setItem(storageKey, storageValue);
        }) ();
    }, [result])

    return result;
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

