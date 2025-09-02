import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [language, setLanguage] = useState<'english' | 'telugu'>('english');
  const [notifications, setNotifications] = useState(true);

  const texts = {
    english: {
      title: 'Settings',
      language: 'Language',
      languageDesc: 'Change app language',
      currentLang: 'English',
      notifications: 'Notifications',
      notificationsDesc: 'Get notified about festivals and events',
      about: 'About Temple Sanathan',
      aboutDesc: 'Learn more about this app',
      privacy: 'Privacy Policy',
      privacyDesc: 'How we protect your data',
      contact: 'Contact Us',
      contactDesc: 'Get in touch with our team',
      share: 'Share App',
      shareDesc: 'Tell others about Temple Sanathan',
      addTemple: 'Suggest Temple',
      addTempleDesc: 'Help us expand our temple database',
      version: 'Version 1.0.0',
      madeWith: 'Made with devotion for temple seekers',
      account: 'Account',
      signIn: 'Sign In',
      signInDesc: 'Sign in to bookmark temples and sync data',
      general: 'General',
      support: 'Support',
      contribute: 'Contribute'
    },
    telugu: {
      title: 'సెట్టింగ్స్',
      language: 'భాష',
      languageDesc: 'యాప్ భాషను మార్చండి',
      currentLang: 'తెలుగు',
      notifications: 'నోటిఫికేషన్లు',
      notificationsDesc: 'పండుగలు మరియు ఈవెంట్ల గురించి తెలియజేయండి',
      about: 'Temple Sanathan గురించి',
      aboutDesc: 'ఈ యాప్ గురించి మరింత తెలుసుకోండి',
      privacy: 'గోప్యతా విధానం',
      privacyDesc: 'మేము మీ డేటాను ఎలా రక్షిస్తాము',
      contact: 'మమ్మల్ని సంప్రదించండి',
      contactDesc: 'మా టీమ్‌తో సంప్రదించండి',
      share: 'యాప్‌ను షేర్ చేయండి',
      shareDesc: 'Temple Sanathan గురించి ఇతరులకు చెప్పండి',
      addTemple: 'ఆలయం సూచించండి',
      addTempleDesc: 'మా ఆలయ డేటాబేస్‌ను విస్తరించడంలో సహాయపడండి',
      version: 'వెర్షన్ 1.0.0',
      madeWith: 'ఆలయ అన్వేషకుల కోసం భక్తితో తయారు చేయబడింది',
      account: 'ఖాతా',
      signIn: 'సైన్ ఇన్',
      signInDesc: 'ఆలయాలను బుక్‌మార్క్ చేయడానికి మరియు డేటాను సింక్ చేయడానికి సైన్ ఇన్ చేయండి',
      general: 'సాధారణ',
      support: 'సపోర్ట్',
      contribute: 'సహకరించండి'
    }
  };

  const t = texts[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'telugu' : 'english');
  };

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    onPress, 
    showToggle = false,
    toggleValue = false,
    onToggle,
    accent = false
  }: {
    icon: string;
    title: string;
    description: string;
    onPress?: () => void;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    accent?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, accent && styles.accentItem]} 
      onPress={onPress}
      disabled={showToggle}
    >
      <View style={[styles.settingIcon, accent && styles.accentIcon]}>
        <Ionicons name={icon as any} size={20} color={accent ? 'white' : '#FF9933'} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      {showToggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#ccc', true: '#FF9933' }}
          thumbColor="white"
        />
      )}
      {!showToggle && (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FF9933" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Header */}
        <View style={styles.appHeader}>
          <View style={styles.appIcon}>
            <Ionicons name="business" size={32} color="white" />
          </View>
          <Text style={styles.appTitle}>Temple Sanathan</Text>
          <Text style={styles.appSubtitle}>{t.madeWith}</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <SectionHeader title={t.account} />
          <View style={styles.settingsGroup}>
            <SettingItem
              icon="log-in-outline"
              title={t.signIn}
              description={t.signInDesc}
              onPress={() => router.push('/auth')}
              accent={true}
            />
          </View>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <SectionHeader title={t.general} />
          <View style={styles.settingsGroup}>
            <SettingItem
              icon="globe-outline"
              title={t.language}
              description={`${t.languageDesc} (${language === 'english' ? t.currentLang : t.currentLang})`}
              onPress={toggleLanguage}
            />
            
            <SettingItem
              icon="notifications-outline"
              title={t.notifications}
              description={t.notificationsDesc}
              showToggle={true}
              toggleValue={notifications}
              onToggle={setNotifications}
            />
          </View>
        </View>

        {/* Contribute */}
        <View style={styles.section}>
          <SectionHeader title={t.contribute} />
          <View style={styles.settingsGroup}>
            <SettingItem
              icon="add-circle-outline"
              title={t.addTemple}
              description={t.addTempleDesc}
              onPress={() => router.push('/submit')}
              accent={true}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <SectionHeader title={t.support} />
          <View style={styles.settingsGroup}>
            <SettingItem
              icon="information-circle-outline"
              title={t.about}
              description={t.aboutDesc}
              onPress={() => router.push('/about')}
            />
            
            <SettingItem
              icon="mail-outline"
              title={t.contact}
              description={t.contactDesc}
              onPress={() => {}}
            />
            
            <SettingItem
              icon="share-outline"
              title={t.share}
              description={t.shareDesc}
              onPress={() => {}}
            />
            
            <SettingItem
              icon="shield-outline"
              title={t.privacy}
              description={t.privacyDesc}
              onPress={() => router.push('/privacy')}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>{t.version}</Text>
          <View style={styles.madeWithRow}>
            <Ionicons name="heart" size={12} color="#e74c3c" />
            <Text style={styles.madeWithText}>{t.madeWith}</Text>
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
  appHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF9933',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.2)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 153, 51, 0.1)',
  },
  accentItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accentIcon: {
    backgroundColor: '#FF9933',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  madeWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  madeWithText: {
    fontSize: 12,
    color: '#666',
  },
});