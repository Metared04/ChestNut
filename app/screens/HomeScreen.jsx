import { Text, View, TextInput, Button, FlatList, Animated } from "react-native";

import { useEffect, useState, useRef } from 'react';

import { supabase } from "../services/supabase";

import Container from "../components/Container";
import Header from "../components/Header";
import ItemList from "../components/Item";
import Toggle from "../components/Toggle";

import Food from "../models/Food";

import { StatusBar } from "expo-status-bar";

function HomeScreen() {
    const [selected, setSelected] = useState(1);
    const [isFridge, setIsFridge] = useState(true);
    const [expiringFoods, setExpiringFoods] = useState([]);
    const slideAnim = useRef(new Animated.Value(0)).current;
    
    const toggleFridgeFreezer = () => {
        Animated.timing(slideAnim, {
        toValue: isFridge ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
        }).start();
       setIsFridge(!isFridge);
    };

    const fetchExpiringFoods = async () => {
        const { data, error } = await supabase.from("all_food_table").select("*");
    
        if (error) {
          console.error("Erreur de fetch des aliments :", error);
          return;
        }
    
        const foodInstances = data.map(
          (food) =>
            new Food(
              food.food_id,
              food.food_name,
              food.food_brand,
              food.food_registered_date,
              food.food_opening_date,
              food.food_expiration_date,
              food.food_bar_code,
              food.food_qty,
              food.food_is_opened
            )
        );
        
        const expiring = foodInstances
        .filter((item) => item.foodIsAlmostExpired())
        .sort((a, b) => a.getNumberOfValidityDays() - b.getNumberOfValidityDays());
    
      const notExpiringYet = foodInstances
        .filter((item) => !item.foodIsAlmostExpired())
        .sort((a, b) => a.getNumberOfValidityDays() - b.getNumberOfValidityDays());
    
      const allFood = [...expiring, ...notExpiringYet];
    
        setExpiringFoods(allFood);
      };

    useEffect(() => {
        fetchExpiringFoods();
      }, []);

    return (
        <Container>
            <StatusBar style="dark" />
            <Header />
            {expiringFoods.length === 0 ? (
                <Text>Vous n'avez pas d'aliments encore :(</Text>
            ) : (
                <ItemList items={expiringFoods} selected={selected} setSelected={setSelected} />
            )}
            <Toggle isFridge={isFridge} slideAnim={slideAnim} toggleFridgeFreezer={toggleFridgeFreezer} />
        </Container>
    );
}
// Mettre que les 4 premiers ligne par ligne
// Mettre 
// Peut etre essayer de faire une moyenne basse de duree de conso
// Preremplir le champ date de peremption avec ca 

export default HomeScreen;