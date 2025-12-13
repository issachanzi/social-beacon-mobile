import {
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableOpacity,
    TouchableWithoutFeedback, View,
} from 'react-native';
import {useState} from 'react';
import {BG_PRIMARY, BG_SECONDARY, BG_SYSTEM, FG_HIGHIGHT, FG_PRIMARY, FG_SECONDARY} from '../Colors';
import {useHighlight} from '../utils/hooks';
import * as Rnra from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

export default function Button ({
        text,
        onClick,
        isPrimary = false,
        highlight = false,
        style
}) {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => setIsPressed (true);
    const handlePressOut = () => setIsPressed (false);
    const handlePress = onClick;

    const shadowOpacity = isPressed ? 0 : 1;
    const shadowStyle = StyleSheet.compose(styles.shadow, {shadowOpacity});

    const primaryStyle = StyleSheet.compose (
        isPrimary ? styles.primary : styles.secondary
    );

    const fgStyle = StyleSheet.compose (
        isPrimary ? styles.primaryFg : styles.secondaryFg
    );

    const highlightAnimSv = useHighlight();
    const highlightStyle = Rnra.useAnimatedStyle (
        () => ({
            borderWidth: 1,
            borderColor: highlight ? highlightAnimSv.value : FG_SECONDARY
        })
    );

    const buttonStyle = [styles.button, primaryStyle, style, highlightStyle];
    const textStyle = [styles.text, fgStyle];

    return (
        <TouchableOpacity onPress={onClick}>
            <Animated.View style={buttonStyle}>
                <Text style={textStyle}>
                    {text}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create ({
    button: {
        marginTop: 16,
        overflow: 'hidden',
        height: 40,

        justifyContent: 'center',

        borderRadius: 8,
        borderWidth: 1,
        borderColor: FG_SECONDARY,
    },

    view: {
    },

    text: {
        fontSize: 24,
        lineHeight: 24,
        textAlign: 'center',
        verticalAlign: 'middle',
    },

    primary: {
        backgroundColor: BG_PRIMARY
    },

    secondary: {
        backgroundColor: BG_SECONDARY
    },

    primaryFg: {
        color: FG_PRIMARY
    },

    secondaryFg: {
        color: FG_SECONDARY
    },

    pressed: {
        backgroundColor: BG_SYSTEM,
    }
});

