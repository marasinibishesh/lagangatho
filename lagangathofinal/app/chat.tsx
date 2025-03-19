import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
// Import Feather icons directly from react-native-vector-icons
// If you're still having issues, we'll provide alternatives
import Feather from 'react-native-vector-icons/Feather';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRouter } from 'expo-router';
// Define types
type RootStackParamList = {
  Chat: undefined;
  Home: undefined;
};

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

interface ChatScreenProps {
  navigation: ChatScreenNavigationProp;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: Date;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const router=useRouter();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello, How are you!', sender: 'them', timestamp: new Date() },
    { id: '2', text: 'I am fine what about you', sender: 'me', timestamp: new Date() },
    { id: '3', text: 'Where are you now ?', sender: 'them', timestamp: new Date() },
  ]);
  
  const flatListRef = useRef<FlatList<Message>>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = (): void => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };
  
  const handleSendMessage = (): void => {
    if (message.trim()) {
      setMessages([...messages, { 
        id: String(messages.length + 1), 
        text: message, 
        sender: 'me', 
        timestamp: new Date() 
      }]);
      setMessage('');
    }
  };
  
  const handleInputSubmit = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>): void => {
    handleSendMessage();
  };
  
  const renderMessage = ({ item }: ListRenderItemInfo<Message>) => (
    <View style={[
      styles.messageRow,
      item.sender === 'me' ? styles.myMessageRow : styles.theirMessageRow,
    ]}>
      {item.sender !== 'me' && (
        <Image
          // Use require with type assertion for TypeScript
          source={{
            uri:"https://randomuser.me/api/portraits/women/1.jpg"
          }} // Replace with your actual asset path
          style={styles.avatar}
        />
      )}
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myMessage : styles.theirMessage,
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() =>router.back() } style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#8b0000" />
          </TouchableOpacity>
          <View style={styles.headerProfile}>
            <Image
              source={{
                uri:"https://randomuser.me/api/portraits/women/1.jpg"
              }} // Replace with your actual asset path
              style={styles.headerAvatar}
            />
            <Text style={styles.headerTitle}>Priya Verma</Text>
          </View>
        </View>
        
        {/* Connection Info */}
        <View style={styles.connectionInfo}>
          <Text style={styles.connectionText}>Connected on 17th of March 2025</Text>
        </View>
        
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={scrollToBottom}
        />
        
        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.cameraButton}>
              <Feather name="camera" size={24} color="#666" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Message..."
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleInputSubmit}
              returnKeyType="send"
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Feather name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 8,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#8b0000',
  },
  connectionInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  connectionText: {
    fontSize: 12,
    color: '#8b0000',
    fontWeight: '500',
  },
  messagesList: {
    padding: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  myMessage: {
    backgroundColor: '#fff',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: '#fff5f5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: 12,
  },
  cameraButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8b0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;