import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React, { StrictMode } from "react";

import ManageFoodScreen from './screens/ManageFoodScreen';
import AllFoodScreen from './screens/AllFoodScreen';
import HomeScreen from './screens/HomeScreen';
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
*/
      <StrictMode>
              <AllFoodScreen/>
      </StrictMode>
  );
}