import { EventHandler, Browser } from '@syncfusion/ej2-base';
import { debounce } from '@syncfusion/ej2-base';
import { SentinelInfo, SentinelType } from '../base/type';
import { InterSection } from '../base/interface';
export type ScrollDirection = 'up' | 'down' | 'right' | 'left';
/**
 * InterSectionObserver - class watch whether it enters the viewport.
 *
 * @hidden
 */
export class InterSectionObserver {
    private containerRect: ClientRect;
    private element: HTMLElement;
    private movableEle: HTMLElement;
    private fromWheel: boolean = false;
    private touchMove: boolean = false;
    private options: InterSection = {};
    public sentinelInfo: SentinelInfo = {
        'up': {
            check: (rect: ClientRect, info: SentinelType) => {
                const top: number = rect.top - this.containerRect.top;
                const bottom: number = this.containerRect.bottom > rect.bottom ? this.containerRect.bottom - rect.bottom : 0;
                info.entered = top >= 0;
                return top + (this.options.pageHeight / 2) >= 0 || (bottom > 0 && rect.bottom > 0);
            },
            axis: 'Y'
        },
        'down': {
            check: (rect: ClientRect, info: SentinelType) => {
                const bottom: number = rect.bottom;
                info.entered = rect.bottom <= this.containerRect.bottom;
                return ((bottom - this.containerRect.top) - (this.options.pageHeight / 2)) <= this.options.pageHeight / 2;
            }, axis: 'Y'
        },
        'right': {
            check: (rect: ClientRect, info: SentinelType) => {
                const right: number = rect.right;
                info.entered = right < this.containerRect.right;
                return right - this.containerRect.width <= this.containerRect.right;
            }, axis: 'X'
        },
        'left': {
            check: (rect: ClientRect, info: SentinelType) => {
                const left: number = rect.left;
                info.entered = left > 0;
                return left + this.containerRect.width >= this.containerRect.left;
            }, axis: 'X'
        }
    };
    constructor(element: HTMLElement, options: InterSection, movableEle?: HTMLElement) {
        this.element = element;
        this.options = options;
        this.movableEle = movableEle;
    }

    public observe(callback: Function, onEnterCallback: Function): void {
        this.containerRect = this.options.container.getBoundingClientRect();
        EventHandler.add(this.options.container, 'wheel', () => this.fromWheel = true, this);
        EventHandler.add(this.options.container, 'scroll', this.virtualScrollHandler(callback, onEnterCallback), this);
    }

    public check(direction: ScrollDirection): boolean {
        const info: SentinelType = this.sentinelInfo[`${direction}`];
        return info.check(this.element.getBoundingClientRect(), info);
    }

    private virtualScrollHandler(callback: Function, onEnterCallback: Function): Function {
        const delay: number = Browser.info.name === 'chrome' ? 200 : 100;
        const debounced100: Function = debounce(callback, delay);
        const debounced50: Function = debounce(callback, 50);
        this.options.prevTop = this.options.prevLeft = 0;
        return (e: Event) => {
            const top: number = (<HTMLElement>e.target).scrollTop;
            const left: number = (<HTMLElement>e.target).scrollLeft;
            let direction: ScrollDirection = this.options.prevTop < top ? 'down' : 'up';
            direction = this.options.prevLeft === left ? direction : this.options.prevLeft < left ? 'right' : 'left';
            this.options.prevTop = top; this.options.prevLeft = left;

            const current: SentinelType = this.sentinelInfo[`${direction}`];

            if (this.options.axes.indexOf(current.axis) === -1) {
                return;
            }

            this.containerRect = this.options.container.getBoundingClientRect();
            const check: boolean = this.check(direction);
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
