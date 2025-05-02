import React from 'react';
import { ScrollView } from 'react-native';

import HomeScreenMain from "../components/HomeScreen/HomeScreenMain";

const userId = 1;

function HomeScreen (){
    return (
        <ScrollView>
            <HomeScreenMain userId={userId}/>
        </ScrollView>
    );
}

export default HomeScreen;