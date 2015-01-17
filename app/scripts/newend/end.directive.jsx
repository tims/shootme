'use strict';

angular.module('shootme')
  .directive('end', function ($http, $location, configuration, spinnerService) {
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

    var End = React.createClass({
      getInitialState: function () {
        return {
          scores: this.props.scores || [],
          activeScore: 0
        };
      },

      handleAddScore: function (score) {
        if (this.state.activeScore <= this.state.scores.length && this.state.activeScore < 6) {
          this.state.scores[this.state.activeScore] = score;
          this.state.activeScore += 1;
        } else if (this.state.scores.length < 6) {
          this.state.scores.push(score);
          this.state.activeScore += 1;
        }
        this.setState(this.state)
      },

      handleActivate: function (i) {
        if (i < this.state.scores.length) {
          this.setState({activeScore: i});
        }
      },

      render: function () {
        if (_.isEmpty(this.state.scores) && !_.isEmpty(this.props.scores)) {
          this.state.scores = this.props.scores;
        }

        var self = this;
        var state = this.state;
        var entries = _.map(_.range(6), function (i) {
          var score = (i < state.scores.length) ? state.scores[i] : '_';
          var className = 'endinput__entry endinput__entry--' + getRing(score);
          if (state.activeScore === i) {
            className += ' endinput__entry--active';
          }
          return <div className="pure-u-1-6">
            <div className={className} onClick={function () {
              self.handleActivate(i)
            }}>{score}</div>
          </div>;
        });

        return <div className="pure-g endinput">
          {entries}
        </div>
      }
    });

    var EndPage = React.createClass({
      handleAddScore: function (score) {
        this.refs.end.handleAddScore(score);
      },

      handleDone: function () {
        console.log('handleDone!');
        this.submitEnd();
      },

      submitEnd: _.debounce(function () {
        console.log('submitEnd!');
        console.log('Api url', configuration.apiUrl);
        var props = this.props;
        var url = configuration.apiUrl + '/scorecards/' + props.scorecardId +'/ends';
        if (props.id) {
          url += '/' + props.id;
        }
        var scores = _.sortBy(this.refs.end.state.scores, function(i) {return -i});
        console.log('posting!', url);
        spinnerService.spinner('main',
        $http({
          method: 'POST',
          url: url,
          data: {
            distance: 70,
            scores: scores
          }
        }).then(function () {
          $location.path('/scorecards/' + props.scorecardId);
        }));
      }, 1000, {leading: true}),

      render: function () {
        var self = this;

        var numpadButtons = _.map(_.range(0, 11), function (i) {
          i = 10 - i;
          return <div className="pure-u-1-4">
            <div className={'numpad__button numpad__button--' + getRing(i)} onClick={function () {
              self.handleAddScore(i)
            }}>{i}</div>
          </div>
        });

        return <div>
          <End ref="end" scores={this.props.scores} />
          <button onClick={this.handleDone} className="pure-u-1 pure-button button-success">Done</button>
          <div className="pure-g numpad">
            {numpadButtons}
          </div>
        </div>
      }
    });

    return {
      scope: {
        id: '=',
        scorecardId: '=',
        scores: '='
      },

      link: function ($scope, element) {
        var root = $(element).get(0);
        var component = React.render(<EndPage id={$scope.id} scorecardId={$scope.scorecardId} />, root);

        $scope.$watch('scores', function () {
          console.log('.'+$scope.id +',' +$scope.scorecardId+'.');
          console.log($scope.scores);

          component.setProps({id: $scope.id, scorecardId: $scope.scorecardId, scores: $scope.scores});
        });

      }
    }
  });

