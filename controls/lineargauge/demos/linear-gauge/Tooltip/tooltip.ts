import { LinearGauge, GaugeTooltip, Annotations } from '../../../src/linear-gauge/index';
import { IAxisLabelRenderEventArgs, ILoadedEventArgs, ILoadEventArgs } from '../../../src/linear-gauge/index';
import { ITooltipRenderEventArgs, IResizeEventArgs } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations, GaugeTooltip);

let gauge: LinearGauge = new LinearGauge({
    container: {
        width: 140,
        border: {
            width: 2,
            color: '#a6a6a6'
        }
    },
    tooltip: {
        enable: true
    },
    orientation: 'Vertical',
    axes: [
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
    ],
    annotations: [
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
    ],
    axisLabelRender: labelRender,
    tooltipRender: renderTooltip,
    load: gaugeLoad,
    loaded: gaugeLoaded,
    resized: gaugeResized,
});
gauge.appendTo('#container');

function renderTooltip(args: ITooltipRenderEventArgs): void {
    args.content = (args.axis.visibleRange.max === 25) ? args.content + ' cm' : args.content + ' in';
}

function labelRender(args: IAxisLabelRenderEventArgs): void {
    if (args.axis.visibleRange.min === args.value || args.axis.visibleRange.max === args.value) {
        args.text = '';
    }
}

function gaugeResized(args: IResizeEventArgs): void {
    if (args.currentSize.width < 500) {
        gauge.axes[1].majorTicks.interval = 2;
        gauge.axes[1].minorTicks.interval = 1;
        gauge.orientation = 'Vertical';
        gauge.annotations[0].x = -57;
        gauge.annotations[0].y = -30;
        gauge.annotations[1].x = 50;
        gauge.annotations[1].y = -45;
    } else {
        gauge.axes[1].majorTicks.interval = 1;
        gauge.axes[1].minorTicks.interval = 0.5;
        gauge.orientation = 'Horizontal';
        gauge.annotations[0].x = 35;
        gauge.annotations[0].y = -58;
        gauge.annotations[1].x = 50;
        gauge.annotations[1].y = 52;
    }
}

function gaugeLoad(args: ILoadEventArgs): void {
    let width: number = parseInt(((this.width, this.element.offsetWidth) || this.element.offsetWidth || 600), 10);
    if (width < 500) {
        gauge.axes[1].majorTicks.interval = 2;
        gauge.axes[1].minorTicks.interval = 1;
        gauge.orientation = 'Vertical';
        gauge.annotations[0].x = -57;
        gauge.annotations[0].y = -30;
        gauge.annotations[1].x = 50;
        gauge.annotations[1].y = -45;
    } else {
        gauge.axes[1].majorTicks.interval = 1;
        gauge.axes[1].minorTicks.interval = 0.5;
        gauge.orientation = 'Horizontal';
        gauge.annotations[0].x = 35;
        gauge.annotations[0].y = -58;
        gauge.annotations[1].x = 50;
        gauge.annotations[1].y = 52;
    }
}

function gaugeLoaded(args: ILoadedEventArgs): void {
    if (document.getElementById('tooltipContainer')) {
        if (gauge.availableSize.width < 500) {
            document.getElementById('tooltipContainer_Annotation_0').style.transform = 'rotate(270deg)';
            document.getElementById('tooltipContainer_Annotation_1').style.transform = 'rotate(270deg)';
        } else {
            document.getElementById('tooltipContainer_Annotation_0').style.transform = '';
            document.getElementById('tooltipContainer_Annotation_1').style.transform = '';
        }
    }
}

