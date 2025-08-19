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

let date1: number;
let date2: number;
let flag: boolean = true;
let hostUrl = 'https://ej2-aspcore-service.azurewebsites.net/';
let feObj: FileManager;

function renderFileManager(): void {
    feObj = new FileManager({
        ajaxSettings: {
            url: hostUrl + 'api/FileManager/FileOperations',
            uploadUrl: hostUrl +'api/FileManager/Upload',
            downloadUrl: hostUrl +'api/FileManager/Download',
            getImageUrl: hostUrl +'api/FileManager/GetImage'
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
        detailsViewSettings: {
            columnResizing: false,
            columns: [{ field: 'name', headerText: 'Name', minWidth: 120, width: 'auto', headerTextAlign: 'Left',
                template: '<span class="e-fe-text">${name}</span>' },
                { field: 'dateModified', headerText: 'Date Modified', minWidth: 50, width: '190', headerTextAlign: 'Right', textAlign: 'Right' },
                { field: 'size', headerText: 'Size', minWidth: 50, width: '110', headerTextAlign: 'Right', textAlign: 'Right' }],
        },
        view: 'Details',
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
            date1 = new Date().getTime();
        },
        success: hide,
    });
    feObj.appendTo('#file1');
}
function hide(): void {
    if (flag && date1) {
        date2 = new Date().getTime();
        document.getElementById('performanceTime').innerHTML = 'Time Taken: ' + (date2 - date1) + 'ms';
        flag = false;
    }
}

function destoryFileManager(): void {
    if (feObj && !feObj.isDestroyed) {
        feObj.destroy();
        feObj = null;
    }
}
