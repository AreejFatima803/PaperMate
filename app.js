import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { registerRootComponent } from 'expo';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/styles/theme';

function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AppNavigator />
    </SafeAreaView>
  );
}

export default registerRootComponent(App);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    minHeight: '100vh',
    backgroundColor: theme.colors.background
  }
});
