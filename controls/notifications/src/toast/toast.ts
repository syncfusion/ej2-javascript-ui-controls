import { Component, Property, ChildProperty, INotifyPropertyChanged, NotifyPropertyChanges, Animation } from '@syncfusion/ej2-base';
import { Browser, isNullOrUndefined as isNOU,  getUniqueID, formatUnit, EventHandler } from '@syncfusion/ej2-base';
import { EmitType, Collection, Complex, setStyleAttribute, Event, Effect, detach, AnimationModel } from '@syncfusion/ej2-base';
import { attributes, extend, closest, compile as templateCompiler, classList, BaseEventArgs, isUndefined} from '@syncfusion/ej2-base';
import { SwipeEventArgs, Touch } from '@syncfusion/ej2-base';
import { ButtonModel, Button  } from '@syncfusion/ej2-buttons';
import { getZindexPartial } from '@syncfusion/ej2-popups';
import { ToastModel, ButtonModelPropsModel, ToastPositionModel } from './toast-model';
import {  ToastAnimationsModel, ToastAnimationSettingsModel } from './toast-model';

/**
 * Specifies the options for positioning the Toast in Y axis.
 */
export type PositionY = 'Top' | 'Bottom';

/**
 * Specifies the options for positioning the Toast in X axis.
 */
export type PositionX = 'Left' | 'Right' | 'Center';

/**
 * Specifies the event arguments of Toast click.
 */
export interface ToastClickEventArgs extends BaseEventArgs {
  /** Defines the Toast element. */
  element: HTMLElement;
  /** Defines the Toast object. */
  toastObj: Toast;
  /** Defines the prevent action for Toast click event. */
  cancel : boolean;
  /** Defines the close action for click or tab on the Toast. */
  clickToClose: boolean;
  /** Defines the current event object. */
  originalEvent: Event;
}

/**
 * Specifies the event arguments of Toast before open.
 */
export interface ToastBeforeOpenArgs extends BaseEventArgs {
  /** Defines the Toast element. */
  element: HTMLElement;
  /** Defines the Toast object. */
  toastObj: Toast;
  /** Defines the prevent action for before opening toast. */
  cancel : boolean;
}

/**
 * Specifies the event arguments of Toast open.
 */
export interface ToastOpenArgs extends BaseEventArgs {
  /** Defines the Toast element. */
  element: HTMLElement;
  /** Defines the Toast object. */
  toastObj: Toast;
}

/**
 * Specifies the event arguments of Toast close.
 */
export interface ToastCloseArgs extends BaseEventArgs {
  /** Defines the Toast container element. */
  toastContainer: HTMLElement;
  /** Defines the Toast object. */
  toastObj: Toast;
}

interface ToastOffsetPosition {
  left: number;
  top: number;
}

interface Progressbar {
  maxHideTime: number;
  intervalId: number;
  timeOutId: number;
  hideEta: number;
  element: HTEle;
  progressEle: HTEle;
}

type HTEle = HTMLElement;

const ROOT: string = 'e-toast';
const CONTAINER: string = 'e-toast-container';
const TITLE: string = 'e-toast-title';
const WIDTHFULL: string = 'e-toast-full-width';
const CONTENT: string = 'e-toast-content';
const MESSAGE: string = 'e-toast-message';
const ICON: string = 'e-toast-icon';
const PROGRESS: string = 'e-toast-progress';
const ACTIOBUTTONS: string = 'e-toast-actions';
const CLOSEBTN: string = 'e-toast-close-icon';
const RTL: string = 'e-rtl';

/**
 * An object that is used to configure the Toast X Y positions.
 */
export class ToastPosition extends ChildProperty<ToastPosition> {
  /**
   * Specifies the position of the Toast notification with respect to the target container's left edge.
   * @default 'Left'
   * @aspType string
   */
  @Property('Left')
  public X: PositionX | number | string;

  /**
   * Specifies the position of the Toast notification with respect to the target container's top edge.
   * @default 'Top'
   * @aspType string
   */
  @Property('Top')
  public Y: PositionY | number | string;
}

/**
 * An object that is used to configure the action button model properties and event.
 */
