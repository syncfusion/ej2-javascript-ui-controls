import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from './skeleton.component';

const SKELETON_DIRECTIVES = [
    SkeletonComponent
];

/**
 * NgModule definition for the Skeleton component.
 * Re-exports standalone Skeleton component and directives so existing apps can keep using:
 * `imports: [SkeletonModule]`
 */
@NgModule({
    imports: [CommonModule, ...SKELETON_DIRECTIVES],
    exports: [...SKELETON_DIRECTIVES]
})
export class SkeletonModule { }