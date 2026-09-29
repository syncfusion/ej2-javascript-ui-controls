import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { isUndefined } from '@syncfusion/ej2-base';

import { Grid, GridModel } from '@syncfusion/ej2-grids';
import { StackedColumnsDirective, StackedColumnDirective, StackedColumnsPlugin, StackedColumnPlugin } from './stacked-column.directive'
import { ColumnsDirective, ColumnDirective, ColumnsPlugin, ColumnPlugin } from './columns.directive'
import { AggregateColumnsDirective, AggregateColumnDirective, AggregateColumnsPlugin, AggregateColumnPlugin } from './aggregate-columns.directive'
import { AggregatesDirective, AggregateDirective, AggregatesPlugin, AggregatePlugin } from './aggregates.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'adaptiveUIMode', 'advancedFilterSettings', 'aggregates', 'allowAdvancedFiltering', 'allowExcelExport', 'allowFiltering', 'allowGrouping', 'allowKeyboard', 'allowMultiSorting', 'allowPaging', 'allowPdfExport', 'allowReordering', 'allowResizing', 'allowRowDragAndDrop', 'allowSelection', 'allowSorting', 'allowTextWrap', 'autoFit', 'childGrid', 'clipMode', 'columnChooserSettings', 'columnMenuItems', 'columnQueryMode', 'columns', 'contextMenuItems', 'cssClass', 'currencyCode', 'currentAction', 'currentViewData', 'dataSource', 'detailTemplate', 'detailTemplateHeight', 'domVirtualizationSettings', 'editSettings', 'ej2StatePersistenceVersion', 'emptyRecordMode', 'emptyRecordTemplate', 'enableAdaptiveUI', 'enableAltRow', 'enableAutoFill', 'enableColumnSpan', 'enableColumnVirtualization', 'enableDomVirtualization', 'enableHeaderFocus', 'enableHover', 'enableHtmlSanitizer', 'enableImmutableMode', 'enableInfiniteScrolling', 'enablePersistence', 'enableRowSpan', 'enableRtl', 'enableStickyHeader', 'enableVirtualMaskRow', 'enableVirtualization', 'enableWebMcp', 'exportGrids', 'filterSettings', 'footerRowHeight', 'formulaSettings', 'frozenColumns', 'frozenRows', 'gridLines', 'groupSettings', 'headerRowHeight', 'height', 'hierarchyPrintMode', 'infiniteScrollSettings', 'isRowPinned', 'isRowSelectable', 'loadingIndicator', 'locale', 'pageSettings', 'pagerTemplate', 'parentDetails', 'printMode', 'query', 'queryString', 'resizeSettings', 'rowDropSettings', 'rowHeight', 'rowRenderingMode', 'rowTemplate', 'searchSettings', 'selectedRowIndex', 'selectionSettings', 'setRowHeight', 'showColumnChooser', 'showColumnMenu', 'showHider', 'sortSettings', 'textWrapSettings', 'toolbar', 'toolbarTemplate', 'width', 'actionBegin', 'actionComplete', 'actionFailure', 'advancedFilterBegin', 'advancedFilterClose', 'advancedFilterComplete', 'advancedFilterOpen', 'batchAdd', 'batchCancel', 'batchDelete', 'beforeAutoFill', 'beforeBatchAdd', 'beforeBatchDelete', 'beforeBatchSave', 'beforeCopy', 'beforeCustomFilterOpen', 'beforeDataBound', 'beforeDetailTemplateDetach', 'beforeExcelExport', 'beforeOpenAdaptiveDialog', 'beforeOpenColumnChooser', 'beforePaste', 'beforePdfExport', 'beforePrint', 'beforeWebMcpToolExecute', 'beginEdit', 'cellDeselected', 'cellDeselecting', 'cellEdit', 'cellFocus', 'cellSave', 'cellSaved', 'cellSelected', 'cellSelecting', 'checkBoxChange', 'columnDataStateChange', 'columnDeselected', 'columnDeselecting', 'columnDrag', 'columnDragStart', 'columnDrop', 'columnMenuClick', 'columnMenuClose', 'columnMenuOpen', 'columnSelected', 'columnSelecting', 'commandClick', 'contextMenuClick', 'contextMenuClose', 'contextMenuOpen', 'created', 'dataBound', 'dataSourceChanged', 'dataStateChange', 'destroyed', 'detailCollapse', 'detailCollapsed', 'detailDataBound', 'detailExpand', 'detailExpanded', 'excelAggregateQueryCellInfo', 'excelExportComplete', 'excelHeaderQueryCellInfo', 'excelQueryCellInfo', 'exportDetailDataBound', 'exportDetailTemplate', 'exportGroupCaption', 'headerCellInfo', 'keyPressed', 'lazyLoadGroupCollapse', 'lazyLoadGroupExpand', 'load', 'pdfAggregateQueryCellInfo', 'pdfExportComplete', 'pdfHeaderQueryCellInfo', 'pdfQueryCellInfo', 'printComplete', 'queryCellInfo', 'recordClick', 'recordDoubleClick', 'resizeStart', 'resizeStop', 'resizing', 'rowDataBound', 'rowDeselected', 'rowDeselecting', 'rowDrag', 'rowDragStart', 'rowDragStartHelper', 'rowDrop', 'rowSelected', 'rowSelecting', 'toolbarClick'];
export const modelProps: string[] = ['dataSource'];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * `ejs-grid` represents the VueJS Grid Component.
 * ```vue
 * <ejs-grid :dataSource='data' allowPaging='true' allowSorting='true'></ejs-grid>
 * ```
 */
