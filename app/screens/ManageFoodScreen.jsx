import { Text, View, TextInput, Button, FlatList } from "react-native";

import { useEffect, useState } from 'react';

import { fetchFoods, addFood, deleteFood } from '../services/foodService';

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
      value={userNameFood} 
      onChangeText={setUserNameFood}
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