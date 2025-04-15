import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AddFood from '../components/AddFood';

function AddFoodScreen (){
    return (
        <View>
            <AddFood />
        </View>
    );
};

export default AddFoodScreen;