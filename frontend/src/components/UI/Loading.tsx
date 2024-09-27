import React from 'react'
import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large'
  color?: string
}

const Loading: React.FC<LoadingProps> = ({ size = 'large', color = '#0000ff' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.text}>Logos are loading 🚀</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
})

export default Loading