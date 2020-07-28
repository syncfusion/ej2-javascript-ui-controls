window.sf = window.sf || {};
var sfuploader = (function (exports) {
'use strict';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CONTROL_WRAPPER = 'e-upload e-control-wrapper';
var INPUT_WRAPPER = 'e-file-select';
var DROP_AREA = 'e-file-drop';
var DROP_WRAPPER = 'e-file-select-wrap';
var LIST_PARENT = 'e-upload-files';
var FILE = 'e-upload-file-list';
var STATUS = 'e-file-status';
var ACTION_BUTTONS = 'e-upload-actions';
var UPLOAD_BUTTONS = 'e-file-upload-btn e-css e-btn e-flat e-primary';
var CLEAR_BUTTONS = 'e-file-clear-btn e-css e-btn e-flat';
var FILE_NAME = 'e-file-name';
var FILE_TYPE = 'e-file-type';
var FILE_SIZE = 'e-file-size';
var REMOVE_ICON = 'e-file-remove-btn';
var DELETE_ICON = 'e-file-delete-btn';
var SPINNER_PANE = 'e-spinner-pane';
var ABORT_ICON = 'e-file-abort-btn';
var RETRY_ICON = 'e-file-reload-btn';
var DRAG_HOVER = 'e-upload-drag-hover';
var PROGRESS_WRAPPER = 'e-upload-progress-wrap';
var PROGRESSBAR = 'e-upload-progress-bar';
var PROGRESSBAR_TEXT = 'e-progress-bar-text';
var UPLOAD_INPROGRESS = 'e-upload-progress';
var UPLOAD_SUCCESS = 'e-upload-success';
var UPLOAD_FAILED = 'e-upload-fails';
var TEXT_CONTAINER = 'e-file-container';
var VALIDATION_FAILS = 'e-validation-fails';
var RTL = 'e-rtl';
var DISABLED = 'e-disabled';
var RTL_CONTAINER = 'e-rtl-container';
var ICON_FOCUSED = 'e-clear-icon-focus';
var PROGRESS_INNER_WRAPPER = 'e-progress-inner-wrap';
var PAUSE_UPLOAD = 'e-file-pause-btn';
var RESUME_UPLOAD = 'e-file-play-btn';
var RESTRICT_RETRY = 'e-restrict-retry';
var wrapperAttr = ['title', 'style', 'class'];
var FORM_UPLOAD = 'e-form-upload';
var HIDDEN_INPUT = 'e-hidden-file-input';
var INVALID_FILE = 'e-file-invalid';
var INFORMATION = 'e-file-information';
var FilesProp = /** @class */ (function (_super) {
    __extends(FilesProp, _super);
    function FilesProp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('')
    ], FilesProp.prototype, "name", void 0);
    __decorate([
        sf.base.Property(null)
    ], FilesProp.prototype, "size", void 0);
    __decorate([
        sf.base.Property('')
    ], FilesProp.prototype, "type", void 0);
    return FilesProp;
}(sf.base.ChildProperty));
var ButtonsProps = /** @class */ (function (_super) {
    __extends(ButtonsProps, _super);
    function ButtonsProps() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('Browse...')
    ], ButtonsProps.prototype, "browse", void 0);
    __decorate([
        sf.base.Property('Upload')
    ], ButtonsProps.prototype, "upload", void 0);
    __decorate([
        sf.base.Property('Clear')
    ], ButtonsProps.prototype, "clear", void 0);
    return ButtonsProps;
}(sf.base.ChildProperty));
var AsyncSettings = /** @class */ (function (_super) {
    __extends(AsyncSettings, _super);
    function AsyncSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('')
    ], AsyncSettings.prototype, "saveUrl", void 0);
    __decorate([
        sf.base.Property('')
    ], AsyncSettings.prototype, "removeUrl", void 0);
    __decorate([
        sf.base.Property(0)
    ], AsyncSettings.prototype, "chunkSize", void 0);
    __decorate([
        sf.base.Property(3)
    ], AsyncSettings.prototype, "retryCount", void 0);
    __decorate([
        sf.base.Property(500)
    ], AsyncSettings.prototype, "retryAfterDelay", void 0);
    return AsyncSettings;
}(sf.base.ChildProperty));
/**
 * The uploader component allows to upload images, documents, and other files from local to server.
 * ```html
 * <input type='file' name='images[]' id='upload'/>
 * ```
 * ```typescript
 * <script>
 *   var uploadObj = new Uploader();
 *   uploadObj.appendTo('#upload');
 * </script>
 * ```
 */
