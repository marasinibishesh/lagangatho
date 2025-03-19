import React, { useState, useEffect, useContext } from 'react';
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
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from './../context/AuthContext'; // Adjust path if needed
import { client } from '@/configs/NilePostgresConfig';
import { cld, options } from '@/configs/CloudinaryConfig';
import axios from "axios";
import { useRouter } from "expo-router";

// Define types
type GenderType = 'male' | 'female';
type ReligionType = 'Hinduism' | 'Buddhism' | 'Islam' | 'Christianity' | 'Kirat' | 'Others';
type CasteType = 
  'Brahmin' | 'Chhetri' | 'Thakuri' | 'Dalit' | 'Newar' | 'Tamang' | 
  'Magar' | 'Gurung' | 'Rai' | 'Limbu' | 'Sherpa' | 'Tharu' | 'Others';

type UserData = {
  id: number;
  name: string;
  email: string;
  gender: GenderType;
  date_of_birth: string;
  age: number;
  religion: ReligionType;
  caste: CasteType;
  profile_image_url: string;
  
  // Extra columns
  city?: string;
  country?: string;
  describe?: string;
  mother_tongue?: string | null;
  height?: number | null;
  occupation?: string | null;
  qualification?: string | null;
  local_address?: string | null;
  income?: number | null;
  smoking_status?: string | null;
  drinking_status?: string | null;
  smoking_preference?: string | null;
  drinking_preference?: string | null;
  preferred_religion?: string | null;
  preferred_caste?: string | null;
  preferred_mother_tongue?: string | null;
  preferred_location?: string | null;
  preferred_min_height?: number | null;
  preferred_max_height?: number | null;
  occupation_preference?: string | null;
  income_preference?: string | null;
  images?: string[];  // For multiple images
};

