/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, ClearingEventArgs } from '../../src/uploader/uploader';
import { Event } from '@syncfusion/ej2-base';

let fileUploaded: boolean = false;

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    autoUpload: false
});
uploadObj.appendTo('#fileupload')

document.getElementById('extension').onclick = function () {
    uploadObj.allowedExtensions = '.pdf';
    uploadObj.dataBind();
}

document.getElementById('enabled').onclick = function () {
    if (uploadObj.enabled) {
        uploadObj.enabled = false;
        uploadObj.dataBind();
    } else {
        uploadObj.enabled = true;
        uploadObj.dataBind();
    }
}

document.getElementById('multiple').onclick = function () {
    if (uploadObj.multiple) {
        uploadObj.multiple = false;
        uploadObj.dataBind();
    } else {
        uploadObj.multiple = true;
        uploadObj.dataBind();
    }
}

document.getElementById('rtl').onclick = function () {
    if (uploadObj.enableRtl) {
        uploadObj.enableRtl = false;
        uploadObj.dataBind();
    } else {
        uploadObj.enableRtl = true;
        uploadObj.dataBind();
    }
}

document.getElementById('buttons').onclick = function () {
    uploadObj.buttons = { browse: 'Choose files', upload: 'Upload All', clear: 'Clear All' };
    uploadObj.dataBind();
}

document.getElementById('filelist').onclick = function () {
    if (uploadObj.showFileList) {
        uploadObj.showFileList = false;
        uploadObj.dataBind();
    } else {
        uploadObj.showFileList = true;
        uploadObj.dataBind();
    }
}

document.getElementById('files').onclick = function () {
    let preLoadFiles: any = [
        {name: 'Books', size: 500, type: '.png'},
        {name: 'Movies', size: 12000, type: '.pdf'},
        {name: 'Study materials', size: 500000, type: '.docx'},
    ];
    if (!fileUploaded) {
        uploadObj.files = preLoadFiles;
        fileUploaded = true;
        uploadObj.dataBind();
    }
}

document.getElementById('min').onclick = function () {
    uploadObj.minFileSize = 3000;
    uploadObj.dataBind();
}

document.getElementById('max').onclick = function () {
    uploadObj.maxFileSize = 1234500;
    uploadObj.clearing = function(args: ClearingEventArgs) {args.cancel = true;}
    uploadObj.dataBind();
}

document.getElementById('drop').onclick = function () {
    if (uploadObj.dropArea) {
        uploadObj.dropArea = null;
        uploadObj.dataBind();
        document.getElementById('droparea').style.display = 'none';
    } else {
        uploadObj.dropArea = document.getElementById('droparea');
        uploadObj.dataBind();
        document.getElementById('droparea').style.display = 'block';
    }
}



