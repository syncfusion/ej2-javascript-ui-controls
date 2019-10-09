import { FileManager } from '../../src/file-manager/base/file-manager';
import { DetailsView, NavigationPane } from '../../src/file-manager/layout/index';
import { Toolbar } from '../../src/file-manager/actions/toolbar';
import '../../node_modules/es6-promise/dist/es6-promise';

FileManager.Inject(DetailsView, Toolbar, NavigationPane);
// let hostUrl: string = 'https://ng2jq.syncfusion.com/ej2services/';
let hostUrl = 'http://localhost:62869/';
let feObj: FileManager = new FileManager({
    ajaxSettings: {
        url: hostUrl + 'api/FileAccess/FileOperations',
        uploadUrl: hostUrl +'api/FileAccess/Upload',
        downloadUrl: hostUrl +'api/FileAccess/Download',
        getImageUrl: hostUrl +'api/FileAccess/GetImage'
    }
});
feObj.appendTo('#file');