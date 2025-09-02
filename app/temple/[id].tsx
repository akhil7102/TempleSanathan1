import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { templesData, Temple } from '../../data/temples';

const { width } = Dimensions.get('window');

export default function TempleScreen() {
  const { id } = useLocalSearchParams();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [language] = useState<'english' | 'telugu'>('english');

  useEffect(() => {
    const foundTemple = templesData.find(t => t.id === id);
    setTemple(foundTemple || null);
  }, [id]);

  const texts = {
    english: {
      back: 'Back',
      getDirections: 'Get Directions',
      overview: 'Overview',
      timings: 'Timings',
      festivals: 'Festivals',
      contact: 'Contact',
      description: 'Description',
      history: 'History',
      features: 'Features',
      visitingHours: 'Visiting Hours',
      morning: 'Morning',
      evening: 'Evening',
      pujaTimings: 'Puja Timings',
      upcomingFestivals: 'Upcoming Festivals',
      contactInfo: 'Contact Information',
      phone: 'Phone',
      website: 'Website',
      email: 'Email',
      address: 'Address',
      open: 'Open',
      closed: 'Closed'
    },
    telugu: {
      back: 'వెనుకకు',
      getDirections: 'దిశలు పొందండి',
      overview: 'వివరణ',
      timings: 'సమయాలు',
      festivals: 'పండుగలు',
      contact: 'సంప్రదింపు',
      description: 'వివరణ',
      history: 'చరిత్ర',
      features: 'సౌకర్యాలు',
      visitingHours: 'దర్శన సమయాలు',
      morning: 'ఉదయం',
      evening: 'సాయంత్రం',
      pujaTimings: 'పూజ సమయాలు',
      upcomingFestivals: 'రాబోయే పండుగలు',
      contactInfo: 'సంప్రదింపు సమాచారం',
      phone: 'ఫోన్',
      website: 'వెబ్‌సైట్',
      email: 'ఇమెయిల్',
      address: 'చిరునామా',
      open: 'తెరిచి ఉంది',
      closed: 'మూసి ఉంది'
    }
  };

  const t = texts[language];

  if (!temple) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Temple not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleGetDirections = () => {
    const { latitude, longitude } = temple.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  const TabButton = ({ tabKey, title, isActive }: { tabKey: string; title: string; isActive: boolean }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t.description}</Text>
              <Text style={styles.cardText}>
                {temple.description[language]}
              </Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t.history}</Text>
              <Text style={styles.cardText}>
                {temple.history[language]}
              </Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t.features}</Text>
              <View style={styles.featuresContainer}>
                {temple.features.map((feature, index) => (
                  <View key={index} style={styles.featureBadge}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );
      
      case 'timings':
        return (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t.visitingHours}</Text>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>{t.morning}</Text>
                <Text style={styles.timingValue}>{temple.timings.morning}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>{t.evening}</Text>
                <Text style={styles.timingValue}>{temple.timings.evening}</Text>
              </View>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t.pujaTimings}</Text>
              <View style={styles.pujaTimingsGrid}>
                {temple.timings.pujaTimings.map((time, index) => (
                  <View key={index} style={styles.pujaTimingBadge}>
                    <Text style={styles.pujaTimingText}>{time}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );
      
      case 'festivals':
        return (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t.upcomingFestivals}</Text>
              {temple.festivals.map((festival, index) => (
                <View key={index} style={styles.festivalItem}>
                  <View style={styles.festivalDate}>
                    <Text style={styles.festivalMonth}>
                      {new Date(festival.date).toLocaleDateString('en-US', { month: 'short' })}
                    </Text>
                    <Text style={styles.festivalDay}>
                      {new Date(festival.date).getDate()}
                    </Text>
                  </View>
                  <View style={styles.festivalContent}>
                    <Text style={styles.festivalName}>
                      {festival.name[language]}
                    </Text>
                    <Text style={styles.festivalDesc}>
                      {festival.description[language]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      
      case 'contact':
        return (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t.contactInfo}</Text>
              
              {temple.contact.phone && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => Linking.openURL(`tel:${temple.contact.phone}`)}
                >
                  <Ionicons name="call-outline" size={20} color="#FF9933" />
                  <Text style={styles.contactText}>{temple.contact.phone}</Text>
                </TouchableOpacity>
              )}
              
              {temple.contact.website && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => Linking.openURL(temple.contact.website!)}
                >
                  <Ionicons name="globe-outline" size={20} color="#FF9933" />
                  <Text style={styles.contactText}>{temple.contact.website}</Text>
                </TouchableOpacity>
              )}
              
              {temple.contact.email && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => Linking.openURL(`mailto:${temple.contact.email}`)}
                >
                  <Ionicons name="mail-outline" size={20} color="#FF9933" />
                  <Text style={styles.contactText}>{temple.contact.email}</Text>
                </TouchableOpacity>
              )}
              
              <View style={styles.addressContainer}>
                <Ionicons name="location-outline" size={20} color="#FF9933" />
                <Text style={styles.addressText}>
                  {temple.location.address[language]}
                </Text>
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FF9933" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {temple.name[language]}
        </Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#FF9933" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: `https://images.unsplash.com/1200x600/?temple,${temple.templeType},architecture` }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <View style={styles.heroBadges}>
                <View style={[styles.statusBadge, { backgroundColor: temple.isOpen ? '#22c55e' : '#6b7280' }]}>
                  <Text style={styles.statusText}>
                    {temple.isOpen ? t.open : t.closed}
                  </Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{temple.templeType}</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>{temple.name[language]}</Text>
              <Text style={styles.heroSubtitle}>{temple.deity[language]}</Text>
            </View>
          </View>
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {temple.location.address[language]}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {temple.timings.morning} • {temple.timings.evening}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
            <Ionicons name="navigate" size={20} color="white" />
            <Text style={styles.directionsText}>{t.getDirections}</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            <TabButton tabKey="overview" title={t.overview} isActive={activeTab === 'overview'} />
            <TabButton tabKey="timings" title={t.timings} isActive={activeTab === 'timings'} />
            <TabButton tabKey="festivals" title={t.festivals} isActive={activeTab === 'festivals'} />
            <TabButton tabKey="contact" title={t.contact} isActive={activeTab === 'contact'} />
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  shareButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    height: 200,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    padding: 16,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    color: '#2C1810',
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quickInfo: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 153, 51, 0.2)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9933',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  directionsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 153, 51, 0.2)',
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#FF9933',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF9933',
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.2)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureBadge: {
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#FF9933',
    fontWeight: '500',
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  timingLabel: {
    fontSize: 14,
    color: '#2C1810',
  },
  timingValue: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 153, 51, 0.2)',
    marginVertical: 4,
  },
  pujaTimingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pujaTimingBadge: {
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: (width - 80) / 3,
    alignItems: 'center',
  },
  pujaTimingText: {
    fontSize: 12,
    color: '#FF9933',
    fontWeight: '500',
  },
  festivalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  festivalDate: {
    backgroundColor: '#FF9933',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    minWidth: 50,
    marginRight: 12,
  },
  festivalMonth: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  festivalDay: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
  },
  festivalContent: {
    flex: 1,
  },
  festivalName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  festivalDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 153, 51, 0.1)',
  },
  contactText: {
    fontSize: 14,
    color: '#2C1810',
    marginLeft: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#FF9933',
    fontWeight: '600',
  },
});