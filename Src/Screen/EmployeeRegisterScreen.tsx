// Src/Screen/EmployeeRegisterScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmployeeStackParamList } from "../navigation/types";
import { IEmployee } from "../api/types/IEmployee";
import { createEmployee } from "../api/services/EmployeeServices";
import EmployeeForm from "../Components/EmployeeForm";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type EmployeeRegisterNavigationProp = NativeStackNavigationProp<
  EmployeeStackParamList,
  "EmployeeRegister"
>;

const EmployeeRegisterScreen: React.FC = () => {
  const navigation = useNavigation<EmployeeRegisterNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<IEmployee>({
    id: "",
    firstName: "",
    lastName: "",
    position: "",
    salary: 0,
  });

  const handleChange = (field: keyof IEmployee, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const registerEmployee = async () => {
    // Validaciones básicas
    if (!form.firstName.trim()) {
      Alert.alert("Error", "El primer nombre es obligatorio");
      return;
    }
    if (!form.lastName.trim()) {
      Alert.alert("Error", "El apellido es obligatorio");
      return;
    }
    if (!form.position.trim()) {
      Alert.alert("Error", "La posición es obligatoria");
      return;
    }
    if (!form.salary || form.salary <= 0) {
      Alert.alert("Error", "El salario debe ser mayor a 0");
      return;
    }

    try {
      setLoading(true);
      const result = await createEmployee(form);
      
      // Navegar de regreso tras éxito
      navigation.goBack();
      
    } catch (error) {
      console.error("❌ Error al registrar empleado:", error);
      Alert.alert("Error", "No se pudo registrar el empleado en la matriz");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>NEW EMPLOYEE</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Add a new worker to the matrix
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
          registerEmployee();
        }}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          {loading ? "UPLOADING TO MATRIX..." : "HIRE EMPLOYEE"}
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
        <EmployeeForm form={form} handleChange={handleChange} />
        {renderFooter()}
      </ScrollView>
    </View>
  );
};

export default EmployeeRegisterScreen;