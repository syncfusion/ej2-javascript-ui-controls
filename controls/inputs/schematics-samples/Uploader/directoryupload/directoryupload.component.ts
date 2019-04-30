import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';

/**
 * Directory Uploader
 */
@Component({
    selector: 'app-directory-upload',
    templateUrl: 'directoryupload.component.html',
    styleUrls: ['directoryupload.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DefaultUploaderComponent {
    @ViewChild('fileupload')
    public uploadObj: UploaderComponent;

    public path: Object = {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    };
}
