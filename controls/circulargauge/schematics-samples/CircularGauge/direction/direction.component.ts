//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'control-content',
    templateUrl: 'direction.component.html',
    styleUrls: ['direction.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DirectionComponent {   
    public lineStyle: Object = {
        width: 10, color: '#E0E0E0'
    };
    public onLabelRender(args: IAxisLabelRenderEventArgs): void {
        args.text = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', ''][args.value];
    }
    //Initializing LabelStyle
    public labelStyle: Object = {
        font: {
            size: '12px', fontFamily: 'Roboto'
        },
        useRangeColor: true,
        autoAngle: true,
        hiddenLabel: 'Last'
    };
    //Initializing majorTicks
    public majorTicks: Object = {
        height: 15,
        interval: 1,
        color: '#9E9E9E'
    };
    public minorTicks: Object = {
        height: 10,
        interval: 0.5,
        color: '#9E9E9E'
    };

    public ranges: Object[] = [{
        start: 7,
        end: 7,
        color: '#f03e3e'
    }];
    public pointers: Object[] = [{
        value: 7,
        radius: '50%',
        color: '#f03e3e',
        pointerWidth: 20,
        cap: {
            radius: 0
        },
        animation: { enable: false }
    }, {
        value: 3,
        radius: '50%',
        color: '#9E9E9E',
        pointerWidth: 20,
        cap: {
            radius: 0
        },
        animation: { enable: false }
    }];
    constructor() {
        // code
    };
}