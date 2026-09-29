import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';
import { OverviewModule } from './overview.module';





/**
 * NgModule definition for the Overview component with providers.
 */
@NgModule({
    imports: [CommonModule, OverviewModule],
    exports: [
        OverviewModule
    ],
    providers:[
        
    ]
})
export class OverviewAllModule { }