const Battle = require('../models/Battle')
const {
  checkIfArraysHasIntersection,
  findMostFrequentArrayItem,
  getAverageOfAllValues
} = require('../helper/common')

function getPlaces () {
  return Battle.find().distinct('location', { 'location': { $ne: '' } })
}

function getCount () {
  return Battle.countDocuments({})
}

function search (query) {
  let selectQuery = {}

  const accepted = ['king', 'type', 'location']

  if (checkIfArraysHasIntersection(accepted, query)) {
    selectQuery = {
      $and: []
    }

    if (query.king) {
      selectQuery
        .$and
        .push({
          $or: [
            { defender_king: query.king },
            { attacker_king: query.king }]
        })
    }

    if (query.location) {
      selectQuery
        .$and
        .push({
          location: query.location
        })
    }

    if (query.type) {
      selectQuery
        .$and
        .push({
          battle_type: query.type
        })
    }
  }

  return Battle.find(selectQuery).lean().exec()
}

function getStats () {
  return new Promise((resolve, reject) => {
    Battle.find().lean().exec().then((list) => {
      const stats = {
        most_active: {
          attacker_king: findMostFrequentArrayItem(list.map(item => item.attacker_king)),
          defender_king: findMostFrequentArrayItem(list.map(item => item.defender_king)),
          region: findMostFrequentArrayItem(list.map(item => item.region))
        },
        attacker_outcome: {
          wins: list.filter((item) => item.attacker_outcome === 'win').length,
          loss: list.filter((item) => item.attacker_outcome === 'loss').length
        },
        battle_types: [...new Set((list.filter(item => item.battle_type)).map((item) => item.battle_type))],
        defender_size: {
          min: Math.min(...list.map(item => Number(item.defender_size))),
          max: Math.max(...list.map(item => Number(item.defender_size))),
          average: parseInt(getAverageOfAllValues(list.map(item => Number(item.defender_size))))
        }
      }

      resolve(stats)
    })
  })

}

module.exports = {
  getPlaces,
  getCount,
  search,
  getStats
}
