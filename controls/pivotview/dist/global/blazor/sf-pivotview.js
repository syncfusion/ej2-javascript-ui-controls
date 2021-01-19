window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.PivotView = (function () {
'use strict';

/**
 * CSS class constants
 */
var ICON = 'e-icons';
var ICON_HIDDEN = 'e-hide';
var AXISFIELD_ICON_CLASS = 'e-dropdown-icon';
var TOGGLE_FIELD_LIST_CLASS = 'e-toggle-field-list';
var FIELD_LIST_FOOTER_CLASS = 'e-field-list-footer';
var LEFT_AXIS_PANEL_CLASS = 'e-left-axis-fields';
var RIGHT_AXIS_PANEL_CLASS = 'e-right-axis-fields';
var AXIS_CONTENT_CLASS = 'e-axis-content';
var PIVOT_BUTTON_DIV_CLASS = 'e-pvt-btn-div';
var PIVOT_BUTTON_CLASS = 'e-pivot-button';
var PIVOT_BUTTON_CONTENT_CLASS = 'e-content';
var DRAG_CLONE_CLASS = 'e-button-drag-clone';
var DRAG_CLASS = 'e-drag';
var DRAG_DISABLE_CLASS = 'e-disable-drag';
var DROP_INDICATOR_CLASS = 'e-drop-indicator';
var INDICATOR_HOVER_CLASS = 'e-drop-hover';

var EDITOR_TREE_CONTAINER_CLASS = 'e-member-editor-container';

var NODE_CHECK_CLASS = 'e-check';
var CALCULATED_FIELD = 'CalculatedField';

var DROPPABLE_CLASS = 'e-droppable';
var ROW_AXIS_CLASS = 'e-rows';
var COLUMN_AXIS_CLASS = 'e-columns';
var FILTER_AXIS_CLASS = 'e-filters';
var GROUP_ROW = 'e-group-row';
var GROUP_ROW_CLASS = 'e-group-rows';
var GROUP_COLUMN_CLASS = 'e-group-columns';
var GROUP_VALUE_CLASS = 'e-group-values';
var GROUP_FILTER_CLASS = 'e-group-filters';
var NO_DRAG_CLASS = 'e-drag-restrict';
var SELECTED_NODE_CLASS = 'e-list-selected';
var LIST_ITEM = 'e-list-item';
var TEXT_CONTENT_CLASS = 'e-text-content';
var FOOTER_CONTENT_CLASS = 'e-footer-content';
var ADAPTIVE_CONTAINER_CLASS = 'e-adaptive-container';
var LIST_TEXT_CLASS = 'e-list-text';
var LIST_SELECT_CLASS = 'e-selected-node';
var VALUESCONTENT = 'e-valuescontent';
var HEADERCELL = 'e-headercell';
var CELLVALUE = 'e-cellvalue';
var ROW = 'e-row';
var SELECT_ALL_CLASS = 'e-select-all';
var PIVOTCALC = 'e-pivot-calc';
var CALCDIALOG = 'e-pivot-calc-dialog-div';
var OLAP_CALCDIALOG = 'e-olap-calc-dialog-div';
var CALCINPUT = 'e-pivot-calc-input';
var FORMAT = 'e-format';
var FORMULA = 'e-pivot-formula';
var TREEVIEW = 'e-pivot-treeview';
var CALCACCORD = 'e-pivot-accord';
var AXIS_ROW_CLASS = 'e-axis-row';
var CALC_EDIT = 'e-edit';
var CALC_EDITED = 'e-edited';
var EMPTY_FIELD = 'e-empty-field';
var CALCCHECK = 'e-pivot-calc-check';
var MOVABLECONTENT_DIV = 'e-movablecontent';
var FROZENCONTENT_DIV = 'e-frozencontent';
var MOVABLEHEADER_DIV = 'e-movableheader';
var FROZENHEADER_DIV = 'e-frozenheader';
var HEADERCONTENT = 'e-headercontent';
var ROW_CELL_CLASS = 'e-rowcell';
var GRID_REMOVE = 'e-remove-report';
var GRID_TOOLBAR = 'e-pivot-toolbar';
var GRID_REPORT_INPUT = 'e-pivotview-report-input';
var GROUP_CHART_ROW = 'e-group-chart-rows';
var GROUP_CHART_COLUMN = 'e-group-chart-columns';
var GROUP_CHART_VALUE = 'e-group-chart-values';
var GROUP_CHART_VALUE_DROPDOWN = 'e-group-chart-values-drodown';
var GROUP_CHART_COLUMN_DROPDOWN = 'e-group-chart-columns-dropdown';
var CHART_GROUPING_BAR_CLASS = 'e-chart-grouping-bar';
var GRID_GROUPING_BAR_CLASS = 'e-pivot-grouping-bar';
var MDX_QUERY_CONTENT = 'e-mdx-query-content';
var HEADER_TEXT = 'e-headertext';
var STACKED_HEADER_TEXT = 'e-stackedheadertext';
var HEADER_CELL_DIV = 'e-headercelldiv';
var STACKED_HEADER_CELL_DIV = 'e-stackedheadercelldiv';
var STACKED_HEADER_CELL = 'e-stackedheadercell';
var AXIS_CONTAINER = 'e-axis-container';
var COLUMN_HEADER = 'e-columnheader';
var SORT_FILTER_DIV = 'e-sortfilterdiv';
var RESIZE_HANDLER = 'e-rhandler';
var COPY_DROP = 'e-copy-drop';
var ICON_EXPAND = 'e-icon-expandable';
var LIST_ICON = 'e-list-icon';
var CALC_DIMENSION_ICON = 'e-calc-dimension-icon';
var CALC_MEASURE_ICON = 'e-calc-measure-icon';
var MEASURE_ICON = 'e-measure-icon';
var DIMENSION_TYPE_ICON = 'e-dimensionCDB-icon';
var ATTRIBUTE_TYPE_ICON = 'e-attributeCDB-icon';
var HIERARCHY_TYPE_ICON = 'e-hierarchyCDB-icon';
var LEVEL_MEMBERS = 'e-level-members';
var NAMEDSET_TYPE_ICON = 'e-namedSetCDB-icon';
var NODE_FOCUS = 'e-node-focus';
var HOVER = 'e-hover';
var CALC_MEMBER = 'e-calc-member';
var ACCORD_HEADER = 'e-acrdn-header';
var ACCORDION = 'e-accordion';
var LABEl = 'e-label';
var TOGGLE_ICON = 'e-toggle-icon';
var ACCORD_HEADER_ICON = 'e-acrdn-header-icon';
var TOGGLE_COLLAPSE_ICON = 'e-tgl-collapse-icon';
var ACCORD_ITEM = 'e-acrdn-item';

var FOLDER_TYPE_ICON = 'e-folderCDB-icon';
var FOLDER_TYPE_OPEN_ICON = 'e-folderCDB-open-icon';
var ICON_COLLAPSE = 'e-icon-collapsible';
var CALC_FIELD_MEMBER = 'e-calcfieldmember';
var ICON_SPACE = 'e-iconspace';
var DRAG_ITEM = 'e-drag-item';
var TREEVIEW_CLASS = 'e-treeview';
var CHECKBOX_CONTAINER = 'e-checkbox-wrapper';
var CALC_MEMBER_GROUP_TYPE_ICON = 'e-calcMemberGroupCDB';
var MEASURE_GROUP_TYPE_ICON = 'e-measureGroupCDB-icon';
var KPI_ICON = 'e-kpiCDB-icon';
var KPI_GOAL_ICON = 'e-kpiGoal-icon';
var KPI_STATUS_ICON = 'e-kpiStatus-icon';
var KPI_TREND_ICON = 'e-kpiTrend-icon';
var KPI_VALUE_ICON = 'e-kpiValue-icon';
var VALUE_AXIS_CLASS = 'e-values';
var AXIS_FILTER_CLASS = 'e-axis-filter';
var SORT_CLASS = 'e-sort';
var FILTER_COMMON_CLASS = 'e-btn-filter';
var REMOVE_CLASS = 'e-remove';
var POPUP = 'e-popup';
var POPUP_OPEN = 'e-popup-open';
var PREV_ACTIVE_NODE = 'e-prev-active-node';
var FULL_ROW = 'e-fullrow';
var PIVOT_VIEW_CLASS = 'e-pivotview';
var GROUP_PIVOT_ROW = 'e-group-pivot-rows';
var ROWSHEADER = 'e-rowsheader';
var FOCUSED_CLASS = 'e-focused';
var MENU_ITEM_CLASS = 'e-menu-item';
var GRID_CLASS = 'e-grid';
var EDITOR_TREE_OUTER_DIV_CLASS = 'e-member-editor-outer-container';
var TOOLBAR_ITEM = 'e-toolbar-item';
var TOOLBAR_ITEMS = 'e-toolbar-items';
var MENU = 'e-menu';
var MENU_PARENT = 'e-menu-parent';
var MENU_CARET_ICON = 'e-menu-caret-icon';
var SELECTED_CLASS = 'e-selected';
var OVERLAY = 'e-overlay';
var BUTTON_FOCUSED = 'e-btn-focused';
var MOVABLE_FIRST = 'e-movablefirst';
var ROW_SELECT = 'e-rowselect';
var SPAN_CLICKED = 'e-spanclicked';
var COLUMNSHEADER = 'e-columnsheader';
var CELL_SELECTED_BGCOLOR = 'e-cellselectionbackground';
var CELL_ACTIVE_BGCOLOR = 'e-active';
var SELECTED_BGCOLOR = 'e-selectionbackground';
var TABLE = 'e-table';
var VIRTUALTRACK_DIV = 'e-virtualtrack';
var ASCENDING_CLASS = 'e-ascending';
var DESCENDING_CLASS = 'e-descending';
var VALUESHEADER = 'e-valuesheader';
var GRID_HEADER = 'e-gridheader';
var GROUPING_BAR_CLASS = 'e-grouping-bar';
var SUBTOTAL = 'e-stot';
var PIVOT_FIELD_LIST_CLASS = 'e-pivotfieldlist';
var EXPAND_ICON = 'e-expand';
var COLLAPSE_ICON = 'e-collapse';
var PIVOT_CHART = 'e-pivotchart';
var COLOR_PICKER_CONTAINER = 'e-colorpicker-container';
var FORMAT_FONT_COLOR_PICKER_CONTAINER = 'e-format-font-color-picker-container';
var FORMAT_BACK_COLOR_PICKER_CONTAINER = 'e-format-back-color-picker-container';
var FORMAT_COLOR_PICKER = 'e-format-color-picker';
var FORMAT_FONT_COLOR_PICKER = 'e-format-font-color-picker';
var COLOR_PICKER = 'e-colorpicker';
var FORMAT_FONT_COLOR = 'e-format-font-color';
var SELECTED_COLOR = 'e-selected-color';
var FORMAT_BACK_COLOR = 'e-format-back-color';

/**
 * The `Grouping` module is used to show or hide columns dynamically.
 */
var PivotButton = /** @class */ (function () {
    function PivotButton(parent) {
        this.parent = parent;
        this.parent.pivotButtonModule = this;
    }
    PivotButton.prototype.createPivotButtonDrop = function () {
        for (var _i = 0, _a = [].slice.call(this.parent.parentElement.querySelectorAll('.' + AXIS_CONTENT_CLASS)); _i < _a.length; _i++) {
            var element = _a[_i];
            new sf.base.Droppable(element, {});
            this.unWireEvents(element);
            this.wireEvents(element);
        }
    };
    PivotButton.prototype.setPivotButtonDrag = function () {
        for (var _i = 0, _a = [].slice.call(this.parent.parentElement.querySelectorAll('.' + (this.parent instanceof SfPivotView ? GROUPING_BAR_CLASS : PIVOT_FIELD_LIST_CLASS) + '-button')); _i < _a.length; _i++) {
            var element = _a[_i];
            var buttonElement = element.querySelector('.' + PIVOT_BUTTON_CLASS);
            this.parent.pivotButtonModule.createDraggable(false, this.parent instanceof SfPivotView ?
                buttonElement.querySelector('.' + PIVOT_BUTTON_CONTENT_CLASS) : buttonElement.firstElementChild, JSON.parse(buttonElement.getAttribute('data-fieldInfo')));
        }
    };
    PivotButton.prototype.createDraggable = function (isTreeElement, element, field) {
        var _this = this;
        this.draggable = new sf.base.Draggable(element, {
            clone: true,
            enableTailMode: true,
            enableAutoScroll: true,
            helper: this.createDragClone.bind(this, field),
            dragStart: this.onDragStart.bind(this, isTreeElement),
            drag: function (e) {
                _this.draggable.setProperties({ cursorAt: { top: (!sf.base.isNullOrUndefined(e.event.targetTouches) || sf.base.Browser.isDevice) ? 60 : -20, } });
            },
            dragStop: this.onDragStop.bind(this, isTreeElement),
            abort: (this.parent instanceof SfPivotView ? !(this.parent.groupingBarSettings.allowDragAndDrop && field.allowDragAndDrop) ?
                '.' + PIVOT_BUTTON_CLASS : '' : !field.allowDragAndDrop ? '.' + PIVOT_BUTTON_CLASS : '')
        });
        if (!isTreeElement) {
            this.unWireEvents(element);
            this.wireEvents(element);
        }
    };
    PivotButton.prototype.createDragClone = function (field) {
        var cloneElement = sf.base.createElement('div', {
            id: this.parent.element.id + '_DragClone',
            className: DRAG_CLONE_CLASS
        });
        var contentElement = sf.base.createElement('span', {
            className: TEXT_CONTENT_CLASS,
            innerHTML: field ? field.caption ? field.caption : field.name : ''
        });
        cloneElement.appendChild(contentElement);
        document.body.appendChild(cloneElement);
        return cloneElement;
    };
    PivotButton.prototype.onDragStart = function (isTreeElement, e) {
        var _this = this;
        var element = sf.base.closest(e.element, '.' + (isTreeElement ? LIST_ITEM : PIVOT_BUTTON_CLASS));
        this.parent.dotNetRef.invokeMethodAsync('TriggerNodeDraggingEvent', element.getAttribute('data-uid')).then(function (eventArgs) {
            if (!eventArgs.cancel) {
                _this.parent.isDragging = true;
                var data = _this.parent.fieldList[element.getAttribute('data-uid')];
                var axis = [ROW_AXIS_CLASS, COLUMN_AXIS_CLASS, FILTER_AXIS_CLASS];
                sf.base.addClass([isTreeElement ? element.querySelector('.' + LIST_TEXT_CLASS) : element], SELECTED_NODE_CLASS);
                if (data && data.aggregateType === 'CalculatedField') {
                    for (var _i = 0, axis_1 = axis; _i < axis_1.length; _i++) {
                        var axisContent = axis_1[_i];
                        sf.base.addClass([_this.parent.parentElement.querySelector('.' + axisContent)], NO_DRAG_CLASS);
                    }
                }
                e.bindEvents(e.dragElement);
            }
            else {
                _this.parent.isDragging = false;
                _this.draggable.intDestroy(e.event);
                sf.base.detach(document.getElementById(_this.parent.element.id + '_DragClone'));
            }
        });
    };
    PivotButton.prototype.onDragStop = function (isTreeElement, args) {
        this.parent.isDragging = false;
        var cancel = false;
        if (!isTreeElement && args.target.classList &&
            (args.target.classList.contains(GROUP_CHART_VALUE) || args.target.classList.contains(GROUP_CHART_VALUE_DROPDOWN))) {
            args.target = this.parent.element.querySelector('.' + GROUP_CHART_ROW);
        }
        if (!isTreeElement && args.target.classList && args.element &&
            (args.target.classList.contains(GROUP_CHART_COLUMN) || args.target.classList.contains(GROUP_CHART_COLUMN_DROPDOWN))) {
            cancel = true;
        }
        var element = sf.base.closest(args.element, '.' + (isTreeElement ? LIST_ITEM : PIVOT_BUTTON_CLASS));
        if (this.parent.parentElement.querySelector('.' + SELECTED_NODE_CLASS)) {
            sf.base.removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + SELECTED_NODE_CLASS)), SELECTED_NODE_CLASS);
        }
        var axis = [ROW_AXIS_CLASS, COLUMN_AXIS_CLASS, FILTER_AXIS_CLASS];
        for (var _i = 0, axis_2 = axis; _i < axis_2.length; _i++) {
            var axisContent = axis_2[_i];
            sf.base.removeClass([this.parent.parentElement.querySelector('.' + axisContent)], NO_DRAG_CLASS);
        }
        sf.base.removeClass([isTreeElement ? element.querySelector('.' + LIST_TEXT_CLASS) : element], SELECTED_NODE_CLASS);
        if (document.getElementById(this.parent.element.id + '_DragClone')) {
            sf.base.remove(args.helper ? args.helper : document.getElementById(this.parent.element.id + '_DragClone'));
        }
        document.body.style.cursor = 'auto';
        if (!this.isNodeDropped(isTreeElement, args, element) || !isTreeElement && cancel) {
            return;
        }
        this.nodeStateModified(isTreeElement, args, cancel, element.getAttribute('data-uid'));
    };
    PivotButton.prototype.nodeStateModified = function (isTreeElement, args, cancel, fieldName) {
        /* tslint:disable */
        var target = sf.base.closest(args.target, '.' + DROPPABLE_CLASS) ? JSON.stringify(window.sfBlazor.getDomObject('dropTarget', sf.base.closest(args.target, '.' + DROPPABLE_CLASS))) : undefined;
        var element = isTreeElement ? undefined : JSON.stringify(window.sfBlazor.getDomObject('element', args.element.parentElement));
        this.parent.dotNetRef.invokeMethodAsync('OnFieldDropped', window.sfBlazor.getDomObject('target', args.target).xPath, target, element, isTreeElement || cancel ? true : false, fieldName);
        /* tslint:enable */
    };
    PivotButton.prototype.isNodeDropped = function (isTreeElement, args, element) {
        var isDropped = true;
        var targetID = element.getAttribute('data-uid');
        if ((this.parent.fieldList[targetID] && this.parent.fieldList[targetID].isSelected) || !isTreeElement) {
            var target = isTreeElement ? this.getButton(targetID) : element;
            var axisPanel = sf.base.closest(target, '.' + DROPPABLE_CLASS);
            var droppableElement = sf.base.closest(args.target, '.' + DROPPABLE_CLASS);
            if (target && axisPanel === droppableElement) {
                var pivotButtons = [].slice.call(axisPanel.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
                var dropTarget = sf.base.closest(args.target, '.' + PIVOT_BUTTON_DIV_CLASS);
                var sourcePosition = void 0;
                var dropPosition = -1;
                for (var i = 0; i < pivotButtons.length; i++) {
                    if (pivotButtons[i].id === target.id) {
                        sourcePosition = i;
                    }
                    if (dropTarget) {
                        var droppableButton = dropTarget.querySelector('.' + PIVOT_BUTTON_CLASS);
                        if (pivotButtons[i].id === droppableButton.id) {
                            dropPosition = i;
                        }
                    }
                }
                if (sourcePosition === dropPosition || sourcePosition === pivotButtons.length - 1 && dropPosition === -1) {
                    /* tslint:disable-next-line:max-line-length */
                    sf.base.removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
                    isDropped = false;
                }
            }
        }
        return isDropped;
    };
    PivotButton.prototype.getButton = function (fieldName) {
        for (var _i = 0, _a = [].slice.call(this.parent.parentElement.querySelectorAll('.' + PIVOT_BUTTON_CLASS)); _i < _a.length; _i++) {
            var buttonElement = _a[_i];
            if (buttonElement.id === fieldName) {
                return buttonElement;
            }
        }
        return undefined;
    };
    PivotButton.prototype.getButtonPosition = function (target, droppedClass) {
        var buttonElement = sf.base.closest(target, '.' + PIVOT_BUTTON_DIV_CLASS);
        if (buttonElement) {
            buttonElement = buttonElement.querySelector('.' + PIVOT_BUTTON_CLASS);
            /* tslint:disable-next-line:max-line-length */
            var pivotButtons = [].slice.call(this.parent.parentElement.querySelector('.e-' + droppedClass).querySelectorAll('.' + PIVOT_BUTTON_CLASS));
            for (var i = 0, n = pivotButtons.length; i < n; i++) {
                if (pivotButtons[i].id === buttonElement.id) {
                    return i;
                }
            }
        }
        return -1;
    };
    PivotButton.prototype.wireEvents = function (element) {
        sf.base.EventHandler.add(element, 'mouseover', this.parent.commonActionModule.updateDropIndicator, this);
        sf.base.EventHandler.add(element, 'mouseleave', this.parent.commonActionModule.updateDropIndicator, this);
    };
    PivotButton.prototype.unWireEvents = function (element) {
        sf.base.EventHandler.remove(element, 'mouseover', this.parent.commonActionModule.updateDropIndicator);
        sf.base.EventHandler.remove(element, 'mouseleave', this.parent.commonActionModule.updateDropIndicator);
    };
    PivotButton.prototype.destroy = function () {
        for (var _i = 0, _a = [].slice.call(this.parent.parentElement.querySelectorAll('.' + AXIS_CONTENT_CLASS)); _i < _a.length; _i++) {
            var element = _a[_i];
            this.unWireEvents(element);
        }
        if (this.draggable && this.draggable.isDestroyed)
            this.draggable.destroy();
    };
    return PivotButton;
}());

