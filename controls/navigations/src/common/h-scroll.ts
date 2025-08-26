import { Touch, ScrollEventArgs, TouchEventArgs, Component, EventHandler, selectAll, getUniqueID } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, Property, Browser, detach } from '@syncfusion/ej2-base';
import { classList, SwipeEventArgs, isNullOrUndefined} from '@syncfusion/ej2-base';
import { HScrollModel } from './h-scroll-model';

type HTEle = HTMLElement;

const CLS_ROOT: string = 'e-hscroll';
const CLS_RTL: string = 'e-rtl';
const CLS_DISABLE: string = 'e-overlay';
const CLS_HSCROLLBAR: string = 'e-hscroll-bar';
const CLS_HSCROLLCON: string = 'e-hscroll-content';
const CLS_NAVARROW: string = 'e-nav-arrow';
const CLS_NAVRIGHTARROW: string = 'e-nav-right-arrow';
const CLS_NAVLEFTARROW: string = 'e-nav-left-arrow';
const CLS_HSCROLLNAV: string = 'e-scroll-nav';
const CLS_HSCROLLNAVRIGHT: string = 'e-scroll-right-nav';
const CLS_HSCROLLNAVLEFT: string = 'e-scroll-left-nav';
const CLS_DEVICE: string = 'e-scroll-device';
const CLS_OVERLAY: string = 'e-scroll-overlay';
const CLS_RIGHTOVERLAY: string = 'e-scroll-right-overlay';
const CLS_LEFTOVERLAY: string = 'e-scroll-left-overlay';
const OVERLAY_MAXWID: number = 40;

