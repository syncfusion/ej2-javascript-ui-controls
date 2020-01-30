import { Browser, ChildProperty, Collection, Complex, Component, Draggable, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Property, Touch, addClass, append, classList, closest, compile, createElement, extend, formatUnit, isNullOrUndefined, remove, removeClass } from '@syncfusion/ej2-base';
import { Popup, Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { TreeView } from '@syncfusion/ej2-navigations';

/**
 * Kanban Constants
 */
// Constants for public events 
/** @hidden */
var actionBegin = 'actionBegin';
/** @hidden */
var actionComplete = 'actionComplete';
/** @hidden */
var actionFailure = 'actionFailure';
/** @hidden */
var cardClick = 'cardClick';
/** @hidden */
var cardDoubleClick = 'cardDoubleClick';
/** @hidden */
var cardRendered = 'cardRendered';
/** @hidden */
var columnRendered = 'columnRendered';
/** @hidden */
var dataBinding = 'dataBinding';
/** @hidden */
var dataBound = 'dataBound';
/** @hidden */
var dragStart = 'dragStart';
/** @hidden */
var drag = 'drag';
/** @hidden */
var dragStop = 'dragStop';
/** @hidden */
var documentClick = 'document-click';
// Constants for internal events
/** @hidden */
var contentReady = 'content-ready';
/** @hidden */
var dataReady = 'data-ready';
/** @hidden */
var bottomSpace = 25;
/** @hidden */
var cardSpace = 16;
/** @hidden */
var toggleWidth = 50;

/**
 * data module is used to generate query and data source.
 * @hidden
 */
var Data = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for data module
     * @private
     */
    function Data(parent) {
        this.parent = parent;
        this.initDataManager(parent.dataSource, parent.query);
        this.refreshDataManager();
    }
    /**
     * The function used to initialize dataManager and query
     * @return {void}
     * @private
     */
    Data.prototype.initDataManager = function (dataSource, query) {
        this.dataManager = dataSource instanceof DataManager ? dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
    };
    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    Data.prototype.generateQuery = function () {
        return this.query.clone();
    };
    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    Data.prototype.getData = function (query) {
        return this.dataManager.executeQuery(query);
    };
    /**
     * The function is used to send the request and get response form datamanager
     * @return {void}
     * @private
     */
    Data.prototype.refreshDataManager = function () {
        var _this = this;
        var dataManager = this.getData(this.generateQuery());
        dataManager.then(function (e) { return _this.dataManagerSuccess(e); }).catch(function (e) { return _this.dataManagerFailure(e); });
    };
    /**
     * The function is used to handle the success response from dataManager
     * @return {void}
     * @private
     */
    Data.prototype.dataManagerSuccess = function (e) {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(dataBinding, e, function (args) {
            var resultData = extend([], args.result, null, true);
            _this.parent.kanbanData = resultData;
            _this.parent.notify(dataReady, { processedData: resultData });
            _this.parent.trigger(dataBound, null, function () { return _this.parent.hideSpinner(); });
        });
    };
    /**
     * The function is used to handle the failure response from dataManager
     * @return {void}
     * @private
     */
    Data.prototype.dataManagerFailure = function (e) {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(actionFailure, { error: e }, function () { return _this.parent.hideSpinner(); });
    };
    return Data;
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
 * Holds the configuration of swimlane settings in kanban board.
 */
var SwimlaneSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(SwimlaneSettings, _super);
    function SwimlaneSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property()
    ], SwimlaneSettings.prototype, "keyField", void 0);
    __decorate$1([
        Property()
    ], SwimlaneSettings.prototype, "textField", void 0);
    __decorate$1([
        Property(false)
    ], SwimlaneSettings.prototype, "showEmptyRow", void 0);
    __decorate$1([
        Property(true)
    ], SwimlaneSettings.prototype, "showItemCount", void 0);
    __decorate$1([
        Property(false)
    ], SwimlaneSettings.prototype, "allowDragAndDrop", void 0);
    __decorate$1([
        Property()
    ], SwimlaneSettings.prototype, "template", void 0);
    __decorate$1([
        Property('Ascending')
    ], SwimlaneSettings.prototype, "sortBy", void 0);
    return SwimlaneSettings;
}(ChildProperty));

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
 * Holds the configuration of card settings in kanban board.
 */
var CardSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(CardSettings, _super);
    function CardSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property(true)
    ], CardSettings.prototype, "showHeader", void 0);
    __decorate$2([
        Property()
    ], CardSettings.prototype, "headerField", void 0);
    __decorate$2([
        Property()
    ], CardSettings.prototype, "contentField", void 0);
    __decorate$2([
        Property()
    ], CardSettings.prototype, "template", void 0);
    __decorate$2([
        Property('Single')
    ], CardSettings.prototype, "selectionType", void 0);
    return CardSettings;
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
 * Holds the configuration of columns in kanban board.
 */
var Columns = /** @__PURE__ @class */ (function (_super) {
    __extends$3(Columns, _super);
    function Columns() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        Property()
    ], Columns.prototype, "keyField", void 0);
    __decorate$3([
        Property()
    ], Columns.prototype, "headerText", void 0);
    __decorate$3([
        Property()
    ], Columns.prototype, "template", void 0);
    __decorate$3([
        Property(false)
    ], Columns.prototype, "allowToggle", void 0);
    __decorate$3([
        Property(true)
    ], Columns.prototype, "isExpanded", void 0);
    __decorate$3([
        Property()
    ], Columns.prototype, "minCount", void 0);
    __decorate$3([
        Property()
    ], Columns.prototype, "maxCount", void 0);
    __decorate$3([
        Property(false)
    ], Columns.prototype, "showItemCount", void 0);
    return Columns;
}(ChildProperty));

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
 * Holds the configuration of stacked header settings in kanban board.
 */
var StackedHeaders = /** @__PURE__ @class */ (function (_super) {
    __extends$4(StackedHeaders, _super);
    function StackedHeaders() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        Property()
    ], StackedHeaders.prototype, "text", void 0);
    __decorate$4([
        Property()
    ], StackedHeaders.prototype, "keyFields", void 0);
    return StackedHeaders;
}(ChildProperty));

/**
 * Kanban CSS Constants
 */
/** @hidden */
var ROOT_CLASS = 'e-kanban';
/** @hidden */
var RTL_CLASS = 'e-rtl';
/** @hidden */
var DEVICE_CLASS = 'e-device';
/** @hidden */
var ICON_CLASS = 'e-icons';
/** @hidden */
var TEMPLATE_CLASS = 'e-template';
/** @hidden */
var SWIMLANE_CLASS = 'e-swimlane';
/** @hidden */
var TABLE_CLASS = 'e-kanban-table';
/** @hidden */
var HEADER_CLASS = 'e-kanban-header';
/** @hidden */
var HEADER_TABLE_CLASS = 'e-header-table';
/** @hidden */
var HEADER_CELLS_CLASS = 'e-header-cells';
/** @hidden */
var HEADER_WRAP_CLASS = 'e-header-wrap';
/** @hidden */
var HEADER_TEXT_CLASS = 'e-header-text';
/** @hidden */
var HEADER_ICON_CLASS = 'e-header-icon';
/** @hidden */
var CONTENT_CELLS_CLASS = 'e-content-cells';
/** @hidden */
var CONTENT_CLASS = 'e-kanban-content';
/** @hidden */
var CONTENT_TABLE_CLASS = 'e-content-table';
/** @hidden */
var HEADER_ROW_TOGGLE_CLASS = 'e-toggle-header';
/** @hidden */
var HEADER_ROW_CLASS = 'e-header-row';
/** @hidden */
var CONTENT_ROW_CLASS = 'e-content-row';
/** @hidden */
var SWIMLANE_ROW_CLASS = 'e-swimlane-row';
/** @hidden */
var SWIMLANE_ROW_EXPAND = 'e-swimlane-row-expand';
/** @hidden */
var SWIMLANE_ROW_COLLAPSE = 'e-swimlane-row-collapse';
/** @hidden */
var SWIMLANE_ROW_TEXT = 'e-swimlane-text';
/** @hidden */
var SWIMLANE_ITEM_COUNT = 'e-swimlane-item-count';
/** @hidden */
var CARD_WRAPPER_CLASS = 'e-card-wrapper';
/** @hidden */
var CARD_CLASS = 'e-card';
/** @hidden */
var CARD_HEADER_CLASS = 'e-card-header';
/** @hidden */
var CARD_CONTENT_CLASS = 'e-card-content';
/** @hidden */
var CARD_HEADER_TEXT_CLASS = 'e-card-header-caption';
/** @hidden */
var CARD_CONTENT_TEXT_CLASS = 'e-card-content-caption';
/** @hidden */
var COLUMN_EXPAND = 'e-column-expand';
/** @hidden */
var COLUMN_COLLAPSE = 'e-column-collapse';
/** @hidden */
var COLLAPSE_HEADER_TEXT = 'e-collapse-header-text';
/** @hidden */
var COLLAPSED_CLASS = 'e-collapsed';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var DRAGGED_CLONE = 'e-target-dragged-clone';
/** @hidden */
var DRAGGED_CARD = 'e-kanban-dragged-card';
/** @hidden */
var DROPPED_CLONE = 'e-target-dropped-clone';
/** @hidden */
var DROPPING = 'e-dropping';
/** @hidden */
var TOGGLE_VISIBLE = 'e-toggle-visible';
/** @hidden */
var MULTI_CLONE_CARD = 'e-multi-clone-card';
/** @hidden */
var MULTI_CLONE_CONTENT_CELL = 'e-multi-content-cell';
/** @hidden */
var MULTI_ACTIVE = 'e-multi-active';
/** @hidden */
var TARGET_MULTI_CLONE = 'e-target-multi-clone';
/** @hidden */
var MULTI_COLUMN_KEY = 'e-column-key';
/** @hidden */
var CARD_SELECTION = 'e-selection';
/** @hidden */
var TOOLTIP_CLASS = 'e-kanban-tooltip';
/** @hidden */
var TOOLTIP_TEXT = 'e-tooltip-text';
/** @hidden */

/** @hidden */
var SWIMLANE_HEADER = 'e-swimlane-header';
/** @hidden */
var SWIMLANE_HEADER_TOOLBAR = 'e-swimlane-header-toolbar';
/** @hidden */
var TOOLBAR_MENU = 'e-toolbar-menu';
/** @hidden */
var TOOLBAR_MENU_ICON = 'e-icon-menu';
/** @hidden */
var TOOLBAR_LEVEL_TITLE = 'e-toolbar-level-title';
/** @hidden */
var TOOLBAR_SWIMLANE_NAME = 'e-toolbar-swimlane-name';
/** @hidden */
var SWIMLANE_OVERLAY = 'e-swimlane-overlay';
/** @hidden */
var SWIMLANE_CONTENT = 'e-swimlane-content';
/** @hidden */
var SWIMLANE_RESOURCE = 'e-swimlane-resource';
/** @hidden */
var SWIMLANE_TREE = 'e-swimlane-tree';
/** @hidden */
var LIMITS_CLASS = 'e-limits';
/** @hidden */
var MAX_COUNT_CLASS = 'e-max-count';
/** @hidden */
var MIN_COUNT_CLASS = 'e-min-count';
/** @hidden */
var TOTAL_CARD = 'e-total-card';
/** @hidden */
var HIDE_LIMITS = 'e-hide-limits';
/** @hidden */
var MAX_COLOR = 'e-max-color';
/** @hidden */
var MIN_COLOR = 'e-min-color';

/**
 * Action module is used to perform card actions.
 * @hidden
 */
