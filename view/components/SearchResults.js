import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {BG_PRIMARY, BG_SECONDARY, FG_PRIMARY, FG_SECONDARY} from '../Colors';
import BiPersonPlus from 'react-native-bootstrap-icons/icons/person-plus';
import BiPersonPlusFill from 'react-native-bootstrap-icons/icons/person-plus-fill';
import {usePromise, useRefresh} from '../utils/hooks';
import Keychain from 'react-native-keychain';
import User from '../../model/User';
import FriendRequest from '../../model/FriendRequest';

export default function SearchResults({ results = [], isQueryEmpty = false}) {
    const credentials = usePromise(Keychain.getGenericPassword (), {});
    const currentUserId = credentials.username;
    const currentUser = usePromise (
        User.byId (currentUserId),
        {},
        [currentUserId]
    );
    console.log ("Current user: " + JSON.stringify(currentUser));
    const [friendRequestsSent, setFriendRequestsSent] = React.useState([]);
    React.useEffect(() => {(async () => {
        const friendRequests = (await FriendRequest.all ())
            .filter (fr => fr.from.id === currentUserId);
        const result = {};

        friendRequests.forEach (fr => {
            result [fr.to.id] = true;
        });

        setFriendRequestsSent (result);
    }) (); }, [currentUserId])

    if (isQueryEmpty) {
        return (
            <Text style={styles.minorText}>
                Type above to find your friends...
            </Text>
        );
    }
    else if (results.length === 0) {
        return (
            <Text style={styles.minorText}>
                No results found.
            </Text>
        );
    }
    else {
        const handleSendFriendRequest = user => {
            const friendRequest = new FriendRequest({
                from: currentUser.id,
                to: user.id
            });

            friendRequest.save ()
                .then (noOp => {});

            setFriendRequestsSent (oldValue => {
                const newValue = {...oldValue};

                newValue [user.id] = true;

                return newValue;
            });
        };

        const handleDeleteFriendRequest = user => {
            FriendRequest.where ({
                from: currentUser.id,
                to: user.id
            }).then(friendRequests => {
                friendRequests.forEach (
                    fr => {
                        fr.destroy ()
                    }
                );
            });

            setFriendRequestsSent (oldValue => {
                const newValue = {...oldValue};

                newValue [user.id] = false;

                return newValue;
            });
        }

        return (
            <FlatList
                data={results}
                style={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.resultCard}>
                        <View style={styles.avatar} />
                        <View style={styles.details}>
                            <Text style={styles.displayName} >
                                {item.displayName}
                            </Text>
                            <Text style={styles.username}>
                                {item.username}
                            </Text>
                        </View>
                        <View style={styles.spacer} />

                            {
                                friendRequestsSent [item.id] ?
                                <TouchableOpacity onPress={
                                    () => handleDeleteFriendRequest (item)
                                }>
                                    <BiPersonPlusFill
                                        viewBox="0 0 16 16"
                                        width={32}
                                        height={32}
                                        style={styles.addIcon}
                                        fill={FG_PRIMARY}
                                    />
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={
                                    () => handleSendFriendRequest (item)
                                }>
                                    <BiPersonPlus
                                        viewBox="0 0 16 16"
                                        width={32}
                                        height={32}
                                        style={styles.addIcon}
                                        fill={FG_PRIMARY}
                                    />
                                </TouchableOpacity>
                            }
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        );
    }
}

const styles = StyleSheet.create({
    minorText: {
        marginTop: 16,

        fontSize: 16,
        color: FG_SECONDARY,
    },

    list: {
        marginTop: 8
    },

    resultCard: {
        marginTop: 8,
        height: 96,
        borderRadius: 8,
        backgroundColor: BG_SECONDARY,
        padding: 8,

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

    addIcon: {
        margin: 8,
    },

    spacer: {
        flex: 1
    }
});

