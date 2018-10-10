function findMostFrequentArrayItem (arr) {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length
    - arr.filter(v => v === b).length
  ).pop()
}

function checkIfArraysHasIntersection (array1, array2) {
  return Boolean(array1.some(v => Object.keys(array2).includes(v)))
}

function getAverageOfAllValues (arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

module.exports = {
  findMostFrequentArrayItem,
  checkIfArraysHasIntersection,
  getAverageOfAllValues
}
