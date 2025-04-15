import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import FoodList from '../components/FoodList';

function AllFoodScreen (){
    const renderFoodItem = ({ item, deleteFood }) => (
        <View style={styles.card}>
            <View style={styles.left}>
                <MaterialCommunityIcons
                    name={item.foodLocation === 1 ? "fridge-outline" : "snowflake"}
                    size={24}
                    color="#a855f7"
                    style={{ marginRight: 10 }}
                />
                <Text style={styles.name}>{item.foodName}</Text>
            </View>
            <View style={styles.right}>
                <Text style={styles.days}>{Math.max(item.getNumberOfValidityDays(), 0)} days left</Text>
                <TouchableOpacity onPress={() => deleteFood(item.foodId)}>
                    <FontAwesome name="trash" size={18} color="#f87171" />
                </TouchableOpacity>
            </View>
        </View>
    );
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity >
                    <Ionicons name="chevron-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Chest Nut</Text>
            </View>
            <View style={styles.container}>
                <FoodList renderItem={renderFoodItem} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        gap: 8,
    },
    container: {
        padding: 16,
        backgroundColor: "#fff",
        flex: 1,
    },
    card: {
        backgroundColor: "#efeeee",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
    },
    right: {
        alignItems: "flex-end",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
    },
    days: {
        fontSize: 14,
        color: "#7e7e80",
        marginBottom: 4,
    },
});

export default AllFoodScreen;