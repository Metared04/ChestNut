import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import allService from "../services/allService";

const ShowFood = ({ furnitureId/*, navigation*/ }) => {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        const loadFurnitures = async () => {
            const data = await allService.getFoodsByFurnitureId(furnitureId);
            setFoods(data);
        };
    
        loadFurnitures();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.foodCard}
            onPress={() => navigation.navigate('FurnitureDetail', { furniture: item })}
        >
            <Text style={styles.foodName}>{item.food_name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mon frigo</Text>
            <FlatList
                data={foods}
                keyExtractor={(item) => item.food_id.toString()}
                renderItem={renderItem}
            />
        </View>
      );
}

export default ShowFood;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    foodCard: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
    },
    foodName: {
        fontSize: 18,
    },
});