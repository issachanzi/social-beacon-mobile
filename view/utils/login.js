import RestEasy from '../../model/RestEasy';
import Keychain from 'react-native-keychain';
import {token} from './push';
import NotificationSubscribe from '../../model/NotificationSubscribe';

export async function processLogin (login) {
    RestEasy.instance.authorization = login.token;

    const currentUser = await login.user;
    await Keychain.setGenericPassword(currentUser.id, login.token);

    const subscribe = new NotificationSubscribe ({
        user: currentUser.id,
        token: await token ()
    });

    // Don't want or need to wait for network request before being able to use
    //  the app, so no await here.
    subscribe.save().then ();
}

