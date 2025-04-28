import React, { useEffect, useState } from 'react';

import { Text, View, Button } from "react-native";
//import { useNavigation } from '@react-navigation/native';

import { useRouter } from 'expo-router';

const ScanBarCodeButton = () => {
    const router = useRouter();

    return (
        <View>
            <Button title="Scanner un code barre !" onPress={() => router.push('/scan-camera')} />
        </View>
    );
};

export default ScanBarCodeButton;