import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { templesData, Temple } from '../data/temples';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [language] = useState<'english' | 'telugu'>('english');

  const texts = {
    english: {
      title: 'Temple Locations',
      getDirections: 'Get Directions',
      viewDetails: 'View Details',
      open: 'Open',
      closed: 'Closed',
      locationPermission: 'Location permission needed to show nearby temples',
      allowLocation: 'Allow Location',
      locationDenied: 'Location access denied'
    },
    telugu: {
      title: 'ఆలయ స్థానాలు',
      getDirections: 'దిశలు పొందండి',
      viewDetails: 'వివరాలు చూడండి',
      open: 'తెరిచి ఉంది',
      closed: 'మూసి ఉంది',
      locationPermission: 'సమీప ఆలయాలను చూపించడానికి లొకేషన్ అనుమతి అవసరం',
      allowLocation: 'లొకేషన్ అనుమతించు',
      locationDenied: 'లొకేషన్ యాక్సెస్ నిరాకరించబడింది'
    }
  };

  const t = texts[language];

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', t.locationDenied);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const handleGetDirections = (temple: Temple) => {
    const { latitude, longitude } = temple.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    // In React Native, we'd use Linking.openURL(url)
  };

  const initialRegion = userLocation || {
    latitude: 17.385,
    longitude: 78.4867,
    latitudeDelta: 5,
    longitudeDelta: 5,
  };

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

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {templesData.map(temple => (
            <Marker
              key={temple.id}
              coordinate={{
                latitude: temple.location.latitude,
                longitude: temple.location.longitude,
              }}
              title={temple.name[language]}
              description={temple.deity[language]}
              onPress={() => setSelectedTemple(temple)}
            />
          ))}
        </MapView>

        {/* Selected Temple Info */}
        {selectedTemple && (
          <View style={styles.templeInfo}>
            <View style={styles.templeInfoContent}>
              <View style={styles.templeInfoHeader}>
                <Text style={styles.templeInfoName} numberOfLines={1}>
                  {selectedTemple.name[language]}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: selectedTemple.isOpen ? '#22c55e' : '#6b7280' }]}>
                  <Text style={styles.statusText}>
                    {selectedTemple.isOpen ? t.open : t.closed}
                  </Text>
                </View>
              </View>
              <Text style={styles.templeInfoDeity} numberOfLines={1}>
                {selectedTemple.deity[language]}
              </Text>
              <Text style={styles.templeInfoLocation} numberOfLines={1}>
                {selectedTemple.district}, {selectedTemple.state}
              </Text>
              
              <View style={styles.templeInfoActions}>
                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() => handleGetDirections(selectedTemple)}
                >
                  <Ionicons name="navigate" size={16} color="white" />
                  <Text style={styles.directionsText}>{t.getDirections}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => router.push(`/temple/${selectedTemple.id}`)}
                >
                  <Text style={styles.detailsText}>{t.viewDetails}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  templeInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.2)',
  },
  templeInfoContent: {
    gap: 8,
  },
  templeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templeInfoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    flex: 1,
    marginRight: 8,
  },
  templeInfoDeity: {
    fontSize: 12,
    color: '#666',
  },
  templeInfoLocation: {
    fontSize: 12,
    color: '#666',
  },
  templeInfoActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9933',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'center',
  },
  directionsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 51, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsText: {
    color: '#FF9933',
    fontSize: 12,
    fontWeight: '600',
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
});