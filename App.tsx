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

// // @ts-ignore
// import { createTransition, SlideLeft } from 'react-native-transition';
// import {View} from "react-native";
// import {Router} from "./view/Router";
// import RouterView from "./view/RouterView";
import {BG_SYSTEM} from "./view/Colors";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createStaticNavigation} from "@react-navigation/native";
import {Alert, Text, View} from "react-native";

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
        SearchFriendPage
    }
});

const Navigation = createStaticNavigation (Stack);


export default function App(): React.JSX.Element {
    RestEasy.init('http://192.168.1.219:7070/api');
    //RestEasy.init ('http://192.168.8.118:7070/api');

    React.useEffect (() => {
        push.setup ();
    }, []);

    return <Navigation />;
}

