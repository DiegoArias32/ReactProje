// Src/Screen/ClientScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClientStackParamList } from '../navigation/types';
import { CyberStyles, CyberColors } from '../styles/CyberStyles';

type ClientScreenNavigationProps = NativeStackNavigationProp<
  ClientStackParamList, 'Client'
>;

const ClientScreen: React.FC = () => {
  const navigation = useNavigation<ClientScreenNavigationProps>();

  const renderHeader = () => (
    <View style={CyberStyles.cyberHeader}>
      <Text style={CyberStyles.headerTitle}>CYBER RESTO</Text>
      <Text style={CyberStyles.headerSubtitle}>
        Client Management System
      </Text>
    </View>
  );

  const renderLogo = () => (
    <View style={{
      alignItems: 'center',
      padding: 40,
    }}>
      <View style={[CyberStyles.cyberAvatar, { 
        width: 120, 
        height: 120,
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderColor: CyberColors.primaryNeon,
      }]}>
        <Text style={[CyberStyles.avatarText, { 
          fontSize: 40,
          color: CyberColors.primaryNeon 
        }]}>
          🚀
        </Text>
      </View>
      
      <Text style={[CyberStyles.headerTitle, { 
        fontSize: 32, 
        marginTop: 20,
        marginBottom: 10 
      }]}>
        CLIENT MATRIX
      </Text>
      
      <Text style={[CyberStyles.secondaryText, { 
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24 
      }]}>
        Welcome to the client management system.{'\n'}
        Access and control your customer database.
      </Text>
    </View>
  );

  const renderMenuCard = () => (
    <View style={CyberStyles.cyberCard}>
      <View style={CyberStyles.cardHeader}>
        <Text style={CyberStyles.cardTitle}>SYSTEM ACCESS</Text>
      </View>
      
      <View style={{ gap: 20 }}>
        <TouchableOpacity
          style={[CyberStyles.cyberButton, CyberStyles.primaryButton]}
          onPress={() => navigation.navigate('ClientList')}
          activeOpacity={0.8}
        >
          <Text style={[CyberStyles.buttonText, CyberStyles.primaryButtonText]}>
            📋 ACCESS CLIENT DATABASE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={CyberStyles.cyberContainer}>
      {renderHeader()}
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {renderLogo()}
        {renderMenuCard()}

      </ScrollView>
    </View>
  );
};

export default ClientScreen;