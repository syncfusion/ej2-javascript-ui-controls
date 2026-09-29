import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from './skeleton.component';
import { SkeletonModule } from './skeleton.module';





/**
 * NgModule definition for the Skeleton component with providers.
 */
@NgModule({
    imports: [CommonModule, SkeletonModule],
    exports: [
        SkeletonModule
    ],
    providers:[
        
    ]
})
export class SkeletonAllModule { }