import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

/**
 * Default Uploader Default Component
 */
@Component({
    selector: 'app-auto-upload',
    templateUrl: 'autoupload.component.html',
    styleUrls: ['autoupload.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DefaultUploaderComponent {
    @ViewChild('defaultupload')

    public path: Object = {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    };    
}
