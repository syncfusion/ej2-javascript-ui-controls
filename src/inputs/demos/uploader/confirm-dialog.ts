/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { Event } from '@syncfusion/ej2-base';

import {createElement} from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';

let removeFile: FileInfo[] = [];

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    removing: onremove

});
uploadObj.appendTo('#fileupload');

// Initialize Dialog component
let dialog: Dialog = new Dialog({
    content: 'Confirm to remove the file?',
    buttons: [{'click': () => { onClick() }, buttonModel: { content: 'OK', cssClass: 'e-flat'}},
        {'click': () => {dialog.hide(); }, buttonModel: { content: 'Cancel', cssClass: 'e-flat'} }],
    width: '250px',
    visible: false,
    target: '#container'
});
dialog.appendTo('#dialog');

function onClick(): void {
  dialog.hide();
  uploadObj.remove(removeFile[0], false, true);
  removeFile=[];
}

function onremove(args: any): void {
  args.cancel = true;
  removeFile.push(args.filesData);
  dialog.show();
}