var Action = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for action module
     * @private
     */
    function Action(parent) {
        this.parent = parent;
        this.swimlaneToggleArray = [];
        this.columnToggleArray = [];
        this.selectionArray = [];
        this.lastCardSelection = null;
        this.lastSelectionRow = null;
        this.lastCard = null;
        this.selectedCardsElement = [];
        this.selectedCardsData = [];
        this.hideColumnKeys = [];
    }
    Action.prototype.cardClick = function (e) {
        var _this = this;
        var target = closest(e.target, '.' + CARD_CLASS);
        var cardClickObj = this.parent.getCardDetails(target);
        this.parent.activeCardData = { data: cardClickObj, element: target };
        var args = { data: cardClickObj, element: target, cancel: false };
        this.parent.trigger(cardClick, args, function (clickArgs) {
            if (!clickArgs.cancel) {
                _this.cardSelection(target, e.ctrlKey, e.shiftKey);
            }
        });
    };
    Action.prototype.cardDoubleClick = function (e) {
        var target = closest(e.target, '.' + CARD_CLASS);
        var cardDoubleClickObj = this.parent.getCardDetails(target);
        this.parent.activeCardData = { data: cardDoubleClickObj, element: target };
        var args = { data: cardDoubleClickObj, element: target, cancel: false };
        this.parent.trigger(cardDoubleClick, args);
    };
    Action.prototype.rowExpandCollapse = function (e) {
        var _this = this;
        var args = { cancel: false, target: e.target, requestType: 'rowExpandCollapse' };
        this.parent.trigger(actionBegin, args, function (actionArgs) {
            if (!actionArgs.cancel) {
                var target = closest(e.target, '.' + SWIMLANE_ROW_CLASS);
                var tgtRow = _this.parent.element.querySelector('.' + CONTENT_ROW_CLASS + (":nth-child(" + (target.rowIndex + 2) + ")"));
                var targetIcon = target.querySelector('.' + SWIMLANE_ROW_EXPAND + ',.' + SWIMLANE_ROW_COLLAPSE);
                if (target.classList.contains(COLLAPSED_CLASS)) {
                    removeClass([tgtRow, target], COLLAPSED_CLASS);
                    classList(targetIcon, [SWIMLANE_ROW_EXPAND], [SWIMLANE_ROW_COLLAPSE]);
                    _this.swimlaneToggleArray.splice(_this.swimlaneToggleArray.indexOf(target.getAttribute('data-key')), 1);
                }
                else {
                    addClass([tgtRow, target], COLLAPSED_CLASS);
                    classList(targetIcon, [SWIMLANE_ROW_COLLAPSE], [SWIMLANE_ROW_EXPAND]);
                    _this.swimlaneToggleArray.push(target.getAttribute('data-key'));
                }
                _this.parent.notify(contentReady, {});
                _this.parent.trigger(actionComplete, { target: e.target, requestType: 'rowExpandCollapse' });
            }
        });
    };
    Action.prototype.columnExpandCollapse = function (e) {
        var _this = this;
        var headerTarget = (e instanceof HTMLElement) ? e : e.target;
        var args = { cancel: false, target: headerTarget, requestType: 'columnExpandCollapse' };
        this.parent.trigger(actionBegin, args, function (actionArgs) {
            if (!actionArgs.cancel) {
                var target = closest(headerTarget, '.' + HEADER_CELLS_CLASS);
                var colIndex = target.cellIndex;
                _this.columnToggle(target);
                var collapsed = _this.parent.element.querySelectorAll("." + HEADER_CELLS_CLASS + "." + COLLAPSED_CLASS).length;
                if (collapsed === (_this.parent.columns.length - _this.hideColumnKeys.length)) {
                    var nextColIndex = (colIndex + 1 === collapsed) ? 0 : colIndex + 1;
                    var headerSelector = "." + HEADER_CELLS_CLASS + ":not(.e-stacked-header-cell):nth-child(" + (nextColIndex + 1) + ")";
                    var nextCol = _this.parent.element.querySelector(headerSelector);
                    addClass([nextCol], COLLAPSED_CLASS);
                    _this.columnToggle(nextCol);
                }
                _this.parent.notify(contentReady, {});
                _this.parent.trigger(actionComplete, { target: headerTarget, requestType: 'columnExpandCollapse' });
            }
        });
    };
    Action.prototype.columnToggle = function (target) {
        var _this = this;
        var colIndex = target.cellIndex;
        var headerLimits = target.querySelector('.' + LIMITS_CLASS);
        var targetRow = [].slice.call(this.parent.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)'));
        var colSelector = ".e-header-table col:nth-child(" + (colIndex + 1) + "),.e-content-table col:nth-child(" + (colIndex + 1) + ")";
        var targetIcon = target.querySelector('.' + COLUMN_EXPAND + ',.' + COLUMN_COLLAPSE);
        var colGroup = [].slice.call(this.parent.element.querySelectorAll(colSelector));
        if (target.classList.contains(COLLAPSED_CLASS)) {
            removeClass(colGroup, COLLAPSED_CLASS);
            if (this.parent.isAdaptive) {
                colGroup.forEach(function (col) {
                    col.style.width = formatUnit(_this.parent.layoutModule.getWidth());
                });
            }
            classList(targetIcon, [COLUMN_EXPAND], [COLUMN_COLLAPSE]);
            for (var _i = 0, targetRow_1 = targetRow; _i < targetRow_1.length; _i++) {
                var row = targetRow_1[_i];
                var targetCol = row.querySelector("." + CONTENT_CELLS_CLASS + ":nth-child(" + (colIndex + 1) + ")");
                removeClass([targetCol, target], COLLAPSED_CLASS);
                remove(targetCol.querySelector('.' + COLLAPSE_HEADER_TEXT));
                var limitEle = targetCol.querySelector('.' + LIMITS_CLASS);
                if (limitEle) {
                    removeClass([limitEle], HIDE_LIMITS);
                }
            }
            this.columnToggleArray.splice(this.columnToggleArray.indexOf(target.getAttribute('data-key')), 1);
            if (headerLimits) {
                removeClass([headerLimits], HIDE_LIMITS);
            }
            this.parent.columns[colIndex].setProperties({ isExpanded: true }, true);
        }
        else {
            addClass(colGroup, COLLAPSED_CLASS);
            if (this.parent.isAdaptive) {
                colGroup.forEach(function (col) {
                    col.style.width = formatUnit(toggleWidth);
                });
            }
            classList(targetIcon, [COLUMN_COLLAPSE], [COLUMN_EXPAND]);
            for (var _a = 0, targetRow_2 = targetRow; _a < targetRow_2.length; _a++) {
                var row = targetRow_2[_a];
                var key = target.getAttribute('data-key');
                var targetCol = row.querySelector('.' + CONTENT_CELLS_CLASS + '[data-key="' + key + '"]');
                var index = targetCol.cellIndex;
                targetCol.appendChild(createElement('div', {
                    className: COLLAPSE_HEADER_TEXT,
                    innerHTML: this.parent.columns[index].headerText
                }));
                addClass([targetCol, target], COLLAPSED_CLASS);
                var limitEle = targetCol.querySelector('.' + LIMITS_CLASS);
                if (limitEle) {
                    addClass([limitEle], HIDE_LIMITS);
                }
            }
            if (headerLimits) {
                addClass([headerLimits], HIDE_LIMITS);
            }
            this.columnToggleArray.push(target.getAttribute('data-key'));
            this.parent.columns[colIndex].setProperties({ isExpanded: false }, true);
        }
    };
    Action.prototype.cardSelection = function (target, isCtrl, isShift) {
        var _this = this;
        if (!target) {
            return;
        }
        var cards = this.parent.getSelectedCards();
        if (this.parent.cardSettings.selectionType !== 'None') {
            var contentRow = closest(target, '.' + CONTENT_ROW_CLASS);
            var index = !isNullOrUndefined(this.lastSelectionRow) ? this.lastSelectionRow.rowIndex : contentRow.rowIndex;
            if (index !== contentRow.rowIndex && (isCtrl || isShift) && this.parent.cardSettings.selectionType === 'Multiple') {
                return;
            }
            if (cards.length !== 0 && (!isCtrl || this.parent.cardSettings.selectionType === 'Single')) {
                removeClass(cards, CARD_SELECTION);
                cards.forEach(function (el) {
                    _this.selectionArray.splice(_this.selectionArray.indexOf(el.getAttribute('data-id')), 1);
                    _this.selectedCardsElement.splice(_this.selectedCardsElement.indexOf(el), 1);
                    _this.selectedCardsData.splice(_this.selectedCardsData.indexOf(_this.parent.getCardDetails(el), 1));
                });
            }
            if (cards.length > 0 && isShift && this.parent.cardSettings.selectionType === 'Multiple') {
                var curCards_1 = [];
                var start = void 0;
                var end = void 0;
                var i = void 0;
                var allCards = [].slice.call(contentRow.querySelectorAll('.' + CARD_CLASS));
                allCards.forEach(function (el) { return curCards_1.push(el.getAttribute('data-id')); });
                var curId = target.getAttribute('data-id');
                var lastId = this.lastCard.getAttribute('data-id');
                var curIndex = end = curCards_1.indexOf(curId);
                var lastIndex = start = curCards_1.indexOf(lastId);
                var select = curIndex > lastIndex ? 'next' : 'prev';
                if (select === 'prev') {
                    start = curIndex;
                    end = lastIndex;
                }
                for (i = start; i <= end; i++) {
                    var card = allCards[i];
                    addClass([card], CARD_SELECTION);
                    this.selectionArray.push(card.getAttribute('data-id'));
                    this.selectedCardsElement.push(card);
                    this.selectedCardsData.push(this.parent.getCardDetails(card));
                    this.lastCardSelection = card;
                    if (select === 'prev') {
                        this.lastCardSelection = allCards[start];
                    }
                }
            }
            else {
                addClass([target], CARD_SELECTION);
                this.selectionArray.push(target.getAttribute('data-id'));
                this.selectedCardsElement.push(target);
                this.selectedCardsData.push(this.parent.getCardDetails(target));
                this.lastCard = this.lastCardSelection = target;
                this.lastSelectionRow = closest(target, '.' + CONTENT_ROW_CLASS);
            }
        }
    };
    Action.prototype.addColumn = function (columnOptions, index) {
        this.parent.columns.splice(index, 0, columnOptions);
        this.parent.notify(dataReady, { processedData: this.parent.kanbanData });
    };
    Action.prototype.deleteColumn = function (index) {
        var listKey = this.parent.element.querySelectorAll('.' + HEADER_CELLS_CLASS).item(index);
        if (listKey && listKey.classList.contains(HEADER_ROW_TOGGLE_CLASS)) {
            this.columnToggleArray.splice(this.columnToggleArray.indexOf(listKey.getAttribute('data-key'), 0));
        }
        this.parent.columns.splice(index, 1);
        if (this.parent.columns.length === 0) {
            this.parent.destroy();
        }
        else {
            this.parent.notify(dataReady, { processedData: this.parent.kanbanData });
        }
    };
    Action.prototype.showColumn = function (key) {
        var index = this.hideColumnKeys.indexOf(key);
        if (index !== -1) {
            this.hideColumnKeys.splice(index, 1);
            this.parent.notify(dataReady, { processedData: this.parent.kanbanData });
        }
    };
    Action.prototype.hideColumn = function (key) {
        this.hideColumnKeys.push(key);
        this.parent.notify(dataReady, { processedData: this.parent.kanbanData });
    };
    return Action;
}());

/**
 * Kanban CRUD operations
 */
var Crud = /** @__PURE__ @class */ (function () {
    function Crud(parent) {
        this.parent = parent;
        this.keyField = this.parent.cardSettings.headerField;
    }
    Crud.prototype.getQuery = function () {
        return this.parent.dataModule.generateQuery();
    };
    Crud.prototype.getTable = function () {
        if (this.parent.query) {
            var query = this.parent.query.clone();
            return query.fromTable;
        }
        return null;
    };
    Crud.prototype.refreshData = function (args) {
        var _this = this;
        var actionArgs = {
            requestType: args.requestType, cancel: false, addedRecords: args.addedRecords,
            changedRecords: args.changedRecords, deletedRecords: args.deletedRecords
        };
        if (this.parent.dataModule.dataManager.dataSource.offline) {
            this.parent.trigger(actionComplete, actionArgs, function (offlineArgs) {
                if (!offlineArgs.cancel) {
                    _this.parent.dataModule.refreshDataManager();
                }
            });
        }
        else {
            args.promise.then(function (e) {
                if (_this.parent.isDestroyed) {
                    return;
                }
                _this.parent.trigger(actionComplete, actionArgs, function (onlineArgs) {
                    if (!onlineArgs.cancel) {
                        _this.parent.dataModule.refreshDataManager();
                    }
                });
            }).catch(function (e) {
                if (_this.parent.isDestroyed) {
                    return;
                }
                _this.parent.trigger(actionFailure, { error: e });
            });
        }
    };
    Crud.prototype.addCard = function (cardData) {
        var _this = this;
        var args = {
            cancel: false, requestType: 'cardCreate', addedRecords: (cardData instanceof Array) ? cardData : [cardData],
            changedRecords: [], deletedRecords: []
        };
        this.parent.trigger(actionBegin, args, function (addArgs) {
            if (!addArgs.cancel) {
                var promise = null;
                var editParms = {
                    addedRecords: (cardData instanceof Array) ? cardData : [cardData], changedRecords: [], deletedRecords: []
                };
                if (cardData instanceof Array) {
                    promise = _this.parent.dataModule.dataManager.saveChanges(editParms, _this.keyField, _this.getTable(), _this.getQuery());
                }
                else {
                    promise = _this.parent.dataModule.dataManager.insert(cardData, _this.getTable(), _this.getQuery());
                }
                var crudArgs = {
                    requestType: 'cardCreated', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                    changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                };
                _this.refreshData(crudArgs);
            }
        });
    };
    Crud.prototype.updateCard = function (cardData) {
        var _this = this;
        var args = {
            requestType: 'cardChange', cancel: false, addedRecords: [],
            changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
        };
        this.parent.trigger(actionBegin, args, function (updateArgs) {
            if (!updateArgs.cancel) {
                var promise = null;
                var editParms = {
                    addedRecords: [], changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
                };
                if (cardData instanceof Array) {
                    promise = _this.parent.dataModule.dataManager.saveChanges(editParms, _this.keyField, _this.getTable(), _this.getQuery());
                }
                else {
                    promise = _this.parent.dataModule.dataManager.update(_this.keyField, cardData, _this.getTable(), _this.getQuery());
                }
                var crudArgs = {
                    requestType: 'cardChanged', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                    changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                };
                _this.refreshData(crudArgs);
            }
        });
    };
    Crud.prototype.deleteCard = function (cardData) {
        var _this = this;
        var editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        if (typeof cardData === 'string' || typeof cardData === 'number') {
            editParms.deletedRecords = this.parent.kanbanData.filter(function (data) {
                return data[_this.keyField] === cardData;
            });
        }
        else {
            editParms.deletedRecords = (cardData instanceof Array) ? cardData : [cardData];
        }
        var args = {
            requestType: 'cardRemove', cancel: false, addedRecords: [],
            changedRecords: [], deletedRecords: editParms.deletedRecords
        };
        this.parent.trigger(actionBegin, args, function (deleteArgs) {
            if (!deleteArgs.cancel) {
                var promise = null;
                if (editParms.deletedRecords.length > 1) {
                    promise = _this.parent.dataModule.dataManager.saveChanges(editParms, _this.keyField, _this.getTable(), _this.getQuery());
                }
                else {
                    promise = _this.parent.dataModule.dataManager.remove(_this.keyField, cardData, _this.getTable(), _this.getQuery());
                }
                var crudArgs = {
                    requestType: 'cardRemoved', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                    changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                };
                _this.refreshData(crudArgs);
            }
        });
    };
    return Crud;
}());

