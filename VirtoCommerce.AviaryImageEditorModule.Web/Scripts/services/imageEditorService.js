angular.module('virtoCommerce.aviaryImageEditorModule')
    .service('virtoCommerce.aviaryImageEditorModule.imageEditorService', ['FileUploader', 'platformWebApp.assets.api', 'platformWebApp.settings', 'platformWebApp.bladeNavigationService', 
        function (FileUploader, assets, settings, bladeNavigationService) {
            var editor;

            function openAviarySettingManagement(blade) {
                var newBlade = {
                    id: 'settingsSection',
                    data: blade.apiKeyData,
                    moduleId: 'VirtoCommerce.AviaryImageEditorModule',
                    title: 'editor.blades.title',
                    subtitle: 'editor.blades.subtitle',
                    controller: 'platformWebApp.settingsDetailController',
                    template: '$(Platform)/Scripts/app/settings/blades/settings-detail.tpl.html',
                };
                bladeNavigationService.showBlade(newBlade, blade);
            };


            function replaceAndCreateImageBackup(image, newUrl, blade) {
                blade.uploadCompleted = false;
                assets.query({ folderUrl: getImageUrl(image.relativeUrl).folderUrl, keyword: image.name.substr(0, _.lastIndexOf(image.name, '.')) + '_backup' }, function (searchResult) {
                    image.backupQuantity = searchResult.length;
                    var backupName = image.name.substr(0, _.lastIndexOf(image.name, '.')) + '_backup[' + (image.backupQuantity + 1) + ']' + image.name.substr(_.lastIndexOf(image.name, '.'), image.name.length - 1);
                    assets.uploadFromUrl({ folderUrl: getImageUrl(image.relativeUrl).folderUrl, url: image.url, name: backupName }, function (data) {
                    });
                    assets.uploadFromUrl({ folderUrl: getImageUrl(image.relativeUrl).folderUrl, url: newUrl, name: image.name }, function (data) {
                        if (image.id === image.name) {
                            blade.refresh();
                            blade.$scope.gridApi.grid.refresh();
                            blade.uploadCompleted = true;
                            blade.selectedImages = [];
                        }
                        else
                        {
                            _.each(data, function (x) {
                                blade.currentEntities = _.each(blade.currentEntities, function (z) { if (_.isEqual(z.id, image.id)) z.url = x.url + '?t=' + new Date().getTime() });
                                blade.item.images = blade.currentEntities;
                                _.each(blade.parentBlade.origItem.images, function (z) { if (_.isEqual(z.id, image.id)) z.url = x.url + '?t=' + new Date().getTime() });
                                blade.uploadCompleted = true;
                                blade.selectedImages = [];
                                editor.close();
                            });
                        }
                    });
                })
            };

            function getImageUrl(relativeUrl) {
                var folderUrl;
                if (_.indexOf(relativeUrl, '/') == 0)
                    folderUrl = relativeUrl.slice(1, _.lastIndexOf(relativeUrl, '/'));
                else
                    folderUrl = relativeUrl.substr(0, _.lastIndexOf(relativeUrl, '/'));
                return { folderUrl: folderUrl, relative: 'api/platform/assets?folderUrl=' + folderUrl };
            };

            this.createImageEditorObject = function (blade, selectedImage) {
                return editor = new Aviary.Feather({
                    apiKey: blade.apiKeyData[0].value,
                    apiVersion: 3,
                    theme: 'light',
                    tools: 'all',
                    appendTo: '',
                    onSave: function (imageID, newURL) {
                        replaceAndCreateImageBackup(selectedImage, newURL, blade);
                    },
                    onError: function (errorObj) {
                        bladeNavigationService.setError(errorObj.message, blade);
                        if (errorObj.code == 8) {
                            openAviarySettingManagement(blade);
                        }
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
