import { CLIENT_END_POINT } from "../contants/Endpoint";
import { IClient } from "../types/IClient";

export const getClients = async (): Promise<IClient[]> => {
    try {
        console.log("🔄 Obteniendo clientes desde:", CLIENT_END_POINT);
        const response = await fetch(CLIENT_END_POINT);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("📋 Datos recibidos del servidor:", data);
        
        // Validar que los datos sean un array
        if (!Array.isArray(data)) {
            console.error("❌ Los datos no son un array:", data);
            throw new Error("Los datos recibidos no son válidos");
        }
        
        // ✅ Transformar los datos: mapear idClient a id
        const transformedData = data.map(client => ({
            ...client,
            id: client.idClient?.toString() || client.id, // Mapear idClient a id
        }));
        
        console.log("🔄 Datos transformados:", transformedData);
        
        // Validar que cada cliente tenga un ID
        const validClients = transformedData.filter(client => client.id);
        if (validClients.length !== transformedData.length) {
            console.warn("⚠️ Algunos clientes no tienen ID válido");
        }
        
        return transformedData;
    } catch (error) {
        console.error("❌ Error en getClients:", error);
        throw error;
    }
};

export const getClientById = async (id: string): Promise<IClient> => {
    try {
        if (!id) {
            throw new Error("ID del cliente es requerido");
        }
        
        console.log("🔍 Obteniendo cliente con ID:", id);
        const response = await fetch(`${CLIENT_END_POINT}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - Error fetching client with id ${id}`);
        }
        
        const data = await response.json();
        console.log("✅ Cliente obtenido del servidor:", data);
        
        // ✅ Transformar los datos: mapear idClient a id
        const transformedData = {
            ...data,
            id: data.idClient?.toString() || data.id, // Mapear idClient a id
        };
        
        console.log("🔄 Cliente transformado:", transformedData);
        
        return transformedData;
    } catch (error) {
        console.error("❌ Error en getClientById:", error);
        throw error;
    }
};

export const createClient = async (client: IClient): Promise<IClient> => {
    try {
        console.log("➕ Creando cliente:", client);
        
        // Validar datos antes de enviar
        if (!client.firstName || !client.lastName || !client.email || !client.phone) {
            throw new Error("Todos los campos son requeridos");
        }
        
        const response = await fetch(CLIENT_END_POINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(client),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        // ✅ Verificar si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log("✅ Cliente creado por el servidor:", data);
            
            // Transformar los datos
            const transformedData = {
                ...data,
                id: data.idClient?.toString() || data.id,
            };
            
            return transformedData;
        } else {
            // Si no es JSON, crear un objeto con los datos enviados
            console.log("✅ Cliente creado exitosamente (respuesta de texto)");
            return {
                ...client,
                id: Date.now().toString(), // ID temporal hasta que se recarguen los datos
            };
        }
    } catch (error) {
        console.error("❌ Error en createClient:", error);
        throw error;
    }
};

export const updateClient = async (id: string, client: IClient): Promise<IClient> => {
    try {
        if (!id) {
            throw new Error("ID del cliente es requerido");
        }
        
        console.log("📝 Actualizando cliente con ID:", id, "Datos:", client);
        
        const response = await fetch(`${CLIENT_END_POINT}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(client),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("✅ Cliente actualizado por el servidor:", data);
        
        // ✅ Transformar los datos: mapear idClient a id
        const transformedData = {
            ...data,
            id: data.idClient?.toString() || data.id, // Mapear idClient a id
        };
        
        console.log("🔄 Cliente transformado:", transformedData);
        
        return transformedData;
    } catch (error) {
        console.error("❌ Error en updateClient:", error);
        throw error;
    }
};

export const deleteClient = async (id: string): Promise<void> => {
    try {
        if (!id) {
            throw new Error("ID del cliente es requerido");
        }
        
        console.log("🗑️ Eliminando cliente con ID:", id);
        
        const response = await fetch(`${CLIENT_END_POINT}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        
        console.log("✅ Cliente eliminado exitosamente");
    } catch (error) {
        console.error("❌ Error en deleteClient:", error);
        throw error;
    }
};