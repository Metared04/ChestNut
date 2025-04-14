import React, { useState } from 'react';

import { Text, View, TextInput, Button, ActivityIndicator, FlatList } from "react-native";

import { supabase } from '../services/supabase';
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
            key === "foodIsOpened" ? value : prev.foodIsOpened
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
        setResetDateInput(true); // 👈 réinitialise DateComponent
          setTimeout(() => setResetDateInput(false), 100);
      }
    };

    return (
         <View>
            <TextInput
                placeholder="Nom"
                value={food.foodName}
                onChangeText={(text) => handleChange("foodName", text)}
            />
            <TextInput
                placeholder="Marque"
                value={food.foodBrand}
                onChangeText={(text) => handleChange("foodBrand", text)}
            />
            <RecommandedDate 
            
            />
            <DateComponent 
            onChange={(date) => {
              console.log("Bah oui encroe : ", date);
              handleChange("foodExpirationDate", date)
              reset={resetDateInput}
            }}/>
            <TextInput
                placeholder="Code barre"
                value={food.foodBarCode}
                onChangeText={(text) => handleChange("foodBarCode", text)}
            />
            <TextInput
                placeholder="Quantité"
                keyboardType="numeric"
                value={food.foodQty.toString()}
                onChangeText={(text) => handleChange("foodQty", text)}
            />
            <Button title="Ajouter" onPress={addFood} />
        </View>
    );
};

export default AddFood;