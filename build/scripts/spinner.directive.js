'use strict';

angular.module('shootme')
  .directive('spinner', function (spinnerService) {
    return {
      scope: {
        key: '@'
      },
      template: '<div class="spinner" ng-class="{spinning: spinning}"><div ng-if="spinning" class="spinner__background"></div></div>',
      link: function ($scope, element) {
        var target = element.find('.spinner').get(0);
        var spinner = new Spinner({
          radius: 10,
          width: 3,
          length: 5
        });

        $scope.$watch('spinning', function (spinning) {
          if (spinning) {
            spinner.spin(target);
          } else {
            spinner.stop(target);
          }
        });

        spinnerService.spinningProperty($scope.key).onValue(function (val) {
          $scope.spinning = val;
        });
      }
    };
  });
