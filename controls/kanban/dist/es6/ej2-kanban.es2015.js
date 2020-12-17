import { Browser, ChildProperty, Collection, Complex, Component, Draggable, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Property, Touch, addClass, append, classList, closest, compile, createElement, detach, extend, formatUnit, isNullOrUndefined, remove, removeClass } from '@syncfusion/ej2-base';
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
const queryCellInfo = 'queryCellInfo';
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
/** @hidden */
const dialogOpen = 'dialogOpen';
/** @hidden */
const dialogClose = 'dialogClose';
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
 * Kanban data module
 * @hidden
 */
class Data {
    /**
     * Constructor for data module
     * @private
     */
    constructor(parent) {
        this.parent = parent;
        this.keyField = this.parent.cardSettings.headerField;
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
        this.kanbanData = new DataManager(this.parent.kanbanData);
    }
    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    getQuery() {
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
     * The function used to get the table name from the given Query
     * @return {string}
     * @private
     */
    getTable() {
        if (this.parent.query) {
            let query = this.getQuery();
            return query.fromTable;
        }
        else {
            return null;
        }
    }
    /**
     * The function is used to send the request and get response from datamanager
     * @return {void}
     * @private
     */
    refreshDataManager() {
        let dataManager = this.getData(this.getQuery());
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
            this.kanbanData.saveChanges({ addedRecords: resultData, changedRecords: [], deletedRecords: [] });
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
    /**
     * The function is used to perform the insert, update, delete and batch actions in datamanager
     * @return {void}
     * @private
     */
    updateDataManager(updateType, params, type, data, index) {
        this.parent.showSpinner();
        let promise;
        let actionArgs = {
            requestType: type, cancel: false, addedRecords: params.addedRecords,
            changedRecords: params.changedRecords, deletedRecords: params.deletedRecords
        };
        this.parent.trigger(actionComplete, actionArgs, (offlineArgs) => {
            if (!offlineArgs.cancel) {
                switch (updateType) {
                    case 'insert':
                        promise = this.dataManager.insert(data, this.getTable(), this.getQuery());
                        break;
                    case 'update':
                        promise = this.dataManager.update(this.keyField, data, this.getTable(), this.getQuery());
                        break;
                    case 'delete':
                        promise = this.dataManager.remove(this.keyField, data, this.getTable(), this.getQuery());
                        break;
                    case 'batch':
                        promise = this.dataManager.saveChanges(params, this.keyField, this.getTable(), this.getQuery());
                        break;
                }
                if (this.dataManager.dataSource.offline) {
                    this.kanbanData = this.dataManager;
                    this.parent.kanbanData = this.dataManager.dataSource.json;
                    this.refreshUI(offlineArgs, index);
                }
                else {
                    promise.then((e) => {
                        if (this.parent.isDestroyed) {
                            return;
                        }
                        this.refreshUI(offlineArgs, index);
                    }).catch((e) => {
                        this.dataManagerFailure(e);
                    });
                }
            }
        });
    }
    /**
     * The function is used to refresh the UI once the datamanager action is completed
     * @return {void}
     * @private
     */
    refreshUI(args, index) {
        this.parent.layoutModule.columnData = this.parent.layoutModule.getColumnCards();
        if (this.parent.swimlaneSettings.keyField) {
            this.parent.layoutModule.swimlaneData = this.parent.layoutModule.getSwimlaneCards();
        }
        args.addedRecords.forEach((data) => {
            this.parent.layoutModule.renderCardBasedOnIndex(data);
        });
        args.changedRecords.forEach((data) => {
            this.parent.layoutModule.removeCard(data);
            this.parent.layoutModule.renderCardBasedOnIndex(data, index);
            if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index'
                && this.parent.sortSettings.direction === 'Descending' && index > 0) {
                --index;
            }
        });
        args.deletedRecords.forEach((data) => {
            this.parent.layoutModule.removeCard(data);
        });
        this.parent.layoutModule.refresh();
        this.parent.renderTemplates();
        this.parent.trigger(dataBound, null, () => this.parent.hideSpinner());
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
], SwimlaneSettings.prototype, "sortDirection", void 0);
__decorate$1([
    Property()
], SwimlaneSettings.prototype, "sortComparer", void 0);
__decorate$1([
    Property(true)
], SwimlaneSettings.prototype, "showUnassignedRow", void 0);

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

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Holds the configuration of editor settings.
 */
class DialogSettings extends ChildProperty {
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

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
__decorate$4([
    Property(true)
], Columns.prototype, "allowDrag", void 0);
__decorate$4([
    Property(true)
], Columns.prototype, "allowDrop", void 0);
__decorate$4([
    Property([])
], Columns.prototype, "transitionColumns", void 0);

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
__decorate$5([
    Property()
], StackedHeaders.prototype, "text", void 0);
__decorate$5([
    Property()
], StackedHeaders.prototype, "keyFields", void 0);

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Holds the configuration of sort settings in kanban board.
 */
class SortSettings extends ChildProperty {
}
__decorate$6([
    Property('Index')
], SortSettings.prototype, "sortBy", void 0);
__decorate$6([
    Property()
], SortSettings.prototype, "field", void 0);
__decorate$6([
    Property('Ascending')
], SortSettings.prototype, "direction", void 0);

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
const HEADER_TITLE_CLASS = 'e-header-title';
/** @hidden */
const HEADER_TEXT_CLASS = 'e-header-text';
/** @hidden */
const HEADER_ICON_CLASS = 'e-header-icon';
/** @hidden */
const STACKED_HEADER_ROW_CLASS = 'e-stacked-header-row';
/** @hidden */
const STACKED_HEADER_CELL_CLASS = 'e-stacked-header-cell';
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
const SWIMLANE_ROW_EXPAND_CLASS = 'e-swimlane-row-expand';
/** @hidden */
const SWIMLANE_ROW_COLLAPSE_CLASS = 'e-swimlane-row-collapse';
/** @hidden */
const SWIMLANE_ROW_TEXT_CLASS = 'e-swimlane-text';
/** @hidden */
const CARD_ITEM_COUNT_CLASS = 'e-item-count';
/** @hidden */
const CARD_WRAPPER_CLASS = 'e-card-wrapper';
/** @hidden */
const CARD_CLASS = 'e-card';
/** @hidden */

/** @hidden */
const DROPPABLE_CLASS = 'e-droppable';
/** @hidden */
const DRAG_CLASS = 'e-drag';
/** @hidden */
const DROP_CLASS = 'e-drop';
/** @hidden */
const DISABLED_CLASS = 'e-disabled';
/** @hidden */
const CARD_HEADER_CLASS = 'e-card-header';
/** @hidden */
const CARD_CONTENT_CLASS = 'e-card-content';
/** @hidden */
const CARD_HEADER_TEXT_CLASS = 'e-card-header-caption';
/** @hidden */
const CARD_HEADER_TITLE_CLASS = 'e-card-header-title';
/** @hidden */
const CARD_TAGS_CLASS = 'e-card-tags';
/** @hidden */
const CARD_TAG_CLASS = 'e-card-tag';
/** @hidden */
const CARD_COLOR_CLASS = 'e-card-color';
/** @hidden */
const CARD_LABEL_CLASS = 'e-card-label';
/** @hidden */
const CARD_FOOTER_CLASS = 'e-card-footer';
/** @hidden */
const EMPTY_CARD_CLASS = 'e-empty-card';
/** @hidden */
const CARD_FOOTER_CSS_CLASS = 'e-card-footer-css';
/** @hidden */
const COLUMN_EXPAND_CLASS = 'e-column-expand';
/** @hidden */
const COLUMN_COLLAPSE_CLASS = 'e-column-collapse';
/** @hidden */
const COLLAPSE_HEADER_TEXT_CLASS = 'e-collapse-header-text';
/** @hidden */
const COLLAPSED_CLASS = 'e-collapsed';
/** @hidden */
const DIALOG_CLASS = 'e-kanban-dialog';
/** @hidden */

/** @hidden */
const FORM_CLASS = 'e-kanban-form';
/** @hidden */
const FORM_WRAPPER_CLASS = 'e-kanban-form-wrapper';
/** @hidden */
const ERROR_VALIDATION_CLASS = 'e-kanban-error';
/** @hidden */
const FIELD_CLASS = 'e-field';
/** @hidden */
const DRAGGED_CLONE_CLASS = 'e-target-dragged-clone';
/** @hidden */
const CLONED_CARD_CLASS = 'e-cloned-card';
/** @hidden */
const DRAGGED_CARD_CLASS = 'e-kanban-dragged-card';
/** @hidden */
const DROPPED_CLONE_CLASS = 'e-target-dropped-clone';
/** @hidden */
const DROPPING_CLASS = 'e-dropping';
/** @hidden */
const TOGGLE_VISIBLE_CLASS = 'e-toggle-visible';
/** @hidden */

/** @hidden */
const MULTI_CARD_WRAPPER_CLASS = 'e-multi-card-wrapper';
/** @hidden */
const MULTI_ACTIVE_CLASS = 'e-multi-active';
/** @hidden */
const TARGET_MULTI_CLONE_CLASS = 'e-target-multi-clone';
/** @hidden */
const MULTI_COLUMN_KEY_CLASS = 'e-column-key';
/** @hidden */
const CARD_SELECTION_CLASS = 'e-selection';
/** @hidden */
const TOOLTIP_CLASS = 'e-kanban-tooltip';
/** @hidden */
const TOOLTIP_TEXT_CLASS = 'e-tooltip-text';
/** @hidden */

/** @hidden */
const SWIMLANE_HEADER_CLASS = 'e-swimlane-header';
/** @hidden */
const SWIMLANE_HEADER_TOOLBAR_CLASS = 'e-swimlane-header-toolbar';
/** @hidden */
const TOOLBAR_MENU_CLASS = 'e-toolbar-menu';
/** @hidden */
const TOOLBAR_MENU_ICON_CLASS = 'e-icon-menu';
/** @hidden */
const TOOLBAR_LEVEL_TITLE_CLASS = 'e-toolbar-level-title';
/** @hidden */
const TOOLBAR_SWIMLANE_NAME_CLASS = 'e-toolbar-swimlane-name';
/** @hidden */
const SWIMLANE_OVERLAY_CLASS = 'e-swimlane-overlay';
/** @hidden */
const SWIMLANE_CONTENT_CLASS = 'e-swimlane-content';
/** @hidden */
const SWIMLANE_RESOURCE_CLASS = 'e-swimlane-resource';
/** @hidden */
const SWIMLANE_TREE_CLASS = 'e-swimlane-tree';
/** @hidden */
const LIMITS_CLASS = 'e-limits';
/** @hidden */
const MAX_COUNT_CLASS = 'e-max-count';
/** @hidden */
const MIN_COUNT_CLASS = 'e-min-count';
/** @hidden */
const MAX_COLOR_CLASS = 'e-max-color';
/** @hidden */
const MIN_COLOR_CLASS = 'e-min-color';
/** @hidden */

/** @hidden */
const POPUP_HEADER_CLASS = 'e-popup-header';
/** @hidden */
const CLOSE_CLASS = 'e-close';
/** @hidden */
const POPUP_CONTENT_CLASS = 'e-popup-content';
/** @hidden */
const POPUP_WRAPPER_CLASS = 'e-mobile-popup-wrapper';
/** @hidden */
const CLOSE_ICON_CLASS = 'e-close-icon';
/** @hidden */
const POPUP_OPEN_CLASS = 'e-popup-open';
/** @hidden */
const DIALOG_CONTENT_CONTAINER = 'e-kanban-dialog-content';
/** @hidden */
const SHOW_ADD_BUTTON = 'e-show-add-button';
/** @hidden */
const SHOW_ADD_ICON = 'e-show-add-icon';
/** @hidden */
const SHOW_ADD_FOCUS = 'e-show-add-focus';

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
        this.columnToggleArray = [];
        this.selectionArray = [];
        this.lastCardSelection = null;
        this.lastSelectionRow = null;
        this.lastCard = null;
        this.selectedCardsElement = [];
        this.selectedCardsData = [];
        this.hideColumnKeys = [];
    }
    clickHandler(e) {
        let elementSelector = '.' + CARD_CLASS + ',.' + HEADER_ICON_CLASS + ',.' + CONTENT_ROW_CLASS + '.' +
            SWIMLANE_ROW_CLASS + ',.' + SHOW_ADD_BUTTON + ',.' + CONTENT_ROW_CLASS +
            ':not(.' + SWIMLANE_ROW_CLASS + ') .' + CONTENT_CELLS_CLASS;
        let target = closest(e.target, elementSelector);
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
    }
    addButtonClick(target) {
        let newData = {};
        if (this.parent.kanbanData.length === 0) {
            newData[this.parent.cardSettings.headerField] = 1;
        }
        else if (typeof this.parent.kanbanData[0][this.parent.cardSettings.headerField] === 'number') {
            newData[this.parent.cardSettings.headerField] = Math.max.apply(Math, this.parent.kanbanData.map((obj) => parseInt(obj[this.parent.cardSettings.headerField], 10))) + 1;
        }
        newData[this.parent.keyField] = closest(target, '.' + CONTENT_CELLS_CLASS).getAttribute('data-key');
        if (this.parent.sortSettings.sortBy === 'Index') {
            newData[this.parent.sortSettings.field] = 1;
            if (closest(target, '.' + CONTENT_CELLS_CLASS).querySelector('.' + CARD_CLASS)) {
                let card = this.parent.sortSettings.direction === 'Ascending' ?
                    target.nextElementSibling.lastElementChild : target.nextElementSibling.firstElementChild;
                let data = this.parent.getCardDetails(card);
                newData[this.parent.sortSettings.field] = data[this.parent.sortSettings.field] + 1;
            }
        }
        if (this.parent.kanbanData.length !== 0 && this.parent.swimlaneSettings.keyField &&
            closest(target, '.' + CONTENT_ROW_CLASS).previousElementSibling) {
            newData[this.parent.swimlaneSettings.keyField] =
                closest(target, '.' + CONTENT_ROW_CLASS).previousElementSibling.getAttribute('data-key');
        }
        this.parent.openDialog('Add', newData);
    }
    doubleClickHandler(e) {
        let target = closest(e.target, '.' + CARD_CLASS);
        if (target) {
            this.cardDoubleClick(e);
        }
    }
    cardClick(e, selectedCard) {
        let target = closest((selectedCard) ? selectedCard : e.target, '.' + CARD_CLASS);
        let cardClickObj = this.parent.getCardDetails(target);
        if (cardClickObj) {
            this.parent.activeCardData = { data: cardClickObj, element: target };
            let args = { data: cardClickObj, element: target, cancel: false, event: e };
            this.parent.trigger(cardClick, args, (clickArgs) => {
                if (!clickArgs.cancel) {
                    if (target.classList.contains(CARD_SELECTION_CLASS) && e.type === 'click') {
                        removeClass([target], CARD_SELECTION_CLASS);
                        this.parent.layoutModule.disableAttributeSelection(target);
                    }
                    else {
                        let isCtrlKey = e.ctrlKey;
                        if (this.parent.isAdaptive && this.parent.touchModule) {
                            isCtrlKey = (this.parent.touchModule.mobilePopup && this.parent.touchModule.tabHold) || isCtrlKey;
                        }
                        this.cardSelection(target, isCtrlKey, e.shiftKey);
                    }
                    if (this.parent.isAdaptive && this.parent.touchModule) {
                        this.parent.touchModule.updatePopupContent();
                    }
                    let cell = closest(target, '.' + CONTENT_CELLS_CLASS);
                    if (this.parent.allowKeyboard) {
                        let element = [].slice.call(cell.querySelectorAll('.' + CARD_CLASS));
                        element.forEach((e) => { e.setAttribute('tabindex', '0'); });
                        this.parent.keyboardModule.addRemoveTabIndex('Remove');
                    }
                }
            });
        }
    }
    cardDoubleClick(e) {
        let target = closest(e.target, '.' + CARD_CLASS);
        let cardDoubleClickObj = this.parent.getCardDetails(target);
        this.parent.activeCardData = { data: cardDoubleClickObj, element: target };
        let args = { data: cardDoubleClickObj, element: target, cancel: false, event: e };
        this.parent.trigger(cardDoubleClick, args, (doubleClickArgs) => {
            if (!doubleClickArgs.cancel) {
                this.parent.dialogModule.openDialog('Edit', args.data);
            }
        });
    }
    rowExpandCollapse(e) {
        let headerTarget = (e instanceof HTMLElement) ? e : e.target;
        let args = { cancel: false, target: headerTarget, requestType: 'rowExpandCollapse' };
        this.parent.trigger(actionBegin, args, (actionArgs) => {
            if (!actionArgs.cancel) {
                let target = closest(headerTarget, '.' + SWIMLANE_ROW_CLASS);
                let key = target.getAttribute('data-key');
                let tgtRow = this.parent.element.querySelector('.' + CONTENT_ROW_CLASS + `:nth-child(${target.rowIndex + 2})`);
                let targetIcon = target.querySelector(`.${SWIMLANE_ROW_EXPAND_CLASS},.${SWIMLANE_ROW_COLLAPSE_CLASS}`);
                let isCollapsed = target.classList.contains(COLLAPSED_CLASS) ? true : false;
                let tabIndex;
                if (isCollapsed) {
                    removeClass([tgtRow, target], COLLAPSED_CLASS);
                    classList(targetIcon, [SWIMLANE_ROW_EXPAND_CLASS], [SWIMLANE_ROW_COLLAPSE_CLASS]);
                    this.parent.swimlaneToggleArray.splice(this.parent.swimlaneToggleArray.indexOf(key), 1);
                    tabIndex = '0';
                }
                else {
                    addClass([tgtRow, target], COLLAPSED_CLASS);
                    classList(targetIcon, [SWIMLANE_ROW_COLLAPSE_CLASS], [SWIMLANE_ROW_EXPAND_CLASS]);
                    this.parent.swimlaneToggleArray.push(key);
                    tabIndex = '-1';
                }
                targetIcon.setAttribute('aria-label', isCollapsed ? key + ' Expand' : key + ' Collapse');
                target.setAttribute('aria-expanded', isCollapsed.toString());
                tgtRow.setAttribute('aria-expanded', isCollapsed.toString());
                let rows = [].slice.call(tgtRow.querySelectorAll('.' + CONTENT_CELLS_CLASS));
                rows.forEach((cell) => { cell.setAttribute('tabindex', tabIndex); });
                this.parent.notify(contentReady, {});
                this.parent.trigger(actionComplete, { target: headerTarget, requestType: 'rowExpandCollapse' });
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
                    let index = (colIndex + 1 === collapsed) ? 1 : colIndex + 2;
                    let headerSelector = `.${HEADER_CELLS_CLASS}:not(.${STACKED_HEADER_CELL_CLASS}):nth-child(${index})`;
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
        let elementSelector = `.${CONTENT_ROW_CLASS}:not(.${SWIMLANE_ROW_CLASS})`;
        let targetRow = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
        let colSelector = `.${TABLE_CLASS} col:nth-child(${colIndex + 1})`;
        let targetIcon = target.querySelector(`.${COLUMN_EXPAND_CLASS},.${COLUMN_COLLAPSE_CLASS}`);
        let colGroup = [].slice.call(this.parent.element.querySelectorAll(colSelector));
        if (target.classList.contains(COLLAPSED_CLASS)) {
            removeClass(colGroup, COLLAPSED_CLASS);
            if (this.parent.isAdaptive) {
                colGroup.forEach((col) => col.style.width = formatUnit(this.parent.layoutModule.getWidth()));
            }
            classList(targetIcon, [COLUMN_EXPAND_CLASS], [COLUMN_COLLAPSE_CLASS]);
            for (let row of targetRow) {
                let targetCol = row.querySelector(`.${CONTENT_CELLS_CLASS}:nth-child(${colIndex + 1})`);
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
                colGroup.forEach((col) => col.style.width = formatUnit(toggleWidth));
            }
            classList(targetIcon, [COLUMN_COLLAPSE_CLASS], [COLUMN_EXPAND_CLASS]);
            let key = target.getAttribute('data-key');
            for (let row of targetRow) {
                let targetCol = row.querySelector(`.${CONTENT_CELLS_CLASS}[data-key="${key}"]`);
                let index = targetCol.cellIndex;
                let text = (this.parent.columns[index].showItemCount ? '[' +
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
                removeClass(cards, CARD_SELECTION_CLASS);
                this.parent.layoutModule.disableAttributeSelection(cards);
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
                    let elementSelector = `.${SWIMLANE_ROW_EXPAND_CLASS},.${SWIMLANE_ROW_COLLAPSE_CLASS}`;
                    let parentEle = this.lastSelectionRow.previousElementSibling.querySelector(elementSelector);
                    if (parentEle && parentEle.classList.contains(SWIMLANE_ROW_COLLAPSE_CLASS)) {
                        this.rowExpandCollapse(parentEle);
                    }
                }
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
 * Kanban CRUD module
 * @hidden
 */
class Crud {
    /**
     * Constructor for CRUD module
     * @private
     */
    constructor(parent) {
        this.parent = parent;
    }
    addCard(cardData) {
        let args = {
            cancel: false, requestType: 'cardCreate', addedRecords: (cardData instanceof Array) ? cardData : [cardData],
            changedRecords: [], deletedRecords: []
        };
        this.parent.trigger(actionBegin, args, (addArgs) => {
            if (!addArgs.cancel) {
                let modifiedData = [];
                if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    modifiedData = this.priorityOrder(modifiedData, addArgs);
                }
                let addedRecords = (cardData instanceof Array) ? cardData : [cardData];
                let changedRecords = (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') ? modifiedData : [];
                let editParms = { addedRecords: addedRecords, changedRecords: changedRecords, deletedRecords: [] };
                let type = (cardData instanceof Array || modifiedData.length > 0) ? 'batch' : 'insert';
                this.parent.dataModule.updateDataManager(type, editParms, 'cardCreated', cardData);
            }
        });
    }
    updateCard(cardData, index) {
        let args = {
            requestType: 'cardChange', cancel: false, addedRecords: [],
            changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
        };
        this.parent.trigger(actionBegin, args, (updateArgs) => {
            if (!updateArgs.cancel) {
                if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                    let modifiedData = [];
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    cardData = this.priorityOrder(modifiedData, updateArgs, index);
                }
                let editParms = {
                    addedRecords: [], changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
                };
                let type = (cardData instanceof Array) ? 'batch' : 'update';
                this.parent.dataModule.updateDataManager(type, editParms, 'cardChanged', cardData, index);
            }
        });
    }
    deleteCard(cardData) {
        let editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        if (typeof cardData === 'string' || typeof cardData === 'number') {
            editParms.deletedRecords = this.parent.kanbanData.filter((data) => data[this.parent.cardSettings.headerField] === cardData);
        }
        else {
            editParms.deletedRecords = (cardData instanceof Array) ? cardData : [cardData];
        }
        let args = {
            requestType: 'cardRemove', cancel: false, addedRecords: [], changedRecords: [], deletedRecords: editParms.deletedRecords
        };
        this.parent.trigger(actionBegin, args, (deleteArgs) => {
            if (!deleteArgs.cancel) {
                let type = (editParms.deletedRecords.length > 1) ? 'batch' : 'delete';
                let cardData = editParms.deletedRecords;
                this.parent.dataModule.updateDataManager(type, editParms, 'cardRemoved', cardData[0]);
            }
        });
    }
    priorityOrder(cardData, args, index) {
        let cardsId = cardData.map((obj) => obj[this.parent.cardSettings.headerField]);
        let num = cardData[cardData.length - 1][this.parent.sortSettings.field];
        let allModifiedKeys = cardData.map((obj) => obj[this.parent.keyField]);
        let modifiedKey = allModifiedKeys.filter((key, index) => allModifiedKeys.indexOf(key) === index).sort();
        let columnAllDatas;
        let finalData = [];
        for (let columnKey of modifiedKey) {
            let keyData = cardData.filter((cardObj) => cardObj[this.parent.keyField] === columnKey);
            columnAllDatas = this.parent.layoutModule.getColumnData(columnKey);
            for (let data of keyData) {
                if (this.parent.swimlaneSettings.keyField) {
                    let swimlaneDatas = this.parent.getSwimlaneData(data[this.parent.swimlaneSettings.keyField]);
                    columnAllDatas = this.parent.getColumnData(columnKey, swimlaneDatas);
                }
            }
            keyData.forEach((key) => finalData.push(key));
            if (!isNullOrUndefined(index)) {
                if (this.parent.sortSettings.direction === 'Ascending') {
                    for (let i = index; i < columnAllDatas.length; i++) {
                        if (cardsId.indexOf(columnAllDatas[i][this.parent.cardSettings.headerField]) === -1) {
                            columnAllDatas[i][this.parent.sortSettings.field] = ++num;
                            finalData.push(columnAllDatas[i]);
                        }
                    }
                }
                else {
                    for (let i = index - 1; i >= 0; i--) {
                        if (cardsId.indexOf(columnAllDatas[i][this.parent.cardSettings.headerField]) === -1) {
                            columnAllDatas[i][this.parent.sortSettings.field] = ++num;
                            finalData.push(columnAllDatas[i]);
                        }
                    }
                }
            }
        }
        return finalData;
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
            element: null, cloneElement: null, instance: null, targetClone: null, draggedClone: null, targetCloneMulti: null,
            selectedCards: [], pageX: 0, pageY: 0, navigationInterval: null, cardDetails: [], modifiedData: []
        };
        this.dragEdges = { left: false, right: false, top: false, bottom: false };
        this.isDragging = false;
    }
    wireDragEvents(element) {
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
    }
    dragHelper(e) {
        if (this.parent.isAdaptive && this.parent.touchModule.mobilePopup &&
            this.parent.touchModule.mobilePopup.element.classList.contains(POPUP_OPEN_CLASS)) {
            this.parent.touchModule.mobilePopup.hide();
        }
        this.dragObj.element = closest(e.sender.target, '.' + CARD_CLASS);
        if (isNullOrUndefined(this.dragObj.element)) {
            return null;
        }
        this.dragObj.element.style.width = formatUnit(this.dragObj.element.offsetWidth);
        let cloneWrapper = createElement('div', { innerHTML: this.dragObj.element.outerHTML });
        this.dragObj.cloneElement = cloneWrapper.children.item(0);
        addClass([this.dragObj.cloneElement], CLONED_CARD_CLASS);
        this.dragObj.element.parentElement.appendChild(this.dragObj.cloneElement);
        this.dragObj.targetCloneMulti = createElement('div', { className: TARGET_MULTI_CLONE_CLASS });
        this.dragObj.targetClone = createElement('div', {
            className: DROPPED_CLONE_CLASS,
            styles: 'width:100%;height:' + formatUnit(this.dragObj.element.offsetHeight)
        });
        this.dragObj.modifiedData = [];
        return this.dragObj.cloneElement;
    }
    dragStart(e) {
        this.dragObj.selectedCards = this.dragObj.element;
        if (this.dragObj.element.classList.contains(CARD_SELECTION_CLASS)) {
            let className = '.' + CARD_CLASS + '.' + CARD_SELECTION_CLASS + ':not(.' + CLONED_CARD_CLASS + ')';
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
                this.dragObj.instance.intDestroy(e);
                this.dragObj.element = null;
                this.dragObj.targetClone = null;
                this.dragObj.draggedClone = null;
                this.dragObj.cloneElement = null;
                this.dragObj.targetCloneMulti = null;
                return;
            }
            if (this.dragObj.element.classList.contains(CARD_SELECTION_CLASS)) {
                this.dragObj.selectedCards.forEach((element) => { this.draggedClone(element); });
                if (this.dragObj.selectedCards.length > 1) {
                    this.dragObj.cloneElement.innerHTML = '';
                    let drag$$1 = createElement('div', {
                        className: 'e-multi-card-text',
                        innerHTML: this.dragObj.selectedCards.length + ' Cards',
                    });
                    this.dragObj.cloneElement.appendChild(drag$$1);
                    classList(this.dragObj.cloneElement, ['e-multi-card-clone'], [CARD_SELECTION_CLASS]);
                    this.parent.layoutModule.disableAttributeSelection(this.dragObj.cloneElement);
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
            className: DRAGGED_CLONE_CLASS,
            styles: 'width:' + formatUnit(element.offsetWidth - 1) + ';height:' + formatUnit(element.offsetHeight)
        });
        element.insertAdjacentElement('afterend', this.dragObj.draggedClone);
        addClass([element], DRAGGED_CARD_CLASS);
    }
    drag(e) {
        if (!e.target) {
            return;
        }
        let cardElement = closest(e.target, '.' + CARD_CLASS);
        let target = cardElement || e.target;
        let selector = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ') .' + CONTENT_CELLS_CLASS
            + '.' + DROPPABLE_CLASS;
        let contentCell = closest(target, selector);
        this.calculateArgs(e);
        if (contentCell) {
            let targetKey = this.getColumnKey(contentCell);
            let keys = targetKey.split(',');
            this.multiCloneRemove();
            let isDrag = (targetKey === this.getColumnKey(closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS)))
                ? true : false;
            if (keys.length === 1 || isDrag) {
                if (target.classList.contains(DRAGGED_CLONE_CLASS)) {
                    this.removeElement(this.dragObj.targetClone);
                }
                if (target.classList.contains(CARD_CLASS)) {
                    let element = target.classList.contains(DRAGGED_CLONE_CLASS) ?
                        (target.previousElementSibling.classList.contains(DRAGGED_CARD_CLASS) ? null : target.previousElementSibling)
                        : target.previousElementSibling;
                    let insertClone = 'afterend';
                    if (isNullOrUndefined(element)) {
                        let pageY = target.classList.contains(DRAGGED_CLONE_CLASS) ? (this.dragObj.pageY / 2) :
                            this.dragObj.pageY;
                        let height = target.classList.contains(DRAGGED_CLONE_CLASS) ? target.offsetHeight :
                            (target.offsetHeight / 2);
                        if ((pageY - (this.parent.element.getBoundingClientRect().top + target.offsetTop)) < height) {
                            insertClone = 'beforebegin';
                        }
                    }
                    target.insertAdjacentElement(insertClone, this.dragObj.targetClone);
                }
                else if (target.classList.contains(CONTENT_CELLS_CLASS) && !closest(target, '.' + SWIMLANE_ROW_CLASS)) {
                    if (target.querySelectorAll('.' + DRAGGED_CARD_CLASS).length !== 0 &&
                        target.querySelectorAll('.' + CARD_CLASS + ':not(.e-kanban-dragged-card):not(.e-cloned-card)').length === 0) {
                        return;
                    }
                    else {
                        target.querySelector('.' + CARD_WRAPPER_CLASS).appendChild(this.dragObj.targetClone);
                    }
                }
                else if (target.classList.contains(CARD_WRAPPER_CLASS) && !closest(target, '.' + SWIMLANE_ROW_CLASS)
                    && contentCell.querySelectorAll('.' + CARD_CLASS).length === 0) {
                    target.appendChild(this.dragObj.targetClone);
                }
            }
            else if (keys.length > 1 && contentCell.classList.contains(DROPPING_CLASS)) {
                this.multiCloneCreate(keys, contentCell);
            }
            this.parent.notify(contentReady, {});
        }
        if (this.parent.element.querySelectorAll('.' + DROPPING_CLASS).length === 0) {
            this.cellDropping();
        }
        let isCollapsed = false;
        if (contentCell) {
            isCollapsed = contentCell.classList.contains(COLLAPSED_CLASS) && contentCell.classList.contains(DROPPING_CLASS);
        }
        if (isCollapsed) {
            this.toggleVisible(target, undefined);
            addClass([contentCell], TOGGLE_VISIBLE_CLASS);
        }
        let tColumn = [].slice.call(this.parent.element.querySelectorAll('.' + TOGGLE_VISIBLE_CLASS));
        if (tColumn.length > 0 && !target.classList.contains(TOGGLE_VISIBLE_CLASS)
            && !closest(target, '.' + TOGGLE_VISIBLE_CLASS)) {
            this.toggleVisible(target, tColumn.slice(-1)[0]);
            removeClass(tColumn, TOGGLE_VISIBLE_CLASS);
        }
        this.parent.notify(contentReady, {});
        let multiKeyTarget = closest(target, '.' + MULTI_COLUMN_KEY_CLASS);
        if (multiKeyTarget) {
            let columnKeys = [].slice.call(this.parent.element.querySelectorAll('.' + MULTI_COLUMN_KEY_CLASS + ':not(.' +
                DISABLED_CLASS + ')')).filter((element) => this.getColumnKey(element) === this.getColumnKey(multiKeyTarget));
            if (columnKeys.length > 0) {
                addClass(columnKeys, MULTI_ACTIVE_CLASS);
                if (columnKeys[0].previousElementSibling) {
                    addClass([columnKeys[0].previousElementSibling], 'e-multi-bottom-border');
                }
            }
        }
        document.body.style.cursor = (contentCell && contentCell.classList.contains(DROPPING_CLASS)) ? '' : 'not-allowed';
        if (cardElement && !(closest(cardElement, '.' + CONTENT_CELLS_CLASS)).classList.contains(DROPPING_CLASS)) {
            cardElement.style.cursor = 'not-allowed';
            document.body.style.cursor = 'not-allowed';
        }
        if (document.body.style.cursor === 'not-allowed') {
            this.removeElement(this.dragObj.targetClone);
            this.multiCloneRemove();
        }
        this.updateScrollPosition(e);
        let dragArgs = { data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(drag, dragArgs);
    }
    removeElement(element) {
        if (this.parent.element.getElementsByClassName(element.className).length > 0) {
            remove(element);
        }
    }
    multiCloneCreate(keys, contentCell) {
        let offsetHeight = contentCell.offsetHeight;
        let limitEle = contentCell.querySelector('.' + LIMITS_CLASS);
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
        for (let key of keys) {
            let dragCell = closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS);
            let transition = this.parent.columns[dragCell.cellIndex].transitionColumns;
            let allowTransition = this.allowedTransition(this.dragObj.element.getAttribute('data-key'), key, transition);
            let name = allowTransition ? '' : ' ' + DISABLED_CLASS;
            let colKey = createElement('div', {
                className: MULTI_COLUMN_KEY_CLASS + name,
                attrs: { 'data-key': key.trim() }
            });
            let text = createElement('div', { className: 'e-text', innerHTML: key.trim() });
            contentCell.appendChild(this.dragObj.targetCloneMulti).appendChild(colKey).appendChild(text);
            colKey.style.cursor = allowTransition ? '' : 'not-allowed';
            colKey.style.lineHeight = colKey.style.height = formatUnit((offsetHeight / keys.length));
            text.style.top = formatUnit((offsetHeight / 2) - (text.offsetHeight / 2));
        }
    }
    allowedTransition(currentCardKey, targetCardKey, allowedKey) {
        let allowTransition = true;
        let targetKey = targetCardKey.split(',');
        for (let i = 0; i < targetKey.length; i++) {
            if (currentCardKey === targetKey[i].trim()) {
                return true;
            }
            if (allowedKey) {
                if (allowedKey.length === 1 && allowedKey[0].length === 0) {
                    return true;
                }
                for (let j = 0; j < allowedKey.length; j++) {
                    if (targetKey[i].trim() === allowedKey[j].trim()) {
                        return true;
                    }
                    else {
                        allowTransition = false;
                    }
                }
            }
        }
        return allowTransition;
    }
    cellDropping() {
        let dragCell = closest(this.dragObj.draggedClone, '.' + CONTENT_CELLS_CLASS);
        let dragRow = closest(this.dragObj.draggedClone, '.' + CONTENT_ROW_CLASS);
        this.addDropping(dragRow, dragCell);
        if (dragCell && dragCell.classList.contains(DROP_CLASS)) {
            addClass([dragCell], DROPPING_CLASS);
        }
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            let className = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + '):not(.' + COLLAPSED_CLASS + ')';
            let rows = [].slice.call(this.parent.element.querySelectorAll(className));
            [].slice.call(rows).forEach((row) => {
                if (dragRow !== row) {
                    this.addDropping(row, dragCell);
                }
            });
        }
    }
    addDropping(dragRow, dragCell) {
        if (dragCell && dragRow) {
            [].slice.call(dragRow.children).forEach((cell) => {
                let transition = this.parent.columns[dragCell.cellIndex].transitionColumns;
                if (cell !== dragCell && cell.classList.contains(DROP_CLASS) &&
                    this.allowedTransition(dragCell.getAttribute('data-key'), cell.getAttribute('data-key'), transition)) {
                    addClass([cell], DROPPING_CLASS);
                }
            });
        }
    }
    dragStop(e) {
        let contentCell = closest(this.dragObj.targetClone, '.' + CONTENT_CELLS_CLASS);
        let columnKey;
        let dropIndex;
        if (this.dragObj.targetClone.parentElement) {
            let className = '.' + CARD_CLASS + ':not(.' + DRAGGED_CARD_CLASS + '),.' + DROPPED_CLONE_CLASS;
            let element = [].slice.call(this.dragObj.targetClone.parentElement.querySelectorAll(className));
            dropIndex = element.indexOf(this.dragObj.targetClone);
        }
        if (this.parent.element.querySelector('.' + TARGET_MULTI_CLONE_CLASS)) {
            columnKey = closest(e.target, '.' + MULTI_COLUMN_KEY_CLASS + ':not(.' + DISABLED_CLASS + ')');
        }
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
                this.dragObj.selectedCards.forEach((element) => { this.updateDroppedData(element, cardStatus, contentCell); });
            }
            if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                this.changeOrder(this.dragObj.modifiedData);
            }
        }
        let dragArgs = {
            cancel: false, data: this.dragObj.modifiedData, event: e, element: this.dragObj.selectedCards,
            dropIndex: dropIndex
        };
        this.parent.trigger(dragStop, dragArgs, (dragEventArgs) => {
            this.removeElement(this.dragObj.draggedClone);
            this.removeElement(this.dragObj.targetClone);
            this.removeElement(this.dragObj.cloneElement);
            let dragMultiClone = [].slice.call(this.parent.element.querySelectorAll('.' + DRAGGED_CLONE_CLASS));
            dragMultiClone.forEach((clone) => { remove(clone); });
            this.dragObj.element.style.removeProperty('width');
            this.multiCloneRemove();
            removeClass([this.dragObj.element], DRAGGED_CARD_CLASS);
            clearInterval(this.dragObj.navigationInterval);
            this.dragObj.navigationInterval = null;
            if (document.body.style.cursor === 'not-allowed') {
                document.body.style.cursor = '';
            }
            let styleCards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_CLASS + '[style]'));
            styleCards.forEach((styleCard) => { styleCard.style.cursor = ''; });
            let className = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ')';
            let cells = [].slice.call(this.parent.element.querySelectorAll(className + ' .' + CONTENT_CELLS_CLASS));
            cells.forEach((cell) => removeClass([cell], DROPPING_CLASS));
            if (!dragEventArgs.cancel) {
                if (contentCell || columnKey) {
                    let updateCard = dragEventArgs.data instanceof Array &&
                        dragEventArgs.data.length > 1 ? dragEventArgs.data :
                        dragEventArgs.data[0];
                    this.parent.crudModule.updateCard(updateCard, dragEventArgs.dropIndex);
                }
            }
            if (this.parent.isAdaptive) {
                this.parent.touchModule.tabHold = false;
            }
            this.dragObj.cardDetails = this.dragObj.modifiedData = [];
            this.isDragging = false;
        });
    }
    updateDroppedData(element, cardStatus, contentCell) {
        let crudObj = this.parent.getCardDetails(element);
        let crudData = extend({}, crudObj, null, true);
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
        this.dragObj.modifiedData.push(crudData);
    }
    changeOrder(modifieddata) {
        let prevele = false;
        let element = this.parent.sortSettings.direction === 'Ascending' ?
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
        if (element.classList.contains(CARD_CLASS)) {
            let obj = this.parent.getCardDetails(element);
            let keyIndex = obj[this.parent.sortSettings.field];
            if (modifieddata.length > 1 && this.parent.sortSettings.direction === 'Descending') {
                modifieddata = modifieddata.reverse();
            }
            modifieddata.forEach((data, index) => {
                if (prevele) {
                    data[this.parent.sortSettings.field] = ++keyIndex;
                }
                else if (keyIndex !== 1 && index <= data[this.parent.sortSettings.field]) {
                    data[this.parent.sortSettings.field] = --keyIndex;
                }
                else if (keyIndex === 1) {
                    data[this.parent.sortSettings.field] = index + 1;
                }
            });
        }
    }
    toggleVisible(target, tColumn) {
        let headerCells = '.' + HEADER_CELLS_CLASS + ':not(.' + STACKED_HEADER_CELL_CLASS + ')';
        let lists = [].slice.call(this.parent.element.querySelectorAll(headerCells));
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
        let cloneMulti = [].slice.call(this.parent.element.querySelectorAll('.' + TARGET_MULTI_CLONE_CLASS));
        if (cloneMulti.length > 0) {
            let columnKey = [].slice.call(this.parent.element.querySelectorAll('.' + MULTI_COLUMN_KEY_CLASS));
            columnKey.forEach((node) => remove(node));
            cloneMulti.forEach((node) => {
                let cell = closest(node, '.' + CONTENT_CELLS_CLASS);
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
    }
    calculateArgs(e) {
        let eventArgs = this.getPageCoordinates(e);
        this.dragObj.pageY = eventArgs.pageY;
        this.dragObj.pageX = eventArgs.pageX;
        this.isDragging = true;
        if (this.parent.isAdaptive && this.parent.tooltipModule) {
            this.parent.tooltipModule.tooltipObj.close();
        }
    }
    getPageCoordinates(e) {
        let eventArgs = e.event;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            eventArgs || e;
    }
    getColumnKey(target) {
        if (target && target.getAttribute('data-key')) {
            return target.getAttribute('data-key').trim();
        }
        return '';
    }
    updateScrollPosition(e) {
        if (isNullOrUndefined(this.dragObj.navigationInterval)) {
            this.dragObj.navigationInterval = window.setInterval(() => { this.autoScroll(); }, 100);
        }
    }
    autoScrollValidation() {
        let pageY = this.dragObj.pageY;
        let pageX = this.dragObj.pageX;
        let autoScrollDistance = 30;
        let dragEdges = { left: false, right: false, top: false, bottom: false };
        let viewBoundaries = this.parent.element.querySelector('.' + CONTENT_CLASS).getBoundingClientRect();
        if ((pageY < viewBoundaries.top + autoScrollDistance + window.pageYOffset) &&
            (pageY > viewBoundaries.top + window.pageYOffset)) {
            dragEdges.top = true;
        }
        if ((pageY > (viewBoundaries.bottom - autoScrollDistance) + window.pageYOffset) &&
            (pageY < viewBoundaries.bottom + window.pageYOffset)) {
            dragEdges.bottom = true;
        }
        if ((pageX < viewBoundaries.left + autoScrollDistance + window.pageXOffset) &&
            (pageX > viewBoundaries.left + window.pageXOffset)) {
            dragEdges.left = true;
        }
        if ((pageX > (viewBoundaries.right - autoScrollDistance) + window.pageXOffset) &&
            (pageX < viewBoundaries.right + window.pageXOffset)) {
            dragEdges.right = true;
        }
        this.dragEdges = dragEdges;
    }
    autoScroll() {
        this.autoScrollValidation();
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
            let parent = this.parent.element.querySelector('.' + CONTENT_CLASS);
            let column = this.dragObj.targetClone.parentElement;
            let yScrollable = parent.offsetHeight <= parent.scrollHeight;
            let xScrollable = parent.offsetWidth <= parent.scrollWidth;
            let yBounds = yScrollable && parent.scrollTop >= 0 && parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
            let xBounds = xScrollable && parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
            if (yBounds && (this.dragEdges.top || this.dragEdges.bottom)) {
                parent.scrollTop += this.dragEdges.top ? -scrollSensitivity : scrollSensitivity;
                if (column) {
                    column.scrollTop += this.dragEdges.top ? -scrollSensitivity : scrollSensitivity;
                }
            }
            if (xBounds && (this.dragEdges.left || this.dragEdges.right)) {
                parent.scrollLeft += this.dragEdges.left ? -scrollSensitivity : scrollSensitivity;
                if (column) {
                    column.scrollLeft += this.dragEdges.left ? -scrollSensitivity : scrollSensitivity;
                }
            }
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
 * Dialog module is used to perform card actions.
 * @hidden
 */
class KanbanDialog {
    /**
     * Constructor for dialog module
     * @private
     */
    constructor(parent) {
        this.parent = parent;
    }
    openDialog(action, data) {
        this.action = action;
        this.parent.activeCardData.data = data;
        this.renderDialog(data, action);
        this.dialogObj.show();
    }
    closeDialog() {
        this.dialogObj.hide();
    }
    renderDialog(args, action) {
        this.element = createElement('div', { id: this.parent.element.id + '_dialog_wrapper' });
        this.parent.element.appendChild(this.element);
        let dialogModel = {
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
    }
    getDialogContent(args, action) {
        if (action === 'Delete') {
            return this.parent.localeObj.getConstant('deleteContent');
        }
        else {
            let container = createElement('div', { className: FORM_WRAPPER_CLASS });
            let form = createElement('form', {
                id: this.parent.element.id + 'EditForm',
                className: FORM_CLASS, attrs: { onsubmit: 'return false;' }
            });
            if (this.parent.dialogSettings.template) {
                if (args) {
                    this.destroyComponents();
                    [].slice.call(form.childNodes).forEach((node) => remove(node));
                }
                let templateId = this.parent.element.id + '_dialogTemplate';
                let dialogTemplate = this.parent.templateParser(this.parent.dialogSettings.template)(args, this.parent, 'template', templateId, false);
                append(dialogTemplate, form);
                this.parent.renderTemplates();
            }
            else {
                let dialogWrapper = createElement('div', { className: DIALOG_CONTENT_CONTAINER });
                form.appendChild(dialogWrapper);
                let table = createElement('table');
                dialogWrapper.appendChild(table);
                let dialogFields = this.getDialogFields();
                for (let field of dialogFields) {
                    let tr = createElement('tr');
                    table.appendChild(tr);
                    tr.appendChild(createElement('td', { className: 'e-label', innerHTML: field.text ? field.text : field.key }));
                    let td = createElement('td');
                    tr.appendChild(td);
                    td.appendChild(this.renderComponents(field));
                }
            }
            container.appendChild(form);
            return container;
        }
    }
    getDialogFields() {
        let fields = this.parent.dialogSettings.fields;
        if (fields.length === 0) {
            fields = [
                { text: 'ID', key: this.parent.cardSettings.headerField, type: 'TextBox' },
                { key: this.parent.keyField, type: 'DropDown' },
                { key: this.parent.cardSettings.contentField, type: 'TextArea' }
            ];
            if (this.parent.sortSettings.field) {
                fields.splice(fields.length - 1, 0, { key: this.parent.sortSettings.field, type: 'TextBox' });
            }
            if (this.parent.swimlaneSettings.keyField) {
                fields.splice(fields.length - 1, 0, { key: this.parent.swimlaneSettings.keyField, type: 'DropDown' });
            }
        }
        return fields;
    }
    getDialogButtons(action) {
        let primaryButtonClass = action === 'Delete' ? 'e-dialog-yes' : action === 'Add' ? 'e-dialog-add' : 'e-dialog-edit';
        let flatButtonClass = action === 'Delete' ? 'e-dialog-no' : 'e-dialog-cancel';
        let dialogButtons = [
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
            let deleteButton = {
                buttonModel: { cssClass: 'e-flat e-dialog-delete', isPrimary: false, content: this.parent.localeObj.getConstant('delete') },
                click: this.dialogButtonClick.bind(this)
            };
            dialogButtons.splice(0, 0, deleteButton);
        }
        return dialogButtons;
    }
    renderComponents(field) {
        let wrapper = createElement('div', { className: field.key + '_wrapper' });
        let element = createElement('input', { className: FIELD_CLASS, attrs: { 'name': field.key } });
        wrapper.appendChild(element);
        let controlObj;
        let fieldValue = this.parent.activeCardData.data ?
            this.parent.activeCardData.data[field.key] : null;
        switch (field.type) {
            case 'DropDown':
                let dropDownOptions;
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
                let divElement = createElement('div');
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
    }
    onBeforeDialogOpen(args) {
        let eventProp = {
            data: this.parent.activeCardData.data,
            cancel: false, element: this.element,
            target: this.parent.activeCardData.element,
            requestType: this.action
        };
        this.storeElement = document.activeElement;
        if (parseInt(args.maxHeight, 10) <= 250) {
            args.maxHeight = '250px';
        }
        this.parent.trigger(dialogOpen, eventProp, (openArgs) => args.cancel = openArgs.cancel);
    }
    onBeforeDialogClose(args) {
        let formInputs = this.getFormElements();
        let cardObj = {};
        for (let input of formInputs) {
            let columnName = input.name || this.getColumnName(input);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                let value = this.getValueFromElement(input);
                if (columnName === this.parent.cardSettings.headerField) {
                    value = this.getIDType() === 'string' ? value : parseInt(value, 10);
                }
                cardObj[columnName] = value;
            }
        }
        cardObj = extend(this.parent.activeCardData.data, cardObj);
        let eventProp = { data: cardObj, cancel: false, element: this.element, requestType: this.action };
        this.parent.trigger(dialogClose, eventProp, (closeArgs) => {
            args.cancel = closeArgs.cancel;
            if (!closeArgs.cancel) {
                this.cardData = eventProp.data;
                this.destroy();
            }
        });
    }
    getIDType() {
        if (this.parent.kanbanData.length !== 0) {
            return typeof (this.parent.kanbanData[0][this.parent.cardSettings.headerField]);
        }
        return 'string';
    }
    applyFormValidation() {
        let form = this.element.querySelector('.' + FORM_CLASS);
        let rules = {};
        for (let field of this.parent.dialogSettings.fields) {
            rules[field.key] = (field.validationRules && Object.keys(field.validationRules).length > 0) ? field.validationRules : null;
        }
        this.formObj = new FormValidator(form, {
            rules: rules,
            customPlacement: (inputElement, error) => {
                let id = error.getAttribute('for');
                let elem = this.element.querySelector('#' + id + '_Error');
                if (!elem) {
                    this.createTooltip(inputElement, error, id, '');
                }
            },
            validationComplete: (args) => {
                let elem = this.element.querySelector('#' + args.inputName + '_Error');
                if (elem) {
                    elem.style.display = (args.status === 'failure') ? '' : 'none';
                }
            }
        });
    }
    createTooltip(element, error, name, display) {
        let dlgContent;
        let client;
        let inputClient = element.parentElement.getBoundingClientRect();
        if (this.element.classList.contains(DIALOG_CLASS)) {
            dlgContent = this.element;
            client = this.element.getBoundingClientRect();
        }
        else {
            dlgContent = this.element.querySelector('.e-kanban-dialog .e-dlg-content');
            client = dlgContent.getBoundingClientRect();
        }
        let div = createElement('div', {
            className: 'e-tooltip-wrap e-popup ' + ERROR_VALIDATION_CLASS,
            id: name + '_Error',
            styles: 'display:' + display + ';top:' +
                (inputClient.bottom - client.top + dlgContent.scrollTop + 9) + 'px;left:' +
                (inputClient.left - client.left + dlgContent.scrollLeft + inputClient.width / 2) + 'px;'
        });
        let content = createElement('div', { className: 'e-tip-content' });
        content.appendChild(error);
        let arrow = createElement('div', { className: 'e-arrow-tip e-tip-top' });
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-outer e-tip-top' }));
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-inner e-tip-top' }));
        div.appendChild(content);
        div.appendChild(arrow);
        dlgContent.appendChild(div);
        div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
    }
    destroyToolTip() {
        if (this.element) {
            this.element.querySelectorAll('.' + ERROR_VALIDATION_CLASS).forEach((node) => remove(node));
        }
        if (this.formObj && this.formObj.element) {
            this.formObj.reset();
        }
    }
    dialogButtonClick(event) {
        let target = event.target.cloneNode(true);
        let id = this.formObj.element.id;
        if (document.getElementById(id) && this.formObj.validate() &&
            (target.classList.contains('e-dialog-edit') || target.classList.contains('e-dialog-add'))) {
            this.dialogObj.hide();
            if (target.classList.contains('e-dialog-edit')) {
                let activeCard = this.parent.activeCardData;
                let updateIndex;
                if (activeCard.data[this.parent.keyField] === this.cardData[this.parent.keyField]
                    && activeCard.element) {
                    updateIndex = [].slice.call(activeCard.element.parentElement.children).indexOf(activeCard.element);
                }
                this.parent.crudModule.updateCard(this.cardData, updateIndex);
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
    }
    getFormElements() {
        let elements = [].slice.call(this.element.querySelectorAll('.' + FIELD_CLASS));
        let validElements = [];
        for (let element of elements) {
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
    }
    getColumnName(element) {
        let attrName = element.getAttribute('data-name') || '';
        if (attrName === '') {
            let isDropDowns = false;
            let fieldSelector = '';
            if (element.classList.contains('e-dropdownlist') || element.classList.contains('e-multiselect')) {
                fieldSelector = element.classList.contains('e-dropdownlist') ? 'e-ddl' : 'e-multiselect';
                isDropDowns = true;
            }
            else if (element.classList.contains('e-numerictextbox')) {
                fieldSelector = 'e-numeric';
            }
            let classSelector = isDropDowns ? `.${fieldSelector}:not(.e-control)` : `.${fieldSelector}`;
            let control = closest(element, classSelector) || element.querySelector(`.${fieldSelector}`);
            if (control) {
                let attrEle = control.querySelector('[name]');
                if (attrEle) {
                    attrName = attrEle.name;
                }
            }
        }
        return attrName;
    }
    getValueFromElement(element) {
        let value;
        let instance = element.ej2_instances;
        if (instance && instance.length > 0) {
            value = instance[0].value ||
                instance[0].checked;
        }
        else {
            value = element.value;
        }
        return value;
    }
    destroyComponents() {
        let formelement = this.getFormElements();
        for (let element of formelement) {
            let instance = element.ej2_instances;
            if (instance && instance.length > 0) {
                instance.forEach((node) => node.destroy());
            }
        }
    }
    destroy() {
        this.destroyToolTip();
        this.destroyComponents();
        if (this.dialogObj) {
            this.dialogObj.destroy();
            this.storeElement.focus();
            this.dialogObj = null;
            remove(this.element);
            this.element = null;
        }
    }
}

/**
 * Kanban keyboard module
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
    keyActionHandler(e) {
        let selectedCard = this.parent.element.querySelectorAll(`.${CARD_CLASS}.${CARD_SELECTION_CLASS}`).item(0);
        if (!selectedCard && !closest(document.activeElement, `.${ROOT_CLASS}`)) {
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
                        let ele = closest(document.activeElement, '.' + CONTENT_CELLS_CLASS);
                        let cards = [].slice.call(ele.querySelectorAll('.' + CARD_CLASS));
                        removeClass(cards, CARD_SELECTION_CLASS);
                        ele.focus();
                        this.cardTabIndexRemove();
                        this.addRemoveTabIndex('Add');
                    }
                }
                break;
            case 'tab':
            case 'shiftTab':
                let contentCell = closest(document.activeElement, '.' + CONTENT_CELLS_CLASS);
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
                let className = '.' + CARD_CLASS + '.' + CARD_SELECTION_CLASS;
                let selectedCards = [].slice.call(this.parent.element.querySelectorAll(className));
                let selectedCardsData = [];
                selectedCards.forEach((selected) => {
                    selectedCardsData.push(this.parent.getCardDetails(selected));
                });
                this.parent.crudModule.deleteCard(selectedCardsData);
                break;
        }
    }
    processCardSelection(action, selectedCard) {
        if (selectedCard) {
            removeClass([selectedCard], CARD_SELECTION_CLASS);
            this.parent.layoutModule.disableAttributeSelection(selectedCard);
            let selection = this.parent.actionModule.selectionArray;
            selection.splice(selection.indexOf(selectedCard.getAttribute('data-id')), 1);
        }
        this.cardTabIndexRemove();
        let cards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_CLASS));
        let element = action === 'firstCardSelection' ? cards[0] : cards[cards.length - 1];
        this.parent.actionModule.cardSelection(element, false, false);
        this.addRemoveTabIndex('Remove');
        element.focus();
        let card = [].slice.call(closest(element, '.' + CONTENT_CELLS_CLASS).querySelectorAll('.' + CARD_CLASS));
        card.forEach((element) => { element.setAttribute('tabindex', '0'); });
    }
    processLeftRightArrow(e) {
        if (document.activeElement.classList.contains(CONTENT_CELLS_CLASS)) {
            if (e.action === 'rightArrow' && document.activeElement.nextElementSibling) {
                document.activeElement.nextElementSibling.focus();
            }
            else if (e.action === 'leftArrow' && document.activeElement.previousElementSibling) {
                document.activeElement.previousElementSibling.focus();
            }
        }
    }
    processUpDownArrow(action, selectedCard) {
        if (action === 'upArrow' && document.activeElement) {
            if (document.activeElement.classList.contains(CARD_CLASS) && document.activeElement.previousElementSibling) {
                document.activeElement.previousElementSibling.focus();
            }
            else if (document.activeElement.classList.contains(SHOW_ADD_BUTTON)) {
                document.activeElement.setAttribute('tabindex', '-1');
                removeClass([document.activeElement], SHOW_ADD_FOCUS);
                let cell = closest(document.activeElement, '.' + CONTENT_CELLS_CLASS);
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
                let ele = closest(document.activeElement, '.' + CARD_WRAPPER_CLASS).nextElementSibling;
                ele.setAttribute('tabindex', '0');
                addClass([ele], SHOW_ADD_FOCUS);
                ele.focus();
            }
            this.removeSelection();
        }
        if ((action === 'multiSelectionByUpArrow' || action === 'multiSelectionByDownArrow')
            && selectedCard && this.parent.cardSettings.selectionType === 'Multiple') {
            let card;
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
    }
    removeSelection() {
        if (this.multiSelection) {
            let cards = this.parent.getSelectedCards();
            if (cards.length > 0) {
                removeClass(cards, CARD_SELECTION_CLASS);
                this.parent.layoutModule.disableAttributeSelection(cards);
            }
            this.multiSelection = false;
        }
    }
    cardTabIndexRemove() {
        let cards = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_CLASS));
        cards.forEach((card) => { card.setAttribute('tabindex', '-1'); });
        let addButton = [].slice.call(this.parent.element.querySelectorAll('.' + SHOW_ADD_BUTTON));
        addButton.forEach((add) => {
            add.setAttribute('tabindex', '-1');
            removeClass([add], SHOW_ADD_FOCUS);
        });
    }
    processEnter(e, selectedCard) {
        let element = (e.target);
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
            let cards = [].slice.call(element.querySelectorAll('.' + CARD_CLASS));
            this.addRemoveTabIndex('Remove');
            if (cards.length > 0) {
                element.querySelector('.' + CARD_CLASS).focus();
                cards.forEach((element) => { element.setAttribute('tabindex', '0'); });
            }
            if (element.querySelector('.' + SHOW_ADD_BUTTON)) {
                element.querySelector('.' + SHOW_ADD_BUTTON).setAttribute('tabindex', '0');
                element.querySelector('.' + SHOW_ADD_BUTTON).focus();
            }
        }
        if (selectedCard === document.activeElement && this.parent.element.querySelectorAll('.' + CARD_SELECTION_CLASS).length === 1) {
            this.parent.activeCardData = {
                data: this.parent.getCardDetails(selectedCard), element: selectedCard
            };
            if (!this.parent.dialogModule.dialogObj) {
                this.parent.dialogModule.openDialog('Edit', this.parent.getCardDetails(selectedCard));
            }
            selectedCard.focus();
        }
    }
    addRemoveTabIndex(action) {
        let attribute = action === 'Add' ? '0' : '-1';
        let headerIcon = [].slice.call(this.parent.element.querySelectorAll('.' + HEADER_ICON_CLASS));
        if (headerIcon.length > 0) {
            headerIcon.forEach((element) => { element.setAttribute('tabindex', attribute); });
        }
        let swimlaneIcon = [].slice.call(this.parent.element.querySelectorAll('.' + SWIMLANE_ROW_EXPAND_CLASS));
        if (swimlaneIcon.length > 0) {
            swimlaneIcon.forEach((element) => { element.setAttribute('tabindex', attribute); });
        }
        let className = '.' + CONTENT_ROW_CLASS + ':not(.' + SWIMLANE_ROW_CLASS + ') .' + CONTENT_CELLS_CLASS;
        let contentCell = [].slice.call(this.parent.element.querySelectorAll(className));
        contentCell.forEach((element) => { element.setAttribute('tabindex', attribute); });
    }
    destroy() {
        this.keyboardModule.destroy();
    }
}

/**
 * Tooltip for Kanban board
 * @hidden
 */
class KanbanTooltip {
    /**
     * Constructor for tooltip module
     * @private
     */
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
            target: '.' + TOOLTIP_TEXT_CLASS,
            beforeRender: this.onBeforeRender.bind(this),
            beforeClose: this.onBeforeClose.bind(this)
        });
        this.tooltipObj.appendTo(this.parent.element);
        this.tooltipObj.isStringTemplate = true;
    }
    onBeforeRender(args) {
        if (this.parent.dragAndDropModule.isDragging) {
            args.cancel = true;
            return;
        }
        let tooltipContent;
        if (this.parent.tooltipTemplate) {
            tooltipContent = createElement('div');
            let target = closest(args.target, '.' + CARD_CLASS);
            let data = this.parent.getCardDetails(target);
            let templateId = this.parent.element.id + '_tooltipTemplate';
            let tooltipTemplate = this.parent.templateParser(this.parent.tooltipTemplate)(data, this.parent, 'tooltipTemplate', templateId, false);
            append(tooltipTemplate, tooltipContent);
            this.parent.renderTemplates();
        }
        else {
            tooltipContent = `<div class="e-card-header-caption">${args.target.innerText}</div>`;
        }
        this.tooltipObj.setProperties({ content: tooltipContent }, true);
    }
    onBeforeClose() {
        this.parent.resetTemplates(['tooltipTemplate']);
    }
    destroy() {
        this.tooltipObj.destroy();
        addClass([this.parent.element], 'e-control');
        this.tooltipObj = null;
    }
}

/**
 * Kanban touch module
 * @hidden
 */
class KanbanTouch {
    /**
     * Constructor for touch module
     * @private
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
        let target = closest(e.originalEvent.target, '.' + CARD_CLASS);
        if (target && this.parent.cardSettings.selectionType === 'Multiple') {
            this.parent.actionModule.cardSelection(target, true, false);
            if (!this.mobilePopup) {
                this.renderMobilePopup();
                this.mobilePopup.show();
            }
            this.updatePopupContent();
        }
    }
    renderMobilePopup() {
        if (this.parent.cardSettings.selectionType === 'Multiple') {
            let mobilePopupWrapper = createElement('div', {
                className: POPUP_WRAPPER_CLASS + ' e-popup-close',
                innerHTML: `<div class="${POPUP_HEADER_CLASS}"><button class="${CLOSE_CLASS}"></button></div>` +
                    `<div class="${POPUP_CONTENT_CLASS}"></div>`
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
            let closeIcon = this.mobilePopup.element.querySelector('.' + CLOSE_CLASS);
            let buttonObj = new Button({
                cssClass: 'e-flat e-round e-small',
                enableRtl: this.parent.enableRtl,
                iconCss: ICON_CLASS + ' ' + CLOSE_ICON_CLASS
            });
            buttonObj.appendTo(closeIcon);
            buttonObj.isStringTemplate = true;
            EventHandler.add(closeIcon, 'click', this.closeClick, this);
        }
    }
    getPopupContent() {
        let popupContent;
        let selectedCards = this.parent.getSelectedCards();
        if (selectedCards.length > 1) {
            popupContent = '(' + selectedCards.length + ') ' + this.parent.localeObj.getConstant('cardsSelected');
        }
        else if (selectedCards.length === 1) {
            popupContent = ' ' +
                this.parent.getCardDetails(selectedCards[0])[this.parent.cardSettings.headerField];
        }
        return popupContent;
    }
    updatePopupContent() {
        if (!this.mobilePopup) {
            return;
        }
        let popupContent = this.getPopupContent();
        if (popupContent) {
            this.mobilePopup.element.querySelector('.' + POPUP_CONTENT_CLASS).textContent = popupContent;
        }
        else {
            this.mobilePopup.hide();
        }
    }
    closeClick() {
        this.parent.touchModule.mobilePopup.hide();
    }
    popupClose() {
        this.popupDestroy();
    }
    popupDestroy() {
        if (this.mobilePopup && this.mobilePopup.element) {
            let instance = this.mobilePopup.element.querySelector('.e-control.e-btn').ej2_instances[0];
            if (instance) {
                instance.destroy();
            }
            this.mobilePopup.destroy();
            remove(this.mobilePopup.element);
            this.mobilePopup = null;
        }
    }
    unWireTouchEvents() {
        if (this.touchObj) {
            this.touchObj.destroy();
        }
        this.touchObj = null;
        this.element = null;
    }
    destroy() {
        this.popupDestroy();
        this.unWireTouchEvents();
        this.tabHold = false;
    }
}

/**
 * Kanban mobile layout rendering module
 * @hidden
 */
class MobileLayout {
    /**
     * Constructor for mobile layout module
     * @private
     */
    constructor(parent) {
        this.parent = parent;
    }
    renderSwimlaneHeader() {
        let toolbarWrapper = createElement('div', {
            className: SWIMLANE_HEADER_CLASS,
            innerHTML: '<div class="' + SWIMLANE_HEADER_TOOLBAR_CLASS + '"><div class="' + TOOLBAR_MENU_CLASS +
                '"><div class="e-icons ' + TOOLBAR_MENU_ICON_CLASS + '"></div></div><div class="' + TOOLBAR_LEVEL_TITLE_CLASS +
                '"><div class="' + TOOLBAR_SWIMLANE_NAME_CLASS + '"></div></div></div>'
        });
        this.parent.element.appendChild(toolbarWrapper);
        EventHandler.add(toolbarWrapper.querySelector('.' + TOOLBAR_MENU_ICON_CLASS), 'click', this.menuClick, this);
    }
    renderSwimlaneTree() {
        let height = this.parent.element.querySelector('.' + SWIMLANE_HEADER_CLASS).offsetHeight;
        let treeHeight = window.innerHeight - height;
        this.popupOverlay = createElement('div', { className: SWIMLANE_OVERLAY_CLASS, styles: 'height: ' + treeHeight + 'px;' });
        let wrapper = createElement('div', { className: SWIMLANE_CONTENT_CLASS, styles: 'top:' + height + 'px;' });
        let treeWrapper = createElement('div', {
            className: SWIMLANE_RESOURCE_CLASS + ' e-popup-close', styles: 'height: ' + treeHeight + 'px;'
        });
        wrapper.appendChild(treeWrapper);
        wrapper.appendChild(this.popupOverlay);
        this.parent.element.appendChild(wrapper);
        let swimlaneTree = createElement('div', { className: SWIMLANE_TREE_CLASS });
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
        let popupObj = {
            targetType: 'relative',
            actionOnScroll: 'none',
            enableRtl: this.parent.enableRtl,
            zIndex: 10,
            hideAnimation: { name: 'SlideLeftOut', duration: 500 },
            showAnimation: { name: 'SlideLeftIn', duration: 500 },
            viewPortElement: this.parent.element.querySelector('.' + CONTENT_CLASS)
        };
        popupObj.content = this.treeViewObj.element;
        this.treePopup = new Popup(treeWrapper, popupObj);
    }
    menuClick(event) {
        if (this.parent.element.querySelector('.' + SWIMLANE_RESOURCE_CLASS).classList.contains('e-popup-open')) {
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
    hidePopup() {
        this.treePopup.hide();
        removeClass([this.popupOverlay], 'e-enable');
    }
    getWidth() {
        return (window.innerWidth * 80) / 100;
    }
}

/**
 * Kanban layout rendering module
 * @hidden
 */
class LayoutRender extends MobileLayout {
    /**
     * Constructor for layout module
     * @private
     */
    constructor(parent) {
        super(parent);
        this.kanbanRows = [];
        this.parent = parent;
        this.columnKeys = [];
        this.swimlaneIndex = 0;
        this.swimlaneData = {};
        this.scrollLeft = 0;
        this.parent.on(dataReady, this.initRender, this);
        this.parent.on(contentReady, this.scrollUiUpdate, this);
    }
    initRender() {
        if (this.parent.columns.length === 0) {
            return;
        }
        this.columnData = this.getColumnCards();
        this.kanbanRows = this.getRows();
        this.swimlaneData = this.getSwimlaneCards();
        if (this.parent.isAdaptive) {
            let parent = this.parent.element.querySelector('.' + CONTENT_CLASS);
            if (parent) {
                this.scrollLeft = parent.scrollLeft;
            }
        }
        this.destroy();
        this.parent.on(dataReady, this.initRender, this);
        this.parent.on(contentReady, this.scrollUiUpdate, this);
        if (this.parent.isAdaptive && this.parent.swimlaneSettings.keyField && this.parent.kanbanData.length !== 0) {
            this.renderSwimlaneHeader();
        }
        let header = createElement('div', { className: HEADER_CLASS });
        this.parent.element.appendChild(header);
        this.renderHeader(header);
        this.renderContent();
        this.renderCards();
        this.renderValidation();
        this.parent.renderTemplates();
        this.parent.notify(contentReady, {});
        this.wireEvents();
        if (this.parent.isInitialRender) {
            this.parent.isInitialRender = false;
        }
    }
    renderHeader(header) {
        let headerWrap = createElement('div', { className: this.parent.swimlaneSettings.keyField ? SWIMLANE_CLASS : '' });
        header.appendChild(headerWrap);
        let headerTable = createElement('table', {
            className: TABLE_CLASS + ' ' + HEADER_TABLE_CLASS,
            attrs: { 'role': 'presentation' }
        });
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
                let noOfCard = this.columnData[column.keyField].length;
                let headerTitle = createElement('div', { className: HEADER_TITLE_CLASS });
                headerWrapper.appendChild(headerTitle);
                if (column.template) {
                    let templateArgs = {
                        keyField: column.keyField, headerText: column.headerText, minCount: column.minCount, maxCount: column.maxCount,
                        allowToggle: column.allowToggle, isExpanded: column.isExpanded, showItemCount: column.showItemCount, count: noOfCard
                    };
                    addClass([th], TEMPLATE_CLASS);
                    let templateId = this.parent.element.id + '_columnTemplate';
                    let templateHeader = this.parent.templateParser(column.template)(templateArgs, this.parent, 'template', templateId, false);
                    append(templateHeader, headerTitle);
                }
                else {
                    let header = createElement('div', { className: HEADER_TEXT_CLASS, innerHTML: column.headerText });
                    headerTitle.appendChild(header);
                    if (column.showItemCount) {
                        let itemCount = createElement('div', {
                            className: CARD_ITEM_COUNT_CLASS,
                            innerHTML: '- ' + noOfCard.toString() + ' ' + this.parent.localeObj.getConstant('items')
                        });
                        headerTitle.appendChild(itemCount);
                    }
                }
                if (column.allowToggle) {
                    let isExpand = (column.isExpanded && index === -1) ? true : false;
                    let name = (isExpand) ? COLUMN_EXPAND_CLASS : COLUMN_COLLAPSE_CLASS;
                    let icon = createElement('div', {
                        className: HEADER_ICON_CLASS + ' ' + ICON_CLASS + ' ' + name,
                        attrs: { 'tabindex': '0' }
                    });
                    icon.setAttribute('aria-label', isExpand ? column.keyField + ' Expand' : column.keyField + ' Collapse');
                    th.setAttribute('aria-expanded', isExpand.toString());
                    headerWrapper.appendChild(icon);
                }
                let dataObj = [{ keyField: column.keyField, textField: column.headerText, count: noOfCard }];
                let args = { data: dataObj, element: tr, cancel: false, requestType: 'headerRow' };
                this.parent.trigger(queryCellInfo, args, (columnArgs) => {
                    if (!columnArgs.cancel) {
                        tr.appendChild(th);
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
        let contentTable = createElement('table', {
            className: TABLE_CLASS + ' ' + CONTENT_TABLE_CLASS,
            attrs: { 'role': 'presentation' }
        });
        contentWrap.appendChild(contentTable);
        this.renderColGroup(contentTable);
        let tBody = createElement('tbody');
        contentTable.appendChild(tBody);
        let className;
        let isCollaspsed = false;
        this.swimlaneRow = this.kanbanRows;
        this.initializeSwimlaneTree();
        for (let row of this.swimlaneRow) {
            if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneToggleArray.length !== 0) {
                let index = this.parent.swimlaneToggleArray.indexOf(row.keyField);
                isCollaspsed = index !== -1;
            }
            className = isCollaspsed ? CONTENT_ROW_CLASS + ' ' + COLLAPSED_CLASS : CONTENT_ROW_CLASS;
            let tr = createElement('tr', { className: className, attrs: { 'aria-expanded': 'true' } });
            if (this.parent.swimlaneSettings.keyField && !this.parent.isAdaptive) {
                this.renderSwimlaneRow(tBody, row, isCollaspsed);
            }
            for (let column of this.parent.columns) {
                if (this.isColumnVisible(column)) {
                    let index = this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                    let className = index === -1 ? CONTENT_CELLS_CLASS : CONTENT_CELLS_CLASS + ' ' + COLLAPSED_CLASS;
                    let dragClass = (column.allowDrag ? ' ' + DRAG_CLASS : '') + (column.allowDrop ? ' ' + DROP_CLASS
                        + ' ' + DROPPABLE_CLASS : '');
                    let td = createElement('td', {
                        className: className + dragClass,
                        attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField, 'aria-expanded': 'true', 'tabindex': '0' }
                    });
                    if (column.allowToggle && !column.isExpanded || index !== -1) {
                        addClass([td], COLLAPSED_CLASS);
                        let text = (column.showItemCount ? '[' +
                            this.getColumnData(column.keyField, this.swimlaneData[row.keyField]).length + '] ' : '') + column.headerText;
                        td.appendChild(createElement('div', { className: COLLAPSE_HEADER_TEXT_CLASS, innerHTML: text }));
                        td.setAttribute('aria-expanded', 'false');
                    }
                    if (column.showAddButton) {
                        let button = createElement('div', { className: SHOW_ADD_BUTTON, attrs: { 'tabindex': '-1' } });
                        button.appendChild(createElement('div', { className: SHOW_ADD_ICON + ' ' + ICON_CLASS }));
                        td.appendChild(button);
                    }
                    tr.appendChild(td);
                }
            }
            let dataObj = [{ keyField: row.keyField, textField: row.textField, count: row.count }];
            let args = { data: dataObj, element: tr, cancel: false, requestType: 'contentRow' };
            this.parent.trigger(queryCellInfo, args, (columnArgs) => {
                if (!columnArgs.cancel) {
                    tBody.appendChild(tr);
                }
            });
        }
    }
    initializeSwimlaneTree() {
        if (this.parent.swimlaneSettings.keyField && this.parent.isAdaptive && this.parent.kanbanData.length !== 0) {
            this.swimlaneRow = [this.kanbanRows[this.swimlaneIndex]];
            this.renderSwimlaneTree();
            this.parent.element.querySelector('.' + TOOLBAR_SWIMLANE_NAME_CLASS).innerHTML = this.swimlaneRow[0].textField;
        }
    }
    renderSwimlaneRow(tBody, row, isCollapsed) {
        let name = CONTENT_ROW_CLASS + ' ' + SWIMLANE_ROW_CLASS;
        let className = isCollapsed ? ' ' + COLLAPSED_CLASS : '';
        let tr = createElement('tr', {
            className: name + className, attrs: { 'data-key': row.keyField, 'aria-expanded': (!isCollapsed).toString() }
        });
        let col = this.parent.columns.length - this.parent.actionModule.hideColumnKeys.length;
        let td = createElement('td', {
            className: CONTENT_CELLS_CLASS, attrs: { 'data-role': 'kanban-column', 'colspan': col.toString() }
        });
        let swimlaneHeader = createElement('div', { className: SWIMLANE_HEADER_CLASS });
        td.appendChild(swimlaneHeader);
        let iconClass = isCollapsed ? SWIMLANE_ROW_COLLAPSE_CLASS : SWIMLANE_ROW_EXPAND_CLASS;
        let iconDiv = createElement('div', {
            className: ICON_CLASS + ' ' + iconClass, attrs: {
                'tabindex': '0',
                'aria-label': isCollapsed ? row.keyField + ' Collapse' : row.keyField + ' Expand'
            }
        });
        swimlaneHeader.appendChild(iconDiv);
        let headerWrap = createElement('div', { className: HEADER_WRAP_CLASS });
        swimlaneHeader.appendChild(headerWrap);
        let cardCount = this.swimlaneData[row.keyField].length;
        if (this.parent.swimlaneSettings.template) {
            let templateArgs = extend({}, row, { count: cardCount }, true);
            addClass([td], TEMPLATE_CLASS);
            let templateId = this.parent.element.id + '_swimlaneTemplate';
            let swimlaneTemplate = this.parent.templateParser(this.parent.swimlaneSettings.template)(templateArgs, this.parent, 'template', templateId, false);
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
                innerHTML: `- ${cardCount.toString()} ${this.parent.localeObj.getConstant('items')}`
            }));
        }
        tr.appendChild(td);
        let dataObj = [{ keyField: row.keyField, textField: row.textField, count: row.count }];
        let args = { data: dataObj, element: tr, cancel: false, requestType: 'swimlaneRow' };
        this.parent.trigger(queryCellInfo, args, (columnArgs) => {
            if (!columnArgs.cancel) {
                tBody.appendChild(tr);
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
                    let columnData = this.parent.swimlaneSettings.keyField ?
                        this.getColumnData(column.keyField, this.swimlaneData[rows[index].keyField]) : this.columnData[column.keyField];
                    dataCount += columnData.length;
                    let columnWrapper = tr.querySelector('[data-key="' + column.keyField + '"]');
                    let cardWrapper = createElement('div', { className: CARD_WRAPPER_CLASS });
                    columnWrapper.appendChild(cardWrapper);
                    if (columnData.length > 0) {
                        for (let data of columnData) {
                            let cardText = data[this.parent.cardSettings.headerField];
                            let cardIndex = this.parent.actionModule.selectionArray.indexOf(cardText);
                            let cardElement = this.renderCard(data);
                            if (cardIndex !== -1) {
                                cardElement.setAttribute('aria-selected', 'true');
                                addClass([cardElement], CARD_SELECTION_CLASS);
                            }
                            let args = { data: data, element: cardElement, cancel: false };
                            this.parent.trigger(cardRendered, args, (cardArgs) => {
                                if (!cardArgs.cancel) {
                                    cardWrapper.appendChild(cardElement);
                                }
                            });
                        }
                    }
                    else {
                        cardWrapper.appendChild(this.renderEmptyCard());
                    }
                }
            }
            if (dataCount === 0) {
                removeTrs.push(tr);
                if (swimlaneRows.length > 0) {
                    removeTrs.push(swimlaneRows[index]);
                }
            }
        });
        if (!this.parent.swimlaneSettings.showEmptyRow && (this.parent.kanbanData.length === 0 && !this.parent.showEmptyColumn)) {
            removeTrs.forEach((tr) => remove(tr));
        }
    }
    renderCard(data) {
        let cardElement = createElement('div', {
            className: CARD_CLASS,
            attrs: {
                'data-id': data[this.parent.cardSettings.headerField], 'data-key': data[this.parent.keyField],
                'aria-selected': 'false', 'tabindex': '-1'
            }
        });
        if (this.parent.cardSettings.template) {
            addClass([cardElement], TEMPLATE_CLASS);
            let templateId = this.parent.element.id + '_cardTemplate';
            let cardTemplate = this.parent.templateParser(this.parent.cardSettings.template)(data, this.parent, 'template', templateId, false);
            append(cardTemplate, cardElement);
        }
        else {
            let tooltipClass = this.parent.enableTooltip ? ' ' + TOOLTIP_TEXT_CLASS : '';
            if (this.parent.cardSettings.showHeader) {
                let cardHeader = createElement('div', { className: CARD_HEADER_CLASS });
                let cardCaption = createElement('div', { className: CARD_HEADER_TEXT_CLASS });
                let cardText = createElement('div', {
                    className: CARD_HEADER_TITLE_CLASS + tooltipClass,
                    innerHTML: data[this.parent.cardSettings.headerField] || ''
                });
                cardHeader.appendChild(cardCaption);
                cardCaption.appendChild(cardText);
                cardElement.appendChild(cardHeader);
            }
            let cardContent = createElement('div', {
                className: CARD_CONTENT_CLASS + tooltipClass,
                innerHTML: data[this.parent.cardSettings.contentField] || ''
            });
            cardElement.appendChild(cardContent);
            if (this.parent.cardSettings.tagsField && data[this.parent.cardSettings.tagsField]) {
                let cardTags = createElement('div', { className: CARD_TAGS_CLASS });
                let tags = data[this.parent.cardSettings.tagsField].toString().split(',');
                for (let tag of tags) {
                    cardTags.appendChild(createElement('div', {
                        className: CARD_TAG_CLASS + ' ' + CARD_LABEL_CLASS, innerHTML: tag
                    }));
                }
                cardElement.appendChild(cardTags);
            }
            if (this.parent.cardSettings.grabberField && data[this.parent.cardSettings.grabberField]) {
                addClass([cardElement], CARD_COLOR_CLASS);
                cardElement.style.borderLeftColor = data[this.parent.cardSettings.grabberField];
            }
            if (this.parent.cardSettings.footerCssField) {
                let cardFields = createElement('div', { className: CARD_FOOTER_CLASS });
                let keys = data[this.parent.cardSettings.footerCssField].split(',');
                for (let key of keys) {
                    cardFields.appendChild(createElement('div', {
                        className: key.trim() + ' ' + CARD_FOOTER_CSS_CLASS
                    }));
                }
                cardElement.appendChild(cardFields);
            }
        }
        return cardElement;
    }
    renderEmptyCard() {
        let emptyCard = createElement('span', {
            className: EMPTY_CARD_CLASS,
            innerHTML: this.parent.localeObj.getConstant('noCard')
        });
        return emptyCard;
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
                if (!this.parent.swimlaneSettings.showEmptyRow) {
                    if (this.columnKeys.indexOf(obj[this.parent.keyField]) === -1) {
                        return;
                    }
                }
                let textField = obj[this.parent.swimlaneSettings.textField] || obj[this.parent.swimlaneSettings.keyField];
                let keyField = obj[this.parent.swimlaneSettings.keyField];
                if (!obj[this.parent.swimlaneSettings.keyField]) {
                    if (this.parent.swimlaneSettings.showUnassignedRow) {
                        textField = 'Unassigned';
                        keyField = '';
                    }
                    else {
                        return;
                    }
                }
                kanbanRows.push({ keyField: keyField, textField: textField });
            });
            kanbanRows = kanbanRows.filter((item, index, arr) => index === arr.map((item) => item.keyField).indexOf(item.keyField));
            kanbanRows = this.swimlaneSorting(kanbanRows);
            kanbanRows.forEach((row) => {
                row.count = this.parent.kanbanData.filter((obj) => this.columnKeys.indexOf(obj[this.parent.keyField]) > -1 &&
                    obj[this.parent.swimlaneSettings.keyField] === row.keyField).length;
            });
            if (kanbanRows.length === 0) {
                kanbanRows.push({ keyField: '', textField: '' });
            }
        }
        else {
            kanbanRows.push({ keyField: '', textField: '' });
        }
        return kanbanRows;
    }
    swimlaneSorting(rows) {
        if (this.parent.swimlaneSettings.sortComparer) {
            rows = this.parent.swimlaneSettings.sortComparer.call(this.parent, rows);
        }
        else {
            rows.sort((a, b) => a.textField.localeCompare(b.textField, undefined, { numeric: true }));
            if (this.parent.swimlaneSettings.sortDirection === 'Descending') {
                rows.reverse();
            }
        }
        return rows;
    }
    createStackedRow(rows) {
        let tr = createElement('tr', { className: HEADER_ROW_CLASS + ' ' + STACKED_HEADER_ROW_CLASS });
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
                className: HEADER_CELLS_CLASS + ' ' + STACKED_HEADER_CELL_CLASS,
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
            let swimlaneToolbar = this.parent.element.querySelector('.' + SWIMLANE_HEADER_CLASS);
            if (swimlaneToolbar) {
                height -= swimlaneToolbar.offsetHeight;
            }
            let cardWrappers = [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_CELLS_CLASS));
            cardWrappers.forEach((cell) => {
                let cardWrapper = cell.querySelector('.' + CARD_WRAPPER_CLASS);
                if (!cardWrapper.classList.contains(MULTI_CARD_WRAPPER_CLASS)) {
                    cardWrapper.style.height = formatUnit(height);
                    EventHandler.add(cell, 'touchmove', this.onAdaptiveScroll, this);
                }
            });
        }
        if (this.parent.height !== 'auto' && this.parent.height !== '100%') {
            content.style.height = formatUnit(height);
        }
        [].slice.call(header.children).forEach((node) => {
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
        this.updateScrollPosition();
    }
    onContentScroll(e) {
        let target = e.target;
        let header = this.parent.element.querySelector('.' + HEADER_CLASS);
        [].slice.call(header.children).forEach((node) => { node.scrollLeft = target.scrollLeft; });
        this.parent.scrollPosition.content = { left: target.scrollLeft, top: target.scrollTop };
    }
    onColumnScroll(e) {
        let target = e.target;
        if (target.offsetParent) {
            let columnKey = target.offsetParent.getAttribute('data-key');
            this.parent.scrollPosition.column[columnKey] = { left: target.scrollLeft, top: target.scrollTop };
        }
    }
    onAdaptiveScroll(e) {
        if (this.parent.touchModule.tabHold && !this.parent.touchModule.mobilePopup) {
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
            if (target.querySelector('.' + CARD_WRAPPER_CLASS)) {
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
                colorClass = MAX_COLOR_CLASS;
            }
            else if (column.minCount && count < column.minCount) {
                colorClass = MIN_COLOR_CLASS;
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
                this.swimlaneRow.forEach((row, index) => {
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
    refreshValidation() {
        let validations = [].slice.call(this.parent.element.querySelectorAll('.' + LIMITS_CLASS));
        validations.forEach((node) => { remove(node); });
        let minClass = [].slice.call(this.parent.element.querySelectorAll('.' + MIN_COLOR_CLASS));
        removeClass(minClass, MIN_COUNT_CLASS);
        let maxClass = [].slice.call(this.parent.element.querySelectorAll('.' + MAX_COLOR_CLASS));
        removeClass(maxClass, MAX_COLOR_CLASS);
        this.renderValidation();
    }
    getColumnData(columnValue, dataSource = this.parent.kanbanData) {
        let cardData = [];
        let columnKeys = columnValue.split(',');
        for (let key of columnKeys) {
            let keyData = dataSource.filter((cardObj) => cardObj[this.parent.keyField] === key.trim());
            cardData = cardData.concat(keyData);
        }
        this.sortCategory(cardData);
        return cardData;
    }
    sortCategory(cardData) {
        let key = this.parent.cardSettings.headerField;
        let direction = this.parent.sortSettings.direction;
        switch (this.parent.sortSettings.sortBy) {
            case 'DataSourceOrder':
                this.sortOrder(key, direction, cardData);
                break;
            case 'Custom':
            case 'Index':
                if (this.parent.sortSettings.field) {
                    key = this.parent.sortSettings.field;
                }
                this.sortOrder(key, direction, cardData);
                break;
        }
        return cardData;
    }
    sortOrder(key, direction, cardData) {
        let isNumeric = true;
        if (this.parent.kanbanData.length > 0) {
            isNumeric = typeof this.parent.kanbanData[0][key] === 'number';
        }
        if (!isNumeric && this.parent.sortSettings.sortBy === 'Index') {
            return cardData;
        }
        let first;
        let second;
        cardData = cardData.sort((firstData, secondData) => {
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
    }
    documentClick(args) {
        if (args.target.classList.contains(SWIMLANE_OVERLAY_CLASS) &&
            this.parent.element.querySelector('.' + SWIMLANE_RESOURCE_CLASS).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
        if (closest(args.target, `.${ROOT_CLASS}`)) {
            return;
        }
        let cards = [].slice.call(this.parent.element.querySelectorAll(`.${CARD_CLASS}.${CARD_SELECTION_CLASS}`));
        removeClass(cards, CARD_SELECTION_CLASS);
        this.disableAttributeSelection(cards);
    }
    disableAttributeSelection(cards) {
        if (cards instanceof Element) {
            cards.setAttribute('aria-selected', 'false');
        }
        else {
            cards.forEach((card) => { card.setAttribute('aria-selected', 'false'); });
        }
    }
    getColumnCards(data) {
        let columnData = {};
        this.columnKeys = [];
        this.parent.columns.forEach((column) => {
            this.columnKeys = this.columnKeys.concat(column.keyField.split(',').map((e) => e.trim()));
            let cardData = this.getColumnData(column.keyField, data);
            columnData[column.keyField] = cardData;
        });
        return columnData;
    }
    getSwimlaneCards() {
        let swimlaneData = {};
        if (this.parent.swimlaneSettings.keyField) {
            this.kanbanRows.forEach((row) => swimlaneData[row.keyField] = this.parent.kanbanData.filter((obj) => this.columnKeys.indexOf(obj[this.parent.keyField]) > -1 &&
                ((!obj[this.parent.swimlaneSettings.keyField] && this.parent.swimlaneSettings.showUnassignedRow) ?
                    '' : obj[this.parent.swimlaneSettings.keyField]) === row.keyField));
        }
        return swimlaneData;
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
    refresh() {
        this.parent.columns.forEach((column) => {
            if (column.showItemCount) {
                let countSelector = `.${HEADER_CELLS_CLASS}[data-key="${column.keyField}"] .${CARD_ITEM_COUNT_CLASS}`;
                let itemCount = this.parent.element.querySelector(countSelector);
                if (itemCount) {
                    itemCount.innerHTML = `- ${this.columnData[column.keyField].length} ${this.parent.localeObj.getConstant('items')}`;
                }
            }
        });
        if (this.parent.swimlaneSettings.keyField) {
            let swimlaneRows = [].slice.call(this.parent.element.querySelectorAll(`.${SWIMLANE_ROW_CLASS}`));
            swimlaneRows.forEach((swimlane) => {
                let swimlaneKey = swimlane.getAttribute('data-key');
                let itemCount = swimlane.querySelector(`.${CARD_ITEM_COUNT_CLASS}`);
                if (itemCount) {
                    itemCount.innerHTML = `- ${this.swimlaneData[swimlaneKey].length} ${this.parent.localeObj.getConstant('items')}`;
                }
            });
        }
        this.refreshValidation();
    }
    updateScrollPosition() {
        let content = this.parent.element.querySelector('.' + CONTENT_CLASS);
        if (content) {
            content.scrollTo(this.parent.scrollPosition.content.left, this.parent.scrollPosition.content.top);
        }
        let cardWrapper = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_WRAPPER_CLASS));
        cardWrapper.forEach((wrapper) => {
            if (wrapper.offsetParent) {
                let scrollData = this.parent.scrollPosition.column[wrapper.offsetParent.getAttribute('data-key')];
                if (scrollData) {
                    wrapper.scrollTo(scrollData.left, scrollData.top);
                }
            }
        });
    }
    renderCardBasedOnIndex(data, index) {
        let key = data[this.parent.keyField];
        let cardRow = this.parent.element.querySelector('.e-content-row:not(.e-swimlane-row)');
        if (this.parent.swimlaneSettings.keyField) {
            let rowSelector = `.e-content-row.e-swimlane-row[data-key="${data[this.parent.swimlaneSettings.keyField]}"]`;
            cardRow = this.parent.element.querySelector(rowSelector).nextElementSibling;
        }
        if (this.parent.sortSettings.sortBy !== 'Index') {
            let field = this.parent.cardSettings.headerField;
            if (this.parent.sortSettings.sortBy === 'Custom') {
                field = this.parent.sortSettings.field;
            }
            if (isNullOrUndefined(this.parent.swimlaneSettings.keyField)) {
                index = this.getColumnData(key, this.parent.kanbanData).findIndex((colData) => colData[field] === data[field]);
            }
            else {
                let swimlaneDatas = this.parent.getSwimlaneData(data[this.parent.swimlaneSettings.keyField]);
                index = this.getColumnData(key, swimlaneDatas).findIndex((colData) => colData[field] === data[field]);
            }
        }
        else if (this.parent.sortSettings.sortBy === 'Index' &&
            this.parent.sortSettings.field && this.parent.sortSettings.direction === 'Ascending') {
            index = data[this.parent.sortSettings.field] - 1;
        }
        if (cardRow) {
            let td = [].slice.call(cardRow.children).filter((e) => e.getAttribute('data-key').replace(/\s/g, '').split(',').indexOf(key.replace(/\s/g, '')) !== -1)[0];
            let cardWrapper = td.querySelector('.' + CARD_WRAPPER_CLASS);
            let emptyCard = cardWrapper.querySelector('.' + EMPTY_CARD_CLASS);
            if (emptyCard) {
                remove(emptyCard);
            }
            let cardElement = this.renderCard(data);
            if (this.parent.allowDragAndDrop && td.classList.contains(DRAG_CLASS)) {
                this.parent.dragAndDropModule.wireDragEvents(cardElement);
                addClass([cardElement], DROPPABLE_CLASS);
            }
            let args = { data: data, element: cardElement, cancel: false };
            this.parent.trigger(cardRendered, args, (cardArgs) => {
                if (!cardArgs.cancel) {
                    if (isNullOrUndefined(index) || cardWrapper.children.length === 0) {
                        cardWrapper.appendChild(cardElement);
                    }
                    else {
                        cardWrapper.insertBefore(cardElement, cardWrapper.childNodes[index]);
                    }
                }
            });
        }
    }
    removeCard(data) {
        let cardKey = data[this.parent.cardSettings.headerField];
        let cardElement = this.parent.element.querySelector(`.${CARD_CLASS}[data-id="${cardKey}"]`);
        let cardContainer = cardElement.parentElement;
        if (cardElement) {
            remove(cardElement);
        }
        if (cardContainer.childElementCount === 0) {
            cardContainer.appendChild(this.renderEmptyCard());
        }
    }
    wireEvents() {
        EventHandler.add(this.parent.element, 'click', this.parent.actionModule.clickHandler, this.parent.actionModule);
        EventHandler.add(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler, this.parent.actionModule);
        EventHandler.add(document, Browser.touchStartEvent, this.documentClick, this);
        let content = this.parent.element.querySelector('.' + CONTENT_CLASS);
        EventHandler.add(content, 'scroll', this.onContentScroll, this);
        let cardWrapper = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_WRAPPER_CLASS));
        cardWrapper.forEach((wrapper) => {
            if (this.parent.isInitialRender && wrapper.offsetParent) {
                this.parent.scrollPosition.column[wrapper.offsetParent.getAttribute('data-key')] = { left: 0, top: 0 };
            }
            EventHandler.add(wrapper, 'scroll', this.onColumnScroll, this);
        });
        if (this.parent.isAdaptive) {
            this.parent.touchModule.wireTouchEvents();
            content.scrollLeft = this.scrollLeft;
        }
        this.wireDragEvent();
    }
    unWireEvents() {
        EventHandler.remove(this.parent.element, 'click', this.parent.actionModule.clickHandler);
        EventHandler.remove(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler);
        EventHandler.remove(document, Browser.touchStartEvent, this.documentClick);
        let content = this.parent.element.querySelector('.' + CONTENT_CLASS);
        if (content) {
            EventHandler.remove(content, 'scroll', this.onContentScroll);
            if (this.parent.allowDragAndDrop) {
                this.unWireDragEvent();
            }
        }
        let cardWrapper = [].slice.call(this.parent.element.querySelectorAll('.' + CARD_WRAPPER_CLASS));
        cardWrapper.forEach((wrapper) => { EventHandler.remove(wrapper, 'scroll', this.onColumnScroll); });
        if (this.parent.isAdaptive) {
            this.parent.touchModule.unWireTouchEvents();
        }
    }
    wireDragEvent() {
        if (this.parent.allowDragAndDrop) {
            let cards = [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_CELLS_CLASS
                + '.' + DRAG_CLASS + ' .' + CARD_CLASS));
            addClass(cards, DROPPABLE_CLASS);
            cards.forEach((card) => this.parent.dragAndDropModule.wireDragEvents(card));
        }
    }
    unWireDragEvent() {
        let cards = [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_CELLS_CLASS
            + '.' + DRAG_CLASS + ' .' + CARD_CLASS));
        removeClass(cards, DROPPABLE_CLASS);
        cards.forEach((card) => this.parent.dragAndDropModule.unWireDragEvents(card));
    }
    destroy() {
        this.parent.resetTemplates();
        this.parent.off(dataReady, this.initRender);
        this.parent.off(contentReady, this.scrollUiUpdate);
        this.unWireEvents();
        let header = this.parent.element.querySelector('.' + HEADER_CLASS);
        if (header) {
            remove(header);
        }
        let content = this.parent.element.querySelector('.' + CONTENT_CLASS);
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
        let swimlaneToolBarEle = this.parent.element.querySelector('.' + SWIMLANE_HEADER_CLASS);
        if (swimlaneToolBarEle) {
            remove(swimlaneToolBarEle);
        }
        let swimlaneContent = this.parent.element.querySelector('.' + SWIMLANE_CONTENT_CLASS);
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
        if (!this.enablePersistence || !this.swimlaneToggleArray) {
            this.swimlaneToggleArray = [];
        }
        this.activeCardData = { data: null, element: null };
        let defaultLocale = {
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
            close: 'Close',
            noCard: 'No cards to display'
        };
        this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
        this.scrollPosition = { content: { left: 0, top: 0 }, column: {} };
        this.isInitialRender = true;
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
        return this.addOnPersist(['columns', 'dataSource', 'swimlaneToggleArray']);
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
        let addClasses = [ROOT_CLASS];
        let removeClasses = [];
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
                        this.layoutModule.refreshCards();
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
                    this.layoutModule.refreshHeaders();
                    break;
                case 'sortSettings':
                    this.notify(dataReady, { processedData: this.kanbanData });
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
                case 'sortDirection':
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
                case 'tagsField':
                case 'grabberField':
                case 'footerCssField':
                    this.layoutModule.refreshCards();
                    break;
                case 'selectionType':
                    let cards = this.getSelectedCards();
                    if (cards.length > 0) {
                        removeClass(cards, CARD_SELECTION_CLASS);
                        this.layoutModule.disableAttributeSelection(cards);
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
        this.dialogModule = new KanbanDialog(this);
        if (this.enableTooltip) {
            this.tooltipModule = new KanbanTooltip(this);
        }
        if (Browser.isDevice || Browser.isTouch) {
            this.touchModule = new KanbanTouch(this);
        }
    }
    /** @hidden */
    renderTemplates() {
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    /** @hidden */
    resetTemplates(templates) {
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate(templates);
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
        this.dialogModule = null;
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
     * Returns the column data based on column key input.
     * @method getColumnData
     * @param {string} columnKey Accepts the column key to get the objects.
     * @returns {Object[]}
     */
    getColumnData(columnKey, dataSource) {
        return this.layoutModule.getColumnCards(dataSource)[columnKey] || [];
    }
    /**
     * Returns the swimlane column data based on swimlane keyField input.
     * @method getSwimlaneData
     * @param {string} keyField Accepts the swimlane keyField to get the objects.
     * @returns {Object[]}
     */
    getSwimlaneData(keyField) {
        return this.layoutModule.getSwimlaneCards()[keyField] || [];
    }
    /**
     * Gets the list of selected cards from the board.
     * @method getSelectedCards
     * @returns {HTMLElement[]}
     */
    getSelectedCards() {
        return [].slice.call(this.element.querySelectorAll('.' + CARD_CLASS + '.' + CARD_SELECTION_CLASS));
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
     * To manually open the dialog.
     * @method openDialog
     * @param {CurrentAction} action Defines the action for which the dialog needs to be opened such as either for new card creation or
     *  editing of existing cards. The applicable action names are `Add` and `Edit`.
     * @param {Object} data It can be card data.
     * @returns {void}
     */
    openDialog(action, data) {
        this.dialogModule.openDialog(action, data);
    }
    /**
     * To manually close the dialog.
     * @method closeDialog
     * @returns {void}
     */
    closeDialog() {
        this.dialogModule.closeDialog();
    }
    /**
     * Adds the new card to the data source of Kanban and layout.
     * @method addCard
     * @param {Object | {[key: string]: Object}} cardData Single card objects to be added into Kanban.
     * @param {Object[] | {[key: string]: Object}[]} cardData Collection of card objects to be added into Kanban.
     * @returns {void}
     */
    addCard(cardData) {
        this.crudModule.addCard(cardData);
    }
    /**
     * Updates the changes made in the card object by passing it as a parameter to the data source.
     * @method updateCard
     * @param {{[key: string]: Object} | Object} cardData Single card object to be updated into Kanban.
     * @param {{[key: string]: Object}[] | Object[]} cardData Collection of card objects to be updated into Kanban.
     * @returns {void}
     */
    updateCard(cardData, index) {
        this.crudModule.updateCard(cardData, index);
    }
    /**
     * Deletes the card based on the provided ID or card collection in the argument list.
     * @method deleteCard
     * @param {{[key: string]: Object} | Object} id Single card to be removed from the Kanban.
     * @param {{[key: string]: Object }[] | Object[]} id Collection of cards to be removed from the Kanban.
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
        [].slice.call(this.element.childNodes).forEach((node) => { detach(node); });
        let removeClasses = [ROOT_CLASS];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
        super.destroy();
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
//# sourceMappingURL=ej2-kanban.es2015.js.map
