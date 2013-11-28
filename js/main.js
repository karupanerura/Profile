// CONSTANTS
var CPAN_AUTHOR       = "KARUPA";
var CPAN_AUTHOR_API   = "http://api.metacpan.org/v0/author/:author";
var GITHUB_USERNAME   = "karupanerura";
var GITHUB_REPOS_API  = "https://api.github.com/users/:username/repos";
var GOOGLE_FEED_API   = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0";
var SLIDESHARE_RSS    = "http://slideshare.rss.karupas.org/recent.rss";
var WEBLOG_RSS        = "http://weblog.rss.karupas.org/recent.rss";
var LASTFM_RECENT_RSS = "http://lastfm.rss.karupas.org/recent.rss";
var LASTFM_BEST_XML   = "http://lastfm.rss.karupas.org/best.xml?period=3month";

var Profile = angular.module('Profile', ["ngResource"]);

function calcAge(year, month, day) {
  var now      = new Date();
  var birthday = new Date(year, month - 1, day, 0, 0, 0);
  return (
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

Profile.controller('Activity', [
    '$scope', '$resource',
    function ($scope, $resource) {
      $scope.slideshare = $resource(GOOGLE_FEED_API, { q: SLIDESHARE_RSS, callback: 'JSON_CALLBACK' }, { get: { method: 'JSONP' } }).get();
      $scope.weblog     = $resource(GOOGLE_FEED_API, { q: WEBLOG_RSS,     callback: 'JSON_CALLBACK' }, { get: { method: 'JSONP' } }).get();
    }
]);

Profile.controller('Music', [
    '$scope', '$resource',
    function ($scope, $resource) {
      $scope.lastfmRecent = $resource(GOOGLE_FEED_API, { q: LASTFM_RECENT_RSS, callback: 'JSON_CALLBACK' }, { get: { method: 'JSONP' } }).get();
      $scope.lastfmBest   = $resource(LASTFM_BEST_XML, {}, {
        query: {
          transformResponse: function (data, headersGetter) {
            var parser  = new DOMParser();
            var xml     = parser.parseFromString(data, "text/xml");
            var atrists = xml.getElementsByTagName("artist");

            var formatedData = [];
            for (var i = 0, l = atrists.length; i < l; i++) {
              var name      = (atrists[i].getElementsByTagName("name"))[0];
              var playcount = (atrists[i].getElementsByTagName("playcount"))[0];
              var url       = (atrists[i].getElementsByTagName("url"))[0];
              formatedData.push({ name: name, playcount: playcount, url: url });
            }
            return formatedData;
          }
        }
      }).query();
    }
]);

Profile.controller('Github', [
    '$scope', '$resource',
    function ($scope, $resource) {
      $scope.username = GITHUB_USERNAME;
      $scope.repos    = $resource(GITHUB_REPOS_API, { username: GITHUB_USERNAME, sort: "updated" }).query();
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