/**
 * Module for GroupingBar rendering
 */
var GroupingBar = /** @class */ (function () {
    function GroupingBar(parent) {
        this.parent = parent;
        this.parent.groupingBarModule = this;
        this.parent.pivotButtonModule = new PivotButton(this.parent);
    }
    GroupingBar.prototype.updatePivotButtons = function () {
        this.createPivotButtonDrop();
        this.parent.pivotButtonModule.setPivotButtonDrag();
    };
    GroupingBar.prototype.createPivotButtonDrop = function () {
        for (var _i = 0, _a = [].slice.call(this.parent.element.querySelectorAll('.' + AXIS_CONTAINER)); _i < _a.length; _i++) {
            var element = _a[_i];
            var buttonElement = element.firstElementChild;
            if (this.parent.groupingBarSettings.allowDragAndDrop) {
                new sf.base.Droppable(buttonElement, {});
            }
            this.unWireEvent(buttonElement);
            this.wireEvent(buttonElement);
        }
    };
    GroupingBar.prototype.refreshUI = function () {
        /* tslint:disable */
        var groupingTable = this.parent.element.querySelector('.' + GRID_GROUPING_BAR_CLASS);
        var groupingChartTable = this.parent.element.querySelector('.' + CHART_GROUPING_BAR_CLASS);
        if (groupingChartTable) {
            groupingChartTable.style.width = this.parent.internalGrid.element.offsetWidth + 'px';
        }
        if (groupingTable) {
            groupingTable.style.minWidth = '400px';
            var rowPanel = groupingTable.querySelector('.' + GROUP_ROW_CLASS);
            var valuePanel = groupingTable.querySelector('.' + GROUP_VALUE_CLASS);
            var columnPanel = groupingTable.querySelector('.' + GROUP_COLUMN_CLASS);
            var filterPanel = groupingTable.querySelector('.' + GROUP_FILTER_CLASS);
            var leftAxisPanel = groupingTable.querySelector('.' + LEFT_AXIS_PANEL_CLASS);
            var rightAxisPanel = groupingTable.querySelector('.' + RIGHT_AXIS_PANEL_CLASS);
            groupingTable.style.width = this.parent.element.querySelector('#' + this.parent.element.id + '_grid').offsetWidth + 'px';
            var colGroupElement = this.parent.element.querySelector('.' + FROZENHEADER_DIV).querySelector('colgroup').children[0];
            var rightAxisWidth = groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10) + 'px';
            leftAxisPanel.style.minWidth = colGroupElement.style.width;
            valuePanel.style.width = colGroupElement.style.width;
            rightAxisPanel.style.width = rightAxisWidth;
            if (this.parent.element.querySelector('#' + this.parent.element.id + '_grid')) {
                var emptyRowHeader = this.parent.element.querySelector('.' + FROZENHEADER_DIV).querySelector('.' + COLUMN_HEADER);
                emptyRowHeader.querySelector('.' + HEADERCELL).classList.add(GROUP_ROW);
                emptyRowHeader.style.height = emptyRowHeader.querySelector('.' + RESIZE_HANDLER).style.height = 'auto';
                if (this.parent.internalGrid.element.querySelector('.' + GROUP_ROW_CLASS) && emptyRowHeader.querySelector('.' + AXIS_ROW_CLASS)) {
                    rowPanel = rowPanel ? rowPanel : this.parent.internalGrid.element.querySelector('.' + GROUP_ROW_CLASS);
                    rowPanel.style.height = 'auto';
                }
                else {
                    rowPanel.style.height = this.parent.element.querySelector('.' + HEADERCONTENT).offsetHeight + 'px';
                    emptyRowHeader.querySelector('.' + GROUP_ROW).appendChild(groupingTable.querySelector('.' + AXIS_ROW_CLASS));
                }
                emptyRowHeader.querySelector('.' + GROUP_ROW).querySelector('.' + HEADER_CELL_DIV).style.display = 'none';
                emptyRowHeader.querySelector('.' + GROUP_ROW).querySelector('.' + SORT_FILTER_DIV).style.display = 'none';
                var colRowElements = [].slice.call(this.parent.element.querySelector('.' + MOVABLEHEADER_DIV).querySelector('thead').querySelectorAll('tr'));
                var columnRows = colRowElements.filter(function (trCell) {
                    return trCell.childNodes.length > 0;
                });
                for (var _i = 0, columnRows_1 = columnRows; _i < columnRows_1.length; _i++) {
                    var element = columnRows_1[_i];
                    sf.base.setStyleAttribute(element, { 'height': 'auto' });
                }
                var groupHeight = this.parent.element.querySelector('.' + HEADERCONTENT).offsetHeight;
                rowPanel.style.height = groupHeight + 'px';
                columnPanel.style.height = filterPanel.style.height = 'auto';
                var rightPanelHeight = (valuePanel.offsetHeight / 2);
                if (rightPanelHeight > columnPanel.offsetHeight) {
                    sf.base.setStyleAttribute(filterPanel, { height: sf.base.formatUnit(rightPanelHeight) });
                    sf.base.setStyleAttribute(columnPanel, { height: sf.base.formatUnit(rightPanelHeight + 2) });
                }
                if (this.parent.element.querySelector('.' + FROZENHEADER_DIV).querySelector('.' + RESIZE_HANDLER)) {
                    emptyRowHeader.style.height = this.parent.element.querySelector('.' + FROZENHEADER_DIV).querySelector('.' + RESIZE_HANDLER).style.height = groupHeight + 'px';
                }
                /* tslint:enable */
                var colHeight = groupHeight / columnRows.length;
                for (var _a = 0, columnRows_2 = columnRows; _a < columnRows_2.length; _a++) {
                    var element = columnRows_2[_a];
                    sf.base.setStyleAttribute(element, { 'height': colHeight + 'px' });
                    var rowHeader = [].slice.call(element.querySelectorAll('.' + RESIZE_HANDLER));
                    for (var _b = 0, rowHeader_1 = rowHeader; _b < rowHeader_1.length; _b++) {
                        var handlerElement = rowHeader_1[_b];
                        sf.base.setStyleAttribute(handlerElement, { 'height': sf.base.closest(handlerElement, 'th').offsetHeight + 'px' });
                    }
                }
            }
        }
    };
    GroupingBar.prototype.wireEvent = function (element) {
        sf.base.EventHandler.add(element, 'mouseover', this.dropIndicatorUpdate, this);
        sf.base.EventHandler.add(element, 'mouseleave', this.dropIndicatorUpdate, this);
    };
    GroupingBar.prototype.unWireEvent = function (element) {
        sf.base.EventHandler.remove(element, 'mouseover', this.dropIndicatorUpdate);
        sf.base.EventHandler.remove(element, 'mouseleave', this.dropIndicatorUpdate);
    };
    GroupingBar.prototype.dropIndicatorUpdate = function (e) {
        /* tslint:disable */
        if ((this.parent.isDragging && e.target.classList.contains(DROPPABLE_CLASS) && e.type === 'mouseover') ||
            e.type === 'mouseleave') {
            sf.base.removeClass([].slice.call(this.parent.element.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            sf.base.removeClass([].slice.call(this.parent.element.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
        }
        /* tslint:enable */
    };
    GroupingBar.prototype.destroy = function () {
        for (var _i = 0, _a = [].slice.call(this.parent.element.querySelectorAll('.' + AXIS_CONTAINER)); _i < _a.length; _i++) {
            var element = _a[_i];
            this.unWireEvent(element.firstElementChild);
        }
    };
    return GroupingBar;
}());

/**
 * The `calculated field` module.
 */
var CalculatedField = /** @class */ (function () {
    function CalculatedField(parent) {
        this.parent = parent;
        this.parent.calculatedFieldModule = this;
    }
    CalculatedField.prototype.getNodeLocation = function (treeElement, id) {
        var position = treeElement.querySelector('li[data-uid=' + '\"' + JSON.parse(id) + '\"' + ']').getBoundingClientRect();
        return JSON.stringify([position.top + (window.scrollY || document.documentElement.scrollTop), position.left]);
    };
    
    CalculatedField.prototype.setSelectionRange = function (length) {
        if (length) {
            document.querySelector('#' + this.parent.element.id + 'droppable').setSelectionRange(length, length);
        }
        document.querySelector('#' + this.parent.element.id + 'droppable').focus();
    };
    
    CalculatedField.prototype.getIconInfo = function (top, left) {
        var element = document.elementFromPoint(left, top);
        if (element) {
            if (element.classList.contains(FORMAT)) {
                return JSON.stringify(FORMAT);
            }
            else if (element.classList.contains(CALC_EDIT)) {
                return JSON.stringify(CALC_EDIT);
            }
            else if (element.classList.contains(GRID_REMOVE)) {
                return JSON.stringify(GRID_REMOVE);
            }
            else if (element.classList.contains(CALC_EDITED)) {
                return JSON.stringify(CALC_EDITED);
            }
        }
        return undefined;
    };
    CalculatedField.prototype.emptyFieldName = function (parentID) {
        sf.base.addClass([document.getElementById(parentID + 'ddlelement')], [EMPTY_FIELD, CALCINPUT]);
        document.getElementById(parentID + 'ddlelement').focus();
    };
    CalculatedField.prototype.editCalculatedFieldInfo = function (isEdit, top, left, title) {
        /* tslint:disable */
        var treeNode = sf.base.closest(document.elementFromPoint(left, top), 'li');
        if (isEdit) {
            if (this.parent.options.dataType === 'pivot') {
                sf.base.addClass(document.querySelector('#' + this.parent.element.id + 'calculateddialog').querySelectorAll('.' + CALC_EDITED), CALC_EDIT);
                sf.base.removeClass(document.querySelector('#' + this.parent.element.id + 'calculateddialog').querySelectorAll('.' + CALC_EDITED), CALC_EDITED);
                sf.base.addClass([treeNode.querySelector('.' + LIST_ICON)], CALC_EDITED);
                sf.base.removeClass([treeNode.querySelector('.' + LIST_ICON)], CALC_EDIT);
                treeNode.querySelector('.' + CALC_EDITED).setAttribute('title', title);
            }
            document.querySelector('#' + this.parent.element.id + 'droppable').value =
                treeNode.getAttribute('data-uid');
        }
        else {
            this.updatedCalculatedFieldInfo(treeNode, title);
        }
        /* tslint:enable */
    };
    CalculatedField.prototype.updatedCalculatedFieldInfo = function (treeNode, title) {
        if (this.parent.options.dataType === 'pivot') {
            /* tslint:disable-next-line:max-line-length */
            sf.base.addClass(document.querySelector('#' + this.parent.element.id + 'calculateddialog').querySelectorAll('.' + CALC_EDITED), CALC_EDIT);
            /* tslint:disable-next-line:max-line-length */
            sf.base.removeClass(document.querySelector('#' + this.parent.element.id + 'calculateddialog').querySelectorAll('.' + CALC_EDITED), CALC_EDITED);
            treeNode.querySelector('.' + CALC_EDIT).setAttribute('title', title);
        }
        document.querySelector('#' + this.parent.element.id + 'droppable').value = '';
    };
    CalculatedField.prototype.updateNodeExpandIcons = function (treeElement, id) {
        /* tslint:disable */
        var node = treeElement.querySelector('li[data-uid=' + '\"' + id + '\"' + ']');
        /* tslint:enable */
        var li = [].slice.call(node.querySelectorAll('li'));
        for (var i = 0; i < li.length; i++) {
            var liTextElement = li[i].querySelector('.' + TEXT_CONTENT_CLASS);
            if (li[i].getAttribute('data-type') === CALCULATED_FIELD &&
                liTextElement && li[i].querySelector('.' + LIST_ICON + '.' + CALC_MEMBER) &&
                !li[i].querySelector('.' + GRID_REMOVE)) {
                var removeElement = sf.base.createElement('span', {
                    className: GRID_REMOVE + ' ' + ICON + ' ' + LIST_ICON
                });
                liTextElement.classList.add(CALC_FIELD_MEMBER);
                liTextElement.appendChild(removeElement);
            }
            if ((li[i].querySelector('.' + CALC_DIMENSION_ICON + ',.' + CALC_MEASURE_ICON + ',.' + MEASURE_ICON) ||
                li[i].querySelector('.' + DIMENSION_TYPE_ICON + ',.' + ATTRIBUTE_TYPE_ICON + ',.' + HIERARCHY_TYPE_ICON) ||
                li[i].querySelector('.' + LEVEL_MEMBERS + ',.' + NAMEDSET_TYPE_ICON))) {
                this.createDraggable(li[i]);
            }
        }
        return this.olapExpand(node);
    };
    CalculatedField.prototype.olapExpand = function (node) {
        if (node && node.querySelector('.' + LIST_ICON) &&
            node.querySelector('.' + ICON_EXPAND) &&
            (node.querySelector('.' + LIST_ICON).className.indexOf(FOLDER_TYPE_ICON) > -1)) {
            var listnode = node.querySelector('.' + LIST_ICON);
            sf.base.removeClass([listnode], FOLDER_TYPE_ICON);
            sf.base.addClass([listnode], FOLDER_TYPE_OPEN_ICON);
            return JSON.stringify(false);
        }
        else if (node && node.querySelector('.' + LIST_ICON) &&
            node.querySelector('.' + ICON_COLLAPSE) &&
            (node.querySelector('.' + LIST_ICON).className.indexOf(FOLDER_TYPE_OPEN_ICON) > -1)) {
            node = node.querySelector('.' + LIST_ICON);
            sf.base.removeClass([node], FOLDER_TYPE_OPEN_ICON);
            sf.base.addClass([node], FOLDER_TYPE_ICON);
            return JSON.stringify(false);
        }
        return JSON.stringify(true);
    };
    CalculatedField.prototype.updateEditOptions = function (accordId) {
        var acoordItem = [].slice.call(document.querySelectorAll('#' + accordId + ' .' + ACCORD_ITEM));
        sf.base.addClass(document.querySelectorAll('#' + accordId), CALCACCORD);
        for (var i = 0; i < acoordItem.length; i++) {
            if (acoordItem[i].querySelector('[data-type="CalculatedField"]')) {
                var iconElement = acoordItem[i].querySelector('.' + ACCORD_HEADER + ' .' + TOGGLE_ICON);
                sf.base.removeClass([iconElement], TOGGLE_ICON);
                sf.base.addClass([iconElement], ACCORD_HEADER_ICON);
                var editElement = iconElement.querySelector('.' + TOGGLE_COLLAPSE_ICON);
                sf.base.removeClass([editElement], TOGGLE_COLLAPSE_ICON);
                sf.base.addClass([editElement], [LIST_ICON, CALC_EDIT]);
                iconElement.appendChild(sf.base.createElement('span', {
                    className: GRID_REMOVE + ' ' + ICON + ' ' + LIST_ICON
                }));
            }
        }
    };
    CalculatedField.prototype.updateAccordionLabel = function (target) {
        var eventTarget = document.elementFromPoint(JSON.parse(target).ClientX, JSON.parse(target).ClientY);
        var type = eventTarget.parentElement.querySelector('.' + LABEl)
            .innerText;
        var field = sf.base.closest(eventTarget, '.' + ACCORD_ITEM).
            querySelector('[data-field').getAttribute('data-caption');
        sf.base.closest(eventTarget, '.' + ACCORD_ITEM).querySelector('.' + LABEl).
            innerText = field + ' (' + type + ')';
        sf.base.closest(eventTarget, '.' + ACCORD_ITEM).
            querySelector('[data-type').setAttribute('data-type', (eventTarget).getAttribute('data-value'));
    };
    
    CalculatedField.prototype.accordionClick = function (clientX, clientY, id) {
        var target = document.elementFromPoint(JSON.parse(clientX), JSON.parse(clientY));
        if (sf.base.closest(target, '.' + ACCORD_HEADER_ICON)) {
            var node = sf.base.closest(target, '.' + ACCORD_HEADER).querySelector('.' + CALCCHECK + " input");
            if (node) {
                var actionClass = void 0;
                var optionElement = sf.base.closest(target, '.' + ACCORD_HEADER_ICON);
                if (optionElement.querySelector('.' + CALC_EDIT) && (target).classList.contains(CALC_EDIT)) {
                    sf.base.addClass([optionElement.querySelector('.' + LIST_ICON)], CALC_EDITED);
                    sf.base.removeClass([optionElement.querySelector('.' + LIST_ICON)], CALC_EDIT);
                    actionClass = CALC_EDIT;
                }
                else if (optionElement.querySelector('.' + CALC_EDITED) &&
                    target.classList.contains(CALC_EDITED)) {
                    sf.base.addClass([optionElement.querySelector('.' + LIST_ICON)], CALC_EDIT);
                    sf.base.removeClass([optionElement.querySelector('.' + LIST_ICON)], CALC_EDITED);
                    actionClass = CALC_EDITED;
                }
                else if (optionElement.querySelector('.' + GRID_REMOVE) &&
                    target.classList.contains(GRID_REMOVE)) {
                    actionClass = GRID_REMOVE;
                }
                return JSON.stringify([node.getAttribute('data-field'), actionClass, node.getAttribute('id').split(id + '_')[1]]);
            }
        }
        return JSON.stringify([]);
    };
    CalculatedField.prototype.getAccordionValue = function () {
        var fieldText = '';
        var node = [].slice.call(document.querySelectorAll('.' + ACCORDION + ' .' + NODE_CHECK_CLASS));
        for (var i = 0; i < node.length; i++) {
            var field = node[i].parentElement.querySelector('[data-field]').getAttribute('data-field');
            var type = node[i].parentElement.querySelector('[data-type]').getAttribute('data-type');
            if (type.indexOf(CALCULATED_FIELD) === -1) {
                fieldText = fieldText + ('"' + type + '(' + field + ')' + '"');
            }
            else {
                fieldText = fieldText + node[i].parentElement.querySelector('[data-formula]').getAttribute('data-formula');
                
            }
        }
        return fieldText;
    };
    CalculatedField.prototype.createFormulaDroppable = function (edit, drag, remove$$1, edited, isEdit, fieldName, id) {
        var element = document.getElementById(this.parent.element.id + id);
        if (element.querySelector('.' + FORMULA)) {
            new sf.base.Droppable(element.querySelector('.' + FORMULA), {});
            var li = [].slice.call(element.querySelectorAll('.' + TREEVIEW + ' ul li'));
            for (var i = 0; i < li.length; i++) {
                var currentFieldName = li[i].getAttribute('data-field');
                if (this.parent.options.dataType === 'olap') {
                    if (li[i].querySelector('.' + MEASURE_ICON)) {
                        li[i].querySelector('.' + LIST_ICON).style.display = 'none';
                    }
                    var liTextElement = li[i].querySelector('.' + TEXT_CONTENT_CLASS);
                    if (li[i].getAttribute('data-type') === 'CalculatedField' &&
                        liTextElement && li[i].querySelector('.' + LIST_ICON + '.' + CALC_MEMBER)) {
                        liTextElement.classList.add(CALC_FIELD_MEMBER);
                        liTextElement.appendChild(sf.base.createElement('span', {
                            className: GRID_REMOVE + ' ' + ICON + ' ' + LIST_ICON
                        }));
                    }
                    /* tslint:disable */
                    if ((li[i].querySelector('.' + CALC_DIMENSION_ICON + ',.' + CALC_MEASURE_ICON + ',.' + MEASURE_ICON) ||
                        li[i].querySelector('.' + DIMENSION_TYPE_ICON + ',.' + ATTRIBUTE_TYPE_ICON + ',.' + HIERARCHY_TYPE_ICON) ||
                        li[i].querySelector('.' + LEVEL_MEMBERS + ',.' + NAMEDSET_TYPE_ICON))) {
                        this.createDraggable(li[i]);
                    }
                    /* tslint:enable */
                }
                else if (this.parent.options.dataType === 'pivot') {
                    if (li[i].querySelector('.' + TEXT_CONTENT_CLASS + ' span')) {
                        var type = li[i].getAttribute('data-type');
                        var dragElement = sf.base.createElement('span', {
                            attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': drag },
                            className: ICON + ' ' + DRAG_CLASS
                        });
                        var spaceElement = sf.base.createElement('div', {
                            className: ' ' + ICON_SPACE
                        });
                        sf.base.prepend([dragElement], li[i].querySelector('.' + TEXT_CONTENT_CLASS));
                        sf.base.append([spaceElement, li[i].querySelector('.' + FORMAT)], li[i].querySelector('.' + TEXT_CONTENT_CLASS));
                        if (type === 'CalculatedField') {
                            li[i].querySelector('.' + FORMAT).setAttribute('title', remove$$1);
                            sf.base.addClass([li[i].querySelector('.' + FORMAT)], GRID_REMOVE);
                            if (isEdit && fieldName === currentFieldName) {
                                /* tslint:disable-next-line:max-line-length */
                                element.querySelector('#' + this.parent.element.id + 'droppable').value = li[i].getAttribute('data-uid');
                            }
                            /* tslint:disable-next-line:max-line-length */
                            sf.base.addClass([li[i].querySelector('.' + ICON_SPACE)], [((isEdit && fieldName === currentFieldName) ? CALC_EDITED : CALC_EDIT), ICON, LIST_ICON]);
                            /* tslint:disable-next-line:max-line-length */
                            li[i].querySelector('.' + CALC_EDIT + ',.' + CALC_EDITED).setAttribute('title', ((isEdit && fieldName === currentFieldName) ? edited : edit));
                            li[i].querySelector('.' + CALC_EDIT + ',.' + CALC_EDITED).setAttribute('aria-disabled', 'false');
                            li[i].querySelector('.' + CALC_EDIT + ',.' + CALC_EDITED).setAttribute('tabindex', '-1');
                            sf.base.removeClass([li[i].querySelector('.' + FORMAT)], FORMAT);
                            sf.base.removeClass([li[i].querySelector('.' + ICON_SPACE)], ICON_SPACE);
                        }
                        this.createDraggable(dragElement);
                    }
                }
            }
        }
    };
    CalculatedField.prototype.createDraggable = function (element) {
        new sf.base.Draggable(element, {
            dragTarget: '.' + LIST_ITEM,
            clone: true,
            enableTailMode: true,
            enableAutoScroll: true,
            helper: this.calculatedDragClone.bind(this),
            dragStart: this.onCalcDragStart.bind(this),
            drag: this.onDragging.bind(this),
            dragStop: this.onCalcDragStop.bind(this),
        });
    };
    CalculatedField.prototype.onDragging = function (e) {
        var clonedNode = document.querySelector('#' + this.parent.element.id + '_DragClone ' + '.' + ICON);
        if (e.target && (e.target).classList.contains(FORMULA)) {
            sf.base.removeClass([clonedNode], NO_DRAG_CLASS);
            sf.base.addClass([(e.target)], COPY_DROP);
        }
        else {
            sf.base.addClass([clonedNode], NO_DRAG_CLASS);
            sf.base.removeClass([(e.target)], COPY_DROP);
            sf.base.addClass([clonedNode], ICON_EXPAND);
            sf.base.removeClass([clonedNode], LIST_ICON);
        }
    };
    CalculatedField.prototype.onCalcDragStop = function (e) {
        var dropField = document.getElementById(this.parent.element.id + 'droppable');
        var draggedNode = sf.base.closest(e.element, '.' + LIST_ITEM);
        sf.base.removeClass([dropField], COPY_DROP);
        sf.base.removeClass([draggedNode.querySelector('.' + LIST_TEXT_CLASS)], SELECTED_NODE_CLASS);
        var cursorPos = dropField.selectionStart;
        if (e.target.id === (this.parent.element.id + 'droppable')) {
            this.parent.dotNetRef.invokeMethodAsync('UpdateCalcDroppable', draggedNode.getAttribute('data-uid'), cursorPos, e.target.id);
        }
        if (document.getElementById(this.parent.element.id + '_DragClone')) {
            sf.base.remove(e.helper);
        }
        document.body.style.cursor = 'auto';
        this.parent.isDragging = false;
    };
    CalculatedField.prototype.onCalcDragStart = function (e) {
        var draggedNode = sf.base.closest(e.element, '.' + LIST_ITEM);
        var clonedNode = document.getElementById(this.parent.element.id + '_DragClone');
        if (clonedNode && draggedNode && (this.parent.options.dataType === 'pivot' && e.element &&
            e.element.classList.contains(DRAG_CLASS)) || (this.parent.options.dataType === 'olap' &&
            (draggedNode.querySelector('.' + CALC_DIMENSION_ICON + ',.' + CALC_MEASURE_ICON + ',.' + MEASURE_ICON) ||
                /* tslint:disable-next-line:max-line-length */
                draggedNode.querySelector('.' + DIMENSION_TYPE_ICON + ',.' + ATTRIBUTE_TYPE_ICON + ',.' + HIERARCHY_TYPE_ICON) ||
                draggedNode.querySelector('.' + LEVEL_MEMBERS + ',.' + NAMEDSET_TYPE_ICON)))) {
            sf.base.addClass([draggedNode.querySelector('.' + LIST_TEXT_CLASS)], SELECTED_NODE_CLASS);
            sf.base.addClass([clonedNode], PIVOTCALC);
            clonedNode.style.zIndex =
                document.querySelector('.' + CALCDIALOG + '.' + OLAP_CALCDIALOG).style.zIndex + 1;
            clonedNode.style.display = 'inline';
            this.parent.isDragging = true;
        }
        else {
            this.parent.isDragging = false;
        }
        e.bindEvents(e.dragElement);
    };
    CalculatedField.prototype.calculatedDragClone = function (args) {
        var cloneElement = sf.base.createElement('div', {
            id: this.parent.element.id + '_DragClone',
            className: DRAG_ITEM + ' ' + TREEVIEW_CLASS + ' ' + PIVOTCALC
        });
        var contentElement = sf.base.createElement('div', {
            className: TEXT_CONTENT_CLASS + ' ' + CALC_FIELD_MEMBER
        });
        contentElement.appendChild(sf.base.createElement('div', {
            className: ICON
        }));
        contentElement.appendChild(sf.base.createElement('span', {
            className: LIST_TEXT_CLASS,
            innerHTML: sf.base.closest(args.element, 'li').getAttribute('data-caption')
        }));
        cloneElement.appendChild(contentElement);
        document.body.appendChild(cloneElement);
        return cloneElement;
    };
    return CalculatedField;
}());

/**
 * Module for Toolbar
 */
var Toolbar = /** @class */ (function () {
    function Toolbar(parent) {
        this.parent = parent;
        this.parent.toolbarModule = this;
    }
    Toolbar.prototype.renderToolbar = function () {
        if (this.parent.element.querySelector('.' + GRID_TOOLBAR)) {
            this.updateItemElements(this.parent.element.querySelector('.' + GRID_TOOLBAR));
        }
    };
    Toolbar.prototype.updateItemElements = function (toolbarElement) {
        for (var _i = 0, _a = [].slice.call(toolbarElement.querySelectorAll('.' + TOOLBAR_ITEM)); _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.querySelector('button')) {
                if (!element.classList.contains(OVERLAY)) {
                    element.querySelector('button').setAttribute('tabindex', '0');
                }
            }
            else if (element.querySelector('.' + MENU + '.' + MENU_PARENT)) {
                element.querySelector('.' + MENU + '.' + MENU_PARENT).setAttribute('tabindex', '-1');
                if (!element.classList.contains(OVERLAY) &&
                    element.querySelector('.' + MENU_ITEM_CLASS + '.' + MENU_CARET_ICON)) {
                    element.querySelector('.' + MENU_ITEM_CLASS + '.' + MENU_CARET_ICON).setAttribute('tabindex', '0');
                }
            }
        }
    };
    Toolbar.prototype.focusToolBar = function () {
        /* tslint:disable-next-line:max-line-length */
        sf.base.removeClass(document.querySelector('.' + GRID_TOOLBAR).querySelectorAll('.' + MENU_ITEM_CLASS + '.' + FOCUSED_CLASS), FOCUSED_CLASS);
        /* tslint:disable-next-line:max-line-length */
        sf.base.removeClass(document.querySelector('.' + GRID_TOOLBAR).querySelectorAll('.' + MENU_ITEM_CLASS + '.' + SELECTED_CLASS), SELECTED_CLASS);
        if (document.querySelector('.' + TOOLBAR_ITEMS)) {
            sf.base.addClass([document.querySelector('.' + TOOLBAR_ITEMS)], FOCUSED_CLASS);
        }
    };
    Toolbar.prototype.selectInputRange = function (element) {
        if (element.querySelector('.' + GRID_REPORT_INPUT)) {
            var input = element.querySelector('.' + GRID_REPORT_INPUT + ' input');
            input.setSelectionRange(input.value.length, input.value.length);
        }
    };
    Toolbar.prototype.copyMdxQuery = function (element) {
        if (element.querySelector('.' + MDX_QUERY_CONTENT)) {
            var textArea = element.querySelector('.' + MDX_QUERY_CONTENT);
            try {
                textArea.select();
                document.execCommand('copy');
            }
            catch (error) {
                window.alert('Oops, unable to copy');
            }
            return;
        }
    };
    return Toolbar;
}());

/**
 * Module for Drillthrough action
 */
var DrillThrough = /** @class */ (function () {
    function DrillThrough(parent) {
        this.parent = parent;
        this.parent.drillThroughModule = this;
    }
    DrillThrough.prototype.addInternalEvents = function () {
        this.wireEvents();
    };
    DrillThrough.prototype.wireEvents = function () {
        this.unWireEvents();
        sf.base.EventHandler.add(this.parent.element, 'dblclick', this.mouseClickHandler, this);
    };
    DrillThrough.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.parent.element, 'dblclick', this.mouseClickHandler);
    };
    DrillThrough.prototype.mouseClickHandler = function (e) {
        var target = e.target;
        var element;
        if (target.classList.contains(STACKED_HEADER_CELL_DIV) || target.classList.contains(CELLVALUE) ||
            target.classList.contains(HEADER_CELL_DIV)) {
            element = target.parentElement;
        }
        else if (target.classList.contains(HEADERCELL) || target.classList.contains(ROW_CELL_CLASS)) {
            element = target;
        }
        else if (target.classList.contains(HEADER_TEXT)) {
            element = target.parentElement.parentElement;
        }
        if (element) {
            /* tslint:disable */
            if (this.parent.options.allowDrillThrough && element.classList.contains(VALUESCONTENT) || this.parent.editSettings.allowEditing) {
                var colIndex = Number(element.getAttribute('aria-colindex'));
                var rowIndex = Number(element.getAttribute('index'));
                this.parent.dotNetRef.invokeMethodAsync('MouseDoubleClickHandler', rowIndex, colIndex, JSON.stringify(window.sfBlazor.getDomObject('currentTarget', element)));
            }
            /* tslint:enable */
        }
    };
    DrillThrough.prototype.destroy = function () {
        this.unWireEvents();
    };
    return DrillThrough;
}());

