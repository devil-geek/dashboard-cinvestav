// Default colors
var brandPrimary = '#20a8d8';
var brandSuccess = '#4dbd74';
var brandInfo = '#63c2de';
var brandWarning = '#f8cb00';
var brandDanger = '#f86c6b';

var grayDark = '#2a2c36';
var gray = '#55595c';
var grayLight = '#818a91';
var grayLighter = '#d1d4d7';
var grayLightest = '#f8f9fa';

var API = "http://ttrservers.dyndns.org:9091/api/";
angular
    .module('app', [
        'ui.router',
        'oc.lazyLoad',
        'ncy-angular-breadcrumb',
        'angular-loading-bar'
    ])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 1;
    }])
    .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
        $rootScope.$on('$stateChangeSuccess', function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
        $rootScope.$state = $state;
        return $rootScope.$stateParams = $stateParams;
    }])

    .constant('DEVICE_TYPES', {
        1: {name: "PCA", icon: '', color: ''},
        2: {name: "PC", icon: '', color: ''},
        3: {name: "NODE", icon: '', color: ''},
        4: {name: "GPRS_BRIDGE", icon: '', color: ''},
        5: {name: "POWER_SOURCE", icon: '', color: ''},
        6: {name: "IO", icon: 'N/A', color: 'bg-blue text-white'},
        7: {name: "PIR", icon: 'fa fa-eye', color: 'bg-green text-white'},
        8: {name: "ULTRASONIC_DISTANCE", icon: 'fa fa-rss', color: 'bg-red text-white'},
        9: {name: "ULTRASONIC_DISTANCE_T2", icon: 'fa fa-rss', color: 'bg-red text-white'},
        10: {name: "PHOTOMETER", icon: 'fa fa-sun-o', color: 'bg-danger text-white'},
        13: {name: "PTH", icon: 'fa fa-thermometer-three-quarters', color: 'bg-pink text-white'},
        17: {name: "SOUND_LEVEL", icon: 'fa fa-volume-up', color: 'bg-pink text-white'},
        21: {name: "CO", icon: 'N/A', color: 'bg-orange text-white'},
        22: {name: "CO2", icon: 'N/A', color: 'bg-purple text-white'},
        23: {name: "O3", icon: 'N/A', color: 'bg-lime text-white'},
        24: {name: "NO2" ,icon: 'N/A', color: 'bg-aqua text-white'}
    })