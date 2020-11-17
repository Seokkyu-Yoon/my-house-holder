import firestore from '@react-native-firebase/firestore';

const COLLECTION = 'ledger';

async function get(user, data) {
  const doucmentSnapshot = await firestore()
    .collection(COLLECTION)
    .where('uid', '==', user.uid)
    .where('date', '==', data.date);

  const {docs} = await doucmentSnapshot.get();
  return await Promise.all(
    docs.map(async (doc) => {
      const docData = await doc.data();
      return {
        id: doc.id,
        ...docData,
      };
    }),
  );
}

/**
 * This function add firebase.income
 * @param {Object} user
 * @param {String} user.uid
 * @param {Date} data.date
 * @param {String} data.title
 * @param {String} data.content
 * @param {Number} data.cost
 */
async function add(user, data) {
  if (typeof data !== 'object') {
    throw new Error('type of expenditure data must object');
  }
  if (typeof data.date !== 'string') {
    throw new Error('data.date is not allowed');
  }
  if (typeof data.title !== 'string' || data.title === '') {
    throw new Error('data.title is not allowed');
  }
  if (typeof data.content !== 'string') {
    throw new Error('data.content is not allowed');
  }
  if (typeof data.cost !== 'number') {
    throw new Error('data.cost not allowed');
  }
  await firestore().collection(COLLECTION).add({
    uid: user.uid,
    date: data.date,
    title: data.title,
    content: data.content,
    cost: data.cost,
  });
}

async function update(docId, data) {
  const updateData = {};
  if (typeof data !== 'object') {
    throw new Error('type of expenditure data must object');
  }
  if (typeof data.date === 'string') {
    updateData.date = data.date;
  }
  if (typeof data.title === 'string' || data.title !== '') {
    updateData.title = data.title;
  }
  if (typeof data.content === 'string') {
    updateData.content = data.content;
  }
  if (typeof data.cost === 'number') {
    updateData.cost = data.cost;
  }
  await firestore().collection(COLLECTION).doc(docId).update(updateData);
}

async function remove(docId) {
  await firestore().collection(COLLECTION).doc(docId).delete();
}

export default {
  get,
  add,
  update,
  remove,
};
