import { Text, View, SafeAreaView, StatusBar as RNStatusBar, Animated } from "react-native";
import { useEffect, useState, useRef } from 'react';
import Container from "../components/Container";
import Header from "../components/Header";
import ItemList from "../components/Item";
import Toggle from "../components/Toggle";
import { StatusBar } from "expo-status-bar";

import allService from "../services/allService";
import buildUserFromData from "../builders/buildUserFromData";

function HomeScreen({ userId = 1 }) {
    const [selected, setSelected] = useState(null);
    const [isFridge, setIsFridge] = useState(true);
    const [expiringFoods, setExpiringFoods] = useState([]);
    const slideAnim = useRef(new Animated.Value(0)).current;

    const toggleFridgeFreezer = () => {
        Animated.timing(slideAnim, {
          toValue: isFridge ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setIsFridge(!isFridge);
    };

    const fetchExpiringFoods = async () => {
        try {
            const rawData = await allService.fetchAllUsersData(userId);
            //console.log("la reponse : ", rawData); 
            const user = buildUserFromData(rawData);
            
            const allFoods = user.getAllFoods();
            //console.log("=> ", allFoods);
            
            // On trie les aliments par date de péremption, ceux qui arrivent à échéance en premier
            const now = new Date();
            const sortedFoods = allFoods.sort((a, b) => {
                const aDate = new Date(a.foodExpirationDate);
                const bDate = new Date(b.foodExpirationDate);
            
                // Les aliments expirés ou proches de l’être passent en premier
                const aIsExpiringSoon = aDate <= now;
                const bIsExpiringSoon = bDate <= now;
            
                if (aIsExpiringSoon && !bIsExpiringSoon) return -1;
                if (!aIsExpiringSoon && bIsExpiringSoon) return 1;
            
                // Sinon tri classique par date de péremption croissante
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
                <Header />
                {expiringFoods.length === 0 ? (
                    <Text>Vous n'avez pas d'aliments encore :(</Text>
                ) : (
                    <ItemList items={expiringFoods} selected={selected} setSelected={setSelected} />
                )}
                <Toggle isFridge={isFridge} slideAnim={slideAnim} toggleFridgeFreezer={toggleFridgeFreezer} />
            </Container>
        </SafeAreaView>
    );
}

export default HomeScreen;