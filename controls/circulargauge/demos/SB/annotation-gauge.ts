/**
 * Annotations sample
 */
import { CircularGauge, ILoadedEventArgs, GaugeTheme } from '../../src/index';
import { Annotations } from '../../src/index';
import { Browser } from '@syncfusion/ej2-base';
CircularGauge.Inject(Annotations);
// custom code start
//tslint:disable
// custom code end
export function gauge1(): CircularGauge {
    let gauge1: CircularGauge = new CircularGauge({
        centerY: '45%',
        resized: (args: object) => {
            location.reload();
        },
        titleStyle: { color: 'black', size: '16px' },
        // custom code start
        load: (args: ILoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
        },
        // custom code end
        axes: [
            {
                startAngle: 0, endAngle: 0,
                lineStyle: { width: 0 }, radius: Browser.isDevice ? '90%' : '70%',
                ranges: [
                    {
                        start: 0, end: 3,
                        color: 'rgb(128,128,128)'
                    }, {
                        start: 3, end: 12,
                        color: 'rgb(192,192,192)'
                    }
                ],
                annotations: [{
                    angle: 270, radius: '50%', zIndex: '1',
                    content: '<div id="minutes" style="width:75px;height:75px;"></div>'
                }, {
                    angle: 180, radius: '50%', zIndex: '1',
                    content: '<div id="seconds" style="width:75px;height:75px;"></div>'
                }, {
                    angle: 90, zIndex: '1',
                    radius: '40%',
                    content: '<div id="hr" style="background-color:rgb(128,128,128); color:white;font-size:12px;">11:11 AM</div>'
                }, {
                    angle: 360, radius: '50%', zIndex: '1',
                    content: '<div id="tm" style="font-size:10px;">21-06-17</div>'
                }],
                labelStyle: {
                    hiddenLabel: 'First', autoAngle: false
                }, majorTicks: {
                    width: 2, height: 14, interval: 1
                }, minorTicks: {
                    height: 4, width: 1, interval: 0.2
                },
                minimum: 0, maximum: 12,
                pointers: [{
                    pointerWidth: 5, radius: '40%',
                    border: { width: 0 },
                    cap: { radius: 0, border: { width: 0 } },
                    needleTail: { length: '0%' }, animation: { enable: false }
                }, {
                    radius: '60%', pointerWidth: 5,
                    border: {
                        width: 0
                    },
                    cap: {
                        radius: 0,
                        border: {
                            width: 0
                        }
                    },
                    needleTail: {
                        length: '0%'
                    }, animation: {
                        enable: false
                    }
                }, {
                    radius: '70%',
                    pointerWidth: 1,
                    cap: {
                        radius: 4,
                        border: {
                            width: 2,
                        }
                    },
                    border: {
                        width: 2,
                    },
                    needleTail: {
                        length: '20%',
                        border: {
                            width: 2,
                        },
                    }, animation: {
                        enable: false,
                        duration: 500
                    }
                }]
            }
        ]
    });
    return gauge1;
}
export function gauge2(): CircularGauge {
    let gauge2: CircularGauge = new CircularGauge({
        background: 'transparent',
        titleStyle: { color: 'black' },
        // custom code start
        load: (args: ILoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
        },
        // custom code end
        axes: [
            {
                startAngle: 0, endAngle: 0,
                lineStyle: { width: 0 },
                ranges: [
                    {
                        start: 0, end: 3,
                        startWidth: 4, endWidth: 4,
                        color: 'rgb(128,128,128)'
                    }, {
                        start: 3, end: 12,
                        startWidth: 4, endWidth: 4,
                        color: 'rgb(192,192,192)'
                    }
                ],
                annotations: [{
                    angle: 270,
                    radius: '40%',
                    content: null
                }, {
                    angle: 180,
                    radius: '40%',
                    content: null
                }, {
                    angle: 90,
                    radius: '50%',
                    content: null
                }, {
                    angle: 360, zIndex: '1',
                    radius: '35%',
                    content: '<div id="tm" style="font-size:10px;">21-06-17</div>'
                }],
                labelStyle: {
                    hiddenLabel: 'First',
                    font: {
                        size: '0px'
                    },
                    autoAngle: false
                }, majorTicks: {
                    width: 1,
                    height: 5,
                    interval: 1
                }, minorTicks: {
                    height: 3,
                    width: 0.5,
                    interval: 0.2
                },
                minimum: 0,
                maximum: 12,
                pointers: [{
                    radius: '70%',
                    pointerWidth: 2,
                    cap: {
                        radius: 2,
                        border: {
                            width: 0.2,
                        }
                    },
                    needleTail: {
                        length: '10%'
                    }, animation: {
                        enable: false,
                        duration: 500
                    }
                }]
            }
        ]
    });
    return gauge2;
}
