import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Video from 'react-native-video';

function App() {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing:Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing:Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim,{
          toValue:0.5,
          duration:1000,
          
          easing:Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ]),
    ).start();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Video
          source={require('./assets/background/silk.mp4')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          resizeMode="cover"
          repeat
          muted
          paused={false}
        />

        <View
          style={{
            position: 'absolute',
            top: 30,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
        
          }}
        >
          {/* Animated Outer Ring */}
          <Animated.View
            style={{
              width: 35,
              height: 35,
              borderRadius: 20,
              backgroundColor: 'rgba(12,186,130,0.25)',
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ scale: scaleAnim }],
              marginTop:5
            }}
          >
            {/* Fixed Inner Dot */}
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: '#0cba82',
              }}
            />
          </Animated.View>

          <Text
            style={{
              fontSize: 20,
              color: 'white',
              marginLeft: 15,
              fontWeight: '600',
            }}
          >
            Contacts-Command Assistant
          </Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

export default App;