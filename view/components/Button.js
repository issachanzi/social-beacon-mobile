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

    const highlightAnimSv = useHighlight();
    const highlightAnimation = Rnra.useAnimatedStyle (
        () => ({
            borderWidth: 1,
            borderColor: highlightAnimSv.value
        })
    );
    const highlightStyle = highlight ? highlightAnimation : {};

    const buttonStyle = [styles.button, primaryStyle, style, highlightStyle];
    const textStyle = [styles.text, primaryStyle];

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

        borderRadius: 8,
        borderWidth: 1,
        borderColor: FG_SECONDARY,
    },

    view: {
    },

    text: {
        fontSize: 24,
        lineHeight: 24,
        height: '100%',
        textAlign: 'center',
        verticalAlign: 'middle',
    },

    primary: {
        backgroundColor: BG_PRIMARY,
        color: FG_PRIMARY
    },

    secondary: {
        backgroundColor: BG_SECONDARY,
        color: FG_SECONDARY
    },

    pressed: {
        backgroundColor: BG_SYSTEM,
    }
});