/**
 * Keyboard interaction
 */
var CommonKeyboardInteraction = /** @class */ (function () {
    /**
     * Constructor
     */
    function CommonKeyboardInteraction(parent) {
        this.keyConfigs = {
            shiftF: 'shift+F',
            shiftS: 'shift+S',
            shiftE: 'shift+E',
            delete: 'delete',
            enter: 'enter',
            escape: 'escape',
            upArrow: 'upArrow',
            downArrow: 'downArrow'
        };
        this.parent = parent;
        this.parent.parentElement.tabIndex = this.parent.parentElement.tabIndex === -1 ? 0 : this.parent.parentElement.tabIndex;
        this.keyboardModule = new sf.base.KeyboardEvents(this.parent.parentElement, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }
    CommonKeyboardInteraction.prototype.keyActionHandler = function (e) {
        switch (e.action) {
            case 'shiftF':
                this.processFilter(e);
                break;
            case 'shiftS':
                this.processSort(e);
                break;
            case 'shiftE':
                this.processEdit(e);
                break;
            case 'delete':
                this.processDelete(e);
                break;
            case 'enter':
                this.processEnter(e);
                break;
            case 'escape':
                this.processClose(e);
                break;
            case 'upArrow':
            case 'downArrow':
                this.processFilterNodeSelection(e);
                break;
        }
    };
    CommonKeyboardInteraction.prototype.getButtonElement = function (target) {
        var allPivotButtons = [].slice.call(this.parent.parentElement.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
        for (var i = 0, len = allPivotButtons.length; i < len; i++) {
            if (allPivotButtons[i].getAttribute('data-uid') === target.getAttribute('data-uid')) {
                return allPivotButtons[i];
            }
        }
        return target;
    };
    CommonKeyboardInteraction.prototype.processEnter = function (e) {
        var target = e.target;
        if (target && sf.base.closest(target, '.' + PIVOT_BUTTON_CLASS)) {
            if (target.querySelector('.' + AXISFIELD_ICON_CLASS) && sf.base.closest(target, '.' + VALUE_AXIS_CLASS)) {
                target.querySelector('.' + AXISFIELD_ICON_CLASS).click();
            }
            else if (target.querySelector('.' + CALC_EDIT)) {
                target.querySelector('.' + CALC_EDIT).click();
            }
            else if (target.querySelector('.' + SORT_CLASS) &&
                !sf.base.closest(target, '.' + VALUE_AXIS_CLASS) && !sf.base.closest(target, '.' + AXIS_FILTER_CLASS)) {
                target.querySelector('.' + SORT_CLASS).click();
                this.getButtonElement(target).focus();
            }
            else if (target.querySelector('.' + FILTER_COMMON_CLASS) && !sf.base.closest(target, '.' + VALUE_AXIS_CLASS)) {
                target.querySelector('.' + FILTER_COMMON_CLASS).click();
            }
            e.preventDefault();
            return;
        }
    };
    CommonKeyboardInteraction.prototype.processSort = function (e) {
        var target = e.target;
        if (target && sf.base.closest(target, '.' + PIVOT_BUTTON_CLASS) && target.querySelector('.' + SORT_CLASS) &&
            !sf.base.closest(target, '.' + VALUE_AXIS_CLASS) && !sf.base.closest(target, '.' + AXIS_FILTER_CLASS)) {
            target.querySelector('.' + SORT_CLASS).click();
            this.getButtonElement(target).focus();
            e.preventDefault();
            return;
        }
    };
    CommonKeyboardInteraction.prototype.processEdit = function (e) {
        var target = e.target;
        if (target && sf.base.closest(target, '.' + PIVOT_BUTTON_CLASS) && target.querySelector('.' + CALC_EDIT)) {
            target.querySelector('.' + CALC_EDIT).click();
            e.preventDefault();
            return;
        }
    };
    CommonKeyboardInteraction.prototype.processFilter = function (e) {
        var target = e.target;
        if (target && sf.base.closest(target, '.' + PIVOT_BUTTON_CLASS) && target.querySelector('.' + FILTER_COMMON_CLASS) &&
            !sf.base.closest(target, '.' + VALUE_AXIS_CLASS)) {
            target.querySelector('.' + FILTER_COMMON_CLASS).click();
            e.preventDefault();
            return;
        }
    };
    CommonKeyboardInteraction.prototype.processFilterNodeSelection = function (e) {
        var target = e.target;
        if (target && sf.base.closest(target, '.' + SELECT_ALL_CLASS) && e.keyCode === 40) {
            /* tslint:disable-next-line:max-line-length */
            var memberEditorTree = sf.base.closest(target, '.' + EDITOR_TREE_OUTER_DIV_CLASS).querySelector('.' + EDITOR_TREE_CONTAINER_CLASS);
            if (memberEditorTree && memberEditorTree.querySelector('li')) {
                var firstLi = memberEditorTree.querySelector('li');
                if (memberEditorTree.querySelector('li#_active')) {
                    sf.base.removeClass([memberEditorTree.querySelector('li#_active')], [HOVER, NODE_FOCUS]);
                    memberEditorTree.querySelector('li#_active').removeAttribute('id');
                }
                firstLi.setAttribute('id', '_active');
                sf.base.addClass([firstLi], [HOVER, NODE_FOCUS]);
                memberEditorTree.focus();
                e.preventDefault();
                return;
            }
        }
        else if (target && sf.base.closest(target, '.' + EDITOR_TREE_CONTAINER_CLASS) && e.keyCode === 38) {
            var memberEditorTree = sf.base.closest(target, '.' + EDITOR_TREE_CONTAINER_CLASS);
            if (memberEditorTree.querySelector('li#_active.' + HOVER + '.' + NODE_FOCUS) && memberEditorTree.querySelector('li') &&
                memberEditorTree.querySelector('li').classList.contains(PREV_ACTIVE_NODE) &&
                memberEditorTree.querySelector('li') === memberEditorTree.querySelector('li#_active.' + HOVER + '.' + NODE_FOCUS)) {
                sf.base.removeClass(memberEditorTree.querySelectorAll('li.' + PREV_ACTIVE_NODE), PREV_ACTIVE_NODE);
                /* tslint:disable-next-line:max-line-length */
                var allMemberEditorTree = sf.base.closest(target, '.' + EDITOR_TREE_OUTER_DIV_CLASS).querySelector('.' + SELECT_ALL_CLASS);
                if (allMemberEditorTree && allMemberEditorTree.querySelector('li')) {
                    var firstLi = allMemberEditorTree.querySelector('li');
                    firstLi.setAttribute('id', '_active');
                    sf.base.addClass([firstLi], [HOVER, NODE_FOCUS]);
                    allMemberEditorTree.focus();
                    e.preventDefault();
                    return;
                }
            }
        }
    };
    CommonKeyboardInteraction.prototype.processDelete = function (e) {
        var target = e.target;
        if (target && sf.base.closest(target, '.' + PIVOT_BUTTON_CLASS) && target.querySelector('.' + REMOVE_CLASS)) {
            target.querySelector('.' + REMOVE_CLASS).click();
            e.preventDefault();
            return;
        }
    };
    CommonKeyboardInteraction.prototype.processClose = function (e) {
        var target = e.target;
        if (target && sf.base.closest(target, '.' + POPUP + '.' + POPUP_OPEN)) {
            /* tslint:disable */
            var dialogInstance = sf.base.closest(target, '.' + POPUP + '.' + POPUP_OPEN)['blazor__instance'];
            /* tslint:enable */
            var pivot_1 = this;
            if (dialogInstance && !dialogInstance.closeOnEscape) {
                var fieldName_1 = dialogInstance.element.getAttribute('data-fieldName');
                dialogInstance.dotNetRef.invokeMethodAsync('CloseDialog', {
                    altKey: e.altKey,
                    ctrlKey: e.ctrlKey,
                    code: e.code,
                    key: e.key,
                    location: e.location,
                    repeat: e.repeat,
                    shiftKey: e.shiftKey,
                    metaKey: e.metaKey,
                    type: e.type
                }).then(function () {
                    if (pivot_1.parent.parentElement) {
                        /* tslint:disable-next-line:max-line-length */
                        var pivotButtons = [].slice.call(pivot_1.parent.parentElement.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
                        for (var _i = 0, pivotButtons_1 = pivotButtons; _i < pivotButtons_1.length; _i++) {
                            var item = pivotButtons_1[_i];
                            if (item.getAttribute('data-uid') === fieldName_1) {
                                item.focus();
                                break;
                            }
                        }
                    }
                    e.preventDefault();
                    return;
                });
            }
        }
    };
    CommonKeyboardInteraction.prototype.destroy = function () {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        else {
            return;
        }
    };
    return CommonKeyboardInteraction;
}());

/**
 * Module for common action
 */
var ActionBase = /** @class */ (function () {
    function ActionBase(parent) {
        this.parent = parent;
        this.parent.commonActionModule = this;
        this.keyboardModule = new CommonKeyboardInteraction(parent);
        this.getElementInfo();
    }
    ActionBase.prototype.getElementInfo = function () {
        if (this.parent instanceof SfPivotView) {
            var domInfo = this.parent.element.getBoundingClientRect();
            /* tslint:disable-next-line:max-line-length */
            this.parent.dotNetRef.invokeMethodAsync('GetElementInfo', domInfo.width, domInfo.height);
        }
    };
    ActionBase.prototype.updateActiveNode = function (treeElement, id) {
        /* tslint:disable-next-line:max-line-length */
        sf.base.removeClass(treeElement.querySelectorAll('li.' + PREV_ACTIVE_NODE), PREV_ACTIVE_NODE);
        sf.base.addClass([treeElement.querySelector('li[data-uid=' + '\"' + id + '\"' + ']')], PREV_ACTIVE_NODE);
    };
    ActionBase.prototype.isFullRowElement = function (top, left) {
        return JSON.stringify(document.elementFromPoint(left, top).classList.contains(FULL_ROW));
    };
    ActionBase.prototype.validateInputs = function (filterInfo) {
        var operand1 = filterInfo.value1;
        var operand2 = filterInfo.value2;
        var operator = filterInfo.condition;
        var type = filterInfo.type;
        if (sf.base.isNullOrUndefined(operand1) || operand1 === '' ||
            ['Between', 'NotBetween'].indexOf(operator) > -1 && (sf.base.isNullOrUndefined(operand2) || operand2 === '')) {
            var focusElement = this.parent.parentElement.querySelector('#' + this.parent.element.id + '_' + type.toLowerCase() +
                (sf.base.isNullOrUndefined(operand1) || operand1 === '' ? '_input_option_1' : '_input_option_2'));
            sf.base.addClass([focusElement], EMPTY_FIELD);
            focusElement.focus();
        }
    };
    ActionBase.prototype.updateDropIndicator = function (e) {
        /* tslint:disable */
        if (this.parent.isDragging && e.target.classList.contains(AXIS_CONTENT_CLASS) && e.type === 'mouseover') {
            sf.base.removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            sf.base.removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
            var element = [].slice.call(e.target.querySelectorAll('.' + PIVOT_BUTTON_DIV_CLASS));
            if (element.length > 0) {
                sf.base.addClass([element[element.length - 1].querySelector('.' + DROP_INDICATOR_CLASS + '-last')], INDICATOR_HOVER_CLASS);
            }
        }
        else if (e.type === 'mouseleave') {
            sf.base.removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            sf.base.removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
        }
        if (this.parent.isDragging && sf.base.closest(e.target, '.' + PIVOT_BUTTON_DIV_CLASS) && e.type === 'mouseover') {
            sf.base.removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
            sf.base.removeClass([].slice.call(this.parent.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            var element = sf.base.closest(e.target, '.' + PIVOT_BUTTON_DIV_CLASS);
            sf.base.addClass([element.querySelector('.' + DROP_INDICATOR_CLASS)], INDICATOR_HOVER_CLASS);
        }
        /* tslint:enable */
    };
    ActionBase.prototype.getFieldInfo = function (fieldName, isValueField) {
        var fields = [this.parent.dataSourceSettings.rows, this.parent.dataSourceSettings.columns,
            this.parent.dataSourceSettings.values, this.parent.dataSourceSettings.filters];
        for (var i = 0, len = fields.length; i < len; i++) {
            for (var j = 0, cnt = fields[i] ? fields[i].length : 0; (j < cnt && !isValueField); j++) {
                if (fields[i][j] && fields[i][j].name === fieldName) {
                    return {
                        fieldName: fieldName,
                        fieldItem: fields[i][j],
                        axis: i === 0 ? 'rows' : i === 1 ? 'columns' : i === 2 ? 'values' : 'filters',
                        position: j
                    };
                }
            }
        }
        var fieldList = this.parent.fieldList[fieldName];
        var fieldItem = fieldList || isValueField ? {
            name: fieldName,
            caption: fieldList ? fieldList.caption : fieldName,
            baseField: fieldList ? fieldList.baseField : undefined,
            baseItem: fieldList ? fieldList.baseItem : undefined,
            isCalculatedField: fieldList ? fieldList.isCalculatedField : false,
            isNamedSet: fieldList ? fieldList.isNamedSets : false,
            showNoDataItems: fieldList ? fieldList.showNoDataItems : false,
            showSubTotals: fieldList ? fieldList.showSubTotals : false,
            type: fieldList ? fieldList.aggregateType : undefined,
            showFilterIcon: fieldList ? fieldList.showFilterIcon : false,
            showSortIcon: fieldList ? fieldList.showSortIcon : false,
            showRemoveIcon: fieldList ? fieldList.showRemoveIcon : true,
            showValueTypeIcon: fieldList ? fieldList.showValueTypeIcon : false,
            showEditIcon: fieldList ? fieldList.showEditIcon : false,
            allowDragAndDrop: fieldList ? fieldList.allowDragAndDrop : true
        } : undefined;
        return {
            fieldName: fieldName,
            fieldItem: fieldItem,
            axis: isValueField ? (this.parent.dataSourceSettings.valueAxis === 'row' ? 'rows' : 'columns') : 'fieldlist',
            position: -1
        };
    };
    
    ActionBase.prototype.getTreeNode = function (treeElement, top, left) {
        if (treeElement) {
            return JSON.stringify(window.sfBlazor.getDomObject('currentNode', sf.base.closest(document.elementFromPoint(left, top), 'li')));
        }
        return null;
    };
    ActionBase.prototype.destroy = function () {
        this.keyboardModule.destroy();
    };
    return ActionBase;
}());

/**
 * PivotView Keyboard interaction
 */
var KeyboardInteraction = /** @class */ (function () {
    /**
     * Constructor
     */
    function KeyboardInteraction(parent) {
        this.keyConfigs = {
            tab: 'tab',
            shiftTab: 'shift+tab',
            enter: 'enter',
            shiftEnter: 'shift+enter',
            ctrlEnter: 'ctrl+enter',
            ctrlShiftF: 'ctrl+shift+f'
        };
        this.parent = parent;
        this.event = undefined;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.pivotViewKeyboardModule = new sf.base.KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }
    KeyboardInteraction.prototype.keyActionHandler = function (e) {
        switch (e.action) {
            case 'tab':
                this.processTab(e);
                break;
            case 'shiftTab':
                this.processShiftTab(e);
                break;
            case 'enter':
            case 'shiftEnter':
            case 'ctrlEnter':
                this.processEnter(e);
                break;
            case 'ctrlShiftF':
                this.toggleFieldList(e);
                break;
        }
    };
    KeyboardInteraction.prototype.getAdjacentButton = function (target, position) {
        var allPivotButtons = this.allpivotButtons(target);
        sf.base.removeClass(allPivotButtons, BUTTON_FOCUSED);
        if (this.parent.internalGrid &&
            this.parent.internalGrid.element.querySelector('.' + PIVOT_BUTTON_CLASS)) {
            var len = allPivotButtons.length;
            for (var i = 0; i < len; i++) {
                if (allPivotButtons[i].getAttribute('data-uid') === target.getAttribute('data-uid')) {
                    var adjacentButton = position == 'next' ? allPivotButtons[i + 1] : allPivotButtons[i - 1];
                    return (adjacentButton ? adjacentButton : target);
                }
            }
        }
        return target;
    };
    KeyboardInteraction.prototype.allpivotButtons = function (target) {
        var pivotButtons = [];
        if (this.parent.options.showGroupingBar) {
            var columnFilterValueGroup = sf.base.closest(target, '.' + GRID_GROUPING_BAR_CLASS);
            var rowGroup = sf.base.closest(target, '.' + GROUP_PIVOT_ROW);
            var chartGroup = sf.base.closest(target, '.' + CHART_GROUPING_BAR_CLASS);
            var tableAxis = target.classList.contains(ROWSHEADER);
            var chartAxis = void 0;
            var rowAxis = void 0;
            var columnFilterValueAxis = void 0;
            if (columnFilterValueGroup !== null) {
                rowAxis = columnFilterValueGroup.classList.contains(GRID_GROUPING_BAR_CLASS);
            }
            else if (rowGroup !== null) {
                columnFilterValueAxis = rowGroup.classList.contains(GROUP_PIVOT_ROW);
            }
            else if (chartGroup !== null) {
                chartAxis = chartGroup.classList.contains(CHART_GROUPING_BAR_CLASS);
            }
            if (rowAxis || columnFilterValueAxis || tableAxis) {
                /* tslint:disable */
                var groupingbarButton = [].slice.call(this.parent.element.querySelector('.' + GRID_GROUPING_BAR_CLASS).querySelectorAll('.' + PIVOT_BUTTON_CLASS));
                var headerButton = [].slice.call(this.parent.element.querySelector('.' + GROUP_PIVOT_ROW).querySelectorAll('.' + PIVOT_BUTTON_CLASS));
                pivotButtons = groupingbarButton.concat(headerButton);
            }
            else if (chartAxis) {
                pivotButtons = [].slice.call(this.parent.element.querySelector('.' + CHART_GROUPING_BAR_CLASS).querySelectorAll('.' + PIVOT_BUTTON_CLASS));
            }
            /* tslint:enable */
        }
        return pivotButtons;
    };
    KeyboardInteraction.prototype.processTab = function (e) {
        var _this = this;
        var target = e.target;
        if (target && (sf.base.closest(target, '.' + PIVOT_BUTTON_CLASS) || target.classList.contains(GROUP_ROW))) {
            if (this.parent.internalGrid) {
                if (target.classList.contains(GROUP_ROW) && target.querySelector('.' + BUTTON_FOCUSED)) {
                    target = target.querySelector('.' + BUTTON_FOCUSED);
                }
                var nextButton = this.getAdjacentButton(target, 'next');
                if (nextButton.getAttribute('data-uid') !== target.getAttribute('data-uid')) {
                    sf.base.addClass([nextButton], BUTTON_FOCUSED);
                    nextButton.focus();
                }
                e.preventDefault();
                return;
            }
        }
        else if (target && sf.base.closest(target, '.' + GRID_TOOLBAR) && this.parent.options.showToolbar) {
            clearTimeout(this.timeOutObj);
            this.timeOutObj = setTimeout(function () {
                var activeElement = _this.getAdjacentToolbarItem(document.activeElement, 'next');
                /* tslint:disable-next-line:max-line-length */
                sf.base.removeClass(sf.base.closest(target, '.' + GRID_TOOLBAR).querySelectorAll('.' + MENU_ITEM_CLASS + '.' + FOCUSED_CLASS), FOCUSED_CLASS);
                if (activeElement && activeElement.classList.contains(MENU_ITEM_CLASS)) {
                    sf.base.addClass([activeElement], FOCUSED_CLASS);
                }
            });
        }
    };
    KeyboardInteraction.prototype.getAdjacentToolbarItem = function (activeElement, position) {
        if (activeElement.classList.contains(MENU_ITEM_CLASS) && activeElement.classList.contains(FOCUSED_CLASS)) {
            var toolbarItem = sf.base.closest(activeElement, '.' + TOOLBAR_ITEM);
            /* tslint:disable-next-line:max-line-length */
            var toolbarItems = [].slice.call(sf.base.closest(activeElement, '.' + GRID_TOOLBAR).querySelectorAll('.' + TOOLBAR_ITEM + ':not(.' + OVERLAY + ')'));
            if (position == 'next') {
                for (var i = 0; i < toolbarItems.length; i++) {
                    if (toolbarItem.id === toolbarItems[i].id) {
                        return this.getActiveElement(toolbarItems[i + 1]);
                    }
                }
            }
            else {
                for (var i = toolbarItems.length - 1; i > -1; i--) {
                    if (toolbarItem.id === toolbarItems[i].id) {
                        return this.getActiveElement(toolbarItems[i - 1]);
                    }
                }
            }
        }
        return activeElement;
    };
    KeyboardInteraction.prototype.getActiveElement = function (item) {
        if (item) {
            if (item.firstElementChild.tagName.toLowerCase() === 'button') {
                item.firstElementChild.focus();
                return item.firstElementChild;
            }
            else if (item.querySelector('.' + MENU_ITEM_CLASS)) {
                item.querySelector('.' + MENU_ITEM_CLASS).focus();
                return item.querySelector('.' + MENU_ITEM_CLASS);
            }
        }
        return document.activeElement;
    };
    KeyboardInteraction.prototype.processShiftTab = function (e) {
        var _this = this;
        var target = e.target;
        if (target && (sf.base.closest(target, '.' + PIVOT_BUTTON_CLASS) || target.classList.contains(GROUP_ROW))) {
            if (this.parent.internalGrid) {
                if (target.classList.contains(GROUP_ROW) && target.querySelector('.' + BUTTON_FOCUSED)) {
                    target = target.querySelector('.' + BUTTON_FOCUSED);
                }
                else if (target.classList.contains(GROUP_ROW)) {
                    target = this.parent.element.querySelector('.' + BUTTON_FOCUSED) ?
                        this.parent.element.querySelector('.' + BUTTON_FOCUSED) :
                        this.parent.element.querySelector('.' + GRID_GROUPING_BAR_CLASS);
                    var allPivotButtons = this.allpivotButtons(target);
                    if (allPivotButtons.length > 0 && allPivotButtons[allPivotButtons.length - 1]) {
                        allPivotButtons[allPivotButtons.length - 1].focus();
                        sf.base.removeClass(allPivotButtons, BUTTON_FOCUSED);
                        sf.base.addClass([allPivotButtons[allPivotButtons.length - 1]], BUTTON_FOCUSED);
                        e.preventDefault();
                        return;
                    }
                }
                var prevButton = this.getAdjacentButton(target, 'previous');
                if (prevButton.getAttribute('data-uid') !== target.getAttribute('data-uid')) {
                    prevButton.focus();
                    e.preventDefault();
                    return;
                }
            }
        }
        else if (target && this.parent.internalGrid && (target.classList.contains(MOVABLE_FIRST) ||
            (target.classList.contains(ROWSHEADER) && sf.base.closest(target, 'tr').getAttribute('data-uid') ===
                this.parent.internalGrid.element.querySelector('.' + FROZENCONTENT_DIV + ' tr').getAttribute('data-uid')))) {
            var allPivotButtons_1 = this.allpivotButtons(target);
            if (allPivotButtons_1.length > 0) {
                setTimeout(function () {
                    allPivotButtons_1[allPivotButtons_1.length - 1].focus();
                });
                sf.base.removeClass(allPivotButtons_1, BUTTON_FOCUSED);
                sf.base.addClass([allPivotButtons_1[allPivotButtons_1.length - 1]], BUTTON_FOCUSED);
                e.preventDefault();
                return;
            }
        }
        else if (target && sf.base.closest(target, '.' + GRID_TOOLBAR) &&
            this.parent.options.showToolbar) {
            clearTimeout(this.timeOutObj);
            this.timeOutObj = setTimeout(function () {
                var activeElement = _this.getAdjacentToolbarItem(document.activeElement, 'previous');
                /* tslint:disable-next-line:max-line-length */
                sf.base.removeClass(sf.base.closest(target, '.' + GRID_TOOLBAR).querySelectorAll('.' + MENU_ITEM_CLASS + '.' + FOCUSED_CLASS), FOCUSED_CLASS);
                if (activeElement && activeElement.classList.contains(MENU_ITEM_CLASS)) {
                    sf.base.addClass([activeElement], FOCUSED_CLASS);
                }
            });
        }
    };
    KeyboardInteraction.prototype.processEnter = function (e) {
        var target = e.target;
        if (target && sf.base.closest(target, '.' + GRID_CLASS)) {
            if (e.keyCode === 13 && !e.shiftKey && !e.ctrlKey) {
                if (target.querySelector('.' + ICON)) {
                    this.event = e;
                    target.querySelector('.' + ICON).click();
                }
                else if (target.classList.contains(VALUESCONTENT)) {
                    target.dispatchEvent(new MouseEvent('dblclick', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true
                    }));
                }
            }
            else if (e.keyCode === 13 && e.shiftKey && !e.ctrlKey) {
                if (this.parent.options.enableValueSorting) {
                    this.event = e;
                    target.click();
                }
            }
            else if (e.keyCode === 13 && !e.shiftKey && e.ctrlKey) {
                if (this.parent.options.hyperlinkSettings && target.querySelector('a')) {
                    target.querySelector('a').click();
                }
            }
            e.preventDefault();
            return;
        }
    };
    KeyboardInteraction.prototype.toggleFieldList = function (e) {
        /* tslint:disable */
        var pivot = this.parent;
        var target = e.target;
        if (pivot && pivot.options.showFieldList &&
            pivot.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)) {
            if (!pivot.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).classList.contains(ICON_HIDDEN)) {
                pivot.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).click();
                e.preventDefault();
                return;
            }
            else if ((pivot.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).classList.contains(ICON_HIDDEN) ||
                pivot.options.showToolbar) && target && sf.base.closest(target, '.' + PIVOT_VIEW_CLASS) && pivot.pivotFieldListModule &&
                pivot.pivotFieldListModule.parentElement && pivot.pivotFieldListModule.parentElement.classList.contains(POPUP_OPEN)) {
                var dialogInstance = pivot.pivotFieldListModule.parentElement['blazor__instance'];
                if (dialogInstance && !dialogInstance.closeOnEscape) {
                    dialogInstance.dotNetRef.invokeMethodAsync('CloseDialog', {
                        altKey: e.altKey,
                        ctrlKey: e.ctrlKey,
                        code: e.code,
                        key: e.key,
                        location: e.location,
                        repeat: e.repeat,
                        shiftKey: e.shiftKey,
                        metaKey: e.metaKey,
                        type: e.type
                    });
                }
            }
        }
        /* tslint:enable */
    };
    KeyboardInteraction.prototype.destroy = function () {
        if (this.pivotViewKeyboardModule) {
            this.pivotViewKeyboardModule.destroy();
        }
        else {
            return;
        }
    };
    return KeyboardInteraction;
}());

