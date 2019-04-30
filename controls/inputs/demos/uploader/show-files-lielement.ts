import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

import { Uploader, RemovingEventArgs, RenderingEventArgs } from '../../src/uploader/uploader';
import { createElement } from '@syncfusion/ej2-base';

/**
 * Uploader showfileslielement sample
 */

let dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;
// Initialize the uploader component
let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    removing: onFileRemove,
    dropArea: dropElement,
    autoUpload: false,
    fileListRendering: onLiElementCreated
});
uploadObj.appendTo('#fileupload');

function onFileRemove(args: RemovingEventArgs) : void {
    args.postRawFile = false;
}

function onLiElementCreated(args: RenderingEventArgs): void {
    let uploadEle : HTMLElement = createElement('button', {className: 'e-btn', id: 'uploadBtn'});
    let removeEle : HTMLElement = createElement('button', {className: 'e-btn', id: 'removeBtn'});
    uploadEle.innerHTML = "upload";
    removeEle.innerHTML = "remove";
    uploadEle.addEventListener("click", function(arg){
        uploadObj.upload(uploadObj.getFilesData()[args.index]);
    })
    removeEle.addEventListener("click", function(){
        uploadObj.remove(uploadObj.getFilesData()[args.index]);
    })
    args.element.appendChild(uploadEle);
    args.element.appendChild(removeEle);
}
