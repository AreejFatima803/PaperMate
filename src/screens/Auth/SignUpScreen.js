import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../styles/theme';
import { CustomButton } from '../../components/CustomButton';
import { AuthService } from '../../services/storageService';

export const SignUpScreen = ({ onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = async () => {
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg('براہ کرم اپنا نام درج کریں (Please enter your name)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('براہ کرم درست ای میل درج کریں (Please enter a valid email)');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('پاس ورڈ کم از کم 6 ہندسوں کا ہونا چاہیے (Password must be 6+ chars)');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('پاس ورڈ میچ نہیں کر رہے (Passwords do not match)');
      return;
    }

    setLoading(true);
    try {
      await AuthService.signUp(name.trim(), email.trim(), password);
      // As requested: "user phly ay ga wo signin kry ga phr wo khud ba khud login page pr a jay ga"
      Alert.alert(
        'اکاؤنٹ بن گیا (Success)',
        'آپ کا اکاؤنٹ کامیابی سے بن گیا ہے۔ اب براہ کرم لاگ ان کریں۔',
        [
          {
            text: 'Login Now',
            onPress: () => onNavigateToLogin({ email: email.trim(), prefilledPassword: password }),
          },
        ]
      );
      onNavigateToLogin({ email: email.trim(), prefilledPassword: password });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
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
            <Text style={styles.logoIcon}>📝</Text>
          </View>
          <Text style={styles.appName}>PaperMate</Text>
          <Text style={styles.appTagline}>Board Exam Paper Generator (2026)</Text>
          <Text style={styles.pageTitle}>نیا اکاؤنٹ بنائیں (Sign Up)</Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          <Text style={styles.label}>پورا نام (Full Name)</Text>
          <TextInput
            style={styles.input}
            placeholder="مثلاً: Muhammad Ali / Teacher"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

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
            placeholder="کم از کم 6 ہندسے"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>پاس ورڈ کی تصدیق (Confirm Password)</Text>
          <TextInput
            style={styles.input}
            placeholder="دوبارہ پاس ورڈ درج کریں"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <CustomButton
            title="اکاؤنٹ بنائیں (Sign Up)"
            onPress={handleSignUp}
            loading={loading}
            style={styles.submitBtn}
          />

          <View style={styles.loginRedirectRow}>
            <Text style={styles.redirectText}>پہلے سے اکاؤنٹ موجود ہے؟ </Text>
            <TouchableOpacity onPress={() => onNavigateToLogin()}>
              <Text style={styles.loginLink}>لاگ ان کریں (Login)</Text>
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
    fontSize: 32,
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
  loginRedirectRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  redirectText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
