import { useNavigation } from '@react-navigation/core';
import React, {useMemo} from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import Keychain from 'react-native-keychain';
import User from '../../model/User';
import {usePromise} from '../utils/hooks';
import {FG_PRIMARY} from '../Colors';

export default function Settings() {
  const navigation = useNavigation();
  const user = usePromise(useMemo(currentUser, []), {});

  const tutorial = () => {
    navigation.navigate('TutorialPage');
  };

  const logOut = () => {
    Keychain.resetGenericPassword().then();

    navigation.navigate('LoginPage');
  };

  const deleteAccount = async () => {
    const confirmation = await new Promise(resolve => {
      Alert.alert(
        'Are you sure?',
        'Are you sure you want to delete your account?',
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            isPreferred: false,
          },
          {
            text: 'Delete account',
            onPress: () => resolve(true),
            isPreferred: true,
          },
        ],
      );
    });

    if (confirmation) {
      const userId = (await Keychain.getGenericPassword()).username;

      logOut();

      const user = await User.byId(userId);
      await user.destroy();
    }
  };

  return (
    <View style={styles.page}>
      <NavBar title="Options" />
      <View style={styles.main}>
        <View style={{flexDirection: 'row', paddingTop: 8}}>
            <Text style={styles.text}>Your username is: </Text>
            <Text style={styles.username}>{user.username}</Text>
        </View>
        <Button text="Log out" onClick={logOut} />
        <Button text="Delete account" onClick={deleteAccount} />
        <Button text="Tutorial" onClick={tutorial} />
      </View>
    </View>
  );
}

async function currentUser() {
    let credentials = await Keychain.getGenericPassword();

    if (!credentials) {
        return {}
    }
    else {
        return User.byId(credentials.username);
    }
}

const styles = StyleSheet.create({
    page: {

    },

    username: {
        fontSize: 24,
        color: FG_PRIMARY,
        fontWeight: 'bold',
    },

    text: {
        fontSize: 24,
        color: FG_PRIMARY,
    },

    main: {
        paddingHorizontal: 8
    }
})

