import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomWidgetSettingDirective, CustomWidgetSettingsDirective } from './customwidgetsettings.directive';
import { FormRendererComponent } from './formrenderer.component';

const FORMRENDERER_DIRECTIVES = [
    FormRendererComponent,
        CustomWidgetSettingDirective,
        CustomWidgetSettingsDirective
];

/**
 * NgModule definition for the FormRenderer component.
 * Re-exports standalone FormRenderer component and directives so existing apps can keep using:
 * `imports: [FormRendererModule]`
 */
@NgModule({
    imports: [CommonModule, ...FORMRENDERER_DIRECTIVES],
    exports: [...FORMRENDERER_DIRECTIVES]
})
export class FormRendererModule { }