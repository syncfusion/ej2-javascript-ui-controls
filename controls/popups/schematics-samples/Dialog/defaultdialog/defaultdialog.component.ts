import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';

/**
 * Default Dialog Component
 */
@Component({
    selector: 'app-default-dialog',
    templateUrl: 'defaultdialog.component.html',
    styleUrls: ['defaultdialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class BasicDialogComponent {
    @ViewChild('Dialog')
    public Dialog: DialogComponent;
    public BtnClick: EmitType<object> = () => {
        this.Dialog.show();
    }
    public header: string = 'About SYNCFUSION Succinctly Series';
    public showCloseIcon: Boolean = true;
    public width: string = '50%';
    public animationSettings: Object = { effect: 'None' };
    public hide: any;
    ngAfterViewInit(): void {
        document.getElementById('dlgbtn').focus();
    }
    // On Dialog close, 'Open' Button will be shown
    public dialogClose: EmitType<object> = () => {
        document.getElementById('dlgbtn').style.display = '';
    }
    // On Dialog open, 'Open' Button will be hidden
    public dialogOpen: EmitType<object> = () => {
        document.getElementById('dlgbtn').style.display = 'none';
    }

    public dlgBtnClick: EmitType<object> = () => {
        window.open('https://www.syncfusion.com/company/about-us');
    }

    public dlgButtons: Object[] = [{ click: this.dlgBtnClick.bind(this), buttonModel: { content: 'Learn More', isPrimary: true } }];
    public target: string = '.control-section';
    constructor() { }

}