import firestore from '@react-native-firebase/firestore';

const COLLECTION = 'income';
async function exists(user) {
  const doucmentSnapshot = await firestore()
    .collection(COLLECTION)
    .doc(user.uid)
    .get();
  return doucmentSnapshot.exists;
}

/**
 * This function add firebase.income
 * @param {Object} user
 * @param {String} user.uid
 * @param {Date} data.date
 * @param {Number} data.cost
 * @param {String} data.title
 * @param {String} data.content
 */
async function add(user, data) {
  await firestore()
    .collection(COLLECTION)
    .add({
      uid: user.uid,
      ...data,
    });
}

/**
 * This function get user incomes
 * @param {Object} user
 * @param {String} user.uid
 */
async function get(user) {
  const doucmentSnapshot = await firestore()
    .collection(COLLECTION)
    .where('uid', '==', user.uid);
  return await doucmentSnapshot.get();
}

async function update(docId, data) {
  await firestore().collection(COLLECTION).doc(docId).update(data);
}

export default {
  exists,
  get,
  add,
  update,
};
