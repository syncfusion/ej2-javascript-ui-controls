import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { PivotFieldList } from '@syncfusion/ej2-pivotview';



export const inputs: string[] = ['aggregateTypes','allowCalculatedField','allowDeferLayoutUpdate','cssClass','currencyCode','dataSourceSettings','enableFieldSearching','enableHtmlSanitizer','enablePersistence','enableRtl','loadOnDemandInMemberEditor','locale','maxNodeLimitInMemberEditor','renderMode','showValuesButton','spinnerTemplate','target'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','afterServiceInvoke','aggregateCellInfo','aggregateMenuOpen','beforeServiceInvoke','calculatedFieldCreate','created','dataBound','destroyed','enginePopulated','enginePopulating','fieldDragStart','fieldDrop','fieldRemove','load','memberEditorOpen','memberFiltering','onFieldDropped','onHeadersSort'];
export const twoWays: string[] = [];

/**
 * `ej-pivotfieldlist` represents the Angular PivotFieldList Component.
 * ```html
 * <ej-pivotfieldlist></ej-pivotfieldlist>
 * ```
 */
@Component({
    selector: 'ejs-pivotfieldlist',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
    }
})
@ComponentMixins([ComponentBase])
export class PivotFieldListComponent extends PivotFieldList implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare afterServiceInvoke: any;
	declare aggregateCellInfo: any;
	declare aggregateMenuOpen: any;
	declare beforeServiceInvoke: any;
	declare calculatedFieldCreate: any;
	declare created: any;
	declare dataBound: any;
	declare destroyed: any;
	declare enginePopulated: any;
	declare enginePopulating: any;
	declare fieldDragStart: any;
	declare fieldDrop: any;
	declare fieldRemove: any;
	declare load: any;
	declare memberEditorOpen: any;
	declare memberFiltering: any;
	declare onFieldDropped: any;
	public declare onHeadersSort: any;



    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('PivotViewCalculatedField');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.context  = new ComponentBase();
    }

    public ngOnInit() {
        this.context.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.context.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.context.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}


