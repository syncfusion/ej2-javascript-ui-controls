import { Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, classList, closest, compile, createElement, extend, getElement, getEnumValue, getValue, isBlazor, isNullOrUndefined, merge, removeClass, select, setValue, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { Aggregate, CellType, Clipboard, ColumnChooser, ColumnMenu, CommandColumn, ContextMenu, DetailRow, Edit, ExcelExport, Filter, Freeze, Grid, InterSectionObserver, Logger, Page, PdfExport, Print, RenderType, Reorder, Resize, RowDD, RowDropSettings, Scroll, Sort, Toolbar, VirtualContentRenderer, VirtualRowModelGenerator, VirtualScroll, appendChildren, calculateAggregate, detailLists, extend as extend$1, getActualProperties, getObject, getUid, gridObserver, iterateArrayOrObject, parentsUntil, templateCompiler } from '@syncfusion/ej2-grids';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { CacheAdaptor, DataManager, DataUtil, Deferred, JsonAdaptor, ODataAdaptor, Predicate, Query, RemoteSaveAdaptor, UrlAdaptor, WebApiAdaptor, WebMethodAdaptor } from '@syncfusion/ej2-data';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';

/**
 * Represents TreeGrid `Column` model class.
 */
class Column {
    constructor(options) {
        /**
         * If `allowEditing` set to false, then it disables editing of a particular column.
         * By default all columns are editable.
         * @default true
         */
        this.allowEditing = true;
        /**
         * Defines the `IEditCell` object to customize default edit cell.
         * @default {}
         */
        this.edit = {};
        /**
         * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.
         * @default true
         */
        this.disableHtmlEncode = true;
        /**
         * If `allowReordering` set to false, then it disables reorder of a particular column.
         * By default all columns can be reorder.
         * @default true
         */
        this.allowReordering = true;
        /**
         * If `showColumnMenu` set to false, then it disable the column menu of a particular column.
         * By default column menu will show for all columns
         * @default true
         */
        this.showColumnMenu = true;
        /**
         * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column.
         * By default all columns are filterable.
         * @default true
         */
        this.allowFiltering = true;
        /**
         * If `allowSorting` set to false, then it disables sorting option of a particular column.
         * By default all columns are sortable.
         * @default true
         */
        this.allowSorting = true;
        /**
         * If `allowResizing` is set to false, it disables resize option of a particular column.
         * By default all the columns can be resized.
         * @default true
         */
        this.allowResizing = true;
        /**
         *  It is used to customize the default filter options for a specific columns.
         * * type -  Specifies the filter type as menu.
         * * ui - to render custom component for specific column it has following functions.
         * * ui.create – It is used for creating custom components.
         * * ui.read -  It is used for read the value from the component.
         * * ui.write - It is used to apply component model as dynamically.
         *
         *  @default null
         */
        this.filter = {};
        merge(this, options);
    }
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the predicate for the filter column.
 */
class Predicate$1 extends ChildProperty {
}
__decorate$1([
    Property()
], Predicate$1.prototype, "field", void 0);
__decorate$1([
    Property()
], Predicate$1.prototype, "operator", void 0);
__decorate$1([
    Property()
], Predicate$1.prototype, "value", void 0);
__decorate$1([
    Property()
], Predicate$1.prototype, "matchCase", void 0);
__decorate$1([
    Property()
], Predicate$1.prototype, "ignoreAccent", void 0);
__decorate$1([
    Property()
], Predicate$1.prototype, "predicate", void 0);
__decorate$1([
    Property({})
], Predicate$1.prototype, "actualFilterValue", void 0);
__decorate$1([
    Property({})
], Predicate$1.prototype, "actualOperator", void 0);
__decorate$1([
    Property()
], Predicate$1.prototype, "type", void 0);
__decorate$1([
    Property()
], Predicate$1.prototype, "ejpredicate", void 0);
__decorate$1([
    Property()
], Predicate$1.prototype, "uid", void 0);
__decorate$1([
    Property()
], Predicate$1.prototype, "isForeignKey", void 0);
/**
 * Configures the filtering behavior of the TreeGrid.
 */
class FilterSettings extends ChildProperty {
}
__decorate$1([
    Collection([], Predicate$1)
], FilterSettings.prototype, "columns", void 0);
__decorate$1([
    Property('FilterBar')
], FilterSettings.prototype, "type", void 0);
__decorate$1([
    Property()
], FilterSettings.prototype, "mode", void 0);
__decorate$1([
    Property(true)
], FilterSettings.prototype, "showFilterBarStatus", void 0);
__decorate$1([
    Property(1500)
], FilterSettings.prototype, "immediateModeDelay", void 0);
__decorate$1([
    Property()
], FilterSettings.prototype, "operators", void 0);
__decorate$1([
    Property(false)
], FilterSettings.prototype, "ignoreAccent", void 0);
__decorate$1([
    Property('Parent')
], FilterSettings.prototype, "hierarchyMode", void 0);

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the textwrap behavior of the TreeGrid.
 */
class TextWrapSettings extends ChildProperty {
}
__decorate$2([
    Property('Both')
], TextWrapSettings.prototype, "wrapMode", void 0);

/**
 * Logger module for TreeGrid
 * @hidden
 */
const DOC_URL = 'https://ej2.syncfusion.com/documentation/treegrid';
const BASE_DOC_URL = 'https://ej2.syncfusion.com/documentation';
const ERROR = '[EJ2TreeGrid.Error]';
class Logger$1 extends Logger {
    constructor(parent) {
        Grid.Inject(Logger);
        super(parent);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'logger';
    }
    log(types, args) {
        if (!(types instanceof Array)) {
            types = [types];
        }
        let type = types;
        for (let i = 0; i < type.length; i++) {
            let item = detailLists[type[i]];
            let cOp = item.check(args, this.parent);
            if (cOp.success) {
                let message = item.generateMessage(args, this.parent, cOp.options);
                message = message.replace('EJ2Grid', 'EJ2TreeGrid').replace('* Hierarchy Grid', '').replace('* Grouping', '');
                let index = message.indexOf('https');
                let gridurl = message.substring(index);
                if (type[i] === 'module_missing') {
                    message = message.replace(gridurl, DOC_URL + '/modules');
                }
                else if (type[i] === 'primary_column_missing' || type[i] === 'selection_key_missing') {
                    message = message.replace(gridurl, BASE_DOC_URL + '/api/treegrid/column/#isprimarykey');
                }
                else if (type[i] === 'grid_remote_edit') {
                    message = message.replace(gridurl, DOC_URL + '/edit');
                }
                else if (type[i] === 'virtual_height') {
                    message = message.replace(gridurl, DOC_URL + '/virtual');
                }
                else if (type[i] === 'check_datasource_columns') {
                    message = message.replace(gridurl, DOC_URL + '/columns');
                }
                else if (type[i] === 'locale_missing') {
                    message = message.replace(gridurl, DOC_URL + '/global-local/#localization');
                }
                if (type[i] === 'datasource_syntax_mismatch') {
                    if (!isNullOrUndefined(this.treeGridObj) && !isNullOrUndefined(this.treeGridObj.dataStateChange)) {
                        console[item.logType](message);
                    }
                }
                else {
                    console[item.logType](message);
                }
            }
        }
    }
    treeLog(types, args, treeGrid) {
        this.treeGridObj = treeGrid;
        if (!(types instanceof Array)) {
            types = [types];
        }
        let type = types;
        if (treeGrid.allowRowDragAndDrop) {
            this.log('primary_column_missing', args);
        }
        for (let i = 0; i < type.length; i++) {
            let item = treeGridDetails[type[i]];
            let cOp = item.check(args, treeGrid);
            if (cOp.success) {
                let message = item.generateMessage(args, treeGrid, cOp.options);
                console[item.logType](message);
            }
        }
    }
}
const treeGridDetails = {
    mapping_fields_missing: {
        type: 'mapping_fields_missing',
        logType: 'error',
        check(args, parent) {
            let opt = { success: false };
            if ((isNullOrUndefined(parent.idMapping) && isNullOrUndefined(parent.childMapping)
                && isNullOrUndefined(parent.parentIdMapping)) ||
                (!isNullOrUndefined(parent.idMapping) && isNullOrUndefined(parent.parentIdMapping)) ||
                (isNullOrUndefined(parent.idMapping) && !isNullOrUndefined(parent.parentIdMapping))) {
                opt = { success: true };
            }
            return opt;
        },
        generateMessage(args, parent, field) {
            return ERROR + ':' + ' MAPPING FIELDS MISSING \n' + 'One of the following fields is missing. It is ' +
                'required for the hierarchical relationship of records in TreeGrid:\n' +
                '* childMapping\n' + '* idMapping\n' + '* parentIdMapping\n' +
                'Refer to the following documentation links for more details.\n' +
                `${BASE_DOC_URL}/api/treegrid#childmapping` + '\n' +
                `${BASE_DOC_URL}/api/treegrid#idmapping` + '\n' +
                `${BASE_DOC_URL}/api/treegrid#$parentidmapping`;
        }
    },
};

/**
 *  @hidden
 */
const load = 'load';
/** @hidden */
const rowDataBound = 'rowDataBound';
/** @hidden */
const dataBound = 'dataBound';
/** @hidden */
const queryCellInfo = 'queryCellInfo';
/** @hidden */
const beforeDataBound = 'beforeDataBound';
/** @hidden */
const actionBegin = 'actionBegin';
/** @hidden */
const dataStateChange = 'dataStateChange';
/** @hidden */
const actionComplete = 'actionComplete';
/** @hidden */
const rowSelecting = 'rowSelecting';
/** @hidden */
const rowSelected = 'rowSelected';
/** @hidden */
const checkboxChange = 'checkboxChange';
/** @hidden */
const rowDeselected = 'rowDeselected';
/** @hidden */
const toolbarClick = 'toolbarClick';
/** @hidden */
const beforeExcelExport = 'beforeExcelExport';
/** @hidden */
const beforePdfExport = 'beforePdfExport';
/** @hidden */
const resizeStop = 'resizeStop';
/** @hidden */
const expanded = 'expanded';
/** @hidden */
const expanding = 'expanding';
/** @hidden */
const collapsed = 'collapsed';
/** @hidden */
const collapsing = 'collapsing';
/** @hidden */
const remoteExpand = 'remoteExpand';
/** @hidden */
const localPagedExpandCollapse = 'localPagedExpandCollapse';
/** @hidden */
const pagingActions = 'pagingActions';
/** @hidden */
const printGridInit = 'printGrid-Init';
/** @hidden */
const contextMenuOpen = 'contextMenuOpen';
/** @hidden */
const contextMenuClick = 'contextMenuClick';
/** @hidden */
const beforeCopy = 'beforeCopy';
/** @hidden */
const beforePaste = 'beforePaste';
/** @hidden */
const savePreviousRowPosition = 'savePreviousRowPosition';
/** @hidden */
const crudAction = 'crudAction';
/** @hidden */
const beginEdit = 'beginEdit';
/** @hidden */
const beginAdd = 'beginAdd';
/** @hidden */
const recordDoubleClick = 'recordDoubleClick';
/** @hidden */
const cellSave = 'cellSave';
/** @hidden */
const cellSaved = 'cellSaved';
/** @hidden */
const cellEdit = 'cellEdit';
/** @hidden */
const batchDelete = 'batchDelete';
/** @hidden */
const batchCancel = 'batchCancel';
/** @hidden */
const batchAdd = 'batchAdd';
/** @hidden */
const beforeBatchDelete = 'beforeBatchDelete';
/** @hidden */
const beforeBatchAdd = 'beforeBatchAdd';
/** @hidden */
const beforeBatchSave = 'beforeBatchSave';
/** @hidden */
const batchSave = 'batchSave';
/** @hidden */
const keyPressed = 'key-pressed';
/** @hidden */
const updateData = 'update-data';
/** @hidden */
const doubleTap = 'double-tap';
/** @hidden */
const virtualColumnIndex = 'virtualColumnIndex';
/** @hidden */
const virtualActionArgs = 'virtual-action-args';
/** @hidden */
const dataListener = 'data-listener';
/** @hidden */
const indexModifier = 'index-modifier';
/** @hidden */
const beforeStartEdit = 'edit-form';
/** @hidden */
const beforeBatchCancel = 'before-batch-cancel';
/** @hidden */
const batchEditFormRendered = 'batcheditform-rendered';
/** @hidden */
const detailDataBound = 'detailDataBound';
/** @hidden */
const rowDrag = 'rowDrag';
/** @hidden */
const rowDragStartHelper = 'rowDragStartHelper';
/** @hidden */
const rowDrop = 'rowDrop';
/** @hidden */
const rowDragStart = 'rowDragStart';
/** @hidden */
const rowsAdd = 'rows-add';
/** @hidden */
const rowsRemove = 'rows-remove';
/** @hidden */
const rowdraging = 'row-draging';
/** @hidden */
const rowDropped = 'row-dropped';

/**
 * The `Clipboard` module is used to handle clipboard copy action.
 * @hidden
 */
class TreeClipboard extends Clipboard {
    constructor(parent) {
        super(parent.grid);
        this.treeCopyContent = '';
        this.copiedUniqueIdCollection = [];
        this.treeGridParent = parent;
    }
    setCopyData(withHeader) {
        let copyContent = 'copyContent';
        let getCopyData = 'getCopyData';
        let isSelect = 'isSelect';
        let uniqueID = 'uniqueID';
        let currentRecords = this.treeGridParent.getCurrentViewRecords();
        if (window.getSelection().toString() === '') {
            this.clipBoardTextArea.value = this[copyContent] = '';
            let rows = this.treeGridParent.grid.getRows();
            if (this.treeGridParent.selectionSettings.mode !== 'Cell') {
                let selectedIndexes = this.treeGridParent.getSelectedRowIndexes().sort((a, b) => {
                    return a - b;
                });
                for (let i = 0; i < selectedIndexes.length; i++) {
                    if (i > 0) {
                        this.treeCopyContent += '\n';
                    }
                    if (!rows[selectedIndexes[i]].classList.contains('e-summaryrow')) {
                        let cells = [].slice.call(rows[selectedIndexes[i]].querySelectorAll('.e-rowcell'));
                        let uniqueid = this.treeGridParent.getSelectedRecords()[i][uniqueID];
                        if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                            if (this.treeGridParent.copyHierarchyMode === 'Parent' || this.treeGridParent.copyHierarchyMode === 'Both') {
                                this.parentContentData(currentRecords, selectedIndexes[i], rows, withHeader, i);
                            }
                            this[getCopyData](cells, false, '\t', withHeader);
                            this.treeCopyContent += this[copyContent];
                            this.copiedUniqueIdCollection.push(uniqueid);
                            this[copyContent] = '';
                            if (this.treeGridParent.copyHierarchyMode === 'Child' || this.treeGridParent.copyHierarchyMode === 'Both') {
                                this.childContentData(currentRecords, selectedIndexes[i], rows, withHeader);
                            }
                        }
                    }
                }
                if (withHeader) {
                    let headerTextArray = [];
                    for (let i = 0; i < this.treeGridParent.getVisibleColumns().length; i++) {
                        headerTextArray[i] = this.treeGridParent.getVisibleColumns()[i].headerText;
                    }
                    this[getCopyData](headerTextArray, false, '\t', withHeader);
                    this.treeCopyContent = this[copyContent] + '\n' + this.treeCopyContent;
                }
                let args = {
                    data: this.treeCopyContent,
                    cancel: false,
                };
                this.treeGridParent.trigger(beforeCopy, args);
                if (args.cancel) {
                    return;
                }
                this.clipBoardTextArea.value = this[copyContent] = args.data;
                if (!Browser.userAgent.match(/ipad|ipod|iphone/i)) {
                    this.clipBoardTextArea.select();
                }
                else {
                    this.clipBoardTextArea.setSelectionRange(0, this.clipBoardTextArea.value.length);
                }
                this[isSelect] = true;
                this.copiedUniqueIdCollection = [];
                this.treeCopyContent = '';
            }
            else {
                super.setCopyData(withHeader);
            }
        }
    }
    parentContentData(currentRecords, selectedIndex, rows, withHeader, index) {
        let getCopyData = 'getCopyData';
        let copyContent = 'copyContent';
        let parentItem = 'parentItem';
        let uniqueID = 'uniqueID';
        let level = 'level';
        if (!isNullOrUndefined(currentRecords[selectedIndex][parentItem])) {
            let treeLevel = currentRecords[selectedIndex][parentItem][level];
            for (let i = 0; i < treeLevel + 1; i++) {
                for (let j = 0; j < currentRecords.length; j++) {
                    if (!isNullOrUndefined(currentRecords[selectedIndex][parentItem]) &&
                        currentRecords[j][uniqueID] === currentRecords[selectedIndex][parentItem][uniqueID]) {
                        selectedIndex = j;
                        let cells = [].slice.call(rows[selectedIndex].querySelectorAll('.e-rowcell'));
                        let uniqueid = currentRecords[j][uniqueID];
                        if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                            this[getCopyData](cells, false, '\t', withHeader);
                            if (index > 0) {
                                this.treeCopyContent = this.treeCopyContent + this[copyContent] + '\n';
                            }
                            else {
                                this.treeCopyContent = this[copyContent] + '\n' + this.treeCopyContent;
                            }
                            this.copiedUniqueIdCollection.push(uniqueid);
                            this[copyContent] = '';
                            break;
                        }
                    }
                }
            }
        }
    }
    copy(withHeader) {
        super.copy(withHeader);
    }
    paste(data, rowIndex, colIndex) {
        super.paste(data, rowIndex, colIndex);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'clipboard';
    }
    ;
    /**
     * To destroy the clipboard
     * @return {void}
     * @hidden
     */
    destroy() {
        super.destroy();
    }
    childContentData(currentRecords, selectedIndex, rows, withHeader) {
        let getCopyData = 'getCopyData';
        let copyContent = 'copyContent';
        let childRecords = 'childRecords';
        let hasChildRecords = 'hasChildRecords';
        let uniqueID = 'uniqueID';
        if (currentRecords[selectedIndex][hasChildRecords]) {
            let childData = currentRecords[selectedIndex][childRecords];
            for (let i = 0; i < childData.length; i++) {
                for (let j = 0; j < currentRecords.length; j++) {
                    if (!isNullOrUndefined(childData[i][uniqueID]) && currentRecords[j][uniqueID] === childData[i][uniqueID]) {
                        if ((!isNullOrUndefined(rows[j])) && !rows[j].classList.contains('e-summaryrow')) {
                            let cells = [].slice.call(rows[j].querySelectorAll('.e-rowcell'));
                            let uniqueid = currentRecords[j][uniqueID];
                            if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                                this[getCopyData](cells, false, '\t', withHeader);
                                this.treeCopyContent += ('\n' + this[copyContent]);
                                this[copyContent] = '';
                                this.copiedUniqueIdCollection.push(uniqueid);
                                this.childContentData(currentRecords, j, rows, withHeader);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
}

function isRemoteData(parent) {
    if (parent.dataSource instanceof DataManager) {
        let adaptor = parent.dataSource.adaptor;
        return (adaptor instanceof ODataAdaptor ||
            (adaptor instanceof WebApiAdaptor) || (adaptor instanceof WebMethodAdaptor) ||
            (adaptor instanceof CacheAdaptor) || adaptor instanceof UrlAdaptor);
    }
    return false;
}
function isCountRequired(parent) {
    if (parent.dataSource && 'result' in parent.dataSource) {
        return true;
    }
    return false;
}
function isCheckboxcolumn(parent) {
    for (let i = 0; i < parent.columns.length; i++) {
        if (parent.columns[i].showCheckbox) {
            return true;
        }
    }
    return false;
}
function isFilterChildHierarchy(parent) {
    if ((!isNullOrUndefined(parent.grid.searchSettings.key) && parent.grid.searchSettings.key !== '' &&
        (parent.searchSettings.hierarchyMode === 'Child' || parent.searchSettings.hierarchyMode === 'None')) ||
        (parent.allowFiltering && parent.grid.filterSettings.columns.length &&
            (parent.filterSettings.hierarchyMode === 'Child' || parent.filterSettings.hierarchyMode === 'None'))) {
        return true;
    }
    return false;
}
/**
 * @hidden
 */
function findParentRecords(records) {
    let datas;
    datas = [];
    let recordsLength = Object.keys(records).length;
    for (let i = 0, len = recordsLength; i < len; i++) {
        let hasChild = getObject('hasChildRecords', records[i]);
        if (hasChild) {
            datas.push(records[i]);
        }
    }
    return datas;
}
/**
 * @hidden
 */
function getExpandStatus(parent, record, parents) {
    let parentRecord = isNullOrUndefined(record.parentItem) ? null :
        getParentData(parent, record.parentItem.uniqueID);
    let childParent;
    if (parentRecord != null) {
        if (parent.initialRender && !isNullOrUndefined(parentRecord[parent.expandStateMapping])
            && !parentRecord[parent.expandStateMapping]) {
            parentRecord.expanded = false;
            return false;
        }
        else if (parentRecord.expanded === false) {
            return false;
        }
        else if (parentRecord.parentItem) {
            childParent = getParentData(parent, parentRecord.parentItem.uniqueID);
            if (childParent && parent.initialRender && !isNullOrUndefined(childParent[parent.expandStateMapping])
                && !childParent[parent.expandStateMapping]) {
                childParent.expanded = false;
                return false;
            }
            if (childParent && childParent.expanded === false) {
                return false;
            }
            else if (childParent) {
                return getExpandStatus(parent, childParent, parents);
            }
            return true;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}
/**
 * @hidden
 */
function findChildrenRecords(records) {
    let datas = [];
    if (isNullOrUndefined(records) || (!records.hasChildRecords && !isNullOrUndefined(records.childRecords)
        && !records.childRecords.length)) {
        return [];
    }
    if (!isNullOrUndefined(records.childRecords)) {
        let childRecords = records.childRecords;
        for (let i = 0, len = Object.keys(childRecords).length; i < len; i++) {
            datas.push(childRecords[i]);
            if (childRecords[i].hasChildRecords || (!isNullOrUndefined(childRecords[i].childRecords) &&
                childRecords[i].childRecords.length)) {
                datas = [...datas, ...findChildrenRecords(childRecords[i])];
            }
        }
    }
    return datas;
}
function isOffline(parent) {
    if (isRemoteData(parent)) {
        let dm = parent.dataSource;
        return !isNullOrUndefined(dm.ready);
    }
    return true;
}
function extendArray(array) {
    let objArr = [];
    let obj;
    let keys;
    for (let i = 0; array && i < array.length; i++) {
        keys = Object.keys(array[i]);
        obj = {};
        for (let j = 0; j < keys.length; j++) {
            obj[keys[j]] = array[i][keys[j]];
        }
        objArr.push(obj);
    }
    return objArr;
}
function getPlainData(value) {
    delete value.hasChildRecords;
    delete value.childRecords;
    delete value.index;
    delete value.parentItem;
    delete value.level;
    return value;
}
function getParentData(parent, value, requireFilter) {
    if (requireFilter) {
        let idFilter = 'uniqueIDFilterCollection';
        return parent[idFilter][value];
    }
    else {
        let id = 'uniqueIDCollection';
        return parent[id][value];
    }
}
function isHidden(el) {
    let style = window.getComputedStyle(el);
    return ((style.display === 'none') || (style.visibility === 'hidden'));
}

/**
 * TreeGrid Selection module
 * @hidden
 */
class Selection {
    /**
     * Constructor for Selection module
     */
    constructor(parent) {
        this.parent = parent;
        this.selectedItems = [];
        this.selectedIndexes = [];
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'selection';
    }
    addEventListener() {
        this.parent.on('dataBoundArg', this.headerCheckbox, this);
        this.parent.on('columnCheckbox', this.columnCheckbox, this);
        this.parent.on('updateGridActions', this.updateGridActions, this);
        this.parent.grid.on('colgroup-refresh', this.headerCheckbox, this);
        this.parent.on('checkboxSelection', this.checkboxSelection, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('dataBoundArg', this.headerCheckbox);
        this.parent.off('columnCheckbox', this.columnCheckbox);
        this.parent.grid.off('colgroup-refresh', this.headerCheckbox);
        this.parent.off('checkboxSelection', this.checkboxSelection);
        this.parent.off('updateGridActions', this.updateGridActions);
    }
    /**
     * To destroy the Selection
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    checkboxSelection(args) {
        let target = getObject('target', args);
        let checkWrap = parentsUntil(target, 'e-checkbox-wrapper');
        let checkBox;
        if (checkWrap && checkWrap.querySelectorAll('.e-treecheckselect').length > 0) {
            checkBox = checkWrap.querySelector('input[type="checkbox"]');
            let rowIndex;
            rowIndex = [];
            rowIndex.push(target.closest('tr').rowIndex);
            this.selectCheckboxes(rowIndex);
            this.triggerChkChangeEvent(checkBox, checkBox.nextElementSibling.classList.contains('e-check'), target.closest('tr'));
        }
        else if (checkWrap && checkWrap.querySelectorAll('.e-treeselectall').length > 0 && this.parent.autoCheckHierarchy) {
            let checkBoxvalue = !checkWrap.querySelector('.e-frame').classList.contains('e-check')
                && !checkWrap.querySelector('.e-frame').classList.contains('e-stop');
            this.headerSelection(checkBoxvalue);
            checkBox = checkWrap.querySelector('input[type="checkbox"]');
            this.triggerChkChangeEvent(checkBox, checkBoxvalue, target.closest('tr'));
        }
    }
    triggerChkChangeEvent(checkBox, checkState, rowElement) {
        let data = this.parent.getCurrentViewRecords()[rowElement.rowIndex];
        let args = { checked: checkState, target: checkBox, rowElement: rowElement,
            rowData: checkBox.classList.contains('e-treeselectall')
                ? this.parent.getCheckedRecords() : data };
        this.parent.trigger(checkboxChange, args);
    }
    getCheckboxcolumnIndex() {
        let mappingUid;
        let columnIndex;
        let columns = (this.parent.columns);
        for (let col = 0; col < columns.length; col++) {
            if (columns[col].showCheckbox) {
                mappingUid = this.parent.columns[col].uid;
            }
        }
        let headerCelllength = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv').length;
        for (let j = 0; j < headerCelllength; j++) {
            let headercell = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv')[j];
            if (headercell.getAttribute('e-mappinguid') === mappingUid) {
                columnIndex = j;
            }
        }
        return columnIndex;
    }
    headerCheckbox() {
        this.columnIndex = this.getCheckboxcolumnIndex();
        if (this.columnIndex > -1 && this.parent.getHeaderContent().querySelectorAll('.e-treeselectall').length === 0) {
            let headerElement = this.parent.getHeaderContent().querySelectorAll('.e-headercelldiv')[this.columnIndex];
            let checkWrap;
            let value = false;
            let rowChkBox = this.parent.createElement('input', { className: 'e-treeselectall', attrs: { 'type': 'checkbox' } });
            checkWrap = createCheckBox(this.parent.createElement, false, { checked: value, label: ' ' });
            checkWrap.classList.add('e-hierarchycheckbox');
            checkWrap.querySelector('.e-frame').style.width = '18px';
            checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
            if (!isNullOrUndefined(headerElement)) {
                headerElement.insertBefore(checkWrap, headerElement.firstChild);
            }
            if (this.parent.autoCheckHierarchy) {
                this.headerSelection();
            }
        }
        else if (this.columnIndex > -1 && this.parent.getHeaderContent().querySelectorAll('.e-treeselectall').length > 0) {
            let checkWrap = this.parent.getHeaderContent().querySelectorAll('.e-checkbox-wrapper')[0];
            let checkBoxvalue = checkWrap.querySelector('.e-frame').classList.contains('e-check');
            if (this.parent.autoCheckHierarchy && checkBoxvalue) {
                this.headerSelection(checkBoxvalue);
            }
        }
    }
    renderColumnCheckbox(args) {
        let checkWrap;
        let rowChkBox = this.parent.createElement('input', { className: 'e-treecheckselect', attrs: { 'type': 'checkbox' } });
        let data = args.data;
        args.cell.classList.add('e-treegridcheckbox');
        args.cell.setAttribute('aria-label', 'checkbox');
        let value = (isNullOrUndefined(data.checkboxState) || data.checkboxState === 'uncheck') ? false : true;
        checkWrap = createCheckBox(this.parent.createElement, false, { checked: value, label: ' ' });
        checkWrap.classList.add('e-hierarchycheckbox');
        checkWrap.querySelector('.e-frame').style.width = '18px';
        if (data.checkboxState === 'indeterminate') {
            let checkbox = checkWrap.querySelectorAll('.e-frame')[0];
            removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            checkWrap.querySelector('.e-frame').classList.add('e-stop');
        }
        checkWrap.insertBefore(rowChkBox.cloneNode(), checkWrap.firstChild);
        return checkWrap;
    }
    columnCheckbox(container) {
        let checkWrap = this.renderColumnCheckbox(container);
        let containerELe = container.cell.querySelector('.e-treecolumn-container');
        if (!isNullOrUndefined(containerELe)) {
            if (!container.cell.querySelector('.e-hierarchycheckbox')) {
                containerELe.insertBefore(checkWrap, containerELe.querySelectorAll('.e-treecell')[0]);
            }
        }
        else {
            let spanEle = this.parent.createElement('span', { className: 'e-treecheckbox' });
            let data = container.cell.innerHTML;
            container.cell.innerHTML = '';
            spanEle.innerHTML = data;
            let divEle = this.parent.createElement('div', { className: 'e-treecheckbox-container' });
            divEle.appendChild(checkWrap);
            divEle.appendChild(spanEle);
            container.cell.appendChild(divEle);
        }
    }
    selectCheckboxes(rowIndexes) {
        let adaptorName = 'adaptorName';
        for (let i = 0; i < rowIndexes.length; i++) {
            let record = this.parent.getCurrentViewRecords()[rowIndexes[i]];
            let flatRecord = getParentData(this.parent, record.uniqueID);
            record = (isBlazor() && this.parent.dataSource[adaptorName] === 'BlazorAdaptor') ?
                record : flatRecord;
            let checkboxState = (record.checkboxState === 'uncheck') ? 'check' : 'uncheck';
            record.checkboxState = checkboxState;
            let keys = Object.keys(record);
            for (let j = 0; j < keys.length; j++) {
                if (flatRecord.hasOwnProperty(keys[j])) {
                    flatRecord[keys[j]] = record[keys[j]];
                }
            }
            this.traverSelection(record, checkboxState, false);
            if (this.parent.autoCheckHierarchy) {
                this.headerSelection();
            }
        }
    }
    traverSelection(record, checkboxState, ischildItem) {
        let length = 0;
        this.updateSelectedItems(record, checkboxState);
        if (!ischildItem && record.parentItem && this.parent.autoCheckHierarchy) {
            this.updateParentSelection(record.parentItem);
        }
        if (record.childRecords && this.parent.autoCheckHierarchy) {
            let childRecords = record.childRecords;
            if (!isNullOrUndefined(this.parent.filterModule) &&
                this.parent.filterModule.filteredResult.length > 0 && this.parent.autoCheckHierarchy) {
                childRecords = this.getFilteredChildRecords(childRecords);
            }
            length = childRecords.length;
            for (let count = 0; count < length; count++) {
                if (!childRecords[count].isSummaryRow) {
                    if (childRecords[count].hasChildRecords) {
                        this.traverSelection(childRecords[count], checkboxState, true);
                    }
                    else {
                        this.updateSelectedItems(childRecords[count], checkboxState);
                    }
                }
            }
        }
    }
    getFilteredChildRecords(childRecords) {
        let filteredChildRecords = childRecords.filter((e) => {
            return this.parent.filterModule.filteredResult.indexOf(e) > -1;
        });
        return filteredChildRecords;
    }
    updateParentSelection(parentRecord) {
        let adaptorName = 'adaptorName';
        let length = 0;
        let childRecords = [];
        let record = getParentData(this.parent, parentRecord.uniqueID);
        if (record && record.childRecords) {
            childRecords = record.childRecords;
        }
        if (!isNullOrUndefined(this.parent.filterModule) &&
            this.parent.filterModule.filteredResult.length > 0 && this.parent.autoCheckHierarchy) {
            childRecords = this.getFilteredChildRecords(childRecords);
        }
        length = childRecords && childRecords.length;
        let indeter = 0;
        let checkChildRecords = 0;
        if (!isNullOrUndefined(record)) {
            for (let i = 0; i < childRecords.length; i++) {
                let childRecord = this.parent.getCurrentViewRecords().filter((e) => {
                    return e.uniqueID === childRecords[i].uniqueID;
                });
                let currentRecord = getParentData(this.parent, childRecords[i].uniqueID);
                let checkBoxRecord = (isBlazor() && this.parent.dataSource[adaptorName] === 'BlazorAdaptor') ?
                    childRecord[0] : currentRecord;
                if (!isNullOrUndefined(checkBoxRecord)) {
                    if (checkBoxRecord.checkboxState === 'indeterminate') {
                        indeter++;
                    }
                    else if (checkBoxRecord.checkboxState === 'check') {
                        checkChildRecords++;
                    }
                }
            }
            if (indeter > 0 || (checkChildRecords > 0 && checkChildRecords !== length)) {
                record.checkboxState = 'indeterminate';
            }
            else if (checkChildRecords === 0 && indeter === 0) {
                record.checkboxState = 'uncheck';
            }
            else {
                record.checkboxState = 'check';
            }
            this.updateSelectedItems(record, record.checkboxState);
            if (record.parentItem) {
                this.updateParentSelection(record.parentItem);
            }
        }
    }
    headerSelection(checkAll) {
        let adaptorName = 'adaptorName';
        let index = -1;
        let length = 0;
        let data = (!isNullOrUndefined(this.parent.filterModule) &&
            this.parent.filterModule.filteredResult.length > 0) ? this.parent.filterModule.filteredResult :
            this.parent.flatData;
        data = (isBlazor() && this.parent.dataSource[adaptorName] === 'BlazorAdaptor') || isRemoteData(this.parent) ?
            this.parent.getCurrentViewRecords() : data;
        if (!isNullOrUndefined(checkAll)) {
            for (let i = 0; i < data.length; i++) {
                if (checkAll) {
                    if (data[i].checkboxState === 'check') {
                        continue;
                    }
                    data[i].checkboxState = 'check';
                    this.updateSelectedItems(data[i], data[i].checkboxState);
                }
                else {
                    index = this.selectedItems.indexOf(data[i]);
                    if (index > -1) {
                        data[i].checkboxState = 'uncheck';
                        this.updateSelectedItems(data[i], data[i].checkboxState);
                        if (this.parent.autoCheckHierarchy) {
                            this.updateParentSelection(data[i]);
                        }
                    }
                }
            }
        }
        if (checkAll === false && this.parent.enableVirtualization) {
            this.selectedItems = [];
            this.selectedIndexes = [];
            data.filter((rec) => {
                rec.checkboxState = 'uncheck';
                this.updateSelectedItems(rec, rec.checkboxState);
            });
        }
        length = this.selectedItems.length;
        let checkbox = this.parent.getHeaderContent().querySelectorAll('.e-frame')[0];
        if (length > 0 && data.length > 0) {
            if (length !== data.length && !checkAll) {
                removeClass([checkbox], ['e-check']);
                checkbox.classList.add('e-stop');
            }
            else {
                removeClass([checkbox], ['e-stop']);
                checkbox.classList.add('e-check');
            }
        }
        else {
            removeClass([checkbox], ['e-check', 'e-stop']);
        }
    }
    updateSelectedItems(currentRecord, checkState, filter) {
        let record = this.parent.getCurrentViewRecords().filter((e) => {
            return e.uniqueID === currentRecord.uniqueID;
        });
        let checkedRecord;
        let adaptorName = 'adaptorName';
        let recordIndex = this.parent.getCurrentViewRecords().indexOf(record[0]);
        let checkboxRecord = getParentData(this.parent, currentRecord.uniqueID);
        let checkbox;
        if (recordIndex > -1) {
            let tr = this.parent.getRows()[recordIndex];
            let movableTr;
            if (this.parent.frozenRows || this.parent.getFrozenColumns()) {
                movableTr = this.parent.getMovableDataRows()[recordIndex];
            }
            checkbox = tr.querySelectorAll('.e-frame')[0] ? tr.querySelectorAll('.e-frame')[0]
                : movableTr.querySelectorAll('.e-frame')[0];
            if (!isNullOrUndefined(checkbox)) {
                removeClass([checkbox], ['e-check', 'e-stop', 'e-uncheck']);
            }
        }
        checkedRecord = (isBlazor() && this.parent.dataSource[adaptorName] === 'BlazorAdaptor') ?
            record[0] : checkboxRecord;
        if (isNullOrUndefined(checkedRecord)) {
            checkedRecord = currentRecord;
        }
        checkedRecord.checkboxState = checkState;
        if (checkState === 'check' && isNullOrUndefined(currentRecord.isSummaryRow)) {
            if (recordIndex !== -1 && this.selectedIndexes.indexOf(recordIndex) === -1) {
                this.selectedIndexes.push(recordIndex);
            }
            if (this.selectedItems.indexOf(checkedRecord) === -1 && (recordIndex !== -1 &&
                (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0))) {
                this.selectedItems.push(checkedRecord);
            }
            if (this.selectedItems.indexOf(checkedRecord) === -1 && (!isNullOrUndefined(this.parent.filterModule) &&
                this.parent.filterModule.filteredResult.length === 0)) {
                this.selectedItems.push(checkedRecord);
            }
            if (this.selectedItems.indexOf(checkedRecord) === -1 && isNullOrUndefined(this.parent.filterModule)) {
                this.selectedItems.push(checkedRecord);
            }
        }
        else if ((checkState === 'uncheck' || checkState === 'indeterminate') && isNullOrUndefined(currentRecord.isSummaryRow)) {
            let index = this.selectedItems.indexOf(checkedRecord);
            if (index !== -1) {
                this.selectedItems.splice(index, 1);
            }
            if (this.selectedIndexes.indexOf(recordIndex) !== -1) {
                let checkedIndex = this.selectedIndexes.indexOf(recordIndex);
                this.selectedIndexes.splice(checkedIndex, 1);
            }
        }
        let checkBoxclass = checkState === 'indeterminate' ? 'e-stop' : 'e-' + checkState;
        if (recordIndex > -1) {
            if (!isNullOrUndefined(checkbox)) {
                checkbox.classList.add(checkBoxclass);
            }
        }
    }
    updateGridActions(args) {
        let requestType = args.requestType;
        let childData;
        let childLength;
        if (isCheckboxcolumn(this.parent)) {
            if (this.parent.autoCheckHierarchy) {
                if ((requestType === 'sorting' || requestType === 'paging')) {
                    let rows = this.parent.grid.getRows();
                    childData = this.parent.getCurrentViewRecords();
                    childLength = childData.length;
                    this.selectedIndexes = [];
                    for (let i = 0; i < childLength; i++) {
                        if (!rows[i].classList.contains('e-summaryrow')) {
                            this.updateSelectedItems(childData[i], childData[i].checkboxState, true);
                        }
                    }
                }
                else if (requestType === 'delete' || args.action === 'add') {
                    let updatedData = [];
                    if (requestType === 'delete') {
                        updatedData = args.data;
                    }
                    else {
                        updatedData.push(args.data);
                    }
                    for (let i = 0; i < updatedData.length; i++) {
                        if (requestType === 'delete') {
                            let index = this.parent.flatData.indexOf(updatedData[i]);
                            let checkedIndex = this.selectedIndexes.indexOf(index);
                            this.selectedIndexes.splice(checkedIndex, 1);
                            this.updateSelectedItems(updatedData[i], 'uncheck');
                        }
                        if (!isNullOrUndefined(updatedData[i].parentItem)) {
                            this.updateParentSelection(updatedData[i].parentItem);
                        }
                    }
                }
                else if (args.requestType === 'add' && this.parent.autoCheckHierarchy) {
                    args.data.checkboxState = 'uncheck';
                }
                else if (requestType === 'filtering' || requestType === 'searching' || requestType === 'refresh'
                    && !isRemoteData(this.parent)) {
                    this.selectedItems = [];
                    this.selectedIndexes = [];
                    childData = (!isNullOrUndefined(this.parent.filterModule) && this.parent.filterModule.filteredResult.length > 0) ?
                        this.parent.getCurrentViewRecords() : this.parent.flatData;
                    childData.forEach((record) => {
                        if (record.hasChildRecords) {
                            this.updateParentSelection(record);
                        }
                        else {
                            this.updateSelectedItems(record, record.checkboxState);
                        }
                    });
                    this.headerSelection();
                }
            }
        }
    }
    getCheckedrecords() {
        return this.selectedItems;
    }
    getCheckedRowIndexes() {
        return this.selectedIndexes;
    }
}

/**
 * TreeGrid Print module
 * @hidden
 */
class Print$1 {
    /**
     * Constructor for Print module
     */
    constructor(parent) {
        this.parent = parent;
        Grid.Inject(Print);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'print';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.grid.on(printGridInit, this.printTreeGrid, this);
    }
    removeEventListener() {
        this.parent.grid.off(printGridInit, this.printTreeGrid);
    }
    printTreeGrid(printGrid) {
        let grid = getObject('printgrid', printGrid);
        let gridElement = getObject('element', printGrid);
        grid.addEventListener(queryCellInfo, this.parent.grid.queryCellInfo);
        grid.addEventListener(rowDataBound, this.parent.grid.rowDataBound);
        grid.addEventListener(beforeDataBound, this.parent.grid.beforeDataBound);
        addClass([gridElement], 'e-treegrid');
    }
    print() {
        this.parent.grid.print();
    }
    /**
     * To destroy the Print
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
}

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the filtering behavior of the TreeGrid.
 */
class SearchSettings extends ChildProperty {
}
__decorate$3([
    Property()
], SearchSettings.prototype, "fields", void 0);
__decorate$3([
    Property(false)
], SearchSettings.prototype, "ignoreCase", void 0);
__decorate$3([
    Property('contains')
], SearchSettings.prototype, "operator", void 0);
__decorate$3([
    Property()
], SearchSettings.prototype, "key", void 0);
__decorate$3([
    Property()
], SearchSettings.prototype, "hierarchyMode", void 0);

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the selection behavior of the TreeGrid.
 */
class SelectionSettings extends ChildProperty {
}
__decorate$4([
    Property('Row')
], SelectionSettings.prototype, "mode", void 0);
__decorate$4([
    Property('Flow')
], SelectionSettings.prototype, "cellSelectionMode", void 0);
__decorate$4([
    Property('Single')
], SelectionSettings.prototype, "type", void 0);
__decorate$4([
    Property(false)
], SelectionSettings.prototype, "persistSelection", void 0);
__decorate$4([
    Property('Default')
], SelectionSettings.prototype, "checkboxMode", void 0);
__decorate$4([
    Property(false)
], SelectionSettings.prototype, "checkboxOnly", void 0);
__decorate$4([
    Property(true)
], SelectionSettings.prototype, "enableToggle", void 0);

/**
 * TreeGrid render module
 * @hidden
 */
class Render {
    /**
     * Constructor for render module
     */
    constructor(parent) {
        this.parent = parent;
        this.templateResult = null;
        this.parent.grid.on('template-result', this.columnTemplateResult, this);
        this.parent.grid.on('reactTemplateRender', this.reactTemplateRender, this);
    }
    /**
     * Updated row elements for TreeGrid
     */
    RowModifier(args) {
        if (!args.data) {
            return;
        }
        let data = args.data;
        let parentData = data.parentItem;
        let index;
        if (!isNullOrUndefined(data.parentItem) && !isFilterChildHierarchy(this.parent) &&
            (!(this.parent.allowPaging && !(this.parent.pageSettings.pageSizeMode === 'Root')) ||
                (isRemoteData(this.parent) && !isOffline(this.parent)))) {
            index = data.parentItem.index;
            let collapsed$$1 = (this.parent.initialRender && (!(isNullOrUndefined(parentData[this.parent.expandStateMapping]) ||
                parentData[this.parent.expandStateMapping]) || this.parent.enableCollapseAll)) ||
                !getExpandStatus(this.parent, args.data, this.parent.grid.getCurrentViewRecords());
            if (collapsed$$1) {
                args.row.style.display = 'none';
            }
        }
        else {
            index = +args.row.getAttribute('aria-rowindex');
        }
        if (isRemoteData(this.parent) && !isOffline(this.parent)) {
            let proxy = this.parent;
            let parentrec = this.parent.getCurrentViewRecords().filter((rec) => {
                return getValue(proxy.idMapping, rec) === getValue(proxy.parentIdMapping, data);
            });
            if (parentrec.length > 0) {
                let display = parentrec[0].expanded ? 'table-row' : 'none';
                args.row.setAttribute('style', 'display: ' + display + ';');
            }
        }
        //addClass([args.row], 'e-gridrowindex' + index + 'level' + (<ITreeData>args.data).level);
        let summaryRow = getObject('isSummaryRow', args.data);
        if (summaryRow) {
            addClass([args.row], 'e-summaryrow');
        }
        if (args.row.querySelector('.e-treegridexpand')) {
            args.row.setAttribute('aria-expanded', 'true');
        }
        else if (args.row.querySelector('.e-treegridcollapse')) {
            args.row.setAttribute('aria-expanded', 'false');
        }
        if (this.parent.enableCollapseAll && this.parent.initialRender) {
            if (!isNullOrUndefined(data.parentItem)) {
                args.row.style.display = 'none';
            }
        }
        this.parent.trigger(rowDataBound, args);
    }
    /**
     * cell renderer for tree column index cell
     */
    cellRender(args) {
        if (!args.data) {
            return;
        }
        let grid = this.parent.grid;
        let data = args.data;
        let index;
        let ispadfilter = isNullOrUndefined(data.filterLevel);
        let pad = ispadfilter ? data.level : data.filterLevel;
        let totalIconsWidth = 0;
        let cellElement;
        let column = this.parent.getColumnByUid(args.column.uid);
        let summaryRow = data.isSummaryRow;
        if (!isNullOrUndefined(data.parentItem)) {
            index = data.parentItem.index;
        }
        else {
            index = data.index;
        }
        if (grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex && (args.requestType === 'add' || args.requestType
            === 'rowDragAndDrop' || args.requestType === 'delete' || isNullOrUndefined(args.cell.querySelector('.e-treecell')))) {
            let container = createElement('div', { className: 'e-treecolumn-container' });
            let emptyExpandIcon = createElement('span', {
                className: 'e-icons e-none',
                styles: 'width: 10px; display: inline-block'
            });
            for (let n = 0; n < pad; n++) {
                totalIconsWidth += 10;
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            let iconRequired = !isNullOrUndefined(data.hasFilteredChildRecords)
                ? data.hasFilteredChildRecords : data.hasChildRecords;
            if (iconRequired && !isNullOrUndefined(data.childRecords)) {
                iconRequired = !(data.childRecords.length === 0);
            }
            if (iconRequired) {
                addClass([args.cell], 'e-treerowcell');
                let expandIcon = createElement('span', { className: 'e-icons' });
                let expand;
                if (this.parent.initialRender) {
                    expand = data.expanded &&
                        (isNullOrUndefined(data[this.parent.expandStateMapping]) || data[this.parent.expandStateMapping]) &&
                        !this.parent.enableCollapseAll;
                }
                else {
                    expand = !(!data.expanded || !getExpandStatus(this.parent, data, this.parent.grid.getCurrentViewRecords()));
                }
                addClass([expandIcon], (expand) ? 'e-treegridexpand' : 'e-treegridcollapse');
                totalIconsWidth += 18;
                container.appendChild(expandIcon);
                emptyExpandIcon.style.width = '7px';
                totalIconsWidth += 7;
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            else if (pad || !pad && !data.level) {
                // icons width
                totalIconsWidth += 20;
                container.appendChild(emptyExpandIcon.cloneNode());
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            //should add below code when paging funcitonality implemented
            // if (data.hasChildRecords) {
            //     addClass([expandIcon], data.expanded ? 'e-treegridexpand' : 'e-treegridcollapse');
            // }
            cellElement = createElement('span', { className: 'e-treecell' });
            if (this.parent.allowTextWrap) {
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
            addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
            this.updateTreeCell(args, cellElement, container);
            container.appendChild(cellElement);
            args.cell.appendChild(container);
        }
        if (this.parent.frozenColumns > this.parent.treeColumnIndex && this.parent.frozenColumns > 0 &&
            grid.getColumnIndexByUid(args.column.uid) === this.parent.frozenColumns) {
            addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
        }
        else if (this.parent.frozenColumns < this.parent.treeColumnIndex && this.parent.frozenColumns > 0 &&
            (grid.getColumnIndexByUid(args.column.uid) === this.parent.frozenColumns
                || grid.getColumnIndexByUid(args.column.uid) === this.parent.frozenColumns - 1)) {
            addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
        }
        else if (this.parent.frozenColumns === this.parent.treeColumnIndex && this.parent.frozenColumns > 0 &&
            grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex - 1) {
            addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
        }
        if (!isNullOrUndefined(column) && column.showCheckbox) {
            this.parent.notify('columnCheckbox', args);
            if (this.parent.allowTextWrap) {
                let checkboxElement = args.cell.querySelectorAll('.e-frame')[0];
                let width = parseInt(checkboxElement.style.width, 16);
                totalIconsWidth += width;
                totalIconsWidth += 10;
                if (grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
                    cellElement = args.cell.querySelector('.e-treecell');
                }
                else {
                    cellElement = args.cell.querySelector('.e-treecheckbox');
                }
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
        }
        if (summaryRow) {
            addClass([args.cell], 'e-summarycell');
            let summaryData = getObject(args.column.field, args.data);
            args.cell.querySelector('.e-treecell') != null ?
                args.cell.querySelector('.e-treecell').innerHTML = summaryData : args.cell.innerHTML = summaryData;
        }
        if (isNullOrUndefined(this.parent.rowTemplate)) {
            this.parent.trigger(queryCellInfo, args);
        }
    }
    updateTreeCell(args, cellElement, container) {
        let treeColumn = this.parent.columns[this.parent.treeColumnIndex];
        let templateFn = 'templateFn';
        let colindex = args.column.index;
        if (isNullOrUndefined(treeColumn.field)) {
            args.cell.setAttribute('aria-colindex', colindex + '');
        }
        if (treeColumn.field === args.column.field && !isNullOrUndefined(treeColumn.template) && !isBlazor()) {
            args.column.template = treeColumn.template;
            args.column[templateFn] = templateCompiler(args.column.template);
            args.cell.classList.add('e-templatecell');
        }
        let textContent = args.cell.querySelector('.e-treecell') != null ?
            args.cell.querySelector('.e-treecell').innerHTML : args.cell.innerHTML;
        if (typeof (args.column.template) === 'object' && this.templateResult) {
            appendChildren(cellElement, this.templateResult);
            this.templateResult = null;
            args.cell.innerHTML = '';
        }
        else if (args.cell.classList.contains('e-templatecell')) {
            let len = args.cell.children.length;
            let tempID = this.parent.element.id + args.column.uid;
            if (treeColumn.field === args.column.field && !isNullOrUndefined(treeColumn.template) && !isBlazor()) {
                let portals = 'portals';
                let renderReactTemplates = 'renderReactTemplates';
                if (this.parent.isReact) {
                    args.column[templateFn](args.data, this.parent, 'template', tempID, null, null, cellElement);
                    if (isNullOrUndefined(this.parent.grid[portals])) {
                        this.parent.grid[portals] = this.parent[portals];
                    }
                    this.parent[renderReactTemplates]();
                }
                else {
                    let str = 'isStringTemplate';
                    let result;
                    result = args.column[templateFn](extend$1({ 'index': '' }, args.data), this.parent, 'template', tempID, this.parent[str]);
                    appendChildren(cellElement, result);
                }
                delete args.column.template;
                delete args.column[templateFn];
                args.cell.innerHTML = '';
            }
            else {
                for (let i = 0; i < len; len = args.cell.children.length) {
                    cellElement.appendChild(args.cell.children[i]);
                }
            }
        }
        else {
            cellElement.innerHTML = textContent;
            args.cell.innerHTML = '';
        }
    }
    columnTemplateResult(args) {
        this.templateResult = args.template;
    }
    reactTemplateRender(args) {
        let renderReactTemplates = 'renderReactTemplates';
        let portals = 'portals';
        this.parent[portals] = args;
        this.parent.notify('renderReactTemplate', this.parent[portals]);
        this.parent[renderReactTemplates]();
    }
    destroy() {
        this.parent.grid.off('template-result', this.columnTemplateResult);
        this.parent.grid.off('reactTemplateRender', this.reactTemplateRender);
    }
}

/**
 * Internal dataoperations for tree grid
 * @hidden
 */
class DataManipulation {
    constructor(grid) {
        this.addedRecords = 'addedRecords';
        this.parent = grid;
        this.parentItems = [];
        this.taskIds = [];
        this.hierarchyData = [];
        this.storedIndex = -1;
        this.sortedData = [];
        this.isSortAction = false;
        this.addEventListener();
        this.dataResults = {};
        this.isSelfReference = !isNullOrUndefined(this.parent.parentIdMapping);
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('updateRemoteLevel', this.updateParentRemoteData, this);
        this.parent.grid.on('sorting-begin', this.beginSorting, this);
        this.parent.on('updateAction', this.updateData, this);
        this.parent.on(remoteExpand, this.collectExpandingRecs, this);
        this.parent.on('dataProcessor', this.dataProcessor, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(remoteExpand, this.collectExpandingRecs);
        this.parent.off('updateRemoteLevel', this.updateParentRemoteData);
        this.parent.off('updateAction', this.updateData);
        this.parent.off('dataProcessor', this.dataProcessor);
        this.parent.grid.off('sorting-begin', this.beginSorting);
    }
    /**
     * To destroy the dataModule
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /** @hidden */
    isRemote() {
        if (!(this.parent.dataSource instanceof DataManager)) {
            return false;
        }
        return true;
        // let gridData:  DataManager = <DataManager>this.parent.dataSource;
        // return gridData.dataSource.offline !== true && gridData.dataSource.url !== undefined;
    }
    /**
     * Function to manipulate datasource
     * @hidden
     */
    convertToFlatData(data) {
        this.parent.flatData = (Object.keys(data).length === 0 && !(this.parent.dataSource instanceof DataManager) ?
            this.parent.dataSource : []);
        this.parent.parentData = [];
        let adaptorName = 'adaptorName';
        if ((isRemoteData(this.parent) && !isOffline(this.parent)) && data instanceof DataManager && !(data instanceof Array)) {
            let dm = this.parent.dataSource;
            if (this.parent.parentIdMapping) {
                this.parent.query = isNullOrUndefined(this.parent.query) ?
                    new Query() : this.parent.query;
                if (this.parent.parentIdMapping) {
                    const filterKey = this.parent.query.params.filter((param) => param.key === 'IdMapping');
                    if (this.parent.initialRender && !filterKey.length) {
                        this.parent.query.where(this.parent.parentIdMapping, 'equal', null);
                        this.parent.query.addParams('IdMapping', this.parent.idMapping);
                    }
                }
                let clientRender = 'isClientRender';
                if (!this.parent.hasChildMapping && !(this.parent.dataSource[adaptorName] === 'BlazorAdaptor' && !this.parent[clientRender])) {
                    let qry = this.parent.query.clone();
                    qry.queries = [];
                    qry = qry.select([this.parent.parentIdMapping]);
                    qry.isCountRequired = true;
                    dm.executeQuery(qry).then((e) => {
                        this.parentItems = DataUtil.distinct(e.result, this.parent.parentIdMapping, false);
                        let req = getObject('dataSource.requests', this.parent).filter((e) => {
                            return e.httpRequest.statusText !== 'OK';
                        }).length;
                        if (req === 0) {
                            setValue('grid.contentModule.isLoaded', true, this.parent);
                            if (!isNullOrUndefined(this.zerothLevelData)) {
                                setValue('cancel', false, this.zerothLevelData);
                                getValue('grid.renderModule', this.parent).dataManagerSuccess(this.zerothLevelData);
                                this.zerothLevelData = null;
                            }
                            this.parent.grid.hideSpinner();
                        }
                    });
                }
            }
        }
        else if (data instanceof Array) {
            this.convertJSONData(data);
        }
    }
    convertJSONData(data) {
        this.hierarchyData = [];
        this.taskIds = [];
        if (!this.parent.idMapping) {
            this.hierarchyData = data;
        }
        else {
            for (let i = 0; i < Object.keys(data).length; i++) {
                let tempData = data[i];
                this.hierarchyData.push(extend({}, tempData));
                if (!isNullOrUndefined(tempData[this.parent.idMapping])) {
                    this.taskIds.push(tempData[this.parent.idMapping]);
                }
            }
        }
        if (this.isSelfReference) {
            let selfData = [];
            let mappingData = new DataManager(this.hierarchyData).executeLocal(new Query()
                .group(this.parent.parentIdMapping));
            for (let i = 0; i < mappingData.length; i++) {
                let groupData = mappingData[i];
                let index = this.taskIds.indexOf(groupData.key);
                if (!isNullOrUndefined(groupData.key)) {
                    if (index > -1) {
                        let childData = (groupData.items);
                        this.hierarchyData[index][this.parent.childMapping] = childData;
                        continue;
                    }
                }
                selfData.push.apply(selfData, groupData.items);
            }
            this.hierarchyData = this.selfReferenceUpdate(selfData);
        }
        if (!Object.keys(this.hierarchyData).length) {
            let isGantt = 'isGantt';
            let referenceData = !(this.parent.dataSource instanceof DataManager) && this.parent[isGantt];
            this.parent.flatData = referenceData ? (this.parent.dataSource) : [];
        }
        else {
            this.createRecords(this.hierarchyData);
        }
        this.storedIndex = -1;
    }
    // private crudActions(): void {
    //   if (this.parent.dataSource instanceof DataManager && (this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor)) {
    //     let oldUpdate: Function = this.parent.dataSource.adaptor.update;
    //     this.parent.dataSource.adaptor.update =
    //         function (dm: DataManager, keyField: string, value: Object, tableName?: string, query?: Query, original?: Object): Object {
    //                value = getPlainData(value);
    //                return oldUpdate.apply(this, [dm, keyField, value, tableName, query, original]);
    //              }
    //   }
    // }
    selfReferenceUpdate(selfData) {
        let result = [];
        while (this.hierarchyData.length > 0 && selfData.length > 0) {
            let index = selfData.indexOf(this.hierarchyData[0]);
            if (index === -1) {
                this.hierarchyData.shift();
            }
            else {
                result.push(this.hierarchyData.shift());
                selfData.splice(index, 1);
            }
        }
        return result;
    }
    /**
     * Function to update the zeroth level parent records in remote binding
     * @hidden
     */
    updateParentRemoteData(args) {
        let records = args.result;
        let adaptorName = 'adaptorName';
        let clientRender = 'isClientRender';
        if (!this.parent.hasChildMapping && !this.parentItems.length &&
            (!(this.parent.dataSource[adaptorName] === 'BlazorAdaptor' && !this.parent[clientRender]) && !this.parent.loadChildOnDemand)) {
            this.zerothLevelData = args;
            setValue('cancel', true, args);
        }
        else {
            if (!(this.parent.dataSource[adaptorName] === 'BlazorAdaptor' && !this.parent[clientRender]) && !this.parent.loadChildOnDemand) {
                for (let rec = 0; rec < records.length; rec++) {
                    if (isNullOrUndefined(records[rec].index)) {
                        records[rec].taskData = extend({}, records[rec]);
                        records[rec].uniqueID = getUid(this.parent.element.id + '_data_');
                        setValue('uniqueIDCollection.' + records[rec].uniqueID, records[rec], this.parent);
                        records[rec].level = 0;
                        records[rec].index = Math.ceil(Math.random() * 1000);
                        if ((records[rec][this.parent.hasChildMapping] || this.parentItems.indexOf(records[rec][this.parent.idMapping]) !== -1)) {
                            records[rec].hasChildRecords = true;
                        }
                        records[rec].checkboxState = 'uncheck';
                    }
                }
            }
            else {
                if (!isNullOrUndefined(records)) {
                    this.convertToFlatData(records);
                }
            }
        }
        args.result = (this.parent.dataSource[adaptorName] === 'BlazorAdaptor' && !this.parent[clientRender] && !isNullOrUndefined(records))
            || this.parent.loadChildOnDemand ? this.parent.flatData : records;
        this.parent.notify('updateResults', args);
    }
    /**
     * Function to manipulate datasource
     * @hidden
     */
    collectExpandingRecs(rowDetails, isChild) {
        let gridRows = this.parent.getRows();
        if (this.parent.rowTemplate) {
            let rows = this.parent.getContentTable().rows;
            gridRows = [].slice.call(rows);
        }
        let childRecord;
        let adaptorName = 'adaptorName';
        let clientRender = 'isClientRender';
        if (rowDetails.rows.length > 0) {
            if (!isChild) {
                rowDetails.record.expanded = true;
            }
            for (let i = 0; i < rowDetails.rows.length; i++) {
                if (isBlazor() && this.parent.isServerRendered) {
                    removeClass([rowDetails.rows[i]], 'e-treerowcollapsed');
                    addClass([rowDetails.rows[i]], 'e-treerowexpanded');
                }
                else {
                    rowDetails.rows[i].style.display = 'table-row';
                }
                if ((isBlazor() && (this.parent.dataSource[adaptorName] === 'BlazorAdaptor' && !this.parent[clientRender]))
                    || this.parent.loadChildOnDemand) {
                    let targetEle = rowDetails.rows[i].getElementsByClassName('e-treegridcollapse')[0];
                    childRecord = this.parent.rowTemplate ? this.parent.grid.getCurrentViewRecords()[rowDetails.rows[i].rowIndex] :
                        this.parent.grid.getRowObjectFromUID(rowDetails.rows[i].getAttribute('data-Uid')).data;
                    if (!isNullOrUndefined(targetEle) && childRecord.expanded) {
                        addClass([targetEle], 'e-treegridexpand');
                        removeClass([targetEle], 'e-treegridcollapse');
                    }
                    let childRows = [];
                    childRows = gridRows.filter((r) => r.querySelector('.e-gridrowindex' + childRecord.index + 'level' + (childRecord.level + 1)));
                    if (childRows.length && childRecord.expanded) {
                        this.collectExpandingRecs({ record: childRecord, rows: childRows, parentRow: rowDetails.parentRow }, true);
                    }
                }
                let expandingTd = rowDetails.rows[i].querySelector('.e-detailrowcollapse');
                if (!isNullOrUndefined(expandingTd)) {
                    this.parent.grid.detailRowModule.expand(expandingTd);
                }
            }
        }
        else {
            this.fetchRemoteChildData({ record: rowDetails.record, rows: rowDetails.rows, parentRow: rowDetails.parentRow });
        }
    }
    fetchRemoteChildData(rowDetails, isChild) {
        let args = { row: rowDetails.parentRow, data: rowDetails.record };
        let dm = this.parent.dataSource;
        let qry = this.parent.grid.getDataModule().generateQuery();
        let clonequries = qry.queries.filter((e) => e.fn !== 'onPage' && e.fn !== 'onWhere');
        qry.queries = clonequries;
        qry.isCountRequired = true;
        qry.where(this.parent.parentIdMapping, 'equal', rowDetails.record[this.parent.idMapping]);
        showSpinner(this.parent.element);
        dm.executeQuery(qry).then((e) => {
            let datas = this.parent.grid.currentViewData;
            let inx = datas.indexOf(rowDetails.record);
            if (inx === -1) {
                this.parent.grid.getRowsObject().forEach((rows) => {
                    if (rows.data.uniqueID === rowDetails.record.uniqueID) {
                        inx = rows.index;
                    }
                });
            }
            let haveChild = getObject('actual.nextLevel', e);
            let result = e.result;
            rowDetails.record.childRecords = result;
            for (let r = 0; r < result.length; r++) {
                result[r].taskData = extend({}, result[r]);
                result[r].level = rowDetails.record.level + 1;
                result[r].index = Math.ceil(Math.random() * 1000);
                let parentData = extend({}, rowDetails.record);
                delete parentData.childRecords;
                result[r].parentItem = parentData;
                result[r].parentUniqueID = rowDetails.record.uniqueID;
                result[r].uniqueID = getUid(this.parent.element.id + '_data_');
                result[r].checkboxState = 'uncheck';
                setValue('uniqueIDCollection.' + result[r].uniqueID, result[r], this.parent);
                // delete result[r].parentItem.childRecords;
                if ((result[r][this.parent.hasChildMapping] || this.parentItems.indexOf(result[r][this.parent.idMapping]) !== -1)
                    && !(haveChild && !haveChild[r])) {
                    result[r].hasChildRecords = true;
                    result[r].expanded = false;
                }
                datas.splice(inx + r + 1, 0, result[r]);
            }
            setValue('result', datas, e);
            setValue('action', 'beforecontentrender', e);
            this.parent.trigger(actionComplete, e);
            hideSpinner(this.parent.element);
            if (this.parent.grid.aggregates.length > 0 && !this.parent.enableVirtualization) {
                let gridQuery = getObject('query', e);
                let result = 'result';
                if (isNullOrUndefined(gridQuery)) {
                    gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
                }
                if (!isNullOrUndefined(gridQuery)) {
                    let summaryQuery = gridQuery.queries.filter((q) => q.fn === 'onAggregates');
                    e[result] = this.parent.summaryModule.calculateSummaryValue(summaryQuery, e[result], true);
                }
            }
            e.count = this.parent.grid.pageSettings.totalRecordsCount;
            let virtualArgs = {};
            if (this.parent.enableVirtualization) {
                this.remoteVirtualAction(virtualArgs);
            }
            getValue('grid.renderModule', this.parent).dataManagerSuccess(e, virtualArgs);
            this.parent.trigger(expanded, args);
        });
    }
    remoteVirtualAction(virtualArgs) {
        virtualArgs.requestType = 'refresh';
        setValue('isExpandCollapse', true, virtualArgs);
        let contentModule = getValue('grid.contentModule', this.parent);
        let currentInfo = getValue('currentInfo', contentModule);
        let prevInfo = getValue('prevInfo', contentModule);
        if (currentInfo.loadNext && this.parent.grid.pageSettings.currentPage === currentInfo.nextInfo.page) {
            this.parent.grid.pageSettings.currentPage = prevInfo.page;
        }
    }
    beginSorting() {
        this.isSortAction = true;
    }
    createRecords(data, parentRecords) {
        let treeGridData = [];
        for (let i = 0, len = Object.keys(data).length; i < len; i++) {
            let currentData = extend({}, data[i]);
            currentData.taskData = data[i];
            let level = 0;
            this.storedIndex++;
            if (!currentData.hasOwnProperty('index')) {
                currentData.index = this.storedIndex;
            }
            if (!isNullOrUndefined(currentData[this.parent.childMapping]) ||
                (currentData[this.parent.hasChildMapping] && isCountRequired(this.parent))) {
                currentData.hasChildRecords = true;
                if (this.parent.enableCollapseAll || !isNullOrUndefined(this.parent.dataStateChange)
                    && isNullOrUndefined(currentData[this.parent.childMapping])) {
                    currentData.expanded = false;
                }
                else {
                    currentData.expanded = !isNullOrUndefined(currentData[this.parent.expandStateMapping])
                        ? currentData[this.parent.expandStateMapping] : true;
                }
            }
            if (!currentData.hasOwnProperty('index')) {
                currentData.index = currentData.hasChildRecords ? this.storedIndex : this.storedIndex;
            }
            if (this.isSelfReference && isNullOrUndefined(currentData[this.parent.parentIdMapping])) {
                this.parent.parentData.push(currentData);
            }
            currentData.uniqueID = getUid(this.parent.element.id + '_data_');
            setValue('uniqueIDCollection.' + currentData.uniqueID, currentData, this.parent);
            if (!isNullOrUndefined(parentRecords)) {
                let parentData = extend({}, parentRecords);
                delete parentData.childRecords;
                delete parentData[this.parent.childMapping];
                if (this.isSelfReference) {
                    delete parentData.taskData[this.parent.childMapping];
                }
                currentData.parentItem = parentData;
                currentData.parentUniqueID = parentData.uniqueID;
                level = parentRecords.level + 1;
            }
            if (!currentData.hasOwnProperty('level')) {
                currentData.level = level;
            }
            currentData.checkboxState = 'uncheck';
            if (isNullOrUndefined(currentData[this.parent.parentIdMapping]) || currentData.parentItem) {
                this.parent.flatData.push(currentData);
            }
            if (!this.isSelfReference && currentData.level === 0) {
                this.parent.parentData.push(currentData);
            }
            if (!isNullOrUndefined(currentData[this.parent.childMapping] && currentData[this.parent.childMapping].length)) {
                let record = this.createRecords(currentData[this.parent.childMapping], currentData);
                currentData.childRecords = record;
            }
            treeGridData.push(currentData);
        }
        return treeGridData;
    }
    /**
     * Function to perform filtering/sorting action for local data
     * @hidden
     */
    dataProcessor(args) {
        let isExport = getObject('isExport', args);
        let expresults = getObject('expresults', args);
        let exportType = getObject('exportType', args);
        let isPrinting = getObject('isPrinting', args);
        let dataObj;
        let actionArgs = getObject('actionArgs', args);
        let requestType = getObject('requestType', args);
        let actionData = getObject('data', args);
        let action = getObject('action', args);
        let actionAddArgs = actionArgs;
        let primaryKeyColumnName = this.parent.getPrimaryKeyFieldNames()[0];
        let dataValue = getObject('data', actionAddArgs);
        if ((!isNullOrUndefined(actionAddArgs)) && (!isNullOrUndefined(actionAddArgs.action)) && (actionAddArgs.action === 'add')
            && (!isNullOrUndefined(actionAddArgs.data)) && isNullOrUndefined(actionAddArgs.data[primaryKeyColumnName])) {
            actionAddArgs.data[primaryKeyColumnName] = args.result[actionAddArgs.index][primaryKeyColumnName];
            dataValue.taskData[primaryKeyColumnName] = args.result[actionAddArgs.index][primaryKeyColumnName];
        }
        if ((!isNullOrUndefined(actionArgs) && Object.keys(actionArgs).length) || requestType === 'save') {
            requestType = requestType ? requestType : actionArgs.requestType;
            actionData = actionData ? actionData : getObject('data', actionArgs);
            action = action ? action : getObject('action', actionArgs);
            if (this.parent.editSettings.mode === 'Batch') {
                this.batchChanges = this.parent.grid.editModule.getBatchChanges();
            }
            if (this.parent.isLocalData) {
                this.updateAction(actionData, action, requestType);
            }
        }
        if (isExport && !isNullOrUndefined(expresults)) {
            dataObj = expresults;
        }
        else {
            dataObj = isCountRequired(this.parent) ? getValue('result', this.parent.grid.dataSource)
                : this.parent.grid.dataSource;
        }
        let results = dataObj instanceof DataManager ? dataObj.dataSource.json : dataObj;
        let count = isCountRequired(this.parent) ? getValue('count', this.parent.dataSource)
            : results.length;
        if ((this.parent.grid.allowFiltering && this.parent.grid.filterSettings.columns.length) ||
            (this.parent.grid.searchSettings.key.length > 0)) {
            let qry = new Query();
            let gridQuery = getObject('query', args);
            if (isNullOrUndefined(gridQuery)) {
                gridQuery = new Query();
                gridQuery = getValue('grid.renderModule.data', this.parent).filterQuery(gridQuery);
                gridQuery = getValue('grid.renderModule.data', this.parent).searchQuery(gridQuery);
            }
            let fltrQuery = gridQuery.queries.filter((q) => q.fn === 'onWhere');
            let srchQuery = gridQuery.queries.filter((q) => q.fn === 'onSearch');
            qry.queries = fltrQuery.concat(srchQuery);
            let filteredData = new DataManager(results).executeLocal(qry);
            this.parent.notify('updateFilterRecs', { data: filteredData });
            results = this.dataResults.result;
            this.dataResults.result = null;
            if (this.parent.grid.aggregates.length > 0) {
                let query = getObject('query', args);
                if (isNullOrUndefined(gridQuery)) {
                    gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
                }
                if (!isNullOrUndefined(query)) {
                    let summaryQuery = query.queries.filter((q) => q.fn === 'onAggregates');
                    results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, results, true);
                }
            }
        }
        if (this.parent.grid.aggregates.length && this.parent.grid.sortSettings.columns.length === 0
            && this.parent.grid.filterSettings.columns.length === 0 && !this.parent.grid.searchSettings.key.length) {
            let gridQuery = getObject('query', args);
            if (isNullOrUndefined(gridQuery)) {
                gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
            }
            let summaryQuery = gridQuery.queries.filter((q) => q.fn === 'onAggregates');
            results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.parent.flatData, true);
        }
        if (this.parent.grid.sortSettings.columns.length > 0 || this.isSortAction) {
            this.isSortAction = false;
            let parentData;
            parentData = this.parent.parentData;
            let query = getObject('query', args);
            let srtQry = new Query();
            for (let srt = this.parent.grid.sortSettings.columns.length - 1; srt >= 0; srt--) {
                let col = this.parent.grid.getColumnByField(this.parent.grid.sortSettings.columns[srt].field);
                let compFun = col.sortComparer && isOffline(this.parent) ?
                    col.sortComparer.bind(col) :
                    this.parent.grid.sortSettings.columns[srt].direction;
                srtQry.sortBy(this.parent.grid.sortSettings.columns[srt].field, compFun);
            }
            let modifiedData = new DataManager(parentData).executeLocal(srtQry);
            let sortArgs = { modifiedData: modifiedData, filteredData: results, srtQry: srtQry };
            this.parent.notify('createSort', sortArgs);
            results = sortArgs.modifiedData;
            this.dataResults.result = null;
            this.sortedData = results;
            this.parent.notify('updateModel', {});
            if (this.parent.grid.aggregates.length > 0 && !isNullOrUndefined(query)) {
                let isSort = false;
                let query = getObject('query', args);
                let summaryQuery = query.queries.filter((q) => q.fn === 'onAggregates');
                results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.sortedData, isSort);
            }
        }
        count = isCountRequired(this.parent) ? getValue('count', this.parent.dataSource)
            : results.length;
        let temp = this.paging(results, count, isExport, isPrinting, exportType, args);
        results = temp.result;
        count = temp.count;
        args.result = results;
        args.count = count;
        this.parent.notify('updateResults', args);
    }
    paging(results, count, isExport, isPrinting, exportType, args) {
        if (this.parent.allowPaging && (!isExport || exportType === 'CurrentPage')
            && (!isPrinting || this.parent.printMode === 'CurrentPage')) {
            this.parent.notify(pagingActions, { result: results, count: count });
            results = this.dataResults.result;
            count = isCountRequired(this.parent) ? getValue('count', this.parent.dataSource)
                : this.dataResults.count;
        }
        else if (this.parent.enableVirtualization && (!isExport || exportType === 'CurrentPage')
            && getValue('requestType', args) !== 'save') {
            this.parent.notify(pagingActions, { result: results, count: count, actionArgs: getValue('actionArgs', args) });
            results = this.dataResults.result;
            count = this.dataResults.count;
        }
        if (isPrinting === true && this.parent.printMode === 'AllPages') {
            let actualResults = [];
            for (let i = 0; i < results.length; i++) {
                actualResults.push(results[i]);
                if (results[i].expanded === false) {
                    i += findChildrenRecords(results[i]).length;
                }
            }
            results = actualResults;
            count = results.length;
        }
        let value = { result: results, count: count };
        return value;
    }
    /**
     * update for datasource
     */
    updateData(dataResult) {
        this.dataResults = dataResult;
    }
    updateAction(actionData, action, requestType) {
        if ((requestType === 'delete' || requestType === 'save')) {
            this.parent.notify(crudAction, { value: actionData, action: action || requestType });
        }
        if (requestType === 'batchsave' && this.parent.editSettings.mode === 'Batch') {
            this.parent.notify(batchSave, {});
        }
    }
}

/**
 * Defines Predefined toolbar items.
 * @hidden
 */
var ToolbarItem;
(function (ToolbarItem) {
    ToolbarItem[ToolbarItem["Add"] = 0] = "Add";
    ToolbarItem[ToolbarItem["Edit"] = 1] = "Edit";
    ToolbarItem[ToolbarItem["Update"] = 2] = "Update";
    ToolbarItem[ToolbarItem["Delete"] = 3] = "Delete";
    ToolbarItem[ToolbarItem["Cancel"] = 4] = "Cancel";
    ToolbarItem[ToolbarItem["Search"] = 5] = "Search";
    ToolbarItem[ToolbarItem["ExpandAll"] = 6] = "ExpandAll";
    ToolbarItem[ToolbarItem["CollapseAll"] = 7] = "CollapseAll";
    ToolbarItem[ToolbarItem["ExcelExport"] = 8] = "ExcelExport";
    ToolbarItem[ToolbarItem["PdfExport"] = 9] = "PdfExport";
    ToolbarItem[ToolbarItem["CsvExport"] = 10] = "CsvExport";
    ToolbarItem[ToolbarItem["Print"] = 11] = "Print";
    ToolbarItem[ToolbarItem["RowIndent"] = 12] = "RowIndent";
    ToolbarItem[ToolbarItem["RowOutdent"] = 13] = "RowOutdent";
})(ToolbarItem || (ToolbarItem = {}));
/**
 * Defines predefined contextmenu items.
 * @hidden
 */
var ContextMenuItems;
(function (ContextMenuItems) {
    ContextMenuItems[ContextMenuItems["AutoFit"] = 0] = "AutoFit";
    ContextMenuItems[ContextMenuItems["AutoFitAll"] = 1] = "AutoFitAll";
    ContextMenuItems[ContextMenuItems["SortAscending"] = 2] = "SortAscending";
    ContextMenuItems[ContextMenuItems["SortDescending"] = 3] = "SortDescending";
    ContextMenuItems[ContextMenuItems["Edit"] = 4] = "Edit";
    ContextMenuItems[ContextMenuItems["Delete"] = 5] = "Delete";
    ContextMenuItems[ContextMenuItems["Save"] = 6] = "Save";
    ContextMenuItems[ContextMenuItems["Cancel"] = 7] = "Cancel";
    ContextMenuItems[ContextMenuItems["PdfExport"] = 8] = "PdfExport";
    ContextMenuItems[ContextMenuItems["ExcelExport"] = 9] = "ExcelExport";
    ContextMenuItems[ContextMenuItems["CsvExport"] = 10] = "CsvExport";
    ContextMenuItems[ContextMenuItems["FirstPage"] = 11] = "FirstPage";
    ContextMenuItems[ContextMenuItems["PrevPage"] = 12] = "PrevPage";
    ContextMenuItems[ContextMenuItems["LastPage"] = 13] = "LastPage";
    ContextMenuItems[ContextMenuItems["NextPage"] = 14] = "NextPage";
    ContextMenuItems[ContextMenuItems["AddRow"] = 15] = "AddRow";
})(ContextMenuItems || (ContextMenuItems = {}));

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the paging behavior of the TreeGrid.
 */
class PageSettings extends ChildProperty {
}
__decorate$5([
    Property(12)
], PageSettings.prototype, "pageSize", void 0);
__decorate$5([
    Property(8)
], PageSettings.prototype, "pageCount", void 0);
__decorate$5([
    Property(1)
], PageSettings.prototype, "currentPage", void 0);
__decorate$5([
    Property()
], PageSettings.prototype, "totalRecordsCount", void 0);
__decorate$5([
    Property(false)
], PageSettings.prototype, "enableQueryString", void 0);
__decorate$5([
    Property(false)
], PageSettings.prototype, "pageSizes", void 0);
__decorate$5([
    Property(null)
], PageSettings.prototype, "template", void 0);
__decorate$5([
    Property('All')
], PageSettings.prototype, "pageSizeMode", void 0);

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the TreeGrid's aggregate column.
 */
class AggregateColumn extends ChildProperty {
    constructor() {
        super(...arguments);
        this.intl = new Internationalization();
        this.templateFn = {};
    }
    /**
     * @hidden
     */
    setFormatter(cultureName) {
        if (this.format && (this.format.skeleton || this.format.format)) {
            this.formatFn = this.getFormatFunction(this.format);
        }
    }
    /**
     * @hidden
     */
    getFormatFunction(format) {
        if (format.type) {
            return this.intl.getDateFormat(format);
        }
        else {
            return this.intl.getNumberFormat(format);
        }
    }
    /**
     * @hidden
     */
    getFormatter() {
        return this.formatFn;
    }
    /**
     * @hidden
     */
    setTemplate(helper = {}) {
        if (this.footerTemplate !== undefined) {
            this.templateFn[getEnumValue(CellType, CellType.Summary)] = { fn: compile(this.footerTemplate, helper),
                property: 'footerTemplate' };
        }
    }
    /**
     * @hidden
     */
    getTemplate(type) {
        return this.templateFn[getEnumValue(CellType, type)];
    }
    /**
     * @hidden
     */
    setPropertiesSilent(prop) {
        this.setProperties(prop, true);
    }
}
__decorate$6([
    Property()
], AggregateColumn.prototype, "type", void 0);
__decorate$6([
    Property()
], AggregateColumn.prototype, "footerTemplate", void 0);
__decorate$6([
    Property()
], AggregateColumn.prototype, "field", void 0);
__decorate$6([
    Property()
], AggregateColumn.prototype, "format", void 0);
__decorate$6([
    Property()
], AggregateColumn.prototype, "columnName", void 0);
__decorate$6([
    Property()
], AggregateColumn.prototype, "customAggregate", void 0);
class AggregateRow extends ChildProperty {
}
__decorate$6([
    Collection([], AggregateColumn)
], AggregateRow.prototype, "columns", void 0);
__decorate$6([
    Property(true)
], AggregateRow.prototype, "showChildSummary", void 0);

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the edit behavior of the TreeGrid.
 */
class EditSettings extends ChildProperty {
}
__decorate$7([
    Property(false)
], EditSettings.prototype, "allowAdding", void 0);
__decorate$7([
    Property(false)
], EditSettings.prototype, "allowEditing", void 0);
__decorate$7([
    Property(false)
], EditSettings.prototype, "allowDeleting", void 0);
__decorate$7([
    Property('Cell')
], EditSettings.prototype, "mode", void 0);
__decorate$7([
    Property('Top')
], EditSettings.prototype, "newRowPosition", void 0);
__decorate$7([
    Property(true)
], EditSettings.prototype, "allowEditOnDblClick", void 0);
__decorate$7([
    Property(true)
], EditSettings.prototype, "showConfirmDialog", void 0);
__decorate$7([
    Property(false)
], EditSettings.prototype, "showDeleteConfirmDialog", void 0);
__decorate$7([
    Property('')
], EditSettings.prototype, "template", void 0);
__decorate$7([
    Property({})
], EditSettings.prototype, "dialog", void 0);

var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the field name and direction of sort column.
 */
class SortDescriptor extends ChildProperty {
}
__decorate$8([
    Property()
], SortDescriptor.prototype, "field", void 0);
__decorate$8([
    Property()
], SortDescriptor.prototype, "direction", void 0);
/**
 * Configures the sorting behavior of TreeGrid.
 */
class SortSettings extends ChildProperty {
}
__decorate$8([
    Collection([], SortDescriptor)
], SortSettings.prototype, "columns", void 0);
__decorate$8([
    Property(true)
], SortSettings.prototype, "allowUnsort", void 0);

function editAction(details, control, isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord) {
    let value = details.value;
    let action = details.action;
    let changedRecords = 'changedRecords';
    let i;
    let j;
    let addedRecords = 'addedRecords';
    let batchChanges;
    let key = control.grid.getPrimaryKeyFieldNames()[0];
    let treeData = control.dataSource instanceof DataManager ?
        control.dataSource.dataSource.json : control.dataSource;
    let modifiedData = [];
    let originalData = value;
    let isSkip = false;
    if (control.editSettings.mode === 'Batch') {
        batchChanges = control.grid.editModule.getBatchChanges();
    }
    if (action === 'add' || (action === 'batchsave' && (control.editSettings.mode === 'Batch'
        && batchChanges[addedRecords].length))) {
        let addAct = addAction(details, treeData, control, isSelfReference, addRowIndex, selectedIndex, addRowRecord);
        value = addAct.value;
        isSkip = addAct.isSkip;
    }
    if (value instanceof Array) {
        modifiedData = extendArray(value);
    }
    else {
        modifiedData.push(extend({}, value));
    }
    if (!isSkip && (action !== 'add' ||
        (control.editSettings.newRowPosition !== 'Top' && control.editSettings.newRowPosition !== 'Bottom'))) {
        for (let k = 0; k < modifiedData.length; k++) {
            if (typeof (modifiedData[k][key]) === 'object') {
                modifiedData[k] = modifiedData[k][key];
            }
            let keys = modifiedData[k].taskData ? Object.keys(modifiedData[k].taskData) :
                Object.keys(modifiedData[k]);
            i = treeData.length;
            while (i-- && i >= 0) {
                if (treeData[i][key] === modifiedData[k][key]) {
                    if (action === 'delete') {
                        let currentData = treeData[i];
                        treeData.splice(i, 1);
                        if (isSelfReference) {
                            if (!isNullOrUndefined(currentData[control.parentIdMapping])) {
                                let parentData = control.flatData.filter((e) => e[control.idMapping] === currentData[control.parentIdMapping])[0];
                                let childRecords = parentData ? parentData[control.childMapping] : [];
                                for (let p = childRecords.length - 1; p >= 0; p--) {
                                    if (childRecords[p][control.idMapping] === currentData[control.idMapping]) {
                                        childRecords.splice(p, 1);
                                        if (!childRecords.length) {
                                            parentData.hasChildRecords = false;
                                            updateParentRow(key, parentData, action, control, isSelfReference);
                                        }
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    else {
                        if (action === 'edit') {
                            for (j = 0; j < keys.length; j++) {
                                if (treeData[i].hasOwnProperty(keys[j]) && ((control.editSettings.mode !== 'Cell'
                                    || (!isNullOrUndefined(batchChanges) && batchChanges[changedRecords].length === 0))
                                    || keys[j] === columnName)) {
                                    let editedData = getParentData(control, modifiedData[k].uniqueID);
                                    treeData[i][keys[j]] = modifiedData[k][keys[j]];
                                    if (editedData && editedData.taskData) {
                                        editedData.taskData[keys[j]] = editedData[keys[j]] = treeData[i][keys[j]];
                                    }
                                }
                            }
                        }
                        else if (action === 'add' || action === 'batchsave') {
                            let index;
                            if (control.editSettings.newRowPosition === 'Child') {
                                if (isSelfReference) {
                                    originalData.taskData[control.parentIdMapping] = treeData[i][control.idMapping];
                                    treeData.splice(i + 1, 0, originalData.taskData);
                                }
                                else {
                                    if (!treeData[i].hasOwnProperty(control.childMapping)) {
                                        treeData[i][control.childMapping] = [];
                                    }
                                    treeData[i][control.childMapping].push(originalData.taskData);
                                    updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                                }
                            }
                            else if (control.editSettings.newRowPosition === 'Below') {
                                treeData.splice(i + 1, 0, originalData.taskData);
                                updateParentRow(key, treeData[i + 1], action, control, isSelfReference, originalData);
                            }
                            else if (!addRowIndex) {
                                index = 0;
                                treeData.splice(index, 0, originalData.taskData);
                            }
                            else if (control.editSettings.newRowPosition === 'Above') {
                                treeData.splice(i, 0, originalData.taskData);
                                updateParentRow(key, treeData[i], action, control, isSelfReference, originalData);
                            }
                        }
                        break;
                    }
                }
                else if (!isNullOrUndefined(treeData[i][control.childMapping])) {
                    if (removeChildRecords(treeData[i][control.childMapping], modifiedData[k], action, key, control, isSelfReference, originalData, columnName)) {
                        updateParentRow(key, treeData[i], action, control, isSelfReference);
                    }
                }
            }
        }
    }
}
function addAction(details, treeData, control, isSelfReference, addRowIndex, selectedIndex, addRowRecord) {
    let value;
    let isSkip = false;
    let currentViewRecords = control.grid.getCurrentViewRecords();
    value = extend({}, details.value);
    value = getPlainData(value);
    switch (control.editSettings.newRowPosition) {
        case 'Top':
            treeData.unshift(value);
            isSkip = true;
            break;
        case 'Bottom':
            treeData.push(value);
            isSkip = true;
            break;
        case 'Above':
            if (!isNullOrUndefined(addRowRecord)) {
                value = extend({}, addRowRecord);
                value = getPlainData(value);
            }
            else {
                value = extend({}, currentViewRecords[addRowIndex + 1]);
                value = getPlainData(value);
            }
            break;
        case 'Below':
        case 'Child':
            if (!isNullOrUndefined(addRowRecord)) {
                value = extend({}, addRowRecord);
                value = getPlainData(value);
            }
            else {
                let primaryKeys = control.grid.getPrimaryKeyFieldNames()[0];
                let currentdata = currentViewRecords[addRowIndex];
                if (!isNullOrUndefined(currentdata) && currentdata[primaryKeys] === details.value[primaryKeys] || selectedIndex !== -1) {
                    value = extend({}, currentdata);
                }
                else {
                    value = extend({}, details.value);
                }
                value = getPlainData(value);
            }
            if (selectedIndex === -1) {
                treeData.unshift(value);
                isSkip = true;
            }
    }
    return { value: value, isSkip: isSkip };
}
function removeChildRecords(childRecords, modifiedData, action, key, control, isSelfReference, originalData, columnName) {
    let isChildAll = false;
    let j = childRecords.length;
    while (j-- && j >= 0) {
        if (childRecords[j][key] === modifiedData[key] ||
            (isSelfReference && childRecords[j][control.parentIdMapping] === modifiedData[control.idMapping])) {
            if (action === 'edit') {
                let keys = Object.keys(modifiedData);
                let editedData = getParentData(control, modifiedData.uniqueID);
                for (let i = 0; i < keys.length; i++) {
                    if (childRecords[j].hasOwnProperty(keys[i]) && (control.editSettings.mode !== 'Cell' || keys[i] === columnName)) {
                        editedData[keys[i]] = editedData.taskData[keys[i]] = childRecords[j][keys[i]] = modifiedData[keys[i]];
                        if (control.grid.editSettings.mode === 'Normal' && control.editSettings.mode === 'Cell') {
                            let editModule = 'editModule';
                            control.grid.editModule[editModule].editRowIndex = modifiedData.index;
                            control.grid.editModule[editModule].updateCurrentViewData(modifiedData);
                        }
                    }
                }
                break;
            }
            else if (action === 'add' || action === 'batchsave') {
                if (control.editSettings.newRowPosition === 'Child') {
                    if (isSelfReference) {
                        originalData[control.parentIdMapping] = childRecords[j][control.idMapping];
                        childRecords.splice(j + 1, 0, originalData);
                        updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                    }
                    else {
                        if (!childRecords[j].hasOwnProperty(control.childMapping)) {
                            childRecords[j][control.childMapping] = [];
                        }
                        childRecords[j][control.childMapping].push(originalData.taskData);
                        updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                    }
                }
                else if (control.editSettings.newRowPosition === 'Above') {
                    childRecords.splice(j, 0, originalData.taskData);
                    updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                }
                else if (control.editSettings.newRowPosition === 'Below') {
                    childRecords.splice(j + 1, 0, originalData.taskData);
                    updateParentRow(key, childRecords[j], action, control, isSelfReference, originalData);
                }
            }
            else {
                let parentItem = childRecords[j].parentItem;
                childRecords.splice(j, 1);
                if (!childRecords.length) {
                    isChildAll = true;
                }
            }
        }
        else if (!isNullOrUndefined(childRecords[j][control.childMapping])) {
            if (removeChildRecords(childRecords[j][control.childMapping], modifiedData, action, key, control, isSelfReference, originalData, columnName)) {
                updateParentRow(key, childRecords[j], action, control, isSelfReference);
            }
        }
    }
    return isChildAll;
}
function updateParentRow(key, record, action, control, isSelfReference, child) {
    if ((control.editSettings.newRowPosition === 'Above' || control.editSettings.newRowPosition === 'Below')
        && ((action === 'add' || action === 'batchsave')) && !isNullOrUndefined(child.parentItem)) {
        let parentData = getParentData(control, child.parentItem.uniqueID);
        parentData.childRecords.push(child);
    }
    else {
        let currentRecords = control.grid.getCurrentViewRecords();
        let index;
        currentRecords.map((e, i) => { if (e[key] === record[key]) {
            index = i;
            return;
        } });
        if (!isNullOrUndefined(index)) {
            record = currentRecords[index];
        }
        if (control.enableVirtualization && isNullOrUndefined(record) && !isNullOrUndefined(child)) {
            record = getValue('uniqueIDCollection.' + child.parentUniqueID, control);
        }
        record.hasChildRecords = false;
        if (action === 'add' || action === 'batchsave') {
            record.expanded = true;
            record.hasChildRecords = true;
            if (control.sortSettings.columns.length && isNullOrUndefined(child)) {
                child = currentRecords.filter((e) => {
                    if (e.parentUniqueID === record.uniqueID) {
                        return e;
                    }
                    else {
                        return null;
                    }
                });
            }
            let childRecords = child ? child instanceof Array ? child[0] : child : currentRecords[index + 1];
            if (control.editSettings.newRowPosition !== 'Below') {
                if (!record.hasOwnProperty('childRecords')) {
                    record.childRecords = [];
                }
                else {
                    if (!isNullOrUndefined(child) && record[key] !== child[key]) {
                        record.childRecords.push(child);
                    }
                }
                if (record.childRecords.indexOf(childRecords) === -1 && record[key] !== child[key]) {
                    record.childRecords.unshift(childRecords);
                }
                if (isSelfReference) {
                    if (!record.hasOwnProperty(control.childMapping)) {
                        record[control.childMapping] = [];
                    }
                    if (record[control.childMapping].indexOf(childRecords) === -1 && record[key] !== child[key]) {
                        record[control.childMapping].unshift(childRecords);
                    }
                }
            }
        }
        let primaryKeys = control.grid.getPrimaryKeyFieldNames()[0];
        let data = control.grid.dataSource instanceof DataManager ?
            control.grid.dataSource.dataSource.json : control.grid.dataSource;
        for (let i = 0; i < data.length; i++) {
            if (data[i][primaryKeys] === record[primaryKeys]) {
                data[i] = record;
                break;
            }
        }
        control.grid.setRowData(key, record);
        let row = control.getRowByIndex(index);
        if (control.editSettings.mode === 'Batch') {
            row = control.getRows()[control.grid.getRowIndexByPrimaryKey(record[key])];
        }
        let movableRow;
        if (control.frozenRows || control.getFrozenColumns()) {
            movableRow = control.getMovableRowByIndex(index);
        }
        if (!control.enableVirtualization && !isNullOrUndefined(row) || !isNullOrUndefined(movableRow)) {
            let index = control.treeColumnIndex;
            if (control.allowRowDragAndDrop && control.enableImmutableMode) {
                index = index + 1;
            }
            control.renderModule.cellRender({
                data: record, cell: row.cells[index] ? row.cells[index]
                    : movableRow.cells[index - control.frozenColumns],
                column: control.grid.getColumns()[control.treeColumnIndex],
                requestType: action
            });
        }
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TreeGrid_1;
/**
 * Represents the TreeGrid component.
 * ```html
 * <div id='treegrid'></div>
 * <script>
 *  var treegridObj = new TreeGrid({ allowPaging: true });
 *  treegridObj.appendTo('#treegrid');
 * </script>
 * ```
 */
let TreeGrid = TreeGrid_1 = class TreeGrid extends Component {
    constructor(options, element) {
        super(options, element);
        this.dataResults = {};
        this.uniqueIDCollection = {};
        this.uniqueIDFilterCollection = {};
        this.changedRecords = 'changedRecords';
        this.deletedRecords = 'deletedRecords';
        this.addedRecords = 'addedRecords';
        TreeGrid_1.Inject(Selection);
        setValue('mergePersistData', this.mergePersistTreeGridData, this);
        let logger = 'Logger';
        if (!isNullOrUndefined(this.injectedModules[logger])) {
            Grid.Inject(Logger);
        }
        this.grid = new Grid();
    }
    /**
     * Export TreeGrid data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    excelExport(excelExportProperties, isMultipleExport, 
    /* tslint:disable-next-line:no-any */
    workbook, isBlob) {
        if (isBlazor()) {
            this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, false);
            return null;
        }
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, false);
    }
    /**
     * Export TreeGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    csvExport(excelExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, workbook, isBlob) {
        if (isBlazor()) {
            this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, true);
            return null;
        }
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, true);
    }
    /**
     * Export TreeGrid data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    pdfExport(pdfExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, pdfDoc, isBlob) {
        if (isBlazor()) {
            this.pdfExportModule.Map(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
            return null;
        }
        return this.pdfExportModule.Map(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'treegrid';
    }
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    preRender() {
        this.TreeGridLocale();
        this.initProperties();
        this.defaultLocale = {
            Above: 'Above',
            Below: 'Below',
            AddRow: 'Add Row',
            ExpandAll: 'Expand All',
            CollapseAll: 'Collapse All',
            RowIndent: 'Indent',
            RowOutdent: 'Outdent'
        };
        this.l10n = new L10n('treegrid', this.defaultLocale, this.locale);
        if (this.isSelfReference && isNullOrUndefined(this.childMapping)) {
            this.childMapping = 'Children';
        }
    }
    /**
     * Sorts a column with the given options.
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @return {void}
     */
    sortByColumn(columnName, direction, isMultiSort) {
        this.sortModule.sortColumn(columnName, direction, isMultiSort);
    }
    /**
     * Clears all the sorted columns of the TreeGrid.
     * @return {void}
     */
    clearSorting() {
        if (this.sortModule) {
            this.sortModule.clearSorting();
        }
    }
    /**
     * Remove sorted column by field name.
     * @param {string} field - Defines the column field name to remove sort.
     * @return {void}
     * @hidden
     */
    removeSortColumn(field) {
        this.sortModule.removeSortColumn(field);
    }
    /**
     * Searches TreeGrid records using the given key.
     * You can customize the default search option by using the
     * [`searchSettings`](./#searchsettings/).
     * @param  {string} searchString - Defines the key.
     * @return {void}
     */
    search(searchString) {
        this.grid.search(searchString);
    }
    /**
     * Changes the column width to automatically fit its content to ensure that the width shows the content without wrapping/hiding.
     * > * This method ignores the hidden columns.
     * > * Uses the `autoFitColumns` method in the `dataBound` event to resize at initial rendering.
     * @param  {string |string[]} fieldNames - Defines the column names.
     * @return {void}
     *
     *
     *
     */
    autoFitColumns(fieldNames) {
        this.resizeModule.autoFitColumns(fieldNames);
        this.updateColumnModel();
    }
    /**
     * Changes the TreeGrid column positions by field names.
     * @param  {string} fromFName - Defines the origin field name.
     * @param  {string} toFName - Defines the destination field name.
     * @return {void}
     */
    reorderColumns(fromFName, toFName) {
        this.grid.reorderColumns(fromFName, toFName);
    }
    TreeGridLocale() {
        /* tslint:disable-next-line:no-any */
        let locale = L10n.locale;
        let localeObject;
        localeObject = {};
        setValue(this.locale, {}, localeObject);
        let gridLocale;
        gridLocale = {};
        gridLocale = getObject(this.locale, locale);
        let treeGridLocale;
        treeGridLocale = {};
        treeGridLocale = getObject(this.getModuleName(), gridLocale);
        setValue('grid', treeGridLocale, getObject(this.locale, localeObject));
        L10n.load(localeObject);
    }
    /**
     * By default, prints all the pages of the TreeGrid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./#printmode).
     * @return {void}
     */
    print() {
        this.printModule.print();
    }
    treeGridkeyActionHandler(e) {
        if (this.allowKeyboard) {
            switch (e.action) {
                case 'ctrlDownArrow':
                    this.expandAll();
                    break;
                case 'ctrlUpArrow':
                    this.collapseAll();
                    break;
                case 'ctrlShiftUpArrow':
                    let collapsetarget = e.target;
                    let collapsecolumn = collapsetarget.closest('.e-rowcell');
                    let collapserow = collapsecolumn.closest('tr');
                    let collapseRow = collapserow.querySelector('.e-treegridexpand');
                    if (collapseRow !== null && collapseRow !== undefined) {
                        this.expandCollapseRequest(collapserow.querySelector('.e-treegridexpand'));
                    }
                    break;
                case 'ctrlShiftDownArrow':
                    let expandtarget = e.target;
                    let expandcolumn = expandtarget.closest('.e-rowcell');
                    let expandrow = expandcolumn.closest('tr');
                    let expandRow = expandrow.querySelector('.e-treegridcollapse');
                    if (expandRow !== null && expandRow !== undefined) {
                        this.expandCollapseRequest(expandrow.querySelector('.e-treegridcollapse'));
                    }
                    break;
                case 'downArrow':
                    let target = e.target.parentElement;
                    let summaryElement = this.findnextRowElement(target);
                    if (summaryElement !== null) {
                        let rowIndex = summaryElement.rowIndex;
                        this.selectRow(rowIndex);
                        let cellIndex = e.target.cellIndex;
                        let row = summaryElement.children[cellIndex];
                        addClass([row], 'e-focused');
                        addClass([row], 'e-focus');
                    }
                    else {
                        this.clearSelection();
                    }
                    break;
                case 'upArrow':
                    let targetRow = e.target.parentElement;
                    let summaryRowElement = this.findPreviousRowElement(targetRow);
                    if (summaryRowElement !== null) {
                        let rIndex = summaryRowElement.rowIndex;
                        this.selectRow(rIndex);
                        let cIndex = e.target.cellIndex;
                        let rows = summaryRowElement.children[cIndex];
                        addClass([rows], 'e-focused');
                        addClass([rows], 'e-focus');
                    }
                    else {
                        this.clearSelection();
                    }
            }
        }
    }
    // Get Proper Row Element from the summary 
    findnextRowElement(summaryRowElement) {
        let rowElement = summaryRowElement.nextElementSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
            rowElement.style.display === 'none')) {
            rowElement = this.findnextRowElement(rowElement);
        }
        return rowElement;
    }
    // Get Proper Row Element from the summary 
    findPreviousRowElement(summaryRowElement) {
        let rowElement = summaryRowElement.previousElementSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
            rowElement.style.display === 'none')) {
            rowElement = this.findPreviousRowElement(rowElement);
        }
        return rowElement;
    }
    initProperties() {
        this.defaultLocale = {};
        this.flatData = [];
        this.parentData = [];
        this.columnModel = [];
        this.isExpandAll = false;
        this.isCollapseAll = false;
        this.keyConfigs = {
            ctrlDownArrow: 'ctrl+downarrow',
            ctrlUpArrow: 'ctrl+uparrow',
            ctrlShiftUpArrow: 'ctrl+shift+uparrow',
            ctrlShiftDownArrow: 'ctrl+shift+downarrow',
            downArrow: 'downArrow',
            upArrow: 'upArrow'
        };
        this.isLocalData = (!(this.dataSource instanceof DataManager) || this.dataSource.dataSource.offline
            || (!isNullOrUndefined(this.dataSource.ready)) || this.dataSource.adaptor instanceof RemoteSaveAdaptor);
        this.isSelfReference = !isNullOrUndefined(this.parentIdMapping);
    }
    /**
     * Binding events to the element while component creation.
     * @hidden
     */
    wireEvents() {
        EventHandler.add(this.grid.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.treeGridkeyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
        if (this.allowKeyboard) {
            this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
        }
    }
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        let modules = [];
        if (this.isDestroyed) {
            return modules;
        }
        modules.push({
            member: 'filter', args: [this, this.filterSettings]
        });
        if (!isNullOrUndefined(this.toolbar)) {
            modules.push({
                member: 'toolbar',
                args: [this]
            });
        }
        if (this.contextMenuItems) {
            modules.push({
                member: 'contextMenu',
                args: [this]
            });
        }
        if (this.allowPaging) {
            modules.push({
                member: 'pager',
                args: [this, this.pageSettings]
            });
        }
        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this]
            });
        }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this]
            });
        }
        if (this.aggregates.length > 0) {
            modules.push({
                member: 'summary', args: [this]
            });
        }
        modules.push({
            member: 'resize', args: [this]
        });
        if (this.allowExcelExport) {
            modules.push({
                member: 'ExcelExport', args: [this]
            });
        }
        if (this.frozenColumns || this.frozenRows || this.getFrozenColumns()) {
            modules.push({
                member: 'freeze', args: [this]
            });
        }
        if (this.detailTemplate) {
            modules.push({
                member: 'detailRow', args: [this]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport', args: [this]
            });
        }
        if (this.showColumnMenu) {
            modules.push({
                member: 'columnMenu', args: [this]
            });
        }
        if (this.showColumnChooser) {
            modules.push({
                member: 'ColumnChooser', args: [this]
            });
        }
        this.extendRequiredModules(modules);
        return modules;
    }
    extendRequiredModules(modules) {
        if (this.allowRowDragAndDrop) {
            modules.push({
                member: 'rowDragAndDrop',
                args: [this]
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing) {
            modules.push({
                member: 'edit',
                args: [this]
            });
        }
        if (this.isCommandColumn(this.columns)) {
            modules.push({
                member: 'commandColumn',
                args: [this]
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this]
            });
        }
        if (this.enableVirtualization) {
            modules.push({
                member: 'virtualScroll',
                args: [this]
            });
        }
        modules.push({
            member: 'logger',
            args: [this.grid]
        });
    }
    isCommandColumn(columns) {
        return columns.some((col) => {
            if (col.columns) {
                return this.isCommandColumn(col.columns);
            }
            return !!(col.commands || col.commandsTemplate);
        });
    }
    /**
     * Unbinding events from the element while component destroy.
     * @hidden
     */
    unwireEvents() {
        if (this.grid && this.grid.element) {
            EventHandler.remove(this.grid.element, 'click', this.mouseClickHandler);
        }
    }
    /**
     * @hidden
     * @private
     */
    log(types, args) {
        this.loggerModule ? this.loggerModule.treeLog(types, args, this) : (() => 0)();
    }
    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    render() {
        if (this.isReact) {
            this.grid.isReact = true;
        }
        createSpinner({ target: this.element }, this.createElement);
        this.log(['mapping_fields_missing']);
        this.renderModule = new Render(this);
        this.dataModule = new DataManipulation(this);
        this.printModule = new Print$1(this);
        let clientRender = 'isClientRender';
        if (this[clientRender]) {
            this.isServerRendered = false;
        }
        this.trigger(load);
        this.autoGenerateColumns();
        this.initialRender = true;
        if (!isNullOrUndefined(this.dataSource)) {
            this.convertTreeData(this.dataSource);
        }
        if (!isBlazor() || !this.isServerRendered) {
            this.loadGrid();
            if (this.element.classList.contains('e-treegrid') && this.rowDropSettings.targetID) {
                this.grid.rowDropSettings.targetID += '_gridcontrol';
            }
            this.addListener();
            let gridContainer = createElement('div', { id: this.element.id + '_gridcontrol' });
            addClass([this.element], 'e-treegrid');
            if (!isNullOrUndefined(this.height) && typeof (this.height) === 'string' && this.height.indexOf('%') !== -1) {
                this.element.style.height = this.height;
            }
            if (!isNullOrUndefined(this.width) && typeof (this.width) === 'string' && this.width.indexOf('%') !== -1) {
                this.element.style.width = this.width;
            }
            this.element.appendChild(gridContainer);
            this.grid.appendTo(gridContainer);
            this.wireEvents();
        }
        this.renderComplete();
        let destroyTemplate = 'destroyTemplate';
        let destroyTemplateFn = this.grid[destroyTemplate];
        //tslint:disable-next-line:no-any
        this.grid[destroyTemplate] = (args, index) => {
            destroyTemplateFn.apply(this.grid);
            let portals = 'portals';
            if (!(this.isReact && isNullOrUndefined(this[portals]))) {
                this.clearTemplate(args, index);
            }
        };
        if (isBlazor() && this.isServerRendered) {
            let fn = (args) => this.gridRendered(args, fn);
            gridObserver.on('component-rendered', fn, this);
        }
    }
    afterGridRender() {
        if (!isNullOrUndefined(this.grid.clipboardModule)) {
            this.grid.clipboardModule.destroy();
        }
        this.clipboardModule = this.grid.clipboardModule = new TreeClipboard(this);
    }
    gridRendered(args, fn) {
        if (args.id === this.element.id + '_gridcontrol') {
            this.grid = args.grid;
        }
        else {
            return;
        }
        this.grid.query.queries = [];
        let isJsComponent = 'isJsComponent';
        let isHybrid = 'isHybrid';
        if (!this.isServerRendered) {
            this.grid[isJsComponent] = true;
        }
        else {
            this.grid[isHybrid] = true;
        }
        this.setBlazorGUID();
        this.setColIndex(this.grid.columns);
        this.bindGridEvents();
        let headerCheckbox = 'headerCheckbox';
        if (!isNullOrUndefined(this.selectionModule)) {
            this.grid.on('colgroup-refresh', this.selectionModule[headerCheckbox], this.selectionModule);
        }
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].uid = this.grid.columns[i].uid;
        }
        this.wireEvents();
        this.afterGridRender();
        let processModel = 'processModel';
        this.grid[processModel]();
        gridObserver.off('component-rendered', this.gridRendered);
    }
    setColIndex(columnModel, ind = 0) {
        for (let i = 0, len = columnModel.length; i < len; i++) {
            if (columnModel[i].columns) {
                columnModel[i].index = isNullOrUndefined(columnModel[i].index) ? ind :
                    columnModel[i].index;
                ind++;
                ind = this.setColIndex(columnModel[i].columns, ind);
            }
            else {
                columnModel[i].index = isNullOrUndefined(columnModel[i].index) ? ind :
                    columnModel[i].index;
                ind++;
            }
        }
        return ind;
    }
    setBlazorGUID() {
        let guid = 'guid';
        if (this.editSettings) {
            this.grid.editSettings[guid] = this.editSettings[guid];
            this.grid.editSettings.template = this.editSettings.template;
        }
        for (let i = 0; i < this.aggregates.length; i++) {
            for (let j = 0; j < this.aggregates[i].columns.length; j++) {
                this.grid.aggregates[i].columns[j][guid] = this.aggregates[i].columns[j][guid];
            }
        }
        for (let i = 0; i < this.columns.length; i++) {
            this.grid.columns[i][guid] = this.columns[i][guid];
        }
    }
    ;
    convertTreeData(data) {
        if (data instanceof Array && data.length > 0 && data[0].hasOwnProperty('level')) {
            this.flatData = isCountRequired(this) ? getValue('result', data) : data;
            this.flatData.filter((e) => {
                setValue('uniqueIDCollection.' + e.uniqueID, e, this);
                if (e.level === 0) {
                    this.parentData.push(e);
                }
            });
        }
        else {
            if (isCountRequired(this)) {
                let griddata = getValue('result', this.dataSource);
                this.dataModule.convertToFlatData(griddata);
            }
            else {
                this.dataModule.convertToFlatData(data);
            }
        }
    }
    // private getGridData(): Object {
    //   if (isRemoteData(this)) {
    //     return this.dataSource;
    //   } else if (this.isLocalData && this.dataSource instanceof DataManager) {
    //     this.dataSource.dataSource.json = this.flatData;
    //     return this.dataSource;
    //   }
    //   return this.flatData;
    // }
    bindGridProperties() {
        this.bindedDataSource();
        this.grid.enableRtl = this.enableRtl;
        this.grid.allowKeyboard = this.allowKeyboard;
        this.grid.columns = this.getGridColumns(this.columns);
        this.grid.allowExcelExport = this.allowExcelExport;
        this.grid.allowPdfExport = this.allowPdfExport;
        this.grid.query = this.query;
        this.grid.columnQueryMode = this.columnQueryMode;
        this.grid.allowPaging = this.allowPaging;
        this.grid.pageSettings = getActualProperties(this.pageSettings);
        this.grid.pagerTemplate = this.pagerTemplate;
        this.grid.showColumnMenu = this.showColumnMenu;
        this.grid.allowSorting = this.allowSorting;
        this.grid.allowFiltering = this.allowFiltering;
        this.grid.enableVirtualization = this.enableVirtualization;
        this.grid.width = this.width;
        this.grid.height = this.height;
        this.grid.enableAltRow = this.enableAltRow;
        this.grid.allowReordering = this.allowReordering;
        this.grid.allowTextWrap = this.allowTextWrap;
        this.grid.allowResizing = this.allowResizing;
        this.grid.enableHover = this.enableHover;
        this.grid.enableAutoFill = this.enableAutoFill;
        this.grid.enableImmutableMode = this.enableImmutableMode;
        this.grid.allowRowDragAndDrop = this.allowRowDragAndDrop;
        this.grid.rowDropSettings = getActualProperties(this.rowDropSettings);
        this.grid.rowHeight = this.rowHeight;
        this.grid.gridLines = this.gridLines;
        this.grid.allowSelection = this.allowSelection;
        this.grid.toolbar = getActualProperties(this.getGridToolbar());
        this.grid.toolbarTemplate = this.toolbarTemplate;
        this.grid.showColumnChooser = this.showColumnChooser;
        this.grid.filterSettings = getActualProperties(this.filterSettings);
        this.grid.selectionSettings = getActualProperties(this.selectionSettings);
        this.grid.sortSettings = getActualProperties(this.sortSettings);
        this.grid.searchSettings = getActualProperties(this.searchSettings);
        this.grid.aggregates = getActualProperties(this.aggregates);
        this.grid.textWrapSettings = getActualProperties(this.textWrapSettings);
        this.grid.printMode = getActualProperties(this.printMode);
        this.grid.locale = getActualProperties(this.locale);
        this.grid.selectedRowIndex = this.selectedRowIndex;
        this.grid.contextMenuItems = getActualProperties(this.getContextMenu());
        this.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
        this.grid.editSettings = this.getGridEditSettings();
        this.grid.rowTemplate = getActualProperties(this.rowTemplate);
        this.grid.detailTemplate = getActualProperties(this.detailTemplate);
        this.grid.frozenRows = this.frozenRows;
        this.grid.frozenColumns = this.frozenColumns;
        let templateInstance = 'templateDotnetInstance';
        this.grid[templateInstance] = this[templateInstance];
        let isJsComponent = 'isJsComponent';
        this.grid[isJsComponent] = true;
    }
    triggerEvents(args) {
        this.trigger(getObject('name', args), args);
    }
    bindGridEvents() {
        let treeGrid = this;
        this.grid.rowSelecting = (args) => {
            if (!isNullOrUndefined(args.target) && (args.target.classList.contains('e-treegridexpand')
                || args.target.classList.contains('e-treegridcollapse') || args.target.classList.contains('e-summarycell'))) {
                args.cancel = true;
                return;
            }
            this.trigger(rowSelecting, args);
        };
        this.grid.rowSelected = (args) => {
            if (!isBlazor()) {
                this.selectedRowIndex = this.grid.selectedRowIndex;
            }
            else if (isBlazor() && this.isServerRendered) {
                this.allowServerDataBinding = false;
                this.setProperties({ selectedRowIndex: this.grid.selectedRowIndex }, true);
                this.allowServerDataBinding = true;
            }
            treeGrid.notify(rowSelected, args);
            this.trigger(rowSelected, args);
        };
        this.grid.rowDeselected = (args) => {
            this.selectedRowIndex = this.grid.selectedRowIndex;
            this.trigger(rowDeselected, args);
        };
        this.grid.resizeStop = (args) => {
            this.updateColumnModel();
            this.trigger(resizeStop, args);
        };
        this.grid.excelQueryCellInfo = (args) => {
            this.notify('excelCellInfo', args);
            args = this.dataResults;
        };
        this.grid.pdfQueryCellInfo = (args) => {
            this.notify('pdfCellInfo', args);
            args = this.dataResults;
        };
        this.grid.checkBoxChange = (args) => {
            this.trigger(checkboxChange, args);
        };
        this.grid.pdfExportComplete = this.triggerEvents.bind(this);
        this.grid.excelExportComplete = this.triggerEvents.bind(this);
        this.grid.excelHeaderQueryCellInfo = this.triggerEvents.bind(this);
        this.grid.pdfHeaderQueryCellInfo = this.triggerEvents.bind(this);
        this.grid.dataSourceChanged = this.triggerEvents.bind(this);
        this.grid.recordDoubleClick = this.triggerEvents.bind(this);
        this.grid.rowDeselecting = this.triggerEvents.bind(this);
        this.grid.cellDeselected = this.triggerEvents.bind(this);
        this.grid.cellDeselecting = this.triggerEvents.bind(this);
        this.grid.columnMenuOpen = this.triggerEvents.bind(this);
        this.grid.columnMenuClick = this.triggerEvents.bind(this);
        this.grid.cellSelected = this.triggerEvents.bind(this);
        this.grid.headerCellInfo = this.triggerEvents.bind(this);
        this.grid.resizeStart = this.triggerEvents.bind(this);
        this.grid.resizing = this.triggerEvents.bind(this);
        this.grid.columnDrag = this.triggerEvents.bind(this);
        this.grid.columnDragStart = this.triggerEvents.bind(this);
        this.grid.columnDrop = this.triggerEvents.bind(this);
        this.grid.beforePrint = this.triggerEvents.bind(this);
        this.grid.beforeCopy = this.triggerEvents.bind(this);
        this.grid.beforePaste = (args) => {
            let rows = this.getRows();
            let rowIndex = 'rowIndex';
            while (rows[args[rowIndex]].classList.contains('e-summaryrow')) {
                args[rowIndex]++;
            }
            this.trigger(beforePaste, args);
        };
        this.grid.load = () => {
            treeGrid.grid.on('initial-end', treeGrid.afterGridRender, treeGrid);
            if (!isNullOrUndefined(this.loggerModule)) {
                let loggerModule = 'loggerModule';
                this.loggerModule = this.grid[loggerModule] = new Logger$1(this.grid);
            }
        };
        this.grid.printComplete = this.triggerEvents.bind(this);
        this.grid.actionFailure = this.triggerEvents.bind(this);
        this.extendedGridDataBoundEvent();
        this.extendedGridEvents();
        this.extendedGridActionEvents();
        this.extendedGridEditEvents();
        this.bindGridDragEvents();
        this.bindCallBackEvents();
    }
    lastRowBorder(visiblerow, isAddBorder) {
        for (let j = 0; j < visiblerow.cells.length; j++) {
            isAddBorder ? addClass([visiblerow.cells[j]], 'e-lastrowcell') : removeClass([visiblerow.cells[j]], 'e-lastrowcell');
        }
    }
    ;
    isPixelHeight() {
        if (this.height !== 'auto' && this.height.toString().indexOf('%') === -1) {
            return true;
        }
        else {
            return false;
        }
    }
    ;
    extendedGridDataBoundEvent() {
        let treeGrid = this;
        this.grid.dataBound = (args) => {
            this.updateRowTemplate(args);
            this.updateColumnModel();
            this.updateAltRow(this.getRows());
            this.notify('dataBoundArg', args);
            if (isRemoteData(this) && !isOffline(this) && !this.hasChildMapping) {
                let req = getObject('dataSource.requests', this).filter((e) => {
                    return e.httpRequest.statusText !== 'OK';
                }).length;
                setValue('grid.contentModule.isLoaded', !(req > 0), this);
            }
            if (this.isPixelHeight() && this.initialRender) {
                let totalRows;
                let rows = this.getContentTable().rows;
                totalRows = [].slice.call(rows);
                for (let i = totalRows.length - 1; i > 0; i--) {
                    if (!isHidden(totalRows[i])) {
                        if (totalRows[i].nextElementSibling) {
                            this.lastRowBorder(totalRows[i], true);
                        }
                        break;
                    }
                }
            }
            this.trigger(dataBound, args);
            this.initialRender = false;
        };
        this.grid.beforeDataBound = function (args) {
            let dataSource = 'dataSource';
            let requestType = getObject('action', args);
            if (isRemoteData(treeGrid) && !isOffline(treeGrid) && requestType !== 'edit') {
                treeGrid.notify('updateRemoteLevel', args);
                args = (treeGrid.dataResults);
            }
            else if (treeGrid.flatData.length === 0 && isOffline(treeGrid) && treeGrid.dataSource instanceof DataManager) {
                let dm = treeGrid.dataSource;
                treeGrid.dataModule.convertToFlatData(dm.dataSource.json);
                args.result = treeGrid.grid.dataSource[dataSource].json = treeGrid.flatData;
            }
            if (!isRemoteData(treeGrid) && !isCountRequired(this) && !isNullOrUndefined(treeGrid.dataSource)) {
                if (this.isPrinting) {
                    setValue('isPrinting', true, args);
                }
                treeGrid.notify('dataProcessor', args);
                //args = this.dataModule.dataProcessor(args);
            }
            extend(args, treeGrid.dataResults);
            if (treeGrid.enableImmutableMode) {
                args.result = args.result.slice();
            }
            // this.notify(events.beforeDataBound, args);
            if (!this.isPrinting) {
                let callBackPromise = new Deferred();
                treeGrid.trigger(beforeDataBound, args, (beforeDataBoundArgs) => {
                    callBackPromise.resolve(beforeDataBoundArgs);
                });
                return callBackPromise;
            }
        };
        this.grid.log = (type, args) => {
            this.loggerModule ? this.loggerModule.log(type, args) : (() => 0)();
        };
    }
    bindCallBackEvents() {
        let beginEdit$$1;
        if (isBlazor() && this.isServerRendered) {
            if (!isNullOrUndefined(this.grid.beginEdit)) {
                beginEdit$$1 = this.grid.beginEdit;
            }
        }
        this.grid.toolbarClick = (args) => {
            let callBackPromise = new Deferred();
            this.trigger(toolbarClick, args, (toolbarargs) => {
                if (!toolbarargs.cancel) {
                    this.notify(toolbarClick, args);
                }
                callBackPromise.resolve(toolbarargs);
            });
            return callBackPromise;
        };
        this.grid.cellSelecting = (args) => {
            let callBackPromise = new Deferred();
            this.trigger(getObject('name', args), args, (cellselectingArgs) => {
                callBackPromise.resolve(cellselectingArgs);
            });
            return callBackPromise;
        };
        this.grid.beginEdit = (args) => {
            if (isBlazor() && this.isServerRendered) {
                if (beginEdit$$1 && typeof beginEdit$$1 === 'function') {
                    beginEdit$$1.apply(this, [args]);
                }
            }
            if (!isNullOrUndefined(args.row) && args.row.classList.contains('e-summaryrow')) {
                args.cancel = true;
                return;
            }
            let callBackPromise = new Deferred();
            this.trigger(beginEdit, args, (begineditArgs) => {
                callBackPromise.resolve(begineditArgs);
            });
            return callBackPromise;
        };
    }
    extendedGridEditEvents() {
        let keypressed = 'key-pressed';
        let editKeyPress = 'keyPressed';
        let localobserver = 'localObserver';
        let cellEdit$$1;
        let cellSave$$1;
        if (isBlazor() && this.isServerRendered) {
            if (!isNullOrUndefined(this.grid.cellEdit)) {
                cellEdit$$1 = this.grid.cellEdit;
            }
            if (!isNullOrUndefined(this.grid.cellSave)) {
                cellSave$$1 = this.grid.cellSave;
            }
        }
        if (this.editModule && isBlazor() && this.isServerRendered) {
            this.grid.on(keypressed, this.editModule[editKeyPress], this.editModule);
            let events = this.grid[localobserver].boundedEvents['key-pressed'];
            events.splice(0, 0, events.pop());
        }
        this.grid.dataStateChange = (args) => {
            if (this.isExpandRefresh) {
                this.isExpandRefresh = false;
                this.grid.dataSource = { result: this.flatData, count: getValue('count', this.grid.dataSource) };
            }
            else {
                this.trigger(dataStateChange, args);
            }
        };
        this.grid.cellSave = (args) => {
            if (isBlazor() && this.isServerRendered) {
                if (cellSave$$1 && typeof cellSave$$1 === 'function') {
                    cellSave$$1.apply(this, [args]);
                }
            }
            if (this.grid.isContextMenuOpen()) {
                let contextitems;
                contextitems = this.grid.contextMenuModule.contextMenu.element.getElementsByClassName('e-selected')[0];
                if ((isNullOrUndefined(contextitems) || contextitems.id !== this.element.id + '_gridcontrol_cmenu_Save')) {
                    args.cancel = true;
                }
            }
            let callBackPromise = new Deferred();
            this.trigger(cellSave, args, (cellsaveArgs) => {
                if (isBlazor() && !this.isServerRendered) {
                    cellsaveArgs.cell = getElement(cellsaveArgs.cell);
                }
                if (!cellsaveArgs.cancel) {
                    this.notify(cellSave, cellsaveArgs);
                }
                callBackPromise.resolve(cellsaveArgs);
            });
            return callBackPromise;
        };
        this.grid.cellSaved = (args) => {
            this.trigger(cellSaved, args);
            this.notify(cellSaved, args);
        };
        this.grid.cellEdit = (args) => {
            if (isBlazor() && this.isServerRendered) {
                if (cellEdit$$1 && typeof cellEdit$$1 === 'function') {
                    cellEdit$$1.apply(this, [args]);
                }
            }
            let prom = 'promise';
            let promise = new Deferred();
            args[prom] = promise;
            this.notify(cellEdit, args);
            return promise;
        };
        this.grid.batchAdd = (args) => {
            this.trigger(batchAdd, args);
            this.notify(batchAdd, args);
        };
        this.grid.beforeBatchSave = (args) => {
            this.trigger(beforeBatchSave, args);
            this.notify(beforeBatchSave, args);
        };
        this.grid.beforeBatchAdd = (args) => {
            this.trigger(beforeBatchAdd, args);
            this.notify(beforeBatchAdd, args);
        };
        this.grid.batchDelete = (args) => {
            this.trigger(batchDelete, args);
            this.notify(batchDelete, args);
        };
        this.grid.beforeBatchDelete = (args) => {
            this.trigger(beforeBatchDelete, args);
            this.notify(beforeBatchDelete, args);
        };
        this.grid.batchCancel = (args) => {
            if (this.editSettings.mode !== 'Cell') {
                this.trigger(batchCancel, args);
            }
            this.notify(batchCancel, args);
        };
    }
    updateRowTemplate(args) {
        if (isBlazor() && !this.isServerRendered) {
            setTimeout(() => {
                this.treeColumnRowTemplate(args);
            }, 1000);
        }
        else {
            this.treeColumnRowTemplate(args);
        }
    }
    bindedDataSource() {
        let dataSource = 'dataSource';
        let isDataAvailable = 'isDataAvailable';
        let adaptor = 'adaptor';
        let ready = 'ready';
        let adaptorName = 'adaptorName';
        let dotnetInstance = 'dotnetInstance';
        let key = 'key';
        if (this.dataSource && isCountRequired(this)) {
            let data = this.flatData;
            let datacount = getValue('count', this.dataSource);
            this.grid.dataSource = { result: data, count: datacount };
        }
        else {
            this.grid.dataSource = !(this.dataSource instanceof DataManager) ?
                this.flatData : new DataManager(this.dataSource.dataSource, this.dataSource.defaultQuery, this.dataSource.adaptor);
        }
        if (isBlazor() && this.dataSource instanceof DataManager) {
            this.grid.dataSource[adaptorName] = this.dataSource[adaptorName];
            this.grid.dataSource[dotnetInstance] = this.dataSource[dotnetInstance];
            this.grid.dataSource[key] = this.dataSource[key];
        }
        if (this.dataSource instanceof DataManager && (this.dataSource.dataSource.offline || this.dataSource.ready)) {
            this.grid.dataSource[dataSource].json = extendArray(this.dataSource[dataSource].json);
            this.grid.dataSource[ready] = this.dataSource.ready;
            let dm = this.grid.dataSource;
            if (!isNullOrUndefined(this.grid.dataSource[ready])) {
                this.grid.dataSource[ready].then((e) => {
                    dm[dataSource].offline = true;
                    dm[isDataAvailable] = true;
                    dm[dataSource].json = e.result;
                    dm[adaptor] = new JsonAdaptor();
                });
            }
        }
    }
    extendedGridActionEvents() {
        let actionComplete$$1;
        if (isBlazor() && this.isServerRendered) {
            if (!isNullOrUndefined(this.grid.actionComplete)) {
                actionComplete$$1 = this.grid.actionComplete;
            }
        }
        this.grid.actionBegin = (args) => {
            if (args.requestType === 'sorting' && args.target && args.target.parentElement &&
                args.target.parentElement.classList.contains('e-hierarchycheckbox')) {
                args.cancel = true;
            }
            let requestType = getObject('requestType', args);
            if (requestType === 'reorder') {
                this.notify('getColumnIndex', {});
            }
            this.notify('actionBegin', { editAction: args });
            if (!isRemoteData(this) && !isNullOrUndefined(this.filterModule) && !isCountRequired(this)
                && (this.grid.filterSettings.columns.length === 0 || this.grid.searchSettings.key.length === 0)) {
                this.notify('clearFilters', { flatData: this.grid.dataSource });
                this.grid.dataSource = this.dataResults.result;
            }
            let callBackPromise = new Deferred();
            if (isBlazor() && args.requestType === 'delete' && !this.isServerRendered) {
                let data = 'data';
                args[data] = args[data][0];
            }
            this.trigger(actionBegin, args, (actionArgs) => {
                if (isBlazor() && actionArgs.requestType === 'delete' && !this.isServerRendered) {
                    let data = 'data';
                    actionArgs[data] = [actionArgs[data]];
                }
                if (!actionArgs.cancel) {
                    this.notify(beginEdit, actionArgs);
                }
                if (isBlazor() && actionArgs.requestType === 'beginEdit' && !this.isServerRendered) {
                    actionArgs.row = getElement(actionArgs.row);
                }
                callBackPromise.resolve(actionArgs);
            });
            return callBackPromise;
        };
        this.grid.actionComplete = (args) => {
            if (isBlazor() && this.isServerRendered && args.requestType !== 'filterAfterOpen') {
                let rows = this.getRows();
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].classList.contains('e-treerowcollapsed') || rows[i].classList.contains('e-treerowexpanded')) {
                        (this.enableCollapseAll && args.requestType === 'paging') ? removeClass([rows[i]], 'e-treerowexpanded') :
                            removeClass([rows[i]], 'e-treerowcollapsed');
                        (this.enableCollapseAll && args.requestType === 'paging') ? addClass([rows[i]], 'e-treerowcollapsed') :
                            addClass([rows[i]], 'e-treerowexpanded');
                    }
                    let cells = rows[i].querySelectorAll('.e-rowcell');
                    let expandicon = cells[this.treeColumnIndex].getElementsByClassName('e-treegridcollapse')[0] ||
                        cells[this.treeColumnIndex].getElementsByClassName('e-treegridexpand')[0];
                    if (expandicon) {
                        (this.enableCollapseAll && args.requestType === 'paging') ? removeClass([expandicon], 'e-treegridexpand') :
                            removeClass([expandicon], 'e-treegridcollapse');
                        (this.enableCollapseAll && args.requestType === 'paging') ? addClass([expandicon], 'e-treegridcollapse') :
                            addClass([expandicon], 'e-treegridexpand');
                    }
                }
                if (actionComplete$$1 && typeof actionComplete$$1 === 'function') {
                    actionComplete$$1.apply(this, [args]);
                }
            }
            this.notify('actioncomplete', args);
            this.updateColumnModel();
            this.updateTreeGridModel();
            if (args.requestType === 'reorder') {
                this.notify('setColumnIndex', {});
            }
            this.notify('actionComplete', { editAction: args });
            if (args.requestType === 'add' && (this.editSettings.newRowPosition !== 'Top' && this.editSettings.newRowPosition !== 'Bottom')) {
                this.notify(beginAdd, args);
            }
            if (args.requestType === 'batchsave') {
                this.notify(batchSave, args);
            }
            this.notify('updateGridActions', args);
            if (isBlazor() && args.requestType === 'delete' && !this.isServerRendered) {
                let data = 'data';
                args[data] = args[data][0];
            }
            this.trigger(actionComplete, args);
        };
    }
    extendedGridEvents() {
        let treeGrid = this;
        this.grid.recordDoubleClick = (args) => {
            this.trigger(recordDoubleClick, args);
            this.notify(recordDoubleClick, args);
        };
        this.grid.detailDataBound = (args) => {
            this.notify('detaildataBound', args);
            this.trigger(detailDataBound, args);
        };
        this.grid.rowDataBound = function (args) {
            if (isNullOrUndefined(this.isPrinting)) {
                setValue('isPrinting', false, args);
            }
            else {
                setValue('isPrinting', this.isPrinting, args);
            }
            treeGrid.renderModule.RowModifier(args);
        };
        this.grid.queryCellInfo = function (args) {
            if (isNullOrUndefined(this.isPrinting)) {
                setValue('isPrinting', false, args);
            }
            else {
                setValue('isPrinting', this.isPrinting, args);
            }
            treeGrid.renderModule.cellRender(args);
        };
        this.grid.contextMenuClick = (args) => {
            this.notify(contextMenuClick, args);
            this.trigger(contextMenuClick, args);
        };
        this.grid.contextMenuOpen = (args) => {
            this.notify(contextMenuOpen, args);
            this.trigger(contextMenuOpen, args);
        };
        this.grid.queryCellInfo = (args) => {
            this.renderModule.cellRender(args);
        };
    }
    bindGridDragEvents() {
        let treeGrid = this;
        this.grid.rowDragStartHelper = (args) => {
            treeGrid.trigger(rowDragStartHelper, args);
        };
        this.grid.rowDragStart = (args) => {
            treeGrid.trigger(rowDragStart, args);
        };
        this.grid.rowDrag = (args) => {
            if (this.grid.isEdit) {
                args.cancel = true;
                return;
            }
            treeGrid.notify(rowdraging, args);
            treeGrid.trigger(rowDrag, args);
        };
        this.grid.rowDrop = (args) => {
            if (this.grid.isEdit) {
                args.cancel = true;
                return;
            }
            treeGrid.notify(rowDropped, args);
            args.cancel = true;
        };
    }
    /**
     * Renders TreeGrid component
     * @private
     */
    loadGrid() {
        this.bindGridProperties();
        this.bindGridEvents();
        setValue('registeredTemplate', this.registeredTemplate, this.grid);
        let ref = 'viewContainerRef';
        setValue('viewContainerRef', this[ref], this.grid);
    }
    /**
     * AutoGenerate TreeGrid columns from first record
     * @hidden
     */
    autoGenerateColumns() {
        if (!this.columns.length && (!this.dataModule.isRemote() && Object.keys(this.dataSource).length)) {
            this.columns = [];
            let record;
            // if (this.dataSource instanceof DataManager) {
            //   record = (<DataManager>this.dataSource).dataSource.json[0];
            // } else {
            record = this.dataSource[0];
            // }
            let keys = Object.keys(record);
            for (let i = 0; i < keys.length; i++) {
                if ([this.childMapping, this.parentIdMapping].indexOf(keys[i]) === -1) {
                    this.columns.push(keys[i]);
                }
            }
        }
    }
    getGridEditSettings() {
        let edit = {};
        let guid = 'guid';
        edit.allowAdding = this.editSettings.allowAdding;
        edit.allowEditing = this.editSettings.allowEditing;
        edit.allowDeleting = this.editSettings.allowDeleting;
        edit.newRowPosition = this.editSettings.newRowPosition === 'Bottom' ? 'Bottom' : 'Top';
        edit.allowEditOnDblClick = this.editSettings.allowEditOnDblClick;
        edit.showConfirmDialog = this.editSettings.showConfirmDialog;
        edit.template = this.editSettings.template;
        edit.showDeleteConfirmDialog = this.editSettings.showDeleteConfirmDialog;
        edit[guid] = this.editSettings[guid];
        edit.dialog = this.editSettings.dialog;
        switch (this.editSettings.mode) {
            case 'Dialog':
                edit.mode = this.editSettings.mode;
                break;
            case 'Batch':
                edit.mode = this.editSettings.mode;
                break;
            case 'Row':
                edit.mode = 'Normal';
                break;
            case 'Cell':
                edit.mode = 'Normal';
                edit.showConfirmDialog = false;
                break;
        }
        return edit;
    }
    /**
     * Defines grid toolbar from treegrid toolbar model
     * @hidden
     */
    getContextMenu() {
        if (this.contextMenuItems) {
            let items = [];
            for (let i = 0; i < this.contextMenuItems.length; i++) {
                switch (this.contextMenuItems[i]) {
                    case 'AddRow':
                    case ContextMenuItems.AddRow:
                        items.push({ text: this.l10n.getConstant('AddRow'),
                            target: '.e-content', id: this.element.id + '_gridcontrol_cmenu_AddRow',
                            items: [{ text: this.l10n.getConstant('Above'), id: 'Above' }, { text: this.l10n.getConstant('Below'), id: 'Below' }] });
                        break;
                    default:
                        items.push(this.contextMenuItems[i]);
                }
            }
            return items;
        }
        else {
            return null;
        }
    }
    /**
     * Defines grid toolbar from treegrid toolbar model
     * @hidden
     */
    getGridToolbar() {
        if (this.toolbar) {
            let items = [];
            for (let i = 0; i < this.toolbar.length; i++) {
                switch (this.toolbar[i]) {
                    case 'Search':
                    case ToolbarItem.Search:
                        items.push('Search');
                        break;
                    case 'Print':
                    case ToolbarItem.Print:
                        items.push('Print');
                        break;
                    case 'ExpandAll':
                    case ToolbarItem.ExpandAll:
                        let tooltipText = this.l10n.getConstant('ExpandAll');
                        items.push({ text: tooltipText, tooltipText: tooltipText,
                            prefixIcon: 'e-expand', id: this.element.id + '_gridcontrol_expandall' });
                        break;
                    case 'CollapseAll':
                    case ToolbarItem.CollapseAll:
                        let tooltip = this.l10n.getConstant('CollapseAll');
                        items.push({ text: tooltip,
                            tooltipText: tooltip, prefixIcon: 'e-collapse', id: this.element.id + '_gridcontrol_collapseall'
                        });
                        break;
                    case 'Indent':
                    case ToolbarItem.RowIndent:
                        let tooltipindent = this.l10n.getConstant('RowIndent');
                        items.push({
                            text: tooltipindent, tooltipText: tooltipindent,
                            prefixIcon: 'e-indent', id: this.element.id + '_gridcontrol_indent'
                        });
                        break;
                    case 'Outdent':
                    case ToolbarItem.RowOutdent:
                        let tooltipoutdent = this.l10n.getConstant('RowOutdent');
                        items.push({
                            text: tooltipoutdent, tooltipText: tooltipoutdent,
                            prefixIcon: 'e-outdent', id: this.element.id + '_gridcontrol_outdent'
                        });
                        break;
                    default:
                        items.push(this.toolbar[i]);
                }
            }
            return items;
        }
        else {
            return null;
        }
    }
    /**
     * Convert TreeGrid ColumnModel to Grid Column
     * @hidden
     */
    getGridColumns(columns) {
        let column = columns;
        this.columnModel = [];
        let treeGridColumn;
        let gridColumn;
        let gridColumnCollection = [];
        for (let i = 0; i < column.length; i++) {
            let treeColumn = this.grid.getColumnByUid(column[i].uid);
            gridColumn = treeColumn ? treeColumn : {};
            treeGridColumn = {};
            if (typeof this.columns[i] === 'string') {
                gridColumn.field = treeGridColumn.field = this.columns[i];
            }
            else {
                for (let prop of Object.keys(column[i])) {
                    if (i === this.treeColumnIndex && prop === 'template' && !isBlazor()) {
                        treeGridColumn[prop] = column[i][prop];
                    }
                    else {
                        gridColumn[prop] = treeGridColumn[prop] = column[i][prop];
                    }
                }
            }
            if (column[i].columns) {
                this.getGridColumns(columns[i].columns);
            }
            else {
                this.columnModel.push(new Column(treeGridColumn));
            }
            gridColumnCollection.push(gridColumn);
        }
        return gridColumnCollection;
    }
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    onPropertyChanged(newProp, oldProp) {
        let properties = Object.keys(newProp);
        let requireRefresh = false;
        let preventUpdate = 'preventUpdate';
        for (let prop of properties) {
            switch (prop) {
                case 'columns':
                    if (!(isBlazor() && this.isServerRendered && this[preventUpdate])) {
                        this.grid.columns = this.getGridColumns(this.columns);
                    }
                    break;
                case 'treeColumnIndex':
                    this.grid.refreshColumns();
                    break;
                case 'allowPaging':
                    this.grid.allowPaging = this.allowPaging;
                    break;
                case 'pageSettings':
                    this.grid.pageSettings = getActualProperties(this.pageSettings);
                    requireRefresh = true;
                    break;
                case 'enableVirtualization':
                    this.grid.enableVirtualization = this.enableVirtualization;
                    break;
                case 'toolbar':
                    this.grid.toolbar = this.getGridToolbar();
                    break;
                case 'allowSelection':
                    this.grid.allowSelection = this.allowSelection;
                    break;
                case 'selectionSettings':
                    this.grid.selectionSettings = getActualProperties(this.selectionSettings);
                    break;
                case 'allowSorting':
                    this.grid.allowSorting = this.allowSorting;
                    break;
                case 'allowMultiSorting':
                    this.grid.allowMultiSorting = this.allowMultiSorting;
                    break;
                case 'sortSettings':
                    this.grid.sortSettings = getActualProperties(this.sortSettings);
                    break;
                case 'searchSettings':
                    this.grid.searchSettings = getActualProperties(this.searchSettings);
                    break;
                case 'allowFiltering':
                    this.grid.allowFiltering = this.allowFiltering;
                    break;
                case 'filterSettings':
                    this.grid.filterSettings = getActualProperties(this.filterSettings);
                    break;
                case 'showColumnMenu':
                    this.grid.showColumnMenu = this.showColumnMenu;
                    break;
                case 'allowRowDragAndDrop':
                    this.grid.allowRowDragAndDrop = this.allowRowDragAndDrop;
                    break;
                case 'aggregates':
                    this.grid.aggregates = getActualProperties(this.aggregates);
                    break;
                case 'dataSource':
                    this.isLocalData = (!(this.dataSource instanceof DataManager) || (!isNullOrUndefined(this.dataSource.ready))
                        || this.dataSource.adaptor instanceof RemoteSaveAdaptor);
                    this.convertTreeData(this.dataSource);
                    if (this.isLocalData) {
                        if (isCountRequired(this)) {
                            let count = getValue('count', this.dataSource);
                            this.grid.dataSource = { result: this.flatData, count: count };
                        }
                        else {
                            this.grid.dataSource = !(this.dataSource instanceof DataManager) ?
                                this.flatData : new DataManager(this.dataSource.dataSource, this.dataSource.defaultQuery, this.dataSource.adaptor);
                        }
                        if (this.enableVirtualization) {
                            this.grid.contentModule.isDataSourceChanged = true;
                        }
                    }
                    else {
                        this.bindedDataSource();
                        if (this.enableVirtualization) {
                            this.grid.contentModule.removeEventListener();
                            this.grid.contentModule.eventListener('on');
                            this.grid.contentModule.renderTable();
                        }
                    }
                    break;
                case 'query':
                    this.grid.query = this.query;
                    break;
                case 'enableCollapseAll':
                    if (newProp[prop]) {
                        this.collapseAll();
                    }
                    else {
                        this.expandAll();
                    }
                    break;
                case 'expandStateMapping':
                    this.grid.refresh();
                    break;
                case 'gridLines':
                    this.grid.gridLines = this.gridLines;
                    break;
                case 'rowTemplate':
                    this.grid.rowTemplate = getActualProperties(this.rowTemplate);
                    break;
                case 'frozenRows':
                    this.grid.frozenRows = this.frozenRows;
                    break;
                case 'frozenColumns':
                    this.grid.frozenColumns = this.frozenColumns;
                    break;
                case 'rowHeight':
                    this.grid.rowHeight = this.rowHeight;
                    break;
                case 'height':
                    if (!isNullOrUndefined(this.height) && typeof (this.height) === 'string' && this.height.indexOf('%') !== -1) {
                        this.element.style.height = this.height;
                    }
                    this.grid.height = this.height;
                    break;
                case 'width':
                    if (!isNullOrUndefined(this.width) && typeof (this.width) === 'string' && this.width.indexOf('%') !== -1) {
                        this.element.style.width = this.width;
                    }
                    this.grid.width = this.width;
                    break;
                case 'locale':
                    this.grid.locale = this.locale;
                    break;
                case 'selectedRowIndex':
                    this.grid.selectedRowIndex = this.selectedRowIndex;
                    break;
                case 'enableAltRow':
                    this.grid.enableAltRow = this.enableAltRow;
                    break;
                case 'enableHover':
                    this.grid.enableHover = this.enableHover;
                    break;
                case 'enableAutoFill':
                    this.grid.enableAutoFill = this.enableAutoFill;
                    break;
                case 'enableImmutableMode':
                    this.grid.enableImmutableMode = this.enableImmutableMode;
                    break;
                case 'allowExcelExport':
                    this.grid.allowExcelExport = this.allowExcelExport;
                    break;
                case 'allowPdfExport':
                    this.grid.allowPdfExport = this.allowPdfExport;
                    break;
                case 'enableRtl':
                    this.grid.enableRtl = this.enableRtl;
                    break;
                case 'allowReordering':
                    this.grid.allowReordering = this.allowReordering;
                    break;
                case 'allowResizing':
                    this.grid.allowResizing = this.allowResizing;
                    break;
                case 'textWrapSettings':
                    this.grid.textWrapSettings = getActualProperties(this.textWrapSettings);
                    break;
                case 'allowTextWrap':
                    this.grid.allowTextWrap = getActualProperties(this.allowTextWrap);
                    this.grid.refresh();
                    break;
                case 'contextMenuItems':
                    this.grid.contextMenuItems = this.getContextMenu();
                    break;
                case 'showColumnChooser':
                    this.grid.showColumnChooser = this.showColumnChooser;
                    break;
                case 'detailTemplate':
                    this.grid.detailTemplate = getActualProperties(this.detailTemplate);
                    break;
                case 'columnMenuItems':
                    this.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
                    break;
                case 'editSettings':
                    if (this.grid.isEdit && this.grid.editSettings.mode === 'Normal' && newProp[prop].mode &&
                        (newProp[prop].mode === 'Cell' || newProp[prop].mode === 'Row')) {
                        this.grid.closeEdit();
                    }
                    this.grid.editSettings = this.getGridEditSettings();
                    break;
            }
            if (requireRefresh) {
                this.grid.refresh();
            }
        }
    }
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeListener();
        this.unwireEvents();
        super.destroy();
        if (this.grid) {
            this.grid.destroy();
        }
        if (this.dataModule) {
            this.dataModule.destroy();
        }
        let modules = ['dataModule', 'sortModule', 'renderModule', 'filterModule', 'printModule', 'clipboardModule',
            'excelExportModule', 'pdfExportModule', 'toolbarModule', 'summaryModule', 'reorderModule', 'resizeModule',
            'pagerModule', 'keyboardModule', 'columnMenuModule', 'contextMenuModule', 'editModule', 'virtualScrollModule',
            'selectionModule', 'detailRow', 'rowDragAndDropModule', 'freezeModule'];
        for (let i = 0; i < modules.length; i++) {
            if (this[modules[i]]) {
                this[modules[i]] = null;
            }
        }
        this.element.innerHTML = '';
        this.grid = null;
    }
    /**
     * Update the TreeGrid model
     * @method dataBind
     * @return {void}
     * @private
     */
    dataBind() {
        super.dataBind();
        if (!(isBlazor() && this.isServerRendered) || getValue('isRendered', this.grid) && !this.initialRender) {
            this.grid.dataBind();
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    getPersistData() {
        let keyEntity = ['pageSettings', 'sortSettings',
            'filterSettings', 'columns', 'searchSettings', 'selectedRowIndex'];
        let ignoreOnPersist = {
            pageSettings: ['template', 'pageSizes', 'pageSizeMode', 'enableQueryString', 'totalRecordsCount', 'pageCount'],
            filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay', 'ignoreAccent', 'hierarchyMode'],
            searchSettings: ['fields', 'operator', 'ignoreCase'],
            sortSettings: [], columns: [], selectedRowIndex: []
        };
        let ignoreOnColumn = ['filter', 'edit', 'filterBarTemplate', 'headerTemplate', 'template',
            'commandTemplate', 'commands', 'dataSource'];
        for (let i = 0; i < keyEntity.length; i++) {
            let currentObject = this[keyEntity[i]];
            for (let val of ignoreOnPersist[keyEntity[i]]) {
                delete currentObject[val];
            }
        }
        this.ignoreInArrays(ignoreOnColumn, this.columns);
        return this.addOnPersist(keyEntity);
    }
    ignoreInArrays(ignoreOnColumn, columns) {
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].columns) {
                this.ignoreInColumn(ignoreOnColumn, columns[i]);
                this.ignoreInArrays(ignoreOnColumn, columns[i].columns);
            }
            else {
                this.ignoreInColumn(ignoreOnColumn, columns[i]);
            }
        }
    }
    ignoreInColumn(ignoreOnColumn, column) {
        for (let i = 0; i < ignoreOnColumn.length; i++) {
            delete column[ignoreOnColumn[i]];
            column.filter = {};
        }
    }
    mouseClickHandler(e) {
        if (!isNullOrUndefined(e.touches)) {
            return;
        }
        let target = e.target;
        if ((target.classList.contains('e-treegridexpand') ||
            target.classList.contains('e-treegridcollapse')) && (!this.isEditCollapse && !this.grid.isEdit)) {
            this.expandCollapseRequest(target);
        }
        this.isEditCollapse = false;
        this.notify('checkboxSelection', { target: target });
    }
    /**
     * Returns TreeGrid rows
     * @return {HTMLTableRowElement[]}
     */
    getRows() {
        return this.grid.getRows();
    }
    /**
     * Gets the pager of the TreeGrid.
     * @return {Element}
     */
    getPager() {
        return this.grid.getPager(); //get element from pager
    }
    /**
     * Adds a new record to the TreeGrid. Without passing parameters, it adds empty rows.
     * > `editSettings.allowEditing` should be true.
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added.
     * @param {RowPosition} position - Defines the new row position to be added.
     */
    addRecord(data, index, position) {
        if (this.editModule) {
            this.editModule.addRecord(data, index, position);
        }
    }
    /**
     * Cancels edited state.
     */
    closeEdit() {
        if (this.grid.editModule) {
            this.grid.editModule.closeEdit();
        }
    }
    /**
     * Saves the cell that is currently edited. It does not save the value to the DataSource.
     */
    saveCell() {
        if (this.grid.editModule) {
            this.grid.editModule.saveCell();
        }
    }
    /**
     * To update the specified cell by given value without changing into edited state.
     * @param {number} rowIndex Defines the row index.
     * @param {string} field Defines the column field.
     * @param {string | number | boolean | Date} value - Defines the value to be changed.
     */
    updateCell(rowIndex, field, value) {
        if (this.grid.editModule) {
            this.grid.editModule.updateCell(rowIndex, field, value);
        }
    }
    /**
     * To update the specified row by given values without changing into edited state.
     * @param {number} index Defines the row index.
     * @param {Object} data Defines the data object to be updated.
     */
    updateRow(index, data) {
        if (this.grid.editModule) {
            if (!isNullOrUndefined(index)) {
                let griddata = this.grid.getCurrentViewRecords()[index];
                extend(griddata, data);
                this.grid.editModule.updateRow(index, griddata);
            }
            else {
                this.grid.editModule.updateRow(index, data);
            }
        }
    }
    /**
     * Delete a record with Given options. If fieldName and data is not given then TreeGrid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldName - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     */
    deleteRecord(fieldName, data) {
        if (this.grid.editModule) {
            this.grid.editModule.deleteRecord(fieldName, data);
        }
    }
    /**
     * To edit any particular row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
     */
    startEdit(row) {
        if (this.grid.editModule) {
            this.grid.editModule.startEdit(row);
        }
    }
    /**
     * To edit any particular cell using row index and cell index.
     * @param {number} rowIndex - Defines row index to edit a particular cell.
     * @param {string} field - Defines the field name of the column to perform cell edit.
     */
    editCell(rowIndex, field) {
        if (this.editModule) {
            this.editModule.editCell(rowIndex, field);
        }
    }
    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     */
    enableToolbarItems(items, isEnable) {
        if (this.grid.toolbarModule) {
            this.grid.toolbarModule.enableItems(items, isEnable);
        }
    }
    /**
     * If TreeGrid is in editable state, you can save a record by invoking endEdit.
     */
    endEdit() {
        if (this.grid.editModule) {
            this.grid.editModule.endEdit();
        }
    }
    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     * @param  {number} X - Defines the X axis.
     * @param  {number} Y - Defines the Y axis.
     * @return {void}
     */
    openColumnChooser(x, y) {
        if (this.columnChooserModule) {
            this.columnChooserModule.openColumnChooser(x, y);
        }
    }
    /**
     * Delete any visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    deleteRow(tr) {
        if (this.grid.editModule) {
            this.grid.editModule.deleteRow(tr);
        }
    }
    /**
     * Get the names of the primary key columns of the TreeGrid.
     * @return {string[]}
     */
    getPrimaryKeyFieldNames() {
        return this.grid.getPrimaryKeyFieldNames();
    }
    /**
     * Updates particular cell value based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {string } field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     */
    setCellValue(key, field, value) {
        this.grid.setCellValue(key, field, value);
        let rowIndex = this.grid.getRowIndexByPrimaryKey(key);
        let record = this.getCurrentViewRecords()[rowIndex];
        if (!isNullOrUndefined(record)) {
            editAction({ value: record, action: 'edit' }, this, this.isSelfReference, record.index, this.grid.selectedRowIndex, field);
        }
    }
    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *  @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     *  @param {Object} rowData - To update new data for the particular row.
     */
    setRowData(key, rowData) {
        let currentRecords = this.getCurrentViewRecords();
        let primaryKey = this.grid.getPrimaryKeyFieldNames()[0];
        let level = 0;
        let record = {};
        currentRecords.some((value, i, e) => {
            if (value[primaryKey] === key) {
                record = value;
                return true;
            }
            else {
                return false;
            }
        });
        level = record.level;
        rowData.level = level;
        rowData.index = record.index;
        rowData.childRecords = record.childRecords;
        rowData.taskData = record.taskData;
        rowData.uniqueID = record.uniqueID;
        rowData.parentItem = record.parentItem;
        rowData.checkboxState = record.checkboxState;
        rowData.hasChildRecords = record.hasChildRecords;
        rowData.parentUniqueID = record.parentUniqueID;
        rowData.expanded = record.expanded;
        this.grid.setRowData(key, rowData);
    }
    /**
     * Navigates to the specified target page.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    goToPage(pageNo) {
        if (this.grid.pagerModule) {
            this.grid.pagerModule.goToPage(pageNo);
        }
    }
    /**
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update.
     * @return {void}
     */
    updateExternalMessage(message) {
        if (this.pagerModule) {
            this.grid.pagerModule.updateExternalMessage(message);
        }
    }
    /**
     * Gets a cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    getCellFromIndex(rowIndex, columnIndex) {
        return this.grid.getCellFromIndex(rowIndex, columnIndex);
    }
    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     */
    getColumnByField(field) {
        if (isBlazor() && this.isServerRendered) {
            return iterateArrayOrObject(this.grid.columns, (item, index) => {
                if (item.field === field) {
                    return item;
                }
                return undefined;
            })[0];
        }
        else {
            return iterateArrayOrObject(this.columnModel, (item, index) => {
                if (item.field === field) {
                    return item;
                }
                return undefined;
            })[0];
        }
    }
    /**
     * Gets a column by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {Column}
     */
    getColumnByUid(uid) {
        return iterateArrayOrObject(this.grid.columns, (item, index) => {
            if (item.uid === uid) {
                return item;
            }
            return undefined;
        })[0];
    }
    /**
     * Gets the collection of column fields.
     * @return {string[]}
     */
    getColumnFieldNames() {
        return this.grid.getColumnFieldNames();
    }
    /**
     * Gets the footer div of the TreeGrid.
     * @return {Element}
     */
    getFooterContent() {
        return this.grid.getFooterContent();
    }
    /**
     * Gets the footer table element of the TreeGrid.
     * @return {Element}
     */
    getFooterContentTable() {
        return this.grid.getFooterContentTable();
    }
    /**
     * Shows a column by its column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    showColumns(keys, showBy) {
        this.grid.showColumns(keys, showBy);
        this.updateColumnModel();
    }
    /**
     * Hides a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    hideColumns(keys, hideBy) {
        this.grid.hideColumns(keys, hideBy);
        this.updateColumnModel();
    }
    /**
     * Gets a column header by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Element}
     */
    getColumnHeaderByField(field) {
        return this.grid.getColumnHeaderByField(field);
    }
    /**
     * Gets a column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element}
     */
    getColumnHeaderByIndex(index) {
        return this.grid.getColumnHeaderByIndex(index);
    }
    /**
     * Gets a column header by UID.
     * @param  {string} field - Specifies the column uid.
     * @return {Element}
     */
    getColumnHeaderByUid(uid) {
        return this.grid.getColumnHeaderByUid(uid);
    }
    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    getColumnIndexByField(field) {
        return this.grid.getColumnIndexByField(field);
    }
    /**
     * Gets a column index by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {number}
     */
    getColumnIndexByUid(uid) {
        return this.grid.getColumnIndexByUid(uid);
    }
    /**
     * Gets the columns from the TreeGrid.
     * @return {Column[]}
     */
    getColumns(isRefresh) {
        if (isBlazor() && this.isServerRendered) {
            return this.grid.columns;
        }
        else {
            this.updateColumnModel(this.grid.getColumns(isRefresh));
            return this.columnModel;
        }
    }
    updateColumnModel(column) {
        let temp;
        let field;
        let gridColumns = isNullOrUndefined(column) ? this.grid.getColumns() : column;
        if (this.treeColumnIndex !== -1 && this.columns[this.treeColumnIndex] &&
            !isNullOrUndefined(this.columns[this.treeColumnIndex].template)) {
            temp = this.columns[this.treeColumnIndex].template;
            field = this.columns[this.treeColumnIndex].field;
        }
        this.columnModel = [];
        let stackedHeader = false;
        let gridColumn;
        for (let i = 0; i < gridColumns.length; i++) {
            gridColumn = {};
            for (let prop of Object.keys(gridColumns[i])) {
                if (!isBlazor() || prop !== 'edit') {
                    gridColumn[prop] = gridColumns[i][prop];
                }
            }
            this.columnModel.push(new Column(gridColumn));
            if (field === this.columnModel[i].field && (!isNullOrUndefined(temp) && temp !== '')) {
                this.columnModel[i].template = temp;
            }
        }
        if (!isBlazor() || !this.isServerRendered) {
            let merge$$1 = 'deepMerge';
            this[merge$$1] = ['columns']; // Workaround for blazor updateModel
            if (this.grid.columns.length !== this.columnModel.length) {
                stackedHeader = true;
            }
            if (!stackedHeader) {
                this.setProperties({ columns: this.columnModel }, true);
            }
            this[merge$$1] = undefined; // Workaround for blazor updateModel
        }
        return this.columnModel;
    }
    /**
     * Gets the content div of the TreeGrid.
     * @return {Element}
     */
    getContent() {
        return this.grid.getContent();
    }
    mergePersistTreeGridData() {
        let persist1 = 'mergePersistGridData';
        this.grid[persist1].apply(this);
    }
    mergeColumns(storedColumn, columns) {
        let persist2 = 'mergeColumns';
        this.grid[persist2].apply(this, [storedColumn, columns]);
    }
    updateTreeGridModel() {
        this.setProperties({ filterSettings: getObject('properties', this.grid.filterSettings) }, true);
        this.setProperties({ pageSettings: getObject('properties', this.grid.pageSettings) }, true);
        this.setProperties({ searchSettings: getObject('properties', this.grid.searchSettings) }, true);
        this.setProperties({ sortSettings: getObject('properties', this.grid.sortSettings) }, true);
    }
    /**
     * Gets the content table of the TreeGrid.
     * @return {Element}
     */
    getContentTable() {
        return this.grid.getContentTable();
    }
    /**
     * Gets all the TreeGrid's data rows.
     * @return {Element[]}
     */
    getDataRows() {
        let dRows = [];
        let rows = this.grid.getDataRows();
        for (let i = 0, len = rows.length; i < len; i++) {
            if (!rows[i].classList.contains('e-summaryrow')) {
                dRows.push(rows[i]);
            }
        }
        return dRows;
    }
    /**
     * Get current visible data of TreeGrid.
     * @return {Object[]}
     * @isGenericType true
     */
    getCurrentViewRecords() {
        return this.grid.currentViewData;
    }
    /**
     * Gets the added, edited,and deleted data before bulk save to the DataSource in batch mode.
     * @return {Object}
     */
    getBatchChanges() {
        return this.grid.editModule.getBatchChanges();
    }
    /**
     * Gets the header div of the TreeGrid.
     * @return {Element}
     */
    getHeaderContent() {
        return this.grid.getHeaderContent();
    }
    /**
     * Gets the header table element of the TreeGrid.
     * @return {Element}
     */
    getHeaderTable() {
        return this.grid.getHeaderTable();
    }
    /**
     * Gets a row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    getRowByIndex(index) {
        return this.grid.getRowByIndex(index);
    }
    /**
     * Get a row information based on cell
     * @param {Element}
     * @return RowInfo
     */
    getRowInfo(target) {
        return this.grid.getRowInfo(target);
    }
    /**
     * Gets UID by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    getUidByColumnField(field) {
        return this.grid.getUidByColumnField(field);
    }
    /**
     * Gets the visible columns from the TreeGrid.
     * @return {Column[]}
     */
    getVisibleColumns() {
        let cols = [];
        for (let col of this.columnModel) {
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    }
    /**
     * By default, TreeGrid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     */
    showSpinner() {
        showSpinner(this.element);
    }
    /**
     * Manually shown spinner needs to hide by `hideSpinnner`.
     */
    hideSpinner() {
        hideSpinner(this.element);
    }
    /**
     * Refreshes the TreeGrid header and content.
     */
    refresh() {
        this.convertTreeData(this.dataSource);
        this.grid.dataSource = !(this.dataSource instanceof DataManager) ?
            this.flatData : new DataManager(this.dataSource.dataSource, this.dataSource.defaultQuery, this.dataSource.adaptor);
        this.grid.refresh();
    }
    /**
     * Get the records of checked rows.
     * @return {Object[]}
     * @isGenericType true
     */
    getCheckedRecords() {
        return this.selectionModule.getCheckedrecords();
    }
    /**
     * Get the visible records corresponding to rows visually displayed.
     * @return {Object[]}
     * @isGenericType true
     */
    getVisibleRecords() {
        let visibleRecords = [];
        let currentViewRecords = this.getCurrentViewRecords();
        if (!this.allowPaging) {
            for (let i = 0; i < currentViewRecords.length; i++) {
                visibleRecords.push(currentViewRecords[i]);
                if (!currentViewRecords[i].expanded) {
                    i += findChildrenRecords(currentViewRecords[i]).length;
                }
            }
        }
        else {
            visibleRecords = currentViewRecords;
        }
        return visibleRecords;
    }
    /**
     * Get the indexes of checked rows.
     * @return {number[]}
     */
    getCheckedRowIndexes() {
        return this.selectionModule.getCheckedRowIndexes();
    }
    /**
     * Checked the checkboxes using rowIndexes.
     */
    selectCheckboxes(indexes) {
        this.selectionModule.selectCheckboxes(indexes);
    }
    /**
     * Refreshes the TreeGrid column changes.
     */
    refreshColumns(refreshUI) {
        if (isNullOrUndefined(refreshUI) || refreshUI) {
            this.grid.columns = this.getGridColumns(this.columns);
            this.grid.refreshColumns();
        }
        else {
            this.grid.setProperties({ columns: this.getGridColumns(this.columns) }, true);
        }
    }
    /**
     * Refreshes the TreeGrid header.
     */
    refreshHeader() {
        this.grid.refreshHeader();
    }
    /**
     * Expands or collapse child records
     * @return {string}
     * @hidden
     */
    expandCollapseRequest(target) {
        if (this.editSettings.mode === 'Batch') {
            let obj = 'dialogObj';
            let showDialog = 'showDialog';
            if (this.getBatchChanges()[this.changedRecords].length ||
                this.getBatchChanges()[this.deletedRecords].length || this.getBatchChanges()[this.addedRecords].length) {
                let dialogObj = this.grid.editModule[obj];
                this.grid.editModule[showDialog]('CancelEdit', dialogObj);
                this.targetElement = target;
                return;
            }
        }
        if (this.rowTemplate) {
            let rowInfo = target.closest('.e-treerowcell').parentElement;
            let record = this.getCurrentViewRecords()[rowInfo.rowIndex];
            if (target.classList.contains('e-treegridexpand')) {
                this.collapseRow(rowInfo, record);
            }
            else {
                this.expandRow(rowInfo, record);
            }
        }
        else {
            let rowInfo = this.grid.getRowInfo(target);
            let record = rowInfo.rowData;
            if (this.enableImmutableMode && Object.keys(record).length === 0) {
                record = this.getCurrentViewRecords()[rowInfo.rowIndex];
            }
            if (target.classList.contains('e-treegridexpand')) {
                this.collapseRow(rowInfo.row, record);
            }
            else {
                this.expandRow(rowInfo.row, record);
            }
        }
    }
    /**
     * Expands child rows
     * @return {void}
     */
    expandRow(row, record) {
        record = this.getCollapseExpandRecords(row, record);
        if (!isNullOrUndefined(row) && row.cells[0].classList.contains('e-lastrowcell')) {
            this.lastRowBorder(row, false);
        }
        let args = { data: record, row: row, cancel: false };
        this.trigger(expanding, args, (expandingArgs) => {
            if (!expandingArgs.cancel) {
                this.expandCollapse('expand', row, record);
                if (!(isRemoteData(this) && !isOffline(this)) && !isCountRequired(this)) {
                    let collapseArgs = { data: record, row: row };
                    this.trigger(expanded, collapseArgs);
                }
            }
        });
    }
    getCollapseExpandRecords(row, record) {
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All' && this.isExpandAll && isNullOrUndefined(record) &&
            !isRemoteData(this)) {
            record = this.flatData.filter((e) => {
                return e.hasChildRecords;
            });
        }
        else if (isNullOrUndefined(record)) {
            record = this.grid.getCurrentViewRecords()[row.rowIndex];
        }
        return record;
    }
    /**
     * Collapses child rows
     * @return {void}
     */
    collapseRow(row, record) {
        record = this.getCollapseExpandRecords(row, record);
        let args = { data: record, row: row, cancel: false };
        this.trigger(collapsing, args, (collapsingArgs) => {
            if (!collapsingArgs.cancel) {
                this.expandCollapse('collapse', row, record);
                let collapseArgs = { data: record, row: row };
                if (!isRemoteData(this)) {
                    this.trigger(collapsed, collapseArgs);
                }
            }
        });
    }
    /**
     * Expands the records at specific hierarchical level
     * @return {void}
     */
    expandAtLevel(level) {
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            let rec = this.grid.dataSource.filter((e) => {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = true;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.expandRow(null, rec);
        }
        else {
            let rec = this.getRecordDetails(level);
            let row = getObject('rows', rec);
            let record = getObject('records', rec);
            for (let i = 0; i < record.length; i++) {
                this.expandRow(row[i], record[i]);
            }
        }
    }
    getRecordDetails(level) {
        let rows = this.getRows().filter((e) => {
            return (e.className.indexOf('level' + level) !== -1
                && (e.querySelector('.e-treegridcollapse') || e.querySelector('.e-treegridexpand')));
        });
        let records = this.getCurrentViewRecords().filter((e) => { return e.level === level && e.hasChildRecords; });
        let obj = { records: records, rows: rows };
        return obj;
    }
    /**
     * Collapses the records at specific hierarchical level
     * @return {void}
     */
    collapseAtLevel(level) {
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            let record = this.grid.dataSource.filter((e) => {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = false;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.collapseRow(null, record);
        }
        else {
            let rec = this.getRecordDetails(level);
            let rows = getObject('rows', rec);
            let records = getObject('records', rec);
            for (let i = 0; i < records.length; i++) {
                this.collapseRow(rows[i], records[i]);
            }
        }
        if (!this.grid.contentModule.isDataSourceChanged && this.enableVirtualization && this.getRows()
            && this.parentData.length === this.getRows().length) {
            let endIndex = 'endIndex';
            this.grid.contentModule.startIndex = -1;
            this.grid.contentModule[endIndex] = -1;
        }
    }
    /**
     * Expands All the rows
     * @return {void}
     */
    expandAll() {
        this.expandCollapseAll('expand');
    }
    /**
     * Collapses All the rows
     * @return {void}
     */
    collapseAll() {
        this.expandCollapseAll('collapse');
    }
    expandCollapseAll(action) {
        let rows = this.getRows().filter((e) => {
            return e.querySelector('.e-treegrid' + (action === 'expand' ? 'collapse' : 'expand'));
        });
        this.isExpandAll = true;
        this.isCollapseAll = true;
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)) {
            this.flatData.filter((e) => {
                if (e.hasChildRecords) {
                    e.expanded = action === 'collapse' ? false : true;
                }
            });
            if (rows.length) {
                action === 'collapse' ? this.collapseRow(rows[0]) : this.expandRow(rows[0]);
            }
            else {
                let isExpandCollapseall = this.enableCollapseAll;
                this.setProperties({ enableCollapseAll: true }, true);
                this.grid.pagerModule.goToPage(1);
                this.setProperties({ enableCollapseAll: isExpandCollapseall }, true);
            }
        }
        else {
            for (let i = 0; i < rows.length; i++) {
                action === 'collapse' ? this.collapseRow(rows[i]) : this.expandRow(rows[i]);
            }
        }
        this.isExpandAll = false;
        this.isCollapseAll = false;
    }
    expandCollapse(action, row, record, isChild) {
        let expandingArgs = { row: row, data: record, childData: [], requestType: action };
        let targetEle;
        if (!isRemoteData(this) && action === 'expand' && this.isSelfReference && isCountRequired(this)) {
            this.updateChildOnDemand(expandingArgs);
        }
        let gridRows = this.getRows();
        if (this.rowTemplate) {
            let rows = this.getContentTable().rows;
            gridRows = [].slice.call(rows);
        }
        let rowIndex;
        if (isNullOrUndefined(row)) {
            rowIndex = this.getCurrentViewRecords().indexOf(record);
            row = gridRows[rowIndex];
        }
        else {
            rowIndex = +row.getAttribute('aria-rowindex');
        }
        if (!isNullOrUndefined(row)) {
            row.setAttribute('aria-expanded', action === 'expand' ? 'true' : 'false');
        }
        if (((this.allowPaging && this.pageSettings.pageSizeMode === 'All') || this.enableVirtualization) && !isRemoteData(this)
            && !isCountRequired(this)) {
            this.notify(localPagedExpandCollapse, { action: action, row: row, record: record });
        }
        else {
            let displayAction;
            if (action === 'expand') {
                displayAction = 'table-row';
                if (!isChild) {
                    record.expanded = true;
                    this.uniqueIDCollection[record.uniqueID].expanded = record.expanded;
                }
                if (!isNullOrUndefined(row)) {
                    targetEle = row.getElementsByClassName('e-treegridcollapse')[0];
                }
                if (isChild && !isNullOrUndefined(record[this.expandStateMapping]) &&
                    record[this.expandStateMapping] && isNullOrUndefined(targetEle)) {
                    targetEle = row.getElementsByClassName('e-treegridexpand')[0];
                }
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                if (!targetEle.classList.contains('e-treegridexpand')) {
                    addClass([targetEle], 'e-treegridexpand');
                }
                removeClass([targetEle], 'e-treegridcollapse');
            }
            else {
                displayAction = 'none';
                if (!isChild || isCountRequired(this)) {
                    record.expanded = false;
                    this.uniqueIDCollection[record.uniqueID].expanded = record.expanded;
                }
                if (!isNullOrUndefined(row)) {
                    targetEle = row.getElementsByClassName('e-treegridexpand')[0];
                }
                if (isChild && !isNullOrUndefined(record[this.expandStateMapping]) &&
                    !record[this.expandStateMapping] && isNullOrUndefined(targetEle)) {
                    targetEle = row.getElementsByClassName('e-treegridcollapse')[0];
                }
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                if (!targetEle.classList.contains('e-treegridcollapse')) {
                    addClass([targetEle], 'e-treegridcollapse');
                }
                removeClass([targetEle], 'e-treegridexpand');
            }
            let detailrows = gridRows.filter((r) => r.classList.contains('e-griddetailrowindex' + record.index + 'level' + (record.level + 1)));
            if (isRemoteData(this) && !isOffline(this)) {
                this.remoteExpand(action, row, record, isChild);
            }
            else {
                if (!isCountRequired(this) || action === 'collapse') {
                    this.localExpand(action, row, record, isChild);
                }
            }
            if (this.isPixelHeight() && !row.cells[0].classList.contains('e-lastrowcell')) {
                let totalRows = this.getRows();
                let rows = this.getContentTable().rows;
                totalRows = [].slice.call(rows);
                for (let i = totalRows.length - 1; i > 0; i--) {
                    if (!isHidden(totalRows[i])) {
                        let table = this.getContentTable();
                        let sHeight = table.scrollHeight;
                        let clientHeight = this.getContent().clientHeight;
                        this.lastRowBorder(totalRows[i], sHeight <= clientHeight);
                        break;
                    }
                }
            }
            this.notify('rowExpandCollapse', { detailrows: detailrows, action: displayAction, record: record, row: row });
            this.updateAltRow(gridRows);
        }
    }
    updateChildOnDemand(expandingArgs) {
        let deff = new Deferred();
        let childDataBind = 'childDataBind';
        expandingArgs[childDataBind] = deff.resolve;
        let record = expandingArgs.data;
        this.trigger(dataStateChange, expandingArgs);
        deff.promise.then((e) => {
            if (expandingArgs.childData.length) {
                let currentData = (this.flatData);
                let index = 0;
                for (let i = 0; i < currentData.length; i++) {
                    if (currentData[i].taskData === record.taskData) {
                        index = i;
                        break;
                    }
                }
                let data = getValue('result', this.dataSource);
                let childData = extendArray(expandingArgs.childData);
                let length = record[this.childMapping] ?
                    record[this.childMapping].length > childData.length ? record[this.childMapping].length : childData.length : childData.length;
                for (let i = 0; i < length; i++) {
                    if (record[this.childMapping]) {
                        data.filter((e, i) => {
                            if (e[this.parentIdMapping] === record[this.idMapping]) {
                                data.splice(i, 1);
                            }
                        });
                    }
                    if (childData[i]) {
                        childData[i].level = record.level + 1;
                        childData[i].index = Math.ceil(Math.random() * 1000);
                        childData[i].parentItem = extend({}, record);
                        childData[i].taskData = extend({}, childData[i]);
                        delete childData[i].parentItem.childRecords;
                        delete childData[i].taskData.parentItem;
                        childData[i].parentUniqueID = record.uniqueID;
                        childData[i].uniqueID = getUid(this.element.id + '_data_');
                        setValue('uniqueIDCollection.' + childData[i].uniqueID, childData[i], this);
                        if (!isNullOrUndefined(childData[i][this.childMapping]) ||
                            (childData[i][this.hasChildMapping] && isCountRequired(this))) {
                            childData[i].hasChildRecords = true;
                        }
                        currentData.splice(index + 1 + i, record[this.childMapping] && record[this.childMapping][i] ? 1 : 0, childData[i]);
                    }
                    else {
                        currentData.splice(index + 1 + i, 1);
                    }
                }
                currentData[index][this.childMapping] = childData;
                currentData[index].childRecords = childData;
                currentData[index].expanded = true;
                setValue('uniqueIDCollection.' + currentData[index].uniqueID, currentData[index], this);
                for (let j = 0; j < expandingArgs.childData.length; j++) {
                    data.push(expandingArgs.childData[j]);
                }
            }
            this.isExpandRefresh = true;
            this.grid.refresh();
            this.trigger(expanded, expandingArgs);
        });
    }
    remoteExpand(action, row, record, isChild) {
        let gridRows = this.getRows();
        if (this.rowTemplate) {
            let rows = this.getContentTable().rows;
            gridRows = [].slice.call(rows);
        }
        let args = { data: record, row: row };
        let rows = [];
        rows = gridRows.filter((r) => r.querySelector('.e-gridrowindex' + record.index + 'level' + (record.level + 1)));
        if (action === 'expand') {
            this.notify(remoteExpand, { record: record, rows: rows, parentRow: row });
            let args = { row: row, data: record };
            if (rows.length > 0) {
                this.trigger(expanded, args);
            }
        }
        else {
            this.collapseRemoteChild({ record: record, rows: rows });
            this.trigger(collapsed, args);
        }
    }
    localExpand(action, row, record, isChild) {
        let rows;
        let childRecords = this.getCurrentViewRecords().filter((e) => {
            return e.parentUniqueID === record.uniqueID;
        });
        if (this.isPixelHeight() && row.cells[0].classList.contains('e-lastrowcell')) {
            this.lastRowBorder(row, false);
        }
        let movableRows;
        let gridRows = this.getRows();
        if (this.rowTemplate) {
            let rows = this.getContentTable().rows;
            gridRows = [].slice.call(rows);
        }
        let displayAction = (action === 'expand') ? 'table-row' : 'none';
        let primaryKeyField = this.getPrimaryKeyFieldNames()[0];
        let indx = 'index';
        let index = childRecords[0].parentItem.index;
        if (this.enableImmutableMode && !this.allowPaging) {
            let index = this.getCurrentViewRecords().map((e) => { return e[indx]; }).indexOf(record.index);
            let children = findChildrenRecords(this.getCurrentViewRecords()[index]);
            rows = [];
            childRecords = children;
            for (let i = 0; i < children.length; i++) {
                let rowIndex = this.grid.getRowIndexByPrimaryKey(children[i][primaryKeyField]);
                rows.push(this.getRows()[rowIndex]);
            }
        }
        else {
            rows = gridRows.filter((r) => r.querySelector('.e-gridrowindex' + record.index + 'level' + (record.level + 1)));
        }
        if (this.frozenRows || this.frozenColumns || this.getFrozenColumns()) {
            movableRows = this.getMovableRows().filter((r) => r.querySelector('.e-gridrowindex' + record.index + 'level' + (record.level + 1)));
        }
        for (let i = 0; i < rows.length; i++) {
            if (!isNullOrUndefined(rows[i])) {
                rows[i].style.display = displayAction;
            }
            if (!isNullOrUndefined(movableRows)) {
                movableRows[i].style.display = displayAction;
            }
            this.notify('childRowExpand', { row: rows[i] });
            if (!isNullOrUndefined(childRecords[i].childRecords) && (action !== 'expand' ||
                isNullOrUndefined(childRecords[i].expanded) || childRecords[i].expanded)) {
                this.expandCollapse(action, rows[i], childRecords[i], true);
                if (this.frozenColumns <= this.treeColumnIndex && !isNullOrUndefined(movableRows)) {
                    this.expandCollapse(action, movableRows[i], childRecords[i], true);
                }
            }
        }
    }
    updateAltRow(rows) {
        if (this.enableAltRow && !this.rowTemplate) {
            let visibleRowCount = 0;
            for (let i = 0; rows && i < rows.length; i++) {
                let gridRow = rows[i];
                if (gridRow.style.display !== 'none') {
                    if (gridRow.classList.contains('e-altrow')) {
                        removeClass([gridRow], 'e-altrow');
                    }
                    if (visibleRowCount % 2 !== 0 && !gridRow.classList.contains('e-summaryrow') && !gridRow.classList.contains('e-detailrow')) {
                        addClass([gridRow], 'e-altrow');
                    }
                    if (!gridRow.classList.contains('e-summaryrow') && !gridRow.classList.contains('e-detailrow')) {
                        visibleRowCount++;
                    }
                }
            }
        }
    }
    treeColumnRowTemplate(args) {
        if (this.rowTemplate) {
            let rows = this.getContentTable().rows;
            rows = [].slice.call(rows);
            for (let i = 0; i < rows.length; i++) {
                let rcell = this.grid.getContentTable().rows[i].cells[this.treeColumnIndex];
                let row = rows[i];
                let rowData = this.grid.getRowsObject()[i].data;
                let arg = { data: rowData, row: row, cell: rcell, column: this.getColumns()[this.treeColumnIndex] };
                this.renderModule.cellRender(arg);
            }
        }
    }
    collapseRemoteChild(rowDetails, isChild) {
        if (!isChild) {
            rowDetails.record.expanded = false;
        }
        let rows = rowDetails.rows;
        let childRecord;
        for (let i = 0; i < rows.length; i++) {
            if (isBlazor() && this.isServerRendered) {
                removeClass([rows[i]], 'e-treerowexpanded');
                addClass([rows[i]], 'e-treerowcollapsed');
            }
            else {
                rows[i].style.display = 'none';
            }
            let collapsingTd = rows[i].querySelector('.e-detailrowexpand');
            if (!isNullOrUndefined(collapsingTd)) {
                this.grid.detailRowModule.collapse(collapsingTd);
            }
            if (rows[i].querySelector('.e-treecolumn-container .e-treegridexpand')) {
                let expandElement = rows[i].querySelector('.e-treecolumn-container .e-treegridexpand');
                childRecord = this.rowTemplate ? this.grid.getCurrentViewRecords()[rows[i].rowIndex] :
                    this.grid.getRowObjectFromUID(rows[i].getAttribute('data-Uid')).data;
                if (!isNullOrUndefined(expandElement) && childRecord.expanded) {
                    removeClass([expandElement], 'e-treegridexpand');
                    addClass([expandElement], 'e-treegridcollapse');
                }
                let cRow = [];
                let eRows = this.getRows();
                for (let i = 0; i < eRows.length; i++) {
                    if (eRows[i].querySelector('.e-gridrowindex' + childRecord.index + 'level' + (childRecord.level + 1))) {
                        cRow.push(eRows[i]);
                    }
                }
                if (cRow.length && childRecord.expanded) {
                    this.collapseRemoteChild({ record: childRecord, rows: cRow }, true);
                }
            }
        }
    }
    /**
     * @hidden
     */
    addListener() {
        this.on('updateResults', this.updateResultModel, this);
        this.grid.on('initial-end', this.afterGridRender, this);
    }
    updateResultModel(returnResult) {
        this.dataResults = returnResult;
    }
    /**
     * @hidden
     */
    removeListener() {
        if (this.isDestroyed) {
            return;
        }
        this.off('updateResults', this.updateResultModel);
        this.grid.off('initial-end', this.afterGridRender);
    }
    /**
     * Filters TreeGrid row by column name with the given options.
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, TreeGrid filters the records with exact match. if false, it filters case
     * insensitive records (uppercase and lowercase letters treated the same).
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true,
     * then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     * @return {void}
     */
    filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator) {
        this.grid.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator);
    }
    /**
     * Clears all the filtered rows of the TreeGrid.
     * @return {void}
     */
    clearFiltering() {
        this.grid.clearFiltering();
    }
    /**
     * Removes filtered column by field name.
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @return {void}
     * @hidden
     */
    removeFilteredColsByField(field, isClearFilterBar) {
        this.grid.removeFilteredColsByField(field, isClearFilterBar);
    }
    /**
     * Selects a row by given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    selectRow(index, isToggle) {
        this.grid.selectRow(index, isToggle);
    }
    /**
     * Selects a collection of rows by indexes.
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void}
     */
    selectRows(rowIndexes) {
        this.grid.selectRows(rowIndexes);
    }
    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    clearSelection() {
        this.grid.clearSelection();
    }
    /**
     * Copy the selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     */
    copy(withHeader) {
        this.clipboardModule.copy(withHeader);
    }
    /**
     * Paste data from clipboard to selected cells.
     * @param {boolean} data - Specifies the date for paste.
     * @param {boolean} rowIndex - Specifies the row index.
     * @param {boolean} colIndex - Specifies the column index.
     */
    paste(data, rowIndex, colIndex) {
        this.clipboardModule.paste(data, rowIndex, colIndex);
    }
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    selectCell(cellIndex, isToggle) {
        this.grid.selectCell(cellIndex, isToggle);
    }
    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    getSelectedRows() {
        return this.grid.getSelectedRows();
    }
    /**
     * Gets a movable table cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    getMovableCellFromIndex(rowIndex, columnIndex) {
        return this.grid.getMovableCellFromIndex(rowIndex, columnIndex);
    }
    /**
     * Gets all the TreeGrid's movable table data rows.
     * @return {Element[]}
     */
    getMovableDataRows() {
        return this.grid.getMovableDataRows();
    }
    /**
     * Gets a movable tables row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    getMovableRowByIndex(index) {
        return this.grid.getMovableRowByIndex(index);
    }
    /**
     * Gets the TreeGrid's movable content rows from frozen treegrid.
     * @return {Element[]}
     */
    getMovableRows() {
        return this.grid.getMovableRows();
    }
    /**
     * @hidden
     */
    getFrozenColumns() {
        return this.getFrozenCount(this.columns, 0) + this.frozenColumns;
    }
    getFrozenCount(cols, cnt) {
        for (let j = 0, len = cols.length; j < len; j++) {
            if (cols[j].columns) {
                cnt = this.getFrozenCount(cols[j].columns, cnt);
            }
            else {
                if (cols[j].isFrozen) {
                    cnt++;
                }
            }
        }
        return cnt;
    }
    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    getSelectedRowIndexes() {
        return this.grid.getSelectedRowIndexes();
    }
    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    getSelectedRowCellIndexes() {
        return this.grid.getSelectedRowCellIndexes();
    }
    /**
     * Gets the collection of selected records.
     * @isGenericType true
     * @return {Object[]}
     */
    getSelectedRecords() {
        return this.grid.getSelectedRecords();
    }
    /**
     * Gets the data module.
     * @return {Data}
     */
    getDataModule() {
        return { baseModule: this.grid.getDataModule(), treeModule: this.dataModule };
    }
    /**
     * Reorder the rows based on given indexes and position
     */
    reorderRows(fromIndexes, toIndex, position) {
        this.rowDragAndDropModule.reorderRows(fromIndexes, toIndex, position);
    }
};
__decorate([
    Property(0)
], TreeGrid.prototype, "frozenRows", void 0);
__decorate([
    Property(0)
], TreeGrid.prototype, "frozenColumns", void 0);
__decorate([
    Property('Ellipsis')
], TreeGrid.prototype, "clipMode", void 0);
__decorate([
    Property([])
], TreeGrid.prototype, "columns", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "childMapping", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "hasChildMapping", void 0);
__decorate([
    Property(0)
], TreeGrid.prototype, "treeColumnIndex", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "idMapping", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "parentIdMapping", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "enableCollapseAll", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "expandStateMapping", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowRowDragAndDrop", void 0);
__decorate([
    Property([])
], TreeGrid.prototype, "dataSource", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "query", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "cloneQuery", void 0);
__decorate([
    Property('AllPages')
], TreeGrid.prototype, "printMode", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowPaging", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "loadChildOnDemand", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowTextWrap", void 0);
__decorate([
    Complex({}, TextWrapSettings)
], TreeGrid.prototype, "textWrapSettings", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowReordering", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowResizing", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "autoCheckHierarchy", void 0);
__decorate([
    Complex({}, PageSettings)
], TreeGrid.prototype, "pageSettings", void 0);
__decorate([
    Complex({}, RowDropSettings)
], TreeGrid.prototype, "rowDropSettings", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "pagerTemplate", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "showColumnMenu", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "showColumnChooser", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowSorting", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "allowMultiSorting", void 0);
__decorate([
    Complex({}, SortSettings)
], TreeGrid.prototype, "sortSettings", void 0);
__decorate([
    Collection([], AggregateRow)
], TreeGrid.prototype, "aggregates", void 0);
__decorate([
    Complex({}, EditSettings)
], TreeGrid.prototype, "editSettings", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowFiltering", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "detailTemplate", void 0);
__decorate([
    Complex({}, FilterSettings)
], TreeGrid.prototype, "filterSettings", void 0);
__decorate([
    Complex({}, SearchSettings)
], TreeGrid.prototype, "searchSettings", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "toolbar", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "toolbarTemplate", void 0);
__decorate([
    Property('Default')
], TreeGrid.prototype, "gridLines", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "contextMenuItems", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "columnMenuItems", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "rowTemplate", void 0);
__decorate([
    Property('Parent')
], TreeGrid.prototype, "copyHierarchyMode", void 0);
__decorate([
    Property(null)
], TreeGrid.prototype, "rowHeight", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "enableAltRow", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "allowKeyboard", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "enableHover", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "enableAutoFill", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "enableImmutableMode", void 0);
__decorate([
    Property('auto')
], TreeGrid.prototype, "height", void 0);
__decorate([
    Property('auto')
], TreeGrid.prototype, "width", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "enableVirtualization", void 0);
__decorate([
    Property('All')
], TreeGrid.prototype, "columnQueryMode", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "created", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "load", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "expanding", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "expanded", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "collapsing", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "collapsed", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellSave", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellSaved", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "actionBegin", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "actionComplete", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beginEdit", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "batchAdd", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "batchDelete", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "batchCancel", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforeBatchAdd", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforeBatchDelete", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforeBatchSave", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellEdit", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "actionFailure", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "dataBound", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "dataSourceChanged", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "dataStateChange", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "recordDoubleClick", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDataBound", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "detailDataBound", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "queryCellInfo", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "allowSelection", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowSelecting", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowSelected", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDeselecting", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDeselected", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "headerCellInfo", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellSelecting", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "columnMenuOpen", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "columnMenuClick", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellSelected", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellDeselecting", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "cellDeselected", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "resizeStart", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "resizing", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "resizeStop", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "columnDragStart", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "columnDrag", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "columnDrop", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "checkboxChange", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "printComplete", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforePrint", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "toolbarClick", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforeDataBound", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "contextMenuOpen", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "contextMenuClick", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforeCopy", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforePaste", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDrag", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDragStart", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDragStartHelper", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "rowDrop", void 0);
__decorate([
    Property(-1)
], TreeGrid.prototype, "selectedRowIndex", void 0);
__decorate([
    Complex({}, SelectionSettings)
], TreeGrid.prototype, "selectionSettings", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowExcelExport", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "allowPdfExport", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "pdfQueryCellInfo", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "pdfHeaderQueryCellInfo", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "excelQueryCellInfo", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "excelHeaderQueryCellInfo", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforeExcelExport", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "excelExportComplete", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beforePdfExport", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "pdfExportComplete", void 0);
TreeGrid = TreeGrid_1 = __decorate([
    NotifyPropertyChanges
], TreeGrid);

/**
 * TreeGrid Reorder module
 * @hidden
 */
class Reorder$1 {
    /**
     * Constructor for Reorder module
     */
    constructor(parent, treeColumn) {
        Grid.Inject(Reorder);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'reorder';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('getColumnIndex', this.getTreeColumn, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('getColumnIndex', this.getTreeColumn);
    }
    /**
     * To destroy the Reorder
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    getTreeColumn() {
        let columnModel = 'columnModel';
        let treeColumn = this.parent[columnModel][this.parent.treeColumnIndex];
        let treeIndex;
        let updatedCols = this.parent.getColumns();
        for (let f = 0; f < updatedCols.length; f++) {
            let treeColumnfield = getObject('field', treeColumn);
            let parentColumnfield = getObject('field', updatedCols[f]);
            if (treeColumnfield === parentColumnfield) {
                treeIndex = f;
                break;
            }
        }
        this.parent.setProperties({ treeColumnIndex: treeIndex }, true);
    }
}

/**
 * TreeGrid Resize module
 * @hidden
 */
class Resize$1 {
    /**
     * Constructor for Resize module
     */
    constructor(parent) {
        Grid.Inject(Resize);
        this.parent = parent;
    }
    /**
     * Resize by field names.
     * @param  {string|string[]} fName - Defines the field name.
     * @return {void}
     */
    autoFitColumns(fName) {
        this.parent.grid.autoFitColumns(fName);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'resize';
    }
    /**
     * Destroys the Resize.
     * @method destroy
     * @return {void}
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.grid.resizeModule.destroy();
    }
}

/**
 * TreeGrid RowDragAndDrop module
 * @hidden
 */
class RowDD$1 {
    /**
     *
     * Constructor for render module
     */
    constructor(parent) {
        /** @hidden */
        this.canDrop = true;
        /** @hidden */
        this.isDraggedWithChild = false;
        /** @hidden */
        this.isaddtoBottom = false;
        Grid.Inject(RowDD);
        this.parent = parent;
        this.addEventListener();
    }
    getChildrecordsByParentID(id) {
        let treeGridDataSource;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            treeGridDataSource = this.parent.grid.dataSource.dataSource.json;
        }
        else {
            treeGridDataSource = this.parent.grid.dataSource;
        }
        let record = treeGridDataSource.filter((e) => {
            return e.uniqueID === id;
        });
        return record;
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(rowdraging, this.Rowdraging, this);
        this.parent.on(rowDropped, this.rowDropped, this);
        this.parent.on(rowsAdd, this.rowsAdded, this);
        this.parent.on(rowsRemove, this.rowsRemoved, this);
    }
    /**
     * Reorder the rows based on given indexes and position
     */
    reorderRows(fromIndexes, toIndex, position) {
        let tObj = this.parent;
        if (fromIndexes[0] !== toIndex && position === 'above' || 'below' || 'child') {
            if (position === 'above') {
                this.dropPosition = 'topSegment';
            }
            if (position === 'below') {
                this.dropPosition = 'bottomSegment';
            }
            if (position === 'child') {
                this.dropPosition = 'middleSegment';
            }
            let data = [];
            for (let i = 0; i < fromIndexes.length; i++) {
                data[i] = this.parent.getCurrentViewRecords()[fromIndexes[i]];
            }
            let isByMethod = true;
            let args = {
                data: data,
                dropIndex: toIndex
            };
            if (!isCountRequired(this.parent)) {
                this.dropRows(args, isByMethod);
            }
            //this.refreshGridDataSource();
            if (tObj.isLocalData) {
                tObj.flatData = this.orderToIndex(tObj.flatData);
            }
            this.parent.grid.refresh();
        }
        else {
            return;
        }
    }
    orderToIndex(currentData) {
        for (let i = 0; i < currentData.length; i++) {
            currentData[i].index = i;
            if (!isNullOrUndefined(currentData[i].parentItem)) {
                let updatedParent = currentData.filter((data) => {
                    return data.uniqueID === currentData[i].parentUniqueID;
                })[0];
                currentData[i].parentItem.index = updatedParent.index;
            }
        }
        return currentData;
    }
    rowsAdded(e) {
        let draggedRecord;
        let dragRecords = e.records;
        for (let i = e.records.length - 1; i > -1; i--) {
            draggedRecord = dragRecords[i];
            if (draggedRecord.parentUniqueID) {
                let record = dragRecords.filter((data) => {
                    return data.uniqueID === draggedRecord.parentUniqueID;
                });
                if (record.length) {
                    let index = record[0].childRecords.indexOf(draggedRecord);
                    let parentRecord = record[0];
                    if (index !== -1) {
                        parentRecord.childRecords.splice(index, 1);
                        if (!parentRecord.childRecords.length) {
                            parentRecord.hasChildRecords = false;
                            parentRecord.hasFilteredChildRecords = false;
                        }
                        this.isDraggedWithChild = true;
                    }
                }
            }
        }
        if (isNullOrUndefined(this.parent.dataSource) || !this.parent.dataSource.length) {
            let tObj = this.parent;
            let draggedRecord;
            let dragRecords = e.records;
            let dragLength = e.records.length;
            for (let i = dragLength - 1; i > -1; i--) {
                draggedRecord = dragRecords[i];
                let recordIndex1 = 0;
                if (!isNullOrUndefined(draggedRecord.taskData) &&
                    !draggedRecord.taskData.hasOwnProperty(tObj.childMapping)) {
                    draggedRecord.taskData[tObj.childMapping] = [];
                }
                if (draggedRecord.hasOwnProperty(tObj.childMapping) &&
                    (draggedRecord[tObj.childMapping]).length && !this.isDraggedWithChild &&
                    !isNullOrUndefined(tObj.parentIdMapping)) {
                    let childData = (draggedRecord[tObj.childMapping]);
                    for (let j = 0; j < childData.length; j++) {
                        if (dragRecords.indexOf(childData[j]) === -1) {
                            dragRecords.splice(j, 0, childData[j]);
                            childData[j].taskData = extend({}, childData[j]);
                            i += 1;
                        }
                    }
                }
                if (draggedRecord.hasOwnProperty(tObj.parentIdMapping) && draggedRecord[tObj.parentIdMapping] != null
                    && !this.isDraggedWithChild) {
                    draggedRecord.taskData[tObj.parentIdMapping] = null;
                    delete draggedRecord.parentItem;
                    delete draggedRecord.parentUniqueID;
                }
                if (isNullOrUndefined(tObj.dataSource)) {
                    tObj.dataSource = [];
                }
                tObj.dataSource.splice(recordIndex1, 0, draggedRecord.taskData);
            }
            tObj.setProperties({ dataSource: tObj.dataSource }, false);
        }
        else {
            for (let i = 0; i < dragRecords.length; i++) {
                setValue('uniqueIDCollection.' + dragRecords[i].uniqueID, dragRecords[i], this.parent);
            }
            let args = { data: e.records, dropIndex: e.toIndex };
            if (this.parent.dataSource instanceof DataManager) {
                this.treeGridData = this.parent.dataSource.dataSource.json;
                this.treeData = this.parent.dataSource.dataSource.json;
            }
            else {
                this.treeGridData = this.parent.grid.dataSource;
                this.treeData = this.parent.dataSource;
            }
            this.dropRows(args);
        }
    }
    rowsRemoved(e) {
        for (let i = 0; i < e.records.length; i++) {
            this.draggedRecord = e.records[i];
            if (this.draggedRecord.hasChildRecords || this.draggedRecord.parentItem &&
                this.parent.grid.dataSource.
                    indexOf(this.getChildrecordsByParentID(this.draggedRecord.parentUniqueID)[0]) !== -1 ||
                this.draggedRecord.level === 0) {
                this.deleteDragRow();
            }
        }
    }
    refreshGridDataSource() {
        let draggedRecord = this.draggedRecord;
        let droppedRecord = this.droppedRecord;
        let proxy = this.parent;
        let tempDataSource;
        let idx;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            tempDataSource = proxy.dataSource.dataSource.json;
        }
        else {
            tempDataSource = proxy.dataSource;
        }
        if (tempDataSource && (!isNullOrUndefined(droppedRecord) && !droppedRecord.parentItem)) {
            for (let i = 0; i < Object.keys(tempDataSource).length; i++) {
                if (tempDataSource[i][this.parent.childMapping] === droppedRecord.taskData[this.parent.childMapping]) {
                    idx = i;
                }
            }
            if (this.dropPosition === 'topSegment') {
                if (!this.parent.idMapping) {
                    tempDataSource.splice(idx, 0, draggedRecord.taskData);
                }
            }
            else if (this.dropPosition === 'bottomSegment') {
                if (!this.parent.idMapping) {
                    tempDataSource.splice(idx + 1, 0, draggedRecord.taskData);
                }
            }
        }
        else if (!this.parent.parentIdMapping && (!isNullOrUndefined(droppedRecord) && droppedRecord.parentItem)) {
            if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                let record = this.getChildrecordsByParentID(droppedRecord.parentUniqueID)[0];
                let childRecords = record.childRecords;
                for (let i = 0; i < childRecords.length; i++) {
                    droppedRecord.parentItem.taskData[this.parent.childMapping][i] = childRecords[i].taskData;
                }
            }
        }
        if (this.parent.parentIdMapping) {
            if (draggedRecord.parentItem) {
                if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                    draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
                    draggedRecord.taskData[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
                }
                else {
                    draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.idMapping];
                    draggedRecord.taskData[this.parent.parentIdMapping] = droppedRecord[this.parent.idMapping];
                }
            }
            else {
                draggedRecord.taskData[this.parent.parentIdMapping] = null;
                draggedRecord[this.parent.parentIdMapping] = null;
            }
        }
    }
    removeFirstrowBorder(element, isRemove) {
        let canremove = this.dropPosition === 'bottomSegment';
        if (this.parent.element.getElementsByClassName('e-firstrow-border').length > 0 && element &&
            (element.rowIndex !== 0 || canremove)) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        }
    }
    removeLastrowBorder(element, isRemove) {
        let isEmptyRow = element && (element.classList.contains('e-emptyrow') || element.classList.contains('e-columnheader'));
        let islastRowIndex = element && !isEmptyRow &&
            this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') !==
                element.getAttribute('data-uid');
        let canremove = islastRowIndex || this.dropPosition === 'topSegment';
        if (this.parent.element.getElementsByClassName('e-lastrow-border').length > 0 && element && (islastRowIndex || canremove)) {
            this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
        }
    }
    updateIcon(row, index, args) {
        let rowEle = args.target ? closest(args.target, 'tr') : null;
        this.dropPosition = undefined;
        let rowPositionHeight = 0;
        this.removeFirstrowBorder(rowEle);
        this.removeLastrowBorder(rowEle);
        for (let i = 0; i < args.rows.length; i++) {
            if (!isNullOrUndefined(rowEle) && rowEle.getAttribute('data-uid') === args.rows[i].getAttribute('data-uid')
                || !parentsUntil(args.target, 'e-gridcontent')) {
                this.dropPosition = 'Invalid';
                this.addErrorElem();
            }
        }
        // To get the corresponding drop position related to mouse position 
        let tObj = this.parent;
        let rowTop = 0;
        let roundOff = 0;
        let toolHeight = tObj.toolbar && tObj.toolbar.length ?
            document.getElementById(tObj.element.id + '_gridcontrol_toolbarItems').offsetHeight : 0;
        // tObj.lastRow = tObj.getRowByIndex(tObj.getCurrentViewRecords().length - 1);
        let positionOffSet = this.getOffset(tObj.element);
        // let contentHeight1: number = (tObj.element.offsetHeight  - (tObj.getContent() as HTMLElement).offsetHeight) + positionOffSet.top;
        let contentHeight = tObj.getHeaderContent().offsetHeight + positionOffSet.top + toolHeight;
        let scrollTop = tObj.getContent().firstElementChild.scrollTop;
        if (!isNullOrUndefined(rowEle)) {
            rowPositionHeight = rowEle.offsetTop - scrollTop;
        }
        // let scrollTop = (tObj.grid.scrollModule as any).content.scrollTop;
        if (tObj.allowTextWrap) {
            rowTop = row[0].offsetHeight;
        }
        else {
            rowTop = rowPositionHeight + contentHeight + roundOff;
        }
        let rowBottom = rowTop + row[0].offsetHeight;
        let difference = rowBottom - rowTop;
        let divide = difference / 3;
        let topRowSegment = rowTop + divide;
        let middleRowSegment = topRowSegment + divide;
        let bottomRowSegment = middleRowSegment + divide;
        let posx = positionOffSet.left;
        let mouseEvent = getObject('originalEvent.event', args);
        let posy = mouseEvent.pageY;
        let isTopSegment = posy <= topRowSegment;
        let isMiddleRowSegment = (posy > topRowSegment && posy <= middleRowSegment);
        let isBottomRowSegment = (posy > middleRowSegment && posy <= bottomRowSegment);
        if (isTopSegment || isMiddleRowSegment || isBottomRowSegment) {
            if (isTopSegment && this.dropPosition !== 'Invalid') {
                this.removeChildBorder();
                this.dropPosition = 'topSegment';
                this.removetopOrBottomBorder();
                this.addFirstrowBorder(rowEle);
                this.removeErrorElem();
                this.removeLastrowBorder(rowEle);
                this.topOrBottomBorder(args.target);
            }
            if (isMiddleRowSegment && this.dropPosition !== 'Invalid') {
                this.removetopOrBottomBorder();
                let element;
                let rowElement = [];
                element = closest(args.target, 'tr');
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
                if (rowElement.length > 0) {
                    this.addRemoveClasses(rowElement, true, 'e-childborder');
                }
                this.addLastRowborder(rowEle);
                this.addFirstrowBorder(rowEle);
                this.dropPosition = 'middleSegment';
            }
            if (isBottomRowSegment && this.dropPosition !== 'Invalid') {
                this.removeErrorElem();
                this.removetopOrBottomBorder();
                this.removeChildBorder();
                this.dropPosition = 'bottomSegment';
                this.addLastRowborder(rowEle);
                this.removeFirstrowBorder(rowEle);
                this.topOrBottomBorder(args.target);
            }
        }
        return this.dropPosition;
    }
    removeChildBorder() {
        let borderElem = [];
        borderElem = [].slice.call(this.parent.element.querySelectorAll('.e-childborder'));
        if (borderElem.length > 0) {
            this.addRemoveClasses(borderElem, false, 'e-childborder');
        }
    }
    addFirstrowBorder(targetRow) {
        let node = this.parent.element;
        let tObj = this.parent;
        if (targetRow && targetRow.rowIndex === 0 && !targetRow.classList.contains('e-emptyrow')) {
            let div = this.parent.createElement('div', { className: 'e-firstrow-border' });
            let gridheaderEle = this.parent.getHeaderContent();
            let toolbarHeight = 0;
            if (tObj.toolbar) {
                toolbarHeight = tObj.toolbarModule.getToolbar().offsetHeight;
            }
            let multiplegrid = !isNullOrUndefined(this.parent.rowDropSettings.targetID);
            if (multiplegrid) {
                div.style.top = this.parent.grid.element.getElementsByClassName('e-gridheader')[0].offsetHeight
                    + toolbarHeight + 'px';
            }
            div.style.width = multiplegrid ? node.offsetWidth + 'px' :
                node.offsetWidth - this.getScrollWidth() + 'px';
            if (!gridheaderEle.querySelectorAll('.e-firstrow-border').length) {
                gridheaderEle.appendChild(div);
            }
        }
    }
    addLastRowborder(trElement) {
        let isEmptyRow = trElement && (trElement.classList.contains('e-emptyrow') ||
            trElement.classList.contains('e-columnheader'));
        if (trElement && !isEmptyRow && this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') ===
            trElement.getAttribute('data-uid')) {
            let bottomborder = this.parent.createElement('div', { className: 'e-lastrow-border' });
            let gridcontentEle = this.parent.getContent();
            bottomborder.style.width = this.parent.element.offsetWidth - this.getScrollWidth() + 'px';
            if (!gridcontentEle.querySelectorAll('.e-lastrow-border').length) {
                gridcontentEle.classList.add('e-treegrid-relative');
                gridcontentEle.appendChild(bottomborder);
                bottomborder.style.bottom = this.getScrollWidth() + 'px';
            }
        }
    }
    getScrollWidth() {
        let scrollElem = this.parent.getContent().firstElementChild;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? Scroll.getScrollBarWidth() : 0;
    }
    addErrorElem() {
        let dragelem = document.getElementsByClassName('e-cloneproperties')[0];
        let errorelem = dragelem.querySelectorAll('.e-errorelem').length;
        if (!errorelem && !this.parent.rowDropSettings.targetID) {
            let ele = document.createElement('div');
            classList(ele, ['e-errorcontainer'], []);
            classList(ele, ['e-icons', 'e-errorelem'], []);
            let errorVal = dragelem.querySelector('.errorValue');
            let content = dragelem.querySelector('.e-rowcell').innerHTML;
            if (errorVal) {
                content = errorVal.innerHTML;
                errorVal.parentNode.removeChild(errorVal);
            }
            dragelem.querySelector('.e-rowcell').innerHTML = '';
            let spanContent = document.createElement('span');
            spanContent.className = 'errorValue';
            spanContent.style.paddingLeft = '16px';
            spanContent.innerHTML = content;
            dragelem.querySelector('.e-rowcell').appendChild(ele);
            dragelem.querySelector('.e-rowcell').appendChild(spanContent);
        }
    }
    removeErrorElem() {
        let errorelem = document.querySelector('.e-errorelem');
        if (errorelem) {
            errorelem.remove();
        }
    }
    topOrBottomBorder(target) {
        let element;
        let multiplegrid = !isNullOrUndefined(this.parent.rowDropSettings.targetID);
        let rowElement = [];
        element = closest(target, 'tr');
        rowElement = element ? [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')) : [];
        if (rowElement.length) {
            if (this.dropPosition === 'topSegment') {
                this.addRemoveClasses(rowElement, true, 'e-droptop');
                if (this.parent.element.getElementsByClassName('e-lastrow-dragborder').length > 0) {
                    this.parent.element.getElementsByClassName('e-lastrow-dragborder')[0].remove();
                }
            }
            if (this.dropPosition === 'bottomSegment') {
                this.addRemoveClasses(rowElement, true, 'e-dropbottom');
            }
        }
    }
    removetopOrBottomBorder() {
        let border = [];
        border = [].slice.call(this.parent.element.querySelectorAll('.e-dropbottom, .e-droptop'));
        if (border.length) {
            this.addRemoveClasses(border, false, 'e-dropbottom');
            this.addRemoveClasses(border, false, 'e-droptop');
        }
    }
    addRemoveClasses(cells, add, className) {
        for (let i = 0, len = cells.length; i < len; i++) {
            if (add) {
                cells[i].classList.add(className);
            }
            else {
                cells[i].classList.remove(className);
            }
        }
    }
    getOffset(element) {
        let box = element.getBoundingClientRect();
        let body = document.body;
        let docElem = document.documentElement;
        let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        let clientTop = docElem.clientTop || body.clientTop || 0;
        let clientLeft = docElem.clientLeft || body.clientLeft || 0;
        let top = box.top + scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    }
    Rowdraging(args) {
        let tObj = this.parent;
        let cloneElement = this.parent.element.querySelector('.e-cloneproperties');
        cloneElement.style.cursor = '';
        let rowEle = args.target ? closest(args.target, 'tr') : null;
        let rowIdx = rowEle ? rowEle.rowIndex : -1;
        let dragRecords = [];
        let droppedRecord = tObj.getCurrentViewRecords()[rowIdx];
        this.removeErrorElem();
        this.canDrop = true;
        if (!args.data[0]) {
            dragRecords.push(args.data);
        }
        else {
            dragRecords = args.data;
        }
        if (rowIdx !== -1) {
            this.ensuredropPosition(dragRecords, droppedRecord);
        }
        else {
            this.canDrop = false;
            this.addErrorElem();
        }
        if (!tObj.rowDropSettings.targetID && this.canDrop) {
            tObj.rowDragAndDropModule.updateIcon(args.rows, rowIdx, args);
        }
        if (tObj.rowDropSettings.targetID) {
            let dropElement = parentsUntil(args.target, 'e-treegrid');
            if (dropElement && dropElement.id === this.parent.rowDropSettings.targetID) {
                let srcControl = dropElement.ej2_instances[0];
                srcControl.rowDragAndDropModule.updateIcon(args.rows, rowIdx, args);
            }
        }
        if (args.target && closest(args.target, '#' + tObj.rowDropSettings.targetID)) {
            let dropElement = parentsUntil(args.target, 'e-treegrid');
            if (!dropElement) {
                cloneElement.style.cursor = 'default';
            }
        }
    }
    rowDropped(args) {
        let tObj = this.parent;
        let parentItem = 'parentItem';
        if (!tObj.rowDropSettings.targetID) {
            if (parentsUntil(args.target, 'e-content')) {
                if (this.parent.element.querySelector('.e-errorelem')) {
                    this.dropPosition = 'Invalid';
                }
                setValue('dropPosition', this.dropPosition, args);
                args.dropIndex = args.dropIndex === args.fromIndex ? this.getTargetIdx(args.target.parentElement) : args.dropIndex;
                tObj.trigger(rowDrop, args);
                if (!args.cancel) {
                    if (!isCountRequired(this.parent)) {
                        this.dropRows(args);
                    }
                    if (tObj.isLocalData) {
                        tObj.flatData = this.orderToIndex(tObj.flatData);
                    }
                    tObj.grid.refresh();
                    if (!isNullOrUndefined(tObj.getHeaderContent().querySelector('.e-firstrow-border'))) {
                        tObj.getHeaderContent().querySelector('.e-firstrow-border').remove();
                    }
                }
            }
        }
        else {
            if (args.target && closest(args.target, '#' + tObj.rowDropSettings.targetID) || parentsUntil(args.target, 'e-treegrid') &&
                parentsUntil(args.target, 'e-treegrid').id === tObj.rowDropSettings.targetID) {
                setValue('dropPosition', this.dropPosition, args);
                tObj.trigger(rowDrop, args);
                if (!args.cancel && tObj.rowDropSettings.targetID) {
                    this.dragDropGrid(args);
                    if (tObj.isLocalData) {
                        tObj.flatData = this.orderToIndex(tObj.flatData);
                    }
                }
            }
        }
        this.removetopOrBottomBorder();
        this.removeChildBorder();
        if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-firstrow-border')[0])) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        }
        else if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-lastrow-border')[0])) {
            this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
        }
        if (this.parent.enableImmutableMode && !this.parent.allowPaging && !isNullOrUndefined(args.data[0][parentItem])) {
            let index = this.parent.treeColumnIndex;
            index = index + 1;
            let primaryKeyField = this.parent.getPrimaryKeyFieldNames()[0];
            let rowIndex = this.parent.grid.getRowIndexByPrimaryKey(args.data[0][primaryKeyField]);
            let row = this.parent.getRows()[rowIndex];
            let data = args.data[0];
            if (this.dropPosition === 'middleSegment') {
                let record = [];
                let rows = [];
                record.push(data);
                rows.push(row);
                data = args.data[0][parentItem];
                rowIndex = this.parent.grid.getRowIndexByPrimaryKey(data[primaryKeyField]);
                let parentrow = this.parent.getRows()[rowIndex];
                record.push(data);
                rows.push(parentrow);
                for (let i = 0; i < record.length; i++) {
                    this.parent.renderModule.cellRender({
                        data: record[i], cell: rows[i].cells[index],
                        column: this.parent.grid.getColumns()[this.parent.treeColumnIndex],
                        requestType: 'rowDragAndDrop'
                    });
                }
                let targetEle = parentrow.getElementsByClassName('e-treegridcollapse')[0];
                if (!isNullOrUndefined(targetEle)) {
                    removeClass([targetEle], 'e-treegridcollapse');
                    addClass([targetEle], 'e-treegridexpand');
                }
            }
            else {
                this.parent.renderModule.cellRender({
                    data: data, cell: row.cells[index],
                    column: this.parent.grid.getColumns()[this.parent.treeColumnIndex],
                    requestType: 'rowDragAndDrop'
                });
            }
        }
    }
    dragDropGrid(args) {
        let tObj = this.parent;
        let targetRow = closest(args.target, 'tr');
        let targetIndex = isNaN(this.getTargetIdx(targetRow)) ? 0 : this.getTargetIdx(targetRow);
        let dropElement = parentsUntil(args.target, 'e-treegrid');
        let srcControl;
        if (dropElement && dropElement.id === this.parent.rowDropSettings.targetID && !isRemoteData(this.parent)
            && !isCountRequired(this.parent)) {
            srcControl = dropElement.ej2_instances[0];
            let records = tObj.getSelectedRecords();
            let indexes = [];
            for (let i = 0; i < records.length; i++) {
                indexes[i] = records[i].index;
            }
            tObj.notify(rowsRemove, { indexes: indexes, records: records });
            srcControl.notify(rowsAdd, { toIndex: targetIndex, records: records });
            let srcControlFlatData = srcControl.rowDragAndDropModule.treeGridData;
            if (!isNullOrUndefined(srcControlFlatData)) {
                for (let i = 0; i < srcControlFlatData.length; i++) {
                    srcControlFlatData[i].index = i;
                    if (!isNullOrUndefined(srcControlFlatData[i].parentItem)) {
                        let actualIndex = getValue('uniqueIDCollection.' + srcControlFlatData[i].parentUniqueID + '.index', srcControl);
                        srcControlFlatData[i].parentItem.index = actualIndex;
                    }
                }
            }
            tObj.grid.refresh();
            srcControl.grid.refresh();
            if (srcControl.grid.dataSource.length > 1) {
                srcControl.grid.refresh();
                if (!isNullOrUndefined(srcControl.getHeaderContent().querySelector('.e-firstrow-border'))) {
                    srcControl.getHeaderContent().querySelector('.e-firstrow-border').remove();
                }
                if (!isNullOrUndefined(srcControl.getContent().querySelector('.e-lastrow-border'))) {
                    srcControl.getContent().querySelector('.e-lastrow-border').remove();
                }
            }
        }
        if (isCountRequired(this.parent)) {
            srcControl = dropElement.ej2_instances[0];
            tObj.grid.refresh();
            srcControl.grid.refresh();
        }
    }
    getTargetIdx(targetRow) {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    }
    getParentData(record) {
        let parentItem = record.parentItem;
        if (this.dropPosition === 'bottomSegment') {
            let selectedRecord = this.parent.getSelectedRecords()[0];
            this.droppedRecord = getParentData(this.parent, selectedRecord.parentItem.uniqueID);
        }
        if (this.dropPosition === 'middleSegment') {
            let level = this.parent.getSelectedRecords()[0].level;
            if (level === parentItem.level) {
                this.droppedRecord = getParentData(this.parent, parentItem.uniqueID);
            }
            else {
                this.getParentData(parentItem);
            }
        }
    }
    dropRows(args, isByMethod) {
        if (this.dropPosition !== 'Invalid' && !isRemoteData(this.parent)) {
            let tObj = this.parent;
            let draggedRecord;
            let droppedRecord;
            if (isNullOrUndefined(args.dropIndex)) {
                let rowIndex = tObj.getSelectedRowIndexes()[0] - 1;
                let record = tObj.getCurrentViewRecords()[rowIndex];
                this.getParentData(record);
            }
            else {
                args.dropIndex = args.dropIndex === args.fromIndex ? this.getTargetIdx(args.target.parentElement) : args.dropIndex;
                this.droppedRecord = tObj.getCurrentViewRecords()[args.dropIndex];
            }
            let dragRecords = [];
            droppedRecord = this.droppedRecord;
            if (!args.data[0]) {
                dragRecords.push(args.data);
            }
            else {
                dragRecords = args.data;
            }
            let count = 0;
            let multiplegrid = this.parent.rowDropSettings.targetID;
            this.isMultipleGrid = multiplegrid;
            let addToBottom = false;
            if (!multiplegrid) {
                this.ensuredropPosition(dragRecords, droppedRecord);
            }
            else {
                this.isaddtoBottom = addToBottom = multiplegrid && this.isDraggedWithChild;
            }
            let dragLength = dragRecords.length;
            for (let i = 0; i < dragLength; i++) {
                draggedRecord = dragRecords[i];
                this.draggedRecord = draggedRecord;
                let recordIndex = args.dropIndex;
                let isSelfReference = !isNullOrUndefined(tObj.parentIdMapping);
                if (this.dropPosition !== 'Invalid') {
                    if (!tObj.rowDropSettings.targetID || isByMethod) {
                        this.deleteDragRow();
                    }
                    if (this.draggedRecord === this.droppedRecord) {
                        let correctIndex = this.getTargetIdx(args.target.offsetParent.parentElement);
                        if (isNaN(correctIndex)) {
                            correctIndex = this.getTargetIdx(args.target.parentElement);
                        }
                        recordIndex = args.dropIndex = correctIndex;
                        droppedRecord = this.droppedRecord = this.parent.getCurrentViewRecords()[args.dropIndex];
                    }
                    let recordIndex1 = this.treeGridData.indexOf(droppedRecord);
                    this.dropAtTop(recordIndex1, isSelfReference, i);
                    if (this.dropPosition === 'bottomSegment') {
                        if (!droppedRecord.hasChildRecords) {
                            if (this.parent.parentIdMapping) {
                                this.treeData.splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                        }
                        else {
                            count = this.getChildCount(droppedRecord, 0);
                            if (this.parent.parentIdMapping) {
                                this.treeData.splice(recordIndex1 + count + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + count + 1, 0, this.draggedRecord);
                        }
                        draggedRecord.parentItem = this.treeGridData[recordIndex1].parentItem;
                        draggedRecord.parentUniqueID = this.treeGridData[recordIndex1].parentUniqueID;
                        draggedRecord.level = this.treeGridData[recordIndex1].level;
                        if (draggedRecord.hasChildRecords) {
                            let level = 1;
                            this.updateChildRecordLevel(draggedRecord, level);
                            this.updateChildRecord(draggedRecord, recordIndex1 + count + 1);
                        }
                        if (droppedRecord.parentItem) {
                            let rec = this.getChildrecordsByParentID(droppedRecord.parentUniqueID);
                            let childRecords = rec[0].childRecords;
                            let droppedRecordIndex = childRecords.indexOf(droppedRecord) + 1;
                            childRecords.splice(droppedRecordIndex, 0, draggedRecord);
                        }
                    }
                    this.dropMiddle(recordIndex, recordIndex1, args, isByMethod, isSelfReference, i);
                }
                if (isNullOrUndefined(draggedRecord.parentItem)) {
                    let parentRecords = tObj.parentData;
                    let newParentIndex = parentRecords.indexOf(this.droppedRecord);
                    if (this.dropPosition === 'bottomSegment') {
                        parentRecords.splice(newParentIndex + 1, 0, draggedRecord);
                    }
                    else if (this.dropPosition === 'topSegment') {
                        parentRecords.splice(newParentIndex, 0, draggedRecord);
                    }
                }
                tObj.rowDragAndDropModule.refreshGridDataSource();
            }
        }
    }
    dropMiddle(recordIndex, recordIndex1, args, isSelfReference, isByMethod, i) {
        let tObj = this.parent;
        let childRecords = findChildrenRecords(this.droppedRecord);
        let childRecordsLength = (isNullOrUndefined(childRecords) ||
            childRecords.length === 0) ? recordIndex1 + 1 :
            childRecords.length + recordIndex1 + 1;
        if (this.dropPosition === 'middleSegment') {
            if (tObj.parentIdMapping) {
                this.treeData.splice(childRecordsLength, 0, this.draggedRecord.taskData);
                this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            }
            else {
                this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            }
            this.recordLevel();
            if (this.draggedRecord.hasChildRecords) {
                this.updateChildRecord(this.draggedRecord, childRecordsLength, this.droppedRecord.expanded);
            }
        }
    }
    dropAtTop(recordIndex1, isSelfReference, i) {
        let tObj = this.parent;
        if (this.dropPosition === 'topSegment') {
            if (tObj.parentIdMapping) {
                this.treeData.splice(recordIndex1, 0, this.draggedRecord.taskData);
            }
            this.draggedRecord.parentItem = this.treeGridData[recordIndex1].parentItem;
            this.draggedRecord.parentUniqueID = this.treeGridData[recordIndex1].parentUniqueID;
            this.draggedRecord.level = this.treeGridData[recordIndex1].level;
            this.treeGridData.splice(recordIndex1, 0, this.draggedRecord);
            if (this.draggedRecord.hasChildRecords) {
                let level = 1;
                this.updateChildRecord(this.draggedRecord, recordIndex1);
                this.updateChildRecordLevel(this.draggedRecord, level);
            }
            if (this.droppedRecord.parentItem) {
                let rec = this.getChildrecordsByParentID(this.droppedRecord.parentUniqueID);
                let childRecords = rec[0].childRecords;
                let droppedRecordIndex = childRecords.indexOf(this.droppedRecord);
                childRecords.splice(droppedRecordIndex, 0, this.draggedRecord);
            }
        }
    }
    recordLevel() {
        let tObj = this.parent;
        let draggedRecord = this.draggedRecord;
        let droppedRecord = this.droppedRecord;
        let childItem = tObj.childMapping;
        if (!droppedRecord.hasChildRecords) {
            droppedRecord.hasChildRecords = true;
            droppedRecord.hasFilteredChildRecords = true;
            if (isNullOrUndefined(droppedRecord.childRecords)) {
                droppedRecord.childRecords = [];
                if (!tObj.parentIdMapping && isNullOrUndefined(droppedRecord.taskData[childItem])) {
                    droppedRecord.taskData[childItem] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            let parentItem = extend({}, droppedRecord);
            delete parentItem.childRecords;
            draggedRecord.parentItem = parentItem;
            draggedRecord.parentUniqueID = droppedRecord.uniqueID;
            droppedRecord.childRecords.splice(droppedRecord.childRecords.length, 0, draggedRecord);
            if (!isNullOrUndefined(draggedRecord) && !tObj.parentIdMapping && !isNullOrUndefined(droppedRecord.taskData[childItem])) {
                droppedRecord.taskData[tObj.childMapping].splice(droppedRecord.childRecords.length, 0, draggedRecord.taskData);
            }
            if (!draggedRecord.hasChildRecords) {
                draggedRecord.level = droppedRecord.level + 1;
            }
            else {
                let level = 1;
                draggedRecord.level = droppedRecord.level + 1;
                this.updateChildRecordLevel(draggedRecord, level);
            }
            droppedRecord.expanded = true;
            // if (tObj.isLocalData) {
            //     tObj.parentData.push(droppedRecord);
            // }
        }
    }
    deleteDragRow() {
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            this.treeGridData = this.parent.grid.dataSource.dataSource.json;
            this.treeData = this.parent.dataSource.dataSource.json;
        }
        else {
            this.treeGridData = this.parent.grid.dataSource;
            this.treeData = this.parent.dataSource;
        }
        let deletedRow;
        deletedRow = getParentData(this.parent, this.draggedRecord.uniqueID);
        this.removeRecords(deletedRow);
    }
    updateChildRecord(record, count, expanded$$1) {
        let currentRecord;
        let tObj = this.parent;
        let length = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            tObj.flatData.splice(count, 0, currentRecord);
            setValue('uniqueIDCollection.' + currentRecord.uniqueID, currentRecord, this.parent);
            if (tObj.parentIdMapping) {
                this.treeData.splice(count, 0, currentRecord.taskData);
            }
            if (currentRecord.hasChildRecords) {
                count = this.updateChildRecord(currentRecord, count);
            }
        }
        return count;
    }
    updateChildRecordLevel(record, level) {
        let length = 0;
        let currentRecord;
        level++;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            let parentData;
            if (record.parentItem) {
                parentData = getParentData(this.parent, record.parentItem.uniqueID);
            }
            currentRecord.level = record.parentItem ? parentData.level + level : record.level + 1;
            if (currentRecord.hasChildRecords) {
                level--;
                level = this.updateChildRecordLevel(currentRecord, level);
            }
        }
        return level;
    }
    removeRecords(record) {
        let tObj = this.parent;
        let dataSource;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            dataSource = this.parent.dataSource.dataSource.json;
        }
        else {
            dataSource = this.parent.dataSource;
        }
        let deletedRow = record;
        let isSelfReference = !isNullOrUndefined(tObj.parentIdMapping);
        let flatParentData = this.getChildrecordsByParentID(deletedRow.parentUniqueID)[0];
        if (deletedRow) {
            if (deletedRow.parentItem) {
                let childRecords = flatParentData ? flatParentData.childRecords : [];
                let childIndex = 0;
                if (childRecords && childRecords.length > 0) {
                    childIndex = childRecords.indexOf(deletedRow);
                    flatParentData.childRecords.splice(childIndex, 1);
                    if (!this.parent.parentIdMapping) {
                        editAction({ value: deletedRow, action: 'delete' }, this.parent, isSelfReference, deletedRow.index, deletedRow.index);
                    }
                }
            }
            if (tObj.parentIdMapping) {
                if (deletedRow.hasChildRecords && deletedRow.childRecords.length > 0) {
                    this.removeChildItem(deletedRow);
                }
                let idx;
                let idz;
                let treeGridData = dataSource;
                for (let i = 0; i < treeGridData.length; i++) {
                    if (treeGridData[i][this.parent.idMapping] === deletedRow.taskData[this.parent.idMapping]) {
                        idx = i;
                    }
                }
                for (let i = 0; i < this.treeGridData.length; i++) {
                    if (this.treeGridData[i][this.parent.idMapping] === deletedRow.taskData[this.parent.idMapping]) {
                        idz = i;
                    }
                }
                if (idx !== -1 || idz !== -1) {
                    dataSource.splice(idx, 1);
                    this.treeGridData.splice(idz, 1);
                }
            }
            let recordIndex = this.treeGridData.indexOf(deletedRow);
            if (!tObj.parentIdMapping) {
                let parentIndex = this.parent.parentData.indexOf(deletedRow);
                if (parentIndex !== -1) {
                    tObj.parentData.splice(parentIndex, 1);
                    dataSource.splice(parentIndex, 1);
                }
            }
            if (recordIndex === -1 && !tObj.parentIdMapping) {
                let primaryKeyField = tObj.getPrimaryKeyFieldNames()[0];
                for (let j = 0; j < this.treeGridData.length; j++) {
                    if (this.treeGridData[j][primaryKeyField] === deletedRow[primaryKeyField]) {
                        recordIndex = j;
                    }
                }
            }
            if (!tObj.parentIdMapping) {
                let deletedRecordCount = this.getChildCount(deletedRow, 0);
                this.treeGridData.splice(recordIndex, deletedRecordCount + 1);
            }
            if (deletedRow.parentItem && flatParentData && flatParentData.childRecords && !flatParentData.childRecords.length) {
                flatParentData.expanded = false;
                flatParentData.hasChildRecords = false;
                flatParentData.hasFilteredChildRecords = false;
            }
        }
    }
    removeChildItem(record) {
        let tObj = this.parent;
        let currentRecord;
        let idx;
        let idz;
        let dataSource;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            dataSource = this.parent.dataSource.dataSource.json;
        }
        else {
            dataSource = this.parent.dataSource;
        }
        for (let i = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            let treeGridData;
            if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
                treeGridData = this.parent.dataSource.dataSource.json;
            }
            else {
                treeGridData = this.parent.dataSource;
            }
            for (let i = 0; i < treeGridData.length; i++) {
                if (treeGridData[i][this.parent.idMapping] === currentRecord.taskData[this.parent.idMapping]) {
                    idx = i;
                }
            }
            for (let i = 0; i < this.treeGridData.length; i++) {
                if (this.treeGridData[i][this.parent.idMapping] === currentRecord.taskData[this.parent.idMapping]) {
                    idz = i;
                    break;
                }
            }
            if (idx !== -1 || idz !== -1) {
                dataSource.splice(idx, 1);
                this.treeGridData.splice(idz, 1);
            }
            if (currentRecord.hasChildRecords) {
                this.removeChildItem(currentRecord);
            }
        }
    }
    getChildCount(record, count) {
        let currentRecord;
        if (!record.hasChildRecords) {
            return 0;
        }
        for (let i = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            if (currentRecord.hasChildRecords) {
                count = this.getChildCount(currentRecord, count);
            }
        }
        return count;
    }
    ensuredropPosition(draggedRecords, currentRecord) {
        let tObj = this.parent;
        let rowDragMoudule = this;
        draggedRecords.filter((e) => {
            if (e.hasChildRecords && !isNullOrUndefined(e.childRecords)) {
                let valid = e.childRecords.indexOf(currentRecord);
                if (valid === -1) {
                    rowDragMoudule.ensuredropPosition(e.childRecords, currentRecord);
                }
                else {
                    rowDragMoudule.dropPosition = 'Invalid';
                    rowDragMoudule.addErrorElem();
                    rowDragMoudule.canDrop = false;
                    return;
                }
            }
        });
    }
    destroy() {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(rowdraging, this.Rowdraging);
        this.parent.off(rowDropped, this.rowDropped);
        this.parent.off(rowsAdd, this.rowsAdded);
        this.parent.off(rowsRemove, this.rowsRemoved);
    }
    /**
     * hidden
     */
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'rowDragAndDrop';
    }
}

/**
 * Base export
 */

var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the row drop settings of the TreeGrid.
 */
class RowDropSettings$1 extends ChildProperty {
}
__decorate$9([
    Property()
], RowDropSettings$1.prototype, "targetID", void 0);

/**
 * Models export
 */

/**
 * RowModelGenerator is used to generate grid data rows.
 * @hidden
 */
class TreeVirtualRowModelGenerator extends VirtualRowModelGenerator {
    constructor(parent) {
        super(parent);
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on(dataListener, this.getDatas, this);
    }
    getDatas(args) {
        this.visualData = args.data;
    }
    generateRows(data, notifyArgs) {
        if ((this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.url !== undefined
            && this.parent.dataSource.dataSource.url !== '') || isCountRequired(this.parent)) {
            return super.generateRows(data, notifyArgs);
        }
        else {
            if (!isNullOrUndefined(notifyArgs.requestType) && notifyArgs.requestType.toString() === 'collapseAll') {
                notifyArgs.requestType = 'refresh';
            }
            let rows = super.generateRows(data, notifyArgs);
            for (let r = 0; r < rows.length; r++) {
                rows[r].index = (this.visualData).indexOf(rows[r].data);
            }
            return rows;
        }
    }
    checkAndResetCache(action) {
        let clear = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'reorder',
            'save', 'delete'].some((value) => action === value);
        if ((this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.url !== undefined
            && this.parent.dataSource.dataSource.url !== '') || isCountRequired(this.parent)) {
            let model = 'model';
            let currentPage = this[model].currentPage;
            if (clear) {
                this.cache = {};
                this.data = {};
                this.groups = {};
            }
            else if (action === 'virtualscroll' && this.cache[currentPage] &&
                this.cache[currentPage].length > (this.parent.contentModule).getBlockSize()) {
                delete this.cache[currentPage];
            }
        }
        else {
            if (clear || action === 'virtualscroll') {
                this.cache = {};
                this.data = {};
                this.groups = {};
            }
        }
        return clear;
    }
}

/**
 * Renderer export
 */

/**
 * TreeGrid Filter module will handle filtering action
 * @hidden
 */
class Filter$1 {
    /**
     * Constructor for Filter module
     */
    constructor(parent) {
        Grid.Inject(Filter);
        this.parent = parent;
        this.isHierarchyFilter = false;
        this.filteredResult = [];
        this.flatFilteredData = [];
        this.filteredParentRecs = [];
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'filter';
    }
    /**
     * To destroy the Filter module
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('updateFilterRecs', this.updatedFilteredRecord, this);
        this.parent.on('clearFilters', this.clearFilterLevel, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateFilterRecs', this.updatedFilteredRecord);
        this.parent.off('clearFilters', this.clearFilterLevel);
    }
    /**
     * Function to update filtered records
     *  @hidden
     */
    updatedFilteredRecord(dataDetails) {
        setValue('uniqueIDFilterCollection', {}, this.parent);
        this.flatFilteredData = dataDetails.data;
        this.filteredParentRecs = [];
        this.filteredResult = [];
        this.isHierarchyFilter = false;
        for (let f = 0; f < this.flatFilteredData.length; f++) {
            let rec = this.flatFilteredData[f];
            this.addParentRecord(rec);
            let hierarchyMode = this.parent.grid.searchSettings.key === '' ? this.parent.filterSettings.hierarchyMode
                : this.parent.searchSettings.hierarchyMode;
            if (((hierarchyMode === 'Child' || hierarchyMode === 'None') &&
                (this.parent.grid.filterSettings.columns.length !== 0 || this.parent.grid.searchSettings.key !== ''))) {
                this.isHierarchyFilter = true;
            }
            let ischild = getObject('childRecords', rec);
            if (!isNullOrUndefined(ischild) && ischild.length) {
                setValue('hasFilteredChildRecords', this.checkChildExsist(rec), rec);
            }
            let parent = getObject('parentItem', rec);
            if (!isNullOrUndefined(parent)) {
                let parRecord = getParentData(this.parent, rec.parentItem.uniqueID, true);
                //let parRecord: Object = this.flatFilteredData.filter((e: ITreeData) => {
                //          return e.uniqueID === rec.parentItem.uniqueID; })[0];
                setValue('hasFilteredChildRecords', true, parRecord);
                if (parRecord && parRecord.parentItem) {
                    this.updateParentFilteredRecord(parRecord);
                }
            }
        }
        if (this.flatFilteredData.length > 0 && this.isHierarchyFilter) {
            this.updateFilterLevel();
        }
        this.parent.notify('updateAction', { result: this.filteredResult });
    }
    updateParentFilteredRecord(record) {
        let parRecord = getParentData(this.parent, record.parentItem.uniqueID, true);
        let uniqueIDValue = getValue('uniqueIDFilterCollection', this.parent);
        if (parRecord && uniqueIDValue.hasOwnProperty(parRecord.uniqueID)) {
            setValue('hasFilteredChildRecords', true, parRecord);
        }
        if (parRecord && parRecord.parentItem) {
            this.updateParentFilteredRecord(parRecord);
        }
    }
    ;
    addParentRecord(record) {
        let parent = getParentData(this.parent, record.parentUniqueID);
        //let parent: Object = this.parent.flatData.filter((e: ITreeData) => {return e.uniqueID === record.parentUniqueID; })[0];
        let hierarchyMode = this.parent.grid.searchSettings.key === '' ? this.parent.filterSettings.hierarchyMode
            : this.parent.searchSettings.hierarchyMode;
        if (hierarchyMode === 'None' && (this.parent.grid.filterSettings.columns.length !== 0
            || this.parent.grid.searchSettings.key !== '')) {
            if (isNullOrUndefined(parent)) {
                if (this.flatFilteredData.indexOf(record) !== -1) {
                    if (this.filteredResult.indexOf(record) === -1) {
                        this.filteredResult.push(record);
                        setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
                        record.hasFilteredChildRecords = true;
                    }
                    return;
                }
            }
            else {
                this.addParentRecord(parent);
                if (this.flatFilteredData.indexOf(parent) !== -1 || this.filteredResult.indexOf(parent) !== -1) {
                    if (this.filteredResult.indexOf(record) === -1) {
                        this.filteredResult.push(record);
                        setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
                    }
                }
                else {
                    if (this.filteredResult.indexOf(record) === -1 && this.flatFilteredData.indexOf(record) !== -1) {
                        this.filteredResult.push(record);
                        setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
                    }
                }
            }
        }
        else {
            if (!isNullOrUndefined(parent)) {
                let hierarchyMode = this.parent.grid.searchSettings.key === '' ?
                    this.parent.filterSettings.hierarchyMode : this.parent.searchSettings.hierarchyMode;
                if (hierarchyMode === 'Child' && (this.parent.grid.filterSettings.columns.length !== 0
                    || this.parent.grid.searchSettings.key !== '')) {
                    if (this.flatFilteredData.indexOf(parent) !== -1) {
                        this.addParentRecord(parent);
                    }
                }
                else {
                    this.addParentRecord(parent);
                }
            }
            if (this.filteredResult.indexOf(record) === -1) {
                this.filteredResult.push(record);
                setValue('uniqueIDFilterCollection.' + record.uniqueID, record, this.parent);
            }
        }
    }
    checkChildExsist(records) {
        let childRec = getObject('childRecords', records);
        let isExist = false;
        for (let count = 0; count < childRec.length; count++) {
            let ischild = childRec[count].childRecords;
            let hierarchyMode = this.parent.grid.searchSettings.key === '' ?
                this.parent.filterSettings.hierarchyMode : this.parent.searchSettings.hierarchyMode;
            if (((hierarchyMode === 'Child' || hierarchyMode === 'Both') && (this.parent.grid.filterSettings.columns.length !== 0
                || this.parent.grid.searchSettings.key !== ''))) {
                let uniqueIDValue = getValue('uniqueIDFilterCollection', this.parent);
                if (!uniqueIDValue.hasOwnProperty(childRec[count].uniqueID)) {
                    this.filteredResult.push(childRec[count]);
                    setValue('uniqueIDFilterCollection.' + childRec[count].uniqueID, childRec[count], this.parent);
                    isExist = true;
                }
            }
            if ((hierarchyMode === 'None')
                && (this.parent.grid.filterSettings.columns.length !== 0 || this.parent.grid.searchSettings.key !== '')) {
                if (this.flatFilteredData.indexOf(childRec[count]) !== -1) {
                    isExist = true;
                    break;
                }
            }
            if (!isNullOrUndefined(ischild) && ischild.length) {
                isExist = this.checkChildExsist(childRec[count]);
            }
            if ((hierarchyMode === 'Child' || hierarchyMode === 'Both') && childRec.length) {
                isExist = true;
            }
        }
        return isExist;
    }
    updateFilterLevel() {
        let record = this.filteredResult;
        let len = this.filteredResult.length;
        for (let c = 0; c < len; c++) {
            let parent = getParentData(this.parent, record[c].parentUniqueID);
            let isPrst = record.indexOf(parent) !== -1;
            if (isPrst) {
                let parent = getParentData(this.parent, record[c].parentUniqueID, true);
                record[c].filterLevel = parent.filterLevel + 1;
            }
            else {
                record[c].filterLevel = 0;
                this.filteredParentRecs.push(record[c]);
            }
        }
    }
    clearFilterLevel(data) {
        let count = 0;
        let flatData = data.flatData;
        let len = flatData.length;
        let currentRecord;
        for (count; count < len; count++) {
            currentRecord = flatData[count];
            let fLevel = currentRecord.filterLevel;
            if (fLevel || fLevel === 0 || !isNullOrUndefined(currentRecord.hasFilteredChildRecords)) {
                currentRecord.hasFilteredChildRecords = null;
                currentRecord.filterLevel = null;
            }
        }
        this.filteredResult = [];
        this.parent.notify('updateResults', { result: flatData, count: flatData.length });
    }
}

/**
 * TreeGrid Excel Export module
 * @hidden
 */
class ExcelExport$1 {
    /**
     * Constructor for Excel Export module
     */
    constructor(parent) {
        Grid.Inject(ExcelExport);
        this.parent = parent;
        this.dataResults = {};
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'ExcelExport';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('updateResults', this.updateExcelResultModel, this);
        this.parent.on('excelCellInfo', this.excelQueryCellInfo, this);
        this.parent.grid.on('export-RowDataBound', this.exportRowDataBound, this);
        this.parent.grid.on('finalPageSetup', this.finalPageSetup, this);
    }
    /**
     * To destroy the Excel Export
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateResults', this.updateExcelResultModel);
        this.parent.off('excelCellInfo', this.excelQueryCellInfo);
        this.parent.grid.off('export-RowDataBound', this.exportRowDataBound);
        this.parent.grid.off('finalPageSetup', this.finalPageSetup);
    }
    updateExcelResultModel(returnResult) {
        this.dataResults = returnResult;
    }
    Map(excelExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, workbook, isBlob, isCsv) {
        let dataSource = this.parent.dataSource;
        let property = Object();
        setValue('isCsv', isCsv, property);
        setValue('cancel', false, property);
        return new Promise((resolve, reject) => {
            let dm = this.isLocal() ? new DataManager(dataSource) : this.parent.dataSource;
            let query = new Query();
            if (!this.isLocal()) {
                query = this.generateQuery(query);
                setValue('query', query, property);
            }
            this.parent.trigger(beforeExcelExport, extend(property, excelExportProperties));
            if (getObject('cancel', property)) {
                return null;
            }
            dm.executeQuery(query).then((e) => {
                let customData = null;
                if (!isNullOrUndefined(excelExportProperties) && !isNullOrUndefined(excelExportProperties.dataSource)) {
                    customData = excelExportProperties.dataSource;
                }
                excelExportProperties = this.manipulateExportProperties(excelExportProperties, dataSource, e);
                return this.parent.grid.excelExportModule.Map(this.parent.grid, excelExportProperties, isMultipleExport, workbook, isCsv, isBlob).then((book) => {
                    if (customData != null) {
                        excelExportProperties.dataSource = customData;
                    }
                    else {
                        delete excelExportProperties.dataSource;
                    }
                    resolve(book);
                });
            });
        });
    }
    generateQuery(query, property) {
        if (!isNullOrUndefined(property) && property.exportType === 'CurrentPage'
            && this.parent.allowPaging) {
            property.exportType = 'AllPages';
            query.addParams('ExportType', 'CurrentPage');
            query.where(this.parent.parentIdMapping, 'equal', null);
            query = getObject('grid.renderModule.data.pageQuery', this.parent)(query);
        }
        return query;
    }
    manipulateExportProperties(property, dtSrc, queryResult) {
        //count not required for this query
        let args = Object();
        setValue('query', this.parent.grid.getDataModule().generateQuery(true), args);
        setValue('isExport', true, args);
        if (!isNullOrUndefined(property) && !isNullOrUndefined(property.exportType)) {
            setValue('exportType', property.exportType, args);
        }
        if (!this.isLocal() || !isNullOrUndefined(this.parent.parentIdMapping)) {
            this.parent.parentData = [];
            this.parent.dataModule.convertToFlatData(getObject('result', queryResult));
            setValue('expresults', this.parent.flatData, args);
        }
        this.parent.notify('dataProcessor', args);
        //args = this.parent.dataModule.dataProcessor(args);
        args = this.dataResults;
        dtSrc = isNullOrUndefined(args.result) ? this.parent.flatData.slice(0) : args.result;
        if (!this.isLocal()) {
            this.parent.flatData = [];
        }
        if (property && property.dataSource && this.isLocal()) {
            let flatsData = this.parent.flatData;
            let dataSrc = property.dataSource instanceof DataManager ? property.dataSource.dataSource.json : property.dataSource;
            this.parent.dataModule.convertToFlatData(dataSrc);
            dtSrc = this.parent.flatData;
            this.parent.flatData = flatsData;
        }
        property = isNullOrUndefined(property) ? Object() : property;
        property.dataSource = new DataManager({ json: dtSrc });
        return property;
    }
    /**
     * TreeGrid Excel Export cell modifier
     * @hidden
     */
    excelQueryCellInfo(args) {
        if (this.parent.grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            let style = {};
            let data = args.data;
            let ispadfilter = isNullOrUndefined(data.filterLevel);
            let pad = ispadfilter ? data.level : data.filterLevel;
            style.indent = pad;
            args.style = style;
        }
        this.parent.notify('updateResults', args);
        this.parent.trigger('excelQueryCellInfo', args);
    }
    exportRowDataBound(excelRow) {
        if (excelRow.type === 'excel') {
            let excelrowobj = excelRow.rowObj.data;
            let filtercolumnlength = this.parent.grid.filterSettings.columns.length;
            if (excelrowobj.parentItem && getParentData(this.parent, excelrowobj.parentItem.uniqueID, Boolean(filtercolumnlength))) {
                let rowlength = excelRow.excelRows.length;
                let rowlevel = excelrowobj.level;
                excelRow.excelRows[rowlength - 1].grouping = { outlineLevel: rowlevel, isCollapsed: false };
            }
        }
    }
    /* tslint:disable-next-line:max-func-body-length */
    finalPageSetup(/* tslint:disable-next-line:no-any */ workbook) {
        for (let i = 0; i < workbook.worksheets.length; i++) {
            if (workbook.worksheets[i].rows) {
                workbook.worksheets[i].pageSetup = { isSummaryRowBelow: false };
            }
        }
    }
    isLocal() {
        return !isRemoteData(this.parent) && isOffline(this.parent);
    }
}

/**
 * TreeGrid PDF Export module
 * @hidden
 */
class PdfExport$1 {
    /**
     * Constructor for PDF export module
     */
    constructor(parent) {
        Grid.Inject(PdfExport);
        this.parent = parent;
        this.dataResults = {};
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'PdfExport';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('pdfCellInfo', this.pdfQueryCellInfo, this);
        this.parent.on('updateResults', this.updatePdfResultModel, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('pdfCellInfo', this.pdfQueryCellInfo);
        this.parent.off('updateResults', this.updatePdfResultModel);
    }
    /**
     * To destroy the PDF Export
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    updatePdfResultModel(returnResult) {
        this.dataResults = returnResult;
    }
    Map(pdfExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, pdfDoc, isBlob) {
        let dtSrc = this.parent.dataSource;
        let prop = Object();
        let isLocal = !isRemoteData(this.parent) && isOffline(this.parent);
        setValue('cancel', false, prop);
        return new Promise((resolve, reject) => {
            let dm = isLocal ? new DataManager(dtSrc) : this.parent.dataSource;
            let query = new Query();
            if (!isLocal) {
                query = this.generateQuery(query);
                setValue('query', query, prop);
            }
            this.parent.trigger(beforePdfExport, extend(prop, pdfExportProperties));
            if (getObject('cancel', prop)) {
                return null;
            }
            dm.executeQuery(query).then((e) => {
                let customsData = null;
                if (!isNullOrUndefined(pdfExportProperties) && !isNullOrUndefined(pdfExportProperties.dataSource)) {
                    customsData = pdfExportProperties.dataSource;
                }
                pdfExportProperties = this.manipulatePdfProperties(pdfExportProperties, dtSrc, e);
                return this.parent.grid.pdfExportModule.Map(this.parent.grid, pdfExportProperties, isMultipleExport, pdfDoc, isBlob).then((document) => {
                    if (customsData != null) {
                        pdfExportProperties.dataSource = customsData;
                    }
                    else {
                        delete pdfExportProperties.dataSource;
                    }
                    resolve(document);
                });
            });
        });
    }
    generateQuery(query, prop) {
        if (!isNullOrUndefined(prop) && prop.exportType === 'CurrentPage'
            && this.parent.allowPaging) {
            prop.exportType = 'AllPages';
            query.addParams('ExportType', 'CurrentPage');
            query.where(this.parent.parentIdMapping, 'equal', null);
            query = getObject('grid.renderModule.data.pageQuery', this.parent)(query);
        }
        return query;
    }
    manipulatePdfProperties(prop, dtSrc, queryResult) {
        let args = {};
        //count not required for this query  
        let isLocal = !isRemoteData(this.parent) && isOffline(this.parent);
        setValue('query', this.parent.grid.getDataModule().generateQuery(true), args);
        setValue('isExport', true, args);
        if (!isNullOrUndefined(prop) && !isNullOrUndefined(prop.exportType)) {
            setValue('exportType', prop.exportType, args);
        }
        if (!isLocal || !isNullOrUndefined(this.parent.parentIdMapping)) {
            this.parent.parentData = [];
            this.parent.dataModule.convertToFlatData(getValue('result', queryResult));
            setValue('expresults', this.parent.flatData, args);
        }
        this.parent.notify('dataProcessor', args);
        //args = this.parent.dataModule.dataProcessor(args);
        args = this.dataResults;
        dtSrc = isNullOrUndefined(args.result) ? this.parent.flatData.slice(0) : args.result;
        if (!isLocal) {
            this.parent.flatData = [];
        }
        if (prop && prop.dataSource && isLocal) {
            let flatDatas = this.parent.flatData;
            let dataSrc = prop.dataSource instanceof DataManager ? prop.dataSource.dataSource.json : prop.dataSource;
            this.parent.dataModule.convertToFlatData(dataSrc);
            dtSrc = this.parent.flatData;
            this.parent.flatData = flatDatas;
        }
        prop = isNullOrUndefined(prop) ? {} : prop;
        prop.dataSource = new DataManager({ json: dtSrc });
        return prop;
    }
    /**
     * TreeGrid PDF Export cell modifier
     * @hidden
     */
    pdfQueryCellInfo(args) {
        if (this.parent.grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            let style = {};
            let data = getObject('data', args);
            let ispadfilter = isNullOrUndefined(data.filterLevel);
            let pad = ispadfilter ? data.level : data.filterLevel;
            style.paragraphIndent = pad * 3;
            args.style = style;
        }
        this.parent.notify('updateResults', args);
        this.parent.trigger('pdfQueryCellInfo', args);
    }
}

/**
 * The `Page` module is used to render pager and handle paging action.
 * @hidden
 */
class Page$1 {
    constructor(parent) {
        Grid.Inject(Page);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(localPagedExpandCollapse, this.collapseExpandPagedchilds, this);
        this.parent.on(pagingActions, this.pageAction, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(localPagedExpandCollapse, this.collapseExpandPagedchilds);
        this.parent.off(pagingActions, this.pageAction);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'pager';
    }
    /**
     * Refreshes the page count, pager information, and external message.
     * @return {void}
     */
    refresh() {
        this.parent.grid.pagerModule.refresh();
    }
    /**
     * To destroy the pager
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * Navigates to the target page according to the given number.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    goToPage(pageNo) {
        this.parent.grid.pagerModule.goToPage(pageNo);
    }
    /**
     * Defines the text of the external message.
     * @param  {string} message - Defines the message to update.
     * @return {void}
     */
    updateExternalMessage(message) {
        this.parent.grid.pagerModule.updateExternalMessage(message);
    }
    /**
     * @hidden
     */
    collapseExpandPagedchilds(rowDetails) {
        rowDetails.record.expanded = rowDetails.action === 'collapse' ? false : true;
        if (isBlazor()) {
            this.parent.flatData.filter((e) => {
                return e.uniqueID === rowDetails.record.uniqueID;
            })[0].expanded = rowDetails.action === 'collapse' ? false : true;
        }
        let ret = {
            result: this.parent.flatData,
            row: rowDetails.row,
            action: rowDetails.action,
            record: rowDetails.record,
            count: this.parent.flatData.length
        };
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret);
        if (this.parent.enableImmutableMode) {
            let row = 'row';
            let action = 'action';
            let targetEle;
            if (ret[action] === 'collapse') {
                targetEle = ret[row].getElementsByClassName('e-treegridexpand')[0];
                if (!isNullOrUndefined(targetEle)) {
                    removeClass([targetEle], 'e-treegridexpand');
                    addClass([targetEle], 'e-treegridcollapse');
                }
            }
            else if (ret[action] === 'expand') {
                targetEle = ret[row].getElementsByClassName('e-treegridcollapse')[0];
                if (!isNullOrUndefined(targetEle)) {
                    removeClass([targetEle], 'e-treegridcollapse');
                    addClass([targetEle], 'e-treegridexpand');
                }
            }
        }
    }
    pageRoot(pagedResults, temp, result) {
        let newResults = isNullOrUndefined(result) ? [] : result;
        for (let t = 0; t < temp.length; t++) {
            newResults.push(temp[t]);
            let res = [];
            if (temp[t].hasChildRecords) {
                res = pagedResults.filter((e) => {
                    return temp[t].uniqueID === e.parentUniqueID;
                });
                newResults = this.pageRoot(pagedResults, res, newResults);
            }
        }
        return newResults;
    }
    pageAction(pageingDetails) {
        let dm = new DataManager(pageingDetails.result);
        if (this.parent.pageSettings.pageSizeMode === 'Root') {
            let temp = [];
            let propname = (this.parent.grid.filterSettings.columns.length > 0) &&
                (this.parent.filterSettings.hierarchyMode === 'Child' || this.parent.filterSettings.hierarchyMode === 'None') ?
                'filterLevel' : 'level';
            let query = new Query().where(propname, 'equal', 0);
            temp = dm.executeLocal(query);
            pageingDetails.count = temp.length;
            let size = this.parent.grid.pageSettings.pageSize;
            let current = this.parent.grid.pageSettings.currentPage;
            let skip = size * (current - 1);
            query = query.skip(skip).take(size);
            temp = dm.executeLocal(query);
            let newResults = this.pageRoot(pageingDetails.result, temp);
            pageingDetails.result = newResults;
        }
        else {
            let dm = new DataManager(pageingDetails.result);
            let expanded$$1 = new Predicate('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
            let parents = dm.executeLocal(new Query().where(expanded$$1));
            let visualData;
            if (isFilterChildHierarchy(this.parent)) {
                visualData = parents;
            }
            else {
                visualData = parents.filter((e) => {
                    return getExpandStatus(this.parent, e, parents);
                });
            }
            pageingDetails.count = visualData.length;
            let query = new Query();
            let size = this.parent.grid.pageSettings.pageSize;
            let current = this.parent.grid.pageSettings.currentPage;
            if (visualData.length < (current * size)) {
                current = (Math.floor(visualData.length / size)) + ((visualData.length % size) ? 1 : 0);
                current = current ? current : 1;
                this.parent.grid.setProperties({ pageSettings: { currentPage: current } }, true);
            }
            let skip = size * (current - 1);
            query = query.skip(skip).take(size);
            dm.dataSource.json = visualData;
            pageingDetails.result = dm.executeLocal(query);
        }
        this.parent.notify('updateAction', pageingDetails);
    }
}

/**
 * Toolbar Module for TreeGrid
 * @hidden
 */
class Toolbar$1 {
    constructor(parent) {
        Grid.Inject(Toolbar);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'toolbar';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(rowSelected, this.refreshToolbar, this);
        this.parent.on(toolbarClick, this.toolbarClickHandler, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(rowSelected, this.refreshToolbar);
        this.parent.off(toolbarClick, this.toolbarClickHandler);
    }
    refreshToolbar(args) {
        let tObj = this.parent;
        if (args.row.rowIndex === 0 || tObj.getSelectedRecords().length > 1) {
            this.enableItems([tObj.element.id + '_gridcontrol_indent', tObj.element.id + '_gridcontrol_outdent'], false);
        }
        else {
            if (!isNullOrUndefined(tObj.getCurrentViewRecords()[args.row.rowIndex])) {
                if (!isNullOrUndefined(tObj.getCurrentViewRecords()[args.row.rowIndex]) &&
                    (tObj.getCurrentViewRecords()[args.row.rowIndex].level >
                        tObj.getCurrentViewRecords()[args.row.rowIndex - 1].level)) {
                    this.enableItems([tObj.element.id + '_gridcontrol_indent'], false);
                }
                else {
                    this.enableItems([tObj.element.id + '_gridcontrol_indent'], true);
                }
                if (tObj.getCurrentViewRecords()[args.row.rowIndex].level ===
                    tObj.getCurrentViewRecords()[args.row.rowIndex - 1].level) {
                    this.enableItems([tObj.element.id + '_gridcontrol_indent'], true);
                }
                if (tObj.getCurrentViewRecords()[args.row.rowIndex].level === 0) {
                    this.enableItems([tObj.element.id + '_gridcontrol_outdent'], false);
                }
                if (tObj.getCurrentViewRecords()[args.row.rowIndex].level !== 0) {
                    this.enableItems([tObj.element.id + '_gridcontrol_outdent'], true);
                }
            }
        }
        if (args.row.rowIndex === 0 && !isNullOrUndefined(args.data.parentItem)) {
            this.enableItems([tObj.element.id + '_gridcontrol_outdent'], true);
        }
    }
    toolbarClickHandler(args) {
        let tObj = this.parent;
        if (this.parent.editSettings.mode === 'Cell' && this.parent.grid.editSettings.mode === 'Batch' &&
            args.item.id === this.parent.grid.element.id + '_update') {
            args.cancel = true;
            this.parent.grid.editModule.saveCell();
        }
        if (args.item.id === this.parent.grid.element.id + '_expandall') {
            this.parent.expandAll();
        }
        if (args.item.id === this.parent.grid.element.id + '_collapseall') {
            this.parent.collapseAll();
        }
        if (args.item.id === tObj.grid.element.id + '_indent' && tObj.getSelectedRecords().length) {
            let record = tObj.getCurrentViewRecords()[tObj.getSelectedRowIndexes()[0] - 1];
            let dropIndex;
            if (record.level > tObj.getSelectedRecords()[0].level) {
                for (let i = 0; i < tObj.getCurrentViewRecords().length; i++) {
                    if (tObj.getCurrentViewRecords()[i].taskData === record.parentItem.taskData) {
                        dropIndex = i;
                    }
                }
            }
            else {
                dropIndex = tObj.getSelectedRowIndexes()[0] - 1;
            }
            tObj.reorderRows([tObj.getSelectedRowIndexes()[0]], dropIndex, 'child');
        }
        if (args.item.id === tObj.grid.element.id + '_outdent' && tObj.getSelectedRecords().length) {
            let index = tObj.getSelectedRowIndexes()[0];
            let dropIndex;
            let parentItem = tObj.getSelectedRecords()[0].parentItem;
            for (let i = 0; i < tObj.getCurrentViewRecords().length; i++) {
                if (tObj.getCurrentViewRecords()[i].taskData === parentItem.taskData) {
                    dropIndex = i;
                }
            }
            tObj.reorderRows([index], dropIndex, 'below');
        }
    }
    /**
     * Gets the toolbar of the TreeGrid.
     * @return {Element}
     * @hidden
     */
    getToolbar() {
        return this.parent.grid.toolbarModule.getToolbar();
    }
    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @return {void}
     * @hidden
     */
    enableItems(items, isEnable) {
        this.parent.grid.toolbarModule.enableItems(items, isEnable);
    }
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * TreeGrid Aggregate module
 * @hidden
 */
class Aggregate$1 {
    /**
     * Constructor for Aggregate module
     */
    constructor(parent) {
        Grid.Inject(Aggregate);
        this.parent = parent;
        this.flatChildRecords = [];
        this.summaryQuery = [];
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'summary';
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
    }
    /**
     * Function to calculate summary values
     *  @hidden
     */
    calculateSummaryValue(summaryQuery, filteredData, isSort) {
        this.summaryQuery = summaryQuery;
        let parentRecord;
        let parentDataLength = Object.keys(filteredData).length;
        let parentData;
        parentData = [];
        for (let p = 0, len = parentDataLength; p < len; p++) {
            let summaryRow = getObject('isSummaryRow', filteredData[p]);
            if (!summaryRow) {
                parentData.push(filteredData[p]);
            }
        }
        let parentRecords = findParentRecords(parentData);
        let flatRecords;
        flatRecords = parentData.slice();
        let columnLength = Object.keys(this.parent.columns).length;
        let summaryLength = Object.keys(this.parent.aggregates).length;
        let dataLength = Object.keys(parentRecords).length;
        let childRecordsLength;
        if (this.parent.aggregates.filter((x) => x.showChildSummary).length) {
            for (let i = 0, len = dataLength; i < len; i++) {
                parentRecord = parentRecords[i];
                childRecordsLength = this.getChildRecordsLength(parentRecord, flatRecords);
                if (childRecordsLength) {
                    for (let summaryRowIndex = 1, len = summaryLength; summaryRowIndex <= len; summaryRowIndex++) {
                        let item;
                        item = {};
                        for (let columnIndex = 0, len = columnLength; columnIndex < len; columnIndex++) {
                            let field = isNullOrUndefined(getObject('field', this.parent.columns[columnIndex])) ?
                                this.parent.columns[columnIndex] : getObject('field', this.parent.columns[columnIndex]);
                            item[field] = null;
                        }
                        item = this.createSummaryItem(item, this.parent.aggregates[summaryRowIndex - 1]);
                        if (this.parent.aggregates[summaryRowIndex - 1].showChildSummary) {
                            let idx;
                            flatRecords.map((e, i) => {
                                if (e.uniqueID === parentRecord.uniqueID) {
                                    idx = i;
                                    return;
                                }
                            });
                            let currentIndex = idx + childRecordsLength + summaryRowIndex;
                            let summaryParent = extend({}, parentRecord);
                            delete summaryParent.childRecords;
                            delete summaryParent[this.parent.childMapping];
                            setValue('parentItem', summaryParent, item);
                            let level = getObject('level', summaryParent);
                            setValue('level', level + 1, item);
                            let index = getObject('index', summaryParent);
                            setValue('isSummaryRow', true, item);
                            setValue('parentUniqueID', summaryParent.uniqueID, item);
                            if (isSort) {
                                let childRecords = getObject('childRecords', parentRecord);
                                if (childRecords.length) {
                                    childRecords.push(item);
                                }
                            }
                            flatRecords.splice(currentIndex, 0, item);
                        }
                        else {
                            continue;
                        }
                    }
                    this.flatChildRecords = [];
                }
            }
        }
        else {
            let items;
            items = {};
            for (let columnIndex = 0, length = columnLength; columnIndex < length; columnIndex++) {
                let fields = isNullOrUndefined(getObject('field', this.parent.columns[columnIndex])) ?
                    this.parent.columns[columnIndex] : getObject('field', this.parent.columns[columnIndex]);
                items[fields] = null;
            }
            for (let summaryRowIndex = 1, length = summaryLength; summaryRowIndex <= length; summaryRowIndex++) {
                this.createSummaryItem(items, this.parent.aggregates[summaryRowIndex - 1]);
            }
        }
        return flatRecords;
    }
    getChildRecordsLength(parentData, flatData) {
        let recordLength = Object.keys(flatData).length;
        let record;
        for (let i = 0, len = recordLength; i < len; i++) {
            record = flatData[i];
            let parent = isNullOrUndefined(record.parentItem) ? null :
                flatData.filter((e) => { return e.uniqueID === record.parentItem.uniqueID; })[0];
            if (parentData === parent) {
                this.flatChildRecords.push(record);
                let hasChild = getObject('hasChildRecords', record);
                if (hasChild) {
                    this.getChildRecordsLength(record, flatData);
                }
                else {
                    continue;
                }
            }
        }
        return this.flatChildRecords.length;
    }
    createSummaryItem(itemData, summary) {
        let summaryColumnLength = Object.keys(summary.columns).length;
        for (let i = 0, len = summaryColumnLength; i < len; i++) {
            let displayColumn = isNullOrUndefined(summary.columns[i].columnName) ? summary.columns[i].field :
                summary.columns[i].columnName;
            let keys = Object.keys(itemData);
            for (let key of keys) {
                if (key === displayColumn) {
                    if (this.flatChildRecords.length) {
                        itemData[key] = this.getSummaryValues(summary.columns[i], this.flatChildRecords);
                    }
                    else if (this.parent.isLocalData) {
                        let data = this.parent.dataSource instanceof DataManager ? this.parent.dataSource.dataSource.json
                            : this.parent.flatData;
                        itemData[key] = this.getSummaryValues(summary.columns[i], data);
                    }
                }
                else {
                    continue;
                }
            }
        }
        return itemData;
    }
    getSummaryValues(summaryColumn, summaryData) {
        let qry = new Query();
        let single;
        single = {};
        let helper = {};
        let type = !isNullOrUndefined(summaryColumn.field) ?
            this.parent.getColumnByField(summaryColumn.field).type : undefined;
        summaryColumn.setPropertiesSilent({ format: this.getFormatFromType(summaryColumn.format, type) });
        summaryColumn.setFormatter(this.parent.grid.locale);
        let formatFn = summaryColumn.getFormatter() || (() => (a) => a)();
        summaryColumn.setTemplate(helper);
        let tempObj = summaryColumn.getTemplate(2);
        qry.queries = this.summaryQuery;
        qry.requiresCount();
        let sumData = new DataManager(summaryData).executeLocal(qry);
        let types = summaryColumn.type;
        let summaryKey;
        types = [summaryColumn.type];
        for (let i = 0; i < types.length; i++) {
            summaryKey = types[i];
            let key = summaryColumn.field + ' - ' + types[i].toLowerCase();
            let val = types[i] !== 'Custom' ? getObject('aggregates', sumData) :
                calculateAggregate(types[i], sumData, summaryColumn, this.parent);
            let disp = summaryColumn.columnName;
            let value = types[i] !== 'Custom' ? val[key] : val;
            single[disp] = single[disp] || {};
            single[disp][key] = value;
            single[disp][types[i]] = !isNullOrUndefined(val) ? formatFn(value) : ' ';
        }
        helper.format = summaryColumn.getFormatter();
        let cellElement = createElement('td', {
            className: 'e-summary'
        });
        if (this.parent.isReact) {
            let renderReactTemplates = 'renderReactTemplates';
            tempObj.fn(single[summaryColumn.columnName], this.parent, tempObj.property, '', null, null, cellElement);
            this.parent[renderReactTemplates]();
        }
        else {
            appendChildren(cellElement, tempObj.fn(single[summaryColumn.columnName], this.parent, tempObj.property));
        }
        let value = single[summaryColumn.columnName][summaryKey];
        let summaryValue;
        if (cellElement.innerHTML.indexOf(value) === -1) {
            summaryValue = cellElement.innerHTML + value;
            return summaryValue;
        }
        else {
            return cellElement.innerHTML;
        }
    }
    getFormatFromType(summaryformat, type) {
        if (isNullOrUndefined(type) || typeof summaryformat !== 'string') {
            return summaryformat;
        }
        let obj;
        switch (type) {
            case 'number':
                obj = { format: summaryformat };
                break;
            case 'datetime':
                obj = { type: 'dateTime', skeleton: summaryformat };
                break;
            case 'date':
                obj = { type: type, skeleton: summaryformat };
                break;
        }
        return obj;
    }
    /**
     * To destroy the Aggregate module
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * Internal dataoperations for TreeGrid
 * @hidden
 */
class Sort$1 {
    constructor(grid) {
        Grid.Inject(Sort);
        this.parent = grid;
        this.taskIds = [];
        this.flatSortedData = [];
        this.storedIndex = -1;
        this.isSelfReference = !isNullOrUndefined(this.parent.parentIdMapping);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'sort';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('updateModel', this.updateModel, this);
        this.parent.on('createSort', this.createdSortedRecords, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateModel', this.updateModel);
        this.parent.off('createSort', this.createdSortedRecords);
    }
    createdSortedRecords(sortParams) {
        let data = sortParams.modifiedData;
        let srtQry = sortParams.srtQry;
        this.iterateSort(data, srtQry);
        this.storedIndex = -1;
        sortParams.modifiedData = this.flatSortedData;
        this.flatSortedData = [];
    }
    iterateSort(data, srtQry) {
        for (let d = 0; d < data.length; d++) {
            if (this.parent.grid.filterSettings.columns.length > 0 || this.parent.grid.searchSettings.key !== '') {
                if (!isNullOrUndefined(getParentData(this.parent, data[d].uniqueID, true))) {
                    this.storedIndex++;
                    this.flatSortedData[this.storedIndex] = data[d];
                }
            }
            else {
                this.storedIndex++;
                this.flatSortedData[this.storedIndex] = data[d];
            }
            if (data[d].hasChildRecords) {
                let childSort = (new DataManager(data[d].childRecords).executeLocal(srtQry));
                this.iterateSort(childSort, srtQry);
            }
        }
    }
    /**
     * Sorts a column with the given options.
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @return {void}
     */
    sortColumn(columnName, direction, isMultiSort) {
        this.parent.grid.sortColumn(columnName, direction, isMultiSort);
    }
    removeSortColumn(field) {
        this.parent.grid.removeSortColumn(field);
    }
    /**
     * The function used to update sortSettings of TreeGrid.
     * @return {void}
     * @hidden
     */
    updateModel() {
        this.parent.setProperties({ sortSettings: getActualProperties(this.parent.grid.sortSettings) }, true);
    }
    /**
     * Clears all the sorted columns of the TreeGrid.
     * @return {void}
     */
    clearSorting() {
        this.parent.grid.clearSorting();
        this.updateModel();
    }
    /**
     * Destroys the Sorting of TreeGrid.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * TreeGrid ColumnMenu module
 * @hidden
 */
class ColumnMenu$1 {
    /**
     * Constructor for render module
     */
    constructor(parent) {
        Grid.Inject(ColumnMenu);
        this.parent = parent;
    }
    getColumnMenu() {
        return this.parent.grid.columnMenuModule.getColumnMenu();
    }
    destroy() {
        //this.parent.grid.columnMenuModule.destroy();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'columnMenu';
    }
}

/**
 * ContextMenu Module for TreeGrid
 * @hidden
 */
class ContextMenu$1 {
    constructor(parent) {
        Grid.Inject(ContextMenu);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on('contextMenuOpen', this.contextMenuOpen, this);
        this.parent.on('contextMenuClick', this.contextMenuClick, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('contextMenuOpen', this.contextMenuOpen);
        this.parent.off('contextMenuClick', this.contextMenuClick);
    }
    contextMenuOpen(args) {
        let addRow = select('#' + this.parent.element.id + '_gridcontrol_cmenu_AddRow', args.element);
        let editRecord = select('#' + this.parent.element.id + '_gridcontrol_cmenu_Edit', args.element);
        if (addRow) {
            if (this.parent.grid.editSettings.allowAdding === false) {
                addRow.style.display = 'none';
            }
            else {
                addRow.style.display = 'block';
            }
        }
        if ((this.parent.editSettings.mode === 'Cell' || this.parent.editSettings.mode === 'Batch')
            && !(isNullOrUndefined(editRecord)) && !(editRecord.classList.contains('e-menu-hide'))) {
            editRecord.style.display = 'none';
        }
    }
    contextMenuClick(args) {
        if (args.item.id === 'Above' || args.item.id === 'Below') {
            this.parent.notify('savePreviousRowPosition', args);
            this.parent.setProperties({ editSettings: { newRowPosition: args.item.id } }, true);
            this.parent.addRecord();
        }
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'contextMenu';
    }
    /**
     * Destroys the ContextMenu.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * Gets the context menu element from the TreeGrid.
     * @return {Element}
     */
    getContextMenu() {
        return this.parent.grid.contextMenuModule.getContextMenu();
    }
}

/**
 * `BatchEdit` module is used to handle batch editing actions.
 * @hidden
 */
class BatchEdit {
    constructor(parent) {
        this.batchChildCount = 0;
        this.addedRecords = 'addedRecords';
        this.deletedRecords = 'deletedRecords';
        this.batchAddedRecords = [];
        this.batchDeletedRecords = [];
        this.batchAddRowRecord = [];
        this.parent = parent;
        this.isSelfReference = !isNullOrUndefined(parent.parentIdMapping);
        this.batchRecords = [];
        this.currentViewRecords = [];
        this.isAdd = false;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on(cellSaved, this.cellSaved, this);
        this.parent.on(batchAdd, this.batchAdd, this);
        this.parent.on(beforeBatchAdd, this.beforeBatchAdd, this);
        this.parent.on(batchSave, this.batchSave, this);
        this.parent.on(beforeBatchDelete, this.beforeBatchDelete, this);
        this.parent.on(beforeBatchSave, this.beforeBatchSave, this);
        this.parent.on('batchPageAction', this.batchPageAction, this);
        this.parent.on('batchCancelAction', this.batchCancelAction, this);
        this.parent.grid.on('immutable-batch-cancel', this.immutableBatchAction, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(cellSaved, this.cellSaved);
        this.parent.off(batchAdd, this.batchAdd);
        this.parent.off(batchSave, this.batchSave);
        this.parent.off(beforeBatchAdd, this.beforeBatchAdd);
        this.parent.off(beforeBatchDelete, this.beforeBatchDelete);
        this.parent.off(beforeBatchSave, this.beforeBatchSave);
        this.parent.off('batchPageAction', this.batchPageAction);
        this.parent.off('batchCancelAction', this.batchCancelAction);
        this.parent.grid.off('immutable-batch-cancel', this.immutableBatchAction);
    }
    /**
     * To destroy the editModule
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    getBatchRecords() {
        return this.batchRecords;
    }
    /**
     * @hidden
     */
    getAddRowIndex() {
        return this.addRowIndex;
    }
    /**
     * @hidden
     */
    getSelectedIndex() {
        return this.selectedIndex;
    }
    /**
     * @hidden
     */
    getBatchChildCount() {
        return this.batchChildCount;
    }
    batchPageAction() {
        let data = (this.parent.grid.dataSource instanceof DataManager ?
            this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
        let primaryKey = this.parent.grid.getPrimaryKeyFieldNames()[0];
        let index;
        if (!isNullOrUndefined(this.batchAddedRecords) && this.batchAddedRecords.length) {
            for (let i = 0; i < this.batchAddedRecords.length; i++) {
                index = data.map((e) => { return e[primaryKey]; }).indexOf(this.batchAddedRecords[i][primaryKey]);
                data.splice(index, 1);
            }
        }
        this.batchAddedRecords = this.batchRecords = this.batchAddRowRecord = this.batchDeletedRecords = this.currentViewRecords = [];
    }
    cellSaved(args) {
        let actualCellIndex = args.cell.cellIndex;
        let frozenCols = this.parent.frozenColumns || this.parent.getFrozenColumns();
        if (frozenCols && args.columnObject.index > frozenCols) {
            actualCellIndex = actualCellIndex + frozenCols;
        }
        if (actualCellIndex === this.parent.treeColumnIndex) {
            this.parent.renderModule.cellRender({ data: args.rowData, cell: args.cell,
                column: this.parent.grid.getColumnByIndex(args.cell.cellIndex)
            });
        }
        if (this.isAdd && this.parent.editSettings.mode === 'Batch' && this.parent.editSettings.newRowPosition !== 'Bottom') {
            let data = (this.parent.grid.dataSource instanceof DataManager ?
                this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
            let added;
            let level = 'level';
            let primaryKey = this.parent.grid.getPrimaryKeyFieldNames()[0];
            let currentDataIndex;
            let parentRecord;
            let indexvalue;
            let parentItem = 'parentItem';
            let uniqueID = 'uniqueID';
            parentRecord = this.selectedIndex > -1 ? this.batchRecords[this.addRowIndex][parentItem] : null;
            let idMapping;
            let parentUniqueID;
            let parentIdMapping;
            let rowObjectIndex = this.parent.editSettings.newRowPosition === 'Top' || this.selectedIndex === -1 ? 0 :
                this.parent.editSettings.newRowPosition === 'Above' ? this.addRowIndex
                    : this.addRowIndex + 1;
            rowObjectIndex = this.getActualRowObjectIndex(rowObjectIndex);
            if (this.newBatchRowAdded) {
                if (this.batchRecords.length) {
                    idMapping = this.batchRecords[this.addRowIndex][this.parent.idMapping];
                    parentIdMapping = this.batchRecords[this.addRowIndex][this.parent.parentIdMapping];
                    if (this.batchRecords[this.addRowIndex][parentItem]) {
                        parentUniqueID = this.batchRecords[this.addRowIndex][parentItem][uniqueID];
                    }
                }
                this.batchAddedRecords = extendArray(this.batchAddedRecords);
                this.batchAddRowRecord = extendArray(this.batchAddRowRecord);
                this.batchAddRowRecord.push(this.batchRecords[this.addRowIndex]);
                added = this.parent.grid.getRowsObject()[rowObjectIndex].changes;
                added.uniqueID = getUid(this.parent.element.id + '_data_');
                setValue('uniqueIDCollection.' + added.uniqueID, added, this.parent);
                if (!added.hasOwnProperty('level')) {
                    this.batchIndex = this.selectedIndex === -1 ? 0 : this.batchIndex;
                    if (this.parent.editSettings.newRowPosition === 'Child') {
                        added.primaryParent = parentRecord;
                        if (this.selectedIndex > -1) {
                            added.parentItem = extend({}, this.batchRecords[this.addRowIndex]);
                            added.parentUniqueID = added.parentItem.uniqueID;
                            delete added.parentItem.childRecords;
                            delete added.parentItem[this.parent.childMapping];
                            added.level = added.parentItem.level + 1;
                            added.index = this.batchIndex;
                            let childRecordCount = findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                            let record = findChildrenRecords(this.batchRecords[this.addRowIndex])[childRecordCount - 1];
                            record = isNullOrUndefined(record) ? this.batchRecords[this.addRowIndex] : record;
                            currentDataIndex = data.map((e) => { return e[primaryKey]; }).indexOf(record[primaryKey]);
                            if (this.isSelfReference) {
                                added[this.parent.parentIdMapping] = idMapping;
                            }
                            updateParentRow(primaryKey, added.parentItem, 'add', this.parent, this.isSelfReference, added);
                        }
                    }
                    else if ((this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below')
                        && !isNullOrUndefined(this.batchRecords[this.addRowIndex])) {
                        added.level = this.batchRecords[this.addRowIndex][level];
                        if (added.level && this.selectedIndex > -1) {
                            added.parentItem = parentRecord;
                            added.parentUniqueID = parentUniqueID;
                            delete added.parentItem.childRecords;
                            delete added.parentItem[this.parent.childMapping];
                        }
                        added.index = this.parent.editSettings.newRowPosition === 'Below' ? this.batchIndex : this.batchIndex - 1;
                        if (this.parent.editSettings.newRowPosition === 'Below' && this.selectedIndex > -1) {
                            let childRecordCount = findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                            let record = findChildrenRecords(this.batchRecords[this.addRowIndex])[childRecordCount - 1];
                            record = isNullOrUndefined(record) ? this.batchRecords[this.addRowIndex] : record;
                            currentDataIndex = data.map((e) => { return e[primaryKey]; }).indexOf(record[primaryKey]);
                        }
                        if (this.parent.editSettings.newRowPosition === 'Above' && this.selectedIndex > -1) {
                            let record = this.batchRecords[this.addRowIndex];
                            currentDataIndex = data.map((e) => { return e[primaryKey]; }).indexOf(record[primaryKey]);
                        }
                        if (this.isSelfReference) {
                            added[this.parent.parentIdMapping] = parentIdMapping;
                        }
                    }
                    added.index = added.index === -1 ? 0 : added.index;
                    added.hasChildRecords = false;
                    added.childRecords = [];
                    this.batchRecords.splice(added.index, 0, added);
                    this.currentViewRecords.splice(added.index, 0, added);
                    if (currentDataIndex) {
                        indexvalue = currentDataIndex;
                    }
                    else {
                        indexvalue = added.index;
                    }
                    if (this.parent.editSettings.newRowPosition !== 'Above') {
                        indexvalue = added.index === 0 ? indexvalue : indexvalue + 1;
                    }
                    data.splice(indexvalue, 0, added);
                    this.batchAddedRecords.push(added);
                }
                this.parent.grid.getRowsObject()[rowObjectIndex].data = added;
                this.newBatchRowAdded = false;
            }
            if (this.parent.frozenColumns || this.parent.getFrozenColumns()
                && this.parent.grid.getRowsObject()[rowObjectIndex].edit === 'add') {
                merge(this.currentViewRecords[rowObjectIndex], this.parent.grid.getRowsObject()[rowObjectIndex].changes);
            }
        }
    }
    beforeBatchAdd(e) {
        let isTabLastRow = 'isTabLastRow';
        if (this.parent.editSettings.mode === 'Cell' && this.parent.editModule[isTabLastRow]) {
            e.cancel = true;
            this.parent.editModule[isTabLastRow] = false;
            return;
        }
        this.selectedIndex = this.parent.grid.selectedRowIndex;
        this.addRowIndex = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
        this.addRowRecord = this.parent.getSelectedRecords()[0];
    }
    batchAdd(e) {
        if (this.parent.editSettings.newRowPosition !== 'Bottom') {
            this.isAdd = true;
            this.newBatchRowAdded = true;
            let actualIndex = 0;
            if (!this.batchRecords.length) {
                this.batchAddedRecords = [];
                this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords());
                this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
            }
            if (this.parent.editSettings.newRowPosition !== 'Top') {
                let records = this.parent.grid.getCurrentViewRecords();
                if (this.parent.editSettings.mode === 'Batch' && (this.parent.getBatchChanges()[this.addedRecords].length > 1
                    || this.parent.getBatchChanges()[this.deletedRecords].length)) {
                    records = this.batchRecords;
                }
                this.updateChildCount(records);
                this.parent.notify(beginAdd, {});
                this.batchChildCount = 0;
            }
            this.updateRowIndex();
            // update focus module, need to refix this once grid source modified.
            let focusModule = getValue('focusModule', this.parent.grid);
            let table = this.parent.getContentTable();
            if (this.parent.getBatchChanges()[this.deletedRecords].length && this.parent.editSettings.newRowPosition === 'Above') {
                actualIndex = e.row.rowIndex;
                focusModule.getContent().matrix.matrix = this.matrix;
            }
            else {
                actualIndex = table.getElementsByClassName('e-batchrow')[0].rowIndex;
                // if (this.parent.frozenRows || this.parent.frozenColumns) {
                //   actualIndex = this.batchIndex;
                // }
            }
            focusModule.getContent().matrix.current = [actualIndex, focusModule.getContent().matrix.current[1]];
        }
    }
    beforeBatchDelete(e) {
        if (!this.batchRecords.length) {
            this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords());
            this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
        }
        let focusModule = getValue('focusModule', this.parent.grid);
        this.matrix = focusModule.getContent().matrix.matrix;
        this.parent = this.parent;
        let row = [];
        let records;
        let data;
        let primarykey = this.parent.grid.getPrimaryKeyFieldNames()[0];
        data = this.parent.grid.getSelectedRecords()[this.parent.grid.getSelectedRecords().length - 1];
        let childs = findChildrenRecords(data);
        if (childs.length) {
            for (let i = 0; i < childs.length; i++) {
                let index = this.parent.grid.getRowIndexByPrimaryKey(childs[i][primarykey]);
                row.push(this.parent.grid.getRows()[index]);
                if (this.parent.frozenRows || this.parent.frozenColumns || this.parent.getFrozenColumns()) {
                    row.push(this.parent.grid.getMovableRows()[index]);
                }
            }
        }
        if (!isNullOrUndefined(data.parentItem)) {
            let parentItem = getParentData(this.parent, data.parentItem.uniqueID);
            if (!isNullOrUndefined(parentItem) && parentItem.hasChildRecords) {
                let childIndex = parentItem.childRecords.indexOf(data);
                parentItem.childRecords.splice(childIndex, 1);
            }
            this.batchDeletedRecords = extendArray(this.batchDeletedRecords);
            this.batchDeletedRecords.push(data);
        }
        childs.push(data);
        records = childs;
        for (let i = 0; i < records.length; i++) {
            let indexvalue = this.batchRecords.map((e) => { return e[primarykey]; }).indexOf(records[i][primarykey]);
            if (indexvalue !== -1) {
                this.batchRecords.splice(indexvalue, 1);
            }
        }
        for (let i = 0; i < row.length; i++) {
            if (!isNullOrUndefined(row[i])) {
                this.parent.grid.selectionModule.selectedRecords.push(row[i]);
            }
        }
    }
    updateRowIndex() {
        let rows = this.parent.grid.getDataRows();
        for (let i = 0; i < rows.length; i++) {
            rows[i].setAttribute('aria-rowindex', i.toString());
        }
        if (this.parent.frozenRows || this.parent.getFrozenColumns() || this.parent.frozenColumns) {
            let mRows = this.parent.grid.getMovableDataRows();
            for (let i = 0; i < mRows.length; i++) {
                mRows[i].setAttribute('aria-rowindex', i.toString());
            }
        }
    }
    updateChildCount(records) {
        let primaryKey = this.parent.grid.getPrimaryKeyFieldNames()[0];
        let addedRecords = 'addedRecords';
        let parentItem = this.parent.editSettings.newRowPosition === 'Child' ? 'primaryParent' : 'parentItem';
        for (let i = 0; i < this.parent.getBatchChanges()[addedRecords].length; i++) {
            if (!isNullOrUndefined(this.parent.getBatchChanges()[addedRecords][i][parentItem])) {
                if (this.parent.getBatchChanges()[addedRecords][i][parentItem][primaryKey] === records[this.addRowIndex][primaryKey]) {
                    this.batchChildCount = this.batchChildCount + 1;
                }
            }
        }
    }
    beforeBatchSave(e) {
        let changeRecords = 'changedRecords';
        let deleterecords = 'deletedRecords';
        let changedRecords = e.batchChanges[changeRecords];
        if (e.batchChanges[changeRecords].length) {
            let columnName;
            for (let i = 0; i < changedRecords.length; i++) {
                editAction({ value: changedRecords[i], action: 'edit' }, this.parent, this.isSelfReference, this.addRowIndex, this.selectedIndex, columnName);
            }
        }
        if (e.batchChanges[deleterecords].length) {
            let deletedRecords = e.batchChanges[deleterecords];
            let record = deletedRecords;
            for (let i = 0; i < record.length; i++) {
                this.deleteUniqueID(record[i].uniqueID);
                let childs = findChildrenRecords(record[i]);
                for (let c = 0; c < childs.length; c++) {
                    this.deleteUniqueID(childs[c].uniqueID);
                }
                e.batchChanges[deleterecords] = [...e.batchChanges[deleterecords], ...childs];
            }
        }
        this.isAdd = false;
    }
    deleteUniqueID(value) {
        let idFilter = 'uniqueIDFilterCollection';
        delete this.parent[idFilter][value];
        let id = 'uniqueIDCollection';
        delete this.parent[id][value];
    }
    batchCancelAction() {
        let targetElement = 'targetElement';
        let index;
        let parentItem = 'parentItem';
        let indexvalue = 'index';
        let currentViewRecords = this.parent.grid.getCurrentViewRecords();
        let childRecords = 'childRecords';
        let data = (this.parent.grid.dataSource instanceof DataManager ?
            this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
        let primaryKey = this.parent.grid.getPrimaryKeyFieldNames()[0];
        if (!isNullOrUndefined(this.parent[targetElement])) {
            let row = this.parent[targetElement].closest('tr');
            this.parent.collapseRow(row);
            this.parent[targetElement] = null;
        }
        if (!isNullOrUndefined(this.batchAddedRecords)) {
            for (let i = 0; i < this.batchAddedRecords.length; i++) {
                index = data.map((e) => { return e[primaryKey]; }).indexOf(this.batchAddedRecords[i][primaryKey]);
                data.splice(index, 1);
                if (this.parent.editSettings.newRowPosition === 'Child') {
                    index = currentViewRecords.map((e) => { return e[primaryKey]; })
                        .indexOf(this.batchAddedRecords[i][parentItem] ? this.batchAddedRecords[i][parentItem][primaryKey]
                        : this.batchAddedRecords[i][primaryKey]);
                    if (!isNullOrUndefined(currentViewRecords[index])) {
                        let children = currentViewRecords[index][childRecords];
                        for (let j = 0; children && j < children.length; j++) {
                            if (children[j][primaryKey] === this.batchAddedRecords[i][primaryKey]) {
                                currentViewRecords[index][childRecords].splice(j, 1);
                            }
                        }
                    }
                }
            }
        }
        if (!isNullOrUndefined(this.batchDeletedRecords)) {
            for (let i = 0; i < this.batchDeletedRecords.length; i++) {
                if (!isNullOrUndefined(this.batchDeletedRecords[i][parentItem])) {
                    index = currentViewRecords.map((e) => { return e[primaryKey]; })
                        .indexOf(this.batchDeletedRecords[i][parentItem][primaryKey]);
                    let positionIndex = this.batchDeletedRecords[i][indexvalue] === 0 ? this.batchDeletedRecords[i][indexvalue] :
                        this.batchDeletedRecords[i][indexvalue] - 1;
                    if (!isNullOrUndefined(currentViewRecords[index])) {
                        currentViewRecords[index][childRecords].splice(positionIndex, 0, this.batchDeletedRecords[i]);
                    }
                }
            }
        }
        this.batchAddedRecords = this.batchRecords = this.batchAddRowRecord = this.currentViewRecords = [];
        this.batchRecords = extendArray(this.parent.grid.getCurrentViewRecords());
        this.batchIndex = 0;
        this.currentViewRecords = extendArray(this.parent.grid.getCurrentViewRecords());
        this.batchDeletedRecords = [];
        this.parent.grid.renderModule.refresh();
    }
    batchSave(args) {
        if (this.parent.editSettings.mode === 'Batch') {
            let i;
            let batchChanges = this.parent.getBatchChanges();
            let deletedRecords = 'deletedRecords';
            let addedRecords = 'addedRecords';
            let index = 'index';
            let uniqueID = 'uniqueID';
            let data = (this.parent.grid.dataSource instanceof DataManager ?
                this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
            let currentViewRecords = this.parent.grid.getCurrentViewRecords();
            let primarykey = this.parent.grid.getPrimaryKeyFieldNames()[0];
            let level = 'level';
            let addRecords = batchChanges[addedRecords];
            let parentItem = 'parentItem';
            let selectedIndex;
            let addRowIndex;
            let columnName;
            let addRowRecord;
            let childRecords = 'childRecords';
            if (addRecords.length > 1 && this.parent.editSettings.newRowPosition !== 'Bottom') {
                addRecords.reverse();
            }
            if (this.parent.editSettings.newRowPosition !== 'Bottom') {
                data.splice(data.length - addRecords.length, addRecords.length);
                if (!this.parent.allowPaging) {
                    if (currentViewRecords.length > addRecords.length) {
                        currentViewRecords.splice(currentViewRecords.length - addRecords.length, addRecords.length);
                    }
                }
                else {
                    let totalRecords = extendArray(data);
                    let startIndex = totalRecords.map((e) => { return e[primarykey]; })
                        .indexOf(currentViewRecords[0][primarykey]);
                    let endIndex = startIndex + this.parent.grid.pageSettings.pageSize;
                    currentViewRecords = totalRecords.splice(startIndex, endIndex);
                }
            }
            for (i = 0; i < addRecords.length; i++) {
                let taskData = extend({}, addRecords[i]);
                delete taskData.parentItem;
                delete taskData.uniqueID;
                delete taskData.index;
                delete taskData.level;
                delete taskData.hasChildRecords;
                delete taskData.childRecords;
                delete taskData.parentUniqueID;
                if (!isNullOrUndefined(taskData.primaryParent)) {
                    delete taskData.primaryParent;
                }
                addRecords[i].taskData = taskData;
                addRowRecord = this.batchAddRowRecord[i];
                if (isNullOrUndefined(addRowRecord)) {
                    addRowRecord = this.batchAddRowRecord[i - 1];
                }
                if (this.isSelfReference) {
                    if (!isNullOrUndefined(addRecords[i].parentItem)) {
                        updateParentRow(primarykey, addRecords[i].parentItem, 'add', this.parent, this.isSelfReference, addRecords[i]);
                    }
                }
                if (!isNullOrUndefined(addRowRecord)) {
                    addRowIndex = addRowRecord.index;
                }
                if (this.parent.editSettings.newRowPosition !== 'Top' && this.parent.editSettings.newRowPosition !== 'Bottom') {
                    if (isNullOrUndefined(addRecords[i].parentItem) && this.selectedIndex === -1) {
                        selectedIndex = -1;
                        addRowRecord = null;
                    }
                }
                editAction({ value: addRecords[i], action: 'add' }, this.parent, this.isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord);
                selectedIndex = null;
                if (this.parent.editSettings.newRowPosition === 'Child' && !isNullOrUndefined(addRecords[i][parentItem])) {
                    let indexValue = currentViewRecords.map((e) => { return e[primarykey]; })
                        .indexOf(addRecords[i][parentItem][primarykey]);
                    let children = currentViewRecords[indexValue][childRecords];
                    for (let j = 0; j < children.length; j++) {
                        if (children[j][primarykey] === addRecords[i][primarykey]) {
                            currentViewRecords[indexValue][childRecords].splice(j, 1);
                        }
                    }
                }
            }
            if (batchChanges[deletedRecords].length) {
                for (i = 0; i < batchChanges[deletedRecords].length; i++) {
                    editAction({ value: batchChanges[deletedRecords][i], action: 'delete' }, this.parent, this.isSelfReference, addRowIndex, selectedIndex, columnName, addRowRecord);
                }
            }
            this.parent.parentData = [];
            for (let i = 0; i < data.length; i++) {
                data[i][index] = i;
                setValue('uniqueIDCollection.' + data[i][uniqueID] + '.index', i, this.parent);
                if (!data[i][level]) {
                    this.parent.parentData.push(data[i]);
                }
            }
        }
        this.batchAddRowRecord = this.batchAddedRecords = this.batchRecords = this.batchDeletedRecords = this.currentViewRecords = [];
    }
    getActualRowObjectIndex(index) {
        let rows = this.parent.grid.getDataRows();
        if ((this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child')
            && this.selectedIndex > -1) {
            if (!isNullOrUndefined(this.batchRecords[this.addRowIndex]) && this.batchRecords[this.addRowIndex].expanded) {
                if (this.parent.getBatchChanges()[this.addedRecords].length > 1
                    || this.parent.getBatchChanges()[this.deletedRecords].length) {
                    index += findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                    if (this.parent.editSettings.newRowPosition !== 'Child') {
                        let batchChildCount = this.getBatchChildCount();
                        index = index + batchChildCount;
                    }
                }
                else {
                    index += findChildrenRecords(this.batchRecords[this.addRowIndex]).length;
                }
            }
            if (index >= rows.length) {
                index = rows.length - 1;
            }
            this.updateChildCount(this.parent.grid.getCurrentViewRecords());
            if (this.batchChildCount) {
                index += this.batchChildCount;
            }
            this.batchChildCount = 0;
        }
        return index;
    }
    immutableBatchAction(e) {
        e.args.cancel = true;
        let changes = this.parent.grid.getBatchChanges();
        let addedRecords = [];
        let index = 'index';
        if (Object.keys(changes).length) {
            addedRecords = changes.addedRecords;
        }
        for (let i = 0; i < addedRecords.length; i++) {
            e.rows.splice(addedRecords[i][index], 1);
        }
    }
}

/**
 * TreeGrid Edit Module
 * The `Edit` module is used to handle editing actions.
 */
class Edit$1 {
    /**
     * Constructor for Edit module
     */
    constructor(parent) {
        this.addedRecords = 'addedRecords';
        this.deletedRecords = 'deletedRecords';
        this.prevAriaRowIndex = '-1';
        Grid.Inject(Edit);
        this.parent = parent;
        this.isSelfReference = !isNullOrUndefined(parent.parentIdMapping);
        this.previousNewRowPosition = null;
        this.internalProperties = {};
        this.batchEditModule = new BatchEdit(this.parent);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'edit';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(crudAction, this.crudAction, this);
        this.parent.on(beginEdit, this.beginEdit, this);
        this.parent.on(beginAdd, this.beginAdd, this);
        this.parent.on(recordDoubleClick, this.recordDoubleClick, this);
        this.parent.on(cellSave, this.cellSave, this);
        this.parent.on(batchCancel, this.batchCancel, this);
        this.parent.grid.on(keyPressed, this.keyPressed, this);
        this.parent.grid.on('batchedit-form', this.lastCellTab, this);
        this.parent.grid.on('content-ready', this.contentready, this);
        this.parent.on(cellEdit, this.cellEdit, this);
        this.parent.on('actionBegin', this.editActionEvents, this);
        this.parent.on('actionComplete', this.editActionEvents, this);
        this.parent.grid.on(doubleTap, this.recordDoubleClick, this);
        this.parent.grid.on('dblclick', this.gridDblClick, this);
        this.parent.grid.on('recordAdded', this.customCellSave, this);
        this.parent.on('savePreviousRowPosition', this.savePreviousRowPosition, this);
        // this.parent.on(events.beforeDataBound, this.beforeDataBound, this);
        this.parent.grid.on(beforeStartEdit, this.beforeStartEdit, this);
        this.parent.grid.on(beforeBatchCancel, this.beforeBatchCancel, this);
        this.parent.grid.on('reset-edit-props', this.resetIsOnBatch, this);
        this.parent.grid.on('get-row-position', this.getRowPosition, this);
    }
    gridDblClick(e) {
        this.doubleClickTarget = e.target;
    }
    getRowPosition(addArgs) {
        addArgs.newRowPosition = this.parent.editSettings.newRowPosition;
        addArgs.addRowIndex = this.addRowIndex;
        addArgs.ariaRowIndex = +this.prevAriaRowIndex;
    }
    beforeStartEdit(args) {
        this.parent.trigger(actionBegin, args);
    }
    beforeBatchCancel(args) {
        if (this.parent.editSettings.mode === 'Cell') {
            this.parent.trigger(actionComplete, args);
        }
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(crudAction, this.crudAction);
        this.parent.off(beginEdit, this.beginEdit);
        this.parent.off(beginAdd, this.beginAdd);
        this.parent.off(recordDoubleClick, this.recordDoubleClick);
        this.parent.off(batchCancel, this.batchCancel);
        this.parent.grid.off(keyPressed, this.keyPressed);
        this.parent.grid.off('batchedit-form', this.lastCellTab);
        this.parent.grid.off('content-ready', this.contentready);
        this.parent.off(cellEdit, this.cellEdit);
        this.parent.off('actionBegin', this.editActionEvents);
        this.parent.off('actionComplete', this.editActionEvents);
        this.parent.grid.off('recordAdded', this.customCellSave);
        this.parent.grid.off(doubleTap, this.recordDoubleClick);
        this.parent.off('savePreviousRowPosition', this.savePreviousRowPosition);
        this.parent.grid.off(beforeStartEdit, this.beforeStartEdit);
        this.parent.grid.off(beforeBatchCancel, this.beforeBatchCancel);
        this.parent.grid.off('dblclick', this.gridDblClick);
        this.parent.grid.off('reset-edit-props', this.resetIsOnBatch);
        this.parent.grid.off('get-row-position', this.getRowPosition);
        //this.parent.grid.off('click', this.gridSingleClick);
    }
    /**
     * To destroy the editModule
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
    /**
     * @hidden
     */
    applyFormValidation(cols) {
        this.parent.grid.editModule.applyFormValidation(cols);
    }
    editActionEvents(args) {
        let eventArgs = getObject('editAction', args);
        let eventName = getObject('name', eventArgs);
        let treeObj = this.parent;
        let adaptor = treeObj.dataSource.adaptor;
        if ((isRemoteData(treeObj) || adaptor instanceof RemoteSaveAdaptor) &&
            (eventArgs.requestType === 'save' && eventArgs.action === 'add') &&
            (treeObj.editSettings.newRowPosition === 'Child' || treeObj.editSettings.newRowPosition === 'Below'
                || treeObj.editSettings.newRowPosition === 'Above')) {
            if (eventName === 'actionBegin') {
                let rowIndex = isNullOrUndefined(eventArgs.row) || !Object.keys(eventArgs.row).length ? this.selectedIndex :
                    eventArgs.row.rowIndex - 1;
                let keyData = (!isNullOrUndefined(rowIndex) && rowIndex !== -1) ?
                    treeObj.getCurrentViewRecords()[rowIndex][treeObj.getPrimaryKeyFieldNames()[0]] : -1;
                treeObj.grid.query.addParams('relationalKey', keyData);
            }
            else if (eventName === 'actionComplete') {
                let paramsLength = treeObj.grid.query.params.length;
                for (let i = 0; i < paramsLength; i++) {
                    if (treeObj.grid.query.params[i].key === 'relationalKey') {
                        treeObj.grid.query.params.splice(i);
                    }
                }
            }
        }
        if (this.parent.editSettings.mode === 'Batch' && eventArgs.requestType === 'paging') {
            this.parent.notify('batchPageAction', {});
        }
    }
    recordDoubleClick(args) {
        let target = args.target;
        if (isNullOrUndefined(target.closest('td.e-rowcell'))) {
            return;
        }
        let column = this.parent.grid.getColumnByIndex(+target.closest('td.e-rowcell').getAttribute('aria-colindex'));
        if (this.parent.editSettings.mode === 'Cell' && !this.isOnBatch && column && !column.isPrimaryKey &&
            column.allowEditing && !(target.classList.contains('e-treegridexpand') ||
            target.classList.contains('e-treegridcollapse')) && this.parent.editSettings.allowEditOnDblClick) {
            this.isOnBatch = true;
            this.parent.grid.setProperties({ selectedRowIndex: args.rowIndex }, true);
            if (this.parent.enableVirtualization) {
                let tr = parentsUntil(args.target, 'e-row');
                this.prevAriaRowIndex = tr.getAttribute('aria-rowindex');
                tr.setAttribute('aria-rowindex', tr.rowIndex + '');
            }
            this.updateGridEditMode('Batch');
        }
    }
    updateGridEditMode(mode) {
        this.parent.grid.setProperties({ editSettings: { mode: mode } }, true);
        let updateMethod = getObject('updateEditObj', this.parent.grid.editModule);
        updateMethod.apply(this.parent.grid.editModule);
        this.parent.grid.isEdit = false;
    }
    resetIsOnBatch() {
        if (this.parent.enableVirtualization && this.parent.editSettings.mode === 'Cell') {
            this.isOnBatch = false;
            this.updateGridEditMode('Normal');
        }
    }
    keyPressed(args) {
        if (this.isOnBatch || (this.parent.editSettings.mode === 'Cell' && isBlazor() && this.parent.isServerRendered)) {
            this.keyPress = args.action;
        }
        if (args.action === 'f2') {
            this.recordDoubleClick(args);
        }
    }
    deleteUniqueID(value) {
        let idFilter = 'uniqueIDFilterCollection';
        delete this.parent[idFilter][value];
        let id = 'uniqueIDCollection';
        delete this.parent[id][value];
    }
    cellEdit(args) {
        let promise = 'promise';
        let prom = args[promise];
        delete args[promise];
        if (this.parent.enableVirtualization && !isNullOrUndefined(this.prevAriaRowIndex)) {
            args.row.setAttribute('aria-rowindex', this.prevAriaRowIndex);
            this.prevAriaRowIndex = undefined;
        }
        if (this.keyPress !== 'enter') {
            this.parent.trigger(cellEdit, args, (celleditArgs) => {
                if (!celleditArgs.cancel && this.parent.editSettings.mode === 'Cell') {
                    this.enableToolbarItems('edit');
                }
                else if (celleditArgs.cancel && this.parent.editSettings.mode === 'Cell') {
                    this.isOnBatch = false;
                    this.updateGridEditMode('Normal');
                }
                if (!isNullOrUndefined(prom)) {
                    prom.resolve(celleditArgs);
                }
            });
        }
        if (this.doubleClickTarget && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
            this.doubleClickTarget.classList.contains('e-treegridcollapse') || this.doubleClickTarget.classList.contains('e-summarycell'))) {
            args.cancel = true;
            this.doubleClickTarget = null;
            return;
        }
        if (this.parent.editSettings.mode === 'Cell') {
            if (this.keyPress === 'tab' || this.keyPress === 'shiftTab') {
                this.keyPress = null;
            }
            else if (this.keyPress === 'enter') {
                args.cancel = true;
                this.keyPress = null;
            }
        }
        // if (this.isAdd && this.parent.editSettings.mode === 'Batch' && !args.cell.parentElement.classList.contains('e-insertedrow')) {
        //   this.isAdd = false;
        // }
    }
    enableToolbarItems(request) {
        if (!isNullOrUndefined(this.parent.grid.toolbarModule)) {
            let toolbarID = this.parent.element.id + '_gridcontrol_';
            this.parent.grid.toolbarModule.enableItems([toolbarID + 'add', toolbarID + 'edit', toolbarID + 'delete'], request === 'save');
            this.parent.grid.toolbarModule.enableItems([toolbarID + 'update', toolbarID + 'cancel'], request === 'edit');
        }
    }
    batchCancel(e) {
        if (this.parent.editSettings.mode === 'Cell') {
            let cellDetails = getValue('editModule.cellDetails', this.parent.grid.editModule);
            let treeCell = this.parent.getCellFromIndex(cellDetails.rowIndex, this.parent.treeColumnIndex);
            this.parent.renderModule.cellRender({
                data: cellDetails.rowData,
                cell: treeCell,
                column: this.parent.grid.getColumns()[this.parent.treeColumnIndex]
            });
            this.updateGridEditMode('Normal');
            this.isOnBatch = false;
        }
        if (this.parent.editSettings.mode === 'Batch') {
            this.parent.notify('batchCancelAction', {});
        }
    }
    customCellSave(args) {
        if (isCountRequired(this.parent) && this.parent.editSettings.mode === 'Cell' && args.action === 'edit') {
            this.updateCell(args, args.rowIndex);
            this.afterCellSave(args, args.row, args.rowIndex);
        }
    }
    cellSave(args) {
        if (this.parent.editSettings.mode === 'Cell' && this.parent.element.querySelector('form')) {
            args.cancel = true;
            let editModule = 'editModule';
            setValue('isEdit', false, this.parent.grid);
            setValue('isEditCollapse', true, this.parent);
            args.rowData[args.columnName] = args.value;
            let row;
            if (isNullOrUndefined(args.cell)) {
                row = this.parent.grid.editModule[editModule].form.parentElement.parentNode;
            }
            else {
                row = args.cell.parentNode;
            }
            let rowIndex;
            let primaryKeys = this.parent.getPrimaryKeyFieldNames();
            if (isNullOrUndefined(row)) {
                this.parent.grid.getCurrentViewRecords().filter((e, i) => {
                    if (e[primaryKeys[0]] === args.rowData[primaryKeys[0]]) {
                        rowIndex = i;
                        return;
                    }
                });
            }
            else {
                rowIndex = (this.parent.getRows().indexOf(row) === -1 && (this.parent.getFrozenColumns() > 0)) ?
                    this.parent.grid.getMovableRows().indexOf(row) : this.parent.getRows().indexOf(row);
            }
            let arg = {};
            extend(arg, args);
            arg.cancel = false;
            arg.type = 'save';
            row = this.parent.grid.getRows()[row.rowIndex];
            this.parent.trigger(actionBegin, arg);
            if (!arg.cancel) {
                if ((row.rowIndex === this.parent.getCurrentViewRecords().length - 1) && this.keyPress === 'tab') {
                    this.isTabLastRow = true;
                }
                this.blazorTemplates(args);
                if (!isRemoteData(this.parent) &&
                    !(this.parent.dataSource instanceof DataManager && this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor)) {
                    if (isCountRequired(this.parent)) {
                        let eventPromise = 'eventPromise';
                        let editArgs = { requestType: 'save', data: args.rowData, action: 'edit', row: row,
                            rowIndex: rowIndex, rowData: args.rowData, columnName: args.columnName,
                            filterChoiceCount: null, excelSearchOperator: null };
                        this.parent.grid.getDataModule()[eventPromise](editArgs, this.parent.grid.query);
                    }
                    else {
                        this.updateCell(args, rowIndex);
                        this.afterCellSave(args, row, rowIndex);
                    }
                }
                else if (isRemoteData(this.parent) ||
                    (this.parent.dataSource instanceof DataManager && this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor)) {
                    let query = this.parent.grid.query;
                    let crud = this.parent.grid.dataSource.update(primaryKeys[0], args.rowData, query.fromTable, query, args.previousValue);
                    crud.then((e) => {
                        if (!isNullOrUndefined(e)) {
                            args.rowData[args.columnName] = e[args.columnName];
                        }
                        this.updateCell(args, rowIndex);
                        this.afterCellSave(args, row, rowIndex);
                    });
                }
            }
            else {
                this.parent.grid.isEdit = true;
            }
        }
    }
    afterCellSave(args, row, rowIndex) {
        let mRow;
        if (this.parent.grid.aggregateModule) {
            this.parent.grid.aggregateModule.refresh(args.rowData);
        }
        this.parent.grid.editModule.destroyWidgets([this.parent.grid.getColumnByField(args.columnName)]);
        this.parent.grid.editModule.formObj.destroy();
        if (this.keyPress !== 'tab' && this.keyPress !== 'shiftTab') {
            this.updateGridEditMode('Normal');
            this.isOnBatch = false;
        }
        this.enableToolbarItems('save');
        if (this.parent.getFrozenColumns() > 0) {
            mRow = this.parent.grid.getMovableRows()[rowIndex];
            removeClass([mRow], ['e-editedrow', 'e-batchrow']);
            removeClass(mRow.querySelectorAll('.e-rowcell'), ['e-editedbatchcell', 'e-updatedtd']);
        }
        removeClass([row], ['e-editedrow', 'e-batchrow']);
        removeClass(row.querySelectorAll('.e-rowcell'), ['e-editedbatchcell', 'e-updatedtd']);
        this.parent.grid.focusModule.restoreFocus();
        editAction({ value: args.rowData, action: 'edit' }, this.parent, this.isSelfReference, this.addRowIndex, this.selectedIndex, args.columnName);
        if ((row.rowIndex === this.parent.getCurrentViewRecords().length - 1) && this.keyPress === 'enter') {
            this.keyPress = null;
        }
        let saveArgs = {
            type: 'save', column: this.parent.getColumnByField(args.columnName), data: args.rowData,
            previousData: args.previousValue, row: row, target: args.cell
        };
        this.parent.trigger(actionComplete, saveArgs);
    }
    lastCellTab(formObj) {
        if (!this.parent.grid.isEdit && this.isOnBatch && this.keyPress === 'tab' && this.parent.editSettings.mode === 'Cell') {
            this.updateGridEditMode('Normal');
            this.isOnBatch = false;
            this.keyPress = null;
        }
    }
    blazorTemplates(args) {
        if (isBlazor() && this.parent.isServerRendered) {
            let cols = this.parent.grid.getColumns();
            let colModel = 'columnModel';
            let columnModel = this.parent.grid[colModel];
            let str = 'isStringTemplate';
            for (let i = 0; i < cols.length; i++) {
                if (columnModel[i].template) {
                    let templateID = this.parent.grid.element.id + cols[i].uid;
                    columnModel[i].getColumnTemplate()(extend({ 'index': [i] }, args.rowData), this.parent.grid, 'template', templateID, this.parent.grid[str], null);
                }
                if (cols[i].editTemplate) {
                    updateBlazorTemplate(this.parent.grid.element.id + cols[i].uid + 'editTemplate', 'EditTemplate', cols[i]);
                }
                if (cols[i].template) {
                    updateBlazorTemplate(this.parent.grid.element.id + cols[i].uid, 'Template', cols[i], false);
                }
            }
        }
    }
    updateCell(args, rowIndex) {
        this.parent.grid.editModule.updateRow(rowIndex, args.rowData);
        this.parent.grid.getRowsObject()[rowIndex].data = args.rowData;
    }
    crudAction(details, columnName) {
        editAction(details, this.parent, this.isSelfReference, this.addRowIndex, this.selectedIndex, columnName, this.addRowRecord);
        this.parent.parentData = [];
        let data = this.parent.grid.dataSource instanceof DataManager ?
            this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource;
        for (let i = 0; i < data.length; i++) {
            data[i].index = i;
            let key = this.parent.grid.getPrimaryKeyFieldNames()[0];
            if (details.value[key] === data[i][key]) {
                if (details.action === 'add') {
                    data[i].level = this.internalProperties.level;
                    data[i].taskData = this.internalProperties.taskData;
                    data[i].uniqueID = this.internalProperties.uniqueID;
                    if (!isNullOrUndefined(this.internalProperties.parentItem)) {
                        data[i].parentItem = this.internalProperties.parentItem;
                        data[i].parentUniqueID = this.internalProperties.parentUniqueID;
                    }
                    data[i].childRecords = this.internalProperties.childRecords;
                }
            }
            setValue('uniqueIDCollection.' + data[i].uniqueID + '.index', i, this.parent);
            if (!data[i].level) {
                this.parent.parentData.push(data[i]);
            }
        }
        if (details.action === 'add' && this.previousNewRowPosition != null) {
            this.parent.setProperties({ editSettings: { newRowPosition: this.previousNewRowPosition } }, true);
            this.previousNewRowPosition = null;
        }
    }
    updateIndex(data, rows, records) {
        for (let j = 0; j < this.parent.getDataRows().length; j++) {
            let data1 = records[j];
            let index = getValue('uniqueIDCollection.' + data1.uniqueID + '.index', this.parent);
            data1.index = index;
            if (!isNullOrUndefined(data1.parentItem)) {
                let parentIndex = getValue('uniqueIDCollection.' + data1.parentItem.uniqueID + '.index', this.parent);
                data1.parentItem.index = parentIndex;
            }
        }
        let count = -1;
        for (let k = 0; k < this.parent.getRows().length; k++) {
            if (!rows[k].classList.contains('e-detailrow')) {
                count++;
            }
            let data2 = records[count];
            let index = data2.index;
            let level = data2.level;
            let row = rows[k];
            if (!isNullOrUndefined(data2.parentItem)) {
                index = getValue('uniqueIDCollection.' + data2.parentItem.uniqueID + '.index', this.parent);
            }
            let treecell = row.cells[this.parent.treeColumnIndex];
            if (!isNullOrUndefined(treecell)) {
                for (let l = 0; l < treecell.classList.length; l++) {
                    let value = treecell.classList[l];
                    let remove = /e-gridrowindex/i;
                    let removed = /e-griddetailrowindex/i;
                    let result = value.match(remove);
                    let results = value.match(removed);
                    if (result != null) {
                        removeClass([treecell], value);
                    }
                    if (results != null) {
                        removeClass([treecell], value);
                    }
                }
                if (!rows[k].classList.contains('e-detailrow')) {
                    addClass([treecell], 'e-gridrowindex' + index + 'level' + level);
                }
                else {
                    addClass([treecell], 'e-griddetailrowindex' + index + 'level' + level);
                }
            }
        }
    }
    beginAdd(args) {
        let position;
        let index = this.addRowIndex;
        let records = this.parent.grid.getCurrentViewRecords();
        if (this.parent.editSettings.mode === 'Batch') {
            index = this.batchEditModule.getAddRowIndex();
            this.selectedIndex = this.batchEditModule.getSelectedIndex();
            if (this.parent.getBatchChanges()[this.addedRecords].length > 1
                || this.parent.getBatchChanges()[this.deletedRecords].length) {
                records = this.batchEditModule.getBatchRecords();
            }
        }
        let rows = this.parent.grid.getDataRows();
        let firstAriaIndex = rows.length ? +rows[0].getAttribute('aria-rowindex') : 0;
        let lastAriaIndex = rows.length ? +rows[rows.length - 1].getAttribute('aria-rowindex') : 0;
        let withinRange = this.selectedIndex >= firstAriaIndex && this.selectedIndex <= lastAriaIndex;
        let isVirtualization = this.parent.enableVirtualization && this.addRowIndex > -1 && this.prevAriaRowIndex !== '-1';
        if (this.parent.editSettings.mode !== 'Dialog') {
            if (this.parent.editSettings.newRowPosition === 'Above') {
                position = 'before';
            }
            else if ((this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child')
                && (this.selectedIndex > -1 || isVirtualization) && withinRange) {
                position = 'after';
                if (!isNullOrUndefined(records[index]) && records[index].expanded) {
                    if (this.parent.editSettings.mode === 'Batch' && (this.parent.getBatchChanges()[this.addedRecords].length > 1
                        || this.parent.getBatchChanges()[this.deletedRecords].length)) {
                        index += findChildrenRecords(records[index]).length;
                        if (this.parent.editSettings.newRowPosition !== 'Child') {
                            let batchChildCount = this.batchEditModule.getBatchChildCount();
                            index = index + batchChildCount;
                        }
                    }
                    else {
                        index += findChildrenRecords(records[index]).length;
                    }
                }
            }
            if ((this.selectedIndex > -1 || isVirtualization) && withinRange
                && (index || (this.parent.editSettings.newRowPosition === 'Child'
                    || this.parent.editSettings.newRowPosition === 'Below'))) {
                if (index >= rows.length) {
                    index = rows.length - 2;
                }
                let r = 'rows';
                let newRowObject = this.parent.grid.contentModule[r][0];
                let focussedElement = document.activeElement;
                rows[index + 1][position](rows[0]);
                setValue('batchIndex', index + 1, this.batchEditModule);
                let rowObjectIndex = this.parent.editSettings.newRowPosition === 'Above' ? index : index + 1;
                if (this.parent.editSettings.mode === 'Batch') {
                    this.parent.grid.contentModule[r].splice(0, 1);
                    this.parent.grid.contentModule[r].splice(rowObjectIndex, 0, newRowObject);
                }
                if (this.parent.frozenRows || this.parent.getFrozenColumns() || this.parent.frozenColumns) {
                    let movableRows = this.parent.getMovableDataRows();
                    let frows = 'freezeRows';
                    let newFreezeRowObject = this.parent.grid.getRowsObject()[0];
                    movableRows[index + 1][position](movableRows[0]);
                    if (this.parent.editSettings.mode === 'Batch') {
                        this.parent.grid.contentModule[frows].splice(0, 1);
                        this.parent.grid.contentModule[frows].splice(rowObjectIndex, 0, newFreezeRowObject);
                    }
                    setValue('batchIndex', index + 1, this.batchEditModule);
                }
                if (this.parent.editSettings.mode === 'Row' || this.parent.editSettings.mode === 'Cell') {
                    let errors = this.parent.grid.getContentTable().querySelectorAll('.e-griderror');
                    for (let i = 0; i < errors.length; i++) {
                        errors[i].remove();
                    }
                    setValue('errorRules', [], this.parent.grid.editModule.formObj);
                }
                if (isVirtualization) {
                    this.prevAriaRowIndex = '-1';
                }
                focussedElement.focus();
            }
        }
    }
    // private beforeDataBound(args: BeforeDataBoundArgs): void {
    //   if (this.parent.grid.isEdit && this.parent.dataSource instanceof DataManager &&
    //         this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor) {
    //     let action: string = getValue('action', args);
    //     let data: Object = getValue('data', args);
    //     if (action === 'edit' && !isNullOrUndefined(this.editedData)) {
    //       data = extend(this.editedData, data);
    //       this.editedData = null;
    //     }
    //     if (!isNullOrUndefined(this.addedData)) {
    //       let addedData: Object = args.result[args.result.length - 1];
    //       addedData = extend(this.addedData, addedData);
    //       this.addedData = null;
    //       args.result.splice(this.addedIndex, 0, addedData);
    //       args.result.splice(args.result.length, 1);
    //     }
    //   }
    // }
    beginEdit(args) {
        if (args.requestType === 'refresh' && this.isOnBatch) {
            args.cancel = true;
            return;
        }
        if (this.parent.editSettings.mode === 'Cell' && args.requestType === 'beginEdit') {
            args.cancel = true;
            return;
        }
        if (this.doubleClickTarget && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
            this.doubleClickTarget.classList.contains('e-treegridcollapse') || this.doubleClickTarget.classList.contains('e-frame'))) {
            args.cancel = true;
            this.doubleClickTarget = null;
            return;
        }
        if (args.requestType === 'delete') {
            let data = args.data;
            for (let i = 0; i < data.length; i++) {
                this.deleteUniqueID(data[i].uniqueID);
                let childs = findChildrenRecords(data[i]);
                for (let c = 0; c < childs.length; c++) {
                    this.deleteUniqueID(childs[c].uniqueID);
                }
                args.data = [...data, ...childs];
            }
        }
        if (args.requestType === 'add') {
            this.selectedIndex = this.parent.grid.selectedRowIndex;
            if (this.parent.enableVirtualization) {
                let selector = '.e-row[aria-rowindex="' + this.selectedIndex + '"]';
                let row;
                if (this.selectedIndex > -1 && this.parent.editSettings.newRowPosition !== 'Top' &&
                    this.parent.editSettings.newRowPosition !== 'Bottom') {
                    this.prevAriaRowIndex = this.selectedIndex.toString();
                    row = this.parent.getContent().querySelector(selector);
                    this.addRowIndex = row ? row.rowIndex : 0;
                }
                else {
                    if (this.prevAriaRowIndex && this.prevAriaRowIndex !== '-1') {
                        selector = '.e-row[aria-rowindex="' + this.prevAriaRowIndex + '"]';
                        row = this.parent.getContent().querySelector(selector);
                        this.addRowIndex = row ? row.rowIndex : 0;
                    }
                    else {
                        this.addRowIndex = 0;
                    }
                }
            }
            else {
                this.addRowIndex = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
            }
            this.addRowRecord = this.parent.getSelectedRecords()[0];
        }
        args = this.beginAddEdit(args);
        // if (args.requestType === 'save' &&
        //    ((this.parent.dataSource instanceof DataManager && this.parent.dataSource.adaptor instanceof RemoteSaveAdaptor))) {
        //      if (args.action === 'edit') {
        //           this.editedData = args.data;
        //      } else if (args.action === 'add') {
        //           this.addedData = value;
        //      }
        // }
    }
    savePreviousRowPosition(args) {
        if (this.previousNewRowPosition === null) {
            this.previousNewRowPosition = this.parent.editSettings.newRowPosition;
        }
    }
    beginAddEdit(args) {
        let value = args.data;
        if (args.action === 'add') {
            let key = this.parent.grid.getPrimaryKeyFieldNames()[0];
            let position = null;
            value.taskData = isNullOrUndefined(value.taskData) ? extend({}, args.data) : value.taskData;
            // let currentData: ITreeData[] = this.batchRecords.length ? this.batchRecords :
            //            <ITreeData[]>this.parent.grid.getCurrentViewRecords();
            let currentData = this.parent.grid.getCurrentViewRecords();
            let index = this.addRowIndex;
            value.uniqueID = getUid(this.parent.element.id + '_data_');
            setValue('uniqueIDCollection.' + value.uniqueID, value, this.parent);
            let level = 0;
            let dataIndex;
            let idMapping;
            let parentUniqueID;
            let parentItem;
            let parentIdMapping;
            let isVirtualization = this.parent.enableVirtualization && this.addRowIndex > -1 && this.prevAriaRowIndex !== '-1';
            let rows = this.parent.getRows();
            let firstAriaIndex = rows.length ? +rows[0].getAttribute('aria-rowindex') : 0;
            let lastAriaIndex = rows.length ? +rows[rows.length - 1].getAttribute('aria-rowindex') : 0;
            let withinRange = this.selectedIndex >= firstAriaIndex && this.selectedIndex <= lastAriaIndex;
            if (currentData.length) {
                dataIndex = currentData[this.addRowIndex].index;
                idMapping = currentData[this.addRowIndex][this.parent.idMapping];
                parentIdMapping = currentData[this.addRowIndex][this.parent.parentIdMapping];
                if (currentData[this.addRowIndex].parentItem) {
                    parentUniqueID = currentData[this.addRowIndex].parentItem.uniqueID;
                }
                parentItem = currentData[this.addRowIndex].parentItem;
            }
            if (this.parent.editSettings.newRowPosition !== 'Top' && currentData.length) {
                level = currentData[this.addRowIndex].level;
                if (this.parent.editSettings.newRowPosition === 'Above') {
                    position = 'before';
                    index = currentData[this.addRowIndex].index;
                }
                else if (this.parent.editSettings.newRowPosition === 'Below') {
                    position = 'after';
                    let childRecordCount = findChildrenRecords(currentData[this.addRowIndex]).length;
                    let currentDataIndex = currentData[this.addRowIndex].index;
                    index = (childRecordCount > 0) ? (currentDataIndex + childRecordCount) : (currentDataIndex);
                }
                else if (this.parent.editSettings.newRowPosition === 'Child') {
                    position = 'after';
                    if ((this.selectedIndex > -1 || isVirtualization) && withinRange) {
                        value.parentItem = extend({}, currentData[this.addRowIndex]);
                        value.parentUniqueID = value.parentItem.uniqueID;
                        delete value.parentItem.childRecords;
                        delete value.parentItem[this.parent.childMapping];
                    }
                    let childRecordCount1 = findChildrenRecords(currentData[this.addRowIndex]).length;
                    let currentDataIndex1 = currentData[this.addRowIndex].index;
                    value.level = level + 1;
                    index = (childRecordCount1 > 0) ? (currentDataIndex1 + childRecordCount1) : (currentDataIndex1);
                    if (this.isSelfReference) {
                        value.taskData[this.parent.parentIdMapping] = value[this.parent.parentIdMapping] = idMapping;
                        if (!isNullOrUndefined(value.parentItem)) {
                            updateParentRow(key, value.parentItem, 'add', this.parent, this.isSelfReference, value);
                        }
                    }
                }
                if (this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below') {
                    if ((this.selectedIndex > -1 || isVirtualization) && level && withinRange) {
                        value.parentUniqueID = parentUniqueID;
                        value.parentItem = extend({}, parentItem);
                        delete value.parentItem.childRecords;
                        delete value.parentItem[this.parent.childMapping];
                    }
                    value.level = level;
                    if (this.isSelfReference) {
                        value.taskData[this.parent.parentIdMapping] = value[this.parent.parentIdMapping] = parentIdMapping;
                        if (!isNullOrUndefined(value.parentItem)) {
                            updateParentRow(key, value.parentItem, 'add', this.parent, this.isSelfReference, value);
                        }
                    }
                }
                if (position != null && (this.selectedIndex > -1 || isVirtualization) && withinRange) {
                    args.index = position === 'before' ? index : index + 1;
                }
                if (this.parent.editSettings.newRowPosition === 'Bottom') {
                    let dataSource = (this.parent.grid.dataSource instanceof DataManager ?
                        this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
                    args.index = dataSource.length;
                }
            }
            if (isNullOrUndefined(value.level)) {
                value.level = level;
            }
            // this.addedIndex = args.index;
            value.hasChildRecords = false;
            value.childRecords = [];
            value.index = 0;
        }
        if (args.action === 'add') {
            this.internalProperties = { level: value.level, parentItem: value.parentItem, uniqueID: value.uniqueID,
                taskData: value.taskData, parentUniqueID: isNullOrUndefined(value.parentItem) ? undefined : value.parentItem.uniqueID,
                childRecords: value.childRecords };
        }
        if (args.requestType === 'delete') {
            let deletedValues = args.data;
            for (let i = 0; i < deletedValues.length; i++) {
                if (deletedValues[i].parentItem) {
                    let parentItem = getParentData(this.parent, deletedValues[i].parentItem.uniqueID);
                    if (!isNullOrUndefined(parentItem) && parentItem.hasChildRecords) {
                        let childIndex = parentItem.childRecords.indexOf(deletedValues[i]);
                        parentItem.childRecords.splice(childIndex, 1);
                    }
                }
            }
        }
        return args;
    }
    /**
     * If the data,index and position given, Adds the record to treegrid rows otherwise it will create edit form.
     * @return {void}
     */
    addRecord(data, index, position) {
        this.previousNewRowPosition = this.parent.editSettings.newRowPosition;
        if (data) {
            if (index > -1) {
                this.selectedIndex = index;
                this.addRowIndex = index;
            }
            else {
                this.selectedIndex = this.parent.selectedRowIndex;
                this.addRowIndex = this.parent.selectedRowIndex;
            }
            if (position) {
                this.parent.setProperties({ editSettings: { newRowPosition: position } }, true);
            }
            this.parent.grid.editModule.addRecord(data, index);
        }
        else {
            this.parent.grid.editModule.addRecord(data, index);
        }
    }
    /**
     * Checks the status of validation at the time of editing. If validation is passed, it returns true.
     * @return {boolean}
     */
    editFormValidate() {
        return this.parent.grid.editModule.editFormValidate();
    }
    /**
     * @hidden
     */
    destroyForm() {
        this.parent.grid.editModule.destroyForm();
    }
    contentready(e) {
        if (!isNullOrUndefined(e.args.requestType)
            && (e.args.requestType.toString() === 'delete' || e.args.requestType.toString() === 'save'
                || (this.parent.editSettings.mode === 'Batch' && e.args.requestType.toString() === 'batchsave'))) {
            this.updateIndex(this.parent.grid.dataSource, this.parent.getRows(), this.parent.getCurrentViewRecords());
            if (this.parent.frozenRows || this.parent.getFrozenColumns() || this.parent.frozenColumns) {
                if (this.parent.grid.dataSource.length === this.parent.getMovableDataRows().length) {
                    this.updateIndex(this.parent.grid.dataSource, this.parent.getMovableDataRows(), this.parent.getCurrentViewRecords());
                }
            }
        }
    }
    /**
     * If the row index and field is given, edits the particular cell in a row.
     * @return {void}
     */
    editCell(rowIndex, field) {
        if (this.parent.editSettings.mode === 'Cell' || this.parent.editSettings.mode === 'Batch') {
            if (this.parent.editSettings.mode !== 'Batch') {
                this.isOnBatch = true;
                this.updateGridEditMode('Batch');
            }
            this.parent.grid.editModule.editCell(rowIndex, field);
        }
    }
}

/**
 * Command Column Module for TreeGrid
 * @hidden
 */
class CommandColumn$1 {
    constructor(parent) {
        Grid.Inject(CommandColumn);
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'commandColumn';
    }
    /**
     * Destroys the ContextMenu.
     * @method destroy
     * @return {void}
     */
    destroy() {
        //this.removeEventListener();
    }
}

/**
 * TreeGrid Detail Row module
 * @hidden
 */
class DetailRow$1 {
    constructor(parent) {
        Grid.Inject(DetailRow);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'detailRow';
    }
    addEventListener() {
        this.parent.on('dataBoundArg', this.dataBoundArg, this);
        this.parent.on('detaildataBound', this.detaildataBound, this);
        this.parent.grid.on('detail-indentcell-info', this.setIndentVisibility, this);
        this.parent.on('childRowExpand', this.childRowExpand, this);
        this.parent.on('rowExpandCollapse', this.rowExpandCollapse, this);
        this.parent.on('actioncomplete', this.actioncomplete, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('dataBoundArg', this.dataBoundArg);
        this.parent.off('detaildataBound', this.detaildataBound);
        this.parent.off('childRowExpand', this.childRowExpand);
        this.parent.off('rowExpandCollapse', this.rowExpandCollapse);
        this.parent.off('actioncomplete', this.actioncomplete);
        this.parent.grid.off('detail-indentcell-info', this.setIndentVisibility);
    }
    setIndentVisibility(args) {
        let visible = 'visible';
        args[visible] = false;
    }
    dataBoundArg() {
        let detailele = this.parent.getRows().filter((e) => {
            return !e.classList.contains('e-detailrow');
        });
        for (let i = 0; i < detailele.length; i++) {
            let elements = detailele[i].getElementsByClassName('e-detailrowcollapse');
            let detailData = this.parent.grid.getRowObjectFromUID(detailele[i].getAttribute('data-Uid'));
            let parentItem = getObject('parentItem', this.parent.grid.getCurrentViewRecords()[i]);
            if (isNullOrUndefined(parentItem) || !isNullOrUndefined(parentItem) &&
                getExpandStatus(this.parent, detailData.data, this.parent.grid.getCurrentViewRecords())) {
                this.parent.grid.detailRowModule.expand(elements[0]);
            }
        }
    }
    childRowExpand(args) {
        let detailRowElement = args.row.getElementsByClassName('e-detailrowcollapse');
        if (!isNullOrUndefined(detailRowElement[0])) {
            this.parent.grid.detailRowModule.expand(detailRowElement[0]);
        }
    }
    rowExpandCollapse(args) {
        if (isRemoteData(this.parent)) {
            return;
        }
        for (let i = 0; i < args.detailrows.length; i++) {
            args.detailrows[i].style.display = args.action;
        }
    }
    detaildataBound(args) {
        if (!isBlazor() || !this.parent.isServerRendered) {
            let data = args.data;
            let row = args.detailElement.parentElement.previousSibling;
            let index = !isNullOrUndefined(data.parentItem) ? data.parentItem.index : data.index;
            let expandClass = 'e-gridrowindex' + index + 'level' + data.level;
            let classlist = row.querySelector('.' + expandClass).classList;
            let gridClas = [].slice.call(classlist).filter((gridclass) => (gridclass === expandClass));
            let newNo = gridClas[0].length;
            let slicedclas = gridClas.toString().slice(6, newNo);
            let detailClass = 'e-griddetail' + slicedclas;
            addClass([args.detailElement.parentElement], detailClass);
        }
    }
    ;
    actioncomplete(args) {
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            let spann = (args.row.querySelectorAll('.e-editcell')[0].getAttribute('colSpan'));
            let colum = parseInt(spann, 10) - 1;
            let updtdcolum = colum.toString();
            args.row.querySelectorAll('.e-editcell')[0].setAttribute('colSpan', updtdcolum);
        }
        let focusElement = this.parent.grid.contentModule.getRows();
        for (let i = 0; i < focusElement.length; i++) {
            focusElement[i].cells[0].visible = false;
        }
        let focusModule = getObject('focusModule', this.parent.grid);
        let matrix = 'refreshMatrix';
        focusModule[matrix](true)({ rows: this.parent.grid.contentModule.getRows() });
    }
    /**
     * Destroys the DetailModule.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
    }
}

class VirtualTreeContentRenderer extends VirtualContentRenderer {
    constructor(parent, locator) {
        super(parent, locator);
        this.isExpandCollapse = false;
        this.translateY = 0;
        this.maxiPage = 0;
        this.recordAdded = false;
        /** @hidden */
        this.startIndex = -1;
        this.endIndex = -1;
        this.preTranslate = 0;
        this.isRemoteExpand = false;
        /** @hidden */
        this.isDataSourceChanged = false;
        this.addEventListener();
    }
    getModelGenerator() {
        return new TreeVirtualRowModelGenerator(this.parent);
    }
    getRowByIndex(index) {
        return this.parent.getDataRows().filter((e) => parseInt(e.getAttribute('aria-rowindex'), 0) === index)[0];
    }
    addEventListener() {
        this.parent.on(virtualActionArgs, this.virtualOtherAction, this);
        this.parent.on(indexModifier, this.indexModifier, this);
    }
    virtualOtherAction(args) {
        if (args.setTop) {
            this.translateY = 0;
            this.startIndex = 0;
            this.endIndex = this.parent.pageSettings.pageSize - 1;
        }
        else if (args.isExpandCollapse) {
            this.isExpandCollapse = true;
        }
    }
    indexModifier(args) {
        let content = this.parent.getContent().querySelector('.e-content');
        if (this.recordAdded && this.startIndex > -1 && this.endIndex > -1) {
            if (this.endIndex > args.count - this.parent.pageSettings.pageSize) {
                let nextSetResIndex = ~~(content.scrollTop / this.parent.getRowHeight());
                let lastIndex = nextSetResIndex + this.parent.getRows().length;
                if (lastIndex > args.count) {
                    lastIndex = nextSetResIndex +
                        (args.count - nextSetResIndex);
                }
                this.startIndex = lastIndex - this.parent.getRows().length;
                this.endIndex = lastIndex;
            }
            else {
                this.startIndex += 1;
                this.endIndex += 1;
            }
            this.recordAdded = false;
        }
        if (this.isDataSourceChanged) {
            this.startIndex = 0;
            this.endIndex = this.parent.pageSettings.pageSize - 1;
        }
        args.startIndex = this.startIndex;
        args.endIndex = this.endIndex;
    }
    eventListener(action) {
        if (!(this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.url !== undefined
            && this.parent.dataSource.dataSource.url !== '') || !isCountRequired(this.parent)) {
            this.parent[action]('data-ready', this.onDataReady, this);
            //this.parent[action]('refresh-virtual-block', this.refreshContentRows, this);
            this.fn = () => {
                this.observers.observes((scrollArgs) => this.scrollListeners(scrollArgs));
                this.parent.off('content-ready', this.fn);
            };
            this.parent.on('content-ready', this.fn, this);
            this.parent.addEventListener(actionComplete, this.onActionComplete.bind(this));
            this.parent[action]('virtual-scroll-edit-action-begin', this.beginEdit, this);
            this.parent[action]('virtual-scroll-add-action-begin', this.beginAdd, this);
            this.parent[action]('virtual-scroll-edit-success', this.virtualEditSuccess, this);
            this.parent[action]('edit-reset', this.resetIseditValue, this);
            this.parent[action]('get-virtual-data', this.getData, this);
            this.parent[action]('virtual-scroll-edit-cancel', this.cancelEdit, this);
        }
        else {
            super.eventListener('on');
        }
    }
    onDataReady(e) {
        super.onDataReady(e);
        if (!(this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.url !== undefined
            && this.parent.dataSource.dataSource.url !== '') || !isCountRequired(this.parent)) {
            if (!isNullOrUndefined(e.count)) {
                this.totalRecords = e.count;
                getValue('virtualEle', this).setVirtualHeight(this.parent.getRowHeight() * e.count, '100%');
                 // this.parent.pageSettings.pageSize - Math.ceil(this.parent.pageSettings.pageSize / 1.5);
            }
            if ((!isNullOrUndefined(e.requestType) && e.requestType.toString() === 'collapseAll') || this.isDataSourceChanged) {
                this.contents.scrollTop = 0;
                this.isDataSourceChanged = false;
            }
        }
    }
    renderTable() {
        super.renderTable();
        if (!(this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.url !== undefined
            && this.parent.dataSource.dataSource.url !== '') || !isCountRequired(this.parent)) {
            getValue('observer', this).options.debounceEvent = false;
            this.observers = new TreeInterSectionObserver(getValue('observer', this).element, getValue('observer', this).options);
            this.contents = this.getPanel().firstChild;
        }
    }
    getTranslateY(sTop, cHeight, info, isOnenter) {
        if ((this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.url !== undefined
            && this.parent.dataSource.dataSource.url !== '') || isCountRequired(this.parent)) {
            if (this.isRemoteExpand) {
                this.isRemoteExpand = false;
                return this.preTranslate;
            }
            else {
                this.preTranslate = super.getTranslateY(sTop, cHeight, info, isOnenter);
                return super.getTranslateY(sTop, cHeight, info, isOnenter);
            }
        }
        else {
            return super.getTranslateY(sTop, cHeight, info, isOnenter);
        }
    }
    beginEdit(e) {
        let selector = '.e-row[aria-rowindex="' + e.index + '"]';
        let index = this.parent.getContent().querySelector(selector).rowIndex;
        let rowData = this.parent.getCurrentViewRecords()[index];
        e.data = rowData;
    }
    beginAdd(args) {
        let addAction = 'addActionBegin';
        let isAdd = 'isAdd';
        let addArgs = { newRowPosition: this.rowPosition, addRowIndex: this.addRowIndex, ariaRowIndex: this.ariaRowIndex };
        this.parent.notify('get-row-position', addArgs);
        this.rowPosition = addArgs.newRowPosition;
        this.addRowIndex = addArgs.addRowIndex;
        this.ariaRowIndex = addArgs.ariaRowIndex;
        let rows = this.parent.getRows();
        let firstAriaIndex = rows.length ? +rows[0].getAttribute('aria-rowindex') : 0;
        let lastAriaIndex = rows.length ? +rows[rows.length - 1].getAttribute('aria-rowindex') : 0;
        let withInRange = this.parent.selectedRowIndex >= firstAriaIndex && this.parent.selectedRowIndex <= lastAriaIndex;
        if (!(this.rowPosition === 'Top' || this.rowPosition === 'Bottom')) {
            this[isAdd] = true;
        }
        if (this.rowPosition === 'Top' || this.rowPosition === 'Bottom' ||
            ((!this.addRowIndex || this.addRowIndex === -1) && (this.parent.selectedRowIndex === -1 || !withInRange))) {
            super[addAction](args);
        }
    }
    restoreEditState() {
        let restoreEdit = 'restoreEdit';
        super[restoreEdit]();
    }
    resetIseditValue() {
        let resetIsEdit = 'resetIsedit';
        let isAdd = 'isAdd';
        this.parent.notify('reset-edit-props', {});
        if ((this.rowPosition === 'Top' || this.rowPosition === 'Bottom') && this[isAdd]) {
            super[resetIsEdit]();
        }
    }
    virtualEditSuccess(args) {
        let isAdd = 'isAdd';
        let content = this.parent.getContent().querySelector('.e-content');
        if (this[isAdd] && content.querySelector('.e-addedrow')) {
            this.recordAdded = true;
        }
    }
    cancelEdit(args) {
        let editCancel = 'editCancel';
        super[editCancel](args);
    }
    restoreNewRow() {
        let isAdd = 'isAdd';
        let content = this.parent.getContent().querySelector('.e-content');
        if (this[isAdd] && !content.querySelector('.e-addedrow')) {
            this.parent.isEdit = false;
            this.parent.addRecord();
        }
    }
    getData(data) {
        let getVirtualData = 'getVirtualData';
        super[getVirtualData](data);
    }
    onActionComplete(args) {
        if (args.requestType === 'add') {
            let addArgs = { newRowPosition: this.rowPosition, addRowIndex: this.addRowIndex, ariaRowIndex: this.ariaRowIndex };
            this.parent.notify('get-row-position', addArgs);
            this.rowPosition = addArgs.newRowPosition;
            this.addRowIndex = addArgs.addRowIndex;
            this.ariaRowIndex = addArgs.ariaRowIndex;
        }
        let actionComplete$$1 = 'actionComplete';
        super[actionComplete$$1](args);
    }
    scrollListeners(scrollArgs) {
        let info = scrollArgs.sentinel;
        let outBuffer = 10; //this.parent.pageSettings.pageSize - Math.ceil(this.parent.pageSettings.pageSize / 1.5);
        let content = this.parent.getContent().querySelector('.e-content');
        let scrollHeight = outBuffer * this.parent.getRowHeight();
        let upScroll = (scrollArgs.offset.top - this.translateY) < 0;
        let downScroll = (scrollArgs.offset.top - this.translateY) > scrollHeight;
        if (upScroll) {
            let vHeight = +(this.parent.height.toString().indexOf('%') < 0 ? this.parent.height :
                this.parent.element.getBoundingClientRect().height);
            let index = (~~(content.scrollTop / this.parent.getRowHeight())
                + Math.ceil(vHeight / this.parent.getRowHeight()))
                - this.parent.getRows().length;
            index = (index > 0) ? index : 0;
            this.startIndex = index;
            this.endIndex = index + this.parent.getRows().length;
            if (this.endIndex > this.totalRecords) {
                let lastInx = this.totalRecords - 1;
                let remains = this.endIndex % lastInx;
                this.endIndex = lastInx;
                this.startIndex = this.startIndex - remains;
            }
            //var firsttdinx = parseInt(this.parent.getContent().querySelector('.e-content td').getAttribute('index'), 0);
            let rowPt = Math.ceil(scrollArgs.offset.top / this.parent.getRowHeight());
            rowPt = rowPt % this.parent.pageSettings.pageSize;
            let firsttdinx = 0;
            if (!isNullOrUndefined(this.parent.getRows()[rowPt])) {
                let attr = this.parent.getContent().querySelectorAll('.e-content tr')[rowPt]
                    .querySelector('td').getAttribute('index');
                firsttdinx = +attr; // this.parent.getContent().querySelector('.e-content tr').getAttribute('aria-rowindex');
            }
            if (firsttdinx === 0) {
                this.translateY = scrollArgs.offset.top;
            }
            else {
                let height = this.parent.getRowHeight();
                this.translateY = (scrollArgs.offset.top - (outBuffer * height) > 0) ?
                    scrollArgs.offset.top - (outBuffer * height) + 10 : 0;
            }
        }
        else if (downScroll) {
            let nextSetResIndex = ~~(content.scrollTop / this.parent.getRowHeight());
            let lastIndex = nextSetResIndex + this.parent.getRows().length;
            if (lastIndex > this.totalRecords) {
                lastIndex = nextSetResIndex +
                    (this.totalRecords - nextSetResIndex);
            }
            this.startIndex = lastIndex - this.parent.getRows().length;
            this.endIndex = lastIndex;
            if (scrollArgs.offset.top > (this.parent.getRowHeight() * this.totalRecords)) {
                this.translateY = this.getTranslateY(scrollArgs.offset.top, content.getBoundingClientRect().height);
            }
            else {
                this.translateY = scrollArgs.offset.top;
            }
        }
        if ((downScroll && (scrollArgs.offset.top < (this.parent.getRowHeight() * this.totalRecords)))
            || (upScroll)) {
            let viewInfo = getValue('getInfoFromView', this).apply(this, [scrollArgs.direction, info, scrollArgs.offset]);
            this.previousInfo = viewInfo;
            let page = viewInfo.loadNext && !viewInfo.loadSelf ? viewInfo.nextInfo.page : viewInfo.page;
            this.parent.setProperties({ pageSettings: { currentPage: page } }, true);
            viewInfo.event = viewInfo.event === 'refresh-virtual-block' ? 'model-changed' : viewInfo.event;
            this.parent.notify(viewInfo.event, { requestType: 'virtualscroll', focusElement: scrollArgs.focusElement });
        }
    }
    appendContent(target, newChild, e) {
        if ((this.parent.dataSource instanceof DataManager && this.parent.dataSource.dataSource.url !== undefined
            && this.parent.dataSource.dataSource.url !== '') || isCountRequired(this.parent)) {
            if (getValue('isExpandCollapse', e)) {
                this.isRemoteExpand = true;
            }
            super.appendContent(target, newChild, e);
        }
        else {
            let info = e.virtualInfo.sentinelInfo && e.virtualInfo.sentinelInfo.axis === 'Y' &&
                getValue('currentInfo', this).page && getValue('currentInfo', this).page !== e.virtualInfo.page ?
                getValue('currentInfo', this) : e.virtualInfo;
            let cBlock = (info.columnIndexes[0]) - 1;
            let cOffset = this.getColumnOffset(cBlock);
            this.virtualEle.setWrapperWidth(null, (Browser.isIE || Browser.info.name === 'edge'));
            target = this.parent.createElement('tbody');
            target.appendChild(newChild);
            let replace = 'replaceWith';
            this.getTable().querySelector('tbody')[replace](target);
            if (!this.isExpandCollapse || this.translateY === 0) {
                getValue('virtualEle', this).adjustTable(cOffset, this.translateY);
            }
            else {
                this.isExpandCollapse = false;
            }
            setValue('prevInfo', this.previousInfo ? this.previousInfo : info, this);
            let focusCell = 'focusCell';
            let restoreAdd = 'restoreAdd';
            super[focusCell](e);
            let isAdd = 'isAdd';
            if (this[isAdd] && !this.parent.getContent().querySelector('.e-content').querySelector('.e-addedrow')) {
                if (!(this.rowPosition === 'Top' || this.rowPosition === 'Bottom')) {
                    if (this.ariaRowIndex >= this.startIndex) {
                        this.restoreNewRow();
                    }
                    else if (this.addRowIndex && this.addRowIndex > -1) {
                        this[isAdd] = false;
                        this.parent.isEdit = false;
                    }
                }
            }
            this.restoreEditState();
            super[restoreAdd]();
        }
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('data-ready', this.onDataReady);
        this.parent.off('content-ready', this.fn);
        this.parent.off(virtualActionArgs, this.virtualOtherAction);
        this.parent.off(indexModifier, this.indexModifier);
        this.parent.off('virtual-scroll-edit-action-begin', this.beginEdit);
        this.parent.off('virtual-scroll-add-action-begin', this.beginAdd);
        this.parent.off('virtual-scroll-edit-success', this.virtualEditSuccess);
        this.parent.off('edit-reset', this.resetIseditValue);
        this.parent.off('get-virtual-data', this.getData);
        this.parent.off('virtual-scroll-edit-cancel', this.cancelEdit);
    }
}
class TreeInterSectionObserver extends InterSectionObserver {
    constructor() {
        super(...arguments);
        this.isWheeling = false;
        this.newPos = 0;
        this.lastPos = 0;
        this.timer = 0;
    }
    observes(callback) {
        setValue('containerRect', getValue('options', this).container.getBoundingClientRect(), this);
        EventHandler.add(getValue('options', this).container, 'scroll', this.virtualScrollHandlers(callback), this);
    }
    clear() {
        this.lastPos = null;
    }
    virtualScrollHandlers(callback) {
        let prevTop = 0;
        let prevLeft = 0;
        return (e) => {
            let scrollTop = e.target.scrollTop;
            let scrollLeft = e.target.scrollLeft;
            let direction = prevTop < scrollTop ? 'down' : 'up';
            direction = prevLeft === scrollLeft ? direction : prevLeft < scrollLeft ? 'right' : 'left';
            prevTop = scrollTop;
            prevLeft = scrollLeft;
            let current = getValue('sentinelInfo', this)[direction];
            let delta = 0;
            this.newPos = scrollTop;
            if (this.lastPos != null) { // && newPos < maxScroll 
                delta = this.newPos - this.lastPos;
            }
            this.lastPos = this.newPos;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(this.clear, 0);
            /*if (this.options.axes.indexOf(current.axis) === -1) {
                return;
            }*/
            /*if(delta > 45 || delta < -45){
              this.isWheeling = true;
            }*/
            if ((delta > 100 || delta < -100) && (e && e.preventDefault)) {
                e.returnValue = false;
                e.preventDefault();
            }
            callback({ direction: direction, isWheel: this.isWheeling,
                sentinel: current, offset: { top: scrollTop, left: scrollLeft },
                focusElement: document.activeElement });
        };
    }
}

/**
 * TreeGrid Virtual Scroll module will handle Virtualization
 * @hidden
 */
class VirtualScroll$1 {
    /**
     * Constructor for VirtualScroll module
     */
    constructor(parent) {
        this.prevstartIndex = -1;
        this.prevendIndex = -1;
        this.parent = parent;
        let injectedModules = 'injectedModules';
        let modules = Grid.prototype[injectedModules];
        for (let i = 0; i < modules.length; i++) {
            if (modules[i] === VirtualScroll) {
                modules.splice(i, 1);
                break;
            }
        }
        Grid.Inject(TreeVirtual);
        this.addEventListener();
    }
    returnVisualData(args) {
        args.data = this.visualData;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'virtualScroll';
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(localPagedExpandCollapse, this.collapseExpandVirtualchilds, this);
        this.parent.on(pagingActions, this.virtualPageAction, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(localPagedExpandCollapse, this.collapseExpandVirtualchilds);
        this.parent.off(pagingActions, this.virtualPageAction);
    }
    collapseExpandVirtualchilds(row) {
        this.parent.grid.notify(virtualActionArgs, { isExpandCollapse: true });
        this.expandCollapseRec = row.record;
        row.record.expanded = row.action === 'collapse' ? false : true;
        let ret = {
            result: this.parent.flatData,
            row: row.row,
            action: row.action,
            record: row.record,
            count: this.parent.flatData.length
        };
        this.parent.grid.clearSelection();
        let requestType = getValue('isCollapseAll', this.parent) ? 'collapseAll' : 'refresh';
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret, { requestType: requestType });
    }
    virtualPageAction(pageingDetails) {
        let dm = new DataManager(pageingDetails.result);
        let expanded$$1 = new Predicate('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
        let parents = dm.executeLocal(new Query().where(expanded$$1));
        let visualData = parents.filter((e) => {
            return getExpandStatus(this.parent, e, parents);
        });
        this.visualData = visualData;
        this.parent.grid.notify(dataListener, { data: visualData });
        let counts = { startIndex: -1, endIndex: -1, count: pageingDetails.count };
        this.parent.grid.notify(indexModifier, counts);
        let startIndex = counts.startIndex;
        let endIndex = counts.endIndex;
        pageingDetails.count = visualData.length;
        if (startIndex === -1 && endIndex === -1) {
            let query = new Query();
            let size = this.parent.grid.pageSettings.pageSize;
            let current = this.parent.grid.pageSettings.currentPage;
            let skip = size * (current - 1);
            query = query.skip(skip).take(size);
            dm.dataSource.json = visualData;
            pageingDetails.result = dm.executeLocal(query);
        }
        else {
            let requestType = pageingDetails.actionArgs.requestType;
            if (requestType === 'filtering') {
                startIndex = 0;
                endIndex = this.parent.grid.pageSettings.pageSize - 1;
                this.parent.grid.notify(virtualActionArgs, { setTop: true });
            }
            //if ((this.prevendIndex !== -1 && this.prevstartIndex !== -1) && 
            //this.prevendIndex === endIndex && this.prevstartIndex === startIndex) {
            if (!isNullOrUndefined(this.expandCollapseRec)) {
                let resourceCount = this.parent.getRows();
                let sIndex = visualData.indexOf(this.expandCollapseRec);
                let tempdata = visualData.slice(sIndex, sIndex + resourceCount.length);
                if (tempdata.length < resourceCount.length && sIndex >= 0) {
                    sIndex = visualData.length - resourceCount.length;
                    sIndex = sIndex > 0 ? sIndex : 0;
                    startIndex = sIndex;
                    endIndex = visualData.length;
                }
                else if (getValue('isCollapseAll', this.parent)) {
                    startIndex = 0;
                    endIndex = this.parent.grid.pageSettings.pageSize - 1;
                    this.parent.grid.notify(virtualActionArgs, { setTop: true });
                }
                this.expandCollapseRec = null;
            }
            //}
            pageingDetails.result = visualData.slice(startIndex, endIndex);
            this.prevstartIndex = startIndex;
            this.prevendIndex = endIndex;
        }
        this.parent.notify('updateAction', pageingDetails);
    }
    /**
     * To destroy the virtualScroll module
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
}
class TreeVirtual extends VirtualScroll {
    constructor(parent, locator) {
        super(parent, locator);
        getValue('parent', this).off('initial-load', getValue('instantiateRenderer', this), this);
        getValue('parent', this).on('initial-load', this.instantiateRenderers, this);
    }
    instantiateRenderers() {
        getValue('parent', this).log(['limitation', 'virtual_height'], 'virtualization');
        let renderer = getValue('locator', this).getService('rendererFactory');
        getValue('addRenderer', renderer)
            .apply(renderer, [RenderType.Content, new VirtualTreeContentRenderer(getValue('parent', this), getValue('locator', this))]);
        //renderer.addRenderer(RenderType.Content, new VirtualTreeContentRenderer(getValue('parent', this), getValue('locator', this)));
        this.ensurePageSize();
    }
    ensurePageSize() {
        let parentGrid = getValue('parent', this);
        let rowHeight = parentGrid.getRowHeight();
        if (!isNullOrUndefined(parentGrid.height) && typeof (parentGrid.height) === 'string' && parentGrid.height.indexOf('%') !== -1) {
            parentGrid.element.style.height = parentGrid.height;
        }
        let vHeight = parentGrid.height.toString().indexOf('%') < 0 ? parentGrid.height :
            parentGrid.element.getBoundingClientRect().height;
        let blockSize = ~~(vHeight / rowHeight);
        let height = blockSize * 2;
        let size = parentGrid.pageSettings.pageSize;
        parentGrid.setProperties({ pageSettings: { pageSize: size < height ? height : size } }, true);
    }
}

/**
 * TreeGrid Freeze module
 * @hidden
 */
class Freeze$1 {
    /**
     * Constructor for render module
     */
    constructor(parent) {
        Grid.Inject(Freeze);
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on('rowExpandCollapse', this.rowExpandCollapse, this);
        this.parent.on('dataBoundArg', this.dataBoundArg, this);
        this.parent.grid.on('dblclick', this.dblClickHandler, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('rowExpandCollapse', this.rowExpandCollapse);
        this.parent.off('dataBoundArg', this.dataBoundArg);
        this.parent.grid.off('dblclick', this.dblClickHandler);
    }
    rowExpandCollapse(args) {
        let movableRows = this.parent.getMovableDataRows();
        let frozenrows = this.parent.getRows();
        let rows;
        if (!args.detailrows.length) {
            rows = movableRows.filter((e) => e.querySelector('.e-gridrowindex' + args.record.index + 'level' + (args.record.level + 1)));
        }
        else {
            rows = args.detailrows;
        }
        for (let i = 0; i < rows.length; i++) {
            let rData = this.parent.grid.getRowObjectFromUID(rows[i].getAttribute('data-Uid')).data;
            rows[i].style.display = args.action;
            let queryselector = args.action === 'none' ? '.e-treecolumn-container .e-treegridcollapse'
                : '.e-treecolumn-container .e-treegridexpand';
            if (frozenrows[rows[i].rowIndex].querySelector(queryselector)) {
                let cRow = [];
                for (let i = 0; i < movableRows.length; i++) {
                    if (movableRows[i].querySelector('.e-gridrowindex' + rData.index + 'level' + (rData.level + 1))) {
                        cRow.push(movableRows[i]);
                    }
                }
                if (cRow.length) {
                    this.rowExpandCollapse({ detailrows: cRow, action: args.action });
                }
            }
        }
    }
    dblClickHandler(e) {
        if (parentsUntil(e.target, 'e-rowcell') &&
            this.parent.grid.editSettings.allowEditOnDblClick && this.parent.editSettings.mode !== 'Cell') {
            this.parent.grid.editModule.startEdit(parentsUntil(e.target, 'e-row'));
        }
    }
    dataBoundArg(args) {
        let checkboxColumn = this.parent.getColumns().filter((e) => {
            return e.showCheckbox;
        });
        if (checkboxColumn.length && this.parent.freezeModule && this.parent.initialRender) {
            addClass([this.parent.element.getElementsByClassName('e-grid')[0]], 'e-checkselection');
        }
    }
    destroy() {
        this.removeEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'freeze';
    }
}

/**
 * TreeGrid ColumnChooser module
 * @hidden
 */
class ColumnChooser$1 {
    /**
     * Constructor for render module
     */
    constructor(parent) {
        Grid.Inject(ColumnChooser);
        this.parent = parent;
    }
    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     * @param  {number} X - Defines the X axis.
     * @param  {number} Y - Defines the Y axis.
     * @return {void}
     */
    openColumnChooser(X, Y) {
        return this.parent.grid.columnChooserModule.openColumnChooser(X, Y);
    }
    /**
     * Destroys the openColumnChooser.
     * @method destroy
     * @return {void}
     */
    destroy() {
        //this.parent.grid.ColumnChooserModule.destroy();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'ColumnChooser';
    }
}

/**
 * actions export
 */

/**
 * TreeGrid component exported items
 */

/**
 * Export TreeGrid component
 */

export { TreeGrid, load, rowDataBound, dataBound, queryCellInfo, beforeDataBound, actionBegin, dataStateChange, actionComplete, rowSelecting, rowSelected, checkboxChange, rowDeselected, toolbarClick, beforeExcelExport, beforePdfExport, resizeStop, expanded, expanding, collapsed, collapsing, remoteExpand, localPagedExpandCollapse, pagingActions, printGridInit, contextMenuOpen, contextMenuClick, beforeCopy, beforePaste, savePreviousRowPosition, crudAction, beginEdit, beginAdd, recordDoubleClick, cellSave, cellSaved, cellEdit, batchDelete, batchCancel, batchAdd, beforeBatchDelete, beforeBatchAdd, beforeBatchSave, batchSave, keyPressed, updateData, doubleTap, virtualColumnIndex, virtualActionArgs, dataListener, indexModifier, beforeStartEdit, beforeBatchCancel, batchEditFormRendered, detailDataBound, rowDrag, rowDragStartHelper, rowDrop, rowDragStart, rowsAdd, rowsRemove, rowdraging, rowDropped, DataManipulation, Reorder$1 as Reorder, Resize$1 as Resize, RowDD$1 as RowDD, Column, EditSettings, Predicate$1 as Predicate, FilterSettings, PageSettings, SearchSettings, SelectionSettings, AggregateColumn, AggregateRow, SortDescriptor, SortSettings, RowDropSettings$1 as RowDropSettings, Render, TreeVirtualRowModelGenerator, isRemoteData, isCountRequired, isCheckboxcolumn, isFilterChildHierarchy, findParentRecords, getExpandStatus, findChildrenRecords, isOffline, extendArray, getPlainData, getParentData, isHidden, ToolbarItem, ContextMenuItems, Filter$1 as Filter, ExcelExport$1 as ExcelExport, PdfExport$1 as PdfExport, Page$1 as Page, Toolbar$1 as Toolbar, Aggregate$1 as Aggregate, Sort$1 as Sort, TreeClipboard, ColumnMenu$1 as ColumnMenu, ContextMenu$1 as ContextMenu, Edit$1 as Edit, CommandColumn$1 as CommandColumn, Selection, DetailRow$1 as DetailRow, VirtualScroll$1 as VirtualScroll, TreeVirtual, Freeze$1 as Freeze, ColumnChooser$1 as ColumnChooser, Logger$1 as Logger, treeGridDetails };
//# sourceMappingURL=ej2-treegrid.es2015.js.map
