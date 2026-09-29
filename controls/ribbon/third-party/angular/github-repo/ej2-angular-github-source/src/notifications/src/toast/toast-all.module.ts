import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModelPropDirective, ButtonModelPropsDirective } from './buttons.directive';
import { ToastComponent } from './toast.component';
import { ToastModule } from './toast.module';





/**
 * NgModule definition for the Toast component with providers.
 */
@NgModule({
    imports: [CommonModule, ToastModule],
    exports: [
        ToastModule
    ],
    providers:[
        
    ]
})
export class ToastAllModule { }