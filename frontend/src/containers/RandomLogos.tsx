import React, {useEffect, useRef, useState} from 'react'
import {Button, Image, StyleSheet, TextInput, View, Animated, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { RootStackParamList } from '../navigation/AppNavigator'
import {getLogosFromBackend, Logo, sendGameCompletionMessage} from '../services/logoService'
import Loading from '../components/UI/Loading';
import CustomAlert from '../components/UI/CustomAlert';

type RandomLogosScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RandomLogos'>

const { width, height } = Dimensions.get('window')

const RandomLogos: React.FC = () => {
  const navigation = useNavigation<RandomLogosScreenNavigationProp>()
  const [logos, setLogos] = useState<Logo[]>([])
  const [currentLogo, setCurrentLogo] = useState<Logo | null>(null)
  const [userGuess, setUserGuess] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [remainingLogos, setRemainingLogos] = useState<Logo[]>(logos)
  const [loading, setLoading] = useState<boolean>(true)
  const [showCongrats, setShowCongrats] = useState(false)

  const correctAnimationValue = useRef(new Animated.Value(0)).current
  const wrongAnimationValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const fetchLogos = async () => {
      setLoading(true)
      try {
        const data = await getLogosFromBackend()
        setLogos(data)
        if (data.length > 0) {
          setCurrentLogo(data[0]);
          setRemainingLogos(data);
          setLoading(false)
        }
      } catch (err) {
        setLoading(false)
        console.error('Error fetching logos:', err)
      }
    }

    fetchLogos()
      //.finally(() => setLoading(false))
  }, [])

  const animateCorrectAnswer = () => {
    Animated.sequence([
      Animated.timing(correctAnimationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.delay(2000),
      Animated.timing(correctAnimationValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      handleNextLogo()
    })
  }

  const animateWrongAnswer = () => {
    Animated.sequence([
      Animated.timing(wrongAnimationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.delay(2000),
      Animated.timing(wrongAnimationValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start()
  }

  const handleGuessChange = (text: string) => {
    setUserGuess(text)
  }

  const handleCheckAnswer = () => {
    if (!currentLogo) return

    if (currentLogo.name.toLowerCase().trimEnd() === userGuess.toLowerCase().trimEnd()) {
      setIsCorrect(true)
      animateCorrectAnswer()
    } else {
      setIsCorrect(false)
      animateWrongAnswer()
    }
  }

  const handleNextLogo = () => {
    setUserGuess('')
    setIsCorrect(null)

    const updatedRemainingLogos = remainingLogos.filter(logo => logo.id !== currentLogo?.id)

    if (updatedRemainingLogos.length > 0) {
      setRemainingLogos(updatedRemainingLogos)
      const nextLogo: Logo = updatedRemainingLogos[Math.floor(Math.random() * updatedRemainingLogos.length)]
      setCurrentLogo(nextLogo)
    } else {
      setRemainingLogos(updatedRemainingLogos)
      setShowCongrats(true)
      sendGameCompletionMessage()
    }
  }

  const handleCloseAlert = () => {
    setShowCongrats(false)
    navigation.navigate('Main')
  }

  if (loading) {
    return <Loading />
  }

  return (
      <View style={styles.container}>
        {!showCongrats ? (
          <>
            {currentLogo && (<Image source={{ uri: currentLogo.imageUrl }} style={styles.logo} />)}
            <TextInput
              style={styles.input}
              placeholder="Enter team name"
              value={userGuess}
              onChangeText={handleGuessChange}
            />
            <Button title="Check Answer" onPress={handleCheckAnswer} />
            {isCorrect === true && (
              <Animated.Text
                style={[
                  styles.correctText,
                  {
                    opacity: correctAnimationValue,
                    transform: [{ scale: correctAnimationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.2],
                      })}],
                  },
                ]}
              >
                Correct!
              </Animated.Text>
            )}
            {isCorrect === false && (
              <Animated.Text
                style={[
                  styles.wrongText,
                  {
                    opacity: wrongAnimationValue,
                    transform: [{ scale: wrongAnimationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.2],
                      })}],
                  },
                ]}
              >
                Try again
              </Animated.Text>
            )}
          </>
        ) : (
          <CustomAlert visible={showCongrats} onClose={handleCloseAlert} />
        )}
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  correctText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
  },
  wrongText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF5252',
    marginTop: 20,
  },
})

export default RandomLogos