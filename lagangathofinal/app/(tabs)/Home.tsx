import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

// Mock database - This simulates data coming from a backend
// In a real app, this would be fetched from an API
const DATABASE = {
  mutualMatches: [
    {
      id: 1,
      name: 'Ekata Tandukar',
      email: 'ekata.tandukar@example.com',
      gender: 'Female',
      date_of_birth: '1995-06-15',
      age: 29,
      religion: 'Hindu',
      caste: 'Newar',
      profile_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      images: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        'https://images.unsplash.com/photo-1515023115689-589c33041d3c',
        'https://images.unsplash.com/photo-1504703395950-b89145a5425b'
      ],
      mother_tongue: 'Nepali',
      local_address: 'Baneshwor, Kathmandu',
      height: 5.4,
      qualification: 'Bachelor in Mass Communication',
      occupation: 'Content Creator',
      income: 35000,
      smoking_status: 'Never',
      drinking_status: 'Occasionally',
      preferred_min_height: 5.6,
      preferred_max_height: 6.2,
      preferred_religion: 'Hindu',
      preferred_caste: 'Any',
      preferred_mother_tongue: 'Nepali',
      preferred_location: 'Kathmandu Valley',
      smoking_preference: 'Non-smoker',
      drinking_preference: 'Any',
      occupation_preference: 'Professional',
      income_preference: 40000,
      country: 'Nepal',
      city: 'Kathmandu',
      describe: 'Creative professional who enjoys photography and outdoor adventures. Looking for someone who shares my passion for arts and culture.'
    },
    {
      id: 2,
      name: 'Ekata Tandukar',
      email: 'ekata.t@example.com',
      gender: 'Female',
      date_of_birth: '1993-02-21',
      age: 32,
      religion: 'Hindu',
      caste: 'Newar',
      profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      images: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43',
        'https://images.unsplash.com/photo-1542740348-39501cd6e2b4'
      ],
      mother_tongue: 'Newari',
      local_address: 'Patan, Lalitpur',
      height: 5.6,
      qualification: 'Master in Theater Arts',
      occupation: 'Actress',
      income: 45000,
      smoking_status: 'Occasionally',
      drinking_status: 'Socially',
      preferred_min_height: 5.8,
      preferred_max_height: 6.3,
      preferred_religion: 'Any',
      preferred_caste: 'Any',
      preferred_mother_tongue: 'Any',
      preferred_location: 'Kathmandu Valley',
      smoking_preference: 'Any',
      drinking_preference: 'Any',
      occupation_preference: 'Creative Professional',
      income_preference: 50000,
      country: 'Nepal',
      city: 'Lalitpur',
      describe: 'Passionate actress and theater enthusiast. Love to travel and explore different cultures. Seeking someone who appreciates arts and has an adventurous spirit.'
    },
    {
      id: 3,
      name: 'Meena Sharma',
      email: 'meena.sharma@example.com',
      gender: 'Female',
      date_of_birth: '1996-11-08',
      age: 28,
      religion: 'Hindu',
      caste: 'Brahmin',
      profile_image_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
      images: [
        'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
        'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56',
        'https://images.unsplash.com/photo-1485178575877-1a13bf489dfe'
      ],
      mother_tongue: 'Nepali',
      local_address: 'Baluwatar, Kathmandu',
      height: 5.3,
      qualification: 'Bachelor in Fine Arts',
      occupation: 'Designer',
      income: 38000,
      smoking_status: 'Never',
      drinking_status: 'Never',
      preferred_min_height: 5.5,
      preferred_max_height: 6.0,
      preferred_religion: 'Hindu',
      preferred_caste: 'Brahmin, Chhetri',
      preferred_mother_tongue: 'Nepali',
      preferred_location: 'Kathmandu',
      smoking_preference: 'Non-smoker',
      drinking_preference: 'Non-drinker preferred',
      occupation_preference: 'Professional',
      income_preference: 40000,
      country: 'Nepal',
      city: 'Kathmandu',
      describe: 'Creative designer with a passion for traditional art and culture. Enjoy reading, painting, and quiet evenings at home. Looking for someone with similar values and interests.'
    }
  ],
  
  preferences: [
    {
      id: 1,
      name: 'Sushma Karki',
      email: 'sushma.karki@example.com',
      gender: 'Female',
      date_of_birth: '1994-05-12',
      age: 30,
      religion: 'Hindu',
      caste: 'Chhetri',
      profile_image_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      images: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
        'https://images.unsplash.com/photo-1532910404247-7ee9488d7292'
      ],
      mother_tongue: 'Nepali',
      local_address: 'Bouddha, Kathmandu',
      height: 5.5,
      qualification: 'Diploma in Cosmetology',
      occupation: 'Makeup Artist',
      income: 32000,
      smoking_status: 'Never',
      drinking_status: 'Occasionally',
      preferred_min_height: 5.7,
      preferred_max_height: 6.2,
      preferred_religion: 'Hindu',
      preferred_caste: 'Any',
      preferred_mother_tongue: 'Nepali',
      preferred_location: 'Kathmandu',
      smoking_preference: 'Non-smoker',
      drinking_preference: 'Any',
      occupation_preference: 'Professional',
      income_preference: 45000,
      country: 'Nepal',
      city: 'Kathmandu',
      describe: 'Creative makeup artist with a passion for beauty and fashion. Love to travel and try new cuisines. Looking for someone who is ambitious and has a good sense of humor.'
    },
    {
      id: 2,
      name: 'Sushma Rai',
      email: 'sushma.rai@example.com',
      gender: 'Female',
      date_of_birth: '1997-08-24',
      age: 27,
      religion: 'Hindu',
      caste: 'Rai',
      profile_image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      images: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        'https://images.unsplash.com/photo-1502323777036-f29e3972b302',
        'https://images.unsplash.com/photo-1506956191951-7a88da4435e5'
      ],
      mother_tongue: 'Rai',
      local_address: 'Lakeside, Pokhara',
      height: 5.6,
      qualification: 'Bachelor in Fashion Design',
      occupation: 'Model',
      income: 40000,
      smoking_status: 'Occasionally',
      drinking_status: 'Socially',
      preferred_min_height: 5.8,
      preferred_max_height: 6.4,
      preferred_religion: 'Any',
      preferred_caste: 'Any',
      preferred_mother_tongue: 'Any',
      preferred_location: 'Pokhara, Kathmandu',
      smoking_preference: 'Any',
      drinking_preference: 'Any',
      occupation_preference: 'Any',
      income_preference: 50000,
      country: 'Nepal',
      city: 'Pokhara',
      describe: 'Professional model who enjoys the outdoors and adventure sports. Love hiking in the Annapurna region and boating on Phewa Lake. Looking for someone adventurous and open-minded.'
    },
    {
      id: 3,
      name: 'Riya Shrestha',
      email: 'riya.shrestha@example.com',
      gender: 'Female',
      date_of_birth: '1995-12-03',
      age: 29,
      religion: 'Buddhist',
      caste: 'Newar',
      profile_image_url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
      images: [
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
        'https://images.unsplash.com/photo-1496440737103-cd596325d314',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
      ],
      mother_tongue: 'Nepali',
      local_address: 'Bharatpur, Chitwan',
      height: 5.4,
      qualification: 'Master in Computer Science',
      occupation: 'Software Engineer',
      income: 60000,
      smoking_status: 'Never',
      drinking_status: 'Never',
      preferred_min_height: 5.6,
      preferred_max_height: 6.0,
      preferred_religion: 'Any',
      preferred_caste: 'Any',
      preferred_mother_tongue: 'Nepali, English',
      preferred_location: 'Chitwan, Kathmandu',
      smoking_preference: 'Non-smoker',
      drinking_preference: 'Non-drinker preferred',
      occupation_preference: 'Professional, Engineer',
      income_preference: 50000,
      country: 'Nepal',
      city: 'Chitwan',
      describe: 'Tech enthusiast and nature lover. Work as a software engineer but enjoy disconnecting from technology on weekends to explore national parks. Looking for someone who values balance between career and personal life.'
    }
  ],
  
  appLogo: 'https://example.com/logo.png', // Replace with actual logo URL when available
};

