// Src/Screen/DishUpdateScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DishStackParamList } from "../navigation/types";
import { getDishById, updateDish } from "../api/services/DishServices";
import { IDish } from "../api/types/IDish";
import DishForm from "../Components/DishForm";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type DishUpdateRouteProp = RouteProp<DishStackParamList, "DishUpdate">;
type DishUpdateNavigationProp = NativeStackNavigationProp<
  DishStackParamList,
  "DishUpdate"
>;

const DishUpdateScreen: React.FC = () => {
  const route = useRoute<DishUpdateRouteProp>();
  const navigation = useNavigation<DishUpdateNavigationProp>();
  const { id } = route.params;

  const [form, setForm] = useState<IDish>({
    id: "",
    name: "",
    description: "",
    price: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        console.log("📋 Obteniendo plato por ID:", id);
        setLoading(true);
        const dish = await getDishById(id);
        console.log("✅ Plato obtenido:", dish);
        
        setForm({
          id: dish.id,
          name: dish.name || "",
          description: dish.description || "",
          price: dish.price || 0,
        });
      } catch (error) {
        console.error("❌ Error al obtener plato:", error);
        Alert.alert("Error", "No se pudo cargar la información del plato");
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [id]);

  const handleChange = (field: keyof IDish, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const updateDishData = async () => {
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
      setUpdating(true);
      console.log("📝 Actualizando plato:", form);
      const result = await updateDish(id, form);
      console.log("✅ Plato actualizado exitosamente:", result);
      
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error al actualizar plato:", error);
      Alert.alert("Error", "No se pudo actualizar el plato en la matriz");
    } finally {
      setUpdating(false);
    }
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>EDIT DISH</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Modify culinary data in the matrix
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Dish Data...</Text>
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
        onPress={updateDishData}
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
        <DishForm form={form} handleChange={handleChange} />
        {renderFooter()}
      </ScrollView>
    </View>
  );
};

export default DishUpdateScreen;