import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';

function SignIn(props) {
  const [show, setShow] = useState(props.show);
  useEffect(() => {
    setShow(props.show);
  }, [props.show]);
  if (!show) {
    return null;
  }
  console.log(show);
  return (
    <View>
      <Text>이름</Text>
      <TextInput />
      <TouchableOpacity>
        <Text>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SignIn;
