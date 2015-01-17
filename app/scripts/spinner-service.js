angular.module('shootme')
  .factory('spinnerService', function () {
    var getSpinningStatus = _.memoize(function(key) {
      var bus = new Bacon.Bus();
      var prop = bus.toProperty(false);
      return {
        key: key,
        bus: bus,
        prop: prop
      };
    });

    return {
      spinningProperty: function(spinnerName) {
        return getSpinningStatus(spinnerName).prop;
      },

      spinner: function (spinnerName, promise) {
        var status = getSpinningStatus(spinnerName);
        status.bus.push(true);
        return promise.finally(function () {
          status.bus.push(false);
        });
      }
    };
  });
