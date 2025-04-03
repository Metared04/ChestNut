import { Text, View, TextInput, Button, FlatList } from "react-native";
import { Animated } from "react-native";

import React, { useState, useRef,useEffect  } from "react";

import { StatusBar } from "expo-status-bar";

import { supabase } from './supabase';
import styled from "styled-components/native";

import Container from "./components/Container";
import Header from "./components/Header";
import ItemList from "./components/Item";
import Toggle from "./components/Toggle";

import Inventory from './models/Inventory';
import Food from './models/Food';

const items = [
  { id: 1, name: "Bolognese", daysLeft: 1, icon: ":spaghetti:" },
  { id: 2, name: "Fresh Cream", daysLeft: 1, icon: ":milk:" },
  { id: 3, name: "Ground Beef", daysLeft: 3, icon: ":cut_of_meat:" },
  { id: 4, name: "Chicken", daysLeft: 3, icon: ":poultry_leg:" },
];

let a = new Food("Petit Beurre Pocket", "Belle France", "2025-04-01", null, "2025-10-01", "3258561020686", 1, true);
let b = new Food("Yop de wish", "Pâturage", "2025-04-17", null, "2025-04-19", "3250391693009", 1, true);
let c = new Food("Filet mignon", "", "2025-04-18", null, "2025-04-22", "", 2, false);

const aFridge = new Inventory(3, [a,b,c]);

export default function App() {
  const [selected, setSelected] = useState(1);
  const [isFridge, setIsFridge] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleFridgeFreezer = () => {
    Animated.timing(slideAnim, {
      toValue: isFridge ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsFridge(!isFridge);
  };

  // ----------------------------- DB

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('fridge_table').select('*');
      if (error) console.error(error);
      else console.log(data);
    };

    fetchData();
  }, []);

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

  // -----------------------------

  return (
    <Container>
      <StatusBar style="dark" />
      <Header />
      <ItemList items={items} selected={selected} setSelected={setSelected} />
      <Toggle isFridge={isFridge} slideAnim={slideAnim} toggleFridgeFreezer={toggleFridgeFreezer} />
    </Container>
  );
}