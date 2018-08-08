angular.module('app')
  .service('SocketSvc', function (socketFactory) {
    return socketFactory({
      ioSocket: io.connect('http://localhost:5000')
    })
  })
