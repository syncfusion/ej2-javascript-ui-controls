import { EventHandler, Browser } from '@syncfusion/ej2-base';
import { debounce } from '@syncfusion/ej2-base';
import { SentinelInfo, SentinelType } from './virtual-scroll';
import { InterSection } from './interfaces';
export type ScrollDirection = 'up' | 'down' | 'right' | 'left';
/**
 * InterSectionObserver - class watch whether it enters the viewport.
 * @hidden
 */
export class InterSectionObserver {
    private containerRect: ClientRect;
    private element: HTMLElement;
    private fromWheel: boolean = false;
    private touchMove: boolean = false;
        /** @hidden */
    public options: InterSection = {};
    public sentinelInfo: SentinelInfo = {
        'up': {
            check: (rect: ClientRect, info: SentinelType) => {
                let top: number = rect.top - this.containerRect.top;
                info.entered = top >= 0;
                return top + (this.options.pageHeight / 2) >= 0;
            },
            axis: 'Y'
        },
        'down': {
            check: (rect: ClientRect, info: SentinelType) => {
                let cHeight: number = this.options.container.clientHeight;
                let top: number = rect.bottom;
                info.entered = rect.bottom <= this.containerRect.bottom;
                return top - (this.options.pageHeight / 2) <= this.options.pageHeight / 2;
            }, axis: 'Y'
        },
        'right': {
            check: (rect: ClientRect, info: SentinelType) => {
                let right: number = rect.right;
                info.entered = right < this.containerRect.right;
                return right - this.containerRect.width <= this.containerRect.right;
            }, axis: 'X'
        },
        'left': {
            check: (rect: ClientRect, info: SentinelType) => {
                let left: number = rect.left;
                info.entered = left > 0;
                return left + this.containerRect.width >= this.containerRect.left;
            }, axis: 'X'
        }
    };
    constructor(element: HTMLElement, options: InterSection) {
        this.element = element;
        this.options = options;
    }

    public observe(callback: Function, onEnterCallback: Function): void {
        this.containerRect = this.options.container.getBoundingClientRect();
        EventHandler.add(this.options.container, 'wheel', () => this.fromWheel = true, this);
        EventHandler.add(this.options.container, 'scroll', this.virtualScrollHandler(callback, onEnterCallback), this);
    }

    public check(direction: ScrollDirection): boolean {
        let info: SentinelType = this.sentinelInfo[direction];
        return info.check(this.element.getBoundingClientRect(), info);
    }

    private virtualScrollHandler(callback: Function, onEnterCallback: Function): Function {
        let delay: number = Browser.info.name === 'chrome' ? 200 : 100;
        let prevTop: number = 0; let prevLeft: number = 0; let debounced100: Function = debounce(callback, delay);
        let debounced50: Function = debounce(callback, 50);
        return (e: Event) => {
            let top: number = (<HTMLElement>e.target).scrollTop;
            let left: number = (<HTMLElement>e.target).scrollLeft;
            let direction: ScrollDirection = prevTop < top ? 'down' : 'up';
            direction = prevLeft === left ? direction : prevLeft < left ? 'right' : 'left';
            prevTop = top; prevLeft = left;

            let current: SentinelType = this.sentinelInfo[direction];

            if (this.options.axes.indexOf(current.axis) === -1) {
                return;
            }

            let check: boolean = this.check(direction);
            if (current.entered) {
                onEnterCallback(this.element, current, direction, { top: top, left: left }, this.fromWheel, check);
            }

            if (check) {
                let fn: Function = debounced100;
                //this.fromWheel ? this.options.debounceEvent ? debounced100 : callback : debounced100;
                if (current.axis === 'X') { fn = debounced50; }
                fn({ direction: direction, sentinel: current, offset: { top: top, left: left },
                    focusElement: document.activeElement});
            }
            this.fromWheel = false;
        };
    }

    public setPageHeight(value: number): void {
        this.options.pageHeight = value;
    }
}
