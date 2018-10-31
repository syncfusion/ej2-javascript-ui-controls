/**
 * Customize Uploader progress bar
 */
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { Event } from '@syncfusion/ej2-base';

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'    
    },
    autoUpload: false,
    selected : onFilesSelect
});
uploadObj.appendTo('#fileupload')


function onFilesSelect(args : any) {
    args.progressInterval = '10';
}