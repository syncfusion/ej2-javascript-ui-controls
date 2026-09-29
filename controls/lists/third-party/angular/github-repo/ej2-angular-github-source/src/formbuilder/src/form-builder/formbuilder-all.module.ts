import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolboxItemSettingDirective, ToolboxItemSettingsDirective } from './toolboxitems.directive';
import { FormBuilderComponent } from './formbuilder.component';
import { FormBuilderModule } from './formbuilder.module';





/**
 * NgModule definition for the FormBuilder component with providers.
 */
@NgModule({
    imports: [CommonModule, FormBuilderModule],
    exports: [
        FormBuilderModule
    ],
    providers:[
        
    ]
})
export class FormBuilderAllModule { }