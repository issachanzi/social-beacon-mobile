import BeaconResponseCard from './BeaconResponseCard';
import FriendRequestCard from './FriendRequestCard';
import BeaconCard from './BeaconCard';
import {StyleSheet, Text, View} from 'react-native';
import AnimatedViewCollection from './AnimatedViewCollection';
import React from 'react';
import {FG_SECONDARY} from '../Colors';
import {usePromise} from '../utils/hooks';
import Keychain from 'react-native-keychain';
import RestEasy from '../../model/RestEasy';
import User from '../../model/User';

export default function Feed({responses, friendRequests, beacons, onHeart = undefined}) {
    const currentUser = useCurrentUser();

    const items = [].concat(
        responses.map(r => ({
            element: <BeaconResponseCard beaconResponse={r} key={r.id}/>,
            key: r.id,
        })),
        friendRequests.map(fr => ({
            element: <FriendRequestCard friendRequest={fr} key={fr.id}/>,
            key: fr.id,
        })),
        beacons.map(beacon => ({
            element: (
                <BeaconCard beacon={beacon} currentUser={currentUser} key={beacon.id} onHeart={onHeart} />
            ),
            key: beacon.id,
        })),
    );

    return (
        <View style={{marginTop: 8}}>
            <AnimatedViewCollection items={items}/>
            {beacons.length === 0 ? (
                <Text style={[styles.text, {marginTop: 8}]}>
                    None of your friends have a beacon active right now. Maybe you should
                    send one yourself...
                </Text>
            ) : (
                <></>
            )}
        </View>
    );
}

function useCurrentUser () {
    const credentials = usePromise(Keychain.getGenericPassword());
    const [currentUserId, setCurrentUserId] = React.useState(null);
    React.useEffect(() => {
        if (credentials) {
            setCurrentUserId(credentials.username);
            RestEasy.instance.authorization = credentials.password;
        }
    }, [credentials]);

    const user = usePromise(
        currentUserId && User.byId(currentUserId) || new Promise(r => r(null)),
        null,
        [currentUserId]
    );

    return user;
}

const styles = StyleSheet.create({
    main: {
        padding: 8,
    },

    text: {
        fontSize: 16,
        color: FG_SECONDARY,
    },
});
