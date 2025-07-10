// Src/navigation/Navigation.tsx
import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importar pantallas de Clientes
import ClientListScreen from "../Screen/ClientListScreen";
import ClientScreen from "../Screen/ClientScreen";
import DetailsScreen from "../Screen/DetailsScreen";
import ClientRegisterScreen from "../Screen/ClientRegisterScreen";
import ClientUpdateScreen from "../Screen/ClientUpdateScreen";

// Importar pantallas de Platos
import DishListScreen from "../Screen/DishListScreen";
import DishRegisterScreen from "../Screen/DishRegisterScreen";
import DishUpdateScreen from "../Screen/DishUpdateScreen";
import DishDetailsScreen from "../Screen/DishDetailsScreen";

// Importar pantallas de Empleados
import EmployeeListScreen from "../Screen/EmployeeListScreen";
import EmployeeRegisterScreen from "../Screen/EmployeeRegisterScreen";
import EmployeeUpdateScreen from "../Screen/EmployeeUpdateScreen";
import EmployeeDetailsScreen from "../Screen/EmployeeDetailsScreen";

// Importar pantallas de Órdenes
import OrderListScreen from "../Screen/OrderListScreen";
import OrderRegisterScreen from "../Screen/OrderRegisterScreen";
import OrderUpdateScreen from "../Screen/OrderUpdateScreen";
import OrderDetailsScreen from "../Screen/OrderDetailsScreen";

// Tipos de navegación
import { 
  ClientStackParamList, 
  DishStackParamList, 
  EmployeeStackParamList, 
  OrderStackParamList 
} from "./types";
import { CyberColors } from "../styles/CyberStyles";

// Stack Navigators
const ClientStackNavigator = createNativeStackNavigator<ClientStackParamList>(); 
const DishStackNavigator = createNativeStackNavigator<DishStackParamList>(); 
const EmployeeStackNavigator = createNativeStackNavigator<EmployeeStackParamList>(); 
const OrderStackNavigator = createNativeStackNavigator<OrderStackParamList>(); 

// Stack de Clientes
function ClientStack() {
    return (
        <ClientStackNavigator.Navigator initialRouteName="Client">
            <ClientStackNavigator.Screen 
                name="ClientList" 
                component={ClientListScreen}
                options={{ title: 'Lista de Clientes', headerShown: false }}
            />
            <ClientStackNavigator.Screen 
                name="Client" 
                component={ClientScreen}
                options={{ title: 'Gestión de Clientes', headerShown: false }}
            />
            <ClientStackNavigator.Screen 
                name="Details" 
                component={DetailsScreen}
                options={{ title: 'Detalles del Cliente', headerShown: false }}
            />
            <ClientStackNavigator.Screen 
                name="ClientRegister" 
                component={ClientRegisterScreen}
                options={{ title: 'Nuevo Cliente', headerShown: false }}
            />
            <ClientStackNavigator.Screen 
                name="ClientUpdate" 
                component={ClientUpdateScreen}
                options={{ title: 'Editar Cliente', headerShown: false }}
            />
        </ClientStackNavigator.Navigator>
    );
}

// Stack de Platos - COMPLETO
function DishStack() {
    return (
        <DishStackNavigator.Navigator initialRouteName="DishList">
            <DishStackNavigator.Screen 
                name="DishList" 
                component={DishListScreen}
                options={{ title: 'Lista de Platos', headerShown: false }}
            />
            <DishStackNavigator.Screen 
                name="DishRegister" 
                component={DishRegisterScreen}
                options={{ title: 'Nuevo Plato', headerShown: false }}
            />
            <DishStackNavigator.Screen 
                name="DishUpdate" 
                component={DishUpdateScreen}
                options={{ title: 'Editar Plato', headerShown: false }}
            />
            <DishStackNavigator.Screen 
                name="DishDetails" 
                component={DishDetailsScreen}
                options={{ title: 'Detalles del Plato', headerShown: false }}
            />
        </DishStackNavigator.Navigator>
    );
}

// Stack de Empleados - COMPLETO
function EmployeeStack() {
    return (
        <EmployeeStackNavigator.Navigator initialRouteName="EmployeeList">
            <EmployeeStackNavigator.Screen 
                name="EmployeeList" 
                component={EmployeeListScreen}
                options={{ title: 'Lista de Empleados', headerShown: false }}
            />
            <EmployeeStackNavigator.Screen 
                name="EmployeeRegister" 
                component={EmployeeRegisterScreen}
                options={{ title: 'Nuevo Empleado', headerShown: false }}
            />
            <EmployeeStackNavigator.Screen 
                name="EmployeeUpdate" 
                component={EmployeeUpdateScreen}
                options={{ title: 'Editar Empleado', headerShown: false }}
            />
            <EmployeeStackNavigator.Screen 
                name="EmployeeDetails" 
                component={EmployeeDetailsScreen}
                options={{ title: 'Detalles del Empleado', headerShown: false }}
            />
        </EmployeeStackNavigator.Navigator>
    );
}

// Stack de Órdenes - COMPLETO
function OrderStack() {
    return (
        <OrderStackNavigator.Navigator initialRouteName="OrderList">
            <OrderStackNavigator.Screen 
                name="OrderList" 
                component={OrderListScreen}
                options={{ title: 'Lista de Órdenes', headerShown: false }}
            />
            <OrderStackNavigator.Screen 
                name="OrderRegister" 
                component={OrderRegisterScreen}
                options={{ title: 'Nueva Orden', headerShown: false }}
            />
            <OrderStackNavigator.Screen 
                name="OrderUpdate" 
                component={OrderUpdateScreen}
                options={{ title: 'Editar Orden', headerShown: false }}
            />
            <OrderStackNavigator.Screen 
                name="OrderDetails" 
                component={OrderDetailsScreen}
                options={{ title: 'Detalles de la Orden', headerShown: false }}
            />
        </OrderStackNavigator.Navigator>
    );
}

// Tab Navigator
const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: CyberColors.cardBg,
                    borderTopColor: CyberColors.primaryNeon,
                    borderTopWidth: 2,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: CyberColors.primaryNeon,
                tabBarInactiveTintColor: CyberColors.textMuted,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                },
            }}
        >
            <Tab.Screen 
                name="Clients" 
                component={ClientStack} 
                options={{
                    headerShown: false,
                    title: 'Clients',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={size} color={color} />
                    )
                }} 
            />
            <Tab.Screen 
                name="Dishes" 
                component={DishStack} 
                options={{
                    headerShown: false,
                    title: 'Dishes',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="restaurant-menu" size={size} color={color} />
                    )
                }} 
            />
            <Tab.Screen 
                name="Employees" 
                component={EmployeeStack} 
                options={{
                    headerShown: false,
                    title: 'Employees',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="team" size={size} color={color} />
                    )
                }} 
            />
            <Tab.Screen 
                name="Orders" 
                component={OrderStack} 
                options={{
                    headerShown: false,
                    title: 'Orders',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="receipt-long" size={size} color={color} />
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