import { Component, ViewEncapsulation } from '@angular/core';
import { PanelModel } from '@syncfusion/ej2-angular-layouts';
/**
 * Default DashboardLayout sample
 */
@Component({
    selector: 'app-floating-dashboardlayout',
    templateUrl: 'floating.component.html',
    styleUrls: ['floating.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FloatingDashboardlayoutComponent {
    public cellSpacing: number[] = [10, 10];
    public panelsData: PanelModel[] = [{
        'sizeX': 4, 'sizeY': 3, 'row': 0, 'col': 0,
        header: '<div class="e-header-text">Header Area</div><div class="header-border"></div>',
        content: '<div class="panel-content">Content Area</div>'
    },
    {
        'sizeX': 2, 'sizeY': 3, 'row': 0, 'col': 4,
        header: '<div class="e-header-text">Header Area</div><div class="header-border"></div>',
        content: '<div class="panel-content">Content Area</div>'
    },
    {
        'sizeX': 6, 'sizeY': 2, 'row': 3, 'col': 0,
        header: '<div class="e-header-text">Header Area</div><div class="header-border"></div>',
        content: '<div class="panel-content">Content Area</div>'
    }];
 }