const config = require('../../config')
const mongoose = require('mongoose')
mongoose.connect(config.db, { useNewUrlParser: true })

const Schema = mongoose.Schema
const Battle = mongoose.model('Battle', new Schema)

module.exports = Battle
