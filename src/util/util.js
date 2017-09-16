'use strict';

function chooseFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function nullFunction() {
  // NOP
}

module.exports = {
  chooseFrom,
  nullFunction
};
