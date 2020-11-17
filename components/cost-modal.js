import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DismissKeyboard from './dismiss-keyboard';
import {getFormattedDate} from '../core/date';

const styles = StyleSheet.create({
  holder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.4,
  },
  content: {
    borderRadius: 20,
    padding: 20,
    width: Dimensions.get('window').width * 0.66,
    backgroundColor: 'white',
    opacity: 1,
  },
  holderButton: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  holderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textAdd: {
    color: 'royalblue',
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    textAlign: 'right',
  },
  textInputMultiLine: {
    height: 90,
  },
});

function getTitle({income, expenditure}) {
  if (income) {
    return '수익';
  }
  if (expenditure) {
    return '지출';
  }
  throw new Error('정해진 cost-modal 요청이 아닙니다');
}

function getCostSign({income, expenditure}) {
  if (income) {
    return 1;
  }
  if (expenditure) {
    return -1;
  }
  return 0;
}

function getAlarmBodyString(date, title, content, cost) {
  return [
    ' - 날짜',
    getFormattedDate(date),
    ' - 제목',
    title,
    '- 내용',
    content,
    ' - 금액',
    `${cost}원`,
  ].join('\n');
}

function App(props) {
  const [keyboardOpened, setKeyBoardOpened] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [textCost, setTextCost] = useState('');

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setKeyBoardOpened(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyBoardOpened(false);
    });
  }, []);

  return (
    <DismissKeyboard>
      <View style={styles.holder}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (keyboardOpened) {
              Keyboard.dismiss();
              return;
            }
            props.close();
          }}>
          <View style={styles.shadow} />
        </TouchableWithoutFeedback>
        <View style={styles.content}>
          <Text style={styles.title}>{`${getTitle(props)} 추가`}</Text>
          <View style={styles.holderItem}>
            <Text style={styles.text}>제목</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              placeholder="제목을 입력해주세요"
              maxLength={12}
              onChangeText={setTitle}
            />
          </View>
          <View style={styles.holderItem}>
            <Text style={styles.text}>내용</Text>
            <TextInput
              style={[styles.textInput, styles.textInputMultiLine]}
              multiline={true}
              value={content}
              placeholder="내용을 입력해주세요"
              onChangeText={setContent}
            />
          </View>
          <View style={styles.holderItem}>
            <Text style={styles.text}>금액</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="number-pad"
              maxLength={15}
              value={textCost}
              placeholder="금액을 입력해주세요"
              onChangeText={setTextCost}
            />
            <Text style={styles.text}>원</Text>
          </View>
          <View style={styles.holderButton}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (!title) {
                  Alert.alert('오류', '제목을 입력해주세요');
                  return;
                }
                if (
                  !textCost ||
                  isNaN(Number(textCost)) ||
                  Number(textCost) <= 0
                ) {
                  Alert.alert('오류', '금액을 확인해주세요');
                  return;
                }
                const costSign = getCostSign(props);
                if (costSign === 0) {
                  throw new Error('cost sign is not defined to add');
                }
                const cost = costSign * Number(textCost);
                Alert.alert(
                  '추가 확인',
                  getAlarmBodyString(props.date, title, content, cost),
                  [
                    {
                      text: '취소',
                    },
                    {
                      text: '확인',
                      onPress: () => {
                        const data = {
                          date: getFormattedDate(props.date),
                          title,
                          content,
                          cost,
                        };
                        props
                          .add(data)
                          .then(() => {
                            props.close();
                            props.refresh();
                          })
                          .catch(console.error);
                      },
                    },
                  ],
                );
              }}>
              <Text style={[styles.textAdd, styles.text]}>추가</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </DismissKeyboard>
  );
}

export default App;
