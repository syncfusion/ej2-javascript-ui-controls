//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'container-therometer.html',
    styleUrls: ['container-therometer.component.css']
})
export class DefaultComponent {
    //Initializing Axes
    public Axes: Object[] = [{
        minimum: 0,
        maximum: 180,
        line: {
            width: 0
        },
        majorTicks: {
            interval: 20,
            color: '#9e9e9e'
        },
        minorTicks: {
            color: '#9e9e9e'
        },
        pointers: [
            {
                value: 90,
                height: 13,
                width: 13,
                roundedCornerRadius: 5,
                type: 'Bar',
                color: '#f02828'
            }
        ]
    },
    {
        minimum: 0,
        maximum: 180,
        line: {
            width: 0
        },
        majorTicks: {
            interval: 20
        },
        opposedPosition: true,
        pointers: [
            {
                width: 0
            }
        ]
    }];
    public Container: Object = {
        width: 13,
        roundedCornerRadius: 5,
        type: 'Thermometer'
    };
    constructor() {
        // code
    };
}