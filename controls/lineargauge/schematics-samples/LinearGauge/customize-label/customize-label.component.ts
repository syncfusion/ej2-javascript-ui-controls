//tslint:disable
import { Component } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'customize-label.component.html',
    styleUrls: ['customize-label.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [{
        labelStyle: {
            format: '{value}%',
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
