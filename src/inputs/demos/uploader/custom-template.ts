/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { Event, detach, isNullOrUndefined, createElement, EventHandler  } from '@syncfusion/ej2-base';

let dropElement: HTMLElement = document.getElementsByClassName('control_wrapper')[0] as HTMLElement; let filesDetails : FileInfo[] = [];
let filesList: Element[] = [];
let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    }, dropArea: dropElement, selected: onFileSelect, progress: onFileUpload, success: onUploadSuccess,
    failure: onUploadFailed, removing: onFileRemove,
});
uploadObj.appendTo('#fileupload');
document.getElementById('browse').onclick = () => {
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click(); return false;
};
document.getElementById('clearbtn').onclick = () => {
    uploadObj.element.value = '';
    detach(document.getElementById('dropArea').querySelector('.upload-list-root')); filesDetails = []; filesList = [];
};
let parentElement : HTMLElement; let proxy : any; let progressbarContainer : HTMLElement;
function onFileSelect(args : any) : void  {
    if (isNullOrUndefined(document.getElementById('dropArea').querySelector('.upload-list-root'))) {
        parentElement = createElement('div', { className: 'upload-list-root' });
        parentElement.appendChild(createElement('ul', {className: 'ul-element' }));
        document.getElementById('dropArea').appendChild(parentElement);
    }
    for (let i : number = 0; i < args.filesData.length; i++) { formSelectedData(args.filesData[i], this); }
    filesDetails = filesDetails.concat(args.filesData);
    this.upload(args.filesData, true); args.cancel = true;
}
function formSelectedData ( selectedFiles : FileInfo, proxy: any ) : void {
    let liEle : HTMLElement = createElement('li',  { className: 'file-lists', attrs: {'data-file-name' : selectedFiles.name} });
    liEle.appendChild(createElement('span', {className: 'file-name ', innerHTML: selectedFiles.name }));
    liEle.appendChild(createElement('span', {className: 'file-size ', innerHTML: proxy.bytesToSize(selectedFiles.size) }));
    if (selectedFiles.statusCode === '1') {
        progressbarContainer = createElement('span', {className: 'progress-bar-container'});
        progressbarContainer.appendChild(createElement('progress', {className: 'progress', attrs: {value : '0', max : '100'}} ));
        liEle.appendChild(progressbarContainer);
    } else { liEle.querySelector('.file-name').classList.add('upload-fails'); }
    let closeIconContainer : HTMLElement = createElement('span', {className: 'e-icons close-icon-container'});
    EventHandler.add(closeIconContainer, 'click', removeFiles, proxy);
    liEle.appendChild(closeIconContainer); document.querySelector('.ul-element').appendChild(liEle);
    filesList.push(liEle);
}
function onFileUpload(args : any) : void {
    let li : Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    EventHandler.remove(li.querySelector('.close-icon-container'), 'click', removeFiles);
    let progressValue : number = Math.round((args.e.loaded / args.e.total) * 100);
    if (!isNaN(progressValue)) { li.getElementsByTagName('progress')[0].value = progressValue; }
}
function onUploadSuccess(args : any) : void {
    let spinnerElement: HTMLElement = document.getElementById('dropArea');
    let li : Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    if (!isNullOrUndefined(li.querySelector('.progress-bar-container'))) { detach(li.querySelector('.progress-bar-container')); }
    if (args.operation === 'upload') {
        li.querySelector('.file-name').classList.add('upload-success');
        li.querySelector('.close-icon-container').classList.add('delete-icon');
        (li.querySelector('.close-icon-container') as HTMLElement).onclick = () => {generateSpinner(this.uploadWrapper); };
        (li.querySelector('.close-icon-container') as HTMLElement).onkeydown = (e: any) => {
            if (e.keyCode === 13) { generateSpinner(e.target.closest('.e-upload')); }
        };
    }
    if (args.operation === 'remove') {
        filesDetails.splice(filesList.indexOf(li), 1);
        filesList.splice(filesList.indexOf(li), 1);
        detach(li);
        hideSpinner(spinnerElement);
        detach(spinnerElement.querySelector('.e-spinner-pane'));
    }
    EventHandler.add(li.querySelector('.close-icon-container'), 'click', removeFiles, this);
}
function generateSpinner(targetElement: HTMLElement): void {
    createSpinner({ target: targetElement, width: '25px' }); showSpinner(targetElement);
}
function onUploadFailed(args : any) : void {
    let li : Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    EventHandler.add(li.querySelector('.close-icon-container'), 'click', removeFiles, this);
    li.querySelector('.file-name ').classList.add('upload-fails');
    if (args.operation === 'upload') {detach(li.querySelector('.progress-bar-container')); }
}
function removeFiles(args : any) : void {
    if (!isNullOrUndefined(args.currentTarget)) {
        if (filesDetails[filesList.indexOf(args.currentTarget.parentElement)].statusCode === '2' ) {
            this.remove(filesDetails[filesList.indexOf(args.currentTarget.parentElement)]);
        } else  { onFileRemove(args); }
    }
}
function onFileRemove(args: any) : void {
    if (!isNullOrUndefined(args.currentTarget)) {
        if (filesDetails[filesList.indexOf(args.currentTarget.parentElement)].statusCode !== '2') {
            detach(args.currentTarget.parentElement);
        }
    }
    args.postRawFile = false;
}