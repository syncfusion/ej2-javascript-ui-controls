import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { TreeGrid } from '@syncfusion/ej2-treegrid';
import { Template } from '@syncfusion/ej2-angular-base';
import { ColumnsDirective } from './columns.directive';
import { AggregatesDirective } from './aggregates.directive';

export const inputs: string[] = ['aggregates','allowExcelExport','allowFiltering','allowMultiSorting','allowPaging','allowPdfExport','allowReordering','allowResizing','allowRowDragAndDrop','allowSelection','allowSorting','allowTextWrap','childMapping','clipMode','columnChooserSettings','columnMenuItems','columnQueryMode','columns','contextMenuItems','copyHierarchyMode','currencyCode','dataSource','detailTemplate','domVirtualizationSettings','editSettings','emptyRecordTemplate','enableAdaptiveUI','enableAltRow','enableAutoFill','enableCollapseAll','enableColumnSpan','enableColumnVirtualization','enableDomVirtualization','enableHover','enableHtmlSanitizer','enableImmutableMode','enableInfiniteScrolling','enablePersistence','enableRowSpan','enableRtl','enableStickyHeader','enableVirtualMaskRow','enableVirtualization','expandStateMapping','filterSettings','frozenColumns','frozenRows','gridLines','hasChildMapping','height','hierarchyCheckboxMode','idMapping','infiniteScrollSettings','isRowSelectable','loadChildOnDemand','loadingIndicator','locale','pageSettings','pagerTemplate','parentIdMapping','printMode','query','rowDropSettings','rowHeight','rowTemplate','searchSettings','selectedRowIndex','selectionSettings','showColumnChooser','showColumnMenu','sortSettings','textWrapSettings','toolbar','treeColumnIndex','width'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','batchAdd','batchCancel','batchDelete','beforeBatchAdd','beforeBatchDelete','beforeBatchSave','beforeCopy','beforeDataBound','beforeExcelExport','beforePaste','beforePdfExport','beforePrint','beginEdit','cellDeselected','cellDeselecting','cellEdit','cellSave','cellSaved','cellSelected','cellSelecting','checkboxChange','collapsed','collapsing','columnDrag','columnDragStart','columnDrop','columnMenuClick','columnMenuOpen','contextMenuClick','contextMenuOpen','created','dataBound','dataSourceChanged','dataStateChange','detailDataBound','excelAggregateQueryCellInfo','excelExportComplete','excelHeaderQueryCellInfo','excelQueryCellInfo','expanded','expanding','headerCellInfo','load','pdfAggregateQueryCellInfo','pdfExportComplete','pdfHeaderQueryCellInfo','pdfQueryCellInfo','printComplete','queryCellInfo','recordDoubleClick','resizeStart','resizeStop','resizing','rowDataBound','rowDeselected','rowDeselecting','rowDrag','rowDragStart','rowDragStartHelper','rowDrop','rowSelected','rowSelecting','toolbarClick','dataSourceChange'];
export const twoWays: string[] = ['dataSource'];

/**
 * `ejs-treegrid` represents the Angular TreeGrid Component.
 * ```html
 * <ejs-treegrid [dataSource]='data' allowPaging='true' allowSorting='true'></ejs-treegrid>
 * ```
 */
@Component({
    selector: 'ejs-treegrid',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childColumns: new ContentChild(ColumnsDirective),
        childAggregates: new ContentChild(AggregatesDirective),
        toolbarTemplate: new ContentChild('toolbarTemplate'),
        pagerTemplate: new ContentChild('pagerTemplate'),
        rowTemplate: new ContentChild('rowTemplate'),
        detailTemplate: new ContentChild('detailTemplate'),
        editSettings_template: new ContentChild('editSettingsTemplate'),
        emptyRecordTemplate: new ContentChild('emptyRecordTemplate'),
        columnChooserSettings_headerTemplate: new ContentChild('columnChooserSettingsHeaderTemplate'),
        columnChooserSettings_template: new ContentChild('columnChooserSettingsTemplate'),
        columnChooserSettings_footerTemplate: new ContentChild('columnChooserSettingsFooterTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class TreeGridComponent extends TreeGrid implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare batchAdd: any;
	declare batchCancel: any;
	declare batchDelete: any;
	declare beforeBatchAdd: any;
	declare beforeBatchDelete: any;
	declare beforeBatchSave: any;
	declare beforeCopy: any;
	declare beforeDataBound: any;
	declare beforeExcelExport: any;
	declare beforePaste: any;
	declare beforePdfExport: any;
	declare beforePrint: any;
	declare beginEdit: any;
	declare cellDeselected: any;
	declare cellDeselecting: any;
	declare cellEdit: any;
	declare cellSave: any;
	declare cellSaved: any;
	declare cellSelected: any;
	declare cellSelecting: any;
	declare checkboxChange: any;
	declare collapsed: any;
	declare collapsing: any;
	declare columnDrag: any;
	declare columnDragStart: any;
	declare columnDrop: any;
	declare columnMenuClick: any;
	declare columnMenuOpen: any;
	declare contextMenuClick: any;
	declare contextMenuOpen: any;
	declare created: any;
	declare dataBound: any;
	declare dataSourceChanged: any;
	declare dataStateChange: any;
	declare detailDataBound: any;
	declare excelAggregateQueryCellInfo: any;
	declare excelExportComplete: any;
	declare excelHeaderQueryCellInfo: any;
	declare excelQueryCellInfo: any;
	declare expanded: any;
	declare expanding: any;
	declare headerCellInfo: any;
	declare load: any;
	declare pdfAggregateQueryCellInfo: any;
	declare pdfExportComplete: any;
	declare pdfHeaderQueryCellInfo: any;
	declare pdfQueryCellInfo: any;
	declare printComplete: any;
	declare queryCellInfo: any;
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
                let mod = this.injector.get('TreeGridFilter');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridPage');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridSort');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridReorder');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridToolbar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridAggregate');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridResize');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridColumnMenu');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridExcelExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridPdfExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridCommandColumn');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridContextMenu');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridEdit');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridSelection');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridVirtualScroll');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridDetailRow');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridRowDD');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridFreeze');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridColumnChooser');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridLogger');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridInfiniteScroll');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('TreeGridDomVirtualization');
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
Template()(TreeGridComponent.prototype, 'toolbarTemplate');
Template()(TreeGridComponent.prototype, 'pagerTemplate');
Template()(TreeGridComponent.prototype, 'rowTemplate');
Template()(TreeGridComponent.prototype, 'detailTemplate');
Template()(TreeGridComponent.prototype, 'editSettings_template');
Template()(TreeGridComponent.prototype, 'emptyRecordTemplate');
Template()(TreeGridComponent.prototype, 'columnChooserSettings_headerTemplate');
Template()(TreeGridComponent.prototype, 'columnChooserSettings_template');
Template()(TreeGridComponent.prototype, 'columnChooserSettings_footerTemplate');