/**
 * Module for Selection action
 */
var Selection = /** @class */ (function () {
    function Selection(parent) {
        this.isPopupClicked = false;
        this.shiftLockedPos = [];
        this.savedSelectedCellsPos = [];
        this.cellSelectionPos = [];
        this.parent = parent;
        this.parent.selectionModule = this;
    }
    Selection.prototype.addInternalEvents = function () {
        this.wireEvents();
    };
    Selection.prototype.wireEvents = function () {
        this.unWireEvents();
        sf.base.EventHandler.add(this.parent.element, this.parent.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler, this);
    };
    Selection.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.parent.element, this.parent.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler);
    };
    Selection.prototype.mouseClickHandler = function (e) {
        if (e.which === 3) {
            this.lastCellClicked = e.target;
        }
        else if (e.which === 0) {
            this.lastCellClicked = e.target;
        }
        var target = e.target;
        if ((target.classList.contains(HEADERCELL) ||
            target.classList.contains(HEADER_CELL_DIV) ||
            target.classList.contains(ROWSHEADER) ||
            target.classList.contains(ROW_CELL_CLASS) ||
            target.classList.contains(STACKED_HEADER_CELL_DIV) ||
            target.classList.contains(HEADER_TEXT) ||
            target.classList.contains(STACKED_HEADER_TEXT)) && this.parent.options.dataType === 'pivot') {
            var targetElement = null;
            if (target.classList.contains(HEADERCELL) || target.classList.contains(ROWSHEADER)
                || target.classList.contains(ROW_CELL_CLASS)) {
                targetElement = target;
            }
            else if (target.classList.contains(STACKED_HEADER_CELL_DIV) || target.classList.contains(CELLVALUE) || target.classList.contains(HEADER_CELL_DIV) ||
                target.classList.contains(ASCENDING_CLASS) || target.classList.contains(DESCENDING_CLASS)) {
                targetElement = target.parentElement;
            }
            else if (target.classList.contains(HEADER_TEXT)) {
                targetElement = target.parentElement.parentElement;
            }
            this.cellClicked(target, e);
        }
        else {
            this.cellClicked(target, e);
            return;
        }
    };
    Selection.prototype.cellClicked = function (target, e) {
        var targetElement = null;
        if (target.classList.contains(HEADERCELL) || target.classList.contains(STACKED_HEADER_CELL) || target.classList.contains(ROW_CELL_CLASS)) {
            targetElement = target;
        }
        else if (target.classList.contains(STACKED_HEADER_CELL_DIV) || target.classList.contains(CELLVALUE) || target.classList.contains(HEADER_CELL_DIV)) {
            targetElement = target.parentElement;
        }
        else if (target.classList.contains(HEADER_TEXT)) {
            targetElement = target.parentElement.parentElement.parentElement;
        }
        else if (target.classList.contains(STACKED_HEADER_TEXT)) {
            targetElement = target.parentElement.parentElement;
        }
        else if (target.classList.contains(ROW_SELECT)) {
            if (target.classList.contains(SPAN_CLICKED)) {
                this.isPopupClicked = false;
            }
            else {
                this.isPopupClicked = true;
            }
        }
        if (targetElement) {
            var colIndex = Number(targetElement.getAttribute('aria-colindex'));
            var rowIndex = Number(targetElement.getAttribute('index'));
            var colSpan = Number(targetElement.getAttribute('aria-colspan'));
            if (this.parent.gridSettings.allowSelection) {
                if (this.parent.gridSettings.selectionSettings.mode === 'Both' ? !targetElement.classList.contains(ROW_CELL_CLASS) : this.parent.gridSettings.selectionSettings.mode !== 'Row') {
                    this.clearSelection(targetElement, e, colIndex, rowIndex);
                    this.applyColumnSelection(e, targetElement, colIndex, colIndex + (colSpan > 0 ? colSpan - 1 : 0), rowIndex);
                }
                else {
                    this.clearSelection(targetElement, e, colIndex, rowIndex);
                }
            }
            this.getSelectedCellsPos();
            var cellPos = JSON.stringify(this.savedSelectedCellsPos);
            if (this.parent.gridSettings.selectionSettings.mode === 'Both' ? !targetElement.classList.contains(ROW_CELL_CLASS) : this.parent.gridSettings.selectionSettings.mode === 'Cell' ?
                targetElement.classList.contains(COLUMNSHEADER) : this.parent.gridSettings.selectionSettings.mode !== 'Row') {
                this.parent.dotNetRef.invokeMethodAsync('CellClickedHandler', rowIndex, colIndex, e, JSON.stringify(window.sfBlazor.getDomObject('cellElement', targetElement)));
                this.parent.dotNetRef.invokeMethodAsync('SelectHandler', colIndex, rowIndex, cellPos);
                this.savedSelectedCellsPos = [];
            }
            if (!this.parent.gridSettings.allowSelection && !(target.classList.contains(EXPAND_ICON) || target.classList.contains(COLLAPSE_ICON))) {
                this.parent.dotNetRef.invokeMethodAsync('CellClickedHandler', rowIndex, colIndex, e, JSON.stringify(window.sfBlazor.getDomObject('cellElement', targetElement)));
            }
        }
    };
    Selection.prototype.clearSelection = function (targetElement, e, colIndex, rowIndex) {
        if ((!e.shiftKey && !e.ctrlKey) || this.parent.gridSettings.selectionSettings.type === 'Single') {
            if (this.parent.gridSettings.selectionSettings.mode === 'Cell') {
                if (targetElement.classList.contains(COLUMNSHEADER)) {
                    sf.base.removeClass(this.parent.element.querySelectorAll(('.' + ROW_CELL_CLASS + '.') + CELL_SELECTED_BGCOLOR), CELL_SELECTED_BGCOLOR);
                }
                else {
                    sf.base.removeClass(this.parent.element.querySelectorAll(('.' + COLUMNSHEADER + '.') + CELL_ACTIVE_BGCOLOR), [CELL_ACTIVE_BGCOLOR, SELECTED_BGCOLOR]);
                }
            }
            else if (this.parent.gridSettings.selectionSettings.mode === 'Both') {
                if (targetElement.classList.contains(ROW_CELL_CLASS)) {
                    for (var _i = 0, _a = [].slice.call(this.parent.element.querySelectorAll('.' + SELECTED_BGCOLOR + ', .' + CELL_SELECTED_BGCOLOR)); _i < _a.length; _i++) {
                        var ele = _a[_i];
                        sf.base.removeClass([ele], [CELL_ACTIVE_BGCOLOR, SELECTED_BGCOLOR, CELL_SELECTED_BGCOLOR]);
                    }
                }
                else {
                    sf.base.removeClass(this.parent.element.querySelectorAll('.' + CELL_SELECTED_BGCOLOR), CELL_SELECTED_BGCOLOR);
                }
            }
        }
    };
    Selection.prototype.applyColumnSelection = function (e, target, colStart, colEnd, rowStart) {
        var colIndex = Number(target.getAttribute('aria-colindex'));
        var rowIndex = Number(target.getAttribute('index'));
        if (!target.classList.contains(ROWSHEADER) || (this.parent.gridSettings.selectionSettings.mode === 'Cell' ? target.classList.contains(COLUMNSHEADER) : true)) {
            var isCtrl = e.ctrlKey;
            if (this.parent.gridSettings.selectionSettings.type === 'Multiple' && this.parent.element.querySelector('.' + ROW_SELECT) !== null) {
                if (this.isPopupClicked) {
                    this.parent.element.querySelector('.' + ROW_SELECT).classList.add(SPAN_CLICKED);
                    isCtrl = true;
                }
                else {
                    this.parent.element.querySelector('.' + ROW_SELECT).classList.remove(SPAN_CLICKED);
                    isCtrl = false;
                }
            }
            var queryStringArray = [];
            var type = this.parent.gridSettings.selectionSettings.type;
            var isToggle = target.classList.contains(CELL_ACTIVE_BGCOLOR);
            var activeColumns = [];
            var actColPos = {};
            for (var cCnt = colStart; cCnt <= colEnd; cCnt++) {
                activeColumns.push(cCnt.toString());
            }
            if (!isCtrl || type === 'Single') {
                for (var _i = 0, _a = [].slice.call(this.parent.element.querySelectorAll('.' + CELL_ACTIVE_BGCOLOR)); _i < _a.length; _i++) {
                    var targetElement = _a[_i];
                    sf.base.removeClass([targetElement], [CELL_ACTIVE_BGCOLOR, SELECTED_BGCOLOR]);
                    if (activeColumns.indexOf(targetElement.getAttribute('aria-colindex')) === -1) {
                        isToggle = false;
                    }
                    var colIndex_1 = Number(targetElement.getAttribute('aria-colindex'));
                    actColPos[colIndex_1] = colIndex_1;
                }
                activeColumns = Object.keys(actColPos).length > 0 ? Object.keys(actColPos).sort(function (a, b) {
                    return a - b;
                }) : activeColumns;
            }
            else {
                isToggle = false;
            }
            if (type === 'Multiple' && e.shiftKey) {
                this.shiftLockedPos = this.shiftLockedPos.length === 0 ? activeColumns : this.shiftLockedPos;
                if (Number(this.shiftLockedPos[0]) <= colStart) {
                    colStart = Number(this.shiftLockedPos[0]);
                }
                else {
                    colEnd = colEnd < Number(this.shiftLockedPos[this.shiftLockedPos.length - 1]) ? Number(this.shiftLockedPos[this.shiftLockedPos.length - 1]) : colEnd;
                }
            }
            else {
                this.shiftLockedPos = [];
            }
            var rowSelectedList = [];
            if (e.ctrlKey && this.parent.gridSettings.selectionSettings.mode === 'Both' && type === 'Multiple' && !target.classList.contains(ROWSHEADER)) {
                for (var _b = 0, _c = [].slice.call(this.parent.element.querySelectorAll('.' + ROWSHEADER + '.' + CELL_SELECTED_BGCOLOR)); _b < _c.length; _b++) {
                    var targetElement = _c[_b];
                    rowSelectedList.push(targetElement.getAttribute('index'));
                }
            }
            var count = colStart;
            while (count <= colEnd) {
                queryStringArray.push('[aria-colindex="' + count + '"]' + (this.parent.gridSettings.selectionSettings.mode === 'Cell' ? '[index="' + rowStart + '"]' : '') + '');
                count++;
            }
            if (!isToggle) {
                rowStart = target.classList.contains(HEADERCELL) ? rowStart : (this.parent.scrollPageInfo.rowStartPos - 1);
                var isTargetSelected = target.classList.contains(CELL_ACTIVE_BGCOLOR);
                for (var _d = 0, _e = [].slice.call(this.parent.element.querySelectorAll(queryStringArray.toString())); _d < _e.length; _d++) {
                    var targetElement = _e[_d];
                    if (Number(targetElement.getAttribute('index')) >= rowStart) {
                        if (isTargetSelected && isCtrl && rowSelectedList.indexOf(rowIndex.toString()) === -1) {
                            sf.base.removeClass([targetElement], [CELL_ACTIVE_BGCOLOR, SELECTED_BGCOLOR]);
                        }
                        else {
                            sf.base.addClass([targetElement], [CELL_ACTIVE_BGCOLOR, SELECTED_BGCOLOR]);
                        }
                    }
                }
            }
        }
    };
    Selection.prototype.getSelectedCellsPos = function () {
        for (var _i = 0, _a = [].slice.call(this.parent.element.querySelectorAll('.' + SELECTED_BGCOLOR)); _i < _a.length; _i++) {
            var targetElement = _a[_i];
            this.savedSelectedCellsPos.push({ rowIndex: targetElement.getAttribute('index'), colIndex: targetElement.getAttribute('aria-colindex') });
        }
        for (var _b = 0, _c = [].slice.call(this.parent.element.querySelectorAll('.' + CELL_SELECTED_BGCOLOR)); _b < _c.length; _b++) {
            var targetElement = _c[_b];
            this.cellSelectionPos.push({ rowIndex: targetElement.getAttribute('index'), colIndex: targetElement.getAttribute('aria-colindex') });
        }
    };
    Selection.prototype.destroy = function () {
        this.unWireEvents();
    };
    return Selection;
}());

