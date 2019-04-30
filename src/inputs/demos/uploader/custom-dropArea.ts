/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, RemovingEventArgs } from '../../src/uploader/uploader';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { Event, detach, isNullOrUndefined, createElement, EventHandler  } from '@syncfusion/ej2-base';

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    dropArea: document.getElementById('dropTarget'),
    template: '#uploaderTemplate',
    success: onUploadSuccess,
    failure: onUploadFailed,
    removing: onFileRemove,
    progress: onUploadInProgress,
    selected: onSelect,
    allowedExtensions: '.pdf, .png, .txt'
});
uploadObj.appendTo('#fileupload');

document.getElementById('browse').onclick = () => {
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click(); return false;
};

document.getElementsByClassName('e-upload')[0].addEventListener('click', (e: Event) => {onDeleteIconClick(e); }, false);

function onFileRemove(args: RemovingEventArgs) : void {
    args.postRawFile = false;
}

function onDeleteIconClick(e: Event): void {
let target: any = e.target as any;
if (target.classList.contains('e-file-delete-btn')) {
    for (let i: number = 0; i < uploadObj.getFilesData().length; i++ ) {
        if (target.parentElement.getAttribute('data-file-name') === uploadObj.getFilesData()[i].name) {
        uploadObj.remove(uploadObj.getFilesData()[i]);
        }
    }
} else if (target.classList.contains('e-file-remove-btn')) {
    detach (target.parentElement);
    }
}

function onSelect(args: any): void {
    let allowedTypes: string[] = ['pdf', 'png', 'txt'];
    let modifiedFiles: object[] = [];
    for (let file of args.filesData) {
        if (allowedTypes.indexOf(file.type.toLowerCase()) > -1) {
            modifiedFiles.push(file);
        }
    }
    if (modifiedFiles.length > 0) {
        args.isModified = true;
        args.modifiedFiles = modifiedFiles;
    } else { args.cancel = true; }
}

function onUploadSuccess (args: any) : void {
    let li: HTMLElement = getLiElement(args);
    li.querySelector('.upload-status').innerHTML = args.file.status;
    li.querySelector('.upload-status').classList.add('upload-success');
}

function onUploadFailed(args: any) : void {
    let li: HTMLElement = getLiElement(args);
    li.querySelector('.upload-status').innerHTML = args.file.status;
    li.querySelector('.upload-status').classList.add('upload-failed');
}

function onUploadInProgress(args: any) : void {
    let progressValue : string = Math.round((args.e.loaded / args.e.total) * 100) + '%';
    let li: HTMLElement = getLiElement(args);
    li.querySelector('.upload-status').innerHTML = args.file.status + '(' + progressValue + ' )';
}

function getLiElement(args : any) : HTMLElement {
    let liElements : NodeListOf<HTMLElement> = document.getElementsByClassName('e-upload')[0].querySelectorAll('.e-upload-files > li');
    let li : HTMLElement;
    for (let i: number = 0; i < liElements.length; i++) {
        if ( liElements[i].getAttribute('data-file-name') === args.file.name ) {
          li = liElements[i];
        }
    }
    return li;
}