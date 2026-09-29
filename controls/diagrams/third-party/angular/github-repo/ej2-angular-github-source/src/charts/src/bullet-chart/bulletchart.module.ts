import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulletRangeDirective, BulletRangeCollectionDirective } from './ranges.directive';
import { BulletChartComponent } from './bulletchart.component';

const BULLETCHART_DIRECTIVES = [
    BulletChartComponent,
        BulletRangeDirective,
        BulletRangeCollectionDirective
];

/**
 * NgModule definition for the BulletChart component.
 * Re-exports standalone BulletChart component and directives so existing apps can keep using:
 * `imports: [BulletChartModule]`
 */
@NgModule({
    imports: [CommonModule, ...BULLETCHART_DIRECTIVES],
    exports: [...BULLETCHART_DIRECTIVES]
})
export class BulletChartModule { }