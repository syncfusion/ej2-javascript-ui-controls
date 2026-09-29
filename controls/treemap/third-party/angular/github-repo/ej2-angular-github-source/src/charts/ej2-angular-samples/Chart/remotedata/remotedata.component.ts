import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { IAxisLabelRenderEventArgs, ILoadedEventArgs, IPointRenderEventArgs } from '@syncfusion/ej2-angular-charts';
import { ChartComponent } from '@syncfusion/ej2-angular-charts';
import { Chart } from '@syncfusion/ej2-charts';
import { Browser } from '@syncfusion/ej2-base';
/**
 * Sample for Remote-Data binding
 */
@Component({
    selector: 'control-content',
    templateUrl: 'remotedata.component.html',
    styleUrls: ['remotedata.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RemoteDataChartComponent {

    public data: DataManager = new DataManager({
        url: 'https://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
    });
    @ViewChild('chart')
    public chart: ChartComponent;
    public query: Query = new Query().take(5).where('Estimate', 'lessThan', 3, false);
    public chartArea: Object = {
        border: { width: 0 }
    };
    public labelRender(args: IAxisLabelRenderEventArgs): void {
        if (args.axis.orientation === 'Horizontal') {
            args.text = args.text.split(' ')[0];
        }
    };
    public loadedChart(args: Chart): void {
        let div: HTMLElement = document.getElementById('waitingpopup') as HTMLElement;
        div.style.display = 'none';
    };
    public pointRender(args: IPointRenderEventArgs): void {
        let materialColors: string[] = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883', '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb',
            '#ea7a57', '#404041', '#00bdae'];
        let fabricColors: string[] = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
            '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300', '#4472c4', '#70ad47', '#ffc000', '#ed7d31'];
        let bootstrapColors: string[] = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
            '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
        let highContrastColors: string[] = ['#79ECE4', '#E98272', '#DFE6B6', '#C6E773', '#BA98FF',
            '#FA83C3', '#00C27A', '#43ACEF', '#D681EF', '#D8BC6E'];
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        if (selectedTheme && selectedTheme.indexOf('fabric') > -1) {
            args.fill = fabricColors[args.point.index % 10];
        } else if (selectedTheme === 'material') {
            args.fill = materialColors[args.point.index % 10];
        } else if (selectedTheme === 'highcontrast') {
            args.fill = highContrastColors[args.point.index % 10];
        } else {
            args.fill = bootstrapColors[args.point.index % 10];
        }
    };
    public loadChart(args: ILoadedEventArgs): void {
        let div: HTMLElement = document.getElementById('waitingpopup');
        div.style.display = 'block';
        let width: number = args.chart.element.offsetWidth;
        let height: number = args.chart.element.offsetHeight;
        div.style.top = (height ? height : 300 / 2 - 25) + 'px';
        div.style.left = (width / 2 - 25) + 'px';
        div.style.display = '';
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme: 'Material';
        args.chart.theme = (selectedTheme.indexOf('fabric') > -1) ? 'Fabric' : 'Material';
    };
    //Initializing Primary X Axis
    public primaryXAxis: Object = {
        rangePadding: 'Additional',
        valueType: 'Category',
        title: 'Assignee',
        majorGridLines: { width: 0 },
    };
    //Initializing Marker
    public marker: Object = {
        dataLabel: {
            visible: true,
            position: 'Top',
            font: {
                fontWeight: '600', color: '#ffffff'
            }
        }
    }
    //Initializing Primary Y Axis
    public primaryYAxis: Object = {
        majorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        lineStyle: { width: 0 },
        labelStyle: {
            color: 'transparent'
        }
    };
    public legend: Object = {
        visible: false
    };
    public width: Object = Browser.isDevice ? '100%' : '60%';
    public tooltip: Object = {
        enable: true
    };
    public title: string = 'Sprint Task Analysis';
    constructor() {
        //Code
    };

}