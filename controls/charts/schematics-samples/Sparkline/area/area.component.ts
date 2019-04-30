//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'control-content',
    templateUrl: 'area.component.html',
    styleUrls: ['area.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DefaultSparklineComponent {
    public aausData: object[] = [
        { x: 1, yval: 5 },
            { x: 2, yval: 6 },
            { x: 3, yval: 5 },
            { x: 4, yval: 7 },
            { x: 5, yval: 4 },
            { x: 6, yval: 3 },
            { x: 7, yval: 9 },
            { x: 8, yval: 5 },
            { x: 9, yval: 6 },
            { x: 10, yval: 5 },
            { x: 11, yval: 7 },
            { x: 12, yval: 8 },
            { x: 13, yval: 4 },
            { x: 14, yval: 5 },
            { x: 15, yval: 3 },
    ];
    public border: object = {
        color: 'red',
        width: 2
    };
    public areatooltipSettings: object = {
        visible: true,
        format: '${x} : ${yval}',
    };
}