/**
 * Drag and Drop module is used to perform card actions.
 * @hidden
 */
var DragAndDrop = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for drag and drop module
     * @private
     */
    function DragAndDrop(parent) {
        this.parent = parent;
        this.dragObj = {
            element: null, cloneElement: null,
            targetClone: null, draggedClone: null, targetCloneMulti: null,
            selectedCards: [], pageX: 0, pageY: 0, navigationInterval: null, cardDetails: []
        };
        this.dragEdges = { left: false, right: false, top: false, bottom: false };
    }
    DragAndDrop.prototype.wireDragEvents = function (element) {
        new Draggable(element, {
            clone: true,
            enableTapHold: this.parent.isAdaptive,
            enableTailMode: true,
            cursorAt: { top: -10, left: -10 },
            dragArea: this.parent.element.querySelector('.' + CONTENT_CLASS),
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
        });
    };
    DragAndDrop.prototype.dragHelper = function (e) {
        this.dragObj.element = e.element;
        this.dragObj.element.style.width = formatUnit(this.dragObj.element.offsetWidth);
        var cloneWrapper = createElement('div', { innerHTML: this.dragObj.element.outerHTML });
        this.dragObj.cloneElement = cloneWrapper.childNodes.item(0);
        addClass([this.dragObj.cloneElement], ['e-cloned-card', 'duplicate']);
        this.dragObj.element.parentElement.appendChild(this.dragObj.cloneElement);
        this.dragObj.targetCloneMulti = createElement('div', { className: TARGET_MULTI_CLONE });
        this.dragObj.targetClone = createElement('div', {
            className: DROPPED_CLONE,
            styles: 'width:' + formatUnit(this.dragObj.element.offsetWidth) + ';height:' + formatUnit(this.dragObj.element.offsetHeight)
        });
        return this.dragObj.cloneElement;
    };
    DragAndDrop.prototype.dragStart = function (e) {
        var _this = this;
        this.dragObj.selectedCards = this.dragObj.element;
        if (this.dragObj.element.classList.contains(CARD_SELECTION)) {
            var className = '.' + CARD_CLASS + '.' + CARD_SELECTION + ':not(.duplicate)';
            var closestEle = closest(this.dragObj.element, '.' + CONTENT_ROW_CLASS);
            this.dragObj.selectedCards = [].slice.call(closestEle.querySelectorAll(className));
            this.dragObj.selectedCards.forEach(function (element) {
                _this.dragObj.cardDetails.push(_this.parent.getCardDetails(element));
            });
        }
        else {
            this.dragObj.cardDetails = [this.parent.getCardDetails(this.dragObj.element)];
        }
        var dragArgs = { cancel: false, data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(dragStart, dragArgs, function (dragEventArgs) {
            if (dragEventArgs.cancel) {
                _this.removeElement(_this.dragObj.cloneElement);
                _this.dragObj = {
                    element: null, cloneElement: null,
                    targetClone: null, draggedClone: null, targetCloneMulti: null
                };
                return;
            }
            if (_this.dragObj.element.classList.contains(CARD_SELECTION)) {
                _this.dragObj.selectedCards.forEach(function (element) { _this.draggedClone(element); });
                if (_this.dragObj.selectedCards.length > 1) {
                    _this.dragObj.cloneElement.innerHTML = '';
                    var drag$$1 = createElement('div', {
                        className: 'e-multi-card-text',
                        innerHTML: _this.dragObj.selectedCards.length + ' Cards',
                    });
                    _this.dragObj.cloneElement.appendChild(drag$$1);
                    classList(_this.dragObj.cloneElement, ['e-multi-card-clone'], [CARD_SELECTION]);
                    _this.dragObj.cloneElement.style.width = '90px';
                }
            }
            else {
                _this.draggedClone(_this.dragObj.element);
            }
            _this.parent.notify(contentReady, {});
        });
    };
    DragAndDrop.prototype.draggedClone = function (element) {
        this.dragObj.draggedClone = createElement('div', {
            className: DRAGGED_CLONE,
            styles: 'width:' + formatUnit(element.offsetWidth - 1) + ';height:' + formatUnit(element.offsetHeight)
        });
        element.insertAdjacentElement('afterend', this.dragObj.draggedClone);
        addClass([element], DRAGGED_CARD);
    };
    DragAndDrop.prototype.drag = function (e) {
        var _this = this;
        if (!e.target) {
            return;
        }
        var cardElement = closest(e.target, '.' + CARD_CLASS);
        var target = cardElement || e.target;
        var selector = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ') .' + CONTENT_CELLS_CLASS;
        var contentCell = closest(target, selector);
        this.calculateArgs(e);
        if (contentCell) {
            var targetKey = this.getColumnKey(contentCell);
            var keys = targetKey.split(',');
            this.multiCloneRemove();
            var isDrag = false;
            if ((targetKey === this.getColumnKey(closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS)))) {
                isDrag = true;
            }
            if (keys.length === 1 || isDrag) {
                if (target.classList.contains(CARD_CLASS)) {
                    var insertClone = isNullOrUndefined(target.previousElementSibling) ? 'beforebegin' : 'afterend';
                    target.insertAdjacentElement(insertClone, this.dragObj.targetClone);
                }
                else if (target.classList.contains(CONTENT_CELLS_CLASS) && !closest(target, '.' + SWIMLANE_ROW_CLASS)) {
                    target.querySelector('.' + CARD_WRAPPER_CLASS).appendChild(this.dragObj.targetClone);
                }
                else if (target.classList.contains(CARD_WRAPPER_CLASS) && !closest(target, '.' + SWIMLANE_ROW_CLASS)
                    && contentCell.querySelectorAll('.' + CARD_CLASS).length === 0) {
                    target.appendChild(this.dragObj.targetClone);
                }
            }
            else if (keys.length > 1) {
                var offsetHeight = contentCell.offsetHeight;
                var limitEle = contentCell.querySelector('.' + LIMITS_CLASS);
                if (limitEle) {
                    offsetHeight -= limitEle.offsetHeight;
                }
                this.dragObj.targetCloneMulti.style.height = formatUnit(offsetHeight);
                var cards = [].slice.call(contentCell.querySelectorAll('.' + CARD_CLASS));
                cards.forEach(function (el) { return addClass([el], MULTI_CLONE_CARD); });
                addClass([contentCell], MULTI_CLONE_CONTENT_CELL);
                contentCell.querySelector('.' + CARD_WRAPPER_CLASS).style.height = 'auto';
                contentCell.style.borderStyle = 'none';
                this.removeElement(this.dragObj.targetClone);
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    var colKey = createElement('div', { className: MULTI_COLUMN_KEY, attrs: { 'data-key': key.trim() } });
                    var text = createElement('div', { className: 'e-text', innerHTML: key.trim() });
                    contentCell.appendChild(this.dragObj.targetCloneMulti).appendChild(colKey).appendChild(text);
                    colKey.style.lineHeight = colKey.style.height = formatUnit((offsetHeight / keys.length));
                    text.style.top = formatUnit((offsetHeight / 2) - (text.offsetHeight / 2));
                }
            }
            this.parent.notify(contentReady, {});
        }
        this.addDropping();
        var isCollapsed = false;
        if (contentCell) {
            isCollapsed = contentCell.classList.contains(COLLAPSED_CLASS) && contentCell.classList.contains(DROPPING);
        }
        if (isCollapsed) {
            this.toggleVisible(target, undefined);
            addClass([contentCell], TOGGLE_VISIBLE);
        }
        var tColumn = [].slice.call(this.parent.element.querySelectorAll('.' + TOGGLE_VISIBLE));
        if (tColumn.length > 0 && !target.classList.contains(TOGGLE_VISIBLE) && !closest(target, '.' + TOGGLE_VISIBLE)) {
            this.toggleVisible(target, tColumn.slice(-1)[0]);
            removeClass(tColumn, TOGGLE_VISIBLE);
        }
        this.parent.notify(contentReady, {});
        var cloneCell = closest(target, '.' + CONTENT_CELLS_CLASS + ':not(.' + COLLAPSED_CLASS + ')');
        if (cloneCell) {
            this.dragObj.targetClone.style.width = formatUnit((cloneCell.offsetWidth - 2) - cardSpace);
        }
        var multiKeyTarget = closest(target, '.' + MULTI_COLUMN_KEY);
        if (multiKeyTarget) {
            var columnKeys = [].slice.call(this.parent.element.querySelectorAll('.' + MULTI_COLUMN_KEY)).filter(function (element) { return _this.getColumnKey(element) === _this.getColumnKey(multiKeyTarget); });
            if (columnKeys.length > 0) {
                addClass(columnKeys, MULTI_ACTIVE);
                if (columnKeys[0].previousElementSibling) {
                    addClass([columnKeys[0].previousElementSibling], 'e-multi-bottom-border');
                }
            }
        }
        document.body.style.cursor = contentCell ? '' : 'not-allowed';
        if (this.parent.swimlaneSettings.keyField && !this.parent.swimlaneSettings.allowDragAndDrop) {
            var dragElement = closest(this.dragObj.element, '.' + CONTENT_ROW_CLASS);
            var classSelector = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ')';
            var dropElement = closest(target, classSelector);
            if (dragElement && dropElement) {
                if (dragElement.rowIndex !== dropElement.rowIndex) {
                    document.body.style.cursor = 'not-allowed';
                }
            }
        }
        if (document.body.style.cursor === 'not-allowed') {
            this.removeElement(this.dragObj.targetClone);
            this.multiCloneRemove();
        }
        this.updateScrollPosition(e);
        var dragArgs = {
            data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards
        };
        this.parent.trigger(drag, dragArgs);
    };
    DragAndDrop.prototype.removeElement = function (element) {
        if (this.parent.element.getElementsByClassName(element.className).length > 0) {
            remove(element);
        }
    };
    DragAndDrop.prototype.addDropping = function () {
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            var className = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + '):not(.' + COLLAPSED_CLASS + ')';
            var rows = [].slice.call(this.parent.element.querySelectorAll(className));
            rows.forEach(function (row) { return addClass(row.childNodes, DROPPING); });
        }
        else {
            var row = closest(this.dragObj.draggedClone, '.' + CONTENT_ROW_CLASS);
            if (row) {
                [].slice.call(row.childNodes).forEach(function (cell) { return addClass([cell], DROPPING); });
            }
        }
        var cell = closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS);
        if (cell) {
            removeClass([cell], DROPPING);
        }
    };
    DragAndDrop.prototype.dragStop = function (e) {
        var _this = this;
        var contentCell = closest(this.dragObj.targetClone, '.' + CONTENT_CELLS_CLASS);
        var columnKey;
        if (this.parent.element.querySelector('.' + TARGET_MULTI_CLONE)) {
            columnKey = closest(e.target, '.' + MULTI_COLUMN_KEY);
        }
        var dragArgs = { cancel: false, data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(dragStop, dragArgs, function (dragEventArgs) {
            _this.removeElement(_this.dragObj.draggedClone);
            _this.removeElement(_this.dragObj.targetClone);
            _this.removeElement(_this.dragObj.cloneElement);
            var dragMultiClone = [].slice.call(_this.parent.element.querySelectorAll('.' + DRAGGED_CLONE));
            dragMultiClone.forEach(function (clone) { return remove(clone); });
            removeClass([_this.dragObj.element], DRAGGED_CARD);
            clearInterval(_this.dragObj.navigationInterval);
            _this.dragObj.navigationInterval = null;
            if (!dragEventArgs.cancel) {
                if (contentCell || columnKey) {
                    var cardStatus_1;
                    if (contentCell) {
                        cardStatus_1 = _this.getColumnKey(contentCell);
                    }
                    else {
                        cardStatus_1 = _this.getColumnKey(columnKey);
                        contentCell = closest(columnKey, '.' + CONTENT_CELLS_CLASS);
                    }
                    if (_this.dragObj.selectedCards instanceof HTMLElement) {
                        _this.updateDroppedData(_this.dragObj.selectedCards, cardStatus_1, contentCell);
                    }
                    else {
                        _this.dragObj.selectedCards.forEach(function (element) {
                            _this.updateDroppedData(element, cardStatus_1, contentCell);
                        });
                    }
                }
            }
            if (document.body.style.cursor === 'not-allowed') {
                document.body.style.cursor = '';
            }
            var className = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ')';
            var rows = [].slice.call(_this.parent.element.querySelectorAll(className));
            rows.forEach(function (row) { return removeClass(row.childNodes, DROPPING); });
            if (_this.parent.isAdaptive) {
                _this.parent.touchModule.tabHold = false;
            }
            _this.dragObj.cardDetails = [];
        });
    };
    DragAndDrop.prototype.updateDroppedData = function (element, cardStatus, contentCell) {
        var crudData = this.parent.getCardDetails(element);
        if (cardStatus.split(',').length === 1) {
            crudData[this.parent.keyField] = cardStatus;
        }
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            var prev = closest(contentCell, '.' + CONTENT_ROW_CLASS).previousElementSibling;
            if (this.parent.isAdaptive) {
                var keyField = this.parent.layoutModule.kanbanRows[this.parent.layoutModule.swimlaneIndex].keyField;
                crudData[this.parent.swimlaneSettings.keyField] = keyField;
            }
            else {
                crudData[this.parent.swimlaneSettings.keyField] = this.getColumnKey(prev);
            }
        }
        this.parent.crudModule.updateCard(crudData);
    };
    DragAndDrop.prototype.toggleVisible = function (target, tColumn) {
        var _this = this;
        var lists = [].slice.call(this.parent.element.querySelectorAll('.' + HEADER_CELLS_CLASS));
        lists.forEach(function (list) {
            if (_this.getColumnKey(list) === _this.getColumnKey(tColumn || target)) {
                _this.parent.actionModule.columnToggle(list);
            }
        });
        var cloneTarget = closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS);
        if (cloneTarget) {
            var width = formatUnit(cloneTarget.offsetWidth - cardSpace);
            this.dragObj.draggedClone.style.width = width;
            this.dragObj.cloneElement.style.width = width;
        }
    };
    DragAndDrop.prototype.multiCloneRemove = function () {
        var cloneMulti = [].slice.call(this.parent.element.querySelectorAll('.' + TARGET_MULTI_CLONE));
        if (cloneMulti.length > 0) {
            var columnKey = [].slice.call(this.parent.element.querySelectorAll('.' + MULTI_COLUMN_KEY));
            columnKey.forEach(function (node) { return remove(node); });
            cloneMulti.forEach(function (node) {
                var target = closest(node, '.' + CONTENT_CELLS_CLASS);
                if (target) {
                    target.style.borderStyle = '';
                }
                var cards = [].slice.call(target.querySelectorAll('.' + CARD_CLASS));
                cards.forEach(function (el) { return removeClass([el], MULTI_CLONE_CARD); });
            });
            this.removeElement(this.dragObj.targetCloneMulti);
        }
    };
    DragAndDrop.prototype.calculateArgs = function (e) {
        var eventArgs = this.getPageCoordinates(e);
        this.dragObj.pageY = eventArgs.pageY;
        this.dragObj.pageX = eventArgs.pageX;
    };
    DragAndDrop.prototype.getPageCoordinates = function (e) {
        var eventArgs = e.event;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            eventArgs || e;
    };
    DragAndDrop.prototype.getColumnKey = function (target) {
        if (target) {
            return target.getAttribute('data-key').trim();
        }
        return '';
    };
    DragAndDrop.prototype.updateScrollPosition = function (e) {
        var _this = this;
        if (isNullOrUndefined(this.dragObj.navigationInterval)) {
            this.dragObj.navigationInterval = window.setInterval(function () {
                if (_this.autoScrollValidation(e)) {
                    _this.autoScroll();
                }
            }, 100);
        }
    };
    DragAndDrop.prototype.autoScrollValidation = function (e) {
        var pageY = this.dragObj.pageY;
        var pageX = this.dragObj.pageX;
        var autoScrollDistance = 30;
        var dragEdges = { left: false, right: false, top: false, bottom: false };
        if (this.dragObj.pageY - window.scrollY < (autoScrollDistance + 36)) {
            dragEdges.top = true;
        }
        if ((pageY > (window.innerHeight - autoScrollDistance) + window.pageYOffset) &&
            (pageY < window.innerHeight + window.pageYOffset)) {
            dragEdges.bottom = true;
        }
        if ((pageX < 0 + autoScrollDistance + window.pageXOffset) && (pageX > 0 + window.pageXOffset)) {
            dragEdges.left = true;
        }
        if ((pageX > (window.innerWidth - autoScrollDistance) + window.pageXOffset) &&
            (pageX < window.innerWidth + window.pageXOffset)) {
            dragEdges.right = true;
        }
        this.dragEdges = dragEdges;
        return dragEdges.bottom || dragEdges.top || dragEdges.left || dragEdges.right;
    };
    DragAndDrop.prototype.autoScroll = function () {
        var scrollSensitivity = 30;
        if (this.parent.isAdaptive) {
            var parent_1;
            if (this.dragEdges.top || this.dragEdges.bottom) {
                if (this.dragObj.targetClone) {
                    parent_1 = closest(this.dragObj.targetClone, '.' + CARD_WRAPPER_CLASS);
                }
                else {
                    parent_1 = closest(this.dragObj.draggedClone, '.' + CARD_WRAPPER_CLASS);
                }
            }
            else if (this.dragEdges.right || this.dragEdges.left) {
                parent_1 = this.parent.element.querySelector('.' + CONTENT_CLASS);
            }
            if (parent_1) {
                var yIsScrollable = parent_1.offsetHeight <= parent_1.scrollHeight;
                var xIsScrollable = parent_1.offsetWidth <= parent_1.scrollWidth;
                var yInBounds = parent_1.scrollTop >= 0 && parent_1.scrollTop + parent_1.offsetHeight <= parent_1.scrollHeight;
                var xInBounds = parent_1.scrollLeft >= 0 && parent_1.scrollLeft + parent_1.offsetWidth <= parent_1.scrollWidth;
                if (yIsScrollable && yInBounds && (this.dragEdges.top || this.dragEdges.bottom)) {
                    parent_1.scrollTop += this.dragEdges.top ? -(scrollSensitivity + 36) : scrollSensitivity;
                }
                if (xIsScrollable && xInBounds && (this.dragEdges.left || this.dragEdges.right)) {
                    var scroll_1;
                    scroll_1 = (this.parent.layoutModule.getWidth() * (this.parent.columns.length - 1)) > parent_1.scrollLeft;
                    if (scroll_1 || this.dragEdges.left) {
                        parent_1.scrollLeft += this.dragEdges.left ? -scrollSensitivity : scrollSensitivity;
                    }
                }
            }
        }
        else {
            if (this.dragObj.pageY - window.scrollY < scrollSensitivity) {
                window.scrollTo(window.scrollX, window.scrollY - scrollSensitivity);
            }
            else if (window.innerHeight - (this.dragObj.pageY - window.scrollY) < scrollSensitivity) {
                window.scrollTo(window.scrollX, window.scrollY + scrollSensitivity);
            }
        }
    };
    DragAndDrop.prototype.unWireDragEvents = function (element) {
        var dragInstance = element.ej2_instances[0];
        if (dragInstance && !dragInstance.isDestroyed) {
            dragInstance.destroy();
        }
    };
    return DragAndDrop;
}());

