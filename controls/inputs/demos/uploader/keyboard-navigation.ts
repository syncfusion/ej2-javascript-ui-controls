
import { Uploader, FileInfo, AsyncSettings } from '../../src/uploader/uploader';
import { Event } from '@syncfusion/ej2-base';

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    autoUpload: false
});
uploadObj.appendTo('#fileupload')


