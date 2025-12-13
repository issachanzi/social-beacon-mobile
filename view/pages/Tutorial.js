import NavBar from '../components/NavBar';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import BiPersonAdd from 'react-native-bootstrap-icons/icons/person-plus';
import BiGear from 'react-native-bootstrap-icons/icons/gear';
import TimeSelect from '../components/TimeSelect';
import Button from '../components/Button';
import AnimatedViewCollection from '../components/AnimatedViewCollection';
import TutorialText from '../components/TutorialText';
import {FG_SECONDARY} from '../Colors';
import {useNavigation} from '@react-navigation/core';
import {usePoll, usePromise} from '../utils/hooks';
import Beacon from '../../model/Beacon';
import Keychain from 'react-native-keychain';
import User from '../../model/User';
import RestEasy from '../../model/RestEasy';
import FriendRequest from '../../model/FriendRequest';
import BeaconResponse from '../../model/BeaconResponse';
import BeaconResponseCard from '../components/BeaconResponseCard';
import FriendRequestCard from '../components/FriendRequestCard';
import BeaconCard from '../components/BeaconCard';
import Feed from '../components/Feed';


export default function TutorialPage() {
    const navigation = useNavigation();
    const cancelBeacon = () => {};
    const activeBeacon = null;
    const [beacons, setBeacons] = React.useState ([]);
    const [responses, setResponses] = React.useState ([]);
    const friendRequests = []

    // const show = [
    //     null,
    //     'timeselect',
    //     'sendbtn',
    //     'feed'
    // ][0];

    const origTime = React.useMemo(() => new Date(), [])
    const selectedTime = React.useRef(origTime);

    const [show, setShow] = React.useState(null);

    const [isActiveBeacon, setIsActiveBeacon] = React.useState(false);

    const [scriptCounter, setScriptCounter] = React.useState(0);
    const updateScriptCounter = () => {
        setScriptCounter(i => i + 1);
    };

    const sendBeacon = () => {
        setIsActiveBeacon(true);
        setScriptCounter(3);

        setTimeout(() => {
            setScriptCounter(4);
            setShow('feed');
            setBeacons([{
                id: 'sample-beacon',
                timestamp: selectedTime.current,
                sender: new Promise(res => res({
                    displayName: 'Your Friend'
                }))
            }]);
        }, 4000)
    };

    const onHeart = () => {
        setTimeout(() => {
            setScriptCounter(5);
            setBeacons([]);
            setTimeout(() => {
                setResponses([{
                    id: 'sample-response',
                    user: new Promise(res => res({
                        displayName: 'Your Friend',
                    }))
                }]);
            }, 2000);
        }, 3000);
    };

    const addFriendAction = () => {
        if (scriptCounter === 5) {
            navigation.popToTop();
            navigation.replace('HomePage');
            navigation.push('SearchFriendPage');
        }
    };

    const scriptActions = [
        // Show timeselect
        () => {
            setShow('timeselect');
            setScriptCounter(1);
        },
        // Show send btn
        () => {
            const interval = {};
            interval.id = setInterval(() => {
                if (selectedTime.current !== origTime) {
                    clearInterval(interval.id);
                    setTimeout(() => {
                        setScriptCounter(2);
                        setShow('sendbtn');
                    }, 1000);
                }
            }, 200);
        },
        // No action because waiting for click. Action done by sendBeacon()
        () => {},
        // No action because waiting for click. Action done by onHeart()
        () => {},
        () => {}
    ];

    const lines = script[scriptCounter];

    return (
        <View>
            <TutorialText lines={lines} onDone={scriptActions[scriptCounter]} key={scriptCounter} />
            <NavBar
                backButton={false}
                iconRight={BiPersonAdd}
                actionRight={addFriendAction}
                iconLeft={BiGear}
                actionLeft={() => {}}
            />
            <ScrollView style={styles.main}>
                <OpacityPop pop={show === 'timeselect' || show === 'sendbtn'}>
                    <TimeSelect
                        valueRef={selectedTime}
                        disabled={isActiveBeacon}
                        highlight={isActiveBeacon}
                        initialValue={
                            activeBeacon !== null ? activeBeacon.timestamp : undefined
                        }
                    />
                </OpacityPop>
                <OpacityPop pop={show === 'sendbtn'}>
                    <Button
                        text={isActiveBeacon ? 'Cancel Beacon' : 'Send Beacon'}
                        onClick={isActiveBeacon ? cancelBeacon : sendBeacon}
                        highlight={isActiveBeacon}
                        isPrimary={true}
                        style={{ marginTop: 8 }}
                    />
                </OpacityPop>
                <OpacityPop pop={show === 'feed'}>
                    <Feed
                        responses={responses}
                        friendRequests={friendRequests}
                        beacons={beacons}
                        onHeart={onHeart}
                    />
                </OpacityPop>
            </ScrollView>
        </View>
    );
}

function ZIndexPop ({pop = false, children = []}) {
    const zIndexStyle = {
        zIndex: 20,
        elevation: 20,
    }

    return (
        <View style={pop && zIndexStyle || undefined}>
            {children}
        </View>
    );
}

function OpacityPop ({pop = false, children = []}) {
    const opacityStyle = {
        opacity: 0.25
    }

    return (
        <View
            style={!pop && opacityStyle || undefined}
            pointerEvents={!pop && 'none' || undefined}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        padding: 8
    },

    text: {
        fontSize: 16,
        color: FG_SECONDARY
    }
});

const script = [
    [
        'Welcome to Social Beacon',
        'Social Beacon is an app for organising irl hangouts with irl friends, right now.',
        'Let\'s say you have some free time later today. Who of your friends are free to hang out then?'
    ],
    [
        'Use the ➕ and ➖ buttons to choose the time when you\'re free.'
    ],
    [
        'Use the ➕ and ➖ buttons to choose the time when you\'re free.',
        'Click the Send Beacon button to send a notification to all your friends.'
    ],
    [
        'The time selector flashes to show that you have a Beacon active.',
        'When your friends get the beacon, it looks like this.'
    ],
    [
        'When your friends get the beacon, it looks like this.',
        'Click the ❤️ if you\'re also free and want to hang out.'
    ],
    [
        'When a friend ❤️s your Beacon, you also get a notification.',
        'Now you have to text/call/whatever them to make plans.',
        'Get started by clicking the icon in the top right to add friends.'
    ]
];

