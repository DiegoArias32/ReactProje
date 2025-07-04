import { CLIENT_END_POINT } from "../contants/Endpoint";
import { IClient } from "../types/IClient";

export const getClients = async (): Promise<IClient[]> => {
    try {
        const response = await fetch(CLIENT_END_POINT);
        if (!response.ok) {
            throw new Error("Error al obtener la lista de clientes");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getClients:", error);
        throw error;
    }
};

export const getClientById = async (id: string): Promise<IClient> => {
    try {
        const response = await fetch(`${CLIENT_END_POINT}/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching client with id ${id}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getClientById:", error);
        throw error;
    }
};

export const createClient = async (client: IClient): Promise<IClient> => {
    try {
        const response = await fetch(CLIENT_END_POINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(client),
        });
        if (!response.ok) {
            throw new Error("Error al crear el cliente");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en createClient:", error);
        throw error;
    }
};

export const updateClient = async (id: string, client: IClient): Promise<IClient> => {
    try {
        const response = await fetch(`${CLIENT_END_POINT}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(client),
        });
        if (!response.ok) {
            throw new Error(`Error updating client with id ${id}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en updateClient:", error);
        throw error;
    }
};

export const deleteClient = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${CLIENT_END_POINT}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error deleting client with id ${id}`);
        }
    } catch (error) {
        console.error("Error en deleteClient:", error);
        throw error;
    }
};