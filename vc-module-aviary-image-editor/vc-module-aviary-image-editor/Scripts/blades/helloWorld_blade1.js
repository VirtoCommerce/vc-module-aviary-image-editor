angular.module('virtoCommerce.vc_module_aviary_image_editor')
    .controller('vc_module_aviary_image_editor.blade1Controller', ['$scope', 'vc_module_aviary_image_editorApi', function ($scope, api) {
        var blade = $scope.blade;
        blade.selectedImage = _.first(blade.parentBlade.currentEntities);
        blade.title = 'vc_module_aviary_image_editor';
        blade.refresh = function () {
            api.get(function (data) {
                blade.data = data.result;
                blade.isLoading = false;
            });
        }
        var featherEditor = new Aviary.Feather({
            apiKey: '73ff4de4c7114659bed79f35d368d105',
            apiVersion: 3,
            theme: 'light',
            tools: 'all',
            appendTo: '',
            onSave: function (imageID, newURL) {
                $scope.isValid = true;
                console.log(imageID, newURL);
                var img = document.getElementById(imageID);
                selectedImage.url = newURL;
            },
            onError: function (errorObj) {
                alert(errorObj.message);
            }
        });

        blade.launchEditor = function (id, url) {
            console.log(id, url);
            featherEditor.launch({
                image: id,
                url: url
            });
            return false;
        }
        console.log(blade);
        blade.refresh();
    }])
    .run(['platformWebApp.toolbarService', 'platformWebApp.bladeNavigationService',
        function (toolbarService, bladeNavigationService) {
            //Register module in main menus
            var imageEditorCommand = {
                name: "Editor",
                icon: 'fa fa-paint-brush',
                executeMethod: function (blade) {
                    var newBlade = {
                        id: 'blade1',
                        title: 'imageEditor.blades.aviaryImageEditor.title',
                        subtitle: 'catalog.blades.importers-list.subtitle',
                        controller: 'vc_module_aviary_image_editor.blade1Controller',
                        template: 'Modules/$(vc_module_aviary_image_editor)/Scripts/blades/helloWorld_blade1.tpl.html'
                    };
                    bladeNavigationService.showBlade(newBlade, blade);
                },
                canExecuteMethod: function () {
                    return true;
                }
            };
            toolbarService.register(imageEditorCommand, 'virtoCommerce.catalogModule.imagesController');
        }
    ]);
