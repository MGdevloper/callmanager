import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RemixIcon from 'react-native-remix-icon';

const colors = {
  success: '#22C55E',
  error: '#EF4444',
  info: '#10B981',
};

const icons = {
  success: 'check-line',
  error: 'close-circle-line',
  info: 'information-line',
};
const CustomToast = ({ text1, text2, type }) => {
  return (
    <View
      style={[
        styles.container,
        {
          borderLeftColor: colors[type],
          borderColor: `${colors[type]}30`,
          shadowColor: colors[type],
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: `${colors[type]}20`,
          },
        ]}
      >
        <RemixIcon
          name={icons[type]}
          size={22}
          color={colors[type]}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>

        {!!text2 && (
          <Text style={styles.subtitle}>{text2}</Text>
        )}
      </View>
    </View>
  );
};

export const toastConfig = {
  success: (props) => (
    <CustomToast
      text1={props.text1}
      text2={props.text2}
      type="success"
    />
  ),

  error: (props) => (
    <CustomToast
      text1={props.text1}
      text2={props.text2}
      type="error"
    />
  ),

  info: (props) => (
    <CustomToast
      text1={props.text1}
      text2={props.text2}
      type="info"
    />
  ),
};
const styles = StyleSheet.create({
  container: {
    width: '92%',
    minHeight: 72,
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 5,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
    paddingVertical: 14,

    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 10,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
});