import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBarComponent } from './appbar.component';

const APPBAR_DIRECTIVES = [
    AppBarComponent
];

/**
 * NgModule definition for the AppBar component.
 * Re-exports standalone AppBar component and directives so existing apps can keep using:
 * `imports: [AppBarModule]`
 */
@NgModule({
    imports: [CommonModule, ...APPBAR_DIRECTIVES],
    exports: [...APPBAR_DIRECTIVES]
})
export class AppBarModule { }