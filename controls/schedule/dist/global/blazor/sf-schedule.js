window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Schedule = (function () {
'use strict';

/**
 * CSS Constants
 */
var ROOT = 'e-schedule';




var DISABLE_CLASS = 'e-disable';
var TABLE_CONTAINER_CLASS = 'e-table-container';

var ALLDAY_CELLS_CLASS = 'e-all-day-cells';


var ALLDAY_ROW_CLASS = 'e-all-day-row';
var CONTENT_TABLE_CLASS = 'e-content-table';
var WORK_CELLS_CLASS = 'e-work-cells';
var WORK_HOURS_CLASS = 'e-work-hours';
var POPUP_OPEN = 'e-popup-open';

var DATE_HEADER_WRAP_CLASS = 'e-date-header-wrap';
var DATE_HEADER_CONTAINER_CLASS = 'e-date-header-container';
var HEADER_CELLS_CLASS = 'e-header-cells';


var CURRENT_DAY_CLASS = 'e-current-day';
var CURRENTDATE_CLASS = 'e-current-date';








var EVENT_TABLE_CLASS = 'e-event-table';

var RESOURCE_GROUP_CELLS_CLASS = 'e-resource-group-cells';

var RESOURCE_COLUMN_WRAP_CLASS = 'e-resource-column-wrap';
var RESOURCE_COLUMN_TABLE_CLASS = 'e-resource-column-table';





var RESOURCE_CELLS_CLASS = 'e-resource-cells';
var TIME_CELLS_WRAP_CLASS = 'e-time-cells-wrap';



var CURRENT_TIME_CLASS = 'e-current-time';
var CURRENT_TIMELINE_CLASS = 'e-current-timeline';
var PREVIOUS_TIMELINE_CLASS = 'e-previous-timeline';
var HIDE_CHILDS_CLASS = 'e-hide-childs';


var TIMELINE_WRAPPER_CLASS = 'e-timeline-wrapper';
var APPOINTMENT_WRAPPER_CLASS = 'e-appointment-wrapper';
var DAY_WRAPPER_CLASS = 'e-day-wrapper';


var HEADER_TOOLBAR = 'e-schedule-toolbar';
var RESOURCE_HEADER_TOOLBAR = 'e-schedule-resource-toolbar';
var SELECTED_CELL_CLASS = 'e-selected-cell';
var WEEK_NUMBER_WRAPPER_CLASS = 'e-week-number-wrapper';

var APPOINTMENT_WRAP_CLASS = 'e-appointment-wrap';
var WRAPPER_CONTAINER_CLASS = 'e-wrapper-container';
var APPOINTMENT_CONTAINER_CLASS = 'e-appointment-container';
var APPOINTMENT_CLASS = 'e-appointment';
var BLOCK_APPOINTMENT_CLASS = 'e-block-appointment';
var BLOCK_INDICATOR_CLASS = 'e-block-indicator';
var APPOINTMENT_BORDER = 'e-appointment-border';
var APPOINTMENT_DETAILS = 'e-appointment-details';
var SUBJECT_WRAP = 'e-subject-wrap';

var APPOINTMENT_TIME = 'e-time';
var TABLE_WRAP_CLASS = 'e-table-wrap';

var CONTENT_WRAP_CLASS = 'e-content-wrap';
var VIRTUAL_TRACK_CLASS = 'e-virtual-track';
var AGENDA_CELLS_CLASS = 'e-agenda-cells';

var AGENDA_SELECTED_CELL = 'e-active-appointment-agenda';




var NAVIGATE_CLASS = 'e-navigate';
var DATE_HEADER_CLASS = 'e-date-header';













var EVENT_ACTION_CLASS = 'e-event-action';
var NEW_EVENT_CLASS = 'e-new-event';
var CLONE_ELEMENT_CLASS = 'e-schedule-event-clone';
var MONTH_CLONE_ELEMENT_CLASS = 'e-month-event';
var CLONE_TIME_INDICATOR_CLASS = 'e-clone-time-indicator';
var DRAG_CLONE_CLASS = 'e-drag-clone';
var EVENT_RESIZE_CLASS = 'e-event-resize';
var RESIZE_CLONE_CLASS = 'e-resize-clone';
var LEFT_RESIZE_HANDLER = 'e-left-handler';
var RIGHT_RESIZE_HANDLER = 'e-right-handler';
var TOP_RESIZE_HANDLER = 'e-top-handler';
var BOTTOM_RESIZE_HANDLER = 'e-bottom-handler';



var ALLDAY_APPOINTMENT_WRAPPER_CLASS = 'e-all-day-appointment-wrapper';
var ALLDAY_APPOINTMENT_CLASS = 'e-all-day-appointment';
var EVENT_COUNT_CLASS = 'e-appointment-hide';
var ROW_COUNT_WRAPPER_CLASS = 'e-row-count-wrapper';
var ALLDAY_APPOINTMENT_SECTION_CLASS = 'e-all-day-appointment-section';
var APPOINTMENT_ROW_EXPAND_CLASS = 'e-appointment-expand';
var APPOINTMENT_ROW_COLLAPSE_CLASS = 'e-appointment-collapse';
var MORE_INDICATOR_CLASS = 'e-more-indicator';
var CELL_POPUP_CLASS = 'e-cell-popup';


var POPUP_HEADER_CLASS = 'e-popup-header';


var POPUP_FOOTER_CLASS = 'e-popup-footer';


var QUICK_POPUP_EVENT_DETAILS_CLASS = 'e-event-details';
var EVENT_CREATE_CLASS = 'e-event-create';
var EDIT_EVENT_CLASS = 'e-event-edit';
var DELETE_EVENT_CLASS = 'e-event-delete';

var MORE_POPUP_WRAPPER_CLASS = 'e-more-popup-wrapper';
var MORE_EVENT_POPUP_CLASS = 'e-more-event-popup';



var MORE_EVENT_HEADER_DATE_CLASS = 'e-header-date';
var MORE_EVENT_CLOSE_CLASS = 'e-more-event-close';
























var SUBJECT_CLASS = 'e-subject';




















var EDIT_CLASS = 'e-edit';
var EDIT_ICON_CLASS = 'e-edit-icon';
var DELETE_CLASS = 'e-delete';

var CLOSE_CLASS = 'e-close';






var HIDDEN_CLASS = 'e-hidden';
var DISABLE_DATES = 'e-disable-dates';
var POPUP_WRAPPER_CLASS = 'e-quick-popup-wrapper';
















var READ_ONLY = 'e-read-only';
var MONTH_HEADER_WRAPPER = 'e-month-header-wrapper';
var INLINE_SUBJECT_CLASS = 'e-inline-subject';
var INLINE_APPOINTMENT_CLASS = 'e-inline-appointment';

/**
 * Schedule common utilities
 */
var WEEK_LENGTH = 7;
var MS_PER_DAY = 86400000;
var MS_PER_MINUTE = 60000;
function getElementHeightFromClass(container, elementClass) {
    var height = 0;
    var el = sf.base.createElement('div', { className: elementClass }).cloneNode();
    el.style.visibility = 'hidden';
    el.style.position = 'absolute';
    container.appendChild(el);
    height = el.getBoundingClientRect().height;
    sf.base.remove(el);
    return height;
}
function getTranslateY(element) {
    var style = getComputedStyle(element);
    return window.WebKitCSSMatrix ?
        new WebKitCSSMatrix(style.webkitTransform).m42 : 0;
}
function getWeekFirstDate(date1, firstDayOfWeek) {
    var date = new Date(date1.getTime());
    firstDayOfWeek = (firstDayOfWeek - date.getDay() + 7 * (-1)) % 7;
    return new Date(date.setDate(date.getDate() + firstDayOfWeek));
}

function firstDateOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth());
}
function lastDateOfMonth(dt) {
    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
}


function resetTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function getDateInMs(date) {
    var sysDateOffset = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTimezoneOffset();
    var dateOffset = date.getTimezoneOffset();
    var tzOffsetDiff = dateOffset - sysDateOffset;
    return ((date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime())
        - (tzOffsetDiff * 60 * 1000));
}

function addDays(date, i) {
    date = new Date('' + date);
    return new Date(date.setDate(date.getDate() + i));
}
function addMonths(date, i) {
    date = new Date('' + date);
    var day = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + i);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}

function getStartEndHours(date, startHour, endHour) {
    var date1 = new Date(date.getTime());
    date1.setHours(startHour.getHours());
    date1.setMinutes(startHour.getMinutes());
    date1.setSeconds(startHour.getSeconds());
    var date2 = new Date(date.getTime());
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
    var date = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return date.getDate();
}


var scrollWidth = null;
function getScrollBarWidth() {
    if (scrollWidth !== null) {
        return scrollWidth;
    }
    var divNode = sf.base.createElement('div');
    var value = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    var ratio = (devicePixelRatio) ? (devicePixelRatio.toFixed(2) === '1.10' || devicePixelRatio <= 1) ?
        Math.ceil(devicePixelRatio % 1) : Math.floor(devicePixelRatio % 1) : 0;
    value = (divNode.offsetWidth - divNode.clientWidth - ratio) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}
function getOuterHeight(element) {
    var style = getComputedStyle(element);
    return element.offsetHeight + (parseInt(style.marginTop, 10) || 0) + (parseInt(style.marginBottom, 10) || 0);
}
function addLocalOffset(date) {
    return new Date(+date - (date.getTimezoneOffset() * 60000));
}
function removeLocalOffset(date) {
    var localDate = new Date(+date + (date.getTimezoneOffset() * 60000));
    return new Date(localDate.getTime() + (localDate.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
}

/**
 * view base
 */
var ViewBase = /** @class */ (function () {
    function ViewBase(parent) {
        this.parent = parent;
    }
    ViewBase.prototype.onDataReady = function (args) {
        // Need for events positioning
    };
    ViewBase.prototype.getScrollXIndent = function (content) {
        return content.offsetHeight - content.clientHeight > 0 ? getScrollBarWidth() : 0;
    };
    ViewBase.prototype.scrollTopPanel = function (target) {
        this.getDatesHeaderElement().firstElementChild.scrollLeft = target.scrollLeft;
    };
    ViewBase.prototype.scrollHeaderLabels = function (target) {
        var headerTable = this.element.querySelector('.e-date-header-wrap table');
        var colWidth = headerTable.offsetWidth / headerTable.querySelectorAll('colgroup col').length;
        var applyLeft = function (headerCells, isRtl) {
            var currentCell;
            var tdLeft = 0;
            var colSpan = 0;
            var hiddenLeft = isRtl ? target.scrollWidth - target.offsetWidth - target.scrollLeft : target.scrollLeft;
            for (var _i = 0, headerCells_2 = headerCells; _i < headerCells_2.length; _i++) {
                var cell = headerCells_2[_i];
                colSpan += parseInt(cell.getAttribute('colSpan'), 10);
                if (colSpan > Math.floor(hiddenLeft / colWidth)) {
                    currentCell = cell;
                    break;
                }
                tdLeft += cell.offsetWidth;
            }
            if (!sf.base.isNullOrUndefined(currentCell)) {
                currentCell.children[0].style[isRtl ? 'right' : 'left'] = (hiddenLeft - tdLeft) + 'px';
            }
        };
        var classNames = ['.e-header-year-cell', '.e-header-month-cell', '.e-header-week-cell', '.e-header-cells'];
        for (var _i = 0, classNames_1 = classNames; _i < classNames_1.length; _i++) {
            var className = classNames_1[_i];
            var headerCells = [].slice.call(this.element.querySelectorAll(className));
            if (headerCells.length > 0) {
                for (var _a = 0, headerCells_1 = headerCells; _a < headerCells_1.length; _a++) {
                    var element = headerCells_1[_a];
                    element.children[0].style[this.parent.options.enableRtl ? 'right' : 'left'] = '';
                }
                applyLeft(headerCells, this.parent.options.enableRtl);
            }
        }
    };
    ViewBase.prototype.getHeaderBarHeight = function (includeResHeight) {
        if (includeResHeight === void 0) { includeResHeight = false; }
        var headerBarHeight = 2;
        var headerBar = this.parent.element.querySelector('.' + HEADER_TOOLBAR);
        if (headerBar) {
            headerBarHeight += getOuterHeight(headerBar);
        }
        if (this.parent.uiStateValues.isGroupAdaptive || includeResHeight) {
            var resHeader = this.parent.element.querySelector('.' + RESOURCE_HEADER_TOOLBAR);
            if (resHeader) {
                headerBarHeight += resHeader.offsetHeight;
            }
        }
        return headerBarHeight;
    };
    ViewBase.prototype.getDatesHeaderElement = function () {
        return this.element.querySelector('.' + DATE_HEADER_CONTAINER_CLASS);
    };
    ViewBase.prototype.highlightCurrentTime = function () {
        // Here showTimeIndicator functionalities
    };
    ViewBase.prototype.getStartHour = function () {
        var startHour = this.parent.getStartEndTime(this.parent.activeViewOptions.startHour);
        if (sf.base.isNullOrUndefined(startHour)) {
            startHour = new Date(2000, 0, 0, 0);
        }
        return startHour;
    };
    ViewBase.prototype.getEndHour = function () {
        var endHour = this.parent.getStartEndTime(this.parent.activeViewOptions.endHour);
        if (sf.base.isNullOrUndefined(endHour)) {
            endHour = new Date(2000, 0, 0, 0);
        }
        return endHour;
    };
    ViewBase.prototype.isCurrentDate = function (date) {
        return date.setHours(0, 0, 0, 0) === this.parent.getCurrentTime().setHours(0, 0, 0, 0);
    };
    ViewBase.prototype.isCurrentMonth = function (date) {
        return date.getFullYear() ===
            this.parent.getCurrentTime().getFullYear() && date.getMonth() === this.parent.getCurrentTime().getMonth();
    };
    ViewBase.prototype.isWorkDay = function (date, workDays) {
        if (workDays === void 0) { workDays = this.parent.activeViewOptions.workDays; }
        if (workDays.indexOf(date.getDay()) >= 0) {
            return true;
        }
        return false;
    };
    ViewBase.prototype.isWorkHour = function (date, startHour, endHour, workDays) {
        if (sf.base.isNullOrUndefined(startHour) || sf.base.isNullOrUndefined(endHour)) {
            return false;
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        return !(getDateInMs(date) < getDateInMs(startHour) || getDateInMs(date) >= getDateInMs(endHour) ||
            !this.isWorkDay(date, workDays));
    };
    ViewBase.prototype.getRenderDates = function (workDays) {
        var renderDates = [];
        // Due to same code for vertical and time line, week & work week views, if condition has used
        if (this.parent.options.currentView === 'Week' || this.parent.options.currentView === 'TimelineWeek') {
            var selectedDate = resetTime(this.parent.options.selectedDate);
            var start = getWeekFirstDate(selectedDate, this.parent.activeViewOptions.firstDayOfWeek);
            for (var i = 0, length_1 = WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length_1; i++) {
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
        else if (this.parent.options.currentView === 'WorkWeek' || this.parent.options.currentView === 'TimelineWorkWeek') {
            var date = resetTime(this.parent.options.selectedDate);
            var start = getWeekFirstDate(date, this.parent.activeViewOptions.firstDayOfWeek);
            for (var i = 0, length_2 = WEEK_LENGTH * this.parent.activeViewOptions.interval; i < length_2; i++) {
                if (this.isWorkDay(start, workDays)) {
                    renderDates.push(start);
                }
                start = addDays(start, 1);
            }
        }
        else {
            var start = resetTime(this.parent.options.selectedDate);
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
            } while (this.parent.activeViewOptions.interval !== renderDates.length);
        }
        if (!workDays) {
            this.renderDates = renderDates;
        }
        return renderDates;
    };
    ViewBase.prototype.getColElements = function () {
        return [].slice.call(this.element.querySelectorAll('.' + CONTENT_WRAP_CLASS + ' col, .' + DATE_HEADER_WRAP_CLASS + ' col'));
    };
    ViewBase.prototype.setColWidth = function (content) {
        if (this.parent.isTimelineView()) {
            var colElements = this.getColElements();
            var contentBody = this.element.querySelector('.' + CONTENT_TABLE_CLASS + ' tbody');
            var colWidth_1 = Math.ceil(contentBody.offsetWidth / (colElements.length / 2));
            colElements.forEach(function (col) { return sf.base.setStyleAttribute(col, { 'width': sf.base.formatUnit(colWidth_1) }); });
            if (content.offsetHeight !== content.clientHeight) {
                var leftPanelSelector = "." + MONTH_HEADER_WRAPPER + ",." + RESOURCE_COLUMN_WRAP_CLASS;
                var leftPanel = this.parent.element.querySelector(leftPanelSelector);
                if (!sf.base.isNullOrUndefined(leftPanel)) {
                    sf.base.setStyleAttribute(leftPanel, { 'height': sf.base.formatUnit(content.clientHeight) });
                }
            }
        }
    };
    ViewBase.prototype.resetColWidth = function () {
        var colElements = this.getColElements();
        for (var _i = 0, colElements_1 = colElements; _i < colElements_1.length; _i++) {
            var col = colElements_1[_i];
            col.style.width = '';
        }
    };
    ViewBase.prototype.getContentAreaElement = function () {
        return this.element.querySelector('.' + CONTENT_WRAP_CLASS);
    };
    ViewBase.prototype.scrollToDate = function (scrollDate) {
        if (['Month', 'TimelineMonth'].indexOf(this.parent.options.currentView) === -1 || sf.base.isNullOrUndefined(scrollDate)) {
            return;
        }
        var scrollWrap = this.getContentAreaElement();
        var tdDate = this.parent.getMsFromDate(new Date(resetTime(new Date(+scrollDate)).getTime()));
        var dateElement = scrollWrap.querySelector("." + WORK_CELLS_CLASS + "[data-date=\"" + tdDate + "\"]");
        if (this.parent.options.currentView === 'Month' && dateElement) {
            scrollWrap.scrollTop = dateElement.offsetTop;
        }
        if (this.parent.options.currentView === 'TimelineMonth' && dateElement) {
            scrollWrap.scrollLeft = dateElement.offsetLeft;
        }
    };
    ViewBase.prototype.getPanel = function () {
        return this.element;
    };
    return ViewBase;
}());

/**
 * Vertical view appointment rendering
 */
var ADD_BORDER_LENGTH$1 = 4;
var DEFAULT_ALL_DAY_ROW_LENGTH$1 = 4;
var VerticalEvent = /** @class */ (function () {
    function VerticalEvent(parent) {
        this.allDayLevel = 0;
        this.parent = parent;
        this.slotCount = parent.activeViewOptions.timeScale.slotCount;
        this.interval = parent.activeViewOptions.timeScale.interval;
        this.element = this.parent.activeView.getPanel();
    }
    VerticalEvent.prototype.renderAppointments = function () {
        var expandCollapse = this.element.querySelector('.' + ALLDAY_APPOINTMENT_SECTION_CLASS);
        if (expandCollapse) {
            sf.base.EventHandler.remove(expandCollapse, 'click', this.rowExpandCollapse);
            sf.base.EventHandler.add(expandCollapse, 'click', this.rowExpandCollapse, this);
        }
        var workcell = this.parent.element.querySelector('.' + WORK_CELLS_CLASS);
        if (!workcell) {
            return;
        }
        var contentWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var normalElementList = [].slice.call(contentWrap.querySelectorAll('.' + APPOINTMENT_CLASS));
        var blockElementList = [].slice.call(contentWrap.querySelectorAll('.' + BLOCK_APPOINTMENT_CLASS));
        var elementList = normalElementList.concat(blockElementList);
        var cellHeight = parseFloat(this.element.querySelector('.e-content-wrap tbody tr').getBoundingClientRect().height.toFixed(2));
        var cellWidth = workcell.getBoundingClientRect().width;
        for (var i = 0; i < elementList.length; i++) {
            var ele = elementList[i];
            var columnCount = this.getColumn(ele);
            var widthSize = this.getAppWidth(this.getColumnCounts(ele));
            ele.style.top =
                ((this.getTopStartDuration(ele) / (this.parent.activeViewOptions.timeScale.interval /
                    this.parent.activeViewOptions.timeScale.slotCount * 60000)) * cellHeight) + 'px';
            ele.style.left = this.getEventLeft(widthSize, columnCount);
            ele.style.width = ele.classList.contains(BLOCK_APPOINTMENT_CLASS) ? '100%' : widthSize;
            ele.style.height = ((((this.getTopStartDuration(ele) + this.getDuration(ele)) /
                (this.parent.activeViewOptions.timeScale.interval /
                    this.parent.activeViewOptions.timeScale.slotCount * 60000)) * cellHeight) -
                ((this.getTopStartDuration(ele) / (this.parent.activeViewOptions.timeScale.interval /
                    this.parent.activeViewOptions.timeScale.slotCount * 60000)) * cellHeight)) + 'px';
            this.parent.eventBase.wireAppointmentEvents(ele);
        }
        var allDayRowTop = this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS).offsetTop;
        var allDaylementList = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_APPOINTMENT_CLASS));
        var appHeight = allDaylementList.length > 0 ? allDaylementList[0].offsetHeight : 0;
        var allDayWrapper = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS));
        this.setAllDayRowHeight(0);
        for (var j = 0; j < allDayWrapper.length; j++) {
            var eleList = allDayWrapper[j].children;
            for (var i = 0; i < eleList.length; i++) {
                var ele = eleList[i];
                var allDayRowHeight = 0;
                if (!ele.classList.contains(ROW_COUNT_WRAPPER_CLASS)) {
                    var rowCount = this.getRowCount(ele);
                    var totalLength = this.getTotalLength(ele);
                    this.allDayLevel = (this.allDayLevel < rowCount) ? rowCount : this.allDayLevel;
                    ele.style.top = allDayRowTop + (rowCount * appHeight) + 'px';
                    ele.style.width = (cellWidth * totalLength) - 15 + 'px';
                    allDayRowHeight = ((!this.parent.uiStateValues.expand && this.allDayLevel > 3) ?
                        (DEFAULT_ALL_DAY_ROW_LENGTH$1 * appHeight) : ((this.allDayLevel + 1) * appHeight)) + ADD_BORDER_LENGTH$1;
                    this.parent.eventBase.wireAppointmentEvents(ele);
                }
                else {
                    ele.style.top = allDayRowTop + (DEFAULT_ALL_DAY_ROW_LENGTH$1 * appHeight) + 'px';
                    allDayRowHeight = (DEFAULT_ALL_DAY_ROW_LENGTH$1 * appHeight) + ADD_BORDER_LENGTH$1;
                }
                this.setAllDayRowHeight(allDayRowHeight);
            }
        }
        var moreIndicatorElement = [].slice.call(this.element.querySelectorAll('.' + MORE_INDICATOR_CLASS));
        for (var i = 0; i < moreIndicatorElement.length; i++) {
            sf.base.EventHandler.clearEvents(moreIndicatorElement[i]);
            sf.base.EventHandler.add(moreIndicatorElement[i], 'click', this.rowExpandCollapse, this);
        }
        this.parent.setDimensions();
    };
    VerticalEvent.prototype.getAppWidth = function (overlapEvents) {
        var width = this.parent.options.currentView === 'Day' ? 97 : 94;
        var tempWidth = ((width - overlapEvents) / overlapEvents);
        return (tempWidth < 0 ? 0 : tempWidth) + '%';
    };
    VerticalEvent.prototype.getEventLeft = function (appWidth, index) {
        var tempLeft = (parseFloat(appWidth) + 1) * index;
        return (tempLeft > 99 ? 99 : tempLeft) + '%';
    };
    VerticalEvent.prototype.setAllDayRowHeight = function (height) {
        var allDayElement = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_CELLS_CLASS));
        for (var i = 0; i < allDayElement.length; i++) {
            allDayElement[i].style.height = (height / 12) + 'em';
        }
    };
    VerticalEvent.prototype.getRowCount = function (ele) {
        return parseInt(ele.getAttribute('data-row-index'), 10);
    };
    VerticalEvent.prototype.getTotalLength = function (ele) {
        return parseInt(ele.getAttribute('data-total-length'), 10);
    };
    VerticalEvent.prototype.getDuration = function (ele) {
        return parseInt(ele.getAttribute('data-duration'), 10);
    };
    VerticalEvent.prototype.getTopStartDuration = function (ele) {
        return parseInt(ele.getAttribute('data-top-start-duration'), 10);
    };
    VerticalEvent.prototype.getColumnCounts = function (ele) {
        return parseInt(ele.getAttribute('data-columns-count'), 10);
    };
    VerticalEvent.prototype.getColumn = function (ele) {
        return parseInt(ele.getAttribute('data-columns'), 10);
    };
    VerticalEvent.prototype.rowExpandCollapse = function () {
        var target = this.element.querySelector('.' + ALLDAY_APPOINTMENT_SECTION_CLASS);
        this.parent.uiStateValues.expand = target.classList.contains(APPOINTMENT_ROW_EXPAND_CLASS);
        var allDaylementList = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_APPOINTMENT_CLASS));
        var appHeight = allDaylementList.length > 0 ? allDaylementList[0].offsetHeight : 0;
        var rowHeight;
        if (this.parent.uiStateValues.expand) {
            target.setAttribute('title', 'Collapse-all-day-section');
            target.setAttribute('aria-label', 'Collapse section');
            rowHeight = ((this.allDayLevel + 1) * appHeight) + ADD_BORDER_LENGTH$1;
        }
        else {
            target.setAttribute('title', 'Expand-all-day-section');
            target.setAttribute('aria-label', 'Expand section');
            rowHeight = (DEFAULT_ALL_DAY_ROW_LENGTH$1 * appHeight) + ADD_BORDER_LENGTH$1;
        }
        this.setAllDayRowHeight(rowHeight);
        this.addOrRemoveClass();
        this.parent.setDimensions();
    };
    VerticalEvent.prototype.addOrRemoveClass = function () {
        var _this = this;
        var moreEvents = [].slice.call(this.parent.element.querySelectorAll('.e-more-event'));
        moreEvents.filter(function (element) {
            if (!_this.parent.uiStateValues.expand && _this.allDayLevel > 2) {
                sf.base.addClass([element], EVENT_COUNT_CLASS);
                element.setAttribute('tabindex', '-1');
            }
            else {
                sf.base.removeClass([element], EVENT_COUNT_CLASS);
                element.setAttribute('tabindex', '0');
            }
        });
        var moreEventCount = this.element.querySelector('.' + ALLDAY_APPOINTMENT_SECTION_CLASS);
        if (this.parent.uiStateValues.expand) {
            sf.base.removeClass([moreEventCount], APPOINTMENT_ROW_EXPAND_CLASS);
            sf.base.addClass([moreEventCount], APPOINTMENT_ROW_COLLAPSE_CLASS);
        }
        else {
            sf.base.removeClass([moreEventCount], APPOINTMENT_ROW_COLLAPSE_CLASS);
            sf.base.addClass([moreEventCount], APPOINTMENT_ROW_EXPAND_CLASS);
        }
        (this.allDayLevel > 2) ? sf.base.removeClass([moreEventCount], DISABLE_CLASS) : sf.base.addClass([moreEventCount], DISABLE_CLASS);
        var countCell = [].slice.call(this.element.querySelectorAll('.' + ROW_COUNT_WRAPPER_CLASS));
        countCell.filter(function (element) {
            (!_this.parent.uiStateValues.expand && _this.allDayLevel > 2) ? sf.base.removeClass([element], DISABLE_CLASS) :
                sf.base.addClass([element], DISABLE_CLASS);
        });
    };
    VerticalEvent.prototype.initializeValues = function () {
        this.cellHeight =
            parseFloat(this.parent.element.querySelector('.e-content-wrap tbody tr').getBoundingClientRect().height.toFixed(2));
    };
    VerticalEvent.prototype.getHeight = function (start, end) {
        var appHeight = (end.getTime() - start.getTime()) / (60 * 1000) * (this.cellHeight * this.slotCount) / this.interval;
        appHeight = (appHeight <= 0) ? this.cellHeight : appHeight;
        return appHeight;
    };
    VerticalEvent.prototype.renderNormalEvents = function (eventObj, dayIndex, resource, dayCount) {
        var record = eventObj;
        var eStart = record.startTime;
        var eEnd = record.endTime;
        var topValue = 0;
        var appHeight = this.getHeight(eStart, eEnd);
        topValue = this.getTopValue(eStart, dayIndex);
        var appointmentElement;
        appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
        sf.base.setStyleAttribute(appointmentElement, {
            'width': (this.getEventWidth()),
            'height': appHeight + 'px', 'top': topValue + 'px'
        });
        var index = this.parent.activeViewOptions.group.byDate ? (dayIndex) + resource : dayCount;
        var appointmentWrap = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_WRAPPER_CLASS));
        appointmentWrap[index].appendChild(appointmentElement);
    };
    VerticalEvent.prototype.getEventWidth = function () {
        var width = this.parent.options.currentView === 'Day' ? 97 : 94;
        return (width < 0 ? 0 : width) + '%';
    };
    VerticalEvent.prototype.getTopValue = function (date, day) {
        var currentDate = resetTime(this.parent.activeView.renderDates[day]);
        var tDay = new Date();
        tDay.setHours(0, 0, 0, 0);
        var startEndHours = this.parent.eventBase.getStEdHours(currentDate, tDay, addDays(new Date(tDay.getTime()), 1));
        var startHour = startEndHours.startHour;
        var diffInMinutes = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        return (diffInMinutes * this.cellHeight * this.slotCount) / this.interval;
    };
    VerticalEvent.prototype.renderAllDayEvents = function (eventObj, dayIndex, resource, dayCount) {
        var record = eventObj;
        var allDayRowCell = this.parent.element.querySelector('.' + ALLDAY_CELLS_CLASS + ':first-child');
        var cellTop = allDayRowCell.offsetTop;
        var appWidth = 0;
        var topValue = 1;
        var allDayIndex = 0;
        record.Index = allDayIndex;
        this.allDayLevel = (this.allDayLevel < allDayIndex) ? allDayIndex : this.allDayLevel;
        var widthAdjustment = this.parent.options.currentView === 'Day' ? 4 : 7;
        appWidth = 100 - widthAdjustment;
        var wIndex = this.parent.activeViewOptions.group.byDate ? (dayIndex) + resource : dayCount;
        var eventWrapper = this.parent.element.querySelector('.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS +
            ':nth-child(' + (wIndex + 1) + ')');
        var appointmentElement;
        appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
        eventWrapper.appendChild(appointmentElement);
        topValue += cellTop + 1;
        sf.base.setStyleAttribute(appointmentElement, { 'width': appWidth + '%', 'top': sf.base.formatUnit(topValue) });
        sf.base.addClass([appointmentElement], ALLDAY_APPOINTMENT_CLASS);
    };
    return VerticalEvent;
}());

/**
 * EventBase for appointment rendering
 */
var EventBase = /** @class */ (function () {
    function EventBase(parent) {
        this.slots = [];
        this.isDoubleTapped = false;
        this.parent = parent;
    }
    EventBase.prototype.getSelectedEventElements = function (target) {
        this.removeSelectedAppointmentClass();
        if (this.parent.selectedElements.length <= 0) {
            this.parent.selectedElements.push(target);
        }
        else {
            var isAlreadySelected = this.parent.selectedElements.filter(function (element) {
                return element.getAttribute('data-guid') === target.getAttribute('data-guid');
            });
            if (isAlreadySelected.length <= 0) {
                var elementSelector = 'div[data-guid="' + target.getAttribute('data-guid') + '"]';
                var focusElements = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
                for (var _i = 0, focusElements_1 = focusElements; _i < focusElements_1.length; _i++) {
                    var element = focusElements_1[_i];
                    this.parent.selectedElements.push(element);
                }
            }
            else {
                var selectedElements = this.parent.selectedElements.filter(function (element) {
                    return element.getAttribute('data-guid') !== target.getAttribute('data-guid');
                });
                this.parent.selectedElements = selectedElements;
            }
        }
        if (target && this.parent.selectedElements.length > 0) {
            this.addSelectedAppointments(this.parent.selectedElements);
        }
        return this.parent.selectedElements;
    };
    EventBase.prototype.getSelectedEvents = function () {
        var eventSelect = [];
        var elementSelect = [];
        var selectAppointments = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_BORDER));
        selectAppointments.filter(function (element) {
            var isAlreadyAdded = eventSelect.filter(function (guid) {
                return guid === element.getAttribute('data-guid');
            });
            if (isAlreadyAdded.length === 0) {
                eventSelect.push(element.getAttribute('data-guid'));
            }
            elementSelect.push(element);
        });
        return {
            //event: eventSelect.length > 1 ? eventSelect : eventSelect[0],
            element: elementSelect.length > 1 ? elementSelect : elementSelect[0],
            guid: eventSelect
        };
    };
    EventBase.prototype.removeSelectedAppointmentClass = function () {
        var selectedAppointments = this.getSelectedAppointments();
        for (var _i = 0, selectedAppointments_1 = selectedAppointments; _i < selectedAppointments_1.length; _i++) {
            var appointment = selectedAppointments_1[_i];
            appointment.setAttribute('aria-selected', 'false');
        }
        sf.base.removeClass(selectedAppointments, APPOINTMENT_BORDER);
        if (this.parent.options.currentView === 'Agenda' || this.parent.options.currentView === 'MonthAgenda') {
            sf.base.removeClass(selectedAppointments, AGENDA_SELECTED_CELL);
        }
    };
    EventBase.prototype.addSelectedAppointments = function (cells) {
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            cell.setAttribute('aria-selected', 'true');
        }
        if (this.parent.options.currentView !== 'MonthAgenda') {
            this.parent.removeSelectedClass();
        }
        sf.base.addClass(cells, APPOINTMENT_BORDER);
    };
    EventBase.prototype.getSelectedAppointments = function () {
        return [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_BORDER + ',.' + APPOINTMENT_CLASS + ':focus'));
    };
    EventBase.prototype.focusElement = function () {
        var scheduleEditorDialog = document.querySelector('#' + this.parent.element.id + '_dialog_wrapper');
        if (scheduleEditorDialog && scheduleEditorDialog.classList.contains('e-popup-open')) {
            return;
        }
        var selectedCell = this.parent.getSelectedElements();
        if (selectedCell.length > 0) {
            if (this.parent.keyboardInteractionModule) {
                var target = ((!sf.base.isNullOrUndefined(this.parent.activeCellsData) &&
                    this.parent.activeCellsData.element) || selectedCell[selectedCell.length - 1]);
                this.parent.keyboardInteractionModule.selectCells(target instanceof Array, target);
            }
            return;
        }
        var selectedAppointments = this.getSelectedAppointments();
        if (selectedAppointments.length > 0) {
            selectedAppointments[selectedAppointments.length - 1].focus();
            return;
        }
    };
    EventBase.prototype.splitEvent = function (event, dateRender) {
        var start = resetTime(new Date(event.startTime + '')).getTime();
        var end = resetTime(new Date(event.endTime + '')).getTime();
        if (getDateInMs(event.endTime) <= 0) {
            var temp = addDays(resetTime(new Date(event.endTime + '')), -1).getTime();
            end = start > temp ? start : temp;
        }
        var orgStart = start;
        var orgEnd = end;
        var ranges = [];
        if (start !== end) {
            if (start < dateRender[0].getTime()) {
                start = dateRender[0].getTime();
            }
            if (end > dateRender[dateRender.length - 1].getTime()) {
                end = dateRender[dateRender.length - 1].getTime();
            }
            var cStart = start;
            for (var level = 0; level < this.slots.length; level++) {
                var slot = this.slots[level];
                if (this.parent.options.currentView === 'WorkWeek' || this.parent.options.currentView === 'TimelineWorkWeek'
                    || this.parent.activeViewOptions.group.byDate || this.parent.activeViewOptions.showWeekend) {
                    var slotDates = [];
                    for (var _i = 0, slot_1 = slot; _i < slot_1.length; _i++) {
                        var s = slot_1[_i];
                        slotDates.push(new Date(s));
                    }
                    var renderedDates = this.getRenderedDates(slotDates);
                    if (!sf.base.isNullOrUndefined(renderedDates) && renderedDates.length > 0) {
                        slot = [];
                        for (var _a = 0, renderedDates_1 = renderedDates; _a < renderedDates_1.length; _a++) {
                            var date = renderedDates_1[_a];
                            slot.push(date.getTime());
                        }
                    }
                }
                var firstSlot = slot[0];
                cStart = (cStart <= firstSlot && end >= firstSlot) ? firstSlot : cStart;
                if (cStart > end || firstSlot > end) {
                    break;
                }
                if (!this.parent.activeViewOptions.group.byDate && this.parent.activeViewOptions.showWeekend &&
                    this.parent.options.currentView !== 'WorkWeek' && this.parent.options.currentView !== 'TimelineWorkWeek') {
                    var startIndex = slot.indexOf(cStart);
                    if (startIndex !== -1) {
                        var endIndex = slot.indexOf(end);
                        var hasBreak = endIndex !== -1;
                        endIndex = hasBreak ? endIndex : slot.length - 1;
                        var count = ((endIndex - startIndex) + 1);
                        var isLeft = (slot[startIndex] !== orgStart);
                        var isRight = (slot[endIndex] !== orgEnd);
                        ranges.push(this.cloneEventObject(event, slot[startIndex], slot[endIndex], count, isLeft, isRight));
                        if (hasBreak) {
                            break;
                        }
                    }
                }
                else {
                    if (this.dateInRange(cStart, slot[0], slot[slot.length - 1])) {
                        var availSlot = [];
                        for (var i = 0; i < slot.length; i++) {
                            if (this.dateInRange(slot[i], orgStart, orgEnd)) {
                                availSlot.push(slot[i]);
                            }
                        }
                        if (availSlot.length > 0) {
                            if (!this.parent.activeViewOptions.group.byDate) {
                                var isLeft = (availSlot[0] !== orgStart);
                                var isRight = (availSlot[availSlot.length - 1] !== orgEnd);
                                ranges.push(this.cloneEventObject(event, availSlot[0], availSlot[availSlot.length - 1], availSlot.length, isLeft, isRight));
                            }
                            else {
                                for (var _b = 0, availSlot_1 = availSlot; _b < availSlot_1.length; _b++) {
                                    var slot_2 = availSlot_1[_b];
                                    ranges.push(this.cloneEventObject(event, slot_2, slot_2, 1, (slot_2 !== orgStart), (slot_2 !== orgEnd)));
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
    };
    EventBase.prototype.dateInRange = function (date, start, end) {
        return start <= date && date <= end;
    };
    EventBase.prototype.cloneEventObject = function (event, start, end, count, isLeft, isRight) {
        var e = sf.base.extend({}, event, null, true);
        var data = { count: count, isLeft: isLeft, isRight: isRight };
        data.startTime = event.startTime;
        data.endTime = event.endTime;
        e.data = data;
        e.startTime = new Date(start);
        e.endTime = new Date(end);
        return e;
    };
    EventBase.prototype.getRenderedDates = function (dateRender) {
        var firstDate = 0;
        var lastDate = dateRender.length;
        var filteredDates;
        if ((dateRender[0] < this.parent.options.minDate) && dateRender[dateRender.length - 1] > this.parent.options.maxDate) {
            for (var i = 0; i < dateRender.length; i++) {
                if (dateRender[i].getTime() === this.parent.options.minDate.getTime()) {
                    firstDate = i;
                }
                if (dateRender[i].getTime() === this.parent.options.maxDate.getTime()) {
                    lastDate = i;
                }
            }
            filteredDates = dateRender.filter(function (date) {
                return ((date >= dateRender[firstDate]) && (date <= dateRender[lastDate]));
            });
        }
        return filteredDates;
    };
    EventBase.prototype.isValidEvent = function (eventObj, start, end, schedule) {
        var isHourRange = end.getTime() > schedule.startHour.getTime() && start.getTime() < schedule.endHour.getTime();
        var isSameRange = schedule.startHour.getTime() <= start.getTime() &&
            eventObj.startTime.getTime() >= schedule.startHour.getTime() &&
            eventObj.endTime.getTime() < schedule.endHour.getTime() && start.getTime() === end.getTime();
        return isHourRange || isSameRange;
    };
    EventBase.prototype.getStEdHours = function (date, startHour, endHour) {
        var date1 = new Date(date.getTime());
        date1.setHours(startHour.getHours());
        date1.setMinutes(startHour.getMinutes());
        date1.setSeconds(startHour.getSeconds());
        var date2 = new Date(date.getTime());
        if (endHour.getHours() === 0) {
            date2.setDate(date2.getDate() + 1);
        }
        else {
            date2.setHours(endHour.getHours());
            date2.setMinutes(endHour.getMinutes());
            date2.setSeconds(endHour.getSeconds());
        }
        return { startHour: date1, endHour: date2 };
    };
    // public selectWorkCellByTime(eventsData: Object[]): Element {
    //     let target: Element;
    //     if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
    //         return target;
    //     }
    //     if (eventsData.length > 0) {
    //         let selectedObject: { [key: string]: object } = eventsData[eventsData.length - 1] as { [key: string]: object };
    //         let eventStartTime: Date = <Date>selectedObject[this.parent.eventFields.startTime];
    //         let nearestTime: number = new Date(+eventStartTime).setMinutes(0, 0, 0);
    //         let isAllDay: boolean = this.isAllDayAppointment(selectedObject);
    //         if (this.parent.currentView === 'Month' || isAllDay) {
    //             nearestTime = new Date(+eventStartTime).setHours(0, 0, 0, 0);
    //         }
    //         let targetArea: Element;
    //         if (isAllDay && ['Day', 'Week', 'WorkWeek'].indexOf(this.parent.currentView) !== -1) {
    //             targetArea = this.parent.getAllDayRow();
    //         } else {
    //             targetArea = this.parent.getContentTable();
    //         }
    //         let queryString: string = '[data-date="' + this.parent.getMsFromDate(new Date(nearestTime)) + '"]';
    //         if (this.parent.activeViewOptions.group.resources.length > 0) {
    //             queryString += '[data-group-index="' + this.getGroupIndexFromEvent(selectedObject) + '"]';
    //         }
    //         target = targetArea.querySelector(queryString) as Element;
    //         if (target) {
    //             this.parent.activeCellsData = this.parent.getCellDetails(target);
    //             if (this.parent.keyboardInteractionModule) {
    //                 this.parent.keyboardInteractionModule.selectCells(false, target as HTMLTableCellElement);
    //             }
    //             return target;
    //         }
    //     }
    //     return target;
    // }
    // public getGroupIndexFromEvent(eventData: { [key: string]: Object }): number {
    //     let levelName: string = this.parent.resourceCollection.slice(-1)[0].name;
    //     let levelIndex: number = this.parent.resourceCollection.length - 1;
    //     let idField: string = this.parent.resourceCollection.slice(-1)[0].field;
    //     let id: number = ((eventData[idField] instanceof Array) ?
    //         (eventData[idField] as { [key: string]: Object })[0] : eventData[idField]) as number;
    //     let resource: ResourcesModel = this.parent.resourceCollection.filter((e: ResourcesModel, index: number) => {
    //         if (e.name === levelName) {
    //             levelIndex = index;
    //             return e;
    //         }
    //         return null;
    //     })[0];
    //     if (levelIndex > 0) {
    //         let parentField: string = this.parent.resourceCollection[levelIndex - 1].field;
    //         return this.parent.resourceBase.getIndexFromResourceId(id, levelName, resource, eventData, parentField);
    //     } else {
    //         return this.parent.resourceBase.getIndexFromResourceId(id, levelName, resource);
    //     }
    // }
    EventBase.prototype.appointmentBorderRemove = function (event) {
        var element = event.target;
        if (sf.base.closest(element, '.' + APPOINTMENT_CLASS)) {
            if (this.parent.options.currentView !== 'MonthAgenda') {
                this.parent.removeSelectedClass();
            }
        }
        else if (!sf.base.closest(element, '.' + POPUP_OPEN)) {
            this.removeSelectedAppointmentClass();
        }
    };
    EventBase.prototype.wireAppointmentEvents = function (element, isPreventCrud, isMorePopupEvent) {
        if (isPreventCrud === void 0) { isPreventCrud = false; }
        if (isMorePopupEvent === void 0) { isMorePopupEvent = false; }
        var isReadOnly = element.getAttribute('aria-readonly') === 'true';
        sf.base.EventHandler.clearEvents(element);
        if (this.parent.options.currentView !== 'TimelineYear' || isMorePopupEvent) {
            sf.base.EventHandler.add(element, 'click', this.eventClick, this);
            if (!this.parent.isAdaptive) {
                sf.base.EventHandler.add(element, 'touchstart', this.eventTouchClick, this);
            }
            if (!this.parent.isAdaptive && !this.parent.activeViewOptions.readonly && !isReadOnly) {
                sf.base.EventHandler.add(element, 'dblclick', this.eventDoubleClick, this);
            }
        }
        if (!this.parent.activeViewOptions.readonly && !isReadOnly && !isPreventCrud) {
            if (this.parent.resizeModule) {
                this.parent.resizeModule.wireResizeEvent(element);
            }
            if (this.parent.dragAndDropModule) {
                this.parent.dragAndDropModule.wireDragEvent(element);
            }
        }
    };
    EventBase.prototype.eventTouchClick = function (e) {
        var _this = this;
        setTimeout(function () { return _this.isDoubleTapped = false; }, 250);
        e.preventDefault();
        if (this.isDoubleTapped) {
            this.eventDoubleClick(e);
        }
        else if (!this.isDoubleTapped) {
            this.isDoubleTapped = true;
            this.eventClick(e);
        }
    };
    EventBase.prototype.eventClick = function (eventData) {
        var target = eventData.target;
        if (target.classList.contains(DRAG_CLONE_CLASS) || target.classList.contains(RESIZE_CLONE_CLASS) ||
            target.classList.contains(BLOCK_APPOINTMENT_CLASS)) {
            return;
        }
        if (this.parent.isAdaptive && this.parent.isTapHold) {
            this.parent.selectedElements = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_BORDER));
            var target_1 = sf.base.closest(eventData.target, '.' + APPOINTMENT_CLASS);
            var selectedElements = this.getSelectedEventElements(target_1);
            if (selectedElements.length > 0) {
                var titleContent = (selectedElements.length === 1) ?
                    selectedElements[0].querySelector('.' + SUBJECT_CLASS).innerHTML :
                    '(' + selectedElements.length + ')' + '&nbsp;' + 'selected item(s)';
                this.parent.quickPopup.element.querySelector('.' + SUBJECT_CLASS).innerHTML = titleContent;
                if (selectedElements.length > 1) {
                    sf.base.addClass([this.parent.quickPopup.element.querySelector('.' + EDIT_ICON_CLASS)], HIDDEN_CLASS);
                }
                else {
                    sf.base.removeClass([this.parent.quickPopup.element.querySelector('.' + EDIT_ICON_CLASS)], HIDDEN_CLASS);
                }
            }
            else {
                this.parent.selectedElements = [];
                this.parent.onQuickPopupClose();
            }
        }
        if (eventData.ctrlKey && eventData.which === 1 && this.parent.keyboardInteractionModule) {
            //this.parent.quickPopup.quickPopup.hide();
            this.parent.selectedElements = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_BORDER));
            var target_2 = sf.base.closest(eventData.target, '.' + APPOINTMENT_CLASS);
            this.getSelectedEventElements(target_2);
            var guid = this.activeEventData(eventData, false);
            this.parent.dotNetRef.invokeMethodAsync('TriggerEventClick', guid, this.getMouseEvent(eventData), true);
        }
        else {
            this.removeSelectedAppointmentClass();
            var guid = this.activeEventData(eventData, true);
            this.parent.dotNetRef.invokeMethodAsync('TriggerEventClick', guid, this.getMouseEvent(eventData), false);
        }
    };
    EventBase.prototype.eventDoubleClick = function (e) {
        //this.parent.quickPopup.quickPopupHide(true);
        if (e.type === 'touchstart') {
            this.activeEventData(e, true);
        }
        this.removeSelectedAppointmentClass();
        if (this.parent.activeEventData.element.classList.contains(INLINE_APPOINTMENT_CLASS) ||
            this.parent.activeEventData.element.querySelector('.' + INLINE_SUBJECT_CLASS)) {
            return;
        }
        var guid = this.activeEventData(e, false);
        this.parent.dotNetRef.invokeMethodAsync('TriggerEventDoubleClick', guid, this.getMouseEvent(e));
    };
    EventBase.prototype.getMouseEvent = function (e) {
        var mouseEvent = {
            altKey: e.altKey,
            button: e.button,
            buttons: e.buttons,
            clientX: e.clientX,
            clientY: e.clientY,
            ctrlKey: e.ctrlKey,
            detail: e.detail,
            metaKey: e.metaKey,
            screenX: e.screenX,
            screenY: e.screenY,
            shiftKey: e.shiftKey,
            type: e.type
        };
        return mouseEvent;
    };
    EventBase.prototype.activeEventData = function (eventData, isMultiple) {
        var target = sf.base.closest(eventData.target, '.' + APPOINTMENT_CLASS);
        var guid = target.getAttribute('data-guid');
        if (isMultiple) {
            this.addSelectedAppointments([].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]')));
            target.focus();
        }
        // let eventObject: { [key: string]: Object } = this.getEventByGuid(guid) as { [key: string]: Object };
        // if (eventObject && eventObject.isSpanned) {
        //     eventObject = this.parent.eventsData.filter((obj: { [key: string]: Object }) =>
        //         obj[this.parent.eventFields.id] === eventObject[this.parent.eventFields.id])[0] as { [key: string]: Object };
        // }
        this.parent.activeEventData = { element: target, guid: [guid] };
        return guid;
    };
    return EventBase;
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
/**
 * Month view events render
 */

var BLOCK_INDICATOR_WIDTH = 24;
var MonthEvent = /** @class */ (function (_super) {
    __extends$1(MonthEvent, _super);
    function MonthEvent(parent) {
        var _this = _super.call(this, parent) || this;
        _this.renderedEvents = [];
        _this.allDayLevel = 0;
        _this.moreIndicatorHeight = 19;
        _this.monthHeaderHeight = 0;
        _this.maxHeight = _this.parent.options.enableMaxHeight && !_this.parent.options.enableIndicator
            && !_this.parent.options.rowAutoHeight;
        _this.withIndicator = _this.parent.options.enableMaxHeight && _this.parent.options.enableIndicator
            && !_this.parent.options.rowAutoHeight;
        _this.maxOrIndicator = (_this.maxHeight || _this.withIndicator);
        _this.moreIndicatorHeight =
            (_this.parent.options.rowAutoHeight && _this.parent.options.ignoreWhitespace) ? 0 : _this.moreIndicatorHeight;
        _this.eventTop = _this.parent.options.currentView === 'Month' ? 10 : 0;
        return _this;
    }
    MonthEvent.prototype.renderAppointments = function () {
        var eventsClass = '.' + APPOINTMENT_CLASS + ', .' + MORE_INDICATOR_CLASS;
        var blockEventClass = '.' + BLOCK_APPOINTMENT_CLASS + ', .' + BLOCK_INDICATOR_CLASS;
        var elementList = [].slice.call(this.parent.element.querySelectorAll(eventsClass + ', ' + blockEventClass));
        var workcell = this.parent.element.querySelector('.e-work-cells');
        if (!workcell) {
            return;
        }
        var conWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        if (this.parent.options.rowAutoHeight) {
            this.parent.uiStateValues.top = conWrap.scrollTop;
            this.parent.uiStateValues.left = conWrap.scrollLeft;
        }
        this.removeHeightProperty(CONTENT_TABLE_CLASS);
        this.cellHeight = workcell.getBoundingClientRect().height;
        this.cellWidth = workcell.getBoundingClientRect().width;
        var currentPanel = this.parent.element.querySelector('.e-current-panel');
        var appHeight = getElementHeightFromClass(currentPanel, APPOINTMENT_CLASS);
        this.dateRender = this.parent.activeView.renderDates;
        for (var i = 0; i < elementList.length; i++) {
            var ele = elementList[i];
            this.removedPositionedStyles(ele);
            var startTime = this.getStartTime(ele);
            var overlapCount = this.getOverLapCount(ele);
            var diffInDays = this.getDataCount(ele);
            var appWidth = (diffInDays * this.cellWidth) - 5;
            var appLeft = 0;
            var appRight = 0;
            var resIndex = this.getGroupIndex(ele);
            var cellTd = this.getCellTd(resIndex, startTime);
            var target = sf.base.closest(cellTd, 'tr');
            this.monthHeaderHeight = this.parent.options.currentView === 'Month' ? cellTd.firstElementChild.offsetHeight : 0;
            var height = this.monthHeaderHeight + ((overlapCount + 1) * appHeight) + this.moreIndicatorHeight;
            if (this.parent.options.rowAutoHeight) {
                this.updateCellHeight(target.firstElementChild, height);
            }
            var top_1 = cellTd.offsetTop;
            var appTop = this.monthHeaderHeight + ((ele.classList.contains('e-block-appointment')) ? top_1 :
                top_1 + (overlapCount * appHeight)) + this.eventTop;
            appLeft = (this.parent.options.enableRtl) ? 0 : cellTd.offsetLeft;
            appRight = (this.parent.options.enableRtl) ? cellTd.parentElement.offsetWidth - cellTd.offsetLeft - this.cellWidth : 0;
            if (!ele.classList.contains('e-more-indicator')) {
                if (!ele.classList.contains('e-block-indicator')) {
                    sf.base.setStyleAttribute(ele, {
                        'width': appWidth + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
                    });
                    if (this.maxOrIndicator) {
                        this.setMaxEventHeight(ele, cellTd);
                    }
                    if (ele.classList.contains('e-block-appointment')) {
                        sf.base.setStyleAttribute(ele, {
                            'height': cellTd.offsetHeight - (appTop - cellTd.offsetTop) + 'px'
                        });
                    }
                    if (ele.classList.contains('e-appointment')) {
                        this.parent.eventBase.wireAppointmentEvents(ele);
                    }
                }
                else {
                    this.updateBlockIndicator(ele, appRight, appLeft, cellTd);
                }
            }
            else {
                this.updateMoreIndicator(ele, appRight, appLeft, top_1);
            }
        }
        this.updateRowHeight(appHeight);
    };
    MonthEvent.prototype.removedPositionedStyles = function (ele) {
        ele.style.removeProperty('width');
        ele.style.removeProperty('height');
        ele.style.removeProperty('left');
        ele.style.removeProperty('right');
        ele.style.removeProperty('top');
        ele.style.removeProperty('display');
    };
    MonthEvent.prototype.updateMoreIndicator = function (ele, right, left, top) {
        var appArea = this.cellHeight - this.moreIndicatorHeight;
        sf.base.setStyleAttribute(ele, {
            'top': top + appArea + 'px', 'width': this.cellWidth - 2 + 'px', 'left': left + 'px', 'right': right + 'px'
        });
    };
    MonthEvent.prototype.updateBlockIndicator = function (ele, right, left, cell) {
        if (this.parent.options.enableRtl) {
            ele.style.right = (right + this.cellWidth) - BLOCK_INDICATOR_WIDTH + 'px';
        }
        else {
            ele.style.left = (left + this.cellWidth) - BLOCK_INDICATOR_WIDTH + 'px';
        }
        ele.style.top = cell.offsetTop + cell.firstElementChild.offsetTop + 22 + 'px';
        ele.style.position = 'absolute';
    };
    MonthEvent.prototype.setMaxEventHeight = function (event, cell) {
        var headerHeight = this.parent.options.currentView === 'Month' ?
            getOuterHeight(cell.querySelector('.' + DATE_HEADER_CLASS)) : 0;
        var height = (cell.offsetHeight - headerHeight) - (this.maxHeight ? 0 : this.moreIndicatorHeight);
        sf.base.setStyleAttribute(event, { 'height': height + 'px', 'align-items': 'center' });
    };
    MonthEvent.prototype.getCellTd = function (resIndex, date) {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS +
                ' ' + 'tbody td[data-group-index="' + resIndex.toString() + '"][data-date="' + date.getTime() + '"]');
        }
        return this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS +
            ' ' + 'tbody td[data-date="' + date.getTime() + '"]');
    };
    MonthEvent.prototype.getGroupIndex = function (ele) {
        var index = parseInt(ele.getAttribute('data-group-index'), 10);
        return index ? index : 0;
    };
    MonthEvent.prototype.getOverLapCount = function (ele) {
        return parseInt(ele.getAttribute('data-index'), 10);
    };
    MonthEvent.prototype.getTotalLength = function (ele) {
        return parseInt(ele.getAttribute('data-total-length'), 10);
    };
    MonthEvent.prototype.getRowCount = function (ele) {
        return parseInt(ele.getAttribute('data-row-index'), 10);
    };
    MonthEvent.prototype.getStartTime = function (ele) {
        return new Date(parseInt(ele.getAttribute('data-start'), 10));
    };
    MonthEvent.prototype.getEndTime = function (ele) {
        return new Date(parseInt(ele.getAttribute('data-end'), 10));
    };
    MonthEvent.prototype.getDataCount = function (ele) {
        return parseInt(ele.getAttribute('data-total-length'), 10);
    };
    MonthEvent.prototype.updateRowHeight = function (appHeight) {
        if (this.parent.options.rowAutoHeight) {
            this.updateBlockElements();
            this.updateNormalEventElements(appHeight);
            this.updateBlockIndicatorEle();
            var data = {
                cssProperties: this.parent.getCssProperties(),
                isPreventScrollUpdate: true,
                scrollPosition: { left: this.parent.uiStateValues.left, top: this.parent.uiStateValues.top }
            };
            this.parent.onScrollUiUpdate(data);
        }
    };
    MonthEvent.prototype.updateBlockIndicatorEle = function () {
        var blockElement = [].slice.call(this.parent.element.querySelectorAll('.' + BLOCK_INDICATOR_CLASS));
        for (var _i = 0, blockElement_1 = blockElement; _i < blockElement_1.length; _i++) {
            var element = blockElement_1[_i];
            var startTime = this.getStartTime(element);
            var resIndex = this.getGroupIndex(element);
            var cellTd = this.getCellTd(resIndex, startTime);
            var appLeft = (this.parent.options.enableRtl) ? 0 : cellTd.offsetLeft;
            var appRight = (this.parent.options.enableRtl) ?
                cellTd.parentElement.offsetWidth - cellTd.offsetLeft - this.cellWidth : 0;
            this.updateBlockIndicator(element, appRight, appLeft, cellTd);
        }
    };
    MonthEvent.prototype.updateBlockElements = function () {
        var blockElement = [].slice.call(this.parent.element.querySelectorAll('.' + BLOCK_APPOINTMENT_CLASS));
        for (var _i = 0, blockElement_2 = blockElement; _i < blockElement_2.length; _i++) {
            var element = blockElement_2[_i];
            var startTime = this.getStartTime(element);
            var resIndex = this.getGroupIndex(element);
            var cellTd = this.getCellTd(resIndex, startTime);
            var height = cellTd.offsetHeight - this.monthHeaderHeight - 1;
            var width = Math.round(element.offsetWidth / cellTd.offsetWidth);
            width = (cellTd.offsetWidth * width);
            var appLeft = (this.parent.options.enableRtl) ? 0 : cellTd.offsetLeft;
            var appRight = (this.parent.options.enableRtl) ?
                cellTd.parentElement.offsetWidth - cellTd.offsetLeft - this.cellWidth : 0;
            var appTop = cellTd.offsetTop + this.monthHeaderHeight + this.eventTop;
            sf.base.setStyleAttribute(element, {
                'width': width + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'height': height + 'px', 'top': appTop + 'px'
            });
        }
    };
    MonthEvent.prototype.updateNormalEventElements = function (appHeight) {
        var blockElement = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
        for (var _i = 0, blockElement_3 = blockElement; _i < blockElement_3.length; _i++) {
            var element = blockElement_3[_i];
            var startTime = this.getStartTime(element);
            var resIndex = this.getGroupIndex(element);
            var cellTd = this.getCellTd(resIndex, startTime);
            var overlapCount = this.getOverLapCount(element);
            var appLeft = (this.parent.options.enableRtl) ? 0 : cellTd.offsetLeft;
            var appRight = (this.parent.options.enableRtl) ?
                cellTd.parentElement.offsetWidth - cellTd.offsetLeft - this.cellWidth : 0;
            var top_2 = this.monthHeaderHeight +
                cellTd.offsetTop + (overlapCount * appHeight) + this.eventTop;
            sf.base.setStyleAttribute(element, {
                'left': appLeft + 'px', 'right': appRight + 'px', 'top': top_2 + 'px'
            });
        }
    };
    MonthEvent.prototype.updateCellHeight = function (cell, height) {
        if ((height > cell.offsetHeight)) {
            sf.base.setStyleAttribute(cell, { 'height': height + 'px' });
        }
    };
    MonthEvent.prototype.getSlotDates = function (workDays) {
        this.slots = [];
        var dates = this.dateRender.map(function (date) { return +date; });
        var noOfDays = this.parent.activeViewOptions.showWeekend ? WEEK_LENGTH : workDays.length;
        while (dates.length > 0) {
            this.slots.push(dates.splice(0, noOfDays));
        }
    };
    MonthEvent.prototype.renderEvents = function (event, resIndex, eventsList) {
        var startTime = event.startTime;
        var day = this.parent.getIndexOfDate(this.dateRender, resetTime(startTime));
        var diffInDays = event.data.count;
        var appWidth = (diffInDays * this.cellWidth) - 5;
        var cellTd = this.workCells[day];
        var appointmentElement;
        appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
        sf.base.setStyleAttribute(appointmentElement, { 'width': appWidth + 'px' });
        this.renderEventElement(appointmentElement, cellTd);
    };
    MonthEvent.prototype.renderEventElement = function (appointmentElement, cellTd) {
        var wrapper = sf.base.createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
        wrapper.appendChild(appointmentElement);
        cellTd.appendChild(wrapper);
    };
    MonthEvent.prototype.removeHeightProperty = function (selector) {
        var rows = [].slice.call(this.parent.element.querySelectorAll('.' + selector + ' tbody tr'));
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            row.firstElementChild.style.height = '';
        }
    };
    return MonthEvent;
}(EventBase));

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
/**
 * vertical view
 */


var VerticalViews = /** @class */ (function (_super) {
    __extends(VerticalViews, _super);
    function VerticalViews(parent) {
        var _this = _super.call(this, parent) || this;
        _this.isInverseTableSelect = true;
        _this.baseCssClass = 'e-vertical-view';
        return _this;
    }
    VerticalViews.prototype.onDataReady = function () {
        if (this.parent.activeViewOptions.timeScale.enable) {
            var appointment = new VerticalEvent(this.parent);
            appointment.renderAppointments();
        }
        else {
            var appointment = new MonthEvent(this.parent);
            appointment.renderAppointments();
        }
    };
    VerticalViews.prototype.onContentScroll = function (e) {
        this.parent.removeNewEventElement();
        var target = e.target;
        this.parent.onVirtualScroll();
        this.scrollLeftPanel(target);
        this.scrollTopPanel(target);
        if (!this.parent.isAdaptive) {
            this.parent.uiStateValues.top = target.scrollTop;
        }
        this.parent.uiStateValues.left = target.scrollLeft;
        if (!sf.base.isNullOrUndefined(this.parent.quickPopup)) {
            this.parent.quickPopup.hide();
        }
    };
    VerticalViews.prototype.onApaptiveMove = function (e) {
        if (this.parent.uiStateValues.action) {
            e.preventDefault();
        }
    };
    VerticalViews.prototype.scrollLeftPanel = function (target) {
        var leftPanel = this.getLeftPanelElement();
        if (!sf.base.isNullOrUndefined(leftPanel)) {
            leftPanel.scrollTop = target.scrollTop;
        }
    };
    VerticalViews.prototype.onScrollUiUpdate = function (args) {
        var headerBarHeight = this.getHeaderBarHeight();
        var timecells = this.getLeftPanelElement();
        var content = this.getContentAreaElement();
        var header = this.getDatesHeaderElement();
        var scrollerHeight = this.parent.element.offsetHeight - headerBarHeight - header.offsetHeight;
        this.setColWidth(content);
        this.setContentHeight(content, timecells, scrollerHeight);
        var scrollBarWidth = getScrollBarWidth();
        // tslint:disable:no-any
        header.firstElementChild.style[args.cssProperties.rtlBorder] = '';
        header.style[args.cssProperties.rtlPadding] = '';
        if (content.offsetWidth - content.clientWidth > 0) {
            header.firstElementChild.style[args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        }
        else {
            header.firstElementChild.style[args.cssProperties.border] = '';
            header.style[args.cssProperties.padding] = '';
        }
        // tslint:enable:no-any
        if (!args.isPreventScrollUpdate) {
            if (this.parent.uiStateValues.isInitial) {
                this.scrollToWorkHour();
                this.parent.uiStateValues.isInitial = false;
            }
            else {
                if (timecells) {
                    timecells.scrollTop = this.parent.uiStateValues.top;
                }
                content.scrollTop = this.parent.uiStateValues.top;
                content.scrollLeft = this.parent.uiStateValues.left;
            }
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.highlightCurrentTime();
        }
    };
    VerticalViews.prototype.setContentHeight = function (element, leftPanelElement, height) {
        if (!sf.base.isNullOrUndefined(leftPanelElement)) {
            leftPanelElement.style.height = (this.parent.options.height === 'auto') ? 'auto'
                : sf.base.formatUnit(height - this.getScrollXIndent(element));
        }
        element.style.height = (this.parent.options.height === 'auto') ? 'auto' : sf.base.formatUnit(height);
    };
    VerticalViews.prototype.scrollToWorkHour = function () {
        if (this.parent.options.workHours.highlight) {
            var firstWorkHourCell = this.element.querySelector('.' + WORK_HOURS_CLASS);
            if (firstWorkHourCell) {
                this.getContentAreaElement().scrollTop = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.top = firstWorkHourCell.offsetTop;
                this.parent.uiStateValues.left = 0;
            }
        }
    };
    VerticalViews.prototype.scrollToHour = function (hour, scrollDate) {
        var date = this.parent.getStartEndTime(hour);
        if (sf.base.isNullOrUndefined(date) || !sf.base.isNullOrUndefined(scrollDate)) {
            return;
        }
        this.getContentAreaElement().scrollTop = this.getTopFromDateTime(date);
    };
    VerticalViews.prototype.isWorkHourRange = function (date) {
        return (this.getStartHour().getTime() <= date.getTime()) && (this.getEndHour().getTime() >= date.getTime());
    };
    VerticalViews.prototype.highlightCurrentTime = function () {
        var _this = this;
        if (this.parent.activeViewOptions.headerRows && this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return;
        }
        var curEle = [].slice.call(this.element.querySelectorAll('.' + CURRENT_DAY_CLASS));
        if (curEle.length > 0) {
            sf.base.removeClass(curEle, CURRENT_DAY_CLASS);
        }
        var curDate = addLocalOffset(new Date(new Date().setHours(0, 0, 0, 0)));
        var queryString = '.' + DATE_HEADER_CLASS + '[data-date="' + curDate.getTime().toString() + '"]';
        curEle = [].slice.call(this.element.querySelectorAll(queryString));
        for (var _i = 0, curEle_1 = curEle; _i < curEle_1.length; _i++) {
            var ele = curEle_1[_i];
            sf.base.addClass([ele], CURRENT_DAY_CLASS);
        }
        if (this.parent.options.showTimeIndicator && this.isWorkHourRange(this.parent.getCurrentTime())) {
            var currentDateIndex = this.getCurrentTimeIndicatorIndex();
            if (currentDateIndex.length > 0) {
                var workCells = [].slice.call(this.element.querySelectorAll('.' + WORK_CELLS_CLASS));
                if (workCells.length > 0) {
                    this.changeCurrentTimePosition();
                }
                if (sf.base.isNullOrUndefined(this.currentTimeIndicatorTimer)) {
                    this.currentTimeIndicatorTimer = window.setInterval(function () { _this.changeCurrentTimePosition(); }, MS_PER_MINUTE);
                }
            }
            else {
                this.clearCurrentTimeIndicatorTimer();
            }
        }
        else {
            this.clearCurrentTimeIndicatorTimer();
        }
    };
    VerticalViews.prototype.getCurrentTimeIndicatorIndex = function () {
        var currentDateIndex = [];
        var elements = [].slice.call(this.element.querySelectorAll('.e-timeline-wrapper'));
        var currentDateInMS = addLocalOffset(new Date(new Date().setHours(0, 0, 0, 0))).getTime().toString();
        for (var i = 0, length_1 = elements.length; i < length_1; i++) {
            if (elements[i].getAttribute('data-date') === currentDateInMS) {
                currentDateIndex.push(i);
            }
        }
        return currentDateIndex;
    };
    VerticalViews.prototype.clearCurrentTimeIndicatorTimer = function () {
        if (!sf.base.isNullOrUndefined(this.currentTimeIndicatorTimer)) {
            window.clearInterval(this.currentTimeIndicatorTimer);
            this.currentTimeIndicatorTimer = null;
            this.removeCurrentTimeIndicatorElements();
        }
    };
    VerticalViews.prototype.removeCurrentTimeIndicatorElements = function () {
        var queryString = '.' + PREVIOUS_TIMELINE_CLASS + ',.' + CURRENT_TIMELINE_CLASS + ',.' + CURRENT_TIME_CLASS;
        var timeIndicator = [].slice.call(this.element.querySelectorAll(queryString));
        for (var _i = 0, timeIndicator_1 = timeIndicator; _i < timeIndicator_1.length; _i++) {
            var indicator = timeIndicator_1[_i];
            sf.base.remove(indicator);
        }
    };
    VerticalViews.prototype.changeCurrentTimePosition = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeCurrentTimeIndicatorElements();
        var currentDateIndex = this.getCurrentTimeIndicatorIndex();
        var firstRow = this.parent.getContentTable().rows[0];
        var top = this.getTopFromDateTime(this.parent.getCurrentTime());
        var topInPx = sf.base.formatUnit(top);
        var rowIndex = Math.floor(top / firstRow.cells[0].offsetHeight);
        if (sf.base.isNullOrUndefined(rowIndex) || isNaN(rowIndex)) {
            return;
        }
        var curTimeWrap = [].slice.call(this.element.querySelectorAll('.' + TIMELINE_WRAPPER_CLASS));
        for (var i = 0, length_2 = currentDateIndex[0]; i < length_2; i++) {
            curTimeWrap[i].appendChild(sf.base.createElement('div', { className: PREVIOUS_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        for (var _i = 0, currentDateIndex_1 = currentDateIndex; _i < currentDateIndex_1.length; _i++) {
            var day = currentDateIndex_1[_i];
            curTimeWrap[day].appendChild(sf.base.createElement('div', { className: CURRENT_TIMELINE_CLASS, styles: 'top:' + topInPx }));
        }
        var currentTimeEle = sf.base.createElement('div', {
            innerHTML: this.parent.getTimeString(this.parent.getCurrentTime()),
            className: CURRENT_TIME_CLASS,
            styles: 'top:' + topInPx
        });
        var timeCellsWrap = this.getLeftPanelElement();
        var timeTrs = [].slice.call(timeCellsWrap.querySelectorAll('tr'));
        if (rowIndex <= timeTrs.length) {
            sf.base.removeClass(timeCellsWrap.querySelectorAll('.' + HIDE_CHILDS_CLASS), HIDE_CHILDS_CLASS);
            sf.base.addClass([timeTrs[rowIndex].lastElementChild], HIDE_CHILDS_CLASS);
            sf.base.prepend([currentTimeEle], timeCellsWrap);
            currentTimeEle.style.top = sf.base.formatUnit(currentTimeEle.offsetTop - (currentTimeEle.offsetHeight / 2));
        }
    };
    VerticalViews.prototype.getTopFromDateTime = function (date) {
        var startHour = this.getStartHour();
        var diffInMinutes = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        return (diffInMinutes * this.getWorkCellHeight() * this.parent.activeViewOptions.timeScale.slotCount) /
            this.parent.activeViewOptions.timeScale.interval;
    };
    VerticalViews.prototype.getWorkCellHeight = function () {
        return this.element.querySelector('.' + WORK_CELLS_CLASS).offsetHeight;
    };
    VerticalViews.prototype.renderLayout = function () {
        this.element = this.parent.element.querySelector('.' + TABLE_WRAP_CLASS);
        var headerCells = [].slice.call(this.element.querySelectorAll('.' + DATE_HEADER_WRAP_CLASS + ' td.' + HEADER_CELLS_CLASS));
        for (var _i = 0, headerCells_1 = headerCells; _i < headerCells_1.length; _i++) {
            var cell = headerCells_1[_i];
            sf.base.EventHandler.clearEvents(cell);
            this.wireMouseEvents(cell);
        }
        var alldayCells = [].slice.call(this.element.querySelectorAll('.' + DATE_HEADER_WRAP_CLASS + ' td.' + ALLDAY_CELLS_CLASS));
        for (var _a = 0, alldayCells_1 = alldayCells; _a < alldayCells_1.length; _a++) {
            var cell = alldayCells_1[_a];
            sf.base.EventHandler.clearEvents(cell);
            this.wireCellEvents(cell);
        }
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.setTranslateValue();
        }
        var wrap = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var contentBody = this.element.querySelector('.' + CONTENT_TABLE_CLASS + ' tbody');
        sf.base.EventHandler.clearEvents(contentBody);
        this.wireCellEvents(contentBody);
        sf.base.EventHandler.clearEvents(wrap);
        sf.base.EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        sf.base.EventHandler.add(wrap, sf.base.Browser.touchMoveEvent, this.onApaptiveMove, this);
        this.parent.setDimensions();
    };
    VerticalViews.prototype.wireCellEvents = function (element) {
        sf.base.EventHandler.add(element, 'mousedown', this.parent.workCellAction.cellMouseDown, this.parent.workCellAction);
        this.wireMouseEvents(element);
    };
    VerticalViews.prototype.wireMouseEvents = function (element) {
        sf.base.EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
        if (!this.parent.isAdaptive) {
            sf.base.EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
        }
    };
    VerticalViews.prototype.getLeftPanelElement = function () {
        return this.element.querySelector('.' + TIME_CELLS_WRAP_CLASS);
    };
    VerticalViews.prototype.getEndDateFromStartDate = function (start) {
        var msMajorInterval = this.parent.activeViewOptions.timeScale.interval * MS_PER_MINUTE;
        var msInterval = msMajorInterval / this.parent.activeViewOptions.timeScale.slotCount;
        var end = new Date(start.getTime());
        end.setMilliseconds(end.getMilliseconds() + msInterval);
        return end;
    };
    VerticalViews.prototype.destroy = function () {
        this.clearCurrentTimeIndicatorTimer();
        if (this.element) {
            var contentScrollableEle = this.getContentAreaElement();
            if (contentScrollableEle) {
                sf.base.EventHandler.remove(contentScrollableEle, 'scroll', this.onContentScroll);
            }
            this.element = null;
        }
    };
    return VerticalViews;
}(ViewBase));

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
var EVENT_GAP = 2;
var BLOCK_INDICATOR_WIDTH$1 = 22;
var BLOCK_INDICATOR_HEIGHT = 18;
/**
 * Timeline view events render
 */
var TimelineEvent = /** @class */ (function (_super) {
    __extends$3(TimelineEvent, _super);
    /**
     * Constructor for timeline views
     */
    function TimelineEvent(parent, type) {
        var _this = _super.call(this, parent) || this;
        _this.startHour = _this.parent.activeView.getStartHour();
        _this.endHour = _this.parent.activeView.getEndHour();
        _this.slotCount = _this.parent.activeViewOptions.timeScale.slotCount;
        _this.interval = _this.parent.activeViewOptions.timeScale.interval;
        _this.day = 0;
        _this.rowIndex = 0;
        _this.renderType = type;
        var tr = [].slice.call(_this.parent.element.querySelectorAll('.' + CONTENT_TABLE_CLASS + ' tbody tr'));
        _this.dayLength = tr.length === 0 ? 0 : tr[0].children.length;
        _this.content = _this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS);
        return _this;
    }
    TimelineEvent.prototype.getSlotDates = function () {
        this.slots = [];
        this.slots.push(this.parent.activeView.renderDates.map(function (date) { return +date; }));
        if (this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows[this.parent.activeViewOptions.headerRows.length - 1].option !== 'Hour') {
            this.renderType = 'day';
            this.cellWidth = this.content.offsetWidth / this.dateRender.length;
            this.slotsPerDay = 1;
        }
        else {
            this.slotsPerDay = (this.dayLength / this.dateRender.length);
        }
    };
    TimelineEvent.prototype.renderAppointments = function () {
        var eventsClass = '.' + APPOINTMENT_CLASS + ', .' + MORE_INDICATOR_CLASS;
        var blockEventClass = '.' + BLOCK_APPOINTMENT_CLASS + ', .' + BLOCK_INDICATOR_CLASS;
        var elementList = [].slice.call(this.parent.element.querySelectorAll(eventsClass + ', ' + blockEventClass));
        var workcell = this.parent.element.querySelector('.e-work-cells');
        if (!workcell) {
            return;
        }
        var conWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        if (this.parent.options.rowAutoHeight) {
            this.parent.uiStateValues.top = conWrap.scrollTop;
            this.parent.uiStateValues.left = conWrap.scrollLeft;
        }
        this.removeHeightProperty(CONTENT_TABLE_CLASS);
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.removeHeightProperty(RESOURCE_COLUMN_TABLE_CLASS);
        }
        this.cellHeight = workcell.getBoundingClientRect().height;
        this.cellWidth = workcell.getBoundingClientRect().width;
        var currentPanel = this.parent.element.querySelector('.e-current-panel');
        var appHeight = getElementHeightFromClass(currentPanel, APPOINTMENT_CLASS);
        this.dateRender = this.parent.activeView.renderDates;
        this.getSlotDates();
        for (var i = 0; i < elementList.length; i++) {
            var ele = elementList[i];
            this.removedPositionedStyles(ele);
            var startTime = removeLocalOffset(this.getStartTime(ele));
            var endTime = removeLocalOffset(this.getEndTime(ele));
            this.day = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime())));
            if (this.day >= 0) {
                var overlapCount = this.getOverLapCount(ele);
                var diffInDays = this.getDataCount(ele);
                var isAllDay = this.isAllDayData(ele) === 'true' ? true : false;
                var appWidth = this.getEventWidth(startTime, endTime, isAllDay, diffInDays);
                appWidth = this.renderType === 'day' ? appWidth - 2 : appWidth;
                var appLeft = 0;
                var appRight = 0;
                var position = this.getPosition(startTime, endTime, !ele.classList.contains('e-more-indicator') ? isAllDay : false, this.day);
                appWidth = (appWidth <= 0) ? this.cellWidth : appWidth; // appWidth 0 when start and end time as same
                var resIndex = this.getGroupIndex(ele);
                var top_1 = this.getRowTop(resIndex);
                var appTop = (ele.classList.contains('e-block-appointment')) ? top_1 :
                    (top_1 + EVENT_GAP) + (overlapCount * (appHeight + EVENT_GAP));
                appLeft = (this.parent.options.enableRtl) ? 0 : position;
                appRight = (this.parent.options.enableRtl) ? position : 0;
                var height = ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight;
                if (!ele.classList.contains('e-more-indicator')) {
                    if (!ele.classList.contains('e-block-indicator')) {
                        sf.base.setStyleAttribute(ele, {
                            'width': appWidth + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
                        });
                        if (this.maxOrIndicator) {
                            this.setMaxEventHeight(ele);
                        }
                        if (ele.classList.contains('e-block-appointment')) {
                            sf.base.setStyleAttribute(ele, {
                                'height': this.cellHeight - 1 + 'px'
                            });
                        }
                        if (ele.classList.contains('e-appointment')) {
                            this.parent.eventBase.wireAppointmentEvents(ele);
                        }
                        if (this.parent.options.rowAutoHeight) {
                            var firstChild = this.getFirstChild(resIndex);
                            this.updateCellHeight(firstChild, height);
                        }
                    }
                    else {
                        position = (Math.floor(position / this.cellWidth) * this.cellWidth) + this.cellWidth - BLOCK_INDICATOR_WIDTH$1;
                        if (this.parent.options.enableRtl) {
                            ele.style.right = position + 'px';
                        }
                        else {
                            ele.style.left = position + 'px';
                        }
                        ele.style.top = top_1 + this.cellHeight - BLOCK_INDICATOR_HEIGHT + 'px';
                    }
                }
                else {
                    var appArea = this.cellHeight - this.moreIndicatorHeight;
                    ele.style.top = top_1 + appArea + 'px';
                    ele.style.width = this.cellWidth + 'px';
                    ele.style.left = (Math.floor(appLeft / this.cellWidth) * this.cellWidth) + 'px';
                    ele.style.right = (Math.floor(appRight / this.cellWidth) * this.cellWidth) + 'px';
                }
            }
        }
        this.updateRowHeight();
    };
    TimelineEvent.prototype.updateRowHeight = function () {
        if (this.parent.options.rowAutoHeight) {
            this.updateBlockElements();
            var data = {
                cssProperties: this.parent.getCssProperties(),
                isPreventScrollUpdate: true,
                scrollPosition: { left: this.parent.uiStateValues.left, top: this.parent.uiStateValues.top }
            };
            if (this.parent.virtualScrollModule) {
                // if (this.parent.currentAction) {
                //     conWrap.scrollTop = scrollTop;
                //     this.parent.currentAction = null;
                // } else {
                this.parent.virtualScrollModule.updateVirtualScrollHeight();
                // }
            }
            this.parent.onScrollUiUpdate(data);
        }
    };
    TimelineEvent.prototype.updateBlockElements = function () {
        var blockElement = [].slice.call(this.parent.element.querySelectorAll('.' + BLOCK_APPOINTMENT_CLASS));
        for (var _i = 0, blockElement_1 = blockElement; _i < blockElement_1.length; _i++) {
            var element = blockElement_1[_i];
            var resIndex = parseInt(element.getAttribute('data-group-index'), 10);
            var firstChild = this.getFirstChild(resIndex);
            element.style.height = firstChild.offsetHeight + 'px';
            var width = Math.round(element.offsetWidth / firstChild.offsetWidth);
            element.style.width = (firstChild.offsetWidth * width) + 'px';
        }
        var blockIndicator = [].slice.call(this.parent.element.querySelectorAll('.' + BLOCK_INDICATOR_CLASS));
        for (var _a = 0, blockIndicator_1 = blockIndicator; _a < blockIndicator_1.length; _a++) {
            var element = blockIndicator_1[_a];
            var resIndex = parseInt(element.getAttribute('data-group-index'), 10);
            element.style.top = this.getRowTop(resIndex) +
                this.getFirstChild(resIndex).offsetHeight - BLOCK_INDICATOR_HEIGHT + 'px';
        }
    };
    TimelineEvent.prototype.setMaxEventHeight = function (event) {
        sf.base.setStyleAttribute(event, {
            'height': (this.cellHeight - (this.maxHeight ? 0 : EVENT_GAP) -
                (this.maxHeight ? 0 : this.moreIndicatorHeight)) + 'px'
        });
    };
    TimelineEvent.prototype.getFirstChild = function (index) {
        var query = '.' + CONTENT_TABLE_CLASS + ' tbody td';
        var groupIndex = '';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            groupIndex = '[data-group-index="' + index.toString() + '"]';
        }
        var td = this.parent.element.querySelector(query + groupIndex);
        return td;
    };
    TimelineEvent.prototype.updateCellHeight = function (cell, height) {
        if ((height > cell.offsetHeight)) {
            sf.base.setStyleAttribute(cell, { 'height': height + 'px' });
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                var resourceCell = this.parent.element.querySelector('.' + RESOURCE_COLUMN_TABLE_CLASS + ' ' + 'tbody td[data-group-index="' +
                    cell.getAttribute('data-group-index') + '"]');
                if (resourceCell) {
                    sf.base.setStyleAttribute(resourceCell, { 'height': height + 'px' });
                }
            }
            var monthHeader = this.parent.element.querySelector('.e-month-header-wrapper table tr:nth-child(' +
                (cell.parentElement.rowIndex + 1) + ') td');
            if (monthHeader) {
                sf.base.setStyleAttribute(monthHeader, { 'height': height + 'px' });
            }
        }
    };
    TimelineEvent.prototype.isAllDayData = function (ele) {
        return ele.getAttribute('data-all-day');
    };
    TimelineEvent.prototype.getEventWidth = function (startDate, endDate, isAllDay, count) {
        if (this.renderType === 'day' || isAllDay) {
            return (count * this.slotsPerDay) * this.cellWidth;
        }
        if (this.isSameDay(startDate, endDate)) {
            return this.getSameDayEventsWidth(startDate, endDate);
        }
        else {
            return this.getSpannedEventsWidth(startDate, endDate, count);
        }
    };
    TimelineEvent.prototype.getSameDayEventsWidth = function (startDate, endDate) {
        return (((endDate.getTime() - startDate.getTime())) / (60 * 1000) * (this.cellWidth * this.slotCount) / this.interval);
    };
    TimelineEvent.prototype.getSpannedEventsWidth = function (startDate, endDate, diffInDays) {
        var width = (diffInDays * this.slotsPerDay) * this.cellWidth;
        var startWidth;
        var endWidth;
        var start = getStartEndHours(resetTime(new Date(startDate.getTime())), this.startHour, this.endHour);
        startWidth = this.getSameDayEventsWidth(start.startHour, startDate);
        if (this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(endDate.getTime()))) === -1) {
            endWidth = 0;
        }
        else {
            var end = getStartEndHours(resetTime(new Date(endDate.getTime())), this.startHour, this.endHour);
            endWidth = this.getSameDayEventsWidth(endDate, end.endHour);
            endWidth = ((this.slotsPerDay * this.cellWidth) === endWidth) ? 0 : endWidth;
        }
        var spannedWidth = startWidth + endWidth;
        return (width > spannedWidth) ? width - spannedWidth : endWidth - startWidth;
    };
    TimelineEvent.prototype.isSameDay = function (startTime, endTime) {
        var startDay = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime())));
        var endDay = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(endTime.getTime())));
        return (startDay === endDay);
    };
    TimelineEvent.prototype.getAppointmentLeft = function (schedule, startTime, day) {
        var slotTd = (this.isSameDay(startTime, schedule.startHour)) ?
            ((startTime.getTime() - schedule.startHour.getTime()) / ((60 * 1000) * this.interval)) * this.slotCount : 0;
        if (day === 0) {
            return slotTd;
        }
        else {
            var daySlot = Math.round((((schedule.endHour.getTime() - schedule.startHour.getTime()) / (60 * 1000)) / this.interval) * this.slotCount);
            return (daySlot * day) + slotTd;
        }
    };
    TimelineEvent.prototype.getPosition = function (startTime, endTime, isAllDay, day) {
        if (this.renderType === 'day' || isAllDay) {
            return (day * this.slotsPerDay) * this.cellWidth;
        }
        var currentDate = resetTime(new Date(this.dateRender[day].getTime()));
        var schedule = getStartEndHours(currentDate, this.startHour, this.endHour);
        var cellIndex;
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
    };
    TimelineEvent.prototype.getRowTop = function (resIndex) {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            return ((this.parent.activeViewOptions.group.resources.length > 1 || this.parent.virtualScrollModule ||
                this.parent.options.rowAutoHeight) ? this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS +
                ' ' + 'tbody td[data-group-index="' + resIndex.toString() + '"]').offsetTop : this.cellHeight * resIndex);
        }
        return 0;
    };
    TimelineEvent.prototype.renderEvents = function (event, resIndex, appointmentsList) {
        var eventData = event.data;
        var startTime = event.startTime;
        var endTime = event.endTime;
        this.dateRender = this.parent.activeView.renderDates;
        this.day = this.parent.getIndexOfDate(this.dateRender, resetTime(new Date(startTime.getTime())));
        var cellTd = this.getCellTd();
        var appHeight = this.eventHeight;
        var diffInDays = eventData.count;
        var appWidth = this.getEventWidth(startTime, endTime, event.isAllDay, diffInDays);
        appWidth = this.renderType === 'day' ? appWidth - 2 : appWidth;
        var position = this.getPosition(startTime, endTime, event.isAllDay, this.day);
        appWidth = (appWidth <= 0) ? this.cellWidth : appWidth; // appWidth 0 when start and end time as same
        var top = this.getRowTop(resIndex);
        var appTop = (top + EVENT_GAP) + ( /*overlapCount */(appHeight + EVENT_GAP));
        var appLeft = (this.parent.options.enableRtl) ? 0 : position;
        var appRight = (this.parent.options.enableRtl) ? position : 0;
        var appointmentElement;
        appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
        sf.base.setStyleAttribute(appointmentElement, {
            'width': appWidth + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
        });
        this.renderEventElement(appointmentElement, cellTd);
    };
    TimelineEvent.prototype.getCellTd = function () {
        var wrapIndex = this.parent.uiStateValues.isGroupAdaptive ? 0 : this.rowIndex;
        return this.eventContainers[wrapIndex];
    };
    return TimelineEvent;
}(MonthEvent));

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
/**
 * timeline view
 */
var TimelineViews = /** @class */ (function (_super) {
    __extends$2(TimelineViews, _super);
    function TimelineViews(parent) {
        var _this = _super.call(this, parent) || this;
        _this.baseCssClass = 'e-timeline-view';
        return _this;
    }
    TimelineViews.prototype.getLeftPanelElement = function () {
        return this.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
    };
    TimelineViews.prototype.scrollTopPanel = function (target) {
        _super.prototype.scrollTopPanel.call(this, target);
        this.scrollHeaderLabels(target);
    };
    TimelineViews.prototype.scrollToWorkHour = function () {
        var start = this.parent.getStartEndTime(this.parent.options.workHours.start);
        var currDateTime = this.isWorkDay(this.parent.options.selectedDate) && this.parent.options.workHours.highlight &&
            !sf.base.isNullOrUndefined(start) ? new Date(+this.parent.options.selectedDate).setHours(start.getHours(), start.getMinutes(), 0, 0)
            : new Date(+this.parent.options.selectedDate).setHours(0, 0, 0, 0);
        var queryString = '[data-date="' + this.parent.getMsFromDate(new Date(currDateTime)) + '"]';
        var firstWorkHourCell = this.element.querySelector(queryString);
        if (firstWorkHourCell) {
            this.getContentAreaElement().scrollLeft = firstWorkHourCell.offsetLeft;
        }
    };
    TimelineViews.prototype.scrollToHour = function (hour, scrollDate) {
        var date;
        var index;
        if (scrollDate) {
            index = this.parent.getIndexOfDate(this.renderDates, this.parent.resetTime(scrollDate));
            if (index >= 0) {
                var timeString = hour.split(':');
                if (timeString.length === 2) {
                    date = new Date(scrollDate.setHours(parseInt(timeString[0], 10), parseInt(timeString[1], 10), 0));
                }
            }
        }
        date = sf.base.isNullOrUndefined(scrollDate) ? this.parent.getStartEndTime(hour) : date;
        if (sf.base.isNullOrUndefined(date)) {
            return;
        }
        this.getContentAreaElement().scrollLeft =
            sf.base.isNullOrUndefined(scrollDate) ? this.getLeftFromDateTime(null, date) : this.getLeftFromDateTime([index], date);
    };
    TimelineViews.prototype.changeCurrentTimePosition = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeCurrentTimeIndicatorElements();
        var currentDateIndex = this.getCurrentTimeIndicatorIndex();
        var left = this.getLeftFromDateTime(currentDateIndex, this.parent.getCurrentTime());
        var height = this.element.querySelector('.' + CONTENT_TABLE_CLASS).offsetHeight;
        var headerWrap = this.element.querySelector('.' + DATE_HEADER_WRAP_CLASS);
        var contentWrap = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        contentWrap.appendChild(sf.base.createElement('div', {
            className: CURRENT_TIMELINE_CLASS,
            styles: (this.parent.options.enableRtl ? 'right' : 'left') + ':' + sf.base.formatUnit(left) + '; height:' + sf.base.formatUnit(height)
        }));
        if (this.parent.virtualScrollModule) {
            var timeIndicator = this.parent.element.querySelector('.' + CURRENT_TIMELINE_CLASS);
            var element = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS + ' table');
            sf.base.setStyleAttribute(timeIndicator, {
                transform: element.style.transform
            });
        }
        var currentTimeEle = sf.base.createElement('div', {
            innerHTML: this.parent.getTimeString(this.parent.getCurrentTime()),
            className: CURRENT_TIME_CLASS
        });
        headerWrap.appendChild(currentTimeEle);
        currentTimeEle.style[this.parent.options.enableRtl ? 'right' : 'left'] = sf.base.formatUnit(left - (currentTimeEle.offsetWidth / 2));
    };
    TimelineViews.prototype.getLeftFromDateTime = function (currentDateIndex, date) {
        var startHour = this.getStartHour();
        var endHour = this.getEndHour();
        var diffInDates = 0;
        var diffInMinutes = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        if (!sf.base.isNullOrUndefined(currentDateIndex)) {
            var end = (endHour.getHours() === 0) ? 24 : endHour.getHours();
            if (currentDateIndex[0] !== 0) {
                diffInDates = (currentDateIndex[0]) * ((end - startHour.getHours()) * 60) + (endHour.getMinutes() - startHour.getMinutes());
            }
            diffInMinutes = diffInDates + diffInMinutes;
        }
        return (diffInMinutes * this.getWorkCellWidth() * this.parent.activeViewOptions.timeScale.slotCount) /
            this.parent.activeViewOptions.timeScale.interval;
    };
    TimelineViews.prototype.getWorkCellWidth = function () {
        return this.element.querySelector('.e-work-cells').getBoundingClientRect().width;
    };
    TimelineViews.prototype.getCurrentTimeIndicatorIndex = function () {
        var currentDateIndex = [];
        var index = this.parent.getIndexOfDate(this.renderDates, this.parent.resetTime(this.parent.getCurrentTime()));
        if (index >= 0) {
            currentDateIndex.push(index);
        }
        return currentDateIndex;
    };
    TimelineViews.prototype.renderEvents = function () {
        // if (this.parent.activeViewOptions.timeScale.enable) {
        //     let appointment: TimelineEvent = new TimelineEvent(this.parent, 'hour');
        //     appointment.renderAppointments();
        // } else {
        //     let appointment: TimelineEvent = new TimelineEvent(this.parent, 'day');
        //     appointment.renderAppointments();
    };
    TimelineViews.prototype.onDataReady = function () {
        if (this.parent.activeViewOptions.timeScale.enable) {
            var appointment = new TimelineEvent(this.parent, 'hour');
            appointment.renderAppointments();
        }
        else {
            var appointment = new TimelineEvent(this.parent, 'day');
            appointment.renderAppointments();
        }
    };
    return TimelineViews;
}(VerticalViews));

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
/**
 * month view
 */

var Month = /** @class */ (function (_super) {
    __extends$4(Month, _super);
    function Month(parent) {
        var _this = _super.call(this, parent) || this;
        _this.dayNameFormat = 'wide';
        _this.isInverseTableSelect = false;
        _this.allDayLevel = 0;
        return _this;
    }
    Month.prototype.onDataReady = function (args) {
        var appointment = new MonthEvent(this.parent);
        appointment.renderAppointments();
    };
    Month.prototype.onContentScroll = function (e) {
        this.parent.removeNewEventElement();
        this.parent.onVirtualScroll();
        this.scrollTopPanel(e.target);
        this.scrollLeftPanel(e.target);
    };
    Month.prototype.scrollLeftPanel = function (target) {
        var leftPanel = this.getLeftPanelElement();
        if (leftPanel) {
            leftPanel.scrollTop = target.scrollTop;
        }
    };
    Month.prototype.getLeftPanelElement = function () {
        return this.element.querySelector('.' + WEEK_NUMBER_WRAPPER_CLASS);
    };
    Month.prototype.onScrollUiUpdate = function (args) {
        var headerHeight = this.getHeaderBarHeight();
        var header = this.getDatesHeaderElement();
        var content = this.getContentAreaElement();
        var height = this.parent.element.offsetHeight - headerHeight - header.offsetHeight;
        var leftPanel = this.getLeftPanelElement();
        this.setContentHeight(content, leftPanel, height);
        var scrollBarWidth = getScrollBarWidth();
        // tslint:disable:no-any
        header.firstElementChild.style[args.cssProperties.rtlBorder] = '';
        header.style[args.cssProperties.rtlPadding] = '';
        if (content.offsetWidth - content.clientWidth > 0) {
            header.firstElementChild.style[args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
            header.style[args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
        }
        else {
            header.firstElementChild.style[args.cssProperties.border] = '';
            header.style[args.cssProperties.padding] = '';
        }
        // tslint:enable:no-any
        this.setColWidth(content);
        if (args.scrollPosition) {
            if (leftPanel) {
                leftPanel.scrollTop = args.scrollPosition.top;
            }
            content.scrollTop = args.scrollPosition.top;
            content.scrollLeft = args.scrollPosition.left;
        }
        else {
            var headerCell = document.querySelector('.' + HEADER_CELLS_CLASS + '[data-date="'
                + this.parent.getMsFromDate(this.parent.options.selectedDate) + '"]');
            content.scrollLeft = headerCell !== null ? headerCell.offsetLeft : 0;
        }
    };
    Month.prototype.setContentHeight = function (content, leftPanelElement, height) {
        content.style.height = 'auto';
        if (this.parent.options.currentView === 'Month') {
            content.style.height = sf.base.formatUnit(height);
        }
        if (leftPanelElement) {
            if (this.parent.options.currentView === 'MonthAgenda') {
                height = this.element.querySelector('.' + CONTENT_TABLE_CLASS).offsetHeight;
            }
            leftPanelElement.style.height = 'auto';
            leftPanelElement.style.height = sf.base.formatUnit(height - this.getScrollXIndent(content));
        }
    };
    Month.prototype.renderLayout = function () {
        var curElem = [].slice.call(this.parent.element.querySelectorAll('.' + CURRENT_DAY_CLASS));
        if (curElem.length > 0) {
            sf.base.removeClass(curElem, CURRENT_DAY_CLASS);
        }
        var curDate = addLocalOffset(new Date(new Date().setHours(0, 0, 0, 0)));
        var queryString = '.' + WORK_CELLS_CLASS + '[data-date="' + curDate.getTime().toString() + '"]';
        if (this.parent.options.currentView === 'Month' || this.parent.options.currentView === 'MonthAgenda') {
            curElem = [].slice.call(this.parent.element.querySelectorAll('.' + CURRENTDATE_CLASS));
            if (curElem.length > 0) {
                sf.base.removeClass(curElem, CURRENTDATE_CLASS);
            }
            var curEle = [].slice.call(this.parent.element.querySelectorAll(queryString));
            for (var _i = 0, curEle_1 = curEle; _i < curEle_1.length; _i++) {
                var ele = curEle_1[_i];
                var index = ele.cellIndex;
                var curHeader = [].slice.call(this.parent.element.querySelectorAll('.' + HEADER_CELLS_CLASS))[index];
                sf.base.addClass([ele], CURRENTDATE_CLASS);
                sf.base.addClass([curHeader], CURRENT_DAY_CLASS);
            }
        }
        if (this.parent.options.currentView === 'TimelineMonth') {
            var curEle = this.parent.element.querySelector('.' + HEADER_CELLS_CLASS + '[data-date="' + curDate.getTime().toString() + '"]');
            if (!sf.base.isNullOrUndefined(curEle)) {
                sf.base.addClass([curEle], CURRENT_DAY_CLASS);
            }
        }
        this.element = this.parent.element.querySelector('.' + TABLE_WRAP_CLASS);
        var headerCells = [].slice.call(this.element.querySelectorAll('.' + DATE_HEADER_WRAP_CLASS + ' td.' + HEADER_CELLS_CLASS));
        for (var _a = 0, headerCells_1 = headerCells; _a < headerCells_1.length; _a++) {
            var cell = headerCells_1[_a];
            sf.base.EventHandler.clearEvents(cell);
            this.wireCellEvents(cell);
        }
        var contentBody = this.element.querySelector('.' + CONTENT_TABLE_CLASS + ' tbody');
        sf.base.EventHandler.clearEvents(contentBody);
        this.wireCellEvents(contentBody);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.setTranslateValue();
        }
        var wrap = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        sf.base.EventHandler.clearEvents(wrap);
        sf.base.EventHandler.add(wrap, 'scroll', this.onContentScroll, this);
        this.renderAppointmentContainer();
        this.parent.setDimensions();
    };
    Month.prototype.wireCellEvents = function (element) {
        sf.base.EventHandler.add(element, 'mousedown', this.parent.workCellAction.cellMouseDown, this.parent.workCellAction);
        sf.base.EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
        if (!this.parent.isAdaptive) {
            sf.base.EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
        }
    };
    Month.prototype.renderAppointmentContainer = function () {
        //Here needs to render mobile view appointment details on selected date
    };
    Month.prototype.getMonthStart = function (currentDate) {
        var monthStart = getWeekFirstDate(firstDateOfMonth(currentDate), this.parent.activeViewOptions.firstDayOfWeek);
        var start = new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
        return start;
    };
    Month.prototype.getMonthEnd = function (currentDate) {
        var endDate = addMonths(currentDate, this.parent.activeViewOptions.interval - 1);
        var lastWeekOfMonth = getWeekFirstDate(lastDateOfMonth(endDate), this.parent.activeViewOptions.firstDayOfWeek);
        var monthEnd = addDays(lastWeekOfMonth, WEEK_LENGTH - 1);
        return monthEnd;
    };
    Month.prototype.getRenderDates = function (workDays) {
        var renderDates = [];
        var currentDate = resetTime(this.parent.options.selectedDate);
        var start = this.getMonthStart(currentDate);
        var monthEnd = this.getMonthEnd(currentDate);
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
        // if (this.parent.headerModule) {
        //     this.parent.headerModule.previousNextIconHandler();
        // }
        return renderDates;
    };
    Month.prototype.getEndDateFromStartDate = function (start) {
        return addDays(new Date(start.getTime()), 1);
    };
    Month.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.element = null;
    };
    return Month;
}(ViewBase));

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
 * month agenda view
 */
var MonthAgenda = /** @class */ (function (_super) {
    __extends$5(MonthAgenda, _super);
    function MonthAgenda(parent) {
        return _super.call(this, parent) || this;
    }
    MonthAgenda.prototype.renderAppointmentContainer = function () {
        if (this.getContentAreaElement().style.height === 'auto') {
            return;
        }
        this.setEventWrapperHeight();
    };
    MonthAgenda.prototype.setEventWrapperHeight = function () {
        var headerHeight = this.getHeaderBarHeight(true);
        var contentArea = this.getContentAreaElement().firstElementChild;
        var dateHeader = this.element.querySelector('.' + DATE_HEADER_WRAP_CLASS);
        var availableHeight = this.parent.element.offsetHeight - headerHeight - dateHeader.offsetHeight - contentArea.offsetHeight;
        var wrapperContainer = this.element.querySelector('.' + WRAPPER_CONTAINER_CLASS);
        var eventWrapper = this.element.querySelector('.' + APPOINTMENT_WRAP_CLASS);
        wrapperContainer.style.height = eventWrapper.style.height = sf.base.formatUnit(availableHeight);
    };
    return MonthAgenda;
}(Month));

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
 * timeline month view
 */
var TimelineMonth = /** @class */ (function (_super) {
    __extends$6(TimelineMonth, _super);
    function TimelineMonth(parent) {
        var _this = _super.call(this, parent) || this;
        _this.isInverseTableSelect = true;
        return _this;
    }
    TimelineMonth.prototype.onDataReady = function (args) {
        var appointment = new TimelineEvent(this.parent, 'day');
        appointment.renderAppointments();
    };
    TimelineMonth.prototype.getLeftPanelElement = function () {
        return this.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
    };
    TimelineMonth.prototype.scrollTopPanel = function (target) {
        _super.prototype.scrollTopPanel.call(this, target);
        this.scrollHeaderLabels(target);
    };
    TimelineMonth.prototype.setContentHeight = function (content, leftPanelElement, height) {
        if (leftPanelElement) {
            leftPanelElement.style.height = sf.base.formatUnit(height - this.getScrollXIndent(content));
        }
        content.style.height = sf.base.formatUnit(height);
    };
    TimelineMonth.prototype.getMonthStart = function (currentDate) {
        var monthStart = firstDateOfMonth(resetTime(currentDate));
        return new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
    };
    TimelineMonth.prototype.getMonthEnd = function (currentDate) {
        var monthStart = firstDateOfMonth(resetTime(currentDate));
        return lastDateOfMonth(addMonths(new Date(+monthStart), this.parent.activeViewOptions.interval - 1));
    };
    return TimelineMonth;
}(Month));

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
/**
 * year and timeline year view
 */
var Year = /** @class */ (function (_super) {
    __extends$7(Year, _super);
    function Year(parent) {
        var _this = _super.call(this, parent) || this;
        _this.isInverseTableSelect = false;
        return _this;
    }
    Year.prototype.renderLayout = function () {
        this.element = this.parent.element.querySelector('.' + TABLE_WRAP_CLASS);
        if (this.parent.options.currentView === 'TimelineYear') {
            var workCells = [].slice.call(this.element.querySelectorAll('.e-work-cells:not(.e-other-month)'));
            for (var _i = 0, workCells_1 = workCells; _i < workCells_1.length; _i++) {
                var cell = workCells_1[_i];
                sf.base.EventHandler.clearEvents(cell);
                this.wireEvents(cell, 'cell');
            }
        }
        this.wireEvents(this.element.querySelector('.' + CONTENT_WRAP_CLASS), 'scroll');
        this.parent.setDimensions();
    };
    Year.prototype.onContentScroll = function (e) {
        var target = e.target;
        if (sf.base.isNullOrUndefined(this.element)) {
            this.element = target;
        }
        var headerWrapper = this.getDatesHeaderElement();
        if (headerWrapper) {
            headerWrapper.firstElementChild.scrollLeft = target.scrollLeft;
        }
        var scrollTopSelector = "." + MONTH_HEADER_WRAPPER + ",." + RESOURCE_COLUMN_WRAP_CLASS;
        var scrollTopElement = this.element.querySelector(scrollTopSelector);
        if (scrollTopElement) {
            scrollTopElement.scrollTop = target.scrollTop;
        }
    };
    Year.prototype.onScrollUiUpdate = function (args) {
        var height = this.parent.element.offsetHeight - this.getHeaderBarHeight();
        var headerWrapper = this.element.querySelector('.' + DATE_HEADER_CONTAINER_CLASS);
        if (headerWrapper) {
            height -= headerWrapper.offsetHeight;
        }
        var contentWrapper = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        if (contentWrapper) {
            contentWrapper.style.height = sf.base.formatUnit(height);
        }
        var leftPanelSelector = "." + MONTH_HEADER_WRAPPER + ",." + RESOURCE_COLUMN_WRAP_CLASS;
        var leftPanelElement = this.element.querySelector(leftPanelSelector);
        if (leftPanelElement) {
            leftPanelElement.style.height = sf.base.formatUnit(height - this.getScrollXIndent(contentWrapper));
        }
        if (!this.parent.isAdaptive && headerWrapper) {
            var scrollBarWidth = getScrollBarWidth();
            // tslint:disable:no-any
            if (contentWrapper.offsetWidth - contentWrapper.clientWidth > 0) {
                headerWrapper.firstElementChild.style[args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
                headerWrapper.style[args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
            }
            else {
                headerWrapper.firstElementChild.style[args.cssProperties.border] = '';
                headerWrapper.style[args.cssProperties.padding] = '';
            }
            // tslint:enable:no-any
        }
        this.setColWidth(this.getContentAreaElement());
    };
    Year.prototype.onDataReady = function () {
        if (this.parent.options.currentView === 'TimelineYear') {
            this.element = this.parent.element.querySelector('.' + TABLE_WRAP_CLASS);
            var workCell = this.element.querySelector('.e-work-cells');
            var cellDetail = workCell.getBoundingClientRect();
            var cellHeight = cellDetail.height;
            var cellWidth = cellDetail.width;
            var cellHeader = getOuterHeight(workCell.querySelector('.e-date-header'));
            var eventTable = this.element.querySelector('.e-event-table');
            var eventHeight = getElementHeightFromClass(eventTable, 'e-appointment');
            var EVENT_GAP = 2;
            var leftValue = void 0;
            var rightValue = void 0;
            var appointments = this.element.querySelectorAll('.e-appointment, .e-more-indicator');
            for (var i = 0; i < appointments.length; i++) {
                var ele = appointments[i];
                var cellData = void 0;
                var cellTop = void 0;
                var height = void 0;
                var width = void 0;
                var levelIndex = parseInt(ele.getAttribute('data-level'), 10);
                if (this.parent.activeViewOptions.group.resources != null &&
                    this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                    cellData = this.element.querySelector('.e-work-cells' + '[data-date="' + ele.getAttribute('data-date') + '"]' +
                        '[data-group-index="' + ele.getAttribute('data-group-index') + '"]');
                }
                else {
                    cellData = this.element.querySelector('.e-work-cells' + '[data-date="' + ele.getAttribute('data-date') + '"]');
                }
                if (this.parent.options.enableRtl) {
                    rightValue = cellData.cellIndex * cellWidth;
                }
                else {
                    leftValue = cellData.cellIndex * cellWidth;
                }
                if (!sf.base.isNullOrUndefined(cellData)) {
                    if (ele.classList.contains('e-appointment')) {
                        cellTop = cellData.offsetTop + cellHeader + (eventHeight * levelIndex) + EVENT_GAP;
                        height = eventHeight;
                        width = cellWidth - 2;
                        this.parent.eventBase.wireAppointmentEvents(ele);
                    }
                    else {
                        cellTop = cellData.offsetTop + (cellHeight - ele.offsetHeight);
                        width = cellWidth - 2;
                    }
                    ele.style.width = width + 'px';
                    ele.style.height = height + 'px';
                    ele.style.right = rightValue + 'px';
                    ele.style.left = leftValue + 'px';
                    ele.style.top = cellTop + 'px';
                }
            }
        }
    };
    Year.prototype.getEndDateFromStartDate = function (start) {
        var date = new Date(start.getTime());
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            date = lastDateOfMonth(date);
        }
        return addDays(new Date(date.getTime()), 1);
    };
    Year.prototype.wireEvents = function (element, type) {
        if (type === 'cell') {
            if (this.parent.options.currentView === 'TimelineYear') {
                sf.base.EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
                if (!this.parent.isAdaptive) {
                    sf.base.EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
                }
            }
        }
        else {
            sf.base.EventHandler.add(element, 'scroll', this.onContentScroll, this);
        }
    };
    Year.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            this.element = null;
        }
    };
    return Year;
}(ViewBase));

var __extends$8 = (undefined && undefined.__extends) || (function () {
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
 * agenda view
 */
var Agenda = /** @class */ (function (_super) {
    __extends$8(Agenda, _super);
    function Agenda(parent) {
        var _this = _super.call(this, parent) || this;
        _this.viewClass = 'e-agenda-view';
        _this.isInverseTableSelect = false;
        _this.translateY = 0;
        _this.itemCount = 0;
        _this.elementHeight = 70;
        _this.bufferCount = 3;
        _this.renderedCount = 10;
        return _this;
    }
    Agenda.prototype.renderLayout = function () {
        this.element = this.parent.element.querySelector('.' + TABLE_WRAP_CLASS);
        this.wireEvents();
        this.parent.setDimensions();
    };
    Agenda.prototype.onDataReady = function (args, count, isScrollTop) {
        var wrap = this.element.querySelector('.' + VIRTUAL_TRACK_CLASS);
        if (!wrap) {
            wrap = sf.base.createElement('div', { className: VIRTUAL_TRACK_CLASS });
        }
        var conWrap = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        wrap.style.height = (count * this.elementHeight) - conWrap.offsetHeight + 'px';
        conWrap.appendChild(wrap);
        if (isScrollTop) {
            conWrap.scrollTop = this.translateY = 0;
            this.setTranslate(conWrap);
        }
        this.itemCount = count;
    };
    Agenda.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element.querySelector('.' + CONTENT_WRAP_CLASS), 'scroll', this.agendaScrolling, this);
    };
    Agenda.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.element.querySelector('.' + CONTENT_WRAP_CLASS), 'scroll', this.agendaScrolling);
    };
    Agenda.prototype.agendaScrolling = function () {
        if (!sf.base.isNullOrUndefined(this.parent.quickPopup)) {
            this.parent.quickPopup.hide();
        }
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            var conWrap = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
            var appElement = this.element.querySelector('.e-agenda-item');
            this.elementHeight = appElement ? appElement.offsetHeight : this.elementHeight;
            var index = void 0;
            if (conWrap.scrollTop - this.translateY < 0) {
                index = ~~(conWrap.scrollTop / this.elementHeight);
                this.translateY = conWrap.scrollTop;
                this.setTranslate(conWrap);
                this.beforeInvoke(index);
            }
            else if (conWrap.scrollTop - this.translateY > (this.elementHeight * this.bufferCount)) {
                index = ~~(conWrap.scrollTop / this.elementHeight);
                index = (index > this.itemCount) ? this.itemCount - this.renderedCount : index;
                this.translateY = conWrap.scrollTop;
                if (this.translateY > (this.itemCount * this.elementHeight) - (this.renderedCount * this.elementHeight)) {
                    this.translateY = (this.itemCount * this.elementHeight - (this.renderedCount * this.elementHeight));
                }
                this.setTranslate(conWrap);
                this.beforeInvoke(index);
            }
        }
    };
    Agenda.prototype.beforeInvoke = function (index) {
        var _this = this;
        window.clearTimeout(this.timeValue);
        this.timeValue = window.setTimeout(function () { _this.triggerScrolling(index); }, 100);
    };
    Agenda.prototype.triggerScrolling = function (index) {
        this.parent.dotNetRef.invokeMethodAsync('AgendaScroll', index);
    };
    Agenda.prototype.setTranslate = function (conWrap) {
        sf.base.setStyleAttribute(conWrap.querySelector('table'), { transform: 'translateY(' + this.translateY + 'px)' });
    };
    Agenda.prototype.getEndDateFromStartDate = function (startDate) {
        return resetTime(addDays(startDate, 1));
    };
    Agenda.prototype.onScrollUiUpdate = function () {
        var headerHeight = this.getHeaderBarHeight();
        var contentArea = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        contentArea.style.height = sf.base.formatUnit(this.parent.element.offsetHeight - headerHeight);
    };
    Agenda.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            this.unWireEvents();
            this.element = null;
        }
    };
    return Agenda;
}(ViewBase));

/**
 * Work cell interactions
 */
var WorkCellInteraction = /** @class */ (function () {
    function WorkCellInteraction(parent) {
        this.parent = parent;
    }
    WorkCellInteraction.prototype.cellMouseDown = function (e) {
        if (this.isPreventAction(e)) {
            return;
        }
        this.parent.onCellMouseDown(e);
    };
    WorkCellInteraction.prototype.cellClick = function (e) {
        if (this.isPreventAction(e)) {
            return;
        }
        var queryStr = '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS + ',.' + HEADER_CELLS_CLASS;
        var target = sf.base.closest(e.target, queryStr);
        if (sf.base.isNullOrUndefined(target)) {
            return;
        }
        if (!sf.base.isNullOrUndefined(sf.base.closest(e.target, '.' + NEW_EVENT_CLASS))) {
            var args = sf.base.extend({}, this.parent.activeCellsData, null, true);
            args.startTime = addLocalOffset(args.startTime);
            args.endTime = addLocalOffset(args.endTime);
            this.parent.dotNetRef.invokeMethodAsync('OnOpenEditor', args, 'Add');
            return;
        }
        var navigateEle = sf.base.closest(e.target, '.' + NAVIGATE_CLASS);
        var navigateView = this.parent.getNavigateView();
        var sameView = this.parent.options.currentView === navigateView;
        if (sf.base.isNullOrUndefined(navigateEle) || sameView) {
            //isNullOrUndefined(this.parent.viewOptions[navigateView.charAt(0).toLowerCase() + navigateView.slice(1)])) {
            if (this.parent.activeViewOptions.readonly && this.parent.options.currentView !== 'MonthAgenda') {
                //this.parent.quickPopup.quickPopupHide();
                return;
            }
            if (this.parent.isAdaptive && (e.target.classList.contains(MORE_INDICATOR_CLASS) ||
                sf.base.closest(e.target, '.' + MORE_INDICATOR_CLASS))) {
                return;
            }
            var isWorkCell = target.classList.contains(WORK_CELLS_CLASS) ||
                target.classList.contains(ALLDAY_CELLS_CLASS);
            if (isWorkCell && e.shiftKey && e.which === 1 && this.parent.keyboardInteractionModule) {
                this.parent.keyboardInteractionModule.onMouseSelection(e);
                return;
            }
            this.parent.activeCellsData = this.parent.getCellDetails(target);
            this.parent.currentCell = target;
            var args = sf.base.extend({}, this.parent.activeCellsData, { cancel: false, mouseEventArgs: this.parent.eventBase.getMouseEvent(e), name: 'cellClick' }, true);
            args.startTime = addLocalOffset(args.startTime);
            args.endTime = addLocalOffset(args.endTime);
            this.parent.dotNetRef.invokeMethodAsync('TriggerCellClick', args);
        }
        else {
            var date = this.parent.getDateFromElement(target);
            if (!sf.base.isNullOrUndefined(date) && !this.parent.isAdaptive) {
                var currentDate = new Date(this.parent.getMsFromDate(date));
                this.parent.dotNetRef.invokeMethodAsync('OnViewNavigate', currentDate, this.parent.getNavigateView());
            }
        }
    };
    WorkCellInteraction.prototype.cellDblClick = function (e) {
        if (this.parent.activeViewOptions.readonly || this.isPreventAction(e)) {
            return;
        }
        var args = sf.base.extend({}, this.parent.activeCellsData, { cancel: false, mouseEventArgs: this.parent.eventBase.getMouseEvent(e), name: 'OnCellDoubleClick' }, true);
        args.startTime = addLocalOffset(args.startTime);
        args.endTime = addLocalOffset(args.endTime);
        this.parent.dotNetRef.invokeMethodAsync('OnOpenEditor', args, 'Add');
        // this.parent.trigger(event.cellDoubleClick, args, (clickArgs: CellClickEventArgs) => {
        //     clickArgs = this.serializingData(clickArgs, e);
        //     let date: Date = new Date(clickArgs.startTime.getTime());
        //     if (!this.parent.isMinMaxDate(new Date(date.setHours(0, 0, 0, 0)))) {
        //         return;
        //     }
        //     if (!clickArgs.cancel) {
        //         this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
        //     }
        // });
    };
    WorkCellInteraction.prototype.isPreventAction = function (e) {
        if (sf.base.closest(e.target, '.' + NAVIGATE_CLASS)) {
            return false;
        }
        if (sf.base.closest(e.target, '.' + APPOINTMENT_WRAPPER_CLASS) &&
            !sf.base.closest(e.target, '.' + MORE_INDICATOR_CLASS)) {
            return true;
        }
        var target = sf.base.closest(e.target, '.' + APPOINTMENT_CLASS + ',.' + RESOURCE_GROUP_CELLS_CLASS);
        if (!sf.base.isNullOrUndefined(target)) {
            return true;
        }
        target = sf.base.closest(e.target, '.' + HEADER_CELLS_CLASS);
        if (this.parent.isTimelineView() && !sf.base.isNullOrUndefined(target)) {
            return true;
        }
        return false;
    };
    return WorkCellInteraction;
}());

/**
 * Keyboard interaction
 */
var KeyboardInteraction = /** @class */ (function () {
    function KeyboardInteraction(parent) {
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
            altSeven: 'alt+7',
            altEight: 'alt+8',
            altNine: 'alt+9',
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
        this.keyboardModule = new sf.base.KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }
    KeyboardInteraction.prototype.keyActionHandler = function (e) {
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
                this.parent.dotNetRef.invokeMethodAsync('OnDateNavigate', 'Previous');
                break;
            case 'ctrlRightArrow':
                this.parent.dotNetRef.invokeMethodAsync('OnDateNavigate', 'Next');
                break;
            case 'altOne':
            case 'altTwo':
            case 'altThree':
            case 'altFour':
            case 'altFive':
            case 'altSix':
            case 'altSeven':
            case 'altEight':
            case 'altNine':
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
                this.processDelete();
                break;
            case 'escape':
                this.processEscape();
        }
    };
    KeyboardInteraction.prototype.onCellMouseDown = function (e) {
        if (e.shiftKey) {
            return;
        }
        this.initialTarget = this.getClosestCell(e);
        if (this.parent.activeViewOptions.readonly || this.parent.options.currentView === 'MonthAgenda' || !this.initialTarget) {
            return;
        }
        if (e.target.classList.contains(WORK_CELLS_CLASS) && e.which !== 3) {
            this.parent.removeSelectedClass();
            sf.base.EventHandler.add(this.parent.getContentTable(), 'mousemove', this.onMouseSelection, this);
            sf.base.EventHandler.add(this.parent.getContentTable(), 'mouseup', this.onMoveup, this);
        }
        if (e.target.classList.contains(ALLDAY_CELLS_CLASS) && e.which !== 3) {
            this.parent.removeSelectedClass();
            var allDayRow = this.parent.getAllDayRow();
            sf.base.EventHandler.add(allDayRow, 'mousemove', this.onMouseSelection, this);
            sf.base.EventHandler.add(allDayRow, 'mouseup', this.onMoveup, this);
        }
    };
    KeyboardInteraction.prototype.onMouseSelection = function (e) {
        var appointments = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
        sf.base.addClass(appointments, 'e-allow-select');
        var selectionEdges = this.parent.boundaryValidation(e.pageY, e.pageX);
        if (selectionEdges.bottom || selectionEdges.top || selectionEdges.left || selectionEdges.right) {
            var parent_1 = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
            var yInBounds = parent_1.offsetHeight <= parent_1.scrollHeight && parent_1.scrollTop >= 0 &&
                parent_1.scrollTop + parent_1.offsetHeight <= parent_1.scrollHeight;
            var xInBounds = parent_1.offsetWidth <= parent_1.scrollWidth && parent_1.scrollLeft >= 0 &&
                parent_1.scrollLeft + parent_1.offsetWidth <= parent_1.scrollWidth;
            if (yInBounds && (selectionEdges.top || selectionEdges.bottom)) {
                parent_1.scrollTop += selectionEdges.top ? -e.target.offsetHeight : e.target.offsetHeight;
            }
            if (xInBounds && (selectionEdges.left || selectionEdges.right)) {
                parent_1.scrollLeft += selectionEdges.left ? -e.target.offsetWidth : e.target.offsetWidth;
            }
        }
        var target = this.getClosestCell(e);
        if (target) {
            this.selectCells(true, target);
        }
    };
    KeyboardInteraction.prototype.getClosestCell = function (e) {
        return sf.base.closest(e.target, '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS);
    };
    KeyboardInteraction.prototype.onMoveup = function (e) {
        var appointments = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
        sf.base.removeClass(appointments, 'e-allow-select');
        if (e.target.classList.contains(WORK_CELLS_CLASS)) {
            sf.base.EventHandler.remove(this.parent.getContentTable(), 'mousemove', this.onMouseSelection);
            sf.base.EventHandler.remove(this.parent.getContentTable(), 'mouseup', this.onMoveup);
        }
        if (e.target.classList.contains(ALLDAY_CELLS_CLASS)) {
            var allDayRow = this.parent.getAllDayRow();
            sf.base.EventHandler.remove(allDayRow, 'mousemove', this.onMouseSelection);
            sf.base.EventHandler.remove(allDayRow, 'mouseup', this.onMoveup);
        }
        if (this.isPreventAction(e)) {
            return;
        }
        var queryStr = '.' + WORK_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS + ',.' + HEADER_CELLS_CLASS;
        var target = sf.base.closest(e.target, queryStr);
        this.parent.activeCellsData = this.getSelectedElements(target);
        if (this.parent.options.quickInfoOnSelectionEnd) {
            this.parent.currentCell = target;
            var cellArgs = sf.base.extend(this.parent.activeCellsData, { cancel: false, mouseEventArgs: e, name: 'cellClick' }, true);
            cellArgs.startTime = addLocalOffset(cellArgs.startTime);
            cellArgs.endTime = addLocalOffset(cellArgs.endTime);
            this.parent.dotNetRef.invokeMethodAsync('TriggerCellClick', cellArgs);
        }
    };
    KeyboardInteraction.prototype.processEnter = function (e) {
        if (this.parent.activeViewOptions.readonly || this.isPreventAction(e)) {
            return;
        }
        var target = (e.target);
        if (sf.base.closest(target, '.' + POPUP_WRAPPER_CLASS)) {
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
            this.parent.activeCellsData = this.getSelectedElements(target);
            this.parent.currentCell = target;
            var args = sf.base.extend(this.parent.activeCellsData, { cancel: false, mouseEventArgs: e });
            if (this.parent.options.allowInline) {
                this.parent.inlineModule.cellEdit();
            }
            else {
                args.startTime = addLocalOffset(args.startTime);
                args.endTime = addLocalOffset(args.endTime);
                this.parent.dotNetRef.invokeMethodAsync('TriggerCellClick', args);
            }
            return;
        }
        if (target.classList.contains(INLINE_SUBJECT_CLASS)) {
            this.parent.inlineCrudActions(target);
            return;
        }
        if (target.classList.contains(APPOINTMENT_CLASS) || target.classList.contains(MORE_EVENT_CLOSE_CLASS) ||
            target.classList.contains(ALLDAY_APPOINTMENT_SECTION_CLASS) || target.classList.contains(MORE_INDICATOR_CLASS)) {
            target.click();
            return;
        }
        if (target.classList.contains(MORE_EVENT_HEADER_DATE_CLASS)) {
            // this.parent.setScheduleProperties({ selectedDate: this.parent.getDateFromElement(target) });
            // this.parent.changeView(this.parent.getNavigateView(), e);
            this.processEscape();
            return;
        }
    };
    KeyboardInteraction.prototype.getSelectedElements = function (target) {
        var cellDetails;
        if (this.selectedCells.length > 1 && target.classList.contains(SELECTED_CELL_CLASS)) {
            var start = this.parent.getCellDetails(this.selectedCells[0]);
            var end = this.parent.getCellDetails(this.selectedCells.slice(-1)[0]);
            start.endTime = end.endTime;
            start.element = target;
            cellDetails = start;
        }
        else {
            cellDetails = this.parent.getCellDetails(target);
        }
        return cellDetails;
    };
    KeyboardInteraction.prototype.getCells = function (isInverseTable, start, end) {
        var tableEle = this.parent.getContentTable();
        var cells = [].slice.call(tableEle.querySelectorAll('td'));
        var maxRow = tableEle.rows.length;
        var maxColumn = tableEle.rows[0].cells.length;
        if (start.classList.contains(ALLDAY_CELLS_CLASS)) {
            var allDayRow = this.parent.getAllDayRow();
            cells = [].slice.call(allDayRow.cells);
            maxRow = 1;
            maxColumn = allDayRow.cells.length;
        }
        var startIndex = cells.indexOf(start);
        var endIndex = cells.indexOf(end);
        var inverseCells = [];
        if (isInverseTable) {
            for (var i = 0; i < maxColumn; i++) {
                for (var j = 0; j < maxRow; j++) {
                    inverseCells.push(cells[maxColumn * j + i]);
                }
            }
            startIndex = inverseCells.indexOf(start);
            endIndex = inverseCells.indexOf(end);
        }
        if (startIndex > endIndex) {
            var temp = startIndex;
            startIndex = endIndex;
            endIndex = temp;
        }
        var sCells = isInverseTable ? inverseCells : cells;
        return sCells.slice(startIndex, endIndex + 1);
    };
    KeyboardInteraction.prototype.focusFirstCell = function () {
        if (this.parent.options.currentView === 'Agenda') {
            var focusCell = this.parent.getContentTable().querySelector('.' + AGENDA_CELLS_CLASS);
            focusCell.setAttribute('tabindex', '0');
            focusCell.focus();
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        if (this.parent.isTimelineView()) {
            var cell = this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS +
                ' tr:not(.' + HIDDEN_CLASS + ') .' + WORK_CELLS_CLASS + ':not(.' + RESOURCE_GROUP_CELLS_CLASS + ')');
            this.selectCells(false, cell);
        }
        else {
            this.selectCells(false, this.parent.getWorkCellElements()[0]);
        }
    };
    KeyboardInteraction.prototype.isInverseTableSelect = function () {
        return this.parent.activeView.isInverseTableSelect;
    };
    KeyboardInteraction.prototype.selectCells = function (isMultiple, targetCell) {
        this.parent.removeSelectedClass();
        var target = (targetCell instanceof Array) ? targetCell.slice(-1)[0] : targetCell;
        if (isMultiple) {
            var initialId = void 0;
            var views = ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'];
            if ((!this.parent.options.allowMultiRowSelection) && (views.indexOf(this.parent.options.currentView) > -1)) {
                target = target.parentElement.children[this.initialTarget.cellIndex];
            }
            var selectedCells = this.getCells(this.isInverseTableSelect(), this.initialTarget, target);
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                initialId = this.initialTarget.getAttribute('data-group-index');
                var resourceSelectedCells = [];
                for (var _i = 0, selectedCells_1 = selectedCells; _i < selectedCells_1.length; _i++) {
                    var cell = selectedCells_1[_i];
                    if (cell.getAttribute('data-group-index') === initialId) {
                        resourceSelectedCells.push(cell);
                    }
                }
                selectedCells = resourceSelectedCells;
            }
            if (!this.parent.options.allowMultiCellSelection) {
                selectedCells = [this.initialTarget];
            }
            this.selectedCells = selectedCells;
            if (selectedCells.length > 2 && !target.classList.contains(ALLDAY_CELLS_CLASS)) {
                var allDayCells = this.getAllDayCells(selectedCells);
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    var resourceAllDayCells = [];
                    for (var _a = 0, allDayCells_1 = allDayCells; _a < allDayCells_1.length; _a++) {
                        var cell = allDayCells_1[_a];
                        if (cell.getAttribute('data-group-index') === initialId) {
                            resourceAllDayCells.push(cell);
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
    };
    KeyboardInteraction.prototype.selectAppointment = function (isReverse, target) {
        var appointments = this.getAppointmentElements();
        if (appointments.length < 0) {
            return;
        }
        this.parent.eventBase.removeSelectedAppointmentClass();
        var nextAppEle;
        if (target.classList.contains(APPOINTMENT_CLASS)) {
            var targetIndex = appointments.indexOf(target);
            nextAppEle = appointments[(isReverse ? targetIndex - 1 : targetIndex + 1)];
        }
        else {
            nextAppEle = isReverse ? appointments[appointments.length - 1] : appointments[0];
        }
        if (nextAppEle) {
            this.parent.eventBase.addSelectedAppointments([nextAppEle]);
            nextAppEle.focus();
            sf.base.addClass([nextAppEle], AGENDA_SELECTED_CELL);
        }
    };
    KeyboardInteraction.prototype.selectAppointmentElementFromWorkCell = function (isReverse, target) {
        this.parent.eventBase.removeSelectedAppointmentClass();
        this.parent.removeSelectedClass();
        // if (target.classList.contains(cls.WORK_CELLS_CLASS) || target.classList.contains(cls.ALLDAY_CELLS_CLASS)) {
        //     let appointmentElements: HTMLElement[] = this.getUniqueAppointmentElements();
        //     let filteredElements: HTMLElement[] = [];
        //     let selectedDate: number = this.parent.getDateFromElement(target).getTime();
        //     let selectedSeriesEvents: Object[] = this.parent.eventsProcessed.filter((eventObject: { [key: string]: object }) => {
        //         return (!isReverse ? ((<Date>eventObject[this.parent.eventFields.startTime]).getTime() >= selectedDate) :
        //             ((<Date>eventObject[this.parent.eventFields.startTime]).getTime() <= selectedDate));
        //     });
        //     selectedSeriesEvents.filter((event: { [key: string]: object }) => {
        //         appointmentElements.filter((element: HTMLElement) => {
        //             if (JSON.stringify(event.Guid) === JSON.stringify(element.getAttribute('data-guid'))) {
        //                 filteredElements.push(element);
        //             }
        //         });
        //     });
        //     if (filteredElements.length > 0) {
        //         let selectedElement: Element = isReverse ? filteredElements[filteredElements.length - 1] : filteredElements[0];
        //         let focusElements: HTMLElement[] = this.getAppointmentElementsByGuid(selectedElement.getAttribute('data-guid'));
        //         this.parent.eventBase.addSelectedAppointments(focusElements);
        //         (focusElements[focusElements.length - 1]).focus();
        //     }
        // }
    };
    KeyboardInteraction.prototype.getAllDayCells = function (cells) {
        var allDayRow = this.parent.getAllDayRow();
        if (!allDayRow) {
            return [];
        }
        var startCell = cells[0];
        var endCell = cells[cells.length - 1];
        var start = this.parent.getCellDetails(startCell);
        var end = this.parent.getCellDetails(endCell);
        if (end.endTime.getTime() - start.startTime.getTime() >= MS_PER_DAY) {
            var allDayCells = [].slice.call(allDayRow.cells);
            return allDayCells.slice(startCell.cellIndex, endCell.cellIndex + 1);
        }
        return [];
    };
    KeyboardInteraction.prototype.getAppointmentElements = function () {
        return [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
    };
    KeyboardInteraction.prototype.getAppointmentElementsByGuid = function (guid) {
        return [].slice.call(this.parent.element.querySelectorAll('div[data-guid="' + guid + '"]'));
    };
    KeyboardInteraction.prototype.getUniqueAppointmentElements = function () {
        var appointments = this.getAppointmentElements();
        var appointmentElements = [];
        appointments.map(function (value) { return value.getAttribute('data-guid'); }).filter(function (value, index, self) {
            if (self.indexOf(value) === index) {
                appointmentElements.push(appointments[index]);
            }
        });
        return appointmentElements;
    };
    KeyboardInteraction.prototype.getWorkCellFromAppointmentElement = function (target) {
        // let selectedObject: Object = this.parent.eventBase.getEventByGuid(target.getAttribute('data-guid'));
        // return this.parent.eventBase.selectWorkCellByTime([selectedObject]) as HTMLTableCellElement;
        return null;
    };
    KeyboardInteraction.prototype.processViewNavigation = function (e) {
        var index = parseInt(e.key, 10) - 1;
        var views = [].slice.call(this.parent.element.querySelectorAll('.e-schedule-toolbar .e-toolbar-item.e-views'));
        if (index < views.length) {
            views[index].click();
        }
    };
    KeyboardInteraction.prototype.processUp = function (e, isMultiple) {
        if ((isMultiple && (this.parent.isTimelineView() || this.parent.options.currentView === 'MonthAgenda'))) {
            return;
        }
        var target = (e.target);
        var selectedElements = this.parent.getSelectedElements();
        var selectedEventElements = this.parent.eventBase.getSelectedAppointments();
        var moreEventWrapper = this.parent.element.querySelector('.' + MORE_POPUP_WRAPPER_CLASS);
        var quickPopupWrapper = this.getQuickPopupElement();
        if (selectedElements.length > 0 && !e.target.classList.contains(WORK_CELLS_CLASS)) {
            target = selectedElements[selectedElements.length - 1];
        }
        if (selectedEventElements.length > 0 && !moreEventWrapper.classList.contains(POPUP_OPEN) &&
            !quickPopupWrapper.classList.contains(POPUP_OPEN) &&
            ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.parent.options.currentView) !== -1) {
            target = this.getWorkCellFromAppointmentElement(selectedEventElements[selectedEventElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        if (!target) {
            return;
        }
        if (target.classList.contains(WORK_CELLS_CLASS) && !this.parent.element.querySelector('.' + POPUP_OPEN)) {
            var tableRows = this.parent.getTableRows();
            var curRowIndex = tableRows.indexOf(target.parentElement);
            if (curRowIndex > 0 && curRowIndex < tableRows.length) {
                this.selectCells(isMultiple, (tableRows[curRowIndex - 1]).cells[target.cellIndex]);
            }
        }
        else if (this.parent.options.currentView === 'Agenda' || this.parent.options.currentView === 'MonthAgenda') {
            this.selectAppointment(true, target);
        }
    };
    KeyboardInteraction.prototype.processDown = function (e, isMultiple) {
        if (isMultiple && (this.parent.isTimelineView() || this.parent.options.currentView === 'MonthAgenda')) {
            return;
        }
        var target = (e.target);
        var selectedCells = this.parent.getSelectedElements();
        var selectedElements = this.parent.eventBase.getSelectedAppointments();
        var moreEventWrapper = this.parent.element.querySelector('.' + MORE_POPUP_WRAPPER_CLASS);
        var quickPopupWrapper = this.getQuickPopupElement();
        if (selectedCells.length > 0 && !e.target.classList.contains(WORK_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
        }
        if (selectedElements.length > 0 && !moreEventWrapper.classList.contains(POPUP_OPEN) &&
            !quickPopupWrapper.classList.contains(POPUP_OPEN) &&
            ['Day', 'Week', 'WorkWeek', 'Month'].indexOf(this.parent.options.currentView) !== -1) {
            target = this.getWorkCellFromAppointmentElement(selectedElements[selectedElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
        }
        var tableRows = this.parent.getTableRows();
        if (!target) {
            return;
        }
        if (target.classList.contains(WORK_CELLS_CLASS) && !this.parent.element.querySelector('.' + POPUP_OPEN)) {
            var curRowIndex = tableRows.indexOf(target.parentElement);
            if (curRowIndex >= 0 && curRowIndex < tableRows.length - 1) {
                this.selectCells(isMultiple, (tableRows[curRowIndex + 1]).cells[target.cellIndex]);
            }
        }
        else if (this.parent.options.currentView === 'Agenda' || this.parent.options.currentView === 'MonthAgenda') {
            this.selectAppointment(false, target);
        }
    };
    KeyboardInteraction.prototype.processLeftRight = function (target) {
        var tableEle = this.parent.getContentTable();
        var curRowIndex = target.parentNode.sectionRowIndex;
        var key = {
            element: tableEle,
            rowIndex: curRowIndex,
            columnIndex: target.cellIndex,
            maxIndex: tableEle.rows[curRowIndex].cells.length
        };
        return key;
    };
    KeyboardInteraction.prototype.getQuickPopupElement = function () {
        return (this.parent.isAdaptive ? document.body : this.parent.element).querySelector('.' + POPUP_WRAPPER_CLASS);
    };
    KeyboardInteraction.prototype.isCancelLeftRightAction = function (e, isMultiple) {
        if (this.parent.options.currentView === 'Agenda' || (isMultiple && this.parent.options.currentView === 'MonthAgenda')) {
            return true;
        }
        if (this.isPreventAction(e) && isMultiple) {
            return true;
        }
        var moreEventWrapper = this.parent.element.querySelector('.' + MORE_POPUP_WRAPPER_CLASS);
        var quickPopupWrapper = this.getQuickPopupElement();
        if (moreEventWrapper.classList.contains(POPUP_OPEN) || quickPopupWrapper.classList.contains(POPUP_OPEN)) {
            return true;
        }
        return false;
    };
    KeyboardInteraction.prototype.processRight = function (e, isMultiple) {
        if (this.isCancelLeftRightAction(e, isMultiple)) {
            return;
        }
        var selectedCells = this.parent.getSelectedElements();
        var targetCell;
        var selectedAppointments = this.parent.eventBase.getSelectedAppointments();
        var target = (e.target);
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
        if (target.classList.contains(WORK_CELLS_CLASS) &&
            (e.target).classList.contains(WORK_CELLS_CLASS)) {
            var key = this.processLeftRight(target);
            if (key.columnIndex >= 0 && key.columnIndex < key.maxIndex - 1) {
                targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex].cells[target.cellIndex + 1], 'right');
                if (!sf.base.isNullOrUndefined(targetCell)) {
                    this.selectCells(isMultiple, targetCell);
                }
            }
            else if (key.columnIndex === key.maxIndex - 1) {
                if (!this.isInverseTableSelect() && key.rowIndex < key.element.rows.length - 1) {
                    targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex + 1].cells[0], 'right');
                    if (!sf.base.isNullOrUndefined(targetCell)) {
                        this.selectCells(isMultiple, targetCell);
                    }
                }
                else if (!isMultiple) {
                    var rowIndex = this.isInverseTableSelect() ? key.rowIndex : 0;
                    // this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                    // let tableEle: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
                    // this.selectCells(false, tableEle.rows[rowIndex].cells[0]);
                }
            }
        }
        else if (target.classList.contains(ALLDAY_CELLS_CLASS)) {
            var curColIndex = target.cellIndex;
            var allDayRow = this.parent.getAllDayRow();
            var maxColIndex = allDayRow.cells.length;
            if (curColIndex >= 0 && curColIndex < maxColIndex - 1) {
                this.selectCells(isMultiple, allDayRow.cells[curColIndex + 1]);
            }
            else if (curColIndex === maxColIndex - 1 && !isMultiple) {
                // this.parent.changeDate(this.parent.activeView.getNextPreviousDate('next'), e);
                // let allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
                // this.selectCells(false, allDayRow.cells[0]);
            }
        }
    };
    KeyboardInteraction.prototype.processLeft = function (e, isMultiple) {
        if (this.isCancelLeftRightAction(e, isMultiple)) {
            return;
        }
        var target = (e.target);
        var selectedCells = this.parent.getSelectedElements();
        var targetCell;
        if (selectedCells.length > 0 && !target.classList.contains(WORK_CELLS_CLASS) &&
            !target.classList.contains(ALLDAY_CELLS_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
        }
        var selectedElements = this.parent.eventBase.getSelectedAppointments();
        if (selectedElements.length > 0) {
            target = this.getWorkCellFromAppointmentElement(selectedElements[selectedElements.length - 1]);
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!target) {
                return;
            }
        }
        if ((e.target).classList.contains(WORK_CELLS_CLASS) &&
            target.classList.contains(WORK_CELLS_CLASS)) {
            var key = this.processLeftRight(target);
            if (key.columnIndex > 0 && key.columnIndex < key.maxIndex) {
                targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex].cells[target.cellIndex - 1], 'left');
                if (!sf.base.isNullOrUndefined(targetCell)) {
                    this.selectCells(isMultiple, targetCell);
                }
            }
            else if (key.columnIndex === 0) {
                if (!this.isInverseTableSelect() && key.rowIndex > 0) {
                    targetCell = this.calculateNextPrevDate(target, key.element.rows[key.rowIndex - 1].cells[key.maxIndex - 1], 'left');
                    if (!sf.base.isNullOrUndefined(targetCell)) {
                        this.selectCells(isMultiple, targetCell);
                    }
                }
                else if (!isMultiple) {
                    // this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                    // let tableEle: HTMLTableElement = this.parent.getContentTable() as HTMLTableElement;
                    // let rowIndex: number = this.isInverseTableSelect() ? key.rowIndex : tableEle.rows.length - 1;
                    // this.selectCells(false, tableEle.rows[rowIndex].cells[key.maxIndex - 1]);
                }
            }
        }
        else if (target.classList.contains(ALLDAY_CELLS_CLASS)) {
            var curColIndex = target.cellIndex;
            var allDayRow = this.parent.getAllDayRow();
            var maxColIndex = allDayRow.cells.length;
            if (curColIndex > 0 && curColIndex < maxColIndex) {
                this.selectCells(isMultiple, allDayRow.cells[curColIndex - 1]);
            }
            else if (curColIndex === 0 && !isMultiple) {
                // this.parent.changeDate(this.parent.activeView.getNextPreviousDate('previous'), e);
                // let allDayRow: HTMLTableRowElement = <HTMLTableRowElement>this.parent.getAllDayRow();
                // this.selectCells(false, allDayRow.cells[maxColIndex - 1]);
            }
        }
    };
    KeyboardInteraction.prototype.calculateNextPrevDate = function (currentCell, target, type) {
        var initialId = this.initialTarget.getAttribute('data-group-index');
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.options.currentView === 'Month') {
            if (currentCell && target && target.getAttribute('data-group-index') !== initialId) {
                var currentDate = this.parent.getDateFromElement(currentCell);
                var nextPrevDate = (type === 'right') ? new Date(currentDate.setDate(currentDate.getDate() + 1))
                    : new Date(currentDate.setDate(currentDate.getDate() - 1));
                target = [].slice.call(this.parent.element.querySelectorAll('td[data-date="'
                    + this.parent.getMsFromDate(nextPrevDate).toString() + '"]' + '[data-group-index="' + initialId + '"]'))[0];
            }
        }
        return target;
    };
    KeyboardInteraction.prototype.getFocusableElements = function (container) {
        var queryString = 'a[href]:not([tabindex="-1"]),input:not([disabled]):not([tabindex="-1"]),' +
            'textarea:not([disabled]):not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"]),' +
            'select:not([disabled]):not([tabindex="-1"]),[tabindex]:not([tabindex="-1"]),[contentEditable=true]:not([tabindex="-1"])';
        return [].slice.call(container.querySelectorAll(queryString));
    };
    KeyboardInteraction.prototype.processTabOnPopup = function (e, popupElement) {
        var _this = this;
        var focusableElements = this.getFocusableElements(popupElement);
        focusableElements = focusableElements.filter(function (element) {
            var footerEle = _this.parent.element.querySelector('.' + POPUP_FOOTER_CLASS);
            if (footerEle && footerEle.offsetParent) {
                return !(element.classList.contains(EDIT_CLASS) || element.classList.contains(DELETE_CLASS));
            }
            else {
                return !(element.classList.contains(EDIT_EVENT_CLASS) || element.classList.contains(DELETE_EVENT_CLASS));
            }
        });
        var firstEle = focusableElements[0];
        var lastEle = focusableElements[focusableElements.length - 1];
        if (!sf.base.isNullOrUndefined(lastEle) && document.activeElement === lastEle && !e.shiftKey) {
            e.preventDefault();
            firstEle.focus();
        }
        if (!sf.base.isNullOrUndefined(firstEle) && document.activeElement === firstEle && e.shiftKey) {
            e.preventDefault();
            lastEle.focus();
        }
    };
    KeyboardInteraction.prototype.processTab = function (e, isReverse) {
        var target = e.target;
        var popupWrapper = sf.base.closest(target, '.' + POPUP_WRAPPER_CLASS + ',.' + MORE_POPUP_WRAPPER_CLASS);
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
            var appointments = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CLASS));
            var selectedAppointments = this.parent.eventBase.getSelectedAppointments();
            if (selectedAppointments.length > 0) {
                target = selectedAppointments[selectedAppointments.length - 1];
            }
            this.parent.eventBase.removeSelectedAppointmentClass();
            if (!isReverse && target.getAttribute('data-guid') === appointments[appointments.length - 1].getAttribute('data-guid') ||
                isReverse && target.getAttribute('data-guid') === appointments[0].getAttribute('data-guid')) {
                return;
            }
            if (this.parent.options.currentView === 'Agenda' || this.parent.options.currentView === 'MonthAgenda') {
                this.selectAppointment(isReverse, target);
                e.preventDefault();
            }
            return;
        }
        var selectedCells = this.parent.getSelectedElements();
        if (selectedCells.length > 0 && !target.classList.contains(APPOINTMENT_CLASS)) {
            target = selectedCells[selectedCells.length - 1];
            this.selectAppointmentElementFromWorkCell(isReverse, target);
            e.preventDefault();
            return;
        }
    };
    KeyboardInteraction.prototype.processDelete = function () {
        var activeEle = document.activeElement;
        if (this.parent.options.currentView === 'MonthAgenda') {
            var selectedEle = this.parent.eventBase.getSelectedEvents().element;
            activeEle = ((selectedEle && sf.base.isNullOrUndefined(selectedEle.length)) ? selectedEle : selectedEle[0]);
        }
        if (activeEle && activeEle.classList.contains(APPOINTMENT_CLASS)) {
            sf.base.addClass([activeEle], APPOINTMENT_BORDER);
            this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
            if (this.parent.activeViewOptions.readonly || activeEle.classList.contains(READ_ONLY)) {
                return;
            }
            this.parent.dotNetRef.invokeMethodAsync('ProcessDelete', this.parent.activeEventData.guid);
        }
    };
    KeyboardInteraction.prototype.processEscape = function () {
        this.parent.onClosePopup();
        this.parent.onMoreEventPopupClose();
        if (this.parent.headerPopup) {
            this.parent.headerPopup.hide();
        }
        if (this.parent.inlineModule) {
            this.parent.inlineModule.removeInlineAppointmentElement();
        }
    };
    KeyboardInteraction.prototype.isPreventAction = function (e) {
        var target = sf.base.closest(e.target, '.' + RESOURCE_GROUP_CELLS_CLASS);
        if (this.parent.isTimelineView() && !sf.base.isNullOrUndefined(target)) {
            return true;
        }
        return false;
    };
    KeyboardInteraction.prototype.destroy = function () {
        this.keyboardModule.destroy();
    };
    return KeyboardInteraction;
}());

/**
 * Base class for the common drag and resize related actions
 */
