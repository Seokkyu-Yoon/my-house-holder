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
  textColorGain: {
    color: 'seagreen',
  },
  textColorLoss: {
    color: 'crimson',
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
  plusTouchableGain: {
    backgroundColor: 'seagreen',
  },
  plusTouchableLoss: {
    backgroundColor: 'crimson',
  },
  plus: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  list: {
    flex: 1,
    margin: 20,
  },
  holderRenderItem: {
    padding: 10,
    borderRadius: 10,
  },
  renderItemTouchable: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
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
        <Text style={styles.renderItemTitle}>{item.title}</Text>
        <Text style={styles.renderItemCost}>{`${item.cost}원`}</Text>
      </View>
    </TouchableHighlight>
  );
}

function App(props) {
  const [gains, setGains] = useState([]);
  const [losses, setLosses] = useState([]);
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
        setGains(results.filter(({cost}) => cost > 0));
        setLosses(results.filter(({cost}) => cost < 0));
        setAll(results);
      })
      .catch(console.error);
    return () => {
      unmounted = true;
    };
  }, [props.dummy, props.date, props.user]);

  return (
    <Animated.View style={[styles.card, props.style]}>
      <TouchableWithoutFeedback onPress={props.showModalDateTime}>
        <Text style={styles.date}>{getFormattedDate(props.date)}</Text>
      </TouchableWithoutFeedback>
      <View style={styles.holderTouchable}>
        <Text style={[styles.textContent, styles.textColorGain]}>
          {gains.reduce((acc, {cost}) => acc + cost, 0)}원
        </Text>
        <TouchableHighlight
          style={[styles.plusTouchable, styles.plusTouchableGain]}
          onPress={props.showModalGain}>
          <Text style={styles.plus}>+</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.holderTouchable}>
        <Text style={[styles.textContent, styles.textColorLoss]}>
          {losses.reduce((acc, {cost}) => acc + cost, 0)}원
        </Text>
        <TouchableHighlight
          style={[styles.plusTouchable, styles.plusTouchableLoss]}
          onPress={props.showModalLoss}>
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
          renderItem(item, props.setItem, props.showModalItem)
        }
        keyExtractor={(item) => item.id}
      />
    </Animated.View>
  );
}

export default App;
