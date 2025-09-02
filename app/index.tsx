import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { templesData, Temple } from '../data/temples';
import { supabaseClient, getCurrentUser } from '../lib/supabase';

const { width } = Dimensions.get('window');

type Language = 'english' | 'telugu';

export default function HomeScreen() {
  const [language, setLanguage] = useState<Language>('english');
  const [bookmarkedTemples, setBookmarkedTemples] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [remoteTemples, setRemoteTemples] = useState<Temple[]>([]);

  const texts = {
    english: {
      title: 'Temple Sanathan',
      subtitle: 'Discover the sacred temples of Telangana & Andhra Pradesh',
      featuredTemples: 'Featured Temples',
      categories: 'Browse by Category',
      addTemple: 'Add Temple',
      open: 'Open',
      closed: 'Closed',
      home: 'Home',
      search: 'Search',
      map: 'Map',
      bookmarks: 'Saved',
      settings: 'Settings'
    },
    telugu: {
      title: 'Temple Sanathan',
      subtitle: 'తెలంగాణ మరియు ఆంధ్రప్రదేశ్ పవిత్ర ఆలయాలను కనుగొనండి',
      featuredTemples: 'ప్రముఖ ఆలయాలు',
      categories: 'వర్గాల వారీగా చూడండి',
      addTemple: 'ఆలయం జోడించు',
      open: 'తెరిచి ఉంది',
      closed: 'మూసి ఉంది',
      home: 'హోమ్',
      search: 'వెతుకు',
      map: 'మాప్',
      bookmarks: 'సేవ్',
      settings: 'సెట్టింగ్స్'
    }
  };

  const t = texts[language];

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const loadRemoteTemples = async () => {
      if (!supabaseClient) return;
      const { data, error } = await supabaseClient
        .from('temples')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) return;
      
      const mapped: Temple[] = (data || []).map((r: any) => ({
        id: r.id,
        name: r.name || { english: '', telugu: '' },
        deity: r.deity || { english: '', telugu: '' },
        district: r.district || '',
        state: (r.state as 'TS' | 'AP') || 'TS',
        location: {
          latitude: r.coordinates?.lat ?? r.location?.latitude ?? 0,
          longitude: r.coordinates?.lng ?? r.location?.longitude ?? 0,
          address: r.location?.address || { english: '', telugu: '' },
        },
        description: r.description || { english: '', telugu: '' },
        history: { english: '', telugu: '' },
        timings: {
          morning: r.timings?.morning || '',
          evening: r.timings?.evening || '',
          pujaTimings: r.timings?.pujaTimings || [],
        },
        festivals: [],
        images: r.images || (r.image_url ? [r.image_url] : []),
        contact: r.contact_info || {},
        features: r.features || [],
        isOpen: r.is_open ?? true,
        popularity: r.popularity ?? 0,
        templeType: r.temple_type || 'Ancient',
      }));
      setRemoteTemples(mapped);
    };
    loadRemoteTemples();
  }, []);

  const allTemples = React.useMemo(() => {
    const byId = new Map<string, Temple>();
    for (const t of remoteTemples) byId.set(t.id, t);
    for (const t of templesData) if (!byId.has(t.id)) byId.set(t.id, t);
    return Array.from(byId.values());
  }, [remoteTemples]);

  // Get featured temples (daily shuffled selection)
  const dailySeed = new Date().toISOString().slice(0, 10);
  const hashFor = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  const featuredTemples = [...allTemples]
    .sort((a, b) => (hashFor(`${dailySeed}-${a.id}`) - hashFor(`${dailySeed}-${b.id}`)))
    .slice(0, 4);

  const categories = [
    {
      name: { english: 'Ancient Temples', telugu: 'పురాతన ఆలయాలు' },
      type: 'Ancient',
      emoji: '🏛️',
      color: '#FF9933'
    },
    {
      name: { english: 'Hill Temples', telugu: 'కొండ ఆలయాలు' },
      type: 'Hill',
      emoji: '⛰️',
      color: '#800000'
    },
    {
      name: { english: 'River Temples', telugu: 'నది ఆలయాలు' },
      type: 'River',
      emoji: '🌊',
      color: '#FFD700'
    },
    {
      name: { english: 'Modern Temples', telugu: 'ఆధునిక ఆలయాలు' },
      type: 'Modern',
      emoji: '🏢',
      color: '#FF6600'
    }
  ];

  const TempleCard = ({ temple }: { temple: Temple }) => (
    <TouchableOpacity
      style={styles.templeCard}
      onPress={() => router.push(`/temple/${temple.id}`)}
    >
      <Image
        source={{ uri: `https://images.unsplash.com/800x600/?temple,architecture,${temple.name.english}` }}
        style={styles.templeImage}
        defaultSource={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9Ijg4IiBoZWlnaHQ9Ijg4IiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+' }}
      />
      <View style={styles.templeCardContent}>
        <Text style={styles.templeName} numberOfLines={1}>
          {temple.name[language]}
        </Text>
        <Text style={styles.templeDeity} numberOfLines={1}>
          {temple.deity[language]}
        </Text>
        <View style={styles.templeInfo}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color="#666" />
            <Text style={styles.locationText}>
              {temple.district}, {temple.state}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: temple.isOpen ? '#22c55e' : '#6b7280' }]}>
            <Text style={styles.statusText}>
              {temple.isOpen ? t.open : t.closed}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategoryCard = ({ category }: { category: any }) => {
    const categoryTempleCount = allTemples.filter(t => t.templeType === category.type).length;
    return (
      <TouchableOpacity
        style={[styles.categoryCard, { borderLeftColor: category.color }]}
        onPress={() => router.push(`/category/${category.type}`)}
      >
        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
        <View style={styles.categoryContent}>
          <Text style={styles.categoryName}>
            {category.name[language]}
          </Text>
          <Text style={styles.categoryCount}>
            {categoryTempleCount} {language === 'english' ? 'temples' : 'ఆలయాలు'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <Text style={styles.headerSubtitle}>{t.subtitle}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search-outline" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Search temples...</Text>
        </TouchableOpacity>

        {/* Featured Temples */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.featuredTemples}</Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {featuredTemples.map(temple => (
              <TempleCard key={temple.id} temple={temple} />
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.categories}</Text>
          <View style={styles.categoriesGrid}>
            {categories.map(category => (
              <CategoryCard key={category.type} category={category} />
            ))}
          </View>
        </View>

        {/* Add Temple Button */}
        <TouchableOpacity
          style={styles.addTempleButton}
          onPress={() => router.push('/submit')}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addTempleText}>{t.addTemple}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={() => router.push('/')}>
          <Ionicons name="home" size={24} color="#FF9933" />
          <Text style={[styles.navText, styles.activeNavText]}>{t.home}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={24} color="#666" />
          <Text style={styles.navText}>{t.search}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/map')}>
          <Ionicons name="map-outline" size={24} color="#666" />
          <Text style={styles.navText}>{t.map}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/bookmarks')}>
          <Ionicons name="bookmark-outline" size={24} color="#666" />
          <Text style={styles.navText}>{t.bookmarks}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="#666" />
          <Text style={styles.navText}>{t.settings}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 153, 51, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FF9933',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.3)',
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C1810',
  },
  viewAllText: {
    color: '#FF9933',
    fontSize: 14,
    fontWeight: '500',
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  templeCard: {
    width: width * 0.7,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.2)',
  },
  templeImage: {
    width: '100%',
    height: 120,
  },
  templeCardContent: {
    padding: 12,
  },
  templeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  templeDeity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  templeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 48) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.2)',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  addTempleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9933',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  addTempleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 153, 51, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    backgroundColor: 'rgba(255, 153, 51, 0.1)',
    borderRadius: 8,
  },
  navText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  activeNavText: {
    color: '#FF9933',
    fontWeight: '600',
  },
});