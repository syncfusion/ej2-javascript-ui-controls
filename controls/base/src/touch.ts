import { extend } from './util';
import { Property, Complex, NotifyPropertyChanges, INotifyPropertyChanged, Event } from './notify-property-change';
import { Browser } from './browser';
import { Base, EmitType } from './base';
import { ChildProperty } from './child-property';
import { EventHandler, BaseEventArgs } from './event-handler';
import { TouchModel, SwipeSettingsModel } from './touch-model';

/**
 * SwipeSettings is a framework module that provides support to handle swipe event like swipe up, swipe right, etc..,
 */
export class SwipeSettings extends ChildProperty<SwipeSettings> {
    /**
     * Property specifies minimum distance of swipe moved.
     */
    @Property(50)
    public swipeThresholdDistance: number;
}

const swipeRegex: RegExp = /(Up|Down)/;

/**
 * Touch class provides support to handle the touch event like tap, double tap, tap hold, etc..,  
 * ```typescript
 *    let node: HTMLElement;
 * let touchObj: Touch = new Touch({
 *    element: node,
 *    tap: function (e) {
 *        // tap handler function code
 *    }
 *    tapHold: function (e) {
 *        // tap hold handler function code
 *    }
 *    scroll: function (e) {
 *        // scroll handler function code
 *    }
 *    swipe: function (e) {
 *        // swipe handler function code
 *    }
 * });
 * ```   
 */
@NotifyPropertyChanges
export class Touch extends Base<HTMLElement> implements INotifyPropertyChanged {

    //Internal Variables
    private isTouchMoved: boolean;
    private startPoint: Points;
    private movedPoint: Points;
    private endPoint: Points;
    private startEventData: MouseEventArgs | TouchEventArgs;
    private lastTapTime: number;
    private lastMovedPoint: Points;
    private scrollDirection: string;
    private hScrollLocked: boolean;
    private vScrollLocked: boolean;
    private defaultArgs: TapEventArgs;
    private distanceX: number;
    private distanceY: number;
    private movedDirection: string;
    private tStampStart: number;
    private touchAction: boolean = true;
    /* tslint:disable no-any */
    private timeOutTap: any;
    private modeClear: any;
    private timeOutTapHold: any;
    /* tslint:enable no-any */

    /* Properties */

    /**
     * Specifies the callback function for tap event.
     * @event
     */
    @Event()
    public tap: EmitType<TapEventArgs>;

    /**
     * Specifies the callback function for tapHold event.
     * @event
     */
    @Event()
    public tapHold: EmitType<TapEventArgs>;

    /**
     * Specifies the callback function for swipe event.
     * @event
     */
    @Event()
    public swipe: EmitType<SwipeEventArgs>;

    /**
     * Specifies the callback function for scroll event.
     * @event
     */
    @Event()
    public scroll: EmitType<ScrollEventArgs>;

    /**
     * Specifies the time delay for tap.
     * @default 350
     */
    @Property(350)
    public tapThreshold: number;

    /**
     * Specifies the time delay for tap hold.
     * @default 750
     */
    @Property(750)
    public tapHoldThreshold: number;

    /**
     * Customize the swipe event configuration.
     * @default { swipeThresholdDistance: 50 }
     */
    @Complex<SwipeSettingsModel>({}, SwipeSettings)
    public swipeSettings: SwipeSettingsModel;

    private tapCount: number = 0;

    /* End-Properties */
    constructor(element: HTMLElement, options?: TouchModel) {
        super(options, element);
        this.bind();
    }

    // triggers when property changed 
    /**
     * @private
     * @param newProp 
     * @param oldProp 
     */
    public onPropertyChanged(newProp: TouchModel, oldProp: TouchModel): void {
        //No Code to handle
    }

    protected bind(): void {
        this.wireEvents();
        if (Browser.isIE) { this.element.classList.add('e-block-touch'); }
    }

    /**
     * To destroy the touch instance.
     * @return {void}
     */
    public destroy(): void {
        this.unwireEvents();
        super.destroy();
    }

