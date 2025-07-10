// Src/Screen/DishListScreen.tsx
import React, { useCallback, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator,
  TextInput 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DishStackParamList } from "../navigation/types";
import { getDishes } from "../api/services/DishServices";
import { IDish } from "../api/types/IDish";
import DishCard from "../Components/DishCard";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type DishScreenNavigationProp = NativeStackNavigationProp<
  DishStackParamList,
  "DishList"
>;

const DishListScreen: React.FC = () => {
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<IDish[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<DishScreenNavigationProp>();

  useEffect(() => {
    fetchDishes();
  }, []);

  // Filtrar platos según búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDishes(dishes);
    } else {
      const filtered = dishes.filter(dish => {
        const name = dish.name.toLowerCase();
        const description = dish.description.toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return name.includes(query) || description.includes(query);
      });
      setFilteredDishes(filtered);
    }
  }, [searchQuery, dishes]);

  // Recargar la lista cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchDishes();
    }, [])
  );

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const data = await getDishes();
      console.log("📋 Platos obtenidos:", data);
      setDishes(data);
    } catch (error) {
      console.error("Error al obtener platos:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDishes();
    setRefreshing(false);
  }, []);

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>DISH MATRIX</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Manage your culinary database
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={{ padding: 20 }}>
      <Text style={CyberStyles.inputLabel}>Search Dishes</Text>
      <TextInput
        style={[
          CyberStyles.cyberInput,
          searchQuery ? CyberStyles.inputFocused : {}
        ]}
        placeholder="Search dishes..."
        placeholderTextColor={CyberColors.textMuted}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  const renderAddButton = () => (
    <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
      <TouchableOpacity
        style={[CyberStyles.cyberButton, CyberStyles.primaryButton]}
        onPress={() => navigation.navigate("DishRegister")}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          + ADD NEW DISH
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDishStats = () => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-around', 
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: CyberColors.cardBg,
      marginHorizontal: 10,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: CyberColors.borderGlow,
      marginBottom: 10
    }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={[CyberStyles.headerTitle, { fontSize: 24 }]}>
          {dishes.length}
        </Text>
        <Text style={CyberStyles.secondaryText}>TOTAL DISHES</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={[CyberStyles.headerTitle, { fontSize: 24 }]}>
          {filteredDishes.length}
        </Text>
        <Text style={CyberStyles.secondaryText}>FILTERED</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={[CyberStyles.headerTitle, { fontSize: 24, color: CyberColors.warningNeon }]}>
          🍽️
        </Text>
        <Text style={CyberStyles.secondaryText}>CUISINE</Text>
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Dishes...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={CyberStyles.emptyState}>
      <Text style={[CyberStyles.headerTitle, { fontSize: 60, opacity: 0.3 }]}>
        🍽️
      </Text>
      <Text style={CyberStyles.emptyText}>
        No dishes found in the menu
      </Text>
      <Text style={CyberStyles.emptySubtext}>
        {searchQuery ? 
          "Try adjusting your search parameters" : 
          "Add your first dish to get started"
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={[
            CyberStyles.cyberButton, 
            CyberStyles.primaryButton,
            { marginTop: 20 }
          ]}
          onPress={() => navigation.navigate("DishRegister")}
          activeOpacity={0.8}
        >
          <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
            + CREATE FIRST DISH
          </Text>
        </TouchableOpacity>
      )}
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
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={CyberColors.primaryNeon}
            colors={[CyberColors.primaryNeon]}
          />
        }
      >
        {renderSearchBar()}
        {renderAddButton()}
        {dishes.length > 0 && renderDishStats()}

        {filteredDishes.length === 0 ? (
          renderEmptyState()
        ) : (
          filteredDishes.map((dish) => (
            <DishCard 
              key={dish.id || `dish-${Math.random()}`}
              data={dish} 
              onRefresh={fetchDishes}
            />
          ))
        )}
        
        {/* Espaciado extra al final */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default DishListScreen;