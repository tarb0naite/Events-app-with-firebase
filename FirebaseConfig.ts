import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


import { doc, where, query ,getFirestore, collection, getDocs, getDoc,addDoc, deleteDoc, updateDoc } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDt2eosvDpGXORMpLzRZCI0lSNHMXwudNU",
  authDomain: "react-26a85.firebaseapp.com",
  projectId: "react-26a85",
  storageBucket: "react-26a85.appspot.com",
  messagingSenderId: "610948982619",
  appId: "1:610948982619:web:3f16f3fd624970f73c5c7e",
  measurementId: "G-V72M3K7HF7"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

const auth = FIREBASE_AUTH;

onAuthStateChanged(auth, (user) => {
 
  if (user) {
    console.log('User is signed in');
  } else {
    console.log('User is signed out');
  }
});


export { auth };

export const getAllSuggestions = async (userEmail) => {
  const suggestionsCollection = collection(FIRESTORE_DB, 'userSuggestions');
  
  try {
    let querySnapshot;

    if (userEmail) {
      querySnapshot = await getDocs(
        query(suggestionsCollection, where('userEmail', '==', userEmail))
      );
    } else {
      querySnapshot = await getDocs(suggestionsCollection);
    }
  
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const getAllUsersEvents = async () => {
  const eventsCollection = collection(FIRESTORE_DB, 'userSuggestions');
  const eventsSnapshot = await getDocs(eventsCollection);
  return eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};



export const getAllEvents = async () => {
  const eventsCollection = collection(FIRESTORE_DB, 'events');
  const eventsSnapshot = await getDocs(eventsCollection);
  return eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addEvent = async (event: any) => {
  const eventsCollection = collection(FIRESTORE_DB, 'events');
  await addDoc(eventsCollection, event);
};

export const updateEvent = async (eventId: string, updatedEvent: any) => {
    const eventDoc = doc(FIRESTORE_DB, 'events', eventId);
    await updateDoc(eventDoc, updatedEvent);
  };
  
export const deleteEvent = async (eventId: string) => {
    const eventDoc = doc(FIRESTORE_DB, 'events', eventId);
    await deleteDoc(eventDoc);
};

export const deleteEventByName = async (eventName) => {
  const eventsCollection = collection(FIRESTORE_DB, 'userSuggestions');
  const querySnapshot = await getDocs(query(eventsCollection, where('name', '==', eventName)));

  if (querySnapshot.docs.length === 0) {
    console.error('Event not found');
    return;
  }

  const eventDoc = querySnapshot.docs[0].ref;
  await deleteDoc(eventDoc);
};

export const getEventById = async (eventId) => {
  try {
    const eventDoc = await getDoc(doc(FIRESTORE_DB, 'events', eventId));

    if (eventDoc.exists()) {
      return { id: eventDoc.id, ...eventDoc.data() };
    } else {
      console.error('Event not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting event by ID:', error);
    throw error;
  }
};
