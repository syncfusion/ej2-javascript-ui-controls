import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Default DashboardLayout sample
 */
@Component({
    selector: 'app-media-dashboardlayout',
    templateUrl: 'media-query.component.html',
    styleUrls: ['media-query.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ResizingDashboardlayoutComponent {
    public cellSpacing: number[] = [10, 10];
    public mediaQuery: string = 'max-width: 700px';
    public panels: any = [{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: '<div class="content">0</div>' },
    { "sizeX": 3, "sizeY": 2, "row": 0, "col": 1, content: '<div class="content">1</div>' },
    { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4, content: '<div class="content">2</div>' },
    { "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content: '<div class="content">3</div>' },
    { "sizeX": 2, "sizeY": 1, "row": 2, "col": 0, content: '<div class="content">4</div>' },
    { "sizeX": 1, "sizeY": 1, "row": 2, "col": 2, content: '<div class="content">5</div>' },
    { "sizeX": 1, "sizeY": 1, "row": 2, "col": 3, content: '<div class="content">6</div>' }
  ];
 }