/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Alert, Text, View} from 'react-native';

import auth from '@react-native-firebase/auth';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

import RNExitApp from 'react-native-exit-app';

import env from './env';
import firebase from './firebase';
import {SignIn} from './components';

GoogleSignin.configure({
  webClientId: env.google.webclientId,
  offlineAccess: true,
});

async function signInGoogle() {
  await GoogleSignin.hasPlayServices();
  const {idToken} = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  auth().signInWithCredential(googleCredential);
}

const ErrorHandler = {};
ErrorHandler[statusCodes.SIGN_IN_CANCELLED] = {
  display: Alert.alert,
  title: '구글 플레이 오류',
  body: '구글 플레이로 로그인해야 합니다',
  buttons: [{text: '확인', onPress: () => RNExitApp.exitApp()}],
};
ErrorHandler[statusCodes.PLAY_SERVICES_NOT_AVAILABLE] = {
  display: Alert.alert,
  title: '구글 플레이 오류',
  body: '구글 플레이로 서비스가 지원되지 않습니다',
  buttons: [{text: '확인', onPress: () => RNExitApp.exitApp()}],
};
ErrorHandler[statusCodes.IN_PROGRESS] = {
  display: console.log,
  title: '이미 로그인 중',
  body: '',
  buttons: '',
};

signInGoogle().catch((err) => {
  const handledError = ErrorHandler[err.code];
  if (typeof handledError === 'undefined') {
    console.error(err);
    return;
  }
  handledError.display(
    handledError.title,
    handledError.body,
    handledError.buttons,
  );
});

function App() {
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const subscriber = auth().onAuthStateChanged((authUser) => {
      if (user !== null) {
        return subscriber;
      }
      firebase.user
        .exists(authUser)
        .then((isExists) => {
          if (unmounted) {
            return subscriber;
          }
          console.log(isExists);
          setShowSignIn(!isExists);
        })
        .catch(console.error);
      setUser(authUser);
    });

    return () => {
      unmounted = true;
      subscriber;
    };
  }, [user]);

  if (user === null) {
    return <View />;
  }
  return (
    <SafeAreaView>
      <SignIn show={showSignIn} />
      <View>
        <Text>힝..</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
