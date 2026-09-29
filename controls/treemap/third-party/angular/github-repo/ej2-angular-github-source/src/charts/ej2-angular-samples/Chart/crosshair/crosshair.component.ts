import { Component, ViewEncapsulation } from '@angular/core';
import { ChartDataService } from './assets/chart-data.service';
import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';
import { axesData } from './assets/financial-data';

/**
 * Sample for Crosshair in chart
 */
@Component({
    selector: 'control-content',
    templateUrl: 'crosshair.component.html',
    styleUrls: ['crosshair.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CrosshairChartComponent {

    //Initializing Primary X Axis
    public primaryXAxis: Object = {
        majorGridLines: { width: 0 },
        valueType: 'DateTime',
        crosshairTooltip: { enable: true },
        labelFormat: 'MMM'
    };
    //Initializing Primary Y Axis
    public primaryYAxis: Object = {
        minimum: 83, maximum: 87, interval: 1,
        title: 'Millions in USD',
        labelFormat: '{value}M',
        rowIndex: 0,
        crosshairTooltip: {
            enable: true
        }
    };
    //Initializing Axes
    public axes: Object = [
        {
            majorGridLines: { width: 0 },
            rowIndex: 0,
            opposedPosition: true,
            minimum: 82, maximum: 88, interval: 2,
            name: 'yAxis',
            title: 'Millions in USD (Stock)',
            crosshairTooltip: { enable: true }
        }
    ];
    public border: Object = {
        width: 1.5
    };
    public legend: Object = {
        visible: false
    }
    public chartArea: Object = {
        border: {
            width: 0
        }
    };

    public width: string = Browser.isDevice ? '100%' : '80%';
    public load(args: ILoadedEventArgs): void {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    };
    public marker: Object = {
        visible: true
    }
    public title: string = 'Conns,Inc Stock Details';
    public majorGridLines: Object = { width: 0 };
    public crosshairLabel: Object = { enable: true };
    public series1: Object = axesData;
    public series2: Object = axesData;
    constructor() {
        //code
    };

}