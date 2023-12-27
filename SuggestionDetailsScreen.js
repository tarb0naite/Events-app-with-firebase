// SuggestionDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SuggestionDetailsScreen = ({ route }) => {
  const { eventId } = route.params;

  return (
    <View style={styles.container}>
      <Text>Suggestion Details Screen</Text>
      <Text>Event ID: {eventId}</Text>
      {/* Add more details based on the eventId or fetch additional data */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SuggestionDetailsScreen;
