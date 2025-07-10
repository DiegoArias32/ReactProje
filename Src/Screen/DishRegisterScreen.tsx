// Src/Screen/DishRegisterScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DishStackParamList } from "../navigation/types";
import { IDish } from "../api/types/IDish";
import { createDish } from "../api/services/DishServices";
import DishForm from "../Components/DishForm";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type DishRegisterNavigationProp = NativeStackNavigationProp<
  DishStackParamList,
  "DishRegister"
>;

const DishRegisterScreen: React.FC = () => {
  const navigation = useNavigation<DishRegisterNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<IDish>({
    id: "",
    name: "",
    description: "",
    price: 0,
  });

  const handleChange = (field: keyof IDish, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const registerDish = async () => {
    // Validaciones básicas
    if (!form.name.trim()) {
      Alert.alert("Error", "El nombre del plato es obligatorio");
      return;
    }
    if (!form.description.trim()) {
      Alert.alert("Error", "La descripción es obligatoria");
      return;
    }
    if (!form.price || form.price <= 0) {
      Alert.alert("Error", "El precio debe ser mayor a 0");
      return;
    }

    try {
      setLoading(true);
      const result = await createDish(form);
      
      // Navegar de regreso tras éxito
      navigation.goBack();
      
    } catch (error) {
      console.error("❌ Error al registrar plato:", error);
      Alert.alert("Error", "No se pudo registrar el plato en la matriz");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>NEW DISH</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Add a new culinary creation to the matrix
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={{ padding: 20, gap: 15 }}>
      <TouchableOpacity
        style={[
          CyberStyles.cyberButton, 
          CyberStyles.primaryButton,
          loading && { opacity: 0.7 }
        ]}
        onPress={() => {
          registerDish();
        }}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          {loading ? "UPLOADING TO MATRIX..." : "SAVE DISH"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[CyberStyles.cyberButton, CyberStyles.secondaryButton]}
        onPress={() => navigation.goBack()}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.secondaryButtonText]}>
          CANCEL
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={CyberStyles.cyberContainer}>
      {renderHeader()}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <DishForm form={form} handleChange={handleChange} />
        {renderFooter()}
      </ScrollView>
    </View>
  );
};

export default DishRegisterScreen;