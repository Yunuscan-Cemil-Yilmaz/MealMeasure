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
import Ionicons from '@expo/vector-icons/Ionicons'; // veya 'react-native-vector-icons/Ionicons'

const Home = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [getCal, setCal] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [calorieInput, setCalorieInput] = useState('');
  const [uploadType, setUploadType] = useState(0);
  const [calFromService, setCalFromService] = useState(0);
  const [modalVisible2, setModalVisible2] = useState(false);
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

  const handleshowCalories = () => {


    setModalVisible2(true);
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
      setUploadType(1);
      Alert.alert('Başarılı', 'Fotoğraf çekildi!');
    }
  };


  
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: '*/*', // veya image/*, application/pdf vs.
      });
  
      // Yeni versiyonlarda `result.canceled` ile kontrol edilir
      if (result.canceled === false && result.assets?.length > 0) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        };
  
        setSelectedFile(file);
        setUploadType(2);
        Alert.alert('Dosya Seçildi', `Dosya: ${file.name}`);
      } else {
        console.log('Kullanıcı dosya seçmedi.');
      }
    } catch (error) {
      console.error('Dosya seçimi hatası:', error);
      Alert.alert('Hata', 'Dosya seçilirken bir sorun oluştu.');
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

      console.log(response.data.response);
      let cal=Math.round(Number(response.data.response))
      setCalFromService(cal);

      Alert.alert('Başarılı', 'Yükleme tamamlandı!');
      setModalVisible2(true)

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
    try {
  
      const user = await AsyncStorage.getItem('user');
      const userData = user ? JSON.parse(user) : null;
      if (!userData) {
        Alert.alert('Hata', 'Kullanıcı bulunamadı.');
        return;
      }
  
      const formData = new FormData();
      formData.append('image', {
        uri: selectedFile.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
  
      // console.log('Uploading file:', result.uri);
      console.log('selected file: ', selectedFile)
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

      console.log(response.data.response)
      let cal=Math.round(Number(response.data.response))
      setCalFromService(cal);
     
      Alert.alert('Başarılı', 'Yükleme tamamlandı!');
      setModalVisible2(true)
    } catch (error) {
      if (error?.response?.status === 501) {
        Alert.alert('Are you joking with me ? this is not a meal :)');
      } else {
        console.error('Upload error:', error.response?.data || error.message);
        Alert.alert('Hata', 'Yükleme başarısız.');
      }
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




  const handleAddAICal = async () => {
   
    const user = await AsyncStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;
    if (!userData) {
      Alert.alert('Hata', 'Kullanıcı bulunamadı.');
      return;
    }
    let token = userData.token

    const data = {
      cal_value: calFromService

    };

    try {
      await axios.post(
        `http://${API_URL}:8000/api/add-meal-with-cal`,
        data,
        {
          headers: {
            'auth_token': userData.token|| '',
            'sender_id': String(userData.user.user_id),
            'sender_email': String(userData.user.user_email),
          },
        }
      );
      Alert.alert('Başarılı', 'Kalori başarıyla eklendi.');
      setModalVisible2(false)
    
      getCalories({ dateString: selectedDate });
     
    } catch (error) {
      console.error('Add calorie error:', error.response?.data || error.message);
      Alert.alert('Hata', 'Kalori eklenemedi.');
    }
  };

  const goToSettings = () => {
    navigation.navigate('Settings'); // ya da props ile yönlendiriyorsan props.navigation.navigate
  };
  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={goToSettings} style={{alignItems:"flex-end"}}>
        <Ionicons name="settings-outline" size={24} color="white" />
      </TouchableOpacity>
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

        {/* <TouchableOpacity style={styles.button} onPress={selectedFile ? handleUpload2 : handleUpload}> */}
        <TouchableOpacity style={styles.button}onPress={uploadType === 2 ? handleUpload2 : uploadType === 1 ? handleUpload : () => { Alert.alert('Nothing selected !!'); }}>          
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


      <Modal
        visible={modalVisible2}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible2(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>AI calculate result is : {calFromService} cal</Text>
          
           
           <View style={styles.box}> 
           <TouchableOpacity onPress={() => setModalVisible2(false)}>
              <Text style={{ color: '#ff6d7a', marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddAICal}>
              <Text style={{ color: '#00ff7a', marginTop: 10 }}>Confirm</Text>
            </TouchableOpacity>
           </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({

  box:{
    flexDirection:"row",
    justifyContent:"space-between",
    
    width:"70%"
    
  },
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
