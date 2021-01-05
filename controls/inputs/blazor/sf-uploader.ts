import { EventHandler, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BlazorDotnetObject, detach, Animation } from '@syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { createElement, Browser, Ajax, BeforeSendEventArgs, getUniqueID, closest, remove } from '@syncfusion/ej2-base';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

/**
 * Blazor uploader interop handler
 */

const INPUT_WRAPPER: string = 'e-file-select';
const DROP_WRAPPER: string = 'e-file-select-wrap';
const LIST_PARENT: string = 'e-upload-files';
const FILE: string = 'e-upload-file-list';
const STATUS: string = 'e-file-status';
const ACTION_BUTTONS: string = 'e-upload-actions';
const UPLOAD_BUTTONS: string = 'e-file-upload-btn e-css e-btn e-flat e-primary';
const CLEAR_BUTTONS: string = 'e-file-clear-btn e-css e-btn e-flat';
const FILE_NAME: string = 'e-file-name';
const FILE_TYPE: string = 'e-file-type';
const FILE_SIZE: string = 'e-file-size';
const REMOVE_ICON: string = 'e-file-remove-btn';
const DELETE_ICON: string = 'e-file-delete-btn';
const SPINNER_PANE: string = 'e-spinner-pane';
const ABORT_ICON: string = 'e-file-abort-btn';
const RETRY_ICON: string = 'e-file-reload-btn';
const DRAG_HOVER: string = 'e-upload-drag-hover';
const PROGRESS_WRAPPER: string = 'e-upload-progress-wrap';
const PROGRESSBAR: string = 'e-upload-progress-bar';
const PROGRESSBAR_TEXT: string = 'e-progress-bar-text';
const UPLOAD_INPROGRESS: string = 'e-upload-progress';
const UPLOAD_SUCCESS: string = 'e-upload-success';
const UPLOAD_FAILED: string = 'e-upload-fails';
const TEXT_CONTAINER: string = 'e-file-container';
const VALIDATION_FAILS: string = 'e-validation-fails';
const RTL_CONTAINER: string = 'e-rtl-container';
const ICON_FOCUSED: string = 'e-clear-icon-focus';
const PROGRESS_INNER_WRAPPER: string = 'e-progress-inner-wrap';
const PAUSE_UPLOAD: string = 'e-file-pause-btn';
const RESUME_UPLOAD: string = 'e-file-play-btn';
const RESTRICT_RETRY: string = 'e-restrict-retry';
const FORM_UPLOAD: string = 'e-form-upload';
const HIDDEN_INPUT: string = 'e-hidden-file-input';
const INVALID_FILE: string = 'e-file-invalid';
const INFORMATION: string = 'e-file-information';
class SfUploader {
    public element: BlazorUploaderElement | HTMLInputElement;
    public dotNetRef: BlazorDotnetObject;
    public asyncSettings: AsyncSettingsModel;
    public sequentialUpload: boolean;
    public cssClass: string;
    public enabled: boolean;
    public template: string;
    public multiple: boolean;
    public autoUpload: boolean;
    public buttons: ButtonsPropsModel;
    public allowedExtensions: string;
    public minFileSize: number;
    public maxFileSize: number;
    public dropArea: string;
    public files: FilesPropModel[];
    public showFileList: boolean;
    public directoryUpload: boolean;
    public dropEffect: string;
    public locale: string;
    public enablePersistence: boolean;
    public enableRtl: boolean;
    public actionCompleteEnabled: boolean;
    public beforeRemoveEnabled: boolean;
    public beforeUploadEnabled: boolean;
    public cancelEnabled: boolean;
    public changeEnabled: boolean;
    public chunkFailuredEnabled: boolean;
    public chunkUploadingEnabled: boolean;
    public uploadingEnabled: boolean;
    public clearEnabled: boolean;
    public failuredEnabled: boolean;
    public fileListRenderEnabled: boolean;
    public pausedEnabled: boolean;
    public progressingEnabled: boolean;
    public removingEnabled: boolean;
    public resumeEnabled: boolean;
    public selectedEnabled: boolean;
    public successEnabled: boolean;
    public chunkSuccessEnabled: boolean;


