import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import supabase from '../services/supabase';
import Food from '../models/Food';
import foodService from "../services/foodService";

const FoodList = ({ renderItem }) => {
    const [foodList, setFoodList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFoods = async () => {
        try{
            setRefreshing(true);
            const {data, error} = await supabase.from("all_food_table").select("*");
            if (error) {
                console.log("Erreur avec le fetch : ", error);
            } else {
                if (!Array.isArray(data)) {
                    console.log("Les données récupérées ne sont pas un tableau !");
                } else {
                    //console.log("oui!")
                }
                //console.log("data : ", data[0].food_id);
                //const aFoodInstance = new Food(data[0].food_name, data[0].food_brand, data[0].food_registered_date);
                //console.log(aFoodInstance);
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
                        food.food_is_opened,
                        food.food_storage_location_id
                    )
                );
                //console.log("Notre tableau : ", allFoodInstances);
                setFoodList(allFoodInstances);
                //console.log("Encore une fois :", foodList);
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
        const { error } = await foodService.deleteFood(foodId);
    
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
        //console.log("Tout va bien.")
    }


    const toggleFoodState = async (foodId, location) => {
        const { error } = await foodService.updatedFoodState(foodId, location);
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

/*
 <View style={{ backgroundColor: "#8027d6", padding: 10, borderWidth: 1, borderColor: "#8027d6", borderRadius: 50, width: '50%', justifyContent: 'space-between',flexDirection: 'row', marginTop: 5 }}>
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
  color: ${({ selected }) => (selected ? "white" : "#FFFFFF")};
`;
//all_food_table     

const styles = StyleSheet.create({
    button: {
      width: '5%',
      height: '25%',
      backgroundColor: '#f00',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
  });

const statStyles = StyleSheet.create({
    button: {
        width: '35%',
        height: '25%',
        backgroundColor: '#004fe2',
        justifyContent: 'center',
        alignItems: 'right',
        borderRadius: 10,
    },
});

const openingFood = async (foodId, isOpened) => {
        const { error } = await foodService.updatedFoodState(foodId, isOpened);
        if (error) {
            console.log("Erreur dans la modification :", error);
        } else {
            const updatedFoodList = foodList.map((food) =>
                food.foodId === foodId ? { ...food, foodIsOpened: !isOpened } : food
            );
            setFoodList(updatedFoodList);
            }
        };

*/