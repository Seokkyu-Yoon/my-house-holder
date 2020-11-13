import React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: 'royalblue',
  },
});

function App(props) {
  return <View style={styles.header} />;
}

export default App;
