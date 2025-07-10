import { ORDER_END_POINT } from "../contants/Endpoint";
import { IOrder } from "../types/IOrder";

export const getOrders = async (): Promise<IOrder[]> => {
    try {
        console.log("🔄 Obteniendo órdenes desde:", ORDER_END_POINT);
        const response = await fetch(ORDER_END_POINT);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("📋 Datos recibidos del servidor:", data);
        
        if (!Array.isArray(data)) {
            console.error("❌ Los datos no son un array:", data);
            throw new Error("Los datos recibidos no son válidos");
        }
        
        const transformedData = data.map(order => ({
            ...order,
            id: order.idOrder?.toString() || order.id,
        }));
        
        console.log("🔄 Datos transformados:", transformedData);
        return transformedData;
    } catch (error) {
        console.error("❌ Error en getOrders:", error);
        throw error;
    }
};

export const getOrderById = async (id: string): Promise<IOrder> => {
    try {
        if (!id) {
            throw new Error("ID de la orden es requerido");
        }
        
        console.log("🔍 Obteniendo orden con ID:", id);
        const response = await fetch(`${ORDER_END_POINT}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - Error fetching order with id ${id}`);
        }
        
        const data = await response.json();
        console.log("✅ Orden obtenida del servidor:", data);
        
        const transformedData = {
            ...data,
            id: data.idOrder?.toString() || data.id,
        };
        
        console.log("🔄 Orden transformada:", transformedData);
        return transformedData;
    } catch (error) {
        console.error("❌ Error en getOrderById:", error);
        throw error;
    }
};

export const createOrder = async (order: IOrder): Promise<IOrder> => {
    try {
        console.log("➕ Creando orden:", order);
        
        if (!order.idCustomer || !order.date || !order.status) {
            throw new Error("Todos los campos son requeridos");
        }
        
        const response = await fetch(ORDER_END_POINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log("✅ Orden creada por el servidor:", data);
            
            const transformedData = {
                ...data,
                id: data.idOrder?.toString() || data.id,
            };
            
            return transformedData;
        } else {
            console.log("✅ Orden creada exitosamente (respuesta de texto)");
            return {
                ...order,
                id: Date.now().toString(),
            };
        }
    } catch (error) {
        console.error("❌ Error en createOrder:", error);
        throw error;
    }
};

export const updateOrder = async (id: string, order: IOrder): Promise<IOrder> => {
    try {
        if (!id) {
            throw new Error("ID de la orden es requerido");
        }
        
        console.log("📝 Actualizando orden con ID:", id, "Datos:", order);
        
        const response = await fetch(`${ORDER_END_POINT}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("✅ Orden actualizada por el servidor:", data);
        
        const transformedData = {
            ...data,
            id: data.idOrder?.toString() || data.id,
        };
        
        console.log("🔄 Orden transformada:", transformedData);
        return transformedData;
    } catch (error) {
        console.error("❌ Error en updateOrder:", error);
        throw error;
    }
};

export const deleteOrder = async (id: string): Promise<void> => {
    try {
        if (!id) {
            throw new Error("ID de la orden es requerido");
        }
        
        console.log("🗑️ Eliminando orden con ID:", id);
        
        const response = await fetch(`${ORDER_END_POINT}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        console.log("✅ Orden eliminada exitosamente");
    } catch (error) {
        console.error("❌ Error en deleteOrder:", error);
        throw error;
    }
};
