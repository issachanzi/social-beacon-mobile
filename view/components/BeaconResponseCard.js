import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {usePromise} from '../utils/hooks';
import {BG_PRIMARY, BG_SECONDARY, FG_PRIMARY, FG_SECONDARY} from '../Colors';

export default function BeaconResponseCard ({ beaconResponse }) {
    const user = usePromise (beaconResponse.user, {}, [beaconResponse]);

    return (
        <View style={styles.main} >
            <View style={styles.avatar} />
            <View style={styles.details}>
                <Text style={styles.displayName}>
                    {user.displayName}
                </Text>
                <Text style={styles.caption}>
                    responded to your beacon
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        marginTop: 8,
        height: 96,
        borderRadius: 8,
        backgroundColor: BG_SECONDARY,

        borderColor: FG_SECONDARY,
        borderWidth: 1,

        display: 'flex',
        flexDirection: 'row',

        justifyContent: 'flex-start',
        alignItems: 'center'
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

        color: FG_PRIMARY
    },

    caption: {
        marginTop: 8,
        fontSize: 16,
        lineHeight: 16,
        height: 16,

        color: FG_SECONDARY
    }
})

