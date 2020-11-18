import firestore from '@react-native-firebase/firestore';

const COLLECTION = 'ledger';

async function processDocs(user, docs) {
  const processedData = [];
  for (const doc of docs) {
    const docData = await doc.data();
    if (docData.uid !== user.uid) {
      continue;
    }
    processedData.push({
      id: doc.id,
      ...docData,
    });
  }
  processedData.sort((a, b) => a.timestamp - b.timestamp);
  return processedData;
}
async function get(user, data) {
  const documentSnapshot = await firestore()
    .collection(COLLECTION)
    .where('date', '==', data.date);

  const {docs} = await documentSnapshot.get();
  const result = await processDocs(user, docs);
  return result;
}

async function getMonthly(user, data) {
  const strYear = String(data.year).padStart(4, '0');
  const strMonth = String(data.month).padStart(2, '0');

  const from = new Date(`${strYear}-${strMonth}-01T00:00:00Z`);
  const to = new Date(from);
  to.setMonth(data.month);

  const documentSnapshot = await firestore()
    .collection(COLLECTION)
    .where('timestamp', '<', to)
    .where('timestamp', '>', from);

  const {docs} = await documentSnapshot.get();
  const result = await processDocs(user, docs);
  return result;
}

async function getYearly(user, data) {
  const strYear = String(data.year).padStart(4, '0');

  const from = new Date(`${strYear}-01-01T00:00:00Z`);
  const to = new Date(from);
  to.setFullYear(from.getFullYear() + 1);

  const documentSnapshot = await firestore()
    .collection(COLLECTION)
    .where('timestamp', '<', to)
    .where('timestamp', '>', from);

  const {docs} = await documentSnapshot.get();
  const result = await processDocs(user, docs);
  return result;
}
/**
 * This function add firebase
 * @param {Object} user
 * @param {String} user.uid
 * @param {Date} data.date
 * @param {String} data.title
 * @param {String} data.content
 * @param {Number} data.cost
 */
async function add(user, data) {
  if (typeof data !== 'object') {
    throw new Error('type of data must object');
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
    timestamp: new Date(),
  });
}

async function update(docId, data) {
  const updateData = {};
  if (typeof data !== 'object') {
    throw new Error('type of data must object');
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
  getMonthly,
  getYearly,
  add,
  update,
  remove,
};
