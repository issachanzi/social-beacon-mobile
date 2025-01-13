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

    const highlightStyle = highlight ? {
        borderColor: FG_HIGHIGHT,
        borderWidth: 2,
    } : {};

    const buttonStyle = [styles.button, primaryStyle, style, highlightStyle];
    const viewStyle = [styles.view, primaryStyle];
    const textStyle = [styles.text, primaryStyle];

    return (
        <TouchableOpacity onPress={onClick} style={buttonStyle}>
            <View style={viewStyle}>
                <Text style={textStyle}>
                    {text}
                </Text>
            </View>
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

