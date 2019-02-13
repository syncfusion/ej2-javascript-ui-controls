import { Component, ViewChild } from '@angular/core';
import { ToastComponent } from '@syncfusion/ej2-angular-notifications';

/**
 * Position Toast
 */
@Component({
    selector: 'app-toast',
    templateUrl: 'position.component.html',
    styleUrls: ['position.component.css']
})

export class PositionComponent {
    @ViewChild('toast') public toastObj: ToastComponent;
    public position: Object = { X: 'Center' };
  
    public onCreate(): void {
      setTimeout(() => {
        this.toastObj.show();
      }, 200);
    }
}