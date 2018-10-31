import { Uploader, RemovingEventArgs } from '../../src/uploader/uploader';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Chunk Upload auto pause resume
 */

let uploadObj: Uploader = new Uploader({
    autoUpload: false,
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
        chunkSize: 1024000
    },
    maxFileSize: 900000000,
    chunkFailure: onBeforefail,
    removing: onFileRemove
});
uploadObj.appendTo('#fileupload');
let  obj: any = (document as any).getElementById('fileupload').ej2_instances[0];
document.getElementsByClassName('e-upload')[0].addEventListener('click', (e: Event) => {
    let target: any = e.target as any;
    if (target.classList.contains('e-file-abort-btn')) {
        for (let i: number = 0; i < uploadObj.getFilesData().length; i++ ) {
            if (target.parentElement.getAttribute('data-file-name') === uploadObj.getFilesData()[i].name) {
                if(obj.filesData[i].statusCode == 4) {
                    obj.remove(obj.getFilesData()[i]);
                    }else {
                        setTimeout(function(){
                            obj.cancel(obj.filesData[i]);
                        }, 600);
                    }
            }
        }
    }
    }, false);
function onBeforefail(args: any): void {
    args.cancel = true;
let  obj: any = (document as any).getElementById('fileupload').ej2_instances[0];
    let clearInt:any = setInterval(function(): void {
        if (navigator.onLine && !isNullOrUndefined(obj.filesData[0]) && obj.filesData[0].statusCode == 4) {
            obj.resume(obj.filesData);
            clear();
  }  else {
    if (!isNullOrUndefined(obj.filesData[0]) && obj.filesData[0].statusCode == 3) {
    obj.pause(obj.filesData);
    }
  } }, 500);
  function clear(): void {
    clearInterval(clearInt);
}
}

function onFileRemove(args: RemovingEventArgs): void {
    args.postRawFile = false;
}