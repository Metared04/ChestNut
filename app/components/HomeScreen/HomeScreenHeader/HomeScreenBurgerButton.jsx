import { View, StyleSheet } from "react-native";

import HomeScreenBurgerButtonComponent from "./HomeScreenBurgerButtonComponent";

function HomeScreenBurgerButton({showHouses, setShowHouses, menuSlideAnim}) {
    return (
        <View style={styles.headerSide}>
            <HomeScreenBurgerButtonComponent showHouses={showHouses} setShowHouses={setShowHouses} menuSlideAnim={menuSlideAnim}/>
        </View>
    );
}

export default HomeScreenBurgerButton;

const styles = StyleSheet.create({
    headerSide: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
})