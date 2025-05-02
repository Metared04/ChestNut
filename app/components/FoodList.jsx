import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import supabase from '../services/supabase';
import Food from '../models/Food';
import allService from "../services/allService";

const FoodList = ({ renderItem }) => {
    const [foodList, setFoodList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selected, setSelected] = useState(null);

    const fetchFoods = async () => {
        try {
            setRefreshing(true);
            const { data, error } = await supabase.from("all_food_table").select("*");
            if (error) {
                console.log("Erreur avec le fetch : ", error);
            } else {
                const allFoodInstances = data.map(food =>
                    new Food(
                        food.food_id,
                        food.food_name,
                        food.food_brand,
                        food.food_registered_date,
                        food.food_opening_date,
                        food.food_expiration_date,
                        food.food_bar_code,
                        food.food_qty,
                        food.food_is_opened,
                        food.food_storage_location_id
                    )
                );
                setFoodList(allFoodInstances);
            }
        } catch (err) {
            console.error("Erreur pendant le fetch :", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);
    
    const deleteFood = async (foodId) => {
        const { error } = await allService.deleteFood(foodId);
    
        if (error) {
            console.log("Erreur dans la suppression :", error);
        } else {
            setFoodList((prev) => prev.filter((food) => food.foodId !== foodId));
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#d700e1" />;
    }


    if (!foodList || foodList === 0){
        console.log("c'est vide.");
        return <Text>Il n'y a pas encore d'aliment.</Text>
    } else {
        //Tout va bien.
    }


    const toggleFoodState = async (foodId, location) => {
        const { error } = await allService.updatedFoodState(foodId, location);
        if (!error) {
            const updatedList = foodList.map(food =>
                food.foodId === foodId ? { ...food, foodLocation: !location } : food
            );
            setFoodList(updatedList);
        }
    };
    
    if (loading) return <ActivityIndicator size="large" color="#6b46c1" />;
    if (foodList.length === 0) return <Text>Aucun aliment trouvé.</Text>;
    
    return (
        <FlatList
            data={foodList}
            keyExtractor={(item) => item.foodId.toString()}
            renderItem={({ item }) => renderItem({ item, deleteFood, toggleFoodState })}
            refreshing={refreshing}
            onRefresh={fetchFoods}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
};

export default FoodList;