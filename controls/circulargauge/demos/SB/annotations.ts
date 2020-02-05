/**
 * Annotation sample
 */
import { CircularGauge, Pointer, ILoadedEventArgs, GaugeTheme } from '../../src/index';
import { Annotations } from '../../src/index';
import { gauge1, gauge2 } from './annotation-gauge';
CircularGauge.Inject(Annotations);

function calcTime(offset: string): Date {
    let date: Date = new Date();
    let localTime: number = date.getTime();
    let localOffset: number = date.getTimezoneOffset() * 60000;
    let utc: number = localTime + localOffset;
    let curretDate: Date = new Date(utc + (3600000 * (+offset)));
    return curretDate;
}



    let clockInterval: Function; let intervalExecute: boolean = true;
    let indianTime: CircularGauge = new CircularGauge(gauge1());
    let subGauge1: CircularGauge; let subGauge2: CircularGauge;
    indianTime.appendTo('#clockgauge');
    updateSubGauge1.apply(this);
    updateSubGauge2.apply(this);
    function updateSubGauge1(): void {
        subGauge1 = new CircularGauge(gauge2()); subGauge1.appendTo('#minutes');
    }
    function updateSubGauge2(): void {
        subGauge2 = new CircularGauge({
            background: 'transparent',

            axes: [{
                ranges: [{ start: 0, end: 3, startWidth: 4, endWidth: 4, color: 'rgb(128,128,128)' },
                { start: 3, end: 12, startWidth: 4, endWidth: 4, color: 'rgb(192,192,192)' }],
                annotations: [{ angle: 270, radius: '40%', content: null },
                { angle: 180, radius: '40%', content: null },
                { angle: 90, radius: '50%', content: null },
                { angle: 360, radius: '35%', zIndex: '1', content: '<div id="tm" style="font-size:10px;">21-06-17</div>' }],
                labelStyle: { hiddenLabel: 'First', font: { size: '0px' }, autoAngle: false },
                majorTicks: { width: 1, height: 5, interval: 1 },
                minorTicks: { height: 3, width: 0.5, interval: 0.2 }, minimum: 0, maximum: 12,
                pointers: [{
                    radius: '70%', pointerWidth: 2,
                    cap: {
                        radius: 2, border: { width: 0.2 }
                    }, needleTail: { length: '10%' }, animation: { enable: false, duration: 500 }
                }], startAngle: 0, endAngle: 0, lineStyle: { width: 0 }
            }],
            loaded: intervalExecute ? ((args: {}): void => {
                if (intervalExecute) {
                    updateTime(false);
                    this.clockInterval = setInterval(
                        (): void => {
                            updateTime(true, this.clearInterval);
                        },
                        1000
                    );
                    intervalExecute = false;
                }
            }) : null
        });
        subGauge2.appendTo('#seconds');
    }
    function updateTime(enable: boolean, interval?: number): void {
        if (document.getElementById('clockgauge') && document.getElementsByClassName('e-circulargauge')) {
            getTime('+5.5', indianTime, enable);
            if (document.getElementById('minutes').childElementCount) {
                getTime('+5.5', subGauge1, enable, true);
            } else {
                updateSubGauge1(); getTime('+5.5', subGauge1, enable, true);
            }
            if (document.getElementById('seconds').childElementCount) {
                getTime('+5.5', subGauge2, enable, true);
            } else {
                updateSubGauge2(); getTime('+5.5', subGauge2, enable, true);
            }
        } else {
            clearInterval(interval);
        }
    }
    function getTime(offset: string, gauge: CircularGauge, enable: boolean, subGauge?: boolean): void {
        let returnTime: Date = calcTime(offset);
        let seconds: number = returnTime.getSeconds() * 12 / 60; seconds = seconds === 0 ? 12 : seconds;
        if (!subGauge) {
            gauge.axes[0].pointers[2].animation.enable = enable;
            (<Pointer>gauge.axes[0].pointers[2]).currentValue = seconds === 0.2 ? 0 : (<Pointer>gauge.axes[0].pointers[2]).currentValue;
        } else {
            (<Pointer>gauge.axes[0].pointers[0]).currentValue = seconds === 0.2 ? 0 : (<Pointer>gauge.axes[0].pointers[0]).currentValue;
            gauge.axes[0].pointers[0].animation.enable = (gauge.element.id === 'seconds' && enable);
        }
        let hour: number = (returnTime.getHours() + returnTime.getMinutes() / 60) % 12;
        let minutes: number = returnTime.getMinutes() * 12 / 60 + returnTime.getSeconds() * 12 / 3600;
        let content: string; let hourValue: number;
        if (subGauge) {
            if (gauge.element.id === 'minutes') {
                content = '<div id="tm" style="font-size:8px;">' + Math.floor(returnTime.getMinutes()) + ' M</div>';
                gauge.setPointerValue(0, 0, minutes); gauge.setAnnotationValue(0, 3, content);
            } else {
                gauge.setPointerValue(0, 0, seconds);
                content = '<div id="tm" style="font-size:8px;">' + Math.floor(returnTime.getSeconds()) + ' S</div>';
                gauge.setAnnotationValue(0, 3, content);
            }
        } else {
            gauge.setPointerValue(0, 0, hour); gauge.setPointerValue(0, 1, minutes); gauge.setPointerValue(0, 2, seconds);
            hourValue = (Math.floor(returnTime.getHours()) % 12);
            content = '<div id="hr" style="background-color:rgba(226, 226, 226, 0.4);' +
                'color:rgba(29,29,29,0.9);padding:4px;font-size:12px;">' +
                (hourValue === 0 ? 12 : hourValue) + ':' + Math.floor(returnTime.getMinutes()) +
                (returnTime.getHours() >= 12 ? ' PM' : ' AM') + '</div>';
            gauge.setAnnotationValue(0, 2, content); let date: Date = new Date();
            content = '<div id="tm" style="font-size:10px;">' + date.getDate() + '-' +
                (date.getMonth() + 1) + '-' + date.getFullYear() + '</div>';
            gauge.setAnnotationValue(0, 3, content);
        }
    }