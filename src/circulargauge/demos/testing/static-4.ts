/**
 * Start End pointer cap tail length width customized sample
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
            annotations: [{
                content: '<div><span style="font-size:14px; color:#9E9E9E; font-family:Regular">Speedometer</span></div>',
                radius: '30%', angle: 0, zIndex: '1'
            }, {
                content: '<div><span style="font-size:20px; color:#424242; font-family:Regular">100 MPH</span></div>',
                radius: '40%', angle: 180, zIndex: '1'
            }],
            startAngle: 0, endAngle: 360, minimum: 0, maximum: 120, radius: '100%',
            ranges: [{ start: 0, end: 40, color: 'orange' }, { start: 40, end: 80, color: 'blue' },
            { start: 80, end: 120, color: 'green' }],
            pointers: [{
                animation: { enable: false },
                value: 100, radius: '70%', color: '#757575', pointerWidth: 14,
                cap: { radius: 9, color: 'lime' }, needleTail: { length: '10%' }
            }]
        }]
    });
    circulargauge.appendTo('#static-gauge');
};