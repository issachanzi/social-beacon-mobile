import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useRef, useState} from 'react';
import NavBar from '../components/NavBar';
import {BG_SECONDARY, BG_SYSTEM, FG_HIGHIGHT, FG_PRIMARY, FG_SECONDARY} from '../Colors';
import Button from '../components/Button';
import RestEasy from '../../model/RestEasy';
import Login from '../../model/Login';
import Keychain from 'react-native-keychain';
import User from '../../model/User';
import {useNavigation} from '@react-navigation/core';

export default function CreateAccountPage () {
    const navigation = useNavigation();

    const refs = {
        username: useRef (null),
        displayName: useRef (null),
        password: useRef (null),
        repeatPassword: useRef (null),
    };

    const [fieldValues, setFieldValues] = useState ({});

    const updateField = fieldName => (
        newValue => setFieldValues(oldValues => {
            const newValues = {...oldValues};

            newValues[fieldName] = newValue;

            return newValues;
        })
    );

    const focusField = fieldRef => {
        return () => {
            if (fieldRef.current !== null) {
                return fieldRef.current.focus ();
            }
        }
    }

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        setIsLoading(true);

        const user = new User(fieldValues);
        user
            .save()
            .then (async () => {
                const login = new Login({
                    username: fieldValues.username,
                    password: fieldValues.password,
                });

                await login.save();

                return login;
            })
            .then(async login => {
                RestEasy.instance.authorization = login.token;
                await Keychain.setGenericPassword((await login.user).id, login.token);
                navigation.navigate ('HomePage');
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
            <NavBar title="Create account" />
            <ScrollView style={styles.main}>
                {/* main */}
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter username"
                    autoCapitalize="none"
                    autoComplete="username"
                    onSubmitEditing={focusField (refs.displayName)}
                    onChangeText={updateField ('username')}
                    ref={refs.user}
                />
                <Text style={styles.label}>Display name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Eg. Nelson"
                    autoCapitalize="words`"
                    autoComplete="given-name"
                    onSubmitEditing={focusField (refs.password)}
                    onChangeText={updateField ('displayName')}
                    ref={refs.user}
                />
                <Text style={styles.label} >Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    onSubmitEditing={focusField (refs.repeatPassword)}
                    onChangeText={updateField ('password')}
                    ref={refs.password}
                />
                <Text style={styles.label} >Repeat password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Repeat password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    onSubmitEditing={handleSubmit}
                    onChangeText={updateField ('repeatPassword')}
                    ref={refs.repeatPassword}
                />
                <Button text="Create account" onClick={handleSubmit} isPrimary={true} />
                <Button
                    text="Log in instead"
                    onClick={() => navigation.goBack()}
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

