//main.js
angular
    .module('app')
    .controller('MainCtrl', function($scope, ApiSvc, $timeout, DEVICE_TYPES) {
        $scope.sensors = []
        var j = 0;
        ApiSvc.getAllSensors()
            .then(function(res) {
                for (var i = 0; i < res.rowCount; i++) {
                    var s = DEVICE_TYPES[res.collection[i].database_info.type]
                    s.mac = res.collection[i].device_mac
                    s.value = 0
                    $scope.sensors.push(s)
                    ApiSvc.getSensorMeasures(res.collection[i].device_mac)
                        .then(function(res) {
                            console.log(res)
                            
                            if (res.collection[0].info.values.value)
                                $scope.sensors[j].value = res.collection[0].info.values.value
                            else if (res.collection[0].info.values.status)
                                $scope.sensors[j].value = res.collection[0].info.values.status
                            else if (res.collection[0].info.values.humidity){
                                $scope.sensors[j].value = "H: " + res.collection[0].info.values.humidity + 
                                " T: " + res.collection[0].info.values.temperature +
                                " P: " + res.collection[0].info.values.pressure 
                            }
                            else if (res.collection[0].info.values.error.label)
                                $scope.sensors[j].value = res.collection[0].info.values.error.label
                            else if (res.collection[0].info.values.error)  
                                $scope.sensors[j].value = res.collection[0].info.values.error            
                            j++
                            
                        })
                        .catch(function(err) {
                            console.log(err)
                        })
                    
                }
                
            })
            .catch(function(err) {
                console.log(err)
            })

            $timeout(function(){
                console.log($scope.sensors)
            },1000)
        /*ApiSvc.getAllDevices()
            .then(function(res) {
                console.log(res);
                for (var i = 0; i < res.rowCount; i++) {
                    console.log(DEVICE_TYPES[res.collection[i].type])

                    ApiSvc.getSensorMeasures(res.collection[i].device_mac)
                        .then(function(res) {
                            console.log("Measures")
                            console.log(res.collection[0].info.values.value);
                            console.log(res.collection[0]);
                        })
                        .catch(function(err) {
                            console.log(err)
                        })

                }
            })
            .catch(function(err) {
                console.log(err)
            })

        ApiSvc.getDeviceLogs(10)
            .then(function(res) {
                console.log(res);
            })
            .catch(function(err) {
                console.log(err)
            })




        $scope.sensors = [
            { name: "NO2", value: 120, icon: "N/A", color: "bg-aqua text-white" },
            { name: "CO2", value: 120, icon: "N/A", color: "bg-purple text-white" },
            { name: "O3 ", value: 120, icon: "N/A", color: "bg-lime text-white" },
            { name: "PHOTOMETER", value: 120, icon: "fa fa-sun-o", color: "bg-danger text-white" },
            { name: "ULTRASONIC", value: 120, icon: "fa fa-rss", color: "bg-red text-white" },
            { name: "PIR", value: "PRESENT", icon: "fa fa-eye", color: "bg-green text-white" },
            { name: "CO ", value: 120, icon: "N/A", color: "bg-orange text-white" },
            { name: "I/O", value: "ON", icon: "N/A", color: "bg-blue text-white" }
        ]
*/
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