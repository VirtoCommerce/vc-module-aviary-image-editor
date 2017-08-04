//Call this to register our module to main application
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
                                template: 'Modules/$(Vi)/Scripts/blades/image-editor.tpl.html',
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
        'platformWebApp.bladeNavigationService', 'platformWebApp.settings', 'virtoCommerce.aviaryImageEditorModule.imageEditorService',
        function ($rootScope, mainMenuService, widgetService, $state, toolbarService, bladeNavigationService, settings, imageEditorService) {
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
                    var uploader = imageEditorService.createUploader(blade);
                    var featherEditor = imageEditorService.createImageEditorObject(blade);

                    featherEditor.launch({
                            image: blade.selectedImages[0].id,
                            url: blade.selectedImages[0].url
                        });
                },
                canExecuteMethod: function (blade) {
                    if (blade.selectedImages.length != 0 && blade.selectedImages.length < 2)
                        return true;
                }
            };
            toolbarService.register(imageEditorCommand, 'virtoCommerce.catalogModule.imagesController');
        }
    ]);