/**
 * Module for Virtual Scrolling action
 */
var VirtualScroll = /** @class */ (function () {
    function VirtualScroll(parent) {
        this.previousValues = { top: 0, left: 0 };
        this.frozenPreviousValues = { top: 0, left: 0 };
        this.eventType = '';
        this.isScrolling = false;
        this.parent = parent;
        this.parent.virtualScrollModule = this;
    }
    VirtualScroll.prototype.addInternalEvents = function () {
        this.wireEvents();
    };
    VirtualScroll.prototype.wireEvents = function () {
        this.unWireEvents();
        var mCont = this.parent.element.querySelector('.' + MOVABLECONTENT_DIV);
        var fCont = this.parent.element.querySelector('.' + FROZENCONTENT_DIV);
        var mHdr = this.parent.element.querySelector('.' + MOVABLEHEADER_DIV);
        sf.base.EventHandler.clearEvents(mCont);
        sf.base.EventHandler.clearEvents(fCont);
        sf.base.EventHandler.add(mCont, 'scroll touchmove pointermove', this.onHorizondalScroll(mHdr, mCont, fCont), this);
        sf.base.EventHandler.add(mCont, 'scroll wheel touchmove pointermove keyup keydown', this.onVerticalScroll(fCont, mCont), this);
        sf.base.EventHandler.add(mCont, 'mouseup touchend', this.common(mHdr, mCont, fCont), this);
        sf.base.EventHandler.add(fCont, 'wheel', this.onWheelScroll(mCont, fCont), this);
        sf.base.EventHandler.add(fCont, 'touchstart pointerdown', this.setPageXY(), this);
        sf.base.EventHandler.add(fCont, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont), this);
        sf.base.EventHandler.add(mHdr, 'touchstart pointerdown', this.setPageXY(), this);
        sf.base.EventHandler.add(mHdr, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont), this);
    };
    VirtualScroll.prototype.unWireEvents = function () {
        var mCont = this.parent.element.querySelector('.' + MOVABLECONTENT_DIV);
        var fCont = this.parent.element.querySelector('.' + FROZENCONTENT_DIV);
        var mHdr = this.parent.element.querySelector('.' + MOVABLEHEADER_DIV);
        sf.base.EventHandler.remove(mCont, 'scroll touchmove pointermove', this.onHorizondalScroll(mHdr, mCont, fCont));
        sf.base.EventHandler.remove(mCont, 'scroll wheel touchmove pointermove keyup keydown', this.onVerticalScroll(fCont, mCont));
        sf.base.EventHandler.remove(mCont, 'mouseup touchend', this.common(mHdr, mCont, fCont));
        sf.base.EventHandler.remove(fCont, 'wheel', this.onWheelScroll(mCont, fCont));
        sf.base.EventHandler.remove(fCont, 'touchstart pointerdown', this.setPageXY());
        sf.base.EventHandler.remove(fCont, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont));
        sf.base.EventHandler.remove(mHdr, 'touchstart pointerdown', this.setPageXY());
        sf.base.EventHandler.remove(mHdr, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont));
    };
    VirtualScroll.prototype.onWheelScroll = function (mCont, fCont) {
        var _this = this;
        var element = mCont;
        return function (e) {
            var top = element.scrollTop + (e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY);
            if (_this.frozenPreviousValues.top === top) {
                return;
            }
            e.preventDefault();
            fCont.scrollTop = top;
            element.scrollTop = top;
            _this.frozenPreviousValues.top = top;
            _this.eventType = e.type;
        };
    };
    VirtualScroll.prototype.getPointXY = function (e) {
        var pageXY = { x: 0, y: 0 };
        if (!(e.touches && e.touches.length)) {
            pageXY.x = e.pageX;
            pageXY.y = e.pageY;
        }
        else {
            pageXY.x = e.touches[0].pageX;
            pageXY.y = e.touches[0].pageY;
        }
        return pageXY;
    };
    VirtualScroll.prototype.onTouchScroll = function (mHdr, mCont, fCont) {
        var _this = this;
        var element = mCont;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            var pageXY = _this.getPointXY(e);
            var top = element.scrollTop + (_this.pageXY.y - pageXY.y);
            var left = element.scrollLeft + (_this.pageXY.x - pageXY.x);
            if (_this.parent.element.querySelector('.' + HEADERCONTENT).contains(e.target)) {
                if (_this.frozenPreviousValues.left === left || left < 0) {
                    return;
                }
                mHdr.scrollLeft = left;
                element.scrollLeft = left;
                _this.pageXY.x = pageXY.x;
                _this.frozenPreviousValues.left = left;
            }
            else {
                if (_this.frozenPreviousValues.top === top || top < 0) {
                    return;
                }
                fCont.scrollTop = top;
                element.scrollTop = top;
                _this.pageXY.y = pageXY.y;
                _this.frozenPreviousValues.top = top;
            }
            _this.eventType = e.type;
        };
    };
    VirtualScroll.prototype.update = function (mHdr, mCont, top, left, e) {
        this.isScrolling = true;
        if (this.parent.pageSettings) {
            if (this.direction === 'vertical') {
                var rowValues = this.parent.dataSourceSettings.valueAxis === 'row' ? this.parent.dataSourceSettings.values.length : 1;
                var exactSize = (this.parent.pageSettings.rowSize * rowValues * this.parent.gridSettings.rowHeight);
                var section = Math.ceil(top / exactSize);
                this.parent.scrollPosObject.vertical = section;
                var rowStartPos = 0;
                if (this.parent.options.dataType === 'pivot') {
                    this.parent.dotNetRef.invokeMethodAsync('UpdateScrollInfo', section, this.direction);
                    rowStartPos = this.parent.scrollPageInfo.rowStartPos;
                    var exactpage = Math.ceil(rowStartPos / (this.parent.pageSettings.rowSize * rowValues));
                    var pos = exactSize * exactpage - (this.parent.scrollPageInfo.rowFirstLvl * rowValues * this.parent.gridSettings.rowHeight);
                    this.parent.scrollPosObject.verticalSection = pos;
                }
            }
            else {
                var colValues = this.parent.dataSourceSettings.valueAxis === 'column' ? this.parent.dataSourceSettings.values.length : 1;
                var exactSize = (this.parent.pageSettings.columnSize *
                    colValues * this.parent.gridSettings.columnWidth);
                var section = Math.ceil(left / exactSize);
                this.parent.scrollPosObject.horizontal = section;
                var colStartPos = 0;
                if (this.parent.options.dataType === 'pivot') {
                    this.parent.dotNetRef.invokeMethodAsync('UpdateScrollInfo', section, this.direction);
                    colStartPos = this.parent.scrollPageInfo.colStartPos;
                    var exactPage = Math.ceil(colStartPos / (this.parent.pageSettings.columnSize * colValues));
                    var pos = exactSize * exactPage - (this.parent.scrollPageInfo.colFirstLvl * colValues * this.parent.gridSettings.columnWidth);
                    this.parent.scrollPosObject.horizontalSection = pos;
                }
            }
        }
    };
    VirtualScroll.prototype.setPageXY = function () {
        var _this = this;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            _this.pageXY = _this.getPointXY(e);
        };
    };
    VirtualScroll.prototype.common = function (mHdr, mCont, fCont) {
        var _this = this;
        return function (e) {
            _this.update(mHdr, mCont, mCont.scrollTop * _this.parent.verticalScrollScale, mCont.scrollLeft * _this.parent.horizontalScrollScale, e);
        };
    };
    VirtualScroll.prototype.onHorizondalScroll = function (mHdr, mCont, fCont) {
        var _this = this;
        /* tslint:disable-next-line */
        var timeOutObj;
        return function (e) {
            var left = mCont.scrollLeft * _this.parent.horizontalScrollScale;
            if (e.type === 'wheel' || e.type === 'touchmove' || _this.eventType === 'wheel' || _this.eventType === 'touchmove') {
                clearTimeout(timeOutObj);
                /* tslint:disable */
                timeOutObj = setTimeout(function () {
                    left = e.type === 'touchmove' ? mCont.scrollLeft : left;
                    _this.update(mHdr, mCont, mCont.scrollTop * _this.parent.verticalScrollScale, left, e);
                }, 300);
            }
            if (_this.previousValues.left === left) {
                fCont.scrollTop = mCont.scrollTop;
                return;
            }
            _this.direction = 'horizondal';
            var horiOffset = -((left - _this.parent.scrollPosObject.horizontalSection - mCont.scrollLeft));
            var vertiOffset = mCont.querySelector('.' + TABLE).style.transform.split(',')[1].trim();
            if (mCont.scrollLeft < _this.parent.scrollerBrowserLimit) {
                sf.base.setStyleAttribute(mCont.querySelector('.' + TABLE), {
                    transform: 'translate(' + horiOffset + 'px,' + vertiOffset
                });
                sf.base.setStyleAttribute(mHdr.querySelector('.' + TABLE), {
                    transform: 'translate(' + horiOffset + 'px,' + 0 + 'px)'
                });
            }
            var excessMove = _this.parent.scrollPosObject.horizontalSection > left ?
                -(_this.parent.scrollPosObject.horizontalSection - left) : ((left + mHdr.offsetWidth) -
                (_this.parent.scrollPosObject.horizontalSection + mCont.querySelector('.' + TABLE).offsetWidth));
            var notLastPage = Math.ceil(_this.parent.scrollPosObject.horizontalSection / _this.parent.horizontalScrollScale) <
                _this.parent.scrollerBrowserLimit;
            if (_this.parent.scrollPosObject.horizontalSection > left ? true : (excessMove > 1 && notLastPage)) {
                if (left > mHdr.clientWidth) {
                    if (_this.parent.scrollPosObject.left < 1) {
                        _this.parent.scrollPosObject.left = mHdr.clientWidth;
                    }
                    _this.parent.scrollPosObject.left = _this.parent.scrollPosObject.left - 50;
                    excessMove = _this.parent.scrollPosObject.horizontalSection > left ?
                        (excessMove - _this.parent.scrollPosObject.left) : (excessMove + _this.parent.scrollPosObject.left);
                }
                else {
                    excessMove = -_this.parent.scrollPosObject.horizontalSection;
                }
                horiOffset = -((left - (_this.parent.scrollPosObject.horizontalSection + excessMove) - mCont.scrollLeft));
                var vWidth = (_this.parent.gridSettings.columnWidth * _this.parent.scrollPageInfo.columnCount
                    - _this.parent.internalGrid.columnModel[0].width);
                if (vWidth > _this.parent.scrollerBrowserLimit) {
                    _this.parent.horizontalScrollScale = vWidth / _this.parent.scrollerBrowserLimit;
                    vWidth = _this.parent.scrollerBrowserLimit;
                }
                if (horiOffset > vWidth && horiOffset > left) {
                    horiOffset = left;
                    excessMove = 0;
                }
                sf.base.setStyleAttribute(mCont.querySelector('.' + TABLE), {
                    transform: 'translate(' + horiOffset + 'px,' + vertiOffset
                });
                sf.base.setStyleAttribute(mHdr.querySelector('.' + TABLE), {
                    transform: 'translate(' + horiOffset + 'px,' + 0 + 'px)'
                });
                _this.parent.scrollPosObject.horizontalSection = _this.parent.scrollPosObject.horizontalSection + excessMove;
            }
            _this.previousValues.left = left;
            _this.frozenPreviousValues.left = left;
            _this.eventType = '';
            mHdr.scrollLeft = mCont.scrollLeft;
        };
    };
    VirtualScroll.prototype.onVerticalScroll = function (fCont, mCont) {
        var _this = this;
        var timeOutObj;
        return function (e) {
            var top = mCont.scrollTop * _this.parent.verticalScrollScale;
            if (e.type === 'wheel' || e.type === 'touchmove' || _this.eventType === 'wheel' || _this.eventType === 'touchmove' || e.type === 'keyup' || e.type === 'keydown') {
                clearTimeout(timeOutObj);
                timeOutObj = setTimeout(function () {
                    _this.update(null, mCont, mCont.scrollTop * _this.parent.verticalScrollScale, mCont.scrollLeft * _this.parent.horizontalScrollScale, e);
                }, 300);
            }
            /* tslint:enable */
            if (_this.previousValues.top === top) {
                return;
            }
            _this.direction = 'vertical';
            var vertiOffset = -((top - _this.parent.scrollPosObject.verticalSection - mCont.scrollTop));
            var horiOffset = mCont.querySelector('.' + TABLE).style.transform.split(',')[0].trim();
            if (mCont.scrollTop < _this.parent.scrollerBrowserLimit) {
                sf.base.setStyleAttribute(fCont.querySelector('.' + TABLE), {
                    transform: 'translate(' + 0 + 'px,' + vertiOffset + 'px)'
                });
                sf.base.setStyleAttribute(mCont.querySelector('.' + TABLE), {
                    transform: horiOffset + ',' + vertiOffset + 'px)'
                });
            }
            var excessMove = _this.parent.scrollPosObject.verticalSection > top ?
                -(_this.parent.scrollPosObject.verticalSection - top) : ((top + fCont.clientHeight) -
                (_this.parent.scrollPosObject.verticalSection + fCont.querySelector('.' + TABLE).offsetHeight));
            var notLastPage = Math.ceil(_this.parent.scrollPosObject.verticalSection / _this.parent.verticalScrollScale) <
                _this.parent.scrollerBrowserLimit;
            if (_this.parent.scrollPosObject.verticalSection > top ? true : (excessMove > 1 && notLastPage)) {
                if (top > fCont.clientHeight) {
                    if (_this.parent.scrollPosObject.top < 1) {
                        _this.parent.scrollPosObject.top = fCont.clientHeight;
                    }
                    _this.parent.scrollPosObject.top = _this.parent.scrollPosObject.top - 50;
                    excessMove = _this.parent.scrollPosObject.verticalSection > top ?
                        (excessMove - _this.parent.scrollPosObject.top) : (excessMove + _this.parent.scrollPosObject.top);
                }
                else {
                    excessMove = -_this.parent.scrollPosObject.verticalSection;
                }
                var movableTable = _this.parent.element.querySelector('.' + MOVABLECONTENT_DIV).querySelector('.' + TABLE);
                vertiOffset = -((top - (_this.parent.scrollPosObject.verticalSection + excessMove) - mCont.scrollTop));
                var vHeight = (_this.parent.gridSettings.rowHeight * _this.parent.scrollPageInfo.rowCount + 0.1
                    - movableTable.clientHeight);
                if (vHeight > _this.parent.scrollerBrowserLimit) {
                    _this.parent.verticalScrollScale = vHeight / _this.parent.scrollerBrowserLimit;
                    vHeight = _this.parent.scrollerBrowserLimit;
                }
                if (vertiOffset > vHeight && vertiOffset > top) {
                    vertiOffset = top;
                    excessMove = 0;
                }
                sf.base.setStyleAttribute(fCont.querySelector('.' + TABLE), {
                    transform: 'translate(' + 0 + 'px,' + vertiOffset + 'px)'
                });
                sf.base.setStyleAttribute(mCont.querySelector('.' + TABLE), {
                    transform: horiOffset + ',' + vertiOffset + 'px)'
                });
                _this.parent.scrollPosObject.verticalSection = _this.parent.scrollPosObject.verticalSection + excessMove;
            }
            _this.previousValues.top = top;
            _this.frozenPreviousValues.top = top;
            _this.eventType = '';
            fCont.scrollTop = mCont.scrollTop;
            mCont.scrollTop = fCont.scrollTop;
        };
    };
    VirtualScroll.prototype.updateScrollInfo = function (element, columnCount, rowCount) {
        if (this.parent.options.enableVirtualization) {
            var virtualHeaderDiv = void 0;
            var virtualDiv = void 0;
            if (element.querySelector('.' + MOVABLECONTENT_DIV) &&
                !element.querySelector('.' + MOVABLECONTENT_DIV).querySelector('.' + VIRTUALTRACK_DIV)) {
                virtualDiv = sf.base.createElement('div', { className: VIRTUALTRACK_DIV });
                element.querySelector('.' + MOVABLECONTENT_DIV).appendChild(virtualDiv);
            }
            if (element.querySelector('.' + MOVABLEHEADER_DIV) &&
                !element.querySelector('.' + MOVABLEHEADER_DIV).querySelector('.' + VIRTUALTRACK_DIV)) {
                virtualHeaderDiv = sf.base.createElement('div', { className: VIRTUALTRACK_DIV });
                element.querySelector('.' + MOVABLEHEADER_DIV).appendChild(virtualHeaderDiv);
            }
            else {
                virtualHeaderDiv = element.querySelector('.' + MOVABLEHEADER_DIV).querySelector('.' + VIRTUALTRACK_DIV);
            }
            var movableTable = element.querySelector('.' + MOVABLECONTENT_DIV).querySelector('.' + TABLE);
            var vHeight = (this.parent.gridSettings.rowHeight * rowCount + 0.1 - movableTable.clientHeight);
            if (vHeight > this.parent.scrollerBrowserLimit) {
                this.parent.verticalScrollScale = vHeight / this.parent.scrollerBrowserLimit;
                vHeight = this.parent.scrollerBrowserLimit;
            }
            var vWidth = (this.parent.gridSettings.columnWidth * columnCount
                - this.parent.internalGrid.columnModel[0].width);
            if (vWidth > this.parent.scrollerBrowserLimit) {
                this.parent.horizontalScrollScale = vWidth / this.parent.scrollerBrowserLimit;
                vWidth = this.parent.scrollerBrowserLimit;
            }
            sf.base.setStyleAttribute(virtualDiv, {
                height: (vHeight > 0.1 ? vHeight : 0.1) + 'px',
                width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
            });
            sf.base.setStyleAttribute(virtualHeaderDiv, {
                height: 0, width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
            });
            var mCnt = element.querySelector('.' + MOVABLECONTENT_DIV);
            var fCnt = element.querySelector('.' + FROZENCONTENT_DIV);
            var mHdr = element.querySelector('.' + MOVABLEHEADER_DIV);
            var verOffset = (mCnt.scrollTop > this.parent.scrollerBrowserLimit) ?
                mCnt.querySelector('.' + TABLE).style.transform.split(',')[1].trim() :
                -(((mCnt.scrollTop * this.parent.verticalScrollScale) - this.parent.scrollPosObject.verticalSection - mCnt.scrollTop)) + 'px)';
            var horiOffset = (mCnt.scrollLeft > this.parent.scrollerBrowserLimit) ?
                (mCnt.querySelector('.' + TABLE).style.transform.split(',')[0].trim() + ',') :
                'translate(' + -(((mCnt.scrollLeft * this.parent.horizontalScrollScale) -
                    this.parent.scrollPosObject.horizontalSection - mCnt.scrollLeft)) + 'px,';
            sf.base.setStyleAttribute(fCnt.querySelector('.' + TABLE), {
                transform: 'translate(' + 0 + 'px,' + verOffset
            });
            sf.base.setStyleAttribute(mCnt.querySelector('.' + TABLE), {
                transform: horiOffset + verOffset
            });
            sf.base.setStyleAttribute(mHdr.querySelector('.' + TABLE), {
                transform: horiOffset + 0 + 'px)'
            });
        }
    };
    VirtualScroll.prototype.destroy = function () {
        this.unWireEvents();
    };
    return VirtualScroll;
}());