interface TapEventArgs {
    name: string
    originalEvent: TouchEventArgs | TouchEvent | KeyboardEvent
}
/**
 * HScroll module is introduces horizontal scroller when content exceeds the current viewing area.
 * It can be useful for the components like Toolbar, Tab which needs horizontal scrolling alone.
 * Hidden content can be view by touch moving or icon click.
 * ```html
 * <div id="scroll"/>
 * <script>
 *   var scrollObj = new HScroll();
 *   scrollObj.appendTo("#scroll");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class HScroll extends Component<HTMLElement> implements INotifyPropertyChanged {
    /* eslint-disable */
    private isDevice: Boolean;
    private touchModule: Touch;
    private scrollEle: HTEle;
    private scrollItems: HTEle;
    private uniqueId: boolean;
    private timeout: number;
    private keyTimeout: boolean;
    private keyTimer: number;
    private browser: string;
    private browserCheck: boolean;
    private ieCheck: boolean;
    private customStep: boolean;

    /**
     * Specifies the left or right scrolling distance of the horizontal scrollbar moving.
     *
     * @default null
     */
    @Property(null)
    public scrollStep: number;
    /**
     * Initialize the event handler
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        this.browser = Browser.info.name;
        this.browserCheck = this.browser === 'mozilla';
        this.isDevice = Browser.isDevice;
        this.customStep = true;
        const element: HTEle = this.element;
        this.ieCheck = this.browser === 'edge' || this.browser === 'msie';
        this.initialize();
        if (element.id === '') {
            element.id = getUniqueID('hscroll');
            this.uniqueId = true;
        }
        element.style.display = 'block';
        if (this.enableRtl) {
            element.classList.add(CLS_RTL);
        }
    }
    /**
     * To Initialize the horizontal scroll  rendering
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.touchModule = new Touch(this.element, { scroll: this.touchHandler.bind(this), swipe: this.swipeHandler.bind(this) });
        EventHandler.add(this.scrollEle, 'scroll', this.scrollHandler, this);
        if ( !this.isDevice)  {
            this.createNavIcon(this.element);
        } else {
            this.element.classList.add(CLS_DEVICE);
            this.createOverlay(this.element);
        }
        this.setScrollState();
    }
    private setScrollState(): void {
        if (isNullOrUndefined(this.scrollStep) || this.scrollStep < 0) {
            this.scrollStep = this.scrollEle.offsetWidth;
            this.customStep = false;
        } else {
            this.customStep = true;
        }
    }
    /**
     * Initializes a new instance of the HScroll class.
     *
     * @param {HScrollModel} options  - Specifies HScroll model properties as options.
     * @param {string | HTMLElement} element  - Specifies the element for which horizontal scrolling applies.
     */
    public constructor(options?: HScrollModel, element?: string | HTMLElement) {
        super(options, <HTEle | string>element);
    }
    private initialize(): void {
        const scrollEle: HTEle = this.createElement('div', { className: CLS_HSCROLLCON });
        const scrollDiv: HTEle = this.createElement('div', { className: CLS_HSCROLLBAR });
        scrollDiv.setAttribute('tabindex', '-1');
        const ele: HTEle = this.element;
        const innerEle: HTEle[] = [].slice.call(ele.children);
        for (const ele of innerEle) {
            scrollEle.appendChild(ele);
        }
        scrollDiv.appendChild(scrollEle);
        ele.appendChild(scrollDiv);
        scrollDiv.style.overflowX = 'hidden';
        this.scrollEle = scrollDiv;
        this.scrollItems = scrollEle;
    }
    protected getPersistData(): string {
        const keyEntity: string[] = ['scrollStep'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    protected getModuleName(): string {
        return 'hScroll';
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     *
     * @returns {void}
     */
    public destroy(): void {
        const ele: HTEle = this.element;
        ele.style.display = '';
        ele.classList.remove(CLS_ROOT);
        ele.classList.remove(CLS_DEVICE);
        ele.classList.remove(CLS_RTL);
        const nav: HTEle[] =  selectAll('.e-' + ele.id + '_nav.' + CLS_HSCROLLNAV, ele);
        const overlay: HTEle[] = selectAll('.' + CLS_OVERLAY, ele);
        [].slice.call(overlay).forEach((ele: HTEle) => {
            detach(ele);
        });
        for (const elem of [].slice.call(this.scrollItems.children)) {
            ele.appendChild(elem);
        }
        if (this.uniqueId) {
            this.element.removeAttribute('id');
        }
        detach(this.scrollEle);
        if (nav.length > 0) {
            detach(nav[0]);
            if (!isNullOrUndefined(nav[1])) {
                detach(nav[1]);
            }
        }
        EventHandler.remove(this.scrollEle, 'scroll', this.scrollHandler);
        this.touchModule.destroy();
        this.touchModule = null;
        super.destroy();
    }
    /**
     * Specifies the value to disable/enable the HScroll component.
     * When set to `true` , the component will be disabled.
     *
     * @param  {boolean} value - Based on this Boolean value, HScroll will be enabled (false) or disabled (true).
     * @returns {void}.
     */
    public disable(value: boolean): void {
        const navEles: HTMLElement[] = selectAll('.e-scroll-nav:not(.' + CLS_DISABLE + ')', this.element );
        if (value) {
            this.element.classList.add(CLS_DISABLE);
        } else {
            this.element.classList.remove(CLS_DISABLE);
        }
        [].slice.call(navEles).forEach((el: HTMLElement) => {
            el.setAttribute('tabindex', !value ? '0' : '-1');
        });
    }
    private createOverlay(element: HTEle): void {
        const id: string = element.id.concat('_nav');
        const rightOverlayEle: HTEle = this.createElement('div', {className: CLS_OVERLAY + ' ' + CLS_RIGHTOVERLAY});
        const clsRight: string = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVRIGHT);
        const rightEle: HTEle = this.createElement('div', { id: id.concat('_right'), className: clsRight });
        const navItem: HTEle = this.createElement('div', { className: CLS_NAVRIGHTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        rightEle.appendChild(navItem);
        const leftEle: HTEle = this.createElement('div', {className: CLS_OVERLAY + ' ' + CLS_LEFTOVERLAY});
        if (this.ieCheck ) {
            rightEle.classList.add('e-ie-align');
        }
        element.appendChild(rightOverlayEle);
        element.appendChild(rightEle);
        element.insertBefore(leftEle, element.firstChild);
        this.eventBinding([rightEle]);
    }
    private createNavIcon(element: HTEle): void {
        const id: string = element.id.concat('_nav');
        const clsRight: string = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVRIGHT);
        const rightAttributes: { [key: string]: string; } = { 'role': 'button', 'id': id.concat('_right'), 'aria-label': 'Scroll right' };
        const nav: HTEle = this.createElement('div', { className: clsRight, attrs: rightAttributes });
        nav.setAttribute('aria-disabled', 'false');
        const navItem: HTEle = this.createElement('div', { className: CLS_NAVRIGHTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        const clsLeft: string = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVLEFT);
        const leftAttributes: { [key: string]: string; } = { 'role': 'button', 'id': id.concat('_left'), 'aria-label': 'Scroll left' };
        const navEle: HTEle = this.createElement('div', { className: clsLeft + ' ' + CLS_DISABLE, attrs: leftAttributes });
        navEle.setAttribute('aria-disabled', 'true');
        const navLeftItem: HTEle = this.createElement('div', { className: CLS_NAVLEFTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        navEle.appendChild(navLeftItem);
        nav.appendChild(navItem);
        element.appendChild(nav);
        element.insertBefore(navEle, element.firstChild);
        if (this.ieCheck ) {
            nav.classList.add('e-ie-align');
            navEle.classList.add('e-ie-align');
        }
        this.eventBinding([nav, navEle]);
    }
    private onKeyPress(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            const timeoutFun: () => void = () => {
                this.keyTimeout = true;
                this.eleScrolling(10, <HTEle>e.target, true);
            };
            this.keyTimer = window.setTimeout(
                () => {
                    timeoutFun();
                }, 100);
        }
    }
    private onKeyUp(e: KeyboardEvent): void {
        if (e.key !== 'Enter') {
            return;
        }
        if (this.keyTimeout) {
            this.keyTimeout = false;
        } else {
            (<HTEle>e.target).click();
        }
        clearTimeout(this.keyTimer);
    }
    private eventBinding(ele: HTEle[]): void {
        [].slice.call(ele).forEach((el: HTEle) => {
            new Touch(el, {tapHold: this.tabHoldHandler.bind(this), tapHoldThreshold: 500 });
            el.addEventListener('keydown' , this.onKeyPress.bind(this));
            el.addEventListener('keyup', this.onKeyUp.bind(this));
            el.addEventListener('mouseup', this.repeatScroll.bind(this));
            el.addEventListener('touchend', this.repeatScroll.bind(this));
            el.addEventListener('contextmenu', (e: Event) => {
                e.preventDefault();
            });
            EventHandler.add(el, 'click', this.clickEventHandler, this);
        });
    }
    private repeatScroll(): void {
        clearInterval (this.timeout);
    }
    private tabHoldHandler(e: TapEventArgs): void {
        let trgt: HTEle = e.originalEvent.target as HTEle;
        trgt = this.contains(trgt, CLS_HSCROLLNAV) ? <HTEle>trgt.firstElementChild : trgt;
        const scrollDis: number = 10;
        const timeoutFun: () => void = () => {
            this.eleScrolling(scrollDis, trgt, true);
        };
        this.timeout = window.setInterval(
            () => {
                timeoutFun();
            }, 50);
    }
    private contains(ele: HTEle, className: string): boolean {
        return ele.classList.contains(className);
    }
    private eleScrolling(scrollDis: number, trgt: HTEle, isContinuous: boolean ): void {
        const rootEle: HTEle = this.element;
        let classList: DOMTokenList = trgt.classList;
        if (classList.contains(CLS_HSCROLLNAV)) {
            classList = trgt.querySelector('.' + CLS_NAVARROW).classList;
        }
        if (this.contains(rootEle, CLS_RTL) && this.browserCheck) {
            scrollDis = - scrollDis;
        }
        if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck)  || this.ieCheck) {
            if (classList.contains(CLS_NAVRIGHTARROW)) {
                this.frameScrollRequest(scrollDis, 'add', isContinuous);
            } else {
                this.frameScrollRequest(scrollDis, '', isContinuous);
            }
        } else {
            if (classList.contains(CLS_NAVLEFTARROW)) {
                this.frameScrollRequest(scrollDis, 'add', isContinuous);
            } else {
                this.frameScrollRequest(scrollDis, '', isContinuous);
            }
        }
    }
    private clickEventHandler(e: Event): void {
        this.eleScrolling(this.scrollStep , <HTEle>e.target, false);
    }

    private swipeHandler(e: SwipeEventArgs): void {
        const swipeEle: HTEle = this.scrollEle;
        let distance: number;
        if (e.velocity <= 1) {
            distance = e.distanceX  / (e.velocity * 10);
        } else {
            distance = e.distanceX / e.velocity;
        }
        let start: number = 0.5;
        const animate: () => void = () => {
            const step: number = Math.sin(start);
            if (step <= 0) {
                window.cancelAnimationFrame(step);
            } else {
                if (e.swipeDirection === 'Left') {
                    swipeEle.scrollLeft += distance * step;
                } else if (e.swipeDirection === 'Right') {
                    swipeEle.scrollLeft -= distance * step;
                }
                start -= 0.5;
                window.requestAnimationFrame(animate as FrameRequestCallback);
            }
        };
        animate();
    }

    private scrollUpdating(scrollVal: number, action: string): void {
        if (action === 'add') {
            this.scrollEle.scrollLeft += scrollVal;
        } else {
            this.scrollEle.scrollLeft -= scrollVal;
        }
        if (this.enableRtl && this.scrollEle.scrollLeft > 0) {
            this.scrollEle.scrollLeft = 0;
        }
    }

    private frameScrollRequest(scrollVal: number, action: string, isContinuous: boolean): void {
        const step: number = 10;
        if (isContinuous) {
            this.scrollUpdating(scrollVal, action);
            return;
        }
        if (!this.customStep) {
            [].slice.call(selectAll('.' + CLS_OVERLAY, this.element)).forEach((el: HTMLElement) => {
                scrollVal -= el.offsetWidth;
            });
        }
        const animate: () => void = () => {
            let scrollValue: number;
            let scrollStep: number;
            if (this.contains(this.element, CLS_RTL) && this.browserCheck) {
                scrollValue = - scrollVal;
                scrollStep = - step;
            } else {
                scrollValue = scrollVal;
                scrollStep = step;
            }
            if (scrollValue < step) {
                window.cancelAnimationFrame(scrollStep);
            } else {
                this.scrollUpdating(scrollStep, action);
                scrollVal -= scrollStep;
                window.requestAnimationFrame(animate as FrameRequestCallback);
            }
        };
        animate();
    }

    private touchHandler(e: ScrollEventArgs): void {
        const ele: HTEle = this.scrollEle;
        let distance: number = e.distanceX;
        if ((this.ieCheck)  && this.contains(this.element, CLS_RTL)) {
            distance = - distance;
        }
        if (e.scrollDirection === 'Left') {
            ele.scrollLeft = ele.scrollLeft + distance;
        } else if (e.scrollDirection === 'Right') {
            ele.scrollLeft = ele.scrollLeft - distance;
        }
    }
    private arrowDisabling(addDisable: HTEle, removeDisable: HTEle): void {
        if (this.isDevice) {
            const arrowEle: HTMLElement = isNullOrUndefined(addDisable) ? removeDisable : addDisable;
            const arrowIcon: HTMLElement = arrowEle.querySelector('.' + CLS_NAVARROW) as HTMLElement;
            if (isNullOrUndefined(addDisable)) {
                classList(arrowIcon, [CLS_NAVRIGHTARROW], [CLS_NAVLEFTARROW]);
            } else {
                classList(arrowIcon, [CLS_NAVLEFTARROW], [CLS_NAVRIGHTARROW]);
            }
        } else if (addDisable && removeDisable) {
            addDisable.classList.add(CLS_DISABLE);
            addDisable.setAttribute('aria-disabled' , 'true');
            addDisable.removeAttribute('tabindex');
            removeDisable.classList.remove(CLS_DISABLE);
            removeDisable.setAttribute('aria-disabled' , 'false');
            removeDisable.setAttribute('tabindex', '0');
        }
        this.repeatScroll();
    }
    private scrollHandler(e: Event): void {
        const target: HTEle = <HTEle>e.target;
        const width: number = target.offsetWidth;
        const rootEle: HTEle = this.element;
        const navLeftEle: HTEle = (<HTEle>this.element.querySelector('.' + CLS_HSCROLLNAVLEFT));
        const navRightEle: HTEle = (<HTEle>this.element.querySelector('.' + CLS_HSCROLLNAVRIGHT));
        let leftOverlay: HTEle = (<HTEle>this.element.querySelector('.' + CLS_LEFTOVERLAY));
        let rightOverlay: HTEle = (<HTEle>this.element.querySelector('.' + CLS_RIGHTOVERLAY));
        let scrollLeft: number = target.scrollLeft;
        if (scrollLeft <= 0) {
            scrollLeft = -scrollLeft;
        }
        if (this.isDevice) {
            if (this.enableRtl && !(this.browserCheck || this.ieCheck)) {
                leftOverlay = (<HTEle>this.element.querySelector('.' + CLS_RIGHTOVERLAY));
                rightOverlay = (<HTEle>this.element.querySelector('.' + CLS_LEFTOVERLAY));
            }
            if (scrollLeft < OVERLAY_MAXWID) {
                leftOverlay.style.width = scrollLeft + 'px';
            } else {
                leftOverlay.style.width = '40px';
            }
            if (( target.scrollWidth - Math.ceil(width + scrollLeft)) < OVERLAY_MAXWID ) {
                rightOverlay.style.width = ( target.scrollWidth - Math.ceil(width + scrollLeft)) + 'px';
            } else {
                rightOverlay.style.width = '40px';
            }
        }
        if (scrollLeft === 0) {
            this.arrowDisabling(navLeftEle, navRightEle);
        } else if (Math.ceil(width + scrollLeft + .1) >= target.scrollWidth) {
            this.arrowDisabling(navRightEle, navLeftEle);
        } else {
            const disEle: HTEle = <HTEle>this.element.querySelector('.' + CLS_HSCROLLNAV + '.' + CLS_DISABLE);
            if (disEle) {
                disEle.classList.remove(CLS_DISABLE);
                disEle.setAttribute('aria-disabled', 'false');
                disEle.setAttribute('tabindex', '0');
            }
        }
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     *
     * @param  {HScrollModel} newProp - It contains the new value of data.
     * @param  {HScrollModel} oldProp - It contains the old value of data.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: HScrollModel, oldProp: HScrollModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'scrollStep':
                this.setScrollState();
                break;
            case 'enableRtl':
                newProp.enableRtl ? this.element.classList.add(CLS_RTL) : this.element.classList.remove(CLS_RTL);
                break;
            }
        }
    }
}
