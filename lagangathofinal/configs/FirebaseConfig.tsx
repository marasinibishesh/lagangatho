// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
//@ts-ignore
import { getAuth, initializeAuth,getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage  from "@react-native-async-storage/async-storage"; 
import React from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7dUD-phuNPAWbmZhoybjNsM2BJkonvtw",
  authDomain: "lagangathofinal.firebaseapp.com",
  projectId: "lagangathofinal",
  storageBucket: "lagangathofinal.firebasestorage.app",
  messagingSenderId: "100396705206",
  appId: "1:100396705206:web:afdae9aed14a63019d0d17",
  measurementId: "G-CB0W0XC8FJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=initializeAuth(app,{
    persistence:getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db=getFirestore(app)
//const analytics = getAnalytics(app);