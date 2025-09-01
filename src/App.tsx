import React, { useEffect, useRef, useState } from 'react';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { MapView } from './components/MapView';
import { TempleProfile } from './components/TempleProfile';
import { Bookmarks } from './components/Bookmarks';
import { Settings } from './components/Settings';
import { UserSubmission } from './components/UserSubmission';
import { Auth } from './components/Auth';
import { About } from './components/About';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { CategoryView } from './components/CategoryView';
import { templesData, Temple } from './data/temples';
import { supabaseClient } from './lib/supabase';
import { Button } from './components/ui/button';
import { Home as HomeIcon, Search as SearchIcon, MapPin, Bookmark, Settings as SettingsIcon } from 'lucide-react';
import { getCurrentUser } from './lib/supabase';
import logoImage from 'figma:asset/4a0beeffa82cccff43eb2c512134e22623390cec.png';
import { AdminPage } from './components/AdminPage';
import { getAppVersion } from './version';
import { getLatestAppUpdate, compareVersions } from './lib/updates';
import { UpdatePrompt } from './components/UpdatePrompt';

type Language = 'english' | 'telugu';
type Screen = 'home' | 'search' | 'map' | 'temple' | 'bookmarks' | 'settings' | 'submit' | 'auth' | 'about' | 'privacy' | 'category' | 'admin';

type NavEntry = { screen: Screen; temple?: Temple | null; category?: string | null };

interface AppState {
  currentScreen: Screen;
  selectedTemple: Temple | null;
  language: Language;
  bookmarkedTemples: string[];
  searchQuery: string;
  isOffline: boolean;
  user: any;
  selectedCategory: string | null;
  navHistory: NavEntry[];
}

