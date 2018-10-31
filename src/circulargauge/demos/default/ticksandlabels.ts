/**
 * Gauge Labels sample
 */
import { CircularGauge, Annotations, Position, TickModel } from '../../src/index';
CircularGauge.Inject(Annotations);
window.onload = () => {
    let isMajorTicks: boolean = true;
    let circulargauge: CircularGauge = new CircularGauge({
        axes: [{
            annotations: [{
                content: '<div id="content" style="color:#518C03;font-size:20px;font-family:Segoe UI;font-weight:semibold;">145</div>',
                angle: 0, radius: '0%', zIndex: '1',
            }],
            startAngle: 210, endAngle: 150,
            lineStyle: { width: 2, color: '#9E9E9E' },
            labelStyle: {
                position: 'Outside', autoAngle: true,
                font: { size: '10px', color: '#333333' }
            }, majorTicks: {
                position: 'Inside', color: '#757575', width: 2, height: 10, interval: 20
            }, minorTicks: {
                position: 'Inside', color: '#757575', height: 5, width: 2, interval: 10
            },
            radius: '75%', minimum: 0, maximum: 180,
            pointers: [{
                animation: { enable: false }, value: 145,
                type: 'RangeBar', roundedCornerRadius: 10,
                color: '#8BC34A', radius: '60%', pointerWidth: 10,
            }]
        }]
    });
    circulargauge.appendTo('#labels-container');
    document.getElementById('Ticks').onchange = (e: Event) => {
        let value: string = (e.target as HTMLSelectElement).value.toString();
        let tick: TickModel; isMajorTicks = value === 'major';
        if (isMajorTicks) {
            tick = circulargauge.axes[0].majorTicks;
        } else {
            tick = circulargauge.axes[0].minorTicks;
        }
        (document.getElementById('tickposition') as HTMLSelectElement).value = tick.position;
        (<HTMLInputElement>document.getElementById('tickOffset')).value = tick.offset.toString();
        (<HTMLInputElement>document.getElementById('tickHeight')).value = tick.height.toString();
        document.getElementById('offset').innerHTML = 'Tick Offset <span>   ' + tick.offset;
        document.getElementById('height').innerHTML = 'Tick Height <span>   ' + tick.height;
    };
    document.getElementById('tickposition').onchange = (e: Event) => {
        let value: string = (e.target as HTMLSelectElement).value.toString();
        if (isMajorTicks) {
            circulargauge.axes[0].majorTicks.position = <Position>value;
        } else {
            circulargauge.axes[0].minorTicks.position = <Position>value;
        }
        circulargauge.refresh();
    };
    document.getElementById('labelposition').onchange = (e: Event) => {
        circulargauge.axes[0].labelStyle.position = <Position>(e.target as HTMLSelectElement).value.toString();
        circulargauge.refresh();
    };
    document.getElementById('tickOffset').onpointermove = document.getElementById('tickOffset').ontouchmove =
        document.getElementById('tickOffset').onchange = () => {
            let value: number = parseInt((<HTMLInputElement>document.getElementById('tickOffset')).value, 10);
            if (isMajorTicks) {
                circulargauge.axes[0].majorTicks.offset = value;
            } else {
                circulargauge.axes[0].minorTicks.offset = value;
            }
            document.getElementById('offset').innerHTML = 'Tick Offset <span>   ' + value;
            circulargauge.refresh();
        };

    document.getElementById('tickHeight').onpointermove = document.getElementById('tickHeight').ontouchmove =
        document.getElementById('tickHeight').onchange = () => {
            let value: number = parseInt((<HTMLInputElement>document.getElementById('tickHeight')).value, 10);
            if (isMajorTicks) {
                circulargauge.axes[0].majorTicks.height = value;
            } else {
                circulargauge.axes[0].minorTicks.height = value;
            }
            document.getElementById('height').innerHTML = 'Tick Height <span>   ' + value;
            circulargauge.refresh();
        };

    document.getElementById('labelOffset').onpointermove = document.getElementById('labelOffset').ontouchmove =
        document.getElementById('labelOffset').onchange = () => {
            let value: number = parseInt((<HTMLInputElement>document.getElementById('labelOffset')).value, 10);
            circulargauge.axes[0].labelStyle.offset = value;
            document.getElementById('labelOffsetValue').innerHTML = 'Label Offset <span>   ' + value;
            circulargauge.refresh();
        };
};