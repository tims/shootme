'use strict';

angular.module('saltcog', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
