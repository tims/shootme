'use strict';

angular.module('shootme')
  .directive('newend', function () {
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

    var InputEntries = React.createClass({
      getInitialState: function() {
        return {
          scores: [],
          activeScore: 0
        };
      },

      handleAddScore: function(score) {
        if (this.state.scores.length < 6) {
          this.state.scores.push(score);
          this.setState({
            scores: _.sortBy(this.state.scores, function(d) {return -d}),
            activeScore: this.state.activeScore + 1
          });
        }
      },

      handleDone: function() {
        this.setState(this.getInitialState());
      },

      render: function () {
        var state = this.state;
        var entries = _.map(_.range(6), function (i) {
          var score = (i < state.scores.length) ? state.scores[i] : '_';
          var className = 'endinput__entry endinput__entry--' + getRing(score);
          if (state.activeScore === i) {
            className += ' endinput__entry--active';
          }
          return <div className="pure-u-1-6">
            <div className={className}>{score}</div>
          </div>;
        });

        return <div className="pure-g endinput">
          {entries}
        </div>
      }
    });

    var InputPage = React.createClass({
      handleAddScore: function(score) {
        this.refs.inputEntries.handleAddScore(score);
      },

      render: function () {
        var self = this;
        var numpadButtons = _.map(_.range(0, 11), function (i) {
          i = 10 - i;
          return <div className="pure-u-1-4">
            <div className={'numpad__button numpad__button--' + getRing(i)} onClick={function() {self.handleAddScore(i)}}>{i}</div>
          </div>
        });

        return <div>
          <InputEntries ref="inputEntries" />
          <a href="/#/scorecard" className="pure-u-1 pure-button button-success">Done</a>
          <div className="pure-g numpad">
            {numpadButtons}
          </div>
        </div>
      }
    });

    return {
      scope: {},
      link: function ($scope, element) {
        var root = $(element).get(0);

        React.render(<InputPage />, root);
      }
    }
  });

