angular
.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

  $urlRouterProvider.otherwise('/dashboard');

  $ocLazyLoadProvider.config({
    // Set to true if you want to see what and when is dynamically loaded
    debug: true
  });

  $breadcrumbProvider.setOptions({
    prefixStateName: 'app',
    includeAbstract: true,
    template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
  });

  $stateProvider
  .state('app', {
    abstract: true,
    templateUrl: 'views/common/layouts/full.html',
    controller: 'appCtrl',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Root',
      skip: true
    },
    resolve: {
      loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load CSS files
        return $ocLazyLoad.load([{
          serie: true,
          name: 'Flags',
          files: ['node_modules/flag-icon-css/css/flag-icon.min.css']
        },{
          serie: true,
          name: 'Font Awesome',
          files: ['node_modules/font-awesome/css/font-awesome.min.css']
        },{
          serie: true,
          name: 'Simple Line Icons',
          files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
        }]);
      }],
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load([{
          serie: true,
          name: 'chart.js',
          files: [
            'node_modules/chart.js/dist/Chart.min.js',
            'node_modules/angular-chart.js/dist/angular-chart.min.js'
          ]
        },
        {
            serie: true,
            name: 'moment',
            files: [
              'node_modules/moment/min/moment.min.js'
            ]
          }]);
      }],
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/appCtrl.js']
        });
      }]
    }
  })
  .state('app.main', {
    url: '/dashboard',
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Dashboard',
    },
    resolve: {
      loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
             return $ocLazyLoad.load('js/services/ApiSvc.js');
      }],
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load({
          files: ['js/controllers/main.js']
        });
      }]
    }
  })

  .state('app.historic', {
    url: '/historic',
    templateUrl: 'views/historic.html',
    controller: 'historicCtrl',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Historic',
    },
    resolve: {
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load([
          {
            serie: true,
            name: '720kb.datepicker',
            files: [
              'node_modules/angularjs-datepicker/dist/angular-datepicker.min.css',
              'node_modules/angularjs-datepicker/dist/angular-datepicker.min.js'
            ]
          },
          {
            serie: true,
            files: [
              'node_modules/md-checkbox/md-checkbox.css',
              'node_modules/md-radio/md-radio.css'
            ]
          }
        ]);
      }],
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/historicCtrl.js']
        });
      }]
    }
  })

  .state('app.sensors', {
    url: '/sensors',
    templateUrl: 'views/sensors.html',
    controller: 'sensorsCtrl',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Sensors Range',
    },
    resolve: {
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load([
          {
            serie: true,
            name: 'rzModule',
            files: [
              'node_modules/angularjs-slider/dist/rzslider.min.css',
              'node_modules/angularjs-slider/dist/rzslider.min.js'
            ]
          }
        ]);
      }],
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/sensorsCtrl.js']
        });
      }]
    }
  })

  .state('app.notifications', {
    url: '/notifications',
    templateUrl: 'views/notifications.html',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Notifications',
    },
    resolve: {
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [
              'node_modules/md-radio/md-radio.css'
            ]
          }
        ]);
      }]
    }
  })

  // Additional Pages
  .state('login', {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'loginCtrl',
    resolve: {
    loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load CSS files
        return $ocLazyLoad.load([{
          serie: true,
          name: 'Font Awesome',
          files: ['node_modules/font-awesome/css/font-awesome.min.css']
        },{
          serie: true,
          name: 'Simple Line Icons',
          files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
        }]);
      }],
    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/loginCtrl.js']
        });
      }]  
    }
  })
  
}]);
