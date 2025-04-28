import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import ShowAll from '../components/ShowAll';

function AllElementScreen (){
    return (
        <View>
            <ShowAll />
        </View>
    );
};

export default AllElementScreen;