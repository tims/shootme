'use strict';

angular.module('shootme')
  .directive('loggedInPage', function (apiService, $routeParams) {
    return {
      templateUrl: 'partials/logged-in-page.html',
      transclude: true,
      link: function ($scope) {
        return apiService.getUser($routeParams.userId).then(function (user) {
          $scope.user = user;
        });
      }
    }
  });
