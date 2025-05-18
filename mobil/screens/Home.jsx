import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../Utils';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [getCal, setCal] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [calorieInput, setCalorieInput] = useState('');

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


    setModalVisible(true);
  };

  const submitCalories = async () => {
    if (!calorieInput || isNaN(calorieInput)) {
      Alert.alert('Hata', 'Lütfen geçerli bir sayı girin.');
      return;
    }

    const user = await AsyncStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    if (!userData) {
      Alert.alert('Hata', 'Kullanıcı bulunamadı.');
      return;
    }

    const data = {
      cal_value: parseInt(calorieInput),

    };

    try {
      await axios.post(
        `http://${API_URL}:8000/api/add-meal-with-cal`,
        data,
        {
          headers: {
            'auth_token': userData.token || '',
            'sender_id': String(userData.user.user_id),
            'sender_email': String(userData.user.user_email),
          },
        }
      );
      Alert.alert('Başarılı', 'Kalori başarıyla eklendi.');
      setModalVisible(false);
      setCalorieInput('');
      getCalories({ dateString: selectedDate });
    } catch (error) {
      console.error('Add calorie error:', error.response?.data || error.message);
      Alert.alert('Hata', 'Kalori eklenemedi.');
    }
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
      const photoUri = result.assets ? result.assets[0].uri : result.uri;
      setSelectedPhoto({ uri: photoUri });
      Alert.alert('Başarılı', 'Fotoğraf çekildi!');
    }
  };

  const handleSelectFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      setSelectedFile(result);
      Alert.alert('Dosya Seçildi', `Dosya: ${result.name}`);
    }
  };

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
      const response = await axios.post(
        `http://${API_URL}:8000/api/add-meal-with-img-from-mobile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'auth_token': userData.token || '',
            'sender_id': String(userData.user.user_id),
            'sender_email': String(userData.user.user_email),
          },
        }
      );
      Alert.alert('Başarılı', 'Yükleme tamamlandı!');
    } catch (error) {
      if(error.status==501){
        Alert.alert('Are you joking with me ? this is not a meal :) ')
        return 
      }
      console.error('Upload error:', error.response?.data || error.message);
      Alert.alert('Hata', 'Yükleme başarısız.')
    }
  };



const handleUpload2 = async () => {
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
      image: selectedFile,
   
    });

    try {
      const response = await axios.post(
        `http://${API_URL}:8000/api/add-meal-with-img`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'auth_token': userData.token || '',
            'sender_id': String(userData.user.user_id),
            'sender_email': String(userData.user.user_email),
          },
        }
      );
      Alert.alert('Başarılı', 'Yükleme tamamlandı!');
    } catch (error) {
      if(error.status==501){
        Alert.alert('Are you joking with me ? this is not a meal :) ')
        return 
      }
      console.error('Upload error:', error.response?.data || error.message);
      Alert.alert('Hata', 'Yükleme başarısız.')
    }
  };








  const getCalories = async (day) => {
    setSelectedDate(day.dateString);
    const user = await AsyncStorage.getItem('user')
    const userData = user ? JSON.parse(user) : null
    if (!userData) {
      Alert.alert('Hata', 'Kullanıcı bulunamadı.');
      return;
    }

    try {
      const response = await axios.post(
        `http://${API_URL}:8000/api/get-meals-cal-from-date`,
        { selected_date: day.dateString },
        {
          headers: {
            'auth_token': userData.token || '',
            'sender_id': String(userData.user.user_id),
            'sender_email': String(userData.user.user_email),
          },
        }
      );
      setCal(response.data.response || []);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      setCal([])
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Calculate Calorie</Text>
      </View>

      <Calendar
        style={styles.calendar}
        onDayPress={(day) => getCalories(day)}
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
        }}
        hideExtraDays={true}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.selectedInfo}>Selected Day {selectedDate}</Text>
        {getCal.map((cal, i) => (
          <Text style={styles.selectedInfo} key={i}>{cal.meal_cal} cal</Text>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleAddCalories}>
          <Text style={styles.buttonText}>🍽️ Add Calories</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>📸 Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fileButton} onPress={handleSelectFile}>
          <Text style={styles.fileButtonText}>📂 Select File From Device</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={selectedFile ? handleUpload2 : handleUpload}>
          <Text style={styles.buttonText}>⬆️ Yükle</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Kalori Ekle</Text>
            <TextInput
              placeholder="Kalori değeri"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              value={calorieInput}
              onChangeText={setCalorieInput}
              style={styles.input}
            />
            <TouchableOpacity style={styles.modalButton} onPress={submitCalories}>
              <Text style={styles.modalButtonText}>Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#ff6d7a', marginTop: 10 }}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 5,
  },
  header: {
    color: 'white',
    fontSize: 25,
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
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#393939',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#555',
    color: 'white',
    width: '100%',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#00C399',
    padding: 10,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
