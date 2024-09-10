import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import Main from '../containers/Main'
import RandomLogos from '../containers/RandomLogos'
import SelectionScreen from '../containers/SelectionScreen'
import {LogosBySearchTermInput} from '../types/logo';

export type RootStackParamList = {
  Main: undefined
  RandomLogos: LogosBySearchTermInput
  Selection: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        <Stack.Screen name="RandomLogos" component={RandomLogos} options={{ title: 'Find the Logos' }} />
        <Stack.Screen name="Selection" component={SelectionScreen} options={{ title: 'Select Options' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator