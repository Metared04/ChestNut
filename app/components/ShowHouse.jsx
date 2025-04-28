import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import allService from "../services/allService";

const ShowHouse = ({ userId/*, navigation*/ }) => {
    const [houses, setHouses] = useState([]);

    useEffect(() => {
        const loadHouses = async () => {
            const data = await allService.fetchUserHouses(userId);
            setHouses(data);
            //console.log("donnees : ", data[0].user_house_id);
        };
        
        loadHouses();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.houseCard}
            onPress={() => navigation.navigate('HouseDetail', { house: item })}
        >
            <Text style={styles.houseName}>{item.user_house_name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Maisons</Text>
            <FlatList
                data={houses}
                keyExtractor={(item) => item.user_house_id.toString()}
                renderItem={renderItem}
            />
        </View>
      );
}

export default ShowHouse;

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
    houseCard: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
    },
    houseName: {
        fontSize: 18,
    },
});