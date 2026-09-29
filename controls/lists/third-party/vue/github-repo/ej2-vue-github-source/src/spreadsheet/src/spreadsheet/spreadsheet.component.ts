import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { Spreadsheet, SpreadsheetModel } from '@syncfusion/ej2-spreadsheet';
import { ImagesDirective, ImageDirective, ImagesPlugin, ImagePlugin } from './image.directive'
import { ChartsDirective, ChartDirective, ChartsPlugin, ChartPlugin } from './chart.directive'
import { RichTextsDirective, RichTextDirective, RichTextsPlugin, RichTextPlugin } from './richtext.directive'
import { CellsDirective, CellDirective, CellsPlugin, CellPlugin } from './cells.directive'
import { RowsDirective, RowDirective, RowsPlugin, RowPlugin } from './rows.directive'
import { ColumnsDirective, ColumnDirective, ColumnsPlugin, ColumnPlugin } from './columns.directive'
import { RangesDirective, RangeDirective, RangesPlugin, RangePlugin } from './ranges.directive'
import { ConditionalFormatsDirective, ConditionalFormatDirective, ConditionalFormatsPlugin, ConditionalFormatPlugin } from './conditionalformats.directive'
import { SheetsDirective, SheetDirective, SheetsPlugin, SheetPlugin } from './sheets.directive'
import { DefinedNamesDirective, DefinedNameDirective, DefinedNamesPlugin, DefinedNamePlugin } from './definednames.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'activeSheetIndex', 'aiAssistSettings', 'allowAutoFill', 'allowCellFormatting', 'allowChart', 'allowConditionalFormat', 'allowDataValidation', 'allowDelete', 'allowEditing', 'allowFiltering', 'allowFindAndReplace', 'allowFreezePane', 'allowHyperlink', 'allowImage', 'allowInsert', 'allowMerge', 'allowNumberFormatting', 'allowOpen', 'allowPrint', 'allowResizing', 'allowSave', 'allowScrolling', 'allowSorting', 'allowUndoRedo', 'allowWrap', 'author', 'autoFillSettings', 'calculationMode', 'cellStyle', 'cssClass', 'currencyCode', 'definedNames', 'enableAIAssist', 'enableClipboard', 'enableCollaborativeEditing', 'enableContextMenu', 'enableKeyboardNavigation', 'enableKeyboardShortcut', 'enableNotes', 'enablePersistence', 'enableRtl', 'enableWebMcp', 'height', 'isProtected', 'listSeparator', 'locale', 'openSettings', 'openUrl', 'password', 'saveUrl', 'scrollSettings', 'selectionSettings', 'sheets', 'showAggregate', 'showCommentsPane', 'showFormulaBar', 'showRibbon', 'showSheetTabs', 'width', 'actionBegin', 'actionComplete', 'afterHyperlinkClick', 'afterHyperlinkCreate', 'beforeCellFormat', 'beforeCellRender', 'beforeCellSave', 'beforeCellUpdate', 'beforeConditionalFormat', 'beforeDataBound', 'beforeHyperlinkClick', 'beforeHyperlinkCreate', 'beforeOpen', 'beforeSave', 'beforeSelect', 'beforeSort', 'beforeWebMcpToolExecute', 'cellEdit', 'cellEdited', 'cellEditing', 'cellSave', 'contextMenuBeforeClose', 'contextMenuBeforeOpen', 'contextMenuItemSelect', 'created', 'dataBound', 'dataSourceChanged', 'dialogBeforeOpen', 'fileMenuBeforeClose', 'fileMenuBeforeOpen', 'fileMenuItemSelect', 'openComplete', 'openFailure', 'promptRequest', 'promptResponse', 'queryCellInfo', 'saveComplete', 'select', 'sortComplete'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * `ejs-spreadsheet` represents the VueJS Spreadsheet Component.
 * ```html
 * <ejs-spreadsheet></ejs-spreadsheet>
 * ```
 */
