import { Browser, ChildProperty, Collection, Complex, Component, Draggable, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Property, Touch, addClass, append, classList, closest, compile, createElement, detach, extend, formatUnit, isBlazor, isNullOrUndefined, remove, removeClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { Dialog, Popup, Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { FormValidator, NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
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
var queryCellInfo = 'queryCellInfo';
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
/** @hidden */
var dialogOpen = 'dialogOpen';
/** @hidden */
var dialogClose = 'dialogClose';
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
    ], SwimlaneSettings.prototype, "sortDirection", void 0);
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
    ], CardSettings.prototype, "tagsField", void 0);
    __decorate$2([
        Property()
    ], CardSettings.prototype, "grabberField", void 0);
    __decorate$2([
        Property()
    ], CardSettings.prototype, "footerCssField", void 0);
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
 * Holds the configuration of editor settings.
 */
var DialogSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$3(DialogSettings, _super);
    function DialogSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        Property()
    ], DialogSettings.prototype, "template", void 0);
    __decorate$3([
        Property([])
    ], DialogSettings.prototype, "fields", void 0);
    __decorate$3([
        Property(null)
    ], DialogSettings.prototype, "model", void 0);
    return DialogSettings;
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
 * Holds the configuration of columns in kanban board.
 */
var Columns = /** @__PURE__ @class */ (function (_super) {
    __extends$4(Columns, _super);
    function Columns() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        Property()
    ], Columns.prototype, "keyField", void 0);
    __decorate$4([
        Property()
    ], Columns.prototype, "headerText", void 0);
    __decorate$4([
        Property()
    ], Columns.prototype, "template", void 0);
    __decorate$4([
        Property(false)
    ], Columns.prototype, "allowToggle", void 0);
    __decorate$4([
        Property(true)
    ], Columns.prototype, "isExpanded", void 0);
    __decorate$4([
        Property()
    ], Columns.prototype, "minCount", void 0);
    __decorate$4([
        Property()
    ], Columns.prototype, "maxCount", void 0);
    __decorate$4([
        Property(true)
    ], Columns.prototype, "showItemCount", void 0);
    __decorate$4([
        Property(false)
    ], Columns.prototype, "showAddButton", void 0);
    return Columns;
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
 * Holds the configuration of stacked header settings in kanban board.
 */
