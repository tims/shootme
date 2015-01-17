'use strict';

angular.module('shootme')
  .controller('LoginController', function ($http, $location, $scope, configuration) {
    $http({
      method: 'GET',
      url: configuration.apiUrl + '/users'
    }).then(function(response){
      $scope.users = response.data;
    });

    $scope.handleSubmit = function() {
      if ($scope.selectedUser) {
        $location.path('/users/' + $scope.selectedUser.id);
      }
    }
  });
