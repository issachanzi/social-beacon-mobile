import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BG_PRIMARY, BG_SECONDARY, FG_PRIMARY, FG_SECONDARY} from '../Colors';
import BiPersonCheck from 'react-native-bootstrap-icons/icons/person-check';
import BiPersonCheckFill from 'react-native-bootstrap-icons/icons/person-check-fill';
import React from 'react';
import {usePromise} from '../utils/hooks';

export default function FriendRequestCard({friendRequest, onAccept = () => {}}) {
    const [accepted, setAccepted] = React.useState(false);

    const from = usePromise (
        friendRequest.from,
        null,
        [friendRequest]
    );

    const handleAccept = () => {
        setAccepted (true);
        friendRequest.accept ();
        onAccept ();
    }

    if (from === null) {
        return <></>;
    }

    return (
        <View style={styles.main}>
            <View style={styles.avatar} />
            <View style={styles.details}>
                <Text style={styles.displayName} >
                    {from.displayName}
                </Text>
                <Text style={styles.username}>
                    {from.username}
                </Text>
                <Text style={styles.caption}>
                    wants to be friends
                </Text>
            </View>
            <View style={styles.spacer} />

            {
                accepted ?
                <BiPersonCheckFill
                    viewBox="0 0 16 16"
                    width={32}
                    height={32}
                    style={styles.addIcon}
                    fill={FG_PRIMARY}
                /> :
                <TouchableOpacity onPress={handleAccept}>
                    <BiPersonCheck
                        viewBox="0 0 16 16"
                        width={32}
                        height={32}
                        style={styles.addIcon}
                        fill={FG_PRIMARY}
                    />
                </TouchableOpacity>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        marginTop: 8,
        height: 96,
        borderRadius: 8,
        backgroundColor: BG_SECONDARY,
        padding: 8,

        borderColor: FG_SECONDARY,
        borderWidth: 1,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: '50%',

        backgroundColor: BG_PRIMARY
    },

    details: {
        marginLeft: 16,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    displayName: {
        height: 32,
        fontSize: 32,
        lineHeight: 32,

        color: FG_PRIMARY
    },

    username: {
        height: 16,
        fontSize: 16,
        lineHeight: 16,

        color: FG_PRIMARY
    },

    caption: {
        marginTop: 8,
        height: 16,
        fontSize: 16,
        lineHeight: 16,
        verticalAlign: 'bottom',

        color: FG_SECONDARY
    },

    spacer: {
        flex: 1
    },

    addIcon: {
        margin: 8,
    },
})

