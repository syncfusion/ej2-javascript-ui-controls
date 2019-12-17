import { formatUnit, EventHandler, getValue} from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { ScrollArgs } from '../base/interface';

/**
 * To handle scroll event on chart and from TreeGrid
 * @hidden
 */
export class ChartScroll {
    private parent: Gantt;
    private element: HTMLElement;
    private isFromTreeGrid: boolean;
    public previousScroll: { top: number, left: number } = { top: 0, left: 0 };
    /**
     * Constructor for the scrolling.
     * @hidden
     */
    constructor(parent: Gantt) {
        this.parent = parent;
        this.element = this.parent.ganttChartModule.scrollElement;
        this.addEventListeners();
    }
    /**
     * Bind event
     */
    private addEventListeners(): void {
        this.parent.on('grid-scroll', this.gridScrollHandler, this);
        EventHandler.add(this.element, 'scroll' , this.onScroll, this);
    }
    /**
     * Unbind events
     */
    private removeEventListeners(): void {
        EventHandler.remove(this.element, 'scroll', this.onScroll);
        this.parent.off('grid-scroll', this.gridScrollHandler);
    }
    /**
     * 
     * @param args 
     */
    private gridScrollHandler(args: object): void {
        this.element.scrollTop = getValue('top', args);
        this.isFromTreeGrid = true;
    }
    /**
     * Scroll event handler
     */
    private onScroll(): void {
        let scrollArgs: ScrollArgs = {};
        if (this.element.scrollTop !== this.previousScroll.top) {
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
        }
        scrollArgs.requestType = 'scroll';
        this.parent.trigger('actionComplete', scrollArgs);
    }
    /**
     * To set height for chart scroll container
     * @param height - To set height for scroll container in chart side
     * @private
     */
    public setHeight(height: string | number): void {
        this.element.style.height = formatUnit(height);
    }
    /**
     * To set width for chart scroll container
     * @param width - To set width to scroll container
     * @private
     */
    public setWidth(width: string | number): void {
        this.element.style.width = formatUnit(width);
    }
    /**
     * To set scroll top for chart scroll container
     * @param scrollTop - To set scroll top for scroll container
     * @private
     */
    public setScrollTop(scrollTop: number): void {
        this.element.scrollTop = scrollTop;
    }
    /**
     * To set scroll left for chart scroll container
     * @param scrollLeft  - To set scroll left for scroll container
     */
    public setScrollLeft(scrollLeft: number): void {
        this.element.scrollLeft = scrollLeft;
        this.parent.ganttChartModule.chartTimelineContainer.scrollLeft = this.element.scrollLeft;
        this.previousScroll.left = this.element.scrollLeft;
    }

    /**
     * Destroy scroll related elements and unbind the events
     * @private
     */
    public destroy(): void {
        this.removeEventListeners();
    }
}