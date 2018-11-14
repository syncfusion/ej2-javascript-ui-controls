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
            width: 0
        },
        labelStyle: {
            font: {
                color: '#000000',
            },
            format: 'C',
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

document.getElementById('label').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('label');
    if(ele.value == 'format') {
        gauge.axes[0].labelStyle.format = 'C';
    } else if (ele.value == 'offset') {
        gauge.axes[0].labelStyle.offset = 4;
    } else {
        gauge.axes[0].labelStyle.useRangeColor = true;
    }
    gauge.refresh();
};





