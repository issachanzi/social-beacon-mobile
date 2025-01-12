import React from 'react';

import {absoluteTime, relativeTime} from "../utils/timeFormat";
import {Pressable, StyleSheet, Text, View} from 'react-native';

import BiDashLg from 'react-native-bootstrap-icons/icons/dash-lg';
import BiPlusLg from 'react-native-bootstrap-icons/icons/plus-lg';
import {BG_PRIMARY, FG_HIGHIGHT, FG_PRIMARY, FG_SECONDARY} from '../Colors';

export default function TimeSelect({
       valueRef,
       disabled = false,
       highlight = false,
       initialValue = null
}) {
    const [ value, setValue ] = React.useState (null);
    valueRef.current = value !== null ? value : new Date ();

    React.useEffect(() => {
        valueRef.current = value;

        valueRef.current && console.log ("valueRef: " + valueRef.current.toString ());
    }, [value]);

    React.useEffect(() => {
        setValue (initialValue);
    }, [initialValue]);

    const incrementValue = () => {
        if (disabled) {
            return;
        }

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
        if (disabled) {
            return;
        }

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

    const highlightStyle = highlight ? {
        borderWidth: 2,
        borderColor: FG_HIGHIGHT
    } : {};

    return (
        <View style={[styles.TimeSelect, highlightStyle]}>
            <Pressable onPress={decrementValue} style={styles.spinBtn}>
                {disabled ? <></> :
                    <BiDashLg
                        viewBox="0, 0, 16, 16"
                        width={32}
                        height={32}
                        style={styles.icon}
                        fill={FG_PRIMARY}
                    />
                }
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
                {disabled ? <></> :
                    <BiPlusLg
                        viewBox="0, 0, 16, 16"
                        width={32}
                        height={32}
                        style={styles.icon}
                        fill={FG_PRIMARY}
                    />
                }
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

