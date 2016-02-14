"use strict";
var Profile = angular.module('Profile', ["ngResource"]);

Profile.constant('Setting', {
  CPAN_AUTHOR:      "KARUPA",
  CPAN_AUTHOR_API:  "https://api.metacpan.org/v0/author/:author",
  GITHUB_USERNAME:  "karupanerura",
  GITHUB_REPOS_API: "https://api.github.com/users/:username/repos",
  GOOGLE_FEED_API:  "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0",
  SLIDESHARE_RSS:   "http://www.slideshare.net/rss/user/karupanerura",
  WEBLOG_RSS:       "http://techblog.karupas.org/rss"
});

Profile.controller('Spec', [
  '$scope', 'calcAge',
  function ($scope, calcAge) {
    $scope.age = calcAge(1990, 11, 21);
  }
]);

Profile.controller('Activity', [
  '$scope', 'SlideShareApi', 'WeblogApi',
  function ($scope, SlideShareApi, WeblogApi) {
    $scope.slideshare = SlideShareApi.get();
    $scope.weblog     = WeblogApi.get();
  }
]);

Profile.controller('Github', [
  '$scope', 'Setting', 'GithubReposApi',
  function ($scope, Setting, GithubReposApi) {
    $scope.username = Setting.GITHUB_USERNAME;
    $scope.repos    = GithubReposApi.query();
  }
]);

Profile.controller('CPAN', [
  '$scope', 'Setting', 'CpanAuthorApi',
  function ($scope, Setting, CpanAuthorApi) {
    $scope.author = Setting.CPAN_AUTHOR;
    $scope.cpan   = CpanAuthorApi.get();

    $scope.recentModule = function (module) {
      var date = new Date(module._source.date);
      return date.getTime();
    };
  }
]);

Profile.factory('calcAge', function () {
  return function (year, month, day) {
    var now      = new Date();
    var birthday = new Date(year, month - 1, day, 0, 0, 0);
    return (
      now.getFullYear() - birthday.getFullYear()
        + (
          (now.getMonth() >  birthday.getMonth())                                        ? 0 :
          (now.getMonth() == birthday.getMonth() && now.getDate() >= birthday.getDate()) ? 0 :
            -1
        )
    );
  };
});

Profile.factory('SlideShareApi', ['$resource', 'Setting', function ($resource, Setting) {
  return $resource(Setting.GOOGLE_FEED_API, { q: Setting.SLIDESHARE_RSS, callback: 'JSON_CALLBACK', num: 7 }, { get: { method: 'JSONP' } });
}]);

Profile.factory('WeblogApi', ['$resource', 'Setting', function ($resource, Setting) {
  return $resource(Setting.GOOGLE_FEED_API, { q: Setting.WEBLOG_RSS, callback: 'JSON_CALLBACK', num: 7 }, { get: { method: 'JSONP' } });
}]);

Profile.factory('GithubReposApi', ['$resource', 'Setting', function ($resource, Setting) {
  return $resource(Setting.GITHUB_REPOS_API, { username: Setting.GITHUB_USERNAME, sort: "updated" });
}]);

Profile.factory('CpanAuthorApi', ['$resource', 'Setting', function ($resource, Setting) {
  return $resource(Setting.CPAN_AUTHOR_API, { author: Setting.CPAN_AUTHOR, join: "release" });
}]);
