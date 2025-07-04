import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importar pantallas
import ClientListScreen from "../Screen/ClientListScreen";
import ClientScreen from "../Screen/ClientScreen";
import DetailsScreen from "../Screen/DetailsScreen";
import ClientRegisterScreen from "../Screen/ClientRegisterScreen";
import ClientUpdateScreen from "../Screen/ClientUpdateScreen";

// Tipos de navegación
export type ClientStackParamList = {
    ClientList: undefined;
    Client: undefined;
    Details: { id: string };
    ClientRegister: undefined;
    ClientUpdate: { id: string };
};

const ClientStackNavigator = createNativeStackNavigator<ClientStackParamList>(); 

function ClientStack() {
    return (
        <ClientStackNavigator.Navigator initialRouteName="Client">
            <ClientStackNavigator.Screen 
                name="ClientList" 
                component={ClientListScreen}
                options={{ title: 'Lista de Clientes' }}
            />
            <ClientStackNavigator.Screen 
                name="Client" 
                component={ClientScreen}
                options={{ title: 'Gestión de Clientes' }}
            />
            <ClientStackNavigator.Screen 
                name="Details" 
                component={DetailsScreen}
                options={{ title: 'Detalles del Cliente' }}
            />
            <ClientStackNavigator.Screen 
                name="ClientRegister" 
                component={ClientRegisterScreen}
                options={{ title: 'Nuevo Cliente' }}
            />
            <ClientStackNavigator.Screen 
                name="ClientUpdate" 
                component={ClientUpdateScreen}
                options={{ title: 'Editar Cliente' }}
            />
        </ClientStackNavigator.Navigator>
    );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
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