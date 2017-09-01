angular.module('virtoCommerce.aviaryImageEditorModule')
    .service('virtoCommerce.aviaryImageEditorModule.imageEditorService', ['FileUploader', 'platformWebApp.assets.api', 'platformWebApp.settings', 'platformWebApp.bladeNavigationService', 'virtoCommerce.catalogModule.imageTools',
        function (FileUploader, assets, settings, bladeNavigationService, imageTools) {
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
                return { folderUrl: folderUrl, relative: 'api/platform/assets?folderUrl=' + folderUrl };
            };

            function replaceAndCreateImageBackup(image, newUrl, blade) {
                assets.searchAssetItems({ folderUrl: getImageUrl(blade.item.code, blade.imageType).folderUrl, keyword: image.name.substr(0, _.lastIndexOf(image.name, '.')) + '_backup' }, function (searchResult) {
                    image.backupQuantity = searchResult.length;
                    var backupName = image.name.substr(0, _.lastIndexOf(image.name, '.')) + '_backup[' + (image.backupQuantity + 1) + '].jpg';
                    assets.uploadFromUrl({ folderUrl: getImageUrl(blade.item.code, blade.imageType).folderUrl, url: image.url, name: backupName }, function (data) {
                    });
                    assets.uploadFromUrl({ folderUrl: getImageUrl(blade.item.code, blade.imageType).folderUrl, url: newUrl, name: image.name }, function (data) {
                        _.each(data, function (x) {
                            var request = { imageUrl: x.url, isRegenerateAll: true };
                            blade.currentEntities = _.each(blade.currentEntities, function (z) { if (_.isEqual(z.id, image.id)) z.url = x.url + '?t=' + new Date().getTime() });
                            blade.item.images = blade.currentEntities;
                            _.each(blade.parentBlade.origItem.images, function (z) { if (_.isEqual(z.id, image.id)) z.url = x.url + '?t=' + new Date().getTime() });
                            imageTools.generateThumbnails(request, function (response) {
                                if (!response || response.error) {
                                    bladeNavigationService.setError(response.error, blade);
                                    blade.selectedImages = [];
                                }
                            });
                            blade.selectedImages = [];
                        });
                    });
                });
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
                            replaceAndCreateImageBackup(selectedImage, newURL, blade);
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