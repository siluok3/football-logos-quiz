import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {RootStackParamList} from '../navigation/AppNavigator'
import {Button, StyleSheet, Text, View} from 'react-native'

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>

const Main: React.FC = () => {
  const navigation = useNavigation<MainScreenNavigationProp>()

  const handleRandomLogosPress = () => {
    navigation.navigate('RandomLogos')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Football Logo Quiz</Text>
      <Button title="Random Logos" onPress={handleRandomLogosPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
})

export default Main