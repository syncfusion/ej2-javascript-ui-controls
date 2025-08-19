import { isNullOrUndefined as isNOU, Browser, createElement, detach } from '../../../base'; /*externalscript*/
import { EventHandler, addClass, removeClass, KeyboardEventArgs, closest } from '../../../base'; /*externalscript*/
import { Ajax, BeforeSendEventArgs, Animation, getUniqueID } from '../../../base'; /*externalscript*/
import { UploaderModel, FileInfo, AsyncSettingsModel, ValidationMessages } from '../../../inputs/src'; /*externalscript*/
import { FilesPropModel, RemovingEventArgs, BeforeUploadEventArgs } from '../../../inputs/src'; /*externalscript*/
import { UploadingEventArgs, CancelEventArgs, SelectedEventArgs } from '../../../inputs/src'; /*externalscript*/
import { createSpinner, showSpinner, hideSpinner } from '../../../popups/src'; /*externalscript*/
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import * as events from '../constant';

const RTL: string = 'e-rtl';
const STATUS: string = 'e-file-status';
const FILE_NAME: string = 'e-file-name';
const FILE_TYPE: string = 'e-file-type';
const FILE_SIZE: string = 'e-file-size';
const FILE: string = 'e-upload-file-list';
const FORM_UPLOAD: string = 'e-form-upload';
const LIST_PARENT: string = 'e-upload-files';
const SPINNER_PANE: string = 'e-spinner-pane';
const ABORT_ICON: string = 'e-file-abort-btn';
const INPUT_WRAPPER: string = 'e-file-select';
const INVALID_FILE: string = 'e-file-invalid';
const UPLOAD_FAILED: string = 'e-upload-fails';
const RETRY_ICON: string = 'e-file-reload-btn';
const RTL_CONTAINER: string = 'e-rtl-container';
const REMOVE_ICON: string = 'e-file-remove-btn';
const DELETE_ICON: string = 'e-file-delete-btn';
const INFORMATION: string = 'e-file-information';
const TEXT_CONTAINER: string = 'e-file-container';
const UPLOAD_SUCCESS: string = 'e-upload-success';
const RESTRICT_RETRY: string = 'e-restrict-retry';
const DROP_WRAPPER: string = 'e-file-select-wrap';
const HIDDEN_INPUT: string = 'e-hidden-file-input';
const PROGRESSBAR: string = 'e-upload-progress-bar';
const UPLOAD_INPROGRESS: string = 'e-upload-progress';
const VALIDATION_FAILS: string = 'e-validation-fails';
const PROGRESSBAR_TEXT: string = 'e-progress-bar-text';
const PROGRESS_WRAPPER: string = 'e-upload-progress-wrap';
const PROGRESS_INNER_WRAPPER: string = 'e-progress-inner-wrap';
const CONTROL_WRAPPER: string = 'e-upload e-lib e-control-wrapper';

/**
 * `Uploader` module is used to render uploader from RichTextEditor.
 */
export class RteUploader {
    private element: HTMLInputElement;
    public asyncSettings: AsyncSettingsModel;
    public cssClass: string;
    public enableRtl: boolean;
    public allowedExtensions: string;
    private fileList: HTMLElement[] = [];
    public filesData: FileInfo[] = [];
    private updateFiles: FileInfo | FileInfo[];
    private files: FilesPropModel[] = [];
    private minFileSize: number = 0;
    private maxFileSize: number = 30000000;
    private uploadWrapper: HTMLElement;
    private listParent: HTMLElement;
    private sortFilesList: FileList;
    private actionButtons: HTMLElement;
    private uploadButton: HTMLElement;
    private pauseButton: HTMLElement;
    private dropAreaWrapper: HTMLElement;
    private uploadedFilesData: FileInfo[] = [];
    private base64String: string[] = [];
    private currentRequestHeader: { [key: string]: string }[];
    private customFormDatas: { [key: string]: object }[];
    private progressInterval: string;
    private progressAnimation: Animation;
    private isForm: boolean = false;
    private allTypes: boolean = false;
    private btnTabIndex: string = '0';
    private disableKeyboardNavigation: boolean = false;
    private actionCompleteCount: number = 0;
    private flag: boolean = true;
    private selectedFiles: FileInfo[] = [];
    private browserName: string;
    private uploaderName: string = 'UploadFiles';
    private parent: SfRichTextEditor;
    private beforeUploadFiles: FileInfo[];
    private beforeUploadCustom: boolean;

