import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Insight = ({ navigation }) => {

    const [gender, setGender] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');

    const handleInsight = async () => {

        console.log(activityLevel, "activitylevel")
        const data = {
            gender: gender,
            activity_factor: activityLevel,
            age: age,
            weight: weight,
            height: height,

        };


        const user = await AsyncStorage.getItem('user')
     
        const userData = user ? JSON.parse(user) : null

        try {
            const response = await axios.post(`http://${API_URL}:8000/api/insight`, data, {
                headers: {
                    'auth_token': userData.token || '',
                    'sender_id': String(userData.user.user_id),
                    'sender_email': String(userData.user.user_email),
                }

            }

            );


            navigation.navigate("Settings");
        } catch (error) {
            console.error("İnsight Failed:", error.response?.data || error.message);
            const message = error.response?.data?.message || "İnsight failed!";
            alert(message);
        }
    };




    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Help Us To Personalize</Text>
                <Text style={styles.header}>Your Experience </Text>
            </View>
            <Input isIcon={true} placeholder={"Age"} placeholderTextColor={"#b0b0b0"} value={age} valueSet={setAge} iconName={"calendar"} />
            <Input isIcon={true} placeholder={"Weight"} placeholderTextColor={"#b0b0b0"} value={weight} valueSet={setWeight} iconName={"scale"} >
            </Input>
            <Input isIcon={true} placeholder={"Height"} placeholderTextColor={"#b0b0b0"} value={height} valueSet={setHeight} iconName={"fitness"} >
            </Input>

            <View style={{ zIndex: 1000 }}>
                <Select
                    title="Select Gender"
                    data={[{ label: "Female", value: "female" },
                    { label: "Man", value: "man" }
                    ]}
                    onSelect={(value) => setGender(value)}
                    zIndex={1000}
                />
            </View>

            <View style={{ zIndex: 500 }}>
                <Select
                    title="Select Activity Level"
                    data={[
                        { label: "Sedentary", value: 1.2 },
                        { label: "Lightly Active", value: 1.375 },
                        { label: "Moderately Active", value: 1.55 },
                        { label: "Very Active", value: 1.725 },
                        { label: "Extra Active", value: 1.9 },
                    ]} onSelect={(value) => setActivityLevel(value)}
                    zIndex={500}
                />
            </View>
            <Button func={handleInsight} color={"#7bebd4"} botM={20} topM={20} text={"Let's Go"} width='80%' textColor='black'></Button>



        </SafeAreaView>
    )
}

export default Insight

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: '#27292A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowContainer: {
        width: "80%",
        flexDirection: "row"
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