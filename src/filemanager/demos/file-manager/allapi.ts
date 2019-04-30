import { FileManager } from '../../src/file-manager/base/file-manager';
import { NavigationPane, DetailsView } from '../../src/file-manager/layout/index';
import { Toolbar } from '../../src/file-manager/actions/toolbar';
import {
    FileBeforeSendEventArgs, FileOpenEventArgs, FileSelectEventArgs, FileMenuClickEventArgs, FileMenuOpenEventArgs,
    FileToolbarClickEventArgs, FileOnSuccessEventArgs, FileOnErrorEventArgs, FileBeforeLoadEventArgs
} from '../../src/file-manager/base/interface';
import '../../node_modules/es6-promise/dist/es6-promise';

FileManager.Inject(NavigationPane, DetailsView, Toolbar);

let feObj: FileManager = new FileManager({
    ajaxSettings: {
        url: 'http://localhost:59302/api/FileManager/FileOperations',
        uploadUrl: 'http://localhost:59302/api/FileManager/Upload',
        downloadUrl: 'http://localhost:59302/api/FileManager/Download',
        getImageUrl: 'http://localhost:59302/api/FileManager/GetImage'
    },
    // allowMultiSelection: false,
    // contextMenuSettings: {
    //     file: ['Open', 'Download', '|', 'Cut', 'Copy', '|', 'Delete', 'Rename', '|', 'Details', 'Custom'],
    //     folder: ['Open', 'Upload', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'NewFolder', '|', 'Details', 'Custom'],
    //     layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll', 'Custom'],
    //     visible: true,
    // },
    cssClass: 'custom',
    // enablePersistence: true,
    // enableRtl: true,
    // gridSettings: {
    //     columnResizing: false,
    //     columns: [{ field: 'name', headerText: 'Name', minWidth: 120, width: 'auto', headerTextAlign: 'Left',
    //         template: '<span class="e-fe-text">${name}</span>' },
    //         { field: 'dateModified', headerText: 'Date Modified', minWidth: 50, width: '190', headerTextAlign: 'Right', textAlign: 'Right' },
    //         { field: 'size', headerText: 'Size', minWidth: 50, width: '110', headerTextAlign: 'Right', textAlign: 'Right' }],
    // },
    // view: 'Details',
    // navigationPaneSettings: {
    //     maxWidth: '600px',
    //     minWidth: '200px',
    //     visible: false,
    // },
    // searchSettings: {
    //     allowSearchOnTyping: false,
    //     filterType: 'startWith',
    //     ignoreCase: true
    // },
    // showFileExtension: false,
    // navigationPaneSettings: { visible: false },
    beforeFileLoad: (args: FileBeforeLoadEventArgs) => {
        if ((args.fileDetails as any).hasChild) {
            var rowDiv = document.createElement('span');
            rowDiv.className += 'new';
            if (args.module === 'TreeView') {
                args.element.querySelector('.e-list-text').appendChild(rowDiv);
            } else if (args.module === 'Grid') {
                args.element.querySelector('.e-fe-text').appendChild(rowDiv);
            } else {
                args.element.querySelector('.e-list-icon').appendChild(rowDiv);
            }
        }
    },
    beforeFileOpen: (args: FileOpenEventArgs) => {
        addEventLog('The ' + (args.fileDetails as any)["name"] + ((<any>args.fileDetails).isFile ? ' file' : ' folder') + ' will be opened.');
    },
    beforeSend: (args: FileBeforeSendEventArgs) => {
        (args.ajaxSettings as any).onSuccess = function () {
            addEventLog("Success");
        };
        addEventLog(args.action + ' beforeSend event is triggered');
    },
    fileSelect: (args: FileSelectEventArgs) => {
        addEventLog(args.action + 'ed: ' + (args.fileDetails as any)["name"]);
    },
    menuClick: (args: FileMenuClickEventArgs) => {
        addEventLog('"' + args.item.text + '" menu item is clicked');
    },
    menuOpen: (args: FileMenuOpenEventArgs) => {
        addEventLog('context menu will be opened');
    },
    onSuccess: (args: FileOnSuccessEventArgs) => {
        addEventLog('Success');
    },
    onError: (args: FileOnErrorEventArgs) => {
        addEventLog('Service error');
    },
    toolbarClick: (args: FileToolbarClickEventArgs) => {
        if (args.item && args.item.text == "Custom tool") {
            window.alert("Custom tool is clicked");
        }
        addEventLog((args.fileDetails as any)["name"] + 'toolbar item is clicked');
    }
});
feObj.appendTo('#file');

function addEventLog(text: string) {
    let clog = document.getElementById('events');
    clog.innerHTML = text + '\n' + clog.innerHTML;
}