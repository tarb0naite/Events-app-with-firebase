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
import { getAllEvents, deleteEvent, addEvent, getEventById, updateEvent } from './FirebaseConfig'; 



const AllEvents = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEventDataFromDatabase();
  }, []);

  const handleEditPress = (event) => {
    navigation.navigate('EditEvents', {
      event,
      onSave: handleSaveEvent,
    });
  };

  const handleSaveEvent = async (updatedEvent) => {
    try {
      await updateEvent(updatedEvent.event_id, {
        name: updatedEvent.name,
        img: updatedEvent.img,
        description: updatedEvent.description,
        time: updatedEvent.time,
      });
  
      ToastAndroid.showWithGravityAndOffset(
        'Event Updated',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
  
      navigation.navigate('AllEvents');
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };


  const handleNewEventPress = () => {
    navigation.navigate('NewEvent', {
      event: {
        event_id: '', 
        selectedDate: '',
        time: '',
        name: '',
        img: '',
        description: '',
      },
      onSave: handleSaveEvent,
    });
  };

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);

      setEvents((prevEvents) => {
        const updatedEvents = prevEvents.filter(
          (event) => event.id !== eventId
        );
        return updatedEvents;
      });

      ToastAndroid.showWithGravityAndOffset(
        'Event Deleted',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const loadEventDataFromDatabase = async () => {
    try {
      const eventsData = await getAllEvents();
      setEvents(eventsData);
      console.log('Data read successfully:', eventsData);
    } catch (error) {
      console.error('Error reading data:', error);
    }
  };

  const ImageCard = ({ event }) => (
    <View style={styles.card}>
      <Image source={{ uri: event.img }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{event.name}</Text>
      <Text style={styles.cardTime}>{event.time}</Text>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => handleDelete(event.id)}>
          <Image source={require('./assets/delete.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEditPress(event)}>
          <Image source={require('./assets/edit.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: '#fff5f0' }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.TitleStyle}>Visi skelbimai</Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Button
          title="Prideti nauji skelbima"
          onPress={handleNewEventPress}
          color="#E67E22"
        />
      </View>

      <View style={{ alignItems: 'center' }}>
        {events.map((event) => (
          <ImageCard key={event.id} event={event} />
        ))}
      </View>
    </ScrollView>
  );
};

const EditEvents = ({ route }) => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventId = route.params?.event?.event_id;
        if (eventId) {
          console.log('Fetching event with ID:', eventId);

          console.log('Before fetching event data');

          const event = await getEventById(eventId);

          console.log('Fetched event:', event);

          setName(event?.name || '');
          setImg(event?.img || '');
          setDescription(event?.description || '');
          setTime(event?.time || '');
        }
      } catch (error) {
        console.error('Error reading data from database:', error);
      } finally {
        setLoading(false);
      }
    };

    console.log('Before calling fetchEventData');

    fetchEventData();
  }, [route.params?.event]);

  console.log('EditEvents component re-rendered');
  
  

  

  return (
    <ScrollView style={{ backgroundColor: '#fff5f0' }}>
      {console.log('EditEvents component re-rendered')}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Laikas"
          value={time}
          onChangeText={(text) => setTime(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Pavadinimas"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Paveikslelis url"
          value={img}
          onChangeText={(text) => setImg(text)}
        />
      </View>

      <View style={styles.bigInputContainer}>
        <TextInput
          placeholder="Aprašymas"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline={true}
        />
      </View>

      <View style={styles.buttonContainer}>
      <Button
  title="Išsaugoti"
  color="#E67E22"
  onPress={async () => {
  try {
    await route.params.onSave({
      event_id: route.params.event.event_id,
      name,
      img,
      description,
      time,
    });

    ToastAndroid.showWithGravityAndOffset(
      'Event Updated',
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50
    );

    navigation.navigate('AllEvents');
  } catch (error) {
    console.error('Error updating event:', error);
  }
}}

/>

      </View>
    </ScrollView>
  );
};



const Stack = createNativeStackNavigator();

const NewEvent = ({route}) => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [description, setDescription] = useState('');
  const [imageSelected, setImageSelected] = useState(false);

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
  const handleSaveEvent = async () => {
    try {
      const routeParams = route.params || {};
      const event = routeParams.event || {};
  
      const newEvent = {
        name,
        img,
        description,
        time,
        selectedDate,
      };
  
      await addEvent(newEvent);
  
      ToastAndroid.showWithGravityAndOffset(
        'Event Added',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
  
      navigation.navigate('AllEvents');
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

        <Text style={styles.backgroundInput}>Event time:</Text>
        <View style={styles.userInput}>
        <TextInput
          style={[styles.flexInput]}
          placeholder="Event Time"
          value={time}
          onChangeText={(text) => setTime(text)}
        />
        </View>


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
            onPress={() =>
              handleSaveEvent({
                event_id: route.params.event.event_id,
                name,
                img,
                description,
                time,
              })
            }
            color="#E67E22"
          
 
/>

        </View>
      </View>
    </ScrollView>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllEvents"
        component={AllEvents}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditEvents"
        component={EditEvents}
        options={({ route }) => ({
          title: 'Edit Event',
          onSave: route.params ? route.params.onSave : undefined,
        })}
      />

      <Stack.Screen
        name="NewEvent"
        component={NewEvent}
        options={{ title: 'New Event' }}
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