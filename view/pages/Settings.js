import {useNavigation} from '@react-navigation/core';
import React, {useRef, useState} from 'react';
import Login from '../../model/Login';
import {processLogin} from '../utils/login';
import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import NavBar from '../components/NavBar';
import {FG_SECONDARY} from '../Colors';
import Button from '../components/Button';
import Keychain from 'react-native-keychain';
import User from '../../model/User';


export default function Settings () {
    const navigation = useNavigation();

    const logOut = () => {
        Keychain.resetGenericPassword ().then ();

        navigation.navigate ('LoginPage');
    }

    const deleteAccount = async () => {
        const confirmation = await new Promise ((resolve) => {
            Alert.alert (
                "Are you sure?",
                "Are you sure you want to delete your account?",
                [
                    {
                        text: "Cancel",
                        onPress: () => resolve (false),
                        isPreferred: false
                    },
                    {
                        text: "Delete account",
                        onPress: () => resolve (true),
                        isPreferred: true
                    }
                ]
            )
        });

        if (confirmation) {
            const userId = (await Keychain.getGenericPassword ()).username;

            logOut();

            const user = await User.byId(userId);
            await user.destroy ();
        }
    }

    return (
        <View style={styles.page}>
            <NavBar title="Options" />
            <View style={styles.main}>
                <Button text="Log out" onClick={logOut} />
                <Button text="Delete account" onClick={deleteAccount} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {

    },

    main: {
        paddingHorizontal: 8
    }
})

