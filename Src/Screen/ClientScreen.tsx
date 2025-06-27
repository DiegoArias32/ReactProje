import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClientStackParamList } from '../navigation/types';

type ClientScreenNavigationProps = NativeStackNavigationProp<
  ClientStackParamList, 'Client'
>;

export default function Client() {
  const navigation = useNavigation<ClientScreenNavigationProps>();

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Gestión de Clientes</Text>
      <StatusBar style="auto" />
      
      <Pressable 
        onPress={() => navigation.navigate('Details', { id: 'client-1' })}
      >
        <Text style={styles.text2}>Ver Cliente 1</Text>
      </Pressable>
      
      <Pressable
        onPress={() => navigation.navigate('Details', { id: 'client-2' })}
      >
        <Text style={styles.text2}>Ver Cliente 2</Text>
      </Pressable>
      
      <Pressable>
        <Text style={styles.text2}>Agregar Cliente</Text>
      </Pressable>
      
      <Pressable>
        <Text style={styles.text2}>Lista de Clientes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1: {
    fontFamily: 'Roboto',
    fontSize: 30,
    marginBottom: 20,
  },
  text2: {
    fontFamily: 'Arial',
    fontSize: 20,
    backgroundColor: 'silver',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  }
});