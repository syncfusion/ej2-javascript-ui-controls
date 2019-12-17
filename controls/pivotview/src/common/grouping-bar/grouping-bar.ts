import { createElement, remove, Droppable, setStyleAttribute, removeClass } from '@syncfusion/ej2-base';
import { EventHandler, Touch, TapEventArgs, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { addClass, formatUnit } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { Common } from '../actions/common';
import { IAction } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { AxisFields } from './axis-field-renderer';
import { OffsetPosition } from '@syncfusion/ej2-popups';
import { Column, ColumnModel } from '@syncfusion/ej2-grids';
PivotView.Inject(Common);

/**
 * Module for GroupingBar rendering
 */
/** @hidden */
export class GroupingBar implements IAction {
    /**
     * Internal variables
     */
    private groupingTable: HTMLElement;
    private groupingChartTable: HTMLElement;
    private leftAxisPanel: HTMLElement;
    private rightAxisPanel: HTMLElement;
    private filterPanel: HTMLElement;
    private rowPanel: HTMLElement;
    private columnPanel: HTMLElement;
    private valuePanel: HTMLElement;
    private rowAxisPanel: HTMLElement;
    private columnAxisPanel: HTMLElement;
    private valueAxisPanel: HTMLElement;
    private filterAxisPanel: HTMLElement;
    private touchObj: Touch;
    private resColWidth: number;
    /* tslint:disable-next-line:no-any */
    private timeOutObj: any;

    /**
     * Module declarations
     */
    private parent: PivotView;
    private handlers: {
        load: Function,
        end: Function
    };

    /** Constructor for GroupingBar module */
    constructor(parent: PivotView) {
        this.parent = parent;
        this.parent.groupingBarModule = this;
        this.resColWidth = (this.parent.isAdaptive ? 180 : 249);
        this.addEventListener();
        this.parent.axisFieldModule = new AxisFields(this.parent);
        this.touchObj = new Touch(this.parent.element, {
            tapHold: this.tapHoldHandler.bind(this)
        });
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'groupingbar';
    }

    private renderLayout(): void {
        this.groupingTable = createElement('div', { className: cls.GROUPING_BAR_CLASS });
        this.leftAxisPanel = createElement('div', { className: cls.LEFT_AXIS_PANEL_CLASS });
        this.rightAxisPanel = createElement('div', { className: cls.RIGHT_AXIS_PANEL_CLASS });
        let rowAxisPanel: HTMLElement = createElement('div', { className: cls.AXIS_ROW_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'wrapper' });
        let columnAxisPanel: HTMLElement = createElement('div', {
            className: cls.AXIS_COLUMN_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'wrapper'
        });
        let valueAxisPanel: HTMLElement = createElement('div', {
            className: cls.AXIS_VALUE_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'wrapper'
        });
        let filterAxisPanel: HTMLElement = createElement('div', {
            className: cls.AXIS_FILTER_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'wrapper'
        });
        this.rowPanel = createElement('div', { className: cls.GROUP_ROW_CLASS + ' ' + cls.ROW_AXIS_CLASS });
        this.columnPanel = createElement('div', { className: cls.GROUP_COLUMN_CLASS + ' ' + cls.COLUMN_AXIS_CLASS });
        this.valuePanel = createElement('div', { className: cls.GROUP_VALUE_CLASS + ' ' + cls.VALUE_AXIS_CLASS });
        this.filterPanel = createElement('div', { className: cls.GROUP_FILTER_CLASS + ' ' + cls.FILTER_AXIS_CLASS });
        rowAxisPanel.appendChild(this.rowPanel);
        columnAxisPanel.appendChild(this.columnPanel);
        valueAxisPanel.appendChild(this.valuePanel);
        filterAxisPanel.appendChild(this.filterPanel);
        this.rowAxisPanel = rowAxisPanel;
        this.columnAxisPanel = columnAxisPanel;
        this.valueAxisPanel = valueAxisPanel;
        this.filterAxisPanel = filterAxisPanel;
        this.leftAxisPanel.appendChild(valueAxisPanel);
        this.leftAxisPanel.appendChild(rowAxisPanel);
        this.rightAxisPanel.appendChild(filterAxisPanel);
        this.rightAxisPanel.appendChild(columnAxisPanel);
        this.groupingTable.appendChild(this.leftAxisPanel);
        this.groupingTable.appendChild(this.rightAxisPanel);
        this.groupingTable.classList.add(cls.GRID_GROUPING_BAR_CLASS);
        let axisPanels: HTMLElement[] = [this.rowPanel, this.columnPanel, this.valuePanel, this.filterPanel];

        for (let element of axisPanels) {
            if (this.parent.groupingBarSettings.allowDragAndDrop) {
                new Droppable(element, {});
            }
            this.unWireEvent(element);
            this.wireEvent(element);
        }
        if (this.parent.displayOption.view !== 'Table' && this.parent.groupingBarSettings.displayMode !== 'Table') {
            this.groupingChartTable = this.groupingTable.cloneNode(true) as HTMLElement;
            this.groupingChartTable.classList.add(cls.CHART_GROUPING_BAR_CLASS);
            this.groupingChartTable.classList.remove(cls.GRID_GROUPING_BAR_CLASS);
            this.groupingChartTable.querySelector('.' + cls.GROUP_ROW_CLASS).classList.add(cls.GROUP_CHART_ROW);
            this.groupingChartTable.querySelector('.' + cls.GROUP_COLUMN_CLASS).classList.add(cls.GROUP_CHART_COLUMN);
            if (this.parent.chartSettings.enableMultiAxis) {
                this.groupingChartTable.querySelector('.' + cls.GROUP_VALUE_CLASS).classList.add(cls.GROUP_CHART_MULTI_VALUE);
            } else {
                this.groupingChartTable.querySelector('.' + cls.GROUP_VALUE_CLASS).classList.add(cls.GROUP_CHART_VALUE);
                this.groupingChartTable.querySelector('.' + cls.GROUP_VALUE_CLASS).classList.remove(cls.DROPPABLE_CLASS);
            }
            this.groupingChartTable.querySelector('.' + cls.GROUP_FILTER_CLASS).classList.add(cls.GROUP_CHART_FILTER);
        } else {
            this.groupingChartTable = undefined;
        }
        if (this.parent.displayOption.view === 'Chart' || this.parent.groupingBarSettings.displayMode === 'Chart') {
            this.groupingTable = undefined;
        }
    }
    /* tslint:disable:max-func-body-length */
    private appendToElement(): void {
        if (this.parent.element.querySelector('.' + cls.GRID_CLASS) || this.parent.element.querySelector('.' + cls.PIVOTCHART)) {
            if (this.parent.showGroupingBar) {
                if (this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                    /* tslint:disable:no-any */
                    for (let element of this.parent.element.querySelectorAll('.' + cls.GROUPING_BAR_CLASS) as any) {
                        remove(element);
                    }
                }
                if (this.groupingChartTable) {
                    if (this.parent.element.querySelector('#' + this.parent.element.id + '_chart')) {
                        setStyleAttribute(this.groupingChartTable, {
                            width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
                        });
                        this.parent.element.insertBefore(
                            this.groupingChartTable, this.parent.element.querySelector('#' + this.parent.element.id + '_chart'));
                    } else {
                        this.groupingChartTable = undefined;
                    }
                }
                if (this.parent.displayOption.view !== 'Chart' && this.groupingTable) {
                    if (this.parent.isAdaptive) {
                        this.leftAxisPanel.style.minWidth = '180px';
                        this.valuePanel.style.minWidth = '180px';
                    }
                    if (this.parent.firstColWidth) {
                        this.leftAxisPanel.style.minWidth = 'auto';
                        this.valuePanel.style.minWidth = 'auto';
                    }
                    this.filterPanel.removeAttribute('style');
                    this.columnPanel.removeAttribute('style');
                    this.rowPanel.removeAttribute('style');
                    this.filterPanel.removeAttribute('style');
                    let emptyRowCount: number;
                    if (this.parent.dataType === 'olap') {
                        emptyRowCount = Object.keys(this.parent.olapEngineModule.headerContent).length;
                    } else {
                        emptyRowCount = Object.keys(this.parent.engineModule.headerContent).length;
                    }
                    if (!isNullOrUndefined(emptyRowCount)) {
                        let emptyHeader: HTMLElement =
                            this.parent.element.querySelector('.e-frozenheader').querySelector('.e-columnheader') as HTMLElement;
                        addClass([emptyHeader], 'e-row');
                        emptyHeader.removeAttribute('style');
                        addClass([emptyHeader.querySelector('.e-headercell')], 'e-group-row');
                        emptyHeader.querySelector('.e-group-row').appendChild(this.rowAxisPanel);
                        (emptyHeader.querySelector('.e-group-row').querySelector('.e-headercelldiv') as HTMLElement).style.display = 'none';
                        (emptyHeader.querySelector('.e-group-row').querySelector('.e-sortfilterdiv') as HTMLElement).style.display = 'none';
                    }
                    this.parent.element.insertBefore(this.groupingTable, this.parent.element.querySelector('.' + cls.GRID_CLASS));
                    setStyleAttribute(this.groupingTable, {
                        width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
                    });
                    this.groupingTable.style.minWidth = '400px';
                    this.parent.axisFieldModule.render();
                    this.setGridRowWidth();
                    let colGroupElement: HTMLElement =
                        this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0] as HTMLElement;
                    let rightAxisPanelWidth: string =
                        formatUnit(this.groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10));
                    setStyleAttribute(this.valuePanel, { width: colGroupElement.style.width });
                    setStyleAttribute(this.rightAxisPanel, { width: rightAxisPanelWidth });
                    let rightPanelHeight: number = (this.valuePanel.offsetHeight / 2);
                    if (rightPanelHeight > this.columnPanel.offsetHeight) {
                        setStyleAttribute(this.filterPanel, { height: formatUnit(rightPanelHeight) });
                        setStyleAttribute(this.columnPanel, { height: formatUnit(rightPanelHeight + 1) });
                    }
                    let topLeftHeight: number =
                        (this.parent.element.querySelector('.e-headercontent') as HTMLElement).offsetHeight;
                    setStyleAttribute(this.rowPanel, {
                        height: topLeftHeight + 'px'
                    });
                    if (this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler')) {
                        (this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler') as HTMLElement).style.height =
                            topLeftHeight + 'px';
                    }

                    let colRows: HTMLTableElement[] =
                        [].slice.call(this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('tr'));
                    let columnRows: HTMLTableElement[] = colRows.filter((trCell: HTMLTableElement) => {
                        return (trCell.childNodes.length > 0);
                    });
                    let colHeight: number = topLeftHeight / columnRows.length;
                    for (let element of columnRows) {
                        setStyleAttribute(element, { 'height': colHeight + 'px' });
                        let rowHeader: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-rhandler')) as HTMLElement[];
                        for (let rhElement of rowHeader) {
                            setStyleAttribute(rhElement, { 'height': colHeight + 'px' });
                        }
                    }
                } else {
                    this.parent.axisFieldModule.render();
                }
                if (this.parent.showToolbar && this.parent.displayOption.view === 'Both') {
                    if (this.parent.currentView === 'Table') {
                        (this.parent.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display = 'none';
                    } else {
                        (this.parent.element.querySelector('.e-pivot-grouping-bar') as HTMLElement).style.display = 'none';
                    }
                }

            }
        }
    }
    /**
     * @hidden
     */
    public refreshUI(): void {
        if (this.groupingChartTable) {
            setStyleAttribute(this.groupingChartTable, {
                width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
            });
        }
        if (this.groupingTable) {
            setStyleAttribute(this.groupingTable, {
                width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
            });
            this.groupingTable.style.minWidth = '400px';
            let colGroupElement: HTMLElement =
                this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0] as HTMLElement;
            let rightAxisWidth: string = formatUnit(this.groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10));
            setStyleAttribute(this.valuePanel, { width: colGroupElement.style.width });
            setStyleAttribute(this.rightAxisPanel, { width: rightAxisWidth });
            if (this.parent.showFieldList && this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.element) {
                clearTimeout(this.timeOutObj);
                this.timeOutObj = setTimeout(this.alignIcon.bind(this));
            }
            if (!this.parent.grid.element.querySelector('.e-group-row')) {
                let emptyRowHeader: HTMLElement =
                    this.parent.element.querySelector('.e-frozenheader').querySelector('.e-columnheader') as HTMLElement;
                addClass([emptyRowHeader], 'e-row');
                addClass([emptyRowHeader.querySelector('.e-headercell')], 'e-group-row');
                setStyleAttribute(this.rowPanel, {
                    height: (this.parent.element.querySelector('.e-headercontent') as HTMLElement).offsetHeight + 'px'
                });
                emptyRowHeader.querySelector('.e-group-row').appendChild(this.rowAxisPanel);
                setStyleAttribute(emptyRowHeader.querySelector('.e-group-row').querySelector('.e-headercelldiv') as HTMLElement, {
                    display: 'none'
                });
                setStyleAttribute(emptyRowHeader.querySelector('.e-group-row').querySelector('.e-sortfilterdiv') as HTMLElement, {
                    display: 'none'
                });
                let groupHeight: number =
                    (this.parent.element.querySelector('.e-headercontent') as HTMLElement).offsetHeight;
                setStyleAttribute(this.rowPanel, {
                    height: groupHeight + 'px'
                });
                if (this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler')) {
                    (this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler') as HTMLElement).style.height =
                        groupHeight + 'px';
                }
                let colRowElements: HTMLTableElement[] =
                    [].slice.call(this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('tr'));
                let columnRows: HTMLTableElement[] = colRowElements.filter((trCell: HTMLTableElement) => {
                    return (trCell.childNodes.length > 0);
                });
                let colHeight: number = groupHeight / columnRows.length;
                for (let element of columnRows) {
                    setStyleAttribute(element, { 'height': colHeight + 'px' });
                    let rowHeader: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-rhandler')) as HTMLElement[];
                    for (let handlerElement of rowHeader) {
                        setStyleAttribute(handlerElement, { 'height': colHeight + 'px' });
                    }
                }
            }
        }
    }

    /** @hidden */
    public alignIcon(): void {
        let element: HTMLElement = this.parent.pivotFieldListModule.element;
        let currentWidth: number;
        if (this.parent.currentView === 'Table') {
            currentWidth = this.parent.grid ? this.parent.grid.element.offsetWidth : currentWidth;
        } else {
            currentWidth = this.parent.chart ? this.parent.chartModule.calculatedWidth : currentWidth;
        }
        if (currentWidth) {
            let actWidth: number = currentWidth < 400 ? 400 : currentWidth;
            setStyleAttribute(element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement, {
                left: formatUnit(this.parent.enableRtl ?
                    -Math.abs((actWidth) -
                        (element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).offsetWidth) :
                    (actWidth) -
                    (element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).offsetWidth)
            });
        }
    }
    /**
     * @hidden
     */
    public setGridRowWidth(): void {
        let colGroupElement: HTMLElement =
            this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0] as HTMLElement;
        if (this.rowPanel.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            if (!this.parent.isAdaptive) {
                let pivotButtons: HTMLElement[] = [].slice.call(this.rowPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_WRAPPER_CLASS));
                let lastButton: HTMLElement = pivotButtons[pivotButtons.length - 1];
                let lastButtonWidth: number = ((lastButton.querySelector('.' + cls.PIVOT_BUTTON_CLASS) as HTMLElement).offsetWidth +
                    (lastButton.querySelector('.e-indent-div') as HTMLElement).offsetWidth + 20);
                let buttonWidth: string = formatUnit(lastButtonWidth < this.resColWidth ? this.resColWidth : lastButtonWidth);
                let rowHeaderTable: HTMLElement =
                    this.parent.element.querySelector('.e-frozenheader').querySelector('table') as HTMLElement;
                let rowContentTable: HTMLElement =
                    this.parent.element.querySelector('.e-frozencontent').querySelector('table') as HTMLElement;
                let rowContent: HTMLElement =
                    this.parent.element.querySelector('.e-frozencontent').querySelector('colgroup').children[0] as HTMLElement;
                let colwidth: number = parseInt(buttonWidth, 10);
                let gridColumn: Column[] = this.parent.grid.columns as Column[];
                if (gridColumn && gridColumn.length > 0) {
                    /* tslint:disable:align */
                    gridColumn[0].width = (gridColumn[0].width >= this.resColWidth ?
                        (colwidth > this.resColWidth ? colwidth : this.resColWidth) :
                        (colwidth > this.resColWidth ? colwidth : this.resColWidth));
                }
                let valueColWidth: number;
                if (this.parent.dataType === 'olap') {
                    valueColWidth = this.parent.renderModule.calculateColWidth(
                        this.parent.olapEngineModule.pivotValues.length > 0 ?
                            this.parent.olapEngineModule.pivotValues[0].length : 2);
                } else {
                    valueColWidth = this.parent.renderModule.calculateColWidth((this.parent.dataSourceSettings.values.length > 0 &&
                        this.parent.engineModule.pivotValues.length > 0) ?
                        this.parent.engineModule.pivotValues[0].length : 2);
                }
                for (let cCnt: number = 0; cCnt < gridColumn.length; cCnt++) {
                    if (cCnt !== 0) {
                        if ((gridColumn[cCnt] as Column).columns) {
                            this.setColWidth((gridColumn[cCnt] as Column).columns as Column[], valueColWidth);
                        } else {
                            (gridColumn[cCnt] as Column).width = valueColWidth;
                            if ((gridColumn[cCnt] as Column).width !== 'auto') {
                                let levelName: string = gridColumn[cCnt].customAttributes ?
                                    (gridColumn[cCnt].customAttributes as any).cell.valueSort.levelName : '';
                                gridColumn[cCnt].width = this.parent.renderModule.setSavedWidth(levelName, valueColWidth);
                            } else {
                                (gridColumn[cCnt] as Column).minWidth = valueColWidth;
                            }
                        }
                    }
                }
                this.parent.posCount = 0;
                this.parent.setGridColumns(this.parent.grid.columns as ColumnModel[]);
                this.parent.grid.headerModule.refreshUI();
                if (!this.parent.firstColWidth) {
                    colGroupElement.style.width = buttonWidth;
                    rowContent.style.width = buttonWidth;
                    rowHeaderTable.style.width = buttonWidth;
                    rowContentTable.style.width = buttonWidth;
                    setStyleAttribute(rowHeaderTable, { 'width': buttonWidth });
                    setStyleAttribute(rowContentTable, { 'width': buttonWidth });
                }
            } else {
                if (!this.parent.firstColWidth) {
                    let gridColumn: Column[] = this.parent.grid.columns as Column[];
                    if (gridColumn && gridColumn.length > 0) {
                        gridColumn[0].width = this.resColWidth;
                    }
                    this.parent.posCount = 0;
                    this.parent.grid.headerModule.refreshUI();
                }
            }
        } else {
            if (this.parent.grid.columns && this.parent.grid.columns.length > 0) {
                (this.parent.grid.columns[0] as Column).width = (this.parent.grid.columns[0] as Column).width > this.resColWidth ?
                    (this.parent.grid.columns[0] as Column).width : this.resColWidth;
            }
            this.parent.grid.headerModule.refreshUI();
        }
        if (this.groupingTable) {
            this.refreshUI();
        }
    }
    private setColWidth(columns: Column[], width: number): void {
        for (let cCnt: number = 0; cCnt < columns.length; cCnt++) {
            if ((columns[cCnt] as Column).columns) {
                this.setColWidth((columns[cCnt] as Column).columns as Column[], width);
            } else {
                (columns[cCnt] as Column).width = width;
            }
        }
    }
    private wireEvent(element: Element): void {
        EventHandler.add(element, 'mouseover', this.dropIndicatorUpdate, this);
        EventHandler.add(element, 'mouseleave', this.dropIndicatorUpdate, this);
    }
    private unWireEvent(element: Element): void {
        EventHandler.remove(element, 'mouseover', this.dropIndicatorUpdate);
        EventHandler.remove(element, 'mouseleave', this.dropIndicatorUpdate);
    }
    private dropIndicatorUpdate(e: MouseEvent): void {
        if ((this.parent.isDragging && (e.target as HTMLElement).classList.contains(cls.DROPPABLE_CLASS) && e.type === 'mouseover') ||
            e.type === 'mouseleave') {
            removeClass(
                [].slice.call(this.parent.element.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
            removeClass(
                [].slice.call(this.parent.element.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS + '-last')), cls.INDICATOR_HOVER_CLASS);
        }
    }
    private tapHoldHandler(e: TapEventArgs): void {
        let target: Element = closest((e.originalEvent.target as Element), '.' + cls.PIVOT_BUTTON_CLASS);
        if (!isNullOrUndefined(target) && this.parent.isAdaptive) {
            let pos: OffsetPosition = (target as Element).getBoundingClientRect();
            this.parent.contextMenuModule.fieldElement = target as HTMLElement;
            this.parent.contextMenuModule.menuObj.open(pos.top, pos.left);
            return;
        }
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        this.handlers = {
            load: this.renderLayout,
            end: this.appendToElement,
        };
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initSubComponent, this.handlers.load, this); //For initial rendering
        this.parent.on(events.uiUpdate, this.handlers.end, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.uiUpdate, this.handlers.end);
        this.parent.off(events.initSubComponent, this.handlers.load);
    }

    /**
     * To destroy the groupingbar 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.parent.pivotButtonModule) {
            this.parent.pivotButtonModule.destroy();
            if (this.touchObj && !this.touchObj.isDestroyed) { this.touchObj.destroy(); }
        } else {
            return;
        }
    }
}
