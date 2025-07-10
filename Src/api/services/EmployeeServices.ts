// Src/api/services/EmployeeServices.ts
import { EMPLOYEE_END_POINT } from "../contants/Endpoint";
import { IEmployee } from "../types/IEmployee";

export const getEmployees = async (): Promise<IEmployee[]> => {
    try {
        console.log("🔄 Obteniendo empleados desde:", EMPLOYEE_END_POINT);
        const response = await fetch(EMPLOYEE_END_POINT);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("📋 Datos recibidos del servidor:", data);
        
        if (!Array.isArray(data)) {
            console.error("❌ Los datos no son un array:", data);
            throw new Error("Los datos recibidos no son válidos");
        }
        
        const transformedData = data.map(employee => ({
            ...employee,
            id: employee.idEmployee?.toString() || employee.id,
        }));
        
        console.log("🔄 Datos transformados:", transformedData);
        return transformedData;
    } catch (error) {
        console.error("❌ Error en getEmployees:", error);
        throw error;
    }
};

export const getEmployeeById = async (id: string): Promise<IEmployee> => {
    try {
        if (!id) {
            throw new Error("ID del empleado es requerido");
        }
        
        console.log("🔍 Obteniendo empleado con ID:", id);
        const response = await fetch(`${EMPLOYEE_END_POINT}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - Error fetching employee with id ${id}`);
        }
        
        const data = await response.json();
        console.log("✅ Empleado obtenido del servidor:", data);
        
        const transformedData = {
            ...data,
            id: data.idEmployee?.toString() || data.id,
        };
        
        console.log("🔄 Empleado transformado:", transformedData);
        return transformedData;
    } catch (error) {
        console.error("❌ Error en getEmployeeById:", error);
        throw error;
    }
};

export const createEmployee = async (employee: IEmployee): Promise<IEmployee> => {
    try {
        console.log("➕ Creando empleado:", employee);
        
        if (!employee.firstName || !employee.lastName || !employee.position || !employee.salary) {
            throw new Error("Todos los campos son requeridos");
        }
        
        const response = await fetch(EMPLOYEE_END_POINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log("✅ Empleado creado por el servidor:", data);
            
            const transformedData = {
                ...data,
                id: data.idEmployee?.toString() || data.id,
            };
            
            return transformedData;
        } else {
            console.log("✅ Empleado creado exitosamente (respuesta de texto)");
            return {
                ...employee,
                id: Date.now().toString(),
            };
        }
    } catch (error) {
        console.error("❌ Error en createEmployee:", error);
        throw error;
    }
};

export const updateEmployee = async (id: string, employee: IEmployee): Promise<IEmployee> => {
    try {
        if (!id) {
            throw new Error("ID del empleado es requerido");
        }
        
        console.log("📝 Actualizando empleado con ID:", id, "Datos:", employee);
        
        const response = await fetch(`${EMPLOYEE_END_POINT}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("✅ Empleado actualizado por el servidor:", data);
        
        const transformedData = {
            ...data,
            id: data.idEmployee?.toString() || data.id,
        };
        
        console.log("🔄 Empleado transformado:", transformedData);
        return transformedData;
    } catch (error) {
        console.error("❌ Error en updateEmployee:", error);
        throw error;
    }
};

export const deleteEmployee = async (id: string): Promise<void> => {
    try {
        if (!id) {
            throw new Error("ID del empleado es requerido");
        }
        
        console.log("🗑️ Eliminando empleado con ID:", id);
        
        const response = await fetch(`${EMPLOYEE_END_POINT}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        console.log("✅ Empleado eliminado exitosamente");
    } catch (error) {
        console.error("❌ Error en deleteEmployee:", error);
        throw error;
    }
};