import React from 'react'
import {Button, View, StyleSheet, Text} from 'react-native';

interface SelectionScreenProps {
  navigation: any
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ navigation }) => {
  const handleSelection = (difficulty: string, country: string) => {
    navigation.navigate('RandomLogos', { difficulty, country });
  }

  return (
    <View style={styles.container}>
      <Text>Select Difficulty:</Text>
      <Button title="Easy" onPress={() => handleSelection('easy', '')} />
      <Button title="Medium" onPress={() => handleSelection('medium', '')} />
      <Button title="Hard" onPress={() => handleSelection('hard', '')} />

      <Text>Select Country:</Text>
      <Button title="Spain" onPress={() => handleSelection('', 'Spain')} />
      <Button title="England" onPress={() => handleSelection('', 'England')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default SelectionScreen