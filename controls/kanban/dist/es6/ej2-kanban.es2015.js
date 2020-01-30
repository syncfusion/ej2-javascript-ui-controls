import { Browser, ChildProperty, Collection, Complex, Component, Draggable, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Property, Touch, addClass, append, classList, closest, compile, createElement, extend, formatUnit, isNullOrUndefined, remove, removeClass } from '@syncfusion/ej2-base';
import { Popup, Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { TreeView } from '@syncfusion/ej2-navigations';

/**
 * Kanban Constants
 */
// Constants for public events 
/** @hidden */
const actionBegin = 'actionBegin';
/** @hidden */
const actionComplete = 'actionComplete';
/** @hidden */
const actionFailure = 'actionFailure';
/** @hidden */
const cardClick = 'cardClick';
/** @hidden */
const cardDoubleClick = 'cardDoubleClick';
/** @hidden */
const cardRendered = 'cardRendered';
/** @hidden */
const columnRendered = 'columnRendered';
/** @hidden */
const dataBinding = 'dataBinding';
/** @hidden */
const dataBound = 'dataBound';
/** @hidden */
const dragStart = 'dragStart';
/** @hidden */
const drag = 'drag';
/** @hidden */
const dragStop = 'dragStop';
/** @hidden */
const documentClick = 'document-click';
// Constants for internal events
/** @hidden */
const contentReady = 'content-ready';
/** @hidden */
const dataReady = 'data-ready';
/** @hidden */
const bottomSpace = 25;
/** @hidden */
const cardSpace = 16;
/** @hidden */
const toggleWidth = 50;

/**
 * data module is used to generate query and data source.
 * @hidden
 */
class Data {
    /**
     * Constructor for data module
     * @private
     */
    constructor(parent) {
        this.parent = parent;
        this.initDataManager(parent.dataSource, parent.query);
        this.refreshDataManager();
    }
    /**
     * The function used to initialize dataManager and query
     * @return {void}
     * @private
     */
    initDataManager(dataSource, query) {
        this.dataManager = dataSource instanceof DataManager ? dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
    }
    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    generateQuery() {
        return this.query.clone();
    }
    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    getData(query) {
        return this.dataManager.executeQuery(query);
    }
    /**
     * The function is used to send the request and get response form datamanager
     * @return {void}
     * @private
     */
    refreshDataManager() {
        let dataManager = this.getData(this.generateQuery());
        dataManager.then((e) => this.dataManagerSuccess(e)).catch((e) => this.dataManagerFailure(e));
    }
    /**
     * The function is used to handle the success response from dataManager
     * @return {void}
     * @private
     */
    dataManagerSuccess(e) {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(dataBinding, e, (args) => {
            let resultData = extend([], args.result, null, true);
            this.parent.kanbanData = resultData;
            this.parent.notify(dataReady, { processedData: resultData });
            this.parent.trigger(dataBound, null, () => this.parent.hideSpinner());
        });
    }
    /**
     * The function is used to handle the failure response from dataManager
     * @return {void}
     * @private
     */
    dataManagerFailure(e) {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(actionFailure, { error: e }, () => this.parent.hideSpinner());
    }
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Holds the configuration of swimlane settings in kanban board.
 */
class SwimlaneSettings extends ChildProperty {
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

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Holds the configuration of card settings in kanban board.
 */
class CardSettings extends ChildProperty {
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

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Holds the configuration of columns in kanban board.
 */
class Columns extends ChildProperty {
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

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Holds the configuration of stacked header settings in kanban board.
 */
class StackedHeaders extends ChildProperty {
}
__decorate$4([
    Property()
], StackedHeaders.prototype, "text", void 0);
__decorate$4([
    Property()
], StackedHeaders.prototype, "keyFields", void 0);

/**
 * Kanban CSS Constants
 */
/** @hidden */
const ROOT_CLASS = 'e-kanban';
/** @hidden */
const RTL_CLASS = 'e-rtl';
/** @hidden */
const DEVICE_CLASS = 'e-device';
/** @hidden */
const ICON_CLASS = 'e-icons';
/** @hidden */
const TEMPLATE_CLASS = 'e-template';
/** @hidden */
const SWIMLANE_CLASS = 'e-swimlane';
/** @hidden */
const TABLE_CLASS = 'e-kanban-table';
/** @hidden */
const HEADER_CLASS = 'e-kanban-header';
/** @hidden */
const HEADER_TABLE_CLASS = 'e-header-table';
/** @hidden */
const HEADER_CELLS_CLASS = 'e-header-cells';
/** @hidden */
const HEADER_WRAP_CLASS = 'e-header-wrap';
/** @hidden */
const HEADER_TEXT_CLASS = 'e-header-text';
/** @hidden */
const HEADER_ICON_CLASS = 'e-header-icon';
/** @hidden */
const CONTENT_CELLS_CLASS = 'e-content-cells';
/** @hidden */
const CONTENT_CLASS = 'e-kanban-content';
/** @hidden */
const CONTENT_TABLE_CLASS = 'e-content-table';
/** @hidden */
const HEADER_ROW_TOGGLE_CLASS = 'e-toggle-header';
/** @hidden */
const HEADER_ROW_CLASS = 'e-header-row';
/** @hidden */
const CONTENT_ROW_CLASS = 'e-content-row';
/** @hidden */
const SWIMLANE_ROW_CLASS = 'e-swimlane-row';
/** @hidden */
const SWIMLANE_ROW_EXPAND = 'e-swimlane-row-expand';
/** @hidden */
const SWIMLANE_ROW_COLLAPSE = 'e-swimlane-row-collapse';
/** @hidden */
const SWIMLANE_ROW_TEXT = 'e-swimlane-text';
/** @hidden */
const SWIMLANE_ITEM_COUNT = 'e-swimlane-item-count';
/** @hidden */
const CARD_WRAPPER_CLASS = 'e-card-wrapper';
/** @hidden */
const CARD_CLASS = 'e-card';
/** @hidden */
const CARD_HEADER_CLASS = 'e-card-header';
/** @hidden */
const CARD_CONTENT_CLASS = 'e-card-content';
/** @hidden */
const CARD_HEADER_TEXT_CLASS = 'e-card-header-caption';
/** @hidden */
const CARD_CONTENT_TEXT_CLASS = 'e-card-content-caption';
/** @hidden */
const COLUMN_EXPAND = 'e-column-expand';
/** @hidden */
const COLUMN_COLLAPSE = 'e-column-collapse';
/** @hidden */
const COLLAPSE_HEADER_TEXT = 'e-collapse-header-text';
/** @hidden */
const COLLAPSED_CLASS = 'e-collapsed';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
const DRAGGED_CLONE = 'e-target-dragged-clone';
/** @hidden */
const DRAGGED_CARD = 'e-kanban-dragged-card';
/** @hidden */
const DROPPED_CLONE = 'e-target-dropped-clone';
/** @hidden */
const DROPPING = 'e-dropping';
/** @hidden */
const TOGGLE_VISIBLE = 'e-toggle-visible';
/** @hidden */
const MULTI_CLONE_CARD = 'e-multi-clone-card';
/** @hidden */
const MULTI_CLONE_CONTENT_CELL = 'e-multi-content-cell';
/** @hidden */
const MULTI_ACTIVE = 'e-multi-active';
/** @hidden */
const TARGET_MULTI_CLONE = 'e-target-multi-clone';
/** @hidden */
const MULTI_COLUMN_KEY = 'e-column-key';
/** @hidden */
const CARD_SELECTION = 'e-selection';
/** @hidden */
const TOOLTIP_CLASS = 'e-kanban-tooltip';
/** @hidden */
const TOOLTIP_TEXT = 'e-tooltip-text';
/** @hidden */

/** @hidden */
const SWIMLANE_HEADER = 'e-swimlane-header';
/** @hidden */
const SWIMLANE_HEADER_TOOLBAR = 'e-swimlane-header-toolbar';
/** @hidden */
const TOOLBAR_MENU = 'e-toolbar-menu';
/** @hidden */
const TOOLBAR_MENU_ICON = 'e-icon-menu';
/** @hidden */
const TOOLBAR_LEVEL_TITLE = 'e-toolbar-level-title';
/** @hidden */
const TOOLBAR_SWIMLANE_NAME = 'e-toolbar-swimlane-name';
/** @hidden */
const SWIMLANE_OVERLAY = 'e-swimlane-overlay';
/** @hidden */
const SWIMLANE_CONTENT = 'e-swimlane-content';
/** @hidden */
const SWIMLANE_RESOURCE = 'e-swimlane-resource';
/** @hidden */
const SWIMLANE_TREE = 'e-swimlane-tree';
/** @hidden */
const LIMITS_CLASS = 'e-limits';
/** @hidden */
const MAX_COUNT_CLASS = 'e-max-count';
/** @hidden */
const MIN_COUNT_CLASS = 'e-min-count';
/** @hidden */
const TOTAL_CARD = 'e-total-card';
/** @hidden */
const HIDE_LIMITS = 'e-hide-limits';
/** @hidden */
const MAX_COLOR = 'e-max-color';
/** @hidden */
const MIN_COLOR = 'e-min-color';

/**
 * Action module is used to perform card actions.
 * @hidden
 */
class Action {
    /**
     * Constructor for action module
     * @private
     */
    constructor(parent) {
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
    cardClick(e) {
        let target = closest(e.target, '.' + CARD_CLASS);
        let cardClickObj = this.parent.getCardDetails(target);
        this.parent.activeCardData = { data: cardClickObj, element: target };
        let args = { data: cardClickObj, element: target, cancel: false };
        this.parent.trigger(cardClick, args, (clickArgs) => {
            if (!clickArgs.cancel) {
                this.cardSelection(target, e.ctrlKey, e.shiftKey);
            }
        });
    }
    cardDoubleClick(e) {
        let target = closest(e.target, '.' + CARD_CLASS);
        let cardDoubleClickObj = this.parent.getCardDetails(target);
        this.parent.activeCardData = { data: cardDoubleClickObj, element: target };
        let args = { data: cardDoubleClickObj, element: target, cancel: false };
        this.parent.trigger(cardDoubleClick, args);
    }
    rowExpandCollapse(e) {
        let args = { cancel: false, target: e.target, requestType: 'rowExpandCollapse' };
        this.parent.trigger(actionBegin, args, (actionArgs) => {
            if (!actionArgs.cancel) {
                let target = closest(e.target, '.' + SWIMLANE_ROW_CLASS);
                let tgtRow = this.parent.element.querySelector('.' + CONTENT_ROW_CLASS + `:nth-child(${target.rowIndex + 2})`);
                let targetIcon = target.querySelector('.' + SWIMLANE_ROW_EXPAND + ',.' + SWIMLANE_ROW_COLLAPSE);
                if (target.classList.contains(COLLAPSED_CLASS)) {
                    removeClass([tgtRow, target], COLLAPSED_CLASS);
                    classList(targetIcon, [SWIMLANE_ROW_EXPAND], [SWIMLANE_ROW_COLLAPSE]);
                    this.swimlaneToggleArray.splice(this.swimlaneToggleArray.indexOf(target.getAttribute('data-key')), 1);
                }
                else {
                    addClass([tgtRow, target], COLLAPSED_CLASS);
                    classList(targetIcon, [SWIMLANE_ROW_COLLAPSE], [SWIMLANE_ROW_EXPAND]);
                    this.swimlaneToggleArray.push(target.getAttribute('data-key'));
                }
                this.parent.notify(contentReady, {});
                this.parent.trigger(actionComplete, { target: e.target, requestType: 'rowExpandCollapse' });
            }
        });
    }
    columnExpandCollapse(e) {
        let headerTarget = (e instanceof HTMLElement) ? e : e.target;
        let args = { cancel: false, target: headerTarget, requestType: 'columnExpandCollapse' };
        this.parent.trigger(actionBegin, args, (actionArgs) => {
            if (!actionArgs.cancel) {
                let target = closest(headerTarget, '.' + HEADER_CELLS_CLASS);
                let colIndex = target.cellIndex;
                this.columnToggle(target);
                let collapsed = this.parent.element.querySelectorAll(`.${HEADER_CELLS_CLASS}.${COLLAPSED_CLASS}`).length;
                if (collapsed === (this.parent.columns.length - this.hideColumnKeys.length)) {
                    let nextColIndex = (colIndex + 1 === collapsed) ? 0 : colIndex + 1;
                    let headerSelector = `.${HEADER_CELLS_CLASS}:not(.e-stacked-header-cell):nth-child(${nextColIndex + 1})`;
                    let nextCol = this.parent.element.querySelector(headerSelector);
                    addClass([nextCol], COLLAPSED_CLASS);
                    this.columnToggle(nextCol);
                }
                this.parent.notify(contentReady, {});
                this.parent.trigger(actionComplete, { target: headerTarget, requestType: 'columnExpandCollapse' });
            }
        });
    }
    columnToggle(target) {
        let colIndex = target.cellIndex;
        let headerLimits = target.querySelector('.' + LIMITS_CLASS);
        let targetRow = [].slice.call(this.parent.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)'));
        let colSelector = `.e-header-table col:nth-child(${colIndex + 1}),.e-content-table col:nth-child(${colIndex + 1})`;
        let targetIcon = target.querySelector('.' + COLUMN_EXPAND + ',.' + COLUMN_COLLAPSE);
        let colGroup = [].slice.call(this.parent.element.querySelectorAll(colSelector));
        if (target.classList.contains(COLLAPSED_CLASS)) {
            removeClass(colGroup, COLLAPSED_CLASS);
            if (this.parent.isAdaptive) {
                colGroup.forEach((col) => {
                    col.style.width = formatUnit(this.parent.layoutModule.getWidth());
                });
            }
            classList(targetIcon, [COLUMN_EXPAND], [COLUMN_COLLAPSE]);
            for (let row of targetRow) {
                let targetCol = row.querySelector(`.${CONTENT_CELLS_CLASS}:nth-child(${colIndex + 1})`);
                removeClass([targetCol, target], COLLAPSED_CLASS);
                remove(targetCol.querySelector('.' + COLLAPSE_HEADER_TEXT));
                let limitEle = targetCol.querySelector('.' + LIMITS_CLASS);
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
                colGroup.forEach((col) => {
                    col.style.width = formatUnit(toggleWidth);
                });
            }
            classList(targetIcon, [COLUMN_COLLAPSE], [COLUMN_EXPAND]);
            for (let row of targetRow) {
                let key = target.getAttribute('data-key');
                let targetCol = row.querySelector('.' + CONTENT_CELLS_CLASS + '[data-key="' + key + '"]');
                let index = targetCol.cellIndex;
                targetCol.appendChild(createElement('div', {
                    className: COLLAPSE_HEADER_TEXT,
                    innerHTML: this.parent.columns[index].headerText
                }));
                addClass([targetCol, target], COLLAPSED_CLASS);
                let limitEle = targetCol.querySelector('.' + LIMITS_CLASS);
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
    }
    cardSelection(target, isCtrl, isShift) {
        if (!target) {
            return;
        }
        let cards = this.parent.getSelectedCards();
        if (this.parent.cardSettings.selectionType !== 'None') {
            let contentRow = closest(target, '.' + CONTENT_ROW_CLASS);
            let index = !isNullOrUndefined(this.lastSelectionRow) ? this.lastSelectionRow.rowIndex : contentRow.rowIndex;
            if (index !== contentRow.rowIndex && (isCtrl || isShift) && this.parent.cardSettings.selectionType === 'Multiple') {
                return;
            }
            if (cards.length !== 0 && (!isCtrl || this.parent.cardSettings.selectionType === 'Single')) {
                removeClass(cards, CARD_SELECTION);
                cards.forEach((el) => {
                    this.selectionArray.splice(this.selectionArray.indexOf(el.getAttribute('data-id')), 1);
                    this.selectedCardsElement.splice(this.selectedCardsElement.indexOf(el), 1);
                    this.selectedCardsData.splice(this.selectedCardsData.indexOf(this.parent.getCardDetails(el), 1));
                });
            }
            if (cards.length > 0 && isShift && this.parent.cardSettings.selectionType === 'Multiple') {
                let curCards = [];
                let start;
                let end;
                let i;
                let allCards = [].slice.call(contentRow.querySelectorAll('.' + CARD_CLASS));
                allCards.forEach((el) => curCards.push(el.getAttribute('data-id')));
                let curId = target.getAttribute('data-id');
                let lastId = this.lastCard.getAttribute('data-id');
                let curIndex = end = curCards.indexOf(curId);
                let lastIndex = start = curCards.indexOf(lastId);
                let select = curIndex > lastIndex ? 'next' : 'prev';
                if (select === 'prev') {
                    start = curIndex;
                    end = lastIndex;
                }
                for (i = start; i <= end; i++) {
                    let card = allCards[i];
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
    }
    addColumn(columnOptions, index) {
        this.parent.columns.splice(index, 0, columnOptions);
        this.parent.notify(dataReady, { processedData: this.parent.kanbanData });
    }
    deleteColumn(index) {
        let listKey = this.parent.element.querySelectorAll('.' + HEADER_CELLS_CLASS).item(index);
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
    }
    showColumn(key) {
        let index = this.hideColumnKeys.indexOf(key);
        if (index !== -1) {
            this.hideColumnKeys.splice(index, 1);
            this.parent.notify(dataReady, { processedData: this.parent.kanbanData });
        }
    }
    hideColumn(key) {
        this.hideColumnKeys.push(key);
        this.parent.notify(dataReady, { processedData: this.parent.kanbanData });
    }
}

/**
 * Kanban CRUD operations
 */
class Crud {
    constructor(parent) {
        this.parent = parent;
        this.keyField = this.parent.cardSettings.headerField;
    }
    getQuery() {
        return this.parent.dataModule.generateQuery();
    }
    getTable() {
        if (this.parent.query) {
            let query = this.parent.query.clone();
            return query.fromTable;
        }
        return null;
    }
    refreshData(args) {
        let actionArgs = {
            requestType: args.requestType, cancel: false, addedRecords: args.addedRecords,
            changedRecords: args.changedRecords, deletedRecords: args.deletedRecords
        };
        if (this.parent.dataModule.dataManager.dataSource.offline) {
            this.parent.trigger(actionComplete, actionArgs, (offlineArgs) => {
                if (!offlineArgs.cancel) {
                    this.parent.dataModule.refreshDataManager();
                }
            });
        }
        else {
            args.promise.then((e) => {
                if (this.parent.isDestroyed) {
                    return;
                }
                this.parent.trigger(actionComplete, actionArgs, (onlineArgs) => {
                    if (!onlineArgs.cancel) {
                        this.parent.dataModule.refreshDataManager();
                    }
                });
            }).catch((e) => {
                if (this.parent.isDestroyed) {
                    return;
                }
                this.parent.trigger(actionFailure, { error: e });
            });
        }
    }
    addCard(cardData) {
        let args = {
            cancel: false, requestType: 'cardCreate', addedRecords: (cardData instanceof Array) ? cardData : [cardData],
            changedRecords: [], deletedRecords: []
        };
        this.parent.trigger(actionBegin, args, (addArgs) => {
            if (!addArgs.cancel) {
                let promise = null;
                let editParms = {
                    addedRecords: (cardData instanceof Array) ? cardData : [cardData], changedRecords: [], deletedRecords: []
                };
                if (cardData instanceof Array) {
                    promise = this.parent.dataModule.dataManager.saveChanges(editParms, this.keyField, this.getTable(), this.getQuery());
                }
                else {
                    promise = this.parent.dataModule.dataManager.insert(cardData, this.getTable(), this.getQuery());
                }
                let crudArgs = {
                    requestType: 'cardCreated', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                    changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                };
                this.refreshData(crudArgs);
            }
        });
    }
    updateCard(cardData) {
        let args = {
            requestType: 'cardChange', cancel: false, addedRecords: [],
            changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
        };
        this.parent.trigger(actionBegin, args, (updateArgs) => {
            if (!updateArgs.cancel) {
                let promise = null;
                let editParms = {
                    addedRecords: [], changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
                };
                if (cardData instanceof Array) {
                    promise = this.parent.dataModule.dataManager.saveChanges(editParms, this.keyField, this.getTable(), this.getQuery());
                }
                else {
                    promise = this.parent.dataModule.dataManager.update(this.keyField, cardData, this.getTable(), this.getQuery());
                }
                let crudArgs = {
                    requestType: 'cardChanged', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                    changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                };
                this.refreshData(crudArgs);
            }
        });
    }
    deleteCard(cardData) {
        let editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        if (typeof cardData === 'string' || typeof cardData === 'number') {
            editParms.deletedRecords = this.parent.kanbanData.filter((data) => data[this.keyField] === cardData);
        }
        else {
            editParms.deletedRecords = (cardData instanceof Array) ? cardData : [cardData];
        }
        let args = {
            requestType: 'cardRemove', cancel: false, addedRecords: [],
            changedRecords: [], deletedRecords: editParms.deletedRecords
        };
        this.parent.trigger(actionBegin, args, (deleteArgs) => {
            if (!deleteArgs.cancel) {
                let promise = null;
                if (editParms.deletedRecords.length > 1) {
                    promise = this.parent.dataModule.dataManager.saveChanges(editParms, this.keyField, this.getTable(), this.getQuery());
                }
                else {
                    promise = this.parent.dataModule.dataManager.remove(this.keyField, cardData, this.getTable(), this.getQuery());
                }
                let crudArgs = {
                    requestType: 'cardRemoved', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                    changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                };
                this.refreshData(crudArgs);
            }
        });
    }
}

/**
 * Drag and Drop module is used to perform card actions.
 * @hidden
 */
class DragAndDrop {
    /**
     * Constructor for drag and drop module
     * @private
     */
    constructor(parent) {
        this.parent = parent;
        this.dragObj = {
            element: null, cloneElement: null,
            targetClone: null, draggedClone: null, targetCloneMulti: null,
            selectedCards: [], pageX: 0, pageY: 0, navigationInterval: null, cardDetails: []
        };
        this.dragEdges = { left: false, right: false, top: false, bottom: false };
    }
    wireDragEvents(element) {
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
    }
    dragHelper(e) {
        this.dragObj.element = e.element;
        this.dragObj.element.style.width = formatUnit(this.dragObj.element.offsetWidth);
        let cloneWrapper = createElement('div', { innerHTML: this.dragObj.element.outerHTML });
        this.dragObj.cloneElement = cloneWrapper.childNodes.item(0);
        addClass([this.dragObj.cloneElement], ['e-cloned-card', 'duplicate']);
        this.dragObj.element.parentElement.appendChild(this.dragObj.cloneElement);
        this.dragObj.targetCloneMulti = createElement('div', { className: TARGET_MULTI_CLONE });
        this.dragObj.targetClone = createElement('div', {
            className: DROPPED_CLONE,
            styles: 'width:' + formatUnit(this.dragObj.element.offsetWidth) + ';height:' + formatUnit(this.dragObj.element.offsetHeight)
        });
        return this.dragObj.cloneElement;
    }
    dragStart(e) {
        this.dragObj.selectedCards = this.dragObj.element;
        if (this.dragObj.element.classList.contains(CARD_SELECTION)) {
            let className = '.' + CARD_CLASS + '.' + CARD_SELECTION + ':not(.duplicate)';
            let closestEle = closest(this.dragObj.element, '.' + CONTENT_ROW_CLASS);
            this.dragObj.selectedCards = [].slice.call(closestEle.querySelectorAll(className));
            this.dragObj.selectedCards.forEach((element) => {
                this.dragObj.cardDetails.push(this.parent.getCardDetails(element));
            });
        }
        else {
            this.dragObj.cardDetails = [this.parent.getCardDetails(this.dragObj.element)];
        }
        let dragArgs = { cancel: false, data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(dragStart, dragArgs, (dragEventArgs) => {
            if (dragEventArgs.cancel) {
                this.removeElement(this.dragObj.cloneElement);
                this.dragObj = {
                    element: null, cloneElement: null,
                    targetClone: null, draggedClone: null, targetCloneMulti: null
                };
                return;
            }
            if (this.dragObj.element.classList.contains(CARD_SELECTION)) {
                this.dragObj.selectedCards.forEach((element) => { this.draggedClone(element); });
                if (this.dragObj.selectedCards.length > 1) {
                    this.dragObj.cloneElement.innerHTML = '';
                    let drag$$1 = createElement('div', {
                        className: 'e-multi-card-text',
                        innerHTML: this.dragObj.selectedCards.length + ' Cards',
                    });
                    this.dragObj.cloneElement.appendChild(drag$$1);
                    classList(this.dragObj.cloneElement, ['e-multi-card-clone'], [CARD_SELECTION]);
                    this.dragObj.cloneElement.style.width = '90px';
                }
            }
            else {
                this.draggedClone(this.dragObj.element);
            }
            this.parent.notify(contentReady, {});
        });
    }
    draggedClone(element) {
        this.dragObj.draggedClone = createElement('div', {
            className: DRAGGED_CLONE,
            styles: 'width:' + formatUnit(element.offsetWidth - 1) + ';height:' + formatUnit(element.offsetHeight)
        });
        element.insertAdjacentElement('afterend', this.dragObj.draggedClone);
        addClass([element], DRAGGED_CARD);
    }
    drag(e) {
        if (!e.target) {
            return;
        }
        let cardElement = closest(e.target, '.' + CARD_CLASS);
        let target = cardElement || e.target;
        let selector = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ') .' + CONTENT_CELLS_CLASS;
        let contentCell = closest(target, selector);
        this.calculateArgs(e);
        if (contentCell) {
            let targetKey = this.getColumnKey(contentCell);
            let keys = targetKey.split(',');
            this.multiCloneRemove();
            let isDrag = false;
            if ((targetKey === this.getColumnKey(closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS)))) {
                isDrag = true;
            }
            if (keys.length === 1 || isDrag) {
                if (target.classList.contains(CARD_CLASS)) {
                    let insertClone = isNullOrUndefined(target.previousElementSibling) ? 'beforebegin' : 'afterend';
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
                let offsetHeight = contentCell.offsetHeight;
                let limitEle = contentCell.querySelector('.' + LIMITS_CLASS);
                if (limitEle) {
                    offsetHeight -= limitEle.offsetHeight;
                }
                this.dragObj.targetCloneMulti.style.height = formatUnit(offsetHeight);
                let cards = [].slice.call(contentCell.querySelectorAll('.' + CARD_CLASS));
                cards.forEach((el) => addClass([el], MULTI_CLONE_CARD));
                addClass([contentCell], MULTI_CLONE_CONTENT_CELL);
                contentCell.querySelector('.' + CARD_WRAPPER_CLASS).style.height = 'auto';
                contentCell.style.borderStyle = 'none';
                this.removeElement(this.dragObj.targetClone);
                for (let key of keys) {
                    let colKey = createElement('div', { className: MULTI_COLUMN_KEY, attrs: { 'data-key': key.trim() } });
                    let text = createElement('div', { className: 'e-text', innerHTML: key.trim() });
                    contentCell.appendChild(this.dragObj.targetCloneMulti).appendChild(colKey).appendChild(text);
                    colKey.style.lineHeight = colKey.style.height = formatUnit((offsetHeight / keys.length));
                    text.style.top = formatUnit((offsetHeight / 2) - (text.offsetHeight / 2));
                }
            }
            this.parent.notify(contentReady, {});
        }
        this.addDropping();
        let isCollapsed = false;
        if (contentCell) {
            isCollapsed = contentCell.classList.contains(COLLAPSED_CLASS) && contentCell.classList.contains(DROPPING);
        }
        if (isCollapsed) {
            this.toggleVisible(target, undefined);
            addClass([contentCell], TOGGLE_VISIBLE);
        }
        let tColumn = [].slice.call(this.parent.element.querySelectorAll('.' + TOGGLE_VISIBLE));
        if (tColumn.length > 0 && !target.classList.contains(TOGGLE_VISIBLE) && !closest(target, '.' + TOGGLE_VISIBLE)) {
            this.toggleVisible(target, tColumn.slice(-1)[0]);
            removeClass(tColumn, TOGGLE_VISIBLE);
        }
        this.parent.notify(contentReady, {});
        let cloneCell = closest(target, '.' + CONTENT_CELLS_CLASS + ':not(.' + COLLAPSED_CLASS + ')');
        if (cloneCell) {
            this.dragObj.targetClone.style.width = formatUnit((cloneCell.offsetWidth - 2) - cardSpace);
        }
        let multiKeyTarget = closest(target, '.' + MULTI_COLUMN_KEY);
        if (multiKeyTarget) {
            let columnKeys = [].slice.call(this.parent.element.querySelectorAll('.' + MULTI_COLUMN_KEY)).filter((element) => this.getColumnKey(element) === this.getColumnKey(multiKeyTarget));
            if (columnKeys.length > 0) {
                addClass(columnKeys, MULTI_ACTIVE);
                if (columnKeys[0].previousElementSibling) {
                    addClass([columnKeys[0].previousElementSibling], 'e-multi-bottom-border');
                }
            }
        }
        document.body.style.cursor = contentCell ? '' : 'not-allowed';
        if (this.parent.swimlaneSettings.keyField && !this.parent.swimlaneSettings.allowDragAndDrop) {
            let dragElement = closest(this.dragObj.element, '.' + CONTENT_ROW_CLASS);
            let classSelector = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ')';
            let dropElement = closest(target, classSelector);
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
        let dragArgs = {
            data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards
        };
        this.parent.trigger(drag, dragArgs);
    }
    removeElement(element) {
        if (this.parent.element.getElementsByClassName(element.className).length > 0) {
            remove(element);
        }
    }
    addDropping() {
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            let className = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + '):not(.' + COLLAPSED_CLASS + ')';
            let rows = [].slice.call(this.parent.element.querySelectorAll(className));
            rows.forEach((row) => addClass(row.childNodes, DROPPING));
        }
        else {
            let row = closest(this.dragObj.draggedClone, '.' + CONTENT_ROW_CLASS);
            if (row) {
                [].slice.call(row.childNodes).forEach((cell) => addClass([cell], DROPPING));
            }
        }
        let cell = closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS);
        if (cell) {
            removeClass([cell], DROPPING);
        }
    }
    dragStop(e) {
        let contentCell = closest(this.dragObj.targetClone, '.' + CONTENT_CELLS_CLASS);
        let columnKey;
        if (this.parent.element.querySelector('.' + TARGET_MULTI_CLONE)) {
            columnKey = closest(e.target, '.' + MULTI_COLUMN_KEY);
        }
        let dragArgs = { cancel: false, data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(dragStop, dragArgs, (dragEventArgs) => {
            this.removeElement(this.dragObj.draggedClone);
            this.removeElement(this.dragObj.targetClone);
            this.removeElement(this.dragObj.cloneElement);
            let dragMultiClone = [].slice.call(this.parent.element.querySelectorAll('.' + DRAGGED_CLONE));
            dragMultiClone.forEach((clone) => remove(clone));
            removeClass([this.dragObj.element], DRAGGED_CARD);
            clearInterval(this.dragObj.navigationInterval);
            this.dragObj.navigationInterval = null;
            if (!dragEventArgs.cancel) {
                if (contentCell || columnKey) {
                    let cardStatus;
                    if (contentCell) {
                        cardStatus = this.getColumnKey(contentCell);
                    }
                    else {
                        cardStatus = this.getColumnKey(columnKey);
                        contentCell = closest(columnKey, '.' + CONTENT_CELLS_CLASS);
                    }
                    if (this.dragObj.selectedCards instanceof HTMLElement) {
                        this.updateDroppedData(this.dragObj.selectedCards, cardStatus, contentCell);
                    }
                    else {
                        this.dragObj.selectedCards.forEach((element) => {
                            this.updateDroppedData(element, cardStatus, contentCell);
                        });
                    }
                }
            }
            if (document.body.style.cursor === 'not-allowed') {
                document.body.style.cursor = '';
            }
            let className = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ')';
            let rows = [].slice.call(this.parent.element.querySelectorAll(className));
            rows.forEach((row) => removeClass(row.childNodes, DROPPING));
            if (this.parent.isAdaptive) {
                this.parent.touchModule.tabHold = false;
            }
            this.dragObj.cardDetails = [];
        });
    }
    updateDroppedData(element, cardStatus, contentCell) {
        let crudData = this.parent.getCardDetails(element);
        if (cardStatus.split(',').length === 1) {
            crudData[this.parent.keyField] = cardStatus;
        }
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            let prev = closest(contentCell, '.' + CONTENT_ROW_CLASS).previousElementSibling;
            if (this.parent.isAdaptive) {
                let keyField = this.parent.layoutModule.kanbanRows[this.parent.layoutModule.swimlaneIndex].keyField;
                crudData[this.parent.swimlaneSettings.keyField] = keyField;
            }
            else {
                crudData[this.parent.swimlaneSettings.keyField] = this.getColumnKey(prev);
            }
        }
        this.parent.crudModule.updateCard(crudData);
    }
    toggleVisible(target, tColumn) {
        let lists = [].slice.call(this.parent.element.querySelectorAll('.' + HEADER_CELLS_CLASS));
        lists.forEach((list) => {
            if (this.getColumnKey(list) === this.getColumnKey(tColumn || target)) {
                this.parent.actionModule.columnToggle(list);
            }
        });
        let cloneTarget = closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS);
        if (cloneTarget) {
            let width = formatUnit(cloneTarget.offsetWidth - cardSpace);
            this.dragObj.draggedClone.style.width = width;
            this.dragObj.cloneElement.style.width = width;
        }
    }
    multiCloneRemove() {
        let cloneMulti = [].slice.call(this.parent.element.querySelectorAll('.' + TARGET_MULTI_CLONE));
        if (cloneMulti.length > 0) {
            let columnKey = [].slice.call(this.parent.element.querySelectorAll('.' + MULTI_COLUMN_KEY));
            columnKey.forEach((node) => remove(node));
            cloneMulti.forEach((node) => {
                let target = closest(node, '.' + CONTENT_CELLS_CLASS);
                if (target) {
                    target.style.borderStyle = '';
                }
                let cards = [].slice.call(target.querySelectorAll('.' + CARD_CLASS));
                cards.forEach((el) => removeClass([el], MULTI_CLONE_CARD));
            });
            this.removeElement(this.dragObj.targetCloneMulti);
        }
    }
    calculateArgs(e) {
        let eventArgs = this.getPageCoordinates(e);
        this.dragObj.pageY = eventArgs.pageY;
        this.dragObj.pageX = eventArgs.pageX;
    }
    getPageCoordinates(e) {
        let eventArgs = e.event;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            eventArgs || e;
    }
    getColumnKey(target) {
        if (target) {
            return target.getAttribute('data-key').trim();
        }
        return '';
    }
    updateScrollPosition(e) {
        if (isNullOrUndefined(this.dragObj.navigationInterval)) {
            this.dragObj.navigationInterval = window.setInterval(() => {
                if (this.autoScrollValidation(e)) {
                    this.autoScroll();
                }
            }, 100);
        }
    }
    autoScrollValidation(e) {
        let pageY = this.dragObj.pageY;
        let pageX = this.dragObj.pageX;
        let autoScrollDistance = 30;
        let dragEdges = { left: false, right: false, top: false, bottom: false };
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
    }
    autoScroll() {
        let scrollSensitivity = 30;
        if (this.parent.isAdaptive) {
            let parent;
            if (this.dragEdges.top || this.dragEdges.bottom) {
                if (this.dragObj.targetClone) {
                    parent = closest(this.dragObj.targetClone, '.' + CARD_WRAPPER_CLASS);
                }
                else {
                    parent = closest(this.dragObj.draggedClone, '.' + CARD_WRAPPER_CLASS);
                }
            }
            else if (this.dragEdges.right || this.dragEdges.left) {
                parent = this.parent.element.querySelector('.' + CONTENT_CLASS);
            }
            if (parent) {
                let yIsScrollable = parent.offsetHeight <= parent.scrollHeight;
                let xIsScrollable = parent.offsetWidth <= parent.scrollWidth;
                let yInBounds = parent.scrollTop >= 0 && parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
                let xInBounds = parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
                if (yIsScrollable && yInBounds && (this.dragEdges.top || this.dragEdges.bottom)) {
                    parent.scrollTop += this.dragEdges.top ? -(scrollSensitivity + 36) : scrollSensitivity;
                }
                if (xIsScrollable && xInBounds && (this.dragEdges.left || this.dragEdges.right)) {
                    let scroll;
                    scroll = (this.parent.layoutModule.getWidth() * (this.parent.columns.length - 1)) > parent.scrollLeft;
                    if (scroll || this.dragEdges.left) {
                        parent.scrollLeft += this.dragEdges.left ? -scrollSensitivity : scrollSensitivity;
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
    }
    unWireDragEvents(element) {
        let dragInstance = element.ej2_instances[0];
        if (dragInstance && !dragInstance.isDestroyed) {
            dragInstance.destroy();
        }
    }
}

/**
 * Drag and Drop module is used to perform card actions.
 * @hidden
 */
class Keyboard {
    /**
     * Constructor for keyboard module
     * @private
     */
    constructor(parent) {
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
    keyActionHandler(e) {
        let selectedCard = this.parent.element.querySelectorAll('.e-card.e-selection').item(0);
        if (!selectedCard && e.action !== 'firstCardSelection' && e.action !== 'lastCardSelection') {
            return;
        }
        let key;
        switch (e.action) {
            case 'upArrow':
            case 'downArrow':
            case 'multiSelectionByUpArrow':
            case 'multiSelectionByDownArrow':
                key = closest(this.parent.actionModule.lastCardSelection, '.e-content-cells').getAttribute('data-key');
                let cardSelector = '.e-content-cells[data-key=' + key + '] .e-card';
                let allCards = [].slice.call(this.parent.element.querySelectorAll(cardSelector));
                let curId = this.parent.actionModule.lastCardSelection.getAttribute('data-id');
                let curIndex = this.getCardId(allCards).indexOf(curId);
                let isShift = ((e.action === 'multiSelectionByUpArrow' || e.action === 'multiSelectionByDownArrow')
                    && this.parent.cardSettings.selectionType === 'Multiple');
                let index = (e.action === 'upArrow' || e.action === 'multiSelectionByUpArrow') ? curIndex - 1 : curIndex + 1;
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
                    let selection = this.parent.actionModule.selectionArray;
                    selection.splice(selection.indexOf(selectedCard.getAttribute('data-id')), 1);
                }
                let cards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_CLASS));
                let element = e.action === 'firstCardSelection' ? cards[0] : cards[cards.length - 1];
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
                let cell = this.parent.element.querySelector('.e-header-cells[data-key=' + key + ']');
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
    }
    swimlaneExpandCollapse(action) {
        let className = '.e-card.e-selection';
        if (action === 'swimlaneExpandAll' || action === 'swimlaneCollapseAll') {
            className = '.e-content-row.e-swimlane-row';
        }
        let element = [].slice.call(this.parent.element.querySelectorAll(className));
        let collapseCount = this.parent.element.querySelectorAll(className + '.e-collapsed').length;
        if ((action === 'swimlaneCollapseAll' && element.length - collapseCount === 0) ||
            (action === 'swimlaneExpandAll' && element.length - collapseCount === element.length)) {
            return;
        }
        element.forEach((ele) => {
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
    }
    getCardId(cardElements) {
        let curCardId = [];
        cardElements.forEach((el) => curCardId.push(el.getAttribute('data-id')));
        return curCardId;
    }
    moveNextRow(row) {
        for (let i = 0; i < row.childElementCount; i++) {
            let nextCell = row.children[i];
            let nextCellCards = [].slice.call(nextCell.querySelectorAll('.' + CARD_CLASS));
            if (nextCellCards.length > 0) {
                this.parent.actionModule.cardSelection(nextCellCards[0], false, false);
                if (row.classList.contains('e-collapsed')) {
                    this.swimlaneExpandCollapse('selectedSwimlaneExpand');
                }
                break;
            }
        }
    }
    movePreviousRow(row) {
        for (let i = (row.childElementCount - 1); i >= 0; i--) {
            let nextCell = row.children[i];
            let nextCellCards = [].slice.call(nextCell.querySelectorAll('.' + CARD_CLASS));
            if (nextCellCards.length > 0) {
                if (!row.classList.contains('e-collapsed')) {
                    this.swimlaneExpandCollapse('selectedSwimlaneCollapse');
                }
                this.parent.actionModule.cardSelection(nextCellCards.slice(-1)[0], false, false);
                break;
            }
        }
    }
    cardIndex(isSame, nextCellCards, curIndex, action) {
        if (isSame) {
            let isShift = ((action === 'multiSelectionByRightArrow' || action === 'multiSelectionByLeftArrow')
                && this.parent.cardSettings.selectionType === 'Multiple');
            if (nextCellCards[curIndex]) {
                this.parent.actionModule.cardSelection(nextCellCards[curIndex], false, isShift);
            }
            else {
                this.parent.actionModule.cardSelection(nextCellCards.slice(-1)[0], false, isShift);
            }
        }
    }
    moveCards(action, card) {
        let nextCell;
        let nextCellCards;
        let curCell = closest(card, '.e-content-cells');
        let curCellCards = [].slice.call(curCell.querySelectorAll('.e-card'));
        let curRow = closest(curCell, '.e-content-row');
        let curIndex = this.getCardId(curCellCards).indexOf(card.getAttribute('data-id'));
        if (action === 'rightArrow' || action === 'multiSelectionByRightArrow') {
            if (curCell.cellIndex === (curRow.childElementCount - 1) && this.parent.swimlaneSettings.keyField
                && action !== 'multiSelectionByRightArrow') {
                if (curIndex < (this.getCardId(curCellCards).length - 1)) {
                    this.parent.actionModule.cardSelection(this.parent.actionModule.lastCardSelection.nextElementSibling, false, false);
                }
                else if (curRow.rowIndex !== (this.parent.element.querySelectorAll('.' + CONTENT_ROW_CLASS).length - 1)) {
                    let targetRow = this.parent.element.querySelector('.' + CONTENT_ROW_CLASS + `:nth-child(${curRow.rowIndex + 3})`);
                    this.moveNextRow(targetRow);
                }
            }
            else {
                let isSame = false;
                for (let i = curCell.cellIndex + 1; i < curRow.children.length; i++) {
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
                    let className = '.' + CONTENT_ROW_CLASS + `:nth-child(${curRow.rowIndex - 1})` + ':not(.e-collapsed)';
                    let targetRow = this.parent.element.querySelector(className);
                    if (targetRow) {
                        this.movePreviousRow(targetRow);
                    }
                }
            }
            else {
                let isSame = false;
                for (let i = (curCell.cellIndex - 1); i >= 0; i--) {
                    nextCell = curRow.children[i];
                    nextCellCards = [].slice.call(nextCell.querySelectorAll('.' + CARD_CLASS));
                    if (nextCellCards.length > 0) {
                        isSame = true;
                        break;
                    }
                    if (i === 0 && this.parent.swimlaneSettings.keyField) {
                        let row = this.parent.element.querySelector('.' + CONTENT_ROW_CLASS + `:nth-child(${curRow.rowIndex - 1})`);
                        this.movePreviousRow(row);
                    }
                }
                this.cardIndex(isSame, nextCellCards, curIndex, action);
            }
        }
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'keyboard';
    }
    /**
     * To destroy the keyboard module.
     * @return {void}
     * @private
     */
    destroy() {
        this.keyboardModule.destroy();
    }
}

/**
 * Tooltip for Kanban board
 */
class KanbanTooltip {
    constructor(parent) {
        this.parent = parent;
        this.renderTooltip();
    }
    renderTooltip() {
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
    }
    onBeforeRender(args) {
        let tooltipContent;
        if (this.parent.tooltipTemplate) {
            tooltipContent = createElement('div');
            let target = closest(args.target, '.' + CARD_CLASS);
            let data = this.parent.getCardDetails(target);
            let tooltipTemplate = this.parent.templateParser(this.parent.tooltipTemplate)(data);
            append(tooltipTemplate, tooltipContent);
        }
        else {
            tooltipContent = `<div class="e-card-header-caption">${args.target.innerText}</div>`;
        }
        this.tooltipObj.setProperties({ content: tooltipContent }, true);
    }
    destroy() {
        this.tooltipObj.destroy();
        addClass([this.parent.element], 'e-control');
        this.tooltipObj = null;
    }
}

/**
 * kanban touch module
 */
class KanbanTouch {
    /**
     * Constructor for touch module
     */
    constructor(parent) {
        this.parent = parent;
        this.tabHold = false;
    }
    wireTouchEvents() {
        this.element = this.parent.element.querySelector('.' + CONTENT_CLASS);
        this.touchObj = new Touch(this.element, { tapHold: this.tapHoldHandler.bind(this) });
    }
    tapHoldHandler(e) {
        this.tabHold = true;
    }
    destroy() {
        this.touchObj.destroy();
        this.tabHold = false;
        this.element = null;
    }
}

/**
 * Kanban mobile layout rendering module
 */
class MobileLayout {
    /**
     * Constructor for mobile layout module
     */
    constructor(parent) {
        this.parent = parent;
    }
    renderSwimlaneHeader() {
        let toolbarWrapper = createElement('div', { className: SWIMLANE_HEADER });
        toolbarWrapper.innerHTML = '<div class="' + SWIMLANE_HEADER_TOOLBAR + '"><div class="' + TOOLBAR_MENU + '">' +
            '<div class="e-icons ' + TOOLBAR_MENU_ICON + '"></div></div><div class="' + TOOLBAR_LEVEL_TITLE + '">' +
            '<div class="' + TOOLBAR_SWIMLANE_NAME + '"></div></div></div>';
        this.parent.element.appendChild(toolbarWrapper);
        EventHandler.add(toolbarWrapper.querySelector('.' + TOOLBAR_MENU_ICON), 'click', this.menuClick, this);
    }
    renderSwimlaneTree() {
        let height = this.parent.element.querySelector('.' + SWIMLANE_HEADER).offsetHeight;
        let treeHeight = window.innerHeight - height;
        this.popupOverlay = createElement('div', { className: SWIMLANE_OVERLAY, styles: 'height: ' + treeHeight + 'px;' });
        let wrapper = createElement('div', { className: SWIMLANE_CONTENT, styles: 'top:' + height + 'px;' });
        let treeWrapper = createElement('div', {
            className: SWIMLANE_RESOURCE + ' e-popup-close',
            styles: 'height: ' + treeHeight + 'px;'
        });
        wrapper.appendChild(treeWrapper);
        wrapper.appendChild(this.popupOverlay);
        this.parent.element.appendChild(wrapper);
        let swimlaneTree = createElement('div', { className: SWIMLANE_TREE });
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
    }
    menuClick(event) {
        if (this.parent.element.querySelector('.' + SWIMLANE_RESOURCE).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
        else {
            let treeNodes = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item'));
            removeClass(treeNodes, 'e-active');
            addClass([treeNodes[this.parent.layoutModule.swimlaneIndex]], 'e-active');
            this.treePopup.show();
            addClass([this.popupOverlay], 'e-enable');
        }
    }
    treeSwimlaneClick(args) {
        this.treePopup.hide();
        let treeNodes = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item'));
        this.parent.layoutModule.swimlaneIndex = treeNodes.indexOf(args.node);
        this.parent.layoutModule.scrollLeft = 0;
        this.parent.notify(dataReady, { processedData: this.parent.kanbanData });
        args.event.preventDefault();
    }
    getWidth() {
        return (window.innerWidth * 80) / 100;
    }
}

/**
 * Kanban layout rendering module
 */
class LayoutRender extends MobileLayout {
    /**
     * Constructor for layout module
     */
    constructor(parent) {
        super(parent);
        this.kanbanRows = [];
        this.parent = parent;
        this.columnKeys = [];
        this.swimlaneIndex = 0;
        this.scrollLeft = 0;
        this.wireEvents();
    }
    initRender() {
        if (this.parent.columns.length === 0) {
            return;
        }
        this.columnData = this.getColumnCards();
        this.kanbanRows = this.getRows();
        if (this.parent.isAdaptive) {
            let parent = this.parent.element.querySelector('.' + CONTENT_CLASS);
            if (parent) {
                this.scrollLeft = parent.scrollLeft;
            }
        }
        this.destroy();
        this.wireEvents();
        if (this.parent.isAdaptive && this.parent.swimlaneSettings.keyField) {
            this.renderSwimlaneHeader();
        }
        let header = createElement('div', { className: HEADER_CLASS });
        this.parent.element.appendChild(header);
        this.renderHeader(header);
        this.renderContent();
        this.renderCards();
        this.renderValidation();
        if (this.parent.isAdaptive) {
            this.parent.touchModule.wireTouchEvents();
            let parent = this.parent.element.querySelector('.' + CONTENT_CLASS);
            parent.scrollLeft = this.scrollLeft;
        }
        this.parent.notify(contentReady, {});
    }
    renderHeader(header) {
        let headerWrap = createElement('div', { className: this.parent.swimlaneSettings.keyField ? SWIMLANE_CLASS : '' });
        header.appendChild(headerWrap);
        let headerTable = createElement('table', { className: TABLE_CLASS + ' ' + HEADER_TABLE_CLASS });
        headerWrap.appendChild(headerTable);
        this.renderColGroup(headerTable);
        let tableHead = createElement('thead');
        headerTable.appendChild(tableHead);
        if (this.parent.stackedHeaders.length > 0) {
            tableHead.appendChild(this.createStackedRow(this.parent.stackedHeaders));
        }
        let tr = createElement('tr', { className: HEADER_ROW_CLASS });
        tableHead.appendChild(tr);
        for (let column of this.parent.columns) {
            if (this.isColumnVisible(column)) {
                let index = this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                let th = createElement('th', {
                    className: index === -1 ? HEADER_CELLS_CLASS : HEADER_CELLS_CLASS + ' ' + COLLAPSED_CLASS,
                    attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField }
                });
                let classList$$1 = [];
                if (column.allowToggle) {
                    classList$$1.push(HEADER_ROW_TOGGLE_CLASS);
                    if (!column.isExpanded) {
                        classList$$1.push(COLLAPSED_CLASS);
                    }
                }
                addClass([th], classList$$1);
                let headerWrapper = createElement('div', { className: HEADER_WRAP_CLASS });
                th.appendChild(headerWrapper);
                if (column.template) {
                    addClass([th], TEMPLATE_CLASS);
                    let templateHeader = this.parent.templateParser(column.template)(column);
                    append(templateHeader, headerWrapper);
                }
                else {
                    let header = createElement('div', { className: HEADER_TEXT_CLASS, innerHTML: column.headerText });
                    headerWrapper.appendChild(header);
                    if (column.showItemCount) {
                        let cardCount = this.columnData[column.keyField].length;
                        header.appendChild(createElement('div', {
                            className: TOTAL_CARD,
                            innerHTML: '- ' + cardCount.toString() + ' ' + this.parent.localeObj.getConstant('items')
                        }));
                    }
                }
                let dataObj = [{ keyField: column.keyField, textField: column.headerText }];
                let args = { data: dataObj, element: tr, cancel: false, requestType: 'headerRow' };
                this.parent.trigger(columnRendered, args, (columnArgs) => {
                    if (!columnArgs.cancel) {
                        tr.appendChild(th);
                        if (column.allowToggle) {
                            let name = (column.isExpanded && index === -1) ? COLUMN_EXPAND : COLUMN_COLLAPSE;
                            let iconDiv = createElement('div', {
                                className: HEADER_ICON_CLASS + ' ' + ICON_CLASS + ' ' + name
                            });
                            th.appendChild(iconDiv);
                            this.wireEvents(iconDiv, 'columnExpandCollapse');
                        }
                    }
                });
            }
        }
    }
    renderContent() {
        let content = createElement('div', { className: CONTENT_CLASS });
        this.parent.element.appendChild(content);
        let contentWrap = createElement('div', { className: this.parent.swimlaneSettings.keyField ? SWIMLANE_CLASS : '' });
        content.appendChild(contentWrap);
        let contentTable = createElement('table', { className: TABLE_CLASS + ' ' + CONTENT_TABLE_CLASS });
        contentWrap.appendChild(contentTable);
        this.renderColGroup(contentTable);
        let tBody = createElement('tbody');
        contentTable.appendChild(tBody);
        let className;
        let isCollaspsed = false;
        this.swimlaneRow = this.kanbanRows;
        if (this.parent.swimlaneSettings.keyField && this.parent.isAdaptive) {
            this.swimlaneRow = [this.kanbanRows[this.swimlaneIndex]];
            this.renderSwimlaneTree();
            (this.parent.element.querySelector('.' + TOOLBAR_SWIMLANE_NAME)).innerHTML = this.kanbanRows[this.swimlaneIndex].textField;
        }
        for (let row of this.swimlaneRow) {
            if (this.parent.swimlaneSettings.keyField && this.parent.actionModule.swimlaneToggleArray.length !== 0) {
                let index = this.parent.actionModule.swimlaneToggleArray.indexOf(row.keyField);
                isCollaspsed = index !== -1;
            }
            className = isCollaspsed ? CONTENT_ROW_CLASS + ' ' + COLLAPSED_CLASS : CONTENT_ROW_CLASS;
            let tr = createElement('tr', { className: className });
            if (this.parent.swimlaneSettings.keyField && !this.parent.isAdaptive) {
                this.renderSwimlaneRow(tBody, row, isCollaspsed);
            }
            for (let column of this.parent.columns) {
                if (this.isColumnVisible(column)) {
                    let index = this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                    let className = index === -1 ? CONTENT_CELLS_CLASS : CONTENT_CELLS_CLASS + ' ' + COLLAPSED_CLASS;
                    let td = createElement('td', {
                        className: className, attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField }
                    });
                    if (column.allowToggle && !column.isExpanded || index !== -1) {
                        addClass([td], COLLAPSED_CLASS);
                        td.appendChild(createElement('div', { className: COLLAPSE_HEADER_TEXT, innerHTML: column.headerText }));
                    }
                    tr.appendChild(td);
                    let dataObj = [{ keyField: row.keyField, textField: row.textField }];
                    let args = { data: dataObj, element: tr, cancel: false, requestType: 'contentRow' };
                    this.parent.trigger(columnRendered, args, (columnArgs) => {
                        if (!columnArgs.cancel) {
                            tBody.appendChild(tr);
                        }
                    });
                }
            }
        }
        this.wireEvents(content, 'scroll');
    }
    renderSwimlaneRow(tBody, row, isCollapsed) {
        let name = CONTENT_ROW_CLASS + ' ' + SWIMLANE_ROW_CLASS;
        let className = isCollapsed ? ' ' + COLLAPSED_CLASS : '';
        let tr = createElement('tr', {
            className: name + className, attrs: { 'data-key': row.keyField }
        });
        let col = this.parent.columns.length - this.parent.actionModule.hideColumnKeys.length;
        let td = createElement('td', {
            className: CONTENT_CELLS_CLASS,
            attrs: { 'data-role': 'kanban-column', 'colspan': col.toString() }
        });
        let iconClass = isCollapsed ? SWIMLANE_ROW_COLLAPSE : SWIMLANE_ROW_EXPAND;
        let iconDiv = createElement('div', { className: ICON_CLASS + ' ' + iconClass });
        td.appendChild(iconDiv);
        if (this.parent.swimlaneSettings.template) {
            addClass([td], TEMPLATE_CLASS);
            let swimlaneTemplate = this.parent.templateParser(this.parent.swimlaneSettings.template)(row);
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
        let dataObj = [{ keyField: row.keyField, textField: row.textField }];
        let args = { data: dataObj, element: tr, cancel: false, requestType: 'swimlaneRow' };
        this.parent.trigger(columnRendered, args, (columnArgs) => {
            if (!columnArgs.cancel) {
                tBody.appendChild(tr);
                this.wireEvents(tr, 'rowExpandCollapse');
            }
        });
    }
    renderCards() {
        let rows = this.swimlaneRow;
        let cardRows = [].slice.call(this.parent.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)'));
        let swimlaneRows = [].slice.call(this.parent.element.querySelectorAll('.e-content-row.e-swimlane-row'));
        let removeTrs = [];
        cardRows.forEach((tr, index) => {
            let dataCount = 0;
            for (let column of this.parent.columns) {
                if (this.isColumnVisible(column)) {
                    let columnData = this.columnData[column.keyField];
                    if (this.parent.swimlaneSettings.keyField) {
                        columnData = columnData.filter((data) => data[this.parent.swimlaneSettings.keyField] === rows[index].keyField);
                    }
                    dataCount += columnData.length;
                    let columnWrapper = tr.querySelector('[data-key="' + column.keyField + '"]');
                    let cardWrapper = createElement('div', { className: CARD_WRAPPER_CLASS });
                    columnWrapper.appendChild(cardWrapper);
                    for (let data of columnData) {
                        let cardText = data[this.parent.cardSettings.headerField];
                        let cardIndex = this.parent.actionModule.selectionArray.indexOf(cardText);
                        let className = cardIndex === -1 ? '' : ' ' + CARD_SELECTION;
                        let cardElement = createElement('div', {
                            className: CARD_CLASS + className,
                            attrs: { 'data-id': data[this.parent.cardSettings.headerField], 'data-key': data[this.parent.keyField] }
                        });
                        if (this.parent.cardSettings.template) {
                            addClass([cardElement], TEMPLATE_CLASS);
                            let cardTemplate = this.parent.templateParser(this.parent.cardSettings.template)(data);
                            append(cardTemplate, cardElement);
                        }
                        else {
                            let tooltipClass = this.parent.enableTooltip ? ' ' + TOOLTIP_TEXT : '';
                            if (this.parent.cardSettings.showHeader) {
                                let cardHeader = createElement('div', { className: CARD_HEADER_CLASS });
                                let cardText = createElement('div', {
                                    className: CARD_HEADER_TEXT_CLASS + tooltipClass,
                                    innerHTML: data[this.parent.cardSettings.headerField] || ''
                                });
                                cardHeader.appendChild(cardText);
                                cardElement.appendChild(cardHeader);
                            }
                            let cardContent = createElement('div', { className: CARD_CONTENT_CLASS });
                            let cardText = createElement('div', {
                                className: CARD_CONTENT_TEXT_CLASS + tooltipClass,
                                innerHTML: data[this.parent.cardSettings.contentField] || ''
                            });
                            cardContent.appendChild(cardText);
                            cardElement.appendChild(cardContent);
                        }
                        let args = { data: data, element: cardElement, cancel: false };
                        this.parent.trigger(cardRendered, args, (cardArgs) => {
                            if (!cardArgs.cancel) {
                                cardWrapper.appendChild(cardElement);
                                this.wireEvents(cardElement, 'card');
                                if (this.parent.allowDragAndDrop) {
                                    this.parent.dragAndDropModule.wireDragEvents(cardElement);
                                }
                            }
                        });
                    }
                }
            }
            if (swimlaneRows.length > 0 && this.parent.swimlaneSettings.showItemCount && !this.parent.swimlaneSettings.template) {
                let localeText = this.parent.localeObj.getConstant('items');
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
            removeTrs.forEach((tr) => remove(tr));
        }
    }
    renderColGroup(table) {
        let colGroup = createElement('colgroup');
        this.parent.columns.forEach((column) => {
            if (this.isColumnVisible(column)) {
                let index = this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                let isToggle = column.allowToggle && !column.isExpanded;
                let className = index === -1 ? (isToggle ? COLLAPSED_CLASS : '') : COLLAPSED_CLASS;
                let col = createElement('col', {
                    className: className,
                    attrs: { 'data-key': column.keyField },
                    styles: this.parent.isAdaptive ? 'width: ' +
                        (isToggle ? formatUnit(toggleWidth) : formatUnit(this.getWidth())) : ''
                });
                colGroup.appendChild(col);
            }
        });
        table.appendChild(colGroup);
    }
    getRows() {
        let kanbanRows = [];
        if (this.parent.swimlaneSettings.keyField) {
            this.parent.kanbanData.map((obj) => {
                if (!this.parent.swimlaneSettings.showEmptyRow && this.parent.isAdaptive) {
                    if (this.columnKeys.indexOf(obj[this.parent.keyField]) === -1) {
                        return;
                    }
                }
                kanbanRows.push({
                    keyField: obj[this.parent.swimlaneSettings.keyField],
                    textField: obj[this.parent.swimlaneSettings.textField] || obj[this.parent.swimlaneSettings.keyField]
                });
            });
            kanbanRows = kanbanRows.filter((item, index, arr) => index === arr.map((item) => item.keyField).indexOf(item.keyField));
            kanbanRows.sort((a, b) => (a.textField > b.textField) ? 1 : ((b.textField > a.textField) ? -1 : 0));
            if (this.parent.swimlaneSettings.sortBy === 'Descending') {
                kanbanRows.reverse();
            }
        }
        else {
            kanbanRows.push({ keyField: '', textField: '' });
        }
        return kanbanRows;
    }
    createStackedRow(rows) {
        let tr = createElement('tr', { className: HEADER_ROW_CLASS + ' e-stacked-header-row' });
        let stackedHeaders = [];
        this.parent.columns.forEach((column) => {
            let headerText = '';
            for (let row of rows) {
                if (row.keyFields.indexOf(column.keyField) !== -1) {
                    headerText = row.text;
                }
            }
            stackedHeaders.push(headerText);
        });
        for (let h = 0; h < stackedHeaders.length; h++) {
            let colSpan = 1;
            for (let j = h + 1; j < stackedHeaders.length; j++) {
                if ((stackedHeaders[h] !== '') && (stackedHeaders[j] !== '') && stackedHeaders[h] === stackedHeaders[j]) {
                    colSpan++;
                }
                else {
                    break;
                }
            }
            let div = createElement('div', { className: HEADER_TEXT_CLASS, innerHTML: stackedHeaders[h] });
            let th = createElement('th', {
                className: HEADER_CELLS_CLASS + ' e-stacked-header-cell',
                attrs: { 'colspan': colSpan.toString() }
            });
            tr.appendChild(th).appendChild(div);
            h += colSpan - 1;
        }
        return tr;
    }
    scrollUiUpdate() {
        let header = this.parent.element.querySelector('.' + HEADER_CLASS);
        let content = this.parent.element.querySelector('.' + CONTENT_CLASS);
        let height = this.parent.element.offsetHeight - header.offsetHeight;
        if (this.parent.isAdaptive) {
            height = window.innerHeight - (header.offsetHeight + bottomSpace);
            let swimlaneToolbar = this.parent.element.querySelector('.' + SWIMLANE_HEADER);
            if (swimlaneToolbar) {
                height -= swimlaneToolbar.offsetHeight;
            }
            let cardWrappers = [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_CELLS_CLASS));
            cardWrappers.forEach((cell) => {
                if (!cell.classList.contains(MULTI_CLONE_CONTENT_CELL)) {
                    cell.querySelector('.' + CARD_WRAPPER_CLASS).style.height = formatUnit(height);
                    EventHandler.add(cell, 'touchmove', this.onAdaptiveScroll, this);
                }
            });
        }
        if (this.parent.height !== 'auto' && this.parent.height !== '100%') {
            content.style.height = formatUnit(height);
        }
        [].slice.call(header.childNodes).forEach((node) => {
            let paddingValue = 0;
            if ((content.offsetWidth - content.clientWidth) > 0) {
                paddingValue = 17;
                if ((content.offsetHeight - content.clientHeight) > 0) {
                    node.style.width = formatUnit(content.clientWidth);
                }
            }
            if (this.parent.enableRtl) {
                node.style.paddingLeft = formatUnit(paddingValue);
            }
            else {
                node.style.paddingRight = formatUnit(paddingValue);
            }
        });
    }
    onContentScroll(e) {
        let header = this.parent.element.querySelector('.' + HEADER_CLASS + ' div');
        header.scrollLeft = e.target.scrollLeft;
    }
    onAdaptiveScroll(e) {
        if (this.parent.touchModule.tabHold) {
            e.preventDefault();
        }
    }
    isColumnVisible(column) {
        let isVisible = false;
        column.keyField.split(',').forEach((key) => { isVisible = this.parent.actionModule.hideColumnKeys.indexOf(key) === -1; });
        return isVisible;
    }
    renderLimits(column, target) {
        let limits = createElement('div', { className: LIMITS_CLASS });
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
    }
    renderValidation() {
        let getValidationClass = (column, count) => {
            let colorClass;
            if (column.maxCount && count > column.maxCount) {
                colorClass = MAX_COLOR;
            }
            else if (column.minCount && count < column.minCount) {
                colorClass = MIN_COLOR;
            }
            return colorClass;
        };
        this.parent.columns.forEach((column) => {
            if (!column.minCount && !column.maxCount) {
                return;
            }
            let cardData = this.columnData[column.keyField];
            let keySelector = `[data-key="${column.keyField}"]`;
            let headerCell = this.parent.element.querySelector(`.${HEADER_CELLS_CLASS + keySelector}`);
            let rowCells = [].slice.call(this.parent.element.querySelectorAll(`.${CONTENT_CELLS_CLASS + keySelector}`));
            if (this.parent.constraintType === 'Swimlane' && this.parent.swimlaneSettings.keyField) {
                this.kanbanRows.forEach((row, index) => {
                    this.renderLimits(column, rowCells[index]);
                    let rowCards = cardData.filter((card) => card[this.parent.swimlaneSettings.keyField] === row.keyField);
                    let colorClass = getValidationClass(column, rowCards.length);
                    if (colorClass) {
                        addClass([rowCells[index]], colorClass);
                    }
                });
            }
            else {
                this.renderLimits(column, headerCell);
                let colorClass = getValidationClass(column, cardData.length);
                if (colorClass) {
                    addClass(rowCells.concat(headerCell), colorClass);
                }
            }
        });
    }
    getColumnCards() {
        let columnData = {};
        this.columnKeys = [];
        this.parent.columns.forEach((column) => {
            let cardData = [];
            let columnKeys = column.keyField.split(',');
            for (let key of columnKeys) {
                this.columnKeys.push(key.trim());
                let keyData = this.parent.kanbanData.filter((cardObj) => cardObj[this.parent.keyField] === key.trim());
                cardData = cardData.concat(keyData);
            }
            columnData[column.keyField] = cardData;
        });
        return columnData;
    }
    wireEvents(element, action) {
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
    }
    unWireEvents(element, action) {
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
    }
    refreshHeaders() {
        let header = this.parent.element.querySelector('.' + HEADER_CLASS);
        [].slice.call(header.children).forEach((child) => remove(child));
        this.renderHeader(header);
    }
    refreshCards() {
        let cards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_WRAPPER_CLASS));
        cards.forEach((card) => remove(card));
        this.renderCards();
    }
    destroy() {
        this.unWireEvents();
        let cards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_CLASS));
        cards.forEach((card) => this.unWireEvents(card, 'card'));
        let rows = [].slice.call(this.parent.element.querySelectorAll('.' + SWIMLANE_ROW_CLASS));
        rows.forEach((row) => this.unWireEvents(row, 'rowExpandCollapse'));
        let columns = [].slice.call(this.parent.element.querySelectorAll('.' + HEADER_ICON_CLASS));
        columns.forEach((column) => this.unWireEvents(column, 'columnExpandCollapse'));
        let header = this.parent.element.querySelector('.' + HEADER_CLASS);
        if (header) {
            remove(header);
        }
        let content = this.parent.element.querySelector('.' + CONTENT_CLASS);
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
        let swimlaneToolBarEle = this.parent.element.querySelector('.' + SWIMLANE_HEADER);
        if (swimlaneToolBarEle) {
            remove(swimlaneToolBarEle);
        }
        let swimlaneContent = this.parent.element.querySelector('.' + SWIMLANE_CONTENT);
        if (swimlaneContent) {
            remove(swimlaneContent);
        }
    }
}

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
let Kanban = class Kanban extends Component {
    /**
     * Constructor for creating the Kanban widget
     * @hidden
     */
    constructor(options, element) {
        super(options, element);
    }
    /**
     * Initializes the values of private members.
     * @private
     */
    preRender() {
        this.isAdaptive = Browser.isDevice;
        this.kanbanData = [];
        this.activeCardData = { data: null, element: null };
        let defaultLocale = {
            items: 'items',
            min: 'Min',
            max: 'Max'
        };
        this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        let modules = [];
        return modules;
    }
    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Core method to return the component name.
     * @private
     */
    getModuleName() {
        return 'kanban';
    }
    /**
     * Core method that initializes the control rendering.
     * @private
     */
    render() {
        let addClasses = [];
        let removeClasses = [];
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
    }
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
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
                    let cards = [].slice.call(this.element.querySelectorAll('.' + CARD_CLASS));
                    cards.forEach((card) => {
                        if (newProp.allowDragAndDrop) {
                            this.dragAndDropModule.wireDragEvents(card);
                        }
                        else {
                            this.dragAndDropModule.unWireDragEvents(card);
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
    }
    onSwimlaneSettingsPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
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
    }
    onCardSettingsPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'showHeader':
                case 'headerField':
                case 'contentField':
                case 'template':
                    this.layoutModule.refreshCards();
                    break;
                case 'selectionType':
                    let cards = this.getSelectedCards();
                    if (cards.length > 0) {
                        removeClass(cards, CARD_SELECTION);
                    }
                    break;
            }
        }
    }
    initializeModules() {
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
    }
    destroyModules() {
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
    }
    /** @private */
    templateParser(template) {
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
    }
    /**
     * Returns the card details based on card ID from the board.
     * @method getCardDetails
     * @param {Element} target Accepts the card element to get the details.
     * @returns {{[key: string]: Object}}
     */
    getCardDetails(target) {
        let isNumeric = typeof this.kanbanData[0][this.cardSettings.headerField] === 'number';
        let targetId = isNumeric ? parseInt(target.getAttribute('data-id'), 10) : target.getAttribute('data-id');
        let cardObj = this.kanbanData.filter((data) => data[this.cardSettings.headerField] === targetId)[0];
        return cardObj;
    }
    /**
     * Gets the list of selected cards from the board.
     * @method getSelectedCards
     * @returns {HTMLElement[]}
     */
    getSelectedCards() {
        return [].slice.call(this.element.querySelectorAll('.' + CARD_CLASS + '.' + CARD_SELECTION));
    }
    /**
     * Allows you to show the spinner on Kanban at the required scenarios.
     * @method showSpinner
     * @returns {void}
     */
    showSpinner() {
        showSpinner(this.element);
    }
    /**
     * When the spinner is shown manually using the showSpinner method, it can be hidden using this `hideSpinner` method.
     * @method hideSpinner
     * @returns {void}
     */
    hideSpinner() {
        hideSpinner(this.element);
    }
    /**
     * Adds the new card to the data source of Kanban and layout.
     * @method addEvent
     * @param {{[key: string]: Object}} cardData Single card objects to be added into Kanban.
     * @param {{[key: string]: Object}[]} cardData Collection of card objects to be added into Kanban.
     * @returns {void}
     */
    addCard(cardData) {
        this.crudModule.addCard(cardData);
    }
    /**
     * Updates the changes made in the event object by passing it as a parameter to the data source.
     * @method updateCard
     * @param {{[key: string]: Object}} cardData Single card object to be updated into Kanban.
     * @param {{[key: string]: Object}[]} cardData Collection of card objects to be updated into Kanban.
     * @returns {void}
     */
    updateCard(cardData) {
        this.crudModule.updateCard(cardData);
    }
    /**
     * Deletes the card based on the provided ID or card collection in the argument list.
     * @method deleteCard
     * @param {{[key: string]: Object}} id Single card to be removed from the Kanban.
     * @param {{[key: string]: Object }[]} id Collection of cards to be removed from the Kanban.
     * @param {number} id Accepts the ID of the card in integer type which needs to be removed from the Kanban.
     * @param {string} id Accepts the ID of the card in string type which needs to be removed from the Kanban.
     * @returns {void}
     */
    deleteCard(cardData) {
        this.crudModule.deleteCard(cardData);
    }
    /**
     * Add the column to Kanban board dynamically based on the provided column options and index in the argument list.
     * @method addColumn
     * @param {ColumnsModel} columnOptions Defines the properties to new column that are going to be added in the board.
     * @param {number} index Defines the index of column to add the new column.
     * @returns {void}
     */
    addColumn(columnOptions, index) {
        this.actionModule.addColumn(columnOptions, index);
    }
    /**
     * Deletes the column based on the provided index value.
     * @method deleteColumn
     * @param {number} index Defines the index of column to delete the existing column from Kanban board.
     * @returns {void}
     */
    deleteColumn(index) {
        this.actionModule.deleteColumn(index);
    }
    /**
     * Shows the column from hidden based on the provided key in the columns.
     * @method showColumn
     * @param {string} key Accepts the hidden column key name to be shown from the hidden state in board.
     * @returns {void}
     */
    showColumn(key) {
        this.actionModule.showColumn(key);
    }
    /**
     * Hides the column from Kanban board based on the provided key in the columns.
     * @method hideColumn
     * @param {string} key Accepts the visible column key name to be hidden from the board.
     * @returns {void}
     */
    hideColumn(key) {
        this.actionModule.hideColumn(key);
    }
    /**
     * Removes the control from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.destroyModules();
        super.destroy();
        this.element.innerHTML = '';
        let removeClasses = [ROOT_CLASS];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
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
//# sourceMappingURL=ej2-kanban.es2015.js.map
