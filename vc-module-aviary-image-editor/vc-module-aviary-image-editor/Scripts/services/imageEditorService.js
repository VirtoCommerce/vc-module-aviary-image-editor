angular.module('virtoCommerce.aviaryImageEditorModule')
    .service('virtoCommerce.aviaryImageEditorModule.imageEditorService', ['FileUploader', 'platformWebApp.assets.api',
        function (FileUploader, assets) {
            var editor;

            function addImage(imageID, newURL, blade) {
                if (newURL) {
                    assets.uploadFromUrl({ folderUrl: getImageUrl(blade.item.code, blade.imageType).folderUrl, url: newURL }, function (data) {
                        _.each(data, function (x) {
                            blade.currentEntities = _.without(blade.currentEntities, blade.selectedImages[0]);
                            x.id = blade.selectedImages[0].id;
                            x.sortOrder = blade.currentEntities.length;
                            x.name = blade.item.code + 'D' + x.sortOrder + '.png';
                            x.isImage = true;
                            blade.currentEntities.push(x);
                        });
                        newURL = undefined;
                    });
                }
            };

            function getImageUrl(code, imageType) {
                var folderUrl = 'catalog/' + code + (imageType ? '/' + imageType : '');
                return { folderUrl: '/' + folderUrl, relative: 'api/platform/assets?folderUrl=' + folderUrl };
            };

            this.createUploader = function (blade) {
                return blade.uploader = new FileUploader({
                    blade: blade,
                    headers: { Accept: 'application/json' },
                    autoUpload: true,
                    removeAfterUpload: true
                });
            };

            this.createImageEditorObject = function (blade) {
                return editor = new Aviary.Feather({
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
                        editor.launch({
                            image: blade.selectedImages[0].id,
                            url: blade.selectedImages[0].url
                        });
                    }
                });
            };

        }]);