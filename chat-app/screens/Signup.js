import React, { useState } from 'react';
import axios from 'axios';
import { View, TextInput, Button, Text } from 'react-native';
import tailwind from 'tailwind-rn';

export default function Signup({ navigation }) {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { username, firstname, lastname, password });
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={tailwind('flex-1 justify-center items-center')}>
      <TextInput style={tailwind('border p-2 m-2 w-80')} placeholder="Username" onChangeText={setUsername} />
      <TextInput style={tailwind('border p-2 m-2 w-80')} placeholder="First Name" onChangeText={setFirstname} />
      <TextInput style={tailwind('border p-2 m-2 w-80')} placeholder="Last Name" onChangeText={setLastname} />
      <TextInput style={tailwind('border p-2 m-2 w-80')} placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}
