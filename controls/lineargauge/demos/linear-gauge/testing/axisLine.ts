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
            width: 5
        },
        labelStyle: {
            font: {
                color: 'green', opacity: 5, size: '16px'
            }
        },
        majorTicks: {
            interval: 20,
            color: '#9e9e9e'
        },
        minorTicks: {
            color: '#9e9e9e'
        },
        pointers: [
            {
                value: 90,
                height: 13,
                width: 13,
                roundedCornerRadius: 5,
                type: 'Bar',
                color: '#f02828'
            }
        ]
    }]
});
gauge.appendTo('#container');

document.getElementById('line').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('line');
    if(ele.value == 'color') {
        gauge.axes[0].line.color = 'blue';
    } else if (ele.value == 'dashArray') {
        gauge.axes[0].line.dashArray = '-';
    } else if (ele.value == 'height') {
        gauge.axes[0].line.height = 150;
    } else {
        gauge.axes[0].line.offset = 3;
    }
    gauge.refresh();
};





