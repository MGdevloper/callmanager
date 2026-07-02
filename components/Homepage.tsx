import React, { use, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { ParamListBase, RouteProp } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import RemixIcon from 'react-native-remix-icon';
import type { IconName } from 'react-native-remix-icon/src';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contacts from 'react-native-contacts';
import { initWhisper, initWhisperVad } from 'whisper.rn';
import { RealtimeTranscriber } from 'whisper.rn/realtime-transcription/RealtimeTranscriber.js'
import { RingBufferVad } from 'whisper.rn/realtime-transcription/RingBufferVad.js'
import { AudioPcmStreamAdapter } from 'whisper.rn/realtime-transcription/adapters/AudioPcmStreamAdapter.js'
import RNFS from 'react-native-fs';
import { Image } from 'react-native';

// import RNFS from 'react-native-fs'
const Tab = createBottomTabNavigator();
const tabIcons: Record<string, { active: IconName; inactive: IconName }> = {
  Homepage: { active: 'home-2-fill', inactive: 'home-2-line' },
  Contacts: { active: 'group-line', inactive: 'group-line' },
  Favorites: { active: 'star-fill', inactive: 'star-line' },
};

function renderTabIcon(routeName: string, focused: boolean, color: string) {
  const icon = tabIcons[routeName];

  return (
    <RemixIcon
      name={focused ? icon.active : icon.inactive}
      size={focused ? 28 : 26}
      color={color}
    />
  );
}

function createScreenOptions(bottomInset: number) {
  const bottomPadding =
    Platform.OS === 'android' ? Math.max(bottomInset, 10) : bottomInset;

  return ({
    route,
  }: {
    route: RouteProp<ParamListBase, string>;
  }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarActiveTintColor: '#12bd87',
    tabBarInactiveTintColor: '#a9abb5',
    tabBarLabelStyle: styles.tabLabel,
    tabBarStyle: [
      styles.tabBar,
      {
        height: 62 + bottomPadding,
        paddingBottom: bottomPadding,
      },
    ],
    tabBarItemStyle: styles.tabItem,
    sceneStyle: styles.scene,
    tabBarIcon: ({ focused, color }) =>
      renderTabIcon(route.name, focused, color),
  });
}

