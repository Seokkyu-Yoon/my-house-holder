import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {ModalItem} from '../components';
import {ledger} from '../firebase';

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 50,
    right: 0,
    bottom: 0,
    left: 0,
    padding: 20,
    backgroundColor: 'aliceblue',
  },
  holderGroup: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
  },
  holderYear: {
    marginBottom: 20,
  },
  holderMonth: {
    flex: 1,
  },
  holderPicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
  },
  pickerText: {
    marginRight: 20,
  },
  textGain: {
    color: 'seagreen',
  },
  textLoss: {
    color: 'crimson',
  },
  textTotal: {
    color: 'black',
  },
  textCost: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  holderRenderItem: {
    padding: 10,
    borderRadius: 10,
  },
  list: {
    flex: 1,
    marginVertical: 20,
  },
  renderItemTouchable: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
  },
  renderItemDate: {
    color: 'white',
  },
  renderItemTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  renderItemCost: {
    color: 'white',
    textAlign: 'right',
  },
});

function getYearItems() {
  const items = [];
  for (let year = 1990; year <= 2200; year += 1) {
    items.push(
      <Picker.Item key={`year_${year}`} label={`${year}`} value={`${year}`} />,
    );
  }
  return items;
}

function getMonthItems() {
  const items = [];
  for (let month = 1; month <= 12; month += 1) {
    items.push(
      <Picker.Item
        key={`month_${month}`}
        label={`${month}`}
        value={`${month}`}
      />,
    );
  }
  return items;
}

function renderItem(item, setItem, showModalItem) {
  const backgroundColor = item.cost > 0 ? 'seagreen' : 'crimson';
  return (
    <TouchableHighlight
      style={styles.renderItemTouchable}
      underlayColor="gainsboro"
      onPress={() => {
        setItem(item);
        showModalItem(true);
      }}>
      <View style={[styles.holderRenderItem, {backgroundColor}]}>
        <Text style={styles.renderItemDate}>{item.date}</Text>
        <Text style={styles.renderItemTitle}>{item.title}</Text>
        <Text style={styles.renderItemCost}>{`${item.cost}원`}</Text>
      </View>
    </TouchableHighlight>
  );
}

function App(props) {
  const [dummy, setDummy] = useState(false);
  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [month, setMonth] = useState(`${new Date().getMonth() + 1}`);
  const [gainYearly, setGainYearly] = useState(0);
  const [lossYearly, setLossYearly] = useState(0);
  const [gainMonthly, setGainMonthly] = useState(0);
  const [lossMonthly, setLossMonthly] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [modalVisibleItem, setModalVisibleItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: props.visible ? 1 : 0,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
  }, [animation, props.visible]);

  useEffect(() => {
    let unmounted = false;
    ledger
      .getYearly(props.user, {year})
      .then((yearlyResult) => {
        const {gain, loss} = yearlyResult.reduce(
          (bucket, {cost}) => {
            if (cost > 0) {
              bucket.gain += cost;
            }
            if (cost < 0) {
              bucket.loss += cost;
            }
            return bucket;
          },
          {
            loss: 0,
            gain: 0,
          },
        );
        if (unmounted) {
          return;
        }
        setGainYearly(gain);
        setLossYearly(loss);
      })
      .catch(console.error);
    return () => {
      unmounted = true;
    };
  }, [props.user, year]);

  useEffect(() => {
    let unmounted = false;
    ledger
      .getMonthly(props.user, {year, month})
      .then((monthlyResult) => {
        const {gain, loss} = monthlyResult.reduce(
          (bucket, {cost}) => {
            if (cost > 0) {
              bucket.gain += cost;
            }
            if (cost < 0) {
              bucket.loss += cost;
            }
            return bucket;
          },
          {
            loss: 0,
            gain: 0,
          },
        );
        if (unmounted) {
          return;
        }
        setGainMonthly(gain);
        setLossMonthly(loss);
        setMonthlyData(monthlyResult);
      })
      .catch(console.error);
    return () => {
      unmounted = true;
    };
  }, [props.user, year, month]);

  if (props.user === null) {
    return null;
  }

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleItem}
        onRequestClose={() => setModalVisibleItem(false)}>
        <ModalItem
          {...selectedItem}
          update={(data) => ledger.update(selectedItem.id, data)}
          remove={() => ledger.remove(selectedItem.id)}
          close={() => setModalVisibleItem(false)}
          refresh={() => setDummy(!dummy)}
        />
      </Modal>
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
        <View style={[styles.holderGroup, styles.holderYear]}>
          <View style={styles.holderPicker}>
            <Text style={styles.pickerText}>연도 선택</Text>
            <Picker
              style={styles.picker}
              selectedValue={year}
              onValueChange={(itemValue) => setYear(itemValue)}>
              {getYearItems()}
            </Picker>
          </View>
          <Text style={[styles.textCost, styles.textGain]}>
            수익: {gainYearly}원
          </Text>
          <Text style={[styles.textCost, styles.textLoss]}>
            손실: {lossYearly}원
          </Text>
          <Text style={[styles.textCost, styles.textTotal]}>
            총합: {gainYearly + lossYearly}원
          </Text>
        </View>
        <View style={[styles.holderGroup, styles.holderMonth]}>
          <View style={styles.holderPicker}>
            <Text style={styles.pickerText}>월 선택</Text>
            <Picker
              style={styles.picker}
              selectedValue={month}
              onValueChange={(itemValue) => setMonth(itemValue)}>
              {getMonthItems()}
            </Picker>
          </View>
          <Text style={[styles.textCost, styles.textGain]}>
            수익: {gainMonthly}원
          </Text>
          <Text style={[styles.textCost, styles.textLoss]}>
            손실: {lossMonthly}원
          </Text>
          <Text style={[styles.textCost, styles.textTotal]}>
            총합: {gainMonthly + lossMonthly}원
          </Text>
          <FlatList
            style={styles.list}
            data={monthlyData}
            renderItem={({item}) =>
              renderItem(item, setSelectedItem, setModalVisibleItem)
            }
            keyExtractor={(item) => item.id}
          />
        </View>
      </Animated.View>
    </>
  );
}

export default App;
