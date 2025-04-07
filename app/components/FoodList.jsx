import React, { useEffect, useState } from 'react';

import { Text, View, TextInput, Button, ActivityIndicator, FlatList } from "react-native";

import { supabase } from '../services/supabase';

import Food from '../models/Food';

import styled from "styled-components/native";

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
  background-color: ${({ selected }) => (selected ? "#6b46c1" : "#e5e7eb")};
  flex-direction: row;
  align-items: center;
`;

const ItemName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ selected }) => (selected ? "white" : "#6b7280")};
`;

const FoodList = () => {
    const [foodList, setFoodList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFoods = async () => {
        try{
            setRefreshing(true);
            const {data, error} = await supabase.from("fridge_table").select("*");
            if (error) {
                console.log("Erreur avec le fetch : ", error);
            } else {
                if (!Array.isArray(data)) {
                    console.log("Les données récupérées ne sont pas un tableau !");
                } else {
                    console.log("oui!")
                }
                console.log("data : ", data[0].food_id);
                const aFoodInstance = new Food(data[0].food_name, data[0].food_brand, data[0].food_registered_date);
                console.log(aFoodInstance);
                const allFoodInstances = data.map( food => 
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
                console.log("Notre tableau : ", allFoodInstances);
                setFoodList(allFoodInstances);
                console.log("Encore une fois :", foodList);
            }
        } catch (erreur) {
            console.error("Oops ! Comme un problème : ", erreur);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }
    
    useEffect(() => {
        fetchFoods();
    }, []);
    
    const deleteFood = async (foodId) => {
        const { error } = await supabase
          .from("fridge_table")
          .delete()
          .eq("food_id", foodId);
    
        if (error) {
          console.log("Erreur dans la suppression :", error);
        } else {
          setFoodList((prev) => prev.filter((food) => food.foodId !== foodId));
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!foodList || foodList === 0){
        console.log("c'est vide.")
        return <Text>Il n'y a pas encore d'aliment.</Text>
    } else {
        console.log("Tout va bien.")
    }

    const openingFood = async (food_id, food_is_opened) => {
        const {error} = await supabase
        .from("fridge_table")
        .update({food_is_opened: !food_is_opened})
        .eq("food_id", food_id);
  
        if (error) {
          console.log("Erreur dans la modification de l'etat d'un aliment : ", error);
        } else {
          const updatedFoodList = foodList.map((food) => 
            food.food_id === food_id ? {...food, food_is_opened: !food_is_opened} : food
          );
          setFoodList(updatedFoodList);
        }
      };
    
    return (
        <View style={{ flex: 1 }}>
            {foodList.length === 0 ? (
                <Text>Il n'y pas d'aliment ici :(</Text>
            ) : (
                <FlatList 
                    data={foodList}
                    keyExtractor={(item, index) => item.foodId ? item.foodId.toString() : index.toString()}

                    renderItem={({ item }) => {
                        console.log("Élément dans FlatList :", item);
                        if (!item || !item.foodId) {
                            console.warn("Élément invalide détecté :", item);
                            return null;
                        }
                    
                        return (
                            <View style={{ padding: 10, borderBottomWidth: 1 }}>
                                <ItemName>{item.foodName} - {item.foodBrand}</ItemName>
                                <Text>Jour restant : {item.getNumberOfValidityDays() < 0 ? 0 : item.getNumberOfValidityDays()}</Text>
                                <Text>Quantité : {item.foodQty}</Text>
                                <Button title={item.foodIsOpened ? "Déjà ouvert" : "Pas encore ouvert"} onPress={() => openingFood(item.foodId, item.foodIsOpened)} />
                                <Button title="Logo poubelle" onPress={() => deleteFood(item.foodId)}></Button>
                            </View>
                        );
                    }}
                    refreshing={refreshing}
                    onRefresh={fetchFoods}
                />
            )}
        </View>
    );
};

export default FoodList;