export let SpreadsheetComponent: DefineVueComponent<SpreadsheetModel> =  vueDefineComponent({
    name: 'SpreadsheetComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new Spreadsheet({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-sheets":{"e-sheet":{"e-rows":{"e-row":{"e-cells":{"e-cell":{"e-images":"e-image","e-charts":"e-chart","e-richtexts":"e-richtext"}}}},"e-columns":"e-column","e-ranges":"e-range","e-conditionalformats":"e-conditionalformat"}},"e-definednames":"e-definedname"} as { [key: string]: Object },
            tagNameMapper: {"e-images":"e-image","e-charts":"e-chart","e-richtexts":"e-richText","e-conditionalformats":"e-conditionalFormats","e-definednames":"e-definedNames"} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {

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
        custom(): void {
            this.updated();
        },
        Unfreeze(sheet?: number | string): void {
            return this.ej2Instances.Unfreeze(sheet);
        },
        addContextMenuItems(items: Object[], text: string, insertAfter: boolean, isUniqueId?: boolean): void {
            return this.ej2Instances.addContextMenuItems(items, text, insertAfter, isUniqueId);
        },
        addCustomFunction(functionHandler: string | Object, functionName?: string, formulaDescription?: string, category?: string): void {
            return this.ej2Instances.addCustomFunction(functionHandler, functionName, formulaDescription, category);
        },
        addDataValidation(rules: Object, range?: string): void {
            return this.ej2Instances.addDataValidation(rules, range);
        },
        addDefinedName(definedName: Object): boolean {
            return this.ej2Instances.addDefinedName(definedName);
        },
        addFileMenuItems(items: Object[], text: string, insertAfter: boolean, isUniqueId?: boolean): void {
            return this.ej2Instances.addFileMenuItems(items, text, insertAfter, isUniqueId);
        },
        addHyperlink(hyperlink: string | Object, address: string, displayText?: string): void {
            return this.ej2Instances.addHyperlink(hyperlink, address, displayText);
        },
        addInvalidHighlight(range?: string): void {
            return this.ej2Instances.addInvalidHighlight(range);
        },
        addRibbonTabs(items: Object[], insertBefore?: string): void {
            return this.ej2Instances.addRibbonTabs(items, insertBefore);
        },
        addToolbarItems(tab: string, items: Object[], index?: number): void {
            return this.ej2Instances.addToolbarItems(tab, items, index);
        },
        applyFilter(predicates?: Object[], range?: string): Object {
            return this.ej2Instances.applyFilter(predicates, range);
        },
        autoFill(fillRange: string, dataRange?: string, direction?: Object, fillType?: Object): void {
            return this.ej2Instances.autoFill(fillRange, dataRange, direction, fillType);
        },
        autoFit(range: string): void {
            return this.ej2Instances.autoFit(range);
        },
        calculateNow(scope?: string, sheet?: number | string): Object {
            return this.ej2Instances.calculateNow(scope, sheet);
        },
        cellFormat(style: Object, range?: string): void {
            return this.ej2Instances.cellFormat(style, range);
        },
        clear(options: Object): void {
            return this.ej2Instances.clear(options);
        },
        clearConditionalFormat(range?: string): void {
            return this.ej2Instances.clearConditionalFormat(range);
        },
        clearFilter(field?: string, sheetIndex?: number): void {
            return this.ej2Instances.clearFilter(field, sheetIndex);
        },
        closeEdit(): void {
            return this.ej2Instances.closeEdit();
        },
        computeExpression(formula: string): string | number {
            return this.ej2Instances.computeExpression(formula);
        },
        conditionalFormat(conditionalFormat: Object): void {
            return this.ej2Instances.conditionalFormat(conditionalFormat);
        },
        copy(address?: string): Object {
            return this.ej2Instances.copy(address);
        },
        cut(address?: string): Object {
            return this.ej2Instances.cut(address);
        },
        delete(startIndex?: number, endIndex?: number, model?: Object, sheet?: number | string): void {
            return this.ej2Instances.delete(startIndex, endIndex, model, sheet);
        },
        deleteChart(id?: string): void {
            return this.ej2Instances.deleteChart(id);
        },
        deleteImage(id: string, range?: string): void {
            return this.ej2Instances.deleteImage(id, range);
        },
        deselectChart(): void {
            return this.ej2Instances.deselectChart();
        },
        deselectImage(): void {
            return this.ej2Instances.deselectImage();
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        duplicateSheet(sheetIndex?: number): void {
            return this.ej2Instances.duplicateSheet(sheetIndex);
        },
        enableContextMenuItems(items: string[], enable: boolean, isUniqueId?: boolean): void {
            return this.ej2Instances.enableContextMenuItems(items, enable, isUniqueId);
        },
        enableFileMenuItems(items: string[], enable: boolean, isUniqueId?: boolean): void {
            return this.ej2Instances.enableFileMenuItems(items, enable, isUniqueId);
        },
        enableRibbonTabs(tabs: string[], enable: boolean): void {
            return this.ej2Instances.enableRibbonTabs(tabs, enable);
        },
        enableToolbarItems(tab: string, items?: number[] | string[], enable?: boolean): void {
            return this.ej2Instances.enableToolbarItems(tab, items, enable);
        },
        endEdit(): void {
            return this.ej2Instances.endEdit();
        },
        executeAIPrompt(prompt: string): void {
            return this.ej2Instances.executeAIPrompt(prompt);
        },
        find(args: Object): void | string {
            return this.ej2Instances.find(args);
        },
        findAll(value: string, mode?: string, isCSen?: boolean, isEMatch?: boolean, sheetIndex?: number): string[] {
            return this.ej2Instances.findAll(value, mode, isCSen, isEMatch, sheetIndex);
        },
        freezePanes(row: number, column: number, sheet?: number | string): void {
            return this.ej2Instances.freezePanes(row, column, sheet);
        },
        getData(address: string): Object {
            return this.ej2Instances.getData(address);
        },
        getDisplayText(cell: Object): string {
            return this.ej2Instances.getDisplayText(cell);
        },
        getRowData(index?: number, sheetIndex?: number): Object[] {
            return this.ej2Instances.getRowData(index, sheetIndex);
        },
        getSelectAllContent(): Object {
            return this.ej2Instances.getSelectAllContent();
        },
        getWebMcpTools(toolNames?: string[]): Object[] {
            return this.ej2Instances.getWebMcpTools(toolNames);
        },
        goTo(address: string): void {
            return this.ej2Instances.goTo(address);
        },
        hideColumn(startIndex: number, endIndex: number, hide: boolean): void {
            return this.ej2Instances.hideColumn(startIndex, endIndex, hide);
        },
        hideFileMenuItems(items: string[], hide: boolean, isUniqueId?: boolean): void {
            return this.ej2Instances.hideFileMenuItems(items, hide, isUniqueId);
        },
        hideRibbonTabs(tabs: string[], hide: boolean): void {
            return this.ej2Instances.hideRibbonTabs(tabs, hide);
        },
        hideRow(startIndex: number, endIndex: number, hide: boolean): void {
            return this.ej2Instances.hideRow(startIndex, endIndex, hide);
        },
        hideSpinner(): void {
            return this.ej2Instances.hideSpinner();
        },
        hideToolbarItems(tab: string, indexes: number[], hide: boolean): void {
            return this.ej2Instances.hideToolbarItems(tab, indexes, hide);
        },
        insertChart(chart?: Object[]): void {
            return this.ej2Instances.insertChart(chart);
        },
        insertColumn(startColumn?: number | Object[], endColumn?: number, sheet?: number | string): void {
            return this.ej2Instances.insertColumn(startColumn, endColumn, sheet);
        },
        insertImage(images: Object[], range?: string): void {
            return this.ej2Instances.insertImage(images, range);
        },
        insertRow(startRow?: number | Object[], endRow?: number, sheet?: number | string): void {
            return this.ej2Instances.insertRow(startRow, endRow, sheet);
        },
        insertSheet(startSheet?: number | Object[], endSheet?: number): void {
            return this.ej2Instances.insertSheet(startSheet, endSheet);
        },
        isValidCell(cellAddress?: string): boolean {
            return this.ej2Instances.isValidCell(cellAddress);
        },
        lockCells(range?: string, isLocked?: boolean): void {
            return this.ej2Instances.lockCells(range, isLocked);
        },
        merge(range?: string, type?: Object): void {
            return this.ej2Instances.merge(range, type);
        },
        moveSheet(position: number, sheetIndexes?: number[]): void {
            return this.ej2Instances.moveSheet(position, sheetIndexes);
        },
        numberFormat(format: string, range?: string): void {
            return this.ej2Instances.numberFormat(format, range);
        },
        open(options: Object): void {
            return this.ej2Instances.open(options);
        },
        openFromJson(options: undefined, jsonConfig?: Object): void {
            return this.ej2Instances.openFromJson(options, jsonConfig);
        },
        paste(address?: string, type?: Object): void {
            return this.ej2Instances.paste(address, type);
        },
        print(printOptions: Object): void {
            return this.ej2Instances.print(printOptions);
        },
        protectSheet(sheet?: number | string, protectSettings?: Object, password?: string): void {
            return this.ej2Instances.protectSheet(sheet, protectSettings, password);
        },
        redo(): void {
            return this.ej2Instances.redo();
        },
        refresh(isNew?: boolean): void {
            return this.ej2Instances.refresh(isNew);
        },
        registerWebMcpTools(prefix?: string, tools?: string[] | Object[], exposedTo?: string[]): void {
            return this.ej2Instances.registerWebMcpTools(prefix, tools, exposedTo);
        },
        removeContextMenuItems(items: string[], isUniqueId?: boolean): void {
            return this.ej2Instances.removeContextMenuItems(items, isUniqueId);
        },
        removeDataValidation(range?: string): void {
            return this.ej2Instances.removeDataValidation(range);
        },
        removeDefinedName(definedName: string, scope: string): boolean {
            return this.ej2Instances.removeDefinedName(definedName, scope);
        },
        removeHyperlink(range: string): void {
            return this.ej2Instances.removeHyperlink(range);
        },
        removeInvalidHighlight(range?: string): void {
            return this.ej2Instances.removeInvalidHighlight(range);
        },
        replace(args: Object): void {
            return this.ej2Instances.replace(args);
        },
        resize(): void {
            return this.ej2Instances.resize();
        },
        resumeRefresh(): Object {
            return this.ej2Instances.resumeRefresh();
        },
        save(saveOptions: Object, jsonConfig?: Object): void {
            return this.ej2Instances.save(saveOptions, jsonConfig);
        },
        saveAsJson(jsonConfig?: Object): Object {
            return this.ej2Instances.saveAsJson(jsonConfig);
        },
        selectChart(id?: string): void {
            return this.ej2Instances.selectChart(id);
        },
        selectImage(id?: string): void {
            return this.ej2Instances.selectImage(id);
        },
        selectRange(address: string): void {
            return this.ej2Instances.selectRange(address);
        },
        setBorder(style: Object, range?: string, type?: Object, isUndoRedo?: boolean): void {
            return this.ej2Instances.setBorder(style, range, type, isUndoRedo);
        },
        setColWidth(width: number | string, colIndex: number, sheetIndex?: number): void {
            return this.ej2Instances.setColWidth(width, colIndex, sheetIndex);
        },
        setColumnsWidth(width: number, ranges?: string[]): void {
            return this.ej2Instances.setColumnsWidth(width, ranges);
        },
        setRangeReadOnly(readOnly: boolean, range: string, sheetIndex: number): void {
            return this.ej2Instances.setRangeReadOnly(readOnly, range, sheetIndex);
        },
        setRowHeight(height: number | string, rowIndex: number, sheetIndex?: number, edited?: boolean, skipCustomRow?: boolean): void {
            return this.ej2Instances.setRowHeight(height, rowIndex, sheetIndex, edited, skipCustomRow);
        },
        setRowsHeight(height: number, ranges?: string[], skipCustomRows?: boolean): void {
            return this.ej2Instances.setRowsHeight(height, ranges, skipCustomRows);
        },
        showSpinner(): void {
            return this.ej2Instances.showSpinner();
        },
        sort(sortOptions?: Object, range?: string): Object {
            return this.ej2Instances.sort(sortOptions, range);
        },
        startEdit(): void {
            return this.ej2Instances.startEdit();
        },
        suspendRefresh(): void {
            return this.ej2Instances.suspendRefresh();
        },
        unMerge(range?: string): void {
            return this.ej2Instances.unMerge(range);
        },
        undo(): void {
            return this.ej2Instances.undo();
        },
        unfreezePanes(sheet?: number | string): void {
            return this.ej2Instances.unfreezePanes(sheet);
        },
        unprotectSheet(sheet?: number | string): void {
            return this.ej2Instances.unprotectSheet(sheet);
        },
        updateAction(options: Object): void {
            return this.ej2Instances.updateAction(options);
        },
        updateCell(cell: Object, address?: string, enableDependentCellUpdate?: boolean): void {
            return this.ej2Instances.updateCell(cell, address, enableDependentCellUpdate);
        },
        updateRange(range: Object, sheetIndex: number): void {
            return this.ej2Instances.updateRange(range, sheetIndex);
        },
        updateUndoRedoCollection(args: undefined): void {
            return this.ej2Instances.updateUndoRedoCollection(args);
        },
        wrap(address: string, wrap: boolean): void {
            return this.ej2Instances.wrap(address, wrap);
        },
    }
});

export type SpreadsheetComponent = typeof ComponentBase & {
    ej2Instances: Spreadsheet;
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
    Unfreeze(sheet?: number | string): void;
    addContextMenuItems(items: Object[], text: string, insertAfter: boolean, isUniqueId?: boolean): void;
    addCustomFunction(functionHandler: string | Object, functionName?: string, formulaDescription?: string, category?: string): void;
    addDataValidation(rules: Object, range?: string): void;
    addDefinedName(definedName: Object): boolean;
    addFileMenuItems(items: Object[], text: string, insertAfter: boolean, isUniqueId?: boolean): void;
    addHyperlink(hyperlink: string | Object, address: string, displayText?: string): void;
    addInvalidHighlight(range?: string): void;
    addRibbonTabs(items: Object[], insertBefore?: string): void;
    addToolbarItems(tab: string, items: Object[], index?: number): void;
    applyFilter(predicates?: Object[], range?: string): Object;
    autoFill(fillRange: string, dataRange?: string, direction?: Object, fillType?: Object): void;
    autoFit(range: string): void;
    calculateNow(scope?: string, sheet?: number | string): Object;
    cellFormat(style: Object, range?: string): void;
    clear(options: Object): void;
    clearConditionalFormat(range?: string): void;
    clearFilter(field?: string, sheetIndex?: number): void;
    closeEdit(): void;
    computeExpression(formula: string): string | number;
    conditionalFormat(conditionalFormat: Object): void;
    copy(address?: string): Object;
    cut(address?: string): Object;
    delete(startIndex?: number, endIndex?: number, model?: Object, sheet?: number | string): void;
    deleteChart(id?: string): void;
    deleteImage(id: string, range?: string): void;
    deselectChart(): void;
    deselectImage(): void;
    destroy(): void;
    duplicateSheet(sheetIndex?: number): void;
    enableContextMenuItems(items: string[], enable: boolean, isUniqueId?: boolean): void;
    enableFileMenuItems(items: string[], enable: boolean, isUniqueId?: boolean): void;
    enableRibbonTabs(tabs: string[], enable: boolean): void;
    enableToolbarItems(tab: string, items?: number[] | string[], enable?: boolean): void;
    endEdit(): void;
    executeAIPrompt(prompt: string): void;
    find(args: Object): void | string;
    findAll(value: string, mode?: string, isCSen?: boolean, isEMatch?: boolean, sheetIndex?: number): string[];
    freezePanes(row: number, column: number, sheet?: number | string): void;
    getData(address: string): Object;
    getDisplayText(cell: Object): string;
    getRowData(index?: number, sheetIndex?: number): Object[];
    getSelectAllContent(): Object;
    getWebMcpTools(toolNames?: string[]): Object[];
    goTo(address: string): void;
    hideColumn(startIndex: number, endIndex: number, hide: boolean): void;
    hideFileMenuItems(items: string[], hide: boolean, isUniqueId?: boolean): void;
    hideRibbonTabs(tabs: string[], hide: boolean): void;
    hideRow(startIndex: number, endIndex: number, hide: boolean): void;
    hideSpinner(): void;
    hideToolbarItems(tab: string, indexes: number[], hide: boolean): void;
    insertChart(chart?: Object[]): void;
    insertColumn(startColumn?: number | Object[], endColumn?: number, sheet?: number | string): void;
    insertImage(images: Object[], range?: string): void;
    insertRow(startRow?: number | Object[], endRow?: number, sheet?: number | string): void;
    insertSheet(startSheet?: number | Object[], endSheet?: number): void;
    isValidCell(cellAddress?: string): boolean;
    lockCells(range?: string, isLocked?: boolean): void;
    merge(range?: string, type?: Object): void;
    moveSheet(position: number, sheetIndexes?: number[]): void;
    numberFormat(format: string, range?: string): void;
    open(options: Object): void;
    openFromJson(options: undefined, jsonConfig?: Object): void;
    paste(address?: string, type?: Object): void;
    print(printOptions: Object): void;
    protectSheet(sheet?: number | string, protectSettings?: Object, password?: string): void;
    redo(): void;
    refresh(isNew?: boolean): void;
    registerWebMcpTools(prefix?: string, tools?: string[] | Object[], exposedTo?: string[]): void;
    removeContextMenuItems(items: string[], isUniqueId?: boolean): void;
    removeDataValidation(range?: string): void;
    removeDefinedName(definedName: string, scope: string): boolean;
    removeHyperlink(range: string): void;
    removeInvalidHighlight(range?: string): void;
    replace(args: Object): void;
    resize(): void;
    resumeRefresh(): Object;
    save(saveOptions: Object, jsonConfig?: Object): void;
    saveAsJson(jsonConfig?: Object): Object;
    selectChart(id?: string): void;
    selectImage(id?: string): void;
    selectRange(address: string): void;
    setBorder(style: Object, range?: string, type?: Object, isUndoRedo?: boolean): void;
    setColWidth(width: number | string, colIndex: number, sheetIndex?: number): void;
    setColumnsWidth(width: number, ranges?: string[]): void;
    setRangeReadOnly(readOnly: boolean, range: string, sheetIndex: number): void;
    setRowHeight(height: number | string, rowIndex: number, sheetIndex?: number, edited?: boolean, skipCustomRow?: boolean): void;
    setRowsHeight(height: number, ranges?: string[], skipCustomRows?: boolean): void;
    showSpinner(): void;
    sort(sortOptions?: Object, range?: string): Object;
    startEdit(): void;
    suspendRefresh(): void;
    unMerge(range?: string): void;
    undo(): void;
    unfreezePanes(sheet?: number | string): void;
    unprotectSheet(sheet?: number | string): void;
    updateAction(options: Object): void;
    updateCell(cell: Object, address?: string, enableDependentCellUpdate?: boolean): void;
    updateRange(range: Object, sheetIndex: number): void;
    updateUndoRedoCollection(args: undefined): void;
    wrap(address: string, wrap: boolean): void
};

export const SpreadsheetPlugin = {
    name: 'ejs-spreadsheet',
    install(Vue: any) {
        Vue.component(SpreadsheetPlugin.name, SpreadsheetComponent);
        Vue.component(SheetPlugin.name, SheetDirective);
        Vue.component(SheetsPlugin.name, SheetsDirective);
        Vue.component(RowPlugin.name, RowDirective);
        Vue.component(RowsPlugin.name, RowsDirective);
        Vue.component(CellPlugin.name, CellDirective);
        Vue.component(CellsPlugin.name, CellsDirective);
        Vue.component(ImagePlugin.name, ImageDirective);
        Vue.component(ImagesPlugin.name, ImagesDirective);
        Vue.component(ChartPlugin.name, ChartDirective);
        Vue.component(ChartsPlugin.name, ChartsDirective);
        Vue.component(RichTextPlugin.name, RichTextDirective);
        Vue.component(RichTextsPlugin.name, RichTextsDirective);
        Vue.component(ColumnPlugin.name, ColumnDirective);
        Vue.component(ColumnsPlugin.name, ColumnsDirective);
        Vue.component(RangePlugin.name, RangeDirective);
        Vue.component(RangesPlugin.name, RangesDirective);
        Vue.component(ConditionalFormatPlugin.name, ConditionalFormatDirective);
        Vue.component(ConditionalFormatsPlugin.name, ConditionalFormatsDirective);
        Vue.component(DefinedNamePlugin.name, DefinedNameDirective);
        Vue.component(DefinedNamesPlugin.name, DefinedNamesDirective);

    }
}