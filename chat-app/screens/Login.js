import React, { useState } from 'react';
import axios from 'axios';
import { View, TextInput, Button } from 'react-native';
import tailwind from 'tailwind-rn';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const token = response.data.token;
      // Store token in localStorage
      localStorage.setItem('token', token);
      navigation.navigate('Chat');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={tailwind('flex-1 justify-center items-center')}>
      <TextInput style={tailwind('border p-2 m-2 w-80')} placeholder="Username" onChangeText={setUsername} />
      <TextInput style={tailwind('border p-2 m-2 w-80')} placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
