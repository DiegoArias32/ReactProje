// Navegación para Clientes
export type ClientStackParamList = {
    ClientList: undefined;
    Client: undefined;
    Details: { id: string };
    ClientRegister: undefined;
    ClientUpdate: { id: string };
};

// Navegación para Platos
export type DishStackParamList = {
    DishList: undefined;
    Dish: undefined;
    DishDetails: { id: string };
    DishRegister: undefined;
    DishUpdate: { id: string };
};

// Navegación para Empleados
export type EmployeeStackParamList = {
    EmployeeList: undefined;
    Employee: undefined;
    EmployeeDetails: { id: string };
    EmployeeRegister: undefined;
    EmployeeUpdate: { id: string };
};

// Navegación para Órdenes
export type OrderStackParamList = {
    OrderList: undefined;
    Order: undefined;
    OrderDetails: { id: string };
    OrderRegister: undefined;
    OrderUpdate: { id: string };
};

// Navegación principal con tabs
export type MainTabParamList = {
    Clients: undefined;
    Dishes: undefined;
    Employees: undefined;
    Orders: undefined;
};