var ActionBase = /** @class */ (function () {
    function ActionBase(parent) {
        this.daysVariation = 0;
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
    ActionBase.prototype.calculateIntervalTime = function (date) {
        var intervalTime = new Date(+date);
        intervalTime.setMinutes(Math.floor(intervalTime.getMinutes() / this.actionObj.interval) * this.actionObj.interval);
        return intervalTime;
    };
    ActionBase.prototype.getContentAreaDimension = function () {
        var viewElement = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var trElement = [].slice.call(viewElement.querySelector('tr').children);
        if (!this.parent.isTimelineView() && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.isAdaptive) {
            trElement = this.getResourceElements(trElement);
        }
        var leftOffset = trElement[0].getBoundingClientRect();
        var rightOffset = trElement.slice(-1)[0].getBoundingClientRect();
        var viewDimension = {
            bottom: viewElement.scrollHeight - 5,
            left: this.parent.options.enableRtl ? rightOffset.left : leftOffset.left,
            right: this.parent.options.enableRtl ? leftOffset.right : rightOffset.right,
            top: 0
        };
        return viewDimension;
    };
    ActionBase.prototype.getPageCoordinates = function (e) {
        var eventArgs = e.event;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            eventArgs || e;
    };
    ActionBase.prototype.getIndex = function (index) {
        var contentElements = [].slice.call(this.parent.getContentTable().querySelector('tr').children);
        var indexes = { minIndex: 0, maxIndex: contentElements.length - 1 };
        if (this.actionObj.action === 'resize' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive && !this.parent.isTimelineView()) {
            var groupElements = this.getResourceElements(contentElements);
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
    };
    ActionBase.prototype.updateTimePosition = function (date) {
        for (var _i = 0, _a = this.actionObj.cloneElement; _i < _a.length; _i++) {
            var cloneElement = _a[_i];
            var timeElement = cloneElement.querySelector('.' + APPOINTMENT_TIME);
            if (timeElement) {
                timeElement.innerHTML = this.parent.getTimeString(this.actionObj.start) + ' - ' +
                    this.parent.getTimeString(this.actionObj.end);
            }
        }
        if (!this.parent.activeViewOptions.timeScale.enable || !this.parent.isAdaptive || this.parent.options.currentView === 'Month' ||
            this.parent.options.currentView === 'TimelineMonth') {
            return;
        }
        var timeIndicator = this.parent.element.querySelector('.' + CLONE_TIME_INDICATOR_CLASS);
        if (!timeIndicator) {
            timeIndicator = sf.base.createElement('div', { className: CLONE_TIME_INDICATOR_CLASS });
            var wrapperClass = this.parent.isTimelineView() ? DATE_HEADER_WRAP_CLASS : TIME_CELLS_WRAP_CLASS;
            this.parent.element.querySelector('.' + wrapperClass).appendChild(timeIndicator);
        }
        timeIndicator.innerHTML = this.parent.getTimeString(date);
        var offsetValue = 0;
        if (this.parent.isTimelineView()) {
            if (this.parent.options.enableRtl) {
                var rightValue = parseInt(this.actionObj.clone.style.right, 10);
                offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.left ?
                    rightValue + this.actionObj.clone.offsetWidth : rightValue;
                timeIndicator.style.right = sf.base.formatUnit(offsetValue);
            }
            else {
                var leftValue = parseInt(this.actionObj.clone.style.left, 10);
                offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.left ?
                    leftValue : leftValue + this.actionObj.clone.offsetWidth;
                timeIndicator.style.left = sf.base.formatUnit(offsetValue);
            }
        }
        else {
            offsetValue = this.actionObj.action === 'drag' || this.resizeEdges.top ? this.actionObj.clone.offsetTop :
                this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight;
            timeIndicator.style.top = sf.base.formatUnit(offsetValue);
        }
    };
    ActionBase.prototype.getResourceElements = function (table) {
        var _this = this;
        return table.filter(function (element) {
            return parseInt(element.getAttribute('data-group-index'), 10) === _this.actionObj.groupIndex;
        });
    };
    ActionBase.prototype.getOriginalElement = function (element) {
        var originalElement;
        var guid = element.getAttribute('data-guid');
        var isMorePopup = element.offsetParent && element.offsetParent.classList.contains(MORE_EVENT_POPUP_CLASS);
        if (isMorePopup || this.parent.isTimelineView()) {
            originalElement = [].slice.call(this.parent.element.querySelectorAll('[data-guid="' + guid + '"]'));
        }
        else {
            var tr = sf.base.closest(element, 'tr');
            originalElement = [].slice.call(tr.querySelectorAll('[data-guid="' + guid + '"]'));
        }
        return originalElement;
    };
    ActionBase.prototype.createCloneElement = function (element) {
        var cloneWrapper = sf.base.createElement('div', { innerHTML: element.outerHTML });
        var cloneElement = cloneWrapper.children[0];
        var cloneClassLists = [CLONE_ELEMENT_CLASS];
        cloneClassLists.push((this.actionObj.action === 'drag') ? DRAG_CLONE_CLASS : RESIZE_CLONE_CLASS);
        if (this.parent.options.currentView === 'Month' || this.parent.options.currentView === 'TimelineMonth' ||
            (!this.parent.isTimelineView() && !this.parent.activeViewOptions.timeScale.enable)) {
            cloneClassLists.push(MONTH_CLONE_ELEMENT_CLASS);
        }
        sf.base.addClass([cloneElement], cloneClassLists);
        sf.base.addClass([element], EVENT_ACTION_CLASS);
        if (!sf.base.isNullOrUndefined(element.parentElement)) {
            element.parentElement.appendChild(cloneElement);
        }
        cloneElement.style.width = sf.base.formatUnit(cloneElement.offsetWidth - 2);
        if (this.parent.options.eventDragArea && this.actionObj.action === 'drag') {
            document.querySelector(this.parent.options.eventDragArea).appendChild(cloneElement);
        }
        sf.base.setStyleAttribute(cloneElement, { border: '0px' });
        if (element.style.backgroundColor !== '') {
            sf.base.setStyleAttribute(cloneElement, { backgroundColor: element.style.backgroundColor });
        }
        return cloneElement;
    };
    ActionBase.prototype.removeCloneElementClasses = function () {
        var elements = this.actionObj.originalElement;
        if (this.parent.options.currentView === 'Month' || this.parent.options.currentView === 'TimelineYear' ||
            (!this.parent.isTimelineView() && !this.parent.activeViewOptions.timeScale.enable)) {
            elements = [].slice.call(this.parent.element.querySelectorAll('.' + EVENT_ACTION_CLASS));
        }
        sf.base.removeClass(elements, EVENT_ACTION_CLASS);
    };
    ActionBase.prototype.removeCloneElement = function () {
        this.actionObj.originalElement = [];
        for (var _i = 0, _a = this.actionObj.cloneElement; _i < _a.length; _i++) {
            var cloneElement = _a[_i];
            if (!sf.base.isNullOrUndefined(cloneElement.parentNode)) {
                sf.base.remove(cloneElement);
            }
        }
        this.actionObj.cloneElement = [];
        var timeIndicator = this.parent.element.querySelector('.' + CLONE_TIME_INDICATOR_CLASS);
        if (timeIndicator) {
            sf.base.remove(timeIndicator);
        }
    };
    ActionBase.prototype.getCursorElement = function (e) {
        var pages = this.getPageCoordinates(e);
        return document.elementFromPoint(pages.clientX, pages.clientY);
    };
    ActionBase.prototype.autoScroll = function () {
        var parent = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var yIsScrollable = parent.offsetHeight <= parent.scrollHeight;
        var xIsScrollable = parent.offsetWidth <= parent.scrollWidth;
        var yInBounds = yIsScrollable && parent.scrollTop >= 0 && parent.scrollTop + parent.offsetHeight <= parent.scrollHeight;
        var xInBounds = xIsScrollable && parent.scrollLeft >= 0 && parent.scrollLeft + parent.offsetWidth <= parent.scrollWidth;
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
    };
    ActionBase.prototype.autoScrollValidation = function (e) {
        if (!this.actionObj.scroll.enable) {
            return false;
        }
        var res = this.parent.boundaryValidation(this.actionObj.pageY, this.actionObj.pageX);
        this.scrollEdges = res;
        return res.bottom || res.top || res.left || res.right;
    };
    ActionBase.prototype.actionClass = function (type) {
        if (type === 'addClass') {
            sf.base.addClass([this.parent.element], EVENT_ACTION_CLASS);
        }
        else {
            sf.base.removeClass([this.parent.element], EVENT_ACTION_CLASS);
        }
    };
    ActionBase.prototype.updateScrollPosition = function (e) {
        var _this = this;
        if (this.actionObj.scroll.enable && sf.base.isNullOrUndefined(this.actionObj.scrollInterval)) {
            this.actionObj.scrollInterval = window.setInterval(function () {
                if (_this.autoScrollValidation(e) && !_this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                    if (_this.parent.isTimelineView() && _this.parent.activeViewOptions.group.resources.length > 0
                        && _this.actionObj.groupIndex < 0) {
                        return;
                    }
                    _this.autoScroll();
                    if (_this.actionObj.action === 'drag') {
                        //this.parent.dragAndDropModule.updateDraggingDateTime(e);
                    }
                    else {
                        //this.parent.resizeModule.updateResizingDirection(e);
                    }
                }
            }, this.actionObj.scroll.timeDelay);
        }
    };
    ActionBase.prototype.updateOriginalElement = function (cloneElement) {
        var query = '[data-id="' + cloneElement.getAttribute('data-id') + '"]';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            query = query.concat('[data-group-index = "' + cloneElement.getAttribute('data-group-index') + '"]');
        }
        var elements = [].slice.call(this.parent.element.querySelectorAll(query));
        sf.base.addClass(elements, EVENT_ACTION_CLASS);
        var eventWrappers = [].slice.call(this.parent.element.querySelectorAll('.' + CLONE_ELEMENT_CLASS));
        sf.base.removeClass(eventWrappers, EVENT_ACTION_CLASS);
    };
    ActionBase.prototype.getUpdatedEvent = function (startTime, endTime, eventObj) {
        var event = JSON.parse(JSON.stringify(eventObj));
        event.startTime = startTime;
        event.endTime = endTime;
        return event;
    };
    ActionBase.prototype.dynamicYearlyEventsRendering = function (event, isResize) {
        if (isResize === void 0) { isResize = false; }
        var appWidth = this.actionObj.cellWidth - 7;
        if (isResize && (this.resizeEdges.left || this.resizeEdges.right)) {
            appWidth = this.actionObj.cellWidth * event.count;
        }
        var appointmentElement = this.createAppointmentElement(event, this.actionObj.groupIndex, true);
        appointmentElement.setAttribute('drag', 'true');
        sf.base.addClass([appointmentElement], CLONE_ELEMENT_CLASS);
        sf.base.setStyleAttribute(appointmentElement, {
            'width': appWidth + 'px', 'border': '0px', 'pointer-events': 'none',
            'position': 'absolute', 'overflow': 'hidden', 'padding': '3px'
        });
        if (this.actionObj.clone.style.backgroundColor !== '') {
            sf.base.setStyleAttribute(appointmentElement, { 'backgroundColor': this.actionObj.clone.style.backgroundColor });
        }
        var date = addLocalOffset(resetTime(event.startTime)).getTime();
        var query = '.' + WORK_CELLS_CLASS + '[data-date="' + date + '"]';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            query = '.' + WORK_CELLS_CLASS + '[data-date="' + date + '"][data-group-index="' + this.actionObj.groupIndex + '"]';
        }
        var cellTd = this.parent.element.querySelector(query);
        if (isResize) {
            var appHeight = this.actionObj.cellHeight * event.count -
                (cellTd.querySelector('.' + DATE_HEADER_CLASS).offsetHeight) - 7;
            if (this.resizeEdges.right || this.resizeEdges.left) {
                appHeight = parseInt(this.actionObj.clone.style.height, 10);
            }
            sf.base.setStyleAttribute(appointmentElement, { 'height': appHeight + 'px' });
        }
        this.renderElement(cellTd, appointmentElement, true);
        this.actionObj.cloneElement.push(cellTd.querySelector('.' + APPOINTMENT_WRAPPER_CLASS));
    };
    ActionBase.prototype.dynamicEventsRendering = function (event) {
        var dateRender = this.parent.activeView.renderDates;
        var workCells = [].slice.call(this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS));
        var workDays = this.parent.activeViewOptions.workDays;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            var elementSelector = "." + WORK_CELLS_CLASS + "[data-group-index=\"" + this.actionObj.groupIndex + "\"]";
            workCells = [].slice.call(this.parent.element.querySelectorAll(elementSelector));
            var rowsCount = workCells[0].querySelectorAll('[data-group-index="' + this.actionObj.groupIndex + '"]').length;
            var index = 0;
            for (var _i = 0, workCells_1 = workCells; _i < workCells_1.length; _i++) {
                var workCell = workCells_1[_i];
                dateRender.push(new Date(workCell.getAttribute('data-date')));
                if (index < rowsCount) {
                    workDays.push(dateRender[index].getDay());
                    index++;
                }
            }
        }
        this.monthEvent.dateRender = dateRender;
        this.monthEvent.getSlotDates(workDays);
        var eventWrappers = [].slice.call(this.parent.element.querySelectorAll('.' + CLONE_ELEMENT_CLASS));
        for (var _a = 0, eventWrappers_1 = eventWrappers; _a < eventWrappers_1.length; _a++) {
            var wrapper = eventWrappers_1[_a];
            sf.base.remove(wrapper);
        }
        var splittedEvents = this.monthEvent.splitEvent(event, dateRender);
        for (var _b = 0, splittedEvents_1 = splittedEvents; _b < splittedEvents_1.length; _b++) {
            var event_1 = splittedEvents_1[_b];
            var day = this.parent.getIndexOfDate(dateRender, resetTime(event_1.startTime));
            var diffInDays = event_1.data.count;
            var appWidth = (diffInDays * this.actionObj.cellWidth) - 7;
            var appointmentElement = this.createAppointmentElement(event_1, this.actionObj.groupIndex, true);
            appointmentElement.setAttribute('drag', 'true');
            sf.base.addClass([appointmentElement], CLONE_ELEMENT_CLASS);
            //this.monthEvent.applyResourceColor(appointmentElement, event, 'backgroundColor', groupOrder);
            sf.base.setStyleAttribute(appointmentElement, {
                'width': appWidth + 'px', 'border': '0px', 'pointer-events': 'none'
            });
            if (this.actionObj.clone.style.backgroundColor !== '') {
                sf.base.setStyleAttribute(appointmentElement, { 'backgroundColor': this.actionObj.clone.style.backgroundColor });
            }
            var cellTd = workCells[day];
            this.renderElement(cellTd, appointmentElement, true);
            this.actionObj.cloneElement.push(appointmentElement);
        }
    };
    ActionBase.prototype.getReadonlyAttribute = function (element) {
        return element.getAttribute('aria-readonly');
    };
    ActionBase.prototype.createAppointmentElement = function (record, resIndex, isCloneElement) {
        if (isCloneElement === void 0) { isCloneElement = false; }
        var appointmentWrapper = sf.base.createElement('div', {
            className: APPOINTMENT_CLASS,
            innerHTML: this.cloneEventDetail.outerHTML
        });
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            appointmentWrapper.setAttribute('data-group-index', resIndex.toString());
        }
        //this.renderResizeHandler(appointmentWrapper, record.data as { [key: string]: Object }, 
        // record[this.fields.isReadonly] as boolean);
        return appointmentWrapper;
    };
    ActionBase.prototype.renderElement = function (cellTd, element, isAppointment) {
        if (isAppointment === void 0) { isAppointment = false; }
        if (cellTd.querySelector('.' + APPOINTMENT_WRAPPER_CLASS)) {
            cellTd.querySelector('.' + APPOINTMENT_WRAPPER_CLASS).appendChild(element);
        }
        else {
            var wrapper = sf.base.createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            wrapper.appendChild(element);
            cellTd.appendChild(wrapper);
        }
    };
    ActionBase.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.actionObj = {};
        this.scrollArgs = {};
        this.resizeEdges = { left: false, right: false, top: false, bottom: false };
        this.scrollEdges = { left: false, right: false, top: false, bottom: false };
    };
    return ActionBase;
}());

