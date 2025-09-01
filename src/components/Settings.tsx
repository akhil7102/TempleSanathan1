import React from 'react';
import { Temple } from '../data/temples';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  Globe, 
  Info, 
  Shield, 
  Mail, 
  Share, 
  Bell,
  Plus,
  Heart,
  LogIn,
  LogOut,
  User,
  Star
} from 'lucide-react';
import { signOut } from '../lib/supabase';
import logoImage from 'figma:asset/4a0beeffa82cccff43eb2c512134e22623390cec.png';

interface SettingsProps {
  language: 'english' | 'telugu';
  onNavigate: (screen: any, temple?: Temple) => void;
  onToggleLanguage: () => void;
  temples: Temple[];
  bookmarkedTemples: string[];
  onToggleBookmark: (templeId: string) => void;
  isOffline: boolean;
  user: any;
}

export function Settings({ 
  language, 
  onNavigate, 
  onToggleLanguage,
  user 
}: SettingsProps) {
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
      support: 'Support',
      general: 'General',
      feedback: 'Feedback',
      legal: 'Legal & Privacy',
      contribute: 'Contribute',
      account: 'Account',
      signIn: 'Sign In',
      signInDesc: 'Sign in to bookmark temples and sync data',
      signOut: 'Sign Out',
      signOutDesc: 'Sign out of your account',
      profile: 'Profile',
      profileDesc: 'Manage your account settings',
      signedInAs: 'Signed in as',
      rateApp: 'Rate App',
      rateAppDesc: 'Rate Temple Sanathan on the App Store'
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
      support: 'సపోర్ట్',
      general: 'సాధారణ',
      feedback: 'ఫీడ్‌బ్యాక్',
      legal: 'చట్టపరమైన మరియు గోప్యత',
      contribute: 'సహకరించండి',
      account: 'ఖాతా',
      signIn: 'సైన్ ఇన్',
      signInDesc: 'ఆలయాలను బుక్‌మార్క్ చేయడానికి మరియు డేటాను సింక్ చేయడానికి సైన్ ఇన్ చేయండి',
      signOut: 'సైన్ అవుట్',
      signOutDesc: 'మీ ఖాతా నుండి సైన్ అవుట్ చేయండి',
      profile: 'ప్రొఫైల్',
      profileDesc: 'మీ ఖాతా సెట్టింగ్‌లను నిర్వహించండి',
      signedInAs: 'వలె సైన్ ఇన్ చేయబడింది',
      rateApp: 'యాప్‌ను రేట్ చేయండి',
      rateAppDesc: 'యాప్ స్టోర్‌లో Temple Sanathan రేట్ చేయండి'
    }
  };

  const t = texts[language];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Temple Sanathan',
          text: 'Discover the sacred temples of Telangana & Andhra Pradesh',
          url: window.location.origin,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const handleContact = () => {
    window.open('mailto:rudracore@gmail.com', '_self');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      // User will be signed out and auth state will update automatically
    }
  };

  const handleRateApp = () => {
    // For web version, we'll open a generic app store review page
    // In a real app, this would open the actual app store
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isAndroid) {
      window.open('https://play.google.com/store/apps', '_blank');
    } else if (isIOS) {
      window.open('https://apps.apple.com/', '_blank');
    } else {
      // For desktop, just show an alert
      alert('Thank you for your interest! Please rate us when the mobile app is available.');
    }
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    description, 
    action, 
    showToggle = false,
    toggleValue = false,
    onToggle,
    accent = false
  }: {
    icon: any;
    title: string;
    description: string;
    action?: () => void;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: () => void;
    accent?: boolean;
  }) => (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${ 
        accent ? 'gradient-accent border border-primary/20' : 'hover:bg-accent'
      }`} 
      onClick={action}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        accent ? 'gradient-primary' : 'bg-accent'
      }`}>
        <Icon className={`w-5 h-5 ${accent ? 'text-white' : 'text-primary'}`} />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {showToggle && (
        <Switch checked={toggleValue} onCheckedChange={onToggle} />
      )}
    </div>
  );

  return (
    <div className="p-4 space-y-6 pb-20" style={{ scrollBehavior: 'smooth' }}>
      {/* Header with Logo */}
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden gradient-primary p-2">
          <img 
            src={logoImage} 
            alt="Temple Sanathan" 
            className="w-full h-full object-contain mix-blend-screen"
          />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Temple Sanathan</h2>
        <p className="text-sm text-muted-foreground">{t.madeWith}</p>
      </div>

      {/* Account Section */}
      <Card className="bg-card/80 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="text-base text-foreground">{t.account}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {user ? (
            <>
              <div className="p-3 rounded-lg bg-gradient-accent border border-primary/20 mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{t.signedInAs}</span>
                </div>
                <p className="text-sm font-medium mt-1">{user.email}</p>
              </div>
              <SettingItem
                icon={LogOut}
                title={t.signOut}
                description={t.signOutDesc}
                action={handleSignOut}
              />
            </>
          ) : (
            <SettingItem
              icon={LogIn}
              title={t.signIn}
              description={t.signInDesc}
              action={() => onNavigate('auth')}
              accent={true}
            />
          )}
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card className="bg-card/80 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="text-base text-foreground">{t.general}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <SettingItem
            icon={Globe}
            title={t.language}
            description={`${t.languageDesc} (${language === 'english' ? t.currentLang : t.currentLang})`}
            action={onToggleLanguage}
          />
          
          <SettingItem
            icon={Bell}
            title={t.notifications}
            description={t.notificationsDesc}
            showToggle={true}
            toggleValue={true}
            onToggle={() => {}}
          />
        </CardContent>
      </Card>

      {/* Contribute */}
      <Card className="bg-card/80 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="text-base text-foreground">{t.contribute}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <SettingItem
            icon={Plus}
            title={t.addTemple}
            description={t.addTempleDesc}
            action={() => onNavigate('submit')}
            accent={true}
          />
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="bg-card/80 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="text-base text-foreground">{t.support}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <SettingItem
            icon={Info}
            title={t.about}
            description={t.aboutDesc}
            action={() => onNavigate('about')}
          />
          
          <SettingItem
            icon={Mail}
            title={t.contact}
            description={t.contactDesc}
            action={handleContact}
          />
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card className="bg-card/80 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="text-base text-foreground">{t.feedback}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <SettingItem
            icon={Share}
            title={t.share}
            description={t.shareDesc}
            action={handleShare}
          />
          
          <SettingItem
            icon={Star}
            title={t.rateApp}
            description={t.rateAppDesc}
            action={handleRateApp}
            accent={true}
          />
        </CardContent>
      </Card>

      {/* Legal & Privacy */}
      <Card className="bg-card/80 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="text-base text-foreground">{t.legal}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <SettingItem
            icon={Shield}
            title={t.privacy}
            description={t.privacyDesc}
            action={() => onNavigate('privacy')}
          />
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center space-y-2 pt-4">
        <p className="text-xs text-muted-foreground">{t.version}</p>
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Heart className="w-3 h-3 text-red-500" />
          <span>{t.madeWith}</span>
        </div>
      </div>
    </div>
  );
}