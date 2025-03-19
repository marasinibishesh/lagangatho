import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/data/Colors';

// Dummy data for demonstration; in a real app, you might fetch this from an API
const dummyUserDetails: Record<string, any> = {
  'ekata.tandukar@example.com': {
    id: 1,
    name: 'Ekata Tandukar',
    occupation: 'Content Creator',
    city: 'Kathmandu',
    country: 'Nepal',
    age: 29,
    religion: 'Hindu',
    caste: 'Newar',
    profile_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    describe: 'Creative professional who enjoys photography and outdoor adventures. Looking for someone who shares my passion for arts and culture.',
    mother_tongue: 'Nepali',
    qualification: 'Bachelor in Mass Communication',
    height: 165,
    preferred_religion: 'Hindu',
    preferred_caste: 'Any',
    preferred_location: 'Kathmandu',
    preferred_min_height: 160,
    preferred_max_height: 180,
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        'https://images.unsplash.com/photo-1515023115689-589c33041d3c',
        'https://images.unsplash.com/photo-1504703395950-b89145a5425b'
    ]
  },
  'meena.sharma@example.com': {
    id: 2,
    name: 'Meena Sharma',
    occupation: 'Designer',
    city: 'Kathmandu',
    country: 'Nepal',
    age: 28,
    religion: 'Hindu',
    caste: 'Brahmin',
    profile_image_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
    describe: 'Creative designer with a passion for traditional art and culture. Enjoy reading, painting, and quiet evenings at home.',
    mother_tongue: 'Nepali',
    qualification: 'Bachelor in Fine Arts',
    height: 160,
    preferred_religion: 'Hindu',
    preferred_caste: 'Brahmin',
    preferred_location: 'Kathmandu',
    preferred_min_height: 155,
    preferred_max_height: 170,
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43',
        'https://images.unsplash.com/photo-1542740348-39501cd6e2b4'
    ]
  },
  'sushma.karki@example.com': {
    id: 3,
    name: 'Sushma Karki',
    occupation: 'Makeup Artist',
    city: 'Kathmandu',
    country: 'Nepal',
    age: 30,
    religion: 'Hindu',
    caste: 'Chhetri',
    profile_image_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    describe: 'Creative makeup artist with a passion for beauty and fashion. Love to travel and try new cuisines.',
    mother_tongue: 'Nepali',
    qualification: 'Diploma in Cosmetology',
    height: 158,
    preferred_religion: 'Hindu',
    preferred_caste: 'Any',
    preferred_location: 'Kathmandu',
    preferred_min_height: 155,
    preferred_max_height: 165,
    images: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
        'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56',
        'https://images.unsplash.com/photo-1485178575877-1a13bf489dfe'
    ]
  },
  'riya.shrestha@example.com': {
    id: 4,
    name: 'Riya Shrestha',
    occupation: 'Software Engineer',
    city: 'Chitwan',
    country: 'Nepal',
    age: 29,
    religion: 'Buddhist',
    caste: 'Newar',
    profile_image_url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
    describe: 'Tech enthusiast and nature lover. Work as a software engineer but enjoy disconnecting from technology on weekends.',
    mother_tongue: 'Nepali',
    qualification: 'Master in Computer Science',
    height: 170,
    preferred_religion: 'Any',
    preferred_caste: 'Any',
    preferred_location: 'Chitwan',
    preferred_min_height: 165,
    preferred_max_height: 180,
    images: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
        'https://images.unsplash.com/photo-1532910404247-7ee9488d7292'
    ]
  }
};

