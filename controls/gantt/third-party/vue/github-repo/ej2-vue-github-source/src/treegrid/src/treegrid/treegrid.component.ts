import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { isUndefined } from '@syncfusion/ej2-base';

import { TreeGrid, TreeGridModel } from '@syncfusion/ej2-treegrid';
import { StackedColumnsDirective, StackedColumnDirective, StackedColumnsPlugin, StackedColumnPlugin } from './stacked-column.directive'
import { ColumnsDirective, ColumnDirective, ColumnsPlugin, ColumnPlugin } from './columns.directive'
import { AggregateColumnsDirective, AggregateColumnDirective, AggregateColumnsPlugin, AggregateColumnPlugin } from './aggregate-columns.directive'
import { AggregatesDirective, AggregateDirective, AggregatesPlugin, AggregatePlugin } from './aggregates.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'aggregates', 'allowExcelExport', 'allowFiltering', 'allowMultiSorting', 'allowPaging', 'allowPdfExport', 'allowReordering', 'allowResizing', 'allowRowDragAndDrop', 'allowSelection', 'allowSorting', 'allowTextWrap', 'childMapping', 'clipMode', 'columnChooserSettings', 'columnMenuItems', 'columnQueryMode', 'columns', 'contextMenuItems', 'copyHierarchyMode', 'currencyCode', 'dataSource', 'detailTemplate', 'domVirtualizationSettings', 'editSettings', 'emptyRecordTemplate', 'enableAdaptiveUI', 'enableAltRow', 'enableAutoFill', 'enableCollapseAll', 'enableColumnSpan', 'enableColumnVirtualization', 'enableDomVirtualization', 'enableHover', 'enableHtmlSanitizer', 'enableImmutableMode', 'enableInfiniteScrolling', 'enablePersistence', 'enableRowSpan', 'enableRtl', 'enableStickyHeader', 'enableVirtualMaskRow', 'enableVirtualization', 'expandStateMapping', 'filterSettings', 'frozenColumns', 'frozenRows', 'gridLines', 'hasChildMapping', 'height', 'hierarchyCheckboxMode', 'idMapping', 'infiniteScrollSettings', 'isRowSelectable', 'loadChildOnDemand', 'loadingIndicator', 'locale', 'pageSettings', 'pagerTemplate', 'parentIdMapping', 'printMode', 'query', 'rowDropSettings', 'rowHeight', 'rowTemplate', 'searchSettings', 'selectedRowIndex', 'selectionSettings', 'showColumnChooser', 'showColumnMenu', 'sortSettings', 'textWrapSettings', 'toolbar', 'treeColumnIndex', 'width', 'actionBegin', 'actionComplete', 'actionFailure', 'batchAdd', 'batchCancel', 'batchDelete', 'beforeBatchAdd', 'beforeBatchDelete', 'beforeBatchSave', 'beforeCopy', 'beforeDataBound', 'beforeExcelExport', 'beforePaste', 'beforePdfExport', 'beforePrint', 'beginEdit', 'cellDeselected', 'cellDeselecting', 'cellEdit', 'cellSave', 'cellSaved', 'cellSelected', 'cellSelecting', 'checkboxChange', 'collapsed', 'collapsing', 'columnDrag', 'columnDragStart', 'columnDrop', 'columnMenuClick', 'columnMenuOpen', 'contextMenuClick', 'contextMenuOpen', 'created', 'dataBound', 'dataSourceChanged', 'dataStateChange', 'detailDataBound', 'excelAggregateQueryCellInfo', 'excelExportComplete', 'excelHeaderQueryCellInfo', 'excelQueryCellInfo', 'expanded', 'expanding', 'headerCellInfo', 'load', 'pdfAggregateQueryCellInfo', 'pdfExportComplete', 'pdfHeaderQueryCellInfo', 'pdfQueryCellInfo', 'printComplete', 'queryCellInfo', 'recordDoubleClick', 'resizeStart', 'resizeStop', 'resizing', 'rowDataBound', 'rowDeselected', 'rowDeselecting', 'rowDrag', 'rowDragStart', 'rowDragStartHelper', 'rowDrop', 'rowSelected', 'rowSelecting', 'toolbarClick'];
export const modelProps: string[] = ['dataSource'];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * `ejs-treegrid` represents the VueJS TreeGrid Component.
 * ```html
 * <ejs-treegrid :dataSource='data' allowPaging='true' allowSorting='true'></ejs-treegrid>
 * ```
 */
