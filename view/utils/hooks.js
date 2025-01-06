import React from "react";

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

export function useRefresh () {
    const [state, setState] = React.useState(0);

    return () => setState(n => n + 1);
}

