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
import { OrderStackParamList } from "../navigation/types";
import { getOrders } from "../api/services/OrderServices";
import { IOrder } from "../api/types/IOrder";
import OrderCard from "../Components/OrderCard";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type OrderScreenNavigationProp = NativeStackNavigationProp<
  OrderStackParamList,
  "OrderList"
>;

const OrderListScreen: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<OrderScreenNavigationProp>();

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtrar órdenes según búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => {
        const orderId = order.id?.toString().toLowerCase() || '';
        const customerId = order.idCustomer?.toString().toLowerCase() || '';
        const status = order.status?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        
        return orderId.includes(query) || 
               customerId.includes(query) || 
               status.includes(query);
      });
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  // Recargar la lista cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      console.log("📋 Órdenes obtenidas:", data);
      setOrders(data);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, []);

  // Calcular estadísticas
  const getOrderStats = () => {
    const pending = orders.filter(o => o.status?.toLowerCase().includes('pending') || o.status?.toLowerCase().includes('pendiente')).length;
    const completed = orders.filter(o => o.status?.toLowerCase().includes('completed') || o.status?.toLowerCase().includes('completado')).length;
    const cancelled = orders.filter(o => o.status?.toLowerCase().includes('cancelled') || o.status?.toLowerCase().includes('cancelado')).length;
    
    return { pending, completed, cancelled };
  };

  const stats = getOrderStats();

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>ORDER MATRIX</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Manage your order processing system
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={{ padding: 20 }}>
      <Text style={CyberStyles.inputLabel}>Search Orders</Text>
      <TextInput
        style={[
          CyberStyles.cyberInput,
          searchQuery ? CyberStyles.inputFocused : {}
        ]}
        placeholder="Search orders..."
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
        onPress={() => navigation.navigate("OrderRegister")}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          + CREATE NEW ORDER
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderStats = () => (
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
        <Text style={[CyberStyles.headerTitle, { fontSize: 24, color: CyberColors.warningNeon }]}>
          {stats.pending}
        </Text>
        <Text style={CyberStyles.secondaryText}>PENDING</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={[CyberStyles.headerTitle, { fontSize: 24, color: CyberColors.primaryNeon }]}>
          {stats.completed}
        </Text>
        <Text style={CyberStyles.secondaryText}>COMPLETED</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={[CyberStyles.headerTitle, { fontSize: 24, color: CyberColors.dangerNeon }]}>
          {stats.cancelled}
        </Text>
        <Text style={CyberStyles.secondaryText}>CANCELLED</Text>
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Orders...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={CyberStyles.emptyState}>
      <Text style={[CyberStyles.headerTitle, { fontSize: 60, opacity: 0.3 }]}>
        📋
      </Text>
      <Text style={CyberStyles.emptyText}>
        No orders found in the system
      </Text>
      <Text style={CyberStyles.emptySubtext}>
        {searchQuery ? 
          "Try adjusting your search parameters" : 
          "Create your first order to get started"
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={[
            CyberStyles.cyberButton, 
            CyberStyles.primaryButton,
            { marginTop: 20 }
          ]}
          onPress={() => navigation.navigate("OrderRegister")}
          activeOpacity={0.8}
        >
          <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
            + CREATE FIRST ORDER
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
        {orders.length > 0 && renderOrderStats()}

        {filteredOrders.length === 0 ? (
          renderEmptyState()
        ) : (
          filteredOrders.map((order) => (
            <OrderCard 
              key={order.id || `order-${Math.random()}`}
              data={order} 
              onRefresh={fetchOrders}
            />
          ))
        )}
        
        {/* Espaciado extra al final */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default OrderListScreen;