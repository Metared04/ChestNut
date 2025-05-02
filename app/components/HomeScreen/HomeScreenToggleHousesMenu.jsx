const HomeScreenToggleHousesMenu = ({showHouses, setShowHouses}) => {
    setShowHouses(!showHouses);
    Animated.timing(menuSlideAnim, {
        toValue: showHouses ? -height * 0.8 : 0,
        duration: 300,
        useNativeDriver: true,
    }).start();
};

export default HomeScreenToggleHousesMenu;