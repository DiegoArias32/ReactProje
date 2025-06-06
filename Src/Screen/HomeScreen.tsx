import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';


type HomeScreenNavigationProps = NativeStackNavigationProp<
HomeStackParamList, 'Home'
>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProps>();

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>PruebaHome</Text>
      <StatusBar style="auto" />
      <Pressable 
        onPress={() => navigation.navigate('Stack')}
      >
        <Text style={styles.text2}>Stack</Text>
      </Pressable>
      <Pressable
      onPress={() => navigation.navigate({ name: 'Details', params: { id: '1' } })}
      >
        <Text style={styles.text2}>Details 1</Text>
      </Pressable>
      <Pressable>
        <Text>Details 2</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'goldenrod',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1: {
    fontFamily: 'Roboto',
    fontSize: 30,
  },
  text2:{
    fontFamily: 'Arial',
    fontSize: 20,
    backgroundColor: 'silver',
  }
});
