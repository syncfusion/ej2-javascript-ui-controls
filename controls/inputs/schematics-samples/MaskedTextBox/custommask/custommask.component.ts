import { Component } from '@angular/core';

@Component({
    selector: 'app-custommask',
    templateUrl: 'custommask.component.html',
    styleUrls: ['custommask.component.css']
})
export class CustommaskController {
    // Custom characters to specify time value
    public customMaskChar: Object = { P: 'P,A,p,a', M: 'M,m'};
    constructor() { }
}