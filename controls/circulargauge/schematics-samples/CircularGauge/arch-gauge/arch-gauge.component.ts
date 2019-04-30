//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'arch-gauge.component.html',
    styleUrls: ['arch-gauge.component.css'],
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
         height: 0,
    };
    public minorTicks: Object = {
         height: 0,
    }
    public tail: Object = {
        color: '#0450C2',
        length: '25%'
    };
    public pointerCap: Object = {
        radius: 10,
        color: '#0450C2',
        border: { width: 0 }
    };
    public ranges: Object=[{
        start: 0, end: 100,
        radius: '90%',
        startWidth: 30, endWidth: 30,
        color: '#E0E0E0',
        roundedCornerRadius: 20
    }];
}
