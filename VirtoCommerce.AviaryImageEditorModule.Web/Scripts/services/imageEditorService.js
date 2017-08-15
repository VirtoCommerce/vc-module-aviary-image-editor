angular.module('virtoCommerce.aviaryImageEditorModule')
    .service('virtoCommerce.aviaryImageEditorModule.imageEditorService', ['FileUploader', 'platformWebApp.assets.api', 'platformWebApp.settings', 'platformWebApp.bladeNavigationService',
        function (FileUploader, assets, settings, bladeNavigationService) {
            var editor;

            function openAviarySettingManagement(blade) {
                var newBlade = {
                    id: 'settingsSection',
                    data: blade.apiKeyData,
                    moduleId: 'itemImage',
                    title: 'editor.blades.title',
                    subtitle: 'editor.blades.subtitle',
                    controller: 'platformWebApp.settingsDetailController',
                    template: '$(Platform)/Scripts/app/settings/blades/settings-detail.tpl.html',
                };
                bladeNavigationService.showBlade(newBlade, blade);
            };

            function addImageToCatalog(selectedImage, newURL, blade) {
                assets.uploadFromUrl({ folderUrl: getImageUrl(blade.item.code, blade.imageType).folderUrl, url: newURL }, function (data) {
                    _.each(data, function (x) {
                        blade.currentEntities = _.without(blade.currentEntities, selectedImage);
                        x.id = selectedImage.id;
                        x.group = selectedImage.group;
                        x.sortOrder = selectedImage.sortOrder;
                        x.name = selectedImage.sortOrder + selectedImage.name;
                        x.isImage = true;
                        blade.selectedImages = [];
                        blade.currentEntities.push(x);
                    });
                });
            };

            function addImageToAssets(selectedImage, newURL, blade) {
                blade.uploadCompleted = false;
                assets.uploadFromUrl({ folderUrl: blade.currentEntity.url, url: newURL, name: selectedImage.name }, function (data) {
                    blade.refresh();
                    blade.$scope.gridApi.grid.refresh();
                    blade.uploadCompleted = true;
                    blade.selectedImages = [];
                });
            };

            function getImageUrl(code, imageType) {
                var folderUrl = 'catalog/' + code + (imageType ? '/' + imageType : '');
                return { folderUrl: '/' + folderUrl, relative: 'api/platform/assets?folderUrl=' + folderUrl };
            };

            this.createImageEditorObject = function (blade, selectedImage) {
                return editor = new Aviary.Feather({
                    apiKey: blade.apiKeyData[0].value,
                    apiVersion: 3,
                    theme: 'light',
                    tools: 'all',
                    appendTo: '',
                    onSave: function (imageID, newURL) {
                        if (blade.id == 'assetList')
                            addImageToAssets(selectedImage, newURL, blade);
                        else
                            addImageToCatalog(selectedImage, newURL, blade);
                    },
                    onError: function (errorObj) {
                        alert(errorObj.message);
                        if (errorObj.code = 8)
                            openAviarySettingManagement(blade);
                    },
                    onLoad: function () {
                        editor.launch({
                            image: selectedImage.id,
                            url: selectedImage.url
                        });
                    }
                });
            };

        }]);