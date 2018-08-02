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
    let sensors = {}
    $scope.series = []
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
        // layout: 'x4',
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
        maxItems: 8,
        transform: {
          type: 'date',
          all: '%D, %d %M %Y<br>%h:%i %A',
          itemsOverlap: true
        },
        zooming: true,
        values: [],
        // lineColor: 'white',
        lineWidth: '1px',
        tick: {
          // lineColor: 'white',
          lineWidth: '1px'
        },
        /* item: {
          fontColor: 'white'
        }, */
        guide: {
          visible: false
        }
      },
      scaleY: {
        // lineColor: 'white',
        lineWidth: '1px',
        tick: {
          // lineColor: 'white',
          lineWidth: '1px'
        },
        guide: {
          lineStyle: 'solid',
          lineColor: '#626262'
        }
        /* item: {
          fontColor: 'white'
        } */
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
      let sensors = {}

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
      if (moment(data.timestamp).diff(moment(), 'days') !== 0) {
        return
      }
      console.log('DATA', data)
      if (data.device_type < 6) { return }
      let s = Object.create(DEVICE_TYPES[data.device_type])
      s.mac = data.device_mac
      console.log('MAC', s.mac)
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
        if ($scope.myJson.scaleX.values.indexOf(moment(data.timestamp).valueOf()) === -1) {
          if ($scope.myJson.scaleX.values.length >= 20) {
            $scope.myJson.scaleX.values.shift()
          }
          $scope.myJson.scaleX.values =
            $scope.myJson.scaleX.values.concat(moment(data.timestamp).valueOf())
        }
        let found = $scope.myJson.series.find(function (element) {
          return element.mac === s.mac
        })
        if (!found) {
          $scope.myJson.series.push(
            {
              text: s.name,
              mac: s.mac,
              values: [s.value],
              backgroundColor1: s.color,
              backgroundColor2: s.color,
              lineColor: s.color
            }
          )
        } else {
          $scope.myJson.series.map(item => {
            if (item.mac === s.mac) {
              if (item.values.length >= 20) {
                item.values.shift()
              }
              item.values = item.values.concat(s.value)
            }
          })
        }
      }
      sensors[data.device_mac] = s
      console.log(sensors)
      $scope.sensors = Object.values(sensors)
      /* if (!data.info.values.error) {
        $scope.sensors.push(s)
      } */
    }

    $interval(function () {
      SocketSvc.emit('device_logs/last')
    }, refreshTime)

    function random (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
  })
