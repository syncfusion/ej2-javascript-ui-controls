import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { DropDownTree } from '@syncfusion/ej2-dropdowns';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['actionFailureTemplate','allowFiltering','allowMultiSelection','changeOnBlur','cssClass','customTemplate','delimiterChar','destroyPopupOnHide','disableHtmlEncode','enableHtmlSanitizer','enablePersistence','enableRtl','enabled','fields','filterBarPlaceholder','filterType','floatLabelType','footerTemplate','headerTemplate','htmlAttributes','ignoreAccent','ignoreCase','itemTemplate','locale','mode','noRecordsTemplate','placeholder','popupHeight','popupWidth','readonly','selectAllText','showCheckBox','showClearButton','showDropDownIcon','showSelectAll','sortOrder','text','treeSettings','unSelectAllText','value','valueTemplate','width','wrapText','zIndex'];
export const outputs: string[] = ['actionFailure','beforeOpen','blur','change','close','created','dataBound','destroyed','filtering','focus','keyPress','open','select','valueChange'];
export const twoWays: string[] = ['value'];

/**
*The DropDownTree component contains a list of predefined values from which you can choose a single or multiple values.
*```html
*<ejs-dropdowntree></ejs-dropdowntree>
*```
*/
@Component({
    selector: 'ejs-dropdowntree',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropDownTreeComponent),
            multi: true
        }
    ],
    queries: {
        footerTemplate: new ContentChild('footerTemplate'),
        headerTemplate: new ContentChild('headerTemplate'),
        valueTemplate: new ContentChild('valueTemplate'),
        itemTemplate: new ContentChild('itemTemplate'),
        noRecordsTemplate: new ContentChild('noRecordsTemplate'),
        actionFailureTemplate: new ContentChild('actionFailureTemplate')
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class DropDownTreeComponent extends DropDownTree implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
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
	declare keyPress: any;
	declare open: any;
	declare select: any;
	public declare valueChange: any;



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
        
        this.formCompContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(DropDownTreeComponent.prototype, 'footerTemplate');
Template()(DropDownTreeComponent.prototype, 'headerTemplate');
Template()(DropDownTreeComponent.prototype, 'valueTemplate');
Template()(DropDownTreeComponent.prototype, 'itemTemplate');
Template('No Records Found')(DropDownTreeComponent.prototype, 'noRecordsTemplate');
Template('The Request Failed')(DropDownTreeComponent.prototype, 'actionFailureTemplate');

