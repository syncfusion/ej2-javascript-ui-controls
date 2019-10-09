import { LinearGauge, ContainerType, Orientation } from '../../../src/linear-gauge/index';

let gauge: LinearGauge = new LinearGauge({
    title: 'Temperature Measure',
    container: {
        width: 13,
        roundedCornerRadius: 5,
        type: 'Thermometer'
    },
    axes: [{
        minimum: 0,
        maximum: 180,
        line: {
            width: 2
        },
        labelStyle: {
            font: {
                color: '#000000'
            }
        },
        majorTicks: {
            color: '#000000',
        },
        minorTicks: {
            color: '#000000',
        },
        pointers: [
            {
                value: 90,
                height: 13,
                width: 13,
                roundedCornerRadius: 5,
                type: 'Bar',
                color: '#f02828',
            }
        ]
    }]
});
gauge.appendTo('#container');

document.getElementById('majortick').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('majortick');
    if(ele.value == 'interval') {
        gauge.axes[0].majorTicks.interval = 30;
    } else if(ele.value == 'color') {
        gauge.axes[0].majorTicks.color = 'green';
    } else if(ele.value == 'height') {
        gauge.axes[0].majorTicks.height = 50;
    } else if(ele.value == 'width') {
        gauge.axes[0].majorTicks.width = 7;
    } else {
        gauge.axes[0].majorTicks.offset = 5;
    }
    gauge.refresh();
};

document.getElementById('minortick').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('minortick');
    if(ele.value == 'interval') {
        gauge.axes[0].minorTicks.interval = 20;
    } else if(ele.value == 'color') {
        gauge.axes[0].minorTicks.color = 'blue';
    } else if(ele.value == 'height') {
        gauge.axes[0].minorTicks.height = 30;
    } else if(ele.value == 'width') {
        gauge.axes[0].minorTicks.width = 5;
    } else {
        gauge.axes[0].minorTicks.offset = 2;
    }
    gauge.refresh();
};