import React from "react";
import { StyleSheet, TouchableOpacity, Dimensions, Animated } from "react-native";

import { FontAwesome } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

function HomeScreenBurgerButtonComponent({showHouses, setShowHouses, menuSlideAnim}) {

    const HomeScreenToggleHousesMenu = () => {
        setShowHouses(!showHouses);
        Animated.timing(menuSlideAnim, {
            toValue: showHouses ? -height * 0.8 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity onPress={HomeScreenToggleHousesMenu} style={styles.circleButton}>
            <FontAwesome name={showHouses ? "times" : "bars"} size={24} color="black" />
        </TouchableOpacity>
    );
}

export default HomeScreenBurgerButtonComponent;

const styles = StyleSheet.create({
    circleButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20
    },
})