const UserDetail = () => {
  const { email } = useLocalSearchParams();
  const router = useRouter();

  // Get user details based on email parameter
  const user = dummyUserDetails[email as string];

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>User not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Render item for images FlatList (if available)
  const renderImageItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.horizontalGalleryImage}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>User Profile</Text>
        </TouchableOpacity>
        
        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user.profile_image_url || 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.profileDetailsContainer}>
            <Text style={styles.profileName}>{user.name || "User"}</Text>
            <View style={styles.detailRow}>
              <Image
                style={{ width: 12, height: 15 }}
                source={require('./../../assets/images/Birthdate.png')}
              />
              <Text style={styles.detailText}> {user.age || "--"} years</Text>
            </View>
            <View style={styles.detailRow}>
              <Image
                style={{ width: 14, height: 20 }}
                source={require('./../../assets/images/pin (2).png')}
              />
              <Text style={styles.detailText}>
                {user.city ? ` ${user.city}, ${user.country || ""}` : "Location not specified"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Image
                style={{ width: 20, height: 20 }}
                source={require('./../../assets/images/religion.png')}
              />
              <Text style={styles.detailText}> {user.religion || "Not specified"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Image
                style={{ width: 20, height: 20 }}
                source={require('./../../assets/images/caste.png')}
              />
              <Text style={styles.detailText}> {user.caste || "Not specified"}</Text>
            </View>
          </View>
        </View>

        {/* Description/Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "{user.describe || "No description provided yet."}"
          </Text>
        </View>

        {/* Pictures Section */}
        {user.images && user.images.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Pictures</Text>
            <FlatList
              data={user.images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageListContainer}
            />
          </View>
        ) : (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Pictures</Text>
            <View >
              <Text >No pictures available</Text>
            </View>
          </View>
        )}

        {/* Additional Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Mother Tongue</Text>
              <Text style={styles.infoValue}>{user.mother_tongue || "Not specified"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Occupation</Text>
              <Text style={styles.infoValue}>{user.occupation || "Not specified"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Education</Text>
              <Text style={styles.infoValue}>{user.qualification || "Not specified"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>
                {user.height ? `${user.height} cm` : "Not specified"}
              </Text>
            </View>
          </View>
        </View>

        {/* Partner Preferences Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Partner Preferences</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Religion</Text>
              <Text style={styles.infoValue}>{user.preferred_religion || "Not specified"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Caste</Text>
              <Text style={styles.infoValue}>{user.preferred_caste || "Not specified"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{user.preferred_location || "Not specified"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>
                {user.preferred_min_height && user.preferred_max_height 
                  ? `${user.preferred_min_height} - ${user.preferred_max_height} cm`
                  : user.preferred_min_height 
                    ? `Min ${user.preferred_min_height} cm` 
                    : user.preferred_max_height
                      ? `Max ${user.preferred_max_height} cm`
                      : "Not specified"}
              </Text>
            </View>
          </View>
        </View>

        {/* Message Button Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity onPress={() => {}} style={styles.messageButton}>
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    loadingContainer: {
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: "#666666",
    },
    errorText: {
      fontSize: 16,
      color: "#E57373",
      marginBottom: 20,
    },
    emptyStateContainer: {
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 8,
      borderStyle: "dashed",
    },
    emptyStateText: {
      color: "#666666",
      fontSize: 16,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    backButtonText: {
      color: "#8B0000",
      fontWeight: "bold",
      fontSize: 20,
    },
    profileContainer: {
      flexDirection: "row",
      padding: 16,
      alignItems: "center",
      borderBottomColor: "#EEEEEE",
      backgroundColor: "#FFF8E1",
      elevation: 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: "#EEEEEE",
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
    },
    profileImageContainer: {
      marginRight: 16,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: "#F0F0F0",
    },
    profileDetailsContainer: {
      flex: 1,
    },
    profileName: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 4,
    },
    detailIcon: {
      marginRight: 8,
      fontSize: 16,
      width: 20,
    },
    detailText: {
      fontSize: 16,
    },
    imageListContainer: {
      paddingHorizontal: 8,
      paddingVertical: 12,
    },
    imageContainer: {
      marginHorizontal: 8,
      borderRadius: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    horizontalGalleryImage: {
      width: 200,
      height: 250,
      borderRadius: 12,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 4,
    },
    infoIcon: {
      marginRight: 8,
      fontSize: 16,
    },
    infoText: {
      fontSize: 16,
    },
    quoteContainer: {
      backgroundColor: "#FFF8E1",
      margin: 10,
      padding: 10,
      borderRadius: 8,
    },
    quoteText: {
      fontStyle: "italic",
      fontSize: 16,
      color: "#555555",
    },
    sectionContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#FFF8E1",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    messageButton: {
      backgroundColor: Colors.lgold,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    messageButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },
    bottomPadding: {
      height: 50,
    },
    infoCard: {
      backgroundColor: "#FAF3E0",
      padding: 12,
      borderRadius: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    infoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 4,
    },
    infoLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#444444",
    },
    infoValue: {
      fontSize: 16,
      color: "#666666",
    },
  });

export default UserDetail;
