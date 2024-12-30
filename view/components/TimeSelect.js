import React from 'react';

import {absoluteTime, relativeTime} from "../utils/timeFormat";
import {Pressable, StyleSheet, Text, View} from 'react-native';

import BiDashLg from 'react-native-bootstrap-icons/icons/dash-lg';
import BiPlusLg from 'react-native-bootstrap-icons/icons/plus-lg';
import {BG_PRIMARY, FG_PRIMARY} from '../Colors';

export default function TimeSelect({ valueRef }) {
    const input = React.useRef ();
    const [ value, setValue ] = React.useState (null);
    valueRef.current = value !== null ? value : new Date ();

    const incrementValue = () => {
        setValue (value => {
            if (value === null || value.getTime() <= Date.now()) {
                const date = new Date ();

                const unixMillis = date.getTime();
                const unixMinutes = unixMillis / 1000 / 60 + 1;
                const roundedUnixMinutes = Math.ceil(unixMinutes / 15) * 15;

                date.setTime(roundedUnixMinutes * 60 * 1000);

                return date;
            }
            else {
                const incrementAmount = 15 * 60 * 1000;
                const unixMillis = value.getTime();
                const date = new Date ();

                date.setTime (unixMillis + incrementAmount);

                return date;
            }
        });
    };

    const decrementValue = () => {
        setValue (value => {
            if (value === null) {
                return null;
            }
            else {
                const decrementAmount = 15 * 60 * 1000;
                const unixMillis = value.getTime();
                const date = new Date ();

                date.setTime (unixMillis - decrementAmount);

                if (date.getTime() <= Date.now()) {
                    return null;
                }
                else {
                    return date;
                }
            }
        });
    };

    return (
        <View style={styles.TimeSelect}>
            <Pressable onPress={decrementValue} style={styles.spinBtn}>
                <BiDashLg
                    viewBox="0, 0, 16, 16"
                    width={32}
                    height={32}
                    style={styles.icon}
                    fill={FG_PRIMARY}
                />
            </Pressable>
            <View style={styles.display} >
                <Text style={styles.absoluteTime}>
                    {absoluteTime (value)}
                </Text>
                <Text style={styles.relativeTime}>
                    {relativeTime (value)}
                </Text>
            </View>
            <Pressable onPress={incrementValue} style={styles.spinBtn}>
                <BiPlusLg
                    viewBox="0, 0, 16, 16"
                    width={32}
                    height={32}
                    style={styles.icon}
                    fill={FG_PRIMARY}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    TimeSelect: {
        marginTop: 8,

        backgroundColor: BG_PRIMARY,
        height: 80,
        borderRadius: 8,

        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'stretch'
    },

    absoluteTime: {
        height: 32,
        fontSize: 32,
        lineHeight: 32,
        marginTop: 16,
        textAlign: 'center',

        color: FG_PRIMARY
    },

    relativeTime: {
        height: 16,
        fontSize: 16,
        lineHeight: 16,
        marginTop: 0,
        textAlign: 'center',

        color: FG_PRIMARY
    },

    spinBtn: {
        margin: 16,
        width: 48,
        height: 48,
        verticalAlign: 'middle'
    },

    icon: {
        margin: 'auto'
    },

    display: {}
});

