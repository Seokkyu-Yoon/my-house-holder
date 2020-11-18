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

function getMonthDates(year, month) {
  const dates = [];
  const strYear = String(year).padStart(4, '0');
  const strMonth = String(month).padStart(2, '0');
  const from = new Date(`${strYear}-${strMonth}-01`);

  do {
    dates.push(getFormattedDate(from));
    from.setDate(from.getDate() + 1);
  } while (from.getDate() > 1);

  return dates;
}
export {getStrYear, getStrMonth, getStrDate, getFormattedDate, getMonthDates};

export default {
  getStrYear,
  getStrMonth,
  getStrDate,
  getFormattedDate,
  getMonthDates,
};
