import { CLIENT_END_POINT } from "../contants/Endpoint";
import { IClient } from "../types/IClient";

export const getClients = async (): Promise<IClient[]> => {
    const response = await fetch(CLIENT_END_POINT);
    const data = await response.json();
    return data;
};
export const getClientById = async (id: string): Promise<IClient> => {
    const response = await fetch(`${CLIENT_END_POINT}${id}`);
    if (!response.ok) {
        throw new Error(`Error fetching client with id ${id}`);
    }
    const data = await response.json();
    return data;
};

export const updateClient = async (id: string, client: IClient): Promise<IClient> => {
    const response = await fetch(`${CLIENT_END_POINT}${id}`, {
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
};
export const deleteClient = async (id: string): Promise<void> => {
    const response = await fetch(`${CLIENT_END_POINT}${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Error deleting client with id ${id}`);
    }
};