const UpdateProfileScreen: React.FC = () => {
  // Pull user from context
  const { user } = useContext(AuthContext) as { user: UserData };

  // -- State hooks for each field:
  const [fullName, setFullName] = useState<string>(user.name || '');
  const [gender, setGender] = useState<GenderType>(user.gender || 'male');
  const [religion, setReligion] = useState<ReligionType>(user.religion || 'Hinduism');
  const [caste, setCaste] = useState<CasteType>(user.caste || 'Brahmin');
  const [date, setDate] = useState<Date>(new Date(user.date_of_birth || new Date()));
  const [age, setAge] = useState<number | null>(user.age || null);
  const [city, setCity] = useState<string>(user.city || '');
  const [country, setCountry] = useState<string>(user.country || '');
  const [description, setDescription] = useState<string>(user.describe || '');
  const [motherTongue, setMotherTongue] = useState<string>(user.mother_tongue || '');
  const [height, setHeight] = useState<string>(user.height ? user.height.toString() : '');
  const [occupation, setOccupation] = useState<string>(user.occupation || '');
  const [qualification, setQualification] = useState<string>(user.qualification || '');
  const [localAddress, setLocalAddress] = useState<string>(user.local_address || '');
  const [income, setIncome] = useState<string>(user.income ? user.income.toString() : '');
  const router = useRouter();
  // Lifestyle
  const [smokingStatus, setSmokingStatus] = useState<string | null>(user.smoking_status || '');
  const [drinkingStatus, setDrinkingStatus] = useState<string | null>(user.drinking_status || '');

  // Preferences
  const [smokingPreference, setSmokingPreference] = useState<string | null>(user.smoking_preference || '');
  const [drinkingPreference, setDrinkingPreference] = useState<string | null>(user.drinking_preference || '');
  const [preferredReligion, setPreferredReligion] = useState<string | null>(user.preferred_religion || '');
  const [preferredCaste, setPreferredCaste] = useState<string | null>(user.preferred_caste || '');
  const [preferredMotherTongue, setPreferredMotherTongue] = useState<string | null>(user.preferred_mother_tongue || '');
  const [preferredLocation, setPreferredLocation] = useState<string | null>(user.preferred_location || '');
  const [preferredMinHeight, setPreferredMinHeight] = useState<string>(
    user.preferred_min_height ? user.preferred_min_height.toString() : ''
  );
  const [preferredMaxHeight, setPreferredMaxHeight] = useState<string>(
    user.preferred_max_height ? user.preferred_max_height.toString() : ''
  );
  const [occupationPreference, setOccupationPreference] = useState<string | null>(user.occupation_preference || '');
  const [incomePreference, setIncomePreference] = useState<string | null>(user.income_preference || '');

  // Image states
  const [profileImage, setProfileImage] = useState<string | null>(user.profile_image_url || null);
  const [images, setImages] = useState<string[]>(user.images || []);

  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Dropdown options
  const religions: ReligionType[] = ['Hinduism', 'Buddhism', 'Islam', 'Christianity', 'Kirat', 'Others'];
  const castes: CasteType[] = [
    'Brahmin','Chhetri','Thakuri','Dalit','Newar','Tamang','Magar',
    'Gurung','Rai','Limbu','Sherpa','Tharu','Others'
  ];
  const statusOptions = ['Yes', 'No', 'Occasionally'];
  const preferenceOptions = ['Yes', 'No', "Doesn't matter"];

  // Calculate age from date_of_birth
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

  // Recalculate age when date changes
  useEffect(() => {
    setAge(calculateAge(date));
  }, [date]);

  // Upload image to Cloudinary
  const uploadToCloudinary = async (imageUri: string) => {
    // Ensure these environment variables are set:
    // EXPO_PUBLIC_CLOUD_NAME, EXPO_PUBLIC_UPLOAD_PRESET
    const apiUrl = `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
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

  // Pick a single profile image
  const pickImage = async (): Promise<void> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to allow access to your photos!");
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

  // Pick multiple additional images
  const pickMultipleImages = async (): Promise<void> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to allow access to your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      setImages(prevImages => [...prevImages, ...newUris]);
    }
  };

  // Remove an image from the images array
  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  // Handle DateTimePicker change
  const onChange = (event: any, selectedDate?: Date): void => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Handle the update submission
  const handleUpdate = async () => {
    // Basic validation
    if (!fullName || !gender || !religion || !caste || !date) {
      Alert.alert('Missing Information', 'Please fill all the required fields!');
      return;
    }

    setIsLoading(true);

    try {
      // Upload profile image if changed
      let imageUrl = profileImage;
      if (profileImage && profileImage !== user.profile_image_url && !profileImage.startsWith('http')) {
        imageUrl = await uploadToCloudinary(profileImage);
      }

      // Upload additional images if they are local URIs
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (!img.startsWith('http')) {
            return await uploadToCloudinary(img);
          }
          return img;
        })
      );

      // Prepare data payload (MUST include user.id for the PUT route)
      const userData = {
        id: user.id,
        name: fullName,
        email: user.email, // or let user also edit email if you prefer
        gender,
        date_of_birth: date.toISOString().split('T')[0],
        age,
        religion,
        caste,
        profile_image_url: imageUrl,

        city,
        country,
        describe: description,
        mother_tongue: motherTongue,
        height: height ? parseFloat(height) : null,
        occupation,
        qualification,
        local_address: localAddress,
        income: income ? parseFloat(income) : null,

        smoking_status: smokingStatus,
        drinking_status: drinkingStatus,
        smoking_preference: smokingPreference,
        drinking_preference: drinkingPreference,
        preferred_religion: preferredReligion,
        preferred_caste: preferredCaste,
        preferred_mother_tongue: preferredMotherTongue,
        preferred_location: preferredLocation,
        preferred_min_height: preferredMinHeight ? parseFloat(preferredMinHeight) : null,
        preferred_max_height: preferredMaxHeight ? parseFloat(preferredMaxHeight) : null,
        occupation_preference: occupationPreference,
        income_preference: incomePreference,

        images: uploadedImages, // store array of image URLs in DB
      };

      // Send PUT request to your server
      const result = await axios.put(`${process.env.EXPO_PUBLIC_HOST_URL}/user`, userData);
      console.log('Update successful:', result.data);

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Update Failed', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
        onPress={() => router.push("/(tabs)/Profile")}
        style={{
          position: "absolute",
          top: 0, // Adjust based on status bar
          left: 10,
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Image
          source={require("./../assets/images/Profile.png")}
          style={{ width: 70, height: 20 }}
        />
      </TouchableOpacity>
          <Text style={styles.title}>Update Profile</Text>

          {/* Profile Image Picker */}
          <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>Update Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Additional Images Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Additional Images</Text>
            <View style={styles.imagesContainer}>
              {images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img }} style={styles.additionalImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton} 
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addImageButton} onPress={pickMultipleImages}>
                <Text style={styles.addImageText}>Add Images</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
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

            {/* Gender */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[styles.radioButton, gender === 'male' && styles.radioButtonSelected]}
                  onPress={() => setGender('male')}
                >
                  <Text style={[styles.radioText, gender === 'male' && styles.radioTextSelected]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, gender === 'female' && styles.radioButtonSelected]}
                  onPress={() => setGender('female')}
                >
                  <Text style={[styles.radioText, gender === 'female' && styles.radioTextSelected]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
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
                  onValueChange={(itemValue) => setReligion(itemValue as ReligionType)}
                >
                  {religions.map((item, idx) => (
                    <Picker.Item key={idx} label={item} value={item} />
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
                  onValueChange={(itemValue) => setCaste(itemValue as CasteType)}
                >
                  {castes.map((item, idx) => (
                    <Picker.Item key={idx} label={item} value={item} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Enter your city"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="Enter your country"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Local Address</Text>
              <TextInput
                style={styles.input}
                value={localAddress}
                onChangeText={setLocalAddress}
                placeholder="Enter your local address"
              />
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe yourself"
                multiline
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mother Tongue</Text>
              <TextInput
                style={styles.input}
                value={motherTongue}
                onChangeText={setMotherTongue}
                placeholder="Enter your mother tongue"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Height (in cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="Enter your height"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Occupation</Text>
              <TextInput
                style={styles.input}
                value={occupation}
                onChangeText={setOccupation}
                placeholder="Enter your occupation"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Qualification</Text>
              <TextInput
                style={styles.input}
                value={qualification}
                onChangeText={setQualification}
                placeholder="Enter your qualification"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Income</Text>
              <TextInput
                style={styles.input}
                value={income}
                onChangeText={setIncome}
                placeholder="Enter your income"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Lifestyle */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Lifestyle</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Smoking Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={smokingStatus}
                  onValueChange={(itemValue) => setSmokingStatus(itemValue)}
                >
                  {statusOptions.map((option, idx) => (
                    <Picker.Item key={idx} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Drinking Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={drinkingStatus}
                  onValueChange={(itemValue) => setDrinkingStatus(itemValue)}
                >
                  {statusOptions.map((option, idx) => (
                    <Picker.Item key={idx} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Smoking Preference</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={smokingPreference}
                  onValueChange={(itemValue) => setSmokingPreference(itemValue)}
                >
                  {preferenceOptions.map((option, idx) => (
                    <Picker.Item key={idx} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Drinking Preference</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={drinkingPreference}
                  onValueChange={(itemValue) => setDrinkingPreference(itemValue)}
                >
                  {preferenceOptions.map((option, idx) => (
                    <Picker.Item key={idx} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Religion</Text>
              <TextInput
                style={styles.input}
                value={preferredReligion || ''}
                onChangeText={setPreferredReligion}
                placeholder="Enter preferred religion"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Caste</Text>
              <TextInput
                style={styles.input}
                value={preferredCaste || ''}
                onChangeText={setPreferredCaste}
                placeholder="Enter preferred caste"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Mother Tongue</Text>
              <TextInput
                style={styles.input}
                value={preferredMotherTongue || ''}
                onChangeText={setPreferredMotherTongue}
                placeholder="Enter preferred mother tongue"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Location</Text>
              <TextInput
                style={styles.input}
                value={preferredLocation || ''}
                onChangeText={setPreferredLocation}
                placeholder="Enter preferred location"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Minimum Height (in cm)</Text>
              <TextInput
                style={styles.input}
                value={preferredMinHeight}
                onChangeText={setPreferredMinHeight}
                placeholder="Enter minimum height"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Maximum Height (in cm)</Text>
              <TextInput
                style={styles.input}
                value={preferredMaxHeight}
                onChangeText={setPreferredMaxHeight}
                placeholder="Enter maximum height"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Occupation Preference</Text>
              <TextInput
                style={styles.input}
                value={occupationPreference || ''}
                onChangeText={setOccupationPreference}
                placeholder="Enter occupation preference"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Income Preference</Text>
              <TextInput
                style={styles.input}
                value={incomePreference || ''}
                onChangeText={setIncomePreference}
                placeholder="Enter income preference"
              />
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Replace with your own success icon */}
            <Image source={require('./../assets/images/Licon.png')} style={styles.modalLogo} />
            <Text style={styles.successTitle}>Profile Updated!</Text>
            <Text style={styles.successMessage}>
              Your profile has been successfully updated.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// -- Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8B0000',
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  profileImagePlaceholderText: {
    color: '#8B0000',
  },
  sectionContainer: {
    width: '100%',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  radioContainer: {
    flexDirection: 'row',
  },
  radioButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#8B0000',
  },
  radioText: {
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
  },
  ageContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  ageText: {
    color: '#333',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  additionalImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff0000',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 12,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalLogo: {
    width: 50,
    height: 50,
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdateProfileScreen;
