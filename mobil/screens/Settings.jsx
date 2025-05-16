import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../components/Input';
import axios from 'axios';

const Settings = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('************');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);

const getUserData = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;

    if (parsedUser && parsedUser.user) {
      setFirstName(parsedUser.user.user_name);
      setLastName(parsedUser.user.user_surname);
      setUsername(parsedUser.user.user_nickname);
      setEmail(parsedUser.user.user_email);
      setUserData(parsedUser); // <- Burası önemli
    } else {
      console.log('Kullanıcı verisi bulunamadı.');
    }
  } catch (error) {
    console.error('Veri alınamadı:', error);
  }
};
  useEffect(() => {
    getUserData()
  }, [])

const saveChanges = async () => {
  const data = {
    user_name: firstName,
    user_surname: lastName,
    user_nickname: username
  };

  try {
    const response = await axios.post("http://192.168.1.101:8000/api/settings", data, {
      headers: {
        'auth_token': userData?.token || '',
        'sender_id': String(userData?.user?.user_id),
        'sender_email': String(userData?.user?.user_email),
      }
    });

    alert("Saved Success");
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
    setUserData(response.data); // Güncel kullanıcı verisini tekrar set et
  } catch (error) {
    console.error("Veri kaydedilirken hata:", error);
    alert("Kaydetme işlemi başarısız oldu.");
  }
};



  const handleEditPress = () => {
    if (isEditing) {
      saveChanges();
    }
    setIsEditing(!isEditing);
  };


    const handleLogout = async () => {
    const data = {
      user_id : userData?.user?.user_id
    }


    try {
      await axios.post("http://192.168.1.101:8000/api/logout", data, {
        headers: {
          'auth_token': userData?.token || '',
          'sender_id': String(userData?.user?.user_id),
          'sender_email': String(userData?.user?.user_email),
        }
      });

      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Çıkış Yapılamadı", "Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Settings</Text>


      <Input editable={isEditing} isIcon={true} placeholder={"Email"} unVisible={false} placeholderTextColor={"#b0b0b0"} value={firstName} valueSet={setFirstName} iconName={"person"} >
      </Input>

      <Input editable={isEditing} isIcon={true} placeholder={"Email"} unVisible={false} placeholderTextColor={"#b0b0b0"} value={lastName} valueSet={setLastName} iconName={"person"} >
      </Input>

      <Input editable={isEditing} isIcon={true} placeholder={"Email"} unVisible={false} placeholderTextColor={"#b0b0b0"} value={username} valueSet={setUsername} iconName={"person"} >
      </Input>

      <Input isIcon={true} placeholder={"Email"} unVisible={false} placeholderTextColor={"#b0b0b0"} value={email} valueSet={setEmail} iconName={"person"} >
      </Input>
      <Input isIcon={true} placeholder={"Email"} unVisible={false} placeholderTextColor={"#b0b0b0"} value={password} valueSet={setPassword} iconName={"person"} >
      </Input>

      <View style={styles.buttonContainer}>
        <Button text={isEditing ? "Save" : "Edit"}
          color={isEditing ? "#4CAF50" : "#54D098"}
          textColor="white"
          width="50%"
          func={handleEditPress} ></Button>
        <Button func={handleLogout} text={"Log Out"} color={"#925145"} textColor='white' width='50%'  ></Button>

      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27292A',
  },
  header: {
    color: "#b0b0b0",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#3A3B3C",
    width: "80%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 5,
  },
  cardPassword: {
    backgroundColor: "#3A3B3C",
    width: "80%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  changeText: {
    color: "#7bebd4",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "80%",
    gap: 10,
    alignItems: "center",
    justifyContent: "center"
  }
});
