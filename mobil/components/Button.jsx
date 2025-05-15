import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const Button = ({ color, text, topM = 20, botM = 20, width = "80%", textColor = "#000", url = null, navigation }) => {
  const handlePress = () => {
    if (url && navigation) {
      navigation.navigate(url);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={[
        styles.button, 
        { 
          backgroundColor: color, 
          marginTop: topM,
          marginBottom: botM,
          width: width,
          shadowColor: color,   
          shadowOffset: { width: 0, height: 5 },  
          shadowOpacity: 0.5,   
          shadowRadius: 5,     
          elevation: 10         
        }
      ]}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
