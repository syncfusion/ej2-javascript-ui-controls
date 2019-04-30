
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'semi-circle.component.html',
    styleUrls: ['semi-circle.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RangeComponent {

    public lineStyle: Object = {
         width: 0, color: '#0450C2' 
    };
    //Initializing LabelStyle
    public labelStyle: Object = {
        position: 'Outside', autoAngle: true,
        font: { size: '15px', fontWeight: 'normal', color: '#0450C2' }
    };
    public majorTicks: Object = {
        position: 'Inside', color: '#0450C2', width: 2, height: 25, interval: 20
    };
    public minorTicks: Object = {
        position: 'Inside', color: '#0450C2', height: 10, width: 1, interval: 2
    };
    public tail: Object = {
        color: '#0450C2',
        length: '25%'
    };
    public pointerCap: Object = {
        radius: 10,
        color: '#0450C2',
        border: { width: 0 }
    };
}
