angular.module('virtoCommerce.aviaryImageEditorModule')
    .controller('virtoCommerce.aviaryImageEditorModule.imageEditorController', ['$scope', 'imageEditorApi', 'virtoCommerce.aviaryImageEditorModule.imageEditorService', 'platformWebApp.settings', 'platformWebApp.bladeNavigationService' ,
        function ($scope, api, imageEditorService, settings, bladeNavigationService) {
            var blade = $scope.blade;

            blade.toolbarCommands = [
                {
                    name: "Add",
                    icon: 'fa fa-plus',
                    executeMethod: function () {
                        var newBlade = {
                            languages: blade.uploader.languages,
                            item: blade.item,
                            onSelect: imageEditorService.linkAssets,
                            controller: 'virtoCommerce.catalogModule.imagesAddController',
                            template: 'Modules/$(VirtoCommerce.Catalog)/Scripts/blades/images-add.tpl.html'
                        };
                        bladeNavigationService.showBlade(newBlade, blade);
                    },
                    canExecuteMethod: function () { return true; }
                }
            ]

            var preload = false;
            var apiKey =
                settings.get({ id: 'ImageEditor.Aviary.ApiKey' }, function (data) {
                    return data.value;
                });
            blade.uploader = imageEditorService.createCatalogUploader(blade);
            blade.featherEditor = imageEditorService.createImageEditorObject(blade, apiKey, preload);
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