import React from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: 'royalblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
});

/**
 * This function is btn-ok component
 * @param {Object} props
 * @param {Object} props.touchableStyle
 * @param {Object} props.textStyle
 * @param {Function} props.onPress
 */
function App(props) {
  return (
    <TouchableHighlight
      underlayColor="#1F49C6"
      style={[styles.touchable, props.touchableStyle]}
      onPress={props.onPress}>
      <Text style={[styles.text, props.textStyle]}>확인</Text>
    </TouchableHighlight>
  );
}

export default App;
