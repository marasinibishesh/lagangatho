import React, { useState,useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../configs/FirebaseConfig';
import { cld, options } from '@/configs/CloudinaryConfig';
import axios from "axios";
import { useRouter } from 'expo-router';
// Define types
type GenderType = 'male' | 'female';
type ReligionType = 'Hinduism' | 'Buddhism' | 'Islam' | 'Christianity' | 'Kirat' | 'Others';
type CasteType = 'Brahmin' | 'Chhetri' | 'Thakuri' | 'Dalit' | 'Newar' | 'Tamang' | 
                'Magar' | 'Gurung' | 'Rai' | 'Limbu' | 'Sherpa' | 'Tharu' | 'Others';

const SignUpScreen: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router=useRouter();
  const [gender, setGender] = useState<GenderType>('male');
  const [religion, setReligion] = useState<ReligionType>('Hinduism');
  const [caste, setCaste] = useState<CasteType>('Brahmin');
  const [date, setDate] = useState<Date>(new Date());
  const [age, setAge] = useState<number | null>(null);

const calculateAge = (birthDate: Date): number => {
  const currentDate = new Date();
  const yearDiff = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  const dayDiff = currentDate.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return yearDiff - 1;
  }
  return yearDiff;
};

useEffect(() => {
  setAge(calculateAge(date));
}, [date]);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // New states for handling sign-up process
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Religions and castes arrays
  const religions: ReligionType[] = ['Hinduism', 'Buddhism', 'Islam', 'Christianity', 'Kirat', 'Others'];
  const castes: CasteType[] = [
    'Brahmin', 'Chhetri', 'Thakuri', 'Dalit', 'Newar', 'Tamang', 
    'Magar', 'Gurung', 'Rai', 'Limbu', 'Sherpa', 'Tharu', 'Others'
  ];

  // Function to upload image to Cloudinary
  const uploadToCloudinary = async (imageUri: string) => {
    const apiUrl = `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`;
    
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust based on your image type
      name: 'upload.jpg',
    } as any);
    formData.append('upload_preset', options.upload_preset);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = await response.json();
      console.log('Cloudinary upload success:', data);
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const onBtnPress = async () => {
    if (!fullName || !email || !password || !gender || !religion || !caste || !date) {
      alert('Please fill all the fields!');
      return;
    }
    // Add age check: alert and stop if age is less than 18
  if (age !== null && age < 18) {
    alert('You must be at least 18 years old to sign up.');
    return;
  }
    setIsLoading(true);
    
    try {
      // First create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user.uid);
      
      // Then upload the image if it exists and store user data
      if (profileImage) {
        try {
          const imageUrl = await uploadToCloudinary(profileImage);
          console.log('Profile image uploaded:', imageUrl);
          const result =await axios.post(process.env.EXPO_PUBLIC_HOST_URL+'/user',{
            name:fullName,
            email:email,
            gender:gender,
            date_of_birth:date,
            age:age,
            religion:religion,
            caste:caste,
            profile_image_url:imageUrl
          });
          console.log(result);
          //Route to Home Screen
          
          
        } catch (imageError) {
          console.error('Error uploading profile image:', imageError);
          // Continue with account creation even if image upload fails
        }
      }
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (error: any) {
      const errorMsg = error?.message;
      if (errorMsg === 'Firebase: Error (auth/email-already-in-use).') {
        alert('Email already in use');
      }
      else if (errorMsg === 'Firebase: Error (auth/weak-password).') {
        alert('Password is too weak');
      }
      else if (errorMsg === 'Firebase: Error (auth/invalid-email).') {
        alert('Invalid email');
      }
      else if (errorMsg === 'Firebase: Error (auth/operation-not-allowed).') {
        alert('Operation not allowed');
      }
      else if (errorMsg === 'Firebase: Error (auth/argument-error).') {
        alert('Argument error');
      }
      else if (errorMsg === 'Firebase: Error (auth/network-request-failed).') {
        alert('Network request failed');
      }
      else if (errorMsg === 'Firebase: Error (auth/too-many-requests).') {
        alert('Too many requests');
      }
      else if (errorMsg === 'Firebase: Error (auth/user-disabled).') {
        alert('User disabled');
      }
      else if (errorMsg === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
        alert('Password should be at least 6 characters');
      }
      else { 
        alert(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to pick profile image
  const pickImage = async (): Promise<void> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("You need to allow access to your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Handle date change
  const onChange = (event: any, selectedDate?: Date): void => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('./../../assets/images/Licon.png')}
              style={styles.logo}
            />
          </View>

          {/* Profile Image Picker */}
          <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.title}>Sign Up</Text>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Gender */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  gender === 'male' && styles.radioButtonSelected
                ]}
                onPress={() => setGender('male')}
              >
                <Text style={[
                  styles.radioText,
                  gender === 'male' && styles.radioTextSelected
                ]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  gender === 'female' && styles.radioButtonSelected
                ]}
                onPress={() => setGender('female')}
              >
                <Text style={[
                  styles.radioText,
                  gender === 'female' && styles.radioTextSelected
                ]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity 
              style={styles.input} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formatDate(date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
                maximumDate={new Date()}
              />
            )}
          </View>
          {/* Age */}
{age !== null && (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>Age</Text>
    <View style={styles.ageContainer}>
    <Text style={styles.ageText}>{age} years</Text>
    </View>
  </View>
)}
          {/* Religion */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Religion</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={religion}
                onValueChange={(itemValue: any) => setReligion(itemValue as ReligionType)}
                style={styles.picker}
              >
                {religions.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Caste */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Caste</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={caste}
                onValueChange={(itemValue: any) => setCaste(itemValue as CasteType)}
                style={styles.picker}
              >
                {castes.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={onBtnPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require('./../../assets/images/Licon.png')}
              style={styles.modalLogo}
            />
            <Text style={styles.successTitle}>Account Created!</Text>
            <Text style={styles.successMessage}>
              Your account has been successfully created. Please go to SignIn.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => router.push('/(auth)/SignIn')}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 70,
    resizeMode: 'contain',
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#8B0000', // Dark red border
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000', // Dark red border
  },
  profileImagePlaceholderText: {
    color: '#666',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8B0000', // Dark red
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#CD9B1D', // Golden color
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  radioButtonSelected: {
    backgroundColor: '#8B0000', // Dark red for selected
  },
  radioText: {
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  button: {
    backgroundColor: '#CD9B1D', // Golden color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E1C27B', // Lighter golden color for disabled state
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalLogo: {
    width: 120,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#CD9B1D',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ageContainer:{
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#8B0000',
    width: 90,
    alignItems: 'center',
  },
  ageText: {
    fontSize: 16,
    color: '#ffff',
    padding: 0,
  },
});

export default SignUpScreen;