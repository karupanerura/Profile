"use strict";
var Profile = angular.module('Profile', ["ngResource"]);

Profile.constant('Setting', {
  CPAN_AUTHOR:       "KARUPA",
  CPAN_AUTHOR_API:   "http://api.metacpan.org/v0/author/:author",
  GITHUB_USERNAME:   "karupanerura",
  GITHUB_REPOS_API:  "https://api.github.com/users/:username/repos",
  GOOGLE_FEED_API:   "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0",
  SLIDESHARE_RSS:    "http://slideshare.rss.karupas.org/recent.rss",
  WEBLOG_RSS:        "http://weblog.rss.karupas.org/recent.rss",
  LASTFM_RECENT_RSS: "http://lastfm.rss.karupas.org/recent.rss",
  LASTFM_BEST_XML:   "http://lastfm.rss.karupas.org/best.xml?period=3month"
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

Profile.controller('Music', [
  '$scope', 'LastFmRecentApi', 'LastFmBestApi',
  function ($scope, LastFmRecentApi, LastFmBestApi) {
    $scope.lastfmRecent = LastFmRecentApi.get();
    $scope.lastfmBest   = LastFmBestApi.query();
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
  return $resource(Setting.GOOGLE_FEED_API, { q: Setting.SLIDESHARE_RSS, callback: 'JSON_CALLBACK' }, { get: { method: 'JSONP' } });
}]);

Profile.factory('WeblogApi', ['$resource', 'Setting', function ($resource, Setting) {
  return $resource(Setting.GOOGLE_FEED_API, { q: Setting.WEBLOG_RSS, callback: 'JSON_CALLBACK' }, { get: { method: 'JSONP' } });
}]);

Profile.factory('LastFmRecentApi', ['$resource', 'Setting', function ($resource, Setting) {
  return $resource(Setting.GOOGLE_FEED_API, { q: Setting.LASTFM_RECENT_RSS, callback: 'JSON_CALLBACK' }, { get: { method: 'JSONP' } });
}]);

Profile.factory('LastFmBestApi', ['$resource', 'Setting', function ($resource, Setting) {
  return $resource(Setting.LASTFM_BEST_XML, {}, {
    query: {
      method: 'GET',
      isArray: true,
      transformResponse: function (data, headersGetter) {
        var parser  = new DOMParser();
        var xml     = parser.parseFromString(data, "text/xml");
        var atrists = xml.getElementsByTagName("artist");

        var formatedData = [];
        for (var i = 0, l = atrists.length; i < l; i++) {
          var name      = (atrists[i].getElementsByTagName("name"))[0].innerHTML;
          var playcount = (atrists[i].getElementsByTagName("playcount"))[0].innerHTML;
          var url       = (atrists[i].getElementsByTagName("url"))[0].innerHTML;
          formatedData.push({ name: name, playcount: playcount, url: url });
        }

        return formatedData;
      }
    }
  });
}]);

Profile.factory('GithubReposApi', ['$resource', 'Setting', function ($resource, Setting) {
  return $resource(Setting.GITHUB_REPOS_API, { username: Setting.GITHUB_USERNAME, sort: "updated" });
}]);

Profile.factory('CpanAuthorApi', ['$resource', 'Setting', function ($resource, Setting) {
  return $resource(Setting.CPAN_AUTHOR_API, { author: Setting.CPAN_AUTHOR, join: "release" });
}]);
