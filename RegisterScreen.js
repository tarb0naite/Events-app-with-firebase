import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Button, ToastAndroid } from 'react-native';
import { Title, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from './FirebaseConfig';
import { useAuth, AuthProvider } from './AuthContext';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [vardas, setVardas] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const auth = FIREBASE_AUTH;

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setPasswordsMatch(false);
        return;
      }
  
      if (!vardas || !username || !email || !password || !confirmPassword) {
        ToastAndroid.show('Visi laukai turi būti užpildyti.', ToastAndroid.SHORT);
        return;
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        ToastAndroid.show('Neteisingas el. pašto formatas.', ToastAndroid.SHORT);
        return;
      }
  
      if (!checkbox1) {
        ToastAndroid.show('Prašome sutikti su taisyklėmis.', ToastAndroid.SHORT);
        return;
      }
  
      setPasswordsMatch(true);
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store additional user data in Firestore
      await addDoc(collection(FIRESTORE_DB, 'users'), {
        uid: user.uid,
        vardas,
        username, 
        email,
      });
      
  
      console.log('User registered:', user);
      navigation.navigate('Profilis');
    } catch (error) {
      console.error('Error during registration:', error);
  
      // Show an alert only for 'auth/email-already-in-use' error
      if (error.code === 'auth/email-already-in-use') {
        alert('Email already in use');
      } else {
        ToastAndroid.show('Registration failed. Please try again.', ToastAndroid.SHORT);
      }
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View>
      <View style={{ alignItems: 'center', top: 10 }}>
        <Text style={styles.TitleStyle}>Registracija</Text>
      </View>

      <View style={{ alignItems: 'center', top: 15 }}>
        <Text style={styles.smallText}>Norint tęsti susikūrkite paskirą</Text>
      </View>

      <View style={{ alignItems: 'center', top: 40 }}>
        <TextInput
          placeholder="Vardas"
          onChangeText={(text) => setVardas(text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Slapivardis"
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
        />

        <TextInput
          placeholder="el-pastas"
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Slaptažodis"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
            <Image
              source={showPassword ? require('./assets/eye.png') : require('./assets/eye-crossed.png')}
              style={{ width: 20, height: 20, tintColor: showPassword ? '#F08300' : '#FFE5B4' }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Pakartokite slaptažodį"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
            <Image
              source={showPassword ? require('./assets/eye.png') : require('./assets/eye-crossed.png')}
              style={{ width: 20, height: 20, tintColor: showPassword ? '#F08300' : '#FFE5B4' }}
            />
          </TouchableOpacity>
        </View>

        {!passwordsMatch && (
          <Text style={{ color: 'red', alignSelf: 'center' }}>Slaptažodžiai nesutampa</Text>
        )}
      </View>

      <View style={{ left: 30, top: 40 }}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={checkbox1 ? 'checked' : 'unchecked'}
            onPress={() => setCheckbox1(!checkbox1)}
            color="#F08300"
          />
          <Text style={styles.checkboxLabel}>Sutinku su taisyklėmis</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={checkbox2 ? 'checked' : 'unchecked'}
            onPress={() => setCheckbox2(!checkbox2)}
            color="#F08300"
          />
          <Text style={styles.checkboxLabel}>Noriu gauti naujienas</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={handleRegister} title="Registruotis" color="#E67E22" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TitleStyle: {
    fontSize: 34,
    color: '#CC5500',
  },
  smallText: {
    fontSize: 16,
    color: '#F28500',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
    borderColor: 'orange',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  eyeIconContainer: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderColor: '#F08300',
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#F08300',
  },
  buttonContainer: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 50,
  },
});

export default RegisterScreen;
