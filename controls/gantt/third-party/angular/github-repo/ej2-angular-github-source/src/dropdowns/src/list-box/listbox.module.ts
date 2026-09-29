import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBoxComponent } from './listbox.component';

const LISTBOX_DIRECTIVES = [
    ListBoxComponent
];

/**
 * NgModule definition for the ListBox component.
 * Re-exports standalone ListBox component and directives so existing apps can keep using:
 * `imports: [ListBoxModule]`
 */
@NgModule({
    imports: [CommonModule, ...LISTBOX_DIRECTIVES],
    exports: [...LISTBOX_DIRECTIVES]
})
export class ListBoxModule { }