import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Main from '../containers/Main';
import RandomLogos from '../containers/RandomLogos';

export type RootStackParamList = {
  Main: undefined;
  RandomLogos: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="RandomLogos" component={RandomLogos} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator