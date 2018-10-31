/**
 * Border sample
 */
import { CircularGauge, Annotations, ILoadedEventArgs } from '../../src/index';
CircularGauge.Inject(Annotations);
window.onload = () => {
    let circulargauge: CircularGauge = new CircularGauge({
        axes: [{
            lineStyle: { width: 10, color: 'transparent' },
            labelStyle: {
                position: 'Inside', useRangeColor: false,
                font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
            }, majorTicks: { height: 10, offset: 5, color: '#9E9E9E', useRangeColor: true }, minorTicks: { height: 0 },
            annotations: [{
                content: '<div><span style="font-size:20px; color:#424242; font-family:Regular">65 MPH</span></div>',
                radius: '40%', angle: 180, zIndex: '1'
            }],
            startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
            ranges: [{ start: 0, end: 40, color: '#30B32D' }, { start: 40, end: 80, color: '#FFDD00' },
            { start: 80, end: 120, color: '#F03E3E' }, { start: 80, end: 120, color: '#F03E3E' }],
            pointers: [{
                animation: { enable: false }, type: 'RangeBar',
                value: 65, radius: '60%', color: '#757575', pointerWidth: 10,
                cap: { radius: 7, color: '#757575' }, needleTail: { length: '20%' }
            }]
        }]
    });
    circulargauge.appendTo('#static-gauge');
};