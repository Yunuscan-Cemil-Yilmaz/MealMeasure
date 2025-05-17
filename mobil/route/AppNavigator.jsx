// AppNavigator.js
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Insight from '../screens/Insight';
import Settings from '../screens/Settings';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const userData = user ? JSON.parse(user) : null;
        if (userData && userData.user) {
          if (userData.user.is_completed) {
            setInitialRoute('Home');
          } else {
            setInitialRoute('Insight');
          }
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Guard kontrol hatası:', error);
        setInitialRoute('Login');
      }
    };

    checkUserStatus();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Register'
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Insight'
          component={Insight}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Settings'
          component={Settings}
          options={{ headerShown: false }}
        />
            <Stack.Screen
          name='Home'
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