    // Need to changes the event binding once we updated the event handler.
    private wireEvents(): void {
        EventHandler.add(this.element, Browser.touchStartEvent, this.startEvent, this);
    }

    private unwireEvents(): void {
        EventHandler.remove(this.element, Browser.touchStartEvent, this.startEvent);
    }

    /**
     * Returns module name as touch
     * @returns {string}
     * @private
     */
    public getModuleName(): string {
        return 'touch';
    }

    /**
     * Returns if the HTML element is Scrollable.
     * @param {HTMLElement} element - HTML Element to check if Scrollable.
     * @returns {boolean}
     */
    private isScrollable(element: HTMLElement): boolean {
        let eleStyle: CSSStyleDeclaration = getComputedStyle(element);
        let style: string = eleStyle.overflow + eleStyle.overflowX + eleStyle.overflowY;
        if ((/(auto|scroll)/).test(style)) { return true; }
        return false;
    }

    private startEvent: Function = (evt: MouseEventArgs | TouchEventArgs): void => {
        if (this.touchAction === true) {
            let point: MouseEventArgs | TouchEventArgs = this.updateChangeTouches(evt);
            if (evt.changedTouches !== undefined) {
                this.touchAction = false;
            }
            this.isTouchMoved = false;
            this.movedDirection = '';
            this.startPoint = this.lastMovedPoint = { clientX: point.clientX, clientY: point.clientY };
            this.startEventData = point;
            this.hScrollLocked = this.vScrollLocked = false;
            this.tStampStart = Date.now();
            this.timeOutTapHold = setTimeout(() => { this.tapHoldEvent(evt); }, this.tapHoldThreshold);
            EventHandler.add(this.element, Browser.touchMoveEvent, this.moveEvent, this);
            EventHandler.add(this.element, Browser.touchEndEvent, this.endEvent, this);
            EventHandler.add(this.element, Browser.touchCancelEvent, this.cancelEvent, this);
        }
    }

    private moveEvent: Function = (evt: MouseEventArgs | TouchEventArgs): void => {
        let point: MouseEventArgs | TouchEventArgs = this.updateChangeTouches(evt);
        this.movedPoint = point;
        this.isTouchMoved = !(point.clientX === this.startPoint.clientX && point.clientY === this.startPoint.clientY);
        let eScrollArgs: Object = {};
        if (this.isTouchMoved) {
            clearTimeout(this.timeOutTapHold);
            this.calcScrollPoints(evt);
            let scrollArg: ScrollEventArgs = {
                startEvents: this.startEventData,
                originalEvent: evt, startX: this.startPoint.clientX,
                startY: this.startPoint.clientY, distanceX: this.distanceX,
                distanceY: this.distanceY, scrollDirection: this.scrollDirection,
                velocity: this.getVelocity(point)
            };
            eScrollArgs = extend(eScrollArgs, {}, scrollArg);
            this.trigger('scroll', eScrollArgs);
            this.lastMovedPoint = { clientX: point.clientX, clientY: point.clientY };
        }
    }

    private cancelEvent: Function = (evt: MouseEventArgs | TouchEventArgs): void => {
        clearTimeout(this.timeOutTapHold);
        clearTimeout(this.timeOutTap);
        this.tapCount = 0;
        this.swipeFn(evt);
        EventHandler.remove(this.element, Browser.touchCancelEvent, this.cancelEvent);
    }

