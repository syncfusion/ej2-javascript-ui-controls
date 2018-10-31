import { Touch, ScrollEventArgs, TouchEventArgs, Component, EventHandler, selectAll, getUniqueID, remove } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, Property, Browser, detach } from '@syncfusion/ej2-base';
import { classList, SwipeEventArgs, isNullOrUndefined} from '@syncfusion/ej2-base';
import { HScrollModel } from './h-scroll-model';

type HTEle = HTMLElement;
type Str = string;

const CLS_ROOT: Str = 'e-hscroll';
const CLS_RTL : Str = 'e-rtl';
const CLS_DISABLE: Str = 'e-overlay';
const CLS_HSCROLLBAR : Str = 'e-hscroll-bar';
const CLS_HSCROLLCON : Str = 'e-hscroll-content';
const CLS_NAVARROW : Str = 'e-nav-arrow';
const CLS_NAVRIGHTARROW : Str = 'e-nav-right-arrow';
const CLS_NAVLEFTARROW : Str = 'e-nav-left-arrow';
const CLS_HSCROLLNAV : Str = 'e-scroll-nav';
const CLS_HSCROLLNAVRIGHT : Str = 'e-scroll-right-nav';
const CLS_HSCROLLNAVLEFT : Str = 'e-scroll-left-nav';
const CLS_DEVICE: Str = 'e-scroll-device';
const CLS_OVERLAY: Str = 'e-scroll-overlay';
const CLS_RIGHTOVERLAY: Str = 'e-scroll-right-overlay';
const CLS_LEFTOVERLAY: Str = 'e-scroll-left-overlay';
const OVERLAY_MAXWID: number = 40;

interface TapEventArgs {
    name: string;
    originalEvent: TouchEventArgs | TouchEvent | KeyboardEvent;
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
    private touchModule: Touch;
    private scrollEle: HTEle;
    private scrollItems: HTEle;
    private uniqueId : Boolean;
    private timeout: number;
    private keyTimeout: Boolean;
    private keyTimer: number;
    private browser: String;
    private browserCheck: Boolean;
    private ieCheck: Boolean;
    private isDevice: Boolean;
    private customStep: Boolean;

