import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import imageCalendar from '../assets/calendar.png';
import imageStatistic from '../assets/statistic.png';

const styles = StyleSheet.create({
  header: {
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: 'royalblue',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'stretch',
  },
});

function App(props) {
  return (
    <View style={styles.header}>
      {props.navigation.name === 'Statistic' && (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => props.navigation.navigate('Home')}>
          <Image style={styles.icon} source={imageCalendar} />
        </TouchableOpacity>
      )}
      {props.navigation.name === 'Home' && (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => props.navigation.navigate('Statistic')}>
          <Image style={styles.icon} source={imageStatistic} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default App;
