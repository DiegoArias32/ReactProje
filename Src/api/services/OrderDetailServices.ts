import { ORDER_DETAIL_END_POINT } from "../contants/Endpoint";
import { IOrderDetail } from "../types/IOrderDetail";

export const getOrderDetails = async (): Promise<IOrderDetail[]> => {
    try {
        console.log("🔄 Obteniendo detalles de órdenes desde:", ORDER_DETAIL_END_POINT);
        const response = await fetch(ORDER_DETAIL_END_POINT);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("📋 Datos recibidos del servidor:", data);
        
        if (!Array.isArray(data)) {
            console.error("❌ Los datos no son un array:", data);
            throw new Error("Los datos recibidos no son válidos");
        }
        
        const transformedData = data.map(detail => ({
            ...detail,
            id: detail.idDetail?.toString() || detail.id,
        }));
        
        console.log("🔄 Datos transformados:", transformedData);
        return transformedData;
    } catch (error) {
        console.error("❌ Error en getOrderDetails:", error);
        throw error;
    }
};

export const getOrderDetailsByOrderId = async (orderId: string): Promise<IOrderDetail[]> => {
    try {
        console.log("🔄 Obteniendo detalles para orden:", orderId);
        const response = await fetch(`${ORDER_DETAIL_END_POINT}/order/${orderId}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("📋 Detalles de orden obtenidos:", data);
        
        if (!Array.isArray(data)) {
            return [];
        }
        
        const transformedData = data.map(detail => ({
            ...detail,
            id: detail.idDetail?.toString() || detail.id,
        }));
        
        return transformedData;
    } catch (error) {
        console.error("❌ Error en getOrderDetailsByOrderId:", error);
        throw error;
    }
};

export const createOrderDetail = async (orderDetail: IOrderDetail): Promise<IOrderDetail> => {
    try {
        console.log("➕ Creando detalle de orden:", orderDetail);
        
        const response = await fetch(ORDER_DETAIL_END_POINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetail),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log("✅ Detalle de orden creado:", data);
            
            const transformedData = {
                ...data,
                id: data.idDetail?.toString() || data.id,
            };
            
            return transformedData;
        } else {
            console.log("✅ Detalle de orden creado exitosamente");
            return {
                ...orderDetail,
                id: Date.now().toString(),
            };
        }
    } catch (error) {
        console.error("❌ Error en createOrderDetail:", error);
        throw error;
    }
};

export const deleteOrderDetail = async (id: string): Promise<void> => {
    try {
        if (!id) {
            throw new Error("ID del detalle es requerido");
        }
        
        console.log("🗑️ Eliminando detalle con ID:", id);
        
        const response = await fetch(`${ORDER_DETAIL_END_POINT}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        console.log("✅ Detalle eliminado exitosamente");
    } catch (error) {
        console.error("❌ Error en deleteOrderDetail:", error);
        throw error;
    }
};