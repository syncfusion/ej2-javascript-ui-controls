/**
 * Anti clock wise single range line style sample
 */
import { CircularGauge, Annotations } from '../../src/index';
CircularGauge.Inject(Annotations);
window.onload = () => {
    let circulargauge: CircularGauge = new CircularGauge({
        axes: [{
            startAngle: 0, endAngle: 360, minimum: 0, maximum: 120, radius: '100%', direction: 'AntiClockWise',
            lineStyle: { color: 'black', dashArray: '10, 10', width: 3},
            ranges: [{ start: 50, end: 90, color: 'orange' }]
        }]
    });
    circulargauge.appendTo('#static-gauge');
};