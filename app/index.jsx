import { View, Text, Alert, Button, TextInput } from "react-native";
import React from 'react';

//------------------- data :

class User
{
	constructor( userName = "Unknown", userEmail="Aucun")
	{
		this.userName = userName;
		this.userEmail = userEmail;
	}
}

export default function HomeScreen() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' }}
      >
        <Text>Bienvenue dans mon app React Native !</Text>
        <Button onPress={() => console.log("Oui.")} title="lets go !"/>
        <Button onPress={() => console.log("Oui.")} title="Ajouter un foyer"/>
        <Button onPress={() => console.log("Oui.")} title="Ajouter un frigo / congelateur"/>
        <TextInput placeholder="Oui" editable textAlign="center"/>
    </View>
  );
}