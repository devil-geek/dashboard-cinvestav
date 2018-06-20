// main.js
angular
  .module('app')
  .controller('MainCtrl', function ($scope, ApiSvc, $interval, DEVICE_TYPES, localStorageService, SocketSvc) {
    $scope.sensors = []
    let device_macs = [
      12295,
      12296,
      54016,
      54017,
      54018,
      54019,
      54020,
      54021,
      54023,
      54024
    ]

    SocketSvc.emit('logIn', 'car')
    let query = {
      page: 1,
      page_size: 5,
      device_mac: [12296]
    }

    let query2 = {
      device_types: [6, 7, 8, 9, 10, 13, 17, 21, 22, 23, 24]
    }
    let query5 = {
      cmd_type: 'NETWORK',
      cmd: 'LAST_MEASURES'
    }

    // SocketSvc.emit('devices/all', JSON.stringify(query2))
    SocketSvc.emit('device_logs/last')

    SocketSvc.emit('command', JSON.stringify(query5))

    SocketSvc.on('device_logs/last', function (data) {
      console.log('Last', data)
      let d = JSON.parse(data)
      $scope.sensors = []

      d.map(item => {
        console.log(item.device_mac, moment(item.timestamp).format('DD-MM-YYYY HH:mm:ss'))
        setMeasures(item)
      })
    })

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
      let d = JSON.parse(data)
      d.collection.map(item => {
        console.log(item.device_mac, moment(item.timestamp).format('DD-MM-YYYY HH:mm:ss'))
        setMeasures(d.collection[0])
      })
    })

    SocketSvc.on('command', function (data) {
      console.log('Command:', data)
      let d = JSON.parse(data)
      $scope.sensors = []
      for (const key in d) {
        if (d.hasOwnProperty(key)) {
          const element = d[key]
          console.log(key, element)
          element.map((item, key) => {
            var s = DEVICE_TYPES[item.device_type]
            s.value = item.body.measure
            $scope.sensors.push(s)
            device_macs.push(item.mac_addr)
          })
        }
      }
    })

    SocketSvc.on('nodes', function (data) {
      console.log('Nodes:', data)
    })

    function getMeasures () {
      device_macs.map(item => {
        let query = {
          page: 1,
          page_size: 1,
          column: 'timestamp',
          order: 1,
          device_mac: item
        }
        SocketSvc.emit('device_logs', JSON.stringify(query))
      })
    }

    function setMeasures (data) {
      console.log(data)
      if (data.device_type < 6) { return }
      var s = DEVICE_TYPES[data.device_type]
      s.mac = data.device_mac
      if (data.info.values.value) {
        s.value = data.info.values.value
      } else if (data.info.values.status) {
        s.value = data.info.values.status
      } else if (data.info.values.pressure) {
        $scope.sensors.push(
          {
            name: 'PTH PRESSURE',
            mac: s.mac,
            color: s.color,
            icon: 'fa fa-tachometer',
            value: data.info.values.pressure
          })
        $scope.sensors.push(
          {
            name: 'PTH TEMPERATURE',
            mac: s.mac,
            color: s.color,
            icon: 'fa fa-thermometer',
            value: data.info.values.temperature
          })

        s.value = data.info.values.humidity
      } else if (data.info.values.error.label) {
        s.value = data.info.values.error.label
        s.error = true
      } else if (data.info.values.error) {
        s.value = data.info.values.error
        s.error = true
      } else {
        s.value = 0
      }

      $scope.sensors.push(s)
    }

    // getMeasures()
    /* ApiSvc.getAllSensors()
      .then(function (res) {
        console.log(res)
        for (var i = 0; i < res.rowCount; i++) {
          (function (i) {
            var s = DEVICE_TYPES[res.collection[i].type]
            s.mac = res.collection[i].device_mac

            ApiSvc.getSensorMeasures(res.collection[i].device_mac)
              .then(function (res) {
                console.log(res)

                if (res.collection[0].info.values.value) { s.value = res.collection[0].info.values.value } else if (res.collection[0].info.values.status) { s.value = res.collection[0].info.values.status } else if (res.collection[0].info.values.pressure) {
                  $scope.sensors.push(
                    {
                      name: 'PTH PRESSURE',
                      mac: s.mac,
                      color: s.color,
                      icon: 'fa fa-tachometer',
                      value: res.collection[0].info.values.pressure
                    })
                  $scope.sensors.push(
                    {
                      name: 'PTH TEMPERATURE',
                      mac: s.mac,
                      color: s.color,
                      icon: 'fa fa-thermometer',
                      value: res.collection[0].info.values.temperature
                    })

                  s.value = res.collection[0].info.values.humidity
                } else if (res.collection[0].info.values.error.label) { s.value = res.collection[0].info.values.error.label } else if (res.collection[0].info.values.error) { s.value = res.collection[0].info.values.error } else { s.value = 0 }

                $scope.sensors.push(s)
              })
              .catch(function (err) {
                console.log(err)
              })
          })(i)
        }
      })
      .catch(function (err) {
        console.log(err)
      }) */

    $interval(function () {
      SocketSvc.emit('device_logs/last')
    }, 10000)

    // convert Hex to RGBA
    function convertHex (hex, opacity) {
      hex = hex.replace('#', '')
      let r = parseInt(hex.substring(0, 2), 16)
      let g = parseInt(hex.substring(2, 4), 16)
      let b = parseInt(hex.substring(4, 6), 16)

      let result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')'
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
