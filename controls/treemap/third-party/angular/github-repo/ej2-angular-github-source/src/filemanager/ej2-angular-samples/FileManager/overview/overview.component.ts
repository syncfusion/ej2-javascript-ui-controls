import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.css'],
})
export class AppComponent {
  public hostUrl: string = 'https://ng2jq.syncfusion.com/ej2services/';
  public ajaxSettings: object = {
    url: this.hostUrl + 'api/FileManager/FileOperations',
    getImageUrl: this.hostUrl + 'api/FileManager/GetImage',
    uploadUrl: this.hostUrl + 'api/FileManager/Upload',
    downloadUrl: this.hostUrl + 'api/FileManager/Download'
  };

}