const App = () => {
  const router = useRouter();
  const handlePress = (email: string) => {
    // Push to the dynamic route; encodeURIComponent ensures the email is URL safe.
    router.push(`./../UserDetails/${encodeURIComponent(email)}`);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {/* Using a text-based logo instead of image while database image is not available */}
          <View style={styles.logoCircles}>
            <View style={styles.circle1} />
            <View style={styles.circle2} />
          </View>
          <Text style={styles.logoTextLagan}>LAGAN</Text>
          <Text style={styles.logoTextGatho}>GATHO</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color="#7D2027" />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Mutual Matches Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mutual Matches</Text>
            <TouchableOpacity
            
            >
              <View style={styles.seeMoreContainer}>
                <Text style={styles.seeMoreText}>See More</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#7D2027" />
              </View>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
            {DATABASE.mutualMatches.map((match) => (
              <TouchableOpacity key={match.id} style={styles.matchCard}
              onPress={() => handlePress(match.email)}
              >
                <Image 
                  source={{ uri: `${match.profile_image_url}?w=500&h=350&fit=crop` }} 
                  style={styles.matchImage}
                  resizeMode="cover"
                />
                <View style={styles.matchInfo}>
                  <Text style={styles.matchName}>{match.name}</Text>
                  <Text style={styles.matchOccupation}>{match.occupation}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Your Preference Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Preference</Text>
            <TouchableOpacity>
              <View style={styles.seeMoreContainer}>
                <Text style={styles.seeMoreText}>See More</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#7D2027" />
              </View>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
            {DATABASE.preferences.map((preference) => (
              <TouchableOpacity key={preference.id} style={styles.preferenceCard}
              onPress={() => handlePress(preference.email)}
              >
                <Image 
                  source={{ uri: `${preference.profile_image_url}?w=500&h=800&fit=crop` }} 
                  style={styles.preferenceImage}
                  resizeMode="cover"
                />
                <View style={styles.preferenceGradient} />
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceName}>{preference.name}</Text>
                  <View style={styles.preferenceDetails}>
                    <FontAwesome name="briefcase" size={12} color="#fff" style={{marginRight: 4}} />
                    <Text style={styles.preferenceOccupation}>{preference.occupation}</Text>
                  </View>
                  <View style={styles.preferenceDetails}>
                    <Ionicons name="location-outline" size={12} color="#fff" style={{marginRight: 4}} />
                    <Text style={styles.preferenceLocation}>{preference.city}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={
          {
            height: 100,
          }
        }>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircles: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  circle1: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#7D2027',
    position: 'absolute',
    left: 0,
    top: 5,
  },
  circle2: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2, 
    borderColor: '#DAA520',
    position: 'absolute',
    right: 0,
    top: 5,
  },
  logoTextLagan: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7D2027',
    marginLeft: 5,
  },
  logoTextGatho: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DAA520',
    marginLeft: 5,
  },
  notificationBtn: {
    padding: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 14,
    color: '#7D2027',
    fontWeight: '500',
  },
  cardsContainer: {
    paddingLeft: 20,
  },
  matchCard: {
    width: 240,
    height: 170,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
  },
  matchImage: {
    width: '100%',
    height: '100%',
  },
  matchInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
  },
  matchName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchOccupation: {
    color: '#fff',
    fontSize: 12,
  },
  preferenceCard: {
    width: 280,
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
  },
  preferenceImage: {
    width: '100%',
    height: '100%',
  },
  preferenceGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  preferenceInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  preferenceName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  preferenceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  preferenceOccupation: {
    color: '#fff',
    fontSize: 12,
  },
  preferenceLocation: {
    color: '#fff',
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
  },
  navIndicator: {
    width: 100,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
  },
});

export default App;