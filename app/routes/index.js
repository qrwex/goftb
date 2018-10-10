const {
  getPlaces,
  getCount,
  search,
  getStats
} = require('../actions').battles

const app = module.exports = require('express')()

app.get('/', (req, res) => {
  res.send({ msg: 'Hi! Server is up and running.' })
})

// returns list(array) of all the places where battle has taken place.
app.get('/list', (req, res) => {
  getPlaces()
    .then((places) => {
      res.send(places)
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to get a list of all the places where battle has taken place.', err })
    })
})

// returns total number of battle occurred.
app.get('/count', (req, res) => {
  getCount()
    .then((count) => {
      res.send({ total: count })
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to get a total number of battle occurred.', err })
    })
})

// search for <king, type, location>
app.get('/search', (req, res) => {
  search(req.query)
    .then((result) => {
      res.send(result)
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to search for a query.', err })
    })
})

// returns statistics
app.get('/stats', (req, res) => {
  getStats()
    .then((result) => {
      res.send(result)
    })
    .catch(err => {
      res.status(400).send({ msg: 'Failed to get statistics.', err })
    })
})
