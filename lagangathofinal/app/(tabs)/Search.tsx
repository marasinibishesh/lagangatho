import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function Search() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user: authUser } = useContext(AuthContext);

  // Wait until authUser is loaded before fetching users
  useEffect(() => {
    if (authUser) {
      fetchUsers();
    }
  }, [authUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Use your backend URL; here we're using EXPO_PUBLIC_HOST_URL
      const response = await axios.get(process.env.EXPO_PUBLIC_HOST_URL + '/user');
      
      if (response.data.success) {
        // Update filtering logic: convert both genders to lowercase for comparison
        const filteredByGender = response.data.data.filter((user: any) => {
          if (!authUser?.gender || !user.gender) return true;
          const authGender = authUser.gender.toLowerCase();
          const userGender = user.gender.toLowerCase();
          if (authGender === 'male') {
            return userGender === 'female';
          } else if (authGender === 'female') {
            return userGender === 'male';
          }
          return true;
        });
        
        console.log('Filtered users by gender:', filteredByGender);
        setUsers(filteredByGender);
        setFilteredUsers(filteredByGender);
        setError(null);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.occupation && user.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);
  const handleUserPress = (email: string) => {
    router.push(`./../User/${email}`);
  };

  const UserCard = ({ user }: { user: any }) => {
    return (
      <TouchableOpacity 
        style={styles.userCard}
        onPress={() => handleUserPress(user.email)}

      >
        <Image 
          source={{ uri: user.profile_image_url || 'https://via.placeholder.com/150' }} 
          style={styles.userImage} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.userMeta}>
            <Ionicons name="briefcase-outline" size={14} color="#666" />
            <Text style={styles.userMetaText}>{user.occupation}</Text>
          </View>
          <View style={styles.userMeta}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.userMetaText}>
              {user.city}, {user.country}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // If authUser is not loaded, show a loading spinner
  if (!authUser) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF4E83" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* User List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF4E83" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredUsers.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsText}>No users found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={({ item }) => <UserCard user={item} />}
          keyExtractor={item => (item.id ? item.id.toString() : Math.random().toString())}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 46,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginLeft: 10,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userImage: {
    width: 100,
    height: 130,
    borderRadius: 8,
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userMetaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF4E83',
    marginBottom: 15,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF4E83',
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
});
