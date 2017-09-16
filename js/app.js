var app = angular.module('mijnenApp', ['ngMaterial', 'ngMessages'])
      .config(function($mdThemingProvider) {
         $mdThemingProvider.theme('customTheme')
         .primaryPalette('grey')
         .accentPalette('orange')
         .warnPalette('red');
      });
