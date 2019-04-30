/**
 * Default Uploader sample
 */
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { Event } from '@syncfusion/ej2-base';

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'    
    },
    minFileSize: 15000,
    maxFileSize: 3000000
});
uploadObj.appendTo('#fileupload')