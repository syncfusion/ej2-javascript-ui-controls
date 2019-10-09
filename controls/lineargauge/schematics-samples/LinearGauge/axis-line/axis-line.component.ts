//tslint:disable
import { Component } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'axis-line.component.html',
    styleUrls: ['axis-line.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [{
        pointers: [{
            value: 10,
            height: 0,
            width: 0,
        }],
        line:{
            width:10,
            color: 'blue',
        },
    }];
    constructor() {
        // code
    };
}
