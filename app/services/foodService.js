import { supabase } from './supabase';

import { useEffect, useState } from 'react';

const [foodList, setFoodList] = useState([]);

const [newFood, setNewFood] = useState("");

const fetchFoods = async () => {
    const {data, error} = await supabase.from('fridge_table').select("*");
    if(error){
        console.log("Probleme de fetch : ", error);
    } else {
        setFoodList(data);
    }
};

const addFood = async () => {
    const newFoodData = {
        food_name: userNameFood,
        isOpened: false,
    };
    const {data, error} = await supabase
    .from("fridge_table")
    .insert([newFoodData])
    .select() 
    .single();
    
    if(error){
        console.log("Probleme d'ajout : ", error);
    } else {
        setFoodList((prev) => [...prev, data]);
        setNewFood("");
    }
};

//export default { fetchFoods, addFood };