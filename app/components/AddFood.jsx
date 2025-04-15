import React, { useState } from 'react';

import { Text, View, TextInput, TouchableOpacity, StyleSheet, Button, ActivityIndicator, FlatList } from "react-native";

import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';


import supabase from '../services/supabase';
import DateComponent from './DateComponent';
import RecommandedDate from './RecommandedDate';

import Food from '../models/Food';

const AddFood = () => {
    const [food, setFood] = useState(new Food());

    const [resetDateInput, setResetDateInput] = useState(false);

    const handleChange = (key, value) => {
        setFood(prev => new Food(
            prev.foodId,
            key === "foodName" ? value : prev.foodName,
            key === "foodBrand" ? value : prev.foodBrand,
            key === "foodRegisteredDate" ? value : prev.foodRegisteredDate,
            key === "foodOpeningDate" ? value : prev.foodOpeningDate,
            key === "foodExpirationDate" ? value : prev.foodExpirationDate,
            key === "foodBarCode" ? value : prev.foodBarCode,
            key === "foodQty" ? parseInt(value) : prev.foodQty,
            key === "foodIsOpened" ? value : prev.foodIsOpened,
            key === "foodLocation" ? value : prev.foodLocation
        ));

        console.log("dans handle change : ", value);
    };

    const addFood = async () => {
        const newFoodData = {
            food_name: food.foodName,
            food_brand: food.foodBrand,
            food_registered_date: food.foodRegisteredDate ? food.foodRegisteredDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            food_opening_date: food.foodRegisteredDate ? food.foodRegisteredDate : new Date().toISOString().split('T')[0],
            food_expiration_date: food.foodExpirationDate,
            food_bar_code: food.foodBarCode,
            food_qty: food.foodQty,
            food_is_opened: food.foodIsOpened,
            food_storage_location_id: food.foodLocation,
        };
        console.log("test date : ", newFoodData.food_expiration_date);
        console.log("Date enregistrée : ", food.foodExpirationDate);
        const {data, error} = await supabase
        .from("all_food_table")
        .insert([newFoodData])
        .select() 
        .single();
      
      //console.log("Test sur l'insertion : ", data);

        if(error){
            console.log("Probleme d'ajout : ", error);
        } else {
        // setFoodList((prev) => [...prev, data]);
        console.log("Ajoute !")
        setFood(new Food());
        setResetDateInput(true); 
          setTimeout(() => setResetDateInput(false), 100);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <TouchableOpacity >
                    <Ionicons name="chevron-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.label}>Ajout d'un produit</Text>
            </View>
            <TextInput
                placeholder="Nom"
                value={food.foodName}
                style={styles.input}
                onChangeText={(text) => handleChange("foodName", text)}
            />
            <TextInput
                placeholder="Marque"
                value={food.foodBrand}
                style={styles.input}
                onChangeText={(text) => handleChange("foodBrand", text)}
            />
            <Text style={styles.label}>Ouvert ?</Text>
            <View style={styles.radioGroup}>
                <TouchableOpacity onPress={() => handleChange("foodIsOpened", true)} style={styles.radioButton}>
                    <View style={[styles.outerCircle, food.foodIsOpened && styles.selected]}>
                        {food.foodIsOpened && <View style={styles.innerCircle} />}
                    </View>
                <Text>Oui</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleChange("foodIsOpened", false)} style={styles.radioButton}>
                    <View style={[styles.outerCircle, !food.foodIsOpened && styles.selected]}>
                    {!food.foodIsOpened && <View style={styles.innerCircle} />}
                    </View>
                    <Text>No</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.label}>Date de mise en frigo / congelo</Text>
            <DateComponent
                onChange={(date) => handleChange("foodRegisteredDate", date)}
                reset={resetDateInput}
            />
            <Text style={styles.label}>Date de peremption</Text>
            <DateComponent
                onChange={(date) => handleChange("foodExpirationDate", date)}
                reset={resetDateInput}
            />
            <Text style={styles.label}>Code barre</Text>
            <TextInput
                placeholder="Code barre"
                style={styles.input}
                value={food.foodBarCode}
                onChangeText={(text) => handleChange("foodBarCode", text)}
                maxLength={15}
            />
            <Text>Quantité</Text>
            <TextInput
                placeholder="Quantité"
                keyboardType="numeric"
                style={styles.input}
                value={food.foodQty.toString()}
                onChangeText={(text) => handleChange("foodQty", text)}
                maxLength={3}
            />
            <LinearGradient
                colors={['#8027d6', '#d17af9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
            >
                <TouchableOpacity onPress={addFood} style={styles.saveButtonTouchable} activeOpacity={0.8}>
                    <Text style={styles.saveButtonText}>Sauvegarder</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderColor: '#a855f7',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a855f7',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButtonGradient: {
    marginTop: 30,
    borderRadius: 10,
    overflow: 'hidden', // pour que le bouton ne dépasse pas le gradient
  },
  
  saveButtonTouchable: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default AddFood;