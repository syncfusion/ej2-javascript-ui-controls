//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'label.component.html',
    styleUrls: ['label.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LabelComponent {
    public margin: Object = {
        left: 0, right: 0, top: 0, bottom: 0
    };
    //Initializing Border
    public border: Object = { color: 'transparent', width: 4 };
    public lineStyle1: Object = {
        width: 2, color: '#9E9E9E'
    };

    public labelStyle1: Object = {
        position: 'Outside', autoAngle: true,
        font: {
            size: '10px'
        }
    };
    public majorTicks1: Object = {
        position: 'Inside', color: '#757575', width: 2, height: 10, interval: 20
    };
    public minorTicks1: Object = {
        position: 'Inside', color: '#757575', height: 5, width: 2, interval: 10
    };
    public pointers: Object[] = [{
        value: 145, type: 'RangeBar', roundedCornerRadius: 10,
        pointerWidth: 10, color: '#8BC34A', radius: '60%'
    }];
}
