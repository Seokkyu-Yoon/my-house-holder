import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {Pages} from 'react-native-pages';

import {Header} from '../components';
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

function App(props) {
  const [today, setToday] = useState(new Date());
  const [showDate, setShowDate] = useState(new Date());
  const [currIndex, setCurrIndex] = useState(0);

  if (props.user === null) {
    return null;
  }
  console.log(getMonthDatesFromShow(showDate));
  return (
    <>
      <SafeAreaView style={styles.root}>
        <Header {...props} />
        <Pages style={{flex: 1, backgroundColor: 'yellow'}}>
          {getMonthDatesFromShow(showDate).map((date, index) => (
            <View key={`page_${index}`} style={{flex: 1, margin: 20}}>
              <Text>{date}</Text>
            </View>
          ))}
        </Pages>
      </SafeAreaView>
    </>
  );
}

export default App;
