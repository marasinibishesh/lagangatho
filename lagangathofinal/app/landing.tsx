import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar,Image } from 'react-native'
import React from 'react'
import Colors from '@/data/Colors';
import { useRouter } from 'expo-router';

export default function landing() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Logo container */}
      <View style={styles.logoContainer}>
        {/* Logo image instead of circles */}
        <Image 
          source={require('./../assets/images/MainLogo.png')} // Replace with actual path to your logo
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      {/* Call to action button */}
      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/(auth)/SignUp')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      {/* SignIn option */}
      <View style={{
        paddingHorizontal: 20,
        marginTop: 0,
        marginBottom: 30,
        }}>
        <Text style={{textAlign: 'center', fontSize: 16, color: 'gray',fontFamily: 'sans-serif-light'}}>
          Already have an account?{' '}
          <Text
            style={{color: Colors.lred, fontWeight: 'bold'}}
            onPress={() => router.push('/(auth)/SignIn')}
          >
            Sign In
          </Text>
        </Text>
      </View>
      {/* Footer logo */}
      <View style={styles.footer}>
        <View style={styles.footerLogoContainer}>
          <View style={styles.redDiamond} />
          <View style={styles.goldDiamond} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 20,
  },
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
  button: {
    backgroundColor: Colors.lgold,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignSelf: 'center',
    width: '90%',
    alignItems: 'center',
    marginBottom: 70,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDiamond: {
    width: 10,
    height: 10,
    backgroundColor: Colors.lred,
    transform: [{ rotate: '45deg' }],
    marginRight: 5,
  },
  goldDiamond: {
    width: 10,
    height: 10,
    backgroundColor: Colors.lgold,
    transform: [{ rotate: '45deg' }],
    marginLeft: 5,
  },
});