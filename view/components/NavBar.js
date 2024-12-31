import React from 'react';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BG_PRIMARY, FG_PRIMARY, FG_SECONDARY} from '../Colors';
import BiChevronLeft from 'react-native-bootstrap-icons/icons/chevron-left'
import {useNavigation} from '@react-navigation/core';


export default function NavBar ({
    title = 'Social Beacon',
    backButton = true,
    iconLeft = () => <></>,
    actionLeft = () => undefined,
    iconRight = () => <></>,
    actionRight = () => undefined
}) {
    const navigation = useNavigation();

    if (backButton) {
        iconLeft = BiChevronLeft;
        actionLeft = () => navigation.goBack();
    }

    const IconLeft = iconLeft;
    const IconRight = iconRight;

    return (
        <View style={styles.NavBar}>
            <TouchableOpacity style={styles.slot} onPress={actionLeft}>
                <IconLeft viewBox="0 0 16 16" width="24" height="24" fill={FG_SECONDARY} />
            </TouchableOpacity>
            <Text style={styles.title}>
                {title}
            </Text>
            <View style={styles.spacer}/>
            <TouchableOpacity style={styles.slot} onPress={actionRight} >
                <IconRight viewBox="0 0 16 16" width="24" height="24" fill={FG_SECONDARY} />
            </TouchableOpacity>
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

    slot: {
        width: 56,
        height: 56,
        padding: 16
    }


});

