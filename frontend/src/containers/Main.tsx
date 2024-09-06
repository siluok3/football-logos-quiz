import React from 'react'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {Button, Dimensions, Image, StyleSheet, Text, View} from 'react-native'

import {RootStackParamList} from '../navigation/AppNavigator'
import Layout from '../components/layout/Layout'

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>

const screenWidth = Dimensions.get('window').width

const Main: React.FC = () => {
  const navigation = useNavigation<MainScreenNavigationProp>()

  const handleRandomLogosPress = () => {
    navigation.navigate('RandomLogos', {})
  }

  const handleSelectionScreenPress = () => {
    navigation.navigate('Selection')
  }

  return (
    <Layout>
      <View style={styles.container}>
        <Image source={require('../../assets/app-logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome to Football Logo Quiz</Text>
        <View style={[styles.buttonContainer, { width: screenWidth * 0.8 }]}>
          <View style={styles.buttonWrapper}>
            <Button title="Play All Logos" onPress={handleRandomLogosPress} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Select Logos" onPress={handleSelectionScreenPress} />
          </View>
        </View>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: screenWidth * 0.6,
    height: (screenWidth * 0.6) * (3 / 4),
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    marginBottom: 20,
  },
})

export default Main