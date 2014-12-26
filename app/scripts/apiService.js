angular.module('shootme')
  .factory('apiService', function ($http, configuration) {
    return {
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
          url: 'http://localhost:3001/api/scorecards/' + scorecardId + '/ends/' + endId
        });
      }
    };
  });
