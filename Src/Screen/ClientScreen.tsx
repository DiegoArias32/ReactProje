import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClientStackParamList } from '../navigation/types';

type ClientScreenNavigationProps = NativeStackNavigationProp<
  ClientStackParamList, 'Client'
>;

export default function ClientScreen() {
  const navigation = useNavigation<ClientScreenNavigationProps>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Clientes</Text>
      <StatusBar style="auto" />
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.button}
          onPress={() => navigation.navigate('ClientList')}
        >
          <Text style={styles.buttonText}>📋 Lista de Clientes</Text>
        </Pressable>
        
        

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});