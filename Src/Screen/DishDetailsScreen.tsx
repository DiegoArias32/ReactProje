// Src/Screen/DishDetailsScreen.tsx
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
import { DishStackParamList } from '../navigation/types';
import { getDishById, deleteDish } from '../api/services/DishServices';
import { IDish } from '../api/types/IDish';
import { CyberStyles, CyberColors } from '../styles/CyberStyles';

type DishDetailsScreenProps = NativeStackScreenProps<DishStackParamList, 'DishDetails'>;
type DishDetailsScreenNavigationProps = NativeStackNavigationProp<DishStackParamList, 'DishDetails'>;

const DishDetailsScreen: React.FC = () => {
  const navigation = useNavigation<DishDetailsScreenNavigationProps>();
  const route = useRoute<DishDetailsScreenProps['route']>();
  const { id } = route.params;

  const [dish, setDish] = useState<IDish | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        console.log("📋 Obteniendo detalles del plato:", id);
        setLoading(true);
        const dishData = await getDishById(id);
        console.log("✅ Plato obtenido:", dishData);
        
        setDish({
          id: dishData.id,
          name: dishData.name || "",
          description: dishData.description || "",
          price: dishData.price || 0,
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

  const handleEdit = () => {
    navigation.navigate("DishUpdate", { id });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este plato de la matriz?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteDish(id);
              console.log("✅ Plato eliminado exitosamente");
              navigation.goBack();
            } catch (error) {
              console.error("❌ Error al eliminar plato:", error);
              Alert.alert("Error", "No se pudo eliminar el plato de la matriz");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getInitials = () => {
    if (!dish) return '';
    const name = dish.name || '';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>DISH DETAILS</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Culinary information from the matrix
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Dish Data...</Text>
    </View>
  );

  const renderDishNotFound = () => (
    <View style={CyberStyles.emptyState}>
      <Text style={[CyberStyles.headerTitle, { fontSize: 60, opacity: 0.3 }]}>
        404
      </Text>
      <Text style={CyberStyles.emptyText}>
        Dish not found in the matrix
      </Text>
      <Text style={CyberStyles.emptySubtext}>
        This dish may have been removed from the menu
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
          RETURN TO MATRIX
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDishDetails = () => {
    if (!dish) return null;

    const initials = getInitials();

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar y nombre principal */}
        <View style={[CyberStyles.cyberCard, { alignItems: 'center' }]}>
          <View style={[CyberStyles.cyberAvatar, { 
            width: 100, 
            height: 100, 
            backgroundColor: CyberColors.warningNeon 
          }]}>
            <Text style={[CyberStyles.avatarText, { fontSize: 32 }]}>
              {initials}
            </Text>
          </View>
          
          <Text style={[CyberStyles.headerTitle, { fontSize: 24, marginTop: 15 }]}>
            {dish.name || 'Unnamed Dish'}
          </Text>
          
          <Text style={[CyberStyles.headerTitle, { 
            fontSize: 20, 
            marginTop: 10,
            color: CyberColors.warningNeon 
          }]}>
            {formatPrice(dish.price)}
          </Text>
          
          <View style={[
            CyberStyles.statusBadge,
            CyberStyles.statusActive,
            { marginTop: 10 }
          ]}>
            <Text style={[
              CyberStyles.statusText,
              CyberStyles.statusActiveText
            ]}>
              AVAILABLE
            </Text>
          </View>
        </View>

        {/* Información detallada */}
        <View style={CyberStyles.cyberCard}>
          <View style={CyberStyles.cardHeader}>
            <Text style={CyberStyles.cardTitle}>DISH DATA</Text>
          </View>
          
          <View style={{ gap: 20 }}>
            {/* ID */}
            <View>
              <Text style={CyberStyles.inputLabel}>DISH ID</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{dish.id || 'N/A'}</Text>
              </View>
            </View>

            {/* Nombre */}
            <View>
              <Text style={CyberStyles.inputLabel}>DISH NAME</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{dish.name || 'N/A'}</Text>
              </View>
            </View>

            {/* Descripción */}
            <View>
              <Text style={CyberStyles.inputLabel}>DESCRIPTION</Text>
              <View style={[CyberStyles.cyberInput, { 
                opacity: 0.7, 
                minHeight: 80,
                paddingTop: 15 
              }]}>
                <Text style={CyberStyles.cyberText}>{dish.description || 'N/A'}</Text>
              </View>
            </View>

            {/* Precio */}
            <View>
              <Text style={CyberStyles.inputLabel}>PRICE (COP)</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={[CyberStyles.cyberText, { 
                  color: CyberColors.warningNeon,
                  fontWeight: 'bold',
                  fontSize: 18 
                }]}>
                  {formatPrice(dish.price)}
                </Text>
              </View>
            </View>
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
              EDIT DISH
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
              {deleting ? "REMOVING..." : "DELETE DISH"}
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

  if (!dish) {
    return (
      <View style={CyberStyles.cyberContainer}>
        {renderHeader()}
        {renderDishNotFound()}
      </View>
    );
  }

  return (
    <View style={CyberStyles.cyberContainer}>
      {renderHeader()}
      {renderDishDetails()}
    </View>
  );
};

export default DishDetailsScreen;