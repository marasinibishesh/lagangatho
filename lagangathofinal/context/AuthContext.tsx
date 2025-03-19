import { createContext, useContext,useState, useEffect } from "react";

// Define the interface for User data
export interface USER {
  id: number;
  name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  age: number;
  religion: string;
  caste: string;
  profile_image_url: string;
  images: string[];
  mother_tongue: string;
  country: string;
  city: string;
  local_address: string;
  height: number;
  qualification: string;
  subject: string;
  occupation: string;
  income: number;
  smoking_status: string;
  drinking_status: string;
  preferred_min_height: number;
  preferred_max_height: number;
  preferred_religion: string;
  preferred_caste: string;
  preferred_mother_tongue: string;
  preferred_location: string;
  smoking_preference: string;
  drinking_preference: string;
  ocupation_preference: string;
  income_preference: string;
  describe: string;
}

// Define the explicit interface for the context
export interface AuthContextType {
  user: USER | undefined;
  setUser: React.Dispatch<React.SetStateAction<USER | undefined>>;
  
  logout?: () => void;
  fetchUserData?: () => Promise<USER>;
  login?: (email: string, password: string) => Promise<void>;
}

// Create default values that match the interface
const defaultContextValue: AuthContextType = {
  user: undefined,
  setUser: () => {},
  logout: () => {},
  fetchUserData: async () => {
    throw new Error("fetchUserData not implemented");
  },
  login: async () => {
    throw new Error("login not implemented");
  }
};

// Create the context with the default value
export const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};