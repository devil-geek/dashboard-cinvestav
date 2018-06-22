angular.module('app')
  .controller('historicCtrl', function ($scope, DEVICE_TYPES, localStorageService, SocketSvc) {
    $scope.sensorsHistoric = []
    $scope.sensors = []
    let labels = {}
    let series = {}
    let data = {}
    let colors = {}
    let dataSize = 20000

    SocketSvc.emit('logIn', 'UI' + random(0, 100000))

    SocketSvc.emit('device_logs/last')

    SocketSvc.on('device_logs/last', function (data) {
      // console.log('Last', data)
      let d = JSON.parse(data)
      $scope.sensorsHistoric = []

      d.map(item => {
        setSensors(item)
      })
    })

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

    $scope.Consult = function () {
      console.log($scope.sensorsHistoric)

      let query = {
        dateStart: moment().format('YYYY-MM-DD'),
        date_end: moment().format('YYYY-MM-DD'),
        device_types: [6, 7, 8, 9, 10, 13, 17, 21, 22, 23, 24, 32, 35]
      }
      SocketSvc.emit('device_logs/all', JSON.stringify(query))
    }

    SocketSvc.on('device_logs/all', function (data) {
      console.log('Device Logs All:', data)
      let d = JSON.parse(data)
      $scope.sensors = []
      console.log(d.collection.length)
      d.collection.map(item => {
        console.log(item.device_mac, moment(item.timestamp).format('DD-MM-YY HH:mm:ss'))
        setMeasures(item)
      })
    })

    function addToGraph (sensor, value, color, last) {
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
      labels[last] = last
      $scope.labels = Object.values(labels)
      $scope.data = Object.values(data)
      $scope.series = Object.values(series)
      $scope.colors = Object.values(colors)
    }

    function setMeasures (data) {
      if (data.device_type < 6) { return }
      var s = DEVICE_TYPES[data.device_type]
      if (!s) {
        console.log(data)
      }
      s.mac = data.device_mac
      s.last = moment(data.timestamp).format('DD-MM-YY HH:mm:ss')
      s.checked = true
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
      let val = s.value
      if (!isNaN(s.value)) {
        // val = 0
        addToGraph(s.name, s.value, s.color, s.last)
      }
      // addToGraph(s.name, val, s.color)
      $scope.sensors.push(s)
    }

    function setSensors (data) {
      if (data.device_type < 6) { return }
      var s = DEVICE_TYPES[data.device_type]
      s.mac = data.device_mac
      s.last = moment(data.timestamp).format('DD-MM-YY HH:mm:ss')
      s.checked = true

      $scope.sensorsHistoric.push(s)
    }

    function random (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
  })
