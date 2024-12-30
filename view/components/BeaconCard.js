import React from 'react';
import {absoluteTime, relativeTime} from "../utils/timeFormat";
import {usePromise} from "../utils/hooks";

import {Pressable, StyleSheet, Text, View} from 'react-native';
import BiHeart from 'react-native-bootstrap-icons/icons/heart'
import {BG_PRIMARY, BG_SECONDARY, FG_PRIMARY} from '../Colors';

export default function BeaconCard ({ beacon, style }) {
    const sender = usePromise (beacon.sender);

    if (sender == null) {
        return <></>;
    }

    return (
        <View style={[styles.BeaconCard, style]} >
            <View style={styles.avatar} />
            <View style={styles.details}>
                <Text style={styles.displayName}>
                    {sender.displayName}
                </Text>
                <Text style={styles.absoluteTime}>
                    {absoluteTime (beacon.timestamp)}
                </Text>
                <Text style={styles.relativeTime}>
                    {relativeTime (beacon.timestamp)}
                </Text>
            </View>
            <View style={styles.spacer} />
            <Pressable style={styles.heart}>
                <BiHeart
                    viewBox="0, 0, 16, 16"
                    width={24}
                    height={24}
                    style={styles.icon}
                    fill={FG_PRIMARY}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    BeaconCard: {
        marginTop: 8,
        height: 104,
        borderRadius: 8,
        backgroundColor: BG_SECONDARY,

        display: 'flex',
        flexDirection: 'row'
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: BG_PRIMARY,
        margin: 8
    },

    details: {
        marginTop: 8,
        marginLeft: 8,

        display: 'flex',
        flexDirection: 'column'
    },

    displayName: {
        fontSize: 32,
        height: 32,
        lineHeight: 32,

        color: FG_PRIMARY,
        fontWeight: 'bold'
    },

    absoluteTime: {
        marginTop: 8,
        fontSize: 32,
        lineHeight: 32,
        height: 32,

        color: FG_PRIMARY
    },

    relativeTime: {
        marginTop: 0,
        fontSize: 16,
        lineHeight: 16,
        height: 16,

        color: FG_PRIMARY
    },

    spacer: {
        flex: 1
    },

    heart: {
        margin: 16,
        width: 32,
        height: 32,

        justifySelf: 'flex-end',
        alignSelf: 'center'
    }
})

