'use strict';

angular.module('shootme')
  .controller('EndController', function ($scope, $location, $routeParams, apiService) {
    $scope.scorecardId = $routeParams.scorecardId;
    if ($routeParams.endId !== "new") {
      apiService.getEnd( $routeParams.scorecardId,  $routeParams.endId).then(function (end) {
        console.log(end);
        $scope.scores = end.scores;
        $scope.endId = end.id;
      });
    }

    $scope.deleteEnd = function() {
      if ($scope.endId && confirm('delete end?')) {
        apiService.deleteEnd($scope.scorecardId, $scope.endId).then(function() {
          console.log('deleted end' + $scope.endId);
          $location.path('/scorecards/' + $scope.scorecardId);
        }).catch(function(reason) {
          console.error('could not delete end ' + $scope.endId, reason);
        });
      };
    };
  });