/**
 * Drag and Drop module is used to perform card actions.
 * @hidden
 */
var Keyboard = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for keyboard module
     * @private
     */
    function Keyboard(parent) {
        this.keyConfigs = {
            firstCardSelection: '36',
            lastCardSelection: '35',
            upArrow: '38',
            downArrow: '40',
            rightArrow: '39',
            leftArrow: '37',
            swimlaneExpandAll: 'ctrl+40',
            swimlaneCollapseAll: 'ctrl+38',
            selectedSwimlaneExpand: 'alt+40',
            selectedSwimlaneCollapse: 'alt+38',
            selectedColumnCollapse: 'ctrl+37',
            selectedColumnExpand: 'ctrl+39',
            multiSelectionByUpArrow: 'shift+38',
            multiSelectionByDownArrow: 'shift+40',
            multiSelectionByLeftArrow: 'shift+37',
            multiSelectionByRightArrow: 'shift+39',
        };
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.keyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }
    Keyboard.prototype.keyActionHandler = function (e) {
        var selectedCard = this.parent.element.querySelectorAll('.e-card.e-selection').item(0);
        if (!selectedCard && e.action !== 'firstCardSelection' && e.action !== 'lastCardSelection') {
            return;
        }
        var key;
        switch (e.action) {
            case 'upArrow':
            case 'downArrow':
            case 'multiSelectionByUpArrow':
            case 'multiSelectionByDownArrow':
                key = closest(this.parent.actionModule.lastCardSelection, '.e-content-cells').getAttribute('data-key');
                var cardSelector = '.e-content-cells[data-key=' + key + '] .e-card';
                var allCards = [].slice.call(this.parent.element.querySelectorAll(cardSelector));
                var curId = this.parent.actionModule.lastCardSelection.getAttribute('data-id');
                var curIndex = this.getCardId(allCards).indexOf(curId);
                var isShift = ((e.action === 'multiSelectionByUpArrow' || e.action === 'multiSelectionByDownArrow')
                    && this.parent.cardSettings.selectionType === 'Multiple');
                var index = (e.action === 'upArrow' || e.action === 'multiSelectionByUpArrow') ? curIndex - 1 : curIndex + 1;
                this.parent.actionModule.cardSelection(allCards[index], false, isShift);
                break;
            case 'rightArrow':
            case 'leftArrow':
            case 'multiSelectionByLeftArrow':
            case 'multiSelectionByRightArrow':
                this.moveCards(e.action, this.parent.actionModule.lastCardSelection);
                break;
            case 'firstCardSelection':
            case 'lastCardSelection':
                if (selectedCard) {
                    removeClass([selectedCard], 'e-selection');
                    var selection = this.parent.actionModule.selectionArray;
                    selection.splice(selection.indexOf(selectedCard.getAttribute('data-id')), 1);
                }
                var cards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_CLASS));
                var element = e.action === 'firstCardSelection' ? cards[0] : cards[cards.length - 1];
                this.parent.actionModule.cardSelection(element, false, false);
                break;
            case 'swimlaneExpandAll':
            case 'swimlaneCollapseAll':
            case 'selectedSwimlaneExpand':
            case 'selectedSwimlaneCollapse':
                if (this.parent.swimlaneSettings.keyField) {
                    this.swimlaneExpandCollapse(e.action);
                }
                break;
            case 'selectedColumnExpand':
            case 'selectedColumnCollapse':
                key = selectedCard.getAttribute('data-key');
                var cell = this.parent.element.querySelector('.e-header-cells[data-key=' + key + ']');
                if (cell.classList.contains(HEADER_ROW_TOGGLE_CLASS)) {
                    if ((cell.classList.contains('e-collapsed') && e.action === 'selectedColumnCollapse') ||
                        (!cell.classList.contains('e-collapsed') && e.action === 'selectedColumnExpand')) {
                        return;
                    }
                    else {
                        this.parent.actionModule.columnExpandCollapse(cell);
                    }
                }
                break;
        }
    };
    Keyboard.prototype.swimlaneExpandCollapse = function (action) {
        var className = '.e-card.e-selection';
        if (action === 'swimlaneExpandAll' || action === 'swimlaneCollapseAll') {
            className = '.e-content-row.e-swimlane-row';
        }
        var element = [].slice.call(this.parent.element.querySelectorAll(className));
        var collapseCount = this.parent.element.querySelectorAll(className + '.e-collapsed').length;
        if ((action === 'swimlaneCollapseAll' && element.length - collapseCount === 0) ||
            (action === 'swimlaneExpandAll' && element.length - collapseCount === element.length)) {
            return;
        }
        element.forEach(function (ele) {
            if (ele.classList.contains(CARD_CLASS)) {
                ele = closest(ele, '.' + CONTENT_ROW_CLASS).previousElementSibling;
            }
            if (ele.classList.contains(COLLAPSED_CLASS)) {
                removeClass([ele, ele.nextElementSibling], COLLAPSED_CLASS);
                classList(ele.querySelector('.' + ICON_CLASS), [SWIMLANE_ROW_EXPAND], [SWIMLANE_ROW_COLLAPSE]);
            }
            else if (!ele.classList.contains(COLLAPSED_CLASS)) {
                addClass([ele, ele.nextElementSibling], COLLAPSED_CLASS);
                classList(ele.querySelector('.' + ICON_CLASS), [SWIMLANE_ROW_COLLAPSE], [SWIMLANE_ROW_EXPAND]);
            }
        });
    };
    Keyboard.prototype.getCardId = function (cardElements) {
        var curCardId = [];
        cardElements.forEach(function (el) { return curCardId.push(el.getAttribute('data-id')); });
        return curCardId;
    };
    Keyboard.prototype.moveNextRow = function (row) {
        for (var i = 0; i < row.childElementCount; i++) {
            var nextCell = row.children[i];
            var nextCellCards = [].slice.call(nextCell.querySelectorAll('.' + CARD_CLASS));
            if (nextCellCards.length > 0) {
                this.parent.actionModule.cardSelection(nextCellCards[0], false, false);
                if (row.classList.contains('e-collapsed')) {
                    this.swimlaneExpandCollapse('selectedSwimlaneExpand');
                }
                break;
            }
        }
    };
    Keyboard.prototype.movePreviousRow = function (row) {
        for (var i = (row.childElementCount - 1); i >= 0; i--) {
            var nextCell = row.children[i];
            var nextCellCards = [].slice.call(nextCell.querySelectorAll('.' + CARD_CLASS));
            if (nextCellCards.length > 0) {
                if (!row.classList.contains('e-collapsed')) {
                    this.swimlaneExpandCollapse('selectedSwimlaneCollapse');
                }
                this.parent.actionModule.cardSelection(nextCellCards.slice(-1)[0], false, false);
                break;
            }
        }
    };
    Keyboard.prototype.cardIndex = function (isSame, nextCellCards, curIndex, action) {
        if (isSame) {
            var isShift = ((action === 'multiSelectionByRightArrow' || action === 'multiSelectionByLeftArrow')
                && this.parent.cardSettings.selectionType === 'Multiple');
            if (nextCellCards[curIndex]) {
                this.parent.actionModule.cardSelection(nextCellCards[curIndex], false, isShift);
            }
            else {
                this.parent.actionModule.cardSelection(nextCellCards.slice(-1)[0], false, isShift);
            }
        }
    };
    Keyboard.prototype.moveCards = function (action, card) {
        var nextCell;
        var nextCellCards;
        var curCell = closest(card, '.e-content-cells');
        var curCellCards = [].slice.call(curCell.querySelectorAll('.e-card'));
        var curRow = closest(curCell, '.e-content-row');
        var curIndex = this.getCardId(curCellCards).indexOf(card.getAttribute('data-id'));
        if (action === 'rightArrow' || action === 'multiSelectionByRightArrow') {
            if (curCell.cellIndex === (curRow.childElementCount - 1) && this.parent.swimlaneSettings.keyField
                && action !== 'multiSelectionByRightArrow') {
                if (curIndex < (this.getCardId(curCellCards).length - 1)) {
                    this.parent.actionModule.cardSelection(this.parent.actionModule.lastCardSelection.nextElementSibling, false, false);
                }
                else if (curRow.rowIndex !== (this.parent.element.querySelectorAll('.' + CONTENT_ROW_CLASS).length - 1)) {
                    var targetRow = this.parent.element.querySelector('.' + CONTENT_ROW_CLASS + (":nth-child(" + (curRow.rowIndex + 3) + ")"));
                    this.moveNextRow(targetRow);
                }
            }
            else {
                var isSame = false;
                for (var i = curCell.cellIndex + 1; i < curRow.children.length; i++) {
                    nextCell = curRow.children[i];
                    nextCellCards = [].slice.call(nextCell.querySelectorAll('.' + CARD_CLASS));
                    if (nextCellCards.length > 0) {
                        isSame = true;
                        break;
                    }
                }
                this.cardIndex(isSame, nextCellCards, curIndex, action);
            }
        }
        else {
            if (curCell.cellIndex === 0 && this.parent.swimlaneSettings.keyField && action !== 'multiSelectionByLeftArrow') {
                if (curIndex > 0) {
                    this.parent.actionModule.cardSelection(this.parent.actionModule.lastCardSelection.previousElementSibling, false, false);
                }
                else if (curRow.rowIndex > 1) {
                    var className = '.' + CONTENT_ROW_CLASS + (":nth-child(" + (curRow.rowIndex - 1) + ")") + ':not(.e-collapsed)';
                    var targetRow = this.parent.element.querySelector(className);
                    if (targetRow) {
                        this.movePreviousRow(targetRow);
                    }
                }
            }
            else {
                var isSame = false;
                for (var i = (curCell.cellIndex - 1); i >= 0; i--) {
                    nextCell = curRow.children[i];
                    nextCellCards = [].slice.call(nextCell.querySelectorAll('.' + CARD_CLASS));
                    if (nextCellCards.length > 0) {
                        isSame = true;
                        break;
                    }
                    if (i === 0 && this.parent.swimlaneSettings.keyField) {
                        var row = this.parent.element.querySelector('.' + CONTENT_ROW_CLASS + (":nth-child(" + (curRow.rowIndex - 1) + ")"));
                        this.movePreviousRow(row);
                    }
                }
                this.cardIndex(isSame, nextCellCards, curIndex, action);
            }
        }
    };
    /**
     * Get module name.
     */
    Keyboard.prototype.getModuleName = function () {
        return 'keyboard';
    };
    /**
     * To destroy the keyboard module.
     * @return {void}
     * @private
     */
    Keyboard.prototype.destroy = function () {
        this.keyboardModule.destroy();
    };
    return Keyboard;
}());

