angular.module('virtoCommerce.aviaryImageEditorModule')
    .controller('virtoCommerce.aviaryImageEditorModule.imageEditorController', ['$scope', 'imageEditorApi', function ($scope, api) {
        var blade = $scope.blade;
        if (blade.parentBlade)
          blade.selectedImage = _.first(blade.parentBlade.currentEntities);
        blade.title = 'editor.blades.title';
        blade.refresh = function () {
            api.get(function (data) {
                blade.data = data.result;
                blade.isLoading = false;
            });
        }
        blade.refresh();
    }
    ]);
