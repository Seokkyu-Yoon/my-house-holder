import React, {useEffect, useState} from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import {getFormattedDate} from '../core/date';

const styles = StyleSheet.create({
  holder: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
  },
  date: {
    paddingVertical: 15,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textContent: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  textColorIncome: {
    color: 'green',
  },
  textColorSpend: {
    color: 'red',
  },
  holderTouchable: {
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plusTouchable: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusTouchableIncome: {
    backgroundColor: 'green',
  },
  plusTouchableSpend: {
    backgroundColor: 'red',
  },
  plus: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  list: {
    flex: 1,
    backgroundColor: 'black',
  },
});

function renderItem({item}) {
  return (
    <View>
      <Text>{item.title}</Text>
      <Text>{item.content}</Text>
      <Text>{`${item.cost}원`}</Text>
    </View>
  );
}

function Card(props) {
  const showDate = new Date(props.date);
  return (
    <Animated.View style={[styles.card, props.style]}>
      <TouchableWithoutFeedback onPress={props.showModal}>
        <Text style={styles.date}>{getFormattedDate(showDate)}</Text>
      </TouchableWithoutFeedback>
      <View style={styles.holderTouchable}>
        <Text style={[styles.textContent, styles.textColorIncome]}>0원</Text>
        <TouchableHighlight
          style={[styles.plusTouchable, styles.plusTouchableIncome]}
          onPress={() => console.log('수익 추가')}>
          <Text style={styles.plus}>+</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.holderTouchable}>
        <Text style={[styles.textContent, styles.textColorSpend]}>0원</Text>
        <TouchableHighlight
          style={[styles.plusTouchable, styles.plusTouchableSpend]}
          onPress={() => console.log('지출 추가')}>
          <Text style={styles.plus}>+</Text>
        </TouchableHighlight>
      </View>
      <FlatList
        style={styles.list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Animated.View>
  );
}

function App(props) {
  const [currDate, setCurrDate] = useState(new Date(props.date));
  const [dateTimeModalVisible, setDateTimeModalVisible] = useState(false);
  const animate = new Animated.Value(0);

  useEffect(() => {
    if (getFormattedDate(currDate) === getFormattedDate(props.date)) {
      return;
    }
    let unmounted = false;
    Animated.timing(animate, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      if (unmounted) {
        return;
      }
      setCurrDate(new Date(props.date));
      setDateTimeModalVisible(false);
    });
    return () => {
      unmounted = true;
    };
  }, [animate, currDate, props.date]);

  return (
    <View style={styles.holder}>
      <DateTimePicker
        isVisible={dateTimeModalVisible}
        date={props.date}
        onConfirm={(date) => {
          props.setDate(new Date(date));
        }}
        onCancel={() => setDateTimeModalVisible(false)}
      />
      <Card
        style={[
          styles.card,
          {
            transform: [
              {
                translateY: animate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 300],
                }),
              },
            ],
            opacity: animate.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ]}
        date={currDate}
        showModal={() => setDateTimeModalVisible(true)}
      />
      <Card
        style={[
          styles.card,
          {
            opacity: animate.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
        date={props.date}
        showModal={() => setDateTimeModalVisible(true)}
      />
    </View>
  );
}

export default App;
