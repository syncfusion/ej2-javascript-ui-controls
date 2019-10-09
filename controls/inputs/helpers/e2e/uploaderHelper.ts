import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class uploaderHelper extends TestHelper {
    // tslint:disable
    public id: string;
    public wrapperFn: Function;

    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn
        }
        return this;
    }

    selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }

    getElement() {
        return this.selector('#' + this.id);
    }

    getWrapperElement() {
        return this.selector('.e-upload.e-lib');
    }

    getSelectWrapperElement() {
        return this.selector('.e-upload.e-lib .e-file-select-wrap');
    }

    getButtonElement() {
        return this.selector('.e-upload.e-lib .e-file-select-wrap .e-css.e-btn');
    }

    getFileWrapperElement() {
        return this.selector('.e-upload.e-lib .e-file-select-wrap .e-file-select');
    }

    getInputElement() {
        return this.selector('.e-upload.e-lib .e-file-select-wrap .e-file-select .e-control.e-uploader.e-lib');
    }
    getDropElement() {
        return this.selector('.e-upload.e-lib .e-file-select-wrap .e-file-drop');
    }
    /* Auto upload*/

    getUploadedContainer() {
        return this.selector('.e-upload.e-lib .e-upload-files');
    }

    getUploadedSuccessElement() {
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list.e-upload-success');
    }
    
    getFileContainerElement() {
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-file-container');
    }

    getFileNameElement() {
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-file-container .e-file-name');
    }

    getFileTypeElement() {
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-file-container .e-file-type');
    }
    getFileSizeElement() {
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-file-container .e-file-size');
    }

    getFileStatusElement() {
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-file-container .e-file-status');
    }

    getDeleteIcon(){
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-icons.e-file-delete-btn');
    }

    /*sequence upload */

    getUploadFileElement(){
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list');
    }

    getFileRemoveIcon(){
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-icons.e-file-remove-btn');
    }

    getActionElements(){
        return this.selector('.e-upload.e-lib .e-upload-actions');
    }

    getClearActionElement(){
        return this.selector('.e-upload.e-lib .e-upload-actions .e-file-clear-btn');
    }

    getUploadActionElement(){
        return this.selector('.e-upload.e-lib .e-upload-actions .e-file-upload-btn');
    }

    getPlayActionElement(){
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-icons.e-file-play-btn');
    }

    getPauseActionElement(){
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-icons.e-file-pause-btn');
    }

    getFileAbortIcon(){
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-icons.e-file-abort-btn');
    }

    getFileReloadIcon(){
        return this.selector('.e-upload.e-lib .e-upload-files .e-upload-file-list .e-icons.e-file-reload-btn');
    }
}