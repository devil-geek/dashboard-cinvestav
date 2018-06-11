// main.js
angular
  .module('app')
  .controller('MainCtrl', function ($scope, ApiSvc, $timeout, DEVICE_TYPES, localStorageService, SocketSvc) {
    SocketSvc.emit('logIn', 'car')
    let query = {
      page: 1,
      page_size: 5,
      device_mac: [12296]
    }
    let query2 = {
      device_types: 3,
      device_except: true
    }

    SocketSvc.emit('devices/all', JSON.stringify(query2))
    SocketSvc.emit('device_logs', JSON.stringify(query))
    SocketSvc.emit('command', JSON.stringify(query))

    SocketSvc.on('message', function (msg) {
      console.log('MSG', msg)
    })

    SocketSvc.on('devices', function (data) {
      console.log('Devices:', data)
    })

    SocketSvc.on('devices/all', function (data) {
      console.log('Devices:', data)
    })

    SocketSvc.on('device/alias', function (data) {
      console.log('Device Alias:', data)
    })

    SocketSvc.on('device_logs', function (data) {
      console.log('Device Logs:', data)
    })

    SocketSvc.on('command', function (data) {
      console.log('Command:', data)
    })

    SocketSvc.on('nodes', function (data) {
      console.log('Nodes:', data)
    })

    ApiSvc.getAllSensors()
      .then(function (res) {
        console.log(res)
      })
      .catch(function (err) {
        console.log(err)
      })
    ApiSvc.getAllDevices()
      .then(function (res) {
        console.log(res)
        for (var i = 0; i < res.rowCount; i++) {
          console.log(DEVICE_TYPES[res.collection[i].type])

          ApiSvc.getSensorMeasures(res.collection[i].device_mac)
            .then(function (res) {
              console.log('Measures')
              console.log(res.collection[0].info.values.value)
              console.log(res.collection[0])
            })
            .catch(function (err) {
              console.log(err)
            })
        }
      })
      .catch(function (err) {
        console.log(err)
      })

    ApiSvc.getDeviceLogs(10)
      .then(function (res) {
        console.log(res)
      })
      .catch(function (err) {
        console.log(err)
      })

    $scope.sensors = [
      { name: 'NO2', value: 120, icon: 'N/A', color: 'bg-aqua text-white' },
      { name: 'CO2', value: 120, icon: 'N/A', color: 'bg-purple text-white' },
      { name: 'O3 ', value: 120, icon: 'N/A', color: 'bg-lime text-white' },
      { name: 'PHOTOMETER', value: 120, icon: 'fa fa-sun-o', color: 'bg-danger text-white' },
      { name: 'ULTRASONIC', value: 120, icon: 'fa fa-rss', color: 'bg-red text-white' },
      { name: 'PIR', value: 'PRESENT', icon: 'fa fa-eye', color: 'bg-green text-white' },
      { name: 'CO ', value: 120, icon: 'N/A', color: 'bg-orange text-white' },
      { name: 'I/O', value: 'ON', icon: 'N/A', color: 'bg-blue text-white' }
    ]

    // convert Hex to RGBA
    function convertHex (hex, opacity) {
      hex = hex.replace('#', '')
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)

      result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')'
      return result
    }

    function random (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    var elements = 27
    var data1 = []
    var data2 = []
    var data3 = []

    for (var i = 0; i <= elements; i++) {
      data1.push(random(50, 200))
      data2.push(random(80, 100))
      data3.push(65)
    }

    $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    $scope.series = ['Current', 'Previous', 'BEP']
    $scope.data = [data1, data2, data3]
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
    }]
    $scope.options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false
          },
          ticks: {
            callback: function (value) {
              return value.charAt(0)
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
          hoverBorderWidth: 3
        }
      }
    }
  })
