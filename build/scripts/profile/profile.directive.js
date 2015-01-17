'use strict';

angular.module('shootme')
  .directive('profile', function (spinnerService, apiService, $routeParams) {
    return {
      scope: {},
      templateUrl: 'partials/profile/profile-template.html',
      link: function ($scope) {
        function getUser() {
          spinnerService.spinner('main', apiService.getUser($routeParams.userId)).then(function(user) {
            return $scope.user = user;
          });
        }

        getUser();
        $scope.createScorecard = function () {
          apiService.createScorecard($routeParams.userId).then(getUser);
        };
      }
    };
  });
