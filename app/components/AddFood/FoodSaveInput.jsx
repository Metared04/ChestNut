import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';

function FoodSaveInput({saveFood}){
    return (
        <LinearGradient
            colors={['#8027d6', '#d17af9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
        >
            <TouchableOpacity onPress={saveFood} style={styles.saveButtonTouchable} activeOpacity={0.8}>
                <Text style={styles.saveButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    saveButtonGradient: {
        marginTop: 30,
        borderRadius: 10,
        overflow: 'hidden', // pour que le bouton ne dépasse pas le gradient
    },
    saveButtonTouchable: {
        paddingVertical: 14,
        alignhouses: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FoodSaveInput;