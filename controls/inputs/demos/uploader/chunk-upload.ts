import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { Uploader } from '../../src/uploader/uploader';
/**
 * Chunk Uploade sample
 */

let uploadObj: Uploader = new Uploader({
    autoUpload: false,
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
        chunkSize: 102400
    }
});
uploadObj.appendTo('#fileupload');
 // initialize check box component
 let checkBoxObj: CheckBox = new CheckBox({
    label: 'Enable Auto Upload',
    change: (args: ChangeEventArgs) => {
        uploadObj.autoUpload = args.checked;
        uploadObj.clearAll();
    }
});
checkBoxObj.appendTo('#checkAutoUpload');

