import React from "react";

export function usePromise (promise, defaultValue = null) {
    const [state, setState] = React.useState(defaultValue);
    React.useEffect(() => {
        if (promise !== undefined && promise !== null) {
            promise.then(setState);
        }
    }, [promise])

    return state;
}

export function usePoll (pollFunction, pollIntervalMillis) {
    const [cachedResult, setCachedResult] = React.useState();
    const [shouldPollAgain, setShouldPollAgain] = React.useState(true);

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

    return cachedResult;
}

