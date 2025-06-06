import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import HomeScreen from "../Screen/HomeScreen";
import StackScreen from "../Screen/StackScreen";
import SettingsScreen from "../Screen/SettingScreen";
import DetailsScreen from "../Screen/DetailsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const homeStackNavigator = createNativeStackNavigator(); 


function MyStacks(){
    return (
        <homeStackNavigator.Navigator initialRouteName="Home">
            <homeStackNavigator.Screen name="Home" component={HomeScreen} />
            <homeStackNavigator.Screen name="Details" component={DetailsScreen} />
            <homeStackNavigator.Screen name="Stack" component={StackScreen} />
        </homeStackNavigator.Navigator>
    );
}


const Tab = createBottomTabNavigator();

function MyTabs(){
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={MyStacks} 
                options={
                    {
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign name="home" size={24} color="black" />
                        )
                    }
                } />

            <Tab.Screen name="Stack" component={StackScreen} 
                options={
                    {
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="layers" size={24} color="black" />
                        )
                    }
                } />
            <Tab.Screen name="Settings" component={SettingsScreen} 
            
                options={
                    {
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign name="setting" size={24} color="black" />
                        )
                    }
                } />
            <Tab.Screen name="Details" component={DetailsScreen} 
                options={
                    {
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="information-circle" size={24} color="black" />
                        )
                    }
                } />
        </Tab.Navigator>
    );
}


export default function Navigation() {
    return (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    );
}