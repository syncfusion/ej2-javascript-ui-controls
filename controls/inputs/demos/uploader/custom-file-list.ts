/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { Event, detach, isNullOrUndefined, createElement, EventHandler  } from '@syncfusion/ej2-base';

let uploadObj: Uploader = new Uploader({
    autoUpload: false,
    asyncSettings: {
        saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'        
    },
    selected: onFileSelect,
    progress : onFileUpload,
    success : onuploadSuccess,
    failure : onuploadFailed
});
uploadObj.appendTo('#customUI');

let parentElement : HTMLElement;
let ul: HTMLElement;
let proxy : any;

function onFileSelect(args : any) : void  {
    proxy = this;
    if ( isNullOrUndefined(document.getElementById('upload').querySelector('.upload-list-root'))) {
        parentElement = createElement('div', { className: 'upload-list-root' });
        ul = createElement('ul', {className: 'ul-element' });
        parentElement.appendChild(ul);
        document.getElementById('upload').appendChild(parentElement);
    }
    for (let i : number = 0; i < args.filesData.length; i++) {
        formSelectedData(args.filesData[i]);
    }
    this.filesData = this.filesData.concat(args.filesData);
    this.upload(args.filesData, true);
    args.cancel = true;
}

function formSelectedData ( selectedFiles : FileInfo ) : void {
    let liEle : HTMLElement = createElement('li',  { className: 'file-lists', attrs: {'data-file-name' : selectedFiles.name} });
    let fileNameContainer : HTMLElement = createElement('span', {className: 'file-name-container' });
    let fileName : HTMLElement = createElement('span', {className: 'file-name ' });
    fileName.innerHTML = selectedFiles.name;
    let fileSize : HTMLElement = createElement('span', {className: 'file-size ' });
    fileSize.innerHTML = proxy.bytesToSize(selectedFiles.size);
    liEle.appendChild(fileName);
    liEle.appendChild(fileSize);
    let fileStatusContainer : HTMLElement = createElement('span', {className: 'file-status-container' });
    let fileStatus : HTMLElement = createElement('span', {className: 'file-status'});
    fileStatusContainer.appendChild(fileStatus);
    let progressbarContainer : HTMLElement = createElement('span', {className: 'progress-bar-container'});
    let progressBar : HTMLElement = createElement('progress', {className: 'progress', attrs: {value : '0', max : '100'}} );
    progressbarContainer.appendChild(progressBar);
    let closeIconContainer : HTMLElement = createElement('span', {className: 'e-icons close-icon-container'});
    EventHandler.add(closeIconContainer, 'click', removeFiles, proxy);
    liEle.appendChild(fileStatusContainer);
    liEle.appendChild(progressbarContainer);
    liEle.appendChild(closeIconContainer);
    ul.appendChild(liEle);
    proxy.fileList.push(liEle);
}

function onFileUpload(args : any) : void {
    let li : Element = document.getElementById('upload').querySelector('[data-file-name="' + args.file.name + '"]');
    let progressValue : number = Math.round((args.e.loaded / args.e.total) * 100);
    li.getElementsByTagName('progress')[0].value = progressValue;
}

function onuploadSuccess(args : any): void {
    let li : Element = document.getElementById('upload').querySelector('[data-file-name="' + args.file.name + '"]');
    if (!isNullOrUndefined(li.querySelector('.progress-bar-container'))) {
        detach(li.querySelector('.progress-bar-container'));
    }
    if (args.operation === 'upload') {
        li.querySelector('.file-status').classList.add('upload-success');
        li.querySelector('.file-status').innerHTML = args.file.status;
        li.querySelector('.file-status-container').setAttribute('style', 'display: inline-block');
    }
    if (args.operation === 'remove') {
        let index: number = this.fileList.indexOf(li);
        this.fileList.splice(index, 1);
        this.filesData.splice(index, 1);
        detach(li);
    }
}

function onuploadFailed(args : any): void {
    let li : Element = document.getElementById('upload').querySelector('[data-file-name="' + args.file.name + '"]');
    li.querySelector('.file-status').innerHTML = args.file.status;
    if (args.operation === 'upload') {
        detach(li.querySelector('.progress-bar-container'));
        li.querySelector('.file-status-container').setAttribute('style', 'display: initial');
    }
}

function removeFiles(args : any): void {
    let index: any = proxy.fileList.indexOf(args.currentTarget.parentElement);
    return proxy.remove(proxy.filesData[index]);
}