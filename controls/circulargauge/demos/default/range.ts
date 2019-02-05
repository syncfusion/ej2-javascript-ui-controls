/**
 * Range sample
 */
import { CircularGauge, Annotations } from '../../src/index';
CircularGauge.Inject(Annotations);
window.onload = () => {
    let circulargauge: CircularGauge = new CircularGauge({
        axes: [{
            lineStyle: { width: 10, color: 'transparent' },
            labelStyle: {
                position: 'Inside', useRangeColor: false,
                font: { size: '12px', color: '#424242', fontFamily: 'Roboto', fontStyle: 'Regular' }
            }, majorTicks: { height: 10, offset: 5, color: '#9E9E9E' }, minorTicks: { height: 0 },
            annotations: [{
                content: '<div><span style="font-size:14px; color:#9E9E9E; font-family:Regular">Speedometer</span></div>',
                radius: '30%', angle: 0, zIndex: '1'
            }, {
                content: '<div><span style="font-size:20px; color:#424242; font-family:Regular">65 MPH</span></div>',
                radius: '40%', angle: 180, zIndex: '1'
            }],
            startAngle: 210, endAngle: 150, minimum: 0, maximum: 120, radius: '80%',
            ranges: [{ start: 0, end: 40, color: '#30B32D' }, { start: 40, end: 80, color: '#FFDD00' },
            { start: 80, end: 120, color: '#F03E3E' }],
            pointers: [{
                animation: { enable: false },
                value: 65, radius: '60%', color: '#757575', pointerWidth: 8,
                cap: { radius: 7, color: '#757575' }, needleTail: { length: '18%' }
            }]
        }]
    });
    circulargauge.appendTo('#range-container');
    document.getElementById('rangeSelect').onchange = (e: Event) => {
        let index: number = +(e.target as HTMLSelectElement).value;
        (document.getElementById('rangeColor') as HTMLSelectElement).value = circulargauge.axes[0].ranges[index].color;
        (<HTMLInputElement>document.getElementById('endWidth')).value = circulargauge.axes[0].ranges[index].endWidth.toString();
        document.getElementById('rangeEndWidth').innerHTML = 'End Width <span>    ' +
            circulargauge.axes[0].ranges[index].endWidth;
        (<HTMLInputElement>document.getElementById('startWidth')).value = circulargauge.axes[0].ranges[index].startWidth.toString();
        document.getElementById('rangeStartWidth').innerHTML = 'Start Width <span>    ' +
            circulargauge.axes[0].ranges[index].startWidth;
        (<HTMLInputElement>document.getElementById('end')).value = circulargauge.axes[0].ranges[index].end.toString();
        document.getElementById('rangeEnd').innerHTML = 'Range End <span>    ' +
            circulargauge.axes[0].ranges[index].end;
        (<HTMLInputElement>document.getElementById('start')).value = circulargauge.axes[0].ranges[index].start.toString();
        document.getElementById('rangeStart').innerHTML = 'Range Start <span>    ' +
            circulargauge.axes[0].ranges[index].start;
        (<HTMLInputElement>document.getElementById('radius')).value = circulargauge.axes[0].ranges[index].roundedCornerRadius.toString();
        document.getElementById('cornerRadius').innerHTML = 'Corner Radius <span>    ' +
            circulargauge.axes[0].ranges[index].roundedCornerRadius;
    };
    document.getElementById('rangeColor').onchange = (e: Event) => {
        circulargauge.axes[0].ranges[+(document.getElementById('rangeSelect') as HTMLSelectElement).value].color = (e.target as HTMLSelectElement).value.toString();
        circulargauge.axes[0].pointers[0].animation.enable = false; circulargauge.refresh();
    };
    document.getElementById('start').onpointermove = document.getElementById('start').ontouchmove =
        document.getElementById('start').onchange = () => {
            let min: number = parseInt((<HTMLInputElement>document.getElementById('start')).value, 10);
            document.getElementById('rangeStart').innerHTML = 'Range Start <span>    ' + min;
            circulargauge.axes[0].ranges[+(document.getElementById('rangeSelect') as HTMLSelectElement).value].start = min;
            circulargauge.axes[0].pointers[0].animation.enable = false; circulargauge.refresh();
        };

    document.getElementById('end').onpointermove = document.getElementById('end').ontouchmove =
        document.getElementById('end').onchange = () => {
            let max: number = parseInt((<HTMLInputElement>document.getElementById('end')).value, 10);
            document.getElementById('rangeEnd').innerHTML = 'Range End <span>    ' + max;
            circulargauge.axes[0].ranges[+(document.getElementById('rangeSelect') as HTMLSelectElement).value].end = max;
            circulargauge.axes[0].pointers[0].animation.enable = false; circulargauge.refresh();
        };

    document.getElementById('startWidth').onpointermove = document.getElementById('startWidth').ontouchmove =
        document.getElementById('startWidth').onchange = () => {
            let startWidth: number = parseInt((<HTMLInputElement>document.getElementById('startWidth')).value, 10);
            document.getElementById('rangeStartWidth').innerHTML = 'Start Width <span>    ' + startWidth;
            circulargauge.axes[0].ranges[+(document.getElementById('rangeSelect') as HTMLSelectElement).value].startWidth = startWidth;
            circulargauge.axes[0].pointers[0].animation.enable = false; circulargauge.refresh();
        };

    document.getElementById('endWidth').onpointermove = document.getElementById('endWidth').ontouchmove =
        document.getElementById('endWidth').onchange = () => {
            let endWidth: number = parseInt((<HTMLInputElement>document.getElementById('endWidth')).value, 10);
            document.getElementById('rangeEndWidth').innerHTML = 'End Width <span>    ' + endWidth;
            circulargauge.axes[0].ranges[+(document.getElementById('rangeSelect') as HTMLSelectElement).value].endWidth = endWidth;
            circulargauge.axes[0].pointers[0].animation.enable = false; circulargauge.refresh();
        };

    document.getElementById('radius').onpointermove = document.getElementById('radius').ontouchmove =
        document.getElementById('radius').onchange = () => {
            let radius: number = parseInt((<HTMLInputElement>document.getElementById('radius')).value, 10);
            document.getElementById('cornerRadius').innerHTML = 'Corner Radius <span>    ' + radius;
            circulargauge.axes[0].ranges[+(document.getElementById('rangeSelect') as HTMLSelectElement).value].roundedCornerRadius = radius;
            circulargauge.axes[0].pointers[0].animation.enable = false; circulargauge.refresh();
        };

    document.getElementById('enable').onchange = () => {
        let useRangeColor: boolean = (<HTMLInputElement>document.getElementById('enable')).checked;
        circulargauge.axes[0].labelStyle.useRangeColor = useRangeColor;
        circulargauge.axes[0].majorTicks.useRangeColor = useRangeColor;
        circulargauge.axes[0].minorTicks.useRangeColor = useRangeColor;
        circulargauge.axes[0].pointers[0].animation.enable = false; circulargauge.refresh();
    };
};