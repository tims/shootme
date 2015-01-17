angular.module('shootme')
  .factory('apiService', function ($http, configuration) {
    return {
      getUser: function (userId) {
        return $http({
          method: 'GET',
          url: configuration.apiUrl + '/users/' + userId
        }).then(function (response) {
          var user = response.data;
          _.forEach(user.scorecards, function (scorecard) {
            scorecard.date = moment(scorecard.date);
          });
          return user;
        });
      },

      createScorecard: function (userId) {
        return $http({
          method: 'POST',
          url: configuration.apiUrl + '/scorecards',
          data: {
            userId: userId,
            date: moment().format('YYYY-MM-DD')
          }
        });
      },

      getEnd: function (scorecardId, endId) {
        return $http({
          method: 'GET',
          url: configuration.apiUrl + '/scorecards/' + scorecardId + '/ends/' + endId
        }).then(function (response) {
          var end = response.data;
          end.scores = _.map(end.scores.split(','), function (i) {
            return parseInt(i)
          });
          return end;
        });
      },

      deleteEnd: function (scorecardId, endId) {
        return $http({
          method: 'DELETE',
          url: configuration.apiUrl + '/scorecards/' + scorecardId + '/ends/' + endId
        });
      }
    };
  });
