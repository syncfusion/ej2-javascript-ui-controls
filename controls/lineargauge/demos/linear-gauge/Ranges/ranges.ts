import { LinearGauge, Annotations } from '../../../src/linear-gauge/index';
import { linear } from './linearRange';
LinearGauge.Inject(Annotations);
let gauge: LinearGauge = new LinearGauge(linear());
gauge.appendTo('#container');
let value: number = parseInt((document.getElementById('rangeIndex') as HTMLSelectElement).value, 10);
document.getElementById("rangeIndex").onchange = (sender) => {
    value = parseInt((document.getElementById('rangeIndex') as HTMLSelectElement).value, 10);
    let start: HTMLInputElement = <HTMLInputElement>document.getElementById('start');
    let end: HTMLInputElement = <HTMLInputElement>document.getElementById('end');
    let rangeColor: HTMLSelectElement = <HTMLSelectElement>document.getElementById('color');
    let startWidth: HTMLInputElement = <HTMLInputElement>document.getElementById('startWidth');
    let endWidth: HTMLInputElement = <HTMLInputElement>document.getElementById('endWidth');
    start.value = gauge.axes[0].ranges[value].start.toString();
    end.value = gauge.axes[0].ranges[value].end.toString();
    startWidth.value = gauge.axes[0].ranges[value].startWidth.toString();
    endWidth.value = gauge.axes[0].ranges[value].endWidth.toString();
    rangeColor.value = gauge.axes[0].ranges[value].color.toString();
    document.getElementById('startWidthValue').innerHTML = 'Range Start Width<span>&nbsp;&nbsp;&nbsp;' + startWidth.value;
    document.getElementById('endWidthValue').innerHTML = 'Range End Width<span>&nbsp;&nbsp;&nbsp;' + endWidth.value;
    document.getElementById('startRangeValue').innerHTML = 'Range Start <span>&nbsp;&nbsp;&nbsp;' + start.value;
    document.getElementById('endRangeValue').innerHTML = 'Range End <span>&nbsp;&nbsp;&nbsp;' + end.value;
    gauge.refresh();
};

document.getElementById('color').onchange = () => {
    let ele: HTMLInputElement = <HTMLInputElement>document.getElementById('color');
    gauge.axes[0].ranges[value].color = ele.value;
    gauge.refresh();
};

document.getElementById('startWidth').ontouchmove = document.getElementById('startWidth').onpointermove =
    document.getElementById('startWidth').onchange = (): void => {
        let ele: HTMLInputElement = <HTMLInputElement>document.getElementById('startWidth');
        gauge.axes[0].ranges[value].startWidth = parseInt(ele.value, 10);
        document.getElementById('startWidthValue').innerHTML = 'Range Start Width<span>&nbsp;&nbsp;&nbsp;' + ele.value;
        gauge.refresh();
    };

document.getElementById('endWidth').ontouchmove = document.getElementById('endWidth').onpointermove =
    document.getElementById('endWidth').onchange = (): void => {
        let ele: HTMLInputElement = <HTMLInputElement>document.getElementById('endWidth');
        gauge.axes[0].ranges[value].endWidth = parseInt(ele.value, 10);
        document.getElementById('endWidthValue').innerHTML = 'Range End Width<span>&nbsp;&nbsp;&nbsp;' + ele.value;
        gauge.refresh();
    };

document.getElementById('start').ontouchmove = document.getElementById('start').onpointermove =
    document.getElementById('start').onchange = (): void => {
        let start: HTMLInputElement = <HTMLInputElement>document.getElementById('start');
        let end: HTMLInputElement = <HTMLInputElement>document.getElementById('end');
        gauge.axes[0].ranges[value].start = parseInt(start.value, 10);
        gauge.axes[0].ranges[value].end = parseInt(end.value, 10);
        document.getElementById('startRangeValue').innerHTML = 'Range Start <span>&nbsp;&nbsp;&nbsp;' + start.value;
        gauge.refresh();
    };

document.getElementById('end').ontouchmove = document.getElementById('end').onpointermove =
    document.getElementById('end').onchange = (): void => {
        let start: HTMLInputElement = <HTMLInputElement>document.getElementById('start');
        let end: HTMLInputElement = <HTMLInputElement>document.getElementById('end');
        gauge.axes[0].ranges[value].start = parseInt(start.value, 10);
        gauge.axes[0].ranges[value].end = parseInt(end.value, 10);
        document.getElementById('endRangeValue').innerHTML = 'Range End <span>&nbsp;&nbsp;&nbsp;' + end.value;
        gauge.refresh();
    };


document.getElementById("useRangeColor").onchange = () => {
    let value: string = (document.getElementById("useRangeColor") as HTMLSelectElement).value;
    gauge.axes[0].labelStyle.useRangeColor = (value === 'range') ? true : false;
    gauge.refresh();
};

