import React from "react";
import { TextInput, StyleSheet } from "react-native";

import allStyles from "../../styles/allStyles";

function FoodBarCodeInput({value, onChange}){
    return (
        <TextInput
            placeholder="Code barre"
            keyboardType="numeric"
            value={value}
            style={allStyles.input}
            onChangeText={onChange}
            maxLength={15}
        />
    );
}

export default FoodBarCodeInput;