var Uploader = /** @class */ (function (_super) {
    __extends(Uploader, _super);
    /**
     * Triggers when change the Uploader value.
     */
    function Uploader(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.initialAttr = { accept: null, multiple: false, disabled: false };
        _this.uploadedFilesData = [];
        _this.base64String = [];
        _this.isForm = false;
        _this.allTypes = false;
        _this.pausedData = [];
        _this.uploadMetaData = [];
        _this.tabIndex = '0';
        _this.btnTabIndex = '0';
        _this.disableKeyboardNavigation = false;
        _this.count = -1;
        _this.actionCompleteCount = 0;
        _this.flag = true;
        _this.selectedFiles = [];
        _this.uploaderName = 'UploadFiles';
        _this.fileStreams = [];
        _this.newFileRef = 0;
        _this.isFirstFileOnSelection = false;
        /**
         * Get the file item(li) which are shown in file list.
         * @private
         */
        _this.fileList = [];
        /**
         * Get the data of files which are shown in file list.
         * @private
         */
        _this.filesData = [];
        _this.uploaderOptions = options;
        return _this;
    }
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    Uploader.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'allowedExtensions':
                    this.setExtensions(this.allowedExtensions);
                    this.clearAll();
                    break;
                case 'enabled':
                    this.setControlStatus();
                    break;
                case 'multiple':
                    this.setMultipleSelection();
                    break;
                case 'enableRtl':
                    this.setRTL();
                    this.reRenderFileList();
                    break;
                case 'buttons':
                    this.buttons.browse = sf.base.isNullOrUndefined(this.buttons.browse) ? '' : this.buttons.browse;
                    this.buttons.clear = sf.base.isNullOrUndefined(this.buttons.clear) ? '' : this.buttons.clear;
                    this.buttons.upload = sf.base.isNullOrUndefined(this.buttons.upload) ? '' : this.buttons.upload;
                    this.renderButtonTemplates();
                    break;
                case 'dropArea':
                    this.unBindDropEvents();
                    this.updateDropArea();
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttrToElement();
                    this.updateHTMLAttrToWrapper();
                    this.checkHTMLAttributes(true);
                    break;
                case 'files':
                    this.renderPreLoadFiles();
                    break;
                case 'directoryUpload':
                    this.updateDirectoryAttributes();
                    break;
                case 'template':
                    if (!this.isServerBlazor) {
                        this.clearAll();
                    }
                    break;
                case 'minFileSize':
                case 'maxFileSize':
                case 'autoUpload':
                    this.clearAll();
                    break;
                case 'sequentialUpload':
                    this.clearAll();
                    break;
                case 'locale':
                    this.l10n.setLocale(this.locale);
                    this.setLocalizedTexts();
                    this.preLocaleObj = sf.base.getValue('currentLocale', this.l10n);
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
            }
        }
    };
    Uploader.prototype.setLocalizedTexts = function () {
        if (sf.base.isNullOrUndefined(this.template)) {
            if (typeof (this.buttons.browse) === 'string') {
                this.browseButton.innerText = (this.buttons.browse === 'Browse...') ?
                    this.localizedTexts('Browse') : this.buttons.browse;
                this.browseButton.setAttribute('title', this.browseButton.innerText);
                if (this.uploadWrapper && !sf.base.isNullOrUndefined(this.uploadWrapper.querySelector('.' + DROP_AREA))) {
                    this.uploadWrapper.querySelector('.' + DROP_AREA).innerHTML = this.localizedTexts('dropFilesHint');
                }
            }
            this.updateFileList();
        }
    };
    Uploader.prototype.getKeyValue = function (val) {
        var keyValue;
        for (var _i = 0, _a = Object.keys(this.preLocaleObj); _i < _a.length; _i++) {
            var key = _a[_i];
            if (this.preLocaleObj[key] === val) {
                keyValue = key;
            }
        }
        return keyValue;
    };
    Uploader.prototype.updateFileList = function () {
        var element;
        /* istanbul ignore next */
        if (this.fileList.length > 0 && !sf.base.isNullOrUndefined(this.uploadWrapper.querySelector('.' + LIST_PARENT))) {
            for (var i = 0; i < this.fileList.length; i++) {
                element = this.fileList[i].querySelector('.e-file-status');
                element.innerHTML = this.localizedTexts(this.getKeyValue(this.filesData[i].status));
                this.filesData[i].status = this.localizedTexts(this.getKeyValue(this.filesData[i].status));
                if (this.fileList[i].classList.contains(UPLOAD_SUCCESS)) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('delete'));
                }
                if (this.fileList[i].querySelector('.e-file-play-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('resume'));
                }
                if (this.fileList[i].querySelector('.e-file-remove-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('remove'));
                }
                if (this.fileList[i].querySelector('.e-file-reload-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('retry'));
                }
                if (!this.autoUpload) {
                    this.uploadButton.innerText = (this.buttons.upload === 'Upload') ?
                        this.localizedTexts('Upload') : this.buttons.upload;
                    this.uploadButton.setAttribute('title', this.localizedTexts('Upload'));
                    this.clearButton.innerText = (this.buttons.clear === 'Clear') ?
                        this.localizedTexts('Clear') : this.buttons.clear;
                    this.clearButton.setAttribute('title', this.localizedTexts('Clear'));
                }
            }
        }
    };
    Uploader.prototype.reRenderFileList = function () {
        if (this.listParent) {
            sf.base.detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createFileList(this.filesData);
            if (this.actionButtons) {
                this.removeActionButtons();
                this.renderActionButtons();
                this.checkActionButtonStatus();
            }
        }
    };
    Uploader.prototype.preRender = function () {
        this.localeText = { Browse: 'Browse...', Clear: 'Clear', Upload: 'Upload',
            dropFilesHint: 'Or drop files here', invalidMaxFileSize: 'File size is too large',
            invalidMinFileSize: 'File size is too small', invalidFileType: 'File type is not allowed',
            uploadFailedMessage: 'File failed to upload', uploadSuccessMessage: 'File uploaded successfully',
            removedSuccessMessage: 'File removed successfully', removedFailedMessage: 'Unable to remove file', inProgress: 'Uploading',
            readyToUploadMessage: 'Ready to upload', abort: 'Abort', remove: 'Remove', cancel: 'Cancel', delete: 'Delete file',
            pauseUpload: 'File upload paused', pause: 'Pause', resume: 'Resume', retry: 'Retry',
            fileUploadCancel: 'File upload canceled', invalidFileSelection: 'Invalid files selected', totalFiles: 'Total files',
            size: 'Size'
        };
        this.l10n = new sf.base.L10n('uploader', this.localeText, this.locale);
        this.preLocaleObj = sf.base.getValue('currentLocale', this.l10n);
        this.isServerBlazor = (sf.base.isBlazor() && this.isServerRendered) ? true : false;
        this.isBlazorTemplate = this.isServerBlazor && this.template !== '' && !sf.base.isNullOrUndefined(this.template) ? true : false;
        this.isBlazorSaveUrl = (this.isServerRendered &&
            (this.asyncSettings.saveUrl === '' || sf.base.isNullOrUndefined(this.asyncSettings.saveUrl))) ? true : false;
        if (this.isBlazorSaveUrl && this.sequentialUpload) {
            this.sequentialUpload = false;
        }
        this.formRendered();
        if (!this.isServerBlazor) {
            this.updateHTMLAttrToElement();
            this.checkHTMLAttributes(false);
            // tslint:disable-next-line
            var ejInstance = sf.base.getValue('ej2_instances', this.element);
            /* istanbul ignore next */
            if (this.element.tagName === 'EJS-UPLOADER') {
                var inputElement = this.createElement('input', { attrs: { type: 'file' } });
                var index = 0;
                for (index; index < this.element.attributes.length; index++) {
                    inputElement.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                    inputElement.innerHTML = this.element.innerHTML;
                }
                if (!inputElement.hasAttribute('name')) {
                    inputElement.setAttribute('name', 'UploadFiles');
                }
                this.element.appendChild(inputElement);
                this.element = inputElement;
                sf.base.setValue('ej2_instances', ejInstance, this.element);
            }
            /* istanbul ignore next */
            if (ejInstance[0].isPureReactComponent) {
                if (!sf.base.isNullOrUndefined(ejInstance[0].props.name)) {
                    this.element.setAttribute('name', ejInstance[0].props.name);
                }
                else if (!sf.base.isNullOrUndefined(ejInstance[0].props.id) && sf.base.isNullOrUndefined(ejInstance[0].props.name)) {
                    this.element.setAttribute('name', ejInstance[0].props.id);
                }
                else {
                    this.element.setAttribute('name', 'UploadFiles');
                }
            }
            if (sf.base.isNullOrUndefined(this.element.getAttribute('name'))) {
                this.element.setAttribute('name', this.element.getAttribute('id'));
            }
            if (!this.element.hasAttribute('type')) {
                this.element.setAttribute('type', 'file');
            }
            this.updateDirectoryAttributes();
        }
        this.keyConfigs = {
            enter: 'enter'
        };
        if (this.element.hasAttribute('tabindex')) {
            this.tabIndex = this.element.getAttribute('tabindex');
        }
        this.browserName = sf.base.Browser.info.name;
        this.uploaderName = this.element.getAttribute('name');
    };
    Uploader.prototype.formRendered = function () {
        var parentEle = sf.base.closest(this.element, 'form');
        if (!sf.base.isNullOrUndefined(parentEle)) {
            for (; parentEle && parentEle !== document.documentElement; parentEle = parentEle.parentElement) {
                if (parentEle.tagName === 'FORM') {
                    this.isForm = true;
                    this.formElement = parentEle;
                    parentEle.setAttribute('enctype', 'multipart/form-data');
                    parentEle.setAttribute('encoding', 'multipart/form-data');
                }
            }
        }
    };
    Uploader.prototype.getPersistData = function () {
        return this.addOnPersist(['filesData']);
    };
    /**
     * Return the module name of the component.
     */
    Uploader.prototype.getModuleName = function () {
        return 'uploader';
    };
    Uploader.prototype.updateDirectoryAttributes = function () {
        if (this.directoryUpload) {
            this.element.setAttribute('directory', 'true');
            this.element.setAttribute('webkitdirectory', 'true');
        }
        else {
            this.element.removeAttribute('directory');
            this.element.removeAttribute('webkitdirectory');
        }
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    Uploader.prototype.render = function () {
        if (!this.isServerBlazor) {
            this.renderBrowseButton();
            this.initializeUpload();
            this.updateHTMLAttrToWrapper();
            this.wireEvents();
            this.setMultipleSelection();
            this.setExtensions(this.allowedExtensions);
            this.setRTL();
            this.renderPreLoadFiles();
            this.setControlStatus();
            this.setCSSClass();
        }
        else {
            this.dropAreaWrapper = sf.base.closest(this.element, '.' + DROP_WRAPPER);
            this.uploadWrapper = sf.base.closest(this.element, '.e-upload.e-control-wrapper');
            this.browseButton = this.dropAreaWrapper.querySelector('button.e-upload-browse-btn');
            this.setDropArea();
            this.renderPreLoadFiles();
            this.wireEvents();
        }
        this.renderComplete();
    };
    Uploader.prototype.renderBrowseButton = function () {
        this.browseButton = this.createElement('button', { className: 'e-css e-btn', attrs: { 'type': 'button' } });
        this.browseButton.setAttribute('tabindex', this.tabIndex);
        if (typeof (this.buttons.browse) === 'string') {
            this.browseButton.textContent = (this.buttons.browse === 'Browse...') ?
                this.localizedTexts('Browse') : this.buttons.browse;
            this.browseButton.setAttribute('title', this.browseButton.innerText);
        }
        else {
            this.browseButton.appendChild(this.buttons.browse);
        }
        this.element.setAttribute('aria-label', 'Uploader');
    };
    Uploader.prototype.renderActionButtons = function () {
        this.element.setAttribute('tabindex', '-1');
        if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            this.actionButtons = this.createElement('div', { className: ACTION_BUTTONS });
            this.uploadButton = this.createElement('button', { className: UPLOAD_BUTTONS,
                attrs: { 'type': 'button', 'tabindex': this.btnTabIndex } });
            this.clearButton = this.createElement('button', { className: CLEAR_BUTTONS,
                attrs: { 'type': 'button', 'tabindex': this.btnTabIndex } });
            this.actionButtons.appendChild(this.clearButton);
            this.actionButtons.appendChild(this.uploadButton);
            this.renderButtonTemplates();
            this.uploadWrapper.appendChild(this.actionButtons);
            this.browseButton.blur();
            this.uploadButton.focus();
            this.wireActionButtonEvents();
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.serverActionButtonsEventBind = function (element) {
        if (element && !this.isForm) {
            this.browseButton.blur();
            this.actionButtons = element;
            this.uploadButton = this.actionButtons.querySelector('.e-file-upload-btn');
            this.clearButton = this.actionButtons.querySelector('.e-file-clear-btn');
            this.uploadButton.focus();
            this.unwireActionButtonEvents();
            this.wireActionButtonEvents();
            this.checkActionButtonStatus();
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.serverUlElement = function (element) {
        if (element) {
            if (this.isBlazorSaveUrl || this.isBlazorTemplate) {
                this.listParent = element;
                this.fileList = [].slice.call(this.listParent.querySelectorAll('li'));
                this.serverRemoveIconBindEvent();
                if (!this.isForm) {
                    this.checkAutoUpload(this.filesData);
                }
            }
        }
    };
    Uploader.prototype.wireActionButtonEvents = function () {
        sf.base.EventHandler.add(this.uploadButton, 'click', this.uploadButtonClick, this);
        sf.base.EventHandler.add(this.clearButton, 'click', this.clearButtonClick, this);
    };
    Uploader.prototype.unwireActionButtonEvents = function () {
        sf.base.EventHandler.remove(this.uploadButton, 'click', this.uploadButtonClick);
        sf.base.EventHandler.remove(this.clearButton, 'click', this.clearButtonClick);
    };
    Uploader.prototype.removeActionButtons = function () {
        if (this.actionButtons) {
            this.unwireActionButtonEvents();
            if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
                sf.base.detach(this.actionButtons);
            }
            this.actionButtons = null;
        }
    };
    Uploader.prototype.renderButtonTemplates = function () {
        if (typeof (this.buttons.browse) === 'string') {
            this.browseButton.textContent = (this.buttons.browse === 'Browse...') ?
                this.localizedTexts('Browse') : this.buttons.browse;
            this.browseButton.setAttribute('title', this.browseButton.textContent);
        }
        else {
            this.browseButton.innerHTML = '';
            this.browseButton.appendChild(this.buttons.browse);
        }
        if (this.uploadButton) {
            var uploadText = void 0;
            uploadText = sf.base.isNullOrUndefined(this.buttons.upload) ? 'Upload' : this.buttons.upload;
            this.buttons.upload = uploadText;
            if (typeof (this.buttons.upload) === 'string') {
                this.uploadButton.textContent = (this.buttons.upload === 'Upload') ?
                    this.localizedTexts('Upload') : this.buttons.upload;
                this.uploadButton.setAttribute('title', this.uploadButton.textContent);
            }
            else {
                this.uploadButton.innerHTML = '';
                this.uploadButton.appendChild(this.buttons.upload);
            }
        }
        if (this.clearButton) {
            var clearText = void 0;
            clearText = sf.base.isNullOrUndefined(this.buttons.clear) ? 'Clear' : this.buttons.clear;
            this.buttons.clear = clearText;
            if (typeof (this.buttons.clear) === 'string') {
                this.clearButton.textContent = (this.buttons.clear === 'Clear') ?
                    this.localizedTexts('Clear') : this.buttons.clear;
                this.clearButton.setAttribute('title', this.clearButton.textContent);
            }
            else {
                this.clearButton.innerHTML = '';
                this.clearButton.appendChild(this.buttons.clear);
            }
        }
    };
    Uploader.prototype.initializeUpload = function () {
        this.element.setAttribute('tabindex', '-1');
        var inputWrapper = this.createElement('span', { className: INPUT_WRAPPER });
        this.element.parentElement.insertBefore(inputWrapper, this.element);
        this.dropAreaWrapper = this.createElement('div', { className: DROP_WRAPPER });
        this.element.parentElement.insertBefore(this.dropAreaWrapper, this.element);
        inputWrapper.appendChild(this.element);
        this.dropAreaWrapper.appendChild(this.browseButton);
        this.dropAreaWrapper.appendChild(inputWrapper);
        this.uploadWrapper = this.createElement('div', { className: CONTROL_WRAPPER });
        this.dropAreaWrapper.parentElement.insertBefore(this.uploadWrapper, this.dropAreaWrapper);
        this.uploadWrapper.appendChild(this.dropAreaWrapper);
        this.setDropArea();
    };
    Uploader.prototype.renderPreLoadFiles = function () {
        if (this.files.length) {
            if (this.enablePersistence && this.filesData.length) {
                this.createFileList(this.filesData);
                return;
            }
            if (sf.base.isNullOrUndefined(this.files[0].size)) {
                return;
            }
            var files = [].slice.call(this.files);
            var filesData = [];
            if (!this.multiple) {
                this.clearData();
                files = [files[0]];
            }
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var data = files_1[_i];
                var fileData = {
                    name: data.name + '.' + data.type.split('.')[data.type.split('.').length - 1],
                    rawFile: '',
                    size: data.size,
                    status: this.localizedTexts('uploadSuccessMessage'),
                    type: data.type,
                    validationMessages: { minSize: '', maxSize: '' },
                    statusCode: '2'
                };
                filesData.push(fileData);
                this.filesData.push(fileData);
            }
            this.createFileList(filesData);
            if (!this.autoUpload && this.listParent && !this.actionButtons && (!this.isForm || this.allowUpload()) && this.showFileList) {
                this.renderActionButtons();
            }
            this.checkActionButtonStatus();
            if (this.sequentialUpload) {
                this.count = this.filesData.length - 1;
            }
        }
    };
    Uploader.prototype.checkActionButtonStatus = function () {
        if (this.actionButtons) {
            var length_1 = this.uploadWrapper.querySelectorAll('.' + VALIDATION_FAILS).length +
                this.uploadWrapper.querySelectorAll('.e-upload-fails:not(.e-upload-progress)').length +
                this.uploadWrapper.querySelectorAll('span.' + UPLOAD_SUCCESS).length +
                this.uploadWrapper.querySelectorAll('span.' + UPLOAD_INPROGRESS).length;
            if (length_1 > 0 && length_1 === this.uploadWrapper.querySelectorAll('li').length) {
                this.uploadButton.setAttribute('disabled', 'disabled');
            }
            else {
                this.uploadButton.removeAttribute('disabled');
            }
        }
    };
    Uploader.prototype.setDropArea = function () {
        var dropTextArea = this.dropAreaWrapper.querySelector('.e-file-drop');
        if (this.dropArea) {
            this.dropZoneElement = (typeof (this.dropArea) !== 'string') ? this.dropArea :
                document.querySelector(this.dropArea);
            var element = this.element;
            var enableDropText = false;
            while (element.parentNode) {
                element = element.parentNode;
                if (element === this.dropZoneElement) {
                    enableDropText = true;
                    if (!dropTextArea) {
                        this.createDropTextHint();
                    }
                    else if (!this.isServerBlazor) {
                        dropTextArea.innerHTML = this.localizedTexts('dropFilesHint');
                    }
                }
            }
            if (!enableDropText && dropTextArea) {
                dropTextArea.remove();
            }
        }
        else if (!sf.base.isNullOrUndefined(this.uploaderOptions) && this.uploaderOptions.dropArea === undefined) {
            this.createDropTextHint();
            this.dropZoneElement = this.uploadWrapper;
            this.setProperties({ dropArea: this.uploadWrapper }, true);
        }
        this.bindDropEvents();
    };
    Uploader.prototype.updateDropArea = function () {
        if (this.dropArea) {
            this.setDropArea();
        }
        else {
            this.dropZoneElement = null;
            var dropTextArea = this.dropAreaWrapper.querySelector('.e-file-drop');
            if (dropTextArea) {
                dropTextArea.remove();
            }
        }
    };
    Uploader.prototype.createDropTextHint = function () {
        if (!this.isServerBlazor) {
            var fileDropArea = this.createElement('span', { className: DROP_AREA });
            fileDropArea.innerHTML = this.localizedTexts('dropFilesHint');
            this.dropAreaWrapper.appendChild(fileDropArea);
        }
    };
    Uploader.prototype.updateHTMLAttrToElement = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var pro = _a[_i];
                if (wrapperAttr.indexOf(pro) < 0) {
                    this.element.setAttribute(pro, this.htmlAttributes[pro]);
                }
            }
        }
    };
    Uploader.prototype.updateHTMLAttrToWrapper = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var pro = _a[_i];
                if (wrapperAttr.indexOf(pro) > -1) {
                    if (pro === 'class') {
                        var updatedClassValues = (this.htmlAttributes[pro].replace(/\s+/g, ' ')).trim();
                        if (updatedClassValues !== '') {
                            sf.base.addClass([this.uploadWrapper], updatedClassValues.split(' '));
                        }
                    }
                    else if (pro === 'style') {
                        var uploadStyle = this.uploadWrapper.getAttribute(pro);
                        uploadStyle = !sf.base.isNullOrUndefined(uploadStyle) ? (uploadStyle + this.htmlAttributes[pro]) :
                            this.htmlAttributes[pro];
                        this.uploadWrapper.setAttribute(pro, uploadStyle);
                    }
                    else {
                        this.uploadWrapper.setAttribute(pro, this.htmlAttributes[pro]);
                    }
                }
            }
        }
    };
    Uploader.prototype.setMultipleSelection = function () {
        if (this.multiple && !this.element.hasAttribute('multiple')) {
            var newAttr = document.createAttribute('multiple');
            newAttr.value = 'multiple';
            this.element.setAttributeNode(newAttr);
        }
        else if (!this.multiple) {
            this.element.removeAttribute('multiple');
        }
    };
    Uploader.prototype.checkAutoUpload = function (fileData) {
        if (this.autoUpload) {
            if (this.sequentialUpload) {
                /* istanbul ignore next */
                this.sequenceUpload(fileData);
            }
            else {
                this.upload(fileData);
            }
            this.removeActionButtons();
        }
        else if (!this.actionButtons) {
            this.renderActionButtons();
        }
        this.checkActionButtonStatus();
    };
    Uploader.prototype.sequenceUpload = function (fileData) {
        if (this.filesData.length - fileData.length === 0 ||
            this.filesData[(this.filesData.length - fileData.length - 1)].statusCode !== '1') {
            ++this.count;
            var isFileListCreated = this.showFileList ? false : true;
            if (typeof this.filesData[this.count] === 'object') {
                this.isFirstFileOnSelection = false;
                this.upload(this.filesData[this.count], isFileListCreated);
                if (this.filesData[this.count].statusCode === '0') {
                    this.sequenceUpload(fileData);
                }
            }
            else {
                --this.count;
            }
        }
    };
    Uploader.prototype.setCSSClass = function (oldCSSClass) {
        var updatedCssClassValue = this.cssClass;
        if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValue = (this.cssClass.replace(/\s+/g, ' ')).trim();
        }
        if (!sf.base.isNullOrUndefined(this.cssClass) && updatedCssClassValue !== '') {
            sf.base.addClass([this.uploadWrapper], updatedCssClassValue.split(updatedCssClassValue.indexOf(',') > -1 ? ',' : ' '));
        }
        var updatedOldCssClass = oldCSSClass;
        if (!sf.base.isNullOrUndefined(oldCSSClass)) {
            updatedOldCssClass = (oldCSSClass.replace(/\s+/g, ' ')).trim();
        }
        if (!sf.base.isNullOrUndefined(oldCSSClass) && updatedOldCssClass !== '') {
            sf.base.removeClass([this.uploadWrapper], updatedOldCssClass.split(' '));
        }
    };
    Uploader.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.browseButton, 'click', this.browseButtonClick, this);
        sf.base.EventHandler.add(this.element, 'change', this.onSelectFiles, this);
        sf.base.EventHandler.add(document, 'click', this.removeFocus, this);
        this.keyboardModule = new sf.base.KeyboardEvents(this.uploadWrapper, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
        if (this.isForm) {
            sf.base.EventHandler.add(this.formElement, 'reset', this.resetForm, this);
        }
    };
    Uploader.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.browseButton, 'click', this.browseButtonClick);
        sf.base.EventHandler.remove(this.element, 'change', this.onSelectFiles);
        sf.base.EventHandler.remove(document, 'click', this.removeFocus);
        if (this.isForm) {
            sf.base.EventHandler.remove(this.formElement, 'reset', this.resetForm);
        }
        this.keyboardModule.destroy();
    };
    Uploader.prototype.resetForm = function () {
        this.clearAll();
    };
    Uploader.prototype.keyActionHandler = function (e) {
        var targetElement = e.target;
        switch (e.action) {
            case 'enter':
                if (e.target === this.clearButton) {
                    this.clearButtonClick();
                }
                else if (e.target === this.uploadButton) {
                    this.uploadButtonClick();
                }
                else if (e.target === this.browseButton) {
                    this.browseButtonClick();
                }
                else if (targetElement.classList.contains(PAUSE_UPLOAD)) {
                    var metaData = this.getCurrentMetaData(null, e);
                    metaData.file.statusCode = '4';
                    metaData.file.status = this.localizedTexts('pauseUpload');
                    this.abortUpload(metaData, false);
                }
                else if (targetElement.classList.contains(RESUME_UPLOAD)) {
                    this.resumeUpload(this.getCurrentMetaData(null, e), e);
                }
                else if (targetElement.classList.contains(RETRY_ICON)) {
                    var metaData = this.getCurrentMetaData(null, e);
                    if (!sf.base.isNullOrUndefined(metaData)) {
                        metaData.file.statusCode = '1';
                        metaData.file.status = this.localizedTexts('readyToUploadMessage');
                        this.chunkUpload(metaData.file);
                    }
                    else {
                        var target = e.target.parentElement;
                        var fileData = this.filesData[this.fileList.indexOf(target)];
                        this.retry(fileData);
                    }
                }
                else {
                    this.removeFiles(e);
                    if (!targetElement.classList.contains(ABORT_ICON)) {
                        this.browseButton.focus();
                    }
                }
                e.preventDefault();
                e.stopPropagation();
                break;
        }
    };
    Uploader.prototype.getCurrentMetaData = function (fileInfo, e) {
        var fileData;
        var targetMetaData;
        if (sf.base.isNullOrUndefined(fileInfo)) {
            var target = e.target.parentElement;
            fileData = this.filesData[this.fileList.indexOf(target)];
        }
        else {
            fileData = fileInfo;
        }
        for (var i = 0; i < this.uploadMetaData.length; i++) {
            if (this.uploadMetaData[i].file.name === fileData.name) {
                targetMetaData = this.uploadMetaData[i];
            }
        }
        return targetMetaData;
    };
    Uploader.prototype.removeFocus = function () {
        if (this.uploadWrapper && this.listParent && this.listParent.querySelector('.' + ICON_FOCUSED)) {
            document.activeElement.blur();
            this.listParent.querySelector('.' + ICON_FOCUSED).classList.remove(ICON_FOCUSED);
        }
    };
    Uploader.prototype.browseButtonClick = function () {
        this.element.click();
    };
    Uploader.prototype.uploadButtonClick = function () {
        if (this.sequentialUpload) {
            this.sequenceUpload(this.filesData);
        }
        else {
            this.upload(this.filesData);
        }
    };
    Uploader.prototype.clearButtonClick = function () {
        this.clearAll();
        /* istanbul ignore next */
        if (this.sequentialUpload) {
            this.count = -1;
        }
        this.actionCompleteCount = 0;
    };
    Uploader.prototype.bindDropEvents = function () {
        if (this.dropZoneElement) {
            sf.base.EventHandler.add(this.dropZoneElement, 'drop', this.dropElement, this);
            sf.base.EventHandler.add(this.dropZoneElement, 'dragover', this.dragHover, this);
            sf.base.EventHandler.add(this.dropZoneElement, 'dragleave', this.onDragLeave, this);
            sf.base.EventHandler.add(this.dropZoneElement, 'paste', this.onPasteFile, this);
        }
    };
    Uploader.prototype.unBindDropEvents = function () {
        if (this.dropZoneElement) {
            sf.base.EventHandler.remove(this.dropZoneElement, 'drop', this.dropElement);
            sf.base.EventHandler.remove(this.dropZoneElement, 'dragover', this.dragHover);
            sf.base.EventHandler.remove(this.dropZoneElement, 'dragleave', this.onDragLeave);
        }
    };
    Uploader.prototype.onDragLeave = function (e) {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
    };
    Uploader.prototype.dragHover = function (e) {
        if (!this.enabled) {
            return;
        }
        this.dropZoneElement.classList.add(DRAG_HOVER);
        if (this.dropEffect !== 'Default') {
            e.dataTransfer.dropEffect = this.dropEffect.toLowerCase();
        }
        e.preventDefault();
        e.stopPropagation();
    };
    /* istanbul ignore next */
    Uploader.prototype.dropElement = function (e) {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
        this.onSelectFiles(e);
        e.preventDefault();
        e.stopPropagation();
    };
    /* istanbul ignore next */
    Uploader.prototype.onPasteFile = function (event) {
        var item = event.clipboardData.items;
        if (item.length !== 1) {
            return;
        }
        var pasteFile = [].slice.call(item)[0];
        if ((pasteFile.kind === 'file') && pasteFile.type.match('^image/')) {
            this.renderSelectedFiles(event, [pasteFile.getAsFile()], false, true);
        }
    };
    Uploader.prototype.getSelectedFiles = function (index) {
        var data = [];
        var liElement = this.fileList[index];
        var allFiles = this.getFilesData();
        var nameElements = +liElement.getAttribute('data-files-count');
        var startIndex = 0;
        for (var i = 0; i < index; i++) {
            startIndex += (+this.fileList[i].getAttribute('data-files-count'));
        }
        for (var j = startIndex; j < (startIndex + nameElements); j++) {
            data.push(allFiles[j]);
        }
        return data;
    };
    Uploader.prototype.removeFiles = function (args) {
        if (!this.enabled) {
            return;
        }
        var selectedElement = args.target.parentElement;
        if (this.isBlazorSaveUrl) {
            this.fileList = [].slice.call(this.uploadWrapper.querySelectorAll('li'));
        }
        var index = this.fileList.indexOf(selectedElement);
        var liElement = this.fileList[index];
        var formUpload = this.isFormUpload();
        var fileData = formUpload ? this.getSelectedFiles(index) : this.getFilesInArray(this.filesData[index]);
        if (sf.base.isNullOrUndefined(fileData)) {
            return;
        }
        if (args.target.classList.contains(ABORT_ICON) && !formUpload) {
            fileData[0].statusCode = '5';
            if (!sf.base.isNullOrUndefined(liElement)) {
                var spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
                sf.popups.createSpinner({ target: spinnerTarget, width: '20px' });
                sf.popups.showSpinner(spinnerTarget);
            }
            if (this.sequentialUpload) {
                /* istanbul ignore next */
                this.uploadSequential();
            }
            if (!(liElement.classList.contains(RESTRICT_RETRY))) {
                this.checkActionComplete(true);
            }
        }
        else if (!sf.base.closest(args.target, '.' + SPINNER_PANE)) {
            this.remove(fileData, false, false, true, args);
        }
        this.element.value = '';
        this.checkActionButtonStatus();
    };
    Uploader.prototype.removeFilesData = function (file, customTemplate) {
        var index;
        if (customTemplate) {
            if (!this.showFileList) {
                index = this.filesData.indexOf(file);
                this.filesData.splice(index, 1);
            }
            return;
        }
        var selectedElement = this.getLiElement(file);
        if (sf.base.isNullOrUndefined(selectedElement)) {
            return;
        }
        if (!this.isBlazorSaveUrl) {
            sf.base.detach(selectedElement);
        }
        index = this.fileList.indexOf(selectedElement);
        this.fileList.splice(index, 1);
        this.filesData.splice(index, 1);
        if (!this.isBlazorSaveUrl) {
            if (this.fileList.length === 0 && !sf.base.isNullOrUndefined(this.listParent)) {
                sf.base.detach(this.listParent);
                this.listParent = null;
                this.removeActionButtons();
            }
            if (this.sequentialUpload) {
                /* istanbul ignore next */
                if (index <= this.count) {
                    --this.count;
                }
            }
        }
        else {
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('removeFileData', index);
        }
    };
    Uploader.prototype.removeUploadedFile = function (file, eventArgs, removeDirectly, custom) {
        var _this = this;
        var selectedFiles = file;
        var ajax = new sf.base.Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
        ajax.emitError = false;
        var formData = new FormData();
        ajax.beforeSend = function (e) {
            eventArgs.currentRequest = ajax.httpRequest;
            if (sf.base.isBlazor()) {
                if (_this.currentRequestHeader) {
                    _this.updateCustomheader(ajax.httpRequest, _this.currentRequestHeader);
                }
                if (_this.customFormDatas) {
                    _this.updateFormData(formData, _this.customFormDatas);
                }
            }
            if (!removeDirectly) {
                _this.trigger('removing', eventArgs, function (eventArgs) {
                    if (eventArgs.cancel) {
                        e.cancel = true;
                    }
                    else {
                        _this.removingEventCallback(eventArgs, formData, selectedFiles, file);
                    }
                });
            }
            else {
                _this.removingEventCallback(eventArgs, formData, selectedFiles, file);
            }
        };
        if (this.isServerBlazor) {
            var name_1 = this.element.getAttribute('name');
            if (!sf.base.isNullOrUndefined(selectedFiles.rawFile) && selectedFiles.rawFile !== '') {
                formData.append(name_1, selectedFiles.rawFile, selectedFiles.name);
            }
            else {
                formData.append(name_1, selectedFiles.name);
            }
        }
        ajax.onLoad = function (e) { _this.removeCompleted(e, selectedFiles, custom); return {}; };
        /* istanbul ignore next */
        ajax.onError = function (e) { _this.removeFailed(e, selectedFiles, custom); return {}; };
        ajax.send(formData);
    };
    Uploader.prototype.removingEventCallback = function (eventArgs, formData, selectedFiles, file) {
        /* istanbul ignore next */
        var name = this.element.getAttribute('name');
        var liElement = this.getLiElement(file);
        if (!sf.base.isNullOrUndefined(liElement) && (!sf.base.isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON)) ||
            !sf.base.isNullOrUndefined(liElement.querySelector('.' + REMOVE_ICON)))) {
            var spinnerTarget = void 0;
            spinnerTarget = liElement.querySelector('.' + DELETE_ICON) ? liElement.querySelector('.' + DELETE_ICON) :
                liElement.querySelector('.' + REMOVE_ICON);
            sf.popups.createSpinner({ target: spinnerTarget, width: '20px' });
            sf.popups.showSpinner(spinnerTarget);
        }
        if (!this.isServerBlazor) {
            if (eventArgs.postRawFile && !sf.base.isNullOrUndefined(selectedFiles.rawFile) && selectedFiles.rawFile !== '') {
                formData.append(name, selectedFiles.rawFile, selectedFiles.name);
            }
            else {
                formData.append(name, selectedFiles.name);
            }
            this.updateFormData(formData, eventArgs.customFormData);
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.updateFormData = function (formData, customData) {
        if (customData.length > 0 && customData[0]) {
            var _loop_1 = function (i) {
                var data = customData[i];
                // tslint:disable-next-line
                var value = Object.keys(data).map(function (e) {
                    return data[e];
                });
                formData.append(Object.keys(data)[0], value);
            };
            for (var i = 0; i < customData.length; i++) {
                _loop_1(i);
            }
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.updateCustomheader = function (request, currentRequest) {
        if (currentRequest.length > 0 && currentRequest[0]) {
            var _loop_2 = function (i) {
                var data = currentRequest[i];
                // tslint:disable-next-line
                var value = Object.keys(data).map(function (e) {
                    return data[e];
                });
                request.setRequestHeader(Object.keys(data)[0], value);
            };
            for (var i = 0; i < currentRequest.length; i++) {
                _loop_2(i);
            }
        }
    };
    Uploader.prototype.removeCompleted = function (e, files, customTemplate) {
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var args = {
            e: e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedSuccessMessage'), '2')
        };
        this.trigger('success', args);
        this.removeFilesData(files, customTemplate);
        var index = this.uploadedFilesData.indexOf(files);
        this.uploadedFilesData.splice(index, 1);
        this.trigger('change', { files: this.uploadedFilesData });
    };
    Uploader.prototype.removeFailed = function (e, files, customTemplate) {
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var args = {
            e: e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedFailedMessage'), '0')
        };
        if (!customTemplate) {
            var index = this.filesData.indexOf(files);
            var rootElement = this.fileList[index];
            if (rootElement) {
                var statusElement = rootElement.querySelector('.' + STATUS);
                rootElement.classList.remove(UPLOAD_SUCCESS);
                statusElement.classList.remove(UPLOAD_SUCCESS);
                rootElement.classList.add(UPLOAD_FAILED);
                statusElement.classList.add(UPLOAD_FAILED);
            }
            this.checkActionButtonStatus();
        }
        this.trigger('failure', args);
        var liElement = this.getLiElement(files);
        /* istanbul ignore next */
        if (!sf.base.isNullOrUndefined(liElement) && !sf.base.isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON))) {
            var spinnerTarget = liElement.querySelector('.' + DELETE_ICON);
            sf.popups.hideSpinner(spinnerTarget);
            sf.base.detach(liElement.querySelector('.e-spinner-pane'));
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.getFilesFromFolder = function (event) {
        this.filesEntries = [];
        var items;
        items = this.multiple ? event.dataTransfer.items : [event.dataTransfer.items[0]];
        var validDirectoryUpload = this.checkDirectoryUpload(items);
        if (!validDirectoryUpload) {
            return;
        }
        var _loop_3 = function (i) {
            // tslint:disable-next-line
            var item = items[i].webkitGetAsEntry();
            if (item.isFile) {
                var files_2 = [];
                // tslint:disable-next-line
                (item).file(function (fileObj) {
                    var path = item.fullPath;
                    files_2.push({ 'path': path, 'file': fileObj });
                });
                this_1.renderSelectedFiles(event, files_2, true);
            }
            else if (item.isDirectory) {
                this_1.traverseFileTree(item, event);
            }
        };
        var this_1 = this;
        for (var i = 0; i < items.length; i++) {
            _loop_3(i);
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.checkDirectoryUpload = function (items) {
        for (var i = 0; items && i < items.length; i++) {
            // tslint:disable-next-line
            var item = items[i].webkitGetAsEntry();
            if (item.isDirectory) {
                return true;
            }
        }
        return false;
    };
    // tslint:disable
    /* istanbul ignore next */
    Uploader.prototype.traverseFileTree = function (item, event) {
        if (item.isFile) {
            this.filesEntries.push(item);
        }
        else if (item.isDirectory) {
            // tslint:disable-next-line
            var directoryReader = item.createReader();
            // tslint:disable-next-line
            this.readFileFromDirectory(directoryReader, event);
        }
    };
    // tslint:disable
    /* istanbul ignore next */
    Uploader.prototype.readFileFromDirectory = function (directoryReader, event) {
        var _this = this;
        // tslint:disable-next-line
        directoryReader.readEntries(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                _this.traverseFileTree(entries[i]);
                // tslint:disable-next-line
            }
            
            _this.pushFilesEntries(event);
            if (entries.length) {
                _this.readFileFromDirectory(directoryReader);
            }
        });
    };
    Uploader.prototype.pushFilesEntries = function (event) {
        var _this = this;
        var files = [];
        var _loop_4 = function (i) {
            // tslint:disable-next-line
            this_2.filesEntries[i].file(function (fileObj) {
                if (_this.filesEntries) {
                    var path = _this.filesEntries[i].fullPath;
                    files.push({ 'path': path, 'file': fileObj });
                    if (i === _this.filesEntries.length - 1) {
                        _this.filesEntries = [];
                        _this.renderSelectedFiles(event, files, true);
                    }
                }
            });
        };
        var this_2 = this;
        for (var i = 0; i < this.filesEntries.length; i++) {
            _loop_4(i);
        }
    };
    // tslint:enable
    Uploader.prototype.onSelectFiles = function (args) {
        if (!this.enabled) {
            return;
        }
        var targetFiles;
        /* istanbul ignore next */
        if (args.type === 'drop') {
            if (this.directoryUpload) {
                this.getFilesFromFolder(args);
            }
            else {
                var files = this.sortFilesList = args.dataTransfer.files;
                if (this.browserName !== 'msie' && this.browserName !== 'edge') {
                    this.element.files = files;
                }
                targetFiles = this.multiple ? this.sortFileList(files) : [files[0]];
                this.renderSelectedFiles(args, targetFiles);
            }
        }
        else {
            targetFiles = [].slice.call(args.target.files);
            this.renderSelectedFiles(args, targetFiles);
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.getBase64 = function (file) {
        return new Promise(function (resolve, reject) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function () { return resolve(fileReader.result); };
            fileReader.onerror = function (error) { return reject(error); };
        });
    };
    /* istanbul ignore next */
    /* tslint:ignore */
    Uploader.prototype.renderSelectedFiles = function (args, 
    // tslint:disable-next-line
    targetFiles, directory, paste) {
        var _this = this;
        this.base64String = [];
        // tslint:disable-next-line
        var eventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            isModified: false,
            modifiedFilesData: [],
            progressInterval: '',
            isCanceled: false,
            currentRequest: null,
            customFormData: null
        };
        /* istanbul ignore next */
        if (targetFiles.length < 1) {
            eventArgs.isCanceled = true;
            this.trigger('selected', eventArgs);
            return;
        }
        this.flag = true;
        var fileData = [];
        if (!this.multiple) {
            this.clearData(true);
            targetFiles = [targetFiles[0]];
        }
        for (var i = 0; i < targetFiles.length; i++) {
            var file = directory ? targetFiles[i].file : targetFiles[i];
            this.updateInitialFileDetails(args, targetFiles, file, i, fileData, directory, paste);
        }
        eventArgs.filesData = fileData;
        if (this.allowedExtensions.indexOf('*') > -1) {
            this.allTypes = true;
        }
        if (!this.allTypes) {
            fileData = this.checkExtension(fileData);
        }
        this.trigger('selected', eventArgs, function (eventArgs) {
            _this._internalRenderSelect(eventArgs, fileData);
        });
    };
    Uploader.prototype.updateInitialFileDetails = function (args, 
    // tslint:disable-next-line
    targetFiles, file, i, fileData, directory, paste) {
        var fileName = directory ? targetFiles[i].path.substring(1, targetFiles[i].path.length) : paste ?
            sf.base.getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name) :
            this.directoryUpload ? targetFiles[i].webkitRelativePath : file.name;
        var fileDetails = {
            name: fileName,
            rawFile: file,
            size: file.size,
            status: this.localizedTexts('readyToUploadMessage'),
            type: this.getFileType(file.name),
            validationMessages: this.validatedFileSize(file.size),
            statusCode: '1',
            id: sf.base.getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name)
        };
        /* istanbul ignore next */
        if (paste) {
            fileDetails.fileSource = 'paste';
        }
        fileDetails.status = fileDetails.validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
            fileDetails.validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : fileDetails.status;
        if (fileDetails.validationMessages.minSize !== '' || fileDetails.validationMessages.maxSize !== '') {
            fileDetails.statusCode = '0';
        }
        fileData.push(fileDetails);
    };
    Uploader.prototype._internalRenderSelect = function (eventArgs, fileData) {
        if (!eventArgs.cancel) {
            /* istanbul ignore next */
            if (sf.base.isBlazor()) {
                this.currentRequestHeader = eventArgs.currentRequest;
                this.customFormDatas = eventArgs.customFormData;
            }
            this.selectedFiles = fileData;
            this.btnTabIndex = this.disableKeyboardNavigation ? '-1' : '0';
            if (this.showFileList) {
                if (eventArgs.isModified && eventArgs.modifiedFilesData.length > 0) {
                    for (var j = 0; j < eventArgs.modifiedFilesData.length; j++) {
                        for (var k = 0; k < fileData.length; k++) {
                            if (eventArgs.modifiedFilesData[j].id === fileData[k].id) {
                                eventArgs.modifiedFilesData[j].rawFile = fileData[k].rawFile;
                            }
                        }
                    }
                    var dataFiles = this.allTypes ? eventArgs.modifiedFilesData :
                        this.checkExtension(eventArgs.modifiedFilesData);
                    this.updateSortedFileList(dataFiles);
                    this.filesData = dataFiles;
                    if (!this.isForm || this.allowUpload()) {
                        this.checkAutoUpload(dataFiles);
                    }
                }
                else {
                    this.createFileList(fileData, true);
                    if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
                        this.filesData = this.filesData.concat(fileData);
                    }
                    if (!this.isForm || this.allowUpload()) {
                        if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
                            this.checkAutoUpload(fileData);
                        }
                    }
                }
                if (!sf.base.isNullOrUndefined(eventArgs.progressInterval) && eventArgs.progressInterval !== '') {
                    this.progressInterval = eventArgs.progressInterval;
                }
            }
            else {
                this.filesData = this.filesData.concat(fileData);
                if (this.isBlazorSaveUrl) {
                    // tslint:disable-next-line
                    this.interopAdaptor.invokeMethodAsync('updateServerFileData', this.filesData, this.isForm);
                }
                if (this.autoUpload) {
                    this.upload(this.filesData, true);
                }
            }
            this.raiseActionComplete();
            this.isFirstFileOnSelection = true;
        }
    };
    Uploader.prototype.allowUpload = function () {
        var allowFormUpload = false;
        if (this.isForm && (!sf.base.isNullOrUndefined(this.asyncSettings.saveUrl) && this.asyncSettings.saveUrl !== '')) {
            allowFormUpload = true;
        }
        return allowFormUpload;
    };
    Uploader.prototype.isFormUpload = function () {
        var isFormUpload = false;
        if (this.isForm && ((sf.base.isNullOrUndefined(this.asyncSettings.saveUrl) || this.asyncSettings.saveUrl === '')
            && (sf.base.isNullOrUndefined(this.asyncSettings.removeUrl) || this.asyncSettings.removeUrl === ''))) {
            isFormUpload = true;
        }
        return isFormUpload;
    };
    Uploader.prototype.clearData = function (singleUpload) {
        if (!sf.base.isNullOrUndefined(this.listParent) && !(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            sf.base.detach(this.listParent);
            this.listParent = null;
        }
        if (this.browserName !== 'msie' && !singleUpload) {
            this.element.value = '';
        }
        this.fileList = [];
        this.filesData = [];
        if (this.isBlazorSaveUrl || this.isBlazorTemplate) {
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('clearAll');
        }
        else {
            this.removeActionButtons();
        }
    };
    Uploader.prototype.updateSortedFileList = function (filesData) {
        var previousListClone = this.createElement('div', { id: 'clonewrapper' });
        var added = -1;
        var removedList;
        if (this.listParent) {
            for (var i = 0; i < this.listParent.querySelectorAll('li').length; i++) {
                var liElement = this.listParent.querySelectorAll('li')[i];
                previousListClone.appendChild(liElement.cloneNode(true));
            }
            removedList = this.listParent.querySelectorAll('li');
            for (var _i = 0, removedList_1 = removedList; _i < removedList_1.length; _i++) {
                var item = removedList_1[_i];
                sf.base.detach(item);
            }
            this.removeActionButtons();
            var oldList = [].slice.call(previousListClone.childNodes);
            sf.base.detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createParentUL();
            for (var index = 0; index < filesData.length; index++) {
                for (var j = 0; j < this.filesData.length; j++) {
                    if (this.filesData[j].name === filesData[index].name) {
                        this.listParent.appendChild(oldList[j]);
                        sf.base.EventHandler.add(oldList[j].querySelector('.e-icons'), 'click', this.removeFiles, this);
                        this.fileList.push(oldList[j]);
                        added = index;
                    }
                }
                if (added !== index) {
                    this.createFileList([filesData[index]]);
                }
            }
        }
        else {
            this.createFileList(filesData);
        }
    };
    Uploader.prototype.isBlank = function (str) {
        return (!str || /^\s*$/.test(str));
    };
    Uploader.prototype.checkExtension = function (files) {
        var dropFiles = files;
        if (!this.isBlank(this.allowedExtensions)) {
            var allowedExtensions = [];
            var extensions = this.allowedExtensions.split(',');
            for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                var extension = extensions_1[_i];
                allowedExtensions.push(extension.trim().toLocaleLowerCase());
            }
            for (var i = 0; i < files.length; i++) {
                if (allowedExtensions.indexOf(('.' + files[i].type).toLocaleLowerCase()) === -1) {
                    files[i].status = this.localizedTexts('invalidFileType');
                    files[i].statusCode = '0';
                }
            }
        }
        return dropFiles;
    };
    Uploader.prototype.validatedFileSize = function (fileSize) {
        var minSizeError = '';
        var maxSizeError = '';
        if (fileSize < this.minFileSize) {
            minSizeError = this.localizedTexts('invalidMinFileSize');
        }
        else if (fileSize > this.maxFileSize) {
            maxSizeError = this.localizedTexts('invalidMaxFileSize');
        }
        else {
            minSizeError = '';
            maxSizeError = '';
        }
        var errorMessage = { minSize: minSizeError, maxSize: maxSizeError };
        return errorMessage;
    };
    Uploader.prototype.isPreLoadFile = function (fileData) {
        var isPreload = false;
        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i].name === fileData.name.slice(0, fileData.name.lastIndexOf('.')) && this.files[i].type === fileData.type) {
                isPreload = true;
            }
        }
        return isPreload;
    };
    Uploader.prototype.createCustomfileList = function (fileData) {
        this.createParentUL();
        sf.base.resetBlazorTemplate(this.element.id + 'Template', 'Template');
        for (var _i = 0, fileData_1 = fileData; _i < fileData_1.length; _i++) {
            var listItem = fileData_1[_i];
            var liElement = this.createElement('li', { className: FILE, attrs: { 'data-file-name': listItem.name } });
            this.uploadTemplateFn = this.templateComplier(this.template);
            var fromElements = [].slice.call(this.uploadTemplateFn(listItem, null, null, this.element.id + 'Template', this.isStringTemplate));
            var index = fileData.indexOf(listItem);
            sf.base.append(fromElements, liElement);
            var eventArgs = {
                element: liElement,
                fileInfo: listItem,
                index: index,
                isPreload: this.isPreLoadFile(listItem)
            };
            var eventsArgs = {
                element: liElement,
                fileInfo: listItem,
                index: index,
                isPreload: this.isPreLoadFile(listItem)
            };
            this.trigger('rendering', eventArgs);
            this.trigger('fileListRendering', eventsArgs);
            this.listParent.appendChild(liElement);
            this.fileList.push(liElement);
        }
        sf.base.updateBlazorTemplate(this.element.id + 'Template', 'Template', this, false);
    };
    Uploader.prototype.createParentUL = function () {
        if (sf.base.isNullOrUndefined(this.listParent)) {
            this.listParent = this.createElement('ul', { className: LIST_PARENT });
            this.uploadWrapper.appendChild(this.listParent);
        }
    };
    Uploader.prototype.formFileList = function (fileData, files) {
        var fileList = this.createElement('li', { className: FILE });
        fileList.setAttribute('data-files-count', fileData.length + '');
        var fileContainer = this.createElement('span', { className: TEXT_CONTAINER });
        var statusMessage;
        for (var _i = 0, fileData_2 = fileData; _i < fileData_2.length; _i++) {
            var listItem = fileData_2[_i];
            var fileNameEle = this.createElement('span', { className: FILE_NAME });
            fileNameEle.innerHTML = this.getFileNameOnly(listItem.name);
            var fileTypeEle = this.createElement('span', { className: FILE_TYPE });
            fileTypeEle.innerHTML = '.' + this.getFileType(listItem.name);
            if (!this.enableRtl) {
                fileContainer.appendChild(fileNameEle);
                fileContainer.appendChild(fileTypeEle);
            }
            else {
                var rtlContainer = this.createElement('span', { className: RTL_CONTAINER });
                rtlContainer.appendChild(fileTypeEle);
                rtlContainer.appendChild(fileNameEle);
                fileContainer.appendChild(rtlContainer);
            }
            this.truncateName(fileNameEle);
            statusMessage = this.formValidateFileInfo(listItem, fileList);
        }
        fileList.appendChild(fileContainer);
        this.setListToFileInfo(fileData, fileList);
        var index = this.listParent.querySelectorAll('li').length;
        var infoEle = this.createElement('span');
        if (fileList.classList.contains(INVALID_FILE)) {
            infoEle.classList.add(STATUS);
            infoEle.classList.add(INVALID_FILE);
            infoEle.innerText = fileData.length > 1 ? this.localizedTexts('invalidFileSelection') : statusMessage;
        }
        else {
            infoEle.classList.add(fileData.length > 1 ? INFORMATION : FILE_SIZE);
            infoEle.innerText = fileData.length > 1 ? this.localizedTexts('totalFiles') + ': ' + fileData.length + ' , '
                + this.localizedTexts('size') + ': ' +
                this.bytesToSize(this.getFileSize(fileData)) : this.bytesToSize(fileData[0].size);
            this.createFormInput(fileData);
        }
        fileContainer.appendChild(infoEle);
        if (sf.base.isNullOrUndefined(fileList.querySelector('.e-icons'))) {
            var iconElement = this.createElement('span', { className: 'e-icons', attrs: { 'tabindex': this.btnTabIndex } });
            /* istanbul ignore next */
            if (this.browserName === 'msie') {
                iconElement.classList.add('e-msie');
            }
            iconElement.setAttribute('title', this.localizedTexts('remove'));
            fileList.appendChild(fileContainer);
            fileList.appendChild(iconElement);
            sf.base.EventHandler.add(iconElement, 'click', this.removeFiles, this);
            iconElement.classList.add(REMOVE_ICON);
        }
        var eventArgs = {
            element: fileList,
            fileInfo: this.mergeFileInfo(fileData, fileList),
            index: index,
            isPreload: this.isPreLoadFile(this.mergeFileInfo(fileData, fileList))
        };
        var eventsArgs = {
            element: fileList,
            fileInfo: this.mergeFileInfo(fileData, fileList),
            index: index,
            isPreload: this.isPreLoadFile(this.mergeFileInfo(fileData, fileList))
        };
        this.trigger('rendering', eventArgs);
        this.trigger('fileListRendering', eventsArgs);
        this.listParent.appendChild(fileList);
        this.fileList.push(fileList);
    };
    Uploader.prototype.formValidateFileInfo = function (listItem, fileList) {
        var statusMessage = listItem.status;
        var validationMessages = this.validatedFileSize(listItem.size);
        if (validationMessages.minSize !== '' || validationMessages.maxSize !== '') {
            this.addInvalidClass(fileList);
            statusMessage = validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
                validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : statusMessage;
        }
        var typeValidationMessage = this.checkExtension(this.getFilesInArray(listItem))[0].status;
        if (typeValidationMessage === this.localizedTexts('invalidFileType')) {
            this.addInvalidClass(fileList);
            statusMessage = typeValidationMessage;
        }
        return statusMessage;
    };
    Uploader.prototype.addInvalidClass = function (fileList) {
        fileList.classList.add(INVALID_FILE);
    };
    Uploader.prototype.createFormInput = function (fileData) {
        var inputElement = this.element.cloneNode(true);
        inputElement.classList.add(HIDDEN_INPUT);
        for (var _i = 0, fileData_3 = fileData; _i < fileData_3.length; _i++) {
            var listItem = fileData_3[_i];
            listItem.input = inputElement;
        }
        inputElement.setAttribute('name', this.uploaderName);
        this.uploadWrapper.querySelector('.' + INPUT_WRAPPER).appendChild(inputElement);
        if (this.browserName !== 'msie' && this.browserName !== 'edge') {
            this.element.value = '';
        }
    };
    Uploader.prototype.getFileSize = function (fileData) {
        var fileSize = 0;
        for (var _i = 0, fileData_4 = fileData; _i < fileData_4.length; _i++) {
            var file = fileData_4[_i];
            fileSize += file.size;
        }
        return fileSize;
    };
    Uploader.prototype.mergeFileInfo = function (fileData, fileList) {
        var result = {
            name: '',
            rawFile: '',
            size: 0,
            status: '',
            type: '',
            validationMessages: { minSize: '', maxSize: '' },
            statusCode: '1',
            list: fileList
        };
        var fileNames = [];
        var type = '';
        for (var _i = 0, fileData_5 = fileData; _i < fileData_5.length; _i++) {
            var listItem = fileData_5[_i];
            fileNames.push(listItem.name);
            type = listItem.type;
        }
        result.name = fileNames.join(', ');
        result.size = this.getFileSize(fileData);
        result.type = type;
        result.status = this.statusForFormUpload(fileData, fileList);
        return result;
    };
    Uploader.prototype.statusForFormUpload = function (fileData, fileList) {
        var isValid = true;
        var statusMessage;
        for (var _i = 0, fileData_6 = fileData; _i < fileData_6.length; _i++) {
            var listItem = fileData_6[_i];
            statusMessage = listItem.status;
            var validationMessages = this.validatedFileSize(listItem.size);
            if (validationMessages.minSize !== '' || validationMessages.maxSize !== '') {
                isValid = false;
                statusMessage = validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
                    validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : statusMessage;
            }
            var typeValidationMessage = this.checkExtension(this.getFilesInArray(listItem))[0].status;
            if (typeValidationMessage === this.localizedTexts('invalidFileType')) {
                isValid = false;
                statusMessage = typeValidationMessage;
            }
        }
        if (!isValid) {
            fileList.classList.add(INVALID_FILE);
            statusMessage = fileData.length > 1 ? this.localizedTexts('invalidFileSelection') : statusMessage;
        }
        else {
            statusMessage = this.localizedTexts('totalFiles') + ': ' + fileData.length + ' , '
                + this.localizedTexts('size') + ': ' +
                this.bytesToSize(this.getFileSize(fileData));
        }
        return statusMessage;
    };
    Uploader.prototype.formCustomFileList = function (fileData, files) {
        this.createParentUL();
        sf.base.resetBlazorTemplate(this.element.id + 'Template', 'Template');
        var fileList = this.createElement('li', { className: FILE });
        fileList.setAttribute('data-files-count', fileData.length + '');
        this.setListToFileInfo(fileData, fileList);
        var result = this.mergeFileInfo(fileData, fileList);
        fileList.setAttribute('data-file-name', result.name);
        this.uploadTemplateFn = this.templateComplier(this.template);
        var fromElements = [].slice.call(this.uploadTemplateFn(result, null, null, this.element.id + 'Template', this.isStringTemplate));
        var index = this.listParent.querySelectorAll('li').length;
        sf.base.append(fromElements, fileList);
        if (!fileList.classList.contains(INVALID_FILE)) {
            this.createFormInput(fileData);
        }
        var eventArgs = {
            element: fileList,
            fileInfo: result,
            index: index,
            isPreload: this.isPreLoadFile(result)
        };
        var eventsArgs = {
            element: fileList,
            fileInfo: result,
            index: index,
            isPreload: this.isPreLoadFile(result)
        };
        this.trigger('rendering', eventArgs);
        this.trigger('fileListRendering', eventsArgs);
        this.listParent.appendChild(fileList);
        this.fileList.push(fileList);
        sf.base.updateBlazorTemplate(this.element.id + 'Template', 'Template', this, false);
    };
    /**
     * Create the file list for specified files data.
     * @param { FileInfo[] } fileData - specifies the files data for file list creation.
     * @returns void
     */
    Uploader.prototype.createFileList = function (fileData, isSelectedFile) {
        if (this.isBlazorSaveUrl || this.isBlazorTemplate) {
            var fileListData = (isSelectedFile) ? this.filesData = this.filesData.concat(fileData) : fileData;
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('createFileList', fileListData, this.isForm);
        }
        else {
            this.createParentUL();
            if (this.template !== '' && !sf.base.isNullOrUndefined(this.template)) {
                if (this.isFormUpload()) {
                    this.uploadWrapper.classList.add(FORM_UPLOAD);
                    this.formCustomFileList(fileData, this.element.files);
                }
                else {
                    this.createCustomfileList(fileData);
                }
            }
            else if (this.isFormUpload()) {
                this.uploadWrapper.classList.add(FORM_UPLOAD);
                this.formFileList(fileData, this.element.files);
            }
            else {
                for (var _i = 0, fileData_7 = fileData; _i < fileData_7.length; _i++) {
                    var listItem = fileData_7[_i];
                    var liElement = this.createElement('li', {
                        className: FILE,
                        attrs: { 'data-file-name': listItem.name, 'data-files-count': '1' }
                    });
                    var textContainer = this.createElement('span', { className: TEXT_CONTAINER });
                    var textElement = this.createElement('span', { className: FILE_NAME, attrs: { 'title': listItem.name } });
                    textElement.innerHTML = this.getFileNameOnly(listItem.name);
                    var fileExtension = this.createElement('span', { className: FILE_TYPE });
                    fileExtension.innerHTML = '.' + this.getFileType(listItem.name);
                    if (!this.enableRtl) {
                        textContainer.appendChild(textElement);
                        textContainer.appendChild(fileExtension);
                    }
                    else {
                        var rtlContainer = this.createElement('span', { className: RTL_CONTAINER });
                        rtlContainer.appendChild(fileExtension);
                        rtlContainer.appendChild(textElement);
                        textContainer.appendChild(rtlContainer);
                    }
                    var fileSize = this.createElement('span', { className: FILE_SIZE });
                    fileSize.innerHTML = this.bytesToSize(listItem.size);
                    textContainer.appendChild(fileSize);
                    var statusElement = this.createElement('span', { className: STATUS });
                    textContainer.appendChild(statusElement);
                    statusElement.innerHTML = listItem.status;
                    liElement.appendChild(textContainer);
                    var iconElement = this.createElement('span', { className: ' e-icons',
                        attrs: { 'tabindex': this.btnTabIndex } });
                    /* istanbul ignore next */
                    if (this.browserName === 'msie') {
                        iconElement.classList.add('e-msie');
                    }
                    iconElement.setAttribute('title', this.localizedTexts('remove'));
                    liElement.appendChild(iconElement);
                    sf.base.EventHandler.add(iconElement, 'click', this.removeFiles, this);
                    if (listItem.statusCode === '2') {
                        statusElement.classList.add(UPLOAD_SUCCESS);
                        iconElement.classList.add(DELETE_ICON);
                        iconElement.setAttribute('title', this.localizedTexts('delete'));
                    }
                    else if (listItem.statusCode !== '1') {
                        statusElement.classList.remove(UPLOAD_SUCCESS);
                        statusElement.classList.add(VALIDATION_FAILS);
                    }
                    if (this.autoUpload && listItem.statusCode === '1' && this.asyncSettings.saveUrl !== '') {
                        statusElement.innerHTML = '';
                    }
                    if (!iconElement.classList.contains(DELETE_ICON)) {
                        iconElement.classList.add(REMOVE_ICON);
                    }
                    var index = fileData.indexOf(listItem);
                    var eventArgs = {
                        element: liElement,
                        fileInfo: listItem,
                        index: index,
                        isPreload: this.isPreLoadFile(listItem)
                    };
                    var eventsArgs = {
                        element: liElement,
                        fileInfo: listItem,
                        index: index,
                        isPreload: this.isPreLoadFile(listItem)
                    };
                    this.trigger('rendering', eventArgs);
                    this.trigger('fileListRendering', eventsArgs);
                    this.listParent.appendChild(liElement);
                    this.fileList.push(liElement);
                    this.truncateName(textElement);
                    var preventActionComplete = this.flag;
                    if (this.isPreLoadFile(listItem)) {
                        this.flag = false;
                        this.checkActionComplete(true);
                        this.flag = preventActionComplete;
                    }
                }
            }
        }
    };
    Uploader.prototype.getSlicedName = function (nameElement) {
        var text;
        text = nameElement.textContent;
        nameElement.dataset.tail = text.slice(text.length - 10);
    };
    Uploader.prototype.setListToFileInfo = function (fileData, fileList) {
        for (var _i = 0, fileData_8 = fileData; _i < fileData_8.length; _i++) {
            var listItem = fileData_8[_i];
            listItem.list = fileList;
        }
    };
    Uploader.prototype.truncateName = function (name) {
        var nameElement = name;
        if (this.browserName !== 'edge' && nameElement.offsetWidth < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
            /* istanbul ignore next */
        }
        else if (nameElement.offsetWidth + 1 < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
        }
    };
    Uploader.prototype.getFileType = function (name) {
        var extension;
        var index = name.lastIndexOf('.');
        if (index >= 0) {
            extension = name.substring(index + 1);
        }
        return extension ? extension : '';
    };
    Uploader.prototype.getFileNameOnly = function (name) {
        var type = this.getFileType(name);
        var names = name.split('.' + type);
        return type = names[0];
    };
    Uploader.prototype.setInitialAttributes = function () {
        if (this.initialAttr.accept) {
            this.element.setAttribute('accept', this.initialAttr.accept);
        }
        if (this.initialAttr.disabled) {
            this.element.setAttribute('disabled', 'disabled');
        }
        if (this.initialAttr.multiple) {
            var newAttr = document.createAttribute('multiple');
            this.element.setAttributeNode(newAttr);
        }
    };
    Uploader.prototype.filterfileList = function (files) {
        var filterFiles = [];
        var li;
        for (var i = 0; i < files.length; i++) {
            li = this.getLiElement(files[i]);
            if (!li.classList.contains(UPLOAD_SUCCESS)) {
                filterFiles.push(files[i]);
            }
        }
        return filterFiles;
    };
    Uploader.prototype.updateStatus = function (files, status, statusCode, updateLiStatus) {
        if (updateLiStatus === void 0) { updateLiStatus = true; }
        if (!(status === '' || sf.base.isNullOrUndefined(status)) && !(statusCode === '' || sf.base.isNullOrUndefined(statusCode))) {
            if (this.isBlazorSaveUrl) {
                for (var i = 0; i < this.filesData.length; i++) {
                    if (this.filesData[i].name === files.name) {
                        this.filesData[i].status = status;
                        this.filesData[i].statusCode = statusCode;
                    }
                }
            }
            else {
                files.status = status;
                files.statusCode = statusCode;
            }
        }
        if (updateLiStatus) {
            var li = this.getLiElement(files);
            if (!sf.base.isNullOrUndefined(li)) {
                if (!sf.base.isNullOrUndefined(li.querySelector('.' + STATUS)) && !((status === '' || sf.base.isNullOrUndefined(status)))) {
                    li.querySelector('.' + STATUS).textContent = status;
                }
            }
        }
        return files;
    };
    Uploader.prototype.getLiElement = function (files) {
        var index;
        for (var i = 0; i < this.filesData.length; i++) {
            if (this.filesData[i].name === files.name) {
                index = i;
            }
        }
        return this.fileList[index];
    };
    Uploader.prototype.createProgressBar = function (liElement) {
        var progressbarWrapper = this.createElement('span', { className: PROGRESS_WRAPPER });
        var progressBar = this.createElement('progressbar', { className: PROGRESSBAR, attrs: { value: '0', max: '100' } });
        var progressbarInnerWrapper = this.createElement('span', { className: PROGRESS_INNER_WRAPPER });
        progressBar.setAttribute('style', 'width: 0%');
        var progressbarText = this.createElement('span', { className: PROGRESSBAR_TEXT });
        progressbarText.textContent = '0%';
        progressbarInnerWrapper.appendChild(progressBar);
        progressbarWrapper.appendChild(progressbarInnerWrapper);
        progressbarWrapper.appendChild(progressbarText);
        liElement.querySelector('.' + TEXT_CONTAINER).appendChild(progressbarWrapper);
    };
    /* istanbul ignore next */
    Uploader.prototype.updateProgressbar = function (e, li) {
        if (!isNaN(Math.round((e.loaded / e.total) * 100)) && !sf.base.isNullOrUndefined(li.querySelector('.' + PROGRESSBAR))) {
            if (!sf.base.isNullOrUndefined(this.progressInterval) && this.progressInterval !== '') {
                var value = (Math.round((e.loaded / e.total) * 100)) % parseInt(this.progressInterval, 10);
                if (value === 0 || value === 100) {
                    this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
                }
            }
            else {
                this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
            }
        }
    };
    Uploader.prototype.changeProgressValue = function (li, progressValue) {
        li.querySelector('.' + PROGRESSBAR).setAttribute('style', 'width:' + progressValue);
        li.querySelector('.' + PROGRESSBAR_TEXT).textContent = progressValue;
    };
    Uploader.prototype.uploadInProgress = function (e, files, customUI, request) {
        var li = this.getLiElement(files);
        if (sf.base.isNullOrUndefined(li) && (!customUI)) {
            return;
        }
        if (!sf.base.isNullOrUndefined(li)) {
            /* istanbul ignore next */
            if (files.statusCode === '5') {
                this.cancelUploadingFile(files, e, request, li);
            }
            if (!(li.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0) && li.querySelector('.' + STATUS)) {
                li.querySelector('.' + STATUS).classList.add(UPLOAD_INPROGRESS);
                this.createProgressBar(li);
                this.updateProgressBarClasses(li, UPLOAD_INPROGRESS);
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            }
            this.updateProgressbar(e, li);
            var iconEle = li.querySelector('.' + REMOVE_ICON);
            if (!sf.base.isNullOrUndefined(iconEle)) {
                iconEle.classList.add(ABORT_ICON, UPLOAD_INPROGRESS);
                iconEle.setAttribute('title', this.localizedTexts('abort'));
                iconEle.classList.remove(REMOVE_ICON);
            }
        }
        else {
            this.cancelUploadingFile(files, e, request);
        }
        var args = { e: e, operation: 'upload', file: this.updateStatus(files, this.localizedTexts('inProgress'), '3') };
        this.trigger('progress', args);
    };
    /* istanbul ignore next */
    Uploader.prototype.cancelUploadingFile = function (files, e, request, li) {
        var _this = this;
        if (files.statusCode === '5') {
            var eventArgs = {
                event: e,
                fileData: files,
                cancel: false
            };
            this.trigger('canceling', eventArgs, function (eventArgs) {
                if (eventArgs.cancel) {
                    files.statusCode = '3';
                    if (!sf.base.isNullOrUndefined(li)) {
                        var spinnerTarget = li.querySelector('.' + ABORT_ICON);
                        if (!sf.base.isNullOrUndefined(spinnerTarget)) {
                            sf.popups.hideSpinner(spinnerTarget);
                            sf.base.detach(li.querySelector('.e-spinner-pane'));
                        }
                    }
                }
                else {
                    request.emitError = false;
                    request.httpRequest.abort();
                    var formData = new FormData();
                    if (files.statusCode === '5') {
                        var name_2 = _this.element.getAttribute('name');
                        formData.append(name_2, files.name);
                        formData.append('cancel-uploading', files.name);
                        var ajax = new sf.base.Ajax(_this.asyncSettings.removeUrl, 'POST', true, null);
                        ajax.emitError = false;
                        ajax.onLoad = function (e) { _this.removecanceledFile(e, files); return {}; };
                        ajax.send(formData);
                    }
                }
            });
        }
    };
    Uploader.prototype.removecanceledFile = function (e, file) {
        var liElement = this.getLiElement(file);
        if (liElement.querySelector('.' + RETRY_ICON) || sf.base.isNullOrUndefined(liElement.querySelector('.' + ABORT_ICON))) {
            return;
        }
        this.updateStatus(file, this.localizedTexts('fileUploadCancel'), '5');
        this.renderFailureState(e, file, liElement);
        var spinnerTarget = liElement.querySelector('.' + REMOVE_ICON);
        if (!sf.base.isNullOrUndefined(liElement)) {
            sf.popups.hideSpinner(spinnerTarget);
            sf.base.detach(liElement.querySelector('.e-spinner-pane'));
        }
        var requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
        var args = { event: e, response: requestResponse, operation: 'cancel', file: file };
        this.trigger('success', args);
    };
    Uploader.prototype.renderFailureState = function (e, file, liElement) {
        var _this = this;
        this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        this.removeProgressbar(liElement, 'failure');
        if (!sf.base.isNullOrUndefined(liElement.querySelector('.e-file-status'))) {
            liElement.querySelector('.e-file-status').classList.add(UPLOAD_FAILED);
        }
        var deleteIcon = liElement.querySelector('.' + ABORT_ICON);
        if (sf.base.isNullOrUndefined(deleteIcon)) {
            return;
        }
        deleteIcon.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
        deleteIcon.classList.add(REMOVE_ICON);
        deleteIcon.setAttribute('title', this.localizedTexts('remove'));
        this.pauseButton = this.createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex } });
        deleteIcon.parentElement.insertBefore(this.pauseButton, deleteIcon);
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
        var retryElement = liElement.querySelector('.' + RETRY_ICON);
        /* istanbul ignore next */
        retryElement.addEventListener('click', function (e) { _this.reloadcanceledFile(e, file, liElement, false); }, false);
    };
    Uploader.prototype.reloadcanceledFile = function (e, file, liElement, custom) {
        file.statusCode = '1';
        file.status = this.localizedTexts('readyToUploadMessage');
        if (!custom) {
            liElement.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            if (!sf.base.isNullOrUndefined(liElement.querySelector('.' + RETRY_ICON))) {
                sf.base.detach(liElement.querySelector('.' + RETRY_ICON));
            }
            this.pauseButton = null;
        }
        /* istanbul ignore next */
        liElement.classList.add(RESTRICT_RETRY);
        this.upload([file]);
    };
    /* istanbul ignore next */
    Uploader.prototype.uploadComplete = function (e, file, customUI) {
        var status = e.target;
        if (status.readyState === 4 && status.status >= 200 && status.status <= 299) {
            var li = this.getLiElement(file);
            if (sf.base.isNullOrUndefined(li) && (!customUI || sf.base.isNullOrUndefined(customUI))) {
                return;
            }
            if (!sf.base.isNullOrUndefined(li)) {
                this.updateProgressBarClasses(li, UPLOAD_SUCCESS);
                this.removeProgressbar(li, 'success');
                var iconEle = li.querySelector('.' + ABORT_ICON);
                if (!sf.base.isNullOrUndefined(iconEle)) {
                    iconEle.classList.add(DELETE_ICON);
                    iconEle.setAttribute('title', this.localizedTexts('delete'));
                    iconEle.classList.remove(ABORT_ICON);
                    iconEle.classList.remove(UPLOAD_INPROGRESS);
                }
            }
            this.raiseSuccessEvent(e, file);
        }
        else {
            this.uploadFailed(e, file);
        }
    };
    Uploader.prototype.getResponse = function (e) {
        // tslint:disable-next-line
        var target = e.currentTarget;
        var response = {
            readyState: target.readyState,
            statusCode: target.status,
            statusText: target.statusText,
            headers: target.getAllResponseHeaders(),
            withCredentials: target.withCredentials
        };
        return response;
    };
    /* istanbul ignore next */
    Uploader.prototype.serverRemoveIconBindEvent = function () {
        if (this.uploadWrapper && this.isBlazorSaveUrl) {
            var iconElement = [].slice.call(this.uploadWrapper.querySelectorAll('ul li'));
            for (var i = 0; i < iconElement.length; i++) {
                var removeIconEle = (iconElement[i]) ? iconElement[i].querySelector('.e-icons') : null;
                if (removeIconEle) {
                    sf.base.EventHandler.remove(removeIconEle, 'click', this.removeFiles);
                    sf.base.EventHandler.add(removeIconEle, 'click', this.removeFiles, this);
                }
            }
        }
    };
    Uploader.prototype.raiseSuccessEvent = function (e, file) {
        var _this = this;
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var statusMessage = this.localizedTexts('uploadSuccessMessage');
        var args = {
            e: e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '2', false), statusText: statusMessage
        };
        if (!this.isBlazorSaveUrl) {
            var liElement = this.getLiElement(file);
            if (!sf.base.isNullOrUndefined(liElement)) {
                var spinnerEle = liElement.querySelector('.' + SPINNER_PANE);
                if (!sf.base.isNullOrUndefined(spinnerEle)) {
                    sf.popups.hideSpinner(liElement);
                    sf.base.detach(spinnerEle);
                }
            }
        }
        this.trigger('success', args, function (args) {
            // tslint:disable-next-line
            _this.updateStatus(file, args.statusText, '2');
            _this.uploadedFilesData.push(file);
            if (!_this.isBlazorSaveUrl) {
                _this.trigger('change', { file: _this.uploadedFilesData });
            }
            _this.checkActionButtonStatus();
            if (_this.fileList.length > 0) {
                if ((!(_this.getLiElement(file)).classList.contains(RESTRICT_RETRY))) {
                    _this.uploadSequential();
                    _this.checkActionComplete(true);
                }
                else {
                    /* istanbul ignore next */
                    (_this.getLiElement(file)).classList.remove(RESTRICT_RETRY);
                }
            }
        });
    };
    Uploader.prototype.uploadFailed = function (e, file) {
        var _this = this;
        var li = this.getLiElement(file);
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var statusMessage = this.localizedTexts('uploadFailedMessage');
        var args = {
            e: e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '0', false), statusText: statusMessage
        };
        if (!sf.base.isNullOrUndefined(li)) {
            this.renderFailureState(e, file, li);
        }
        this.trigger('failure', args, function (args) {
            // tslint:disable-next-line
            _this.updateStatus(file, args.statusText, '0');
            _this.checkActionButtonStatus();
            _this.uploadSequential();
            _this.checkActionComplete(true);
        });
    };
    Uploader.prototype.uploadSequential = function () {
        if (this.sequentialUpload) {
            if (this.autoUpload) {
                /* istanbul ignore next */
                this.checkAutoUpload(this.filesData);
            }
            else {
                this.uploadButtonClick();
            }
        }
    };
    Uploader.prototype.checkActionComplete = function (increment) {
        increment ? ++this.actionCompleteCount : --this.actionCompleteCount;
        this.raiseActionComplete();
    };
    Uploader.prototype.raiseActionComplete = function () {
        if ((this.filesData.length === this.actionCompleteCount) && this.flag) {
            this.flag = false;
            var eventArgs = {
                fileData: []
            };
            eventArgs.fileData = this.getSelectedFileStatus(this.selectedFiles);
            this.trigger('actionComplete', eventArgs);
        }
    };
    Uploader.prototype.getSelectedFileStatus = function (selectedFiles) {
        var matchFiles = [];
        var matchFilesIndex = 0;
        for (var selectFileIndex = 0; selectFileIndex < selectedFiles.length; selectFileIndex++) {
            var selectedFileData = selectedFiles[selectFileIndex];
            for (var fileDataIndex = 0; fileDataIndex < this.filesData.length; fileDataIndex++) {
                if (this.filesData[fileDataIndex].name === selectedFileData.name) {
                    matchFiles[matchFilesIndex] = this.filesData[fileDataIndex];
                    ++matchFilesIndex;
                }
            }
        }
        return matchFiles;
    };
    Uploader.prototype.updateProgressBarClasses = function (li, className) {
        var progressBar = li.querySelector('.' + PROGRESSBAR);
        if (!sf.base.isNullOrUndefined(progressBar)) {
            progressBar.classList.add(className);
        }
    };
    Uploader.prototype.removeProgressbar = function (li, callType) {
        var _this = this;
        if (!sf.base.isNullOrUndefined(li.querySelector('.' + PROGRESS_WRAPPER))) {
            this.progressAnimation = new sf.base.Animation({ duration: 1250 });
            this.progressAnimation.animate(li.querySelector('.' + PROGRESS_WRAPPER), { name: 'FadeOut' });
            this.progressAnimation.animate(li.querySelector('.' + PROGRESSBAR_TEXT), { name: 'FadeOut' });
            setTimeout(function () { _this.animateProgressBar(li, callType); }, 750);
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.animateProgressBar = function (li, callType) {
        if (callType === 'success') {
            li.classList.add(UPLOAD_SUCCESS);
            if (!sf.base.isNullOrUndefined(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(li.querySelector('.' + STATUS), { name: 'FadeIn' });
                li.querySelector('.' + STATUS).classList.add(UPLOAD_SUCCESS);
            }
        }
        else {
            if (!sf.base.isNullOrUndefined(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(li.querySelector('.' + STATUS), { name: 'FadeIn' });
                li.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
            }
        }
        if (li.querySelector('.' + PROGRESS_WRAPPER)) {
            sf.base.detach(li.querySelector('.' + PROGRESS_WRAPPER));
        }
    };
    Uploader.prototype.setExtensions = function (extensions) {
        if (extensions !== '' && !sf.base.isNullOrUndefined(extensions)) {
            this.element.setAttribute('accept', extensions);
        }
        else {
            this.element.removeAttribute('accept');
        }
    };
    Uploader.prototype.templateComplier = function (uploadTemplate) {
        if (uploadTemplate) {
            try {
                if (document.querySelectorAll(uploadTemplate).length) {
                    return sf.base.compile(document.querySelector(uploadTemplate).innerHTML.trim());
                }
            }
            catch (exception) {
                return sf.base.compile(uploadTemplate);
            }
        }
        return undefined;
    };
    Uploader.prototype.setRTL = function () {
        this.enableRtl ? sf.base.addClass([this.uploadWrapper], RTL) : sf.base.removeClass([this.uploadWrapper], RTL);
    };
    Uploader.prototype.localizedTexts = function (localeText) {
        this.l10n.setLocale(this.locale);
        return this.l10n.getConstant(localeText);
    };
    Uploader.prototype.setControlStatus = function () {
        if (!this.enabled) {
            this.uploadWrapper.classList.add(DISABLED);
            this.element.setAttribute('disabled', 'disabled');
            this.browseButton.setAttribute('disabled', 'disabled');
            if (!sf.base.isNullOrUndefined(this.clearButton)) {
                this.clearButton.setAttribute('disabled', 'disabled');
            }
            if (!sf.base.isNullOrUndefined(this.uploadButton)) {
                this.uploadButton.setAttribute('disabled', 'disabled');
            }
        }
        else {
            if (this.uploadWrapper.classList.contains(DISABLED)) {
                this.uploadWrapper.classList.remove(DISABLED);
            }
            if (!sf.base.isNullOrUndefined(this.browseButton) && this.element.hasAttribute('disabled')) {
                this.element.removeAttribute('disabled');
                this.browseButton.removeAttribute('disabled');
            }
            if (!sf.base.isNullOrUndefined(this.clearButton) && this.clearButton.hasAttribute('disabled')) {
                this.clearButton.removeAttribute('disabled');
            }
            if (!sf.base.isNullOrUndefined(this.uploadButton) && this.uploadButton.hasAttribute('disabled')) {
                this.uploadButton.hasAttribute('disabled');
            }
        }
    };
    Uploader.prototype.checkHTMLAttributes = function (isDynamic) {
        var attributes = isDynamic ? sf.base.isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['accept', 'multiple', 'disabled'];
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!sf.base.isNullOrUndefined(this.element.getAttribute(prop))) {
                switch (prop) {
                    case 'accept':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.uploaderOptions) || (this.uploaderOptions['allowedExtensions'] === undefined))
                            || isDynamic) {
                            this.setProperties({ allowedExtensions: this.element.getAttribute('accept') }, !isDynamic);
                            this.initialAttr.accept = this.allowedExtensions;
                        }
                        break;
                    case 'multiple':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.uploaderOptions) || (this.uploaderOptions['multiple'] === undefined)) || isDynamic) {
                            var isMutiple = this.element.getAttribute(prop) === 'multiple' ||
                                this.element.getAttribute(prop) === '' || this.element.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ multiple: isMutiple }, !isDynamic);
                            this.initialAttr.multiple = true;
                        }
                        break;
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.uploaderOptions) || (this.uploaderOptions['enabled'] === undefined)) || isDynamic) {
                            var isDisabled = this.element.getAttribute(prop) === 'disabled' ||
                                this.element.getAttribute(prop) === '' || this.element.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: isDisabled }, !isDynamic);
                            this.initialAttr.disabled = true;
                        }
                }
            }
        }
    };
    Uploader.prototype.chunkUpload = function (file, custom, fileIndex) {
        var start = 0;
        var end = Math.min(this.asyncSettings.chunkSize, file.size);
        var index = 0;
        var blob = file.rawFile.slice(start, end);
        var metaData = { chunkIndex: index, blob: blob, file: file, start: start, end: end, retryCount: 0, request: null };
        this.sendRequest(file, metaData, custom, fileIndex);
    };
    Uploader.prototype.sendRequest = function (file, metaData, custom, fileIndex) {
        var _this = this;
        var formData = new FormData();
        var blob = file.rawFile.slice(metaData.start, metaData.end);
        formData.append('chunkFile', blob, file.name);
        formData.append(this.uploaderName, blob, file.name);
        formData.append('chunk-index', metaData.chunkIndex.toString());
        formData.append('chunkIndex', metaData.chunkIndex.toString());
        var totalChunk = Math.max(Math.ceil(file.size / this.asyncSettings.chunkSize), 1);
        formData.append('total-chunk', totalChunk.toString());
        formData.append('totalChunk', totalChunk.toString());
        var ajax = new sf.base.Ajax({ url: this.asyncSettings.saveUrl, type: 'POST', async: true, contentType: null });
        ajax.emitError = false;
        ajax.onLoad = function (e) { _this.chunkUploadComplete(e, metaData, custom); return {}; };
        ajax.onUploadProgress = function (e) {
            _this.chunkUploadInProgress(e, metaData, custom);
            return {};
        };
        var eventArgs = {
            fileData: file,
            customFormData: [],
            cancel: false,
            chunkSize: this.asyncSettings.chunkSize === 0 ? null : this.asyncSettings.chunkSize
        };
        ajax.beforeSend = function (e) {
            eventArgs.currentRequest = ajax.httpRequest;
            eventArgs.currentChunkIndex = metaData.chunkIndex;
            /* istanbul ignore next */
            if (sf.base.isBlazor()) {
                if (_this.currentRequestHeader) {
                    _this.updateCustomheader(ajax.httpRequest, _this.currentRequestHeader);
                }
                if (_this.customFormDatas) {
                    _this.updateFormData(formData, _this.customFormDatas);
                }
            }
            if (eventArgs.currentChunkIndex === 0) {
                // This event is currently not required but to avoid breaking changes for previous customer, we have included.
                _this.trigger('uploading', eventArgs, function (eventArgs) {
                    _this.uploadingEventCallback(formData, eventArgs, e, file);
                });
            }
            else {
                _this.trigger('chunkUploading', eventArgs, function (eventArgs) {
                    _this.uploadingEventCallback(formData, eventArgs, e, file);
                });
            }
        };
        /* istanbul ignore next */
        ajax.onError = function (e) { _this.chunkUploadFailed(e, metaData, custom); return {}; };
        ajax.send(formData);
        metaData.request = ajax;
    };
    Uploader.prototype.uploadingEventCallback = function (formData, eventArgs, e, file) {
        if (eventArgs.cancel) {
            this.eventCancelByArgs(e, eventArgs, file);
        }
        else {
            this.updateFormData(formData, eventArgs.customFormData);
        }
    };
    Uploader.prototype.eventCancelByArgs = function (e, eventArgs, file) {
        var _this = this;
        e.cancel = true;
        if (eventArgs.fileData.statusCode === '5') {
            return;
        }
        var liElement = this.getLiElement(eventArgs.fileData);
        liElement.querySelector('.' + STATUS).innerHTML = this.localizedTexts('fileUploadCancel');
        liElement.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
        eventArgs.fileData.statusCode = '5';
        eventArgs.fileData.status = this.localizedTexts('fileUploadCancel');
        this.pauseButton = this.createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex } });
        var removeIcon = liElement.querySelector('.' + REMOVE_ICON);
        removeIcon.parentElement.insertBefore(this.pauseButton, removeIcon);
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
        /* istanbul ignore next */
        this.pauseButton.addEventListener('click', function (e) { _this.reloadcanceledFile(e, file, liElement); }, false);
        this.checkActionButtonStatus();
    };
    Uploader.prototype.checkChunkUpload = function () {
        return (this.asyncSettings.chunkSize <= 0 || sf.base.isNullOrUndefined(this.asyncSettings.chunkSize)) ? false : true;
    };
    Uploader.prototype.chunkUploadComplete = function (e, metaData, custom) {
        var _this = this;
        var response = e.target;
        var liElement;
        if (response.readyState === 4 && response.status >= 200 && response.status < 300) {
            var requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
            var totalChunk = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
            var eventArgs = {
                event: e,
                file: metaData.file,
                chunkIndex: metaData.chunkIndex,
                totalChunk: totalChunk,
                chunkSize: this.asyncSettings.chunkSize,
                response: requestResponse
            };
            this.trigger('chunkSuccess', eventArgs);
            if (sf.base.isNullOrUndefined(custom) || !custom) {
                liElement = this.getLiElement(metaData.file);
            }
            this.updateMetaData(metaData);
            if (metaData.end === metaData.file.size) {
                metaData.file.statusCode = '3';
            }
            if (metaData.file.statusCode === '5') {
                var eventArgs_1 = { event: e, fileData: metaData.file, cancel: false };
                this.trigger('canceling', eventArgs_1, function (eventArgs) {
                    /* istanbul ignore next */
                    if (eventArgs.cancel) {
                        metaData.file.statusCode = '3';
                        var spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
                        if (!sf.base.isNullOrUndefined(liElement) && !sf.base.isNullOrUndefined(spinnerTarget)) {
                            sf.popups.hideSpinner(spinnerTarget);
                            sf.base.detach(liElement.querySelector('.e-spinner-pane'));
                        }
                        _this.sendNextRequest(metaData);
                    }
                    else {
                        metaData.request.emitError = false;
                        response.abort();
                        var formData = new FormData();
                        var name_3 = _this.element.getAttribute('name');
                        formData.append(name_3, metaData.file.name);
                        formData.append('cancel-uploading', metaData.file.name);
                        formData.append('cancelUploading', metaData.file.name);
                        var ajax = new sf.base.Ajax(_this.asyncSettings.removeUrl, 'POST', true, null);
                        ajax.emitError = false;
                        ajax.onLoad = function (e) { _this.removeChunkFile(e, metaData, custom); return {}; };
                        ajax.send(formData);
                    }
                });
            }
            else {
                if ((totalChunk - 1) === metaData.chunkIndex && totalChunk > metaData.chunkIndex) {
                    var index = this.pausedData.indexOf(metaData);
                    if (index >= 0) {
                        this.pausedData.splice(index, 1);
                    }
                    if (sf.base.isNullOrUndefined(this.template) && (sf.base.isNullOrUndefined(custom) || !custom) && liElement) {
                        if (liElement) {
                            sf.base.detach(liElement.querySelector('.' + PAUSE_UPLOAD));
                        }
                        this.removeChunkProgressBar(metaData);
                    }
                    this.raiseSuccessEvent(e, metaData.file);
                    return;
                }
                this.sendNextRequest(metaData);
            }
        }
        else {
            this.chunkUploadFailed(e, metaData);
        }
    };
    Uploader.prototype.sendNextRequest = function (metaData) {
        metaData.start = metaData.end;
        metaData.end += this.asyncSettings.chunkSize;
        metaData.end = Math.min(metaData.end, metaData.file.size);
        metaData.chunkIndex += 1;
        this.sendRequest(metaData.file, metaData);
    };
    Uploader.prototype.removeChunkFile = function (e, metaData, custom) {
        if (sf.base.isNullOrUndefined(this.template) && (sf.base.isNullOrUndefined(custom) && !custom)) {
            var liElement = this.getLiElement(metaData.file);
            var deleteIcon = liElement.querySelector('.' + ABORT_ICON);
            var spinnerTarget = deleteIcon;
            this.updateStatus(metaData.file, this.localizedTexts('fileUploadCancel'), '5');
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
            this.removeProgressbar(liElement, 'failure');
            deleteIcon.classList.remove(ABORT_ICON);
            deleteIcon.classList.add(REMOVE_ICON);
            deleteIcon.setAttribute('title', this.localizedTexts('remove'));
            var pauseIcon = liElement.querySelector('.' + PAUSE_UPLOAD);
            pauseIcon.classList.add(RETRY_ICON);
            pauseIcon.classList.remove(PAUSE_UPLOAD);
            pauseIcon.setAttribute('title', this.localizedTexts('retry'));
            if (!sf.base.isNullOrUndefined(liElement) && !sf.base.isNullOrUndefined(deleteIcon)) {
                sf.popups.hideSpinner(spinnerTarget);
                sf.base.detach(liElement.querySelector('.e-spinner-pane'));
            }
        }
    };
    Uploader.prototype.pauseUpload = function (metaData, e, custom) {
        metaData.file.statusCode = '4';
        metaData.file.status = this.localizedTexts('pause');
        this.updateMetaData(metaData);
        var eventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.abortUpload(metaData, custom, eventArgs);
    };
    Uploader.prototype.abortUpload = function (metaData, custom, eventArgs) {
        metaData.request.emitError = false;
        metaData.request.httpRequest.abort();
        var liElement = this.getLiElement(metaData.file);
        if (sf.base.isNullOrUndefined(this.template) && (sf.base.isNullOrUndefined(custom) || !custom)) {
            var targetElement = liElement.querySelector('.' + PAUSE_UPLOAD);
            targetElement.classList.remove(PAUSE_UPLOAD);
            targetElement.classList.add(RESUME_UPLOAD);
            targetElement.setAttribute('title', this.localizedTexts('resume'));
            targetElement.nextElementSibling.classList.add(REMOVE_ICON);
            targetElement.nextElementSibling.classList.remove(ABORT_ICON);
            targetElement.nextElementSibling.setAttribute('title', this.localizedTexts('remove'));
        }
        for (var i = 0; i < this.pausedData.length; i++) {
            if (this.pausedData[i].file.name === metaData.file.name) {
                this.pausedData.splice(i, 1);
            }
        }
        this.pausedData.push(metaData);
        this.trigger('pausing', eventArgs);
    };
    Uploader.prototype.resumeUpload = function (metaData, e, custom) {
        var liElement = this.getLiElement(metaData.file);
        var targetElement;
        if (!sf.base.isNullOrUndefined(liElement)) {
            targetElement = liElement.querySelector('.' + RESUME_UPLOAD);
        }
        if (!sf.base.isNullOrUndefined(targetElement) && (sf.base.isNullOrUndefined(custom) || !custom)) {
            targetElement.classList.remove(RESUME_UPLOAD);
            targetElement.classList.add(PAUSE_UPLOAD);
            targetElement.setAttribute('title', this.localizedTexts('pause'));
            targetElement.nextElementSibling.classList.remove(REMOVE_ICON);
            targetElement.nextElementSibling.classList.add(ABORT_ICON);
            targetElement.nextElementSibling.setAttribute('title', this.localizedTexts('abort'));
        }
        metaData.file.status = this.localizedTexts('inProgress');
        metaData.file.statusCode = '3';
        this.updateMetaData(metaData);
        var eventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.trigger('resuming', eventArgs);
        for (var i = 0; i < this.pausedData.length; i++) {
            if (this.pausedData[i].end === this.pausedData[i].file.size) {
                this.chunkUploadComplete(e, metaData, custom);
            }
            else {
                if (this.pausedData[i].file.name === metaData.file.name) {
                    this.pausedData[i].start = this.pausedData[i].end;
                    this.pausedData[i].end = this.pausedData[i].end + this.asyncSettings.chunkSize;
                    this.pausedData[i].end = Math.min(this.pausedData[i].end, this.pausedData[i].file.size);
                    this.pausedData[i].chunkIndex = this.pausedData[i].chunkIndex + 1;
                    this.sendRequest(this.pausedData[i].file, this.pausedData[i], custom);
                }
            }
        }
    };
    Uploader.prototype.updateMetaData = function (metaData) {
        if (this.uploadMetaData.indexOf(metaData) === -1) {
            this.uploadMetaData.push(metaData);
        }
        else {
            this.uploadMetaData.splice(this.uploadMetaData.indexOf(metaData), 1);
            this.uploadMetaData.push(metaData);
        }
    };
    Uploader.prototype.removeChunkProgressBar = function (metaData) {
        var liElement = this.getLiElement(metaData.file);
        if (!sf.base.isNullOrUndefined(liElement)) {
            this.updateProgressBarClasses(liElement, UPLOAD_SUCCESS);
            this.removeProgressbar(liElement, 'success');
            var cancelButton = liElement.querySelector('.' + ABORT_ICON);
            if (!sf.base.isNullOrUndefined(cancelButton)) {
                cancelButton.classList.add(DELETE_ICON);
                cancelButton.setAttribute('title', this.localizedTexts('delete'));
                cancelButton.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
            }
        }
    };
    Uploader.prototype.chunkUploadFailed = function (e, metaData, custom) {
        var _this = this;
        var chunkCount = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
        var liElement;
        if (sf.base.isNullOrUndefined(this.template) && (sf.base.isNullOrUndefined(custom) || !custom)) {
            liElement = this.getLiElement(metaData.file);
        }
        var requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
        var eventArgs = {
            event: e,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            totalChunk: chunkCount,
            chunkSize: this.asyncSettings.chunkSize,
            cancel: false,
            response: requestResponse
        };
        this.trigger('chunkFailure', eventArgs, function (eventArgs) {
            // To prevent triggering of failure event
            // tslint:disable-next-line
            if (!eventArgs.cancel) {
                if (metaData.retryCount < _this.asyncSettings.retryCount) {
                    setTimeout(function () { _this.retryRequest(liElement, metaData, custom); }, _this.asyncSettings.retryAfterDelay);
                }
                else {
                    if (!sf.base.isNullOrUndefined(liElement)) {
                        var pauseButton = liElement.querySelector('.' + PAUSE_UPLOAD) ?
                            liElement.querySelector('.' + PAUSE_UPLOAD) : liElement.querySelector('.' + RESUME_UPLOAD);
                        if (!sf.base.isNullOrUndefined(pauseButton)) {
                            pauseButton.classList.add(RETRY_ICON);
                            pauseButton.classList.remove(PAUSE_UPLOAD, RESUME_UPLOAD);
                        }
                        _this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
                        _this.removeProgressbar(liElement, 'failure');
                        liElement.querySelector('.e-icons').classList.remove(UPLOAD_INPROGRESS);
                        var iconElement = liElement.querySelector('.' + ABORT_ICON) ?
                            liElement.querySelector('.' + ABORT_ICON) : liElement.querySelector('.' + REMOVE_ICON);
                        iconElement.classList.remove(ABORT_ICON);
                        if (!sf.base.isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD))) {
                            sf.base.detach(liElement.querySelector('.' + PAUSE_UPLOAD));
                        }
                        if (metaData.start > 0) {
                            iconElement.classList.add(DELETE_ICON);
                            iconElement.setAttribute('title', _this.localizedTexts('delete'));
                        }
                        else {
                            iconElement.classList.add(REMOVE_ICON);
                            iconElement.setAttribute('title', _this.localizedTexts('remove'));
                        }
                    }
                    metaData.retryCount = 0;
                    var file_1 = metaData.file;
                    var failureMessage = _this.localizedTexts('uploadFailedMessage');
                    var args = {
                        e: e, response: requestResponse,
                        operation: 'upload',
                        file: _this.updateStatus(file_1, failureMessage, '0', false),
                        statusText: failureMessage
                    };
                    _this.trigger('failure', args, function (args) {
                        // tslint:disable-next-line
                        _this.updateStatus(file_1, args.statusText, '0');
                        _this.uploadSequential();
                        _this.checkActionComplete(true);
                    });
                }
            }
        });
    };
    Uploader.prototype.retryRequest = function (liElement, metaData, custom) {
        if (sf.base.isNullOrUndefined(this.template) && (sf.base.isNullOrUndefined(custom) || !custom) && liElement) {
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        }
        metaData.retryCount += 1;
        this.sendRequest(metaData.file, metaData);
    };
    Uploader.prototype.checkPausePlayAction = function (e) {
        var targetElement = e.target;
        var selectedElement = e.target.parentElement;
        var index = this.fileList.indexOf(selectedElement);
        var fileData = this.filesData[index];
        var metaData = this.getCurrentMetaData(fileData);
        if (targetElement.classList.contains(PAUSE_UPLOAD)) {
            /* istanbul ignore next */
            this.pauseUpload(metaData, e);
        }
        else if (targetElement.classList.contains(RESUME_UPLOAD)) {
            /* istanbul ignore next */
            this.resumeUpload(metaData, e);
        }
        else if (targetElement.classList.contains(RETRY_ICON)) {
            if (metaData.file.status === this.localizedTexts('fileUploadCancel')) {
                this.retryUpload(metaData, false);
            }
            else {
                this.retryUpload(metaData, true);
            }
        }
    };
    Uploader.prototype.retryUpload = function (metaData, fromcanceledStage) {
        if (fromcanceledStage) {
            metaData.end = metaData.end + this.asyncSettings.chunkSize;
            metaData.start = metaData.start + this.asyncSettings.chunkSize;
            this.sendRequest(metaData.file, metaData);
        }
        else {
            metaData.file.statusCode = '1';
            metaData.file.status = this.localizedTexts('readyToUploadMessage');
            this.chunkUpload(metaData.file);
        }
        /* istanbul ignore next */
        (this.getLiElement(metaData.file)).classList.add(RESTRICT_RETRY);
    };
    Uploader.prototype.chunkUploadInProgress = function (e, metaData, custom) {
        var _this = this;
        if (metaData.file.statusCode === '4') {
            return;
        }
        if (metaData.file.statusCode !== '4' && metaData.file.statusCode !== '5') {
            metaData.file.statusCode = '3';
            metaData.file.status = this.localizedTexts('inProgress');
        }
        this.updateMetaData(metaData);
        var liElement = this.getLiElement(metaData.file);
        if (sf.base.isNullOrUndefined(liElement)) {
            return;
        }
        var retryElement = liElement.querySelector('.' + RETRY_ICON);
        if (!sf.base.isNullOrUndefined(retryElement)) {
            retryElement.classList.add(PAUSE_UPLOAD);
            retryElement.setAttribute('title', this.localizedTexts('pause'));
            retryElement.classList.remove(RETRY_ICON);
        }
        if (!sf.base.isNullOrUndefined(liElement)) {
            if (!(liElement.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0)) {
                var statusElement = liElement.querySelector('.' + STATUS);
                if (sf.base.isNullOrUndefined(this.template)) {
                    statusElement.classList.add(UPLOAD_INPROGRESS);
                    statusElement.classList.remove(UPLOAD_FAILED);
                    this.createProgressBar(liElement);
                    this.updateProgressBarClasses(liElement, UPLOAD_INPROGRESS);
                }
                var clearIcon = liElement.querySelector('.' + REMOVE_ICON) ? liElement.querySelector('.' + REMOVE_ICON) :
                    liElement.querySelector('.' + DELETE_ICON);
                if (!sf.base.isNullOrUndefined(clearIcon)) {
                    clearIcon.classList.add(ABORT_ICON);
                    clearIcon.setAttribute('title', this.localizedTexts('abort'));
                    clearIcon.classList.remove(REMOVE_ICON);
                }
            }
            if (!isNaN(Math.round((e.loaded / e.total) * 100)) && sf.base.isNullOrUndefined(this.template) && metaData.file.statusCode !== '4') {
                var loadedSize = (metaData.chunkIndex * this.asyncSettings.chunkSize);
                var value = Math.min((((loadedSize + e.loaded) / metaData.file.size) * 100), 100);
                this.changeProgressValue(liElement, Math.round(value).toString() + '%');
            }
            if (metaData.chunkIndex === 0) {
                this.checkActionButtonStatus();
            }
        }
        if (sf.base.isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD)) && sf.base.isNullOrUndefined(this.template)) {
            this.pauseButton = this.createElement('span', { className: 'e-icons e-file-pause-btn', attrs: { 'tabindex': this.btnTabIndex } });
            if (this.browserName === 'msie') {
                this.pauseButton.classList.add('e-msie');
            }
            var abortIcon = liElement.querySelector('.' + ABORT_ICON);
            abortIcon.parentElement.insertBefore(this.pauseButton, abortIcon);
            this.pauseButton.setAttribute('title', this.localizedTexts('pause'));
            this.pauseButton.addEventListener('click', function (e) { _this.checkPausePlayAction(e); }, false);
        }
    };
    /**
     * It is used to convert bytes value into kilobytes or megabytes depending on the size based
     * on [binary prefix](https://en.wikipedia.org/wiki/Binary_prefix).
     * @param { number } bytes - specifies the file size in bytes.
     * @returns string
     */
    Uploader.prototype.bytesToSize = function (bytes) {
        var i = -1;
        if (!bytes) {
            return '0.0 KB';
        }
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 99);
        if (i >= 2) {
            bytes = bytes * 1024;
            i = 1;
        }
        return Math.max(bytes, 0).toFixed(1) + ' ' + ['KB', 'MB'][i];
    };
    /**
     * Allows you to sort the file data alphabetically based on its file name clearly.
     * @param { FileList } filesData - specifies the files data for upload.
     * @returns File[]
     */
    /* istanbul ignore next */
    Uploader.prototype.sortFileList = function (filesData) {
        filesData = filesData ? filesData : this.sortFilesList;
        var files = filesData;
        var fileNames = [];
        for (var i = 0; i < files.length; i++) {
            fileNames.push(files[i].name);
        }
        var sortedFileNames = fileNames.sort();
        var sortedFilesData = [];
        for (var _i = 0, sortedFileNames_1 = sortedFileNames; _i < sortedFileNames_1.length; _i++) {
            var name_4 = sortedFileNames_1[_i];
            for (var i = 0; i < files.length; i++) {
                if (name_4 === files[i].name) {
                    sortedFilesData.push(files[i]);
                }
            }
        }
        return sortedFilesData;
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    Uploader.prototype.destroy = function () {
        this.element.value = null;
        if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            this.clearAll();
        }
        this.unWireEvents();
        this.unBindDropEvents();
        if (this.multiple) {
            this.element.removeAttribute('multiple');
        }
        if (!this.enabled) {
            this.element.removeAttribute('disabled');
        }
        this.element.removeAttribute('accept');
        this.setInitialAttributes();
        var attributes = ['aria-label', 'directory', 'webkitdirectory', 'tabindex'];
        for (var _i = 0, attributes_2 = attributes; _i < attributes_2.length; _i++) {
            var key = attributes_2[_i];
            this.element.removeAttribute(key);
        }
        if (!this.isServerBlazor) {
            if (!sf.base.isNullOrUndefined(this.uploadWrapper)) {
                this.uploadWrapper.parentElement.appendChild(this.element);
                sf.base.detach(this.uploadWrapper);
            }
            this.uploadWrapper = null;
            _super.prototype.destroy.call(this);
        }
        else {
            this.uploadWrapper = null;
        }
    };
    /**
     * Allows you to call the upload process manually by calling save URL action.
     * To process the selected files (added in upload queue), pass an empty argument otherwise
     * upload the specific file based on its argument.
     * @param { FileInfo | FileInfo[] } files - specifies the files data for upload.
     * @returns void
     */
    Uploader.prototype.upload = function (files, custom) {
        var _this = this;
        files = files ? files : this.filesData;
        if (this.sequentialUpload && this.isFirstFileOnSelection) {
            this.sequenceUpload(files);
        }
        else {
            var uploadFiles_1 = this.getFilesInArray(files);
            var eventArgs = {
                customFormData: [],
                currentRequest: null,
                cancel: false
            };
            this.trigger('beforeUpload', eventArgs, function (eventArgs) {
                if (!eventArgs.cancel) {
                    if (sf.base.isBlazor()) {
                        _this.currentRequestHeader = eventArgs.currentRequest ? eventArgs.currentRequest : _this.currentRequestHeader;
                        _this.customFormDatas = (eventArgs.customFormData && eventArgs.customFormData.length > 0) ?
                            eventArgs.customFormData : _this.customFormDatas;
                    }
                    _this.uploadFiles(uploadFiles_1, custom);
                }
            });
        }
    };
    Uploader.prototype.getFilesInArray = function (files) {
        var uploadFiles = [];
        if (files instanceof Array) {
            uploadFiles = files;
        }
        else {
            uploadFiles.push(files);
        }
        return uploadFiles;
    };
    /* istanbul ignore next */
    Uploader.prototype.serverReadFileBase64 = function (fileIndex, position, totalCount) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var file = _this.fileStreams[fileIndex].rawFile;
            try {
                var reader = new FileReader();
                // tslint:disable-next-line
                reader.onload = (function (args) {
                    return function () {
                        try {
                            var contents = args.result;
                            var data = contents ? contents.split(';base64,')[1] : null;
                            resolve(data);
                        }
                        catch (e) {
                            reject(e);
                        }
                    };
                })(reader);
                reader.readAsDataURL(file.slice(position, position + totalCount));
            }
            catch (e) {
                reject(e);
            }
        });
    };
    /* istanbul ignore next */
    Uploader.prototype.uploadFileCount = function (ele) {
        var files = this.filesData;
        if (!files || files.length === 0) {
            return -1;
        }
        var result = files.length;
        return result;
    };
    /* istanbul ignore next */
    Uploader.prototype.getFileRead = function (index, ele) {
        var files = this.filesData;
        if (!files || files.length === 0) {
            return -1;
        }
        var file = files[index];
        var fileCount = this.newFileRef++;
        this.fileStreams[fileCount] = file;
        return fileCount;
    };
    /* istanbul ignore next */
    Uploader.prototype.getFileInfo = function (index, ele) {
        var files = this.filesData;
        if (!files || files.length === 0) {
            return null;
        }
        var file = files[index];
        if (!file) {
            return null;
        }
        return this.filesData[index];
    };
    Uploader.prototype.uploadFiles = function (files, custom) {
        var _this = this;
        var selectedFiles = [];
        if (this.asyncSettings.saveUrl === '' || sf.base.isNullOrUndefined(this.asyncSettings.saveUrl)) {
            if (this.isServerBlazor) {
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('GetFileDetails', files);
            }
            return;
        }
        if (!custom || sf.base.isNullOrUndefined(custom)) {
            if (!this.multiple) {
                var file = [];
                file.push(files[0]);
                selectedFiles = this.filterfileList(file);
            }
            else {
                selectedFiles = this.filterfileList(files);
            }
        }
        else {
            selectedFiles = files;
        }
        var _loop_5 = function (i) {
            if (this_3.isServerBlazor && !this_3.checkChunkUpload()) {
                /* istanbul ignore next */
                /* tslint:disable */
                if (selectedFiles[i] && selectedFiles[i].rawFile instanceof File) {
                    this_3.getBase64(selectedFiles[i].rawFile).then(function (data) {
                        _this.base64String.push(data);
                        _this.uploadFilesRequest(selectedFiles, i, custom);
                    });
                }
                /* tslint:disable */
            }
            else {
                this_3.uploadFilesRequest(selectedFiles, i, custom);
            }
        };
        var this_3 = this;
        for (var i = 0; i < selectedFiles.length; i++) {
            _loop_5(i);
        }
    };
    Uploader.prototype.uploadFilesRequest = function (selectedFiles, i, custom) {
        var _this = this;
        var cloneFiles = [];
        var chunkEnabled = this.checkChunkUpload();
        var ajax = new sf.base.Ajax(this.asyncSettings.saveUrl, 'POST', true, null);
        ajax.emitError = false;
        var getFileData;
        /* istanbul ignore next */
        if (this.isServerBlazor) {
            getFileData = selectedFiles.slice(0);
            cloneFiles.push(getFileData[i].rawFile);
        }
        var eventArgs = {
            fileData: (this.isServerBlazor) ? getFileData[i] : selectedFiles[i],
            customFormData: [],
            cancel: false
        };
        var formData = new FormData();
        ajax.beforeSend = function (e) {
            eventArgs.currentRequest = ajax.httpRequest;
            /* istanbul ignore next */
            if (sf.base.isBlazor()) {
                eventArgs.fileData.rawFile = !chunkEnabled ? _this.base64String[i] : eventArgs.fileData.rawFile;
                if (_this.currentRequestHeader) {
                    _this.updateCustomheader(ajax.httpRequest, _this.currentRequestHeader);
                }
                if (_this.customFormDatas) {
                    _this.updateFormData(formData, _this.customFormDatas);
                }
            }
            _this.trigger('uploading', eventArgs, function (eventArgs) {
                /* istanbul ignore next */
                if (_this.isServerBlazor && !chunkEnabled) {
                    selectedFiles[i].rawFile = eventArgs.fileData.rawFile = cloneFiles[i];
                }
                if (eventArgs.cancel) {
                    _this.eventCancelByArgs(e, eventArgs, selectedFiles[i]);
                }
                _this.updateFormData(formData, eventArgs.customFormData);
            });
        };
        if (selectedFiles[i].statusCode === '1') {
            var name_5 = this.element.getAttribute('name');
            formData.append(name_5, selectedFiles[i].rawFile, selectedFiles[i].name);
            if (chunkEnabled && selectedFiles[i].size > this.asyncSettings.chunkSize) {
                this.chunkUpload(selectedFiles[i], custom, i);
            }
            else {
                ajax.onLoad = function (e) {
                    if (eventArgs.cancel && _this.isServerBlazor) {
                        return {};
                    }
                    else {
                        _this.uploadComplete(e, selectedFiles[i], custom);
                        return {};
                    }
                };
                ajax.onUploadProgress = function (e) {
                    if (eventArgs.cancel && _this.isServerBlazor) {
                        return {};
                    }
                    else {
                        _this.uploadInProgress(e, selectedFiles[i], custom, ajax);
                        return {};
                    }
                };
                /* istanbul ignore next */
                ajax.onError = function (e) { _this.uploadFailed(e, selectedFiles[i]); return {}; };
                ajax.send(formData);
            }
        }
    };
    Uploader.prototype.spliceFiles = function (liIndex) {
        var liElement = this.fileList[liIndex];
        var allFiles = this.getFilesData();
        var nameElements = +liElement.getAttribute('data-files-count');
        var startIndex = 0;
        for (var i = 0; i < liIndex; i++) {
            startIndex += (+this.fileList[i].getAttribute('data-files-count'));
        }
        var endIndex = (startIndex + nameElements) - 1;
        for (var j = endIndex; j >= startIndex; j--) {
            allFiles.splice(j, 1);
        }
    };
    /**
     * Remove the uploaded file from server manually by calling the remove URL action.
     * If you pass an empty argument to this method, the complete file list can be cleared,
     * otherwise remove the specific file based on its argument (“file_data”).
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to remove from file list/server.
     * @param { boolean } customTemplate - Set true if the component rendering with customize template.
     * @param { boolean } removeDirectly - Set true if files remove without removing event.
     * @param { boolean } postRawFile - Set false, to post file name only to the remove action.
     * @returns void
     */
    Uploader.prototype.remove = function (fileData, customTemplate, removeDirectly, postRawFile, args) {
        var _this = this;
        if (sf.base.isNullOrUndefined(postRawFile)) {
            postRawFile = true;
        }
        var eventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            customFormData: [],
            postRawFile: postRawFile,
            currentRequest: null
        };
        var beforeEventArgs = {
            cancel: false,
            customFormData: [],
            currentRequest: null
        };
        this.trigger('beforeRemove', beforeEventArgs, function (beforeEventArgs) {
            if (!beforeEventArgs.cancel) {
                if (sf.base.isBlazor()) {
                    _this.currentRequestHeader = beforeEventArgs.currentRequest;
                    _this.customFormDatas = beforeEventArgs.customFormData;
                }
                var index = void 0;
                if (_this.isFormUpload() && !_this.isBlazorSaveUrl) {
                    eventArgs.filesData = fileData;
                    _this.trigger('removing', eventArgs, function (eventArgs) {
                        if (!eventArgs.cancel) {
                            var removingFiles = _this.getFilesInArray(fileData);
                            var isLiRemoved = false;
                            var liIndex = void 0;
                            for (var _i = 0, removingFiles_1 = removingFiles; _i < removingFiles_1.length; _i++) {
                                var data = removingFiles_1[_i];
                                if (!isLiRemoved) {
                                    liIndex = _this.fileList.indexOf(data.list);
                                }
                                if (liIndex > -1) {
                                    var inputElement = !sf.base.isNullOrUndefined(data.input) ? data.input : null;
                                    if (inputElement) {
                                        sf.base.detach(inputElement);
                                    }
                                    _this.spliceFiles(liIndex);
                                    sf.base.detach(_this.fileList[liIndex]);
                                    _this.fileList.splice(liIndex, 1);
                                    isLiRemoved = true;
                                    liIndex = -1;
                                }
                            }
                        }
                    });
                }
                else if (_this.isForm && (sf.base.isNullOrUndefined(_this.asyncSettings.removeUrl) || _this.asyncSettings.removeUrl === '')
                    && !_this.isBlazorSaveUrl) {
                    eventArgs.filesData = _this.getFilesData();
                    _this.trigger('removing', eventArgs, function (eventArgs) {
                        if (!eventArgs.cancel) {
                            _this.clearAll();
                        }
                    });
                }
                else {
                    var removeFiles = [];
                    fileData = !sf.base.isNullOrUndefined(fileData) ? fileData : _this.filesData;
                    if (fileData instanceof Array) {
                        removeFiles = fileData;
                    }
                    else {
                        removeFiles.push(fileData);
                    }
                    eventArgs.filesData = removeFiles;
                    var removeUrl = _this.asyncSettings.removeUrl;
                    var validUrl = (removeUrl === '' || sf.base.isNullOrUndefined(removeUrl)) ? false : true;
                    var _loop_6 = function (files) {
                        index = _this.filesData.indexOf(files);
                        if ((files.statusCode === '2' || files.statusCode === '4') && validUrl) {
                            _this.removeUploadedFile(files, eventArgs, removeDirectly, customTemplate);
                        }
                        else {
                            if (!removeDirectly) {
                                _this.trigger('removing', eventArgs, function (eventArgs) {
                                    if (!eventArgs.cancel) {
                                        _this.removeFilesData(files, customTemplate);
                                    }
                                });
                            }
                            else {
                                _this.removeFilesData(files, customTemplate);
                            }
                        }
                        if (args && !args.target.classList.contains(REMOVE_ICON)) {
                            _this.checkActionComplete(false);
                        }
                    };
                    for (var _i = 0, removeFiles_1 = removeFiles; _i < removeFiles_1.length; _i++) {
                        var files = removeFiles_1[_i];
                        _loop_6(files);
                    }
                }
            }
        });
    };
    /**
     * Clear all the file entries from list that can be uploaded files or added in upload queue.
     * @returns void
     */
    Uploader.prototype.clearAll = function () {
        var _this = this;
        if (sf.base.isNullOrUndefined(this.listParent) && !(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            if (this.browserName !== 'msie') {
                this.element.value = '';
            }
            this.filesData = [];
            return;
        }
        var eventArgs = {
            cancel: false,
            filesData: this.filesData
        };
        this.trigger('clearing', eventArgs, function (eventArgs) {
            if (!eventArgs.cancel) {
                _this.clearData();
                _this.actionCompleteCount = 0;
                _this.count = -1;
            }
        });
    };
    /**
     * Get the data of files which are shown in file list.
     * @param { number } index - specifies the file list item(li) index.
     * @returns FileInfo[]
     */
    Uploader.prototype.getFilesData = function (index) {
        if (!this.isServerBlazor) {
            if (sf.base.isNullOrUndefined(index)) {
                return this.filesData;
            }
            else {
                return this.getSelectedFiles(index);
            }
        }
        else {
            for (var i = 0; i < this.filesData.length; i++) {
                this.filesData[i].rawFile = this.base64String[i];
            }
            return this.filesData;
        }
    };
    /**
     * Pauses the in-progress chunked upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to pause from uploading.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    Uploader.prototype.pause = function (fileData, custom) {
        fileData = fileData ? fileData : this.filesData;
        var fileDataFiles = this.getFilesInArray(fileData);
        this.pauseUploading(fileDataFiles, custom);
    };
    Uploader.prototype.pauseUploading = function (fileData, custom) {
        var files = this.getFiles(fileData);
        for (var i = 0; i < files.length; i++) {
            if (files[i].statusCode === '3') {
                this.pauseUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    };
    Uploader.prototype.getFiles = function (fileData) {
        var files = [];
        if (!sf.base.isNullOrUndefined(fileData) && !(fileData instanceof Array)) {
            files.push(fileData);
        }
        else {
            files = fileData;
        }
        return files;
    };
    /**
     * Resumes the chunked upload that is previously paused based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to resume the paused file.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    Uploader.prototype.resume = function (fileData, custom) {
        fileData = fileData ? fileData : this.filesData;
        var fileDataFiles = this.getFilesInArray(fileData);
        this.resumeFiles(fileDataFiles, custom);
    };
    Uploader.prototype.resumeFiles = function (fileData, custom) {
        var files = this.getFiles(fileData);
        for (var i = 0; i < files.length; i++) {
            if (files[i].statusCode === '4') {
                this.resumeUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    };
    /**
     * Retries the canceled or failed file upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to retry the canceled or failed file.
     * @param { boolean } fromcanceledStage - Set true to retry from canceled stage and set false to retry from initial stage.
     * @returns void
     */
    Uploader.prototype.retry = function (fileData, fromcanceledStage, custom) {
        fileData = fileData ? fileData : this.filesData;
        var fileDataFiles = this.getFilesInArray(fileData);
        this.retryFailedFiles(fileDataFiles, fromcanceledStage, custom);
    };
    Uploader.prototype.retryFailedFiles = function (fileData, fromcanceledStage, custom) {
        var files = this.getFiles(fileData);
        for (var i = 0; i < files.length; i++) {
            if (files[i].statusCode === '5' || files[i].statusCode === '0') {
                if (this.asyncSettings.chunkSize > 0) {
                    this.retryUpload(this.getCurrentMetaData(files[i], null), fromcanceledStage);
                }
                else {
                    var liElement = void 0;
                    if (!custom) {
                        liElement = this.fileList[this.filesData.indexOf(files[i])];
                    }
                    this.reloadcanceledFile(null, files[i], liElement, custom);
                }
            }
        }
    };
    /**
     * Stops the in-progress chunked upload based on the file data.
     * When the file upload is canceled, the partially uploaded file is removed from server.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to cancel the progressing file.
     * @returns void
     */
    Uploader.prototype.cancel = function (fileData) {
        fileData = fileData ? fileData : this.filesData;
        var cancelingFiles = this.getFilesInArray(fileData);
        this.cancelUpload(cancelingFiles);
    };
    Uploader.prototype.cancelUpload = function (fileData) {
        var files = this.getFiles(fileData);
        if (this.asyncSettings.chunkSize > 0) {
            for (var i = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    var metaData = this.getCurrentMetaData(files[i], null);
                    metaData.file.statusCode = '5';
                    metaData.file.status = this.localizedTexts('fileUploadCancel');
                    this.updateMetaData(metaData);
                    this.showHideUploadSpinner(files[i]);
                }
            }
        }
        else {
            for (var i = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    files[i].statusCode = '5';
                    files[i].status = this.localizedTexts('fileUploadCancel');
                    this.showHideUploadSpinner(files[i]);
                }
            }
        }
    };
    Uploader.prototype.showHideUploadSpinner = function (files) {
        var liElement = this.getLiElement(files);
        if (!sf.base.isNullOrUndefined(liElement) && sf.base.isNullOrUndefined(this.template)) {
            var spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
            sf.popups.createSpinner({ target: spinnerTarget, width: '20px' });
            sf.popups.showSpinner(spinnerTarget);
        }
    };
    __decorate([
        sf.base.Complex({ saveUrl: '', removeUrl: '' }, AsyncSettings)
    ], Uploader.prototype, "asyncSettings", void 0);
    __decorate([
        sf.base.Property(false)
    ], Uploader.prototype, "sequentialUpload", void 0);
    __decorate([
        sf.base.Property({})
    ], Uploader.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property('')
    ], Uploader.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(true)
    ], Uploader.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property(null)
    ], Uploader.prototype, "template", void 0);
    __decorate([
        sf.base.Property(true)
    ], Uploader.prototype, "multiple", void 0);
    __decorate([
        sf.base.Property(true)
    ], Uploader.prototype, "autoUpload", void 0);
    __decorate([
        sf.base.Complex({}, ButtonsProps)
    ], Uploader.prototype, "buttons", void 0);
    __decorate([
        sf.base.Property('')
    ], Uploader.prototype, "allowedExtensions", void 0);
    __decorate([
        sf.base.Property(0)
    ], Uploader.prototype, "minFileSize", void 0);
    __decorate([
        sf.base.Property(30000000)
    ], Uploader.prototype, "maxFileSize", void 0);
    __decorate([
        sf.base.Property(null)
    ], Uploader.prototype, "dropArea", void 0);
    __decorate([
        sf.base.Collection([{}], FilesProp)
    ], Uploader.prototype, "files", void 0);
    __decorate([
        sf.base.Property(true)
    ], Uploader.prototype, "showFileList", void 0);
    __decorate([
        sf.base.Property(false)
    ], Uploader.prototype, "directoryUpload", void 0);
    __decorate([
        sf.base.Property('Default')
    ], Uploader.prototype, "dropEffect", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "actionComplete", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "rendering", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "beforeUpload", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "fileListRendering", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "selected", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "uploading", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "success", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "failure", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "removing", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "beforeRemove", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "clearing", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "progress", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "chunkSuccess", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "chunkFailure", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "chunkUploading", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "canceling", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "pausing", void 0);
    __decorate([
        sf.base.Event()
    ], Uploader.prototype, "resuming", void 0);
    Uploader = __decorate([
        sf.base.NotifyPropertyChanges
    ], Uploader);
    return Uploader;
}(sf.base.Component));

/**
 * Uploader modules
 */

exports.FilesProp = FilesProp;
exports.ButtonsProps = ButtonsProps;
exports.AsyncSettings = AsyncSettings;
exports.Uploader = Uploader;

return exports;

});
sfBlazor.modules["uploader"] = "inputs.Uploader";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.uploader, () => {
    sf.inputs = sf.base.extend({}, sf.inputs, sfuploader({}));
});