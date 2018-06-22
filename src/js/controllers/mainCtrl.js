// main.js
angular
  .module('app')
  .controller('MainCtrl', function ($scope, $interval, DEVICE_TYPES, localStorageService, SocketSvc) {
    $scope.sensors = []
    let labels = {}
    let series = {}
    let data = {}
    let colors = {}
    let refreshTime = 10000
    let dataSize = 20
    $scope.today = moment().format('DD-MMM-YYYY')
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

    SocketSvc.emit('logIn', 'UI' + random(0, 100000))

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

    // SocketSvc.emit('command', JSON.stringify(query5))

    SocketSvc.on('device_logs/last', function (data) {
      // console.log('Last', data)
      let d = JSON.parse(data)
      $scope.sensors = []

      d.map(item => {
        setMeasures(item)
      })
    })

    /* SocketSvc.on('message', function (msg) {
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
    }) */

    /*  SocketSvc.on('device_logs', function (data) {
      console.log('Device Logs:', data)
      let d = JSON.parse(data)
      d.collection.map(item => {
        console.log(item.device_mac, moment(item.timestamp).format('HH:mm:ss'))
        setMeasures(d.collection[0])
      })
    }) */

    /* SocketSvc.on('command', function (data) {
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
    }) */

    function getMeasures () {
      device_macs.map(item => {
        let query = {
          page: 1,
          page_size: 1,
          column: 'timestamp',
          order: -1,
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
      s.last = moment(data.timestamp).format('DD-MM-YY HH:mm:ss')

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
      } else if (data.info.values.error && data.info.values.error.label) {
        s.value = data.info.values.error.label
        s.error = true
      } else if (data.info.values.error) {
        s.value = data.info.values.error
        s.error = true
      } else {
        s.value = 0
      }

      if (!isNaN(s.value)) {
        addToGraph(s.name, s.value, s.color)
      }

      if (!data.info.values.error) {
        $scope.sensors.push(s)
      }
    }

    function addToGraph (sensor, value, color) {
      if (data[sensor]) {
        if (data[sensor].length >= dataSize) {
          data[sensor].shift()
          data[sensor].push(value)// random(0, 200))

          if ($scope.labels.length > dataSize) {
            let del = Object.values(labels)[0]
            delete labels[del]
          }
        } else {
          data[sensor].push(value)// random(0, 200))
        }
      } else {
        data[sensor] = [value]// random(0, 200)]
        series[sensor] = sensor
        colors[sensor] = {
          backgroundColor: 'transparent',
          borderColor: color
        }
      }
      labels[moment().format('HH:mm.ss')] = moment().format('HH:mm.ss')
      $scope.labels = Object.values(labels)
      $scope.data = Object.values(data)
      $scope.series = Object.values(series)
      $scope.colors = Object.values(colors)
    }

    $interval(function () {
      SocketSvc.emit('device_logs/last')
    }, refreshTime)

    function random (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    $scope.options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0
      },
      legend: {
        display: true
      }
    }
  })
