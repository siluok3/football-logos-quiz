import React, {useEffect, useRef, useState} from 'react'
import {
  Text,
  Image,
  StyleSheet,
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView, View, TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import levenshtein from 'fast-levenshtein'

import { RootStackParamList } from '../navigation/AppNavigator'
import Loading from '../components/UI/Loading';
import CustomAlert from '../components/UI/CustomAlert';
import AnimatedAnswerResponse from '../components/UI/AnimatedAnswerResponse';
import {useLogosBySearchTerm} from '../hooks/useLogosBySearchTerm';
import {useRandomLogos} from '../hooks/useRandomLogos';
import {Logo, LogosBySearchTermInput} from '../types/logo';
import {useSendGameCompletion} from '../hooks/useSendGameCompletion';
import Error from '../components/UI/Error';

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

  const { data: fetchedLogos, isLoading, error } = difficulty || country
    ? useLogosBySearchTerm({ difficulty, country })
    : useRandomLogos()
  const { mutate: sendGameCompletion } = useSendGameCompletion()

  const [logos, setLogos] = useState<Logo[]>([])
  const [currentLogo, setCurrentLogo] = useState<Logo | null>(null)
  const [userGuess, setUserGuess] = useState<string>('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [remainingLogos, setRemainingLogos] = useState<Logo[]>(logos)
  const [showCongrats, setShowCongrats] = useState<boolean>(false)
  const [wrongAttempts, setWrongAttempts] = useState<number>(0)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const correctAnimationValue = useRef(new Animated.Value(0)).current
  const wrongAnimationValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (fetchedLogos && fetchedLogos.length > 0) {
      setCurrentLogo(fetchedLogos[0]);
      setRemainingLogos(fetchedLogos)
    }
  }, [fetchedLogos])

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

    const userGuessNormalised = userGuess.toLowerCase().trimEnd()
    const correctNameNormalised = currentLogo.name.toLowerCase().trimEnd()

    const diffInCharacters = levenshtein.get(correctNameNormalised, userGuessNormalised)

    if (diffInCharacters <= 3) {
      setIsCorrect(true)
      animateCorrectAnswer()
    } else {
      setIsCorrect(false)
      setWrongAttempts(prev => prev + 1)
      animateWrongAnswer()

      if (wrongAttempts >= 2) {
        setAlertMessage(`The correct answer was: ${currentLogo.name}`);
        setShowAlert(true);

        setTimeout(() => {
          handleNextLogo();
        }, 400)
      }
    }
  }

  const handleSkipLogo = () => {
    setUserGuess('')
    setIsCorrect(null)
    setWrongAttempts(0)

    const nextLogo: Logo = remainingLogos[Math.floor(Math.random() * remainingLogos.length)]
    setCurrentLogo(nextLogo)
  }

  const handleNextLogo = () => {
    setUserGuess('')
    setIsCorrect(null)
    setWrongAttempts(0)

    const updatedRemainingLogos = remainingLogos.filter(logo => logo.id !== currentLogo?.id)

    if (updatedRemainingLogos.length > 0) {
      setRemainingLogos(updatedRemainingLogos)
      const nextLogo: Logo = updatedRemainingLogos[Math.floor(Math.random() * updatedRemainingLogos.length)]
      setCurrentLogo(nextLogo)
    } else {
      sendGameCompletion({
        userId: 'dummyUser123', //TODO update when we have authentication
        completionTime: new Date().toISOString(),
      })

      setRemainingLogos(updatedRemainingLogos)
      setShowCongrats(true)
    }
  }

  const handleCloseAlert = () => {
    setShowCongrats(false)
    navigation.navigate('Main')
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error />
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={handleSkipLogo}>
                <Text style={styles.buttonText}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleCheckAnswer}>
                <Text style={styles.buttonText}>Check Answer</Text>
              </TouchableOpacity>
            </View>
            {isCorrect
              ? <AnimatedAnswerResponse styles={styles.correctText} animatedValue={correctAnimationValue} text="Correct!" />
              : <AnimatedAnswerResponse styles={styles.wrongText} animatedValue={wrongAnimationValue} text="Try again" />
            }
          </>
        ) : (
          <CustomAlert
            visible={showCongrats}
            onClose={handleCloseAlert}
            title='Congratulations! 🎉'
            message='You found all the logos!'
          />
        )}
        <CustomAlert
          visible={showAlert}
          onClose={() => setShowAlert(false)}
          title="Wrong Answer!"
          message={alertMessage}
        />
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  skipButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})

export default RandomLogos