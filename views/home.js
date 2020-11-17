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

function getMonthDatesFromShow(showDate) {
  const fromDate = new Date(showDate);
  const toDate = new Date(showDate);
  fromDate.setDate(1);
  toDate.setMonth(showDate.getMonth() + 1, 0);

  const dates = [];
  while (fromDate <= toDate) {
    dates.push(getFormattedDate(fromDate));
    fromDate.setDate(fromDate.getDate() + 1);
  }
  return dates;
}

function getFormattedShowDate(showDate) {
  return `${getStrYear(showDate)}년 ${getStrMonth(showDate)}월`;
}

const refPages = createRef();

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
        <DateHolder date={showDate} />
      </SafeAreaView>
    </>
  );
}

export default App;
