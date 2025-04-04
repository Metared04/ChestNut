import React, { useState } from 'react';

import { Text, View, TextInput, Button, ActivityIndicator, FlatList } from "react-native";

import { supabase } from '../services/supabase';

import Food from '../models/Food';

const AddFood = () => {
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
  
    const addFood = async () => {
      const newFoodData = {
        food_name: userFoodName,
        food_brands: userFoodBrand,
        food_register_date: userFoodRegisterDate,
        food_opening_date: userFoodOpeningDate,
        food_expiration_date: userFoodExpirationDate,
        food_bar_code: userFoodBarCode,
        food_qty: userFoodQty,
        food_is_opened: userFoodIsOpened,
      };

      const {data, error} = await supabase
      .from("fridge_table")
      .insert([newFoodData])
      .select() 
      .single();

      if(error){
        console.log("Probleme d'ajout : ", error);
      } else {
        setFoodList((prev) => [...prev, data]);
        setNewFood("");
      }
    };

    return (
        <View>
            <TextInput 
            placeholder="Pomme ..." 
            value={userFoodName} 
            onChangeText={setUserFoodName}
            />
            <TextInput
            placeholder="Marque"
            value={userFoodBrand}
            onChangeText={setUserFoodBrand}
            />      
            <Button 
            title="Ajouter" 
            onPress={addFood} 
            />
        </View>
    );
};

export default AddFood;