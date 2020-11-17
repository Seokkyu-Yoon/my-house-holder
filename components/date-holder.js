import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Modal, StyleSheet, View} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';

import {getFormattedDate} from '../core/date';
import {ledger} from '../firebase';
import CostModal from './cost-modal';
import DateCard from './date-card';
import ItemModal from './item-modal';

const styles = StyleSheet.create({
  holder: {
    flex: 1,
  },
});

function App(props) {
  const [dummy, setDummy] = useState(false);
  const [dateTimeModalVisible, setDateTimeModalVisible] = useState(false);
  const [incomeModalVisible, setIncomeModalVisible] = useState(false);
  const [expenditureModalVisible, setExpenditureModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
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
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setPrevDate(props.date);
    });
  }, [animation, prevDate, props.date]);

  return (
    <View style={styles.holder}>
      <DateTimePicker
        isVisible={dateTimeModalVisible}
        date={props.date}
        onConfirm={(date) => {
          setDateTimeModalVisible(false);
          if (getFormattedDate(date) !== getFormattedDate(props.date)) {
            props.setDate(new Date(date));
          }
        }}
        onCancel={() => setDateTimeModalVisible(false)}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={incomeModalVisible}
        onRequestClose={() => setIncomeModalVisible(false)}>
        <CostModal
          date={props.date}
          add={(data) => ledger.add(props.user, data)}
          close={() => setIncomeModalVisible(false)}
          refresh={() => setDummy(!dummy)}
          income
        />
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={expenditureModalVisible}
        onRequestClose={() => setExpenditureModalVisible(false)}>
        <CostModal
          date={props.date}
          type="지출"
          add={(data) => ledger.add(props.user, data)}
          close={() => setExpenditureModalVisible(false)}
          refresh={() => setDummy(!dummy)}
          expenditure
        />
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={itemModalVisible}
        onRequestClose={() => setItemModalVisible(false)}>
        <ItemModal
          {...selectedItem}
          update={(data) => ledger.update(selectedItem.id, data)}
          remove={() => ledger.remove(selectedItem.id)}
          close={() => setItemModalVisible(false)}
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
        showItemModal={() => setItemModalVisible(true)}
        showDateTimeModal={() => setDateTimeModalVisible(true)}
        showIncomeModal={() => setIncomeModalVisible(true)}
        showExpenditureModal={() => setExpenditureModalVisible(true)}
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
        showItemModal={() => setItemModalVisible(true)}
        showDateTimeModal={() => setDateTimeModalVisible(true)}
        showIncomeModal={() => setIncomeModalVisible(true)}
        showExpenditureModal={() => setExpenditureModalVisible(true)}
      />
    </View>
  );
}

export default App;
