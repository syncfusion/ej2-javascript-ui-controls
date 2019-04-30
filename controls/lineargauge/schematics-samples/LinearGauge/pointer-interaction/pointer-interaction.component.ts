//tslint:disable
import { Component } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'pointer-interaction.component.html',
    styleUrls: ['pointer-interaction.component.css']
})
export class DefaultComponent {
    // initializing Axes
    public Axes: Object[] = [{
        pointers: [{
            value: 80,
            enableDrag: true
        }],
    }];
    constructor() {
        // code
    };
}
