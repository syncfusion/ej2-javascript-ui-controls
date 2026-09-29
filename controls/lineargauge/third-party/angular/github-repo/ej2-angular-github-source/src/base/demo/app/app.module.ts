import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ControlComponent, ChildDirective, ChildsDirective, SubChildDirective, SubChildsDirective } from '../../spec/control.component';
import { TemplateComponent } from '../../spec/template.component';
import { DemoBaseComponent } from '../../spec/sample.component';

/**
 * Module
 */
@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [AppComponent,
        DemoBaseComponent, ControlComponent, TemplateComponent, ChildDirective,
        ChildsDirective, SubChildDirective, SubChildsDirective],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }