import { Text, View, SafeAreaView, StatusBar as RNStatusBar, Animated, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState, useRef } from 'react';
import Container from "../components/Container";
import ItemList from "../components/Item";
import Toggle from "../components/Toggle";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ShowHousesAndFurnitures from "../components/ShowHousesAndFurnitures";
import allService from "../services/allService";
import buildUserFromData from "../builders/buildUserFromData";

function HomeScreen({ navigation, userId = 1 }) {
    const [selected, setSelected] = useState(null);
    const [isFridge, setIsFridge] = useState(true);
    const [expiringFoods, setExpiringFoods] = useState([]);
    const [userNick, setUserNick] = useState("Inconnue au bataillon");
    const [showHouses, setShowHouses] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    
    const toggleFridgeFreezer = () => {
        Animated.timing(slideAnim, {
            toValue: isFridge ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsFridge(!isFridge);
    };

    const toggleHousesMenu = () => {
        setShowHouses(!showHouses);
    };

    const fetchExpiringFoods = async () => {
        try {
            const rawData = await allService.fetchAllUsersData(userId);
            setUserNick(rawData.user_name);
            const user = buildUserFromData(rawData);
            const allFoods = user.getAllFoods();            
            
            const now = new Date();
            const sortedFoods = allFoods.sort((a, b) => {
                const aDate = new Date(a.foodExpirationDate);
                const bDate = new Date(b.foodExpirationDate);
            
                const aIsExpiringSoon = aDate <= now;
                const bIsExpiringSoon = bDate <= now;
            
                if (aIsExpiringSoon && !bIsExpiringSoon) return -1;
                if (!aIsExpiringSoon && bIsExpiringSoon) return 1;
            
                return aDate - bDate;
            });
            
            const limitedFoods = sortedFoods.slice(0, 4);
            setExpiringFoods(limitedFoods);

            if (limitedFoods.length > 0 && !selected) {
                setSelected(limitedFoods[0].foodId);
            }
        } catch (error) {
            console.error("Erreur chargement aliments expirants :", error);
        }
    };

    useEffect(() => {
        fetchExpiringFoods();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <RNStatusBar barStyle="dark-content" />
            <Container>
                <View style={styles.header}>
                    <View style={styles.headerSide}>
                        <TouchableOpacity onPress={toggleHousesMenu} style={styles.circleButton}>
                            <FontAwesome name="bars" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.titleContainer}>
                        <Text style={styles.welcomeText}>Bienvenue</Text>
                        <Text style={styles.nameText}>{userNick}</Text>
                    </View>
                    
                    <View style={styles.headerSide}>
                        <TouchableOpacity style={styles.circleButton}>
                            <MaterialIcons name="settings" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                
                {showHouses ? (
                    <ShowHousesAndFurnitures userId={userId} navigation={navigation} />
                ) : (
                    <>
                        <Text style={styles.wasteText}>Don't let these go to waste.</Text>
                        
                        {expiringFoods.length === 0 ? (
                            <Text style={styles.noFoodText}>Vous n'avez pas d'aliments encore :(</Text>
                        ) : (
                            <ItemList items={expiringFoods} selected={selected} setSelected={setSelected} />
                        )}
                        
                        <Toggle 
                            isFridge={isFridge} 
                            slideAnim={slideAnim} 
                            toggleFridgeFreezer={toggleFridgeFreezer} 
                            userId={userId}
                        />
                    </>
                )}
            </Container>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 10,
        width: '100%'
    },
    headerSide: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20
    },
    titleContainer: {
        alignItems: 'center',
        flex: 1
    },
    welcomeText: {
        color: '#777',
        fontSize: 14
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    wasteText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 15
    },
    noFoodText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#777'
    }
});

export default HomeScreen;