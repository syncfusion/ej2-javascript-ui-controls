import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['actionFailureTemplate','allowCustom','allowFiltering','allowObjectBinding','allowResize','autofill','cssClass','dataSource','debounceDelay','enablePersistence','enableRtl','enableVirtualization','enabled','fields','filterBarPlaceholder','filterType','floatLabelType','footerTemplate','groupTemplate','headerTemplate','htmlAttributes','ignoreAccent','ignoreCase','index','isDeviceFullScreen','itemTemplate','locale','noRecordsTemplate','placeholder','popupHeight','popupWidth','query','readonly','showClearButton','sortOrder','text','value','valueTemplate','width','zIndex'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','beforeOpen','blur','change','close','created','customValueSpecifier','dataBound','destroyed','filtering','focus','open','resizeStart','resizeStop','resizing','select','valueChange'];
export const twoWays: string[] = ['value'];

/**
*The ComboBox component allows the user to type a value or choose an option from the list of predefined options.
*```html
*<ejs-combobox></ejs-combobox>
*```
*/
@Component({
    selector: 'ejs-combobox',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ComboBoxComponent),
            multi: true
        }
    ],
    queries: {
        footerTemplate: new ContentChild('footerTemplate'),
        headerTemplate: new ContentChild('headerTemplate'),
        groupTemplate: new ContentChild('groupTemplate'),
        itemTemplate: new ContentChild('itemTemplate'),
        noRecordsTemplate: new ContentChild('noRecordsTemplate'),
        actionFailureTemplate: new ContentChild('actionFailureTemplate')
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class ComboBoxComponent extends ComboBox implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare beforeOpen: any;
	declare blur: any;
	declare change: any;
	declare close: any;
	declare created: any;
	declare customValueSpecifier: any;
	declare dataBound: any;
	declare destroyed: any;
	declare filtering: any;
	declare focus: any;
	declare open: any;
	declare resizeStart: any;
	declare resizeStop: any;
	declare resizing: any;
	declare select: any;
	public declare valueChange: any;



    private skipFromEvent:boolean = true;
    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector, private cdr: ChangeDetectorRef) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('DropDownsVirtualScroll');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

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
        
        this.formCompContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(ComboBoxComponent.prototype, 'footerTemplate');
Template()(ComboBoxComponent.prototype, 'headerTemplate');
Template()(ComboBoxComponent.prototype, 'groupTemplate');
Template()(ComboBoxComponent.prototype, 'itemTemplate');
Template('No records found')(ComboBoxComponent.prototype, 'noRecordsTemplate');
Template('Request failed')(ComboBoxComponent.prototype, 'actionFailureTemplate');

