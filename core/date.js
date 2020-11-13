function getStrYear(date) {
  return `${date.getFullYear()}`.padStart(4, '0');
}
function getStrMonth(date) {
  return `${date.getMonth() + 1}`.padStart(2, '0');
}
function getStrDate(date) {
  return `${date.getDate()}`.padStart(2, '0');
}

function getFormattedDate(date) {
  return `${getStrYear(date)}-${getStrMonth(date)}-${getStrDate(date)}`;
}

export {getStrYear, getStrMonth, getStrDate, getFormattedDate};
console.log(exports);

export default {getStrYear, getStrMonth, getStrDate, getFormattedDate};
