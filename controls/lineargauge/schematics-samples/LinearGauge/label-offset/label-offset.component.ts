//tslint:disable
import { Component } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'label-offset.component.html',
    styleUrls: ['label-offset.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [{
        pointers: [{
            value: 10,
            height: 15,
            width: 15,
            placement: 'Near',
            offset: -50,
            type: 'Bar'
        }],
    }];
    constructor() {
        // code
    };
}
