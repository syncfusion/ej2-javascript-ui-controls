/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { Event } from '@syncfusion/ej2-base';

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'    
    },
    autoUpload: false

});
uploadObj.appendTo('#fileupload')

document.getElementById('remove').onclick = function () {
    let filesData: any = uploadObj.getFilesData();
    uploadObj.remove(filesData);
}

document.getElementById('remove1').onclick = function () {
    let filesData: any = uploadObj.getFilesData();
    uploadObj.remove(filesData[0]);
}

document.getElementById('upload').onclick = function () {
    let filesData: any = uploadObj.getFilesData();
    uploadObj.upload(filesData);
}

document.getElementById('upload1').onclick = function () {
    let filesData: any = uploadObj.getFilesData();
    uploadObj.upload([filesData[0]]);
}

document.getElementById('getfile').onclick = function () {
    console.log(uploadObj.getFilesData());
    alert('check the data in console page');

}

document.getElementById('clear').onclick = function () {
    uploadObj.clearAll();
}

document.getElementById('destroy').onclick = function () {
    uploadObj.destroy();
}




