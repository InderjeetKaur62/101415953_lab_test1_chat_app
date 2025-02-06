import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, FlatList } from 'react-native';
import io from 'socket.io-client';

// Make sure to use the correct backend URL (localhost for development)
const SOCKET_URL = 'http://localhost:5000';

const ChatScreen = ({ route }) => {
  const { roomName } = route.params; // Receive roomName as a parameter from previous screen
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typingStatus, setTypingStatus] = useState('');

  useEffect(() => {
    const socket = io(SOCKET_URL);

    // Join room
    socket.emit('joinRoom', roomName);

    // Listen for messages
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for typing status
    socket.on('typing', (user) => {
      setTypingStatus(`${user} is typing...`);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [roomName]);

  // Handle message send
  const sendMessage = () => {
    if (message.trim()) {
      const socket = io(SOCKET_URL);
      socket.emit('sendMessage', { room: roomName, message });
      setMessage('');
    }
  };

  // Handle typing
  const handleTyping = () => {
    const socket = io(SOCKET_URL);
    socket.emit('typing', roomName);
  };

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item.message}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text>{typingStatus}</Text>
      <TextInput
        value={message}
        onChangeText={(text) => setMessage(text)}
        placeholder="Type a message"
        onKeyPress={handleTyping}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default ChatScreen;
