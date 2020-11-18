import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Easing, StyleSheet} from 'react-native';

import {withAnchorPoint} from 'react-native-anchor-point';

import {DateHolder} from '../components';

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 50,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'aliceblue',
  },
});

function showToday(today, setShowDate) {
  setShowDate(today);
}

function getTransform(animation) {
  const transform = {
    transform: [
      {
        scale: animation,
      },
    ],
  };
  return withAnchorPoint(
    transform,
    {x: 1, y: 0},
    {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height - 128,
    },
  );
}

function App(props) {
  const [today] = useState(new Date());
  const [showDate, setShowDate] = useState(new Date());
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: props.visible ? 1 : 0,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
  }, [animation, props.visible]);

  if (props.user === null) {
    return null;
  }
  return (
    <>
      <Animated.View style={[styles.root, getTransform(animation)]}>
        <DateHolder user={props.user} date={showDate} setDate={setShowDate} />
      </Animated.View>
    </>
  );
}

export default App;
