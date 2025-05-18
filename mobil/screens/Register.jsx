import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { API_URL } from '../Utils';

const Register = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [username, setUsername] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');


const handleRegister = async () => {
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const data = {
        email: email,
        password: password,
        passwordAgain: confirmPassword,
        name: firstName,
        surname: lastName,
        nickname: username,
        create_admin: 0,
        token: null
    };

    try {
        const response = await axios.post(`http://${API_URL}:8000/api/register`, data);
        console.log("Register Success:", response.data);
        alert("Registration successful!");
        navigation.navigate("Login");
    } catch (error) {
        console.error("Register Failed:", error.response?.data || error.message);
        const message = error.response?.data?.message || "Registration failed!";
        alert(message);
    }
};


    return (
        <SafeAreaView style={styles.container}><View style={styles.headerContainer}>
            <Text style={styles.header}>Start Tracking Your</Text>
            <Text style={styles.header}>Meals Today</Text>
        </View>
            <Text onPress={()=>navigation.navigate("Login")} style={styles.signup}>Log in <Text style={styles.login} >or Sign up</Text>
            </Text>
            <Input isIcon={false} placeholder={"First Name"} unVisible={false} placeholderTextColor={"#b0b0b0"} value={firstName} valueSet={setFirstName} iconName={"person"} >
            </Input>
            <Input isIcon={false} placeholder={"Last Name"} unVisible={false} placeholderTextColor={"#b0b0b0"} value={lastName} valueSet={setLastName} iconName={"person"} >
            </Input>
            <Input isIcon={false} placeholder={"Username"} unVisible={false} placeholderTextColor={"#b0b0b0"} value={username} valueSet={setUsername} iconName={"person"} >
            </Input>
            <Input isIcon={true} placeholder={"Email"} unVisible={false} placeholderTextColor={"#b0b0b0"} value={email} valueSet={setEmail} iconName={"person"} >
            </Input>

            <Input isIcon={true} placeholder={"Password"} unVisible={true} placeholderTextColor={"#b0b0b0"} value={password} valueSet={setPassword} iconName={"lock-closed"} >
            </Input>
            <Input isIcon={true} placeholder={"Confirm Password"} unVisible={true} placeholderTextColor={"#b0b0b0"} value={confirmPassword} valueSet={setConfirmPassword} iconName={"lock-closed"} >
            </Input>
            <Button func={handleRegister} navigation={navigation} url={"Insight"} color={"#7bebd4"} botM={20} topM={20} text={"Sign Up"} width='80%' textColor='black'></Button>


            <Text style={styles.minitext}>by continuing, you agree to our</Text>
            <View style={styles.licenceContainer}>
                <Text style={styles.minitextunderline}>Term of service</Text>
                <Text style={styles.minitextunderline}>Privacy policy</Text>
                <Text style={styles.minitextunderline}>Content polices</Text>


            </View></SafeAreaView>
    )
}

export default Register

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
        marginBottom: 20,
        color: "gray",
        fontSize: 15,
        fontWeight: "bold",
    },

    signup: {
        marginBottom: 20,

        color: "#7bebd4",
        fontSize: 15,
        fontWeight: "bold",
    },




    minitext: {
        fontSize: 12,
        color: "white",
        marginTop: 20
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