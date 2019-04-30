import { LinearGauge, Annotations, ILoadEventArgs } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations);

let gauge: LinearGauge = new LinearGauge({
    rangePalettes: ['#30b32d', '#ffdd00', '#f03e3e'],
    height: '200px',
    border: { color: 'violet', width: 2},
    axes: [{
        maximum: 90,
        labelStyle: {
            font: {
                size: '0px'
            }
        },
        line: {
            width: 0
        },
        pointers: [
            {
                value: 35,
                height: 15,
                width: 15,
                color: '#757575',
                placement: 'Near',
                markerType: 'Triangle',
                offset: -50
            }
        ],
        majorTicks: {
            interval: 10,
            height: 0
        },
        minorTicks: {
            height: 0
        },
        ranges: [{
            start: 0,
            end: 30,
            startWidth: 50,
            endWidth: 50
        },
        {
            start: 30,
            end: 60,
            startWidth: 50,
            endWidth: 50
        },
        {
            start: 60,
            end: 90,
            startWidth: 50,
            endWidth: 50
        }]
    }],
});
gauge.appendTo('#container');

document.getElementById('size').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('size');
    if(ele.value == 'height') {
        gauge.height = '200px';
    } else {
        gauge.width = '500px';
    }
    gauge.refresh();
};