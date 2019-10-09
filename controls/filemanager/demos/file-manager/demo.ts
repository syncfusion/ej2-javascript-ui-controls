import { FileManager } from '../../src/file-manager/base/file-manager';
import { DetailsView, NavigationPane } from '../../src/file-manager/layout/index';
import { Toolbar } from '../../src/file-manager/actions/toolbar';
import '../../node_modules/es6-promise/dist/es6-promise';

FileManager.Inject(DetailsView, Toolbar, NavigationPane);
// let hostUrl: string = 'https://ng2jq.syncfusion.com/ej2services/';
let hostUrl = 'http://localhost:62869/';
let feObj: FileManager = new FileManager({
    ajaxSettings: {
        url: hostUrl + 'api/FileManager/FileOperations',
        uploadUrl: hostUrl +'api/FileManager/Upload',
        downloadUrl: hostUrl +'api/FileManager/Download',
        getImageUrl: hostUrl +'api/FileManager/GetImage'
    }
});
feObj.appendTo('#file');

let feObj1: FileManager = new FileManager({
    ajaxSettings: {
        url: 'https://ej2services.syncfusion.com/production/web-services/api/FileManager/FileOperations',
        uploadUrl: 'https://ej2services.syncfusion.com/production/web-services/api/FileManager/Upload',
        downloadUrl: 'https://ej2services.syncfusion.com/production/web-services/api/FileManager/Download',
        getImageUrl: 'https://ej2services.syncfusion.com/production/web-services/api/FileManager/GetImage'
    }
});
feObj1.appendTo('#file1');