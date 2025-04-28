import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import ShowFurniture from '../components/ShowFurniture';

function AllFurnitureScreen (){
    const id = 1;
    return (
        <View>
            <ShowFurniture houseId={id}/>
        </View>
    );
};

export default AllFurnitureScreen;