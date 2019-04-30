/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { Event, createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { SelectedEventArgs } from '../../src/index';

L10n.load({
    'en-US': {
       'uploader' : {
        'dropFilesHint' : ' '
         }
     }
});

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    selected : onupload,
    locale: 'en-US',
    allowedExtensions: '.png, .jpg, .jpeg'
});
uploadObj.appendTo('#fileupload')

function onupload(args: any){
    for(let i = 0; i< args.filesData.length ; i++){
    let liparentDiv = createElement('div',  { className: 'image-list'});
    let liImage = createElement('img',  { className: 'image'});
    liparentDiv.appendChild(liImage);
    readURL(liImage, args.filesData[i]);
    document.getElementById('preview').appendChild(liparentDiv);
    }
   args.cancel=true;
}

function readURL(liImage: HTMLElement, file: any) {
    let imgPreview: HTMLImageElement = liImage as HTMLImageElement;
    let imageFile: File = file.rawFile;
    let reader: FileReader = new FileReader();
    reader.addEventListener(
        'load', () => {
        imgPreview.src = reader.result as string;
    }, 
    false
);
    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
};
