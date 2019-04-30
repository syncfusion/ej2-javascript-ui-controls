/**
 * Annotations
 */
import { CircularGauge, Annotations } from '../../src/index';
import { Browser } from '@syncfusion/ej2-base';
CircularGauge.Inject(Annotations);

export function gauge1(): CircularGauge {
    let gauge1: CircularGauge = new CircularGauge({
        centerY: '45%',
        resized: (args: object) => {
            location.reload();
        },
        titleStyle: { color: 'black', size: '16px' },
        axes: [
            {
                startAngle: 0, endAngle: 0,
                lineStyle: { width: 0 }, radius: Browser.isDevice ? '90%' : '70%',
                ranges: [
                    {
                        start: 0, end: 3,
                        color: 'rgba(29,29,29,0.6)'
                    }, {
                        start: 3, end: 12,
                        color: 'rgba(226, 226, 226, 0.6)'
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
                    content: '<div id="hr" style="background-color:rgba(29,29,29,0.6); color:white;font-size:12px;">11:11 AM</div>'
                }, {
                    angle: 360, radius: '50%', zIndex: '1',
                    content: '<div id="tm" style="font-size:10px;">21-06-17</div>'
                }],
                labelStyle: {
                    hiddenLabel: 'First', font: { color: 'rgb(29,29,29)' }, autoAngle: false
                }, majorTicks: {
                    width: 2, height: 14, interval: 1, color: 'rgb(29,29,29)'
                }, minorTicks: {
                    height: 4, width: 1, interval: 0.2, color: 'rgb(29,29,29)'
                },
                minimum: 0, maximum: 12,
                pointers: [{
                    pointerWidth: 5, radius: '40%', color: 'rgba(29,29,29,0.8)',
                    border: { width: 0, color: '#679EEF' },
                    cap: { radius: 0, border: { width: 0, color: 'red' } },
                    needleTail: { length: '0%' }, animation: { enable: false }
                }, {
                    radius: '60%', pointerWidth: 5, color: 'rgba(29,29,29,0.8)',
                    border: {
                        width: 0,
                        color: 'rgba(29,29,29,0.8)'
                    },
                    cap: {
                        color: 'rgba(29,29,29,0.8)',
                        radius: 0,
                        border: {
                            width: 0,
                            color: 'red'
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
                    color: 'rgba(29,29,29,0.8)',
                    cap: {
                        color: 'white',
                        radius: 4,
                        border: {
                            width: 2,
                            color: 'rgba(29,29,29,0.8)'
                        }
                    },
                    border: {
                        width: 2,
                        color: 'rgba(29,29,29,0.8)'
                    },
                    needleTail: {
                        color: 'rgba(29,29,29,0.8)',
                        length: '20%',
                        border: {
                            width: 2,
                            color: 'rgba(29,29,29,0.8)'
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
        titleStyle: { color: 'black' },
        axes: [
            {
                startAngle: 0, endAngle: 0,
                lineStyle: { width: 0 },
                ranges: [
                    {
                        start: 0, end: 3,
                        startWidth: 4, endWidth: 4,
                        color: 'rgba(29,29,29,0.4)'
                    }, {
                        start: 3, end: 12,
                        startWidth: 4, endWidth: 4,
                        color: 'rgba(168,145,102,0.1)'
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
                        color: '#8c8c8c',
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
                    color: 'rgba(29,29,29,1)',
                    cap: {
                        color: 'rgba(29,29,29,1)',
                        radius: 2,
                        border: {
                            width: 0.2,
                            color: 'rgba(168,145,102,1)'
                        }
                    },
                    needleTail: {
                        color: 'rgba(168,145,102,1)',
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