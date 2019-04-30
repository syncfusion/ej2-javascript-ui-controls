import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';

/**
 * Custom Dialog Component
 */
@Component({
    selector: 'app-custom-dialogs',
    templateUrl: 'customdialogs.component.html',
    styleUrls: ['customdialogs.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DefaultDialogComponent {
    // Define Dialog properties
    @ViewChild('alertDialog')
    public alertDialog: DialogComponent;
    @ViewChild('confirmDialog')
    public confirmDialog: DialogComponent;
    @ViewChild('promptDialog')
    public promptDialog: DialogComponent;
    public alertHeader: string = 'Low Battery';
    public confirmHeader: string = 'Delete Multiple Items';
    public promptHeader: string = 'Join Wi-Fi network';
    public alertContent: string = '10% of battery remaining';
    public showCloseIcon: Boolean = false;
    public visible: Boolean = true;
    public hidden: Boolean = false;
    public confirmCloseIcon: Boolean = true;
    public target: string = '.control-section';
    public alertWidth: string = '250px';
    public confirmWidth: string = '400px';
    public promptWidth: string = '330px';
    public animationSettings: Object = { effect: 'None' };
    public hide: any;
    ngAfterViewInit(): void {
        document.getElementById('alertbtn').focus();
    }
    public alertDlgBtnClick: EmitType<object> = () => {
        this.alertDialog.hide();
    }
    public confirmDlgBtnClick: EmitType<object> = () => {
        this.confirmDialog.hide();
    }
    public promptDlgBtnClick: EmitType<object> = () => {
        this.promptDialog.hide();
    }
    public onFocus: any = () => {
        document.getElementById('password').parentElement.classList.add('e-input-focus');
    }
    public onBlur: any = () => {
        document.getElementById('password').parentElement.classList.remove('e-input-focus');
    }

    // Render the Buttons to open corresponding Dialogs
    public alertDlgButtons: Object[] = [{ click: this.alertDlgBtnClick.bind(this), buttonModel: { content: 'Dismiss', isPrimary: true } }];
    public confirmDlgButtons: Object[] = [{ click: this.confirmDlgBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }, { click: this.confirmDlgBtnClick.bind(this), buttonModel: { content: 'No' } }];
    public promptDlgButtons: Object[] = [{ click: this.promptDlgBtnClick.bind(this), buttonModel: { content: 'Connect', isPrimary: true } }, { click: this.promptDlgBtnClick.bind(this), buttonModel: { content: 'Cancel' } }];

    // While clicking alert button, open the alert Dialog
    public alertBtnClick: EmitType<object> = () => {
        this.alertDialog.show();
        this.dialogOpen();
    }

    // While clicking confirm button, open the confirm Dialog
    public confirmBtnClick: EmitType<object> = () => {
        this.confirmDialog.show();
        this.dialogOpen();
    }

    // While clicking prompt button, open the prompt Dialog
    public promptBtnClick: EmitType<object> = () => {
        this.promptDialog.show();
        this.dialogOpen();
    }

    // On Dialog close, show the buttons
    public dialogClose: EmitType<object> = () => {
        (document.querySelectorAll('.dlgbtn')[0] as HTMLElement).classList.remove('e-btn-hide');
        (document.querySelectorAll('.dlgbtn')[1] as HTMLElement).classList.remove('e-btn-hide');
        (document.querySelectorAll('.dlgbtn')[2] as HTMLElement).classList.remove('e-btn-hide');
    }
    // On Dialog open, hide the buttons
    public dialogOpen: EmitType<object> = () => {
        (document.querySelectorAll('.dlgbtn')[0] as HTMLElement).classList.add('e-btn-hide');
        (document.querySelectorAll('.dlgbtn')[1] as HTMLElement).classList.add('e-btn-hide');
        (document.querySelectorAll('.dlgbtn')[2] as HTMLElement).classList.add('e-btn-hide');
    }

    constructor() { }

}