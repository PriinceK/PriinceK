import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './src/theme';

import DashboardScreen from './src/screens/DashboardScreen';
import DayAsListScreen from './src/screens/DayAsListScreen';
import DayAsScenarioScreen from './src/screens/DayAsScenarioScreen';
import ChallengesListScreen from './src/screens/ChallengesListScreen';
import ChallengeDetailScreen from './src/screens/ChallengeDetailScreen';
import CanvasScreen from './src/screens/CanvasScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.darker },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '600', fontSize: 17 },
  contentStyle: { backgroundColor: colors.bg },
};

function ScenariosStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="DayAsList" component={DayAsListScreen} options={{ title: 'A Day As...' }} />
      <Stack.Screen name="DayAsScenario" component={DayAsScenarioScreen} options={{ title: 'Scenario' }} />
    </Stack.Navigator>
  );
}

function ChallengesStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ChallengesList" component={ChallengesListScreen} options={{ title: 'Challenges' }} />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} options={{ title: 'Challenge' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.blue,
          background: colors.bg,
          card: colors.darker,
          text: colors.text,
          border: colors.border,
          notification: colors.red,
        },
      }}
    >
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = focused ? 'cloud' : 'cloud-outline';
            else if (route.name === 'Scenarios') iconName = focused ? 'calendar' : 'calendar-outline';
            else if (route.name === 'Challenges') iconName = focused ? 'trophy' : 'trophy-outline';
            else if (route.name === 'Canvas') iconName = focused ? 'grid' : 'grid-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.blue,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.darker,
            borderTopColor: colors.border,
            paddingBottom: 4,
            height: 88,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={DashboardScreen}
          options={{
            headerShown: true,
            headerTitle: 'GCP Practice Lab',
            ...screenOptions,
          }}
        />
        <Tab.Screen name="Scenarios" component={ScenariosStack} />
        <Tab.Screen name="Challenges" component={ChallengesStack} />
        <Tab.Screen
          name="Canvas"
          component={CanvasScreen}
          options={{
            headerShown: true,
            headerTitle: 'Architecture Canvas',
            ...screenOptions,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
