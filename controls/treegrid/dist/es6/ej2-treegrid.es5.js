import { ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, compile, createElement, extend, getEnumValue, getValue, isNullOrUndefined, merge, removeClass, setValue } from '@syncfusion/ej2-base';
import { Aggregate, CellType, ColumnMenu, CommandColumn, ContextMenu, Edit, ExcelExport, Filter, Grid, Page, PdfExport, Predicate, Print, Reorder, Resize, Sort, TextWrapSettings, Toolbar, appendChildren, calculateAggregate, getActualProperties, getObject, getUid, iterateArrayOrObject, iterateExtend } from '@syncfusion/ej2-grids';
import { CacheAdaptor, DataManager, DataUtil, ODataAdaptor, Predicate as Predicate$1, Query, RemoteSaveAdaptor, UrlAdaptor, WebApiAdaptor, WebMethodAdaptor } from '@syncfusion/ej2-data';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';

/**
 * Represents TreeGrid `Column` model class.
 */
var Column = /** @__PURE__ @class */ (function () {
    function Column(options) {
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
    return Column;
}());

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the filtering behavior of the TreeGrid.
 */
var FilterSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(FilterSettings, _super);
    function FilterSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return FilterSettings;
}(ChildProperty));

/**
 * TreeGrid ColumnMenu module
 * @hidden
 */
var ColumnMenu$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for render module
     */
    function ColumnMenu$$1(parent) {
        Grid.Inject(ColumnMenu);
        this.parent = parent;
    }
    ColumnMenu$$1.prototype.getColumnMenu = function () {
        return this.parent.grid.columnMenuModule.getColumnMenu();
    };
    ColumnMenu$$1.prototype.destroy = function () {
        //this.parent.grid.columnMenuModule.destroy();
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    ColumnMenu$$1.prototype.getModuleName = function () {
        return 'columnMenu';
    };
    return ColumnMenu$$1;
}());

/**
 *  @hidden
 */
var load = 'load';
/** @hidden */
var rowDataBound = 'rowDataBound';
/** @hidden */
var dataBound = 'dataBound';
/** @hidden */
var queryCellInfo = 'queryCellInfo';
/** @hidden */
var beforeDataBound = 'beforeDataBound';
/** @hidden */
var actionBegin = 'actionBegin';
/** @hidden */
var actionComplete = 'actionComplete';
/** @hidden */
var rowSelected = 'rowSelected';
/** @hidden */
var rowDeselected = 'rowDeselected';
/** @hidden */
var toolbarClick = 'toolbarClick';
/** @hidden */
var beforeExcelExport = 'beforeExcelExport';
/** @hidden */
var beforePdfExport = 'beforePdfExport';
/** @hidden */
var resizeStop = 'resizeStop';
/** @hidden */
var expanded = 'expanded';
/** @hidden */
var expanding = 'expanding';
/** @hidden */
var collapsed = 'collapsed';
/** @hidden */
var collapsing = 'collapsing';
/** @hidden */
var remoteExpand = 'remoteExpand';
/** @hidden */
var localPagedExpandCollapse = 'localPagedExpandCollapse';
/** @hidden */
var pagingActions = 'pagingActions';
/** @hidden */
var printGridInit = 'printGrid-Init';
/** @hidden */
var contextMenuOpen = 'contextMenuOpen';
/** @hidden */
var contextMenuClick = 'contextMenuClick';
/** @hidden */
var savePreviousRowPosition = 'savePreviousRowPosition';
/** @hidden */
var crudAction = 'crudAction';
/** @hidden */
var beginEdit = 'beginEdit';
/** @hidden */
var beginAdd = 'beginAdd';
/** @hidden */
var recordDoubleClick = 'recordDoubleClick';
/** @hidden */
var cellSave = 'cellSave';
/** @hidden */
var cellSaved = 'cellSaved';
/** @hidden */
var cellEdit = 'cellEdit';
/** @hidden */
var batchDelete = 'batchDelete';
/** @hidden */
var batchCancel = 'batchCancel';
/** @hidden */
var batchAdd = 'batchAdd';
/** @hidden */
var beforeBatchAdd = 'beforeBatchAdd';
/** @hidden */
var beforeBatchSave = 'beforeBatchSave';
/** @hidden */
var batchSave = 'batchSave';
/** @hidden */
var keyPressed = 'key-pressed';
/** @hidden */
var updateData = 'update-data';
/** @hidden */
var doubleTap = 'double-tap';

/**
 * TreeGrid Print module
 * @hidden
 */
var Print$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Print module
     */
    function Print$$1(parent) {
        this.parent = parent;
        Grid.Inject(Print);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Print$$1.prototype.getModuleName = function () {
        return 'print';
    };
    /**
     * @hidden
     */
    Print$$1.prototype.addEventListener = function () {
        this.parent.grid.on(printGridInit, this.printTreeGrid, this);
    };
    Print$$1.prototype.removeEventListener = function () {
        this.parent.grid.off(printGridInit, this.printTreeGrid);
    };
    Print$$1.prototype.printTreeGrid = function (printGrid) {
        var grid = getObject('printgrid', printGrid);
        var gridElement = getObject('element', printGrid);
        grid.addEventListener(queryCellInfo, this.parent.grid.queryCellInfo);
        grid.addEventListener(rowDataBound, this.parent.grid.rowDataBound);
        grid.addEventListener(beforeDataBound, this.parent.grid.beforeDataBound);
        addClass([gridElement], 'e-treegrid');
    };
    Print$$1.prototype.print = function () {
        this.parent.grid.print();
    };
    /**
     * To destroy the Print
     * @return {void}
     * @hidden
     */
    Print$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    return Print$$1;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the filtering behavior of the TreeGrid.
 */
var SearchSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(SearchSettings, _super);
    function SearchSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return SearchSettings;
}(ChildProperty));

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the selection behavior of the TreeGrid.
 */
var SelectionSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$3(SelectionSettings, _super);
    function SelectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return SelectionSettings;
}(ChildProperty));

