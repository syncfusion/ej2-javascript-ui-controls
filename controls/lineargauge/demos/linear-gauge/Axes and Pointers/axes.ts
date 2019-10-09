import { LinearGauge, Point, Annotations, Placement, Pointer } from '../../../src/linear-gauge/index';
LinearGauge.Inject(Annotations);

let gauge: LinearGauge = new LinearGauge(linearAxes());
gauge.appendTo('#container');

document.getElementById('opposed').onchange = (sender: Event) => {
    let ele: HTMLInputElement = <HTMLInputElement>document.getElementById('opposed');
    gauge.axes[0].opposedPosition = ele.checked;
    if (ele.checked) {
        gauge.axes[0].pointers[0].placement = 'Near';
        gauge.axes[0].pointers[0].markerType = 'Triangle';
        gauge.axes[0].pointers[0].offset = -20;
        gauge.axes[0].labelStyle.offset = 0;
        gauge.annotations[0].x = 10;
        gauge.annotations[0].y = -60;
    } else {
        gauge.axes[0].pointers[0].placement = 'Far';
        gauge.axes[0].pointers[0].offset = 0;
        gauge.axes[0].pointers[0].offset = 30;
        gauge.axes[0].pointers[0].markerType = 'InvertedTriangle';
        gauge.axes[0].labelStyle.offset = 38;
        gauge.annotations[0].x = 10;
        gauge.annotations[0].y = 60;
    }
    gauge.refresh();
};

document.getElementById('axisInversed').onchange = (sender: Event) => {
    let ele: HTMLInputElement = <HTMLInputElement>document.getElementById('axisInversed');
    gauge.axes[0].isInversed = ele.checked;
    gauge.refresh();
};

document.getElementById('min').ontouchmove = document.getElementById('min').onpointermove =
    document.getElementById('min').onchange = () => {
        let min: HTMLInputElement = <HTMLInputElement>document.getElementById('min');
        let max: HTMLInputElement = <HTMLInputElement>document.getElementById('max');
        gauge.axes[0].minimum = parseInt(min.value, 10);
        gauge.axes[0].maximum = parseInt(max.value, 10);
        document.getElementById('minValue').innerHTML = 'Axis Minimum <span>&nbsp;&nbsp;&nbsp;' + min.value;
        gauge.refresh();
        gauge.annotations[0].axisValue = (<Pointer>gauge.axes[0].pointers[0]).currentValue;
        gauge.refresh();
    };

document.getElementById('max').ontouchmove = document.getElementById('max').onpointermove =
    document.getElementById('max').onchange = () => {
        let min: HTMLInputElement = <HTMLInputElement>document.getElementById('min');
        let max: HTMLInputElement = <HTMLInputElement>document.getElementById('max');
        gauge.axes[0].maximum = parseInt(max.value, 10);
        gauge.axes[0].minimum = parseInt(min.value, 10);
        document.getElementById('maxValue').innerHTML = 'Axis Maximum <span>&nbsp;&nbsp;&nbsp;' + max.value;
        gauge.refresh();
        gauge.annotations[0].axisValue = (<Pointer>gauge.axes[0].pointers[0]).currentValue;
        gauge.refresh();
    };

document.getElementById('format').onchange = () => {
    let ele: HTMLInputElement = <HTMLInputElement>document.getElementById('format');
    gauge.axes[0].labelStyle.format = ele.value.indexOf('{value}') > -1 ? ele.value : gauge.axes[0].labelStyle.format;
    gauge.refresh();
};

document.getElementById('pointerType').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('pointerType');
    gauge.axes[0].pointers[0].type = <Point>ele.value;
    gauge.refresh();
};

document.getElementById('pointerPlace').onchange = () => {
    let ele: HTMLSelectElement = <HTMLSelectElement>document.getElementById('pointerPlace');
    gauge.axes[0].pointers[0].placement = <Placement>ele.value;
    gauge.refresh();
};

export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function linearAxes(): LinearGauge {
    let gauge: LinearGauge = new LinearGauge({
        orientation: 'Horizontal',
        axes: [{
            line: {
                color: '#9E9E9E'
            },
            pointers: [{
                value: 10,
                height: 15,
                width: 15,
                color: '#757575',
                offset: 30
            }],
            majorTicks: {
                color: '#9E9E9E',
                interval: 10
            },
            minorTicks: {
                color: '#9E9E9E',
                interval: 2
            },
            labelStyle: {
                font: {
                    color: '#424242'
                },
                offset: 48
            }
        }],
        annotations: [{
            content: '<div id="pointer" style="width:70px"><h1 style="font-size:14px;' +
                'color:#424242">${axes[0].pointers[0].currentValue} MPH</h1></div>',
            axisIndex: 0,
            axisValue: 10,
            x: 10,
            y: 60,
            zIndex: '1'
        }]
    });
    return gauge;
}