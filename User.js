import React, {useState,  useEffect, createContext, useContext, useRef} from 'react';
import { View, Text, Image, TouchableOpacity, Button, ScrollView,StyleSheet, TextInput, ToastAndroid, Animated,   KeyboardAvoidingView, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Calendar, CalendarTheme } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addDoc, collection, doc, getDocs, getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


import { FIREBASE_APP } from './FirebaseConfig';

const UserScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [description, setDescription] = useState('');
  const [imageSelected, setImageSelected] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const calendarTheme = {
    backgroundColor: '#F5F5F5',
    calendarBackground: 'white',
    textSectionTitleColor: '#333333',
    selectedDayBackgroundColor: '#E67E22',
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: '#E67E22',
    dayTextColor: '#333333',
    arrowColor: '#E67E22',
  };

  const firestore = getFirestore(FIREBASE_APP);
  const auth = getAuth(FIREBASE_APP);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || '');
      }
    });

   
    return () => unsubscribe();
  }, [auth]);

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const handleStartTimeConfirm = (date) => {
    hideStartTimePicker();
    if (date) {
      setStartTime(date);
    }
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleEndTimeConfirm = (date) => {
    hideEndTimePicker();
    if (date) {
      setEndTime(date);
    }
  };

  const formatTimeWithoutSeconds = (date) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return date.toLocaleTimeString('en-GB', options);
  };

  const handleSaveEvent = async () => {
    try {
      const userSuggestionsCollection = collection(firestore, 'userSuggestions');

      const formattedStartTime = formatTimeWithoutSeconds(startTime);
      const formattedEndTime = formatTimeWithoutSeconds(endTime);

      const newEvent = {
        name,
        img,
        description,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        selectedDate,
        userEmail,
      };

      await addDoc(userSuggestionsCollection, newEvent);

      ToastAndroid.showWithGravityAndOffset(
        'Event Added',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );

      setSelectedDate('');
      setStartTime(new Date());
      setEndTime(new Date());
      setName('');
      setImg('');
      setDescription('');
      setImageSelected(false);

      setStartTimePickerVisibility(false);
      setEndTimePickerVisibility(false);

      console.log('Form fields cleared.');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImg(result.uri);
        setImageSelected(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff5f0' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Create a New Event</Text>

        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{ [selectedDate]: { selected: true } }}
            style={styles.calendar}
            theme={calendarTheme}
          />
        </View>

        <Text style={styles.backgroundInput}>Event start time:</Text>
        <TouchableOpacity onPress={showStartTimePicker} style={styles.userInput}>
          <Text>{formatTimeWithoutSeconds(startTime)}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          onConfirm={handleStartTimeConfirm}
          onCancel={hideStartTimePicker}
        />

        <Text style={styles.backgroundInput}>Event end time:</Text>
        <TouchableOpacity onPress={showEndTimePicker} style={styles.userInput}>
          <Text>{formatTimeWithoutSeconds(endTime)}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          onConfirm={handleEndTimeConfirm}
          onCancel={hideEndTimePicker}
        />

        <Text style={styles.backgroundInput}>Event name:</Text>
        <View style={styles.userInput}>
          <TextInput
            style={[styles.flexInput]}
            placeholder="Event Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>

        <Text style={styles.backgroundInput}>Event image:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.flexInput, styles.imageInput]}
            placeholder="Image URL"
            value={img}
            onChangeText={(text) => setImg(text)}
            editable={imageSelected}
          />
          <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
            <Text style={styles.imagePickerButtonText}>Select Image</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.backgroundInput}>Event description:</Text>
        <View style={[styles.userInput, styles.multilineInputContainer]}>
          <TextInput
            style={[styles.flexInput, styles.multilineInput]}
            placeholder="Event Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            multiline
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Save Event"
            onPress={handleSaveEvent}
            color="#E67E22"
          />
        </View>
      </View>
    </ScrollView>
  );
};

  const styles = StyleSheet.create({
    TitleStyle: {
      fontSize: 34,
      color: '#CC5500',
      marginTop: 10,
    },
    smallerTitle: {
      fontSize: 24,
      color: '#CC5500',
      marginTop: 10,
    },
    card: {
      backgroundColor: 'white',
      padding: 10,
      margin: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E67E22',
      width: 300,
      alignItems: 'center',
      height: 230,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    cardTime: {
      fontSize: 12,
      
      marginBottom: 5,
    },
  
    cardImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
      marginBottom: 5,
    },
    iconsContainer: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      flexDirection: 'row',
    },
    icon: {
      width: 20,
      height: 20,
      marginHorizontal: 5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '30%',
      marginBottom: 20,
      
      borderColor: 'orange',
      borderWidth: 1,
      marginRight:180,
      backgroundColor: 'white',
    },
    input: {
      height: 40,
      borderColor: 'orange',
      borderWidth: 1,
      padding: 10,
      marginBottom: 20,
      width: '80%',
      backgroundColor: 'white',
    },
    bigInputContainer: {
      flexDirection: 'row',
  
      width: '80%',
      height: 300,
      marginTop: 20,
      borderColor: 'orange',
      borderWidth: 1,
      backgroundColor: 'white',
    },
    buttonContainer: {
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
      height: 70,
    },
    title: {
      fontSize: 24,
      color: '#E67E22',
      marginTop: 20,
      textAlign: 'center',
    },
    container: {
      alignItems: 'center',
      marginTop: 20,
    },
    multilineInput: {
      height: 100,
    },
    calendarContainer: {
      marginTop: 20,
      marginBottom: 20,
    },
    calendar: {
      width: '130%', 
      alignSelf: 'center',
      
    },
    backgroundInput: {
      backgroundColor: '#F28500', 
      width:'80%',
      height: '3%',
      color:'white',
      fontSize: 18
    },
    userInput: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
      borderColor: 'orange',
      marginBottom : 20,
      borderWidth: 1,
      backgroundColor: 'white',
    },
    imagePickerButton: {
      backgroundColor: '#F28500',
      padding: 10,
      borderRadius: 5,
      marginLeft: 0,
    },
  
    imagePickerButtonText: {
      color: 'white',
    },
    inputIMG: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '80%',
      marginBottom: 20,
      borderColor: 'orange',
      borderWidth: 1,
      backgroundColor: 'white',
      paddingHorizontal: 10,
    },
  });
  
  export default UserScreen;
  