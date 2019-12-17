/**
 * Border sample
 */
import { CircularGauge, IAxisLabelRenderEventArgs } from '../../src/index';

let circulargauge: CircularGauge = new CircularGauge({
    axes: [{
        lineStyle: { width: 10, color: 'transparent' },
        labelStyle: {
            position: 'Inside', useRangeColor: false,
            font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
        },
        majorTicks: { height: 10, offset: 5, color: '#9E9E9E' },
        minorTicks: { height: 0 },
        startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
        ranges: [
            { start: 0, end: 40, color: '#30B32D' },
            { start: 40, end: 80, color: '#FFDD00' },
            { start: 80, end: 120, color: '#F03E3E' }
        ],
        pointers: [{
            animation: { enable: false },
            value: 65,
        }]
    }],
    axisLabelRender: function (args: IAxisLabelRenderEventArgs) {
        if (args.value === 20) {
            args.text = "twenty";
        }
    }
});
circulargauge.appendTo('#static-gauge');