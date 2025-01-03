import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {BG_PRIMARY, BG_SECONDARY, FG_PRIMARY, FG_SECONDARY} from '../Colors';
import BiPersonAdd from 'react-native-bootstrap-icons/icons/person-plus';

export default function SearchResults({ results = [], isQueryEmpty = false}) {
    if (isQueryEmpty) {
        return (
            <Text style={styles.minorText}>
                Type above to find your friends...
            </Text>
        );
    }
    else if (results.length === 0) {
        return (
            <Text style={styles.minorText}>
                No results found.
            </Text>
        );
    }
    else {
        return (
            <FlatList
                data={results}
                style={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.resultCard}>
                        <View style={styles.avatar} />
                        <View style={styles.details}>
                            <Text style={styles.displayName} >
                                {item.displayName}
                            </Text>
                            <Text style={styles.username}>
                                {item.username}
                            </Text>
                        </View>
                        <View style={styles.spacer} />
                        <TouchableOpacity>
                            <BiPersonAdd
                                viewBox="0 0 16 16"
                                width={32}
                                height={32}
                                style={styles.addIcon}
                                fill={FG_PRIMARY}
                            />
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        );
    }
}

const styles = StyleSheet.create({
    minorText: {
        marginTop: 16,

        fontSize: 16,
        color: FG_SECONDARY,
    },

    list: {
        marginTop: 8
    },

    resultCard: {
        marginTop: 8,
        height: 96,
        borderRadius: 8,
        backgroundColor: BG_SECONDARY,
        padding: 8,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: '50%',

        backgroundColor: BG_PRIMARY
    },

    details: {
        marginLeft: 16,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    displayName: {
        height: 32,
        fontSize: 32,
        lineHeight: 32,

        color: FG_PRIMARY
    },

    username: {
        height: 16,
        fontSize: 16,
        lineHeight: 16,

        color: FG_PRIMARY
    },

    addIcon: {
        margin: 8,
    },

    spacer: {
        flex: 1
    }
})

