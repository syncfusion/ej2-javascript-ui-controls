import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UploaderComponent, SelectedEventArgs, FileInfo } from '@syncfusion/ej2-angular-inputs';

/**
 * Default Uploader Validation Component
 */
@Component({
    selector: 'app-validation',
    templateUrl: 'validation.component.html',
    styleUrls: ['validation.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ValidateUploaderComponent {
    @ViewChild('fileupload')
    public uploadObj: UploaderComponent;

    public path: Object = {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    };

    public allowExtensions: string = '.doc, .docx, .xls, .xlsx';

    public onSelected(args : SelectedEventArgs) : void {
        args.filesData.splice(5);
        let filesData : FileInfo[] = this.uploadObj.getFilesData();
        let allFiles : FileInfo[] = filesData.concat(args.filesData);
        if (allFiles.length > 5) {
            for (let i : number = 0; i < allFiles.length; i++) {
                if (allFiles.length > 5) {
                    allFiles.shift();
                }
            }
            args.filesData = allFiles;
            args.modifiedFilesData = args.filesData;
        }
        args.isModified = true;
    }
}