var __extends$9 = (undefined && undefined.__extends) || (function () {
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
 * Schedule events resize actions
 */
var Resize = /** @class */ (function (_super) {
    __extends$9(Resize, _super);
    function Resize() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Resize.prototype.wireResizeEvent = function (element) {
        var resizeElement = [].slice.call(element.querySelectorAll('.' + EVENT_RESIZE_CLASS));
        for (var _i = 0, resizeElement_1 = resizeElement; _i < resizeElement_1.length; _i++) {
            var element_1 = resizeElement_1[_i];
            sf.base.EventHandler.clearEvents(element_1);
            sf.base.EventHandler.add(element_1, sf.base.Browser.touchStartEvent, this.resizeStart, this);
        }
    };
    Resize.prototype.resizeHelper = function () {
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.activeViewOptions.group.allowGroupEdit) {
            for (var i = 0, len = this.actionObj.originalElement.length; i < len; i++) {
                var cloneElement = this.createCloneElement(this.actionObj.originalElement[i]);
                this.actionObj.cloneElement[i] = cloneElement;
                if (this.actionObj.element === this.actionObj.originalElement[i]) {
                    this.actionObj.clone = cloneElement;
                }
            }
        }
        else {
            this.actionObj.clone = this.createCloneElement(this.actionObj.element);
            this.actionObj.cloneElement = [this.actionObj.clone];
            this.actionObj.originalElement = [this.actionObj.element];
        }
    };
    Resize.prototype.resizeStart = function (e) {
        var _this = this;
        this.actionObj.action = 'resize';
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        var resizeTarget = sf.base.closest(e.target, '.' + EVENT_RESIZE_CLASS);
        this.actionObj.element = sf.base.closest(resizeTarget, '.' + APPOINTMENT_CLASS);
        // this.actionObj.event = this.parent.eventBase.getEventByGuid(this.actionObj.element.getAttribute('data-guid')) as
        //     { [key: string]: Object };
        var dataGuid = this.actionObj.element.getAttribute('data-guid');
        var resizeArgs = {
            cancel: false,
            //data: eventObj,
            //event: e,
            //element: this.actionObj.element,
            interval: this.actionObj.interval,
            scroll: { enable: true, scrollBy: 30, timeDelay: 100 }
        };
        var args = JSON.stringify(resizeArgs);
        // tslint:disable-next-line:no-any
        this.parent.dotNetRef.invokeMethodAsync('OnResizeStart', args, dataGuid).then(function (dataObj) {
            var resizeEventArgs = dataObj.resizeEventArgs;
            _this.actionObj.event = sf.base.extend({}, dataObj, null, true);
            delete (_this.actionObj.event.resizeEventArgs);
            _this.actionObj.event.startTime = new Date(_this.actionObj.event.startTime);
            _this.actionObj.event.endTime = new Date(_this.actionObj.event.endTime);
            var eventObj = sf.base.extend({}, _this.actionObj.event, null, true);
            if (resizeEventArgs.cancel) {
                return;
            }
            _this.actionClass('addClass');
            _this.parent.uiStateValues.action = true;
            _this.resizeEdges = {
                left: resizeTarget.classList.contains(LEFT_RESIZE_HANDLER),
                right: resizeTarget.classList.contains(RIGHT_RESIZE_HANDLER),
                top: resizeTarget.classList.contains(TOP_RESIZE_HANDLER),
                bottom: resizeTarget.classList.contains(BOTTOM_RESIZE_HANDLER)
            };
            _this.actionObj.groupIndex = _this.parent.uiStateValues.isGroupAdaptive ? _this.parent.uiStateValues.groupIndex : 0;
            var workCell = _this.parent.element.querySelector('.' + WORK_CELLS_CLASS);
            _this.actionObj.cellWidth = workCell.offsetWidth;
            _this.actionObj.cellHeight = workCell.offsetHeight;
            var headerRows = _this.parent.activeViewOptions.headerRows.map(function (row) {
                return row.option;
            });
            if (_this.parent.isTimelineView() && headerRows.length > 0 &&
                ['Date', 'Hour'].indexOf(headerRows.slice(-1)[0]) < 0) {
                var tr = _this.parent.getContentTable().querySelector('tr');
                var noOfDays = 0;
                var tdCollections = [].slice.call(tr.children);
                for (var _i = 0, tdCollections_1 = tdCollections; _i < tdCollections_1.length; _i++) {
                    var td = tdCollections_1[_i];
                    noOfDays += parseInt(td.getAttribute('colspan'), 10);
                }
                _this.actionObj.cellWidth = tr.offsetWidth / noOfDays;
                _this.actionObj.cellHeight = tr.offsetHeight;
            }
            var pages = _this.getPageCoordinates(e);
            _this.actionObj.X = pages.pageX;
            _this.actionObj.Y = pages.pageY;
            _this.actionObj.groupIndex = parseInt(_this.actionObj.element.getAttribute('data-group-index') || '0', 10);
            _this.actionObj.interval = resizeEventArgs.interval;
            _this.actionObj.scroll = resizeEventArgs.scroll;
            _this.actionObj.start = eventObj.startTime;
            _this.actionObj.end = eventObj.endTime;
            _this.actionObj.originalElement = _this.getOriginalElement(_this.actionObj.element);
            if (_this.parent.options.currentView === 'Month' || _this.parent.options.currentView === 'TimelineYear' ||
                (!_this.parent.isTimelineView() && !_this.parent.activeViewOptions.timeScale.enable)) {
                _this.daysVariation = -1;
                _this.cloneEventDetail = _this.actionObj.element.querySelector('.e-appointment-details');
                if (_this.parent.options.currentView !== 'TimelineYear') {
                    _this.monthEvent = new MonthEvent(_this.parent);
                }
            }
            var viewElement = _this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
            _this.scrollArgs = { element: viewElement, width: viewElement.scrollWidth, height: viewElement.scrollHeight };
            sf.base.EventHandler.add(document, sf.base.Browser.touchMoveEvent, _this.resizing, _this);
            sf.base.EventHandler.add(document, sf.base.Browser.touchEndEvent, _this.resizeStop, _this);
        });
    };
    Resize.prototype.resizing = function (e) {
        //this.parent.quickPopup.quickPopupHide();
        if (this.parent.element.querySelectorAll('.' + RESIZE_CLONE_CLASS).length === 0) {
            this.resizeHelper();
        }
        if ((!sf.base.isNullOrUndefined(e.target)) && e.target.classList.contains(DISABLE_DATES)) {
            return;
        }
        var pages = this.getPageCoordinates(e);
        if (this.parent.options.currentView === 'Month' || this.parent.options.currentView === 'TimelineYear') {
            var doc = document.documentElement;
            var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            var top_1 = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            this.actionObj.pageX = pages.pageX - left;
            this.actionObj.pageY = pages.pageY - top_1;
        }
        else {
            this.actionObj.pageX = pages.pageX;
            this.actionObj.pageY = pages.pageY;
        }
        this.updateScrollPosition(e);
        this.updateResizingDirection(e);
    };
    Resize.prototype.updateResizingDirection = function (e) {
        if (this.parent.options.currentView === 'Month' || this.parent.options.currentView === 'TimelineYear' ||
            (!this.parent.isTimelineView() && !this.parent.activeViewOptions.timeScale.enable)) {
            this.monthResizing();
            return;
        }
        var resizeValidation = this.resizeValidation(e);
        if (this.resizeEdges.left) {
            if (resizeValidation) {
                var leftStyles = this.getLeftRightStyles(e, true);
                for (var _i = 0, _a = this.actionObj.cloneElement; _i < _a.length; _i++) {
                    var cloneElement = _a[_i];
                    sf.base.setStyleAttribute(cloneElement, leftStyles);
                    sf.base.addClass([cloneElement], LEFT_RESIZE_HANDLER);
                }
            }
            this.horizontalResizing(!this.parent.options.enableRtl);
        }
        if (this.resizeEdges.right) {
            if (resizeValidation) {
                var rightStyles = this.getLeftRightStyles(e, false);
                for (var _b = 0, _c = this.actionObj.cloneElement; _b < _c.length; _b++) {
                    var cloneElement = _c[_b];
                    sf.base.setStyleAttribute(cloneElement, rightStyles);
                    sf.base.addClass([cloneElement], RIGHT_RESIZE_HANDLER);
                }
            }
            this.horizontalResizing(this.parent.options.enableRtl);
        }
        if (this.resizeEdges.top) {
            if (resizeValidation) {
                var topStyles = this.getTopBottomStyles(e, true);
                for (var _d = 0, _e = this.actionObj.cloneElement; _d < _e.length; _d++) {
                    var cloneElement = _e[_d];
                    sf.base.setStyleAttribute(cloneElement, topStyles);
                    sf.base.addClass([cloneElement], TOP_RESIZE_HANDLER);
                }
            }
            this.verticalResizing(true);
        }
        if (this.resizeEdges.bottom) {
            if (resizeValidation) {
                var bottomStyles = this.getTopBottomStyles(e, false);
                for (var _f = 0, _g = this.actionObj.cloneElement; _f < _g.length; _f++) {
                    var cloneElement = _g[_f];
                    sf.base.setStyleAttribute(cloneElement, bottomStyles);
                    sf.base.addClass([cloneElement], BOTTOM_RESIZE_HANDLER);
                }
            }
            this.verticalResizing(false);
        }
    };
    Resize.prototype.monthResizing = function () {
        this.removeCloneElement();
        var td = document.elementFromPoint(this.actionObj.pageX, this.actionObj.pageY);
        if (sf.base.isNullOrUndefined(td)) {
            return;
        }
        var resizeTime = this.parent.getDateFromElement(td);
        var isSameCell = this.parent.activeViewOptions.group.resources.length > 0 ?
            parseInt(td.getAttribute('data-group-index'), 10) === this.actionObj.groupIndex : true;
        var startTime = this.actionObj.event.startTime;
        var endTime = this.actionObj.event.endTime;
        if ((!this.parent.options.enableRtl && this.resizeEdges.left) || (this.parent.options.enableRtl && this.resizeEdges.right)
            || this.resizeEdges.top) {
            startTime = resizeTime;
        }
        else if ((!this.parent.options.enableRtl && this.resizeEdges.right) || (this.parent.options.enableRtl && this.resizeEdges.left)
            || this.resizeEdges.bottom) {
            endTime = addDays(resizeTime, 1);
        }
        if (isSameCell && startTime < endTime) {
            this.actionObj.start = startTime;
            this.actionObj.end = endTime;
            var event_1 = this.getUpdatedEvent(this.actionObj.start, this.actionObj.end, this.actionObj.event);
            if (this.parent.options.currentView === 'TimelineYear') {
                this.yearEventsRendering(event_1);
            }
            else {
                this.dynamicEventsRendering(event_1);
            }
            this.updateOriginalElement(this.actionObj.clone);
        }
        else {
            if (this.parent.options.currentView === 'TimelineYear') {
                var eventWrappers = [].slice.call(this.parent.element.querySelectorAll('.' + CLONE_ELEMENT_CLASS));
                for (var _i = 0, eventWrappers_1 = eventWrappers; _i < eventWrappers_1.length; _i++) {
                    var wrapper = eventWrappers_1[_i];
                    this.actionObj.cloneElement.push(wrapper);
                }
            }
        }
    };
    Resize.prototype.yearEventsRendering = function (event) {
        var eventWrappers = [].slice.call(this.parent.element.querySelectorAll('.' + CLONE_ELEMENT_CLASS));
        for (var _i = 0, eventWrappers_2 = eventWrappers; _i < eventWrappers_2.length; _i++) {
            var wrapper = eventWrappers_2[_i];
            sf.base.remove(wrapper);
        }
        var endDate = new Date(event.endTime);
        var monthDiff = 0;
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            monthDiff = this.getMonthDiff(event.startTime, addDays(endDate, -1));
        }
        for (var i = 0; i <= monthDiff; i++) {
            var eventObj = void 0;
            if (this.parent.activeViewOptions.group.resources.length === 0) {
                eventObj = this.getEventCount(event, this.actionObj.start.getMonth() + i);
            }
            else {
                eventObj = sf.base.extend({}, event, null, true);
                endDate = this.resizeEdges.left || this.resizeEdges.right ? addDays(endDate, -1) : endDate;
                eventObj.count = this.getMonthDiff(event.startTime, endDate) + (this.resizeEdges.top ? 0 : 1);
            }
            this.dynamicYearlyEventsRendering(eventObj, true);
        }
    };
    Resize.prototype.getMonthDiff = function (startDate, endDate) {
        var months;
        months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months -= startDate.getMonth();
        months += endDate.getMonth();
        return months <= 0 ? 0 : months;
    };
    Resize.prototype.getEventCount = function (eventObj, month) {
        var monthStart = new Date(this.parent.options.selectedDate.getFullYear(), month, 1);
        var monthEnd = addDays(new Date(this.parent.options.selectedDate.getFullYear(), month + 1, 0), 1);
        var eventData = sf.base.extend({}, eventObj, null, true);
        var eventStart = eventData.startTime;
        var eventEnd = eventData.endTime;
        var count = 1;
        if (eventStart.getTime() < monthStart.getTime()) {
            eventData.startTime = monthStart;
        }
        if (eventEnd.getTime() > monthEnd.getTime()) {
            eventData.endTime = monthEnd;
        }
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            count = Math.ceil((eventData.endTime.getTime() -
                eventData.startTime.getTime()) / MS_PER_DAY);
        }
        eventData.count = count;
        return eventData;
    };
    Resize.prototype.resizeStop = function () {
        sf.base.EventHandler.remove(document, sf.base.Browser.touchMoveEvent, this.resizing);
        sf.base.EventHandler.remove(document, sf.base.Browser.touchEndEvent, this.resizeStop);
        clearInterval(this.actionObj.scrollInterval);
        this.actionObj.scrollInterval = null;
        this.removeCloneElementClasses();
        this.removeCloneElement();
        this.actionClass('removeClass');
        this.parent.uiStateValues.action = false;
        var eventGuid = this.actionObj.element.getAttribute('data-guid');
        var startTime = addLocalOffset(this.actionObj.start);
        var endTime = addLocalOffset(this.actionObj.end);
        // tslint:disable-next-line:no-any
        this.parent.dotNetRef.invokeMethodAsync('OnResizeStop', startTime, endTime, eventGuid);
    };
    Resize.prototype.verticalResizing = function (isTop) {
        var offsetValue = this.actionObj.clone.offsetTop;
        if (!isTop) {
            offsetValue += this.actionObj.clone.offsetHeight;
        }
        var minutes = (offsetValue / this.actionObj.cellHeight) * this.actionObj.slotInterval;
        var element = this.actionObj.clone.offsetParent;
        if (sf.base.isNullOrUndefined(element)) {
            return;
        }
        var resizeTime = resetTime(this.parent.getDateFromElement(element));
        resizeTime.setHours(this.parent.activeView.getStartHour().getHours());
        resizeTime.setMinutes(minutes + this.parent.activeView.getStartHour().getMinutes());
        if (isTop) {
            this.actionObj.start = this.calculateIntervalTime(resizeTime);
        }
        else {
            this.actionObj.end = this.calculateIntervalTime(resizeTime);
        }
        this.updateTimePosition(resizeTime);
    };
    Resize.prototype.horizontalResizing = function (isLeft) {
        var eventStart = this.actionObj.event.startTime;
        var eventEnd = this.actionObj.event.endTime;
        var resizeTime;
        if (this.parent.isTimelineView()) {
            var tr = this.parent.getContentTable().querySelector('tr');
            var headerName = this.parent.options.currentView;
            if (this.parent.activeViewOptions.headerRows.length > 0) {
                var rows = this.parent.activeViewOptions.headerRows.map(function (row) { return row.option; });
                headerName = rows.slice(-1)[0];
                if (this.parent.options.currentView === 'TimelineMonth' && headerName === 'Hour') {
                    headerName = rows.slice(-2)[0] || 'Month';
                }
            }
            resizeTime = isLeft ? eventStart : eventEnd;
            var cellIndex = 0;
            var tdCollections = [].slice.call(tr.children);
            var isLastCell = false;
            if (['Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1) {
                var noOfDays = 0;
                for (var _i = 0, tdCollections_2 = tdCollections; _i < tdCollections_2.length; _i++) {
                    var td = tdCollections_2[_i];
                    noOfDays += parseInt(td.getAttribute('colspan'), 10);
                }
                var offsetValue = this.parent.options.enableRtl ? parseInt(this.actionObj.clone.style.right, 10) :
                    parseInt(this.actionObj.clone.style.left, 10);
                if (!isLeft) {
                    offsetValue += (this.actionObj.clone.offsetWidth - this.actionObj.cellWidth);
                }
                cellIndex = Math.floor(offsetValue / Math.floor(tr.offsetWidth / noOfDays));
                cellIndex = isLeft ? cellIndex : this.parent.options.currentView === 'TimelineMonth' ? cellIndex + 1 : cellIndex;
                isLastCell = cellIndex === tdCollections.length;
                cellIndex = (cellIndex < 0) ? 0 : (cellIndex >= noOfDays) ? noOfDays - 1 : cellIndex;
            }
            else {
                var cellWidth = this.actionObj.cellWidth;
                cellIndex = isLeft ? Math.floor(this.actionObj.clone.offsetLeft / this.actionObj.cellWidth) :
                    Math.ceil((this.actionObj.clone.offsetLeft + (this.actionObj.clone.offsetWidth - cellWidth)) /
                        this.actionObj.cellWidth);
                if (this.parent.options.enableRtl) {
                    var cellOffsetWidth = 0;
                    if (headerName === 'TimelineMonth' || (!this.parent.activeViewOptions.timeScale.enable &&
                        this.parent.options.currentView !== 'TimelineMonth')) {
                        cellOffsetWidth = this.actionObj.cellWidth;
                    }
                    var offsetWidth = (Math.floor(parseInt(this.actionObj.clone.style.right, 10) / this.actionObj.cellWidth) *
                        this.actionObj.cellWidth) + (isLeft ? 0 : this.actionObj.clone.offsetWidth - cellOffsetWidth);
                    cellIndex = Math.floor(offsetWidth / this.actionObj.cellWidth);
                }
                isLastCell = cellIndex === tdCollections.length;
                cellIndex = this.getIndex(cellIndex);
            }
            var resizeDate = void 0;
            if (['Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1) {
                resizeDate = new Date(this.parent.activeView.renderDates[cellIndex].getTime());
            }
            else {
                resizeDate = this.parent.getDateFromElement(tr.children[cellIndex]);
            }
            if (['TimelineMonth', 'Year', 'Month', 'Week', 'Date'].indexOf(headerName) !== -1 ||
                !this.parent.activeViewOptions.timeScale.enable) {
                resizeTime = new Date(resizeDate.setHours(resizeTime.getHours(), resizeTime.getMinutes(), resizeTime.getSeconds()));
            }
            else {
                var offsetValue = this.parent.options.enableRtl ? parseFloat(this.actionObj.clone.style.right) :
                    parseFloat(this.actionObj.clone.style.left);
                if (!isLeft) {
                    offsetValue += this.actionObj.clone.offsetWidth;
                }
                var spanMinutes = Math.ceil((this.actionObj.slotInterval / this.actionObj.cellWidth) *
                    (offsetValue - Math.floor(offsetValue / this.actionObj.cellWidth) * this.actionObj.cellWidth));
                spanMinutes = (isLastCell || (!isLeft && spanMinutes === 0)) ? this.actionObj.slotInterval : spanMinutes;
                resizeTime = new Date(resizeDate.getTime());
                resizeTime.setMinutes(resizeTime.getMinutes() + spanMinutes);
                this.updateTimePosition(resizeTime);
            }
        }
        else {
            var cloneIndex = sf.base.closest(this.actionObj.clone, 'td').cellIndex;
            var originalWidth = Math.ceil((isLeft ? this.actionObj.element.offsetWidth : 0) / this.actionObj.cellWidth) *
                this.actionObj.cellWidth;
            var noOfDays = Math.ceil((this.actionObj.clone.offsetWidth - originalWidth) / this.actionObj.cellWidth);
            var tr = sf.base.closest(this.actionObj.clone, 'tr');
            var dayIndex = isLeft ? cloneIndex - noOfDays : cloneIndex + noOfDays - 1;
            dayIndex = this.getIndex(dayIndex);
            resizeTime = this.parent.getDateFromElement(tr.children[dayIndex]);
            if (isLeft) {
                resizeTime.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            }
            else {
                resizeTime.setHours(eventEnd.getHours(), eventEnd.getMinutes(), eventEnd.getSeconds());
            }
        }
        if (isLeft) {
            if ((this.actionObj.event.endTime.getTime() - resizeTime.getTime()) <= 0) {
                resizeTime = new Date(this.actionObj.event.startTime.getTime());
            }
            this.actionObj.start = this.parent.activeViewOptions.timeScale.enable ? this.calculateIntervalTime(resizeTime) : resizeTime;
        }
        else {
            var isTimeViews = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'].indexOf(this.parent.options.currentView) > -1 &&
                this.parent.activeViewOptions.timeScale.enable;
            var resizeEnd = (!isTimeViews && resizeTime.getHours() === 0 && resizeTime.getMinutes() === 0) ?
                addDays(resizeTime, 1) : resizeTime;
            this.actionObj.end = this.parent.activeViewOptions.timeScale.enable && this.parent.options.currentView !== 'Month' ?
                this.calculateIntervalTime(resizeEnd) : resizeEnd;
        }
    };
    Resize.prototype.getTopBottomStyles = function (e, isTop) {
        var viewElement = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var slotInterval = (this.actionObj.cellHeight / this.actionObj.slotInterval) * this.actionObj.interval;
        var clnHeight = isTop ? this.actionObj.element.offsetHeight + (this.actionObj.Y - this.actionObj.pageY) :
            this.actionObj.element.offsetHeight + (this.actionObj.pageY - this.actionObj.Y);
        var clnTop = isTop ? this.actionObj.element.offsetTop -
            (this.actionObj.Y - this.actionObj.pageY) : this.actionObj.clone.offsetTop;
        clnHeight = (clnTop < 0) ? this.actionObj.clone.offsetHeight :
            (this.actionObj.clone.offsetTop + this.actionObj.clone.offsetHeight) > this.scrollArgs.height ?
                this.actionObj.clone.offsetHeight : clnHeight;
        clnTop = (clnTop < 0) ? 0 : clnTop;
        clnTop = Math.floor(clnTop / slotInterval) * slotInterval;
        clnHeight = clnTop + clnHeight >= viewElement.scrollHeight ? viewElement.scrollHeight - clnTop :
            Math.ceil(clnHeight / slotInterval) * slotInterval;
        var styles = {
            height: sf.base.formatUnit(clnHeight < this.actionObj.cellHeight ? this.actionObj.cellHeight : clnHeight),
            top: sf.base.formatUnit((clnHeight < this.actionObj.cellHeight && isTop) ? this.actionObj.clone.offsetTop : clnTop),
            left: '0px', right: '0px', width: '100%'
        };
        return styles;
    };
    Resize.prototype.getLeftRightStyles = function (e, isLeft) {
        var styles = {};
        var isTimelineView = this.parent.isTimelineView();
        var isTimeViews = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'].indexOf(this.parent.options.currentView) > -1 &&
            this.parent.activeViewOptions.timeScale.enable;
        var slotInterval = (this.actionObj.cellWidth / this.actionObj.slotInterval) * this.actionObj.interval;
        var pageWidth = isLeft ? (this.actionObj.X - this.actionObj.pageX) : (this.actionObj.pageX - this.actionObj.X);
        var targetWidth = isTimelineView ?
            (this.actionObj.element.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth :
            this.parent.options.currentView === 'Month' ||
                (!this.parent.isTimelineView() && !this.parent.activeViewOptions.timeScale.enable) ? this.actionObj.element.offsetWidth :
                Math.ceil(this.actionObj.element.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        var offsetWidth = targetWidth + (Math.ceil(pageWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth);
        var left = (this.parent.options.enableRtl) ? parseInt(this.actionObj.element.style.right, 10) :
            this.actionObj.clone.offsetLeft;
        if (isTimeViews) {
            offsetWidth = targetWidth + (Math.ceil(pageWidth / slotInterval) * slotInterval);
            offsetWidth = (Math.ceil((left + offsetWidth) / slotInterval) * slotInterval) - left;
            this.actionObj.event.isAllDay = false;
        }
        var width = !isLeft && ((offsetWidth + this.actionObj.clone.offsetLeft > this.scrollArgs.width)) ?
            this.actionObj.clone.offsetWidth : (offsetWidth < this.actionObj.cellWidth) ? this.actionObj.cellWidth : offsetWidth;
        if (this.parent.options.enableRtl) {
            var rightValue = isTimelineView ? parseInt(this.actionObj.element.style.right, 10) :
                -(offsetWidth - this.actionObj.cellWidth);
            rightValue = isTimelineView ? rightValue : isLeft ? 0 : rightValue > 0 ? 0 : rightValue;
            if (isTimelineView && !isLeft) {
                rightValue = Math.ceil((this.actionObj.element.offsetLeft + (this.actionObj.element.offsetWidth +
                    (this.actionObj.pageX - this.actionObj.X))) / slotInterval) * slotInterval;
                rightValue = rightValue < 0 ? Math.abs(rightValue) : -rightValue;
            }
            rightValue = rightValue >= this.scrollArgs.width ? this.scrollArgs.width - this.actionObj.cellWidth : rightValue;
            styles.right = sf.base.formatUnit(rightValue);
            width = width + rightValue > this.scrollArgs.width ? this.actionObj.clone.offsetWidth : width;
        }
        else {
            var offsetLeft = isLeft ? this.actionObj.element.offsetLeft - (this.actionObj.X - this.actionObj.pageX) :
                this.parent.options.enableRtl ? this.actionObj.element.offsetLeft : 0;
            if (isTimelineView) {
                offsetLeft = isLeft ? offsetLeft : parseInt(this.actionObj.clone.style.left, 10);
                if (this.parent.options.enableRtl) {
                    offsetLeft = !isLeft ? (this.actionObj.pageX < this.actionObj.X - this.actionObj.clone.offsetWidth) ?
                        parseInt(this.actionObj.clone.style.right, 10) : offsetLeft : offsetLeft;
                }
                else {
                    offsetLeft = isLeft ? (this.actionObj.pageX > this.actionObj.X + this.actionObj.clone.offsetWidth &&
                        this.actionObj.clone.offsetWidth === this.actionObj.cellWidth) ?
                        parseInt(this.actionObj.clone.style.left, 10) : offsetLeft : offsetLeft;
                }
            }
            var leftValue = offsetLeft;
            offsetLeft = isTimelineView ? isTimeViews ? isLeft ? Math.floor(offsetLeft / slotInterval) * slotInterval : offsetLeft :
                Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth :
                Math.ceil(Math.abs(offsetLeft) / this.actionObj.cellWidth) * this.actionObj.cellWidth;
            if (offsetLeft < 0) {
                offsetLeft = 0;
                width = this.actionObj.clone.offsetWidth;
            }
            var cloneWidth = Math.ceil(this.actionObj.clone.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth;
            if (isLeft) {
                styles.left = sf.base.formatUnit(isTimelineView ? offsetLeft : isLeft ? leftValue < 0 ? -offsetLeft :
                    (Math.ceil((targetWidth - cloneWidth) / this.actionObj.cellWidth) * this.actionObj.cellWidth) : offsetLeft);
            }
        }
        styles.width = sf.base.formatUnit(width);
        return styles;
    };
    Resize.prototype.resizeValidation = function (e) {
        var pages = this.getPageCoordinates(e);
        var viewDimension = this.getContentAreaDimension();
        var resizeValidation = false;
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
    };
    return Resize;
}(ActionBase));

var __extends$10 = (undefined && undefined.__extends) || (function () {
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
var MINUTES_PER_DAY = 1440;
/**
 * Schedule events drag actions
 */
var DragAndDrop = /** @class */ (function (_super) {
    __extends$10(DragAndDrop, _super);
    function DragAndDrop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.widthUptoCursorPoint = 0;
        _this.heightUptoCursorPoint = 0;
        _this.cursorPointIndex = 0;
        _this.isHeaderRows = false;
        _this.isTimelineDayProcess = false;
        _this.widthPerMinute = 0;
        _this.heightPerMinute = 0;
        _this.minDiff = 0;
        _this.isStepDragging = false;
        _this.isMorePopupOpened = false;
        _this.isAllDayDrag = false;
        return _this;
    }
    DragAndDrop.prototype.wireDragEvent = function (element) {
        if (element.ej2_instances) {
            var dragInstance = [].slice.call(element.ej2_instances);
            dragInstance.forEach(function (instance) { return instance.destroy(); });
        }
        var dragObj = new sf.base.Draggable(element, {
            abort: '.' + EVENT_RESIZE_CLASS,
            clone: true,
            isDragScroll: true,
            enableTapHold: this.parent.isAdaptive,
            enableTailMode: (this.parent.options.eventDragArea) ? true : false,
            cursorAt: (this.parent.options.eventDragArea) ? { left: -20, top: -20 } : { left: 0, top: 0 },
            dragArea: (this.parent.options.eventDragArea) ?
                document.querySelector(this.parent.options.eventDragArea) :
                this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS),
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
            queryPositionInfo: this.dragPosition.bind(this)
        });
        if (!(dragObj.enableTapHold && sf.base.Browser.isDevice && sf.base.Browser.isTouch)) {
            // tslint:disable-next-line:no-any
            sf.base.EventHandler.remove(element, 'touchstart', dragObj.initialize);
        }
    };
    DragAndDrop.prototype.dragHelper = function (e) {
        this.setDragActionDefaultValues();
        this.actionObj.element = e.element;
        this.actionObj.action = 'drag';
        this.actionObj.clone = this.createCloneElement(this.actionObj.element);
        if (!this.parent.options.eventDragArea && this.parent.options.currentView !== 'Month' &&
            this.parent.activeViewOptions.timeScale.enable && !this.parent.isTimelineView() &&
            !this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
            sf.base.setStyleAttribute(this.actionObj.clone, { cursor: 'move', left: '0%', right: '0%', width: '100%' });
        }
        this.actionObj.clone.style.top = sf.base.formatUnit(this.actionObj.element.offsetTop);
        this.actionObj.cloneElement = [this.actionObj.clone];
        this.actionObj.originalElement = [this.actionObj.element];
        return this.actionObj.clone;
    };
    DragAndDrop.prototype.dragPosition = function (e) {
        if (this.parent.options.eventDragArea) {
            return { left: e.left, top: e.top };
        }
        var cellHeight = (this.actionObj.cellHeight / this.actionObj.slotInterval) * this.actionObj.interval;
        var leftValue = sf.base.formatUnit(0);
        if (this.parent.isTimelineView() || this.parent.options.currentView === 'Month' ||
            (!this.parent.isTimelineView() && !this.parent.activeViewOptions.timeScale.enable)) {
            leftValue = sf.base.formatUnit(this.actionObj.clone.offsetLeft);
        }
        var topValue;
        if ((this.parent.options.currentView === 'Month' || this.parent.isTimelineView() ||
            !this.parent.activeViewOptions.timeScale.enable ||
            (!sf.base.isNullOrUndefined(this.actionObj.clone.offsetParent) &&
                this.actionObj.clone.offsetParent.classList.contains(MORE_EVENT_POPUP_CLASS)))) {
            topValue = sf.base.formatUnit(this.actionObj.clone.offsetTop);
        }
        else if (this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
            topValue = sf.base.formatUnit(this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS).offsetTop);
            sf.base.setStyleAttribute(this.actionObj.clone, {
                width: sf.base.formatUnit(Math.ceil(this.actionObj.clone.offsetWidth / this.actionObj.cellWidth) * this.actionObj.cellWidth),
                right: this.parent.options.enableRtl && sf.base.formatUnit(0)
            });
        }
        else {
            if (this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS) &&
                !this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                sf.base.setStyleAttribute(this.actionObj.clone, {
                    height: sf.base.formatUnit(this.actionObj.cellHeight),
                    width: sf.base.formatUnit(this.actionObj.cellWidth - 1),
                    pointerEvents: 'none'
                });
            }
            var top_1 = parseInt(e.top, 10);
            top_1 = top_1 < 0 ? 0 : top_1;
            topValue = sf.base.formatUnit(Math.ceil(top_1 / cellHeight) * cellHeight);
            var scrollHeight = this.parent.element.querySelector('.e-content-wrap').scrollHeight;
            var cloneBottom = parseInt(topValue, 10) + this.actionObj.clone.offsetHeight;
            if (cloneBottom > scrollHeight) {
                topValue = (parseInt(topValue, 10) - (cloneBottom - scrollHeight)) + 'px';
            }
        }
        return { left: leftValue, top: topValue };
    };
    DragAndDrop.prototype.setDragActionDefaultValues = function () {
        this.actionObj.action = 'drag';
        this.actionObj.isAllDay = null;
        this.actionObj.slotInterval = this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
        this.actionObj.interval = this.actionObj.slotInterval;
        var workCell = this.parent.element.querySelector('.' + WORK_CELLS_CLASS);
        this.actionObj.cellWidth = workCell.offsetWidth;
        this.actionObj.cellHeight = workCell.offsetHeight;
    };
    DragAndDrop.prototype.dragStart = function (e) {
        var _this = this;
        var eventGuid = this.actionObj.element.getAttribute('data-guid');
        var dragArgs = {
            cancel: false,
            //data: eventObj,
            //event: e,
            excludeSelectors: null,
            //element: this.actionObj.element,
            interval: this.actionObj.interval,
            navigation: { enable: false, timeDelay: 2000 },
            scroll: { enable: true, scrollBy: 30, timeDelay: 100 }
        };
        var args = JSON.stringify(dragArgs);
        // tslint:disable-next-line:no-any
        this.parent.dotNetRef.invokeMethodAsync('OnDragStart', args, eventGuid).then(function (dragData) {
            var dragEventArgs = dragData.dragEventArgs;
            _this.actionObj.isAllDay = dragData.isAllDay;
            _this.actionObj.event = sf.base.extend({}, dragData, null, true);
            delete (_this.actionObj.event.dragEventArgs);
            _this.actionObj.event.startTime = new Date(_this.actionObj.event.startTime);
            _this.actionObj.event.endTime = new Date(_this.actionObj.event.endTime);
            var eventObj = sf.base.extend({}, _this.actionObj.event, null, true);
            if (dragEventArgs.cancel || (!sf.base.isNullOrUndefined(_this.actionObj.element) &&
                sf.base.isNullOrUndefined(_this.actionObj.element.parentElement))) {
                var dragObj = _this.actionObj.element.ej2_instances[0];
                if (!sf.base.isNullOrUndefined(dragObj)) {
                    dragObj.intDestroy(e.event);
                }
                _this.actionObj.action = '';
                _this.removeCloneElementClasses();
                _this.removeCloneElement();
                return;
            }
            else {
                e.bindEvents(e.dragElement);
            }
            _this.actionClass('addClass');
            _this.parent.uiStateValues.action = true;
            _this.actionObj.start = eventObj.startTime;
            _this.actionObj.end = eventObj.endTime;
            _this.actionObj.groupIndex = parseInt(_this.actionObj.element.getAttribute('data-group-index') || '0', 10);
            _this.actionObj.interval = dragEventArgs.interval;
            _this.actionObj.navigation = dragEventArgs.navigation;
            _this.actionObj.scroll = dragEventArgs.scroll;
            _this.actionObj.excludeSelectors = dragEventArgs.excludeSelectors;
            var viewElement = _this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
            _this.scrollArgs = { element: viewElement, width: viewElement.scrollWidth, height: viewElement.scrollHeight };
            _this.widthPerMinute = (_this.actionObj.cellWidth / _this.actionObj.slotInterval) * _this.actionObj.interval;
            _this.heightPerMinute = (_this.actionObj.cellHeight / _this.actionObj.slotInterval) * _this.actionObj.interval;
            _this.widthUptoCursorPoint = 0;
            _this.heightUptoCursorPoint = 0;
            _this.cursorPointIndex = -1;
            _this.isHeaderRows = false;
            _this.isTimelineDayProcess = false;
            _this.minDiff = 0;
            _this.isMorePopupOpened = false;
            _this.daysVariation = -1;
            if ((_this.parent.isTimelineView() || !_this.parent.activeViewOptions.timeScale.enable)) {
                if (!sf.base.isNullOrUndefined(_this.actionObj.clone.offsetParent) &&
                    _this.actionObj.clone.offsetParent.classList.contains(MORE_EVENT_POPUP_CLASS)) {
                    _this.isMorePopupOpened = true;
                }
                var rows = _this.parent.activeViewOptions.headerRows;
                _this.isHeaderRows = rows.length > 0 && rows[rows.length - 1].option !== 'Hour' &&
                    rows[rows.length - 1].option !== 'Date';
                _this.isTimelineDayProcess = !_this.parent.activeViewOptions.timeScale.enable || _this.isHeaderRows ||
                    _this.parent.options.currentView === 'TimelineMonth' || (rows.length > 0 && rows[rows.length - 1].option === 'Date');
                _this.isStepDragging = !_this.isTimelineDayProcess && (_this.actionObj.slotInterval !== _this.actionObj.interval);
                if (_this.isTimelineDayProcess) {
                    _this.timelineEventModule = new TimelineEvent(_this.parent, 'day');
                }
                else {
                    _this.timelineEventModule = new TimelineEvent(_this.parent, 'hour');
                }
            }
            if (_this.parent.options.currentView === 'Month' || _this.parent.options.currentView === 'TimelineYear' ||
                (!_this.parent.isTimelineView() && !_this.parent.activeViewOptions.timeScale.enable)) {
                _this.updateOriginalElement(_this.actionObj.clone);
                _this.cloneEventDetail = _this.actionObj.clone.querySelector('.e-appointment-details');
                _this.monthEvent = new MonthEvent(_this.parent);
            }
            if (_this.parent.options.currentView === 'Day' || _this.parent.options.currentView === 'Week' ||
                _this.parent.options.currentView === 'WorkWeek') {
                _this.verticalEvent = new VerticalEvent(_this.parent);
            }
        });
    };
    DragAndDrop.prototype.drag = function (e) {
        this.parent.onQuickPopupClose();
        if ((!sf.base.isNullOrUndefined(e.target)) && e.target.classList.contains(DISABLE_DATES)) {
            return;
        }
        var eventObj = sf.base.extend({}, this.actionObj.event, null, true);
        var eventArgs = this.getPageCoordinates(e);
        this.actionObj.Y = this.actionObj.pageY = eventArgs.pageY;
        this.actionObj.X = this.actionObj.pageX = eventArgs.pageX;
        this.actionObj.target = e.target;
        this.widthUptoCursorPoint = (this.widthUptoCursorPoint === 0) ?
            Math.ceil((Math.abs(this.actionObj.clone.getBoundingClientRect().left - this.actionObj.X) / this.widthPerMinute)) *
                this.widthPerMinute : this.widthUptoCursorPoint;
        this.widthUptoCursorPoint = this.isMorePopupOpened ? this.actionObj.cellWidth : this.widthUptoCursorPoint;
        this.heightUptoCursorPoint = (this.heightUptoCursorPoint === 0) ?
            Math.ceil((Math.abs(this.actionObj.clone.getBoundingClientRect().top - this.actionObj.Y) / this.heightPerMinute)) *
                this.heightPerMinute : this.heightUptoCursorPoint;
        this.isAllDayDrag = (this.parent.activeViewOptions.timeScale.enable) ?
            this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS) :
            this.actionObj.event.isAllDay;
        if (this.isStepDragging && this.minDiff === 0) {
            this.calculateMinutesDiff(eventObj);
        }
        if ((this.parent.options.currentView === 'Month' || this.isAllDayDrag) && this.daysVariation < 0) {
            var date = this.parent.getDateFromElement(this.actionObj.target);
            if (!sf.base.isNullOrUndefined(date)) {
                var currentDate = resetTime(date);
                var startDate = resetTime(eventObj.startTime);
                this.daysVariation = (currentDate.getTime() - startDate.getTime()) / MS_PER_DAY;
            }
            else {
                this.daysVariation = 0;
            }
        }
        else {
            this.daysVariation = 0;
        }
        if (this.parent.options.eventDragArea) {
            var targetElement = eventArgs.target;
            this.actionObj.clone.style.top = sf.base.formatUnit(targetElement.offsetTop);
            this.actionObj.clone.style.left = sf.base.formatUnit(targetElement.offsetLeft);
            var currentTarget = sf.base.closest(targetElement, '.' + ROOT);
            if (!currentTarget) {
                this.actionObj.clone.style.height = '';
                this.actionObj.clone.style.width = '';
            }
            else {
                if (!(this.parent.options.currentView === 'Week' || this.parent.options.currentView === 'WorkWeek'
                    || this.parent.options.currentView === 'Day')) {
                    this.actionObj.clone.style.width = sf.base.formatUnit(this.actionObj.element.offsetWidth);
                }
            }
        }
        this.updateScrollPosition(e);
        this.updateNavigatingPosition(e);
        this.updateDraggingDateTime(e);
        var dragArgs = {
            data: eventObj, event: e, element: this.actionObj.element, startTime: this.actionObj.start,
            endTime: this.actionObj.end
        };
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            dragArgs.groupIndex = this.actionObj.groupIndex;
        }
    };
    DragAndDrop.prototype.calculateMinutesDiff = function (eventObj) {
        if (this.parent.options.enableRtl) {
            this.minDiff =
                ((this.actionObj.clone.offsetWidth - this.widthUptoCursorPoint) / this.widthPerMinute) * this.actionObj.interval;
        }
        else {
            this.minDiff = (this.widthUptoCursorPoint / this.widthPerMinute) * this.actionObj.interval;
        }
        var startDate = eventObj.startTime;
        var startTime = this.parent.activeView.renderDates[0];
        var startEndHours = getStartEndHours(startTime, this.parent.activeView.getStartHour(), this.parent.activeView.getEndHour());
        if (startEndHours.startHour.getTime() > startDate.getTime()) {
            this.minDiff = this.minDiff + ((startEndHours.startHour.getTime() - startDate.getTime()) / MS_PER_MINUTE);
        }
    };
    DragAndDrop.prototype.dragStop = function (e) {
        this.removeCloneElementClasses();
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
        var eventGuid = this.actionObj.element.getAttribute('data-guid');
        var startTime = addLocalOffset(this.actionObj.start);
        var endTime = addLocalOffset(this.actionObj.end);
        var isSameResource = (this.parent.activeViewOptions.group.resources.length > 0) ?
            parseInt(this.actionObj.element.getAttribute('data-group-index'), 10) === this.actionObj.groupIndex : true;
        var groupIndex = (this.parent.activeViewOptions.group.resources.length > 0) ? this.actionObj.groupIndex : -1;
        var indexCol = [];
        if (this.parent.activeViewOptions.group.resources.length > 0 && this.parent.activeViewOptions.group.allowGroupEdit) {
            var originalElement = this.getOriginalElement(this.actionObj.element);
            indexCol = originalElement.map(function (element) { return parseInt(element.getAttribute('data-group-index'), 10); });
            if (indexCol.indexOf(this.actionObj.groupIndex) === -1) {
                var cloneIndex_1 = parseInt(this.actionObj.clone.getAttribute('data-group-index'), 10);
                indexCol = indexCol.filter(function (index) { return index !== cloneIndex_1; });
                indexCol.push(this.actionObj.groupIndex);
            }
            else {
                indexCol = [];
            }
        }
        // tslint:disable-next-line:no-any
        this.parent.dotNetRef.invokeMethodAsync('OnDragStop', startTime, endTime, eventGuid, groupIndex, isSameResource, this.actionObj.isAllDay, indexCol);
    };
    DragAndDrop.prototype.updateNavigatingPosition = function (e) {
        var _this = this;
        if (this.actionObj.navigation.enable) {
            var currentDate_1 = this.parent.getCurrentTime();
            if (sf.base.isNullOrUndefined(this.actionObj.navigationInterval)) {
                this.actionObj.navigationInterval = window.setInterval(function () {
                    if (currentDate_1) {
                        var crtDate = _this.parent.getCurrentTime();
                        var end = crtDate.getSeconds();
                        var start = currentDate_1.getSeconds() + (_this.actionObj.navigation.timeDelay / 1000);
                        start = (start >= 60) ? start - 60 : start;
                        if (start === end) {
                            currentDate_1 = _this.parent.getCurrentTime();
                            _this.viewNavigation(e);
                            _this.updateDraggingDateTime(e);
                        }
                    }
                }, this.actionObj.navigation.timeDelay);
            }
        }
    };
    DragAndDrop.prototype.updateDraggingDateTime = function (e) {
        if (!sf.base.isNullOrUndefined(this.actionObj.clone.offsetParent) &&
            this.actionObj.clone.offsetParent.classList.contains(MORE_EVENT_POPUP_CLASS)) {
            this.morePopupEventDragging(e);
        }
        else if (this.parent.isTimelineView() && this.parent.options.currentView !== 'TimelineYear') {
            this.timelineEventModule.dateRender = this.parent.activeView.renderDates;
            this.timelineEventModule.cellWidth = this.actionObj.cellWidth;
            this.timelineEventModule.getSlotDates();
            this.actionObj.cellWidth = this.isHeaderRows ? this.timelineEventModule.cellWidth : this.actionObj.cellWidth;
            this.calculateTimelineTime(e);
        }
        else {
            if (this.parent.options.currentView === 'Month' || this.parent.options.currentView === 'TimelineYear' ||
                (!this.parent.isTimelineView() && !this.parent.activeViewOptions.timeScale.enable)) {
                this.calculateVerticalDate(e);
            }
            else {
                this.calculateVerticalTime(e);
            }
        }
    };
    DragAndDrop.prototype.navigationWrapper = function () {
        if (!this.parent.isTimelineView()) {
            if (this.parent.options.currentView === 'Month' || !this.parent.activeViewOptions.timeScale.enable) {
                var outerWrapperCls = [].slice.call(this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS));
                this.actionObj.index = (this.parent.activeView.renderDates.length < this.actionObj.index) ?
                    this.parent.activeView.renderDates.length - 1 : this.actionObj.index;
                var targetWrapper = outerWrapperCls[this.actionObj.index].querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
                if (!targetWrapper) {
                    targetWrapper = sf.base.createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
                    outerWrapperCls[this.actionObj.index].appendChild(targetWrapper);
                }
                targetWrapper.appendChild(this.actionObj.clone);
            }
            else {
                var wrapperClass = this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS) ?
                    '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + APPOINTMENT_WRAPPER_CLASS;
                this.parent.element.querySelectorAll(wrapperClass)
                    .item(this.actionObj.index).appendChild(this.actionObj.clone);
                if (wrapperClass === '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS) {
                    var elementHeight = this.getAllDayEventHeight();
                    var event_2 = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_CELLS_CLASS + ':first-child'));
                    if (event_2[0].offsetHeight < elementHeight) {
                        for (var _i = 0, event_1 = event_2; _i < event_1.length; _i++) {
                            var e = event_1[_i];
                            e.style.height = ((elementHeight + 2) / 12) + 'em';
                        }
                    }
                    this.actionObj.clone.style.height = sf.base.formatUnit(elementHeight);
                }
                this.actionObj.height = parseInt(this.actionObj.clone.style.height, 0);
            }
        }
        else {
            var outWrapper = void 0;
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                outWrapper = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(this.actionObj.index);
            }
            else {
                outWrapper = this.parent.element.querySelector('.' + APPOINTMENT_CONTAINER_CLASS);
            }
            var tarWrapper = outWrapper.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
            if (!tarWrapper) {
                tarWrapper = sf.base.createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
                outWrapper.appendChild(tarWrapper);
            }
            tarWrapper.appendChild(this.actionObj.clone);
        }
    };
    DragAndDrop.prototype.viewNavigation = function (e) {
        var navigationType;
        var dragArea = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        if (dragArea && ((!this.scrollEdges.top && !this.scrollEdges.bottom) ||
            sf.base.closest(this.actionObj.clone, '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS))) {
            if ((dragArea.scrollLeft === 0) &&
                (Math.round(this.actionObj.X) <=
                    Math.round(dragArea.getBoundingClientRect().left + this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.options.enableRtl ? 'Next' : 'Previous';
            }
            else if ((Math.round(dragArea.scrollLeft) + dragArea.clientWidth === dragArea.scrollWidth) &&
                (Math.round(this.actionObj.X) >=
                    Math.round(dragArea.getBoundingClientRect().right - this.actionObj.cellWidth + window.pageXOffset))) {
                navigationType = this.parent.options.enableRtl ? 'Previous' : 'Next';
            }
            if (navigationType) {
                this.parent.dotNetRef.invokeMethodAsync('OnDateNavigate', navigationType);
            }
        }
    };
    DragAndDrop.prototype.morePopupEventDragging = function (e) {
        if (sf.base.isNullOrUndefined(e.target) || (e.target && sf.base.isNullOrUndefined(sf.base.closest(e.target, 'td')))) {
            return;
        }
        var eventObj = sf.base.extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj.endTime.getTime() -
            eventObj.startTime.getTime();
        var td = sf.base.closest(e.target, 'td');
        var dragStart = this.parent.getDateFromElement(td);
        var dragEnd = new Date(dragStart.getTime());
        dragEnd.setMilliseconds(eventDuration);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        this.actionObj.start = new Date(dragStart.getTime());
        this.actionObj.end = new Date(dragEnd.getTime());
        this.actionObj.clone.style.top = sf.base.formatUnit(td.offsetParent.offsetTop);
        this.actionObj.clone.style.left = sf.base.formatUnit(td.offsetLeft);
        this.actionObj.clone.style.width = sf.base.formatUnit(td.offsetWidth);
        var eventContainer = td;
        var eventWrapper;
        if (this.parent.isTimelineView()) {
            var rowIndex = sf.base.closest(td, 'tr').rowIndex;
            eventContainer = this.parent.element.querySelectorAll('.e-appointment-container').item(rowIndex);
        }
        eventWrapper = eventContainer.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
        if (!eventWrapper) {
            eventWrapper = sf.base.createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper);
    };
    DragAndDrop.prototype.calculateVerticalTime = function (e) {
        if (sf.base.isNullOrUndefined(this.actionObj.target) ||
            (this.actionObj.target && sf.base.isNullOrUndefined(sf.base.closest(this.actionObj.target, 'tr'))) ||
            (!(sf.base.closest(this.actionObj.target, 'td').classList.contains(WORK_CELLS_CLASS)) &&
                !(sf.base.closest(this.actionObj.target, 'td').classList.contains(ALLDAY_CELLS_CLASS)))) {
            return;
        }
        if (this.parent.activeViewOptions.timeScale.enable) {
            this.swapDragging(e);
        }
        var dragArea = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var eventObj = sf.base.extend({}, this.actionObj.event, null, true);
        var eventStart = eventObj.startTime;
        var eventEnd = eventObj.endTime;
        var eventDuration = eventEnd.getTime() - eventStart.getTime();
        var offsetTop = Math.floor(parseInt(this.actionObj.clone.style.top, 10) / this.actionObj.cellHeight)
            * this.actionObj.cellHeight;
        offsetTop = offsetTop < 0 ? 0 : offsetTop;
        if (this.scrollEdges.top || this.scrollEdges.bottom) {
            offsetTop = this.scrollEdges.top ? dragArea.scrollTop - this.heightUptoCursorPoint + this.actionObj.cellHeight :
                (dragArea.scrollTop + dragArea.offsetHeight - this.actionObj.clone.offsetHeight) +
                    (this.actionObj.clone.offsetHeight - this.heightUptoCursorPoint);
            offsetTop = Math.round(offsetTop / this.actionObj.cellHeight) * this.actionObj.cellHeight;
            this.actionObj.clone.style.top = sf.base.formatUnit(offsetTop);
        }
        var rowIndex = offsetTop / this.actionObj.cellHeight;
        var heightPerMinute = this.actionObj.cellHeight / this.actionObj.slotInterval;
        var diffInMinutes = parseInt(this.actionObj.clone.style.top, 10) - offsetTop;
        var tr;
        if (this.isAllDayDrag) {
            tr = this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS);
        }
        else {
            var trCollections = [].slice.call(this.parent.getContentTable().querySelectorAll('tr'));
            tr = trCollections[rowIndex];
        }
        var index;
        if (sf.base.closest(this.actionObj.target, 'td').classList.contains(WORK_CELLS_CLASS) ||
            sf.base.closest(this.actionObj.target, 'td').classList.contains(ALLDAY_CELLS_CLASS)) {
            index = sf.base.closest(this.actionObj.target, 'td').cellIndex;
        }
        var colIndex = sf.base.isNullOrUndefined(index) ? sf.base.closest(this.actionObj.clone, 'td').cellIndex : index;
        this.actionObj.index = colIndex;
        if (sf.base.isNullOrUndefined(tr)) {
            return;
        }
        var td = tr.children[colIndex];
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
        }
        var dragStart;
        var dragEnd;
        if (this.parent.activeViewOptions.timeScale.enable && !this.isAllDayDrag) {
            this.appendCloneElement(this.getEventWrapper(colIndex));
            dragStart = this.parent.getDateFromElement(td);
            dragStart.setMinutes(dragStart.getMinutes() + (diffInMinutes / heightPerMinute));
            dragEnd = new Date(dragStart.getTime());
            if (this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd.setMinutes(dragEnd.getMinutes() + this.actionObj.slotInterval);
            }
            else {
                dragEnd.setMilliseconds(eventDuration);
            }
        }
        else {
            dragStart = this.parent.getDateFromElement(td);
            dragStart.setDate(dragStart.getDate() - this.daysVariation);
            dragStart.setHours(eventStart.getHours(), eventStart.getMinutes(), eventStart.getSeconds());
            dragEnd = new Date(dragStart.getTime());
            dragEnd.setMilliseconds(eventDuration);
            if (!this.actionObj.element.classList.contains(ALLDAY_APPOINTMENT_CLASS) &&
                this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS)) {
                dragEnd = addDays(resetTime(dragEnd), 1);
            }
            this.updateAllDayEvents(dragStart, dragEnd, this.parent.activeViewOptions.group.byDate ? colIndex : undefined);
        }
        this.actionObj.start = new Date(+dragStart);
        this.actionObj.end = new Date(+dragEnd);
        var event = this.getUpdatedEvent(this.actionObj.start, this.actionObj.end, this.actionObj.event);
        this.updateEventHeight(event);
        this.updateTimePosition(this.actionObj.start);
    };
    DragAndDrop.prototype.updateEventHeight = function (event) {
        // this.verticalEvent.initializeValues();
        // let datesCount: number = 0;
        // for (let i: number = 0; i < this.actionObj.groupIndex; i++) {
        //     datesCount = datesCount + this.verticalEvent.dateRender[i].length;
        // }
        // let dayIndex: number = !this.parent.activeViewOptions.group.byDate ? this.actionObj.index - datesCount
        //     : this.parent.getIndexOfDate(this.verticalEvent.dateRender[this.actionObj.groupIndex], util.resetTime(
        //         this.parent.getDateFromElement(this.actionObj.target as HTMLElement)));
        // let record: { [key: string]: Object } = this.verticalEvent.isSpannedEvent(event, dayIndex, this.actionObj.groupIndex);
        // let eStart: Date = record[this.verticalEvent.fields.startTime] as Date;
        // let eEnd: Date = record[this.verticalEvent.fields.endTime] as Date;
        // let topValue: number = 0;
        // let appHeight: number = this.verticalEvent.getHeight(eStart, eEnd);
        // topValue = this.verticalEvent.getTopValue(eStart, dayIndex, this.actionObj.groupIndex);
        // this.actionObj.clone.style.top = formatUnit(topValue);
        // this.actionObj.clone.style.height = formatUnit(appHeight);
    };
    DragAndDrop.prototype.updateAllDayEvents = function (startDate, endDate, colIndex) {
        this.parent.eventBase.slots = [];
        var event = this.getUpdatedEvent(startDate, endDate, this.actionObj.event);
        var renderDates = this.parent.activeView.renderDates;
        this.parent.eventBase.slots.push(this.parent.activeView.renderDates.map(function (date) { return +date; }));
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.eventBase.slots = [];
            // let resources: TdData[] = this.parent.resourceBase.lastResourceLevel.
            //     filter((res: TdData) => res.groupIndex === this.actionObj.groupIndex);
            // renderDates = resources[0].renderDates;
            this.parent.eventBase.slots.push(renderDates.map(function (date) { return +date; }));
        }
        var events = this.parent.eventBase.splitEvent(event, renderDates);
        var query = '.e-all-day-cells[data-date="' +
            this.parent.getMsFromDate(events[0].startTime) + '"]';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            query = query.concat('[data-group-index = "' + this.actionObj.groupIndex + '"]');
        }
        var cell = [].slice.call(this.parent.element.querySelectorAll(query));
        if (cell.length > 0 || !sf.base.isNullOrUndefined(colIndex)) {
            var cellIndex = !sf.base.isNullOrUndefined(colIndex) ? colIndex : cell[0].cellIndex;
            this.appendCloneElement(this.getEventWrapper(cellIndex));
            this.actionObj.clone.style.width =
                sf.base.formatUnit(events[0].data.count * this.actionObj.cellWidth);
        }
    };
    DragAndDrop.prototype.swapDragging = function (e) {
        var colIndex = sf.base.closest(this.actionObj.target, 'td').cellIndex;
        if (sf.base.closest(this.actionObj.target, '.' + DATE_HEADER_WRAP_CLASS) &&
            !sf.base.closest(this.actionObj.clone, '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS)) {
            sf.base.addClass([this.actionObj.clone], ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = true;
            var eventHeight = this.getAllDayEventHeight();
            var allDayElement = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_CELLS_CLASS + ':first-child'));
            if (allDayElement[0].offsetHeight < eventHeight) {
                for (var _i = 0, allDayElement_1 = allDayElement; _i < allDayElement_1.length; _i++) {
                    var element = allDayElement_1[_i];
                    element.style.height = ((eventHeight + 2) / 12) + 'em';
                }
            }
            sf.base.setStyleAttribute(this.actionObj.clone, {
                width: sf.base.formatUnit(this.actionObj.cellWidth),
                height: sf.base.formatUnit(eventHeight),
                top: sf.base.formatUnit(this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS).offsetTop)
            });
        }
        if (sf.base.closest(this.actionObj.target, '.' + WORK_CELLS_CLASS) &&
            !sf.base.closest(this.actionObj.clone, '.' + DAY_WRAPPER_CLASS)) {
            sf.base.removeClass([this.actionObj.clone], ALLDAY_APPOINTMENT_CLASS);
            this.appendCloneElement(this.getEventWrapper(colIndex));
            this.actionObj.isAllDay = false;
            var height = (this.actionObj.element.offsetHeight === 0) ? this.actionObj.height : this.actionObj.element.offsetHeight;
            sf.base.setStyleAttribute(this.actionObj.clone, {
                left: sf.base.formatUnit(0),
                height: sf.base.formatUnit(height),
                width: sf.base.formatUnit(this.actionObj.cellWidth)
            });
        }
    };
    DragAndDrop.prototype.calculateVerticalDate = function (e) {
        if (sf.base.isNullOrUndefined(e.target) || (e.target && sf.base.isNullOrUndefined(sf.base.closest(e.target, 'tr'))) ||
            (e.target && e.target.tagName === 'DIV')) {
            return;
        }
        this.removeCloneElement();
        var eventObj = sf.base.extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj.endTime.getTime() -
            eventObj.startTime.getTime();
        var td = sf.base.closest(this.actionObj.target, 'td');
        if (!sf.base.isNullOrUndefined(td)) {
            var tr = td.parentElement;
            this.actionObj.index = (tr.rowIndex * tr.children.length) + td.cellIndex;
            var workCells = [].slice.call(this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS));
            td = workCells[this.actionObj.index];
            var currentDate = this.parent.getDateFromElement(td);
            if (!sf.base.isNullOrUndefined(currentDate)) {
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    this.actionObj.groupIndex = parseInt(td.getAttribute('data-group-index'), 10);
                }
                var timeString = new Date(currentDate.setDate(currentDate.getDate() - this.daysVariation));
                var dragStart = new Date(timeString.getTime());
                var dragEnd = new Date(dragStart.getTime());
                var startTimeDiff = eventObj.startTime.getTime() -
                    (resetTime(eventObj.startTime)).getTime();
                dragStart = new Date(dragStart.getTime() + startTimeDiff);
                dragEnd = new Date(dragStart.getTime() + eventDuration);
                this.actionObj.start = new Date(dragStart.getTime());
                this.actionObj.end = new Date(dragEnd.getTime());
            }
        }
        var event = this.getUpdatedEvent(this.actionObj.start, this.actionObj.end, this.actionObj.event);
        if (this.parent.options.currentView === 'TimelineYear') {
            this.dynamicYearlyEventsRendering(event);
        }
        else {
            this.dynamicEventsRendering(event);
        }
    };
    DragAndDrop.prototype.calculateTimelineTime = function (e) {
        var eventObj = sf.base.extend({}, this.actionObj.event, null, true);
        var eventDuration = eventObj.endTime.getTime() -
            eventObj.startTime.getTime();
        var offsetLeft = this.parent.options.enableRtl ?
            Math.abs(this.actionObj.clone.offsetLeft) - this.actionObj.clone.offsetWidth :
            parseInt(this.actionObj.clone.style.left, 10);
        offsetLeft = Math.floor(offsetLeft / this.actionObj.cellWidth) * this.actionObj.cellWidth;
        var rightOffset;
        if (this.parent.options.enableRtl) {
            rightOffset = Math.abs(parseInt(this.actionObj.clone.style.right, 10));
            this.actionObj.clone.style.right = sf.base.formatUnit(rightOffset);
        }
        offsetLeft = this.getOffsetValue(offsetLeft, rightOffset);
        var colIndex = this.getColumnIndex(offsetLeft);
        var cloneIndex = Math.floor((this.actionObj.pageX - this.actionObj.clone.getBoundingClientRect().left) / this.actionObj.cellWidth);
        if (this.parent.options.enableRtl) {
            cloneIndex = Math.abs(Math.floor((this.actionObj.pageX - this.actionObj.clone.getBoundingClientRect().right) /
                this.actionObj.cellWidth)) - 1;
        }
        if (this.cursorPointIndex < 0) {
            this.cursorIndex(e, eventObj, offsetLeft, cloneIndex);
        }
        var tr = this.parent.getContentTable().querySelector('tr');
        var index = this.getCursorCurrentIndex(colIndex, cloneIndex, tr);
        index = index < 0 ? 0 : index;
        var eventStart = this.isHeaderRows ? new Date(this.timelineEventModule.dateRender[index].getTime()) :
            this.parent.getDateFromElement(tr.children[index]);
        if (this.isStepDragging) {
            var widthDiff = this.getWidthDiff(tr, index);
            if (widthDiff !== 0) {
                var timeDiff = Math.round(widthDiff / this.widthPerMinute);
                eventStart.setMinutes(eventStart.getMinutes() + (timeDiff * this.actionObj.interval));
                eventStart.setMinutes(eventStart.getMinutes() - this.minDiff);
            }
            else {
                eventStart = this.actionObj.start;
            }
        }
        else {
            eventStart.setMinutes(eventStart.getMinutes() -
                (this.cursorPointIndex * (this.isTimelineDayProcess ? MINUTES_PER_DAY : this.actionObj.slotInterval)));
        }
        eventStart = this.calculateIntervalTime(eventStart);
        if (this.isTimelineDayProcess) {
            var eventSrt = eventObj.startTime;
            eventStart.setHours(eventSrt.getHours(), eventSrt.getMinutes(), eventSrt.getSeconds());
        }
        var eventEnd = new Date(eventStart.getTime());
        eventEnd.setMilliseconds(eventDuration);
        var event = this.getUpdatedEvent(eventStart, eventEnd, this.actionObj.event);
        var events = this.timelineEventModule.splitEvent(event, this.timelineEventModule.dateRender);
        var eventData = events[0].data;
        var startTime = this.getStartTime(events[0], eventData);
        var endTime = this.getEndTime(events[0], eventData);
        var width = this.timelineEventModule.
            getEventWidth(startTime, endTime, eventObj.isAllDay, eventData.count);
        var day = this.parent.getIndexOfDate(this.timelineEventModule.dateRender, resetTime(new Date(startTime.getTime())));
        day = day < 0 ? 0 : day;
        var left = this.timelineEventModule.getPosition(startTime, endTime, eventObj.isAllDay, day);
        if (this.parent.options.enableRtl) {
            this.actionObj.clone.style.right = sf.base.formatUnit(left);
        }
        else {
            this.actionObj.clone.style.left = sf.base.formatUnit(left);
        }
        if (!this.isMorePopupOpened) {
            this.actionObj.clone.style.width = sf.base.formatUnit(width);
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.calculateResourceGroupingPosition(e);
        }
        this.actionObj.start = new Date(eventStart.getTime());
        this.actionObj.end = new Date(eventEnd.getTime());
        this.updateTimePosition(this.actionObj.start);
    };
    DragAndDrop.prototype.getStartTime = function (event, eventData) {
        var startTime = event.startTime;
        var schedule = getStartEndHours(startTime, this.timelineEventModule.startHour, this.timelineEventModule.endHour);
        if (schedule.startHour.getTime() >= eventData.startTime) {
            startTime = schedule.startHour;
        }
        else if (schedule.endHour.getTime() <= eventData.startTime) {
            startTime = this.getNextDay(schedule.startHour, eventData);
        }
        else {
            startTime = eventData.startTime;
        }
        eventData.trimStartTime = (event.isAllDay) ? schedule.startHour : eventData.startTime;
        return startTime;
    };
    DragAndDrop.prototype.getNextDay = function (startTime, eventData) {
        var startDate;
        for (var i = 1; i <= this.timelineEventModule.dateRender.length; i++) {
            startDate = addDays(startTime, i);
            if (this.parent.getIndexOfDate(this.timelineEventModule.dateRender, resetTime(new Date(startTime.getTime()))) !== -1) {
                eventData.count = eventData.count - 1;
                return startDate;
            }
        }
        return startDate;
    };
    DragAndDrop.prototype.getEndTime = function (event, eventData) {
        var endTime = event.endTime;
        var schedule = getStartEndHours(endTime, this.timelineEventModule.startHour, this.timelineEventModule.endHour);
        if (schedule.endHour.getTime() <= eventData.endTime) {
            endTime = schedule.endHour;
        }
        else {
            endTime = eventData.endTime;
        }
        eventData.trimEndTime = (event.isAllDay) ? schedule.endHour : eventData.endTime;
        return endTime;
    };
    DragAndDrop.prototype.getOffsetValue = function (offsetLeft, rightOffset) {
        if (this.scrollEdges.left || this.scrollEdges.right) {
            var viewEle = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
            if (this.parent.options.enableRtl) {
                rightOffset = viewEle.offsetWidth - viewEle.scrollLeft;
                if (this.scrollEdges.right) {
                    rightOffset = (rightOffset - viewEle.offsetWidth + this.actionObj.clone.offsetWidth) -
                        (this.actionObj.clone.offsetWidth - this.widthUptoCursorPoint);
                }
                else {
                    rightOffset = rightOffset + this.widthUptoCursorPoint;
                    if (rightOffset - this.widthUptoCursorPoint >= viewEle.scrollWidth) {
                        this.actionObj.clone.style.width =
                            sf.base.formatUnit(this.actionObj.clone.offsetWidth - this.widthUptoCursorPoint + this.actionObj.cellWidth);
                        rightOffset = (viewEle.scrollLeft - viewEle.scrollWidth);
                    }
                }
                this.actionObj.clone.style.left = sf.base.formatUnit(rightOffset);
            }
            else {
                if (this.scrollEdges.left) {
                    offsetLeft = viewEle.scrollLeft - this.widthUptoCursorPoint + this.actionObj.cellWidth;
                    if (viewEle.scrollLeft + viewEle.offsetWidth >= viewEle.offsetWidth) {
                        viewEle.scrollLeft = viewEle.scrollLeft - 1;
                    }
                    else if (this.actionObj.clone.offsetLeft === 0) {
                        offsetLeft = viewEle.scrollLeft;
                    }
                }
                else {
                    offsetLeft = (viewEle.scrollLeft + viewEle.offsetWidth -
                        this.actionObj.clone.offsetWidth) + (this.actionObj.clone.offsetWidth - this.widthUptoCursorPoint);
                }
                offsetLeft = offsetLeft < 0 ? 0 : offsetLeft;
                this.actionObj.clone.style.left = sf.base.formatUnit(offsetLeft);
            }
        }
        return offsetLeft;
    };
    DragAndDrop.prototype.getWidthDiff = function (tr, index) {
        var pages = this.scrollArgs.element.getBoundingClientRect();
        if (pages.left <= this.actionObj.pageX && pages.right >= this.actionObj.pageX) {
            var targetLeft = tr.children[index].offsetLeft;
            var pageX = this.actionObj.pageX - pages.left;
            if (this.parent.options.enableRtl) {
                return (targetLeft + this.actionObj.cellWidth) - (this.scrollArgs.element.scrollLeft + pageX);
            }
            else {
                return (this.scrollArgs.element.scrollLeft + pageX) - targetLeft;
            }
        }
        return 0;
    };
    DragAndDrop.prototype.getColumnIndex = function (offsetLeft) {
        var index = Math.floor(offsetLeft / this.actionObj.cellWidth);
        if (this.isHeaderRows) {
            return index;
        }
        return this.getIndex(index);
    };
    DragAndDrop.prototype.getCursorCurrentIndex = function (colIndex, cloneIndex, tr) {
        var index = colIndex + cloneIndex;
        if (this.isHeaderRows) {
            var dateLength = Math.floor(tr.offsetWidth / this.actionObj.cellWidth);
            return (index > dateLength - 1) ? dateLength - 1 : index;
        }
        return (index > tr.children.length - 1) ? tr.children.length - 1 : index;
    };
    DragAndDrop.prototype.cursorIndex = function (e, event, left, index) {
        var td = sf.base.closest(e.target, '.e-work-cells');
        if (!sf.base.isNullOrUndefined(td) && !this.isMorePopupOpened) {
            var targetDate = this.parent.getDateFromElement(td);
            if (this.isHeaderRows) {
                var currentIndex = Math.floor(left / this.actionObj.cellWidth);
                targetDate = new Date(this.timelineEventModule.dateRender[currentIndex + index].getTime());
            }
            var timeDiff = targetDate.getTime() - (new Date(event.startTime)).getTime();
            if (this.isTimelineDayProcess) {
                this.cursorPointIndex = Math.abs(Math.ceil(timeDiff / (MS_PER_DAY)));
            }
            else {
                var widthDiff = Math.floor((timeDiff / MS_PER_MINUTE) / (this.actionObj.slotInterval / this.actionObj.cellWidth));
                this.cursorPointIndex = Math.floor(widthDiff / this.actionObj.cellWidth);
                this.cursorPointIndex = this.cursorPointIndex < 0 ? 0 : this.cursorPointIndex;
            }
        }
        else {
            this.cursorPointIndex = 0;
        }
    };
    DragAndDrop.prototype.calculateResourceGroupingPosition = function (e) {
        var dragArea = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var trCollection = [].slice.call(this.parent.element.querySelectorAll('.e-content-wrap .e-content-table tr:not(.e-hidden)'));
        var translateY = getTranslateY(dragArea.querySelector('table'));
        translateY = (sf.base.isNullOrUndefined(translateY)) ? 0 : translateY;
        var rowHeight = (this.parent.options.rowAutoHeight) ?
            ~~(dragArea.querySelector('table').offsetHeight / trCollection.length) : this.actionObj.cellHeight;
        var rowIndex = Math.floor(Math.floor((this.actionObj.Y + (dragArea.scrollTop - translateY - window.scrollY)) -
            dragArea.getBoundingClientRect().top) / rowHeight);
        rowIndex = (rowIndex < 0) ? 0 : (rowIndex > trCollection.length - 1) ? trCollection.length - 1 : rowIndex;
        this.actionObj.index = rowIndex;
        var eventContainer = this.parent.element.querySelectorAll('.e-appointment-container:not(.e-hidden)').item(rowIndex);
        var eventWrapper = eventContainer.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
        if (!eventWrapper) {
            eventWrapper = sf.base.createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
            eventContainer.appendChild(eventWrapper);
        }
        this.appendCloneElement(eventWrapper);
        var td = sf.base.closest(e.target, 'td');
        this.actionObj.groupIndex = (td && !isNaN(parseInt(td.getAttribute('data-group-index'), 10)))
            ? parseInt(td.getAttribute('data-group-index'), 10) : this.actionObj.groupIndex;
        var top = trCollection[rowIndex].offsetTop;
        if (this.parent.options.rowAutoHeight) {
            var cursorElement = this.getCursorElement(e);
            if (cursorElement) {
                top = cursorElement.classList.contains(WORK_CELLS_CLASS) ? cursorElement.offsetTop :
                    cursorElement.offsetParent.classList.contains(APPOINTMENT_CLASS) ?
                        cursorElement.offsetParent.offsetTop : top;
            }
        }
        this.actionObj.clone.style.top = sf.base.formatUnit(top);
    };
    DragAndDrop.prototype.appendCloneElement = function (element) {
        if (this.parent.options.eventDragArea) {
            document.querySelector(this.parent.options.eventDragArea).appendChild(this.actionObj.clone);
        }
        else {
            element.appendChild(this.actionObj.clone);
        }
    };
    DragAndDrop.prototype.getEventWrapper = function (index) {
        var eventWrapper;
        var isAllDayDrag = this.actionObj.clone.classList.contains(ALLDAY_APPOINTMENT_CLASS);
        if (this.parent.activeViewOptions.timeScale.enable) {
            var wrapperClass = isAllDayDrag ? '.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS : '.' + APPOINTMENT_WRAPPER_CLASS;
            eventWrapper = this.parent.element.querySelectorAll(wrapperClass).item(index);
        }
        else {
            var targetWrapper = this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS).item(index);
            eventWrapper = targetWrapper.querySelector('.' + APPOINTMENT_WRAPPER_CLASS);
            if (!eventWrapper) {
                eventWrapper = sf.base.createElement('div', { className: APPOINTMENT_WRAPPER_CLASS });
                targetWrapper.appendChild(eventWrapper);
            }
        }
        return eventWrapper;
    };
    DragAndDrop.prototype.getAllDayEventHeight = function () {
        var eventWrapper = sf.base.createElement('div', { className: APPOINTMENT_CLASS });
        this.parent.element.querySelector('.' + ALLDAY_APPOINTMENT_WRAPPER_CLASS).appendChild(eventWrapper);
        var eventHeight = eventWrapper.offsetHeight;
        sf.base.remove(eventWrapper);
        return eventHeight;
    };
    DragAndDrop.prototype.isAllowDrop = function (e) {
        if (!this.actionObj.excludeSelectors) {
            return false;
        }
        var dropSelectors = this.actionObj.excludeSelectors.split(',');
        var isAllowDrop = false;
        for (var _i = 0, dropSelectors_1 = dropSelectors; _i < dropSelectors_1.length; _i++) {
            var selector = dropSelectors_1[_i];
            if (e.target.classList.contains(selector)) {
                isAllowDrop = true;
                break;
            }
        }
        return isAllowDrop;
    };
    return DragAndDrop;
}(ActionBase));

