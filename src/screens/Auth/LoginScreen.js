import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../styles/theme';
import { CustomButton } from '../../components/CustomButton';
import { AuthService } from '../../services/storageService';

export const LoginScreen = ({ initialEmail = '', initialPassword = '', onLoginSuccess, onNavigateToSignUp }) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState(
    initialEmail ? 'اکاؤنٹ بن گیا ہے! اب لاگ ان کریں (Account created! Please login)' : ''
  );

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialPassword) setPassword(initialPassword);
  }, [initialEmail, initialPassword]);

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('براہ کرم ای میل درج کریں (Please enter email)');
      return;
    }
    if (!password) {
      setErrorMsg('براہ کرم پاس ورڈ درج کریں (Please enter password)');
      return;
    }

    setLoading(true);
    try {
      const user = await AuthService.login(email.trim(), password);
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🔐</Text>
          </View>
          <Text style={styles.appName}>PaperMate</Text>
          <Text style={styles.appTagline}>Board Exam Paper Generator (2026)</Text>
          <Text style={styles.pageTitle}>لاگ ان کریں (Sign In)</Text>
        </View>

        {infoMsg ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>✓ {infoMsg}</Text>
          </View>
        ) : null}

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          <Text style={styles.label}>ای میل (Email Address)</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>پاس ورڈ (Password)</Text>
          <TextInput
            style={styles.input}
            placeholder="اپنا پاس ورڈ درج کریں"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <CustomButton
            title="لاگ ان کریں (Login to PaperMate)"
            onPress={handleLogin}
            loading={loading}
            style={styles.submitBtn}
          />

          <View style={styles.signupRedirectRow}>
            <Text style={styles.redirectText}>نیا اکاؤنٹ بنانا ہے؟ </Text>
            <TouchableOpacity onPress={onNavigateToSignUp}>
              <Text style={styles.signupLink}>سائن اپ کریں (Sign Up)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoIcon: {
    fontSize: 30,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 14,
  },
  infoBox: {
    backgroundColor: '#DEF7EC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#31C48D',
  },
  infoText: {
    color: '#03543F',
    fontSize: 13,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#FDE8E8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F98080',
  },
  errorText: {
    color: '#9B1C1C',
    fontSize: 13,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: theme.colors.textPrimary,
    backgroundColor: '#F9FAFB',
  },
  submitBtn: {
    marginTop: 22,
  },
  signupRedirectRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  redirectText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