    private tapHoldEvent(evt: MouseEvent | TouchEventArgs): void {
        this.tapCount = 0;
        this.touchAction = true;
        let eTapArgs: TapEventArgs;
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.moveEvent);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.endEvent);
        eTapArgs = { originalEvent: <TouchEventArgs>evt };
        this.trigger('tapHold', eTapArgs);
        EventHandler.remove(this.element, Browser.touchCancelEvent, this.cancelEvent);
    }

    private endEvent: Function = (evt: MouseEventArgs | TouchEventArgs): void => {
        this.swipeFn(evt);
        if (!this.isTouchMoved) {
            if (typeof this.tap === 'function') {
                this.trigger('tap', { originalEvent: evt, tapCount: ++this.tapCount });
                this.timeOutTap = setTimeout(
                    () => {
                        this.tapCount = 0;
                    },
                    this.tapThreshold);
            }
        }
        this.modeclear();
    }

    private swipeFn: Function = (evt: MouseEventArgs | TouchEventArgs): void => {
        clearTimeout(this.timeOutTapHold);
        clearTimeout(this.timeOutTap);
        let point: MouseEventArgs | TouchEventArgs = this.updateChangeTouches(evt);
        let diffX: number = point.clientX - this.startPoint.clientX;
        let diffY: number = point.clientY - this.startPoint.clientY;
        diffX = Math.floor(diffX < 0 ? -1 * diffX : diffX);
        diffY = Math.floor(diffY < 0 ? -1 * diffY : diffX);
        this.isTouchMoved = diffX > 1 || diffY > 1;
        this.endPoint = point;
        this.calcPoints(evt);
        let swipeArgs: SwipeEventArgs = {
            originalEvent: evt,
            startEvents: this.startEventData,
            startX: this.startPoint.clientX,
            startY: this.startPoint.clientY,
            distanceX: this.distanceX, distanceY:
                this.distanceY, swipeDirection: this.movedDirection,
            velocity: this.getVelocity(point)
        };
        if (this.isTouchMoved) {
            let eSwipeArgs: Object;
            let tDistance: number = this.swipeSettings.swipeThresholdDistance;
            eSwipeArgs = extend(eSwipeArgs, this.defaultArgs, swipeArgs);
            let canTrigger: boolean = false;
            let ele: HTMLElement = this.element;
            let scrollBool: boolean = this.isScrollable(ele);
            let moved: boolean = swipeRegex.test(this.movedDirection);
            if ((tDistance < this.distanceX && !moved) || (tDistance < this.distanceY && moved)) {
                if (!scrollBool) {
                    canTrigger = true;
                } else {
                    canTrigger = this.checkSwipe(ele, moved);
                }
            }
            if (canTrigger) {
                this.trigger('swipe', eSwipeArgs);
            }
        }
        this.modeclear();
    }

    private modeclear: Function = (): void => {
        this.modeClear = setTimeout(
            () => {
                this.touchAction = true;
            },
            (typeof this.tap !== 'function' ? 0 : 20));
        this.lastTapTime = new Date().getTime();
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.moveEvent);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.endEvent);
        EventHandler.remove(this.element, Browser.touchCancelEvent, this.cancelEvent);
    }

    private calcPoints(evt: MouseEventArgs | TouchEventArgs): void {
        let point: MouseEventArgs | TouchEventArgs = this.updateChangeTouches(evt);
        this.defaultArgs = { originalEvent: evt };
        this.distanceX = Math.abs((Math.abs(point.clientX) - Math.abs(this.startPoint.clientX)));
        this.distanceY = Math.abs((Math.abs(point.clientY) - Math.abs(this.startPoint.clientY)));
        if (this.distanceX > this.distanceY) {
            this.movedDirection = (point.clientX > this.startPoint.clientX) ? 'Right' : 'Left';
        } else {
            this.movedDirection = (point.clientY < this.startPoint.clientY) ? 'Up' : 'Down';
        }
    }

    private calcScrollPoints(evt: MouseEventArgs | TouchEventArgs): void {
        let point: MouseEventArgs | TouchEventArgs = this.updateChangeTouches(evt);
        this.defaultArgs = { originalEvent: evt };
        this.distanceX = Math.abs((Math.abs(point.clientX) - Math.abs(this.lastMovedPoint.clientX)));
        this.distanceY = Math.abs((Math.abs(point.clientY) - Math.abs(this.lastMovedPoint.clientY)));
        if ((this.distanceX > this.distanceY || this.hScrollLocked === true) && this.vScrollLocked === false) {
            this.scrollDirection = (point.clientX > this.lastMovedPoint.clientX) ? 'Right' : 'Left';
            this.hScrollLocked = true;
        } else {
            this.scrollDirection = (point.clientY < this.lastMovedPoint.clientY) ? 'Up' : 'Down';
            this.vScrollLocked = true;
        }
    }

    private getVelocity(pnt: MouseEventArgs | TouchEventArgs): number {
        let newX: number = pnt.clientX;
        let newY: number = pnt.clientY;
        let newT: number = Date.now();
        let xDist: number = newX - this.startPoint.clientX;
        let yDist: number = newY - this.startPoint.clientX;
        let interval: number = newT - this.tStampStart;
        return Math.sqrt(xDist * xDist + yDist * yDist) / interval;
    }

    // tslint:disable-next-line:no-any
    private checkSwipe(ele: any, flag: boolean): boolean {
        let keys: string[] = ['scroll', 'offset'];
        let temp: string[] = flag ? ['Height', 'Top'] : ['Width', 'Left'];
        if ((ele[keys[0] + temp[0]] <= ele[keys[1] + temp[0]])) {
            return true;
        }
        return (ele[keys[0] + temp[1]] === 0) ||
            (ele[keys[1] + temp[0]] + ele[keys[0] + temp[1]] >= ele[keys[0] + temp[0]]);
    }

    private updateChangeTouches(evt: MouseEventArgs | TouchEventArgs): MouseEventArgs | TouchEventArgs {
        // tslint:disable-next-line:max-line-length
        let point: MouseEventArgs | TouchEventArgs = evt.changedTouches && evt.changedTouches.length !== 0 ? evt.changedTouches[0] : evt;
        return point;
    }
}

