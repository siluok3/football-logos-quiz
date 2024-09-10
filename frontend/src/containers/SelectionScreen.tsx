import React from 'react'
import {View, Image, StyleSheet, Text, Dimensions, TouchableOpacity} from 'react-native';
import {AvailableCountries} from '../types/logo';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type SelectionScreenProps = NativeStackScreenProps<RootStackParamList, 'Selection'>

const screenWidth = Dimensions.get('window').width;

const SelectionScreen: React.FC<SelectionScreenProps> = ({ navigation }) => {
  const handleSelection = (difficulty: string, country: AvailableCountries) => {
    navigation.navigate('RandomLogos', { difficulty, country });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select Difficulty:</Text>

      <View style={[styles.buttonContainer, { width: screenWidth * 0.8 }]}>
        <TouchableOpacity
          style={[styles.difficultyButton, styles.easyButton]}
          onPress={() => handleSelection('easy', '')}
        >
          <Text style={styles.buttonText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.difficultyButton, styles.mediumButton]}
          onPress={() => handleSelection('medium', '')}
        >
          <Text style={styles.buttonText}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.difficultyButton, styles.hardButton]}
          onPress={() => handleSelection('hard', '')}
        >
          <Text style={styles.buttonText}>Hard</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.headerText}>Select Country:</Text>

      <View style={[styles.flagContainer, { width: screenWidth * 0.8 }]}>
        <TouchableOpacity style={styles.flagButton} onPress={() => handleSelection('', 'Spain')}>
          <Image source={require('../../assets/flags/spanish-flag.png')} style={styles.flagImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.flagButton} onPress={() => handleSelection('', 'England')}>
          <Image source={require('../../assets/flags/english-flag.png')} style={styles.flagImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.flagButton} onPress={() => handleSelection('', 'Italy')}>
          <Image source={require('../../assets/flags/italian-flag.png')} style={styles.flagImage} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  difficultyButton: {
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  easyButton: {
    backgroundColor: 'green',
  },
  mediumButton: {
    backgroundColor: 'orange',
  },
  hardButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  flagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  flagButton: {
    marginHorizontal: 5
  },
  flagImage: {
    width: 70,
    height: 40,
    resizeMode: 'contain',
  },
})

export default SelectionScreen