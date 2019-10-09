//tslint:disable
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { CircularGaugeComponent, CircularGauge, Pointer, GaugeTheme } from '@syncfusion/ej2-angular-circulargauge';
import { IAnnotationRenderEventArgs, ILoadedEventArgs, IResizeEventArgs } from '@syncfusion/ej2-angular-circulargauge';
import { AnnotationDataSerive } from './annotation-service';
import { Browser } from '@syncfusion/ej2-base';
/**
 * Sample for annotation
 */
@Component({
    selector: 'control-content',
    templateUrl: 'annotation.component.html',
    styleUrls: ['annoation.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AnnotationComponent {

    @ViewChild('gauge1')
    public circularGauge: CircularGaugeComponent;
    public tooltipInterval: number;

    public clockInterval: number;
    //Initializing LabelStyle
    public labelStyle: Object = {
        hiddenLabel: 'First',
        font: { color: 'rgb(29,29,29)' },
        autoAngle: false
    };
    public pointerWidth: number = 5;
    public angle1: number = 270;
    public angle2: number = 180;
    public angle3: number = 90;
    public angle4: number = 360;
    public startAngle: number = 0;
    public endAngle: number = 0;
    public minimum: number = 0;
    public maximum: number = 12;
    public start: number = 0;
    public end: number = 3;
    public width: number = 10;
    //Initializing majorTicks
    public majorTicks: Object = {
        width: 2, height: 14, interval: 1,
        color: 'rgb(29,29,29)'
    };
    public annotationRadius: string = Browser.isDevice ? '90%' : '75%';
    public minorTicks: Object = {
        height: 4, width: 1, interval: 0.2,
        color: 'rgb(29,29,29)'
    };
    public border: Object = { width: 0, color: 'rgba(29,29,29,0.8)' };
    public cap: Object = {
        radius: 0,
        border: { width: 0, color: 'red' }
    };
    public needleTail: Object = {
        length: '0%'
    };
    public animation: Object = {
        enable: false
    };
    public lineStyle: Object = { width: 0 };
    public cap1: Object = {
        color: 'white',
        radius: 4,
        border: {
            width: 2,
            color: 'rgba(29,29,29,0.8)'
        }
    };
    public border1: Object = {
        width: 2,
        color: 'rgba(29,29,29,0.8)'
    };
    public needleTail1: Object = {
        color: 'rgba(29,29,29,0.8)',
        length: '20%',
        border: {
            width: 2,
            color: 'rgba(29,29,29,0.8)'
        }
    };
    public animation1: Object = {
        enable: false,
        duration: 500
    };
    public resize(args: IResizeEventArgs): void {
        window.location.reload();
    }
    public loaded(args: ILoadedEventArgs): void {
        let intervalExecute: boolean = true;
        let subGauge1: CircularGauge = new CircularGauge(AnnotationDataSerive.prototype.GetSubGauge1().gauge1);
        subGauge1.appendTo('#minutes');
        let subGauge2: CircularGauge = new CircularGauge(AnnotationDataSerive.prototype.GetSubGauge1().gauge2);
        subGauge2.appendTo('#seconds');

        if (intervalExecute) {
            updateTime(false, this.circularGauge);
            this.clockInterval = setInterval(
                (): void => {
                    updateTime(true, this.circularGauge, this.clockInterval);
                },
                1000
            );
            intervalExecute = false;
        }
        function updateSubGauge1(): void {
            subGauge1 = new CircularGauge(AnnotationDataSerive.prototype.GetSubGauge1().gauge1);
            subGauge1.appendTo('#minutes');
        }
        function updateSubGauge2(): void {
            subGauge2 = new CircularGauge(AnnotationDataSerive.prototype.GetSubGauge1().gauge2);
            subGauge2.appendTo('#seconds');
        }
        function updateTime(enable: boolean, indianTime: CircularGauge, interval?: number): void {
            if (document.getElementById('clock-container') && document.getElementsByClassName('e-circulargauge')) {
                getTime('+5.5', indianTime, enable);
                if (document.getElementById('minutes').childElementCount) {
                    getTime('+5.5', subGauge1, enable, true);
                } else {
                    updateSubGauge1();
                    getTime('+5.5', subGauge1, enable, true);
                }
                if (document.getElementById('seconds').childElementCount) {
                    getTime('+5.5', subGauge2, enable, true);
                } else {
                    updateSubGauge2();
                    getTime('+5.5', subGauge2, enable, true);
                }
            } else {
                clearInterval(interval);
            }
        }
        function calcTime(offset: string): Date {
            let date: Date = new Date();
            let localTime: number = date.getTime();
            let localOffset: number = date.getTimezoneOffset() * 60000;
            let utc: number = localTime + localOffset;
            let curretDate: Date = new Date(utc + (3600000 * (+offset)));
            return curretDate;
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
            let content: string;
            let hourValue: number;
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
                hourValue = (Math.floor(returnTime.getHours()) % 12);
                gauge.setPointerValue(0, 0, hour); gauge.setPointerValue(0, 1, minutes); gauge.setPointerValue(0, 2, seconds);
                content = '<div id="hr" style="background-color:rgba(226,226,226,0.4);color:rgba(29,29,29,0.9);font-size:12px;padding:4px;">' +
                    (hourValue === 0 ? 12 : hourValue) + ':' + Math.floor(returnTime.getMinutes()) +
                    (returnTime.getHours() >= 12 ? ' PM' : ' AM') + '</div>';
                gauge.setAnnotationValue(0, 2, content); let date: Date = new Date();
                content = '<div id="tm" style="font-size:10px;">' + date.getDate() + '-' +
                    (date.getMonth() + 1) + '-' + date.getFullYear() + '</div>';
                gauge.setAnnotationValue(0, 3, content);
            }
        }
    }
    constructor() {
        // code
    };
}