angular.module('app')
    .controller('sensorsCtrl', function($scope, $timeout) {
        $scope.slider = {
            minValue: 0,
            maxValue: 40,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                noSwitching: true,
                showSelectionBar: true
            }
        };

        $scope.slider2 = {
            minValue: 0,
            maxValue: 90,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                noSwitching: true,
                showSelectionBar: false
            }
        };

        $scope.slider3 = {
            minValue: 25,
            maxValue: 60,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                noSwitching: true
            }
        };

        $scope.slider4 = {
            minValue: 0,
            maxValue: 100,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                noSwitching: true
            }
        };

        $scope.slider5 = {
            minValue: 100,
            maxValue: 100,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                noSwitching: true
            }
        };

        $scope.slider6 = {
            minValue: 10,
            maxValue: 90,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                noSwitching: true
            }
        };

        $scope.slider7 = {
            minValue: 10,
            maxValue: 90,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
                noSwitching: true
            }
        };

        $scope.refreshSlider = function() {
            $timeout(function() {
                $scope.$broadcast('rzSliderForceRender');
            });
        };
    })