export let TreeGridComponent: DefineVueComponent<TreeGridModel> =  vueDefineComponent({
    name: 'TreeGridComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    model: { event: 'modelchanged' },
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new TreeGrid({}) as any,
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
        addRecord(data?: Object | Object[], index?: number, position?: Object): void {
            return this.ej2Instances.addRecord(data, index, position);
        },
        autoFitColumns(fieldNames?: string | string[]): void {
            return this.ej2Instances.autoFitColumns(fieldNames);
        },
        clearFiltering(): void {
            return this.ej2Instances.clearFiltering();
        },
        clearSelection(): void {
            return this.ej2Instances.clearSelection();
        },
        clearSorting(): void {
            return this.ej2Instances.clearSorting();
        },
        closeEdit(): void {
            return this.ej2Instances.closeEdit();
        },
        collapseAll(): void {
            return this.ej2Instances.collapseAll();
        },
        collapseAtLevel(level: number): void {
            return this.ej2Instances.collapseAtLevel(level);
        },
        collapseByKey(key: Object): void {
            return this.ej2Instances.collapseByKey(key);
        },
        collapseRow(row: Object, record?: Object, key?: Object): void {
            return this.ej2Instances.collapseRow(row, record, key);
        },
        copy(withHeader?: boolean): void {
            return this.ej2Instances.copy(withHeader);
        },
        csvExport(excelExportProperties?: Object, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Object {
            return this.ej2Instances.csvExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        },
        deleteRecord(fieldName?: string, data?: Object): void {
            return this.ej2Instances.deleteRecord(fieldName, data);
        },
        deleteRow(tr: Object): void {
            return this.ej2Instances.deleteRow(tr);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        editCell(rowIndex?: number, field?: string): void {
            return this.ej2Instances.editCell(rowIndex, field);
        },
        enableToolbarItems(items: string[], isEnable: boolean): void {
            return this.ej2Instances.enableToolbarItems(items, isEnable);
        },
        endEdit(): void {
            return this.ej2Instances.endEdit();
        },
        excelExport(excelExportProperties?: Object | Object, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Object {
            return this.ej2Instances.excelExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        },
        expandAll(): void {
            return this.ej2Instances.expandAll();
        },
        expandAtLevel(level: number): void {
            return this.ej2Instances.expandAtLevel(level);
        },
        expandByKey(key: Object): void {
            return this.ej2Instances.expandByKey(key);
        },
        expandRow(row: Object, record?: Object, key?: Object, level?: number): void {
            return this.ej2Instances.expandRow(row, record, key, level);
        },
        extendRequiredModules(modules: Object[]): void {
            return this.ej2Instances.extendRequiredModules(modules);
        },
        filterByColumn(fieldName: string, filterOperator: string, filterValue: string | number | Object | boolean | number[] | string[] | Object[] | boolean[], predicate?: string, matchCase?: boolean, ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): void {
            return this.ej2Instances.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator);
        },
        getBatchChanges(): Object {
            return this.ej2Instances.getBatchChanges();
        },
        getCellFromIndex(rowIndex: number, columnIndex: number): Object {
            return this.ej2Instances.getCellFromIndex(rowIndex, columnIndex);
        },
        getCheckedRecords(): Object[] {
            return this.ej2Instances.getCheckedRecords();
        },
        getCheckedRowIndexes(): number[] {
            return this.ej2Instances.getCheckedRowIndexes();
        },
        getColumnByField(field: string): Object {
            return this.ej2Instances.getColumnByField(field);
        },
        getColumnByUid(uid: string): Object {
            return this.ej2Instances.getColumnByUid(uid);
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
        getFooterContent(): Object {
            return this.ej2Instances.getFooterContent();
        },
        getFooterContentTable(): Object {
            return this.ej2Instances.getFooterContentTable();
        },
        getFrozenLeftColumnHeaderByIndex(index: number): Object {
            return this.ej2Instances.getFrozenLeftColumnHeaderByIndex(index);
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
        getHeaderContent(): Object {
            return this.ej2Instances.getHeaderContent();
        },
        getHeaderTable(): Object {
            return this.ej2Instances.getHeaderTable();
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
        getPageSizeByHeight(containerHeight?: number | string): number {
            return this.ej2Instances.getPageSizeByHeight(containerHeight);
        },
        getPager(): Object {
            return this.ej2Instances.getPager();
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
        getUidByColumnField(field: string): string {
            return this.ej2Instances.getUidByColumnField(field);
        },
        getVisibleColumns(): Object[] {
            return this.ej2Instances.getVisibleColumns();
        },
        getVisibleRecords(): Object[] {
            return this.ej2Instances.getVisibleRecords();
        },
        goToPage(pageNo: number): void {
            return this.ej2Instances.goToPage(pageNo);
        },
        hideColumns(keys: string | string[], hideBy?: string): void {
            return this.ej2Instances.hideColumns(keys, hideBy);
        },
        hideSpinner(): void {
            return this.ej2Instances.hideSpinner();
        },
        indent(record?: Object): void {
            return this.ej2Instances.indent(record);
        },
        openColumnChooser(x?: number, y?: number): void {
            return this.ej2Instances.openColumnChooser(x, y);
        },
        outdent(record?: Object): void {
            return this.ej2Instances.outdent(record);
        },
        paste(data: string, rowIndex: number, colIndex: number): void {
            return this.ej2Instances.paste(data, rowIndex, colIndex);
        },
        pdfExport(pdfExportProperties?: Object | Object, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Object {
            return this.ej2Instances.pdfExport(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
        },
        print(): void {
            return this.ej2Instances.print();
        },
        refresh(): void {
            return this.ej2Instances.refresh();
        },
        refreshColumns(refreshUI?: boolean): void {
            return this.ej2Instances.refreshColumns(refreshUI);
        },
        refreshHeader(): void {
            return this.ej2Instances.refreshHeader();
        },
        refreshLayout(): void {
            return this.ej2Instances.refreshLayout();
        },
        reorderColumns(fromFName: string | string[], toFName: string): void {
            return this.ej2Instances.reorderColumns(fromFName, toFName);
        },
        reorderRows(fromIndexes: number[], toIndex: number, position: string): void {
            return this.ej2Instances.reorderRows(fromIndexes, toIndex, position);
        },
        saveCell(): void {
            return this.ej2Instances.saveCell();
        },
        search(searchString: string): void {
            return this.ej2Instances.search(searchString);
        },
        selectCell(cellIndex: Object, isToggle?: boolean): void {
            return this.ej2Instances.selectCell(cellIndex, isToggle);
        },
        selectCheckboxes(indexes: number[]): void {
            return this.ej2Instances.selectCheckboxes(indexes);
        },
        selectRow(index: number, isToggle?: boolean): void {
            return this.ej2Instances.selectRow(index, isToggle);
        },
        selectRows(rowIndexes: number[]): void {
            return this.ej2Instances.selectRows(rowIndexes);
        },
        serverCsvExport(url: string): void {
            return this.ej2Instances.serverCsvExport(url);
        },
        serverExcelExport(url: string): void {
            return this.ej2Instances.serverExcelExport(url);
        },
        serverPdfExport(url: string): void {
            return this.ej2Instances.serverPdfExport(url);
        },
        setCellValue(key: string | number, field: string, value: string | number | boolean | Object): void {
            return this.ej2Instances.setCellValue(key, field, value);
        },
        setRowData(key: string | number, rowData?: Object): void {
            return this.ej2Instances.setRowData(key, rowData);
        },
        showColumns(keys: string | string[], showBy?: string): void {
            return this.ej2Instances.showColumns(keys, showBy);
        },
        showSpinner(): void {
            return this.ej2Instances.showSpinner();
        },
        sortByColumn(columnName: string, direction: Object, isMultiSort?: boolean): void {
            return this.ej2Instances.sortByColumn(columnName, direction, isMultiSort);
        },
        startEdit(row?: Object): void {
            return this.ej2Instances.startEdit(row);
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
    }
});

export type TreeGridComponent = typeof ComponentBase & {
    ej2Instances: TreeGrid;
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
    addRecord(data?: Object | Object[], index?: number, position?: Object): void;
    autoFitColumns(fieldNames?: string | string[]): void;
    clearFiltering(): void;
    clearSelection(): void;
    clearSorting(): void;
    closeEdit(): void;
    collapseAll(): void;
    collapseAtLevel(level: number): void;
    collapseByKey(key: Object): void;
    collapseRow(row: Object, record?: Object, key?: Object): void;
    copy(withHeader?: boolean): void;
    csvExport(excelExportProperties?: Object, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Object;
    deleteRecord(fieldName?: string, data?: Object): void;
    deleteRow(tr: Object): void;
    destroy(): void;
    editCell(rowIndex?: number, field?: string): void;
    enableToolbarItems(items: string[], isEnable: boolean): void;
    endEdit(): void;
    excelExport(excelExportProperties?: Object | Object, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Object;
    expandAll(): void;
    expandAtLevel(level: number): void;
    expandByKey(key: Object): void;
    expandRow(row: Object, record?: Object, key?: Object, level?: number): void;
    extendRequiredModules(modules: Object[]): void;
    filterByColumn(fieldName: string, filterOperator: string, filterValue: string | number | Object | boolean | number[] | string[] | Object[] | boolean[], predicate?: string, matchCase?: boolean, ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): void;
    getBatchChanges(): Object;
    getCellFromIndex(rowIndex: number, columnIndex: number): Object;
    getCheckedRecords(): Object[];
    getCheckedRowIndexes(): number[];
    getColumnByField(field: string): Object;
    getColumnByUid(uid: string): Object;
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
    getFooterContent(): Object;
    getFooterContentTable(): Object;
    getFrozenLeftColumnHeaderByIndex(index: number): Object;
    getFrozenRightCellFromIndex(rowIndex: number, columnIndex: number): Object;
    getFrozenRightColumnHeaderByIndex(index: number): Object;
    getFrozenRightDataRows(): Object[];
    getFrozenRightRowByIndex(index: number): Object;
    getFrozenRightRows(): Object[];
    getHeaderContent(): Object;
    getHeaderTable(): Object;
    getMovableCellFromIndex(rowIndex: number, columnIndex: number): Object;
    getMovableColumnHeaderByIndex(index: number): Object;
    getMovableDataRows(): Object[];
    getMovableRowByIndex(index: number): Object;
    getMovableRows(): Object[];
    getPageSizeByHeight(containerHeight?: number | string): number;
    getPager(): Object;
    getPrimaryKeyFieldNames(): string[];
    getRowByIndex(index: number): Object;
    getRowIndexByPrimaryKey(value: string | Object | number): number;
    getRowInfo(target: Object | Object): Object;
    getRows(): Object[];
    getSelectedRecords(): Object[];
    getSelectedRowCellIndexes(): Object[];
    getSelectedRowIndexes(): number[];
    getSelectedRows(): Object[];
    getUidByColumnField(field: string): string;
    getVisibleColumns(): Object[];
    getVisibleRecords(): Object[];
    goToPage(pageNo: number): void;
    hideColumns(keys: string | string[], hideBy?: string): void;
    hideSpinner(): void;
    indent(record?: Object): void;
    openColumnChooser(x?: number, y?: number): void;
    outdent(record?: Object): void;
    paste(data: string, rowIndex: number, colIndex: number): void;
    pdfExport(pdfExportProperties?: Object | Object, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Object;
    print(): void;
    refresh(): void;
    refreshColumns(refreshUI?: boolean): void;
    refreshHeader(): void;
    refreshLayout(): void;
    reorderColumns(fromFName: string | string[], toFName: string): void;
    reorderRows(fromIndexes: number[], toIndex: number, position: string): void;
    saveCell(): void;
    search(searchString: string): void;
    selectCell(cellIndex: Object, isToggle?: boolean): void;
    selectCheckboxes(indexes: number[]): void;
    selectRow(index: number, isToggle?: boolean): void;
    selectRows(rowIndexes: number[]): void;
    serverCsvExport(url: string): void;
    serverExcelExport(url: string): void;
    serverPdfExport(url: string): void;
    setCellValue(key: string | number, field: string, value: string | number | boolean | Object): void;
    setRowData(key: string | number, rowData?: Object): void;
    showColumns(keys: string | string[], showBy?: string): void;
    showSpinner(): void;
    sortByColumn(columnName: string, direction: Object, isMultiSort?: boolean): void;
    startEdit(row?: Object): void;
    updateCell(rowIndex: number, field: string, value: string | number | boolean | Object): void;
    updateExternalMessage(message: string): void;
    updateRow(index: number, data: Object): void
};

export const TreeGridPlugin = {
    name: 'ejs-treegrid',
    install(Vue: any) {
        Vue.component(TreeGridPlugin.name, TreeGridComponent);
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