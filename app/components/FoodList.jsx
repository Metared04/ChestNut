import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from "react-native";
import supabase from '../services/supabase';
import Food from '../models/Food';
import ItemList from '../components/Item'; // ⚠️ Assure-toi du bon chemin

const FoodList = () => {
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
                        food.food_id,  // Vérifie que le modèle Food utilise food_id et pas food_id
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

    const deleteFood = async (food_id) => {
        const { error } = await supabase
            .from("all_food_table")
            .delete()
            .eq("food_id", food_id); // Assure-toi que l'attribut dans ta base de données est food_id

        if (error) {
            console.log("Erreur dans la suppression :", error);
        } else {
            setFoodList(prev => prev.filter(food => food.food_id !== food_id)); // Modifié ici pour food_id
            if (selected === food_id) setSelected(null); // Reset sélection si supprimé
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!foodList || foodList.length === 0) {
        return <Text>Il n'y a pas encore d'aliment.</Text>;
    }

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <ItemList
                items={foodList}
                selected={selected}
                setSelected={setSelected}
                onDelete={deleteFood}
            />
        </View>
    );
};

export default FoodList;
