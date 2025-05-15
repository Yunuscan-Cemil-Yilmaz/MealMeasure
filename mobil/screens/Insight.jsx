import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';

const Insight = ({ navigation }) => {

    const [gender, setGender] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');

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
          data={["Male", "Female", "Other"]} 
          onSelect={(value) => setGender(value)} 
          zIndex={1000}
        />
      </View>

      <View style={{ zIndex: 500 }}>
        <Select
          title="Select Activity Level" 
          data={["Always", "Often", "Never"]} 
          onSelect={(value) => setActivityLevel(value)} 
          zIndex={500}
        />
      </View>
            <Button color={"#7bebd4"} botM={20} topM={20} text={"Log in"} width='80%' textColor='black'></Button>



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