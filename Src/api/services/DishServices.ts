// Src/api/services/DishServices.ts
import { DISH_END_POINT } from "../contants/Endpoint";
import { IDish } from "../types/IDish";

export const getDishes = async (): Promise<IDish[]> => {
    try {
        console.log("🔄 Obteniendo platos desde:", DISH_END_POINT);
        const response = await fetch(DISH_END_POINT);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("📋 Datos recibidos del servidor:", data);
        
        if (!Array.isArray(data)) {
            console.error("❌ Los datos no son un array:", data);
            throw new Error("Los datos recibidos no son válidos");
        }
        
        const transformedData = data.map(dish => ({
            ...dish,
            id: dish.idDish?.toString() || dish.id,
        }));
        
        console.log("🔄 Datos transformados:", transformedData);
        return transformedData;
    } catch (error) {
        console.error("❌ Error en getDishes:", error);
        throw error;
    }
};

export const getDishById = async (id: string): Promise<IDish> => {
    try {
        if (!id) {
            throw new Error("ID del plato es requerido");
        }
        
        console.log("🔍 Obteniendo plato con ID:", id);
        const response = await fetch(`${DISH_END_POINT}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - Error fetching dish with id ${id}`);
        }
        
        const data = await response.json();
        console.log("✅ Plato obtenido del servidor:", data);
        
        const transformedData = {
            ...data,
            id: data.idDish?.toString() || data.id,
        };
        
        console.log("🔄 Plato transformado:", transformedData);
        return transformedData;
    } catch (error) {
        console.error("❌ Error en getDishById:", error);
        throw error;
    }
};

export const createDish = async (dish: IDish): Promise<IDish> => {
    try {
        console.log("➕ Creando plato:", dish);
        
        if (!dish.name || !dish.description || !dish.price) {
            throw new Error("Todos los campos son requeridos");
        }
        
        const response = await fetch(DISH_END_POINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dish),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log("✅ Plato creado por el servidor:", data);
            
            const transformedData = {
                ...data,
                id: data.idDish?.toString() || data.id,
            };
            
            return transformedData;
        } else {
            console.log("✅ Plato creado exitosamente (respuesta de texto)");
            return {
                ...dish,
                id: Date.now().toString(),
            };
        }
    } catch (error) {
        console.error("❌ Error en createDish:", error);
        throw error;
    }
};

export const updateDish = async (id: string, dish: IDish): Promise<IDish> => {
    try {
        if (!id) {
            throw new Error("ID del plato es requerido");
        }
        
        console.log("📝 Actualizando plato con ID:", id, "Datos:", dish);
        
        const response = await fetch(`${DISH_END_POINT}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dish),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("✅ Plato actualizado por el servidor:", data);
        
        const transformedData = {
            ...data,
            id: data.idDish?.toString() || data.id,
        };
        
        console.log("🔄 Plato transformado:", transformedData);
        return transformedData;
    } catch (error) {
        console.error("❌ Error en updateDish:", error);
        throw error;
    }
};

export const deleteDish = async (id: string): Promise<void> => {
    try {
        if (!id) {
            throw new Error("ID del plato es requerido");
        }
        
        console.log("🗑️ Eliminando plato con ID:", id);
        
        const response = await fetch(`${DISH_END_POINT}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        console.log("✅ Plato eliminado exitosamente");
    } catch (error) {
        console.error("❌ Error en deleteDish:", error);
        throw error;
    }
};