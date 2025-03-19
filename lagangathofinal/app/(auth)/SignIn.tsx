import React, { useState,useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter,Redirect } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/configs/FirebaseConfig';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';
export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const onSignInBtnClick = () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async(resp) => {
        if (resp.user) {
          console.log(resp.user?.email);
          //API CALL TO FETCH USER DATA
          const result=await axios.get(process.env.EXPO_PUBLIC_HOST_URL+'/user?email='+resp.user?.email);
          console.log(result.data);
          setUser(result?.data);
          router.replace("/(tabs)/Profile");

        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        if (err.message === 'Firebase: Error (auth/user-not-found).') {
          alert('User not found');
        } else if (err.message === 'Firebase: Error (auth/wrong-password).') {
          alert('Wrong password');
        } else if (err.message === 'Firebase: Error (auth/invalid-email).') {
          alert('Invalid email');
        } else if (err.message === 'Firebase: Error (auth/too-many-requests).') {
          alert('Too many requests');
        } else if (err.message === 'Firebase: Error (auth/network-request-failed).') {
          alert('Network request failed');
        } else if (err.message === 'Firebase: Error (auth/invalid-credential).') {
          alert('Enter Correct Email or Password');
        } else {
          alert(err.message);
        }
      });
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Logo */}
        <Image 
          source={require('./../../assets/images/Licon.png')} 
          style={styles.logo}
        />
        
        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.subtitleText}>Enter Your Credentials</Text>
        
        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.iconContainer}>
              <Text style={styles.emailIcon}>✉️</Text>
            </View>
          </View>
          
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.iconContainer} 
              onPress={togglePasswordVisibility}
            >
              <Text style={styles.lockIcon}>{showPassword ? '👁️' : '🔒'}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Login Button */}
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={onSignInBtnClick}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          
        </View>
        
        {/* Sign Up */}
        <View style={styles.signUpContainer}>
          <Text style={styles.noAccountText}>Don't have any account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/SignUp')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B0000', // Dark red color as shown in the image
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#DAA520', // Golden color as shown in the image
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  emailIcon: {
    fontSize: 18,
  },
  lockIcon: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#DAA520', // Golden color for button
    borderRadius: 6,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  forgotPasswordText: {
    color: '#8B0000', // Dark red color
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
  },
  noAccountText: {
    color: '#333',
    fontSize: 14,
  },
  signUpText: {
    color: '#8B0000', // Dark red color
    fontWeight: 'bold',
    fontSize: 14,
  }
});