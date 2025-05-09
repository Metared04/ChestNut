import { View, StyleSheet } from "react-native";

import HomeScreenBurgerButton from "./HomeScreenBurgerButtonComponent";
import HomeScreenTitleContainer from "../HomeScreenTitleContainer";
import HomeScreenParameterButton from "./HomeScreenParameterButton";

function HomeScreenHeaderMain({ showHouses, setShowHouses, menuSlideAnim, userNick}) {
    return (
        <View style={styles.header}>

            <HomeScreenBurgerButton showHouses={showHouses} setShowHouses={setShowHouses} menuSlideAnim={menuSlideAnim}/>
    
            <HomeScreenTitleContainer userNick={userNick}/>
                        
            <HomeScreenParameterButton />
                        
        </View>
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
});

export default HomeScreenHeaderMain