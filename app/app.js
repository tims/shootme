'use strict';

angular.module('shootme', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/end', {
        templateUrl: 'partials/end.html',
        controller: 'EndController'
      })
      .when('/scorecard', {
        templateUrl: 'partials/scorecard.html',
        controller: 'ScorecardController'
      })
      .otherwise({
        redirectTo: '/scorecard'
      });
  })
;
