//tslint:disable
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { SmithchartTheme, ISmithchartLoadEventArgs, Smithchart, RenderType} from '@syncfusion/ej2-angular-charts';
@Component({
    selector: 'control-content',
    templateUrl: 'admittance-rendering.component.html',
    styleUrls: ['admittance-rendering.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SmithchartDefaultComponent {
    @ViewChild('smithchart')
    public smithchart: Smithchart;
    public data: Object[] = [
        { resistance: 10, reactance: 25 }, { resistance: 8, reactance: 6 },
                    { resistance: 6, reactance: 4.5 }, { resistance: 4.5, reactance: 2 },
                    { resistance: 3.5, reactance: 1.6 }, { resistance: 2.5, reactance: 1.3 },
                    { resistance: 2, reactance: 1.2 }, { resistance: 1.5, reactance: 1 },
                    { resistance: 1, reactance: 0.8 }, { resistance: 0.5, reactance: 0.4 },
                    { resistance: 0.3, reactance: 0.2 }, { resistance: 0, reactance: 0.15 }
    ];
    public data1: Object[] = [
       { resistance: 20, reactance: -50 }, { resistance: 10, reactance: -10 },
                    { resistance: 9, reactance: -4.5 }, { resistance: 8, reactance: -3.5 },
                    { resistance: 7, reactance: -2.5 }, { resistance: 6, reactance: -1.5 },
                    { resistance: 5, reactance: -1 }, { resistance: 4.5, reactance: -0.5 },
                    { resistance: 3.5, reactance: 0 }, { resistance: 2.5, reactance: 0.4 },
                    { resistance: 2, reactance: 0.5 }, { resistance: 1.5, reactance: 0.5 },
                    { resistance: 1, reactance: 0.4 }, { resistance: 0.5, reactance: 0.2 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0, reactance: 0.05 }
    ];
    public renderType: string = 'Admittance';
    public load = (args: ISmithchartLoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material';
        args.smithchart.theme = <SmithchartTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
    constructor() {
        //code
    };
}