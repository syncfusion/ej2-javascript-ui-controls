//tslint:disable
import { Component } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'inverse-axes.component.html',
    styleUrls: ['inverse-axes.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [{
        isInversed: true, 
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
    }];
    constructor() {
        // code
    };
}
