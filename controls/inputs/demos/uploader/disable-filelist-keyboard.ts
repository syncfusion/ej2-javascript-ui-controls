import { Uploader } from '../../src/uploader/uploader';
import { createElement } from '@syncfusion/ej2-base';

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    allowedExtensions: '.zip, .docx',
    autoUpload: false,
    selected: function() {
        //args.disableKeyboardNavigation = true;
    },
    fileListRendering: function(args) {
        let t = createElement('input');
        args.element.appendChild(t);
    }
});
uploadObj.appendTo('#fileupload');
