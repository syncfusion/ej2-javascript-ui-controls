import { SfPivotView } from './sf-pivotview-fn';
import * as cls from '../common/constants';
import { PivotButton } from '../common/pivot-button';
import { closest, removeClass, EventHandler, Droppable, setStyleAttribute, formatUnit } from '@syncfusion/ej2-base';

/**
 * Module for GroupingBar rendering
 */
export class GroupingBar {
    public parent: SfPivotView;

    constructor(parent: SfPivotView) {
        this.parent = parent;
        this.parent.groupingBarModule = this;
        this.parent.pivotButtonModule = new PivotButton(this.parent);
    }

    public updatePivotButtons(): void {
        this.createPivotButtonDrop();
        this.parent.pivotButtonModule.setPivotButtonDrag();
    }

    private createPivotButtonDrop(): void {
        for (let element of [].slice.call(this.parent.element.querySelectorAll('.' + cls.AXIS_CONTAINER))) {
            let buttonElement: Element = (element as Element).firstElementChild;
            if (this.parent.groupingBarSettings.allowDragAndDrop) {
                new Droppable(buttonElement as HTMLElement, {});
            }
            this.unWireEvent(buttonElement);
            this.wireEvent(buttonElement);
        }
    }

    public refreshUI(): void {
        /* tslint:disable */
        let groupingTable: HTMLElement = this.parent.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS);
        let groupingChartTable: HTMLElement = this.parent.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS);
        if (groupingChartTable) {
            groupingChartTable.style.width = (this.parent.internalGrid as any).element.offsetWidth + 'px';
        }
        if (groupingTable) {
            groupingTable.style.minWidth = '400px';
            let rowPanel: HTMLElement = groupingTable.querySelector('.' + cls.GROUP_ROW_CLASS);
            let valuePanel: HTMLElement = groupingTable.querySelector('.' + cls.GROUP_VALUE_CLASS);
            let columnPanel: HTMLElement = groupingTable.querySelector('.' + cls.GROUP_COLUMN_CLASS);
            let filterPanel: HTMLElement = groupingTable.querySelector('.' + cls.GROUP_FILTER_CLASS);
            let leftAxisPanel: HTMLElement = groupingTable.querySelector('.' + cls.LEFT_AXIS_PANEL_CLASS);
            let rightAxisPanel: HTMLElement = groupingTable.querySelector('.' + cls.RIGHT_AXIS_PANEL_CLASS);
            groupingTable.style.width = (this.parent.element.querySelector('#' + this.parent.element.id + '_grid') as any).offsetWidth + 'px';
            let colGroupElement: HTMLElement = this.parent.element.querySelector('.' + cls.FROZENHEADER_DIV).querySelector('colgroup').children[0] as HTMLElement;
            let rightAxisWidth: string = groupingTable.offsetWidth - parseInt((colGroupElement as HTMLElement).style.width, 10) + 'px';
            leftAxisPanel.style.minWidth = colGroupElement.style.width;
            valuePanel.style.width = (colGroupElement as HTMLElement).style.width;
            rightAxisPanel.style.width = rightAxisWidth;
            if (this.parent.element.querySelector('#' + this.parent.element.id + '_grid')) {
                let emptyRowHeader: HTMLElement = this.parent.element.querySelector('.' + cls.FROZENHEADER_DIV).querySelector('.' + cls.COLUMN_HEADER);
                emptyRowHeader.querySelector('.' + cls.HEADERCELL).classList.add(cls.GROUP_ROW);
                emptyRowHeader.style.height = (emptyRowHeader.querySelector('.' + cls.RESIZE_HANDLER) as HTMLElement).style.height = 'auto';
                if (this.parent.internalGrid.element.querySelector('.' + cls.GROUP_ROW_CLASS) && emptyRowHeader.querySelector('.' + cls.AXIS_ROW_CLASS)) {
                    rowPanel = rowPanel ? rowPanel : this.parent.internalGrid.element.querySelector('.' + cls.GROUP_ROW_CLASS);
                    rowPanel.style.height = 'auto';
                } else {
                    rowPanel.style.height = (this.parent.element.querySelector('.' + cls.HEADERCONTENT) as HTMLElement).offsetHeight + 'px';
                    emptyRowHeader.querySelector('.' + cls.GROUP_ROW).appendChild(groupingTable.querySelector('.' + cls.AXIS_ROW_CLASS));
                }
                (emptyRowHeader.querySelector('.' + cls.GROUP_ROW).querySelector('.' + cls.HEADER_CELL_DIV) as HTMLElement).style.display = 'none';
                (emptyRowHeader.querySelector('.' + cls.GROUP_ROW).querySelector('.' + cls.SORT_FILTER_DIV) as HTMLElement).style.display = 'none';
                let colRowElements: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.' + cls.MOVABLEHEADER_DIV).querySelector('thead').querySelectorAll('tr'));
                let columnRows: HTMLElement[] = colRowElements.filter((trCell: Element) => {
                    return trCell.childNodes.length > 0;
                });
                for (let element of columnRows) {
                    setStyleAttribute(element, { 'height': 'auto' });
                }
                let groupHeight: number = (this.parent.element.querySelector('.' + cls.HEADERCONTENT) as HTMLElement).offsetHeight;
                rowPanel.style.height = groupHeight + 'px';
                columnPanel.style.height = filterPanel.style.height = 'auto';
                let rightPanelHeight: number = (valuePanel.offsetHeight / 2);
                if (rightPanelHeight > columnPanel.offsetHeight) {
                    setStyleAttribute(filterPanel, { height: formatUnit(rightPanelHeight) });
                    setStyleAttribute(columnPanel, { height: formatUnit(rightPanelHeight + 2) });
                }
                if (this.parent.element.querySelector('.' + cls.FROZENHEADER_DIV).querySelector('.' + cls.RESIZE_HANDLER)) {
                    emptyRowHeader.style.height = (this.parent.element.querySelector('.' + cls.FROZENHEADER_DIV).querySelector('.' + cls.RESIZE_HANDLER) as HTMLElement).style.height = groupHeight + 'px';
                }
                /* tslint:enable */
                let colHeight: number = groupHeight / columnRows.length;
                for (let element of columnRows) {
                    setStyleAttribute(element, { 'height': colHeight + 'px' });
                    let rowHeader: HTMLElement[] = [].slice.call(element.querySelectorAll('.' + cls.RESIZE_HANDLER)) as HTMLElement[];
                    for (let handlerElement of rowHeader) {
                        setStyleAttribute(handlerElement, { 'height': (closest(handlerElement, 'th') as HTMLElement).offsetHeight + 'px' });
                    }
                }
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
        /* tslint:disable */
        if ((this.parent.isDragging && (e.target as HTMLElement).classList.contains(cls.DROPPABLE_CLASS) && e.type === 'mouseover') ||
            e.type === 'mouseleave') {
            removeClass([].slice.call(this.parent.element.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(this.parent.element.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS + '-last')), cls.INDICATOR_HOVER_CLASS);
        }
        /* tslint:enable */
    }

    public destroy(): void {
        for (let element of [].slice.call(this.parent.element.querySelectorAll('.' + cls.AXIS_CONTAINER))) {
            this.unWireEvent((element as Element).firstElementChild);
        }
    }
}