import { Component, ViewChild } from '@angular/core';
import { ToastComponent } from '@syncfusion/ej2-angular-notifications';

/**
 * Default Toast
 */
@Component({
    selector: 'app-toast',
    templateUrl: 'default.component.html',
    styleUrls: ['default.component.css']
})

export class DefaultComponent {
    @ViewChild('toast') public toastObj: ToastComponent;
    public position: Object = { X: 'Right' };
  
    public onCreate(): void {
      setTimeout(() => {
        this.toastObj.show();
      }, 200);
    }
}