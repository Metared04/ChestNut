import { Text, View, TextInput, Button, FlatList } from "react-native";

import { useEffect, useState } from 'react';

import { fetchFoods, addFood, deleteFood } from '../services/foodService';

import Inventory from '../models/Inventory';
import Food from '../models/Food';

let a = new Food("Petit Beurre Pocket", "Belle France", "2025-04-01", null, "2025-10-01", "3258561020686", 1, true);
let b = new Food("Yop de wish", "Pâturage", "2025-04-17", null, "2025-04-19", "3250391693009", 1, true);
let c = new Food("Filet mignon", "", "2025-04-18", null, "2025-04-22", "", 2, false);

const aFridge = new Inventory(3, [a,b,c]);

const items = aFridge.inventoryFoodList;

function ManageFoodScreen() {
  const [foodList, setFoodList] = useState([]);
  const [newFood, setNewFood] = useState("");
  const [userFoodName, setUserFoodName] = useState('');
  const [userFoodBrand, setUserFoodBrand] = useState('');
  const [userFoodRegisterDate, setUserFoodRegisterDate] = useState("2025-04-04");
  const [userFoodOpeningDate, setUserFoodOpeningDate] = useState("2025-04-04");
  const [userFoodExpirationDate, setUserFoodExpirationDate] = useState("2025-04-04");
  const [userFoodBarCode, setUserFoodBarCode] = useState("");
  const [userFoodQty, setUserFoodQty] = useState(0);
  const [userFoodIsOpened, setUserFoodIsOpened] = useState(false);

  useEffect(() => {
    loadFoods();
  }, []);
  
  const addFood = async () => {
    const newFoodData = {
      food_name: userFoodName,
      food_brands: userFoodBrand,
      food_register_date: userFoodRegisterDate,
      food_opening_date: userFoodOpeningDate,
      food_expiration_date: userFoodExpirationDate,
      food_bar_code: userFoodBarCode,
      food_qty: userFoodQty,
      isOpened: userFoodIsOpened,
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

  const loadFoods = async () => {
    try {
      const data = await fetchFoods();
      setFoods(data);
    } catch (error) {
       console.error("Erreur lors du chargement :", error);
    }
  };

    return (
    <View>
      <TextInput 
      placeholder="Pomme ..." 
      value={userFoodName} 
      onChangeText={setUserFoodName}
      />
      <Button 
      title="Ajouter" 
      onPress={addFood} 
      />
    <FlatList 
      data={foodList}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name} - {item.calories} kcal</Text>
        </View>
      )}
    />
  </View>
);
}

export default ManageFoodScreen();