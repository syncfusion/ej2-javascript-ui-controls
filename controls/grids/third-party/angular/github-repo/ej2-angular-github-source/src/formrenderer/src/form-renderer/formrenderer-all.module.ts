import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomWidgetSettingDirective, CustomWidgetSettingsDirective } from './customwidgetsettings.directive';
import { FormRendererComponent } from './formrenderer.component';
import { FormRendererModule } from './formrenderer.module';





/**
 * NgModule definition for the FormRenderer component with providers.
 */
@NgModule({
    imports: [CommonModule, FormRendererModule],
    exports: [
        FormRendererModule
    ],
    providers:[
        
    ]
})
export class FormRendererAllModule { }