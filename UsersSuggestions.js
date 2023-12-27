import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import { getAllSuggestions } from './FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from './FirebaseConfig';

const UserDetails = () => {
  return (
    <View style={styles.container}>
      <Text>ye</Text>
    </View>
  );
};

const UserSuggestions = () => {
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const auth = getAuth(FIREBASE_APP);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || '');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserSuggestions = async () => {
      try {
        console.log('Fetching user suggestions...');
        console.log('User email:', userEmail);

        const suggestions = await getAllSuggestions(userEmail);

        console.log('User suggestions:', suggestions);

        setUserSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching user suggestions:', error);
      }
    };

    fetchUserSuggestions();
  }, [userEmail]);

  const handleRowPress = (eventId) => {
    navigation.navigate('UserDetails', { eventId });
  };

  return (
    <View style={styles.container}>
      <DataTable style={styles.tableContainer}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Time</DataTable.Title>
        </DataTable.Header>

        {userSuggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            onPress={() => handleRowPress(suggestion.id)}
          >
            <DataTable.Row>
              <DataTable.Cell>{suggestion.name}</DataTable.Cell>
              <DataTable.Cell>{suggestion.selectedDate}</DataTable.Cell>
              <DataTable.Cell>
                {suggestion.startTime && suggestion.endTime}
              </DataTable.Cell>
            </DataTable.Row>
          </TouchableOpacity>
        ))}
      </DataTable>
    </View>
  );
};

const Stack = createNativeStackNavigator();

const UserSuggestionsStack = () => {
  return (
    <Stack.Navigator initialRouteName="UserSuggestions">
      <Stack.Screen name="UserSuggestions" component={UserSuggestions} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  tableHeader: {
    backgroundColor: '#E67E22',
  },
});

export default UserSuggestionsStack;
