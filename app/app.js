'use strict';

angular.module('shootme', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/newend', {
        templateUrl: 'partials/newend.html',
        controller: 'NewEndController'
      })
      .when('/scorecard', {
        templateUrl: 'partials/scorecard.html',
        controller: 'ScorecardController'
      })
      .otherwise({
        redirectTo: '/newend'
      });
  })
;
