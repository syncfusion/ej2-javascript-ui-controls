/**
 * Pointer Customization Sample
 */
import { CircularGauge, Annotations } from '../../src/index';
CircularGauge.Inject(Annotations);
export function gauge1(): CircularGauge {
    let gauge1: CircularGauge = new CircularGauge({
        axes: [{
            startAngle: 270,
            endAngle: 90,
            lineStyle: { width: 3, color: '#ff5985' },
            labelStyle: {
                position: 'Outside',
                font: { size: '0px', color: '#ff5985' }
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
                type: 'RangeBar',
                value: 66,
                radius: '90%',
                color: '#ff5985',
                pointerWidth: 10,
                animation: { enable: false }
            }],
            annotations: [
                {
                    angle: 180, zIndex: '1',
                    radius: '20%',
                    content: '<div style="color:#757575; font-family:Roboto; font-size:14px;">Range Bar</div>'
                }
            ]
        }],
    });
    return gauge1;
}

export function gauge2(): CircularGauge {
    let gauge2: CircularGauge = new CircularGauge({
        axes: [{
            startAngle: 270,
            endAngle: 90,
            lineStyle: { width: 3, color: '#01aebe' },
            labelStyle: {
                position: 'Outside',
                font: { size: '0px', color: '#01aebe' }
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
                radius: '100%',
                value: 80,
                type: 'Marker',
                markerShape: 'InvertedTriangle',
                markerWidth: 15,
                markerHeight: 15,
                color: 'rgb(0,171,169)',
                animation: { enable: false }
            }],
            annotations: [
                {
                    angle: 180, zIndex: '1',
                    radius: '20%',
                    content: '<div style="color:#757575; font-family:Roboto; font-size:14px;">Inverted Triangle</div>'
                }
            ]
        }],
    });
    return gauge2;
}

export function gauge3(): CircularGauge {
    let gauge3: CircularGauge = new CircularGauge({
        axes: [{
            startAngle: 270,
            endAngle: 90,
            lineStyle: { width: 3, color: '#1E7145' },
            labelStyle: {
                position: 'Outside',
                font: { size: '0px', color: '#1E7145' }
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
                type: 'Marker',
                markerShape: 'Triangle',
                radius: '100%',
                value: 70,
                markerWidth: 15,
                markerHeight: 15,
                color: '#1E7145',
                border: {
                    width: 1,
                    color: ' #1E7145'
                },
                animation: { enable: false }
            }],
            annotations: [
                {
                    angle: 180, zIndex: '1',
                    radius: '20%',
                    content: '<div style="color:#757575; font-family:Roboto; font-size:14px;">Triangle</div>'
                }
            ]
        }],
    });
    return gauge3;
}

export function gauge4(): CircularGauge {
    let gauge4: CircularGauge = new CircularGauge({
        centerY: '40%',
        axes: [{
            startAngle: 270,
            endAngle: 90,
            lineStyle: { width: 3, color: '#9250e6' },
            labelStyle: {
                position: 'Outside',
                font: { size: '0px', color: '#9250e6' }
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
                radius: '100%',
                animation: { enable: false },
                value: 70,
                color: '#923C99',
                pointerWidth: 6,
                cap: { radius: 0 },
                needleTail: { length: '4%', color: '#923C99' }
            }],
            annotations: [
                {
                    angle: 180, zIndex: '1',
                    radius: '20%',
                    content: '<div style="color:#757575; font-family:Roboto; font-size:14px;">Needle</div>'
                }
            ]
        }],
    });
    return gauge4;
}

export function gauge5(): CircularGauge {
    let gauge5: CircularGauge = new CircularGauge({
        centerY: '40%',
        axes: [{
            startAngle: 270,
            endAngle: 90,
            lineStyle: { width: 0 },
            labelStyle: {
                position: 'Outside',
                font: { size: '0px', color: '#067bc2' }
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
                radius: '100%',
                animation: { enable: false },
                value: 40,
                color: '#067bc2',
                pointerWidth: 6,
                cap: { radius: 0 },
                needleTail: { length: '4%', color: '#067bc2' }
            }, {
                radius: '100%',
                type: 'RangeBar',
                animation: { enable: false },
                value: 40,
                color: '#067bc2',
                pointerWidth: 5
            }],
            annotations: [
                {
                    angle: 180, zIndex: '1',
                    radius: '20%',
                    content: '<div style="color:#757575; font-family:Roboto; font-size:14px;">Live Update</div>'
                }
            ]
        }],
    });
    return gauge5;
}
