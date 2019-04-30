//tslint:disable
import { Component } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'marker-animation.component.html',
    styleUrls: ['marker-animation.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [{
        pointers: [{
            value: 60,
            animationDuration: 1000
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
