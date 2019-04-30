import { LinearGauge, Annotations } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations);

/**
 * Linear Gauge Range Sample
 */
export function linear(): LinearGauge {
    let gauge: LinearGauge = new LinearGauge({
        orientation: 'Horizontal',
        axes: [{
            labelStyle: {
                format: '{value}%',
                font: {
                    color: '#424242'
                },
                offset: 30
            },
            line: {
                width: 0
            },
            pointers: [
                {
                    value: 35,
                    height: 10,
                    width: 10,
                    markerType: 'Triangle',
                    placement: 'Near',
                    offset: -40,
                    color: '#757575'
                }
            ],
            majorTicks: {
                height: 0
            },
            minorTicks: {
                height: 0
            },
            ranges: [{
                start: 0,
                end: 32,
                color: '#30B32D',
                startWidth: 15,
                endWidth: 15
            },
            {
                start: 32,
                end: 68,
                startWidth: 15,
                endWidth: 15,
                color: '#FFDF00'
            },
            {
                start: 68,
                end: 100,
                startWidth: 15,
                endWidth: 15,
                color: '#F03E3E'
            }]
        }],
        annotations: [{
            content: '<div id="pointer" style="width:20px"><h1 style="font-size:18px;color:#424242">35</h1></div>',
            axisIndex: 0, zIndex: '1',
            axisValue: 35,
            y: -50
        }]
    });
    return gauge;
}