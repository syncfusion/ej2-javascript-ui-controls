import { LinearGauge, Annotations } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations);

    let gauge1: LinearGauge = new LinearGauge(firstGauge());
    gauge1.appendTo('#container1');
    let gauge2: LinearGauge = new LinearGauge(secondGauge());
    gauge2.appendTo('#container2');
    let gauge3: LinearGauge = new LinearGauge(thirdGauge());
    gauge3.appendTo('#container3');
    let gauge4: LinearGauge = new LinearGauge(fourthGauge());
    gauge4.appendTo('#container4');

export function firstGauge(): LinearGauge {
    let gauge1: LinearGauge = new LinearGauge({
        orientation: 'Horizontal',
        axes: [{
            line: {
                color: '#9E9E9E'
            },
            pointers: [{
                value: 80,
                offset: 10,
                height: 13,
                width: 13,
                color: '#424242',
            }],
            majorTicks: {
                interval: 10,
                color: '#9E9E9E',
            },
            minorTicks: {
                color: '#9E9E9E'
            },
            labelStyle: {
                font: {
                    color: '#424242'
                }
            }
        }]
    });
    return gauge1;
}

export function secondGauge(): LinearGauge {
    let gauge2: LinearGauge = new LinearGauge({
        orientation: 'Horizontal',
        container: {
            width: 30,
            backgroundColor: '#e0e0e0',
            border: {
                width: 0
            },
            offset: -20
        },
        axes: [{
            line: {
                offset: 30
            },
            majorTicks: {
                interval: 10,
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
                offset: -50,
                height: 15,
                width: 15,
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
        }]
    });
    return gauge2;
}

export function thirdGauge(): LinearGauge {
    let gauge3: LinearGauge = new LinearGauge({
        orientation: 'Horizontal',
        axes: [{
            line: {
                offset: -20,
                color: '#9E9E9E'
            },
            pointers: [
                {
                    value: 70,
                    offset: 20,
                    height: 13,
                    width: 13,
                    color: '#424242',
                },
                {
                    value: 70,
                    type: 'Bar',
                    height: 10,
                    color: 'red'
                }
            ],
            majorTicks: {
                interval: 10,
                color: '#9E9E9E'
            },
            minorTicks: {
                color: '#9E9E9E'
            },
            labelStyle: {
                font: {
                    color: '#424242'
                }
            }
        }]
    });
    return gauge3;
}

export function fourthGauge(): LinearGauge {
    let gauge4: LinearGauge = new LinearGauge({
        orientation: 'Horizontal',
        container: {
            width: 30,
            offset: 0,
            backgroundColor: '#e0e0e0'
        },
        axes: [{
            line: {
                width: 0
            },
            majorTicks: {
                interval: 10,
                height: 0
            },
            minorTicks: {
                height: 0
            },
            labelStyle: {
                font: {
                    color: '#424242',
                },
                offset: 55
            },
            pointers: [
                {
                    value: 60,
                    height: 15,
                    width: 15,
                    color: '#424242',
                    placement: 'Near',
                    offset: -50,
                    markerType: 'Triangle'
                },
                {
                    type: 'Bar',
                    color: '#ff9200',
                    value: 60,
                    height: 30
                }
            ],
        }]
    });
    return gauge4;
}
