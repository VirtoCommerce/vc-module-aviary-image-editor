﻿//Call this to register our module to main application
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

            //register module in main menus
            var imageEditorCommand = {
                name: "editor.blades.toolbar.iconName",
                icon: 'fa fa-paint-brush',
                index: 100,
                executeMethod: function (blade) {
                    settings.get({ id: 'ImageEditor.Aviary.ApiKey' }, function (data) {
                        blade.apiKeyData = [data];
                            if (!blade.selectedImages[0].id) {
                                blade.selectedImages[0].id = blade.selectedImages[0].name;
                                var uploader = imageEditorService.createAssetsUploader(blade);
                                var featherEditor = imageEditorService.createImageEditorObject(blade, 'assets');
                            }
                            else {
                                var uploader = imageEditorService.createCatalogUploader(blade);
                                var featherEditor = imageEditorService.createImageEditorObject(blade, 'catalog');
                        }

                            featherEditor.launch({
                                image: blade.selectedImages[0].id,
                                url: blade.selectedImages[0].url
                            });
                        })
                },
                canExecuteMethod: function (blade) {
                    if (!blade.selectedImages)
                        blade.selectedImages = [];
                    if (blade.$scope.gridApi && blade.$scope.gridApi.selection)
                        blade.$scope.gridApi.selection.on.rowSelectionChanged(blade.$scope, function (rowEntity, colDef) {
                            if (rowEntity.isSelected && !_.contains(blade.selectedImages, _.findWhere(blade.selectedImages, rowEntity.entity)) && rowEntity.entity.type != 'folder') {
                                blade.selectedImages.push(rowEntity.entity);
                            }
                            else if (!rowEntity.isSelected) {
                                blade.selectedImages = _.without(blade.selectedImages, _.findWhere(blade.selectedImages, rowEntity.entity));
                            }
                        });
                    if (blade.selectedImages.length != 0 && blade.selectedImages.length < 2)
                        return true;
                }
            };

            toolbarService.register(imageEditorCommand, 'virtoCommerce.catalogModule.imagesController');
            toolbarService.register(imageEditorCommand, 'platformWebApp.assets.assetListController');
        }
    ]);
