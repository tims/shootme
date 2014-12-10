'use strict';

angular.module('shootme')
  .directive('scorecard', function () {
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
      getInitialState: function() {
        return {
          ends: [
            {
              distance: 70,
              scores: [8,8,8,6,6,5]
            },
            {
              distance: 70,
              scores: [9,7,6,6,6,5]
            },
            {
              distance: 70,
              scores: [10,9,9,6,5,4]
            },
            {
              distance: 70,
              scores: [10,7,7,7,6,6]
            }
          ]
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
              <div className="pure-g">
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
          <a href="/#/newend" className="pure-u-1 pure-button button-success">Add an end</a>
        </div>
      }
    });

    return {
      scope: {},
      link: function ($scope, element) {
        var root = $(element).get(0);

        React.render(<Scorecard />, root);
      }
    }
  });

