import React from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';

function App(props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {props.children}
    </TouchableWithoutFeedback>
  );
}

export default App;
