import React from "react";
import { TextInput, StyleSheet } from "react-native";

function FoodBarCodeInput({value, onChange}){
    return (
        <TextInput
            placeholder="Code barre"
            keyboardType="numeric"
            value={value}
            style={styles.input}
            onChangeText={onChange}
            maxLength={15}
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

export default FoodBarCodeInput;