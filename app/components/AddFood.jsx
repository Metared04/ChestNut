import React, { useState } from 'react';

import { Text, View, TextInput, Button, ActivityIndicator, FlatList } from "react-native";

import { supabase } from '../services/supabase';

import Food from '../models/Food';

const AddFood = () => {
  /*
    const [selected, setSelected] = useState(1);

    const [newFood, setNewFood] = useState("");
    const [userFoodName, setUserFoodName] = useState('');
    const [userFoodBrand, setUserFoodBrand] = useState('');
    const [userFoodRegisterDate, setUserFoodRegisterDate] = useState("2025-04-04");
    const [userFoodOpeningDate, setUserFoodOpeningDate] = useState("2025-04-04");
    const [userFoodExpirationDate, setUserFoodExpirationDate] = useState("2025-04-04");
    const [userFoodBarCode, setUserFoodBarCode] = useState("");
    const [userFoodQty, setUserFoodQty] = useState(0);
    const [userFoodIsOpened, setUserFoodIsOpened] = useState(false);
  */
    const [food, setFood] = useState(new Food());

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
    };

    const addFood = async () => {
      const newFoodData = {
        food_name: food.foodName,
        food_brand: food.foodBrand,
        food_registered_date: food.foodRegisteredDate.toISOString().split('T')[0],
        food_opening_date: food.foodOpeningDate ? food.foodOpeningDate.toISOString().split('T')[0] : null,
        food_expiration_date: food.foodExpirationDate.toISOString().split('T')[0],
        food_bar_code: food.foodBarCode,
        food_qty: food.foodQty,
        food_is_opened: food.foodIsOpened,
      };

      const {data, error} = await supabase
      .from("all_food_table")
      .insert([newFoodData])
      .select() 
      .single();

      if(error){
        console.log("Probleme d'ajout : ", error);
      } else {
        // setFoodList((prev) => [...prev, data]);
        console.log("Ajoute !")
        setFood(new Food());
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