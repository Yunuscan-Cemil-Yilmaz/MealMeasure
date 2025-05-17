import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const Input = ({placeholder,placeholderTextColor,value,valueSet , iconName,unVisible, isIcon=false ,editable = true}) => {
  return (
     <View style={styles.inputContainer}>
                <TextInput
                 editable={editable}
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    value={value}
                    secureTextEntry={unVisible}
                    onChangeText={(value) => valueSet(value)} />
{isIcon ?                 <Ionicons name={iconName} size={24} color="#b0b0b0" style={styles.icon} />
:null}
            </View>
  )
}

export default Input

const styles = StyleSheet.create({
     inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#3A3B3C",
        width: "80%",
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
    },
    icon: {
        marginLeft: 10,
    },
})