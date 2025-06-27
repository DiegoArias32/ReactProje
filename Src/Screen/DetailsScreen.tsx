import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientStackParamList } from '../navigation/types';

type DetailsScreenProps = NativeStackScreenProps<ClientStackParamList, 'Details'>;
type DetailsScreenNavigationProps = NativeStackNavigationProp<ClientStackParamList, 'Details'>;

export default function Details() {
  const navigation = useNavigation<DetailsScreenNavigationProps>();
  const route = useRoute<DetailsScreenProps['route']>();
  
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Detalles del Cliente</Text>
      <Text style={styles.text2}>ID del Cliente: {id}</Text>
      <StatusBar style="auto" />
      
      <Pressable 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.text2}>Volver a Clientes</Text>
      </Pressable>
      
      <Pressable>
        <Text style={styles.text2}>Editar Cliente</Text>
      </Pressable>
      
      <Pressable>
        <Text style={styles.text2}>Eliminar Cliente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
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