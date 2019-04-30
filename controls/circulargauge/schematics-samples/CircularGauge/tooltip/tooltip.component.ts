//tslint:disable
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { CircularGaugeComponent } from '@syncfusion/ej2-angular-circulargauge';
import { ILoadedEventArgs, GaugeTheme } from '@syncfusion/ej2-angular-circulargauge';
@Component({
    selector: 'control-content',
    templateUrl: 'tooltip.component.html',
    styleUrls: ['tooltip.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TooltipComponent {
    @ViewChild('tooltipContainer')
    public circulargauge: CircularGaugeComponent;
    public cap: Object = { radius: 10, border: { color: '#33BCBD', width: 5 } };
    public animation: Object = { enable: true, duration: 1500 };
    public title: string = 'Tooltip Customization';
    //Initializing titleStyle
    public titleStyle: Object = { size: '15px', color: 'grey' };
    public majorTicks: Object = { color: 'white', offset: -5, height: 12 };
    public minorTicks: Object = { width: 0 };
    public labelStyle: Object = { useRangeColor: true, font: { color: '#424242', size: '13px', fontFamily: 'Roboto' } };
    public lineStyle: Object = { width: 0 };
    //Initializing Tooltip
    public tooltip: Object = {
        enable: true,
        enableAnimation: false
    };
    public rangeWidth: number = 10;
    
    constructor() {
        // code
    };
}
