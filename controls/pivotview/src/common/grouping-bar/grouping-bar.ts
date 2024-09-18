import { createElement, remove, Droppable, setStyleAttribute, removeClass, select, selectAll } from '@syncfusion/ej2-base';
import { EventHandler, Touch, TapEventArgs, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { addClass, formatUnit } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { IAction } from '../../common/base/interface';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { AxisFields } from './axis-field-renderer';
import { OffsetPosition } from '@syncfusion/ej2-popups';
import { Column, ColumnModel } from '@syncfusion/ej2-grids';
import { Toolbar } from '@syncfusion/ej2-navigations';
import { IAxisSet } from '../../base/engine';

/**
 * Module for GroupingBar rendering
 */
/** @hidden */
export class GroupingBar implements IAction {
    /**
     * Internal variables
     */
    /** @hidden */
    public gridPanel: Toolbar;
    /** @hidden */
    public chartPanel: Toolbar;
    private groupingTable: HTMLElement;
    private groupingChartTable: HTMLElement;
    private rightAxisPanel: HTMLElement;
    /** @hidden */
    public rowPanel: HTMLElement;
    private rowAxisPanel: HTMLElement;
    private touchObj: Touch;
    private resColWidth: number;
    private timeOutObj: ReturnType<typeof setTimeout>;

    /**
     * Module declarations
     */
    private parent: PivotView;

    /** Constructor for GroupingBar module
     *
     * @param {PivotView} parent - Instance.
     */
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
     *
     * @returns {string} - Module name.
     * @private
     */
    protected getModuleName(): string {
        return 'groupingBar';
    }

    /**
     * @hidden
     * @returns {void}
     */
    public renderLayout(): void {
        this.groupingTable = createElement('div', { className: cls.GROUPING_BAR_CLASS });
        const leftAxisPanel: HTMLElement = createElement('div', { className: cls.LEFT_AXIS_PANEL_CLASS });
        this.rightAxisPanel = createElement('div', { className: cls.RIGHT_AXIS_PANEL_CLASS });
        const rowAxisPanel: HTMLElement = createElement('div', { className: cls.AXIS_ROW_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'container' });
        const columnAxisPanel: HTMLElement = createElement('div', {
            className: cls.AXIS_COLUMN_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'container'
        });
        const valueAxisPanel: HTMLElement = createElement('div', {
            className: cls.AXIS_VALUE_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'container'
        });
        const filterAxisPanel: HTMLElement = createElement('div', {
            className: cls.AXIS_FILTER_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'container'
        });
        this.rowPanel = createElement('div', { className: cls.GROUP_ROW_CLASS + ' ' + cls.ROW_AXIS_CLASS });
        const columnPanel: HTMLElement = createElement('div', { className: cls.GROUP_COLUMN_CLASS + ' ' + cls.COLUMN_AXIS_CLASS });
        const valuePanel: HTMLElement = createElement('div', { className: cls.GROUP_VALUE_CLASS + ' ' + cls.VALUE_AXIS_CLASS });
        const filterPanel: HTMLElement = createElement('div', { className: cls.GROUP_FILTER_CLASS + ' ' + cls.FILTER_AXIS_CLASS });
        rowAxisPanel.appendChild(this.rowPanel);
        columnAxisPanel.appendChild(columnPanel);
        valueAxisPanel.appendChild(valuePanel);
        filterAxisPanel.appendChild(filterPanel);
        this.rowAxisPanel = rowAxisPanel;
        leftAxisPanel.appendChild(valueAxisPanel);
        leftAxisPanel.appendChild(rowAxisPanel);
        this.rightAxisPanel.appendChild(filterAxisPanel);
        this.rightAxisPanel.appendChild(columnAxisPanel);
        this.groupingTable.appendChild(createElement('div', { styles: 'display:flex;' }));
        this.groupingTable.firstElementChild.appendChild(leftAxisPanel);
        this.groupingTable.firstElementChild.appendChild(this.rightAxisPanel);
        if (this.parent.dataType === 'pivot' && this.parent.groupingBarSettings != null && this.parent.groupingBarSettings.showFieldsPanel) {
            this.gridPanel = this.createToolbarUI(this.groupingTable);
        }
        this.groupingTable.classList.add(cls.GRID_GROUPING_BAR_CLASS);
        this.groupingTable.querySelector('.' + cls.GROUP_ROW_CLASS).classList.add(cls.GROUP_PIVOT_ROW);
        const axisPanels: HTMLElement[] = [this.rowPanel, columnPanel, valuePanel, filterPanel];
        for (const element of axisPanels) {
            if (this.parent.groupingBarSettings.allowDragAndDrop) {
                new Droppable(element, {});
            }
            this.unWireEvent(element);
            this.wireEvent(element);
        }
        if (this.parent.displayOption.view !== 'Table' && this.parent.groupingBarSettings.displayMode !== 'Table') {
            this.groupingChartTable = this.groupingTable.cloneNode(true) as HTMLElement;
            if (select('#' + this.parent.element.id + '_AllFields', this.groupingChartTable)) {
                (select('#' + this.parent.element.id + '_AllFields', this.groupingChartTable) as HTMLElement).remove();
                this.chartPanel = this.createToolbarUI(this.groupingChartTable);
            }
            this.groupingChartTable.classList.add(cls.CHART_GROUPING_BAR_CLASS);
            this.groupingChartTable.classList.remove(cls.GRID_GROUPING_BAR_CLASS);
            this.groupingChartTable.querySelector('.' + cls.GROUP_ROW_CLASS).classList.add(cls.GROUP_CHART_ROW);
            this.groupingChartTable.querySelector('.' + cls.GROUP_ROW_CLASS).classList.remove(cls.GROUP_PIVOT_ROW);
            if (this.parent.chartSettings.enableMultipleAxis && this.parent.chartSettings.chartSeries &&
                ['Pie', 'Pyramid', 'Doughnut', 'Funnel'].indexOf(this.parent.chartSettings.chartSeries.type) < 0) {
                this.groupingChartTable.querySelector('.' + cls.GROUP_VALUE_CLASS).classList.add(cls.GROUP_CHART_MULTI_VALUE);
            } else {
                this.groupingChartTable.querySelector('.' + cls.GROUP_VALUE_CLASS).classList.add(cls.GROUP_CHART_VALUE);
            }
            if (this.parent.chartSettings.chartSeries &&
                ['Pie', 'Pyramid', 'Doughnut', 'Funnel'].indexOf(this.parent.chartSettings.chartSeries.type) > -1) {
                this.groupingChartTable.querySelector('.' + cls.GROUP_COLUMN_CLASS).classList.add(cls.GROUP_CHART_COLUMN);
            } else {
                this.groupingChartTable.querySelector('.' + cls.GROUP_COLUMN_CLASS).classList.add(cls.GROUP_CHART_ACCUMULATION_COLUMN);
            }
            this.groupingChartTable.querySelector('.' + cls.GROUP_FILTER_CLASS).classList.add(cls.GROUP_CHART_FILTER);
        } else {
            this.groupingChartTable = undefined;
        }
        if (this.parent.displayOption.view === 'Chart' || this.parent.groupingBarSettings.displayMode === 'Chart') {
            this.groupingTable = undefined;
        }
    }

    private appendToElement(): void {
        const element: HTMLElement = this.groupingTable ? this.groupingTable : this.groupingChartTable;
        if (isNullOrUndefined(element)) {
            return;
        }
        const leftAxisPanel: HTMLElement = element.getElementsByClassName(cls.LEFT_AXIS_PANEL_CLASS)[0] as HTMLElement;
        const filterPanel: HTMLElement = element.getElementsByClassName(cls.GROUP_FILTER_CLASS + ' ' +
            cls.FILTER_AXIS_CLASS)[0] as HTMLElement;
        const columnPanel: HTMLElement = element.getElementsByClassName(cls.GROUP_COLUMN_CLASS + ' ' +
            cls.COLUMN_AXIS_CLASS)[0] as HTMLElement;
        const valuePanel: HTMLElement = element.getElementsByClassName(cls.GROUP_VALUE_CLASS + ' ' +
            cls.VALUE_AXIS_CLASS)[0] as HTMLElement;
        if (this.parent.element.querySelector('.' + cls.GRID_CLASS) || this.parent.element.querySelector('.' + cls.PIVOTCHART)) {
            if (this.parent.showGroupingBar) {
                if (this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                    const elements: NodeListOf<HTMLElement> = this.parent.element.querySelectorAll('.' + cls.GROUPING_BAR_CLASS);
                    for (let i: number = 0; i < elements.length; i++) {
                        const element: HTMLElement = elements[i as number];
                        remove(element);
                    }
                }
                if (this.groupingChartTable) {
                    if (select('#' + this.parent.element.id + '_chart', this.parent.element)) {
                        setStyleAttribute(this.groupingChartTable, {
                            width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
                        });
                        this.parent.element.insertBefore(
                            this.groupingChartTable, select('#' + this.parent.element.id + '_chart', this.parent.element));
                        if (this.groupingChartTable.querySelector('.' + cls.ALL_FIELDS_PANEL_CLASS) && this.chartPanel != null && !this.chartPanel.isDestroyed) {
                            const chartPanelWidth: string | number = this.parent.grid ? (this.parent.getGridWidthAsNumber() - 2) :
                                (this.parent.getWidthAsNumber() - 2);
                            this.chartPanel.width = chartPanelWidth < 400 ? '398px' : chartPanelWidth;
                            this.chartPanel.refreshOverflow();
                            if (this.parent.showFieldList && this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.element) {
                                clearTimeout(this.timeOutObj);
                                this.timeOutObj = setTimeout(this.alignIcon.bind(this));
                            }
                        }
                    } else {
                        this.groupingChartTable = undefined;
                    }
                }
                if (this.parent.displayOption.view !== 'Chart' && this.groupingTable) {
                    if (this.parent.isAdaptive) {
                        leftAxisPanel.style.minWidth = '180px';
                        valuePanel.style.minWidth = '180px';
                    }
                    if (this.parent.firstColWidth) {
                        leftAxisPanel.style.minWidth = 'auto';
                        valuePanel.style.minWidth = 'auto';
                    }
                    filterPanel.removeAttribute('style');
                    columnPanel.removeAttribute('style');
                    this.rowPanel.removeAttribute('style');
                    let emptyRowCount: number;
                    if (this.parent.dataType === 'olap') {
                        emptyRowCount = this.parent.olapEngineModule.headerContent ?
                            Object.keys(this.parent.olapEngineModule.headerContent).length : 0;
                    } else {
                        emptyRowCount = this.parent.engineModule.headerContent ?
                            Object.keys(this.parent.engineModule.headerContent).length : 0;
                    }
                    if (!isNullOrUndefined(emptyRowCount)) {
                        const emptyHeader: HTMLElement =
                            this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('.e-columnheader') as HTMLElement;
                        emptyHeader.removeAttribute('style');
                        addClass([emptyHeader.querySelector('.' + cls.HEADERCELL)], 'e-group-row');
                        (emptyHeader.querySelector('.e-group-row').querySelector('.e-headercelldiv') as HTMLElement).style.display = 'none';
                        (emptyHeader.querySelector('.e-group-row').querySelector('.e-sortfilterdiv') as HTMLElement).style.display = 'none';
                    }
                    this.parent.element.insertBefore(this.groupingTable, this.parent.element.querySelector('.' + cls.GRID_CLASS));
                    setStyleAttribute(this.groupingTable, {
                        width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
                    });
                    if (this.groupingTable && this.groupingTable.querySelector('.' + cls.ALL_FIELDS_PANEL_CLASS) && this.gridPanel != null && !this.gridPanel.isDestroyed) {
                        const gridPanelWidth: string | number = this.parent.grid ? (this.parent.getGridWidthAsNumber() - 2) :
                            (this.parent.getWidthAsNumber() - 2);
                        this.gridPanel.width = gridPanelWidth < 400 ? '398px' : gridPanelWidth;
                        this.gridPanel.refreshOverflow();
                    }
                    this.groupingTable.style.minWidth = '400px';
                    this.parent.axisFieldModule.render();
                    this.setGridRowWidth();
                    const colGroupElement: HTMLElement =
                        this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('colgroup').children[0] as HTMLElement;
                    const rightAxisPanelWidth: string =
                        formatUnit(this.groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10));
                    setStyleAttribute(valuePanel, { width: colGroupElement.style.width });
                    setStyleAttribute(this.rightAxisPanel, { width: rightAxisPanelWidth });
                    const rightPanelHeight: number = (valuePanel.offsetHeight / 2);
                    if (rightPanelHeight > columnPanel.offsetHeight) {
                        setStyleAttribute(filterPanel, { height: formatUnit(rightPanelHeight) });
                        setStyleAttribute(columnPanel, { height: formatUnit(rightPanelHeight + 2) });
                    }
                    const topLeftHeight: number =
                        (this.parent.element.querySelector('.' + cls.HEADERCONTENT) as HTMLElement).offsetHeight;
                    setStyleAttribute(this.rowPanel, {
                        height: topLeftHeight + 'px'
                    });
                    if (this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('.e-rhandler')) {
                        (this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('.e-rhandler') as HTMLElement).style.height =
                            topLeftHeight + 'px';
                    }

                    const colRows: HTMLTableElement[] =
                        [].slice.call(this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('thead').querySelectorAll('tr'));
                    const columnRows: HTMLTableElement[] = colRows.filter((trCell: HTMLTableElement) => {
                        return (trCell.childNodes.length > 0);
                    });
                    const colHeight: number = topLeftHeight / columnRows.length;
                    for (const element of columnRows) {
                        setStyleAttribute(element, { 'height': colHeight + 'px' });
                        const rowHeader: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-rhandler')) as HTMLElement[];
                        for (const rhElement of rowHeader) {
                            setStyleAttribute(rhElement, { 'height': colHeight + 'px' });
                        }
                    }
                } else {
                    this.parent.axisFieldModule.render();
                    this.updateChartAxisHeight();
                }
                if (this.parent.showToolbar && this.parent.displayOption.view === 'Both') {
                    const groupingBarSelector: string = this.parent.currentView === 'Table' ? '.e-chart-grouping-bar'
                        : '.e-pivot-grouping-bar';
                    const groupingBar: HTMLElement = this.parent.element.querySelector(groupingBarSelector) as HTMLElement;
                    if (groupingBar) {
                        groupingBar.style.display = 'none';
                    }
                }
            }
        }
    }

    private updateChartAxisHeight(): void {
        if (this.groupingChartTable && select('#' + this.parent.element.id + '_chart', this.parent.element)) {
            const rowPanel: HTMLElement = this.groupingChartTable.querySelector('.' + cls.GROUP_ROW_CLASS) as HTMLElement;
            const valuePanel: HTMLElement = this.groupingChartTable.querySelector('.' + cls.GROUP_VALUE_CLASS) as HTMLElement;
            const filterPanel: HTMLElement = this.groupingChartTable.querySelector('.' + cls.GROUP_FILTER_CLASS) as HTMLElement;
            const columnPanel: HTMLElement = this.groupingChartTable.querySelector('.' + cls.GROUP_COLUMN_CLASS) as HTMLElement;
            if (rowPanel && columnPanel) {
                rowPanel.style.height = 'auto';
                columnPanel.style.height = 'auto';
                if (rowPanel.offsetHeight > 0 && columnPanel.offsetHeight > 0) {
                    const maxHeight: number = rowPanel.offsetHeight > columnPanel.offsetHeight ? rowPanel.offsetHeight :
                        columnPanel.offsetHeight;
                    setStyleAttribute(rowPanel, { height: formatUnit(maxHeight) });
                    setStyleAttribute(columnPanel, { height: formatUnit(maxHeight) });
                }
            }
            if (valuePanel && filterPanel) {
                valuePanel.style.height = 'auto';
                filterPanel.style.height = 'auto';
                if (valuePanel.offsetHeight > 0 && filterPanel.offsetHeight > 0) {
                    const maxHeight: number = valuePanel.offsetHeight > filterPanel.offsetHeight ? valuePanel.offsetHeight :
                        filterPanel.offsetHeight;
                    setStyleAttribute(valuePanel, { height: formatUnit(maxHeight) });
                    setStyleAttribute(filterPanel, { height: formatUnit(maxHeight) });
                }
            }
        }
    }

    /**
     * @hidden
     * @returns {void}
     */
    public refreshUI(): void {
        if (this.groupingChartTable) {
            setStyleAttribute(this.groupingChartTable, {
                width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
            });
            if (this.groupingChartTable.querySelector('.' + cls.ALL_FIELDS_PANEL_CLASS) && this.chartPanel != null && !this.chartPanel.isDestroyed) {
                const chartPanelWidth: string | number = this.parent.grid ? (this.parent.getGridWidthAsNumber() - 2) :
                    (this.parent.getWidthAsNumber() - 2);
                this.chartPanel.width = chartPanelWidth < 400 ? '398px' : chartPanelWidth;
                this.chartPanel.refreshOverflow();
            }
            this.updateChartAxisHeight();
            if (this.parent.showFieldList && this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.element) {
                clearTimeout(this.timeOutObj);
                this.timeOutObj = setTimeout(this.alignIcon.bind(this));
            }
        }
        if (this.groupingTable) {
            const valuePanel: HTMLElement = this.groupingTable.getElementsByClassName(cls.GROUP_VALUE_CLASS + ' ' +
                cls.VALUE_AXIS_CLASS)[0] as HTMLElement;
            setStyleAttribute(this.groupingTable, {
                width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
            });
            if (this.groupingTable && this.groupingTable.querySelector('.' + cls.ALL_FIELDS_PANEL_CLASS) && this.gridPanel != null && !this.gridPanel.isDestroyed) {
                const gridPanelWidth: string | number = this.parent.grid ? (this.parent.getGridWidthAsNumber() - 2) :
                    (this.parent.getWidthAsNumber() - 2);
                this.gridPanel.width = gridPanelWidth < 400 ? '398px' : gridPanelWidth;
                this.gridPanel.refreshOverflow();
            }
            this.groupingTable.style.minWidth = '400px';
            const colGroupElement: HTMLElement =
                this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('colgroup').children[0] as HTMLElement;
            const rightAxisWidth: string = formatUnit(this.groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10));
            setStyleAttribute(valuePanel, { width: colGroupElement.style.width });
            setStyleAttribute(this.rightAxisPanel, { width: rightAxisWidth });
            if (this.parent.showFieldList && this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.element) {
                clearTimeout(this.timeOutObj);
                this.timeOutObj = setTimeout(this.alignIcon.bind(this));
            }
            if (!this.parent.grid.element.querySelector('.e-group-row')) {
                const emptyRowHeader: HTMLElement =
                this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('.e-columnheader') as HTMLElement;
                addClass([emptyRowHeader.querySelector('.' + cls.HEADERCELL)], 'e-group-row');
                setStyleAttribute(this.rowPanel, {
                    height: (this.parent.element.querySelector('.' + cls.HEADERCONTENT) as HTMLElement).offsetHeight + 'px'
                });
                emptyRowHeader.querySelector('.e-group-row').appendChild(this.rowAxisPanel);
                setStyleAttribute(emptyRowHeader.querySelector('.e-group-row').querySelector('.e-headercelldiv') as HTMLElement, {
                    display: 'none'
                });
                setStyleAttribute(emptyRowHeader.querySelector('.e-group-row').querySelector('.e-sortfilterdiv') as HTMLElement, {
                    display: 'none'
                });
                const groupHeight: number =
                    (this.parent.element.querySelector('.' + cls.HEADERCONTENT) as HTMLElement).offsetHeight;
                setStyleAttribute(this.rowPanel, {
                    height: groupHeight + 'px'
                });
                if (this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('.e-rhandler')) {
                    (this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('.e-rhandler') as HTMLElement).style.height =
                        groupHeight + 'px';
                }
                const colRowElements: HTMLTableElement[] =
                    [].slice.call(this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('thead').querySelectorAll('tr'));
                const columnRows: HTMLTableElement[] = colRowElements.filter((trCell: HTMLTableElement) => {
                    return (trCell.childNodes.length > 0);
                });
                const colHeight: number = groupHeight / columnRows.length;
                for (const element of columnRows) {
                    setStyleAttribute(element, { 'height': colHeight + 'px' });
                    const rowHeader: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-rhandler')) as HTMLElement[];
                    for (const handlerElement of rowHeader) {
                        if (!handlerElement.parentElement.parentElement.querySelector('.' + cls.FREEZED_CELL)) {
                            setStyleAttribute(handlerElement, { 'height': colHeight + 'px' });
                        }
                    }
                }
            }
        }
    }

    /**
     *
     * @returns {void}
     * @hidden
     */
    public alignIcon(): void {
        if (this.parent.pivotFieldListModule) {
            const element: HTMLElement = this.parent.pivotFieldListModule.element;
            let currentWidth: number;
            if (this.parent.currentView === 'Table') {
                currentWidth = this.parent.grid ? this.parent.grid.element.offsetWidth : currentWidth;
            } else {
                currentWidth = this.parent.chart ? this.parent.pivotChartModule.getCalulatedWidth() : currentWidth;
            }
            if (currentWidth) {
                const actWidth: number = currentWidth < 400 ? 400 : currentWidth;
                setStyleAttribute(element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement, {
                    left: formatUnit(this.parent.enableRtl ?
                        -Math.abs((actWidth) -
                            (element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).offsetWidth) :
                        (actWidth) -
                        (element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).offsetWidth),

                    top: this.parent.element.querySelector('.' + cls.FIELD_PANEL_SCROLL_CLASS) ? (this.parent.element.querySelector(
                        '.' + cls.TOGGLE_FIELD_LIST_CLASS) as HTMLElement).offsetHeight.toString() + 'px' : ''
                });
            }
        }
    }

    /**
     *
     * @returns {void}
     * @hidden
     */
    public setGridRowWidth(): void {
        const emptyRowHeader: HTMLElement =
        this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('.e-columnheader') as HTMLElement;
        addClass([emptyRowHeader.querySelector('.' + cls.HEADERCELL)], 'e-group-row');
        emptyRowHeader.querySelector('.e-group-row').appendChild(this.rowAxisPanel);
        const colGroupElement: HTMLElement =
            this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('colgroup').children[0] as HTMLElement;
        if (this.rowPanel.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            if (!this.parent.isAdaptive) {
                const pivotButtons: HTMLElement[] = [].slice.call(this.rowPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_WRAPPER_CLASS));
                const lastButton: HTMLElement = pivotButtons[pivotButtons.length - 1];
                const lastButtonWidth: number = ((lastButton.querySelector('.' + cls.PIVOT_BUTTON_CLASS) as HTMLElement).offsetWidth +
                    (lastButton.querySelector('.e-indent-div') as HTMLElement).offsetWidth + 20);
                let buttonWidth: string = formatUnit(lastButtonWidth < this.resColWidth ? this.resColWidth : lastButtonWidth);
                const rowHeaderTable: HTMLElement =
                this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('.' + cls.HEADERCELL) as HTMLElement;
                const rowContentTable: HTMLElement =
                this.parent.element.querySelector('.' + cls.CONTENT_CLASS).querySelector('tbody').querySelector('.' + cls.FREEZED_CELL);
                const rowContent: HTMLElement =
                this.parent.element.querySelector('.' + cls.CONTENT_CLASS).querySelector('colgroup').children[0] as HTMLElement;
                const colwidth: number = parseInt(buttonWidth, 10);
                const hasPivotColumns: boolean = this.parent.pivotColumns.length > 0;
                const gridColumn: Column[] = this.parent.grid.columns as Column[];
                if (gridColumn && gridColumn.length > 0) {
                    gridColumn[0].width = gridColumn[0].autoFit ?
                        gridColumn[0].width : (colwidth > this.resColWidth ? colwidth : this.resColWidth);
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
                        if ((gridColumn[cCnt as number] as Column).columns) {
                            this.parent.setCommonColumnsWidth(
                                (this.parent.renderModule.pivotColumns[cCnt as number] as Column).columns as Column[], valueColWidth
                            );
                        } else {
                            if ((gridColumn[cCnt as number] as Column).width !== 'auto') {
                                const levelName: string = gridColumn[cCnt as number].customAttributes ?
                                    (gridColumn[cCnt as number].customAttributes.cell as IAxisSet).valueSort.levelName as string : '';
                                const columnWidth: number = this.parent.renderModule.setSavedWidth(levelName, valueColWidth);
                                gridColumn[cCnt as number].width = (gridColumn[cCnt as number].autoFit || (hasPivotColumns
                                    && this.parent.pivotColumns[cCnt as number].autoFit)) ? gridColumn[cCnt as number].width :
                                    ((this.parent.renderModule.lastColumn &&
                                        this.parent.renderModule.lastColumn.field === gridColumn[cCnt as number].field) ?
                                        (columnWidth - 3) : columnWidth);
                            } else {
                                (gridColumn[cCnt as number] as Column).minWidth = valueColWidth;
                            }
                        }
                    }
                }
                this.parent.posCount = 0;
                this.parent.setGridColumns(this.parent.grid.columns as ColumnModel[]);
                this.parent.grid.headerModule.refreshUI();
                if (!this.parent.firstColWidth) {
                    buttonWidth = gridColumn[0].autoFit ? gridColumn[0].width.toString() : buttonWidth;
                    colGroupElement.style.width = buttonWidth;
                    rowContent.style.width = buttonWidth;
                    rowHeaderTable.style.width = buttonWidth;
                    rowContentTable.style.width = buttonWidth;
                    setStyleAttribute(rowHeaderTable, { 'width': buttonWidth });
                    setStyleAttribute(rowContentTable, { 'width': buttonWidth });
                }
            } else {
                if (!this.parent.firstColWidth) {
                    const gridColumn: Column[] = this.parent.grid.columns as Column[];
                    if (gridColumn && gridColumn.length > 0) {
                        gridColumn[0].width = this.resColWidth;
                    }
                    this.parent.posCount = 0;
                    this.parent.grid.headerModule.refreshUI();
                }
            }
        } else {
            if (this.parent.grid.columns && this.parent.grid.columns.length > 0) {
                (this.parent.grid.columns[0] as Column).width = (this.parent.grid.columns[0] as Column).width as number > this.resColWidth
                    ? (this.parent.grid.columns[0] as Column).width : this.resColWidth;
            }
            this.parent.grid.headerModule.refreshUI();
        }
        if (this.groupingTable || this.groupingChartTable) {
            this.refreshUI();
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
            (!this.parent.isDragging || (!(e.target as HTMLElement).classList.contains(cls.DROPPABLE_CLASS) && e.type === 'mouseleave'))) {
            removeClass(
                [].slice.call(this.parent.element.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
            removeClass(
                [].slice.call(this.parent.element.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS + '-last')), cls.INDICATOR_HOVER_CLASS);
        }
    }
    private tapHoldHandler(e: TapEventArgs): void {
        const target: Element = closest((e.originalEvent.target as Element), '.' + cls.PIVOT_BUTTON_CLASS);
        if (!isNullOrUndefined(target) && this.parent.isAdaptive) {
            const pos: OffsetPosition = (target as Element).getBoundingClientRect();
            this.parent.contextMenuModule.fieldElement = target as HTMLElement;
            this.parent.contextMenuModule.menuObj.open(pos.top, pos.left);
            return;
        }
    }

    /**
     *
     * @returns {void}
     * @hidden
     */
    public RefreshFieldsPanel(): void {
        if (this.parent.dataType === 'pivot' && this.parent.groupingBarSettings != null) {
            if (selectAll('#' + this.parent.element.id + '_AllFields', this.parent.element).length > 0) {
                for (const element of selectAll('#' + this.parent.element.id + '_AllFields', this.parent.element)) {
                    element.remove();
                }
            }
            if (this.parent.groupingBarSettings.showFieldsPanel) {
                if (this.groupingChartTable && this.parent.displayOption.view !== 'Table' && this.parent.groupingBarSettings.displayMode !== 'Table') {
                    this.chartPanel = this.createToolbarUI(this.groupingChartTable);
                }
                if (this.groupingTable) {
                    this.gridPanel = this.createToolbarUI(this.groupingTable);
                }
                this.parent.axisFieldModule.render();
                this.refreshUI();
            }
        }
    }
    private createToolbarUI(element: HTMLElement): Toolbar {
        if (select('#' + this.parent.element.id + '_AllFields', element)) {
            (select('#' + this.parent.element.id + '_AllFields', element) as HTMLElement).remove();
        }
        element.prepend(createElement('div', { id: this.parent.element.id + '_AllFields' }));
        const toolbarObj: Toolbar = new Toolbar({
            cssClass: cls.ALL_FIELDS_PANEL_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            enableRtl: this.parent.enableRtl, enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            items: [{ template: '<div class=' + cls.GROUP_ALL_FIELDS_CLASS + '></div>' }],
            allowKeyboard: false,
            width: this.parent.grid ? (this.parent.getGridWidthAsNumber() - 2) : (this.parent.getWidthAsNumber() - 2)
        });
        toolbarObj.appendTo(select('#' + this.parent.element.id + '_AllFields', element) as HTMLElement);
        return toolbarObj;
    }

    /**
     *
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initSubComponent, this.renderLayout, this); //For initial rendering
        this.parent.on(events.uiUpdate, this.appendToElement, this);
    }

    /**
     *
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.uiUpdate, this.appendToElement);
        this.parent.off(events.initSubComponent, this.renderLayout);
    }

    /**
     * To destroy the groupingbar
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.parent.pivotButtonModule) {
            this.parent.pivotButtonModule.destroy();
            this.parent.pivotButtonModule = null;
        }
        if (this.groupingTable && this.groupingTable.querySelector('.' + cls.ALL_FIELDS_PANEL_CLASS) && this.gridPanel != null && !this.gridPanel.isDestroyed) {
            this.gridPanel.destroy();
            this.gridPanel = null;
        }
        if (this.groupingChartTable && this.groupingChartTable.querySelector('.' + cls.ALL_FIELDS_PANEL_CLASS) && this.chartPanel != null && !this.chartPanel.isDestroyed) {
            this.chartPanel.destroy();
            this.chartPanel = null;
        }
        if (this.touchObj && !this.touchObj.isDestroyed) { this.touchObj.destroy(); }
        if (this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
            remove(this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS));
        }
    }
}
