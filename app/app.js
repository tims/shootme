'use strict';

angular.module('shootme', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/ends/new', {
        templateUrl: 'partials/end.html',
        controller: 'EndController'
      })
      .when('/scorecards/:scorecardId/ends/:endId', {
        templateUrl: 'partials/end.html',
        controller: 'EndController'
      })
      .when('/login', {
        templateUrl: 'partials/login/login.html',
        controller: 'LoginController'
      })
      .when('/scorecards/:scorecardId', {
        templateUrl: 'partials/scorecard.html',
        controller: 'ScorecardController'
      })
      .when('/users/:userId', {
        templateUrl: 'partials/profile/profile.html',
        controller: 'ProfileController'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });

//'https://shootme-api.herokuapp.com/api'
angular.module('shootme').value('configuration', {
  apiUrl: 'https://shootme-api.herokuapp.com/api'
});
//'http://localhost:8001/api'
