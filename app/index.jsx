import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React, { StrictMode } from "react";

import ManageFoodScreen from './screens/ManageFoodScreen';
import HomeScreen from './screens/HomeScreen';
import AddFoodScreen from './screens/AddFoodScreen';
import ScanBarCodeCamera from './ScanBarCodeCamera';
import { View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
       /*
<Stack.Navigator initialRouteName="Home">
<Stack.Screen name="Home" component={ManageFoodScreen} />
<Stack.Screen name="ScanCamera" component={ScanBarCodeCamera} />
</Stack.Navigator>
import HomeScreen from './screens/HomeScreen';
*/
      <StrictMode>
              <AddFoodScreen/>
      </StrictMode>
  );
}