/**
 * SfPivotView client constructor
 */
var SfPivotView = /** @class */ (function () {
    function SfPivotView(element, options, dotnetRef) {
        this.scrollPageInfo = { rowCount: 0, columnCount: 0, colFirstLvl: 0, rowFirstLvl: 0, colStartPos: 0, rowStartPos: 0 };
        this.verticalScrollScale = 1;
        this.horizontalScrollScale = 1;
        this.scrollerBrowserLimit = 8000000;
        this.scrollPosObject = { vertical: 0, horizontal: 0, verticalSection: 0, horizontalSection: 0, top: 0, left: 0, scrollDirection: { direction: '', position: 0 } };
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.getOptions(element, options);
        this.initModules();
    }
    SfPivotView.prototype.getOptions = function (element, options) {
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.parentElement = element;
        this.isAdaptive = sf.base.Browser.isDevice;
        /* tslint:disable */
        this.internalGrid = options.internalGrid && options.internalGrid['blazor__instance'] ?
            options.internalGrid['blazor__instance'] : { element: options.internalGrid };
        this.pivotFieldListModule = options.fieldListModule && options.fieldListModule.blazor__instance ?
            options.fieldListModule.blazor__instance : options.fieldListModule;
        /* tslint:enable */
        this.fieldList = options.fieldList;
        this.dataSourceSettings = options.dataSourceSettings;
        this.gridSettings = options.gridSettings;
        this.editSettings = options.editSettings;
        this.displayOptions = options.displayOptions;
        this.enableValueSorting = options.enableValueSorting;
        this.currentView = this.displayOptions.view === 'Both' ? this.displayOptions.primary : this.displayOptions.view;
        this.groupingBarSettings = this.options.groupingBarsettings;
        this.pageSettings = this.options.pageSettings;
    };
    SfPivotView.prototype.initModules = function () {
        if (this.options.showGroupingBar) {
            this.groupingBarModule = new GroupingBar(this);
        }
        if (this.options.showToolbar) {
            this.toolbarModule = new Toolbar(this);
        }
        if (this.options.allowDrillThrough || this.editSettings.allowEditing) {
            this.drillThroughModule = new DrillThrough(this);
        }
        if (this.options.allowCalculatedField) {
            this.calculatedFieldModule = new CalculatedField(this);
        }
        if (this.options.enableVirtualization) {
            this.virtualScrollModule = new VirtualScroll(this);
        }
        if (this.gridSettings.allowSelection) {
            this.selectionModule = new Selection(this);
        }
        this.keyboardModule = new KeyboardInteraction(this);
        this.commonActionModule = new ActionBase(this);
        this.contentReady();
        this.unWireEvents();
        this.wireEvents();
    };
    SfPivotView.prototype.updateModuleProperties = function () {
        if (this.options.showGroupingBar) {
            this.groupingBarModule.parent =
                this.pivotButtonModule.parent = this;
        }
        if (this.options.showToolbar) {
            this.toolbarModule.parent = this;
        }
        if (this.options.allowDrillThrough || this.editSettings.allowEditing) {
            this.drillThroughModule.parent = this;
        }
        if (this.options.allowCalculatedField) {
            this.calculatedFieldModule.parent = this;
        }
        this.keyboardModule.parent =
            this.commonActionModule.parent =
                this.commonActionModule.keyboardModule.parent = this;
    };
    SfPivotView.prototype.getChartHeight = function (height) {
        if (this.element.querySelector('.' + PIVOT_CHART) && this.element.querySelector('.' + CHART_GROUPING_BAR_CLASS)) {
            this.element.querySelector('.' + CHART_GROUPING_BAR_CLASS).style.width = this.element.querySelector('.' + PIVOT_CHART).style.width;
            height = this.element.querySelector('.' + CHART_GROUPING_BAR_CLASS).clientHeight;
        }
        var calculatedHeight;
        if (this.options.showToolbar && this.options.showGroupingBar) {
            calculatedHeight = (height - (this.element.querySelector('.e-pivot-toolbar') ? this.element.querySelector('.e-pivot-toolbar').clientHeight : 42) - (this.element.querySelector('.e-chart-grouping-bar') ? this.element.querySelector('.e-chart-grouping-bar').clientHeight : 76)).toString();
        }
        else if (this.options.showToolbar) {
            calculatedHeight = (height - (this.element.querySelector('.e-pivot-toolbar') ? this.element.querySelector('.e-pivot-toolbar').clientHeight : 42)).toString();
        }
        else if (this.options.showGroupingBar) {
            calculatedHeight = (height - (this.element.querySelector('.e-chart-grouping-bar') ? this.element.querySelector('.e-chart-grouping-bar').clientHeight : 76)).toString();
        }
        return calculatedHeight;
    };
    SfPivotView.prototype.contentReady = function () {
        this.updateModuleProperties();
        if (this.options.renderGrid) {
            if (this.options.showGroupingBar && this.groupingBarModule) {
                this.groupingBarModule.updatePivotButtons();
                this.groupingBarModule.refreshUI();
            }
            if ((this.options.allowDrillThrough || this.editSettings.allowEditing) && this.drillThroughModule) {
                this.drillThroughModule.addInternalEvents();
            }
            if (this.options.enableVirtualization && this.virtualScrollModule) {
                this.virtualScrollModule.addInternalEvents();
            }
            if (this.gridSettings.allowSelection && this.selectionModule) {
                this.selectionModule.addInternalEvents();
            }
        }
    };
    SfPivotView.prototype.getSelectedCellDom = function (domElement) {
        if (domElement) {
            return JSON.stringify(window.sfBlazor.getDomObject('currentCell', domElement));
        }
        else {
            return null;
        }
    };
    /* tslint:disable */
    SfPivotView.prototype.selectedCell = function (colIndex, rowIndex, isHeader) {
        if (isHeader) {
            return this.getSelectedCellDom(this.element.querySelector('.' + (colIndex === 0 ? FROZENHEADER_DIV : MOVABLEHEADER_DIV) + ' th[index=' + '\"' + rowIndex + '\"' + '][aria-colindex=' + '\"' + colIndex + '\"' + ']'));
        }
        else {
            return this.getSelectedCellDom(this.element.querySelector('.' + (colIndex === 0 ? FROZENCONTENT_DIV : MOVABLECONTENT_DIV) + ' td[index=' + '\"' + rowIndex + '\"' + '][aria-colindex=' + '\"' + colIndex + '\"' + ']'));
        }
    };
    SfPivotView.prototype.hyperlinkCellclick = function (hyperargs, xpath) {
        if (hyperargs != null) {
            hyperargs.currentCell = window.sfBlazor.getElementByXpath(xpath);
            var url = hyperargs.currentCell.getAttribute('data-url') ? hyperargs.currentCell.getAttribute('data-url') : hyperargs.currentCell.querySelector('a').getAttribute('data-url');
            window.open(url);
        }
    };
    SfPivotView.prototype.createSheet = function (format, id, index) {
        var sheet = this.createStyleSheet();
        sheet.insertRule('.format' + id + index + '{' + format + '}', 0);
    };
    SfPivotView.prototype.getScrollInfo = function (element, scrollPageInfo) {
        this.scrollPageInfo.colFirstLvl = scrollPageInfo.colFirstLvl;
        this.scrollPageInfo.rowFirstLvl = scrollPageInfo.rowFirstLvl;
        this.scrollPageInfo.columnCount = scrollPageInfo.columnCount;
        this.scrollPageInfo.rowCount = scrollPageInfo.rowCount;
        this.scrollPageInfo.colStartPos = scrollPageInfo.colStartPos;
        this.scrollPageInfo.rowStartPos = scrollPageInfo.rowStartPos;
    };
    SfPivotView.prototype.exportDocument = function (element, filename, bytesBase64) {
        if (navigator.msSaveBlob) {
            var data = window.atob(bytesBase64);
            var bytes = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                bytes[i] = data.charCodeAt(i);
            }
            var blob = new Blob([bytes.buffer], {
                type: "application/octet-stream",
            });
            navigator.msSaveBlob(blob, filename);
        }
        else {
            var link = document.createElement("a");
            link.download = filename;
            link.href = "data:application/octet-stream;base64," + bytesBase64;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    SfPivotView.prototype.createStyleSheet = function () {
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        return style.sheet;
    };
    SfPivotView.prototype.getSelectedCells = function () {
        var selectedElements = [].slice.call(this.element.querySelectorAll('.' + CELL_SELECTED_BGCOLOR + ',.' + SELECTED_BGCOLOR));
        var domCollection = [];
        for (var _i = 0, selectedElements_1 = selectedElements; _i < selectedElements_1.length; _i++) {
            var element = selectedElements_1[_i];
            domCollection.push(window.sfBlazor.getDomObject('currentCell', element));
        }
        return JSON.stringify(domCollection);
    };
    SfPivotView.prototype.onContextMenuOpen = function () {
        if (this.options.allowGrouping && this.lastCellClicked) {
            var currentCell = sf.base.closest(this.lastCellClicked, 'td.' + ROWSHEADER + ',th.' + COLUMNSHEADER);
            this.lastCellClicked = undefined;
            if (currentCell && !currentCell.classList.contains(VALUESHEADER)) {
                return JSON.stringify(window.sfBlazor.getDomObject('currentCell', currentCell));
            }
            return null;
        }
        return null;
    };
    SfPivotView.prototype.mouseRclickHandler = function (e) {
        this.lastCellClicked = e.target;
    };
    /* tslint:disable */
    SfPivotView.prototype.mouseClickHandler = function (e) {
        if (this.element.querySelectorAll('.' + BUTTON_FOCUSED).length > 0) {
            sf.base.removeClass(this.element.querySelectorAll('.' + BUTTON_FOCUSED), BUTTON_FOCUSED);
        }
        if (this.element.querySelector('.' + GRID_TOOLBAR) &&
            this.element.querySelector('.' + GRID_TOOLBAR).querySelectorAll('.' + MENU_ITEM_CLASS + '.' + FOCUSED_CLASS).length > 0) {
            sf.base.removeClass(this.element.querySelector('.' + GRID_TOOLBAR).querySelectorAll('.' + MENU_ITEM_CLASS + '.' + FOCUSED_CLASS), FOCUSED_CLASS);
        }
        var target = e.target;
        if (this.enableValueSorting && this.options.dataType === 'pivot' && (target.classList.contains(SORT_FILTER_DIV) || target.classList.contains(STACKED_HEADER_TEXT) ||
            target.classList.contains(STACKED_HEADER_CELL_DIV) || target.classList.contains(HEADER_TEXT) || target.classList.contains(STACKED_HEADER_CELL_DIV) ||
            target.classList.contains(HEADER_CELL_DIV) || target.classList.contains(HEADERCELL) || target.classList.contains(CELLVALUE) ||
            target.classList.contains(COLUMNSHEADER) || target.classList.contains(ROWSHEADER))) {
            var element = sf.base.closest(target, 'td.' + ROWSHEADER + ',th.' + COLUMNSHEADER);
            if (element && ((sf.base.closest(element, '.' + MOVABLEHEADER_DIV) && this.dataSourceSettings.valueAxis === 'column') ||
                (sf.base.closest(element, 'tr.' + ROW) && this.dataSourceSettings.valueAxis === 'row') &&
                    (element.classList.contains(ROWSHEADER) || element.classList.contains(SUBTOTAL)))) {
                if (this.enableValueSorting) {
                    var colIndex = Number(element.getAttribute('aria-colindex'));
                    var rowIndex = Number(element.getAttribute('index'));
                    if (this.dataSourceSettings.valueAxis === 'column' && (this.dataSourceSettings.values.length > 1 || this.dataSourceSettings.alwaysShowValueHeader)) {
                        colIndex = (Number(element.getAttribute('aria-colindex')) + Number(element.getAttribute('aria-colspan')) - 1);
                    }
                    this.dotNetRef.invokeMethodAsync('MouseClickHandler', rowIndex, colIndex);
                }
                e.preventDefault();
            }
        }
        else if (!this.gridSettings.allowSelection) {
            var element = sf.base.closest(target, 'td.' + ROWSHEADER + ',th.' + COLUMNSHEADER + ',td.' + ROW_CELL_CLASS);
            if (element !== null) {
                var colIndex = Number(element.getAttribute('aria-colindex'));
                var rowIndex = Number(element.getAttribute('index'));
                if (!(target.classList.contains('e-expand') || target.classList.contains('e-collapse')))
                    this.dotNetRef.invokeMethodAsync('CellClickedHandler', rowIndex, colIndex, e, JSON.stringify(window.sfBlazor.getDomObject('cellElement', element)));
            }
        }
    };
    /* tslint:enable */
    SfPivotView.prototype.getHeightAsNumber = function () {
        var height;
        if (isNaN(this.options.height)) {
            if (this.options.height.toString().indexOf('%') > -1) {
                height = (parseFloat(this.options.height.toString()) / 100) * this.element.offsetHeight;
            }
            else if (this.options.height.toString().indexOf('px') > -1) {
                height = Number(this.options.height.toString().split('px')[0]);
            }
            else if (this.options.height === 'auto') {
                height = this.element.offsetHeight;
            }
        }
        else {
            height = Number(this.options.height);
        }
        if (height < 300) {
            height = 300;
        }
        return height;
    };
    SfPivotView.prototype.calculateGridHeight = function (elementCreated, rowCount, columnCount) {
        var gridHeight = this.options.height;
        var parHeight = this.getHeightAsNumber();
        var tableHeight = (rowCount * this.gridSettings.rowHeight);
        if (isNaN(parHeight)) {
            parHeight = parHeight > 300 ? parHeight : 300;
        }
        if (this.gridSettings.height === 'auto' && parHeight && this.element.querySelector('.' + GRID_HEADER)) {
            var colHeaderHeight = (columnCount * this.gridSettings.rowHeight) + (this.element.querySelector('.' + GRID_HEADER).offsetHeight - this.element.querySelector('.' + HEADERCONTENT).offsetHeight);
            var gBarHeight = colHeaderHeight + (this.element.querySelector('.' + GROUPING_BAR_CLASS) ?
                this.element.querySelector('.' + GROUPING_BAR_CLASS).offsetHeight : 0);
            var toolBarHeight = this.element.querySelector('.' + GRID_TOOLBAR) ? this.element.querySelector('.' + GRID_TOOLBAR).clientHeight : 0;
            gridHeight = parHeight - (gBarHeight + toolBarHeight) - 1;
            if (elementCreated) {
                var contentHeight = this.internalGrid && this.internalGrid.options && !isNaN(this.internalGrid.options.height) ?
                    Number(this.internalGrid.options.height) : this.element.querySelector('.' + MOVABLECONTENT_DIV).offsetHeight;
                var tableWidth = this.element.querySelector('.' + MOVABLECONTENT_DIV + ' .' + TABLE).offsetWidth;
                var contentWidth = this.element.querySelector('.' + MOVABLECONTENT_DIV).offsetWidth;
                var horizontalOverflow = contentWidth < tableWidth;
                var verticalOverflow = contentHeight < tableHeight;
                var commonOverflow = horizontalOverflow && ((gridHeight - tableHeight) < 18) ? true : false;
                if (gridHeight >= tableHeight && (horizontalOverflow ? gridHeight >= contentHeight : true) &&
                    !verticalOverflow && !commonOverflow) {
                    return JSON.stringify('auto');
                }
            }
            else {
                if (gridHeight > (rowCount * this.gridSettings.rowHeight)) {
                    return JSON.stringify('auto');
                }
            }
        }
        else {
            gridHeight = this.gridSettings.height;
        }
        return gridHeight < this.gridSettings.rowHeight ? this.gridSettings.rowHeight.toString() : tableHeight < gridHeight ? tableHeight.toString() : gridHeight.toString();
    };
    SfPivotView.prototype.updateGridUI = function (element) {
        if (this.options.showGroupingBar && this.groupingBarModule) {
            this.groupingBarModule.refreshUI();
        }
        else {
            var emptyRowHeader = element.querySelector('.' + FROZENHEADER_DIV).querySelector('.' + COLUMN_HEADER);
            if (emptyRowHeader && emptyRowHeader.querySelector('.' + RESIZE_HANDLER)) {
                emptyRowHeader.style.height = emptyRowHeader.querySelector('.' + RESIZE_HANDLER).style.height = 'auto';
                emptyRowHeader.style.height = emptyRowHeader.querySelector('.' + RESIZE_HANDLER).style.height = element.querySelector('.' + HEADERCONTENT).offsetHeight + 'px';
            }
        }
        if (element.querySelector('.' + MOVABLEHEADER_DIV + ' .' + TABLE) && element.querySelector('.' + MOVABLEHEADER_DIV + ' .' + TABLE).style.width == "0px") {
            element.querySelector('.' + MOVABLECONTENT_DIV + ' .' + TABLE).style.width = element.querySelector('.' + MOVABLEHEADER_DIV + ' .' + TABLE).style.width = "";
        }
        if (element.querySelector('.' + MOVABLEHEADER_DIV + ' .' + TABLE + ' th.e-firstcell.e-lastcell') && element.querySelector('.' + MOVABLEHEADER_DIV + ' .' + TABLE + ' th.e-firstcell.e-lastcell').offsetWidth <= 0) {
            var headerColGroupElements = element.querySelector('.' + MOVABLEHEADER_DIV + ' .' + TABLE + ' colgroup').children;
            var contentColGroupElements = element.querySelector('.' + MOVABLECONTENT_DIV + ' .' + TABLE + ' colgroup').children;
            var columnWidth = sf.base.formatUnit(this.options.gridSettings.columnWidth);
            if (headerColGroupElements.length > 1 && headerColGroupElements[headerColGroupElements.length - 1].style.width == 'auto')
                headerColGroupElements[headerColGroupElements.length - 1].style.width = columnWidth;
            if (contentColGroupElements.length > 1 && contentColGroupElements[contentColGroupElements.length - 1].style.width == 'auto')
                contentColGroupElements[contentColGroupElements.length - 1].style.width = columnWidth;
        }
        this.element.querySelector('.' + MOVABLECONTENT_DIV).style.overflow = 'auto';
        var hasVerticalScrollbar = element.querySelector('.' + MOVABLECONTENT_DIV).scrollHeight > element.querySelector('.' + MOVABLECONTENT_DIV).clientHeight;
        sf.base.setStyleAttribute(element.querySelector('.' + GRID_HEADER), this.options.enableRtl ? {
            'paddingLeft': hasVerticalScrollbar ? '16px' : ''
        } : {
            'paddingRight': hasVerticalScrollbar ? '16px' : ''
        });
        sf.base.setStyleAttribute(element.querySelector('.' + HEADERCONTENT), this.options.enableRtl ? {
            'borderLeftWidth': hasVerticalScrollbar ? '1px' : ''
        } : {
            'borderRightWidth': hasVerticalScrollbar ? '1px' : ''
        });
        element.querySelector('.' + FROZENCONTENT_DIV).style.height = sf.base.formatUnit(element.querySelector('.' + MOVABLECONTENT_DIV).clientHeight);
    };
    
    SfPivotView.prototype.updateView = function (element, displayOption) {
        if (element) {
            this.displayOptions = JSON.parse(displayOption);
            if (this.displayOptions.view == 'Both' && this.displayOptions.primary == 'Table') {
                this.element.querySelector('.' + PIVOT_CHART).style.display = 'none';
                this.element.querySelector('#' + this.element.id + '_grid').style.display = '';
                if (this.options.showGroupingBar) {
                    if (this.element.querySelector('.' + PIVOT_CHART) && this.element.querySelector('.' + CHART_GROUPING_BAR_CLASS)) {
                        this.element.querySelector('.' + CHART_GROUPING_BAR_CLASS).style.display = 'none';
                        this.element.querySelector('.' + GRID_GROUPING_BAR_CLASS).style.display = '';
                    }
                }
            }
            else if (this.displayOptions.view == 'Both' && this.displayOptions.primary == 'Chart') {
                this.element.querySelector('.' + PIVOT_CHART).style.display = '';
                this.element.querySelector('#' + this.element.id + '_grid').style.display = 'none';
                if (this.options.showGroupingBar) {
                    if (this.element.querySelector('.' + GRID_GROUPING_BAR_CLASS)) {
                        this.element.querySelector('.' + GRID_GROUPING_BAR_CLASS).style.display = 'none';
                        this.element.querySelector('.' + CHART_GROUPING_BAR_CLASS).style.display = '';
                    }
                }
            }
        }
    };
    SfPivotView.prototype.updateGridSettings = function (element, gridSetting) {
        if (element && gridSetting !== null) {
            this.gridSettings = JSON.parse(gridSetting);
        }
    };
    SfPivotView.prototype.getClientWidth = function (element, id) {
        if (element && id !== null) {
            return document.getElementById(id).clientWidth;
        }
        return null;
    };
    SfPivotView.prototype.getTableCellNode = function (element, top, left) {
        if (element) {
            return document.elementFromPoint(left, top).getAttribute('cell');
        }
        return null;
    };
    
    SfPivotView.prototype.updateColorPickerUI = function (dialogElemnt) {
        if (dialogElemnt) {
            var fontColorPicker = [].slice.call(dialogElemnt.querySelectorAll('.' + COLOR_PICKER_CONTAINER + '.' + FORMAT_FONT_COLOR_PICKER_CONTAINER));
            var backColorPicker = [].slice.call(dialogElemnt.querySelectorAll('.' + COLOR_PICKER_CONTAINER + '.' + FORMAT_BACK_COLOR_PICKER_CONTAINER));
            for (var _i = 0, fontColorPicker_1 = fontColorPicker; _i < fontColorPicker_1.length; _i++) {
                var element = fontColorPicker_1[_i];
                sf.base.addClass([element], [FORMAT_COLOR_PICKER, FORMAT_FONT_COLOR_PICKER]);
                sf.base.addClass([element.querySelector('.' + COLOR_PICKER)], FORMAT_FONT_COLOR);
                sf.base.addClass([element.querySelector('.' + SELECTED_COLOR)], ICON);
            }
            for (var _a = 0, backColorPicker_1 = backColorPicker; _a < backColorPicker_1.length; _a++) {
                var element = backColorPicker_1[_a];
                sf.base.addClass([element], FORMAT_COLOR_PICKER);
                sf.base.addClass([element.querySelector('.' + COLOR_PICKER)], FORMAT_BACK_COLOR);
                sf.base.addClass([element.querySelector('.' + SELECTED_COLOR)], ICON);
            }
        }
    };
    
    SfPivotView.prototype.onWindowResize = function () {
        var _this = this;
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(function () {
            _this.commonActionModule.getElementInfo();
            _this.dotNetRef.invokeMethodAsync('LayoutRefresh');
        }, 500);
    };
    
    SfPivotView.prototype.wireEvents = function () {
        sf.base.EventHandler.add(document, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler, this);
        sf.base.EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'contextmenu', this.mouseRclickHandler, this);
        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.onWindowResize, true);
    };
    SfPivotView.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(document, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler);
        sf.base.EventHandler.remove(this.element, this.isAdaptive ? 'touchend' : 'contextmenu', this.mouseRclickHandler);
        window.removeEventListener('resize', this.onWindowResize, true);
    };
    SfPivotView.prototype.destroy = function () {
        this.unWireEvents();
        this.keyboardModule.destroy();
        this.commonActionModule.destroy();
        if (this.options.showGroupingBar) {
            this.groupingBarModule.destroy();
            this.pivotButtonModule.destroy();
        }
        if (this.options.showFieldList && this.pivotFieldListModule) {
            this.pivotFieldListModule.destroy();
        }
        if (this.options.allowDrillThrough || this.editSettings.allowEditing) {
            this.drillThroughModule.destroy();
        }
        if (this.options.enableVirtualization || this.virtualScrollModule) {
            this.virtualScrollModule.destroy();
        }
        if (this.gridSettings.allowSelection || this.selectionModule) {
            this.selectionModule.destroy();
        }
    };
    return SfPivotView;
}());

