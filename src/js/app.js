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

/* var sensorColors = [
  f44336, E91E63, 9C27B0 673AB7 3F51B5 2196F3 03A9F4 00BCD4 009688 4CAF50 8BC34A CDDC39 FFEB3B FFC107 FF9800 FF5722 795548 9E9E9E 607D8B
] */

var API = 'http://127.0.0.1:23456/api/'
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
    $rootScope.$stateParams = $stateParams
    return $rootScope.$stateParams
  }])

  .constant('DEVICE_TYPES', {
    1: { name: 'PCA', icon: '', color: '#795548'},
    2: { name: 'PC', icon: '', color: '#9E9E9E'},
    3: { name: 'NODE', icon: '', color: '#607D8B'},
    4: { name: 'GPRS_BRIDGE', icon: '', color: '#2a2c36'},
    5: { name: 'POWER_SOURCE', icon: '', color: '#55595c'},
    6: { name: 'IO', icon: 'N/A', color: '#f44336'},
    7: { name: 'PIR', icon: 'fa fa-eye', color: '#E91E63'},
    8: { name: 'ULTRASONIC', icon: 'fa fa-rss', color: '#9C27B0'},
    9: { name: 'ULTRASONIC_T2', icon: 'fa fa-rss', color: '#673AB7'},
    10: { name: 'PHOTOMETER', icon: 'fa fa-sun-o', color: '#3F51B5'},
    13: { name: 'PTH HUMIDITY', icon: 'fa fa-tint', color: '#2196F3'}, // PTH
    17: { name: 'SOUND_LEVEL', icon: 'fa fa-volume-up', color: '#03A9F4'},
    21: { name: 'CO', icon: 'N/A', color: '#00BCD4'},
    22: { name: 'CO2', icon: 'N/A', color: '#009688'},
    23: { name: 'O3', icon: 'N/A', color: '#4CAF50'},
    24: { name: 'NO2', icon: 'N/A', color: '#8BC34A'},
    32: { name: 'TEMPERATURE', icon: 'fa fa-thermometer-half', color: '#CDDC39'},
    33: { name: 'DO', icon: 'N/A', color: '#FFEB3B'},
    34: { name: 'CONDUCTIVITY', icon: 'fa fa-bolt', color: '#FFC107'},
    35: { name: 'PH', icon: 'N/A', color: '#FF9800'},
    133: { name: 'ENERGY_CONSUMPTION_METER', icon: 'fa fa-tasks', color: '#FF5722'}
  })
