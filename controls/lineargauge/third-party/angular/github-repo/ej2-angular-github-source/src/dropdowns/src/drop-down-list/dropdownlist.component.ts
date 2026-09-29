import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['actionFailureTemplate','allowFiltering','allowObjectBinding','allowResize','cssClass','dataSource','debounceDelay','enablePersistence','enableRtl','enableVirtualization','enabled','fields','filterBarPlaceholder','filterType','floatLabelType','footerTemplate','groupTemplate','headerTemplate','htmlAttributes','ignoreAccent','ignoreCase','index','isDeviceFullScreen','itemTemplate','locale','noRecordsTemplate','placeholder','popupHeight','popupWidth','query','readonly','showClearButton','sortOrder','text','value','valueTemplate','width','zIndex'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','beforeOpen','blur','change','close','created','dataBound','destroyed','filtering','focus','open','resizeStart','resizeStop','resizing','select','valueChange'];
export const twoWays: string[] = ['value'];

/**
*The DropDownList component contains a list of predefined values, from which the user can choose a single value.
*```html
*<ejs-dropdownlist></ejs-dropdownlist>
*```
*/
@Component({
    selector: 'ejs-dropdownlist',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropDownListComponent),
            multi: true
        }
    ],
    queries: {
        footerTemplate: new ContentChild('footerTemplate'),
        headerTemplate: new ContentChild('headerTemplate'),
        valueTemplate: new ContentChild('valueTemplate'),
        groupTemplate: new ContentChild('groupTemplate'),
        itemTemplate: new ContentChild('itemTemplate'),
        noRecordsTemplate: new ContentChild('noRecordsTemplate'),
        actionFailureTemplate: new ContentChild('actionFailureTemplate')
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class DropDownListComponent extends DropDownList implements IComponentBase {
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
Template()(DropDownListComponent.prototype, 'footerTemplate');
Template()(DropDownListComponent.prototype, 'headerTemplate');
Template()(DropDownListComponent.prototype, 'valueTemplate');
Template()(DropDownListComponent.prototype, 'groupTemplate');
Template()(DropDownListComponent.prototype, 'itemTemplate');
Template('No records found')(DropDownListComponent.prototype, 'noRecordsTemplate');
Template('Request failed')(DropDownListComponent.prototype, 'actionFailureTemplate');

