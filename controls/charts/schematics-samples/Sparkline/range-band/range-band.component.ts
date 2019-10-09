//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'range-band.component.html',
    styleUrls: ['range-band.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DefaultSparklineComponent {
    public pausData: object[] = [
        { x: 0, xval: '2005', yval: 1 },
        { x: 1, xval: '2006', yval: 2 },
        { x: 2, xval: '2007', yval: 3 },
        { x: 3, xval: '2008', yval: 2 },
        { x: 4, xval: '2009', yval: 1 },
        { x: 5, xval: '2010', yval: 3 },
        { x: 6, xval: '2011', yval: 2 },
        { x: 7, xval: '2012', yval: 0 },
        { x: 8, xval: '2013', yval: 3 },
        { x: 9, xval: '2014', yval: 4 },
    ];
    public rangeBandSettings: object[] = [{
        startRange: 1,
        endRange: 3,
        color: '#bfd4fc',
        opacity:0.4
        }];
}