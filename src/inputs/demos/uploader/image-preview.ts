/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, SelectedEventArgs } from '../../src/uploader/uploader';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { detach, Browser, createElement, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';

let dropElement: HTMLElement = document.getElementById('dropArea');
let uploadObj: Uploader = new Uploader({
    asyncSettings: { saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    dropArea: dropElement, selected: onSelect, progress: onFileUpload, success: onUploadSuccess,
    failure: onUploadFailed, allowedExtensions: '.jpg,.png', template: 'template'
});
uploadObj.appendTo('#fileupload'); let parentElement: HTMLElement; let progressbarContainer : HTMLElement;
if (Browser.isDevice) { document.getElementById('drop').style.padding = '0px 10%'; }
document.getElementById('browse').onclick = () => {
    document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click(); return false;
};
document.getElementById('clearbtn').onclick = () => {
    detach(dropElement.querySelector('ul'));
    (<any>uploadObj).filesData = []; (<any>uploadObj).fileList = [];
};
document.getElementById('uploadbtn').onclick = () => {
    if (dropElement.querySelector('ul') && uploadObj.getFilesData().length > 0) { uploadObj.upload(uploadObj.getFilesData()); }
};
function onSelect(args: SelectedEventArgs): void {
    if (!dropElement.querySelector('li')) { this.filesData = []; }
    if (isNullOrUndefined(document.getElementById('dropArea').querySelector('.e-upload-files'))) {
        parentElement = createElement('ul', { className: 'e-upload-files' });
        document.getElementsByClassName('e-upload')[0].appendChild(parentElement);
    }
    for (let i : number = 0; i < args.filesData.length; i++) { formSelectedData(args.filesData[i], this); }
    this.filesData = this.filesData.concat(args.filesData); args.cancel = true;
}

function formSelectedData (file : FileInfo, proxy: any): void {
    let liEle : HTMLElement = createElement('li',  {className: 'e-upload-file-list', attrs: {'data-file-name': file.name}});
    let imageTag: HTMLImageElement = <HTMLImageElement>createElement('IMG',  {className: 'upload-image', attrs: {'alt': 'Image'}});
    let wrapper: HTMLElement = createElement('span', {className: 'wrapper'});
    wrapper.appendChild(imageTag); liEle.appendChild(wrapper);
    liEle.appendChild(createElement('div', {className: 'name file-name', innerHTML: file.name, attrs: {'title': file.name}}));
    liEle.appendChild(createElement('div', {className: 'file-size', innerHTML: proxy.bytesToSize(file.size) }));
    let clearbtn: HTMLElement; let uploadbtn: HTMLElement;
    clearbtn = createElement('span', {id: 'removeIcon', className: 'e-icons e-file-remove-btn', attrs: {'title': 'Remove'}});
    EventHandler.add(clearbtn, 'click', removeFiles, proxy); liEle.setAttribute('title', 'Ready to Upload');
    uploadbtn = createElement('span', {className: 'e-upload-icon e-icons e-file-remove-btn', attrs: {'title': 'Upload'}});
    uploadbtn.setAttribute('id', 'iconUpload'); EventHandler.add(uploadbtn, 'click', uploadFile, proxy);
    progressbarContainer = createElement('progress', {className: 'progressbar', id: 'progressBar', attrs: {value: '0', max: '100'}});
    liEle.appendChild(clearbtn); liEle.appendChild(uploadbtn); liEle.appendChild(progressbarContainer);
    readURL(liEle, file); document.querySelector('.e-upload-files').appendChild(liEle); proxy.fileList.push(liEle);
}
function uploadFile(args: any): void {
    uploadObj.upload([this.filesData[this.fileList.indexOf(args.currentTarget.parentElement)]]);
}
function removeFiles(args: any): void {
    let statusCode: string = this.filesData[this.fileList.indexOf(args.currentTarget.parentElement)].statusCode;
    if (statusCode === '2' || statusCode === '1') {
        this.remove(this.filesData[this.fileList.indexOf(args.currentTarget.parentElement)]);
        uploadObj.element.value = '';
    }
}
function onFileUpload(args : any) : void {
    let li : Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    let iconEle: HTMLElement = li.querySelector('#iconUpload') as HTMLElement;
    iconEle.style.cursor = 'not-allowed'; iconEle.classList.add('e-uploaded');
    EventHandler.remove(li.querySelector('#iconUpload'), 'click', uploadFile);
    let progressValue : number = Math.round((args.e.loaded / args.e.total) * 100);
    if (!isNaN(progressValue) && li.querySelector('.progressbar')) {
        li.getElementsByTagName('progress')[0].value = progressValue;
    }
}
function onUploadSuccess(args : any) : void {
    let spinnerElement: HTMLElement = document.getElementById('dropArea');
    let li : HTMLElement = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    if (li && !isNullOrUndefined(li.querySelector('.progressbar'))) {
        (li.querySelector('.progressbar') as HTMLElement).style.visibility = 'hidden';
    }
    if (args.operation === 'upload') {
        EventHandler.remove(li.querySelector('#iconUpload'), 'click', uploadFile);
        (li.querySelector('.file-name') as HTMLElement).style.color = 'green';
        (li.querySelector('.e-icons') as HTMLElement).onclick = () => { generateSpinner(this.uploadWrapper); };
    } else {
        if (li) { detach(li); }
        hideSpinner(spinnerElement); detach(spinnerElement.querySelector('.e-spinner-pane'));
    }
    li.setAttribute('title', args.e.currentTarget.statusText);
}
function generateSpinner(targetElement: HTMLElement): void {
    createSpinner({ target: targetElement, width: '25px' }); showSpinner(targetElement);
}
function onUploadFailed(args : any) : void {
    let li : Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    (li.querySelector('.file-name') as HTMLElement).style.color = 'red'; li.setAttribute('title', args.e.currentTarget.statusText);
    if (args.operation === 'upload') {
        EventHandler.remove(li.querySelector('#iconUpload'), 'click', uploadFile);
        (li.querySelector('.progressbar') as HTMLElement).style.visibility = 'hidden';
    }
}
function readURL(li: HTMLElement, args: any): void {
    let preview: HTMLImageElement = li.querySelector('.upload-image');
    let file: File = args.rawFile; let reader: FileReader = new FileReader();
    reader.addEventListener('load', () => { preview.src = reader.result as string; }, false);
    if (file) { reader.readAsDataURL(file); }
}