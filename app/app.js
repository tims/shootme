'use strict';

angular.module('shootme', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/end', {
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
  })
;