    private initialAttr: InitialAttr = { accept: null, multiple: false, disabled: false };
    private uploadWrapper: HTMLElement;
    private browseButton: HTMLElement;
    private listParent: HTMLElement;
    private sortFilesList: FileList;
    private actionButtons: HTMLElement;
    private uploadButton: HTMLElement;
    private clearButton: HTMLElement;
    private pauseButton: HTMLElement;
    private formElement: HTMLElement;
    private dropAreaWrapper: HTMLElement;
    // tslint:disable-next-line
    private filesEntries: any[];
    private uploadedFilesData: FileInfo[] = [];
    private base64String: string[] = [];
    private currentRequestHeader: { [key: string]: string }[];
    private customFormDatas: { [key: string]: object }[];
    private dropZoneElement: HTMLElement;
    private keyboardModule: KeyboardEvents;
    private progressInterval: string;
    private progressAnimation: Animation;
    private isForm: boolean = false;
    private allTypes: boolean = false;
    private keyConfigs: { [key: string]: string };
    private localeText: { [key: string]: Object };
    private pausedData: MetaData[] = [];
    private uploadMetaData: MetaData[] = [];
    private btnTabIndex: string = '0';
    private disableKeyboardNavigation: boolean = false;
    private count: number = -1;
    private actionCompleteCount: number = 0;
    private flag: boolean = true;
    private selectedFiles: FileInfo[] = [];
    private browserName: string;
    private uploaderName: string = 'UploadFiles';
    private isBlazorSaveUrl: boolean;
    private isBlazorTemplate: boolean;
    private fileStreams: FileInfo[] = [];
    private newFileRef: number = 0;
    private isFirstFileOnSelection: boolean = false;
    public fileList: HTMLElement[] = [];
    public filesData: FileInfo[] = [];
    constructor(element: BlazorUploaderElement, dotnetRef: BlazorDotnetObject, options: { [key: string]: Object }) {
        this.element = element;
        this.updateProperty(options);
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    public initialize(): void {
        this.preRender();
        this.render();
    }

    //#region Internal methods
    public updateProperty(uploadObj: { [key: string]: Object }): void {
        extend(this, this, uploadObj);
    }
    private reRenderFileList(): void {
        if (this.listParent) {
            detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createFileList(this.filesData);
            if (this.actionButtons) {
                this.removeActionButtons();
                this.renderActionButtons();
                this.checkActionButtonStatus();
            }
        }
    }
    private updateDropArea() : void {
        if (this.dropArea) {
            this.setDropArea();
        } else {
            this.dropZoneElement = null;
            let dropTextArea: HTMLElement = <HTMLElement>this.dropAreaWrapper.querySelector('.e-file-drop');
            if (dropTextArea) {
                remove(dropTextArea);
            }
        }
    }

    public propertyChanges(uploadObj: { [key: string]: Object }, newProp: { [key: string]: Object }): void {
        this.updateProperty(uploadObj);
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'AllowedExtensions':
                    this.clearAll();
                    break;
                case 'EnableRtl':
                    this.reRenderFileList();
                    break;
                case 'Buttons':
                    this.buttons.browse = isNullOrUndefined(this.buttons.browse) ? '' : this.buttons.browse;
                    this.buttons.clear = isNullOrUndefined(this.buttons.clear) ? '' : this.buttons.clear;
                    this.buttons.upload = isNullOrUndefined(this.buttons.upload) ? '' : this.buttons.upload;
                    this.renderButtonTemplates();
                    break;
                case 'DropArea':
                    this.unBindDropEvents();
                    this.updateDropArea();
                    break;
                case 'Files':
                    this.renderPreLoadFiles();
                    break;
                case 'MinFileSize':
                case 'MaxFileSize':
                case 'AutoUpload':
                    this.clearAll();
                    break;
                case 'SequentialUpload':
                    this.clearAll();
                    break;
            }
        }
    }
    protected preRender(): void {
        this.isBlazorTemplate = this.template !== '' && !isNullOrUndefined(this.template);
        this.isBlazorSaveUrl = (this.asyncSettings.saveUrl === '' || isNullOrUndefined(this.asyncSettings.saveUrl));
        if (this.isBlazorSaveUrl && this.sequentialUpload) { this.sequentialUpload = false; }
        if (!this.isBlazorSaveUrl) { this.formRendered(); }
        this.keyConfigs = {
            enter: 'enter'
        };
        this.browserName = Browser.info.name;
        this.uploaderName = this.element.getAttribute('name');
    }

    private formRendered(): void {
        let parentEle: HTMLElement = closest(this.element, 'form') as HTMLElement;
        if (!isNullOrUndefined(parentEle)) {
            for (; parentEle && parentEle !== document.documentElement; parentEle = parentEle.parentElement) {
                if (parentEle.tagName === 'FORM') {
                    this.isForm = true;
                    this.formElement = parentEle;
                    parentEle.setAttribute('enctype', 'multipart/form-data');
                    parentEle.setAttribute('encoding', 'multipart/form-data');
                }
            }
        }
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        this.dropAreaWrapper = closest(this.element, '.' + DROP_WRAPPER) as HTMLElement;
        this.uploadWrapper = closest(this.element, '.e-upload.e-control-wrapper') as HTMLElement;
        this.browseButton = this.dropAreaWrapper.querySelector('button.e-upload-browse-btn');
        this.setDropArea();
        this.renderPreLoadFiles();
        this.wireEvents();
    }

    private wireEvents(): void {
        EventHandler.add(this.browseButton, 'click', this.browseButtonClick, this);
        EventHandler.add(this.element, 'change', this.onSelectFiles, this);
        EventHandler.add(document, 'click', this.removeFocus, this);
        this.keyboardModule = new KeyboardEvents(this.uploadWrapper, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
        if (this.isForm) {
            EventHandler.add(this.formElement, 'reset', this.resetForm, this);
        }
    }

    private renderPreLoadFiles(): void {
        if (this.files && this.files.length) {
            if (this.enablePersistence && this.filesData.length) {
                this.createFileList(this.filesData);
                return;
            }
            if (isNullOrUndefined(this.files[0].size)) {
                return;
            }
            let files: FilesPropModel[] = [].slice.call(this.files);
            let filesData: FileInfo[] = [];
            if (!this.multiple) {
                this.clearData();
                files = [files[0]];
            }
            for (let data of files) {
                let fileData: FileInfo = {
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
    }
    private renderActionButtons(): void {
        this.element.setAttribute('tabindex', '-1');
        if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            this.actionButtons = createElement('div', { className: ACTION_BUTTONS });
            this.uploadButton = createElement('button', {
                className: UPLOAD_BUTTONS,
                attrs: { 'type': 'button', 'tabindex': this.btnTabIndex }
            });
            this.clearButton = createElement('button', {
                className: CLEAR_BUTTONS,
                attrs: { 'type': 'button', 'tabindex': this.btnTabIndex }
            });
            this.actionButtons.appendChild(this.clearButton);
            this.actionButtons.appendChild(this.uploadButton);
            this.renderButtonTemplates();
            this.uploadWrapper.appendChild(this.actionButtons);
            this.browseButton.blur();
            this.uploadButton.focus();
            this.wireActionButtonEvents();
        }
    }
    private setDropArea(): void {
        let dropTextArea: HTMLElement = <HTMLElement>this.dropAreaWrapper.querySelector('.e-file-drop');
        if (this.dropArea) {
            this.dropZoneElement = (typeof (this.dropArea) !== 'string') ? this.dropArea :
                document.querySelector(this.dropArea) as HTMLElement;
            let element: HTMLElement = this.element;
            let enableDropText: Boolean = false;
            while (element.parentNode) {
                element = element.parentNode as HTMLElement;
                if (element === this.dropZoneElement) {
                    enableDropText = true;
                }
            }
            if (!enableDropText && dropTextArea) {
                remove(dropTextArea);
            }
        } else if (isNullOrUndefined(this.dropArea)) {
            this.dropZoneElement = this.uploadWrapper;
            //this.setProperties({dropArea: this.uploadWrapper }, true);
        }
        this.bindDropEvents();
    }


    public serverActionButtonsEventBind(element: HTMLElement): void {
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
    }


    public serverUlElement(element: HTMLElement): void {
        if (element && (this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            this.listParent = element;
            this.fileList = [].slice.call(this.listParent.querySelectorAll('li'));
            this.serverRemoveIconBindEvent();
            if (!this.isForm) {
                this.checkAutoUpload(this.filesData);
            }
        }
    }

    private wireActionButtonEvents(): void {
        EventHandler.add(this.uploadButton, 'click', this.uploadButtonClick, this);
        EventHandler.add(this.clearButton, 'click', this.clearButtonClick, this);
    }

    private unwireActionButtonEvents(): void {
        EventHandler.remove(this.uploadButton, 'click', this.uploadButtonClick);
        EventHandler.remove(this.clearButton, 'click', this.clearButtonClick);
    }


    private checkActionButtonStatus(): void {
        if (this.actionButtons && !this.isBlazorTemplate) {
            let length: number = this.uploadWrapper.querySelectorAll('.' + VALIDATION_FAILS).length +
                this.uploadWrapper.querySelectorAll('.e-upload-fails:not(.e-upload-progress)').length +
                this.uploadWrapper.querySelectorAll('span.' + UPLOAD_SUCCESS).length +
                this.uploadWrapper.querySelectorAll('span.' + UPLOAD_INPROGRESS).length;
            if (length > 0 && length === this.uploadWrapper.querySelectorAll('li').length) {
                this.uploadButton.setAttribute('disabled', 'disabled');
            } else {
                this.uploadButton.removeAttribute('disabled');
            }
        }
    }

    private renderButtonTemplates(): void {
        if (typeof (this.buttons.browse) === 'string') {
            this.browseButton.textContent = (this.buttons.browse === 'Browse...') ?
                this.localizedTexts('browse') : this.buttons.browse;
            this.browseButton.setAttribute('title', this.browseButton.textContent);
        } else {
            this.browseButton.innerHTML = '';
            this.browseButton.appendChild(this.buttons.browse);
        }
        if (this.uploadButton) {
            let uploadText: string | HTMLElement;
            uploadText = isNullOrUndefined(this.buttons.upload) ? 'Upload' : this.buttons.upload;
            this.buttons.upload = uploadText;
            if (typeof (this.buttons.upload) === 'string') {
                this.uploadButton.textContent = (this.buttons.upload === 'Upload') ?
                    this.localizedTexts('upload') : this.buttons.upload;
                this.uploadButton.setAttribute('title', this.uploadButton.textContent);
            } else {
                this.uploadButton.innerHTML = '';
                this.uploadButton.appendChild(this.buttons.upload);
            }
        }
        if (this.clearButton) {
            let clearText: string | HTMLElement;
            clearText = isNullOrUndefined(this.buttons.clear) ? 'Clear' : this.buttons.clear;
            this.buttons.clear = clearText;
            if (typeof (this.buttons.clear) === 'string') {
                this.clearButton.textContent = (this.buttons.clear === 'Clear') ?
                    this.localizedTexts('clear') : this.buttons.clear;
                this.clearButton.setAttribute('title', this.clearButton.textContent);
            } else {
                this.clearButton.innerHTML = '';
                this.clearButton.appendChild(this.buttons.clear);
            }
        }
    }


    private checkAutoUpload(fileData: FileInfo[]): void {
        if (this.autoUpload) {
            if (this.sequentialUpload) {

                this.sequenceUpload(fileData);
            } else {
                this.upload(fileData);
            }
            this.removeActionButtons();
        } else if (!this.actionButtons) {
            this.renderActionButtons();
        }
        this.checkActionButtonStatus();
    }
    private removeActionButtons(): void {
        if (this.actionButtons) {
            this.unwireActionButtonEvents();
            if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
                detach(this.actionButtons);
            }
            this.actionButtons = null;
        }
    }
    private sequenceUpload(fileData: FileInfo[]): void {
        if (this.filesData.length - fileData.length === 0 ||
            this.filesData[(this.filesData.length - fileData.length - 1)].statusCode !== '1') {
            ++this.count;
            let isFileListCreated: boolean = this.showFileList ? false : true;
            if (typeof this.filesData[this.count] === 'object') {
                this.isFirstFileOnSelection = false;
                this.upload(this.filesData[this.count], isFileListCreated);
                if (this.filesData[this.count].statusCode === '0') {
                    this.sequenceUpload(fileData);
                }
            } else {
                --this.count;
            }
        }
    }

    private unWireEvents(): void {
        EventHandler.remove(this.browseButton, 'click', this.browseButtonClick);
        EventHandler.remove(this.element, 'change', this.onSelectFiles);
        EventHandler.remove(document, 'click', this.removeFocus);
        if (this.isForm) {
            EventHandler.remove(this.formElement, 'reset', this.resetForm);
        }
        if (this.keyboardModule) { this.keyboardModule.destroy(); }
    }

    private resetForm(): void {
        this.clearAll();
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        let targetElement: HTMLElement = e.target as HTMLElement;
        switch (e.action) {
            case 'enter':
                if (e.target === this.clearButton) {
                    this.clearButtonClick();
                } else if (e.target === this.uploadButton) {
                    this.uploadButtonClick();
                } else if (e.target === this.browseButton) {
                    this.browseButtonClick();
                } else if (targetElement.classList.contains(PAUSE_UPLOAD)) {
                    let metaData: MetaData = this.getCurrentMetaData(null, e);
                    metaData.file.statusCode = '4';
                    metaData.file.status = this.localizedTexts('pauseUpload');
                    this.abortUpload(metaData, false);
                } else if (targetElement.classList.contains(RESUME_UPLOAD)) {
                    this.resumeUpload(this.getCurrentMetaData(null, e), e);
                } else if (targetElement.classList.contains(RETRY_ICON)) {
                    let metaData: MetaData = this.getCurrentMetaData(null, e);
                    if (!isNullOrUndefined(metaData)) {
                        metaData.file.statusCode = '1';
                        metaData.file.status = this.localizedTexts('readyToUploadMessage');
                        this.chunkUpload(metaData.file);
                    } else {
                        let target: HTMLElement = (<HTMLElement>e.target).parentElement;
                        let fileData: FileInfo = this.filesData[this.fileList.indexOf(target)];
                        this.retry(fileData);
                    }
                } else {
                    this.removeFiles(e);
                    if (!targetElement.classList.contains(ABORT_ICON)) {
                        this.browseButton.focus();
                    }
                }
                e.preventDefault();
                e.stopPropagation();
                break;
        }
    }

    private getCurrentMetaData(fileInfo?: FileInfo, e?: KeyboardEventArgs): MetaData {
        let fileData: FileInfo; let targetMetaData: MetaData;
        if (isNullOrUndefined(fileInfo)) {
            let target: HTMLElement = (<HTMLElement>e.target).parentElement;
            fileData = this.filesData[this.fileList.indexOf(target)];
        } else {
            fileData = fileInfo;
        }
        for (let i: number = 0; i < this.uploadMetaData.length; i++) {
            if (this.uploadMetaData[i].file.name === fileData.name) {
                targetMetaData = this.uploadMetaData[i];
                break;
            }
        }
        return targetMetaData;
    }

    private removeFocus(): void {
        if (this.uploadWrapper && this.listParent && this.listParent.querySelector('.' + ICON_FOCUSED)) {
            (<HTMLElement>document.activeElement).blur();
            this.listParent.querySelector('.' + ICON_FOCUSED).classList.remove(ICON_FOCUSED);
        }
    }

    private browseButtonClick(): void {
        this.element.click();
    }

    private uploadButtonClick(): void {
        if (this.sequentialUpload) {
            this.sequenceUpload(this.filesData);
        } else {
            this.upload(this.filesData);
        }
    }

    private clearButtonClick(): void {
        this.clearAll();

        if (this.sequentialUpload) {
            this.count = -1;
        }
        this.actionCompleteCount = 0;
    }

    private bindDropEvents(): void {
        if (this.dropZoneElement) {
            EventHandler.add(this.dropZoneElement, 'drop', this.dropElement, this);
            EventHandler.add(this.dropZoneElement, 'dragover', this.dragHover, this);
            EventHandler.add(this.dropZoneElement, 'dragleave', this.onDragLeave, this);
            EventHandler.add(this.dropZoneElement, 'paste', this.onPasteFile, this);
        }
    }

    private unBindDropEvents(): void {
        if (this.dropZoneElement) {
            EventHandler.remove(this.dropZoneElement, 'drop', this.dropElement);
            EventHandler.remove(this.dropZoneElement, 'dragover', this.dragHover);
            EventHandler.remove(this.dropZoneElement, 'dragleave', this.onDragLeave);
        }
    }

    private onDragLeave(e: DragEvent): void {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
    }

    private dragHover(e: DragEvent): void {
        if (!this.enabled) { return; }
        this.dropZoneElement.classList.add(DRAG_HOVER);
        if (this.dropEffect !== 'Default') {
            e.dataTransfer.dropEffect = this.dropEffect.toLowerCase();
        }
        e.preventDefault();
        e.stopPropagation();
    }


    private dropElement(e: DragEvent): void {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
        this.onSelectFiles(e);
        e.preventDefault();
        e.stopPropagation();
    }


    private onPasteFile(event: ClipboardEvent): void {
        let item: DataTransferItemList = event.clipboardData.items;
        if (item.length !== 1) { return; }
        let pasteFile: DataTransferItem = [].slice.call(item)[0];
        if ((pasteFile.kind === 'file') && pasteFile.type.match('^image/')) {
            this.renderSelectedFiles(event, [pasteFile.getAsFile()], false, true);
        }
    }

    private getSelectedFiles(index: number): FileInfo[] {
        let data: FileInfo[] = [];
        let liElement: HTMLElement = this.fileList[index];
        let allFiles: FileInfo[] = this.getFilesData();
        let nameElements: number = +liElement.getAttribute('data-files-count');
        let startIndex: number = 0;
        for (let i: number = 0; i < index; i++) {
            startIndex += (+this.fileList[i].getAttribute('data-files-count'));
        }
        for (let j: number = startIndex; j < (startIndex + nameElements); j++) {
            data.push(allFiles[j]);
        }
        return data;
    }

    private removeFiles(args: MouseEvent | TouchEvent | KeyboardEventArgs): void {
        if (!this.enabled) { return; }
        let selectedElement: HTMLElement = (<HTMLInputElement>args.target).parentElement;
        if (this.isBlazorSaveUrl) {
            this.fileList = [].slice.call(this.uploadWrapper.querySelectorAll('li'));
        }
        let index: number = this.fileList.indexOf(selectedElement);
        let liElement: HTMLElement = this.fileList[index];
        let formUpload: boolean = this.isFormUpload();
        let fileData: FileInfo[] = formUpload ? this.getSelectedFiles(index) : this.getFilesInArray(this.filesData[index]);
        if (isNullOrUndefined(fileData)) { return; }
        if ((<HTMLInputElement>args.target).classList.contains(ABORT_ICON) && !formUpload) {
            fileData[0].statusCode = '5';
            if (!isNullOrUndefined(liElement)) {
                let spinnerTarget: HTMLElement = liElement.querySelector('.' + ABORT_ICON) as HTMLElement;
                createSpinner({ target: spinnerTarget, width: '20px' });
                showSpinner(spinnerTarget);
            }
            if (this.sequentialUpload) {

                this.uploadSequential();
            }
            if (!(liElement.classList.contains(RESTRICT_RETRY))) {
                this.checkActionComplete(true);
            }
        } else if (!closest(args.target as Element, '.' + SPINNER_PANE)) {
            this.remove(fileData, false, false, true, args);
        }
        (this.element as HTMLInputElement).value = '';
        this.checkActionButtonStatus();
    }

    private removeFilesData(file: FileInfo, customTemplate: boolean): void {
        let index: number;
        if (customTemplate) {
            if (!this.showFileList) {
                index = this.filesData.indexOf(file);
                this.filesData.splice(index, 1);
            }
            return;
        }
        let selectedElement: HTMLElement = this.getLiElement(file);
        if (isNullOrUndefined(selectedElement)) { return; }
        if (!this.isBlazorSaveUrl) {
            detach(selectedElement);
        }
        index = this.fileList.indexOf(selectedElement);
        this.fileList.splice(index, 1);
        this.filesData.splice(index, 1);
        if (!this.isBlazorSaveUrl && (this.fileList.length === 0 && !isNullOrUndefined(this.listParent))) {
            detach(this.listParent);
            this.listParent = null;
            this.removeActionButtons();
            if (this.sequentialUpload) {

                if (index <= this.count) {
                    --this.count;
                }
            }
        } else {
            // tslint:disable-next-line
            this.dotNetRef.invokeMethodAsync('RemoveFileData', index);
        }
    }

    private removeUploadedFile(
        file: FileInfo, eventArgs: RemovingEventArgs,
        removeDirectly: boolean, custom: boolean): void {
        let selectedFiles: FileInfo = file;
        let ajax: Ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
        ajax.emitError = false;
        let formData: FormData = new FormData();
        ajax.beforeSend = (e: BeforeSendEventArgs) => {
            eventArgs.currentRequest = ajax.httpRequest;
            if (this.currentRequestHeader) {
                this.updateCustomheader(ajax.httpRequest, this.currentRequestHeader);
            }
            if (this.customFormDatas) {
                this.updateFormData(formData, this.customFormDatas);
            }
            if (!removeDirectly && this.removingEnabled) {
                // @ts-ignore-start
                this.dotNetRef.invokeMethodAsync('RemovingEvent', eventArgs).then((eventArgs: RemovingEventArgs) => {
                    // @ts-ignore-end
                    if (eventArgs.cancel) {
                        e.cancel = true;
                    } else {
                        this.removingEventCallback(file);
                    }
                });
            } else {
                this.removingEventCallback(file);
            }
        };
        let name: string = this.element.getAttribute('name');
        if (!isNullOrUndefined(selectedFiles.rawFile) && selectedFiles.rawFile !== '') {
            formData.append(name, selectedFiles.rawFile, selectedFiles.name);
        } else {
            formData.append(name, selectedFiles.name);
        }
        ajax.onLoad = (e: Event): object => { this.removeCompleted(e, selectedFiles, custom); return {}; };

        ajax.onError = (e: Event): object => { this.removeFailed(e, selectedFiles, custom); return {}; };
        ajax.send(formData);
    }
    private removeCompleted(e: Event, files: FileInfo, customTemplate: boolean): void {
        let response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let status: XMLHttpRequest = e.target as XMLHttpRequest;
        if (status.readyState === 4 && status.status >= 200 && status.status <= 299) {
            let args: Object = {
                e, response: response, operation: 'remove',
                file: this.updateStatus(files, this.localizedTexts('removedSuccessMessage'), '2')
            };
            if (this.successEnabled) {
                this.dotNetRef.invokeMethodAsync('SuccessEvent', args);
            }
            this.removeFilesData(files, customTemplate);
            let index: number = this.uploadedFilesData.indexOf(files);
            this.uploadedFilesData.splice(index, 1);
            if (this.changeEnabled) {
                this.dotNetRef.invokeMethodAsync('ChangeEvent', { files: this.uploadedFilesData });
            }
        } else {
            this.removeFailed(e, files, customTemplate);
        }
    }

    private removeFailed(e: Event, files: FileInfo, customTemplate: boolean): void {
        let response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let args: Object = {
            e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedFailedMessage'), '0')
        };
        if (!customTemplate) {
            let index: number = this.filesData.indexOf(files);
            let rootElement: HTMLElement = this.fileList[index];
            if (rootElement) {
                rootElement.classList.remove(UPLOAD_SUCCESS);
                rootElement.classList.add(UPLOAD_FAILED);
                let statusElement: HTMLElement = rootElement.querySelector('.' + STATUS) as HTMLElement;
                if (statusElement) {
                    statusElement.classList.remove(UPLOAD_SUCCESS);
                    statusElement.classList.add(UPLOAD_FAILED);
                }
            }
            this.checkActionButtonStatus();
        }
        if (this.failuredEnabled) {
            this.dotNetRef.invokeMethodAsync('FailureEvent', args);
        }
        let liElement: HTMLElement = this.getLiElement(files);

        if (!isNullOrUndefined(liElement) && !isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON))) {
            let spinnerTarget: HTMLElement = liElement.querySelector('.' + DELETE_ICON) as HTMLElement;
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
    }
    private removingEventCallback(file: FileInfo): void {

        let liElement: HTMLElement = this.getLiElement(file);
        if (!isNullOrUndefined(liElement) && (!isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON)) ||
            !isNullOrUndefined(liElement.querySelector('.' + REMOVE_ICON)))) {
            let spinnerTarget: HTMLElement;
            spinnerTarget = liElement.querySelector('.' + DELETE_ICON) ? liElement.querySelector('.' + DELETE_ICON) as HTMLElement :
                liElement.querySelector('.' + REMOVE_ICON) as HTMLElement;
            createSpinner({ target: spinnerTarget, width: '20px' });
            showSpinner(spinnerTarget);
        }
    }

    private updateFormData(formData: FormData, customData: { [key: string]: Object }[]): void {
        if (customData && customData.length > 0 && customData[0]) {
            for (let i: number = 0; i < customData.length; i++) {
                let data: { [key: string]: Object } = customData[i];
                // tslint:disable-next-line
                let value: any = Object.keys(data).map(function (e) {
                    return data[e];
                });
                formData.append(Object.keys(data)[0], value);
            }
        }
    }


    private updateCustomheader(request: XMLHttpRequest, currentRequest: { [key: string]: string }[]): void {
        if (currentRequest.length > 0 && currentRequest[0]) {
            for (let i: number = 0; i < currentRequest.length; i++) {
                let data: { [key: string]: string } = currentRequest[i];
                // tslint:disable-next-line
                let value: any = Object.keys(data).map(function (e) {
                    return data[e];
                });
                request.setRequestHeader(Object.keys(data)[0], value);
            }
        }
    }


    private getFilesFromFolder(event: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        this.filesEntries = [];
        let items: DataTransferItem[] | DataTransferItemList;
        items = this.multiple ? (<DragEvent>event).dataTransfer.items : [(<DragEvent>event).dataTransfer.items[0]];
        let validDirectoryUpload: boolean = this.checkDirectoryUpload(items);
        if (!validDirectoryUpload) { return; }
        for (let i: number = 0; i < items.length; i++) {
            // tslint:disable-next-line
            let item: any = items[i].webkitGetAsEntry();
            if (item.isFile) {
                let files: { [key: string]: Object }[] = [];
                // tslint:disable-next-line
                (item).file((fileObj: any) => {
                    let path: string = item.fullPath;
                    files.push({ 'path': path, 'file': fileObj });
                });
                this.renderSelectedFiles(event, files, true);
            } else if (item.isDirectory) {
                this.traverseFileTree(item, event);
            }
        }
    }


    private checkDirectoryUpload(items: DataTransferItem[] | DataTransferItemList): boolean {
        for (let i: number = 0; items && i < items.length; i++) {
            // tslint:disable-next-line
            let item: any = items[i].webkitGetAsEntry();
            if (item.isDirectory) { return true; }
        }
        return false;
    }
    // tslint:disable

    public traverseFileTree(item: any, event?: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        if (item.isFile) {
            this.filesEntries.push(item);
        } else if (item.isDirectory) {
            // tslint:disable-next-line
            let directoryReader: any = item.createReader();
            // tslint:disable-next-line
            this.readFileFromDirectory(directoryReader, event);
        }
    }

    // tslint:disable

    private readFileFromDirectory(directoryReader: any, event?: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        // tslint:disable-next-line
        directoryReader.readEntries((entries: any) => {
            for (let i: number = 0; i < entries.length; i++) {
                this.traverseFileTree(entries[i]);
                // tslint:disable-next-line
            };
            this.pushFilesEntries(event);
            if (entries.length) {
                this.readFileFromDirectory(directoryReader);
            }
        });
    }

    private pushFilesEntries(event?: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        let files: { [key: string]: Object }[] = [];
        for (let i: number = 0; i < this.filesEntries.length; i++) {
            // tslint:disable-next-line
            this.filesEntries[i].file((fileObj: any) => {
                if (this.filesEntries.length) {
                    let path: string = this.filesEntries[i].fullPath;
                    files.push({ 'path': path, 'file': fileObj });
                    if (i === this.filesEntries.length - 1) {
                        this.filesEntries = [];
                        this.renderSelectedFiles(event, files, true);
                    }
                }
            });
        }
    }
    // tslint:enable
    private onSelectFiles(args: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        if (!this.enabled) { return; }
        let targetFiles: File[];

        if (args.type === 'drop') {
            if (this.directoryUpload) {
                this.getFilesFromFolder(args);
            } else {
                let files: FileList = this.sortFilesList = (<DragEvent>args).dataTransfer.files;
                if (this.browserName !== 'msie' && this.browserName !== 'edge') {
                    (this.element as HTMLInputElement).files = files;
                }
                if (files.length > 0) {
                    targetFiles = this.multiple ? this.sortFileList(files) : [files[0]];
                    this.renderSelectedFiles(args, targetFiles);
                }
            }
        } else {
            targetFiles = [].slice.call((<HTMLInputElement>args.target).files);
            this.renderSelectedFiles(args, targetFiles);
        }
    }

    private getBase64(file: File): Promise<void> {
        return new Promise((resolve: Function, reject: Function) => {
            let fileReader: FileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result as string);
            fileReader.onerror = (error: ProgressEvent) => reject(error);
        });
    }


    /* tslint:ignore */
    private renderSelectedFiles(
        args: MouseEvent | TouchEvent | DragEvent | ClipboardEvent,
        // tslint:disable-next-line
        targetFiles: any, directory?: boolean, paste?: boolean): void {
        this.base64String = [];
        // tslint:disable-next-line
        let eventArgs: SelectedEventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            isModified: false,
            modifiedFilesData: [],
            progressInterval: '',
            isCanceled: false,
            currentRequest: null,
            customFormData: null,
            type: args.type
        };

        if (targetFiles.length < 1) {
            eventArgs.isCanceled = true;
            if (this.selectedEnabled) {
                this.dotNetRef.invokeMethodAsync('SelectedEvent', eventArgs);
            }
            return;
        }
        this.flag = true;
        let fileData: FileInfo[] = [];
        if (!this.multiple) {
            this.clearData(true);
            targetFiles = [targetFiles[0]];
        }
        for (let i: number = 0; i < targetFiles.length; i++) {
            let file: File = directory ? targetFiles[i].file : targetFiles[i];
            this.updateInitialFileDetails(args, targetFiles, file, i, fileData, directory, paste);
        }
        eventArgs.filesData = fileData;
        if (this.allowedExtensions.indexOf('*') > -1) { this.allTypes = true; }
        if (!this.allTypes) { fileData = this.checkExtension(fileData); }
        if (this.selectedEnabled) {
            // @ts-ignore-start
            this.dotNetRef.invokeMethodAsync('SelectedEvent', eventArgs).then((eventArgs: SelectedEventArgs) => {
                // @ts-ignore-end
                this._internalRenderSelect(eventArgs, fileData);
            });
        } else {
            this._internalRenderSelect(eventArgs, fileData);
        }
    }

    private updateInitialFileDetails(args: MouseEvent | TouchEvent | DragEvent | ClipboardEvent,
        // tslint:disable-next-line
        targetFiles: any, file: File, i: number, fileData: FileInfo[], directory?: boolean, paste?: boolean): void {
        let fileName: string = directory ? targetFiles[i].path.substring(1, targetFiles[i].path.length) : paste ?
            getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name) :
            this.directoryUpload ? targetFiles[i].webkitRelativePath : file.name;
        let fileDetails: FileInfo = {
            name: fileName,
            rawFile: file,
            size: file.size,
            status: this.localizedTexts('readyToUploadMessage'),
            type: this.getFileType(file.name),
            validationMessages: this.validatedFileSize(file.size),
            statusCode: '1',
            id: getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name)
        };

        if (paste) { fileDetails.fileSource = 'paste'; }
        fileDetails.status = fileDetails.validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
            fileDetails.validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : fileDetails.status;
        if (fileDetails.validationMessages.minSize !== '' || fileDetails.validationMessages.maxSize !== '') {
            fileDetails.statusCode = '0';
        }
        fileData.push(fileDetails);
    }

    private _internalRenderSelect(eventArgs: SelectedEventArgs, fileData: FileInfo[]): void {
        if (!eventArgs.cancel) {
            this.currentRequestHeader = eventArgs.currentRequest;
            this.customFormDatas = eventArgs.customFormData;
            this.selectedFiles = this.selectedFiles.concat(fileData);
            this.btnTabIndex = this.disableKeyboardNavigation ? '-1' : '0';
            if (this.showFileList) {
                if (eventArgs.isModified && eventArgs.modifiedFilesData.length > 0) {
                    for (let j: number = 0; j < eventArgs.modifiedFilesData.length; j++) {
                        for (let k: number = 0; k < fileData.length; k++) {
                            if (eventArgs.modifiedFilesData[j].id === fileData[k].id) {
                                eventArgs.modifiedFilesData[j].rawFile = fileData[k].rawFile;
                            }
                        }
                    }
                    let dataFiles: FileInfo[] = this.allTypes ? eventArgs.modifiedFilesData :
                        this.checkExtension(eventArgs.modifiedFilesData);
                    this.updateSortedFileList(dataFiles);
                    this.filesData = dataFiles;
                    if (!this.isForm || this.allowUpload()) {
                        this.checkAutoUpload(dataFiles);
                    }
                } else {
                    this.createFileList(fileData, true);
                    if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
                        this.filesData = this.filesData.concat(fileData);
                    }
                    if ((!this.isForm || this.allowUpload()) && !(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
                        this.checkAutoUpload(fileData);
                    }
                }
                if (!isNullOrUndefined(eventArgs.progressInterval) && eventArgs.progressInterval !== '') {
                    this.progressInterval = eventArgs.progressInterval;
                }
            } else {
                this.filesData = this.filesData.concat(fileData);
                if (this.isBlazorSaveUrl) {
                    // tslint:disable-next-line
                    this.dotNetRef.invokeMethodAsync('UpdateServerFileData', this.filesData, this.isForm);
                }
                if (this.autoUpload) {
                    this.upload(this.filesData, true);
                }
            }
            this.raiseActionComplete();
            this.isFirstFileOnSelection = true;
        }
    }

    private allowUpload(): boolean {
        let allowFormUpload: boolean = false;
        if (this.isForm && (!isNullOrUndefined(this.asyncSettings.saveUrl) && this.asyncSettings.saveUrl !== '')) {
            allowFormUpload = true;
        }
        return allowFormUpload;
    }

    private isFormUpload(): boolean {
        let isFormUpload: boolean = false;
        if (this.isForm && ((isNullOrUndefined(this.asyncSettings.saveUrl) || this.asyncSettings.saveUrl === '')
            && (isNullOrUndefined(this.asyncSettings.removeUrl) || this.asyncSettings.removeUrl === ''))) {
            isFormUpload = true;
        }
        return isFormUpload;
    }

    private clearData(singleUpload?: boolean): void {
        if (!isNullOrUndefined(this.listParent) && !(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            detach(this.listParent);
            this.listParent = null;
        }
        if (this.browserName !== 'msie' && !singleUpload) { (this.element as HTMLInputElement).value = ''; }
        this.fileList = [];
        this.filesData = [];
        if (this.isBlazorSaveUrl || this.isBlazorTemplate) {
            // tslint:disable-next-line
            this.dotNetRef.invokeMethodAsync('ClearAllFile');
        } else {
            this.removeActionButtons();
        }
    }

    private updateSortedFileList(filesData: FileInfo[]): void {
        let previousListClone: HTMLElement = createElement('div', { id: 'clonewrapper' });
        let added: number = -1;
        let removedList: HTMLElement[];
        if (this.listParent) {
            for (let i: number = 0; i < this.listParent.querySelectorAll('li').length; i++) {
                let liElement: HTMLElement = this.listParent.querySelectorAll('li')[i];
                previousListClone.appendChild(liElement.cloneNode(true));
            }
            removedList = <HTMLElement[] & NodeListOf<HTMLLIElement>>this.listParent.querySelectorAll('li');
            for (let item of removedList) {
                detach(item);
            }
            this.removeActionButtons();
            let oldList: HTMLElement[] = [].slice.call(previousListClone.childNodes);
            detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createParentUL();
            for (let index: number = 0; index < filesData.length; index++) {
                for (let j: number = 0; j < this.filesData.length; j++) {
                    if (this.filesData[j].name === filesData[index].name) {
                        this.listParent.appendChild(oldList[j]);
                        EventHandler.add(oldList[j].querySelector('.e-icons'), 'click', this.removeFiles, this);
                        this.fileList.push(oldList[j]);
                        added = index;
                    }
                }
                if (added !== index) { this.createFileList([filesData[index]]); }
            }
        } else { this.createFileList(filesData); }
    }

    private isBlank(str: string): boolean {
        return (!str || /^\s*$/.test(str));
    }

    private checkExtension(files: FileInfo[]): FileInfo[] {
        let dropFiles: FileInfo[] = files;
        if (!this.isBlank(this.allowedExtensions)) {
            let allowedExtensions: string[] = [];
            let extensions: string[] = this.allowedExtensions.split(',');
            for (let extension of extensions) {
                allowedExtensions.push(extension.trim().toLocaleLowerCase());
            }
            for (let i: number = 0; i < files.length; i++) {
                if (allowedExtensions.indexOf(('.' + files[i].type).toLocaleLowerCase()) === -1) {
                    files[i].status = this.localizedTexts('invalidFileType');
                    files[i].statusCode = '0';
                }
            }
        }
        return dropFiles;
    }

    private validatedFileSize(fileSize: number): Object {
        let minSizeError: string = '';
        let maxSizeError: string = '';
        if (fileSize < this.minFileSize) {
            minSizeError = this.localizedTexts('invalidMinFileSize');
        } else if (fileSize > this.maxFileSize) {
            maxSizeError = this.localizedTexts('invalidMaxFileSize');
        } else {
            minSizeError = '';
            maxSizeError = '';
        }
        let errorMessage: Object = { minSize: minSizeError, maxSize: maxSizeError };
        return errorMessage;
    }

    private isPreLoadFile(fileData: FileInfo): boolean {
        let isPreload: boolean = false;
        if (this.files) {
            for (let i: number = 0; i < this.files.length; i++) {
                if (this.files[i].name === fileData.name.slice(0, fileData.name.lastIndexOf('.')) && this.files[i].type === fileData.type) {
                    isPreload = true;
                    break;
                }
            }
        }
        return isPreload;
    }

    private createParentUL(): void {
        if (isNullOrUndefined(this.listParent)) {
            this.listParent = createElement('ul', { className: LIST_PARENT });
            this.uploadWrapper.appendChild(this.listParent);
        }
    }

    private formFileList(fileData: FileInfo[], files: FileList): void {
        let fileList: HTMLElement = createElement('li', { className: FILE });
        fileList.setAttribute('data-files-count', fileData.length + '');
        let fileContainer: HTMLElement = createElement('span', { className: TEXT_CONTAINER });
        let statusMessage: string;
        for (let listItem of fileData) {
            let fileNameEle: HTMLElement = createElement('span', { className: FILE_NAME });
            fileNameEle.innerHTML = this.getFileNameOnly(listItem.name);
            let fileTypeEle: HTMLElement = createElement('span', { className: FILE_TYPE });
            fileTypeEle.innerHTML = '.' + this.getFileType(listItem.name);
            if (!this.enableRtl) {
                fileContainer.appendChild(fileNameEle);
                fileContainer.appendChild(fileTypeEle);
            } else {
                let rtlContainer: Element = createElement('span', { className: RTL_CONTAINER });
                rtlContainer.appendChild(fileTypeEle);
                rtlContainer.appendChild(fileNameEle);
                fileContainer.appendChild(rtlContainer);
            }
            this.truncateName(fileNameEle);
            statusMessage = this.formValidateFileInfo(listItem, fileList);
        }
        fileList.appendChild(fileContainer);
        this.setListToFileInfo(fileData, fileList);
        let index: number = this.listParent.querySelectorAll('li').length;
        let infoEle: HTMLElement = createElement('span');
        if (fileList.classList.contains(INVALID_FILE)) {
            infoEle.classList.add(STATUS);
            infoEle.classList.add(INVALID_FILE);
            infoEle.innerText = fileData.length > 1 ? this.localizedTexts('invalidFileSelection') : statusMessage;
        } else {
            infoEle.classList.add(fileData.length > 1 ? INFORMATION : FILE_SIZE);
            infoEle.innerText = fileData.length > 1 ? this.localizedTexts('totalFiles') + ': ' + fileData.length + ' , '
                + this.localizedTexts('size') + ': ' +
                this.bytesToSize(this.getFileSize(fileData)) : this.bytesToSize(fileData[0].size);
            this.createFormInput(fileData);
        }
        fileContainer.appendChild(infoEle);

        if (isNullOrUndefined(fileList.querySelector('.e-icons'))) {
            let iconElement: HTMLElement = createElement('span', { className: 'e-icons', attrs: { 'tabindex': this.btnTabIndex } });

            if (this.browserName === 'msie') { iconElement.classList.add('e-msie'); }
            iconElement.setAttribute('title', this.localizedTexts('remove'));
            fileList.appendChild(fileContainer);
            fileList.appendChild(iconElement);
            EventHandler.add(iconElement, 'click', this.removeFiles, this);
            iconElement.classList.add(REMOVE_ICON);
        }
        let eventsArgs: FileListRenderingEventArgs = {
            element: fileList,
            fileInfo: this.mergeFileInfo(fileData, fileList),
            index: index,
            isPreload: this.isPreLoadFile(this.mergeFileInfo(fileData, fileList))
        };
        if (this.fileListRenderEnabled) {
            this.dotNetRef.invokeMethodAsync('FileListRenderingEvent', eventsArgs);
        }
        this.listParent.appendChild(fileList);
        this.fileList.push(fileList);
    }

    private formValidateFileInfo(listItem: FileInfo, fileList: HTMLElement): string {
        let statusMessage: string = listItem.status;
        let validationMessages: ValidationMessages = this.validatedFileSize(listItem.size);
        if (validationMessages.minSize !== '' || validationMessages.maxSize !== '') {
            this.addInvalidClass(fileList);
            statusMessage = validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
                validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : statusMessage;
        }
        let typeValidationMessage: string = this.checkExtension(this.getFilesInArray(listItem))[0].status;
        if (typeValidationMessage === this.localizedTexts('invalidFileType')) {
            this.addInvalidClass(fileList);
            statusMessage = typeValidationMessage;
        }
        return statusMessage;
    }

    private addInvalidClass(fileList: HTMLElement): void {
        fileList.classList.add(INVALID_FILE);
    }

    private createFormInput(fileData: FileInfo[]): void {
        let inputElement: HTMLInputElement = this.element.cloneNode(true) as HTMLInputElement;
        inputElement.classList.add(HIDDEN_INPUT);
        for (let listItem of fileData) {
            listItem.input = inputElement;
        }
        inputElement.setAttribute('name', this.uploaderName);
        this.uploadWrapper.querySelector('.' + INPUT_WRAPPER).appendChild(inputElement);
        if (this.browserName !== 'msie' && this.browserName !== 'edge') {
            (this.element as HTMLInputElement).value = '';
        }
    }

    private getFileSize(fileData: FileInfo[]): number {
        let fileSize: number = 0;
        for (let file of fileData) {
            fileSize += file.size;
        }
        return fileSize;
    }

    private mergeFileInfo(fileData: FileInfo[], fileList: HTMLElement): FileInfo {
        let result: FileInfo = {
            name: '',
            rawFile: '',
            size: 0,
            status: '',
            type: '',
            validationMessages: { minSize: '', maxSize: '' },
            statusCode: '1',
            list: fileList
        };
        let fileNames: string[] = [];
        let type: string = '';
        for (let listItem of fileData) {
            fileNames.push(listItem.name);
            type = listItem.type;
        }
        result.name = fileNames.join(', ');
        result.size = this.getFileSize(fileData);
        result.type = type;
        result.status = this.statusForFormUpload(fileData, fileList);
        return result;
    }

    private statusForFormUpload(fileData: FileInfo[], fileList: HTMLElement): string {
        let isValid: boolean = true;
        let statusMessage: string;
        for (let listItem of fileData) {
            statusMessage = listItem.status;
            let validationMessages: ValidationMessages = this.validatedFileSize(listItem.size);
            if (validationMessages.minSize !== '' || validationMessages.maxSize !== '') {
                isValid = false;
                statusMessage = validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
                    validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : statusMessage;
            }
            let typeValidationMessage: string = this.checkExtension(this.getFilesInArray(listItem))[0].status;
            if (typeValidationMessage === this.localizedTexts('invalidFileType')) {
                isValid = false;
                statusMessage = typeValidationMessage;
            }
        }

        if (!isValid) {
            fileList.classList.add(INVALID_FILE);
            statusMessage = fileData.length > 1 ? this.localizedTexts('invalidFileSelection') : statusMessage;
        } else {
            statusMessage = this.localizedTexts('totalFiles') + ': ' + fileData.length + ' , '
                + this.localizedTexts('size') + ': ' +
                this.bytesToSize(this.getFileSize(fileData));
        }
        return statusMessage;
    }


    /**
     * Create the file list for specified files data.
     * @param { FileInfo[] } fileData - specifies the files data for file list creation.
     * @returns void
     */
    public createFileList(fileData: FileInfo[], isSelectedFile?: boolean): void {
        if (this.isBlazorSaveUrl || this.isBlazorTemplate) {
            let fileListData: FileInfo[] = (isSelectedFile) ? this.filesData = this.filesData.concat(fileData) : fileData;
            // tslint:disable-next-line
            this.dotNetRef.invokeMethodAsync('CreateFileList', fileListData, this.isForm);
        } else {
            this.createParentUL(); if (this.isFormUpload()) {
                this.uploadWrapper.classList.add(FORM_UPLOAD);
                this.formFileList(fileData, (this.element as HTMLInputElement).files);
            } else {
                for (let listItem of fileData) {
                    let liElement: HTMLElement = createElement('li', {
                        className: FILE,
                        attrs: { 'data-file-name': listItem.name, 'data-files-count': '1' }
                    });
                    let textContainer: Element = createElement('span', { className: TEXT_CONTAINER });
                    let textElement: HTMLElement = createElement('span', { className: FILE_NAME, attrs: { 'title': listItem.name } });
                    textElement.innerHTML = this.getFileNameOnly(listItem.name);
                    let fileExtension: Element = createElement('span', { className: FILE_TYPE });
                    fileExtension.innerHTML = '.' + this.getFileType(listItem.name);
                    if (!this.enableRtl) {
                        textContainer.appendChild(textElement);
                        textContainer.appendChild(fileExtension);
                    } else {
                        let rtlContainer: Element = createElement('span', { className: RTL_CONTAINER });
                        rtlContainer.appendChild(fileExtension);
                        rtlContainer.appendChild(textElement);
                        textContainer.appendChild(rtlContainer);
                    }
                    let fileSize: Element = createElement('span', { className: FILE_SIZE });
                    fileSize.innerHTML = this.bytesToSize(listItem.size);
                    textContainer.appendChild(fileSize);
                    let statusElement: HTMLElement = createElement('span', { className: STATUS });
                    textContainer.appendChild(statusElement);
                    statusElement.innerHTML = listItem.status;
                    liElement.appendChild(textContainer);
                    let iconElement: HTMLElement = createElement('span', {
                        className: ' e-icons',
                        attrs: { 'tabindex': this.btnTabIndex }
                    });

                    if (this.browserName === 'msie') { iconElement.classList.add('e-msie'); }
                    iconElement.setAttribute('title', this.localizedTexts('remove'));
                    liElement.appendChild(iconElement);
                    EventHandler.add(iconElement, 'click', this.removeFiles, this);
                    if (listItem.statusCode === '2') {
                        statusElement.classList.add(UPLOAD_SUCCESS);
                        iconElement.classList.add(DELETE_ICON);
                        iconElement.setAttribute('title', this.localizedTexts('delete'));
                    } else if (listItem.statusCode !== '1') {
                        statusElement.classList.remove(UPLOAD_SUCCESS);
                        statusElement.classList.add(VALIDATION_FAILS);
                    }
                    if (this.autoUpload && listItem.statusCode === '1' && this.asyncSettings.saveUrl !== '') {
                        statusElement.innerHTML = '';
                    }
                    if (!iconElement.classList.contains(DELETE_ICON)) {
                        iconElement.classList.add(REMOVE_ICON);
                    }
                    let index: number = fileData.indexOf(listItem);
                    let eventsArgs: FileListRenderingEventArgs = {
                        element: liElement,
                        fileInfo: listItem,
                        index: index,
                        isPreload: this.isPreLoadFile(listItem)
                    };
                    if (this.fileListRenderEnabled) {
                        this.dotNetRef.invokeMethodAsync('FileListRenderingEvent', eventsArgs);
                    }
                    this.listParent.appendChild(liElement);
                    this.fileList.push(liElement);
                    this.truncateName(textElement);
                    let preventActionComplete: boolean = this.flag;
                    if (this.isPreLoadFile(listItem)) {
                        this.flag = false;
                        this.checkActionComplete(true);
                        this.flag = preventActionComplete;
                    }
                }
            }
        }
    }

    private getSlicedName(nameElement: HTMLElement): void {
        let text: string;
        text = nameElement.textContent;
        nameElement.dataset.tail = text.slice(text.length - 10);
    }

    private setListToFileInfo(fileData: FileInfo[], fileList: HTMLElement): void {
        for (let listItem of fileData) {
            listItem.list = fileList;
        }
    }

    private truncateName(name: HTMLElement): void {
        let nameElement: HTMLElement = name;
        if (this.browserName !== 'edge' && nameElement.offsetWidth < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);

        } else if (nameElement.offsetWidth + 1 < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
        }
    }

    private getFileType(name: string): string {
        let extension: string;
        let index: number = name.lastIndexOf('.');
        if (index >= 0) {
            extension = name.substring(index + 1);
        }
        return extension ? extension : '';
    }

    private getFileNameOnly(name: string): string {
        let type: string = this.getFileType(name);
        let names: string[] = name.split('.' + type);
        return type = names[0];
    }

    private setInitialAttributes(): void {
        if (this.initialAttr.accept) { this.element.setAttribute('accept', this.initialAttr.accept); }
        if (this.initialAttr.disabled) { this.element.setAttribute('disabled', 'disabled'); }
        if (this.initialAttr.multiple) {
            let newAttr: Attr = document.createAttribute('multiple');
            this.element.setAttributeNode(newAttr);
        }
    }

    private filterfileList(files: FileInfo[]): FileInfo[] {
        let filterFiles: FileInfo[] = [];
        let li: HTMLElement;
        for (let i: number = 0; i < files.length; i++) {
            li = this.getLiElement(files[i]);
            if (!li.classList.contains(UPLOAD_SUCCESS)) {
                filterFiles.push(files[i]);
            }
        }
        return filterFiles;
    }

    private updateStatus(files: FileInfo, status?: string, statusCode?: string, updateLiStatus: boolean = true): FileInfo {
        if (!(status === '' || isNullOrUndefined(status)) && !(statusCode === '' || isNullOrUndefined(statusCode))) {
            if (this.isBlazorSaveUrl) {
                for (let i: number = 0; i < this.filesData.length; i++) {
                    if (this.filesData[i].name === files.name) {
                        this.filesData[i].status = status;
                        this.filesData[i].statusCode = statusCode;
                    }
                }
            } else {
                files.status = status;
                files.statusCode = statusCode;
            }
        }
        if (updateLiStatus) {
            let li: HTMLElement = this.getLiElement(files);
            if (!isNullOrUndefined(li)) {
                if (!isNullOrUndefined(li.querySelector('.' + STATUS)) && !((status === '' || isNullOrUndefined(status)))) {
                    li.querySelector('.' + STATUS).textContent = status;
                }
            }
        }
        return files;
    }

    private getLiElement(files: FileInfo): HTMLElement {
        let index: number;
        for (let i: number = 0; i < this.filesData.length; i++) {
            if ((!isNullOrUndefined(this.filesData[i].id) && !isNullOrUndefined(files.id)) ? (this.filesData[i].name === files.name &&
                this.filesData[i].id === files.id) : this.filesData[i].name === files.name) {
                index = i;
            }
        }
        return this.fileList[index];
    }

    private createProgressBar(liElement: Element): void {
        let progressbarWrapper: Element = createElement('span', { className: PROGRESS_WRAPPER });
        let progressBar: Element = createElement('progressbar', { className: PROGRESSBAR, attrs: { value: '0', max: '100' } });
        let progressbarInnerWrapper: Element = createElement('span', { className: PROGRESS_INNER_WRAPPER });
        progressBar.setAttribute('style', 'width: 0%');
        let progressbarText: Element = createElement('span', { className: PROGRESSBAR_TEXT });
        progressbarText.textContent = '0%';
        progressbarInnerWrapper.appendChild(progressBar);
        progressbarWrapper.appendChild(progressbarInnerWrapper);
        progressbarWrapper.appendChild(progressbarText);
        liElement.querySelector('.' + TEXT_CONTAINER).appendChild(progressbarWrapper);
    }


    private updateProgressbar(e: ProgressEventInit, li: Element): void {
        if (!isNaN(Math.round((e.loaded / e.total) * 100)) && !isNullOrUndefined(li.querySelector('.' + PROGRESSBAR))) {
            if (!isNullOrUndefined(this.progressInterval) && this.progressInterval !== '') {
                let value: number = (Math.round((e.loaded / e.total) * 100)) % parseInt(this.progressInterval, 10);
                if (value === 0 || value === 100) {
                    this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
                }
            } else {
                this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
            }
        }
    }

    private changeProgressValue(li: Element, progressValue: string): void {
        li.querySelector('.' + PROGRESSBAR).setAttribute('style', 'width:' + progressValue);
        li.querySelector('.' + PROGRESSBAR_TEXT).textContent = progressValue;
    }

    private uploadInProgress(e: ProgressEventInit, files: FileInfo, customUI?: boolean, request?: Ajax): void {
        let li: HTMLElement = this.getLiElement(files);
        if (isNullOrUndefined(li) && (!customUI)) { return; }
        if (!isNullOrUndefined(li)) {

            if (files.statusCode === '5') {
                this.cancelUploadingFile(files, e, request, li);
            }
            if (!(li.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0) && li.querySelector('.' + STATUS)) {
                li.querySelector('.' + STATUS).classList.add(UPLOAD_INPROGRESS);
                this.createProgressBar(li);
                this.updateProgressBarClasses(li, UPLOAD_INPROGRESS);
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            }
            this.updateProgressbar(e, <Element>li);
            let iconEle: HTMLElement = li.querySelector('.' + REMOVE_ICON) as HTMLElement;
            if (!isNullOrUndefined(iconEle)) {
                iconEle.classList.add(ABORT_ICON, UPLOAD_INPROGRESS);
                iconEle.setAttribute('title', this.localizedTexts('abort'));
                iconEle.classList.remove(REMOVE_ICON);
            }
        } else {
            this.cancelUploadingFile(files, e, request);
        }
        let args: object = { e, operation: 'upload', file: this.updateStatus(files, this.localizedTexts('inProgress'), '3') };
        if (this.progressingEnabled) {
            this.dotNetRef.invokeMethodAsync('ProgressEvent', args);
        }
    }

    private cancelEventCallback(files: FileInfo, request?: Ajax, li?: HTMLElement, eventArgs?: CancelEventArgs): void {
        if (eventArgs.cancel) {
            files.statusCode = '3';
            if (!isNullOrUndefined(li)) {
                let spinnerTarget: HTMLElement = li.querySelector('.' + ABORT_ICON) as HTMLElement;
                if (!isNullOrUndefined(spinnerTarget)) {
                    hideSpinner(spinnerTarget);
                    detach(li.querySelector('.e-spinner-pane'));
                }
            }
        } else {
            request.emitError = false;
            request.httpRequest.abort();
            let formData: FormData = new FormData();
            if (files.statusCode === '5') {
                let name: string = this.element.getAttribute('name');
                formData.append(name, files.name);
                formData.append('cancel-uploading', files.name);
                let ajax: Ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
                ajax.emitError = false;
                ajax.onLoad = (e: Event): object => { this.removecanceledFile(e, files); return {}; };
                ajax.send(formData);
            }
        }
    }

    private cancelUploadingFile(files: FileInfo, e: ProgressEventInit, request?: Ajax, li?: HTMLElement): void {
        if (files.statusCode === '5') {
            let eventArgs: CancelEventArgs = {
                event: e,
                fileData: files,
                cancel: false
            };
            if (this.cancelEnabled) {
                // @ts-ignore-start
                this.dotNetRef.invokeMethodAsync('CancelingEvent', eventArgs).then((eventArgs: CancelEventArgs) => {
                    // @ts-ignore-end
                    this.cancelEventCallback(files, request, li, eventArgs);
                });
            } else {
                this.cancelEventCallback(files, request, li, eventArgs);
            }
        }
    }

    private removecanceledFile(e: Event, file: FileInfo): void {
        let liElement: HTMLElement = this.getLiElement(file);
        if (liElement.querySelector('.' + RETRY_ICON) || isNullOrUndefined(liElement.querySelector('.' + ABORT_ICON))) { return; }
        this.updateStatus(file, this.localizedTexts('fileUploadCancel'), '5');
        this.renderFailureState(e, file, liElement);
        let spinnerTarget: HTMLElement = liElement.querySelector('.' + REMOVE_ICON) as HTMLElement;
        if (!isNullOrUndefined(liElement)) {
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
        let requestResponse: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let args: Object = { event: e, response: requestResponse, operation: 'cancel', file: file };
        if (this.successEnabled) {
            this.dotNetRef.invokeMethodAsync('SuccessEvent', args);
        }
    }

    private renderFailureState(e: Event, file: FileInfo, liElement: HTMLElement): void {
        this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        this.removeProgressbar(liElement, 'failure');
        if (!isNullOrUndefined(liElement.querySelector('.e-file-status'))) {
            liElement.querySelector('.e-file-status').classList.add(UPLOAD_FAILED);
        }
        let deleteIcon: Element = liElement.querySelector('.' + ABORT_ICON);
        if (isNullOrUndefined(deleteIcon)) { return; }
        deleteIcon.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
        deleteIcon.classList.add(REMOVE_ICON);
        deleteIcon.setAttribute('title', this.localizedTexts('remove'));
        this.pauseButton = createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex } });
        deleteIcon.parentElement.insertBefore(this.pauseButton, deleteIcon);
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
        let retryElement: HTMLElement = liElement.querySelector('.' + RETRY_ICON) as HTMLElement;

        retryElement.addEventListener('click', (e: Event) => { this.reloadcanceledFile(e, file, liElement, false); }, false);
    }

    private reloadcanceledFile(e: Event, file: FileInfo, liElement?: HTMLElement, custom?: boolean): void {
        file.statusCode = '1';
        file.status = this.localizedTexts('readyToUploadMessage');
        if (!custom) {
            liElement.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            if (!isNullOrUndefined(liElement.querySelector('.' + RETRY_ICON))) {
                detach(liElement.querySelector('.' + RETRY_ICON));
            }
            this.pauseButton = null;
        }

        liElement.classList.add(RESTRICT_RETRY);
        this.upload([file]);
    }


    private uploadComplete(e: Event, file: FileInfo, customUI?: boolean): void {
        let status: XMLHttpRequest = e.target as XMLHttpRequest;
        if (status.readyState === 4 && status.status >= 200 && status.status <= 299) {
            let li: HTMLElement = this.getLiElement(file);
            if (isNullOrUndefined(li) && (!customUI || isNullOrUndefined(customUI))) { return; }
            if (!isNullOrUndefined(li)) {
                this.updateProgressBarClasses(li, UPLOAD_SUCCESS);
                this.removeProgressbar(li, 'success');
                let iconEle: Element = li.querySelector('.' + ABORT_ICON);
                if (!isNullOrUndefined(iconEle)) {
                    iconEle.classList.add(DELETE_ICON);
                    iconEle.setAttribute('title', this.localizedTexts('delete'));
                    iconEle.classList.remove(ABORT_ICON);
                    iconEle.classList.remove(UPLOAD_INPROGRESS);
                }
            }
            this.raiseSuccessEvent(e, file);
        } else {
            this.uploadFailed(e, file);
        }
    }

    private getResponse(e: Event): Object {
        // tslint:disable-next-line
        let target: any = e.currentTarget;
        let response: Object = {
            readyState: target.readyState,
            statusCode: target.status,
            statusText: target.statusText,
            headers: target.getAllResponseHeaders(),
            withCredentials: target.withCredentials
        };
        return response;
    }


    public serverRemoveIconBindEvent(): void {
        if (this.uploadWrapper && this.isBlazorSaveUrl) {
            let iconElement: HTMLElement[] = [].slice.call(this.uploadWrapper.querySelectorAll('ul li'));
            for (let i: number = 0; i < iconElement.length; i++) {
                let removeIconEle: HTMLElement = (iconElement[i]) ? iconElement[i].querySelector('.e-icons') : null;
                if (removeIconEle) {
                    EventHandler.remove(removeIconEle, 'click', this.removeFiles);
                    EventHandler.add(removeIconEle, 'click', this.removeFiles, this);
                }
            }
        }
    }

    public raiseSuccessEvent(e: Event, file: FileInfo): void {
        let response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let statusMessage: string = this.localizedTexts('uploadSuccessMessage');
        let args: Object = {
            e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '2', false), statusText: statusMessage
        };
        if (!this.isBlazorSaveUrl) {
            let liElement: HTMLElement = this.getLiElement(file);
            if (!isNullOrUndefined(liElement)) {
                let spinnerEle: HTMLElement = liElement.querySelector('.' + SPINNER_PANE) as HTMLElement;
                if (!isNullOrUndefined(spinnerEle)) {
                    hideSpinner(liElement);
                    detach(spinnerEle);
                }
            }
        }
        if (this.successEnabled) {
            // @ts-ignore-start
            this.dotNetRef.invokeMethodAsync('SuccessEvent', args).then((args: Object) => {
                // @ts-ignore-end
                this.successEventCallback(file, args);
            });
        } else {
            this.successEventCallback(file, args);
        }
    }
    private successEventCallback(file: FileInfo, args?: Object): void {
        // tslint:disable-next-line
        this.updateStatus(file, (args as any).statusText, '2');
        this.uploadedFilesData.push(file);
        if (!this.isBlazorSaveUrl && this.changeEnabled) {
            this.dotNetRef.invokeMethodAsync('ChangeEvent', { files: this.uploadedFilesData });
        }
        this.checkActionButtonStatus();
        if (this.fileList.length > 0) {
            if ((!(this.getLiElement(file)).classList.contains(RESTRICT_RETRY))) {
                this.uploadSequential();
                this.checkActionComplete(true);
            } else {

                (this.getLiElement(file)).classList.remove(RESTRICT_RETRY);
            }
        }
    }
    private uploadFailed(e: Event, file: FileInfo): void {
        let li: HTMLElement = this.getLiElement(file);
        let response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let statusMessage: string = this.localizedTexts('uploadFailedMessage');
        let args: Object = {
            e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '0', false), statusText: statusMessage
        };
        if (!isNullOrUndefined(li)) { this.renderFailureState(e, file, li); }
        if (this.failuredEnabled) {
            // @ts-ignore-start
            this.dotNetRef.invokeMethodAsync('FailureEvent', args).then((args: Object) => {
                // @ts-ignore-end
                this.failureEventCallback(file, args);
            });
        } else {
            this.failureEventCallback(file, args);
        }
    }
    private failureEventCallback(file: FileInfo, args: Object): void {
        // tslint:disable-next-line
        this.updateStatus(file, (args as any).statusText, '0');
        this.checkActionButtonStatus();
        this.uploadSequential();
        this.checkActionComplete(true);
    }

    private uploadSequential(): void {
        if (this.sequentialUpload) {
            if (this.autoUpload) {

                this.checkAutoUpload(this.filesData);
            } else {
                this.uploadButtonClick();
            }
        }
    }

    private checkActionComplete(increment: boolean): void {
        increment ? ++this.actionCompleteCount : --this.actionCompleteCount;
        this.raiseActionComplete();
    }

    private raiseActionComplete(): void {
        if ((this.filesData.length === this.actionCompleteCount) && this.flag) {
            this.flag = false;
            // tslint:disable-next-line
            let eventArgs: any = {
                fileData: []
            };
            eventArgs.fileData = this.getSelectedFileStatus(this.selectedFiles);
            if (this.actionCompleteEnabled) {
                this.dotNetRef.invokeMethodAsync('ActionCompleteEvent', eventArgs);
            }
        }
    }

    private getSelectedFileStatus(selectedFiles: FileInfo[]): FileInfo[] {
        let matchFiles: FileInfo[] = [];
        let matchFilesIndex: number = 0;
        for (let selectFileIndex: number = 0; selectFileIndex < selectedFiles.length; selectFileIndex++) {
            let selectedFileData: FileInfo = selectedFiles[selectFileIndex];
            for (let fileDataIndex: number = 0; fileDataIndex < this.filesData.length; fileDataIndex++) {
                if (this.filesData[fileDataIndex].name === selectedFileData.name) {
                    matchFiles[matchFilesIndex] = this.filesData[fileDataIndex];
                    ++matchFilesIndex;
                }
            }
        }
        return matchFiles;
    }

    private updateProgressBarClasses(li: HTMLElement, className: string): void {
        let progressBar: HTMLElement = <HTMLElement>li.querySelector('.' + PROGRESSBAR);
        if (!isNullOrUndefined(progressBar)) {
            progressBar.classList.add(className);
        }
    }

    private removeProgressbar(li: HTMLElement, callType: string): void {
        if (!isNullOrUndefined(li.querySelector('.' + PROGRESS_WRAPPER))) {
            this.progressAnimation = new Animation({ duration: 1250 });
            this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + PROGRESS_WRAPPER), { name: 'FadeOut' });
            this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + PROGRESSBAR_TEXT), { name: 'FadeOut' });
            setTimeout(() => { this.animateProgressBar(li, callType); }, 750);
        }
    }


    private animateProgressBar(li: Element, callType: string): void {
        if (callType === 'success') {
            li.classList.add(UPLOAD_SUCCESS);
            if (!isNullOrUndefined(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + STATUS), { name: 'FadeIn' });
                li.querySelector('.' + STATUS).classList.add(UPLOAD_SUCCESS);
            }
        } else {
            if (!isNullOrUndefined(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + STATUS), { name: 'FadeIn' });
                li.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
            }
        }
        if (li.querySelector('.' + PROGRESS_WRAPPER)) { detach(li.querySelector('.' + PROGRESS_WRAPPER)); }
    }


    private localizedTexts(localeText: string): string {
        return this.localeText[localeText] as string;
    }
    private chunkUpload(file: FileInfo, custom?: boolean, fileIndex?: number): void {
        let start: number = 0;
        let end: number = Math.min(this.asyncSettings.chunkSize, file.size);
        let index: number = 0;
        let blob: string | Blob = file.rawFile.slice(start, end);
        let metaData: MetaData = { chunkIndex: index, blob: blob, file: file, start: start, end: end, retryCount: 0, request: null };
        this.sendRequest(file, metaData, custom, fileIndex);
    }

    private sendRequest(file: FileInfo, metaData: MetaData, custom?: boolean, fileIndex?: number): void {
        let formData: FormData = new FormData();
        let cloneFile: string | Blob;
        let blob: string | Blob = file.rawFile.slice(metaData.start, metaData.end);
        formData.append('chunkFile', blob, file.name);
        formData.append(this.uploaderName, blob, file.name);
        formData.append('chunk-index', metaData.chunkIndex.toString());
        formData.append('chunkIndex', metaData.chunkIndex.toString());
        let totalChunk: number = Math.max(Math.ceil(file.size / this.asyncSettings.chunkSize), 1);
        formData.append('total-chunk', totalChunk.toString());
        formData.append('totalChunk', totalChunk.toString());
        let ajax: Ajax = new Ajax({ url: this.asyncSettings.saveUrl, type: 'POST', async: true, contentType: null });
        ajax.emitError = false;
        ajax.onLoad = (e: Event): object => { this.chunkUploadComplete(e, metaData, custom); return {}; };
        ajax.onUploadProgress = (e: Event) => {
            this.chunkUploadInProgress(e, metaData, custom);
            return {};
        };
        let eventArgs: UploadingEventArgs = {
            fileData: file,
            customFormData: [],
            cancel: false,
            chunkSize: this.asyncSettings.chunkSize === 0 ? null : this.asyncSettings.chunkSize
        };
        ajax.beforeSend = (e: BeforeSendEventArgs) => {
            eventArgs.currentRequest = ajax.httpRequest;
            eventArgs.currentChunkIndex = metaData.chunkIndex;

            if (this.currentRequestHeader) {
                this.updateCustomheader(ajax.httpRequest, this.currentRequestHeader);
            }
            if (this.customFormDatas) {
                this.updateFormData(formData, this.customFormDatas);
            }
            if (eventArgs.currentChunkIndex === 0) {
                // This event is currently not required but to avoid breaking changes for previous customer, we have included.
                if (this.uploadingEnabled) {
                    // @ts-ignore-start
                    this.dotNetRef.invokeMethodAsync('UploadingEvent', eventArgs).then((eventArgs: UploadingEventArgs) => {
                        // @ts-ignore-end
                        this.uploadingEventCallback(formData, eventArgs, e, file);
                    });
                } else {
                    this.uploadingEventCallback(formData, eventArgs, e, file);
                }
            } else {
                if (this.chunkUploadingEnabled) {
                    // @ts-ignore-start
                    this.dotNetRef.invokeMethodAsync('ChunkUploadingEvent', eventArgs).then((eventArgs: UploadingEventArgs) => {
                        // @ts-ignore-end
                        this.uploadingEventCallback(formData, eventArgs, e, file);
                    });
                } else {
                    this.uploadingEventCallback(formData, eventArgs, e, file);
                }
            }
        };

        ajax.onError = (e: Event) => { this.chunkUploadFailed(e, metaData, custom); return {}; };
        ajax.send(formData);
        metaData.request = ajax;
    }

    private uploadingEventCallback(formData: FormData, eventArgs: UploadingEventArgs, e: BeforeSendEventArgs, file: FileInfo): void {
        if (eventArgs.cancel) {
            this.eventCancelByArgs(e, eventArgs, file);
        } else {
            this.updateFormData(formData, eventArgs.customFormData);
        }
    }

    private eventCancelByArgs(e: BeforeSendEventArgs, eventArgs: UploadingEventArgs, file: FileInfo): void {
        e.cancel = true;
        if (eventArgs.fileData.statusCode === '5') { return; }
        let liElement: HTMLElement = this.getLiElement(eventArgs.fileData);
        liElement.querySelector('.' + STATUS).innerHTML = this.localizedTexts('fileUploadCancel');
        liElement.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
        eventArgs.fileData.statusCode = '5';
        eventArgs.fileData.status = this.localizedTexts('fileUploadCancel');
        this.pauseButton = createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex } });
        let removeIcon: Element = liElement.querySelector('.' + REMOVE_ICON);
        removeIcon.parentElement.insertBefore(this.pauseButton, removeIcon);
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));

        this.pauseButton.addEventListener('click', (e: Event) => { this.reloadcanceledFile(e, file, liElement); }, false);
        this.checkActionButtonStatus();
    }

    private checkChunkUpload(): boolean {
        return (this.asyncSettings.chunkSize <= 0 || isNullOrUndefined(this.asyncSettings.chunkSize)) ? false : true;
    }

    private chunkUploadComplete(e: Event, metaData: MetaData, custom?: boolean): void {
        let response: XMLHttpRequest = e.target as XMLHttpRequest;
        let liElement: HTMLElement;
        if (response.readyState === 4 && response.status >= 200 && response.status < 300) {
            let requestResponse: Object = e && e.currentTarget ? this.getResponse(e) : null;
            let totalChunk: number = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
            let eventArgs: Object = {
                event: e,
                file: metaData.file,
                chunkIndex: metaData.chunkIndex,
                totalChunk: totalChunk,
                chunkSize: this.asyncSettings.chunkSize,
                response: requestResponse
            };
            if (this.chunkSuccessEnabled) {
                this.dotNetRef.invokeMethodAsync('ChunkSuccessEvent', eventArgs);
            }
            if (isNullOrUndefined(custom) || !custom) { liElement = this.getLiElement(metaData.file); }
            this.updateMetaData(metaData);
            if (metaData.end === metaData.file.size) {
                metaData.file.statusCode = '3';
            }
            if (metaData.file.statusCode === '5') {
                let eventArgs: CancelEventArgs = { event: e, fileData: metaData.file, cancel: false };
                if (this.cancelEnabled) {
                    // @ts-ignore-start
                    this.dotNetRef.invokeMethodAsync('CancelingEvent', eventArgs).then((eventArgs: CancelEventArgs) => {
                        // @ts-ignore-end
                        this.cancelingEventCallback(metaData, liElement, response, custom, eventArgs);
                    });
                } else {
                    this.cancelingEventCallback(metaData, liElement, response, custom, eventArgs);
                }
            } else {
                if ((totalChunk - 1) === metaData.chunkIndex && totalChunk > metaData.chunkIndex) {
                    let index: number = this.pausedData.indexOf(metaData);
                    if (index >= 0) {
                        this.pausedData.splice(index, 1);
                    }
                    if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom) && liElement) {
                        if (liElement) { detach(liElement.querySelector('.' + PAUSE_UPLOAD)); }
                        this.removeChunkProgressBar(metaData);
                    }
                    this.raiseSuccessEvent(e, metaData.file);
                    return;
                }
                this.sendNextRequest(metaData);
            }
        } else {
            this.chunkUploadFailed(e, metaData);
        }
    }

    private cancelingEventCallback(
        metaData: MetaData, liElement: HTMLElement,
        response: XMLHttpRequest, custom?: boolean, eventArgs?: CancelEventArgs): void {
        if (eventArgs.cancel) {
            metaData.file.statusCode = '3';
            let spinnerTarget: HTMLElement = liElement.querySelector('.' + ABORT_ICON) as HTMLElement;
            if (!isNullOrUndefined(liElement) && !isNullOrUndefined(spinnerTarget)) {
                hideSpinner(spinnerTarget);
                detach(liElement.querySelector('.e-spinner-pane'));
            }
            this.sendNextRequest(metaData);
        } else {
            metaData.request.emitError = false;
            response.abort();
            let formData: FormData = new FormData();
            let name: string = this.element.getAttribute('name');
            formData.append(name, metaData.file.name);
            formData.append('cancel-uploading', metaData.file.name);
            formData.append('cancelUploading', metaData.file.name);
            let ajax: Ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
            ajax.emitError = false;
            ajax.onLoad = (e: Event): object => { this.removeChunkFile(e, metaData, custom); return {}; };
            ajax.send(formData);
        }
    }

    private sendNextRequest(metaData: MetaData): void {
        metaData.start = metaData.end;
        metaData.end += this.asyncSettings.chunkSize;
        metaData.end = Math.min(metaData.end, metaData.file.size);
        metaData.chunkIndex += 1;
        this.sendRequest(metaData.file, metaData);
    }

    private removeChunkFile(e: Event, metaData: MetaData, custom: boolean): void {
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) && !custom)) {
            let liElement: HTMLElement = this.getLiElement(metaData.file);
            let deleteIcon: Element = liElement.querySelector('.' + ABORT_ICON);
            let spinnerTarget: HTMLElement = deleteIcon as HTMLElement;
            this.updateStatus(metaData.file, this.localizedTexts('fileUploadCancel'), '5');
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
            this.removeProgressbar(liElement, 'failure');
            deleteIcon.classList.remove(ABORT_ICON);
            deleteIcon.classList.add(REMOVE_ICON);
            deleteIcon.setAttribute('title', this.localizedTexts('remove'));
            let pauseIcon: Element = liElement.querySelector('.' + PAUSE_UPLOAD);
            pauseIcon.classList.add(RETRY_ICON);
            pauseIcon.classList.remove(PAUSE_UPLOAD);
            pauseIcon.setAttribute('title', this.localizedTexts('retry'));
            if (!isNullOrUndefined(liElement) && !isNullOrUndefined(deleteIcon)) {
                hideSpinner(spinnerTarget);
                detach(liElement.querySelector('.e-spinner-pane'));
            }
        }
    }

    private pauseUpload(metaData: MetaData, e?: Event, custom?: boolean): void {
        metaData.file.statusCode = '4';
        metaData.file.status = this.localizedTexts('pause');
        this.updateMetaData(metaData);
        let eventArgs: PauseResumeEventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.abortUpload(metaData, custom, eventArgs);
    }

    private abortUpload(metaData: MetaData, custom: boolean, eventArgs?: PauseResumeEventArgs): void {
        metaData.request.emitError = false;
        metaData.request.httpRequest.abort();
        let liElement: HTMLElement = this.getLiElement(metaData.file);
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom)) {
            let targetElement: HTMLElement = liElement.querySelector('.' + PAUSE_UPLOAD) as HTMLElement;
            targetElement.classList.remove(PAUSE_UPLOAD);
            targetElement.classList.add(RESUME_UPLOAD);
            targetElement.setAttribute('title', this.localizedTexts('resume'));
            targetElement.nextElementSibling.classList.add(REMOVE_ICON);
            targetElement.nextElementSibling.classList.remove(ABORT_ICON);
            targetElement.nextElementSibling.setAttribute('title', this.localizedTexts('remove'));
        }
        for (let i: number = 0; i < this.pausedData.length; i++) {
            if (this.pausedData[i].file.name === metaData.file.name) {
                this.pausedData.splice(i, 1);
            }
        }
        this.pausedData.push(metaData);
        if (this.pausedEnabled) {
            this.dotNetRef.invokeMethodAsync('PausingEvent', eventArgs);
        }
    }
    private resumeUpload(metaData: MetaData, e?: Event, custom?: boolean): void {
        let liElement: HTMLElement = this.getLiElement(metaData.file);
        let targetElement: Element;
        if (!isNullOrUndefined(liElement)) {
            targetElement = liElement.querySelector('.' + RESUME_UPLOAD);
        }
        if (!isNullOrUndefined(targetElement) && (isNullOrUndefined(custom) || !custom)) {
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
        let eventArgs: PauseResumeEventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        if (this.resumeEnabled) {
            this.dotNetRef.invokeMethodAsync('ResumingEvent', eventArgs);
        }
        for (let i: number = 0; i < this.pausedData.length; i++) {
            if (this.pausedData[i].end === this.pausedData[i].file.size) {
                this.chunkUploadComplete(e, metaData, custom);
            } else {
                if (this.pausedData[i].file.name === metaData.file.name) {
                    this.pausedData[i].start = this.pausedData[i].end;
                    this.pausedData[i].end = this.pausedData[i].end + this.asyncSettings.chunkSize;
                    this.pausedData[i].end = Math.min(this.pausedData[i].end, this.pausedData[i].file.size);
                    this.pausedData[i].chunkIndex = this.pausedData[i].chunkIndex + 1;
                    this.sendRequest(this.pausedData[i].file, this.pausedData[i], custom);
                }
            }
        }
    }

    private updateMetaData(metaData: MetaData): void {
        if (this.uploadMetaData.indexOf(metaData) === -1) {
            this.uploadMetaData.push(metaData);
        } else {
            this.uploadMetaData.splice(this.uploadMetaData.indexOf(metaData), 1);
            this.uploadMetaData.push(metaData);
        }
    }

    private removeChunkProgressBar(metaData: MetaData): void {
        let liElement: HTMLElement = this.getLiElement(metaData.file);
        if (!isNullOrUndefined(liElement)) {
            this.updateProgressBarClasses(liElement, UPLOAD_SUCCESS);
            this.removeProgressbar(liElement, 'success');
            let cancelButton: Element = liElement.querySelector('.' + ABORT_ICON);
            if (!isNullOrUndefined(cancelButton)) {
                cancelButton.classList.add(DELETE_ICON);
                cancelButton.setAttribute('title', this.localizedTexts('delete'));
                cancelButton.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
            }
        }
    }

    private chunkUploadFailed(e: Event, metaData: MetaData, custom?: boolean): void {
        let chunkCount: number = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
        let liElement: HTMLElement;
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom)) {
            liElement = this.getLiElement(metaData.file);
        }
        let requestResponse: Object = e && e.currentTarget ? this.getResponse(e) : null;
        let eventArgs: Object = {
            event: e,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            totalChunk: chunkCount,
            chunkSize: this.asyncSettings.chunkSize,
            cancel: false,
            response: requestResponse
        };
        if (this.chunkFailuredEnabled) {
            // @ts-ignore-start
            this.dotNetRef.invokeMethodAsync('ChunkFailureEvent', eventArgs).then((eventArgs: Object) => {
                // @ts-ignore-end
                this.chunkFailureCallback(e, metaData, liElement, requestResponse, custom, eventArgs);
            });
        } else {
            this.chunkFailureCallback(e, metaData, liElement, requestResponse, custom, eventArgs);
        }
    }

    private chunkFailureCallback(
        e: Event, metaData: MetaData, liElement: HTMLElement,
        requestResponse: Object, custom?: boolean, eventArgs?: Object): void {
        // To prevent triggering of failure event
        // tslint:disable-next-line
        if (!(<any>eventArgs).cancel) {
            if (metaData.retryCount < this.asyncSettings.retryCount) {
                setTimeout(() => { this.retryRequest(liElement, metaData, custom); }, this.asyncSettings.retryAfterDelay);
            } else {
                if (!isNullOrUndefined(liElement)) {
                    let pauseButton: Element = liElement.querySelector('.' + PAUSE_UPLOAD) ?
                        liElement.querySelector('.' + PAUSE_UPLOAD) : liElement.querySelector('.' + RESUME_UPLOAD);
                    if (!isNullOrUndefined(pauseButton)) {
                        pauseButton.classList.add(RETRY_ICON);
                        pauseButton.classList.remove(PAUSE_UPLOAD, RESUME_UPLOAD);
                    }
                    this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
                    this.removeProgressbar(liElement, 'failure');
                    liElement.querySelector('.e-icons').classList.remove(UPLOAD_INPROGRESS);
                    let iconElement: Element = liElement.querySelector('.' + ABORT_ICON) ?
                        liElement.querySelector('.' + ABORT_ICON) : liElement.querySelector('.' + REMOVE_ICON);
                    iconElement.classList.remove(ABORT_ICON);
                    if (!isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD))) {
                        detach(liElement.querySelector('.' + PAUSE_UPLOAD));
                    }
                    if (metaData.start > 0) {
                        iconElement.classList.add(DELETE_ICON);
                        iconElement.setAttribute('title', this.localizedTexts('delete'));
                    } else {
                        iconElement.classList.add(REMOVE_ICON);
                        iconElement.setAttribute('title', this.localizedTexts('remove'));
                    }
                }
                metaData.retryCount = 0;
                let file: FileInfo = metaData.file;
                let failureMessage: string = this.localizedTexts('uploadFailedMessage');
                let args: Object = {
                    e, response: requestResponse,
                    operation: 'upload',
                    file: this.updateStatus(file, failureMessage, '0', false),
                    statusText: failureMessage
                };
                if (this.failuredEnabled) {
                    // @ts-ignore-start
                    this.dotNetRef.invokeMethodAsync('FailureEvent', args).then((args: Object) => {
                        // @ts-ignore-end
                        this.failureCallback(file, args);
                    });
                } else {
                    this.failureCallback(file, args);
                }
            }
        }
    }
    private failureCallback(file: FileInfo, args: Object): void {
        // tslint:disable-next-line
        this.updateStatus(file, (args as any).statusText, '0');
        this.uploadSequential();
        this.checkActionComplete(true);
    }
    private retryRequest(liElement: HTMLElement, metaData: MetaData, custom?: boolean): void {
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom) && liElement) {
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        }
        metaData.retryCount += 1;
        this.sendRequest(metaData.file, metaData);
    }

    private checkPausePlayAction(e: Event): void {
        let targetElement: HTMLElement = e.target as HTMLElement;
        let selectedElement: HTMLElement = (<HTMLInputElement>e.target).parentElement;
        let index: number = this.fileList.indexOf(selectedElement);
        let fileData: FileInfo = this.filesData[index];
        let metaData: MetaData = this.getCurrentMetaData(fileData);
        if (targetElement.classList.contains(PAUSE_UPLOAD)) {

            this.pauseUpload(metaData, e);
        } else if (targetElement.classList.contains(RESUME_UPLOAD)) {

            this.resumeUpload(metaData, e);
        } else if (targetElement.classList.contains(RETRY_ICON)) {
            if (metaData.file.status === this.localizedTexts('fileUploadCancel')) {
                this.retryUpload(metaData, false);
            } else {
                this.retryUpload(metaData, true);
            }
        }
    }

    private retryUpload(metaData: MetaData, fromcanceledStage: boolean): void {
        if (fromcanceledStage) {
            metaData.end = metaData.end + this.asyncSettings.chunkSize;
            metaData.start = metaData.start + this.asyncSettings.chunkSize;
            this.sendRequest(metaData.file, metaData);
        } else {
            metaData.file.statusCode = '1';
            metaData.file.status = this.localizedTexts('readyToUploadMessage');
            this.chunkUpload(metaData.file);
        }

        (this.getLiElement(metaData.file)).classList.add(RESTRICT_RETRY);
    }

    private chunkUploadInProgress(e: ProgressEventInit, metaData: MetaData, custom?: boolean): void {
        if (metaData.file.statusCode === '4') { return; }
        if (metaData.file.statusCode !== '4' && metaData.file.statusCode !== '5') {
            metaData.file.statusCode = '3';
            metaData.file.status = this.localizedTexts('inProgress');
        }
        this.updateMetaData(metaData);
        let liElement: HTMLElement = this.getLiElement(metaData.file);
        if (isNullOrUndefined(liElement)) { return; }
        let target: Element;
        let retryElement: Element = liElement.querySelector('.' + RETRY_ICON);
        if (!isNullOrUndefined(retryElement)) {
            retryElement.classList.add(PAUSE_UPLOAD);
            retryElement.setAttribute('title', this.localizedTexts('pause'));
            retryElement.classList.remove(RETRY_ICON);
        }
        if (!isNullOrUndefined(liElement)) {
            if (!(liElement.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0)) {
                let statusElement: Element = liElement.querySelector('.' + STATUS);
                if (isNullOrUndefined(this.template)) {
                    statusElement.classList.add(UPLOAD_INPROGRESS);
                    statusElement.classList.remove(UPLOAD_FAILED);
                    this.createProgressBar(liElement);
                    this.updateProgressBarClasses(liElement, UPLOAD_INPROGRESS);
                }
                let clearIcon: Element = liElement.querySelector('.' + REMOVE_ICON) ? liElement.querySelector('.' + REMOVE_ICON) :
                    liElement.querySelector('.' + DELETE_ICON);
                if (!isNullOrUndefined(clearIcon)) {
                    clearIcon.classList.add(ABORT_ICON);
                    clearIcon.setAttribute('title', this.localizedTexts('abort'));
                    clearIcon.classList.remove(REMOVE_ICON);
                }
            }
            if (!isNaN(Math.round((e.loaded / e.total) * 100)) && isNullOrUndefined(this.template) && metaData.file.statusCode !== '4') {
                let loadedSize: number = (metaData.chunkIndex * this.asyncSettings.chunkSize);
                let currentLoaded: number = e.loaded;
                if (currentLoaded > this.asyncSettings.chunkSize) {
                    currentLoaded = this.asyncSettings.chunkSize;
                }
                let value: number = Math.min((((loadedSize + currentLoaded) / metaData.file.size) * 100), 100);
                this.changeProgressValue(liElement, Math.round(value).toString() + '%');
            }
            if (metaData.chunkIndex === 0) {
                this.checkActionButtonStatus();
            }
        }
        if (isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD)) && isNullOrUndefined(this.template)) {
            this.pauseButton = createElement('span', { className: 'e-icons e-file-pause-btn', attrs: { 'tabindex': this.btnTabIndex } });
            if (this.browserName === 'msie') { this.pauseButton.classList.add('e-msie'); }
            let abortIcon: Element = liElement.querySelector('.' + ABORT_ICON);
            abortIcon.parentElement.insertBefore(this.pauseButton, abortIcon);
            this.pauseButton.setAttribute('title', this.localizedTexts('pause'));
            this.pauseButton.addEventListener('click', (e: Event) => { this.checkPausePlayAction(e); }, false);
        }
    }

    /**
     * It is used to convert bytes value into kilobytes or megabytes depending on the size based
     * on [binary prefix](https://en.wikipedia.org/wiki/Binary_prefix).
     * @param { number } bytes - specifies the file size in bytes.
     * @returns string
     */
    public bytesToSize(bytes: number): string {
        let i: number = -1;
        let size: number;
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
    }

    /**
     * Allows you to sort the file data alphabetically based on its file name clearly.
     * @param { FileList } filesData - specifies the files data for upload.
     * @returns File[]
     */

    public sortFileList(filesData?: FileList): File[] {
        filesData = filesData ? filesData : this.sortFilesList;
        let files: FileList = filesData;
        let fileNames: string[] = [];
        for (let i: number = 0; i < files.length; i++) {
            fileNames.push(files[i].name);
        }
        let sortedFileNames: string[] = fileNames.sort();
        let sortedFilesData: File[] = [];
        let index: number = 0;
        for (let name of sortedFileNames) {
            for (let i: number = 0; i < files.length; i++) {
                if (name === files[i].name) {
                    sortedFilesData.push(files[i]);
                }
            }
        }
        return sortedFilesData;
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    public destroy(): void {
        (this.element as HTMLInputElement).value = null;
        if (!(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            this.clearAll();
        }
        this.unWireEvents();
        this.unBindDropEvents();
        this.element.removeAttribute('accept');
        this.setInitialAttributes();
        let attributes: string[] = ['aria-label', 'directory', 'webkitdirectory', 'tabindex'];
        for (let key of attributes) {
            this.element.removeAttribute(key);
        }
    }

    /**
     * Allows you to call the upload process manually by calling save URL action.
     * To process the selected files (added in upload queue), pass an empty argument otherwise
     * upload the specific file based on its argument. 
     * @param { FileInfo | FileInfo[] } files - specifies the files data for upload.
     * @returns void
     */
    public upload(files?: FileInfo | FileInfo[], custom?: boolean): void {
        files = files ? files : this.filesData;
        if (this.sequentialUpload && (this.isFirstFileOnSelection || custom)) {
            this.sequenceUpload(files as FileInfo[]);
        } else {
            let uploadFiles: FileInfo[] = this.getFilesInArray(files);
            let eventArgs: BeforeUploadEventArgs = {
                customFormData: [],
                currentRequest: null,
                cancel: false,
                filesData: uploadFiles
            };
            if (this.beforeUploadEnabled) {
                // @ts-ignore-start
                this.dotNetRef.invokeMethodAsync('BeforeUploadEvent', eventArgs).then((eventArgs: BeforeUploadEventArgs) => {
                    // @ts-ignore-end
                    this.beforeUploadCallback(uploadFiles, custom, eventArgs);
                });
            } else {
                this.beforeUploadCallback(uploadFiles, custom, eventArgs);
            }
        }
    }
    private beforeUploadCallback(uploadFiles: FileInfo[], custom?: boolean, eventArgs?: BeforeUploadEventArgs): void {
        if (!eventArgs.cancel) {
            this.currentRequestHeader = eventArgs.currentRequest ? eventArgs.currentRequest : this.currentRequestHeader;
            this.customFormDatas = (eventArgs.customFormData && eventArgs.customFormData.length > 0) ?
                eventArgs.customFormData : this.customFormDatas;
            this.uploadFiles(uploadFiles, custom);
        }
    }
    private getFilesInArray(files: FileInfo | FileInfo[]): FileInfo[] {
        let uploadFiles: FileInfo[] = [];
        if (files instanceof Array) {
            uploadFiles = this.getFileListData(files as FileInfo[]);
        } else {
            uploadFiles.push(files);
        }
        return uploadFiles;
    }
    private getFileListData(files: FileInfo[]): FileInfo[] {
        let uploadFiles: FileInfo[] = [];
        if (!isNullOrUndefined(this.filesData) && !isNullOrUndefined(files)) {
            for (let i: number = 0; i < files.length; i++) {
                uploadFiles.push(this.filesData.filter((e: FileInfo) => e.name === files[i].name)[0]);
            }
        }
        return !isNullOrUndefined(uploadFiles) ? uploadFiles : [];
    }
    public serverReadFileBase64(fileIndex: number, position: number, totalCount: number): Promise<string> {
        return new Promise((resolve: Function, reject: Function) => {
            let file: Blob = this.fileStreams[fileIndex].rawFile as Blob;
            try {
                let reader: FileReader = new FileReader();
                // tslint:disable-next-line
                reader.onload = ((args: any) => {
                    return () => {
                        try {
                            let contents: string = args.result as string;
                            let data: string = contents ? contents.split(';base64,')[1] : null;
                            resolve(data);
                        } catch (e) {
                            reject(e);
                        }
                    };
                })(reader);
                reader.readAsDataURL(file.slice(position, position + totalCount));
            } catch (e) {
                reject(e);
            }
        });
    }


    public uploadFileCount(ele: Element): number {
        let files: FileInfo[] = this.filesData;
        if (!files || files.length === 0) {
            return -1;
        }
        let result: number = files.length;
        return result;
    }


    public getFileRead(index: number, ele: Element): number {
        let files: FileInfo[] = this.filesData;
        if (!files || files.length === 0) {
            return -1;
        }
        let file: FileInfo = files[index];
        let fileCount: number = this.newFileRef++;
        this.fileStreams[fileCount] = file;
        return fileCount;
    }


    public getFileInfo(index: number, ele: Element): FileInfo {
        let files: FileInfo[] = this.filesData;
        if (!files || files.length === 0) {
            return null;
        }
        let file: FileInfo = files[index];
        if (!file) {
            return null;
        }
        return this.filesData[index];
    }

    private uploadFiles(files: FileInfo[], custom?: boolean): void {
        let selectedFiles: FileInfo[] = [];
        if (this.asyncSettings.saveUrl === '' || isNullOrUndefined(this.asyncSettings.saveUrl)) {
            // tslint:disable-next-line
            this.dotNetRef.invokeMethodAsync('GetFileDetails', files);
            return;
        }
        if (!custom || isNullOrUndefined(custom)) {
            if (!this.multiple) {
                let file: FileInfo[] = [];
                file.push(files[0]);
                selectedFiles = this.filterfileList(file);
            } else {
                selectedFiles = this.filterfileList(files);
            }
        } else {
            selectedFiles = files;
        }
        for (let i: number = 0; i < selectedFiles.length; i++) {
            if (!this.checkChunkUpload()) {

                /* tslint:disable */
                if (selectedFiles[i] && selectedFiles[i].rawFile instanceof File) {
                    this.getBase64(selectedFiles[i].rawFile as File).then((data: any) => {
                        this.base64String.push(data);
                        this.uploadFilesRequest(selectedFiles, i, custom);
                    });
                }
                /* tslint:disable */
            } else {
                this.uploadFilesRequest(selectedFiles, i, custom);
            }
        }
    }

    private uploadFilesRequest(selectedFiles: FileInfo[], i: number, custom?: boolean): void {
        let cloneFiles: Blob[] = [];
        let chunkEnabled: boolean = this.checkChunkUpload();
        let ajax: Ajax = new Ajax(this.asyncSettings.saveUrl, 'POST', true, null);
        ajax.emitError = false;
        let getFileData: FileInfo[];

        getFileData = selectedFiles.slice(0);
        cloneFiles.push(getFileData[i].rawFile as Blob);
        let eventArgs: UploadingEventArgs = {
            fileData: getFileData[i],
            customFormData: [],
            cancel: false
        };
        let formData: FormData = new FormData();
        ajax.beforeSend = (e: BeforeSendEventArgs) => {
            eventArgs.currentRequest = ajax.httpRequest;

            eventArgs.fileData.rawFile = !chunkEnabled ? this.base64String[i] : eventArgs.fileData.rawFile;
            if (this.currentRequestHeader) {
                this.updateCustomheader(ajax.httpRequest, this.currentRequestHeader);
            }
            if (this.customFormDatas) {
                this.updateFormData(formData, this.customFormDatas);
            }
            if (this.uploadingEnabled) {
                // @ts-ignore-start
                this.dotNetRef.invokeMethodAsync('UploadingEvent', eventArgs).then((args: UploadingEventArgs) => {
                    // @ts-ignore-end

                    eventArgs = args;
                    this.uploadCallback(e, chunkEnabled, selectedFiles, formData, i, cloneFiles, args)
                });
            } else {
                this.uploadCallback(e, chunkEnabled, selectedFiles, formData, i, cloneFiles, eventArgs)
            }
        };
        if (selectedFiles[i].statusCode === '1') {
            let name: string = this.element.getAttribute('name');
            formData.append(name, selectedFiles[i].rawFile, selectedFiles[i].name);
            if (chunkEnabled && selectedFiles[i].size > this.asyncSettings.chunkSize) {
                this.chunkUpload(selectedFiles[i], custom, i);
            } else {
                ajax.onLoad = (e: Event): object => {
                    if (eventArgs.cancel) {
                        return {};
                    } else {
                        this.uploadComplete(e, selectedFiles[i], custom);
                        return {};
                    }
                };
                ajax.onUploadProgress = (e: Event): object => {
                    if (eventArgs.cancel) {
                        return {};
                    } else {
                        this.uploadInProgress(e, selectedFiles[i], custom, ajax);
                        return {};
                    }
                };

                ajax.onError = (e: Event) => { this.uploadFailed(e, selectedFiles[i]); return {}; };
                ajax.send(formData);
            }
        }
    }

    private uploadCallback(e: BeforeSendEventArgs, chunkEnabled: boolean, selectedFiles: FileInfo[], formData: FormData, i: number, cloneFiles: Blob[], args: any): void {
        if (!chunkEnabled) { selectedFiles[i].rawFile = args.fileData.rawFile = cloneFiles[i]; }
        if (args.cancel) {
            this.eventCancelByArgs(e, args, selectedFiles[i]);
        }
        this.updateFormData(formData, args.customFormData);
    }
    private spliceFiles(liIndex: number): void {
        let liElement: HTMLElement = this.fileList[liIndex];
        let allFiles: FileInfo[] = this.getFilesData();
        let nameElements: number = +liElement.getAttribute('data-files-count');
        let startIndex: number = 0;
        for (let i: number = 0; i < liIndex; i++) {
            startIndex += (+this.fileList[i].getAttribute('data-files-count'));
        }
        let endIndex: number = (startIndex + nameElements) - 1;
        for (let j: number = endIndex; j >= startIndex; j--) {
            allFiles.splice(j, 1);
        }
    }

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
    public remove(
        fileData?: FileInfo | FileInfo[], customTemplate?: boolean, removeDirectly?: boolean,
        postRawFile?: boolean, args?: MouseEvent | TouchEvent | KeyboardEventArgs): void {
        if (isNullOrUndefined(postRawFile)) {
            postRawFile = true;
        }
        let removeFiles: FileInfo[] = this.getFilesInArray(fileData);
        let beforeEventArgs: BeforeRemoveEventArgs = {
            cancel: false,
            customFormData: [],
            currentRequest: null,
            filesData: removeFiles
        };
        if (this.beforeRemoveEnabled) {
            // @ts-ignore-start
            this.dotNetRef.invokeMethodAsync('BeforeRemoveEvent', beforeEventArgs).then((beforeEventArgs: BeforeRemoveEventArgs) => {
                // @ts-ignore-end
                this.beforeRemoveCallback(fileData, customTemplate, removeDirectly, postRawFile, args, beforeEventArgs);
            });
        } else {
            this.beforeRemoveCallback(fileData, customTemplate, removeDirectly, postRawFile, args, beforeEventArgs);
        }
    }
    private beforeRemoveCallback(
        fileData?: FileInfo | FileInfo[], customTemplate?: boolean, removeDirectly?: boolean,
        postRawFile?: boolean, args?: MouseEvent | TouchEvent | KeyboardEventArgs, beforeEventArgs?: BeforeRemoveEventArgs): void {
        let eventArgs: RemovingEventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            customFormData: [],
            postRawFile: postRawFile,
            currentRequest: null
        };
        if (!beforeEventArgs.cancel) {
            this.currentRequestHeader = beforeEventArgs.currentRequest;
            this.customFormDatas = beforeEventArgs.customFormData;
            let index: number;
            if (this.isFormUpload() && !this.isBlazorSaveUrl) {
                eventArgs.filesData = fileData as FileInfo[];
                // @ts-ignore-start
                this.dotNetRef.invokeMethodAsync('RemovingEvent', eventArgs).then((eventArgs: RemovingEventArgs) => {
                    // @ts-ignore-end
                    this.removeCallback(fileData, eventArgs);
                });
            } else if (this.isForm && (isNullOrUndefined(this.asyncSettings.removeUrl) || this.asyncSettings.removeUrl === '')
                && !this.isBlazorSaveUrl) {
                eventArgs.filesData = this.getFilesData();
                if (this.removingEnabled) {
                    // @ts-ignore-start
                    this.dotNetRef.invokeMethodAsync('RemovingEvent', eventArgs).then((eventArgs: RemovingEventArgs) => {
                        // @ts-ignore-end
                        if (!eventArgs.cancel) {
                            this.clearAll();
                        }
                    });
                } else {
                    this.clearAll();
                }
            } else {
                let removeFiles: FileInfo[] = [];
                fileData = !isNullOrUndefined(fileData) ? fileData : this.filesData;
                if (fileData instanceof Array) {
                    removeFiles = fileData;
                } else {
                    removeFiles.push(fileData);
                }
                eventArgs.filesData = removeFiles;
                let removeUrl: string = this.asyncSettings.removeUrl;
                let validUrl: boolean = (removeUrl === '' || isNullOrUndefined(removeUrl)) ? false : true;
                for (let files of removeFiles) {
                    index = this.filesData.indexOf(files);
                    let fileUploadedIndex: number = this.uploadedFilesData.indexOf(files)
                    if ((files.statusCode === '2' || files.statusCode === '4' || (files.statusCode === '0' &&
                        fileUploadedIndex !== -1)) && validUrl) {
                        this.removeUploadedFile(files, eventArgs, removeDirectly, customTemplate);
                    } else {
                        if (!removeDirectly && this.removingEnabled) {
                            // @ts-ignore-start
                            this.dotNetRef.invokeMethodAsync('RemovingEvent', eventArgs).then((eventArgs: RemovingEventArgs) => {
                                // @ts-ignore-end
                                if (!eventArgs.cancel) {
                                    this.removeFilesData(files, customTemplate);
                                }
                            });
                        } else {
                            this.removeFilesData(files, customTemplate);
                        }
                    }
                    if (args && !(args.target as Element).classList.contains(REMOVE_ICON)) {
                        this.checkActionComplete(false);
                    }
                }
            }
        }
    }
    private removeCallback(fileData: FileInfo[], eventArgs: RemovingEventArgs): void {
        if (!eventArgs.cancel) {
            let removingFiles: FileInfo[] = this.getFilesInArray(fileData);
            let isLiRemoved: boolean = false;
            let liIndex: number;
            for (let data of removingFiles) {
                if (!isLiRemoved) {
                    liIndex = this.fileList.indexOf(data.list);
                }
                if (liIndex > -1) {
                    let inputElement: HTMLElement = !isNullOrUndefined(data.input) ? data.input : null;
                    if (inputElement) {
                        detach(inputElement);
                    }
                    this.spliceFiles(liIndex);
                    detach(this.fileList[liIndex]);
                    this.fileList.splice(liIndex, 1);
                    isLiRemoved = true;
                    liIndex = -1;
                }
            }
        }
    }

    /**
     * Clear all the file entries from list that can be uploaded files or added in upload queue.
     * @returns void
     */
    public clearAll(): void {
        if (isNullOrUndefined(this.listParent) && !(this.isBlazorSaveUrl || this.isBlazorTemplate)) {
            if (this.browserName !== 'msie') { (this.element as HTMLInputElement).value = ''; }
            this.filesData = [];
            return;
        }
        let eventArgs: ClearingEventArgs = {
            cancel: false,
            filesData: this.filesData
        };
        if (this.clearEnabled) {
            // @ts-ignore-start
            this.dotNetRef.invokeMethodAsync('ClearingEvent', eventArgs).then((eventArgs: ClearingEventArgs) => {
                // @ts-ignore-end
                if (!eventArgs.cancel) {
                    this.clearData();
                    this.actionCompleteCount = 0;
                    this.count = -1;
                }
            });
        } else {
            this.clearData();
            this.actionCompleteCount = 0;
            this.count = -1;
        }
    }

    /**
     * Get the data of files which are shown in file list.
     * @param { number } index - specifies the file list item(li) index.
     * @returns FileInfo[]
     */
    public getFilesData(index?: number): FileInfo[] {
        if (isNullOrUndefined(index)) {
            for (let i: number = 0; i < this.filesData.length; i++) {
                this.filesData[i].rawFile = this.base64String[i];
            }
            return this.filesData;
        } else {
            return this.getSelectedFiles(index);
        }
    }

    /**
     * Pauses the in-progress chunked upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to pause from uploading.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    public pause(fileData?: FileInfo | FileInfo[], custom?: boolean): void {
        fileData = fileData ? fileData : this.filesData;
        let fileDataFiles: FileInfo[] = this.getFilesInArray(fileData);
        this.pauseUploading(fileDataFiles, custom);
    }
    private pauseUploading(fileData: FileInfo[], custom?: boolean): void {
        let files: FileInfo[] = this.getFiles(fileData);
        for (let i: number = 0; i < files.length; i++) {
            if (files[i].statusCode === '3') {
                this.pauseUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    }

    private getFiles(fileData: FileInfo[]): FileInfo[] {
        let files: FileInfo[] = [];
        if (!isNullOrUndefined(fileData) && !(fileData instanceof Array)) {
            files.push(fileData);
        } else {
            files = fileData;
        }
        return files;
    }

    /**
     * Resumes the chunked upload that is previously paused based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to resume the paused file.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    public resume(fileData?: FileInfo | FileInfo[], custom?: boolean): void {
        fileData = fileData ? fileData : this.filesData;
        let fileDataFiles: FileInfo[] = this.getFilesInArray(fileData);
        this.resumeFiles(fileDataFiles, custom);
    }

    private resumeFiles(fileData: FileInfo[], custom?: boolean): void {
        let files: FileInfo[] = this.getFiles(fileData);
        for (let i: number = 0; i < files.length; i++) {
            if (files[i].statusCode === '4') {
                this.resumeUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    }

    /**
     * Retries the canceled or failed file upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to retry the canceled or failed file.
     * @param { boolean } fromcanceledStage - Set true to retry from canceled stage and set false to retry from initial stage.
     * @returns void
     */
    public retry(fileData?: FileInfo | FileInfo[], fromcanceledStage?: boolean, custom?: boolean): void {
        fileData = fileData ? fileData : this.filesData;
        let fileDataFiles: FileInfo[] = this.getFilesInArray(fileData);
        this.retryFailedFiles(fileDataFiles, fromcanceledStage, custom);
    }

    private retryFailedFiles(fileData: FileInfo[], fromcanceledStage: boolean, custom: boolean): void {
        let files: FileInfo[] = this.getFiles(fileData);
        for (let i: number = 0; i < files.length; i++) {
            if (files[i].statusCode === '5' || files[i].statusCode === '0') {
                if (this.asyncSettings.chunkSize > 0) {
                    this.retryUpload(this.getCurrentMetaData(files[i], null), fromcanceledStage);
                } else {
                    let liElement: HTMLElement;
                    if (!custom) {
                        liElement = this.fileList[this.filesData.indexOf(files[i])];
                    }
                    this.reloadcanceledFile(null, files[i], liElement, custom);
                }
            }
        }
    }

    /**
     * Stops the in-progress chunked upload based on the file data.
     * When the file upload is canceled, the partially uploaded file is removed from server.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to cancel the progressing file.
     * @returns void
     */
    public cancel(fileData?: FileInfo[]): void {
        fileData = fileData ? fileData : this.filesData;
        let cancelingFiles: FileInfo[] = this.getFilesInArray(fileData);
        this.cancelUpload(cancelingFiles);
    }

    private cancelUpload(fileData: FileInfo[]): void {
        let files: FileInfo[] = this.getFiles(fileData);
        if (this.asyncSettings.chunkSize > 0) {
            for (let i: number = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    let metaData: MetaData = this.getCurrentMetaData(files[i], null);
                    metaData.file.statusCode = '5';
                    metaData.file.status = this.localizedTexts('fileUploadCancel');
                    this.updateMetaData(metaData);
                    this.showHideUploadSpinner(files[i]);
                }
            }
        } else {
            for (let i: number = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    files[i].statusCode = '5';
                    files[i].status = this.localizedTexts('fileUploadCancel');
                    this.showHideUploadSpinner(files[i]);
                }
            }
        }
    }

    private showHideUploadSpinner(files: FileInfo): void {
        let liElement: HTMLElement = this.getLiElement(files);
        if (!isNullOrUndefined(liElement) && isNullOrUndefined(this.template)) {
            let spinnerTarget: HTMLElement = liElement.querySelector('.' + ABORT_ICON) as HTMLElement;
            createSpinner({ target: spinnerTarget, width: '20px' });
            showSpinner(spinnerTarget);
        }
    }
}
// tslint:disable
let Uploader: object = {
    initialize(element: BlazorUploaderElement, dotnetRef: BlazorDotnetObject, options: { [key: string]: Object }): void {
        if (element) { new SfUploader(element, dotnetRef, options); }
        if (element && element.blazor__instance) {
            element.blazor__instance.initialize();
        }
    },
    uploadFileCount(element: BlazorUploaderElement): number {
        if (element && element.blazor__instance) {
            return element.blazor__instance.uploadFileCount(element);
        }
        return 0;
    },
    getFileRead(element: BlazorUploaderElement, index: number): number {
        if (element && element.blazor__instance) {
            return element.blazor__instance.getFileRead(index, element);
        }
        return 0;
    },
    getFileInfo(element: BlazorUploaderElement, index: number): FileInfo {
        if (element && element.blazor__instance) {
            return element.blazor__instance.getFileInfo(index, element);
        }
        return null;
    },
    serverReadFileBase64(element: BlazorUploaderElement, fileIndex: number, position: number, totalCount: number): Promise<string> {
        if (element && element.blazor__instance) {
            return element.blazor__instance.serverReadFileBase64(fileIndex, position, totalCount);
        }
        return null;
    },
    raiseSuccessEvent(element: BlazorUploaderElement, file: FileInfo): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.raiseSuccessEvent(null, file);
        }
    },
    serverRemoveIconBindEvent(element: BlazorUploaderElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.serverRemoveIconBindEvent();
        }
    },
    serverFileListElement(element: BlazorUploaderElement, ulElement: HTMLElement, btnElement: HTMLElement, autoUpload: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.serverUlElement(ulElement);
            if (!autoUpload) {
                element.blazor__instance.serverActionButtonsEventBind(btnElement);
            }
        }
    },
    bytesToSize(element: BlazorUploaderElement, bytes: number): string {
        if (element && element.blazor__instance) {
            return element.blazor__instance.bytesToSize(bytes);
        }
        return '';
    },
    cancel(element: BlazorUploaderElement, fileData: FileInfo[]): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.cancel(fileData);
        }
    },
    clearAll(element: BlazorUploaderElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.clearAll();
        }
    },
    createFileList(element: BlazorUploaderElement, fileData: FileInfo[], isSelectedFile?: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.createFileList(fileData, isSelectedFile);
        }
    },
    getFilesData(element: BlazorUploaderElement, index: number): FileInfo[] {
        if (element && element.blazor__instance) {
            return element.blazor__instance.getFilesData(index);
        }
        return null;
    },
    pause(element: BlazorUploaderElement, fileData: FileInfo[], custom?: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.pause(fileData, custom);
        }
    },
    remove(element: BlazorUploaderElement, fileData?: FileInfo | FileInfo[], customTemplate?: boolean, removeDirectly?: boolean,
        postRawFile?: boolean, args?: MouseEvent | TouchEvent | KeyboardEventArgs): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.remove(fileData, customTemplate, removeDirectly, postRawFile, args);
        }
    },
    resume(element: BlazorUploaderElement, fileData?: FileInfo | FileInfo[], custom?: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.resume(fileData, custom);
        }
    },
    retry(element: BlazorUploaderElement, fileData?: FileInfo | FileInfo[], fromcanceledStage?: boolean, custom?: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.retry(fileData, fromcanceledStage, custom);
        }
    },
    sortFileList(element: BlazorUploaderElement, fileData?: FileList): File[] {
        if (element && element.blazor__instance) {
            return element.blazor__instance.sortFileList(fileData);
        }
        return null;
    },
    upload(element: BlazorUploaderElement, fileData?: FileInfo | FileInfo[], custom?: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.upload(fileData, custom);
        }
    },
    propertyChanges: function propertyChanges(element: BlazorUploaderElement, options: { [key: string]: Object }, newProps: { [key: string]: Object }) {
        if (element && element.blazor__instance) {
            element.blazor__instance.propertyChanges(options, newProps);
        }
    }
};
interface BlazorUploaderElement extends HTMLElement {
    blazor__instance: SfUploader;
}
interface AsyncSettingsModel {
    saveUrl?: string;
    removeUrl?: string;
    chunkSize?: number;
    retryCount?: number;
    retryAfterDelay?: number;
}
interface ButtonsPropsModel {
    browse?: string | HTMLElement;
    upload?: string | HTMLElement;
    clear?: string | HTMLElement;
}
interface FilesPropModel {
    name?: string;
    size?: number;
    type?: string;
}
interface FileInfo {
    name: string;
    rawFile: string | Blob;
    size: number;
    status: string;
    type: string;
    validationMessages: ValidationMessages;
    statusCode: string;
    fileSource?: string;
    list?: HTMLElement;
    input?: HTMLInputElement;
    id?: string;
}
interface ValidationMessages {
    minSize?: string;
    maxSize?: string;
}
interface MetaData {
    chunkIndex: number;
    blob: Blob | string;
    file: FileInfo;
    start: number;
    end: number;
    retryCount: number;
    request: Ajax;
}
interface InitialAttr {
    accept: string;
    multiple: boolean;
    disabled: boolean;
}
interface UploadingEventArgs {
    fileData: FileInfo;
    customFormData: { [key: string]: Object }[];
    cancel: boolean;
    chunkSize?: number;
    currentChunkIndex?: number;
    currentRequest?: XMLHttpRequest;
}
interface BeforeUploadEventArgs {
    cancel: boolean;
    customFormData: { [key: string]: Object }[];
    currentRequest?: { [key: string]: string }[];
    filesData: FileInfo[];
}
interface FileListRenderingEventArgs {
    element: HTMLElement;
    fileInfo: FileInfo;
    index: number;
    isPreload: boolean;
}
interface RemovingEventArgs {
    cancel: boolean;
    customFormData: { [key: string]: Object }[];
    event: MouseEvent | TouchEvent | KeyboardEventArgs;
    filesData: FileInfo[];
    currentRequest?: any;
    postRawFile?: boolean;
}
interface SelectedEventArgs {
    event: MouseEvent | TouchEvent | DragEvent | ClipboardEvent;
    cancel: boolean;
    filesData: FileInfo[];
    isModified: boolean;
    modifiedFilesData: FileInfo[];
    progressInterval: string;
    isCanceled?: boolean;
    currentRequest?: { [key: string]: string }[];
    customFormData: { [key: string]: Object }[];
    type: string;
}
interface CancelEventArgs {
    cancel: boolean;
    event: ProgressEventInit;
    fileData: FileInfo;
}
interface PauseResumeEventArgs {
    event: Event;
    file: FileInfo;
    chunkCount: number;
    chunkIndex: number;
    chunkSize: number;
}
interface ClearingEventArgs {
    cancel: boolean;
    filesData: FileInfo[];
}
interface BeforeRemoveEventArgs {
    cancel: boolean;
    customFormData: { [key: string]: Object }[];
    currentRequest?: { [key: string]: string }[];
    filesData: FileInfo[];
}

export default Uploader;
