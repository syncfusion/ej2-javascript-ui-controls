/**
 * Gauge Customization sample
 */
import { CircularGauge } from '../../src/index';
import { gauge1, gauge2 } from './customization-gauge';

window.onload = () => {
    let random: CircularGauge = new CircularGauge(gauge1());
    random.appendTo('#cutomization-container');
    let usage: CircularGauge = new CircularGauge(gauge2());
    let gauge: CircularGauge = random; let isUsage: boolean = false;
    document.getElementById('barColor').onchange = (e: Event) => {
        gauge.axes[0].pointers[0].color = (e.target as HTMLSelectElement).value.toString();
        gauge.refresh();
    };
    document.getElementById('rangeColor').onchange = (e: Event) => {
        gauge.axes[0].ranges[0].color = (e.target as HTMLSelectElement).value.toString();
        gauge.refresh();
    };
    document.getElementById('pointerColor').onchange = (e: Event) => {
        let color: string = (e.target as HTMLSelectElement).value.toString();
        if (!isUsage) {
            gauge.axes[0].pointers[1].color = color;
            gauge.axes[0].pointers[1].cap.border.color = color;
            gauge.axes[0].pointers[1].cap.color = color;
        }
        gauge.refresh();
    };
    document.getElementById('usage').onclick = () => {
        random.destroy();
        usage.appendTo('#cutomization-container');
        gauge = usage; isUsage = true;
        let element: HTMLSelectElement = <HTMLSelectElement>document.getElementById('currentValue');
        element.value = usage.axes[0].pointers[0].value.toString();
        document.getElementById('currentPointerValue').innerHTML = 'Current Value <span>    '
            + usage.axes[0].pointers[0].value + '</span>';
            (document.getElementById('barColor') as HTMLSelectElement).value = usage.axes[0].pointers[0].color;
            (document.getElementById('rangeColor') as HTMLSelectElement).value = usage.axes[0].ranges[0].color;
        let pointElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('pointColor');
        pointElement.className = 'e-disabled';
        let currentElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('usage');
        let existElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('random');
        let currentLine: HTMLSelectElement = <HTMLSelectElement>document.getElementById('usage_line');
        let exisLine: HTMLSelectElement = <HTMLSelectElement>document.getElementById('random_line');
        currentLine.style.display = 'block';
        exisLine.style.display = 'none';
    };
    document.getElementById('random').onclick = () => {
        usage.destroy();
        random.appendTo('#cutomization-container');
        gauge = random; isUsage = false;
        let currentElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('random');
        let existElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('usage');
        let exisLine: HTMLSelectElement = <HTMLSelectElement>document.getElementById('usage_line');
        let currentLine: HTMLSelectElement = <HTMLSelectElement>document.getElementById('random_line');
        currentLine.style.display = 'block'; exisLine.style.display = 'none';
        let element: HTMLSelectElement = <HTMLSelectElement>document.getElementById('currentValue');
        let pointElement: HTMLSelectElement = <HTMLSelectElement>document.getElementById('pointColor');
        pointElement.className = 'e-enabled';
        element.value = random.axes[0].pointers[0].value.toString();
        document.getElementById('currentPointerValue').innerHTML = 'Current Value <span>    ' +
            random.axes[0].pointers[0].value + '</span>';
            (document.getElementById('barColor') as HTMLSelectElement).value = random.axes[0].pointers[0].color;
        (document.getElementById('rangeColor') as HTMLSelectElement).value = random.axes[0].ranges[0].color;
        (document.getElementById('pointerColor') as HTMLSelectElement).value = random.axes[0].pointers[1].color;
    };

    document.getElementById('currentValue').onpointermove = document.getElementById('currentValue').ontouchmove =
        document.getElementById('currentValue').onchange = () => {
            let value: number = +(<HTMLInputElement>document.getElementById('currentValue')).value;
            if (isUsage) {
                gauge.setPointerValue(0, 0, value);
            } else {
                gauge.setPointerValue(0, 0, value);
                gauge.setPointerValue(0, 1, value);
            }
            gauge.setAnnotationValue(0, 0, '<div style="color:#666666;font-size:35px;">' + value + (isUsage ? 'GB' : '') + '</div>');
            document.getElementById('currentPointerValue').innerHTML = 'Current Value <span>    ' + value + '</span>';
        };
    let selectedTheme: string = location.hash.split('/')[1]; let color: string;
    if (selectedTheme === 'bootstrap') {
        color = '#a16ee5';
    } else if (selectedTheme === 'fabric') {
        color = '#1783FF';
    } else {
        color = '#ff4081';
    }
    let exisLine: HTMLSelectElement = <HTMLSelectElement>document.getElementById('usage_line');
    let currentLine: HTMLSelectElement = <HTMLSelectElement>document.getElementById('random_line');
    exisLine.style.background = color; currentLine.style.background = color;
};