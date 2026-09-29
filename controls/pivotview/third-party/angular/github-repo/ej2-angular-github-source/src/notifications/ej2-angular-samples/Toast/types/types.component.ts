import { Component, ViewChild } from '@angular/core';
import { ToastComponent } from '@syncfusion/ej2-angular-notifications';

/**
 * Types Toast
 */
@Component({
    selector: 'app-toast',
    templateUrl: 'types.component.html',
    styleUrls: ['types.component.css']
})

export class TypesComponent {
    @ViewChild('toast') public toastObj: ToastComponent;
    public position: object = { X: 'Right' };
    public toastData: { [key: string]: Object }[] = [
        {
            title: 'Warning!',
            content: 'There was a problem with your network connection.',
            cssClass: 'e-toast-warning',
            icon: 'e-warning toast-icons'
        },
        {
            title: 'Success!',
            content: 'Your message has been sent successfully.',
            cssClass: 'e-toast-success',
            icon: 'e-success toast-icons'
        },
        {
            title: 'Error!',
            content: 'A problem has been occurred while submitting your data.',
            cssClass: 'e-toast-danger',
            icon: 'e-error toast-icons'
        },
        {
            title: 'Information!',
            content: 'Please read the comments carefully.',
            cssClass: 'e-toast-info',
            icon: 'e-info toast-icons'
        }
    ];

    public onCreate(): void {
        setTimeout(function () {
            this.toastObj.show(this.toastData[0]);
        }.bind(this), 200);
        setTimeout(function () {
            this.toastObj.show(this.toastData[1]);
        }.bind(this), 400);
        setTimeout(function () {
            this.toastObj.show(this.toastData[2]);
        }.bind(this), 600);
        setTimeout(function () {
            this.toastObj.show(this.toastData[3]);
        }.bind(this), 800);
    }
}