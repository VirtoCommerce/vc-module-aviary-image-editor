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

            function addImageToCatalog(imageID, newURL, blade) {
                if (newURL) {
                    assets.uploadFromUrl({ folderUrl: getImageUrl(blade.item.code, blade.imageType).folderUrl, url: newURL }, function (data) {
                        _.each(data, function (x) {
                            blade.currentEntities = _.without(blade.currentEntities, blade.selectedImages[0]);
                            if (blade.item) {
                                x.id = blade.selectedImages[0].id;
                                x.group = blade.selectedImages[0].group;
                                x.sortOrder = blade.selectedImages[0].sortOrder;
                                x.name = blade.item.code + 'D' + x.sortOrder + '.png';
                                x.isImage = true;
                                blade.selectedImages = [];
                            }
                            else {
                            }
                            blade.currentEntities.push(x);
                        });
                        newURL = undefined;
                    });
                }
            };

            function addImageToAssets(newURL, blade) {
                if (newURL) {
                    blade.uploadCompleted = false;
                    assets.uploadFromUrl({ folderUrl: blade.currentEntity.url, url: newURL }, function (data) {
                        blade.refresh();
                        blade.uploadCompleted = true;
                        blade.selectedImages = [];
                    });
                }
            };

            function getImageUrl(code, imageType) {
                var folderUrl = 'catalog/' + code + (imageType ? '/' + imageType : '');
                return { folderUrl: '/' + folderUrl, relative: 'api/platform/assets?folderUrl=' + folderUrl };
            };

            this.createCatalogUploader = function (blade) {
                return blade.uploader = new FileUploader({
                    blade: blade,
                    headers: { Accept: 'application/json' },
                    autoUpload: true,
                    removeAfterUpload: true
                });
            };

            this.createAssetsUploader = function (blade) {
                return blade.uploader = new FileUploader({
                    blade: blade,
                    headers: { Accept: 'application/json' },
                    url: 'api/platform/assets?folderUrl=' + blade.currentEntity.url,
                    method: 'POST',
                    //autoUpload: true,
                    removeAfterUpload: true
                });
            }

            this.createImageEditorObject = function (blade, name) {
                return editor = new Aviary.Feather({
                    apiKey: blade.apiKeyData[0].value,
                    apiVersion: 3,
                    theme: 'light',
                    tools: 'all',
                    appendTo: '',
                    onSave: function (imageID, newURL) {
                        if (name == 'assets')
                            addImageToAssets(newURL, blade);
                        else
                            addImageToCatalog(imageID, newURL, blade);
                    },
                    onError: function (errorObj) {
                        alert(errorObj.message);
                        openAviarySettingManagement(blade);
                    },
                    onLoad: function () {
                        editor.launch({
                            image: blade.selectedImages[0].id,
                            url: blade.selectedImages[0].url
                        });
                    }
                });
            };

        }]);