function isRemoteData(parent) {
    if (parent.dataSource instanceof DataManager) {
        var adaptor = parent.dataSource.adaptor;
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
    var datas;
    datas = [];
    var recordsLength = Object.keys(records).length;
    for (var i = 0, len = recordsLength; i < len; i++) {
        var hasChild = getObject('hasChildRecords', records[i]);
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
    var parentRecord = isNullOrUndefined(record.parentItem) ? null :
        parents.filter(function (e) { return e.uniqueID === record.parentItem.uniqueID; })[0];
    var childParent;
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
            childParent = parents.filter(function (e) { return e.uniqueID === parentRecord.parentItem.uniqueID; })[0];
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
    var datas = [];
    if (isNullOrUndefined(records) || !records.hasChildRecords) {
        return [];
    }
    var childRecords = records.childRecords;
    for (var i = 0, len = Object.keys(childRecords).length; i < len; i++) {
        datas.push(childRecords[i]);
        if (childRecords[i].hasChildRecords) {
            datas = datas.concat(findChildrenRecords(childRecords[i]));
        }
    }
    return datas;
}
function isOffline(parent) {
    if (isRemoteData(parent)) {
        var dm = parent.dataSource;
        return !isNullOrUndefined(dm.ready);
    }
    return true;
}
function extendArray(array) {
    var objArr = [];
    var obj;
    var keys;
    for (var i = 0; i < array.length; i++) {
        keys = Object.keys(array[i]);
        obj = {};
        for (var j = 0; j < keys.length; j++) {
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
var Render = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for render module
     */
    function Render(parent) {
        this.parent = parent;
    }
    /**
     * Updated row elements for TreeGrid
     */
    Render.prototype.RowModifier = function (args) {
        if (!args.data) {
            return;
        }
        var data = args.data;
        var parentData = data.parentItem;
        var index;
        if (!isNullOrUndefined(data.parentItem) &&
            (!(this.parent.allowPaging && !(this.parent.pageSettings.pageSizeMode === 'Root')) ||
                (isRemoteData(this.parent) && !isOffline(this.parent)))) {
            index = data.parentItem.index;
            var collapsed$$1 = (this.parent.initialRender && (!(isNullOrUndefined(parentData[this.parent.expandStateMapping]) ||
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
            var proxy_1 = this.parent;
            var parentrec = this.parent.getCurrentViewRecords().filter(function (rec) {
                return getValue(proxy_1.idMapping, rec) === getValue(proxy_1.parentIdMapping, data);
            });
            if (parentrec.length > 0) {
                var display = parentrec[0].expanded ? 'table-row' : 'none';
                args.row.setAttribute('style', 'display: ' + display + ';');
            }
        }
        addClass([args.row], 'e-gridrowindex' + index + 'level' + args.data.level);
        var summaryRow = getObject('isSummaryRow', args.data);
        if (summaryRow) {
            addClass([args.row], 'e-summaryrow');
        }
        this.parent.trigger(rowDataBound, args);
    };
    /**
     * cell renderer for tree column index cell
     */
    Render.prototype.cellRender = function (args) {
        if (!args.data) {
            return;
        }
        var grid = this.parent.grid;
        var data = args.data;
        var ispadfilter = isNullOrUndefined(data.filterLevel);
        var pad = ispadfilter ? data.level : data.filterLevel;
        var totalIconsWidth = 0;
        if (grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            var container = createElement('div', {
                className: 'e-treecolumn-container'
            });
            var emptyExpandIcon = createElement('span', {
                className: 'e-icons e-none',
                styles: 'width: 10px; display: inline-block'
            });
            for (var n = 0; n < pad; n++) {
                totalIconsWidth += 10;
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            var iconRequired = !isNullOrUndefined(data.hasFilteredChildRecords)
                ? data.hasFilteredChildRecords : data.hasChildRecords;
            if (iconRequired) {
                addClass([args.cell], 'e-treerowcell');
                var expandIcon = createElement('span', {
                    className: 'e-icons'
                });
                var expand = void 0;
                if (this.parent.initialRender) {
                    expand = data.expanded &&
                        (isNullOrUndefined(data[this.parent.expandStateMapping]) || data[this.parent.expandStateMapping]) &&
                        !this.parent.enableCollapseAll;
                }
                else {
                    expand = !(!data.expanded || !getExpandStatus(this.parent, data, this.parent.grid.getCurrentViewRecords()));
                }
                var collapsed$$1 = true;
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
            var cellElement = createElement('span', {
                className: 'e-treecell'
            });
            if (this.parent.allowTextWrap) {
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
            var textContent = args.cell.querySelector('.e-treecell') != null ?
                args.cell.querySelector('.e-treecell').innerHTML : args.cell.innerHTML;
            cellElement.innerHTML = textContent;
            container.appendChild(cellElement);
            args.cell.innerHTML = '';
            args.cell.appendChild(container);
        }
        var summaryRow = getObject('isSummaryRow', args.data);
        if (summaryRow) {
            addClass([args.cell], 'e-summarycell');
            var summaryData = getObject(args.column.field, args.data);
            args.cell.querySelector('.e-treecell') != null ?
                args.cell.querySelector('.e-treecell').innerHTML = summaryData : args.cell.innerHTML = summaryData;
        }
        this.parent.trigger(queryCellInfo, args);
    };
    return Render;
}());

/**
 * Internal dataoperations for TreeGrid
 * @hidden
 */
var Sort$1 = /** @__PURE__ @class */ (function () {
    function Sort$$1(grid) {
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
    Sort$$1.prototype.getModuleName = function () {
        return 'sort';
    };
    /**
     * @hidden
     */
    Sort$$1.prototype.addEventListener = function () {
        this.parent.on('updateModel', this.updateModel, this);
        this.parent.on('createSort', this.createdSortedRecords, this);
        this.parent.on('createSortRecords', this.createSorting, this);
    };
    /**
     * @hidden
     */
    Sort$$1.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateModel', this.updateModel);
        this.parent.off('createSort', this.createdSortedRecords);
        this.parent.off('createSortRecords', this.createSorting);
    };
    Sort$$1.prototype.createSorting = function (data) {
        this.flatSortedData = [];
        this.createSortRecords(data);
    };
    Sort$$1.prototype.createSortRecords = function (data) {
        var sortData = getObject('modifiedData', data);
        var parentRecords = getObject('parentRecords', data);
        var parentIndex = getObject('parentIndex', data);
        var filteredResult = getObject('filteredResult', data);
        var dataLength = Object.keys(sortData).length;
        for (var i = 0, len = dataLength; i < len; i++) {
            var currentSortData = sortData[i];
            this.storedIndex++;
            var level = 0;
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
                var parentData = extend({}, parentRecords);
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
    };
    Sort$$1.prototype.createdSortedRecords = function (sortingElements) {
        var data = getObject('modifiedData', sortingElements);
        var sortQuery = getObject('srtQry', sortingElements);
        var parent = getObject('parent', sortingElements);
        for (var i = 0, len = Object.keys(data).length; i < len; i++) {
            if (!isNullOrUndefined(data[i].childRecords) || !isNullOrUndefined(data[i][parent.childMapping])) {
                var sortedData = void 0;
                var sortchildData = void 0;
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
    };
    /**
     * Sorts a column with the given options.
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @return {void}
     */
    Sort$$1.prototype.sortColumn = function (columnName, direction, isMultiSort) {
        this.parent.grid.sortColumn(columnName, direction, isMultiSort);
    };
    Sort$$1.prototype.removeSortColumn = function (field) {
        this.parent.grid.removeSortColumn(field);
    };
    /**
     * The function used to update sortSettings of TreeGrid.
     * @return {void}
     * @hidden
     */
    Sort$$1.prototype.updateModel = function () {
        this.parent.sortSettings = this.parent.grid.sortSettings;
    };
    /**
     * Clears all the sorted columns of the TreeGrid.
     * @return {void}
     */
    Sort$$1.prototype.clearSorting = function () {
        this.parent.grid.clearSorting();
        this.updateModel();
    };
    /**
     * Destroys the Sorting of TreeGrid.
     * @method destroy
     * @return {void}
     */
    Sort$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    return Sort$$1;
}());

/**
 * Internal dataoperations for tree grid
 * @hidden
 */
var DataManipulation = /** @__PURE__ @class */ (function () {
    function DataManipulation(grid) {
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
    DataManipulation.prototype.addEventListener = function () {
        this.parent.on('Sorting', this.sortedRecords, this);
        this.parent.on('updateRemoteLevel', this.updateParentRemoteData, this);
        this.parent.grid.on('sorting-begin', this.beginSorting, this);
        this.parent.on('updateAction', this.updateData, this);
        this.parent.on(remoteExpand, this.collectExpandingRecs, this);
        this.parent.on('dataProcessor', this.dataProcessor, this);
    };
    /**
     * @hidden
     */
    DataManipulation.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(remoteExpand, this.collectExpandingRecs);
        this.parent.off('updateRemoteLevel', this.updateParentRemoteData);
        this.parent.off('updateAction', this.updateData);
        this.parent.off('dataProcessor', this.dataProcessor);
        this.parent.off('Sorting', this.sortedRecords);
        this.parent.grid.off('sorting-begin', this.beginSorting);
    };
    /**
     * To destroy the dataModule
     * @return {void}
     * @hidden
     */
    DataManipulation.prototype.destroy = function () {
        this.removeEventListener();
    };
    /** @hidden */
    DataManipulation.prototype.isRemote = function () {
        if (!(this.parent.dataSource instanceof DataManager)) {
            return false;
        }
        return true;
        // let gridData: DataManager = <DataManager>this.parent.dataSource;
        // return gridData.dataSource.offline !== true && gridData.dataSource.url !== undefined;
    };
    /**
     * Function to manipulate datasource
     * @hidden
     */
    DataManipulation.prototype.convertToFlatData = function (data) {
        var _this = this;
        this.parent.flatData = [];
        if ((isRemoteData(this.parent) && !isOffline(this.parent)) && data instanceof DataManager) {
            var dm = this.parent.dataSource;
            if (this.parent.parentIdMapping) {
                this.parent.query = isNullOrUndefined(this.parent.query) ?
                    new Query() : this.parent.query;
                if (this.parent.parentIdMapping) {
                    this.parent.query.where(this.parent.parentIdMapping, 'equal', null);
                }
                if (!this.parent.hasChildMapping) {
                    var qry = this.parent.query.clone();
                    qry.queries = [];
                    qry = qry.select([this.parent.parentIdMapping]);
                    dm.executeQuery(qry).then(function (e) {
                        _this.parentItems = DataUtil.distinct(e.result, _this.parent.parentIdMapping, false);
                        var req = getObject('dataSource.requests', _this.parent).filter(function (e) {
                            return e.httpRequest.statusText !== 'OK';
                        }).length;
                        if (req === 0) {
                            setValue('grid.contentModule.isLoaded', true, _this).parent;
                            if (!isNullOrUndefined(_this.zerothLevelData)) {
                                setValue('cancel', false, _this.zerothLevelData);
                                getValue('grid.renderModule', _this.parent).dataManagerSuccess(_this.zerothLevelData);
                                _this.zerothLevelData = null;
                            }
                            _this.parent.grid.hideSpinner();
                        }
                    });
                }
            }
        }
        else if (data instanceof Array) {
            this.hierarchyData = [];
            this.taskIds = [];
            for (var i = 0; i < Object.keys(data).length; i++) {
                var tempData = data[i];
                this.hierarchyData.push(extend({}, tempData, true));
                if (!isNullOrUndefined(tempData[this.parent.idMapping])) {
                    this.taskIds.push(tempData[this.parent.idMapping]);
                }
            }
            var mappingData = new DataManager(data).executeLocal(new Query()
                .where(this.parent.parentIdMapping, 'notequal', null)
                .group(this.parent.parentIdMapping));
            //let selfData: Object[] = [];
            for (var i = 0; i < mappingData.length; i++) {
                var groupData = mappingData[i];
                var index = this.taskIds.indexOf(groupData.key);
                if (index > -1) {
                    if (!isNullOrUndefined(groupData.key)) {
                        var childData = iterateExtend(groupData.items);
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
    };
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
    DataManipulation.prototype.updateChildHierarchy = function (data, currentData, childData, index) {
        var parentID = currentData[this.parent.parentIdMapping];
        var returns = false;
        var id = currentData[this.parent.idMapping];
        for (var i = 0; i < data.length; i++) {
            if (data[i][this.parent.idMapping] === parentID) {
                var childs = data[i][this.parent.childMapping];
                for (var j = 0; j < childs.length; j++) {
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
    };
    /**
     * Function to update the zeroth level parent records in remote binding
     * @hidden
     */
    DataManipulation.prototype.updateParentRemoteData = function (args) {
        var records = args.result;
        if (!this.parent.hasChildMapping && !this.parentItems.length) {
            this.zerothLevelData = args;
            setValue('cancel', true, args);
        }
        else {
            for (var rec = 0; rec < records.length; rec++) {
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
    };
    /**
     * Function to manipulate datasource
     * @hidden
     */
    DataManipulation.prototype.collectExpandingRecs = function (rowDetails) {
        var _this = this;
        var args = { row: rowDetails.parentRow, data: rowDetails.record };
        if (rowDetails.rows.length > 0) {
            rowDetails.record.expanded = true;
            for (var i = 0; i < rowDetails.rows.length; i++) {
                rowDetails.rows[i].style.display = 'table-row';
            }
            this.parent.trigger(expanded, args);
        }
        else {
            var dm = this.parent.dataSource;
            var qry = this.parent.grid.getDataModule().generateQuery();
            var clonequries = qry.queries.filter(function (e) { return e.fn !== 'onPage' && e.fn !== 'onWhere'; });
            qry.queries = clonequries;
            qry.where(this.parent.parentIdMapping, 'equal', rowDetails.record[this.parent.idMapping]);
            showSpinner(this.parent.element);
            dm.executeQuery(qry).then(function (e) {
                var datas = _this.parent.grid.currentViewData;
                var inx = datas.indexOf(rowDetails.record);
                var haveChild = getObject('actual.nextLevel', e);
                var result = e.result;
                for (var r = 0; r < result.length; r++) {
                    result[r].level = rowDetails.record.level + 1;
                    result[r].index = Math.ceil(Math.random() * 1000);
                    result[r].parentItem = rowDetails.record;
                    if ((result[r][_this.parent.hasChildMapping] || _this.parentItems.indexOf(result[r][_this.parent.idMapping]) !== -1)
                        && !(haveChild && !haveChild[r])) {
                        result[r].hasChildRecords = true;
                        result[r].expanded = false;
                    }
                    datas.splice(inx + r + 1, 0, result[r]);
                }
                setValue('result', datas, e);
                setValue('action', 'beforecontentrender', e);
                _this.parent.trigger(actionComplete, e);
                hideSpinner(_this.parent.element);
                e.count = _this.parent.grid.pageSettings.totalRecordsCount;
                getValue('grid.renderModule', _this.parent).dataManagerSuccess(e);
                _this.parent.trigger(expanded, args);
            });
        }
    };
    DataManipulation.prototype.beginSorting = function () {
        this.isSortAction = true;
    };
    DataManipulation.prototype.createRecords = function (data, parentRecords) {
        for (var i = 0, len = Object.keys(data).length; i < len; i++) {
            var currentData = data[i];
            var level = 0;
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
                var parentData = extend({}, parentRecords);
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
    };
    DataManipulation.prototype.sortedRecords = function (data) {
        var sortedData = getObject('sortedData', data);
        this.sortedData = [];
        if (this.parent.grid.filterSettings.columns.length > 0) {
            var sortedData_1 = getObject('sortedData', data);
            var filteredData = getObject('filteredData', data);
            for (var i = 0, len = Object.keys(sortedData_1).length; i < len; i++) {
                for (var j = 0, sortlen = Object.keys(filteredData).length; j < sortlen; j++) {
                    var sortData = getObject('uniqueID', sortedData_1[i]);
                    var filterData = getObject('uniqueID', filteredData[j]);
                    if (sortData === filterData) {
                        this.sortedData.push(sortedData_1[i]);
                    }
                }
            }
        }
        else {
            for (var i = 0, len = Object.keys(sortedData).length; i < len; i++) {
                this.sortedData.push(sortedData[i]);
            }
        }
    };
    /**
     * Function to perform filtering/sorting action for local data
     * @hidden
     */
    DataManipulation.prototype.dataProcessor = function (args) {
        var dataObj = this.parent.grid.dataSource;
        var results = dataObj instanceof DataManager ? dataObj.dataSource.json : dataObj;
        var count = results.length;
        if ((this.parent.grid.allowFiltering && this.parent.grid.filterSettings.columns.length) ||
            (this.parent.grid.searchSettings.key.length > 0)) {
            var qry = new Query();
            var gridQuery = getObject('query', args);
            if (isNullOrUndefined(gridQuery)) {
                gridQuery = new Query();
                gridQuery = getValue('grid.renderModule.data', this.parent).filterQuery(gridQuery);
                gridQuery = getValue('grid.renderModule.data', this.parent).searchQuery(gridQuery);
            }
            var fltrQuery = gridQuery.queries.filter(function (q) { return q.fn === 'onWhere'; });
            var srchQuery = gridQuery.queries.filter(function (q) { return q.fn === 'onSearch'; });
            qry.queries = fltrQuery.concat(srchQuery);
            var filteredData = new DataManager(results).executeLocal(qry);
            this.parent.notify('updateFilterRecs', { data: filteredData });
            results = this.dataResults.result;
            this.dataResults.result = null;
            //this.parent.filterModule.updatedFilteredRecord(filteredData);
            if (this.parent.grid.aggregates.length > 0) {
                var query = getObject('query', args);
                if (isNullOrUndefined(gridQuery)) {
                    gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
                }
                var summaryQuery = query.queries.filter(function (q) { return q.fn === 'onAggregates'; });
                results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, results, true);
            }
        }
        if (this.parent.grid.aggregates.length && this.parent.grid.sortSettings.columns.length === 0
            && this.parent.grid.filterSettings.columns.length === 0 && !this.parent.grid.searchSettings.key.length) {
            var gridQuery = getObject('query', args);
            if (isNullOrUndefined(gridQuery)) {
                gridQuery = getValue('grid.renderModule.data', this.parent).aggregateQuery(new Query());
            }
            var summaryQuery = gridQuery.queries.filter(function (q) { return q.fn === 'onAggregates'; });
            results = this.parent.summaryModule.calculateSummaryValue(summaryQuery, this.parent.flatData, true);
        }
        if (this.parent.grid.sortSettings.columns.length > 0 || this.isSortAction) {
            this.isSortAction = false;
            var parentData = void 0;
            var action = 'action';
            if (args[action] !== 'collapse' && args[action] !== 'expand') {
                if (!this.isSelfReference && this.parent.childMapping.length > 0) {
                    parentData = iterateExtend(this.parent.dataSource);
                }
                else {
                    parentData = iterateExtend(this.parent.parentData);
                }
                var query = getObject('query', args);
                this.parent.sortModule = new Sort$1(this.parent);
                var srtQry = new Query();
                for (var srt = this.parent.grid.sortSettings.columns.length - 1; srt >= 0; srt--) {
                    var col = this.parent.getColumnByField(this.parent.grid.sortSettings.columns[srt].field);
                    var compFun = col.sortComparer && !this.isRemote() ?
                        col.sortComparer.bind(col) :
                        this.parent.grid.sortSettings.columns[srt].direction;
                    srtQry.sortBy(this.parent.grid.sortSettings.columns[srt].field, compFun);
                }
                var modifiedData = new DataManager(parentData).executeLocal(srtQry);
                this.parent.notify('createSort', { modifiedData: modifiedData, parent: this.parent, srtQry: srtQry });
                this.parent.notify('createSortRecords', {
                    modifiedData: modifiedData,
                    parentRecords: null, filteredResult: results
                });
            }
            results = this.sortedData;
            this.parent.notify('updateModel', {});
            if (this.parent.grid.aggregates.length > 0) {
                var isSort = false;
                var query = getObject('query', args);
                var summaryQuery = query.queries.filter(function (q) { return q.fn === 'onAggregates'; });
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
    };
    /**
     * update for datasource
     */
    DataManipulation.prototype.updateData = function (dataResult) {
        this.dataResults = dataResult;
    };
    return DataManipulation;
}());

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

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the paging behavior of the TreeGrid.
 */
var PageSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$4(PageSettings, _super);
    function PageSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return PageSettings;
}(ChildProperty));

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the TreeGrid's aggregate column.
 */
var AggregateColumn = /** @__PURE__ @class */ (function (_super) {
    __extends$5(AggregateColumn, _super);
    function AggregateColumn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.intl = new Internationalization();
        _this.templateFn = {};
        return _this;
    }
    /**
     * @hidden
     */
    AggregateColumn.prototype.setFormatter = function (cultureName) {
        if (this.format && (this.format.skeleton || this.format.format)) {
            this.formatFn = this.getFormatFunction(this.format);
        }
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.getFormatFunction = function (format) {
        if (format.type) {
            return this.intl.getDateFormat(format);
        }
        else {
            return this.intl.getNumberFormat(format);
        }
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.getFormatter = function () {
        return this.formatFn;
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.setTemplate = function (helper) {
        if (helper === void 0) { helper = {}; }
        if (this.footerTemplate !== undefined) {
            this.templateFn[getEnumValue(CellType, CellType.Summary)] = { fn: compile(this.footerTemplate, helper),
                property: 'footerTemplate' };
        }
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.getTemplate = function (type) {
        return this.templateFn[getEnumValue(CellType, type)];
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.setPropertiesSilent = function (prop) {
        this.setProperties(prop, true);
    };
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
    return AggregateColumn;
}(ChildProperty));
var AggregateRow = /** @__PURE__ @class */ (function (_super) {
    __extends$5(AggregateRow, _super);
    function AggregateRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        Collection([], AggregateColumn)
    ], AggregateRow.prototype, "columns", void 0);
    __decorate$5([
        Property(true)
    ], AggregateRow.prototype, "showChildSummary", void 0);
    return AggregateRow;
}(ChildProperty));

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the edit behavior of the TreeGrid.
 */
var EditSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$6(EditSettings, _super);
    function EditSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return EditSettings;
}(ChildProperty));

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the field name and direction of sort column.
 */
var SortDescriptor = /** @__PURE__ @class */ (function (_super) {
    __extends$7(SortDescriptor, _super);
    function SortDescriptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$7([
        Property()
    ], SortDescriptor.prototype, "field", void 0);
    __decorate$7([
        Property()
    ], SortDescriptor.prototype, "direction", void 0);
    return SortDescriptor;
}(ChildProperty));
/**
 * Configures the sorting behavior of TreeGrid.
 */
var SortSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$7(SortSettings, _super);
    function SortSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$7([
        Collection([], SortDescriptor)
    ], SortSettings.prototype, "columns", void 0);
    __decorate$7([
        Property(true)
    ], SortSettings.prototype, "allowUnsort", void 0);
    return SortSettings;
}(ChildProperty));

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var TreeGrid = /** @__PURE__ @class */ (function (_super) {
    __extends(TreeGrid, _super);
    function TreeGrid(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.dataResults = {};
        _this.grid = new Grid();
        return _this;
    }
    /**
     * Export TreeGrid data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     */
    TreeGrid.prototype.excelExport = function (excelExportProperties, isMultipleExport, 
    /* tslint:disable-next-line:no-any */
    workbook, isBlob) {
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, false);
    };
    /**
     * Export TreeGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     *
     */
    TreeGrid.prototype.csvExport = function (excelExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, workbook, isBlob) {
        return this.excelExportModule.Map(excelExportProperties, isMultipleExport, workbook, isBlob, true);
    };
    /**
     * Export TreeGrid data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     *
     */
    TreeGrid.prototype.pdfExport = function (pdfExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, pdfDoc, isBlob) {
        return this.pdfExportModule.Map(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    TreeGrid.prototype.getModuleName = function () {
        return 'treegrid';
    };
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    TreeGrid.prototype.preRender = function () {
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
    };
    /**
     * Sorts a column with the given options.
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @return {void}
     */
    TreeGrid.prototype.sortByColumn = function (columnName, direction, isMultiSort) {
        this.sortModule.sortColumn(columnName, direction, isMultiSort);
    };
    /**
     * Clears all the sorted columns of the TreeGrid.
     * @return {void}
     */
    TreeGrid.prototype.clearSorting = function () {
        this.sortModule.clearSorting();
    };
    /**
     * Remove sorted column by field name.
     * @param {string} field - Defines the column field name to remove sort.
     * @return {void}
     * @hidden
     */
    TreeGrid.prototype.removeSortColumn = function (field) {
        this.sortModule.removeSortColumn(field);
    };
    /**
     * Searches TreeGrid records using the given key.
     * You can customize the default search option by using the
     * [`searchSettings`](./api-searchSettings.html).
     * @param  {string} searchString - Defines the key.
     * @return {void}
     */
    TreeGrid.prototype.search = function (searchString) {
        this.grid.search(searchString);
    };
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
    TreeGrid.prototype.autoFitColumns = function (fieldNames) {
        this.resizeModule.autoFitColumns(fieldNames);
        this.updateColumnModel();
    };
    /**
     * Changes the TreeGrid column positions by field names.
     * @param  {string} fromFName - Defines the origin field name.
     * @param  {string} toFName - Defines the destination field name.
     * @return {void}
     */
    TreeGrid.prototype.reorderColumns = function (fromFName, toFName) {
        this.grid.reorderColumns(fromFName, toFName);
    };
    TreeGrid.prototype.TreeGridLocale = function () {
        /* tslint:disable-next-line:no-any */
        var locale = L10n.locale;
        var localeObject;
        localeObject = {};
        setValue(this.locale, {}, localeObject);
        var gridLocale;
        gridLocale = {};
        gridLocale = getObject(this.locale, locale);
        var treeGridLocale;
        treeGridLocale = {};
        treeGridLocale = getObject(this.getModuleName(), gridLocale);
        setValue('grid', treeGridLocale, getObject(this.locale, localeObject));
        L10n.load(localeObject);
    };
    /**
     * By default, prints all the pages of the TreeGrid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./api-treegrid.html#printmode-string).
     * @return {void}
     */
    TreeGrid.prototype.print = function () {
        this.printModule.print();
    };
    TreeGrid.prototype.treeGridkeyActionHandler = function (e) {
        if (this.allowKeyboard) {
            switch (e.action) {
                case 'ctrlDownArrow':
                    this.expandAll();
                    break;
                case 'ctrlUpArrow':
                    this.collapseAll();
                    break;
                case 'ctrlShiftUpArrow':
                    var collapsetarget = e.target;
                    this.expandCollapseRequest(collapsetarget.querySelector('.e-icons'));
                    break;
                case 'ctrlShiftDownArrow':
                    var expandtarget = e.target;
                    this.expandCollapseRequest(expandtarget.querySelector('.e-icons'));
                    break;
                case 'downArrow':
                    var target = e.target.parentElement;
                    var summaryElement = this.findnextRowElement(target);
                    if (summaryElement !== null) {
                        var rowIndex = summaryElement.rowIndex;
                        this.selectRow(rowIndex);
                        var cellIndex = e.target.cellIndex;
                        var row = summaryElement.children[cellIndex];
                        addClass([row], 'e-focused');
                        addClass([row], 'e-focus');
                    }
                    else {
                        this.clearSelection();
                    }
                    break;
                case 'upArrow':
                    var targetRow = e.target.parentElement;
                    var summaryRowElement = this.findPreviousRowElement(targetRow);
                    if (summaryRowElement !== null) {
                        var rIndex = summaryRowElement.rowIndex;
                        this.selectRow(rIndex);
                        var cIndex = e.target.cellIndex;
                        var rows = summaryRowElement.children[cIndex];
                        addClass([rows], 'e-focused');
                        addClass([rows], 'e-focus');
                    }
                    else {
                        this.clearSelection();
                    }
            }
        }
    };
    // Get Proper Row Element from the summary 
    TreeGrid.prototype.findnextRowElement = function (summaryRowElement) {
        var rowElement = summaryRowElement.nextSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
            rowElement.style.display === 'none')) {
            rowElement = this.findnextRowElement(rowElement);
        }
        return rowElement;
    };
    // Get Proper Row Element from the summary 
    TreeGrid.prototype.findPreviousRowElement = function (summaryRowElement) {
        var rowElement = summaryRowElement.previousSibling;
        if (rowElement !== null && (rowElement.className.indexOf('e-summaryrow') !== -1 ||
            rowElement.style.display === 'none')) {
            rowElement = this.findPreviousRowElement(rowElement);
        }
        return rowElement;
    };
    TreeGrid.prototype.initProperties = function () {
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
    };
    /**
     * Binding events to the element while component creation.
     * @hidden
     */
    TreeGrid.prototype.wireEvents = function () {
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
    };
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    TreeGrid.prototype.requiredModules = function () {
        var modules = [];
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
    };
    TreeGrid.prototype.isCommandColumn = function (columns) {
        var _this = this;
        return columns.some(function (col) {
            if (col.columns) {
                return _this.isCommandColumn(col.columns);
            }
            return !!(col.commands || col.commandsTemplate);
        });
    };
    /**
     * Unbinding events from the element while component destroy.
     * @hidden
     */
    TreeGrid.prototype.unwireEvents = function () {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
    };
    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    TreeGrid.prototype.render = function () {
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
        var gridContainer = createElement('div', { id: this.element.id + '_gridcontrol' });
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
    };
    TreeGrid.prototype.convertTreeData = function (data) {
        if (data instanceof Array && data.length > 0 && data[0].hasOwnProperty('level')) {
            this.flatData = data;
        }
        else {
            this.dataModule.convertToFlatData(data);
        }
    };
    // private getGridData(): Object {
    //   if (isRemoteData(this)) {
    //     return this.dataSource;
    //   } else if (this.isLocalData && this.dataSource instanceof DataManager) {
    //     this.dataSource.dataSource.json = this.flatData;
    //     return this.dataSource;
    //   }
    //   return this.flatData;
    // }
    TreeGrid.prototype.bindGridProperties = function () {
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
    };
    TreeGrid.prototype.triggerEvents = function (args) {
        this.trigger(getObject('name', args), args);
    };
    TreeGrid.prototype.bindGridEvents = function () {
        var _this = this;
        var treeGrid = this;
        this.grid.rowSelecting = this.triggerEvents.bind(this);
        this.grid.rowSelected = function (args) {
            _this.selectedRowIndex = _this.grid.selectedRowIndex;
            _this.trigger(rowSelected, args);
        };
        this.grid.rowDeselected = function (args) {
            _this.selectedRowIndex = _this.grid.selectedRowIndex;
            _this.trigger(rowDeselected, args);
        };
        this.grid.toolbarClick = function (args) {
            _this.trigger(toolbarClick, args);
            if (args.cancel) {
                return;
            }
            _this.notify(toolbarClick, args);
        };
        this.grid.resizeStop = function (args) {
            _this.updateColumnModel();
            _this.trigger(resizeStop, args);
        };
        this.grid.excelQueryCellInfo = function (args) {
            _this.notify('excelCellInfo', args);
            args = _this.dataResults;
        };
        this.grid.pdfQueryCellInfo = function (args) {
            _this.notify('pdfCellInfo', args);
            args = _this.dataResults;
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
        this.grid.dataBound = function (args) {
            _this.updateColumnModel();
            _this.trigger(dataBound, args);
            if (isRemoteData(_this) && !isOffline(_this) && !_this.hasChildMapping) {
                var req = getObject('dataSource.requests', _this).filter(function (e) {
                    return e.httpRequest.statusText !== 'OK';
                }).length;
                setValue('grid.contentModule.isLoaded', !(req > 0), _this);
            }
            _this.initialRender = false;
        };
        this.grid.beforeDataBound = function (args) {
            if (isRemoteData(treeGrid) && !isOffline(treeGrid)) {
                treeGrid.notify('updateRemoteLevel', args);
                args = (treeGrid.dataResults);
            }
            else if (treeGrid.flatData.length === 0 && isOffline(treeGrid) && treeGrid.dataSource instanceof DataManager) {
                var dm = treeGrid.dataSource;
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
    };
    TreeGrid.prototype.extendedGridEditEvents = function () {
        var _this = this;
        this.grid.cellSave = function (args) {
            _this.trigger(cellSave, args);
            if (!args.cancel) {
                _this.notify(cellSave, args);
            }
        };
        // this.grid.cellSaved = (args: CellSaveArgs): void => {
        //   this.trigger(events.cellSaved, args);
        //   this.notify(events.cellSaved, args);
        // };
        this.grid.cellEdit = function (args) {
            _this.trigger(cellEdit, args);
            _this.notify(cellEdit, args);
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
        this.grid.batchCancel = function (args) {
            if (_this.editSettings.mode !== 'Cell') {
                _this.trigger(batchCancel, args);
            }
            _this.notify(batchCancel, args);
        };
    };
    TreeGrid.prototype.extendedGridEvents = function () {
        var _this = this;
        var treeGrid = this;
        this.grid.recordDoubleClick = function (args) {
            _this.trigger(recordDoubleClick, args);
            _this.notify(recordDoubleClick, args);
        };
        this.grid.actionBegin = function (args) {
            var requestType = getObject('requestType', args);
            if (requestType === 'reorder') {
                _this.notify('getColumnIndex', {});
            }
            if (!isRemoteData(_this) && !isNullOrUndefined(_this.filterModule)
                && (_this.grid.filterSettings.columns.length === 0 || _this.grid.searchSettings.key.length === 0)) {
                _this.notify('clearFilters', { flatData: _this.grid.dataSource });
                _this.grid.dataSource = _this.dataResults.result;
            }
            _this.trigger(actionBegin, args);
            _this.notify(beginEdit, args);
        };
        this.grid.actionComplete = function (args) {
            _this.updateColumnModel();
            if (args.requestType === 'reorder') {
                _this.notify('setColumnIndex', {});
            }
            if (_this.isLocalData) {
                if ((args.requestType === 'delete' || args.requestType === 'save')) {
                    _this.notify(crudAction, { value: args.data, action: args.action || args.requestType });
                }
                if (args.requestType === 'add' && (_this.editSettings.newRowPosition !== 'Top' && _this.editSettings.newRowPosition !== 'Bottom')) {
                    _this.notify(beginAdd, args);
                }
                if (args.requestType === 'batchsave') {
                    _this.notify(batchSave, args);
                }
            }
            _this.trigger(actionComplete, args);
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
        this.grid.contextMenuClick = function (args) {
            _this.notify(contextMenuClick, args);
            _this.trigger(contextMenuClick, args);
        };
        this.grid.contextMenuOpen = function (args) {
            _this.notify(contextMenuOpen, args);
            _this.trigger(contextMenuOpen, args);
        };
        this.grid.queryCellInfo = function (args) {
            _this.renderModule.cellRender(args);
        };
    };
    /**
     * Renders TreeGrid component
     * @private
     */
    TreeGrid.prototype.loadGrid = function () {
        this.bindGridProperties();
        this.bindGridEvents();
        setValue('registeredTemplate', this.registeredTemplate, this.grid);
    };
    /**
     * AutoGenerate TreeGrid columns from first record
     * @hidden
     */
    TreeGrid.prototype.autoGenerateColumns = function () {
        if (!this.columns.length && (!this.dataModule.isRemote() && Object.keys(this.dataSource).length)) {
            var record = void 0;
            // if (this.dataSource instanceof DataManager) {
            //   record = (<DataManager>this.dataSource).dataSource.json[0];
            // } else {
            record = this.dataSource[0];
            // }
            var keys = Object.keys(record);
            for (var i = 0; i < keys.length; i++) {
                if ([this.childMapping, this.parentIdMapping].indexOf(keys[i]) === -1) {
                    this.columns.push(keys[i]);
                }
            }
        }
    };
    TreeGrid.prototype.getGridEditSettings = function () {
        var edit = {};
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
    };
    /**
     * Defines grid toolbar from treegrid toolbar model
     * @hidden
     */
    TreeGrid.prototype.getContextMenu = function () {
        if (this.contextMenuItems) {
            var items = [];
            for (var i = 0; i < this.contextMenuItems.length; i++) {
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
    };
    /**
     * Defines grid toolbar from treegrid toolbar model
     * @hidden
     */
    TreeGrid.prototype.getGridToolbar = function () {
        if (this.toolbar) {
            this.l10n = new L10n('treegrid', this.defaultLocale, this.locale);
            var items = [];
            for (var i = 0; i < this.toolbar.length; i++) {
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
                        var tooltipText = this.l10n.getConstant('ExpandAll');
                        items.push({ text: tooltipText, tooltipText: tooltipText,
                            prefixIcon: 'e-expand', id: this.element.id + '_gridcontrol_expandall' });
                        break;
                    case 'CollapseAll':
                    case ToolbarItem.CollapseAll:
                        var tooltip = this.l10n.getConstant('CollapseAll');
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
    };
    /**
     * Convert TreeGrid ColumnModel to Grid Column
     * @hidden
     */
    TreeGrid.prototype.getGridColumns = function () {
        var column = this.columns;
        this.columnModel = [];
        var treeGridColumn;
        var gridColumn;
        var gridColumnCollection = [];
        for (var i = 0; i < column.length; i++) {
            gridColumn = {};
            treeGridColumn = {};
            if (typeof this.columns[i] === 'string') {
                gridColumn.field = treeGridColumn.field = this.columns[i];
            }
            else {
                for (var _i = 0, _a = Object.keys(column[i]); _i < _a.length; _i++) {
                    var prop = _a[_i];
                    gridColumn[prop] = treeGridColumn[prop] = column[i][prop];
                }
            }
            this.columnModel.push(new Column(treeGridColumn));
            gridColumnCollection.push(gridColumn);
        }
        return gridColumnCollection;
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    TreeGrid.prototype.onPropertyChanged = function (newProp, oldProp) {
        var properties = Object.keys(newProp);
        var requireRefresh = false;
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop = properties_1[_i];
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
    };
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    TreeGrid.prototype.destroy = function () {
        this.removeListener();
        this.unwireEvents();
        _super.prototype.destroy.call(this);
        this.grid.destroy();
        this.dataModule.destroy();
        var modules = ['dataModule', 'sortModule', 'renderModule', 'filterModule', 'printModule',
            'excelExportModule', 'pdfExportModule', 'toolbarModule', 'summaryModule', 'reorderModule', 'resizeModule',
            'pagerModule', 'keyboardModule', 'columnMenuModule', 'contextMenuModule', 'editModule'];
        for (var i = 0; i < modules.length; i++) {
            if (this[modules[i]]) {
                this[modules[i]] = null;
            }
        }
        this.element.innerHTML = '';
        this.grid = null;
    };
    /**
     * Update the TreeGrid model
     * @method dataBind
     * @return {void}
     */
    TreeGrid.prototype.dataBind = function () {
        _super.prototype.dataBind.call(this);
        this.grid.dataBind();
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    TreeGrid.prototype.getPersistData = function () {
        var _this = this;
        var keyEntity = ['pageSettings', 'sortSettings',
            'filterSettings', 'columns', 'searchSettings', 'selectedRowIndex'];
        var ignoreOnPersist = {
            pageSettings: ['template', 'pageSizes', 'pageSizeMode', 'enableQueryString', 'totalRecordsCount', 'pageCount'],
            filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay', 'ignoreAccent', 'hierarchyMode'],
            searchSettings: ['fields', 'operator', 'ignoreCase'],
            sortSettings: [], columns: [], selectedRowIndex: []
        };
        var ignoreOnColumn = ['filter', 'edit', 'filterBarTemplate', 'headerTemplate', 'template',
            'commandTemplate', 'commands', 'dataSource'];
        keyEntity.forEach(function (value) {
            var currentObject = _this[value];
            for (var _i = 0, _a = ignoreOnPersist[value]; _i < _a.length; _i++) {
                var val = _a[_i];
                delete currentObject[val];
            }
        });
        this.ignoreInArrays(ignoreOnColumn, this.columns);
        return this.addOnPersist(keyEntity);
    };
    TreeGrid.prototype.ignoreInArrays = function (ignoreOnColumn, columns) {
        var _this = this;
        columns.forEach(function (column) {
            if (column.columns) {
                _this.ignoreInColumn(ignoreOnColumn, column);
                _this.ignoreInArrays(ignoreOnColumn, column.columns);
            }
            else {
                _this.ignoreInColumn(ignoreOnColumn, column);
            }
        });
    };
    TreeGrid.prototype.ignoreInColumn = function (ignoreOnColumn, column) {
        ignoreOnColumn.forEach(function (val) {
            delete column[val];
            column.filter = {};
        });
    };
    TreeGrid.prototype.mouseClickHandler = function (e) {
        if (!isNullOrUndefined(e.touches)) {
            return;
        }
        var target = e.target;
        if (target.classList.contains('e-treegridexpand') ||
            target.classList.contains('e-treegridcollapse')) {
            this.expandCollapseRequest(target);
        }
    };
    /**
     * Returns TreeGrid rows
     * @return {HTMLTableRowElement[]}
     */
    TreeGrid.prototype.getRows = function () {
        return this.grid.getRows();
    };
    /**
     * Gets the pager of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getPager = function () {
        return this.grid.getPager(); //get element from pager
    };
    /**
     * Adds a new record to the TreeGrid. Without passing parameters, it adds empty rows.
     * > `editSettings.allowEditing` should be true.
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added
     */
    TreeGrid.prototype.addRecord = function (data, index) {
        this.grid.editModule.addRecord(data, index);
    };
    /**
     * Cancels edited state.
     */
    TreeGrid.prototype.closeEdit = function () {
        this.grid.editModule.closeEdit();
    };
    /**
     * Delete a record with Given options. If fieldName and data is not given then TreeGrid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldName - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     */
    TreeGrid.prototype.deleteRecord = function (fieldName, data) {
        this.grid.editModule.deleteRecord(fieldName, data);
    };
    /**
     * To edit any particular row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
     */
    TreeGrid.prototype.startEdit = function () {
        this.grid.editModule.startEdit();
    };
    /**
     * If TreeGrid is in editable state, you can save a record by invoking endEdit.
     */
    TreeGrid.prototype.endEdit = function () {
        this.grid.editModule.endEdit();
    };
    /**
     * Delete any visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    TreeGrid.prototype.deleteRow = function (tr) {
        this.grid.editModule.deleteRow(tr);
    };
    /**
     * Get the names of the primary key columns of the TreeGrid.
     * @return {string[]}
     */
    TreeGrid.prototype.getPrimaryKeyFieldNames = function () {
        return this.grid.getPrimaryKeyFieldNames();
    };
    /**
     * Updates particular cell value based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {string } field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     */
    TreeGrid.prototype.setCellValue = function (key, field, value) {
        this.grid.setCellValue(key, field, value);
    };
    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *  @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     *  @param {Object} rowData - To update new data for the particular row.
     */
    TreeGrid.prototype.setRowData = function (key, rowData) {
        this.grid.setRowData(key, rowData);
    };
    /**
     * Navigates to the specified target page.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    TreeGrid.prototype.goToPage = function (pageNo) {
        this.grid.pagerModule.goToPage(pageNo);
    };
    /**
     * Gets a cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    TreeGrid.prototype.getCellFromIndex = function (rowIndex, columnIndex) {
        return this.grid.getCellFromIndex(rowIndex, columnIndex);
    };
    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     */
    TreeGrid.prototype.getColumnByField = function (field) {
        return iterateArrayOrObject(this.columnModel, function (item, index) {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    };
    /**
     * Gets a column by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {Column}
     */
    TreeGrid.prototype.getColumnByUid = function (uid) {
        return iterateArrayOrObject(this.columnModel, function (item, index) {
            if (item.uid === uid) {
                return item;
            }
            return undefined;
        })[0];
    };
    /**
     * Gets the collection of column fields.
     * @return {string[]}
     */
    TreeGrid.prototype.getColumnFieldNames = function () {
        return this.grid.getColumnFieldNames();
    };
    /**
     * Gets the footer div of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getFooterContent = function () {
        return this.grid.getFooterContent();
    };
    /**
     * Gets the footer table element of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getFooterContentTable = function () {
        return this.grid.getFooterContentTable();
    };
    /**
     * Shows a column by its column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    TreeGrid.prototype.showColumns = function (keys, showBy) {
        return this.grid.showColumns(keys, showBy);
    };
    /**
     * Hides a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    TreeGrid.prototype.hideColumns = function (keys, hideBy) {
        return this.grid.hideColumns(keys, hideBy);
    };
    /**
     * Gets a column header by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Element}
     */
    TreeGrid.prototype.getColumnHeaderByField = function (field) {
        return this.grid.getColumnHeaderByField(field);
    };
    /**
     * Gets a column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element}
     */
    TreeGrid.prototype.getColumnHeaderByIndex = function (index) {
        return this.grid.getColumnHeaderByIndex(index);
    };
    /**
     * Gets a column header by UID.
     * @param  {string} field - Specifies the column uid.
     * @return {Element}
     */
    TreeGrid.prototype.getColumnHeaderByUid = function (uid) {
        return this.grid.getColumnHeaderByUid(uid);
    };
    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    TreeGrid.prototype.getColumnIndexByField = function (field) {
        return this.grid.getColumnIndexByField(field);
    };
    /**
     * Gets a column index by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {number}
     */
    TreeGrid.prototype.getColumnIndexByUid = function (uid) {
        return this.grid.getColumnIndexByUid(uid);
    };
    /**
     * Gets the columns from the TreeGrid.
     * @return {Column[]}
     */
    TreeGrid.prototype.getColumns = function (isRefresh) {
        this.updateColumnModel(this.grid.getColumns(isRefresh));
        return this.columnModel;
    };
    TreeGrid.prototype.updateColumnModel = function (column) {
        var gridColumns = isNullOrUndefined(column) ? this.grid.getColumns() : column;
        var gridColumn;
        this.columnModel = [];
        for (var i = 0; i < gridColumns.length; i++) {
            gridColumn = {};
            for (var _i = 0, _a = Object.keys(gridColumns[i]); _i < _a.length; _i++) {
                var prop = _a[_i];
                gridColumn[prop] = gridColumns[i][prop];
            }
            this.columnModel.push(new Column(gridColumn));
        }
        this.setProperties({ columns: this.columnModel }, true);
        return this.columnModel;
    };
    /**
     * Gets the content div of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getContent = function () {
        return this.grid.getContent();
    };
    /**
     * Gets the content table of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getContentTable = function () {
        return this.grid.getContentTable();
    };
    /**
     * Gets all the TreeGrid's data rows.
     * @return {Element[]}
     */
    TreeGrid.prototype.getDataRows = function () {
        var dRows = [];
        var rows = this.grid.getDataRows();
        for (var i = 0, len = rows.length; i < len; i++) {
            if (!rows[i].classList.contains('e-summaryrow')) {
                dRows.push(rows[i]);
            }
        }
        return dRows;
    };
    /**
     * Get current visible data of TreeGrid.
     * @return {Object[]}
     * @hidden
     */
    TreeGrid.prototype.getCurrentViewRecords = function () {
        return this.grid.currentViewData;
    };
    /**
     * Gets the header div of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getHeaderContent = function () {
        return this.grid.getHeaderContent();
    };
    /**
     * Gets the header table element of the TreeGrid.
     * @return {Element}
     */
    TreeGrid.prototype.getHeaderTable = function () {
        return this.grid.getHeaderTable();
    };
    /**
     * Gets a row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    TreeGrid.prototype.getRowByIndex = function (index) {
        return this.grid.getRowByIndex(index);
    };
    /**
     * Get a row information based on cell
     * @param {Element}
     * @return RowInfo
     */
    TreeGrid.prototype.getRowInfo = function (target) {
        return this.grid.getRowInfo(target);
    };
    /**
     * Gets UID by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    TreeGrid.prototype.getUidByColumnField = function (field) {
        return this.grid.getUidByColumnField(field);
    };
    /**
     * Gets the visible columns from the TreeGrid.
     * @return {Column[]}
     */
    TreeGrid.prototype.getVisibleColumns = function () {
        var cols = [];
        for (var _i = 0, _a = this.columnModel; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    };
    /**
     * By default, TreeGrid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     */
    TreeGrid.prototype.showSpinner = function () {
        showSpinner(this.element);
    };
    /**
     * Manually shown spinner needs to hide by `hideSpinnner`.
     */
    TreeGrid.prototype.hideSpinner = function () {
        hideSpinner(this.element);
    };
    /**
     * Refreshes the TreeGrid header and content.
     */
    TreeGrid.prototype.refresh = function () {
        this.grid.refresh();
    };
    /**
     * Refreshes the TreeGrid column changes.
     */
    TreeGrid.prototype.refreshColumns = function () {
        this.grid.columns = this.getGridColumns();
        this.grid.refreshColumns();
    };
    /**
     * Refreshes the TreeGrid header.
     */
    TreeGrid.prototype.refreshHeader = function () {
        this.grid.refreshHeader();
    };
    /**
     * Expands or collapse child records
     * @return {string}
     * @hidden
     */
    TreeGrid.prototype.expandCollapseRequest = function (target) {
        var rowInfo = this.grid.getRowInfo(target);
        var record = rowInfo.rowData;
        if (target.classList.contains('e-treegridexpand')) {
            this.collapseRow(rowInfo.row, record);
        }
        else {
            this.expandRow(rowInfo.row, record);
        }
    };
    /**
     * Expands child rows
     * @return {void}
     */
    TreeGrid.prototype.expandRow = function (row, record) {
        record = this.getCollapseExpandRecords(row, record);
        var args = { data: record, row: row, cancel: false };
        this.trigger(expanding, args);
        if (args.cancel) {
            return;
        }
        this.expandCollapse('expand', row, record);
        if (!(isRemoteData(this) && !isOffline(this))) {
            var collapseArgs = { data: record, row: row };
            this.trigger(expanded, collapseArgs);
        }
    };
    TreeGrid.prototype.getCollapseExpandRecords = function (row, record) {
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All' && this.isExpandAll && isNullOrUndefined(record)) {
            record = this.flatData.filter(function (e) {
                return e.hasChildRecords;
            });
        }
        else if (isNullOrUndefined(record)) {
            record = this.grid.getCurrentViewRecords()[row.rowIndex];
        }
        return record;
    };
    /**
     * Collapses child rows
     * @return {void}
     */
    TreeGrid.prototype.collapseRow = function (row, record) {
        record = this.getCollapseExpandRecords(row, record);
        var args = { data: record, row: row, cancel: false };
        this.trigger(collapsing, args);
        if (args.cancel) {
            return;
        }
        this.expandCollapse('collapse', row, record);
        var collapseArgs = { data: record, row: row };
        this.trigger(collapsed, collapseArgs);
    };
    /**
     * Expands the records at specific hierarchical level
     * @return {void}
     */
    TreeGrid.prototype.expandAtLevel = function (level) {
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All') {
            var rec = this.flatData.filter(function (e) {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = true;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.expandRow(null, rec);
        }
        else {
            var rec = this.getRecordDetails(level);
            var row = getObject('rows', rec);
            var record = getObject('records', rec);
            for (var i = 0; i < record.length; i++) {
                this.expandRow(row[i], record[i]);
            }
        }
    };
    TreeGrid.prototype.getRecordDetails = function (level) {
        var rows = this.getRows().filter(function (e) {
            return (e.className.indexOf('level' + level) !== -1
                && (e.querySelector('.e-treegridcollapse') || e.querySelector('.e-treegridexpand')));
        });
        var records = this.getCurrentViewRecords().filter(function (e) { return e.level === level && e.hasChildRecords; });
        var obj = { records: records, rows: rows };
        return obj;
    };
    /**
     * Collapses the records at specific hierarchical level
     * @return {void}
     */
    TreeGrid.prototype.collapseAtLevel = function (level) {
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All') {
            var rec = this.flatData.filter(function (e) {
                if (e.hasChildRecords && e.level === level) {
                    e.expanded = false;
                }
                return e.hasChildRecords && e.level === level;
            });
            this.collapseRow(null, rec);
        }
        else {
            var rec = this.getRecordDetails(level);
            var rows = getObject('rows', rec);
            var records = getObject('records', rec);
            for (var i = 0; i < records.length; i++) {
                this.collapseRow(rows[i], records[i]);
            }
        }
    };
    /**
     * Expands All the rows
     * @return {void}
     */
    TreeGrid.prototype.expandAll = function () {
        this.expandCollapseAll('expand');
    };
    /**
     * Collapses All the rows
     * @return {void}
     */
    TreeGrid.prototype.collapseAll = function () {
        this.expandCollapseAll('collapse');
    };
    TreeGrid.prototype.expandCollapseAll = function (action) {
        var rows = this.getRows().filter(function (e) {
            return e.querySelector('.e-treegrid' + (action === 'expand' ? 'collapse' : 'expand'));
        });
        this.isExpandAll = true;
        if (this.allowPaging && this.pageSettings.pageSizeMode === 'All') {
            this.flatData.filter(function (e) {
                if (e.hasChildRecords) {
                    e.expanded = action === 'collapse' ? false : true;
                }
            });
            action === 'collapse' ? this.collapseRow(rows[0]) : this.expandRow(rows[0]);
        }
        else {
            for (var i = 0; i < rows.length; i++) {
                action === 'collapse' ? this.collapseRow(rows[i]) : this.expandRow(rows[i]);
            }
        }
        this.isExpandAll = false;
    };
    TreeGrid.prototype.expandCollapse = function (action, row, record, isChild) {
        var gridRows = this.getRows();
        var rowIndex;
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
            var displayAction = void 0;
            if (action === 'expand') {
                displayAction = 'table-row';
                if (!isChild) {
                    record.expanded = true;
                }
                var targetEle = row.getElementsByClassName('e-treegridcollapse')[0];
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
                var targetEle = row.getElementsByClassName('e-treegridexpand')[0];
                if (isNullOrUndefined(targetEle)) {
                    return;
                }
                addClass([targetEle], 'e-treegridcollapse');
                removeClass([targetEle], 'e-treegridexpand');
            }
            var args = { data: record, row: row };
            if (isRemoteData(this) && !isOffline(this)) {
                var rows = gridRows.filter(function (r) {
                    return r.classList.contains('e-gridrowindex' + record.index + 'level' + (record.level + 1));
                });
                if (action === 'expand') {
                    this.notify(remoteExpand, { record: record, rows: rows, parentRow: row });
                }
                else {
                    this.collapseRemoteChild(rows);
                    this.trigger(collapsed, args);
                }
            }
            else {
                var childRecords = this.getCurrentViewRecords().filter(function (e) {
                    return (e.parentUniqueID === record.uniqueID);
                });
                var index = childRecords[0].parentItem.index;
                var rows = gridRows.filter(function (r) {
                    return r.classList.contains('e-gridrowindex' + record.index + 'level' + (record.level + 1));
                });
                for (var i = 0; i < rows.length; i++) {
                    rows[i].style.display = displayAction;
                    if (!isNullOrUndefined(childRecords[i].childRecords) && (action !== 'expand' ||
                        isNullOrUndefined(childRecords[i].expanded) || childRecords[i].expanded)) {
                        this.expandCollapse(action, rows[i], childRecords[i], true);
                    }
                }
            }
        }
    };
    TreeGrid.prototype.collapseRemoteChild = function (rows) {
        var _loop_1 = function (i) {
            var rData = this_1.grid.getRowObjectFromUID(rows[i].getAttribute('data-Uid')).data;
            rData.expanded = false;
            rows[i].style.display = 'none';
            if (rows[i].querySelector('.e-treecolumn-container .e-treegridexpand')) {
                removeClass([rows[i].getElementsByClassName('e-icons')[0]], 'e-treegridexpand');
                addClass([rows[i].getElementsByClassName('e-icons')[0]], 'e-treegridcollapse');
                var cRow = this_1.getRows().filter(function (r) {
                    return r.classList.contains('e-gridrowindex' + rData.index + 'level' + (rData.level + 1));
                });
                this_1.collapseRemoteChild(cRow);
            }
        };
        var this_1 = this;
        for (var i = 0; i < rows.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * @hidden
     */
    TreeGrid.prototype.addListener = function () {
        this.on('updateResults', this.updateResultModel, this);
    };
    TreeGrid.prototype.updateResultModel = function (returnResult) {
        this.dataResults = returnResult;
    };
    /**
     * @hidden
     */
    TreeGrid.prototype.removeListener = function () {
        if (this.isDestroyed) {
            return;
        }
        this.off('updateResults', this.updateResultModel);
    };
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
    TreeGrid.prototype.filterByColumn = function (fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator) {
        this.grid.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator);
    };
    /**
     * Clears all the filtered rows of the TreeGrid.
     * @return {void}
     */
    TreeGrid.prototype.clearFiltering = function () {
        this.grid.clearFiltering();
    };
    /**
     * Removes filtered column by field name.
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @return {void}
     * @hidden
     */
    TreeGrid.prototype.removeFilteredColsByField = function (field, isClearFilterBar) {
        this.grid.removeFilteredColsByField(field, isClearFilterBar);
    };
    /**
     * Selects a row by given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    TreeGrid.prototype.selectRow = function (index, isToggle) {
        this.grid.selectRow(index, isToggle);
    };
    /**
     * Selects a collection of rows by indexes.
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void}
     */
    TreeGrid.prototype.selectRows = function (rowIndexes) {
        this.grid.selectRows(rowIndexes);
    };
    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    TreeGrid.prototype.clearSelection = function () {
        this.grid.clearSelection();
    };
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    TreeGrid.prototype.selectCell = function (cellIndex, isToggle) {
        this.grid.selectCell(cellIndex, isToggle);
    };
    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    TreeGrid.prototype.getSelectedRows = function () {
        return this.grid.getSelectedRows();
    };
    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    TreeGrid.prototype.getSelectedRowIndexes = function () {
        return this.grid.getSelectedRowIndexes();
    };
    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    TreeGrid.prototype.getSelectedRowCellIndexes = function () {
        return this.grid.getSelectedRowCellIndexes();
    };
    /**
     * Gets the collection of selected records.
     * @return {Object[]}
     */
    TreeGrid.prototype.getSelectedRecords = function () {
        return this.grid.getSelectedRecords();
    };
    /**
     * Gets the data module.
     * @return {Data}
     */
    TreeGrid.prototype.getDataModule = function () {
        return { baseModule: this.grid.getDataModule(), treeModule: this.dataModule };
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
    return TreeGrid;
}(Component));

/**
 * TreeGrid Reorder module
 * @hidden
 */
var Reorder$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Reorder module
     */
    function Reorder$$1(parent, treeColumn) {
        Grid.Inject(Reorder);
        this.parent = parent;
        this.treeColumn = treeColumn;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Reorder$$1.prototype.getModuleName = function () {
        return 'reorder';
    };
    /**
     * @hidden
     */
    Reorder$$1.prototype.addEventListener = function () {
        this.parent.on('getColumnIndex', this.getTreeColumn, this);
        this.parent.on('setColumnIndex', this.setTreeColumnIndex, this);
    };
    Reorder$$1.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('getColumnIndex', this.getTreeColumn);
        this.parent.off('setColumnIndex', this.getTreeColumn);
    };
    /**
     * To destroy the Reorder
     * @return {void}
     * @hidden
     */
    Reorder$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    Reorder$$1.prototype.getTreeColumn = function () {
        this.treeColumn = this.parent.columns[this.parent.treeColumnIndex];
    };
    Reorder$$1.prototype.setTreeColumnIndex = function () {
        var treeIndex;
        for (var f = 0; f < this.parent.columns.length; f++) {
            var treeColumnfield = getObject('field', this.treeColumn);
            var parentColumnfield = getObject('field', this.parent.columns[f]);
            if (treeColumnfield === parentColumnfield) {
                treeIndex = f;
            }
        }
        this.parent.treeColumnIndex = treeIndex;
    };
    return Reorder$$1;
}());

/**
 * TreeGrid Resize module
 * @hidden
 */
var Resize$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Resize module
     */
    function Resize$$1(parent) {
        Grid.Inject(Resize);
        this.parent = parent;
    }
    /**
     * Resize by field names.
     * @param  {string|string[]} fName - Defines the field name.
     * @return {void}
     */
    Resize$$1.prototype.autoFitColumns = function (fName) {
        this.parent.grid.autoFitColumns(fName);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Resize$$1.prototype.getModuleName = function () {
        return 'resize';
    };
    /**
     * Destroys the Resize.
     * @method destroy
     * @return {void}
     */
    Resize$$1.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.grid.resizeModule.destroy();
    };
    return Resize$$1;
}());

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
var Filter$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Filter module
     */
    function Filter$$1(parent) {
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
    Filter$$1.prototype.getModuleName = function () {
        return 'filter';
    };
    /**
     * To destroy the Filter module
     * @return {void}
     * @hidden
     */
    Filter$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * @hidden
     */
    Filter$$1.prototype.addEventListener = function () {
        this.parent.on('updateFilterRecs', this.updatedFilteredRecord, this);
        this.parent.on('clearFilters', this.clearFilterLevel, this);
    };
    /**
     * @hidden
     */
    Filter$$1.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateFilterRecs', this.updatedFilteredRecord);
        this.parent.off('clearFilters', this.clearFilterLevel);
    };
    /**
     * Function to update filtered records
     *  @hidden
     */
    Filter$$1.prototype.updatedFilteredRecord = function (dataDetails) {
        this.flatFilteredData = dataDetails.data;
        this.filteredParentRecs = [];
        this.filteredResult = [];
        this.isHierarchyFilter = false;
        var _loop_1 = function (f) {
            var rec = this_1.flatFilteredData[f];
            this_1.addParentRecord(rec);
            if (this_1.parent.filterSettings.hierarchyMode === 'Child' ||
                this_1.parent.filterSettings.hierarchyMode === 'None' || this_1.parent.searchSettings.hierarchyMode === 'Child' ||
                this_1.parent.searchSettings.hierarchyMode === 'None') {
                this_1.isHierarchyFilter = true;
            }
            var ischild = getObject('childRecords', rec);
            if (!isNullOrUndefined(ischild) && ischild.length) {
                setValue('hasFilteredChildRecords', this_1.checkChildExsist(rec), rec);
            }
            var parent_1 = getObject('parentItem', rec);
            if (!isNullOrUndefined(parent_1)) {
                var parRecord = this_1.flatFilteredData.filter(function (e) {
                    return e.uniqueID === rec.parentItem.uniqueID;
                })[0];
                setValue('hasFilteredChildRecords', true, parRecord);
            }
        };
        var this_1 = this;
        for (var f = 0; f < this.flatFilteredData.length; f++) {
            _loop_1(f);
        }
        if (this.flatFilteredData.length > 0 && this.isHierarchyFilter) {
            this.updateFilterLevel();
        }
        this.parent.notify('updateAction', { result: this.filteredResult });
    };
    Filter$$1.prototype.addParentRecord = function (record) {
        var parent = this.parent.flatData.filter(function (e) { return e.uniqueID === record.parentUniqueID; })[0];
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
    };
    Filter$$1.prototype.checkChildExsist = function (records) {
        var childRec = getObject('childRecords', records);
        var isExist = false;
        for (var count = 0; count < childRec.length; count++) {
            var ischild = getObject('childRecords', childRec[count]);
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
    };
    Filter$$1.prototype.updateFilterLevel = function () {
        var record = this.filteredResult;
        var len = this.filteredResult.length;
        var _loop_2 = function (c) {
            var parent_2 = this_2.parent.flatData.filter(function (e) { return e.uniqueID === record[c].parentUniqueID; })[0];
            var isPrst = record.indexOf(parent_2) !== -1;
            if (isPrst) {
                var parent_3 = this_2.filteredResult.filter(function (e) { return e.uniqueID === record[c].parentUniqueID; })[0];
                setValue('filterLevel', parent_3.filterLevel + 1, record[c]);
            }
            else {
                setValue('filterLevel', 0, record[c]);
                this_2.filteredParentRecs.push(record[c]);
            }
        };
        var this_2 = this;
        for (var c = 0; c < len; c++) {
            _loop_2(c);
        }
    };
    Filter$$1.prototype.clearFilterLevel = function (data) {
        var count = 0;
        var flatData = data.flatData;
        var len = flatData.length;
        var currentRecord;
        for (count; count < len; count++) {
            currentRecord = flatData[count];
            var fLevel = getObject('filterLevel', currentRecord);
            if (fLevel || fLevel === 0 || !isNullOrUndefined(getObject('hasFilteredChildRecords', currentRecord))) {
                var ischild = getObject('childRecords', currentRecord);
                setValue('hasFilteredChildRecords', null, currentRecord);
                setValue('filterLevel', null, currentRecord);
            }
        }
        this.parent.notify('updateResults', { result: flatData, count: flatData.length });
    };
    return Filter$$1;
}());

/**
 * TreeGrid Excel Export module
 * @hidden
 */
var ExcelExport$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Excel Export module
     */
    function ExcelExport$$1(parent) {
        Grid.Inject(ExcelExport);
        this.parent = parent;
        this.dataResults = {};
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    ExcelExport$$1.prototype.getModuleName = function () {
        return 'ExcelExport';
    };
    /**
     * @hidden
     */
    ExcelExport$$1.prototype.addEventListener = function () {
        this.parent.on('updateResults', this.updateExcelResultModel, this);
        this.parent.on('excelCellInfo', this.excelQueryCellInfo, this);
    };
    /**
     * To destroy the Excel Export
     * @return {void}
     * @hidden
     */
    ExcelExport$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * @hidden
     */
    ExcelExport$$1.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updateResults', this.updateExcelResultModel);
        this.parent.off('excelCellInfo', this.excelQueryCellInfo);
    };
    ExcelExport$$1.prototype.updateExcelResultModel = function (returnResult) {
        this.dataResults = returnResult;
    };
    ExcelExport$$1.prototype.Map = function (excelExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, workbook, isBlob, isCsv) {
        var _this = this;
        var dataSource = this.parent.flatData;
        var property = Object();
        setValue('isCsv', isCsv, property);
        setValue('cancel', false, property);
        return new Promise(function (resolve, reject) {
            var dm = _this.isLocal() ? new DataManager(dataSource) : _this.parent.dataSource;
            var query = new Query();
            if (!_this.isLocal()) {
                query = _this.generateQuery(query);
                setValue('query', query, property);
            }
            _this.parent.trigger(beforeExcelExport, extend(property, excelExportProperties));
            if (getObject('cancel', property)) {
                return null;
            }
            dm.executeQuery(query).then(function (e) {
                _this.manipulateExportProperties(excelExportProperties, dataSource, _this.isLocal() ? null : e);
                return _this.parent.grid.excelExportModule.Map(_this.parent.grid, excelExportProperties, isMultipleExport, workbook, isCsv, isBlob);
            });
        });
    };
    ExcelExport$$1.prototype.generateQuery = function (query, property) {
        if (!isNullOrUndefined(property) && property.exportType === 'CurrentPage'
            && this.parent.allowPaging) {
            property.exportType = 'AllPages';
            query.addParams('ExportType', 'CurrentPage');
            query.where(this.parent.parentIdMapping, 'equal', null);
            query = getObject('grid.renderModule.data.pageQuery', this.parent)(query);
        }
        return query;
    };
    ExcelExport$$1.prototype.manipulateExportProperties = function (property, dtSrc, queryResult) {
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
            var args = Object();
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
    };
    /**
     * TreeGrid Excel Export cell modifier
     * @hidden
     */
    ExcelExport$$1.prototype.excelQueryCellInfo = function (args) {
        if (this.parent.grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            var style = {};
            var data = args.data;
            var ispadfilter = isNullOrUndefined(data.filterLevel);
            var pad = ispadfilter ? data.level : data.filterLevel;
            style.indent = pad;
            args.style = style;
        }
        this.parent.notify('updateResults', args);
        this.parent.trigger('excelQueryCellInfo', args);
    };
    ExcelExport$$1.prototype.isLocal = function () {
        return !isRemoteData(this.parent) && isOffline(this.parent);
    };
    return ExcelExport$$1;
}());

/**
 * TreeGrid PDF Export module
 * @hidden
 */
var PdfExport$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for PDF export module
     */
    function PdfExport$$1(parent) {
        Grid.Inject(PdfExport);
        this.parent = parent;
        this.dataResults = {};
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    PdfExport$$1.prototype.getModuleName = function () {
        return 'PdfExport';
    };
    /**
     * @hidden
     */
    PdfExport$$1.prototype.addEventListener = function () {
        this.parent.on('pdfCellInfo', this.pdfQueryCellInfo, this);
        this.parent.on('updateResults', this.updatePdfResultModel, this);
    };
    /**
     * @hidden
     */
    PdfExport$$1.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('pdfCellInfo', this.pdfQueryCellInfo);
        this.parent.off('updateResults', this.updatePdfResultModel);
    };
    /**
     * To destroy the PDF Export
     * @return {void}
     * @hidden
     */
    PdfExport$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    PdfExport$$1.prototype.updatePdfResultModel = function (returnResult) {
        this.dataResults = returnResult;
    };
    PdfExport$$1.prototype.Map = function (pdfExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, pdfDoc, isBlob) {
        var _this = this;
        var dtSrc = this.parent.flatData;
        var prop = Object();
        setValue('cancel', false, prop);
        var isLocal = !isRemoteData(this.parent) && isOffline(this.parent);
        return new Promise(function (resolve, reject) {
            var dm = isLocal ? new DataManager(dtSrc) : _this.parent.dataSource;
            var query = new Query();
            if (!isLocal) {
                query = _this.generateQuery(query);
                setValue('query', query, prop);
            }
            _this.parent.trigger(beforePdfExport, extend(prop, pdfExportProperties));
            if (getObject('cancel', prop)) {
                return null;
            }
            dm.executeQuery(query).then(function (e) {
                _this.manipulatePdfProperties(pdfExportProperties, dtSrc, isLocal ? null : e);
                return _this.parent.grid.pdfExportModule.Map(_this.parent.grid, pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
            });
        });
    };
    PdfExport$$1.prototype.generateQuery = function (query, prop) {
        if (!isNullOrUndefined(prop) && prop.exportType === 'CurrentPage'
            && this.parent.allowPaging) {
            prop.exportType = 'AllPages';
            query.addParams('ExportType', 'CurrentPage');
            query.where(this.parent.parentIdMapping, 'equal', null);
            query = getObject('grid.renderModule.data.pageQuery', this.parent)(query);
        }
        return query;
    };
    PdfExport$$1.prototype.manipulatePdfProperties = function (prop, dtSrc, queryResult) {
        if (isNullOrUndefined(queryResult)) {
            if ((this.parent.grid.filterSettings.columns.length > 0 || this.parent.grid.searchSettings.key)
                && this.parent.grid.sortSettings.columns.length === 0) {
                dtSrc = this.parent.filterModule.filteredResult;
            }
        }
        else {
            this.parent.parentData = [];
            //count not required for this query
            var args = {};
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
    };
    /**
     * TreeGrid PDF Export cell modifier
     * @hidden
     */
    PdfExport$$1.prototype.pdfQueryCellInfo = function (args) {
        if (this.parent.grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            var style = {};
            var data = getObject('data', args);
            var ispadfilter = isNullOrUndefined(data.filterLevel);
            var pad = ispadfilter ? data.level : data.filterLevel;
            style.paragraphIndent = pad * 3;
            args.style = style;
        }
        this.parent.notify('updateResults', args);
        this.parent.trigger('pdfQueryCellInfo', args);
    };
    return PdfExport$$1;
}());

/**
 * The `Page` module is used to render pager and handle paging action.
 * @hidden
 */
var Page$1 = /** @__PURE__ @class */ (function () {
    function Page$$1(parent) {
        Grid.Inject(Page);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    Page$$1.prototype.addEventListener = function () {
        this.parent.on(localPagedExpandCollapse, this.collapseExpandPagedchilds, this);
        this.parent.on(pagingActions, this.pageAction, this);
    };
    /**
     * @hidden
     */
    Page$$1.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(localPagedExpandCollapse, this.collapseExpandPagedchilds);
        this.parent.off(pagingActions, this.pageAction);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Page$$1.prototype.getModuleName = function () {
        return 'pager';
    };
    /**
     * Refreshes the page count, pager information, and external message.
     * @return {void}
     */
    Page$$1.prototype.refresh = function () {
        this.parent.grid.pagerModule.refresh();
    };
    /**
     * To destroy the pager
     * @return {void}
     * @hidden
     */
    Page$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * Navigates to the target page according to the given number.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    Page$$1.prototype.goToPage = function (pageNo) {
        this.parent.grid.pagerModule.goToPage(pageNo);
    };
    /**
     * Defines the text of the external message.
     * @param  {string} message - Defines the message to update.
     * @return {void}
     */
    Page$$1.prototype.updateExternalMessage = function (message) {
        this.parent.grid.pagerModule.updateExternalMessage(message);
    };
    /**
     * @hidden
     */
    Page$$1.prototype.collapseExpandPagedchilds = function (rowDetails) {
        rowDetails.record.expanded = rowDetails.action === 'collapse' ? false : true;
        var ret = {
            result: this.parent.flatData,
            row: rowDetails.row,
            action: rowDetails.action,
            record: rowDetails.record,
            count: this.parent.flatData.length
        };
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret);
    };
    Page$$1.prototype.pageRoot = function (pagedResults, temp, result) {
        var newResults = isNullOrUndefined(result) ? [] : result;
        var _loop_1 = function (t) {
            newResults.push(temp[t]);
            var res = [];
            if (temp[t].hasChildRecords) {
                res = pagedResults.filter(function (e) {
                    return temp[t].uniqueID === e.parentUniqueID;
                });
                newResults = this_1.pageRoot(pagedResults, res, newResults);
            }
        };
        var this_1 = this;
        for (var t = 0; t < temp.length; t++) {
            _loop_1(t);
        }
        return newResults;
    };
    Page$$1.prototype.pageAction = function (pageingDetails) {
        var _this = this;
        var dm = new DataManager(pageingDetails.result);
        if (this.parent.pageSettings.pageSizeMode === 'Root') {
            var temp = [];
            var propname = (this.parent.grid.filterSettings.columns.length > 0) &&
                (this.parent.filterSettings.hierarchyMode === 'Child' || this.parent.filterSettings.hierarchyMode === 'None') ?
                'filterLevel' : 'level';
            var query = new Query().where(propname, 'equal', 0);
            temp = dm.executeLocal(query);
            pageingDetails.count = temp.length;
            var size = this.parent.grid.pageSettings.pageSize;
            var current = this.parent.grid.pageSettings.currentPage;
            var skip = size * (current - 1);
            query = query.skip(skip).take(size);
            temp = dm.executeLocal(query);
            var newResults = this.pageRoot(pageingDetails.result, temp);
            pageingDetails.result = newResults;
        }
        else {
            var dm_1 = new DataManager(pageingDetails.result);
            var expanded$$1 = new Predicate$1('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
            var parents_1 = dm_1.executeLocal(new Query().where(expanded$$1));
            var visualData = parents_1.filter(function (e) {
                return getExpandStatus(_this.parent, e, parents_1);
            });
            pageingDetails.count = visualData.length;
            var query = new Query();
            var size = this.parent.grid.pageSettings.pageSize;
            var current = this.parent.grid.pageSettings.currentPage;
            var skip = size * (current - 1);
            query = query.skip(skip).take(size);
            dm_1.dataSource.json = visualData;
            pageingDetails.result = dm_1.executeLocal(query);
        }
        this.parent.notify('updateAction', pageingDetails);
    };
    return Page$$1;
}());

/**
 * Toolbar Module for TreeGrid
 * @hidden
 */
var Toolbar$1 = /** @__PURE__ @class */ (function () {
    function Toolbar$$1(parent) {
        Grid.Inject(Toolbar);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Toolbar$$1.prototype.getModuleName = function () {
        return 'toolbar';
    };
    /**
     * @hidden
     */
    Toolbar$$1.prototype.addEventListener = function () {
        this.parent.on(toolbarClick, this.toolbarClickHandler, this);
    };
    /**
     * @hidden
     */
    Toolbar$$1.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(toolbarClick, this.toolbarClickHandler);
    };
    Toolbar$$1.prototype.toolbarClickHandler = function (args) {
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
    };
    /**
     * Gets the toolbar of the TreeGrid.
     * @return {Element}
     * @hidden
     */
    Toolbar$$1.prototype.getToolbar = function () {
        return this.parent.grid.toolbarModule.getToolbar();
    };
    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @return {void}
     * @hidden
     */
    Toolbar$$1.prototype.enableItems = function (items, isEnable) {
        this.parent.grid.toolbarModule.enableItems(items, isEnable);
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    Toolbar$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    return Toolbar$$1;
}());

/**
 * TreeGrid Aggregate module
 * @hidden
 */
var Aggregate$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Aggregate module
     */
    function Aggregate$$1(parent) {
        Grid.Inject(Aggregate);
        this.parent = parent;
        this.flatChildRecords = [];
        this.summaryQuery = [];
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Aggregate$$1.prototype.getModuleName = function () {
        return 'summary';
    };
    Aggregate$$1.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
    };
    /**
     * Function to calculate summary values
     *  @hidden
     */
    Aggregate$$1.prototype.calculateSummaryValue = function (summaryQuery, filteredData, isSort) {
        this.summaryQuery = summaryQuery;
        var parentRecord;
        var parentDataLength = Object.keys(filteredData).length;
        var parentData;
        parentData = [];
        for (var p = 0, len = parentDataLength; p < len; p++) {
            var summaryRow = getObject('isSummaryRow', filteredData[p]);
            if (!summaryRow) {
                parentData.push(filteredData[p]);
            }
        }
        var parentRecords = findParentRecords(parentData);
        var flatRecords;
        flatRecords = parentData.slice();
        var columnLength = Object.keys(this.parent.columns).length;
        var summaryLength = Object.keys(this.parent.aggregates).length;
        var dataLength = Object.keys(parentRecords).length;
        var childRecordsLength;
        for (var i = 0, len = dataLength; i < len; i++) {
            parentRecord = parentRecords[i];
            childRecordsLength = this.getChildRecordsLength(parentRecord, flatRecords);
            var _loop_1 = function (summaryRowIndex, len_1) {
                var item = void 0;
                item = {};
                for (var columnIndex = 0, len_2 = columnLength; columnIndex < len_2; columnIndex++) {
                    var field = isNullOrUndefined(getObject('field', this_1.parent.columns[columnIndex])) ?
                        this_1.parent.columns[columnIndex] : getObject('field', this_1.parent.columns[columnIndex]);
                    item[field] = null;
                }
                if (this_1.parent.aggregates[summaryRowIndex - 1].showChildSummary) {
                    item = this_1.createSummaryItem(item, this_1.parent.aggregates[summaryRowIndex - 1]);
                    var idx_1;
                    flatRecords.map(function (e, i) { if (e.uniqueID === parentRecord.uniqueID) {
                        idx_1 = i;
                        return;
                    } });
                    var currentIndex = idx_1 + childRecordsLength + summaryRowIndex;
                    var summaryParent = extend({}, parentRecord);
                    delete summaryParent.childRecords;
                    delete summaryParent[this_1.parent.childMapping];
                    setValue('parentItem', summaryParent, item);
                    var level = getObject('level', summaryParent);
                    setValue('level', level + 1, item);
                    var index = getObject('index', summaryParent);
                    setValue('isSummaryRow', true, item);
                    if (isSort) {
                        var childRecords = getObject('childRecords', parentRecord);
                        childRecords.push(item);
                    }
                    flatRecords.splice(currentIndex, 0, item);
                }
                else {
                    return "continue";
                }
            };
            var this_1 = this;
            for (var summaryRowIndex = 1, len_1 = summaryLength; summaryRowIndex <= len_1; summaryRowIndex++) {
                _loop_1(summaryRowIndex, len_1);
            }
            this.flatChildRecords = [];
        }
        return flatRecords;
    };
    Aggregate$$1.prototype.getChildRecordsLength = function (parentData, flatData) {
        var recordLength = Object.keys(flatData).length;
        var record;
        for (var i = 0, len = recordLength; i < len; i++) {
            record = flatData[i];
            var parent_1 = isNullOrUndefined(record.parentItem) ? null :
                flatData.filter(function (e) { return e.uniqueID === record.parentItem.uniqueID; })[0];
            if (parentData === parent_1) {
                this.flatChildRecords.push(record);
                var hasChild = getObject('hasChildRecords', record);
                if (hasChild) {
                    this.getChildRecordsLength(record, flatData);
                }
                else {
                    continue;
                }
            }
        }
        return this.flatChildRecords.length;
    };
    Aggregate$$1.prototype.createSummaryItem = function (itemData, summary) {
        var summaryColumnLength = Object.keys(summary.columns).length;
        for (var i = 0, len = summaryColumnLength; i < len; i++) {
            var displayColumn = isNullOrUndefined(summary.columns[i].columnName) ? summary.columns[i].field :
                summary.columns[i].columnName;
            var keys = Object.keys(itemData);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (key === displayColumn) {
                    itemData[key] = this.getSummaryValues(summary.columns[i], this.flatChildRecords);
                }
                else {
                    continue;
                }
            }
        }
        return itemData;
    };
    Aggregate$$1.prototype.getSummaryValues = function (summaryColumn, summaryData) {
        var _this = this;
        var qry = new Query();
        var single;
        single = {};
        var helper = {};
        var type = !isNullOrUndefined(summaryColumn.field) ?
            this.parent.getColumnByField(summaryColumn.field).type : undefined;
        summaryColumn.setPropertiesSilent({ format: this.getFormatFromType(summaryColumn.format, type) });
        summaryColumn.setFormatter(this.parent.grid.locale);
        var formatFn = summaryColumn.getFormatter() || (function () { return function (a) { return a; }; })();
        summaryColumn.setTemplate(helper);
        var tempObj = summaryColumn.getTemplate(2);
        qry.queries = this.summaryQuery;
        qry.requiresCount();
        var sumData = new DataManager(summaryData).executeLocal(qry);
        var types = summaryColumn.type;
        var summaryKey;
        types = [summaryColumn.type];
        types.forEach(function (type) {
            summaryKey = type;
            var key = summaryColumn.field + ' - ' + type.toLowerCase();
            var val = type !== 'Custom' ? getObject('aggregates', sumData) :
                calculateAggregate(type, sumData, summaryColumn, _this.parent);
            var disp = summaryColumn.columnName;
            var value = type !== 'Custom' ? val[key] : val;
            single[disp] = single[disp] || {};
            single[disp][key] = value;
            single[disp][type] = !isNullOrUndefined(val) ? formatFn(value) : ' ';
        });
        helper.format = summaryColumn.getFormatter();
        var cellElement = createElement('td', {
            className: 'e-summary'
        });
        appendChildren(cellElement, tempObj.fn(single[summaryColumn.columnName], this.parent, tempObj.property));
        var value = single[summaryColumn.columnName][summaryKey];
        var summaryValue;
        if (cellElement.innerHTML.indexOf(value) === -1) {
            summaryValue = cellElement.innerHTML + value;
            return summaryValue;
        }
        else {
            return cellElement.innerHTML;
        }
    };
    Aggregate$$1.prototype.getFormatFromType = function (summaryformat, type) {
        if (isNullOrUndefined(type) || typeof summaryformat !== 'string') {
            return summaryformat;
        }
        var obj;
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
    };
    /**
     * To destroy the Aggregate module
     * @return {void}
     * @hidden
     */
    Aggregate$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    return Aggregate$$1;
}());

/**
 * ContextMenu Module for TreeGrid
 * @hidden
 */
var ContextMenu$1 = /** @__PURE__ @class */ (function () {
    function ContextMenu$$1(parent) {
        Grid.Inject(ContextMenu);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    ContextMenu$$1.prototype.addEventListener = function () {
        this.parent.on('contextMenuOpen', this.contextMenuOpen, this);
        this.parent.on('contextMenuClick', this.contextMenuClick, this);
    };
    /**
     * @hidden
     */
    ContextMenu$$1.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('contextMenuOpen', this.contextMenuOpen);
        this.parent.off('contextMenuClick', this.contextMenuClick);
    };
    ContextMenu$$1.prototype.contextMenuOpen = function (args) {
        var addRow = args.element.querySelector('#' + this.parent.element.id + '_gridcontrol_cmenu_AddRow');
        if (addRow) {
            if (this.parent.grid.editSettings.allowAdding === false) {
                addRow.style.display = 'none';
            }
            else {
                addRow.style.display = 'block';
            }
        }
    };
    ContextMenu$$1.prototype.contextMenuClick = function (args) {
        if (args.item.id === 'Above' || args.item.id === 'Below') {
            this.parent.notify('savePreviousRowPosition', args);
            this.parent.setProperties({ editSettings: { newRowPosition: args.item.id } }, true);
            this.parent.addRecord();
        }
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    ContextMenu$$1.prototype.getModuleName = function () {
        return 'contextMenu';
    };
    /**
     * Destroys the ContextMenu.
     * @method destroy
     * @return {void}
     */
    ContextMenu$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * Gets the context menu element from the TreeGrid.
     * @return {Element}
     */
    ContextMenu$$1.prototype.getContextMenu = function () {
        return this.parent.grid.contextMenuModule.getContextMenu();
    };
    return ContextMenu$$1;
}());

/**
 * TreeGrid Edit Module
 * The `Edit` module is used to handle editing actions.
 */
var Edit$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Edit module
     */
    function Edit$$1(parent) {
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
    Edit$$1.prototype.getModuleName = function () {
        return 'edit';
    };
    /**
     * @hidden
     */
    Edit$$1.prototype.addEventListener = function () {
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
    };
    /**
     * @hidden
     */
    Edit$$1.prototype.removeEventListener = function () {
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
    };
    /**
     * To destroy the editModule
     * @return {void}
     * @hidden
     */
    Edit$$1.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * @hidden
     */
    Edit$$1.prototype.applyFormValidation = function (cols) {
        this.parent.grid.editModule.applyFormValidation(cols);
    };
    Edit$$1.prototype.recordDoubleClick = function (args) {
        var target = args.target;
        this.doubleClickTarget = target;
        var column = this.parent.grid.getColumnByIndex(+target.closest('td').getAttribute('aria-colindex'));
        if (this.parent.editSettings.mode === 'Cell' && !this.isOnBatch && column && !column.isPrimaryKey &&
            column.allowEditing && !(target.classList.contains('e-treegridexpand') ||
            target.classList.contains('e-treegridcollapse'))) {
            this.isOnBatch = true;
            this.parent.grid.setProperties({ selectedRowIndex: args.rowIndex }, true);
            this.updateGridEditMode('Batch');
        }
    };
    Edit$$1.prototype.updateGridEditMode = function (mode) {
        this.parent.grid.setProperties({ editSettings: { mode: mode } }, true);
        var updateMethod = getObject('updateEditObj', this.parent.grid.editModule);
        updateMethod.apply(this.parent.grid.editModule);
        this.parent.grid.isEdit = false;
    };
    Edit$$1.prototype.keyPressed = function (args) {
        if (this.isOnBatch) {
            this.keyPress = args.action;
        }
    };
    Edit$$1.prototype.cellEdit = function (args) {
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
    };
    Edit$$1.prototype.enableToolbarItems = function (request) {
        if (!isNullOrUndefined(this.parent.grid.toolbarModule)) {
            var toolbarID = this.parent.element.id + '_gridcontrol_';
            this.parent.grid.toolbarModule.enableItems([toolbarID + 'add', toolbarID + 'edit', toolbarID + 'delete'], request === 'save');
            this.parent.grid.toolbarModule.enableItems([toolbarID + 'update', toolbarID + 'cancel'], request === 'edit');
        }
    };
    Edit$$1.prototype.batchCancel = function (e) {
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
    };
    Edit$$1.prototype.cellSave = function (args) {
        if (this.parent.editSettings.mode === 'Cell') {
            args.cancel = true;
            setValue('isEdit', false, this.parent.grid);
            args.rowData[args.columnName] = args.value;
            var row = args.cell.parentNode;
            var rowIndex_1;
            var primaryKeys_1 = this.parent.getPrimaryKeyFieldNames();
            if (isNullOrUndefined(row)) {
                this.parent.grid.getCurrentViewRecords().filter(function (e, i) {
                    if (e[primaryKeys_1[0]] === args.rowData[primaryKeys_1[0]]) {
                        rowIndex_1 = i;
                        return;
                    }
                });
            }
            else {
                rowIndex_1 = row.rowIndex;
            }
            row = this.parent.grid.getRows()[rowIndex_1];
            this.parent.grid.editModule.updateRow(rowIndex_1, args.rowData);
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
            var saveArgs = {
                type: 'save', column: this.parent.getColumnByField(args.columnName), data: args.rowData,
                previousData: args.previousValue, row: row, target: args.cell
            };
            this.parent.trigger(actionComplete, saveArgs);
        }
    };
    Edit$$1.prototype.beginAdd = function (args) {
        var position;
        var index = this.addRowIndex;
        var records = this.parent.grid.getCurrentViewRecords();
        var rows = this.parent.grid.getDataRows();
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
                var focussedElement = document.activeElement;
                rows[index + 1][position](rows[0]);
                if (this.parent.editSettings.mode === 'Row' || this.parent.editSettings.mode === 'Cell') {
                    var errors = this.parent.grid.getContentTable().querySelectorAll('.e-griderror');
                    for (var i = 0; i < errors.length; i++) {
                        errors[i].remove();
                    }
                    setValue('errorRules', [], this.parent.grid.editModule.formObj);
                }
                focussedElement.focus();
            }
        }
    };
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
    Edit$$1.prototype.beginEdit = function (args) {
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
            var data = args.data;
            for (var i = 0; i < data.length; i++) {
                args.data = data.concat(findChildrenRecords(data[i]));
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
    };
    Edit$$1.prototype.savePreviousRowPosition = function (args) {
        if (this.previousNewRowPosition === null) {
            this.previousNewRowPosition = this.parent.editSettings.newRowPosition;
        }
    };
    Edit$$1.prototype.beginAddEdit = function (args) {
        var value = args.data;
        if (args.action === 'add') {
            var key = this.parent.grid.getPrimaryKeyFieldNames()[0];
            var position = null;
            // let currentData: ITreeData[] = this.batchRecords.length ? this.batchRecords :
            //            <ITreeData[]>this.parent.grid.getCurrentViewRecords();
            var currentData = this.parent.grid.getCurrentViewRecords();
            var index = this.addRowIndex;
            value.uniqueID = getUid(this.parent.element.id + '_data_');
            var level = void 0;
            var dataIndex = void 0;
            var idMapping = void 0;
            var parentUniqueID = void 0;
            var parentItem = void 0;
            var parentIdMapping = void 0;
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
                    var dataSource = (this.parent.grid.dataSource instanceof DataManager ?
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
    };
    Edit$$1.prototype.addAction = function (details, treeData) {
        var value;
        var isSkip = false;
        var currentViewRecords = this.parent.grid.getCurrentViewRecords();
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
    };
    Edit$$1.prototype.editAction = function (details, columnName) {
        var _this = this;
        var value = details.value;
        var action = details.action;
        if (action === 'save') {
            action = 'edit';
        }
        var i;
        var j;
        var key = this.parent.grid.getPrimaryKeyFieldNames()[0];
        var treeData = this.parent.dataSource instanceof DataManager ?
            this.parent.dataSource.dataSource.json : this.parent.dataSource;
        var modifiedData = [];
        var originalData = value;
        var isSkip = false;
        var currentViewRecords = this.parent.grid.getCurrentViewRecords();
        if (action === 'add') {
            var addAct = this.addAction(details, treeData);
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
            for (var k = 0; k < modifiedData.length; k++) {
                var keys = Object.keys(modifiedData[k]);
                i = treeData.length;
                var _loop_1 = function () {
                    if (treeData[i][key] === modifiedData[k][key]) {
                        if (action === 'delete') {
                            var currentData_1 = treeData[i];
                            treeData.splice(i, 1);
                            if (this_1.isSelfReference) {
                                if (!isNullOrUndefined(currentData_1[this_1.parent.parentIdMapping])) {
                                    var parentData = this_1.parent.flatData.filter(function (e) {
                                        return e[_this.parent.idMapping] === currentData_1[_this.parent.parentIdMapping];
                                    })[0];
                                    var childRecords = parentData ? parentData[this_1.parent.childMapping] : [];
                                    for (var p = childRecords.length - 1; p >= 0; p--) {
                                        if (childRecords[p][this_1.parent.idMapping] === currentData_1[this_1.parent.idMapping]) {
                                            childRecords.splice(p, 1);
                                            if (!childRecords.length) {
                                                parentData.hasChildRecords = false;
                                                this_1.updateParentRow(key, parentData, action);
                                            }
                                            break;
                                        }
                                    }
                                }
                                return "break";
                            }
                        }
                        else {
                            if (action === 'edit') {
                                for (j = 0; j < keys.length; j++) {
                                    if (treeData[i].hasOwnProperty(keys[j]) && (this_1.parent.editSettings.mode !== 'Cell' || keys[j] === columnName)) {
                                        treeData[i][keys[j]] = modifiedData[k][keys[j]];
                                    }
                                }
                            }
                            else if (action === 'add') {
                                var index = void 0;
                                if (this_1.parent.editSettings.newRowPosition === 'Child') {
                                    if (this_1.isSelfReference) {
                                        originalData[this_1.parent.parentIdMapping] = treeData[i][this_1.parent.idMapping];
                                        treeData.splice(i + 1, 0, originalData);
                                    }
                                    else {
                                        if (!treeData[i].hasOwnProperty(this_1.parent.childMapping)) {
                                            treeData[i][this_1.parent.childMapping] = [];
                                        }
                                        treeData[i][this_1.parent.childMapping].push(originalData);
                                        this_1.updateParentRow(key, treeData[i], action);
                                    }
                                }
                                else if (this_1.parent.editSettings.newRowPosition === 'Below') {
                                    treeData.splice(i + 1, 0, originalData);
                                }
                                else if (!this_1.addRowIndex) {
                                    index = 0;
                                    treeData.splice(index, 0, originalData);
                                }
                                else if (this_1.parent.editSettings.newRowPosition === 'Above') {
                                    treeData.splice(i, 0, originalData);
                                }
                            }
                            return "break";
                        }
                    }
                    else if (!isNullOrUndefined(treeData[i][this_1.parent.childMapping])) {
                        if (this_1.removeChildRecords(treeData[i][this_1.parent.childMapping], modifiedData[k], action, key, originalData, columnName)) {
                            this_1.updateParentRow(key, treeData[i], action);
                        }
                    }
                };
                var this_1 = this;
                while (i-- && i >= 0) {
                    var state_1 = _loop_1();
                    if (state_1 === "break")
                        break;
                }
            }
        }
        if (action === 'add' && this.previousNewRowPosition != null) {
            this.parent.setProperties({ editSettings: { newRowPosition: this.previousNewRowPosition } }, true);
            this.previousNewRowPosition = null;
        }
    };
    Edit$$1.prototype.removeChildRecords = function (childRecords, modifiedData, action, key, originalData, columnName) {
        var isChildAll = false;
        var j = childRecords.length;
        while (j-- && j >= 0) {
            if (childRecords[j][key] === modifiedData[key] ||
                (this.isSelfReference && childRecords[j][this.parent.parentIdMapping] === modifiedData[this.parent.idMapping])) {
                if (action === 'edit') {
                    var keys = Object.keys(modifiedData);
                    for (var i = 0; i < keys.length; i++) {
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
                    var parentItem = childRecords[j].parentItem;
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
    };
    Edit$$1.prototype.updateParentRow = function (key, record, action, child) {
        var currentRecords = this.parent.grid.getCurrentViewRecords();
        var index;
        currentRecords.map(function (e, i) { if (e[key] === record[key]) {
            index = i;
            return;
        } });
        record = currentRecords[index];
        record.hasChildRecords = false;
        if (action === 'add') {
            record.expanded = true;
            record.hasChildRecords = true;
            var childRecords = child ? child : currentRecords[index + 1];
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
        var row = this.parent.getRowByIndex(index);
        this.parent.renderModule.cellRender({ data: record, cell: row.cells[this.parent.treeColumnIndex],
            column: this.parent.grid.getColumns()[this.parent.treeColumnIndex] });
    };
    /**
     * Checks the status of validation at the time of editing. If validation is passed, it returns true.
     * @return {boolean}
     */
    Edit$$1.prototype.editFormValidate = function () {
        return this.parent.grid.editModule.editFormValidate();
    };
    /**
     * @hidden
     */
    Edit$$1.prototype.destroyForm = function () {
        this.parent.grid.editModule.destroyForm();
    };
    return Edit$$1;
}());

/**
 * Command Column Module for TreeGrid
 * @hidden
 */
var CommandColumn$1 = /** @__PURE__ @class */ (function () {
    function CommandColumn$$1(parent) {
        Grid.Inject(CommandColumn);
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    CommandColumn$$1.prototype.getModuleName = function () {
        return 'commandColumn';
    };
    /**
     * Destroys the ContextMenu.
     * @method destroy
     * @return {void}
     */
    CommandColumn$$1.prototype.destroy = function () {
        //this.removeEventListener();
    };
    return CommandColumn$$1;
}());

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
//# sourceMappingURL=ej2-treegrid.es5.js.map
