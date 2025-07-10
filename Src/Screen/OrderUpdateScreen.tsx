// Src/Screen/OrderUpdateScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OrderStackParamList } from "../navigation/types";
import { getOrderById, updateOrder } from "../api/services/OrderServices";
import { IOrder } from "../api/types/IOrder";
import OrderForm from "../Components/OrderForm";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type OrderUpdateRouteProp = RouteProp<OrderStackParamList, "OrderUpdate">;
type OrderUpdateNavigationProp = NativeStackNavigationProp<
  OrderStackParamList,
  "OrderUpdate"
>;

const OrderUpdateScreen: React.FC = () => {
  const route = useRoute<OrderUpdateRouteProp>();
  const navigation = useNavigation<OrderUpdateNavigationProp>();
  const { id } = route.params;

  const [form, setForm] = useState<IOrder>({
    id: "",
    idCustomer: "",
    date: "",
    status: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log("📋 Obteniendo orden por ID:", id);
        setLoading(true);
        const order = await getOrderById(id);
        console.log("✅ Orden obtenida:", order);
        
        setForm({
          id: order.id,
          idCustomer: order.idCustomer || "",
          date: order.date || "",
          status: order.status || "",
        });
      } catch (error) {
        console.error("❌ Error al obtener orden:", error);
        Alert.alert("Error", "No se pudo cargar la información de la orden");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleChange = (field: keyof IOrder, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const updateOrderData = async () => {
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
      setUpdating(true);
      console.log("📝 Actualizando orden:", form);
      const result = await updateOrder(id, form);
      console.log("✅ Orden actualizada exitosamente:", result);
      
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error al actualizar orden:", error);
      Alert.alert("Error", "No se pudo actualizar la orden en el sistema");
    } finally {
      setUpdating(false);
    }
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>EDIT ORDER</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Modify order data in the system
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Order Data...</Text>
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
        onPress={updateOrderData}
        disabled={updating}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          {updating ? "UPDATING SYSTEM..." : "SAVE CHANGES"}
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
        <OrderForm form={form} handleChange={handleChange} />
        {renderFooter()}
      </ScrollView>
    </View>
  );
};

export default OrderUpdateScreen;