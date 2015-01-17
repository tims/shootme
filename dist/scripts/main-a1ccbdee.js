"use strict";angular.module("shootme",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngRoute"]).config(["$routeProvider",function(e){e.when("/ends/new",{templateUrl:"partials/end.html",controller:"EndController"}).when("/scorecards/:scorecardId/ends/:endId",{templateUrl:"partials/end.html",controller:"EndController"}).when("/login",{templateUrl:"partials/login/login.html",controller:"LoginController"}).when("/scorecards/:scorecardId",{templateUrl:"partials/scorecard.html",controller:"ScorecardController"}).when("/users/:userId",{templateUrl:"partials/profile/profile-view.html"}).otherwise({redirectTo:"/login"})}]),angular.module("shootme").value("configuration",{apiUrl:"https://shootme-api.herokuapp.com/api"}),angular.module("shootme").factory("apiService",["$http","configuration",function(e,t){return{getUser:function(n){return e({method:"GET",url:t.apiUrl+"/users/"+n}).then(function(e){var t=e.data;return _.forEach(t.scorecards,function(e){e.date=moment(e.date)}),t})},createScorecard:function(n){return e({method:"POST",url:t.apiUrl+"/scorecards",data:{userId:n,date:moment().format("YYYY-MM-DD")}})},getEnd:function(n,r){return e({method:"GET",url:t.apiUrl+"/scorecards/"+n+"/ends/"+r}).then(function(e){var t=e.data;return t.scores=_.map(t.scores.split(","),function(e){return parseInt(e)}),t})},deleteEnd:function(n,r){return e({method:"DELETE",url:t.apiUrl+"/scorecards/"+n+"/ends/"+r})}}}]),angular.module("shootme").directive("loggedInPage",["apiService","$routeParams",function(e,t){return{templateUrl:"partials/logged-in-page.html",transclude:!0,link:function(n){return e.getUser(t.userId).then(function(e){n.user=e})}}}]),angular.module("shootme").factory("spinnerService",function(){var e=_.memoize(function(e){var t=new Bacon.Bus,n=t.toProperty(!1);return{key:e,bus:t,prop:n}});return{spinningProperty:function(t){return e(t).prop},spinner:function(t,n){var r=e(t);return r.bus.push(!0),n.finally(function(){r.bus.push(!1)})}}}),angular.module("shootme").directive("spinner",["spinnerService",function(e){return{scope:{key:"@"},template:'<div class="spinner" ng-class="{spinning: spinning}"><div ng-if="spinning" class="spinner__background"></div></div>',link:function(t,n){var r=n.find(".spinner").get(0),o=new Spinner({radius:10,width:3,length:5});t.$watch("spinning",function(e){e?o.spin(r):o.stop(r)}),e.spinningProperty(t.key).onValue(function(e){t.spinning=e})}}}]),angular.module("shootme").controller("LoginController",["$http","$location","$scope","configuration",function(e,t,n,r){e({method:"GET",url:r.apiUrl+"/users"}).then(function(e){n.users=e.data}),n.handleSubmit=function(){n.selectedUser&&t.path("/users/"+n.selectedUser.id)}}]),angular.module("shootme").controller("NavbarCtrl",["$scope",function(e){e.date=new Date}]),angular.module("shootme").controller("EndController",["$scope","$location","$routeParams","apiService",function(e,t,n,r){e.scorecardId=n.scorecardId,"new"!==n.endId&&r.getEnd(n.scorecardId,n.endId).then(function(t){console.log(t),e.scores=t.scores,e.endId=t.id}),e.deleteEnd=function(){e.endId&&confirm("delete end?")&&r.deleteEnd(e.scorecardId,e.endId).then(function(){console.log("deleted end"+e.endId),t.path("/scorecards/"+e.scorecardId)}).catch(function(t){console.error("could not delete end "+e.endId,t)})}}]),angular.module("shootme").directive("end",["$http","$location","configuration",function(e,t,n){function r(e){if(!_.isNumber(e))return"empty";switch(Math.ceil(e/2)){case 5:return"gold";case 4:return"red";case 3:return"blue";case 2:return"black";case 1:return"white";default:return"miss"}}var o=React.createClass({displayName:"End",getInitialState:function(){return{scores:this.props.scores||[],activeScore:0}},handleAddScore:function(e){this.state.activeScore<=this.state.scores.length&&this.state.activeScore<6?(this.state.scores[this.state.activeScore]=e,this.state.activeScore+=1):this.state.scores.length<6&&(this.state.scores.push(e),this.state.activeScore+=1),this.setState(this.state)},handleActivate:function(e){e<this.state.scores.length&&this.setState({activeScore:e})},render:function(){_.isEmpty(this.state.scores)&&!_.isEmpty(this.props.scores)&&(this.state.scores=this.props.scores);var e=this,t=this.state,n=_.map(_.range(6),function(n){var o=n<t.scores.length?t.scores[n]:"_",s="endinput__entry endinput__entry--"+r(o);return t.activeScore===n&&(s+=" endinput__entry--active"),React.createElement("div",{className:"pure-u-1-6"},React.createElement("div",{className:s,onClick:function(){e.handleActivate(n)}},o))});return React.createElement("div",{className:"pure-g endinput"},n)}}),s=React.createClass({displayName:"EndPage",handleAddScore:function(e){this.refs.end.handleAddScore(e)},handleDone:function(){console.log("handleDone!"),this.submitEnd()},submitEnd:_.debounce(function(){console.log("submitEnd!"),console.log("Api url",n.apiUrl);var r=this.props,o=n.apiUrl+"/scorecards/"+r.scorecardId+"/ends";r.id&&(o+="/"+r.id);var s=_.sortBy(this.refs.end.state.scores,function(e){return-e});console.log("posting!",o),e({method:"POST",url:o,data:{distance:70,scores:s}}).then(function(){t.path("/scorecards/"+r.scorecardId)})},1e3,{leading:!0}),render:function(){var e=this,t=_.map(_.range(0,11),function(t){return t=10-t,React.createElement("div",{className:"pure-u-1-4"},React.createElement("div",{className:"numpad__button numpad__button--"+r(t),onClick:function(){e.handleAddScore(t)}},t))});return React.createElement("div",null,React.createElement(o,{ref:"end",scores:this.props.scores}),React.createElement("button",{onClick:this.handleDone,className:"pure-u-1 pure-button button-success"},"Done"),React.createElement("div",{className:"pure-g numpad"},t))}});return{scope:{id:"=",scorecardId:"=",scores:"="},link:function(e,t){var n=$(t).get(0),r=React.render(React.createElement(s,{id:e.id,scorecardId:e.scorecardId}),n);e.$watch("scores",function(){console.log("."+e.id+","+e.scorecardId+"."),console.log(e.scores),r.setProps({id:e.id,scorecardId:e.scorecardId,scores:e.scores})})}}}]),angular.module("shootme").directive("profile",["spinnerService","apiService","$routeParams",function(e,t,n){return{scope:{},templateUrl:"partials/profile/profile-template.html",link:function(r){function o(){e.spinner("main",t.getUser(n.userId)).then(function(e){return r.user=e})}o(),r.createScorecard=function(){t.createScorecard(n.userId).then(o)}}}}]),angular.module("shootme").controller("ScorecardController",["$http","$routeParams","$scope","$location","configuration",function(e,t,n,r,o){function s(e,t){return _.reduce(e,function(e,n){return t?e+t(n):e+n},0)}e({method:"GET",url:o.apiUrl+"/scorecards/"+t.scorecardId}).then(function(e){var t=e.data;n.scorecardId=t.id,n.date=moment(t.date),n.ends=_.map(t.ends,function(e,n){return console.log(e.scores),{id:e.id,distance:e.distance,total:s(e.scores),runningTotal:s(_.first(t.ends,n+1),function(e){return s(e.scores)}),scores:e.scores}})}),n.openEnd=function(e){console.log("/scorecards/"+n.scorecardId+"/ends/"+e),r.path("/scorecards/"+n.scorecardId+"/ends/"+e)}}]);