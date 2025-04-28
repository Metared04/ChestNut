import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import allService from "../services/allService";
import { use } from 'react';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ShowHousesAndFurnitures = ({ userId/*, navigation*/ }) => {
    const [houses, setHouses] = useState([]);

    useEffect(() => {
        const loadHousesAndFurnitures = async () => {
            const housesData = await allService.fetchUserHousesWithFurnitureAndFoods(userId);
            setHouses(housesData);
            //console.log("donnees : ", housesData);
        };
        
        loadHousesAndFurnitures();
    }, []);

    const renderFurnitureIcon = (typeId) => {
        switch (typeId) {
          case 1: // Frigo
            return <MaterialCommunityIcons name="fridge-outline" size={16} color="#555" style={styles.icon} />;
          case 2: // Congélateur
            return <FontAwesome5 name="snowflake" size={16} color="#00BFFF" style={styles.icon} />;
          default:
            return <FontAwesome5 name="question-circle" size={16} color="#aaa" style={styles.icon} />;
        }
    };

    const renderItem = ({ item }) => (
        <View>
            <TouchableOpacity
                style={styles.houseCard}
                onPress={() => navigation.navigate("HouseDetail", { house: item })}
            >
            <View style={styles.iconText}>
                <FontAwesome5 name="home" size={18} color="#333" style={styles.icon} />
                <Text style={styles.houseName}>{item.user_house_name}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.furnitureCard}
        >
            {item.all_user_furniture_table.length > 0 ? (
                item.all_user_furniture_table?.map((furniture) => (
                    <View key={furniture.user_furniture_id} style={styles.iconText}>
                        {renderFurnitureIcon(furniture.user_furniture_type_id)}
                        <Text style={styles.furnitureName}>{furniture.user_furniture_name}</Text>
                        <Text style={styles.furnitureArticlesNumber}>
                            {furniture.food_table?.length ?? 0} article(s)
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={styles.noFurniture}>Aucun meuble</Text>
                )}
            </TouchableOpacity>
        </View>
    );
    /*
    useEffect(() => {
        const loadHousesAndFurnitures = async () => {
            const housesData = await allService.fetchUserHouses(userId);
            //const furnituresData = await allService.getFurnitureByHouseId();
            setHouses(housesData);
            console.log("donnees : ", housesData.length);
            console.log("do : ", housesData[0].user_house_id);
        };
        
        loadHousesAndFurnitures();
    }, []);
    useEffect(() => {
        const loadFurnitures = async () => {
            const furnituresData = await allService.getFurnitureByHouseId(houseId);
            setFurnitures(furnituresData);
        }

    })
        fetchUserHousesWithFurniture
    */
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    houseCard: {
        backgroundColor: "#ececec",
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
    },
    houseName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    furnitureCard: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        marginBottom: 6,
        borderRadius: 10,
    },
      furnitureName: {
        fontSize: 15,
        fontWeight: "500",
        color: "#333",
      },
      
      furnitureArticlesNumber: {
        color: "gray",
        fontSize: 12,
        marginTop: 2,
      },
    noFurniture: {
        fontStyle: "italic",
        fontSize: 14,
        color: "gray",
        paddingLeft: 10,
    },
    iconText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        marginRight: 8,
    },
});

export default ShowHousesAndFurnitures;

/*
const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.houseCard}
            onPress={() => navigation.navigate('HouseDetail', { house: item })}
        >
            <Text style={styles.houseName}>{item.user_house_name}</Text>
        </TouchableOpacity>
    );

<View style={styles.container}>
            <Text style={styles.title}>Mes Maisons</Text>
            <FlatList
                data={houses}
                keyExtractor={(item) => item.user_house_id.toString()}
                renderItem={renderItem}
            />
        </View>
*/