angular.module('virtoCommerce.aviaryImageEditorModule')
.factory('imageEditorApi', ['$resource', function ($resource) {
    return $resource('api/virtoCommerce.imageEditor');
}]);
