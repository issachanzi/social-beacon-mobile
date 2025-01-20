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
import User from '../../model/User';
import BeaconResponse from '../../model/BeaconResponse';
import BeaconResponseCard from '../components/BeaconResponseCard';
import AnimatedViewCollection from '../components/AnimatedViewCollection';

const POLL_INTERVAL_MILLIS = 5_000;

export default function Home () {

    const navigation = useNavigation ();
    const [isBeaconActive, setIsBeaconActive] = React.useState(false);

    const beaconsPromise = usePoll (
        async () => {
            const allBeacons = await Beacon.all ();
            const filter = await Promise.all (
                allBeacons.map (
                    async beacon => (await beacon.sender).id !== currentUserId
                )
            );

            return allBeacons.filter ((beacon, index) => filter [index]);
        },
        POLL_INTERVAL_MILLIS,
        new Promise(resolve => resolve ([])),
        []
    );
    const beacons = usePromise(beaconsPromise, [], [beaconsPromise]);

    const [activeBeacon, setActiveBeacon] = React.useState(null);
    const isActiveBeacon = activeBeacon !== null;

    const selectedTimeRef = React.useRef(new Date());

    // const currentUserId = localStorage.getItem('currentUserId');

    const credentials = usePromise (Keychain.getGenericPassword ());
    const [currentUserId, setCurrentUserId] = React.useState (null);
    const currentUser = usePromise(
        User.byId(currentUserId),
        null,
        [currentUserId]
    );

    React.useEffect (() => {
        if (credentials === false) {
            navigation.replace ('LoginPage');
        }
        else if (credentials !== null) {
            setCurrentUserId (credentials.username);
            RestEasy.instance.authorization = credentials.password;
        }
    }, [credentials]);

    React.useEffect(() => {
        Beacon.where ({sender: currentUserId}).then (b => {
            if (b.length > 0) {
                const activeBeacon = b[0];

                setActiveBeacon (activeBeacon);
            }
        })
    }, [currentUserId]);

    const friendRequestsPromise = usePoll(
        () => FriendRequest.where ({to: currentUserId}),
        POLL_INTERVAL_MILLIS,
        new Promise(resolve => resolve ([])),
        [currentUserId]
    );
    const friendRequests = usePromise(
        friendRequestsPromise,
        [],
        [friendRequestsPromise]
    );

    const responsesPromise = usePoll (
        async () => {
            if (activeBeacon === null) {
                return [];
            }
            else {
                const allResponses = await BeaconResponse.all ();

                const filteredResponses = [];
                for (const response of allResponses) {
                    const responseBeacon = await response.beacon;
                    if (responseBeacon.id === activeBeacon.id) {
                        filteredResponses.push(response);
                    }
                }

                return filteredResponses;
            }
        },
        POLL_INTERVAL_MILLIS,
        new Promise (resolve => resolve ([]))
    );
    const responses = usePromise(responsesPromise, [], [responsesPromise]);

    const cancelBeacon = () => {
        activeBeacon.destroy ();

        selectedTimeRef.current = new Date ();

        setActiveBeacon (null);
    }

    const sendBeacon = () => {
        const beacon = new Beacon ({
            sender: currentUserId,
            timestamp: selectedTimeRef.current
        });
        beacon.save ().then ();

        setActiveBeacon (beacon);
    };

    const items = [].concat (
        responses.map (
            r => ({
                element: <BeaconResponseCard beaconResponse={r} key={r.id} />,
                key: r.id
            })
        ),
        friendRequests.map (
            fr => ({
                element: <FriendRequestCard friendRequest={fr} key={fr.id}/>,
                key: fr.id
            })
        ),
        beacons.map (beacon => ({
                element: (
                    <BeaconCard
                        beacon={beacon}
                        currentUser={currentUser}
                        key={beacon.id}
                    />),
                key: beacon.id
            }))
    );

    return (
        <View>
            <NavBar
                backButton={false}
                iconRight={BiPersonAdd}
                actionRight={() => navigation.navigate ('SearchFriendPage')}
            />
            <ScrollView style={styles.main}>
                <TimeSelect
                    valueRef={selectedTimeRef}
                    disabled={isActiveBeacon}
                    highlight={isActiveBeacon}
                    initialValue={
                        activeBeacon !== null ?
                        activeBeacon.timestamp :
                        undefined
                    }
                />
                <Button
                    text={isActiveBeacon ? 'Cancel Beacon' : 'Send Beacon'}
                    onClick={isActiveBeacon ? cancelBeacon : sendBeacon}
                    highlight={isActiveBeacon}
                    isPrimary={true}
                    style={{marginTop: 8}}
                />
                <View style={{marginTop: 8}}>
                    <AnimatedViewCollection items={items} />
                    {
                        beacons.length === 0 ?
                        <Text style={[styles.text, {marginTop: 8}]}>
                            None of your friends have a beacon active right now. Maybe you should send one yourself...
                        </Text> :
                        <></>
                    }
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


