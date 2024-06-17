import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../editingapp/android/src/screens/SplashScreen';
import HomeScreen from '../editingapp/android/src/screens/HomeScreen';
import ImageEditingScreen from '../editingapp/android/src/screens/ImageEditingScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ImageEditing"
          component={ImageEditingScreen}
          options={{title: 'Edit Photo'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
