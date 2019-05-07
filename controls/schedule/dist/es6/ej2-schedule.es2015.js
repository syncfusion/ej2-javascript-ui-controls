import { Animation, Browser, ChildProperty, Collection, Complex, Component, Draggable, Event, EventHandler, HijriParser, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, Touch, addClass, append, classList, cldrData, closest, compile, createElement, extend, formatUnit, getDefaultDateObject, getValue, isNullOrUndefined, prepend, remove, removeClass, setStyleAttribute, uniqueID } from '@syncfusion/ej2-base';
import { Dialog, Popup, Tooltip, createSpinner, hideSpinner, isCollide, showSpinner } from '@syncfusion/ej2-popups';
import { Toolbar, TreeView } from '@syncfusion/ej2-navigations';
import { Calendar, DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { DataManager, Predicate, Query } from '@syncfusion/ej2-data';
import { Button, CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { FormValidator, Input, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { ListBase } from '@syncfusion/ej2-lists';
import { Workbook } from '@syncfusion/ej2-excel-export';

/**
 * Constants
 */
/** @hidden */
const cellClick = 'cellClick';
/** @hidden */
const cellDoubleClick = 'cellDoubleClick';
/** @hidden */
const select = 'select';
/** @hidden */
const actionBegin = 'actionBegin';
/** @hidden */
const actionComplete = 'actionComplete';
/** @hidden */
const actionFailure = 'actionFailure';
/** @hidden */
const navigating = 'navigating';
/** @hidden */
const renderCell = 'renderCell';
/** @hidden */
const eventClick = 'eventClick';
/** @hidden */
const eventRendered = 'eventRendered';
/** @hidden */
const dataBinding = 'dataBinding';
/** @hidden */
const dataBound = 'dataBound';
/** @hidden */
const popupOpen = 'popupOpen';
/** @hidden */
const dragStart = 'dragStart';
/** @hidden */
const drag = 'drag';
/** @hidden */
const dragStop = 'dragStop';
/** @hidden */
const resizeStart = 'resizeStart';
/** @hidden */
const resizing = 'resizing';
/** @hidden */
const resizeStop = 'resizeStop';
/**
 * Specifies schedule internal events
 */
/** @hidden */
const initialLoad = 'initial-load';
/** @hidden */
const initialEnd = 'initial-end';
/** @hidden */
const dataReady = 'data-ready';
/** @hidden */
const contentReady = 'content-ready';
/** @hidden */
const scroll = 'scroll';
/** @hidden */
const virtualScroll = 'virtual-scroll';
/** @hidden */
const scrollUiUpdate = 'scroll-ui-update';
/** @hidden */
const uiUpdate = 'ui-update';
/** @hidden */
const documentClick = 'document-click';
/** @hidden */
const cellMouseDown = 'cell-mouse-down';

/**
 * Schedule common utilities
 */
const WEEK_LENGTH = 7;
const MS_PER_DAY = 86400000;
const MS_PER_MINUTE = 60000;
function getElementHeightFromClass(container, elementClass) {
    let height = 0;
    let el = createElement('div', { className: elementClass }).cloneNode();
    el.style.visibility = 'hidden';
    el.style.position = 'absolute';
    container.appendChild(el);
    height = getOuterHeight(el);
    remove(el);
    return height;
}
function getTranslateY(element) {
    let style = getComputedStyle(element);
    return window.WebKitCSSMatrix ?
        new WebKitCSSMatrix(style.webkitTransform).m42 : 0;
}
function getWeekFirstDate(date1, firstDayOfWeek) {
    let date = new Date(date1.getTime());
    firstDayOfWeek = (firstDayOfWeek - date.getDay() + 7 * (-1)) % 7;
    return new Date(date.setDate(date.getDate() + firstDayOfWeek));
}
function firstDateOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth());
}
function lastDateOfMonth(dt) {
    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
}
function getWeekNumber(dt) {
    let currentDate = new Date('' + dt).valueOf();
    let date = new Date(dt.getFullYear(), 0, 1).valueOf();
    let a = (currentDate - date);
    return Math.ceil((((a) / MS_PER_DAY) + new Date(date).getDay() + 1) / 7);
}
function setTime(date, time) {
    let tzOffsetBefore = date.getTimezoneOffset();
    let d = new Date(date.getTime() + time);
    let tzOffsetDiff = d.getTimezoneOffset() - tzOffsetBefore;
    date.setTime(d.getTime() + tzOffsetDiff * MS_PER_MINUTE);
    return date;
}
function resetTime(date) {
    date.setHours(0, 0, 0, 0);
    return date;
}
function getDateInMs(date) {
    return date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
}
function getDateCount(startDate, endDate) {
    return (endDate.getTime() - startDate.getTime()) / MS_PER_DAY;
}
function addDays(date, i) {
    date = new Date('' + date);
    return new Date(date.setDate(date.getDate() + i));
}
function addMonths(date, i) {
    date = new Date('' + date);
    let day = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + i);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}
function addYears(date, i) {
    date = new Date('' + date);
    let day = date.getDate();
    date.setDate(1);
    date.setFullYear(date.getFullYear() + i);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}
function getStartEndHours(date, startHour, endHour) {
    let date1 = new Date(date.getTime());
    date1.setHours(startHour.getHours());
    date1.setMinutes(startHour.getMinutes());
    date1.setSeconds(startHour.getSeconds());
    let date2 = new Date(date.getTime());
    if (endHour.getHours() === 0) {
        date2 = addDays(date2, 1);
    }
    else {
        date2.setHours(endHour.getHours());
        date2.setMinutes(endHour.getMinutes());
        date2.setSeconds(endHour.getSeconds());
    }
    return { startHour: date1, endHour: date2 };
}
function getMaxDays(d) {
    let date = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return date.getDate();
}
function getDaysCount(startDate, endDate) {
    let strTime = resetTime(new Date(startDate));
    let endTime = resetTime(new Date(endDate));
    return (endTime.getTime() - strTime.getTime()) / MS_PER_DAY;
}
function getDateFromString(date) {
    return date.indexOf('Date') !== -1 ? new Date(parseInt(date.match(/\d+/g).toString(), 10)) :
        date.indexOf('T') !== -1 ? new Date(date) : new Date(date.replace(/-/g, '/'));
}
/** @hidden */
let scrollWidth = null;
/** @hidden */
function getScrollBarWidth() {
    if (scrollWidth !== null) {
        return scrollWidth;
    }
    let divNode = createElement('div');
    let value = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    value = (divNode.offsetWidth - divNode.clientWidth) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}
function findIndexInData(data, property, value) {
    for (let i = 0, length = data.length; i < length; i++) {
        if (data[i][property] === value) {
            return i;
        }
    }
    return -1;
}
function getOuterHeight(element) {
    let style = getComputedStyle(element);
    return element.offsetHeight + (parseInt(style.marginTop, 10) || 0) + (parseInt(style.marginBottom, 10) || 0);
}

/**
 * CSS Constants
 */
/** @hidden */
const ROOT = 'e-schedule';
/** @hidden */
const RTL = 'e-rtl';
/** @hidden */
const DEVICE_CLASS = 'e-device';
/** @hidden */
const ICON = 'e-icons';
/** @hidden */
const ENABLE_CLASS = 'e-enable';
/** @hidden */
const DISABLE_CLASS = 'e-disable';
/** @hidden */
const TABLE_CONTAINER_CLASS = 'e-table-container';
/** @hidden */
const SCHEDULE_TABLE_CLASS = 'e-schedule-table';
/** @hidden */
const ALLDAY_CELLS_CLASS = 'e-all-day-cells';
/** @hidden */
const HEADER_POPUP_CLASS = 'e-header-popup';
/** @hidden */
const HEADER_CALENDAR_CLASS = 'e-header-calendar';
/** @hidden */
const ALLDAY_ROW_CLASS = 'e-all-day-row';
/** @hidden */
const CONTENT_TABLE_CLASS = 'e-content-table';
/** @hidden */
const WORK_CELLS_CLASS = 'e-work-cells';
/** @hidden */
const WORK_HOURS_CLASS = 'e-work-hours';
/** @hidden */
const POPUP_OPEN = 'e-popup-open';
/** @hidden */
const DATE_HEADER_WRAP_CLASS = 'e-date-header-wrap';
/** @hidden */
const DATE_HEADER_CONTAINER_CLASS = 'e-date-header-container';
/** @hidden */
const HEADER_CELLS_CLASS = 'e-header-cells';
/** @hidden */
const WORKDAY_CLASS = 'e-work-days';
/** @hidden */
const OTHERMONTH_CLASS = 'e-other-month';
/** @hidden */
const CURRENT_DAY_CLASS = 'e-current-day';
/** @hidden */
const CURRENTDATE_CLASS = 'e-current-date';
/** @hidden */
const CURRENT_PANEL_CLASS = 'e-current-panel';
/** @hidden */
const PREVIOUS_PANEL_CLASS = 'e-previous-panel';
/** @hidden */
const NEXT_PANEL_CLASS = 'e-next-panel';
/** @hidden */
const TRANSLATE_CLASS = 'e-translate';
/** @hidden */
const LEFT_INDENT_CLASS = 'e-left-indent';
/** @hidden */
const LEFT_INDENT_WRAP_CLASS = 'e-left-indent-wrap';
/** @hidden */
const EVENT_TABLE_CLASS = 'e-event-table';
/** @hidden */
const RESOURCE_LEFT_TD_CLASS = 'e-resource-left-td';
/** @hidden */
const RESOURCE_GROUP_CELLS_CLASS = 'e-resource-group-cells';
/** @hidden */
const RESOURCE_TEXT_CLASS = 'e-resource-text';
/** @hidden */
const RESOURCE_COLUMN_WRAP_CLASS = 'e-resource-column-wrap';
/** @hidden */
const RESOURCE_COLUMN_TABLE_CLASS = 'e-resource-column-table';
/** @hidden */
const RESOURCE_CHILD_CLASS = 'e-child-node';
/** @hidden */
const RESOURCE_PARENT_CLASS = 'e-parent-node';
/** @hidden */
const RESOURCE_EXPAND_CLASS = 'e-resource-expand';
/** @hidden */
const RESOURCE_COLLAPSE_CLASS = 'e-resource-collapse';
/** @hidden */
const RESOURCE_TREE_ICON_CLASS = 'e-resource-tree-icon';
/** @hidden */
const RESOURCE_CELLS_CLASS = 'e-resource-cells';
/** @hidden */
const TIME_CELLS_WRAP_CLASS = 'e-time-cells-wrap';
/** @hidden */
const TIME_CELLS_CLASS = 'e-time-cells';
/** @hidden */
const ALTERNATE_CELLS_CLASS = 'e-alternate-cells';
/** @hidden */
const CURRENT_TIME_CLASS = 'e-current-time';
/** @hidden */
const CURRENT_TIMELINE_CLASS = 'e-current-timeline';
/** @hidden */
const PREVIOUS_TIMELINE_CLASS = 'e-previous-timeline';
/** @hidden */
const HIDE_CHILDS_CLASS = 'e-hide-childs';
/** @hidden */
const SCROLL_CONTAINER_CLASS = 'e-scroll-container';
/** @hidden */

/** @hidden */
const TIMELINE_WRAPPER_CLASS = 'e-timeline-wrapper';
/** @hidden */
const APPOINTMENT_WRAPPER_CLASS = 'e-appointment-wrapper';
/** @hidden */
const DAY_WRAPPER_CLASS = 'e-day-wrapper';
/** @hidden */
const TOOLBAR_CONTAINER = 'e-schedule-toolbar-container';
/** @hidden */
const RESOURCE_TOOLBAR_CONTAINER = 'e-schedule-resource-toolbar-container';
/** @hidden */
const HEADER_TOOLBAR = 'e-schedule-toolbar';
/** @hidden */
const RESOURCE_HEADER_TOOLBAR = 'e-schedule-resource-toolbar';
/** @hidden */
const SELECTED_CELL_CLASS = 'e-selected-cell';
/** @hidden */
const WEEK_NUMBER_WRAPPER_CLASS = 'e-week-number-wrapper';
/** @hidden */
const WEEK_NUMBER_CLASS = 'e-week-number';
/** @hidden */
const APPOINTMENT_WRAP_CLASS = 'e-appointment-wrap';
/** @hidden */
const WRAPPER_CONTAINER_CLASS = 'e-wrapper-container';
/** @hidden */
const APPOINTMENT_CONTAINER_CLASS = 'e-appointment-container';
/** @hidden */
const APPOINTMENT_CLASS = 'e-appointment';
/** @hidden */
const BLOCK_APPOINTMENT_CLASS = 'e-block-appointment';
/** @hidden */
const BLOCK_INDICATOR_CLASS = 'e-block-indicator';
/** @hidden */
const APPOINTMENT_BORDER = 'e-appointment-border';
/** @hidden */
const APPOINTMENT_DETAILS = 'e-appointment-details';
/** @hidden */
const SUBJECT_WRAP = 'e-subject-wrap';
/** @hidden */
const RESOURCE_NAME = 'e-resource-name';
/** @hidden */
const APPOINTMENT_TIME = 'e-time';
/** @hidden */
const TABLE_WRAP_CLASS = 'e-table-wrap';
/** @hidden */
const OUTER_TABLE_CLASS = 'e-outer-table';
/** @hidden */
const CONTENT_WRAP_CLASS = 'e-content-wrap';
/** @hidden */
const VIRTUAL_TRACK_CLASS = 'e-virtual-track';
/** @hidden */
const AGENDA_CELLS_CLASS = 'e-agenda-cells';
/** @hidden */
const AGENDA_CURRENT_DAY_CLASS = 'e-current-day';
/** @hidden */
const AGENDA_SELECTED_CELL = 'e-active-appointment-agenda';
/** @hidden */
const AGENDA_MONTH_HEADER_CLASS = 'e-month-header';
/** @hidden */
const AGENDA_HEADER_CLASS = 'e-day-date-header';
/** @hidden */
const AGENDA_RESOURCE_CLASS = 'e-resource-column';
/** @hidden */
const AGENDA_DATE_CLASS = 'e-date-column';
/** @hidden */
const NAVIGATE_CLASS = 'e-navigate';
/** @hidden */
const DATE_HEADER_CLASS = 'e-date-header';
/** @hidden */
const AGENDA_DAY_BORDER_CLASS = 'e-day-border';
/** @hidden */
const DATE_BORDER_CLASS = 'e-date-border';
/** @hidden */
const AGENDA_DAY_PADDING_CLASS = 'e-day-padding';
/** @hidden */
const DATE_TIME_CLASS = 'e-date-time';
/** @hidden */
const DATE_TIME_WRAPPER_CLASS = 'e-date-time-wrapper';
/** @hidden */
const AGENDA_EMPTY_EVENT_CLASS = 'e-empty-event';
/** @hidden */
const AGENDA_NO_EVENT_CLASS = 'e-no-event';
/** @hidden */
const APPOINTMENT_INDICATOR_CLASS = 'e-appointment-indicator';
/** @hidden */
const EVENT_INDICATOR_CLASS = 'e-indicator';
/** @hidden */
const EVENT_ICON_UP_CLASS = 'e-up-icon';
/** @hidden */
const EVENT_ICON_DOWN_CLASS = 'e-down-icon';
/** @hidden */
const EVENT_ICON_LEFT_CLASS = 'e-left-icon';
/** @hidden */
const EVENT_ICON_RIGHT_CLASS = 'e-right-icon';
/** @hidden */
const EVENT_ACTION_CLASS = 'e-event-action';
/** @hidden */
const NEW_EVENT_CLASS = 'e-new-event';
/** @hidden */
const CLONE_ELEMENT_CLASS = 'e-schedule-event-clone';
/** @hidden */
const MONTH_CLONE_ELEMENT_CLASS = 'e-month-event';
/** @hidden */
const CLONE_TIME_INDICATOR_CLASS = 'e-clone-time-indicator';
/** @hidden */
const DRAG_CLONE_CLASS = 'e-drag-clone';
/** @hidden */
const EVENT_RESIZE_CLASS = 'e-event-resize';
/** @hidden */
const RESIZE_CLONE_CLASS = 'e-resize-clone';
/** @hidden */
const LEFT_RESIZE_HANDLER = 'e-left-handler';
/** @hidden */
const RIGHT_RESIZE_HANDLER = 'e-right-handler';
/** @hidden */
const TOP_RESIZE_HANDLER = 'e-top-handler';
/** @hidden */
const BOTTOM_RESIZE_HANDLER = 'e-bottom-handler';
/** @hidden */
const EVENT_RECURRENCE_ICON_CLASS = 'e-recurrence-icon';
/** @hidden */
const EVENT_RECURRENCE_EDIT_ICON_CLASS = 'e-recurrence-edit-icon';
/** @hidden */
const HEADER_ROW_CLASS = 'e-header-row';
/** @hidden */
const ALLDAY_APPOINTMENT_WRAPPER_CLASS = 'e-all-day-appointment-wrapper';
/** @hidden */
const ALLDAY_APPOINTMENT_CLASS = 'e-all-day-appointment';
/** @hidden */
const EVENT_COUNT_CLASS = 'e-appointment-hide';
/** @hidden */
const ROW_COUNT_WRAPPER_CLASS = 'e-row-count-wrapper';
/** @hidden */
const ALLDAY_APPOINTMENT_SECTION_CLASS = 'e-all-day-appointment-section';
/** @hidden */
const APPOINTMENT_ROW_EXPAND_CLASS = 'e-appointment-expand';
/** @hidden */
const APPOINTMENT_ROW_COLLAPSE_CLASS = 'e-appointment-collapse';
/** @hidden */
const MORE_INDICATOR_CLASS = 'e-more-indicator';
/** @hidden */
const CELL_POPUP_CLASS = 'e-cell-popup';
/** @hidden */
const EVENT_POPUP_CLASS = 'e-event-popup';
/** @hidden */
const MULTIPLE_EVENT_POPUP_CLASS = 'e-multiple-event-popup';
/** @hidden */
const POPUP_HEADER_CLASS = 'e-popup-header';
/** @hidden */
const POPUP_HEADER_ICON_WRAPPER = 'e-header-icon-wrapper';
/** @hidden */
const POPUP_CONTENT_CLASS = 'e-popup-content';
/** @hidden */
const POPUP_FOOTER_CLASS = 'e-popup-footer';
/** @hidden */
const DATE_TIME_DETAILS_CLASS = 'e-date-time-details';
/** @hidden */
const RECURRENCE_SUMMARY_CLASS = 'e-recurrence-summary';
/** @hidden */
const QUICK_POPUP_EVENT_DETAILS_CLASS = 'e-event-details';
/** @hidden */
const EVENT_CREATE_CLASS = 'e-event-create';
/** @hidden */
const EDIT_EVENT_CLASS = 'e-event-edit';
/** @hidden */
const DELETE_EVENT_CLASS = 'e-event-delete';
/** @hidden */
const TEXT_ELLIPSIS = 'e-text-ellipsis';
/** @hidden */
const MORE_POPUP_WRAPPER_CLASS = 'e-more-popup-wrapper';
/** @hidden */
const MORE_EVENT_POPUP_CLASS = 'e-more-event-popup';
/** @hidden */
const MORE_EVENT_HEADER_CLASS = 'e-more-event-header';
/** @hidden */
const MORE_EVENT_DATE_HEADER_CLASS = 'e-more-event-date-header';
/** @hidden */
const MORE_EVENT_HEADER_DAY_CLASS = 'e-header-day';
/** @hidden */
const MORE_EVENT_HEADER_DATE_CLASS = 'e-header-date';
/** @hidden */
const MORE_EVENT_CLOSE_CLASS = 'e-more-event-close';
/** @hidden */
const MORE_EVENT_CONTENT_CLASS = 'e-more-event-content';
/** @hidden */
const MORE_EVENT_WRAPPER_CLASS = 'e-more-appointment-wrapper';
/** @hidden */
const QUICK_DIALOG_CLASS = 'e-quick-dialog';
/** @hidden */
const QUICK_DIALOG_OCCURRENCE_CLASS = 'e-quick-dialog-occurrence-event';
/** @hidden */
const QUICK_DIALOG_SERIES_CLASS = 'e-quick-dialog-series-event';
/** @hidden */
const QUICK_DIALOG_DELETE_CLASS = 'e-quick-dialog-delete';
/** @hidden */
const QUICK_DIALOG_CANCEL_CLASS = 'e-quick-dialog-cancel';
/** @hidden */
const QUICK_DIALOG_ALERT_OK = 'e-quick-alertok';
/** @hidden */
const QUICK_DIALOG_ALERT_CANCEL = 'e-quick-alertcancel';
/** @hidden */
const QUICK_DIALOG_ALERT_BTN_CLASS = 'e-quick-dialog-alert-btn';
/** @hidden */
const EVENT_WINDOW_DIALOG_CLASS = 'e-schedule-dialog';
/** @hidden */
const FORM_CONTAINER_CLASS = 'e-form-container';
/** @hidden */
const FORM_CLASS = 'e-schedule-form';
/** @hidden */
const EVENT_WINDOW_ALLDAY_TZ_DIV_CLASS = 'e-all-day-time-zone-row';
/** @hidden */
const EVENT_WINDOW_ALL_DAY_CLASS = 'e-all-day';
/** @hidden */
const TIME_ZONE_CLASS = 'e-time-zone';
/** @hidden */
const TIME_ZONE_ICON_CLASS = 'e-time-zone-icon';
/** @hidden */
const TIME_ZONE_DETAILS_CLASS = 'e-time-zone-details';
/** @hidden */
const EVENT_WINDOW_REPEAT_DIV_CLASS = 'e-repeat-parent-row';
/** @hidden */
const EVENT_WINDOW_REPEAT_CLASS = 'e-repeat';
/** @hidden */
const EVENT_WINDOW_TITLE_LOCATION_DIV_CLASS = 'e-title-location-row';
/** @hidden */
const SUBJECT_CLASS = 'e-subject';
/** @hidden */
const LOCATION_CLASS = 'e-location';
/** @hidden */
const LOCATION_ICON_CLASS = 'e-location-icon';
/** @hidden */
const LOCATION_DETAILS_CLASS = 'e-location-details';
/** @hidden */
const EVENT_WINDOW_START_END_DIV_CLASS = 'e-start-end-row';
/** @hidden */
const EVENT_WINDOW_START_CLASS = 'e-start';
/** @hidden */
const EVENT_WINDOW_END_CLASS = 'e-end';
/** @hidden */
const EVENT_WINDOW_RESOURCES_DIV_CLASS = 'e-resources-row';
/** @hidden */
const DESCRIPTION_CLASS = 'e-description';
/** @hidden */
const DESCRIPTION_ICON_CLASS = 'e-description-icon';
/** @hidden */
const DESCRIPTION_DETAILS_CLASS = 'e-description-details';
/** @hidden */
const EVENT_WINDOW_TIME_ZONE_DIV_CLASS = 'e-time-zone-row';
/** @hidden */
const EVENT_WINDOW_START_TZ_CLASS = 'e-start-time-zone';
/** @hidden */
const EVENT_WINDOW_END_TZ_CLASS = 'e-end-time-zone';
/** @hidden */
const EVENT_WINDOW_BACK_ICON_CLASS = 'e-back-icon';
/** @hidden */
const EVENT_WINDOW_SAVE_ICON_CLASS = 'e-save-icon';
/** @hidden */
const EVENT_WINDOW_DELETE_BUTTON_CLASS = 'e-event-delete';
/** @hidden */
const EVENT_WINDOW_CANCEL_BUTTON_CLASS = 'e-event-cancel';
/** @hidden */
const EVENT_WINDOW_SAVE_BUTTON_CLASS = 'e-event-save';
/** @hidden */
const EVENT_WINDOW_DIALOG_PARENT_CLASS = 'e-dialog-parent';
/** @hidden */
const EVENT_WINDOW_TITLE_TEXT_CLASS = 'e-title-text';
/** @hidden */
const EVENT_WINDOW_ICON_DISABLE_CLASS = 'e-icon-disable';
/** @hidden */
const EDIT_CLASS = 'e-edit';
/** @hidden */
const EDIT_ICON_CLASS = 'e-edit-icon';
/** @hidden */
const DELETE_CLASS = 'e-delete';
/** @hidden */
const DELETE_ICON_CLASS = 'e-delete-icon';
/** @hidden */
const CLOSE_CLASS = 'e-close';
/** @hidden */
const CLOSE_ICON_CLASS = 'e-close-icon';
/** @hidden */
const ERROR_VALIDATION_CLASS = 'e-schedule-error';
/** @hidden */
const EVENT_TOOLTIP_ROOT_CLASS = 'e-schedule-event-tooltip';
/** @hidden */
const ALLDAY_ROW_ANIMATE_CLASS = 'e-animate';
/** @hidden */
const TIMESCALE_DISABLE = 'e-timescale-disable';
/** @hidden */
const DISABLE_DATE = 'e-disable-date';
/** @hidden */
const HIDDEN_CLASS = 'e-hidden';
/** @hidden */
const POPUP_WRAPPER_CLASS = 'e-quick-popup-wrapper';
/** @hidden */
const POPUP_TABLE_CLASS = 'e-popup-table';
/** @hidden */
const RESOURCE_MENU = 'e-resource-menu';
/** @hidden */
const RESOURCE_MENU_ICON = 'e-icon-menu';
/** @hidden */
const RESOURCE_LEVEL_TITLE = 'e-resource-level-title';
/** @hidden */
const RESOURCE_TREE = 'e-resource-tree';
/** @hidden */
const RESOURCE_TREE_POPUP_OVERLAY = 'e-resource-tree-popup-overlay';
/** @hidden */
const RESOURCE_TREE_POPUP = 'e-resource-tree-popup';
/** @hidden */
const RESOURCE_CLASS = 'e-resource';
/** @hidden */
const RESOURCE_ICON_CLASS = 'e-resource-icon';
/** @hidden */
const RESOURCE_DETAILS_CLASS = 'e-resource-details';
/** @hidden */
const DATE_TIME_ICON_CLASS = 'e-date-time-icon';
/** @hidden */
const VIRTUAL_SCROLL_CLASS = 'e-virtual-scroll';
/** @hidden */
const ICON_DISABLE_CLASS = 'e-icon-disable';
/** @hidden */
const AUTO_HEIGHT = 'e-auto-height';
/** @hidden */
const EVENT_TEMPLATE = 'e-template';

/**
 * Header module
 */
class HeaderRenderer {
    /**
     * Constructor for render module
     */
    constructor(parent) {
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.renderHeader();
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on(documentClick, this.closeHeaderPopup, this);
    }
    removeEventListener() {
        this.parent.off(documentClick, this.closeHeaderPopup);
    }
    closeHeaderPopup(e) {
        let closestEle = closest(e.event.target, '.e-date-range,.e-header-popup,.e-day,.e-selected');
        if (!isNullOrUndefined(closestEle)) {
            return;
        }
        this.hideHeaderPopup();
    }
    /** @hidden */
    hideHeaderPopup() {
        if (this.headerPopup) {
            this.headerPopup.hide();
        }
    }
    renderHeader() {
        this.element = createElement('div', { className: TOOLBAR_CONTAINER });
        let toolbarEle = createElement('div', { className: HEADER_TOOLBAR });
        this.element.appendChild(toolbarEle);
        this.parent.element.insertBefore(this.element, this.parent.element.firstElementChild);
        this.renderToolbar();
    }
    renderToolbar() {
        let items = this.getItems();
        let args = { requestType: 'toolbarItemRendering', items: items };
        this.parent.trigger(actionBegin, args);
        this.toolbarObj = new Toolbar({
            items: args.items,
            overflowMode: 'Popup',
            clicked: this.toolbarClickHandler.bind(this),
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale
        });
        this.toolbarObj.appendTo(this.parent.element.querySelector('.' + HEADER_TOOLBAR));
        let prevNavEle = this.toolbarObj.element.querySelector('.e-prev');
        if (prevNavEle) {
            prevNavEle.firstChild.setAttribute('title', this.l10n.getConstant('previous'));
        }
        let nextNavEle = this.toolbarObj.element.querySelector('.e-next');
        if (nextNavEle) {
            nextNavEle.firstChild.setAttribute('title', this.l10n.getConstant('next'));
        }
        this.updateActiveView();
        this.parent.trigger(actionComplete, { requestType: 'toolBarItemRendered', items: this.toolbarObj.items });
    }
    updateItems() {
        if (this.toolbarObj) {
            let items = this.getItems();
            let args = { requestType: 'toolbarItemRendering', items: items };
            this.parent.trigger(actionBegin, args);
            this.toolbarObj.items = args.items;
            this.toolbarObj.dataBind();
            this.parent.trigger(actionComplete, {
                requestType: 'toolBarItemRendered',
                items: this.toolbarObj.items
            });
        }
    }
    getPopUpRelativeElement() {
        if (this.parent.isAdaptive) {
            return this.toolbarObj.element;
        }
        return this.element.querySelector('.e-date-range');
    }
    setDayOfWeek(index) {
        if (this.headerCalendar) {
            this.headerCalendar.firstDayOfWeek = index;
            this.headerCalendar.dataBind();
        }
    }
    setCalendarDate(date) {
        if (this.headerCalendar) {
            this.headerCalendar.value = date;
            this.headerCalendar.dataBind();
        }
    }
    getCalendarView() {
        if (this.parent.currentView === 'Month' || this.parent.currentView === 'MonthAgenda') {
            return 'Year';
        }
        return 'Month';
    }
    setCalendarView() {
        if (this.headerCalendar) {
            let calendarView = this.getCalendarView();
            this.headerCalendar.depth = calendarView;
            this.headerCalendar.start = calendarView;
            this.headerCalendar.refresh();
        }
    }
    updateActiveView() {
        let selEle = this.toolbarObj.element.querySelectorAll('.e-views');
        removeClass(selEle, ['e-active-view']);
        if (selEle.length > 0 && selEle[this.parent.viewIndex]) {
            addClass([selEle[this.parent.viewIndex]], ['e-active-view']);
        }
    }
    updateDateRange(text) {
        let selEle = this.toolbarObj.element.querySelector('.e-date-range');
        if (selEle) {
            selEle.setAttribute('aria-label', text);
            selEle.querySelector('.e-tbar-btn-text').innerHTML = text;
            this.toolbarObj.refreshOverflow();
        }
    }
    getDateRangeText() {
        return this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM y', calendar: this.parent.getCalendarMode() });
    }
    getItems() {
        let items = [];
        let showInPopup = this.parent.isAdaptive;
        items.push({
            align: 'Left', prefixIcon: 'e-icon-prev', tooltipText: 'Previous', overflow: 'Show',
            cssClass: 'e-prev', htmlAttributes: { 'aria-label': 'previous period' }
        });
        items.push({
            align: 'Left', prefixIcon: 'e-icon-next', tooltipText: 'Next', overflow: 'Show',
            cssClass: 'e-next', htmlAttributes: { 'aria-label': 'next period' }
        });
        items.push({
            align: 'Left', text: this.getDateRangeText(), suffixIcon: 'e-icon-down-arrow', cssClass: 'e-date-range',
            overflow: 'Show', htmlAttributes: { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'title' }
        });
        if (this.parent.isAdaptive) {
            items.push({
                align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-add', text: this.l10n.getConstant('newEvent'),
                cssClass: 'e-add', overflow: 'Show'
            });
            items.push({
                align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-today', text: this.l10n.getConstant('today'),
                cssClass: 'e-today', overflow: 'Show'
            });
        }
        else {
            items.push({
                align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-day', text: this.l10n.getConstant('today'),
                cssClass: 'e-today', overflow: 'Show'
            });
            if (this.parent.views.length > 1) {
                items.push({
                    align: 'Right', type: 'Separator', cssClass: 'e-schedule-seperator'
                });
            }
        }
        if (this.parent.views.length > 1) {
            for (let item of this.parent.views) {
                typeof (item) === 'string' ? items.push(this.getItemObject(item.toLowerCase(), null)) :
                    items.push(this.getItemObject(item.option.toLowerCase(), item.displayName));
            }
        }
        return items;
    }
    getItemObject(viewName, displayName) {
        let view;
        let showInPopup = this.parent.isAdaptive;
        switch (viewName) {
            case 'day':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-day',
                    text: displayName || this.l10n.getConstant('day'), cssClass: 'e-views e-day'
                };
                break;
            case 'week':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-week',
                    text: displayName || this.l10n.getConstant('week'), cssClass: 'e-views e-week'
                };
                break;
            case 'workweek':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-workweek',
                    text: displayName || this.l10n.getConstant('workWeek'), cssClass: 'e-views e-work-week'
                };
                break;
            case 'month':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-month',
                    text: displayName || this.l10n.getConstant('month'), cssClass: 'e-views e-month'
                };
                break;
            case 'agenda':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-agenda', text: this.l10n.getConstant('agenda'),
                    cssClass: 'e-views e-agenda'
                };
                break;
            case 'monthagenda':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-month-agenda',
                    text: this.l10n.getConstant('monthAgenda'), cssClass: 'e-views e-month-agenda'
                };
                break;
            case 'timelineday':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-timeline-day',
                    text: displayName || this.l10n.getConstant('timelineDay'), cssClass: 'e-views e-timeline-day'
                };
                break;
            case 'timelineweek':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-timeline-week',
                    text: displayName || this.l10n.getConstant('timelineWeek'), cssClass: 'e-views e-timeline-week'
                };
                break;
            case 'timelineworkweek':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-timeline-workweek',
                    text: displayName || this.l10n.getConstant('timelineWorkWeek'), cssClass: 'e-views e-timeline-work-week'
                };
                break;
            case 'timelinemonth':
                view = {
                    align: 'Right', showAlwaysInPopup: showInPopup, prefixIcon: 'e-icon-timeline-month',
                    text: displayName || this.l10n.getConstant('timelineMonth'), cssClass: 'e-views e-timeline-month'
                };
                break;
        }
        return view;
    }
    renderHeaderPopup() {
        let headerPopupEle = createElement('div', { className: HEADER_POPUP_CLASS });
        let headerCalendarEle = createElement('div', { className: HEADER_CALENDAR_CLASS });
        headerPopupEle.appendChild(headerCalendarEle);
        this.element.appendChild(headerPopupEle);
        this.headerPopup = new Popup(headerPopupEle, {
            actionOnScroll: 'hide',
            targetType: 'relative',
            relateTo: this.getPopUpRelativeElement(),
            position: { X: 'left', Y: 'bottom' },
            enableRtl: this.parent.enableRtl
        });
        let calendarView = this.getCalendarView();
        this.headerCalendar = new Calendar({
            value: this.parent.selectedDate,
            firstDayOfWeek: this.parent.firstDayOfWeek,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            depth: calendarView,
            start: calendarView,
            calendarMode: this.parent.calendarMode,
            change: this.calendarChange.bind(this)
        });
        this.headerCalendar.appendTo(headerCalendarEle);
        this.headerPopup.hide();
    }
    calendarChange(args) {
        if (args.value.getTime() !== this.parent.selectedDate.getTime()) {
            this.parent.changeDate(args.value);
        }
        this.headerPopup.hide();
    }
    calculateViewIndex(args) {
        let target = closest(args.originalEvent.target, '.e-views');
        let views = [].slice.call(this.element.querySelectorAll('.e-views'));
        return views.indexOf(target);
    }
    toolbarClickHandler(args) {
        if (!args.item) {
            return;
        }
        let strClass = args.item.cssClass.replace('e-views ', '');
        switch (strClass) {
            case 'e-date-range':
                if (!this.headerPopup) {
                    this.renderHeaderPopup();
                }
                if (this.headerPopup.element.classList.contains(POPUP_OPEN)) {
                    this.headerPopup.hide();
                }
                else {
                    this.headerPopup.show();
                }
                break;
            case 'e-day':
                this.parent.changeView('Day', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-week':
                this.parent.changeView('Week', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-work-week':
                this.parent.changeView('WorkWeek', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-month':
                this.parent.changeView('Month', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-agenda':
                this.parent.changeView('Agenda', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            // case 'e-week-agenda':
            //     this.parent.changeView('weekAgenda', args.originalEvent);
            //     break;
            // case 'e-work-week-agenda':
            //     this.parent.changeView('workWeekAgenda', args.originalEvent);
            //     break;
            case 'e-month-agenda':
                this.parent.changeView('MonthAgenda', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-timeline-day':
                this.parent.changeView('TimelineDay', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-timeline-week':
                this.parent.changeView('TimelineWeek', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-timeline-work-week':
                this.parent.changeView('TimelineWorkWeek', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-timeline-month':
                this.parent.changeView('TimelineMonth', args.originalEvent, undefined, this.calculateViewIndex(args));
                break;
            case 'e-today':
                if (!this.parent.isSelectedDate(resetTime(new Date()))) {
                    this.parent.changeDate(resetTime(new Date()), args.originalEvent);
                }
                break;
            case 'e-prev':
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), args.originalEvent);
                break;
            case 'e-next':
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), args.originalEvent);
                break;
            case 'e-add':
                let data;
                let isSameTime = this.parent.activeCellsData.startTime.getTime() === this.parent.activeCellsData.endTime.getTime();
                if (this.parent.activeCellsData && !isSameTime) {
                    data = this.parent.activeCellsData;
                }
                else {
                    let interval = this.parent.activeViewOptions.timeScale.interval;
                    let slotCount = this.parent.activeViewOptions.timeScale.slotCount;
                    let msInterval = (interval * MS_PER_MINUTE) / slotCount;
                    let startTime = new Date(this.parent.selectedDate.getTime());
                    startTime.setHours(new Date().getHours(), (Math.round(startTime.getMinutes() / msInterval) * msInterval), 0);
                    let endTime = new Date(new Date(startTime.getTime()).setMilliseconds(startTime.getMilliseconds() + msInterval));
                    data = { startTime: startTime, endTime: endTime, isAllDay: false };
                }
                this.parent.eventWindow.openEditor(extend(data, { cancel: false, event: args.originalEvent }), 'Add');
                break;
        }
        let toolbarPopUp = this.toolbarObj.element.querySelector('.e-toolbar-pop');
        if (toolbarPopUp) {
            toolbarPopUp.ej2_instances[0].hide({ name: 'SlideUp', duration: 100 });
        }
    }
    getHeaderElement() {
        return this.toolbarObj.element;
    }
    updateHeaderItems(classType) {
        let prevNavEle = this.toolbarObj.element.querySelector('.e-prev');
        let nextNavEle = this.toolbarObj.element.querySelector('.e-next');
        let dateRangeEle = this.toolbarObj.element.querySelector('.e-date-range');
        if (prevNavEle) {
            (classType === 'add') ? addClass([prevNavEle], HIDDEN_CLASS) : removeClass([prevNavEle], HIDDEN_CLASS);
        }
        if (nextNavEle) {
            (classType === 'add') ? addClass([nextNavEle], HIDDEN_CLASS) : removeClass([nextNavEle], HIDDEN_CLASS);
        }
        if (dateRangeEle) {
            (classType === 'add') ? addClass([dateRangeEle], TEXT_ELLIPSIS) : removeClass([dateRangeEle], TEXT_ELLIPSIS);
        }
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'headerbar';
    }
    /**
     * To destroy the headerbar.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.headerPopup) {
            this.headerPopup.destroy();
        }
        if (this.headerCalendar) {
            this.headerCalendar.destroy();
        }
        if (!this.toolbarObj.isDestroyed) {
            this.toolbarObj.destroy();
            this.removeEventListener();
            remove(this.element);
        }
    }
}

/**
 * `Scroll` module
 */
class Scroll {
    /**
     * Constructor for the scrolling.
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'scroll';
    }
    /**
     * @hidden
     */
    setWidth() {
        this.parent.element.style.width = formatUnit(this.parent.width);
    }
    /**
     * @hidden
     */
    setHeight() {
        this.parent.element.style.height = formatUnit(this.parent.height);
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(contentReady, this.setDimensions, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        this.parent.off(contentReady, this.setDimensions);
        this.parent.off(uiUpdate, this.onPropertyChanged);
    }
    /**
     * @hidden
     */
    setDimensions() {
        this.setWidth();
        this.setHeight();
        let data = { cssProperties: this.parent.getCssProperties(), module: this.getModuleName() };
        this.parent.notify(scrollUiUpdate, data);
    }
    /**
     * @hidden
     */
    onPropertyChanged(e) {
        this.setDimensions();
    }
    /**
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * `touch` module is used to handle touch interactions.
 */
class ScheduleTouch {
    constructor(parent) {
        this.parent = parent;
        this.element = this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS);
        this.touchObj = new Touch(this.element, {
            scroll: this.scrollHandler.bind(this),
            swipe: this.swipeHandler.bind(this),
            tapHold: this.tapHoldHandler.bind(this),
            swipeSettings: { swipeThresholdDistance: 1 }
        });
        EventHandler.add(this.element, 'transitionend', this.onTransitionEnd, this);
        this.touchLeftDirection = this.parent.enableRtl ? 'Right' : 'Left';
        this.touchRightDirection = this.parent.enableRtl ? 'Left' : 'Right';
    }
    scrollHandler(e) {
        if (this.parent.currentView === 'Agenda' || this.parent.uiStateValues.action ||
            (e.originalEvent && (e.originalEvent.target.classList.contains(APPOINTMENT_CLASS) ||
                closest(e.originalEvent.target, '.' + APPOINTMENT_CLASS)))) {
            return;
        }
        if (!this.timeStampStart) {
            this.timeStampStart = Date.now();
        }
        if (this.element.classList.contains(TRANSLATE_CLASS)) {
            this.onTransitionEnd();
        }
        if (e.scrollDirection === 'Left' || e.scrollDirection === 'Right') {
            let args = { requestType: 'dateNavigate', cancel: false, event: e.originalEvent };
            this.parent.trigger(actionBegin, args);
            if (args.cancel) {
                return;
            }
            let scrollDiv = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
            if (scrollDiv && scrollDiv.scrollWidth > scrollDiv.clientWidth) {
                return;
            }
            else {
                this.isScrollTriggered = true;
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
            }
        }
        if (e.scrollDirection === this.touchLeftDirection) {
            if (!this.nextPanel) {
                this.renderPanel(NEXT_PANEL_CLASS, 'next');
                this.nextPanel = {
                    element: this.parent.activeView.getPanel(),
                    selectedDate: new Date(this.parent.selectedDate.getTime())
                };
                this.setDimensions(this.nextPanel.element);
            }
            let x = this.parent.enableRtl ? e.distanceX : -e.distanceX;
            this.element.style.transform = 'translatex(' + (this.getTranslateX(this.element) + x) + 'px)';
        }
        else if (e.scrollDirection === this.touchRightDirection) {
            let prevWidth = 0;
            if (!this.previousPanel) {
                this.renderPanel(PREVIOUS_PANEL_CLASS, 'previous');
                this.previousPanel = {
                    element: this.parent.activeView.getPanel(),
                    selectedDate: new Date(this.parent.selectedDate.getTime())
                };
                this.setDimensions(this.previousPanel.element);
                prevWidth = this.previousPanel.element.offsetWidth;
            }
            let x = this.parent.enableRtl ? prevWidth - e.distanceX : -prevWidth + e.distanceX;
            this.element.style.transform = 'translatex(' + (this.getTranslateX(this.element) + x) + 'px)';
        }
    }
    swipeHandler(e) {
        if (!this.isScrollTriggered || this.parent.uiStateValues.action) {
            return;
        }
        this.isScrollTriggered = false;
        if (e.swipeDirection === 'Left' || e.swipeDirection === 'Right') {
            let time = Date.now() - this.timeStampStart;
            let offsetDist = (e.distanceX * (Browser.isDevice ? 6 : 1.66));
            if (offsetDist > time || (e.distanceX > (this.parent.element.offsetWidth / 2))) {
                this.swapPanels(e.swipeDirection);
                if (offsetDist > time && (e.distanceX > (this.parent.element.offsetWidth / 2))) {
                    this.element.style.transitionDuration = ((offsetDist / time) / 10) + 's';
                }
                this.confirmSwipe(e.swipeDirection);
            }
            else {
                this.cancelSwipe();
            }
            let args = { requestType: 'dateNavigate', cancel: false, event: e.originalEvent };
            this.parent.trigger(actionComplete, args);
        }
        else {
            this.cancelSwipe();
        }
        this.timeStampStart = null;
    }
    tapHoldHandler(e) {
        let target = closest(e.originalEvent.target, '.' + APPOINTMENT_CLASS);
        if (!isNullOrUndefined(target) && this.parent.isAdaptive) {
            this.parent.quickPopup.tapHoldEventPopup(e.originalEvent);
            return;
        }
    }
    renderPanel(clsName, nextPrevType) {
        if (!this.currentPanel) {
            this.currentPanel = {
                element: this.parent.activeView.getPanel(),
                selectedDate: new Date(this.parent.selectedDate.getTime())
            };
            this.setDimensions(this.currentPanel.element);
        }
        else {
            this.parent.setProperties({ selectedDate: this.currentPanel.selectedDate }, true);
        }
        this.parent.setProperties({ selectedDate: this.parent.activeView.getNextPreviousDate(nextPrevType) }, true);
        this.parent.activeView.getRenderDates();
        this.parent.activeView.renderLayout(clsName);
    }
    swapPanels(direction) {
        if (direction === this.touchLeftDirection) {
            let temp = this.nextPanel;
            this.nextPanel = this.currentPanel;
            this.currentPanel = temp;
        }
        else {
            let temp = this.previousPanel;
            this.previousPanel = this.currentPanel;
            this.currentPanel = temp;
        }
    }
    confirmSwipe(swipeDirection) {
        let previousDate = swipeDirection === this.touchLeftDirection ? this.nextPanel.selectedDate : this.previousPanel.selectedDate;
        let navArgs = {
            action: 'date', cancel: false, previousDate: previousDate, currentDate: this.currentPanel.selectedDate
        };
        this.parent.trigger(navigating, navArgs);
        if (navArgs.cancel) {
            this.swapPanels(swipeDirection);
            this.cancelSwipe();
            return;
        }
        this.parent.activeView.setPanel(this.currentPanel.element);
        this.parent.setProperties({ selectedDate: this.currentPanel.selectedDate }, true);
        let translateX;
        if (this.parent.enableRtl) {
            translateX = swipeDirection === this.touchLeftDirection ?
                (this.previousPanel ? this.previousPanel.element.offsetLeft : this.currentPanel.element.offsetWidth) : 0;
        }
        else {
            translateX = swipeDirection === this.touchLeftDirection ? -this.currentPanel.element.offsetLeft : 0;
        }
        addClass([this.element], TRANSLATE_CLASS);
        this.element.style.transform = 'translatex(' + (translateX) + 'px)';
        if (this.parent.headerModule) {
            this.parent.headerModule.updateDateRange(this.parent.activeView.getDateRangeText());
        }
        this.parent.renderModule.refreshDataManager();
    }
    cancelSwipe() {
        this.parent.activeView.setPanel(this.currentPanel.element);
        this.parent.setProperties({ selectedDate: this.currentPanel.selectedDate }, true);
        this.parent.activeView.getRenderDates();
        this.parent.activeView.generateColumnLevels();
        addClass([this.element], TRANSLATE_CLASS);
        let prevWidth = this.previousPanel ? this.previousPanel.element.offsetWidth : 0;
        this.element.style.transform = 'translatex(' + (this.parent.enableRtl ? prevWidth : -this.currentPanel.element.offsetLeft) + 'px)';
    }
    onTransitionEnd() {
        removeClass([this.element], TRANSLATE_CLASS);
        this.element.style.transitionDuration = '';
        this.element.style.transform = '';
        if (this.previousPanel) {
            remove(this.previousPanel.element);
            this.previousPanel = null;
            removeClass([this.currentPanel.element], PREVIOUS_PANEL_CLASS);
            addClass([this.currentPanel.element], CURRENT_PANEL_CLASS);
        }
        if (this.nextPanel) {
            remove(this.nextPanel.element);
            this.nextPanel = null;
            removeClass([this.currentPanel.element], NEXT_PANEL_CLASS);
            addClass([this.currentPanel.element], CURRENT_PANEL_CLASS);
        }
        this.currentPanel = null;
        this.parent.activeView.getPanel().style.width = '';
    }
    getTranslateX(element) {
        let style = window.getComputedStyle(element);
        return new WebKitCSSMatrix(style.webkitTransform).m41;
    }
    setDimensions(element) {
        element.style.width = (this.parent.element.clientWidth) + 'px';
    }
    resetValues() {
        this.currentPanel = null;
        this.previousPanel = null;
        this.nextPanel = null;
        this.timeStampStart = null;
        this.element.style.transform = '';
        this.element.innerHTML = '';
        removeClass([this.element], TRANSLATE_CLASS);
    }
    /**
     * @hidden
     */
    destroy() {
        this.touchObj.destroy();
        EventHandler.remove(this.element, 'transitionend', this.onTransitionEnd);
        this.resetValues();
    }
}

/**
 * Keyboard interaction
 */
class KeyboardInteraction {
    constructor(parent) {
        this.selectedCells = [];
        this.keyConfigs = {
            downArrow: 'downarrow',
            upArrow: 'uparrow',
            rightArrow: 'rightarrow',
            leftArrow: 'leftarrow',
            shiftDownArrow: 'shift+downarrow',
            shiftUpArrow: 'shift+uparrow',
            shiftRightArrow: 'shift+rightarrow',
            shiftLeftArrow: 'shift+leftarrow',
            ctrlLeftArrow: 'ctrl+leftarrow',
            ctrlRightArrow: 'ctrl+rightarrow',
            altOne: 'alt+1',
            altTwo: 'alt+2',
            altThree: 'alt+3',
            altFour: 'alt+4',
            altFive: 'alt+5',
            altSix: 'alt+6',
            enter: 'enter',
            escape: 'escape',
            delete: 'delete',
            home: 'home',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            tab: 'tab',
            shiftTab: 'shift+tab'
        };
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.keyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
        this.addEventListener();
    }
    keyActionHandler(e) {
        switch (e.action) {
            case 'downArrow':
            case 'shiftDownArrow':
                this.processDown(e, e.shiftKey);
                break;
            case 'upArrow':
            case 'shiftUpArrow':
                this.processUp(e, e.shiftKey);
                break;
            case 'leftArrow':
            case 'shiftLeftArrow':
                this.processLeft(e, e.shiftKey);
                break;
            case 'rightArrow':
            case 'shiftRightArrow':
                this.processRight(e, e.shiftKey);
                break;
            case 'ctrlLeftArrow':
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                if (this.parent.headerModule) {
                    this.parent.headerModule.element.querySelector('.e-prev button').focus();
                }
                break;
            case 'ctrlRightArrow':
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                if (this.parent.headerModule) {
                    this.parent.headerModule.element.querySelector('.e-next button').focus();
                }
                break;
            case 'altOne':
            case 'altTwo':
            case 'altThree':
            case 'altFour':
            case 'altFive':
            case 'altSix':
                this.processViewNavigation(e);
                break;
            case 'enter':
                this.processEnter(e);
                break;
            case 'home':
                this.focusFirstCell();
                break;
            case 'tab':
            case 'shiftTab':
                this.processTab(e, e.shiftKey);
                break;
            case 'delete':
                this.processDelete(e);
                break;
            case 'escape':
                this.processEscape();
        }
    }
    addEventListener() {
        this.parent.on(cellMouseDown, this.onCellMouseDown, this);
    }
    removeEventListener() {
        this.parent.off(cellMouseDown, this.onCellMouseDown);
    }
    onCellMouseDown(e) {
        if (e.event.shiftKey) {
            return;
        }
        this.initialTarget = this.getClosestCell(e.event);
        if (this.parent.activeViewOptions.readonly || this.parent.currentView === 'MonthAgenda' || !this.initialTarget) {
            return;
        }
        if (e.event.target.classList.contains(WORK_CELLS_CLASS)) {
            this.parent.removeSelectedClass();
            EventHandler.add(this.parent.getContentTable(), 'mousemove', this.onMouseSelection, this);
            EventHandler.add(this.parent.getContentTable(), 'mouseup', this.onMoveup, this);
        }
        if (e.event.target.classList.contains(ALLDAY_CELLS_CLASS)) {
            this.parent.removeSelectedClass();
            let allDayRow = this.parent.getAllDayRow();
            EventHandler.add(allDayRow, 'mousemove', this.onMouseSelection, this);
            EventHandler.add(allDayRow, 'mouseup', this.onMoveup, this);
        }
    }
    onMouseSelection(e) {
        let selectionEdges = this.parent.boundaryValidation(e.pageY, e.pageX);
        if (selectionEdges.bottom || selectionEdges.top || selectionEdges.left || selectionEdges.right) {
            let parent = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
            let yInBounds = parent.offsetHeight <= parent.scrollHeight && parent.scrollTop >= 0 &&
                parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
            let xInBounds = parent.offsetWidth <= parent.scrollWidth && parent.scrollLeft >= 0 &&
                parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
            if (yInBounds && (selectionEdges.top || selectionEdges.bottom)) {
                parent.scrollTop += selectionEdges.top ?
                    -e.target.offsetHeight : e.target.offsetHeight;
            }
            if (xInBounds && (selectionEdges.left || selectionEdges.right)) {
                parent.scrollLeft += selectionEdges.left ?
                    -e.target.offsetWidth : e.target.offsetWidth;
            }
        }
        let target = this.getClosestCell(e);
        if (target) {
            this.selectCells(true, target);
        }
    }
    getClosestCell(e) {
        return closest(e.target, '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS);
    }
    onMoveup(e) {
        if (e.target.classList.contains(WORK_CELLS_CLASS)) {
            EventHandler.remove(this.parent.getContentTable(), 'mousemove', this.onMouseSelection);
            EventHandler.remove(this.parent.getContentTable(), 'mouseup', this.onMoveup);
        }
        if (e.target.classList.contains(ALLDAY_CELLS_CLASS)) {
            let allDayRow = this.parent.getAllDayRow();
            EventHandler.remove(allDayRow, 'mousemove', this.onMouseSelection);
            EventHandler.remove(allDayRow, 'mouseup', this.onMoveup);
        }
        if (this.isPreventAction(e)) {
            return;
        }
        let selectedCells = [].slice.call(this.parent.element.querySelectorAll('.e-selected-cell'));
        let queryStr = '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS + ',.' + HEADER_CELLS_CLASS;
        let target = closest(e.target, queryStr);
        this.parent.activeCellsData = this.parent.getCellDetails((selectedCells.length > 1) ? this.parent.getSelectedElements() : target);
        let cellData = {};
        this.parent.eventWindow.convertToEventData(this.parent.activeCellsData, cellData);
        let args = {
            data: cellData,
            element: this.parent.activeCellsData.element,
            showQuickPopup: false, event: e,
            requestType: 'cellSelect'
        };
        this.parent.trigger(select, args);
        if (args.showQuickPopup) {
            let cellArgs = extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellClick' });
            this.parent.notify(cellClick, cellArgs);
        }
    }
    processEnter(e) {
        if (this.parent.activeViewOptions.readonly || this.isPreventAction(e)) {
            return;
        }
        let target = (e.target);
        if (closest(target, '.' + POPUP_WRAPPER_CLASS)) {
            if (target.classList.contains(QUICK_POPUP_EVENT_DETAILS_CLASS) ||
                target.classList.contains(EVENT_CREATE_CLASS) ||
                target.classList.contains(EDIT_EVENT_CLASS) ||
                target.classList.contains(DELETE_EVENT_CLASS) ||
                target.classList.contains(CLOSE_CLASS)) {
                target.click();
                e.preventDefault();
            }
            else if (target.classList.contains(SUBJECT_CLASS)) {
                this.parent.element.querySelector('.' + EVENT_CREATE_CLASS).click();
                e.preventDefault();
            }
            return;
        }
        if (target.classList.contains(WORK_CELLS_CLASS) || target.classList.contains(ALLDAY_CELLS_CLASS)) {
            if (this.selectedCells.length > 1) {
                let start = this.parent.getCellDetails(this.selectedCells[0]);
                let end = this.parent.getCellDetails(this.selectedCells[this.selectedCells.length - 1]);
                start.endTime = end.endTime;
                start.element = target;
                this.parent.activeCellsData = start;
            }
            else {
                this.parent.activeCellsData = this.parent.getCellDetails(target);
            }
            let args = extend(this.parent.activeCellsData, { cancel: false, event: e });
            this.parent.notify(cellClick, args);
            return;
        }
        if (target.classList.contains(APPOINTMENT_CLASS) || target.classList.contains(MORE_EVENT_CLOSE_CLASS) ||
            target.classList.contains(ALLDAY_APPOINTMENT_SECTION_CLASS) || target.classList.contains(MORE_INDICATOR_CLASS)) {
            target.click();
            return;
        }
        if (target.classList.contains(MORE_EVENT_HEADER_DATE_CLASS)) {
            this.parent.setProperties({ selectedDate: new Date(parseInt(target.getAttribute('data-date'), 10)) }, true);
            this.parent.changeView(this.parent.getNavigateView(), e);
            this.processEscape();
            return;
        }
    }
    getCells(isInverseTable, start, end) {
        let tableEle = this.parent.getContentTable();
        let cells = [].slice.call(tableEle.querySelectorAll('td'));
        let maxRow = tableEle.rows.length;
        let maxColumn = tableEle.rows[0].cells.length;
        if (start.classList.contains(ALLDAY_CELLS_CLASS)) {
            let allDayRow = this.parent.getAllDayRow();
            cells = [].slice.call(allDayRow.cells);
            maxRow = 1;
            maxColumn = allDayRow.cells.length;
        }
        let startIndex = cells.indexOf(start);
        let endIndex = cells.indexOf(end);
        let inverseCells = [];
        if (isInverseTable) {
            for (let i = 0; i < maxColumn; i++) {
                for (let j = 0; j < maxRow; j++) {
                    inverseCells.push(cells[maxColumn * j + i]);
                }
            }
            startIndex = inverseCells.indexOf(start);
            endIndex = inverseCells.indexOf(end);
        }
        if (startIndex > endIndex) {
            let temp = startIndex;
            startIndex = endIndex;
            endIndex = temp;
        }
        let sCells = isInverseTable ? inverseCells : cells;
        return sCells.slice(startIndex, endIndex + 1);
    }
    focusFirstCell() {
        if (this.parent.currentView === 'Agenda') {
            let focusCell = this.parent.getContentTable().querySelector('.' + AGENDA_CELLS_CLASS);
            focusCell.setAttribute('tabindex', '0');
            focusCell.focus();
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        if (this.parent.activeView.isTimelineView()) {
            let cell = this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS +
                ' tr:not(.' + HIDDEN_CLASS + ') .' + WORK_CELLS_CLASS + ':not(.' + RESOURCE_GROUP_CELLS_CLASS + ')');
            this.selectCells(false, cell);
        }
        else {
            this.selectCells(false, this.parent.getWorkCellElements()[0]);
        }
    }
    isInverseTableSelect() {
        return this.parent.activeView.isInverseTableSelect;
    }
    /** @hidden */
    selectCells(isMultiple, targetCell) {
        this.parent.removeSelectedClass();
        let target = (targetCell instanceof Array) ? targetCell.slice(-1)[0] : targetCell;
        if (isMultiple) {
            let initialId;
            let selectedCells = this.getCells(this.isInverseTableSelect(), this.initialTarget, target);
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                initialId = this.initialTarget.getAttribute('data-group-index');
                let resourceSelectedCells = [];
                for (let i = 0; i < selectedCells.length; i++) {
                    if (selectedCells[i].getAttribute('data-group-index') === initialId) {
                        resourceSelectedCells.push(selectedCells[i]);
                    }
                }
                selectedCells = resourceSelectedCells;
            }
            this.selectedCells = selectedCells;
            if (selectedCells.length > 2 && !target.classList.contains(ALLDAY_CELLS_CLASS)) {
                let allDayCells = this.getAllDayCells(selectedCells);
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    let resourceAllDayCells = [];
                    for (let i = 0; i < allDayCells.length; i++) {
                        if (allDayCells[i].getAttribute('data-group-index') === initialId) {
                            resourceAllDayCells.push(allDayCells[i]);
                        }
                    }
                    allDayCells = resourceAllDayCells;
                }
                selectedCells = selectedCells.concat(allDayCells);
            }
            if ((target.getAttribute('data-group-index') !== initialId) && this.parent.activeViewOptions.group.resources.length > 0) {
                target = this.selectedCells[this.selectedCells.length - 1];
            }
            this.parent.addSelectedClass(selectedCells, target);
        }
        else {
            this.initialTarget = target;
            this.selectedCells = [target];
            this.parent.addSelectedClass([target], target);
        }
    }
    selectAppointment(isReverse, target) {
        let appointments = this.getAppointmentElements();
        if (appointments.length < 0) {
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        let nextAppEle;
        if (target.classList.contains(APPOINTMENT_CLASS)) {
            let targetIndex = appointments.indexOf(target);
            nextAppEle = appointments[(isReverse ? targetIndex - 1 : targetIndex + 1)];
        }
        else {
            nextAppEle = isReverse ? appointments[appointments.length - 1] : appointments[0];
        }
        if (nextAppEle) {
            this.parent.eventBase.addSelectedAppointments([nextAppEle]);
            nextAppEle.focus();
            addClass([nextAppEle], AGENDA_SELECTED_CELL);
        }
    }
    selectAppointmentElementFromWorkCell(isReverse, target) {
        this.parent.eventBase.removeSelectedAppointmentClass();
        this.parent.removeSelectedClass();
        if (target.classList.contains(WORK_CELLS_CLASS) || target.classList.contains(ALLDAY_CELLS_CLASS)) {
            let appointmentElements = this.getUniqueAppointmentElements();
            let filteredElements = [];
            let selectedDate = parseInt(target.getAttribute('data-date'), 10);
            let selectedSeriesEvents = this.parent.eventsProcessed.filter((eventObject) => {
                return (!isReverse ? (eventObject[this.parent.eventFields.startTime].getTime() >= selectedDate) :
                    (eventObject[this.parent.eventFields.startTime].getTime() <= selectedDate));
            });
            selectedSeriesEvents.filter((event) => {
                appointmentElements.filter((element) => {
                    if (JSON.stringify(event.Guid) === JSON.stringify(element.getAttribute('data-guid'))) {
                        filteredElements.push(element);
                    }
                });
            });
            if (filteredElements.length > 0) {
                let selectedElement = isReverse ? filteredElements[filteredElements.length - 1] : filteredElements[0];
                let focusElements = this.getAppointmentElementsByGuid(selectedElement.getAttribute('data-guid'));
                this.parent.eventBase.addSelectedAppointments(focusElements);
                (focusElements[focusElements.length - 1]).focus();
            }
        }
    }
    getAllDayCells(cells) {
        let allDayRow = this.parent.getAllDayRow();
        if (!allDayRow) {
            return [];
        }
        let startCell = cells[0];
        let endCell = cells[cells.length - 1];
        let start = this.parent.getCellDetails(startCell);
        let end = this.parent.getCellDetails(endCell);
        if (end.endTime.getTime() - start.startTime.getTime() >= MS_PER_DAY) {
            let allDayCells = [].slice.call(allDayRow.cells);
            return allDayCells.slice(startCell.cellIndex, endCell.cellIndex + 1);
        }
        return [];
    }
    getAppointmentElements() {
        return [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
    }
    getAppointmentElementsByGuid(guid) {
        return [].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]'));
    }
    getUniqueAppointmentElements() {
        let appointments = this.getAppointmentElements();
        let appointmentElements = [];
        appointments.map((value) => {
            return value.getAttribute('data-guid');
        }).filter((value, index, self) => {
            if (self.indexOf(value) === index) {
                appointmentElements.push(appointments[index]);
            }
        });
        return appointmentElements;
    }
    getWorkCellFromAppointmentElement(target) {
        let selectedObject = this.parent.eventBase.getEventByGuid(target.getAttribute('data-guid'));
        return this.parent.eventBase.selectWorkCellByTime([selectedObject]);
    }
    processViewNavigation(e) {
        let index = parseInt(e.key, 10) - 1;
        if (index < this.parent.views.length) {
            let view = this.parent.viewCollections[index].option;
            this.parent.changeView(view, e, undefined, index);
            if (this.parent.headerModule) {
                this.parent.headerModule.element.querySelector('.e-active-view button').focus();
            }
        }
    }
    processUp(e, isMultiple) {
        if ((isMultiple && (this.parent.activeView.isTimelineView() || this.parent.currentView === 'MonthAgenda'))) {
            return;
        }
        let target = (e.target);
        let selectedElements = this.parent.getSelectedElements();
        let selectedEventElements = this.parent.eventBase.getSelectedAppointments();
        let moreEventWrapper = this.parent.element.querySelector('.' + MORE_POPUP_WRAPPER_CLASS);
        let quickPopupWrapper = this.getQuickPopupElement();
        if (selectedElements.length > 0 && !e.target.classList.contains(WORK_CELLS_CLASS)) {
            target = selectedElements[selectedElements.length - 1];
        }
        if (selectedEventElements.length > 0 && !moreEventWrapper.classList.contains(POPUP_OPEN) &&
            !quickPopupWrapper.classList.contains(POPUP_OPEN) &&
            ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.parent.currentView) !== -1) {
            target = this.getWorkCellFromAppointmentElement(selectedEventElements[selectedEventElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        if (!target) {
            return;
        }
        if (target.classList.contains(WORK_CELLS_CLASS) && !this.parent.element.querySelector('.' + POPUP_OPEN)) {
            let tableRows = this.parent.getTableRows();
            let curRowIndex = tableRows.indexOf(target.parentElement);
            if (curRowIndex > 0 && curRowIndex < tableRows.length) {
                this.selectCells(isMultiple, (tableRows[curRowIndex - 1]).cells[target.cellIndex]);
            }
        }
        else if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            this.selectAppointment(true, target);
        }
    }
    processDown(e, isMultiple) {
        if ((isMultiple && (this.parent.activeView.isTimelineView() || this.parent.currentView === 'MonthAgenda'))) {
            return;
        }
        let target = (e.target);
        let selectedCells = this.parent.getSelectedElements();
        let selectedElements = this.parent.eventBase.getSelectedAppointments();
        let moreEventWrapper = this.parent.element.querySelector('.' + MORE_POPUP_WRAPPER_CLASS);
        let quickPopupWrapper = this.getQuickPopupElement();
        if (selectedCells.length > 0 && !e.target.classList.contains(WORK_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
        }
        if (selectedElements.length > 0 && !moreEventWrapper.classList.contains(POPUP_OPEN) &&
            !quickPopupWrapper.classList.contains(POPUP_OPEN) &&
            ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.parent.currentView) !== -1) {
            target = this.getWorkCellFromAppointmentElement(selectedElements[selectedElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        let tableRows = this.parent.getTableRows();
        if (!target) {
            return;
        }
        if (target.classList.contains(WORK_CELLS_CLASS) && !this.parent.element.querySelector('.' + POPUP_OPEN)) {
            let curRowIndex = tableRows.indexOf(target.parentElement);
            if (curRowIndex >= 0 && curRowIndex < tableRows.length - 1) {
                this.selectCells(isMultiple, (tableRows[curRowIndex + 1]).cells[target.cellIndex]);
            }
        }
        else if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            this.selectAppointment(false, target);
        }
    }
    processLeftRight(target) {
        let tableEle = this.parent.getContentTable();
        let curRowIndex = target.parentNode.sectionRowIndex;
        let key = {
            element: tableEle,
            rowIndex: curRowIndex,
            columnIndex: target.cellIndex,
            maxIndex: tableEle.rows[curRowIndex].cells.length
        };
        return key;
    }
    getQuickPopupElement() {
        return (this.parent.isAdaptive ? document.body : this.parent.element).querySelector('.' + POPUP_WRAPPER_CLASS);
    }
    isCancelLeftRightAction(e, isMultiple) {
        if (this.parent.currentView === 'Agenda' || (isMultiple && this.parent.currentView === 'MonthAgenda')) {
            return true;
        }
        if ((this.isPreventAction(e) && isMultiple)) {
            return true;
        }
        let moreEventWrapper = this.parent.element.querySelector('.' + MORE_POPUP_WRAPPER_CLASS);
        let quickPopupWrapper = this.getQuickPopupElement();
        if (moreEventWrapper.classList.contains(POPUP_OPEN) || quickPopupWrapper.classList.contains(POPUP_OPEN)) {
            return true;
        }
        return false;
    }
    processRight(e, isMultiple) {
        if (this.isCancelLeftRightAction(e, isMultiple)) {
            return;
        }
        let selectedCells = this.parent.getSelectedElements();
        let targetCell;
        let selectedAppointments = this.parent.eventBase.getSelectedAppointments();
        let target = (e.target);
        if (selectedCells.length > 0 && !target.classList.contains(WORK_CELLS_CLASS) &&
            !target.classList.contains(ALLDAY_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
        }
        if (selectedAppointments.length > 0) {
            target = this.getWorkCellFromAppointmentElement(selectedAppointments[selectedAppointments.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!target) {
                return;
            }
        }
        if (target.classList.contains(WORK_CELLS_CLASS)) {
            let key = this.processLeftRight(target);
            if (key.columnIndex >= 0 && key.columnIndex < key.maxIndex - 1) {
                targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex].cells[target.cellIndex + 1], 'right');
                if (!isNullOrUndefined(targetCell)) {
                    this.selectCells(isMultiple, targetCell);
                }
            }
            else if (key.columnIndex === key.maxIndex - 1) {
                if (!this.isInverseTableSelect() && key.rowIndex < key.element.rows.length - 1) {
                    targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex + 1].cells[0], 'right');
                    if (!isNullOrUndefined(targetCell)) {
                        this.selectCells(isMultiple, targetCell);
                    }
                }
                else if (!isMultiple) {
                    let rowIndex = this.isInverseTableSelect() ? key.rowIndex : 0;
                    this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                    let tableEle = this.parent.getContentTable();
                    this.selectCells(false, tableEle.rows[rowIndex].cells[0]);
                }
            }
        }
        else if (target.classList.contains(ALLDAY_CELLS_CLASS)) {
            let curColIndex = target.cellIndex;
            let allDayRow = this.parent.getAllDayRow();
            let maxColIndex = allDayRow.cells.length;
            if (curColIndex >= 0 && curColIndex < maxColIndex - 1) {
                this.selectCells(isMultiple, allDayRow.cells[curColIndex + 1]);
            }
            else if (curColIndex === maxColIndex - 1 && !isMultiple) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                let allDayRow = this.parent.getAllDayRow();
                this.selectCells(false, allDayRow.cells[0]);
            }
        }
    }
    processLeft(e, isMultiple) {
        if (this.isCancelLeftRightAction(e, isMultiple)) {
            return;
        }
        let target = (e.target);
        let selectedCells = this.parent.getSelectedElements();
        let targetCell;
        if (selectedCells.length > 0 && !target.classList.contains(WORK_CELLS_CLASS) &&
            !target.classList.contains(ALLDAY_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
        }
        let selectedElements = this.parent.eventBase.getSelectedAppointments();
        if (selectedElements.length > 0) {
            target = this.getWorkCellFromAppointmentElement(selectedElements[selectedElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!target) {
                return;
            }
        }
        if (target.classList.contains(WORK_CELLS_CLASS)) {
            let key = this.processLeftRight(target);
            if (key.columnIndex > 0 && key.columnIndex < key.maxIndex) {
                targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex].cells[target.cellIndex - 1], 'left');
                if (!isNullOrUndefined(targetCell)) {
                    this.selectCells(isMultiple, targetCell);
                }
            }
            else if (key.columnIndex === 0) {
                if (!this.isInverseTableSelect() && key.rowIndex > 0) {
                    targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex - 1].cells[key.maxIndex - 1], 'left');
                    if (!isNullOrUndefined(targetCell)) {
                        this.selectCells(isMultiple, targetCell);
                    }
                }
                else if (!isMultiple) {
                    this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                    let tableEle = this.parent.getContentTable();
                    let rowIndex = this.isInverseTableSelect() ? key.rowIndex : tableEle.rows.length - 1;
                    this.selectCells(false, tableEle.rows[rowIndex].cells[key.maxIndex - 1]);
                }
            }
        }
        else if (target.classList.contains(ALLDAY_CELLS_CLASS)) {
            let curColIndex = target.cellIndex;
            let allDayRow = this.parent.getAllDayRow();
            let maxColIndex = allDayRow.cells.length;
            if (curColIndex > 0 && curColIndex < maxColIndex) {
                this.selectCells(isMultiple, allDayRow.cells[curColIndex - 1]);
            }
            else if (curColIndex === 0 && !isMultiple) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                let allDayRow = this.parent.getAllDayRow();
                this.selectCells(false, allDayRow.cells[maxColIndex - 1]);
            }
        }
    }
    calculateNextPrevDate(currentCell, target, type) {
        let initialId = this.initialTarget.getAttribute('data-group-index');
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.currentView === 'Month') {
            if (currentCell && target && target.getAttribute('data-group-index') !== initialId) {
                let currentDate = new Date(parseInt(currentCell.getAttribute('data-date'), 10));
                let nextPrevDate = (type === 'right') ? new Date(currentDate.setDate(currentDate.getDate() + 1))
                    : new Date(currentDate.setDate(currentDate.getDate() - 1));
                target = [].slice.call(this.parent.element.querySelectorAll('td[data-date="'
                    + nextPrevDate.getTime().toString() + '"]' + '[data-group-index="' + initialId + '"]'))[0];
            }
        }
        return target;
    }
    getFocusableElements(container) {
        let queryString = 'a[href]:not([tabindex="-1"]),input:not([disabled]):not([tabindex="-1"]),' +
            'textarea:not([disabled]):not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"]),' +
            'select:not([disabled]):not([tabindex="-1"]),[tabindex]:not([tabindex="-1"]),[contentEditable=true]:not([tabindex="-1"])';
        return [].slice.call(container.querySelectorAll(queryString));
    }
    processTabOnPopup(e, popupElement) {
        let focusableElements = this.getFocusableElements(popupElement);
        focusableElements = focusableElements.filter((element) => {
            let footerEle = this.parent.element.querySelector('.' + POPUP_FOOTER_CLASS);
            if (footerEle && footerEle.offsetParent) {
                return !(element.classList.contains(EDIT_CLASS) || element.classList.contains(DELETE_CLASS));
            }
            else {
                return !(element.classList.contains(EDIT_EVENT_CLASS) || element.classList.contains(DELETE_EVENT_CLASS));
            }
        });
        let firstEle = focusableElements[0];
        let lastEle = focusableElements[focusableElements.length - 1];
        if (!isNullOrUndefined(lastEle) && document.activeElement === lastEle && !e.shiftKey) {
            e.preventDefault();
            firstEle.focus();
        }
        if (!isNullOrUndefined(firstEle) && document.activeElement === firstEle && e.shiftKey) {
            e.preventDefault();
            lastEle.focus();
        }
    }
    processTab(e, isReverse) {
        let target = e.target;
        let popupWrapper = closest(target, '.' + POPUP_WRAPPER_CLASS + ',.' + MORE_POPUP_WRAPPER_CLASS);
        if (popupWrapper && popupWrapper.classList.contains(POPUP_OPEN)) {
            if (popupWrapper.classList.contains(MORE_POPUP_WRAPPER_CLASS)) {
                this.parent.eventBase.removeSelectedAppointmentClass();
            }
            this.processTabOnPopup(e, popupWrapper);
            return;
        }
        if (target.classList.contains(ROOT)) {
            this.parent.eventBase.removeSelectedAppointmentClass();
            return;
        }
        if (target.classList.contains(APPOINTMENT_CLASS)) {
            let appointments = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
            let selectedAppointments = this.parent.eventBase.getSelectedAppointments();
            if (selectedAppointments.length > 0) {
                target = selectedAppointments[selectedAppointments.length - 1];
            }
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!isReverse && target.getAttribute('data-guid') === appointments[appointments.length - 1].getAttribute('data-guid') ||
                isReverse && target.getAttribute('data-guid') === appointments[0].getAttribute('data-guid')) {
                return;
            }
            if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
                this.selectAppointment(isReverse, target);
                e.preventDefault();
            }
            return;
        }
        let selectedCells = this.parent.getSelectedElements();
        if (selectedCells.length > 0 && !target.classList.contains(APPOINTMENT_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
            this.selectAppointmentElementFromWorkCell(isReverse, target);
            e.preventDefault();
            return;
        }
    }
    processDelete(e) {
        if (document.activeElement.classList.contains(APPOINTMENT_CLASS)) {
            addClass([document.activeElement], APPOINTMENT_BORDER);
            this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
            this.parent.quickPopup.deleteClick();
        }
    }
    processEscape() {
        this.parent.quickPopup.onClosePopup();
        this.parent.quickPopup.morePopup.hide();
        if (this.parent.headerModule) {
            this.parent.headerModule.hideHeaderPopup();
        }
    }
    isPreventAction(e) {
        let target = closest(e.target, '.' + RESOURCE_GROUP_CELLS_CLASS);
        if (this.parent.activeView.isTimelineView() && !isNullOrUndefined(target)) {
            return true;
        }
        return false;
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
        this.removeEventListener();
        this.keyboardModule.destroy();
    }
}

/**
 * data module is used to generate query and data source.
 * @hidden
 */
class Data {
    /**
     * Constructor for data module
     * @private
     */
    constructor(dataSource, query) {
        this.initDataManager(dataSource, query);
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
    generateQuery(startDate, endDate) {
        let query = this.query.clone();
        if (startDate) {
            query.addParams('StartDate', startDate.toISOString());
        }
        if (endDate) {
            query.addParams('EndDate', endDate.toISOString());
        }
        return query;
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
}

/**
 * Time zone
 */
class Timezone {
    offset(date, timezone) {
        let localOffset = date.getTimezoneOffset();
        try {
            let convertedDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
            if (!isNaN(convertedDate.getTime())) {
                return ((date.getTime() - convertedDate.getTime()) / 60000) + localOffset;
            }
            return 0;
        }
        catch (error) {
            return 0;
        }
    }
    convert(date, fromOffset, toOffset) {
        if (typeof fromOffset === 'string') {
            fromOffset = this.offset(date, fromOffset);
        }
        if (typeof toOffset === 'string') {
            toOffset = this.offset(date, toOffset);
        }
        let fromLocalOffset = date.getTimezoneOffset();
        date = new Date(date.getTime() + (fromOffset - toOffset) * 60000);
        let toLocalOffset = date.getTimezoneOffset();
        return new Date(date.getTime() + (toLocalOffset - fromLocalOffset) * 60000);
    }
    add(date, timezone) {
        return this.convert(date, date.getTimezoneOffset(), timezone);
    }
    remove(date, timezone) {
        return this.convert(date, timezone, date.getTimezoneOffset());
    }
    removeLocalOffset(date) {
        return new Date(+date - (date.getTimezoneOffset() * 60000));
    }
    getLocalTimezoneName() {
        return window.Intl ?
            Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' : 'UTC';
    }
}
let timezoneData = [
    { Value: 'Pacific/Niue', Text: '(UTC-11:00) Niue' },
    { Value: 'Pacific/Pago_Pago', Text: '(UTC-11:00) Pago Pago' },
    { Value: 'Pacific/Honolulu', Text: '(UTC-10:00) Hawaii Time' },
    { Value: 'Pacific/Rarotonga', Text: '(UTC-10:00) Rarotonga' },
    { Value: 'Pacific/Tahiti', Text: '(UTC-10:00) Tahiti' },
    { Value: 'Pacific/Marquesas', Text: '(UTC-09:30) Marquesas' },
    { Value: 'America/Anchorage', Text: '(UTC-09:00) Alaska Time' },
    { Value: 'Pacific/Gambier', Text: '(UTC-09:00) Gambier' },
    { Value: 'America/Los_Angeles', Text: '(UTC-08:00) Pacific Time' },
    { Value: 'America/Tijuana', Text: '(UTC-08:00) Pacific Time - Tijuana' },
    { Value: 'America/Vancouver', Text: '(UTC-08:00) Pacific Time - Vancouver' },
    { Value: 'America/Whitehorse', Text: '(UTC-08:00) Pacific Time - Whitehorse' },
    { Value: 'Pacific/Pitcairn', Text: '(UTC-08:00) Pitcairn' },
    { Value: 'America/Denver', Text: '(UTC-07:00) Mountain Time' },
    { Value: 'America/Phoenix', Text: '(UTC-07:00) Mountain Time - Arizona' },
    { Value: 'America/Mazatlan', Text: '(UTC-07:00) Mountain Time - Chihuahua, Mazatlan' },
    { Value: 'America/Dawson_Creek', Text: '(UTC-07:00) Mountain Time - Dawson Creek' },
    { Value: 'America/Edmonton', Text: '(UTC-07:00) Mountain Time - Edmonton' },
    { Value: 'America/Hermosillo', Text: '(UTC-07:00) Mountain Time - Hermosillo' },
    { Value: 'America/Yellowknife', Text: '(UTC-07:00) Mountain Time - Yellowknife' },
    { Value: 'America/Belize', Text: '(UTC-06:00) Belize' },
    { Value: 'America/Chicago', Text: '(UTC-06:00) Central Time' },
    { Value: 'America/Mexico_City', Text: '(UTC-06:00) Central Time - Mexico City' },
    { Value: 'America/Regina', Text: '(UTC-06:00) Central Time - Regina' },
    { Value: 'America/Tegucigalpa', Text: '(UTC-06:00) Central Time - Tegucigalpa' },
    { Value: 'America/Winnipeg', Text: '(UTC-06:00) Central Time - Winnipeg' },
    { Value: 'America/Costa_Rica', Text: '(UTC-06:00) Costa Rica' },
    { Value: 'America/El_Salvador', Text: '(UTC-06:00) El Salvador' },
    { Value: 'Pacific/Galapagos', Text: '(UTC-06:00) Galapagos' },
    { Value: 'America/Guatemala', Text: '(UTC-06:00) Guatemala' },
    { Value: 'America/Managua', Text: '(UTC-06:00) Managua' },
    { Value: 'America/Cancun', Text: '(UTC-05:00) America Cancun' },
    { Value: 'America/Bogota', Text: '(UTC-05:00) Bogota' },
    { Value: 'Pacific/Easter', Text: '(UTC-05:00) Easter Island' },
    { Value: 'America/New_York', Text: '(UTC-05:00) Eastern Time' },
    { Value: 'America/Iqaluit', Text: '(UTC-05:00) Eastern Time - Iqaluit' },
    { Value: 'America/Toronto', Text: '(UTC-05:00) Eastern Time - Toronto' },
    { Value: 'America/Guayaquil', Text: '(UTC-05:00) Guayaquil' },
    { Value: 'America/Havana', Text: '(UTC-05:00) Havana' },
    { Value: 'America/Jamaica', Text: '(UTC-05:00) Jamaica' },
    { Value: 'America/Lima', Text: '(UTC-05:00) Lima' },
    { Value: 'America/Nassau', Text: '(UTC-05:00) Nassau' },
    { Value: 'America/Panama', Text: '(UTC-05:00) Panama' },
    { Value: 'America/Port-au-Prince', Text: '(UTC-05:00) Port-au-Prince' },
    { Value: 'America/Rio_Branco', Text: '(UTC-05:00) Rio Branco' },
    { Value: 'America/Halifax', Text: '(UTC-04:00) Atlantic Time - Halifax' },
    { Value: 'America/Barbados', Text: '(UTC-04:00) Barbados' },
    { Value: 'Atlantic/Bermuda', Text: '(UTC-04:00) Bermuda' },
    { Value: 'America/Boa_Vista', Text: '(UTC-04:00) Boa Vista' },
    { Value: 'America/Caracas', Text: '(UTC-04:00) Caracas' },
    { Value: 'America/Curacao', Text: '(UTC-04:00) Curacao' },
    { Value: 'America/Grand_Turk', Text: '(UTC-04:00) Grand Turk' },
    { Value: 'America/Guyana', Text: '(UTC-04:00) Guyana' },
    { Value: 'America/La_Paz', Text: '(UTC-04:00) La Paz' },
    { Value: 'America/Manaus', Text: '(UTC-04:00) Manaus' },
    { Value: 'America/Martinique', Text: '(UTC-04:00) Martinique' },
    { Value: 'America/Port_of_Spain', Text: '(UTC-04:00) Port of Spain' },
    { Value: 'America/Porto_Velho', Text: '(UTC-04:00) Porto Velho' },
    { Value: 'America/Puerto_Rico', Text: '(UTC-04:00) Puerto Rico' },
    { Value: 'America/Santo_Domingo', Text: '(UTC-04:00) Santo Domingo' },
    { Value: 'America/Thule', Text: '(UTC-04:00) Thule' },
    { Value: 'America/St_Johns', Text: '(UTC-03:30) Newfoundland Time - St. Johns' },
    { Value: 'America/Araguaina', Text: '(UTC-03:00) Araguaina' },
    { Value: 'America/Asuncion', Text: '(UTC-03:00) Asuncion' },
    { Value: 'America/Belem', Text: '(UTC-03:00) Belem' },
    { Value: 'America/Argentina/Buenos_Aires', Text: '(UTC-03:00) Buenos Aires' },
    { Value: 'America/Campo_Grande', Text: '(UTC-03:00) Campo Grande' },
    { Value: 'America/Cayenne', Text: '(UTC-03:00) Cayenne' },
    { Value: 'America/Cuiaba', Text: '(UTC-03:00) Cuiaba' },
    { Value: 'America/Fortaleza', Text: '(UTC-03:00) Fortaleza' },
    { Value: 'America/Godthab', Text: '(UTC-03:00) Godthab' },
    { Value: 'America/Maceio', Text: '(UTC-03:00) Maceio' },
    { Value: 'America/Miquelon', Text: '(UTC-03:00) Miquelon' },
    { Value: 'America/Montevideo', Text: '(UTC-03:00) Montevideo' },
    { Value: 'Antarctica/Palmer', Text: '(UTC-03:00) Palmer' },
    { Value: 'America/Paramaribo', Text: '(UTC-03:00) Paramaribo' },
    { Value: 'America/Punta_Arenas', Text: '(UTC-03:00) Punta Arenas' },
    { Value: 'America/Recife', Text: '(UTC-03:00) Recife' },
    { Value: 'Antarctica/Rothera', Text: '(UTC-03:00) Rothera' },
    { Value: 'America/Bahia', Text: '(UTC-03:00) Salvador' },
    { Value: 'America/Santiago', Text: '(UTC-03:00) Santiago' },
    { Value: 'Atlantic/Stanley', Text: '(UTC-03:00) Stanley' },
    { Value: 'America/Noronha', Text: '(UTC-02:00) Noronha' },
    { Value: 'America/Sao_Paulo', Text: '(UTC-02:00) Sao Paulo' },
    { Value: 'Atlantic/South_Georgia', Text: '(UTC-02:00) South Georgia' },
    { Value: 'Atlantic/Azores', Text: '(UTC-01:00) Azores' },
    { Value: 'Atlantic/Cape_Verde', Text: '(UTC-01:00) Cape Verde' },
    { Value: 'America/Scoresbysund', Text: '(UTC-01:00) Scoresbysund' },
    { Value: 'Africa/Abidjan', Text: '(UTC+00:00) Abidjan' },
    { Value: 'Africa/Accra', Text: '(UTC+00:00) Accra' },
    { Value: 'Africa/Bissau', Text: '(UTC+00:00) Bissau' },
    { Value: 'Atlantic/Canary', Text: '(UTC+00:00) Canary Islands' },
    { Value: 'Africa/Casablanca', Text: '(UTC+00:00) Casablanca' },
    { Value: 'America/Danmarkshavn', Text: '(UTC+00:00) Danmarkshavn' },
    { Value: 'Europe/Dublin', Text: '(UTC+00:00) Dublin' },
    { Value: 'Africa/El_Aaiun', Text: '(UTC+00:00) El Aaiun' },
    { Value: 'Atlantic/Faroe', Text: '(UTC+00:00) Faeroe' },
    { Value: 'Etc/UTC', Text: '(UTC+00:00) UTC (no daylight saving)' },
    { Value: 'Europe/Lisbon', Text: '(UTC+00:00) Lisbon' },
    { Value: 'Europe/London', Text: '(UTC+00:00) London' },
    { Value: 'Africa/Monrovia', Text: '(UTC+00:00) Monrovia' },
    { Value: 'Atlantic/Reykjavik', Text: '(UTC+00:00) Reykjavik' },
    { Value: 'UTC', Text: 'UTC' },
    { Value: 'Africa/Algiers', Text: '(UTC+01:00) Algiers' },
    { Value: 'Europe/Amsterdam', Text: '(UTC+01:00) Amsterdam' },
    { Value: 'Europe/Andorra', Text: '(UTC+01:00) Andorra' },
    { Value: 'Europe/Berlin', Text: '(UTC+01:00) Berlin' },
    { Value: 'Europe/Brussels', Text: '(UTC+01:00) Brussels' },
    { Value: 'Europe/Budapest', Text: '(UTC+01:00) Budapest' },
    { Value: 'Europe/Belgrade', Text: '(UTC+01:00) Central European Time - Belgrade' },
    { Value: 'Europe/Prague', Text: '(UTC+01:00) Central European Time - Prague' },
    { Value: 'Africa/Ceuta', Text: '(UTC+01:00) Ceuta' },
    { Value: 'Europe/Copenhagen', Text: '(UTC+01:00) Copenhagen' },
    { Value: 'Europe/Gibraltar', Text: '(UTC+01:00) Gibraltar' },
    { Value: 'Africa/Lagos', Text: '(UTC+01:00) Lagos' },
    { Value: 'Europe/Luxembourg', Text: '(UTC+01:00) Luxembourg' },
    { Value: 'Europe/Madrid', Text: '(UTC+01:00) Madrid' },
    { Value: 'Europe/Malta', Text: '(UTC+01:00) Malta' },
    { Value: 'Europe/Monaco', Text: '(UTC+01:00) Monaco' },
    { Value: 'Africa/Ndjamena', Text: '(UTC+01:00) Ndjamena' },
    { Value: 'Europe/Oslo', Text: '(UTC+01:00) Oslo' },
    { Value: 'Europe/Paris', Text: '(UTC+01:00) Paris' },
    { Value: 'Europe/Rome', Text: '(UTC+01:00) Rome' },
    { Value: 'Europe/Stockholm', Text: '(UTC+01:00) Stockholm' },
    { Value: 'Europe/Tirane', Text: '(UTC+01:00) Tirane' },
    { Value: 'Africa/Tunis', Text: '(UTC+01:00) Tunis' },
    { Value: 'Europe/Vienna', Text: '(UTC+01:00) Vienna' },
    { Value: 'Europe/Warsaw', Text: '(UTC+01:00) Warsaw' },
    { Value: 'Europe/Zurich', Text: '(UTC+01:00) Zurich' },
    { Value: 'Asia/Amman', Text: '(UTC+02:00) Amman' },
    { Value: 'Europe/Athens', Text: '(UTC+02:00) Athens' },
    { Value: 'Asia/Beirut', Text: '(UTC+02:00) Beirut' },
    { Value: 'Europe/Bucharest', Text: '(UTC+02:00) Bucharest' },
    { Value: 'Africa/Cairo', Text: '(UTC+02:00) Cairo' },
    { Value: 'Europe/Chisinau', Text: '(UTC+02:00) Chisinau' },
    { Value: 'Asia/Damascus', Text: '(UTC+02:00) Damascus' },
    { Value: 'Asia/Gaza', Text: '(UTC+02:00) Gaza' },
    { Value: 'Europe/Helsinki', Text: '(UTC+02:00) Helsinki' },
    { Value: 'Asia/Jerusalem', Text: '(UTC+02:00) Jerusalem' },
    { Value: 'Africa/Johannesburg', Text: '(UTC+02:00) Johannesburg' },
    { Value: 'Africa/Khartoum', Text: '(UTC+02:00) Khartoum' },
    { Value: 'Europe/Kiev', Text: '(UTC+02:00) Kiev' },
    { Value: 'Africa/Maputo', Text: '(UTC+02:00) Maputo' },
    { Value: 'Europe/Kaliningrad', Text: '(UTC+02:00) Moscow-01 - Kaliningrad' },
    { Value: 'Asia/Nicosia', Text: '(UTC+02:00) Nicosia' },
    { Value: 'Europe/Riga', Text: '(UTC+02:00) Riga' },
    { Value: 'Europe/Sofia', Text: '(UTC+02:00) Sofia' },
    { Value: 'Europe/Tallinn', Text: '(UTC+02:00) Tallinn' },
    { Value: 'Africa/Tripoli', Text: '(UTC+02:00) Tripoli' },
    { Value: 'Europe/Vilnius', Text: '(UTC+02:00) Vilnius' },
    { Value: 'Africa/Windhoek', Text: '(UTC+02:00) Windhoek' },
    { Value: 'Asia/Baghdad', Text: '(UTC+03:00) Baghdad' },
    { Value: 'Europe/Istanbul', Text: '(UTC+03:00) Istanbul' },
    { Value: 'Europe/Minsk', Text: '(UTC+03:00) Minsk' },
    { Value: 'Europe/Moscow', Text: '(UTC+03:00) Moscow+00 - Moscow' },
    { Value: 'Africa/Nairobi', Text: '(UTC+03:00) Nairobi' },
    { Value: 'Asia/Qatar', Text: '(UTC+03:00) Qatar' },
    { Value: 'Asia/Riyadh', Text: '(UTC+03:00) Riyadh' },
    { Value: 'Antarctica/Syowa', Text: '(UTC+03:00) Syowa' },
    { Value: 'Asia/Tehran', Text: '(UTC+03:30) Tehran' },
    { Value: 'Asia/Baku', Text: '(UTC+04:00) Baku' },
    { Value: 'Asia/Dubai', Text: '(UTC+04:00) Dubai' },
    { Value: 'Indian/Mahe', Text: '(UTC+04:00) Mahe' },
    { Value: 'Indian/Mauritius', Text: '(UTC+04:00) Mauritius' },
    { Value: 'Europe/Samara', Text: '(UTC+04:00) Moscow+01 - Samara' },
    { Value: 'Indian/Reunion', Text: '(UTC+04:00) Reunion' },
    { Value: 'Asia/Tbilisi', Text: '(UTC+04:00) Tbilisi' },
    { Value: 'Asia/Yerevan', Text: '(UTC+04:00) Yerevan' },
    { Value: 'Asia/Kabul', Text: '(UTC+04:30) Kabul' },
    { Value: 'Asia/Aqtau', Text: '(UTC+05:00) Aqtau' },
    { Value: 'Asia/Aqtobe', Text: '(UTC+05:00) Aqtobe' },
    { Value: 'Asia/Ashgabat', Text: '(UTC+05:00) Ashgabat' },
    { Value: 'Asia/Dushanbe', Text: '(UTC+05:00) Dushanbe' },
    { Value: 'Asia/Karachi', Text: '(UTC+05:00) Karachi' },
    { Value: 'Indian/Kerguelen', Text: '(UTC+05:00) Kerguelen' },
    { Value: 'Indian/Maldives', Text: '(UTC+05:00) Maldives' },
    { Value: 'Antarctica/Mawson', Text: '(UTC+05:00) Mawson' },
    { Value: 'Asia/Yekaterinburg', Text: '(UTC+05:00) Moscow+02 - Yekaterinburg' },
    { Value: 'Asia/Tashkent', Text: '(UTC+05:00) Tashkent' },
    { Value: 'Asia/Colombo', Text: '(UTC+05:30) Colombo' },
    { Value: 'Asia/Kolkata', Text: '(UTC+05:30) India Standard Time' },
    { Value: 'Asia/Katmandu', Text: '(UTC+05:45) Katmandu' },
    { Value: 'Asia/Almaty', Text: '(UTC+06:00) Almaty' },
    { Value: 'Asia/Bishkek', Text: '(UTC+06:00) Bishkek' },
    { Value: 'Indian/Chagos', Text: '(UTC+06:00) Chagos' },
    { Value: 'Asia/Dhaka', Text: '(UTC+06:00) Dhaka' },
    { Value: 'Asia/Omsk', Text: '(UTC+06:00) Moscow+03 - Omsk' },
    { Value: 'Asia/Thimphu', Text: '(UTC+06:00) Thimphu' },
    { Value: 'Antarctica/Vostok', Text: '(UTC+06:00) Vostok' },
    { Value: 'Indian/Cocos', Text: '(UTC+06:30) Cocos' },
    { Value: 'Asia/Yangon', Text: '(UTC+06:30) Rangoon' },
    { Value: 'Asia/Bangkok', Text: '(UTC+07:00) Bangkok' },
    { Value: 'Indian/Christmas', Text: '(UTC+07:00) Christmas' },
    { Value: 'Antarctica/Davis', Text: '(UTC+07:00) Davis' },
    { Value: 'Asia/Saigon', Text: '(UTC+07:00) Hanoi' },
    { Value: 'Asia/Hovd', Text: '(UTC+07:00) Hovd' },
    { Value: 'Asia/Jakarta', Text: '(UTC+07:00) Jakarta' },
    { Value: 'Asia/Krasnoyarsk', Text: '(UTC+07:00) Moscow+04 - Krasnoyarsk' },
    { Value: 'Asia/Brunei', Text: '(UTC+08:00) Brunei' },
    { Value: 'Asia/Shanghai', Text: '(UTC+08:00) China Time - Beijing' },
    { Value: 'Asia/Choibalsan', Text: '(UTC+08:00) Choibalsan' },
    { Value: 'Asia/Hong_Kong', Text: '(UTC+08:00) Hong Kong' },
    { Value: 'Asia/Kuala_Lumpur', Text: '(UTC+08:00) Kuala Lumpur' },
    { Value: 'Asia/Macau', Text: '(UTC+08:00) Macau' },
    { Value: 'Asia/Makassar', Text: '(UTC+08:00) Makassar' },
    { Value: 'Asia/Manila', Text: '(UTC+08:00) Manila' },
    { Value: 'Asia/Irkutsk', Text: '(UTC+08:00) Moscow+05 - Irkutsk' },
    { Value: 'Asia/Singapore', Text: '(UTC+08:00) Singapore' },
    { Value: 'Asia/Taipei', Text: '(UTC+08:00) Taipei' },
    { Value: 'Asia/Ulaanbaatar', Text: '(UTC+08:00) Ulaanbaatar' },
    { Value: 'Australia/Perth', Text: '(UTC+08:00) Western Time - Perth' },
    { Value: 'Asia/Pyongyang', Text: '(UTC+08:30) Pyongyang' },
    { Value: 'Asia/Dili', Text: '(UTC+09:00) Dili' },
    { Value: 'Asia/Jayapura', Text: '(UTC+09:00) Jayapura' },
    { Value: 'Asia/Yakutsk', Text: '(UTC+09:00) Moscow+06 - Yakutsk' },
    { Value: 'Pacific/Palau', Text: '(UTC+09:00) Palau' },
    { Value: 'Asia/Seoul', Text: '(UTC+09:00) Seoul' },
    { Value: 'Asia/Tokyo', Text: '(UTC+09:00) Tokyo' },
    { Value: 'Australia/Darwin', Text: '(UTC+09:30) Central Time - Darwin' },
    { Value: 'Antarctica/DumontDUrville', Text: '(UTC+10:00) Dumont D"Urville' },
    { Value: 'Australia/Brisbane', Text: '(UTC+10:00) Eastern Time - Brisbane' },
    { Value: 'Pacific/Guam', Text: '(UTC+10:00) Guam' },
    { Value: 'Asia/Vladivostok', Text: '(UTC+10:00) Moscow+07 - Vladivostok' },
    { Value: 'Pacific/Port_Moresby', Text: '(UTC+10:00) Port Moresby' },
    { Value: 'Pacific / Chuuk', Text: '(UTC+10:00) Truk' },
    { Value: 'Australia/Adelaide', Text: '(UTC+10:30) Central Time - Adelaide' },
    { Value: 'Antarctica/Casey', Text: '(UTC+11:00) Casey' },
    { Value: 'Australia/Hobart', Text: '(UTC+11:00) Eastern Time - Hobart' },
    { Value: 'Australia/Sydney', Text: '(UTC+11:00) Eastern Time - Melbourne, Sydney' },
    { Value: 'Pacific/Efate', Text: '(UTC+11:00) Efate' },
    { Value: 'Pacific/Guadalcanal', Text: '(UTC+11:00) Guadalcanal' },
    { Value: 'Pacific/Kosrae', Text: '(UTC+11:00) Kosrae' },
    { Value: 'Asia/Magadan', Text: '(UTC+11:00) Moscow+08 - Magadan' },
    { Value: 'Pacific / Norfolk', Text: '(UTC+11:00) Norfolk' },
    { Value: 'Pacific/Noumea', Text: '(UTC+11:00) Noumea' },
    { Value: 'Pacific/Pohnpei', Text: '(UTC+11:00) Ponape' },
    { Value: 'Pacific/Funafuti', Text: '(UTC+12:00) Funafuti' },
    { Value: 'Pacific/Kwajalein', Text: '(UTC+12:00) Kwajalein' },
    { Value: 'Pacific/Majuro', Text: '(UTC+12:00) Majuro' },
    { Value: 'Asia/Kamchatka', Text: '(UTC+12:00) Moscow+09 - Petropavlovsk - Kamchatskiy' },
    { Value: 'Pacific / Nauru', Text: '(UTC+12:00) Nauru' },
    { Value: 'Pacific/Tarawa', Text: '(UTC+12:00) Tarawa' },
    { Value: 'Pacific/Wake', Text: '(UTC+12:00) Wake' },
    { Value: 'Pacific/Wallis', Text: '(UTC+12:00) Wallis' },
    { Value: 'Pacific/Auckland', Text: '(UTC+13:00) Auckland' },
    { Value: 'Pacific/Enderbury', Text: '(UTC+13:00) Enderbury' },
    { Value: 'Pacific/Fakaofo', Text: '(UTC+13:00) Fakaofo' },
    { Value: 'Pacific/Fiji', Text: '(UTC+13:00) Fiji' },
    { Value: 'Pacific/Tongatapu', Text: '(UTC+13:00) Tongatapu' },
    { Value: 'Pacific/Apia', Text: '(UTC+14:00) Apia' },
    { Value: 'Pacific/Kiritimati', Text: '(UTC+14:00) Kiritimati' }
];

class Gregorian {
    firstDateOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth());
    }
    lastDateOfMonth(dt) {
        return new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
    }
    isMonthStart(date) {
        return (date.getDate() === 1);
    }
    getLeapYearDaysCount() {
        return 366;
    }
    getYearDaysCount(date, interval) {
        return ((date.getFullYear() + interval) % 4 === 0) ? 366 : 365;
    }
    getDate(date) {
        return date.getDate();
    }
    getMonth(date) {
        return (date.getMonth() + 1);
    }
    getFullYear(date) {
        return date.getFullYear();
    }
    getYearLastDate(date, interval) {
        return new Date(date.getFullYear() + interval, 0, 0);
    }
    getMonthDaysCount(date) {
        return this.lastDateOfMonth(date).getDate();
    }
    getMonthStartDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1, date.getHours(), date.getMinutes());
    }
    getMonthEndDate(date) {
        date.setDate(1);
        return new Date(date.setMonth(date.getMonth() + 1));
    }
    getExpectedDays(date, days) {
        return days;
    }
    setDate(dateObj, date) {
        dateObj.setDate(date);
    }
    setValidDate(date, interval, startDate, monthValue, beginDate) {
        if (!isNullOrUndefined(beginDate)) {
            date.setMonth((beginDate ? monthValue : date.getMonth()) + interval);
        }
        else {
            date.setMonth(date.getMonth() + interval, startDate);
        }
    }
    setMonth(date, interval, startDate) {
        date.setFullYear(date.getFullYear());
        date.setMonth(interval - 1);
        date.setDate(startDate);
    }
    addYears(date, interval) {
        date.setFullYear(date.getFullYear() + interval);
    }
    isSameMonth(date1, date2) {
        return (date1.getMonth() === date2.getMonth());
    }
    checkMonth(date, months) {
        return (months.indexOf(date.getMonth() + 1) === -1);
    }
    compareMonth(date1, date2) {
        return (date1.getMonth() > date2.getMonth());
    }
    isSameYear(date1, date2) {
        return (date1.getFullYear() === date2.getFullYear());
    }
    isLastMonth(date) {
        return (date.getMonth() === 11);
    }
    isLeapYear(year, interval) {
        return ((year + interval) % 4 === 0);
    }
}
class Islamic {
    firstDateOfMonth(date) {
        let hDate = HijriParser.getHijriDate(date);
        let gDate = HijriParser.toGregorian(hDate.year, hDate.month, 1);
        return gDate;
    }
    lastDateOfMonth(date) {
        let hDate = this.getHijriDate(date);
        let gDate = HijriParser.toGregorian(hDate.year, hDate.month, this.getDaysInMonth(hDate.month, hDate.year));
        let finalGDate = new Date(gDate.getTime());
        new Date(finalGDate.setDate(finalGDate.getDate() + 1));
        let finalHDate = this.getHijriDate(finalGDate);
        if (hDate.month === finalHDate.month) {
            return finalGDate;
        }
        finalHDate = HijriParser.getHijriDate(gDate);
        if (hDate.month === finalHDate.month) {
            return gDate;
        }
        return new Date(gDate.setDate(gDate.getDate() - 1));
    }
    isMonthStart(date) {
        let hijriDate = this.getHijriDate(date);
        return (hijriDate.date === 1);
    }
    getLeapYearDaysCount() {
        return 355;
    }
    getYearDaysCount(date, interval) {
        let hDate = this.getHijriDate(date);
        return this.isLeapYear(hDate.year, interval) ? 355 : 354;
    }
    getDate(date) {
        let hijriDate = this.getHijriDate(date);
        return hijriDate.date;
    }
    getMonth(date) {
        let hDate = this.getHijriDate(date);
        return hDate.month;
    }
    getFullYear(date) {
        let hDate = this.getHijriDate(date);
        return hDate.year;
    }
    getYearLastDate(date, interval) {
        let hDate = HijriParser.getHijriDate(date);
        let gDate = HijriParser.toGregorian(hDate.year + interval, 1, 0);
        return gDate;
    }
    getMonthDaysCount(date) {
        let maxDate = this.lastDateOfMonth(date);
        let hijriDate = this.getHijriDate(maxDate);
        return hijriDate.date;
    }
    getMonthStartDate(date) {
        let firstDate = this.firstDateOfMonth(date);
        return new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate(), date.getHours(), date.getMinutes());
    }
    getMonthEndDate(date) {
        let lastDate = this.lastDateOfMonth(date);
        lastDate.setDate(lastDate.getDate() + 1);
        return new Date(lastDate.setMonth(lastDate.getMonth()));
    }
    getExpectedDays(date, days) {
        let hDate = this.getHijriDate(date);
        let day = [];
        for (let i = 0; i < days.length; i++) {
            let gDate = HijriParser.toGregorian(hDate.year, hDate.month, days[i]);
            day.push(gDate.getDate());
        }
        return day;
    }
    setDate(dateObj, date) {
        let hDate = HijriParser.getHijriDate(dateObj);
        let gDate = HijriParser.toGregorian(hDate.year, hDate.month, date);
        this.updateDateObj(dateObj, gDate);
    }
    setValidDate(date, interval, startDate, monthValue, beginDate) {
        let firstDate = (!isNullOrUndefined(beginDate)) ? this.firstDateOfMonth(beginDate) : date;
        let hDate = HijriParser.getHijriDate(firstDate);
        let gDate = HijriParser.toGregorian(hDate.year, hDate.month + interval, startDate);
        this.updateDateObj(date, gDate);
    }
    setMonth(date, interval, startDate) {
        let hDate = HijriParser.getHijriDate(date);
        let gDate = HijriParser.toGregorian(hDate.year, interval, startDate);
        this.updateDateObj(date, gDate);
    }
    addYears(date, interval, monthValue) {
        let hDate = HijriParser.getHijriDate(date);
        let gDate = HijriParser.toGregorian(hDate.year + interval, monthValue, 1);
        this.updateDateObj(date, gDate);
    }
    isSameMonth(date1, date2) {
        let currentHijri = this.getHijriDate(date1);
        let tempHijri = this.getHijriDate(date2);
        return (currentHijri.month === tempHijri.month);
    }
    checkMonth(date, months) {
        let hDate = this.getHijriDate(date);
        return (months.indexOf(hDate.month) === -1);
    }
    compareMonth(date1, date2) {
        let hDate = this.getHijriDate(date1);
        let hDate1 = this.getHijriDate(date2);
        return (hDate.month > hDate1.month);
    }
    isSameYear(date1, date2) {
        let hDate = this.getHijriDate(date1);
        let hDate1 = this.getHijriDate(date2);
        return (hDate.year === hDate1.year);
    }
    isLastMonth(date) {
        let hDate = this.getHijriDate(date);
        return (hDate.month === 12);
    }
    updateDateObj(date, gDate) {
        date.setFullYear(gDate.getFullYear(), gDate.getMonth(), gDate.getDate());
    }
    isLeapYear(year, interval) {
        return (14 + 11 * (year + interval)) % 30 < 11;
    }
    getDaysInMonth(month, year) {
        let length = 0;
        length = 29 + ((month + 1) % 2);
        if (month === 11 && this.isLeapYear(year, 0)) {
            length++;
        }
        return length;
    }
    getHijriDate(date) {
        return HijriParser.getHijriDate(date);
    }
}

/**
 * Date Generator from Recurrence Rule
 */
function generateSummary(rule, localeObject, locale, calendarType = 'Gregorian') {
    let ruleObject = extractObjectFromRule(rule);
    let summary = localeObject.getConstant(EVERY) + ' ';
    let cldrObj;
    let cldrObj1;
    let calendarMode = calendarType.toLowerCase();
    if (locale === 'en' || locale === 'en-US') {
        cldrObj1 = (getValue('months.stand-alone.abbreviated', getDefaultDateObject(calendarMode)));
        cldrObj = (getValue('days.stand-alone.abbreviated', getDefaultDateObject(calendarMode)));
    }
    else {
        cldrObj1 =
            (getValue('main.' + '' + locale + '.dates.calendars.' + calendarMode + '.months.stand-alone.abbreviated', cldrData));
        cldrObj =
            (getValue('main.' + '' + locale + '.dates.calendars.' + calendarMode + '.days.stand-alone.abbreviated', cldrData));
    }
    if (ruleObject.interval > 1) {
        summary += ruleObject.interval + ' ';
    }
    switch (ruleObject.freq) {
        case 'DAILY':
            summary += localeObject.getConstant(DAYS);
            break;
        case 'WEEKLY':
            summary += localeObject.getConstant(WEEKS) + ' ' + localeObject.getConstant(ON) + ' ';
            ruleObject.day.forEach((day, index) => {
                summary += getValue(DAYINDEXOBJECT[day], cldrObj);
                summary += (((ruleObject.day.length - 1) === index) ? '' : ', ');
            });
            break;
        case 'MONTHLY':
            summary += localeObject.getConstant(MONTHS) + ' ' + localeObject.getConstant(ON) + ' ';
            summary += getMonthSummary(ruleObject, cldrObj, localeObject);
            break;
        case 'YEARLY':
            summary += localeObject.getConstant(YEARS) + ' ' + localeObject.getConstant(ON) + ' ';
            summary += getValue((ruleObject.month[0]).toString(), cldrObj1) + ' ';
            summary += getMonthSummary(ruleObject, cldrObj, localeObject);
            break;
    }
    if (ruleObject.count) {
        summary += ', ' + (ruleObject.count) + ' ' + localeObject.getConstant(TIMES);
    }
    else if (ruleObject.until) {
        let tempDate = ruleObject.until;
        summary += ', ' + localeObject.getConstant(UNTIL)
            + ' ' + tempDate.getDate()
            + ' ' + getValue((tempDate.getMonth() + 1).toString(), cldrObj1)
            + ' ' + tempDate.getFullYear();
    }
    return summary;
}
function getMonthSummary(ruleObject, cldrObj, localeObj) {
    let summary = '';
    if (ruleObject.monthDay.length) {
        summary += ruleObject.monthDay[0];
    }
    else if (ruleObject.day) {
        let pos = ruleObject.setPosition - 1;
        summary += localeObj.getConstant(WEEKPOS[pos > -1 ? pos : (WEEKPOS.length - 1)])
            + ' ' + getValue(DAYINDEXOBJECT[ruleObject.day[0]], cldrObj);
    }
    return summary;
}
function generate(startDate, rule, excludeDate, startDayOfWeek, maximumCount = MAXOCCURRENCE, viewDate = null, calendarMode = 'Gregorian') {
    let ruleObject = extractObjectFromRule(rule);
    let cacheDate;
    calendarUtil = getCalendarUtil(calendarMode);
    let data = [];
    let modifiedDate = new Date(startDate.getTime());
    if (viewDate && viewDate > startDate && !ruleObject.count) {
        tempViewDate = new Date(new Date(viewDate.getTime()).setHours(0, 0, 0));
    }
    else {
        tempViewDate = null;
    }
    if (!ruleObject.until && tempViewDate) {
        cacheDate = new Date(tempViewDate.getTime());
        cacheDate.setDate(tempViewDate.getDate() + maximumCount * (ruleObject.interval));
        ruleObject.until = cacheDate;
    }
    if (ruleObject.until && startDate > ruleObject.until) {
        return data;
    }
    maxOccurrence = maximumCount;
    setFirstDayOfWeek(DAYINDEX[startDayOfWeek]);
    tempExcludeDate = [];
    let tempDate = isNullOrUndefined(excludeDate) ? [] : excludeDate.split(',');
    tempDate.forEach((content) => {
        let parsedDate = getDateFromRecurrenceDateString(content);
        tempExcludeDate.push(new Date(parsedDate.getTime()).setHours(0, 0, 0, 0));
    });
    switch (ruleObject.freq) {
        case 'DAILY':
            dailyType(modifiedDate, ruleObject.until, data, ruleObject);
            break;
        case 'WEEKLY':
            weeklyType(modifiedDate, ruleObject.until, data, ruleObject);
            break;
        case 'MONTHLY':
            monthlyType(modifiedDate, ruleObject.until, data, ruleObject);
            break;
        case 'YEARLY':
            yearlyType(modifiedDate, ruleObject.until, data, ruleObject);
    }
    return data;
}
function getDateFromRecurrenceDateString(recDateString) {
    return new Date(recDateString.substr(0, 4) +
        '-' + recDateString.substr(4, 2) +
        '-' + recDateString.substr(6, 5) +
        ':' + recDateString.substr(11, 2) +
        ':' + recDateString.substr(13));
}
function excludeDateHandler(data, date) {
    let zeroIndex = new Date(date).setHours(0, 0, 0, 0);
    if (tempExcludeDate.indexOf(zeroIndex) === -1 && (!tempViewDate || zeroIndex >= tempViewDate.getTime())) {
        data.push(date);
    }
}
function dailyType(startDate, endDate, data, ruleObject) {
    let tempDate = new Date(startDate.getTime());
    let interval = ruleObject.interval;
    let expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    let state;
    let expectedDays = ruleObject.day;
    while (compareDates(tempDate, endDate)) {
        state = true;
        state = validateRules(tempDate, ruleObject);
        if (state && (expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) > -1 || expectedDays.length === 0)) {
            excludeDateHandler(data, tempDate.getTime());
            if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                break;
            }
        }
        tempDate.setDate(tempDate.getDate() + interval);
    }
}
function weeklyType(startDate, endDate, data, ruleObject) {
    let tempDate = new Date(startDate.getTime());
    if (!ruleObject.day.length) {
        ruleObject.day.push(DAYINDEX[startDate.getDay()]);
    }
    let interval = ruleObject.interval;
    let expectedDays = ruleObject.day;
    let expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    let weekState = true;
    let wkstIndex;
    let weekCollection = [];
    if (expectedDays.length > 1) {
        if (isNullOrUndefined(ruleObject.wkst) || ruleObject.wkst === '') {
            ruleObject.wkst = dayIndex[0];
        }
        wkstIndex = DAYINDEX.indexOf(ruleObject.wkst);
        while (compareDates(tempDate, endDate)) {
            let startDateDiff = DAYINDEX.indexOf(DAYINDEX[tempDate.getDay()]) - wkstIndex;
            startDateDiff = startDateDiff === -1 ? 6 : startDateDiff;
            let weekstartDate = addDays(tempDate, -startDateDiff);
            let weekendDate = addDays(weekstartDate, 6);
            let compareTempDate = new Date(tempDate.getTime());
            resetTime(weekendDate);
            resetTime(compareTempDate);
            while (weekendDate >= compareTempDate) {
                if (expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) > -1) {
                    weekCollection.push([tempDate.getTime()]);
                }
                if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                    break;
                }
                tempDate.setDate(tempDate.getDate() + 1);
                compareTempDate = new Date(tempDate.getTime());
                resetTime(compareTempDate);
            }
            tempDate.setDate(tempDate.getDate() - 1);
            if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                break;
            }
            tempDate.setDate((tempDate.getDate()) + 1 + ((interval - 1) * 7));
            insertDataCollection(weekCollection, weekState, startDate, endDate, data, ruleObject);
            weekCollection = [];
        }
    }
    else {
        tempDate = getStartDateForWeek(startDate, ruleObject.day);
        while (compareDates(tempDate, endDate)) {
            weekState = validateRules(tempDate, ruleObject);
            if (weekState && (expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) > -1)) {
                excludeDateHandler(data, tempDate.getTime());
            }
            if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                break;
            }
            tempDate.setDate(tempDate.getDate() + (interval * 7));
        }
        insertDataCollection(weekCollection, weekState, startDate, endDate, data, ruleObject);
        weekCollection = [];
    }
}
function monthlyType(startDate, endDate, data, ruleObject) {
    // Set monthday value if BYDAY, BYMONTH and Month day property is not set based on start date
    if (!ruleObject.month.length && !ruleObject.day.length && !ruleObject.monthDay.length) {
        ruleObject.monthDay.push(startDate.getDate());
        if (ruleObject.freq === 'YEARLY') {
            ruleObject.month.push(startDate.getMonth() + 1);
        }
    }
    else if (ruleObject.month.length > 0 && !ruleObject.day.length && !ruleObject.monthDay.length) {
        ruleObject.monthDay.push(startDate.getDate());
    }
    let ruleType = validateMonthlyRuleType(ruleObject);
    switch (ruleType) {
        case 'day':
            switch (ruleObject.freq) {
                case 'MONTHLY':
                    monthlyDayTypeProcessforMonthFreq(startDate, endDate, data, ruleObject);
                    break;
                case 'YEARLY':
                    monthlyDayTypeProcess(startDate, endDate, data, ruleObject);
                    break;
            }
            break;
        case 'both':
        case 'date':
            switch (ruleObject.freq) {
                case 'MONTHLY':
                    monthlyDateTypeProcessforMonthFreq(startDate, endDate, data, ruleObject);
                    break;
                case 'YEARLY':
                    monthlyDateTypeProcess(startDate, endDate, data, ruleObject);
                    break;
            }
    }
}
function yearlyType(startDate, endDate, data, ruleObject) {
    let typeValue = checkYearlyType(ruleObject);
    switch (typeValue) {
        case 'MONTH':
            monthlyType(startDate, endDate, data, ruleObject);
            break;
        case 'WEEKNO':
            processWeekNo(startDate, endDate, data, ruleObject);
            break;
        case 'YEARDAY':
            processYearDay(startDate, endDate, data, ruleObject);
            break;
    }
}
function processWeekNo(startDate, endDate, data, ruleObject) {
    let stDate = calendarUtil.getYearLastDate(startDate, 0);
    let tempDate;
    let expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    let state;
    let startDay;
    let firstWeekSpan;
    let weekNos = ruleObject.weekNo;
    let weekNo;
    let maxDate;
    let minDate;
    let weekCollection = [];
    let expectedDays = ruleObject.day;
    while (compareDates(stDate, endDate)) {
        startDay = dayIndex.indexOf(DAYINDEX[stDate.getDay()]);
        firstWeekSpan = (6 - startDay) + 1;
        for (let index = 0; index < weekNos.length; index++) {
            weekNo = weekNos[index];
            weekNo = (weekNo > 0) ? weekNo : 53 + weekNo + 1;
            maxDate = (weekNo === 1) ? firstWeekSpan : firstWeekSpan + ((weekNo - 1) * 7);
            minDate = (weekNo === 1) ? firstWeekSpan - 7 : firstWeekSpan + ((weekNo - 2) * 7);
            while (minDate < maxDate) {
                tempDate = new Date(stDate.getTime() + (MS_PER_DAY * minDate));
                if (expectedDays.length === 0 || expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) > -1) {
                    if (isNullOrUndefined(ruleObject.setPosition)) {
                        insertDateCollection(state, startDate, endDate, data, ruleObject, tempDate.getTime());
                    }
                    else {
                        weekCollection.push([tempDate.getTime()]);
                    }
                }
                minDate++;
            }
        }
        if (!isNullOrUndefined(ruleObject.setPosition)) {
            insertDatasIntoExistingCollection(weekCollection, state, startDate, endDate, data, ruleObject);
        }
        if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
            return;
        }
        stDate = calendarUtil.getYearLastDate(tempDate, ruleObject.interval);
        weekCollection = [];
    }
}
function processYearDay(startDate, endDate, data, ruleObject) {
    let stDate = calendarUtil.getYearLastDate(startDate, 0);
    let tempDate;
    let expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    let state;
    let dateCollection = [];
    let date;
    let expectedDays = ruleObject.day;
    while (compareDates(stDate, endDate)) {
        for (let index = 0; index < ruleObject.yearDay.length; index++) {
            date = ruleObject.yearDay[index];
            tempDate = new Date(stDate.getTime());
            if ((date === calendarUtil.getLeapYearDaysCount() || date === -calendarUtil.getLeapYearDaysCount()) &&
                (!calendarUtil.isLeapYear(calendarUtil.getFullYear(tempDate), 1))) {
                tempDate.setDate(tempDate.getDate() + 1);
                continue;
            }
            tempDate.setDate(tempDate.getDate() + ((date < 0) ?
                calendarUtil.getYearDaysCount(tempDate, 1) + 1 + date : date));
            if (expectedDays.length === 0 || expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) > -1) {
                if (ruleObject.setPosition == null) {
                    insertDateCollection(state, startDate, endDate, data, ruleObject, tempDate.getTime());
                }
                else {
                    dateCollection.push([tempDate.getTime()]);
                }
            }
        }
        if (!isNullOrUndefined(ruleObject.setPosition)) {
            insertDatasIntoExistingCollection(dateCollection, state, startDate, endDate, data, ruleObject);
        }
        if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
            return;
        }
        stDate = calendarUtil.getYearLastDate(tempDate, ruleObject.interval);
        dateCollection = [];
    }
}
function checkYearlyType(ruleObject) {
    if (ruleObject.yearDay.length) {
        return 'YEARDAY';
    }
    else if (ruleObject.weekNo.length) {
        return 'WEEKNO';
    }
    return 'MONTH';
}
function initializeRecRuleVariables(startDate, ruleObject) {
    let ruleData = {
        monthCollection: [],
        index: 0,
        tempDate: new Date(startDate.getTime()),
        mainDate: new Date(startDate.getTime()),
        expectedCount: ruleObject.count ? ruleObject.count : maxOccurrence,
        monthInit: 0,
        dateCollection: [],
    };
    if (ruleObject.month.length) {
        calendarUtil.setMonth(ruleData.tempDate, ruleObject.month[0], ruleData.tempDate.getDate());
    }
    return ruleData;
}
function monthlyDateTypeProcess(startDate, endDate, data, ruleObject) {
    if (ruleObject.month.length) {
        monthlyDateTypeProcessforMonthFreq(startDate, endDate, data, ruleObject);
        return;
    }
    let ruleData = initializeRecRuleVariables(startDate, ruleObject);
    let currentMonthDate;
    ruleData.tempDate = ruleData.mainDate = calendarUtil.getMonthStartDate(ruleData.tempDate);
    while (compareDates(ruleData.tempDate, endDate)) {
        currentMonthDate = new Date(ruleData.tempDate.getTime());
        while (calendarUtil.isSameYear(currentMonthDate, ruleData.tempDate) &&
            (ruleData.expectedCount && (data.length + tempExcludeDate.length) <= ruleData.expectedCount)) {
            if (ruleObject.month.length === 0 || (ruleObject.month.length > 0
                && !calendarUtil.checkMonth(ruleData.tempDate, ruleObject.month))) {
                processDateCollectionForByMonthDay(ruleObject, ruleData, endDate, false);
                ruleData.beginDate = new Date(ruleData.tempDate.getTime());
                ruleData.monthInit = setNextValidDate(ruleData.tempDate, ruleObject, ruleData.monthInit, ruleData.beginDate);
            }
            else {
                calendarUtil.setValidDate(ruleData.tempDate, 1, 1);
                ruleData.tempDate = getStartDateForWeek(ruleData.tempDate, ruleObject.day);
                break;
            }
        }
        ruleData.tempDate.setFullYear(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), currentMonthDate.getDate());
        insertDataCollection(ruleData.dateCollection, ruleData.state, startDate, endDate, data, ruleObject);
        if (calendarUtil.isLastMonth(ruleData.tempDate)) {
            calendarUtil.setValidDate(ruleData.tempDate, 1, 1);
            ruleData.tempDate = getStartDateForWeek(ruleData.tempDate, ruleObject.day);
        }
        if (ruleData.expectedCount && (data.length + tempExcludeDate.length) >= ruleData.expectedCount) {
            return;
        }
        ruleData.tempDate.setFullYear(ruleData.tempDate.getFullYear() + ruleObject.interval - 1);
        ruleData.tempDate = getStartDateForWeek(ruleData.tempDate, ruleObject.day);
        ruleData.monthInit = setNextValidDate(ruleData.tempDate, ruleObject, ruleData.monthInit, ruleData.beginDate);
        ruleData.dateCollection = [];
    }
}
function monthlyDateTypeProcessforMonthFreq(startDate, endDate, data, ruleObject) {
    let ruleData = initializeRecRuleVariables(startDate, ruleObject);
    ruleData.tempDate = ruleData.mainDate = calendarUtil.getMonthStartDate(ruleData.tempDate);
    while (compareDates(ruleData.tempDate, endDate)) {
        ruleData.beginDate = new Date(ruleData.tempDate.getTime());
        processDateCollectionForByMonthDay(ruleObject, ruleData, endDate, true, startDate, data);
        if (!isNullOrUndefined(ruleObject.setPosition)) {
            insertDatasIntoExistingCollection(ruleData.dateCollection, ruleData.state, startDate, endDate, data, ruleObject);
        }
        if (ruleData.expectedCount && (data.length + tempExcludeDate.length) >= ruleData.expectedCount) {
            return;
        }
        ruleData.monthInit = setNextValidDate(ruleData.tempDate, ruleObject, ruleData.monthInit, ruleData.beginDate);
        ruleData.dateCollection = [];
    }
}
// To process date collection for Monthly & Yearly based on BYMONTH Day property
function processDateCollectionForByMonthDay(ruleObject, recRuleVariables, endDate, isByMonth, startDate, data) {
    for (let index = 0; index < ruleObject.monthDay.length; index++) {
        recRuleVariables.date = ruleObject.monthDay[index];
        recRuleVariables.tempDate = calendarUtil.getMonthStartDate(recRuleVariables.tempDate);
        let maxDate = calendarUtil.getMonthDaysCount(recRuleVariables.tempDate);
        recRuleVariables.date = recRuleVariables.date > 0 ? recRuleVariables.date : (maxDate + recRuleVariables.date + 1);
        if (validateProperDate(recRuleVariables.tempDate, recRuleVariables.date, recRuleVariables.mainDate)
            && (recRuleVariables.date > 0)) {
            calendarUtil.setDate(recRuleVariables.tempDate, recRuleVariables.date);
            if (endDate && recRuleVariables.tempDate > endDate) {
                return;
            }
            if (ruleObject.day.length === 0 || ruleObject.day.indexOf(DAYINDEX[recRuleVariables.tempDate.getDay()]) > -1) {
                if (isByMonth && isNullOrUndefined(ruleObject.setPosition) && (recRuleVariables.expectedCount
                    && (data.length + tempExcludeDate.length) < recRuleVariables.expectedCount)) {
                    insertDateCollection(recRuleVariables.state, startDate, endDate, data, ruleObject, recRuleVariables.tempDate.getTime());
                }
                else {
                    recRuleVariables.dateCollection.push([recRuleVariables.tempDate.getTime()]);
                }
            }
        }
    }
}
function setNextValidDate(tempDate, ruleObject, monthInit, beginDate = null, interval) {
    let monthData = beginDate ? beginDate.getMonth() : 0;
    let startDate = calendarUtil.getMonthStartDate(tempDate);
    interval = isNullOrUndefined(interval) ? ruleObject.interval : interval;
    tempDate.setFullYear(startDate.getFullYear());
    tempDate.setMonth(startDate.getMonth());
    tempDate.setDate(startDate.getDate());
    if (ruleObject.month.length) {
        monthInit++;
        monthInit = monthInit % ruleObject.month.length;
        calendarUtil.setMonth(tempDate, ruleObject.month[monthInit], 1);
        if (monthInit === 0) {
            calendarUtil.addYears(tempDate, interval, ruleObject.month[0]);
        }
    }
    else {
        if (beginDate && (beginDate.getFullYear() < tempDate.getFullYear())) {
            monthData = tempDate.getMonth() - 1;
        }
        calendarUtil.setValidDate(tempDate, interval, 1, monthData, beginDate);
    }
    return monthInit;
}
// To get month collection when BYDAY property having more than one value in list.
function getMonthCollection(startDate, endDate, data, ruleObject) {
    let expectedDays = ruleObject.day;
    let tempDate = new Date(startDate.getTime());
    tempDate = calendarUtil.getMonthStartDate(tempDate);
    let monthCollection = [];
    let dateCollection = [];
    let dates = [];
    let index;
    let state;
    let expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    let monthInit = 0;
    let beginDate;
    if (ruleObject.month.length) {
        calendarUtil.setMonth(tempDate, ruleObject.month[0], 1);
    }
    tempDate = getStartDateForWeek(tempDate, ruleObject.day);
    while (compareDates(tempDate, endDate)
        && (expectedCount && (data.length + tempExcludeDate.length) < expectedCount)) {
        let currentMonthDate = new Date(tempDate.getTime());
        let isHavingNumber = expectedDays.map((item) => HASNUMBER.test(item));
        if (isHavingNumber.indexOf(true) > -1) {
            for (let j = 0; j <= expectedDays.length - 1; j++) {
                let expectedDaysArray = expectedDays[j].match(SPLITNUMBERANDSTRING);
                let position = parseInt(expectedDaysArray[0], 10);
                tempDate = new Date(tempDate.getTime());
                tempDate = calendarUtil.getMonthStartDate(tempDate);
                tempDate = getStartDateForWeek(tempDate, expectedDays);
                currentMonthDate.setFullYear(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
                while (calendarUtil.isSameYear(currentMonthDate, tempDate) && calendarUtil.isSameMonth(currentMonthDate, tempDate)) {
                    if (expectedDaysArray[expectedDaysArray.length - 1] === DAYINDEX[currentMonthDate.getDay()]) {
                        monthCollection.push([currentMonthDate.getTime()]);
                    }
                    currentMonthDate.setDate(currentMonthDate.getDate() + (1));
                }
                currentMonthDate.setDate(currentMonthDate.getDate() - (1));
                if (expectedDaysArray[0].indexOf('-') > -1) {
                    index = monthCollection.length - (-1 * position);
                }
                else {
                    index = position - 1;
                }
                index = isNaN(index) ? 0 : index;
                if (monthCollection.length > 0) {
                    (isNullOrUndefined(ruleObject.setPosition)) ?
                        insertDatasIntoExistingCollection(monthCollection, state, startDate, endDate, data, ruleObject, index) :
                        dateCollection = [(filterDateCollectionByIndex(monthCollection, index, dates))];
                }
                if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                    return;
                }
                monthCollection = [];
            }
            if (!isNullOrUndefined(ruleObject.setPosition)) {
                insertDateCollectionBasedonBySetPos(dateCollection, state, startDate, endDate, data, ruleObject);
                dates = [];
            }
            monthInit = setNextValidDate(tempDate, ruleObject, monthInit, beginDate);
            tempDate = getStartDateForWeek(tempDate, ruleObject.day);
            monthCollection = [];
        }
        else {
            let weekCollection = [];
            let dayCycleData = processWeekDays(expectedDays);
            currentMonthDate.setFullYear(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
            let initialDate = new Date(tempDate.getTime());
            beginDate = new Date(tempDate.getTime());
            while (calendarUtil.isSameMonth(initialDate, tempDate)) {
                weekCollection.push(tempDate.getTime());
                if (expectedDays.indexOf(DAYINDEX[tempDate.getDay()]) > -1) {
                    monthCollection.push(weekCollection);
                    weekCollection = [];
                }
                tempDate.setDate(tempDate.getDate()
                    + dayCycleData[DAYINDEX[tempDate.getDay()]]);
            }
            index = ((ruleObject.setPosition < 1) ? (monthCollection.length + ruleObject.setPosition) : ruleObject.setPosition - 1);
            if (isNullOrUndefined(ruleObject.setPosition)) {
                index = 0;
                let datas = [];
                for (let week = 0; week < monthCollection.length; week++) {
                    for (let row = 0; row < monthCollection[week].length; row++) {
                        datas.push(monthCollection[week][row]);
                    }
                }
                monthCollection = [datas];
            }
            if (monthCollection.length > 0) {
                insertDatasIntoExistingCollection(monthCollection, state, startDate, endDate, data, ruleObject, index);
            }
            if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                return;
            }
            monthInit = setNextValidDate(tempDate, ruleObject, monthInit, beginDate);
            tempDate = getStartDateForWeek(tempDate, ruleObject.day);
            monthCollection = [];
        }
    }
}
// To process monday day type for FREQ=MONTHLY
function monthlyDayTypeProcessforMonthFreq(startDate, endDate, data, ruleObject) {
    let expectedDays = ruleObject.day;
    // When BYDAY property having more than 1 value.
    if (expectedDays.length > 1) {
        getMonthCollection(startDate, endDate, data, ruleObject);
        return;
    }
    let tempDate = new Date(startDate.getTime());
    let expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    let monthCollection = [];
    let beginDate;
    let monthInit = 0;
    tempDate = calendarUtil.getMonthStartDate(tempDate);
    if (ruleObject.month.length) {
        calendarUtil.setMonth(tempDate, ruleObject.month[0], 1);
    }
    tempDate = getStartDateForWeek(tempDate, ruleObject.day);
    while (compareDates(tempDate, endDate) && (expectedCount && (data.length + tempExcludeDate.length) < expectedCount)) {
        beginDate = new Date(tempDate.getTime());
        let currentMonthDate = new Date(tempDate.getTime());
        while (calendarUtil.isSameMonth(tempDate, currentMonthDate)) {
            monthCollection.push([currentMonthDate.getTime()]);
            currentMonthDate.setDate(currentMonthDate.getDate() + (7));
        }
        // To filter date collection based on BYDAY Index, then BYSETPOS and to insert datas into existing collection
        insertDateCollectionBasedonIndex(monthCollection, startDate, endDate, data, ruleObject);
        monthInit = setNextValidDate(tempDate, ruleObject, monthInit, beginDate);
        tempDate = getStartDateForWeek(tempDate, ruleObject.day);
        monthCollection = [];
    }
}
// To process monday day type for FREQ=YEARLY
function monthlyDayTypeProcess(startDate, endDate, data, ruleObject) {
    let expectedDays = ruleObject.day;
    let isHavingNumber = expectedDays.map((item) => HASNUMBER.test(item));
    // If BYDAY property having more than 1 value in list
    if (expectedDays.length > 1 && isHavingNumber.indexOf(true) > -1) {
        processDateCollectionforByDayWithInteger(startDate, endDate, data, ruleObject);
        return;
    }
    else if (ruleObject.month.length && expectedDays.length === 1 && isHavingNumber.indexOf(true) > -1) {
        monthlyDayTypeProcessforMonthFreq(startDate, endDate, data, ruleObject);
        return;
    }
    let tempDate = new Date(startDate.getTime());
    let currentMonthDate;
    let expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    let interval = ruleObject.interval;
    let monthCollection = [];
    if (ruleObject.month.length) {
        calendarUtil.setMonth(tempDate, ruleObject.month[0], tempDate.getDate());
    }
    // Set the date as start date of the yeear if yearly freq having ByDay property alone
    if (isNullOrUndefined(ruleObject.setPosition) && ruleObject.month.length === 0 && ruleObject.weekNo.length === 0) {
        tempDate.setFullYear(startDate.getFullYear(), 0, 1);
    }
    tempDate = calendarUtil.getMonthStartDate(tempDate);
    tempDate = getStartDateForWeek(tempDate, ruleObject.day);
    while (compareDates(tempDate, endDate)) {
        currentMonthDate = new Date(tempDate.getTime());
        while (calendarUtil.isSameYear(currentMonthDate, tempDate) &&
            (expectedCount && (data.length + tempExcludeDate.length) <= expectedCount)) {
            currentMonthDate = new Date(tempDate.getTime());
            while (calendarUtil.isSameYear(currentMonthDate, tempDate)) {
                if (ruleObject.month.length === 0 || (ruleObject.month.length > 0
                    && !calendarUtil.checkMonth(tempDate, ruleObject.month))) {
                    if (expectedDays.length > 1) {
                        if (calendarUtil.compareMonth(currentMonthDate, tempDate)) {
                            calendarUtil.setValidDate(tempDate, 1, 1);
                            tempDate = getStartDateForWeek(tempDate, ruleObject.day);
                            break;
                        }
                        if (expectedDays.indexOf(DAYINDEX[currentMonthDate.getDay()]) > -1) {
                            monthCollection.push([currentMonthDate.getTime()]);
                        }
                        currentMonthDate.setDate(currentMonthDate.getDate() + (1));
                    }
                    else {
                        // If BYDAY property having 1 value in list
                        if (currentMonthDate.getFullYear() > tempDate.getFullYear()) {
                            calendarUtil.setValidDate(tempDate, 1, 1);
                            tempDate = getStartDateForWeek(tempDate, ruleObject.day);
                            break;
                        }
                        let newstr = getDayString(expectedDays[0]);
                        if (DAYINDEX[currentMonthDate.getDay()] === newstr
                            && new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 0)
                                > new Date(startDate.getFullYear())) {
                            monthCollection.push([currentMonthDate.getTime()]);
                        }
                        currentMonthDate.setDate(currentMonthDate.getDate() + (7));
                    }
                }
                else {
                    calendarUtil.setValidDate(tempDate, 1, 1);
                    tempDate = getStartDateForWeek(tempDate, ruleObject.day);
                    break;
                }
            }
        }
        tempDate.setFullYear(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), currentMonthDate.getDate());
        // To filter date collection based on BYDAY Index, then BYSETPOS and to insert datas into existing collection
        insertDateCollectionBasedonIndex(monthCollection, startDate, endDate, data, ruleObject);
        if (calendarUtil.isLastMonth(tempDate)) {
            calendarUtil.setValidDate(tempDate, 1, 1);
            tempDate = getStartDateForWeek(tempDate, ruleObject.day);
        }
        tempDate.setFullYear(tempDate.getFullYear() + interval - 1);
        if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
            return;
        }
        tempDate = getStartDateForWeek(tempDate, ruleObject.day);
        monthCollection = [];
    }
}
// To process the recurrence rule when BYDAY property having values with integer
function processDateCollectionforByDayWithInteger(startDate, endDate, data, ruleObject) {
    let expectedDays = ruleObject.day;
    let expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    let tempDate = new Date(startDate.getTime());
    let interval = ruleObject.interval;
    let monthCollection = [];
    let dateCollection = [];
    let index;
    let state;
    let monthInit = 0;
    let currentMonthDate;
    let currentDate;
    let beginDate;
    tempDate = calendarUtil.getMonthStartDate(tempDate);
    let datas = [];
    if (ruleObject.month.length) {
        calendarUtil.setMonth(tempDate, ruleObject.month[0], 1);
    }
    tempDate = getStartDateForWeek(tempDate, ruleObject.day);
    while (compareDates(tempDate, endDate)) {
        currentMonthDate = new Date(tempDate.getTime());
        for (let i = 0; i <= ruleObject.month.length; i++) {
            for (let j = 0; j <= expectedDays.length - 1; j++) {
                tempDate = calendarUtil.getMonthStartDate(tempDate);
                tempDate = getStartDateForWeek(tempDate, ruleObject.day);
                monthCollection = [];
                while (calendarUtil.isSameYear(currentMonthDate, tempDate) &&
                    (expectedCount && (data.length + tempExcludeDate.length) <= expectedCount)) {
                    while (calendarUtil.isSameYear(currentMonthDate, tempDate)) {
                        currentMonthDate = new Date(tempDate.getTime());
                        if (ruleObject.month.length === 0 ||
                            (ruleObject.month.length > 0 && ruleObject.month[i] === calendarUtil.getMonth(currentMonthDate))) {
                            let expectedDaysArray = expectedDays[j].match(SPLITNUMBERANDSTRING);
                            let position = parseInt(expectedDaysArray[0], 10);
                            currentDate = new Date(tempDate.getTime());
                            while (calendarUtil.isSameYear(currentDate, tempDate)
                                && calendarUtil.isSameMonth(currentDate, tempDate)) {
                                if (expectedDaysArray[expectedDaysArray.length - 1] === DAYINDEX[currentDate.getDay()]) {
                                    monthCollection.push([currentDate.getTime()]);
                                }
                                currentDate.setDate(currentDate.getDate() + (1));
                            }
                            currentDate.setDate(currentDate.getDate() - (1));
                            if (expectedDaysArray[0].indexOf('-') > -1) {
                                index = monthCollection.length - (-1 * position);
                            }
                            else {
                                index = position - 1;
                            }
                            index = isNaN(index) ? 0 : index;
                        }
                        monthInit = setNextValidDate(tempDate, ruleObject, monthInit, beginDate, 1);
                        tempDate = getStartDateForWeek(tempDate, ruleObject.day);
                    }
                }
                tempDate = j === 0 && currentDate ? new Date(currentDate.getTime()) : new Date(currentMonthDate.getTime());
                if (monthCollection.length > 0) {
                    (isNullOrUndefined(ruleObject.setPosition)) ?
                        insertDatasIntoExistingCollection(monthCollection, state, startDate, endDate, data, ruleObject, index) :
                        dateCollection = [(filterDateCollectionByIndex(monthCollection, index, datas))];
                }
                if (expectedCount && (data.length + tempExcludeDate.length) >= expectedCount) {
                    return;
                }
            }
        }
        if (!isNullOrUndefined(ruleObject.setPosition)) {
            insertDateCollectionBasedonBySetPos(dateCollection, state, startDate, endDate, data, ruleObject);
            datas = [];
        }
        if (calendarUtil.isLastMonth(tempDate)) {
            calendarUtil.setValidDate(tempDate, 1, 1);
            tempDate.setFullYear(tempDate.getFullYear() + interval - 1);
        }
        else {
            tempDate.setFullYear(tempDate.getFullYear() + interval);
        }
        tempDate = getStartDateForWeek(tempDate, ruleObject.day);
        if (ruleObject.month.length) {
            calendarUtil.setMonth(tempDate, ruleObject.month[0], tempDate.getDate());
        }
    }
}
// To get recurrence collection if BYSETPOS is null
function getRecurrenceCollection(monthCollection, expectedDays) {
    let index;
    let recurrenceCollectionObject = {
        monthCollection: [],
        index: 0,
    };
    if (expectedDays.length === 1) {
        // To split numeric value from BYDAY property value
        let expectedDaysArrays = expectedDays[0].match(SPLITNUMBERANDSTRING);
        let arrPosition;
        if (expectedDaysArrays.length > 1) {
            arrPosition = parseInt(expectedDaysArrays[0], 10);
            index = ((arrPosition < 1) ? (monthCollection.length + arrPosition) : arrPosition - 1);
        }
        else {
            index = 0;
            monthCollection = getDateCollectionforBySetPosNull(monthCollection);
        }
    }
    else {
        index = 0;
        monthCollection = getDateCollectionforBySetPosNull(monthCollection);
    }
    recurrenceCollectionObject.monthCollection = monthCollection;
    recurrenceCollectionObject.index = index;
    return recurrenceCollectionObject;
}
function insertDataCollection(dateCollection, state, startDate, endDate, data, ruleObject) {
    let index = ((ruleObject.setPosition < 1) ?
        (dateCollection.length + ruleObject.setPosition) : ruleObject.setPosition - 1);
    if (isNullOrUndefined(ruleObject.setPosition)) {
        index = 0;
        dateCollection = getDateCollectionforBySetPosNull(dateCollection);
    }
    if (dateCollection.length > 0) {
        insertDatasIntoExistingCollection(dateCollection, state, startDate, endDate, data, ruleObject, index);
    }
}
// To process month collection if BYSETPOS is null
function getDateCollectionforBySetPosNull(monthCollection) {
    let datas = [];
    for (let week = 0; week < monthCollection.length; week++) {
        for (let row = 0; row < monthCollection[week].length; row++) {
            datas.push(new Date(monthCollection[week][row]).getTime());
        }
    }
    monthCollection = datas.length > 0 ? [datas] : [];
    return monthCollection;
}
// To filter date collection based on BYDAY Index, then BYSETPOS and to insert datas into existing collection
function insertDateCollectionBasedonIndex(monthCollection, startDate, endDate, data, ruleObject) {
    let expectedDays = ruleObject.day;
    let index;
    let state;
    let datas = [];
    let dateCollection = [];
    let recurrenceCollections;
    recurrenceCollections = getRecurrenceCollection(monthCollection, expectedDays);
    monthCollection = recurrenceCollections.monthCollection;
    index = recurrenceCollections.index;
    if (ruleObject.setPosition != null) {
        dateCollection = [(filterDateCollectionByIndex(monthCollection, index, datas))];
        insertDateCollectionBasedonBySetPos(dateCollection, state, startDate, endDate, data, ruleObject);
    }
    else {
        if (monthCollection.length > 0) {
            insertDatasIntoExistingCollection(monthCollection, state, startDate, endDate, data, ruleObject, index);
        }
    }
    datas = [];
}
// To filter date collection when BYDAY property having values with number
function filterDateCollectionByIndex(monthCollection, index, datas) {
    for (let week = 0; week < monthCollection[index].length; week++) {
        datas.push(monthCollection[index][week]);
    }
    return datas;
}
// To insert processed date collection in final array element
function insertDateCollection(state, startDate, endDate, data, ruleObject, dayData) {
    let expectedCount = ruleObject.count ? ruleObject.count : maxOccurrence;
    let chDate = new Date(dayData);
    state = validateRules(chDate, ruleObject);
    if ((chDate >= startDate) && compareDates(chDate, endDate) && state
        && expectedCount && (data.length + tempExcludeDate.length) < expectedCount) {
        excludeDateHandler(data, dayData);
    }
}
// To process datte collection based on Byset position after process the collection based on BYDAY property value index: EX:BYDAY=1SUm-1SU
function insertDateCollectionBasedonBySetPos(monthCollection, state, startDate, endDate, data, ruleObject) {
    if (monthCollection.length > 0) {
        for (let week = 0; week < monthCollection.length; week++) {
            monthCollection[week].sort();
            let index = ((ruleObject.setPosition < 1)
                ? (monthCollection[week].length + ruleObject.setPosition) : ruleObject.setPosition - 1);
            let dayData = monthCollection[week][index];
            insertDateCollection(state, startDate, endDate, data, ruleObject, dayData);
        }
    }
}
// To insert datas into existing collection which is processed from previous loop.
function insertDatasIntoExistingCollection(monthCollection, state, startDate, endDate, data, ruleObject, index) {
    index = !isNullOrUndefined(index) ? index :
        ((ruleObject.setPosition < 1)
            ? (monthCollection.length + ruleObject.setPosition) : ruleObject.setPosition - 1);
    monthCollection[index].sort();
    for (let week = 0; week < monthCollection[index].length; week++) {
        let dayData = monthCollection[index][week];
        insertDateCollection(state, startDate, endDate, data, ruleObject, dayData);
    }
}
function compareDates(startDate, endDate) {
    return endDate ? (startDate <= endDate) : true;
}
function getDayString(expectedDays) {
    // To get BYDAY value without numeric value
    let newstr = expectedDays.replace(REMOVENUMBERINSTRING, '');
    return newstr;
}
function checkDayIndex(day, expectedDays) {
    let sortedExpectedDays = [];
    expectedDays.forEach((element) => {
        let expectedDaysNumberSplit = element.match(SPLITNUMBERANDSTRING);
        if (expectedDaysNumberSplit.length === 2) {
            sortedExpectedDays.push(expectedDaysNumberSplit[1]);
        }
        else {
            sortedExpectedDays.push(expectedDaysNumberSplit[0]);
        }
    });
    return (sortedExpectedDays.indexOf(DAYINDEX[day]) === -1);
}
function getStartDateForWeek(startDate, expectedDays) {
    let tempDate = new Date(startDate.getTime());
    let newstr;
    if (expectedDays.length > 0) {
        let expectedDaysArr = [];
        for (let i = 0; i <= expectedDays.length - 1; i++) {
            newstr = getDayString(expectedDays[i]);
            expectedDaysArr.push(newstr);
        }
        if (expectedDaysArr.indexOf(DAYINDEX[tempDate.getDay()]) === -1) {
            do {
                tempDate.setDate(tempDate.getDate() + 1);
            } while (expectedDaysArr.indexOf(DAYINDEX[tempDate.getDay()]) === -1);
        }
    }
    return tempDate;
}
function extractObjectFromRule(rules) {
    let ruleObject = {
        freq: null,
        interval: 1,
        count: null,
        until: null,
        day: [],
        wkst: null,
        month: [],
        weekNo: [],
        monthDay: [],
        yearDay: [],
        setPosition: null,
        validRules: []
    };
    let rulesList = rules.split(';');
    let splitData = [];
    let temp;
    rulesList.forEach((data) => {
        splitData = data.split('=');
        switch (splitData[0]) {
            case 'UNTIL':
                temp = splitData[1];
                ruleObject.until = getDateFromRecurrenceDateString(temp);
                break;
            case 'BYDAY':
                ruleObject.day = splitData[1].split(',');
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYMONTHDAY':
                ruleObject.monthDay = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYMONTH':
                ruleObject.month = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYYEARDAY':
                ruleObject.yearDay = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'BYWEEKNO':
                ruleObject.weekNo = splitData[1].split(',').map(Number);
                ruleObject.validRules.push(splitData[0]);
                break;
            case 'INTERVAL':
                ruleObject.interval = parseInt(splitData[1], 10);
                break;
            case 'COUNT':
                ruleObject.count = parseInt(splitData[1], 10);
                break;
            case 'BYSETPOS':
                ruleObject.setPosition = parseInt(splitData[1], 10);
                break;
            case 'FREQ':
                ruleObject.freq = splitData[1];
                break;
            case 'WKST':
                ruleObject.wkst = splitData[1];
                break;
        }
    });
    if ((ruleObject.freq === 'MONTHLY') && (ruleObject.monthDay.length === 0)) {
        let index = ruleObject.validRules.indexOf('BYDAY');
        ruleObject.validRules.splice(index, 1);
    }
    return ruleObject;
}
function validateProperDate(tempDate, data, startDate) {
    let maxDate = calendarUtil.getMonthDaysCount(tempDate);
    return (data <= maxDate) && (tempDate >= startDate);
}
function processWeekDays(expectedDays) {
    let dayCycle = {};
    expectedDays.forEach((element, index) => {
        if (index === expectedDays.length - 1) {
            let startIndex = dayIndex.indexOf(element);
            let temp = startIndex;
            while (temp % 7 !== dayIndex.indexOf(expectedDays[0])) {
                temp++;
            }
            dayCycle[element] = temp - startIndex;
        }
        else {
            dayCycle[element] = dayIndex.indexOf(expectedDays[(index + 1)]) - dayIndex.indexOf(element);
        }
    });
    return dayCycle;
}
function checkDate(tempDate, expectedDate) {
    let temp = expectedDate.slice(0);
    let data;
    let maxDate = calendarUtil.getMonthDaysCount(tempDate);
    data = temp.shift();
    while (data) {
        if (data < 0) {
            data = data + maxDate + 1;
        }
        if (data === tempDate.getDate()) {
            return false;
        }
        data = temp.shift();
    }
    return true;
}
function checkYear(tempDate, expectedyearDay) {
    let temp = expectedyearDay.slice(0);
    let data;
    let yearDay = getYearDay(tempDate);
    data = temp.shift();
    while (data) {
        if (data < 0) {
            data = data + calendarUtil.getYearDaysCount(tempDate, 0) + 1;
        }
        if (data === yearDay) {
            return false;
        }
        data = temp.shift();
    }
    return true;
}
function getYearDay(currentDate) {
    if (!startDateCollection[calendarUtil.getFullYear(currentDate)]) {
        startDateCollection[calendarUtil.getFullYear(currentDate)] = calendarUtil.getYearLastDate(currentDate, 0);
    }
    let tempDate = startDateCollection[calendarUtil.getFullYear(currentDate)];
    let diff = currentDate.getTime() - tempDate.getTime();
    return Math.ceil(diff / MS_PER_DAY);
}
function validateMonthlyRuleType(ruleObject) {
    if (ruleObject.monthDay.length && !ruleObject.day.length) {
        return 'date';
    }
    else if (!ruleObject.monthDay.length && ruleObject.day.length) {
        return 'day';
    }
    return 'both';
}
function rotate(days) {
    let data = days.shift();
    days.push(data);
}
function setFirstDayOfWeek(day) {
    while (dayIndex[0] !== day) {
        rotate(dayIndex);
    }
}
function validateRules(tempDate, ruleObject) {
    let state = true;
    let expectedDays = ruleObject.day;
    let expectedMonth = ruleObject.month;
    let expectedDate = calendarUtil.getExpectedDays(tempDate, ruleObject.monthDay);
    let expectedyearDay = ruleObject.yearDay;
    ruleObject.validRules.forEach((rule) => {
        switch (rule) {
            case 'BYDAY':
                if (checkDayIndex(tempDate.getDay(), expectedDays)) {
                    state = false;
                }
                break;
            case 'BYMONTH':
                if (calendarUtil.checkMonth(tempDate, expectedMonth)) {
                    state = false;
                }
                break;
            case 'BYMONTHDAY':
                if (checkDate(tempDate, expectedDate)) {
                    state = false;
                }
                break;
            case 'BYYEARDAY':
                if (checkYear(tempDate, expectedyearDay)) {
                    state = false;
                }
                break;
        }
    });
    return state;
}
function getCalendarUtil(calendarMode) {
    if (calendarMode === 'Islamic') {
        return new Islamic();
    }
    return new Gregorian();
}
let startDateCollection = {};
let tempExcludeDate;
let dayIndex = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
let maxOccurrence;
let tempViewDate;
let calendarUtil;
const DAYINDEX = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const MAXOCCURRENCE = 43;
const WEEKPOS = ['first', 'second', 'third', 'fourth', 'last'];
const TIMES = 'summaryTimes';
const ON = 'summaryOn';
const EVERY = 'every';
const UNTIL = 'summaryUntil';
const DAYS = 'summaryDay';
const WEEKS = 'summaryWeek';
const MONTHS = 'summaryMonth';
const YEARS = 'summaryYear';
const DAYINDEXOBJECT = {
    SU: 'sun',
    MO: 'mon',
    TU: 'tue',
    WE: 'wed',
    TH: 'thu',
    FR: 'fri',
    SA: 'sat'
};
// To check string has number
const HASNUMBER = /\d/;
// To find the numbers in string
const REMOVENUMBERINSTRING = /[^A-Z]+/;
// To split number and string
const SPLITNUMBERANDSTRING = /[a-z]+|[^a-z]+/gi;
function getRecurrenceStringFromDate(date) {
    return [date.getUTCFullYear(),
        roundDateValues(date.getUTCMonth() + 1),
        roundDateValues(date.getUTCDate()),
        'T',
        roundDateValues(date.getUTCHours()),
        roundDateValues(date.getUTCMinutes()),
        roundDateValues(date.getUTCSeconds()),
        'Z'].join('');
}
function roundDateValues(date) {
    return ('0' + date).slice(-2);
}

/**
 * EventBase for appointment rendering
 */
class EventBase {
    /**
     * Constructor for EventBase
     */
    constructor(parent) {
        this.slots = [];
        this.parent = parent;
        this.timezone = new Timezone();
    }
    processData(events, timeZonePropChanged, oldTimezone) {
        let start = this.parent.activeView.startDate();
        let end = this.parent.activeView.endDate();
        let fields = this.parent.eventFields;
        this.parent.eventsProcessed = [];
        let processed = [];
        let temp = 1;
        let generateID = false;
        if (events.length > 0 && isNullOrUndefined(events[0][fields.id])) {
            generateID = true;
        }
        for (let event of events) {
            if (generateID) {
                event[fields.id] = temp++;
            }
            if (typeof event[fields.startTime] === 'string') {
                event[fields.startTime] = getDateFromString(event[fields.startTime]);
            }
            if (typeof event[fields.endTime] === 'string') {
                event[fields.endTime] = getDateFromString(event[fields.endTime]);
            }
            if (timeZonePropChanged) {
                this.processTimezoneChange(event, oldTimezone);
            }
            else {
                this.processTimezone(event);
            }
            if (!isNullOrUndefined(event[fields.recurrenceRule]) && event[fields.recurrenceRule] === '') {
                event[fields.recurrenceRule] = null;
            }
            if (!isNullOrUndefined(event[fields.recurrenceRule]) && isNullOrUndefined(event[fields.recurrenceID])) {
                processed = processed.concat(this.generateOccurrence(event));
            }
            else {
                event.Guid = this.generateGuid();
                processed.push(event);
            }
        }
        let eventData = processed.filter((data) => !data[this.parent.eventFields.isBlock]);
        this.parent.eventsProcessed = this.filterEvents(start, end, eventData);
        let blockData = processed.filter((data) => data[this.parent.eventFields.isBlock]);
        blockData.forEach((eventObj) => {
            if (eventObj[fields.isAllDay]) {
                eventObj[fields.startTime] = resetTime(eventObj[fields.startTime]);
                eventObj[fields.endTime] = addDays(resetTime(eventObj[fields.endTime]), 1);
            }
        });
        this.parent.blockProcessed = blockData;
        return eventData;
    }
    getProcessedEvents(eventCollection = this.parent.eventsData) {
        let processed = [];
        for (let event of eventCollection) {
            if (!isNullOrUndefined(event[this.parent.eventFields.recurrenceRule]) &&
                isNullOrUndefined(event[this.parent.eventFields.recurrenceID])) {
                processed = processed.concat(this.parent.eventBase.generateOccurrence(event));
            }
            else {
                processed.push(event);
            }
        }
        return processed;
    }
    timezonePropertyChange(oldTimezone) {
        let processed = this.processData(this.parent.eventsData, true, oldTimezone);
        this.parent.notify(dataReady, { processedData: processed });
    }
    /** @private */
    timezoneConvert(eventData) {
        let fields = this.parent.eventFields;
        eventData[fields.startTimezone] = eventData[fields.startTimezone] || eventData[fields.endTimezone];
        eventData[fields.endTimezone] = eventData[fields.endTimezone] || eventData[fields.startTimezone];
        if (this.parent.timezone) {
            let startTz = eventData[fields.startTimezone];
            let endTz = eventData[fields.endTimezone];
            eventData[fields.startTime] =
                this.timezone.convert(eventData[fields.startTime], this.parent.timezone, startTz);
            eventData[fields.endTime] =
                this.timezone.convert(eventData[fields.endTime], this.parent.timezone, endTz);
        }
    }
    processTimezoneChange(event, oldTimezone) {
        let fields = this.parent.eventFields;
        if (oldTimezone && this.parent.timezone) {
            event[fields.startTime] = this.timezone.convert(event[fields.startTime], oldTimezone, this.parent.timezone);
            event[fields.endTime] = this.timezone.convert(event[fields.endTime], oldTimezone, this.parent.timezone);
        }
        else if (!oldTimezone && this.parent.timezone) {
            event[fields.startTime] = this.timezone.add(event[fields.startTime], this.parent.timezone);
            event[fields.endTime] = this.timezone.add(event[fields.endTime], this.parent.timezone);
        }
        else if (oldTimezone && !this.parent.timezone) {
            event[fields.startTime] = this.timezone.remove(event[fields.startTime], oldTimezone);
            event[fields.endTime] = this.timezone.remove(event[fields.endTime], oldTimezone);
        }
    }
    processTimezone(event) {
        let fields = this.parent.eventFields;
        if (event[fields.startTimezone] || event[fields.endTimezone]) {
            let startTimezone = event[fields.startTimezone] || event[fields.endTimezone];
            let endTimezone = event[fields.endTimezone] || event[fields.startTimezone];
            event[fields.startTime] = this.timezone.add(event[fields.startTime], startTimezone);
            event[fields.endTime] = this.timezone.add(event[fields.endTime], endTimezone);
            if (this.parent.timezone) {
                let zone = this.parent.timezone;
                event[fields.startTime] = this.timezone.convert(event[fields.startTime], startTimezone, zone);
                event[fields.endTime] = this.timezone.convert(event[fields.endTime], endTimezone, zone);
            }
        }
        else if (this.parent.timezone) {
            event[fields.startTime] = this.timezone.add(event[fields.startTime], this.parent.timezone);
            event[fields.endTime] = this.timezone.add(event[fields.endTime], this.parent.timezone);
        }
    }
    filterBlockEvents(eventObj) {
        let eStart = eventObj[this.parent.eventFields.startTime];
        let eEnd = eventObj[this.parent.eventFields.endTime];
        let resourceData;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            let data = this.getGroupIndexFromEvent(eventObj);
            resourceData = this.parent.resourceBase.lastResourceLevel[data];
        }
        return this.filterEvents(eStart, eEnd, this.parent.blockProcessed, resourceData);
    }
    filterEvents(startDate, endDate, appointments = this.parent.eventsProcessed, resourceTdData) {
        let fieldMapping = this.parent.eventFields;
        let predicate = new Predicate(fieldMapping.startTime, 'greaterthanorequal', startDate).
            and(new Predicate(fieldMapping.endTime, 'greaterthanorequal', startDate)).
            and(new Predicate(fieldMapping.startTime, 'lessthan', endDate)).
            or(new Predicate(fieldMapping.startTime, 'lessthanorequal', startDate).
            and(new Predicate(fieldMapping.endTime, 'greaterthan', startDate)));
        let filter = new DataManager({ json: appointments }).executeLocal(new Query().where(predicate));
        if (resourceTdData) {
            filter = this.filterEventsByResource(resourceTdData, filter);
        }
        return this.sortByTime(filter);
    }
    filterEventsByRange(eventCollection, startDate, endDate) {
        let filteredEvents = [];
        if (startDate && endDate) {
            filteredEvents = this.filterEvents(startDate, endDate, eventCollection);
        }
        else if (startDate && !endDate) {
            let predicate = new Predicate(this.parent.eventFields.startTime, 'greaterthanorequal', startDate);
            filteredEvents = new DataManager({ json: eventCollection }).executeLocal(new Query().where(predicate));
        }
        else if (!startDate && endDate) {
            let predicate = new Predicate(this.parent.eventFields.endTime, 'lessthanorequal', endDate);
            filteredEvents = new DataManager({ json: eventCollection }).executeLocal(new Query().where(predicate));
        }
        else {
            filteredEvents = eventCollection;
        }
        return this.sortByTime(filteredEvents);
    }
    filterEventsByResource(resourceTdData, appointments = this.parent.eventsProcessed) {
        let predicate;
        let resourceCollection = this.parent.resourceBase.resourceCollection;
        for (let level = 0; level < resourceCollection.length; level++) {
            let operator = this.parent.activeViewOptions.group.allowGroupEdit && resourceCollection[level].allowMultiple ?
                'contains' : 'equal';
            let tempPredicate = new Predicate(resourceCollection[level].field, operator, resourceTdData.groupOrder[level]);
            predicate = predicate ? predicate.and(tempPredicate) : tempPredicate;
        }
        return new DataManager({ json: appointments }).executeLocal(new Query().where(predicate));
    }
    sortByTime(appointments) {
        let fieldMapping = this.parent.eventFields;
        appointments.sort((a, b) => {
            let d1 = a[fieldMapping.startTime];
            let d2 = b[fieldMapping.startTime];
            return d1.getTime() - d2.getTime();
        });
        return appointments;
    }
    sortByDateTime(appointments) {
        let fieldMapping = this.parent.eventFields;
        appointments.sort((object1, object2) => {
            let d3 = object1[fieldMapping.startTime];
            let d4 = object2[fieldMapping.startTime];
            let d5 = object1[fieldMapping.endTime];
            let d6 = object2[fieldMapping.endTime];
            let d1 = d5.getTime() - d3.getTime();
            let d2 = d6.getTime() - d4.getTime();
            return (d3.getTime() - d4.getTime() || d2 - d1);
        });
        return appointments;
    }
    getSmallestMissingNumber(array) {
        let large = Math.max.apply(Math, array);
        for (let i = 0; i < large; i++) {
            if (array.indexOf(i) === -1) {
                return i;
            }
        }
        return large + 1;
    }
    splitEventByDay(event) {
        let eventFields = this.parent.eventFields;
        let data = [];
        let eventStartTime = event[eventFields.startTime];
        let eventEndTime = event[eventFields.endTime];
        let isDifferentDate = resetTime(new Date(eventStartTime.getTime())) <
            resetTime(new Date(eventEndTime.getTime()));
        if (isDifferentDate) {
            let start = new Date(eventStartTime.getTime());
            let end = addDays(resetTime(new Date(eventStartTime.getTime())), 1);
            let endDate = (eventEndTime.getHours() === 0 && eventEndTime.getMinutes() === 0) ?
                eventEndTime : addDays(eventEndTime, 1);
            let index = 1;
            let eventLength = getDaysCount(eventStartTime.getTime(), endDate.getTime());
            while (end <= eventEndTime) {
                let app = extend({}, event);
                app[eventFields.startTime] = start;
                app[eventFields.endTime] = end;
                app.data = { index: index, count: eventLength };
                app.Guid = this.generateGuid();
                app.isSpanned = true;
                data.push(app);
                start = end;
                if ((resetTime(new Date(start.getTime())).getTime() === resetTime(new Date(eventEndTime.getTime())).getTime())
                    && !(end.getTime() === eventEndTime.getTime())) {
                    end = new Date(start.getTime());
                    end = new Date(end.setHours(eventEndTime.getHours(), eventEndTime.getMinutes(), eventEndTime.getSeconds()));
                }
                else {
                    end = addDays(resetTime(new Date(start.getTime())), 1);
                }
                index++;
            }
        }
        else {
            data.push(event);
        }
        return data;
    }
    splitEvent(event, dateRender) {
        let fields = this.parent.eventFields;
        let start = resetTime(new Date(event[fields.startTime] + '')).getTime();
        let end = resetTime(new Date(event[fields.endTime] + '')).getTime();
        if (getDateInMs(event[fields.endTime]) <= 0) {
            let temp = addDays(resetTime(new Date(event[fields.endTime] + '')), -1).getTime();
            end = start > temp ? start : temp;
        }
        let orgStart = start;
        let orgEnd = end;
        let ranges = [];
        if (start !== end) {
            if (start < dateRender[0].getTime()) {
                start = dateRender[0].getTime();
            }
            if (end > dateRender[dateRender.length - 1].getTime()) {
                end = dateRender[dateRender.length - 1].getTime();
            }
            let cStart = start;
            for (let level = 0; level < this.slots.length; level++) {
                let slot = this.slots[level];
                let firstSlot = slot[0];
                cStart = (cStart <= firstSlot && end >= firstSlot) ? firstSlot : cStart;
                if (cStart > end || firstSlot > end) {
                    break;
                }
                if (!this.parent.activeViewOptions.group.byDate && this.parent.activeViewOptions.showWeekend &&
                    this.parent.currentView !== 'WorkWeek' && this.parent.currentView !== 'TimelineWorkWeek') {
                    let startIndex = slot.indexOf(cStart);
                    if (startIndex !== -1) {
                        let endIndex = slot.indexOf(end);
                        let hasBreak = endIndex !== -1;
                        endIndex = hasBreak ? endIndex : slot.length - 1;
                        let count = ((endIndex - startIndex) + 1);
                        let isLeft = (slot[startIndex] !== orgStart);
                        let isRight = (slot[endIndex] !== orgEnd);
                        ranges.push(this.cloneEventObject(event, slot[startIndex], slot[endIndex], count, isLeft, isRight));
                        if (hasBreak) {
                            break;
                        }
                    }
                }
                else {
                    if (this.dateInRange(cStart, slot[0], slot[slot.length - 1])) {
                        let availSlot = [];
                        for (let i = 0; i < slot.length; i++) {
                            if (this.dateInRange(slot[i], orgStart, orgEnd)) {
                                availSlot.push(slot[i]);
                            }
                        }
                        if (availSlot.length > 0) {
                            if (!this.parent.activeViewOptions.group.byDate) {
                                let isLeft = (availSlot[0] !== orgStart);
                                let isRight = (availSlot[availSlot.length - 1] !== orgEnd);
                                ranges.push(this.cloneEventObject(event, availSlot[0], availSlot[availSlot.length - 1], availSlot.length, isLeft, isRight));
                            }
                            else {
                                for (let slot of availSlot) {
                                    ranges.push(this.cloneEventObject(event, slot, slot, 1, (slot !== orgStart), (slot !== orgEnd)));
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            ranges.push(this.cloneEventObject(event, start, end, 1, false, false));
        }
        return ranges;
    }
    cloneEventObject(event, start, end, count, isLeft, isRight) {
        let fields = this.parent.eventFields;
        let e = extend({}, event, null, true);
        let data = { count: count, isLeft: isLeft, isRight: isRight };
        data[fields.startTime] = event[fields.startTime];
        data[fields.endTime] = event[fields.endTime];
        e.data = data;
        e[fields.startTime] = new Date(start);
        e[fields.endTime] = new Date(end);
        return e;
    }
    dateInRange(date, start, end) {
        return start <= date && date <= end;
    }
    getSelectedEventElements(target) {
        this.removeSelectedAppointmentClass();
        if (this.parent.selectedElements.length <= 0) {
            this.parent.selectedElements.push(target);
        }
        else {
            let isAlreadySelected = this.parent.selectedElements.filter((element) => {
                return element.getAttribute('data-guid') === target.getAttribute('data-guid');
            });
            if (isAlreadySelected.length <= 0) {
                let focusElements = [].slice.call(this.parent.element.
                    querySelectorAll('div[data-guid="' + target.getAttribute('data-guid') + '"]'));
                for (let element of focusElements) {
                    this.parent.selectedElements.push(element);
                }
            }
            else {
                let selectedElements = this.parent.selectedElements.filter((element) => {
                    return element.getAttribute('data-guid') !== target.getAttribute('data-guid');
                });
                this.parent.selectedElements = selectedElements;
            }
        }
        if (target && this.parent.selectedElements.length > 0) {
            this.addSelectedAppointments(this.parent.selectedElements);
        }
        return this.parent.selectedElements;
    }
    getSelectedEvents() {
        let eventSelect = [];
        let elementSelect = [];
        let selectAppointments = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_BORDER));
        selectAppointments.filter((element) => {
            eventSelect.push(this.getEventByGuid(element.getAttribute('data-guid')));
            elementSelect.push(element);
        });
        return {
            event: eventSelect.length > 1 ? eventSelect : eventSelect[0],
            element: elementSelect.length > 1 ? elementSelect : elementSelect[0]
        };
    }
    removeSelectedAppointmentClass() {
        let selectedAppointments = this.getSelectedAppointments();
        for (let appointment of selectedAppointments) {
            appointment.setAttribute('aria-selected', 'false');
        }
        removeClass(selectedAppointments, APPOINTMENT_BORDER);
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            removeClass(selectedAppointments, AGENDA_SELECTED_CELL);
        }
    }
    addSelectedAppointments(cells) {
        for (let cell of cells) {
            cell.setAttribute('aria-selected', 'true');
        }
        this.parent.removeSelectedClass();
        addClass(cells, APPOINTMENT_BORDER);
    }
    getSelectedAppointments() {
        return [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_BORDER + ',.' + APPOINTMENT_CLASS + ':focus'));
    }
    focusElement() {
        let selectedCell = this.parent.getSelectedElements();
        if (selectedCell.length > 0) {
            if (this.parent.keyboardInteractionModule) {
                let target = ((!isNullOrUndefined(this.parent.activeCellsData) &&
                    this.parent.activeCellsData.element) || selectedCell[selectedCell.length - 1]);
                this.parent.keyboardInteractionModule.selectCells(target instanceof Array, target);
            }
            return;
        }
        let selectedAppointments = this.getSelectedAppointments();
        if (selectedAppointments.length > 0) {
            selectedAppointments[selectedAppointments.length - 1].focus();
            return;
        }
    }
    selectWorkCellByTime(eventsData) {
        let target;
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            return target;
        }
        if (eventsData.length > 0) {
            let selectedObject = eventsData[eventsData.length - 1];
            let eventStartTime = selectedObject[this.parent.eventFields.startTime];
            let nearestTime = new Date(+eventStartTime).setMinutes(0, 0, 0);
            let isAllDay = this.isAllDayAppointment(selectedObject);
            if (this.parent.currentView === 'Month' || isAllDay) {
                nearestTime = new Date(+eventStartTime).setHours(0, 0, 0, 0);
            }
            let targetArea;
            if (isAllDay && ['Day', 'Week', 'WorkWeek'].indexOf(this.parent.currentView) !== -1) {
                targetArea = this.parent.getAllDayRow();
            }
            else {
                targetArea = this.parent.getContentTable();
            }
            let queryString = '[data-date="' + nearestTime + '"]';
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                queryString += '[data-group-index="' + this.getGroupIndexFromEvent(selectedObject) + '"]';
            }
            target = targetArea.querySelector(queryString);
            if (target) {
                this.parent.activeCellsData = this.parent.getCellDetails(target);
                if (this.parent.keyboardInteractionModule) {
                    this.parent.keyboardInteractionModule.selectCells(false, target);
                }
                return target;
            }
        }
        return target;
    }
    getGroupIndexFromEvent(eventData) {
        let groupOrder = [];
        let groupIndex = 0;
        for (let resourceData of this.parent.resourceBase.resourceCollection) {
            groupOrder.push(eventData[resourceData.field]);
        }
        this.parent.resourceBase.lastResourceLevel.forEach((resource) => {
            let count;
            let order = resource.groupOrder;
            order.forEach((resIndex, index) => {
                let resValue = (groupOrder[index] instanceof Array) ? groupOrder[index][index] : groupOrder[index];
                if (resValue === resIndex) {
                    count = count ? count + 1 : 1;
                }
            });
            if (order.length === count) {
                groupIndex = resource.groupIndex;
            }
        });
        return groupIndex;
    }
    isAllDayAppointment(event) {
        let fieldMapping = this.parent.eventFields;
        let isAllDay = event[fieldMapping.isAllDay];
        let isFullDay = ((event[fieldMapping.endTime].getTime() - event[fieldMapping.startTime].getTime())
            / MS_PER_DAY) >= 1;
        return (isAllDay || isFullDay) ? true : false;
    }
    addEventListener() {
        this.parent.on(documentClick, this.appointmentBorderRemove, this);
    }
    appointmentBorderRemove(event) {
        let element = event.event.target;
        if (closest(element, '.' + APPOINTMENT_CLASS)) {
            this.parent.removeSelectedClass();
        }
        else if (!closest(element, '.' + POPUP_OPEN)) {
            this.removeSelectedAppointmentClass();
        }
    }
    wireAppointmentEvents(element, isAllDay = false, event) {
        let isReadOnly = (!isNullOrUndefined(event)) ? event[this.parent.eventFields.isReadonly] : false;
        EventHandler.add(element, 'click', this.eventClick, this);
        if (!this.parent.isAdaptive && !this.parent.activeViewOptions.readonly && !isReadOnly) {
            EventHandler.add(element, 'dblclick', this.eventDoubleClick, this);
        }
        if (!this.parent.activeViewOptions.readonly && !isReadOnly && ['Agenda', 'MonthAgenda'].indexOf(this.parent.currentView) === -1) {
            if (this.parent.resizeModule) {
                this.parent.resizeModule.wireResizeEvent(element);
            }
            if (this.parent.dragAndDropModule) {
                this.parent.dragAndDropModule.wireDragEvent(element, isAllDay);
            }
        }
    }
    renderResizeHandler(element, spanEvent, isReadOnly) {
        if (!this.parent.resizeModule || !this.parent.allowResizing || this.parent.activeViewOptions.readonly || isReadOnly) {
            return;
        }
        for (let resizeEdge of Object.keys(spanEvent)) {
            let resizeHandler = createElement('div', { className: EVENT_RESIZE_CLASS });
            switch (resizeEdge) {
                case 'isLeft':
                    if (!spanEvent.isLeft) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-left-right-resize' }));
                        addClass([resizeHandler], this.parent.enableRtl ? RIGHT_RESIZE_HANDLER : LEFT_RESIZE_HANDLER);
                        prepend([resizeHandler], element);
                    }
                    break;
                case 'isRight':
                    if (!spanEvent.isRight) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-left-right-resize' }));
                        addClass([resizeHandler], this.parent.enableRtl ? LEFT_RESIZE_HANDLER : RIGHT_RESIZE_HANDLER);
                        append([resizeHandler], element);
                    }
                    break;
                case 'isTop':
                    if (!spanEvent.isTop) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-top-bottom-resize' }));
                        addClass([resizeHandler], TOP_RESIZE_HANDLER);
                        prepend([resizeHandler], element);
                    }
                    break;
                case 'isBottom':
                    if (!spanEvent.isBottom) {
                        resizeHandler.appendChild(createElement('div', { className: 'e-top-bottom-resize' }));
                        addClass([resizeHandler], BOTTOM_RESIZE_HANDLER);
                        append([resizeHandler], element);
                    }
                    break;
            }
        }
    }
    eventClick(eventData) {
        let target = eventData.target;
        if (target.classList.contains(DRAG_CLONE_CLASS) || target.classList.contains(RESIZE_CLONE_CLASS)) {
            return;
        }
        let raiseClickEvent = (isMultiple) => {
            this.activeEventData(eventData, isMultiple);
            let selectArgs = {
                data: this.parent.activeEventData.event,
                element: this.parent.activeEventData.element,
                event: eventData, requestType: 'eventSelect'
            };
            this.parent.trigger(select, selectArgs);
            let args = extend(this.parent.activeEventData, { cancel: false, originalEvent: eventData });
            this.parent.trigger(eventClick, args);
            return args.cancel;
        };
        if (eventData.ctrlKey && eventData.which === 1 && this.parent.keyboardInteractionModule) {
            this.parent.quickPopup.quickPopup.hide();
            this.parent.selectedElements = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_BORDER));
            let target = closest(eventData.target, '.' + APPOINTMENT_CLASS);
            this.getSelectedEventElements(target);
            raiseClickEvent(false);
            return;
        }
        this.removeSelectedAppointmentClass();
        if (raiseClickEvent(true)) {
            this.removeSelectedAppointmentClass();
            return;
        }
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            addClass([this.parent.activeEventData.element], AGENDA_SELECTED_CELL);
        }
        this.parent.notify(eventClick, this.parent.activeEventData);
    }
    eventDoubleClick(e) {
        this.parent.quickPopup.quickPopupHide(true);
        if (e.type === 'touchstart') {
            this.activeEventData(e, true);
        }
        this.removeSelectedAppointmentClass();
        if (!isNullOrUndefined(this.parent.activeEventData.event) &&
            isNullOrUndefined(this.parent.activeEventData.event[this.parent.eventFields.recurrenceID])) {
            this.parent.currentAction = 'Save';
            this.parent.eventWindow.openEditor(this.parent.activeEventData.event, 'Save');
        }
        else {
            this.parent.currentAction = 'EditOccurrence';
            this.parent.quickPopup.openRecurrenceAlert();
        }
    }
    getEventByGuid(guid) {
        return new DataManager({ json: this.parent.eventsProcessed }).executeLocal(new Query().where('Guid', 'equal', guid))[0];
    }
    generateGuid() {
        return 'xyxxxxyx-xxxy-yxxx-xyxx-xxyxxxxyyxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = (c === 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    getEventIDType() {
        if (this.parent.eventsData.length !== 0) {
            return typeof (this.parent.eventsData[0][this.parent.eventFields.id]);
        }
        if (this.parent.blockData.length !== 0) {
            return typeof (this.parent.blockData[0][this.parent.eventFields.id]);
        }
        return 'string';
    }
    getEventMaxID(resourceId) {
        if (this.parent.eventsData.length < 1 && this.parent.blockData.length < 1) {
            return 1;
        }
        let eventId;
        let idType = this.getEventIDType();
        if (idType === 'string') {
            eventId = uniqueID().toString();
        }
        if (idType === 'number') {
            let datas = this.parent.eventsData.concat(this.parent.blockData);
            let maxId = Math.max.apply(Math, datas.map((event) => event[this.parent.eventFields.id]));
            maxId = isNullOrUndefined(resourceId) ? maxId : maxId + resourceId;
            eventId = maxId + 1;
        }
        return eventId;
    }
    activeEventData(eventData, isMultiple) {
        let target = closest(eventData.target, '.' + APPOINTMENT_CLASS);
        let guid = target.getAttribute('data-guid');
        if (isMultiple) {
            this.addSelectedAppointments([].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]')));
        }
        let eventObject = this.getEventByGuid(guid);
        if (eventObject && eventObject.isSpanned) {
            eventObject = this.parent.eventsData.filter((obj) => obj[this.parent.eventFields.id] === eventObject[this.parent.eventFields.id])[0];
        }
        this.parent.activeEventData = { event: eventObject, element: target };
    }
    generateOccurrence(event, viewDate) {
        let startDate = event[this.parent.eventFields.startTime];
        let endDate = event[this.parent.eventFields.endTime];
        let eventRule = event[this.parent.eventFields.recurrenceRule];
        let duration = endDate.getTime() - startDate.getTime();
        viewDate = new Date((viewDate || this.parent.activeView.startDate()).getTime() - duration);
        let exception = event[this.parent.eventFields.recurrenceException];
        let maxCount;
        if (this.parent.currentView !== 'Agenda') {
            maxCount = getDateCount(this.parent.activeView.startDate(), this.parent.activeView.endDate()) + 1;
        }
        let dates = generate(startDate, eventRule, exception, this.parent.firstDayOfWeek, maxCount, viewDate, this.parent.calendarMode);
        if (this.parent.currentView === 'Agenda' && eventRule.indexOf('COUNT') === -1 && eventRule.indexOf('UNTIL') === -1) {
            if (isNullOrUndefined(event.generatedDates)) {
                event.generatedDates = { start: new Date(dates[0]), end: new Date(dates[dates.length - 1]) };
            }
            else {
                if (dates[0] < event.generatedDates.start.getTime()) {
                    event.generatedDates.start = new Date(dates[0]);
                }
                if (dates[dates.length - 1] > event.generatedDates.end.getTime()) {
                    event.generatedDates.end = new Date(dates[dates.length - 1]);
                }
            }
        }
        let occurrenceCollection = [];
        for (let date of dates) {
            let clonedObject = extend({}, event, null, true);
            clonedObject[this.parent.eventFields.startTime] = new Date(date);
            clonedObject[this.parent.eventFields.endTime] = new Date(new Date(date).setMilliseconds(duration));
            clonedObject[this.parent.eventFields.recurrenceID] = clonedObject[this.parent.eventFields.id];
            clonedObject.Guid = this.generateGuid();
            occurrenceCollection.push(clonedObject);
        }
        return occurrenceCollection;
    }
    getRecurrenceEvent(eventData) {
        let eventFields = this.parent.eventFields;
        let parentApp = new DataManager(this.parent.eventsData).
            executeLocal(new Query().where(eventFields.id, 'equal', eventData[eventFields.recurrenceID]));
        return parentApp[0];
    }
    getOccurrencesByID(id) {
        let fields = this.parent.eventFields;
        let occurrenceCollection = [];
        let parentObject = this.parent.eventsData.filter((obj) => { return obj[fields.id] === id; });
        for (let event of parentObject) {
            if (!isNullOrUndefined(event[fields.recurrenceRule])) {
                occurrenceCollection = occurrenceCollection.concat(this.generateOccurrence(event));
            }
        }
        return occurrenceCollection;
    }
    getOccurrencesByRange(startTime, endTime) {
        let fields = this.parent.eventFields;
        let occurrenceCollection = [];
        for (let event of this.parent.eventsData) {
            if (!isNullOrUndefined(event[fields.recurrenceRule])) {
                occurrenceCollection = occurrenceCollection.concat(this.generateOccurrence(event));
            }
        }
        let filter = occurrenceCollection.filter((obj) => {
            return obj[fields.startTime] >= startTime && obj[fields.endTime] <= endTime && !isNullOrUndefined(obj[fields.recurrenceID]);
        });
        return filter;
    }
    applyResourceColor(element, eventData, type, groupOrder, alpha) {
        if (!this.parent.resourceBase) {
            return;
        }
        let alphaColor = (color, alpha) => {
            color = color.replace('#', '');
            const r = parseInt(color.substring(0, color.length / 3), 16);
            const g = parseInt(color.substring(color.length / 3, 2 * color.length / 3), 16);
            const b = parseInt(color.substring(2 * color.length / 3, 3 * color.length / 3), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        let color = this.parent.resourceBase.getResourceColor(eventData, groupOrder);
        if (color) {
            // tslint:disable-next-line:no-any
            element.style[type] = !isNullOrUndefined(alpha) ? alphaColor(color, alpha) : color;
        }
    }
    createBlockAppointmentElement(record, resIndex) {
        let eventSubject = (record[this.parent.eventFields.subject] || this.parent.eventSettings.fields.subject.default);
        let appointmentWrapper = createElement('div', {
            className: BLOCK_APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.parent.eventFields.id],
                'aria-readonly': 'true', 'aria-selected': 'false', 'aria-label': eventSubject
            }
        });
        let templateElement;
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            templateElement = this.parent.getAppointmentTemplate()(record);
        }
        else {
            let appointmentSubject = createElement('div', {
                className: SUBJECT_CLASS, innerHTML: eventSubject
            });
            templateElement = [appointmentSubject];
        }
        append(templateElement, appointmentWrapper);
        this.setWrapperAttributes(appointmentWrapper, resIndex);
        return appointmentWrapper;
    }
    setWrapperAttributes(appointmentWrapper, resIndex) {
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            appointmentWrapper.setAttribute('data-group-index', resIndex.toString());
        }
    }
    getReadonlyAttribute(event) {
        return (event[this.parent.eventFields.isReadonly]) ?
            event[this.parent.eventFields.isReadonly] : 'false';
    }
    isBlockRange(eventData) {
        let eventCollection = (eventData instanceof Array) ? eventData : [eventData];
        let isBlockAlert = false;
        let fields = this.parent.eventFields;
        eventCollection.forEach((event) => {
            let dataCol = [];
            if (!isNullOrUndefined(event[fields.recurrenceRule]) && (isNullOrUndefined(event[fields.recurrenceID])
                || event[fields.id] !== event[fields.recurrenceID])) {
                dataCol = this.parent.eventBase.generateOccurrence(event);
            }
            else {
                dataCol.push(event);
            }
            for (let data of dataCol) {
                let filterBlockEvents = this.parent.eventBase.filterBlockEvents(data);
                if (filterBlockEvents.length > 0) {
                    isBlockAlert = true;
                    break;
                }
            }
        });
        this.parent.uiStateValues.isBlock = isBlockAlert;
        return isBlockAlert;
    }
}

/**
 * Schedule CRUD operations
 */
class Crud {
    constructor(parent) {
        this.parent = parent;
        this.timezone = new Timezone();
    }
    getQuery() {
        let start = this.parent.activeView.startDate();
        let end = this.parent.activeView.endDate();
        return this.parent.dataModule.generateQuery(start, end);
    }
    getTable() {
        if (this.parent.eventSettings.query) {
            let query = this.parent.eventSettings.query.clone();
            return query.fromTable;
        }
        return null;
    }
    refreshData(args) {
        let actionArgs = { requestType: args.requestType, cancel: false, data: args.data };
        if (this.parent.dataModule.dataManager.dataSource.offline) {
            this.parent.trigger(actionComplete, actionArgs);
            this.parent.renderModule.refreshDataManager();
            return;
        }
        else {
            args.promise.then((e) => {
                if (this.parent.isDestroyed) {
                    return;
                }
                this.parent.trigger(actionComplete, actionArgs);
                if (actionArgs.cancel) {
                    return;
                }
                this.parent.renderModule.refreshDataManager();
            }).catch((e) => {
                if (this.parent.isDestroyed) {
                    return;
                }
                this.parent.trigger(actionFailure, { error: e });
            });
        }
    }
    addEvent(eventData) {
        if (this.parent.eventBase.isBlockRange(eventData)) {
            let data = (eventData instanceof Array) ? [eventData] : eventData;
            this.parent.quickPopup.openValidationError('blockAlert', data);
            return;
        }
        let fields = this.parent.eventFields;
        let promise = null;
        let editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        let args = {
            cancel: false,
            data: (eventData instanceof Array) ? eventData : [eventData],
            requestType: 'eventCreate'
        };
        this.parent.trigger(actionBegin, args);
        if (args.cancel) {
            return;
        }
        if (eventData instanceof Array) {
            for (let event of eventData) {
                this.processCrudTimezone(event);
                editParms.addedRecords.push(event);
            }
            promise =
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery());
        }
        else {
            this.processCrudTimezone(eventData);
            promise = this.parent.dataModule.dataManager.insert(eventData, this.getTable(), this.getQuery());
        }
        let crudArgs = { requestType: 'eventCreated', cancel: false, data: eventData, promise: promise };
        this.refreshData(crudArgs);
    }
    saveEvent(event, action) {
        if (this.parent.eventBase.isBlockRange(event)) {
            let data = (event instanceof Array) ? [event] : event;
            this.parent.quickPopup.openValidationError('blockAlert', data);
            return;
        }
        let fields = this.parent.eventFields;
        let promise = null;
        let editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        let args = { requestType: 'eventChange', cancel: false };
        let data = event;
        if (isNullOrUndefined(action)) {
            args.data = data;
            this.parent.trigger(actionBegin, args);
            if (args.cancel) {
                return;
            }
            this.processCrudTimezone(data);
            if ((event instanceof Array)) {
                editParms.changedRecords = event;
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery());
            }
            else {
                promise = this.parent.dataModule.dataManager.update(fields.id, event, this.getTable(), this.getQuery());
            }
        }
        else {
            let parentEvent = this.getParentEvent(data);
            let query;
            switch (action) {
                case 'EditOccurrence':
                    args.data = { occurrence: event, parent: parentEvent };
                    this.parent.trigger(actionBegin, args);
                    if (args.cancel) {
                        return;
                    }
                    query = new Query().where('Guid', 'equal', data.Guid);
                    let edited = new DataManager(this.parent.eventsProcessed).executeLocal(query);
                    let exDate = this.excludeDateCheck(edited[0][fields.startTime], parentEvent[fields.recurrenceException]);
                    if (exDate !== parentEvent[fields.recurrenceException]) {
                        parentEvent[fields.recurrenceException] = exDate;
                        data[fields.recurrenceID] = parentEvent[fields.id];
                        this.processCrudTimezone(parentEvent);
                        editParms.changedRecords.push(parentEvent);
                        this.processCrudTimezone(data);
                        editParms.addedRecords.push(data);
                    }
                    else {
                        this.processCrudTimezone(data);
                        editParms.changedRecords.push(data);
                    }
                    break;
                case 'EditSeries':
                    args.data = data;
                    this.parent.trigger(actionBegin, args);
                    if (args.cancel) {
                        return;
                    }
                    query = new Query().where(fields.recurrenceID, 'equal', parentEvent[fields.id]);
                    let delApp = new DataManager(this.parent.eventsData).executeLocal(query);
                    data[fields.id] = parentEvent[fields.id];
                    data[fields.recurrenceException] = this.parent.uiStateValues.isIgnoreOccurrence ?
                        parentEvent[fields.recurrenceException] : null;
                    data[fields.recurrenceID] = null;
                    this.processCrudTimezone(data);
                    editParms.changedRecords.push(data);
                    if (!this.parent.uiStateValues.isIgnoreOccurrence) {
                        for (let event of delApp) {
                            editParms.deletedRecords.push(event);
                        }
                    }
                    this.parent.uiStateValues.isIgnoreOccurrence = false;
                    break;
            }
            promise =
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery());
        }
        // if (!this.parent.activeView.isTimelineView()) {
        //     this.parent.eventBase.selectWorkCellByTime(dataObj);
        // }
        let crudArgs = { requestType: 'eventChanged', cancel: false, data: args.data, promise: promise };
        this.refreshData(crudArgs);
    }
    deleteEvent(id, action) {
        let fields = this.parent.eventFields;
        let editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        let dataObj = [];
        let normalEvent = [];
        let recEvent = [];
        switch (typeof id) {
            case 'string':
            case 'number':
                dataObj = new DataManager(this.parent.eventsData).executeLocal(new Query().where(fields.id, 'equal', id));
                break;
            case 'object':
                dataObj = (id instanceof Array) ? id : [id];
                break;
        }
        for (let event of dataObj) {
            (!isNullOrUndefined(event[fields.recurrenceRule])) ? recEvent.push(event) : normalEvent.push(event);
        }
        let args = { requestType: 'eventRemove', cancel: false };
        if (action !== 'DeleteOccurrence') {
            args.data = dataObj;
            this.parent.trigger(actionBegin, args);
            if (args.cancel) {
                return;
            }
        }
        if (isNullOrUndefined(action) || normalEvent.length > 0) {
            for (let event of normalEvent) {
                editParms.deletedRecords.push(event);
            }
        }
        if (recEvent.length > 0) {
            switch (action) {
                case 'Delete':
                case 'DeleteOccurrence':
                    for (let i = 0; i < recEvent.length; i++) {
                        let parentEvent = this.getParentEvent(recEvent[i]);
                        args.data = { occurrence: recEvent[i], parent: parentEvent };
                        this.parent.trigger(actionBegin, args);
                        if (args.cancel) {
                            return;
                        }
                        parentEvent[fields.recurrenceException] =
                            this.excludeDateCheck(recEvent[i][fields.startTime], parentEvent[fields.recurrenceException]);
                        this.processCrudTimezone(parentEvent);
                        editParms.changedRecords.push(parentEvent);
                        if (recEvent[i][fields.id] !== parentEvent[fields.id]) {
                            editParms.deletedRecords.push(recEvent[i]);
                        }
                    }
                    break;
                case 'DeleteSeries':
                    for (let app of recEvent) {
                        let predicate = new Predicate(fields.id, 'equal', (app[fields.recurrenceID] || id)).
                            or(new Predicate(fields.recurrenceID, 'equal', (app[fields.recurrenceID] || id)));
                        let delApp = new DataManager(this.parent.eventsData).executeLocal(new Query().where(predicate));
                        for (let event of delApp) {
                            editParms.deletedRecords.push(event);
                        }
                    }
                    break;
            }
        }
        let promise;
        if (editParms.deletedRecords.length === 1 && editParms.changedRecords.length === 0) {
            let deleteEvent = editParms.deletedRecords[0];
            promise =
                this.parent.dataModule.dataManager.remove(fields.id, deleteEvent, this.getTable(), this.getQuery());
        }
        else {
            promise =
                this.parent.dataModule.dataManager.saveChanges(editParms, fields.id, this.getTable(), this.getQuery());
        }
        this.parent.eventBase.selectWorkCellByTime(dataObj);
        let crudArgs = { requestType: 'eventRemoved', cancel: false, data: args.data, promise: promise };
        this.refreshData(crudArgs);
    }
    getParentEvent(event) {
        let fields = this.parent.eventFields;
        let parentEvent = this.parent.eventBase.getRecurrenceEvent(event);
        if (parentEvent[fields.startTimezone] || parentEvent[fields.endTimezone]) {
            this.parent.eventBase.timezoneConvert(parentEvent);
        }
        return parentEvent;
    }
    processCrudTimezone(events) {
        let fields = this.parent.eventFields;
        if (events[fields.startTimezone] || events[fields.endTimezone]) {
            let startTimezone = events[fields.startTimezone] || events[fields.endTimezone];
            let endTimezone = events[fields.endTimezone] || events[fields.startTimezone];
            if (this.parent.timezone) {
                let zone = this.parent.timezone;
                events[fields.startTime] = this.timezone.convert(events[fields.startTime], startTimezone, zone);
                events[fields.endTime] = this.timezone.convert(events[fields.endTime], endTimezone, zone);
                events[fields.startTime] = this.timezone.remove(events[fields.startTime], zone);
                events[fields.endTime] = this.timezone.remove(events[fields.endTime], zone);
            }
            else {
                events[fields.startTime] = this.timezone.remove(events[fields.startTime], startTimezone);
                events[fields.endTime] = this.timezone.remove(events[fields.endTime], endTimezone);
            }
        }
        else if (this.parent.timezone) {
            events[fields.startTime] = this.timezone.remove(events[fields.startTime], this.parent.timezone);
            events[fields.endTime] = this.timezone.remove(events[fields.endTime], this.parent.timezone);
        }
    }
    excludeDateCheck(eventStartTime, exceptionDateList) {
        let exDate = getRecurrenceStringFromDate(eventStartTime);
        if (!isNullOrUndefined(exceptionDateList)) {
            if (exceptionDateList.indexOf(exDate) === -1) {
                exceptionDateList = !(isNullOrUndefined(exceptionDateList)) ? exceptionDateList + ',' + exDate : exDate;
            }
        }
        else {
            exceptionDateList = exDate;
        }
        return exceptionDateList;
    }
}

/**
 * Appointment window field validation
 */
class FieldValidator {
    renderFormValidator(form, rules, element) {
        this.element = element;
        this.formObj = new FormValidator(form, {
            customPlacement: (inputElement, error) => {
                this.errorPlacement(inputElement, error);
            },
            rules: rules,
            validationComplete: (args) => {
                this.validationComplete(args);
            }
        });
    }
    validationComplete(args) {
        let elem = this.element.querySelector('#' + args.inputName + '_Error');
        if (elem) {
            elem.style.display = (args.status === 'failure') ? '' : 'none';
        }
    }
    errorPlacement(inputElement, error) {
        let id = error.getAttribute('for');
        let elem = this.element.querySelector('#' + id + '_Error');
        if (!elem) {
            this.createTooltip(inputElement, error, id, '');
        }
    }
    createTooltip(element, error, name, display) {
        let dlgContent;
        let client;
        let inputClient = element.getBoundingClientRect();
        if (this.element.classList.contains(POPUP_WRAPPER_CLASS)) {
            dlgContent = this.element;
            client = this.element.getBoundingClientRect();
        }
        else {
            dlgContent = this.element.querySelector('.e-schedule-dialog .e-dlg-content');
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
            let elements = [].slice.call(this.element.querySelectorAll('.' + ERROR_VALIDATION_CLASS));
            for (let elem of elements) {
                remove(elem);
            }
        }
        if (this.formObj && this.formObj.element) {
            this.formObj.reset();
        }
    }
    /**
     * @hidden
     */
    destroy() {
        if (this.formObj && !this.formObj.isDestroyed) {
            this.formObj.destroy();
        }
    }
}

const EVENT_FIELD = 'e-field';
/**
 * Quick Popups interactions
 */
class QuickPopups {
    /**
     * Constructor for QuickPopups
     */
    constructor(parent) {
        this.isMultipleEventSelect = false;
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.crudAction = new Crud(parent);
        this.fieldValidator = new FieldValidator();
        this.render();
        this.addEventListener();
    }
    render() {
        this.renderQuickPopup();
        this.renderMorePopup();
        this.renderQuickDialog();
    }
    renderQuickPopup() {
        let quickPopupWrapper = createElement('div', { className: POPUP_WRAPPER_CLASS + ' e-popup-close' });
        if (this.parent.isAdaptive) {
            document.body.appendChild(quickPopupWrapper);
            addClass([quickPopupWrapper], DEVICE_CLASS);
        }
        else {
            this.parent.element.appendChild(quickPopupWrapper);
        }
        this.quickPopup = new Popup(quickPopupWrapper, {
            targetType: (this.parent.isAdaptive ? 'container' : 'relative'),
            enableRtl: this.parent.enableRtl,
            open: this.quickPopupOpen.bind(this),
            close: this.quickPopupClose.bind(this),
            hideAnimation: (this.parent.isAdaptive ? { name: 'ZoomOut' } : { name: 'FadeOut', duration: 150 }),
            showAnimation: (this.parent.isAdaptive ? { name: 'ZoomIn' } : { name: 'FadeIn', duration: 150 }),
            collision: (this.parent.isAdaptive ? { X: 'fit', Y: 'fit' } :
                (this.parent.enableRtl ? { X: 'flip', Y: 'fit' } : { X: 'none', Y: 'fit' })),
            position: (this.parent.isAdaptive || this.parent.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }),
            viewPortElement: (this.parent.isAdaptive ? document.body : this.parent.element),
            zIndex: (this.parent.isAdaptive ? 1000 : 3)
        });
    }
    renderMorePopup() {
        let moreEventPopup = `<div class="${MORE_EVENT_POPUP_CLASS}"><div class="${MORE_EVENT_HEADER_CLASS}">` +
            `<div class="${MORE_EVENT_CLOSE_CLASS}" title="${this.l10n.getConstant('close')}" tabindex="0"></div>` +
            `<div class="${MORE_EVENT_DATE_HEADER_CLASS}"><div class="${MORE_EVENT_HEADER_DAY_CLASS}"></div>` +
            `<div class="${MORE_EVENT_HEADER_DATE_CLASS} ${NAVIGATE_CLASS}" tabindex="0"></div></div></div></div>`;
        let moreEventWrapper = createElement('div', {
            className: MORE_POPUP_WRAPPER_CLASS + ' e-popup-close',
            innerHTML: moreEventPopup
        });
        this.parent.element.appendChild(moreEventWrapper);
        this.morePopup = new Popup(moreEventWrapper, {
            targetType: 'relative',
            enableRtl: this.parent.enableRtl,
            hideAnimation: { name: 'ZoomOut', duration: 300 },
            showAnimation: { name: 'ZoomIn', duration: 300 },
            open: this.morePopupOpen.bind(this),
            close: this.morePopupClose.bind(this),
            collision: { X: 'flip', Y: 'flip' },
            viewPortElement: this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS),
            zIndex: 2
        });
        let closeButton = this.morePopup.element.querySelector('.' + MORE_EVENT_CLOSE_CLASS);
        this.renderButton('e-round', ICON + ' ' + CLOSE_ICON_CLASS, false, closeButton, this.closeClick);
        EventHandler.add(this.morePopup.element.querySelector('.' + MORE_EVENT_HEADER_DATE_CLASS), 'click', this.navigationClick, this);
    }
    renderQuickDialog() {
        this.quickDialog = new Dialog({
            animationSettings: { effect: 'Zoom' },
            buttons: [
                { buttonModel: { cssClass: 'e-quick-alertok e-flat', isPrimary: true }, click: this.dialogButtonClick.bind(this) },
                { buttonModel: { cssClass: 'e-quick-alertcancel e-flat', isPrimary: false }, click: this.dialogButtonClick.bind(this) },
                {
                    buttonModel: { cssClass: 'e-quick-dialog-cancel e-disable e-flat', isPrimary: false },
                    click: this.dialogButtonClick.bind(this)
                }
            ],
            cssClass: QUICK_DIALOG_CLASS,
            closeOnEscape: true,
            enableRtl: this.parent.enableRtl,
            beforeClose: this.beforeQuickDialogClose.bind(this),
            isModal: true,
            position: { X: 'center', Y: 'center' },
            showCloseIcon: true,
            target: document.body,
            visible: false,
            width: 'auto'
        });
        let dialogElement = createElement('div', { id: this.parent.element.id + 'QuickDialog' });
        this.parent.element.appendChild(dialogElement);
        this.quickDialog.appendTo(dialogElement);
        let okButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_OK);
        if (okButton) {
            okButton.setAttribute('aria-label', this.l10n.getConstant('occurrence'));
        }
        let cancelButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_CANCEL);
        if (cancelButton) {
            cancelButton.setAttribute('aria-label', this.l10n.getConstant('series'));
        }
    }
    renderButton(className, iconName, isDisabled, element, clickEvent) {
        let buttonObj = new Button({
            cssClass: className,
            disabled: isDisabled,
            enableRtl: this.parent.enableRtl,
            iconCss: iconName
        });
        buttonObj.appendTo(element);
        EventHandler.add(element, 'click', clickEvent, this);
    }
    quickDialogClass(action) {
        let classList$$1 = [
            QUICK_DIALOG_OCCURRENCE_CLASS, QUICK_DIALOG_SERIES_CLASS, QUICK_DIALOG_DELETE_CLASS,
            QUICK_DIALOG_CANCEL_CLASS, QUICK_DIALOG_ALERT_BTN_CLASS, DISABLE_CLASS
        ];
        let okButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_OK);
        let cancelButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_CANCEL);
        removeClass([okButton, cancelButton], classList$$1);
        addClass([this.quickDialog.element.querySelector('.' + QUICK_DIALOG_CANCEL_CLASS)], DISABLE_CLASS);
        switch (action) {
            case 'Recurrence':
                addClass([okButton], QUICK_DIALOG_OCCURRENCE_CLASS);
                addClass([cancelButton], QUICK_DIALOG_SERIES_CLASS);
                break;
            case 'Delete':
                addClass([okButton], QUICK_DIALOG_DELETE_CLASS);
                addClass([cancelButton], QUICK_DIALOG_CANCEL_CLASS);
                break;
            case 'Alert':
                addClass([okButton], [QUICK_DIALOG_ALERT_OK, QUICK_DIALOG_ALERT_BTN_CLASS]);
                addClass([cancelButton], [QUICK_DIALOG_ALERT_CANCEL, DISABLE_CLASS]);
                break;
        }
    }
    applyFormValidation() {
        let form = this.quickPopup.element.querySelector('.' + FORM_CLASS);
        let rules = {};
        rules[this.parent.eventSettings.fields.subject.name] = this.parent.eventSettings.fields.subject.validation;
        this.fieldValidator.renderFormValidator(form, rules, this.quickPopup.element);
    }
    openRecurrenceAlert() {
        let editDeleteOnly = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_OK);
        if (editDeleteOnly) {
            editDeleteOnly.innerHTML = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteEvent' : 'editEvent');
        }
        let editDeleteSeries = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_CANCEL);
        if (editDeleteSeries) {
            editDeleteSeries.innerHTML = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteSeries' : 'editSeries');
        }
        this.quickDialog.content =
            this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteRecurrenceContent' : 'editContent');
        this.quickDialog.header = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteEvent' : 'editEvent');
        this.quickDialogClass('Recurrence');
        this.showQuickDialog('RecurrenceAlert');
    }
    openRecurrenceValidationAlert(type) {
        this.quickDialogClass('Alert');
        let okButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_OK);
        okButton.innerHTML = this.l10n.getConstant('ok');
        let cancelButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_CANCEL);
        cancelButton.innerHTML = this.l10n.getConstant('cancel');
        this.quickDialog.header = this.l10n.getConstant('alert');
        switch (type) {
            case 'wrongPattern':
                addClass([cancelButton], DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('wrongPattern');
                break;
            case 'dateValidation':
                removeClass([cancelButton], DISABLE_CLASS);
                addClass([cancelButton], QUICK_DIALOG_CANCEL_CLASS);
                this.quickDialog.content = this.l10n.getConstant('recurrenceDateValidation');
                break;
            case 'createError':
                addClass([cancelButton], DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('createError');
                break;
            case 'sameDayAlert':
                addClass([cancelButton], DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('sameDayAlert');
                break;
            case 'seriesChangeAlert':
                let dialogCancel = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_CANCEL_CLASS);
                removeClass([cancelButton, dialogCancel], DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('seriesChangeAlert');
                okButton.innerHTML = this.l10n.getConstant('yes');
                cancelButton.innerHTML = this.l10n.getConstant('no');
                dialogCancel.innerHTML = this.l10n.getConstant('cancel');
                break;
        }
        this.showQuickDialog('RecurrenceValidationAlert');
    }
    openDeleteAlert() {
        if (this.parent.activeViewOptions.readonly) {
            return;
        }
        let okButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_OK);
        if (okButton) {
            okButton.innerHTML = this.l10n.getConstant('delete');
        }
        let cancelButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_CANCEL);
        if (cancelButton) {
            cancelButton.innerHTML = this.l10n.getConstant('cancel');
        }
        this.quickDialog.content = (this.parent.activeEventData.event.length > 1) ?
            this.l10n.getConstant('deleteMultipleContent') : this.l10n.getConstant('deleteContent');
        this.quickDialog.header = (this.parent.activeEventData.event.length > 1) ?
            this.l10n.getConstant('deleteMultipleEvent') : this.l10n.getConstant('deleteEvent');
        this.quickDialogClass('Delete');
        this.showQuickDialog('DeleteAlert');
    }
    openValidationError(type, eventData) {
        this.quickDialog.header = this.l10n.getConstant('alert');
        this.quickDialog.content = this.l10n.getConstant(type);
        let okButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_OK);
        if (okButton) {
            okButton.innerHTML = this.l10n.getConstant('ok');
        }
        let cancelButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_CANCEL);
        if (cancelButton) {
            cancelButton.innerHTML = this.l10n.getConstant('cancel');
        }
        this.quickDialogClass('Alert');
        this.showQuickDialog('ValidationAlert', eventData);
    }
    showQuickDialog(popupType, eventData) {
        this.quickDialog.dataBind();
        let eventProp = {
            type: popupType, cancel: false, data: eventData || this.parent.activeEventData, element: this.quickDialog.element
        };
        this.parent.trigger(popupOpen, eventProp);
        if (eventProp.cancel) {
            return;
        }
        this.quickDialog.show();
    }
    createMoreEventList(eventCollection, groupOrder, groupIndex) {
        let fields = this.parent.eventFields;
        let moreEventContentEle = createElement('div', { className: MORE_EVENT_CONTENT_CLASS });
        let moreEventWrapperEle = createElement('div', { className: MORE_EVENT_WRAPPER_CLASS });
        if (eventCollection.length === 0) {
            moreEventWrapperEle = createElement('div', {
                className: MORE_EVENT_CONTENT_CLASS,
                innerHTML: this.l10n.getConstant('emptyContainer')
            });
        }
        else {
            for (let eventData of eventCollection) {
                let eventText = (eventData[fields.subject] || this.parent.eventSettings.fields.subject.default);
                let appointmentEle = createElement('div', {
                    className: APPOINTMENT_CLASS,
                    attrs: {
                        'data-id': '' + eventData[fields.id],
                        'data-guid': eventData.Guid, 'role': 'button', 'tabindex': '0',
                        'aria-readonly': this.parent.eventBase.getReadonlyAttribute(eventData),
                        'aria-selected': 'false', 'aria-grabbed': 'true', 'aria-label': eventText
                    }
                });
                appointmentEle.appendChild(createElement('div', { className: SUBJECT_CLASS, innerHTML: eventText }));
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    appointmentEle.setAttribute('data-group-index', groupIndex);
                }
                if (!isNullOrUndefined(eventData[fields.recurrenceRule])) {
                    let iconClass = (eventData[fields.id] === eventData[fields.recurrenceID]) ?
                        EVENT_RECURRENCE_ICON_CLASS : EVENT_RECURRENCE_EDIT_ICON_CLASS;
                    appointmentEle.appendChild(createElement('div', { className: ICON + ' ' + iconClass }));
                }
                let args = { data: eventData, element: appointmentEle, cancel: false };
                this.parent.trigger(eventRendered, args);
                if (!args.cancel) {
                    moreEventWrapperEle.appendChild(appointmentEle);
                    this.parent.eventBase.wireAppointmentEvents(appointmentEle, false, eventData);
                    this.parent.eventBase.applyResourceColor(appointmentEle, eventData, 'backgroundColor', groupOrder);
                }
            }
        }
        moreEventContentEle.appendChild(moreEventWrapperEle);
        return moreEventContentEle;
    }
    tapHoldEventPopup(e) {
        let target = closest(e.target, '.' + APPOINTMENT_CLASS);
        this.isMultipleEventSelect = false;
        this.parent.selectedElements = [];
        this.isMultipleEventSelect = true;
        this.parent.eventBase.getSelectedEventElements(target);
        this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
        let guid = target.getAttribute('data-guid');
        let eventObj = this.parent.eventBase.getEventByGuid(guid);
        let eventTitle = (eventObj[this.parent.eventFields.subject] || this.l10n.getConstant('noTitle'));
        let eventTemplate = `<div class="${MULTIPLE_EVENT_POPUP_CLASS}"><div class="${POPUP_HEADER_CLASS}">` +
            `<button class="${CLOSE_CLASS}" title="${this.l10n.getConstant('close')}"></button>` +
            `<div class="${SUBJECT_CLASS}">${eventTitle}</div>` +
            `<button class="${EDIT_CLASS}" title="${this.l10n.getConstant('edit')}"></button>` +
            `<button class="${DELETE_CLASS}" title="${this.l10n.getConstant('delete')}"></button></div></div>`;
        this.quickPopup.element.innerHTML = eventTemplate;
        let closeIcon = this.quickPopup.element.querySelector('.' + CLOSE_CLASS);
        this.renderButton('e-flat e-round e-small', ICON + ' ' + CLOSE_ICON_CLASS, false, closeIcon, this.closeClick);
        let editIcon = this.quickPopup.element.querySelector('.' + EDIT_CLASS);
        this.renderButton('e-flat e-round e-small', ICON + ' ' + EDIT_ICON_CLASS, false, editIcon, this.editClick);
        let deleteIcon = this.quickPopup.element.querySelector('.' + DELETE_CLASS);
        this.renderButton('e-flat e-round e-small', ICON + ' ' + DELETE_ICON_CLASS, false, deleteIcon, this.deleteClick);
        this.beforeQuickPopupOpen(target);
    }
    isCellBlocked(args) {
        let tempObj = {};
        tempObj[this.parent.eventFields.startTime] = this.parent.activeCellsData.startTime;
        tempObj[this.parent.eventFields.endTime] = this.parent.activeCellsData.endTime;
        tempObj[this.parent.eventFields.isAllDay] = this.parent.activeCellsData.isAllDay;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            let targetCell = args.element instanceof Array ? args.element[0] : args.element;
            let groupIndex = parseInt(targetCell.getAttribute('data-group-index'), 10);
            this.parent.resourceBase.setResourceValues(tempObj, true, isNaN(groupIndex) ? null : groupIndex);
        }
        return this.parent.eventBase.isBlockRange(tempObj);
    }
    cellClick(args) {
        if (!this.parent.showQuickInfo || this.parent.currentView === 'MonthAgenda' || this.isCellBlocked(args)) {
            this.quickPopupHide();
            return;
        }
        let targetEle = args.event.target;
        if (this.parent.isAdaptive) {
            this.quickPopupHide();
            let newEventClone = this.parent.element.querySelector('.' + NEW_EVENT_CLASS);
            if (isNullOrUndefined(newEventClone)) {
                newEventClone = createElement('div', {
                    className: NEW_EVENT_CLASS,
                    innerHTML: `<div class="e-title">+ ${this.l10n.getConstant('newEvent')}</div>`
                });
            }
            let targetCell = closest(targetEle, '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS);
            if (targetCell) {
                targetCell.appendChild(newEventClone);
            }
            return;
        }
        let target = closest(targetEle, '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS + ',.' +
            HEADER_CELLS_CLASS);
        if (isNullOrUndefined(target) || targetEle.classList.contains(MORE_INDICATOR_CLASS)) {
            return;
        }
        let isSameTarget = this.quickPopup.relateTo === target;
        if (isSameTarget && this.quickPopup.element.classList.contains(POPUP_OPEN)) {
            let subjectElement = this.quickPopup.element.querySelector('.' + SUBJECT_CLASS);
            if (subjectElement) {
                subjectElement.focus();
            }
            return;
        }
        let temp = {};
        temp[this.parent.eventFields.startTime] = this.parent.activeCellsData.startTime;
        temp[this.parent.eventFields.endTime] = this.parent.activeCellsData.endTime;
        temp[this.parent.eventFields.isAllDay] = this.parent.activeCellsData.isAllDay;
        let cellDetails = this.getFormattedString(temp);
        let quickCellPopup = createElement('div', { className: CELL_POPUP_CLASS });
        let templateArgs = extend({}, temp, { elementType: 'cell' }, true);
        if (this.parent.quickInfoTemplates.header) {
            append(this.parent.getQuickInfoTemplatesHeader()(templateArgs), quickCellPopup);
        }
        else {
            let headerTemplate = createElement('div', {
                className: POPUP_HEADER_CLASS,
                innerHTML: `<div class="${POPUP_HEADER_ICON_WRAPPER}">` +
                    `<button class="${CLOSE_CLASS}" title="${this.l10n.getConstant('close')}"></button></div>`
            });
            quickCellPopup.appendChild(headerTemplate);
        }
        if (this.parent.quickInfoTemplates.content) {
            append(this.parent.getQuickInfoTemplatesContent()(templateArgs), quickCellPopup);
        }
        else {
            let tempStr = `<table class="${POPUP_TABLE_CLASS}"><tbody><tr><td>` +
                `<form class="${FORM_CLASS}" onsubmit="return false;"><input class="${SUBJECT_CLASS} ${EVENT_FIELD}" type="text" ` +
                `name="${this.parent.eventFields.subject}" /></form></td></tr><tr><td><div class="${DATE_TIME_CLASS}">` +
                `<div class="${DATE_TIME_ICON_CLASS} ${ICON}"></div><div class="${DATE_TIME_DETAILS_CLASS} ` +
                `${TEXT_ELLIPSIS}">${cellDetails.details}</div></div>` +
                `${this.parent.activeViewOptions.group.resources.length > 0 ? `<div class="${RESOURCE_CLASS}">` +
                    `<div class="${RESOURCE_ICON_CLASS} ${ICON} "></div><div class="${RESOURCE_DETAILS_CLASS} ` +
                    `${TEXT_ELLIPSIS}">${this.getResourceText(args, 'cell')}</div></div>` : ''}</td></tr></tbody></table>`;
            let contentTemplate = createElement('div', {
                className: POPUP_CONTENT_CLASS, innerHTML: tempStr
            });
            quickCellPopup.appendChild(contentTemplate);
        }
        if (this.parent.quickInfoTemplates.footer) {
            append(this.parent.getQuickInfoTemplatesFooter()(templateArgs), quickCellPopup);
        }
        else {
            let footerTemplate = createElement('div', {
                className: POPUP_FOOTER_CLASS, innerHTML: `<button class="${QUICK_POPUP_EVENT_DETAILS_CLASS + ' ' +
                    TEXT_ELLIPSIS}" title="${this.l10n.getConstant('moreDetails')}">${this.l10n.getConstant('moreDetails')}</button>` +
                    `<button class="${EVENT_CREATE_CLASS} ${TEXT_ELLIPSIS}" title="${this.l10n.getConstant('save')}">` +
                    `${this.l10n.getConstant('save')}</button>`
            });
            quickCellPopup.appendChild(footerTemplate);
        }
        let subjectElement = quickCellPopup.querySelector('.' + SUBJECT_CLASS);
        if (subjectElement) {
            Input.createInput({ element: subjectElement, properties: { placeholder: this.l10n.getConstant('addTitle') } });
        }
        let closeIcon = quickCellPopup.querySelector('.' + CLOSE_CLASS);
        if (closeIcon) {
            this.renderButton('e-flat e-round e-small', ICON + ' ' + CLOSE_ICON_CLASS, false, closeIcon, this.quickPopupHide);
        }
        let moreButton = quickCellPopup.querySelector('.' + QUICK_POPUP_EVENT_DETAILS_CLASS);
        if (moreButton) {
            this.renderButton('e-flat', '', false, moreButton, this.detailsClick);
        }
        let saveButton = quickCellPopup.querySelector('.' + EVENT_CREATE_CLASS);
        if (saveButton) {
            this.renderButton('e-flat e-primary', '', this.parent.activeViewOptions.readonly, saveButton, this.saveClick);
        }
        this.quickPopup.content = quickCellPopup;
        this.quickPopup.dataBind();
        this.applyFormValidation();
        if (this.morePopup) {
            this.morePopup.hide();
        }
        this.quickPopup.relateTo = target;
        this.beforeQuickPopupOpen(target);
    }
    isSameEventClick(events) {
        let isSameTarget = this.quickPopup.relateTo === closest(events.element, '.' + APPOINTMENT_CLASS);
        if (isSameTarget && this.quickPopup.element.classList.contains(POPUP_OPEN)) {
            let editIcon = this.quickPopup.element.querySelector('.' + EDIT_CLASS);
            if (editIcon) {
                editIcon.focus();
            }
            if (!this.parent.isAdaptive) {
                let editButton = this.quickPopup.element.querySelector('.' + EDIT_EVENT_CLASS);
                if (editButton) {
                    editButton.focus();
                }
            }
            return true;
        }
        return false;
    }
    eventClick(events) {
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.close();
        }
        if (!this.parent.showQuickInfo) {
            return;
        }
        if (this.parent.isAdaptive && this.isMultipleEventSelect) {
            this.updateTapHoldEventPopup(closest(events.element, '.' + APPOINTMENT_CLASS));
        }
        else {
            let isSameTarget = this.isSameEventClick(events);
            if (isSameTarget) {
                return;
            }
            let eventData = events.event;
            let args = this.getFormattedString(eventData);
            let quickEventPopup = createElement('div', { className: EVENT_POPUP_CLASS });
            let templateArgs = extend({}, eventData, { elementType: 'event' }, true);
            if (this.parent.quickInfoTemplates.header) {
                append(this.parent.getQuickInfoTemplatesHeader()(templateArgs), quickEventPopup);
            }
            else {
                let headerTemplate = createElement('div', {
                    className: POPUP_HEADER_CLASS,
                    innerHTML: `<div class="${POPUP_HEADER_ICON_WRAPPER}">` +
                        `<button class="${EDIT_CLASS + ' ' + ICON}" title="${this.l10n.getConstant('edit')}"></button>` +
                        `<button class="${DELETE_CLASS + ' ' + ICON}" title="${this.l10n.getConstant('delete')}"></button>` +
                        `<button class="${CLOSE_CLASS}" title="${this.l10n.getConstant('close')}"></button></div>` +
                        `<div class="${SUBJECT_WRAP}"><div class="${SUBJECT_CLASS} ${TEXT_ELLIPSIS}" ` +
                        `title="${args.eventSubject}">${args.eventSubject}</div></div >`
                });
                quickEventPopup.appendChild(headerTemplate);
            }
            if (this.parent.quickInfoTemplates.content) {
                append(this.parent.getQuickInfoTemplatesContent()(templateArgs), quickEventPopup);
            }
            else {
                let tempStr = `<div class="${DATE_TIME_CLASS}">` +
                    `<div class="${DATE_TIME_ICON_CLASS} ${ICON}"></div><div class="${DATE_TIME_WRAPPER_CLASS} ` +
                    `${TEXT_ELLIPSIS}"><div class="${DATE_TIME_DETAILS_CLASS} ${TEXT_ELLIPSIS}">${args.details}</div>` +
                    `${eventData[this.parent.eventFields.recurrenceRule] ? `<div class="${RECURRENCE_SUMMARY_CLASS} ` +
                        `${TEXT_ELLIPSIS}">${this.getRecurrenceSummary(eventData)}</div>` : ''}</div></div>` +
                    `${eventData[this.parent.eventFields.location] ? `<div class="${LOCATION_CLASS}"><div class="` +
                        `${LOCATION_ICON_CLASS} ${ICON}"></div><div class="${LOCATION_DETAILS_CLASS} ${TEXT_ELLIPSIS}">` +
                        `${eventData[this.parent.eventFields.location]}</div></div>` : ''}` +
                    `${eventData[this.parent.eventFields.startTimezone] ||
                        eventData[this.parent.eventFields.endTimezone] ? `<div class="${TIME_ZONE_CLASS}"><div class="` +
                        `${TIME_ZONE_ICON_CLASS} ${ICON}"></div><div class="${TIME_ZONE_DETAILS_CLASS} ${TEXT_ELLIPSIS}">` +
                        `${this.getTimezone(eventData)} </div></div>` : ''}` +
                    `${eventData[this.parent.eventFields.description] ? `<div class="${DESCRIPTION_CLASS}"><div class="` +
                        `${DESCRIPTION_ICON_CLASS} ${ICON}"></div><div class="${DESCRIPTION_DETAILS_CLASS} ` +
                        `${TEXT_ELLIPSIS}">${eventData[this.parent.eventFields.description]}</div></div>` : ''}` +
                    `${this.parent.resourceCollection.length > 0 ? `<div class="${RESOURCE_CLASS}"><div class="` +
                        `${RESOURCE_ICON_CLASS} ${ICON}"></div><div class="${RESOURCE_DETAILS_CLASS} ${TEXT_ELLIPSIS}">` +
                        `${this.getResourceText(events, 'event')}</div></div>` : ''}`;
                let contentTemplate = createElement('div', {
                    className: POPUP_CONTENT_CLASS, innerHTML: tempStr
                });
                quickEventPopup.appendChild(contentTemplate);
            }
            if (this.parent.quickInfoTemplates.footer) {
                append(this.parent.getQuickInfoTemplatesFooter()(templateArgs), quickEventPopup);
            }
            else {
                let footerTemplate = createElement('div', {
                    className: POPUP_FOOTER_CLASS,
                    innerHTML: `${this.parent.isAdaptive ? '' : `<button class="${EDIT_EVENT_CLASS} ` +
                        `${TEXT_ELLIPSIS}" title="${this.l10n.getConstant('edit')}">${this.l10n.getConstant('edit')}</button>` +
                        `<button class="${DELETE_EVENT_CLASS} ${TEXT_ELLIPSIS}" title="${this.l10n.getConstant('delete')}">` +
                        `${this.l10n.getConstant('delete')}</button>`}`
                });
                quickEventPopup.appendChild(footerTemplate);
            }
            let readonly = this.parent.activeViewOptions.readonly || eventData[this.parent.eventFields.isReadonly];
            let editIcon = quickEventPopup.querySelector('.' + EDIT_CLASS);
            if (editIcon) {
                this.renderButton('e-flat e-round e-small', ICON + ' ' + EDIT_ICON_CLASS, readonly, editIcon, this.editClick);
            }
            let deleteIcon = quickEventPopup.querySelector('.' + DELETE_CLASS);
            if (deleteIcon) {
                this.renderButton('e-flat e-round e-small', ICON + ' ' + DELETE_ICON_CLASS, readonly, deleteIcon, this.deleteClick);
            }
            let closeIcon = quickEventPopup.querySelector('.' + CLOSE_CLASS);
            if (closeIcon) {
                this.renderButton('e-flat e-round e-small', ICON + ' ' + CLOSE_ICON_CLASS, false, closeIcon, this.quickPopupHide);
            }
            let editButton = quickEventPopup.querySelector('.' + EDIT_EVENT_CLASS);
            if (editButton) {
                this.renderButton('e-flat e-primary', '', readonly, editButton, this.editClick);
            }
            let deleteButton = quickEventPopup.querySelector('.' + DELETE_EVENT_CLASS);
            if (deleteButton) {
                this.renderButton('e-flat', '', readonly, deleteButton, this.deleteClick);
            }
            this.quickPopup.content = quickEventPopup;
            this.quickPopup.dataBind();
            if (this.morePopup && !closest(events.element, '.' + MORE_EVENT_WRAPPER_CLASS)) {
                this.morePopup.hide();
            }
            this.quickPopup.relateTo = this.parent.isAdaptive ? document.body :
                closest(events.element, '.' + APPOINTMENT_CLASS);
            this.beforeQuickPopupOpen(events.element);
        }
    }
    getResourceText(args, type) {
        let resourceValue = '';
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            let resourceCollection = this.parent.resourceBase.resourceCollection.slice(-1)[0];
            let resourceData = resourceCollection.dataSource;
            let resourceIndex = 0;
            let eventData = args.event;
            resourceData.forEach((resource, index) => {
                if (resource[resourceCollection.idField] === eventData[resourceCollection.field]) {
                    resourceIndex = index;
                }
            });
            resourceValue = resourceData[resourceIndex][resourceCollection.textField];
        }
        else {
            if (type === 'event') {
                let eventData = args.event;
                let resourceData;
                let lastResource;
                for (let i = this.parent.resourceBase.resourceCollection.length - 1; i >= 0; i--) {
                    resourceData = eventData[this.parent.resourceBase.resourceCollection[i].field];
                    if (!isNullOrUndefined(resourceData)) {
                        lastResource = this.parent.resourceBase.resourceCollection[i];
                        break;
                    }
                }
                if (!Array.isArray(resourceData)) {
                    resourceData = [resourceData];
                }
                let resNames = [];
                let lastResourceData = lastResource.dataSource;
                resourceData.map((value) => {
                    let i = findIndexInData(lastResourceData, lastResource.idField, value);
                    let text = lastResourceData[i][lastResource.textField];
                    if (text) {
                        resNames.push(text);
                    }
                });
                resourceValue = resNames.join(', ');
            }
            else {
                let argsData = args;
                let groupIndex = !isNullOrUndefined(argsData.groupIndex) ? argsData.groupIndex : 0;
                let resourceDetails = this.parent.resourceBase.lastResourceLevel[groupIndex];
                resourceValue = resourceDetails.resourceData[resourceDetails.resource.textField];
            }
        }
        return resourceValue;
    }
    getFormattedString(eventData) {
        let fields = this.parent.eventFields;
        let eventSubject = (eventData[fields.subject] || this.l10n.getConstant('noTitle'));
        let startDate = eventData[fields.startTime];
        let endDate = eventData[fields.endTime];
        let startDateDetails = this.getDateFormat(startDate, 'long');
        let endDateDetails = (eventData[fields.isAllDay] && endDate.getHours() === 0 && endDate.getMinutes() === 0) ?
            this.getDateFormat(addDays(new Date(endDate.getTime()), -1), 'long') : this.getDateFormat(endDate, 'long');
        let startTimeDetail = this.parent.getTimeString(startDate);
        let endTimeDetail = this.parent.getTimeString(endDate);
        let details = '';
        let spanLength = endDate.getDate() !== startDate.getDate() &&
            (endDate.getTime() - startDate.getTime()) / (60 * 60 * 1000) < 24 ? 1 : 0;
        if (eventData[fields.isAllDay]) {
            details = startDateDetails + ' (' + this.l10n.getConstant('allDay') + ')';
            if (((endDate.getTime() - startDate.getTime()) / MS_PER_DAY) > 1) {
                details += '&nbsp;-&nbsp;' + endDateDetails + ' (' + this.l10n.getConstant('allDay') + ')';
            }
        }
        else if ((((endDate.getTime() - startDate.getTime()) / MS_PER_DAY) >= 1) || spanLength > 0) {
            details = startDateDetails + ' (' + startTimeDetail + ')' + '&nbsp;-&nbsp;' + endDateDetails + ' (' + endTimeDetail + ')';
        }
        else {
            details = startDateDetails + ' (' + (startTimeDetail + '&nbsp;-&nbsp;' + endTimeDetail) + ')';
        }
        return { eventSubject: eventSubject, details: details };
    }
    moreEventClick(data, endDate, groupIndex) {
        this.quickPopupHide(true);
        let moreEventContentEle = this.morePopup.element.querySelector('.' + MORE_EVENT_CONTENT_CLASS);
        if (moreEventContentEle) {
            remove(moreEventContentEle);
        }
        let selectedDate = ((data.date).getTime()).toString();
        let target = closest(data.element, '.' + MORE_INDICATOR_CLASS);
        this.morePopup.element.querySelector('.' + MORE_EVENT_HEADER_DAY_CLASS).innerHTML = this.getDateFormat(data.date, 'E');
        let dateElement = this.morePopup.element.querySelector('.' + MORE_EVENT_HEADER_DATE_CLASS);
        dateElement.innerHTML = this.getDateFormat(data.date, 'd');
        dateElement.setAttribute('data-date', selectedDate);
        dateElement.setAttribute('data-end-date', endDate.getTime().toString());
        let groupOrder;
        if (!isNullOrUndefined(groupIndex)) {
            dateElement.setAttribute('data-group-index', groupIndex);
            groupOrder = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)].groupOrder;
        }
        let moreEventElements = this.createMoreEventList(data.event, groupOrder, groupIndex);
        this.morePopup.element.querySelector('.' + MORE_EVENT_POPUP_CLASS).appendChild(moreEventElements);
        removeClass(this.morePopup.element.querySelector('.' + MORE_EVENT_DATE_HEADER_CLASS).childNodes, CURRENTDATE_CLASS);
        if (resetTime(data.date).getTime() === resetTime(new Date()).getTime()) {
            addClass(this.morePopup.element.querySelector('.' + MORE_EVENT_DATE_HEADER_CLASS).childNodes, CURRENTDATE_CLASS);
        }
        if (this.parent.currentView.indexOf('Timeline') !== -1) {
            let gIndex = target.getAttribute('data-group-index');
            let startDate = new Date(parseInt(target.getAttribute('data-start-date'), 10));
            startDate.setHours(startDate.getHours(), startDate.getMinutes(), 0);
            let tdDate = startDate.getTime().toString();
            if (isNullOrUndefined(gIndex)) {
                this.morePopup.relateTo = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS +
                    ' tbody tr td[data-date="' + tdDate + '"]');
            }
            else {
                this.morePopup.relateTo = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS +
                    ' tbody tr td[data-group-index="' + gIndex + '"][data-date="' + tdDate + '"]');
            }
        }
        else {
            this.morePopup.relateTo = closest(target, '.' + WORK_CELLS_CLASS);
        }
        let eventProp = { type: 'EventContainer', data: data, cancel: false, element: this.morePopup.element };
        this.parent.trigger(popupOpen, eventProp);
        if (eventProp.cancel) {
            return;
        }
        this.morePopup.show();
    }
    saveClick() {
        if (!this.quickPopup.element.querySelector('.' + FORM_CLASS).ej2_instances[0].validate()) {
            return;
        }
        let fields = this.parent.eventFields;
        let saveObj = extend({}, this.parent.eventWindow.getObjectFromFormData(POPUP_WRAPPER_CLASS));
        this.parent.eventWindow.setDefaultValueToObject(saveObj);
        saveObj[fields.id] = this.parent.eventBase.getEventMaxID();
        saveObj[fields.startTime] = this.parent.activeCellsData.startTime;
        saveObj[fields.endTime] = this.parent.activeCellsData.endTime;
        saveObj[fields.isAllDay] = this.parent.activeCellsData.isAllDay;
        if (this.parent.resourceBase) {
            this.parent.resourceBase.setResourceValues(saveObj, true);
        }
        this.parent.currentAction = 'Add';
        this.crudAction.addEvent(saveObj);
        this.quickPopupHide();
    }
    detailsClick() {
        let subjectEle = this.quickPopup.element.querySelector('.' + SUBJECT_CLASS);
        if (subjectEle && subjectEle.value !== '') {
            let args = extend(this.parent.activeCellsData, { subject: subjectEle.value });
        }
        this.fieldValidator.destroyToolTip();
        this.quickPopupHide();
        this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
    }
    editClick() {
        this.quickPopupHide(true);
        let data = this.parent.activeEventData.event;
        this.parent.currentAction = 'EditSeries';
        if (!isNullOrUndefined(data[this.parent.eventFields.recurrenceRule])) {
            this.parent.currentAction = 'EditOccurrence';
            this.openRecurrenceAlert();
        }
        else {
            this.parent.eventWindow.openEditor(data, this.parent.currentAction);
        }
    }
    deleteClick() {
        this.quickPopupHide(true);
        this.parent.currentAction = 'Delete';
        if (this.parent.activeEventData.event[this.parent.eventFields.recurrenceRule]) {
            this.openRecurrenceAlert();
        }
        else {
            this.openDeleteAlert();
        }
    }
    updateMoreEventContent() {
        if (this.morePopup.element.classList.contains('e-popup-close')) {
            return;
        }
        let moreEventContentEle = this.morePopup.element.querySelector('.' + MORE_EVENT_CONTENT_CLASS);
        if (moreEventContentEle) {
            remove(moreEventContentEle);
        }
        let dateElement = this.morePopup.element.querySelector('.' + MORE_EVENT_HEADER_DATE_CLASS);
        let startDate = this.parent.getDateFromElement(dateElement);
        let endDate = new Date(parseInt(dateElement.getAttribute('data-end-date'), 10));
        let groupIndex = dateElement.getAttribute('data-group-index');
        let data;
        let groupOrder;
        if (!isNullOrUndefined(groupIndex)) {
            data = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)];
            groupOrder = data.groupOrder;
        }
        let filteredEvents = this.parent.eventBase.filterEvents(startDate, endDate, this.parent.eventsProcessed, data);
        let moreElement = this.createMoreEventList(filteredEvents, groupOrder, groupIndex);
        this.morePopup.element.querySelector('.' + MORE_EVENT_POPUP_CLASS).appendChild(moreElement);
    }
    closeClick() {
        this.quickPopupHide();
        this.morePopup.hide();
    }
    dialogButtonClick(event) {
        this.quickDialog.hide();
        let target = event.target;
        let cancelButton = this.quickDialog.element.querySelector('.' + QUICK_DIALOG_ALERT_CANCEL);
        if (target.classList.contains(QUICK_DIALOG_OCCURRENCE_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteOccurrence' : 'EditOccurrence';
            switch (this.parent.currentAction) {
                case 'EditOccurrence':
                    this.parent.eventWindow.openEditor(this.parent.activeEventData.event, this.parent.currentAction);
                    break;
                case 'DeleteOccurrence':
                    this.crudAction.deleteEvent(this.parent.activeEventData.event, this.parent.currentAction);
                    break;
            }
        }
        else if (target.classList.contains(QUICK_DIALOG_SERIES_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteSeries' : 'EditSeries';
            switch (this.parent.currentAction) {
                case 'EditSeries':
                    let parentEvent = this.parent.eventBase.getRecurrenceEvent(this.parent.activeEventData.event);
                    this.parent.eventWindow.openEditor(parentEvent, this.parent.currentAction);
                    break;
                case 'DeleteSeries':
                    this.crudAction.deleteEvent(this.parent.activeEventData.event, this.parent.currentAction);
                    break;
            }
        }
        else if (target.classList.contains(QUICK_DIALOG_DELETE_CLASS)) {
            this.crudAction.deleteEvent(this.parent.activeEventData.event, this.parent.currentAction);
        }
        else if (!cancelButton.classList.contains(DISABLE_CLASS) && (target.classList.contains(QUICK_DIALOG_ALERT_OK) ||
            (target.classList.contains(QUICK_DIALOG_ALERT_CANCEL) &&
                !cancelButton.classList.contains(QUICK_DIALOG_CANCEL_CLASS)))) {
            this.parent.uiStateValues.isIgnoreOccurrence = target.classList.contains(QUICK_DIALOG_ALERT_CANCEL);
            this.parent.eventWindow.eventSave(this.l10n.getConstant('ok'));
        }
    }
    updateTapHoldEventPopup(target) {
        let selectedElements = this.parent.eventBase.getSelectedEventElements(target);
        this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
        if (selectedElements.length > 0) {
            let eventObj = this.parent.eventBase.getEventByGuid(selectedElements[0].getAttribute('data-guid'));
            let titleContent = (selectedElements.length === 1) ?
                (eventObj[this.parent.eventFields.subject] || this.l10n.getConstant('noTitle')) :
                '(' + selectedElements.length + ')' + '&nbsp;' + this.l10n.getConstant('selectedItems');
            this.quickPopup.element.querySelector('.' + SUBJECT_CLASS).innerHTML = titleContent;
            if (selectedElements.length > 1) {
                addClass([this.quickPopup.element.querySelector('.' + EDIT_ICON_CLASS)], HIDDEN_CLASS);
            }
            else {
                removeClass([this.quickPopup.element.querySelector('.' + EDIT_ICON_CLASS)], HIDDEN_CLASS);
            }
        }
        else {
            this.parent.selectedElements = [];
            this.quickPopupHide();
        }
    }
    getTimezone(event) {
        let zoneDetails = '';
        zoneDetails += event[this.parent.eventFields.startTimezone] || '';
        zoneDetails += zoneDetails === '' ? '' : ' - ';
        zoneDetails += event[this.parent.eventFields.endTimezone] || '';
        return zoneDetails;
    }
    getRecurrenceSummary(event) {
        let recurrenceEditor = this.parent.eventWindow.getRecurrenceEditorInstance();
        if (recurrenceEditor) {
            let ruleSummary = recurrenceEditor.getRuleSummary(event[this.parent.eventFields.recurrenceRule]);
            return ruleSummary.charAt(0).toUpperCase() + ruleSummary.slice(1);
        }
        return '';
    }
    getDateFormat(date, formatString) {
        return this.parent.globalize.formatDate(date, { skeleton: formatString, calendar: this.parent.getCalendarMode() });
    }
    getDataFromTarget(target) {
        if (target.classList.contains(APPOINTMENT_CLASS)) {
            return this.parent.activeEventData.event;
        }
        // Depricated cells data in quick popups
        let eventObj = {
            startTime: this.parent.activeCellsData.startTime,
            endTime: this.parent.activeCellsData.endTime,
            isAllDay: this.parent.activeCellsData.isAllDay,
            groupIndex: this.parent.activeCellsData.groupIndex
        };
        let cellsData = this.parent.activeCellsData;
        this.parent.eventWindow.convertToEventData(cellsData, eventObj);
        return eventObj;
    }
    beforeQuickDialogClose() {
        this.parent.eventBase.focusElement();
    }
    beforeQuickPopupOpen(target) {
        let isEventPopup = this.quickPopup.element.querySelector('.' + EVENT_POPUP_CLASS);
        let popupType = this.parent.isAdaptive ? isEventPopup ? 'ViewEventInfo' : 'EditEventInfo' : 'QuickInfo';
        let eventProp = {
            type: popupType, cancel: false, data: this.getDataFromTarget(target),
            target: target, element: this.quickPopup.element
        };
        this.parent.trigger(popupOpen, eventProp);
        if (eventProp.cancel) {
            this.destroyButtons();
            if (eventProp.element.classList.contains(POPUP_OPEN)) {
                this.quickPopupClose();
            }
            this.quickPopup.element.innerHTML = '';
            return;
        }
        let display = this.quickPopup.element.style.display;
        this.quickPopup.element.style.display = 'block';
        if (this.parent.isAdaptive) {
            this.quickPopup.element.removeAttribute('style');
            this.quickPopup.element.style.display = 'block';
            this.quickPopup.element.style.height = formatUnit((popupType === 'EditEventInfo') ? 65 : window.innerHeight);
        }
        else {
            this.quickPopup.offsetX = 10;
            this.quickPopup.collision = { X: this.parent.enableRtl ? 'flip' : 'none', Y: 'fit' };
            this.quickPopup.position = { X: this.parent.enableRtl ? 'left' : 'right', Y: 'top' };
            this.quickPopup.dataBind();
            this.quickPopup.refreshPosition(null, true);
            let collide = isCollide(this.quickPopup.element, this.parent.element);
            if (collide.indexOf(this.parent.enableRtl ? 'left' : 'right') > -1) {
                this.quickPopup.offsetX = -target.offsetWidth - 10 - this.quickPopup.element.offsetWidth;
                this.quickPopup.dataBind();
                let leftCollide = isCollide(this.quickPopup.element, this.parent.element);
                if (leftCollide.indexOf('left') > -1) {
                    this.quickPopup.position = { X: 'center', Y: 'center' };
                    this.quickPopup.collision = { X: 'fit', Y: 'fit' };
                    this.quickPopup.offsetX = -(this.quickPopup.element.offsetWidth / 2);
                    this.quickPopup.dataBind();
                }
            }
            if (this.parent.virtualScrollModule && (collide.indexOf('top') > -1 || collide.indexOf('bottom') > -1)) {
                let element = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS + ' table');
                let translateY = getTranslateY(element);
                this.quickPopup.offsetY = translateY;
                this.quickPopup.dataBind();
            }
        }
        if (isEventPopup) {
            this.applyEventColor();
        }
        this.quickPopup.element.style.display = display;
        this.quickPopup.dataBind();
        this.quickPopup.show();
    }
    applyEventColor() {
        let colorField = '';
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            colorField = this.parent.enableRtl ? 'border-right-color' : 'border-left-color';
        }
        else {
            colorField = 'background-color';
        }
        // tslint:disable-next-line:no-any
        let color = this.parent.activeEventData.element.style[colorField];
        if (color === '') {
            return;
        }
        let colorEle = this.quickPopup.element.querySelector('.' + POPUP_HEADER_CLASS);
        let footerEle = this.quickPopup.element.querySelector('.' + POPUP_FOOTER_CLASS);
        if (footerEle && footerEle.offsetParent) {
            colorEle = this.quickPopup.element.querySelector('.' + SUBJECT_CLASS);
            if (colorEle) {
                colorEle.style.borderLeftColor = color;
                color = `rgba(${color.match(/\d+/g).join()},0.3)`;
            }
        }
        if (colorEle) {
            colorEle.style.backgroundColor = color;
        }
    }
    quickPopupOpen() {
        if (this.parent.isAdaptive) {
            return;
        }
        if (this.quickPopup.element.querySelector('.' + CELL_POPUP_CLASS)) {
            let subjectElement = this.quickPopup.element.querySelector('.' + SUBJECT_CLASS);
            if (subjectElement) {
                subjectElement.focus();
            }
        }
        else {
            let editElement = this.quickPopup.element.querySelector('.' + EDIT_EVENT_CLASS);
            if (editElement) {
                editElement.focus();
            }
            let editIcon = this.quickPopup.element.querySelector('.' + EDIT_CLASS);
            if (editIcon) {
                editIcon.focus();
            }
        }
    }
    quickPopupClose() {
        this.parent.eventBase.focusElement();
        this.quickPopup.relateTo = WORK_CELLS_CLASS;
        this.fieldValidator.destroyToolTip();
        this.destroyButtons();
        this.quickPopup.element.innerHTML = '';
    }
    morePopupOpen() {
        this.morePopup.element.querySelector('.' + MORE_EVENT_HEADER_DATE_CLASS).focus();
        this.morePopup.refreshPosition();
    }
    morePopupClose() {
        let moreWrapper = this.parent.element.querySelector('.' + MORE_EVENT_WRAPPER_CLASS);
        if (moreWrapper) {
            remove(moreWrapper);
        }
    }
    quickPopupHide(hideAnimation) {
        if (this.quickPopup.element.classList.contains('e-popup-open')) {
            if (hideAnimation) {
                let animation = this.quickPopup.hideAnimation;
                this.quickPopup.hideAnimation = null;
                this.quickPopup.hide();
                this.quickPopup.hideAnimation = animation;
            }
            else {
                this.quickPopup.hide();
            }
            this.isMultipleEventSelect = false;
        }
    }
    navigationClick(e) {
        let navigateEle = closest(e.target, '.' + NAVIGATE_CLASS);
        if (!isNullOrUndefined(navigateEle)) {
            let date = this.parent.getDateFromElement(e.currentTarget);
            if (!isNullOrUndefined(date) && !this.parent.isAdaptive) {
                this.closeClick();
                this.parent.setProperties({ selectedDate: date }, true);
                this.parent.changeView(this.parent.getNavigateView(), e);
            }
        }
    }
    documentClick(e) {
        let target = e.event.target;
        let classNames = '.' + POPUP_WRAPPER_CLASS + ',.' + HEADER_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS +
            ',.' + WORK_CELLS_CLASS + ',.' + APPOINTMENT_CLASS;
        if (closest(target, '.' + APPOINTMENT_CLASS + ',.' + HEADER_CELLS_CLASS)) {
            this.parent.removeNewEventElement();
        }
        if (!closest(target, classNames)) {
            this.quickPopupHide();
            this.parent.removeNewEventElement();
        }
        if (!closest(target, '.' + MORE_POPUP_WRAPPER_CLASS) && !target.classList.contains(MORE_INDICATOR_CLASS)
            && (!closest(target, '.' + POPUP_OPEN))) {
            this.morePopup.hide();
        }
    }
    onClosePopup() {
        this.quickPopupHide();
        this.parent.eventBase.focusElement();
    }
    addEventListener() {
        this.parent.on(cellClick, this.cellClick, this);
        this.parent.on(eventClick, this.eventClick, this);
        this.parent.on(documentClick, this.documentClick, this);
        this.parent.on(dataReady, this.updateMoreEventContent, this);
    }
    removeEventListner() {
        this.parent.off(cellClick, this.cellClick);
        this.parent.off(eventClick, this.eventClick);
        this.parent.off(documentClick, this.documentClick);
        this.parent.off(dataReady, this.updateMoreEventContent);
    }
    destroyButtons() {
        let buttonCollections = [].slice.call(this.quickPopup.element.querySelectorAll('.e-control.e-btn'));
        buttonCollections.forEach((button) => {
            let instance = button.ej2_instances[0];
            if (instance) {
                instance.destroy();
            }
        });
    }
    destroy() {
        this.fieldValidator.destroy();
        this.removeEventListner();
        this.destroyButtons();
        this.quickPopup.destroy();
        remove(this.quickPopup.element);
        this.morePopup.destroy();
        remove(this.morePopup.element);
        if (this.quickDialog.element) {
            this.quickDialog.destroy();
            remove(this.quickDialog.element);
            this.quickDialog.element = null;
        }
    }
}

/**
 * Tooltip for Schedule
 */
class EventTooltip {
    constructor(parent) {
        this.parent = parent;
        this.tooltipObj = new Tooltip({
            content: 'No title',
            position: 'BottomRight',
            offsetY: 10,
            mouseTrail: this.parent.isAdaptive ? false : true,
            showTipPointer: false,
            cssClass: this.parent.cssClass + ' ' + EVENT_TOOLTIP_ROOT_CLASS,
            target: this.getTargets(),
            beforeRender: this.onBeforeRender.bind(this),
            enableRtl: this.parent.enableRtl
        });
        this.tooltipObj.appendTo(this.parent.element);
    }
    getTargets() {
        let targets = [];
        if (this.parent.activeViewOptions.group.headerTooltipTemplate) {
            targets.push('.' + RESOURCE_CELLS_CLASS);
        }
        if (this.parent.eventSettings.enableTooltip) {
            targets.push('.' + APPOINTMENT_CLASS);
        }
        return targets.join(',');
    }
    onBeforeRender(args) {
        if (!isNullOrUndefined(args.target.getAttribute('data-tooltip-id'))) {
            return;
        }
        if (args.target.classList.contains(RESOURCE_CELLS_CLASS) && this.parent.activeViewOptions.group.resources.length > 0) {
            let resCollection;
            if (this.parent.activeView.isTimelineView()) {
                let index = parseInt(args.target.getAttribute('data-group-index'), 0);
                resCollection = this.parent.resourceBase.lastResourceLevel[index];
            }
            else {
                let rowIndex = args.target.parentNode.sectionRowIndex;
                let cellIndex = args.target.cellIndex;
                resCollection = this.parent.activeView.getColumnLevels()[rowIndex][cellIndex];
            }
            let data = {
                resource: resCollection.resource,
                resourceData: resCollection.resourceData
            };
            let contentContainer = createElement('div');
            append(this.parent.getHeaderTooltipTemplate()(data), contentContainer);
            this.setContent(contentContainer);
            return;
        }
        let record = this.parent.eventBase.getEventByGuid(args.target.getAttribute('data-guid'));
        if (!isNullOrUndefined(this.parent.eventSettings.tooltipTemplate)) {
            let contentContainer = createElement('div');
            append(this.parent.getEventTooltipTemplate()(record), contentContainer);
            this.setContent(contentContainer);
        }
        else {
            let globalize = this.parent.globalize;
            let fields = this.parent.eventFields;
            let eventStart = new Date('' + record[fields.startTime]);
            let eventEnd = new Date('' + record[fields.endTime]);
            eventEnd = (eventEnd.getHours() === 0 && eventEnd.getMinutes() === 0) ? new Date(eventEnd.setMilliseconds(-1000)) : eventEnd;
            let startDate = resetTime(new Date('' + eventStart));
            let endDate = resetTime(new Date('' + eventEnd));
            let tooltipSubject = (record[fields.subject] || this.parent.eventSettings.fields.subject.default);
            let tooltipLocation = !isNullOrUndefined(record[fields.location]) ? record[fields.location] : '';
            let startMonthDate = globalize.formatDate(eventStart, {
                type: 'date', skeleton: 'MMMd', calendar: this.parent.getCalendarMode()
            });
            let startMonthYearDate = globalize.formatDate(eventStart, {
                type: 'date', skeleton: 'medium', calendar: this.parent.getCalendarMode()
            });
            let endMonthYearDate = globalize.formatDate(eventEnd, {
                type: 'date', skeleton: 'medium', calendar: this.parent.getCalendarMode()
            });
            let startTime = globalize.formatDate(eventStart, {
                type: 'time', skeleton: 'short', calendar: this.parent.getCalendarMode()
            });
            let endTime = globalize.formatDate(eventEnd, {
                type: 'time', skeleton: 'short', calendar: this.parent.getCalendarMode()
            });
            let tooltipDetails;
            if (startDate.getTime() === endDate.getTime()) {
                tooltipDetails = globalize.formatDate(eventStart, {
                    type: 'date', skeleton: 'long', calendar: this.parent.getCalendarMode()
                });
            }
            else {
                tooltipDetails = (startDate.getFullYear() === endDate.getFullYear()) ? (startMonthDate + ' - ' + endMonthYearDate) :
                    (startMonthYearDate + ' - ' + endMonthYearDate);
            }
            let tooltipTime = (record[fields.isAllDay]) ? this.parent.localeObj.getConstant('allDay') :
                (startTime + ' - ' + endTime);
            let content = '<div><div class="e-subject">' + tooltipSubject + '</div>' +
                '<div class="e-location">' + tooltipLocation + '</div>' +
                '<div class="e-details">' + tooltipDetails + '</div>' +
                '<div class="e-all-day">' + tooltipTime + '</div></div>';
            this.setContent(content);
        }
    }
    setContent(content) {
        this.tooltipObj.setProperties({ content: content }, true);
    }
    close() {
        this.tooltipObj.close();
    }
    /**
     * To destroy the event tooltip.
     * @return {void}
     * @private
     */
    destroy() {
        this.tooltipObj.destroy();
        this.tooltipObj = null;
    }
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const HEADER = 'e-editor';
const INPUTWARAPPER = 'e-input-wrapper';
const INPUTWARAPPERSIDE = 'e-input-wrapper-side';
const REPEATELEMENT = 'e-repeat-element';
const REPEATINTERVAL = 'e-repeat-interval';
const INTERVALCLASS = 'e-interval';
const DAYWRAPPER = 'e-days';
const WEEKWRAPPER = 'e-non-week';
const WEEKPOSITION = 'e-week-position';
const YEAREXPANDERWRAPPER = 'e-year-expander';
const YEAREXPANDERELEMENT = 'e-year-expander-element';
const MONETHEXPANDERWRAPPER = 'e-month-expander';
const MONETHEXPANDWRAPPER = 'e-month-expand-wrapper';
const MONTHEXPANDERELEMENT = 'e-month-expander-element';
const MONTHEXPANDERCHECKBOXWRAPPER = 'e-month-expander-checkbox-wrapper';
const FORMLEFT = 'e-form-left';
const FORMRIGHT = 'e-form-right';
const MONTHDAYWRAPPER = 'e-month-day';
const MONTHEXPANNDERELEM = 'e-month-expander-wrapper';
const MONTHPOS = 'e-month-pos';
const MONTHWEEK = 'e-month-week';
const ENDON = 'e-end-on';
const MONTHEXPANDERLABEL = 'e-month-expander-label';
const WEEKEXPANDERLABEL = 'e-week-expander-label';
const ENDONLABEL = 'e-end-on-label';
const ENDONLEFT = 'e-end-on-left';
const MONTHDAYELEMENT = 'e-monthday-element';
const ENDONELEMENT = 'e-end-on-element';
const ENDONDATE = 'e-end-on-date';
const UNTILDATE = 'e-until-date';
const ENDONCOUNTWRAPPER = 'e-end-on-count';
const ENDONCOUNT = 'e-recurrence-count';
const HIDEWRAPPER = 'e-hide-recurrence-element';
const RTLCLASS = 'e-rtl';
const PRIMARY = 'e-primary';
const ACTIVE = 'e-active';
const RECURRENCETABLE = 'e-recurrence-table';
const REPEATCONTENT = 'e-repeat-content';
const REPEATCONTENTWRAPPER = 'e-repeat-content-wrapper';
const NONE = 'none';
const DAILY = 'daily';
const WEEKLY = 'weekly';
const MONTHLY = 'monthly';
const YEARLY = 'yearly';
const NEVER = 'never';
const UNTIL$1 = 'until';
const COUNT = 'count';
const TEXTFIELD = 'text';
const VALUEFIELD = 'value';
const LAST = 'last';
const REPEAT = 'repeat';
const REPEATEVERY = 'repeatEvery';
const ON$1 = 'on';
const END = 'end';
const RADIOLABEL = 'onDay';
const RULEUNTIL = 'UNTIL';
const RULEBYDAY = 'BYDAY';
const RULEBYMONTHDAY = 'BYMONTHDAY';
const RULEBYMONTH = 'BYMONTH';
const RULEINTERVAL = 'INTERVAL';
const RULECOUNT = 'COUNT';
const RULESETPOS = 'BYSETPOS';
const RULEFREQ = 'FREQ';
const RULEDAILY = 'DAILY';
const RULEWEEKLY = 'WEEKLY';
const RULEMONTHLY = 'MONTHLY';
const RULEYEARLY = 'YEARLY';
const RULESUNDAY = 'SU';
const RULEMONDAY = 'MO';
const RULETUESDAY = 'TU';
const RULEWEDNESDAY = 'WE';
const RULETHURSDAY = 'TH';
const RULEFRIDAY = 'FR';
const RULESATURDAY = 'SA';
const KEYSUNDAY = 'sun';
const KEYMONDAY = 'mon';
const KEYTUESDAY = 'tue';
const KEYWEDNESDAY = 'wed';
const KEYTHURSDAY = 'thu';
const KEYFRIDAY = 'fri';
const KEYSATURDAY = 'sat';
const EQUAL = '=';
const SEMICOLON = ';';
const COMMA = ',';
const FIRST = 'first';
const SECOND = 'second';
const THIRD = 'third';
const FOURTH = 'fourth';
let contentType = {
    none: '',
    daily: 'days',
    weekly: 'weeks',
    monthly: 'months',
    yearly: 'years'
};
let valueData = {
    'sun': RULESUNDAY,
    'mon': RULEMONDAY,
    'tue': RULETUESDAY,
    'wed': RULEWEDNESDAY,
    'thu': RULETHURSDAY,
    'fri': RULEFRIDAY,
    'sat': RULESATURDAY
};
let neverClassList = [DAYWRAPPER, WEEKWRAPPER, ENDON, INTERVALCLASS, YEAREXPANDERWRAPPER, MONETHEXPANDERWRAPPER];
let weekClassList = [WEEKWRAPPER];
let monthClassList = [DAYWRAPPER, YEAREXPANDERWRAPPER];
let yearClassList = [DAYWRAPPER];
let dailyClassList = [DAYWRAPPER, WEEKWRAPPER, YEAREXPANDERWRAPPER, MONETHEXPANDERWRAPPER];
let noEndClassList = [ENDONDATE, ENDONCOUNTWRAPPER];
let endOnCountClassList = [ENDONDATE];
let endOnDateClassList = [ENDONCOUNTWRAPPER];
/**
 * Represents the RecurrenceEditor component.
 * ```html
 * <div id="recurrence"></div>
 * ```
 * ```typescript
 * <script>
 *   var recObj = new RecurrenceEditor();
 *   recObj.appendTo("#recurrence");
 * </script>
 * ```
 */
let RecurrenceEditor = class RecurrenceEditor extends Component {
    /**
     * Constructor for creating the widget
     * @param  {object} options?
     */
    constructor(options, element) {
        super(options, element);
        this.defaultLocale = {
            none: 'None',
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            month: 'Month',
            yearly: 'Yearly',
            never: 'Never',
            until: 'Until',
            count: 'Count',
            first: 'First',
            second: 'Second',
            third: 'Third',
            fourth: 'Fourth',
            last: 'Last',
            repeat: 'Repeat',
            repeatEvery: 'Repeat every',
            on: 'Repeat On',
            end: 'End',
            onDay: 'Day',
            days: 'Day(s)',
            weeks: 'Week(s)',
            months: 'Month(s)',
            years: 'Year(s)',
            every: 'every',
            summaryTimes: 'time(s)',
            summaryOn: 'on',
            summaryUntil: 'until',
            summaryRepeat: 'Repeats',
            summaryDay: 'day(s)',
            summaryWeek: 'week(s)',
            summaryMonth: 'month(s)',
            summaryYear: 'year(s)',
            monthWeek: 'Month Week',
            monthPosition: 'Month Position',
            monthExpander: 'Month Expander',
            yearExpander: 'Year Expander',
            repeatInterval: 'Repeat Interval'
        };
        this.renderStatus = false;
        this.dayButtons = [];
        this.monthButtons = [];
        this.calendarUtil = getCalendarUtil(this.calendarMode);
    }
    startState(freq, endOn, startDate) {
        this.showFormElement();
        this.updateForm(freq);
        this.freshOnEndForm();
        this.updateEndOnForm(endOn);
        this.selectMonthDay(startDate);
        this.updateUntilDate(startDate);
        this.onMonthDay.setProperties({ checked: true });
    }
    preRender() {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        // pre render code snippets
    }
    applyCustomClass(cssClass) {
        if (cssClass) {
            addClass([this.element], cssClass);
        }
    }
    initialize() {
        addClass([this.element], 'e-' + this.getModuleName());
        this.renderComponent();
        if (!isNullOrUndefined(this.value)) {
            this.setRecurrenceRule(this.value);
        }
        else {
            this.startState(this.repeatType.value.toString().toUpperCase(), NEVER, this.startDate);
            this.updateForm(this.repeatType.value.toString());
            if (this.selectedType > 0) {
                this.setProperties({ value: this.getRecurrenceRule() }, false);
            }
        }
        this.applyCustomClass(this.cssClass);
    }
    triggerChangeEvent() {
        if (this.renderStatus) {
            let value = this.getRecurrenceRule();
            this.trigger('change', { value: value });
            this.setProperties({ value: value }, false);
        }
    }
    resetDayButton() {
        let elements = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button'));
        elements.forEach((element) => removeClass([element], [ACTIVE, PRIMARY]));
    }
    daySelection(dayIndex) {
        this.resetDayButton();
        let days = [0, 1, 2, 3, 4, 5, 6];
        this.rotateArray(days, this.firstDayOfWeek);
        let element = this.element.querySelector('.' + DAYWRAPPER + ' button[data-index="' + days.indexOf(dayIndex) + '"]');
        if (element) {
            addClass([element], [ACTIVE, PRIMARY]);
        }
    }
    rtlClass(status) {
        if (status) {
            addClass([this.element], RTLCLASS);
        }
        else {
            removeClass([this.element], RTLCLASS);
        }
    }
    updateUntilDate(date) {
        let tempDate = new Date(date.getTime());
        tempDate.setDate(tempDate.getDate() + 60);
        this.untilDateObj.setProperties({ value: tempDate });
    }
    selectMonthDay(date) {
        let weekday = [KEYSUNDAY, KEYMONDAY, KEYTUESDAY, KEYWEDNESDAY, KEYTHURSDAY, KEYFRIDAY, KEYSATURDAY];
        this.monthDate.setProperties({ value: this.calendarUtil.getDate(date) });
        this.monthWeekDays.setProperties({ value: valueData[weekday[date.getDay()]] });
        this.monthValue.setProperties({ value: '' + this.calendarUtil.getMonth(date) });
        this.monthWeekPos.setProperties({ value: this.getDayPosition(date) });
        this.daySelection(date.getDay());
    }
    updateForm(state) {
        this.repeatType.setProperties({ value: state });
        let end = this.element.querySelector('.' + ENDON);
        if (state === DAILY) {
            classList(end, [FORMLEFT], [FORMRIGHT]);
        }
        else {
            classList(end, [FORMRIGHT], [FORMLEFT]);
        }
        switch (state) {
            case NONE:
                neverClassList.forEach((className) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case WEEKLY:
                weekClassList.forEach((className) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case MONTHLY:
                monthClassList.forEach((className) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case YEARLY:
                yearClassList.forEach((className) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case DAILY:
                dailyClassList.forEach((className) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
        }
    }
    updateEndOnForm(state) {
        this.endType.setProperties({ value: state });
        switch (state) {
            case NEVER:
                noEndClassList.forEach((className) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case UNTIL$1:
                endOnDateClassList.forEach((className) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
            case COUNT:
                endOnCountClassList.forEach((className) => addClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
                break;
        }
    }
    freshOnEndForm() {
        noEndClassList.forEach((className) => {
            let element = this.element.querySelector('.' + className);
            if (element) {
                removeClass([element], HIDEWRAPPER);
            }
        });
    }
    showFormElement() {
        neverClassList.forEach((className) => removeClass([this.element.querySelector('.' + className)], HIDEWRAPPER));
    }
    renderDropdowns() {
        let self = this;
        this.repeatType = new DropDownList({
            //set the data to dataSource property
            dataSource: this.getRepeatData(),
            floatLabelType: 'Always',
            enableRtl: this.enableRtl,
            index: this.selectedType,
            fields: {
                text: TEXTFIELD,
                value: VALUEFIELD
            },
            placeholder: this.localeObj.getConstant(REPEAT),
            htmlAttributes: { 'title': this.localeObj.getConstant(REPEAT) },
            change: (args) => {
                self.setProperties({ selectedType: args.value }, false);
                self.element.querySelector('.' + REPEATCONTENT).innerHTML =
                    self.localeObj.getConstant(contentType[args.value]);
                self.showFormElement();
                self.updateForm(args.value);
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        // set placeholder to DropDownList input element
        this.repeatType.appendTo(this.element.querySelector('.' + REPEATELEMENT));
        this.endType = new DropDownList({
            dataSource: this.getEndData(),
            popupWidth: this.getPopupWidth(),
            enableRtl: this.enableRtl,
            index: 1,
            fields: {
                text: TEXTFIELD,
                value: VALUEFIELD
            },
            change: (args) => {
                self.freshOnEndForm();
                self.updateEndOnForm(args.value);
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.endType.appendTo(this.element.querySelector('.' + ENDONELEMENT));
        let renderDropDownList = (dropDownData) => {
            return new DropDownList({
                dataSource: dropDownData,
                popupWidth: this.getPopupWidth(),
                enableRtl: this.enableRtl,
                fields: {
                    text: TEXTFIELD,
                    value: VALUEFIELD
                },
                index: 1,
                change: (args) => {
                    self.onWeekDay.setProperties({ checked: true });
                    self.resetFormValues();
                    self.triggerChangeEvent();
                }
            });
        };
        this.monthWeekPos = renderDropDownList(this.getMonthPosData());
        this.monthWeekPos.appendTo(this.element.querySelector('.' + MONTHPOS));
        this.monthWeekDays = renderDropDownList(this.getDayData('wide'));
        this.monthWeekDays.appendTo(this.element.querySelector('.' + MONTHWEEK));
        this.monthValue = new DropDownList({
            dataSource: this.getMonthData(),
            fields: {
                text: TEXTFIELD,
                value: VALUEFIELD
            },
            floatLabelType: 'Always',
            enableRtl: this.enableRtl,
            index: 7,
            change: (args) => {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.monthValue.appendTo(this.element.querySelector('.' + YEAREXPANDERELEMENT));
    }
    setDefaultValue() {
        let formelement = [].slice.call(this.element.querySelectorAll('.e-control .e-numerictextbox'));
        for (let element of formelement) {
            let instance = element.ej2_instances[0];
            if (instance.element.classList.contains(REPEATINTERVAL)) {
                instance.value = 1;
                instance.dataBind();
            }
            else if (instance.element.classList.contains(ENDONCOUNT)) {
                instance.value = 10;
                instance.dataBind();
            }
        }
    }
    resetFormValues() {
        let recurreneElement = [].slice.call(this.element.querySelectorAll('.e-control [type="text"]'));
        for (let element of recurreneElement) {
            let instance;
            if (element.classList.contains('e-datepicker')) {
                instance = element.ej2_instances[0];
                if (instance.value) {
                    instance.value = instance.value;
                    instance.dataBind();
                }
                else {
                    this.updateUntilDate(this.startDate);
                }
            }
            else if (element.classList.contains('e-dropdownlist')) {
                instance = element.ej2_instances[0];
                instance.index = instance.index || 0;
                instance.dataBind();
            }
            else if (element.classList.contains('e-numerictextbox')) {
                instance = element.ej2_instances[0];
                let value;
                if (instance.element.classList.contains(REPEATINTERVAL)) {
                    value = 1;
                }
                else if (instance.element.classList.contains(ENDONCOUNT)) {
                    value = 10;
                }
                else {
                    value = this.startDate.getDate();
                }
                instance.value = instance.value || value;
                instance.dataBind();
            }
        }
    }
    getPopupWidth() {
        return Browser.isDevice ? '100%' : 'auto';
    }
    renderDatePickers() {
        let self = this;
        this.untilDateObj = new DatePicker({
            enableRtl: this.enableRtl,
            min: this.minDate,
            max: this.maxDate,
            change: (args) => {
                if (args.value) {
                    self.triggerChangeEvent();
                }
            }
        });
        this.untilDateObj.appendTo(this.element.querySelector('.' + UNTILDATE));
    }
    dayButtonRender() {
        let btns = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button'));
        let self = this;
        for (let btn of btns) {
            let button = new Button({ isToggle: true, enableRtl: this.enableRtl }, btn);
            this.dayButtons.push(button);
            EventHandler.add(btn, 'click', (args) => {
                let btns = [].slice.call(this.element.querySelectorAll('.' + DAYWRAPPER + ' button.' + PRIMARY));
                let element = args.target;
                if (!element.classList.contains(PRIMARY)) {
                    addClass([element], PRIMARY);
                    self.triggerChangeEvent();
                }
                else if (btns.length > 1) {
                    removeClass([element], PRIMARY);
                    self.triggerChangeEvent();
                }
            });
        }
    }
    radioButtonRender() {
        let self = this;
        this.onMonthDay = new RadioButton({
            label: this.localeObj.getConstant(RADIOLABEL),
            enableRtl: this.enableRtl,
            name: 'monthType',
            value: 'day',
            change: (args) => {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.onMonthDay.appendTo(this.element.querySelector('.' + MONTHEXPANDERELEMENT));
        this.monthButtons.push(this.onMonthDay);
        this.onWeekDay = new RadioButton({
            label: '',
            name: 'monthType',
            enableRtl: this.enableRtl,
            value: 'daypos',
            change: (args) => {
                self.resetFormValues();
                self.triggerChangeEvent();
            }
        });
        this.onWeekDay.appendTo(this.element.querySelector('.' + MONTHEXPANNDERELEM));
        this.monthButtons.push(this.onWeekDay);
    }
    numericTextboxRender() {
        let self = this;
        this.recurrenceCount = new NumericTextBox({
            value: 10,
            format: '#',
            enableRtl: this.enableRtl,
            floatLabelType: 'Always',
            min: 1,
            change: (args) => {
                self.triggerChangeEvent();
            }
        });
        this.recurrenceCount.appendTo(this.element.querySelector('.' + ENDONCOUNT));
        this.monthDate = new NumericTextBox({
            value: 1,
            format: '#',
            enableRtl: this.enableRtl,
            min: 1,
            max: 31,
            change: (args) => {
                self.onMonthDay.setProperties({ checked: true });
                self.triggerChangeEvent();
            }
        });
        this.monthDate.appendTo(this.element.querySelector('.' + MONTHDAYWRAPPER));
        this.repeatInterval = new NumericTextBox({
            value: 1,
            format: '#',
            min: 1,
            enableRtl: this.enableRtl,
            floatLabelType: 'Always',
            placeholder: this.localeObj.getConstant(REPEATEVERY),
            change: (args) => {
                self.triggerChangeEvent();
            }
        });
        this.repeatInterval.appendTo(this.element.querySelector('.' + REPEATINTERVAL));
    }
    renderComponent() {
        this.setTemplate();
        this.renderDropdowns();
        this.renderDatePickers();
        this.dayButtonRender();
        this.radioButtonRender();
        this.numericTextboxRender();
    }
    rotateArray(data, count) {
        let temp;
        for (let index = 0; index < count; index++) {
            temp = data.shift();
            data.push(temp);
        }
    }
    getEndData() {
        let endData = [NEVER, UNTIL$1, COUNT];
        let self = this;
        let dataSource = [];
        endData.forEach((data) => {
            dataSource.push({ text: self.localeObj.getConstant(data), value: data });
        });
        return dataSource;
    }
    getDayPosition(date) {
        let temp = new Date(date.getTime());
        let endDate = new Date(date.getTime());
        let day = date.getDay();
        let positionCollection = [];
        temp = this.calendarUtil.getMonthStartDate(temp);
        endDate = this.calendarUtil.getMonthEndDate(endDate);
        while (temp < endDate) {
            if (temp.getDay() === day) {
                positionCollection.push(temp.getTime());
            }
            temp.setDate(temp.getDate() + 1);
        }
        if (positionCollection.indexOf(date.getTime()) === positionCollection.length - 1) {
            return -1;
        }
        return (positionCollection.indexOf(date.getTime()) + 1);
    }
    getRepeatData() {
        let data = [];
        let self = this;
        this.frequencies.forEach((element) => {
            let textValue = (element === NONE) ? NEVER : element;
            data.push({ text: self.localeObj.getConstant(textValue), value: element });
        });
        return data;
    }
    getMonthPosData() {
        let monthpos = [FIRST, SECOND, THIRD, FOURTH, LAST];
        let monthposValue = {
            first: 1,
            second: 2,
            third: 3,
            fourth: 4,
            last: -1
        };
        let self = this;
        let dataSource = [];
        monthpos.forEach((data) => {
            dataSource.push({ text: self.localeObj.getConstant(data), value: monthposValue[data] });
        });
        return dataSource;
    }
    getDayData(format) {
        let weekday = [KEYSUNDAY, KEYMONDAY, KEYTUESDAY, KEYWEDNESDAY, KEYTHURSDAY, KEYFRIDAY, KEYSATURDAY];
        let dayData = [];
        let cldrObj;
        this.rotateArray(weekday, this.firstDayOfWeek);
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = (getValue('days.stand-alone.' + format, getDefaultDateObject(this.getCalendarMode())));
        }
        else {
            cldrObj = (getValue('main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.days.stand-alone.' + format, cldrData));
        }
        for (let obj of weekday) {
            dayData.push({ text: getValue(obj, cldrObj), value: valueData[obj] });
        }
        return dayData;
    }
    getMonthData() {
        let monthData = [];
        let cldrObj;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = (getValue('months.stand-alone.wide', getDefaultDateObject(this.getCalendarMode())));
        }
        else {
            cldrObj = (getValue('main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.months.stand-alone.wide', cldrData));
        }
        for (let obj of Object.keys(cldrObj)) {
            monthData.push({
                text: getValue(obj, cldrObj),
                value: obj
            });
        }
        return monthData;
    }
    setTemplate() {
        let dayData = this.getDayData('narrow');
        let fullDay = this.getDayData('wide');
        this.element.innerHTML = '<div class="' + HEADER + '">' +
            '<div class="' + INPUTWARAPPER + ' ' + FORMLEFT + '">' +
            '<input type="text" tabindex="0" class="' + REPEATELEMENT +
            '"label="' + REPEATELEMENT.substr(2) + '" />' +
            '</div><div class="' + INPUTWARAPPER + ' ' +
            INTERVALCLASS + ' ' + FORMRIGHT + '"><table  class="' + RECURRENCETABLE + ' ' + REPEATCONTENTWRAPPER + '"><tr>' +
            '<td><input type="text" tabindex="0" class="' + REPEATINTERVAL +
            '"title="' + this.localeObj.getConstant('repeatInterval') + '" /></td>' +
            '<td><span class="' + REPEATCONTENT + '"></span></td>' +
            '</tr></table></div><div class="' + INPUTWARAPPERSIDE + ' ' + DAYWRAPPER + ' ' + FORMLEFT + '">' +
            '<div class=' + WEEKEXPANDERLABEL + '>' + this.localeObj.getConstant(ON$1) + '</div>' +
            '<button type="button" class="e-round" data-index="0" title="' + fullDay[0].text + '">' + dayData[0].text + '</button>' +
            '<button type="button" class="e-round" data-index="1" title="' + fullDay[1].text + '">' + dayData[1].text + '</button>' +
            '<button type="button" class="e-round" data-index="2" title="' + fullDay[2].text + '">' + dayData[2].text + '</button>' +
            '<button type="button" class="e-round" data-index="3" title="' + fullDay[3].text + '">' + dayData[3].text + '</button>' +
            '<button type="button" class="e-round" data-index="4" title="' + fullDay[4].text + '">' + dayData[4].text + '</button>' +
            '<button type="button" class="e-round" data-index="5" title="' + fullDay[5].text + '">' + dayData[5].text + '</button>' +
            '<button type="button" class="e-round" data-index="6" title="' + fullDay[6].text + '">' + dayData[6].text + '</button></div>' +
            '<div class="' + INPUTWARAPPERSIDE + ' ' + WEEKWRAPPER + ' ' + FORMLEFT + '">' +
            '<div class=' + MONTHEXPANDERLABEL + '>' + this.localeObj.getConstant(ON$1) + '</div>' +
            '<div class="' + YEAREXPANDERWRAPPER + '">' +
            '<input class="' + YEAREXPANDERELEMENT + '" type="text" tabindex="0" title="' +
            this.localeObj.getConstant('yearExpander') + '"/>' +
            '</div>' +
            '<div class="' + MONETHEXPANDERWRAPPER + '">' +
            '<table class="' + RECURRENCETABLE + ' ' + MONETHEXPANDWRAPPER + '"><tr><td>' +
            '<div class="' + INPUTWARAPPER + ' ' + MONTHEXPANDERCHECKBOXWRAPPER + '">' +
            '<input class="' + MONTHEXPANDERELEMENT + '"title="' + this.localeObj.getConstant('monthExpander') + '" type="radio">' +
            '</div></td>' +
            '<td colspan="2"><div class="' + INPUTWARAPPER + ' ' + MONTHDAYELEMENT + '">' +
            '<input type="text" tabindex="0" class="' + MONTHDAYWRAPPER + '"title="' +
            this.localeObj.getConstant('monthExpander') + '" />' +
            '</div></td></tr>' +
            '<tr><td>' +
            '<div class="' + INPUTWARAPPER + ' ' + MONTHEXPANDERCHECKBOXWRAPPER + '" style="min-width: 30px;margin-bottom:18px;">' +
            '<input class="' + MONTHEXPANNDERELEM + '"title="' + this.localeObj.getConstant('monthExpander') + '" type="radio">' +
            '</div></td>' +
            '<td><div class="' + INPUTWARAPPER + ' ' + WEEKPOSITION + '" >' +
            '<input type="text" tabindex="0" class="' + MONTHPOS + '"title="' + this.localeObj.getConstant('monthPosition') + '" />' +
            '</div></td>' +
            '<td><div class="' + INPUTWARAPPER + '" >' +
            '<input type="text" tabindex="0" class="' + MONTHWEEK + '"title="' + this.localeObj.getConstant('monthWeek') + '" />' +
            '</div></td></tr></table>' +
            '</div></div>' +
            '<div class="' + INPUTWARAPPERSIDE + ' ' + ENDON + ' ' + FORMRIGHT + '">' +
            '<div class=' + ENDONLABEL + '>' + this.localeObj.getConstant(END) + '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONLEFT + '">' +
            '<input type="text" tabindex="0" class="' + ENDONELEMENT + '"title="' + this.localeObj.getConstant(END) + '" />' +
            '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONDATE + '" >' +
            '<input type="text" tabindex="0" class="' + UNTILDATE + '"title="' + this.localeObj.getConstant(UNTIL$1) + '" />' +
            '</div>' +
            '<div class="' + INPUTWARAPPER + ' ' + ENDONCOUNTWRAPPER + '">' +
            '<input type="text" tabindex="0" class="' + ENDONCOUNT + '"title="' + this.localeObj.getConstant(COUNT) + '" />' +
            '</div></div>' +
            '</div></div>';
    }
    getSelectedDaysData() {
        let ruleData = RULEBYDAY + EQUAL;
        let elements = this.element.querySelectorAll('.' + DAYWRAPPER + ' button.' + PRIMARY);
        let weekday = [RULESUNDAY, RULEMONDAY, RULETUESDAY, RULEWEDNESDAY, RULETHURSDAY, RULEFRIDAY, RULESATURDAY];
        this.rotateArray(weekday, this.firstDayOfWeek);
        for (let index = 0; index < elements.length; index++) {
            ruleData += weekday[parseInt(elements[index].getAttribute('data-index'), 10)] + (index === (elements.length - 1) ? '' : COMMA);
        }
        return ruleData + SEMICOLON;
    }
    getSelectedMonthData() {
        let ruleData;
        if (this.onWeekDay.checked) {
            ruleData = RULEBYDAY + EQUAL + this.monthWeekDays.value + SEMICOLON
                + RULESETPOS + EQUAL + this.monthWeekPos.value + SEMICOLON;
        }
        else {
            ruleData = RULEBYMONTHDAY + EQUAL + this.monthDate.value + SEMICOLON;
        }
        return ruleData;
    }
    getIntervalData() {
        return RULEINTERVAL + EQUAL + this.repeatInterval.value + SEMICOLON;
    }
    getEndOnCount() {
        return RULECOUNT + EQUAL + this.recurrenceCount.value + SEMICOLON;
    }
    getYearMonthRuleData() {
        return RULEBYMONTH + EQUAL + this.monthValue.value + SEMICOLON;
    }
    updateWeekButton(keys) {
        let weekday = [RULESUNDAY, RULEMONDAY, RULETUESDAY, RULEWEDNESDAY, RULETHURSDAY, RULEFRIDAY, RULESATURDAY];
        this.rotateArray(weekday, this.firstDayOfWeek);
        for (let obj of this.dayButtons) {
            let index = parseInt(obj.element.getAttribute('data-index'), 10);
            if (keys.indexOf(weekday[index]) !== -1) {
                obj.setProperties({ isPrimary: true });
            }
            else {
                obj.setProperties({ isPrimary: false });
            }
        }
    }
    updateMonthUI() {
        if (this.ruleObject.monthDay.length) {
            this.monthDate.setProperties({ value: this.ruleObject.monthDay[0] });
            this.onMonthDay.setProperties({ checked: true });
        }
        else {
            this.onWeekDay.setProperties({ checked: true });
            this.monthWeekPos.setProperties({ value: this.ruleObject.setPosition });
            for (let key of Object.keys(valueData)) {
                if (valueData[key] === this.ruleObject.day[0]) {
                    this.monthWeekDays.setProperties({ value: this.ruleObject.day[0] });
                    break;
                }
            }
        }
    }
    updateUI(repeat, state) {
        this.repeatInterval.setProperties({ value: this.ruleObject.interval });
        switch (state) {
            case UNTIL$1:
                this.untilDateObj.setProperties({ value: this.ruleObject.until });
                break;
            case COUNT:
                this.recurrenceCount.setProperties({ value: this.ruleObject.count });
                break;
        }
        switch (repeat) {
            case WEEKLY:
                this.updateWeekButton(this.ruleObject.day);
                break;
            case YEARLY:
                this.monthValue.setProperties({ index: (this.ruleObject.month[0] - 1) });
                this.updateMonthUI();
                break;
            case MONTHLY:
                this.updateMonthUI();
                break;
        }
    }
    getUntilData() {
        if (!this.untilDateObj.value) {
            return '';
        }
        let tempStr = getRecurrenceStringFromDate(this.untilDateObj.value);
        return RULEUNTIL + EQUAL + tempStr + SEMICOLON;
    }
    destroyComponents() {
        if (!this.recurrenceCount.isDestroyed) {
            this.recurrenceCount.destroy();
        }
        if (!this.monthDate.isDestroyed) {
            this.monthDate.destroy();
        }
        if (!this.repeatInterval.isDestroyed) {
            this.repeatInterval.destroy();
        }
        if (!this.untilDateObj.isDestroyed) {
            this.untilDateObj.destroy();
        }
        if (!this.repeatType.isDestroyed) {
            this.repeatType.destroy();
        }
        if (!this.endType.isDestroyed) {
            this.endType.destroy();
        }
        if (!this.monthWeekPos.isDestroyed) {
            this.monthWeekPos.destroy();
        }
        if (!this.monthWeekDays.isDestroyed) {
            this.monthWeekDays.destroy();
        }
        if (!this.monthValue.isDestroyed) {
            this.monthValue.destroy();
        }
        this.dayButtons.forEach((element) => {
            if (!element.isDestroyed) {
                element.destroy();
            }
        });
        this.dayButtons = [];
        this.monthButtons.forEach((element) => {
            if (!element.isDestroyed) {
                element.destroy();
            }
        });
        this.monthButtons = [];
    }
    resetFields() {
        this.startState(NONE, NEVER, this.startDate);
        this.setDefaultValue();
    }
    getCalendarMode() {
        return this.calendarMode.toLowerCase();
    }
    getRuleSummary(rule = this.getRecurrenceRule()) {
        return generateSummary(rule, this.localeObj, this.locale, this.calendarMode);
    }
    getRecurrenceDates(startDate, rule, excludeDate, maximumCount, viewDate) {
        viewDate = isNullOrUndefined(viewDate) ? this.startDate : viewDate;
        return generate(startDate, rule, excludeDate, this.firstDayOfWeek, maximumCount, viewDate, this.calendarMode);
    }
    getRecurrenceRule() {
        let ruleData = RULEFREQ + EQUAL;
        switch (this.repeatType.value) {
            case DAILY:
                ruleData += RULEDAILY + SEMICOLON;
                break;
            case WEEKLY:
                ruleData += RULEWEEKLY + SEMICOLON + this.getSelectedDaysData();
                break;
            case MONTHLY:
                ruleData += RULEMONTHLY + SEMICOLON + this.getSelectedMonthData();
                break;
            case YEARLY:
                ruleData += RULEYEARLY + SEMICOLON + this.getSelectedMonthData() + this.getYearMonthRuleData();
                break;
            case NONE:
                return '';
        }
        ruleData += this.getIntervalData();
        switch (this.endType.value) {
            case UNTIL$1:
                ruleData += this.getUntilData();
                break;
            case COUNT:
                ruleData += this.getEndOnCount();
                break;
        }
        return ruleData;
    }
    setRecurrenceRule(rule, startDate = this.startDate) {
        if (!rule) {
            this.repeatType.setProperties({ value: NONE });
        }
        this.ruleObject = extractObjectFromRule(rule);
        let endon = this.ruleObject.count ? COUNT : (this.ruleObject.until ? UNTIL$1 : NEVER);
        switch (this.ruleObject.freq) {
            case RULEDAILY:
                this.startState(DAILY, endon, startDate);
                this.updateUI(DAILY, endon);
                break;
            case RULEWEEKLY:
                this.startState(WEEKLY, endon, startDate);
                this.updateUI(WEEKLY, endon);
                break;
            case RULEMONTHLY:
                this.startState(MONTHLY, endon, startDate);
                this.updateUI(MONTHLY, endon);
                break;
            case RULEYEARLY:
                this.startState(YEARLY, endon, startDate);
                this.updateUI(YEARLY, endon);
                break;
        }
    }
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy() {
        this.destroyComponents();
        super.destroy();
        let removeClasses = ['e-' + this.getModuleName()];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
        this.element.innerHTML = '';
    }
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'recurrenceeditor';
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    render() {
        this.initialize();
        this.rtlClass(this.enableRtl);
        this.renderStatus = true;
    }
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'startDate':
                    this.selectMonthDay(newProp.startDate);
                    this.updateUntilDate(newProp.startDate);
                    this.endType.setProperties({ index: 0 });
                    break;
                case 'enableRtl':
                    this.rtlClass(newProp.enableRtl);
                    break;
                case 'cssClass':
                    this.applyCustomClass(newProp.cssClass);
                    break;
                case 'selectedType':
                    this.repeatType.setProperties({ index: this.selectedType });
                    break;
                case 'minDate':
                    this.untilDateObj.setProperties({ minDate: this.minDate });
                    break;
                case 'maxDate':
                    this.untilDateObj.setProperties({ maxDate: this.maxDate });
                    break;
                case 'value':
                    if (this.getRecurrenceRule() !== this.value) {
                        this.setRecurrenceRule(this.value);
                    }
                    break;
                case 'calendarMode':
                    this.calendarMode = newProp.calendarMode;
                    this.calendarUtil = getCalendarUtil(newProp.calendarMode);
                    break;
                case 'locale':
                case 'frequencies':
                case 'firstDayOfWeek':
                    this.refresh();
                    break;
            }
        }
    }
};
__decorate$1([
    Property(['none', 'daily', 'weekly', 'monthly', 'yearly'])
], RecurrenceEditor.prototype, "frequencies", void 0);
__decorate$1([
    Property(0)
], RecurrenceEditor.prototype, "firstDayOfWeek", void 0);
__decorate$1([
    Property(new Date())
], RecurrenceEditor.prototype, "startDate", void 0);
__decorate$1([
    Property()
], RecurrenceEditor.prototype, "dateFormat", void 0);
__decorate$1([
    Property('Gregorian')
], RecurrenceEditor.prototype, "calendarMode", void 0);
__decorate$1([
    Property()
], RecurrenceEditor.prototype, "cssClass", void 0);
__decorate$1([
    Property(false)
], RecurrenceEditor.prototype, "enableRtl", void 0);
__decorate$1([
    Property()
], RecurrenceEditor.prototype, "value", void 0);
__decorate$1([
    Property(new Date(1900, 1, 1))
], RecurrenceEditor.prototype, "minDate", void 0);
__decorate$1([
    Property(new Date(2099, 12, 31))
], RecurrenceEditor.prototype, "maxDate", void 0);
__decorate$1([
    Property(0)
], RecurrenceEditor.prototype, "selectedType", void 0);
__decorate$1([
    Event()
], RecurrenceEditor.prototype, "change", void 0);
RecurrenceEditor = __decorate$1([
    NotifyPropertyChanges
], RecurrenceEditor);

const EVENT_FIELD$1 = 'e-field';
const REPEAT_CONTAINER_CLASS = 'e-recurrence-container';
const REPEAT_BUTTON_ICON_CLASS = 'e-recurrence-edit';
const REPEAT_BUTTON_CLASS = 'e-recurrence-edit-button';
const REPEAT_DIALOG_CLASS = 'e-recurrence-dialog';
const HIDE_STYLE_CLASS = 'e-hide';
/**
 * Event editor window
 */
class EventWindow {
    /**
     * Constructor for event window
     */
    constructor(parent) {
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.fields = this.parent.eventFields;
        this.fieldValidator = new FieldValidator();
        let timezone = new Timezone();
        this.localTimezoneName = timezone.getLocalTimezoneName();
        this.renderEventWindow();
    }
    renderEventWindow() {
        this.element = createElement('div', { id: this.parent.element.id + '_dialog_wrapper' });
        this.parent.element.appendChild(this.element);
        let dialogModel = {
            animationSettings: { effect: 'Zoom' },
            content: this.getEventWindowContent(),
            cssClass: EVENT_WINDOW_DIALOG_CLASS,
            enableRtl: this.parent.enableRtl,
            height: this.parent.isAdaptive ? '100%' : 'auto',
            isModal: true,
            showCloseIcon: this.parent.isAdaptive ? false : true,
            target: document.body,
            visible: false,
            width: '500px',
            beforeOpen: this.onBeforeOpen.bind(this),
            beforeClose: this.onBeforeClose.bind(this)
        };
        if (this.parent.isAdaptive) {
            dialogModel.cssClass = EVENT_WINDOW_DIALOG_CLASS + ' ' + DEVICE_CLASS;
            dialogModel.header = '<div class="e-title-header"><div class="e-back-icon e-icons"></div><div class="e-title-text">' +
                this.l10n.getConstant('newEvent') + '</div><div class="e-save-icon e-icons"></div></div>';
        }
        else {
            dialogModel.buttons = [{
                    buttonModel: { content: this.l10n.getConstant('deleteButton'), cssClass: EVENT_WINDOW_DELETE_BUTTON_CLASS },
                    click: this.eventDelete.bind(this)
                }, {
                    buttonModel: {
                        content: this.l10n.getConstant('saveButton'), cssClass: 'e-primary ' + EVENT_WINDOW_SAVE_BUTTON_CLASS,
                        isPrimary: true
                    },
                    click: this.eventSave.bind(this)
                }, {
                    buttonModel: { cssClass: EVENT_WINDOW_CANCEL_BUTTON_CLASS, content: this.l10n.getConstant('cancelButton') },
                    click: this.dialogClose.bind(this)
                }];
            dialogModel.header = '<div class="e-title-text">' + this.l10n.getConstant('newEvent') + '</div>';
        }
        this.dialogObject = new Dialog(dialogModel, this.element);
        addClass([this.element.parentElement], EVENT_WINDOW_DIALOG_CLASS + '-container');
        if (this.parent.isAdaptive) {
            EventHandler.add(this.element.querySelector('.' + EVENT_WINDOW_BACK_ICON_CLASS), 'click', this.dialogClose, this);
            EventHandler.add(this.element.querySelector('.' + EVENT_WINDOW_SAVE_ICON_CLASS), 'click', this.eventSave, this);
        }
        this.applyFormValidation();
    }
    refresh() {
        this.destroy();
        this.renderEventWindow();
    }
    refreshRecurrenceEditor() {
        if (this.recurrenceEditor) {
            let recurrenceEditor = this.recurrenceEditor.element;
            this.recurrenceEditor.destroy();
            this.createRecurrenceEditor(recurrenceEditor);
        }
    }
    openEditor(data, type, isEventData, repeatType) {
        this.parent.removeNewEventElement();
        this.parent.quickPopup.quickPopupHide(true);
        if (!isNullOrUndefined(this.parent.editorTemplate)) {
            this.renderFormElements(this.element.querySelector('.e-schedule-form'), data);
        }
        if (!this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            removeClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], DISABLE_CLASS);
        }
        switch (type) {
            case 'Add':
                this.cellClickAction = !isEventData;
                this.parent.activeCellsData = data;
                this.onCellDetailsUpdate(data, repeatType);
                break;
            case 'Save':
            case 'EditOccurrence':
            case 'EditSeries':
                if (type === 'EditOccurrence' && !this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
                    addClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], DISABLE_CLASS);
                }
                this.cellClickAction = false;
                this.onEventDetailsUpdate(data);
                break;
        }
    }
    setDialogContent() {
        this.dialogObject.content = this.getEventWindowContent();
        this.dialogObject.dataBind();
    }
    onBeforeOpen(args) {
        let eventProp = {
            type: 'Editor',
            data: this.eventData,
            cancel: false,
            element: this.element,
            target: (this.cellClickAction ? this.parent.activeCellsData.element : this.parent.activeEventData.element)
        };
        if (this.cellClickAction) {
            eventProp.duration = this.getSlotDuration();
        }
        this.parent.trigger(popupOpen, eventProp);
        args.cancel = eventProp.cancel;
        this.duration = this.cellClickAction ? eventProp.duration : null;
        this.refreshDateTimePicker(this.duration);
        if (this.cellClickAction && eventProp.duration !== this.getSlotDuration() && isNullOrUndefined(this.parent.editorTemplate)) {
            let startObj = this.getInstance(EVENT_WINDOW_START_CLASS);
            let endObj = this.getInstance(EVENT_WINDOW_END_CLASS);
            endObj.value = new Date(startObj.value.getTime() + (MS_PER_MINUTE * eventProp.duration));
            endObj.dataBind();
        }
        if (this.parent.editorTemplate && this.element.querySelector('.e-recurrenceeditor') && !this.recurrenceEditor) {
            this.recurrenceEditor = this.getInstance('e-recurrenceeditor');
        }
    }
    onBeforeClose() {
        this.resetForm();
        this.parent.eventBase.focusElement();
    }
    getEventWindowContent() {
        let container = createElement('div', { className: FORM_CONTAINER_CLASS });
        let form = createElement('form', {
            id: this.parent.element.id + 'EditForm',
            className: FORM_CLASS,
            attrs: { onsubmit: 'return false;' }
        });
        this.renderFormElements(form);
        container.appendChild(form);
        return container;
    }
    renderFormElements(form, args) {
        if (!isNullOrUndefined(this.parent.editorTemplate)) {
            if (args) {
                this.destroyComponents();
                form.childNodes.forEach((node) => remove(node));
            }
            append(this.parent.getEditorTemplate()(args), form);
        }
        else {
            form.appendChild(this.getDefaultEventWindowContent());
        }
    }
    getDefaultEventWindowContent() {
        let parentDiv = this.createDivElement(EVENT_WINDOW_DIALOG_PARENT_CLASS);
        let titleLocationDiv = this.createDivElement(EVENT_WINDOW_TITLE_LOCATION_DIV_CLASS);
        parentDiv.appendChild(titleLocationDiv);
        titleLocationDiv.appendChild(this.renderTextBox(SUBJECT_CLASS));
        titleLocationDiv.appendChild(this.renderTextBox(LOCATION_CLASS));
        let startEndDateTimeDiv = this.createDivElement(EVENT_WINDOW_START_END_DIV_CLASS);
        parentDiv.appendChild(startEndDateTimeDiv);
        startEndDateTimeDiv.appendChild(this.renderDateTimePicker(EVENT_WINDOW_START_CLASS, this.onTimeChange.bind(this)));
        startEndDateTimeDiv.appendChild(this.renderDateTimePicker(EVENT_WINDOW_END_CLASS));
        let allDayTimezoneDiv = this.createDivElement(EVENT_WINDOW_ALLDAY_TZ_DIV_CLASS);
        parentDiv.appendChild(allDayTimezoneDiv);
        allDayTimezoneDiv.appendChild(this.renderCheckBox(EVENT_WINDOW_ALL_DAY_CLASS));
        allDayTimezoneDiv.appendChild(this.renderCheckBox(TIME_ZONE_CLASS));
        let timezoneParentDiv = this.createDivElement(EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
        parentDiv.appendChild(timezoneParentDiv);
        timezoneParentDiv.appendChild(this.renderDropDown(EVENT_WINDOW_START_TZ_CLASS));
        timezoneParentDiv.appendChild(this.renderDropDown(EVENT_WINDOW_END_TZ_CLASS));
        let repeatParentDiv = this.createDivElement(EVENT_WINDOW_REPEAT_DIV_CLASS);
        parentDiv.appendChild(repeatParentDiv);
        let repeatDiv = this.renderCheckBox(EVENT_WINDOW_REPEAT_CLASS);
        let repeatEditConainer = createElement('span', { className: REPEAT_CONTAINER_CLASS });
        let button = createElement('button', {
            className: REPEAT_BUTTON_CLASS,
            attrs: { type: 'button', 'title': this.l10n.getConstant('editRecurrence') }
        });
        this.buttonObj = new Button({ iconCss: REPEAT_BUTTON_ICON_CLASS + ' e-icons', cssClass: 'e-medium ' + this.parent.cssClass });
        repeatEditConainer.appendChild(button);
        this.buttonObj.appendTo(button);
        repeatDiv.appendChild(repeatEditConainer);
        repeatParentDiv.appendChild(repeatDiv);
        if (this.parent.isAdaptive) {
            EventHandler.add(button, 'click', this.loadRecurrenceEditor, this);
        }
        else {
            this.createRecurrenceEditor(parentDiv);
        }
        if (this.parent.resourceCollection.length > 0) {
            let resourceParentDiv = this.createDivElement(EVENT_WINDOW_RESOURCES_DIV_CLASS);
            for (let resource of this.parent.resourceBase.resourceCollection) {
                resourceParentDiv.appendChild(this.renderResourceDetails(resource));
            }
            parentDiv.appendChild(resourceParentDiv);
        }
        let description = this.createDivElement(DESCRIPTION_CLASS + '-row');
        description.appendChild(this.renderTextBox(DESCRIPTION_CLASS));
        parentDiv.appendChild(description);
        let submit = createElement('button', { attrs: { type: 'hidden', title: 'submit', style: 'display:none' } });
        parentDiv.appendChild(submit);
        return parentDiv;
    }
    createRecurrenceEditor(parentDiv) {
        let recurrenceEditor = this.createDivElement();
        parentDiv.appendChild(recurrenceEditor);
        this.recurrenceEditor = this.renderRecurrenceEditor();
        this.recurrenceEditor.appendTo(recurrenceEditor);
    }
    createDivElement(className) {
        return createElement('div', { className: className });
    }
    createInputElement(className, fieldName, type) {
        return createElement(type || 'input', {
            className: className, attrs: {
                type: 'text', name: fieldName, value: '',
                title: ((this.l10n.getConstant(fieldName.charAt(0).toLowerCase() + fieldName.slice(1))) === '') ?
                    fieldName : this.l10n.getConstant(fieldName.charAt(0).toLowerCase() + fieldName.slice(1))
            }
        });
    }
    getSlotDuration() {
        return this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
    }
    renderDateTimePicker(value, changeEvent) {
        let dateTimeDiv = this.createDivElement(value + '-container');
        let fieldName = this.getFieldName(value);
        let dateTimeInput = this.createInputElement(value + ' ' + EVENT_FIELD$1, fieldName);
        dateTimeDiv.appendChild(dateTimeInput);
        let dateTimePicker = new DateTimePicker({
            change: changeEvent,
            calendarMode: this.parent.calendarMode,
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            floatLabelType: 'Always',
            format: (isNullOrUndefined(this.parent.dateFormat) ?
                this.getFormat('dateFormats') : this.parent.dateFormat) + ' ' + this.getFormat('timeFormats'),
            placeholder: this.getFieldLabel(value),
            step: this.getSlotDuration(),
            value: new Date(), width: '100%'
        });
        dateTimePicker.appendTo(dateTimeInput);
        return dateTimeDiv;
    }
    refreshDateTimePicker(duration) {
        let startEndElement = [].slice.call(this.element.querySelectorAll('.' + EVENT_WINDOW_START_CLASS + ',.' +
            EVENT_WINDOW_END_CLASS));
        startEndElement.forEach((element) => {
            let instance = element.ej2_instances[0];
            instance.step = duration || this.getSlotDuration();
            instance.dataBind();
        });
    }
    onTimeChange() {
        let startObj = this.getInstance(EVENT_WINDOW_START_CLASS);
        if (startObj.element.parentElement.classList.contains('e-input-focus')) {
            let endObj = this.getInstance(EVENT_WINDOW_END_CLASS);
            let duration = 0;
            if (this.cellClickAction) {
                duration = MS_PER_MINUTE * this.duration;
            }
            else {
                duration = this.eventData[this.fields.endTime].getTime() - this.eventData[this.fields.startTime].getTime();
            }
            endObj.value = new Date(startObj.value.getTime() + duration);
            endObj.dataBind();
        }
    }
    renderResourceDetails(resourceData) {
        let fieldName = resourceData.field;
        let value = 'e-' + fieldName;
        let labelValue = resourceData.title;
        let resourceDiv = this.createDivElement(value + '-container' + ' ' + 'e-resources');
        let resourceInput = this.createInputElement(value + ' ' + EVENT_FIELD$1, fieldName);
        resourceDiv.appendChild(resourceInput);
        let resourceTemplate = '<div class="e-resource-template"><div class="e-resource-color" style="background-color:${' +
            resourceData.colorField + '}"></div><div class="e-resource-text">${' + resourceData.textField + '}</div></div>';
        if (resourceData.allowMultiple) {
            let listObj = new MultiSelect({
                cssClass: this.parent.cssClass || '',
                dataSource: resourceData.dataSource,
                change: this.onMultiselectResourceChange.bind(this),
                itemTemplate: resourceTemplate,
                fields: {
                    text: resourceData.textField,
                    value: resourceData.idField
                },
                htmlAttributes: { 'title': labelValue, 'name': fieldName },
                floatLabelType: 'Always',
                placeholder: labelValue,
                popupHeight: '230px',
                popupWidth: '447px',
                mode: 'Box'
            });
            listObj.appendTo(resourceInput);
        }
        else {
            let drowDownList = new DropDownList({
                cssClass: this.parent.cssClass || '',
                change: this.onDropdownResourceChange.bind(this),
                dataSource: resourceData.dataSource,
                enableRtl: this.parent.enableRtl,
                fields: {
                    text: resourceData.textField,
                    value: resourceData.idField
                },
                htmlAttributes: { 'title': labelValue, 'name': fieldName },
                floatLabelType: 'Always',
                placeholder: labelValue,
                popupHeight: '230px',
                popupWidth: '447px',
                itemTemplate: resourceTemplate
            });
            drowDownList.appendTo(resourceInput);
        }
        return resourceDiv;
    }
    renderDropDown(value) {
        let fieldName = this.getFieldName(value);
        let timezoneDiv = this.createDivElement(value + '-container');
        let timezoneInput = this.createInputElement(value + ' ' + EVENT_FIELD$1, fieldName);
        timezoneDiv.appendChild(timezoneInput);
        let drowDownList = new DropDownList({
            allowFiltering: true,
            change: this.onTimezoneChange.bind(this),
            cssClass: this.parent.cssClass || '',
            dataSource: timezoneData,
            enableRtl: this.parent.enableRtl,
            fields: { text: 'Text', value: 'Value' },
            filterBarPlaceholder: 'Search Timezone',
            filtering: (e) => {
                let query = new Query();
                query = (e.text !== '') ? query.where('Text', 'contains', e.text, true) : query;
                e.updateData(timezoneData, query);
            },
            htmlAttributes: { 'title': this.getFieldLabel(value), 'name': fieldName },
            floatLabelType: 'Always',
            placeholder: this.getFieldLabel(value),
            popupHeight: '230px',
        });
        drowDownList.appendTo(timezoneInput);
        return timezoneDiv;
    }
    onMultiselectResourceChange(args) {
        if (!args.value || !this.parent.activeViewOptions.group.byGroupID || this.parent.resourceCollection.length <= 1) {
            return;
        }
        let resourceCollection = this.parent.resourceBase.resourceCollection;
        let fieldName = args.element.getAttribute('name') || this.getColumnName(args.element);
        for (let i = 0; i < resourceCollection.length; i++) {
            if (resourceCollection[i].field === fieldName && i < resourceCollection.length - 1) {
                let resObject = this.createInstance(i);
                let datasource = [];
                for (let j = 0; j < args.value.length; j++) {
                    let resourceData = resourceCollection[i + 1].dataSource;
                    let query = new Query().where(resourceCollection[i + 1].groupIDField, 'equal', args.value[j]);
                    let filter = new DataManager({ json: resourceData }).executeLocal(query)[0];
                    let groupId = filter[resourceCollection[i + 1].idField];
                    let filterRes = this.filterDatasource(i, groupId);
                    datasource = datasource.concat(filterRes);
                }
                resObject.dataSource = datasource;
                resObject.dataBind();
            }
        }
    }
    createInstance(index) {
        let resourceData = this.parent.resourceBase.resourceCollection[index + 1];
        let resObject = this.element.querySelector('.e-' + resourceData.field).
            ej2_instances[0];
        return resObject;
    }
    onDropdownResourceChange(args) {
        if (!args.value || this.parent.resourceCollection.length <= 1 || !this.parent.activeViewOptions.group.byGroupID) {
            return;
        }
        let fieldName = args.element.getAttribute('name') || this.getColumnName(args.element);
        let resourceCollection = this.parent.resourceBase.resourceCollection;
        for (let i = 0; i < resourceCollection.length; i++) {
            if ((i < resourceCollection.length - 1) && resourceCollection[i].field === fieldName) {
                let resObj = this.createInstance(i);
                let groupId = args.itemData[resourceCollection[i].idField];
                resObj.dataSource = this.filterDatasource(i, groupId);
                resObj.dataBind();
                let resValue = resObj.dataSource[0][resourceCollection[i + 1].idField];
                resObj.value = (resourceCollection[i + 1].allowMultiple) ? [resValue] : resValue;
                resObj.dataBind();
            }
        }
    }
    filterDatasource(index, groupId) {
        let resourceData = this.parent.resourceBase.resourceCollection[index + 1];
        let query = new Query().where(resourceData.groupIDField, 'equal', groupId);
        let filter = new DataManager({ json: resourceData.dataSource }).executeLocal(query);
        return filter;
    }
    onTimezoneChange(args) {
        let fieldName = args.element.getAttribute('name') || this.getColumnName(args.element);
        if (fieldName === this.parent.eventFields.startTimezone) {
            let startTimezoneObj = this.getInstance(EVENT_WINDOW_START_TZ_CLASS);
            let endTimezoneObj = this.getInstance(EVENT_WINDOW_END_TZ_CLASS);
            endTimezoneObj.value = startTimezoneObj.value;
            endTimezoneObj.dataBind();
        }
    }
    renderCheckBox(value) {
        let checkBoxDiv = this.createDivElement(value + '-container');
        let fieldName = this.getFieldName(value);
        let checkBoxInput = this.createInputElement(value + ' ' + EVENT_FIELD$1, fieldName);
        checkBoxDiv.appendChild(checkBoxInput);
        let checkBox = new CheckBox({
            change: this.onChange.bind(this),
            cssClass: value + ' ' + this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            label: this.getFieldLabel(value)
        });
        checkBox.appendTo(checkBoxInput);
        checkBoxInput.setAttribute('name', fieldName);
        if (fieldName === 'Repeat') {
            this.repeatStatus = checkBox;
        }
        return checkBoxDiv;
    }
    renderTextBox(value) {
        let textBoxDiv = this.createDivElement(value + '-container');
        let fieldName = this.getFieldName(value);
        let elementType = (value === DESCRIPTION_CLASS) ? 'textarea' : 'input';
        let textBoxInput = this.createInputElement(value + ' ' + EVENT_FIELD$1, fieldName, elementType);
        textBoxDiv.appendChild(textBoxInput);
        Input.createInput({
            element: textBoxInput,
            floatLabelType: 'Always',
            properties: {
                enableRtl: this.parent.enableRtl,
                placeholder: this.getFieldLabel(value)
            }
        });
        return textBoxDiv;
    }
    getFieldName(name) {
        let fieldName = '';
        switch (name) {
            case SUBJECT_CLASS:
                fieldName = this.fields.subject;
                break;
            case LOCATION_CLASS:
                fieldName = this.fields.location;
                break;
            case EVENT_WINDOW_START_CLASS:
                fieldName = this.fields.startTime;
                break;
            case EVENT_WINDOW_END_CLASS:
                fieldName = this.fields.endTime;
                break;
            case DESCRIPTION_CLASS:
                fieldName = this.fields.description;
                break;
            case EVENT_WINDOW_ALL_DAY_CLASS:
                fieldName = this.fields.isAllDay;
                break;
            case EVENT_WINDOW_START_TZ_CLASS:
                fieldName = this.fields.startTimezone;
                break;
            case EVENT_WINDOW_END_TZ_CLASS:
                fieldName = this.fields.endTimezone;
                break;
            case TIME_ZONE_CLASS:
                fieldName = 'Timezone';
                break;
            case EVENT_WINDOW_REPEAT_CLASS:
                fieldName = 'Repeat';
                break;
        }
        return fieldName;
    }
    getFieldLabel(fieldName) {
        let labelText = '';
        switch (fieldName) {
            case SUBJECT_CLASS:
                labelText = this.parent.editorTitles.subject;
                break;
            case LOCATION_CLASS:
                labelText = this.parent.editorTitles.location;
                break;
            case DESCRIPTION_CLASS:
                labelText = this.parent.editorTitles.description;
                break;
            case EVENT_WINDOW_START_CLASS:
                labelText = this.parent.editorTitles.startTime;
                break;
            case EVENT_WINDOW_END_CLASS:
                labelText = this.parent.editorTitles.endTime;
                break;
            case EVENT_WINDOW_START_TZ_CLASS:
                labelText = this.parent.editorTitles.startTimezone;
                break;
            case EVENT_WINDOW_END_TZ_CLASS:
                labelText = this.parent.editorTitles.endTimezone;
                break;
            case EVENT_WINDOW_REPEAT_CLASS:
                labelText = this.parent.editorTitles.recurrenceRule;
                break;
            case EVENT_WINDOW_ALL_DAY_CLASS:
                labelText = this.parent.editorTitles.isAllDay;
                break;
            case TIME_ZONE_CLASS:
                labelText = this.l10n.getConstant('timezone');
                break;
        }
        return labelText;
    }
    onChange(args) {
        let target = (args.event.target);
        if (target.classList.contains(EVENT_WINDOW_ALL_DAY_CLASS)) {
            this.onAllDayChange(args.checked);
        }
        else if (target.classList.contains(TIME_ZONE_CLASS)) {
            this.timezoneChangeStyle(args.checked);
        }
        else if (target.classList.contains(EVENT_WINDOW_REPEAT_CLASS)) {
            this.onRepeatChange(args.checked);
        }
    }
    renderRepeatDialog() {
        let element = createElement('div');
        this.repeatDialogObject = new Dialog({
            header: this.l10n.getConstant('recurrence'),
            visible: false,
            content: '<div class="e-rec-editor"></div>',
            closeOnEscape: true,
            width: '90%',
            buttons: [{
                    click: this.repeatSaveDialog.bind(this),
                    buttonModel: { content: this.l10n.getConstant('save'), cssClass: 'e-save', isPrimary: true }
                },
                { click: this.repeatCancelDialog.bind(this), buttonModel: { cssClass: 'e-cancel', content: this.l10n.getConstant('cancel') } }],
            target: this.element,
            animationSettings: { effect: 'Zoom' },
            enableRtl: this.parent.enableRtl,
            isModal: true,
            cssClass: REPEAT_DIALOG_CLASS,
            open: this.repeatOpenDialog.bind(this)
        });
        this.element.appendChild(element);
        this.repeatDialogObject.appendTo(element);
        this.createRecurrenceEditor(this.repeatDialogObject.element.querySelector('.e-rec-editor'));
    }
    loadRecurrenceEditor() {
        this.repeatDialogObject.show();
        if (this.recurrenceEditor && this.repeatRule) {
            this.recurrenceEditor.setRecurrenceRule(this.repeatRule);
        }
    }
    onRepeatChange(state) {
        if (state) {
            if (!this.repeatDialogObject) {
                this.renderRepeatDialog();
            }
            this.recurrenceEditor.setProperties({ startDate: this.repeatStartDate, selectedType: 0 });
            this.loadRecurrenceEditor();
        }
        else {
            if (this.repeatDialogObject) {
                this.repeatDialogObject.hide();
            }
            this.repeatRule = '';
            if (this.recurrenceEditor) {
                this.recurrenceEditor.setRecurrenceRule(this.repeatRule);
                this.updateRepeatLabel(this.repeatRule);
            }
            let element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            addClass([element], HIDE_STYLE_CLASS);
        }
    }
    repeatSaveDialog() {
        this.repeatRule = this.recurrenceEditor.getRecurrenceRule();
        let element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
        if (this.recurrenceEditor.getRecurrenceRule()) {
            removeClass([element], HIDE_STYLE_CLASS);
        }
        else {
            addClass([element], HIDE_STYLE_CLASS);
            this.repeatStatus.setProperties({ checked: false });
        }
        this.updateRepeatLabel(this.repeatRule);
        this.closeRepeatDialog();
    }
    closeRepeatDialog() {
        this.repeatDialogObject.hide();
    }
    repeatCancelDialog() {
        this.closeRepeatDialog();
        if (this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule(this.repeatTempRule);
        }
        if (!this.repeatTempRule) {
            this.repeatStatus.setProperties({ checked: false });
        }
    }
    repeatOpenDialog() {
        this.repeatTempRule = this.recurrenceEditor.getRecurrenceRule();
    }
    onCellDetailsUpdate(event, repeatType) {
        this.element.querySelector('.' + FORM_CLASS).removeAttribute('data-id');
        this.element.querySelector('.' + EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML = this.l10n.getConstant('newEvent');
        let eventObj = {};
        if (this.cellClickAction) {
            this.convertToEventData(event, eventObj);
        }
        else {
            this.parent.activeCellsData = {
                startTime: (event.startTime || event[this.fields.startTime]),
                endTime: (event.endTime || event[this.fields.endTime]),
                isAllDay: (event.isAllDay || event[this.fields.isAllDay]),
                element: event.element,
                groupIndex: event.groupIndex
            };
            eventObj = event;
        }
        eventObj.Timezone = false;
        this.repeatStartDate = eventObj[this.fields.startTime];
        this.repeatRule = '';
        this.showDetails(eventObj);
        let deleteButton = this.element.querySelector('.' + EVENT_WINDOW_DELETE_BUTTON_CLASS);
        if (deleteButton) {
            addClass([deleteButton], DISABLE_CLASS);
        }
        if (this.recurrenceEditor) {
            this.recurrenceEditor.setProperties({
                startDate: eventObj[this.fields.startTime],
                selectedType: repeatType || 0
            });
        }
        if (this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            let element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            addClass([element], HIDE_STYLE_CLASS);
            this.updateRepeatLabel(this.repeatRule);
        }
        else {
            let saveButton = this.element.querySelector('.' + EVENT_WINDOW_SAVE_BUTTON_CLASS);
            this.disableButton(saveButton, false);
        }
        this.dialogObject.show();
    }
    convertToEventData(cellsData, eventObj) {
        if (cellsData.subject) {
            eventObj[this.fields.subject] = cellsData.subject;
        }
        eventObj[this.fields.startTime] = cellsData.startTime;
        eventObj[this.fields.endTime] = cellsData.endTime;
        eventObj[this.fields.isAllDay] = cellsData.isAllDay;
        if (this.parent.resourceCollection.length > 0 || this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.setResourceValues(eventObj, false);
        }
    }
    applyFormValidation() {
        let getValidationRule = (rules) => (rules && Object.keys(rules).length > 0) ? rules : undefined;
        let form = this.element.querySelector('.' + FORM_CLASS);
        let rules = {};
        rules[this.parent.eventSettings.fields.subject.name] = getValidationRule(this.parent.eventSettings.fields.subject.validation);
        rules[this.parent.eventSettings.fields.location.name] = getValidationRule(this.parent.eventSettings.fields.location.validation);
        rules[this.parent.eventSettings.fields.startTime.name] = getValidationRule(this.parent.eventSettings.fields.startTime.validation);
        rules[this.parent.eventSettings.fields.endTime.name] = getValidationRule(this.parent.eventSettings.fields.endTime.validation);
        rules[this.parent.eventSettings.fields.description.name] =
            getValidationRule(this.parent.eventSettings.fields.description.validation);
        this.fieldValidator.renderFormValidator(form, rules, this.element);
    }
    showDetails(eventData) {
        let eventObj = extend({}, eventData, null, true);
        this.trimAllDay(eventObj);
        this.eventData = eventObj;
        let formelement = this.getFormElements(EVENT_WINDOW_DIALOG_CLASS);
        let keyNames = Object.keys(eventObj);
        for (let curElement of formelement) {
            let columnName = curElement.name || this.getColumnName(curElement);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                if (keyNames.indexOf(columnName) !== -1) {
                    this.setValueToElement(curElement, eventObj[columnName]);
                }
                else {
                    this.setDefaultValueToElement(curElement);
                }
            }
        }
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            this.onAllDayChange(eventObj[this.fields.isAllDay]);
            let timezoneObj = this.getInstance(TIME_ZONE_CLASS + '.' + EVENT_FIELD$1);
            if (!(isNullOrUndefined(eventObj[this.fields.startTimezone]) && isNullOrUndefined(eventObj[this.fields.endTimezone]))) {
                timezoneObj.checked = true;
                timezoneObj.dataBind();
            }
            this.timezoneChangeStyle(timezoneObj.checked);
            delete eventObj.Timezone;
        }
    }
    getColumnName(element) {
        let attrName = element.getAttribute('data-name') || '';
        if (attrName === '') {
            let isDropDowns = false;
            let fieldSelector = '';
            if (element.classList.contains('e-dropdownlist')) {
                fieldSelector = 'e-ddl';
                isDropDowns = true;
            }
            else if (element.classList.contains('e-multiselect')) {
                fieldSelector = 'e-multiselect';
                isDropDowns = true;
            }
            else if (element.classList.contains('e-datetimepicker')) {
                fieldSelector = 'e-datetimepicker';
            }
            else if (element.classList.contains('e-datepicker')) {
                fieldSelector = 'e-datepicker';
            }
            else if (element.classList.contains('e-checkbox')) {
                fieldSelector = 'e-checkbox';
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
    onAllDayChange(allDayStatus) {
        let startObj = this.getInstance(EVENT_WINDOW_START_CLASS);
        let endObj = this.getInstance(EVENT_WINDOW_END_CLASS);
        let timezoneDiv = this.element.querySelector('.e-time-zone-container');
        let format;
        if (allDayStatus) {
            format = (isNullOrUndefined(this.parent.dateFormat)) ? this.getFormat('dateFormats') : this.parent.dateFormat;
            addClass(this.element.querySelectorAll('.e-time-icon'), EVENT_WINDOW_ICON_DISABLE_CLASS);
            addClass([timezoneDiv], DISABLE_CLASS);
            if (this.element.querySelector('.' + EVENT_WINDOW_TIME_ZONE_DIV_CLASS)) {
                removeClass([this.element.querySelector('.' + EVENT_WINDOW_TIME_ZONE_DIV_CLASS)], ENABLE_CLASS);
            }
            startObj.format = endObj.format = format;
        }
        else {
            format = (isNullOrUndefined(this.parent.dateFormat)) ? this.getFormat('dateFormats') + ' ' + this.getFormat('timeFormats') :
                this.parent.dateFormat + ' ' + this.getFormat('timeFormats');
            removeClass(this.element.querySelectorAll('.e-time-icon'), EVENT_WINDOW_ICON_DISABLE_CLASS);
            removeClass([timezoneDiv], DISABLE_CLASS);
            if (this.element.querySelector('.e-checkbox-wrapper .e-time-zone').checked) {
                addClass([this.element.querySelector('.' + EVENT_WINDOW_TIME_ZONE_DIV_CLASS)], ENABLE_CLASS);
            }
            startObj.format = endObj.format = format;
        }
        if (this.cellClickAction) {
            this.updateDateTime(allDayStatus, startObj, endObj);
        }
        startObj.dataBind();
        endObj.dataBind();
    }
    updateDateTime(allDayStatus, startObj, endObj) {
        let startDate;
        let endDate;
        if (allDayStatus) {
            startDate = resetTime(new Date(this.parent.activeCellsData.startTime.getTime()));
            if (this.parent.activeCellsData.isAllDay) {
                let temp = addDays(new Date(this.parent.activeCellsData.endTime.getTime()), -1).getTime();
                endDate = (+this.parent.activeCellsData.startTime > temp) ? this.parent.activeCellsData.endTime : new Date(temp);
            }
            else {
                endDate = resetTime(new Date(this.parent.activeCellsData.endTime.getTime()));
            }
        }
        else {
            startDate = new Date(this.parent.activeCellsData.startTime.getTime());
            if (this.parent.currentView === 'Month' || this.parent.currentView === 'MonthAgenda' || this.parent.activeCellsData.isAllDay) {
                let startHour = this.parent.getStartEndTime(this.parent.workHours.start);
                startDate.setHours(startHour.getHours(), startHour.getMinutes(), startHour.getSeconds());
                endDate = new Date(startDate.getTime());
                endDate.setMilliseconds(MS_PER_MINUTE * this.getSlotDuration());
            }
            else {
                endDate = new Date(this.parent.activeCellsData.endTime.getTime());
            }
        }
        startObj.value = startDate;
        endObj.value = endDate;
        startObj.dataBind();
        endObj.dataBind();
    }
    getFormat(formatType) {
        let format;
        if (this.parent.locale === 'en' || this.parent.locale === 'en-US') {
            format = getValue(formatType + '.short', getDefaultDateObject(this.parent.getCalendarMode()));
        }
        else {
            format = getValue(
            // tslint:disable-next-line:max-line-length
            'main.' + '' + this.parent.locale + '.dates.calendars.' + this.parent.getCalendarMode() + '.' + formatType + '.short', cldrData);
        }
        return format;
    }
    onEventDetailsUpdate(eventObj) {
        if (!this.parent.isAdaptive) {
            removeClass([this.element.querySelector('.' + EVENT_WINDOW_DELETE_BUTTON_CLASS)], DISABLE_CLASS);
        }
        this.element.querySelector('.' + EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML = this.l10n.getConstant('editEvent');
        this.element.querySelector('.' + FORM_CLASS).setAttribute('data-id', eventObj[this.fields.id].toString());
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            eventObj = extend({}, eventObj, null, true);
            let timezoneObj = this.getInstance(TIME_ZONE_CLASS + '.' + EVENT_FIELD$1);
            let timezoneValue;
            if (eventObj[this.fields.startTimezone] || eventObj[this.fields.endTimezone]) {
                timezoneValue = true;
                this.parent.eventBase.timezoneConvert(eventObj);
            }
            else {
                timezoneValue = false;
            }
            eventObj.Timezone = timezoneValue;
            timezoneObj.checked = timezoneValue;
            timezoneObj.dataBind();
        }
        this.showDetails(eventObj);
        if (eventObj[this.fields.recurrenceRule] && this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule(eventObj[this.fields.recurrenceRule], eventObj[this.fields.startTime]);
        }
        else if (!this.parent.isAdaptive && this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule('');
        }
        this.repeatStartDate = eventObj[this.fields.startTime];
        this.repeatRule = '';
        if (eventObj[this.fields.recurrenceRule]) {
            if (this.recurrenceEditor) {
                this.recurrenceEditor.setRecurrenceRule(eventObj[this.fields.recurrenceRule], eventObj[this.fields.startTime]);
            }
            this.repeatRule = eventObj[this.fields.recurrenceRule];
        }
        if (this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            let element = this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            if (eventObj[this.fields.recurrenceRule]) {
                removeClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: true });
            }
            else {
                addClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: false });
            }
            this.updateRepeatLabel(this.repeatRule);
        }
        let isDisable = (this.parent.readonly || eventObj[this.fields.isReadonly]);
        if (!this.parent.isAdaptive) {
            let saveButton = this.element.querySelector('.' + EVENT_WINDOW_SAVE_BUTTON_CLASS);
            let deleteButton = this.element.querySelector('.' + EVENT_WINDOW_DELETE_BUTTON_CLASS);
            this.disableButton(saveButton, isDisable);
            this.disableButton(deleteButton, isDisable);
        }
        else {
            let saveIcon = this.element.querySelector('.' + EVENT_WINDOW_SAVE_ICON_CLASS);
            if (saveIcon) {
                if (isDisable) {
                    addClass([saveIcon], ICON_DISABLE_CLASS);
                }
                else {
                    removeClass([saveIcon], ICON_DISABLE_CLASS);
                }
            }
        }
        this.dialogObject.show();
    }
    disableButton(element, value) {
        if (element) {
            element.ej2_instances[0].disabled = value;
        }
    }
    renderRecurrenceEditor() {
        return new RecurrenceEditor({
            calendarMode: this.parent.calendarMode,
            cssClass: this.parent.cssClass,
            dateFormat: this.parent.dateFormat,
            enableRtl: this.parent.enableRtl,
            firstDayOfWeek: this.parent.firstDayOfWeek,
            locale: this.parent.locale
        });
    }
    updateRepeatLabel(repeatRule) {
        if (this.parent.isAdaptive && !this.repeatDialogObject) {
            this.renderRepeatDialog();
        }
        let data = repeatRule ?
            (this.l10n.getConstant('repeats') + ' ' + this.recurrenceEditor.getRuleSummary(repeatRule)) : this.l10n.getConstant('repeat');
        this.repeatStatus.setProperties({ label: data });
    }
    dialogClose() {
        this.parent.activeEventData = { event: undefined, element: undefined };
        this.parent.currentAction = null;
        this.dialogObject.hide();
    }
    resetForm() {
        this.fieldValidator.destroyToolTip();
        this.resetFormFields();
        if (!this.parent.isAdaptive && this.recurrenceEditor) {
            this.recurrenceEditor.resetFields();
        }
    }
    timezoneChangeStyle(value) {
        let timezoneDiv = this.element.querySelector('.' + EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
        if (value) {
            addClass([timezoneDiv], ENABLE_CLASS);
            let startTimezoneObj = this.getInstance(EVENT_WINDOW_START_TZ_CLASS);
            let endTimezoneObj = this.getInstance(EVENT_WINDOW_END_TZ_CLASS);
            let timezone = startTimezoneObj.dataSource;
            if (!startTimezoneObj.value || !this.parent.timezone) {
                let found = timezone.some((tz) => { return tz.Value === this.localTimezoneName; });
                if (!found) {
                    timezone.push({ Value: this.localTimezoneName, Text: this.localTimezoneName });
                    startTimezoneObj.dataSource = timezone;
                    endTimezoneObj.dataSource = timezone;
                    startTimezoneObj.dataBind();
                    endTimezoneObj.dataBind();
                }
            }
            startTimezoneObj.value = startTimezoneObj.value || this.parent.timezone || this.localTimezoneName;
            endTimezoneObj.value = endTimezoneObj.value || this.parent.timezone || this.localTimezoneName;
            startTimezoneObj.dataBind();
            endTimezoneObj.dataBind();
        }
        else {
            removeClass([timezoneDiv], ENABLE_CLASS);
        }
    }
    resetFormFields() {
        let formElement = this.getFormElements(EVENT_WINDOW_DIALOG_CLASS);
        for (let currentElement of formElement) {
            let columnName = currentElement.name || this.getColumnName(currentElement);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                this.setDefaultValueToElement(currentElement);
            }
        }
    }
    eventSave(alert) {
        this.parent.uiStateValues.isBlock = false;
        let alertType;
        let formElement = this.element.querySelector('.' + FORM_CLASS);
        if (formElement && formElement.classList.contains('e-formvalidator') &&
            !formElement.ej2_instances[0].validate()) {
            return;
        }
        let eventObj = extend({}, this.getObjectFromFormData(EVENT_WINDOW_DIALOG_CLASS));
        if (!eventObj.Timezone) {
            eventObj[this.fields.startTimezone] = null;
            eventObj[this.fields.endTimezone] = null;
        }
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            delete eventObj.Timezone;
            delete eventObj.Repeat;
            if (!eventObj[this.fields.startTime] || !eventObj[this.fields.endTime]) {
                this.parent.quickPopup.openValidationError('invalidDateError');
                return;
            }
            if (eventObj[this.fields.startTime] > eventObj[this.fields.endTime]) {
                this.parent.quickPopup.openValidationError('startEndError');
                return;
            }
        }
        if (this.recurrenceEditor && this.recurrenceEditor.value && this.recurrenceEditor.value !== '') {
            alertType = this.recurrenceValidation(eventObj[this.fields.startTime], eventObj[this.fields.endTime], alert);
            let isShowAlert = true;
            if (alertType === 'seriesChangeAlert' && this.parent.uiStateValues.isIgnoreOccurrence) {
                isShowAlert = false;
            }
            if (!isNullOrUndefined(alertType) && isShowAlert) {
                this.parent.quickPopup.openRecurrenceValidationAlert(alertType);
                return;
            }
        }
        let eventId = this.getEventIdFromForm();
        this.setDefaultValueToObject(eventObj);
        if (eventObj[this.fields.isAllDay]) {
            eventObj[this.fields.startTime] = resetTime(new Date(eventObj[this.fields.startTime].getTime()));
            eventObj[this.fields.endTime] = addDays(resetTime(new Date(eventObj[this.fields.endTime].getTime())), 1);
        }
        let ruleData = this.recurrenceEditor ? this.recurrenceEditor.getRecurrenceRule() : null;
        eventObj[this.fields.recurrenceRule] = ruleData ? ruleData : undefined;
        let isResourceEventExpand = (this.parent.activeViewOptions.group.resources.length > 0 ||
            this.parent.resourceCollection.length > 0) && !this.parent.activeViewOptions.group.allowGroupEdit;
        if (!isNullOrUndefined(eventId)) {
            let eveId = this.parent.eventBase.getEventIDType() === 'string' ? eventId : parseInt(eventId, 10);
            let editedData = new DataManager({ json: this.parent.eventsData }).executeLocal(new Query().
                where(this.fields.id, 'equal', eveId))[0];
            eventObj = extend({}, editedData, eventObj);
            if (eventObj[this.fields.isReadonly]) {
                return;
            }
            let currentAction;
            if (!isNullOrUndefined(editedData[this.fields.recurrenceRule])) {
                currentAction = this.parent.currentAction;
                if (this.parent.currentAction === 'EditOccurrence') {
                    if (!eventObj[this.fields.recurrenceID]) {
                        eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                        eventObj.Guid = this.parent.activeEventData.event.Guid;
                    }
                    else {
                        eveId = eventObj[this.fields.recurrenceID];
                        currentAction = null;
                    }
                    if (this.editOccurrenceValidation(eveId, eventObj)) {
                        this.parent.quickPopup.openRecurrenceValidationAlert('sameDayAlert');
                        return;
                    }
                }
                if (this.parent.currentAction === 'EditSeries' || eventObj[this.fields.id] !== editedData[this.fields.id]) {
                    eventObj[this.fields.recurrenceID] = editedData[this.fields.id];
                }
            }
            if (isResourceEventExpand) {
                this.resourceSaveEvent(eventObj, 'Save', currentAction);
            }
            else {
                this.parent.saveEvent(eventObj, currentAction);
            }
        }
        else {
            this.parent.currentAction = 'Add';
            if (isResourceEventExpand) {
                this.resourceSaveEvent(eventObj, this.parent.currentAction);
            }
            else {
                eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                this.parent.addEvent(eventObj);
            }
        }
        if (this.parent.uiStateValues.isBlock) {
            return;
        }
        this.dialogObject.hide();
    }
    getObjectFromFormData(className) {
        let formElement = this.getFormElements(className);
        let eventObj = {};
        for (let currentElement of formElement) {
            let columnName = currentElement.name || this.getColumnName(currentElement);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                eventObj[columnName] = this.getValueFromElement(currentElement);
            }
        }
        return eventObj;
    }
    setDefaultValueToObject(eventObj) {
        if (!isNullOrUndefined(eventObj[this.fields.subject])) {
            eventObj[this.fields.subject] = eventObj[this.fields.subject] || this.parent.eventSettings.fields.subject.default;
        }
        if (!isNullOrUndefined(eventObj[this.fields.location])) {
            eventObj[this.fields.location] = eventObj[this.fields.location] || this.parent.eventSettings.fields.location.default;
        }
        if (!isNullOrUndefined(eventObj[this.fields.description])) {
            eventObj[this.fields.description] = eventObj[this.fields.description] || this.parent.eventSettings.fields.description.default;
        }
    }
    recurrenceValidation(startDate, endDate, alert) {
        let alertMessage;
        let recEditor = this.recurrenceEditor;
        let interval = this.getInstance('e-repeat-interval.e-numerictextbox').value;
        if (alert !== this.l10n.getConstant('ok')) {
            if (this.parent.currentAction === 'EditSeries' &&
                !isNullOrUndefined(this.eventData[this.parent.eventFields.recurrenceException])) {
                alertMessage = 'seriesChangeAlert';
            }
            if (this.getInstance('e-end-on-left .e-ddl .e-dropdownlist').value === 'until' &&
                this.getInstance('e-end-on-date .e-datepicker').value < startDate) {
                alertMessage = 'wrongPattern';
            }
            if (isNullOrUndefined(alertMessage)) {
                switch (recEditor.value.split(';')[0].split('=')[1]) {
                    case 'DAILY':
                        if ((((endDate.getTime() - startDate.getTime()) / (1000 * 3600)) >= (interval * 24))) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'WEEKLY':
                        let types = recEditor.value.split(';')[1].split('=')[1].split(',');
                        let obj = { 'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6 };
                        let temp = [];
                        let tempDiff = [];
                        for (let index = 0; index < types.length * (interval + 1); index++) {
                            temp[index] = (types.length > index) ? obj[types[index]] : temp[index - types.length] + (7 * interval);
                        }
                        let tempvalue = temp.sort((a, b) => a - b);
                        for (let index = 1; index < tempvalue.length; index++) {
                            tempDiff.push(tempvalue[index] - tempvalue[index - 1]);
                        }
                        if ((((endDate.getTime() - startDate.getTime()) / (1000 * 3600)) >= Math.min.apply(Math, tempDiff) * 24)
                            || isNullOrUndefined(interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'MONTHLY':
                        if (this.getInstance('e-month-expander-checkbox-wrapper .e-radio').checked
                            && [29, 30, 31].indexOf(parseInt(recEditor.value.split(';')[1].split('=')[1], 10)) !== -1) {
                            alertMessage = 'dateValidation';
                        }
                        else if (endDate.getTime() >= new Date(+startDate).setMonth(startDate.getMonth() + interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'YEARLY':
                        if (endDate.getTime() >= new Date(+startDate).setFullYear(startDate.getFullYear() + interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                }
            }
        }
        else {
            if (endDate.getTime() >= new Date(+startDate).setMonth(startDate.getMonth() + interval)) {
                alertMessage = 'createError';
            }
            if (isNullOrUndefined(alertMessage)) {
                this.parent.quickPopup.quickDialog.hide();
            }
        }
        return alertMessage;
    }
    getRecurrenceIndex(recColl, event) {
        let recIndex;
        for (let index = 0; index < recColl.length; index++) {
            if (event[this.fields.startTime].valueOf() === recColl[index][this.fields.startTime].valueOf()) {
                recIndex = index;
                break;
            }
        }
        return recIndex;
    }
    trimAllDay(data) {
        if (data[this.fields.isAllDay]) {
            let temp = addDays(new Date(+data[this.fields.endTime]), -1).getTime();
            data[this.fields.endTime] = (+data[this.fields.startTime] > temp) ? data[this.fields.endTime] : new Date(temp);
        }
    }
    editOccurrenceValidation(eventId, currentData, editData) {
        if (editData === void 0) {
            editData = this.eventData;
        }
        let recurColl = this.parent.getOccurrencesByID(eventId);
        let excludedDatas = new DataManager({ json: this.parent.eventsData }).executeLocal(new Query().
            where(this.fields.recurrenceID, 'equal', eventId));
        excludedDatas.map((data) => recurColl.push(extend({}, data)));
        currentData = extend({}, currentData);
        this.trimAllDay(currentData);
        for (let data of recurColl) {
            this.trimAllDay(data);
        }
        this.parent.eventBase.sortByTime(recurColl);
        let index = this.getRecurrenceIndex(recurColl, editData);
        if (isNullOrUndefined(index)) {
            return false;
        }
        if (index === 0) {
            if (!isNullOrUndefined(recurColl[index + 1])) {
                return (!(new Date(+recurColl[index + 1][this.fields.startTime]).setHours(0, 0, 0, 0) >
                    new Date(+currentData[this.fields.endTime]).setHours(0, 0, 0, 0)));
            }
            return false;
        }
        else {
            if (index === recurColl.length - 1) {
                if (!(new Date(+recurColl[index - 1][this.fields.endTime]).setHours(0, 0, 0, 0) <
                    new Date(+currentData[this.fields.startTime]).setHours(0, 0, 0, 0))) {
                    return true;
                }
            }
            else if (!((new Date(+recurColl[index - 1][this.fields.endTime]).setHours(0, 0, 0, 0) <
                new Date(+currentData[this.fields.startTime]).setHours(0, 0, 0, 0)) &&
                (new Date(+recurColl[index + 1][this.fields.startTime]).setHours(0, 0, 0, 0) >
                    new Date(+currentData[this.fields.endTime]).setHours(0, 0, 0, 0)))) {
                return true;
            }
        }
        return false;
    }
    resourceSaveEvent(eventObj, action, currentAction) {
        let lastResouceData = this.parent.resourceBase.resourceCollection.slice(-1)[0];
        let resourceData = eventObj[lastResouceData.field];
        resourceData = (resourceData instanceof Array) ? resourceData : [resourceData];
        let lastlevel = this.parent.resourceBase.lastResourceLevel;
        let eventList = [];
        for (let i = 0; i < resourceData.length; i++) {
            let events = extend({}, eventObj, null, true);
            events[this.fields.id] = this.parent.eventBase.getEventMaxID();
            let temp = [];
            let addValues = () => {
                if (action === 'Save' && i === resourceData.length - 1) {
                    if (temp.length > 0) {
                        temp[0][this.fields.id] = eventObj[this.fields.id];
                        for (let k = 1; k < temp.length; k++) {
                            temp[k][this.fields.id] = this.parent.eventBase.getEventMaxID(i);
                            eventList.push(temp[k]);
                            this.parent.saveEvent(temp[0], currentAction);
                        }
                    }
                    else {
                        events[this.fields.id] = eventObj[this.fields.id];
                        this.parent.saveEvent(events, currentAction);
                    }
                }
                else {
                    if (temp.length > 0) {
                        for (let j = 0; j < temp.length; j++) {
                            temp[j][this.fields.id] = this.parent.eventBase.getEventMaxID(j);
                            eventList.push(temp[j]);
                        }
                    }
                    else {
                        events[this.fields.id] = this.parent.eventBase.getEventMaxID(i);
                        eventList.push(events);
                    }
                }
            };
            if (this.parent.activeViewOptions.group.byGroupID && (!isNullOrUndefined(lastlevel))) {
                let lastResource = lastResouceData.dataSource;
                let index = findIndexInData(lastResource, lastResouceData.idField, resourceData[i]);
                let groupId = lastResource[index][lastResouceData.groupIDField];
                let filter = lastlevel.filter((obj) => obj.resourceData[lastResouceData.idField] === resourceData[i]).
                    filter((obj) => obj.resourceData[lastResouceData.groupIDField] === groupId)[0];
                let groupOrder = filter.groupOrder;
                for (let index = 0; index < this.parent.resourceBase.resourceCollection.length; index++) {
                    let field = this.parent.resourceBase.resourceCollection[index].field;
                    events[field] = (groupOrder[index] instanceof Array) ? groupOrder[index][0] : groupOrder[index];
                }
                addValues();
            }
            else {
                for (let index = 0; index < this.parent.resourceBase.resourceCollection.length - 1; index++) {
                    let field = this.parent.resourceBase.resourceCollection[index].field;
                    if (events[field] instanceof Array && events[field].length > 1) {
                        for (let k = 0; k < events[field].length; k++) {
                            let event = extend({}, events, null, true);
                            event[field] = eventObj[field][k];
                            event[lastResouceData.field] = resourceData[i];
                            temp.push(event);
                        }
                    }
                    else {
                        if (temp.length === 0) {
                            events[field] = (eventObj[field] instanceof Array) ?
                                eventObj[field][0] : eventObj[field];
                            events[lastResouceData.field] = resourceData[i];
                        }
                        else {
                            for (let l = 0; l < temp.length; l++) {
                                temp[l][field] = (eventObj[field] instanceof Array) ?
                                    eventObj[field][0] : eventObj[field];
                            }
                        }
                    }
                }
                events[lastResouceData.field] = resourceData[i];
                addValues();
            }
        }
        if (eventList.length > 0) {
            for (let event of eventList) {
                event[this.fields.recurrenceException] = null;
                event[this.fields.recurrenceID] = null;
            }
            this.parent.addEvent(eventList);
        }
    }
    getEventIdFromForm() {
        return this.element.querySelector('.' + FORM_CLASS).getAttribute('data-id');
    }
    getFormElements(className) {
        if (className === EVENT_WINDOW_DIALOG_CLASS) {
            return [].slice.call(this.element.querySelectorAll('.' + EVENT_FIELD$1));
        }
        return [].slice.call(this.parent.element.querySelectorAll('.' + className + ' .' + EVENT_FIELD$1));
    }
    getValueFromElement(element) {
        let value;
        if (element.classList.contains('e-datepicker')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-datetimepicker')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-dropdownlist')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-multiselect')) {
            value = element.ej2_instances[0].value;
        }
        else if (element.classList.contains('e-checkbox')) {
            value = element.ej2_instances[0].checked;
        }
        else {
            if (element.type === 'checkbox') {
                value = element.checked;
            }
            else {
                value = element.value;
            }
        }
        return value;
    }
    setValueToElement(element, value) {
        if (element.classList.contains('e-datepicker')) {
            let instance = element.ej2_instances[0];
            instance.value = value;
            instance.dataBind();
        }
        else if (element.classList.contains('e-datetimepicker')) {
            let instance = element.ej2_instances[0];
            instance.value = value;
            instance.dataBind();
        }
        else if (element.classList.contains('e-dropdownlist')) {
            let instance = element.ej2_instances[0];
            instance.value = value;
            instance.dataBind();
        }
        else if (element.classList.contains('e-multiselect')) {
            let instance = element.ej2_instances[0];
            instance.value = [];
            instance.value = ((value instanceof Array) ? value : [value]);
            instance.dataBind();
        }
        else if (element.classList.contains('e-checkbox')) {
            let instance = element.ej2_instances[0];
            instance.checked = value;
            instance.dataBind();
        }
        else {
            if (element.type !== 'checkbox') {
                element.value = value || '';
            }
            else {
                element.checked = value;
            }
        }
    }
    setDefaultValueToElement(element) {
        if (element.classList.contains('e-datepicker')) {
            let instance = element.ej2_instances[0];
            instance.value = new Date();
            instance.dataBind();
        }
        else if (element.classList.contains('e-datetimepicker')) {
            let instance = element.ej2_instances[0];
            instance.value = new Date();
            instance.dataBind();
        }
        else if (element.classList.contains('e-dropdownlist')) {
            let instance = element.ej2_instances[0];
            instance.value = null;
            instance.dataBind();
        }
        else if (element.classList.contains('e-multiselect')) {
            let instance = element.ej2_instances[0];
            instance.value = [];
            instance.dataBind();
        }
        else if (element.classList.contains('e-checkbox')) {
            let instance = element.ej2_instances[0];
            instance.checked = false;
            instance.dataBind();
        }
        else {
            if (element.type === 'checkbox') {
                element.checked = false;
            }
            else {
                element.value = '';
            }
        }
    }
    getInstance(className) {
        return this.element.querySelector('.' + className).ej2_instances[0];
    }
    eventDelete() {
        switch (this.parent.currentAction) {
            case 'EditOccurrence':
                let fields = this.parent.eventFields;
                if (!isNullOrUndefined(this.parent.activeEventData.event[fields.recurrenceRule])) {
                    this.parent.currentAction = 'DeleteOccurrence';
                }
                else {
                    this.parent.currentAction = 'Delete';
                }
                break;
            case 'EditSeries':
                this.parent.currentAction = 'DeleteSeries';
                break;
        }
        this.dialogObject.hide();
        this.parent.quickPopup.openDeleteAlert();
    }
    getRecurrenceEditorInstance() {
        if (this.parent.isAdaptive && !this.repeatDialogObject) {
            this.renderRepeatDialog();
        }
        return this.recurrenceEditor;
    }
    destroyComponents() {
        let formelement = this.getFormElements(EVENT_WINDOW_DIALOG_CLASS);
        for (let element of formelement) {
            let instance;
            if (element.classList.contains('e-datetimepicker')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-datepicker')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-checkbox')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-dropdownlist')) {
                instance = element.ej2_instances[0];
            }
            else if (element.classList.contains('e-multiselect')) {
                instance = element.ej2_instances[0];
            }
            if (instance) {
                instance.destroy();
            }
        }
        if (this.buttonObj) {
            this.buttonObj.destroy();
        }
    }
    /**
     * To destroy the event window.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.recurrenceEditor) {
            this.recurrenceEditor.destroy();
        }
        this.destroyComponents();
        this.fieldValidator.destroy();
        if (this.repeatDialogObject) {
            this.repeatDialogObject.destroy();
            remove(this.repeatDialogObject.element);
        }
        if (this.dialogObject) {
            this.dialogObject.destroy();
            this.dialogObject = null;
        }
        if (this.element) {
            remove(this.element);
            this.element = null;
        }
    }
}

/**
 * Virtual Scroll
 */
class VirtualScroll {
    constructor(parent) {
        this.translateY = 0;
        this.itemSize = 60;
        this.bufferCount = 3;
        this.renderedLength = 0;
        this.averageRowHeight = 0;
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(virtualScroll, this.virtualScrolling, this);
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(virtualScroll, this.virtualScrolling);
    }
    getRenderedCount() {
        this.setItemSize();
        return Math.ceil(this.parent.element.clientHeight / this.itemSize) + this.bufferCount;
    }
    renderVirtualTrack(contentWrap) {
        let wrap = createElement('div', { className: VIRTUAL_TRACK_CLASS });
        wrap.style.height = (this.parent.resourceBase.expandedResources.length * this.itemSize) + 'px';
        contentWrap.appendChild(wrap);
    }
    updateVirtualScrollHeight() {
        let virtual = this.parent.element.querySelector('.' + VIRTUAL_TRACK_CLASS);
        let lastResourceIndex = this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
        let lastRenderIndex = this.parent.resourceBase.renderedResources[this.parent.resourceBase.renderedResources.length - 1].groupIndex;
        if (lastRenderIndex !== lastResourceIndex) {
            let conTable = this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS);
            this.renderedLength = conTable.querySelector('tbody').children.length;
            virtual.style.height = (conTable.offsetHeight + (this.parent.resourceBase.expandedResources.length - (this.renderedLength)) *
                conTable.offsetHeight / this.renderedLength) + 'px';
        }
        else {
            virtual.style.height = '';
        }
        this.averageRowHeight = virtual.offsetHeight / this.parent.resourceBase.expandedResources.length;
    }
    updateVirtualTrackHeight(wrap) {
        let resourceCount = this.parent.resourceBase.renderedResources.length;
        if (resourceCount !== this.getRenderedCount()) {
            wrap.style.height = this.parent.element.querySelector('.e-content-wrap').clientHeight + 'px';
            let resWrap = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
            let conWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
            let eventWrap = this.parent.element.querySelector('.' + EVENT_TABLE_CLASS);
            this.translateY = 0;
            this.setTranslate(resWrap, conWrap, eventWrap);
        }
        else {
            let lastRenderIndex = this.parent.resourceBase.renderedResources[resourceCount - 1].groupIndex;
            let lastCollIndex = this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
            let renderedResConut = resourceCount + (lastCollIndex - lastRenderIndex);
            renderedResConut = (renderedResConut > this.parent.resourceBase.expandedResources.length) ?
                this.parent.resourceBase.expandedResources.length : renderedResConut;
            wrap.style.height = (renderedResConut * this.itemSize) + 'px';
        }
    }
    setItemSize() {
        this.itemSize = getElementHeightFromClass(this.parent.activeView.element, WORK_CELLS_CLASS) || this.itemSize;
    }
    virtualScrolling() {
        this.parent.quickPopup.quickPopupHide();
        this.parent.quickPopup.morePopup.hide();
        let resWrap = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
        let conWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        let eventWrap = this.parent.element.querySelector('.' + EVENT_TABLE_CLASS);
        let timeIndicator = this.parent.element.querySelector('.' + CURRENT_TIMELINE_CLASS);
        let conTable = this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS);
        this.renderedLength = resWrap.querySelector('tbody').children.length;
        let firstTDIndex = parseInt(resWrap.querySelector('tbody td').getAttribute('data-group-index'), 10);
        let scrollHeight = (this.parent.rowAutoHeight) ?
            (conTable.offsetHeight - conWrap.offsetHeight) : this.bufferCount * this.itemSize;
        addClass([conWrap], 'e-transition');
        let resCollection = [];
        if ((conWrap.scrollTop) - this.translateY < 0) {
            resCollection = this.upScroll(conWrap, firstTDIndex);
        }
        else if (conWrap.scrollTop - this.translateY > scrollHeight) {
            resCollection = this.downScroll(conWrap, firstTDIndex);
        }
        if (!isNullOrUndefined(resCollection) && resCollection.length > 0) {
            this.updateContent(resWrap, conWrap, eventWrap, resCollection);
            this.setTranslate(resWrap, conWrap, eventWrap, timeIndicator);
            this.parent.notify(dataReady, {});
            if (this.parent.dragAndDropModule && this.parent.dragAndDropModule.actionObj.action === 'drag') {
                this.parent.dragAndDropModule.navigationWrapper();
            }
        }
    }
    upScroll(conWrap, firstTDIndex) {
        let index = (~~(conWrap.scrollTop / this.itemSize) + Math.ceil(conWrap.clientHeight / this.itemSize)) - this.renderedLength;
        if (this.parent.rowAutoHeight) {
            index = (index > firstTDIndex) ? firstTDIndex - this.bufferCount : index;
        }
        index = (index > 0) ? index : 0;
        let prevSetCollection = this.getBufferCollection(index, index + this.renderedLength);
        this.parent.resourceBase.renderedResources = prevSetCollection;
        if (firstTDIndex === 0) {
            this.translateY = conWrap.scrollTop;
        }
        else {
            let height = (this.parent.rowAutoHeight) ? this.averageRowHeight : this.itemSize;
            this.translateY = (conWrap.scrollTop - (this.bufferCount * height) > 0) ?
                conWrap.scrollTop - (this.bufferCount * height) : 0;
        }
        return prevSetCollection;
    }
    downScroll(conWrap, firstTDIndex) {
        let lastResource = this.parent.resourceBase.
            renderedResources[this.parent.resourceBase.renderedResources.length - 1].groupIndex;
        let lastResourceIndex = this.parent.resourceBase.expandedResources[this.parent.resourceBase.expandedResources.length - 1].groupIndex;
        if (lastResource === lastResourceIndex) {
            return null;
        }
        let nextSetResIndex = ~~(conWrap.scrollTop / this.itemSize);
        if (this.parent.rowAutoHeight) {
            nextSetResIndex = ~~((conWrap.scrollTop - this.translateY) / this.averageRowHeight) + firstTDIndex;
            nextSetResIndex = (nextSetResIndex > firstTDIndex + this.bufferCount) ? nextSetResIndex : firstTDIndex + this.bufferCount;
        }
        let lastIndex = nextSetResIndex + this.renderedLength;
        lastIndex = (lastIndex > this.parent.resourceBase.expandedResources.length) ?
            nextSetResIndex + (this.parent.resourceBase.expandedResources.length - nextSetResIndex) : lastIndex;
        let nextSetCollection = this.getBufferCollection(lastIndex - this.renderedLength, lastIndex);
        this.translateY = conWrap.scrollTop;
        return nextSetCollection;
    }
    updateContent(resWrap, conWrap, eventWrap, resCollection) {
        let renderedLenth = resWrap.querySelector('tbody').children.length;
        for (let i = 0; i < renderedLenth; i++) {
            remove(resWrap.querySelector('tbody tr'));
            remove(conWrap.querySelector('tbody tr'));
            remove(eventWrap.querySelector('div'));
        }
        this.parent.resourceBase.renderedResources = resCollection;
        let resourceRows = this.parent.resourceBase.getContentRows(resCollection);
        let contentRows = this.parent.activeView.getContentRows();
        let eventRows = this.parent.activeView.getEventRows(resCollection.length);
        append(resourceRows, resWrap.querySelector('tbody'));
        append(contentRows, conWrap.querySelector('tbody'));
        append(eventRows, eventWrap);
    }
    getBufferCollection(startIndex, endIndex) {
        return this.parent.resourceBase.expandedResources.slice(startIndex, endIndex);
    }
    setTranslate(resWrap, conWrap, eventWrap, timeIndicator) {
        setStyleAttribute(resWrap.querySelector('table'), {
            transform: `translateY(${this.translateY}px)`
        });
        setStyleAttribute(conWrap.querySelector('table'), {
            transform: `translateY(${this.translateY}px)`
        });
        setStyleAttribute(eventWrap, {
            transform: `translateY(${this.translateY}px)`
        });
        if (!isNullOrUndefined(timeIndicator)) {
            setStyleAttribute(timeIndicator, {
                transform: `translateY(${this.translateY}px)`
            });
        }
    }
    destroy() {
        this.removeEventListener();
    }
}

/**
 * Schedule DOM rendering
 */
class Render {
    /**
     * Constructor for render
     */
    constructor(parent) {
        this.parent = parent;
    }
    render(viewName, isDataRefresh = true) {
        this.initializeLayout(viewName);
        if (isDataRefresh) {
            this.refreshDataManager();
        }
    }
    initializeLayout(viewName) {
        if (this.parent.activeView) {
            this.parent.activeView.removeEventListener();
            this.parent.activeView.destroy();
        }
        switch (viewName) {
            case 'Day':
                this.parent.activeView = this.parent.dayModule;
                break;
            case 'Week':
                this.parent.activeView = this.parent.weekModule;
                break;
            case 'WorkWeek':
                this.parent.activeView = this.parent.workWeekModule;
                break;
            case 'Month':
                this.parent.activeView = this.parent.monthModule;
                break;
            case 'Agenda':
                this.parent.activeView = this.parent.agendaModule;
                break;
            case 'MonthAgenda':
                this.parent.activeView = this.parent.monthAgendaModule;
                break;
            case 'TimelineDay':
                this.parent.activeView = this.parent.timelineViewsModule;
                this.parent.activeView.viewClass = 'e-timeline-day-view';
                break;
            case 'TimelineWorkWeek':
                this.parent.activeView = this.parent.timelineViewsModule;
                this.parent.activeView.viewClass = 'e-timeline-work-week-view';
                break;
            case 'TimelineWeek':
                this.parent.activeView = this.parent.timelineViewsModule;
                this.parent.activeView.viewClass = 'e-timeline-week-view';
                break;
            case 'TimelineMonth':
                this.parent.activeView = this.parent.timelineMonthModule;
                break;
        }
        if (isNullOrUndefined(this.parent.activeView)) {
            let firstView = this.parent.viewCollections[0].option;
            if (firstView) {
                this.parent.setProperties({ currentView: firstView }, true);
                if (this.parent.headerModule) {
                    this.parent.headerModule.updateActiveView();
                    this.parent.headerModule.setCalendarView();
                }
                return this.initializeLayout(firstView);
            }
            throw Error('Inject required modules');
        }
        this.updateLabelText(viewName);
        this.parent.activeView.addEventListener();
        this.parent.activeView.getRenderDates();
        this.parent.uiStateValues.isGroupAdaptive = this.parent.isAdaptive && this.parent.activeViewOptions.group.resources.length > 0 &&
            this.parent.activeViewOptions.group.enableCompactView;
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.destroy();
            this.parent.virtualScrollModule = null;
        }
        if (this.parent.currentView.indexOf('Timeline') !== -1 && this.parent.activeViewOptions.allowVirtualScrolling
            && this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.virtualScrollModule = new VirtualScroll(this.parent);
            this.parent.uiStateValues.top = 0;
        }
        if (this.parent.headerModule) {
            this.parent.headerModule.updateDateRange(this.parent.activeView.getDateRangeText());
            this.parent.headerModule.updateHeaderItems('remove');
        }
        this.parent.activeView.renderLayout(CURRENT_PANEL_CLASS);
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.destroy();
            this.parent.eventTooltip = null;
        }
        if (this.parent.eventSettings.enableTooltip || (this.parent.activeViewOptions.group.resources.length > 0
            && this.parent.activeViewOptions.group.headerTooltipTemplate)) {
            this.parent.eventTooltip = new EventTooltip(this.parent);
        }
    }
    updateLabelText(view) {
        let content = this.parent.activeView.getLabelText(view);
        this.parent.element.setAttribute('role', 'main');
        this.parent.element.setAttribute('aria-label', content);
    }
    refreshDataManager() {
        let start = this.parent.activeView.startDate();
        let end = this.parent.activeView.endDate();
        let dataManager = this.parent.dataModule.getData(this.parent.dataModule.generateQuery(start, end));
        dataManager.then((e) => this.dataManagerSuccess(e)).catch((e) => this.dataManagerFailure(e));
    }
    dataManagerSuccess(e) {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(dataBinding, e);
        let resultData = extend([], e.result, null, true);
        this.parent.eventsData = resultData.filter((data) => !data[this.parent.eventFields.isBlock]);
        this.parent.blockData = resultData.filter((data) => data[this.parent.eventFields.isBlock]);
        let processed = this.parent.eventBase.processData(resultData);
        this.parent.notify(dataReady, { processedData: processed });
        if (this.parent.dragAndDropModule && this.parent.dragAndDropModule.actionObj.action === 'drag') {
            this.parent.dragAndDropModule.navigationWrapper();
        }
        this.parent.trigger(dataBound);
        this.parent.hideSpinner();
    }
    dataManagerFailure(e) {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(actionFailure, { error: e });
        this.parent.hideSpinner();
    }
}

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that represents the configuration of working hours related options of scheduler.
 */
class WorkHours extends ChildProperty {
}
__decorate$2([
    Property(true)
], WorkHours.prototype, "highlight", void 0);
__decorate$2([
    Property('09:00')
], WorkHours.prototype, "start", void 0);
__decorate$2([
    Property('18:00')
], WorkHours.prototype, "end", void 0);

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that represents the configuration of options related to timescale on scheduler.
 */
class TimeScale extends ChildProperty {
}
__decorate$3([
    Property(true)
], TimeScale.prototype, "enable", void 0);
__decorate$3([
    Property(60)
], TimeScale.prototype, "interval", void 0);
__decorate$3([
    Property(2)
], TimeScale.prototype, "slotCount", void 0);
__decorate$3([
    Property()
], TimeScale.prototype, "minorSlotTemplate", void 0);
__decorate$3([
    Property()
], TimeScale.prototype, "majorSlotTemplate", void 0);

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that defines the template options available to customize the quick popup of scheduler.
 */
class QuickInfoTemplates extends ChildProperty {
}
__decorate$4([
    Property()
], QuickInfoTemplates.prototype, "header", void 0);
__decorate$4([
    Property()
], QuickInfoTemplates.prototype, "content", void 0);
__decorate$4([
    Property()
], QuickInfoTemplates.prototype, "footer", void 0);

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that represents the header rows related configurations on timeline views.
 */
class HeaderRows extends ChildProperty {
}
__decorate$5([
    Property()
], HeaderRows.prototype, "option", void 0);
__decorate$5([
    Property()
], HeaderRows.prototype, "template", void 0);

var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configuration that applies on each appointment field options of scheduler.
 */
class FieldOptions extends ChildProperty {
}
__decorate$8([
    Property()
], FieldOptions.prototype, "name", void 0);
__decorate$8([
    Property()
], FieldOptions.prototype, "default", void 0);
__decorate$8([
    Property()
], FieldOptions.prototype, "title", void 0);
__decorate$8([
    Property({})
], FieldOptions.prototype, "validation", void 0);

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A Class that holds the collection of event fields that requires to be mapped with the dataSource
 * fields along with its available configuration settings. Each field in it accepts both string and Object
 *  data type. When each of the field is assigned with simple `string` value, it is assumed that the dataSource field
 *  name is mapped with it. If the `object` type is defined on each fields, then the validation related settings and mapping of
 *  those fields with dataSource can be given altogether within it.
 */
class Field extends ChildProperty {
}
__decorate$7([
    Property('Id')
], Field.prototype, "id", void 0);
__decorate$7([
    Property('IsBlock')
], Field.prototype, "isBlock", void 0);
__decorate$7([
    Complex({ name: 'Subject', default: 'Add title' }, FieldOptions)
], Field.prototype, "subject", void 0);
__decorate$7([
    Complex({ name: 'StartTime' }, FieldOptions)
], Field.prototype, "startTime", void 0);
__decorate$7([
    Complex({ name: 'EndTime' }, FieldOptions)
], Field.prototype, "endTime", void 0);
__decorate$7([
    Complex({ name: 'StartTimezone' }, FieldOptions)
], Field.prototype, "startTimezone", void 0);
__decorate$7([
    Complex({ name: 'EndTimezone' }, FieldOptions)
], Field.prototype, "endTimezone", void 0);
__decorate$7([
    Complex({ name: 'Location' }, FieldOptions)
], Field.prototype, "location", void 0);
__decorate$7([
    Complex({ name: 'Description' }, FieldOptions)
], Field.prototype, "description", void 0);
__decorate$7([
    Complex({ name: 'IsAllDay' }, FieldOptions)
], Field.prototype, "isAllDay", void 0);
__decorate$7([
    Complex({ name: 'RecurrenceID' }, FieldOptions)
], Field.prototype, "recurrenceID", void 0);
__decorate$7([
    Complex({ name: 'RecurrenceRule' }, FieldOptions)
], Field.prototype, "recurrenceRule", void 0);
__decorate$7([
    Complex({ name: 'RecurrenceException' }, FieldOptions)
], Field.prototype, "recurrenceException", void 0);
__decorate$7([
    Property('IsReadonly')
], Field.prototype, "isReadonly", void 0);

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Holds the configuration of event related options and dataSource binding to Schedule.
 */
class EventSettings extends ChildProperty {
}
__decorate$6([
    Property()
], EventSettings.prototype, "template", void 0);
__decorate$6([
    Property([])
], EventSettings.prototype, "dataSource", void 0);
__decorate$6([
    Property()
], EventSettings.prototype, "query", void 0);
__decorate$6([
    Complex({}, Field)
], EventSettings.prototype, "fields", void 0);
__decorate$6([
    Property(false)
], EventSettings.prototype, "enableTooltip", void 0);
__decorate$6([
    Property()
], EventSettings.prototype, "tooltipTemplate", void 0);
__decorate$6([
    Property()
], EventSettings.prototype, "resourceColorField", void 0);

var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that holds the resource grouping related configurations on Schedule.
 */
class Group extends ChildProperty {
}
__decorate$9([
    Property(false)
], Group.prototype, "byDate", void 0);
__decorate$9([
    Property(true)
], Group.prototype, "byGroupID", void 0);
__decorate$9([
    Property(false)
], Group.prototype, "allowGroupEdit", void 0);
__decorate$9([
    Property([])
], Group.prototype, "resources", void 0);
__decorate$9([
    Property(true)
], Group.prototype, "enableCompactView", void 0);
__decorate$9([
    Property()
], Group.prototype, "headerTooltipTemplate", void 0);

var __decorate$10 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A class that represents the resource related configurations and its data binding options.
 */
class Resources extends ChildProperty {
}
__decorate$10([
    Property()
], Resources.prototype, "field", void 0);
__decorate$10([
    Property()
], Resources.prototype, "title", void 0);
__decorate$10([
    Property()
], Resources.prototype, "name", void 0);
__decorate$10([
    Property(false)
], Resources.prototype, "allowMultiple", void 0);
__decorate$10([
    Property([])
], Resources.prototype, "dataSource", void 0);
__decorate$10([
    Property()
], Resources.prototype, "query", void 0);
__decorate$10([
    Property('Id')
], Resources.prototype, "idField", void 0);
__decorate$10([
    Property('Text')
], Resources.prototype, "textField", void 0);
__decorate$10([
    Property('Expanded')
], Resources.prototype, "expandedField", void 0);
__decorate$10([
    Property('GroupID')
], Resources.prototype, "groupIDField", void 0);
__decorate$10([
    Property('Color')
], Resources.prototype, "colorField", void 0);
__decorate$10([
    Property('StartHour')
], Resources.prototype, "startHourField", void 0);
__decorate$10([
    Property('EndHour')
], Resources.prototype, "endHourField", void 0);
__decorate$10([
    Property('WorkDays')
], Resources.prototype, "workDaysField", void 0);
__decorate$10([
    Property('CssClass')
], Resources.prototype, "cssClassField", void 0);

class ResourceBase {
    constructor(parent) {
        this.resourceCollection = [];
        this.leftPixel = 25;
        this.parent = parent;
    }
    renderResourceHeaderIndent(tr) {
        let resColTd = createElement('td', { className: RESOURCE_LEFT_TD_CLASS });
        let resColDiv = createElement('div', { className: RESOURCE_TEXT_CLASS });
        resColTd.appendChild(resColDiv);
        let args = { elementType: 'emptyCells', element: resColTd };
        this.parent.trigger(renderCell, args);
        tr.appendChild(resColTd);
    }
    hideResourceRows(tBody) {
        if (this.resourceCollection.length <= 1 || this.parent.virtualScrollModule) {
            return;
        }
        let trCount = this.lastResourceLevel.length;
        for (let i = 0; i < trCount; i++) {
            let resData = this.lastResourceLevel[i].resourceData;
            let res = this.lastResourceLevel[i].resource;
            if (resData.ClassName === RESOURCE_PARENT_CLASS && !resData[res.expandedField] &&
                !isNullOrUndefined(resData[res.expandedField])) {
                let trCollection = [].slice.call(tBody.children);
                let slicedCollection = trCollection.slice(i + 1, i + (parseInt(resData.Count, 0) + 1));
                addClass(slicedCollection, HIDDEN_CLASS);
            }
        }
    }
    createResourceColumn() {
        let resColl = this.resourceCollection;
        let resDiv = createElement('div', { className: RESOURCE_COLUMN_WRAP_CLASS });
        let tbl = this.parent.activeView.createTableLayout(RESOURCE_COLUMN_TABLE_CLASS);
        if (!this.parent.uiStateValues.isGroupAdaptive && this.parent.rowAutoHeight && this.parent.activeView.isTimelineView()
            && this.parent.activeViewOptions.group.resources.length > 0) {
            addClass([tbl], AUTO_HEIGHT);
        }
        let tBody = tbl.querySelector('tbody');
        let resData = this.generateTreeData(true);
        this.countCalculation(resColl.slice(0, -2), resColl.slice(0, -1));
        this.renderedResources = this.lastResourceLevel;
        if (this.parent.virtualScrollModule) {
            let resourceCount = this.parent.virtualScrollModule.getRenderedCount();
            this.setExpandedResources();
            resData = this.expandedResources.slice(0, resourceCount);
            this.renderedResources = resData;
        }
        append(this.getContentRows(resData), tBody);
        this.hideResourceRows(tBody);
        tbl.appendChild(tBody);
        resDiv.appendChild(tbl);
        return resDiv;
    }
    setExpandedResources() {
        let resources = [];
        for (let i = 0; i < this.lastResourceLevel.length; i++) {
            let resource = this.lastResourceLevel[i].resourceData;
            let count = resource.Count;
            resources.push(this.lastResourceLevel[i]);
            let isExpanded = resource[this.lastResourceLevel[i].resource.expandedField];
            if (!isNullOrUndefined(isExpanded) && !isExpanded && count > 0) {
                i = i + count;
            }
        }
        this.expandedResources = resources;
    }
    getContentRows(resData) {
        let resRows = [];
        let left;
        let rIndex;
        let resColl = this.resourceCollection;
        let tr = createElement('tr');
        let td = createElement('td');
        for (let i = 0; i < resData.length; i++) {
            let ntd = td.cloneNode();
            rIndex = findIndexInData(resColl, 'name', resData[i].resource.name);
            if (rIndex === resColl.length - 1) {
                extend(resData[i].resourceData, { ClassName: RESOURCE_CHILD_CLASS });
                this.renderedResources[i].className = [RESOURCE_CHILD_CLASS];
            }
            else {
                extend(resData[i].resourceData, { ClassName: RESOURCE_PARENT_CLASS });
                this.renderedResources[i].className = [RESOURCE_PARENT_CLASS];
            }
            left = (rIndex * this.leftPixel) + 'px';
            if (resData[i].resourceData.ClassName === RESOURCE_PARENT_CLASS) {
                let iconClass;
                if (resData[i].resourceData[resColl[rIndex].expandedField] ||
                    isNullOrUndefined(resData[i].resourceData[resColl[rIndex].expandedField])) {
                    iconClass = RESOURCE_COLLAPSE_CLASS;
                }
                else {
                    iconClass = RESOURCE_EXPAND_CLASS;
                }
                let iconDiv = createElement('div');
                addClass([iconDiv], [RESOURCE_TREE_ICON_CLASS, iconClass]);
                this.setMargin(iconDiv, left);
                ntd.appendChild(iconDiv);
                if (this.resourceCollection.length > 1) {
                    EventHandler.add(iconDiv, 'click', this.onTreeIconClick, this);
                }
            }
            this.parent.activeView.setResourceHeaderContent(ntd, resData[i], RESOURCE_TEXT_CLASS);
            ntd.setAttribute('data-group-index', resData[i].groupIndex.toString());
            if (!this.parent.activeViewOptions.resourceHeaderTemplate) {
                this.setMargin(ntd.querySelector('.' + RESOURCE_TEXT_CLASS), left);
            }
            let classCollection = [RESOURCE_CELLS_CLASS, resData[i].resourceData.ClassName];
            addClass([ntd], classCollection);
            let args = { elementType: 'resourceHeader', element: ntd, groupIndex: resData[i].groupIndex };
            this.parent.trigger(renderCell, args);
            let ntr = tr.cloneNode();
            ntr.appendChild(ntd);
            resRows.push(ntr);
        }
        return resRows;
    }
    setMargin(element, value) {
        if (!this.parent.enableRtl) {
            element.style.marginLeft = value;
        }
        else {
            element.style.marginRight = value;
        }
    }
    countCalculation(parentCollection, wholeCollection) {
        let collection;
        for (let y = 0; y < parentCollection.length; y++) {
            let data = parentCollection[parentCollection.length - (y + 1)]
                .dataSource;
            for (let x = 0; x < data.length; x++) {
                let totalCount = 0;
                if (this.parent.activeViewOptions.group.byGroupID) {
                    collection = new DataManager(wholeCollection[wholeCollection.length - 1].dataSource)
                        .executeLocal(new Query().where(wholeCollection[wholeCollection.length - 1].groupIDField, 'equal', data[x][parentCollection[parentCollection.length - (y + 1)].idField]));
                }
                else {
                    collection = wholeCollection[wholeCollection.length - 1].dataSource;
                }
                for (let z = 0; z < collection.length; z++) {
                    totalCount = totalCount + parseInt(collection[z].Count, 0);
                }
                totalCount = totalCount + parseInt(data[x].Count, 0);
                extend(data[x], { Count: totalCount });
            }
            wholeCollection = wholeCollection.slice(0, -1);
        }
    }
    onTreeIconClick(e) {
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.close();
        }
        let target = e.target;
        let hide;
        let trElement = closest(target, '.' + RESOURCE_PARENT_CLASS)
            .parentElement;
        let index = parseInt(trElement.children[0].getAttribute('data-group-index'), 10);
        let args = {
            cancel: false, event: e, groupIndex: index,
            requestType: !target.classList.contains(RESOURCE_COLLAPSE_CLASS) ? 'resourceExpand' : 'resourceCollapse',
        };
        this.parent.trigger(actionBegin, args);
        if (args.cancel) {
            return;
        }
        if (target.classList.contains(RESOURCE_COLLAPSE_CLASS)) {
            classList(target, [RESOURCE_EXPAND_CLASS], [RESOURCE_COLLAPSE_CLASS]);
            hide = true;
        }
        else {
            classList(target, [RESOURCE_COLLAPSE_CLASS], [RESOURCE_EXPAND_CLASS]);
            hide = false;
        }
        let eventElements = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
        for (let i = 0; i < eventElements.length; i++) {
            remove(eventElements[i]);
        }
        if (this.parent.virtualScrollModule) {
            this.updateVirtualContent(index, hide);
        }
        else {
            this.updateContent(index, hide);
        }
        let data = { cssProperties: this.parent.getCssProperties(), module: 'scroll' };
        this.parent.notify(scrollUiUpdate, data);
        args = {
            cancel: false, event: e, groupIndex: index,
            requestType: target.classList.contains(RESOURCE_COLLAPSE_CLASS) ? 'resourceExpanded' : 'resourceCollapsed',
        };
        this.parent.notify(dataReady, {});
        this.parent.trigger(actionComplete, args);
    }
    updateContent(index, hide) {
        let rowCollection = [];
        let workCellCollection = [];
        let headerRowCollection = [];
        let pNode;
        let clickedRes = this.lastResourceLevel[index].resourceData;
        let resRows = [].slice.call(this.parent.element.querySelectorAll('.' + RESOURCE_COLUMN_WRAP_CLASS + ' ' + 'tr'));
        let contentRows = [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_WRAP_CLASS + ' ' + 'tbody tr'));
        let eventRows = [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_WRAP_CLASS + ' .' + APPOINTMENT_CONTAINER_CLASS));
        for (let j = 0; j < clickedRes.Count; j++) {
            rowCollection.push(resRows[index + j + 1]);
            workCellCollection.push(contentRows[index + j + 1]);
            headerRowCollection.push(eventRows[index + j + 1]);
        }
        let clonedCollection = this.lastResourceLevel;
        for (let i = 0; i < rowCollection.length; i++) {
            let expanded = true;
            pNode = rowCollection[i].children[0].classList.contains(RESOURCE_PARENT_CLASS);
            clonedCollection[index].resourceData[clonedCollection[index].resource.expandedField] = !hide;
            if (hide) {
                if (pNode) {
                    let trElem = rowCollection[i].querySelector('.' + RESOURCE_TREE_ICON_CLASS);
                    classList(trElem, [RESOURCE_EXPAND_CLASS], [RESOURCE_COLLAPSE_CLASS]);
                }
                if (!rowCollection[i].classList.contains(HIDDEN_CLASS)) {
                    addClass([rowCollection[i], workCellCollection[i], headerRowCollection[i]], HIDDEN_CLASS);
                }
            }
            else {
                if (pNode) {
                    let rowIndex = rowCollection[i].rowIndex;
                    if (!clonedCollection[rowIndex].resourceData[clonedCollection[rowIndex].resource.expandedField]
                        && !isNullOrUndefined(clonedCollection[rowIndex].resourceData[clonedCollection[rowIndex].resource.expandedField])) {
                        rowCollection.splice(i + 1, (parseInt(clonedCollection[rowIndex].resourceData.Count, 0)));
                        workCellCollection.splice(i + 1, (parseInt(clonedCollection[rowIndex].resourceData.Count, 0)));
                        headerRowCollection.splice(i + 1, (parseInt(clonedCollection[rowIndex].resourceData.Count, 0)));
                        expanded = false;
                    }
                    if (expanded) {
                        let trElem = rowCollection[i].querySelector('.' + RESOURCE_TREE_ICON_CLASS);
                        classList(trElem, [RESOURCE_COLLAPSE_CLASS], [RESOURCE_EXPAND_CLASS]);
                    }
                }
                if (rowCollection[i].classList.contains(HIDDEN_CLASS)) {
                    removeClass([rowCollection[i], workCellCollection[i], headerRowCollection[i]], HIDDEN_CLASS);
                }
            }
        }
    }
    updateVirtualContent(index, expand) {
        this.lastResourceLevel[index].resourceData[this.lastResourceLevel[index].resource.expandedField] = !expand;
        this.setExpandedResources();
        let resourceCount = this.parent.virtualScrollModule.getRenderedCount();
        let startIndex = this.expandedResources.indexOf(this.renderedResources[0]);
        this.renderedResources = this.expandedResources.slice(startIndex, startIndex + resourceCount);
        if (this.renderedResources.length < resourceCount) {
            let sIndex = this.expandedResources.length - resourceCount;
            sIndex = (sIndex > 0) ? sIndex : 0;
            this.renderedResources = this.expandedResources.slice(sIndex, this.expandedResources.length);
        }
        let virtualTrack = this.parent.element.querySelector('.' + VIRTUAL_TRACK_CLASS);
        this.parent.virtualScrollModule.updateVirtualTrackHeight(virtualTrack);
        let resTable = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS + ' ' + 'table');
        let contentTable = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS + ' ' + 'table');
        let eventTable = this.parent.element.querySelector('.' + EVENT_TABLE_CLASS);
        this.parent.virtualScrollModule.updateContent(resTable, contentTable, eventTable, this.renderedResources);
        let timeIndicator = this.parent.element.querySelector('.' + CURRENT_TIMELINE_CLASS);
        if (!isNullOrUndefined(timeIndicator)) {
            timeIndicator.style.height =
                this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS).offsetHeight + 'px';
        }
    }
    renderResourceHeader() {
        let resourceWrapper = createElement('div', { className: RESOURCE_TOOLBAR_CONTAINER });
        resourceWrapper.innerHTML = '<div class="' + RESOURCE_HEADER_TOOLBAR + '"><div class="' + RESOURCE_MENU + '">' +
            '<div class="e-icons ' + RESOURCE_MENU_ICON + '"></div></div><div class="' + RESOURCE_LEVEL_TITLE + '"></div></div>';
        if (this.parent.currentView === 'MonthAgenda') {
            let target = this.parent.activeView.getPanel().querySelector('.' + CONTENT_WRAP_CLASS);
            target.insertBefore(resourceWrapper, target.children[1]);
        }
        else {
            this.parent.element.insertBefore(resourceWrapper, this.parent.element.children[2]);
        }
        this.renderResourceHeaderText();
        EventHandler.add(resourceWrapper.querySelector('.' + RESOURCE_MENU_ICON), 'click', this.menuClick, this);
    }
    renderResourceTree() {
        this.popupOverlay = createElement('div', { className: RESOURCE_TREE_POPUP_OVERLAY });
        let treeWrapper = createElement('div', { className: RESOURCE_TREE_POPUP + ' e-popup-close' });
        if (this.parent.currentView === 'MonthAgenda') {
            let target = this.parent.activeView.getPanel().querySelector('.' + WRAPPER_CONTAINER_CLASS);
            target.insertBefore(treeWrapper, target.children[0]);
            target.appendChild(this.popupOverlay);
        }
        else {
            this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS).appendChild(treeWrapper);
            this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS).appendChild(this.popupOverlay);
        }
        let resourceTree = createElement('div', { className: RESOURCE_TREE });
        treeWrapper.appendChild(resourceTree);
        this.treeViewObj = new TreeView({
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            fields: {
                dataSource: this.generateTreeData(),
                id: 'resourceId',
                text: 'resourceName',
                child: 'resourceChild'
            },
            nodeTemplate: this.parent.resourceHeaderTemplate,
            nodeClicked: this.resourceClick.bind(this)
        });
        this.treeViewObj.appendTo(resourceTree);
        this.treeViewObj.expandAll();
        this.treePopup = new Popup(treeWrapper, {
            targetType: 'relative',
            actionOnScroll: 'none',
            content: this.treeViewObj.element,
            enableRtl: this.parent.enableRtl,
            hideAnimation: { name: 'SlideLeftOut', duration: 500 },
            showAnimation: { name: 'SlideLeftIn', duration: 500 },
            viewPortElement: this.parent.element.querySelector('.' + (this.parent.currentView === 'MonthAgenda' ?
                WRAPPER_CONTAINER_CLASS : TABLE_CONTAINER_CLASS))
        });
        this.parent.on(documentClick, this.documentClick, this);
    }
    generateTreeData(isTimeLine) {
        let treeCollection = [];
        let resTreeColl = [];
        let groupIndex = 0;
        this.resourceTreeLevel.forEach((resTree, index) => {
            let treeHandler = (treeLevel, index, levelId) => {
                let resource = this.resourceCollection[index];
                let treeArgs;
                let resObj;
                if (!isTimeLine) {
                    treeArgs = {
                        resourceId: levelId,
                        resourceName: treeLevel.resourceData[resource.textField]
                    };
                }
                else {
                    resObj = {
                        type: 'resourceHeader', resource: treeLevel.resource,
                        resourceData: treeLevel.resourceData, groupIndex: groupIndex,
                        groupOrder: treeLevel.groupOrder
                    };
                    resTreeColl.push(resObj);
                    groupIndex++;
                }
                if (treeLevel.child.length > 0 && !isTimeLine) {
                    treeArgs.resourceChild = [];
                }
                let count = 1;
                for (let tree of treeLevel.child) {
                    if (!isTimeLine) {
                        treeArgs.resourceChild.push(treeHandler(tree, index + 1, levelId + '-' + count));
                    }
                    else {
                        treeHandler(tree, index + 1, levelId + '-' + count);
                    }
                    count += 1;
                }
                if (isTimeLine) {
                    extend(resObj.resourceData, { Count: count - 1 });
                }
                return treeArgs;
            };
            if (!isTimeLine) {
                treeCollection.push(treeHandler(resTree, 0, (index + 1).toString()));
            }
            else {
                treeHandler(resTree, 0, (index + 1).toString());
            }
        });
        if (isTimeLine) {
            this.lastResourceLevel = resTreeColl;
            return resTreeColl;
        }
        else {
            return treeCollection;
        }
    }
    renderResourceHeaderText() {
        let resource = this.lastResourceLevel[this.parent.uiStateValues.groupIndex];
        let headerCollection = [];
        resource.groupOrder.forEach((level, index) => {
            let resourceLevel = this.resourceCollection[index];
            let resourceText = resourceLevel.dataSource.filter((resData) => resData[resourceLevel.idField] === level);
            let resourceName = createElement('div', {
                className: RESOURCE_NAME,
                innerHTML: resourceText[0][resourceLevel.textField]
            });
            headerCollection.push(resourceName);
            let levelIcon = createElement('div', { className: 'e-icons e-icon-next' });
            headerCollection.push(levelIcon);
        });
        headerCollection.pop();
        let target = (this.parent.currentView === 'MonthAgenda') ? this.parent.activeView.getPanel() : this.parent.element;
        let headerWrapper = target.querySelector('.' + RESOURCE_LEVEL_TITLE);
        headerWrapper.innerHTML = '';
        headerCollection.forEach((element) => headerWrapper.appendChild(element));
        if (this.lastResourceLevel.length === 1) {
            addClass([this.parent.element.querySelector('.' + RESOURCE_MENU)], DISABLE_CLASS);
        }
    }
    menuClick(event) {
        if (this.parent.element.querySelector('.' + RESOURCE_TREE_POPUP).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
        else {
            let treeNodes = this.treeViewObj.element.querySelectorAll('.e-list-item:not(.e-has-child)');
            removeClass(treeNodes, 'e-active');
            addClass([treeNodes[this.parent.uiStateValues.groupIndex]], 'e-active');
            this.treePopup.show();
            addClass([this.popupOverlay], 'e-enable');
        }
    }
    resourceClick(event) {
        if (!event.node.classList.contains('e-has-child')) {
            this.treePopup.hide();
            let treeNodes = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item:not(.e-has-child)'));
            this.parent.uiStateValues.groupIndex = treeNodes.indexOf(event.node);
            this.parent.renderModule.render(this.parent.currentView, false);
            let processed = this.parent.eventBase.processData(this.parent.eventsData);
            this.parent.notify(dataReady, { processedData: processed });
        }
        event.event.preventDefault();
    }
    documentClick(args) {
        if (closest(args.event.target, '.' + RESOURCE_TREE_POPUP)) {
            return;
        }
        let treeWrapper = this.parent.element.querySelector('.' + RESOURCE_TREE_POPUP);
        if (treeWrapper && treeWrapper.classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
    }
    bindResourcesData(isSetModel) {
        this.parent.showSpinner();
        let promises = [];
        for (let i = 0; i < this.parent.resources.length; i++) {
            let dataModule = new Data(this.parent.resources[i].dataSource, this.parent.resources[i].query);
            promises.push(dataModule.getData(dataModule.generateQuery()));
        }
        Promise.all(promises).then((e) => this.dataManagerSuccess(e, isSetModel))
            .catch((e) => this.dataManagerFailure(e));
    }
    dataManagerSuccess(e, isSetModel) {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.resourceCollection = [];
        for (let i = 0, length = e.length; i < length; i++) {
            let resource = this.parent.resources[i];
            let resourceObj = this.getResourceModel(resource, e[i].result);
            this.parent.resourceCollection.push(resourceObj);
        }
        this.refreshLayout(isSetModel);
    }
    getResourceModel(resource, resourceData) {
        let resourceObj = {
            field: resource.field,
            title: resource.title,
            name: resource.name,
            allowMultiple: resource.allowMultiple,
            dataSource: resourceData || resource.dataSource,
            idField: resource.idField,
            textField: resource.textField,
            groupIDField: resource.groupIDField,
            colorField: resource.colorField,
            startHourField: resource.startHourField,
            endHourField: resource.endHourField,
            workDaysField: resource.workDaysField,
            expandedField: resource.expandedField,
            cssClassField: resource.cssClassField
        };
        return resourceObj;
    }
    refreshLayout(isSetModel) {
        this.parent.uiStateValues.groupIndex = 0;
        this.parent.renderElements(isSetModel);
        if (isSetModel) {
            this.parent.eventWindow.refresh();
        }
    }
    setResourceCollection() {
        let requiredResources = [];
        this.resourceCollection = [];
        this.colorIndex = null;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            for (let resource of this.parent.activeViewOptions.group.resources) {
                let index = findIndexInData(this.parent.resourceCollection, 'name', resource);
                if (index >= 0) {
                    requiredResources.push(this.parent.resourceCollection[index]);
                }
            }
        }
        else if (this.parent.resourceCollection.length > 0) {
            requiredResources = this.parent.resourceCollection;
        }
        let index = 0;
        for (let resource of requiredResources) {
            let resources = this.getResourceModel(resource);
            if (resource.name === this.parent.eventSettings.resourceColorField) {
                this.colorIndex = index;
            }
            index++;
            this.resourceCollection.push(resources);
        }
        if (isNullOrUndefined(this.colorIndex)) {
            this.colorIndex = this.resourceCollection.length - 1;
        }
    }
    generateResourceLevels(innerDates, isTimeLine) {
        let resources = this.resourceCollection;
        let resTreeGroup = [];
        let lastColumnDates = [];
        let group = (resources, index, prevResource, prevResourceData, prevOrder) => {
            let resTree = [];
            let resource = resources[0];
            if (resource) {
                let data;
                if (prevResourceData && this.parent.activeViewOptions.group.byGroupID) {
                    let id = prevResourceData[prevResource.idField];
                    data = new DataManager(resource.dataSource).executeLocal(new Query().where(resource.groupIDField, 'equal', id));
                }
                else {
                    data = resource.dataSource;
                }
                for (let i = 0; i < data.length; i++) {
                    let groupOrder = [];
                    if (prevOrder && prevOrder.length > 0) {
                        groupOrder = groupOrder.concat(prevOrder);
                    }
                    groupOrder.push(data[i][resource.idField]);
                    let items = group(resources.slice(1), index + 1, resource, data[i], groupOrder);
                    // Here validate child item empty top level resource only
                    if (index === 0 && items.length === 0 && this.resourceCollection.length > 1) {
                        continue;
                    }
                    let dateCol = [];
                    let renderDates = this.parent.activeView.renderDates;
                    let resWorkDays;
                    if (!this.parent.activeViewOptions.group.byDate && index + 1 === this.resourceCollection.length) {
                        let workDays = data[i][resource.workDaysField];
                        let resStartHour = data[i][resource.startHourField];
                        let resEndHour = data[i][resource.endHourField];
                        if (workDays && workDays.length > 0) {
                            renderDates = this.parent.activeView.getRenderDates(workDays);
                            resWorkDays = workDays;
                            dateCol = this.parent.activeView.getDateSlots(renderDates, workDays);
                        }
                        else {
                            resWorkDays = this.parent.activeViewOptions.workDays;
                            dateCol = innerDates;
                        }
                        let dateSlots = this.generateCustomHours(dateCol, resStartHour, resEndHour, groupOrder);
                        lastColumnDates = lastColumnDates.concat(dateSlots);
                    }
                    let resCssClass = data[i][resource.cssClassField];
                    let slotData = {
                        type: 'resourceHeader', className: ['e-resource-cells'],
                        resourceLevelIndex: index, groupOrder: groupOrder,
                        resource: resource, resourceData: data[i],
                        colSpan: this.parent.activeViewOptions.group.byDate ? 1 : dateCol.length,
                        renderDates: renderDates, workDays: resWorkDays, cssClass: resCssClass,
                        child: items
                    };
                    resTree.push(slotData);
                }
                if (!resTreeGroup[index]) {
                    resTreeGroup[index] = [];
                }
                resTreeGroup[index].push(resTree);
                return resTree;
            }
            return [];
        };
        this.resourceTreeLevel = group(resources, 0);
        return (isTimeLine) ? [] : this.generateHeaderLevels(resTreeGroup, lastColumnDates, innerDates);
    }
    generateCustomHours(renderDates, startHour, endHour, groupOrder) {
        let dateSlots = extend([], renderDates, null, true);
        for (let dateSlot of dateSlots) {
            if (startHour) {
                dateSlot.startHour = this.parent.getStartEndTime(startHour);
            }
            if (endHour) {
                dateSlot.endHour = this.parent.getStartEndTime(endHour);
            }
            if (groupOrder) {
                dateSlot.groupOrder = groupOrder;
            }
        }
        return dateSlots;
    }
    generateHeaderLevels(resTreeGroup, lastColumnDates, headerDates) {
        let headerLevels = [];
        for (let i = resTreeGroup.length - 1; i >= 0; i--) {
            let temp = 0;
            for (let currentLevelChilds of resTreeGroup[i]) {
                for (let currentLevelChild of currentLevelChilds) {
                    if (resTreeGroup[i + 1]) {
                        let nextLevelChilds = resTreeGroup[i + 1][temp];
                        let colSpan = 0;
                        for (let nextLevelChild of nextLevelChilds) {
                            if (!this.parent.activeViewOptions.group.byGroupID || (this.parent.activeViewOptions.group.byGroupID &&
                                nextLevelChild.resourceData[nextLevelChild.resource.groupIDField] ===
                                    currentLevelChild.resourceData[currentLevelChild.resource.idField])) {
                                colSpan += nextLevelChild.colSpan;
                            }
                        }
                        currentLevelChild.colSpan = colSpan;
                    }
                    currentLevelChild.groupIndex = temp;
                    temp++;
                    headerLevels[currentLevelChild.resourceLevelIndex] = headerLevels[currentLevelChild.resourceLevelIndex] || [];
                    headerLevels[currentLevelChild.resourceLevelIndex].push(currentLevelChild);
                }
            }
        }
        this.lastResourceLevel = headerLevels.slice(-1)[0] || [];
        if (!this.parent.activeViewOptions.group.byDate) {
            let index = 0;
            for (let lastLevelResource of this.lastResourceLevel) {
                for (let i = 0; i < lastLevelResource.colSpan; i++) {
                    lastColumnDates[index].groupIndex = lastLevelResource.groupIndex;
                    index++;
                }
            }
            headerLevels.push(lastColumnDates);
            return headerLevels;
        }
        let dateHeaderLevels = [];
        let levels = extend([], headerLevels, null, true);
        let dateColSpan = 0;
        for (let firstRowTd of levels[0]) {
            dateColSpan += firstRowTd.colSpan;
        }
        let datesColumn = [];
        for (let headerDate of headerDates) {
            headerDate.colSpan = dateColSpan;
            datesColumn.push(headerDate);
            let resGroup = extend([], levels, null, true);
            for (let k = 0, length = resGroup.length; k < length; k++) {
                if (k === resGroup.length - 1) {
                    for (let resTd of resGroup[k]) {
                        resTd.date = headerDate.date;
                        resTd.workDays = headerDate.workDays;
                        resTd.startHour = headerDate.startHour;
                        resTd.endHour = headerDate.endHour;
                    }
                }
                if (!dateHeaderLevels[k]) {
                    dateHeaderLevels[k] = [];
                }
                dateHeaderLevels[k] = dateHeaderLevels[k].concat(resGroup[k]);
            }
        }
        dateHeaderLevels.unshift(datesColumn);
        return dateHeaderLevels;
    }
    setResourceValues(eventObj, isCrud, groupIndex) {
        let setValues = (index, field, value) => {
            if (this.resourceCollection[index].allowMultiple && (!isCrud || isCrud && this.parent.activeViewOptions.group.allowGroupEdit)) {
                eventObj[field] = [value];
            }
            else {
                eventObj[field] = value;
            }
        };
        if (groupIndex === void 0) {
            groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                this.parent.activeCellsData.groupIndex;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(groupIndex)) {
            let groupOrder = this.lastResourceLevel[groupIndex].groupOrder;
            for (let index = 0; index < this.resourceCollection.length; index++) {
                setValues(index, this.resourceCollection[index].field, groupOrder[index]);
            }
        }
        else if (this.parent.resourceCollection.length > 0) {
            for (let index = 0; index < this.resourceCollection.length; index++) {
                let data = this.resourceCollection[index].dataSource[0];
                if (data) {
                    setValues(index, this.resourceCollection[index].field, data[this.resourceCollection[index].idField]);
                }
            }
        }
    }
    getResourceColor(eventObj, groupOrder) {
        this.colorIndex = (this.parent.activeView.isTimelineView() && !isNullOrUndefined(groupOrder)) ?
            groupOrder.length - 1 : this.colorIndex;
        let resource = this.resourceCollection[this.colorIndex];
        if (isNullOrUndefined(groupOrder) && this.parent.activeViewOptions.group.allowGroupEdit && resource.allowMultiple) {
            return undefined;
        }
        let id = isNullOrUndefined(groupOrder) ? eventObj[resource.field] : groupOrder[this.colorIndex];
        let data = this.filterData(resource.dataSource, resource.idField, 'equal', id);
        if (data.length > 0) {
            return data[0][resource.colorField];
        }
        return undefined;
    }
    getCssClass(eventObj) {
        let resource = this.resourceCollection.slice(-1)[0];
        if (this.parent.activeViewOptions.group.allowGroupEdit && resource.allowMultiple) {
            return undefined;
        }
        let data = this.filterData(resource.dataSource, resource.idField, 'equal', eventObj[resource.field]);
        if (data.length > 0) {
            return data[0][resource.cssClassField];
        }
        return undefined;
    }
    filterData(dataSource, field, operator, value) {
        return new DataManager(dataSource).executeLocal(new Query().where(field, operator, value));
    }
    dataManagerFailure(e) {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(actionFailure, { error: e });
        this.parent.hideSpinner();
    }
    getResourceData(eventObj, index, groupEditIndex) {
        if (this.parent.activeViewOptions.group.allowGroupEdit) {
            let resourceObj = {};
            for (let groupIndex of groupEditIndex) {
                let resourceLevel = this.lastResourceLevel[groupIndex].groupOrder;
                for (let level = 0, length = resourceLevel.length; level < length; level++) {
                    let fieldName = this.resourceCollection[level].field;
                    if (isNullOrUndefined(resourceObj[fieldName])) {
                        resourceObj[fieldName] = [];
                    }
                    resourceObj[fieldName].push(resourceLevel[level]);
                }
            }
            eventObj = extend(eventObj, resourceObj);
        }
        else {
            for (let level = 0, length = this.resourceCollection.length; level < length; level++) {
                eventObj[this.resourceCollection[level].field] = this.lastResourceLevel[index].groupOrder[level];
            }
        }
    }
    addResource(resources, name, index) {
        let resourceCollection = (resources instanceof Array) ? resources : [resources];
        for (let resource of this.parent.resourceCollection) {
            if (resource.name === name) {
                resourceCollection.forEach((addObj, i) => new DataManager({ json: resource.dataSource }).insert(addObj, null, null, index + i));
                break;
            }
        }
        this.refreshLayout(true);
    }
    removeResource(resourceId, name) {
        let resourceCollection = (resourceId instanceof Array) ? resourceId : [resourceId];
        for (let resource of this.parent.resourceCollection) {
            if (resource.name === name) {
                resourceCollection.forEach((removeObj) => new DataManager({ json: resource.dataSource }).remove(resource.idField, removeObj));
                break;
            }
        }
        this.refreshLayout(true);
    }
    destroy() {
        this.parent.off(documentClick, this.documentClick);
        if (this.treeViewObj) {
            this.treeViewObj.destroy();
            this.treeViewObj = null;
        }
        if (this.treePopup) {
            this.treePopup.destroy();
            this.treePopup = null;
            remove(this.parent.element.querySelector('.' + RESOURCE_TREE_POPUP));
            remove(this.parent.element.querySelector('.' + RESOURCE_TREE_POPUP_OVERLAY));
        }
        let resToolBarEle = this.parent.element.querySelector('.' + RESOURCE_TOOLBAR_CONTAINER);
        if (resToolBarEle) {
            remove(resToolBarEle);
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
 * Represents the Schedule component that displays a list of events scheduled against specific date and timings,
 * thus helping us to plan and manage it properly.
 * ```html
 * <div id="schedule"></div>
 * ```
 * ```typescript
 * <script>
 *   var scheduleObj = new Schedule();
 *   scheduleObj.appendTo("#schedule");
 * </script>
 * ```
 */
let Schedule = class Schedule extends Component {
    /**
     * Constructor for creating the Schedule widget
     * @hidden
     */
    constructor(options, element) {
        super(options, element);
    }
    /**
     * Core method that initializes the control rendering.
     * @private
     */
    render() {
        let addClasses = [];
        let removeClasses = [];
        addClasses.push(ROOT);
        if (this.enableRtl) {
            addClasses.push(RTL);
        }
        else {
            removeClasses.push(RTL);
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
        this.validateDate();
        this.eventTooltipTemplateFn = this.templateParser(this.eventSettings.tooltipTemplate);
        this.editorTemplateFn = this.templateParser(this.editorTemplate);
        this.quickInfoTemplatesHeaderFn = this.templateParser(this.quickInfoTemplates.header);
        this.quickInfoTemplatesContentFn = this.templateParser(this.quickInfoTemplates.content);
        this.quickInfoTemplatesFooterFn = this.templateParser(this.quickInfoTemplates.footer);
        createSpinner({ target: this.element });
        this.scrollModule = new Scroll(this);
        this.scrollModule.setWidth();
        this.scrollModule.setHeight();
        this.renderModule = new Render(this);
        this.eventBase = new EventBase(this);
        this.initializeDataModule();
        this.element.appendChild(this.createElement('div', { className: TABLE_CONTAINER_CLASS }));
        this.activeViewOptions = this.getActiveViewOptions();
        this.initializeResources();
    }
    initializeResources(isSetModel = false) {
        if (this.resources.length > 0) {
            this.resourceBase = new ResourceBase(this);
            this.resourceBase.bindResourcesData(isSetModel);
        }
        else {
            this.resourceBase = null;
            this.renderElements(isSetModel);
            if (isSetModel) {
                this.eventWindow.refresh();
            }
        }
    }
    renderElements(isLayoutOnly) {
        if (isLayoutOnly) {
            this.initializeView(this.currentView);
            return;
        }
        this.destroyHeaderModule();
        if (this.showHeaderBar) {
            this.headerModule = new HeaderRenderer(this);
        }
        if (!this.element.querySelector('.' + TABLE_CONTAINER_CLASS)) {
            this.element.appendChild(this.createElement('div', { className: TABLE_CONTAINER_CLASS }));
        }
        if (Browser.isDevice || Browser.isTouch) {
            this.scheduleTouchModule = new ScheduleTouch(this);
        }
        this.initializeView(this.currentView);
        this.destroyPopups();
        this.initializePopups();
        this.unwireEvents();
        this.wireEvents();
    }
    validateDate() {
        // persist the selected date value
        this.setProperties({ selectedDate: new Date('' + this.selectedDate) }, true);
    }
    getViewIndex(viewName) {
        for (let item = 0; item < this.viewCollections.length; item++) {
            let checkIndex = this.viewCollections[item].option;
            if (checkIndex === viewName) {
                return item;
            }
        }
        return -1;
    }
    setViewOptions(isModuleLoad = false) {
        this.viewOptions = {};
        this.viewCollections = [];
        let viewName;
        let selectedView;
        let count = 0;
        this.viewIndex = -1;
        for (let view of this.views) {
            let isOptions = (typeof view === 'string') ? false : true;
            if (typeof view === 'string') {
                viewName = view;
                if (this.currentView === viewName) {
                    selectedView = viewName;
                    this.viewIndex = count;
                }
            }
            else {
                viewName = view.option;
                if (view.isSelected) {
                    selectedView = viewName;
                    this.viewIndex = count;
                }
            }
            let obj = extend({ option: viewName }, isOptions ? view : {});
            let fieldViewName = viewName.charAt(0).toLowerCase() + viewName.slice(1);
            this.viewCollections.push(obj);
            if (isNullOrUndefined(this.viewOptions[fieldViewName])) {
                this.viewOptions[fieldViewName] = [obj];
            }
            else {
                this.viewOptions[fieldViewName].push(obj);
            }
            count++;
        }
        if (!isModuleLoad && selectedView) {
            this.setProperties({ currentView: selectedView }, true);
        }
        if (this.viewIndex === -1) {
            let currentIndex = this.getViewIndex(this.currentView);
            this.viewIndex = (currentIndex === -1) ? 0 : currentIndex;
        }
    }
    getActiveViewOptions() {
        let timeScale = {
            enable: this.timeScale.enable,
            interval: this.timeScale.interval,
            slotCount: this.timeScale.slotCount,
            majorSlotTemplate: this.timeScale.majorSlotTemplate,
            minorSlotTemplate: this.timeScale.minorSlotTemplate
        };
        let group = {
            byDate: this.group.byDate,
            byGroupID: this.group.byGroupID,
            allowGroupEdit: this.group.allowGroupEdit,
            resources: this.group.resources,
            headerTooltipTemplate: this.group.headerTooltipTemplate,
            enableCompactView: this.group.enableCompactView
        };
        let workDays = this.viewCollections[this.viewIndex].workDays ? [] : this.workDays;
        let scheduleOptions = {
            dateFormat: this.dateFormat,
            endHour: this.endHour,
            isSelected: false,
            option: null,
            readonly: this.readonly,
            startHour: this.startHour,
            allowVirtualScrolling: false,
            cellTemplate: this.cellTemplate,
            eventTemplate: this.eventSettings.template,
            dateHeaderTemplate: this.dateHeaderTemplate,
            resourceHeaderTemplate: this.resourceHeaderTemplate,
            workDays: workDays,
            showWeekend: this.showWeekend,
            showWeekNumber: this.showWeekNumber,
            displayName: null,
            interval: 1,
            timeScale: timeScale,
            group: group,
            headerRows: this.headerRows
        };
        return extend(scheduleOptions, this.viewCollections[this.viewIndex], undefined, true);
    }
    initializeDataModule() {
        this.eventFields = {
            id: this.eventSettings.fields.id,
            isBlock: this.eventSettings.fields.isBlock,
            subject: this.eventSettings.fields.subject.name,
            startTime: this.eventSettings.fields.startTime.name,
            endTime: this.eventSettings.fields.endTime.name,
            startTimezone: this.eventSettings.fields.startTimezone.name,
            endTimezone: this.eventSettings.fields.endTimezone.name,
            location: this.eventSettings.fields.location.name,
            description: this.eventSettings.fields.description.name,
            isAllDay: this.eventSettings.fields.isAllDay.name,
            recurrenceID: this.eventSettings.fields.recurrenceID.name,
            recurrenceRule: this.eventSettings.fields.recurrenceRule.name,
            recurrenceException: this.eventSettings.fields.recurrenceException.name,
            isReadonly: this.eventSettings.fields.isReadonly
        };
        this.editorTitles = {
            subject: this.eventSettings.fields.subject.title || this.localeObj.getConstant('title'),
            startTime: this.eventSettings.fields.startTime.title || this.localeObj.getConstant('start'),
            endTime: this.eventSettings.fields.endTime.title || this.localeObj.getConstant('end'),
            isAllDay: this.eventSettings.fields.isAllDay.title || this.localeObj.getConstant('allDay'),
            startTimezone: this.eventSettings.fields.startTimezone.title || this.localeObj.getConstant('startTimezone'),
            endTimezone: this.eventSettings.fields.endTimezone.title || this.localeObj.getConstant('endTimezone'),
            location: this.eventSettings.fields.location.title || this.localeObj.getConstant('location'),
            description: this.eventSettings.fields.description.title || this.localeObj.getConstant('description'),
            recurrenceRule: this.eventSettings.fields.recurrenceRule.title || this.localeObj.getConstant('repeat')
        };
        this.dataModule = new Data(this.eventSettings.dataSource, this.eventSettings.query);
        this.crudModule = new Crud(this);
    }
    initializeView(viewName) {
        this.showSpinner();
        this.activeViewOptions = this.getActiveViewOptions();
        if (this.resourceBase) {
            this.resourceBase.setResourceCollection();
        }
        this.initializeTemplates();
        this.renderModule.render(viewName);
    }
    initializeTemplates() {
        this.cellTemplateFn = this.templateParser(this.activeViewOptions.cellTemplate);
        this.dateHeaderTemplateFn = this.templateParser(this.activeViewOptions.dateHeaderTemplate);
        this.majorSlotTemplateFn = this.templateParser(this.activeViewOptions.timeScale.majorSlotTemplate);
        this.minorSlotTemplateFn = this.templateParser(this.activeViewOptions.timeScale.minorSlotTemplate);
        this.appointmentTemplateFn = this.templateParser(this.activeViewOptions.eventTemplate);
        this.resourceHeaderTemplateFn = this.templateParser(this.activeViewOptions.resourceHeaderTemplate);
        this.headerTooltipTemplateFn = this.templateParser(this.activeViewOptions.group.headerTooltipTemplate);
    }
    initializePopups() {
        this.eventWindow = new EventWindow(this);
        this.quickPopup = new QuickPopups(this);
    }
    getDayNames(type) {
        let culShortNames = [];
        let cldrObj;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = (getValue('days.stand-alone.' + type, getDefaultDateObject(this.getCalendarMode())));
        }
        else {
            cldrObj = (getValue('main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.days.format.' + type, cldrData));
        }
        for (let obj of Object.keys(cldrObj)) {
            culShortNames.push(getValue(obj, cldrObj));
        }
        return culShortNames;
    }
    setCldrTimeFormat() {
        if (this.locale === 'en' || this.locale === 'en-US') {
            this.timeFormat = (getValue('timeFormats.short', getDefaultDateObject(this.getCalendarMode())));
        }
        else {
            this.timeFormat = (getValue('main.' + '' + this.locale + '.dates.calendars.' + this.getCalendarMode() + '.timeFormats.short', cldrData));
        }
    }
    getCalendarMode() {
        return this.calendarMode.toLowerCase();
    }
    getTimeString(date) {
        return this.globalize.formatDate(date, { format: this.timeFormat, type: 'time', calendar: this.getCalendarMode() });
    }
    setCalendarMode() {
        if (this.calendarMode === 'Islamic') {
            this.calendarUtil = new Islamic();
        }
        else {
            this.calendarUtil = new Gregorian();
        }
    }
    changeView(view, event, muteOnChange, index) {
        if (isNullOrUndefined(index)) {
            index = this.getViewIndex(view);
        }
        if (!muteOnChange && index === this.viewIndex || index < 0) {
            return;
        }
        this.viewIndex = index;
        let args = { requestType: 'viewNavigate', cancel: false, event: event };
        this.trigger(actionBegin, args);
        if (args.cancel) {
            return;
        }
        let navArgs = { action: 'view', cancel: false, previousView: this.currentView, currentView: view };
        this.trigger(navigating, navArgs);
        if (navArgs.cancel) {
            return;
        }
        this.setProperties({ currentView: view }, true);
        if (this.headerModule) {
            this.headerModule.updateActiveView();
            this.headerModule.setCalendarView();
        }
        this.initializeView(this.currentView);
        this.animateLayout();
        args = { requestType: 'viewNavigate', cancel: false, event: event };
        this.trigger(actionComplete, args);
    }
    changeDate(selectedDate, event) {
        let args = { requestType: 'dateNavigate', cancel: false, event: event };
        this.trigger(actionBegin, args);
        if (args.cancel) {
            return;
        }
        let navArgs = { action: 'date', cancel: false, previousDate: this.selectedDate, currentDate: selectedDate };
        this.trigger(navigating, navArgs);
        if (navArgs.cancel) {
            return;
        }
        this.setProperties({ selectedDate: selectedDate }, true);
        if (this.headerModule) {
            this.headerModule.setCalendarDate(selectedDate);
        }
        this.initializeView(this.currentView);
        this.animateLayout();
        args = { requestType: 'dateNavigate', cancel: false, event: event };
        this.trigger(actionComplete, args);
    }
    isSelectedDate(date) {
        return date.setHours(0, 0, 0, 0) === new Date('' + this.selectedDate).setHours(0, 0, 0, 0);
    }
    getNavigateView() {
        if (this.activeView.isTimelineView()) {
            return this.currentView === 'TimelineMonth' ? 'TimelineDay' : 'Agenda';
        }
        return 'Day';
    }
    animateLayout() {
        new Animation({ duration: 600, name: 'FadeIn', timingFunction: 'easeIn' }).animate(this.activeView.element);
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        let modules = [];
        this.setViewOptions(true);
        for (let view of Object.keys(this.viewOptions)) {
            view = (view === 'timelineDay' || view === 'timelineWeek' || view === 'timelineWorkWeek') ? 'timelineViews' : view;
            modules.push({
                member: view,
                args: [this]
            });
        }
        if (this.allowDragAndDrop) {
            modules.push({
                member: 'dragAndDrop',
                args: [this]
            });
        }
        if (this.allowResizing) {
            modules.push({
                member: 'resize',
                args: [this]
            });
        }
        modules.push({
            member: 'excelExport',
            args: [this]
        });
        modules.push({
            member: 'iCalendarExport',
            args: [this]
        });
        modules.push({
            member: 'iCalendarImport',
            args: [this]
        });
        return modules;
    }
    /**
     * Initializes the values of private members.
     * @private
     */
    preRender() {
        this.isAdaptive = Browser.isDevice;
        this.globalize = new Internationalization(this.locale);
        this.uiStateValues = {
            expand: false, isInitial: true, left: 0, top: 0, isGroupAdaptive: false,
            isIgnoreOccurrence: false, groupIndex: 0, action: false, isBlock: false
        };
        this.activeCellsData = { startTime: new Date(), endTime: new Date(), isAllDay: false };
        this.activeEventData = { event: undefined, element: undefined };
        this.defaultLocale = {
            day: 'Day',
            week: 'Week',
            workWeek: 'Work Week',
            month: 'Month',
            agenda: 'Agenda',
            weekAgenda: 'Week Agenda',
            workWeekAgenda: 'Work Week Agenda',
            monthAgenda: 'Month Agenda',
            today: 'Today',
            noEvents: 'No events',
            emptyContainer: 'There are no events scheduled on this day.',
            allDay: 'All day',
            start: 'Start',
            end: 'End',
            more: 'more',
            close: 'Close',
            cancel: 'Cancel',
            noTitle: '(No Title)',
            delete: 'Delete',
            deleteEvent: 'Delete Event',
            deleteMultipleEvent: 'Delete Multiple Events',
            selectedItems: 'Items selected',
            deleteSeries: 'Delete Series',
            edit: 'Edit',
            editSeries: 'Edit Series',
            editEvent: 'Edit Event',
            createEvent: 'Create',
            subject: 'Subject',
            addTitle: 'Add title',
            moreDetails: 'More Details',
            save: 'Save',
            editContent: 'Do you want to edit only this event or entire series?',
            deleteRecurrenceContent: 'Do you want to delete only this event or entire series?',
            deleteContent: 'Are you sure you want to delete this event?',
            deleteMultipleContent: 'Are you sure you want to delete the selected events?',
            newEvent: 'New Event',
            title: 'Title',
            location: 'Location',
            description: 'Description',
            timezone: 'Timezone',
            startTimezone: 'Start Timezone',
            endTimezone: 'End Timezone',
            repeat: 'Repeat',
            saveButton: 'Save',
            cancelButton: 'Cancel',
            deleteButton: 'Delete',
            recurrence: 'Recurrence',
            wrongPattern: 'The recurrence pattern is not valid.',
            seriesChangeAlert: 'Do you want to cancel the changes made to specific ' +
                'instances of this series and match it to the whole series again?',
            createError: 'The duration of the event must be shorter than how frequently it occurs. ' +
                'Shorten the duration, or change the recurrence pattern in the recurrence event editor.',
            recurrenceDateValidation: 'Some months have fewer than the selected date. For these months, ' +
                'the occurrence will fall on the last date of the month.',
            sameDayAlert: 'Two occurrences of the same event cannot occur on the same day.',
            editRecurrence: 'Edit Recurrence',
            repeats: 'Repeats',
            alert: 'Alert',
            startEndError: 'The selected end date occurs before the start date.',
            invalidDateError: 'The entered date value is invalid.',
            blockAlert: 'Events cannot be scheduled within the blocked time range.',
            ok: 'Ok',
            yes: 'Yes',
            no: 'No',
            occurrence: 'Occurrence',
            series: 'Series',
            previous: 'Previous',
            next: 'Next',
            timelineDay: 'Timeline Day',
            timelineWeek: 'Timeline Week',
            timelineWorkWeek: 'Timeline Work Week',
            timelineMonth: 'Timeline Month'
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.setCldrTimeFormat();
        this.setCalendarMode();
        this.eventsData = [];
        this.eventsProcessed = [];
        this.blockData = [];
        this.blockProcessed = [];
        this.resourceCollection = [];
        this.currentAction = null;
        this.selectedElements = [];
        this.setViewOptions();
    }
    /**
     * Binding events to the Schedule element.
     * @hidden
     */
    wireEvents() {
        let resize = 'onorientationchange' in window ? 'orientationchange' : 'resize';
        EventHandler.add(window, resize, this.onScheduleResize, this);
        EventHandler.add(document, Browser.touchStartEvent, this.onDocumentClick, this);
        if (this.allowKeyboardInteraction) {
            this.keyboardInteractionModule = new KeyboardInteraction(this);
        }
    }
    removeSelectedClass() {
        let selectedCells = this.getSelectedElements();
        for (let cell of selectedCells) {
            cell.setAttribute('aria-selected', 'false');
            cell.removeAttribute('tabindex');
        }
        removeClass(selectedCells, SELECTED_CELL_CLASS);
    }
    addSelectedClass(cells, focusCell) {
        for (let cell of cells) {
            cell.setAttribute('aria-selected', 'true');
        }
        addClass(cells, SELECTED_CELL_CLASS);
        if (focusCell) {
            focusCell.setAttribute('tabindex', '0');
            focusCell.focus();
        }
    }
    selectCell(element) {
        this.removeSelectedClass();
        this.addSelectedClass([element], element);
    }
    getSelectedElements() {
        return [].slice.call(this.element.querySelectorAll('.' + SELECTED_CELL_CLASS));
    }
    getAllDayRow() {
        return this.element.querySelector('.' + ALLDAY_ROW_CLASS);
    }
    getContentTable() {
        return this.element.querySelector('.' + CONTENT_TABLE_CLASS + ' tbody');
    }
    getTableRows() {
        return [].slice.call(this.element.querySelectorAll('.' + CONTENT_TABLE_CLASS + ' tbody tr:not(.' + HIDDEN_CLASS + ')'));
    }
    getWorkCellElements() {
        return [].slice.call(this.element.querySelectorAll('.' + WORK_CELLS_CLASS));
    }
    getIndexOfDate(collection, date) {
        return collection.map(Number).indexOf(+date);
    }
    isAllDayCell(td) {
        if (this.currentView === 'Month' || this.currentView === 'TimelineMonth' || td.classList.contains(ALLDAY_CELLS_CLASS)
            || td.classList.contains(HEADER_CELLS_CLASS) || !this.activeViewOptions.timeScale.enable) {
            return true;
        }
        if (this.activeViewOptions.headerRows.length > 0 && this.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return true;
        }
        return false;
    }
    getDateFromElement(td) {
        if (!isNullOrUndefined(td.getAttribute('data-date'))) {
            let dateInMS = parseInt(td.getAttribute('data-date'), 10);
            return new Date(dateInMS);
        }
        return undefined;
    }
    getCellTemplate() {
        return this.cellTemplateFn;
    }
    getDateHeaderTemplate() {
        return this.dateHeaderTemplateFn;
    }
    getMajorSlotTemplate() {
        return this.majorSlotTemplateFn;
    }
    getMinorSlotTemplate() {
        return this.minorSlotTemplateFn;
    }
    getAppointmentTemplate() {
        return this.appointmentTemplateFn;
    }
    getEventTooltipTemplate() {
        return this.eventTooltipTemplateFn;
    }
    getHeaderTooltipTemplate() {
        return this.headerTooltipTemplateFn;
    }
    getEditorTemplate() {
        return this.editorTemplateFn;
    }
    getQuickInfoTemplatesHeader() {
        return this.quickInfoTemplatesHeaderFn;
    }
    getQuickInfoTemplatesContent() {
        return this.quickInfoTemplatesContentFn;
    }
    getQuickInfoTemplatesFooter() {
        return this.quickInfoTemplatesFooterFn;
    }
    getResourceHeaderTemplate() {
        return this.resourceHeaderTemplateFn;
    }
    getCssProperties() {
        let cssProps = {
            border: this.enableRtl ? 'borderLeftWidth' : 'borderRightWidth',
            padding: this.enableRtl ? 'paddingLeft' : 'paddingRight'
        };
        return cssProps;
    }
    removeNewEventElement() {
        let eventClone = this.element.querySelector('.' + NEW_EVENT_CLASS);
        if (!isNullOrUndefined(eventClone)) {
            remove(eventClone);
        }
    }
    getStartEndTime(startEndTime) {
        if (!isNullOrUndefined(startEndTime) && startEndTime !== '') {
            let startEndDate = resetTime(new Date());
            let timeString = startEndTime.split(':');
            if (timeString.length === 2) {
                startEndDate.setHours(parseInt(timeString[0], 10), parseInt(timeString[1], 10), 0);
            }
            return startEndDate;
        }
        return null;
    }
    onDocumentClick(args) {
        this.notify(documentClick, { event: args });
    }
    onScheduleResize() {
        if (this.quickPopup) {
            this.quickPopup.onClosePopup();
        }
        if (this.currentView === 'Month' || !this.activeViewOptions.timeScale.enable || this.activeView.isTimelineView()) {
            this.activeView.resetColWidth();
            this.notify(scrollUiUpdate, { cssProperties: this.getCssProperties(), isPreventScrollUpdate: true });
            this.notify(dataReady, {});
        }
    }
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
    boundaryValidation(pageY, pageX) {
        let autoScrollDistance = 30;
        let scrollEdges = { left: false, right: false, top: false, bottom: false };
        let viewBoundaries = this.element.querySelector('.' + CONTENT_WRAP_CLASS).getBoundingClientRect();
        if ((pageY < viewBoundaries.top + autoScrollDistance + window.pageYOffset) &&
            (pageY > viewBoundaries.top + window.pageYOffset)) {
            scrollEdges.top = true;
        }
        if ((pageY > (viewBoundaries.bottom - autoScrollDistance) + window.pageYOffset) &&
            (pageY < viewBoundaries.bottom + window.pageYOffset)) {
            scrollEdges.bottom = true;
        }
        if ((pageX < viewBoundaries.left + autoScrollDistance + window.pageXOffset) &&
            (pageX > viewBoundaries.left + window.pageXOffset)) {
            scrollEdges.left = true;
        }
        if ((pageX > (viewBoundaries.right - autoScrollDistance) + window.pageXOffset) &&
            (pageX < viewBoundaries.right + window.pageXOffset)) {
            scrollEdges.right = true;
        }
        return scrollEdges;
    }
    /**
     * Unbinding events from the element on widget destroy.
     * @hidden
     */
    unwireEvents() {
        let resize = 'onorientationchange' in window ? 'orientationchange' : 'resize';
        EventHandler.remove(window, resize, this.onScheduleResize);
        EventHandler.remove(document, Browser.touchStartEvent, this.onDocumentClick);
        if (this.keyboardInteractionModule) {
            this.keyboardInteractionModule.destroy();
        }
    }
    /**
     * Core method to return the component name.
     * @private
     */
    getModuleName() {
        return 'schedule';
    }
    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData() {
        return this.addOnPersist(['currentView', 'selectedDate']);
    }
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let state = { isRefresh: false, isResource: false, isDate: false, isView: false, isLayout: false, isDataManager: false };
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'views':
                    this.setViewOptions();
                    if (this.headerModule) {
                        this.headerModule.updateItems();
                    }
                    state.isView = true;
                    break;
                case 'currentView':
                    state.isView = true;
                    break;
                case 'selectedDate':
                    state.isDate = true;
                    break;
                case 'dateFormat':
                    this.activeViewOptions = this.getActiveViewOptions();
                    if (this.headerModule) {
                        this.headerModule.updateDateRange(this.activeView.getDateRangeText());
                    }
                    break;
                case 'showHeaderBar':
                    this.destroyHeaderModule();
                    if (newProp.showHeaderBar) {
                        this.headerModule = new HeaderRenderer(this);
                        this.headerModule.updateDateRange(this.activeView.getDateRangeText());
                    }
                    this.notify(scrollUiUpdate, { cssProperties: this.getCssProperties() });
                    if (this.activeView.isTimelineView()) {
                        this.notify(dataReady, {});
                    }
                    break;
                case 'showWeekend':
                case 'workDays':
                case 'startHour':
                case 'endHour':
                case 'workHours':
                case 'readonly':
                case 'headerRows':
                case 'showWeekNumber':
                    state.isLayout = true;
                    break;
                case 'locale':
                case 'calendarMode':
                    this.setCldrTimeFormat();
                    this.setCalendarMode();
                    state.isRefresh = true;
                    break;
                case 'firstDayOfWeek':
                    if (this.headerModule) {
                        this.headerModule.setDayOfWeek(newProp.firstDayOfWeek);
                    }
                    if (this.eventWindow) {
                        this.eventWindow.refreshRecurrenceEditor();
                    }
                    state.isLayout = true;
                    break;
                case 'showTimeIndicator':
                    if (this.activeViewOptions.timeScale.enable && this.activeView) {
                        this.activeView.highlightCurrentTime();
                    }
                    break;
                case 'cellTemplate':
                    this.activeViewOptions.cellTemplate = newProp.cellTemplate;
                    this.cellTemplateFn = this.templateParser(this.activeViewOptions.cellTemplate);
                    state.isLayout = true;
                    break;
                case 'dateHeaderTemplate':
                    this.activeViewOptions.dateHeaderTemplate = newProp.dateHeaderTemplate;
                    this.dateHeaderTemplateFn = this.templateParser(this.activeViewOptions.dateHeaderTemplate);
                    state.isLayout = true;
                    break;
                case 'resourceHeaderTemplate':
                    this.activeViewOptions.resourceHeaderTemplate = newProp.resourceHeaderTemplate;
                    this.resourceHeaderTemplateFn = this.templateParser(this.activeViewOptions.resourceHeaderTemplate);
                    state.isLayout = true;
                    break;
                case 'timezone':
                    this.eventBase.timezonePropertyChange(oldProp.timezone);
                    break;
                case 'enableRtl':
                    state.isRefresh = true;
                    break;
                case 'rowAutoHeight':
                    state.isLayout = true;
                    break;
                default:
                    this.extendedPropertyChange(prop, newProp, oldProp, state);
                    break;
            }
        }
        this.propertyChangeAction(state);
    }
    propertyChangeAction(state) {
        if (state.isRefresh) {
            this.refresh();
        }
        else if (state.isResource) {
            this.initializeResources(true);
        }
        else if (state.isView) {
            this.changeView(this.currentView, null, true);
        }
        else if (state.isDate) {
            this.changeDate(this.selectedDate);
        }
        else if (state.isLayout) {
            this.initializeView(this.currentView);
        }
        else if (state.isDataManager && this.renderModule) {
            this.renderModule.refreshDataManager();
        }
    }
    extendedPropertyChange(prop, newProp, oldProp, state) {
        switch (prop) {
            case 'width':
            case 'height':
                this.notify(uiUpdate, { module: 'scroll', properties: { width: newProp.width, height: newProp.height } });
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.element], oldProp.cssClass);
                }
                if (newProp.cssClass) {
                    addClass([this.element], newProp.cssClass);
                }
                break;
            case 'hideEmptyAgendaDays':
            case 'agendaDaysCount':
                this.activeViewOptions = this.getActiveViewOptions();
                state.isView = true;
                break;
            case 'eventSettings':
                this.onEventSettingsPropertyChanged(newProp.eventSettings, oldProp.eventSettings, state);
                break;
            case 'allowKeyboardInteraction':
                if (this.keyboardInteractionModule) {
                    this.keyboardInteractionModule.destroy();
                    this.keyboardInteractionModule = null;
                }
                if (newProp.allowKeyboardInteraction) {
                    this.keyboardInteractionModule = new KeyboardInteraction(this);
                }
                break;
            case 'editorTemplate':
                if (!isNullOrUndefined(this.editorTemplate)) {
                    this.editorTemplateFn = this.templateParser(this.editorTemplate);
                }
                if (this.eventWindow) {
                    this.eventWindow.setDialogContent();
                }
                break;
            case 'quickInfoTemplates':
                if (this.quickInfoTemplates.header) {
                    this.quickInfoTemplatesHeaderFn = this.templateParser(this.quickInfoTemplates.header);
                }
                if (this.quickInfoTemplates.content) {
                    this.quickInfoTemplatesContentFn = this.templateParser(this.quickInfoTemplates.content);
                }
                if (this.quickInfoTemplates.footer) {
                    this.quickInfoTemplatesFooterFn = this.templateParser(this.quickInfoTemplates.footer);
                }
                break;
            case 'group':
                this.onGroupSettingsPropertyChanged(newProp.group, oldProp.group, state);
                break;
            case 'resources':
                state.isResource = true;
                break;
            case 'timeScale':
                this.activeViewOptions.timeScale.interval = newProp.timeScale.interval || this.activeViewOptions.timeScale.interval;
                this.activeViewOptions.timeScale.slotCount = newProp.timeScale.slotCount || this.activeViewOptions.timeScale.slotCount;
                if (this.eventWindow) {
                    this.eventWindow.refreshDateTimePicker();
                }
                state.isLayout = true;
                break;
            case 'allowDragAndDrop':
            case 'allowResizing':
                this.notify(dataReady, {
                    processedData: this.eventBase.processData(this.eventsData)
                });
                break;
            case 'eventDragArea':
                this.notify(dataReady, {});
                break;
        }
    }
    onGroupSettingsPropertyChanged(newProp, oldProp, state) {
        for (let prop of Object.keys(newProp)) {
            if (prop === 'headerTooltipTemplate') {
                this.headerTooltipTemplateFn = this.templateParser(newProp[prop]);
            }
            else {
                state.isLayout = true;
                if (this.eventWindow) {
                    this.eventWindow.refresh();
                }
            }
        }
    }
    onEventSettingsPropertyChanged(newProp, oldProp, state) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'dataSource':
                case 'query':
                case 'fields':
                    this.initializeDataModule();
                    state.isDataManager = true;
                    break;
                case 'template':
                    this.activeViewOptions.eventTemplate = newProp.template;
                    this.appointmentTemplateFn = this.templateParser(this.activeViewOptions.eventTemplate);
                    state.isDataManager = true;
                    break;
                case 'enableTooltip':
                    if (this.eventTooltip) {
                        this.eventTooltip.destroy();
                        this.eventTooltip = null;
                    }
                    if (newProp.enableTooltip) {
                        this.eventTooltip = new EventTooltip(this);
                    }
                    break;
                case 'tooltipTemplate':
                    this.eventTooltipTemplateFn = this.templateParser(this.eventSettings.tooltipTemplate);
                    break;
                case 'resourceColorField':
                    if (this.resourceBase) {
                        this.resourceBase.setResourceCollection();
                    }
                    state.isDataManager = true;
                    break;
            }
        }
    }
    destroyHeaderModule() {
        if (this.headerModule) {
            this.headerModule.destroy();
            this.headerModule = null;
        }
    }
    destroyPopups() {
        if (this.quickPopup) {
            this.quickPopup.destroy();
            this.quickPopup = null;
        }
        if (this.eventWindow) {
            this.eventWindow.destroy();
            this.eventWindow = null;
        }
    }
    /**
     * Allows to show the spinner on schedule at the required scenarios.
     */
    showSpinner() {
        showSpinner(this.element);
    }
    /**
     * When the spinner is shown manually using `showSpinner` method, it can be hidden using this `hideSpinner` method.
     */
    hideSpinner() {
        hideSpinner(this.element);
    }
    /**
     * Sets different working hours on the required working days by accepting the required start and end time as well as the date collection
     *  as its parameters.
     * @method setWorkHours
     * @param {date} dates Collection of dates on which the given start and end hour range needs to be applied.
     * @param {string} start Defines the work start hour.
     * @param {string} end Defines the work end hour.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {void}
     */
    setWorkHours(dates, start, end, groupIndex) {
        let startHour = this.getStartEndTime(start);
        let endHour = this.getStartEndTime(end);
        let tableEle = this.getContentTable();
        if (isNullOrUndefined(startHour) || isNullOrUndefined(endHour) || !tableEle) {
            return;
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        let viewStartHour = this.activeView.getStartHour();
        if (startHour < viewStartHour) {
            startHour = viewStartHour;
        }
        let viewEndHour = this.activeView.getEndHour();
        if (endHour > viewEndHour) {
            endHour = viewEndHour;
        }
        let msMajorInterval = this.activeViewOptions.timeScale.interval * MS_PER_MINUTE;
        let msInterval = msMajorInterval / this.activeViewOptions.timeScale.slotCount;
        let startIndex = Math.round((startHour.getTime() - viewStartHour.getTime()) / msInterval);
        let endIndex = Math.ceil((endHour.getTime() - viewStartHour.getTime()) / msInterval);
        let cells = [];
        for (let date of dates) {
            resetTime(date);
            let renderDates = this.activeView.renderDates;
            if (!isNullOrUndefined(groupIndex) && this.resourceBase && !this.activeView.isTimelineView()) {
                renderDates = this.resourceBase.lastResourceLevel[groupIndex].renderDates;
            }
            let colIndex = this.getIndexOfDate(renderDates, date);
            if (colIndex >= 0) {
                if (this.activeView.isTimelineView()) {
                    let slotsPerDay = Math.round((viewEndHour.getTime() - viewStartHour.getTime()) / msInterval);
                    startIndex = startIndex + (colIndex * slotsPerDay);
                    endIndex = endIndex + (colIndex * slotsPerDay);
                }
                for (let i = startIndex; i < endIndex; i++) {
                    if (this.activeView.isTimelineView()) {
                        let rowIndex = (!isNullOrUndefined(groupIndex)) ? groupIndex : 0;
                        cells.push(tableEle.rows[rowIndex].cells[i]);
                    }
                    else {
                        if (!isNullOrUndefined(groupIndex)) {
                            let tds = [].slice.call(tableEle.rows[i].querySelectorAll('.' + WORK_CELLS_CLASS + '[data-group-index="' + groupIndex + '"]'));
                            cells.push(tds[colIndex]);
                        }
                        else {
                            cells.push(tableEle.rows[i].cells[colIndex]);
                        }
                    }
                }
            }
        }
        addClass(cells, WORK_HOURS_CLASS);
    }
    /**
     * Retrieves the start and end time information of the specific cell element.
     * @method getCellDetails
     * @param  {Element} td The cell element whose start and end time details are to be retrieved.
     * @returns {CellClickEventArgs} Object An object holding the startTime, endTime and all-day information along with the target HTML
     *  element will be returned.
     */
    getCellDetails(tdCol) {
        let td = (tdCol instanceof Array) ? tdCol : [tdCol];
        let firstTd = td[0];
        let lastTd = td.slice(-1)[0];
        let startTime = this.getDateFromElement(firstTd);
        let endTime = this.getDateFromElement(lastTd);
        if (isNullOrUndefined(startTime) || isNullOrUndefined(endTime)) {
            return undefined;
        }
        let endDateFromColSpan = this.activeView.isTimelineView() && !isNullOrUndefined(lastTd.getAttribute('colSpan')) &&
            this.headerRows.length > 0;
        let duration = endDateFromColSpan ? parseInt(lastTd.getAttribute('colSpan'), 10) : 1;
        if (!this.activeViewOptions.timeScale.enable || endDateFromColSpan || lastTd.classList.contains(ALLDAY_CELLS_CLASS) ||
            lastTd.classList.contains(HEADER_CELLS_CLASS)) {
            endTime = addDays(new Date(startTime.getTime()), duration);
        }
        else {
            endTime = this.activeView.getEndDateFromStartDate(endTime);
        }
        let data = {
            startTime: startTime,
            endTime: endTime,
            isAllDay: this.isAllDayCell(firstTd),
            element: tdCol
        };
        let groupIndex = firstTd.getAttribute('data-group-index');
        if (!isNullOrUndefined(groupIndex)) {
            data.groupIndex = parseInt(groupIndex, 10);
        }
        return data;
    }
    /**
     * Retrieves the resource details based on the provided resource index.
     * @param {number} index index of the resources at the last level.
     * @returns {ResourceDetails} Object An object holding the details of resource and resourceData.
     */
    getResourcesByIndex(index) {
        if (this.resourceBase && this.resourceBase.lastResourceLevel) {
            if (index < 0 || index >= this.resourceBase.lastResourceLevel.length) {
                return undefined;
            }
            let data = this.resourceBase.lastResourceLevel[index];
            let groupData = {};
            this.resourceBase.setResourceValues(groupData, false, index);
            return { resource: data.resource, resourceData: data.resourceData, groupData: groupData };
        }
        return undefined;
    }
    /**
     * Scrolls the Schedule content area to the specified time.
     * @method scrollTo
     * @param {string} hour Accepts the time value in the skeleton format of 'Hm'.
     * @returns {void}
     */
    scrollTo(hour) {
        if (this.activeView.scrollToHour) {
            this.activeView.scrollToHour(hour);
        }
    }
    /**
     * Exports the Scheduler events to a calendar (.ics) file. By default, the calendar is exported with a file name `Calendar.ics`.
     * To change this file name on export, pass the custom string value as `fileName` to get the file downloaded with this provided name.
     * @method exportToICalendar
     * @param {string} fileName Accepts the string value.
     * @returns {void}
     */
    exportToICalendar(fileName) {
        if (this.iCalendarExportModule) {
            this.iCalendarExportModule.initializeCalendarExport(fileName);
        }
        else {
            throw Error('Inject ICalendarExport module');
        }
    }
    /**
     * Imports the events from an .ics file downloaded from any of the calendars like Google or Outlook into the Scheduler.
     * This method accepts the blob object of an .ics file to be imported as a mandatory argument.
     * @method importICalendar
     * @param {Blob} fileContent Accepts the file object.
     * @returns {void}
     */
    importICalendar(fileContent) {
        if (this.iCalendarImportModule) {
            this.iCalendarImportModule.initializeCalendarImport(fileContent);
        }
        else {
            throw Error('Inject ICalendarImport module');
        }
    }
    /**
     * Adds the newly created event into the Schedule dataSource.
     * @method addEvent
     * @param {Object | Object[]} data Single or collection of event objects to be added into Schedule.
     * @returns {void}
     */
    addEvent(data) {
        this.crudModule.addEvent(data);
    }
    /**
     * Allows the Scheduler events data to be exported as an Excel file either in .xlsx or .csv file formats.
     * By default, the whole event collection bound to the Scheduler gets exported as an Excel file.
     * To export only the specific events of Scheduler, you need to pass the custom data collection as
     * a parameter to this `exportToExcel` method. This method accepts the export options as arguments such as fileName,
     * exportType, fields, customData, and includeOccurrences. The `fileName` denotes the name to be given for the exported
     * file and the `exportType` allows you to set the format of an Excel file to be exported either as .xlsx or .csv.
     * The custom or specific field collection of event dataSource to be exported can be provided through `fields` option
     * and the custom data collection can be exported by passing them through the `customData` option. There also exists
     * option to export each individual instances of the recurring events to an Excel file, by setting true or false to the
     * `includeOccurrences` option, denoting either to include or exclude the occurrences as separate instances on an exported Excel file.
     * @method exportToExcel
     * @param  {ExportOptions} excelExportOptions The export options to be set before start with
     * exporting the Scheduler events to an Excel file.
     * @return {void}
     */
    exportToExcel(excelExportOptions) {
        if (this.excelExportModule) {
            this.excelExportModule.initializeExcelExport(excelExportOptions || {});
        }
        else {
            throw Error('Inject ExcelExport module');
        }
    }
    /**
     * Updates the changes made in the event object by passing it as an parameter into the dataSource.
     * @method saveEvent
     * @param {[key: string]: Object} data Single or collection of event objects to be saved into Schedule.
     * @param {CurrentAction} currentAction Denotes the action that takes place either for editing occurrence or series.
     *  The valid current action names are `EditOccurrence` or `EditSeries`.
     * @returns {void}
     */
    saveEvent(data, currentAction) {
        this.crudModule.saveEvent(data, currentAction);
    }
    /**
     * Deletes the events based on the provided ID or event collection in the argument list.
     * @method deleteEvent
     * @param {{[key: string]: Object}} id Single event objects to be removed from the Schedule.
     * @param {{[key: string]: Object }[]} id Collection of event objects to be removed from the Schedule.
     * @param {string | number} id Accepts the ID of the event object which needs to be removed from the Schedule.
     * @param {CurrentAction} currentAction Denotes the delete action that takes place either on occurrence or series events.
     *  The valid current action names are `Delete`, `DeleteOccurrence` or `DeleteSeries`.
     * @returns {void}
     */
    deleteEvent(id, currentAction) {
        this.crudModule.deleteEvent(id, currentAction);
    }
    /**
     * Retrieves the entire collection of events bound to the Schedule.
     * @method getEvents
     * @returns {Object[]} Returns the collection of event objects from the Schedule.
     */
    getEvents(startDate, endDate, includeOccurrences) {
        let eventCollections = [];
        if (includeOccurrences) {
            eventCollections = this.eventBase.getProcessedEvents();
        }
        else {
            eventCollections = this.eventsData;
        }
        eventCollections = this.eventBase.filterEventsByRange(eventCollections, startDate, endDate);
        return eventCollections;
    }
    /**
     * Retrieves the occurrences of a single recurrence event based on the provided parent ID.
     * @method getOccurrencesByID
     * @param {number} eventID ID of the parent recurrence data from which the occurrences are fetched.
     * @returns {Object[]} Returns the collection of occurrence event objects.
     */
    getOccurrencesByID(eventID) {
        return this.eventBase.getOccurrencesByID(eventID);
    }
    /**
     * Retrieves all the occurrences that lies between the specific start and end time range.
     * @method getOccurrencesByRange
     * @param {Date} startTime Denotes the start time range.
     * @param {Date} endTime Denotes the end time range.
     * @returns {Object[]} Returns the collection of occurrence event objects that lies between the provided start and end time.
     */
    getOccurrencesByRange(startTime, endTime) {
        return this.eventBase.getOccurrencesByRange(startTime, endTime);
    }
    /**
     * Retrieves the dates that lies on active view of Schedule.
     * @method getCurrentViewDates
     * @returns {Date[]} Returns the collection of dates.
     */
    getCurrentViewDates() {
        return this.activeView ? this.activeView.renderDates : [];
    }
    /**
     * Retrieves the events that lies on the current date range of the active view of Schedule.
     * @method getCurrentViewEvents
     * @returns {Object[]} Returns the collection of events.
     */
    getCurrentViewEvents() {
        return this.eventsProcessed;
    }
    /**
     * Refreshes the event dataSource. This method may be useful when the events alone in the schedule needs to be re-rendered.
     * @method refreshEvents
     * @returns {void}
     */
    refreshEvents() {
        this.renderModule.refreshDataManager();
    }
    /**
     * To retrieve the appointment object from element.
     * @method getEventDetails
     * @param {Element} element Denotes the event UI element on the Schedule.
     * @returns {Object} Returns the event details.
     */
    getEventDetails(element) {
        let guid = element.getAttribute('data-guid');
        if (guid) {
            return this.eventBase.getEventByGuid(guid);
        }
        return {};
    }
    /**
     * To check whether the given time range slots are available for event creation or already occupied by other events.
     * @method isSlotAvailable
     * @param {Date | Object} startTime Denotes the start time of the slot.
     * @param {Date} endTime Denotes the end time of the slot.
     * @param {number} groupIndex Defines the resource index from last level.
     * @returns {boolean} Returns true, if the slot that lies in the provided time range does not contain any other events.
     */
    isSlotAvailable(startTime, endTime, groupIndex) {
        let eventStart;
        let eventEnd;
        let eventObj = this.activeEventData.event;
        if (startTime instanceof Date) {
            eventStart = startTime;
            eventEnd = endTime;
        }
        else {
            eventObj = startTime;
            eventStart = startTime[this.eventFields.startTime];
            eventEnd = startTime[this.eventFields.endTime];
            if (this.resourceBase) {
                groupIndex = this.eventBase.getGroupIndexFromEvent(startTime);
            }
        }
        if (isNullOrUndefined(eventStart) || isNullOrUndefined(eventEnd)) {
            return true;
        }
        let eventCollection = this.eventBase.filterEvents(eventStart, eventEnd);
        if (!isNullOrUndefined(groupIndex) && this.resourceBase && this.resourceBase.lastResourceLevel.length > 0) {
            eventCollection = this.eventBase.filterEventsByResource(this.resourceBase.lastResourceLevel[groupIndex], eventCollection);
        }
        if (eventObj) {
            if (eventObj.Guid) {
                eventCollection = eventCollection.filter((event) => event.Guid !== eventObj.Guid);
            }
            else {
                eventCollection = eventCollection.filter((event) => event[this.eventFields.id] !== eventObj[this.eventFields.id]);
            }
        }
        return (eventCollection.length > 0) ? false : true;
    }
    /**
     * To manually open the event editor on specific time or on certain events.
     * @method openEditor
     * @param {Object} data It can be either cell data or event data.
     * @param {CurrentAction} action Defines the action for which the editor needs to be opened such as either for new event creation or
     *  for editing of existing events. The applicable action names that can be used here are `Add`, `Save`, `EditOccurrence`
     *  and `EditSeries`.
     * @param {boolean} isEventData It allows to decide whether the editor needs to be opened with the clicked cell details or with the
     *  passed event details.
     * @param {number} repeatType It opens the editor with the recurrence options based on the provided repeat type.
     * @returns {void}
     */
    openEditor(data, action, isEventData, repeatType) {
        this.currentAction = action;
        if (action !== 'Add') {
            this.activeEventData.event = data;
        }
        this.eventWindow.openEditor(data, action, isEventData, repeatType);
    }
    /**
     * Adds the resources to the specified index.
     * @param resources
     * @param {string} name Name of the resource defined in resources collection.
     * @param {number} index Index or position where the resource should be added.
     */
    addResource(resources, name, index) {
        this.resourceBase.addResource(resources, name, index);
    }
    /**
     * Removes the specified resource.
     * @param resourceId Specifies the resource id to be removed.
     * @param name Specifies the resource name from which the id should be referred.
     */
    removeResource(resourceId, name) {
        this.resourceBase.removeResource(resourceId, name);
    }
    /**
     * Destroys the Schedule component.
     * @method destroy
     * @return {void}
     */
    destroy() {
        if (this.eventTooltip) {
            this.eventTooltip.destroy();
            this.eventTooltip = null;
        }
        this.destroyPopups();
        this.unwireEvents();
        this.destroyHeaderModule();
        if (this.scrollModule) {
            this.scrollModule.destroy();
            this.scrollModule = null;
        }
        if (this.activeView) {
            this.activeView.removeEventListener();
            this.activeView.destroy();
            this.activeView = null;
        }
        if (this.scheduleTouchModule) {
            this.scheduleTouchModule.destroy();
            this.scheduleTouchModule = null;
        }
        super.destroy();
        this.element.innerHTML = '';
        let removeClasses = [ROOT];
        if (this.cssClass) {
            removeClasses = removeClasses.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], removeClasses);
    }
};
__decorate([
    Property('auto')
], Schedule.prototype, "width", void 0);
__decorate([
    Property('auto')
], Schedule.prototype, "height", void 0);
__decorate([
    Property(true)
], Schedule.prototype, "showHeaderBar", void 0);
__decorate([
    Property(true)
], Schedule.prototype, "showTimeIndicator", void 0);
__decorate([
    Property('Week')
], Schedule.prototype, "currentView", void 0);
__decorate([
    Property(['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'])
], Schedule.prototype, "views", void 0);
__decorate([
    Property(new Date())
], Schedule.prototype, "selectedDate", void 0);
__decorate([
    Property()
], Schedule.prototype, "dateFormat", void 0);
__decorate([
    Property('Gregorian')
], Schedule.prototype, "calendarMode", void 0);
__decorate([
    Property(true)
], Schedule.prototype, "showWeekend", void 0);
__decorate([
    Property(0)
], Schedule.prototype, "firstDayOfWeek", void 0);
__decorate([
    Property([1, 2, 3, 4, 5])
], Schedule.prototype, "workDays", void 0);
__decorate([
    Property('00:00')
], Schedule.prototype, "startHour", void 0);
__decorate([
    Property('24:00')
], Schedule.prototype, "endHour", void 0);
__decorate([
    Property(true)
], Schedule.prototype, "allowResizing", void 0);
__decorate([
    Complex({}, WorkHours)
], Schedule.prototype, "workHours", void 0);
__decorate([
    Complex({}, TimeScale)
], Schedule.prototype, "timeScale", void 0);
__decorate([
    Property(true)
], Schedule.prototype, "allowKeyboardInteraction", void 0);
__decorate([
    Property(true)
], Schedule.prototype, "allowDragAndDrop", void 0);
__decorate([
    Property()
], Schedule.prototype, "dateHeaderTemplate", void 0);
__decorate([
    Property()
], Schedule.prototype, "cellTemplate", void 0);
__decorate([
    Property(false)
], Schedule.prototype, "readonly", void 0);
__decorate([
    Property(true)
], Schedule.prototype, "showQuickInfo", void 0);
__decorate([
    Property(false)
], Schedule.prototype, "showWeekNumber", void 0);
__decorate([
    Property(false)
], Schedule.prototype, "rowAutoHeight", void 0);
__decorate([
    Property()
], Schedule.prototype, "editorTemplate", void 0);
__decorate([
    Complex({}, QuickInfoTemplates)
], Schedule.prototype, "quickInfoTemplates", void 0);
__decorate([
    Property(7)
], Schedule.prototype, "agendaDaysCount", void 0);
__decorate([
    Property(true)
], Schedule.prototype, "hideEmptyAgendaDays", void 0);
__decorate([
    Property()
], Schedule.prototype, "timezone", void 0);
__decorate([
    Complex({}, EventSettings)
], Schedule.prototype, "eventSettings", void 0);
__decorate([
    Property()
], Schedule.prototype, "resourceHeaderTemplate", void 0);
__decorate([
    Complex({}, Group)
], Schedule.prototype, "group", void 0);
__decorate([
    Collection([], Resources)
], Schedule.prototype, "resources", void 0);
__decorate([
    Collection([], HeaderRows)
], Schedule.prototype, "headerRows", void 0);
__decorate([
    Property()
], Schedule.prototype, "cssClass", void 0);
__decorate([
    Property(false)
], Schedule.prototype, "enableRtl", void 0);
__decorate([
    Property()
], Schedule.prototype, "eventDragArea", void 0);
__decorate([
    Event()
], Schedule.prototype, "created", void 0);
__decorate([
    Event()
], Schedule.prototype, "destroyed", void 0);
__decorate([
    Event()
], Schedule.prototype, "cellClick", void 0);
__decorate([
    Event()
], Schedule.prototype, "cellDoubleClick", void 0);
__decorate([
    Event()
], Schedule.prototype, "select", void 0);
__decorate([
    Event()
], Schedule.prototype, "actionBegin", void 0);
__decorate([
    Event()
], Schedule.prototype, "actionComplete", void 0);
__decorate([
    Event()
], Schedule.prototype, "actionFailure", void 0);
__decorate([
    Event()
], Schedule.prototype, "navigating", void 0);
__decorate([
    Event()
], Schedule.prototype, "renderCell", void 0);
__decorate([
    Event()
], Schedule.prototype, "eventClick", void 0);
__decorate([
    Event()
], Schedule.prototype, "eventRendered", void 0);
__decorate([
    Event()
], Schedule.prototype, "dataBinding", void 0);
__decorate([
    Event()
], Schedule.prototype, "popupOpen", void 0);
__decorate([
    Event()
], Schedule.prototype, "dragStart", void 0);
__decorate([
    Event()
], Schedule.prototype, "drag", void 0);
__decorate([
    Event()
], Schedule.prototype, "dragStop", void 0);
__decorate([
    Event()
], Schedule.prototype, "resizeStart", void 0);
__decorate([
    Event()
], Schedule.prototype, "resizing", void 0);
__decorate([
    Event()
], Schedule.prototype, "resizeStop", void 0);
__decorate([
    Event()
], Schedule.prototype, "dataBound", void 0);
Schedule = __decorate([
    NotifyPropertyChanges
], Schedule);

/**
 * Base class for the common drag and resize related actions
 */
class ActionBase {
    constructor(parent) {
        this.parent = parent;
        this.actionObj = {
            X: 0, Y: 0, groupIndex: 0, cellWidth: 0, cellHeight: 0, slotInterval: 0, interval: 0, actionIndex: 0,
            cloneElement: [], originalElement: [], action: null, isAllDay: null, excludeSelectors: null,
            index: 0, navigationInterval: null, scrollInterval: null
        };
        this.scrollArgs = { element: null, width: 0, height: 0 };
        this.resizeEdges = { left: false, right: false, top: false, bottom: false };
        this.scrollEdges = { left: false, right: false, top: false, bottom: false };
    }
    getChangedData() {
        let eventObj = extend({}, this.actionObj.event, null, true);
        eventObj[this.parent.eventFields.startTime] = this.actionObj.start;
        eventObj[this.parent.eventFields.endTime] = this.actionObj.end;
        if (!isNullOrUndefined(this.actionObj.isAllDay)) {
            eventObj[this.parent.eventFields.isAllDay] = this.actionObj.isAllDay;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            let originalElement = this.getOriginalElement(this.actionObj.element);
            let indexCol = originalElement.map((element) => parseInt(element.getAttribute('data-group-index'), 10));
            if (indexCol.indexOf(this.actionObj.groupIndex) === -1) {
                let cloneIndex = parseInt(this.actionObj.clone.getAttribute('data-group-index'), 10);
                indexCol = indexCol.filter((index) => index !== cloneIndex);
                indexCol.push(this.actionObj.groupIndex);
                this.parent.resourceBase.getResourceData(eventObj, this.actionObj.groupIndex, indexCol);
            }
        }
        return eventObj;
    }
    saveChangedData(eventArgs) {
        this.parent.activeEventData.event = this.actionObj.event;
        this.parent.currentAction = 'Save';
        let eventObj = eventArgs.data;
        let isSameResource = (this.parent.activeViewOptions.group.resources.length > 0) ?
            parseInt(this.actionObj.element.getAttribute('data-group-index'), 10) === this.actionObj.groupIndex : true;
        if (+eventObj[this.parent.eventFields.startTime] === +this.actionObj.event[this.parent.eventFields.startTime] &&
            +eventObj[this.parent.eventFields.endTime] === +this.actionObj.event[this.parent.eventFields.endTime] && isSameResource) {
            return;
        }
        let currentAction;
        if (eventObj[this.parent.eventFields.recurrenceRule]) {
            let eveId = eventObj[this.parent.eventFields.recurrenceID] || eventObj[this.parent.eventFields.id];
            if (eventObj[this.parent.eventFields.id] === eventObj[this.parent.eventFields.recurrenceID]) {
                eventObj[this.parent.eventFields.id] = this.parent.eventBase.getEventMaxID();
                currentAction = 'EditOccurrence';
            }
            if (this.parent.eventWindow.editOccurrenceValidation(eveId, eventObj, this.actionObj.event)) {
                this.parent.quickPopup.openRecurrenceValidationAlert('sameDayAlert');
                return;
            }
        }
        if (eventObj[this.parent.eventFields.startTimezone] || eventObj[this.parent.eventFields.endTimezone]) {
            this.parent.eventBase.timezoneConvert(eventObj);
        }
        this.parent.crudModule.saveEvent(eventObj, currentAction);
    }
    calculateIntervalTime(date) {
        let intervalTime = new Date(+date);
        intervalTime.setMinutes(Math.floor(intervalTime.getMinutes() / this.actionObj.interval) * this.actionObj.interval);
        return intervalTime;
    }
    getContentAreaDimension() {
        let viewElement = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        let trElement = [].slice.call(viewElement.querySelector('tr').children);
        if (!this.parent.activeView.isTimelineView() && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.isAdaptive) {
            trElement = this.getResourceElements(trElement);
        }
        let leftOffset = trElement[0].getBoundingClientRect();
        let rightOffset = trElement.slice(-1)[0].getBoundingClientRect();
        let viewDimension = {
            bottom: viewElement.scrollHeight - 5,
            left: this.parent.enableRtl ? rightOffset.left : leftOffset.left,
            right: this.parent.enableRtl ? leftOffset.right : rightOffset.right,
            top: 0
        };
        return viewDimension;
    }
    getPageCoordinates(e) {
        let eventArgs = e.event;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            eventArgs || e;
    }
    getIndex(index) {
        let contentElements = [].slice.call(this.parent.getContentTable().querySelector('tr').children);
        let indexes = { minIndex: 0, maxIndex: contentElements.length - 1 };
        if (this.actionObj.action === 'resize' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive && !this.parent.activeView.isTimelineView()) {
            let groupElements = this.getResourceElements(contentElements);
            indexes.minIndex = groupElements[0].cellIndex;
            indexes.maxIndex = groupElements.slice(-1)[0].cellIndex;
        }
        if (index < indexes.minIndex) {
            index = indexes.minIndex;
        }
        if (index > indexes.maxIndex) {
            index = indexes.maxIndex;
        }
        return index;
    }
    updateTimePosition(date) {
        for (let cloneElement of this.actionObj.cloneElement) {
            let timeElement = cloneElement.querySelector('.' + APPOINTMENT_TIME);
            if (timeElement) {
                timeElement.innerHTML = this.parent.getTimeString(this.actionObj.start) + ' - ' +
                    this.parent.getTimeString(this.actionObj.end);
            }
        }
        if (!this.parent.activeViewOptions.timeScale.enable || !this.parent.isAdaptive || this.parent.currentView === 'Month' ||
            this.parent.currentView === 'TimelineMonth') {
            return;
        }
        let timeIndicator = this.parent.element.querySelector('.' + CLONE_TIME_INDICATOR_CLASS);
        if (!timeIndicator) {
            timeIndicator = createElement('div', { className: CLONE_TIME_INDICATOR_CLASS });
            let wrapperClass = this.parent.activeView.isTimelineView() ? DATE_HEADER_WRAP_CLASS : TIME_CELLS_WRAP_CLASS;
            this.parent.element.querySelector('.' + wrapperClass).appendChild(timeIndicator);
        }
        timeIndicator.innerHTML = this.parent.getTimeString(date);
        let offsetValue = 0;
        if (this.parent.activeView.isTimelineView()) {
            if (this.parent.enableRtl) {
                let rightValue = parseInt(this.actionObj.clone.style.right, 10);
                offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.left ?
                    rightValue + this.actionObj.clone.offsetWidth : rightValue;
                timeIndicator.style.right = formatUnit(offsetValue);
            }
            else {
                let leftValue = parseInt(this.actionObj.clone.style.left, 10);
                offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.left ?
                    leftValue : leftValue + this.actionObj.clone.offsetWidth;
                timeIndicator.style.left = formatUnit(offsetValue);
            }
        }
        else {
            offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.top ? this.actionObj.clone.offsetTop :
                this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight;
            timeIndicator.style.top = formatUnit(offsetValue);
        }
    }
    getResourceElements(table) {
        return table.filter((element) => parseInt(element.getAttribute('data-group-index'), 10) === this.actionObj.groupIndex);
    }
    getOriginalElement(element) {
        let originalElement;
        let guid = element.getAttribute('data-guid');
        let isMorePopup = element.offsetParent && element.offsetParent.classList.contains(MORE_EVENT_POPUP_CLASS);
        if (isMorePopup || this.parent.activeView.isTimelineView()) {
            originalElement = [].slice.call(this.parent.element.querySelectorAll('[data-guid="' + guid + '"]'));
        }
        else {
            let tr = closest(element, 'tr');
            originalElement = [].slice.call(tr.querySelectorAll('[data-guid="' + guid + '"]'));
        }
        return originalElement;
    }
    createCloneElement(element) {
        let cloneElement = compile(element.outerHTML)({})[0];
        let cloneClassLists = [CLONE_ELEMENT_CLASS];
        cloneClassLists.push((this.actionObj.action === 'drag') ? DRAG_CLONE_CLASS : RESIZE_CLONE_CLASS);
        if (this.parent.currentView === 'Month' || this.parent.currentView === 'TimelineMonth') {
            cloneClassLists.push(MONTH_CLONE_ELEMENT_CLASS);
        }
        addClass([cloneElement], cloneClassLists);
        addClass([element], EVENT_ACTION_CLASS);
        element.parentElement.appendChild(cloneElement);
        cloneElement.style.width = formatUnit(cloneElement.offsetWidth - 2);
        if (this.parent.eventDragArea && this.actionObj.action === 'drag') {
            document.querySelector(this.parent.eventDragArea).appendChild(cloneElement);
        }
        setStyleAttribute(cloneElement, { border: '0px' });
        return cloneElement;
    }
    removeCloneElement() {
        this.actionObj.originalElement.forEach((element) => removeClass([element], EVENT_ACTION_CLASS));
        this.actionObj.originalElement = [];
        this.actionObj.cloneElement.forEach((element) => remove(element));
        this.actionObj.cloneElement = [];
        let timeIndicator = this.parent.element.querySelector('.' + CLONE_TIME_INDICATOR_CLASS);
        if (timeIndicator) {
            remove(timeIndicator);
        }
    }
    getCursorElement(e) {
        let pages = this.getPageCoordinates(e);
        return document.elementFromPoint(pages.clientX, pages.clientY);
    }
    autoScroll() {
        let parent = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        let yIsScrollable = parent.offsetHeight <= parent.scrollHeight;
        let xIsScrollable = parent.offsetWidth <= parent.scrollWidth;
        let yInBounds = yIsScrollable && parent.scrollTop >= 0 && parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
        let xInBounds = xIsScrollable && parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
        if (yInBounds && (this.scrollEdges.top || this.scrollEdges.bottom)) {
            parent.scrollTop += this.scrollEdges.top ? -this.actionObj.scroll.scrollBy : this.actionObj.scroll.scrollBy;
            if (this.actionObj.action === 'resize') {
                if (parent.scrollHeight !== parent.offsetHeight + parent.scrollTop && parent.scrollTop > 0) {
                    this.actionObj.Y += this.scrollEdges.top ? this.actionObj.scroll.scrollBy : -this.actionObj.scroll.scrollBy;
                }
            }
        }
        if (xInBounds && (this.scrollEdges.left || this.scrollEdges.right)) {
            parent.scrollLeft += this.scrollEdges.left ? -this.actionObj.scroll.scrollBy : this.actionObj.scroll.scrollBy;
            if (this.actionObj.action === 'resize') {
                if (parent.scrollWidth !== parent.offsetWidth + parent.scrollLeft && parent.scrollLeft > 0) {
                    this.actionObj.X += this.scrollEdges.left ? this.actionObj.scroll.scrollBy : -this.actionObj.scroll.scrollBy;
                }
            }
        }
    }
    autoScrollValidation(e) {
        if (!this.actionObj.scroll.enable) {
            return false;
        }
        let res = this.parent.boundaryValidation(this.actionObj.pageY, this.actionObj.pageX);
        this.scrollEdges = res;
        return res.bottom || res.top || res.left || res.right;
    }
    actionClass(type) {
        if (type === 'addClass') {
            addClass([this.parent.element], EVENT_ACTION_CLASS);
        }
        else {
            removeClass([this.parent.element], EVENT_ACTION_CLASS);
        }
    }
    updateScrollPosition(e) {
        if (this.actionObj.scroll.enable && isNullOrUndefined(this.actionObj.scrollInterval)) {
            this.actionObj.scrollInterval = window.setInterval(() => {
                if (this.autoScrollValidation(e) && !this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                    this.autoScroll();
                    if (this.actionObj.action === 'drag') {
                        this.parent.dragAndDropModule.updateDraggingDateTime(e);
                    }
                    else {
                        this.parent.resizeModule.updateResizingDirection(e);
                    }
                }
            }, this.actionObj.scroll.timeDelay);
        }
    }
    /**
     * To destroy the action base module.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.actionObj = {};
        this.scrollArgs = {};
        this.resizeEdges = { left: false, right: false, top: false, bottom: false };
        this.scrollEdges = { left: false, right: false, top: false, bottom: false };
    }
}

/**
 * Schedule events resize actions
 */
class Resize extends ActionBase {
    wireResizeEvent(element) {
        let resizeElement = [].slice.call(element.querySelectorAll('.' + EVENT_RESIZE_CLASS));
        resizeElement.forEach((element) => EventHandler.add(element, Browser.touchStartEvent, this.resizeStart, this));
    }
    resizeHelper() {
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.activeViewOptions.group.allowGroupEdit) {
            this.actionObj.originalElement.forEach((element, index) => {
                let cloneElement = this.createCloneElement(element);
                this.actionObj.cloneElement[index] = cloneElement;
                if (this.actionObj.element === element) {
                    this.actionObj.clone = cloneElement;
                }
            });
        }
        else {
            this.actionObj.clone = this.createCloneElement(this.actionObj.element);
            this.actionObj.cloneElement = [this.actionObj.clone];
            this.actionObj.originalElement = [this.actionObj.element];
        }
    }
    resizeStart(e) {
        this.actionObj.action = 'resize';
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        let resizeTarget = closest(e.target, '.' + EVENT_RESIZE_CLASS);
        this.actionObj.element = closest(resizeTarget, '.' + APPOINTMENT_CLASS);
        this.actionObj.event = this.parent.eventBase.getEventByGuid(this.actionObj.element.getAttribute('data-guid'));
        let eventObj = extend({}, this.actionObj.event, null, true);
        let resizeArgs = {
            cancel: false,
            data: eventObj,
            element: this.actionObj.element,
            event: e,
            interval: this.actionObj.interval,
            scroll: { enable: true, scrollBy: 30, timeDelay: 100 }
        };
        this.parent.trigger(resizeStart, resizeArgs);
        if (resizeArgs.cancel) {
            return;
        }
        this.actionClass('addClass');
        this.parent.uiStateValues.action = true;
        this.resizeEdges = {
            left: resizeTarget.classList.contains(LEFT_RESIZE_HANDLER),
            right: resizeTarget.classList.contains(RIGHT_RESIZE_HANDLER),
            top: resizeTarget.classList.contains(TOP_RESIZE_HANDLER),
            bottom: resizeTarget.classList.contains(BOTTOM_RESIZE_HANDLER)
        };
        this.actionObj.groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex : 0;
        let workCell = this.parent.element.querySelector('.' + WORK_CELLS_CLASS);
        this.actionObj.cellWidth = workCell.offsetWidth;
        this.actionObj.cellHeight = workCell.offsetHeight;
        let headerRows = this.parent.activeViewOptions.headerRows.map((row) => row.option);
        if (this.parent.activeView.isTimelineView() && headerRows.length > 0 && ['Date', 'Hour'].indexOf(headerRows.slice(-1)[0]) < 0) {
            let tr = this.parent.getContentTable().querySelector('tr');
            let noOfDays = 0;
            let tdCollections = [].slice.call(tr.childNodes);
            tdCollections.forEach((td) => noOfDays += parseInt(td.getAttribute('colspan'), 10));
            this.actionObj.cellWidth = tr.offsetWidth / noOfDays;
            this.actionObj.cellHeight = tr.offsetHeight;
        }
        let pages = this.getPageCoordinates(e);
        this.actionObj.X = pages.pageX;
        this.actionObj.Y = pages.pageY;
        this.actionObj.groupIndex = parseInt(this.actionObj.element.getAttribute('data-group-index') || '0', 10);
        this.actionObj.interval = resizeArgs.interval;
        this.actionObj.scroll = resizeArgs.scroll;
        this.actionObj.start = new Date(eventObj[this.parent.eventFields.startTime].getTime());
        this.actionObj.end = new Date(eventObj[this.parent.eventFields.endTime].getTime());
        this.actionObj.originalElement = this.getOriginalElement(this.actionObj.element);
        let viewElement = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        this.scrollArgs = { element: viewElement, width: viewElement.scrollWidth, height: viewElement.scrollHeight };
        EventHandler.add(document, Browser.touchMoveEvent, this.resizing, this);
        EventHandler.add(document, Browser.touchEndEvent, this.resizeStop, this);
    }
    resizing(e) {
        this.parent.quickPopup.quickPopupHide();
        if (this.parent.element.querySelectorAll('.' + RESIZE_CLONE_CLASS).length === 0) {
            this.resizeHelper();
        }
        let pages = this.getPageCoordinates(e);
        this.actionObj.pageX = pages.pageX;
        this.actionObj.pageY = pages.pageY;
        this.updateScrollPosition(e);
        this.updateResizingDirection(e);
        let eventObj = extend({}, this.actionObj.event, null, true);
        let resizeArgs = {
            cancel: false,
            data: eventObj,
            element: this.actionObj.element,
            event: e,
            startTime: this.actionObj.start,
            endTime: this.actionObj.end
        };
        this.parent.trigger(resizing, resizeArgs);
    }
    updateResizingDirection(e) {
        let resizeValidation = this.resizeValidation(e);
        if (this.resizeEdges.left) {
            if (resizeValidation) {
                let leftStyles = this.getLeftRightStyles(e, true);
                for (let cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, leftStyles);
                    addClass([cloneElement], LEFT_RESIZE_HANDLER);
                }
            }
            this.horizontalResizing(!this.parent.enableRtl);
        }
        if (this.resizeEdges.right) {
            if (resizeValidation) {
                let rightStyles = this.getLeftRightStyles(e, false);
                for (let cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, rightStyles);
                    addClass([cloneElement], RIGHT_RESIZE_HANDLER);
                }
            }
            this.horizontalResizing(this.parent.enableRtl);
        }
        if (this.resizeEdges.top) {
            if (resizeValidation) {
                let topStyles = this.getTopBottomStyles(e, true);
                for (let cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, topStyles);
                    addClass([cloneElement], TOP_RESIZE_HANDLER);
                }
            }
            this.verticalResizing(true);
        }
        if (this.resizeEdges.bottom) {
            if (resizeValidation) {
                let bottomStyles = this.getTopBottomStyles(e, false);
                for (let cloneElement of this.actionObj.cloneElement) {
                    setStyleAttribute(cloneElement, bottomStyles);
                    addClass([cloneElement], BOTTOM_RESIZE_HANDLER);
                }
            }
            this.verticalResizing(false);
        }
    }
    resizeStop(e) {
        EventHandler.remove(document, Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(document, Browser.touchEndEvent, this.resizeStop);
        clearInterval(this.actionObj.scrollInterval);
        this.actionObj.scrollInterval = null;
        this.removeCloneElement();
        this.actionClass('removeClass');
        this.parent.uiStateValues.action = false;
        let resizeArgs = { cancel: false, data: this.getChangedData(), element: this.actionObj.element, event: e };
        this.parent.trigger(resizeStop, resizeArgs);
        if (resizeArgs.cancel) {
            return;
        }
        this.saveChangedData(resizeArgs);
    }
    verticalResizing(isTop) {
        let offsetValue = this.actionObj.clone.offsetTop;
        if (!isTop) {
            offsetValue += this.actionObj.clone.offsetHeight;
        }
        let minutes = (offsetValue / this.actionObj.cellHeight) * this.actionObj.slotInterval;
        let resizeTime = resetTime(new Date(parseInt(this.actionObj.clone.offsetParent.getAttribute('data-date'), 10)));
        resizeTime.setHours(this.parent.activeView.getStartHour().getHours());
        resizeTime.setMinutes(minutes);
        if (isTop) {
            this.actionObj.start = this.calculateIntervalTime(resizeTime);
        }
        else {
            this.actionObj.end = this.calculateIntervalTime(resizeTime);
        }
        this.updateTimePosition(resizeTime);
    }
    horizontalResizing(isLeft) {
        let eventStart = new Date(this.actionObj.event[this.parent.eventFields.startTime].getTime());
        let eventEnd = new Date(this.actionObj.event[this.parent.eventFields.endTime].getTime());
        let resizeTime;
        if (this.parent.activeView.isTimelineView()) {
            let tr = this.parent.getContentTable().querySelector('tr');
            let headerName = this.parent.currentView;
            if (this.parent.activeViewOptions.headerRows.length > 0) {
                let rows = this.parent.activeViewOptions.headerRows.map((row) => row.option);
                headerName = rows.slice(-1)[0];
                if (this.parent.currentView === 'TimelineMonth' && headerName === 'Hour') {
                    headerName = rows.slice(-2)[0] || 'Month';
                }
            }
            resizeTime = isLeft ? eventStart : eventEnd;
            let cellIndex = 0;
            let tdCollections = [].slice.call(tr.childNodes);
            let isLastCell = false;
            if (['Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1) {
                let noOfDays = 0;
                tdCollections.forEach((td) => noOfDays += parseInt(td.getAttribute('colspan'), 10));
                let offsetValue = this.parent.enableRtl ? parseInt(this.actionObj.clone.style.right, 10) :
                    parseInt(this.actionObj.clone.style.left, 10);
                if (!isLeft) {
                    offsetValue += (this.actionObj.clone.offsetWidth - this.actionObj.cellWidth);
                }
                cellIndex = Math.floor(offsetValue / Math.floor(tr.offsetWidth / noOfDays));
                cellIndex = isLeft ? cellIndex : cellIndex + 1;
                isLastCell = cellIndex === tdCollections.length;
                cellIndex = (cellIndex < 0) ? 0 : (cellIndex >= noOfDays) ? noOfDays - 1 : cellIndex;
            }
            else {
                let cellWidth = this.parent.currentView === 'TimelineMonth' || !this.parent.activeViewOptions.timeScale.enable ?
                    this.actionObj.cellWidth : this.actionObj.cellWidth - (this.actionObj.interval *
                    (this.actionObj.cellWidth / this.actionObj.slotInterval));
                cellIndex = isLeft ? Math.floor(this.actionObj.clone.offsetLeft / this.actionObj.cellWidth) :
                    Math.ceil((this.actionObj.clone.offsetLeft + (this.actionObj.clone.offsetWidth - cellWidth)) /
                        this.actionObj.cellWidth);
                if (this.parent.enableRtl) {
                    let cellOffsetWidth = 0;
                    if (headerName === 'TimelineMonth' || (!this.parent.activeViewOptions.timeScale.enable &&
                        this.parent.currentView !== 'TimelineMonth')) {
                        cellOffsetWidth = this.actionObj.cellWidth;
                    }
                    let offsetWidth = (Math.floor(parseInt(this.actionObj.clone.style.right, 10) / this.actionObj.cellWidth) *
                        this.actionObj.cellWidth) + (isLeft ? 0 : this.actionObj.clone.offsetWidth - cellOffsetWidth);
                    cellIndex = Math.ceil(offsetWidth / this.actionObj.cellWidth);
                }
                isLastCell = cellIndex === tdCollections.length;
                cellIndex = this.getIndex(cellIndex);
            }
            let resizeDate;
            if (['Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1) {
                resizeDate = new Date(this.parent.activeView.renderDates[cellIndex].getTime());
            }
            else {
                resizeDate = new Date(parseInt(tr.childNodes.item(cellIndex).getAttribute('data-date'), 10));
            }
            if (['TimelineMonth', 'Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1 ||
                !this.parent.activeViewOptions.timeScale.enable) {
                resizeTime = new Date(resizeDate.setHours(resizeTime.getHours(), resizeTime.getMinutes(), resizeTime.getSeconds()));
            }
            else {
                let offsetValue = this.parent.enableRtl ? parseFloat(this.actionObj.clone.style.right) :
                    parseFloat(this.actionObj.clone.style.left);
                if (!isLeft) {
                    offsetValue += this.actionObj.clone.offsetWidth;
                }
                let spanMinutes = Math.ceil((this.actionObj.slotInterval / this.actionObj.cellWidth) *
                    (offsetValue - Math.floor(offsetValue / this.actionObj.cellWidth) * this.actionObj.cellWidth));
                spanMinutes = isLastCell ? this.actionObj.slotInterval : spanMinutes;
                resizeTime = new Date(resizeDate.getTime());
                resizeTime.setMinutes(resizeTime.getMinutes() + spanMinutes);
                this.updateTimePosition(resizeTime);
            }
        }
        else {
            let cloneIndex = closest(this.actionObj.clone, 'td').cellIndex;
            let originalWidth = Math.ceil((isLeft ? this.actionObj.element.offsetWidth : 0) / this.actionObj.cellWidth) *
                this.actionObj.cellWidth;
            let noOfDays = Math.ceil((this.actionObj.clone.offsetWidth - originalWidth) / this.actionObj.cellWidth);
            let tr = closest(this.actionObj.clone, 'tr');
            let dayIndex = isLeft ? cloneIndex - noOfDays : cloneIndex + noOfDays - 1;
            dayIndex = this.getIndex(dayIndex);
            resizeTime = new Date(parseInt(tr.childNodes.item(dayIndex).getAttribute('data-date'), 10));
            if (isLeft) {
                resizeTime.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            }
            else {
                resizeTime.setHours(eventEnd.getHours(), eventEnd.getMinutes(), eventEnd.getSeconds());
            }
        }
        if (isLeft) {
            this.actionObj.start = this.parent.activeViewOptions.timeScale.enable ? this.calculateIntervalTime(resizeTime) : resizeTime;
        }
        else {
            let isTimeViews = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'].indexOf(this.parent.currentView) > -1 &&
                this.parent.activeViewOptions.timeScale.enable;
            let resizeEnd = (!isTimeViews && resizeTime.getHours() === 0 && resizeTime.getMinutes() === 0) ?
                addDays(resizeTime, 1) : resizeTime;
            this.actionObj.end = this.parent.activeViewOptions.timeScale.enable && this.parent.currentView !== 'Month' ?
                this.calculateIntervalTime(resizeEnd) : resizeEnd;
        }
    }
    getTopBottomStyles(e, isTop) {
        let viewElement = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        let slotInterval = (this.actionObj.cellHeight / this.actionObj.slotInterval) * this.actionObj.interval;
        let clnHeight = isTop ? this.actionObj.element.offsetHeight + (this.actionObj.Y - this.actionObj.pageY) :
            this.actionObj.element.offsetHeight + (this.actionObj.pageY - this.actionObj.Y);
        let clnTop = isTop ? this.actionObj.element.offsetTop -
            (this.actionObj.Y - this.actionObj.pageY) : this.actionObj.clone.offsetTop;
        clnHeight = (clnTop < 0) ? this.actionObj.clone.offsetHeight :
            (this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight) > this.scrollArgs.height ?
                this.actionObj.clone.offsetHeight : clnHeight;
        clnTop = (clnTop < 0) ? 0 : clnTop;
        clnTop = Math.floor(clnTop / slotInterval) * slotInterval;
        clnHeight = clnTop + clnHeight >= viewElement.scrollHeight ? viewElement.scrollHeight - clnTop :
            Math.ceil(clnHeight / slotInterval) * slotInterval;
        let styles = {
            height: formatUnit(clnHeight < this.actionObj.cellHeight ? this.actionObj.cellHeight : clnHeight),
            top: formatUnit((clnHeight < this.actionObj.cellHeight && isTop) ? this.actionObj.clone.offsetTop : clnTop),
            left: '0px', right: '0px', width: '100%'
        };
        return styles;
    }
    getLeftRightStyles(e, isLeft) {
        let styles = {};
        let isTimelineView = this.parent.activeView.isTimelineView();
        let isTimeViews = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'].indexOf(this.parent.currentView) > -1 &&
            this.parent.activeViewOptions.timeScale.enable;
        let slotInterval = (this.actionObj.cellWidth / this.actionObj.slotInterval) * this.actionObj.interval;
        let pageWidth = isLeft ? (this.actionObj.X - this.actionObj.pageX) : (this.actionObj.pageX - this.actionObj.X);
        let targetWidth = isTimelineView ?
            (this.actionObj.element.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth :
            this.parent.currentView === 'Month' ? this.actionObj.element.offsetWidth :
                Math.ceil(this.actionObj.element.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        let offsetWidth = targetWidth + (Math.ceil(pageWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth);
        if (isTimeViews) {
            offsetWidth = targetWidth + (Math.ceil(pageWidth / slotInterval) * slotInterval);
            this.actionObj.event[this.parent.eventFields.isAllDay] = false;
        }
        let width = !isLeft && ((offsetWidth + this.actionObj.clone.offsetLeft > this.scrollArgs.width)) ?
            this.actionObj.clone.offsetWidth : (offsetWidth < this.actionObj.cellWidth) ? this.actionObj.cellWidth : offsetWidth;
        if (this.parent.enableRtl) {
            let rightValue = isTimelineView ?
                Math.floor(parseInt(this.actionObj.element.style.right, 10) / this.actionObj.cellWidth) * this.actionObj.cellWidth :
                -(offsetWidth - this.actionObj.cellWidth);
            rightValue = isTimelineView ? rightValue : isLeft ? 0 : rightValue > 0 ? 0 : rightValue;
            if (isTimelineView && !isLeft) {
                rightValue = Math.ceil((this.actionObj.element.offsetLeft + (this.actionObj.element.offsetWidth +
                    (this.actionObj.pageX - this.actionObj.X))) / this.actionObj.cellWidth) * this.actionObj.cellWidth;
                rightValue = rightValue < 0 ? Math.abs(rightValue) : -rightValue;
            }
            rightValue = rightValue >= this.scrollArgs.width ? this.scrollArgs.width - this.actionObj.cellWidth : rightValue;
            styles.right = formatUnit(rightValue);
            width = width + rightValue > this.scrollArgs.width ? this.actionObj.clone.offsetWidth : width;
        }
        else {
            let offsetLeft = isLeft ? this.actionObj.element.offsetLeft - (this.actionObj.X - this.actionObj.pageX) :
                this.parent.enableRtl ? this.actionObj.element.offsetLeft : 0;
            if (isTimelineView) {
                offsetLeft = isLeft ? offsetLeft : parseInt(this.actionObj.clone.style.left, 10);
                if (this.parent.enableRtl) {
                    offsetLeft = !isLeft ? (this.actionObj.pageX < this.actionObj.X - this.actionObj.clone.offsetWidth) ?
                        parseInt(this.actionObj.clone.style.right, 10) : offsetLeft : offsetLeft;
                }
                else {
                    offsetLeft = isLeft ? (this.actionObj.pageX > this.actionObj.X + this.actionObj.clone.offsetWidth &&
                        this.actionObj.clone.offsetWidth === this.actionObj.cellWidth) ?
                        parseInt(this.actionObj.clone.style.left, 10) : offsetLeft : offsetLeft;
                }
            }
            let leftValue = offsetLeft;
            offsetLeft = isTimelineView ? isTimeViews ? isLeft ? Math.floor(offsetLeft / slotInterval) * slotInterval : offsetLeft :
                Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth :
                Math.ceil(Math.abs(offsetLeft) / this.actionObj.cellWidth) * this.actionObj.cellWidth;
            if (offsetLeft < 0) {
                offsetLeft = 0;
                width = this.actionObj.clone.offsetWidth;
            }
            let cloneWidth = Math.ceil(this.actionObj.clone.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth;
            if (isLeft) {
                styles.left = formatUnit(isTimelineView ? offsetLeft : isLeft ? leftValue < 0 ? -offsetLeft :
                    (Math.ceil((targetWidth - cloneWidth) / this.actionObj.cellWidth) * this.actionObj.cellWidth) : offsetLeft);
            }
        }
        styles.width = formatUnit(width);
        return styles;
    }
    resizeValidation(e) {
        let pages = this.getPageCoordinates(e);
        let viewDimension = this.getContentAreaDimension();
        let resizeValidation = false;
        if (this.resizeEdges.left) {
            resizeValidation = (pages.pageX - this.actionObj.cellWidth) >= viewDimension.left;
        }
        if (this.resizeEdges.right) {
            resizeValidation = (pages.pageX + this.actionObj.cellWidth) <= viewDimension.right;
        }
        if (this.resizeEdges.top) {
            resizeValidation = this.actionObj.clone.offsetTop >= viewDimension.top;
        }
        if (this.resizeEdges.bottom) {
            resizeValidation = (this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight) <= this.scrollArgs.height;
        }
        return resizeValidation;
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'resize';
    }
}

/**
 * Schedule events drag actions
 */
class DragAndDrop extends ActionBase {
    wireDragEvent(element, isAllDay) {
        let dragAreaTarget = CURRENT_PANEL_CLASS;
        new Draggable(element, {
            abort: '.' + EVENT_RESIZE_CLASS,
            clone: true,
            enableTapHold: this.parent.isAdaptive,
            enableTailMode: (this.parent.eventDragArea) ? true : false,
            cursorAt: (this.parent.eventDragArea) ? { left: -20, top: -20 } : { left: 0, top: 0 },
            dragArea: (this.parent.eventDragArea) ?
                document.querySelector(this.parent.eventDragArea) :
                this.parent.element.querySelector('.' + dragAreaTarget),
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
            queryPositionInfo: this.dragPosition.bind(this)
        });
    }
    dragHelper(e) {
        this.setDragActionDefaultValues();
        this.actionObj.element = e.element;
        this.actionObj.action = 'drag';
        this.actionObj.clone = this.createCloneElement(this.actionObj.element);
        if (!this.parent.eventDragArea && this.parent.currentView !== 'Month' &&
            this.parent.timeScale.enable && !this.parent.activeView.isTimelineView() &&
            !this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
            setStyleAttribute(this.actionObj.clone, { cursor: 'move', left: '0%', right: '0%', width: '100%' });
        }
        this.actionObj.clone.style.top = formatUnit(this.actionObj.element.offsetTop);
        this.actionObj.cloneElement = [this.actionObj.clone];
        this.actionObj.originalElement = [this.actionObj.element];
        return this.actionObj.clone;
    }
    dragPosition(e) {
        if (this.parent.eventDragArea) {
            return { left: e.left, top: e.top };
        }
        let slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        let cellWidth = this.parent.activeView.isTimelineView() ? (this.actionObj.cellWidth / slotInterval) *
            this.actionObj.interval : this.actionObj.cellWidth;
        let cellHeight = (this.actionObj.cellHeight / slotInterval) * this.actionObj.interval;
        let leftOffset = this.parent.enableRtl ? parseInt(e.left, 10) : Math.abs(parseInt(e.left, 10));
        let leftValue = formatUnit(0);
        if (this.parent.currentView === 'Month') {
            leftValue = e.left;
        }
        if (this.parent.activeView.isTimelineView()) {
            leftValue = formatUnit(Math.round(leftOffset / cellWidth) * cellWidth);
        }
        let topValue;
        if ((this.parent.activeView.isTimelineView() || !this.parent.timeScale.enable ||
            (!isNullOrUndefined(this.actionObj.clone.offsetParent) &&
                this.actionObj.clone.offsetParent.classList.contains(MORE_EVENT_POPUP_CLASS)))) {
            topValue = formatUnit(this.actionObj.clone.offsetTop);
        }
        else if (this.parent.currentView === 'Month') {
            topValue = formatUnit(0);
        }
        else if (this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
            topValue = formatUnit(this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS).offsetTop);
            setStyleAttribute(this.actionObj.clone, {
                width: formatUnit(Math.ceil(this.actionObj.clone.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth)
            });
        }
        else {
            if (this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS) &&
                !this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                setStyleAttribute(this.actionObj.clone, {
                    height: formatUnit(this.actionObj.cellHeight),
                    width: formatUnit(this.actionObj.cellWidth),
                    pointerEvents: 'none'
                });
            }
            topValue = formatUnit(Math.ceil(parseInt(e.top, 10) / cellHeight) * cellHeight);
            let scrollHeight = this.parent.element.querySelector('.e-content-wrap').scrollHeight;
            let cloneBottom = parseInt(topValue, 10) + this.actionObj.clone.offsetHeight;
            if (cloneBottom > scrollHeight) {
                topValue = (parseInt(topValue, 10) - (cloneBottom - scrollHeight)) + 'px';
            }
        }
        return { left: leftValue, top: topValue };
    }
    setDragActionDefaultValues() {
        this.actionObj.action = 'drag';
        this.actionObj.isAllDay = null;
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        let workCell = this.parent.element.querySelector('.' + WORK_CELLS_CLASS);
        this.actionObj.cellWidth = workCell.offsetWidth;
        this.actionObj.cellHeight = workCell.offsetHeight;
    }
    dragStart(e) {
        let eventGuid = this.actionObj.element.getAttribute('data-guid');
        this.actionObj.event = this.parent.eventBase.getEventByGuid(eventGuid);
        let eventObj = extend({}, this.actionObj.event, null, true);
        let dragArgs = {
            cancel: false,
            data: eventObj,
            event: e,
            excludeSelectors: null,
            element: this.actionObj.element,
            interval: this.actionObj.interval,
            navigation: { enable: false, timeDelay: 2000 },
            scroll: { enable: true, scrollBy: 30, timeDelay: 100 }
        };
        this.parent.trigger(dragStart, dragArgs);
        if (dragArgs.cancel) {
            this.removeCloneElement();
            return;
        }
        this.actionClass('addClass');
        this.parent.uiStateValues.action = true;
        this.actionObj.start = eventObj[this.parent.eventFields.startTime];
        this.actionObj.end = eventObj[this.parent.eventFields.endTime];
        this.actionObj.groupIndex = parseInt(this.actionObj.element.getAttribute('data-group-index') || '0', 10);
        this.actionObj.interval = dragArgs.interval;
        this.actionObj.navigation = dragArgs.navigation;
        this.actionObj.scroll = dragArgs.scroll;
        this.actionObj.excludeSelectors = dragArgs.excludeSelectors;
    }
    drag(e) {
        this.parent.quickPopup.quickPopupHide(true);
        let eventObj = extend({}, this.actionObj.event, null, true);
        let eventArgs = this.getPageCoordinates(e);
        this.actionObj.Y = this.actionObj.pageY = eventArgs.pageY;
        this.actionObj.X = this.actionObj.pageX = eventArgs.pageX;
        this.actionObj.target = e.target;
        if (this.parent.eventDragArea) {
            let targetElement = eventArgs.target;
            this.actionObj.clone.style.top = formatUnit(targetElement.offsetTop);
            this.actionObj.clone.style.left = formatUnit(targetElement.offsetLeft);
            let currentTarget = closest(targetElement, '.' + ROOT);
            if (!currentTarget) {
                this.actionObj.clone.style.height = '';
                this.actionObj.clone.style.width = '';
            }
            else {
                if (!(this.parent.currentView === 'Week' || this.parent.currentView === 'WorkWeek'
                    || this.parent.currentView === 'Day')) {
                    this.actionObj.clone.style.height = formatUnit(this.actionObj.element.offsetHeight);
                    this.actionObj.clone.style.width = formatUnit(this.actionObj.element.offsetWidth);
                }
            }
        }
        this.updateScrollPosition(e);
        this.updateNavigatingPosition(e);
        this.updateDraggingDateTime(e);
        let dragArgs = { data: eventObj, event: e, element: this.actionObj.element };
        this.parent.trigger(drag, dragArgs);
    }
    dragStop(e) {
        this.removeCloneElement();
        clearInterval(this.actionObj.navigationInterval);
        this.actionObj.navigationInterval = null;
        clearInterval(this.actionObj.scrollInterval);
        this.actionObj.scrollInterval = null;
        this.actionClass('removeClass');
        this.parent.uiStateValues.action = false;
        this.actionObj.action = null;
        if (this.isAllowDrop(e)) {
            return;
        }
        let dragArgs = { cancel: false, data: this.getChangedData(), event: e, element: this.actionObj.element };
        this.parent.trigger(dragStop, dragArgs);
        if (dragArgs.cancel) {
            return;
        }
        this.saveChangedData(dragArgs);
    }
    updateNavigatingPosition(e) {
        if (this.actionObj.navigation.enable) {
            let currentDate = new Date();
            if (isNullOrUndefined(this.actionObj.navigationInterval)) {
                this.actionObj.navigationInterval = window.setInterval(() => {
                    if (currentDate) {
                        let crtDate = new Date();
                        let end = crtDate.getSeconds();
                        let start = currentDate.getSeconds() + (this.actionObj.navigation.timeDelay / 1000);
                        start = (start >= 60) ? start - 60 : start;
                        if (start === end) {
                            currentDate = new Date();
                            this.viewNavigation(e);
                            this.updateDraggingDateTime(e);
                        }
                    }
                }, this.actionObj.navigation.timeDelay);
            }
        }
    }
    updateDraggingDateTime(e) {
        if (!isNullOrUndefined(this.actionObj.clone.offsetParent) &&
            this.actionObj.clone.offsetParent.classList.contains(MORE_EVENT_POPUP_CLASS)) {
            this.morePopupEventDragging(e);
        }
        else if (this.parent.activeView.isTimelineView()) {
            if (this.parent.currentView === 'TimelineMonth') {
                this.calculateTimelineDate(e);
            }
            else {
                this.calculateTimelineTime(e);
            }
        }
        else {
            if (this.parent.currentView === 'Month') {
                this.calculateVerticalDate(e);
            }
            else {
                this.calculateVerticalTime(e);
            }
        }
    }
    navigationWrapper() {
        if (!this.parent.activeView.isTimelineView()) {
            if (this.parent.currentView === 'Month' || !this.parent.timeScale.enable) {
                let outerWrapperCls = this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS);
                this.actionObj.index = (this.parent.activeView.renderDates.length < this.actionObj.index) ?
                    this.parent.activeView.renderDates.length - 1 : this.actionObj.index;
                let targetWrapper = outerWrapperCls.item(this.actionObj.index).querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
                if (!targetWrapper) {
                    targetWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
                    outerWrapperCls.item(this.actionObj.index).appendChild(targetWrapper);
                }
                targetWrapper.appendChild(this.actionObj.clone);
            }
            else {
                let wrapperClass = this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS) ?
                    '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + APPOINTMENT_WRAPPER_CLASS;
                this.parent.element.querySelectorAll(wrapperClass)
                    .item(this.actionObj.index).appendChild(this.actionObj.clone);
                if (wrapperClass === '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS) {
                    let elementHeight = this.getAllDayEventHeight();
                    let event = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_CELLS_CLASS + ':first-child'));
                    if (event[0].offsetHeight < elementHeight) {
                        event.forEach((element) => element.style.height = ((elementHeight + 2) / 12) + 'em');
                    }
                    this.actionObj.clone.style.height = formatUnit(elementHeight);
                }
                this.actionObj.height = parseInt(this.actionObj.clone.style.height, 0);
            }
        }
        else {
            let outWrapper;
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                outWrapper = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(this.actionObj.index);
            }
            else {
                outWrapper = this.parent.element.querySelector('.' + APPOINTMENT_CONTAINER_CLASS);
            }
            let tarWrapper = outWrapper.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
            if (!tarWrapper) {
                tarWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
                outWrapper.appendChild(tarWrapper);
            }
            tarWrapper.appendChild(this.actionObj.clone);
        }
    }
    viewNavigation(e) {
        let navigationType;
        let dragArea = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        if (dragArea && ((!this.scrollEdges.top && !this.scrollEdges.bottom) ||
            closest(this.actionObj.clone, '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS))) {
            if ((dragArea.scrollLeft === 0) &&
                (Math.round(this.actionObj.X) <=
                    Math.round(dragArea.getBoundingClientRect().left + this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.enableRtl ? 'next' : 'previous';
            }
            else if ((Math.round(dragArea.scrollLeft) + dragArea.clientWidth === dragArea.scrollWidth) &&
                (Math.round(this.actionObj.X) >=
                    Math.round(dragArea.getBoundingClientRect().right - this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.enableRtl ? 'previous' : 'next';
            }
            if (navigationType) {
                this.parent.changeDate(this.parent.activeView.getNextPreviousDate(navigationType));
            }
        }
    }
    morePopupEventDragging(e) {
        if (isNullOrUndefined(e.target) || (e.target && isNullOrUndefined(closest(e.target, 'td')))) {
            return;
        }
        let eventObj = extend({}, this.actionObj.event, null, true);
        let eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        let td = closest(e.target, 'td');
        let dragStart$$1 = new Date(parseInt(td.getAttribute('data-date'), 10));
        let dragEnd = new Date(dragStart$$1.getTime());
        dragEnd.setMilliseconds(eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        this.actionObj.start = new Date(dragStart$$1.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.actionObj.clone.style.top = formatUnit(td.offsetParent.offsetTop);
        this.actionObj.clone.style.left = formatUnit(td.offsetLeft);
        this.actionObj.clone.style.width = formatUnit(td.offsetWidth);
        let eventContainer = td;
        let eventWrapper;
        if (this.parent.activeView.isTimelineView()) {
            let rowIndex = closest(td, 'tr').rowIndex;
            eventContainer = this.parent.element.querySelectorAll('.e-appointment-container').item(rowIndex);
        }
        eventWrapper = eventContainer.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
        if (!eventWrapper) {
            eventWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper);
    }
    calculateVerticalTime(e) {
        if (isNullOrUndefined(this.actionObj.target) ||
            (this.actionObj.target && isNullOrUndefined(closest(this.actionObj.target, 'tr'))) ||
            (!(closest(this.actionObj.target, 'td').classList.contains(WORK_CELLS_CLASS)) &&
                !(closest(this.actionObj.target, 'td').classList.contains(ALLDAY_CELLS_CLASS)))) {
            return;
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.swapDragging(e);
        }
        let dragArea = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        let eventObj = extend({}, this.actionObj.event, null, true);
        let eventStart = eventObj[this.parent.eventFields.startTime];
        let eventEnd = eventObj[this.parent.eventFields.endTime];
        let eventDuration = eventEnd.getTime() - eventStart.getTime();
        let offsetTop = Math.floor(parseInt(this.actionObj.clone.style.top, 0) / this.actionObj.cellHeight)
            * this.actionObj.cellHeight;
        offsetTop = offsetTop < 0 ? 0 : offsetTop;
        if (this.scrollEdges.top || this.scrollEdges.bottom) {
            offsetTop = this.scrollEdges.top ? dragArea.scrollTop :
                dragArea.scrollTop + dragArea.offsetHeight - this.actionObj.clone.offsetHeight;
            offsetTop = Math.round(offsetTop / this.actionObj.cellHeight) * this.actionObj.cellHeight;
            this.actionObj.clone.style.top = formatUnit(offsetTop);
        }
        let rowIndex = offsetTop / this.actionObj.cellHeight;
        let heightPerMinute = this.actionObj.cellHeight / this.actionObj.slotInterval;
        let diffInMinutes = parseInt(this.actionObj.clone.style.top, 0) - offsetTop;
        let isAllDayDrag = this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS);
        let tr;
        if (isAllDayDrag) {
            tr = this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS);
        }
        else {
            let trCollections = this.parent.getContentTable().querySelectorAll('tr');
            tr = trCollections.item(rowIndex);
        }
        let index;
        if (closest(this.actionObj.target, 'td').classList.contains(WORK_CELLS_CLASS) ||
            closest(this.actionObj.target, 'td').classList.contains(ALLDAY_CELLS_CLASS)) {
            index = closest(this.actionObj.target, 'td').cellIndex;
        }
        let colIndex = isNullOrUndefined(index) ? closest(this.actionObj.clone, 'td').cellIndex : index;
        this.actionObj.index = colIndex;
        let td = tr.childNodes.item(colIndex);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        let dragStart$$1;
        let dragEnd;
        if (this.parent.activeViewOptions.timeScale.enable && !isAllDayDrag) {
            this.appendCloneElement(this.getEventWrapper(colIndex));
            let spanHours = -(((this.actionObj.slotInterval / this.actionObj.cellHeight) * diffInMinutes) * (1000 * 60));
            if (this.actionObj.clone.querySelector('.' + EVENT_ICON_UP_CLASS)) {
                let startTime = new Date(eventStart.getTime());
                spanHours = addDays(resetTime(new Date(startTime.getTime())), 1).getTime() - startTime.getTime();
            }
            dragStart$$1 = new Date(parseInt(td.getAttribute('data-date'), 10));
            dragStart$$1.setMinutes(dragStart$$1.getMinutes() + (diffInMinutes * heightPerMinute));
            dragStart$$1.setMilliseconds(-spanHours);
            dragStart$$1 = this.calculateIntervalTime(dragStart$$1);
            dragStart$$1.setMilliseconds(spanHours);
            dragEnd = new Date(dragStart$$1.getTime());
            if (this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd.setMinutes(dragEnd.getMinutes() + this.actionObj.slotInterval);
            }
            else {
                dragEnd.setMilliseconds(eventDuration);
            }
        }
        else {
            this.appendCloneElement(this.getEventWrapper(colIndex));
            dragStart$$1 = new Date(parseInt(td.getAttribute('data-date'), 10));
            dragStart$$1.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            dragEnd = new Date(dragStart$$1.getTime());
            dragEnd.setMilliseconds(eventDuration);
            if (!this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS) &&
                this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd = addDays(resetTime(dragEnd), 1);
            }
        }
        this.actionObj.start = new Date(+dragStart$$1);
        this.actionObj.end = new Date(+dragEnd);
        this.updateTimePosition(this.actionObj.start);
    }
    swapDragging(e) {
        let colIndex = closest(this.actionObj.target, 'td').cellIndex;
        if (closest(this.actionObj.target, '.' + DATE_HEADER_WRAP_CLASS) &&
            !closest(this.actionObj.clone, '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS)) {
            addClass([this.actionObj.clone], ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = true;
            let eventHeight = this.getAllDayEventHeight();
            let allDayElement = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_CELLS_CLASS + ':first-child'));
            if (allDayElement[0].offsetHeight < eventHeight) {
                allDayElement.forEach((element) => element.style.height = ((eventHeight + 2) / 12) + 'em');
            }
            setStyleAttribute(this.actionObj.clone, {
                width: formatUnit(this.actionObj.cellWidth),
                height: formatUnit(eventHeight),
                top: formatUnit(this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS).offsetTop)
            });
        }
        if (closest(this.actionObj.target, '.' + WORK_CELLS_CLASS) &&
            !closest(this.actionObj.clone, '.' + DAY_WRAPPER_CLASS)) {
            removeClass([this.actionObj.clone], ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = false;
            let height = (this.actionObj.element.offsetHeight === 0) ? this.actionObj.height : this.actionObj.element.offsetHeight;
            setStyleAttribute(this.actionObj.clone, {
                left: formatUnit(0),
                height: formatUnit(height),
                width: formatUnit(this.actionObj.cellWidth)
            });
        }
    }
    calculateVerticalDate(e) {
        if (isNullOrUndefined(e.target) || (e.target && isNullOrUndefined(closest(e.target, 'tr')))) {
            return;
        }
        this.actionObj.clone.style.top = formatUnit(0);
        let eventObj = extend({}, this.actionObj.event, null, true);
        let eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        let td = closest(this.actionObj.target, 'td');
        let tr = td.parentElement;
        let colIndex = (tr.rowIndex * tr.childNodes.length) + td.cellIndex;
        this.actionObj.index = colIndex;
        // let cellIndex: number = td.cellIndex;
        // let daysCount: number = Math.floor(this.actionObj.element.offsetWidth / this.actionObj.cellWidth);
        // let maxIndex: number = (tr.lastChild as HTMLTableCellElement).cellIndex;
        // if (cellIndex + daysCount > maxIndex) {
        //     this.actionObj.clone.style.width = formatUnit((this.actionObj.cellWidth - 2) * ((maxIndex + 1) - cellIndex));
        // } else {
        //     this.actionObj.clone.style.width = formatUnit(this.actionObj.element.offsetWidth);
        // }
        let outerWrapper = this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        let targetWrapper = outerWrapper.item(colIndex).querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
        if (!targetWrapper) {
            targetWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            outerWrapper.item(colIndex).appendChild(targetWrapper);
        }
        if (!targetWrapper.querySelector('.' + CLONE_ELEMENT_CLASS)) {
            this.appendCloneElement(targetWrapper);
        }
        let timeString = outerWrapper.item(colIndex).getAttribute('data-date') ||
            eventObj[this.parent.eventFields.startTime].getTime().toString();
        let dragStart$$1 = new Date(parseInt(timeString, 10));
        let dragEnd = new Date(dragStart$$1.getTime());
        if (this.parent.enableRtl) {
            let endTimeDiff = eventObj[this.parent.eventFields.endTime].getTime() -
                (resetTime(new Date(+eventObj[this.parent.eventFields.endTime]))).getTime();
            dragEnd = new Date(dragStart$$1.getTime() + endTimeDiff);
            dragStart$$1 = new Date(dragEnd.getTime() - eventDuration);
        }
        else {
            let startTimeDiff = eventObj[this.parent.eventFields.startTime].getTime() -
                (resetTime(new Date(+eventObj[this.parent.eventFields.startTime]))).getTime();
            dragStart$$1 = new Date(dragStart$$1.getTime() + startTimeDiff);
            dragEnd = new Date(dragStart$$1.getTime() + eventDuration);
        }
        this.actionObj.start = new Date(dragStart$$1.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    }
    calculateTimelineTime(e) {
        let eventObj = extend({}, this.actionObj.event, null, true);
        let eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        let offsetLeft = this.parent.enableRtl ? Math.abs(this.actionObj.clone.offsetLeft) - this.actionObj.clone.offsetWidth :
            parseInt(this.actionObj.clone.style.left, 10);
        offsetLeft = Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        let rightOffset;
        let diffInMinutes = this.actionObj.clone.offsetLeft - offsetLeft;
        let viewEle = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        if (this.parent.enableRtl) {
            rightOffset = Math.abs(parseInt(this.actionObj.clone.style.left, 10)) - this.actionObj.clone.offsetWidth;
            this.actionObj.clone.style.right = formatUnit(rightOffset);
            diffInMinutes = rightOffset - offsetLeft;
        }
        if (this.scrollEdges.left || this.scrollEdges.right) {
            if (this.parent.enableRtl) {
                rightOffset = viewEle.scrollWidth - viewEle.scrollLeft;
                if (this.scrollEdges.right) {
                    rightOffset = rightOffset - viewEle.offsetWidth + this.actionObj.clone.offsetWidth;
                }
                this.actionObj.clone.style.left = formatUnit(rightOffset);
            }
            else {
                offsetLeft = this.scrollEdges.left ? viewEle.scrollLeft :
                    viewEle.scrollLeft + viewEle.offsetWidth - this.actionObj.clone.offsetWidth;
                this.actionObj.clone.style.left = formatUnit(offsetLeft);
            }
        }
        let widthPerMinute = this.actionObj.slotInterval / this.actionObj.cellWidth;
        let colIndex = this.getIndex(Math.floor(offsetLeft / this.actionObj.cellWidth));
        let tr = this.parent.getContentTable().querySelector('tr');
        let eventStart = new Date(parseInt(tr.childNodes.item(colIndex).getAttribute('data-date'), 10));
        eventStart.setMinutes(eventStart.getMinutes() + Math.round((widthPerMinute * diffInMinutes)));
        eventStart = this.calculateIntervalTime(eventStart);
        if (!this.parent.activeViewOptions.timeScale.enable) {
            let eventSrt = eventObj[this.parent.eventFields.startTime];
            eventStart.setHours(eventSrt.getHours(), eventSrt.getMinutes(), eventSrt.getSeconds());
        }
        let eventEnd = new Date(eventStart.getTime());
        eventEnd.setMilliseconds(eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.calculateResourceGroupingPosition(e);
        }
        this.actionObj.start = new Date(eventStart.getTime());
        this.actionObj.end = new Date(eventEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    }
    calculateTimelineDate(e) {
        let cloneIndex = 0;
        let rightOffset;
        let leftOffset;
        let viewEle = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        let eventObj = extend({}, this.actionObj.event, null, true);
        let eventDuration = eventObj[this.parent.eventFields.endTime].getTime() -
            eventObj[this.parent.eventFields.startTime].getTime();
        if (this.parent.enableRtl) {
            cloneIndex = (Math.floor(parseInt(this.actionObj.clone.style.right, 10))) / this.actionObj.cellWidth;
            rightOffset = Math.abs(parseInt(this.actionObj.clone.style.left, 10)) - this.actionObj.clone.offsetWidth;
            if (this.scrollEdges.left || this.scrollEdges.right) {
                rightOffset = viewEle.scrollWidth - viewEle.scrollLeft - this.actionObj.clone.offsetWidth;
                if (this.scrollEdges.right) {
                    rightOffset = rightOffset - viewEle.offsetWidth + this.actionObj.clone.offsetWidth;
                }
            }
            this.actionObj.clone.style.right = formatUnit(rightOffset);
        }
        else {
            cloneIndex = Math.floor(this.actionObj.clone.offsetLeft / this.actionObj.cellWidth);
            leftOffset = parseInt(this.actionObj.clone.style.left, 10);
            if (this.scrollEdges.left || this.scrollEdges.right) {
                leftOffset = this.scrollEdges.left ? viewEle.scrollLeft :
                    viewEle.scrollLeft + viewEle.offsetWidth - this.actionObj.clone.offsetWidth;
            }
            this.actionObj.clone.style.left = formatUnit(leftOffset);
        }
        cloneIndex = this.getIndex(cloneIndex);
        let tr = this.parent.getContentTable().querySelector('tr');
        let dragDate = new Date(parseInt(tr.childNodes.item(cloneIndex).getAttribute('data-date'), 10));
        let dragStart$$1 = new Date(dragDate.getTime());
        let srtDateDiff = eventObj[this.parent.eventFields.startTime].getTime() -
            (resetTime(new Date(+eventObj[this.parent.eventFields.startTime]))).getTime();
        dragStart$$1 = new Date(dragStart$$1.getTime() + srtDateDiff);
        let dragEnd = new Date(dragStart$$1.getTime() + eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.calculateResourceGroupingPosition(e);
        }
        this.actionObj.start = new Date(dragStart$$1.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    }
    calculateResourceGroupingPosition(e) {
        let dragArea = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        let trCollection = this.parent.element.querySelectorAll('.e-content-wrap .e-content-table tr:not(.e-hidden)');
        let translateY = getTranslateY(dragArea.querySelector('table'));
        translateY = (isNullOrUndefined(translateY)) ? 0 : translateY;
        let rowHeight = (this.parent.rowAutoHeight) ?
            ~~(dragArea.querySelector('table').offsetHeight / trCollection.length) : this.actionObj.cellHeight;
        let rowIndex = Math.floor(Math.floor((this.actionObj.Y + (dragArea.scrollTop - translateY)) -
            dragArea.getBoundingClientRect().top) / rowHeight);
        rowIndex = (rowIndex < 0) ? 0 : (rowIndex > trCollection.length - 1) ? trCollection.length - 1 : rowIndex;
        this.actionObj.index = rowIndex;
        let eventContainer = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(rowIndex);
        let eventWrapper = eventContainer.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
        if (!eventWrapper) {
            eventWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper);
        let td = closest(e.target, 'td');
        this.actionObj.groupIndex = (td && !isNaN(parseInt(td.getAttribute('data-group-index'), 10)))
            ? parseInt(td.getAttribute('data-group-index'), 10) : this.actionObj.groupIndex;
        let top = trCollection.item(rowIndex).offsetTop;
        if (this.parent.rowAutoHeight) {
            let cursorElement = this.getCursorElement(e);
            if (cursorElement) {
                top = cursorElement.classList.contains(WORK_CELLS_CLASS) ? cursorElement.offsetTop :
                    cursorElement.offsetParent.classList.contains(APPOINTMENT_CLASS) ?
                        cursorElement.offsetParent.offsetTop : top;
            }
        }
        this.actionObj.clone.style.top = formatUnit(top);
    }
    appendCloneElement(element) {
        if (this.parent.eventDragArea) {
            document.querySelector(this.parent.eventDragArea).appendChild(this.actionObj.clone);
        }
        else {
            element.appendChild(this.actionObj.clone);
        }
    }
    getEventWrapper(index) {
        let eventWrapper;
        let isAllDayDrag = this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS);
        if (this.parent.activeViewOptions.timeScale.enable) {
            let wrapperClass = isAllDayDrag ? '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + APPOINTMENT_WRAPPER_CLASS;
            eventWrapper = this.parent.element.querySelectorAll(wrapperClass).item(index);
        }
        else {
            let targetWrapper = this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS).item(index);
            eventWrapper = targetWrapper.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
            if (!eventWrapper) {
                eventWrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
                targetWrapper.appendChild(eventWrapper);
            }
        }
        return eventWrapper;
    }
    getAllDayEventHeight() {
        let eventWrapper = createElement('div', { className: APPOINTMENT_CLASS });
        this.parent.element.querySelector('.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS).appendChild(eventWrapper);
        let eventHeight = eventWrapper.offsetHeight;
        remove(eventWrapper);
        return eventHeight;
    }
    isAllowDrop(e) {
        if (!this.actionObj.excludeSelectors) {
            return false;
        }
        let dropSelectors = this.actionObj.excludeSelectors.split(',');
        let isAllowDrop = false;
        for (let selector of dropSelectors) {
            if (e.target.classList.contains(selector)) {
                isAllowDrop = true;
                break;
            }
        }
        return isAllowDrop;
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'dragAndDrop';
    }
}

/**
 * view base
 */
class ViewBase {
    /**
     * Constructor
     */
    constructor(parent) {
        this.customHelper = {
            getDayName: (dt) => {
                return this.parent.getDayNames('abbreviated')[dt.getDay()];
            },
            getDate: (dt) => {
                return this.parent.globalize.formatDate(dt, { format: 'd', calendar: this.parent.getCalendarMode() });
            },
            getTime: (dt) => {
                if (this.parent.isAdaptive) {
                    if (this.parent.timeFormat === 'HH:mm') {
                        return this.parent.globalize.formatDate(dt, { format: 'H', calendar: this.parent.getCalendarMode() });
                    }
                    return this.parent.globalize.formatDate(dt, { skeleton: 'h', calendar: this.parent.getCalendarMode() });
                }
                return this.parent.getTimeString(dt);
            },
            getTimelineDate: (dt) => {
                return this.parent.globalize.formatDate(dt, { skeleton: 'MMMd', calendar: this.parent.getCalendarMode() }) + ', ' + this.parent.getDayNames('wide')[dt.getDay()];
            }
        };
        this.parent = parent;
    }
    isTimelineView() {
        return this.parent.currentView.indexOf('Timeline') !== -1;
    }
    getContentRows() {
        return [];
    }
    createEventTable(trCount) {
        let eventTable = createElement('div', { className: EVENT_TABLE_CLASS });
        append(this.getEventRows(trCount), eventTable);
        return eventTable;
    }
    getEventRows(trCount) {
        let eventRows = [];
        let eventContainer;
        for (let row = 0; row < trCount; row++) {
            eventContainer = createElement('div', { className: APPOINTMENT_CONTAINER_CLASS });
            if (this.parent.resourceBase && !this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.renderedResources) {
                eventContainer.setAttribute('data-group-index', this.parent.resourceBase.renderedResources[row].groupIndex.toString());
            }
            eventRows.push(eventContainer);
        }
        return eventRows;
    }
    collapseRows(wrap) {
        if (!this.isTimelineView()) {
            return;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.hideResourceRows(wrap.querySelector('tbody'));
            this.parent.resourceBase.hideResourceRows(wrap.querySelector('.' + EVENT_TABLE_CLASS));
        }
    }
    createTableLayout(className) {
        let clsName = className || '';
        let table = createElement('table', { className: SCHEDULE_TABLE_CLASS + ' ' + clsName });
        let tbody = createElement('tbody');
        table.appendChild(tbody);
        return table;
    }
    createColGroup(table, lastRow) {
        let length = lastRow.length;
        if (lastRow[0] && lastRow[0].colSpan) {
            length = lastRow.map((value) => value.colSpan).reduce((prev, next) => prev + next);
        }
        let colGroupEle = createElement('colgroup');
        for (let i = 0; i < length; i++) {
            colGroupEle.appendChild(createElement('col'));
        }
        prepend([colGroupEle], table);
    }
    getScrollXIndent(content) {
        return content.offsetHeight - content.clientHeight > 0 ? getScrollBarWidth() : 0;
    }
    scrollTopPanel(target) {
        this.getDatesHeaderElement().firstChild.scrollLeft = target.scrollLeft;
    }
    scrollHeaderLabels(target) {
        let headerTable = this.element.querySelector('.e-date-header-wrap table');
        let colWidth = headerTable.offsetWidth / headerTable.querySelectorAll('colgroup col').length;
        let applyLeft = (headerCells, isRtl) => {
            let currentCell;
            let tdLeft = 0;
            let colSpan = 0;
            let hiddenLeft = isRtl ? target.scrollWidth - target.offsetWidth - target.scrollLeft : target.scrollLeft;
            for (let i = 0; i < headerCells.length; i++) {
                colSpan += parseInt(headerCells[i].getAttribute('colSpan'), 10);
                if (colSpan > Math.floor(hiddenLeft / colWidth)) {
                    currentCell = headerCells[i];
                    break;
                }
                tdLeft += headerCells[i].offsetWidth;
            }
            currentCell.children[0].style[isRtl ? 'right' : 'left'] = (hiddenLeft - tdLeft) + 'px';
        };
        let className = ['.e-header-year-cell', '.e-header-month-cell', '.e-header-week-cell', '.e-header-cells'];
        for (let i = 0; i < className.length; i++) {
            let headerCells = [].slice.call(this.element.querySelectorAll(className[i]));
            if (headerCells.length > 0) {
                headerCells.forEach((element) => {
                    element.children[0].style[this.parent.enableRtl ? 'right' : 'left'] = '';
                });
                applyLeft(headerCells, this.parent.enableRtl);
            }
        }
    }
    addAttributes(td, element) {
        if (td.template) {
            append(td.template, element);
        }
        if (td.colSpan) {
            element.setAttribute('colspan', td.colSpan.toString());
        }
        if (td.className) {
            addClass([element], td.className);
        }
    }
    getHeaderBarHeight() {
        let headerBarHeight = 2;
        if (this.parent.headerModule) {
            headerBarHeight += getOuterHeight(this.parent.headerModule.getHeaderElement());
        }
        if (this.parent.uiStateValues.isGroupAdaptive) {
            let resHeader = this.parent.element.querySelector('.' + RESOURCE_HEADER_TOOLBAR);
            if (resHeader) {
                headerBarHeight += resHeader.offsetHeight;
            }
        }
        return headerBarHeight;
    }
    renderPanel(type) {
        if (type === PREVIOUS_PANEL_CLASS) {
            prepend([this.element], this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS));
        }
        else {
            this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS).appendChild(this.element);
        }
    }
    setPanel(panel) {
        this.element = panel;
    }
    getPanel() {
        return this.element;
    }
    getDatesHeaderElement() {
        return this.element.querySelector('.' + DATE_HEADER_CONTAINER_CLASS);
    }
    getDateSlots(renderDates, workDays) {
        // Here getDateSlots only need in vertical and month views
        return [];
    }
    generateColumnLevels() {
        // Here generateColumnLevels only need in vertical and month views
        return [];
    }
    getColumnLevels() {
        return this.colLevels;
    }
    highlightCurrentTime() {
        // Here showTimeIndicator functionalities
    }
    startDate() {
        return this.renderDates[0];
    }
    endDate() {
        return addDays(this.renderDates[this.renderDates.length - 1], 1);
    }
    getStartHour() {
        let startHour = this.parent.getStartEndTime(this.parent.activeViewOptions.startHour);
        if (isNullOrUndefined(startHour)) {
            startHour = new Date(2000, 0, 0, 0);
        }
        return startHour;
    }
    getEndHour() {
        let endHour = this.parent.getStartEndTime(this.parent.activeViewOptions.endHour);
        if (isNullOrUndefined(endHour)) {
            endHour = new Date(2000, 0, 0, 0);
        }
        return endHour;
    }
    isCurrentDate(date) {
        return date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
    }
    isCurrentMonth(date) {
        return date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth();
    }
    isWorkDay(date, workDays = this.parent.activeViewOptions.workDays) {
        if (workDays.indexOf(date.getDay()) >= 0) {
            return true;
        }
        return false;
    }
    isWorkHour(date, startHour, endHour, workDays) {
        if (isNullOrUndefined(startHour) || isNullOrUndefined(endHour)) {
            return false;
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        if (getDateInMs(date) < getDateInMs(startHour) || getDateInMs(date) >= getDateInMs(endHour) || !this.isWorkDay(date, workDays)) {
            return false;
        }
        return true;
    }
    getRenderDates(workDays) {
        let renderDates = [];
        // Due to same code for vertical and time line, week & work week views, if condition has used
        if (this.parent.currentView === 'Week' || this.parent.currentView === 'TimelineWeek') {
            let selectedDate = resetTime(this.parent.selectedDate);
            let start = getWeekFirstDate(selectedDate, this.parent.firstDayOfWeek);
            for (let i = 0, length = WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length; i++) {
                if (this.parent.activeViewOptions.showWeekend) {
                    renderDates.push(start);
                }
                else {
                    if (this.isWorkDay(start, workDays)) {
                        renderDates.push(start);
                    }
                }
                start = addDays(start, 1);
            }
        }
        else if (this.parent.currentView === 'WorkWeek' || this.parent.currentView === 'TimelineWorkWeek') {
            let start = getWeekFirstDate(resetTime(this.parent.selectedDate), this.parent.firstDayOfWeek);
            for (let i = 0, length = WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length; i++) {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
                start = addDays(start, 1);
            }
        }
        else {
            for (let i = 0, length = this.parent.activeViewOptions.interval; i < length; i++) {
                renderDates.push(addDays(resetTime(this.parent.selectedDate), i));
            }
        }
        if (!workDays) {
            this.renderDates = renderDates;
        }
        return renderDates;
    }
    getNextPreviousDate(type) {
        if (this.parent.currentView === 'Day' || this.parent.currentView === 'TimelineDay') {
            let daysCount = (type === 'next') ? this.parent.activeViewOptions.interval : -(this.parent.activeViewOptions.interval);
            if (this.parent.activeViewOptions.showWeekend) {
                return addDays(this.parent.selectedDate, daysCount);
            }
            else {
                let date = addDays(this.parent.selectedDate, daysCount);
                while (!this.isWorkDay(date)) {
                    date = addDays(date, daysCount);
                }
                return date;
            }
        }
        if (type === 'next') {
            return addDays(this.parent.selectedDate, WEEK_LENGTH * this.parent.activeViewOptions.interval);
        }
        else {
            return addDays(this.parent.selectedDate, -WEEK_LENGTH * this.parent.activeViewOptions.interval);
        }
    }
    getLabelText(view) {
        return this.parent.localeObj.getConstant(view) + ' of ' + this.parent.globalize.formatDate(this.parent.selectedDate, { skeleton: 'long', calendar: this.parent.getCalendarMode() });
    }
    getDateRangeText() {
        if (this.parent.isAdaptive) {
            return this.parent.globalize.
                formatDate(this.parent.selectedDate, { format: 'MMMM y', calendar: this.parent.getCalendarMode() });
        }
        return this.formatDateRange(this.renderDates[0], this.renderDates[this.renderDates.length - 1]);
    }
    formatDateRange(startDate, endDate) {
        let globalize = this.parent.globalize;
        if (startDate === endDate) {
            endDate = null;
        }
        if (!isNullOrUndefined(this.parent.activeViewOptions.dateFormat)) {
            if (!endDate) {
                return globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat, calendar: this.parent.getCalendarMode() });
            }
            return globalize.formatDate(startDate, { format: this.parent.activeViewOptions.dateFormat, calendar: this.parent.getCalendarMode() }) + ' - ' +
                globalize.
                    formatDate(endDate, { format: this.parent.activeViewOptions.dateFormat, calendar: this.parent.getCalendarMode() });
        }
        let formattedStr;
        let longDateFormat;
        if (this.parent.locale === 'en' || this.parent.locale === 'en-US') {
            longDateFormat = getValue('dateFormats.long', getDefaultDateObject(this.parent.getCalendarMode()));
        }
        else {
            longDateFormat = getValue('main.' + '' + this.parent.locale + '.dates.calendars.' + this.parent.getCalendarMode() + '.dateFormats.long', cldrData);
        }
        if (!endDate) {
            return globalize.formatDate(startDate, { format: longDateFormat, calendar: this.parent.getCalendarMode() });
        }
        let dateFormat = longDateFormat.trim().toLocaleLowerCase();
        if (dateFormat.substr(0, 1) === 'd') {
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    formattedStr = globalize.formatDate(startDate, { format: 'dd', calendar: this.parent.getCalendarMode() }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd MMMM yyyy', calendar: this.parent.getCalendarMode() });
                }
                else {
                    formattedStr = globalize.formatDate(startDate, { format: 'dd MMM', calendar: this.parent.getCalendarMode() }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd MMM yyyy', calendar: this.parent.getCalendarMode() });
                }
            }
            else {
                formattedStr = globalize.formatDate(startDate, { format: 'dd MMM yyyy', calendar: this.parent.getCalendarMode() }) + ' - ' +
                    globalize.formatDate(endDate, { format: 'dd MMM yyyy', calendar: this.parent.getCalendarMode() });
            }
        }
        else if (dateFormat.substr(0, 1) === 'm') {
            if (startDate.getFullYear() === endDate.getFullYear()) {
                if (startDate.getMonth() === endDate.getMonth()) {
                    formattedStr = globalize.formatDate(startDate, { format: 'MMMM dd', calendar: this.parent.getCalendarMode() }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'dd, yyyy', calendar: this.parent.getCalendarMode() });
                }
                else {
                    formattedStr = globalize.formatDate(startDate, { format: 'MMM dd', calendar: this.parent.getCalendarMode() }) + ' - ' +
                        globalize.formatDate(endDate, { format: 'MMM dd, yyyy', calendar: this.parent.getCalendarMode() });
                }
            }
            else {
                formattedStr = globalize.
                    formatDate(startDate, { format: 'MMM dd, yyyy', calendar: this.parent.getCalendarMode() }) + ' - ' +
                    globalize.formatDate(endDate, { format: 'MMM dd, yyyy', calendar: this.parent.getCalendarMode() });
            }
        }
        else {
            formattedStr = globalize.formatDate(startDate, { format: longDateFormat, calendar: this.parent.getCalendarMode() }) + ' - ' +
                globalize.formatDate(endDate, { format: longDateFormat, calendar: this.parent.getCalendarMode() });
        }
        return formattedStr;
    }
    getMobileDateElement(date, className) {
        let wrap = createElement('div', {
            className: className,
            innerHTML: '<div class="e-m-date">' + this.parent.globalize.formatDate(date, { format: 'd', calendar: this.parent.getCalendarMode() }) + '</div>' + '<div class="e-m-day">' +
                this.parent.globalize.formatDate(date, { format: 'E', calendar: this.parent.getCalendarMode() }) + '</div>'
        });
        return wrap;
    }
    setResourceHeaderContent(tdElement, tdData, className = 'e-text-ellipsis') {
        if (this.parent.activeViewOptions.resourceHeaderTemplate) {
            let data = {
                resource: tdData.resource,
                resourceData: tdData.resourceData
            };
            append(this.parent.getResourceHeaderTemplate()(data), tdElement);
        }
        else {
            tdElement.appendChild(createElement('div', {
                className: className, innerHTML: tdData.resourceData[tdData.resource.textField]
            }));
        }
    }
    renderResourceMobileLayout() {
        if (this.parent.resourceBase.lastResourceLevel && this.parent.resourceBase.lastResourceLevel.length <= 0) {
            return;
        }
        this.parent.resourceBase.renderResourceHeader();
        this.parent.resourceBase.renderResourceTree();
    }
    addAutoHeightClass(element) {
        if (!this.parent.uiStateValues.isGroupAdaptive && this.parent.rowAutoHeight && this.isTimelineView()
            && this.parent.activeViewOptions.group.resources.length > 0) {
            addClass([element], AUTO_HEIGHT);
        }
    }
    getColElements() {
        return [].slice.call(this.parent.element.querySelectorAll('.' + CONTENT_WRAP_CLASS
            + ' col, .' + DATE_HEADER_WRAP_CLASS + ' col'));
    }
    setColWidth(content) {
        if (this.isTimelineView()) {
            let colElements = this.getColElements();
            const colWidth = Math.ceil(this.parent.getContentTable().offsetWidth / (colElements.length / 2));
            colElements.forEach((col) => setStyleAttribute(col, { 'width': formatUnit(colWidth) }));
            if (content.offsetHeight !== content.clientHeight) {
                let resourceColumn = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
                if (!isNullOrUndefined(resourceColumn)) {
                    setStyleAttribute(resourceColumn, {
                        'height': formatUnit(content.clientHeight)
                    });
                }
            }
        }
    }
    resetColWidth() {
        let colElements = this.getColElements();
        colElements.forEach((col) => col.style.width = '');
    }
    getContentAreaElement() {
        return this.element.querySelector('.' + CONTENT_WRAP_CLASS);
    }
}

/**
 * Work cell interactions
 */
class WorkCellInteraction {
    constructor(parent) {
        this.parent = parent;
    }
    cellMouseDown(e) {
        if (this.isPreventAction(e)) {
            return;
        }
        this.parent.notify(cellMouseDown, { event: e });
    }
    cellClick(e) {
        if (this.isPreventAction(e)) {
            return;
        }
        let queryStr = '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS + ',.' + HEADER_CELLS_CLASS;
        let target = closest(e.target, queryStr);
        if (isNullOrUndefined(target)) {
            return;
        }
        if (!isNullOrUndefined(closest(e.target, '.' + NEW_EVENT_CLASS))) {
            this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
            return;
        }
        let navigateEle = closest(e.target, '.' + NAVIGATE_CLASS);
        let navigateView = this.parent.getNavigateView();
        let sameView = this.parent.currentView === navigateView;
        if (isNullOrUndefined(navigateEle) || sameView ||
            isNullOrUndefined(this.parent.viewOptions[navigateView.charAt(0).toLowerCase() + navigateView.slice(1)])) {
            if (this.parent.activeViewOptions.readonly) {
                this.parent.quickPopup.quickPopupHide();
                return;
            }
            if (this.parent.isAdaptive && (e.target.classList.contains(MORE_INDICATOR_CLASS) ||
                closest(e.target, '.' + MORE_INDICATOR_CLASS))) {
                return;
            }
            let isWorkCell = target.classList.contains(WORK_CELLS_CLASS) ||
                target.classList.contains(ALLDAY_CELLS_CLASS);
            if (isWorkCell && e.shiftKey && e.which === 1 && this.parent.keyboardInteractionModule) {
                this.parent.keyboardInteractionModule.onMouseSelection(e);
                return;
            }
            this.parent.activeCellsData = this.parent.getCellDetails(target);
            let args = extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellClick' });
            this.parent.trigger(cellClick, args);
            if (args.cancel) {
                return;
            }
            if (isWorkCell) {
                this.parent.selectCell(target);
            }
            this.parent.notify(cellClick, args);
        }
        else {
            let date = this.parent.getDateFromElement(target);
            if (!isNullOrUndefined(date) && !this.parent.isAdaptive) {
                this.parent.setProperties({ selectedDate: date }, true);
                this.parent.changeView(this.parent.getNavigateView(), e);
            }
        }
    }
    cellDblClick(e) {
        if (this.parent.activeViewOptions.readonly || this.isPreventAction(e)) {
            return;
        }
        let args = extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellDoubleClick' });
        this.parent.trigger(cellDoubleClick, args);
        if (args.cancel) {
            return;
        }
        this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
    }
    isPreventAction(e) {
        if (closest(e.target, '.' + NAVIGATE_CLASS)) {
            return false;
        }
        if (closest(e.target, '.' + APPOINTMENT_WRAPPER_CLASS) &&
            !closest(e.target, '.' + MORE_INDICATOR_CLASS)) {
            return true;
        }
        let target = closest(e.target, '.' + APPOINTMENT_CLASS + ',.' + RESOURCE_GROUP_CELLS_CLASS);
        if (!isNullOrUndefined(target)) {
            return true;
        }
        target = closest(e.target, '.' + HEADER_CELLS_CLASS);
        if (this.parent.activeView.isTimelineView() && !isNullOrUndefined(target)) {
            return true;
        }
        return false;
    }
}

/**
 * Vertical view appointment rendering
 */
class VerticalEvent extends EventBase {
    /**
     * Constructor for vertical view
     */
    constructor(parent) {
        super(parent);
        this.dateRender = [];
        this.renderedEvents = [];
        this.renderedAllDayEvents = [];
        this.overlapEvents = [];
        this.moreEvents = [];
        this.overlapList = [];
        this.allDayEvents = [];
        this.slotCount = this.parent.activeViewOptions.timeScale.slotCount;
        this.interval = this.parent.activeViewOptions.timeScale.interval;
        this.allDayLevel = 0;
        this.startHour = this.parent.activeView.getStartHour();
        this.endHour = this.parent.activeView.getEndHour();
        this.element = this.parent.activeView.getPanel();
        this.fields = this.parent.eventFields;
        this.animation = new Animation({ progress: this.animationUiUpdate.bind(this) });
        this.addEventListener();
    }
    renderAppointments() {
        let wrapperElements = [].slice.call(this.parent.element.querySelectorAll('.' + BLOCK_APPOINTMENT_CLASS +
            ',.' + APPOINTMENT_CLASS + ',.' + ROW_COUNT_WRAPPER_CLASS));
        wrapperElements.forEach((element) => remove(element));
        if (!this.element.querySelector('.' + WORK_CELLS_CLASS)) {
            return;
        }
        this.allDayElement = [].slice.call(this.element.querySelectorAll('.' + ALLDAY_CELLS_CLASS));
        this.setAllDayRowHeight(0);
        if (this.parent.eventsProcessed.length === 0 && this.parent.blockProcessed.length === 0) {
            return;
        }
        let expandCollapse = this.element.querySelector('.' + ALLDAY_APPOINTMENT_SECTION_CLASS);
        EventHandler.remove(expandCollapse, 'click', this.rowExpandCollapse);
        EventHandler.add(expandCollapse, 'click', this.rowExpandCollapse, this);
        this.renderedEvents = [];
        this.renderedAllDayEvents = [];
        this.initializeValues();
        this.processBlockEvents();
        this.renderEvents('normalEvents');
        if (this.allDayEvents.length > 0) {
            this.allDayEvents = this.allDayEvents.filter((item, index, arr) => {
                return index === arr.map((item) => item.Guid).indexOf(item.Guid);
            });
            removeClass(this.allDayElement, ALLDAY_ROW_ANIMATE_CLASS);
            this.slots.push(this.parent.activeView.renderDates.map((date) => { return +date; }));
            this.renderEvents('allDayEvents');
        }
        this.parent.notify(contentReady, {});
        addClass(this.allDayElement, ALLDAY_ROW_ANIMATE_CLASS);
    }
    initializeValues() {
        this.resources = (this.parent.activeViewOptions.group.resources.length > 0) ? this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.lastResourceLevel : [];
        this.cellHeight = this.element.querySelector('.' + WORK_CELLS_CLASS).offsetHeight;
        this.dateRender[0] = this.parent.activeView.renderDates;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.resources.forEach((resource, index) => this.dateRender[index] = resource.renderDates);
        }
    }
    isValidEvent(eventObj, start, end, schedule) {
        let isHourRange = end.getTime() > schedule.startHour.getTime() && start.getTime() < schedule.endHour.getTime();
        let isSameRange = schedule.startHour.getTime() <= start.getTime() &&
            eventObj[this.fields.startTime].getTime() >= schedule.startHour.getTime() &&
            eventObj[this.fields.endTime].getTime() < schedule.endHour.getTime() && start.getTime() === end.getTime();
        return isHourRange || isSameRange;
    }
    getHeight(start, end) {
        let appHeight = (end.getTime() - start.getTime()) / (60 * 1000) * (this.cellHeight * this.slotCount) / this.interval;
        appHeight = (appHeight < this.cellHeight) ? this.cellHeight : appHeight;
        return appHeight;
    }
    appendEvent(eventObj, appointmentElement, index, appLeft) {
        let appointmentWrap = [].slice.call(this.element.querySelectorAll('.' + APPOINTMENT_WRAPPER_CLASS));
        if (this.parent.enableRtl) {
            setStyleAttribute(appointmentElement, { 'right': appLeft });
        }
        else {
            setStyleAttribute(appointmentElement, { 'left': appLeft });
        }
        let eventType = appointmentElement.classList.contains(BLOCK_APPOINTMENT_CLASS) ? 'blockEvent' : 'event';
        let args = { data: eventObj, element: appointmentElement, cancel: false, type: eventType };
        this.parent.trigger(eventRendered, args);
        if (args.cancel) {
            return;
        }
        appointmentWrap[index].appendChild(appointmentElement);
    }
    processBlockEvents() {
        let resources = this.getResourceList();
        let dateCount = 0;
        for (let resource of resources) {
            let renderDates = this.dateRender[resource];
            for (let day = 0, length = renderDates.length; day < length; day++) {
                let startDate = new Date(renderDates[day].getTime());
                let endDate = addDays(renderDates[day], 1);
                let filterEvents = this.filterEvents(startDate, endDate, this.parent.blockProcessed, this.resources[resource]);
                for (let event of filterEvents) {
                    if (this.parent.resourceBase) {
                        this.setValues(event, resource);
                    }
                    this.renderBlockEvents(event, day, resource, dateCount);
                    this.cssClass = null;
                    this.groupOrder = null;
                }
                dateCount += 1;
            }
        }
    }
    renderBlockEvents(eventObj, dayIndex, resource, dayCount) {
        let spannedData = this.isSpannedEvent(eventObj, dayIndex, resource);
        let eStart = spannedData[this.fields.startTime];
        let eEnd = spannedData[this.fields.endTime];
        let currentDate = resetTime(new Date(this.dateRender[resource][dayIndex].getTime()));
        let schedule = getStartEndHours(currentDate, this.startHour, this.endHour);
        if (eStart <= eEnd && this.isValidEvent(eventObj, eStart, eEnd, schedule)) {
            let blockTop;
            let blockHeight;
            if (spannedData[this.fields.isAllDay]) {
                let contentWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS + ' table');
                blockHeight = formatUnit(contentWrap.offsetHeight);
                blockTop = formatUnit(0);
            }
            else {
                blockHeight = formatUnit(this.getHeight(eStart, eEnd));
                blockTop = formatUnit(this.getTopValue(eStart, dayIndex, resource));
            }
            let appointmentElement = this.createBlockAppointmentElement(eventObj, resource);
            setStyleAttribute(appointmentElement, { 'width': '100%', 'height': blockHeight, 'top': blockTop });
            let index = this.parent.activeViewOptions.group.byDate ? (this.resources.length * dayIndex) + resource : dayCount;
            this.appendEvent(eventObj, appointmentElement, index, '0px');
        }
    }
    renderEvents(eventType) {
        removeClass(this.allDayElement, ALLDAY_ROW_ANIMATE_CLASS);
        let eventCollection = (eventType === 'allDayEvents') ? this.sortByDateTime(this.allDayEvents) : undefined;
        let resources = this.getResourceList();
        let dateCount = 0;
        for (let resource of resources) {
            let renderDates = this.dateRender[resource];
            for (let day = 0, length = renderDates.length; day < length; day++) {
                this.renderedEvents = [];
                let startDate = new Date(renderDates[day].getTime());
                let endDate = addDays(renderDates[day], 1);
                let filterEvents = this.filterEvents(startDate, endDate, eventCollection, this.resources[resource]);
                for (let event of filterEvents) {
                    if (this.parent.resourceBase) {
                        this.setValues(event, resource);
                    }
                    if (eventType === 'allDayEvents') {
                        this.renderAllDayEvents(event, day, resource, dateCount);
                    }
                    else {
                        if (this.isAllDayAppointment(event)) {
                            this.allDayEvents.push(extend({}, event, null, true));
                        }
                        else {
                            this.renderNormalEvents(event, day, resource, dateCount);
                        }
                    }
                    this.cssClass = null;
                    this.groupOrder = null;
                }
                dateCount += 1;
            }
        }
    }
    setValues(event, resourceIndex) {
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.cssClass = this.resources[resourceIndex].cssClass;
            this.groupOrder = this.resources[resourceIndex].groupOrder;
        }
        else {
            this.cssClass = this.parent.resourceBase.getCssClass(event);
        }
    }
    getResourceList() {
        let resources = Array.apply(null, {
            length: (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) ?
                this.resources.length : 1
        }).map((value, index) => { return index; });
        return resources;
    }
    createAppointmentElement(record, isAllDay, data, resource) {
        let fieldMapping = this.parent.eventFields;
        let recordSubject = (record[fieldMapping.subject] || this.parent.eventSettings.fields.subject.default);
        let appointmentWrapper = createElement('div', {
            className: APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[fieldMapping.id],
                'data-guid': record.Guid,
                'role': 'button',
                'tabindex': '0',
                'aria-readonly': this.parent.eventBase.getReadonlyAttribute(record),
                'aria-selected': 'false',
                'aria-grabbed': 'true',
                'aria-label': recordSubject
            }
        });
        if (record[this.fields.isReadonly]) {
            addClass([appointmentWrapper], 'e-read-only');
        }
        let appointmentDetails = createElement('div', { className: APPOINTMENT_DETAILS });
        appointmentWrapper.appendChild(appointmentDetails);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            let resourceIndex = this.parent.isAdaptive ? this.parent.uiStateValues.groupIndex : resource;
            appointmentWrapper.setAttribute('data-group-index', resourceIndex.toString());
        }
        let templateElement;
        let eventData = data;
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            templateElement = this.parent.getAppointmentTemplate()(record);
        }
        else {
            let appointmentSubject = createElement('div', { className: SUBJECT_CLASS, innerHTML: recordSubject });
            if (isAllDay) {
                if (record[fieldMapping.isAllDay]) {
                    templateElement = [appointmentSubject];
                }
                else {
                    templateElement = [];
                    let appointmentStartTime = createElement('div', {
                        className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''),
                        innerHTML: this.parent.getTimeString(record[fieldMapping.startTime])
                    });
                    let appointmentEndTime = createElement('div', {
                        className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''),
                        innerHTML: this.parent.getTimeString(record[fieldMapping.endTime]),
                    });
                    addClass([appointmentSubject], 'e-text-center');
                    if (!eventData.isLeft) {
                        templateElement.push(appointmentStartTime);
                    }
                    templateElement.push(appointmentSubject);
                    if (!eventData.isRight) {
                        templateElement.push(appointmentEndTime);
                    }
                }
            }
            else {
                let timeStr = this.parent.getTimeString(record[fieldMapping.startTime]) + ' - ' +
                    this.parent.getTimeString(record[fieldMapping.endTime]);
                let appointmentTime = createElement('div', {
                    className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''),
                    innerHTML: timeStr,
                });
                let appointmentLocation = createElement('div', {
                    className: LOCATION_CLASS,
                    innerHTML: (record[fieldMapping.location] || this.parent.eventSettings.fields.location.default || '')
                });
                templateElement = [appointmentSubject, appointmentTime, appointmentLocation];
            }
        }
        append(templateElement, appointmentDetails);
        if (!this.parent.isAdaptive &&
            (!isNullOrUndefined(record[fieldMapping.recurrenceRule]) || !isNullOrUndefined(record[fieldMapping.recurrenceID]))) {
            let iconClass = (record[fieldMapping.id] === record[fieldMapping.recurrenceID]) ?
                EVENT_RECURRENCE_ICON_CLASS : EVENT_RECURRENCE_EDIT_ICON_CLASS;
            let recurrenceIcon = createElement('div', { className: ICON + ' ' + iconClass });
            isAllDay ? appointmentDetails.appendChild(recurrenceIcon) : appointmentWrapper.appendChild(recurrenceIcon);
        }
        this.renderSpannedIcon(isAllDay ? appointmentDetails : appointmentWrapper, eventData);
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        this.applyResourceColor(appointmentWrapper, record, 'backgroundColor', this.groupOrder);
        this.renderResizeHandler(appointmentWrapper, eventData, record[this.fields.isReadonly]);
        return appointmentWrapper;
    }
    createMoreIndicator(allDayRow, count, currentDay) {
        let index = currentDay + count;
        let countWrapper = allDayRow[index];
        if (countWrapper.childElementCount <= 0) {
            let innerCountWrap = createElement('div', {
                className: ROW_COUNT_WRAPPER_CLASS,
                id: ROW_COUNT_WRAPPER_CLASS + '-' + index.toString()
            });
            let moreIndicatorElement = createElement('div', {
                className: MORE_INDICATOR_CLASS,
                attrs: { 'tabindex': '0', 'data-index': index.toString(), 'data-count': '1' },
                innerHTML: '+1&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more'))
            });
            innerCountWrap.appendChild(moreIndicatorElement);
            countWrapper.appendChild(innerCountWrap);
            EventHandler.add(moreIndicatorElement, 'click', this.rowExpandCollapse, this);
        }
        else {
            let countCell = countWrapper.querySelector('.' + MORE_INDICATOR_CLASS);
            let moreCount = parseInt(countCell.getAttribute('data-count'), 10) + 1;
            countCell.setAttribute('data-count', moreCount.toString());
            countCell.innerHTML = '+' + moreCount + '&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more'));
        }
    }
    renderSpannedIcon(element, spanEvent) {
        let iconElement = createElement('div', { className: EVENT_INDICATOR_CLASS + ' ' + ICON });
        if (spanEvent.isLeft) {
            let iconLeft = iconElement.cloneNode();
            addClass([iconLeft], EVENT_ICON_LEFT_CLASS);
            prepend([iconLeft], element);
        }
        if (spanEvent.isRight) {
            let iconRight = iconElement.cloneNode();
            addClass([iconRight], EVENT_ICON_RIGHT_CLASS);
            append([iconRight], element);
        }
        if (spanEvent.isTop) {
            let iconTop = iconElement.cloneNode();
            addClass([iconTop], EVENT_ICON_UP_CLASS);
            prepend([iconTop], element);
        }
        if (spanEvent.isBottom) {
            let iconBottom = iconElement.cloneNode();
            addClass([iconBottom], EVENT_ICON_DOWN_CLASS);
            append([iconBottom], element);
        }
    }
    isSpannedEvent(record, day, resource) {
        let currentDate = resetTime(this.dateRender[resource][day]);
        let fieldMapping = this.parent.eventFields;
        let startEndHours = getStartEndHours(currentDate, this.startHour, this.endHour);
        let event = extend({}, record, null, true);
        event.isSpanned = { isBottom: false, isTop: false };
        if (record[fieldMapping.startTime].getTime() < startEndHours.startHour.getTime()) {
            event[fieldMapping.startTime] = startEndHours.startHour;
            event.isSpanned.isTop = true;
        }
        if (record[fieldMapping.endTime].getTime() > startEndHours.endHour.getTime()) {
            event[fieldMapping.endTime] = startEndHours.endHour;
            event.isSpanned.isBottom = true;
        }
        return event;
    }
    renderAllDayEvents(eventObj, dayIndex, resource, dayCount) {
        let currentDates = this.dateRender[resource];
        if (this.parent.activeViewOptions.group.byDate) {
            this.slots[0] = [this.dateRender[resource][dayIndex].getTime()];
            currentDates = [this.dateRender[resource][dayIndex]];
        }
        let record = this.splitEvent(eventObj, currentDates)[0];
        let allDayRowCell = this.element.querySelector('.' + ALLDAY_CELLS_CLASS + ':first-child');
        let cellTop = allDayRowCell.offsetTop;
        let eStart = new Date(record[this.parent.eventFields.startTime].getTime());
        let eEnd = new Date(record[this.parent.eventFields.endTime].getTime());
        let appWidth = 0;
        let topValue = 1;
        let isDateRange = currentDates[0].getTime() <= eStart.getTime() &&
            addDays(currentDates.slice(-1)[0], 1).getTime() >= eStart.getTime();
        if (eStart <= eEnd && isDateRange) {
            let isAlreadyRendered = [];
            if (this.renderedAllDayEvents[resource]) {
                isAlreadyRendered = this.renderedAllDayEvents[resource].filter((event) => event.Guid === eventObj.Guid);
                if (this.parent.activeViewOptions.group.byDate) {
                    isAlreadyRendered = isAlreadyRendered.filter((event) => event[this.parent.eventFields.startTime] >= currentDates[dayIndex] &&
                        event[this.parent.eventFields.endTime] <= addDays(new Date(+currentDates[dayIndex]), 1));
                }
            }
            if (isAlreadyRendered.length === 0) {
                let allDayDifference = record.data.count;
                let allDayIndex = this.getOverlapIndex(record, dayIndex, true, resource);
                record.Index = allDayIndex;
                this.allDayLevel = (this.allDayLevel < allDayIndex) ? allDayIndex : this.allDayLevel;
                let widthAdjustment = record.data.isRight ? 0 :
                    this.parent.currentView === 'Day' ? 4 : 7;
                if (allDayDifference >= 0) {
                    appWidth = (allDayDifference * 100) - widthAdjustment;
                }
                if (isNullOrUndefined(this.renderedAllDayEvents[resource])) {
                    this.renderedAllDayEvents[resource] = [];
                }
                this.renderedAllDayEvents[resource].push(extend({}, record, null, true));
                let allDayRow = [].slice.call(this.element.querySelector('.' + ALLDAY_ROW_CLASS).children);
                let wIndex = this.parent.activeViewOptions.group.byDate ? (this.resources.length * dayIndex) + resource : dayCount;
                let eventWrapper = this.element.querySelector('.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS +
                    ':nth-child(' + (wIndex + 1) + ')');
                let appointmentElement = this.createAppointmentElement(eventObj, true, record.data, resource);
                addClass([appointmentElement], ALLDAY_APPOINTMENT_CLASS);
                let args = { data: eventObj, element: appointmentElement, cancel: false };
                this.parent.trigger(eventRendered, args);
                if (args.cancel) {
                    return;
                }
                eventWrapper.appendChild(appointmentElement);
                let appHeight = appointmentElement.offsetHeight;
                topValue += (allDayIndex === 0 ? cellTop : (cellTop + (allDayIndex * appHeight))) + 1;
                setStyleAttribute(appointmentElement, { 'width': appWidth + '%', 'top': topValue + 'px' });
                if (allDayIndex > 1) {
                    this.moreEvents.push(appointmentElement);
                    for (let count = 0, length = allDayDifference; count < length; count++) {
                        this.createMoreIndicator(allDayRow, count, wIndex);
                    }
                }
                allDayRowCell.setAttribute('data-count', this.allDayLevel.toString());
                let allDayRowHeight = ((!this.parent.uiStateValues.expand && this.allDayLevel > 2) ?
                    (3 * appHeight) : ((this.allDayLevel + 1) * appHeight)) + 4;
                this.setAllDayRowHeight(allDayRowHeight);
                this.addOrRemoveClass();
                this.wireAppointmentEvents(appointmentElement, true, eventObj);
            }
        }
    }
    renderNormalEvents(eventObj, dayIndex, resource, dayCount) {
        let record = this.isSpannedEvent(eventObj, dayIndex, resource);
        let eStart = record[this.fields.startTime];
        let eEnd = record[this.fields.endTime];
        let appWidth = '0%';
        let appLeft = '0%';
        let topValue = 0;
        let currentDate = resetTime(new Date(this.dateRender[resource][dayIndex].getTime()));
        let schedule = getStartEndHours(currentDate, this.startHour, this.endHour);
        let isValidEvent = this.isValidEvent(eventObj, eStart, eEnd, schedule);
        if (eStart <= eEnd && isValidEvent) {
            let appHeight = this.getHeight(eStart, eEnd);
            if (eStart.getTime() > schedule.startHour.getTime()) {
                topValue = this.getTopValue(eStart, dayIndex, resource);
            }
            let appIndex = this.getOverlapIndex(record, dayIndex, false, resource);
            record.Index = appIndex;
            this.overlapList.push(record);
            if (this.overlapList.length > 1) {
                if (isNullOrUndefined(this.overlapEvents[appIndex])) {
                    this.overlapEvents[appIndex] = [];
                }
                this.overlapEvents[appIndex].push(record);
            }
            else {
                this.overlapEvents = [];
                this.overlapEvents.push([record]);
            }
            let width = this.parent.currentView === 'Day' ? 97 : 94;
            appWidth = ((width - this.overlapEvents.length) / this.overlapEvents.length) + '%';
            let argsData = {
                index: appIndex, left: appLeft, width: appWidth,
                day: dayIndex, dayIndex: dayCount, record: record, resource: resource
            };
            let tempData = this.adjustOverlapElements(argsData);
            appWidth = (tempData.appWidth);
            if (isNullOrUndefined(this.renderedEvents[resource])) {
                this.renderedEvents[resource] = [];
            }
            this.renderedEvents[resource].push(extend({}, record, null, true));
            let appointmentElement = this.createAppointmentElement(eventObj, false, record.isSpanned, resource);
            setStyleAttribute(appointmentElement, { 'width': tempData.appWidth, 'height': appHeight + 'px', 'top': topValue + 'px' });
            let iconHeight = appointmentElement.querySelectorAll('.' + EVENT_INDICATOR_CLASS).length * 15;
            let maxHeight = appHeight - 40 - iconHeight;
            let subjectElement = appointmentElement.querySelector('.' + SUBJECT_CLASS);
            if (!this.parent.isAdaptive && subjectElement) {
                subjectElement.style.maxHeight = formatUnit(maxHeight);
            }
            let index = this.parent.activeViewOptions.group.byDate ? (this.resources.length * dayIndex) + resource : dayCount;
            this.appendEvent(eventObj, appointmentElement, index, tempData.appLeft);
            this.wireAppointmentEvents(appointmentElement, false, eventObj);
        }
    }
    getTopValue(date, day, resource) {
        let startEndHours = getStartEndHours(resetTime(this.dateRender[resource][day]), this.startHour, this.endHour);
        let startHour = startEndHours.startHour;
        let diffInMinutes = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        return (diffInMinutes * this.cellHeight * this.slotCount) / this.interval;
    }
    getOverlapIndex(record, day, isAllDay, resource) {
        let fieldMapping = this.parent.eventFields;
        let predicate;
        let eventsList = [];
        let appIndex = -1;
        this.overlapEvents = [];
        if (isAllDay) {
            if (!isNullOrUndefined(this.renderedAllDayEvents[resource])) {
                let date = resetTime(new Date(this.dateRender[resource][day].getTime()));
                eventsList = this.renderedAllDayEvents[resource].filter((app) => resetTime(app[fieldMapping.startTime]).getTime() <= date.getTime() &&
                    resetTime(app[fieldMapping.endTime]).getTime() >= date.getTime());
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    eventsList = this.filterEventsByResource(this.resources[resource], eventsList);
                }
            }
        }
        else {
            let appointmentList = !isNullOrUndefined(this.renderedEvents[resource]) ? this.renderedEvents[resource] : [];
            let appointment = [];
            predicate = new Predicate(fieldMapping.endTime, 'greaterthan', record[fieldMapping.startTime]).
                and(new Predicate(fieldMapping.startTime, 'lessthan', record[fieldMapping.endTime]));
            this.overlapList = new DataManager({ json: appointmentList }).executeLocal(new Query().where(predicate));
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                this.overlapList = this.filterEventsByResource(this.resources[resource], this.overlapList);
            }
            this.overlapList.forEach((obj) => {
                predicate = new Predicate(fieldMapping.endTime, 'greaterthanorequal', obj[fieldMapping.startTime]).
                    and(new Predicate(fieldMapping.startTime, 'lessthanorequal', obj[fieldMapping.endTime]));
                let filterList = new DataManager({ json: appointmentList }).executeLocal(new Query().where(predicate));
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    filterList = this.filterEventsByResource(this.resources[resource], filterList);
                }
                let collection = this.overlapList.filter((val) => filterList.indexOf(val) === -1);
                return appointment.concat(collection);
            });
            this.overlapList = this.overlapList.concat(appointment);
            eventsList = this.overlapList;
            for (let event of eventsList) {
                let record = event;
                let index = record.Index;
                (isNullOrUndefined(this.overlapEvents[index])) ? this.overlapEvents[index] = [event] :
                    this.overlapEvents[index].push(event);
            }
        }
        if (eventsList.length > 0) {
            let appLevel = eventsList.map((obj) => obj.Index);
            appIndex = (appLevel.length > 0) ? this.getSmallestMissingNumber(appLevel) : 0;
        }
        return (appIndex === -1) ? 0 : appIndex;
    }
    adjustOverlapElements(args) {
        let data = { appWidth: args.width, appLeft: args.left };
        for (let i = 0, length1 = this.overlapEvents.length; i < length1; i++) {
            if (!isNullOrUndefined(this.overlapEvents[i])) {
                for (let j = 0, length2 = this.overlapEvents[i].length; j < length2; j++) {
                    let dayCount = this.parent.activeViewOptions.group.byDate ? (this.resources.length * args.day) + args.resource :
                        args.dayIndex;
                    let element = this.element.querySelector('#e-appointment-wrapper-' + dayCount);
                    if (element.childElementCount > 0) {
                        let eleGuid = this.overlapEvents[i][j].Guid;
                        if (element.querySelectorAll('div[data-guid="' + eleGuid + '"]').length > 0 && eleGuid !== args.record.Guid) {
                            let apps = element.querySelector('div[data-guid="' + eleGuid + '"]');
                            if (parseFloat(args.width) <= parseFloat(apps.style.width)) {
                                (this.parent.enableRtl) ? apps.style.right = ((parseFloat(args.width) + 1) * i) + '%' :
                                    apps.style.left = ((parseFloat(args.width) + 1) * i) + '%';
                                apps.style.width = ((parseFloat(args.width))) + '%';
                                data.appWidth = apps.style.width;
                            }
                        }
                        else {
                            let appWidth = args.width;
                            if (isNullOrUndefined(this.overlapEvents[i - 1])) {
                                let width = this.parent.currentView === 'Day' ? 97 : 94;
                                appWidth = ((width - this.overlapEvents.length) / this.overlapEvents.length) + '%';
                            }
                            data.appWidth = appWidth;
                            data.appLeft = ((parseInt(appWidth, 0) + 1) * args.index) + '%';
                        }
                    }
                }
            }
        }
        return data;
    }
    setAllDayRowHeight(height) {
        for (let element of this.allDayElement) {
            element.style.height = (height / 12) + 'em';
        }
        this.animation.animate(this.allDayElement[0]);
    }
    addOrRemoveClass() {
        this.moreEvents.filter((element) => {
            if (!this.parent.uiStateValues.expand && this.allDayLevel > 2) {
                addClass([element], EVENT_COUNT_CLASS);
                element.setAttribute('tabindex', '-1');
            }
            else {
                removeClass([element], EVENT_COUNT_CLASS);
                element.setAttribute('tabindex', '0');
            }
        });
        let moreEventCount = this.element.querySelector('.' + ALLDAY_APPOINTMENT_SECTION_CLASS);
        if (this.parent.uiStateValues.expand) {
            removeClass([moreEventCount], APPOINTMENT_ROW_EXPAND_CLASS);
            addClass([moreEventCount], APPOINTMENT_ROW_COLLAPSE_CLASS);
        }
        else {
            removeClass([moreEventCount], APPOINTMENT_ROW_COLLAPSE_CLASS);
            addClass([moreEventCount], APPOINTMENT_ROW_EXPAND_CLASS);
        }
        (this.allDayLevel > 2) ? removeClass([moreEventCount], DISABLE_CLASS) : addClass([moreEventCount], DISABLE_CLASS);
        let countCell = [].slice.call(this.element.querySelectorAll('.' + ROW_COUNT_WRAPPER_CLASS));
        countCell.filter((element) => {
            (!this.parent.uiStateValues.expand && this.allDayLevel > 2) ? removeClass([element], DISABLE_CLASS) :
                addClass([element], DISABLE_CLASS);
        });
    }
    getEventHeight() {
        let eventElement = createElement('div', { className: APPOINTMENT_CLASS, styles: 'visibility:hidden' });
        let eventWrapper = this.element.querySelector('.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS + ':first-child');
        eventWrapper.appendChild(eventElement);
        let height = eventElement.offsetHeight;
        remove(eventElement);
        return height;
    }
    rowExpandCollapse() {
        let target = this.element.querySelector('.' + ALLDAY_APPOINTMENT_SECTION_CLASS);
        this.parent.uiStateValues.expand = target.classList.contains(APPOINTMENT_ROW_EXPAND_CLASS);
        let rowHeight;
        if (this.parent.uiStateValues.expand) {
            target.setAttribute('title', 'Collapse-all-day-section');
            target.setAttribute('aria-label', 'Collapse section');
            rowHeight = ((this.allDayLevel + 1) * this.getEventHeight()) + 4;
        }
        else {
            target.setAttribute('title', 'Expand-all-day-section');
            target.setAttribute('aria-label', 'Expand section');
            rowHeight = (3 * this.getEventHeight()) + 4;
        }
        this.setAllDayRowHeight(rowHeight);
        this.addOrRemoveClass();
        this.animation.animate(target);
    }
    animationUiUpdate() {
        this.parent.notify(contentReady, {});
    }
}

const EVENT_GAP = 0;
/**
 * Month view events render
 */
class MonthEvent extends EventBase {
    /**
     * Constructor for month events
     */
    constructor(parent) {
        super(parent);
        this.renderedEvents = [];
        this.moreIndicatorHeight = 19;
        this.renderType = 'day';
        this.element = this.parent.activeView.getPanel();
        this.fields = this.parent.eventFields;
        this.addEventListener();
    }
    renderAppointments() {
        let appointmentWrapper = [].slice.call(this.element.querySelectorAll('.' + APPOINTMENT_WRAPPER_CLASS));
        for (let wrap of appointmentWrapper) {
            remove(wrap);
        }
        this.removeHeightProperty(CONTENT_TABLE_CLASS);
        if (!this.element.querySelector('.' + WORK_CELLS_CLASS)) {
            return;
        }
        this.eventHeight = getElementHeightFromClass(this.element, APPOINTMENT_CLASS);
        if (this.parent.currentView === 'Month') {
            this.monthHeaderHeight = getOuterHeight(this.element.querySelector('.' + DATE_HEADER_CLASS));
        }
        else {
            this.monthHeaderHeight = 0;
        }
        let conWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        let scrollTop = conWrap.scrollTop;
        if (this.parent.rowAutoHeight && this.parent.virtualScrollModule && !isNullOrUndefined(this.parent.currentAction)) {
            conWrap.scrollTop = conWrap.scrollTop - 1;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.renderResourceEvents();
        }
        else {
            this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays);
        }
        if (this.parent.rowAutoHeight) {
            this.updateBlockElements();
            let data = {
                cssProperties: this.parent.getCssProperties(),
                module: this.parent.getModuleName(),
                isPreventScrollUpdate: true
            };
            if (this.parent.virtualScrollModule) {
                if (this.parent.currentAction) {
                    conWrap.scrollTop = scrollTop;
                    this.parent.currentAction = null;
                }
                else {
                    this.parent.virtualScrollModule.updateVirtualScrollHeight();
                }
            }
            this.parent.notify(scrollUiUpdate, data);
        }
    }
    renderEventsHandler(dateRender, workDays, resData) {
        this.renderedEvents = [];
        let eventsList;
        let blockList;
        let resIndex = 0;
        if (resData) {
            resIndex = resData.groupIndex;
            this.cssClass = resData.cssClass;
            this.groupOrder = resData.groupOrder;
            eventsList = this.parent.eventBase.filterEventsByResource(resData, this.parent.eventsProcessed);
            blockList = this.parent.eventBase.filterEventsByResource(resData, this.parent.blockProcessed);
            this.workCells = [].slice.call(this.element.querySelectorAll('.' + WORK_CELLS_CLASS + '[data-group-index="' + resIndex + '"]'));
        }
        else {
            eventsList = this.parent.eventsProcessed;
            blockList = this.parent.blockProcessed;
            this.workCells = [].slice.call(this.element.querySelectorAll('.' + WORK_CELLS_CLASS));
        }
        this.sortByDateTime(eventsList);
        this.sortByDateTime(blockList);
        this.cellWidth = this.workCells.slice(-1)[0].offsetWidth;
        this.cellHeight = this.workCells.slice(-1)[0].offsetHeight;
        this.dateRender = dateRender;
        this.getSlotDates(workDays);
        this.processBlockEvents(blockList, resIndex, resData);
        for (let event of eventsList) {
            if (this.parent.resourceBase && !resData) {
                this.cssClass = this.parent.resourceBase.getCssClass(event);
            }
            let splittedEvents = this.splitEvent(event, this.dateRender);
            for (let event of splittedEvents) {
                this.updateIndicatorIcon(event);
                this.renderEvents(event, resIndex);
            }
        }
        this.cssClass = null;
        this.groupOrder = null;
    }
    processBlockEvents(blockEvents, resIndex, resData) {
        for (let event of blockEvents) {
            if (this.parent.resourceBase && !resData) {
                this.cssClass = this.parent.resourceBase.getCssClass(event);
            }
            let blockSpannedList = [];
            if (this.renderType === 'day' && !event[this.fields.isAllDay]) {
                let temp = extend({}, event, null, true);
                let isSameDate = this.isSameDate(temp[this.fields.startTime], temp[this.fields.endTime]);
                temp.isBlockIcon = isSameDate;
                if (!isSameDate && getDateInMs(temp[this.fields.startTime]) > 0) {
                    let e = extend({}, event, null, true);
                    e[this.fields.endTime] = addDays(resetTime(new Date(event[this.fields.startTime] + '')), 1);
                    e.isBlockIcon = true;
                    temp[this.fields.startTime] = e[this.fields.endTime];
                    blockSpannedList.push(e);
                }
                isSameDate = this.isSameDate(temp[this.fields.startTime], temp[this.fields.endTime]);
                if (!isSameDate && getDateInMs(temp[this.fields.endTime]) > 0) {
                    let e = extend({}, event, null, true);
                    e[this.fields.startTime] = resetTime(new Date(event[this.fields.endTime] + ''));
                    e.isBlockIcon = true;
                    blockSpannedList.push(e);
                    temp[this.fields.endTime] = e[this.fields.startTime];
                }
                blockSpannedList.push(temp);
            }
            else {
                blockSpannedList.push(event);
            }
            for (let blockEvent of blockSpannedList) {
                let splittedEvents = this.splitEvent(blockEvent, this.dateRender);
                for (let event of splittedEvents) {
                    this.renderBlockEvents(event, resIndex, !!blockEvent.isBlockIcon);
                }
            }
        }
    }
    isSameDate(start, end) {
        return new Date(+start).setHours(0, 0, 0, 0) === new Date(+end).setHours(0, 0, 0, 0);
    }
    renderBlockEvents(event, resIndex, isIcon) {
        let eventData = event.data;
        let startTime = this.getStartTime(event, eventData);
        let endTime = this.getEndTime(event, eventData);
        let day = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime())));
        if (day < 0 || startTime > endTime) {
            return;
        }
        let cellTd = this.getCellTd(day);
        let position = this.getPosition(startTime, endTime, event[this.fields.isAllDay], day);
        if (!isIcon) {
            let diffInDays = eventData.count;
            let appWidth = this.getEventWidth(startTime, endTime, event[this.fields.isAllDay], diffInDays);
            appWidth = (appWidth <= 0) ? this.cellWidth : appWidth;
            let appLeft = (this.parent.enableRtl) ? 0 : position;
            let appRight = (this.parent.enableRtl) ? position : 0;
            let appHeight = this.cellHeight - this.monthHeaderHeight;
            let appTop = this.getRowTop(resIndex);
            let blockElement = this.createBlockAppointmentElement(event, resIndex);
            setStyleAttribute(blockElement, {
                'width': appWidth + 'px', 'height': appHeight + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
            });
            this.renderEventElement(event, blockElement, cellTd);
        }
        else {
            this.renderBlockIndicator(cellTd, position, resIndex);
        }
    }
    renderBlockIndicator(cellTd, position, resIndex) {
        let blockIndicator = createElement('div', { className: 'e-icons ' + BLOCK_INDICATOR_CLASS });
        if (isNullOrUndefined(cellTd.querySelector('.' + BLOCK_INDICATOR_CLASS))) {
            cellTd.appendChild(blockIndicator);
        }
    }
    getStartTime(event, eventData) {
        return event[this.fields.startTime];
    }
    getEndTime(event, eventData) {
        return event[this.fields.endTime];
    }
    getCellTd(day) {
        return this.workCells[day];
    }
    getEventWidth(startDate, endDate, isAllDay, count) {
        return count * this.cellWidth - 1;
    }
    getPosition(startTime, endTime, isAllDay, day) {
        return 0;
    }
    getRowTop(resIndex) {
        return 0;
    }
    updateIndicatorIcon(event) {
        if (this.parent.currentView.indexOf('Timeline') === -1 || this.parent.currentView === 'TimelineMonth'
            || event[this.fields.isAllDay]) {
            return;
        }
        let cloneData = event.data;
        let startHour = getStartEndHours(event[this.fields.startTime], this.parent.activeView.getStartHour(), this.parent.activeView.getEndHour());
        let endHour = getStartEndHours(event[this.fields.endTime], this.parent.activeView.getStartHour(), this.parent.activeView.getEndHour());
        cloneData.isLeft = cloneData.isLeft || cloneData[this.fields.startTime].getTime() < startHour.startHour.getTime();
        cloneData.isRight = cloneData.isRight || cloneData[this.fields.endTime].getTime() > endHour.endHour.getTime();
    }
    renderResourceEvents() {
        let resources = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.lastResourceLevel;
        for (let slotData of resources) {
            this.renderEventsHandler(slotData.renderDates, slotData.workDays, slotData);
        }
    }
    getSlotDates(workDays) {
        this.slots = [];
        let dates = this.dateRender.map((date) => { return +date; });
        let noOfDays = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH : workDays.length;
        while (dates.length > 0) {
            this.slots.push(dates.splice(0, noOfDays));
        }
    }
    createAppointmentElement(record, resIndex) {
        let eventSubject = (record[this.fields.subject] || this.parent.eventSettings.fields.subject.default);
        let appointmentWrapper = createElement('div', {
            className: APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.fields.id],
                'data-guid': record.Guid, 'role': 'button', 'tabindex': '0',
                'aria-readonly': this.parent.eventBase.getReadonlyAttribute(record), 'aria-selected': 'false', 'aria-grabbed': 'true',
                'aria-label': eventSubject
            }
        });
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        if (record[this.fields.isReadonly]) {
            addClass([appointmentWrapper], 'e-read-only');
        }
        let appointmentDetails = createElement('div', { className: APPOINTMENT_DETAILS });
        appointmentWrapper.appendChild(appointmentDetails);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            appointmentWrapper.setAttribute('data-group-index', resIndex.toString());
        }
        let templateElement;
        let eventData = record.data;
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            templateElement = this.parent.getAppointmentTemplate()(record);
        }
        else {
            let eventLocation = (record[this.fields.location] || this.parent.eventSettings.fields.location.default || '');
            let appointmentSubject = createElement('div', {
                className: SUBJECT_CLASS,
                innerHTML: (eventSubject + (eventLocation ? ';&nbsp' + eventLocation : ''))
            });
            let appointmentStartTime = createElement('div', {
                className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventData[this.fields.startTime])
            });
            let appointmentEndTime = createElement('div', {
                className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventData[this.fields.endTime])
            });
            if (this.parent.currentView === 'Month') {
                if (record[this.fields.isAllDay]) {
                    templateElement = [appointmentSubject];
                    addClass([appointmentSubject], 'e-text-center');
                }
                else if (eventData.count <= 1 && !eventData.isLeft && !eventData.isRight) {
                    templateElement = [appointmentStartTime, appointmentSubject];
                }
                else {
                    templateElement = [];
                    addClass([appointmentSubject], 'e-text-center');
                    if (!eventData.isLeft) {
                        templateElement.push(appointmentStartTime);
                    }
                    templateElement.push(appointmentSubject);
                    if (!eventData.isRight) {
                        templateElement.push(appointmentEndTime);
                    }
                }
            }
            else {
                let innerElement;
                if (record[this.fields.isAllDay]) {
                    let allDayString = createElement('div', {
                        className: APPOINTMENT_TIME, innerHTML: this.parent.localeObj.getConstant('allDay')
                    });
                    innerElement = [appointmentSubject, allDayString];
                }
                else {
                    let timeString = this.parent.getTimeString(eventData[this.fields.startTime])
                        + ' - ' + this.parent.getTimeString(eventData[this.fields.endTime]);
                    let appTime = createElement('div', {
                        className: APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : ''), innerHTML: timeString,
                    });
                    let appLocation = createElement('div', { className: LOCATION_CLASS, innerHTML: eventLocation });
                    innerElement = [appointmentSubject, appTime, appLocation];
                }
                let wrap = createElement('div', { className: 'e-inner-wrap' });
                append(innerElement, wrap);
                templateElement = [wrap];
            }
        }
        append(templateElement, appointmentDetails);
        this.appendEventIcons(record, appointmentDetails);
        this.renderResizeHandler(appointmentWrapper, record.data, record[this.fields.isReadonly]);
        return appointmentWrapper;
    }
    appendEventIcons(record, appointmentDetails) {
        let eventData = record.data;
        if (!isNullOrUndefined(record[this.fields.recurrenceRule]) || !isNullOrUndefined(record[this.fields.recurrenceID])) {
            let iconClass = (record[this.fields.id] === record[this.fields.recurrenceID]) ?
                EVENT_RECURRENCE_ICON_CLASS : EVENT_RECURRENCE_EDIT_ICON_CLASS;
            appointmentDetails.appendChild(createElement('div', {
                className: ICON + ' ' + iconClass + (this.parent.isAdaptive ? ' ' + DISABLE_CLASS : '')
            }));
        }
        if (eventData.isLeft) {
            let iconLeft = createElement('div', {
                className: EVENT_INDICATOR_CLASS + ' ' + ICON + ' ' + EVENT_ICON_LEFT_CLASS
            });
            prepend([iconLeft], appointmentDetails);
        }
        if (eventData.isRight) {
            let iconRight = createElement('div', {
                className: EVENT_INDICATOR_CLASS + ' ' + ICON + ' ' + EVENT_ICON_RIGHT_CLASS
            });
            append([iconRight], appointmentDetails);
        }
    }
    renderEvents(event, resIndex) {
        let startTime = event[this.fields.startTime];
        let endTime = event[this.fields.endTime];
        let day = this.parent.getIndexOfDate(this.dateRender, resetTime(startTime));
        if (day < 0) {
            return;
        }
        let overlapCount = this.getIndex(startTime);
        event.Index = overlapCount;
        let appHeight = this.eventHeight;
        this.renderedEvents.push(extend({}, event, null, true));
        let diffInDays = event.data.count;
        if (startTime.getTime() <= endTime.getTime()) {
            let appWidth = (diffInDays * this.cellWidth) - 3;
            let cellTd = this.workCells[day];
            let appTop = (overlapCount * (appHeight + EVENT_GAP));
            let height = this.monthHeaderHeight + ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight;
            if ((this.cellHeight > height) || this.parent.rowAutoHeight) {
                let appointmentElement = this.createAppointmentElement(event, resIndex);
                this.applyResourceColor(appointmentElement, event, 'backgroundColor', this.groupOrder);
                this.wireAppointmentEvents(appointmentElement, false, event);
                setStyleAttribute(appointmentElement, { 'width': appWidth + 'px', 'top': appTop + 'px' });
                this.renderEventElement(event, appointmentElement, cellTd);
                if (this.parent.rowAutoHeight) {
                    let firstChild = cellTd.parentElement.firstChild;
                    this.updateCellHeight(firstChild, height);
                }
            }
            else {
                for (let i = 0; i < diffInDays; i++) {
                    let cellTd = this.workCells[day + i];
                    if (cellTd && isNullOrUndefined(cellTd.querySelector('.' + MORE_INDICATOR_CLASS))) {
                        let startDate = new Date(this.dateRender[day + i].getTime());
                        let endDate = addDays(this.dateRender[day + i], 1);
                        let groupIndex = cellTd.getAttribute('data-group-index');
                        let filterEvents = this.getFilteredEvents(startDate, endDate, groupIndex);
                        let appArea = this.cellHeight - this.monthHeaderHeight - this.moreIndicatorHeight;
                        let renderedAppCount = Math.floor(appArea / (appHeight + EVENT_GAP));
                        let count = (filterEvents.length - renderedAppCount) <= 0 ? 1 : (filterEvents.length - renderedAppCount);
                        let moreIndicatorElement = this.getMoreIndicatorElement(count, startDate, endDate);
                        if (!isNullOrUndefined(groupIndex)) {
                            moreIndicatorElement.setAttribute('data-group-index', groupIndex);
                        }
                        moreIndicatorElement.style.top = appArea + 'px';
                        moreIndicatorElement.style.width = cellTd.offsetWidth - 2 + 'px';
                        this.renderElement(cellTd, moreIndicatorElement);
                        EventHandler.add(moreIndicatorElement, 'click', this.moreIndicatorClick, this);
                    }
                }
            }
        }
    }
    updateCellHeight(cell, height) {
        if ((height > cell.offsetHeight)) {
            setStyleAttribute(cell, { 'height': height + 'px' });
        }
    }
    updateBlockElements() {
        let blockElement = [].slice.call(this.element.querySelectorAll('.' + BLOCK_APPOINTMENT_CLASS));
        for (let element of blockElement) {
            let target = closest(element, 'tr');
            element.style.height = ((target.offsetHeight - 1) - this.monthHeaderHeight) + 'px';
            let firstChild = target.firstChild;
            let width = Math.round(element.offsetWidth / firstChild.offsetWidth);
            element.style.width = (firstChild.offsetWidth * width) + 'px';
        }
    }
    getFilteredEvents(startDate, endDate, groupIndex) {
        let filteredEvents;
        if (isNullOrUndefined(groupIndex)) {
            filteredEvents = this.filterEvents(startDate, endDate);
        }
        else {
            let data = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)];
            filteredEvents = this.filterEvents(startDate, endDate, undefined, data);
        }
        return filteredEvents;
    }
    getOverlapEvents(date, appointments) {
        let appointmentsList = [];
        for (let app of appointments) {
            if ((resetTime(app[this.fields.startTime]).getTime() <= resetTime(date).getTime()) &&
                (resetTime(app[this.fields.endTime]).getTime() >= resetTime(date).getTime())) {
                appointmentsList.push(app);
            }
        }
        return appointmentsList;
    }
    getIndex(date) {
        let appIndex = -1;
        let appointments = this.renderedEvents;
        if (appointments.length > 0) {
            let appointmentsList = this.getOverlapEvents(date, appointments);
            let appLevel = appointmentsList.map((obj) => { return obj.Index; });
            appIndex = (appLevel.length > 0) ? this.getSmallestMissingNumber(appLevel) : 0;
        }
        return (appIndex === -1) ? 0 : appIndex;
    }
    moreIndicatorClick(event) {
        let target = closest(event.target, '.' + MORE_INDICATOR_CLASS);
        let startDate = new Date(parseInt(target.getAttribute('data-start-date'), 10));
        if (!isNullOrUndefined(startDate) && this.parent.isAdaptive) {
            this.parent.setProperties({ selectedDate: startDate }, true);
            this.parent.changeView(this.parent.getNavigateView(), event);
        }
        else {
            let endDate = new Date(parseInt(target.getAttribute('data-end-date'), 10));
            let groupIndex = target.getAttribute('data-group-index');
            let filteredEvents = this.getFilteredEvents(startDate, endDate, groupIndex);
            let moreEventArgs = { date: startDate, event: filteredEvents, element: event.target };
            this.parent.quickPopup.moreEventClick(moreEventArgs, endDate, groupIndex);
        }
    }
    renderEventElement(event, appointmentElement, cellTd) {
        let eventType = appointmentElement.classList.contains(BLOCK_APPOINTMENT_CLASS) ? 'blockEvent' : 'event';
        let args = { data: event, element: appointmentElement, cancel: false, type: eventType };
        this.parent.trigger(eventRendered, args);
        if (args.cancel) {
            this.renderedEvents.pop();
            return;
        }
        this.renderElement(cellTd, appointmentElement);
    }
    renderElement(cellTd, element) {
        if (cellTd.querySelector('.' + APPOINTMENT_WRAPPER_CLASS)) {
            cellTd.querySelector('.' + APPOINTMENT_WRAPPER_CLASS).appendChild(element);
        }
        else {
            let wrapper = createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            wrapper.appendChild(element);
            cellTd.appendChild(wrapper);
        }
    }
    getMoreIndicatorElement(count, startDate, endDate) {
        let moreIndicatorElement = createElement('div', {
            className: MORE_INDICATOR_CLASS,
            innerHTML: '+' + count + '&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more')),
            attrs: {
                'tabindex': '0',
                'data-start-date': startDate.getTime().toString(),
                'data-end-date': endDate.getTime().toString()
            }
        });
        return moreIndicatorElement;
    }
    removeHeightProperty(selector) {
        let rows = [].slice.call(this.element.querySelectorAll('.' + selector + ' tbody tr'));
        for (let row of rows) {
            row.firstChild.style.height = '';
        }
    }
}

const MAJOR_SLOT_TEMPLATE = '<span>${getTime(date)}</span>';
const MINOR_SLOT_TEMPLATE = '&nbsp;';
/**
 * vertical view
 */
class VerticalView extends ViewBase {
    /**
     * Constructor for vertical view
     */
    constructor(parent) {
        super(parent);
        this.viewClass = 'e-day-view';
        this.isInverseTableSelect = true;
        this.baseCssClass = 'e-vertical-view';
        this.dateHeaderTemplate = '<div class="e-header-day">${getDayName(date)}</div>' +
            '<div class="e-header-date e-navigate" role="link">${getDate(date)}</div>';
        this.workCellAction = new WorkCellInteraction(parent);
    }
    addEventListener() {
        this.parent.on(scrollUiUpdate, this.scrollUiUpdate, this);
        this.parent.on(dataReady, this.renderEvents, this);
    }
    removeEventListener() {
        this.parent.off(scrollUiUpdate, this.scrollUiUpdate);
        this.parent.off(dataReady, this.renderEvents);
    }
    renderEvents() {
        if (this.parent.activeViewOptions.timeScale.enable) {
            let appointment = new VerticalEvent(this.parent);
            appointment.renderAppointments();
        }
        else {
            let appointment = new MonthEvent(this.parent);
            appointment.renderAppointments();
        }
    }
    onContentScroll(e) {
        this.parent.removeNewEventElement();
        let target = e.target;
        this.parent.notify(virtualScroll, e);
        this.scrollLeftPanel(target);
        this.scrollTopPanel(target);
        if (!this.parent.isAdaptive) {
            this.parent.uiStateValues.top = target.scrollTop;
        }
        this.parent.uiStateValues.left = target.scrollLeft;
        if (!isNullOrUndefined(this.parent.quickPopup)) {
            this.parent.quickPopup.quickPopupHide();
        }
    }
    onApaptiveMove(e) {
        if (this.parent.uiStateValues.action) {
            e.preventDefault();
        }
    }
    onApaptiveScroll(e) {
        this.parent.removeNewEventElement();
        this.parent.uiStateValues.top = e.target.scrollTop;
    }
    scrollLeftPanel(target) {
        let leftPanel = this.getLeftPanelElement();
        if (!isNullOrUndefined(leftPanel)) {
            leftPanel.scrollTop = target.scrollTop;
        }
    }
    scrollUiUpdate(args) {
        let headerBarHeight = this.getHeaderBarHeight();
        let timecells = this.getLeftPanelElement();
        let content = this.getScrollableElement();
        let header = this.getDatesHeaderElement();
        let scrollerHeight = this.parent.element.offsetHeight - headerBarHeight - header.offsetHeight;
        this.setContentHeight(content, timecells, scrollerHeight);
        let scrollBarWidth = getScrollBarWidth();
        // tslint:disable:no-any
        if (content.offsetWidth - content.clientWidth > 0) {
            header.firstChild.style[args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        }
        else {
            header.firstChild.style[args.cssProperties.border] = '';
            header.style[args.cssProperties.padding] = '';
        }
        // tslint:enable:no-any
        if (!args.isPreventScrollUpdate) {
            if (this.parent.uiStateValues.isInitial) {
                this.scrollToWorkHour();
                this.parent.uiStateValues.isInitial = false;
            }
            else {
                content.scrollTop = this.parent.uiStateValues.top;
                content.scrollLeft = this.parent.uiStateValues.left;
            }
        }
        this.setColWidth(content);
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.highlightCurrentTime();
        }
    }
    setContentHeight(element, leftPanelElement, height) {
        if (this.parent.isAdaptive && !this.isTimelineView()) {
            element.style.height = formatUnit(height);
        }
        else {
            if (!isNullOrUndefined(leftPanelElement)) {
                leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(element));
            }
            element.style.height = formatUnit(height);
        }
    }
    scrollToWorkHour() {
        if (this.parent.workHours.highlight) {
            let firstWorkHourCell = this.element.querySelector('.' + WORK_HOURS_CLASS);
            if (firstWorkHourCell) {
                this.getScrollableElement().scrollTop = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.top = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.left = 0;
            }
        }
    }
    scrollToHour(hour) {
        let date = this.parent.getStartEndTime(hour);
        if (isNullOrUndefined(date)) {
            return;
        }
        this.getScrollableElement().scrollTop = this.getTopFromDateTime(date);
    }
    generateColumnLevels() {
        let level = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        let columnLevels = [];
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            columnLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.lastResourceLevel.length > 0) {
                let resourceLevel = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                let resStartHour = resourceLevel.resourceData[resourceLevel.resource.startHourField];
                let resEndHour = resourceLevel.resourceData[resourceLevel.resource.endHourField];
                let dateSlots = this.getDateSlots(resourceLevel.renderDates, resourceLevel.workDays, resStartHour, resEndHour);
                columnLevels = [dateSlots];
            }
        }
        else {
            columnLevels.push(level);
        }
        this.colLevels = columnLevels;
        return columnLevels;
    }
    getDateSlots(renderDates, workDays, workStartHour = this.parent.workHours.start, workEndHour = this.parent.workHours.end) {
        let dateCol = [];
        let start = this.parent.getStartEndTime(workStartHour);
        let end = this.parent.getStartEndTime(workEndHour);
        for (let col of renderDates) {
            let classList$$1 = [HEADER_CELLS_CLASS];
            if (this.isCurrentDate(col)) {
                classList$$1.push(CURRENT_DAY_CLASS);
            }
            dateCol.push({
                date: col, type: 'dateHeader', className: classList$$1, colSpan: 1,
                workDays: workDays, startHour: new Date(+start), endHour: new Date(+end)
            });
        }
        return dateCol;
    }
    isWorkHourRange(date) {
        return (this.getStartHour().getTime() <= date.getTime()) && (this.getEndHour().getTime() >= date.getTime());
    }
    highlightCurrentTime() {
        if (this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return;
        }
        if (this.parent.showTimeIndicator && this.isWorkHourRange(new Date())) {
            let currentDateIndex = this.getCurrentTimeIndicatorIndex();
            if (currentDateIndex.length > 0) {
                this.changeCurrentTimePosition();
                if (isNullOrUndefined(this.currentTimeIndicatorTimer)) {
                    this.currentTimeIndicatorTimer = window.setInterval(() => { this.changeCurrentTimePosition(); }, MS_PER_MINUTE);
                }
            }
            else {
                this.clearCurrentTimeIndicatorTimer();
            }
        }
        else {
            this.clearCurrentTimeIndicatorTimer();
        }
    }
    getCurrentTimeIndicatorIndex() {
        let currentDateIndex = [];
        if (!isNullOrUndefined(this.parent.resourceBase) && (this.parent.activeViewOptions.group.resources.length > 0) &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            let count = 0;
            for (let resource of this.parent.resourceBase.lastResourceLevel) {
                let index = this.parent.getIndexOfDate(resource.renderDates, resetTime(new Date()));
                if (index >= 0) {
                    let resIndex = this.parent.activeViewOptions.group.byDate ?
                        (this.parent.resourceBase.lastResourceLevel.length * index) + count : count + index;
                    currentDateIndex.push(resIndex);
                }
                count += this.parent.activeViewOptions.group.byDate ? 1 : resource.renderDates.length;
            }
        }
        else {
            let renderDates = (this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.lastResourceLevel.length > 0) ?
                this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex].renderDates : this.renderDates;
            let index = this.parent.getIndexOfDate(renderDates, resetTime(new Date()));
            if (index >= 0) {
                currentDateIndex.push(index);
            }
        }
        return currentDateIndex;
    }
    clearCurrentTimeIndicatorTimer() {
        if (!isNullOrUndefined(this.currentTimeIndicatorTimer)) {
            window.clearInterval(this.currentTimeIndicatorTimer);
            this.currentTimeIndicatorTimer = null;
            this.removeCurrentTimeIndicatorElements();
        }
    }
    removeCurrentTimeIndicatorElements() {
        let queryString = '.' + PREVIOUS_TIMELINE_CLASS + ',.' + CURRENT_TIMELINE_CLASS + ',.' + CURRENT_TIME_CLASS;
        let timeIndicator = [].slice.call(this.element.querySelectorAll(queryString));
        timeIndicator.forEach((indicator) => remove(indicator));
    }
    changeCurrentTimePosition() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeCurrentTimeIndicatorElements();
        let currentDateIndex = this.getCurrentTimeIndicatorIndex();
        let firstRow = this.parent.getContentTable().rows[0];
        let top = this.getTopFromDateTime(new Date());
        let topInPx = formatUnit(top);
        let rowIndex = Math.floor(top / firstRow.cells[0].offsetHeight);
        if (isNullOrUndefined(rowIndex) || isNaN(rowIndex)) {
            return;
        }
        let curTimeWrap = this.element.querySelectorAll('.' + TIMELINE_WRAPPER_CLASS);
        for (let i = 0, length = currentDateIndex[0]; i < length; i++) {
            curTimeWrap[i].appendChild(createElement('div', { className: PREVIOUS_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        for (let day of currentDateIndex) {
            curTimeWrap[day].appendChild(createElement('div', { className: CURRENT_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        let currentTimeEle = createElement('div', {
            innerHTML: this.parent.getTimeString(new Date()),
            className: CURRENT_TIME_CLASS,
            styles: 'top:' + topInPx
        });
        let timeCellsWrap = this.getLeftPanelElement();
        removeClass(timeCellsWrap.querySelectorAll('.' + HIDE_CHILDS_CLASS), HIDE_CHILDS_CLASS);
        addClass([timeCellsWrap.querySelectorAll('tr')[rowIndex].lastChild], HIDE_CHILDS_CLASS);
        prepend([currentTimeEle], timeCellsWrap);
        currentTimeEle.style.top = formatUnit(currentTimeEle.offsetTop - (currentTimeEle.offsetHeight / 2));
    }
    getTopFromDateTime(date) {
        let startHour = this.getStartHour();
        let diffInMinutes = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        return (diffInMinutes * this.getWorkCellHeight() * this.parent.activeViewOptions.timeScale.slotCount) /
            this.parent.activeViewOptions.timeScale.interval;
    }
    getWorkCellHeight() {
        return this.element.querySelector('.' + WORK_CELLS_CLASS).offsetHeight;
    }
    getTdContent(date, type, groupIndex) {
        let cntEle;
        switch (type) {
            case 'dateHeader':
                if (this.parent.activeViewOptions.dateHeaderTemplate) {
                    let args = { date: date, type: type };
                    cntEle = this.parent.getDateHeaderTemplate()(args);
                }
                else {
                    cntEle = compile(this.dateHeaderTemplate, this.customHelper)({ date: date });
                }
                break;
            case 'majorSlot':
                if (this.parent.activeViewOptions.timeScale.majorSlotTemplate) {
                    let args = { date: date, type: type };
                    cntEle = this.parent.getMajorSlotTemplate()(args);
                }
                else {
                    cntEle = compile(MAJOR_SLOT_TEMPLATE, this.customHelper)({ date: date });
                }
                break;
            case 'minorSlot':
                if (this.parent.activeViewOptions.timeScale.minorSlotTemplate) {
                    let args = { date: date, type: type };
                    cntEle = this.parent.getMinorSlotTemplate()(args);
                }
                else {
                    cntEle = compile(MINOR_SLOT_TEMPLATE, this.customHelper)({ date: date });
                }
                break;
            case 'alldayCells':
                if (this.parent.activeViewOptions.cellTemplate) {
                    let args = { date: date, type: type, groupIndex: groupIndex };
                    cntEle = this.parent.getCellTemplate()(args);
                }
                break;
        }
        return cntEle;
    }
    renderLayout(type) {
        this.setPanel(createElement('div', { className: TABLE_WRAP_CLASS }));
        let clsList = [this.baseCssClass, this.viewClass];
        clsList.push(type);
        if (this.parent.activeViewOptions.group.byDate) {
            clsList.push('e-by-date');
        }
        if (!this.parent.activeViewOptions.timeScale.enable) {
            addClass([this.element], [TIMESCALE_DISABLE, this.viewClass]);
        }
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            clsList.push(VIRTUAL_SCROLL_CLASS);
        }
        this.renderPanel(type);
        addClass([this.element], clsList);
        this.element.appendChild(this.createTableLayout(OUTER_TABLE_CLASS));
        this.colLevels = this.generateColumnLevels();
        this.renderHeader();
        this.renderContent();
        if (this.parent.uiStateValues.isGroupAdaptive && !this.parent.element.querySelector('.' + RESOURCE_TOOLBAR_CONTAINER)) {
            this.renderResourceMobileLayout();
        }
        this.parent.notify(contentReady, {});
    }
    renderHeader() {
        let tr = createElement('tr');
        let dateTd = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        if (this.parent.activeViewOptions.timeScale.enable) {
            let indentTd = createElement('td', { className: LEFT_INDENT_CLASS });
            indentTd.appendChild(this.renderLeftIndent());
            tr.appendChild(indentTd);
        }
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    }
    renderContent() {
        let tr = createElement('tr');
        let workTd = createElement('td');
        if (this.parent.isAdaptive) {
            workTd.setAttribute('colspan', (this.parent.activeViewOptions.timeScale.enable ? '2' : '1'));
            let scrollContainer = createElement('div', { className: SCROLL_CONTAINER_CLASS });
            if (this.parent.activeViewOptions.timeScale.enable) {
                scrollContainer.appendChild(this.renderTimeCells());
            }
            scrollContainer.appendChild(this.renderContentArea());
            workTd.appendChild(scrollContainer);
            EventHandler.add(scrollContainer, 'scroll', this.onApaptiveScroll, this);
            EventHandler.add(scrollContainer, Browser.touchMoveEvent, this.onApaptiveMove, this);
            tr.appendChild(workTd);
        }
        else {
            workTd.appendChild(this.renderContentArea());
            if (this.parent.activeViewOptions.timeScale.enable) {
                let timesTd = createElement('td');
                timesTd.appendChild(this.renderTimeCells());
                tr.appendChild(timesTd);
            }
            tr.appendChild(workTd);
        }
        this.element.querySelector('tbody').appendChild(tr);
    }
    renderLeftIndent() {
        let wrap = createElement('div', { className: LEFT_INDENT_WRAP_CLASS });
        let tbl = this.createTableLayout();
        let trEle = createElement('tr');
        let rowCount = this.colLevels.length;
        for (let i = 0; i < rowCount; i++) {
            let ntr = trEle.cloneNode();
            let data = { className: [(this.colLevels[i][0] && this.colLevels[i][0].className[0])], type: 'emptyCells' };
            if (this.parent.activeViewOptions.showWeekNumber && data.className.indexOf(HEADER_CELLS_CLASS) !== -1) {
                data.className.push(WEEK_NUMBER_CLASS);
                let weekNo = getWeekNumber(this.renderDates.slice(-1)[0]);
                data.template = [createElement('span', {
                        innerHTML: '' + weekNo,
                        attrs: { title: this.parent.localeObj.getConstant('week') + ' ' + weekNo }
                    })];
            }
            ntr.appendChild(this.createTd(data));
            tbl.querySelector('tbody').appendChild(ntr);
        }
        let ntr = trEle.cloneNode();
        let appointmentExpandCollapse = createElement('div', {
            attrs: { 'tabindex': '0', title: 'Expand-all-day-section', 'aria-disabled': 'false', 'aria-label': 'Expand section' },
            className: ALLDAY_APPOINTMENT_SECTION_CLASS + ' ' + APPOINTMENT_ROW_EXPAND_CLASS + ' ' +
                ICON + ' ' + DISABLE_CLASS,
        });
        let data = { className: [ALLDAY_CELLS_CLASS], type: 'emptyCells' };
        let nth = this.createTd(data);
        nth.appendChild(appointmentExpandCollapse);
        ntr.appendChild(nth);
        tbl.querySelector('tbody').appendChild(ntr);
        wrap.appendChild(tbl);
        return wrap;
    }
    renderDatesHeader() {
        let container = createElement('div', { className: DATE_HEADER_CONTAINER_CLASS });
        let wrap = createElement('div', { className: DATE_HEADER_WRAP_CLASS });
        container.appendChild(wrap);
        let tbl = this.createTableLayout();
        let trEle = createElement('tr');
        let rowCount = this.colLevels.length;
        let lastLevel = this.colLevels[rowCount - 1];
        this.createColGroup(tbl, lastLevel);
        for (let i = 0; i < rowCount; i++) {
            let ntr = trEle.cloneNode();
            addClass([ntr], HEADER_ROW_CLASS);
            let level = this.colLevels[i];
            for (let j = 0; j < level.length; j++) {
                ntr.appendChild(this.createTd(level[j]));
            }
            tbl.querySelector('tbody').appendChild(ntr);
        }
        this.createAllDayRow(tbl, lastLevel);
        wrap.appendChild(tbl);
        return container;
    }
    createAllDayRow(table, tdData) {
        let ntr = createElement('tr');
        addClass([ntr], ALLDAY_ROW_CLASS);
        for (let j = 0; j < tdData.length; j++) {
            let td = extend({}, tdData[j]);
            td.className = [ALLDAY_CELLS_CLASS];
            td.type = 'alldayCells';
            let ntd = this.createTd(td);
            ntd.setAttribute('data-date', td.date.getTime().toString());
            if (!isNullOrUndefined(td.groupIndex)) {
                ntd.setAttribute('data-group-index', '' + td.groupIndex);
            }
            this.wireCellEvents(ntd);
            ntr.appendChild(ntd);
        }
        table.querySelector('tbody').appendChild(ntr);
        let thead = createElement('thead');
        thead.appendChild(this.createEventWrapper('allDay'));
        prepend([thead], table);
    }
    createTd(td) {
        let tdEle = createElement('td');
        this.addAttributes(td, tdEle);
        if (td.date && td.type) {
            let ele = this.getTdContent(td.date, td.type, td.groupIndex);
            if (ele && ele.length) {
                append([].slice.call(ele), tdEle);
            }
        }
        if (td.type === 'resourceHeader') {
            this.setResourceHeaderContent(tdEle, td);
        }
        if (td.type === 'dateHeader' && td.className.indexOf(HEADER_CELLS_CLASS) >= 0) {
            tdEle.setAttribute('data-date', td.date.getTime().toString());
            if (!isNullOrUndefined(td.groupIndex)) {
                tdEle.setAttribute('data-group-index', '' + td.groupIndex);
            }
            this.wireMouseEvents(tdEle);
        }
        let args = { elementType: td.type, element: tdEle, date: td.date, groupIndex: td.groupIndex };
        this.parent.trigger(renderCell, args);
        return tdEle;
    }
    wireCellEvents(element) {
        EventHandler.add(element, 'mousedown', this.workCellAction.cellMouseDown, this.workCellAction);
        this.wireMouseEvents(element);
    }
    wireMouseEvents(element) {
        EventHandler.add(element, 'click', this.workCellAction.cellClick, this.workCellAction);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'dblclick', this.workCellAction.cellDblClick, this.workCellAction);
        }
    }
    renderTimeCells() {
        let wrap = createElement('div', { className: TIME_CELLS_WRAP_CLASS });
        let tbl = this.createTableLayout();
        let trEle = createElement('tr');
        let handler = (r) => {
            r.type = r.first ? 'majorSlot' : 'minorSlot';
            r.className = r.last ? [TIME_CELLS_CLASS] : [];
            let ntr = trEle.cloneNode();
            let data = { date: r.date, type: r.type, className: r.className };
            ntr.appendChild(this.createTd(data));
            tbl.querySelector('tbody').appendChild(ntr);
            return r;
        };
        this.getTimeSlotRows(handler);
        wrap.appendChild(tbl);
        return wrap;
    }
    renderContentArea() {
        let wrap = createElement('div', { className: CONTENT_WRAP_CLASS });
        let tbl = this.createTableLayout(CONTENT_TABLE_CLASS);
        this.addAutoHeightClass(tbl);
        this.createColGroup(tbl, this.colLevels.slice(-1)[0]);
        this.renderContentTable(tbl);
        wrap.appendChild(tbl);
        this.wireCellEvents(tbl.querySelector('tbody'));
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        EventHandler.add(wrap, Browser.touchMoveEvent, this.onApaptiveMove, this);
        return wrap;
    }
    renderContentTable(table) {
        let tr = createElement('tr', { attrs: { role: 'row' } });
        let td = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        let tbody = table.querySelector('tbody');
        let handler = (r) => {
            let ntr = tr.cloneNode();
            for (let tdData of this.colLevels[this.colLevels.length - 1]) {
                let ntd = this.createContentTd(tdData, r, td);
                ntr.appendChild(ntd);
            }
            tbody.appendChild(ntr);
            return r;
        };
        this.getTimeSlotRows(handler);
        this.renderContentTableHeader(table);
    }
    createContentTd(tdData, r, td) {
        let ntd = td.cloneNode();
        if (tdData.colSpan) {
            ntd.setAttribute('colspan', tdData.colSpan.toString());
        }
        let clsName = this.getContentTdClass(r);
        let cellDate = resetTime(new Date('' + tdData.date));
        setTime(cellDate, getDateInMs(r.date));
        let type = 'workCells';
        if (tdData.className.indexOf(RESOURCE_PARENT_CLASS) !== -1) {
            clsName.push(RESOURCE_GROUP_CELLS_CLASS);
            type = 'resourceGroupCells';
        }
        if (this.parent.workHours.highlight && ((this.parent.activeViewOptions.timeScale.enable &&
            this.isWorkHour(cellDate, tdData.startHour, tdData.endHour, tdData.workDays)) ||
            (!this.parent.activeViewOptions.timeScale.enable && this.isWorkDay(cellDate, tdData.workDays)))) {
            clsName.push(WORK_HOURS_CLASS);
        }
        addClass([ntd], clsName);
        if (this.parent.activeViewOptions.cellTemplate) {
            let args = { date: cellDate, type: type, groupIndex: tdData.groupIndex };
            append([].slice.call(this.parent.getCellTemplate()(args)), ntd);
        }
        ntd.setAttribute('data-date', cellDate.getTime().toString());
        if (!isNullOrUndefined(tdData.groupIndex) || this.parent.uiStateValues.isGroupAdaptive) {
            let groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                tdData.groupIndex;
            ntd.setAttribute('data-group-index', '' + groupIndex);
        }
        let args = { elementType: type, element: ntd, date: cellDate, groupIndex: tdData.groupIndex };
        this.parent.trigger(renderCell, args);
        return ntd;
    }
    getContentTdClass(r) {
        return r.last ? [WORK_CELLS_CLASS] : [WORK_CELLS_CLASS, ALTERNATE_CELLS_CLASS];
    }
    renderContentTableHeader(table) {
        let thead = createElement('thead');
        thead.appendChild(this.createEventWrapper());
        if (this.parent.activeViewOptions.timeScale.enable) {
            thead.appendChild(this.createEventWrapper('timeIndicator'));
        }
        prepend([thead], table);
    }
    createEventWrapper(type = '') {
        let tr = createElement('tr');
        this.colLevels.slice(-1)[0].forEach((col, day) => {
            let appointmentWrap = createElement('td', {
                className: (type === 'allDay') ? ALLDAY_APPOINTMENT_WRAPPER_CLASS : (type === 'timeIndicator') ?
                    TIMELINE_WRAPPER_CLASS : DAY_WRAPPER_CLASS, attrs: { 'data-date': col.date.getTime().toString() }
            });
            if (!isNullOrUndefined(col.groupIndex)) {
                appointmentWrap.setAttribute('data-group-index', col.groupIndex.toString());
            }
            if (type === '') {
                let innerWrapper = createElement('div', {
                    id: APPOINTMENT_WRAPPER_CLASS + '-' + day.toString(),
                    className: APPOINTMENT_WRAPPER_CLASS
                });
                appointmentWrap.appendChild(innerWrapper);
            }
            tr.appendChild(appointmentWrap);
        });
        return tr;
    }
    getScrollableElement() {
        if (this.parent.isAdaptive && this.parent.currentView.indexOf('Timeline') === -1) {
            return this.element.querySelector('.' + SCROLL_CONTAINER_CLASS);
        }
        else {
            return this.getContentAreaElement();
        }
    }
    getLeftPanelElement() {
        return this.element.querySelector('.' + TIME_CELLS_WRAP_CLASS);
    }
    getEndDateFromStartDate(start) {
        let msMajorInterval = this.parent.activeViewOptions.timeScale.interval * MS_PER_MINUTE;
        let msInterval = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        let end = new Date(start.getTime());
        end.setMilliseconds(end.getMilliseconds() + msInterval);
        return end;
    }
    getTimeSlotRows(handler) {
        let rows = [];
        let startHour = this.getStartHour();
        let endHour = this.getEndHour();
        let msMajorInterval = this.parent.activeViewOptions.timeScale.interval * MS_PER_MINUTE;
        let msInterval = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        let length = Math.round(MS_PER_DAY / msInterval);
        let msStartHour = startHour.getTime();
        let msEndHour = endHour.getTime();
        if (msStartHour !== msEndHour) {
            length = Math.round((msEndHour - msStartHour) / msInterval);
        }
        if (!this.parent.activeViewOptions.timeScale.enable) {
            length = 1;
        }
        let dt = new Date(msStartHour);
        let start = this.parent.getStartEndTime(this.parent.workHours.start);
        let end = this.parent.getStartEndTime(this.parent.workHours.end);
        for (let i = 0; i < length; i++) {
            let majorTickDivider = i % (msMajorInterval / msInterval);
            let row = {
                date: new Date('' + dt),
                startHour: start,
                endHour: end,
                first: (majorTickDivider === 0),
                middle: (majorTickDivider < this.parent.activeViewOptions.timeScale.slotCount - 1),
                last: (majorTickDivider === this.parent.activeViewOptions.timeScale.slotCount - 1),
                type: ''
            };
            if (handler) {
                handler(row);
            }
            rows.push(row);
            dt.setMilliseconds(msInterval);
        }
        return rows;
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'verticalView';
    }
    /**
     * To destroy the vertical view.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.clearCurrentTimeIndicatorTimer();
        if (this.element) {
            let contentScrollableEle = this.getContentAreaElement();
            if (contentScrollableEle) {
                EventHandler.remove(contentScrollableEle, 'scroll', this.onContentScroll);
            }
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            remove(this.element);
            this.element = null;
            if (this.parent.scheduleTouchModule) {
                this.parent.scheduleTouchModule.resetValues();
            }
        }
    }
}

/**
 * day view
 */
class Day extends VerticalView {
    /**
     * Constructor for day view
     */
    constructor(parent) {
        super(parent);
        this.viewClass = 'e-day-view';
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'day';
    }
}

/**
 * week view
 */
class Week extends VerticalView {
    /**
     * Constructor for week view
     */
    constructor(parent) {
        super(parent);
        this.viewClass = 'e-week-view';
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'week';
    }
}

/**
 * work week view
 */
class WorkWeek extends VerticalView {
    /**
     * Constructor for work week view
     */
    constructor(par) {
        super(par);
        this.viewClass = 'e-work-week-view';
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'workWeek';
    }
}

/**
 * month view
 */
class Month extends ViewBase {
    /**
     * Constructor for month view
     */
    constructor(parent) {
        super(parent);
        this.dayNameFormat = 'wide';
        this.viewClass = 'e-month-view';
        this.isInverseTableSelect = false;
        this.monthDates = {};
        this.workCellAction = new WorkCellInteraction(parent);
    }
    addEventListener() {
        this.parent.on(scrollUiUpdate, this.onScrollUIUpdate, this);
        this.parent.on(dataReady, this.onDataReady, this);
        this.parent.on(cellClick, this.onCellClick, this);
    }
    removeEventListener() {
        this.parent.off(scrollUiUpdate, this.onScrollUIUpdate);
        this.parent.off(dataReady, this.onDataReady);
        this.parent.off(cellClick, this.onCellClick);
    }
    onDataReady(args) {
        let monthEvent = new MonthEvent(this.parent);
        monthEvent.renderAppointments();
    }
    onCellClick(event) {
        // Here cell click
    }
    onContentScroll(e) {
        this.parent.removeNewEventElement();
        this.parent.notify(virtualScroll, e);
        this.scrollTopPanel(e.target);
        this.scrollLeftPanel(e.target);
    }
    scrollLeftPanel(target) {
        let leftPanel = this.getLeftPanelElement();
        if (leftPanel) {
            leftPanel.scrollTop = target.scrollTop;
        }
    }
    getLeftPanelElement() {
        return this.element.querySelector('.' + WEEK_NUMBER_WRAPPER_CLASS);
    }
    onScrollUIUpdate(args) {
        let headerHeight = this.getHeaderBarHeight();
        let header = this.getDatesHeaderElement();
        let content = this.getContentAreaElement();
        let height = this.parent.element.offsetHeight - headerHeight - header.offsetHeight;
        let leftPanel = this.getLeftPanelElement();
        this.setContentHeight(content, leftPanel, height);
        let scrollBarWidth = getScrollBarWidth();
        // tslint:disable:no-any
        if (content.offsetWidth - content.clientWidth > 0) {
            header.firstChild.style[args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        }
        else {
            header.firstChild.style[args.cssProperties.border] = '';
            header.style[args.cssProperties.padding] = '';
        }
        // tslint:enable:no-any
        this.setColWidth(content);
    }
    setContentHeight(content, leftPanelElement, height) {
        content.style.height = 'auto';
        if (this.parent.currentView === 'Month') {
            content.style.height = formatUnit(height);
        }
        if (leftPanelElement) {
            if (this.parent.currentView === 'MonthAgenda') {
                height = this.element.querySelector('.' + CONTENT_TABLE_CLASS).offsetHeight;
            }
            leftPanelElement.style.height = 'auto';
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(content));
        }
    }
    generateColumnLevels() {
        let colLevels = [];
        let level = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            colLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.currentView === 'MonthAgenda') {
                colLevels = [level];
            }
            if (this.parent.uiStateValues.isGroupAdaptive && this.parent.resourceBase.lastResourceLevel.length > 0) {
                let resourceLevel = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                colLevels = [this.getDateSlots(resourceLevel.renderDates, resourceLevel.workDays)];
            }
        }
        else {
            colLevels.push(level);
        }
        this.colLevels = colLevels;
        return colLevels;
    }
    getDateSlots(renderDates, workDays) {
        let count = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH : workDays.length;
        let dateSlots = [];
        for (let col = 0; col < count; col++) {
            let classList$$1 = [HEADER_CELLS_CLASS];
            let currentDateIndex = renderDates.slice(0, count).map((date) => date.getDay());
            if (this.isCurrentMonth(this.parent.selectedDate) && currentDateIndex.indexOf(new Date().getDay()) === col) {
                classList$$1.push(CURRENT_DAY_CLASS);
            }
            dateSlots.push({ date: renderDates[col], type: 'monthDay', className: classList$$1, colSpan: 1, workDays: workDays });
        }
        return dateSlots;
    }
    getDayNameFormat() {
        if (this.parent.isAdaptive || this.parent.activeViewOptions.group.resources.length > 0) {
            return 'abbreviated';
        }
        return 'wide';
    }
    renderLayout(type) {
        this.dayNameFormat = this.getDayNameFormat();
        this.setPanel(createElement('div', { className: TABLE_WRAP_CLASS }));
        let clsList = [this.viewClass];
        clsList.push(type);
        if (this.parent.activeViewOptions.group.byDate) {
            clsList.push('e-by-date');
        }
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            clsList.push(VIRTUAL_SCROLL_CLASS);
        }
        addClass([this.element], clsList);
        this.renderPanel(type);
        this.element.appendChild(this.createTableLayout(OUTER_TABLE_CLASS));
        this.colLevels = this.generateColumnLevels();
        this.renderHeader();
        this.renderContent();
        let target = (this.parent.currentView === 'MonthAgenda') ? this.parent.activeView.getPanel() : this.parent.element;
        if (this.parent.uiStateValues.isGroupAdaptive && !target.querySelector('.' + RESOURCE_TOOLBAR_CONTAINER)) {
            this.renderResourceMobileLayout();
        }
        this.parent.notify(contentReady, {});
    }
    wireCellEvents(element) {
        EventHandler.add(element, 'mousedown', this.workCellAction.cellMouseDown, this.workCellAction);
        EventHandler.add(element, 'click', this.workCellAction.cellClick, this.workCellAction);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'dblclick', this.workCellAction.cellDblClick, this.workCellAction);
        }
    }
    renderHeader() {
        let tr = createElement('tr');
        this.renderLeftIndent(tr);
        let dateTd = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    }
    renderLeftIndent(tr) {
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(createElement('td', { className: 'e-left-indent' }));
        }
    }
    renderContent() {
        let tr = createElement('tr');
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(this.renderWeekNumberContent());
        }
        let workTd = createElement('td');
        let wrap = createElement('div', { className: CONTENT_WRAP_CLASS });
        let contentArea = this.renderContentArea();
        if (this.parent.currentView === 'Month') {
            wrap.appendChild(contentArea);
        }
        else {
            let monthAgendaWrapper = createElement('div', { className: TABLE_CONTAINER_CLASS });
            monthAgendaWrapper.appendChild(contentArea);
            wrap.appendChild(monthAgendaWrapper);
        }
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        workTd.appendChild(wrap);
        tr.appendChild(workTd);
        this.element.querySelector('tbody').appendChild(tr);
        this.renderAppointmentContainer();
    }
    renderWeekNumberContent() {
        let dateCol = this.renderDates.map((date) => new Date(+date));
        let td = createElement('td');
        let contentWrapper = createElement('div', { className: WEEK_NUMBER_WRAPPER_CLASS });
        td.appendChild(contentWrapper);
        let contentWrapTable = this.createTableLayout();
        contentWrapper.appendChild(contentWrapTable);
        let noOfDays = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH :
            this.parent.activeViewOptions.workDays.length;
        for (let i = 0, length = (this.renderDates.length / noOfDays); i < length; i++) {
            let dates = dateCol.splice(0, noOfDays);
            let weekNumber = getWeekNumber(dates.slice(-1)[0]).toString();
            contentWrapTable.querySelector('tbody').appendChild(this.createWeekNumberElement(weekNumber));
        }
        return td;
    }
    renderAppointmentContainer() {
        //Here needs to render mobile view appointment details on selected date
    }
    renderDatesHeader() {
        let container = createElement('div', { className: DATE_HEADER_CONTAINER_CLASS });
        let wrap = createElement('div', { className: DATE_HEADER_WRAP_CLASS });
        container.appendChild(wrap);
        let table = this.createTableLayout();
        this.createColGroup(table, this.colLevels[this.colLevels.length - 1]);
        let trEle = createElement('tr');
        for (let i = 0; i < this.colLevels.length; i++) {
            let level = this.colLevels[i];
            let ntr = trEle.cloneNode();
            for (let j = 0; j < level.length; j++) {
                let td = level[j];
                ntr.appendChild(this.createHeaderCell(td));
            }
            table.querySelector('tbody').appendChild(ntr);
        }
        wrap.appendChild(table);
        return container;
    }
    createHeaderCell(td) {
        let tdEle = createElement('td');
        this.addAttributes(td, tdEle);
        if (td.type === 'monthDay') {
            let ele = createElement('span', { innerHTML: this.parent.getDayNames(this.dayNameFormat)[td.date.getDay()] });
            tdEle.appendChild(ele);
        }
        if (td.type === 'resourceHeader') {
            this.setResourceHeaderContent(tdEle, td);
        }
        if (td.type === 'dateHeader') {
            addClass([tdEle], DATE_HEADER_CLASS);
            tdEle.setAttribute('data-date', td.date.getTime().toString());
            if (this.parent.activeViewOptions.dateHeaderTemplate) {
                let cellArgs = { date: td.date, type: td.type };
                let ele = this.parent.getDateHeaderTemplate()(cellArgs);
                if (ele && ele.length) {
                    append([].slice.call(ele), tdEle);
                }
            }
            else {
                let ele = createElement('span', { className: NAVIGATE_CLASS });
                let title = this.parent.globalize.formatDate(td.date, { skeleton: 'full', calendar: this.parent.getCalendarMode() });
                ele.setAttribute('title', title);
                ele.innerHTML =
                    (this.parent.calendarUtil.isMonthStart(td.date) && !this.isCurrentDate(td.date) && !this.parent.isAdaptive) ?
                        this.parent.globalize.formatDate(td.date, { format: 'MMM d', calendar: this.parent.getCalendarMode() }) :
                        this.parent.globalize.formatDate(td.date, { skeleton: 'd', calendar: this.parent.getCalendarMode() });
                tdEle.appendChild(ele);
            }
            this.wireCellEvents(tdEle);
        }
        let args = { elementType: td.type, element: tdEle, date: td.date, groupIndex: td.groupIndex };
        this.parent.trigger(renderCell, args);
        return tdEle;
    }
    getContentSlots() {
        if (!(this.colLevels[this.colLevels.length - 1] && this.colLevels[this.colLevels.length - 1][0])) {
            return [];
        }
        let slotDatas = [];
        let prepareSlots = (rowIndex, renderDate, resData, classList$$1) => {
            let data = {
                date: new Date(+renderDate), groupIndex: resData.groupIndex, workDays: resData.workDays,
                type: 'monthCells', className: classList$$1 || [WORK_CELLS_CLASS]
            };
            if (!slotDatas[rowIndex]) {
                slotDatas[rowIndex] = [];
            }
            slotDatas[rowIndex].push(data);
        };
        let includeResource = this.parent.currentView !== 'MonthAgenda' &&
            this.parent.activeViewOptions.group.resources.length > 0;
        if (includeResource && !this.parent.uiStateValues.isGroupAdaptive && !this.parent.activeViewOptions.group.byDate) {
            for (let res of this.colLevels[this.colLevels.length - 2]) {
                let dates = res.renderDates.map((date) => new Date(+date));
                let count = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH : res.workDays.length;
                for (let i = 0; i < (res.renderDates.length / count); i++) {
                    let colDates = dates.splice(0, count);
                    for (let colDate of colDates) {
                        prepareSlots(i, colDate, res);
                    }
                }
            }
        }
        else {
            let dates = this.renderDates.map((date) => new Date(+date));
            let count = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH :
                this.parent.activeViewOptions.workDays.length;
            for (let i = 0; i < (this.renderDates.length / count); i++) {
                let colDates = dates.splice(0, count);
                for (let colDate of colDates) {
                    if (includeResource) {
                        let lastRow = this.colLevels[(this.colLevels.length - 1)];
                        let resourcesTd = lastRow.slice(0, lastRow.length / count);
                        for (let resIndex = 0; resIndex < resourcesTd.length; resIndex++) {
                            let clsList;
                            if (resIndex !== 0) {
                                clsList = [WORK_CELLS_CLASS, DISABLE_DATE];
                            }
                            prepareSlots(i, colDate, resourcesTd[resIndex], clsList);
                        }
                    }
                    else {
                        prepareSlots(i, colDate, this.colLevels[this.colLevels.length - 1][0]);
                    }
                }
            }
        }
        return slotDatas;
    }
    updateClassList(data) {
        if (this.isOtherMonth(data.date)) {
            data.className.push(OTHERMONTH_CLASS);
        }
        if (this.parent.currentView === 'MonthAgenda' && this.parent.isSelectedDate(data.date)) {
            data.className.push(SELECTED_CELL_CLASS);
        }
    }
    isOtherMonth(date) {
        return date.getTime() < this.monthDates.start.getTime() || date.getTime() > this.monthDates.end.getTime();
    }
    renderContentArea() {
        let tbl = this.createTableLayout(CONTENT_TABLE_CLASS);
        this.addAutoHeightClass(tbl);
        if (this.parent.currentView === 'TimelineMonth') {
            this.createColGroup(tbl, this.colLevels[this.colLevels.length - 1]);
        }
        let monthDate = new Date(this.parent.selectedDate.getTime());
        this.monthDates = {
            start: this.parent.calendarUtil.firstDateOfMonth(monthDate),
            end: this.parent.calendarUtil.lastDateOfMonth(addMonths(monthDate, this.parent.activeViewOptions.interval - 1))
        };
        let tBody = tbl.querySelector('tbody');
        append(this.getContentRows(), tBody);
        this.wireCellEvents(tBody);
        return tbl;
    }
    getContentRows() {
        let trows = [];
        let tr = createElement('tr', { attrs: { role: 'row' } });
        let td = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        let slotDatas = this.getContentSlots();
        for (let row = 0; row < slotDatas.length; row++) {
            let ntr = tr.cloneNode();
            for (let col = 0; col < slotDatas[row].length; col++) {
                let ntd = this.createContentTd(slotDatas[row][col], td);
                ntr.appendChild(ntd);
            }
            trows.push(ntr);
        }
        return trows;
    }
    createContentTd(data, td) {
        let ntd = td.cloneNode();
        if (data.colSpan) {
            ntd.setAttribute('colspan', data.colSpan.toString());
        }
        this.updateClassList(data);
        let type = data.type;
        if (data.className.indexOf(RESOURCE_PARENT_CLASS) !== -1) {
            data.className.push(RESOURCE_GROUP_CELLS_CLASS);
            type = 'resourceGroupCells';
        }
        if (this.parent.workHours.highlight && this.isWorkDay(data.date, data.workDays)) {
            data.className.push(WORKDAY_CLASS);
        }
        if (this.isCurrentDate(data.date)) {
            data.className.push(CURRENTDATE_CLASS);
        }
        addClass([ntd], data.className);
        ntd.setAttribute('data-date', data.date.getTime().toString());
        if (!isNullOrUndefined(data.groupIndex) || this.parent.uiStateValues.isGroupAdaptive) {
            let groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                data.groupIndex;
            ntd.setAttribute('data-group-index', '' + groupIndex);
        }
        this.renderDateHeaderElement(data, ntd);
        if (this.parent.activeViewOptions.cellTemplate) {
            let args = { date: data.date, type: type, groupIndex: data.groupIndex };
            append([].slice.call(this.parent.getCellTemplate()(args)), ntd);
        }
        let args = { elementType: type, element: ntd, date: data.date, groupIndex: data.groupIndex };
        this.parent.trigger(renderCell, args);
        return ntd;
    }
    renderDateHeaderElement(data, ntd) {
        if (this.parent.currentView === 'TimelineMonth') {
            return;
        }
        let dateHeader = createElement('div', { className: DATE_HEADER_CLASS });
        dateHeader.innerHTML =
            (this.parent.calendarUtil.isMonthStart(data.date) && !this.isCurrentDate(data.date) && !this.parent.isAdaptive) ?
                this.parent.globalize.formatDate(data.date, { format: 'MMM d', calendar: this.parent.getCalendarMode() }) :
                this.parent.globalize.formatDate(data.date, { skeleton: 'd', calendar: this.parent.getCalendarMode() });
        ntd.appendChild(dateHeader);
        if (this.getModuleName() === 'month') {
            addClass([dateHeader], NAVIGATE_CLASS);
        }
    }
    getMonthStart(currentDate) {
        let monthStart = getWeekFirstDate(this.parent.calendarUtil.firstDateOfMonth(currentDate), this.parent.firstDayOfWeek);
        let start = new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
        return start;
    }
    getMonthEnd(currentDate) {
        let endDate = addMonths(currentDate, this.parent.activeViewOptions.interval - 1);
        let lastWeekOfMonth = getWeekFirstDate(this.parent.calendarUtil.lastDateOfMonth(endDate), this.parent.firstDayOfWeek);
        let monthEnd = addDays(lastWeekOfMonth, WEEK_LENGTH - 1);
        return monthEnd;
    }
    getRenderDates(workDays) {
        let renderDates = [];
        let currentDate = resetTime(this.parent.selectedDate);
        let start = this.getMonthStart(currentDate);
        let monthEnd = this.getMonthEnd(currentDate);
        do {
            if (this.parent.activeViewOptions.showWeekend) {
                renderDates.push(start);
            }
            else {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
            }
            start = addDays(start, 1);
        } while (start.getTime() <= monthEnd.getTime());
        if (!workDays) {
            this.renderDates = renderDates;
        }
        return renderDates;
    }
    getNextPreviousDate(type) {
        if (type === 'next') {
            return addMonths(this.parent.selectedDate, this.parent.activeViewOptions.interval);
        }
        else {
            return addMonths(this.parent.selectedDate, -(this.parent.activeViewOptions.interval));
        }
    }
    getEndDateFromStartDate(start) {
        return addDays(new Date(start.getTime()), 1);
    }
    getDateRangeText() {
        if (this.parent.isAdaptive || isNullOrUndefined(this.parent.activeViewOptions.dateFormat)) {
            if (this.parent.activeViewOptions.interval > 1) {
                let endDate = addMonths(lastDateOfMonth(this.parent.selectedDate), this.parent.activeViewOptions.interval - 1);
                if (this.parent.selectedDate.getFullYear() === endDate.getFullYear()) {
                    let monthNames = (this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM', calendar: this.parent.getCalendarMode() })) + ' - ' +
                        (this.parent.globalize.formatDate(endDate, { format: 'MMMM ', calendar: this.parent.getCalendarMode() })) +
                        endDate.getFullYear();
                    return monthNames;
                }
                return (this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM', calendar: this.parent.getCalendarMode() })) + ' ' +
                    this.parent.selectedDate.getFullYear() + ' - ' + (this.parent.globalize.formatDate(endDate, { format: 'MMMM ', calendar: this.parent.getCalendarMode() })) +
                    endDate.getFullYear();
            }
            return this.parent.globalize.
                formatDate(this.parent.selectedDate, { format: 'MMMM y', calendar: this.parent.getCalendarMode() });
        }
        return this.formatDateRange(this.parent.selectedDate);
    }
    getLabelText(view) {
        return this.parent.localeObj.getConstant(view) + ' of ' +
            this.parent.globalize.formatDate(this.parent.selectedDate, { format: 'MMMM y', calendar: this.parent.getCalendarMode() });
    }
    createWeekNumberElement(text) {
        let tr = createElement('tr');
        let td = createElement('td', {
            className: WEEK_NUMBER_CLASS,
            attrs: { 'title': (text ? this.parent.localeObj.getConstant('week') + ' ' + text : '') },
            innerHTML: (text || '')
        });
        tr.appendChild(td);
        let args = { elementType: 'weekNumberCell', element: td };
        this.parent.trigger(renderCell, args);
        return tr;
    }
    unwireEvents() {
        // No scroller events for month view
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'month';
    }
    /**
     * To destroy the month.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            this.unwireEvents();
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            remove(this.element);
            this.element = null;
            if (this.parent.scheduleTouchModule) {
                this.parent.scheduleTouchModule.resetValues();
            }
        }
    }
}

class AgendaBase {
    /**
     * Constructor for AgendaBase
     */
    constructor(parent) {
        this.parent = parent;
        this.viewBase = new ViewBase(parent);
    }
    createAgendaContentElement(type, listData, aTd, groupOrder, groupIndex) {
        let listElement;
        let fieldMapping = this.parent.eventFields;
        if (type === 'noEvents') {
            let noEvents = [{ 'subject': this.parent.localeObj.getConstant('noEvents') }];
            listElement = ListBase.createList(this.parent.createElement, noEvents, {
                moduleName: 'agenda',
                listClass: this.parent.activeView.viewClass,
                itemClass: this.parent.activeView.viewClass,
                template: '<div class=' + AGENDA_NO_EVENT_CLASS + '>${subject}</div>'
            });
        }
        else {
            listElement = ListBase.createList(this.parent.createElement, listData, {
                moduleName: 'agenda',
                listClass: this.parent.activeView.viewClass,
                itemClass: this.parent.activeView.viewClass
            });
            for (let li = 0, length = listData.length; li < length; li++) {
                let appWrapper = createElement('div', {
                    className: APPOINTMENT_CLASS, attrs: {
                        'data-id': 'Appointment_' + listData[li][this.parent.eventFields.id],
                        'data-guid': listData[li].Guid,
                        'role': 'button',
                        'tabindex': '0',
                        'aria-readonly': this.parent.eventBase.getReadonlyAttribute(listData[li]),
                        'aria-selected': 'false',
                        'aria-grabbed': 'true',
                        'aria-label': (listData[li][this.parent.eventFields.subject]
                            || this.parent.eventSettings.fields.subject.default)
                    }
                });
                if (!isNullOrUndefined(groupIndex)) {
                    appWrapper.setAttribute('data-group-index', groupIndex.toString());
                }
                this.parent.eventBase.applyResourceColor(appWrapper, listData[li], 'borderColor', groupOrder);
                let templateEle;
                if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
                    addClass([appWrapper], EVENT_TEMPLATE);
                    templateEle = this.parent.getAppointmentTemplate()(listData[li]);
                    if (!isNullOrUndefined(listData[li][fieldMapping.recurrenceRule])) {
                        let iconClass = (listData[li][fieldMapping.id] === listData[li][fieldMapping.recurrenceID]) ?
                            EVENT_RECURRENCE_ICON_CLASS : EVENT_RECURRENCE_EDIT_ICON_CLASS;
                        appWrapper.appendChild(createElement('div', { className: ICON + ' ' + iconClass }));
                    }
                }
                else {
                    templateEle = this.createAppointment(listData[li]);
                }
                append([].slice.call(templateEle), appWrapper);
                listElement.children[li].innerHTML = '';
                listElement.children[li].appendChild(appWrapper);
                let args = { data: listData[li], element: listElement.children[li], cancel: false };
                this.parent.trigger(eventRendered, args);
                if (args.cancel) {
                    remove(listElement.children[li]);
                }
            }
        }
        aTd.appendChild(listElement);
        if ((this.parent.currentView === 'MonthAgenda' && this.parent.activeViewOptions.group.resources.length > 0)
            || this.parent.currentView === 'Agenda') {
            addClass([aTd], AGENDA_DAY_BORDER_CLASS);
        }
        return aTd;
    }
    createAppointment(event) {
        let fieldMapping = this.parent.eventFields;
        let eventSubject = (event[fieldMapping.subject] || this.parent.eventSettings.fields.subject.default);
        let eventLocation = (event[fieldMapping.location] || this.parent.eventSettings.fields.location.default);
        let appSubjectWrap = createElement('div', { className: SUBJECT_WRAP });
        if (!isNullOrUndefined(eventLocation) && eventLocation !== '') {
            eventSubject += ',';
        }
        appSubjectWrap.appendChild(createElement('div', { className: SUBJECT_CLASS, innerHTML: eventSubject }));
        if (!isNullOrUndefined(eventLocation) && eventLocation !== '') {
            appSubjectWrap.appendChild(createElement('div', { className: LOCATION_CLASS, innerHTML: eventLocation }));
        }
        if (!isNullOrUndefined(event[fieldMapping.recurrenceRule])) {
            let iconClass = (event[fieldMapping.id] === event[fieldMapping.recurrenceID]) ?
                EVENT_RECURRENCE_ICON_CLASS : EVENT_RECURRENCE_EDIT_ICON_CLASS;
            appSubjectWrap.appendChild(createElement('div', { className: ICON + ' ' + iconClass }));
        }
        let strDate = event[fieldMapping.startTime];
        let endDate = event[fieldMapping.endTime];
        let isAllDay = event[fieldMapping.isAllDay];
        let allDayStr = this.parent.localeObj.getConstant('allDay');
        let timeStr = this.parent.getTimeString(strDate) + ' - ' + this.parent.getTimeString(endDate);
        if (!isNullOrUndefined(event.data)) {
            let eventString = (endDate.getTime() - strDate.getTime()) / MS_PER_DAY >= 1 ? allDayStr : timeStr;
            allDayStr = eventString + ' (' + this.parent.localeObj.getConstant('day') + ' '
                + event.data.index + '/' + event.data.count + ')';
        }
        let displayStr = (!isNullOrUndefined(event.data) || isAllDay) ? allDayStr : timeStr;
        let appDateTime = createElement('div', { className: DATE_TIME_CLASS, innerHTML: displayStr });
        return [appSubjectWrap, appDateTime];
    }
    processAgendaEvents(events) {
        let eventsProcessed = [];
        for (let event of events) {
            let splited = this.parent.eventBase.splitEventByDay(event);
            eventsProcessed = eventsProcessed.concat(splited.length > 1 ? splited : event);
        }
        return eventsProcessed;
    }
    wireEventActions() {
        let eventElement = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
        for (let element of eventElement) {
            this.parent.eventBase.wireAppointmentEvents(element);
        }
        let dateHeaderElement = [].slice.call(this.parent.element.querySelectorAll('.e-m-date'));
        for (let element of dateHeaderElement) {
            EventHandler.add(element, 'click', this.parent.agendaModule.dayNavigationClick, this);
        }
    }
    calculateResourceTableElement(tBody, noOfDays, agendaDate) {
        if (isNullOrUndefined(this.parent.resourceBase.lastResourceLevel)) {
            let level = this.viewBase.getDateSlots(this.viewBase.renderDates, this.parent.activeViewOptions.workDays);
            this.parent.resourceBase.generateResourceLevels(level);
        }
        let agendaLastDate = addDays(new Date(agendaDate.getTime()), noOfDays);
        let days = (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') ? noOfDays : 1;
        let resColl = this.parent.resourceBase.resourceCollection;
        let resData = this.parent.resourceBase.lastResourceLevel;
        let initialDate = agendaDate;
        for (let i = 0; i < days; i++) {
            let lastLevelInfo = [];
            let tempLastLevelInfo = [];
            let tempIndex = 0;
            let eventObj;
            let dateObj;
            let firstDate = addDays(initialDate, i);
            let finalDate = (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda')
                ? addDays(firstDate, 1) : agendaLastDate;
            let agendaCollection = this.parent.eventBase.filterEvents(firstDate, finalDate);
            if (agendaCollection.length > 0 || !this.parent.hideEmptyAgendaDays || this.parent.currentView === 'MonthAgenda') {
                for (let res = 0; res < resData.length; res++) {
                    noOfDays = (!this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') ? noOfDays : 1;
                    let data = [];
                    agendaDate = firstDate;
                    let resDataCollection = this.parent.eventBase.filterEvents(agendaDate, agendaLastDate, agendaCollection, resData[res]);
                    if (resDataCollection.length > 0 || !this.parent.hideEmptyAgendaDays || this.parent.currentView === 'MonthAgenda') {
                        for (let r = 0; r < noOfDays; r++) {
                            let resDayCollection = this.parent.eventBase.filterEvents(agendaDate, addDays(agendaDate, 1), resDataCollection, undefined);
                            if (resDayCollection.length > 0 || !this.parent.hideEmptyAgendaDays ||
                                this.parent.currentView === 'MonthAgenda') {
                                data.push(resDayCollection[0]);
                                eventObj = {
                                    rowSpan: 1, type: 'eventColumn', resource: resColl[resColl.length - 1],
                                    groupIndex: resData[res].groupIndex, groupOrder: resData[res].groupOrder,
                                    resourceData: resData[res].resourceData, eventData: resDayCollection, date: agendaDate
                                };
                                dateObj = {
                                    rowSpan: 1, type: 'dateColumn', resource: resColl[resColl.length - 1],
                                    groupOrder: resData[res].groupOrder, resourceData: resData[res].resourceData,
                                    date: agendaDate
                                };
                                if (!lastLevelInfo[tempIndex]) {
                                    lastLevelInfo[tempIndex] = [];
                                }
                                lastLevelInfo[tempIndex].push(eventObj);
                                lastLevelInfo[tempIndex].push(dateObj);
                                tempIndex++;
                            }
                            agendaDate = addDays(agendaDate, 1);
                            if (agendaDate.getTime() >= agendaLastDate.getTime() || this.parent.activeViewOptions.group.byDate
                                || this.parent.currentView === 'MonthAgenda') {
                                lastLevelInfo[lastLevelInfo.length - 1][1].cssClass = AGENDA_DAY_BORDER_CLASS;
                                let tempObj = {
                                    rowSpan: data.length, type: 'resourceColumn', resource: resColl[resColl.length - 1],
                                    groupOrder: resData[res].groupOrder.slice(0, -1), resourceData: resData[res].resourceData,
                                    groupIndex: (lastLevelInfo.length - data.length), className: [RESOURCE_NAME],
                                    date: agendaDate
                                };
                                lastLevelInfo[lastLevelInfo.length - data.length].push(tempObj);
                                tempLastLevelInfo.push(extend({}, tempObj, null, true));
                                break;
                            }
                        }
                    }
                }
                let topResources = resColl.slice(0, -1);
                let tempGroupedData = [];
                let totalRowSpan = 0;
                for (let y = 0; y < topResources.length; y++) {
                    let data = topResources[topResources.length - (y + 1)]
                        .dataSource;
                    for (let x = 0; x < data.length; x++) {
                        let z = 0;
                        for (let u = 0; u < tempLastLevelInfo.length; u++) {
                            if (tempLastLevelInfo[u].groupOrder[topResources.length - (y + 1)] === data[x][topResources[topResources.length - (y + 1)].idField]) {
                                totalRowSpan = totalRowSpan + tempLastLevelInfo[u].rowSpan;
                                tempGroupedData.push(extend({}, tempLastLevelInfo[u], null, true));
                            }
                            if (++z === tempLastLevelInfo.length && tempGroupedData.length > 0) {
                                tempGroupedData[0].rowSpan = totalRowSpan;
                                tempGroupedData[0].type = 'parentColumnLevel_' + (y + 1);
                                tempGroupedData[0].resource = topResources[topResources.length - (y + 1)];
                                tempGroupedData[0].resourceData = data[x];
                                tempGroupedData[0].date = agendaDate;
                                lastLevelInfo[tempGroupedData[0].groupIndex].push(tempGroupedData[0]);
                                tempGroupedData = [];
                                totalRowSpan = 0;
                            }
                        }
                    }
                }
                this.createResourceTableRow(lastLevelInfo, tBody);
            }
        }
        let totalCollection = this.parent.eventBase.filterEvents(initialDate, agendaLastDate);
        if (totalCollection.length === 0 && !this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays) {
            this.renderEmptyContent(tBody, initialDate);
        }
    }
    createResourceTableRow(tContent, tBody) {
        let tr = createElement('tr', { attrs: { role: 'row' } });
        let ntr;
        let td = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        let tempData;
        let rowSpan = 0;
        let level;
        if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
            let tContentCollection = [];
            let parentCollection = this.parent.resourceBase.resourceCollection.slice(0, -1);
            for (let w = 0; w < tContent.length; w++) {
                tContentCollection = tContentCollection.concat(tContent[w]);
            }
            level = (parentCollection.length > 0) ? 'parentColumnLevel_' + parentCollection.length : 'resourceColumn';
            let rowSpanCollection = new DataManager({ json: tContentCollection }).executeLocal(new Query()
                .where('type', 'equal', level));
            for (let x = 0; x < rowSpanCollection.length; x++) {
                rowSpan = rowSpan + rowSpanCollection[x].rowSpan;
            }
        }
        for (let row = 0; row < tContent.length; row++) {
            ntr = tr.cloneNode();
            for (let col = tContent[row].length - 1; col >= 0; col--) {
                let data = tContent[row][col];
                let ntd = td.cloneNode();
                if (data.type === 'dateColumn') {
                    if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
                        tempData = tContent[row][col];
                        continue;
                    }
                    ntd.setAttribute('data-date', data.date.getTime().toString());
                    ntd.appendChild(this.createDateHeaderElement(data.date));
                    let className = [AGENDA_CELLS_CLASS, AGENDA_DATE_CLASS];
                    if (data.cssClass) {
                        className.push(data.cssClass);
                    }
                    addClass([ntd], className);
                    ntr.appendChild(ntd);
                }
                else if (data.type === 'eventColumn') {
                    let elementType = (data.eventData.length === 0) ? 'noEvents' : 'data';
                    ntd = this.createAgendaContentElement(elementType, data.eventData, ntd, data.groupOrder, data.groupIndex);
                    ntd.setAttribute('data-date', data.date.getTime().toString());
                    if (this.parent.activeViewOptions.group.byDate || this.parent.currentView === 'MonthAgenda') {
                        addClass([ntd], [AGENDA_CELLS_CLASS, AGENDA_DAY_PADDING_CLASS]);
                    }
                    ntr.appendChild(ntd);
                }
                else {
                    ntd.setAttribute('rowspan', data.rowSpan.toString());
                    addClass([ntd], AGENDA_RESOURCE_CLASS);
                    this.viewBase.setResourceHeaderContent(ntd, data, data.className[0]);
                    ntr.appendChild(ntd);
                }
            }
            if (this.parent.activeViewOptions.group.byDate && row === 0 && this.parent.currentView !== 'MonthAgenda') {
                let ntd = td.cloneNode();
                ntd.setAttribute('data-date', tempData.date.getTime().toString());
                ntd.setAttribute('rowspan', rowSpan.toString());
                ntd.appendChild(this.createDateHeaderElement(tempData.date));
                addClass([ntd], [AGENDA_CELLS_CLASS, AGENDA_DATE_CLASS, DATE_BORDER_CLASS]);
                let daysCount = getDaysCount(this.parent.selectedDate.getTime(), tempData.date.getTime());
                ntr.setAttribute('aria-rowindex', daysCount.toString());
                if (this.parent.element.querySelector(`.e-agenda-view tr[aria-rowindex="${daysCount}"]`)) {
                    break;
                }
                ntr.insertBefore(ntd, ntr.childNodes[0]);
            }
            tBody.appendChild(ntr);
        }
    }
    createDateHeaderElement(date) {
        let dateHeader;
        if (this.parent.activeViewOptions.dateHeaderTemplate) {
            dateHeader = createElement('div', { className: AGENDA_HEADER_CLASS });
            let templateArgs = { date: date, type: 'dateHeader' };
            let template = this.parent.getDateHeaderTemplate()(templateArgs);
            append([].slice.call(template), dateHeader);
        }
        else {
            dateHeader = this.viewBase.getMobileDateElement(date, AGENDA_HEADER_CLASS);
        }
        return dateHeader;
    }
    renderEmptyContent(tBody, agendaDate) {
        let eTr = this.createTableRowElement(agendaDate, 'noEvents');
        let eTd = eTr.children[0];
        let noEvents = createElement('div', {
            className: AGENDA_EMPTY_EVENT_CLASS,
            innerHTML: this.parent.localeObj.getConstant('noEvents')
        });
        eTd.appendChild(noEvents);
        tBody.appendChild(eTr);
    }
    createTableRowElement(date, type) {
        let daysCount = getDaysCount(this.parent.selectedDate.getTime(), date.getTime());
        let tr = createElement('tr', { attrs: { 'role': 'row', 'aria-rowindex': daysCount.toString() } });
        let td = createElement('td', {
            attrs: {
                'class': (type === 'monthHeader') ? AGENDA_MONTH_HEADER_CLASS : AGENDA_CELLS_CLASS,
                'role': 'gridcell',
                'aria-selected': 'false',
                'aria-colindex': daysCount.toString(),
                'data-date': date.getTime().toString()
            }
        });
        let dTd = td.cloneNode();
        let aTd = td.cloneNode();
        tr.appendChild(dTd);
        if (type !== 'noEvents') {
            tr.appendChild(aTd);
        }
        return tr;
    }
}

/**
 * agenda view
 */
class Agenda extends ViewBase {
    /**
     * Constructor for agenda view
     */
    constructor(parent) {
        super(parent);
        this.viewClass = 'e-agenda-view';
        this.isInverseTableSelect = false;
        this.agendaDates = {};
        this.virtualScrollTop = 1;
        this.minDate = new Date(1900, 0, 1);
        this.maxDate = new Date(2099, 11, 31);
        this.agendaBase = new AgendaBase(parent);
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'agenda';
    }
    renderLayout() {
        this.agendaDates = {};
        this.element = createElement('div', { className: TABLE_WRAP_CLASS });
        addClass([this.element], this.viewClass);
        this.element.appendChild(this.createTableLayout(OUTER_TABLE_CLASS));
        this.parent.element.querySelector('.' + TABLE_CONTAINER_CLASS).appendChild(this.element);
        let eTr = createElement('tr');
        this.element.querySelector('tbody').appendChild(eTr);
        let workTd = createElement('td');
        eTr.appendChild(workTd);
        let wrap = createElement('div', { className: CONTENT_WRAP_CLASS });
        workTd.appendChild(wrap);
        let tbl = this.createTableLayout(CONTENT_TABLE_CLASS);
        wrap.appendChild(tbl);
        let tBody = tbl.querySelector('tbody');
        let agendaDate = resetTime(this.parent.selectedDate);
        this.agendaBase.renderEmptyContent(tBody, agendaDate);
        this.wireEvents();
        if (this.parent.resourceBase) {
            this.parent.resourceBase.generateResourceLevels([{ renderDates: this.parent.activeView.renderDates }]);
        }
        if (this.parent.uiStateValues.isGroupAdaptive && !this.parent.element.querySelector('.' + RESOURCE_TOOLBAR_CONTAINER)) {
            this.renderResourceMobileLayout();
        }
        this.parent.notify(contentReady, {});
    }
    eventLoad(args) {
        this.dataSource = extend([], this.parent.eventsData, null, true);
        for (let event of this.parent.eventsData) {
            delete event.generatedDates;
        }
        let eventCollection = args.processedData;
        if (this.parent.uiStateValues.isGroupAdaptive) {
            let resource = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
            this.dataSource = this.parent.eventBase.filterEventsByResource(resource, this.dataSource);
            eventCollection = this.parent.eventBase.filterEventsByResource(resource, eventCollection);
        }
        this.parent.eventsProcessed = this.agendaBase.processAgendaEvents(eventCollection);
        let agendaDate = resetTime(this.parent.selectedDate);
        let tBody = this.parent.getContentTable();
        tBody.innerHTML = '';
        this.renderInitialContent(tBody, agendaDate);
        this.agendaBase.wireEventActions();
        let contentArea = closest(tBody, '.' + CONTENT_WRAP_CLASS);
        contentArea.scrollTop = 1;
    }
    refreshEvent(refreshDate) {
        let processedData = [];
        for (let eventData of this.dataSource) {
            let fields = this.parent.eventFields;
            let data = eventData;
            if (isNullOrUndefined(data[fields.recurrenceID]) && !isNullOrUndefined(data[fields.recurrenceRule]) &&
                !isNullOrUndefined(data.generatedDates) && refreshDate >= data.generatedDates.end) {
                processedData = processedData.concat(this.parent.eventBase.generateOccurrence(data, refreshDate));
            }
        }
        this.parent.eventsProcessed = this.parent.eventsProcessed.concat(this.agendaBase.processAgendaEvents(processedData));
    }
    renderInitialContent(tBody, agendaDate) {
        let emptyTBody = createElement('tbody');
        let firstDate = new Date(agendaDate.getTime());
        let lastDate = (this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays) ?
            this.getEndDateFromStartDate(firstDate) : addDays(firstDate, this.parent.agendaDaysCount);
        this.renderContent(emptyTBody, firstDate, lastDate);
        append([].slice.call(emptyTBody.childNodes), tBody);
        // Initial rendering, to load previous date events upto scroll bar enable
        if (this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays && this.parent.eventsData.length > 0) {
            let contentArea = this.getContentAreaElement();
            while (contentArea.offsetWidth <= contentArea.clientWidth) {
                let emptyTBody = createElement('tbody');
                lastDate = firstDate;
                firstDate = addDays(lastDate, -this.parent.agendaDaysCount);
                this.renderContent(emptyTBody, firstDate, lastDate);
                prepend([].slice.call(emptyTBody.childNodes), tBody);
                if (firstDate <= this.minDate) {
                    break;
                }
            }
        }
        if (tBody.childNodes.length <= 0) {
            this.agendaBase.renderEmptyContent(tBody, agendaDate);
        }
    }
    renderContent(tBody, agendaDate, lastDate) {
        let fieldMapping = this.parent.eventFields;
        let firstDate = new Date(agendaDate.getTime());
        let isObject = this.appointmentFiltering(firstDate, lastDate);
        if (isObject.length > 0 && this.parent.activeViewOptions.allowVirtualScrolling && this.parent.hideEmptyAgendaDays) {
            let appoint = isObject;
            agendaDate = appoint[0][fieldMapping.startTime];
            agendaDate = new Date(new Date(agendaDate.getTime()).setHours(0, 0, 0, 0));
            this.updateHeaderText(appoint[0][fieldMapping.startTime]);
        }
        let endDate;
        if (!this.parent.hideEmptyAgendaDays || (this.parent.agendaDaysCount > 0 && isObject.length > 0)) {
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                let date = agendaDate;
                if (!this.parent.activeViewOptions.group.byDate) {
                    this.parent.activeViewOptions.allowVirtualScrolling = false;
                    date = firstDate;
                    if (this.parent.headerModule) {
                        this.parent.headerModule.updateDateRange(this.parent.activeView.getDateRangeText());
                        this.parent.headerModule.updateHeaderItems('remove');
                    }
                }
                this.agendaBase.calculateResourceTableElement(tBody, this.parent.agendaDaysCount, date);
            }
            else {
                for (let day = 0; day < this.parent.agendaDaysCount; day++) {
                    let filterData = [];
                    filterData = this.appointmentFiltering(agendaDate);
                    let nTr = this.agendaBase.createTableRowElement(agendaDate, 'data');
                    if (this.element.querySelector('tr[aria-rowindex="' + parseInt(nTr.getAttribute('aria-rowindex'), 10)
                        + '"]')) {
                        continue;
                    }
                    // if (this.isMonthFirstDate(agendaDate)) {
                    //     tBody.appendChild(this.renderMonthHeader(this.createTableRowElement(agendaDate, 'monthHeader')));
                    // }
                    let dTd = nTr.children[0];
                    let aTd = nTr.children[1];
                    if (filterData.length > 0 || (!this.parent.hideEmptyAgendaDays && filterData.length === 0)) {
                        let elementType = (!this.parent.hideEmptyAgendaDays && filterData.length === 0) ? 'noEvents' : 'data';
                        dTd.appendChild(this.agendaBase.createDateHeaderElement(agendaDate));
                        nTr.appendChild(dTd);
                        let cTd = this.agendaBase.createAgendaContentElement(elementType, filterData, aTd);
                        nTr.appendChild(cTd);
                        if (cTd.querySelectorAll('li').length > 0) {
                            tBody.appendChild(nTr);
                        }
                    }
                    else if (this.parent.activeViewOptions.allowVirtualScrolling) {
                        day--;
                    }
                    if (this.isCurrentDate(new Date(agendaDate.getTime()))) {
                        addClass(dTd.childNodes, AGENDA_CURRENT_DAY_CLASS);
                    }
                    agendaDate = addDays(agendaDate, 1);
                    if (agendaDate.getTime() > lastDate.getTime()) {
                        break;
                    }
                }
            }
            endDate = new Date(agendaDate.getTime() - MS_PER_DAY);
        }
        this.agendaDates = { start: firstDate, end: endDate };
    }
    // private renderMonthHeader(mTr: Element): Element {
    //     mTr.removeAttribute('aria-rowindex');
    //     for (let td of [].slice.call(mTr.childNodes)) {
    //         td.removeAttribute('aria-colindex');
    //     }
    //     let headerDate: Date = new Date(parseInt(mTr.children[0].getAttribute('data-date'), 10));
    //     let div: Element = createElement('div', {
    //         className: cls.DATE_HEADER_CLASS,
    //         innerHTML: headerDate.toLocaleString(this.parent.locale, { month: 'long' }) + '&nbsp' + headerDate.getFullYear()
    //     });
    //     mTr.lastElementChild.appendChild(div);
    //     return mTr;
    // }
    agendaScrolling(event) {
        this.parent.quickPopup.quickPopupHide();
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            this.virtualScrolling(event);
        }
    }
    virtualScrolling(event) {
        let target = event.target;
        let scrollTop = target.scrollTop;
        let scrollHeight = target.scrollHeight;
        let offsetHeight = target.clientHeight;
        let totalHeight = scrollTop + offsetHeight;
        let direction = (this.virtualScrollTop < scrollTop) ? 'next' : 'previous';
        let tBody = target.querySelector('tbody');
        let emptyTBody = createElement('tbody');
        let topElement = this.getElementFromScrollerPosition(event, direction);
        let scrollDate = new Date(parseInt(topElement.getAttribute('data-date'), 0));
        let filterDate;
        let filterData;
        if (scrollTop === 0) {
            filterDate = this.getPreviousNextDate(addDays(scrollDate, -1), direction);
            filterData = this.appointmentFiltering(filterDate.start, filterDate.end);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) {
                this.renderContent(emptyTBody, filterDate.start, filterDate.end);
                prepend([].slice.call(emptyTBody.childNodes), tBody);
                this.agendaBase.wireEventActions();
                for (let s = 0, element = tBody.children; s < element.length; s++) {
                    if (element[s].getAttribute('aria-rowindex') === topElement.getAttribute('aria-colindex')) {
                        let scrollToValue = element[s].offsetTop -
                            this.element.querySelector('.e-agenda-item').offsetHeight;
                        target.scrollTop = scrollToValue;
                        break;
                    }
                }
                this.updateHeaderText(scrollDate);
            }
        }
        else if (totalHeight === scrollHeight) {
            filterDate = this.getPreviousNextDate(addDays(scrollDate, 1), direction);
            filterData = this.appointmentFiltering(filterDate.start, filterDate.end);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) {
                this.renderContent(emptyTBody, filterDate.start, filterDate.end);
                append([].slice.call(emptyTBody.childNodes), tBody);
                this.agendaBase.wireEventActions();
                this.updateHeaderText(scrollDate);
            }
        }
        else {
            this.updateHeaderText(scrollDate);
        }
        this.virtualScrollTop = scrollTop;
        let selectedElements = this.parent.eventBase.getSelectedAppointments();
        if (selectedElements.length > 0) {
            selectedElements[selectedElements.length - 1].focus();
        }
    }
    getElementFromScrollerPosition(event, direction) {
        let filterElement;
        let target = event.target;
        let scrollTop = target.scrollTop;
        let scrollHeight = target.scrollHeight;
        let offsetHeight = target.clientHeight;
        let totalHeight = scrollTop + offsetHeight;
        let liCollection = [].slice.call(target.querySelectorAll('.e-agenda-item'));
        let li;
        let liDetails;
        if (liCollection.length > 0) {
            if (scrollTop === 0) {
                li = liCollection[0];
                filterElement = closest(li, '.' + AGENDA_CELLS_CLASS);
            }
            else if (totalHeight === scrollHeight) {
                li = liCollection[liCollection.length - 1];
                filterElement = closest(li, '.' + AGENDA_CELLS_CLASS);
            }
            else {
                for (let a = 0, length = liCollection.length; a < length; a++) {
                    li = liCollection[a];
                    liDetails = li.getBoundingClientRect();
                    if (liDetails.top >= 0) {
                        filterElement = closest(li, '.' + AGENDA_CELLS_CLASS);
                        break;
                    }
                }
            }
        }
        return filterElement;
    }
    updateHeaderText(date) {
        if (this.parent.showHeaderBar) {
            this.parent.headerModule.updateDateRange(this.getDateRangeText(date));
        }
    }
    getPreviousNextDate(date, type) {
        let currentDate = new Date(date.getTime());
        let firstDate = this.getStartDateFromEndDate(date);
        let lastDate = this.getEndDateFromStartDate(date);
        let daysCount = 0;
        do {
            let filterData = this.appointmentFiltering(currentDate);
            if (filterData.length > 0 || !this.parent.hideEmptyAgendaDays) {
                daysCount++;
            }
            currentDate = addDays(currentDate, (type === 'next') ? 1 : -1);
            if (currentDate < firstDate || currentDate > lastDate) {
                break;
            }
        } while (daysCount !== this.parent.agendaDaysCount);
        let endDate = addDays(currentDate, (type === 'next') ? -1 : 1);
        return (type === 'next') ? { start: date, end: addDays(endDate, 1) } : { start: endDate, end: addDays(date, 1) };
    }
    appointmentFiltering(startDate, endDate) {
        let dateStart;
        let dateEnd;
        if (!isNullOrUndefined(startDate) && isNullOrUndefined(endDate)) {
            dateStart = resetTime(new Date(startDate.getTime()));
            dateEnd = setTime(new Date(dateStart.getTime()), MS_PER_DAY);
        }
        else {
            dateStart = new Date(startDate.getTime());
            dateEnd = new Date(endDate.getTime());
        }
        let filterData = this.parent.eventBase.filterEvents(dateStart, dateEnd);
        if (filterData.length === 0) {
            this.refreshEvent(startDate);
            filterData = this.parent.eventBase.filterEvents(dateStart, dateEnd);
        }
        return filterData;
    }
    getStartDateFromEndDate(endDate) {
        let filterDate;
        let fieldMapping = this.parent.eventFields;
        if (this.parent.eventsProcessed.length > 0) {
            let firstDate = Math.min.apply(Math, this.parent.eventsProcessed.map((a) => {
                let date = a[fieldMapping.startTime];
                return date.getTime();
            }));
            filterDate = this.parent.hideEmptyAgendaDays ? new Date(firstDate) : this.minDate;
        }
        else {
            filterDate = this.parent.hideEmptyAgendaDays ? addMonths(endDate, -1) : this.minDate;
        }
        return resetTime(filterDate);
    }
    getEndDateFromStartDate(startDate) {
        let filterDate;
        let fieldMapping = this.parent.eventFields;
        if (this.parent.eventsProcessed.length > 0) {
            let lastDate = Math.max.apply(Math, this.parent.eventsProcessed.map((a) => {
                let date = a[fieldMapping.endTime];
                return date.getTime();
            }));
            filterDate = this.parent.hideEmptyAgendaDays ? new Date(lastDate) : this.maxDate;
        }
        else {
            filterDate = this.parent.hideEmptyAgendaDays ? addMonths(startDate, 1) : this.maxDate;
        }
        return resetTime(addDays(filterDate, 1));
    }
    getNextPreviousDate(type) {
        let noOfDays = (type === 'next') ? 1 : -1;
        return addDays(this.parent.selectedDate, noOfDays);
    }
    startDate() {
        return resetTime(this.parent.selectedDate);
    }
    endDate() {
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            return this.getEndDateFromStartDate(this.startDate());
        }
        else {
            return addDays(this.startDate(), this.parent.agendaDaysCount);
        }
    }
    getDateRangeText(date) {
        let formatDate = (this.parent.activeViewOptions.dateFormat) ? this.parent.activeViewOptions.dateFormat : 'MMMM y';
        if (this.parent.activeViewOptions.allowVirtualScrolling || this.parent.isAdaptive) {
            let currentDate = isNullOrUndefined(date) ? this.parent.selectedDate : date;
            return this.parent.globalize.formatDate(currentDate, { format: formatDate, calendar: this.parent.getCalendarMode() });
        }
        else {
            let startDate = this.parent.selectedDate;
            let endDate = addDays(startDate, this.parent.agendaDaysCount - 1);
            return this.formatDateRange(startDate, endDate);
        }
    }
    dayNavigationClick(e) {
        let date = this.parent.getDateFromElement(closest(e.currentTarget, '.' + AGENDA_CELLS_CLASS));
        if (!isNullOrUndefined(date) && !this.parent.isAdaptive) {
            this.parent.setProperties({ selectedDate: date }, true);
            this.parent.changeView('Day', e);
        }
    }
    // private isMonthFirstDate(date: Date): boolean {
    //     return date.getDate() === 1;
    // }
    wireEvents() {
        EventHandler.add(this.element.querySelector('.' + CONTENT_WRAP_CLASS), scroll, this.agendaScrolling, this);
    }
    unWireEvents() {
        EventHandler.remove(this.element.querySelector('.' + CONTENT_WRAP_CLASS), scroll, this.agendaScrolling);
        let dateHeaderElement = [].slice.call(this.element.querySelectorAll('.e-m-date'));
        for (let element of dateHeaderElement) {
            EventHandler.remove(element, 'click', this.dayNavigationClick);
        }
    }
    addEventListener() {
        this.parent.on(scrollUiUpdate, this.onAgendaScrollUiUpdate, this);
        this.parent.on(dataReady, this.eventLoad, this);
    }
    removeEventListener() {
        this.parent.off(scrollUiUpdate, this.onAgendaScrollUiUpdate);
        this.parent.off(dataReady, this.eventLoad);
    }
    onAgendaScrollUiUpdate() {
        let headerHeight = this.getHeaderBarHeight();
        if (this.parent.headerModule) {
            if (this.parent.activeViewOptions.allowVirtualScrolling) {
                this.parent.headerModule.updateHeaderItems('add');
            }
            else {
                this.parent.headerModule.updateHeaderItems('remove');
            }
        }
        let contentArea = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        contentArea.style.height = formatUnit(this.parent.element.offsetHeight - headerHeight);
    }
    /**
     * To destroy the agenda.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            this.unWireEvents();
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            remove(this.element);
            this.element = null;
            if (this.parent.headerModule && this.parent.activeViewOptions.allowVirtualScrolling) {
                this.parent.headerModule.updateHeaderItems('remove');
            }
        }
    }
}

/**
 * month agenda view
 */
class MonthAgenda extends Month {
    /**
     * Constructor
     */
    constructor(parent) {
        super(parent);
        this.dayNameFormat = 'narrow';
        this.viewClass = 'e-month-agenda-view';
        this.agendaDates = {};
        this.agendaBase = new AgendaBase(parent);
    }
    renderAppointmentContainer() {
        let contentArea = this.getContentAreaElement();
        let wrapperContainer = createElement('div', { className: WRAPPER_CONTAINER_CLASS });
        contentArea.appendChild(wrapperContainer);
        let appWrap = createElement('div', { className: APPOINTMENT_WRAP_CLASS });
        wrapperContainer.appendChild(appWrap);
        this.appendAppContainer(appWrap);
        this.setEventWrapperHeight();
    }
    getDayNameFormat() {
        if (this.parent.isAdaptive) {
            return 'narrow';
        }
        return 'abbreviated';
    }
    setEventWrapperHeight() {
        let headerHeight = (this.parent.headerModule ? this.parent.headerModule.getHeaderElement().offsetHeight : 0) + 2;
        let resourceWrapper = this.parent.element.querySelector('.' + RESOURCE_HEADER_TOOLBAR);
        if (resourceWrapper) {
            headerHeight += resourceWrapper.offsetHeight;
        }
        let contentArea = this.getContentAreaElement().firstChild;
        let dateHeader = this.element.querySelector('.' + DATE_HEADER_WRAP_CLASS);
        let availableHeight = this.parent.element.offsetHeight - headerHeight - dateHeader.offsetHeight - contentArea.offsetHeight;
        let wrapperContainer = this.element.querySelector('.' + WRAPPER_CONTAINER_CLASS);
        let eventWrapper = this.element.querySelector('.' + APPOINTMENT_WRAP_CLASS);
        wrapperContainer.style.height = eventWrapper.style.height = formatUnit(availableHeight);
    }
    onDataReady(args) {
        this.setEventWrapperHeight();
        this.clearElements();
        let eventCollection = args.processedData;
        if (this.parent.uiStateValues.isGroupAdaptive) {
            let resource = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
            eventCollection = this.parent.eventBase.filterEventsByResource(resource, eventCollection);
        }
        this.parent.eventsProcessed = this.agendaBase.processAgendaEvents(eventCollection);
        let count = 0;
        for (let date of this.renderDates) {
            let filterData = this.appointmentFiltering(date);
            let workCell = this.element.querySelectorAll('.' + WORK_CELLS_CLASS)[count];
            if (filterData.length > 0) {
                if (!workCell.querySelector('.' + APPOINTMENT_INDICATOR_CLASS)) {
                    workCell.appendChild(createElement('div', { className: APPOINTMENT_INDICATOR_CLASS }));
                }
                if (date.getTime() === resetTime(new Date(this.parent.selectedDate.getTime())).getTime()) {
                    this.onEventRender(filterData, date);
                }
            }
            count++;
        }
    }
    onCellClick(event) {
        this.parent.quickPopup.quickPopupHide();
        let filterData = this.appointmentFiltering(event.startTime);
        this.onEventRender(filterData, event.startTime);
        this.parent.setProperties({ selectedDate: new Date('' + event.startTime) }, true);
    }
    onEventRender(events, date) {
        let appWrap = this.element.querySelector('.' + APPOINTMENT_WRAP_CLASS);
        appWrap.innerHTML = '';
        if (this.parent.activeViewOptions.group.resources.length === 0 || this.parent.uiStateValues.isGroupAdaptive) {
            if (events.length > 0) {
                let appContainer = createElement('div', { className: APPOINTMENT_CONTAINER_CLASS });
                appWrap.appendChild(this.agendaBase.
                    createAgendaContentElement('data', events, appContainer));
            }
            else {
                this.appendAppContainer(appWrap);
            }
        }
        else {
            if (events.length > 0) {
                let table = this.createTableLayout();
                let tBody = table.querySelector('tbody');
                this.agendaBase.calculateResourceTableElement(tBody, 1, date);
                table.appendChild(tBody);
                appWrap.appendChild(table);
            }
            else {
                this.appendAppContainer(appWrap);
            }
        }
        this.agendaBase.wireEventActions();
    }
    appointmentFiltering(date) {
        let dateStart = resetTime(new Date(date.getTime()));
        let dateEnd = setTime(new Date(dateStart.getTime()), MS_PER_DAY);
        return this.parent.eventBase.filterEvents(dateStart, dateEnd);
    }
    clearElements() {
        let appointmentIndicators = [].slice.call(this.element.querySelectorAll('.' + APPOINTMENT_INDICATOR_CLASS));
        for (let appointmentIndicator of appointmentIndicators) {
            remove(appointmentIndicator);
        }
        this.appendAppContainer(this.element.querySelector('.' + APPOINTMENT_WRAP_CLASS));
    }
    appendAppContainer(appWrap) {
        let app = createElement('div', { className: APPOINTMENT_CONTAINER_CLASS });
        addClass([app], AGENDA_NO_EVENT_CLASS);
        app.innerHTML = this.parent.localeObj.getConstant('noEvents');
        appWrap.innerHTML = '';
        appWrap.appendChild(app);
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'monthAgenda';
    }
}

const EVENT_GAP$1 = 2;
const BLOCK_INDICATOR_WIDTH = 22;
const BLOCK_INDICATOR_HEIGHT = 18;
/**
 * Timeline view events render
 */
class TimelineEvent extends MonthEvent {
    /**
     * Constructor for timeline views
     */
    constructor(parent, type) {
        super(parent);
        this.startHour = this.parent.activeView.getStartHour();
        this.endHour = this.parent.activeView.getEndHour();
        this.slotCount = this.parent.activeViewOptions.timeScale.slotCount;
        this.interval = this.parent.activeViewOptions.timeScale.interval;
        this.day = 0;
        this.rowIndex = 0;
        this.renderType = type;
        this.appContainers = [].slice.call(this.element.querySelectorAll('.' + APPOINTMENT_CONTAINER_CLASS));
        this.dayLength = this.element.querySelectorAll('.' + CONTENT_TABLE_CLASS + ' tbody tr')[0].children.length;
        this.content = this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS);
    }
    getSlotDates() {
        this.slots = [];
        this.slots.push(this.parent.activeView.renderDates.map((date) => { return +date; }));
        if (this.parent.headerRows.length > 0 &&
            this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Hour') {
            this.renderType = 'day';
            this.cellWidth = this.content.offsetWidth / this.dateRender.length;
            this.slotsPerDay = 1;
        }
        else {
            this.slotsPerDay = (this.dayLength / this.dateRender.length);
        }
    }
    getOverlapEvents(date, appointments) {
        let appointmentsList = [];
        if (this.renderType === 'day') {
            for (let app of appointments) {
                if ((resetTime(app[this.fields.startTime]).getTime() <= resetTime(new Date(date.getTime())).getTime()) &&
                    (resetTime(app[this.fields.endTime]).getTime() >= resetTime(new Date(date.getTime())).getTime())) {
                    appointmentsList.push(app);
                }
            }
        }
        else {
            for (let app of appointments) {
                let eventData = app.data;
                if (eventData[this.fields.startTime].getTime() <= date.getTime() &&
                    eventData[this.fields.endTime].getTime() > date.getTime()) {
                    appointmentsList.push(app);
                }
            }
        }
        return appointmentsList;
    }
    renderResourceEvents() {
        this.removeHeightProperty(RESOURCE_COLUMN_TABLE_CLASS);
        let resources = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.renderedResources;
        for (let i = 0; i < resources.length; i++) {
            this.rowIndex = i;
            this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, resources[i]);
        }
    }
    renderEvents(event, resIndex) {
        let eventData = event.data;
        let startTime = this.getStartTime(event, eventData);
        let endTime = this.getEndTime(event, eventData);
        this.day = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime())));
        if (this.day < 0) {
            return;
        }
        let cellTd = this.getCellTd();
        let overlapCount = this.getIndex(startTime);
        event.Index = overlapCount;
        let appHeight = this.eventHeight;
        let diffInDays = eventData.count;
        if (startTime <= endTime) {
            let appWidth = this.getEventWidth(startTime, endTime, event[this.fields.isAllDay], diffInDays);
            appWidth = this.renderType === 'day' ? appWidth - 2 : appWidth;
            let appLeft = 0;
            let appRight = 0;
            let position = this.getPosition(startTime, endTime, event[this.fields.isAllDay], this.day);
            appWidth = (appWidth <= 0) ? this.cellWidth : appWidth; // appWidth 0 when start and end time as same
            this.renderedEvents.push(extend({}, event, null, true));
            let top = this.getRowTop(resIndex);
            let appTop = (top + EVENT_GAP$1) + (overlapCount * (appHeight + EVENT_GAP$1));
            appLeft = (this.parent.enableRtl) ? 0 : position;
            appRight = (this.parent.enableRtl) ? position : 0;
            let height = ((overlapCount + 1) * (appHeight + EVENT_GAP$1)) + this.moreIndicatorHeight;
            if ((this.cellHeight > height) || this.parent.rowAutoHeight) {
                let appointmentElement = this.createAppointmentElement(event, resIndex);
                this.applyResourceColor(appointmentElement, event, 'backgroundColor', this.groupOrder);
                setStyleAttribute(appointmentElement, {
                    'width': appWidth + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
                });
                this.wireAppointmentEvents(appointmentElement, false, event);
                this.renderEventElement(event, appointmentElement, cellTd);
                if (this.parent.rowAutoHeight) {
                    let firstChild = this.getFirstChild(resIndex);
                    this.updateCellHeight(firstChild, height);
                }
            }
            else {
                for (let i = 0; i < diffInDays; i++) {
                    let moreIndicator = cellTd.querySelector('.' + MORE_INDICATOR_CLASS);
                    let appPos = (this.parent.enableRtl) ? appRight : appLeft;
                    appPos = (Math.floor(appPos / this.cellWidth) * this.cellWidth);
                    if ((cellTd && isNullOrUndefined(moreIndicator)) ||
                        (!this.isAlreadyAvail(appPos, cellTd))) {
                        let interval = this.interval / this.slotCount;
                        let startDate = new Date(this.dateRender[this.day + i].getTime());
                        let endDate = addDays(this.dateRender[this.day + i], 1);
                        let startDateTime = new Date(+startTime);
                        let slotStartTime = (new Date(startDateTime.setMinutes(Math.floor(startDateTime.getMinutes() / interval) * interval)));
                        let slotEndTime = new Date(slotStartTime.getTime() + (60000 * interval));
                        let groupIndex;
                        if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(resIndex)) {
                            groupIndex = resIndex.toString();
                        }
                        let filterEvents = this.getFilterEvents(startDate, endDate, slotStartTime, slotEndTime, groupIndex);
                        let appArea = this.cellHeight - this.moreIndicatorHeight;
                        let renderedAppCount = Math.floor(appArea / (appHeight + EVENT_GAP$1));
                        let count = (filterEvents.length - renderedAppCount) <= 0 ? 1 : (filterEvents.length - renderedAppCount);
                        let moreIndicatorElement;
                        if (this.renderType === 'day') {
                            moreIndicatorElement = this.getMoreIndicatorElement(count, startDate, endDate);
                        }
                        else {
                            moreIndicatorElement = this.getMoreIndicatorElement(count, slotStartTime, slotEndTime);
                        }
                        if (!isNullOrUndefined(groupIndex)) {
                            moreIndicatorElement.setAttribute('data-group-index', groupIndex);
                        }
                        moreIndicatorElement.style.top = top + appArea + 'px';
                        moreIndicatorElement.style.width = this.cellWidth + 'px';
                        moreIndicatorElement.style.left = (Math.floor(appLeft / this.cellWidth) * this.cellWidth) + 'px';
                        moreIndicatorElement.style.right = (Math.floor(appRight / this.cellWidth) * this.cellWidth) + 'px';
                        this.renderElement(cellTd, moreIndicatorElement);
                        EventHandler.add(moreIndicatorElement, 'click', this.moreIndicatorClick, this);
                    }
                }
            }
        }
    }
    updateCellHeight(cell, height) {
        if ((height > cell.offsetHeight)) {
            setStyleAttribute(cell, { 'height': height + 'px' });
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                let resourceCell = this.parent.element.querySelector('.' + RESOURCE_COLUMN_TABLE_CLASS + ' ' + 'tbody td[data-group-index="' +
                    cell.getAttribute('data-group-index') + '"]');
                setStyleAttribute(resourceCell, { 'height': height + 'px' });
            }
        }
    }
    getFirstChild(index) {
        let query = '.' + CONTENT_TABLE_CLASS + ' tbody td';
        let groupIndex = '';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            groupIndex = '[data-group-index="' + index.toString() + '"]';
        }
        let td = this.parent.element.querySelector(query + groupIndex);
        return td;
    }
    updateBlockElements() {
        let blockElement = [].slice.call(this.element.querySelectorAll('.' + BLOCK_APPOINTMENT_CLASS));
        for (let element of blockElement) {
            let resIndex = parseInt(element.getAttribute('data-group-index'), 10);
            let firstChild = this.getFirstChild(resIndex);
            element.style.height = firstChild.offsetHeight + 'px';
            let width = Math.round(element.offsetWidth / firstChild.offsetWidth);
            element.style.width = (firstChild.offsetWidth * width) + 'px';
        }
        let blockIndicator = [].slice.call(this.element.querySelectorAll('.' + BLOCK_INDICATOR_CLASS));
        for (let element of blockIndicator) {
            let resIndex = parseInt(element.getAttribute('data-group-index'), 10);
            element.style.top = this.getRowTop(resIndex) +
                this.getFirstChild(resIndex).offsetHeight - BLOCK_INDICATOR_HEIGHT + 'px';
        }
    }
    getStartTime(event, eventData) {
        let startTime = event[this.fields.startTime];
        let schedule = getStartEndHours(startTime, this.startHour, this.endHour);
        if (schedule.startHour.getTime() >= eventData[this.fields.startTime]) {
            startTime = schedule.startHour;
        }
        else if (schedule.endHour.getTime() <= eventData[this.fields.startTime]) {
            startTime = this.getNextDay(schedule.startHour, eventData);
        }
        else {
            startTime = eventData[this.fields.startTime];
        }
        // To overcome the overflow
        if (event[this.fields.isAllDay]) {
            eventData[this.fields.startTime] = schedule.startHour;
        }
        return startTime;
    }
    getNextDay(startTime, eventData) {
        let startDate;
        for (let i = 1; i <= this.dateRender.length; i++) {
            startDate = addDays(startTime, i);
            if (this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime()))) !== -1) {
                eventData.count = eventData.count - 1;
                return startDate;
            }
        }
        return startDate;
    }
    getEndTime(event, eventData) {
        let endTime = event[this.fields.endTime];
        let schedule = getStartEndHours(endTime, this.startHour, this.endHour);
        if (schedule.endHour.getTime() <= eventData[this.fields.endTime]) {
            endTime = schedule.endHour;
        }
        else {
            endTime = eventData[this.fields.endTime];
        }
        // To overcome the overflow
        if (event[this.fields.isAllDay]) {
            eventData[this.fields.endTime] = schedule.endHour;
        }
        return endTime;
    }
    getEventWidth(startDate, endDate, isAllDay, count) {
        if (this.renderType === 'day' || isAllDay) {
            return (count * this.slotsPerDay) * this.cellWidth;
        }
        if (this.isSameDay(startDate, endDate)) {
            return this.getSameDayEventsWidth(startDate, endDate);
        }
        else {
            return this.getSpannedEventsWidth(startDate, endDate, count);
        }
    }
    getSameDayEventsWidth(startDate, endDate) {
        return (((endDate.getTime() - startDate.getTime())) / (60 * 1000) * (this.cellWidth * this.slotCount) / this.interval);
    }
    getSpannedEventsWidth(startDate, endDate, diffInDays) {
        let width = (diffInDays * this.slotsPerDay) * this.cellWidth;
        let startWidth;
        let endWidth;
        let start = getStartEndHours(resetTime(new Date(startDate.getTime())), this.startHour, this.endHour);
        startWidth = this.getSameDayEventsWidth(start.startHour, startDate);
        if (this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(endDate.getTime()))) === -1) {
            endWidth = 0;
        }
        else {
            let end = getStartEndHours(resetTime(new Date(endDate.getTime())), this.startHour, this.endHour);
            endWidth = this.getSameDayEventsWidth(endDate, end.endHour);
            endWidth = ((this.slotsPerDay * this.cellWidth) === endWidth) ? 0 : endWidth;
        }
        let spannedWidth = startWidth + endWidth;
        return (width > spannedWidth) ? width - spannedWidth : endWidth - startWidth;
    }
    isSameDay(startTime, endTime) {
        let startDay = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime())));
        let endDay = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(endTime.getTime())));
        return (startDay === endDay);
    }
    getAppointmentLeft(schedule, startTime, day) {
        let slotTd = (this.isSameDay(startTime, schedule.startHour)) ?
            ((startTime.getTime() - schedule.startHour.getTime()) / ((60 * 1000) * this.interval)) * this.slotCount : 0;
        if (day === 0) {
            return slotTd;
        }
        else {
            let daySlot = (((schedule.endHour.getTime() - schedule.startHour.getTime()) / (60 * 1000)) / this.interval) * this.slotCount;
            return (daySlot * day) + slotTd;
        }
    }
    getPosition(startTime, endTime, isAllDay, day) {
        if (this.renderType === 'day' || isAllDay) {
            return (day * this.slotsPerDay) * this.cellWidth;
        }
        let currentDate = resetTime(new Date(this.dateRender[day].getTime()));
        let schedule = getStartEndHours(currentDate, this.startHour, this.endHour);
        let cellIndex;
        if (schedule.endHour.getTime() <= endTime.getTime() && schedule.startHour.getTime() >= startTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, schedule.startHour, day);
        }
        else if (schedule.endHour.getTime() <= endTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, startTime, day);
        }
        else if (schedule.startHour.getTime() >= startTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, schedule.startHour, day);
        }
        else {
            cellIndex = this.getAppointmentLeft(schedule, startTime, day);
        }
        return cellIndex * this.cellWidth;
    }
    getFilterEvents(startDate, endDate, startTime, endTime, gIndex) {
        if (this.renderType === 'day') {
            return this.getFilteredEvents(startDate, endDate, gIndex);
        }
        else {
            return this.getFilteredEvents(startTime, endTime, gIndex);
        }
    }
    isAlreadyAvail(appPos, cellTd) {
        let moreIndicator = [].slice.call(cellTd.querySelectorAll('.' + MORE_INDICATOR_CLASS));
        for (let i = 0; i < moreIndicator.length; i++) {
            let indicatorPos;
            if (moreIndicator) {
                indicatorPos = (this.parent.enableRtl) ? moreIndicator[i].style.right : moreIndicator[i].style.left;
            }
            if (parseInt(indicatorPos, 10) === Math.floor(appPos)) {
                return true;
            }
        }
        return false;
    }
    getRowTop(resIndex) {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            let td = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS + ' ' + 'tbody td[data-group-index="'
                + resIndex.toString() + '"]');
            return td.offsetTop;
        }
        return 0;
    }
    getCellTd() {
        let wrapIndex = this.parent.uiStateValues.isGroupAdaptive ? 0 : this.rowIndex;
        return this.appContainers[wrapIndex];
    }
    renderBlockIndicator(cellTd, position, resIndex) {
        // No need to render block icon for Year, Month and Week header rows
        if (this.parent.headerRows.length > 0 &&
            (this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Hour' ||
                this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Date')) {
            return;
        }
        position = (Math.floor(position / this.cellWidth) * this.cellWidth) + this.cellWidth - BLOCK_INDICATOR_WIDTH;
        if (!this.isAlreadyAvail(position, cellTd)) {
            let blockIndicator = createElement('div', { className: 'e-icons ' + BLOCK_INDICATOR_CLASS });
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                blockIndicator.setAttribute('data-group-index', resIndex.toString());
            }
            if (this.parent.enableRtl) {
                blockIndicator.style.right = position + 'px';
            }
            else {
                blockIndicator.style.left = position + 'px';
            }
            blockIndicator.style.top = this.getRowTop(resIndex) + this.cellHeight - BLOCK_INDICATOR_HEIGHT + 'px';
            this.renderElement(cellTd, blockIndicator);
        }
    }
}

/**
 * timeline header
 */
class TimelineHeaderRow {
    constructor(parent, renderDates) {
        this.parent = parent;
        this.renderDates = renderDates;
    }
    groupByYear(dates) {
        let result = {};
        for (let d of dates) {
            let key = d.getFullYear();
            result[key] = result[key] || [];
            result[key].push(d);
        }
        return result;
    }
    groupByMonth(dates) {
        let result = {};
        for (let d of dates) {
            let key = (d.getFullYear() - 1970) * 12 + d.getMonth();
            result[key] = result[key] || [];
            result[key].push(d);
        }
        return result;
    }
    groupByWeek(dates) {
        let result = {};
        for (let d of dates) {
            let jsDate = +new Date(1970, 0, 1);
            let key = Math.ceil(((((+d - jsDate)) / MS_PER_DAY) + new Date(jsDate).getDay() + 1) / 7);
            result[key] = result[key] || [];
            result[key].push(d);
        }
        return result;
    }
    generateSlots(data, colspan, template, tempFn, cls, type) {
        let tdDatas = [];
        let customHelper = {
            getYear: (dt) => {
                return this.parent.globalize.formatDate(dt, { format: 'y', calendar: this.parent.getCalendarMode() });
            },
            getMonth: (dt) => {
                return this.parent.globalize.formatDate(dt, { format: 'MMMM', calendar: this.parent.getCalendarMode() });
            },
            getWeekNumber: (dt) => {
                return getWeekNumber(dt);
            }
        };
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            let dates = data[keys[i]];
            let htmlCol;
            if (!tempFn) {
                htmlCol = compile(template, customHelper)({ date: dates[0] });
            }
            else {
                let args = { date: dates[0], type: type };
                htmlCol = tempFn(args);
            }
            tdDatas.push({
                date: dates[0], type: type, className: [cls], colSpan: dates.length * colspan, template: htmlCol
            });
        }
        return tdDatas;
    }
    generateColumnLevels(dateSlots, hourSlots) {
        let levels = [];
        let rows = this.parent.activeViewOptions.headerRows;
        let lastLevelColspan = 1;
        if (rows[rows.length - 1].option === 'Hour' && hourSlots.length > 0) {
            lastLevelColspan = hourSlots.length / dateSlots.length;
        }
        let tdDatas = [];
        let templateFn;
        for (let row of rows) {
            switch (row.option) {
                case 'Year':
                    templateFn = row.template ? this.parent.templateParser(row.template) : undefined;
                    let yearTemplate = '<span class="e-header-year">${getYear(date)}</span>';
                    let byYear = this.groupByYear(this.renderDates);
                    tdDatas = this.generateSlots(byYear, lastLevelColspan, yearTemplate, templateFn, 'e-header-year-cell', 'yearHeader');
                    levels.push(tdDatas);
                    break;
                case 'Month':
                    templateFn = row.template ? this.parent.templateParser(row.template) : undefined;
                    let monthTemp = '<span class="e-header-month">${getMonth(date)}</span>';
                    let byMonth = this.groupByMonth(this.renderDates);
                    tdDatas = this.generateSlots(byMonth, lastLevelColspan, monthTemp, templateFn, 'e-header-month-cell', 'monthHeader');
                    levels.push(tdDatas);
                    break;
                case 'Week':
                    templateFn = row.template ? this.parent.templateParser(row.template) : undefined;
                    let weekTemplate = '<span class="e-header-week">${getWeekNumber(date)}</span>';
                    let byWeek = this.groupByWeek(this.renderDates);
                    tdDatas = this.generateSlots(byWeek, lastLevelColspan, weekTemplate, templateFn, 'e-header-week-cell', 'weekHeader');
                    levels.push(tdDatas);
                    break;
                case 'Date':
                    tdDatas = dateSlots;
                    tdDatas = tdDatas.map((value) => {
                        value.colSpan = lastLevelColspan;
                        return value;
                    });
                    levels.push(tdDatas);
                    break;
                case 'Hour':
                    if (hourSlots.length > 0) {
                        levels.push(hourSlots);
                    }
                    break;
            }
        }
        return levels;
    }
}

/**
 * timeline view
 */
class TimelineViews extends VerticalView {
    constructor(parent) {
        super(parent);
        this.dateHeaderTemplate = '<span class="e-header-date e-navigate">${getTimelineDate(date)}</span>';
        this.baseCssClass = 'e-timeline-view';
    }
    getLeftPanelElement() {
        return this.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
    }
    scrollTopPanel(target) {
        super.scrollTopPanel(target);
        this.scrollHeaderLabels(target);
    }
    scrollToWorkHour() {
        let start = this.parent.getStartEndTime(this.parent.workHours.start);
        let currDateTime = this.isWorkDay(this.parent.selectedDate) && this.parent.workHours.highlight &&
            !isNullOrUndefined(start) ? new Date(+this.parent.selectedDate).setHours(start.getHours(), start.getMinutes())
            : new Date(+this.parent.selectedDate).setHours(0, 0, 0, 0);
        let queryString = '[data-date="' + currDateTime + '"]';
        let firstWorkHourCell = this.element.querySelector(queryString);
        if (firstWorkHourCell) {
            this.getScrollableElement().scrollLeft = firstWorkHourCell.offsetLeft;
        }
    }
    scrollToHour(hour) {
        let date = this.parent.getStartEndTime(hour);
        if (isNullOrUndefined(date)) {
            return;
        }
        this.getScrollableElement().scrollLeft = this.getLeftFromDateTime(null, date);
    }
    generateColumnLevels() {
        let levels = [];
        let dateSlots = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        levels.push(dateSlots);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.generateResourceLevels(dateSlots, !this.parent.uiStateValues.isGroupAdaptive);
        }
        let hourSlots = [];
        if (this.parent.activeViewOptions.timeScale.enable) {
            hourSlots = this.generateTimeSlots(levels[levels.length - 1]);
            levels.push(hourSlots);
        }
        if (this.parent.activeViewOptions.headerRows.length > 0) {
            let renderGn = new TimelineHeaderRow(this.parent, this.renderDates);
            levels = renderGn.generateColumnLevels(dateSlots, hourSlots);
        }
        return levels;
    }
    generateTimeSlots(dateSlots) {
        let handler = (r) => {
            r.type = r.first ? 'majorSlot' : 'minorSlot';
            r.className = r.first ? ['e-time-slots'] : ['e-time-slots', TIME_CELLS_CLASS];
            r.workDays = this.parent.activeViewOptions.workDays;
            return r;
        };
        let timeSlotData = this.getTimeSlotRows(handler);
        let slots = [];
        for (let data of dateSlots) {
            data.colSpan = timeSlotData.length;
            let tempTimeSlots = extend([], timeSlotData, null, true);
            for (let slot of tempTimeSlots) {
                slot.date = new Date(+resetTime(data.date) + getDateInMs(slot.date));
                slots.push(slot);
            }
        }
        return slots;
    }
    changeCurrentTimePosition() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeCurrentTimeIndicatorElements();
        let currentDateIndex = this.getCurrentTimeIndicatorIndex();
        let left = this.getLeftFromDateTime(currentDateIndex, new Date());
        let height = this.element.querySelector('.' + CONTENT_TABLE_CLASS).offsetHeight;
        let headerWrap = this.element.querySelector('.' + DATE_HEADER_WRAP_CLASS);
        let contentWrap = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        contentWrap.appendChild(createElement('div', {
            className: CURRENT_TIMELINE_CLASS,
            styles: (this.parent.enableRtl ? 'right' : 'left') + ':' + formatUnit(left) + '; height:' + formatUnit(height)
        }));
        if (this.parent.virtualScrollModule) {
            let timeIndicator = this.parent.element.querySelector('.' + CURRENT_TIMELINE_CLASS);
            let element = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS + ' table');
            setStyleAttribute(timeIndicator, {
                transform: element.style.transform
            });
        }
        let currentTimeEle = createElement('div', {
            innerHTML: this.parent.getTimeString(new Date()),
            className: CURRENT_TIME_CLASS
        });
        headerWrap.appendChild(currentTimeEle);
        currentTimeEle.style[this.parent.enableRtl ? 'right' : 'left'] = formatUnit(left - (currentTimeEle.offsetWidth / 2));
    }
    getLeftFromDateTime(currentDateIndex, date) {
        let startHour = this.getStartHour();
        let endHour = this.getEndHour();
        let diffInDates = 0;
        let diffInMinutes = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        if (!isNullOrUndefined(currentDateIndex)) {
            let end = (endHour.getHours() === 0) ? 24 : endHour.getHours();
            if (currentDateIndex[0] !== 0) {
                diffInDates = (currentDateIndex[0]) * ((end - startHour.getHours()) * 60) + (endHour.getMinutes() - startHour.getMinutes());
            }
            diffInMinutes = diffInDates + diffInMinutes;
        }
        return (diffInMinutes * this.getWorkCellWidth() * this.parent.activeViewOptions.timeScale.slotCount) /
            this.parent.activeViewOptions.timeScale.interval;
    }
    getWorkCellWidth() {
        return this.element.querySelector('.e-work-cells').offsetWidth;
    }
    renderHeader() {
        let tr = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        }
        let dateTd = createElement('td');
        dateTd.appendChild(this.renderDatesHeader());
        tr.appendChild(dateTd);
        prepend([tr], this.element.querySelector('tbody'));
    }
    createAllDayRow(table, tdData) {
        // For current time indicator wrapper
    }
    getCurrentTimeIndicatorIndex() {
        let currentDateIndex = [];
        let index = this.parent.getIndexOfDate(this.renderDates, resetTime(new Date()));
        if (index >= 0) {
            currentDateIndex.push(index);
        }
        return currentDateIndex;
    }
    renderContent() {
        let tr = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            let resTd = createElement('td');
            resTd.appendChild(this.parent.resourceBase.createResourceColumn());
            tr.appendChild(resTd);
        }
        let workTd = createElement('td');
        let wrap = this.renderContentArea();
        wrap.appendChild(this.createEventTable(this.getRowCount()));
        this.collapseRows(wrap);
        workTd.appendChild(wrap);
        tr.appendChild(workTd);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.renderVirtualTrack(wrap);
        }
        this.element.querySelector('tbody').appendChild(tr);
    }
    getRowCount() {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return this.parent.resourceBase.renderedResources.length;
        }
        return 1;
    }
    getResourceTdData(i, tdData) {
        let resLevel = this.parent.resourceBase.renderedResources[i];
        let resSHr = resLevel.resourceData[resLevel.resource.startHourField] || this.parent.workHours.start;
        let resEHr = resLevel.resourceData[resLevel.resource.endHourField] || this.parent.workHours.end;
        tdData.startHour = this.parent.getStartEndTime(resSHr);
        tdData.endHour = this.parent.getStartEndTime(resEHr);
        tdData.workDays = resLevel.resourceData[resLevel.resource.workDaysField] || this.parent.workDays;
        tdData.className = resLevel.className;
        tdData.groupIndex = resLevel.groupIndex;
        tdData.groupOrder = resLevel.groupOrder;
        return tdData;
    }
    renderContentTable(table) {
        let tBody = table.querySelector('tbody');
        append(this.getContentRows(), tBody);
    }
    getContentRows() {
        let rows = [];
        let tr = createElement('tr', { attrs: { role: 'row' } });
        let td = createElement('td', { attrs: { role: 'gridcell', 'aria-selected': 'false' } });
        let trCount = this.getRowCount();
        for (let i = 0; i < trCount; i++) {
            let ntr = tr.cloneNode();
            for (let tdData of this.colLevels[this.colLevels.length - 1]) {
                if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                    tdData = this.getResourceTdData(i, tdData);
                }
                let ntd = this.createContentTd(tdData, tdData, td);
                ntr.appendChild(ntd);
            }
            rows.push(ntr);
        }
        return rows;
    }
    getContentTdClass(r) {
        return (r.first || !this.parent.activeViewOptions.timeScale.enable) ? [WORK_CELLS_CLASS] :
            [WORK_CELLS_CLASS, ALTERNATE_CELLS_CLASS];
    }
    renderEvents() {
        if (this.parent.activeViewOptions.timeScale.enable) {
            let appointment = new TimelineEvent(this.parent, 'hour');
            appointment.renderAppointments();
        }
        else {
            let appointment = new TimelineEvent(this.parent, 'day');
            appointment.renderAppointments();
        }
    }
    getModuleName() {
        return 'timelineViews';
    }
}

/**
 * timeline month view
 */
class TimelineMonth extends Month {
    /**
     * Constructor for timeline month view
     */
    constructor(parent) {
        super(parent);
        this.viewClass = 'e-timeline-month-view';
        this.isInverseTableSelect = true;
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'timelineMonth';
    }
    onDataReady(args) {
        let appointment = new TimelineEvent(this.parent, 'day');
        appointment.renderAppointments();
    }
    getLeftPanelElement() {
        return this.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
    }
    scrollTopPanel(target) {
        super.scrollTopPanel(target);
        this.scrollHeaderLabels(target);
    }
    setContentHeight(content, leftPanelElement, height) {
        if (leftPanelElement) {
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(content));
        }
        content.style.height = formatUnit(height);
    }
    getDateSlots(renderDates, workDays) {
        let dateSlots = [];
        for (let col of renderDates) {
            let classList$$1 = [HEADER_CELLS_CLASS];
            if (this.isCurrentDate(col)) {
                classList$$1.push(CURRENT_DAY_CLASS);
            }
            dateSlots.push({ date: col, type: 'dateHeader', className: classList$$1, colSpan: 1, workDays: workDays });
        }
        return dateSlots;
    }
    renderLeftIndent(tr) {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        }
    }
    renderContent() {
        let contentTr = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            let resTd = createElement('td');
            resTd.appendChild(this.parent.resourceBase.createResourceColumn());
            contentTr.appendChild(resTd);
        }
        let contentTd = createElement('td');
        this.element.querySelector('tbody').appendChild(contentTr);
        let wrap = createElement('div', { className: CONTENT_WRAP_CLASS });
        wrap.appendChild(this.renderContentArea());
        wrap.appendChild(this.createEventTable(this.getRowCount()));
        this.collapseRows(wrap);
        EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        contentTd.appendChild(wrap);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.renderVirtualTrack(wrap);
        }
        contentTr.appendChild(contentTd);
    }
    getRowCount() {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return this.parent.resourceBase.renderedResources.length;
        }
        return 1;
    }
    getContentSlots() {
        let slotDatas = [];
        for (let row = 0; row < this.getRowCount(); row++) {
            for (let data of this.colLevels[this.colLevels.length - 1]) {
                data.className = [WORK_CELLS_CLASS];
                if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                    let resLevel = this.parent.resourceBase.renderedResources[row];
                    data.workDays = resLevel.resourceData[resLevel.resource.workDaysField] || this.parent.workDays;
                    data.className = data.className.concat(resLevel.className);
                    data.groupIndex = resLevel.groupIndex;
                    data.groupOrder = resLevel.groupOrder;
                }
                let slotData = {
                    date: new Date(+data.date), colSpan: data.colSpan, groupIndex: data.groupIndex, workDays: data.workDays,
                    type: 'monthCells', className: data.className
                };
                if (!slotDatas[row]) {
                    slotDatas[row] = [];
                }
                slotDatas[row].push(slotData);
            }
        }
        return slotDatas;
    }
    updateClassList() {
        // No need to update content for timeline month view
    }
    unwireEvents() {
        EventHandler.remove(this.getContentAreaElement(), 'scroll', this.onContentScroll);
    }
    getMonthStart(currentDate) {
        let monthStart = this.parent.calendarUtil.firstDateOfMonth(resetTime(currentDate));
        return new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
    }
    getMonthEnd(currentDate) {
        let monthStart = this.parent.calendarUtil.firstDateOfMonth(resetTime(currentDate));
        return this.parent.calendarUtil.lastDateOfMonth(addMonths(new Date(+monthStart), this.parent.activeViewOptions.interval - 1));
    }
    generateColumnLevels() {
        let colLevels = [];
        let level = this.getDateSlots(this.renderDates, this.parent.activeViewOptions.workDays);
        colLevels.push(level);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.generateResourceLevels(level, !this.parent.uiStateValues.isGroupAdaptive);
        }
        let hourSlots = [];
        if (this.parent.activeViewOptions.headerRows.length > 0) {
            let renderGn = new TimelineHeaderRow(this.parent, this.renderDates);
            colLevels = renderGn.generateColumnLevels(level, hourSlots);
        }
        this.colLevels = colLevels;
        return colLevels;
    }
}

/**
 * Excel Export Module
 */
class ExcelExport {
    constructor(parent) {
        this.parent = parent;
    }
    initializeExcelExport(excelExportOptions) {
        let exportFields = excelExportOptions.fields || Object.keys(this.parent.eventFields).map((field) => this.parent.eventFields[field]);
        let exportName = excelExportOptions.fileName || 'Schedule';
        let exportType = excelExportOptions.exportType || 'xlsx';
        let isIncludeOccurrences = excelExportOptions.includeOccurrences || false;
        let eventCollection;
        if (excelExportOptions.customData) {
            eventCollection = !isIncludeOccurrences ? excelExportOptions.customData :
                this.parent.eventBase.getProcessedEvents(excelExportOptions.customData);
        }
        else {
            eventCollection = (!isIncludeOccurrences ? this.parent.eventsData : this.parent.eventsProcessed);
        }
        this.processWorkbook(exportFields, exportName, exportType, eventCollection);
    }
    processWorkbook(fields, name, type, eventCollection) {
        let columns = [];
        let rows = [];
        let columnHeader = [];
        fields.forEach((field, i) => columns.push({ index: i + 1, width: (field === 'Id' ? 20 : 150) }));
        let style = { fontSize: 12, borders: { color: '#E0E0E0' }, bold: true };
        fields.forEach((field, i) => columnHeader.push({ index: i + 1, value: field, style: style }));
        rows.push({ index: 1, cells: columnHeader });
        let i = 2;
        for (let event of eventCollection) {
            let columnData = [];
            fields.forEach((field, n) => {
                let columnRule = { index: n + 1, value: event[field || ''] };
                if (field === this.parent.eventFields.startTime || field === this.parent.eventFields.endTime) {
                    let styleRule = { fontSize: 12, numberFormat: 'm/d/yyyy h:mm AM/PM' };
                    columnRule = extend({}, columnRule, { style: styleRule }, true);
                }
                columnData.push(columnRule);
            });
            rows.push({ index: i, cells: columnData });
            i++;
        }
        let workSheet = [{ columns: columns, rows: rows }];
        let book = new Workbook({ worksheets: workSheet }, type, this.parent.locale);
        book.save(name + '.' + type);
    }
    getModuleName() {
        return 'excelExport';
    }
    destroy() {
        this.parent = null;
    }
}

/**
 * ICalendar Export Module
 */
class ICalendarExport {
    constructor(parent) {
        this.parent = parent;
        this.timezone = new Timezone();
    }
    initializeCalendarExport(fileName) {
        let eventsData = extend([], this.parent.eventsData, null, true);
        eventsData = this.parent.eventBase.sortByTime(eventsData);
        const SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
        let iCalendarEvents = [];
        let filterCollection = [];
        let timeZone = this.parent.timezone || this.timezone.getLocalTimezoneName();
        let fields = this.parent.eventFields;
        eventsData.forEach((eventObj) => {
            let uId = this.parent.eventBase.generateGuid();
            let editedExDate = [];
            if (eventObj[fields.recurrenceID]) {
                let filter = this.filterEvents(filterCollection, fields.id, eventObj[fields.recurrenceID]);
                uId = filter[0].UID;
            }
            if (!eventObj[fields.recurrenceID] && eventObj[fields.recurrenceRule] && eventObj[fields.recurrenceException]) {
                let exceptionDateList;
                let exDate = (eventObj[fields.recurrenceException]).split(',');
                let editedObj = this.filterEvents(eventsData, fields.recurrenceID, eventObj[fields.id]);
                editedObj.forEach((edited) => {
                    editedExDate.push(getRecurrenceStringFromDate(edited[fields.startTime]));
                });
                exceptionDateList = exDate.filter((value) => (editedExDate.indexOf(value) === -1));
                eventObj[fields.recurrenceException] = (exceptionDateList.length > 0) ? (exceptionDateList.join(',') + ',') : '';
            }
            let startZone = (eventObj[fields.startTimezone] || timeZone);
            let endZone = (eventObj[fields.endTimezone] || timeZone);
            let calendarEvent = [
                'BEGIN:VEVENT',
                'LOCATION:' + (eventObj[fields.location] || ''),
                'SUMMARY:' + (eventObj[fields.subject] || ''),
                'UID:' + uId,
                'DESCRIPTION:' + (eventObj[fields.description] || ''),
                'END:VEVENT'
            ];
            if (eventObj[fields.isAllDay]) {
                calendarEvent.splice(4, 0, 'DTEND;VALUE=DATE:' + this.convertDateToString(eventObj[fields.endTime], true));
                calendarEvent.splice(4, 0, 'DTSTART;VALUE=DATE:' + this.convertDateToString(eventObj[fields.startTime], true));
            }
            else if (!eventObj[fields.isAllDay] && !eventObj[fields.recurrenceRule]) {
                calendarEvent.splice(4, 0, 'DTEND:' + this.convertDateToString(eventObj[fields.endTime]));
                calendarEvent.splice(4, 0, 'DTSTART:' + this.convertDateToString(eventObj[fields.startTime]));
            }
            else {
                calendarEvent.splice(4, 0, 'DTEND;TZID="' + endZone + '":' + this.convertDateToString(eventObj[fields.endTime]));
                calendarEvent.splice(4, 0, 'DTSTART;TZID="' + startZone + '":'
                    + this.convertDateToString(eventObj[fields.startTime]));
            }
            if (eventObj[fields.recurrenceRule]) {
                calendarEvent.splice(4, 0, 'RRULE:' + eventObj[fields.recurrenceRule]);
            }
            if (eventObj[fields.recurrenceException]) {
                let exDate = eventObj[fields.recurrenceException].split(',');
                for (let i = 0; i < exDate.length - 1; i++) {
                    calendarEvent.splice(5, 0, 'EXDATE:' +
                        this.convertDateToString(getDateFromRecurrenceDateString(exDate[i]), eventObj[fields.isAllDay]));
                }
            }
            if (eventObj[fields.recurrenceID]) {
                calendarEvent.splice(4, 0, 'RECURRENCE-ID;TZID="' + startZone + '":'
                    + this.convertDateToString(eventObj[fields.startTime], eventObj[fields.isAllDay]));
            }
            let customFields = this.customFieldFilter(eventObj, fields);
            if (customFields.length > 0) {
                customFields.forEach((customField) => calendarEvent.splice(4, 0, customField + ':' + (eventObj[customField] || '')));
            }
            let app = extend({}, eventObj);
            app.UID = uId;
            filterCollection.push(app);
            iCalendarEvents.push(calendarEvent.join(SEPARATOR));
        });
        let iCalendar = [
            'BEGIN:VCALENDAR',
            'PRODID:-//Syncfusion Inc//Scheduler//EN',
            'VERSION:2.0',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:' + (fileName || 'Calendar'),
            'X-WR-TIMEZONE:' + timeZone,
        ].join(SEPARATOR);
        let icsString = iCalendar + SEPARATOR + iCalendarEvents.join(SEPARATOR) + SEPARATOR + 'END:VCALENDAR';
        this.download(icsString, fileName);
    }
    customFieldFilter(eventObj, fields) {
        let defaultFields = Object.keys(fields).map((key) => fields[key]);
        let eventFields = Object.keys(eventObj);
        return eventFields.filter((value) => (defaultFields.indexOf(value) === -1) && (value !== 'Guid'));
    }
    convertDateToString(eventDate, allDay) {
        let year = ('0000' + (eventDate.getFullYear().toString())).slice(-4);
        let month = ('00' + ((eventDate.getMonth() + 1).toString())).slice(-2);
        let date = ('00' + ((eventDate.getDate()).toString())).slice(-2);
        let hours = ('00' + (eventDate.getHours().toString())).slice(-2);
        let minutes = ('00' + (eventDate.getMinutes().toString())).slice(-2);
        let seconds = ('00' + (eventDate.getSeconds().toString())).slice(-2);
        let timeString = (allDay) ? year + month + date : year + month + date + 'T' + hours + minutes + seconds;
        return timeString;
    }
    download(icsString, fileName) {
        let buffer = new Blob([icsString], { type: 'data:text/calendar;charset=utf8' });
        fileName = (fileName || 'Calendar') + '.ics';
        if (!(!navigator.msSaveBlob)) {
            navigator.msSaveBlob(buffer, fileName);
        }
        else {
            let downloadLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            downloadLink.download = fileName;
            downloadLink.href = URL.createObjectURL(buffer);
            let event = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            downloadLink.dispatchEvent(event);
            setTimeout(() => {
                URL.revokeObjectURL(downloadLink.href);
                downloadLink.href = undefined;
            });
        }
    }
    filterEvents(data, field, value) {
        return new DataManager({ json: data }).executeLocal(new Query().where(field, 'equal', value));
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'iCalendarExport';
    }
    /**
     * To destroy the ICalendarExport.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.timezone) {
            this.timezone = null;
        }
    }
}

/**
 * ICalendar Import Module
 */
class ICalendarImport {
    constructor(parent) {
        this.allDay = false;
        this.parent = parent;
    }
    initializeCalendarImport(fileContent) {
        if (fileContent) {
            let fileReader = new FileReader();
            fileReader.onload = (event) => {
                let iCalString = fileReader.result;
                this.iCalendarParser(iCalString);
            };
            fileReader.readAsText(fileContent, 'ISO-8859-8');
        }
    }
    iCalendarParser(iCalString) {
        let fields = this.parent.eventFields;
        let events = [];
        let uId = 'UID';
        let calArray = iCalString.replace(new RegExp('\\r', 'g'), '').split('\n');
        let isEvent = false;
        let curEvent = null;
        let id = this.parent.eventBase.getEventMaxID();
        calArray.forEach((element) => {
            let index;
            let type;
            let value;
            if (!isEvent && element === 'BEGIN:VEVENT') {
                isEvent = true;
                curEvent = {};
            }
            if (isEvent && element === 'END:VEVENT') {
                isEvent = false;
                events.push(curEvent);
                curEvent = null;
            }
            if (isEvent) {
                index = element.indexOf(':');
                type = element.substr(0, index).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                value = element.substr(index + 1, element.length - (index + 1)).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                if (element.indexOf('SUMMARY') !== -1) {
                    type = 'SUMMARY';
                }
                if (element.indexOf('DTSTART') !== -1) {
                    curEvent[fields.startTime] = this.dateParsing(element);
                    curEvent[fields.isAllDay] = this.allDay;
                    this.allDay = false;
                }
                else if (element.indexOf('DTEND') !== -1) {
                    curEvent[fields.endTime] = this.dateParsing(element);
                }
                else if (element.indexOf('EXDATE') !== -1) {
                    value = getRecurrenceStringFromDate(this.dateParsing(element));
                    curEvent[fields.recurrenceException] = (isNullOrUndefined(curEvent[fields.recurrenceException])) ?
                        value : curEvent[fields.recurrenceException] + ',' + value;
                }
                else if (element.indexOf('RECURRENCE-ID') !== -1) {
                    value = getRecurrenceStringFromDate(this.dateParsing(element));
                    curEvent[fields.recurrenceException] = value;
                    curEvent[fields.recurrenceID] = value;
                }
                else {
                    switch (type) {
                        case 'BEGIN':
                            break;
                        case 'UID':
                            curEvent[uId] = value;
                            curEvent[fields.id] = id++;
                            break;
                        case 'SUMMARY':
                            curEvent[fields.subject] = value;
                            break;
                        case 'LOCATION':
                            curEvent[fields.location] = value;
                            break;
                        case 'DESCRIPTION':
                            curEvent[fields.description] = value;
                            break;
                        case 'RRULE':
                            curEvent[fields.recurrenceRule] = value;
                            break;
                        default:
                            curEvent[type] = value;
                    }
                }
            }
        });
        let app = extend([], events, null, true);
        this.parent.addEvent(this.processOccurrence(app));
    }
    processOccurrence(app) {
        let appoint = [];
        let uId = 'UID';
        let fields = this.parent.eventFields;
        app.forEach((eventObj) => {
            let parentObj;
            let id;
            if (!eventObj.hasOwnProperty(fields.recurrenceID)) {
                parentObj = eventObj;
                id = eventObj[fields.id];
            }
            let data = (new DataManager({ json: app }).executeLocal(new Query().where('UID', 'equal', eventObj[uId])));
            if (data.length > 1 && isNullOrUndefined(eventObj[fields.recurrenceID])) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].hasOwnProperty(fields.recurrenceID)) {
                        let exdate = data[i][fields.recurrenceID];
                        data[i][fields.recurrenceID] = id;
                        data[i][fields.recurrenceException] = null;
                        parentObj[fields.recurrenceException] = (isNullOrUndefined(parentObj[fields.recurrenceException])) ?
                            exdate : parentObj[fields.recurrenceException] + ',' + exdate;
                        appoint.push(data[i]);
                    }
                }
                appoint.push(parentObj);
            }
            else if (!eventObj.hasOwnProperty(fields.recurrenceID)) {
                appoint.push(eventObj);
            }
        });
        return appoint;
    }
    getDateString(value) {
        value = value || '';
        return (value
            .replace(/\\\,/g, ',')
            .replace(/\\\;/g, ';')
            .replace(/\\[nN]/g, '\n')
            .replace(/\\\\/g, '\\'));
    }
    dateParsing(element) {
        let expression = /([^':;]+)((?:;(?:[^':;]+)(?:=(?:(?:'[^']*')|(?:[^':;]+))))*):(.*)/;
        let split = (element.match(expression)).slice(1);
        let value = split[split.length - 1];
        let newDate = new Date(this.getDateString(value));
        if (element && element.indexOf('VALUE=DATE') > -1) {
            let data = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
            if (data !== null) {
                newDate = new Date(parseInt(data[1], 10), parseInt(data[2], 10) - 1, parseInt(data[3], 10));
            }
            if (element.indexOf('DTSTART') > -1) {
                this.allDay = true;
            }
        }
        let data = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/.exec(value);
        if (data !== null) {
            if (data[7] === 'Z') {
                newDate = new Date(Date.UTC(parseInt(data[1], 10), parseInt(data[2], 10) - 1, parseInt(data[3], 10), parseInt(data[4], 10), parseInt(data[5], 10), parseInt(data[6], 10)));
            }
            else {
                newDate = new Date(parseInt(data[1], 10), parseInt(data[2], 10) - 1, parseInt(data[3], 10), parseInt(data[4], 10), parseInt(data[5], 10), parseInt(data[6], 10));
            }
        }
        return newDate;
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'iCalendarImport';
    }
    /**
     * To destroy the ICalendarImport.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
    }
}

/**
 * Schedule component exported items
 */

/**
 * Recurrence-Editor component exported items
 */

/**
 * Calendar util exported items
 */

/**
 * Export Schedule components
 */

export { Schedule, cellClick, cellDoubleClick, select, actionBegin, actionComplete, actionFailure, navigating, renderCell, eventClick, eventRendered, dataBinding, dataBound, popupOpen, dragStart, drag, dragStop, resizeStart, resizing, resizeStop, initialLoad, initialEnd, dataReady, contentReady, scroll, virtualScroll, scrollUiUpdate, uiUpdate, documentClick, cellMouseDown, WEEK_LENGTH, MS_PER_DAY, MS_PER_MINUTE, getElementHeightFromClass, getTranslateY, getWeekFirstDate, firstDateOfMonth, lastDateOfMonth, getWeekNumber, setTime, resetTime, getDateInMs, getDateCount, addDays, addMonths, addYears, getStartEndHours, getMaxDays, getDaysCount, getDateFromString, getScrollBarWidth, findIndexInData, getOuterHeight, Resize, DragAndDrop, HeaderRenderer, ViewBase, Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, Timezone, timezoneData, ExcelExport, ICalendarExport, ICalendarImport, RecurrenceEditor, Gregorian, Islamic };
//# sourceMappingURL=ej2-schedule.es2015.js.map
