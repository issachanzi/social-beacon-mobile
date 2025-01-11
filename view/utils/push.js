import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

export function setup () {
    token ().then(t => {
        console.log ('Firebase token:' + t);
    }).catch(err => console.log(err));
}

export async function token () {
    await messaging ().requestPermission();

    if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
    }

    return await messaging ().getToken();
}


