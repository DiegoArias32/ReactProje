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
import { EmployeeStackParamList } from '../navigation/types';
import { getEmployeeById, deleteEmployee } from '../api/services/EmployeeServices';
import { IEmployee } from '../api/types/IEmployee';
import { CyberStyles, CyberColors } from '../styles/CyberStyles';

type EmployeeDetailsScreenProps = NativeStackScreenProps<EmployeeStackParamList, 'EmployeeDetails'>;
type EmployeeDetailsScreenNavigationProps = NativeStackNavigationProp<EmployeeStackParamList, 'EmployeeDetails'>;

const EmployeeDetailsScreen: React.FC = () => {
  const navigation = useNavigation<EmployeeDetailsScreenNavigationProps>();
  const route = useRoute<EmployeeDetailsScreenProps['route']>();
  const { id } = route.params;

  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        console.log("📋 Obteniendo detalles del empleado:", id);
        setLoading(true);
        const employeeData = await getEmployeeById(id);
        console.log("✅ Empleado obtenido:", employeeData);
        
        setEmployee({
          id: employeeData.id,
          firstName: employeeData.firstName || "",
          lastName: employeeData.lastName || "",
          position: employeeData.position || "",
          salary: employeeData.salary || 0,
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

  const handleEdit = () => {
    navigation.navigate("EmployeeUpdate", { id });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este empleado de la matriz?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteEmployee(id);
              console.log("✅ Empleado eliminado exitosamente");
              navigation.goBack();
            } catch (error) {
              console.error("❌ Error al eliminar empleado:", error);
              Alert.alert("Error", "No se pudo eliminar el empleado de la matriz");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const getInitials = () => {
    if (!employee) return '';
    const firstName = employee.firstName || '';
    const lastName = employee.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>EMPLOYEE DETAILS</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Worker information from the matrix
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Employee Data...</Text>
    </View>
  );

  const renderEmployeeNotFound = () => (
    <View style={CyberStyles.emptyState}>
      <Text style={[CyberStyles.headerTitle, { fontSize: 60, opacity: 0.3 }]}>
        404
      </Text>
      <Text style={CyberStyles.emptyText}>
        Employee not found in the matrix
      </Text>
      <Text style={CyberStyles.emptySubtext}>
        This employee may have been removed from the workforce
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

  const renderEmployeeDetails = () => {
    if (!employee) return null;

    const fullName = `${employee.firstName} ${employee.lastName}`.trim();
    const initials = getInitials();

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar y nombre principal */}
        <View style={[CyberStyles.cyberCard, { alignItems: 'center' }]}>
          <View style={[CyberStyles.cyberAvatar, { 
            width: 100, 
            height: 100, 
            backgroundColor: CyberColors.accentNeon 
          }]}>
            <Text style={[CyberStyles.avatarText, { fontSize: 32 }]}>
              {initials}
            </Text>
          </View>
          
          <Text style={[CyberStyles.headerTitle, { fontSize: 24, marginTop: 15 }]}>
            {fullName || 'Unnamed Employee'}
          </Text>
          
          <Text style={[CyberStyles.clientEmail, { 
            fontSize: 16, 
            marginTop: 5,
            color: CyberColors.textSecondary 
          }]}>
            {employee.position || 'No position assigned'}
          </Text>
          
          <Text style={[CyberStyles.headerTitle, { 
            fontSize: 20, 
            marginTop: 10,
            color: CyberColors.accentNeon 
          }]}>
            {formatSalary(employee.salary)}
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
              ACTIVE
            </Text>
          </View>
        </View>

        {/* Información detallada */}
        <View style={CyberStyles.cyberCard}>
          <View style={CyberStyles.cardHeader}>
            <Text style={CyberStyles.cardTitle}>EMPLOYEE DATA</Text>
          </View>
          
          <View style={{ gap: 20 }}>
            {/* ID */}
            <View>
              <Text style={CyberStyles.inputLabel}>EMPLOYEE ID</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{employee.id || 'N/A'}</Text>
              </View>
            </View>

            {/* Nombre */}
            <View>
              <Text style={CyberStyles.inputLabel}>FIRST NAME</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{employee.firstName || 'N/A'}</Text>
              </View>
            </View>

            {/* Apellido */}
            <View>
              <Text style={CyberStyles.inputLabel}>LAST NAME</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{employee.lastName || 'N/A'}</Text>
              </View>
            </View>

            {/* Posición */}
            <View>
              <Text style={CyberStyles.inputLabel}>POSITION</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={CyberStyles.cyberText}>{employee.position || 'N/A'}</Text>
              </View>
            </View>

            {/* Salario */}
            <View>
              <Text style={CyberStyles.inputLabel}>SALARY (COP)</Text>
              <View style={[CyberStyles.cyberInput, { opacity: 0.7 }]}>
                <Text style={[CyberStyles.cyberText, { 
                  color: CyberColors.accentNeon,
                  fontWeight: 'bold',
                  fontSize: 18 
                }]}>
                  {formatSalary(employee.salary)}
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
              EDIT EMPLOYEE
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
              {deleting ? "TERMINATING..." : "TERMINATE EMPLOYEE"}
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

  if (!employee) {
    return (
      <View style={CyberStyles.cyberContainer}>
        {renderHeader()}
        {renderEmployeeNotFound()}
      </View>
    );
  }

  return (
    <View style={CyberStyles.cyberContainer}>
      {renderHeader()}
      {renderEmployeeDetails()}
    </View>
  );
};

export default EmployeeDetailsScreen;