export class ButtonModelProps extends ChildProperty<ButtonModelProps> {
  /**
   * Specifies the Button component model properties to render the Toast action buttons.
   * ```html
   * <div id="element"> </div>
   * ```
   * ```typescript
   * let toast: Toast =  new Toast({ 
   *      buttons:
   *      [{ 
   *         model: { content:`Button1`, cssClass: `e-success` }
   *      }] 
   * });
   * toast.appendTo('#element');
   * ```
   *  
   * @default 'null'
   */
  @Property(null)
  public model: ButtonModel;

  /**
   * Specifies the click event binding of action buttons created within Toast.
   * @event
   */
  @Property(null)
  public click: EmitType<Event>;
}

/**
 * An object that is used to configure the animation object of Toast.
 */
export class ToastAnimations extends ChildProperty<ToastAnimations> {
  /**
   * Specifies the type of animation.
   * @default : 'FadeIn'
   * @aspType string
   */
  @Property('FadeIn')
  public effect: Effect;
  /**
   * Specifies the duration to animate.
   * @default : 600
   */
  @Property(600)
  public duration: number;
  /**
   * Specifies the animation timing function.
   * @default : 'ease'
   */
  @Property('ease')
  public easing: string;
}

/**
 * An object that is used to configure the show/hide animation settings of Toast.
 */
export class ToastAnimationSettings extends ChildProperty<ToastAnimationSettings> {
  /**
   * Specifies the animation to appear while showing the Toast.
   * @default { effect: 'FadeIn', duration: 600, easing: 'ease' }
   */
  @Complex<ToastAnimationsModel>({ effect: 'FadeIn', duration: 600, easing: 'ease' }, ToastAnimations)
  public show: ToastAnimationsModel;
  /**
   * Specifies the animation to appear while hiding the Toast.
   * @default { effect: 'FadeOut', duration: 600, easing: 'ease' }
   */
  @Complex<ToastAnimationsModel>({ effect: 'FadeOut', duration: 600, easing: 'ease' }, ToastAnimations)
  public hide: ToastAnimationsModel;
}

