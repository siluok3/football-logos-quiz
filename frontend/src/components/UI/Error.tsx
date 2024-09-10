import React from 'react'
import {View, StyleSheet, Text} from 'react-native'

interface ErrorProps {
  message?: string
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  const renderedMessage = message !== undefined
    ? message
    : `Oops something is wrong 🤔 Don't worry, we are on it 🚀!`

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{renderedMessage}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
})

export default Error