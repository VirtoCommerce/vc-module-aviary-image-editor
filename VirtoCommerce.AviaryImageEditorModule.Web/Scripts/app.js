var moduleTemplateName = "virtoCommerce.aviaryImageEditorModule";

if (AppDependencies != undefined) {
    AppDependencies.push(moduleTemplateName);
}

angular.module(moduleTemplateName, [])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('workspace.imageEditor', {
                    url: '/imageEditor',
                    templateUrl: '$(Platform)/Scripts/common/templates/home.tpl.html',
                    controller: [
                        '$scope', 'platformWebApp.bladeNavigationService', function ($scope, bladeNavigationService) {
                            var newBlade = {
                                id: 'aviaryImageEditor',
                                title: 'editor.blades.title',
                                subtitle: 'editor.blades.subtitle',
                                controller: 'virtoCommerce.aviaryImageEditorModule.imageEditorController',
                                template: 'Modules/$(virtoCommerce.aviaryImageEditorModule)/Scripts/blades/image-editor.tpl.html',
                                isClosingDisabled: true
                            };
                            bladeNavigationService.showBlade(newBlade);
                            $scope.moduleName = 'vc-image-editor';
                        }
                    ]
                });
        }
    ])
    .run(['$rootScope', 'platformWebApp.mainMenuService', 'platformWebApp.widgetService', '$state', 'platformWebApp.toolbarService',
        'platformWebApp.bladeNavigationService', 'platformWebApp.settings', 'virtoCommerce.aviaryImageEditorModule.imageEditorService', 'platformWebApp.dialogService',
        function ($rootScope, mainMenuService, widgetService, $state, toolbarService, bladeNavigationService, settings, imageEditorService, dialogService) {
            //Register module in main
            var menuItem = {
                path: 'browse/virtoCommerce.imageEditor',
                icon: 'fa fa-paint-brush',
                title: 'editor.blades.title',
                priority: 100,
                action: function () { $state.go('workspace.imageEditor') },
                permission: 'imageEditor:access'
            };
            //mainMenuService.addMenuItem(menuItem);

            //Register toolbar button
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
                            var featherEditor = imageEditorService.createImageEditorObject(blade, selectedImage);
                            featherEditor.launch({
                                image: selectedImage.id,
                                url: selectedImage.noCacheUrl
                            });
                        }
                        //catalog
                        else {
                            var featherEditor = imageEditorService.createImageEditorObject(blade, selectedImage);
                            featherEditor.launch({
                                image: selectedImage.id,
                                url: selectedImage.url
                            });
                        }
                    })
                },
                canExecuteMethod: function (blade) {
                    if (blade.$scope.gridApi && blade.$scope.gridApi.selection) {
                        var selectedRows = blade.$scope.gridApi.selection.getSelectedRows();
                        //exclude if selectedItem = folder
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