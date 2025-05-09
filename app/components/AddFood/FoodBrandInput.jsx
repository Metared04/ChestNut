import React from "react";
import { TextInput, StyleSheet } from "react-native";

function FoodBrandInput({value, onChange}){
    return (
        <TextInput
            placeholder="Marque"
            value={value}
            style={styles.input}
            onChangeText={onChange}
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

export default FoodBrandInput;