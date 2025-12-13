import React from 'react';

import NavBar from '../components/NavBar';
import TimeSelect from '../components/TimeSelect';
import Button from '../components/Button';

import Beacon from '../../model/Beacon';
import RestEasy from '../../model/RestEasy';
import { usePoll, usePromise } from '../utils/hooks';
import { useNavigation } from '@react-navigation/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import Keychain from 'react-native-keychain';
import { FG_SECONDARY } from '../Colors';
import BiPersonAdd from 'react-native-bootstrap-icons/icons/person-plus';
import BiGear from 'react-native-bootstrap-icons/icons/gear';
import FriendRequest from '../../model/FriendRequest';
import BeaconResponse from '../../model/BeaconResponse';
import Feed from '../components/Feed';

const POLL_INTERVAL_MILLIS = 10_000;

export default function Home() {
  const navigation = useNavigation();

  const credentials = usePromise(Keychain.getGenericPassword());
  const [currentUserId, setCurrentUserId] = React.useState(null);
  useRequireLogin(credentials, navigation, setCurrentUserId);

  const beacons = useIncomingBeacons();
  const friendRequests = useFriendRequests(currentUserId);
  const responses = useBeaconResponses(activeBeacon);

  const { activeBeacon, setActiveBeacon } = useActiveBeacon(currentUserId);
  const isActiveBeacon = activeBeacon !== null;

  const selectedTimeRef = React.useRef(new Date());

  const cancelBeacon = () => {
    activeBeacon.destroy();

    selectedTimeRef.current = new Date();

    setActiveBeacon(null);
  };

  const sendBeacon = () => {
    const beacon = new Beacon({
      sender: currentUserId,
      timestamp: selectedTimeRef.current.getTime(),
    });
    beacon.save().then();

    setActiveBeacon(beacon);
  };

  return (
    <View>
      <NavBar
        backButton={false}
        iconRight={BiPersonAdd}
        actionRight={() => navigation.navigate('SearchFriendPage')}
        iconLeft={BiGear}
        actionLeft={() => navigation.navigate('SettingsPage')}
      />
      <ScrollView style={styles.main}>
        <TimeSelect
          valueRef={selectedTimeRef}
          disabled={isActiveBeacon}
          highlight={isActiveBeacon}
          initialValue={
            activeBeacon !== null ? activeBeacon.timestamp : undefined
          }
        />
        <Button
          text={isActiveBeacon ? 'Cancel Beacon' : 'Send Beacon'}
          onClick={isActiveBeacon ? cancelBeacon : sendBeacon}
          highlight={isActiveBeacon}
          isPrimary={true}
          style={{ marginTop: 8 }}
        />
        <Feed
          responses={responses}
          friendRequests={friendRequests}
          beacons={beacons}
        />
      </ScrollView>
    </View>
  );

  // return <Text style={{color: 'white'}}>Hello, world!</Text>;
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

function useFriendRequests(currentUserId) {
  const friendRequestsPromise = usePoll(
      () => FriendRequest.where({ to: currentUserId }),
      POLL_INTERVAL_MILLIS,
      new Promise(resolve => resolve([])),
      [currentUserId],
  );
  const friendRequests = usePromise(
      friendRequestsPromise,
      [],
      [friendRequestsPromise],
  );

  return friendRequests;
}

function useIncomingBeacons() {
  const beaconsPromise = usePoll(
      Beacon.all,
      POLL_INTERVAL_MILLIS,
      new Promise(resolve => resolve([])),
      [],
  );
  const beacons = usePromise(beaconsPromise, [], [beaconsPromise]);
  return beacons;
}

function useRequireLogin(credentials, navigation, setCurrentUserId) {
  React.useEffect(() => {
    if (credentials === false) {
      navigation.replace('LoginPage');
    } else if (credentials !== null) {
      setCurrentUserId(credentials.username);
      RestEasy.instance.authorization = credentials.password;
    }
  }, [credentials]);
}

function useBeaconResponses(activeBeacon) {
  const responsesPromise = usePoll(
      async () => {
        if (activeBeacon === null) {
          return [];
        } else {
          const allResponses = await BeaconResponse.all();

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
      new Promise(resolve => resolve([])),
  );
  const responses = usePromise(responsesPromise, [], [responsesPromise]);
  return responses;
}

function useActiveBeacon(currentUserId) {
  const [activeBeacon, setActiveBeacon] = React.useState(null);

  React.useEffect(() => {
    Beacon.where({ sender: currentUserId }).then(b => {
      if (b.length > 0) {
        const activeBeacon = b[0];

        setActiveBeacon(activeBeacon);
      }
    });
  }, [currentUserId]);
  return { activeBeacon, setActiveBeacon };
}

