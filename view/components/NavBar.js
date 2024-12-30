import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BG_PRIMARY, FG_PRIMARY} from '../Colors';


export default function NavBar ({ title = 'Social Beacon' }) {
    return (
        <View style={styles.NavBar}>
            <View style={styles.leftSlot}>

            </View>
            <Text style={styles.title}>
                {title}
            </Text>
            <View style={styles.spacer}/>
            <View style={styles.rightSlot} >

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    NavBar: {
        backgroundColor: BG_PRIMARY,
        width: '100%',
        height: 56,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    title: {
        flex: 1,
        textAlign: 'center',
        color: FG_PRIMARY,
        fontSize: 24,
        lineHeight: 24,
    },



});

