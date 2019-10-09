/**
 * Start angle sample
 */
import { CircularGauge, Annotations } from '../../src/index';
CircularGauge.Inject(Annotations);
window.onload = () => {
    let circulargauge: CircularGauge = new CircularGauge({
        axes: [{
            lineStyle: { width: 10, color: 'transparent' },
            labelStyle: {
                position: 'Inside', useRangeColor: false,
                font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
            }, majorTicks: { height: 10, offset: 5, color: '#9E9E9E' }, minorTicks: { height: 0 },
            startAngle: 90, endAngle: 90, minimum: 0, maximum: 120, radius: '100%',
            ranges: [{ start: 0, end: 40, color: '#30B32D' }, { start: 40, end: 120, color: '#FFDD00' }],
            pointers: [{
                animation: { enable: false },
                value: 10, radius: '40%', color: '#757575', pointerWidth: 12,
                cap: { radius: 5, color: '#757575' }, needleTail: { length: '30%' }
            }]
        }]
    });
    circulargauge.appendTo('#static-gauge');
};