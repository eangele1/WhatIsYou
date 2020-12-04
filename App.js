import * as React from 'react';
import { View, Text, Dimensions, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';

//import screens from each file to stacknavigator for navigation
import Home from './Home.js';
import Quiz from './Quiz.js';

//creates a stack for the screens to lay on top of each other
const Stack = createStackNavigator();

//stores data url into global constant variable
global.QUIZ_DATA_URL = "https://eangele1.github.io/WhatIsYou/data.json";

function App() {

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
      {/* List your screens here */}
        <Stack.Screen name="HomeScreen" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="QuizScreen" component={Quiz} options={{ headerTitleContainerStyle: { left: "12.5%" }, headerTintColor: "white", headerStyle: { backgroundColor: "orange" }, headerTitleStyle: {
            fontSize: 17 }}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;