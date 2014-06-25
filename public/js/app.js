'use strict';


// Declare app level module which depends on filters, and services
angular.module('medicRackApp', [
  'ngRoute',
  'medicRackApp.services',
  'medicRackApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {templateUrl: 'partials/search.html', controller: 'searchController'});
  $routeProvider.when('/createBill', {templateUrl: 'partials/bill.html', controller: 'createBillController'});
  $routeProvider.when('/add', {templateUrl: 'partials/add.html', controller: 'addController'});
  $routeProvider.otherwise({redirectTo: '/search'});
}])
// Click to navigate
// similar to <a href="#/partial"> but hash is not required, 
// e.g. <div click-link="/partial">
.directive('clickLink', ['$location', function($location) {
    return function(scope, element, attrs) {
        element.on('click', function() {
            scope.$apply(function() {
                $location.path(attrs.clickLink);
            });
        });
    }
}]);