export default function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'home',
    selectedTemple: null,
    language: 'english',
    bookmarkedTemples: [],
    searchQuery: '',
    isOffline: false,
    user: null,
    selectedCategory: null,
    navHistory: []
  });

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('templeBookmarks');
    if (saved) {
      setState(prev => ({ ...prev, bookmarkedTemples: JSON.parse(saved) }));
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('templeBookmarks', JSON.stringify(state.bookmarkedTemples));
  }, [state.bookmarkedTemples]);

  // Check for authenticated user on app load
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      setState(prev => ({ ...prev, user }));
    };
    checkUser();

    // Listen for auth state changes (only if Supabase is configured)
    let _subscription: { unsubscribe: () => void } | null = null;
    if (supabaseClient) {
      const { data } = supabaseClient.auth.onAuthStateChange((event, session) => {
        setState(prev => ({ ...prev, user: session?.user || null }));
      });
      _subscription = data.subscription;
    }

    return () => {
      _subscription?.unsubscribe();
    };
  }, []);

  // Check online/offline status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setState(prev => ({ ...prev, isOffline: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setState(prev => ({ ...prev, isOffline: !navigator.onLine }));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Scroll container ref to control scroll position
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // App update modal state
  const [updateState, setUpdateState] = useState<{ open: boolean; title: string; description: string; version: string; mandatory: boolean; updateUrl?: string | null } | null>(null);

  // Fetch latest update info on launch
  useEffect(() => {
    const run = async () => {
      const { data } = await getLatestAppUpdate();
      if (!data) return;
      const currentVersion = getAppVersion();
      const isNewer = compareVersions(data.version, currentVersion) > 0;
      const skipped = localStorage.getItem('skippedUpdateVersion');
      const shouldShow = isNewer && (data.mandatory || skipped !== data.version);
      if (shouldShow) {
        setUpdateState({ open: true, title: data.title, description: data.description, version: data.version, mandatory: !!data.mandatory, updateUrl: data.update_url ?? undefined });
      }
    };
    run();
  }, []);

  // Ensure pages load from top on screen change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [state.currentScreen]);


  const navigateTo = (screen: Screen, temple?: Temple, category?: string) => {
    setState(prev => ({
      ...prev,
      navHistory: [...prev.navHistory, { screen: prev.currentScreen, temple: prev.selectedTemple, category: prev.selectedCategory }].slice(-20),
      currentScreen: screen,
      selectedTemple: temple || null,
      selectedCategory: category || null
    }));
  };

  const goBack = () => {
    setState(prev => {
      const hist = [...prev.navHistory];
      const last = hist.pop();
      if (!last) {
        return { ...prev, currentScreen: 'home', selectedTemple: null, selectedCategory: null, navHistory: [] };
      }
      return {
        ...prev,
        currentScreen: last.screen,
        selectedTemple: last.temple || null,
        selectedCategory: last.category || null,
        navHistory: hist,
      };
    });
  };

  const toggleLanguage = () => {
    setState(prev => ({
      ...prev,
      language: prev.language === 'english' ? 'telugu' : 'english'
    }));
  };

  const toggleBookmark = (templeId: string) => {
    setState(prev => ({
      ...prev,
      bookmarkedTemples: prev.bookmarkedTemples.includes(templeId)
        ? prev.bookmarkedTemples.filter(id => id !== templeId)
        : [...prev.bookmarkedTemples, templeId]
    }));
  };

  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  const handleAuthSuccess = (user: any) => {
    setState(prev => ({ ...prev, user, currentScreen: 'home' }));
  };



  const [remoteTemples, setRemoteTemples] = useState<Temple[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!supabaseClient) return;
      const { data, error } = await supabaseClient.from('temples').select('*').order('created_at', { ascending: false });
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
    load();
  }, []);

  const allTemples: Temple[] = React.useMemo(() => {
    // Merge local and remote; remote first to include admin-approved entries
    const byId = new Map<string, Temple>();
    for (const t of remoteTemples) byId.set(t.id, t);
    for (const t of templesData) if (!byId.has(t.id)) byId.set(t.id, t);
    return Array.from(byId.values());
  }, [remoteTemples]);

  // In-app notifications via Supabase Realtime
  const [inbox, setInbox] = useState<{ id: string; title: string; message: string }[]>([]);
  useEffect(() => {
    if (!supabaseClient) return;
    const ch = supabaseClient.channel('notifications');
    ch.on('broadcast', { event: 'new_message' }, (payload: any) => {
      const p = payload?.payload || payload;
      setInbox((prev) => [...prev, { id: crypto.randomUUID(), title: p.title || 'Message', message: p.message || '' }].slice(-5));
    }).subscribe();
    return () => { ch.unsubscribe(); };
  }, []);
  useEffect(() => {
    if (!supabaseClient || !state.user?.email) return;
    const channelName = `user:${String(state.user.email).toLowerCase()}`;
    const ch = supabaseClient.channel(channelName);
    ch.on('broadcast', { event: 'new_message' }, (payload: any) => {
      const p = payload?.payload || payload;
      setInbox((prev) => [...prev, { id: crypto.randomUUID(), title: p.title || 'Message', message: p.message || '' }].slice(-5));
    }).subscribe();
    return () => { ch.unsubscribe(); };
  }, [state.user?.email]);

  const renderScreen = () => {
    const commonProps = {
      language: state.language,
      onNavigate: navigateTo,
      onToggleBookmark: toggleBookmark,
      bookmarkedTemples: state.bookmarkedTemples,
      temples: allTemples,
      isOffline: state.isOffline,
      user: state.user
    };

    switch (state.currentScreen) {
      case 'home':
        return <Home {...commonProps} />;
      case 'search':
        return (
          <Search
            {...commonProps}
            searchQuery={state.searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        );
      case 'map':
        return <MapView {...commonProps} />;
      case 'temple':
        return state.selectedTemple ? (
          <TempleProfile 
            {...commonProps} 
            temple={state.selectedTemple}
          />
        ) : null;
      case 'bookmarks':
        return <Bookmarks {...commonProps} />;
      case 'settings':
        return <Settings {...commonProps} onToggleLanguage={toggleLanguage} />;
      case 'submit':
        return <UserSubmission {...commonProps} />;
      case 'auth':
        return <Auth language={state.language} onNavigate={navigateTo} onAuthSuccess={handleAuthSuccess} />;
      case 'about':
        return <About language={state.language} onNavigate={navigateTo} />;
      case 'privacy':
        return <PrivacyPolicy language={state.language} onNavigate={navigateTo} />;
      case 'category':
        return state.selectedCategory ? (
          <CategoryView
            {...commonProps}
            category={state.selectedCategory}
          />
        ) : null;
      case 'admin':
        return <AdminPage language={state.language} />;
      default:
        return <Home {...commonProps} />;
    }
  };

  const texts = {
    english: {
      home: 'Home',
      search: 'Search',
      map: 'Map',
      bookmarks: 'Saved',
      settings: 'Settings',
      offlineMessage: 'You are offline. Some features may not be available.'
    },
    telugu: {
      home: 'హోమ్',
      search: 'వెతుకు',
      map: 'మాప్',
      bookmarks: 'సేవ్',
      settings: 'సెట్ట���ంగ్స్',
      offlineMessage: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. కొన్ని ఫీచర్లు అందుబాటులో ఉండకపోవచ్చు.'
    }
  };

  const t = texts[state.language];

  // Hide bottom navigation for specific screens
  const hideBottomNav = ['temple', 'auth', 'about', 'privacy', 'category', 'admin'].includes(state.currentScreen);

  return (
    <div className="size-full flex flex-col">
      {/* Offline Banner */}
      {state.isOffline && (
        <div className="bg-yellow-600 text-white text-center py-2 text-sm">
          {t.offlineMessage}
        </div>
      )}

      {/* Name Bar (unpinned) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center justify-center p-4 border-b bg-card/90 backdrop-blur shadow-sm">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Temple Sanathan</h1>
      </div>


      {/* Main Content */}
      <div ref={scrollRef} className="flex-1 overflow-auto pt-[70px] pb-16">
        {renderScreen()}
      </div>

      {/* Update prompt */}
      {updateState?.open && (
        <UpdatePrompt
          open={updateState.open}
          title={updateState.title}
          description={updateState.description}
          version={updateState.version}
          mandatory={updateState.mandatory}
          updateUrl={updateState.updateUrl}
          onUpdate={() => {
            if (updateState.updateUrl) {
              window.location.href = updateState.updateUrl;
            } else {
              window.location.reload();
            }
          }}
          onSkip={() => {
            if (!updateState.mandatory) {
              localStorage.setItem('skippedUpdateVersion', updateState.version);
              setUpdateState(null);
            }
          }}
        />
      )}

      {/* In-app notifications */}
      {inbox.length > 0 && (
        <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-sm">
          {inbox.map(n => (
            <div key={n.id} className="bg-card/95 backdrop-blur border border-primary/20 rounded-lg shadow p-3 animate-in fade-in slide-in-from-right-2">
              <div className="text-sm font-semibold text-foreground">{n.title}</div>
              <div className="text-sm text-muted-foreground">{n.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Navigation - Hide for specific screens */}
      {!hideBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around p-2 border-t bg-card/90 backdrop-blur shadow-sm">
          <Button
            variant={state.currentScreen === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center gap-1 text-xs ${
              state.currentScreen === 'home' 
                ? 'gradient-primary text-white' 
                : 'hover:bg-accent'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            {t.home}
          </Button>
          
          <Button
            variant={state.currentScreen === 'search' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigateTo('search')}
            className={`flex flex-col items-center gap-1 text-xs ${
              state.currentScreen === 'search' 
                ? 'gradient-primary text-white' 
                : 'hover:bg-accent'
            }`}
          >
            <SearchIcon className="w-4 h-4" />
            {t.search}
          </Button>
          
          <Button
            variant={state.currentScreen === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigateTo('map')}
            className={`flex flex-col items-center gap-1 text-xs ${
              state.currentScreen === 'map' 
                ? 'gradient-primary text-white' 
                : 'hover:bg-accent'
            }`}
          >
            <MapPin className="w-4 h-4" />
            {t.map}
          </Button>
          
          <Button
            variant={state.currentScreen === 'bookmarks' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigateTo('bookmarks')}
            className={`flex flex-col items-center gap-1 text-xs ${
              state.currentScreen === 'bookmarks' 
                ? 'gradient-primary text-white' 
                : 'hover:bg-accent'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {t.bookmarks}
          </Button>
          
          <Button
            variant={state.currentScreen === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigateTo('settings')}
            className={`flex flex-col items-center gap-1 text-xs ${
              state.currentScreen === 'settings'
                ? 'gradient-primary text-white'
                : 'hover:bg-accent'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            {t.settings}
          </Button>

        </div>
      )}
    </div>
  );
}
