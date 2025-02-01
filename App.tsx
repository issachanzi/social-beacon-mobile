/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {ReactElement} from 'react';

import * as push from './view/utils/push';
import RestEasy from "./model/RestEasy";
import HomePage from './view/pages/Home';
import LoginPage from "./view/pages/Login";
import CreateAccountPage from "./view/pages/CreateAccount";
import SearchFriendPage from "./view/pages/SearchFriend";
import SettingsPage from "./view/pages/Settings";

// // @ts-ignore
// import { createTransition, SlideLeft } from 'react-native-transition';
// import {View} from "react-native";
// import {Router} from "./view/Router";
// import RouterView from "./view/RouterView";
import {BG_SYSTEM, BG_PRIMARY} from "./view/Colors";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createStaticNavigation} from "@react-navigation/native";
import {Alert, Text, View, SafeAreaView} from "react-native";

const SERVER_URL = 'https://api.beacon.issachanzi.net/api';

const Stack = createNativeStackNavigator({
    screenOptions: {
        headerShown: false,
        contentStyle: {
            backgroundColor: BG_SYSTEM,
        }
    },
    screens: {
        HomePage,
        LoginPage,
        CreateAccountPage,
        SearchFriendPage,
        SettingsPage
    }
});

const Navigation = createStaticNavigation (Stack);


export default function App(): React.JSX.Element {
    RestEasy.init(SERVER_URL);

    React.useEffect (() => {
        push.setup ();
    }, []);

    return (
        <>
            <SafeAreaView style={{flex: 0, backgroundColor: BG_PRIMARY}} />
            <SafeAreaView style={{flex: 1, backgroundColor: BG_SYSTEM}}>
                <Navigation />
            </SafeAreaView>
        </>
    );
}

