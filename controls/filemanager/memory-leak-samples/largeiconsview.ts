import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

import { FileManager  } from '../src/file-manager/base/file-manager';
import { NavigationPane } from '../src/file-manager/layout/index';
import { Toolbar } from '../src/file-manager/actions/toolbar';
import { DetailsView } from '../src/file-manager/layout/details-view';
import '../node_modules/es6-promise/dist/es6-promise';

FileManager.Inject(NavigationPane, DetailsView, Toolbar);
document.getElementById('render').addEventListener('click', renderFileManager);
document.getElementById('destroy').addEventListener('click', destoryFileManager);

let dateLarge1: number;
let dateLarge2: number;
let flagLarge: boolean = true;
let hostUrlLarge = 'https://ej2-aspcore-service.azurewebsites.net/';
let feObjLarge: FileManager;

function renderFileManager(): void {
    feObjLarge = new FileManager({
        ajaxSettings: {
            url: hostUrlLarge + 'api/FileManager/FileOperations',
            uploadUrl: hostUrlLarge +'api/FileManager/Upload',
            downloadUrl: hostUrlLarge +'api/FileManager/Download',
            getImageUrl: hostUrlLarge +'api/FileManager/GetImage'
        },
        allowMultiSelection: false,
        contextMenuSettings: {
            file: ['Open', 'Download', '|', 'Cut', 'Copy', '|', 'Delete', 'Rename', '|', 'Details', 'Custom'],
            folder: ['Open', 'Upload', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'NewFolder', '|', 'Details', 'Custom'],
            layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', 'Custom'],
            visible: true,
        },
        cssClass: 'custom',
        enablePersistence: true,
        navigationPaneSettings: {
            maxWidth: '600px',
            minWidth: '200px',
            visible: true,
        },
        searchSettings: {
            allowSearchOnTyping: false,
            filterType: 'startsWith',
            ignoreCase: true
        },
        showFileExtension: false,
        created: function () {
            dateLarge1 = new Date().getTime();
        },
        success: hide1,
    });
    feObjLarge.appendTo('#file');
}
function hide1(): void {
    if (flagLarge && dateLarge1) {
        dateLarge2 = new Date().getTime();
        document.getElementById('performanceTime').innerHTML = 'Time Taken: ' + (dateLarge2 - dateLarge1) + 'ms';
        flagLarge = false;
    }
}

function destoryFileManager(): void {
    if (feObjLarge && !feObjLarge.isDestroyed) {
        feObjLarge.destroy();
        feObjLarge = null;
    }
}