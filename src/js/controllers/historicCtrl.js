angular.module('app')
  .controller('historicCtrl', function ($scope, $filter, DEVICE_TYPES, localStorageService, SocketSvc) {
    $scope.sensorsHistoric = []
    $scope.sensors = []
    let sensorTypes = []
    $scope.noData = true

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

    $scope.Consult = function () {
      console.log($scope.sensorsHistoric)
      console.log($scope.startDate)
      console.log($scope.endDate)
      $scope.myJson.series = []
      $scope.sensors = []
      let query = {
        order: 1,
        column: 'timestamp',
        date_start: moment($scope.startDate).format('YYYY-MM-DD'),
        date_end: moment($scope.endDate).format('YYYY-MM-DD'),
        device_types: $scope.sensorsHistoric.map(item => { if (item.checked) return item.type }).filter(item => item)// [6, 7, 8, 9, 10, 13, 17, 21, 22, 23, 24, 32, 35]
      }
      console.log(query)
      SocketSvc.emit('device_logs/all', JSON.stringify(query))
    }

    SocketSvc.on('device_logs/all', function (data) {
      console.log('Device Logs All:')
      console.log(JSON.parse(data))
      if (JSON.parse(data).rowCount === 0) {
        $scope.noData = true
      } else {
        $scope.noData = false
        $scope.sensors = JSON.parse(data).collection.map(item => {
          return {
            date: moment(item.timestamp).format('DD-MM-YYYY HH:mm:ss'),
            device: item.device_alias,
            mac: item.device_mac,
            type: item.device_type,
            sensor: DEVICE_TYPES[item.device_type].name,
            value: item.info.values.value
          }
        })
        addToGraph(_.groupBy(JSON.parse(data).collection, 'device_mac'))
      }
    })

    function addToGraph (data) {
      data = Object.values(data)
      $scope.myJson.series = data.map(item => {
        let s = DEVICE_TYPES[item[0].device_type]
        let values = item.map(obj => {
          return [obj.timestamp, obj.info.values.value]
        })

        return {
          text: s.name,
          mac: s.mac,
          values: values,
          backgroundColor1: s.color,
          backgroundColor2: s.color,
          lineColor: s.color
        }
      })
      console.log($scope.myJson.series)
    }

    function setSensors (data) {
      if (data.device_type < 6) { return }
      var s = DEVICE_TYPES[data.device_type]
      s.mac = data.device_mac
      s.last = moment(data.timestamp).format('DD-MM-YY HH:mm:ss')
      s.checked = true
      s.type = data.device_type
      if (sensorTypes.indexOf(s.type) === -1) {
        sensorTypes.push(s.type)
        $scope.sensorsHistoric.push(s)
      }
    }

    function random (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    $scope.myJson = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      backgroundColor: '#FFF',
      globals: {
        shadow: true,
        fontFamily: 'Helvetica'
      },
      type: 'area',
      legend: {
        align: 'center',
        'vertical-align': 'top',
        backgroundColor: '#434343',
        borderColor: 'transparent',
        marker: {
          borderRadius: '50px',
          borderColor: 'transparent'
        },
        item: {
          fontColor: 'white'
        }

      },
      scaleX: {
        transform: {
          type: 'date',
          all: '%D, %d %M %Y<br>%h:%i %A',
          itemsOverlap: true
        },
        zooming: true,
        lineWidth: '1px',
        tick: {
          lineWidth: '1px'
        },
        guide: {
          visible: true
        }
      },
      scaleY: {
        lineWidth: '1px',
        tick: {
          lineWidth: '1px'
        },
        guide: {
          lineStyle: 'solid',
          lineColor: '#626262'
        }
      },
      tooltip: {
        visible: false
      },
      crosshairX: {
        scaleLabel: {
          backgroundColor: '#434343',
          fontColor: 'white'
        },
        plotLabel: {
          backgroundColor: '#434343',
          fontColor: '#FFF',
          _text: 'Number of hits : %v'
        }
      },
      plot: {
        lineWidth: '2px',
        aspect: 'spline',
        marker: {
          visible: false
        }
      },
      series: []
    }
  })
