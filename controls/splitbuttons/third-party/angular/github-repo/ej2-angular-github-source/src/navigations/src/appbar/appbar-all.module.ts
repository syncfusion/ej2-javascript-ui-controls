import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBarComponent } from './appbar.component';
import { AppBarModule } from './appbar.module';





/**
 * NgModule definition for the AppBar component with providers.
 */
@NgModule({
    imports: [CommonModule, AppBarModule],
    exports: [
        AppBarModule
    ],
    providers:[
        
    ]
})
export class AppBarAllModule { }