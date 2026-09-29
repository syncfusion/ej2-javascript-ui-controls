import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolboxItemSettingDirective, ToolboxItemSettingsDirective } from './toolboxitems.directive';
import { FormBuilderComponent } from './formbuilder.component';

const FORMBUILDER_DIRECTIVES = [
    FormBuilderComponent,
        ToolboxItemSettingDirective,
        ToolboxItemSettingsDirective
];

/**
 * NgModule definition for the FormBuilder component.
 * Re-exports standalone FormBuilder component and directives so existing apps can keep using:
 * `imports: [FormBuilderModule]`
 */
@NgModule({
    imports: [CommonModule, ...FORMBUILDER_DIRECTIVES],
    exports: [...FORMBUILDER_DIRECTIVES]
})
export class FormBuilderModule { }