import { LinearGauge, Annotations } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations);

let gauge1: LinearGauge = new LinearGauge(firstGauge());
gauge1.appendTo('#container1');
let gauge2: LinearGauge = new LinearGauge(secondGauge());
gauge2.appendTo('#container2');
let gauge3: LinearGauge = new LinearGauge(thirdGauge());
gauge3.appendTo('#container3');

export function firstGauge(): LinearGauge {
    let gauge1: LinearGauge = new LinearGauge({
        orientation: 'Horizontal',
        container: {
            width: 30,
            backgroundColor: '#e0e0e0',
            border: {
                width: 0
            },
            offset: 30
        },
        axes: [{
            line: {
                offset: 30
            },
            labelStyle: {
                font: {
                    color: '#424242',
                },
                offset: 50
            },
            pointers: [{
                value: 10,
                placement: 'Near',
                offset: -60,
                height: 10,
                width: 10,
                color: '#424242',
                markerType: 'Triangle'
            }],
            ranges: [
                {
                    start: 0,
                    end: 10,
                    startWidth: 30,
                    endWidth: 30,
                    color: '#30b32d'
                }
            ]
        }],
        annotations: [
            {
                content: '<div id="title" style="width:300px;"> <img style="float:left" src'
                    + '="../../images/Exercise Tracking.svg"/><p style="font-size:18px;color:#4285F4;float:left;margin-left:12px;'
                    + 'margin-top:4px">Exercise Tracking </p></div>',
                axisIndex: 0, zIndex: '1',
                axisValue: 0,
                x: 150,
                y: -180
            },
            {
                content: '<div id="running" style="width:100px;"><img style="height:25px;width:25px;float:left" src="../../images/' +
                    'Running.svg" /></span><p style="float:left;margin-left:10px;">Running</p></div>',
                axisIndex: 0, zIndex: '1',
                axisValue: 0,
                x: 50,
                y: -130
            },
            {
                content: '<div id="pointerText" style="width:60px;"><p style="font-size:15px;color:#30b32d;">10 MPH</p></div>',
                axisIndex: 0, zIndex: '1',
                axisValue: 10,
                y: -65
            }
        ]
    });
    return gauge1;
}

export function secondGauge(): LinearGauge {
    let gauge1: LinearGauge = new LinearGauge({
        orientation: 'Horizontal',
        container: {
            width: 30,
            backgroundColor: '#e0e0e0',
            border: {
                width: 0
            },
            offset: -50
        },
        axes: [{
            line: {
                offset: 30
            },
            labelStyle: {
                font: {
                    color: '#424242',
                },
                offset: 50
            },
            pointers: [{
                value: 28,
                height: 10,
                width: 10,
                placement: 'Near',
                offset: -60,
                color: '#424242',
                markerType: 'Triangle'
            }],
            ranges: [
                {
                    start: 0,
                    end: 28,
                    startWidth: 30,
                    endWidth: 30,
                    color: '#30b32d'
                }
            ]
        }],
        annotations: [{
            content: '<div id="cycle" style="width:100px;"><img style="height:25px;width:25px;float:left" src="../../images/'
                + 'Cycling.svg" /></span><p style="float:left;margin-left:10px;">Cycling</p></div>',
            axisIndex: 0, zIndex: '1',
            axisValue: 0,
            x: 50,
            y: -110
        },
        {
            content: '<div id="pointerText" style="width:60px;"><p style="font-size:15px;color:#30b32d;">28 MPH</p></div>',
            axisIndex: 0,
            axisValue: 28,
            y: -70
        }]
    });
    return gauge1;
}

export function thirdGauge(): LinearGauge {
    let gauge3: LinearGauge = new LinearGauge({
        orientation: 'Horizontal',
        container: {
            width: 30,
            backgroundColor: '#e0e0e0',
            border: {
                width: 0
            },
            offset: -90
        },
        axes: [{
            maximum: 10,
            line: {
                offset: 30
            },
            labelStyle: {
                font: {
                    color: '#424242',
                },
                format: '{value}k',
                offset: 50
            },
            pointers: [{
                value: 2,
                height: 10,
                width: 10,
                placement: 'Near',
                offset: -60,
                color: '#424242',
                markerType: 'Triangle'
            }],
            ranges: [
                {
                    start: 0,
                    end: 2,
                    startWidth: 30,
                    endWidth: 30,
                    color: '#30b32d'
                }
            ]
        }],
        annotations: [{
            content: '<div id="walk" style="width:100px;"><img style="height:25px;width:25px;float:left" src="../../images/' +
                'Walking.svg" /></span><p style="float:left;margin-left:10px;">Walking</p></div>',
            axisIndex: 0,
            axisValue: 0, zIndex: '1',
            x: 50,
            y: -120
        },
        {
            content: '<div id="pointerText" style="width:100px;"><p style="font-size:15px;color:#30b32d;">2000 Steps</p></div>',
            axisIndex: 0,
            axisValue: 2.2, zIndex: '1',
            y: -65
        }]
    });
    return gauge3;
}