import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewComponent } from './listview.component';
import { ListViewModule } from './listview.module';
import {Virtualization} from '@syncfusion/ej2-lists'


export const VirtualizationService: ValueProvider = { provide: 'ListsVirtualization', useValue: Virtualization};

/**
 * NgModule definition for the ListView component with providers.
 */
@NgModule({
    imports: [CommonModule, ListViewModule],
    exports: [
        ListViewModule
    ],
    providers:[
        VirtualizationService
    ]
})
export class ListViewAllModule { }