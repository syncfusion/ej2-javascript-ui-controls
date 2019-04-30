import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ILoadedEventArgs, ChartComponent, IPointRenderEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';
import { LabelIntersectAction, EdgeLabelPlacement, AxisPosition } from '@syncfusion/ej2-charts';
import { Browser } from '@syncfusion/ej2-base';


/**
 * Sample for smart axis labels Positions
 */
@Component({
    selector: 'control-content',
    templateUrl: 'multi-level-label.component.html',
    styleUrls: ['multi-level-label.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MultiLevelLabelsChartComponent {

    public data: Object[] = [
        { x: 'Grapes', y: 28 }, { x: 'Apples', y: 87 },
        { x: 'Pears', y: 42 }, { x: 'Grapes', y: 13 },
        { x: 'Apples', y: 13 }, { x: 'Pears', y: 10 },
        { x: 'Tomato', y: 31 }, { x: 'Potato', y: 96 },
        { x: 'Cucumber', y: 41 }, { x: 'Onion', y: 59 }];
    //Initializing Primary X Axis
    public primaryXAxis: Object = {
        valueType: 'Category', labelRotation: 90,
        border: { width: 1, type: 'Rectangle' },
        isIndexed: true, interval: 1, majorGridLines: { width: 0 },
        multiLevelLabels: (Browser.isDevice ? ([
            {
                border: { type: 'Rectangle' },
                categories: [
                    { start: -0.5, end: 2.5, text: 'In Season', },
                    { start: 2.5, end: 5.5, text: 'Out of Season', },
                    { start: 5.5, end: 7.5, text: 'In Season', },
                    { start: 7.5, end: 9.5, text: 'Out of Season', },
                ]
            }, {
                border: { type: 'Rectangle' },
                textStyle: { fontWeight: 'Bold' },
                categories: [
                    { start: -0.5, end: 5.5, text: 'Fruits', },
                    { start: 5.5, end: 9.5, text: 'Vegetables', },
                ]
            }]) : [
                {
                    border: { type: 'Rectangle' },
                    categories: [
                        { start: -0.5, end: 0.5, text: 'Seedless', },
                        { start: 0.5, end: 2.5, text: 'Seeded', },
                        { start: 2.5, end: 3.5, text: 'Seedless', },
                        { start: 3.5, end: 5.5, text: 'Seeded', },
                        { start: 5.5, end: 6.5, text: 'Seedless', },
                        { start: 6.5, end: 7.5, text: 'Seeded', },
                        { start: 7.5, end: 8.5, text: 'Seedless', },
                        { start: 8.5, end: 9.5, text: 'Seeded', }
                    ]
                }, {
                    border: { type: 'Rectangle' },
                    categories: [
                        { start: -0.5, end: 2.5, text: 'In Season', },
                        { start: 2.5, end: 5.5, text: 'Out of Season', },
                        { start: 5.5, end: 7.5, text: 'In Season', },
                        { start: 7.5, end: 9.5, text: 'Out of Season', },
                    ]
                }, {
                    border: { type: 'Rectangle' },
                    textStyle: { fontWeight: 'Bold' },
                    categories: [
                        { start: -0.5, end: 5.5, text: 'Fruits', },
                        { start: 5.5, end: 9.5, text: 'Vegetables', },
                    ]
                }])
    };
    //Initializing Primary Y Axis
    public primaryYAxis: Object = {
        minimum: 0, maximum: 120, interval: 30,
        majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' }
    };
    public chartArea: Object = {
        border: {
            width: 0
        }
    };
    public legendSettings: Object = {
        visible: false
    };
    public width: string = Browser.isDevice ? '100%' : '80%';
      public load(args: ILoadedEventArgs): void {       
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
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
    public marker: Object = {
        dataLabel: {
            visible: true,
            position: 'Outer',
        }
    };
    public tooltip: Object = {
        enable: false
    };
    public title: string = 'Fruits and Vegetables - Season';
    constructor() {
        // code
    };
}