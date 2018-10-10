const express = require('express')
const routes = require('./routes/index')
const config = require('../config').server
const app = express()

app.use(routes)

app.listen(config.port, config.host, () => {
  console.log(`App running on http://${config.host}:${config.port}`)
})
