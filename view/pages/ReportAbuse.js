import {useNavigation} from '@react-navigation/core';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {BG_SECONDARY, BG_SYSTEM, FG_PRIMARY, FG_SECONDARY} from '../Colors';
import NavBar from '../components/NavBar';
import React from 'react';
import Button from '../components/Button';
import AbuseReport from '../../model/AbuseReport';
import {usePromise} from '../utils/hooks';
import User from '../../model/User';
import Keychain from 'react-native-keychain';

export default function ReportAbusePage ({ route }) {
    const navigation = useNavigation();

    const { target } = route.params;

    const [note, setNote] = React.useState('');

    const credentials = usePromise(Keychain.getGenericPassword(), {});
    const currentUserId = credentials.username;
    const currentUser = usePromise(User.byId(currentUserId), {}, [currentUserId]);

    const handleSubmit = () => {
        const report = new AbuseReport();
        report.author = currentUser;
        report.target = target;
        report.note = note;

        report.save().catch();

        navigation.goBack();
    }

    return (
        <View style={styles.page}>
            <NavBar title="Report abuse" />
            <ScrollView style={styles.main}>
                <Text style={styles.text}>Report {target.displayName} for abuse?</Text>
                <Text style={styles.label}>Issue description:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="If you can, please explain why you are reporting this user (optional)"
                    placeholderTextColor={FG_SECONDARY}
                    onChangeText={setNote}
                    multiline={true}
                    numberOfLines={5}
                />
                <Button text="Send report" onClick={handleSubmit} isPrimary={true} />
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

    text: {
        marginTop: 8,
        paddingLeft: 8,

        color: FG_PRIMARY,
    },

    label: {
        marginTop: 8,
        paddingLeft: 8,

        color: FG_SECONDARY,
    },

    input: {
        marginTop: 8,
        padding: 8,

        height: 40 * 5,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: FG_SECONDARY,
        backgroundColor: BG_SECONDARY,
        color: FG_PRIMARY,
        textAlignVertical: 'top',
    },
});

