//tslint:disable
import { Component } from '@angular/core';

/**
 * Sample for Default linear gauge
 */
@Component({
    selector: 'control-content',
    templateUrl: 'marker-pointer-shape.component.html',
    styleUrls: ['marker-pointer-shape.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [{
        pointers: [{
            value: 10,
            height: 15,
            width: 15,
            //offset:30,
            markerType: 'Diamond'
        }],
        majorTicks: {
            color: '#9E9E9E',
            interval: 10
        },
        minorTicks: {
            color: '#9E9E9E',
            interval: 2
        },
    }];
    constructor() {
        // code
    };
}
