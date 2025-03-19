import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  FlatList
} from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

// Mock database for connections and chats
const DUMMY_DATA = {
  connections: [
    {
      id: '1',
      name: 'Alina',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    {
      id: '2',
      name: 'Compose',
      imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
    },
    {
      id: '3',
      name: 'Anushka',
      imageUrl: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f',
    },
    {
      id: '4',
      name: 'Swostima',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    },
    {
      id: '5',
      name: 'Aanchal',
      imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    },
  ],
  
  chats: [
    {
      id: '1',
      name: 'Compose Chaulagain',
      imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
      lastMessage: 'How are you today?',
      time: '2 mins ago',
    },
    {
      id: '2',
      name: 'Anushka Sharma',
      imageUrl: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f',
      lastMessage: 'ok',
      time: '10 mins ago',
    },
    {
      id: '3',
      name: 'Alina Chauhan',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      lastMessage: 'How are you?',
      time: '5 hrs ago',
    },
    {
      id: '4',
      name: 'Archana Pandey',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      lastMessage: 'Hey',
      time: '10 hrs ago',
    },
    {
      id: '5',
      name: 'Aanchal Marasini',
      imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      lastMessage: 'Hey',
      time: '1 day ago',
    },
    {
      id: '6',
      name: 'Aanchal Marasini',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      lastMessage: 'Hey',
      time: '2 days ago',
    },
    {
      id: '7',
      name: 'Swostima Neupane',
      imageUrl: 'https://images.unsplash.com/photo-1532910404247-7ee9488d7292',
      lastMessage: 'Hey',
      time: '2 days ago',
    },
  ],
};

const ConnectionsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={28} color="#7D2027" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Connections</Text>
      </View>
      
      {/* Connections Horizontal List */}
      <View style={styles.connectionsContainer}>
        <FlatList
          data={DUMMY_DATA.connections}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.connectionItem}>
              <TouchableOpacity style={styles.avatarContainer}>
                <Image 
                  source={{ uri: item.imageUrl }} 
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <Text style={styles.connectionName} numberOfLines={1}>{item.name}</Text>
            </View>
          )}
          contentContainerStyle={styles.connectionsList}
        />
      </View>
      
      {/* Chat Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Chats</Text>
        <TouchableOpacity>
          <Text style={styles.requestText}>Request</Text>
        </TouchableOpacity>
      </View>
      
      {/* Chat List */}
      <FlatList
        data={DUMMY_DATA.chats}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.chatItem}>
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.chatAvatar}
            />
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF9F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7D2027',
    marginLeft: 5,
  },
  connectionsContainer: {
    height: 100,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  connectionsList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  connectionItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 60,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  connectionName: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  requestText: {
    fontSize: 14,
    color: '#7D2027',
    fontWeight: '500',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatContent: {
    flex: 1,
    marginLeft: 15,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chatTime: {
    fontSize: 12,
    color: '#888',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  activeNavText: {
    color: '#7D2027',
    fontWeight: '500',
  },
  navIndicatorContainer: {
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  navIndicator: {
    width: 100,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
  },
});

export default ConnectionsScreen;