import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function () {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{
                tabBarActiveBackgroundColor: '#db524d',
                headerShown: false,
                tabBarItemStyle: {
                    border: 'none',
                    borderWidth: 0,
                    borderColor: 'green',
                    backgroundColor: '#db524d',
                },
                tabBarStyle: [
                    {
                        display: 'flex',
                        backgroundColor: 'red',
                        borderTopWidth: 0,
                    },
                ],
            }} >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
