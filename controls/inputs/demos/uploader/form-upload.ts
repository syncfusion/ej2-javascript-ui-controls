import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);

import { Uploader, RemovingEventArgs } from '../../src/uploader/uploader';
import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';

/**
 * Uploader default functionalities sample
 */

    let dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;
    // Initialize the uploader component
    let uploadObj: Uploader = new Uploader({
        removing: onFileRemove,
        dropArea: dropElement,
        allowedExtensions: '.pdf, .docx'
    });
    uploadObj.appendTo('#fileupload');

    let uploadObj1: Uploader = new Uploader({
        asyncSettings: {
            saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        },
        removing: onFileRemove,
        dropArea: dropElement,
        allowedExtensions: '.pdf, .docx'
    });
    uploadObj1.appendTo('#fileupload1');

    function onFileRemove(args: RemovingEventArgs) : void {
        args.postRawFile = false;
    }
    // initialize check box component
    let checkBoxObj: CheckBox = new CheckBox({
        checked: true,
        label: 'Auto Upload',
        change: (args: ChangeEventArgs) => {
            uploadObj.autoUpload = args.checked;
            uploadObj.clearAll();
        }
    });
    checkBoxObj.appendTo('#checkAutoUpload');
    document.getElementById("switchTheme").addEventListener("change", switch_theme);

function switch_theme(): void {
    document.body.style.background = "none";
    let theme: any = ( document.getElementById("switchTheme") as HTMLInputElement).value;
    let filename: string;
    if ( theme == 'Material') {
        filename = './styles/material.css';
    } else if (theme == 'Fabric') {
        filename = './styles/fabric.css';
    } else if (theme == 'Highcontrast') {
        filename = './styles/highcontrast.css';
        document.body.style.background = "black";
    } else if (theme == 'Bootstrap4'){
        filename = './styles/bootstrap4.css';
    } else if (theme == 'Bootstrap'){
        filename = './styles/bootstrap.css';
    };
    loadcssfile(filename);
}
function loadcssfile( filename: string): void {
    let fileref: any = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    (document.getElementsByTagName("head")[0]).querySelector('link').remove();
    document.getElementsByTagName("head")[0].appendChild(fileref)
}
