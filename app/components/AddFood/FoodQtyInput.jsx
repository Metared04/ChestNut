import React from "react";
import { TextInput, StyleSheet } from "react-native";

function FoodQtyInput({value, onChange}){
    return (
        <TextInput
            placeholder="Quantité"
            keyboardType="numeric"
            value={value}
            style={styles.input}
            onChangeText={onChange}
            maxLength={3}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
});

export default FoodQtyInput;