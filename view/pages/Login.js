import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useRef, useState} from 'react';
import NavBar from '../components/NavBar';
import {BG_SECONDARY, BG_SYSTEM, FG_HIGHIGHT, FG_PRIMARY, FG_SECONDARY} from '../Colors';
import Button from '../components/Button';
import RestEasy from '../../model/RestEasy';
import Login from '../../model/Login';
import Keychain from 'react-native-keychain';
import {useNavigation} from '@react-navigation/core';

export default function LoginPage () {
    const navigation = useNavigation();

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitUsername = () => {
        passwordRef.current.focus();
    };

    const handleSubmit = () => {
        setIsLoading(true);
        const loginData = {
            username: usernameValue,
            password: passwordValue,
        }
        const login = new Login(loginData);
        login
            .save()
            .then(async () => {
                RestEasy.instance.authorization = login.token;
                await Keychain.setGenericPassword((await login.user).id, login.token);
                navigation.replace ('HomePage');
            })
            .catch(err => {
                if (err === 404) {
                    Alert.alert ("Invalid username");
                }
                else if (err === 403) {
                    Alert.alert ("Invalid password");
                }
                else {
                    Alert.alert ('Unknown error while logging in');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
      <View style={styles.page}>
        <NavBar title="Log in" />
        <ScrollView style={styles.main}>
          {/* main */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            autoCapitalize="none"
            autoComplete="username"
            onSubmitEditing={handleSubmitUsername}
            onChangeText={setUsernameValue}
            ref={usernameRef}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry={true}
            autoCapitalize="none"
            autoComplete="current-password"
            onSubmitEditing={handleSubmit}
            onChangeText={setPasswordValue}
            ref={passwordRef}
          />
          <Button text="Log in" onClick={handleSubmit} isPrimary={true} />
          <Button
            text="Create account"
            onClick={() => navigation.navigate('CreateAccountPage')}
          />
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: BG_SYSTEM,
        width: '100%',
        height: '100%'
    },

    main: {
        padding: 8,
    },

    label: {
        marginTop: 8,
        paddingLeft: 8,

        color: FG_SECONDARY,
    },

    input: {
        marginTop: 8,
        padding: 8,

        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: FG_SECONDARY,
        backgroundColor: BG_SECONDARY,
        color: FG_PRIMARY,
    },
});

