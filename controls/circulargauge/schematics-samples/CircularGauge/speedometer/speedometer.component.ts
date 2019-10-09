//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'speedometer.component.html',
    styleUrls: ['speedometer.component.css'],
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
    public ranges: Object=[
        {
            start: 0,
            end: 20,
            startWidth: 5, endWidth: 10,
            radius: '102%',
            color: '#82b944',
        },
        {
            start: 20,
            end: 40,
            startWidth: 10, endWidth: 15,
            radius: '102%',
            color: '#a1cb43',
        }, {
            start: 40,
            end: 60,
            startWidth: 15, endWidth: 20,
            radius: '102%',
            color: '#e5ce20',
        },
        {
            start: 60,
            end: 80,
            startWidth: 20, endWidth: 25,
            radius: '102%',
            color: '#f79c02',
        },
        {
            start: 80,
            end: 100,
            startWidth: 25, endWidth: 30,
            radius: '102%',
            color: '#ea501a',
        },
        {
            start: 100,
            end: 120,
            startWidth: 30, endWidth: 35,
            radius: '102%',
            color: 'red',
        }
];
}