interface Points {
    clientX: number;
    clientY: number;
}

/**
 * The argument type of `Tap` Event
 */
export interface TapEventArgs extends BaseEventArgs {
    /**
     * Original native event Object.
     */
    originalEvent: TouchEventArgs | MouseEventArgs;
    /**
     * Tap Count.
     */
    tapCount?: number;
}

/**
 * The argument type of `Scroll` Event
 */
export interface ScrollEventArgs extends BaseEventArgs {
    /**
     * Event argument for start event.
     */
    startEvents: TouchEventArgs | MouseEventArgs;
    /**
     * Original native event object for scroll.
     */
    originalEvent: TouchEventArgs | MouseEventArgs;
    /**
     * X position when scroll started.
     */
    startX: number;
    /**
     * Y position when scroll started.
     */
    startY: number;
    /**
     * The direction scroll.
     */
    scrollDirection: string;
    /**
     * The total traveled distance from X position
     */
    distanceX: number;
    /**
     * The total traveled distance from Y position
     */
    distanceY: number;
    /**
     * The velocity of scroll.
     */
    velocity: number;
}

/**
 * The argument type of `Swipe` Event
 */
export interface SwipeEventArgs extends BaseEventArgs {
    /**
     * Event argument for start event.
     */
    startEvents: TouchEventArgs | MouseEventArgs;
    /**
     * Original native event object  for swipe.
     */
    originalEvent: TouchEventArgs | MouseEventArgs;
    /**
     * X position when swipe started.
     */
    startX: number;
    /**
     * Y position when swipe started.
     */
    startY: number;
    /**
     * The direction swipe.
     */
    swipeDirection: string;
    /**
     * The total traveled distance from X position
     */
    distanceX: number;
    /**
     * The total traveled distance from Y position
     */
    distanceY: number;
    /**
     * The velocity of swipe.
     */
    velocity: number;
}

export interface TouchEventArgs extends MouseEvent {
    /**
     * A TouchList with touched points.
     */
    changedTouches: MouseEventArgs[] | TouchEventArgs[];
    /**
     * Cancel the default action.
     */
    preventDefault(): void;
    /**
     * The horizontal coordinate point of client area.
     */
    clientX: number;
    /**
     * The vertical coordinate point of client area.
     */
    clientY: number;
}

export interface MouseEventArgs extends MouseEvent {
    /**
     * A TouchList with touched points.
     */
    changedTouches: MouseEventArgs[] | TouchEventArgs[];
    /**
     * Cancel the default action.
     */
    preventDefault(): void;
    /**
     * The horizontal coordinate point of client area.
     */
    clientX: number;
    /**
     * The vertical coordinate point of client area.
     */
    clientY: number;
}