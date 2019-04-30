//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'column.component.html',
    styleUrls: ['column.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DefaultSparklineComponent {
    public causData: object[] = [
        { x: 0, xval: '2005', yval: 12.26 },
        { x: 1, xval: '2006', yval: 12.14 },
        { x: 2, xval: '2007', yval: 12.02 },
        { x: 3, xval: '2008', yval: 12.55 },
        { x: 4, xval: '2009', yval: 12.47 },
        { x: 5, xval: '2010', yval: 12.39 },
        { x: 6, xval: '2011', yval: 12.33 },
        { x: 7, xval: '2012', yval: 12.28 },
        { x: 8, xval: '2013', yval: 12.23 },
        { x: 9, xval: '2014', yval: 12.19 },
    ];
    public border: object = {
        color: 'red',
        width: 2
    };
    public areatooltipSettings: object = {
        visible: true,
        format: '${xval} : ${yval}',
    };
}