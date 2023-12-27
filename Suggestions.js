import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SQLite from 'expo-sqlite';
import { Calendar, CalendarTheme } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import { getAllUsersEvents, deleteEvent, addEvent, getEventById, updateEvent, deleteEventByName } from './FirebaseConfig'; 



const Suggestions  = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEventDataFromDatabase();
  }, []);

  
 


 
 
  const loadEventDataFromDatabase = async () => {
    try {
      const eventsData = await getAllUsersEvents();
      setEvents(eventsData);
      console.log('Data read successfully:', eventsData);
    } catch (error) {
      console.error('Error reading data:', error);
    }
  };

  const handleApprovalPress = async (eventName) => {
    try {
      console.log('eventName:', eventName);

      await deleteEventByName(eventName);
  
      const selectedEvent = events.find((event) => event.name === eventName);
  
      if (!selectedEvent) {
        console.error('Selected event not found');
        return;
      }
  
      const startTime = selectedEvent.startTime || '';
      const endTime = selectedEvent.endTime || '';
      const time = startTime && endTime ? `${startTime}-${endTime}` : '';
  
      await addEvent({
        name: selectedEvent.name,
        img: selectedEvent.img,
        description: selectedEvent.description,
        time,
        selectedDate: selectedEvent.selectedDate,
      });
  
      await deleteEvent(selectedEvent.id);
  
      ToastAndroid.showWithGravityAndOffset(
        'Event Approved',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
  
      loadEventDataFromDatabase();
    } catch (error) {
      console.error('Error handling approval:', error);
    }
  };
  
  const ImageCard = ({ event }) => {
    const navigation = useNavigation();
  
    const handleApprovalButtonPress = async () => {
      console.log('Approval button pressed for event:', event);
      handleApprovalPress(event.name);
    };
  
    return (
      <View style={styles.card}>
        <Image source={{ uri: event.img }} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{event.name}</Text>
        <Text style={styles.cardTime}>{event.time}</Text>
  
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={handleApprovalButtonPress}>
            <Text style={styles.approvalButton}>Approval</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  

  return (
    <ScrollView style={{ backgroundColor: '#fff5f0' }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.TitleStyle}>Visi skelbimai</Text>
      </View>

      

      <View style={{ alignItems: 'center' }}>
        {events.map((event) => (
          <ImageCard key={event.id} event={event} />
        ))}
      </View>
    </ScrollView>
  );
};





const Stack = createNativeStackNavigator();


const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Suggestions"
        component={Suggestions}
        options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
  );
};

export default AppNavigator;

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