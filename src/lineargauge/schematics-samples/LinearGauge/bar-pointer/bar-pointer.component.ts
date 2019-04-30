//tslint:disable
import { Component } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'bar-pointer.component.html',
    styleUrls: ['bar-pointer.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [{
        pointers: [{
            value: 10,
            height: 15,
            width: 15,
            //offset:30,
            type: 'Bar'
        }],
    }];
    constructor() {
        // code
    };
}
