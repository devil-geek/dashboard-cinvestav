angular.module('app')
  .service('ApiSvc', function ($http, $q) {
    const INFO_TYPES = {
      DEFAULT: {
        SENSOR_MEASURES: 1,
        BOOLEAN_ALERT: 2
      },
      PCA: {
        DIRECT_COMMAND: 1
      },
      PC: {},
      NODE: {
        ATTACHED_DEVICES: 1,
        NEIGHBORS: 2,
        ALL_NEIGHBORS: 3,
        END_DEVICES: 4,
        ROUTING_TABLE: 5,
        RESET_ALERT: 6
      },
      GPRS_BRIDGE: {},
      POWER_SOURCE: {},
      IO: {},
      PIR: {},
      ULTRASONIC_DISTANCE_SENSOR: {},
      ULTRASONIC_DISTANCE_SENSOR_T2: {},
      PHOTOMETER: {},
      // RESERVED                      : {},
      // RESERVED                      : {},
      PTH: {},
      // RESERVED                      : {},
      // RESERVED                      : {},
      // resevado                      : {},
      SOUND_LEVEL: {},
      // RESERVED                      : {},
      // RESERVED                      : {},
      // RESERVED                      : {},
      CO: {},
      CO2: {},
      O3: {},
      NO2: {}
    }
    return {
      getAllSensors: function () {
        var defered = $q.defer()
        var promise = defered.promise

        $http.get(API + 'network/sensors/all')
          .then(function (res) {
            defered.resolve(res.data)
          })
          .catch(function (err) {
            defered.reject(err)
          })

        return promise
      },
      getAllDevices: function () {
        var defered = $q.defer()
        var promise = defered.promise

        $http.get(API + 'devices/all?device_types=3&device_except=true')
          .then(function (res) {
            defered.resolve(res.data)
          })
          .catch(function (err) {
            defered.reject(err)
          })

        return promise
      },
      getDeviceLogs: function (page) {
        var defered = $q.defer()
        var promise = defered.promise

        $http.get(API + 'devices/device_logs/page/1?info_types=24')
          .then(function (res) {
            defered.resolve(res.data)
          })
          .catch(function (err) {
            defered.reject(err.status + ' ' + err.statusText)
          })

        return promise
      },
      getSensorMeasures: function (device_mac) {
        var defered = $q.defer()
        var promise = defered.promise

        $http.get(API + 'devices/device_logs/page/1?device_mac=' + device_mac)
          .then(function (res) {
            defered.resolve(res.data)
          })
          .catch(function (err) {
            defered.reject(err)
          })

        return promise
      }
    }
  })
