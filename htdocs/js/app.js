//Module
var urlPreviewApp = angular.module('urlPreviewApp',['ngRoute','ngResource']);

//Routes
urlPreviewApp.config(function ($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'pages/home.htm',
        controller:'homeController'
    })
    .when('/preview',{
        templateUrl:'pages/preview.htm',
        controller:'previewController'
    })
});

//Services
urlPreviewApp.service('previewService',function($http){
    console.log("service");
    this.urlstr = "";
    this.getPreview = function (url) {
        console.log(url);
        console.log('inside service preview');
        return $http({
          method: 'GET',
          params: {'str': url},
          url: 'server.php'
        }).then(function (response) {
          console.log('response from server', response);
          return response;
        }, function (errResponse) {
            //$scope.preview=false;
          console.log('Error resp from server', errResponse);
          return errResponse;
      });
    };
    this.filterURL = function(str){ 
         var url2 = "";
        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        var url2 = "";
        url = str.replace(urlRegex, function(url,b,c) {
                url2 = (c == 'www.') ?  'http://' +url : url;
                return '~' + url2;
            });
        return url2;
        
       /* var source = "Hello http://airbnb.com as ds www.facebook.com is";
        var str = URI.withinString(source, function(url) {
            return "~" + url;
        });
        var n = str.lastIndexOf("~");
        return n;*/
    };
});

//Controllers 
urlPreviewApp.controller('homeController', ['$scope','$resource','$log','previewService',
    function($scope,$resource,$log, previewService) {
        $scope.preview=false;
        $scope.oldURLStr="";
        $scope.getPreview = function() {
            if($scope.urlstr.length<=$scope.oldURLStr.length){
                $scope.oldURLStr='';
                $scope.preview=false;
                return;
            }
            
            var url = previewService.filterURL($scope.urlstr)
            if(url){
                var promise = previewService.getPreview(url);
                console.log('promise', promise);
                promise.then(function(response){
                    console.log(response);
                    if(response.status==200){
                        $scope.preview=true;
                        $scope.previewContent = response.data;
                    }else{
                         $scope.preview=false;
                    }
                   }, function(edata){console.log(edata);}
                )
            }
            $scope.oldURLStr = $scope.urlstr;
        };    
    }
]);

urlPreviewApp.controller('previewController',['$scope','$resource','previewService',
    function($scope,$resource, previewService){
    $scope.urlstr = previewService.urlstr;
}]);