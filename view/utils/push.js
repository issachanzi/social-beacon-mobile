import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import {PermissionsAndroid, Platform} from 'react-native';

export function setup () {
    initChannels().then();
}

export async function token () {
    await messaging ().requestPermission();

    if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
    }
    else if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
    }

    return await messaging ().getToken();
}

async function initChannels () {
    await notifee.createChannel({
        id: 'beacon',
        name: 'Beacons from your friends',
        importance: AndroidImportance.HIGH
    });
}


