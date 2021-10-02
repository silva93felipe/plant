import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import useImg from "../assets/felipe.png"
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header(){
    const [userName, setUserName] = useState<string>();

    useEffect(() =>{
        async function loadStoregeUsername(){
            const user = await AsyncStorage.getItem('@plantmanager:user');
            setUserName(user || '');
        }

        loadStoregeUsername();
    })

    return(
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>
                    Olá,
                </Text>

                <Text style={styles.userName}>
                    {userName}
                </Text>
            </View>

            <Image source={useImg} style={styles.image}></Image>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        // backgroundColor: colors.red, 
        marginTop: getStatusBarHeight(),
        // padding: 20 
    },

    greeting: {
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.text
    },

    userName: {
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 40
    },

    image: {
        width: 70,
        height: 70,
        borderRadius: 40
    }
})