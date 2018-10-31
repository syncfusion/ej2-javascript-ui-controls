/**
 * Pointer sample
 */
import { CircularGauge, Annotations } from '../../src/index';
import { gauge1, gauge2, gauge3, gauge4, gauge5 } from './pointer-gauge';
window.onload = () => {
    CircularGauge.Inject(Annotations);
    let firstgauge: CircularGauge = new CircularGauge(gauge1());
    let gauge5Interval1: number;
    let gauge6Interval1: number;
    firstgauge.appendTo('#container2');
    let secondgauge: CircularGauge = new CircularGauge(gauge2());
    secondgauge.appendTo('#container1');
    let thirdgauge: CircularGauge = new CircularGauge(gauge3());
    thirdgauge.appendTo('#container3');
    let fourthgauge: CircularGauge = new CircularGauge({
        centerY: '40%',
        axes: [{
            startAngle: 270,
            endAngle: 90,
            lineStyle: { width: 3, color: '#e3a21a' },
            labelStyle: {
                position: 'Outside',
                font: { size: '0px', color: '#e3a21a' }
            }, majorTicks: {
                width: 1,
                height: 0,
                interval: 100
            }, minorTicks: {
                height: 0,
                width: 0,
            },
            radius: '90%',
            minimum: 0,
            maximum: 100,
            pointers: [{
                radius: '80%',
                value: 80,
                markerWidth: 5,
                markerHeight: 5,
                animation: { enable: false },
                color: '#e3a21a',
                pointerWidth: 10,
                cap: {
                    radius: 8,
                    color: 'white',
                    border: {
                        color: '#e3a21a',
                        width: 1
                    }
                },
                needleTail: {
                    length: '20%',
                    color: '#e3a21a'
                }
            }, {
                radius: '60%', value: 40,
                markerWidth: 5, markerHeight: 5,
                animation: { enable: false },
                color: '#ffb133',
                pointerWidth: 10,
                cap: {
                    radius: 8, color: 'white',
                    border: { color: '#ffb133', width: 1 }
                },
                needleTail: { length: '20%', color: '#e3a21a' }
            }],
            annotations: [
                {
                    angle: 180, zIndex: '1',
                    radius: '25%',
                    content: '<div style="color:#757575; font-family:Roboto; font-size:14px;">Multiple Needle</div>'
                }
            ]
        }],
    });
    fourthgauge.appendTo('#container5');
    let fifthGauge: CircularGauge = new CircularGauge(gauge4());
    fifthGauge.appendTo('#container4');
    let sixthGauge: CircularGauge = new CircularGauge(gauge5());
    sixthGauge.appendTo('#container6');
};