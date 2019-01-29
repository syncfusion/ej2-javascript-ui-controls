//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'win-loss.component.html',
    styleUrls: ['win-loss.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DefaultSparklineComponent {
    public wausData: object[] = [
        { x: 0, xval: '2005', yval: 1 },
        { x: 1, xval: '2006', yval: -1 },
        { x: 2, xval: '2007', yval: -1 },
        { x: 3, xval: '2008', yval: 1 },
        { x: 4, xval: '2009', yval: -1 },
        { x: 5, xval: '2010', yval: -1 },
        { x: 6, xval: '2011', yval: -1 },
        { x: 7, xval: '2012', yval: -1 },
        { x: 8, xval: '2013', yval: -1 },
        { x: 9, xval: '2014', yval: -1 },
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