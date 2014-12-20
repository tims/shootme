'use strict';

angular.module('shootme')
  .controller('LoginController', function ($http, $location, $scope) {
    $http({
      method: 'GET',
      url: 'http://localhost:3001/api/users'
    }).then(function(response){
      $scope.users = response.data;
    });

    $scope.handleSubmit = function() {
      if ($scope.selectedUser) {
        $location.path('/users/' + $scope.selectedUser.id);
      }
    }
  });
