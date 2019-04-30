//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'multiple-axis.component.html',
    styleUrls: ['multiple-axis.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MultipleAxisComponent {
    public axisIndex: number = 0;
    public lineStyle1: Object = {
        width: 1.5, color: '#9E9E9E'
    };
    //Initializing MajorTicks
    public majorTicks1: Object = {
        position: 'Inside',
        width: 2,
        height: 10,
        color: '#757575'

    };
    public title: string = 'Gauge with Multiple Axes';
    //Initializing TitleStyle
    public titleStyle: Object = {
        color: 'gray',
        size: '16px'
    };
    public minorTicks1: Object = {
        position: 'Inside',
        width: 2,
        height: 5,
        color: '#757575'

    };
    public markerHeight: number = 15;
    public markerWidth: number = 15;
    public labelStyle1: Object = {
        position: 'Inside',
        autoAngle: true,
        hiddenLabel: 'None'
    };
    public cap: Object = { color: 'white', radius: 0, border: { width: 0 } };

    public lineStyle2: Object = { width: 1.5, color: '#E84011' };

    public labelStyle2: Object = {
        position: 'Outside',
        autoAngle: true,
        hiddenLabel: 'None',
        font: { color: '#E84011' }
    };
    public majorTicks2: Object = {
        position: 'Outside',
        width: 2,
        height: 10,
        color: '#E84011'
    };
    public minorTicks2: Object = {
        position: 'Outside',
        width: 2,
        height: 5,
        color: '#E84011'
    };

    
    constructor() {
        //
    };
}

