import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Header: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Football Logos Quiz</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4CAF50', // A nice green color for the header
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default Header