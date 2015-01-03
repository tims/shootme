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

angular.module('shootme').value('configuration', {
  apiUrl: '/api'
});
