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
                color: '#000000'
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
    },
    {
        minimum: 0,
        maximum: 180,
        line: {
            width: 0
        },
        labelStyle: {
            font: {
                color: '#000000'
            }
        },
        majorTicks: {
            interval: 20
        },
        opposedPosition: true,
        pointers: [
            {
                width: 0
            }
        ]
    }]
});
gauge.appendTo('#container');

document.getElementById('orientationMode').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('orientationMode');
    gauge.orientation = <Orientation>ele.value;
    gauge.refresh();
};

document.getElementById('containerMode').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('containerMode');
    gauge.container.type = <ContainerType>ele.value;
    gauge.refresh();
};





