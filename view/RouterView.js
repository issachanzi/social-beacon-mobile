import {Router} from './Router';
import {createTransition, SlideLeft, SlideRight} from 'react-native-transition';
import React from 'react';
import {Animated} from 'react-native';

export default function RouterView({ router }) {
    const [ oldView, newView, direction ] = router.use ();

    const Transition = React.useMemo (() => {
        const animateFunc = (value, config) => Animated.spring (
            value,
            {
                ...config,
                speed: 20,
                bounciness: 3
            }
        );

        return createTransition(SlideLeft, animateFunc);
    }, []);

    React.useEffect(() => {
        if (direction === Router.FORWARD) {
            Transition.show (newView, SlideLeft);
        }
        else if (direction === Router.BACK) {
            Transition.show (newView, SlideRight);
        }
    });

    return (
        <Transition>
            {oldView}
        </Transition>
    );
}

