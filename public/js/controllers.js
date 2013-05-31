'use strict';

/* Controllers */

function AppCtrl($scope, $http) {
	$scope.user = null;
	$http({method: 'GET', url: '/api/name'}).
		success(function(data, status, headers, config) {
		$scope.name = data.name;
	}).
	error(function(data, status, headers, config) {
		$scope.name = 'Error!'
	});
}

function LoginCtrl($scope, $rootScope, $http, $location) {
	$scope.authenticate = function(userName, password) {
		var params = { userName: userName, password: password };
		$http.post("/auth/authenticate", params)
			.success(function(data, status, headers, config) {
				$rootScope.user = userName;
				$scope.error = null;
				$location.path("/index");
			})
			.error(function(data, status, headers, config) {
				$scope.error = data.error;
			});
  	}

  	$scope.register = function(userName, email, password) {
  		var params = { userName: userName, email: email, password: password };
  		$http.post("/auth/register", params)
			.success(function(data, status, headers, config) {
				debugger
				$rootScope.user = userName;
				$scope.error = null;
				$location.path("/index");
			})
			.error(function(data, status, headers, config) {
				$scope.error = data.error;
			});
  	}

  	$scope.logout = function() {
		$rootScope.user = null;
  		$location.path("/index");
  	}
}
LoginCtrl.$inject = ['$scope', '$rootScope', '$http', '$location'];


function MyCtrl1() {  
}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
