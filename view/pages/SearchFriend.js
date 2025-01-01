import React from 'react';
import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
import NavBar from '../components/NavBar';
import {usePoll} from '../utils/hooks';
import {BG_SECONDARY, FG_PRIMARY, FG_SECONDARY} from '../Colors';

export default function SearchFriend () {
    const [query, setQuery] = React.useState('');

    const doSearch = () => {
        // TODO
    };

    return (
        <View>
            <NavBar title="Add friend" />
            <ScrollView style={styles.main}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search username or display name..."
                    onSubmitEditing={doSearch}
                    onChangeText={setQuery}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        padding: 8
    },

    searchBar: {
        marginTop: 8,
        padding: 8,

        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: FG_SECONDARY,
        backgroundColor: BG_SECONDARY,
        color: FG_PRIMARY,
    }
});

