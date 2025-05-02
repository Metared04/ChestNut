const HomeScreenToggleFridgeFreezer = () => {
    Animated.timing(slideAnim, {
        toValue: isFridge ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
    }).start();
    setIsFridge(!isFridge);
};

export default HomeScreenToggleFridgeFreezer;