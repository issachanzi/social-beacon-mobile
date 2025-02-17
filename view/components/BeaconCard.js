import React from 'react';
import {absoluteTime, relativeTime} from "../utils/timeFormat";
import {usePromise} from "../utils/hooks";

import {Pressable, StyleSheet, Text, View} from 'react-native';
import BiHeart from 'react-native-bootstrap-icons/icons/heart';
import BiHeartFill from 'react-native-bootstrap-icons/icons/heart-fill';
import {BG_PRIMARY, BG_SECONDARY, FG_PRIMARY, FG_SECONDARY} from '../Colors';
import BeaconResponse from '../../model/BeaconResponse';

export default function BeaconCard ({ beacon, currentUser, style }) {
    const sender = usePromise (beacon.sender);

    const [responses, setResponses] = React.useState ([]);
    const isResponded = responses.length !== 0;

    React.useEffect(() => {
        BeaconResponse.where ({beacon: beacon.id}).then (setResponses);
    }, []);

    const toggleResponse = () => {
        if (isResponded) {
            responses.forEach (response => response.destroy ());

            setResponses([]);
        }
        else {
            const response = new BeaconResponse ({
                beacon: beacon,
                user: currentUser
            });

            response.save ().then ();

            setResponses([response]);
        }
    }

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
            <Pressable style={styles.heart} onPress={toggleResponse}>
                {
                    isResponded ?
                    <BiHeartFill
                        viewBox="0, 0, 16, 16"
                        width={24}
                        height={24}
                        style={styles.icon}
                        fill={FG_PRIMARY}
                    /> :
                    <BiHeart
                        viewBox="0, 0, 16, 16"
                        width={24}
                        height={24}
                        style={styles.icon}
                        fill={FG_PRIMARY}
                    />
                }
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
        flexDirection: 'column',
        alignSelf: 'flex-start',
    },

    displayName: {
        fontSize: 32,
        height: 32,
        lineHeight: 32,

        color: FG_PRIMARY
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

        color: FG_SECONDARY
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