/**
 * Virtual Scroll
 */
var VirtualScroll = /** @class */ (function () {
    function VirtualScroll(parent) {
        this.translateY = 0;
        this.itemSize = 60;
        this.bufferCount = 3;
        this.renderedLength = 0;
        this.averageRowHeight = 0;
        this.startIndex = 0;
        this.previousTop = 0;
        this.parent = parent;
    }
    VirtualScroll.prototype.getRenderedCount = function () {
        var conTable = this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS);
        this.renderedLength = conTable.querySelector('tbody').children.length;
        return this.renderedLength;
    };
    VirtualScroll.prototype.triggerScrolling = function () {
        this.parent.dotNetRef.invokeMethodAsync('OnContentUpdate', this.startIndex);
    };
    VirtualScroll.prototype.setTranslateValue = function () {
        var resWrap = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
        var conWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var eventWrap = this.parent.element.querySelector('.' + EVENT_TABLE_CLASS);
        var timeIndicator = this.parent.element.querySelector('.' + CURRENT_TIMELINE_CLASS);
        this.setItemSize();
        this.setVirtualTrackHeight(resWrap);
        this.setTranslate(resWrap, conWrap, eventWrap, timeIndicator);
    };
    VirtualScroll.prototype.setVirtualTrackHeight = function (resourceWrap) {
        var virtual = this.parent.element.querySelector('.' + VIRTUAL_TRACK_CLASS);
        if (virtual) {
            var count = parseInt(resourceWrap.getAttribute('data-expanded-count'), 10);
            virtual.style.height = (count * this.itemSize) + 'px';
        }
    };
    VirtualScroll.prototype.updateVirtualScrollHeight = function () {
        var virtual = this.parent.element.querySelector('.' + VIRTUAL_TRACK_CLASS);
        var resWrap = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
        var lastRenderIndex = parseInt(resWrap.getAttribute('data-rendered-index'), 10);
        var lastCollIndex = parseInt(resWrap.getAttribute('data-expanded-index'), 10);
        var expandedCount = parseInt(resWrap.getAttribute('data-expanded-count'), 10);
        var conTable = this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS);
        this.renderedLength = conTable.querySelector('tbody').children.length;
        virtual.style.height = (conTable.offsetHeight + (expandedCount - (this.renderedLength)) *
            conTable.offsetHeight / this.renderedLength) + 'px';
        this.averageRowHeight = virtual.offsetHeight / expandedCount;
    };
    VirtualScroll.prototype.updateVirtualTrackHeight = function (wrap) {
        var resWrap = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
        var lastRenderIndex = parseInt(resWrap.getAttribute('data-rendered-index'), 10);
        var lastCollIndex = parseInt(resWrap.getAttribute('data-expanded-index'), 10);
        var renderedResCount = this.getRenderedCount() + (lastCollIndex - lastRenderIndex);
        var expandedCount = parseInt(resWrap.getAttribute('data-expanded-count'), 10);
        renderedResCount = (renderedResCount > expandedCount) ? expandedCount : renderedResCount;
        wrap.style.height = (renderedResCount * this.itemSize) + 'px';
    };
    VirtualScroll.prototype.setItemSize = function () {
        this.itemSize = getElementHeightFromClass(this.parent.activeView.element, WORK_CELLS_CLASS) || this.itemSize;
    };
    VirtualScroll.prototype.beforeInvoke = function (resWrap, conWrap, eventWrap, timeIndicator) {
        var _this = this;
        window.clearTimeout(this.timeValue);
        this.timeValue = window.setTimeout(function () { _this.triggerScrolling(); }, 250);
        this.setTranslate(resWrap, conWrap, eventWrap, timeIndicator);
        this.previousTop = conWrap.scrollTop;
    };
    VirtualScroll.prototype.virtualScrolling = function () {
        if (this.parent.quickPopup) {
            this.parent.quickPopup.hide();
        }
        if (this.parent.morePopup) {
            this.parent.morePopup.hide();
        }
        var resWrap = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
        var conWrap = this.parent.element.querySelector('.' + CONTENT_WRAP_CLASS);
        var eventWrap = this.parent.element.querySelector('.' + EVENT_TABLE_CLASS);
        var timeIndicator = this.parent.element.querySelector('.' + CURRENT_TIMELINE_CLASS);
        var conTable = this.parent.element.querySelector('.' + CONTENT_TABLE_CLASS);
        this.renderedLength = resWrap.querySelector('tbody').children.length;
        var firstTDIndex = parseInt(resWrap.querySelector('tbody td').getAttribute('data-group-index'), 10);
        var scrollHeight = this.parent.options.rowAutoHeight ?
            (conTable.offsetHeight - conWrap.offsetHeight) : this.bufferCount * this.itemSize;
        sf.base.addClass([conWrap], 'e-transition');
        this.setItemSize();
        if ((conWrap.scrollTop) - this.translateY < 0) {
            this.upScroll(conWrap, firstTDIndex);
            this.beforeInvoke(resWrap, conWrap, eventWrap, timeIndicator);
        }
        else if (conWrap.scrollTop - this.translateY > scrollHeight) {
            this.downScroll(conWrap);
            if (!(this.previousTop === conWrap.scrollTop)) {
                this.beforeInvoke(resWrap, conWrap, eventWrap, timeIndicator);
            }
        }
    };
    VirtualScroll.prototype.upScroll = function (conWrap, firstTDIndex) {
        var index = ~~(conWrap.scrollTop / this.itemSize);
        if (this.parent.options.rowAutoHeight) {
            index = (index > firstTDIndex) ? firstTDIndex - this.bufferCount : index;
        }
        index = (index > 0) ? index : 0;
        if (firstTDIndex === 0) {
            this.translateY = conWrap.scrollTop;
        }
        else {
            var height = (this.parent.options.rowAutoHeight) ? this.averageRowHeight : this.itemSize;
            this.translateY = (conWrap.scrollTop - (this.bufferCount * height) > 0) ?
                conWrap.scrollTop - (this.bufferCount * height) : 0;
        }
        this.startIndex = index;
    };
    VirtualScroll.prototype.downScroll = function (conWrap) {
        var resWrap = this.parent.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
        if (resWrap.getAttribute('data-rendered-index') === resWrap.getAttribute('data-expanded-index')) {
            return null;
        }
        var height = (this.parent.options.rowAutoHeight) ? this.averageRowHeight : this.itemSize;
        var nextSetResIndex = ~~(conWrap.scrollTop / height);
        var lastIndex = nextSetResIndex + this.renderedLength;
        var expandedCount = parseInt(resWrap.getAttribute('data-expanded-count'), 10);
        lastIndex = (lastIndex > expandedCount) ? nextSetResIndex + (expandedCount - nextSetResIndex) : lastIndex;
        this.translateY = conWrap.scrollTop;
        if (this.translateY > (expandedCount * height) - (this.renderedLength * height)) {
            this.translateY = (expandedCount * height) - (this.renderedLength * height);
        }
        this.startIndex = lastIndex - this.renderedLength;
    };
    VirtualScroll.prototype.setTranslate = function (resWrap, conWrap, eventWrap, timeIndicator) {
        sf.base.setStyleAttribute(resWrap.querySelector('table'), {
            transform: "translateY(" + this.translateY + "px)"
        });
        sf.base.setStyleAttribute(conWrap.querySelector('table'), {
            transform: "translateY(" + this.translateY + "px)"
        });
        sf.base.setStyleAttribute(eventWrap, {
            transform: "translateY(" + this.translateY + "px)"
        });
        if (!sf.base.isNullOrUndefined(timeIndicator)) {
            sf.base.setStyleAttribute(timeIndicator, {
                transform: "translateY(" + this.translateY + "px)"
            });
        }
    };
    return VirtualScroll;
}());

/**
 * Inline Edit interactions
 */
var InlineEdit = /** @class */ (function () {
    function InlineEdit(parent) {
        this.parent = parent;
    }
    InlineEdit.prototype.inlineEdit = function (clickType, isTemplate, guid) {
        if (guid === void 0) { guid = null; }
        if (clickType === 'Cell') {
            this.removeInlineAppointmentElement();
            this.cellEdit();
        }
        else {
            if (isTemplate) {
                return;
            }
            var activeEvent = this.parent.element.querySelector('.e-appointment[data-guid="' + guid + '"]');
            if (this.parent.element.querySelector('.e-more-popup-wrapper') &&
                this.parent.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')) {
                activeEvent = this.parent.element.querySelector('.e-more-popup-wrapper .e-appointment[data-guid="' + guid + '"]');
            }
            if (this.parent.element.querySelector('.' + INLINE_SUBJECT_CLASS) !==
                activeEvent.querySelector('.' + INLINE_SUBJECT_CLASS)) {
                this.removeInlineAppointmentElement();
            }
            this.eventEdit(activeEvent);
        }
    };
    InlineEdit.prototype.cellEdit = function () {
        var saveObj = this.generateEventData();
        var cellIndex = this.parent.activeCellsData.element.cellIndex;
        var count = this.getEventDaysCount(saveObj);
        if (count > 1) {
            count = Math.round(count);
            count--;
            cellIndex = cellIndex - count;
        }
        var start = new Date('' + saveObj.startTime).getTime();
        var end = new Date('' + saveObj.endTime).getTime();
        var resIndex = saveObj.groupIndex || 0;
        if (this.parent.options.currentView === 'Day' || this.parent.options.currentView === 'Week' ||
            this.parent.options.currentView === 'WorkWeek') {
            var dayIndex = saveObj.startTime.getDay();
            this.createVerticalViewInline(saveObj, dayIndex, resIndex, cellIndex);
        }
        else if (this.parent.options.currentView === 'Month') {
            this.createMonthViewInline(saveObj, resIndex, start, end);
        }
        else {
            this.createTimelineViewInline(saveObj, start, end, resIndex);
        }
        var inlineSubject = this.parent.element.querySelector('.' + INLINE_SUBJECT_CLASS);
        if (inlineSubject) {
            inlineSubject.focus();
        }
    };
    InlineEdit.prototype.createInlineAppointmentElement = function () {
        var inlineAppointmentElement = sf.base.createElement('div', {
            className: APPOINTMENT_CLASS + ' ' + INLINE_APPOINTMENT_CLASS
        });
        var inlineDetails = sf.base.createElement('div', { className: APPOINTMENT_DETAILS });
        inlineAppointmentElement.appendChild(inlineDetails);
        var inline = sf.base.createElement('input', { className: INLINE_SUBJECT_CLASS });
        inlineDetails.appendChild(inline);
        return inlineAppointmentElement;
    };
    InlineEdit.prototype.removeInlineAppointmentElement = function () {
        var inlineAppointment = [].slice.call(this.parent.element.querySelectorAll('.' + INLINE_APPOINTMENT_CLASS));
        if (inlineAppointment.length > 0) {
            inlineAppointment.forEach(function (node) { return sf.base.remove(node); });
        }
        var inlineSubject = this.parent.element.querySelector('.' + INLINE_SUBJECT_CLASS);
        if (inlineSubject) {
            var appointmentSubject = sf.base.closest(inlineSubject, '.' + APPOINTMENT_CLASS);
            sf.base.removeClass([appointmentSubject.querySelector('.' + SUBJECT_CLASS)], DISABLE_CLASS);
            sf.base.remove(inlineSubject);
        }
    };
    InlineEdit.prototype.createVerticalViewInline = function (saveObj, dayIndex, resIndex, daysCount) {
        var count = this.getEventDaysCount(saveObj);
        var verticalEvent = new VerticalEvent(this.parent);
        verticalEvent.initializeValues();
        var index = 0;
        if (count >= 1) {
            verticalEvent.allDayElement = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_CELLS_CLASS));
            var allDayElements = [].slice.call(this.parent.element.querySelectorAll('.' + ALLDAY_APPOINTMENT_CLASS));
            var allDayLevel = 0;
            if (allDayElements.length > 0) {
                allDayLevel = Math.floor(this.parent.element.querySelector('.' + ALLDAY_ROW_CLASS).getBoundingClientRect().height /
                    allDayElements[0].offsetHeight) - 1;
            }
            verticalEvent.allDayLevel = allDayLevel;
            verticalEvent.renderAllDayEvents(saveObj, index, resIndex, daysCount);
        }
        else {
            verticalEvent.renderNormalEvents(saveObj, index, resIndex, daysCount);
        }
    };
    InlineEdit.prototype.createMonthViewInline = function (saveObj, index, start, end) {
        var count = this.getEventDaysCount(saveObj);
        var saveObject = this.parent.eventBase.cloneEventObject(saveObj, start, end, count, false, false);
        var monthEvent = new MonthEvent(this.parent);
        monthEvent.dateRender = this.parent.activeView.renderDates;
        var renderDates = this.parent.activeView.renderDates;
        var workDays = this.parent.activeViewOptions.workDays;
        if (this.parent.activeCellsData.groupIndex >= 0) {
            monthEvent.workCells = [].slice.call(this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS + '[data-group-index="' + index + '"]'));
        }
        else {
            monthEvent.workCells = [].slice.call(this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS));
        }
        monthEvent.cellWidth = monthEvent.workCells[0].offsetWidth;
        monthEvent.cellHeight = monthEvent.workCells[0].offsetHeight;
        monthEvent.eventHeight = getElementHeightFromClass(this.parent.element, APPOINTMENT_CLASS);
        monthEvent.getSlotDates(workDays);
        var filteredDates = monthEvent.getRenderedDates(renderDates);
        var splittedEvents = monthEvent.splitEvent(saveObject, filteredDates || renderDates);
        for (var _i = 0, splittedEvents_1 = splittedEvents; _i < splittedEvents_1.length; _i++) {
            var eventData = splittedEvents_1[_i];
            monthEvent.renderEvents(eventData, index);
        }
        var inlineSubject = this.parent.element.querySelector('.' + INLINE_SUBJECT_CLASS);
        inlineSubject.focus();
    };
    InlineEdit.prototype.createTimelineViewInline = function (saveObj, start, end, resIndex) {
        var count = this.getEventDaysCount(saveObj);
        var saveObject = this.parent.eventBase.cloneEventObject(saveObj, start, end, count, false, false);
        var timelineView = new TimelineEvent(this.parent, this.parent.activeViewOptions.timeScale.enable ? 'hour' : 'day');
        timelineView.dateRender = this.parent.activeView.renderDates;
        timelineView.eventContainers = [].slice.call(this.parent.element.querySelectorAll('.' + APPOINTMENT_CONTAINER_CLASS));
        if (this.parent.activeCellsData.groupIndex >= 0) {
            timelineView.workCells = [].slice.call(this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS + '[data-group-index="' + resIndex + '"]'));
        }
        else {
            timelineView.workCells = [].slice.call(this.parent.element.querySelectorAll('.' + WORK_CELLS_CLASS));
        }
        var workCell = this.parent.element.querySelector('.' + WORK_CELLS_CLASS);
        timelineView.inlineValue = this.parent.options.allowInline;
        timelineView.cellWidth = workCell.offsetWidth;
        timelineView.cellHeight = workCell.offsetHeight;
        var dayLength = this.parent.element.querySelectorAll('.' + CONTENT_TABLE_CLASS + ' tbody tr').length === 0 ?
            0 : this.parent.element.querySelectorAll('.' + CONTENT_TABLE_CLASS + ' tbody tr')[0].children.length;
        timelineView.slotsPerDay = dayLength / timelineView.dateRender.length;
        timelineView.eventHeight = getElementHeightFromClass(timelineView.parent.element, APPOINTMENT_CLASS);
        timelineView.renderEvents(saveObject, resIndex);
    };
    InlineEdit.prototype.getEventDaysCount = function (saveObj) {
        var startDate = saveObj.startTime;
        var endDate = saveObj.endTime;
        var daysCount = Math.abs(endDate.getTime() - startDate.getTime()) / MS_PER_DAY;
        return daysCount;
    };
    InlineEdit.prototype.generateEventData = function (target) {
        var inlineElement = this.parent.element.querySelector('.' + INLINE_SUBJECT_CLASS);
        var subject = inlineElement ? inlineElement.value : target ? target.innerHTML : '';
        var saveObj = {};
        saveObj.subject = subject;
        saveObj.startTime = this.parent.activeCellsData.startTime;
        saveObj.endTime = this.parent.activeCellsData.endTime;
        saveObj.isAllDay = this.parent.activeCellsData.isAllDay;
        if (this.parent.activeCellsData.groupIndex >= 0) {
            saveObj.groupIndex = this.parent.activeCellsData.groupIndex;
        }
        return saveObj;
    };
    InlineEdit.prototype.eventEdit = function (activeEvent) {
        var inlineSubject = this.parent.element.querySelector('.' + INLINE_SUBJECT_CLASS);
        var subject;
        if (inlineSubject) {
            subject = inlineSubject.value;
        }
        else {
            var subEle = activeEvent.querySelector('.' + SUBJECT_CLASS);
            var timeEle = activeEvent.querySelector('.' + APPOINTMENT_TIME);
            subject = subEle.innerText;
            inlineSubject = sf.base.createElement('input', { className: INLINE_SUBJECT_CLASS, attrs: { value: subject } });
            sf.base.addClass([subEle], DISABLE_CLASS);
            if (sf.base.closest(activeEvent, '.' + MORE_POPUP_WRAPPER_CLASS)) {
                activeEvent.insertBefore(inlineSubject, subEle);
            }
            else if (['Agenda', 'MonthAgenda'].indexOf(this.parent.options.currentView) > -1) {
                var subjectWrap = activeEvent.querySelector('.' + SUBJECT_WRAP);
                subjectWrap.insertBefore(inlineSubject, subjectWrap.firstChild);
            }
            else {
                var elementSelector = ['TimelineWeek', 'TimelineMonth'].indexOf(this.parent.options.currentView) > -1 ?
                    '.e-inner-wrap' : '.e-appointment-details';
                activeEvent.querySelector(elementSelector).insertBefore(inlineSubject, timeEle);
            }
        }
        inlineSubject.focus();
        inlineSubject.setSelectionRange(subject.length, subject.length);
    };
    return InlineEdit;
}());

/**
 * Schedule base class
 */
