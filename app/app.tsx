// App.js
// ------------------------------------------------------------
// React Native (Expo) demo app: Bottom Tabs + data passing + theme settings
// ------------------------------------------------------------
// How to run (Expo):
// 1) npm install -g expo-cli  (if needed)
// 2) npx create-expo-app tab-data-passing && cd tab-data-passing
// 3) Replace the generated App.js with this file's contents.
// 4) Install deps:
//    npm i @react-navigation/native @react-navigation/bottom-tabs
//    npm i react-native-screens react-native-safe-area-context
//    npm i @expo/vector-icons
// 5) Start: npx expo start
// ------------------------------------------------------------

import React, { useMemo, useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, TextInput, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// ----------------------
// Theme Context
// ----------------------
const ThemeContext = React.createContext(null);
const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [color, setColor] = useState('#3b82f6'); // default Tailwind blue-500
  const [mode, setMode] = useState('light'); // future toggle if needed

  const value = useMemo(() => ({ color, setColor, mode, setMode }), [color, mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ----------------------
// Demo Data
// ----------------------
const ITEMS = [
  { id: '1', name: 'Ada Lovelace', role: 'Mathematician', bio: 'Pioneer of computing, wrote the first algorithm intended to be carried out by a machine.' },
  { id: '2', name: 'Alan Turing', role: 'Computer Scientist', bio: 'Father of theoretical CS and AI; broke the Enigma code during WWII.' },
  { id: '3', name: 'Grace Hopper', role: 'Computer Scientist', bio: 'Invented the first compiler; coined the term "debugging".' },
  { id: '4', name: 'Katherine Johnson', role: 'Mathematician', bio: 'Her orbital mechanics work was critical to NASA missions.' },
  { id: '5', name: 'Hedy Lamarr', role: 'Inventor/Actor', bio: 'Co-invented frequency-hopping spread spectrum, basis for modern wireless.' },
];

// ----------------------
// Home Screen
// ----------------------
function HomeScreen({ navigation }) {
  const { color } = useTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { borderColor: color }]}
      onPress={() => navigation.navigate('Profile', { item })}
      activeOpacity={0.8}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>{item.role}</Text>
      <Text numberOfLines={2} style={styles.cardBody}>{item.bio}</Text>
      <View style={styles.ctaRow}>
        <Text style={[styles.link, { color }]}>View profile →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
      <FlatList
        data={ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

// ----------------------
// Profile Screen
// ----------------------
function ProfileScreen({ route, navigation }) {
  const { color } = useTheme();
  const selected = route?.params?.item ?? null;

  useEffect(() => {
    navigation.setOptions({ title: selected ? selected.name : 'Profile' });
  }, [selected, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {selected ? (
        <View style={[styles.profileCard, { borderColor: color }]}>
          <Text style={styles.profileName}>{selected.name}</Text>
          <Text style={[styles.profileRole, { color }]}>{selected.role}</Text>
          <Text style={styles.profileBio}>{selected.bio}</Text>
        </View>
      ) : (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No item selected</Text>
          <Text style={styles.emptyBody}>Go to the Home tab and choose a person to view details here.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// ----------------------
// Settings Screen
// ----------------------
function SettingsScreen() {
  const { color, setColor } = useTheme();
  const [input, setInput] = useState(color);

  const presets = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

  const applyHex = () => {
    const hex = input.trim();
    const valid = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hex);
    if (valid) setColor(hex);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.sectionTitle}>Theme color</Text>
      <View style={styles.rowWrap}>
        {presets.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => { setColor(c); setInput(c); }}
            style={[styles.swatch, { backgroundColor: c, borderColor: c === color ? '#000' : '#ddd', borderWidth: c === color ? 2 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={`Choose color ${c}`}
          />
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Custom hex</Text>
      <View style={styles.hexRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="#3b82f6"
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, { borderColor: color }]}
        />
        <TouchableOpacity onPress={applyHex} style={[styles.applyBtn, { backgroundColor: color }]}>
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={styles.helpText}>This color updates headers, active tab tint, and accents across Home and Profile screens.</Text>
      </View>
    </SafeAreaView>
  );
}

// ----------------------
// Navigation Container & Tabs
// ----------------------
const Tab = createBottomTabNavigator();

function AppTabs() {
  const { color } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: color },
        headerTintColor: '#fff',
        tabBarActiveTintColor: color,
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { height: 56 },
        tabBarIcon: ({ focused, size }) => {
          let icon = 'ellipse';
          if (route.name === 'Home') icon = focused ? 'home' : 'home-outline';
          if (route.name === 'Profile') icon = focused ? 'person' : 'person-outline';
          if (route.name === 'Settings') icon = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={icon} size={size ?? 22} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const { color } = useTheme() || {}; // placeholder during provider wiring
  const navTheme = useNavTheme(color);

  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}

function InnerApp() {
  const { color } = useTheme();
  const navTheme = useNavTheme(color);
  return (
    <NavigationContainer theme={navTheme}>
      <AppTabs />
    </NavigationContainer>
  );
}

function useNavTheme(primaryColor) {
  return useMemo(() => ({
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: primaryColor || DefaultTheme.colors.primary,
      card: '#ffffff',
      text: '#111827', // gray-900
      background: '#f8fafc', // slate-50
      border: '#e5e7eb', // gray-200
    },
  }), [primaryColor]);
}

// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardSubtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  cardBody: { fontSize: 13, color: '#374151', marginTop: 8 },
  ctaRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center' },
  link: { fontSize: 13, fontWeight: '600' },

  profileCard: {
    margin: 16,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileName: { fontSize: 22, fontWeight: '800', color: '#111827' },
  profileRole: { fontSize: 14, fontWeight: '700', marginTop: 6 },
  profileBio: { fontSize: 14, color: '#374151', marginTop: 10, lineHeight: 20 },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  emptyBody: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 8 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginHorizontal: 16, marginTop: 16 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16, marginTop: 12 },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  hexRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#fff',
  },
  applyBtn: { marginLeft: 10, paddingHorizontal: 16, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  applyBtnText: { color: '#fff', fontWeight: '700' },
  helpText: { fontSize: 13, color: '#6b7280', marginHorizontal: 16 },
});
