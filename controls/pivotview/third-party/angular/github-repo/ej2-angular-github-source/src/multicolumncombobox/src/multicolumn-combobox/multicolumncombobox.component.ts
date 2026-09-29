import { Component, ElementRef, ViewContainerRef, ValueProvider, Renderer2, Injector, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, ContentChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, FormBase, setValue } from '@syncfusion/ej2-angular-base';
import { MultiColumnComboBox } from '@syncfusion/ej2-multicolumn-combobox';
import { Template } from '@syncfusion/ej2-angular-base';
import { ColumnsDirective } from './columns.directive';

export const inputs: string[] = ['actionFailureTemplate','allowFiltering','allowSorting','columns','cssClass','dataSource','disabled','enablePersistence','enableRtl','enableVirtualization','fields','filterType','floatLabelType','footerTemplate','gridSettings','groupTemplate','htmlAttributes','index','itemTemplate','locale','noRecordsTemplate','placeholder','popupHeight','popupWidth','query','readonly','showClearButton','sortOrder','sortType','text','value','width'];
export const outputs: string[] = ['focus', 'blur', 'actionBegin','actionComplete','actionFailure','change','close','created','filtering','open','select','valueChange'];
export const twoWays: string[] = ['value'];

/**
 * Represents the Essential JS 2 Angular MultiColumnComboBox Component.
 * ```html
 * <ejs-multicolumncombobox></ejs-multicolumncombobox>
 * ```
 */
@Component({
    selector: 'ejs-multicolumncombobox',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiColumnComboBoxComponent),
            multi: true
        }
    ],
    queries: {
        childColumns: new ContentChild(ColumnsDirective),
        footerTemplate: new ContentChild('footerTemplate'),
        itemTemplate: new ContentChild('itemTemplate'),
        groupTemplate: new ContentChild('groupTemplate'),
        noRecordsTemplate: new ContentChild('noRecordsTemplate'),
        actionFailureTemplate: new ContentChild('actionFailureTemplate')
    }
})
@ComponentMixins([ComponentBase, FormBase])
export class MultiColumnComboBoxComponent extends MultiColumnComboBox implements IComponentBase {
    public formCompContext : any;
    public formContext : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare change: any;
	declare close: any;
	declare created: any;
	declare filtering: any;
	declare open: any;
	declare select: any;
	public declare valueChange: any;
    public declare childColumns: any;
    public tags: string[] = ['columns'];

    public declare focus: any;
    public declare blur: any;
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
        this.tagObjects[0].instance = this.childColumns;
        this.formCompContext.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(MultiColumnComboBoxComponent.prototype, 'footerTemplate');
Template()(MultiColumnComboBoxComponent.prototype, 'itemTemplate');
Template()(MultiColumnComboBoxComponent.prototype, 'groupTemplate');
Template('No records found')(MultiColumnComboBoxComponent.prototype, 'noRecordsTemplate');
Template('Request Failed')(MultiColumnComboBoxComponent.prototype, 'actionFailureTemplate');

