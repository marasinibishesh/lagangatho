import React, { useState, useRef, FC } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  PanResponderGestureState,
  GestureResponderEvent,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

// 1) Define an interface for each Profile item
interface Profile {
  id: number;
  name: string;
  age: number;
  occupation: string;
  location: string;
  mainImage: string;
  images: string[];
  description: string;
  details: {
    religion: string;
    caste: string;
    height: string;
    qualification: string;
    smoking: string;
    drinking: string;
  };
}

// 2) Define possible swipe directions
type SwipeDirection = 'left' | 'right' | 'up' | 'down';

// 3) Dummy data
const Database: Profile[] = [
  {
    id: 1,
    name: 'Supriya Shrestha',
    age: 25,
    occupation: 'Content Creator',
    location: 'Lalitpur, Nepal',
    mainImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      'https://images.unsplash.com/photo-1544005315-61b049f76e44',
    ],
    description: 'Passionate content creator who loves exploring culture and lifestyle.',
    details: {
      religion: 'Hindu',
      caste: 'Shrestha',
      height: '5.3 ft',
      qualification: 'Bachelor in Arts',
      smoking: 'Never',
      drinking: 'Occasionally'
    }
  },
  {
    id: 2,
    name: 'Ekata Tandukar',
    age: 29,
    occupation: 'Content Creator',
    location: 'Baneshwor, Kathmandu',
    mainImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      'https://images.unsplash.com/photo-1515023115689-589c33041d3c',
      'https://images.unsplash.com/photo-1504703395950-b89145a5425b'
    ],
    description: 'Creative professional who enjoys photography and outdoor adventures.',
    details: {
      religion: 'Hindu',
      caste: 'Newar',
      height: '5.4 ft',
      qualification: 'Bachelor in Mass Communication',
      smoking: 'Never',
      drinking: 'Occasionally'
    }
  },
  {
    id: 3,
    name: 'Sushma Karki',
    age: 30,
    occupation: 'Makeup Artist',
    location: 'Bouddha, Kathmandu',
    mainImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      'https://images.unsplash.com/photo-1532910404247-7ee9488d7292'
    ],
    description: 'Creative makeup artist with a passion for beauty and fashion.',
    details: {
      religion: 'Hindu',
      caste: 'Chhetri',
      height: '5.5 ft',
      qualification: 'Diploma in Cosmetology',
      smoking: 'Never',
      drinking: 'Occasionally'
    }
  },
  {
    id: 4,
    name: 'Riya Shrestha',
    age: 29,
    occupation: 'Software Engineer',
    location: 'Bharatpur, Chitwan',
    mainImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
    images: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
      'https://images.unsplash.com/photo-1496440737103-cd596325d314',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    ],
    description: 'Tech enthusiast and nature lover.',
    details: {
      religion: 'Buddhist',
      caste: 'Newar',
      height: '5.4 ft',
      qualification: 'Master in Computer Science',
      smoking: 'Never',
      drinking: 'Never'
    }
  }
];

// 4) Props for ProfileCard
interface ProfileCardProps {
  profile: Profile;
  index: number;
  isTop: boolean;
  onSwipe: (direction: SwipeDirection) => void;
}