/**
 * Tooltip for Kanban board
 */
var KanbanTooltip = /** @__PURE__ @class */ (function () {
    function KanbanTooltip(parent) {
        this.parent = parent;
        this.renderTooltip();
    }
    KanbanTooltip.prototype.renderTooltip = function () {
        this.tooltipObj = new Tooltip({
            cssClass: this.parent.cssClass + ' ' + TOOLTIP_CLASS,
            enableRtl: this.parent.enableRtl,
            mouseTrail: !this.parent.isAdaptive,
            offsetY: 5,
            position: 'BottomCenter',
            showTipPointer: true,
            target: '.' + TOOLTIP_TEXT,
            beforeRender: this.onBeforeRender.bind(this)
        });
        this.tooltipObj.appendTo(this.parent.element);
        this.tooltipObj.isStringTemplate = true;
    };
    KanbanTooltip.prototype.onBeforeRender = function (args) {
        var tooltipContent;
        if (this.parent.tooltipTemplate) {
            tooltipContent = createElement('div');
            var target = closest(args.target, '.' + CARD_CLASS);
            var data = this.parent.getCardDetails(target);
            var tooltipTemplate = this.parent.templateParser(this.parent.tooltipTemplate)(data);
            append(tooltipTemplate, tooltipContent);
        }
        else {
            tooltipContent = "<div class=\"e-card-header-caption\">" + args.target.innerText + "</div>";
        }
        this.tooltipObj.setProperties({ content: tooltipContent }, true);
    };
    KanbanTooltip.prototype.destroy = function () {
        this.tooltipObj.destroy();
        addClass([this.parent.element], 'e-control');
        this.tooltipObj = null;
    };
    return KanbanTooltip;
}());

/**
 * kanban touch module
 */
var KanbanTouch = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for touch module
     */
    function KanbanTouch(parent) {
        this.parent = parent;
        this.tabHold = false;
    }
    KanbanTouch.prototype.wireTouchEvents = function () {
        this.element = this.parent.element.querySelector('.' + CONTENT_CLASS);
        this.touchObj = new Touch(this.element, { tapHold: this.tapHoldHandler.bind(this) });
    };
    KanbanTouch.prototype.tapHoldHandler = function (e) {
        this.tabHold = true;
    };
    KanbanTouch.prototype.destroy = function () {
        this.touchObj.destroy();
        this.tabHold = false;
        this.element = null;
    };
    return KanbanTouch;
}());

/**
 * Kanban mobile layout rendering module
 */
var MobileLayout = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for mobile layout module
     */
    function MobileLayout(parent) {
        this.parent = parent;
    }
    MobileLayout.prototype.renderSwimlaneHeader = function () {
        var toolbarWrapper = createElement('div', { className: SWIMLANE_HEADER });
        toolbarWrapper.innerHTML = '<div class="' + SWIMLANE_HEADER_TOOLBAR + '"><div class="' + TOOLBAR_MENU + '">' +
            '<div class="e-icons ' + TOOLBAR_MENU_ICON + '"></div></div><div class="' + TOOLBAR_LEVEL_TITLE + '">' +
            '<div class="' + TOOLBAR_SWIMLANE_NAME + '"></div></div></div>';
        this.parent.element.appendChild(toolbarWrapper);
        EventHandler.add(toolbarWrapper.querySelector('.' + TOOLBAR_MENU_ICON), 'click', this.menuClick, this);
    };
    MobileLayout.prototype.renderSwimlaneTree = function () {
        var height = this.parent.element.querySelector('.' + SWIMLANE_HEADER).offsetHeight;
        var treeHeight = window.innerHeight - height;
        this.popupOverlay = createElement('div', { className: SWIMLANE_OVERLAY, styles: 'height: ' + treeHeight + 'px;' });
        var wrapper = createElement('div', { className: SWIMLANE_CONTENT, styles: 'top:' + height + 'px;' });
        var treeWrapper = createElement('div', {
            className: SWIMLANE_RESOURCE + ' e-popup-close',
            styles: 'height: ' + treeHeight + 'px;'
        });
        wrapper.appendChild(treeWrapper);
        wrapper.appendChild(this.popupOverlay);
        this.parent.element.appendChild(wrapper);
        var swimlaneTree = createElement('div', { className: SWIMLANE_TREE });
        treeWrapper.appendChild(swimlaneTree);
        this.treeViewObj = new TreeView({
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            fields: {
                dataSource: this.parent.layoutModule.kanbanRows,
                id: 'keyField',
                text: 'textField'
            },
            nodeTemplate: this.parent.swimlaneSettings.template,
            nodeClicked: this.treeSwimlaneClick.bind(this)
        });
        this.treeViewObj.appendTo(swimlaneTree);
        this.treePopup = new Popup(treeWrapper, {
            targetType: 'relative',
            actionOnScroll: 'none',
            content: this.treeViewObj.element,
            enableRtl: this.parent.enableRtl,
            zIndex: 10,
            hideAnimation: { name: 'SlideLeftOut', duration: 500 },
            showAnimation: { name: 'SlideLeftIn', duration: 500 },
            viewPortElement: this.parent.element.querySelector('.' + CONTENT_CLASS)
        });
    };
    MobileLayout.prototype.menuClick = function (event) {
        if (this.parent.element.querySelector('.' + SWIMLANE_RESOURCE).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
        else {
            var treeNodes = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item'));
            removeClass(treeNodes, 'e-active');
            addClass([treeNodes[this.parent.layoutModule.swimlaneIndex]], 'e-active');
            this.treePopup.show();
            addClass([this.popupOverlay], 'e-enable');
        }
    };
    MobileLayout.prototype.treeSwimlaneClick = function (args) {
        this.treePopup.hide();
        var treeNodes = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item'));
        this.parent.layoutModule.swimlaneIndex = treeNodes.indexOf(args.node);
        this.parent.layoutModule.scrollLeft = 0;
        this.parent.notify(dataReady, { processedData: this.parent.kanbanData });
        args.event.preventDefault();
    };
    MobileLayout.prototype.getWidth = function () {
        return (window.innerWidth * 80) / 100;
    };
    return MobileLayout;
}());

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
/**
 * Kanban layout rendering module
 */
