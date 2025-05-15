import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

const Settings = () => {
  const [firstName, setFirstName] = useState('Ali');
  const [lastName, setLastName] = useState('Kemal');
  const [username, setUsername] = useState('deadier');
  const [email, setEmail] = useState('alikemalcimsit36@gmail.com');
  const [password, setPassword] = useState('************');

  return (
    <SafeAreaView style={styles.container}>
                    <Text style={styles.header}>Settings</Text>
        
      <View style={styles.card}>
        <Text style={styles.text}>{firstName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>{lastName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>{username}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>{email}</Text>
      </View>

      <View style={styles.cardPassword}>
        <Text style={styles.text}>{password}</Text>
        <TouchableOpacity onPress={() => alert("Change Password")}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button text={"Edit"} color={"#54D098"} textColor='white' width='50%'  ></Button>
                <Button text={"Log Out"} color={"#925145"} textColor='white' width='50%'  ></Button>

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
        marginBottom:30,
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
  buttonContainer:{
    flexDirection:"row",
    width:"80%",
    gap:10,
    alignItems:"center",
    justifyContent:"center"
  }
});
