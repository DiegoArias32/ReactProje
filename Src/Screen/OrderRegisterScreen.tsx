// Src/Screen/OrderRegisterScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OrderStackParamList } from "../navigation/types";
import { IOrder } from "../api/types/IOrder";
import { createOrder } from "../api/services/OrderServices";
import OrderForm from "../Components/OrderForm";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type OrderRegisterNavigationProp = NativeStackNavigationProp<
  OrderStackParamList,
  "OrderRegister"
>;

const OrderRegisterScreen: React.FC = () => {
  const navigation = useNavigation<OrderRegisterNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<IOrder>({
    id: "",
    idCustomer: "",
    date: new Date().toISOString(),
    status: "pending",
  });

  const handleChange = (field: keyof IOrder, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const registerOrder = async () => {
    // Validaciones básicas
    if (!form.idCustomer.trim()) {
      Alert.alert("Error", "El ID del cliente es obligatorio");
      return;
    }
    if (!form.status.trim()) {
      Alert.alert("Error", "El estado de la orden es obligatorio");
      return;
    }

    // Validar que el ID del cliente sea numérico
    if (isNaN(Number(form.idCustomer))) {
      Alert.alert("Error", "El ID del cliente debe ser un número");
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos para envío
      const orderToSend = {
        ...form,
        date: new Date().toISOString(), // Siempre usar fecha actual
      };
      
      const result = await createOrder(orderToSend);
      
      // Navegar de regreso tras éxito
      navigation.goBack();
      
    } catch (error) {
      console.error("❌ Error al registrar orden:", error);
      Alert.alert("Error", "No se pudo crear la orden en el sistema");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>NEW ORDER</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Create a new order in the system
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
          registerOrder();
        }}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          {loading ? "CREATING ORDER..." : "CREATE ORDER"}
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
        <OrderForm form={form} handleChange={handleChange} />
        {renderFooter()}
      </ScrollView>
    </View>
  );
};

export default OrderRegisterScreen;