var LayoutRender = /** @__PURE__ @class */ (function (_super) {
    __extends$5(LayoutRender, _super);
    /**
     * Constructor for layout module
     */
    function LayoutRender(parent) {
        var _this = _super.call(this, parent) || this;
        _this.kanbanRows = [];
        _this.parent = parent;
        _this.columnKeys = [];
        _this.swimlaneIndex = 0;
        _this.scrollLeft = 0;
        _this.wireEvents();
        return _this;
    }
    LayoutRender.prototype.initRender = function () {
        if (this.parent.columns.length === 0) {
            return;
        }
        this.columnData = this.getColumnCards();
        this.kanbanRows = this.getRows();
        if (this.parent.isAdaptive) {
            var parent_1 = this.parent.element.querySelector('.' + CONTENT_CLASS);
            if (parent_1) {
                this.scrollLeft = parent_1.scrollLeft;
            }
        }
        this.destroy();
        this.wireEvents();
        if (this.parent.isAdaptive && this.parent.swimlaneSettings.keyField) {
            this.renderSwimlaneHeader();
        }
        var header = createElement('div', { className: HEADER_CLASS });
        this.parent.element.appendChild(header);
        this.renderHeader(header);
        this.renderContent();
        this.renderCards();
        this.renderValidation();
        if (this.parent.isAdaptive) {
            this.parent.touchModule.wireTouchEvents();
            var parent_2 = this.parent.element.querySelector('.' + CONTENT_CLASS);
            parent_2.scrollLeft = this.scrollLeft;
        }
        this.parent.notify(contentReady, {});
    };
    LayoutRender.prototype.renderHeader = function (header) {
        var _this = this;
        var headerWrap = createElement('div', { className: this.parent.swimlaneSettings.keyField ? SWIMLANE_CLASS : '' });
        header.appendChild(headerWrap);
        var headerTable = createElement('table', { className: TABLE_CLASS + ' ' + HEADER_TABLE_CLASS });
        headerWrap.appendChild(headerTable);
        this.renderColGroup(headerTable);
        var tableHead = createElement('thead');
        headerTable.appendChild(tableHead);
        if (this.parent.stackedHeaders.length > 0) {
            tableHead.appendChild(this.createStackedRow(this.parent.stackedHeaders));
        }
        var tr = createElement('tr', { className: HEADER_ROW_CLASS });
        tableHead.appendChild(tr);
        var _loop_1 = function (column) {
            if (this_1.isColumnVisible(column)) {
                var index_1 = this_1.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                var th_1 = createElement('th', {
                    className: index_1 === -1 ? HEADER_CELLS_CLASS : HEADER_CELLS_CLASS + ' ' + COLLAPSED_CLASS,
                    attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField }
                });
                var classList$$1 = [];
                if (column.allowToggle) {
                    classList$$1.push(HEADER_ROW_TOGGLE_CLASS);
                    if (!column.isExpanded) {
                        classList$$1.push(COLLAPSED_CLASS);
                    }
                }
                addClass([th_1], classList$$1);
                var headerWrapper = createElement('div', { className: HEADER_WRAP_CLASS });
                th_1.appendChild(headerWrapper);
                if (column.template) {
                    addClass([th_1], TEMPLATE_CLASS);
                    var templateHeader = this_1.parent.templateParser(column.template)(column);
                    append(templateHeader, headerWrapper);
                }
                else {
                    var header_1 = createElement('div', { className: HEADER_TEXT_CLASS, innerHTML: column.headerText });
                    headerWrapper.appendChild(header_1);
                    if (column.showItemCount) {
                        var cardCount = this_1.columnData[column.keyField].length;
                        header_1.appendChild(createElement('div', {
                            className: TOTAL_CARD,
                            innerHTML: '- ' + cardCount.toString() + ' ' + this_1.parent.localeObj.getConstant('items')
                        }));
                    }
                }
                var dataObj = [{ keyField: column.keyField, textField: column.headerText }];
                var args = { data: dataObj, element: tr, cancel: false, requestType: 'headerRow' };
                this_1.parent.trigger(columnRendered, args, function (columnArgs) {
                    if (!columnArgs.cancel) {
                        tr.appendChild(th_1);
                        if (column.allowToggle) {
                            var name_1 = (column.isExpanded && index_1 === -1) ? COLUMN_EXPAND : COLUMN_COLLAPSE;
                            var iconDiv = createElement('div', {
                                className: HEADER_ICON_CLASS + ' ' + ICON_CLASS + ' ' + name_1
                            });
                            th_1.appendChild(iconDiv);
                            _this.wireEvents(iconDiv, 'columnExpandCollapse');
                        }
                    }
                });
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.parent.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            _loop_1(column);
        }
    };
    LayoutRender.prototype.renderContent = function () {
        var content = createElement('div', { className: CONTENT_CLASS });
        this.parent.element.appendChild(content);
        var contentWrap = createElement('div', { className: this.parent.swimlaneSettings.keyField ? SWIMLANE_CLASS : '' });
        content.appendChild(contentWrap);
        var contentTable = createElement('table', { className: TABLE_CLASS + ' ' + CONTENT_TABLE_CLASS });
        contentWrap.appendChild(contentTable);
        this.renderColGroup(contentTable);
        var tBody = createElement('tbody');
        contentTable.appendChild(tBody);
        var className;
        var isCollaspsed = false;
        this.swimlaneRow = this.kanbanRows;
        if (this.parent.swimlaneSettings.keyField && this.parent.isAdaptive) {
            this.swimlaneRow = [this.kanbanRows[this.swimlaneIndex]];
            this.renderSwimlaneTree();
            (this.parent.element.querySelector('.' + TOOLBAR_SWIMLANE_NAME)).innerHTML = this.kanbanRows[this.swimlaneIndex].textField;
        }
        var _loop_2 = function (row) {
            if (this_2.parent.swimlaneSettings.keyField && this_2.parent.actionModule.swimlaneToggleArray.length !== 0) {
                var index = this_2.parent.actionModule.swimlaneToggleArray.indexOf(row.keyField);
                isCollaspsed = index !== -1;
            }
            className = isCollaspsed ? CONTENT_ROW_CLASS + ' ' + COLLAPSED_CLASS : CONTENT_ROW_CLASS;
            var tr = createElement('tr', { className: className });
            if (this_2.parent.swimlaneSettings.keyField && !this_2.parent.isAdaptive) {
                this_2.renderSwimlaneRow(tBody, row, isCollaspsed);
            }
            for (var _i = 0, _a = this_2.parent.columns; _i < _a.length; _i++) {
                var column = _a[_i];
                if (this_2.isColumnVisible(column)) {
                    var index = this_2.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                    var className_1 = index === -1 ? CONTENT_CELLS_CLASS : CONTENT_CELLS_CLASS + ' ' + COLLAPSED_CLASS;
                    var td = createElement('td', {
                        className: className_1, attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField }
                    });
                    if (column.allowToggle && !column.isExpanded || index !== -1) {
                        addClass([td], COLLAPSED_CLASS);
                        td.appendChild(createElement('div', { className: COLLAPSE_HEADER_TEXT, innerHTML: column.headerText }));
                    }
                    tr.appendChild(td);
                    var dataObj = [{ keyField: row.keyField, textField: row.textField }];
                    var args = { data: dataObj, element: tr, cancel: false, requestType: 'contentRow' };
                    this_2.parent.trigger(columnRendered, args, function (columnArgs) {
                        if (!columnArgs.cancel) {
                            tBody.appendChild(tr);
                        }
                    });
                }
            }
        };
        var this_2 = this;
        for (var _i = 0, _a = this.swimlaneRow; _i < _a.length; _i++) {
            var row = _a[_i];
            _loop_2(row);
        }
        this.wireEvents(content, 'scroll');
    };
    LayoutRender.prototype.renderSwimlaneRow = function (tBody, row, isCollapsed) {
        var _this = this;
        var name = CONTENT_ROW_CLASS + ' ' + SWIMLANE_ROW_CLASS;
        var className = isCollapsed ? ' ' + COLLAPSED_CLASS : '';
        var tr = createElement('tr', {
            className: name + className, attrs: { 'data-key': row.keyField }
        });
        var col = this.parent.columns.length - this.parent.actionModule.hideColumnKeys.length;
        var td = createElement('td', {
            className: CONTENT_CELLS_CLASS,
            attrs: { 'data-role': 'kanban-column', 'colspan': col.toString() }
        });
        var iconClass = isCollapsed ? SWIMLANE_ROW_COLLAPSE : SWIMLANE_ROW_EXPAND;
        var iconDiv = createElement('div', { className: ICON_CLASS + ' ' + iconClass });
        td.appendChild(iconDiv);
        if (this.parent.swimlaneSettings.template) {
            addClass([td], TEMPLATE_CLASS);
            var swimlaneTemplate = this.parent.templateParser(this.parent.swimlaneSettings.template)(row);
            append(swimlaneTemplate, td);
        }
        else {
            td.appendChild(createElement('div', {
                className: SWIMLANE_ROW_TEXT,
                innerHTML: row.textField,
                attrs: { 'data-role': row.textField }
            }));
            if (this.parent.swimlaneSettings.showItemCount) {
                td.appendChild(createElement('div', { className: SWIMLANE_ITEM_COUNT }));
            }
        }
        tr.appendChild(td);
        var dataObj = [{ keyField: row.keyField, textField: row.textField }];
        var args = { data: dataObj, element: tr, cancel: false, requestType: 'swimlaneRow' };
        this.parent.trigger(columnRendered, args, function (columnArgs) {
            if (!columnArgs.cancel) {
                tBody.appendChild(tr);
                _this.wireEvents(tr, 'rowExpandCollapse');
            }
        });
    };
    LayoutRender.prototype.renderCards = function () {
        var _this = this;
        var rows = this.swimlaneRow;
        var cardRows = [].slice.call(this.parent.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)'));
        var swimlaneRows = [].slice.call(this.parent.element.querySelectorAll('.e-content-row.e-swimlane-row'));
        var removeTrs = [];
        cardRows.forEach(function (tr, index) {
            var dataCount = 0;
            var _loop_3 = function (column) {
                if (_this.isColumnVisible(column)) {
                    var columnData = _this.columnData[column.keyField];
                    if (_this.parent.swimlaneSettings.keyField) {
                        columnData = columnData.filter(function (data) {
                            return data[_this.parent.swimlaneSettings.keyField] === rows[index].keyField;
                        });
                    }
                    dataCount += columnData.length;
                    var columnWrapper = tr.querySelector('[data-key="' + column.keyField + '"]');
                    var cardWrapper_1 = createElement('div', { className: CARD_WRAPPER_CLASS });
                    columnWrapper.appendChild(cardWrapper_1);
                    var _loop_4 = function (data) {
                        var cardText = data[_this.parent.cardSettings.headerField];
                        var cardIndex = _this.parent.actionModule.selectionArray.indexOf(cardText);
                        var className = cardIndex === -1 ? '' : ' ' + CARD_SELECTION;
                        var cardElement = createElement('div', {
                            className: CARD_CLASS + className,
                            attrs: { 'data-id': data[_this.parent.cardSettings.headerField], 'data-key': data[_this.parent.keyField] }
                        });
                        if (_this.parent.cardSettings.template) {
                            addClass([cardElement], TEMPLATE_CLASS);
                            var cardTemplate = _this.parent.templateParser(_this.parent.cardSettings.template)(data);
                            append(cardTemplate, cardElement);
                        }
                        else {
                            var tooltipClass = _this.parent.enableTooltip ? ' ' + TOOLTIP_TEXT : '';
                            if (_this.parent.cardSettings.showHeader) {
                                var cardHeader = createElement('div', { className: CARD_HEADER_CLASS });
                                var cardText_1 = createElement('div', {
                                    className: CARD_HEADER_TEXT_CLASS + tooltipClass,
                                    innerHTML: data[_this.parent.cardSettings.headerField] || ''
                                });
                                cardHeader.appendChild(cardText_1);
                                cardElement.appendChild(cardHeader);
                            }
                            var cardContent = createElement('div', { className: CARD_CONTENT_CLASS });
                            var cardText_2 = createElement('div', {
                                className: CARD_CONTENT_TEXT_CLASS + tooltipClass,
                                innerHTML: data[_this.parent.cardSettings.contentField] || ''
                            });
                            cardContent.appendChild(cardText_2);
                            cardElement.appendChild(cardContent);
                        }
                        var args = { data: data, element: cardElement, cancel: false };
                        _this.parent.trigger(cardRendered, args, function (cardArgs) {
                            if (!cardArgs.cancel) {
                                cardWrapper_1.appendChild(cardElement);
                                _this.wireEvents(cardElement, 'card');
                                if (_this.parent.allowDragAndDrop) {
                                    _this.parent.dragAndDropModule.wireDragEvents(cardElement);
                                }
                            }
                        });
                    };
                    for (var _i = 0, _a = columnData; _i < _a.length; _i++) {
                        var data = _a[_i];
                        _loop_4(data);
                    }
                }
            };
            for (var _i = 0, _a = _this.parent.columns; _i < _a.length; _i++) {
                var column = _a[_i];
                _loop_3(column);
            }
            if (swimlaneRows.length > 0 && _this.parent.swimlaneSettings.showItemCount && !_this.parent.swimlaneSettings.template) {
                var localeText = _this.parent.localeObj.getConstant('items');
                swimlaneRows[index].querySelector('.' + SWIMLANE_ITEM_COUNT).innerHTML = '- ' + dataCount.toString() + ' ' + localeText;
            }
            if (dataCount === 0) {
                removeTrs.push(tr);
                if (swimlaneRows.length > 0) {
                    removeTrs.push(swimlaneRows[index]);
                }
            }
        });
        if (!this.parent.swimlaneSettings.showEmptyRow) {
            removeTrs.forEach(function (tr) { return remove(tr); });
        }
    };
    LayoutRender.prototype.renderColGroup = function (table) {
        var _this = this;
        var colGroup = createElement('colgroup');
        this.parent.columns.forEach(function (column) {
            if (_this.isColumnVisible(column)) {
                var index = _this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                var isToggle = column.allowToggle && !column.isExpanded;
                var className = index === -1 ? (isToggle ? COLLAPSED_CLASS : '') : COLLAPSED_CLASS;
                var col = createElement('col', {
                    className: className,
                    attrs: { 'data-key': column.keyField },
                    styles: _this.parent.isAdaptive ? 'width: ' +
                        (isToggle ? formatUnit(toggleWidth) : formatUnit(_this.getWidth())) : ''
                });
                colGroup.appendChild(col);
            }
        });
        table.appendChild(colGroup);
    };
    LayoutRender.prototype.getRows = function () {
        var _this = this;
        var kanbanRows = [];
        if (this.parent.swimlaneSettings.keyField) {
            this.parent.kanbanData.map(function (obj) {
                if (!_this.parent.swimlaneSettings.showEmptyRow && _this.parent.isAdaptive) {
                    if (_this.columnKeys.indexOf(obj[_this.parent.keyField]) === -1) {
                        return;
                    }
                }
                kanbanRows.push({
                    keyField: obj[_this.parent.swimlaneSettings.keyField],
                    textField: obj[_this.parent.swimlaneSettings.textField] || obj[_this.parent.swimlaneSettings.keyField]
                });
            });
            kanbanRows = kanbanRows.filter(function (item, index, arr) {
                return index === arr.map(function (item) { return item.keyField; }).indexOf(item.keyField);
            });
            kanbanRows.sort(function (a, b) { return (a.textField > b.textField) ? 1 : ((b.textField > a.textField) ? -1 : 0); });
            if (this.parent.swimlaneSettings.sortBy === 'Descending') {
                kanbanRows.reverse();
            }
        }
        else {
            kanbanRows.push({ keyField: '', textField: '' });
        }
        return kanbanRows;
    };
    LayoutRender.prototype.createStackedRow = function (rows) {
        var tr = createElement('tr', { className: HEADER_ROW_CLASS + ' e-stacked-header-row' });
        var stackedHeaders = [];
        this.parent.columns.forEach(function (column) {
            var headerText = '';
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                if (row.keyFields.indexOf(column.keyField) !== -1) {
                    headerText = row.text;
                }
            }
            stackedHeaders.push(headerText);
        });
        for (var h = 0; h < stackedHeaders.length; h++) {
            var colSpan = 1;
            for (var j = h + 1; j < stackedHeaders.length; j++) {
                if ((stackedHeaders[h] !== '') && (stackedHeaders[j] !== '') && stackedHeaders[h] === stackedHeaders[j]) {
                    colSpan++;
                }
                else {
                    break;
                }
            }
            var div = createElement('div', { className: HEADER_TEXT_CLASS, innerHTML: stackedHeaders[h] });
            var th = createElement('th', {
                className: HEADER_CELLS_CLASS + ' e-stacked-header-cell',
                attrs: { 'colspan': colSpan.toString() }
            });
            tr.appendChild(th).appendChild(div);
            h += colSpan - 1;
        }
        return tr;
    };
    LayoutRender.prototype.scrollUiUpdate = function () {
        var _this = this;
        var header = this.parent.element.querySelector('.' + HEADER_CLASS);
        var content = this.parent.element.querySelector('.' + CONTENT_CLASS);
        var height = this.parent.element.offsetHeight - header.offsetHeight;
        if (this.parent.isAdaptive) {
            height = window.innerHeight - (header.offsetHeight + bottomSpace);
            var swimlaneToolbar = this.parent.element.querySelector('.' + SWIMLANE_HEADER);
            if (swimlaneToolbar) {
                height -= swimlaneToolbar.offsetHeight;
            }
            var cardWrappers = [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_CELLS_CLASS));
            cardWrappers.forEach(function (cell) {
                if (!cell.classList.contains(MULTI_CLONE_CONTENT_CELL)) {
                    cell.querySelector('.' + CARD_WRAPPER_CLASS).style.height = formatUnit(height);
                    EventHandler.add(cell, 'touchmove', _this.onAdaptiveScroll, _this);
                }
            });
        }
        if (this.parent.height !== 'auto' && this.parent.height !== '100%') {
            content.style.height = formatUnit(height);
        }
        [].slice.call(header.childNodes).forEach(function (node) {
            var paddingValue = 0;
            if ((content.offsetWidth - content.clientWidth) > 0) {
                paddingValue = 17;
                if ((content.offsetHeight - content.clientHeight) > 0) {
                    node.style.width = formatUnit(content.clientWidth);
                }
            }
            if (_this.parent.enableRtl) {
                node.style.paddingLeft = formatUnit(paddingValue);
            }
            else {
                node.style.paddingRight = formatUnit(paddingValue);
            }
        });
    };
    LayoutRender.prototype.onContentScroll = function (e) {
        var header = this.parent.element.querySelector('.' + HEADER_CLASS + ' div');
        header.scrollLeft = e.target.scrollLeft;
    };
    LayoutRender.prototype.onAdaptiveScroll = function (e) {
        if (this.parent.touchModule.tabHold) {
            e.preventDefault();
        }
    };
    LayoutRender.prototype.isColumnVisible = function (column) {
        var _this = this;
        var isVisible = false;
        column.keyField.split(',').forEach(function (key) { isVisible = _this.parent.actionModule.hideColumnKeys.indexOf(key) === -1; });
        return isVisible;
    };
    LayoutRender.prototype.renderLimits = function (column, target) {
        var limits = createElement('div', { className: LIMITS_CLASS });
        if (column.minCount) {
            limits.appendChild(createElement('div', {
                className: MIN_COUNT_CLASS,
                innerHTML: this.parent.localeObj.getConstant('min') + ': ' + column.minCount.toString()
            }));
        }
        if (column.maxCount) {
            limits.appendChild(createElement('div', {
                className: MAX_COUNT_CLASS,
                innerHTML: this.parent.localeObj.getConstant('max') + ': ' + column.maxCount.toString()
            }));
        }
        if (limits.childElementCount > 0) {
            if (target.firstElementChild.classList.contains(CARD_WRAPPER_CLASS)) {
                target.insertBefore(limits, target.firstElementChild);
            }
            else {
                target.appendChild(limits);
            }
        }
    };
    LayoutRender.prototype.renderValidation = function () {
        var _this = this;
        var getValidationClass = function (column, count) {
            var colorClass;
            if (column.maxCount && count > column.maxCount) {
                colorClass = MAX_COLOR;
            }
            else if (column.minCount && count < column.minCount) {
                colorClass = MIN_COLOR;
            }
            return colorClass;
        };
        this.parent.columns.forEach(function (column) {
            if (!column.minCount && !column.maxCount) {
                return;
            }
            var cardData = _this.columnData[column.keyField];
            var keySelector = "[data-key=\"" + column.keyField + "\"]";
            var headerCell = _this.parent.element.querySelector("." + (HEADER_CELLS_CLASS + keySelector));
            var rowCells = [].slice.call(_this.parent.element.querySelectorAll("." + (CONTENT_CELLS_CLASS + keySelector)));
            if (_this.parent.constraintType === 'Swimlane' && _this.parent.swimlaneSettings.keyField) {
                _this.kanbanRows.forEach(function (row, index) {
                    _this.renderLimits(column, rowCells[index]);
                    var rowCards = cardData.filter(function (card) {
                        return card[_this.parent.swimlaneSettings.keyField] === row.keyField;
                    });
                    var colorClass = getValidationClass(column, rowCards.length);
                    if (colorClass) {
                        addClass([rowCells[index]], colorClass);
                    }
                });
            }
            else {
                _this.renderLimits(column, headerCell);
                var colorClass = getValidationClass(column, cardData.length);
                if (colorClass) {
                    addClass(rowCells.concat(headerCell), colorClass);
                }
            }
        });
    };
    LayoutRender.prototype.getColumnCards = function () {
        var _this = this;
        var columnData = {};
        this.columnKeys = [];
        this.parent.columns.forEach(function (column) {
            var cardData = [];
            var columnKeys = column.keyField.split(',');
            var _loop_5 = function (key) {
                _this.columnKeys.push(key.trim());
                var keyData = _this.parent.kanbanData.filter(function (cardObj) {
                    return cardObj[_this.parent.keyField] === key.trim();
                });
                cardData = cardData.concat(keyData);
            };
            for (var _i = 0, columnKeys_1 = columnKeys; _i < columnKeys_1.length; _i++) {
                var key = columnKeys_1[_i];
                _loop_5(key);
            }
            columnData[column.keyField] = cardData;
        });
        return columnData;
    };
    LayoutRender.prototype.wireEvents = function (element, action) {
        switch (action) {
            case 'card':
                EventHandler.add(element, 'click', this.parent.actionModule.cardClick, this.parent.actionModule);
                EventHandler.add(element, 'dblclick', this.parent.actionModule.cardDoubleClick, this.parent.actionModule);
                break;
            case 'rowExpandCollapse':
                EventHandler.add(element, 'click', this.parent.actionModule.rowExpandCollapse, this.parent.actionModule);
                break;
            case 'columnExpandCollapse':
                EventHandler.add(element, 'click', this.parent.actionModule.columnExpandCollapse, this.parent.actionModule);
                break;
            case 'scroll':
                EventHandler.add(element, 'scroll', this.onContentScroll, this);
                break;
            default:
                this.parent.on(dataReady, this.initRender, this);
                this.parent.on(contentReady, this.scrollUiUpdate, this);
                break;
        }
    };
    LayoutRender.prototype.unWireEvents = function (element, action) {
        switch (action) {
            case 'card':
                EventHandler.remove(element, 'click', this.parent.actionModule.cardClick);
                EventHandler.remove(element, 'dblclick', this.parent.actionModule.cardDoubleClick);
                break;
            case 'rowExpandCollapse':
                EventHandler.remove(element, 'click', this.parent.actionModule.rowExpandCollapse);
                break;
            case 'columnExpandCollapse':
                EventHandler.remove(element, 'click', this.parent.actionModule.columnExpandCollapse);
                break;
            case 'scroll':
                EventHandler.remove(element, 'scroll', this.onContentScroll);
                break;
            default:
                this.parent.off(dataReady, this.initRender);
                this.parent.off(contentReady, this.scrollUiUpdate);
                break;
        }
    };
    LayoutRender.prototype.refreshHeaders = function () {
        var header = this.parent.element.querySelector('.' + HEADER_CLASS);
        [].slice.call(header.children).forEach(function (child) { return remove(child); });
        this.renderHeader(header);
    };
    LayoutRender.prototype.refreshCards = function () {
        var cards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_WRAPPER_CLASS));
        cards.forEach(function (card) { return remove(card); });
        this.renderCards();
    };
    LayoutRender.prototype.destroy = function () {
        var _this = this;
        this.unWireEvents();
        var cards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_CLASS));
        cards.forEach(function (card) { return _this.unWireEvents(card, 'card'); });
        var rows = [].slice.call(this.parent.element.querySelectorAll('.' + SWIMLANE_ROW_CLASS));
        rows.forEach(function (row) { return _this.unWireEvents(row, 'rowExpandCollapse'); });
        var columns = [].slice.call(this.parent.element.querySelectorAll('.' + HEADER_ICON_CLASS));
        columns.forEach(function (column) { return _this.unWireEvents(column, 'columnExpandCollapse'); });
        var header = this.parent.element.querySelector('.' + HEADER_CLASS);
        if (header) {
            remove(header);
        }
        var content = this.parent.element.querySelector('.' + CONTENT_CLASS);
        if (content) {
            this.unWireEvents(content, 'scroll');
            remove(content);
        }
        if (this.treeViewObj) {
            this.treeViewObj.destroy();
            this.treeViewObj = null;
        }
        if (this.treePopup) {
            this.treePopup.destroy();
            this.treePopup = null;
        }
        var swimlaneToolBarEle = this.parent.element.querySelector('.' + SWIMLANE_HEADER);
        if (swimlaneToolBarEle) {
            remove(swimlaneToolBarEle);
        }
        var swimlaneContent = this.parent.element.querySelector('.' + SWIMLANE_CONTENT);
        if (swimlaneContent) {
            remove(swimlaneContent);
        }
    };
    return LayoutRender;
}(MobileLayout));

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
 * The Kanban component is an efficient way to visually depict various stages of a process using cards with transparent workflows.
 * The component has rich set of APIs, methods, and events used to enable or disable its features and customize them.
 * ```html
 * <div id="kanban"></div>
 * ```
 * ```typescript
 * <script>
 *   var kanbanObj = new Kanban();
 *   kanbanObj.appendTo("#kanban");
 * </script>
 * ```
 */
