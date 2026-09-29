import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogButtonDirective, ButtonsDirective } from './buttons.directive';
import { DialogComponent } from './dialog.component';
import { DialogModule } from './dialog.module';





/**
 * NgModule definition for the Dialog component with providers.
 */
@NgModule({
    imports: [CommonModule, DialogModule],
    exports: [
        DialogModule
    ],
    providers:[
        
    ]
})
export class DialogAllModule { }