import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Grid } from '@syncfusion/ej2-grids';
import { Template } from '@syncfusion/ej2-angular-base';
import { ColumnsDirective } from './columns.directive';
import { AggregatesDirective } from './aggregates.directive';

export const inputs: string[] = ['adaptiveUIMode','advancedFilterSettings','aggregates','allowAdvancedFiltering','allowExcelExport','allowFiltering','allowGrouping','allowKeyboard','allowMultiSorting','allowPaging','allowPdfExport','allowReordering','allowResizing','allowRowDragAndDrop','allowSelection','allowSorting','allowTextWrap','autoFit','childGrid','clipMode','columnChooserSettings','columnMenuItems','columnQueryMode','columns','contextMenuItems','cssClass','currencyCode','currentAction','currentViewData','dataSource','detailTemplate','detailTemplateHeight','domVirtualizationSettings','editSettings','ej2StatePersistenceVersion','emptyRecordMode','emptyRecordTemplate','enableAdaptiveUI','enableAltRow','enableAutoFill','enableColumnSpan','enableColumnVirtualization','enableDomVirtualization','enableHeaderFocus','enableHover','enableHtmlSanitizer','enableImmutableMode','enableInfiniteScrolling','enablePersistence','enableRowSpan','enableRtl','enableStickyHeader','enableVirtualMaskRow','enableVirtualization','enableWebMcp','exportGrids','filterSettings','footerRowHeight','formulaSettings','frozenColumns','frozenRows','gridLines','groupSettings','headerRowHeight','height','hierarchyPrintMode','infiniteScrollSettings','isRowPinned','isRowSelectable','loadingIndicator','locale','pageSettings','pagerTemplate','parentDetails','printMode','query','queryString','resizeSettings','rowDropSettings','rowHeight','rowRenderingMode','rowTemplate','searchSettings','selectedRowIndex','selectionSettings','setRowHeight','showColumnChooser','showColumnMenu','showHider','sortSettings','textWrapSettings','toolbar','toolbarTemplate','width'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','advancedFilterBegin','advancedFilterClose','advancedFilterComplete','advancedFilterOpen','batchAdd','batchCancel','batchDelete','beforeAutoFill','beforeBatchAdd','beforeBatchDelete','beforeBatchSave','beforeCopy','beforeCustomFilterOpen','beforeDataBound','beforeDetailTemplateDetach','beforeExcelExport','beforeOpenAdaptiveDialog','beforeOpenColumnChooser','beforePaste','beforePdfExport','beforePrint','beforeWebMcpToolExecute','beginEdit','cellDeselected','cellDeselecting','cellEdit','cellFocus','cellSave','cellSaved','cellSelected','cellSelecting','checkBoxChange','columnDataStateChange','columnDeselected','columnDeselecting','columnDrag','columnDragStart','columnDrop','columnMenuClick','columnMenuClose','columnMenuOpen','columnSelected','columnSelecting','commandClick','contextMenuClick','contextMenuClose','contextMenuOpen','created','dataBound','dataSourceChanged','dataStateChange','destroyed','detailCollapse','detailCollapsed','detailDataBound','detailExpand','detailExpanded','excelAggregateQueryCellInfo','excelExportComplete','excelHeaderQueryCellInfo','excelQueryCellInfo','exportDetailDataBound','exportDetailTemplate','exportGroupCaption','headerCellInfo','keyPressed','lazyLoadGroupCollapse','lazyLoadGroupExpand','load','pdfAggregateQueryCellInfo','pdfExportComplete','pdfHeaderQueryCellInfo','pdfQueryCellInfo','printComplete','queryCellInfo','recordClick','recordDoubleClick','resizeStart','resizeStop','resizing','rowDataBound','rowDeselected','rowDeselecting','rowDrag','rowDragStart','rowDragStartHelper','rowDrop','rowSelected','rowSelecting','toolbarClick','dataSourceChange'];
export const twoWays: string[] = ['dataSource'];

/**
 * `ejs-grid` represents the Angular Grid Component.
 * ```html
 * <ejs-grid [dataSource]='data' allowPaging='true' allowSorting='true'></ejs-grid>
 * ```
 */
@Component({
    selector: 'ejs-grid',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childColumns: new ContentChild(ColumnsDirective),
        childAggregates: new ContentChild(AggregatesDirective),
        rowTemplate: new ContentChild('rowTemplate'),
        emptyRecordTemplate: new ContentChild('emptyRecordTemplate'),
        detailTemplate: new ContentChild('detailTemplate'),
        toolbarTemplate: new ContentChild('toolbarTemplate'),
        pagerTemplate: new ContentChild('pagerTemplate'),
        editSettings_template: new ContentChild('editSettingsTemplate'),
        groupSettings_captionTemplate: new ContentChild('groupSettingsCaptionTemplate'),
        columnChooserSettings_headerTemplate: new ContentChild('columnChooserSettingsHeaderTemplate'),
        columnChooserSettings_template: new ContentChild('columnChooserSettingsTemplate'),
        columnChooserSettings_footerTemplate: new ContentChild('columnChooserSettingsFooterTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class GridComponent extends Grid implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare advancedFilterBegin: any;
	declare advancedFilterClose: any;
	declare advancedFilterComplete: any;
	declare advancedFilterOpen: any;
	declare batchAdd: any;
	declare batchCancel: any;
	declare batchDelete: any;
	declare beforeAutoFill: any;
	declare beforeBatchAdd: any;
	declare beforeBatchDelete: any;
	declare beforeBatchSave: any;
	declare beforeCopy: any;
	declare beforeCustomFilterOpen: any;
	declare beforeDataBound: any;
	declare beforeDetailTemplateDetach: any;
	declare beforeExcelExport: any;
	declare beforeOpenAdaptiveDialog: any;
	declare beforeOpenColumnChooser: any;
	declare beforePaste: any;
	declare beforePdfExport: any;
	declare beforePrint: any;
	declare beforeWebMcpToolExecute: any;
	declare beginEdit: any;
	declare cellDeselected: any;
	declare cellDeselecting: any;
	declare cellEdit: any;
	declare cellFocus: any;
	declare cellSave: any;
	declare cellSaved: any;
	declare cellSelected: any;
	declare cellSelecting: any;
	declare checkBoxChange: any;
	declare columnDataStateChange: any;
	declare columnDeselected: any;
	declare columnDeselecting: any;
	declare columnDrag: any;
	declare columnDragStart: any;
	declare columnDrop: any;
	declare columnMenuClick: any;
	declare columnMenuClose: any;
	declare columnMenuOpen: any;
	declare columnSelected: any;
	declare columnSelecting: any;
	declare commandClick: any;
	declare contextMenuClick: any;
	declare contextMenuClose: any;
	declare contextMenuOpen: any;
	declare created: any;
	declare dataBound: any;
	declare dataSourceChanged: any;
	declare dataStateChange: any;
	declare destroyed: any;
	declare detailCollapse: any;
	declare detailCollapsed: any;
	declare detailDataBound: any;
	declare detailExpand: any;
	declare detailExpanded: any;
	declare excelAggregateQueryCellInfo: any;
	declare excelExportComplete: any;
	declare excelHeaderQueryCellInfo: any;
	declare excelQueryCellInfo: any;
	declare exportDetailDataBound: any;
	declare exportDetailTemplate: any;
	declare exportGroupCaption: any;
	declare headerCellInfo: any;
	declare keyPressed: any;
	declare lazyLoadGroupCollapse: any;
	declare lazyLoadGroupExpand: any;
	declare load: any;
	declare pdfAggregateQueryCellInfo: any;
	declare pdfExportComplete: any;
	declare pdfHeaderQueryCellInfo: any;
	declare pdfQueryCellInfo: any;
	declare printComplete: any;
	declare queryCellInfo: any;
	declare recordClick: any;
	declare recordDoubleClick: any;
	declare resizeStart: any;
	declare resizeStop: any;
	declare resizing: any;
	declare rowDataBound: any;
	declare rowDeselected: any;
	declare rowDeselecting: any;
	declare rowDrag: any;
	declare rowDragStart: any;
	declare rowDragStartHelper: any;
	declare rowDrop: any;
	declare rowSelected: any;
	declare rowSelecting: any;
	declare toolbarClick: any;
	public declare dataSourceChange: any;
    public declare childColumns: QueryList<ColumnsDirective>;
    public declare childAggregates: QueryList<AggregatesDirective>;
    public tags: string[] = ['columns', 'aggregates'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('GridsFilter');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsPage');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsSelection');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsSort');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsGroup');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsReorder');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsRowDD');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsDetailRow');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsToolbar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsAggregate');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsSearch');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsVirtualScroll');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsEdit');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsResize');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsExcelExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsPdfExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsCommandColumn');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsContextMenu');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsFreeze');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsColumnMenu');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsColumnChooser');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsForeignKey');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsInfiniteScroll');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsLazyLoadGroup');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsDomVirtualization');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsFormula');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsAdvancedFilter');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GridsWebMcpAdapter');
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
        this.tagObjects[0].instance = this.childColumns;
        if (this.childAggregates) {
                    this.tagObjects[1].instance = this.childAggregates as any;
                }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(GridComponent.prototype, 'rowTemplate');
Template()(GridComponent.prototype, 'emptyRecordTemplate');
Template()(GridComponent.prototype, 'detailTemplate');
Template()(GridComponent.prototype, 'toolbarTemplate');
Template()(GridComponent.prototype, 'pagerTemplate');
Template()(GridComponent.prototype, 'editSettings_template');
Template()(GridComponent.prototype, 'groupSettings_captionTemplate');
Template()(GridComponent.prototype, 'columnChooserSettings_headerTemplate');
Template()(GridComponent.prototype, 'columnChooserSettings_template');
Template()(GridComponent.prototype, 'columnChooserSettings_footerTemplate');


