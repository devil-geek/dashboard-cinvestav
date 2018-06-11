// Default colors
var brandPrimary = '#20a8d8'
var brandSuccess = '#4dbd74'
var brandInfo = '#63c2de'
var brandWarning = '#f8cb00'
var brandDanger = '#f86c6b'

var grayDark = '#2a2c36'
var gray = '#55595c'
var grayLight = '#818a91'
var grayLighter = '#d1d4d7'
var grayLightest = '#f8f9fa'

var API = 'http://ttrservers.dyndns.org:9091/api/'
angular
  .module('app', [
    'ui.router',
    'oc.lazyLoad',
    'ncy-angular-breadcrumb',
    'angular-loading-bar',
    'LocalStorageModule',
    'btford.socket-io'
  ])
  .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false
    cfpLoadingBarProvider.latencyThreshold = 1
  }])
  .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$on('$stateChangeSuccess', function () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    })
    $rootScope.$state = $state
    return $rootScope.$stateParams = $stateParams
  }])

  .constant('DEVICE_TYPES', {
    1: 'PCA',
    2: 'PC',
    3: 'NODE',
    4: 'GPRS_BRIDGE',
    5: 'POWER_SOURCE',
    6: 'IO',
    7: 'PIR',
    8: 'ULTRASONIC_DISTANCE_SENSOR',
    9: 'ULTRASONIC_DISTANCE_SENSOR_T2',
    10: 'PHOTOMETER',
    13: 'PTH',
    17: 'SOUND_LEVEL',
    21: 'CO',
    22: 'CO2',
    23: 'O3',
    24: 'NO2'
  })
