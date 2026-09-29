import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { PivotView } from '@syncfusion/ej2-pivotview';
import { Template } from '@syncfusion/ej2-angular-base';


export const inputs: string[] = ['aggregateTypes','allowCalculatedField','allowConditionalFormatting','allowDataCompression','allowDeferLayoutUpdate','allowDrillThrough','allowExcelExport','allowGrouping','allowNumberFormatting','allowPdfExport','cellTemplate','chartSettings','chartTypes','cssClass','dataSourceSettings','displayOption','editSettings','enableFieldSearching','enableHtmlSanitizer','enablePaging','enablePersistence','enableRtl','enableValueSorting','enableVirtualization','enableWebMcp','exportAllPages','gridSettings','groupingBarSettings','height','hyperlinkSettings','loadOnDemandInMemberEditor','locale','maxNodeLimitInMemberEditor','maxRowsInDrillThrough','pageSettings','pagerSettings','pivotValues','showFieldList','showGroupingBar','showToolbar','showTooltip','showValuesButton','spinnerTemplate','toolbar','toolbarTemplate','tooltipTemplate','virtualScrollSettings','width'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','afterServiceInvoke','aggregateCellInfo','aggregateMenuOpen','beforeExport','beforeServiceInvoke','beforeWebMcpToolExecute','beginDrillThrough','calculatedFieldCreate','cellClick','cellSelected','cellSelecting','chartSeriesCreated','conditionalFormatting','created','dataBound','destroyed','drill','drillThrough','editCompleted','enginePopulated','enginePopulating','exportComplete','fetchReport','fieldDragStart','fieldDrop','fieldListRefreshed','fieldRemove','hyperlinkCellClick','load','loadReport','memberEditorOpen','memberFiltering','newReport','numberFormatting','onFieldDropped','onHeadersSort','onPdfCellRender','removeReport','renameReport','saveReport','toolbarClick','toolbarRender'];
export const twoWays: string[] = [];

/**
 * `ej-pivotview` represents the Angular Pivot Table Component.
 * ```html
 * <ej-pivotview></ej-pivotview>
 * ```
 */
@Component({
    selector: 'ejs-pivotview',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        cellTemplate: new ContentChild('cellTemplate'),
        tooltipTemplate: new ContentChild('tooltipTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class PivotViewComponent extends PivotView implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare afterServiceInvoke: any;
	declare aggregateCellInfo: any;
	declare aggregateMenuOpen: any;
	declare beforeExport: any;
	declare beforeServiceInvoke: any;
	declare beforeWebMcpToolExecute: any;
	declare beginDrillThrough: any;
	declare calculatedFieldCreate: any;
	declare cellClick: any;
	declare cellSelected: any;
	declare cellSelecting: any;
	declare chartSeriesCreated: any;
	declare conditionalFormatting: any;
	declare created: any;
	declare dataBound: any;
	declare destroyed: any;
	declare drill: any;
	declare drillThrough: any;
	declare editCompleted: any;
	declare enginePopulated: any;
	declare enginePopulating: any;
	declare exportComplete: any;
	declare fetchReport: any;
	declare fieldDragStart: any;
	declare fieldDrop: any;
	declare fieldListRefreshed: any;
	declare fieldRemove: any;
	declare hyperlinkCellClick: any;
	declare load: any;
	declare loadReport: any;
	declare memberEditorOpen: any;
	declare memberFiltering: any;
	declare newReport: any;
	declare numberFormatting: any;
	declare onFieldDropped: any;
	declare onHeadersSort: any;
	declare onPdfCellRender: any;
	declare removeReport: any;
	declare renameReport: any;
	declare saveReport: any;
	declare toolbarClick: any;
	public declare toolbarRender: any;



    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('PivotViewGroupingBar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewFieldList');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewCalculatedField');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewConditionalFormatting');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewVirtualScroll');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewDrillThrough');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewToolbar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewPivotChart');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewPDFExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewExcelExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewNumberFormatting');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewGrouping');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewPager');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PivotViewWebMcpAdapter');
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
Template()(PivotViewComponent.prototype, 'cellTemplate');
Template()(PivotViewComponent.prototype, 'tooltipTemplate');


