import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {getFormattedDate} from '../core/date';

const SCREEN_WIDTH = Dimensions.get('screen').width;
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
});

function Card(props) {
  const showDate = new Date(props.date);
  return (
    <Animated.View style={[styles.card, props.style]}>
      <Text style={styles.date}>{getFormattedDate(showDate)}</Text>
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
    </Animated.View>
  );
}

function App(props) {
  const [currDate, setCurrDate] = useState(new Date(props.date));
  const animate = new Animated.Value(0);

  useEffect(() => {
    if (currDate === props.date) {
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
      setCurrDate(props.date);
    });
    return () => {
      unmounted = true;
    };
  }, [animate, currDate, props.date]);

  return (
    <View style={styles.holder}>
      <Card
        style={[
          styles.card,
          {
            transform: [
              {
                translateY: animate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 100],
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
      />
    </View>
  );
}

export default App;
