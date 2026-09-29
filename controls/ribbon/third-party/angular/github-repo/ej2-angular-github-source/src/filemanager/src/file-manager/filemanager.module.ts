import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarItemDirective, ToolbarItemsDirective } from './toolbaritems.directive';
import { FileManagerComponent } from './filemanager.component';

const FILEMANAGER_DIRECTIVES = [
    FileManagerComponent,
        ToolbarItemDirective,
        ToolbarItemsDirective
];

/**
 * NgModule definition for the FileManager component.
 * Re-exports standalone FileManager component and directives so existing apps can keep using:
 * `imports: [FileManagerModule]`
 */
@NgModule({
    imports: [CommonModule, ...FILEMANAGER_DIRECTIVES],
    exports: [...FILEMANAGER_DIRECTIVES]
})
export class FileManagerModule { }