var StackedHeaders = /** @__PURE__ @class */ (function (_super) {
    __extends$5(StackedHeaders, _super);
    function StackedHeaders() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        Property()
    ], StackedHeaders.prototype, "text", void 0);
    __decorate$5([
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
var HEADER_TITLE_CLASS = 'e-header-title';
/** @hidden */
var HEADER_TEXT_CLASS = 'e-header-text';
/** @hidden */
var HEADER_ICON_CLASS = 'e-header-icon';
/** @hidden */
var STACKED_HEADER_ROW_CLASS = 'e-stacked-header-row';
/** @hidden */
var STACKED_HEADER_CELL_CLASS = 'e-stacked-header-cell';
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
var SWIMLANE_ROW_EXPAND_CLASS = 'e-swimlane-row-expand';
/** @hidden */
var SWIMLANE_ROW_COLLAPSE_CLASS = 'e-swimlane-row-collapse';
/** @hidden */
var SWIMLANE_ROW_TEXT_CLASS = 'e-swimlane-text';
/** @hidden */
var CARD_ITEM_COUNT_CLASS = 'e-item-count';
/** @hidden */
var CARD_WRAPPER_CLASS = 'e-card-wrapper';
/** @hidden */
var CARD_CLASS = 'e-card';
/** @hidden */
var DRAGGABLE_CLASS = 'e-draggable';
/** @hidden */
var CARD_HEADER_CLASS = 'e-card-header';
/** @hidden */
var CARD_CONTENT_CLASS = 'e-card-content';
/** @hidden */
var CARD_HEADER_TEXT_CLASS = 'e-card-header-caption';
/** @hidden */
var CARD_HEADER_TITLE_CLASS = 'e-card-header-title';
/** @hidden */
var CARD_TAGS_CLASS = 'e-card-tags';
/** @hidden */
var CARD_TAG_CLASS = 'e-card-tag';
/** @hidden */
var CARD_COLOR_CLASS = 'e-card-color';
/** @hidden */
var CARD_LABEL_CLASS = 'e-card-label';
/** @hidden */
var CARD_FOOTER_CLASS = 'e-card-footer';
/** @hidden */
var CARD_FOOTER_CSS_CLASS = 'e-card-footer-css';
/** @hidden */
var COLUMN_EXPAND_CLASS = 'e-column-expand';
/** @hidden */
var COLUMN_COLLAPSE_CLASS = 'e-column-collapse';
/** @hidden */
var COLLAPSE_HEADER_TEXT_CLASS = 'e-collapse-header-text';
/** @hidden */
var COLLAPSED_CLASS = 'e-collapsed';
/** @hidden */
var DIALOG_CLASS = 'e-kanban-dialog';
/** @hidden */

/** @hidden */
var FORM_CLASS = 'e-kanban-form';
/** @hidden */
var FORM_WRAPPER_CLASS = 'e-kanban-form-wrapper';
/** @hidden */
var ERROR_VALIDATION_CLASS = 'e-kanban-error';
/** @hidden */
var FIELD_CLASS = 'e-field';
/** @hidden */
var DRAGGED_CLONE_CLASS = 'e-target-dragged-clone';
/** @hidden */
var CLONED_CARD_CLASS = 'e-cloned-card';
/** @hidden */
var DRAGGED_CARD_CLASS = 'e-kanban-dragged-card';
/** @hidden */
var DROPPED_CLONE_CLASS = 'e-target-dropped-clone';
/** @hidden */
var DROPPING_CLASS = 'e-dropping';
/** @hidden */
var TOGGLE_VISIBLE_CLASS = 'e-toggle-visible';
/** @hidden */

/** @hidden */
var MULTI_CARD_WRAPPER_CLASS = 'e-multi-card-wrapper';
/** @hidden */
var MULTI_ACTIVE_CLASS = 'e-multi-active';
/** @hidden */
var TARGET_MULTI_CLONE_CLASS = 'e-target-multi-clone';
/** @hidden */
var MULTI_COLUMN_KEY_CLASS = 'e-column-key';
/** @hidden */
var CARD_SELECTION_CLASS = 'e-selection';
/** @hidden */
var TOOLTIP_CLASS = 'e-kanban-tooltip';
/** @hidden */
var TOOLTIP_TEXT_CLASS = 'e-tooltip-text';
/** @hidden */

/** @hidden */
var SWIMLANE_HEADER_CLASS = 'e-swimlane-header';
/** @hidden */
var SWIMLANE_HEADER_TOOLBAR_CLASS = 'e-swimlane-header-toolbar';
/** @hidden */
var TOOLBAR_MENU_CLASS = 'e-toolbar-menu';
/** @hidden */
var TOOLBAR_MENU_ICON_CLASS = 'e-icon-menu';
/** @hidden */
var TOOLBAR_LEVEL_TITLE_CLASS = 'e-toolbar-level-title';
/** @hidden */
var TOOLBAR_SWIMLANE_NAME_CLASS = 'e-toolbar-swimlane-name';
/** @hidden */
var SWIMLANE_OVERLAY_CLASS = 'e-swimlane-overlay';
/** @hidden */
var SWIMLANE_CONTENT_CLASS = 'e-swimlane-content';
/** @hidden */
var SWIMLANE_RESOURCE_CLASS = 'e-swimlane-resource';
/** @hidden */
var SWIMLANE_TREE_CLASS = 'e-swimlane-tree';
/** @hidden */
var LIMITS_CLASS = 'e-limits';
/** @hidden */
var MAX_COUNT_CLASS = 'e-max-count';
/** @hidden */
var MIN_COUNT_CLASS = 'e-min-count';
/** @hidden */
var MAX_COLOR_CLASS = 'e-max-color';
/** @hidden */
var MIN_COLOR_CLASS = 'e-min-color';
/** @hidden */

/** @hidden */
var POPUP_HEADER_CLASS = 'e-popup-header';
/** @hidden */
var CLOSE_CLASS = 'e-close';
/** @hidden */
var POPUP_CONTENT_CLASS = 'e-popup-content';
/** @hidden */
var POPUP_WRAPPER_CLASS = 'e-mobile-popup-wrapper';
/** @hidden */
var CLOSE_ICON_CLASS = 'e-close-icon';
/** @hidden */
var POPUP_OPEN_CLASS = 'e-popup-open';
/** @hidden */
var DIALOG_CONTENT_CONTAINER = 'e-kanban-dialog-content';
/** @hidden */
var SHOW_ADD_BUTTON = 'e-show-add-button';
/** @hidden */
var SHOW_ADD_ICON = 'e-show-add-icon';
/** @hidden */
var SHOW_ADD_FOCUS = 'e-show-add-focus';

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
        this.columnToggleArray = [];
        this.selectionArray = [];
        this.lastCardSelection = null;
        this.lastSelectionRow = null;
        this.lastCard = null;
        this.selectedCardsElement = [];
        this.selectedCardsData = [];
        this.hideColumnKeys = [];
    }
    Action.prototype.clickHandler = function (e) {
        var elementSelector = '.' + CARD_CLASS + ',.' + HEADER_ICON_CLASS + ',.' + CONTENT_ROW_CLASS + '.' +
            SWIMLANE_ROW_CLASS + ',.' + SHOW_ADD_BUTTON + ',.' + CONTENT_ROW_CLASS +
            ':not(.' + SWIMLANE_ROW_CLASS + ') .' + CONTENT_CELLS_CLASS;
        var target = closest(e.target, elementSelector);
        if (!target) {
            return;
        }
        if (target.classList.contains(CARD_CLASS)) {
            if (this.parent.allowKeyboard) {
                this.parent.keyboardModule.cardTabIndexRemove();
            }
            this.cardClick(e);
        }
        else if (target.classList.contains(HEADER_ICON_CLASS)) {
            this.columnExpandCollapse(e);
        }
        else if (target.classList.contains(CONTENT_ROW_CLASS) && target.classList.contains(SWIMLANE_ROW_CLASS)) {
            this.rowExpandCollapse(e);
        }
        else if (target.classList.contains(SHOW_ADD_BUTTON)) {
            this.addButtonClick(target);
        }
    };
    Action.prototype.addButtonClick = function (target) {
        var _this = this;
        var newData = {};
        if (this.parent.kanbanData.length === 0) {
            newData[this.parent.cardSettings.headerField] = 1;
        }
        else if (typeof this.parent.kanbanData[0][this.parent.cardSettings.headerField] === 'number') {
            newData[this.parent.cardSettings.headerField] = Math.max.apply(Math, this.parent.kanbanData.map(function (obj) { return parseInt(obj[_this.parent.cardSettings.headerField], 10); })) + 1;
        }
        newData[this.parent.keyField] = closest(target, '.' + CONTENT_CELLS_CLASS).getAttribute('data-key');
        if (this.parent.sortSettings.sortBy === 'Index') {
            newData[this.parent.sortSettings.field] = 1;
            if (closest(target, '.' + CONTENT_CELLS_CLASS).querySelector('.' + CARD_CLASS)) {
                var card = this.parent.sortSettings.direction === 'Ascending' ?
                    target.nextElementSibling.lastElementChild : target.nextElementSibling.firstElementChild;
                var data = this.parent.getCardDetails(card);
                newData[this.parent.sortSettings.field] = data[this.parent.sortSettings.field] + 1;
            }
        }
        if (this.parent.kanbanData.length !== 0 && this.parent.swimlaneSettings.keyField &&
            closest(target, '.' + CONTENT_ROW_CLASS).previousElementSibling) {
            newData[this.parent.swimlaneSettings.keyField] =
                closest(target, '.' + CONTENT_ROW_CLASS).previousElementSibling.getAttribute('data-key');
        }
        this.parent.openDialog('Add', newData);
    };
    Action.prototype.doubleClickHandler = function (e) {
        var target = closest(e.target, '.' + CARD_CLASS);
        if (target) {
            this.cardDoubleClick(e);
        }
    };
    Action.prototype.cardClick = function (e, selectedCard) {
        var _this = this;
        var target = closest((selectedCard) ? selectedCard : e.target, '.' + CARD_CLASS);
        var cardClickObj = this.parent.getCardDetails(target);
        this.parent.activeCardData = { data: cardClickObj, element: target };
        var args = { data: cardClickObj, element: target, cancel: false, event: e };
        this.parent.trigger(cardClick, args, function (clickArgs) {
            if (!clickArgs.cancel) {
                if (target.classList.contains(CARD_SELECTION_CLASS) && e.type === 'click') {
                    removeClass([target], CARD_SELECTION_CLASS);
                    _this.parent.layoutModule.disableAttributeSelection(target);
                }
                else {
                    var isCtrlKey = e.ctrlKey;
                    if (_this.parent.isAdaptive && _this.parent.touchModule) {
                        isCtrlKey = (_this.parent.touchModule.mobilePopup && _this.parent.touchModule.tabHold) || isCtrlKey;
                    }
                    _this.cardSelection(target, isCtrlKey, e.shiftKey);
                }
                if (_this.parent.isAdaptive && _this.parent.touchModule) {
                    _this.parent.touchModule.updatePopupContent();
                }
                var cell = closest(target, '.' + CONTENT_CELLS_CLASS);
                if (_this.parent.allowKeyboard) {
                    var element = [].slice.call(cell.querySelectorAll('.' + CARD_CLASS));
                    element.forEach(function (e) {
                        e.setAttribute('tabindex', '0');
                    });
                    _this.parent.keyboardModule.addRemoveTabIndex('Remove');
                }
            }
        });
    };
    Action.prototype.cardDoubleClick = function (e) {
        var _this = this;
        var target = closest(e.target, '.' + CARD_CLASS);
        var cardDoubleClickObj = this.parent.getCardDetails(target);
        this.parent.activeCardData = { data: cardDoubleClickObj, element: target };
        var args = { data: cardDoubleClickObj, element: target, cancel: false, event: e };
        this.parent.trigger(cardDoubleClick, args, function (doubleClickArgs) {
            if (!doubleClickArgs.cancel) {
                if (_this.parent.isBlazorRender()) {
                    // tslint:disable-next-line
                    _this.parent.interopAdaptor.invokeMethodAsync('OpenDialog', 'Edit', args.data);
                }
                else {
                    _this.parent.dialogModule.openDialog('Edit', args.data);
                }
            }
        });
    };
    Action.prototype.rowExpandCollapse = function (e) {
        var _this = this;
        var headerTarget = (e instanceof HTMLElement) ? e : e.target;
        var args = { cancel: false, target: headerTarget, requestType: 'rowExpandCollapse' };
        this.parent.trigger(actionBegin, args, function (actionArgs) {
            if (!actionArgs.cancel) {
                var target = closest(headerTarget, '.' + SWIMLANE_ROW_CLASS);
                var key = target.getAttribute('data-key');
                var tgtRow = _this.parent.element.querySelector('.' + CONTENT_ROW_CLASS + (":nth-child(" + (target.rowIndex + 2) + ")"));
                var targetIcon = target.querySelector("." + SWIMLANE_ROW_EXPAND_CLASS + ",." + SWIMLANE_ROW_COLLAPSE_CLASS);
                var isCollapsed = target.classList.contains(COLLAPSED_CLASS) ? true : false;
                var tabIndex_1;
                if (isCollapsed) {
                    removeClass([tgtRow, target], COLLAPSED_CLASS);
                    classList(targetIcon, [SWIMLANE_ROW_EXPAND_CLASS], [SWIMLANE_ROW_COLLAPSE_CLASS]);
                    _this.parent.swimlaneToggleArray.splice(_this.parent.swimlaneToggleArray.indexOf(key), 1);
                    tabIndex_1 = '0';
                }
                else {
                    addClass([tgtRow, target], COLLAPSED_CLASS);
                    classList(targetIcon, [SWIMLANE_ROW_COLLAPSE_CLASS], [SWIMLANE_ROW_EXPAND_CLASS]);
                    _this.parent.swimlaneToggleArray.push(key);
                    tabIndex_1 = '-1';
                }
                targetIcon.setAttribute('aria-label', isCollapsed ? key + ' Expand' : key + ' Collapse');
                target.setAttribute('aria-expanded', isCollapsed.toString());
                tgtRow.setAttribute('aria-expanded', isCollapsed.toString());
                var rows = [].slice.call(tgtRow.querySelectorAll('.' + CONTENT_CELLS_CLASS));
                rows.forEach(function (cell) {
                    cell.setAttribute('tabindex', tabIndex_1);
                });
                _this.parent.notify(contentReady, {});
                _this.parent.trigger(actionComplete, { target: headerTarget, requestType: 'rowExpandCollapse' });
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
                    var index = (colIndex + 1 === collapsed) ? 1 : colIndex + 2;
                    var headerSelector = "." + HEADER_CELLS_CLASS + ":not(." + STACKED_HEADER_CELL_CLASS + "):nth-child(" + index + ")";
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
        var elementSelector = "." + CONTENT_ROW_CLASS + ":not(." + SWIMLANE_ROW_CLASS + ")";
        var targetRow = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
        var colSelector = "." + TABLE_CLASS + " col:nth-child(" + (colIndex + 1) + ")";
        var targetIcon = target.querySelector("." + COLUMN_EXPAND_CLASS + ",." + COLUMN_COLLAPSE_CLASS);
        var colGroup = [].slice.call(this.parent.element.querySelectorAll(colSelector));
        if (target.classList.contains(COLLAPSED_CLASS)) {
            removeClass(colGroup, COLLAPSED_CLASS);
            if (this.parent.isAdaptive) {
                colGroup.forEach(function (col) { return col.style.width = formatUnit(_this.parent.layoutModule.getWidth()); });
            }
            classList(targetIcon, [COLUMN_EXPAND_CLASS], [COLUMN_COLLAPSE_CLASS]);
            for (var _i = 0, targetRow_1 = targetRow; _i < targetRow_1.length; _i++) {
                var row = targetRow_1[_i];
                var targetCol = row.querySelector("." + CONTENT_CELLS_CLASS + ":nth-child(" + (colIndex + 1) + ")");
                removeClass([targetCol, target], COLLAPSED_CLASS);
                remove(targetCol.querySelector('.' + COLLAPSE_HEADER_TEXT_CLASS));
                target.setAttribute('aria-expanded', 'true');
                targetCol.setAttribute('aria-expanded', 'true');
            }
            this.columnToggleArray.splice(this.columnToggleArray.indexOf(target.getAttribute('data-key')), 1);
            this.parent.columns[colIndex].setProperties({ isExpanded: true }, true);
            target.querySelector('.e-header-icon').setAttribute('aria-label', target.getAttribute('data-key') + ' Expand');
        }
        else {
            addClass(colGroup, COLLAPSED_CLASS);
            if (this.parent.isAdaptive) {
                colGroup.forEach(function (col) { return col.style.width = formatUnit(toggleWidth); });
            }
            classList(targetIcon, [COLUMN_COLLAPSE_CLASS], [COLUMN_EXPAND_CLASS]);
            var key = target.getAttribute('data-key');
            for (var _a = 0, targetRow_2 = targetRow; _a < targetRow_2.length; _a++) {
                var row = targetRow_2[_a];
                var targetCol = row.querySelector("." + CONTENT_CELLS_CLASS + "[data-key=\"" + key + "\"]");
                var index = targetCol.cellIndex;
                var text = (this.parent.columns[index].showItemCount ? '[' +
                    targetCol.querySelectorAll('.' + CARD_CLASS).length + '] ' : '') + this.parent.columns[index].headerText;
                targetCol.appendChild(createElement('div', { className: COLLAPSE_HEADER_TEXT_CLASS, innerHTML: text }));
                addClass([targetCol, target], COLLAPSED_CLASS);
                target.setAttribute('aria-expanded', 'false');
                targetCol.setAttribute('aria-expanded', 'false');
            }
            this.columnToggleArray.push(target.getAttribute('data-key'));
            this.parent.columns[colIndex].setProperties({ isExpanded: false }, true);
            target.querySelector('.e-header-icon').setAttribute('aria-label', key + ' Collapse');
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
                removeClass(cards, CARD_SELECTION_CLASS);
                this.parent.layoutModule.disableAttributeSelection(cards);
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
                    addClass([card], CARD_SELECTION_CLASS);
                    card.setAttribute('aria-selected', 'true');
                    card.setAttribute('tabindex', '0');
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
                addClass([target], CARD_SELECTION_CLASS);
                target.setAttribute('aria-selected', 'true');
                target.setAttribute('tabindex', '0');
                this.selectionArray.push(target.getAttribute('data-id'));
                this.selectedCardsElement.push(target);
                this.selectedCardsData.push(this.parent.getCardDetails(target));
                this.lastCard = this.lastCardSelection = target;
                this.lastSelectionRow = closest(target, '.' + CONTENT_ROW_CLASS);
                if (this.lastSelectionRow.previousElementSibling) {
                    var elementSelector = "." + SWIMLANE_ROW_EXPAND_CLASS + ",." + SWIMLANE_ROW_COLLAPSE_CLASS;
                    var parentEle = this.lastSelectionRow.previousElementSibling.querySelector(elementSelector);
                    if (parentEle && parentEle.classList.contains(SWIMLANE_ROW_COLLAPSE_CLASS)) {
                        this.rowExpandCollapse(parentEle);
                    }
                }
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
                _this.parent.showSpinner();
                var promise = null;
                var modifiedData = [];
                if (_this.parent.sortSettings.field && _this.parent.sortSettings.sortBy === 'Index') {
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    if (!_this.parent.isBlazorRender()) {
                        modifiedData = _this.priorityOrder(modifiedData, addArgs);
                    }
                }
                var addedRecords = (cardData instanceof Array) ? cardData : [cardData];
                var changedRecords = (_this.parent.sortSettings.field && _this.parent.sortSettings.sortBy === 'Index') ? modifiedData : [];
                var editParms = { addedRecords: addedRecords, changedRecords: changedRecords, deletedRecords: [] };
                if (cardData instanceof Array || modifiedData.length > 0) {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.saveChanges(editParms, _this.keyField, _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('AddCards', { AddedRecords: addedRecords, ChangedRecords: changedRecords }, _this.keyField);
                    }
                }
                else {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.insert(cardData, _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('AddCard', { Record: cardData });
                    }
                }
                if (!_this.parent.isBlazorRender()) {
                    var crudArgs = {
                        requestType: 'cardCreated', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                        changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                    };
                    _this.refreshData(crudArgs);
                }
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
                _this.parent.showSpinner();
                var promise = null;
                if (_this.parent.sortSettings.field && _this.parent.sortSettings.sortBy === 'Index') {
                    var modifiedData = [];
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    if (!_this.parent.isBlazorRender()) {
                        cardData = _this.priorityOrder(modifiedData, updateArgs);
                    }
                }
                var editParms = {
                    addedRecords: [], changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
                };
                if (cardData instanceof Array) {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.saveChanges(editParms, _this.keyField, _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('UpdateCards', { ChangedRecords: cardData }, _this.keyField);
                    }
                }
                else {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.update(_this.keyField, cardData, _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('UpdateCard', _this.keyField, { Record: cardData });
                    }
                }
                if (!_this.parent.isBlazorRender()) {
                    var crudArgs = {
                        requestType: 'cardChanged', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                        changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                    };
                    _this.refreshData(crudArgs);
                }
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
                _this.parent.showSpinner();
                var promise = null;
                if (editParms.deletedRecords.length > 1) {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.saveChanges(editParms, _this.keyField, _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('DeleteCards', { DeletedRecords: cardData }, _this.keyField);
                    }
                }
                else {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.remove(_this.keyField, editParms.deletedRecords[0], _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('DeleteCard', _this.keyField, { Record: cardData });
                    }
                }
                if (!_this.parent.isBlazorRender()) {
                    var crudArgs = {
                        requestType: 'cardRemoved', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                        changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                    };
                    _this.refreshData(crudArgs);
                }
            }
        });
    };
    Crud.prototype.priorityOrder = function (cardData, args) {
        var _this = this;
        var cardsId = cardData.map(function (obj) { return obj[_this.parent.cardSettings.headerField]; });
        var allModifiedKeys = cardData.map(function (obj) { return obj[_this.parent.keyField]; });
        var modifiedKey = allModifiedKeys.filter(function (key, index) { return allModifiedKeys.indexOf(key) === index; }).sort();
        var columnAllDatas;
        var finalData = [];
        var _loop_1 = function (columnKey) {
            var keyData = cardData.filter(function (cardObj) { return cardObj[_this.parent.keyField] === columnKey; });
            columnAllDatas = this_1.parent.getColumnData(columnKey);
            if (this_1.parent.sortSettings.direction === 'Descending') {
                columnAllDatas = this_1.removeData(columnAllDatas, keyData);
            }
            var customOrder = 1;
            var initialOrder = void 0;
            for (var _i = 0, _a = keyData; _i < _a.length; _i++) {
                var data = _a[_i];
                var order = void 0;
                if (data[this_1.parent.sortSettings.field]) {
                    order = data[this_1.parent.sortSettings.field];
                }
                else {
                    if (customOrder === 1) {
                        initialOrder = columnAllDatas.slice(-1)[0][this_1.parent.sortSettings.field];
                    }
                    order = data[this_1.parent.sortSettings.field] = (customOrder > 1 ? initialOrder :
                        columnAllDatas.slice(-1)[0][this_1.parent.sortSettings.field]) + customOrder;
                    customOrder++;
                }
                if (this_1.parent.swimlaneSettings.keyField) {
                    var swimlaneDatas = this_1.parent.getSwimlaneData(data[this_1.parent.swimlaneSettings.keyField]);
                    columnAllDatas = this_1.parent.getColumnData(columnKey, swimlaneDatas);
                    if (this_1.parent.sortSettings.direction === 'Descending') {
                        columnAllDatas = this_1.removeData(columnAllDatas, keyData);
                    }
                }
                var count = [];
                for (var j = 0; j < columnAllDatas.length; j++) {
                    if (columnAllDatas[j][this_1.parent.sortSettings.field] === order) {
                        count.push(j + 1);
                        break;
                    }
                }
                if (args.requestType === 'cardChange') {
                    finalData.push(data);
                }
                var finalCardsId = finalData.map(function (obj) { return obj[_this.parent.cardSettings.headerField]; });
                if (this_1.parent.sortSettings.direction === 'Ascending') {
                    for (var i = count[0]; i <= columnAllDatas.length; i++) {
                        var dataObj = columnAllDatas[i - 1];
                        var index = cardsId.indexOf(dataObj[this_1.parent.cardSettings.headerField]);
                        if (index === -1 && order >= dataObj[this_1.parent.sortSettings.field]) {
                            dataObj[this_1.parent.sortSettings.field] = ++order;
                            var isData = finalCardsId.indexOf(dataObj[this_1.parent.cardSettings.headerField]);
                            (isData === -1) ? finalData.push(dataObj) : finalData[isData] = dataObj;
                        }
                    }
                }
                else {
                    for (var i = count[0]; i > 0; i--) {
                        var dataObj = columnAllDatas[i - 1];
                        dataObj[this_1.parent.sortSettings.field] = ++order;
                        finalData.push(dataObj);
                    }
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, modifiedKey_1 = modifiedKey; _i < modifiedKey_1.length; _i++) {
            var columnKey = modifiedKey_1[_i];
            _loop_1(columnKey);
        }
        return finalData;
    };
    Crud.prototype.removeData = function (columnAllDatas, keyData) {
        keyData.map(function (cardObj) {
            if (columnAllDatas.indexOf(cardObj) !== -1) {
                columnAllDatas.splice(columnAllDatas.indexOf(cardObj), 1);
            }
        });
        return columnAllDatas;
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
            element: null, cloneElement: null, instance: null,
            targetClone: null, draggedClone: null, targetCloneMulti: null,
            selectedCards: [], pageX: 0, pageY: 0, navigationInterval: null, cardDetails: [], modifiedData: []
        };
        this.dragEdges = { left: false, right: false, top: false, bottom: false };
        this.isDragging = false;
    }
    DragAndDrop.prototype.wireDragEvents = function (element) {
        this.dragObj.instance = new Draggable(element, {
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
        if (!(this.dragObj.instance.enableTapHold && Browser.isDevice && Browser.isTouch)) {
            // tslint:disable-next-line:no-any
            EventHandler.remove(element, 'touchstart', this.dragObj.instance.initialize);
        }
    };
    DragAndDrop.prototype.dragHelper = function (e) {
        if (this.parent.isAdaptive && this.parent.touchModule.mobilePopup &&
            this.parent.touchModule.mobilePopup.element.classList.contains(POPUP_OPEN_CLASS)) {
            this.parent.touchModule.mobilePopup.hide();
        }
        this.dragObj.element = closest(e.sender.target, '.' + CARD_CLASS);
        if (isNullOrUndefined(this.dragObj.element)) {
            return null;
        }
        this.dragObj.element.style.width = formatUnit(this.dragObj.element.offsetWidth);
        var cloneWrapper = createElement('div', { innerHTML: this.dragObj.element.outerHTML });
        this.dragObj.cloneElement = cloneWrapper.children.item(0);
        addClass([this.dragObj.cloneElement], CLONED_CARD_CLASS);
        this.dragObj.element.parentElement.appendChild(this.dragObj.cloneElement);
        this.dragObj.targetCloneMulti = createElement('div', { className: TARGET_MULTI_CLONE_CLASS });
        this.dragObj.targetClone = createElement('div', {
            className: DROPPED_CLONE_CLASS,
            styles: 'width:' + formatUnit(this.dragObj.element.offsetWidth) + ';height:' + formatUnit(this.dragObj.element.offsetHeight)
        });
        this.dragObj.modifiedData = [];
        return this.dragObj.cloneElement;
    };
    DragAndDrop.prototype.dragStart = function (e) {
        var _this = this;
        this.dragObj.selectedCards = this.dragObj.element;
        if (this.dragObj.element.classList.contains(CARD_SELECTION_CLASS)) {
            var className = '.' + CARD_CLASS + '.' + CARD_SELECTION_CLASS + ':not(.' + CLONED_CARD_CLASS + ')';
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
                _this.dragObj.instance.intDestroy(e);
                _this.dragObj.element = null;
                _this.dragObj.targetClone = null;
                _this.dragObj.draggedClone = null;
                _this.dragObj.cloneElement = null;
                _this.dragObj.targetCloneMulti = null;
                return;
            }
            if (_this.parent.isBlazorRender()) {
                e.bindEvents(e.dragElement);
            }
            if (_this.dragObj.element.classList.contains(CARD_SELECTION_CLASS)) {
                _this.dragObj.selectedCards.forEach(function (element) { _this.draggedClone(element); });
                if (_this.dragObj.selectedCards.length > 1) {
                    _this.dragObj.cloneElement.innerHTML = '';
                    var drag$$1 = createElement('div', {
                        className: 'e-multi-card-text',
                        innerHTML: _this.dragObj.selectedCards.length + ' Cards',
                    });
                    _this.dragObj.cloneElement.appendChild(drag$$1);
                    classList(_this.dragObj.cloneElement, ['e-multi-card-clone'], [CARD_SELECTION_CLASS]);
                    _this.parent.layoutModule.disableAttributeSelection(_this.dragObj.cloneElement);
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
            className: DRAGGED_CLONE_CLASS,
            styles: 'width:' + formatUnit(element.offsetWidth - 1) + ';height:' + formatUnit(element.offsetHeight)
        });
        element.insertAdjacentElement('afterend', this.dragObj.draggedClone);
        addClass([element], DRAGGED_CARD_CLASS);
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
            var isDrag = (targetKey === this.getColumnKey(closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS)))
                ? true : false;
            if (keys.length === 1 || isDrag) {
                if (target.classList.contains(CARD_CLASS) || target.classList.contains(DRAGGED_CLONE_CLASS)) {
                    var element = target.classList.contains(DRAGGED_CLONE_CLASS) ?
                        (target.previousElementSibling.classList.contains(DRAGGED_CARD_CLASS) ? null : target.previousElementSibling)
                        : target.previousElementSibling;
                    var insertClone = 'afterend';
                    if (isNullOrUndefined(element)) {
                        var pageY = target.classList.contains(DRAGGED_CLONE_CLASS) ? (this.dragObj.pageY / 2) :
                            this.dragObj.pageY;
                        var height = target.classList.contains(DRAGGED_CLONE_CLASS) ? target.offsetHeight :
                            (target.offsetHeight / 2);
                        if ((pageY - (this.parent.element.getBoundingClientRect().top + target.offsetTop)) < height) {
                            insertClone = 'beforebegin';
                        }
                    }
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
                this.multiCloneCreate(keys, contentCell);
            }
            this.parent.notify(contentReady, {});
        }
        this.addDropping();
        var isCollapsed = false;
        if (contentCell) {
            isCollapsed = contentCell.classList.contains(COLLAPSED_CLASS) && contentCell.classList.contains(DROPPING_CLASS);
        }
        if (isCollapsed) {
            this.toggleVisible(target, undefined);
            addClass([contentCell], TOGGLE_VISIBLE_CLASS);
        }
        var tColumn = [].slice.call(this.parent.element.querySelectorAll('.' + TOGGLE_VISIBLE_CLASS));
        if (tColumn.length > 0 && !target.classList.contains(TOGGLE_VISIBLE_CLASS)
            && !closest(target, '.' + TOGGLE_VISIBLE_CLASS)) {
            this.toggleVisible(target, tColumn.slice(-1)[0]);
            removeClass(tColumn, TOGGLE_VISIBLE_CLASS);
        }
        this.parent.notify(contentReady, {});
        var cloneCell = closest(target, '.' + CONTENT_CELLS_CLASS + ':not(.' + COLLAPSED_CLASS + ')');
        if (cloneCell) {
            this.dragObj.targetClone.style.width = formatUnit((cloneCell.offsetWidth - 2) - cardSpace);
        }
        var multiKeyTarget = closest(target, '.' + MULTI_COLUMN_KEY_CLASS);
        if (multiKeyTarget) {
            var columnKeys = [].slice.call(this.parent.element.querySelectorAll('.' + MULTI_COLUMN_KEY_CLASS)).filter(function (element) { return _this.getColumnKey(element) === _this.getColumnKey(multiKeyTarget); });
            if (columnKeys.length > 0) {
                addClass(columnKeys, MULTI_ACTIVE_CLASS);
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
    DragAndDrop.prototype.multiCloneCreate = function (keys, contentCell) {
        var offsetHeight = contentCell.offsetHeight;
        var limitEle = contentCell.querySelector('.' + LIMITS_CLASS);
        if (limitEle) {
            offsetHeight -= limitEle.offsetHeight;
        }
        this.dragObj.targetCloneMulti.style.height = formatUnit(offsetHeight);
        if (contentCell.querySelector('.' + SHOW_ADD_BUTTON)) {
            addClass([contentCell.querySelector('.' + SHOW_ADD_BUTTON)], MULTI_CARD_WRAPPER_CLASS);
        }
        addClass([contentCell.querySelector('.' + CARD_WRAPPER_CLASS)], MULTI_CARD_WRAPPER_CLASS);
        contentCell.querySelector('.' + CARD_WRAPPER_CLASS).style.height = 'auto';
        contentCell.style.borderStyle = 'none';
        this.removeElement(this.dragObj.targetClone);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var colKey = createElement('div', {
                className: MULTI_COLUMN_KEY_CLASS,
                attrs: { 'data-key': key.trim() }
            });
            var text = createElement('div', { className: 'e-text', innerHTML: key.trim() });
            contentCell.appendChild(this.dragObj.targetCloneMulti).appendChild(colKey).appendChild(text);
            colKey.style.lineHeight = colKey.style.height = formatUnit((offsetHeight / keys.length));
            text.style.top = formatUnit((offsetHeight / 2) - (text.offsetHeight / 2));
        }
    };
    DragAndDrop.prototype.addDropping = function () {
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            var className = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + '):not(.' + COLLAPSED_CLASS + ')';
            var cells = [].slice.call(this.parent.element.querySelectorAll(className + ' .' + CONTENT_CELLS_CLASS));
            cells.forEach(function (cell) { return addClass([cell], DROPPING_CLASS); });
        }
        else {
            var row = closest(this.dragObj.draggedClone, '.' + CONTENT_ROW_CLASS);
            if (row) {
                [].slice.call(row.children).forEach(function (cell) { return addClass([cell], DROPPING_CLASS); });
            }
        }
        var cell = closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS);
        if (cell) {
            removeClass([cell], DROPPING_CLASS);
        }
    };
    DragAndDrop.prototype.dragStop = function (e) {
        var _this = this;
        var contentCell = closest(this.dragObj.targetClone, '.' + CONTENT_CELLS_CLASS);
        var columnKey;
        if (this.parent.element.querySelector('.' + TARGET_MULTI_CLONE_CLASS)) {
            columnKey = closest(e.target, '.' + MULTI_COLUMN_KEY_CLASS);
        }
        if (contentCell || columnKey) {
            var cardStatus_1;
            if (contentCell) {
                cardStatus_1 = this.getColumnKey(contentCell);
            }
            else {
                cardStatus_1 = this.getColumnKey(columnKey);
                contentCell = closest(columnKey, '.' + CONTENT_CELLS_CLASS);
            }
            if (this.dragObj.selectedCards instanceof HTMLElement) {
                this.updateDroppedData(this.dragObj.selectedCards, cardStatus_1, contentCell);
            }
            else {
                this.dragObj.selectedCards.forEach(function (element) {
                    _this.updateDroppedData(element, cardStatus_1, contentCell);
                });
            }
            if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                this.changeOrder(this.dragObj.modifiedData);
            }
        }
        var dragArgs = { cancel: false, data: this.dragObj.modifiedData, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(dragStop, dragArgs, function (dragEventArgs) {
            if (!dragEventArgs.cancel) {
                if (contentCell || columnKey) {
                    _this.parent.crudModule.updateCard(dragEventArgs.data);
                }
            }
            _this.removeElement(_this.dragObj.draggedClone);
            _this.removeElement(_this.dragObj.targetClone);
            _this.removeElement(_this.dragObj.cloneElement);
            var dragMultiClone = [].slice.call(_this.parent.element.querySelectorAll('.' + DRAGGED_CLONE_CLASS));
            dragMultiClone.forEach(function (clone) { return remove(clone); });
            if (_this.parent.isBlazorRender()) {
                _this.dragObj.element.style.removeProperty('width');
                _this.multiCloneRemove();
            }
            removeClass([_this.dragObj.element], DRAGGED_CARD_CLASS);
            clearInterval(_this.dragObj.navigationInterval);
            _this.dragObj.navigationInterval = null;
            if (document.body.style.cursor === 'not-allowed') {
                document.body.style.cursor = '';
            }
            var className = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ')';
            var cells = [].slice.call(_this.parent.element.querySelectorAll(className + ' .' + CONTENT_CELLS_CLASS));
            cells.forEach(function (cell) { return removeClass([cell], DROPPING_CLASS); });
            if (_this.parent.isAdaptive) {
                _this.parent.touchModule.tabHold = false;
            }
            _this.dragObj.cardDetails = _this.dragObj.modifiedData = [];
            _this.isDragging = false;
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
        this.dragObj.modifiedData.push(crudData);
    };
    DragAndDrop.prototype.changeOrder = function (modifieddata) {
        var _this = this;
        var prevele = false;
        var element = this.parent.sortSettings.direction === 'Ascending' ?
            this.dragObj.targetClone.previousElementSibling : this.dragObj.targetClone.nextElementSibling;
        if (element && !element.classList.contains(DRAGGED_CARD_CLASS) && !element.classList.contains(CLONED_CARD_CLASS)
            && !element.classList.contains(DRAGGED_CLONE_CLASS)) {
            prevele = true;
        }
        else if (this.dragObj.targetClone.nextElementSibling && this.parent.sortSettings.direction === 'Ascending') {
            element = this.dragObj.targetClone.nextElementSibling;
        }
        else if (this.dragObj.targetClone.previousElementSibling && this.parent.sortSettings.direction === 'Descending') {
            element = this.dragObj.targetClone.previousElementSibling;
        }
        else {
            return;
        }
        var obj = this.parent.getCardDetails(element);
        var keyIndex = obj[this.parent.sortSettings.field];
        if (modifieddata.length > 1 && this.parent.sortSettings.direction === 'Descending') {
            modifieddata = modifieddata.reverse();
        }
        modifieddata.forEach(function (data, index) {
            if (prevele) {
                data[_this.parent.sortSettings.field] = ++keyIndex;
            }
            else if (keyIndex !== 1 && index <= data[_this.parent.sortSettings.field]) {
                data[_this.parent.sortSettings.field] = --keyIndex;
            }
            else if (keyIndex === 1) {
                data[_this.parent.sortSettings.field] = index + 1;
            }
        });
    };
    DragAndDrop.prototype.toggleVisible = function (target, tColumn) {
        var _this = this;
        var headerCells = '.' + HEADER_CELLS_CLASS + ':not(.' + STACKED_HEADER_CELL_CLASS + ')';
        var lists = [].slice.call(this.parent.element.querySelectorAll(headerCells));
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
        var cloneMulti = [].slice.call(this.parent.element.querySelectorAll('.' + TARGET_MULTI_CLONE_CLASS));
        if (cloneMulti.length > 0) {
            var columnKey = [].slice.call(this.parent.element.querySelectorAll('.' + MULTI_COLUMN_KEY_CLASS));
            columnKey.forEach(function (node) { return remove(node); });
            cloneMulti.forEach(function (node) {
                var cell = closest(node, '.' + CONTENT_CELLS_CLASS);
                if (cell) {
                    cell.style.borderStyle = '';
                    if (cell.querySelector('.' + SHOW_ADD_BUTTON)) {
                        removeClass([cell.querySelector('.' + SHOW_ADD_BUTTON)], MULTI_CARD_WRAPPER_CLASS);
                    }
                    removeClass([cell.querySelector('.' + CARD_WRAPPER_CLASS)], MULTI_CARD_WRAPPER_CLASS);
                }
            });
            this.removeElement(this.dragObj.targetCloneMulti);
        }
    };
    DragAndDrop.prototype.calculateArgs = function (e) {
        var eventArgs = this.getPageCoordinates(e);
        this.dragObj.pageY = eventArgs.pageY;
        this.dragObj.pageX = eventArgs.pageX;
        this.isDragging = true;
        if (this.parent.isAdaptive && this.parent.tooltipModule) {
            this.parent.tooltipModule.tooltipObj.close();
        }
    };
    DragAndDrop.prototype.getPageCoordinates = function (e) {
        var eventArgs = e.event;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            eventArgs || e;
    };
    DragAndDrop.prototype.getColumnKey = function (target) {
        if (target && target.getAttribute('data-key')) {
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
 * Dialog module is used to perform card actions.
 * @hidden
 */
var KanbanDialog = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for dialog module
     * @private
     */
    function KanbanDialog(parent) {
        this.parent = parent;
    }
    KanbanDialog.prototype.openDialog = function (action, data) {
        this.action = action;
        this.parent.activeCardData.data = data;
        this.renderDialog(data, action);
        this.dialogObj.show();
    };
    KanbanDialog.prototype.closeDialog = function () {
        this.dialogObj.hide();
    };
    KanbanDialog.prototype.renderDialog = function (args, action) {
        this.element = createElement('div', { id: this.parent.element.id + '_dialog_wrapper' });
        this.parent.element.appendChild(this.element);
        var dialogModel = {
            buttons: this.getDialogButtons(action),
            content: this.getDialogContent(args, action),
            cssClass: DIALOG_CLASS,
            enableRtl: this.parent.enableRtl,
            header: this.parent.localeObj.getConstant(action === 'Add' ? 'addTitle' : action === 'Edit' ? 'editTitle' : 'deleteTitle'),
            height: 'auto',
            isModal: true,
            showCloseIcon: true,
            width: (action === 'Delete') ? 400 : 350,
            visible: false,
            beforeOpen: this.onBeforeDialogOpen.bind(this),
            beforeClose: this.onBeforeDialogClose.bind(this)
        };
        this.dialogObj = new Dialog(extend(dialogModel, action !== 'Delete' ? (this.parent.dialogSettings.model || {}) : {}), this.element);
        if (action !== 'Delete') {
            this.applyFormValidation();
        }
        this.dialogObj.element.querySelector('.e-dlg-closeicon-btn').title = this.parent.localeObj.getConstant('close');
    };
    KanbanDialog.prototype.getDialogContent = function (args, action) {
        if (action === 'Delete') {
            return this.parent.localeObj.getConstant('deleteContent');
        }
        else {
            var container = createElement('div', { className: FORM_WRAPPER_CLASS });
            var form = createElement('form', {
                id: this.parent.element.id + 'EditForm',
                className: FORM_CLASS, attrs: { onsubmit: 'return false;' }
            });
            if (this.parent.dialogSettings.template) {
                if (args) {
                    this.destroyComponents();
                    [].slice.call(form.childNodes).forEach(function (node) { return remove(node); });
                }
                append(this.parent.templateParser(this.parent.dialogSettings.template)(args), form);
            }
            else {
                var dialogWrapper = createElement('div', { className: DIALOG_CONTENT_CONTAINER });
                form.appendChild(dialogWrapper);
                var table = createElement('table');
                dialogWrapper.appendChild(table);
                var dialogFields = this.getDialogFields();
                for (var _i = 0, dialogFields_1 = dialogFields; _i < dialogFields_1.length; _i++) {
                    var field = dialogFields_1[_i];
                    var tr = createElement('tr');
                    table.appendChild(tr);
                    tr.appendChild(createElement('td', { className: 'e-label', innerHTML: field.text ? field.text : field.key }));
                    var td = createElement('td');
                    tr.appendChild(td);
                    td.appendChild(this.renderComponents(field));
                }
            }
            container.appendChild(form);
            return container;
        }
    };
    KanbanDialog.prototype.getDialogFields = function () {
        var fields = this.parent.dialogSettings.fields;
        if (fields.length === 0) {
            fields = [
                { text: 'ID', key: this.parent.cardSettings.headerField, type: 'TextBox' },
                { key: this.parent.keyField, type: 'DropDown' },
                { key: this.parent.cardSettings.contentField, type: 'TextArea' }
            ];
            if (this.parent.sortSettings.sortBy !== 'DataSourceOrder') {
                fields.splice(fields.length - 1, 0, { key: this.parent.sortSettings.field, type: 'TextBox' });
            }
            if (this.parent.swimlaneSettings.keyField) {
                fields.splice(fields.length - 1, 0, { key: this.parent.swimlaneSettings.keyField, type: 'DropDown' });
            }
        }
        return fields;
    };
    KanbanDialog.prototype.getDialogButtons = function (action) {
        var primaryButtonClass = action === 'Delete' ? 'e-dialog-yes' : action === 'Add' ? 'e-dialog-add' : 'e-dialog-edit';
        var flatButtonClass = action === 'Delete' ? 'e-dialog-no' : 'e-dialog-cancel';
        var dialogButtons = [
            {
                buttonModel: {
                    cssClass: 'e-flat ' + primaryButtonClass, isPrimary: true,
                    content: this.parent.localeObj.getConstant(action === 'Add' || action === 'Edit' ? 'save' : 'yes')
                },
                click: this.dialogButtonClick.bind(this)
            }, {
                buttonModel: {
                    cssClass: 'e-flat ' + flatButtonClass, isPrimary: false,
                    content: this.parent.localeObj.getConstant(action === 'Add' || action === 'Edit' ? 'cancel' : 'no')
                },
                click: this.dialogButtonClick.bind(this)
            }
        ];
        if (action === 'Edit') {
            var deleteButton = {
                buttonModel: { cssClass: 'e-flat e-dialog-delete', isPrimary: false, content: this.parent.localeObj.getConstant('delete') },
                click: this.dialogButtonClick.bind(this)
            };
            dialogButtons.splice(0, 0, deleteButton);
        }
        return dialogButtons;
    };
    KanbanDialog.prototype.renderComponents = function (field) {
        var wrapper = createElement('div', { className: field.key + '_wrapper' });
        var element = createElement('input', { className: FIELD_CLASS, attrs: { 'name': field.key } });
        wrapper.appendChild(element);
        var controlObj;
        var fieldValue = this.parent.activeCardData.data ? this.parent.activeCardData.data[field.key] : null;
        switch (field.type) {
            case 'DropDown':
                var dropDownOptions = void 0;
                if (field.key === this.parent.keyField) {
                    dropDownOptions = {
                        dataSource: this.parent.layoutModule.columnKeys,
                        value: fieldValue
                    };
                }
                else if (field.key === this.parent.swimlaneSettings.keyField) {
                    dropDownOptions = {
                        dataSource: [].slice.call(this.parent.layoutModule.kanbanRows),
                        fields: { text: 'textField', value: 'keyField' },
                        value: fieldValue
                    };
                }
                controlObj = new DropDownList(dropDownOptions);
                break;
            case 'Numeric':
                controlObj = new NumericTextBox({ value: fieldValue });
                break;
            case 'TextBox':
                controlObj = new TextBox({ value: fieldValue });
                if (fieldValue && this.parent.cardSettings.headerField === field.key) {
                    controlObj.enabled = false;
                }
                break;
            case 'TextArea':
                remove(element);
                var divElement = createElement('div');
                element = createElement('textarea', {
                    className: FIELD_CLASS, attrs: { 'name': field.key, 'rows': '3' },
                    innerHTML: fieldValue
                });
                wrapper.appendChild(divElement).appendChild(element);
                break;
            default:
                break;
        }
        if (controlObj) {
            controlObj.appendTo(element);
        }
        return wrapper;
    };
    KanbanDialog.prototype.onBeforeDialogOpen = function (args) {
        var eventProp = {
            data: this.parent.activeCardData.data,
            cancel: false, element: this.element,
            target: this.parent.activeCardData.element,
            requestType: this.action
        };
        this.storeElement = document.activeElement;
        if (parseInt(args.maxHeight, 10) <= 250) {
            args.maxHeight = '250px';
        }
        this.parent.trigger(dialogOpen, eventProp, function (openArgs) { return args.cancel = openArgs.cancel; });
    };
    KanbanDialog.prototype.onBeforeDialogClose = function (args) {
        var _this = this;
        var formInputs = this.getFormElements();
        var cardObj = {};
        for (var _i = 0, formInputs_1 = formInputs; _i < formInputs_1.length; _i++) {
            var input = formInputs_1[_i];
            var columnName = input.name || this.getColumnName(input);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                var value = this.getValueFromElement(input);
                if (columnName === this.parent.cardSettings.headerField) {
                    value = this.getIDType() === 'string' ? value : parseInt(value, 10);
                }
                cardObj[columnName] = value;
            }
        }
        var eventProp = { data: cardObj, cancel: false, element: this.element, requestType: this.action };
        this.parent.trigger(dialogClose, eventProp, function (closeArgs) {
            args.cancel = closeArgs.cancel;
            if (!closeArgs.cancel) {
                _this.cardData = eventProp.data;
                _this.destroy();
            }
        });
    };
    KanbanDialog.prototype.getIDType = function () {
        if (this.parent.kanbanData.length !== 0) {
            return typeof (this.parent.kanbanData[0][this.parent.cardSettings.headerField]);
        }
        return 'string';
    };
    KanbanDialog.prototype.applyFormValidation = function () {
        var _this = this;
        var form = this.element.querySelector('.' + FORM_CLASS);
        var rules = {};
        for (var _i = 0, _a = this.parent.dialogSettings.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            rules[field.key] = (field.validationRules && Object.keys(field.validationRules).length > 0) ? field.validationRules : null;
        }
        this.formObj = new FormValidator(form, {
            rules: rules,
            customPlacement: function (inputElement, error) {
                var id = error.getAttribute('for');
                var elem = _this.element.querySelector('#' + id + '_Error');
                if (!elem) {
                    _this.createTooltip(inputElement, error, id, '');
                }
            },
            validationComplete: function (args) {
                var elem = _this.element.querySelector('#' + args.inputName + '_Error');
                if (elem) {
                    elem.style.display = (args.status === 'failure') ? '' : 'none';
                }
            }
        });
    };
    KanbanDialog.prototype.createTooltip = function (element, error, name, display) {
        var dlgContent;
        var client;
        var inputClient = element.parentElement.getBoundingClientRect();
        if (this.element.classList.contains(DIALOG_CLASS)) {
            dlgContent = this.element;
            client = this.element.getBoundingClientRect();
        }
        else {
            dlgContent = this.element.querySelector('.e-kanban-dialog .e-dlg-content');
            client = dlgContent.getBoundingClientRect();
        }
        var div = createElement('div', {
            className: 'e-tooltip-wrap e-popup ' + ERROR_VALIDATION_CLASS,
            id: name + '_Error',
            styles: 'display:' + display + ';top:' +
                (inputClient.bottom - client.top + dlgContent.scrollTop + 9) + 'px;left:' +
                (inputClient.left - client.left + dlgContent.scrollLeft + inputClient.width / 2) + 'px;'
        });
        var content = createElement('div', { className: 'e-tip-content' });
        content.appendChild(error);
        var arrow = createElement('div', { className: 'e-arrow-tip e-tip-top' });
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-outer e-tip-top' }));
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-inner e-tip-top' }));
        div.appendChild(content);
        div.appendChild(arrow);
        dlgContent.appendChild(div);
        div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
    };
    KanbanDialog.prototype.destroyToolTip = function () {
        if (this.element) {
            this.element.querySelectorAll('.' + ERROR_VALIDATION_CLASS).forEach(function (node) { return remove(node); });
        }
        if (this.formObj && this.formObj.element) {
            this.formObj.reset();
        }
    };
    KanbanDialog.prototype.dialogButtonClick = function (event) {
        var target = event.target.cloneNode(true);
        var id = this.formObj.element.id;
        if (document.getElementById(id) && this.formObj.validate() &&
            (target.classList.contains('e-dialog-edit') || target.classList.contains('e-dialog-add'))) {
            this.dialogObj.hide();
            if (target.classList.contains('e-dialog-edit')) {
                this.parent.crudModule.updateCard(this.cardData);
            }
            if (target.classList.contains('e-dialog-add')) {
                this.parent.crudModule.addCard(this.cardData);
            }
            this.cardData = null;
        }
        if (!target.classList.contains('e-dialog-edit') && !target.classList.contains('e-dialog-add')) {
            this.dialogObj.hide();
            if (target.classList.contains('e-dialog-yes')) {
                this.parent.crudModule.deleteCard(this.parent.activeCardData.data);
            }
            else if (target.classList.contains('e-dialog-no')) {
                this.openDialog('Edit', this.parent.activeCardData.data);
            }
            else if (target.classList.contains('e-dialog-delete')) {
                this.openDialog('Delete', this.parent.activeCardData.data);
            }
        }
    };
    KanbanDialog.prototype.getFormElements = function () {
        var elements = [].slice.call(this.element.querySelectorAll('.' + FIELD_CLASS));
        var validElements = [];
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            if (element.classList.contains('e-control')) {
                validElements.push(element);
            }
            else if (element.querySelector('.e-control')) {
                validElements.push(element.querySelector('.e-control'));
            }
            else {
                validElements.push(element);
            }
        }
        return validElements;
    };
    KanbanDialog.prototype.getColumnName = function (element) {
        var attrName = element.getAttribute('data-name') || '';
        if (attrName === '') {
            var isDropDowns = false;
            var fieldSelector = '';
            if (element.classList.contains('e-dropdownlist') || element.classList.contains('e-multiselect')) {
                fieldSelector = element.classList.contains('e-dropdownlist') ? 'e-ddl' : 'e-multiselect';
                isDropDowns = true;
            }
            else if (element.classList.contains('e-numerictextbox')) {
                fieldSelector = 'e-numeric';
            }
            var classSelector = isDropDowns ? "." + fieldSelector + ":not(.e-control)" : "." + fieldSelector;
            var control = closest(element, classSelector) || element.querySelector("." + fieldSelector);
            if (control) {
                var attrEle = control.querySelector('[name]');
                if (attrEle) {
                    attrName = attrEle.name;
                }
            }
        }
        return attrName;
    };
    KanbanDialog.prototype.getValueFromElement = function (element) {
        var value;
        var instance = element.ej2_instances;
        if (instance && instance.length > 0) {
            value = instance[0].value ||
                instance[0].checked;
        }
        else {
            value = element.value;
        }
        return value;
    };
    KanbanDialog.prototype.destroyComponents = function () {
        var formelement = this.getFormElements();
        for (var _i = 0, formelement_1 = formelement; _i < formelement_1.length; _i++) {
            var element = formelement_1[_i];
            var instance = element.ej2_instances;
            if (instance && instance.length > 0) {
                instance.forEach(function (node) { return node.destroy(); });
            }
        }
    };
    KanbanDialog.prototype.destroy = function () {
        this.destroyToolTip();
        this.destroyComponents();
        if (this.dialogObj) {
            this.dialogObj.destroy();
            this.storeElement.focus();
            this.dialogObj = null;
            remove(this.element);
            this.element = null;
        }
    };
    return KanbanDialog;
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
            multiSelectionEnter: 'ctrl+13',
            multiSelectionSpace: 'ctrl+32',
            multiSelectionByUpArrow: 'shift+38',
            multiSelectionByDownArrow: 'shift+40',
            shiftTab: 'shift+tab',
            enter: '13',
            tab: 'tab',
            delete: '46',
            escape: '27',
            space: '32'
        };
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.keyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
        this.multiSelection = false;
    }
    Keyboard.prototype.keyActionHandler = function (e) {
        var _this = this;
        var selectedCard = this.parent.element.querySelectorAll("." + CARD_CLASS + "." + CARD_SELECTION_CLASS).item(0);
        if (!selectedCard && !closest(document.activeElement, "." + ROOT_CLASS)) {
            return;
        }
        switch (e.action) {
            case 'upArrow':
            case 'downArrow':
            case 'multiSelectionByUpArrow':
            case 'multiSelectionByDownArrow':
                this.processUpDownArrow(e.action, selectedCard);
                break;
            case 'rightArrow':
            case 'leftArrow':
                this.processLeftRightArrow(e);
                break;
            case 'firstCardSelection':
            case 'lastCardSelection':
                this.processCardSelection(e.action, selectedCard);
                break;
            case 'multiSelectionEnter':
            case 'multiSelectionSpace':
                if (document.activeElement) {
                    this.parent.actionModule.cardSelection(document.activeElement, true, false);
                }
                break;
            case 'space':
            case 'enter':
                this.processEnter(e, selectedCard);
                break;
            case 'escape':
                if (document.activeElement.classList.contains(CARD_CLASS) ||
                    document.activeElement.classList.contains(SHOW_ADD_BUTTON)) {
                    if (document.activeElement.classList.contains(CARD_SELECTION_CLASS)) {
                        removeClass([document.activeElement], CARD_SELECTION_CLASS);
                        document.activeElement.focus();
                    }
                    else {
                        var ele = closest(document.activeElement, '.' + CONTENT_CELLS_CLASS);
                        var cards = [].slice.call(ele.querySelectorAll('.' + CARD_CLASS));
                        removeClass(cards, CARD_SELECTION_CLASS);
                        ele.focus();
                        this.cardTabIndexRemove();
                        this.addRemoveTabIndex('Add');
                    }
                }
                break;
            case 'tab':
            case 'shiftTab':
                var contentCell = closest(document.activeElement, '.' + CONTENT_CELLS_CLASS);
                if (document.activeElement.classList.contains(CARD_CLASS)) {
                    if (!document.activeElement.nextElementSibling && e.action === 'tab') {
                        e.preventDefault();
                    }
                    if (!document.activeElement.previousElementSibling && contentCell.querySelector('.' + SHOW_ADD_BUTTON)
                        && e.action === 'tab') {
                        addClass([contentCell.querySelector('.' + SHOW_ADD_BUTTON)], SHOW_ADD_FOCUS);
                    }
                }
                if (document.activeElement.classList.contains(SHOW_ADD_BUTTON)) {
                    if ((!contentCell.querySelector('.' + CARD_CLASS) && e.action === 'tab') || e.action === 'shiftTab') {
                        e.preventDefault();
                    }
                }
                if (document.activeElement.classList.contains(ROOT_CLASS)) {
                    this.cardTabIndexRemove();
                    this.parent.keyboardModule.addRemoveTabIndex('Add');
                }
                break;
            case 'delete':
                var className = '.' + CARD_CLASS + '.' + CARD_SELECTION_CLASS;
                var selectedCards = [].slice.call(this.parent.element.querySelectorAll(className));
                var selectedCardsData_1 = [];
                selectedCards.forEach(function (selected) { selectedCardsData_1.push(_this.parent.getCardDetails(selected)); });
                this.parent.crudModule.deleteCard(selectedCardsData_1);
                break;
        }
    };
    Keyboard.prototype.processCardSelection = function (action, selectedCard) {
        if (selectedCard) {
            removeClass([selectedCard], CARD_SELECTION_CLASS);
            this.parent.layoutModule.disableAttributeSelection(selectedCard);
            var selection = this.parent.actionModule.selectionArray;
            selection.splice(selection.indexOf(selectedCard.getAttribute('data-id')), 1);
        }
        this.cardTabIndexRemove();
        var cards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_CLASS));
        var element = action === 'firstCardSelection' ? cards[0] : cards[cards.length - 1];
        this.parent.actionModule.cardSelection(element, false, false);
        this.addRemoveTabIndex('Remove');
        element.focus();
        var card = [].slice.call(closest(element, '.' + CONTENT_CELLS_CLASS).querySelectorAll('.' + CARD_CLASS));
        card.forEach(function (element) {
            element.setAttribute('tabindex', '0');
        });
    };
    Keyboard.prototype.processLeftRightArrow = function (e) {
        if (document.activeElement.classList.contains(CONTENT_CELLS_CLASS)) {
            if (e.action === 'rightArrow' && document.activeElement.nextElementSibling) {
                document.activeElement.nextElementSibling.focus();
            }
            else if (e.action === 'leftArrow' && document.activeElement.previousElementSibling) {
                document.activeElement.previousElementSibling.focus();
            }
        }
    };
    Keyboard.prototype.processUpDownArrow = function (action, selectedCard) {
        if (action === 'upArrow' && document.activeElement) {
            if (document.activeElement.classList.contains(CARD_CLASS) && document.activeElement.previousElementSibling) {
                document.activeElement.previousElementSibling.focus();
            }
            else if (document.activeElement.classList.contains(SHOW_ADD_BUTTON)) {
                document.activeElement.setAttribute('tabindex', '-1');
                removeClass([document.activeElement], SHOW_ADD_FOCUS);
                var cell = closest(document.activeElement, '.' + CONTENT_CELLS_CLASS);
                if (cell.querySelectorAll('.' + CARD_CLASS).length > 0) {
                    [].slice.call(cell.querySelectorAll('.' + CARD_CLASS)).slice(-1)[0].focus();
                }
            }
            this.removeSelection();
        }
        else if (action === 'downArrow' && document.activeElement &&
            document.activeElement.classList.contains(CARD_CLASS)) {
            if (document.activeElement.nextElementSibling) {
                document.activeElement.nextElementSibling.focus();
            }
            else if (closest(document.activeElement, '.' + CARD_WRAPPER_CLASS).nextElementSibling) {
                var ele = closest(document.activeElement, '.' + CARD_WRAPPER_CLASS).nextElementSibling;
                ele.setAttribute('tabindex', '0');
                addClass([ele], SHOW_ADD_FOCUS);
                ele.focus();
            }
            this.removeSelection();
        }
        if ((action === 'multiSelectionByUpArrow' || action === 'multiSelectionByDownArrow')
            && selectedCard && this.parent.cardSettings.selectionType === 'Multiple') {
            var card = void 0;
            if (action === 'multiSelectionByUpArrow') {
                card = document.activeElement.previousElementSibling;
            }
            else {
                card = document.activeElement.nextElementSibling;
            }
            if (card) {
                this.parent.actionModule.cardSelection(card, false, true);
                card.focus();
                this.multiSelection = true;
            }
        }
    };
    Keyboard.prototype.removeSelection = function () {
        if (this.multiSelection) {
            var cards = this.parent.getSelectedCards();
            if (cards.length > 0) {
                removeClass(cards, CARD_SELECTION_CLASS);
                this.parent.layoutModule.disableAttributeSelection(cards);
            }
            this.multiSelection = false;
        }
    };
    Keyboard.prototype.cardTabIndexRemove = function () {
        var cards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_CLASS));
        cards.forEach(function (card) {
            card.setAttribute('tabindex', '-1');
        });
        var addButton = [].slice.call(this.parent.element.querySelectorAll('.' + SHOW_ADD_BUTTON));
        addButton.forEach(function (add) {
            add.setAttribute('tabindex', '-1');
            removeClass([add], SHOW_ADD_FOCUS);
        });
    };
    Keyboard.prototype.processEnter = function (e, selectedCard) {
        var element = (e.target);
        if (element.classList.contains(HEADER_ICON_CLASS)) {
            this.parent.actionModule.columnExpandCollapse(e);
        }
        if (element.classList.contains(SWIMLANE_ROW_EXPAND_CLASS) || element.classList.contains(SWIMLANE_ROW_COLLAPSE_CLASS)) {
            this.parent.actionModule.rowExpandCollapse(e);
        }
        if (document.activeElement.classList.contains(CARD_CLASS)) {
            this.parent.actionModule.cardSelection(document.activeElement, false, false);
        }
        if (document.activeElement.classList.contains(SHOW_ADD_BUTTON)) {
            if (!this.parent.dialogModule.dialogObj) {
                this.parent.actionModule.addButtonClick(document.activeElement);
            }
            document.activeElement.focus();
        }
        if (element.classList.contains(CONTENT_CELLS_CLASS)) {
            var cards = [].slice.call(element.querySelectorAll('.' + CARD_CLASS));
            this.addRemoveTabIndex('Remove');
            if (cards.length > 0) {
                element.querySelector('.' + CARD_CLASS).focus();
                cards.forEach(function (element) {
                    element.setAttribute('tabindex', '0');
                });
            }
            if (element.querySelector('.' + SHOW_ADD_BUTTON)) {
                element.querySelector('.' + SHOW_ADD_BUTTON).setAttribute('tabindex', '0');
                element.querySelector('.' + SHOW_ADD_BUTTON).focus();
            }
        }
        if (selectedCard === document.activeElement && this.parent.element.querySelectorAll('.' + CARD_SELECTION_CLASS).length === 1) {
            this.parent.activeCardData = { data: this.parent.getCardDetails(selectedCard), element: selectedCard };
            if (!this.parent.dialogModule.dialogObj) {
                this.parent.dialogModule.openDialog('Edit', this.parent.getCardDetails(selectedCard));
            }
            selectedCard.focus();
        }
    };
    Keyboard.prototype.addRemoveTabIndex = function (action) {
        var attribute = action === 'Add' ? '0' : '-1';
        var headerIcon = [].slice.call(this.parent.element.querySelectorAll('.' + HEADER_ICON_CLASS));
        if (headerIcon.length > 0) {
            headerIcon.forEach(function (element) {
                element.setAttribute('tabindex', attribute);
            });
        }
        var swimlaneIcon = [].slice.call(this.parent.element.querySelectorAll('.' + SWIMLANE_ROW_EXPAND_CLASS));
        if (swimlaneIcon.length > 0) {
            swimlaneIcon.forEach(function (element) {
                element.setAttribute('tabindex', attribute);
            });
        }
        var className = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ') .' + CONTENT_CELLS_CLASS;
        var contentCell = [].slice.call(this.parent.element.querySelectorAll(className));
        contentCell.forEach(function (element) {
            element.setAttribute('tabindex', attribute);
        });
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
            target: '.' + TOOLTIP_TEXT_CLASS,
            beforeRender: this.onBeforeRender.bind(this)
        });
        this.tooltipObj.appendTo(this.parent.element);
        this.tooltipObj.isStringTemplate = true;
    };
    KanbanTooltip.prototype.onBeforeRender = function (args) {
        if (this.parent.dragAndDropModule.isDragging) {
            args.cancel = true;
            return;
        }
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
        var target = closest(e.originalEvent.target, '.' + CARD_CLASS);
        if (target && this.parent.cardSettings.selectionType === 'Multiple') {
            this.parent.actionModule.cardSelection(target, true, false);
            if (!this.mobilePopup) {
                this.renderMobilePopup();
                this.mobilePopup.show();
            }
            this.updatePopupContent();
        }
    };
    KanbanTouch.prototype.renderMobilePopup = function () {
        if (this.parent.cardSettings.selectionType === 'Multiple') {
            var mobilePopupWrapper = createElement('div', {
                className: POPUP_WRAPPER_CLASS + ' e-popup-close',
                innerHTML: "<div class=\"" + POPUP_HEADER_CLASS + "\"><button class=\"" + CLOSE_CLASS + "\"></button></div>" +
                    ("<div class=\"" + POPUP_CONTENT_CLASS + "\"></div>")
            });
            document.body.appendChild(mobilePopupWrapper);
            addClass([mobilePopupWrapper], DEVICE_CLASS);
            this.mobilePopup = new Popup(mobilePopupWrapper, {
                targetType: 'container',
                enableRtl: this.parent.enableRtl,
                hideAnimation: { name: 'ZoomOut' },
                showAnimation: { name: 'ZoomIn' },
                collision: { X: 'fit', Y: 'fit' },
                position: { X: 'left', Y: 'top' },
                viewPortElement: document.body,
                zIndex: 1004,
                close: this.popupClose.bind(this)
            });
            var closeIcon = this.mobilePopup.element.querySelector('.' + CLOSE_CLASS);
            var buttonObj = new Button({
                cssClass: 'e-flat e-round e-small',
                enableRtl: this.parent.enableRtl,
                iconCss: ICON_CLASS + ' ' + CLOSE_ICON_CLASS
            });
            buttonObj.appendTo(closeIcon);
            buttonObj.isStringTemplate = true;
            EventHandler.add(closeIcon, 'click', this.closeClick, this);
        }
    };
    KanbanTouch.prototype.getPopupContent = function () {
        var popupContent;
        var selectedCards = this.parent.getSelectedCards();
        if (selectedCards.length > 1) {
            popupContent = '(' + selectedCards.length + ') ' + this.parent.localeObj.getConstant('cardsSelected');
        }
        else if (selectedCards.length === 1) {
            popupContent = ' ' + this.parent.getCardDetails(selectedCards[0])[this.parent.cardSettings.headerField];
        }
        return popupContent;
    };
    KanbanTouch.prototype.updatePopupContent = function () {
        if (!this.mobilePopup) {
            return;
        }
        var popupContent = this.getPopupContent();
        if (popupContent) {
            this.mobilePopup.element.querySelector('.' + POPUP_CONTENT_CLASS).textContent = popupContent;
        }
        else {
            this.mobilePopup.hide();
        }
    };
    KanbanTouch.prototype.closeClick = function () {
        this.parent.touchModule.mobilePopup.hide();
    };
    KanbanTouch.prototype.popupClose = function () {
        this.popupDestroy();
    };
    KanbanTouch.prototype.popupDestroy = function () {
        if (this.mobilePopup && this.mobilePopup.element) {
            var instance = this.mobilePopup.element.querySelector('.e-control.e-btn').ej2_instances[0];
            if (instance) {
                instance.destroy();
            }
            this.mobilePopup.destroy();
            remove(this.mobilePopup.element);
            this.mobilePopup = null;
        }
    };
    KanbanTouch.prototype.unWireTouchEvents = function () {
        if (this.touchObj) {
            this.touchObj.destroy();
        }
        this.touchObj = null;
        this.element = null;
    };
    KanbanTouch.prototype.destroy = function () {
        this.popupDestroy();
        this.unWireTouchEvents();
        this.tabHold = false;
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
        var toolbarWrapper;
        if (this.parent.isBlazorRender()) {
            toolbarWrapper = this.parent.element.querySelector('.' + SWIMLANE_HEADER_CLASS);
        }
        else {
            toolbarWrapper = createElement('div', { className: SWIMLANE_HEADER_CLASS });
            toolbarWrapper.innerHTML = '<div class="' + SWIMLANE_HEADER_TOOLBAR_CLASS + '"><div class="' + TOOLBAR_MENU_CLASS +
                '"><div class="e-icons ' + TOOLBAR_MENU_ICON_CLASS + '"></div></div><div class="' + TOOLBAR_LEVEL_TITLE_CLASS +
                '"><div class="' + TOOLBAR_SWIMLANE_NAME_CLASS + '"></div></div></div>';
            this.parent.element.appendChild(toolbarWrapper);
        }
        EventHandler.add(toolbarWrapper.querySelector('.' + TOOLBAR_MENU_ICON_CLASS), 'click', this.menuClick, this);
    };
    MobileLayout.prototype.renderSwimlaneTree = function () {
        var treeWrapper;
        var height = this.parent.element.querySelector('.' + SWIMLANE_HEADER_CLASS).offsetHeight;
        var treeHeight = window.innerHeight - height;
        if (!this.parent.isBlazorRender()) {
            this.popupOverlay = createElement('div', { className: SWIMLANE_OVERLAY_CLASS, styles: 'height: ' + treeHeight + 'px;' });
            var wrapper = createElement('div', { className: SWIMLANE_CONTENT_CLASS, styles: 'top:' + height + 'px;' });
            treeWrapper = createElement('div', {
                className: SWIMLANE_RESOURCE_CLASS + ' e-popup-close',
                styles: 'height: ' + treeHeight + 'px;'
            });
            wrapper.appendChild(treeWrapper);
            wrapper.appendChild(this.popupOverlay);
            this.parent.element.appendChild(wrapper);
            var swimlaneTree = createElement('div', { className: SWIMLANE_TREE_CLASS });
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
        }
        else {
            this.popupOverlay = this.parent.element.querySelector('.' + SWIMLANE_CONTENT_CLASS + ' .' + SWIMLANE_OVERLAY_CLASS);
            setStyleAttribute(this.parent.element.querySelector('.' + SWIMLANE_OVERLAY_CLASS), { 'height': treeHeight + 'px' });
            setStyleAttribute(this.parent.element.querySelector('.' + SWIMLANE_CONTENT_CLASS), { 'top': height + 'px' });
            treeWrapper = this.parent.element.querySelector('.' + SWIMLANE_RESOURCE_CLASS);
            setStyleAttribute(treeWrapper, { 'height': treeHeight + 'px' });
        }
        var popupObj = {
            targetType: 'relative',
            actionOnScroll: 'none',
            enableRtl: this.parent.enableRtl,
            zIndex: 10,
            hideAnimation: { name: 'SlideLeftOut', duration: 500 },
            showAnimation: { name: 'SlideLeftIn', duration: 500 },
            viewPortElement: this.parent.element.querySelector('.' + CONTENT_CLASS)
        };
        if (!this.parent.isBlazorRender()) {
            popupObj.content = this.treeViewObj.element;
        }
        this.treePopup = new Popup(treeWrapper, popupObj);
    };
    MobileLayout.prototype.menuClick = function (event) {
        if (this.parent.element.querySelector('.' + SWIMLANE_RESOURCE_CLASS).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
        else {
            if (!this.parent.isBlazorRender()) {
                var treeNodes = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item'));
                removeClass(treeNodes, 'e-active');
                addClass([treeNodes[this.parent.layoutModule.swimlaneIndex]], 'e-active');
            }
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
    /**
     * @hidden
     */
    MobileLayout.prototype.hidePopup = function () {
        this.treePopup.hide();
        removeClass([this.popupOverlay], 'e-enable');
    };
    MobileLayout.prototype.getWidth = function () {
        return (window.innerWidth * 80) / 100;
    };
    return MobileLayout;
}());

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
/**
 * Kanban layout rendering module
 */
var LayoutRender = /** @__PURE__ @class */ (function (_super) {
    __extends$6(LayoutRender, _super);
    /**
     * Constructor for layout module
     */
    function LayoutRender(parent) {
        var _this = _super.call(this, parent) || this;
        _this.kanbanRows = [];
        _this.parent = parent;
        _this.columnKeys = [];
        _this.swimlaneIndex = 0;
        _this.swimlaneData = {};
        _this.scrollLeft = 0;
        _this.parent.on(dataReady, _this.initRender, _this);
        _this.parent.on(contentReady, _this.scrollUiUpdate, _this);
        return _this;
    }
    LayoutRender.prototype.initRender = function () {
        if (!this.parent.isBlazorRender()) {
            if (this.parent.columns.length === 0) {
                return;
            }
            this.columnData = this.getColumnCards();
            this.kanbanRows = this.getRows();
            this.swimlaneData = this.getSwimlaneCards();
        }
        if (this.parent.isAdaptive) {
            var parent_1 = this.parent.element.querySelector('.' + CONTENT_CLASS);
            if (parent_1) {
                this.scrollLeft = parent_1.scrollLeft;
            }
        }
        if (!this.parent.isBlazorRender()) {
            this.destroy();
            this.parent.on(dataReady, this.initRender, this);
            this.parent.on(contentReady, this.scrollUiUpdate, this);
        }
        if (this.parent.isAdaptive && this.parent.swimlaneSettings.keyField && this.parent.kanbanData.length !== 0) {
            this.renderSwimlaneHeader();
        }
        if (!this.parent.isBlazorRender()) {
            var header = createElement('div', { className: HEADER_CLASS });
            this.parent.element.appendChild(header);
            this.renderHeader(header);
            this.renderContent();
            this.renderCards();
            this.renderValidation();
        }
        else {
            this.initializeSwimlaneTree();
        }
        this.parent.notify(contentReady, {});
        this.wireEvents();
    };
    LayoutRender.prototype.renderHeader = function (header) {
        var headerWrap = createElement('div', { className: this.parent.swimlaneSettings.keyField ? SWIMLANE_CLASS : '' });
        header.appendChild(headerWrap);
        var headerTable = createElement('table', {
            className: TABLE_CLASS + ' ' + HEADER_TABLE_CLASS,
            attrs: { 'role': 'presentation' }
        });
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
                var index = this_1.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                var th_1 = createElement('th', {
                    className: index === -1 ? HEADER_CELLS_CLASS : HEADER_CELLS_CLASS + ' ' + COLLAPSED_CLASS,
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
                var noOfCard = this_1.columnData[column.keyField].length;
                var headerTitle = createElement('div', { className: HEADER_TITLE_CLASS });
                headerWrapper.appendChild(headerTitle);
                if (column.template) {
                    var templateArgs = {
                        keyField: column.keyField, headerText: column.headerText, minCount: column.minCount, maxCount: column.maxCount,
                        allowToggle: column.allowToggle, isExpanded: column.isExpanded, showItemCount: column.showItemCount, count: noOfCard
                    };
                    addClass([th_1], TEMPLATE_CLASS);
                    var templateHeader = this_1.parent.templateParser(column.template)(templateArgs);
                    append(templateHeader, headerTitle);
                }
                else {
                    var header_1 = createElement('div', { className: HEADER_TEXT_CLASS, innerHTML: column.headerText });
                    headerTitle.appendChild(header_1);
                    if (column.showItemCount) {
                        var itemCount = createElement('div', {
                            className: CARD_ITEM_COUNT_CLASS,
                            innerHTML: '- ' + noOfCard.toString() + ' ' + this_1.parent.localeObj.getConstant('items')
                        });
                        headerTitle.appendChild(itemCount);
                    }
                }
                if (column.allowToggle) {
                    var isExpand = (column.isExpanded && index === -1) ? true : false;
                    var name_1 = (isExpand) ? COLUMN_EXPAND_CLASS : COLUMN_COLLAPSE_CLASS;
                    var icon = createElement('div', {
                        className: HEADER_ICON_CLASS + ' ' + ICON_CLASS + ' ' + name_1,
                        attrs: { 'tabindex': '0' }
                    });
                    icon.setAttribute('aria-label', isExpand ? column.keyField + ' Expand' : column.keyField + ' Collapse');
                    th_1.setAttribute('aria-expanded', isExpand.toString());
                    headerWrapper.appendChild(icon);
                }
                var dataObj = [{ keyField: column.keyField, textField: column.headerText, count: noOfCard }];
                var args = { data: dataObj, element: tr, cancel: false, requestType: 'headerRow' };
                this_1.parent.trigger(queryCellInfo, args, function (columnArgs) {
                    if (!columnArgs.cancel) {
                        tr.appendChild(th_1);
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
        var contentTable = createElement('table', {
            className: TABLE_CLASS + ' ' + CONTENT_TABLE_CLASS,
            attrs: { 'role': 'presentation' }
        });
        contentWrap.appendChild(contentTable);
        this.renderColGroup(contentTable);
        var tBody = createElement('tbody');
        contentTable.appendChild(tBody);
        var className;
        var isCollaspsed = false;
        this.swimlaneRow = this.kanbanRows;
        this.initializeSwimlaneTree();
        var _loop_2 = function (row) {
            if (this_2.parent.swimlaneSettings.keyField && this_2.parent.swimlaneToggleArray.length !== 0) {
                var index = this_2.parent.swimlaneToggleArray.indexOf(row.keyField);
                isCollaspsed = index !== -1;
            }
            className = isCollaspsed ? CONTENT_ROW_CLASS + ' ' + COLLAPSED_CLASS : CONTENT_ROW_CLASS;
            var tr = createElement('tr', { className: className, attrs: { 'aria-expanded': 'true' } });
            if (this_2.parent.swimlaneSettings.keyField && !this_2.parent.isAdaptive && row.keyField !== '') {
                this_2.renderSwimlaneRow(tBody, row, isCollaspsed);
            }
            for (var _i = 0, _a = this_2.parent.columns; _i < _a.length; _i++) {
                var column = _a[_i];
                if (this_2.isColumnVisible(column)) {
                    var index = this_2.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                    var className_1 = index === -1 ? CONTENT_CELLS_CLASS : CONTENT_CELLS_CLASS + ' ' + COLLAPSED_CLASS;
                    var td = createElement('td', {
                        className: className_1,
                        attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField, 'aria-expanded': 'true', 'tabindex': '0' }
                    });
                    if (column.allowToggle && !column.isExpanded || index !== -1) {
                        addClass([td], COLLAPSED_CLASS);
                        var text = (column.showItemCount ? '[' +
                            this_2.getColumnData(column.keyField, this_2.swimlaneData[row.keyField]).length + '] ' : '') + column.headerText;
                        td.appendChild(createElement('div', { className: COLLAPSE_HEADER_TEXT_CLASS, innerHTML: text }));
                        td.setAttribute('aria-expanded', 'false');
                    }
                    if (column.showAddButton) {
                        var button = createElement('div', { className: SHOW_ADD_BUTTON, attrs: { 'tabindex': '-1' } });
                        button.appendChild(createElement('div', { className: SHOW_ADD_ICON + ' ' + ICON_CLASS }));
                        td.appendChild(button);
                    }
                    tr.appendChild(td);
                }
            }
            var dataObj = [{ keyField: row.keyField, textField: row.textField, count: row.count }];
            var args = { data: dataObj, element: tr, cancel: false, requestType: 'contentRow' };
            this_2.parent.trigger(queryCellInfo, args, function (columnArgs) {
                if (!columnArgs.cancel) {
                    tBody.appendChild(tr);
                }
            });
        };
        var this_2 = this;
        for (var _i = 0, _a = this.swimlaneRow; _i < _a.length; _i++) {
            var row = _a[_i];
            _loop_2(row);
        }
    };
    LayoutRender.prototype.initializeSwimlaneTree = function () {
        if (this.parent.swimlaneSettings.keyField && this.parent.isAdaptive && this.parent.kanbanData.length !== 0) {
            if (!this.parent.isBlazorRender()) {
                this.swimlaneRow = [this.kanbanRows[this.swimlaneIndex]];
                this.renderSwimlaneTree();
                this.parent.element.querySelector('.' + TOOLBAR_SWIMLANE_NAME_CLASS).innerHTML = this.swimlaneRow[0].textField;
            }
            else {
                this.renderSwimlaneTree();
            }
        }
    };
    LayoutRender.prototype.renderSwimlaneRow = function (tBody, row, isCollapsed) {
        var name = CONTENT_ROW_CLASS + ' ' + SWIMLANE_ROW_CLASS;
        var className = isCollapsed ? ' ' + COLLAPSED_CLASS : '';
        var tr = createElement('tr', {
            className: name + className, attrs: {
                'data-key': row.keyField,
                'aria-expanded': (!isCollapsed).toString()
            }
        });
        var col = this.parent.columns.length - this.parent.actionModule.hideColumnKeys.length;
        var td = createElement('td', {
            className: CONTENT_CELLS_CLASS,
            attrs: { 'data-role': 'kanban-column', 'colspan': col.toString() }
        });
        var swimlaneHeader = createElement('div', { className: SWIMLANE_HEADER_CLASS });
        td.appendChild(swimlaneHeader);
        var iconClass = isCollapsed ? SWIMLANE_ROW_COLLAPSE_CLASS : SWIMLANE_ROW_EXPAND_CLASS;
        var iconDiv = createElement('div', {
            className: ICON_CLASS + ' ' + iconClass, attrs: {
                'tabindex': '0',
                'aria-label': isCollapsed ? row.keyField + ' Collapse' : row.keyField + ' Expand'
            }
        });
        swimlaneHeader.appendChild(iconDiv);
        var headerWrap = createElement('div', { className: HEADER_WRAP_CLASS });
        swimlaneHeader.appendChild(headerWrap);
        var cardCount = this.swimlaneData[row.keyField].length;
        if (this.parent.swimlaneSettings.template) {
            var templateArgs = extend({}, row, { count: cardCount }, true);
            addClass([td], TEMPLATE_CLASS);
            var swimlaneTemplate = this.parent.templateParser(this.parent.swimlaneSettings.template)(templateArgs);
            append(swimlaneTemplate, headerWrap);
        }
        else {
            headerWrap.appendChild(createElement('div', {
                className: SWIMLANE_ROW_TEXT_CLASS,
                innerHTML: row.textField,
                attrs: { 'data-role': row.textField }
            }));
        }
        if (this.parent.swimlaneSettings.showItemCount) {
            swimlaneHeader.appendChild(createElement('div', {
                className: CARD_ITEM_COUNT_CLASS,
                innerHTML: "- " + cardCount.toString() + " " + this.parent.localeObj.getConstant('items')
            }));
        }
        tr.appendChild(td);
        var dataObj = [{ keyField: row.keyField, textField: row.textField, count: row.count }];
        var args = { data: dataObj, element: tr, cancel: false, requestType: 'swimlaneRow' };
        this.parent.trigger(queryCellInfo, args, function (columnArgs) {
            if (!columnArgs.cancel) {
                tBody.appendChild(tr);
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
                    var columnData = _this.parent.swimlaneSettings.keyField ?
                        _this.getColumnData(column.keyField, _this.swimlaneData[rows[index].keyField]) : _this.columnData[column.keyField];
                    dataCount += columnData.length;
                    var columnWrapper = tr.querySelector('[data-key="' + column.keyField + '"]');
                    var cardWrapper_1 = createElement('div', { className: CARD_WRAPPER_CLASS });
                    columnWrapper.appendChild(cardWrapper_1);
                    var _loop_4 = function (data) {
                        var cardText = data[_this.parent.cardSettings.headerField];
                        var cardIndex = _this.parent.actionModule.selectionArray.indexOf(cardText);
                        var className = cardIndex === -1 ? '' : ' ' + CARD_SELECTION_CLASS;
                        var cardElement = createElement('div', {
                            className: CARD_CLASS + className,
                            attrs: {
                                'data-id': data[_this.parent.cardSettings.headerField], 'data-key': data[_this.parent.keyField],
                                'aria-selected': 'false', 'tabindex': '-1'
                            }
                        });
                        if (cardIndex !== -1) {
                            cardElement.setAttribute('aria-selected', 'true');
                        }
                        if (_this.parent.cardSettings.template) {
                            addClass([cardElement], TEMPLATE_CLASS);
                            var cardTemplate = _this.parent.templateParser(_this.parent.cardSettings.template)(data);
                            append(cardTemplate, cardElement);
                        }
                        else {
                            var tooltipClass = _this.parent.enableTooltip ? ' ' + TOOLTIP_TEXT_CLASS : '';
                            if (_this.parent.cardSettings.showHeader) {
                                var cardHeader = createElement('div', { className: CARD_HEADER_CLASS });
                                var cardCaption = createElement('div', { className: CARD_HEADER_TEXT_CLASS });
                                var cardText_1 = createElement('div', {
                                    className: CARD_HEADER_TITLE_CLASS + tooltipClass,
                                    innerHTML: data[_this.parent.cardSettings.headerField] || ''
                                });
                                cardHeader.appendChild(cardCaption);
                                cardCaption.appendChild(cardText_1);
                                cardElement.appendChild(cardHeader);
                            }
                            var cardContent = createElement('div', {
                                className: CARD_CONTENT_CLASS + tooltipClass,
                                innerHTML: data[_this.parent.cardSettings.contentField] || ''
                            });
                            cardElement.appendChild(cardContent);
                            if (_this.parent.cardSettings.tagsField && data[_this.parent.cardSettings.tagsField]) {
                                var cardTags = createElement('div', { className: CARD_TAGS_CLASS });
                                var tags = data[_this.parent.cardSettings.tagsField].toString().split(',');
                                for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
                                    var tag = tags_1[_i];
                                    cardTags.appendChild(createElement('div', {
                                        className: CARD_TAG_CLASS + ' ' + CARD_LABEL_CLASS,
                                        innerHTML: tag
                                    }));
                                }
                                cardElement.appendChild(cardTags);
                            }
                            if (_this.parent.cardSettings.grabberField && data[_this.parent.cardSettings.grabberField]) {
                                addClass([cardElement], CARD_COLOR_CLASS);
                                cardElement.style.borderLeftColor = data[_this.parent.cardSettings.grabberField];
                            }
                            if (_this.parent.cardSettings.footerCssField) {
                                var cardFields = createElement('div', { className: CARD_FOOTER_CLASS });
                                var keys = data[_this.parent.cardSettings.footerCssField].split(',');
                                for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
                                    var key = keys_1[_a];
                                    cardFields.appendChild(createElement('div', {
                                        className: key.trim() + ' ' + CARD_FOOTER_CSS_CLASS
                                    }));
                                }
                                cardElement.appendChild(cardFields);
                            }
                        }
                        var args = { data: data, element: cardElement, cancel: false };
                        _this.parent.trigger(cardRendered, args, function (cardArgs) {
                            if (!cardArgs.cancel) {
                                cardWrapper_1.appendChild(cardElement);
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
            if (dataCount === 0) {
                removeTrs.push(tr);
                if (swimlaneRows.length > 0) {
                    removeTrs.push(swimlaneRows[index]);
                }
            }
        });
        if (!this.parent.swimlaneSettings.showEmptyRow && (this.parent.kanbanData.length === 0 && !this.parent.showEmptyColumn)) {
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
                if (!_this.parent.swimlaneSettings.showEmptyRow) {
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
            kanbanRows.sort(function (firstRow, secondRow) {
                var first = firstRow.textField.toLowerCase();
                var second = secondRow.textField.toLowerCase();
                return (first > second) ? 1 : ((second > first) ? -1 : 0);
            });
            if (this.parent.swimlaneSettings.sortDirection === 'Descending') {
                kanbanRows.reverse();
            }
            kanbanRows.forEach(function (row) {
                row.count = _this.parent.kanbanData.filter(function (obj) {
                    return _this.columnKeys.indexOf(obj[_this.parent.keyField]) > -1 &&
                        obj[_this.parent.swimlaneSettings.keyField] === row.keyField;
                }).length;
            });
            if (kanbanRows.length === 0) {
                kanbanRows.push({ keyField: '', textField: '' });
            }
        }
        else {
            kanbanRows.push({ keyField: '', textField: '' });
        }
        return kanbanRows;
    };
    LayoutRender.prototype.createStackedRow = function (rows) {
        var tr = createElement('tr', { className: HEADER_ROW_CLASS + ' ' + STACKED_HEADER_ROW_CLASS });
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
                className: HEADER_CELLS_CLASS + ' ' + STACKED_HEADER_CELL_CLASS,
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
            var swimlaneToolbar = this.parent.element.querySelector('.' + SWIMLANE_HEADER_CLASS);
            if (swimlaneToolbar) {
                height -= swimlaneToolbar.offsetHeight;
            }
            var cardWrappers = [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_CELLS_CLASS));
            cardWrappers.forEach(function (cell) {
                var cardWrapper = cell.querySelector('.' + CARD_WRAPPER_CLASS);
                if (!cardWrapper.classList.contains(MULTI_CARD_WRAPPER_CLASS)) {
                    cardWrapper.style.height = formatUnit(height);
                    EventHandler.add(cell, 'touchmove', _this.onAdaptiveScroll, _this);
                }
            });
        }
        if (this.parent.height !== 'auto' && this.parent.height !== '100%') {
            content.style.height = formatUnit(height);
        }
        [].slice.call(header.children).forEach(function (node) {
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
        if (this.parent.touchModule.tabHold && !this.parent.touchModule.mobilePopup) {
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
            if (target.querySelector('.' + CARD_WRAPPER_CLASS)) {
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
                colorClass = MAX_COLOR_CLASS;
            }
            else if (column.minCount && count < column.minCount) {
                colorClass = MIN_COLOR_CLASS;
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
                _this.swimlaneRow.forEach(function (row, index) {
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
    LayoutRender.prototype.getColumnData = function (columnValue, dataSource) {
        var _this = this;
        if (dataSource === void 0) { dataSource = this.parent.kanbanData; }
        var cardData = [];
        var columnKeys = columnValue.split(',');
        var _loop_5 = function (key) {
            var keyData = dataSource.filter(function (cardObj) { return cardObj[_this.parent.keyField] === key.trim(); });
            cardData = cardData.concat(keyData);
        };
        for (var _i = 0, columnKeys_1 = columnKeys; _i < columnKeys_1.length; _i++) {
            var key = columnKeys_1[_i];
            _loop_5(key);
        }
        this.sortCategory(cardData);
        return cardData;
    };
    LayoutRender.prototype.sortCategory = function (cardData) {
        var key;
        var direction = this.parent.sortSettings.direction;
        switch (this.parent.sortSettings.sortBy) {
            case 'DataSourceOrder':
                if (direction === 'Descending') {
                    cardData.reverse();
                }
                break;
            case 'Custom':
            case 'Index':
                if (this.parent.sortSettings.field) {
                    key = this.parent.sortSettings.field;
                    if (this.parent.sortSettings.sortBy === 'Custom') {
                        direction = this.parent.sortSettings.direction;
                    }
                    this.sortOrder(key, direction, cardData);
                }
                break;
        }
        return cardData;
    };
    LayoutRender.prototype.sortOrder = function (key, direction, cardData) {
        var isNumeric;
        if (this.parent.kanbanData.length > 0) {
            isNumeric = typeof this.parent.kanbanData[0][key] === 'number';
        }
        else {
            isNumeric = true;
        }
        if (!isNumeric && this.parent.sortSettings.sortBy === 'Index') {
            return cardData;
        }
        var first;
        var second;
        cardData = cardData.sort(function (firstData, secondData) {
            if (!isNumeric) {
                first = firstData[key].toLowerCase();
                second = secondData[key].toLowerCase();
            }
            else {
                first = firstData[key];
                second = secondData[key];
            }
            return (first > second) ? 1 : ((second > first) ? -1 : 0);
        });
        if (direction === 'Descending') {
            cardData.reverse();
        }
        return cardData;
    };
    LayoutRender.prototype.documentClick = function (args) {
        if (args.target.classList.contains(SWIMLANE_OVERLAY_CLASS) &&
            this.parent.element.querySelector('.' + SWIMLANE_RESOURCE_CLASS).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
        if (closest(args.target, "." + ROOT_CLASS)) {
            return;
        }
        var cards = [].slice.call(this.parent.element.querySelectorAll("." + CARD_CLASS + "." + CARD_SELECTION_CLASS));
        removeClass(cards, CARD_SELECTION_CLASS);
        this.disableAttributeSelection(cards);
    };
    LayoutRender.prototype.disableAttributeSelection = function (cards) {
        if (cards instanceof Element) {
            cards.setAttribute('aria-selected', 'false');
        }
        else {
            cards.forEach(function (card) {
                card.setAttribute('aria-selected', 'false');
            });
        }
    };
    LayoutRender.prototype.getColumnCards = function (data) {
        var _this = this;
        var columnData = {};
        this.columnKeys = [];
        this.parent.columns.forEach(function (column) {
            _this.columnKeys = _this.columnKeys.concat(column.keyField.split(',').map(function (e) { return e.trim(); }));
            var cardData = _this.getColumnData(column.keyField, data);
            columnData[column.keyField] = cardData;
        });
        return columnData;
    };
    LayoutRender.prototype.getSwimlaneCards = function () {
        var _this = this;
        var swimlaneData = {};
        if (this.parent.swimlaneSettings.keyField) {
            this.kanbanRows.forEach(function (row) {
                return swimlaneData[row.keyField] = _this.parent.kanbanData.filter(function (obj) {
                    return _this.columnKeys.indexOf(obj[_this.parent.keyField]) > -1 &&
                        obj[_this.parent.swimlaneSettings.keyField] === row.keyField;
                });
            });
        }
        return swimlaneData;
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
    LayoutRender.prototype.wireEvents = function () {
        EventHandler.add(this.parent.element, 'click', this.parent.actionModule.clickHandler, this.parent.actionModule);
        EventHandler.add(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler, this.parent.actionModule);
        EventHandler.add(document, Browser.touchStartEvent, this.documentClick, this);
        var content = this.parent.element.querySelector('.' + CONTENT_CLASS);
        EventHandler.add(content, 'scroll', this.onContentScroll, this);
        if (this.parent.isAdaptive) {
            this.parent.touchModule.wireTouchEvents();
            content.scrollLeft = this.scrollLeft;
        }
        this.wireDragEvent();
    };
    LayoutRender.prototype.unWireEvents = function () {
        EventHandler.remove(this.parent.element, 'click', this.parent.actionModule.clickHandler);
        EventHandler.remove(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler);
        EventHandler.remove(document, Browser.touchStartEvent, this.documentClick);
        var content = this.parent.element.querySelector('.' + CONTENT_CLASS);
        if (content) {
            EventHandler.remove(content, 'scroll', this.onContentScroll);
            if (this.parent.allowDragAndDrop) {
                this.unWireDragEvent();
            }
        }
        if (this.parent.isAdaptive) {
            this.parent.touchModule.unWireTouchEvents();
        }
    };
    LayoutRender.prototype.wireDragEvent = function () {
        if (this.parent.allowDragAndDrop) {
            addClass(this.parent.element.querySelectorAll('.' + CARD_CLASS), DRAGGABLE_CLASS);
            this.parent.dragAndDropModule.wireDragEvents(this.parent.element.querySelector('.' + CONTENT_CLASS));
        }
    };
    LayoutRender.prototype.unWireDragEvent = function () {
        this.parent.dragAndDropModule.unWireDragEvents(this.parent.element.querySelector('.' + CONTENT_CLASS));
    };
    LayoutRender.prototype.destroy = function () {
        this.parent.off(dataReady, this.initRender);
        this.parent.off(contentReady, this.scrollUiUpdate);
        this.unWireEvents();
        var header = this.parent.element.querySelector('.' + HEADER_CLASS);
        if (header) {
            remove(header);
        }
        var content = this.parent.element.querySelector('.' + CONTENT_CLASS);
        if (content) {
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
        var swimlaneToolBarEle = this.parent.element.querySelector('.' + SWIMLANE_HEADER_CLASS);
        if (swimlaneToolBarEle) {
            remove(swimlaneToolBarEle);
        }
        var swimlaneContent = this.parent.element.querySelector('.' + SWIMLANE_CONTENT_CLASS);
        if (swimlaneContent) {
            remove(swimlaneContent);
        }
    };
    return LayoutRender;
}(MobileLayout));

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
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Holds the configuration of sort settings in kanban board.
 */
var SortSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$7(SortSettings, _super);
    function SortSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$6([
        Property('DataSourceOrder')
    ], SortSettings.prototype, "sortBy", void 0);
    __decorate$6([
        Property()
    ], SortSettings.prototype, "field", void 0);
    __decorate$6([
        Property('Ascending')
    ], SortSettings.prototype, "direction", void 0);
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
        if (!this.enablePersistence || !this.swimlaneToggleArray) {
            this.swimlaneToggleArray = [];
        }
        this.activeCardData = { data: null, element: null };
        if (!this.isBlazorRender()) {
            var defaultLocale = {
                items: 'items',
                min: 'Min',
                max: 'Max',
                cardsSelected: 'Cards Selected',
                addTitle: 'Add New Card',
                editTitle: 'Edit Card Details',
                deleteTitle: 'Delete Card',
                deleteContent: 'Are you sure you want to delete this card?',
                save: 'Save',
                delete: 'Delete',
                cancel: 'Cancel',
                yes: 'Yes',
                no: 'No',
                close: 'Close'
            };
            this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
        }
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
        return this.addOnPersist(['columns', 'dataSource', 'swimlaneToggleArray']);
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
        if (!this.isBlazorRender()) {
            var addClasses = [ROOT_CLASS];
            var removeClasses = [];
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
            this.element.setAttribute('role', 'main');
            classList(this.element, addClasses, removeClasses);
        }
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
                    if (!this.isBlazorRender()) {
                        this.refresh();
                    }
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
                    if (!this.isBlazorRender()) {
                        this.dataModule = new Data(this);
                    }
                    break;
                case 'columns':
                case 'constraintType':
                    if (!this.isBlazorRender()) {
                        this.notify(dataReady, { processedData: this.kanbanData });
                    }
                    else {
                        this.notifyChange();
                    }
                    break;
                case 'swimlaneSettings':
                    this.onSwimlaneSettingsPropertyChanged(newProp.swimlaneSettings, oldProp.swimlaneSettings);
                    break;
                case 'cardSettings':
                    this.onCardSettingsPropertyChanged(newProp.cardSettings, oldProp.cardSettings);
                    break;
                case 'allowDragAndDrop':
                    if (newProp.allowDragAndDrop) {
                        this.layoutModule.wireDragEvent();
                    }
                    else {
                        this.layoutModule.unWireDragEvent();
                    }
                    break;
                case 'enableTooltip':
                    if (this.tooltipModule) {
                        this.tooltipModule.destroy();
                        this.tooltipModule = null;
                    }
                    if (newProp.enableTooltip) {
                        this.tooltipModule = new KanbanTooltip(this);
                        if (!this.isBlazorRender()) {
                            this.layoutModule.refreshCards();
                        }
                    }
                    break;
                case 'dialogSettings':
                    if (newProp.dialogSettings) {
                        this.dialogModule = new KanbanDialog(this);
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
                    if (!this.isBlazorRender()) {
                        this.layoutModule.refreshHeaders();
                    }
                    else {
                        this.notifyChange();
                    }
                    break;
                case 'sortSettings':
                    this.notify(dataReady, { processedData: this.kanbanData });
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
                case 'sortDirection':
                    if (!this.isBlazorRender()) {
                        this.notify(dataReady, { processedData: this.kanbanData });
                    }
                    else {
                        this.notifyChange();
                    }
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
                case 'tagsField':
                case 'grabberField':
                case 'footerCssField':
                    if (!this.isBlazorRender()) {
                        this.layoutModule.refreshCards();
                    }
                    else {
                        this.notifyChange();
                    }
                    break;
                case 'selectionType':
                    var cards = this.getSelectedCards();
                    if (cards.length > 0) {
                        removeClass(cards, CARD_SELECTION_CLASS);
                        this.layoutModule.disableAttributeSelection(cards);
                    }
                    break;
            }
        }
    };
    Kanban.prototype.initializeModules = function () {
        if (!this.isBlazorRender()) {
            this.dataModule = new Data(this);
        }
        this.layoutModule = new LayoutRender(this);
        if (this.allowKeyboard) {
            this.keyboardModule = new Keyboard(this);
        }
        this.actionModule = new Action(this);
        this.crudModule = new Crud(this);
        this.dragAndDropModule = new DragAndDrop(this);
        this.dialogModule = new KanbanDialog(this);
        if (this.enableTooltip) {
            this.tooltipModule = new KanbanTooltip(this);
        }
        if (Browser.isDevice || Browser.isTouch) {
            this.touchModule = new KanbanTouch(this);
        }
    };
    Kanban.prototype.notifyChange = function () {
        // tslint:disable-next-line
        this.interopAdaptor.invokeMethodAsync('PropertyChanged');
    };
    Kanban.prototype.isDevice = function (ref) {
        if (Browser.isDevice && isBlazor() && ref) {
            // tslint:disable-next-line
            ref.invokeMethodAsync('IsDevice', true, ((window.innerWidth * 80) / 100));
        }
    };
    /**
     * @hidden
     */
    Kanban.prototype.isBlazorRender = function () {
        return isBlazor() && this.isServerRendered;
    };
    /**
     * @hidden
     */
    Kanban.prototype.updateDataSource = function (data) {
        this.kanbanData = data.Result;
    };
    /**
     * @hidden
     */
    Kanban.prototype.hideDeviceMenu = function () {
        this.layoutModule.hidePopup();
    };
    /**
     * @hidden
     */
    Kanban.prototype.dataReady = function (data) {
        this.kanbanData = data.Result;
        this.hideSpinner();
        this.notify(dataReady, { processedData: {} });
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
        this.dialogModule = null;
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
     * @deprecated
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
     * Returns the column data based on column key input.
     * @deprecated
     * @method getColumnData
     * @param {string} columnKey Accepts the column key to get the objects.
     * @returns {Object[]}
     */
    Kanban.prototype.getColumnData = function (columnKey, dataSource) {
        return this.layoutModule.getColumnCards(dataSource)[columnKey] || [];
    };
    /**
     * Returns the swimlane column data based on swimlane keyField input.
     * @deprecated
     * @method getSwimlaneData
     * @param {string} keyField Accepts the swimlane keyField to get the objects.
     * @returns {Object[]}
     */
    Kanban.prototype.getSwimlaneData = function (keyField) {
        return this.layoutModule.getSwimlaneCards()[keyField] || [];
    };
    /**
     * Gets the list of selected cards from the board.
     * @method getSelectedCards
     * @returns {HTMLElement[]}
     */
    Kanban.prototype.getSelectedCards = function () {
        return [].slice.call(this.element.querySelectorAll('.' + CARD_CLASS + '.' + CARD_SELECTION_CLASS));
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
     * To manually open the dialog.
     * @deprecated
     * @method openDialog
     * @param {CurrentAction} action Defines the action for which the dialog needs to be opened such as either for new card creation or
     *  editing of existing cards. The applicable action names are `Add` and `Edit`.
     * @param {Object} data It can be card data.
     * @returns {void}
     */
    Kanban.prototype.openDialog = function (action, data) {
        this.dialogModule.openDialog(action, data);
    };
    /**
     * To manually close the dialog.
     * @deprecated
     * @method closeDialog
     * @returns {void}
     */
    Kanban.prototype.closeDialog = function () {
        this.dialogModule.closeDialog();
    };
    /**
     * Adds the new card to the data source of Kanban and layout.
     * @method addCard
     * @param {{[key: string]: Object}} cardData Single card objects to be added into Kanban.
     * @param {{[key: string]: Object}[]} cardData Collection of card objects to be added into Kanban.
     * @returns {void}
     */
    Kanban.prototype.addCard = function (cardData) {
        this.crudModule.addCard(cardData);
    };
    /**
     * Updates the changes made in the card object by passing it as a parameter to the data source.
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
     * @deprecated
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
     * @deprecated
     * @method deleteColumn
     * @param {number} index Defines the index of column to delete the existing column from Kanban board.
     * @returns {void}
     */
    Kanban.prototype.deleteColumn = function (index) {
        this.actionModule.deleteColumn(index);
    };
    /**
     * Shows the column from hidden based on the provided key in the columns.
     * @deprecated
     * @method showColumn
     * @param {string} key Accepts the hidden column key name to be shown from the hidden state in board.
     * @returns {void}
     */
    Kanban.prototype.showColumn = function (key) {
        this.actionModule.showColumn(key);
    };
    /**
     * Hides the column from Kanban board based on the provided key in the columns.
     * @deprecated
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
        if (!this.isBlazorRender()) {
            [].slice.call(this.element.childNodes).forEach(function (node) { return detach(node); });
        }
        var removeClasses = [ROOT_CLASS];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
        if (!this.isBlazorRender()) {
            _super.prototype.destroy.call(this);
        }
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
        Complex({}, SortSettings)
    ], Kanban.prototype, "sortSettings", void 0);
    __decorate([
        Complex({}, DialogSettings)
    ], Kanban.prototype, "dialogSettings", void 0);
    __decorate([
        Property(true)
    ], Kanban.prototype, "allowDragAndDrop", void 0);
    __decorate([
        Property(false)
    ], Kanban.prototype, "enableTooltip", void 0);
    __decorate([
        Property(false)
    ], Kanban.prototype, "showEmptyColumn", void 0);
    __decorate([
        Property(false)
    ], Kanban.prototype, "enablePersistence", void 0);
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
    ], Kanban.prototype, "queryCellInfo", void 0);
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
    __decorate([
        Event()
    ], Kanban.prototype, "dialogOpen", void 0);
    __decorate([
        Event()
    ], Kanban.prototype, "dialogClose", void 0);
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

export { Kanban, actionBegin, actionComplete, actionFailure, cardClick, cardDoubleClick, cardRendered, queryCellInfo, dataBinding, dataBound, dragStart, drag, dragStop, documentClick, dialogOpen, dialogClose, contentReady, dataReady, bottomSpace, cardSpace, toggleWidth };
//# sourceMappingURL=ej2-kanban.es5.js.map
