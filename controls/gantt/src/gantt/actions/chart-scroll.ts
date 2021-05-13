import { formatUnit, EventHandler, getValue, isNullOrUndefined} from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { ScrollArgs } from '../base/interface';

/**
 * To handle scroll event on chart and from TreeGrid
 *
 * @hidden
 */
export class ChartScroll {
    private parent: Gantt;
    private element: HTMLElement;
    private isFromTreeGrid: boolean;
    public previousScroll: { top: number, left: number } = { top: 0, left: 0 };
    /**
     * Constructor for the scrolling.
     *
     * @param {Gantt} parent .
     * @hidden
     */
    constructor(parent: Gantt) {
        this.parent = parent;
        this.element = this.parent.ganttChartModule.scrollElement;
        this.addEventListeners();
    }
    /**
     * Bind event
     *
     * @returns {void} .
     */
    private addEventListeners(): void {
        this.parent.on('grid-scroll', this.gridScrollHandler, this);
        EventHandler.add(this.element, 'scroll' , this.onScroll, this);
    }
    /**
     * Unbind events
     *
     * @returns {void} .
     */
    private removeEventListeners(): void {
        EventHandler.remove(this.element, 'scroll', this.onScroll);
        this.parent.off('grid-scroll', this.gridScrollHandler);
    }
    /**
     *
     * @param {object} args .
     * @returns {void} .
     */
    private gridScrollHandler(args: object ): void {
        this.element.scrollTop = getValue('top', args);
        this.isFromTreeGrid = true;
    }
    /**
     * Method to update vertical grid line, holiday, event markers and weekend container's left position on scroll action
     *
     * @returns {void} .
     */
    private updateLeftPosition(): void {
        if (!isNullOrUndefined(this.parent.dayMarkersModule)) {
            const holidayContainer: HTMLElement = getValue('nonworkingDayRender.holidayContainer', this.parent.dayMarkersModule);
            const weekendContainer: HTMLElement = getValue('nonworkingDayRender.weekendContainer', this.parent.dayMarkersModule);
            const eventMarkersContainer: HTMLElement = getValue('eventMarkerRender.eventMarkersContainer', this.parent.dayMarkersModule);
            if (holidayContainer) {
                holidayContainer.style.left = -this.element.scrollLeft + 'px';
            }
            if (weekendContainer) {
                weekendContainer.style.left = -this.element.scrollLeft + 'px';
            }
            if (eventMarkersContainer) {
                eventMarkersContainer.style.left = -this.element.scrollLeft + 'px';
            }
        }
        if (this.parent.chartVerticalLineContainer) {
            this.parent.chartVerticalLineContainer.style.left = -this.element.scrollLeft + 'px';
        }
    }
    /**
     * Scroll event handler
     *
     * @returns {void} .
     */
    private onScroll(): void {
        const scrollArgs: ScrollArgs = {};
        if (this.element.scrollTop !== this.previousScroll.top) {
            // eslint-disable-next-line
            !this.isFromTreeGrid ? this.parent.notify('chartScroll', { top: this.element.scrollTop }) : (this.isFromTreeGrid = false);
            scrollArgs.previousScrollTop = this.previousScroll.top;
            this.previousScroll.top = this.element.scrollTop;
            scrollArgs.scrollTop = this.element.scrollTop;
            scrollArgs.scrollDirection = 'Vertical';
            scrollArgs.action = 'VerticalScroll';
        }
        if (this.element.scrollLeft !== this.previousScroll.left) {
            this.parent.ganttChartModule.chartTimelineContainer.scrollLeft = this.element.scrollLeft;
            scrollArgs.previousScrollLeft = this.previousScroll.left;
            this.previousScroll.left = this.element.scrollLeft;
            scrollArgs.scrollLeft = this.element.scrollLeft;
            scrollArgs.scrollDirection = 'Horizontal';
            scrollArgs.action = 'HorizontalScroll';
            this.updateLeftPosition();
        }
        scrollArgs.requestType = 'scroll';
        this.parent.trigger('actionComplete', scrollArgs);
    }
    /**
     * To set height for chart scroll container
     *
     * @param {string | number} height - To set height for scroll container in chart side
     * @returns {void} .
     * @private
     */
    public setHeight(height: string | number): void {
        this.element.style.height = formatUnit(height);
    }
    /**
     * To set width for chart scroll container
     *
     * @param {string | number} width - To set width to scroll container
     * @returns {void} .
     * @private
     */
    public setWidth(width: string | number): void {
        this.element.style.width = formatUnit(width);
    }
    /**
     * To set scroll top for chart scroll container
     *
     * @param {number} scrollTop - To set scroll top for scroll container
     * @returns {void} .
     * @private
     */
    public setScrollTop(scrollTop: number): void {
        this.element.scrollTop = scrollTop;
    }
    /**
     * To set scroll left for chart scroll container
     *
     * @param {number} scrollLeft  - To set scroll left for scroll container
     * @returns {void} .
     */
    public setScrollLeft(scrollLeft: number): void {
        this.element.scrollLeft = scrollLeft;
        this.parent.ganttChartModule.chartTimelineContainer.scrollLeft = this.element.scrollLeft;
        this.previousScroll.left = this.element.scrollLeft;
    }

    /**
     * Destroy scroll related elements and unbind the events
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        this.removeEventListeners();
    }
}
