//tslint:disable
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { IPointerDragEventArgs, CircularGaugeComponent} from '@syncfusion/ej2-angular-circulargauge';
import { getRangeColor, Range } from '@syncfusion/ej2-angular-circulargauge';
@Component({
    selector: 'control-content',
    templateUrl: 'user-interaction.component.html',
    styleUrls: ['user-interaction.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserInteractionComponent {
    @ViewChild('circulargauge')
    public circulargauge: CircularGaugeComponent;
    public content: string = '<div style="font-size: 14px;color:#E5C31C;font-weight: lighter;font-style: oblique;"><span>';
    public pointerValue: number;

    public lineStyle: Object = { width: 0, color: '#9E9E9E' };
    public labelStyle: Object = {
        useRangeColor: true
    };

    //Initializing MajorTicks
    public majorTicks: Object = {
        useRangeColor: true
    };
    public content1: string = '<div style="font-size: 14px;color:#E5C31C;font-weight: lighter;font-style: oblique;"><span>70 MPH</span></div>';
    public minorTicks: Object = {
        useRangeColor: true
    };public dragMove(args: IPointerDragEventArgs): void {
        this.pointerValue = Math.round(args.currentValue);
        document.getElementById('pointerValue').innerHTML = 'Pointer Value <span> &nbsp;&nbsp;&nbsp;' + this.pointerValue;
        (<HTMLInputElement>document.getElementById('value')).value = this.pointerValue.toString();
        this.circulargauge.setAnnotationValue(0, 0, this.content + this.pointerValue + ' MPH</span></div>');
    };
    public dragEnd(args: IPointerDragEventArgs): void {
        this.pointerValue = Math.round(args.currentValue);
        this.setPointersValue(this.circulargauge, this.pointerValue);
    };
    public markerHeight: number = 20;
    public markerWidth: number = 20;
    public rangeWidth: number = 8;
    public cap: Object = { radius: 10, border: { width: 5, color: '#E5C31C' } };
    public tail: Object = { length: '0%', color: '#E5C31C' };
    public animation: Object = { enable: true, duration: 500 };
    public setPointersValue(circulargauge: CircularGaugeComponent, pointerValue: number): void {
        let color: string = getRangeColor(pointerValue, <Range[]>(circulargauge.axes[0].ranges), circulargauge.axes[0].pointers[0].color);
        circulargauge.axes[0].pointers[0].color = color;
        circulargauge.axes[0].pointers[1].color = color;
        circulargauge.axes[0].pointers[0].animation.enable = true;
        circulargauge.axes[0].pointers[1].animation.enable = true;
        circulargauge.axes[0].pointers[0].needleTail.color = color;
        circulargauge.axes[0].pointers[1].needleTail.color = color;
        circulargauge.axes[0].pointers[0].cap.border.color = color;
        circulargauge.axes[0].pointers[1].cap.border.color = color;
        circulargauge.setPointerValue(0, 1, pointerValue);
        circulargauge.setPointerValue(0, 0, pointerValue);
        this.content = '<div style="font-size: 14px;color:' + color + ';font-weight: lighter;font-style: oblique;"><span>';
        circulargauge.setAnnotationValue(0, 0, this.content + pointerValue + ' MPH</span></div>');
    }
    ngAfterViewInit(): void {
        document.getElementById('value').onpointermove = document.getElementById('value').ontouchmove =
            document.getElementById('value').onchange = () => {
                let value: number = parseInt((<HTMLInputElement>document.getElementById('value')).value, 10);
                document.getElementById('pointerValue').innerHTML = 'Pointer Value <span> &nbsp;&nbsp;&nbsp;' + value;
                this.setPointersValue(this.circulargauge, value);
            };

        document.getElementById('enable').onchange = () => {
            let value: boolean = (<HTMLInputElement>document.getElementById('enable')).checked;
            this.circulargauge.enablePointerDrag = value;
        };
    }
    constructor() {
        // code
    };
}