    /**
     * Specifies the left or right scrolling distance of the horizontal scrollbar moving.
     * @default null
     */
    @Property(null)
    public scrollStep: number;
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        this.browser = Browser.info.name;
        this.browserCheck = this.browser === 'mozilla';
        this.isDevice = Browser.isDevice;
        this.customStep = true;
        let element: HTEle = this.element;
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
     * To Initialize the control rendering
     * @private
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
        if (isNullOrUndefined(this.scrollStep) || this.scrollStep < 0) {
            this.scrollStep = this.scrollEle.offsetWidth;
            this.customStep = false;
        }
    }
    /**
     * Initializes a new instance of the HScroll class.
     * @param options  - Specifies HScroll model properties as options.
     * @param element  - Specifies the element for which horizontal scrolling applies.
     */
    constructor(options?: HScrollModel, element?: string | HTMLElement) {
        super(options, <HTEle | string>element);
    }
    private initialize(): void {
        let scrollEle: HTEle = this.createElement('div', { className: CLS_HSCROLLCON });
        let scrollDiv: HTEle = this.createElement('div', { className: CLS_HSCROLLBAR });
        scrollDiv.setAttribute('tabindex', '-1');
        let ele: HTEle = this.element;
        let innerEle: HTEle[] = [].slice.call(ele.children);
        for (let ele of innerEle) {
            scrollEle.appendChild(ele);
        }
        scrollDiv.appendChild(scrollEle);
        ele.appendChild(scrollDiv);
        scrollDiv.style.overflowX = 'hidden';
        this.scrollEle = scrollDiv;
        this.scrollItems = scrollEle;
    }
    protected getPersistData(): string {
        let keyEntity: string[] = ['scrollStep'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    protected getModuleName(): string {
        return 'hScroll';
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    public destroy(): void {
        let ele: HTEle = this.element;
        ele.style.display = '';
        ele.classList.remove(CLS_ROOT);
        ele.classList.remove(CLS_DEVICE);
        let nav: HTEle[] =  selectAll('.e-' + ele.id + '_nav.' + CLS_HSCROLLNAV, ele);
        let overlay: HTEle[] = selectAll('.' + CLS_OVERLAY, ele);
        overlay.forEach((ele: HTEle) => {
            detach(ele);
        });
        for (let elem of [].slice.call(this.scrollItems.children)) {
            ele.appendChild(elem);
        }
        if (this.uniqueId) {
           this.element.removeAttribute('id'); }
        detach(this.scrollEle);
        if (nav.length > 0) {
          detach(nav[0]);
          if (!isNullOrUndefined(nav[1])) { detach(nav[1]); } }
        EventHandler.remove(this.scrollEle, 'scroll', this.scrollHandler);
        this.touchModule.destroy();
        this.touchModule = null;
        super.destroy();
    }
    /**
     * Specifies the value to disable/enable the HScroll component.
     * When set to `true`, the component will be disabled.
     * @param  {boolean} value - Based on this Boolean value, HScroll will be enabled (false) or disabled (true).
     * @returns void.
     */
    public disable(value: boolean): void {
      let navEles: HTMLElement[] = selectAll('.e-scroll-nav:not(.' + CLS_DISABLE + ')', this.element );
      value ? this.element.classList.add(CLS_DISABLE) : this.element.classList.remove(CLS_DISABLE);
      navEles.forEach((el: HTMLElement) => {
        el.setAttribute('tabindex', !value ? '0' : '-1');
      });
    }
    private createOverlay(element: HTEle): void {
      let id: string = element.id.concat('_nav');
      let rightOverlayEle: HTEle = this.createElement('div', {className: CLS_OVERLAY + ' ' + CLS_RIGHTOVERLAY});
      let clsRight: string = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVRIGHT);
      let rightEle: HTEle = this.createElement('div', { id: id.concat('_right'), className: clsRight });
      let navItem: HTEle = this.createElement('div', { className: CLS_NAVRIGHTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
      rightEle.appendChild(navItem);
      let leftEle: HTEle = this.createElement('div', {className: CLS_OVERLAY + ' ' + CLS_LEFTOVERLAY});
      if (this.ieCheck ) {
        rightEle.classList.add('e-ie-align'); }
      element.appendChild(rightOverlayEle);
      element.appendChild(rightEle);
      element.insertBefore(leftEle, element.firstChild);
      this.eventBinding([rightEle]);
    }
    private createNavIcon(element: HTEle): void {
        let id: string = element.id.concat('_nav');
        let clsRight: string = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVRIGHT);
        let nav: HTEle = this.createElement('div', { id: id.concat('_right'), className: clsRight });
        nav.setAttribute('aria-disabled', 'false');
        let navItem: HTEle = this.createElement('div', { className: CLS_NAVRIGHTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        let clsLeft: string = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVLEFT);
        let navEle: HTEle = this.createElement('div', { id: id.concat('_left'), className: clsLeft + ' ' + CLS_DISABLE });
        navEle.setAttribute('aria-disabled', 'true');
        let navLeftItem: HTEle = this.createElement('div', { className: CLS_NAVLEFTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        navEle.appendChild(navLeftItem);
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        element.appendChild(nav);
        element.insertBefore(navEle, element.firstChild);
        if (this.ieCheck ) {
          nav.classList.add('e-ie-align');
          navEle.classList.add('e-ie-align'); }
        this.eventBinding([nav, navEle]);
    }
    private onKeyPress(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
         let timeoutFun: Function = () => {
           this.keyTimeout = true;
           this.eleScrolling(10, <HTEle>e.target, true);
          };
         this.keyTimer = window.setTimeout(
             () => {
              timeoutFun();
          }, 100);
    }}
    private onKeyUp(e: KeyboardEvent): void {
        if (e.key !== 'Enter') { return; }
        if (this.keyTimeout) {
            this.keyTimeout = false;
        } else {
            (<HTEle>e.target).click();
        }
        clearTimeout(this.keyTimer);
    }
    private eventBinding(ele: HTEle[]): void {
     ele.forEach((el: HTEle) => {
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
       let scrollDis: number = 10;
       let timeoutFun: Function = () => {
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
        let element: HTEle = this.scrollEle;
        let rootEle: HTEle = this.element;
        let classList: DOMTokenList = trgt.classList;
        if (classList.contains(CLS_HSCROLLNAV)) {
            classList = trgt.querySelector('.' + CLS_NAVARROW).classList;
        }
        if (this.contains(rootEle, CLS_RTL) && this.browserCheck) {
            scrollDis = - scrollDis;
        }
        let scrlLeft: number = element.scrollLeft;
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
        let swipeEle: HTEle = this.scrollEle;
        let distance: number;
        if (e.velocity <= 1) {
            distance = e.distanceX  / (e.velocity * 10);
          } else {
            distance = e.distanceX / e.velocity;
          }
        let start: number = 0.5;
        let animate: Function = () => {
            let step: number = Math.sin(start);
            if (step <= 0) {
              window.cancelAnimationFrame(step);
            } else {
                if (e.swipeDirection === 'Left') {
                  swipeEle.scrollLeft += distance * step;
                } else if (e.swipeDirection === 'Right') {
                    swipeEle.scrollLeft -= distance * step;
                }
                start -= 0.02;
                window.requestAnimationFrame(animate as FrameRequestCallback);
            }
        };
        animate();
    }

    private scrollUpdating(scrollVal: number, action: string): void {
        if (action === 'add') {
            this.scrollEle.scrollLeft += scrollVal;
        } else {
          this.scrollEle.scrollLeft -= scrollVal; }
    }

    private frameScrollRequest(scrollVal: number, action: string, isContinuous: boolean): void {
      let step: number = 10;
      if (isContinuous) {
        this.scrollUpdating(scrollVal, action);
        return;
      }
      if (!this.customStep) {
      selectAll('.' + CLS_OVERLAY, this.element).forEach((el: HTMLElement) => {
          scrollVal -= el.offsetWidth; }); }
      let animate: Function = () => {
       if (scrollVal < step) {
           window.cancelAnimationFrame(step);
       } else {
            this.scrollUpdating(step, action);
            scrollVal -= step;
            window.requestAnimationFrame(animate as FrameRequestCallback);
       }
      };
      animate();
    }

    private touchHandler(e: ScrollEventArgs): void {
            let ele: HTEle = this.scrollEle;
            let distance: number;
            distance = e.distanceX;
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
        let arrowEle: HTMLElement = isNullOrUndefined(addDisable) ? removeDisable : addDisable;
        let arrowIcon: HTMLElement = arrowEle.querySelector('.' + CLS_NAVARROW) as HTMLElement;
        if (isNullOrUndefined(addDisable)) {
          classList(arrowIcon, [CLS_NAVRIGHTARROW], [CLS_NAVLEFTARROW]);
        } else {
          classList(arrowIcon, [CLS_NAVLEFTARROW], [CLS_NAVRIGHTARROW]);
        }
      } else {
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
        let target: HTEle = <HTEle>e.target;
        let width: number = target.offsetWidth;
        let rootEle: HTEle = this.element;
        let navLeftEle: HTEle = (<HTEle>this.element.querySelector('.' + CLS_HSCROLLNAVLEFT));
        let navRightEle: HTEle = (<HTEle>this.element.querySelector('.' + CLS_HSCROLLNAVRIGHT));
        let leftOverlay: HTEle = (<HTEle>this.element.querySelector('.' + CLS_LEFTOVERLAY));
        let rightOverlay: HTEle = (<HTEle>this.element.querySelector('.' + CLS_RIGHTOVERLAY));
        let scrollLeft: number = target.scrollLeft;
        if (scrollLeft <= 0) {
            scrollLeft = -scrollLeft;
        }
        if (this.isDevice) {
            if (this.enableRtl && !(this.browserCheck || this.ieCheck)) {
                leftOverlay = (<HTEle>this.element.querySelector('.' + CLS_RIGHTOVERLAY));
                rightOverlay = (<HTEle>this.element.querySelector('.' + CLS_LEFTOVERLAY)); }
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
            if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
                this.arrowDisabling(navLeftEle, navRightEle);
            } else {
                this.arrowDisabling(navRightEle, navLeftEle);
            }
        } else if (Math.ceil(width + scrollLeft + .1) >= target.scrollWidth) {
            if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
              this.arrowDisabling(navRightEle, navLeftEle);
            } else {
                this.arrowDisabling(navLeftEle, navRightEle);
            }
        } else {
            let disEle: HTEle = <HTEle>this.element.querySelector('.' + CLS_HSCROLLNAV + '.' + CLS_DISABLE);
            if (disEle) {
                disEle.classList.remove(CLS_DISABLE);
                disEle.setAttribute('aria-disabled', 'false');
                disEle.setAttribute('tabindex', '0');
            }
        }
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     * @param  {HScrollModel} newProp
     * @param  {HScrollModel} oldProp
     * @returns void
     * @private
     */
    public onPropertyChanged(newProp: HScrollModel, oldProp: HScrollModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'scrollStep':
                    break;
                case 'enableRtl':
                    newProp.enableRtl ? this.element.classList.add(CLS_RTL) : this.element.classList.remove(CLS_RTL);
                    break;
            }
        }
    }
}
