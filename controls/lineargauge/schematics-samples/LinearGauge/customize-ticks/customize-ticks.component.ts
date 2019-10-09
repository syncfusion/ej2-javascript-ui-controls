//tslint:disable
import { Component } from '@angular/core';

/**
 * Sample for Default linear gauge
 */
@Component({
    selector: 'control-content',
    templateUrl: 'customize-ticks.component.html',
    styleUrls: ['customize-ticks.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [{
        majorTicks: {
            color: 'blue',
            interval: 10
        },
        minorTicks: {
            color: 'red',
            interval: 2
        },
        pointers: [{
            value: 10,
            height: 0,
            width: 0,
        }],
    }];
    constructor() {
        // code
    };
}
