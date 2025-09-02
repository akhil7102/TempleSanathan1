import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signUp, signIn } from '../lib/supabase';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language] = useState<'english' | 'telugu'>('english');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const texts = {
    english: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signInButton: 'Sign In',
      signUpButton: 'Create Account',
      back: 'Back',
      welcome: 'Welcome to Temple Sanathan',
      signInDesc: 'Sign in to bookmark temples and submit suggestions',
      signUpDesc: 'Create an account to get personalized experience',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signUpLink: 'Sign up here',
      signInLink: 'Sign in here',
      enterEmail: 'Enter your email address',
      enterPassword: 'Enter your password',
      reenterPassword: 'Re-enter your password'
    },
    telugu: {
      signIn: 'సైన్ ఇన్',
      signUp: 'సైన్ అప్',
      email: 'ఇమెయిల్',
      password: 'పాస్‌వర్డ్',
      confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
      signInButton: 'సైన్ ఇన్',
      signUpButton: 'ఖాతా సృష్టించండి',
      back: 'వెనుకకు',
      welcome: 'Temple Sanathan కి స్వాగతం',
      signInDesc: 'ఆలయాలను బుక్‌మార్క్ చేయడానికి మరియు సూచనలు పంపడానికి సైన్ ఇన్ చేయండి',
      signUpDesc: 'వ్యక్తిగత అనుభవం పొందడానికి ఖాతా సృష్టించండి',
      noAccount: 'ఖాతా లేదా?',
      hasAccount: 'ఇప్పటికే ఖాతా ఉందా?',
      signUpLink: 'ఇక్కడ సైన్ అప్ చేయండి',
      signInLink: 'ఇక్కడ సైన్ ఇన్ చేయండి',
      enterEmail: 'మీ ఇమెయిల్ చిరునామా నమోదు చేయండి',
      enterPassword: 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
      reenterPassword: 'మీ పాస్‌వర్డ్ మళ్లీ నమోదు చేయండి'
    }
  };

  const t = texts[language];

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      if (isSignUp) {
        const { data, error } = await signUp(formData.email, formData.password);
        if (error) {
          Alert.alert('Sign Up Failed', error.message);
        } else {
          Alert.alert('Success', 'Account created successfully!');
          setIsSignUp(false);
          setFormData({ email: '', password: '', confirmPassword: '' });
        }
      } else {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) {
          Alert.alert('Sign In Failed', error.message);
        } else {
          Alert.alert('Success', 'Welcome back!');
          router.back();
        }
      }
    } catch (err) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FF9933" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isSignUp ? t.signUp : t.signIn}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo and Welcome */}
        <View style={styles.welcomeSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="business" size={48} color="white" />
          </View>
          <Text style={styles.welcomeTitle}>{t.welcome}</Text>
          <Text style={styles.welcomeDesc}>
            {isSignUp ? t.signUpDesc : t.signInDesc}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.email}</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder={t.enterEmail}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t.password}</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder={t.enterPassword}
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.confirmPassword}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  placeholder={t.reenterPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? '...' : (isSignUp ? t.signUpButton : t.signInButton)}
            </Text>
          </TouchableOpacity>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isSignUp ? t.hasAccount : t.noAccount}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsSignUp(!isSignUp);
                setFormData({ email: '', password: '', confirmPassword: '' });
              }}
            >
              <Text style={styles.switchLink}>
                {isSignUp ? t.signInLink : t.signUpLink}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 153, 51, 0.2)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C1810',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF9933',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.2)',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.3)',
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#2C1810',
  },
  submitButton: {
    backgroundColor: '#FF9933',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  switchLink: {
    fontSize: 14,
    color: '#FF9933',
    fontWeight: '600',
  },
});