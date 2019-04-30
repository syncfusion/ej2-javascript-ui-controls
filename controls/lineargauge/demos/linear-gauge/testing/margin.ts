import { LinearGauge, ContainerType, Orientation } from '../../../src/linear-gauge/index';

let gauge: LinearGauge = new LinearGauge({
    title: 'Temperature Measure',
    container: {
        width: 13,
        roundedCornerRadius: 5,
        type: 'Thermometer'
    },
    margin: { bottom: 20 },
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

document.getElementById('margin').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('margin');
    if(ele.value == 'bottom') {
        gauge.margin.bottom = 20;
    } else if(ele.value == 'top') {
        gauge.margin.top = 20;
    } else if(ele.value == 'left') {
        gauge.margin.left = 20;
    } else {
        gauge.margin.right = 20;
    }
    gauge.refresh();
};