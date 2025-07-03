import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IClient } from "../api/types/IClient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientStackParamList } from "../navigation/types";
import { deleteClient } from "../api/services/ClientServices";

interface Props {
    data: IClient;
}

const ClientCard: React.FC<Props> = ({ data }) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<ClientStackParamList>>();

    const handleEdit = () => {
        navigation.navigate("ClientUpdate", { id: data.id });
    };

    const handleDelete = async () => {
        try {
            await deleteClient(data.id);
            // Podrías agregar aquí una función de callback para actualizar la lista
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
        }
    };

    const handleViewDetails = () => {
        navigation.navigate("Details", { id: data.id });
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{data.name}</Text>
            <Text style={styles.text}>Email: {data.email}</Text>
            <Text style={styles.text}>Teléfono: {data.phone}</Text>
            <Text style={styles.text}>Dirección: {data.address}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonView} onPress={handleViewDetails}>
                    <Text style={styles.buttonText}>Ver</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonEdit} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonDelete} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f8f8f8",
        padding: 16,
        margin: 8,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#333",
    },
    text: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 12,
        justifyContent: "space-between",
    },
    buttonView: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonEdit: {
        backgroundColor: "#1e90ff",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonDelete: {
        backgroundColor: "#ff4d4d",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },
});

export default ClientCard;