var Kanban = /** @__PURE__ @class */ (function (_super) {
    __extends(Kanban, _super);
    /**
     * Constructor for creating the Kanban widget
     * @hidden
     */
    function Kanban(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Initializes the values of private members.
     * @private
     */
    Kanban.prototype.preRender = function () {
        this.isAdaptive = Browser.isDevice;
        this.kanbanData = [];
        this.activeCardData = { data: null, element: null };
        var defaultLocale = {
            items: 'items',
            min: 'Min',
            max: 'Max'
        };
        this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    Kanban.prototype.requiredModules = function () {
        var modules = [];
        return modules;
    };
    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    Kanban.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Core method to return the component name.
     * @private
     */
    Kanban.prototype.getModuleName = function () {
        return 'kanban';
    };
    /**
     * Core method that initializes the control rendering.
     * @private
     */
    Kanban.prototype.render = function () {
        var addClasses = [];
        var removeClasses = [];
        addClasses.push(ROOT_CLASS);
        if (this.enableRtl) {
            addClasses.push(RTL_CLASS);
        }
        else {
            removeClasses.push(RTL_CLASS);
        }
        if (this.isAdaptive) {
            addClasses.push(DEVICE_CLASS);
        }
        else {
            removeClasses.push(DEVICE_CLASS);
        }
        if (this.cssClass) {
            addClasses.push(this.cssClass);
        }
        classList(this.element, addClasses, removeClasses);
        this.element.style.width = formatUnit(this.width);
        this.element.style.height = formatUnit(this.height);
        createSpinner({ target: this.element });
        this.showSpinner();
        this.initializeModules();
    };
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    Kanban.prototype.onPropertyChanged = function (newProp, oldProp) {
        var _this = this;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.element], oldProp.cssClass);
                    }
                    if (newProp.cssClass) {
                        addClass([this.element], newProp.cssClass);
                    }
                    break;
                case 'enableRtl':
                case 'locale':
                    this.refresh();
                    break;
                case 'width':
                    this.element.style.width = formatUnit(newProp.width);
                    this.element.querySelector('.' + HEADER_CLASS).firstElementChild.style.width = 'auto';
                    this.notify(contentReady, {});
                    break;
                case 'height':
                    this.element.style.height = formatUnit(newProp.height);
                    this.element.querySelector('.' + CONTENT_CLASS).style.height = 'auto';
                    this.notify(contentReady, {});
                    break;
                case 'dataSource':
                case 'query':
                    this.dataModule = new Data(this);
                    break;
                case 'columns':
                case 'constraintType':
                    this.notify(dataReady, { processedData: this.kanbanData });
                    break;
                case 'swimlaneSettings':
                    this.onSwimlaneSettingsPropertyChanged(newProp.swimlaneSettings, oldProp.swimlaneSettings);
                    break;
                case 'cardSettings':
                    this.onCardSettingsPropertyChanged(newProp.cardSettings, oldProp.cardSettings);
                    break;
                case 'allowDragAndDrop':
                    var cards = [].slice.call(this.element.querySelectorAll('.' + CARD_CLASS));
                    cards.forEach(function (card) {
                        if (newProp.allowDragAndDrop) {
                            _this.dragAndDropModule.wireDragEvents(card);
                        }
                        else {
                            _this.dragAndDropModule.unWireDragEvents(card);
                        }
                    });
                    break;
                case 'enableTooltip':
                    if (this.tooltipModule) {
                        this.tooltipModule.destroy();
                        this.tooltipModule = null;
                    }
                    if (newProp.enableTooltip) {
                        this.tooltipModule = new KanbanTooltip(this);
                        this.layoutModule.refreshCards();
                    }
                    break;
                case 'allowKeyboard':
                    if (this.keyboardModule) {
                        this.keyboardModule.destroy();
                        this.keyboardModule = null;
                    }
                    if (newProp.allowKeyboard) {
                        this.keyboardModule = new Keyboard(this);
                    }
                    break;
                case 'stackedHeaders':
                    this.layoutModule.refreshHeaders();
                    break;
                default:
                    break;
            }
        }
    };
    Kanban.prototype.onSwimlaneSettingsPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'keyField':
                case 'textField':
                case 'showEmptyRow':
                case 'showItemCount':
                case 'template':
                case 'sortBy':
                    this.notify(dataReady, { processedData: this.kanbanData });
                    break;
            }
        }
    };
    Kanban.prototype.onCardSettingsPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'showHeader':
                case 'headerField':
                case 'contentField':
                case 'template':
                    this.layoutModule.refreshCards();
                    break;
                case 'selectionType':
                    var cards = this.getSelectedCards();
                    if (cards.length > 0) {
                        removeClass(cards, CARD_SELECTION);
                    }
                    break;
            }
        }
    };
    Kanban.prototype.initializeModules = function () {
        this.dataModule = new Data(this);
        this.layoutModule = new LayoutRender(this);
        if (this.allowKeyboard) {
            this.keyboardModule = new Keyboard(this);
        }
        this.actionModule = new Action(this);
        this.crudModule = new Crud(this);
        this.dragAndDropModule = new DragAndDrop(this);
        if (this.enableTooltip) {
            this.tooltipModule = new KanbanTooltip(this);
        }
        if (Browser.isDevice || Browser.isTouch) {
            this.touchModule = new KanbanTouch(this);
        }
    };
    Kanban.prototype.destroyModules = function () {
        if (this.layoutModule) {
            this.layoutModule.destroy();
            this.layoutModule = null;
        }
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
            this.keyboardModule = null;
        }
        if (this.touchModule) {
            this.touchModule.destroy();
            this.touchModule = null;
        }
        this.actionModule = null;
        this.crudModule = null;
        this.dataModule = null;
        this.dragAndDropModule = null;
    };
    /** @private */
    Kanban.prototype.templateParser = function (template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (error) {
                return compile(template);
            }
        }
        return undefined;
    };
    /**
     * Returns the card details based on card ID from the board.
     * @method getCardDetails
     * @param {Element} target Accepts the card element to get the details.
     * @returns {{[key: string]: Object}}
     */
    Kanban.prototype.getCardDetails = function (target) {
        var _this = this;
        var isNumeric = typeof this.kanbanData[0][this.cardSettings.headerField] === 'number';
        var targetId = isNumeric ? parseInt(target.getAttribute('data-id'), 10) : target.getAttribute('data-id');
        var cardObj = this.kanbanData.filter(function (data) {
            return data[_this.cardSettings.headerField] === targetId;
        })[0];
        return cardObj;
    };
    /**
     * Gets the list of selected cards from the board.
     * @method getSelectedCards
     * @returns {HTMLElement[]}
     */
    Kanban.prototype.getSelectedCards = function () {
        return [].slice.call(this.element.querySelectorAll('.' + CARD_CLASS + '.' + CARD_SELECTION));
    };
    /**
     * Allows you to show the spinner on Kanban at the required scenarios.
     * @method showSpinner
     * @returns {void}
     */
    Kanban.prototype.showSpinner = function () {
        showSpinner(this.element);
    };
    /**
     * When the spinner is shown manually using the showSpinner method, it can be hidden using this `hideSpinner` method.
     * @method hideSpinner
     * @returns {void}
     */
    Kanban.prototype.hideSpinner = function () {
        hideSpinner(this.element);
    };
    /**
     * Adds the new card to the data source of Kanban and layout.
     * @method addEvent
     * @param {{[key: string]: Object}} cardData Single card objects to be added into Kanban.
     * @param {{[key: string]: Object}[]} cardData Collection of card objects to be added into Kanban.
     * @returns {void}
     */
    Kanban.prototype.addCard = function (cardData) {
        this.crudModule.addCard(cardData);
    };
    /**
     * Updates the changes made in the event object by passing it as a parameter to the data source.
     * @method updateCard
     * @param {{[key: string]: Object}} cardData Single card object to be updated into Kanban.
     * @param {{[key: string]: Object}[]} cardData Collection of card objects to be updated into Kanban.
     * @returns {void}
     */
    Kanban.prototype.updateCard = function (cardData) {
        this.crudModule.updateCard(cardData);
    };
    /**
     * Deletes the card based on the provided ID or card collection in the argument list.
     * @method deleteCard
     * @param {{[key: string]: Object}} id Single card to be removed from the Kanban.
     * @param {{[key: string]: Object }[]} id Collection of cards to be removed from the Kanban.
     * @param {number} id Accepts the ID of the card in integer type which needs to be removed from the Kanban.
     * @param {string} id Accepts the ID of the card in string type which needs to be removed from the Kanban.
     * @returns {void}
     */
    Kanban.prototype.deleteCard = function (cardData) {
        this.crudModule.deleteCard(cardData);
    };
    /**
     * Add the column to Kanban board dynamically based on the provided column options and index in the argument list.
     * @method addColumn
     * @param {ColumnsModel} columnOptions Defines the properties to new column that are going to be added in the board.
     * @param {number} index Defines the index of column to add the new column.
     * @returns {void}
     */
    Kanban.prototype.addColumn = function (columnOptions, index) {
        this.actionModule.addColumn(columnOptions, index);
    };
    /**
     * Deletes the column based on the provided index value.
     * @method deleteColumn
     * @param {number} index Defines the index of column to delete the existing column from Kanban board.
     * @returns {void}
     */
    Kanban.prototype.deleteColumn = function (index) {
        this.actionModule.deleteColumn(index);
    };
    /**
     * Shows the column from hidden based on the provided key in the columns.
     * @method showColumn
     * @param {string} key Accepts the hidden column key name to be shown from the hidden state in board.
     * @returns {void}
     */
    Kanban.prototype.showColumn = function (key) {
        this.actionModule.showColumn(key);
    };
    /**
     * Hides the column from Kanban board based on the provided key in the columns.
     * @method hideColumn
     * @param {string} key Accepts the visible column key name to be hidden from the board.
     * @returns {void}
     */
    Kanban.prototype.hideColumn = function (key) {
        this.actionModule.hideColumn(key);
    };
    /**
     * Removes the control from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    Kanban.prototype.destroy = function () {
        this.destroyModules();
        _super.prototype.destroy.call(this);
        this.element.innerHTML = '';
        var removeClasses = [ROOT_CLASS];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
    };
    __decorate([
        Property()
    ], Kanban.prototype, "cssClass", void 0);
    __decorate([
        Property('auto')
    ], Kanban.prototype, "width", void 0);
    __decorate([
        Property('auto')
    ], Kanban.prototype, "height", void 0);
    __decorate([
        Property([])
    ], Kanban.prototype, "dataSource", void 0);
    __decorate([
        Property()
    ], Kanban.prototype, "query", void 0);
    __decorate([
        Property()
    ], Kanban.prototype, "keyField", void 0);
    __decorate([
        Property('Column')
    ], Kanban.prototype, "constraintType", void 0);
    __decorate([
        Collection([], Columns)
    ], Kanban.prototype, "columns", void 0);
    __decorate([
        Property(true)
    ], Kanban.prototype, "allowKeyboard", void 0);
    __decorate([
        Collection([], StackedHeaders)
    ], Kanban.prototype, "stackedHeaders", void 0);
    __decorate([
        Complex({}, SwimlaneSettings)
    ], Kanban.prototype, "swimlaneSettings", void 0);
    __decorate([
        Complex({}, CardSettings)
    ], Kanban.prototype, "cardSettings", void 0);
    __decorate([
        Property(true)
    ], Kanban.prototype, "allowDragAndDrop", void 0);
    __decorate([
        Property(false)
    ], Kanban.prototype, "enableTooltip", void 0);
    __decorate([
        Property()
    ], Kanban.prototype, "tooltipTemplate", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "actionBegin", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "actionComplete", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "actionFailure", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "created", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dataBinding", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dataBound", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "cardClick", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "cardDoubleClick", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "columnRendered", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "cardRendered", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dragStart", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "drag", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dragStop", void 0);
    Kanban = __decorate([
        NotifyPropertyChanges
    ], Kanban);
    return Kanban;
}(Component));

/**
 * Export base files
 */

/**
 * Kanban component exported items
 */

/**
 * Export Kanban component
 */

export { Kanban, actionBegin, actionComplete, actionFailure, cardClick, cardDoubleClick, cardRendered, columnRendered, dataBinding, dataBound, dragStart, drag, dragStop, documentClick, contentReady, dataReady, bottomSpace, cardSpace, toggleWidth };
//# sourceMappingURL=ej2-kanban.es5.js.map
