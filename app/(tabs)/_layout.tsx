import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Home, Grid, Heart, Bookmark, User, Search } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAdmin } = useAuth();
  // console.log("isAdmin", isAdmin);

  if(!isAdmin) {
  return ( 
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          marginBottom: 6,
        },
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? COLORS.background : COLORS.white,
          borderTopColor: COLORS.textSecondary,
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? COLORS.background : COLORS.white,
        },
        headerTintColor: colorScheme === 'dark' ? COLORS.white : COLORS.black,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? 
            <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} /> :
            null
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Search size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <Grid size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Heart size={size - 2} color={color} />
          ),
        }}
      /> 
        <Tabs.Screen
          name="admin"
          options={{
            href: null,
          }}
        />  <Tabs.Screen
          name="catalogs"
          options={{
            title: 'Catalogs',
            tabBarIcon: ({ color, size }) => (
              <Bookmark size={size - 2} color={color} />
            ),
          }}
        />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size - 2} color={color} />
          ),
        }}
      /> 
    
    </Tabs>
  );}

  if(isAdmin) {

    return (
      
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          marginBottom: 6,
        },
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? COLORS.background : COLORS.white,
          borderTopColor: COLORS.textSecondary,
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? COLORS.background : COLORS.white,
        },
        headerTintColor: colorScheme === 'dark' ? COLORS.white : COLORS.black,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? 
            <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} /> :
            null
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          href: null,
        }}
      /> 
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, size }) => (
              <User size={size - 2} color={color} />
            ),
          }}
        />  
      <Tabs.Screen
          name="catalogs"
          options={{
            title: 'Catalogs',
            tabBarIcon: ({ color, size }) => (
              <Bookmark size={size - 2} color={color} />
            ),
          }}
        />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size - 2} color={color} />
          ),
        }}
      />
    
    </Tabs>
    );}
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    elevation: 0,
    borderRadius: 20,
    height: 70,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
        backgroundColor: COLORS.white90,
      },
    }),
    borderTopWidth: 0,
    paddingVertical: SPACING.sm,
  },
});