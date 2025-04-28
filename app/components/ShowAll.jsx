import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import allService from "../services/allService";

const ShowAll = () => {
    useEffect(() => {
        const loadData = async () => {
            const userFullData = await allService.fetchAllUsersData(1);
            console.log(userFullData);
        };
      
        loadData();
    }, []);
};

export default ShowAll