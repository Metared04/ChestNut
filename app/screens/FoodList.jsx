import React, { useEffect, useState } from 'react';

import { Text, View, TextInput, Button, ActivityIndicator, FlatList } from "react-native";

import { supabase } from '../services/supabase';

const FoodList = () => {
    const [foodList, setFoodList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFoods = async () => {
        try{
            const {data, error} = await supabase.from("fridge_table").select("*");
            if (error) {
                console.log("Erreur avec le fetch : ", error)
            } else {
                setFoodList(data);
            }
        } catch (erreur) {
            console.error("Oops ! Comme un problème : ", erreur);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchFoods();
    }, []);
    
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    
    return (
        <View>
            {foodList.length === 0 ? (
                <Text>Il n'y pas d'aliment ici :(</Text>
            ) : (
                <FlatList 
                    data={foodList}
                    keyExtractor={(item) => item.food_id.toString()}
                    renderItem={({ item }) => (
                        <View style={{ padding: 10, borderBottomWidth: 1}}>
                            <Text>{item.food_name} - {item.food_brand}</Text>
                            <Text>Jour restant :</Text>
                            <Text>Quantité : {item.food_qty}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default FoodList;