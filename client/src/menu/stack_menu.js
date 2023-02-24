import React, { Component } from "react";
import { View, FlatList, StyleSheet, Text } from 'react-native';
//Stack
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../main/home";
import CarNoCamera from "../main/camera_car_no";

const NativeStack = createNativeStackNavigator();

class Stack extends Component {

    render() {
        return (
            <NativeStack.Navigator initialRouteName="Home"
                screenOptions={{
                    headerTitleAlign: 'center',
                }}>

                <NativeStack.Screen name="Home" component={Home}
                    options={{headerShown:false}} />
                <NativeStack.Screen name="CarNoCamera" component={CarNoCamera}
                    options={{ title: "자동차번호판", }} />

            </NativeStack.Navigator>
        );
    }

}
export default Stack;