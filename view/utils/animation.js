import {Animated} from 'react-native';

export function suvatIn (anim, toValue, duration) {
    const animation = Animated.timing (
        anim,
        {
            toValue: 1,
        }
    );
}

