// MainStackNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SuggestionScreen from './SuggestionScreen';
import SuggestionDetailsScreen from './SuggestionDetailsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SuggestionScreen" component={SuggestionScreen} />
      <Stack.Screen name="SuggestionDetailsScreen" component={SuggestionDetailsScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Root" component={Root} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
