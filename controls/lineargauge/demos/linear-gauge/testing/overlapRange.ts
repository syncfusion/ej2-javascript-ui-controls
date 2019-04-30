import { LinearGauge, Annotations } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations);

/**
 * Linear Gauge Range Sample
 */
let gauge: LinearGauge = new LinearGauge({
    orientation: 'Horizontal',
    axes: [{
        labelStyle: {
            font: {
                color: '#000000',
            },
            offset: -15,
        },
        line: {
            width: 0
        },
        majorTicks: {
            height: 0
        },
        minorTicks: {
            height: 0
        },
        ranges: [{
            start: 10,
            end: 70,
            color: '#30B32D',
            startWidth: 15,
            endWidth: 15,
        },
        {
            start: 50,
            end: 90,
            startWidth: 15,
            endWidth: 15,
            color: '#FFDF00'
        }]
    }],
});
gauge.appendTo('#container');