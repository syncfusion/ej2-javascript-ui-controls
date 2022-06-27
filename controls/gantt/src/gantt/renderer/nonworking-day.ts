/**
 * To render holidays and weekends in Gantt
 */
import { Gantt } from '../base/gantt';
import { createElement, formatUnit, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';

export class NonWorkingDay {
    private parent: Gantt;
    public nonworkingContainer: HTMLElement;
    private holidayContainer: HTMLElement;
    private weekendContainer: HTMLElement;
    private weekendWidthUpdated: boolean = false;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        this.nonworkingContainer = null;
        this.holidayContainer = null;
        this.weekendContainer = null;
    }
    /**
     * Method append nonworking container
     *
     * @returns {void} .
     */
    private createNonworkingContainer(): void {
        if (!this.parent.ganttChartModule.chartBodyContent.contains(this.nonworkingContainer)) {
            this.nonworkingContainer = createElement('div', {
                className: cls.nonworkingContainer
            });
            this.nonworkingContainer.setAttribute("role","NonWorkingDays")
            this.parent.ganttChartModule.chartBodyContent.appendChild(this.nonworkingContainer);
        }
    }
    /**
     * calculation for holidays rendering.
     *
     * @returns {void} .
     * @private
     */
    public renderHolidays(): void {
        if (this.parent.holidays && this.parent.holidays.length > 0) {
            this.createNonworkingContainer();
            if (!this.nonworkingContainer.contains(this.holidayContainer)) {
                this.holidayContainer = createElement('div', {
                    className: cls.holidayContainer
                });
                this.nonworkingContainer.appendChild(this.holidayContainer);
            }
            this.holidayContainer.innerHTML = this.getHolidaysElement().innerHTML;
        } else if (this.holidayContainer && this.holidayContainer.parentNode) {
            remove(this.holidayContainer);
            if (this.nonworkingContainer && this.nonworkingContainer.childNodes.length === 0) {
                remove(this.nonworkingContainer);
            }
        }
    }
    /**
     * Method to return holidays as html string
     *
     * @returns {HTMLElement} .
     */
    private getHolidaysElement(): HTMLElement {
        let fromDate: Date;
        let toDate: Date;
        const container: HTMLElement = createElement('div');
        const height: number = this.parent.contentHeight;
        let toolbarHeight: number = 0;
        if(!isNullOrUndefined(this.parent.toolbarModule)) {
           toolbarHeight =  this.parent.toolbarModule.element.offsetHeight 
        }
        const viewportHeight: number = this.parent.ganttHeight- toolbarHeight-this.parent.ganttChartModule.chartTimelineContainer.offsetHeight; 
        for (let i: number = 0; i < this.parent.holidays.length; i++) {
            if (this.parent.holidays[i].from && this.parent.holidays[i].to) {
                fromDate = this.parent.dateValidationModule.getDateFromFormat(this.parent.holidays[i].from);
                toDate = this.parent.dateValidationModule.getDateFromFormat(this.parent.holidays[i].to);
                toDate.setDate(toDate.getDate() + 1);
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(0, 0, 0, 0);
            } else if (this.parent.holidays[i].from) {
                fromDate = this.parent.dateValidationModule.getDateFromFormat(this.parent.holidays[i].from);
                fromDate.setHours(0, 0, 0, 0);
            } else if (this.parent.holidays[i].to) {
                fromDate = this.parent.dateValidationModule.getDateFromFormat(this.parent.holidays[i].to);
                fromDate.setHours(0, 0, 0, 0);
            }
            const width: number = (this.parent.holidays[i].from && this.parent.holidays[i].to) ?
                this.parent.dataOperation.getTaskWidth(fromDate, toDate) : this.parent.perDayWidth;
            const left: number = this.parent.dataOperation.getTaskLeft(fromDate, false);
            const holidayDiv: HTMLElement = createElement('div', {
                className: cls.holidayElement, styles: `left:${left}px; width:${width}px; height:100%;`
            });
            const spanTop: number = (viewportHeight < height) ? viewportHeight / 2 : height / 2;
            const spanElement: HTMLElement = createElement('span', {
                className: cls.holidayLabel, styles: `top:${spanTop}px;left:${(width / 2)}px;`
            });
            const property: string = this.parent.disableHtmlEncode ? 'textContent' : 'innerHTML';
            spanElement[property] = this.parent.holidays[i].label ? this.parent.holidays[i].label : '';
            holidayDiv.appendChild(spanElement);
            if (this.parent.holidays[i].cssClass) {
                holidayDiv.classList.add(this.parent.holidays[i].cssClass);
            }
            container.appendChild(holidayDiv);
        }
        return container;
    }
    /**
     * @returns {void} .
     * @private
     */
    public renderWeekends(): void {
        if (this.parent.highlightWeekends) {
            this.createNonworkingContainer();
            if (!this.nonworkingContainer.contains(this.weekendContainer)) {
                this.weekendContainer = createElement('div', {
                    className: cls.weekendContainer
                });
                this.nonworkingContainer.appendChild(this.weekendContainer);
            }
            this.weekendContainer.innerHTML = this.getWeekendElements().innerHTML;
        } else if (this.weekendContainer) {
            remove(this.weekendContainer);
            if (this.nonworkingContainer && this.nonworkingContainer.childNodes.length === 0) {
                remove(this.nonworkingContainer);
            }
        }
    }
    /**
     * Method to get weekend html string
     *
     * @returns {HTMLElement} .
     */
    private getWeekendElements(): HTMLElement {
        const container: HTMLElement = createElement('div');
        const startDate: Date = new Date(this.parent.timelineModule.timelineStartDate.getTime());
        const endDate: Date = new Date(this.parent.timelineModule.timelineEndDate.getTime());
        const nonWorkingIndex: number[] = this.parent.nonWorkingDayIndex;
        let isFirstCell: boolean = true;
        do {
            if (nonWorkingIndex.indexOf(startDate.getDay()) !== -1) {
                const left: number = this.parent.dataOperation.getTaskLeft(startDate, false);
                let width: number = this.parent.perDayWidth;
                if (isFirstCell) {
                    const start: Date =  new Date(startDate.getTime());
                    const tempEnd: Date = new Date(start.getTime());
                    tempEnd.setDate(tempEnd.getDate() + 1);
                    tempEnd.setHours(0, 0, 0, 0);
                    width = this.parent.dataOperation.getTaskWidth(start, tempEnd);
                    isFirstCell = false;
                }
                let sDate: Date = new Date(startDate);
                sDate.setDate(sDate.getDate() +1);
                if (sDate.getTimezoneOffset() != this.parent.timelineModule.timelineStartDate.getTimezoneOffset() && !this.weekendWidthUpdated) {
                    if (this.parent.timelineModule.bottomTier == 'Hour' && this.parent.timelineSettings.bottomTier.count === 1) {
                        width = width - this.parent.timelineSettings.timelineUnitSize;
                        this.weekendWidthUpdated = true;
                    }
                }
                const weekendDiv: HTMLElement = createElement('div', {
                    className: cls.weekend, styles: `left:${left}px;width:${width}px;height:100%;`
                });
                container.appendChild(weekendDiv);
            }
            startDate.setDate(startDate.getDate() + 1);
            startDate.setHours(0, 0, 0, 0);
        } while (startDate < endDate);
        return container;
    }

    private updateHolidayLabelHeight(): void {
        const height: number = this.parent.getContentHeight();
        let toolbarHeight: number = 0;
        if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
           toolbarHeight =  this.parent.toolbarModule.element.offsetHeight 
        }
        const viewportHeight: number =  this.parent.ganttHeight - toolbarHeight - this.parent.ganttChartModule.chartTimelineContainer.offsetHeight;
        const top: number = (viewportHeight < height) ? viewportHeight / 2 : height / 2;
        const labels: NodeList = this.holidayContainer.querySelectorAll('.' + cls.holidayLabel);
        for (let i: number = 0; i < labels.length; i++) {
            (labels[i] as HTMLElement).style.top = formatUnit(top);
        }
    }
    /**
     * Method to update height for all internal containers
     *
     * @returns {void} .
     * @private
     */
    public updateContainerHeight(): void {
        const height: number = this.parent.getContentHeight();
        if (this.holidayContainer) {
            this.holidayContainer.style.height = formatUnit(height);
            this.updateHolidayLabelHeight();
        }
        if (this.weekendContainer) {
            this.weekendContainer.style.height = formatUnit(height);
        }
    }
    /**
     * Method to remove containers of holiday and weekend
     *
     * @returns {void} .
     */
    public removeContainers(): void {
        if (this.holidayContainer) {
            remove(this.holidayContainer);
        }
        if (this.weekendContainer) {
            remove(this.weekendContainer);
        }
        if (this.nonworkingContainer) {
            remove(this.nonworkingContainer);
        }
    }
}
