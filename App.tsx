import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Startingpage from './components/Startingpage';
import Toast from 'react-native-toast-message';
import { toastConfig } from './components/CustomeToast';
import Permission from './components/Permission';
import Homepage from './components/Homepage';
const Stack = createNativeStackNavigator()
function App() {

  return (
    <>
      <NavigationContainer  >
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen
            options={{ headerShown: false }}
            name='Starting'
            component={Startingpage}

          />
          <Stack.Screen
              options={{headerShown:false}}
              name='Permission'
              component={Permission}
          />

        <Stack.Screen
        name='Home'
        component={Homepage}
        options={{headerShown:false}}
        
        />


        </Stack.Navigator>

      </NavigationContainer>
      <Toast
        config={toastConfig}
        position="top"
        topOffset={50}
      />
    </>
  );
}


export default App;
