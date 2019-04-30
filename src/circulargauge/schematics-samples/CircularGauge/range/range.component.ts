//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'range.component.html',
    styleUrls: ['range.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RangeComponent {

    public lineStyle: Object = {
        width: 10, color: 'transparent'
    };
    //Initializing LabelStyle
    public labelStyle: Object = {
        position: 'Inside', useRangeColor: false,
        font: { size: '12px', fontFamily: 'Roboto', fontStyle: 'Regular' }
    };
    public majorTicks: Object = {
        height: 10, offset: 5, color: '#9E9E9E'
    };
    public minorTicks: Object = {
        height: 0
    };
    public tail: Object = {
        length: '18%', color: '#757575'
    };
    public pointerCap: Object = {
        radius: 7, color: '#757575'
    };

    public annotaions: Object = [{
        content: '<div><span style="font-size:14px; color:#9E9E9E; font-family:Regular">Speedometer</span></div>',
        radius: '30%', angle: 0, zIndex:'1'
    }, {
        content: '<div><span style="font-size:24px; color:#424242; font-family:Regular">65 MPH</span></div>',
        radius: '40%', angle: 180, zIndex:'1'
    }];
}
