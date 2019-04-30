import '../../node_modules/es6-promise/dist/es6-promise';
import { FileManager } from '../../src/file-manager/base/file-manager';

let feObj: FileManager = new FileManager({
    ajaxSettings: {
        url: 'http://localhost:59302/api/FileManager/FileOperations',
        uploadUrl: 'http://localhost:59302/api/FileManager/Upload',
        downloadUrl: 'http://localhost:59302/api/FileManager/Download',
        getImageUrl: 'http://localhost:59302/api/FileManager/GetImage'
    }
});
feObj.appendTo('#file');