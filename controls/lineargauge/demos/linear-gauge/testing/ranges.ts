import { LinearGauge, Annotations } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations);

/**
 * Linear Gauge Range Sample
 */
let gauge: LinearGauge = new LinearGauge({
    orientation: 'Horizontal',
    axes: [{
        labelStyle: {
            font: {
                color: '#000000',
            },
            offset: -15,
        },
        line: {
            width: 0
        },
        majorTicks: {
            height: 0
        },
        minorTicks: {
            height: 0
        },
        ranges: [{
            start: 0,
            end: 50,
            color: '#30B32D',
            startWidth: 15,
            endWidth: 15,
        },
        {
            start: 50,
            end: 100,
            startWidth: 15,
            endWidth: 15,
            color: '#FFDF00'
        }]
    }],
});
gauge.appendTo('#container');

document.getElementById('range1').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('range1');
    if(ele.value == 'border') {
        gauge.axes[0].ranges[0].border.color = 'red';
        gauge.axes[0].ranges[0].border.width = 2;
    } else if(ele.value == 'color') {
        gauge.axes[0].ranges[0].color = 'violet';
    } else if(ele.value == 'offset') {
        gauge.axes[0].ranges[0].offset = 4;
    } else {
        gauge.axes[0].ranges[0].position = 'Inside';
    }
    gauge.refresh();
};

document.getElementById('range2').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('range2');
    if(ele.value == 'border') {
        gauge.axes[0].ranges[1].border.color = 'red';
        gauge.axes[0].ranges[1].border.width = 2;
    } else if(ele.value == 'color') {
        gauge.axes[0].ranges[1].color = 'blue';
    } else if(ele.value == 'offset') {
        gauge.axes[0].ranges[1].offset = 4;
    } else {
        gauge.axes[0].ranges[1].position = 'Inside';
    }
    gauge.refresh();
};