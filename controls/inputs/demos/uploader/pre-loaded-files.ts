/**
 * Default Uploader sample
 */
import { Uploader } from '../../src/uploader/uploader';
import {FilesPropModel} from '../../src/uploader/uploader-model';

let preLoadFiles: FilesPropModel[] = [
    {name: 'Books', size: 500, type: '.png'},
    {name: 'Movies', size: 12000, type: '.pdf'},
    {name: 'Study materials', size: 500000, type: '.docx'},
];
let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    autoUpload: false,
    files: preLoadFiles
});
uploadObj.appendTo('#fileupload')