    constructor(options: UploaderModel, element: HTMLInputElement, parent?: SfRichTextEditor) {
        this.element = element;
        this.parent = parent;
        this.cssClass = options.cssClass;
        this.asyncSettings = options.asyncSettings;
        this.allowedExtensions = options.allowedExtensions;
        this.addEventListener();
        this.render();
    }
    private addEventListener(): void {
        this.parent.observer.on(events.beforePasteUploadCallBack, this.beforePasteUploadCallBack, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.beforePasteUploadCallBack, this.beforePasteUploadCallBack);
    }
    public render(): void {
        this.browserName = Browser.info.name;
        this.uploaderName = this.element.getAttribute('name');
        this.initializeUpload();
        this.wireEvents();
        this.setExtensions(this.allowedExtensions);
        this.setRTL();
        this.setCSSClass();
    }
    private initializeUpload(): void {
        this.element.setAttribute('aria-label', 'Uploader');
        this.element.setAttribute('tabindex', '-1');
        const inputWrapper: HTMLElement = createElement('span', { className: INPUT_WRAPPER, attrs: { style: 'display: none;' } });
        this.element.parentElement.insertBefore(inputWrapper, this.element);
        this.dropAreaWrapper = createElement('div', { className: DROP_WRAPPER });
        this.element.parentElement.insertBefore(this.dropAreaWrapper, this.element);
        inputWrapper.appendChild(this.element);
        this.dropAreaWrapper.appendChild(inputWrapper);
        this.uploadWrapper = createElement('div', { className: CONTROL_WRAPPER, attrs: { style: 'background: white' } });
        this.dropAreaWrapper.parentElement.insertBefore(this.uploadWrapper, this.dropAreaWrapper);
        this.uploadWrapper.appendChild(this.dropAreaWrapper);
    }
    private setExtensions(extensions: string): void {
        if (extensions !== '' && !isNOU(extensions)) {
            this.element.setAttribute('accept', extensions);
        } else {
            this.element.removeAttribute('accept');
        }
    }
    private setRTL(): void {
        if (this.enableRtl) {
            addClass([this.uploadWrapper], RTL);
        } else {
            removeClass([this.uploadWrapper], RTL);
        }
    }
    private setCSSClass(oldCSSClass?: string): void {
        let updatedCssClassValue: string = this.cssClass;
        if (!isNOU(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValue = (this.cssClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNOU(this.cssClass) && updatedCssClassValue !== '') {
            addClass([this.uploadWrapper], updatedCssClassValue.split(updatedCssClassValue.indexOf(',') > -1 ? ',' : ' '));
        }
        let updatedOldCssClass: string = oldCSSClass;
        if (!isNOU(oldCSSClass)) {
            updatedOldCssClass = (oldCSSClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNOU(oldCSSClass) && updatedOldCssClass !== '') {
            removeClass([this.uploadWrapper], updatedOldCssClass.split(' '));
        }
    }
    public createFileList(fileData: FileInfo[], isSelectedFile?: boolean): void {
        this.createParentUL();
        if (this.isFormUpload()) {
            this.uploadWrapper.classList.add(FORM_UPLOAD);
            this.formFileList(fileData, this.element.files);
        } else {
            for (const listItem of fileData) {
                const liElement: HTMLElement = createElement('li', {
                    className: FILE,
                    attrs: { 'data-file-name': listItem.name, 'data-files-count': '1' }
                });
                const textContainer: Element = createElement('span', { className: TEXT_CONTAINER });
                const textElement: HTMLElement = createElement('span', { className: FILE_NAME, attrs: { 'title': listItem.name } });
                textElement.innerHTML = this.getFileNameOnly(listItem.name);
                const fileExtension: Element = createElement('span', { className: FILE_TYPE });
                fileExtension.innerHTML = '.' + this.getFileType(listItem.name);
                if (!this.enableRtl) {
                    textContainer.appendChild(textElement);
                    textContainer.appendChild(fileExtension);
                } else {
                    const rtlContainer: Element = createElement('span', { className: RTL_CONTAINER });
                    rtlContainer.appendChild(fileExtension);
                    rtlContainer.appendChild(textElement);
                    textContainer.appendChild(rtlContainer);
                }
                const fileSize: Element = createElement('span', { className: FILE_SIZE });
                fileSize.innerHTML = this.bytesToSize(listItem.size);
                textContainer.appendChild(fileSize);
                const statusElement: HTMLElement = createElement('span', { className: STATUS });
                textContainer.appendChild(statusElement);
                statusElement.innerHTML = listItem.status;
                liElement.appendChild(textContainer);
                const iconElement: HTMLElement = createElement('span', { className: ' e-icons', attrs: { 'tabindex': this.btnTabIndex } });
                /* istanbul ignore next */
                if (this.browserName === 'msie') { iconElement.classList.add('e-msie'); }
                iconElement.setAttribute('title', 'Remove');
                liElement.appendChild(iconElement);
                EventHandler.add(iconElement, 'click', this.removeFiles, this);
                if (listItem.statusCode === '2') {
                    statusElement.classList.add(UPLOAD_SUCCESS);
                    iconElement.classList.add(DELETE_ICON);
                    iconElement.setAttribute('title', 'Delete file');
                } else if (listItem.statusCode !== '1') {
                    statusElement.classList.remove(UPLOAD_SUCCESS);
                    statusElement.classList.add(VALIDATION_FAILS);
                }
                if (listItem.statusCode === '1' && this.asyncSettings.saveUrl !== '') {
                    statusElement.innerHTML = '';
                }
                if (!iconElement.classList.contains(DELETE_ICON)) {
                    iconElement.classList.add(REMOVE_ICON);
                }
                this.listParent.appendChild(liElement);
                this.fileList.push(liElement);
                this.truncateName(textElement);
                const preventActionComplete: boolean = this.flag;
                if (this.isPreLoadFile(listItem)) {
                    this.flag = false;
                    this.checkActionComplete(true);
                    this.flag = preventActionComplete;
                }
            }
        }
    }
    private createParentUL(): void {
        if (isNOU(this.listParent)) {
            this.listParent = createElement('ul', { className: LIST_PARENT });
            this.uploadWrapper.appendChild(this.listParent);
        }
    }
    private isFormUpload(): boolean {
        let isFormUpload: boolean = false;
        if (this.isForm && ((isNOU(this.asyncSettings.saveUrl) || this.asyncSettings.saveUrl === '')
            && (isNOU(this.asyncSettings.removeUrl) || this.asyncSettings.removeUrl === ''))) {
            isFormUpload = true;
        }
        return isFormUpload;
    }
    private getFileType(name: string): string {
        let extension: string;
        const index: number = name.lastIndexOf('.');
        if (index >= 0) {
            extension = name.substring(index + 1);
        }
        return extension ? extension : '';
    }
    private getFileNameOnly(name: string): string {
        let type: string = this.getFileType(name);
        const names: string[] = name.split('.' + type);
        return type = names[0];
    }
    private truncateName(name: HTMLElement): void {
        const nameElement: HTMLElement = name;
        if (this.browserName !== 'edge' && nameElement.offsetWidth < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
            /* istanbul ignore next */
        } else if (nameElement.offsetWidth + 1 < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
        }
    }
    private getSlicedName(nameElement: HTMLElement): void {
        const text: string = nameElement.textContent;
        nameElement.dataset.tail = text.slice(text.length - 10);
    }
    private setListToFileInfo(fileData: FileInfo[], fileList: HTMLElement): void {
        for (const listItem of fileData) {
            listItem.list = fileList;
        }
    }
    private getFileSize(fileData: FileInfo[]): number {
        let fileSize: number = 0;
        for (const file of fileData) {
            fileSize += file.size;
        }
        return fileSize;
    }
    public bytesToSize(bytes: number): string {
        let i: number = -1;
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
        return Math.max(bytes, 0).toFixed(1) + ' ' + ['KB', 'MB'][i as number];
    }
    private createFormInput(fileData: FileInfo[]): void {
        const inputElement: HTMLInputElement = this.element.cloneNode(true) as HTMLInputElement;
        inputElement.classList.add(HIDDEN_INPUT);
        for (const listItem of fileData) {
            listItem.input = inputElement;
        }
        inputElement.setAttribute('name', this.uploaderName);
        this.uploadWrapper.querySelector('.' + INPUT_WRAPPER).appendChild(inputElement);
        if (this.browserName !== 'msie' && this.browserName !== 'edge') {
            this.element.value = '';
        }
    }
    private checkActionComplete(increment: boolean): void {
        if (increment) {
            ++this.actionCompleteCount;
        } else {
            --this.actionCompleteCount;
        }
        if ((this.filesData.length === this.actionCompleteCount) && this.flag) {
            this.flag = false;
        }
    }
    private isPreLoadFile(fileData: FileInfo): boolean {
        let isPreload: boolean = false;
        for (let i: number = 0; i < this.files.length; i++) {
            if (this.files[i as number].name === fileData.name.slice(0, fileData.name.lastIndexOf('.')) && this.files[i as number].type === fileData.type) {
                isPreload = true;
            }
        }
        return isPreload;
    }
    private validatedFileSize(fileSize: number): Object {
        let minSizeError: string = '';
        let maxSizeError: string = '';
        if (fileSize < this.minFileSize) {
            minSizeError = 'File size is too small';
        } else if (fileSize > this.maxFileSize) {
            maxSizeError = 'File size is too large';
        } else {
            minSizeError = '';
            maxSizeError = '';
        }
        const errorMessage: Object = { minSize: minSizeError, maxSize: maxSizeError };
        return errorMessage;
    }
    private isBlank(str: string): boolean {
        return (!str || /^\s*$/.test(str));
    }
    private addInvalidClass(fileList: HTMLElement): void {
        fileList.classList.add(INVALID_FILE);
    }
    private checkExtension(files: FileInfo[]): FileInfo[] {
        const dropFiles: FileInfo[] = files;
        if (!this.isBlank(this.allowedExtensions)) {
            const allowedExtensions: string[] = [];
            const extensions: string[] = this.allowedExtensions.split(',');
            for (const extension of extensions) {
                allowedExtensions.push(extension.trim().toLocaleLowerCase());
            }
            for (let i: number = 0; i < files.length; i++) {
                if (allowedExtensions.indexOf(('.' + files[i as number].type).toLocaleLowerCase()) === -1) {
                    files[i as number].status = 'File type is not allowed';
                    files[i as number].statusCode = '0';
                }
            }
        }
        return dropFiles;
    }
    public getFilesData(index?: number): FileInfo[] {
        if (isNOU(index)) {
            return this.filesData;
        } else {
            return this.getSelectedFiles(index);
        }

    }
    private getFilesInArray(files: FileInfo | FileInfo[]): FileInfo[] {
        let uploadFiles: FileInfo[] = [];
        if (files instanceof Array) {
            uploadFiles = files;
        } else {
            uploadFiles.push(files);
        }
        return uploadFiles;
    }
    private formValidateFileInfo(listItem: FileInfo, fileList: HTMLElement): string {
        let statusMessage: string = listItem.status;
        const validationMessages: ValidationMessages = this.validatedFileSize(listItem.size);
        if (validationMessages.minSize !== '' || validationMessages.maxSize !== '') {
            this.addInvalidClass(fileList);
            statusMessage = validationMessages.minSize !== '' ? 'File size is too small' :
                validationMessages.maxSize !== '' ? 'File size is too large' : statusMessage;
        }
        const typeValidationMessage: string = this.checkExtension(this.getFilesInArray(listItem))[0].status;
        if (typeValidationMessage === 'File type is not allowed') {
            this.addInvalidClass(fileList);
            statusMessage = typeValidationMessage;
        }
        return statusMessage;
    }
    public clearAll(): void {
        if (isNOU(this.listParent)) {
            if (this.browserName !== 'msie') { this.element.value = ''; }
            this.filesData = [];
            return;
        }
        this.clearData();
        this.actionCompleteCount = 0;
    }
    private clearData(singleUpload?: boolean): void {
        if (!isNOU(this.listParent)) {
            detach(this.listParent);
            this.listParent = null;
        }
        if (this.browserName !== 'msie' && !singleUpload) { this.element.value = ''; }
        this.fileList = [];
        this.filesData = [];
        this.removeActionButtons();
    }
    private removeActionButtons(): void {
        if (this.actionButtons) {
            detach(this.actionButtons);
            this.actionButtons = null;
        }
    }
    private checkActionButtonStatus(): void {
        if (this.actionButtons) {
            const length: number = this.uploadWrapper.querySelectorAll('.' + VALIDATION_FAILS).length +
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
    private getSelectedFiles(index: number): FileInfo[] {
        const data: FileInfo[] = [];
        const liElement: HTMLElement = this.fileList[index as number];
        const allFiles: FileInfo[] = this.getFilesData();
        const nameElements: number = +liElement.getAttribute('data-files-count');
        let startIndex: number = 0;
        for (let i: number = 0; i < index; i++) {
            startIndex += (+this.fileList[i as number].getAttribute('data-files-count'));
        }
        for (let j: number = startIndex; j < (startIndex + nameElements); j++) {
            data.push(allFiles[j as number]);
        }
        return data;
    }
    private formFileList(fileData: FileInfo[], files: FileList): void {
        const fileList: HTMLElement = createElement('li', { className: FILE });
        fileList.setAttribute('data-files-count', fileData.length + '');
        const fileContainer: HTMLElement = createElement('span', { className: TEXT_CONTAINER });
        let statusMessage: string;
        for (const listItem of fileData) {
            const fileNameEle: HTMLElement = createElement('span', { className: FILE_NAME });
            fileNameEle.innerHTML = this.getFileNameOnly(listItem.name);
            const fileTypeEle: HTMLElement = createElement('span', { className: FILE_TYPE });
            fileTypeEle.innerHTML = '.' + this.getFileType(listItem.name);
            if (!this.enableRtl) {
                fileContainer.appendChild(fileNameEle);
                fileContainer.appendChild(fileTypeEle);
            } else {
                const rtlContainer: Element = createElement('span', { className: RTL_CONTAINER });
                rtlContainer.appendChild(fileTypeEle);
                rtlContainer.appendChild(fileNameEle);
                fileContainer.appendChild(rtlContainer);
            }
            this.truncateName(fileNameEle);
            statusMessage = this.formValidateFileInfo(listItem, fileList);
        }
        fileList.appendChild(fileContainer);
        this.setListToFileInfo(fileData, fileList);
        const infoEle: HTMLElement = createElement('span');
        if (fileList.classList.contains(INVALID_FILE)) {
            infoEle.classList.add(STATUS);
            infoEle.classList.add(INVALID_FILE);
            infoEle.innerText = fileData.length > 1 ? 'invalidFileSelection' : statusMessage;
        } else {
            infoEle.classList.add(fileData.length > 1 ? INFORMATION : FILE_SIZE);
            infoEle.innerText = fileData.length > 1 ? 'totalFiles: ' + fileData.length + ' , '
                + 'size: ' + this.bytesToSize(this.getFileSize(fileData)) : this.bytesToSize(fileData[0].size);
            this.createFormInput(fileData);
        }
        fileContainer.appendChild(infoEle);
        if (isNOU(fileList.querySelector('.e-icons'))) {
            const iconElement: HTMLElement = createElement('span', { className: 'e-icons', attrs: { 'tabindex': this.btnTabIndex } });
            /* istanbul ignore next */
            if (this.browserName === 'msie') { iconElement.classList.add('e-msie'); }
            iconElement.setAttribute('title', 'Remove');
            fileList.appendChild(fileContainer);
            fileList.appendChild(iconElement);
            EventHandler.add(iconElement, 'click', this.removeFiles, this);
            iconElement.classList.add(REMOVE_ICON);
        }
        this.listParent.appendChild(fileList);
        this.fileList.push(fileList);
    }
    private removeFiles(args: MouseEvent | TouchEvent | KeyboardEventArgs): void {
        const selectedElement: HTMLElement = (<HTMLInputElement>args.target).parentElement;
        const index: number = this.fileList.indexOf(selectedElement);
        const liElement: HTMLElement = this.fileList[index as number];
        const formUpload: boolean = this.isFormUpload();
        const fileData: FileInfo[] = formUpload ? this.getSelectedFiles(index as number) :
            this.getFilesInArray(this.filesData[index as number]);
        if (isNOU(fileData)) { return; }
        if ((<HTMLInputElement>args.target).classList.contains(ABORT_ICON) && !formUpload) {
            fileData[0].statusCode = '5';
            if (!isNOU(liElement)) {
                const spinnerTarget: HTMLElement = liElement.querySelector('.' + ABORT_ICON) as HTMLElement;
                createSpinner({ target: spinnerTarget, width: '20px' });
                showSpinner(spinnerTarget);
            }
            if (!(liElement.classList.contains(RESTRICT_RETRY))) {
                this.checkActionComplete(true);
            }
        } else if (!closest(args.target as Element, '.' + SPINNER_PANE)) {
            this.remove(fileData, false, false, true, args);
        }
        this.element.value = '';
        this.checkActionButtonStatus();
    }
    private spliceFiles(liIndex: number): void {
        const liElement: HTMLElement = this.fileList[liIndex as number];
        const allFiles: FileInfo[] = this.getFilesData();
        const nameElements: number = +liElement.getAttribute('data-files-count');
        let startIndex: number = 0;
        for (let i: number = 0; i < liIndex; i++) {
            startIndex += (+this.fileList[i as number].getAttribute('data-files-count'));
        }
        const endIndex: number = (startIndex + nameElements) - 1;
        for (let j: number = endIndex; j >= startIndex; j--) {
            allFiles.splice(j, 1);
        }
    }
    public remove(
        fileData?: FileInfo | FileInfo[], customTemplate?: boolean, removeDirectly?: boolean,
        postRawFile?: boolean, args?: MouseEvent | TouchEvent | KeyboardEventArgs): void {
        if (isNOU(postRawFile)) {
            postRawFile = true;
        }
        const eventArgs: RemovingEventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            customFormData: [],
            postRawFile: postRawFile,
            currentRequest: null
        };
        if (this.isFormUpload()) {
            eventArgs.filesData = fileData as FileInfo[];
            this.parent.observer.notify(events.removing, eventArgs);
            const removingFiles: FileInfo[] = this.getFilesInArray(fileData);
            let isLiRemoved: boolean = false;
            let liIndex: number;
            for (const data of removingFiles) {
                if (!isLiRemoved) {
                    liIndex = this.fileList.indexOf(data.list);
                }
                if (liIndex > -1) {
                    const inputElement: HTMLElement = !isNOU(data.input) ? data.input : null;
                    if (inputElement) {
                        detach(inputElement);
                    }
                    this.spliceFiles(liIndex);
                    detach(this.fileList[liIndex as number]);
                    this.fileList.splice(liIndex, 1);
                    isLiRemoved = true;
                    liIndex = -1;
                }
            }
        } else if (this.isForm && (isNOU(this.asyncSettings.removeUrl) || this.asyncSettings.removeUrl === '')) {
            eventArgs.filesData = this.getFilesData();
            this.parent.observer.notify(events.removing, eventArgs);
            this.clearAll();
        } else {
            let removeFiles: FileInfo[] = [];
            fileData = !isNOU(fileData) ? fileData : this.filesData;
            if (fileData instanceof Array) {
                removeFiles = fileData;
            } else {
                removeFiles.push(fileData);
            }
            eventArgs.filesData = removeFiles;
            const removeUrl: string = this.asyncSettings.removeUrl;
            const validUrl: boolean = (removeUrl === '' || isNOU(removeUrl)) ? false : true;
            for (const files of removeFiles) {
                const fileUploadedIndex: number = this.uploadedFilesData.indexOf(files);
                if ((files.statusCode === '2' || files.statusCode === '4' || (files.statusCode === '0' &&
                    fileUploadedIndex !== -1)) && validUrl) {
                    this.removeUploadedFile(files, eventArgs, removeDirectly, customTemplate);
                } else {
                    if (!removeDirectly) {
                        this.parent.observer.notify(events.removing, eventArgs);
                        this.removeFilesData(files, customTemplate);
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
    private updateCustomHeader(request: XMLHttpRequest, currentRequest: { [key: string]: string }[]): void {
        if (currentRequest.length > 0 && currentRequest[0]) {
            for (let i: number = 0; i < currentRequest.length; i++) {
                const data: { [key: string]: string } = currentRequest[i as number];
                // eslint-disable-next-line
                let value: any = Object.keys(data).map(function (e) {
                    return data[e as string];
                });
                request.setRequestHeader(Object.keys(data)[0], value);
            }
        }
    }
    private removeUploadedFile(
        file: FileInfo, eventArgs: RemovingEventArgs,
        removeDirectly: boolean, custom: boolean): void {
        const selectedFiles: FileInfo = file;
        const ajax: Ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
        ajax.emitError = false;
        const formData: FormData = new FormData();
        ajax.beforeSend = (e: BeforeSendEventArgs) => {
            eventArgs.currentRequest = ajax.httpRequest;
            if (this.currentRequestHeader) {
                this.updateCustomHeader(ajax.httpRequest, this.currentRequestHeader);
            }
            if (this.customFormDatas) {
                this.updateFormData(formData, this.customFormDatas);
            }
            if (!removeDirectly) {
                this.parent.observer.notify(events.removing, eventArgs);
                this.removingEventCallback(eventArgs, formData, selectedFiles, file);
            } else {
                this.removingEventCallback(eventArgs, formData, selectedFiles, file);
            }
        };
        ajax.onLoad = (e: Event): object => { this.removeCompleted(e, selectedFiles, custom); return {}; };
        /* istanbul ignore next */
        ajax.onError = (e: Event): object => { this.removeFailed(e, selectedFiles, custom); return {}; };
        ajax.send(formData);
    }
    private getResponse(e: Event): Object {
        // eslint-disable-next-line
        let target: any = e.currentTarget;
        const response: Object = {
            readyState: target.readyState,
            statusCode: target.status,
            statusText: target.statusText,
            headers: target.getAllResponseHeaders(),
            withCredentials: target.withCredentials
        };
        return response;
    }
    private removeCompleted(e: Event, files: FileInfo, customTemplate: boolean): void {
        const response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        const status: XMLHttpRequest = e.target as XMLHttpRequest;
        if (status.readyState === 4 && status.status >= 200 && status.status <= 299) {
            const args: Object = {
                e, response: response, operation: 'Remove', file: this.updateStatus(files, 'File removed successfully', '2')
            };
            this.parent.observer.notify(events.success, args);
            this.removeFilesData(files, customTemplate);
            const index: number = this.uploadedFilesData.indexOf(files);
            this.uploadedFilesData.splice(index, 1);
        } else {
            this.removeFailed(e, files, customTemplate);
        }
    }
    private removeFailed(e: Event, files: FileInfo, customTemplate: boolean): void {
        const response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        const args: Object = {
            e, response: response, operation: 'Remove', file: this.updateStatus(files, 'Unable to remove file', '0')
        };
        if (!customTemplate) {
            const index: number = this.filesData.indexOf(files);
            const rootElement: HTMLElement = this.fileList[index as number];
            if (rootElement) {
                rootElement.classList.remove(UPLOAD_SUCCESS);
                rootElement.classList.add(UPLOAD_FAILED);
                const statusElement: HTMLElement = rootElement.querySelector('.' + STATUS) as HTMLElement;
                if (statusElement) {
                    statusElement.classList.remove(UPLOAD_SUCCESS);
                    statusElement.classList.add(UPLOAD_FAILED);
                }
            }
            this.checkActionButtonStatus();
        }
        this.parent.observer.notify(events.failure, args);
        const liElement: HTMLElement = this.getLiElement(files);
        /* istanbul ignore next */
        if (!isNOU(liElement) && !isNOU(liElement.querySelector('.' + DELETE_ICON))) {
            const spinnerTarget: HTMLElement = liElement.querySelector('.' + DELETE_ICON) as HTMLElement;
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
    }
    private updateStatus(files: FileInfo, status?: string, statusCode?: string, updateLiStatus: boolean = true): FileInfo {
        if (!(status === '' || isNOU(status)) && !(statusCode === '' || isNOU(statusCode))) {
            files.status = status;
            files.statusCode = statusCode;
        }
        if (updateLiStatus) {
            const li: HTMLElement = this.getLiElement(files);
            if (!isNOU(li)) {
                if (!isNOU(li.querySelector('.' + STATUS)) && !((status === '' || isNOU(status)))) {
                    li.querySelector('.' + STATUS).textContent = status;
                }
            }
        }
        return files;
    }
    private removingEventCallback(eventArgs: RemovingEventArgs, formData: FormData, selectedFiles: FileInfo, file: FileInfo): void {
        /* istanbul ignore next */
        const name: string = this.element.getAttribute('name');
        const liElement: HTMLElement = this.getLiElement(file);
        if (!isNOU(liElement) && (!isNOU(liElement.querySelector('.' + DELETE_ICON)) ||
            !isNOU(liElement.querySelector('.' + REMOVE_ICON)))) {
            const spinnerTarget: HTMLElement = liElement.querySelector('.' + DELETE_ICON) ? liElement.querySelector('.' + DELETE_ICON) as HTMLElement :
                liElement.querySelector('.' + REMOVE_ICON) as HTMLElement;
            createSpinner({ target: spinnerTarget, width: '20px' });
            showSpinner(spinnerTarget);
        }
        if (eventArgs.postRawFile && !isNOU(selectedFiles.rawFile) && selectedFiles.rawFile !== '') {
            formData.append(name, selectedFiles.rawFile, selectedFiles.name);
        } else {
            formData.append(name, selectedFiles.name);
        }
        this.updateFormData(formData, eventArgs.customFormData);
    }
    private updateFormData(formData: FormData, customData: { [key: string]: Object }[]): void {
        if (customData.length > 0 && customData[0]) {
            for (let i: number = 0; i < customData.length; i++) {
                const data: { [key: string]: Object } = customData[i as number];
                // eslint-disable-next-line
                let value: any = Object.keys(data).map(function (e) {
                    return data[e as string];
                });
                formData.append(Object.keys(data)[0], value);
            }
        }
    }
    private getLiElement(files: FileInfo): HTMLElement {
        let index: number;
        for (let i: number = 0; i < this.filesData.length; i++) {
            if ((!isNOU(this.filesData[i as number].id) && !isNOU(files.id)) ? (this.filesData[i as number].name === files.name &&
                this.filesData[i as number].id === files.id) : this.filesData[i as number].name === files.name) {
                index = i;
            }
        }
        return this.fileList[index as number];
    }
    private removeFilesData(file: FileInfo, customTemplate: boolean): void {
        if (customTemplate) { return; }
        const selectedElement: HTMLElement = this.getLiElement(file);
        if (isNOU(selectedElement)) { return; }
        detach(selectedElement);
        const index: number = this.fileList.indexOf(selectedElement);
        this.fileList.splice(index, 1);
        this.filesData.splice(index, 1);
        if (this.fileList.length === 0 && !isNOU(this.listParent)) {
            detach(this.listParent);
            this.listParent = null;
            this.removeActionButtons();
        }
    }
    public upload(files?: FileInfo | FileInfo[], custom?: boolean): void {
        this.updateFiles = files ? files : this.filesData;
        this.beforeUploadCustom = isNOU(custom) ? false : custom;
        const eventArgs: BeforeUploadEventArgs = {
            customFormData: [],
            currentRequest: null,
            cancel: false
        };
        this.parent.observer.notify(events.beforePasteUpload, eventArgs);
        if (isNOU(this.parent.insertImageSettings.saveUrl)) {
            this.updateFilesAfterPaste();
        }
    }
    private beforePasteUploadCallBack(eventArgs: BeforeUploadEventArgs): void {
        if (!eventArgs.cancel) {
            this.currentRequestHeader = eventArgs.currentRequest ? eventArgs.currentRequest : this.currentRequestHeader;
            this.customFormDatas = (eventArgs.customFormData && eventArgs.customFormData.length > 0) ?
                eventArgs.customFormData : this.customFormDatas;
        }
        this.updateFilesAfterPaste();
    }
    private updateFilesAfterPaste(): void {
        this.beforeUploadFiles = this.getFilesInArray(this.updateFiles);
        this.uploadFiles(this.beforeUploadFiles, this.beforeUploadCustom);
    }
    private filterfileList(files: FileInfo[]): FileInfo[] {
        const filterFiles: FileInfo[] = [];
        let li: HTMLElement;
        for (let i: number = 0; i < files.length; i++) {
            li = this.getLiElement(files[i as number]);
            if (!li.classList.contains(UPLOAD_SUCCESS)) {
                filterFiles.push(files[i as number]);
            }
        }
        return filterFiles;
    }
    private uploadFiles(files: FileInfo[], custom?: boolean): void {
        let selectedFiles: FileInfo[] = [];
        if (this.asyncSettings.saveUrl === '' || isNOU(this.asyncSettings.saveUrl)) {
            return;
        }
        if (!custom || isNOU(custom)) {
            selectedFiles = this.filterfileList(files);
        } else {
            selectedFiles = files;
        }
        for (let i: number = 0; i < selectedFiles.length; i++) {
            this.uploadFilesRequest(selectedFiles, i, custom);
        }
    }
    private updateCustomheader(request: XMLHttpRequest, currentRequest: { [key: string]: string }[]): void {
        if (currentRequest.length > 0 && currentRequest[0]) {
            for (let i: number = 0; i < currentRequest.length; i++) {
                const data: { [key: string]: string } = currentRequest[i as number];
                // eslint-disable-next-line
                let value: any = Object.keys(data).map(function (e) {
                    return data[e as string];
                });
                request.setRequestHeader(Object.keys(data)[0], value);
            }
        }
    }
    private eventCancelByArgs(e: BeforeSendEventArgs, eventArgs: UploadingEventArgs, file: FileInfo): void {
        e.cancel = true;
        if (eventArgs.fileData.statusCode === '5') { return; }
        eventArgs.fileData.statusCode = '5';
        eventArgs.fileData.status = 'File upload canceled';
        const liElement: HTMLElement = this.getLiElement(eventArgs.fileData);
        if (liElement) {
            if (!isNOU(liElement.querySelector('.' + STATUS))) {
                liElement.querySelector('.' + STATUS).innerHTML = 'File upload canceled';
                liElement.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
            }
            this.pauseButton = createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex } });
            const removeIcon: Element = liElement.querySelector('.' + REMOVE_ICON);
            if (removeIcon) {
                removeIcon.parentElement.insertBefore(this.pauseButton, removeIcon);
            }
            this.pauseButton.setAttribute('title', 'Retry');
            /* istanbul ignore next */
            this.pauseButton.addEventListener('click', (e: Event) => { this.reloadcanceledFile(e, file, liElement); }, false);
            this.checkActionButtonStatus();
        }
    }
    private reloadcanceledFile(e: Event, file: FileInfo, liElement?: HTMLElement, custom?: boolean): void {
        file.statusCode = '1';
        file.status = 'Ready to upload';
        if (!custom) {
            liElement.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            if (!isNOU(liElement.querySelector('.' + RETRY_ICON))) {
                detach(liElement.querySelector('.' + RETRY_ICON));
            }
            this.pauseButton = null;
        }
        /* istanbul ignore next */
        liElement.classList.add(RESTRICT_RETRY);
        this.upload([file]);
    }
    private uploadFilesRequest(selectedFiles: FileInfo[], i: number, custom?: boolean): void {
        const ajax: Ajax = new Ajax(this.asyncSettings.saveUrl, 'POST', true, null);
        ajax.emitError = false;
        /* istanbul ignore next */
        const eventArgs: UploadingEventArgs = {
            fileData: selectedFiles[i as number],
            customFormData: [],
            cancel: false
        };
        const formData: FormData = new FormData();
        ajax.beforeSend = (e: BeforeSendEventArgs) => {
            eventArgs.currentRequest = ajax.httpRequest;
            /* istanbul ignore next */
            eventArgs.fileData.rawFile =  this.base64String[i as number];
            if (this.currentRequestHeader) {
                this.updateCustomheader(ajax.httpRequest, this.currentRequestHeader);
            }
            if (this.customFormDatas) {
                this.updateFormData(formData, this.customFormDatas);
            }
            this.parent.observer.notify(events.uploading, eventArgs);
            /* istanbul ignore next */
            if (eventArgs.cancel) {
                this.eventCancelByArgs(e, eventArgs, selectedFiles[i as number]);
            }
            this.updateFormData(formData, eventArgs.customFormData);
        };
        if (selectedFiles[i as number].statusCode === '1') {
            const name: string = this.element.getAttribute('name');
            formData.append(name, selectedFiles[i as number].rawFile, selectedFiles[i as number].name);
            ajax.onLoad = (e: Event): object => {
                this.uploadComplete(e, selectedFiles[i as number], custom);
                return {};
            };
            ajax.onUploadProgress = (e: Event): object => {
                this.uploadInProgress(e, selectedFiles[i as number], custom, ajax);
                return {};
            };
            /* istanbul ignore next */
            ajax.onError = (e: Event) => { this.uploadFailed(e, selectedFiles[i as number]); return {}; };
            ajax.send(formData);
        }
    }
    private cancelUploadingFile(files: FileInfo, e: ProgressEventInit, request?: Ajax, li?: HTMLElement): void {
        if (files.statusCode === '5') {
            const eventArgs: CancelEventArgs = {
                event: e,
                fileData: files,
                cancel: false,
                customFormData: []
            };
            this.parent.observer.notify(events.canceling, eventArgs);
            if (eventArgs.cancel) {
                files.statusCode = '3';
                if (!isNOU(li)) {
                    const spinnerTarget: HTMLElement = li.querySelector('.' + ABORT_ICON) as HTMLElement;
                    if (!isNOU(spinnerTarget)) {
                        hideSpinner(spinnerTarget);
                        detach(li.querySelector('.e-spinner-pane'));
                    }
                }
            } else {
                request.emitError = false;
                request.httpRequest.abort();
                const formData: FormData = new FormData();
                if (files.statusCode === '5') {
                    const name: string = this.element.getAttribute('name');
                    formData.append(name, files.name);
                    formData.append('cancel-uploading', files.name);
                    this.updateFormData(formData, eventArgs.customFormData);
                    const ajax: Ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
                    ajax.emitError = false;
                    ajax.onLoad = (e: Event): object => { this.removecanceledFile(e, files); return {}; };
                    ajax.send(formData);
                }
            }
        }
    }
    private removecanceledFile(e: Event, file: FileInfo): void {
        const liElement: HTMLElement = this.getLiElement(file);
        if (liElement.querySelector('.' + RETRY_ICON) || isNOU(liElement.querySelector('.' + ABORT_ICON))) { return; }
        this.updateStatus(file, 'File upload canceled', '5');
        this.renderFailureState(e, file, liElement);
        const spinnerTarget: HTMLElement = liElement.querySelector('.' + REMOVE_ICON) as HTMLElement;
        if (!isNOU(liElement)) {
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
        const requestResponse: Object = e && e.currentTarget ? this.getResponse(e) : null;
        const args: Object = { event: e, response: requestResponse, operation: 'Cancel', file: file };
        this.parent.observer.notify(events.success, args);
    }
    private uploadInProgress(e: ProgressEventInit, files: FileInfo, customUI?: boolean, request?: Ajax): void {
        const li: HTMLElement = this.getLiElement(files);
        if (isNOU(li) && (!customUI)) { return; }
        if (!isNOU(li)) {
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
            this.updateProgressbar(e, <Element>li);
            const iconEle: HTMLElement = li.querySelector('.' + REMOVE_ICON) as HTMLElement;
            if (!isNOU(iconEle)) {
                iconEle.classList.add(ABORT_ICON, UPLOAD_INPROGRESS);
                iconEle.setAttribute('title', 'Abort');
                iconEle.classList.remove(REMOVE_ICON);
            }
        } else {
            this.cancelUploadingFile(files, e, request);
        }
    }
    private changeProgressValue(li: Element, progressValue: string): void {
        (li.querySelector('.' + PROGRESSBAR) as HTMLElement).style.width = progressValue;
        li.querySelector('.' + PROGRESSBAR_TEXT).textContent = progressValue;
    }
    private updateProgressbar(e: ProgressEventInit, li: Element): void {
        if (!isNaN(Math.round((e.loaded / e.total) * 100)) && !isNOU(li.querySelector('.' + PROGRESSBAR))) {
            if (!isNOU(this.progressInterval) && this.progressInterval !== '') {
                const value: number = (Math.round((e.loaded / e.total) * 100)) % parseInt(this.progressInterval, 10);
                if (value === 0 || value === 100) {
                    this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
                }
            } else {
                this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
            }
        }
    }
    private createProgressBar(liElement: Element): void {
        const progressbarWrapper: Element = createElement('span', { className: PROGRESS_WRAPPER });
        const progressBar: Element = createElement('progressbar', { className: PROGRESSBAR, attrs: { value: '0', max: '100' } });
        const progressbarInnerWrapper: Element = createElement('span', { className: PROGRESS_INNER_WRAPPER });
        (progressBar as HTMLElement).style.width = '0%';
        const progressbarText: Element = createElement('span', { className: PROGRESSBAR_TEXT });
        progressbarText.textContent = '0%';
        progressbarInnerWrapper.appendChild(progressBar);
        progressbarWrapper.appendChild(progressbarInnerWrapper);
        progressbarWrapper.appendChild(progressbarText);
        liElement.querySelector('.' + TEXT_CONTAINER).appendChild(progressbarWrapper);
    }
    private updateProgressBarClasses(li: HTMLElement, className: string): void {
        const progressBar: HTMLElement = <HTMLElement>li.querySelector('.' + PROGRESSBAR);
        if (!isNOU(progressBar)) {
            progressBar.classList.add(className);
        }
    }
    private raiseSuccessEvent(e: Event, file: FileInfo): void {
        const response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        const statusMessage: string = 'File uploaded successfully';
        const args: Object = {
            e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '2', false), statusText: statusMessage
        };
        const liElement: HTMLElement = this.getLiElement(file);
        if (!isNOU(liElement)) {
            const spinnerEle: HTMLElement = liElement.querySelector('.' + SPINNER_PANE) as HTMLElement;
            if (!isNOU(spinnerEle)) {
                hideSpinner(liElement);
                detach(spinnerEle);
            }
        }
        this.parent.observer.notify(events.success, args);
        // eslint-disable-next-line
        this.updateStatus(file, (args as any).statusText, '2');
        this.uploadedFilesData.push(file);
        this.checkActionButtonStatus();
        if (this.fileList.length > 0) {
            if ((!(this.getLiElement(file)).classList.contains(RESTRICT_RETRY))) {
                this.checkActionComplete(true);
            } else {
                /* istanbul ignore next */
                (this.getLiElement(file)).classList.remove(RESTRICT_RETRY);
            }
        }
    }
    private uploadComplete(e: Event, file: FileInfo, customUI?: boolean): void {
        const status: XMLHttpRequest = e.target as XMLHttpRequest;
        if (status.readyState === 4 && status.status >= 200 && status.status <= 299) {
            const li: HTMLElement = this.getLiElement(file);
            if (isNOU(li) && (!customUI || isNOU(customUI))) { return; }
            if (!isNOU(li)) {
                this.updateProgressBarClasses(li, UPLOAD_SUCCESS);
                this.removeProgressbar(li, 'success');
                const iconEle: Element = li.querySelector('.' + ABORT_ICON);
                if (!isNOU(iconEle)) {
                    iconEle.classList.add(DELETE_ICON);
                    iconEle.setAttribute('title', 'Delete file');
                    iconEle.classList.remove(ABORT_ICON);
                    iconEle.classList.remove(UPLOAD_INPROGRESS);
                }
            }
            this.raiseSuccessEvent(e, file);
        } else {
            this.uploadFailed(e, file);
        }
    }
    private uploadFailed(e: Event, file: FileInfo): void {
        const li: HTMLElement = this.getLiElement(file);
        const response: Object = e && e.currentTarget ? this.getResponse(e) : null;
        const statusMessage: string = 'File failed to upload';
        const args: Object = {
            e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '0', false), statusText: statusMessage
        };
        if (!isNOU(li)) { this.renderFailureState(e, file, li); }
        this.parent.observer.notify(events.failure, args);
        // eslint-disable-next-line
        this.updateStatus(file, (args as any).statusText, '0');
        this.checkActionButtonStatus();
        this.checkActionComplete(true);
    }
    private renderFailureState(e: Event, file: FileInfo, liElement: HTMLElement): void {
        this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        this.removeProgressbar(liElement, 'failure');
        if (!isNOU(liElement.querySelector('.e-file-status'))) {
            liElement.querySelector('.e-file-status').classList.add(UPLOAD_FAILED);
        }
        const deleteIcon: Element = liElement.querySelector('.' + ABORT_ICON);
        if (isNOU(deleteIcon)) { return; }
        deleteIcon.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
        deleteIcon.classList.add(REMOVE_ICON);
        deleteIcon.setAttribute('title', 'Remove');
        this.pauseButton = createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex } });
        deleteIcon.parentElement.insertBefore(this.pauseButton, deleteIcon);
        this.pauseButton.setAttribute('title', 'Retry');
        const retryElement: HTMLElement = liElement.querySelector('.' + RETRY_ICON) as HTMLElement;
        /* istanbul ignore next */
        retryElement.addEventListener('click', (e: Event) => { this.reloadcanceledFile(e, file, liElement, false); }, false);
    }
    private removeProgressbar(li: HTMLElement, callType: string): void {
        if (!isNOU(li.querySelector('.' + PROGRESS_WRAPPER))) {
            this.progressAnimation = new Animation({ duration: 1250 });
            this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + PROGRESS_WRAPPER), { name: 'FadeOut' });
            this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + PROGRESSBAR_TEXT), { name: 'FadeOut' });
            setTimeout(() => { this.animateProgressBar(li, callType); }, 750);
        }
    }
    private animateProgressBar(li: Element, callType: string): void {
        if (callType === 'success') {
            if (!isNOU(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + STATUS), { name: 'FadeIn' });
                li.querySelector('.' + STATUS).classList.add(UPLOAD_SUCCESS);
            }
        } else {
            if (!isNOU(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(<HTMLElement>li.querySelector('.' + STATUS), { name: 'FadeIn' });
                li.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
            }
        }
        if (li.querySelector('.' + PROGRESS_WRAPPER)) { detach(li.querySelector('.' + PROGRESS_WRAPPER)); }
    }
    private onSelectFiles(args: MouseEvent | TouchEvent | DragEvent | ClipboardEvent): void {
        let targetFiles: File[];
        /* istanbul ignore next */
        if (args.type === 'drop') {
            const files: FileList = this.sortFilesList = (<DragEvent>args).dataTransfer.files;
            if (this.browserName !== 'msie' && this.browserName !== 'edge') {
                this.element.files = files;
            }
            if (files.length > 0) {
                targetFiles = this.sortFileList(files);
                this.renderSelectedFiles(args, targetFiles);
            }
        } else {
            targetFiles = [].slice.call((<HTMLInputElement>args.target).files);
            this.renderSelectedFiles(args, targetFiles);
        }
    }
    public sortFileList(filesData?: FileList): File[] {
        filesData = filesData ? filesData : this.sortFilesList;
        const files: FileList = filesData;
        const fileNames: string[] = [];
        for (let i: number = 0; i < files.length; i++) {
            fileNames.push(files[i as number].name);
        }
        const sortedFileNames: string[] = fileNames.sort();
        const sortedFilesData: File[] = [];
        for (const name of sortedFileNames) {
            for (let i: number = 0; i < files.length; i++) {
                if (name === files[i as number].name) {
                    sortedFilesData.push(files[i as number]);
                }
            }
        }
        return sortedFilesData;
    }
    private renderSelectedFiles(
        args: MouseEvent | TouchEvent | DragEvent | ClipboardEvent,
        // eslint-disable-next-line
        targetFiles: any, directory?: boolean, paste?: boolean): void {
        this.base64String = [];
        // eslint-disable-next-line
        let eventArgs: SelectedEventArgs = {
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
            this.parent.observer.notify(events.selected, eventArgs);
            return;
        }
        this.flag = true;
        let fileData: FileInfo[] = [];
        for (let i: number = 0; i < targetFiles.length; i++) {
            const file: File = directory ? targetFiles[i as number].file : targetFiles[i as number];
            this.updateInitialFileDetails(args, targetFiles, file, i, fileData, directory, paste);
        }
        eventArgs.filesData = fileData;
        if (this.allowedExtensions.indexOf('*') > -1) { this.allTypes = true; }
        if (!this.allTypes) { fileData = this.checkExtension(fileData); }
        this.parent.observer.notify(events.selected, eventArgs);
        eventArgs.cancel = true;
        this._internalRenderSelect(eventArgs, fileData);
    }
    private _internalRenderSelect(eventArgs: SelectedEventArgs, fileData: FileInfo[]): void {
        if (!eventArgs.cancel) {
            /* istanbul ignore next */
            this.currentRequestHeader = eventArgs.currentRequest;
            this.customFormDatas = eventArgs.customFormData;
            this.selectedFiles = this.selectedFiles.concat(fileData);
            this.btnTabIndex = this.disableKeyboardNavigation ? '-1' : '0';
            if (eventArgs.isModified && eventArgs.modifiedFilesData.length > 0) {
                for (let j: number = 0; j < eventArgs.modifiedFilesData.length; j++) {
                    for (let k: number = 0; k < fileData.length; k++) {
                        if (eventArgs.modifiedFilesData[j as number].id === fileData[k as number].id) {
                            eventArgs.modifiedFilesData[j as number].rawFile = fileData[k as number].rawFile;
                        }
                    }
                }
                const dataFiles: FileInfo[] = this.allTypes ? eventArgs.modifiedFilesData :
                    this.checkExtension(eventArgs.modifiedFilesData);
                this.updateSortedFileList(dataFiles);
                this.filesData = dataFiles;
                if (!this.isForm || this.allowUpload()) {
                    this.checkAutoUpload(dataFiles);
                }
            } else {
                this.createFileList(fileData, true);
                this.filesData = this.filesData.concat(fileData);
                if (!this.isForm || this.allowUpload()) {
                    this.checkAutoUpload(fileData);
                }
            }
            if (!isNOU(eventArgs.progressInterval) && eventArgs.progressInterval !== '') {
                this.progressInterval = eventArgs.progressInterval;
            }
            if ((this.filesData.length === this.actionCompleteCount) && this.flag) {
                this.flag = false;
            }
        }
    }
    private allowUpload(): boolean {
        let allowFormUpload: boolean = false;
        if (this.isForm && (!isNOU(this.asyncSettings.saveUrl) && this.asyncSettings.saveUrl !== '')) {
            allowFormUpload = true;
        }
        return allowFormUpload;
    }
    private checkAutoUpload(fileData: FileInfo[]): void {
        this.upload(fileData);
        this.removeActionButtons();
        this.checkActionButtonStatus();
    }
    private updateSortedFileList(filesData: FileInfo[]): void {
        const previousListClone: HTMLElement = createElement('div', { id: 'clonewrapper' });
        let added: number = -1;
        let removedList: HTMLElement[];
        if (this.listParent) {
            for (let i: number = 0; i < this.listParent.querySelectorAll('li').length; i++) {
                const liElement: HTMLElement = this.listParent.querySelectorAll('li')[i as number];
                previousListClone.appendChild(liElement.cloneNode(true));
            }
            removedList = <HTMLElement[] & NodeListOf<HTMLLIElement>>this.listParent.querySelectorAll('li');
            for (const item of removedList) {
                detach(item);
            }
            this.removeActionButtons();
            const oldList: HTMLElement[] = [].slice.call(previousListClone.childNodes);
            detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createParentUL();
            for (let index: number = 0; index < filesData.length; index++) {
                for (let j: number = 0; j < this.filesData.length; j++) {
                    if (this.filesData[j as number].name === filesData[index as number].name) {
                        this.listParent.appendChild(oldList[j as number]);
                        EventHandler.add(oldList[j as number].querySelector('.e-icons'), 'click', this.removeFiles, this);
                        this.fileList.push(oldList[j as number]);
                        added = index;
                    }
                }
                if (added !== index) { this.createFileList([filesData[index as number]]); }
            }
        } else { this.createFileList(filesData); }
    }
    private updateInitialFileDetails(args: MouseEvent | TouchEvent | DragEvent | ClipboardEvent,
        // eslint-disable-next-line
        targetFiles: any, file: File, i: number, fileData: FileInfo[], directory?: boolean, paste?: boolean): void {
        const fileName: string = directory ? targetFiles[i as number].path.substring(1, targetFiles[i as number].path.length) : paste ?
            getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name) : file.name;
        const fileDetails: FileInfo = {
            name: fileName,
            rawFile: file,
            size: file.size,
            status: 'Ready to upload',
            type: this.getFileType(file.name),
            validationMessages: this.validatedFileSize(file.size),
            statusCode: '1',
            id: getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name)
        };
        /* istanbul ignore next */
        if (paste) { fileDetails.fileSource = 'paste'; }
        fileDetails.status = fileDetails.validationMessages.minSize !== '' ? 'File size is too small' :
            fileDetails.validationMessages.maxSize !== '' ? 'File size is too large' : fileDetails.status;
        if (fileDetails.validationMessages.minSize !== '' || fileDetails.validationMessages.maxSize !== '') {
            fileDetails.statusCode = '0';
        }
        fileData.push(fileDetails);
    }
    private wireEvents(): void {
        EventHandler.add(this.element, 'change', this.onSelectFiles, this);
    }
    private unWireEvents(): void {
        EventHandler.remove(this.element, 'change', this.onSelectFiles);
    }
    public destroy(): void {
        this.unWireEvents();
        this.removeEventListener();
    }
}
