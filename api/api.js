var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var _ = require('lodash');
var q = require('q');

var app = express();
app.use(cors());
app.use(bodyParser.json());

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
});

function serScores(arr) {
  return arr.join(',');
}

function deserScores(str) {
  return _.map(str.split(','), function (n) {
    return parseInt(n);
  });
}

function firstWhere(table, whereData) {
  var query = knex.first().from(table).where(whereData);
  return query.then(function (row) {
    if (!row) {
      throw 'No ' + table + ' found where ' + whereData;
    } else {
      return row;
    }
  });
}

function firstById(table, id) {
  return firstWhere(table, {id: id});
}

app.get('/api/users', function (req, res) {
  console.log(req.method, req.path);
  knex.select().from('users').then(function (users) {
    res.send(users);
  });
});

app.get('/api/users/:userId', function (req, res) {
  console.log(req.method, req.path);
  var userId = req.params.userId;
  q.all([
    firstById('users', userId),
    knex.select().from('scorecards').where({user_id: userId})
  ]).then(function (result) {
    var user = result[0];
    var scorecards = result[1];
    user.scorecards = scorecards;
    res.send(user);
  }).catch(function (error) {
    console.error(error);
    res.status(500);
    res.send(error);
  });
});


app.get('/api/scorecards/:scorecardId', function (req, res) {
  console.log(req.method, req.path);
  firstById('scorecards', req.params.scorecardId).then(function (scorecard) {
    knex.select().from('ends').where({'scorecard_id': req.params.scorecardId}).then(function (ends) {
      scorecard.ends = _.map(_.sortBy(ends, 'id'), function (end) {
        return {
          id: end.id,
          distance: end.distance,
          scores: deserScores(end.scores)
        }
      });

      res.send(scorecard);
    });
  }).catch(function (error) {
    res.status(500);
    res.send(error);
    console.error(error);
    throw error;
  });
});

app.post('/api/scorecards', function (req, res) {
  console.log(req.method, req.path);
  var data = req.body;

  firstById('users', data.userId).then(function (user) {
    return knex.insert({user_id: user.id, date: data.date}).into('scorecards');
  }).then(function (row) {
    res.send(row);
  }).catch(function (error) {
    console.error(error);
    res.status(500);
    res.send(error);
  });
});

app.delete('/api/scorecards/:scorecardId', function (req, res) {
  console.log(req.method, req.path);
  var data = req.body;
  //
  //q.all([
  //  getById('users', data.user_id),
  //  getById('scorecards', scorecardId)
  //
  //}).then(function (row) {
  //  console.log(row);
  //  res.send('OK');
  //}).catch(function (error) {
  //  console.error(error);
  //  res.status(500);
  //  res.send(error);
  //});
});


app.post('/api/scorecards/:scorecardId/ends', function (req, res) {
  console.log(req.method, req.path);

  if (req.body.scores.length !== 6 || !req.body.distance) {
    res.status(500);
    res.send('ERROR');
  } else {
    firstById('scorecards', req.params.scorecardId).then(function () {
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
  }
});

app.delete('/api/scorecards/:scorecardId/ends/:endId', function (req, res) {
  knex('ends').where({
    id: req.params.endId,
    scorecard_id: req.params.scorecardId
  }).delete().then(function() {
    res.send('OK');
  }).catch(function(error) {
    res.status(500);
    res.send(error);
  });

});

app.post('/api/scorecards/:scorecardId/ends/:endId', function (req, res) {
  console.log(req.method, req.path);

  if (req.body.scores.length !== 6 || !req.body.distance) {
    res.status(500);
    res.send('ERROR');
  } else {
    firstWhere('ends', {
      id: req.params.endId,
      scorecard_id: req.params.scorecardId
    }).then(function () {
      return knex('ends').where({
        id: req.params.endId,
        scorecard_id: req.params.scorecardId
      }).update({
        scores: serScores(req.body.scores),
        distance: req.body.distance
      });
    }).then(function () {
      res.send('OK');
    }).catch(function (error) {
      res.status(500);
      res.send(error);
    });
  }
});

app.get('/api/scorecards/:scorecardId/ends/:endId', function (req, res) {
  console.log(req.method, req.path);

  firstWhere('ends', {
    scorecard_id: req.params.scorecardId,
    id: req.params.endId
  }).then(function (end) {
    res.send(end);
  }).catch(function (error) {
    res.status(500);
    res.send(error);
  });
});


console.log('Listening on port 3001');
app.listen(3001);