var SfSchedule = /** @class */ (function () {
    function SfSchedule(element, options, viewOptions, dotnetRef) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.options = options;
        this.activeViewOptions = viewOptions;
        this.isAdaptive = sf.base.Browser.isDevice;
        this.uiStateValues = {
            expand: false, isInitial: true, left: 0, top: 0, isGroupAdaptive: false,
            isIgnoreOccurrence: false, groupIndex: 0, action: false, isBlock: false
        };
        this.render();
    }
    SfSchedule.prototype.render = function (isPrevent) {
        if (isPrevent === void 0) { isPrevent = false; }
        this.setHeight();
        this.workCellAction = new WorkCellInteraction(this);
        this.initializeLayout(this.options.currentView);
        this.eventBase = new EventBase(this);
        if (this.options.allowKeyboardInteraction && !this.keyboardInteractionModule) {
            this.keyboardInteractionModule = new KeyboardInteraction(this);
        }
        else if (!this.options.allowKeyboardInteraction && this.keyboardInteractionModule) {
            this.keyboardInteractionModule.destroy();
        }
        if (this.options.allowDragAndDrop) {
            this.dragAndDropModule = new DragAndDrop(this);
        }
        if (this.options.allowResizing) {
            this.resizeModule = new Resize(this);
        }
        if (this.options.allowInline) {
            this.inlineModule = new InlineEdit(this);
        }
        if (!isPrevent) {
            this.wireEvents();
        }
    };
    SfSchedule.prototype.initializeLayout = function (viewName) {
        if (this.activeView) {
            this.activeView.destroy();
        }
        switch (viewName) {
            case 'Day':
            case 'Week':
            case 'WorkWeek':
                this.activeView = new VerticalViews(this);
                break;
            case 'TimelineDay':
            case 'TimelineWorkWeek':
            case 'TimelineWeek':
                this.activeView = new TimelineViews(this);
                break;
            case 'Month':
                this.activeView = new Month(this);
                break;
            case 'MonthAgenda':
                this.activeView = new MonthAgenda(this);
                break;
            case 'TimelineMonth':
                this.activeView = new TimelineMonth(this);
                break;
            case 'Year':
            case 'TimelineYear':
                this.activeView = new Year(this);
                break;
            case 'Agenda':
                this.activeView = new Agenda(this);
                break;
        }
        if (!this.activeView) {
            return;
        }
        this.uiStateValues.isGroupAdaptive = this.isAdaptive && this.activeViewOptions.group.resources.length > 0 &&
            this.activeViewOptions.group.enableCompactView;
        if (this.virtualScrollModule) {
            this.virtualScrollModule = null;
        }
        if (this.options.currentView.indexOf('Timeline') !== -1 && this.activeViewOptions.allowVirtualScrolling
            && this.activeViewOptions.group.resources.length > 0 && !this.uiStateValues.isGroupAdaptive) {
            this.virtualScrollModule = new VirtualScroll(this);
            this.uiStateValues.top = 0;
        }
        this.globalize = new sf.base.Internationalization(this.options.locale);
        this.activeView.getRenderDates();
        this.activeView.renderLayout();
    };
    SfSchedule.prototype.scrollContentReady = function (updateHeight) {
        if (this.virtualScrollModule) {
            if (updateHeight) {
                this.virtualScrollModule.updateVirtualTrackHeight(this.element.querySelector('.' + VIRTUAL_TRACK_CLASS));
                var timeIndicator = this.element.querySelector('.' + CURRENT_TIMELINE_CLASS);
                if (!sf.base.isNullOrUndefined(timeIndicator)) {
                    timeIndicator.style.height =
                        this.element.querySelector('.' + CONTENT_TABLE_CLASS).offsetHeight + 'px';
                }
                var data = { cssProperties: this.getCssProperties() };
                this.onScrollUiUpdate(data);
                return;
            }
            this.virtualScrollModule.setTranslateValue();
        }
    };
    SfSchedule.prototype.scrollToResource = function (groupIndex, levelIndex) {
        var scrollElement = this.element.querySelector('.' + CONTENT_WRAP_CLASS);
        if (this.options.currentView.indexOf('Timeline') < 0 ||
            (this.options.currentView === 'TimelineYear' && this.activeViewOptions.orientation === 'Horizontal')) {
            levelIndex = this.activeViewOptions.group.byDate ? levelIndex + 1 : levelIndex;
            var offsetTarget = this.element.querySelectorAll('.' + DATE_HEADER_WRAP_CLASS + ' tbody tr')[levelIndex];
            scrollElement.scrollLeft = offsetTarget.children[groupIndex].offsetLeft;
        }
        else {
            if (this.virtualScrollModule && this.options.currentView !== 'TimelineYear') {
                var virtual = this.element.querySelector('.e-virtual-track');
                var resWrap = this.element.querySelector('.' + RESOURCE_COLUMN_WRAP_CLASS);
                var averageRowHeight = Math.round(virtual.offsetHeight / parseInt(resWrap.getAttribute('data-expanded-count'), 10));
                scrollElement.scrollTop = (groupIndex * averageRowHeight)
                    - (((this.virtualScrollModule.bufferCount - 1) * averageRowHeight));
                this.virtualScrollModule.virtualScrolling();
                if (this.options.rowAutoHeight) {
                    var td = this.element.querySelector("." + WORK_CELLS_CLASS + "[data-group-index=\"" + groupIndex + "\"]");
                    if (td && !td.parentElement.classList.contains(HIDDEN_CLASS)) {
                        scrollElement.scrollTop =
                            (scrollElement.scrollTop < td.offsetTop) ? td.offsetTop : scrollElement.scrollTop + td.offsetTop;
                    }
                }
                else {
                    scrollElement.scrollTop = (groupIndex * averageRowHeight);
                }
            }
            else {
                var td = this.element.querySelector("." + WORK_CELLS_CLASS + "[data-group-index=\"" + groupIndex + "\"]");
                if (td && !td.parentElement.classList.contains(HIDDEN_CLASS)) {
                    scrollElement.scrollTop = td.offsetTop;
                }
            }
        }
    };
    SfSchedule.prototype.dataReady = function (count, isScrollTop) {
        if (this.activeView) {
            this.activeView.onDataReady({}, count, isScrollTop);
        }
    };
    SfSchedule.prototype.isTimelineView = function () {
        return this.options.currentView.indexOf('Timeline') !== -1;
    };
    SfSchedule.prototype.isAllDayCell = function (td) {
        if (['Month', 'TimelineMonth', 'TimelineYear', 'MonthAgenda'].indexOf(this.options.currentView) > -1 ||
            td.classList.contains(ALLDAY_CELLS_CLASS) ||
            td.classList.contains(HEADER_CELLS_CLASS) || !this.activeViewOptions.timeScale.enable) {
            return true;
        }
        if (this.isTimelineView() && this.activeViewOptions.headerRows.length > 0 &&
            this.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            return true;
        }
        return false;
    };
    SfSchedule.prototype.getDateFromElement = function (td) {
        var dateString = td.getAttribute('data-date');
        if (!sf.base.isNullOrUndefined(dateString)) {
            var dateInMS = parseInt(dateString, 10);
            var date = new Date(dateInMS);
            var localDate = new Date(+date + (date.getTimezoneOffset() * 60000));
            return new Date(localDate.getTime() + (localDate.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
        }
        return undefined;
    };
    SfSchedule.prototype.getMsFromDate = function (date) {
        return new Date(+date - (date.getTimezoneOffset() * 60000)).getTime();
    };
    SfSchedule.prototype.getTimeString = function (date) {
        return this.globalize.formatDate(date, { format: this.options.timeFormat, type: 'time' });
    };
    SfSchedule.prototype.getDateTime = function (date) {
        return date instanceof Date ? new Date(date.getTime()) : new Date(date);
    };
    SfSchedule.prototype.getStartEndTime = function (startEndTime) {
        if (!sf.base.isNullOrUndefined(startEndTime) && startEndTime !== '') {
            var startEndDate = this.resetTime(this.getCurrentTime());
            var timeString = startEndTime.split(':');
            if (timeString.length === 2) {
                startEndDate.setHours(parseInt(timeString[0], 10), parseInt(timeString[1], 10), 0);
            }
            return startEndDate;
        }
        return null;
    };
    SfSchedule.prototype.resetTime = function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    SfSchedule.prototype.getCurrentTime = function () {
        // if (this.timezone) {
        //     let localOffset: number & string = new Date().getTimezoneOffset() as number & string;
        //     return this.tzModule.convert(new Date(), localOffset, this.timezone as number & string);
        // }
        return new Date();
    };
    SfSchedule.prototype.boundaryValidation = function (pageY, pageX) {
        var autoScrollDistance = 30;
        var scrollEdges = { left: false, right: false, top: false, bottom: false };
        var viewBoundaries = this.element.querySelector('.' + CONTENT_WRAP_CLASS).getBoundingClientRect();
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
    };
    SfSchedule.prototype.onCellMouseDown = function (e) {
        if (this.keyboardInteractionModule) {
            this.keyboardInteractionModule.onCellMouseDown(e);
        }
    };
    SfSchedule.prototype.getNavigateView = function () {
        if (this.isTimelineView()) {
            return this.options.currentView === 'TimelineMonth' || this.options.currentView === 'TimelineYear' ? 'TimelineDay' : 'Agenda';
        }
        return 'Day';
    };
    SfSchedule.prototype.addSelectedClass = function (cells, focusCell) {
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            cell.setAttribute('aria-selected', 'true');
        }
        sf.base.addClass(cells, SELECTED_CELL_CLASS);
        if (focusCell) {
            focusCell.setAttribute('tabindex', '0');
            focusCell.focus();
        }
    };
    SfSchedule.prototype.removeSelectedClass = function () {
        var selectedCells = this.getSelectedElements();
        for (var _i = 0, selectedCells_1 = selectedCells; _i < selectedCells_1.length; _i++) {
            var cell = selectedCells_1[_i];
            cell.setAttribute('aria-selected', 'false');
            cell.removeAttribute('tabindex');
        }
        sf.base.removeClass(selectedCells, SELECTED_CELL_CLASS);
    };
    SfSchedule.prototype.setWorkHours = function (dates, start, end, groupIndex) {
        var cells = [];
        cells = this.getWorkHourCells(dates, start, end, groupIndex);
        sf.base.addClass(cells, WORK_HOURS_CLASS);
    };
    SfSchedule.prototype.resetWorkHours = function (dates, start, end, groupIndex) {
        if (dates === void 0) { dates = this.activeView.renderDates; }
        if (dates && start && end) {
            var cells = this.getWorkHourCells(dates, start, end, groupIndex);
            sf.base.removeClass(cells, WORK_HOURS_CLASS);
        }
        else {
            var workHourCells = [].slice.call(this.element.querySelectorAll('.' + WORK_HOURS_CLASS));
            sf.base.removeClass(workHourCells, WORK_HOURS_CLASS);
        }
    };
    SfSchedule.prototype.getWorkHourCells = function (dates, start, end, groupIndex) {
        if (['Agenda', 'MonthAgenda', 'Month', 'TimelineMonth'].indexOf(this.options.currentView) > -1) {
            return [];
        }
        var startHour = this.getStartEndTime(start);
        var endHour = this.getStartEndTime(end);
        var tableEle = this.getContentTable();
        if (sf.base.isNullOrUndefined(startHour) || sf.base.isNullOrUndefined(endHour) || !tableEle) {
            return [];
        }
        startHour.setMilliseconds(0);
        endHour.setMilliseconds(0);
        var viewStartHour = this.activeView.getStartHour();
        if (startHour < viewStartHour) {
            startHour = viewStartHour;
        }
        var viewEndHour = this.activeView.getEndHour();
        if (endHour > viewEndHour) {
            endHour = viewEndHour;
        }
        var msMajorInterval = this.activeViewOptions.timeScale.interval * MS_PER_MINUTE;
        var msInterval = msMajorInterval / this.activeViewOptions.timeScale.slotCount;
        var startIndex = Math.round((startHour.getTime() - viewStartHour.getTime()) / msInterval);
        var endIndex = Math.ceil((endHour.getTime() - viewStartHour.getTime()) / msInterval);
        var tempStartIndex = startIndex;
        var tempEndIndex = endIndex;
        var cells = [];
        for (var _i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
            var date = dates_1[_i];
            date = this.getDateTime(date);
            this.resetTime(date);
            var renderDates = this.activeView.renderDates;
            // if (!isNullOrUndefined(groupIndex) && this.resourceBase && !this.activeView.isTimelineView()) {
            //     renderDates = this.resourceBase.lastResourceLevel[groupIndex].renderDates;
            // }
            var colIndex = this.getIndexOfDate(renderDates, date);
            if (colIndex >= 0) {
                if (this.isTimelineView()) {
                    var slotsPerDay = Math.round((viewEndHour.getTime() - viewStartHour.getTime()) / msInterval);
                    startIndex = tempStartIndex + (colIndex * slotsPerDay);
                    endIndex = tempEndIndex + (colIndex * slotsPerDay);
                }
                for (var i = startIndex; i < endIndex; i++) {
                    if (this.isTimelineView()) {
                        var rowIndex = (!sf.base.isNullOrUndefined(groupIndex)) ? groupIndex : 0;
                        cells.push(tableEle.rows[rowIndex].cells[i]);
                    }
                    else {
                        if (!sf.base.isNullOrUndefined(groupIndex)) {
                            var tds = [].slice.call(tableEle.rows[i].querySelectorAll('.' + WORK_CELLS_CLASS + '[data-group-index="' + groupIndex + '"]'));
                            cells.push(tds[colIndex]);
                        }
                        else {
                            cells.push(tableEle.rows[i].cells[colIndex]);
                        }
                    }
                }
            }
        }
        return cells;
    };
    SfSchedule.prototype.getCellDetails = function (tdCol) {
        var td = (tdCol instanceof Array) ? tdCol : [tdCol];
        var firstTd = sf.base.getElement(td[0]);
        var lastTd = sf.base.getElement(td.slice(-1)[0]);
        var startTime = this.getDateFromElement(firstTd);
        var endTime = this.getDateFromElement(lastTd);
        if (sf.base.isNullOrUndefined(startTime) || sf.base.isNullOrUndefined(endTime)) {
            return undefined;
        }
        var endDateFromColSpan = this.isTimelineView() && !sf.base.isNullOrUndefined(lastTd.getAttribute('colSpan')) &&
            this.activeViewOptions.headerRows.length > 0;
        var duration = endDateFromColSpan ? parseInt(lastTd.getAttribute('colSpan'), 10) : 1;
        if (!this.activeViewOptions.timeScale.enable || endDateFromColSpan || lastTd.classList.contains(ALLDAY_CELLS_CLASS) ||
            lastTd.classList.contains(HEADER_CELLS_CLASS)) {
            endTime = addDays(new Date(endTime.getTime()), duration);
        }
        else {
            endTime = this.activeView.getEndDateFromStartDate(endTime);
        }
        var data = {
            startTime: startTime,
            endTime: endTime,
            isAllDay: this.isAllDayCell(firstTd),
            element: firstTd
        };
        var groupIndex = firstTd.getAttribute('data-group-index');
        if (!sf.base.isNullOrUndefined(groupIndex)) {
            data.groupIndex = parseInt(groupIndex, 10);
        }
        return data;
    };
    SfSchedule.prototype.getSelectedElements = function () {
        return [].slice.call(this.element.querySelectorAll('.' + SELECTED_CELL_CLASS));
    };
    SfSchedule.prototype.selectCell = function (element) {
        this.removeSelectedClass();
        this.addSelectedClass([element], element);
    };
    SfSchedule.prototype.getAllDayRow = function () {
        return this.element.querySelector('.' + ALLDAY_ROW_CLASS);
    };
    SfSchedule.prototype.getTableRows = function () {
        return [].slice.call(this.element.querySelectorAll('.' + CONTENT_TABLE_CLASS + ' tbody tr:not(.' + HIDDEN_CLASS + ')'));
    };
    SfSchedule.prototype.getWorkCellElements = function () {
        return [].slice.call(this.element.querySelectorAll('.' + WORK_CELLS_CLASS));
    };
    SfSchedule.prototype.getContentTable = function () {
        return this.element.querySelector('.e-content-table tbody');
    };
    SfSchedule.prototype.getIndexOfDate = function (collection, date) {
        return collection.map(Number).indexOf(+date);
    };
    SfSchedule.prototype.setHeight = function () {
        this.element.style.height = sf.base.formatUnit(this.options.height);
    };
    SfSchedule.prototype.setDimensions = function () {
        this.setHeight();
        var data = { cssProperties: this.getCssProperties() };
        this.onScrollUiUpdate(data);
    };
    SfSchedule.prototype.getCssProperties = function () {
        var cssProps = {
            border: this.options.enableRtl ? 'borderLeftWidth' : 'borderRightWidth',
            padding: this.options.enableRtl ? 'paddingLeft' : 'paddingRight',
            rtlBorder: this.options.enableRtl ? 'borderRightWidth' : 'borderLeftWidth',
            rtlPadding: this.options.enableRtl ? 'paddingRight' : 'paddingLeft'
        };
        return cssProps;
    };
    SfSchedule.prototype.onScrollUiUpdate = function (args) {
        if (this.activeView) {
            this.activeView.onScrollUiUpdate(args);
        }
    };
    SfSchedule.prototype.onVirtualScroll = function () {
        if (this.virtualScrollModule) {
            this.virtualScrollModule.virtualScrolling();
        }
    };
    SfSchedule.prototype.removeNewEventElement = function () {
        var eventClone = this.element.querySelector('.e-new-event');
        if (!sf.base.isNullOrUndefined(eventClone)) {
            sf.base.remove(eventClone);
        }
    };
    SfSchedule.prototype.closeSidebar = function (e) {
        var sidebar = this.element.querySelector('.e-sidebar');
        if (sf.base.closest(e.target, '.e-icon-menu,.e-sidebar') && sidebar && sidebar.classList.contains('e-open')) {
            e.preventDefault();
            return;
        }
    };
    SfSchedule.prototype.closeHeaderPopup = function (e) {
        var closestEle = sf.base.closest(e.target, '.e-date-range,.e-header-popup,.e-day,.e-selected');
        var element = this.element.querySelector('.e-header-popup');
        if (!sf.base.isNullOrUndefined(closestEle)) {
            return;
        }
        if (element && this.headerPopup) {
            this.headerPopup.hide();
        }
    };
    SfSchedule.prototype.closeQuickPopup = function (e) {
        var classNames = '.' + POPUP_WRAPPER_CLASS + ',.' + HEADER_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS +
            ',.' + WORK_CELLS_CLASS + ',.' + APPOINTMENT_CLASS + ',.e-popup';
        var closestEle = sf.base.closest(e.target, classNames);
        var element = this.element.querySelector('.e-quick-popup-wrapper');
        if (!sf.base.isNullOrUndefined(closestEle)) {
            return;
        }
        if (element && element.childElementCount > 0 && this.quickPopup) {
            this.quickPopup.hide();
        }
        if (sf.base.closest(e.target, '.' + APPOINTMENT_CLASS + ',.' + HEADER_CELLS_CLASS)) {
            this.removeNewEventElement();
        }
        if (!sf.base.closest(e.target, classNames) && this.quickPopup) {
            this.quickPopup.hide();
            this.removeNewEventElement();
        }
    };
    SfSchedule.prototype.beforeOpenEditor = function () {
        this.onClosePopup();
        this.removeNewEventElement();
    };
    SfSchedule.prototype.createCalendarPopup = function () {
        var headerPopupEle = this.element.querySelector('.e-header-popup');
        if (headerPopupEle && !this.headerPopup) {
            this.headerPopup = new sf.popups.Popup(headerPopupEle, {
                actionOnScroll: 'hide',
                targetType: 'relative',
                relateTo: this.isAdaptive ? this.element.querySelector('.e-schedule-toolbar') :
                    this.element.querySelector('.e-date-range'),
                position: { X: 'left', Y: 'bottom' },
                enableRtl: this.options.enableRtl
            });
            this.headerPopup.isStringTemplate = true;
        }
        if (this.headerPopup) {
            if (this.headerPopup.element.classList.contains(POPUP_OPEN)) {
                this.headerPopup.hide();
            }
            else {
                this.headerPopup.show();
            }
        }
    };
    SfSchedule.prototype.createQuickPopup = function (guid) {
        if (this.isAdaptive && sf.base.isNullOrUndefined(guid)) {
            var newEventClone = this.element.querySelector('.' + NEW_EVENT_CLASS);
            if (sf.base.isNullOrUndefined(newEventClone)) {
                newEventClone = sf.base.createElement('div', {
                    className: NEW_EVENT_CLASS,
                    innerHTML: '<div class="e-title">New Event</div>'
                });
            }
            this.currentCell.appendChild(newEventClone);
            return;
        }
        var popupEle = this.element.querySelector('.e-quick-popup-wrapper');
        var isEventPopup;
        if (!sf.base.isNullOrUndefined(guid)) {
            isEventPopup = true;
            this.currentCell = this.element.querySelector('.e-appointment[data-guid="' + guid + '"]');
            this.activeEventData = { element: this.currentCell, guid: [guid] };
        }
        var isWorkCell = this.currentCell.classList.contains(WORK_CELLS_CLASS) ||
            this.currentCell.classList.contains(ALLDAY_CELLS_CLASS);
        if (isWorkCell && this.getSelectedElements().length === 0) {
            this.selectCell(this.currentCell);
        }
        if (popupEle && !this.quickPopup) {
            this.quickPopup = new sf.popups.Popup(popupEle, {
                targetType: (this.isAdaptive ? 'container' : 'relative'),
                enableRtl: this.options.enableRtl,
                relateTo: this.currentCell,
                open: this.quickPopupOpen.bind(this),
                //close: this.quickPopupClose.bind(this),
                hideAnimation: (this.isAdaptive ? { name: 'ZoomOut' } : { name: 'FadeOut', duration: 150 }),
                showAnimation: (this.isAdaptive ? { name: 'ZoomIn' } : { name: 'FadeIn', duration: 150 }),
                collision: (this.isAdaptive ? { X: 'fit', Y: 'fit' } :
                    (this.options.enableRtl ? { X: 'flip', Y: 'fit' } : { X: 'none', Y: 'fit' })),
                position: (this.isAdaptive || this.options.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }),
                viewPortElement: (this.isAdaptive ? document.body : this.element),
                zIndex: (this.isAdaptive ? 1004 : 3)
            });
            this.quickPopup.isStringTemplate = true;
        }
        if (this.quickPopup) {
            if (this.isAdaptive) {
                sf.base.addClass([this.quickPopup.element], 'e-device');
            }
            this.quickPopup.relateTo = this.currentCell;
            if (isEventPopup) {
                this.applyEventColor();
            }
            this.adjustPopupPosition();
        }
    };
    SfSchedule.prototype.applyEventColor = function () {
        var colorField = '';
        if (this.options.currentView === 'Agenda' || this.options.currentView === 'MonthAgenda') {
            colorField = this.options.enableRtl ? 'border-right-color' : 'border-left-color';
        }
        else {
            colorField = 'background-color';
        }
        // tslint:disable-next-line:no-any
        var color = this.activeEventData.element.style[colorField];
        if (color === '') {
            return;
        }
        var colorEle = this.quickPopup.element.querySelector('.' + POPUP_HEADER_CLASS);
        var footerEle = this.quickPopup.element.querySelector('.' + POPUP_FOOTER_CLASS);
        if (footerEle) {
            colorEle = this.quickPopup.element.querySelector('.' + SUBJECT_CLASS);
            if (colorEle) {
                colorEle.style.borderLeftColor = color;
                color = "rgba(" + color.match(/\d+/g).join() + ",0.3)";
            }
        }
        if (colorEle) {
            colorEle.style.backgroundColor = color;
        }
    };
    SfSchedule.prototype.inlineEdit = function (clickType, isTemplate, guid) {
        if (guid === void 0) { guid = null; }
        this.inlineModule.inlineEdit(clickType, isTemplate, guid);
    };
    SfSchedule.prototype.inlineCrudActions = function (target) {
        if (sf.base.closest(target, '.' + INLINE_APPOINTMENT_CLASS)) {
            var saveObj = this.inlineModule.generateEventData(target);
            saveObj.startTime = addLocalOffset(saveObj.startTime);
            saveObj.endTime = addLocalOffset(saveObj.endTime);
            this.dotNetRef.invokeMethodAsync('AddInlineAppointment', saveObj, saveObj.groupIndex);
        }
        else {
            var sub = target.value;
            this.dotNetRef.invokeMethodAsync('SaveInlineAppointment', sub);
        }
        this.inlineModule.removeInlineAppointmentElement();
    };
    SfSchedule.prototype.quickPopupOpen = function () {
        if (this.isAdaptive) {
            this.quickPopup.element.style.top = '0px';
            return;
        }
        if (this.quickPopup.element.querySelector('.' + CELL_POPUP_CLASS)) {
            var subjectElement = this.quickPopup.element.querySelector('.' + SUBJECT_CLASS);
            if (subjectElement) {
                subjectElement.focus();
            }
        }
        else {
            var editElement = this.quickPopup.element.querySelector('.' + EDIT_EVENT_CLASS);
            if (editElement) {
                editElement.focus();
            }
            var editIcon = this.quickPopup.element.querySelector('.' + EDIT_CLASS);
            if (editIcon) {
                editIcon.focus();
            }
        }
    };
    SfSchedule.prototype.adjustPopupPosition = function () {
        var display = this.quickPopup.element.style.display;
        this.quickPopup.element.style.display = 'block';
        if (this.isAdaptive) {
            this.quickPopup.element.removeAttribute('style');
            this.quickPopup.element.style.display = 'block';
            this.quickPopup.element.style.height = sf.base.formatUnit((this.isTapHold) ? 65 : window.innerHeight);
        }
        else {
            this.quickPopup.offsetX = 10;
            this.quickPopup.collision = { X: this.options.enableRtl ? 'flip' : 'none', Y: 'fit' };
            this.quickPopup.position = { X: this.options.enableRtl ? 'left' : 'right', Y: 'top' };
            this.quickPopup.dataBind();
            this.quickPopup.refreshPosition(null, true);
            var collide = sf.popups.isCollide(this.quickPopup.element, this.element);
            if (collide.indexOf(this.options.enableRtl ? 'left' : 'right') > -1) {
                this.quickPopup.offsetX = -this.currentCell.offsetWidth - 10 - this.quickPopup.element.offsetWidth;
                this.quickPopup.dataBind();
                var leftCollide = sf.popups.isCollide(this.quickPopup.element, this.element);
                if (leftCollide.indexOf('left') > -1) {
                    this.quickPopup.position = { X: 'center', Y: 'center' };
                    this.quickPopup.collision = { X: 'fit', Y: 'fit' };
                    this.quickPopup.offsetX = -(this.quickPopup.element.offsetWidth / 2);
                    this.quickPopup.dataBind();
                }
            }
            if (this.virtualScrollModule && (collide.indexOf('top') > -1 || collide.indexOf('bottom') > -1)) {
                var element = this.element.querySelector('.' + CONTENT_WRAP_CLASS + ' table');
                var translateY = getTranslateY(element);
                this.quickPopup.offsetY = translateY;
                this.quickPopup.dataBind();
            }
        }
        // if (isEventPopup) {
        //     this.applyEventColor();
        // }
        this.quickPopup.element.style.display = display;
        this.quickPopup.dataBind();
        this.quickPopup.show();
    };
    SfSchedule.prototype.onQuickPopupClose = function () {
        this.isTapHold = false;
        if (this.quickPopup && this.quickPopup.element.classList.contains(POPUP_OPEN)) {
            this.quickPopup.hide();
        }
        this.eventBase.focusElement();
    };
    SfSchedule.prototype.onClosePopup = function () {
        //this.quickPopupHide();
        if (this.quickPopup) {
            this.quickPopup.hide();
        }
        this.eventBase.focusElement();
    };
    SfSchedule.prototype.createMoreEventPopup = function (clsName, dataDate) {
        var popupEle = this.element.querySelector('.e-more-popup-wrapper');
        if (popupEle && !this.morePopup) {
            this.morePopup = new sf.popups.Popup(popupEle, {
                targetType: (this.isAdaptive ? 'container' : 'relative'),
                enableRtl: this.options.enableRtl,
                hideAnimation: { name: 'ZoomOut', duration: 300 },
                showAnimation: { name: 'ZoomIn', duration: 300 },
                //open: this.morePopupOpen.bind(this),
                //close: this.morePopupClose.bind(this),
                collision: (this.isAdaptive ? { X: 'fit', Y: 'fit' } :
                    (this.options.enableRtl ? { X: 'flip', Y: 'fit' } : { X: 'flip', Y: 'flip' })),
                viewPortElement: (this.isAdaptive ? document.body : this.element),
                zIndex: (this.isAdaptive ? 1002 : 2)
            });
            this.morePopup.isStringTemplate = true;
        }
        if (this.morePopup) {
            var appointments = this.morePopup.element.querySelectorAll('.e-appointment');
            for (var i = 0; i < appointments.length; i++) {
                var ele = appointments[i];
                this.eventBase.wireAppointmentEvents(ele, this.options.currentView === 'TimelineYear' ? true : false, true);
            }
            this.morePopup.relateTo = this.element.querySelector('.' + clsName + '[data-date="' + dataDate + '"]');
            this.morePopup.show();
        }
    };
    SfSchedule.prototype.onMoreEventPopupClose = function () {
        if (this.morePopup && this.morePopup.element.classList.contains(POPUP_OPEN)) {
            this.onQuickPopupClose();
            this.morePopup.hide();
        }
    };
    SfSchedule.prototype.getTooltipPosition = function (fieldName, isQuickPopup) {
        var dlgContent;
        if (isQuickPopup) {
            dlgContent = this.element.querySelector('.e-quick-popup-wrapper');
        }
        else {
            dlgContent = document.querySelector('#' + this.element.id + '_dialog_wrapper' + ' .e-dlg-content');
        }
        var fieldEle = dlgContent.querySelector('#' + fieldName);
        var inputClient = fieldEle.getBoundingClientRect();
        var dlgClient = dlgContent.getBoundingClientRect();
        var toolTipPos = {};
        toolTipPos[fieldName] = 'top:' + (inputClient.bottom - dlgClient.top + dlgContent.scrollTop + 9) +
            'px;left:' + (inputClient.left - dlgClient.left + dlgContent.scrollLeft + inputClient.width / 2) + 'px;';
        this.dotNetRef.invokeMethodAsync('ErrorPositioning', toolTipPos, isQuickPopup);
    };
    SfSchedule.prototype.scrollTo = function (hour, scrollDate) {
        scrollDate = sf.base.isNullOrUndefined(scrollDate) ? scrollDate : this.getDateTime(scrollDate);
        if (this.activeView.scrollToDate && sf.base.isNullOrUndefined(hour) && scrollDate) {
            this.activeView.scrollToDate(scrollDate);
        }
        else if (this.activeView.scrollToHour) {
            this.activeView.scrollToHour(hour, scrollDate);
        }
    };
    SfSchedule.prototype.print = function () {
        var printEle = this.element;
        var currentView = this.options.currentView;
        var clone = printEle.cloneNode(true);
        clone.id = this.element.id + '_print';
        document.body.appendChild(clone);
        function getScrollableElement(scrollElement) {
            if (currentView === 'MonthAgenda') {
                return scrollElement.querySelector('.e-appointment-wrap');
            }
            return scrollElement.querySelector('.e-content-wrap');
        }
        var scrollEle = getScrollableElement(this.element);
        var top = scrollEle.scrollTop;
        var left = scrollEle.scrollLeft;
        var links = [].slice.call(document.getElementsByTagName('head')[0].querySelectorAll('link, style'));
        var reference = '';
        links.forEach(function (link) {
            reference += link.outerHTML;
        });
        var div = sf.base.createElement('div');
        clone.style.width = this.element.offsetWidth + 'px';
        var elementWidth = Math.round((parseInt(clone.style.width, 10)) / 100) * 100;
        div.appendChild(clone);
        var printWindow = window.open('', 'print', 'height=550,width=' + elementWidth + ',tabbar=no');
        printWindow.document.write('<!DOCTYPE html> <html><head>' + reference + '</head><body>' + div.innerHTML +
            '<script> (function() { window.ready = true; })(); </script>' + '</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(function () {
            // tslint:disable-next-line:no-any
            var scrollableEle = getScrollableElement(printWindow.document.body);
            scrollableEle.scrollLeft = left;
            scrollableEle.scrollTop = top;
            var headerTimeCellsScroll = printWindow.document.querySelector('.e-date-header-wrap');
            if (currentView.indexOf('Timeline') !== -1) {
                headerTimeCellsScroll.scrollLeft = left;
            }
            if (currentView === 'Day' || currentView === 'Week'
                || currentView === 'WorkWeek') {
                var timeCellsScroll = printWindow.document.querySelector('.e-time-cells-wrap');
                timeCellsScroll.scrollTop = top;
                headerTimeCellsScroll.scrollLeft = left;
            }
            if (currentView === 'Month') {
                headerTimeCellsScroll.scrollLeft = left;
            }
            printWindow.print();
            printWindow.close();
        }, 2000);
    };
    SfSchedule.prototype.wireEvents = function () {
        this.wireTouchEvents();
        sf.base.EventHandler.add(window, 'resize', this.onScheduleResize, this);
        sf.base.EventHandler.add(window, 'orientationchange', this.onScheduleResize, this);
        sf.base.EventHandler.add(document, sf.base.Browser.touchStartEvent, this.onDocumentClick, this);
    };
    SfSchedule.prototype.unwireEvents = function () {
        this.unwireTouchEvents();
        sf.base.EventHandler.remove(window, 'resize', this.onScheduleResize);
        sf.base.EventHandler.remove(window, 'orientationchange', this.onScheduleResize);
        sf.base.EventHandler.remove(document, sf.base.Browser.touchStartEvent, this.onDocumentClick);
    };
    SfSchedule.prototype.wireTouchEvents = function () {
        var element = this.element.querySelector('.' + TABLE_CONTAINER_CLASS);
        if (element && sf.base.isNullOrUndefined(this.touchObj)) {
            this.touchObj = new sf.base.Touch(element, {
                tapHold: this.tapHoldHandler.bind(this)
            });
        }
    };
    SfSchedule.prototype.unwireTouchEvents = function () {
        if (this.touchObj) {
            this.touchObj.destroy();
        }
    };
    SfSchedule.prototype.tapHoldHandler = function (e) {
        var target = sf.base.closest(e.originalEvent.target, '.' + APPOINTMENT_CLASS);
        if (!sf.base.isNullOrUndefined(target) && this.isAdaptive) {
            var guid = target.getAttribute('data-guid');
            this.isTapHold = true;
            this.selectedElements = [].slice.call(this.element.querySelectorAll('.' + APPOINTMENT_BORDER));
            this.eventBase.getSelectedEventElements(target);
            this.dotNetRef.invokeMethodAsync('OnTapHold', guid, this.isTapHold);
            return;
        }
    };
    SfSchedule.prototype.onScheduleResize = function () {
        this.onClosePopup();
        if (this.morePopup) {
            this.morePopup.hide();
        }
        if (this.options.currentView === 'Month' || !this.activeViewOptions.timeScale.enable || this.isTimelineView()) {
            this.activeView.resetColWidth();
            this.onScrollUiUpdate({ cssProperties: this.getCssProperties(), isPreventScrollUpdate: true });
            this.dataReady();
        }
    };
    SfSchedule.prototype.onDocumentClick = function (e) {
        if (this.options.allowInline) {
            var target_1 = this.element.querySelector('.' + INLINE_SUBJECT_CLASS);
            if (target_1 && target_1.value !== '') {
                this.inlineCrudActions(target_1);
            }
            else {
                this.inlineModule.removeInlineAppointmentElement();
            }
        }
        this.closeHeaderPopup(e);
        this.closeSidebar(e);
        this.closeQuickPopup(e);
        if (this.eventBase) {
            this.eventBase.appointmentBorderRemove(e);
        }
        var target = e.target;
        if (this.morePopup && !sf.base.closest(target, '.' + MORE_POPUP_WRAPPER_CLASS) && !target.classList.contains(MORE_INDICATOR_CLASS)
            && (!sf.base.closest(target, '.' + POPUP_OPEN)) && !sf.base.closest(target, '.' + WORK_CELLS_CLASS)) {
            this.morePopup.hide();
        }
    };
    SfSchedule.prototype.setPersistence = function () {
        if (this.options.enablePersistence) {
            var props = { selectedDate: this.options.selectedDate, currentView: this.options.currentView };
            window.localStorage.setItem(this.element.id, JSON.stringify(props));
        }
    };
    SfSchedule.prototype.destroy = function () {
        this.isDestroyed = true;
        this.setPersistence();
        this.unwireEvents();
        if (this.headerPopup) {
            this.headerPopup.destroy();
        }
        if (this.quickPopup) {
            this.quickPopup.destroy();
        }
        if (this.morePopup) {
            this.morePopup.destroy();
        }
        if (this.keyboardInteractionModule) {
            this.keyboardInteractionModule.destroy();
        }
        if (this.activeView) {
            this.activeView.destroy();
            this.activeView = null;
        }
    };
    return SfSchedule;
}());

// tslint:disable
var Schedule = {
    initialize: function (element, options, viewOptions, dotnetRef) {
        if (element) {
            options.selectedDate = new Date(options.selectedDate);
            options.minDate = new Date(options.minDate);
            options.maxDate = new Date(options.maxDate);
            if (sf.base.isNullOrUndefined(viewOptions.group.resources)) {
                viewOptions.group.resources = [];
            }
            if (element.blazor__instance) {
                element.blazor__instance.options = options;
                element.blazor__instance.activeViewOptions = viewOptions;
                element.blazor__instance.render(true);
                element.blazor__instance.setPersistence();
            }
            else {
                new SfSchedule(element, options, viewOptions, dotnetRef);
                dotnetRef.invokeMethodAsync('TriggerCreatedEvent');
            }
        }
    },
    loadCldr: function (cultureData) {
        sf.base.loadCldr(JSON.parse(cultureData));
    },
    createCalendarPopup: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.createCalendarPopup();
        }
    },
    exportSave: function (fileName, fileType) {
        if (navigator.msSaveBlob) {
            //Download document in Edge browser
            var data = window.atob(fileType);
            var bytes = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                bytes[i] = data.charCodeAt(i);
            }
            var blob = new Blob([bytes.buffer], { type: 'application/octet-stream' });
            navigator.msSaveBlob(blob, fileName);
        }
        else {
            var link = document.createElement('a');
            link.download = fileName;
            link.href = 'data:application/octet-stream;base64,' + fileType;
            document.body.appendChild(link); // Needed for Firefox
            link.click();
            document.body.removeChild(link);
        }
    },
    exportToICS: function (icsString, fileName) {
        var buffer = new Blob([icsString], { type: 'data:text/calendar;charset=utf8' });
        fileName = (fileName || 'Calendar') + '.ics';
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(buffer, fileName);
        }
        else {
            var downloadLink_1 = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            downloadLink_1.download = fileName;
            downloadLink_1.href = URL.createObjectURL(buffer);
            var event_1 = document.createEvent('MouseEvent');
            event_1.initEvent('click', true, true);
            downloadLink_1.dispatchEvent(event_1);
            setTimeout(function () {
                URL.revokeObjectURL(downloadLink_1.href);
                downloadLink_1.href = undefined;
            });
        }
    },
    scrollTo: function (element, hour, scrollDate) {
        if (element && element.blazor__instance) {
            element.blazor__instance.scrollTo(hour, scrollDate);
        }
    },
    destroy: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.destroy();
        }
    },
    validation: function (element, fieldName, isQuickPopup) {
        if (element && element.blazor__instance) {
            element.blazor__instance.getTooltipPosition(fieldName, isQuickPopup);
        }
    },
    createQuickPopup: function (element, guid) {
        if (element && element.blazor__instance) {
            element.blazor__instance.createQuickPopup(guid);
        }
    },
    adjustPopupPosition: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.adjustPopupPosition();
        }
    },
    closeQuickInfoPopup: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.onQuickPopupClose();
        }
    },
    createMoreEventPopup: function (element, clsName, dataDate) {
        if (element && element.blazor__instance) {
            element.blazor__instance.createMoreEventPopup(clsName, dataDate);
        }
    },
    moreEventPopupClose: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.onMoreEventPopupClose();
        }
    },
    dataReady: function styleAttribute(element, groupAdaptive, count, isScrollTop) {
        if (element && element.blazor__instance) {
            element.blazor__instance.uiStateValues.isGroupAdaptive = groupAdaptive;
            element.blazor__instance.dataReady(count, isScrollTop);
        }
    },
    beforeOpenEditor: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.beforeOpenEditor();
        }
    },
    scrollContentReady: function (element, updateHeight) {
        if (element && element.blazor__instance) {
            element.blazor__instance.scrollContentReady(updateHeight);
        }
    },
    scrollToResource: function (element, groupIndex, levelIndex) {
        if (element && element.blazor__instance) {
            element.blazor__instance.scrollToResource(groupIndex, levelIndex);
        }
    },
    printSchedule: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.print();
        }
    },
    inlineEdit: function (element, clickType, isTemplate, guid) {
        if (guid === void 0) { guid = null; }
        if (element && element.blazor__instance) {
            element.blazor__instance.inlineEdit(clickType, isTemplate, guid);
        }
    },
    setWorkHours: function (element, dates, start, end, groupIndex) {
        if (element && element.blazor__instance) {
            element.blazor__instance.setWorkHours(dates, start, end, groupIndex);
        }
    },
    resetWorkHours: function (element, dates, start, end, groupIndex) {
        if (element && element.blazor__instance) {
            element.blazor__instance.resetWorkHours(dates, start, end, groupIndex);
        }
    },
    getSelectedDetails: function (element, isEvent) {
        if (element && element.blazor__instance) {
            if (isEvent) {
                var eventGuid_1;
                var selectedElements = [].slice.call(element.querySelectorAll('.' + APPOINTMENT_BORDER));
                selectedElements.forEach(function (ele) {
                    eventGuid_1.push(ele.getAttribute('data-guid'));
                });
                return JSON.stringify(eventGuid_1);
            }
            else {
                var selectedElements = element.blazor__instance.getSelectedElements();
                var clickArgs = element.blazor__instance.getCellDetails(selectedElements);
                clickArgs.startTime = addLocalOffset(clickArgs.startTime);
                clickArgs.endTime = addLocalOffset(clickArgs.endTime);
                return JSON.stringify(clickArgs);
            }
        }
        return null;
    },
    getTargetDetails: function (element, left, top, targetType) {
        if (element && element.blazor__instance) {
            var target = document.elementFromPoint(left, top);
            var targetElement = void 0;
            if (target && targetType == "event") {
                targetElement = sf.base.closest(target, '.' + APPOINTMENT_CLASS);
                if (targetElement) {
                    return JSON.stringify(targetElement.getAttribute('data-guid'));
                }
            }
            else if (target && targetType == "cell") {
                targetElement = sf.base.closest(target, '.' + HEADER_CELLS_CLASS + ',.' + ALLDAY_CELLS_CLASS + ',.' + WORK_CELLS_CLASS);
                if (targetElement) {
                    var clickArgs = element.blazor__instance.getCellDetails(targetElement);
                    clickArgs.startTime = addLocalOffset(clickArgs.startTime);
                    clickArgs.endTime = addLocalOffset(clickArgs.endTime);
                    return JSON.stringify(clickArgs);
                }
            }
            else if (target && targetType == "resource") {
                targetElement = sf.base.closest(target, '.' + RESOURCE_CELLS_CLASS);
                return JSON.stringify(targetElement.getAttribute('data-group-index'));
            }
            return null;
        }
        return null;
    }
};

return Schedule;

}());
