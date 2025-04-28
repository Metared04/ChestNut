import { Pressable, StyleSheet } from "react-native";

import React, { useEffect, useState } from 'react';

import { useCameraPermissions } from "expo-camera";
//import { BarCodeScanner } from "expo-barcode-scanner";


function ScanBarCodeCamera() {
    const  [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState("Pas encore scanné.");
    const [barCodeData, setBarCodeData] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setBarCodeData(data);
        alert(`Code scanné : ${data}`);
    };

    if (hasPermission === null) return <Text>Demande d'autorisation...</Text>;
    if (hasPermission === false) return <Text>Accès à la caméra refusée</Text>;

    return (
        <View>
            <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.scanner}
            />
            {scanned && <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />}
            {barCodeData && <Text style={styles.text}>Code scanné : {barCodeData}</Text>}
            <Button title="Retour" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scanner: { flex: 1 },
    text: { textAlign: "center", marginVertical: 10, fontSize: 16 }
});

export default ScanBarCodeCamera;