/**
 * hide intersecting label sample
 */
import { CircularGauge, isCompleteAngle, GaugeDirection } from '../../src/index';

let axisIndex: number = 0;
let circulargauge: CircularGauge = new CircularGauge({
    title: 'Gauge with Multiple Axes',
    titleStyle: { color: 'gray', size: '16px' },
    axes: [{
        hideIntersectingLabel: true,
        lineStyle: { width: 1.5, color: ' #9E9E9E' },
        radius: '95%',
        labelStyle: {
            position: 'Inside', autoAngle: true,
            hiddenLabel: 'None', font: { color: '#333333' }
        }, majorTicks: {
            position: 'Inside', interval: 3,
            width: 2, height: 10, color: '#757575'
        }, minorTicks: {
            position: 'Inside', width: 2,
            height: 5, color: '#757575'
        },
        minimum: 100, maximum: 250, startAngle: 0, endAngle: 180,
        pointers: [{
            animation: { enable: false },
            value: 120, radius: '100%', color: '#333333',
            markerHeight: 15, markerWidth: 15, type: 'Marker',
            markerShape: 'Triangle',
        }]
    }, {
        showLastLabel: true,
        hideIntersectingLabel: true,
        lineStyle: { width: 1.5, color: '#E84011' }, radius: '95%',
        labelStyle: {
            position: 'Outside', autoAngle: true,
            hiddenLabel: 'None', font: { color: '#E84011' }
        }, majorTicks: {
            position: 'Outside', width: 2, height: 10, interval: 4,
            color: '#E84011'
        }, minorTicks: {
            position: 'Outside', width: 2,
            height: 5, color: '#E84011'
        },
        minimum: 100, maximum: 350, startAngle: 0, endAngle: 180,
        pointers: [{
            animation: { enable: false },
            value: 120, radius: '100%', color: '#C62E0A',
            markerHeight: 15, markerWidth: 15, type: 'Marker',
            markerShape: 'InvertedTriangle',
        }]
    }]
});
circulargauge.appendTo('#axis-container');
document.getElementById('axisIndex').onchange = (e: Event) => {
    axisIndex = +(e.target as HTMLSelectElement).value;
    (document.getElementById('axisDirection') as HTMLSelectElement).value = circulargauge.axes[axisIndex].direction;
    let startAngle: number = circulargauge.axes[axisIndex].startAngle;
    let endAngle: number = circulargauge.axes[axisIndex].endAngle;
    document.getElementById('start').innerHTML = 'Start Angle <span>    ' + startAngle;
    document.getElementById('end').innerHTML = 'End Angle <span>    ' + endAngle;
    (<HTMLInputElement>document.getElementById('startAngle')).value = startAngle.toString();
    (<HTMLInputElement>document.getElementById('endAngle')).value = endAngle.toString();
};
document.getElementById('axisDirection').onchange = (e: Event) => {
    circulargauge.axes[axisIndex].direction = <GaugeDirection>(e.target as HTMLSelectElement).value.toString();
    circulargauge.axes[0].pointers[0].animation.enable = false;
    circulargauge.axes[1].pointers[0].animation.enable = false;
    circulargauge.refresh();
};
document.getElementById('startAngle').onpointermove = document.getElementById('startAngle').ontouchmove =
    document.getElementById('startAngle').onchange = () => {
        let value: number = parseInt((<HTMLInputElement>document.getElementById('startAngle')).value, 10);
        circulargauge.axes[0].pointers[0].animation.enable = false;
        circulargauge.axes[1].pointers[0].animation.enable = false;
        circulargauge.axes[axisIndex].startAngle = value;
        document.getElementById('start').innerHTML = 'Start Angle <span>    ' + value;
        circulargauge.refresh();
    };

document.getElementById('endAngle').onpointermove = document.getElementById('endAngle').ontouchmove =
    document.getElementById('endAngle').onchange = () => {
        let value: number = parseInt((<HTMLInputElement>document.getElementById('endAngle')).value, 10);
        circulargauge.axes[0].pointers[0].animation.enable = false;
        circulargauge.axes[1].pointers[0].animation.enable = false;
        circulargauge.axes[axisIndex].endAngle = value;
        document.getElementById('end').innerHTML = 'End Angle <span>    ' + value;
        circulargauge.refresh();
    };
document.getElementById('interval').onpointermove = document.getElementById('interval').ontouchmove =
    document.getElementById('interval').onchange = () => {
        let value: number = parseInt((<HTMLInputElement>document.getElementById('interval')).value, 10);
        circulargauge.axes[0].pointers[0].animation.enable = false;
        circulargauge.axes[1].pointers[0].animation.enable = false;
        circulargauge.axes[axisIndex].majorTicks.interval = value;
        document.getElementById('intervalvalue').innerHTML = 'Tick interval <span>    ' + value;
        circulargauge.refresh();
    };
    document.getElementById('hidelabel').onchange = () => {
        let labelIntersect: boolean = (<HTMLInputElement>document.getElementById('hidelabel')).checked;
        circulargauge.axes[0].hideIntersectingLabel = labelIntersect;
        circulargauge.axes[1].hideIntersectingLabel = labelIntersect;
        circulargauge.refresh();
    }
