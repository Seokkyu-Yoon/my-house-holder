import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Modal, StyleSheet, View} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';

import {getFormattedDate} from '../core/date';
import {ledger} from '../firebase';
import DateCard from './date-card';
import CostModal from './modal-cost';
import ItemModal from './modal-item';

const styles = StyleSheet.create({
  holder: {
    flex: 1,
  },
});

function App(props) {
  const [dummy, setDummy] = useState(false);
  const [modalVisibleDateTime, setModalVisibleDateTime] = useState(false);
  const [modalVisibleGain, setModalVisibleGain] = useState(false);
  const [modalVisibleLoss, setModalVisibleLoss] = useState(false);
  const [modalVisibleItem, setModalVisibleItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const [prevDate, setPrevDate] = useState(props.date);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (prevDate === props.date) {
      return;
    }
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setPrevDate(props.date);
    });
  }, [animation, prevDate, props.date]);

  return (
    <View style={styles.holder}>
      <DateTimePicker
        isVisible={modalVisibleDateTime}
        date={props.date}
        onConfirm={(date) => {
          setModalVisibleDateTime(false);
          if (getFormattedDate(date) !== getFormattedDate(props.date)) {
            props.setDate(new Date(date));
          }
        }}
        onCancel={() => setModalVisibleDateTime(false)}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleGain}
        onRequestClose={() => setModalVisibleGain(false)}>
        <CostModal
          date={props.date}
          add={(data) => ledger.add(props.user, data)}
          close={() => setModalVisibleGain(false)}
          refresh={() => setDummy(!dummy)}
          gain
        />
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleLoss}
        onRequestClose={() => setModalVisibleLoss(false)}>
        <CostModal
          date={props.date}
          type="지출"
          add={(data) => ledger.add(props.user, data)}
          close={() => setModalVisibleLoss(false)}
          refresh={() => setDummy(!dummy)}
          loss
        />
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleItem}
        onRequestClose={() => setModalVisibleItem(false)}>
        <ItemModal
          {...selectedItem}
          update={(data) => ledger.update(selectedItem.id, data)}
          remove={() => ledger.remove(selectedItem.id)}
          close={() => setModalVisibleItem(false)}
          refresh={() => setDummy(!dummy)}
        />
      </Modal>
      <DateCard
        style={{
          opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        }}
        user={props.user}
        date={props.date}
        dummy={dummy}
        setItem={setSelectedItem}
        showModalDateTime={() => setModalVisibleDateTime(true)}
        showModalGain={() => setModalVisibleGain(true)}
        showModalItem={() => setModalVisibleItem(true)}
        showModalLoss={() => setModalVisibleLoss(true)}
      />
      <DateCard
        style={{
          opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, Dimensions.get('screen').height],
              }),
            },
          ],
        }}
        user={props.user}
        date={prevDate}
        dummy={dummy}
        setItem={setSelectedItem}
        showModalDateTime={() => setModalVisibleDateTime(true)}
        showModalGain={() => setModalVisibleGain(true)}
        showModalItem={() => setModalVisibleItem(true)}
        showModalLoss={() => setModalVisibleLoss(true)}
      />
    </View>
  );
}

export default App;
