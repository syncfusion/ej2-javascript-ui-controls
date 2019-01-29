//tslint:disable
import { Component } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'range-width.component.html',
    styleUrls: ['range-width.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [{        
        majorTicks: {
            color: '#9E9E9E',
            interval: 10
        },
        minorTicks: {
            color: '#9E9E9E',
            interval: 2
        },
        pointers: [{
            value: 10,
            height: 0,
            width: 0,
        }],
        ranges: [{
            start: 0,
            end: 32,
            color: '#30B32D',
            startWidth: 15,
            endWidth: 15
        },]
    }];
    constructor() {
        // code
    };
}
