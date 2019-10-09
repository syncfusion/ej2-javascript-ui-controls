/**
 * Gauge Customization
 */
import { CircularGauge, Annotations } from '../../src/index';
CircularGauge.Inject(Annotations);

export function gauge1(): CircularGauge {
    let gauge1: CircularGauge = new CircularGauge({
        centerY: '70%',
        axes: [{
            annotations: [{
                content: '<div style="color:#666666;font-size:35px;">1800</div>',
                angle: 0,
                zIndex: '1',
                radius: '110%'
            }],
            lineStyle: { width: 0 },
            startAngle: 300, endAngle: 60,
            radius: '80%',
            labelStyle: { font: { size: '0px' } },
            majorTicks: { width: 0 },
            minorTicks: { height: 0 },
            minimum: 999, maximum: 2000,
            ranges: [{
                start: 1000, end: 2000,
                radius: '90%',
                startWidth: 30, endWidth: 30,
                color: '#E0E0E0'
            }],
            pointers: [{
                type: 'RangeBar',
                value: 1800, radius: '90%',
                color: '#FFDD00', animation: { duration: 0 },
                pointerWidth: 30
            }, {
                radius: '90%', value: 1800,
                color: '#424242',
                animation: { duration: 0 },
                pointerWidth: 9,
                cap: { radius: 10, color: '#424242', border: { width: 0 } }
            }]
        }]
    });
    return gauge1;
}

export function gauge2(): CircularGauge {
    let gauge2: CircularGauge = new CircularGauge({
        axes: [{
            annotations: [{
                content: '<div style="color:#666666;font-size:35px;">50.5GB</div>',
                angle: 180, radius: '0%', zIndex: '1',
            }, {
                content: '<div style="color:#757575;font-size:15px;">Used</div>',
                angle: 180, radius: '25%', zIndex: '1',
                textStyle: {
                    fontFamily: 'Roboto',
                    color: '#9E9E9E',
                    fontStyle: 'Bold',
                    fontWeight: 'Regular',
                    size: '14px'
                }
            }],
            lineStyle: { width: 0 },
            startAngle: 180, endAngle: 180,
            radius: '80%',
            labelStyle: { font: { size: '0px' } },
            majorTicks: { width: 0 },
            minorTicks: { height: 0 },
            minimum: 0, maximum: 100,
            ranges: [{
                start: 0, end: 100,
                radius: '80%', startWidth: 30,
                endWidth: 30, color: '#E0E0E0'
            }],
            pointers: [{
                type: 'RangeBar',
                value: 50.5, radius: '80%',
                color: '#FF2680', animation: { duration: 0 },
                pointerWidth: 30
            }]
        }]
    });
    return gauge2;
}