/**
 * The Toast is a notification pop-up that showing on desired position which can provide an information to the user.
 *  * ```html
 * <div id="toast"/>
 * <script>
 *   var toastObj = new Toast();
 *   toastObj.appendTo("#toast");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Toast extends Component<HTMLElement> implements INotifyPropertyChanged {

    private toastContainer: HTEle;
    private toastEle: HTEle;
    private progressBarEle: HTEle;
    private intervalId: number[];
    private progressObj: Progressbar[];
    private titleTemplate: HTEle;
    private contentTemplate: HTEle;
    private toastTemplate: HTEle;
    private customPosition: boolean;
    private isDevice: Boolean;
    private innerEle: Node;

    /**
     * Initializes a new instance of the Toast class.
     * @param options  - Specifies Toast model properties as options.
     * @param element  - Specifies the element that is rendered as a Toast.
     */
    constructor(options?: ToastModel, element?: HTMLElement) {
        super(options, element);
    }

    /**
     * Specifies the width of the Toast in pixels/numbers/percentage. Number value is considered as pixels.
     * In mobile devices, default width is considered as `100%`. 
     * @default '300'
     */
    @Property('300px')
    public width: string | number;

    /**
     * Specifies the height of the Toast in pixels/number/percentage. Number value is considered as pixels.
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * Specifies the title to be displayed on the Toast.
     * @default null
     */
    @Property(null)
    public title: string;

    /**
     * Specifies the content to be displayed on the Toast.
     * @default null
     */
    @Property(null)
    public content: string | HTMLElement;

    /**
     * Defines CSS classes to specify an icon for the Toast which is to be displayed at top left corner of the Toast.
     * @default null
     */
    @Property(null)
    public icon: string;

    /**
     * Defines single/multiple classes (separated by space) to be used for customization of Toast.
     * @default null
     */
    @Property(null)
    public cssClass: string;

    /**
     * Specifies the HTML element/element ID as a string that can be displayed as a Toast.
     * The given template is taken as preference to render the Toast, even if the built-in properties such as title and content are defined.
     * @default null
     */
    @Property(null)
    public template: string;

    /**
     * Specifies the newly created Toast message display order while multiple toast's are added to page one after another.
     * By default, newly added Toast will be added after old Toast's.
     * @default true
     */
    @Property(true)
    public newestOnTop: boolean;

    /**
     * Specifies whether to show the close button in Toast message to close the Toast.
     * @default false
     */
    @Property(false)
    public showCloseButton: boolean;

    /**
     * Specifies whether to show the progress bar to denote the Toast message display timeout.
     * @default false
     */
    @Property(false)
    public showProgressBar: boolean;

    /**
     * Specifies the Toast display time duration on the page in milliseconds. 
     * - Once the time expires, Toast message will be removed.
     * - Setting 0 as a time out value displays the Toast on the page until the user closes it manually.
     * @default 5000
     */
    @Property(5000)
    public timeOut: number;

    /**
     * Specifies the Toast display time duration after interacting with the Toast. 
     * @default 1000
     */
    @Property(1000)
    public extendedTimeout: number;

    /**
     * Specifies the animation configuration settings for showing and hiding the Toast.
     * @default { show: { effect: 'FadeIn', duration: 600, easing: 'linear' },
     * hide: { effect: 'FadeOut', duration: 600, easing: 'linear' }}
     */
    @Complex<ToastAnimationSettingsModel>({}, ToastAnimationSettings)
    public animation: ToastAnimationSettingsModel;

    /**
     * Specifies the position of the Toast message to be displayed within target container.
     * In the case of multiple Toast display, new Toast position will not update on dynamic change of property values
     * until the old Toast messages removed.
     * X values are: Left , Right ,Center
     * Y values are: Top , Bottom
     * @default { X: "Left", Y: "Top"}
     */
    @Complex<ToastPositionModel>({}, ToastPosition)
    public position: ToastPositionModel;

    /**
     * Specifies the collection of Toast action `buttons` to be rendered with the given
     * Button model properties and its click action handler.
     * @default [{}]
     */
    @Collection<ButtonModelPropsModel>([{}], ButtonModelProps)
    public buttons: ButtonModelPropsModel[];

    /**
     * Specifies the target container where the Toast to be displayed.
     * Based on the target, the positions such as `Left`, `Top` will be applied to the Toast.
     * @default document.body
     * @aspType string
     */
    @Property(document.body)
    public target: HTMLElement | Element | string;

    /**
     * Triggers the event after the Toast gets created.
     * @event
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers the event after the Toast gets destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Event>;


    /**
     * Triggers the event after the Toast shown on the target container.
     * @event
     */
    @Event()
    public open: EmitType<ToastOpenArgs>;

    /**
     * Triggers the event before the toast shown.
     * @event
     */
    @Event()
    public beforeOpen: EmitType<ToastBeforeOpenArgs>;
    /**
     * Trigger the event after the Toast hides.
     * @event
     */
    @Event()
    public close: EmitType<ToastCloseArgs>;
    /**
     * The event will be fired while clicking on the Toast.
     * @event
     */
    @Event()
    public click: EmitType<ToastClickEventArgs>;

    /**
     * Gets the Component module name.
     * @private
     */
    public getModuleName(): string {
        return 'toast';
    }
    /**
     * Gets the persisted state properties of the Component.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers, attributes and classes.
     */
    public destroy(): void {
        this.hide('All');
        this.element.classList.remove(CONTAINER);
        setStyleAttribute(this.element, { 'position': '', 'z-index': '' });
        super.destroy();
    }

    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        //There is no event handler
        this.isDevice = Browser.isDevice;
        if (this.width === '300px') {
          this.width = (this.isDevice && screen.width < 768) ? '100%' : '300px';
        }
        if (this.enableRtl) {
          this.element.classList.add(RTL);
        }

    }

    /**
     * Initialize the component rendering
     * @private
     */
    public render(): void {
      this.progressObj = [];
      this.intervalId = [];
      this.titleTemplate = null;
      this.contentTemplate = null;
      this.toastTemplate = null;
      if (this.isDevice && screen.width < 768) {
        new Touch(this.element, { swipe: this.swipeHandler.bind(this) });
      }
    }
    /**
     * To show Toast element on a document with the relative position.
     * @param  {ToastModel} toastObj? - To show Toast element on screen.
     * @returns void
     */
    public show (toastObj?: ToastModel) : void {
      if (!isNOU(toastObj)) {
        this.templateChanges(toastObj);
        extend(this, this, toastObj); }
      if (isNOU(this.toastContainer)) {
        this.toastContainer = this.getContainer();
        let target: HTEle = typeof (this.target) === 'string' ? <HTEle>document.querySelector(this.target) : <HTEle>this.target;
        if (isNOU(target)) {
          return; }
        if (target.tagName === 'BODY') {
          this.toastContainer.style.position = 'fixed';
        } else {
          this.toastContainer.style.position = 'absolute';
          (target as HTEle).style.position = 'relative';
        }
        this.setPositioning(this.position);
        target.appendChild(this.toastContainer);
      }
      this.toastEle = this.createElement('div', { className: ROOT, id: getUniqueID('toast') });
      this.setWidthHeight();
      this.setCSSClass(this.cssClass);
      (isNOU(this.template) || this.template === '') ? this.personalizeToast() : this.templateRendering();
      this.setProgress();
      this.setCloseButton();
      this.setAria();
      this.appendToTarget();
    }

    private swipeHandler(e: SwipeEventArgs): void {
      let toastEle: HTMLElement = <HTMLElement>closest(<Element>e.originalEvent.target, '.' + ROOT + ':not(.' + CONTAINER + ')');
      let hideAnimation: Effect = this.animation.hide.effect;
      if (!isNOU(toastEle)) {
        if (e.swipeDirection === 'Right') {
          this.animation.hide.effect = 'SlideRightOut';
          this.hide(toastEle);
        } else if (e.swipeDirection === 'Left') {
          this.animation.hide.effect = 'SlideLeftOut';
          this.hide(toastEle);
        }
        this.animation.hide.effect = hideAnimation;
      }
    }

    private templateChanges(toastObj: ToastModel): void {
      if (!isUndefined(toastObj.content) && !isNOU(this.contentTemplate) && this.content !== toastObj.content) {
        this.clearContentTemplate(); }
      if (!isUndefined(toastObj.title) && !isNOU(this.titleTemplate) && this.title !== toastObj.title ) {
        this.clearTitleTemplate(); }
      if (!isUndefined(toastObj.template) && !isNOU(this.toastTemplate) && this.template !== toastObj.template) {
        this.clearToastTemplate(); }
    }

    private setCSSClass(cssClass: string): void {
      if (!isNOU (cssClass)) {
        let split: string = cssClass.indexOf(',') !== -1 ? ',' : ' ';
        classList(this.toastEle , cssClass.split(split) , []);
      }
    }

    private setWidthHeight(): void {
      if (this.width === '300px') {
        this.toastEle.style.width = formatUnit(this.width);
      } else if (this.width === '100%') {
        this.toastContainer.classList.add(WIDTHFULL);
      } else {
        this.toastEle.style.width = formatUnit(this.width);
        this.toastContainer.classList.remove(WIDTHFULL); }
      this.toastEle.style.height = formatUnit(this.height);
    }

    private templateRendering(): void {
      this.fetchEle(this.toastEle, this.template, 'template');
    }
    /**
     * To Hide Toast element on a document.
     * To Hide all toast element when passing 'All'.
     * @param  {HTMLElement| Element| string} element? - To Hide Toast element on screen.
     * @returns void
     */
    public hide (element?: HTMLElement| Element| string) : void {
      if (isNOU(this.toastContainer) || this.toastContainer.childElementCount === 0) { return; }
      if (typeof element === 'string' && element === 'All' ) {
        for (let i: number = 0; i < this.toastContainer.childElementCount; i++) {
          this.destroyToast(this.toastContainer.children[i] as HTEle); }
        return; }
      if (isNOU(element)) {
        element = <HTEle> (this.newestOnTop ? this.toastContainer.lastElementChild : this.toastContainer.firstElementChild);
      }
      this.destroyToast(element as HTEle);
    }

    private fetchEle (ele: HTEle, value: string, prob: string): HTEle {
      let templateFn: Function;
      let tempVar: HTEle;
      let tempArray: HTEle[];
      prob === 'title' ? tempVar = this.titleTemplate : prob === 'content' ? tempVar = this.contentTemplate : tempVar = this.toastTemplate;
      if (!isNOU(tempVar)) {
        ele.appendChild(tempVar.cloneNode(true));
        return ele; }
      try {
        if (document.querySelectorAll(value).length > 0) {
          let elem: HTEle = <HTEle> document.querySelector(value);
          ele.appendChild(elem);
          elem.style.display = '';
          let clo: HTEle = <HTEle>elem.cloneNode(true);
          prob === 'title' ? this.titleTemplate = clo : prob === 'content' ? this.contentTemplate = clo : this.toastTemplate = clo;
        }
      } catch (e) {
        templateFn = templateCompiler(value);
      }
      if (!isNOU(templateFn)) {
        tempArray = templateFn({}, this, prob);
      }
      if (!isNOU(tempArray) && tempArray.length > 0 && !(isNOU(tempArray[0].tagName) && tempArray.length === 1) ) {
        [].slice.call(tempArray).forEach((el: HTEle): void => {
          if (!isNOU(el.tagName)) {
            el.style.display = '';
          }
          ele.appendChild(el);
        });
      } else if (ele.childElementCount === 0) {
          ele.innerHTML = value;
      }
      return ele;
    }

    private clearProgress(intervalId: number) : void {
      if (!isNOU(this.intervalId[intervalId])) {
        clearInterval(this.intervalId[intervalId]);
        delete this.intervalId[intervalId];
      }
      if (!isNOU(this.progressObj[intervalId])) {
        clearInterval(this.progressObj[intervalId].intervalId);
        delete this.progressObj[intervalId]; }
    }

    private clearContainerPos(): void {
      if (this.customPosition) {
        setStyleAttribute(this.toastContainer, {'left': '', 'top': ''});
        this.toastContainer = null;
        this.customPosition = false;
      } else {
      [ROOT + '-top-left',
       ROOT + '-top-right',
       ROOT + '-bottom-left',
       ROOT + '-bottom-right',
       ROOT + '-bottom-center',
       ROOT + '-top-center',
       ROOT + '-full-width'].forEach((pos: string) => {
        if (!isNOU(this.toastContainer) && this.toastContainer.classList.contains(pos)) {
          this.toastContainer.classList.remove(pos); }
      });
      this.toastContainer = null;  }
      if (!isNOU(this.titleTemplate)) {
        this.clearTitleTemplate(); }
      if (!isNOU(this.contentTemplate)) {
        this.clearContentTemplate(); }
      if (!isNOU(this.toastTemplate)) {
        this.clearToastTemplate(); }
    }

    private clearTitleTemplate(): void {
      this.titleTemplate.style.display = 'none';
      document.body.appendChild(this.titleTemplate);
      this.titleTemplate = null;
    }

    private clearContentTemplate(): void {
      this.contentTemplate.style.display = 'none';
      document.body.appendChild(this.contentTemplate);
      this.contentTemplate = null;
    }

    private clearToastTemplate(): void {
      this.toastTemplate.style.display = 'none';
      document.body.appendChild(this.toastTemplate);
      this.toastTemplate = null;
    }

    private destroyToast( toastEle: HTEle): void {
      let hideAnimate: ToastAnimationsModel = this.animation.hide;
      let animate: AnimationModel = {
        duration : hideAnimate.duration, name: hideAnimate.effect, timingFunction: hideAnimate.easing
       };
      let intervalId: number = parseInt(toastEle.id.split('toast_')[1], 10);
      let toastClose: ToastCloseArgs = {
        toastContainer: this.toastContainer,
        toastObj: this,
      };
      if (!isNOU(this.progressObj[intervalId]) && !isNOU(toastEle.querySelector('.' + PROGRESS)) ) {
        this.progressObj[intervalId].progressEle.style.width = '0%'; }
      animate.end = () => {
        this.clearProgress(intervalId);
        detach(toastEle);
        this.trigger('close', toastClose);
        if (this.toastContainer.childElementCount === 0) { this.clearContainerPos(); }
      };
      new Animation({}).animate(toastEle, animate);
    }

    private personalizeToast(): void {
      this.setIcon();
      this.setTitle();
      this.setContent();
      this.actionButtons();
    }

    private setAria(): void {
      attributes(this.toastEle, { 'role': 'alert' });
    }
    private setPositioning(pos: ToastPositionModel): void {
       if (typeof(pos.X) === 'number' || typeof(pos.Y) === 'number' || pos.X.indexOf('%') !== -1 || pos.Y.indexOf('%') !== -1 ) {
         setStyleAttribute(this.toastContainer , { 'left' : formatUnit(pos.X), 'top': formatUnit(pos.Y)});
         this.customPosition = true;
       } else {
       this.toastContainer.classList.add(ROOT + '-' + pos.Y.toString().toLowerCase() + '-' + pos.X.toString().toLowerCase()); }
    }

    private setCloseButton(): void {
     if (!this.showCloseButton) { return; }
     let closeBtn: HTEle = this.createElement ('div' , {className : CLOSEBTN + ' e-icons '});
     this.toastEle.appendChild(closeBtn);
    }

    private setProgress(): void {
      if (this.timeOut > 0) {
        let id: number = parseInt(this.toastEle.id.split('toast_')[1], 10);
        this.intervalId[id] = window.setTimeout(this.destroyToast.bind(this, this.toastEle), this.timeOut);
        this.progressObj[id] = { hideEta : null, intervalId: null, maxHideTime: null, element: null, timeOutId: null, progressEle: null };
        this.progressObj[id].maxHideTime = parseFloat(this.timeOut + '');
        this.progressObj[id].hideEta = new Date().getTime() + this.progressObj[id].maxHideTime;
        this.progressObj[id].element = this.toastEle;
        if (this.extendedTimeout > 0) {
          EventHandler.add(this.toastEle, 'mouseover', this.toastHoverAction.bind(this, id));
          EventHandler.add(this.toastEle, 'mouseleave', this.delayedToastProgress.bind(this, id));
          this.progressObj[id].timeOutId = this.intervalId[id];
        }
        if (this.showProgressBar) {
          this.progressBarEle = this.createElement('div', {className : PROGRESS});
          this.toastEle.insertBefore(this.progressBarEle, this.toastEle.children[0]);
          this.progressObj[id].intervalId = setInterval(this.updateProgressBar.bind(this, this.progressObj[id]), 10);
          this.progressObj[id].progressEle = this.progressBarEle;
        }
      }
    }

    private toastHoverAction(id: number) : void {
      clearTimeout(this.progressObj[id].timeOutId);
      clearInterval(this.progressObj[id].intervalId);
      this.progressObj[id].hideEta = 0;
      let toastEle: HTEle =  this.progressObj[id].element;
      if (!isNOU(toastEle.querySelector('.' + PROGRESS))) {
        this.progressObj[id].progressEle.style.width = '0%'; }
    }

    private delayedToastProgress(id: number): void {
     let progress: Progressbar = this.progressObj[id];
     let toastEle: HTEle = progress.element;
     progress.timeOutId = window.setTimeout(this.destroyToast.bind(this, toastEle), this.extendedTimeout);
     progress.maxHideTime = parseFloat(this.extendedTimeout + '');
     progress.hideEta = new Date().getTime() + progress.maxHideTime;
     if (!isNOU(toastEle.querySelector('.' + PROGRESS))) {
      progress.intervalId = setInterval(this.updateProgressBar.bind(this, progress), 10); }
    }

    private updateProgressBar(progressObj: Progressbar): void {
      let percentage: number = ((progressObj.hideEta - (new Date().getTime())) / progressObj.maxHideTime) * 100;
      progressObj.progressEle.style.width = percentage + '%';
    }

    private setIcon(): void {
      if (isNOU(this.icon) || this.icon.length === 0) { return; }
      let iconEle: HTEle = this.createElement('div', { className: ICON + ' e-icons ' + this.icon});
      this.toastEle.appendChild(iconEle);
    }

    private setTitle(): void {
      if (isNOU(this.title)) { return; }
      let titleEle: HTEle = this.createElement('div', { className: TITLE});
      titleEle = this.fetchEle(titleEle , this.title, 'title');
      let msgContainer: HTEle = this.createElement('div', {className: MESSAGE});
      msgContainer.appendChild(titleEle);
      this.toastEle.appendChild(msgContainer);
    }

    private setContent(): void {
      let contentEle: HTEle = this.createElement('div', { className: CONTENT});
      let ele: HTEle = this.element;
      if (isNOU(this.content) || this.content === '') {
        let isContent: boolean = this.element.innerHTML.replace(/\s/g, '') !== '';
        if ((ele.children.length > 0 || isContent) && !ele.firstElementChild.classList.contains(ROOT) ) {
          this.innerEle = document.createDocumentFragment();
          let tempEle: HTEle = this.createElement('div');
          while ( ele.childNodes.length !== 0 ) {
              this.innerEle.appendChild(this.element.childNodes[0]);
          }
          contentEle.appendChild(this.innerEle);
          [].slice.call(contentEle.children).forEach((ele: HTEle) => {
            tempEle.appendChild(ele.cloneNode(true));
          });
          this.content = tempEle;
          this.appendMessageContainer(contentEle);
      }
      } else {
        if (typeof (this.content) === 'object' && !isNOU((this.content as HTEle).tagName)) {
          contentEle.appendChild(this.content);
          this.content = <HTEle>this.content.cloneNode(true);
          this.appendMessageContainer(contentEle);
        } else {
      contentEle = this.fetchEle(contentEle, this.content as string, 'content');
      this.appendMessageContainer(contentEle); }}
    }

    private appendMessageContainer(element: HTEle ): void {
      if (this.toastEle.querySelectorAll('.' + MESSAGE).length > 0) {
        this.toastEle.querySelector('.' + MESSAGE).appendChild(element);
      } else {
      let msgContainer: HTEle = this.createElement('div', {className: MESSAGE});
      msgContainer.appendChild(element);
      this.toastEle.appendChild(msgContainer);
      }
    }

    private actionButtons(): void {
      let actionBtnContainer: HTEle = this.createElement('div', {className: ACTIOBUTTONS});
      [].slice.call(this.buttons).forEach((actionBtn: ButtonModelPropsModel) => {
        if (isNOU(actionBtn.model)) { return; }
        let btnDom: HTMLButtonElement = this.createElement('button') as HTMLButtonElement;
        btnDom.setAttribute('type', 'button');
        if (isNOU(actionBtn.model.cssClass) ||  actionBtn.model.cssClass.length === 0) {
          actionBtn.model.cssClass = 'e-primary'; }
        btnDom.classList.add('e-small');
        new Button(actionBtn.model, btnDom);
        if (!isNOU(actionBtn.click) && typeof(actionBtn.click) === 'function') {
          EventHandler.add(btnDom, 'click', actionBtn.click); }
        actionBtnContainer.appendChild(btnDom);
      });
      if (actionBtnContainer.childElementCount > 0) {
        this.appendMessageContainer(actionBtnContainer);
      }
    }

    private appendToTarget(): void {
      let toastBeforeOpen: ToastBeforeOpenArgs = {
        toastObj: this,
        element: this.toastEle,
        cancel: false };
      this.trigger('beforeOpen', toastBeforeOpen);
      if (toastBeforeOpen.cancel) {
        return; }
      this.toastEle.style.display = 'none';
      if (this.newestOnTop && this.toastContainer.childElementCount !== 0) {
        this.toastContainer.insertBefore(this.toastEle, this.toastContainer.children[0]);
      } else {
        this.toastContainer.appendChild(this.toastEle); }
      EventHandler.add(this.toastEle, 'click', this.clickHandler, this);
      this.toastContainer.style.zIndex = getZindexPartial(this.toastContainer) + '';
      this.displayToast(this.toastEle);
    }

    private clickHandler(e: Event): void {
      e.stopPropagation();
      let target: HTEle = e.target as HTEle;
      let toastEle: HTEle = closest(target , '.' + ROOT) as HTEle;
      let clickArgs: ToastClickEventArgs = {
        element: toastEle, cancel: false, clickToClose: false, originalEvent: e, toastObj: this };
      let isCloseIcon: boolean = target.classList.contains(CLOSEBTN);
      this.trigger('click', clickArgs);
      if ((isCloseIcon && !clickArgs.cancel ) || clickArgs.clickToClose) {
         this.destroyToast(toastEle); }
    }

    private displayToast(toastEle: HTEle): void {
      let showAnimate: ToastAnimationsModel = this.animation.show;
      let animate: AnimationModel = {
        duration : showAnimate.duration, name: showAnimate.effect, timingFunction: showAnimate.easing
       };
      let toastOpen: ToastOpenArgs = {
        toastObj: this,
        element: this.toastEle,
      };
      animate.begin = () => {
        toastEle.style.display = ''; };
      animate.end = () => {
        this.trigger('open', toastOpen);
      };
      new Animation(animate).animate(toastEle);
    }

    private getContainer( ): HTEle {
      this.element.classList.add(CONTAINER);
      return this.element;
    }

    /**
     * Called internally if any of the property value changed.
     * @private
     */
    public onPropertyChanged(newProp: ToastModel, oldProp: ToastModel): void {
      let container: HTMLElement = this.element;
      for (let prop of Object.keys(newProp)) {
        switch (prop) {
            case 'enableRtl':
              newProp.enableRtl ? container.classList.add(RTL) : container.classList.remove(RTL);
              break;
        }
      }

    }
}
