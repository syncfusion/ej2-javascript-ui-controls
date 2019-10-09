import { Component, ViewEncapsulation } from '@angular/core';
import { RemovingEventArgs } from '@syncfusion/ej2-angular-inputs';

/**
 * Chunk Upload sample
 */
@Component({
    selector: 'app-chunk-upload',
    templateUrl: 'chunkupload.component.html',
    styleUrls: ['chunkupload.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ChunkUploadComponent {

    public path: Object = {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
        chunkSize: 500000
    };

    public onFileRemove(args: RemovingEventArgs): void {
        args.postRawFile = false;
    }
}
