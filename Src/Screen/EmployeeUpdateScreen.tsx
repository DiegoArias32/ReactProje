import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmployeeStackParamList } from "../navigation/types";
import { getEmployeeById, updateEmployee } from "../api/services/EmployeeServices";
import { IEmployee } from "../api/types/IEmployee";
import EmployeeForm from "../Components/EmployeeForm";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type EmployeeUpdateRouteProp = RouteProp<EmployeeStackParamList, "EmployeeUpdate">;
type EmployeeUpdateNavigationProp = NativeStackNavigationProp<
  EmployeeStackParamList,
  "EmployeeUpdate"
>;

const EmployeeUpdateScreen: React.FC = () => {
  const route = useRoute<EmployeeUpdateRouteProp>();
  const navigation = useNavigation<EmployeeUpdateNavigationProp>();
  const { id } = route.params;

  const [form, setForm] = useState<IEmployee>({
    id: "",
    firstName: "",
    lastName: "",
    position: "",
    salary: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        console.log("📋 Obteniendo empleado por ID:", id);
        setLoading(true);
        const employee = await getEmployeeById(id);
        console.log("✅ Empleado obtenido:", employee);
        
        setForm({
          id: employee.id,
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          position: employee.position || "",
          salary: employee.salary || 0,
        });
      } catch (error) {
        console.error("❌ Error al obtener empleado:", error);
        Alert.alert("Error", "No se pudo cargar la información del empleado");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (field: keyof IEmployee, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const updateEmployeeData = async () => {
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
      setUpdating(true);
      console.log("📝 Actualizando empleado:", form);
      const result = await updateEmployee(id, form);
      console.log("✅ Empleado actualizado exitosamente:", result);
      
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error al actualizar empleado:", error);
      Alert.alert("Error", "No se pudo actualizar el empleado en la matriz");
    } finally {
      setUpdating(false);
    }
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>EDIT EMPLOYEE</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Modify worker data in the matrix
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Employee Data...</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={{ padding: 20, gap: 15 }}>
      <TouchableOpacity
        style={[
          CyberStyles.cyberButton, 
          CyberStyles.primaryButton,
          updating && { opacity: 0.7 }
        ]}
        onPress={updateEmployeeData}
        disabled={updating}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          {updating ? "UPDATING MATRIX..." : "SAVE CHANGES"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[CyberStyles.cyberButton, CyberStyles.secondaryButton]}
        onPress={() => navigation.goBack()}
        disabled={updating}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.secondaryButtonText]}>
          CANCEL
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={CyberStyles.cyberContainer}>
        {renderHeader()}
        {renderLoading()}
      </View>
    );
  }

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

export default EmployeeUpdateScreen;