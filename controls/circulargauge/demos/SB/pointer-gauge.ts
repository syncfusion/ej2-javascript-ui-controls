/**
 * Pointer Customization Sample
 */
import { CircularGauge, Annotations, ILoadedEventArgs, GaugeTheme } from '../../src/index';
CircularGauge.Inject(Annotations);
export function gauge1(): CircularGauge {
    let gauge1: CircularGauge = new CircularGauge({
        // custom code start
        load: (args: ILoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
        },
        // custom code end
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
                animation: { enable: true, duration: 1000 }
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
        // custom code start
        load: (args: ILoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
        },
        // custom code end
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
                color: 'rgb(0,171,169)'
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
        // custom code start
        load: (args: ILoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
        },
        // custom code end
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
                animation: { enable: true, duration: 1000 },
                value: 70,
                markerWidth: 15,
                markerHeight: 15,
                color: '#1E7145',
                border: {
                    width: 1,
                    color: ' #1E7145'
                }
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
        // custom code start
        load: (args: ILoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
        },
        // custom code end
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
                animation: { enable: true, duration: 900 },
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

export function gauge6(): CircularGauge {
    let gauge6: CircularGauge = new CircularGauge({
        // custom code start
        load: (args: ILoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
        },
        // custom code end
        title: 'Speedometer',
        titleStyle: { size: '18px' },
        centerY: '75%',
        axes: [{
            radius: '120%',
            minimum: 0,
            maximum: 120,
            lineStyle: { width: 0 },
            majorTicks: { width: 0, },
            minorTicks: { width: 0 },
            labelStyle: { useRangeColor: false, position: 'Outside', autoAngle: true,
            font: { size: '13px', fontFamily: 'Roboto' } },
            startAngle: 270, endAngle: 90,
            pointers: [{
                animation: { enable: true, duration: 900 },
                value: 40,
                radius: '80%',
                color: '#757575',
                pointerWidth: 7,
                cap: {
                    radius: 8,
                    color: '#757575',
                    border: { width: 0 }
                },
                needleTail: {
                    color: '#757575',
                    length: '15%'
                },
            }],
            annotations: [
                {
                    content: '#pointerValue',
                    angle: 0, zIndex: '1',
                    radius: '30%'
                }
            ],
            ranges: [
                {
                    start: 0,
                    end: 20,
                    startWidth: 5, endWidth: 10,
                    radius: '102%',
                    color: '#82b944',
                },
                {
                    start: 20,
                    end: 40,
                    startWidth: 10, endWidth: 15,
                    radius: '102%',
                    color: '#a1cb43',
                }, {
                    start: 40,
                    end: 60,
                    startWidth: 15, endWidth: 20,
                    radius: '102%',
                    color: '#ddec12',
                },
                {
                    start: 60,
                    end: 80,
                    startWidth: 20, endWidth: 25,
                    radius: '102%',
                    color: '#ffbc00',
                },
                {
                    start: 80,
                    end: 100,
                    startWidth: 25, endWidth: 30,
                    radius: '102%',
                    color: '#ff6000',
                },
                {
                    start: 100,
                    end: 120,
                    startWidth: 30, endWidth: 35,
                    radius: '102%',
                    color: 'red',
                }
            ]
        }],
    });
    return gauge6;
}

export function gauge5(): CircularGauge {
    let gauge5: CircularGauge = new CircularGauge({
        // custom code start
        load: (args: ILoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
        },
        // custom code end
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
                animation: { enable: true, duration: 900 },
                value: 40,
                color: '#067bc2',
                pointerWidth: 6,
                cap: { radius: 0 },
                needleTail: { length: '4%', color: '#067bc2' }
            }, {
                radius: '100%',
                type: 'RangeBar',
                animation: { enable: true, duration: 900 },
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
