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
                color: '#000000',
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
                color: '#f02828',
                border: { color: 'yellow', width: 2 }
            }
        ]
    }]
});
gauge.appendTo('#container');

document.getElementById('barpointer').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('barpointer');
    if(ele.value == 'border') {
        gauge.axes[0].pointers[0].border.color = 'yellow';
        gauge.axes[0].pointers[0].border.width = 2;
    } else {
        gauge.axes[0].pointers[0].opacity = 10;
    }
    gauge.refresh();
};


document.getElementById('markerpointer').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('markerpointer');
    if(ele.value == 'arrow') {
        gauge.axes[0].pointers[0].type = 'Marker';
        gauge.axes[0].pointers[0].markerType = 'Arrow';
    } else if(ele.value == 'circle') {
        gauge.axes[0].pointers[0].type = 'Marker';
        gauge.axes[0].pointers[0].markerType = 'Circle';
    } else if(ele.value == 'diamond') {
        gauge.axes[0].pointers[0].type = 'Marker';
        gauge.axes[0].pointers[0].markerType = 'Diamond';
    } else if(ele.value == 'invertedarrow') {
        gauge.axes[0].pointers[0].type = 'Marker';
        gauge.axes[0].pointers[0].markerType = 'InvertedArrow';
    } else if(ele.value == 'rectangle') {
        gauge.axes[0].pointers[0].type = 'Marker';
        gauge.axes[0].pointers[0].markerType = 'Rectangle';
    } else {
        gauge.axes[0].pointers[0].type = 'Marker';
        gauge.axes[0].pointers[0].markerType = 'Triangle';
    }
    gauge.refresh();
};


document.getElementById('position').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('position');
    if(ele.value == 'near') {
        gauge.axes[0].pointers[0].type = 'Marker';
        gauge.axes[0].pointers[0].placement = 'Near';
    } else if(ele.value == 'far') {
        gauge.axes[0].pointers[0].type = 'Marker';
        gauge.axes[0].pointers[0].placement = 'Far';
    } else {
        gauge.axes[0].pointers[0].type = 'Marker';
        gauge.axes[0].pointers[0].placement = 'Center';
    }
    gauge.refresh();
};