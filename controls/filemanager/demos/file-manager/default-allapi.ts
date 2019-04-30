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
    beforeFileLoad: (args: FileBeforeLoadEventArgs) => {
        addEventLog(args.module + ' beforeFileLoad event is triggered');
    },
    beforeFileOpen: (args: FileOpenEventArgs) => {
        addEventLog('The ' + (args.fileDetails as any)["name"] + ((<any>args.fileDetails).isFile ? ' file' : ' folder') + ' will be opened.');
    },
    beforeSend: (args: FileBeforeSendEventArgs) => {
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
        addEventLog(args.item.text + 'toolbar item is clicked');
    }
});
feObj.appendTo('#file');

function addEventLog(text: string) {
    let clog = document.getElementById('events');
    clog.innerHTML = text + '\n' + clog.innerHTML;
}