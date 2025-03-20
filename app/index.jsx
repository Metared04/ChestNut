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
        <Text>Bienvenue</Text>
        <Text>Inserer le prenom de l'utilisateur ici</Text>
        <Button onPress={() => console.log("Je veux voir les parametres.")} title="Options"/>
        <Button onPress={() => console.log("Je veux ajouter un foyer")} title="Ajouter un foyer"/>
        <Button onPress={() => console.log("Ca depend.")} title="Ajouter un frigo / congelateur"/>
                
    </View>
  );
}