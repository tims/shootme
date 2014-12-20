'use strict';

angular.module('shootme')
  .controller('ProfileController', function ($http, $scope, $routeParams) {
    var userId = $routeParams.userId;

    function fetchUser() {
      $http({
        method: 'GET',
        url: 'http://localhost:3001/api/users/' + userId
      }).then(function(response){
        var user = response.data;
        _.forEach(user.scorecards, function(scorecard) {
          scorecard.date = moment(scorecard.date);
        });
        $scope.user = user;
      });
    }

    fetchUser();

    $scope.addNewScorecard = function() {
      $http({
        method: 'POST',
        url: 'http://localhost:3001/api/scorecards',
        data: {
          userId: userId,
          date: moment().format('YYYY-MM-DD')
        }
      }).then(function(response){
        fetchUser();
      });
    };
  });
