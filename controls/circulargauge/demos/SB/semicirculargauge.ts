
/**
 * Default sample
 */
import { CircularGauge, ILoadedEventArgs, GaugeTheme } from '../../src/index';


    let circulargauge: CircularGauge = new CircularGauge({

        moveToCenter: false,
        axes: [{
           hideIntersectingLabel: true,
            startAngle: 270, endAngle: 90,
            lineStyle: { width: 0, color: '#0450C2' },
            labelStyle: {
                position: 'Outside', autoAngle: true,
                font: { fontWeight: 'normal' }
            }, majorTicks: {
                position: 'Inside', width: 2, height: 12, interval: 4
            }, minorTicks: {
                position: 'Inside', height: 5, width: 1, interval: 2
            },
            radius: '80%', minimum: 0, maximum: 100,
            pointers: [{
                animation: { enable: false },
                value: 30,
                radius: '75%',
                color: '#FF9200',
                pointerWidth: 7,
                cap: { radius: 8, color: '#565656', border: { width: 0 } },
                needleTail: { length: '13%', color: '#FF9200' }
            }]
        }]
    });
    circulargauge.appendTo('#gauge');
    // code for property panel
    let highlightCheckBox: HTMLInputElement = <HTMLInputElement>document.getElementById('angle');
    document.getElementById('angle').onchange = () => {
        let centerX: HTMLInputElement = document.getElementById('centerX') as HTMLInputElement;
        let centerY: HTMLInputElement = document.getElementById('centerY') as HTMLInputElement;
        let checkboxEnabled: boolean = (<HTMLInputElement>document.getElementById('angle')).checked;
        if (checkboxEnabled) {
            circulargauge.centerX = null;
            circulargauge.centerY = null;
            circulargauge.moveToCenter = true;
            centerX.disabled = true;
            centerY.disabled = true;
        } else {
            circulargauge.centerX = centerX.value + '%';
            circulargauge.centerY = centerY.value + '%';
            centerX.disabled = false;
            centerY.disabled = false;
            circulargauge.moveToCenter = false;
        }
        circulargauge.refresh();
    };

document.getElementById('startangle').onchange = () => {
    let start = <HTMLInputElement>(document.getElementById('startangle'));
    circulargauge.axes[0].startAngle = +start.value;
    circulargauge.refresh();
};

document.getElementById('endangle').onchange = () => {
    let end = <HTMLInputElement>(document.getElementById('endangle'));
    circulargauge.axes[0].endAngle = +end.value;
    circulargauge.refresh();
};

document.getElementById('radius').onchange = () => {
    let radius = <HTMLInputElement>(document.getElementById('radius'));
    circulargauge.axes[0].radius = radius.value+ '%';
    circulargauge.refresh();
};

document.getElementById('centerX').onchange = () => {
    if (!highlightCheckBox.checked){
        let centerx = <HTMLInputElement>document.getElementById('centerX');
        circulargauge.centerX = centerx.value+ '%';
        circulargauge.refresh();
    }
};

document.getElementById('centerY').onchange = () => {
    if (!highlightCheckBox.checked){
        let centery = <HTMLInputElement>document.getElementById('centerY');
        circulargauge.centerY = centery.value+ '%';
        circulargauge.refresh();
    }
};

document.getElementById('hidelabel').onchange = () => {
    let labelIntersect: boolean = (<HTMLInputElement>document.getElementById('hidelabel')).checked;
    circulargauge.axes[0].hideIntersectingLabel = labelIntersect;
    circulargauge.refresh();
};