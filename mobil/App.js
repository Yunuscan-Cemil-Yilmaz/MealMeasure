import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Login from './screens/Login';
import Register from './screens/Register';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Insight from './screens/Insight';
import Settings from './screens/Settings';
import AppNavigator from './route/AppNavigator';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
 <AppNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: '#27292A',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
