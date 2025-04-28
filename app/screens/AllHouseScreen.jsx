import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import ShowHouse from '../components/ShowHouse';

function AllHouseScreen (){
    const id = 1;
    return (
        <View>
            <ShowHouse userId={id}/>
        </View>
    );
};

export default AllHouseScreen;