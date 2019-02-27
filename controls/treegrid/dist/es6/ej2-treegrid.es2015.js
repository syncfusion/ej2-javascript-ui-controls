import { ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, compile, createElement, extend, getEnumValue, getValue, isNullOrUndefined, merge, removeClass, setValue } from '@syncfusion/ej2-base';
import { Aggregate, CellType, ColumnMenu, CommandColumn, ContextMenu, Edit, ExcelExport, Filter, Grid, Page, PdfExport, Predicate, Print, Reorder, Resize, Sort, TextWrapSettings, Toolbar, appendChildren, calculateAggregate, getActualProperties, getObject, getUid, iterateArrayOrObject, iterateExtend } from '@syncfusion/ej2-grids';
import { CacheAdaptor, DataManager, DataUtil, ODataAdaptor, Predicate as Predicate$1, Query, RemoteSaveAdaptor, UrlAdaptor, WebApiAdaptor, WebMethodAdaptor } from '@syncfusion/ej2-data';
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
 * Configures the filtering behavior of the TreeGrid.
 */
class FilterSettings extends ChildProperty {
}
__decorate$1([
    Collection([], Predicate)
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
const actionComplete = 'actionComplete';
/** @hidden */
const rowSelected = 'rowSelected';
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

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
__decorate$2([
    Property()
], SearchSettings.prototype, "fields", void 0);
__decorate$2([
    Property(false)
], SearchSettings.prototype, "ignoreCase", void 0);
__decorate$2([
    Property()
], SearchSettings.prototype, "operators", void 0);
__decorate$2([
    Property()
], SearchSettings.prototype, "key", void 0);
__decorate$2([
    Property()
], SearchSettings.prototype, "hierarchyMode", void 0);

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
__decorate$3([
    Property('Row')
], SelectionSettings.prototype, "mode", void 0);
__decorate$3([
    Property('Flow')
], SelectionSettings.prototype, "cellSelectionMode", void 0);
__decorate$3([
    Property('Single')
], SelectionSettings.prototype, "type", void 0);
__decorate$3([
    Property(false)
], SelectionSettings.prototype, "persistSelection", void 0);

function isRemoteData(parent) {
    if (parent.dataSource instanceof DataManager) {
        let adaptor = parent.dataSource.adaptor;
        return (adaptor instanceof ODataAdaptor ||
            (adaptor instanceof WebApiAdaptor) || (adaptor instanceof WebMethodAdaptor) ||
            (adaptor instanceof CacheAdaptor) || adaptor instanceof UrlAdaptor);
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
        parents.filter((e) => { return e.uniqueID === record.parentItem.uniqueID; })[0];
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
            childParent = parents.filter((e) => { return e.uniqueID === parentRecord.parentItem.uniqueID; })[0];
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
    if (isNullOrUndefined(records) || !records.hasChildRecords) {
        return [];
    }
    let childRecords = records.childRecords;
    for (let i = 0, len = Object.keys(childRecords).length; i < len; i++) {
        datas.push(childRecords[i]);
        if (childRecords[i].hasChildRecords) {
            datas = [...datas, ...findChildrenRecords(childRecords[i])];
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
    for (let i = 0; i < array.length; i++) {
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
        if (!isNullOrUndefined(data.parentItem) &&
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
        addClass([args.row], 'e-gridrowindex' + index + 'level' + args.data.level);
        let summaryRow = getObject('isSummaryRow', args.data);
        if (summaryRow) {
            addClass([args.row], 'e-summaryrow');
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
        let ispadfilter = isNullOrUndefined(data.filterLevel);
        let pad = ispadfilter ? data.level : data.filterLevel;
        let totalIconsWidth = 0;
        if (grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            let container = createElement('div', {
                className: 'e-treecolumn-container'
            });
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
            if (iconRequired) {
                addClass([args.cell], 'e-treerowcell');
                let expandIcon = createElement('span', {
                    className: 'e-icons'
                });
                let expand;
                if (this.parent.initialRender) {
                    expand = data.expanded &&
                        (isNullOrUndefined(data[this.parent.expandStateMapping]) || data[this.parent.expandStateMapping]) &&
                        !this.parent.enableCollapseAll;
                }
                else {
                    expand = !(!data.expanded || !getExpandStatus(this.parent, data, this.parent.grid.getCurrentViewRecords()));
                }
                let collapsed$$1 = true;
                if (!isNullOrUndefined(data.parentItem) && (!isNullOrUndefined(data[this.parent.expandStateMapping])
                    && data[this.parent.expandStateMapping])
                    && !(this.parent.allowPaging && !(this.parent.pageSettings.pageSizeMode === 'Root'))) {
                    collapsed$$1 = !getExpandStatus(this.parent, args.data, this.parent.grid.getCurrentViewRecords());
                }
                addClass([expandIcon], (expand && collapsed$$1) ? 'e-treegridexpand' : 'e-treegridcollapse');
                totalIconsWidth += 18;
                container.appendChild(expandIcon);
                emptyExpandIcon.style.width = '7px';
                totalIconsWidth += 7;
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            else if (pad) {
                // icons width
                totalIconsWidth += 20;
                container.appendChild(emptyExpandIcon.cloneNode());
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            //should add below code when paging funcitonality implemented
            // if (data.hasChildRecords) {
            //     addClass([expandIcon], data.expanded ? 'e-treegridexpand' : 'e-treegridcollapse');
            // }
            let cellElement = createElement('span', {
                className: 'e-treecell'
            });
            if (this.parent.allowTextWrap) {
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
            let textContent = args.cell.querySelector('.e-treecell') != null ?
                args.cell.querySelector('.e-treecell').innerHTML : args.cell.innerHTML;
            cellElement.innerHTML = textContent;
            container.appendChild(cellElement);
            args.cell.innerHTML = '';
            args.cell.appendChild(container);
        }
        let summaryRow = getObject('isSummaryRow', args.data);
        if (summaryRow) {
            addClass([args.cell], 'e-summarycell');
            let summaryData = getObject(args.column.field, args.data);
            args.cell.querySelector('.e-treecell') != null ?
                args.cell.querySelector('.e-treecell').innerHTML = summaryData : args.cell.innerHTML = summaryData;
        }
        this.parent.trigger(queryCellInfo, args);
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
        this.parent.on('createSortRecords', this.createSorting, this);
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
        this.parent.off('createSortRecords', this.createSorting);
    }
    createSorting(data) {
        this.flatSortedData = [];
        this.createSortRecords(data);
    }
    createSortRecords(data) {
        let sortData = getObject('modifiedData', data);
        let parentRecords = getObject('parentRecords', data);
        let parentIndex = getObject('parentIndex', data);
        let filteredResult = getObject('filteredResult', data);
        let dataLength = Object.keys(sortData).length;
        for (let i = 0, len = dataLength; i < len; i++) {
            let currentSortData = sortData[i];
            this.storedIndex++;
            let level = 0;
            currentSortData.index = this.storedIndex;
            if (!isNullOrUndefined(currentSortData[this.parent.childMapping])) {
                currentSortData.childRecords =
                    currentSortData[this.parent.childMapping];
                currentSortData.hasChildRecords = true;
                currentSortData.expanded = true;
            }
            if (isNullOrUndefined(currentSortData.uniqueID)) {
                currentSortData.uniqueID = getUid(this.parent.element.id + '_data_');
            }
            if (!isNullOrUndefined(parentRecords)) {
                let parentData = extend({}, parentRecords);
                delete parentData.childRecords;
                delete parentData[this.parent.childMapping];
                currentSortData.parentItem = parentData;
                currentSortData.parentUniqueID = parentData.uniqueID;
                level = parentRecords.level + 1;
            }
            currentSortData.level = level;
            if (isNullOrUndefined(currentSortData[this.parent.parentIdMapping]) ||
                currentSortData.parentItem) {
                this.flatSortedData.push(currentSortData);
            }
            if (!isNullOrUndefined(currentSortData[this.parent.childMapping])) {
                this.createSortRecords({ modifiedData: currentSortData[this.parent.childMapping], parentRecords: currentSortData,
                    filteredResult: filteredResult });
            }
        }
        this.parent.notify('Sorting', { sortedData: this.flatSortedData, filteredData: filteredResult });
    }
    createdSortedRecords(sortingElements) {
        let data = getObject('modifiedData', sortingElements);
        let sortQuery = getObject('srtQry', sortingElements);
        let parent = getObject('parent', sortingElements);
        for (let i = 0, len = Object.keys(data).length; i < len; i++) {
            if (!isNullOrUndefined(data[i].childRecords) || !isNullOrUndefined(data[i][parent.childMapping])) {
                let sortedData;
                let sortchildData;
                if (isNullOrUndefined(data[i].childRecords)) {
                    sortedData = new DataManager(data[i][parent.childMapping]).executeLocal(sortQuery);
                }
                else {
                    sortedData = new DataManager(data[i].childRecords).executeLocal(sortQuery);
                }
                sortchildData = sortedData;
                if (sortchildData.length > 0) {
                    data[i][parent.childMapping] = sortchildData;
                }
                this.createdSortedRecords({ modifiedData: sortchildData, parent: parent, srtQry: sortQuery });
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
        this.parent.sortSettings = this.parent.grid.sortSettings;
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
 * Internal dataoperations for tree grid
 * @hidden
 */
class DataManipulation {
    constructor(grid) {
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
        this.parent.on('Sorting', this.sortedRecords, this);
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
        this.parent.off('Sorting', this.sortedRecords);
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
        // let gridData: DataManager = <DataManager>this.parent.dataSource;
        // return gridData.dataSource.offline !== true && gridData.dataSource.url !== undefined;
    }
    /**
     * Function to manipulate datasource
     * @hidden
     */
    convertToFlatData(data) {
        this.parent.flatData = [];
        if ((isRemoteData(this.parent) && !isOffline(this.parent)) && data instanceof DataManager) {
            let dm = this.parent.dataSource;
            if (this.parent.parentIdMapping) {
                this.parent.query = isNullOrUndefined(this.parent.query) ?
                    new Query() : this.parent.query;
                if (this.parent.parentIdMapping) {
                    this.parent.query.where(this.parent.parentIdMapping, 'equal', null);
                }
                if (!this.parent.hasChildMapping) {
                    let qry = this.parent.query.clone();
                    qry.queries = [];
                    qry = qry.select([this.parent.parentIdMapping]);
                    dm.executeQuery(qry).then((e) => {
                        this.parentItems = DataUtil.distinct(e.result, this.parent.parentIdMapping, false);
                        let req = getObject('dataSource.requests', this.parent).filter((e) => {
                            return e.httpRequest.statusText !== 'OK';
                        }).length;
                        if (req === 0) {
                            setValue('grid.contentModule.isLoaded', true, this).parent;
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
            this.hierarchyData = [];
            this.taskIds = [];
            for (let i = 0; i < Object.keys(data).length; i++) {
                let tempData = data[i];
                this.hierarchyData.push(extend({}, tempData, true));
                if (!isNullOrUndefined(tempData[this.parent.idMapping])) {
                    this.taskIds.push(tempData[this.parent.idMapping]);
                }
            }
            let mappingData = new DataManager(data).executeLocal(new Query()
                .where(this.parent.parentIdMapping, 'notequal', null)
                .group(this.parent.parentIdMapping));
            //let selfData: Object[] = [];
            for (let i = 0; i < mappingData.length; i++) {
                let groupData = mappingData[i];
                let index = this.taskIds.indexOf(groupData.key);
                if (index > -1) {
                    if (!isNullOrUndefined(groupData.key)) {
                        let childData = iterateExtend(groupData.items);
                        if (this.isSelfReference) {
                            if (!this.updateChildHierarchy(this.hierarchyData, this.hierarchyData[index], childData, index)) {
                                this.hierarchyData[index][this.parent.childMapping] = childData;
                                if (!isNullOrUndefined(this.hierarchyData[index][this.parent.parentIdMapping])) {
                                    this.hierarchyData.splice(index, 1);
                                    this.taskIds.splice(index, 1);
                                }
                            }
                        }
                        else {
                            this.hierarchyData[index][this.parent.childMapping] = childData;
                        }
                    }
                }
            }
            if (!Object.keys(this.hierarchyData).length) {
                this.parent.flatData = [];
            }
            else {
                this.createRecords(this.hierarchyData);
            }
            this.storedIndex = -1;
        }
        // else if (data instanceof DataManager && this.parent.isLocalData) {
        //   this.convertToFlatData(data.dataSource.json);
        // }
        //this.crudActions();
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
    updateChildHierarchy(data, currentData, childData, index) {
        let parentID = currentData[this.parent.parentIdMapping];
        let returns = false;
        let id = currentData[this.parent.idMapping];
        for (let i = 0; i < data.length; i++) {
            if (data[i][this.parent.idMapping] === parentID) {
                let childs = data[i][this.parent.childMapping];
                for (let j = 0; j < childs.length; j++) {
                    if (childs[j][this.parent.idMapping] === id) {
                        childs[j][this.parent.childMapping] = childData;
                        this.hierarchyData.splice(index, 1);
                        this.taskIds.splice(index, 1);
                        return true;
                    }
                }
            }
            else if (!isNullOrUndefined(data[i][this.parent.childMapping])) {
                returns = this.updateChildHierarchy(data[i][this.parent.childMapping], currentData, childData, index);
            }
        }
        return returns;
    }
    /**
     * Function to update the zeroth level parent records in remote binding
     * @hidden
     */
    updateParentRemoteData(args) {
        let records = args.result;
        if (!this.parent.hasChildMapping && !this.parentItems.length) {
            this.zerothLevelData = args;
            setValue('cancel', true, args);
        }
        else {
            for (let rec = 0; rec < records.length; rec++) {
                if ((records[rec][this.parent.hasChildMapping] || this.parentItems.indexOf(records[rec][this.parent.idMapping]) !== -1)
                    && (isNullOrUndefined(records[rec].index))) {
                    records[rec].level = 0;
                    records[rec].index = Math.ceil(Math.random() * 1000);
                    records[rec].hasChildRecords = true;
                }
            }
        }
        args.result = records;
        this.parent.notify('updateResults', args);
    }
    /**
     * Function to manipulate datasource
     * @hidden
     */
    collectExpandingRecs(rowDetails) {
        let args = { row: rowDetails.parentRow, data: rowDetails.record };
        if (rowDetails.rows.length > 0) {
            rowDetails.record.expanded = true;
            for (let i = 0; i < rowDetails.rows.length; i++) {
                rowDetails.rows[i].style.display = 'table-row';
            }
            this.parent.trigger(expanded, args);
        }
        else {
            let dm = this.parent.dataSource;
            let qry = this.parent.grid.getDataModule().generateQuery();
            let clonequries = qry.queries.filter((e) => e.fn !== 'onPage' && e.fn !== 'onWhere');
            qry.queries = clonequries;
            qry.where(this.parent.parentIdMapping, 'equal', rowDetails.record[this.parent.idMapping]);
            showSpinner(this.parent.element);
            dm.executeQuery(qry).then((e) => {
                let datas = this.parent.grid.currentViewData;
                let inx = datas.indexOf(rowDetails.record);
                let haveChild = getObject('actual.nextLevel', e);
                let result = e.result;
                for (let r = 0; r < result.length; r++) {
                    result[r].level = rowDetails.record.level + 1;
                    result[r].index = Math.ceil(Math.random() * 1000);
                    result[r].parentItem = rowDetails.record;
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
                e.count = this.parent.grid.pageSettings.totalRecordsCount;
                getValue('grid.renderModule', this.parent).dataManagerSuccess(e);
                this.parent.trigger(expanded, args);
            });
        }
    }
    beginSorting() {
        this.isSortAction = true;
    }
    createRecords(data, parentRecords) {
        for (let i = 0, len = Object.keys(data).length; i < len; i++) {
            let currentData = data[i];
            let level = 0;
            this.storedIndex++;
            currentData.index = this.storedIndex;
            if (!isNullOrUndefined(currentData[this.parent.childMapping])) {
                currentData.childRecords = currentData[this.parent.childMapping];
                currentData.hasChildRecords = true;
                currentData.expanded = !isNullOrUndefined(currentData[this.parent.expandStateMapping])
                    ? currentData[this.parent.expandStateMapping] : true;
            }
            currentData.index = currentData.hasChildRecords ? this.storedIndex : this.storedIndex;
            if (isNullOrUndefined(currentData[this.parent.parentIdMapping])) {
                this.parent.parentData.push(currentData);
            }
            currentData.uniqueID = getUid(this.parent.element.id + '_data_');
            if (!isNullOrUndefined(parentRecords)) {
                let parentData = extend({}, parentRecords);
                delete parentData.childRecords;
                delete parentData[this.parent.childMapping];
                currentData.parentItem = parentData;
                currentData.parentUniqueID = parentData.uniqueID;
                level = parentRecords.level + 1;
            }
            currentData.level = level;
            if (isNullOrUndefined(currentData[this.parent.parentIdMapping]) || currentData.parentItem) {
                this.parent.flatData.push(currentData);
            }
            if (!isNullOrUndefined(currentData[this.parent.childMapping] && currentData[this.parent.childMapping].length)) {
                this.createRecords(currentData[this.parent.childMapping], currentData);
            }
        }
    }
    sortedRecords(data) {
        let sortedData = getObject('sortedData', data);
        this.sortedData = [];
        if (this.parent.grid.filterSettings.columns.length > 0) {
            let sortedData = getObject('sortedData', data);
            let filteredData = getObject('filteredData', data);
            for (let i = 0, len = Object.keys(sortedData).length; i < len; i++) {
                for (let j = 0, sortlen = Object.keys(filteredData).length; j < sortlen; j++) {
                    let sortData = getObject('uniqueID', sortedData[i]);
                    let filterData = getObject('uniqueID', filteredData[j]);
                    if (sortData === filterData) {
                        this.sortedData.push(sortedData[i]);
                    }
                }
            }
        }
        else {
            for (let i = 0, len = Object.keys(sortedData).length; i < len; i++) {
                this.sortedData.push(sortedData[i]);
            }
        }
    }
    /**
     * Function to perform filtering/sorting action for local data
     * @hidden
     */
    dataProcessor(args) {
        let dataObj = this.parent.grid.dataSource;
        let results = dataObj instanceof DataManager ? dataObj.dataSource.json : dataObj;
        let count = results.length;
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
            //this.parent.filterModule.updatedFilteredRecord(filteredData);
            if (this.parent.grid.aggregates.length > 0) {
                let query = getObject('query', args);
                if (isNullOrUndefined(gridQuery)) {
                    gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
                }
                let summaryQuery = query.queries.filter((q) => q.fn === 'onAggregates');
                results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, results, true);
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
            let action = 'action';
            if (args[action] !== 'collapse' && args[action] !== 'expand') {
                if (!this.isSelfReference && this.parent.childMapping.length > 0) {
                    parentData = iterateExtend(this.parent.dataSource);
                }
                else {
                    parentData = iterateExtend(this.parent.parentData);
                }
                let query = getObject('query', args);
                this.parent.sortModule = new Sort$1(this.parent);
                let srtQry = new Query();
                for (let srt = this.parent.grid.sortSettings.columns.length - 1; srt >= 0; srt--) {
                    let col = this.parent.getColumnByField(this.parent.grid.sortSettings.columns[srt].field);
                    let compFun = col.sortComparer && !this.isRemote() ?
                        col.sortComparer.bind(col) :
                        this.parent.grid.sortSettings.columns[srt].direction;
                    srtQry.sortBy(this.parent.grid.sortSettings.columns[srt].field, compFun);
                }
                let modifiedData = new DataManager(parentData).executeLocal(srtQry);
                this.parent.notify('createSort', { modifiedData: modifiedData, parent: this.parent, srtQry: srtQry });
                this.parent.notify('createSortRecords', {
                    modifiedData: modifiedData,
                    parentRecords: null, filteredResult: results
                });
            }
            results = this.sortedData;
            this.parent.notify('updateModel', {});
            if (this.parent.grid.aggregates.length > 0) {
                let isSort = false;
                let query = getObject('query', args);
                let summaryQuery = query.queries.filter((q) => q.fn === 'onAggregates');
                results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.sortedData, isSort);
            }
        }
        count = results.length;
        if (this.parent.allowPaging) {
            this.parent.notify(pagingActions, { result: results, count: count });
            results = this.dataResults.result;
            count = this.dataResults.count;
        }
        /*if (isNullOrUndefined(this.dataResults.result)) {
          args.result = <ITreeData[]>results;
          args.count = count;
        } else {
          args.result = <ITreeData[]>this.dataResults.result;
          args.count = this.dataResults.count;
        }*/
        args.result = results;
        args.count = count;
        this.parent.notify('updateResults', args);
    }
    /**
     * update for datasource
     */
    updateData(dataResult) {
        this.dataResults = dataResult;
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

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
__decorate$4([
    Property(12)
], PageSettings.prototype, "pageSize", void 0);
__decorate$4([
    Property(8)
], PageSettings.prototype, "pageCount", void 0);
__decorate$4([
    Property(1)
], PageSettings.prototype, "currentPage", void 0);
__decorate$4([
    Property()
], PageSettings.prototype, "totalRecordsCount", void 0);
__decorate$4([
    Property(false)
], PageSettings.prototype, "enableQueryString", void 0);
__decorate$4([
    Property(false)
], PageSettings.prototype, "pageSizes", void 0);
__decorate$4([
    Property(null)
], PageSettings.prototype, "template", void 0);
__decorate$4([
    Property('All')
], PageSettings.prototype, "pageSizeMode", void 0);

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
__decorate$5([
    Property()
], AggregateColumn.prototype, "type", void 0);
__decorate$5([
    Property()
], AggregateColumn.prototype, "footerTemplate", void 0);
__decorate$5([
    Property()
], AggregateColumn.prototype, "field", void 0);
__decorate$5([
    Property()
], AggregateColumn.prototype, "format", void 0);
__decorate$5([
    Property()
], AggregateColumn.prototype, "columnName", void 0);
__decorate$5([
    Property()
], AggregateColumn.prototype, "customAggregate", void 0);
class AggregateRow extends ChildProperty {
}
__decorate$5([
    Collection([], AggregateColumn)
], AggregateRow.prototype, "columns", void 0);
__decorate$5([
    Property(true)
], AggregateRow.prototype, "showChildSummary", void 0);

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
__decorate$6([
    Property(false)
], EditSettings.prototype, "allowAdding", void 0);
__decorate$6([
    Property(false)
], EditSettings.prototype, "allowEditing", void 0);
__decorate$6([
    Property(false)
], EditSettings.prototype, "allowDeleting", void 0);
__decorate$6([
    Property('Cell')
], EditSettings.prototype, "mode", void 0);
__decorate$6([
    Property('Top')
], EditSettings.prototype, "newRowPosition", void 0);
__decorate$6([
    Property(true)
], EditSettings.prototype, "allowEditOnDblClick", void 0);
__decorate$6([
    Property(true)
], EditSettings.prototype, "showConfirmDialog", void 0);
__decorate$6([
    Property(false)
], EditSettings.prototype, "showDeleteConfirmDialog", void 0);
__decorate$6([
    Property('')
], EditSettings.prototype, "template", void 0);

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
__decorate$7([
    Property()
], SortDescriptor.prototype, "field", void 0);
__decorate$7([
    Property()
], SortDescriptor.prototype, "direction", void 0);
/**
 * Configures the sorting behavior of TreeGrid.
 */
class SortSettings extends ChildProperty {
}
__decorate$7([
    Collection([], SortDescriptor)
], SortSettings.prototype, "columns", void 0);
__decorate$7([
    Property(true)
], SortSettings.prototype, "allowUnsort", void 0);

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let TreeGrid = class TreeGrid extends Component {
    constructor(options, element) {
        super(options, element);
        this.dataResults = {};
        this.grid = new Grid();
    }
    /**
     * Export TreeGrid data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     */
    excelExport(excelExportProperties, isMultipleExport, 
    /* tslint:disable-next-line:no-any */
    workbook, isBlob) {
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, false);
    }
    /**
     * Export TreeGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     *
     */
    csvExport(excelExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, workbook, isBlob) {
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, true);
    }
    /**
     * Export TreeGrid data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     *
     */
    pdfExport(pdfExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, pdfDoc, isBlob) {
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
            CollapseAll: 'Collapse All'
        };
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
        this.sortModule.clearSorting();
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
     * [`searchSettings`](./api-searchSettings.html).
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
     * [`printMode`](./api-treegrid.html#printmode-string).
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
                    this.expandCollapseRequest(collapsetarget.querySelector('.e-icons'));
                    break;
                case 'ctrlShiftDownArrow':
                    let expandtarget = e.target;
                    this.expandCollapseRequest(expandtarget.querySelector('.e-icons'));
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
        let rowElement = summaryRowElement.nextSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
            rowElement.style.display === 'none')) {
            rowElement = this.findnextRowElement(rowElement);
        }
        return rowElement;
    }
    // Get Proper Row Element from the summary 
    findPreviousRowElement(summaryRowElement) {
        let rowElement = summaryRowElement.previousSibling;
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
        EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
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
                member: 'summary',
                args: [this]
            });
        }
        if (this.allowResizing) {
            modules.push({
                member: 'resize',
                args: [this]
            });
        }
        if (this.allowFiltering || (this.toolbar && this.toolbar.indexOf('Search') !== -1)) {
            modules.push({
                member: 'filter',
                args: [this, this.filterSettings]
            });
        }
        if (this.allowExcelExport) {
            modules.push({
                member: 'ExcelExport',
                args: [this]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this]
            });
        }
        if (this.showColumnMenu) {
            modules.push({
                member: 'columnMenu',
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
        return modules;
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
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
    }
    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    render() {
        createSpinner({ target: this.element }, this.createElement);
        this.renderModule = new Render(this);
        this.dataModule = new DataManipulation(this);
        this.printModule = new Print$1(this);
        this.columnMenuModule = new ColumnMenu$1(this);
        this.trigger(load);
        this.autoGenerateColumns();
        this.convertTreeData(this.dataSource);
        this.initialRender = true;
        this.loadGrid();
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
    convertTreeData(data) {
        if (data instanceof Array && data.length > 0 && data[0].hasOwnProperty('level')) {
            this.flatData = data;
        }
        else {
            this.dataModule.convertToFlatData(data);
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
        this.grid.dataSource = isRemoteData(this) ? this.dataSource : this.flatData;
        this.grid.enableRtl = this.enableRtl;
        this.grid.columns = this.getGridColumns();
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
        this.grid.width = this.width;
        this.grid.height = this.height;
        this.grid.enableAltRow = this.enableAltRow;
        this.grid.allowReordering = this.allowReordering;
        this.grid.allowTextWrap = this.allowTextWrap;
        this.grid.allowResizing = this.allowResizing;
        this.grid.enableHover = this.enableHover;
        this.grid.rowHeight = this.rowHeight;
        this.grid.gridLines = this.gridLines;
        this.grid.allowSelection = this.allowSelection;
        this.grid.toolbar = getActualProperties(this.getGridToolbar());
        this.grid.toolbarTemplate = this.toolbarTemplate;
        this.grid.filterSettings = getActualProperties(this.filterSettings);
        this.grid.selectionSettings = getActualProperties(this.selectionSettings);
        this.grid.sortSettings = getActualProperties(this.sortSettings);
        this.grid.searchSettings = getActualProperties(this.searchSettings);
        this.grid.aggregates = getActualProperties(this.aggregates);
        this.grid.textWrapSettings = getActualProperties(this.textWrapSettings);
        this.grid.printMode = getActualProperties(this.printMode);
        this.grid.locale = getActualProperties(this.locale);
        this.grid.contextMenuItems = getActualProperties(this.getContextMenu());
        this.grid.columnMenuItems = getActualProperties(this.columnMenuItems);
        this.grid.editSettings = this.getGridEditSettings();
    }
    triggerEvents(args) {
        this.trigger(getObject('name', args), args);
    }
    bindGridEvents() {
        let treeGrid = this;
        this.grid.rowSelecting = this.triggerEvents.bind(this);
        this.grid.rowSelected = (args) => {
            this.selectedRowIndex = this.grid.selectedRowIndex;
            this.trigger(rowSelected, args);
        };
        this.grid.rowDeselected = (args) => {
            this.selectedRowIndex = this.grid.selectedRowIndex;
            this.trigger(rowDeselected, args);
        };
        this.grid.toolbarClick = (args) => {
            this.trigger(toolbarClick, args);
            if (args.cancel) {
                return;
            }
            this.notify(toolbarClick, args);
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
        this.grid.pdfExportComplete = this.triggerEvents.bind(this);
        this.grid.excelExportComplete = this.triggerEvents.bind(this);
        this.grid.excelHeaderQueryCellInfo = this.triggerEvents.bind(this);
        this.grid.pdfHeaderQueryCellInfo = this.triggerEvents.bind(this);
        this.grid.dataSourceChanged = this.triggerEvents.bind(this);
        this.grid.dataStateChange = this.triggerEvents.bind(this);
        this.grid.recordDoubleClick = this.triggerEvents.bind(this);
        this.grid.rowDeselecting = this.triggerEvents.bind(this);
        this.grid.cellDeselected = this.triggerEvents.bind(this);
        this.grid.cellSelecting = this.triggerEvents.bind(this);
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
        this.grid.printComplete = this.triggerEvents.bind(this);
        this.grid.beginEdit = this.triggerEvents.bind(this);
        this.grid.cellEdit = this.triggerEvents.bind(this);
        this.grid.actionFailure = this.triggerEvents.bind(this);
        this.grid.dataBound = (args) => {
            this.updateColumnModel();
            this.trigger(dataBound, args);
            if (isRemoteData(this) && !isOffline(this) && !this.hasChildMapping) {
                let req = getObject('dataSource.requests', this).filter((e) => {
                    return e.httpRequest.statusText !== 'OK';
                }).length;
                setValue('grid.contentModule.isLoaded', !(req > 0), this);
            }
            this.initialRender = false;
        };
        this.grid.beforeDataBound = function (args) {
            if (isRemoteData(treeGrid) && !isOffline(treeGrid)) {
                treeGrid.notify('updateRemoteLevel', args);
                args = (treeGrid.dataResults);
            }
            else if (treeGrid.flatData.length === 0 && isOffline(treeGrid) && treeGrid.dataSource instanceof DataManager) {
                let dm = treeGrid.dataSource;
                treeGrid.dataModule.convertToFlatData(dm.dataSource.json);
                args.result = treeGrid.flatData;
            }
            if (!isRemoteData(treeGrid)) {
                treeGrid.notify('dataProcessor', args);
                //args = this.dataModule.dataProcessor(args);
            }
            extend(args, treeGrid.dataResults);
            // this.notify(events.beforeDataBound, args);
            if (!this.isPrinting) {
                treeGrid.trigger(beforeDataBound, args);
            }
        };
        this.extendedGridEvents();
        this.extendedGridEditEvents();
    }
    extendedGridEditEvents() {
        this.grid.cellSave = (args) => {
            this.trigger(cellSave, args);
            if (!args.cancel) {
                this.notify(cellSave, args);
            }
        };
        // this.grid.cellSaved = (args: CellSaveArgs): void => {
        //   this.trigger(events.cellSaved, args);
        //   this.notify(events.cellSaved, args);
        // };
        this.grid.cellEdit = (args) => {
            this.trigger(cellEdit, args);
            this.notify(cellEdit, args);
        };
        // this.grid.batchAdd = (args: BatchAddArgs): void => {
        //   this.trigger(events.batchAdd, args);
        //   this.notify(events.batchAdd, args);
        // }
        // this.grid.beforeBatchSave = (args: BeforeBatchSaveArgs): void => {
        //   this.trigger(events.beforeBatchSave, args);
        //   this.notify(events.beforeBatchSave, args);
        // }
        // this.grid.beforeBatchAdd = (args: BeforeBatchAddArgs): void => {
        //   this.trigger(events.beforeBatchAdd, args);
        //   this.notify(events.beforeBatchAdd, args);
        // }
        // this.grid.batchDelete = (args: BatchDeleteArgs): void => {
        //   this.trigger(events.batchDelete, args);
        //   this.notify(events.batchDelete, args);
        // }
        this.grid.batchCancel = (args) => {
            if (this.editSettings.mode !== 'Cell') {
                this.trigger(batchCancel, args);
            }
            this.notify(batchCancel, args);
        };
    }
    extendedGridEvents() {
        let treeGrid = this;
        this.grid.recordDoubleClick = (args) => {
            this.trigger(recordDoubleClick, args);
            this.notify(recordDoubleClick, args);
        };
        this.grid.actionBegin = (args) => {
            let requestType = getObject('requestType', args);
            if (requestType === 'reorder') {
                this.notify('getColumnIndex', {});
            }
            if (!isRemoteData(this) && !isNullOrUndefined(this.filterModule)
                && (this.grid.filterSettings.columns.length === 0 || this.grid.searchSettings.key.length === 0)) {
                this.notify('clearFilters', { flatData: this.grid.dataSource });
                this.grid.dataSource = this.dataResults.result;
            }
            this.trigger(actionBegin, args);
            this.notify(beginEdit, args);
        };
        this.grid.actionComplete = (args) => {
            this.updateColumnModel();
            if (args.requestType === 'reorder') {
                this.notify('setColumnIndex', {});
            }
            if (this.isLocalData) {
                if ((args.requestType === 'delete' || args.requestType === 'save')) {
                    this.notify(crudAction, { value: args.data, action: args.action || args.requestType });
                }
                if (args.requestType === 'add' && (this.editSettings.newRowPosition !== 'Top' && this.editSettings.newRowPosition !== 'Bottom')) {
                    this.notify(beginAdd, args);
                }
                if (args.requestType === 'batchsave') {
                    this.notify(batchSave, args);
                }
            }
            this.trigger(actionComplete, args);
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
    /**
     * Renders TreeGrid component
     * @private
     */
    loadGrid() {
        this.bindGridProperties();
        this.bindGridEvents();
        setValue('registeredTemplate', this.registeredTemplate, this.grid);
    }
    /**
     * AutoGenerate TreeGrid columns from first record
     * @hidden
     */
    autoGenerateColumns() {
        if (!this.columns.length && (!this.dataModule.isRemote() && Object.keys(this.dataSource).length)) {
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
        edit.allowAdding = this.editSettings.allowAdding;
        edit.allowEditing = this.editSettings.allowEditing;
        edit.allowDeleting = this.editSettings.allowDeleting;
        edit.newRowPosition = this.editSettings.newRowPosition === 'Bottom' ? 'Bottom' : 'Top';
        edit.allowEditOnDblClick = this.editSettings.allowEditOnDblClick;
        edit.showConfirmDialog = this.editSettings.showConfirmDialog;
        edit.template = this.editSettings.template;
        edit.showDeleteConfirmDialog = this.editSettings.showDeleteConfirmDialog;
        switch (this.editSettings.mode) {
            case 'Dialog':
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
                        items.push({ text: 'AddRow', target: '.e-content', id: this.element.id + '_gridcontrol_cmenu_AddRow',
                            items: [{ text: 'Above', id: 'Above' }, { text: 'Below', id: 'Below' }] });
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
            this.l10n = new L10n('treegrid', this.defaultLocale, this.locale);
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
    getGridColumns() {
        let column = this.columns;
        this.columnModel = [];
        let treeGridColumn;
        let gridColumn;
        let gridColumnCollection = [];
        for (let i = 0; i < column.length; i++) {
            gridColumn = {};
            treeGridColumn = {};
            if (typeof this.columns[i] === 'string') {
                gridColumn.field = treeGridColumn.field = this.columns[i];
            }
            else {
                for (let prop of Object.keys(column[i])) {
                    gridColumn[prop] = treeGridColumn[prop] = column[i][prop];
                }
            }
            this.columnModel.push(new Column(treeGridColumn));
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
        for (let prop of properties) {
            switch (prop) {
                case 'columns':
                    this.grid.columns = this.getGridColumns();
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
                case 'aggregates':
                    this.grid.aggregates = getActualProperties(this.aggregates);
                    break;
                case 'dataSource':
                    this.isLocalData = (!(this.dataSource instanceof DataManager) || (!isNullOrUndefined(this.dataSource.ready))
                        || this.dataSource.adaptor instanceof RemoteSaveAdaptor);
                    this.convertTreeData(this.dataSource);
                    if (this.isLocalData) {
                        this.grid.dataSource = this.flatData.slice();
                    }
                    else {
                        this.grid.dataSource = this.dataSource;
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
                    this.refresh();
                    break;
                case 'gridLines':
                    this.grid.gridLines = this.gridLines;
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
                case 'enableAltRow':
                    this.grid.enableAltRow = this.enableAltRow;
                    break;
                case 'enableHover':
                    this.grid.enableHover = this.enableHover;
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
                    break;
                case 'contextMenuItems':
                    this.grid.contextMenuItems = this.getContextMenu();
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
                this.refresh();
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
        this.grid.destroy();
        this.dataModule.destroy();
        let modules = ['dataModule', 'sortModule', 'renderModule', 'filterModule', 'printModule',
            'excelExportModule', 'pdfExportModule', 'toolbarModule', 'summaryModule', 'reorderModule', 'resizeModule',
            'pagerModule', 'keyboardModule', 'columnMenuModule', 'contextMenuModule', 'editModule'];
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
     */
    dataBind() {
        super.dataBind();
        this.grid.dataBind();
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
        keyEntity.forEach((value) => {
            let currentObject = this[value];
            for (let val of ignoreOnPersist[value]) {
                delete currentObject[val];
            }
        });
        this.ignoreInArrays(ignoreOnColumn, this.columns);
        return this.addOnPersist(keyEntity);
    }
    ignoreInArrays(ignoreOnColumn, columns) {
        columns.forEach((column) => {
            if (column.columns) {
                this.ignoreInColumn(ignoreOnColumn, column);
                this.ignoreInArrays(ignoreOnColumn, column.columns);
            }
            else {
                this.ignoreInColumn(ignoreOnColumn, column);
            }
        });
    }
    ignoreInColumn(ignoreOnColumn, column) {
        ignoreOnColumn.forEach((val) => {
            delete column[val];
            column.filter = {};
        });
    }
    mouseClickHandler(e) {
        if (!isNullOrUndefined(e.touches)) {
            return;
        }
        let target = e.target;
        if (target.classList.contains('e-treegridexpand') ||
            target.classList.contains('e-treegridcollapse')) {
            this.expandCollapseRequest(target);
        }
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
     * @param {number} index - Defines the row index to be added
     */
    addRecord(data, index) {
        this.grid.editModule.addRecord(data, index);
    }
    /**
     * Cancels edited state.
     */
    closeEdit() {
        this.grid.editModule.closeEdit();
    }
    /**
     * Delete a record with Given options. If fieldName and data is not given then TreeGrid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldName - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     */
    deleteRecord(fieldName, data) {
        this.grid.editModule.deleteRecord(fieldName, data);
    }
    /**
     * To edit any particular row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
     */
    startEdit() {
        this.grid.editModule.startEdit();
    }
    /**
     * If TreeGrid is in editable state, you can save a record by invoking endEdit.
     */
    endEdit() {
        this.grid.editModule.endEdit();
    }
    /**
     * Delete any visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    deleteRow(tr) {
        this.grid.editModule.deleteRow(tr);
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
    }
    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *  @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     *  @param {Object} rowData - To update new data for the particular row.
     */
    setRowData(key, rowData) {
        this.grid.setRowData(key, rowData);
    }
    /**
     * Navigates to the specified target page.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    goToPage(pageNo) {
        this.grid.pagerModule.goToPage(pageNo);
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
        return iterateArrayOrObject(this.columnModel, (item, index) => {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    }
    /**
     * Gets a column by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {Column}
     */
    getColumnByUid(uid) {
        return iterateArrayOrObject(this.columnModel, (item, index) => {
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
        return this.grid.showColumns(keys, showBy);
    }
    /**
     * Hides a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    hideColumns(keys, hideBy) {
        return this.grid.hideColumns(keys, hideBy);
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
        this.updateColumnModel(this.grid.getColumns(isRefresh));
        return this.columnModel;
    }
    updateColumnModel(column) {
        let gridColumns = isNullOrUndefined(column) ? this.grid.getColumns() : column;
        let gridColumn;
        this.columnModel = [];
        for (let i = 0; i < gridColumns.length; i++) {
            gridColumn = {};
            for (let prop of Object.keys(gridColumns[i])) {
                gridColumn[prop] = gridColumns[i][prop];
            }
            this.columnModel.push(new Column(gridColumn));
        }
        this.setProperties({ columns: this.columnModel }, true);
        return this.columnModel;
    }
    /**
     * Gets the content div of the TreeGrid.
     * @return {Element}
     */
    getContent() {
        return this.grid.getContent();
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
     * @hidden
     */
    getCurrentViewRecords() {
        return this.grid.currentViewData;
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
        this.grid.refresh();
    }
    /**
     * Refreshes the TreeGrid column changes.
     */
    refreshColumns() {
        this.grid.columns = this.getGridColumns();
        this.grid.refreshColumns();
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
        let rowInfo = this.grid.getRowInfo(target);
        let record = rowInfo.rowData;
        if (target.classList.contains('e-treegridexpand')) {
            this.collapseRow(rowInfo.row, record);
        }
        else {
            this.expandRow(rowInfo.row, record);
        }
    }
    /**
     * Expands child rows
     * @return {void}
     */
    expandRow(row, record) {
        record = this.getCollapseExpandRecords(row, record);
        let args = { data: record, row: row, cancel: false };
        this.trigger(expanding, args);
        if (args.cancel) {
            return;
        }
        this.expandCollapse('expand', row, record);
        if (!(isRemoteData(this) && !isOffline(this))) {
            let collapseArgs = { data: record, row: row };
            this.trigger(expanded, collapseArgs);
        }
    }
    getCollapseExpandRecords(row, record) {
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All' && this.isExpandAll && isNullOrUndefined(record)) {
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
        this.trigger(collapsing, args);
        if (args.cancel) {
            return;
        }
        this.expandCollapse('collapse', row, record);
        let collapseArgs = { data: record, row: row };
        this.trigger(collapsed, collapseArgs);
    }
    /**
     * Expands the records at specific hierarchical level
     * @return {void}
     */
    expandAtLevel(level) {
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All') {
            let rec = this.flatData.filter((e) => {
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
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All') {
            let rec = this.flatData.filter((e) => {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = false;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.collapseRow(null, rec);
        }
        else {
            let rec = this.getRecordDetails(level);
            let rows = getObject('rows', rec);
            let records = getObject('records', rec);
            for (let i = 0; i < records.length; i++) {
                this.collapseRow(rows[i], records[i]);
            }
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
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All') {
            this.flatData.filter((e) => {
                if (e.hasChildRecords) {
                    e.expanded = action === 'collapse' ? false : true;
                }
            });
            action === 'collapse' ? this.collapseRow(rows[0]) : this.expandRow(rows[0]);
        }
        else {
            for (let i = 0; i < rows.length; i++) {
                action === 'collapse' ? this.collapseRow(rows[i]) : this.expandRow(rows[i]);
            }
        }
        this.isExpandAll = false;
    }
    expandCollapse(action, row, record, isChild) {
        let gridRows = this.getRows();
        let rowIndex;
        if (isNullOrUndefined(row)) {
            rowIndex = record.index;
            row = gridRows[rowIndex];
        }
        else {
            rowIndex = +row.getAttribute('aria-rowindex');
        }
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All' && !isRemoteData(this)) {
            this.notify(localPagedExpandCollapse, { action: action, row: row, record: record });
        }
        else {
            let displayAction;
            if (action === 'expand') {
                displayAction = 'table-row';
                if (!isChild) {
                    record.expanded = true;
                }
                let targetEle = row.getElementsByClassName('e-treegridcollapse')[0];
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                addClass([targetEle], 'e-treegridexpand');
                removeClass([targetEle], 'e-treegridcollapse');
            }
            else {
                displayAction = 'none';
                if (!isChild) {
                    record.expanded = false;
                }
                let targetEle = row.getElementsByClassName('e-treegridexpand')[0];
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                addClass([targetEle], 'e-treegridcollapse');
                removeClass([targetEle], 'e-treegridexpand');
            }
            let args = { data: record, row: row };
            if (isRemoteData(this) && !isOffline(this)) {
                let rows = gridRows.filter((r) => r.classList.contains('e-gridrowindex' + record.index + 'level' + (record.level + 1)));
                if (action === 'expand') {
                    this.notify(remoteExpand, { record: record, rows: rows, parentRow: row });
                }
                else {
                    this.collapseRemoteChild(rows);
                    this.trigger(collapsed, args);
                }
            }
            else {
                let childRecords = this.getCurrentViewRecords().filter((e) => {
                    return (e.parentUniqueID === record.uniqueID);
                });
                let index = childRecords[0].parentItem.index;
                let rows = gridRows.filter((r) => r.classList.contains('e-gridrowindex' + record.index + 'level' + (record.level + 1)));
                for (let i = 0; i < rows.length; i++) {
                    rows[i].style.display = displayAction;
                    if (!isNullOrUndefined(childRecords[i].childRecords) && (action !== 'expand' ||
                        isNullOrUndefined(childRecords[i].expanded) || childRecords[i].expanded)) {
                        this.expandCollapse(action, rows[i], childRecords[i], true);
                    }
                }
            }
        }
    }
    collapseRemoteChild(rows) {
        for (let i = 0; i < rows.length; i++) {
            let rData = this.grid.getRowObjectFromUID(rows[i].getAttribute('data-Uid')).data;
            rData.expanded = false;
            rows[i].style.display = 'none';
            if (rows[i].querySelector('.e-treecolumn-container .e-treegridexpand')) {
                removeClass([rows[i].getElementsByClassName('e-icons')[0]], 'e-treegridexpand');
                addClass([rows[i].getElementsByClassName('e-icons')[0]], 'e-treegridcollapse');
                let cRow = this.getRows().filter((r) => r.classList.contains('e-gridrowindex' + rData.index + 'level' + (rData.level + 1)));
                this.collapseRemoteChild(cRow);
            }
        }
    }
    /**
     * @hidden
     */
    addListener() {
        this.on('updateResults', this.updateResultModel, this);
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
};
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
    Complex({}, PageSettings)
], TreeGrid.prototype, "pageSettings", void 0);
__decorate([
    Property()
], TreeGrid.prototype, "pagerTemplate", void 0);
__decorate([
    Property(false)
], TreeGrid.prototype, "showColumnMenu", void 0);
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
    Property(null)
], TreeGrid.prototype, "rowHeight", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "enableAltRow", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "allowKeyboard", void 0);
__decorate([
    Property(true)
], TreeGrid.prototype, "enableHover", void 0);
__decorate([
    Property('auto')
], TreeGrid.prototype, "height", void 0);
__decorate([
    Property('auto')
], TreeGrid.prototype, "width", void 0);
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
], TreeGrid.prototype, "actionBegin", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "actionComplete", void 0);
__decorate([
    Event()
], TreeGrid.prototype, "beginEdit", void 0);
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
TreeGrid = __decorate([
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
        this.treeColumn = treeColumn;
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
        this.parent.on('setColumnIndex', this.setTreeColumnIndex, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('getColumnIndex', this.getTreeColumn);
        this.parent.off('setColumnIndex', this.getTreeColumn);
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
        this.treeColumn = this.parent.columns[this.parent.treeColumnIndex];
    }
    setTreeColumnIndex() {
        let treeIndex;
        for (let f = 0; f < this.parent.columns.length; f++) {
            let treeColumnfield = getObject('field', this.treeColumn);
            let parentColumnfield = getObject('field', this.parent.columns[f]);
            if (treeColumnfield === parentColumnfield) {
                treeIndex = f;
            }
        }
        this.parent.treeColumnIndex = treeIndex;
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
 * Base export
 */

/**
 * Models export
 */

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
        this.flatFilteredData = dataDetails.data;
        this.filteredParentRecs = [];
        this.filteredResult = [];
        this.isHierarchyFilter = false;
        for (let f = 0; f < this.flatFilteredData.length; f++) {
            let rec = this.flatFilteredData[f];
            this.addParentRecord(rec);
            if (this.parent.filterSettings.hierarchyMode === 'Child' ||
                this.parent.filterSettings.hierarchyMode === 'None' || this.parent.searchSettings.hierarchyMode === 'Child' ||
                this.parent.searchSettings.hierarchyMode === 'None') {
                this.isHierarchyFilter = true;
            }
            let ischild = getObject('childRecords', rec);
            if (!isNullOrUndefined(ischild) && ischild.length) {
                setValue('hasFilteredChildRecords', this.checkChildExsist(rec), rec);
            }
            let parent = getObject('parentItem', rec);
            if (!isNullOrUndefined(parent)) {
                let parRecord = this.flatFilteredData.filter((e) => {
                    return e.uniqueID === rec.parentItem.uniqueID;
                })[0];
                setValue('hasFilteredChildRecords', true, parRecord);
            }
        }
        if (this.flatFilteredData.length > 0 && this.isHierarchyFilter) {
            this.updateFilterLevel();
        }
        this.parent.notify('updateAction', { result: this.filteredResult });
    }
    addParentRecord(record) {
        let parent = this.parent.flatData.filter((e) => { return e.uniqueID === record.parentUniqueID; })[0];
        if (this.parent.filterSettings.hierarchyMode === 'None' || this.parent.searchSettings.hierarchyMode === 'None') {
            if (isNullOrUndefined(parent)) {
                if (this.flatFilteredData.indexOf(record) !== -1) {
                    if (this.filteredResult.indexOf(record) === -1) {
                        this.filteredResult.push(record);
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
                    }
                }
                else {
                    if (this.filteredResult.indexOf(record) === -1 && this.flatFilteredData.indexOf(record) !== -1) {
                        this.filteredResult.push(record);
                    }
                }
            }
        }
        else {
            if (!isNullOrUndefined(parent)) {
                if (this.parent.filterSettings.hierarchyMode === 'Child'
                    || this.parent.searchSettings.hierarchyMode === 'Child') {
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
            }
        }
    }
    checkChildExsist(records) {
        let childRec = getObject('childRecords', records);
        let isExist = false;
        for (let count = 0; count < childRec.length; count++) {
            let ischild = getObject('childRecords', childRec[count]);
            if ((this.parent.filterSettings.hierarchyMode === 'Child' || this.parent.filterSettings.hierarchyMode === 'Both') ||
                (this.parent.searchSettings.hierarchyMode === 'Child' || this.parent.searchSettings.hierarchyMode === 'Both')) {
                this.filteredResult.push(childRec[count]);
                isExist = true;
            }
            if (this.parent.filterSettings.hierarchyMode === 'None' || this.parent.searchSettings.hierarchyMode === 'None') {
                if (this.flatFilteredData.indexOf(childRec[count] !== -1)) {
                    isExist = true;
                    break;
                }
            }
            if (!isNullOrUndefined(ischild) && ischild.length) {
                isExist = this.checkChildExsist(childRec[count]);
            }
        }
        return isExist;
    }
    updateFilterLevel() {
        let record = this.filteredResult;
        let len = this.filteredResult.length;
        for (let c = 0; c < len; c++) {
            let parent = this.parent.flatData.filter((e) => { return e.uniqueID === record[c].parentUniqueID; })[0];
            let isPrst = record.indexOf(parent) !== -1;
            if (isPrst) {
                let parent = this.filteredResult.filter((e) => { return e.uniqueID === record[c].parentUniqueID; })[0];
                setValue('filterLevel', parent.filterLevel + 1, record[c]);
            }
            else {
                setValue('filterLevel', 0, record[c]);
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
            let fLevel = getObject('filterLevel', currentRecord);
            if (fLevel || fLevel === 0 || !isNullOrUndefined(getObject('hasFilteredChildRecords', currentRecord))) {
                let ischild = getObject('childRecords', currentRecord);
                setValue('hasFilteredChildRecords', null, currentRecord);
                setValue('filterLevel', null, currentRecord);
            }
        }
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
    }
    updateExcelResultModel(returnResult) {
        this.dataResults = returnResult;
    }
    Map(excelExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, workbook, isBlob, isCsv) {
        let dataSource = this.parent.flatData;
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
                this.manipulateExportProperties(excelExportProperties, dataSource, this.isLocal() ? null : e);
                return this.parent.grid.excelExportModule.Map(this.parent.grid, excelExportProperties, isMultipleExport, workbook, isCsv, isBlob);
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
        if (isNullOrUndefined(queryResult)) {
            if (this.parent.grid.sortSettings.columns.length === 0 &&
                (this.parent.grid.filterSettings.columns.length > 0 || this.parent.grid.searchSettings.key)) {
                dtSrc = this.parent.filterModule.filteredResult;
            }
        }
        else {
            this.parent.parentData = [];
            //count not required for this query
            this.parent.dataModule.convertToFlatData(getObject('result', queryResult));
            let args = Object();
            setValue('query', this.parent.grid.getDataModule().generateQuery(true), args);
            this.parent.notify('dataProcessor', args);
            //args = this.parent.dataModule.dataProcessor(args);
            args = this.dataResults;
            dtSrc = isNullOrUndefined(args.result) ? this.parent.flatData.slice(0) : args.result;
            this.parent.flatData = [];
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
        let dtSrc = this.parent.flatData;
        let prop = Object();
        setValue('cancel', false, prop);
        let isLocal = !isRemoteData(this.parent) && isOffline(this.parent);
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
                this.manipulatePdfProperties(pdfExportProperties, dtSrc, isLocal ? null : e);
                return this.parent.grid.pdfExportModule.Map(this.parent.grid, pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
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
        if (isNullOrUndefined(queryResult)) {
            if ((this.parent.grid.filterSettings.columns.length > 0 || this.parent.grid.searchSettings.key)
                && this.parent.grid.sortSettings.columns.length === 0) {
                dtSrc = this.parent.filterModule.filteredResult;
            }
        }
        else {
            this.parent.parentData = [];
            //count not required for this query
            let args = {};
            this.parent.dataModule.convertToFlatData(getValue('result', queryResult));
            setValue('query', this.parent.grid.getDataModule().generateQuery(true), args);
            this.parent.notify('dataProcessor', args);
            //args = this.parent.dataModule.dataProcessor(args);
            args = this.dataResults;
            dtSrc = isNullOrUndefined(args.result)
                ? this.parent.flatData.slice(0) : args.result;
            this.parent.flatData = [];
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
        let ret = {
            result: this.parent.flatData,
            row: rowDetails.row,
            action: rowDetails.action,
            record: rowDetails.record,
            count: this.parent.flatData.length
        };
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret);
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
            let expanded$$1 = new Predicate$1('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
            let parents = dm.executeLocal(new Query().where(expanded$$1));
            let visualData = parents.filter((e) => {
                return getExpandStatus(this.parent, e, parents);
            });
            pageingDetails.count = visualData.length;
            let query = new Query();
            let size = this.parent.grid.pageSettings.pageSize;
            let current = this.parent.grid.pageSettings.currentPage;
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
        this.parent.on(toolbarClick, this.toolbarClickHandler, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(toolbarClick, this.toolbarClickHandler);
    }
    toolbarClickHandler(args) {
        if (this.parent.editSettings.mode === 'Cell' && this.parent.grid.editSettings.mode === 'Batch' &&
            args.item.id === this.parent.grid.element.id + '_update') {
            args.cancel = true;
            this.parent.grid.editModule.saveCell();
        }
        if (args.item.id === this.parent.grid.element.id + '_expandall') {
            this.parent.expandAll();
        }
        else if (args.item.id === this.parent.grid.element.id + '_collapseall') {
            this.parent.collapseAll();
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
        for (let i = 0, len = dataLength; i < len; i++) {
            parentRecord = parentRecords[i];
            childRecordsLength = this.getChildRecordsLength(parentRecord, flatRecords);
            for (let summaryRowIndex = 1, len = summaryLength; summaryRowIndex <= len; summaryRowIndex++) {
                let item;
                item = {};
                for (let columnIndex = 0, len = columnLength; columnIndex < len; columnIndex++) {
                    let field = isNullOrUndefined(getObject('field', this.parent.columns[columnIndex])) ?
                        this.parent.columns[columnIndex] : getObject('field', this.parent.columns[columnIndex]);
                    item[field] = null;
                }
                if (this.parent.aggregates[summaryRowIndex - 1].showChildSummary) {
                    item = this.createSummaryItem(item, this.parent.aggregates[summaryRowIndex - 1]);
                    let idx;
                    flatRecords.map((e, i) => { if (e.uniqueID === parentRecord.uniqueID) {
                        idx = i;
                        return;
                    } });
                    let currentIndex = idx + childRecordsLength + summaryRowIndex;
                    let summaryParent = extend({}, parentRecord);
                    delete summaryParent.childRecords;
                    delete summaryParent[this.parent.childMapping];
                    setValue('parentItem', summaryParent, item);
                    let level = getObject('level', summaryParent);
                    setValue('level', level + 1, item);
                    let index = getObject('index', summaryParent);
                    setValue('isSummaryRow', true, item);
                    if (isSort) {
                        let childRecords = getObject('childRecords', parentRecord);
                        childRecords.push(item);
                    }
                    flatRecords.splice(currentIndex, 0, item);
                }
                else {
                    continue;
                }
            }
            this.flatChildRecords = [];
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
                    itemData[key] = this.getSummaryValues(summary.columns[i], this.flatChildRecords);
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
        types.forEach((type) => {
            summaryKey = type;
            let key = summaryColumn.field + ' - ' + type.toLowerCase();
            let val = type !== 'Custom' ? getObject('aggregates', sumData) :
                calculateAggregate(type, sumData, summaryColumn, this.parent);
            let disp = summaryColumn.columnName;
            let value = type !== 'Custom' ? val[key] : val;
            single[disp] = single[disp] || {};
            single[disp][key] = value;
            single[disp][type] = !isNullOrUndefined(val) ? formatFn(value) : ' ';
        });
        helper.format = summaryColumn.getFormatter();
        let cellElement = createElement('td', {
            className: 'e-summary'
        });
        appendChildren(cellElement, tempObj.fn(single[summaryColumn.columnName], this.parent, tempObj.property));
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
        let addRow = args.element.querySelector('#' + this.parent.element.id + '_gridcontrol_cmenu_AddRow');
        if (addRow) {
            if (this.parent.grid.editSettings.allowAdding === false) {
                addRow.style.display = 'none';
            }
            else {
                addRow.style.display = 'block';
            }
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
 * TreeGrid Edit Module
 * The `Edit` module is used to handle editing actions.
 */
class Edit$1 {
    /**
     * Constructor for Edit module
     */
    constructor(parent) {
        Grid.Inject(Edit);
        this.parent = parent;
        this.isSelfReference = !isNullOrUndefined(parent.parentIdMapping);
        // this.batchDeleted = {};
        // this.batchRecords = [];
        // this.isAdd = false;
        this.previousNewRowPosition = null;
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
        this.parent.on(crudAction, this.editAction, this);
        this.parent.on(beginEdit, this.beginEdit, this);
        this.parent.on(beginAdd, this.beginAdd, this);
        this.parent.on(recordDoubleClick, this.recordDoubleClick, this);
        this.parent.on(cellSave, this.cellSave, this);
        this.parent.on(batchCancel, this.batchCancel, this);
        this.parent.grid.on(keyPressed, this.keyPressed, this);
        this.parent.on(cellEdit, this.cellEdit, this);
        this.parent.grid.on(doubleTap, this.recordDoubleClick, this);
        this.parent.on('savePreviousRowPosition', this.savePreviousRowPosition, this);
        // this.parent.on(events.beforeDataBound, this.beforeDataBound, this);
        // this.parent.on(events.cellSaved, this.cellSaved, this);
        // this.parent.on(events.batchDelete, this.batchDelete, this);
        // this.parent.on(events.batchAdd, this.batchAdd, this);
        // this.parent.on(events.beforeBatchAdd, this.beforeBatchAdd, this);
        // this.parent.on(events.beforeBatchSave, this.beforeBatchSave, this);
        // this.parent.on(events.batchSave, this.batchSave, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(crudAction, this.editAction);
        this.parent.off(beginEdit, this.beginEdit);
        this.parent.off(beginAdd, this.beginAdd);
        this.parent.off(recordDoubleClick, this.recordDoubleClick);
        this.parent.off(cellSave, this.cellSave);
        this.parent.off(batchCancel, this.batchCancel);
        this.parent.grid.off(keyPressed, this.keyPressed);
        this.parent.off(cellEdit, this.cellEdit);
        this.parent.grid.off(doubleTap, this.recordDoubleClick);
        this.parent.off('savePreviousRowPosition', this.savePreviousRowPosition);
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
    recordDoubleClick(args) {
        let target = args.target;
        this.doubleClickTarget = target;
        let column = this.parent.grid.getColumnByIndex(+target.closest('td').getAttribute('aria-colindex'));
        if (this.parent.editSettings.mode === 'Cell' && !this.isOnBatch && column && !column.isPrimaryKey &&
            column.allowEditing && !(target.classList.contains('e-treegridexpand') ||
            target.classList.contains('e-treegridcollapse'))) {
            this.isOnBatch = true;
            this.parent.grid.setProperties({ selectedRowIndex: args.rowIndex }, true);
            this.updateGridEditMode('Batch');
        }
    }
    updateGridEditMode(mode) {
        this.parent.grid.setProperties({ editSettings: { mode: mode } }, true);
        let updateMethod = getObject('updateEditObj', this.parent.grid.editModule);
        updateMethod.apply(this.parent.grid.editModule);
        this.parent.grid.isEdit = false;
    }
    keyPressed(args) {
        if (this.isOnBatch) {
            this.keyPress = args.action;
        }
    }
    cellEdit(args) {
        if (this.doubleClickTarget && (this.doubleClickTarget.classList.contains('e-treegridexpand') ||
            this.doubleClickTarget.classList.contains('e-treegridcollapse'))) {
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
            if (!args.cancel) {
                this.enableToolbarItems('edit');
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
            this.parent.renderModule.cellRender({
                data: this.parent.grid.getSelectedRecords()[0],
                cell: this.parent.grid.getSelectedRows()[0].cells[this.parent.treeColumnIndex],
                column: this.parent.grid.getColumns()[this.parent.treeColumnIndex]
            });
            this.updateGridEditMode('Normal');
            this.isOnBatch = false;
        }
        // this.batchRecords = [];
        // let keys: string[] = Object.keys(this.batchDeleted);
        // let primaryLey: string = this.parent.grid.getPrimaryKeyFieldNames()[0];
        // let currentViewRecords: ITreeData[] = this.parent.grid.getCurrentViewRecords();
        // for (let i: number = 0; i < keys.length; i++) {
        //   let index: number;
        //   currentViewRecords.map((e: ITreeData, j: number) => {
        //     if (this.batchDeleted.hasOwnProperty(keys[i]) && e[primaryLey] === this.batchDeleted[keys[i]][primaryLey]) {
        //       index = j; return;
        //     }
        //   });
        //   this.parent.renderModule.cellRender({
        //     data: currentViewRecords[index],
        //     cell: (<HTMLTableRowElement>this.parent.getRowByIndex(index)).cells[this.parent.treeColumnIndex],
        //     column: this.parent.grid.getColumns()[this.parent.treeColumnIndex]
        //   });
        // }
    }
    cellSave(args) {
        if (this.parent.editSettings.mode === 'Cell') {
            args.cancel = true;
            setValue('isEdit', false, this.parent.grid);
            args.rowData[args.columnName] = args.value;
            let row = args.cell.parentNode;
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
                rowIndex = row.rowIndex;
            }
            row = this.parent.grid.getRows()[rowIndex];
            this.parent.grid.editModule.updateRow(rowIndex, args.rowData);
            if (this.parent.grid.aggregateModule) {
                this.parent.grid.aggregateModule.refresh(args.rowData);
            }
            this.parent.grid.editModule.formObj.destroy();
            if (this.keyPress !== 'tab' && this.keyPress !== 'shiftTab') {
                this.updateGridEditMode('Normal');
                this.isOnBatch = false;
            }
            this.enableToolbarItems('save');
            removeClass([row], ['e-editedrow', 'e-batchrow']);
            removeClass(row.querySelectorAll('.e-rowcell'), ['e-editedbatchcell', 'e-updatedtd']);
            this.editAction({ value: args.rowData, action: 'edit' }, args.columnName);
            let saveArgs = {
                type: 'save', column: this.parent.getColumnByField(args.columnName), data: args.rowData,
                previousData: args.previousValue, row: row, target: args.cell
            };
            this.parent.trigger(actionComplete, saveArgs);
        }
    }
    beginAdd(args) {
        let position;
        let index = this.addRowIndex;
        let records = this.parent.grid.getCurrentViewRecords();
        let rows = this.parent.grid.getDataRows();
        if (this.parent.editSettings.mode !== 'Dialog') {
            if (this.parent.editSettings.newRowPosition === 'Child' && !(records[index].expanded)) {
                this.parent.expandRow(rows[index + 1], records[index]);
            }
            if (this.parent.editSettings.newRowPosition === 'Above') {
                position = 'before';
            }
            else if ((this.parent.editSettings.newRowPosition === 'Below' || this.parent.editSettings.newRowPosition === 'Child')
                && this.selectedIndex > -1) {
                position = 'after';
                // let records: Object[] = this.batchRecords.length ? this.batchRecords : this.parent.grid.getCurrentViewRecords();
                index += findChildrenRecords(records[index]).length;
            }
            if (this.selectedIndex > -1 && (index || (this.parent.editSettings.newRowPosition === 'Child'
                || this.parent.editSettings.newRowPosition === 'Below'))) {
                if (index >= rows.length) {
                    index = rows.length - 2;
                }
                let focussedElement = document.activeElement;
                rows[index + 1][position](rows[0]);
                if (this.parent.editSettings.mode === 'Row' || this.parent.editSettings.mode === 'Cell') {
                    let errors = this.parent.grid.getContentTable().querySelectorAll('.e-griderror');
                    for (let i = 0; i < errors.length; i++) {
                        errors[i].remove();
                    }
                    setValue('errorRules', [], this.parent.grid.editModule.formObj);
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
            this.doubleClickTarget.classList.contains('e-treegridcollapse'))) {
            args.cancel = true;
            this.doubleClickTarget = null;
            return;
        }
        if (args.requestType === 'delete') {
            let data = args.data;
            for (let i = 0; i < data.length; i++) {
                args.data = [...data, ...findChildrenRecords(data[i])];
            }
        }
        if (args.requestType === 'add') {
            this.selectedIndex = this.parent.grid.selectedRowIndex;
            this.addRowIndex = this.parent.grid.selectedRowIndex > -1 ? this.parent.grid.selectedRowIndex : 0;
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
            // let currentData: ITreeData[] = this.batchRecords.length ? this.batchRecords :
            //            <ITreeData[]>this.parent.grid.getCurrentViewRecords();
            let currentData = this.parent.grid.getCurrentViewRecords();
            let index = this.addRowIndex;
            value.uniqueID = getUid(this.parent.element.id + '_data_');
            let level;
            let dataIndex;
            let idMapping;
            let parentUniqueID;
            let parentItem;
            let parentIdMapping;
            if (currentData.length) {
                level = currentData[this.addRowIndex].level;
                dataIndex = currentData[this.addRowIndex].index;
                idMapping = currentData[this.addRowIndex][this.parent.idMapping];
                parentIdMapping = currentData[this.addRowIndex][this.parent.parentIdMapping];
                if (currentData[this.addRowIndex].parentItem) {
                    parentUniqueID = currentData[this.addRowIndex].parentItem.uniqueID;
                }
                parentItem = currentData[this.addRowIndex].parentItem;
            }
            if (this.parent.editSettings.newRowPosition !== 'Top') {
                if (this.parent.editSettings.newRowPosition === 'Above') {
                    position = 'before';
                }
                else if (this.parent.editSettings.newRowPosition === 'Below') {
                    position = 'after';
                    index += findChildrenRecords(currentData[this.addRowIndex]).length;
                }
                else if (this.parent.editSettings.newRowPosition === 'Child') {
                    position = 'after';
                    if (this.selectedIndex > -1) {
                        value.parentItem = extend({}, currentData[this.addRowIndex]);
                        value.parentUniqueID = value.parentItem.uniqueID;
                        delete value.parentItem.childRecords;
                        delete value.parentItem[this.parent.childMapping];
                    }
                    index += findChildrenRecords(currentData[this.addRowIndex]).length;
                    value.level = level + 1;
                    if (this.isSelfReference) {
                        value[this.parent.parentIdMapping] = idMapping;
                        if (!isNullOrUndefined(value.parentItem)) {
                            this.updateParentRow(key, value.parentItem, 'add', value);
                        }
                    }
                }
                if (this.parent.editSettings.newRowPosition === 'Above' || this.parent.editSettings.newRowPosition === 'Below') {
                    if (this.selectedIndex > -1 && level) {
                        value.parentUniqueID = parentUniqueID;
                        value.parentItem = extend({}, parentItem);
                        delete value.parentItem.childRecords;
                        delete value.parentItem[this.parent.childMapping];
                    }
                    value.level = level;
                    if (this.isSelfReference) {
                        value[this.parent.parentIdMapping] = parentIdMapping;
                        if (!isNullOrUndefined(value.parentItem)) {
                            this.updateParentRow(key, value.parentItem, 'add', value);
                        }
                    }
                }
                if (position != null && this.selectedIndex > -1) {
                    args.index = position === 'before' ? index : index + 1;
                }
                if (this.parent.editSettings.newRowPosition === 'Bottom') {
                    let dataSource = (this.parent.grid.dataSource instanceof DataManager ?
                        this.parent.grid.dataSource.dataSource.json : this.parent.grid.dataSource);
                    args.index = dataSource.length;
                }
            }
            // this.addedIndex = args.index;
            value.hasChildRecords = false;
            value.childRecords = [];
            value.index = 0;
        }
        return args;
    }
    addAction(details, treeData) {
        let value;
        let isSkip = false;
        let currentViewRecords = this.parent.grid.getCurrentViewRecords();
        value = extend({}, details.value);
        value = getPlainData(value);
        switch (this.parent.editSettings.newRowPosition) {
            case 'Top':
                treeData.unshift(value);
                isSkip = true;
                break;
            case 'Bottom':
                treeData.push(value);
                isSkip = true;
                break;
            case 'Above':
                value = currentViewRecords[this.addRowIndex + 1];
                break;
            case 'Below':
            case 'Child':
                value = currentViewRecords[this.addRowIndex];
                if (this.selectedIndex === -1) {
                    treeData.unshift(value);
                    isSkip = true;
                }
        }
        return { value: value, isSkip: isSkip };
    }
    editAction(details, columnName) {
        let value = details.value;
        let action = details.action;
        if (action === 'save') {
            action = 'edit';
        }
        let i;
        let j;
        let key = this.parent.grid.getPrimaryKeyFieldNames()[0];
        let treeData = this.parent.dataSource instanceof DataManager ?
            this.parent.dataSource.dataSource.json : this.parent.dataSource;
        let modifiedData = [];
        let originalData = value;
        let isSkip = false;
        let currentViewRecords = this.parent.grid.getCurrentViewRecords();
        if (action === 'add') {
            let addAct = this.addAction(details, treeData);
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
            (this.parent.editSettings.newRowPosition !== 'Top' && this.parent.editSettings.newRowPosition !== 'Bottom'))) {
            for (let k = 0; k < modifiedData.length; k++) {
                let keys = Object.keys(modifiedData[k]);
                i = treeData.length;
                while (i-- && i >= 0) {
                    if (treeData[i][key] === modifiedData[k][key]) {
                        if (action === 'delete') {
                            let currentData = treeData[i];
                            treeData.splice(i, 1);
                            if (this.isSelfReference) {
                                if (!isNullOrUndefined(currentData[this.parent.parentIdMapping])) {
                                    let parentData = this.parent.flatData.filter((e) => e[this.parent.idMapping] === currentData[this.parent.parentIdMapping])[0];
                                    let childRecords = parentData ? parentData[this.parent.childMapping] : [];
                                    for (let p = childRecords.length - 1; p >= 0; p--) {
                                        if (childRecords[p][this.parent.idMapping] === currentData[this.parent.idMapping]) {
                                            childRecords.splice(p, 1);
                                            if (!childRecords.length) {
                                                parentData.hasChildRecords = false;
                                                this.updateParentRow(key, parentData, action);
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
                                    if (treeData[i].hasOwnProperty(keys[j]) && (this.parent.editSettings.mode !== 'Cell' || keys[j] === columnName)) {
                                        treeData[i][keys[j]] = modifiedData[k][keys[j]];
                                    }
                                }
                            }
                            else if (action === 'add') {
                                let index;
                                if (this.parent.editSettings.newRowPosition === 'Child') {
                                    if (this.isSelfReference) {
                                        originalData[this.parent.parentIdMapping] = treeData[i][this.parent.idMapping];
                                        treeData.splice(i + 1, 0, originalData);
                                    }
                                    else {
                                        if (!treeData[i].hasOwnProperty(this.parent.childMapping)) {
                                            treeData[i][this.parent.childMapping] = [];
                                        }
                                        treeData[i][this.parent.childMapping].push(originalData);
                                        this.updateParentRow(key, treeData[i], action);
                                    }
                                }
                                else if (this.parent.editSettings.newRowPosition === 'Below') {
                                    treeData.splice(i + 1, 0, originalData);
                                }
                                else if (!this.addRowIndex) {
                                    index = 0;
                                    treeData.splice(index, 0, originalData);
                                }
                                else if (this.parent.editSettings.newRowPosition === 'Above') {
                                    treeData.splice(i, 0, originalData);
                                }
                            }
                            break;
                        }
                    }
                    else if (!isNullOrUndefined(treeData[i][this.parent.childMapping])) {
                        if (this.removeChildRecords(treeData[i][this.parent.childMapping], modifiedData[k], action, key, originalData, columnName)) {
                            this.updateParentRow(key, treeData[i], action);
                        }
                    }
                }
            }
        }
        if (action === 'add' && this.previousNewRowPosition != null) {
            this.parent.setProperties({ editSettings: { newRowPosition: this.previousNewRowPosition } }, true);
            this.previousNewRowPosition = null;
        }
    }
    removeChildRecords(childRecords, modifiedData, action, key, originalData, columnName) {
        let isChildAll = false;
        let j = childRecords.length;
        while (j-- && j >= 0) {
            if (childRecords[j][key] === modifiedData[key] ||
                (this.isSelfReference && childRecords[j][this.parent.parentIdMapping] === modifiedData[this.parent.idMapping])) {
                if (action === 'edit') {
                    let keys = Object.keys(modifiedData);
                    for (let i = 0; i < keys.length; i++) {
                        if (childRecords[j].hasOwnProperty(keys[i]) && (this.parent.editSettings.mode !== 'Cell' || keys[i] === columnName)) {
                            childRecords[j][keys[i]] = modifiedData[keys[i]];
                        }
                    }
                    break;
                }
                else if (action === 'add') {
                    if (this.parent.editSettings.newRowPosition === 'Child') {
                        if (this.isSelfReference) {
                            originalData[this.parent.parentIdMapping] = childRecords[j][this.parent.idMapping];
                            childRecords.splice(j + 1, 0, originalData);
                            this.updateParentRow(key, childRecords[j], action);
                        }
                        else {
                            if (!childRecords[j].hasOwnProperty(this.parent.childMapping)) {
                                childRecords[j][this.parent.childMapping] = [];
                            }
                            childRecords[j][this.parent.childMapping].push(originalData);
                            this.updateParentRow(key, childRecords[j], action);
                        }
                    }
                    else if (this.parent.editSettings.newRowPosition === 'Above') {
                        childRecords.splice(j, 0, originalData);
                    }
                    else if (this.parent.editSettings.newRowPosition === 'Below') {
                        childRecords.splice(j + 1, 0, originalData);
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
            else if (!isNullOrUndefined(childRecords[j][this.parent.childMapping])) {
                if (this.removeChildRecords(childRecords[j][this.parent.childMapping], modifiedData, action, key, originalData, columnName)) {
                    this.updateParentRow(key, childRecords[j], action);
                }
            }
        }
        return isChildAll;
    }
    updateParentRow(key, record, action, child) {
        let currentRecords = this.parent.grid.getCurrentViewRecords();
        let index;
        currentRecords.map((e, i) => { if (e[key] === record[key]) {
            index = i;
            return;
        } });
        record = currentRecords[index];
        record.hasChildRecords = false;
        if (action === 'add') {
            record.expanded = true;
            record.hasChildRecords = true;
            let childRecords = child ? child : currentRecords[index + 1];
            if (!record.hasOwnProperty('childRecords')) {
                record.childRecords = [];
            }
            if (record.childRecords.indexOf(childRecords) === -1) {
                record.childRecords.unshift(childRecords);
            }
            if (this.isSelfReference) {
                if (!record.hasOwnProperty(this.parent.childMapping)) {
                    record[this.parent.childMapping] = [];
                }
                if (record.childRecords.indexOf(childRecords) === -1) {
                    record[this.parent.childMapping].unshift(childRecords);
                }
            }
        }
        this.parent.grid.setRowData(key, record);
        let row = this.parent.getRowByIndex(index);
        this.parent.renderModule.cellRender({ data: record, cell: row.cells[this.parent.treeColumnIndex],
            column: this.parent.grid.getColumns()[this.parent.treeColumnIndex] });
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
 * actions export
 */

/**
 * TreeGrid component exported items
 */

/**
 * Export TreeGrid component
 */

export { TreeGrid, load, rowDataBound, dataBound, queryCellInfo, beforeDataBound, actionBegin, actionComplete, rowSelected, rowDeselected, toolbarClick, beforeExcelExport, beforePdfExport, resizeStop, expanded, expanding, collapsed, collapsing, remoteExpand, localPagedExpandCollapse, pagingActions, printGridInit, contextMenuOpen, contextMenuClick, savePreviousRowPosition, crudAction, beginEdit, beginAdd, recordDoubleClick, cellSave, cellSaved, cellEdit, batchDelete, batchCancel, batchAdd, beforeBatchAdd, beforeBatchSave, batchSave, keyPressed, updateData, doubleTap, DataManipulation, Reorder$1 as Reorder, Resize$1 as Resize, Column, EditSettings, FilterSettings, PageSettings, SearchSettings, SelectionSettings, AggregateColumn, AggregateRow, Render, isRemoteData, findParentRecords, getExpandStatus, findChildrenRecords, isOffline, extendArray, getPlainData, ToolbarItem, ContextMenuItems, Filter$1 as Filter, ExcelExport$1 as ExcelExport, PdfExport$1 as PdfExport, Page$1 as Page, Toolbar$1 as Toolbar, Aggregate$1 as Aggregate, Sort$1 as Sort, ColumnMenu$1 as ColumnMenu, ContextMenu$1 as ContextMenu, Edit$1 as Edit, CommandColumn$1 as CommandColumn };
//# sourceMappingURL=ej2-treegrid.es2015.js.map
