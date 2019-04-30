import { Component, ViewChild } from '@angular/core';
import { ToastComponent } from '@syncfusion/ej2-angular-notifications';

/**
 * Template Toast
 */
@Component({
    selector: 'app-toast',
    templateUrl: 'template.component.html',
    styleUrls: ['template.component.css']
})

export class TemplateComponent {
    @ViewChild('toast') public toastObj: ToastComponent;
    public position: Object = { X: 'Center' };
  
    public onCreate(): void {
        setTimeout(() => {
            this.toastObj.show();
        }, 200);
    }
}