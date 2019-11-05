import { Uploader, RemovingEventArgs } from '../../src/uploader/uploader';
import { Event, detach } from '@syncfusion/ej2-base';

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: ''
    },
    dropArea: document.getElementById('dropTarget'),
    template: '#uploaderTemplate',
    autoUpload: false,
    success: onUploadSuccess,
    failure: onUploadFailed,
    removing: onFileRemove,
    progress: onUploadInProgress,
    selected: onSelect,
    allowedExtensions: '.pdf, .png, .txt, .docx'
});
uploadObj.appendTo('#fileupload');

let uploadObj1: Uploader = new Uploader({
    dropArea: document.getElementById('dropTarget'),
    template: '#fileTemplate',
    removing: onFileRemove,
    selected: onSelect,
    allowedExtensions: '.pdf, .png, .txt, .docx'
});
uploadObj1.appendTo('#fileupload1');

document.getElementsByClassName('e-upload')[0].addEventListener('click', (e: Event) => {onDeleteIconClick(e); }, false);

document.getElementsByClassName('e-upload')[1].addEventListener('click', (e: Event) => {onDeleteIconClick1(e); }, false);

function onFileRemove(args: RemovingEventArgs) : void {
    args.postRawFile = false;
}

function onDeleteIconClick(e: Event): void {
    let target: any = e.target as any;
    if (target.classList.contains('e-file-remove-btn')) {
        let index: number = uploadObj.fileList.indexOf(target.parentElement);
        let data = uploadObj.getFilesData(index);
        uploadObj.remove(data);
    }
}

function onDeleteIconClick1(e: Event): void {
    let target: any = e.target as any;
    if (target.classList.contains('e-file-remove-btn')) {
        let index: number = uploadObj1.fileList.indexOf(target.parentElement);
        let data = uploadObj1.getFilesData(index);
        uploadObj1.remove(data);
    }
}

function onSelect(args: any): void {
    let allowedTypes: string[] = ['pdf', 'png', 'txt', 'docx'];
    let modifiedFiles: object[] = [];
    for (let file of args.filesData) {
        if (allowedTypes.indexOf(file.type.toLowerCase()) > -1) {
            modifiedFiles.push(file);
        }
    }
    if (modifiedFiles.length > 0) {
        args.isModified = true;
        args.modifiedFiles = modifiedFiles;
    }
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