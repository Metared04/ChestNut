// HomeFront.jsx
import { Text, View, SafeAreaView, StatusBar as RNStatusBar, Animated, TouchableOpacity } from "react-native";
import { useState } from 'react';
import Container from "../../components/Container";
import ItemList from "../../components/Item";
import Toggle from "../../components/Toggle";
import ShowHousesAndFurnitures from "../../components/ShowHousesAndFurnitures";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import styles from "./HomeStyle";
import { useHomeLogic } from "./HomeLogic";

function HomeScreen({ navigation, userId = 1 }) {
    const [selected, setSelected] = useState(null);

    const {
        isFridge,
        expiringFoods,
        userNick,
        showHouses,
        slideAnim,
        menuSlideAnim,
        toggleFridgeFreezer,
        toggleHousesMenu
    } = useHomeLogic(userId, selected, setSelected);

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
                    <ShowHousesAndFurnitures userId={userId} navigation={navigation} />
                </Animated.View>

                <View style={styles.header}>
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

export default HomeScreen;