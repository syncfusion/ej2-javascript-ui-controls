//tslint:disable
import { Component } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'multiple-axes.component.html',
    styleUrls: ['multiple-axes.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [
        {
            
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
        },
        {
            minimum: 0,
            maximum: 10,
            pointers: [{
                value: 10,
                height: 0,
                width: 0,
            }],
        }
    ];
    constructor() {
        // code
    };
}
