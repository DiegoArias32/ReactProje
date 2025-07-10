// Src/Screen/OrderDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrderStackParamList } from '../navigation/types';
import { getOrderById, deleteOrder } from '../api/services/OrderServices';
import { IOrder } from '../api/types/IOrder';
import { CyberStyles, CyberColors } from '../styles/CyberStyles';

type OrderDetailsScreenProps = NativeStackScreenProps<OrderStackParamList, 'OrderDetails'>;
type OrderDetailsScreenNavigationProps = NativeStackNavigationProp<OrderStackParamList, 'OrderDetails'>;

const OrderDetailsScreen: React.FC = () => {
  const navigation = useNavigation<OrderDetailsScreenNavigationProps>();
  const route = useRoute<OrderDetailsScreenProps['route']>();
  const { id } = route.params;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log("📋 Obteniendo detalles de la orden:", id);
        setLoading(true);
        const orderData = await getOrderById(id);
        console.log("✅ Orden obtenida:", orderData);
        
        setOrder({
          id: orderData.id,
          idCustomer: orderData.idCustomer || "",
          date: orderData.date || "",
          status: orderData.status || "",
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

  const handleEdit = () => {
    navigation.navigate("OrderUpdate", { id });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar esta orden del sistema?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteOrder(id);
              console.log("✅ Orden eliminada exitosamente");
              navigation.goBack();
            } catch (error) {
              console.error("❌ Error al eliminar orden:", error);
              Alert.alert("Error", "No se pudo eliminar la orden del sistema");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return CyberColors.warningNeon;
      case 'processing':
        return CyberColors.accentNeon;
      case 'completed':
        return CyberColors.primaryNeon;
      case 'cancelled':
        return CyberColors.dangerNeon;
      default:
        return CyberColors.textSecondary;
    }
  };

  const getInitials = () => {
    if (!order) return '';
    const orderId = order.id || '';
    return `#${orderId.slice(-3)}`.toUpperCase();
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>ORDER DETAILS</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Order information from the system
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Order Data...</Text>
    </View>
  );

  const renderOrderNotFound = () => (
    <View style={CyberStyles.emptyState}>
      <Text style={[CyberStyles.headerTitle, { fontSize: 60, opacity: 0.3 }]}>
        404
      </Text>
      <Text style={CyberStyles.emptyText}>
        Order not found in the system
      </Text>
      <Text style={CyberStyles.emptySubtext}>
        This order may have been removed or cancelled
      </Text>
      <TouchableOpacity 
        style={[
          CyberStyles.cyberButton, 
          CyberStyles.secondaryButton,
          { marginTop: 20 }
        ]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.secondaryButtonText]}>
          RETURN TO SYSTEM
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderDetails = () => {
    if (!order) return null;

    const initials = getInitials();
    const statusColor = getStatusColor(order.status);

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar y información principal */}
        <View style={[CyberStyles.cyberCard, { alignItems: 'center' }]}>
          <View style={[CyberStyles.cyberAvatar, { 
            width: 100, 
            height: 100, 
            backgroundColor: CyberColors.secondaryNeon 
          }]}>
            <Text style={[CyberStyles.avatarText, { fontSize: 32 }]}>
              {initials}
            </Text>
          </View>
          
          <Text style={[CyberStyles.headerTitle, { fontSize: 24, marginTop: 15 }]}>
            Order #{order.id || 'Unknown'}
          </Text>
          
          <Text style={[CyberStyles.clientEmail, { 
            fontSize: 16, 
            marginTop: 5,
            color: CyberColors.textSecondary 
          }]}>
            Customer ID: {order.idCustomer || 'Not assigned'}
          </Text>
          
          <Text style={[CyberStyles.clientPhone, { 
            fontSize: 14, 
            marginTop: 5,
            color: CyberColors.textMuted 
          }]}>
            {formatDate(order.date)}
          </Text>
          
          <View style={[
            CyberStyles.statusBadge,
            { 
              backgroundColor: `${statusColor}20`,
              borderColor: statusColor,
              marginTop: 15
            }
          ]}>
            <Text style={[
              CyberStyles.statusText,
              { color: statusColor }
            ]}>
              {(order.status || 'UNKNOWN').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Información detallada */}
        <View style={CyberStyles.cyberCard}>
          <View style={CyberStyles.cardHeader}>
            <Text style={CyberStyles.cardTitle}>ORDER DATA</Text>
          </View>
          
          <View style={{ gap: 20 }}>
            {/* ID */}
            <View>
              <Text style={CyberStyles.inputLabel}>ORDER ID</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{order.id || 'N/A'}</Text>
              </View>
            </View>

            {/* Customer ID */}
            <View>
              <Text style={CyberStyles.inputLabel}>CUSTOMER ID</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{order.idCustomer || 'N/A'}</Text>
              </View>
            </View>

            {/* Fecha completa */}
            <View>
              <Text style={CyberStyles.inputLabel}>ORDER DATE & TIME</Text>
              <View style={[CyberStyles.cyberInput, { 
                opacity: 0.7, 
                minHeight: 60,
                paddingTop: 15 
              }]}>
                <Text style={CyberStyles.cyberText}>{formatDate(order.date)}</Text>
              </View>
            </View>

            {/* Estado */}
            <View>
              <Text style={CyberStyles.inputLabel}>ORDER STATUS</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={[CyberStyles.cyberText, { 
                  color: statusColor,
                  fontWeight: 'bold',
                  fontSize: 18 
                }]}>
                  {(order.status || 'UNKNOWN').toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sección de Timeline del estado */}
        <View style={CyberStyles.cyberCard}>
          <View style={CyberStyles.cardHeader}>
            <Text style={CyberStyles.cardTitle}>ORDER TIMELINE</Text>
          </View>
          
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text style={[CyberStyles.secondaryText, { textAlign: 'center' }]}>
              Order lifecycle tracking coming soon...
            </Text>
            <Text style={[CyberStyles.mutedText, { textAlign: 'center', marginTop: 10 }]}>
              Future feature: Track order progress through different stages
            </Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={{ padding: 20, gap: 15 }}>
          <TouchableOpacity
            style={[CyberStyles.cyberButton, CyberStyles.secondaryButton]}
            onPress={handleEdit}
            disabled={deleting}
            activeOpacity={0.8}
          >
            <Text style={[CyberStyles.buttonText, CyberStyles.secondaryButtonText]}>
              EDIT ORDER
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              CyberStyles.cyberButton, 
              CyberStyles.dangerButton,
              deleting && { opacity: 0.7 }
            ]}
            onPress={handleDelete}
            disabled={deleting}
            activeOpacity={0.8}
          >
            <Text style={[CyberStyles.buttonText, CyberStyles.dangerButtonText]}>
              {deleting ? "CANCELLING..." : "CANCEL ORDER"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[CyberStyles.cyberButton, { 
              backgroundColor: 'transparent',
              borderColor: CyberColors.textSecondary,
            }]}
            onPress={() => navigation.goBack()}
            disabled={deleting}
            activeOpacity={0.8}
          >
            <Text style={[CyberStyles.buttonText, { 
              color: CyberColors.textSecondary 
            }]}>
              RETURN TO LIST
            </Text>
          </TouchableOpacity>
        </View>

        {/* Espaciado extra */}
        <View style={{ height: 50 }} />
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={CyberStyles.cyberContainer}>
        {renderHeader()}
        {renderLoading()}
      </View>
    );
  }

  if (!order) {
    return (
      <View style={CyberStyles.cyberContainer}>
        {renderHeader()}
        {renderOrderNotFound()}
      </View>
    );
  }

  return (
    <View style={CyberStyles.cyberContainer}>
      {renderHeader()}
      {renderOrderDetails()}
    </View>
  );
};

export default OrderDetailsScreen;