/**
 * Sidebar backdrop Sample
 */
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Sidebar } from '@syncfusion/ej2-angular-navigations';
import { enableRipple } from '@syncfusion/ej2-base';

@Component({
    selector: 'app-back-drop',
    templateUrl: 'backdrop.component.html',
    styleUrls: ['backdrop.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BackdropComponent {
    @ViewChild('sidebar')
    public sidebar: Sidebar;
     public showBackdrop: boolean = true;
     public type: string = 'Push';
     public closeOnDocumentClick: boolean = true;
 
    closeClick(): void {
         this.sidebar.hide();
     };
 
     toggleClick():void{
       this.sidebar.show();
     }
}