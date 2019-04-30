import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AccumulationChartComponent, AccumulationChart, IAccLoadedEventArgs, AccumulationTheme } from '@syncfusion/ej2-angular-charts';

/**
 * Sample for Pie chart
 */
@Component({
    selector: 'control-content',
    templateUrl: 'pie.component.html',
    styleUrls: ['pie.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DefaultPieComponent {
    public data: Object[] = [
        { 'x': 'Chrome', y: 37, text: '37%' }, { 'x': 'UC Browser', y: 17, text: '17%' },
        { 'x': 'iPhone', y: 19, text: '19%' },
        { 'x': 'Others', y: 4, text: '4%' }, { 'x': 'Opera', y: 11, text: '11%' },
        { 'x': 'Android', y: 12, text: '12%' }
    ];

    @ViewChild('pie')
    public pie: AccumulationChartComponent | AccumulationChart;
    public pieangle(e: Event): void {
        let angle: string = (document.getElementById('pieangle') as HTMLInputElement).value;
        this.pie.series[0].startAngle = parseFloat(angle);
        this.pie.series[0].endAngle = parseFloat(angle);
        this.pie.series[0].animation.enable = false;
        document.getElementById('pieangleText').innerHTML = angle;
        this.pie.removeSvg();
        this.pie.refreshSeries();
        this.pie.refreshChart();
    };
    public pieradius(e: Event): void {
        let radius: string = (document.getElementById('pieradius') as HTMLInputElement).value;
        this.pie.series[0].radius = radius + '%';
        document.getElementById('pieradiusText').innerHTML = (parseInt(radius, 10) / 100).toFixed(2);
        this.pie.series[0].animation.enable = false;
        this.pie.removeSvg();
        this.pie.refreshSeries();
        this.pie.refreshChart();
    };
    public pieexploderadius(e: Event): void {
        let radius: string = (document.getElementById('pieexploderadius') as HTMLInputElement).value;
        this.pie.visibleSeries[0].explodeOffset = radius + '%';
        document.getElementById('pieexploderadiusText').innerHTML = (parseInt(radius, 10) / 100).toFixed(2);
        this.pie.series[0].animation.enable = false;
        this.pie.removeSvg();
        this.pie.refreshSeries();
        this.pie.refreshChart();
    };
    public pieexplodeindex(e: Event): void {
        let index: number = +(document.getElementById('pieexplodeindex') as HTMLInputElement).value;
        this.pie.visibleSeries[0].explodeIndex = index;
        document.getElementById('pieexplodeindexText').innerHTML = index.toString();
        this.pie.series[0].animation.enable = false;
        this.pie.removeSvg();
        this.pie.refreshSeries();
        this.pie.refreshChart();
    };
    public animation: Object = {
        enable: false
    };
    //Initializing Legend
    public legendSettings: Object = {
        visible: false,
    };
    //Initializing Datalabel
    public dataLabel: Object = {
        visible: true,
        position: 'Inside', name: 'text',
        font: {
            fontWeight: '600'
        }
    };
    public load(args: IAccLoadedEventArgs): void {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.accumulation.theme = <AccumulationTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    };
    public startAngle: number = 0;
    public endAngle: number = 360;
    public explode: boolean = true;
    public enableAnimation: boolean = false;
    public tooltip: Object = { enable: true, format: '${point.x} : <b>${point.y}%</b>' };
    public title: string = 'Mobile Browser Statistics';
    constructor() {
        //code
    };

}