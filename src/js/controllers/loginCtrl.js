angular.module('app')
.controller('loginCtrl', function($scope, $state){
	$scope.Login = function(){
		$state.go('app.main')
	}	
})