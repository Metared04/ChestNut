import { Text, View, SafeAreaView, Dimensions, StyleSheet, StatusBar as RNStatusBar, Animated, TouchableOpacity } from "react-native";
import { useState, useRef, useEffect } from 'react';
import Container from "../Container";
import ItemList from "../Item";

import Toggle from "../Toggle";
import HomeScreenToggleFridgeFreezer from "./HomeScreenToggleFridgeFreezer";

import HomeScreenToggleHousesMenu from "./HomeScreenToggleHousesMenu";

import ShowHousesAndFurnitures from "../ShowHousesAndFurnitures";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import HomeScreenStyles from "./HomeScreenStyles";

import HomeScreenMainContent from "./HomeScreenMainContent";
import HomeScreenHeaderMain from "./HomeScreenHeader/HomeScreenHeaderMain";

import allService from "../../services/allService";
import buildUserFromData from "../../builders/buildUserFromData";

const { height } = Dimensions.get('window');

const oiu = 1;

const HomeScreenMain = ({ navigation, userId }) => {
    const [selected, setSelected] = useState(null);
    const [isFridge, setIsFridge] = useState(true);
    const [expiringFoods, setExpiringFoods] = useState([]);
    const [userNick, setUserNick] = useState("Inconnue au bataillon");
    const [showHouses, setShowHouses] = useState(false);
    
    const slideAnim = useRef(new Animated.Value(0)).current;
    const menuSlideAnim = useRef(new Animated.Value(-height * 0.8)).current;
    
    

    const fetchExpiringFoods = async () => {
        try {
            const rawData = await allService.fetchAllUsersData(userId);
            
            console.log("donnée brut :", rawData.user_house_table);
            console.log("donnée brut 2 :", rawData.user_name);
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
                <Animated.View
                    style={[
                        styles.menuContainer,
                        {
                            transform: [{ translateY: menuSlideAnim }],
                            opacity: menuSlideAnim.interpolate({
                                inputRange: [-800, 0],
                                outputRange: [0, 1]
                            })
                        }
                    ]}
                >
                    <View style={{ height: 80 }} />
                    <ShowHousesAndFurnitures userId={userId} /*navigation={navigation}*/ />
                </Animated.View>

                <HomeScreenHeaderMain 
                    showHouses={showHouses} 
                    setShowHouses={setShowHouses} 
                    menuSlideAnim={menuSlideAnim} 
                    userNick={userNick}
                />
                
                <HomeScreenMainContent 
                    expiringFoods={expiringFoods} 
                    selected={selected} 
                    setSelected={setSelected}
                    isFridge={isFridge}
                    slideAnim={slideAnim}
                    HomeScreenToggleFridgeFreezer={HomeScreenToggleFridgeFreezer}
                    userId={userId}
                />
                
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

export default HomeScreenMain