import { LinearGauge, Annotations, ILoadEventArgs } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations);

let gauge: LinearGauge = new LinearGauge({
    rangePalettes: ['#30b32d', '#ffdd00', '#f03e3e'],
    orientation: 'Vertical',
    annotations: [{
        content: '<div id="title" style="width:200px;"><p style="font-size:18px;">CPU Utilization</p></div>',
        verticalAlignment: 'Center',
        x: 35, zIndex: '1',
        y: 50
    }],
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

document.getElementById('annotation').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('annotation');
    if(ele.value == 'alignment') {
        gauge.annotations[0].verticalAlignment = 'Center';
    } else if(ele.value == 'axisvalue') {
        gauge.annotations[0].axisValue = 0;
    } else {
        gauge.annotations[0].axisIndex = 0;
    }
    gauge.refresh();
};