var moduleTemplateName = "virtoCommerce.aviaryImageEditorModule";

if (AppDependencies != undefined) {
    AppDependencies.push(moduleTemplateName);
}

angular.module(moduleTemplateName, [])
    .run(['$rootScope', 'platformWebApp.mainMenuService', 'platformWebApp.widgetService', '$state', 'platformWebApp.toolbarService',
        'platformWebApp.bladeNavigationService', 'platformWebApp.settings', 'virtoCommerce.aviaryImageEditorModule.imageEditorService', 'platformWebApp.dialogService',
        function ($rootScope, mainMenuService, widgetService, $state, toolbarService, bladeNavigationService, settings, imageEditorService, dialogService) {
            var imageEditorCommand = {
                name: "editor.blades.toolbar.iconName",
                icon: 'fa fa-paint-brush',
                index: 100,
                executeMethod: function (blade) {
                    settings.get({ id: 'ImageEditor.Aviary.ApiKey' }, function (data) {
                        blade.apiKeyData = [data];
                        var selectedImage = blade.selectedImages[0];

                        //assets
                        if (!selectedImage.id) {
                            selectedImage.id = selectedImage.name;
                            var assetsEditor = imageEditorService.createImageEditorObject(blade, selectedImage);
                            assetsEditor.launch({
                                image: selectedImage.id,
                                url: selectedImage.noCacheUrl
                            });
                        }

                        //catalog
                        else {
                            var catalogEditor = imageEditorService.createImageEditorObject(blade, selectedImage);
                            catalogEditor.launch({
                                image: selectedImage.id,
                                url: selectedImage.url
                            });
                        }
                    })
                },
                canExecuteMethod: function (blade) {
                    if (blade.$scope.gridApi && blade.$scope.gridApi.selection) {
                        var selectedRows = blade.$scope.gridApi.selection.getSelectedRows();
                        blade.selectedImages = _.filter(selectedRows, function (x) { return x.type != 'folder' });
                        if (_.first(blade.selectedImages) && blade.selectedImages.length == 1) {
                            return true;
                        }
                    }
                }
            };

            toolbarService.register(imageEditorCommand, 'virtoCommerce.catalogModule.imagesController');
            toolbarService.register(imageEditorCommand, 'platformWebApp.assets.assetListController');
        }
    ]);