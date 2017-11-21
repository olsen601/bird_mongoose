var moment = require('moment');

function formatDate(date) {

  m = moment.utc(date);

  return m.parseZone().format('dddd, MMMM Do YYYY, h:mm a');
}

function length(array) {
  return array.length;
}

module.exports = {
  formatDate : formatDate,
  length: length
}
