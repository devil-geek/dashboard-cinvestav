angular.module('app')
.controller('historicCtrl', function($scope){
	console.log("historicCtrl")	

	 //convert Hex to RGBA
        function convertHex(hex, opacity) {
            hex = hex.replace('#', '');
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);

            result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
            return result;
        }

        function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        var elements = 27;
        var data1 = [];
        var data2 = [];
        var data3 = [];

        for (var i = 0; i <= elements; i++) {
            data1.push(random(50, 200));
            data2.push(random(80, 100));
            data3.push(65);
        }

        $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        $scope.series = ['Current', 'Previous', 'BEP'];
        $scope.data = [data1, data2, data3];
        $scope.colors = [{
            backgroundColor: convertHex(brandInfo, 10),
            borderColor: brandInfo,
            pointHoverBackgroundColor: '#fff'

        }, {
            backgroundColor: 'transparent',
            borderColor: brandSuccess,
            pointHoverBackgroundColor: '#fff'
        }, {
            backgroundColor: 'transparent',
            borderColor: brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        }];
        $scope.options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        callback: function(value) {
                            return value.charAt(0);
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        stepSize: Math.ceil(250 / 5),
                        max: 250
                    }
                }]
            },
            elements: {
                point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                }
            },
        }
    
})