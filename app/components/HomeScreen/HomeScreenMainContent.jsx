import { View, Text, StyleSheet } from "react-native";

import ItemList from "../Item";

import Toggle from "../Toggle";

function HomeScreenMainContent({expiringFoods, selected, setSelected, isFridge, slideAnim, HomeScreenToggleFridgeFreezer, userId}) {
    return (
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
                HomeScreenToggleFridgeFreezer={HomeScreenToggleFridgeFreezer}
                userId={userId}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
})

export default HomeScreenMainContent;