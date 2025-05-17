import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
const [selectedPhoto, setSelectedPhoto] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Kamera kullanımı için izin vermelisiniz.');
      }
    })();
  }, []);

  const handleAddCalories = () => {
    if (!selectedDate) {
      Alert.alert('Uyarı', 'Lütfen önce bir tarih seçin!');
      return;
    }
    Alert.alert('Kalori Ekle', `${selectedDate} için kalori ekleme işlemi yapılacak.`);
  };

 const handleTakePhoto = async () => {
  if (hasCameraPermission === false) {
    Alert.alert('İzin Gerekli', 'Kamera izni verilmedi.');
    return;
  }
  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 1,
  });

  if (!result.cancelled) {
    // Yeni Expo sürümlerinde result.assets olabilir
    const photoUri = result.assets ? result.assets[0].uri : result.uri;
    setSelectedPhoto({ uri: photoUri });
    Alert.alert('Başarılı', 'Fotoğraf çekildi!');
    console.log('Fotoğraf URI:', photoUri);
  } else {
    console.log('Kullanıcı fotoğraf çekmeyi iptal etti.');
  }
};


const handleSelectFile = async () => {
  let result = await DocumentPicker.getDocumentAsync({});

  if (result.type === 'success') {
    setSelectedFile(result);
    Alert.alert('Dosya Seçildi', `Dosya: ${result.name}`);
    console.log('Seçilen dosya:', result);
  } else {
    console.log('Kullanıcı dosya seçimini iptal etti.');
  }
}




const handleUpload = async () => {
  if (!selectedPhoto) {
    Alert.alert('Hata', 'Önce fotoğraf seçin.');
    return;
  }
  const user = await AsyncStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;
  if (!userData) {
    Alert.alert('Hata', 'Kullanıcı bulunamadı.');
    return;
  }

  const formData = new FormData();
  formData.append('image', {
    uri: selectedPhoto.uri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  try {
      console.log(...formData)

    const response = await axios.post(
      `http://192.168.1.101:8000/api/add-meal-with-img`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'auth_token': userData.token || '',
          'sender_id': String(userData.user.user_id || ''),
          'sender_email': String(userData.user.user_email || ''),
        },
      }
    );
    Alert.alert('Başarılı', 'Yükleme tamamlandı!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Upload error:', error.response.data);
    Alert.alert('Hata', 'Yükleme başarısız.');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Calculate Calori</Text>
      </View>

      <Calendar
        style={styles.calendar}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: '#393939',
            selectedTextColor: 'white',
          },
        }}
        theme={{
          backgroundColor: '#27292A',
          calendarBackground: '#27292A',
          textSectionTitleColor: '#fff',
          dayTextColor: '#fff',
          monthTextColor: '#fff',
          selectedDayBackgroundColor: '#393939',
          selectedDayTextColor: '#fff',
          arrowColor: '#fff',
          todayTextColor: '#00e676',
          textDisabledColor: '#555',
          'stylesheet.day.basic': {
            base: {
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#393939',
              borderRadius: 6,
              marginVertical: 3,
              marginHorizontal: 4,
            },
            text: {
              color: 'white',
              fontSize: 14,
            },
          },
        }}
        hideExtraDays={true}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.selectedInfo}>Selected Day Info</Text>
        <Text style={styles.dateInfo}>
          {selectedDate
            ? `You selected: ${selectedDate}`
            : 'Ur not select a date yet or not any meal for this date'}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleAddCalories}>
          <Text style={styles.buttonText}>🍽️ Add Calories</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>📸 Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fileButton} onPress={handleSelectFile}>
          <Text style={styles.fileButtonText}>📂 Select File From Device</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleUpload}>
  <Text style={styles.buttonText}>⬆️ Yükle</Text>
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27292A',
    paddingTop: 20,
    paddingHorizontal: 40,
    justifyContent: 'center',
    width: '100%',
  },
  calendar: {
    borderRadius: 10,
    width: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  header: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  infoContainer: {
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  selectedInfo: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateInfo: {
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  fileButton: {
    backgroundColor: '#00e676',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  fileButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
