import { EventHandler, formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { SfSchedule } from '../../schedule';
import { ViewBase } from './view-base';
import { IRenderer, NotifyEventArgs } from '../base/interface';
import * as util from '../base/util';
import * as cls from '../base/css-constant';

/**
 * year and timeline year view
 */
export class Year extends ViewBase implements IRenderer {
    public isInverseTableSelect: boolean = false;

    constructor(parent: SfSchedule) {
        super(parent);
    }

    public renderLayout(): void {
        this.element = this.parent.element.querySelector('.' + cls.TABLE_WRAP_CLASS);
        if (this.parent.options.currentView === 'TimelineYear') {
            let workCells: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.e-work-cells:not(.e-other-month)'));
            for (let cell of workCells) {
                EventHandler.clearEvents(cell);
                this.wireEvents(cell, 'cell');
            }
        }
        this.wireEvents(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), 'scroll');
        this.parent.setDimensions();
    }

    public onContentScroll(e: Event): void {
        let target: HTMLElement = e.target as HTMLElement;
        if (isNullOrUndefined(this.element)) {
            this.element = target;
        }
        let headerWrapper: HTMLElement = this.getDatesHeaderElement();
        if (headerWrapper) {
            (<HTMLElement>headerWrapper.firstElementChild).scrollLeft = target.scrollLeft;
        }
        let scrollTopSelector: string = `.${cls.MONTH_HEADER_WRAPPER},.${cls.RESOURCE_COLUMN_WRAP_CLASS}`;
        let scrollTopElement: HTMLElement = this.element.querySelector(scrollTopSelector) as HTMLElement;
        if (scrollTopElement) {
            scrollTopElement.scrollTop = target.scrollTop;
        }
    }

    public onScrollUiUpdate(args: NotifyEventArgs): void {
        let height: number = this.parent.element.offsetHeight - this.getHeaderBarHeight();
        let headerWrapper: HTMLElement = this.element.querySelector('.' + cls.DATE_HEADER_CONTAINER_CLASS) as HTMLElement;
        if (headerWrapper) {
            height -= headerWrapper.offsetHeight;
        }
        let contentWrapper: HTMLElement = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
        if (contentWrapper) {
            contentWrapper.style.height = formatUnit(height);
        }
        let leftPanelSelector: string = `.${cls.MONTH_HEADER_WRAPPER},.${cls.RESOURCE_COLUMN_WRAP_CLASS}`;
        let leftPanelElement: HTMLElement = this.element.querySelector(leftPanelSelector) as HTMLElement;
        if (leftPanelElement) {
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(contentWrapper));
        }
        if (!this.parent.isAdaptive && headerWrapper) {
            let scrollBarWidth: number = util.getScrollBarWidth();
            // tslint:disable:no-any
            if (contentWrapper.offsetWidth - contentWrapper.clientWidth > 0) {
                (headerWrapper.firstElementChild as HTMLElement).style[<any>args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
                headerWrapper.style[<any>args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
            } else {
                (headerWrapper.firstElementChild as HTMLElement).style[<any>args.cssProperties.border] = '';
                headerWrapper.style[<any>args.cssProperties.padding] = '';
            }
            // tslint:enable:no-any
        }
        this.setColWidth(this.getContentAreaElement());
    }

    public onDataReady(): void {
        if (this.parent.options.currentView === 'TimelineYear') {
            this.element = this.parent.element.querySelector('.' + cls.TABLE_WRAP_CLASS);
            let workCell: HTMLElement = this.element.querySelector('.e-work-cells');
            let cellDetail: object = workCell.getBoundingClientRect();
            let cellHeight: number = (<{ [key: string]: Object }>cellDetail).height as number;
            let cellWidth: number = (<{ [key: string]: Object }>cellDetail).width as number;
            let cellHeader: number = util.getOuterHeight(workCell.querySelector('.e-date-header'));
            let eventTable: Element = this.element.querySelector('.e-event-table');
            let eventHeight: number = util.getElementHeightFromClass(eventTable, 'e-appointment');
            let EVENT_GAP: number = 2;
            let leftValue: number;
            let rightValue: number;
            let appointments: NodeListOf<HTMLElement> = this.element.querySelectorAll('.e-appointment, .e-more-indicator');
            for (let i: number = 0; i < appointments.length; i++) {
                let ele: HTMLElement = appointments[i];
                let cellData: HTMLTableCellElement;
                let cellTop: number;
                let height: number;
                let width: number;
                let levelIndex: number = parseInt(ele.getAttribute('data-level'), 10);
                if (this.parent.activeViewOptions.group.resources != null &&
                    this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                    cellData = this.element.querySelector('.e-work-cells' + '[data-date="' + ele.getAttribute('data-date') + '"]' +
                        '[data-group-index="' + ele.getAttribute('data-group-index') + '"]');
                } else {
                    cellData = this.element.querySelector('.e-work-cells' + '[data-date="' + ele.getAttribute('data-date') + '"]');
                }
                if (this.parent.options.enableRtl) {
                    rightValue = cellData.cellIndex * cellWidth;
                } else {
                    leftValue = cellData.cellIndex * cellWidth;
                }
                if (!isNullOrUndefined(cellData)) {
                    if (ele.classList.contains('e-appointment')) {
                        cellTop = cellData.offsetTop + cellHeader + (eventHeight * levelIndex) + EVENT_GAP;
                        height = eventHeight;
                        width = cellWidth - 2;
                        this.parent.eventBase.wireAppointmentEvents(ele);
                    } else {
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
    }

    public getEndDateFromStartDate(start: Date): Date {
        let date: Date = new Date(start.getTime());
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            date = util.lastDateOfMonth(date);
        }
        return util.addDays(new Date(date.getTime()), 1);
    }

    public wireEvents(element: HTMLElement, type: string): void {
        if (type === 'cell') {
            if (this.parent.options.currentView === 'TimelineYear') {
                EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
                if (!this.parent.isAdaptive) {
                    EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
                }
            }
        } else {
            EventHandler.add(element, 'scroll', this.onContentScroll, this);
        }
    }

    public destroy(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            this.element = null;
        }
    }
}