function HomeDashboard() {
  const pulseAnim = useRef(new Animated.Value(0.95)).current;
  const [assistantName, setAssistantName] = useState('Aria');
  const [contactCount, setContactCount] = useState(12);
  const [animation, setanimation] = useState(true)
  // const [transcriber, settranscriber] = useState<any>()
  const transcriber = useRef<any>(null)


  async function getLocalModelPath(assetRequire: any, filename: string): Promise<string> {
    const targetPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

    // Check if file is already extracted to avoid rewriting disk blocks
    const exists = await RNFS.exists(targetPath);
    if (exists) return targetPath;

    if (Platform.OS === 'android') {
      // Metro assets on Android are bundled into the res/raw or assets folder
      const asset = Image.resolveAssetSource(assetRequire);
      await RNFS.downloadFile({
        fromUrl: asset.uri,
        toFile: targetPath,
      }).promise;
    } else {
      // iOS links directly from the local bundle package
      const asset = Image.resolveAssetSource(assetRequire);
      await RNFS.copyFile(asset.uri, targetPath);
    }

    return targetPath;
  }


  async function initializeWhisper() {
    try {
      console.log("Resolving asset file paths...");

      // Extract local paths from Metro asset bundles
      const whisperPath = await getLocalModelPath(
        require("../assets/ggml-tiny.en.bin"),
        "ggml-tiny.en.bin"
      );
      const vadPath = await getLocalModelPath(
        require("../assets/ggml-silero-v5.1.2.bin"),
        "ggml-silero-v5.1.2.bin"
      );

      console.log("Initializing Whisper Context...");
      const whisperContext = await initWhisper({ filePath: whisperPath });

      console.log("Initializing VAD Context...");
      const whisperVadContext = await initWhisperVad({
        filePath: vadPath,
        useGpu: false,
        nThreads: 4,
      });

      const vadContext = new RingBufferVad(whisperVadContext, {
        vadPreset: 'default',
        sampleRate: 16000,
        speechRateThreshold: 0.2
      });

      const audioStream = new AudioPcmStreamAdapter();

      transcriber.current = new RealtimeTranscriber(
        { whisperContext, vadContext, audioStream },
        {
          audioSliceSec: 30,
          transcribeOptions: { language: 'en' },
        },
        {
          onTranscribe: (event) => console.log('Transcription:', event.data?.result),
          onVad: (event) => console.log('VAD:', event.type, event.confidence),
          onStatusChange: (isActive) => console.log('Status Change:', isActive),
          onError: (error) => console.error('Transcriber Error:', error),
        },
      );

      console.log("Transcriber is ready ✅");
    } catch (error) {
      console.error("Failed to initialize Whisper Engine:", error);
    }
  }



  useEffect(() => {
    (async () => {

      // await initializeWhisper()
      console.log("runnig....");
      await initializeWhisper()
      await transcriber.current.start()

      // transcriber.current?.start()

    })()


  }, [])
  useEffect(() => {
    animation ? Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.92,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start() :
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).stop()





  }, [pulseAnim, animation]);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const savedAssistant = await AsyncStorage.getItem('Assistant');

        if (savedAssistant) {
          setAssistantName(savedAssistant);
        }


        const phoneContacts = await Contacts.getAll();
        setContactCount(phoneContacts.length);
      } catch {
        setContactCount(12);
      }
    }

    loadHomeData();
  }, []);

  async function handlemicClick() {
    if (!transcriber.current) {
      console.warn("Transcriber not initialized yet.");
      return;
    }

    setanimation((p) => !p);

    // Use the library's internal status hook rather than tracking native boolean states manually
    transcriber.current.isActive ? await transcriber.current.stop() : await transcriber.current.start()
    console.log(transcriber.current.isActive);


  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.topGlow} />
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>Hello, I'm</Text>
            <Text style={styles.title}>{assistantName}.</Text>
          </View>

          <View style={styles.readyPill}>
            <View style={styles.readyDot} />
            <Text style={styles.readyText}>Ready</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <RemixIcon color="#13bd88" name="lightbulb-flash-line" size={20} />
          <Text style={styles.tipText}>
            Tap the mic and say{' '}
            <Text style={styles.tipStrong}>
              "{assistantName} call Mom"
            </Text>
          </Text>
        </View>

        <View style={styles.micSection}>
          <Animated.View
            style={[
              styles.outerMicRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.middleMicRing}>
              <TouchableOpacity onPress={handlemicClick} activeOpacity={0.85} style={styles.micButton}>
                <RemixIcon color="#061711" name="mic-line" size={42} />
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Text style={styles.tapLabel}>TAP TO {animation ? "STOP" : "START"}</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{contactCount}</Text>
            <Text style={styles.statLabel}>Contacts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.brandText]}>
              {assistantName}
            </Text>
            <Text style={styles.statLabel}>Assistant</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Online</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function EmptyTabScreen({ title, icon }: { title: string; icon: IconName }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={[styles.screen, styles.emptyScreen]}>
        <View style={styles.emptyIcon}>
          <RemixIcon color="#12bd87" name={icon} size={28} />
        </View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

function ContactsScreen() {
  return <EmptyTabScreen icon="group-line" title="Contacts" />;
}

function FavoritesScreen() {
  return <EmptyTabScreen icon="star-line" title="Favorites" />;
}

export default function Homepage() {
  const insets = useSafeAreaInsets();


  const screenOptions = useMemo(
    () => createScreenOptions(insets.bottom),
    [insets.bottom],
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Homepage" component={HomeDashboard} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: '#06120e',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#06120e',
  },
  screen: {
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#06120e',
  },
  topGlow: {
    position: 'absolute',
    top: -150,
    right: -130,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(18, 189, 135, 0.09)',
  },
  header: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: {
    color: '#9f9dab',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 6,
  },
  title: {
    color: '#f6f7fb',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 43,
  },
  readyPill: {
    height: 38,
    minWidth: 96,
    borderRadius: 19,
    marginTop: 6,
    paddingHorizontal: 16,
    backgroundColor: '#075f4a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#18c99a',
  },
  readyText: {
    color: '#21c99b',
    fontSize: 15,
    fontWeight: '800',
  },
  tipCard: {
    zIndex: 1,
    minHeight: 58,
    borderRadius: 29,
    marginTop: 28,
    paddingHorizontal: 18,
    backgroundColor: '#171518',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    color: '#ededf3',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    marginLeft: 12,
  },
  tipStrong: {
    color: '#ffffff',
    fontWeight: '800',
  },
  micSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 14,
  },
  outerMicRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(18, 189, 135, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleMicRing: {
    width: 174,
    height: 174,
    borderRadius: 87,
    borderWidth: 1,
    borderColor: 'rgba(28, 216, 158, 0.34)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: '#17c18d',
    shadowColor: '#16c58d',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapLabel: {
    color: '#b4b0bb',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 4,
    marginTop: 20,
  },
  statsCard: {
    minHeight: 88,
    borderRadius: 24,
    marginBottom: 12,
    backgroundColor: '#171518',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '800',
  },
  brandText: {
    color: '#17c18d',
  },
  statLabel: {
    color: '#a8a5b1',
    fontSize: 14,
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabBar: {
    paddingTop: 6,
    backgroundColor: '#0b0c10',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 0,
  },
  emptyScreen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(18, 189, 135, 0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  emptySubtitle: {
    color: '#a8a5b1',
    fontSize: 15,
    marginTop: 8,
  },
});
