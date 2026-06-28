import React, { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';

import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import RemixIcon from 'react-native-remix-icon';
import Contacts from 'react-native-contacts';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
function Permission() {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
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



  useEffect(() => {
    (async () => {

      await takepermissions()
    })()


  }, [])
  async function checkpermissions() {
    const contect_read_permission = PERMISSIONS.ANDROID.READ_CONTACTS
    const contect_write_permission = PERMISSIONS.ANDROID.WRITE_CONTACTS
    const call_permission = PERMISSIONS.ANDROID.CALL_PHONE
    const microphone_permission = PERMISSIONS.ANDROID.RECORD_AUDIO
    let result = await Promise.all([check(contect_read_permission), check(contect_write_permission), check(call_permission), check(microphone_permission)])

    let permisssionName = ["contact_read", "contact_write", "call_permission", "microphone_permission"]
    let res = permisssionName.map((v, i) => {
      let name = permisssionName[i]

      return { [name]: result[i] }

    })

    console.log("permissionchecked:", res);
    return res

  }

  async function takepermissions() {

    await request(PERMISSIONS.ANDROID.WRITE_CONTACTS)
    await request(PERMISSIONS.ANDROID.READ_CONTACTS)
    await request(PERMISSIONS.ANDROID.RECORD_AUDIO)
    await request(PERMISSIONS.ANDROID.CALL_PHONE)


  }
  async function HandleContinue() {



    let result2 = await checkpermissions()





    let denide_permissions = result2.filter((o) => Object.values(o)[0] == "denied")



    if (denide_permissions.length == 0) {
      console.log("go to the next page");
      return
    }

    console.log('====================================');
    console.log("HERE next");
    console.log('====================================');

    Alert.alert(
      'Permission Required',
      'This feature needs all permission. Please go to Settings and enable all.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ],
      { cancelable: true }
    );



  }


  return (
    <SafeAreaProvider>

      <View style={styles.root}>


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
                  <Text style={styles.title}>Allow</Text>
                  <Text style={styles.title}>Contacts Access.</Text>

                  <Text style={styles.subtitle}>
                    App needs your contact list to call people by name. Your data stay on this device.
                  </Text>
                </View>

                <View style={styles.formBlock}>
                  <View style={styles.permissionList}>
                    <View style={styles.permissionRow}>
                      <View style={styles.permissionIcon}>
                        <RemixIcon
                          color="rgb(16, 185, 130)"
                          name="account-circle-line"
                          size={24}
                        />
                      </View>
                      <Text style={styles.permissionText}>
                        Find anyone in your address book
                      </Text>
                    </View>

                    <View style={styles.permissionRow}>
                      <View style={styles.permissionIcon}>
                        <RemixIcon
                          color="rgb(16, 185, 130)"
                          name="mic-line"
                          size={24}
                        />
                      </View>
                      <Text style={styles.permissionText}>
                        Voice commands like "call Mom"
                      </Text>
                    </View>

                    <View style={styles.permissionRow}>
                      <View style={styles.permissionIcon}>
                        <RemixIcon
                          color="rgb(16, 185, 130)"
                          name="shield-check-line"
                          size={24}
                        />
                      </View>
                      <Text style={styles.permissionText}>
                        Private - your contacts stay on your device
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity

                    onPress={HandleContinue}
                    activeOpacity={0.85}
                    style={styles.continueButton}
                  >
                    <Text style={styles.continueText}>Allow & Continue</Text>
                    <RemixIcon name="shield-check-line" size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>

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
  permissionList: {
    gap: 12,
  },
  permissionRow: {
    minHeight: 64,
    // backgroundColor: 'rgba(34, 33, 38, 0.88)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 130, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  permissionText: {
    flex: 1,
    color: 'rgb(251, 246, 246)',
    fontSize: 17,
    lineHeight: 18,
    fontWeight: '500',
    // backgroundColor:"red"

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

export default Permission;
