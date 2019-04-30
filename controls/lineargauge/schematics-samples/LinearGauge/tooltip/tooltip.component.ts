//tslint:disable
import { Component, ViewChild } from '@angular/core';
import {  LinearGaugeTheme,LinearGaugeComponent } from '@syncfusion/ej2-angular-lineargauge';
import { ITooltipRenderEventArgs, IAxisLabelRenderEventArgs, ILoadedEventArgs, ILoadEventArgs, IResizeEventArgs } from '@syncfusion/ej2-lineargauge';

@Component({
    selector: 'control-content',
    templateUrl: 'tooltip.component.html',
    styleUrls: ['tooltip.component.css']
})
export class TooltipComponent {
    @ViewChild('gauge')
    public gauge: LinearGaugeComponent;
    public load(args: ILoadedEventArgs): void {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.gauge.theme = <LinearGaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    }
    //Initializing Annotation
    public Annotation: Object[] = [
        {
            content: '<div id="first"><h1 style="font-size:15px">Inches</h1></div>',
            axisIndex: 0,
            axisValue: 5.4,
            x: 35,
            y: -58,
            zIndex: '1'
        },
        {
            content: '<div id="second"><h1 style="font-size:15px">Centimeters</h1></div>',
            axisIndex: 1,
            axisValue: 16.5,
            x: 50,
            y: 52,
            zIndex: '1'
        }
    ];
    public Container: Object = {
        width: 140,
        border: {
            width: 2,
            color: '#a6a6a6'
        }
    };
    public Tooltip: Object = {
        enable: true,
        fill: '#fffff',
        textStyle: {
            color: '#fffff'
        }
    };

    public Axes: Object = [
        {
            minimum: 0,
            maximum: 10,
            line: {
                offset: 140
            },
            majorTicks: {
                interval: 1
            },
            minorTicks: {
                interval: 0.2
            },
            labelStyle: {
                font: {
                    color: '#000000'
                }
            },
            pointers: [{
                type: 'Bar',
                value: 5.4,
                offset: 15,
                color: '#ff66b3'
            }],
        },
        {
            opposedPosition: true,
            minimum: 0,
            maximum: 25,
            line: {
                offset: -140,
            },
            labelStyle: {
                font: {
                    color: '#000000'
                }
            },
            majorTicks: {
                interval: 1
            },
            minorTicks: {
                interval: 0.2
            },
            pointers: [{
                type: 'Bar',
                offset: -15,
                value: 16.5,
                color: '#4d94ff'
            }]
        }
    ];

    constructor() {
        //code
    };
    public labelRender(args: IAxisLabelRenderEventArgs): void {
        if (args.axis.visibleRange.min === args.value || args.axis.visibleRange.max === args.value) {
            args.text = '';
        }
    }
    public renderTooltip(args: ITooltipRenderEventArgs): void {
        args.content = (args.axis.visibleRange.max === 25) ? Number(args.content).toFixed(1) + ' cm' : Number(args.content).toFixed(1) + ' in';
    }

    public gaugeLoaded(args: ILoadedEventArgs): void {
        if (document.getElementById('tooltipContainer')) {
            if (args.gauge.availableSize.width < 500) {
                document.getElementById('tooltipContainer_Annotation_0').style.transform = 'rotate(270deg)';
                document.getElementById('tooltipContainer_Annotation_1').style.transform = 'rotate(270deg)';
            } else {
                document.getElementById('tooltipContainer_Annotation_0').style.transform = '';
                document.getElementById('tooltipContainer_Annotation_1').style.transform = '';
            }
        }
    }

    public gaugeLoad(args: ILoadEventArgs): void {
        let width: number = Number(this.gauge.element.offsetWidth);
        if (width < 500) {
            this.gauge.axes[1].majorTicks.interval = 2;
            this.gauge.axes[1].minorTicks.interval = 1;
            this.gauge.orientation = 'Vertical';
            this.gauge.annotations[0].x = -57;
            this.gauge.annotations[0].y = -30;
            this.gauge.annotations[1].x = 50;
            this.gauge.annotations[1].y = -45;
        } else {
            this.gauge.axes[1].majorTicks.interval = 1;
            this.gauge.axes[1].minorTicks.interval = 0.5;
            this.gauge.orientation = 'Horizontal';
            this.gauge.annotations[0].x = 35;
            this.gauge.annotations[0].y = -58;
            this.gauge.annotations[1].x = 50;
            this.gauge.annotations[1].y = 52;
        }
    }

    public gaugeResized(args: IResizeEventArgs) {
        if (args.currentSize.width < 500) {
            this.gauge.axes[1].majorTicks.interval = 2;
            this.gauge.axes[1].minorTicks.interval = 1;
            this.gauge.orientation = 'Vertical';
            this.gauge.annotations[0].x = -57;
            this.gauge.annotations[0].y = -30;
            this.gauge.annotations[1].x = 50;
            this.gauge.annotations[1].y = -45;
        } else {
            this.gauge.axes[1].majorTicks.interval = 1;
            this.gauge.axes[1].minorTicks.interval = 0.5;
            this.gauge.orientation = 'Horizontal';
            this.gauge.annotations[0].x = 35;
            this.gauge.annotations[0].y = -58;
            this.gauge.annotations[1].x = 50;
            this.gauge.annotations[1].y = 52;
        }
    }
}