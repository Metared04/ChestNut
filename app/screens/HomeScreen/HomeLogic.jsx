// HomeLogic.jsx
import { useState, useEffect, useRef } from 'react';
import { Dimensions, Animated } from 'react-native';
import allService from '../../services/allService';
import buildUserFromData from '../../builders/buildUserFromData';

const { height } = Dimensions.get('window');

export function useHomeLogic(userId, selected, setSelected) {
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

    useEffect(() => {
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

        fetchExpiringFoods();
    }, []);

    return {
        isFridge,
        expiringFoods,
        userNick,
        showHouses,
        slideAnim,
        menuSlideAnim,
        toggleFridgeFreezer,
        toggleHousesMenu
    };
}
