'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
		.when('/', {templateUrl: 'partials/index', controller: AppCtrl})
		.when('/login', {templateUrl: 'partials/login', controller: LoginCtrl})
		.when('/register', {templateUrl: 'partials/register', controller: LoginCtrl})
		.otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
  }]);