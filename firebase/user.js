import firestore from '@react-native-firebase/firestore';

async function exists(user) {
  const doucmentSnapshot = await firestore()
    .collection('users')
    .doc(user.uid)
    .get();
  return doucmentSnapshot.exists;
}

async function add(user, name) {
  await firestore().collection('users').doc(user.uid).set({name});
}

async function get(user) {
  const doucmentSnapshot = await firestore()
    .collection('users')
    .doc(user.uid)
    .get();
  return doucmentSnapshot.data();
}

async function update(user, data) {
  await firestore().collection('users').doc(user.uid).update(data);
}

export default {
  exists,
  get,
  add,
  update,
};
