import {Button, Image, StyleSheet, TextInput, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useEffect, useState} from 'react';
import {getRandomLogos, Logo} from '../services/logoService';

type RandomLogosScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RandomLogos'>

const RandomLogos: React.FC = () => {
  const navigation = useNavigation<RandomLogosScreenNavigationProp>()
  const [logos] = useState(getRandomLogos('easy'))
  const [currentLogo, setCurrentLogo] = useState(logos[0])
  const [userGuess, setUserGuess] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [remainingLogos, setRemainingLogos] = useState<Logo[]>(logos)

  const handleBack = () => {
    navigation.goBack()
  }

  const handleGuessChange = (text: string) => {
    setUserGuess(text)
  }

  const handleCheckAnswer = () => {
    if (!currentLogo) return

    if (currentLogo.name.toLowerCase().trimEnd() === userGuess.toLowerCase().trimEnd()) {
      setIsCorrect(true)

      setTimeout(() => {
        handleNextLogo()
      }, 2000)
    } else {
      setIsCorrect(false)
    }
  }

  const handleNextLogo = () => {
    setUserGuess('')
    setIsCorrect(null)

    const updatedRemainingLogos = remainingLogos.filter(logo => logo.id !== currentLogo.id)

    if (updatedRemainingLogos.length > 0) {
      setRemainingLogos(updatedRemainingLogos)
      const nextLogo: Logo = updatedRemainingLogos[Math.floor(Math.random() * updatedRemainingLogos.length)]
      setCurrentLogo(nextLogo)
    } else {
      alert('Congratulation. All logos were found!')
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={handleBack} />
      {remainingLogos.length > 0 ? (
        <>
          {currentLogo && <Image source={currentLogo.image} style={styles.logo} />}
          <TextInput
            style={styles.input}
            placeholder="Enter team name"
            value={userGuess}
            onChangeText={handleGuessChange}
          />
          <Button title="Check Answer" onPress={handleCheckAnswer} />
          {isCorrect === true && <Text>Correct!</Text>}
          {isCorrect === false && <Text>Try again!</Text>}
        </>
      ) : (
        <Text>Congrats! All logos have been found. Go back to play again</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
})

export default RandomLogos