// 5) ProfileCard component in TS
const ProfileCard: FC<ProfileCardProps> = ({ profile, index, isTop, onSwipe }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const pan = useRef(new Animated.ValueXY()).current;

  // Rotate interpolation
  const rotate = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  // Overlays
  const likeOpacity = pan.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const removeOpacity = pan.y.interpolate({
    inputRange: [-height / 6, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Down-swipe (ACCEPT)
  const acceptOpacity = pan.y.interpolate({
    inputRange: [0, height / 6],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // PanResponder
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => isTop,
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (
      _evt: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ) => {
      const { dx, dy } = gestureState;

      // Right swipe
      if (dx > SWIPE_THRESHOLD) {
        Animated.spring(pan, {
          toValue: { x: width + 100, y: dy },
          useNativeDriver: false,
        }).start(() => onSwipe('right'));
      }
      // Left swipe
      else if (dx < -SWIPE_THRESHOLD) {
        Animated.spring(pan, {
          toValue: { x: -width - 100, y: dy },
          useNativeDriver: false,
        }).start(() => onSwipe('left'));
      }
      // Up swipe
      else if (dy < -SWIPE_THRESHOLD) {
        Animated.spring(pan, {
          toValue: { x: dx, y: -height - 100 },
          useNativeDriver: false,
        }).start(() => onSwipe('up'));
      }
      // Down swipe (ACCEPT)
      else if (dy > SWIPE_THRESHOLD) {
        Animated.spring(pan, {
          toValue: { x: dx, y: height + 100 },
          useNativeDriver: false,
        }).start(() => onSwipe('down'));
      }
      // Reset if not enough swipe
      else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? profile.images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % profile.images.length
    );
  };

  // Card transform style
  const cardStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { rotate },
      { scale: isTop ? 1 : 1 - index * 0.05 },
    ],
    top: index * 10,
    zIndex: 1000 - index,
  };

  return (
    <Animated.View
      style={[styles.card, cardStyle]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      <Image
        source={{ uri: profile.images[currentImageIndex] }}
        style={styles.cardImage}
      />

      {/* Image navigation */}
      {isTop && (
        <>
          <View style={styles.imageNavigation}>
            <TouchableOpacity style={styles.navButton} onPress={prevImage}>
              <Feather name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={nextImage}>
              <Feather name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Pagination dots */}
          <View style={styles.pagination}>
            {profile.images.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.paginationDot,
                  idx === currentImageIndex ? styles.activeDot : null
                ]}
              />
            ))}
          </View>
        </>
      )}

      {/* Profile info */}
      <View style={styles.profileInfo}>
        <View>
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          <Text style={styles.occupation}>{profile.occupation}</Text>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={16} color="white" />
            <Text style={styles.location}>{profile.location}</Text>
          </View>
        </View>

        {/* Quick like/dislike buttons */}
      </View>

      {/* Overlays */}
      {isTop && (
        <>
          <Animated.View
            style={[
              styles.overlay,
              styles.likeOverlay,
              { opacity: likeOpacity }
            ]}
          >
            <Text style={styles.overlayText}>LIKE</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.overlay,
              styles.nopeOverlay,
              { opacity: nopeOpacity }
            ]}
          >
            <Text style={styles.overlayText}>NOPE</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.overlay,
              styles.removeOverlay,
              { opacity: removeOpacity }
            ]}
          >
            <Text style={styles.overlayText}>REMOVE</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.overlay,
              styles.acceptOverlay,
              { opacity: acceptOpacity }
            ]}
          >
            <Text style={styles.overlayText}>ACCEPT</Text>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
};

// 6) ProfileStack container
const ProfileStack: FC = () => {
  const [profileStack, setProfileStack] = useState<Profile[]>(Database);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  // Called when user swipes in any direction
  const handleSwipe = (direction: SwipeDirection) => {
    setProfileStack((prevStack) => prevStack.slice(1));
    console.log('Swiped:', direction);
  };
   // Refresh handler (reset to original Database)
   const handleRefresh = () => {
    setProfileStack([...Database]); // or setProfileStack(Database);
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'received' && styles.activeTab]}
            onPress={() => setActiveTab('received')}
          >
            <Text style={styles.tabText}>Received</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
            onPress={() => setActiveTab('sent')}
          >
            <Text style={styles.tabText}>Sent</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card stack */}
      <View style={styles.profileStackContainer}>
        {profileStack.slice(0, 3).map((profile, index) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            index={index}
            isTop={index === 0}
            onSwipe={handleSwipe}
          />
        ))}

        {profileStack.length === 0 && (
          <View style={styles.emptyStack}>
            <Text style={styles.emptyText}>No more profiles</Text>
            <TouchableOpacity style={styles.refreshButton}
            onPress={handleRefresh}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileStack;

// 7) Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#D4A017',
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#8B0000',
  },
  tabText: {
    color: 'white',
    fontWeight: '600',
  },
  profileStackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    position: 'absolute',
    width: width - 20,
    height: height * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageNavigation: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    position: 'absolute',
    top: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  activeDot: {
    width: 20,
    backgroundColor: 'white',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  occupation: {
    fontSize: 18,
    color: 'white',
    marginTop: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  location: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 100,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dislikeButton: {
    backgroundColor: '#FF3B30',
  },
  likeButton: {
    backgroundColor: '#4CD964',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    padding: 10,
    borderWidth: 3,
    borderRadius: 10,
  },
  likeOverlay: {
    left: 40,
    borderColor: '#4CD964',
    transform: [{ rotate: '-15deg' }],
  },
  nopeOverlay: {
    right: 40,
    borderColor: '#FF3B30',
    transform: [{ rotate: '15deg' }],
  },
  removeOverlay: {
    alignSelf: 'center',
    borderColor: '#FFA500',
  },
  acceptOverlay: {
    alignSelf: 'center',
    borderColor: '#00BFFF',
    top: 100,
  },
  overlayText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyStack: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    marginVertical: 10,
  },
  refreshButton: {
    backgroundColor: '#D4A017',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshText: {
    color: 'white',
    fontWeight: '600',
  },
});
