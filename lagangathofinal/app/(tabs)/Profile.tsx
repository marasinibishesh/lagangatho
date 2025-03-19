import React, { useContext, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator
} from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Colors from "@/data/Colors";

// Define TypeScript interface for user data
interface UserData {
  age: number;
  caste: string;
  city: string;
  country: string;
  date_of_birth: string;
  describe: string | null;
  drinking_preference: string | null;
  drinking_status: string | null;
  email: string;
  gender: string;
  height: number | null;
  id: number;
  images: string[] | null;
  income: string | null;
  income_preference: string | null;
  local_address: string | null;
  mother_tongue: string;
  name: string;
  occupation: string | null;
  occupation_preference: string | null;
  preferred_caste: string | null;
  preferred_location: string | null;
  preferred_max_height: number | null;
  preferred_min_height: number | null;
  preferred_mother_tongue: string | null;
  preferred_religion: string | null;
  profile_image_url: string;
  qualification: string | null;
  religion: string;
  smoking_preference: string | null;
  smoking_status: string | null;
}

// Define the shape of your AuthContext
interface AuthContextType {
  user: UserData | null;
  logout?: () => void;
  // add other auth context properties as needed
}

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use context without specifying a generic type so that it infers the actual type of AuthContext
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;
  
  const navigation = useNavigation();
  const Router = useRouter();

  useEffect(() => {
    console.log("ProfileScreen mounted");
    if (authContext) {
      console.log("Auth context available");
      if (user) {
        console.log("User data available");
        setIsLoading(false);
      } else {
        console.log("No user data found in context");
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      console.log("Auth context not available");
      setIsLoading(false);
    }
  }, [authContext, user]);

  // Redirect to login if no auth context or user after loading
  useEffect(() => {
    if (!isLoading && (!authContext || !user)) {
      console.log("No auth context or user data after loading. Redirecting to login...");
      Router.replace("/landing");
    }
  }, [isLoading, authContext, user, Router]);

  const handleUpdateInformation = () => {
    Router.replace("/Update");
  };

  // Logout functionality with confirmation alert
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => {
            if (logout) {
              logout();
              Router.replace("/landing");
            } else {
              console.error("Logout function not available");
              Router.replace("/landing");
            }
          }
        }
      ]
    );
  };

  // Render item for the image FlatList
  const renderImageItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.horizontalGalleryImage}
        onError={(e) => console.log("Image loading error:", e.nativeEvent.error)}
      />
    </View>
  );

  // Show loading indicator while data is being fetched
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  // Show error message if no user data is available
  if (!user) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
        <Text style={styles.errorText}>Unable to load profile data.</Text>
        <TouchableOpacity 
          onPress={() => Router.replace("/landing")}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Return to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user.profile_image_url || 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
              onError={(e) => console.log("Profile image loading error:", e.nativeEvent.error)}
            />
          </View>
          <View style={styles.profileDetailsContainer}>
            
            <Text style={styles.profileName}>{user.name || "User"}</Text>
            <View style={styles.detailRow}>
            <Image
            style={{width:12,height:15}}
            source={require('./../../assets/images/Birthdate.png')}
            />
              <Text style={styles.detailText}>  {user.age || "--"} years</Text>
            </View>
            <View style={styles.detailRow}>
            <Image
            style={{width:14,height:20}}
            source={require('./../../assets/images/pin (2).png')}
            />
              <Text style={styles.detailText}>
                {user.city ? `  ${user.city}, ${user.country || ''}` : "Location not specified"}
              </Text>
            </View>
            <View style={styles.detailRow}>
            <Image
            style={{width:20,height:20}}
            source={require('./../../assets/images/religion.png')
                
            }
            />
              <Text style={styles.detailText}>  {user.religion || "Not specified"}</Text>
            </View>
            <View style={styles.detailRow}>
            <Image
            style={{width:20,height:20}}
            source={require('./../../assets/images/caste.png')
                
            }
            />
              <Text style={styles.detailText}>  {user.caste || "Not specified"}</Text>
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
            <Text style={styles.sectionTitle}>Your Pictures</Text>
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
            <Text style={styles.sectionTitle}>Your Pictures</Text>
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No pictures added yet</Text>
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
                      : "Not specified"
                }
              </Text>
            </View>
          </View>
        </View>
        {/* Update Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Update Information</Text>
          <TouchableOpacity 
            onPress={handleUpdateInformation}
            style={styles.updateButton}
          >
            <Text style={styles.updateButtonText}>
              Tap to update your profile information
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Logout Section */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
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
  updateButton: {
    backgroundColor: Colors.lgold,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoItem: {
    marginVertical: 4,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333333",
  },
  infoValue: {
    fontSize: 16,
    color: "#555555",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#E57373",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  bottomPadding: {
    height: 50,
  },
});

export default ProfileScreen;
