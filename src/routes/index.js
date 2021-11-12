import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';

const HomeScreen = () => {
    return <View><Text>Home Screen</Text></View>
}
const SettingsScreen = () => {
    return <View><Text>Settings Screen</Text></View>
}
const Stack = createNativeStackNavigator();

const MyStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MyStack;
