import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import allService from "../services/allService";

const ShowFurniture = ({ houseId/*, navigation*/ }) => {
    const [furnitures, setFurnitures] = useState([]);

    useEffect(() => {
        const loadFurnitures = async () => {
            const data = await allService.getFurnitureByHouseId(houseId);
            setFurnitures(data);
        };
    
        loadFurnitures();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.furnitureCard}
            onPress={() => navigation.navigate('FurnitureDetail', { furniture: item })}
        >
            <Text style={styles.furnitureName}>{item.user_furniture_name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Meubles</Text>
            <FlatList
                data={furnitures}
                keyExtractor={(item) => item.user_furniture_id.toString()}
                renderItem={renderItem}
            />
        </View>
      );
}

export default ShowFurniture;

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
    furnitureCard: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
    },
    furnitureName: {
        fontSize: 18,
    },
});