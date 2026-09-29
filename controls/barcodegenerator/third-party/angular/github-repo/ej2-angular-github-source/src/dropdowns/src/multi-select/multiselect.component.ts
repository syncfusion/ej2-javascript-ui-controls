import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { MultiSelect } from '@syncfusion/ej2-dropdowns';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['actionFailureTemplate','addTagOnBlur','allowCustomValue','allowFiltering','allowObjectBinding','allowResize','changeOnBlur','closePopupOnSelect','cssClass','dataSource','debounceDelay','delimiterChar','enableGroupCheckBox','enableHtmlSanitizer','enablePersistence','enableRtl','enableSelectionOrder','enableVirtualization','enabled','fields','filterBarPlaceholder','filterType','floatLabelType','footerTemplate','groupTemplate','headerTemplate','hideSelectedItem','htmlAttributes','ignoreAccent','ignoreCase','isDeviceFullScreen','itemTemplate','locale','maximumSelectionLength','mode','noRecordsTemplate','openOnClick','placeholder','popupHeight','popupWidth','query','readonly','selectAllText','showClearButton','showDropDownIcon','showSelectAll','sortOrder','summaryTagCount','summaryTagTemplate','text','unSelectAllText','value','valueTemplate','width','zIndex'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','beforeOpen','beforeSelectAll','blur','change','chipSelection','close','created','customValueSelection','dataBound','destroyed','filtering','focus','open','removed','removing','resizeStart','resizeStop','resizing','select','selectedAll','tagging','valueChange'];
export const twoWays: string[] = ['value'];

/**
* The MultiSelect allows the user to pick a values from the predefined list of values.
*```html
*<ejs-multiselect></ejs-multiselect>
*```
*/
@Component({
    selector: 'ejs-multiselect',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiSelectComponent),
            multi: true
        }
    ],
    queries: {
        footerTemplate: new ContentChild('footerTemplate'),
        headerTemplate: new ContentChild('headerTemplate'),
        valueTemplate: new ContentChild('valueTemplate'),
        itemTemplate: new ContentChild('itemTemplate'),
        groupTemplate: new ContentChild('groupTemplate'),
        noRecordsTemplate: new ContentChild('noRecordsTemplate'),
        actionFailureTemplate: new ContentChild('actionFailureTemplate')
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class MultiSelectComponent extends MultiSelect implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare beforeOpen: any;
	declare beforeSelectAll: any;
	declare blur: any;
	declare change: any;
	declare chipSelection: any;
	declare close: any;
	declare created: any;
	declare customValueSelection: any;
	declare dataBound: any;
	declare destroyed: any;
	declare filtering: any;
	declare focus: any;
	declare open: any;
	declare removed: any;
	declare removing: any;
	declare resizeStart: any;
	declare resizeStop: any;
	declare resizing: any;
	declare select: any;
	declare selectedAll: any;
	declare tagging: any;
	public declare valueChange: any;



    private skipFromEvent:boolean = true;
    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector, private cdr: ChangeDetectorRef) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('DropDownsCheckBoxSelection');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
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
Template()(MultiSelectComponent.prototype, 'footerTemplate');
Template()(MultiSelectComponent.prototype, 'headerTemplate');
Template()(MultiSelectComponent.prototype, 'valueTemplate');
Template()(MultiSelectComponent.prototype, 'itemTemplate');
Template()(MultiSelectComponent.prototype, 'groupTemplate');
Template('No records found')(MultiSelectComponent.prototype, 'noRecordsTemplate');
Template('Request failed')(MultiSelectComponent.prototype, 'actionFailureTemplate');

