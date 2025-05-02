import { Text, View, SafeAreaView, StatusBar as RNStatusBar, Animated, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useEffect, useState, useRef } from 'react';
import Container from "../components/Container";
import ItemList from "../components/Item";
import Toggle from "../components/Toggle";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import ShowHousesAndFurnitures from "../components/ShowHousesAndFurnitures";
import allService from "../services/allService";
import buildUserFromData from "../builders/buildUserFromData";

const { height } = Dimensions.get('window');

function HomeScreen({ navigation, userId = 1 }) {
    const [selected, setSelected] = useState(null);
    const [isFridge, setIsFridge] = useState(true);
    const [expiringFoods, setExpiringFoods] = useState([]);
    const [userNick, setUserNick] = useState("Inconnue au bataillon");
    const [showHouses, setShowHouses] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const menuSlideAnim = useRef(new Animated.Value(-height * 0.8)).current;
    
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
        Animated.timing(menuSlideAnim, {
            toValue: showHouses ? -height * 0.8 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const fetchExpiringFoods = async () => {
        try {
            const rawData = await allService.fetchAllUsersData(userId);
            //console.log("donnee brut :", rawData.user_house_table);
            //console.log("donnee brut 2 :", rawData.user_name);
            setUserNick(rawData.user_name);
            const user = buildUserFromData(rawData);
            const allFoods = user.getAllFoods();
            const allFurnitures = user.getAllFurnitures();
            const allHouses = user.getHousesList();
            console.log("les meubles => ", allFurnitures);
            console.log("les maisons => ", allHouses);
            
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
                {/* Menu qui slide depuis le haut */}
                <Animated.View 
                    style={[
                        styles.menuContainer,
                        {
                            transform: [{ translateY: menuSlideAnim }],
                            opacity: menuSlideAnim.interpolate({
                                inputRange: [-height * 0.8, 0],
                                outputRange: [0, 1]
                            })
                        }
                    ]}
                >
                    <View style={{ height:80 }} /> 
                    <ShowHousesAndFurnitures userId={userId} navigation={navigation} />
                </Animated.View>

                {/* Header toujours visible, même quand le menu est ouvert */}
                <View style={[styles.header, { zIndex: 101 }]}>
                    <View style={styles.headerSide}>
                        <TouchableOpacity onPress={toggleHousesMenu} style={styles.circleButton}>
                            <FontAwesome name={showHouses ? "times" : "bars"} size={24} color="black" />
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
                
                {/* Contenu principal toujours visible */}
                <View style={styles.mainContent}>
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
                </View>
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
        width: '100%',
        zIndex: 101,  // Valeur plus élevée pour toujours être au-dessus du menu
        position: 'relative'
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
    mainContent: {
        flex: 1,
        width: '100%'
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
    },
    menuContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
        height: height * 0.8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        zIndex: 100
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
        marginTop: 50 // Augmenté pour laisser de la place au header toujours visible
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default HomeScreen;