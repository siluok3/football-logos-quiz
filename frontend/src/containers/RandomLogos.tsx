import React, {useEffect, useRef, useState} from 'react'
import {
  Button,
  Image,
  StyleSheet,
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { RootStackParamList } from '../navigation/AppNavigator'
import {
  getLogosBySearchTerm,
  getRandomLogos,
  Logo,
  LogosBySearchTermInput,
  sendGameCompletionMessage
} from '../services/logoService'
import Loading from '../components/UI/Loading';
import CustomAlert from '../components/UI/CustomAlert';
import AnimatedAnswerResponse from '../components/UI/AnimatedAnswerResponse';

type RandomLogosScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RandomLogos'>

const { width, height } = Dimensions.get('window')

interface RandomLogosProps {
  route?: {
    params: LogosBySearchTermInput
  }
}

const RandomLogos: React.FC<RandomLogosProps> = ({ route }) => {
  const { difficulty, country } = route?.params || {}

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
        let data
        if (difficulty || country) {
          data = await getLogosBySearchTerm({ difficulty, country })
        } else {
          data = await getRandomLogos()
        }

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
  }, [difficulty, country])

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
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!showCongrats ? (
          <>
            {currentLogo && (<Image source={{ uri: currentLogo.imageUrl }} style={styles.logo} />)}
            <TextInput
              style={styles.input}
              placeholder="Enter team name"
              value={userGuess}
              onChangeText={handleGuessChange}
              onSubmitEditing={handleCheckAnswer}
              returnKeyType="done"
            />
            <Button title="Check Answer" onPress={handleCheckAnswer} />
            {isCorrect
              ? <AnimatedAnswerResponse styles={styles.correctText} animatedValue={correctAnimationValue} text="Correct!" />
              : <AnimatedAnswerResponse styles={styles.wrongText} animatedValue={wrongAnimationValue} text="Try again" />
            }
          </>
        ) : (
          <CustomAlert visible={showCongrats} onClose={handleCloseAlert} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
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