import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../Utils';

const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


  const handleLogin = async () => {
    const data = {
        email: email,
        password: password,
    };

    try {
        const response = await axios.post(`http://${API_URL}:8000/api/login`, data);
        alert("Login Success:");
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        console.log(response.data);

        const userData = response.data.user;

        if (userData.is_completed) {
            navigation.replace("Home"); 
        } else {
            navigation.replace("Insight");
        }

    } catch (error) {
        console.error("Login Failed:", error.response?.data || error.message);
        const message = error.response?.data?.message || "Login failed!";
        alert(message);
    }
};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
            <Text style={styles.header}>Get Started With Your</Text>
            <Text style={styles.header}>Nutrition Journey</Text>
        </View>
            <Text  style={styles.login}>Log in or<Text onPress={()=>navigation.navigate("Register")} style={styles.signup}> Sign up</Text>
            </Text>
            <Input isIcon={true} placeholder={"Email"} unVisible={false} placeholderTextColor={"#b0b0b0"} value={email} valueSet={setEmail} iconName={"person"} >
            </Input>
            <Input isIcon={true} placeholder={"Password"} unVisible={true} placeholderTextColor={"#b0b0b0"} value={password} valueSet={setPassword} iconName={"lock-closed"} >
            </Input>
                <Button func={handleLogin} color={"#7bebd4"} botM={20} topM={20} text={"Log in"} width='80%' textColor='black'></Button>

            <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>Or</Text>
                <View style={styles.line} />
            </View>
            <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="facebook-square" size={24} color="#4267B2" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continue With Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="google" size={24} color="#DB4437" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continue With Google</Text>
            </TouchableOpacity>
            <Text style={styles.minitext}>by continuing, you agree to our</Text>
            <View style={styles.licenceContainer}>
                <Text style={styles.minitextunderline}>Term of service</Text>
                <Text style={styles.minitextunderline}>Privacy policy</Text>
                <Text style={styles.minitextunderline}>Content polices</Text>


            </View></SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: '#27292A',
    alignItems: 'center',
    justifyContent: 'center',
  },
    headerContainer: {
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20
    },
    header: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    login: {
        marginBottom: 50,
        color: "gray",
        fontSize: 15,
        fontWeight: "bold",
    },
  
    signup: {
        color: "#7bebd4",
        fontSize: 15,
        fontWeight: "bold",
    },
 
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "80%",
        marginTop: 20,
        marginBottom: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#A0A0A0",
    },
    dividerText: {
        marginHorizontal: 10,
        color: "#A0A0A0",
        fontWeight: "bold",
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#3A3B3C",
        width: "80%",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 15,
    },
    socialIcon: {
        marginRight: 10,
    },
    socialButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    minitext: {
        fontSize: 12,
        color: "white",
        marginTop: 40
    },
    licenceContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 5
    },
    minitextunderline: {
        fontSize: 12,
        color: "#7bebd4",
        textDecorationLine: "underline"
    }
})