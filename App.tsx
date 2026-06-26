import React, { useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import { toastConfig } from "./components/CustomeToast.js"

import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import RemixIcon from 'react-native-remix-icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
function App() {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const [assistant, setAssistant] = useState('');

  useEffect(() => {
    console.log('====================================');
    console.log(assistant);
    console.log('====================================');
  }, [assistant])
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 1000,

          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scaleAnim]);

  async function HandleContinue() {
    console.log("clicked");

    Toast.show({
      type: "success",
      text1: "Assistant Saved",
      text2: "you can any time change it from home page"
    })
    // try{
    //  await AsyncStorage.setItem("assistant",assistant)
    // }
    // catch(e){

    // }
  }

  return (
    <SafeAreaProvider>

      <View style={styles.root}>
        <Video
          source={require('./assets/background/silk.mp4')}
          style={styles.backgroundVideo}
          resizeMode="cover"
          repeat
          muted
          paused={false}
        />

        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.statusRow}>
                <Animated.View
                  style={[
                    styles.pulseRing,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <View style={styles.pulseDot} />
                </Animated.View>

                <Text style={styles.statusText}>
                  Contacts-Command Assistant
                </Text>
              </View>

              <View style={styles.content}>
                <View style={styles.copyBlock}>
                  <Text style={styles.title}>Name your</Text>
                  <Text style={styles.title}>assistant.</Text>

                  <Text style={styles.subtitle}>
                    Choose a wake word. Say it followed by a command like
                    "call Mom".
                  </Text>
                </View>

                <View style={styles.formBlock}>
                  <View style={styles.inputWrap}>
                    <View style={styles.inputIcon}>
                      <RemixIcon
                        color="#0cba82"
                        name="sparkling-2-line"
                        size={24}
                      />
                    </View>

                    <TextInput
                      maxLength={12}
                      value={assistant}
                      onChangeText={setAssistant}
                      placeholder="Assistant name"
                      placeholderTextColor="rgb(126, 129, 137)"
                      autoCapitalize="words"
                      returnKeyType="done"
                      style={styles.input}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={HandleContinue}
                    activeOpacity={0.85}
                    style={styles.continueButton}
                  >
                    <Text style={styles.continueText}>Continue</Text>
                    <RemixIcon name="arrow-right-line" size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
      <Toast
        config={toastConfig}
        position="top"
        topOffset={50}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgb(11, 12, 16)',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    // backgroundColor:"red"?
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(12, 186, 130, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0cba82',
  },
  statusText: {
    flex: 1,
    color: 'rgb(184, 184, 187)',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 72,
  },
  copyBlock: {
    marginBottom: 38,
  },
  title: {
    color: 'rgb(243, 245, 246)',
    fontSize: 40,
    fontWeight: '600',
    lineHeight: 46,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 18,
    lineHeight: 26,
    marginTop: 18,
  },
  formBlock: {
    gap: 16,
  },
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 18,
    zIndex: 2,
  },
  input: {
    width: '100%',
    minHeight: 68,
    backgroundColor: 'rgb(34, 33, 38)',
    borderRadius: 14,
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    paddingLeft: 56,
    paddingRight: 18,
    textTransform: 'capitalize',
  },
  continueButton: {
    width: '100%',
    height: 60,
    backgroundColor: 'rgb(16, 185, 130)',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueText: {
    color: 'rgb(5, 18, 14)',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default App;
