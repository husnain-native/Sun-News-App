import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing Icons

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <View className="flex-1 bg-white p-6">
      {/* Heading */}
      <Text className="text-2xl font-bold text-gray-800 text-center">Contact Us</Text>

      {/* Contact Info */}
      <View className="flex-row items-center mt-6">
        <Icon name="phone" size={20} color="#4CAF50" />
        <Text className="ml-2 text-gray-700">+92 300 1234567</Text>
      </View>
      <View className="flex-row items-center mt-2">
        <Icon name="email" size={20} color="#2196F3" />
        <Text className="ml-2 text-gray-700">info@example.com</Text>
      </View>

      {/* Form */}
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mt-6"
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mt-4"
        placeholder="Your Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mt-4 h-24"
        placeholder="Your Message"
        multiline
        value={message}
        onChangeText={setMessage}
      />

      {/* Send Button */}
      <TouchableOpacity className="bg-blue-600 rounded-lg py-3 mt-6">
        <Text className="text-white text-center font-semibold">Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactScreen;
