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
    .run(['$rootScope', 'platformWebApp.mainMenuService', 'platformWebApp.widgetService', '$state', 'platformWebApp.toolbarService', 'platformWebApp.bladeNavigationService',
        function ($rootScope, mainMenuService, widgetService, $state, toolbarService, bladeNavigationService) {
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

            //function (toolbarService, bladeNavigationService) {
            //    //Register module in main menus
            //    var imageEditorCommand = {
            //        name: "Editor",
            //        icon: 'fa fa-paint-brush',
            //        executeMethod: function (blade) {
            //            var featherEditor = new Aviary.Feather({
            //                apiKey: '73ff4de4c7114659bed79f35d368d105',
            //                apiVersion: 3,
            //                theme: 'light',
            //                tools: 'all',
            //                appendTo: '',
            //                onSave: function (imageID, newURL) {
            //                    $scope.isValid = true;
            //                    console.log(imageID, newURL);
            //                    var img = document.getElementById(imageID);
            //                    selectedImage.url = newURL;
            //                },
            //                onError: function (errorObj) {
            //                    alert(errorObj.message);
            //                }
            //            });

            //            blade.launchEditor = function (id, url) {
            //                console.log(id, url);
            //                featherEditor.launch({
            //                    image: id,
            //                    url: url
            //                });
            //                return false;
            //            }
            //            // bladeNavigationService.showBlade(newBlade, blade);
            //        },
            //        canExecuteMethod: function () {
            //            return true;
            //        }
            //    };
            //    toolbarService.register(imageEditorCommand, 'virtoCommerce.catalogModule.imagesController');
            //}

        }
    ]);
