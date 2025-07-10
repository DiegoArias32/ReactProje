// Src/Screen/EmployeeListScreen.tsx
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
import { EmployeeStackParamList } from "../navigation/types";
import { getEmployees } from "../api/services/EmployeeServices";
import { IEmployee } from "../api/types/IEmployee";
import EmployeeCard from "../Components/EmployeeCard";
import { CyberStyles, CyberColors } from "../styles/CyberStyles";

type EmployeeScreenNavigationProp = NativeStackNavigationProp<
  EmployeeStackParamList,
  "EmployeeList"
>;

const EmployeeListScreen: React.FC = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<IEmployee[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<EmployeeScreenNavigationProp>();

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filtrar empleados según búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const position = employee.position.toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return fullName.includes(query) || position.includes(query);
      });
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  // Recargar la lista cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, [])
  );

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      console.log("📋 Empleados obtenidos:", data);
      setEmployees(data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEmployees();
    setRefreshing(false);
  }, []);

  // Calcular estadísticas
  const calculateAverageSalary = () => {
    if (employees.length === 0) return 0;
    const total = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
    return total / employees.length;
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>EMPLOYEE MATRIX</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Manage your workforce database
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={{ padding: 20 }}>
      <Text style={CyberStyles.inputLabel}>Search Employees</Text>
      <TextInput
        style={[
          CyberStyles.cyberInput,
          searchQuery ? CyberStyles.inputFocused : {}
        ]}
        placeholder="Search employees..."
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
        onPress={() => navigation.navigate("EmployeeRegister")}
        activeOpacity={0.8}
      >
        <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
          + ADD NEW EMPLOYEE
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmployeeStats = () => (
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
          {employees.length}
        </Text>
        <Text style={CyberStyles.secondaryText}>TOTAL STAFF</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={[CyberStyles.headerTitle, { fontSize: 24 }]}>
          {filteredEmployees.length}
        </Text>
        <Text style={CyberStyles.secondaryText}>FILTERED</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={[CyberStyles.headerTitle, { 
          fontSize: 14, 
          color: CyberColors.accentNeon 
        }]}>
          {formatSalary(calculateAverageSalary())}
        </Text>
        <Text style={CyberStyles.secondaryText}>AVG SALARY</Text>
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={CyberStyles.loadingContainer}>
      <ActivityIndicator size="large" color={CyberColors.primaryNeon} />
      <Text style={CyberStyles.loadingText}>Loading Employees...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={CyberStyles.emptyState}>
      <Text style={[CyberStyles.headerTitle, { fontSize: 60, opacity: 0.3 }]}>
        👥
      </Text>
      <Text style={CyberStyles.emptyText}>
        No employees found in the workforce
      </Text>
      <Text style={CyberStyles.emptySubtext}>
        {searchQuery ? 
          "Try adjusting your search parameters" : 
          "Add your first employee to get started"
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={[
            CyberStyles.cyberButton, 
            CyberStyles.primaryButton,
            { marginTop: 20 }
          ]}
          onPress={() => navigation.navigate("EmployeeRegister")}
          activeOpacity={0.8}
        >
          <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
            + HIRE FIRST EMPLOYEE
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
        {employees.length > 0 && renderEmployeeStats()}

        {filteredEmployees.length === 0 ? (
          renderEmptyState()
        ) : (
          filteredEmployees.map((employee) => (
            <EmployeeCard 
              key={employee.id || `employee-${Math.random()}`}
              data={employee} 
              onRefresh={fetchEmployees}
            />
          ))
        )}
        
        {/* Espaciado extra al final */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default EmployeeListScreen;