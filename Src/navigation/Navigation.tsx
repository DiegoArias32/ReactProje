import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import ClientScreen from "../Screen/ClientScreen";
import DetailsScreen from "../Screen/DetailsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Tipos de navegación
export type ClientStackParamList = {
    Client: undefined;
    Details: {id: string};
};

const clientStackNavigator = createNativeStackNavigator<ClientStackParamList>(); 

function ClientStack(){
    return (
        <clientStackNavigator.Navigator initialRouteName="Client">
            <clientStackNavigator.Screen 
                name="Client" 
                component={ClientScreen}
                options={{ title: 'Gestión de Clientes' }}
            />
            <clientStackNavigator.Screen 
                name="Details" 
                component={DetailsScreen}
                options={{ title: 'Detalles del Cliente' }}
            />
        </clientStackNavigator.Navigator>
    );
}

const Tab = createBottomTabNavigator();

function MyTabs(){
    return (
        <Tab.Navigator>
            <Tab.Screen 
                name="Clients" 
                component={ClientStack} 
                options={{
                    headerShown: false,
                    title: 'Clientes',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={24} color="black" />
                    )
                }} 
            />
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