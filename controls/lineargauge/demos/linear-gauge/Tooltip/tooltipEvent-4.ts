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
    orientation: 'Horizontal',
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
    tooltipRender: renderTooltip,
});
gauge.appendTo('#container');

function renderTooltip(args: ITooltipRenderEventArgs): void {
    if(args.pointer.value === 5.4) {
        args.content = '5.4 Inches'
     }
}