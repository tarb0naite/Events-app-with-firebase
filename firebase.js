import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
const firebaseConfig={
    apiKey: "AIzaSyDt2eosvDpGXORMpLzRZCI0lSNHMXwudNU",
    authDomain: "react-26a85.firebaseapp.com",
    projectId: "react-26a85",
    storageBucket: "react-26a85.appspot.com",
    messagingSenderId: "610948982619",
    appId: "1:610948982619:web:3f16f3fd624970f73c5c7e",
    measurementId: "G-V72M3K7HF7"
}
//const app = initializeApp(firebaseConfig);

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;