/**
 * Module for field list tree actions.
 */
var TreeRenderer = /** @class */ (function () {
    function TreeRenderer(parent) {
        this.parent = parent;
        this.parent.treeRendererModule = this;
    }
    TreeRenderer.prototype.updateFieldListIcons = function (id, treeData, dragText) {
        var treeElement = document.getElementById(id);
        var liElement = [].slice.call(treeElement.querySelectorAll('ul li'));
        for (var i = 0; i < liElement.length; i++) {
            for (var j = 0; j < treeData.length; j++) {
                if (treeData[j].id === liElement[i].getAttribute('data-uid')) {
                    this.updateTreeNode(liElement[i], treeData[j], dragText);
                    break;
                }
            }
        }
    };
    TreeRenderer.prototype.updateTreeNode = function (node, nodeData, dragText) {
        var allowDrag = false;
        if (this.parent.options.dataType === 'olap') {
            allowDrag = this.updateOlapTreeNode(node);
        }
        else {
            allowDrag = true;
        }
        var liTextElement = node.querySelector('.' + TEXT_CONTENT_CLASS);
        if (node.querySelector('.' + LIST_ICON) && liTextElement) {
            var liIconElement = node.querySelector('.' + LIST_ICON);
            liTextElement.insertBefore(liIconElement, node.querySelector('.' + LIST_TEXT_CLASS));
        }
        if (allowDrag && !this.parent.isAdaptive) {
            var field = this.parent.commonActionModule.getFieldInfo(nodeData.id);
            allowDrag = false;
            var dragElement = sf.base.createElement('span', {
                attrs: {
                    'tabindex': '-1',
                    'aria-disabled': 'false'
                }
            });
            dragElement.appendChild(sf.base.createElement('span', {
                attrs: {
                    'tabindex': '-1',
                    title: field.fieldItem ? field.fieldItem.allowDragAndDrop ? dragText : '' : dragText,
                    'aria-disabled': 'false'
                },
                className: ICON + ' ' + DRAG_CLASS + ' ' + (field.fieldItem ?
                    field.fieldItem.allowDragAndDrop ? '' : DRAG_DISABLE_CLASS : '')
            }));
            if (node.querySelector('.' + CHECKBOX_CONTAINER) && !node.querySelector('.' + DRAG_CLASS) && liTextElement) {
                liTextElement.insertBefore(dragElement, node.querySelector('.' + CHECKBOX_CONTAINER));
            }
            this.parent.pivotButtonModule.createDraggable(true, dragElement, field.fieldItem);
        }
        if (node.querySelector('.' + NODE_CHECK_CLASS)) {
            sf.base.addClass([node.querySelector('.' + LIST_TEXT_CLASS)], LIST_SELECT_CLASS);
        }
    };
    TreeRenderer.prototype.updateOlapTreeNode = function (node) {
        if (this.parent.options.dataType === 'olap' && node) {
            var textNode = node.querySelector('.' + TEXT_CONTENT_CLASS);
            if (textNode.querySelector('.' + CALC_MEMBER_GROUP_TYPE_ICON + ',.' + MEASURE_GROUP_TYPE_ICON + ',.' +
                FOLDER_TYPE_ICON + ',.' + FOLDER_TYPE_OPEN_ICON + ',.' + DIMENSION_TYPE_ICON + ',.' + KPI_ICON)) {
                textNode.querySelector('.' + CHECKBOX_CONTAINER).style.display = 'none';
            }
            /* tslint:disable-next-line:max-line-length */
            if (textNode.querySelector('.' + LIST_ICON) && textNode.querySelector('.' + LIST_ICON).className.indexOf(LEVEL_MEMBERS) > -1) {
                this.parent.isAdaptive ? textNode.querySelector('.' + CHECKBOX_CONTAINER).style.display = 'none' : textNode.querySelector('.' + CHECKBOX_CONTAINER).style.visibility = 'hidden';
            }
            if (textNode.querySelector('.' + HIERARCHY_TYPE_ICON + ',.' + ATTRIBUTE_TYPE_ICON + ',.' + NAMEDSET_TYPE_ICON) ||
                /* tslint:disable-next-line:max-line-length */
                textNode.querySelector('.' + MEASURE_ICON + ',.' + KPI_GOAL_ICON + ',.' + KPI_STATUS_ICON + ',.' + KPI_TREND_ICON + ',.' + KPI_VALUE_ICON) ||
                textNode.querySelector('.' + CALC_MEASURE_ICON + ',.' + CALC_DIMENSION_ICON)) {
                if (textNode.querySelector('.' + MEASURE_ICON)) {
                    textNode.querySelector('.' + LIST_ICON).style.display = 'none';
                    return true;
                }
                else {
                    return true;
                }
            }
        }
        else {
            return true;
        }
        return false;
    };
    return TreeRenderer;
}());

