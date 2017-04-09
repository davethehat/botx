'use strict';

function chooseFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = {
  chooseFrom: chooseFrom
};
