import { Redirect, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { useEffect, useState, useRef } from "react";
import { auth } from "@/configs/FirebaseConfig";
import axios from 'axios';
import { AuthContext, useAuth } from "@/context/AuthContext";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  // Use the custom hook instead of useContext directly
  const authContext = useAuth();
  const router = useRouter();
  
  // Create animated value for opacity
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Set up the fade animation
  useEffect(() => {
    // Create a repeating fade in/out animation
    Animated.loop(
      Animated.sequence([
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(userData) => {
      try {
        if(userData && userData?.email){
          try {
            const result = await axios.get(
              `${process.env.EXPO_PUBLIC_HOST_URL}/user?email=${userData?.email}`
            );
            console.log(result.data.data);
            authContext.setUser(result.data.data);
            // Don't navigate here - we'll handle it in the render
          } catch (error) {
            console.error("Error fetching user data:", error);
            router.replace('/landing');
          }
        } else {
          // No user is logged in
          // Don't navigate here - we'll handle it in the render
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    });
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [authContext]);
  
  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.logoContainer}>
          {/* Animated logo image with fade effect */}
          <Animated.Image
            source={require('./../assets/images/Licon.png')}
            style={[
              styles.logoImage,
              { opacity: fadeAnim }
            ]}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }
  
  // Once auth is checked, redirect based on auth state
  if (authChecked) {
    if (authContext.user) {
      return <Redirect href="/(tabs)/Profile" />;
    } else {
      return <Redirect href="/landing" />;
    }
  }
  
  // This should never be reached, but just in case
  return null;
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: '70%',
    height: '40%',
  },
});