import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Footer: React.FC = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>© 2024 Football Quiz App</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
})

export default Footer