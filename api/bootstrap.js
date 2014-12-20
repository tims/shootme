var moment = require('moment');
var _ = require('lodash');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
});
console.log('setup database');
knex.schema.createTable('users', function (table) {
  table.increments('id')
  table.string('name');
}).then();

knex.schema.createTable('scorecards', function (table) {
  table.increments('id');
  table.integer('user_id').references('id').inTable('users');
  table.string('date');
}).then();

knex.schema.createTable('ends', function (table) {
  table.increments('id');
  table.integer('scorecard_id').references('id').inTable('scorecards');
  table.integer('distance');
  table.json('scores');
}).then();

_.forEach(['tim','phil'], function(name) {
  knex.insert({name: name}).into('users').then();
});

console.log('done');
knex('users').select().then(function(users){
  console.log(users);
});

return;
