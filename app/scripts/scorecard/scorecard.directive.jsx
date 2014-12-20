'use strict';

angular.module('shootme')
  .directive('scorecard', function ($http) {
    function getRing(score) {
      if (_.isNumber(score)) {
        switch (Math.ceil(score / 2)) {
          case 5:
            return 'gold';
          case 4:
            return 'red';
          case 3:
            return 'blue';
          case 2:
            return 'black';
          case 1:
            return 'white';
          default:
            return 'miss';
        }
      } else {
        return 'empty'
      }
    }

    var Scorecard = React.createClass({
      componentWillMount: function() {
        this.roundPromise = $http({
          method: 'GET',
          url: 'http://localhost:3001/api/scorecards/1'
        });
      },

      componentDidMount: function() {
        var self = this;
        this.roundPromise.then(function(response) {
          self.setState(response.data);
        });
      },

      getInitialState: function() {
        return {
          ends: []
        };
      },

      render: function () {
        var state = this.state;
        var ends = _.map(state.ends, function (end, i) {
          var endScores = _.map(end.scores, function(score) {
            return <div className="pure-u-1-6 end__score">{score}</div>
          });
          var endTotal = _.reduce(end.scores, function(acc,score){return acc + score;}, 0);
          var runningTotal = _.reduce(_.range(i+1), function(acc, j) {
            return acc + _.reduce(state.ends[j].scores, function(acc,score){return acc + score;}, 0);
          }, 0);
          return <div className="pure-u-1 pure-g end">

            <div className="pure-u-7-12 pure-g">
              <div id={end.id} className="pure-g">
                {endScores}
              </div>
              </div>
            <div className="pure-u-5-12 pure-g">
              <div className="pure-u-2-5 end__total">{endTotal}</div>
              <div className="pure-u-3-5 end__running-total">{runningTotal}</div>
              </div>
          </div>

        });

        return <div className="pure-g">
          {ends}
          <a href="/#/end" className="pure-u-1 pure-button button-success">Add an end</a>
        </div>
      }
    });

    return {
      scope: {
        id: '='
      },
      link: function ($scope, element) {
        var root = $(element).get(0);

        React.render(<Scorecard id={$scope.id}/>, root);
      }
    }
  });

