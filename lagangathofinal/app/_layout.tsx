import React, { useState, useCallback } from "react";
import { AuthContext, USER } from "@/context/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [user, setUser] = useState<USER | undefined>(undefined);
  
  // You can implement these functions here if you need them
  const logout = useCallback(() => {
    setUser(undefined);
  }, []);
  
  const fetchUserData = useCallback(async () => {
    // Here you would typically make an API call to get the latest user data
    // For now, we'll just return the current user
    if (!user) throw new Error("No user logged in");
    return user;
  }, [user]);
  
  const login = useCallback(async (email: string, password: string) => {
    // Here you would implement the login logic
    // For now, this is just a placeholder
    try {
      // Mock API call
      // const response = await fetch('/api/login', {...})
      // const userData = await response.json()
      // setUser(userData)
      console.log("Login attempt with:", email, password);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);
  
  // Create the context value object
  const authContextValue = {
    user,
    setUser,
    logout,
    fetchUserData,
    login
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      <Stack>
        <Stack.Screen 
          name='landing'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name='(auth)/SignUp'
          options={{
            headerTransparent: true,
            headerTitle: '',
          }}
        />
        <Stack.Screen 
          name='(auth)/SignIn'
          options={{
            headerTransparent: true,
            headerTitle: '',
          }}
        />
        <Stack.Screen 
          name='index'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name='(tabs)'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name='Update'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name='User/[email]'
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen 
          name='UserDetails/[email]'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name='chat'
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </AuthContext.Provider>
  );
}