export let GridComponent: DefineVueComponent<GridModel> =  vueDefineComponent({
    name: 'GridComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    model: { event: 'modelchanged' },
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new Grid({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-columns":{"e-column":{"e-stacked-columns":"e-stacked-column"}},"e-aggregates":{"e-aggregate":{"e-columns":"e-column"}}} as { [key: string]: Object },
            tagNameMapper: {"e-stacked-columns":"e-columns"} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {
        this.ej2Instances._trigger = this.ej2Instances.trigger;
        this.ej2Instances.trigger = this.trigger;
        this.bindProperties();
        this.ej2Instances._setProperties = this.ej2Instances.setProperties;
        this.ej2Instances.setProperties = this.setProperties;
        this.ej2Instances.clearTemplate = this.clearTemplate;
        this.updated = this.updated;
    },
    render(createElement: any) {
        let h: any = !isExecute ? gh : createElement;
        let slots: any = null;
        if(!isNullOrUndefined((this as any).$slots.default)) {
            slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
        }
        return h('div', slots);
    },
    methods: {
        clearTemplate(templateNames?: string[]): any {
            if (!templateNames){ templateNames = Object.keys(this.templateCollection || {}) }
            if (templateNames.length &&  this.templateCollection) {
                for (let tempName of templateNames){
                    let elementCollection: any = this.templateCollection[tempName];
                    if(elementCollection && elementCollection.length) {
                        for(let ele of elementCollection) {
                            this.destroyPortals(ele);
                        }
                        delete this.templateCollection[tempName];
                    }
                }
            }
        },
        setProperties(prop: any, muteOnChange: boolean): void {
            if(this.isVue3) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if (this.ej2Instances && this.ej2Instances._setProperties) {
                this.ej2Instances._setProperties(prop, muteOnChange);
            }
            if (prop && this.models && this.models.length) {
                Object.keys(prop).map((key: string): void => {
                    this.models.map((model: string): void => {
                        if ((key === model) && !(/datasource/i.test(key))) {
                            if (this.isVue3) {
                                this.ej2Instances.vueInstance.$emit('update:' + key, prop[key]);
                            } else {
                                (this as any).$emit('update:' + key, prop[key]);
                                (this as any).$emit('modelchanged', prop[key]);
                            }
                        }
                    });
                });
            }
        },        
        trigger(eventName: string, eventProp: {[key:string]:Object}, successHandler?: Function): void {
            if(!isExecute) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if ((eventName === 'change' || eventName === 'input') && this.models && (this.models.length !== 0)) {
                let key: string[] = this.models.toString().match(/checked|value/) || [];
                let propKey: string = key[0];
                if (eventProp && key && !isUndefined(eventProp[propKey])) {
                    if (!isExecute) {
                        this.ej2Instances.vueInstance.$emit('update:' + propKey, eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('modelchanged', eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('update:modelValue', eventProp[propKey]);
                    } else {
                        if (eventName === 'change' || ((this as any).$props && !(this as any).$props.isLazyUpdate)) {
                            (this as any).$emit('update:'+ propKey, eventProp[propKey]);
                            (this as any).$emit('modelchanged', eventProp[propKey]);
                        }
                    }
                }
            } else if ((eventName === 'actionBegin' && eventProp.requestType === 'dateNavigate') && this.models && (this.models.length !== 0)) {
                let key: string[] = this.models.toString().match(/currentView|selectedDate/) || [];
                let propKey: string = key[0];
                if (eventProp && key && !isUndefined(eventProp[propKey])) {
                    if (!isExecute) {
                        this.ej2Instances.vueInstance.$emit('update:' + propKey, eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('modelchanged', eventProp[propKey]);
                    } else {
                        (this as any).$emit('update:'+ propKey, eventProp[propKey]);
                        (this as any).$emit('modelchanged', eventProp[propKey]);
                    }
                }
            }
            if ((this.ej2Instances && this.ej2Instances._trigger)) {
                this.ej2Instances._trigger(eventName, eventProp, successHandler); 
            }
        },

        custom(): void {
            this.updated();
        },
        addFormula(name: string, handler: Object): void {
            return this.ej2Instances.addFormula(name, handler);
        },
        addRecord(data?: Object, index?: number): void {
            return this.ej2Instances.addRecord(data, index);
        },
        addRecordAsync(data?: Object, index?: number): Object {
            return this.ej2Instances.addRecordAsync(data, index);
        },
        addShimmerEffect(): void {
            return this.ej2Instances.addShimmerEffect();
        },
        applyAdvancedFilter(rule?: Object): void {
            return this.ej2Instances.applyAdvancedFilter(rule);
        },
        autoFitColumns(fieldNames?: string | string[], startRowIndex?: number, endRowIndex?: number): void {
            return this.ej2Instances.autoFitColumns(fieldNames, startRowIndex, endRowIndex);
        },
        batchAsyncUpdate(changes: Object): void {
            return this.ej2Instances.batchAsyncUpdate(changes);
        },
        batchUpdate(changes: Object): void {
            return this.ej2Instances.batchUpdate(changes);
        },
        calculatePageSizeByParentHeight(containerHeight: number | string): number {
            return this.ej2Instances.calculatePageSizeByParentHeight(containerHeight);
        },
        changeDataSource(dataSource?: Object | Object | Object, columns?: Object[] | string[] | Object[], properties?: Object): void {
            return this.ej2Instances.changeDataSource(dataSource, columns, properties);
        },
        clearAdvancedFilter(): void {
            return this.ej2Instances.clearAdvancedFilter();
        },
        clearCellSelection(): void {
            return this.ej2Instances.clearCellSelection();
        },
        clearFiltering(fields?: string[]): void {
            return this.ej2Instances.clearFiltering(fields);
        },
        clearFilteringAsync(fields?: string[]): Object {
            return this.ej2Instances.clearFilteringAsync(fields);
        },
        clearGrouping(): void {
            return this.ej2Instances.clearGrouping();
        },
        clearGroupingAsync(): Object {
            return this.ej2Instances.clearGroupingAsync();
        },
        clearRowSelection(): void {
            return this.ej2Instances.clearRowSelection();
        },
        clearSelection(): void {
            return this.ej2Instances.clearSelection();
        },
        clearSorting(): void {
            return this.ej2Instances.clearSorting();
        },
        clearSortingAsync(): Object {
            return this.ej2Instances.clearSortingAsync();
        },
        closeAdvancedFilterDialog(): void {
            return this.ej2Instances.closeAdvancedFilterDialog();
        },
        closeEdit(): void {
            return this.ej2Instances.closeEdit();
        },
        copy(withHeader?: boolean): void {
            return this.ej2Instances.copy(withHeader);
        },
        csvExport(excelExportProperties?: Object, isMultipleExport?: boolean, workbook?: Object, isBlob?: boolean): Object {
            return this.ej2Instances.csvExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        },
        dataReady(): void {
            return this.ej2Instances.dataReady();
        },
        deleteRecord(fieldname?: string, data?: Object): void {
            return this.ej2Instances.deleteRecord(fieldname, data);
        },
        deleteRecordAsync(fieldname?: string, data?: Object): Object {
            return this.ej2Instances.deleteRecordAsync(fieldname, data);
        },
        deleteRow(tr: Object): void {
            return this.ej2Instances.deleteRow(tr);
        },
        deleteRowAsync(tr: Object): Object {
            return this.ej2Instances.deleteRowAsync(tr);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        destroyTemplate(propertyNames?: string[], index?: any, callback?: Object): void {
            return this.ej2Instances.destroyTemplate(propertyNames, index, callback);
        },
        detailCollapseAll(): void {
            return this.ej2Instances.detailCollapseAll();
        },
        detailExpandAll(): void {
            return this.ej2Instances.detailExpandAll();
        },
        editCell(index: number, field: string): void {
            return this.ej2Instances.editCell(index, field);
        },
        enableToolbarItems(items: string[], isEnable: boolean): void {
            return this.ej2Instances.enableToolbarItems(items, isEnable);
        },
        endEdit(): void {
            return this.ej2Instances.endEdit();
        },
        endEditAsync(): Object {
            return this.ej2Instances.endEditAsync();
        },
        excelExport(excelExportProperties?: Object, isMultipleExport?: boolean, workbook?: Object, isBlob?: boolean): Object {
            return this.ej2Instances.excelExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        },
        extendRequiredModules(modules: Object[]): void {
            return this.ej2Instances.extendRequiredModules(modules);
        },
        filterByColumn(fieldName: string, filterOperator: string, filterValue: string | number | Object | boolean | number[] | string[] | Object[] | boolean[] | null, predicate?: string, matchCase?: boolean, ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): void {
            return this.ej2Instances.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator);
        },
        filterByColumnAsync(fieldName: string, filterOperator: string, filterValue: string | number | Object | boolean | number[] | string[] | Object[] | boolean[] | null, predicate?: string, matchCase?: boolean, ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): Object {
            return this.ej2Instances.filterByColumnAsync(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator);
        },
        freezeRefresh(): void {
            return this.ej2Instances.freezeRefresh();
        },
        getAdvancedFilter(): Object | null {
            return this.ej2Instances.getAdvancedFilter();
        },
        getBatchChanges(): Object {
            return this.ej2Instances.getBatchChanges();
        },
        getCellFormula(primaryKeyValue: number | string, field: string): string | undefined {
            return this.ej2Instances.getCellFormula(primaryKeyValue, field);
        },
        getCellFromIndex(rowIndex: number, columnIndex: number): Object {
            return this.ej2Instances.getCellFromIndex(rowIndex, columnIndex);
        },
        getColumnByField(field: string): Object {
            return this.ej2Instances.getColumnByField(field);
        },
        getColumnByUid(uid: string, isColumns?: boolean): Object {
            return this.ej2Instances.getColumnByUid(uid, isColumns);
        },
        getColumnFieldNames(): string[] {
            return this.ej2Instances.getColumnFieldNames();
        },
        getColumnHeaderByField(field: string): Object {
            return this.ej2Instances.getColumnHeaderByField(field);
        },
        getColumnHeaderByIndex(index: number): Object {
            return this.ej2Instances.getColumnHeaderByIndex(index);
        },
        getColumnHeaderByUid(uid: string): Object {
            return this.ej2Instances.getColumnHeaderByUid(uid);
        },
        getColumnIndexByField(field: string): number {
            return this.ej2Instances.getColumnIndexByField(field);
        },
        getColumnIndexByUid(uid: string): number {
            return this.ej2Instances.getColumnIndexByUid(uid);
        },
        getColumns(isRefresh?: boolean): Object[] {
            return this.ej2Instances.getColumns(isRefresh);
        },
        getContent(): Object {
            return this.ej2Instances.getContent();
        },
        getContentTable(): Object {
            return this.ej2Instances.getContentTable();
        },
        getCurrentViewRecords(): Object[] {
            return this.ej2Instances.getCurrentViewRecords();
        },
        getDataModule(): Object {
            return this.ej2Instances.getDataModule();
        },
        getDataRows(): Object[] {
            return this.ej2Instances.getDataRows();
        },
        getFilterUIInfo(): Object {
            return this.ej2Instances.getFilterUIInfo();
        },
        getFilteredRecords(): Object[] | Object {
            return this.ej2Instances.getFilteredRecords();
        },
        getFooterContent(): Object {
            return this.ej2Instances.getFooterContent();
        },
        getFooterContentTable(): Object {
            return this.ej2Instances.getFooterContentTable();
        },
        getForeignKeyColumns(): Object[] {
            return this.ej2Instances.getForeignKeyColumns();
        },
        getFormulaValue(primaryKeyValue: number | string, field: string): Object | undefined {
            return this.ej2Instances.getFormulaValue(primaryKeyValue, field);
        },
        getFormulas(): Object[] {
            return this.ej2Instances.getFormulas();
        },
        getFrozenDataRows(): Object[] {
            return this.ej2Instances.getFrozenDataRows();
        },
        getFrozenLeftColumnHeaderByIndex(index: number): Object {
            return this.ej2Instances.getFrozenLeftColumnHeaderByIndex(index);
        },
        getFrozenLeftCount(): number {
            return this.ej2Instances.getFrozenLeftCount();
        },
        getFrozenMode(): Object {
            return this.ej2Instances.getFrozenMode();
        },
        getFrozenRightCellFromIndex(rowIndex: number, columnIndex: number): Object {
            return this.ej2Instances.getFrozenRightCellFromIndex(rowIndex, columnIndex);
        },
        getFrozenRightColumnHeaderByIndex(index: number): Object {
            return this.ej2Instances.getFrozenRightColumnHeaderByIndex(index);
        },
        getFrozenRightDataRows(): Object[] {
            return this.ej2Instances.getFrozenRightDataRows();
        },
        getFrozenRightRowByIndex(index: number): Object {
            return this.ej2Instances.getFrozenRightRowByIndex(index);
        },
        getFrozenRightRows(): Object[] {
            return this.ej2Instances.getFrozenRightRows();
        },
        getFrozenRowByIndex(index: number): Object {
            return this.ej2Instances.getFrozenRowByIndex(index);
        },
        getHeaderContent(): Object {
            return this.ej2Instances.getHeaderContent();
        },
        getHeaderTable(): Object {
            return this.ej2Instances.getHeaderTable();
        },
        getHiddenColumns(): Object[] {
            return this.ej2Instances.getHiddenColumns();
        },
        getMediaColumns(): void {
            return this.ej2Instances.getMediaColumns();
        },
        getMovableCellFromIndex(rowIndex: number, columnIndex: number): Object {
            return this.ej2Instances.getMovableCellFromIndex(rowIndex, columnIndex);
        },
        getMovableColumnHeaderByIndex(index: number): Object {
            return this.ej2Instances.getMovableColumnHeaderByIndex(index);
        },
        getMovableDataRows(): Object[] {
            return this.ej2Instances.getMovableDataRows();
        },
        getMovableRowByIndex(index: number): Object {
            return this.ej2Instances.getMovableRowByIndex(index);
        },
        getMovableRows(): Object[] {
            return this.ej2Instances.getMovableRows();
        },
        getPager(): Object {
            return this.ej2Instances.getPager();
        },
        getPersistColumns(): string {
            return this.ej2Instances.getPersistColumns();
        },
        getPredicateFromRule(rule: Object): Object | null {
            return this.ej2Instances.getPredicateFromRule(rule);
        },
        getPrimaryKeyFieldNames(): string[] {
            return this.ej2Instances.getPrimaryKeyFieldNames();
        },
        getRowByIndex(index: number): Object {
            return this.ej2Instances.getRowByIndex(index);
        },
        getRowIndexByPrimaryKey(value: string | Object | number): number {
            return this.ej2Instances.getRowIndexByPrimaryKey(value);
        },
        getRowInfo(target: Object | Object): Object {
            return this.ej2Instances.getRowInfo(target);
        },
        getRows(): Object[] {
            return this.ej2Instances.getRows();
        },
        getRowsObject(): Object[] {
            return this.ej2Instances.getRowsObject();
        },
        getSelectedCellRecords(): Object[] {
            return this.ej2Instances.getSelectedCellRecords();
        },
        getSelectedColumnsUid(): string[] {
            return this.ej2Instances.getSelectedColumnsUid();
        },
        getSelectedRecords(): Object[] {
            return this.ej2Instances.getSelectedRecords();
        },
        getSelectedRowCellIndexes(): Object[] {
            return this.ej2Instances.getSelectedRowCellIndexes();
        },
        getSelectedRowIndexes(): number[] {
            return this.ej2Instances.getSelectedRowIndexes();
        },
        getSelectedRows(): Object[] {
            return this.ej2Instances.getSelectedRows();
        },
        getSummaryValues(summaryCol: Object, summaryData: Object): number {
            return this.ej2Instances.getSummaryValues(summaryCol, summaryData);
        },
        getUidByColumnField(field: string): string {
            return this.ej2Instances.getUidByColumnField(field);
        },
        getVisibleColumns(): Object[] {
            return this.ej2Instances.getVisibleColumns();
        },
        getWebMcpTools(toolNames?: string[]): Object[] {
            return this.ej2Instances.getWebMcpTools(toolNames);
        },
        goToPage(pageNo: number): void {
            return this.ej2Instances.goToPage(pageNo);
        },
        goToPageAsync(pageNo: number): Object {
            return this.ej2Instances.goToPageAsync(pageNo);
        },
        groupCollapseAll(): void {
            return this.ej2Instances.groupCollapseAll();
        },
        groupColumn(columnName: string): void {
            return this.ej2Instances.groupColumn(columnName);
        },
        groupColumnAsync(columnName: string): Object {
            return this.ej2Instances.groupColumnAsync(columnName);
        },
        groupExpandAll(): void {
            return this.ej2Instances.groupExpandAll();
        },
        hasFormula(primaryKeyValue: number, field: string): boolean {
            return this.ej2Instances.hasFormula(primaryKeyValue, field);
        },
        hideColumns(keys: string | string[], hideBy?: string): void {
            return this.ej2Instances.hideColumns(keys, hideBy);
        },
        hideScroll(): void {
            return this.ej2Instances.hideScroll();
        },
        hideSpinner(): void {
            return this.ej2Instances.hideSpinner();
        },
        isAdvancedFilterApplied(): boolean {
            return this.ej2Instances.isAdvancedFilterApplied();
        },
        isFrozenGrid(): boolean {
            return this.ej2Instances.isFrozenGrid();
        },
        openAdvancedFilterDialog(): void {
            return this.ej2Instances.openAdvancedFilterDialog();
        },
        openColumnChooser(x?: number, y?: number): void {
            return this.ej2Instances.openColumnChooser(x, y);
        },
        pdfExport(pdfExportProperties?: Object, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Object {
            return this.ej2Instances.pdfExport(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
        },
        pinRows(data: Object[]): void {
            return this.ej2Instances.pinRows(data);
        },
        print(): void {
            return this.ej2Instances.print();
        },
        redoEdit(): void {
            return this.ej2Instances.redoEdit();
        },
        refresh(): void {
            return this.ej2Instances.refresh();
        },
        refreshColumns(): void {
            return this.ej2Instances.refreshColumns();
        },
        refreshFormula(rowIndex: number): void {
            return this.ej2Instances.refreshFormula(rowIndex);
        },
        refreshFormulas(): void {
            return this.ej2Instances.refreshFormulas();
        },
        refreshHeader(): void {
            return this.ej2Instances.refreshHeader();
        },
        registerWebMcpTools(prefix?: string, tools?: string[] | Object[], exposedTo?: string[]): void {
            return this.ej2Instances.registerWebMcpTools(prefix, tools, exposedTo);
        },
        removeFormula(name: string): void {
            return this.ej2Instances.removeFormula(name);
        },
        removeMaskRow(): void {
            return this.ej2Instances.removeMaskRow();
        },
        reorderColumnByIndex(fromIndex: number, toIndex: number): void {
            return this.ej2Instances.reorderColumnByIndex(fromIndex, toIndex);
        },
        reorderColumnByModel(fromColumn: Object, toColumn: Object): void {
            return this.ej2Instances.reorderColumnByModel(fromColumn, toColumn);
        },
        reorderColumnByTargetIndex(fieldName: string | string[], toIndex: number): void {
            return this.ej2Instances.reorderColumnByTargetIndex(fieldName, toIndex);
        },
        reorderColumns(fromFName: string | string[], toFName: string): void {
            return this.ej2Instances.reorderColumns(fromFName, toFName);
        },
        reorderRows(fromIndexes: number[], toIndex: number): void {
            return this.ej2Instances.reorderRows(fromIndexes, toIndex);
        },
        resumeFormulaRefresh(): void {
            return this.ej2Instances.resumeFormulaRefresh();
        },
        saveBulkChanges(changedData: Object, rowData?: Object[], callback?: Object): void {
            return this.ej2Instances.saveBulkChanges(changedData, rowData, callback);
        },
        saveBulkChangesAsync(changedData: Object, rowData?: Object[]): Object {
            return this.ej2Instances.saveBulkChangesAsync(changedData, rowData);
        },
        saveCell(): void {
            return this.ej2Instances.saveCell();
        },
        search(searchString: string): void {
            return this.ej2Instances.search(searchString);
        },
        searchAsync(searchString: string): Object {
            return this.ej2Instances.searchAsync(searchString);
        },
        selectCell(cellIndex: Object, isToggle?: boolean): void {
            return this.ej2Instances.selectCell(cellIndex, isToggle);
        },
        selectCells(rowCellIndexes: Object[]): void {
            return this.ej2Instances.selectCells(rowCellIndexes);
        },
        selectCellsByRange(startIndex: Object, endIndex?: Object): void {
            return this.ej2Instances.selectCellsByRange(startIndex, endIndex);
        },
        selectRow(index: number, isToggle?: boolean): void {
            return this.ej2Instances.selectRow(index, isToggle);
        },
        selectRows(rowIndexes: number[]): void {
            return this.ej2Instances.selectRows(rowIndexes);
        },
        selectRowsByRange(startIndex: number, endIndex?: number): void {
            return this.ej2Instances.selectRowsByRange(startIndex, endIndex);
        },
        serverCsvExport(url: string, headers?: Object): void {
            return this.ej2Instances.serverCsvExport(url, headers);
        },
        serverExcelExport(url: string, headers?: Object): void {
            return this.ej2Instances.serverExcelExport(url, headers);
        },
        serverPdfExport(url: string, headers?: Object): void {
            return this.ej2Instances.serverPdfExport(url, headers);
        },
        setAdvancedFilter(rule: Object): void {
            return this.ej2Instances.setAdvancedFilter(rule);
        },
        setCellFormula(primaryKeyValue: number | string, field: string, formula: string | undefined): void {
            return this.ej2Instances.setCellFormula(primaryKeyValue, field, formula);
        },
        setCellValue(key: string | number, field: string, value: string | number | boolean | Object | null): void {
            return this.ej2Instances.setCellValue(key, field, value);
        },
        setCellValueAsync(key: string | number, field: string, value: string | number | boolean | Object | null, delay: number): Object {
            return this.ej2Instances.setCellValueAsync(key, field, value, delay);
        },
        setColumns(columns: Object[]): void {
            return this.ej2Instances.setColumns(columns);
        },
        setGridContent(element: Object): void {
            return this.ej2Instances.setGridContent(element);
        },
        setGridContentTable(element: Object): void {
            return this.ej2Instances.setGridContentTable(element);
        },
        setGridHeaderContent(element: Object): void {
            return this.ej2Instances.setGridHeaderContent(element);
        },
        setGridHeaderTable(element: Object): void {
            return this.ej2Instances.setGridHeaderTable(element);
        },
        setGridPager(element: Object): void {
            return this.ej2Instances.setGridPager(element);
        },
        setRowData(key: string | number, rowData?: Object): void {
            return this.ej2Instances.setRowData(key, rowData);
        },
        setRowDataAsync(key: string | number, rowData?: Object, delay?: number): Object {
            return this.ej2Instances.setRowDataAsync(key, rowData, delay);
        },
        showAdaptiveFilterDialog(): void {
            return this.ej2Instances.showAdaptiveFilterDialog();
        },
        showAdaptiveSortDialog(): void {
            return this.ej2Instances.showAdaptiveSortDialog();
        },
        showColumns(keys: string | string[], showBy?: string): void {
            return this.ej2Instances.showColumns(keys, showBy);
        },
        showMaskRow(axisDirection?: string, dialogElement?: Object): void {
            return this.ej2Instances.showMaskRow(axisDirection, dialogElement);
        },
        showSpinner(): void {
            return this.ej2Instances.showSpinner();
        },
        sortColumn(columnName: string, direction: Object, isMultiSort?: boolean): void {
            return this.ej2Instances.sortColumn(columnName, direction, isMultiSort);
        },
        sortColumnAsync(columnName: string, direction: Object, isMultiSort?: boolean): Object {
            return this.ej2Instances.sortColumnAsync(columnName, direction, isMultiSort);
        },
        startEdit(): void {
            return this.ej2Instances.startEdit();
        },
        suspendFormulaRefresh(): void {
            return this.ej2Instances.suspendFormulaRefresh();
        },
        undoEdit(): void {
            return this.ej2Instances.undoEdit();
        },
        ungroupColumn(columnName: string): void {
            return this.ej2Instances.ungroupColumn(columnName);
        },
        ungroupColumnAsync(columnName: string): Object {
            return this.ej2Instances.ungroupColumnAsync(columnName);
        },
        unpinRows(data: Object[]): void {
            return this.ej2Instances.unpinRows(data);
        },
        updateCell(rowIndex: number, field: string, value: string | number | boolean | Object): void {
            return this.ej2Instances.updateCell(rowIndex, field, value);
        },
        updateExternalMessage(message: string): void {
            return this.ej2Instances.updateExternalMessage(message);
        },
        updateRow(index: number, data: Object): void {
            return this.ej2Instances.updateRow(index, data);
        },
        updateRowAsync(index: number, data: Object): Object {
            return this.ej2Instances.updateRowAsync(index, data);
        },
        updateRowValue(key: number, rowData: Object): void {
            return this.ej2Instances.updateRowValue(key, rowData);
        },
    }
});

export type GridComponent = typeof ComponentBase & {
    ej2Instances: Grid;
    isVue3: boolean;
    isLazyUpdate: Boolean;
    plugins: any[];
    propKeys: string[];
    models: string[];
    hasChildDirective: boolean;
    tagMapper: {
        [key: string]: Object;
    };
    tagNameMapper: Object;
    setProperties(prop: any, muteOnChange: boolean): void;
    trigger(eventName: string, eventProp: {
        [key: string]: Object;
    }, successHandler?: Function): void;
    addFormula(name: string, handler: Object): void;
    addRecord(data?: Object, index?: number): void;
    addRecordAsync(data?: Object, index?: number): Object;
    addShimmerEffect(): void;
    applyAdvancedFilter(rule?: Object): void;
    autoFitColumns(fieldNames?: string | string[], startRowIndex?: number, endRowIndex?: number): void;
    batchAsyncUpdate(changes: Object): void;
    batchUpdate(changes: Object): void;
    calculatePageSizeByParentHeight(containerHeight: number | string): number;
    changeDataSource(dataSource?: Object | Object | Object, columns?: Object[] | string[] | Object[], properties?: Object): void;
    clearAdvancedFilter(): void;
    clearCellSelection(): void;
    clearFiltering(fields?: string[]): void;
    clearFilteringAsync(fields?: string[]): Object;
    clearGrouping(): void;
    clearGroupingAsync(): Object;
    clearRowSelection(): void;
    clearSelection(): void;
    clearSorting(): void;
    clearSortingAsync(): Object;
    closeAdvancedFilterDialog(): void;
    closeEdit(): void;
    copy(withHeader?: boolean): void;
    csvExport(excelExportProperties?: Object, isMultipleExport?: boolean, workbook?: Object, isBlob?: boolean): Object;
    dataReady(): void;
    deleteRecord(fieldname?: string, data?: Object): void;
    deleteRecordAsync(fieldname?: string, data?: Object): Object;
    deleteRow(tr: Object): void;
    deleteRowAsync(tr: Object): Object;
    destroy(): void;
    destroyTemplate(propertyNames?: string[], index?: any, callback?: Object): void;
    detailCollapseAll(): void;
    detailExpandAll(): void;
    editCell(index: number, field: string): void;
    enableToolbarItems(items: string[], isEnable: boolean): void;
    endEdit(): void;
    endEditAsync(): Object;
    excelExport(excelExportProperties?: Object, isMultipleExport?: boolean, workbook?: Object, isBlob?: boolean): Object;
    extendRequiredModules(modules: Object[]): void;
    filterByColumn(fieldName: string, filterOperator: string, filterValue: string | number | Object | boolean | number[] | string[] | Object[] | boolean[] | null, predicate?: string, matchCase?: boolean, ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): void;
    filterByColumnAsync(fieldName: string, filterOperator: string, filterValue: string | number | Object | boolean | number[] | string[] | Object[] | boolean[] | null, predicate?: string, matchCase?: boolean, ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): Object;
    freezeRefresh(): void;
    getAdvancedFilter(): Object | null;
    getBatchChanges(): Object;
    getCellFormula(primaryKeyValue: number | string, field: string): string | undefined;
    getCellFromIndex(rowIndex: number, columnIndex: number): Object;
    getColumnByField(field: string): Object;
    getColumnByUid(uid: string, isColumns?: boolean): Object;
    getColumnFieldNames(): string[];
    getColumnHeaderByField(field: string): Object;
    getColumnHeaderByIndex(index: number): Object;
    getColumnHeaderByUid(uid: string): Object;
    getColumnIndexByField(field: string): number;
    getColumnIndexByUid(uid: string): number;
    getColumns(isRefresh?: boolean): Object[];
    getContent(): Object;
    getContentTable(): Object;
    getCurrentViewRecords(): Object[];
    getDataModule(): Object;
    getDataRows(): Object[];
    getFilterUIInfo(): Object;
    getFilteredRecords(): Object[] | Object;
    getFooterContent(): Object;
    getFooterContentTable(): Object;
    getForeignKeyColumns(): Object[];
    getFormulaValue(primaryKeyValue: number | string, field: string): Object | undefined;
    getFormulas(): Object[];
    getFrozenDataRows(): Object[];
    getFrozenLeftColumnHeaderByIndex(index: number): Object;
    getFrozenLeftCount(): number;
    getFrozenMode(): Object;
    getFrozenRightCellFromIndex(rowIndex: number, columnIndex: number): Object;
    getFrozenRightColumnHeaderByIndex(index: number): Object;
    getFrozenRightDataRows(): Object[];
    getFrozenRightRowByIndex(index: number): Object;
    getFrozenRightRows(): Object[];
    getFrozenRowByIndex(index: number): Object;
    getHeaderContent(): Object;
    getHeaderTable(): Object;
    getHiddenColumns(): Object[];
    getMediaColumns(): void;
    getMovableCellFromIndex(rowIndex: number, columnIndex: number): Object;
    getMovableColumnHeaderByIndex(index: number): Object;
    getMovableDataRows(): Object[];
    getMovableRowByIndex(index: number): Object;
    getMovableRows(): Object[];
    getPager(): Object;
    getPersistColumns(): string;
    getPredicateFromRule(rule: Object): Object | null;
    getPrimaryKeyFieldNames(): string[];
    getRowByIndex(index: number): Object;
    getRowIndexByPrimaryKey(value: string | Object | number): number;
    getRowInfo(target: Object | Object): Object;
    getRows(): Object[];
    getRowsObject(): Object[];
    getSelectedCellRecords(): Object[];
    getSelectedColumnsUid(): string[];
    getSelectedRecords(): Object[];
    getSelectedRowCellIndexes(): Object[];
    getSelectedRowIndexes(): number[];
    getSelectedRows(): Object[];
    getSummaryValues(summaryCol: Object, summaryData: Object): number;
    getUidByColumnField(field: string): string;
    getVisibleColumns(): Object[];
    getWebMcpTools(toolNames?: string[]): Object[];
    goToPage(pageNo: number): void;
    goToPageAsync(pageNo: number): Object;
    groupCollapseAll(): void;
    groupColumn(columnName: string): void;
    groupColumnAsync(columnName: string): Object;
    groupExpandAll(): void;
    hasFormula(primaryKeyValue: number, field: string): boolean;
    hideColumns(keys: string | string[], hideBy?: string): void;
    hideScroll(): void;
    hideSpinner(): void;
    isAdvancedFilterApplied(): boolean;
    isFrozenGrid(): boolean;
    openAdvancedFilterDialog(): void;
    openColumnChooser(x?: number, y?: number): void;
    pdfExport(pdfExportProperties?: Object, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Object;
    pinRows(data: Object[]): void;
    print(): void;
    redoEdit(): void;
    refresh(): void;
    refreshColumns(): void;
    refreshFormula(rowIndex: number): void;
    refreshFormulas(): void;
    refreshHeader(): void;
    registerWebMcpTools(prefix?: string, tools?: string[] | Object[], exposedTo?: string[]): void;
    removeFormula(name: string): void;
    removeMaskRow(): void;
    reorderColumnByIndex(fromIndex: number, toIndex: number): void;
    reorderColumnByModel(fromColumn: Object, toColumn: Object): void;
    reorderColumnByTargetIndex(fieldName: string | string[], toIndex: number): void;
    reorderColumns(fromFName: string | string[], toFName: string): void;
    reorderRows(fromIndexes: number[], toIndex: number): void;
    resumeFormulaRefresh(): void;
    saveBulkChanges(changedData: Object, rowData?: Object[], callback?: Object): void;
    saveBulkChangesAsync(changedData: Object, rowData?: Object[]): Object;
    saveCell(): void;
    search(searchString: string): void;
    searchAsync(searchString: string): Object;
    selectCell(cellIndex: Object, isToggle?: boolean): void;
    selectCells(rowCellIndexes: Object[]): void;
    selectCellsByRange(startIndex: Object, endIndex?: Object): void;
    selectRow(index: number, isToggle?: boolean): void;
    selectRows(rowIndexes: number[]): void;
    selectRowsByRange(startIndex: number, endIndex?: number): void;
    serverCsvExport(url: string, headers?: Object): void;
    serverExcelExport(url: string, headers?: Object): void;
    serverPdfExport(url: string, headers?: Object): void;
    setAdvancedFilter(rule: Object): void;
    setCellFormula(primaryKeyValue: number | string, field: string, formula: string | undefined): void;
    setCellValue(key: string | number, field: string, value: string | number | boolean | Object | null): void;
    setCellValueAsync(key: string | number, field: string, value: string | number | boolean | Object | null, delay: number): Object;
    setColumns(columns: Object[]): void;
    setGridContent(element: Object): void;
    setGridContentTable(element: Object): void;
    setGridHeaderContent(element: Object): void;
    setGridHeaderTable(element: Object): void;
    setGridPager(element: Object): void;
    setRowData(key: string | number, rowData?: Object): void;
    setRowDataAsync(key: string | number, rowData?: Object, delay?: number): Object;
    showAdaptiveFilterDialog(): void;
    showAdaptiveSortDialog(): void;
    showColumns(keys: string | string[], showBy?: string): void;
    showMaskRow(axisDirection?: string, dialogElement?: Object): void;
    showSpinner(): void;
    sortColumn(columnName: string, direction: Object, isMultiSort?: boolean): void;
    sortColumnAsync(columnName: string, direction: Object, isMultiSort?: boolean): Object;
    startEdit(): void;
    suspendFormulaRefresh(): void;
    undoEdit(): void;
    ungroupColumn(columnName: string): void;
    ungroupColumnAsync(columnName: string): Object;
    unpinRows(data: Object[]): void;
    updateCell(rowIndex: number, field: string, value: string | number | boolean | Object): void;
    updateExternalMessage(message: string): void;
    updateRow(index: number, data: Object): void;
    updateRowAsync(index: number, data: Object): Object;
    updateRowValue(key: number, rowData: Object): void
};

export const GridPlugin = {
    name: 'ejs-grid',
    install(Vue: any) {
        Vue.component(GridPlugin.name, GridComponent);
        Vue.component(ColumnPlugin.name, ColumnDirective);
        Vue.component(ColumnsPlugin.name, ColumnsDirective);
        Vue.component(StackedColumnPlugin.name, StackedColumnDirective);
        Vue.component(StackedColumnsPlugin.name, StackedColumnsDirective);
        Vue.component(AggregatePlugin.name, AggregateDirective);
        Vue.component(AggregatesPlugin.name, AggregatesDirective);
        Vue.component(AggregateColumnPlugin.name, AggregateColumnDirective);
        Vue.component(AggregateColumnsPlugin.name, AggregateColumnsDirective);

    }
}