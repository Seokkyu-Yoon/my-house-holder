import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Easing, StyleSheet} from 'react-native';

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
      <Animated.View
        style={[
          styles.root,
          {
            transform: [
              {
                translateX: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [Dimensions.get('screen').width, 0],
                }),
              },
            ],
          },
        ]}>
        <DateHolder user={props.user} date={showDate} setDate={setShowDate} />
      </Animated.View>
    </>
  );
}

export default App;