/**
 * SfPivotFieldList client constructor
 */
var SfPivotFieldList = /** @class */ (function () {
    function SfPivotFieldList(element, options, dotnetRef) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.getOptions(element, options);
        this.dotNetRef = dotnetRef;
    }
    SfPivotFieldList.prototype.getOptions = function (element, options) {
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.parentElement = document.getElementById(element.id + '_Dialog_Container');
        this.isAdaptive = sf.base.Browser.isDevice;
        /* tslint:disable */
        this.pivotGridModule = options.pivotGridModule && options.pivotGridModule.blazor__instance ?
            options.pivotGridModule.blazor__instance : options.pivotGridModule;
        /* tslint:enable */
        this.fieldList = options.fieldList;
        this.dataSourceSettings = options.dataSourceSettings;
        if (this.parentElement && this.parentElement.querySelector('#' + this.parentElement.id + '_title')) {
            sf.base.setStyleAttribute(this.parentElement.querySelector('#' + this.parentElement.id + '_title'), { 'width': '100%' });
        }
    };
    SfPivotFieldList.prototype.initModules = function () {
        this.treeRendererModule = new TreeRenderer(this);
        this.commonActionModule = new ActionBase(this);
        this.pivotButtonModule = new PivotButton(this);
        if (this.options.allowCalculatedField) {
            this.calculatedFieldModule = new CalculatedField(this);
        }
        this.unWireEvents();
        this.wireEvents();
    };
    SfPivotFieldList.prototype.contentReady = function () {
        this.initModules();
        if (this.parentElement && this.parentElement.querySelector('#' + this.parentElement.id + '_title')) {
            sf.base.setStyleAttribute(this.parentElement.querySelector('#' + this.parentElement.id + '_title'), { 'width': '100%' });
        }
    };
    SfPivotFieldList.prototype.onShowFieldList = function (element, dialogElement) {
        if (element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)) {
            sf.base.addClass([element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], ICON_HIDDEN);
        }
        dialogElement.style.top = parseInt(dialogElement.style.top, 10) < 0 ? '0px' : dialogElement.style.top;
    };
    SfPivotFieldList.prototype.removeFieldListIcon = function (element) {
        if (!document.getElementById(element.id + 'calculateddialog') && element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)) {
            sf.base.removeClass([element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], ICON_HIDDEN);
        }
    };
    SfPivotFieldList.prototype.updateFieldList = function (containerElement) {
        var footer = containerElement.querySelector('.' + FOOTER_CONTENT_CLASS);
        if (containerElement.querySelector('#' + containerElement.id + '_dialog-content')) {
            sf.base.setStyleAttribute(containerElement.querySelector('#' + containerElement.id + '_dialog-content'), {
                'padding': '0'
            });
            sf.base.addClass([footer], FIELD_LIST_FOOTER_CLASS);
        }
        else {
            containerElement.querySelector('.' + ADAPTIVE_CONTAINER_CLASS).appendChild(footer);
        }
    };
    SfPivotFieldList.prototype.updateSelectedNodes = function (node, state) {
        node = sf.base.closest(node, '.' + TEXT_CONTENT_CLASS);
        if (state === 'check') {
            sf.base.addClass([node.querySelector('.' + LIST_TEXT_CLASS)], LIST_SELECT_CLASS);
        }
        else {
            sf.base.removeClass([node.querySelector('.' + LIST_TEXT_CLASS)], LIST_SELECT_CLASS);
        }
        var li = sf.base.closest(node, 'li');
        if (li && li.querySelector('ul')) {
            for (var _i = 0, _a = [].slice.call(li.querySelectorAll('li')); _i < _a.length; _i++) {
                var element = _a[_i];
                if (state === 'check') {
                    sf.base.addClass([element.querySelector('.' + LIST_TEXT_CLASS)], LIST_SELECT_CLASS);
                }
                else {
                    sf.base.removeClass([element.querySelector('.' + LIST_TEXT_CLASS)], LIST_SELECT_CLASS);
                }
            }
        }
    };
    SfPivotFieldList.prototype.removeFocusedElements = function () {
        if (this.element.querySelectorAll('.' + BUTTON_FOCUSED).length > 0) {
            sf.base.removeClass(this.element.querySelectorAll('.' + BUTTON_FOCUSED), BUTTON_FOCUSED);
        }
    };
    SfPivotFieldList.prototype.wireEvents = function () {
        sf.base.EventHandler.add(document, 'click', this.removeFocusedElements, this);
    };
    SfPivotFieldList.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(document, 'click', this.removeFocusedElements);
    };
    SfPivotFieldList.prototype.destroy = function () {
        this.unWireEvents();
        this.commonActionModule.destroy();
        this.pivotButtonModule.destroy();
        if (this.pivotGridModule) {
            this.pivotGridModule.destroy();
        }
    };
    return SfPivotFieldList;
}());

/**
 * Blazor pivot components interop handler
 */
// tslint:disable
var PivotView = {
    initialize: function (element, options, dotnetRef) {
        sf.base.enableBlazorMode();
        new SfPivotView(element, options, dotnetRef);
    },
    initializeFieldList: function (element, options, dotnetRef) {
        sf.base.enableBlazorMode();
        new SfPivotFieldList(element, options, dotnetRef);
    },
    contentReady: function (element, options) {
        if (element && element.blazor__instance) {
            element.blazor__instance.options = options;
            element.blazor__instance.getOptions(element, options);
            element.blazor__instance.contentReady();
        }
    },
    getChartHeight: function (element, height) {
        if (element && element.blazor__instance) {
            element.blazor__instance.getChartHeight(height);
        }
    },
    onShowFieldList: function (element, dialogElement) {
        if (element && element.blazor__instance) {
            element.blazor__instance.onShowFieldList(element, dialogElement);
        }
    },
    removeFieldListIcon: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.removeFieldListIcon(element);
        }
    },
    updateFieldListIcons: function (element, id, treeData, dragText) {
        if (element && element.blazor__instance) {
            element.blazor__instance.treeRendererModule.updateFieldListIcons(id, treeData, dragText);
        }
    },
    setPivotButtonDraggable: function (element, options) {
        if (element && element.blazor__instance && element.blazor__instance.pivotButtonModule) {
            element.blazor__instance.options = options;
            element.blazor__instance.getOptions(element, options);
            element.blazor__instance.pivotButtonModule.createPivotButtonDrop();
            element.blazor__instance.pivotButtonModule.setPivotButtonDrag();
        }
    },
    isFullRowElement: function (element, top, left) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.commonActionModule.isFullRowElement(top, left);
        }
        return JSON.stringify(false);
    },
    getTreeNode: function (element, treeElement, top, left) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.commonActionModule.getTreeNode(treeElement, top, left);
        }
        return null;
    },
    updateActiveNode: function (element, treeElement, id) {
        if (element && element.blazor__instance) {
            element.blazor__instance.commonActionModule.updateActiveNode(treeElement, id);
        }
    },
    updateSelectedNodes: function (element, node, checkState) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateSelectedNodes(window.sfBlazor.getElementByXpath(node), checkState);
        }
    },
    updateFieldList: function (element, containerElement) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateFieldList(containerElement);
        }
    },
    renderToolbar: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.toolbarModule.renderToolbar();
        }
    },
    focusToolBar: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.toolbarModule.focusToolBar();
        }
    },
    getButtonPosition: function (element, target, droppedClass) {
        if (element && element.blazor__instance) {
            return JSON.stringify(element.blazor__instance.pivotButtonModule.getButtonPosition(window.sfBlazor.getElementByXpath(target), droppedClass));
        }
        return null;
    },
    getButtonLocation: function (element) {
        var position = element.querySelector('.' + AXISFIELD_ICON_CLASS).getBoundingClientRect();
        return JSON.stringify([position.top + (window.scrollY || document.documentElement.scrollTop), position.left]);
    },
    selectInputRange: function (element, dialogElement) {
        if (element && element.blazor__instance) {
            element.blazor__instance.toolbarModule.selectInputRange(dialogElement);
        }
    },
    focusOnElement: function (element) {
        element.focus();
    },
    copyMdxQuery: function (element, dialogElement) {
        if (element && element.blazor__instance) {
            element.blazor__instance.toolbarModule.copyMdxQuery(dialogElement);
        }
    },
    validateInputs: function (element, filterInfo) {
        if (element && element.blazor__instance) {
            element.blazor__instance.commonActionModule.validateInputs(filterInfo);
        }
    },
    selectedCell: function (element, colIndex, rowIndex, isHeader) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.selectedCell(colIndex, rowIndex, isHeader);
        }
        return undefined;
    },
    hyperlinkCellclick: function (element, args, XPath) {
        if (element && element.blazor__instance) {
            element.blazor__instance.hyperlinkCellclick(JSON.parse(args), JSON.parse(XPath));
        }
    },
    updateEditOptions: function (element, accordId) {
        if (element && element.blazor__instance) {
            element.blazor__instance.calculatedFieldModule.updateEditOptions(accordId);
        }
    },
    accordionClick: function (element, clientX, clientY, id) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculatedFieldModule.accordionClick(clientX, clientY, id);
        }
        return undefined;
    },
    getAccordionValue: function (element) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculatedFieldModule.getAccordionValue();
        }
        return undefined;
    },
    updateAccordionLabel: function (element, target) {
        if (element && element.blazor__instance) {
            element.blazor__instance.calculatedFieldModule.updateAccordionLabel(target);
        }
    },
    getNodeLocation: function (element, treeElement, id) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculatedFieldModule.getNodeLocation(treeElement, id);
        }
        return undefined;
    },
    getIconInfo: function (element, top, left) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculatedFieldModule.getIconInfo(top, left);
        }
        return undefined;
    },
    emptyFieldName: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.calculatedFieldModule.emptyFieldName(element.id);
        }
    },
    updateCalculatedFields: function (element, isEdit, top, left, title) {
        if (element && element.blazor__instance) {
            element.blazor__instance.calculatedFieldModule.editCalculatedFieldInfo(isEdit, top, left, title);
        }
    },
    updateCalculatedFieldExpandIcons: function (element, treeElement, id) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculatedFieldModule.updateNodeExpandIcons(treeElement, id);
        }
        return JSON.stringify(false);
    },
    createFormulaDroppable: function (element, edit, drag, remove$$1, edited, isEdit, fieldName, id) {
        if (element && element.blazor__instance) {
            element.blazor__instance.calculatedFieldModule.createFormulaDroppable(edit, drag, remove$$1, edited, isEdit, fieldName, id);
        }
    },
    createSheet: function (element, format, id, index) {
        if (element && element.blazor__instance) {
            element.blazor__instance.createSheet(format, id, index);
        }
    },
    updateScrollInfo: function (element, columnCount, rowCount) {
        if (element && element.blazor__instance) {
            element.blazor__instance.virtualScrollModule.updateScrollInfo(element, columnCount, rowCount);
        }
    },
    getScrollInfo: function (element, scrollPageInfo) {
        if (element && element.blazor__instance) {
            element.blazor__instance.getScrollInfo(element, scrollPageInfo);
        }
    },
    exportDocument: function (element, filename, bytesBase64) {
        if (element && element.blazor__instance) {
            element.blazor__instance.exportDocument(element, filename, bytesBase64);
        }
    },
    calculateGridHeight: function (element, elementCreated, rowCount, columnCount) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculateGridHeight(elementCreated, rowCount, columnCount);
        }
        return null;
    },
    onContextMenuOpen: function (element) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.onContextMenuOpen();
        }
        return null;
    },
    getSelectedCells: function (element) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.getSelectedCells();
        }
        return null;
    },
    updateGridUI: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateGridUI(element);
        }
    },
    updateView: function (element, displayOption) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateView(element, displayOption);
        }
    },
    updateGridSettings: function (element, gridSetting) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateGridSettings(element, gridSetting);
        }
    },
    getClientWidth: function (element, id) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.getClientWidth(element, id);
        }
        return null;
    },
    getTableCellNode: function (element, top, left) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.getTableCellNode(element, top, left);
        }
        return null;
    },
    updateColorPickerUI: function (element, dialogElement) {
        if (element && element.blazor__instance) {
            return element.blazor__instance.updateColorPickerUI(dialogElement);
        }
    },
    destroy: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.destroy();
        }
    }
};

return PivotView;

}());
