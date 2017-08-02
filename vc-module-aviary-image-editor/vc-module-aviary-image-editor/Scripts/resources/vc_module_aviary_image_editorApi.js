angular.module('virtoCommerce.vc_module_aviary_image_editor')
.factory('vc_module_aviary_image_editorApi', ['$resource', function ($resource) {
    return $resource('api/vc_module_aviary_image_editor');
}]);
