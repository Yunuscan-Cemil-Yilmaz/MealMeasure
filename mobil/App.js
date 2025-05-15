import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Login from './screens/Login';
import Register from './screens/Register';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Insight from './screens/Insight';
import Settings from './screens/Settings';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
  // <NavigationContainer>
  //   <Stack.Navigator initialRouteName='Login'>
  //   <Stack.Screen
  //   name='Login'
  //   component={Login}
  //   options={{headerShown:false}}
  //   />
  // <Stack.Screen
  //   name='Register'
  //   component={Register}
  //   options={{headerShown:false}}
  //   />
  //   <Stack.Screen
  //   name='Insight'
  //   component={Insight}
  //   options={{headerShown:false}}
  //   />
  //     <Stack.Screen
  //   name='Settings'
  //   component={Settings}
  //   options={{headerShown:false}}
  //   />
  //   </Stack.Navigator>
  // </NavigationContainer>
  <Settings></Settings>
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
