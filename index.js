const express = require('express');
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash');
mongoose.connect('mongodb://127.0.0.1:27017/goftb');

const Schema = mongoose.Schema;
const Battle = mongoose.model('Battle', new Schema);

// returns list(array) of all the places where battle has taken place.
app.get('/list', (req, res) => {
  Battle.find().distinct('location', {'location': {$ne: ''}}, (err, list) => {
    err ? res.send({err}) : res.send(list);
  });
});

// returns total number of battle occurred.
app.get('/count', (req, res) => {
  Battle.count({}, (err, count) => {
    err ? res.send({err}) : res.send(count);
  });
});

// returns statistics
app.get('/stats', (req, res) => {
  Battle.find({}).lean().exec((err, list) => {
    let occurrences = {
      attacker_kings: [],
      defender_kings: [],
      regions: []
    };

    _.forEach(list, (item, key) => {
      list[key].defender_size = item.defender_size || 0;
      occurrences.attacker_kings.push(item.attacker_king);
      occurrences.defender_kings.push(item.defender_king);
      occurrences.regions.push(item.region);
    });

    let mostFreq = (arr) => {
      let max = 0, result, freq = 0, list = arr.sort();
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === arr[i + 1]) {
          freq++;
        } else {
          freq = 0;
        }
        if (freq > max) {
          result = arr[i];
          max = freq;
        }
      }
      return result;
    };

    let stats = {
      most_active: {
        attacker_king: mostFreq(occurrences.attacker_kings),
        defender_king: mostFreq(occurrences.defender_kings),
        region: mostFreq(occurrences.regions)
      },
      attacker_outcome: {
        wins: _.filter(list, {'attacker_outcome': 'win'}).length,
        loss: _.filter(list, {'attacker_outcome': 'loss'}).length
      },
      battle_types: _.remove(_.transform(_.uniqBy(list, 'battle_type'), (result, o) => result.push(o.battle_type), []), (n) => n !== ''),
      defender_size: {
        min: _.minBy(list, 'defender_size').defender_size,
        max: _.maxBy(list, 'defender_size').defender_size,
        average: parseInt(_.meanBy(list, 'defender_size'))
      }
    };
    res.send(stats);
  });
});

// search for <king, type, location>
app.get('/search', (req, res) => {
  let selectQuery = {}, accepted = ['king', 'type', 'location'];

  if (accepted.some(v => _.keys(req.query).includes(v))) {
    selectQuery = {
      $and: []
    };

    if (req.query.king) {
      selectQuery.$and.push({$or: [{defender_king: req.query.king}, {attacker_king: req.query.king}]});
    }

    if (req.query.location) {
      selectQuery.$and.push({location: req.query.location});
    }

    if (req.query.type) {
      selectQuery.$and.push({battle_type: req.query.type});
    }
  }

  Battle.find(selectQuery).lean().exec((err, list) => {
    err ? res.send({err}) : res.send(list);
  });
});

app.use((req, res) => {
  res.send(404);
});

app.listen(3000);
