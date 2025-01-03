import React from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import NavBar from '../components/NavBar';
import {usePoll, usePromise} from '../utils/hooks';
import {BG_SECONDARY, FG_PRIMARY, FG_SECONDARY} from '../Colors';
import User from '../../model/User';
import SearchResults from '../components/SearchResults';

const POLL_INTERVAL_MILLIS = 200;

export default function SearchFriend () {
    const [query, setQuery] = React.useState('');
    const allUsers = usePromise(User.all());

    const doSearch = () => {
        if (allUsers === null) {
            return [];
        }

        return allUsers
            .filter (user => (
                user.username.toLowerCase().includes(query.toLowerCase())
                || user.displayName.toLowerCase().includes(query.toLowerCase())
            ))
            .sort((a, b) => compareResults(a, b, query))
            .slice (0, 50);
    };

    const searchResults = doSearch(); // usePoll (doSearch, POLL_INTERVAL_MILLIS)

    return (
        <View>
            <NavBar title="Add friend" />
            <View style={styles.main}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search username or display name..."
                    onSubmitEditing={doSearch}
                    onChangeText={setQuery}
                />
                <SearchResults
                    results={searchResults}
                    isQueryEmpty={query === ''}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        marginHorizontal: 8
    },

    searchBar: {
        marginTop: 16,
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

function compareResults (a, b, query) {
    if (a === null) {
        return 1;
    }
    else if (b === null) {
        return -1;
    }

    query = query.toLowerCase();
    const usernameA = a.username.toLowerCase();
    const usernameB = b.username.toLowerCase();
    const displayA = a.displayName.toLowerCase();
    const displayB = b.displayName.toLowerCase();

    const unaExactMatch = usernameA === query;
    const unbExactMatch = usernameB === query;
    const dnaExactMatch = displayA === query;
    const dnbExactMatch = displayB === query;
    const unaIncludes = usernameA.includes(query);
    const unbIncludes = usernameB.includes(query);
    const dnaIncludes = displayA.includes(query);
    const dnbIncludes = displayB.includes(query);

    if (unaExactMatch) {
        return -1;
    }
    else if (unbExactMatch) {
        return 1;
    }
    else if (dnaExactMatch) {
        return -1;
    }
    else if (dnbExactMatch) {
        return 1;
    }
    else if (unaIncludes && unbIncludes) {
        return usernameA.length - usernameB.length;
    }
    else if (unaIncludes) {
        return -1;
    }
    else if (unbIncludes) {
        return 1;
    }
    else if (dnaIncludes && dnbIncludes) {
        return displayA.length - displayB.length;
    }
    else {
        return 0;
    }
}

