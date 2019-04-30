import { LinearGauge, ContainerType, Orientation } from '../../../src/linear-gauge/index';

let gauge: LinearGauge = new LinearGauge({
    container: {
        width: 13,
        roundedCornerRadius: 5,
        type: 'Thermometer'
    },
    border: { color: 'blue', width: 2},
    axes: [{
        minimum: 0,
        maximum: 180,
        line: {
            width: 2
        },
        labelStyle: {
            font: {
                color: '#000000',
            }
        },
        majorTicks: {
            interval: 20,
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

document.getElementById('gauge').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('gauge');
    if(ele.value == 'border') {
        gauge.border.color = 'blue';
        gauge.border.width = 2;
    } else if(ele.value == 'background') {
        gauge.background = 'green';
    } else if(ele.value == 'height') {
        gauge.height = '300px';
    } else if(ele.value == 'width') {
        gauge.width = '300px';
    } else if(ele.value == 'orientation') {
        gauge.orientation = 'Horizontal';
    } else if(ele.value == 'title') {
        gauge.title = 'Linear Gauge';
    } else {
        gauge.titleStyle.color = 'red';
        gauge.titleStyle.opacity = 4;
        gauge.titleStyle.size = '15px';
    }
    gauge.refresh();
};