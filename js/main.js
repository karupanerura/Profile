// CONSTANTS
var CPAN_AUTHOR      = "KARUPA";
var CPAN_AUTHOR_API  = "http://api.metacpan.org/v0/author/:author";
var GITHUB_USERNAME  = "karupanerura";
var GITHUB_REPOS_API = "https://api.github.com/users/:username/repos";

var Profile = angular.module('Profile', ["ngResource"]);

function calcAge(year, month, day) {
  var now      = new Date();
  var birthday = new Date(year, month - 1, day, 0, 0, 0);
  return Math.floor(
    now.getFullYear() - birthday.getFullYear()
      + (
        (now.getMonth() >= birthday.getMonth()) ?
        (now.getDate()  >= birthday.getDate())  ?
          0: -1: -1
      )
  );
}

Profile.controller('Spec', [
    '$scope',
    function ($scope) {
      $scope.age = calcAge(1990, 11, 21);
    }
]);

Profile.controller('Github', [
    '$scope', '$resource',
    function ($scope, $resource) {
      $scope.username = GITHUB_USERNAME;
      $scope.repos    = $resource(GITHUB_REPOS_API, { username: GITHUB_USERNAME, sort: "updated" }, { isArray: true }).query();
    }
]);

Profile.controller('CPAN', [
    '$scope', '$resource',
    function ($scope, $resource) {
      $scope.author = CPAN_AUTHOR;
      $scope.cpan   = $resource(CPAN_AUTHOR_API, { author: CPAN_AUTHOR, join: "release" }).get();

      $scope.recentModule = function (module) {
        var date = new Date(module._source.date);
        return date.getTime();
      };
    }
]);
