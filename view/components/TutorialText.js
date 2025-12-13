import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AnimatedViewCollection from './AnimatedViewCollection';
import {FG_PRIMARY} from '../Colors';


export default function TutorialText({ lines=[], onDone = () => {} }) {
    const [sliceIdx, setSliceIdx] = React.useState(1);

    React.useEffect(() => {
        if (sliceIdx < lines.length) {
            setTimeout(() => {
                setSliceIdx(sliceIdx + 1);
            }, 2000);
        }
        else {
            setTimeout(() => {
                onDone();
            }, 5000)
        }
    }, [sliceIdx]);

    React.useEffect(() => {
        setSliceIdx(1);
    }, [lines]);

    const displayLines = lines.slice(0, sliceIdx).map(
        (line, i) => ({
            element: (
                <View key={line} style={styles.textContainer}>
                    <Text style={styles.text}>
                        {line}
                    </Text>
                </View>
            ),
            key: line
        })
    );

    return (
        <View style={styles.main}>
            <View style={styles.topHalf} />
            <View style={styles.bottomHalf}>
                <AnimatedViewCollection items={displayLines} slide={false} />
            </View>
        </View>
    );
}

const vh = Dimensions.get('window').height / 100;

const styles = StyleSheet.create({
    main: {
        position: 'absolute',
        width: '100%',
        height: 100 * vh,
        zIndex: -1,
        elevation: -1
    },
    topHalf: {
        flex: 2
    },
    bottomHalf: {
        flex: 2
    },
    text: {
        color: FG_PRIMARY,
        fontSize: 18
    },
    textContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    }
})

