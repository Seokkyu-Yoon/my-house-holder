import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import {getFormattedDate} from '../core/date';
import {ledger} from '../firebase';

const styles = StyleSheet.create({
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
  textColorTotal: {
    color: 'black',
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
    marginTop: 20,
    marginHorizontal: 20,
  },
});

function renderItem(item, setItem, showItemModal) {
  return (
    <TouchableHighlight
      onPress={() => {
        console.log(item);
        setItem(item);
        showItemModal(true);
      }}>
      <View>
        <Text>{item.title}</Text>
        <Text>{`${item.cost}원`}</Text>
      </View>
    </TouchableHighlight>
  );
}

function App(props) {
  const [incomes, setIncomes] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [all, setAll] = useState([]);

  useEffect(() => {
    let unmounted = false;
    const date = getFormattedDate(props.date);
    ledger
      .get(props.user, {date})
      .then((results) => {
        if (unmounted) {
          return;
        }
        setIncomes(results.filter(({cost}) => cost > 0));
        setExpenditures(results.filter(({cost}) => cost < 0));
        setAll(results);
      })
      .catch(console.error);
    return () => {
      unmounted = true;
    };
  }, [props.dummy, props.date, props.user]);

  return (
    <Animated.View style={[styles.card, props.style]}>
      <TouchableWithoutFeedback onPress={props.showDateTimeModal}>
        <Text style={styles.date}>{getFormattedDate(props.date)}</Text>
      </TouchableWithoutFeedback>
      <View style={styles.holderTouchable}>
        <Text style={[styles.textContent, styles.textColorIncome]}>
          {incomes.reduce((acc, {cost}) => acc + cost, 0)}원
        </Text>
        <TouchableHighlight
          style={[styles.plusTouchable, styles.plusTouchableIncome]}
          onPress={props.showIncomeModal}>
          <Text style={styles.plus}>+</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.holderTouchable}>
        <Text style={[styles.textContent, styles.textColorSpend]}>
          {expenditures.reduce((acc, {cost}) => acc + cost, 0)}원
        </Text>
        <TouchableHighlight
          style={[styles.plusTouchable, styles.plusTouchableSpend]}
          onPress={props.showExpenditureModal}>
          <Text style={styles.plus}>+</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.holderTouchable}>
        <Text style={[styles.textContent, styles.textColorTotal]}>
          {`총 ${all.reduce((acc, {cost}) => acc + cost, 0)}원`}
        </Text>
      </View>
      <FlatList
        style={styles.list}
        data={all}
        renderItem={({item}) =>
          renderItem(item, props.setItem, props.showItemModal)
        }
        keyExtractor={(item) => item.id}
      />
    </Animated.View>
  );
}

export default App;
