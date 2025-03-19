import { AuthContext } from '@/context/AuthContext'
import { Tabs } from 'expo-router'
import React, { useContext } from 'react'
import { Image } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '@/data/Colors';

export default function TabLayout() {
    const {user} = useContext(AuthContext);
    
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.lred,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FBF7ED',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: 'absolute',
                    elevation: 5, // For Android shadow
                    shadowColor: '#000', // iOS shadow
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    height: 60,
                    paddingBottom: 5,
                    paddingTop: 5,
                },
                
            }}
        >
            <Tabs.Screen 
                name="Home"
                options={{
                    tabBarIcon:({color,size})=>{
                        return(
                            <Image
                                style={{
                                    width:size,
                                    height:size,
                                    tintColor:color
                                }}
                                source={require('./../../assets/images/Home.png')}
                            />
                        )
                    }
                }}
            />
            <Tabs.Screen 
                name="Search"
                options={{
                    tabBarIcon:({color,size})=>{
                        return(
                            <Image
                                style={{
                                    width:size,
                                    height:size,
                                    tintColor:color
                                }}
                                source={require('./../../assets/images/Search.png')}
                            />
                        )
                    }
                }}
            />
            <Tabs.Screen 
                name="Connection"
                options={{
                    tabBarIcon:({color,size})=>
                        <AntDesign name="hearto" size={size} color={color} /> 
                }}
            />
            <Tabs.Screen 
                name="Lagan"
                options={{
                    tabBarIcon:({color,size})=>{
                        return(
                            <Image
                                style={{
                                    width:size,
                                    height:size,
                                    tintColor:color
                                }}
                                source={require('./../../assets/images/Lagan.png')}
                            />
                        )
                    }
                }}
            />
            <Tabs.Screen 
                name="Profile"
                options={{
                    tabBarIcon:({color,size})=>{
                        return(
                            <Image
                                source={{uri:user?.profile_image_url}}
                                style={{
                                    width:size,
                                    height:size,
                                    borderRadius:99
                                }}
                            />
                        )
                    }
                }} 
            />
        </Tabs>
    )
}