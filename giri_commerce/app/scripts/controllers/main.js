'use strict';

angular.module('ecommerceApp')
  .controller('MainCtrl', function ($scope,$routeParams,DataService) {
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;

        if ($routeParams.productid != null) {
            $scope.product = $scope.store.getProduct($routeParams.productid);
        }
     $scope.master = DataService.master;
     $scope.update = function(user) {
         DataService.master = angular.copy(user);
         window.location.href="#/invoice/1";
     }
     $scope.reset = function() {
         $scope.user = angular.copy(DataService.master);
     }
     $scope.reset();
     $scope.isUnchanged = function(user) {
        return angular.equals(user, $scope.master);
     };

     $scope.randomID = function() {
         return Math.floor((Math.random()*10000));
     }
     $scope.resetShop = function() {
         DataService.cart.clearItems();
         window.location.href="#/home";
     }

  });
