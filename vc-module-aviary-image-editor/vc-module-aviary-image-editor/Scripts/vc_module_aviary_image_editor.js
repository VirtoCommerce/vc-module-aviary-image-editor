//Call this to register our module to main application
var moduleTemplateName = "virtoCommerce.vc_module_aviary_image_editor";

if (AppDependencies != undefined) {
    AppDependencies.push(moduleTemplateName);
}

angular.module(moduleTemplateName, ['virtoCommerce.catalogModule'])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('workspace.vc_module_aviary_image_editor', {
                    url: '/vc_module_aviary_image_editor',
                    templateUrl: '$(Platform)/Scripts/common/templates/home.tpl.html',
                    controller: [
                        '$scope', 'platformWebApp.bladeNavigationService', function ($scope, bladeNavigationService) {
                            var newBlade = {
                                id: 'blade1',
                                controller: 'vc_module_aviary_image_editor.blade1Controller',
                                template: 'Modules/$(vc_module_aviary_image_editor)/Scripts/blades/helloWorld_blade1.tpl.html',
                                isClosingDisabled: true
                            };
                            bladeNavigationService.showBlade(newBlade);
                        }
                    ]
                });
        }
    ])
    .run(['$rootScope', 'platformWebApp.mainMenuService', 'platformWebApp.widgetService', '$state', 'platformWebApp.toolbarService',
        'platformWebApp.bladeNavigationService', 'FileUploader', 'virtoCommerce.catalogModule.imageTools', 'platformWebApp.assets.api', 'platformWebApp.settings',
        function ($rootScope, mainMenuService, widgetService, $state, toolbarService, bladeNavigationService, FileUploader, imageTools,assets, settings) {
            //Register module in main 
            var menuItem = {
                path: 'browse/vc_module_aviary_image_editor',
                icon: 'fa fa-cube',
                title: 'Aviary image editor',
                priority: 100,
                action: function () { $state.go('workspace.vc_module_aviary_image_editor') },
                permission: 'vc_module_aviary_image_editorPermission'
            };
            mainMenuService.addMenuItem(menuItem);

            function getImageUrl(code, imageType) {
                var folderUrl = 'catalog/' + code + (imageType ? '/' + imageType : '');
                return { folderUrl: '/' + folderUrl, relative: 'api/platform/assets?folderUrl=' + folderUrl };
            };

            function addImage(imageID, newURL, blade) {
                if (newURL) {
                    assets.uploadFromUrl({ folderUrl: getImageUrl(blade.item.code, blade.imageType).folderUrl, url: newURL }, function (data) {
                        _.each(data, function (x) {
                            x.id = blade.selectedImages[0].id;
                            x.sortOrder = blade.currentEntities.length;
                            x.name = blade.item.code + 'D' + x.sortOrder + '.png';
                            x.isImage = true;
                            blade.currentEntities.push(x);
                        });
                        newURL = undefined;
                    });
                }
            }

            //register module in main menus
            var imageeditorcommand = {
                name: "Edit",
                icon: 'fa fa-paint-brush',
                index: 100,
                executeMethod: function (blade) {
                    var uploader = blade.uploader = new FileUploader({
                        blade: blade,
                        headers: { Accept: 'application/json' },
                        autoUpload: true,
                        removeAfterUpload: true
                    });

                    var featherEditor = new Aviary.Feather({
                        apiKey: '73ff4de4c7114659bed79f35d368d105',
                        apiVersion: 3,
                        theme: 'light',
                        tools: 'all',
                        appendTo: '',
                        onSave: function (imageID, newURL) {
                            addImage(imageID, newURL, blade);
                        },
                        onError: function (errorObj) {
                            alert(errorObj.message);
                        },
                        onLoad: function () {
                            
                            featherEditor.launch({
                                image: blade.selectedImages[0].id,
                                url: blade.selectedImages[0].url
                            });
                        }
                    });
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
            toolbarService.register(imageeditorcommand, 'virtoCommerce.catalogModule.imagesController');
        }
    ]);
