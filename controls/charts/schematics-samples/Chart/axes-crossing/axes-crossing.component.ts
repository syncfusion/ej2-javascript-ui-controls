import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ILoadedEventArgs, ChartComponent, ChartTheme } from '@syncfusion/ej2-angular-charts';
/**
 * Sample for box and whisker series
 */
@Component({
    selector: 'control-content',
    templateUrl: 'axes-crossing.component.html',
    styleUrls: ['axes-crossing.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AxisCrossingChartComponent {
    public data1: Object[] = [{ x: -6, y: 2 }, { x: -3, y: -4 }, { x: 1.5, y: 3.5 }, { x: 6, y: 4.5 }];
    public data2: Object[] = [
        { x: -6, y: 2 }, { x: -5, y: 0 }, { x: -4.511, y: -0.977 }, { x: -3, y: -4 }, { x: -1.348, y: -1.247 },
        { x: -0.6, y: 0 }, { x: 0, y: 1 }, { x: 1.5, y: 3.5 }, { x: 6, y: 4.5 },
    ];
    public data3: Object[] = [
        { x: -6, y: 2 }, { x: -5.291, y: 0 }, { x: -5, y: -0.774 }, { x: -3, y: -4 }, { x: -0.6, y: -0.965 },
        { x: -0.175, y: 0 }, { x: 0, y: 0.404 }, { x: 1.5, y: 3.5 }, { x: 3.863, y: 5.163 }, { x: 6, y: 4.5 },
    ];
    //Initializing Primary X Axis
    public primaryXAxis: Object = {
        minimum: -8, maximum: 8, interval: 2,
        valueType: 'Double',
        lineStyle: {
            width: 2
        },
        minorTickLines: { width: 0 },
        majorTickLines: { width: 0 },
        crossesAt: 0,
        minorTicksPerInterval: 3
    };
    //Initializing Primary Y Axis
    public primaryYAxis: Object = {
        minimum: -8, maximum: 8, interval: 2,
        lineStyle: {
            width: 2
        },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        crossesAt: 0,
        minorTicksPerInterval: 3,
    };
    public marker: Object = {
        visible: false,
        height: 12,
        width: 12,
    };
    //Initializing Tooltip
    public tooltip: Object = { enable: true };
    public load(args: ILoadedEventArgs): void {       
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
      };
    public title: string = 'Spline Interpolation';
    @ViewChild('chart')
    public chart: ChartComponent;
    // public check(e: Event): void {
    //     let value: boolean = (e.target as HTMLInputElement).checked;
    //     if (this.axis.index === 0) {
    //         this.chart.primaryXAxis.placeNextToAxisLine = value;
    //     } else {
    //         this.chart.primaryYAxis.placeNextToAxisLine = value;
    //     }
    //     this.chart.dataBind();
    // };
    public legend: Object = {
        visible: true
    };
    // public axis: DropDownList;
    // public crossValue: NumericTextBox;
    // ngOnInit(): void {
    //     this.axis = new DropDownList({
    //         index: 0,
    //         width: 120,
    //         change: () => {
    //             let target: HTMLInputElement = document.getElementById('axisElements') as HTMLInputElement;
    //             if (this.axis.index === 0) {
    //                 target.checked = this.chart.primaryXAxis.placeNextToAxisLine;
    //                 this.crossValue.value = +this.chart.primaryXAxis.crossesAt;
    //             } else {
    //                 target.checked = this.chart.primaryYAxis.placeNextToAxisLine;
    //                 this.crossValue.value = +this.chart.primaryYAxis.crossesAt;
    //             }
    //             this.chart.dataBind();
    //         }
    //     });
    //     this.axis.appendTo('#selectAxis');
    //     this.crossValue = new NumericTextBox({
    //         value: 0, min: -8,
    //         max: 8, width: 120,
    //         step: 2,
    //         change: () => {
    //             if (this.axis.index === 0) {
    //                 this.chart.primaryXAxis.crossesAt = this.crossValue.value;
    //             } else {
    //                 this.chart.primaryYAxis.crossesAt = this.crossValue.value;
    //             }
    //             this.chart.dataBind();
    //         }
    //     });
    //     this.crossValue.appendTo('#crossingValue');
    // }
    constructor() {
        //code
    };

}