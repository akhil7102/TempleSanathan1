import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { templesData, Temple } from '../data/temples';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [language] = useState<'english' | 'telugu'>('english');

  const texts = {
    english: {
      title: 'Search Temples',
      searchPlaceholder: 'Search temples, deities, locations...',
      resultsFound: 'temples found',
      noResults: 'No temples found',
      noResultsDesc: 'Try refining your search terms',
      open: 'Open',
      closed: 'Closed'
    },
    telugu: {
      title: 'ఆలయాలను వెతకండి',
      searchPlaceholder: 'ఆలయాలు, దేవతలు, ప్రాంతాలను వెతకండి...',
      resultsFound: 'ఆలయాలు దొరికాయి',
      noResults: 'ఆలయాలు దొరకలేదు',
      noResultsDesc: 'మీ వెతుకులాట పదాలను మెరుగుపరచండి',
      open: 'తెరిచి ఉంది',
      closed: 'మూసి ఉంది'
    }
  };

  const t = texts[language];

  const filteredTemples = useMemo(() => {
    if (!searchQuery) return templesData;
    
    const query = searchQuery.toLowerCase();
    return templesData.filter(temple => {
      const matchesName = temple.name[language].toLowerCase().includes(query);
      const matchesDeity = temple.deity[language].toLowerCase().includes(query);
      const matchesDistrict = temple.district.toLowerCase().includes(query);
      const matchesState = temple.state.toLowerCase().includes(query);
      
      return matchesName || matchesDeity || matchesDistrict || matchesState;
    });
  }, [searchQuery, language]);

  const TempleCard = ({ temple }: { temple: Temple }) => (
    <TouchableOpacity
      style={styles.templeCard}
      onPress={() => router.push(`/temple/${temple.id}`)}
    >
      <Image
        source={{ uri: `https://images.unsplash.com/400x400/?temple,${temple.templeType},${temple.name.english}` }}
        style={styles.templeImage}
      />
      <View style={styles.templeContent}>
        <View style={styles.templeHeader}>
          <Text style={styles.templeName} numberOfLines={1}>
            {temple.name[language]}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: temple.isOpen ? '#22c55e' : '#6b7280' }]}>
            <Text style={styles.statusText}>
              {temple.isOpen ? t.open : t.closed}
            </Text>
          </View>
        </View>
        <Text style={styles.templeDeity} numberOfLines={1}>
          {temple.deity[language]}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color="#666" />
          <Text style={styles.locationText}>
            {temple.district}, {temple.state}
          </Text>
        </View>
        <View style={styles.timingRow}>
          <Ionicons name="time-outline" size={12} color="#666" />
          <Text style={styles.timingText}>
            {temple.timings.morning}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredTemples.length} {t.resultsFound}
        </Text>
      </View>

      <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
        {filteredTemples.length > 0 ? (
          filteredTemples.map(temple => (
            <TempleCard key={temple.id} temple={temple} />
          ))
        ) : (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.noResultsTitle}>{t.noResults}</Text>
            <Text style={styles.noResultsDesc}>{t.noResultsDesc}</Text>
          </View>
        )}
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.3)',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#2C1810',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  results: {
    flex: 1,
    paddingHorizontal: 16,
  },
  templeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.2)',
  },
  templeImage: {
    width: 80,
    height: 80,
  },
  templeContent: {
    flex: 1,
    padding: 12,
  },
  templeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  templeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    flex: 1,
    marginRight: 8,
  },
  templeDeity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C1810',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});