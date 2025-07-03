import React from "react";
import { IClient } from "../api/types/IClient";
import { ScrollView, TextInput, View, StyleSheet } from "react-native";

interface Props {
  form: IClient;
  handleChange: (field: keyof IClient, value: string) => void;
}

const ClientForm: React.FC<Props> = ({ form, handleChange }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={form.phone}
        onChangeText={(text) => handleChange("phone", text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={form.address}
        onChangeText={(text) => handleChange("address", text)}
        multiline
        numberOfLines={3}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});

export default ClientForm;