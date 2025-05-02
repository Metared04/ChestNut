import React from 'react';
import { ScrollView } from 'react-native';
import AddFoodMain from '../components/AddFood/AddFoodMain';
import PreviousScreenButton from '../components/PreviousScreenButton';

function AddFoodScreen (){
    return (
        <ScrollView>
            <PreviousScreenButton/>
            <AddFoodMain />
        </ScrollView>
    );
};

export default AddFoodScreen;