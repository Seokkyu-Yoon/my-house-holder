import React, {createRef, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {DateHolder, Header} from '../components';
import {getFormattedDate, getStrMonth, getStrYear} from '../core/date';
import firebase from '../firebase';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'yellow',
    flexDirection: 'row',
  },
});

function goToToday(today, setShowDate) {
  setShowDate(today);
}

function App(props) {
  const [today, setToday] = useState(new Date());
  const [showDate, setShowDate] = useState(new Date());
  const [currIndex, setCurrIndex] = useState(0);

  if (props.user === null) {
    return null;
  }
  return (
    <>
      <SafeAreaView style={styles.root}>
        <Header {...props} />
        <DateHolder date={showDate} setDate={setShowDate} />
      </SafeAreaView>
    </>
  );
}

export default App;
