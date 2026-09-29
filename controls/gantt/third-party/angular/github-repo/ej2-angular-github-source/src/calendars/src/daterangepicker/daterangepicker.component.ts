import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { DateRangePicker } from '@syncfusion/ej2-calendars';
import { Template } from '@syncfusion/ej2-angular-base';
import { PresetsDirective } from './presets.directive';

export const inputs: string[] = ['allowEdit','calendarMode','cssClass','dayHeaderFormat','depth','enablePersistence','enableRtl','enabled','endDate','firstDayOfWeek','floatLabelType','format','fullScreenMode','htmlAttributes','inputFormats','keyConfigs','locale','max','maxDays','min','minDays','openOnFocus','placeholder','presets','readonly','separator','serverTimezoneOffset','showClearButton','start','startDate','strictMode','value','weekNumber','weekRule','width','zIndex'];
export const outputs: string[] = ['blur','change','cleared','close','created','destroyed','focus','navigated','open','renderDayCell','select','startDateChange','endDateChange','valueChange'];
export const twoWays: string[] = ['startDate', 'endDate', 'value'];

/**
 * Represents the Essential JS 2 Angular DateRangePicker Component.
 * ```html
 * <ejs-daterangepicker [startDate]='date' [endDate]='date'></ejs-daterangepicker>
 * ```
 */
@Component({
    selector: 'ejs-daterangepicker',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateRangePickerComponent),
            multi: true
        }
    ],
    queries: {
        childPresets: new ContentChild(PresetsDirective),
        start: new ContentChild('start'),
        end: new ContentChild('end')
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class DateRangePickerComponent extends DateRangePicker implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
	declare blur: any;
	declare change: any;
	declare cleared: any;
	declare close: any;
	declare created: any;
	declare destroyed: any;
	declare focus: any;
	declare navigated: any;
	declare open: any;
	declare renderDayCell: any;
	declare select: any;
	declare startDateChange: any;
	declare endDateChange: any;
	public declare valueChange: any;
    public declare childPresets: any;
    public tags: string[] = ['presets'];

    private skipFromEvent:boolean = true;
    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector, private cdr: ChangeDetectorRef) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.formContext  = new FormBase();
        this.formCompContext  = new ComponentBase();
    }

    public registerOnChange(registerFunction: (_: any) => void): void {
    }

    public registerOnTouched(registerFunction: () => void): void {
    }

    public writeValue(value: any): void {
    }
    
    public setDisabledState(disabled: boolean): void {
    }

    public ngOnInit() {
        this.formCompContext.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.formContext.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.formCompContext.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        this.tagObjects[0].instance = this.childPresets;
        this.formCompContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(DateRangePickerComponent.prototype, 'start');
Template()(DateRangePickerComponent.prototype, 'end');

