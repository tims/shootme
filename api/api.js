var express = require('express');
var moment = require('moment');
var cors = require('cors')
var bodyParser = require('body-parser');
var _ = require('lodash');

var app = express();
app.use(cors());
app.use(bodyParser.json());

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
});

knex.schema.createTable('scorecards', function (table) {
  table.increments('id');
}).then();

knex.insert({}).into('scorecards').then();

knex.schema.createTable('ends', function (table) {
  table.increments('id');
  table.integer('scorecard_id').references('id').inTable('scorecards');
  table.integer('distance');
  table.json('scores');
}).then();

function serScores(arr) {
  return arr.join(',');
}

function deserScores(str) {
  return _.map(str.split(','), function (n) {
    return parseInt(n);
  });
}

function getScorecard(scorecardId) {
  return knex('scorecards').select().where({id: scorecardId}).then(function(rows) {
    if (rows.length != 1) {
      throw 'No scorecard with id ' + scorecardId;
    }
  });
}

knex('ends').insert({'scores': serScores([9, 8, 7, 6, 5, 4]), distance: 70, scorecard_id: 1}).then();


var rounds = {
  1: {
    date: moment().format('YYYY-MM-DD'),
    ends: []
  }
};


app.get('/:username', function (req, res) {
  res.send('OK');
});

app.get('/:username/rounds/:scorecardId', function (req, res) {
  getScorecard(req.params.scorecardId).then(function () {
    return knex.select()
      .from('ends')
      .where({'scorecard_id': req.params.scorecardId});
  }).then(function (rows) {
    console.log('rows',rows);
    res.send({
      id: req.params.roundId,
      ends: _.map(rows, function (row) {
        return {
          id: row.id,
          distance: row.distance,
          scores: deserScores(row.scores)
        }
      })
    });
  }).catch(function (error) {
    console.error(error);
    res.status(500);
    res.send(error);
  });
});


app.post('/:username/rounds/:scorecardId/ends', function (req, res) {
  console.log('POST', req.path, req.method);

  if (req.body.scores.length !== 6 || !req.body.distance) {
    res.status(500);
    res.send('ERROR');
    return;
  }

  getScorecard(req.params.scorecardId).then(function () {
    return knex('ends').insert({
      scores: serScores(req.body.scores),
      distance: req.body.distance,
      scorecard_id: req.params.scorecardId
    });
  }).then(function () {
    res.send('OK');
  }).catch(function (error) {
    res.status(500);
    res.send(error);
  });
});

app.listen(3001);
