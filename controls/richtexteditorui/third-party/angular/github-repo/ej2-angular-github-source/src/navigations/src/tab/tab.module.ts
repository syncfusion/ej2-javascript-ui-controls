import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabItemDirective, TabItemsDirective } from './items.directive';
import { TabComponent } from './tab.component';

const TAB_DIRECTIVES = [
    TabComponent,
        TabItemDirective,
        TabItemsDirective
];

/**
 * NgModule definition for the Tab component.
 * Re-exports standalone Tab component and directives so existing apps can keep using:
 * `imports: [TabModule]`
 */
@NgModule({
    imports: [CommonModule, ...TAB_DIRECTIVES],
    exports: [...TAB_DIRECTIVES]
})
export class TabModule { }