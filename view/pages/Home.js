import React from "react";

import NavBar from '../components/NavBar';
import TimeSelect from '../components/TimeSelect';
import Button from '../components/Button';
import BeaconCard from '../components/BeaconCard.js';

import Beacon from "../../model/Beacon";
import RestEasy from "../../model/RestEasy";
import {usePoll, usePromise} from "../utils/hooks";
import {useNavigation} from '@react-navigation/core';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Keychain from 'react-native-keychain';
import {FG_SECONDARY} from '../Colors';
import BiPersonAdd from 'react-native-bootstrap-icons/icons/person-plus';
import FriendRequestCard from '../components/FriendRequestCard';
import FriendRequest from '../../model/FriendRequest';

const BEACONS_POLL_INTERVAL_MILLIS = 10_000;
const FRIEND_REQUESTS_POLL_INTERVAL_MILLIS = 10_000;

export default function Home () {

    const navigation = useNavigation ();
    const [isBeaconActive, setIsBeaconActive] = React.useState(false);

    const beaconsPromise = usePoll (
        Beacon.all, BEACONS_POLL_INTERVAL_MILLIS,
        new Promise(resolve => resolve ([])),
        []
    );
    const beacons = usePromise(beaconsPromise, [], [beaconsPromise]);

    const selectedTimeRef = React.useRef(Date.now());

    // const currentUserId = localStorage.getItem('currentUserId');
    const credentials = usePromise (Keychain.getGenericPassword ());
    const currentUserId = credentials !== null ? credentials.username : null;
    React.useEffect (() => {
        if (credentials === false) {
            navigation.replace ('LoginPage');
        }
        else if (credentials !== null) {
            RestEasy.instance.authorization = credentials.password;
        }
    }, [credentials]);

    const friendRequestsPromise = usePoll(
        () => FriendRequest.where ({to: currentUserId}),
        FRIEND_REQUESTS_POLL_INTERVAL_MILLIS,
        new Promise(resolve => resolve ([])),
        [currentUserId]
    );
    const friendRequests = usePromise(
        friendRequestsPromise,
        [],
        [friendRequestsPromise]
    );
    // const friendRequests = [new FriendRequest ({
    //     from: currentUserId,
    //     to: currentUserId,
    //     id: currentUserId}
    // )];

    const sendBeacon = formData => {
        setIsBeaconActive (true);
        const beacon = new Beacon ({
            sender: currentUserId,
            timestamp: selectedTimeRef.current
        });
        beacon.save ().catch(err => setIsBeaconActive(false));
    };

    let beaconCards;
    if (beacons.length === 0) {
        beaconCards = (
            <Text style={[styles.text, {marginTop: 8}]}>
                None of your friends have a beacon active right now. Maybe you should send one yourself...
            </Text>
        );
    }
    else {
        beaconCards = beacons.map (beacon => (
            <BeaconCard beacon={beacon} key={beacon.id} />
        ))
    }

    return (
        <View>
            <NavBar
                backButton={false}
                iconRight={BiPersonAdd}
                actionRight={() => navigation.navigate ('SearchFriendPage')}
            />
            <ScrollView style={styles.main}>
                <TimeSelect valueRef={selectedTimeRef} />
                <Button text="Send" onClick={sendBeacon} isPrimary={true} style={{marginTop: 8}} />
                <View style={{marginTop: 8}}>
                    {friendRequests.map (
                        fr => <FriendRequestCard friendRequest={fr} key={fr.id} />
                    )}
                    {beaconCards}
                </View>
            </ScrollView>
        </View>
    );

    // return <Text style={{color: 'white'}}>Hello, world!</Text>;
}

const styles = StyleSheet.create({
    main: {
        padding: 8
    },

    text: {
        fontSize: 16,
        color: FG_SECONDARY
    }
})


