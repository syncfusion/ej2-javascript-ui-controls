import { FileManager } from '../../src/file-manager/base/file-manager';
import { DetailsView, NavigationPane } from '../../src/file-manager/layout/index';
import { Toolbar } from '../../src/file-manager/actions/toolbar';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { FileLoadEventArgs } from '../../src';
import { getValue, select } from '@syncfusion/ej2-base';

FileManager.Inject(DetailsView, Toolbar, NavigationPane);
// let hostUrl: string = 'https://ng2jq.syncfusion.com/ej2services/';
let hostUrl = 'http://localhost:62869/';
let fileObj: FileManager = new FileManager({
    ajaxSettings: {
        url: hostUrl + 'api/FileManager/FileOperations',
        uploadUrl: hostUrl + 'api/FileManager/Upload',
        downloadUrl: hostUrl + 'api/FileManager/Download',
        getImageUrl: hostUrl + 'api/FileManager/GetImage'
    },
    created: () => { addTooltip(); },
    fileLoad: (args: FileLoadEventArgs) => {
        //Native tooltip customization to display additonal information in new line
        let target: Element = args.element;
        if (args.module==='DetailsView') {
            let ele: Element = select('[title]', args.element);
            let title: string = getValue('name', args.fileDetails) +
                '\n' + getValue('dateModified', args.fileDetails);
            ele.setAttribute('title', title);
        } else if (args.module==='LargeIconsView') {
            let title: string = getValue('name', args.fileDetails) +
                '\n' + getValue('dateModified', args.fileDetails);
            target.setAttribute('title', title);
        }
    }
});
fileObj.appendTo('#file');

//Tooltip component to use a custom tooltip
function addTooltip() {
    let tooltip: Tooltip = new Tooltip({
        target: '#' + fileObj.element.id + '_toolbar [title]',
        beforeRender: onTooltipBeforeRender
    });
    tooltip.appendTo('#' + fileObj.element.id + '_toolbar');
}

function onTooltipBeforeRender(args: TooltipEventArgs) {
    let buttonId: string = select('button', args.target).id;
    let description: string = '';
    switch (buttonId) {
        case fileObj.element.id + '_tb_newfolder':
            description = 'Create a new folder';
            break;
        case fileObj.element.id + '_tb_upload':
            description = 'Upload new files';
            break;
        case fileObj.element.id + '_tb_cut':
            description = 'Cut files and folders from the current location';
            break;
        case fileObj.element.id + '_tb_copy':
            description = 'Copy files and folders from the current location';
            break;
        case fileObj.element.id + '_tb_paste':
            description = 'Paste files and folders in the current location';
            break;
        case fileObj.element.id + '_tb_delete':
            description = 'Delete selected files and folders';
            break;
        case fileObj.element.id + '_tb_download':
            description = 'Download selected files and folders';
            break;
        case fileObj.element.id + '_tb_rename':
            description = 'Rename selected file or folder';
            break;
        case fileObj.element.id + '_tb_sortby':
            description = 'Change the file sorting order';
            break;
        case fileObj.element.id + '_tb_refresh':
            description = 'Refresh the current location';
            break;
        case fileObj.element.id + '_tb_selection':
            description = 'Following items are currently selected:';
            for (let i: number = 0; i < fileObj.selectedItems.length; i++) {
                description = description + '</br>' + fileObj.selectedItems[i];
            }
            break;
        case fileObj.element.id + '_tb_view':
            description = 'Switch the layout view';
            break;
        case fileObj.element.id + '_tb_details':
            description = 'Get the details of the seletced items';
            break;
        default:
            description = '';
            break;
    }
    this.content = args.target.getAttribute('title') + '</br>' + description;
}