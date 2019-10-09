import '../../../node_modules/es6-promise/dist/es6-promise';
import { FileManager } from '../../../src/file-manager/base/file-manager';

 let hostUrl: string = 'https://ng2jq.syncfusion.com/ej2services/';
//let hostUrl = 'http://localhost:62869/';
let feObj: FileManager = new FileManager({
    ajaxSettings: {
        url: hostUrl + 'api/FileManager/FileOperations',
        uploadUrl: hostUrl +'api/FileManager/Upload',
        downloadUrl: hostUrl +'api/FileManager/Download',
        getImageUrl: hostUrl +'api/FileManager/GetImage'
    }
});
feObj.appendTo('#file');