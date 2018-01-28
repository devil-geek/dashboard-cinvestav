angular.module('app')
.controller('appCtrl', function($scope, $timeout){
        function displayTime() {
            $scope.clock = moment().format('HH:mm:ss');
            $timeout(displayTime, 1000);
        }

        displayTime();

})