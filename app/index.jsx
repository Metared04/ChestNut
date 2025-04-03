import { Text, View, TextInput, Button, FlatList } from "react-native";
import React, { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from './supabase';
import styled from "styled-components/native";
import Inventory from './models/Inventory';
import Food from './models/Food';

let a = new Food("Petit Beurre Pocket", "Belle France", "2025-04-01", null, "2025-10-01", "3258561020686", 1, true);
let b = new Food("Yop de wish", "Pâturage", "2025-04-17", null, "2025-04-19", "3250391693009", 1, true);
let c = new Food("Filet mignon", "", "2025-04-18", null, "2025-04-22", "", 2, false);

const i = new Inventory(3, [a,b,c]);

export default function Index() {
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('fridge_table').select('*');
      if (error) console.error(error);
      else console.log(data);
    };

    fetchData();
  }, []);

  // Style

  const [selected, setSelected] = useState(1);

  //

  const [foodList, setFoodList] = useState([]);

  const [newFood, setNewFood] = useState("");

  const [userNameFood, setUserNameFood] = useState('');

  const fetchFoods = async () => {
    const {data, error} = await supabase.from('fridge_table').select("*");
    if(error){
      console.log("Probleme de fetch : ", error);
    } else {
      setFoodList(data);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const addFood = async () => {
    const newFoodData = {
      food_name: userNameFood,
      isOpened: false,
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
       <Text>Supabase setup done!</Text>
       <TextInput 
       style={{
        borderColor: 'gray',
        borderWidth: 1
       }}
       placeholder="Votre aliment..." 
       value={userNameFood} 
       onChangeText={setUserNameFood} 
       />
       <Button title="Ajoutez !" onPress={addFood}></Button>
       <ItemContainer>
        {foodList.map((food, index) => (
          <ItemBox key={index} selected={food.id === selected} onPress={() => setSelected(food.id)}>
            <ItemIcon>{food.id}</ItemIcon>
            <ItemName >{food.food_name}</ItemName>
          </ItemBox>
        ))}
       </ItemContainer>
    </View>
  );
}


/*
<ItemContainer>
  {items.map((item) => (
    <ItemBox key={item.id} selected={item.id === selected} onPress={() => setSelected(item.id)}>
      <ItemIcon>{item.icon}</ItemIcon>
      <ItemName selected={item.id === selected}>{item.name}</ItemName>
    </ItemBox>
  ))}
</ItemContainer>

<FlatList 
  data={foodList}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
  <Text style={{ fontSize: 18, padding: 5 }}>• {item}</Text>
  )}
/>
*/

// Style
const ItemContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 90%;
  margin-top: 16px;
`;

const ItemBox = styled.TouchableOpacity`
  width: 48%;
  height: 100px;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: ${({ selected }) => (selected ? '#6b46c1' : '#e5e7eb')};
  flex-direction: row;
  align-items: center;
`;

const ItemIcon = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`;

const ItemName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ selected }) => (selected ? 'white' : '#6b7280')};
`;

const ToggleText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ active }) => (active ? '#6b46c1' : '#6b7280')};
  text-align: center;
`;