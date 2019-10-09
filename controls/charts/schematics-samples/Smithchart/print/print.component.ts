//tslint:disable
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { SmithchartTheme, ISmithchartLoadEventArgs, Smithchart, ExportType} from '@syncfusion/ej2-angular-charts';

@Component({
    selector: 'control-content',
    templateUrl: 'print.component.html',
    styleUrls: ['print.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SmithchartPrintExportComponent {
    @ViewChild('smithchart')
    public smithchart: Smithchart;
    public data: Object[] = [
        { resistance: 0.15, reactance: 0 },
                    { resistance: 0.15, reactance: 0.15 },
                    { resistance: 0.18, reactance: 0.3 },
                    { resistance: 0.2, reactance: 0.4 },
                    { resistance: 0.25, reactance: 0.6 },
                    { resistance: 0.38, reactance: 0.95 },
                    { resistance: 0.6, reactance: 1.25 },
                    { resistance: 1, reactance: 1.6 },
                    { resistance: 1.65, reactance: 1.9 },
                    { resistance: 2.75, reactance: 2 },
                    { resistance: 4.5, reactance: 0 },
                    { resistance: 3, reactance: -2 },
                    { resistance: 1.65, reactance: -1.95 },
                    { resistance: 1, reactance: -1.65 },
                    { resistance: 0.6, reactance: -1.25 },
                    { resistance: 0.35, reactance: -0.9 },
                    { resistance: 0.25, reactance: -0.6 },
                    { resistance: 0.25, reactance: -0.4 },
                    { resistance: 0.25, reactance: -0.3 },
                    { resistance: 0.25, reactance: -0.15 },
                    { resistance: 0.25, reactance: 0 }
    ];
    public marker: Object = {
        shape: 'Circle',
        visible: true,
        border: {
            width: 2,
        }
    };

    public legend: Object = {
         visible: true,
         shape: 'Circle'
    };
    public tooltip: Object = {
        visible: true
    };
    public load = (args: ISmithchartLoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material';
        args.smithchart.theme = <SmithchartTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }

    public onClick1(e: Event): void {
        this.smithchart.export('PDF', 'Smithchart');
    }
    public onClick2(e: Event): void {
        this.smithchart.print();
    }
    
    constructor() {
        //code
    };
}