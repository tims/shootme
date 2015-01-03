'use strict';

angular.module('shootme')
  .controller('ScorecardController', function ($http, $routeParams, $scope, $location, configuration) {

    function sum(arr, callback) {
      return _.reduce(arr, function (acc, val) {
        if (callback) {
          return acc + callback(val);
        } else {
          return acc + val;
        }
      }, 0);
    }

    $http({
      method: 'GET',
      url: configuration.apiUrl + '/scorecards/' + $routeParams.scorecardId
    }).then(function (response) {
      var scorecard = response.data;
      $scope.scorecardId = scorecard.id;
      $scope.date = moment(scorecard.date);
      $scope.ends = _.map(scorecard.ends, function (end, i) {
        console.log(end.scores);
        return {
          id: end.id,
          distance: end.distance,
          total: sum(end.scores),
          runningTotal: sum(_.first(scorecard.ends, i + 1), function (end) {
            return sum(end.scores);
          }),
          scores: end.scores
        };
      });
    });

    $scope.openEnd = function (endId) {
      console.log('/scorecards/' + $scope.scorecardId + '/ends/' + endId);
      $location.path('/scorecards/' + $scope.scorecardId + '/ends/' + endId);
    }
  });
