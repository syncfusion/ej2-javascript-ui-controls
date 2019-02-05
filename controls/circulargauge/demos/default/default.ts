/**
 * Default sample
 */
import { CircularGauge } from '../../src/index';
window.onload = () => {
    let circulargauge: CircularGauge = new CircularGauge({
        axes: [{
            radius: '80%',
            startAngle: 230,
            endAngle: 130,
            majorTicks: {
                width: 0
            },
            lineStyle: { width: 8, color: '#E0E0E0' },
            minorTicks: {
                width: 0
            },
            labelStyle: {
                font: {
                    color: '#424242',
                    fontFamily: 'Roboto',
                    size: '12px',
                    fontWeight: 'Regular'
                },
                offset: -5
            },
            pointers: [{
                animation: { enable: false },
                value: 60,
                radius: '60%',
                color: '#757575',
                pointerWidth: 7,
                cap: {
                    radius: 8,
                    color: '#757575',
                    border: { width: 0 }
                },
                needleTail: {
                    length: '25%'
                }
            }]
        }]
    });
    circulargauge.appendTo('#gauge');
};