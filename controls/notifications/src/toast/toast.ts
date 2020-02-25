import { Component, Property, ChildProperty, INotifyPropertyChanged, NotifyPropertyChanges, Animation } from '@syncfusion/ej2-base';
import { Browser, isNullOrUndefined as isNOU,  getUniqueID, formatUnit, EventHandler, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { EmitType, Collection, Complex, setStyleAttribute, Event, Effect, detach, AnimationModel, L10n } from '@syncfusion/ej2-base';
import { attributes, extend, closest, compile as templateCompiler, classList, BaseEventArgs, isUndefined} from '@syncfusion/ej2-base';
import { SwipeEventArgs, Touch, updateBlazorTemplate, isBlazor, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { ButtonModel, Button  } from '@syncfusion/ej2-buttons';
import { getZindexPartial } from '@syncfusion/ej2-popups';
import { ToastModel, ButtonModelPropsModel, ToastPositionModel } from './toast-model';
import {  ToastAnimationsModel, ToastAnimationSettingsModel } from './toast-model';

export interface SanitizeSelectors {
  /** Returns the tags. */
  tags?: string[];
  /** Returns the attributes. */
  attributes?: SanitizeRemoveAttrs[];
}

export interface BeforeSanitizeHtmlArgs {
  /** Illustrates whether the current action needs to be prevented or not. */
  cancel?: boolean;
  /** It is a callback function and executed it before our inbuilt action. It should return HTML as a string.
   * @function
   * @param {string} value - Returns the value.
   * @returns {string}
   */
  helper?: Function;
  /** Returns the selectors object which carrying both tags and attributes selectors to block list of cross-site scripting attack.
   *  Also possible to modify the block list in this event.
   */
  selectors?: SanitizeSelectors;
}

export interface SanitizeRemoveAttrs {
  /** Defines the attribute name to sanitize */
  attribute?: string;
  /** Defines the selector that sanitize the specified attributes within the selector */
  selector?: string;
}

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
  /** 
   * Defines the Toast object.
   * @deprecated
   */
  toastObj?: Toast;
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
  /** 
   * Defines the Toast object.
   * @deprecated
   */
  toastObj?: Toast;
  /** Defines current Toast model properties as options. */
  options?: ToastModel;
  /** Defines the Toast element. */
  element: HTMLElement;
  /** Defines the prevent action for before opening toast. */
  cancel : boolean;
}

/**
 * Toast Collection model
 * @hidden
 */
export interface CollectionToast extends ToastModel {
  /**
   * Element of the current toast
   */
  element?: HTMLElement[];
}

/**
 * Specifies the event arguments of Toast open.
 */
export interface ToastOpenArgs extends BaseEventArgs {
  /** 
   * Defines the Toast object.
   * @deprecated
   */
  toastObj?: Toast;
  /** Defines current Toast model properties as options. */
  options?: ToastModel;
  /** Defines the Toast element. */
  element: HTMLElement;
}

/**
 * Specifies the event arguments of Toast close.
 */
export interface ToastCloseArgs extends BaseEventArgs {
  /** Defines the Toast container element. */
  toastContainer: HTMLElement;
  /** Defines current Toast model properties as options. */
  options?: ToastModel;
  /** 
   * Defines the Toast object.
   * @deprecated
   */
  toastObj?: Toast;
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
const TOAST_REF_ELEMENT: string = 'e-toast-ref-element';

/**
 * An object that is used to configure the Toast X Y positions.
 */
export class ToastPosition extends ChildProperty<ToastPosition> {
  /**
   * Specifies the position of the Toast notification with respect to the target container's left edge.
   * @default 'Left'
   * @aspType string
   * @blazorType string
   */
  @Property('Left')
  public X: PositionX | number | string;

  /**
   * Specifies the position of the Toast notification with respect to the target container's top edge.
   * @default 'Top'
   * @aspType string
   * @blazorType string
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
   * @default null
   */
  @Property(null)
  public model: ButtonModel;

  /**
   * Specifies the click event binding of action buttons created within Toast.
   * @event
   * @blazorProperty 'Clicked'
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
   * @default 'FadeIn'
   * @aspType string
   */
  @Property('FadeIn')
  public effect: Effect;
  /**
   * Specifies the duration to animate.
   * @default 600
   */
  @Property(600)
  public duration: number;
  /**
   * Specifies the animation timing function.
   * @default 'ease'
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
    private contentTemplate: HTEle;
    private toastTemplate: HTEle;
    private customPosition: boolean;
    private isDevice: Boolean;
    private innerEle: Node;
    private toastCollection: CollectionToast[] = [];
    private l10n: L10n;
    private isDestroy: boolean = false;
    private refElement: HTMLElement;

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
     * @blazorType string
     */
    @Property('300px')
    public width: string | number;

    /**
     * Specifies the height of the Toast in pixels/number/percentage. Number value is considered as pixels.
     * @default 'auto'
     * @blazorType string
     */
    @Property('auto')
    public height: string | number;

    /**
     * Specifies the title to be displayed on the Toast. 
     * Works only with string values.
     * @default null
     */
    @Property(null)
    public title: string;

    /**
     * Specifies the content to be displayed on the Toast. 
     * Accepts selectors, string values and HTML elements.
     * @default null
     * @blazorType string
     */
    @Property(null)
    public content: string | HTMLElement;

    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

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
     * @default { X: "Left", Y: "Top" }
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
     * The default value is null, which refers the `document.body` element.
     * @default null
     * @aspType string
     * @blazorType string
     */
    @Property(null)
    public target: HTMLElement | Element | string;

    /**
     * Triggers the event after the Toast gets created.
     * @event
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Event>;

    /** 
     * Event triggers before sanitize the value.
     * @event 
     * @blazorProperty 'OnSanitizeHtml'
     */
    @Event()
    public beforeSanitizeHtml: EmitType<BeforeSanitizeHtmlArgs>;

    /**
     * Triggers the event after the Toast gets destroyed.
     * @event
     * @blazorProperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Event>;


    /**
     * Triggers the event after the Toast shown on the target container.
     * @event
     * @blazorProperty 'Opened'
     */
    @Event()
    public open: EmitType<ToastOpenArgs>;

    /**
     * Triggers the event before the toast shown.
     * @event
     * @blazorProperty 'OnOpen'
     */
    @Event()
    public beforeOpen: EmitType<ToastBeforeOpenArgs>;
    /**
     * Trigger the event after the Toast hides.
     * @event
     * @blazorProperty 'Closed'
     */
    @Event()
    public close: EmitType<ToastCloseArgs>;
    /**
     * The event will be fired while clicking on the Toast.
     * @event
     * @blazorProperty 'OnClick'
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
        if ((isBlazor && this.isServerRendered)) {
          this.isDestroy = true;
        }
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
        if (isNOU(this.target)) {
          this.target = document.body; }
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
      this.contentTemplate = null;
      this.toastTemplate = null;
      if (this.isDevice && screen.width < 768) {
        new Touch(this.element, { swipe: this.swipeHandler.bind(this) });
      }
      this.renderComplete();
    }
    /**
     * To show Toast element on a document with the relative position.
     * @param  {ToastModel} toastObj? - To show Toast element on screen.
     * @returns void
     */
    public show (toastObj?: ToastModel) : void {
      let collectionObj: CollectionToast;
      if (!isNOU(toastObj)) {
        this.templateChanges(toastObj);
        collectionObj = JSON.parse(JSON.stringify(toastObj));
        extend(this, this, toastObj); }
      if (isNOU(this.toastContainer)) {
        this.toastContainer = this.getContainer();
        let target: HTEle = typeof (this.target) === 'string' ? <HTEle>document.querySelector(this.target) : <HTEle>document.body;
        if (isNOU(target)) {
          return; }
        if (target.tagName === 'BODY') {
          this.toastContainer.style.position = 'fixed';
        } else {
          this.toastContainer.style.position = 'absolute';
          (target as HTEle).style.position = 'relative';
        }
        this.setPositioning(this.position);
        if (isBlazor && this.isServerRendered) {
          this.refElement = this.createElement('div', { className: TOAST_REF_ELEMENT });
          this.toastContainer.parentElement.insertBefore(this.refElement, this.toastContainer);
        }
        target.appendChild(this.toastContainer);
      }
      this.toastEle = this.createElement('div', { className: ROOT, id: getUniqueID('toast') });
      this.setWidthHeight();
      this.setCSSClass(this.cssClass);
      (isNOU(this.template) || this.template === '') ? this.personalizeToast() : this.templateRendering();
      this.setProgress();
      this.setCloseButton();
      this.setAria();
      this.appendToTarget(toastObj);
      if (!isNOU(collectionObj)) {
        extend(collectionObj, {element: [this.toastEle]}, true);
        this.toastCollection.push(collectionObj);
      }
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
      if (!isUndefined(toastObj.template) && !isNOU(this.toastTemplate) && this.template !== toastObj.template) {
        this.clearToastTemplate(); }
    }

    private setCSSClass(cssClass: string): void {
      if (cssClass) {
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
     * @hidden
     */
    public sanitizeHelper(value: string): string {
      if (this.enableHtmlSanitizer) {
        let item: BeforeSanitizeHtmlArgs = SanitizeHtmlHelper.beforeSanitize();
        let beforeEvent: BeforeSanitizeHtmlArgs = {
          cancel: false,
          helper: null
        };
        extend(item, item, beforeEvent);
        this.trigger('beforeSanitizeHtml', item);
        if (item.cancel && !isNOU(item.helper)) {
          value = item.helper(value);
        } else if (!item.cancel) {
          value = SanitizeHtmlHelper.serializeValue(item, value);
        }
      }
      return value;
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
          this.destroyToast(this.toastContainer.children[i] as HTEle);
        }
        let target: HTEle = typeof (this.target) === 'string' ? <HTEle>document.querySelector(this.target) : <HTEle>document.body;
        if (!isNOU(target) && this.isDestroy && !isNOU(this.refElement)) {
          this.refElement.parentElement.insertBefore(this.toastContainer, this.refElement);
          detach(this.refElement);
          this.refElement = undefined;
        }
        return;
      }
      if (isNOU(element)) {
        element = <HTEle> (this.newestOnTop ? this.checkBlazorTemp(this.toastContainer.lastElementChild) :
        this.toastContainer.firstElementChild);
      }
      this.destroyToast(element as HTEle);
    }

    private checkBlazorTemp(element: Element): HTMLElement {
      while (element.classList.contains('blazor-template')) {
          element = element.previousElementSibling;
      }
      return element as HTMLElement;
    }

    private fetchEle (ele: HTEle, value: string, prob: string): HTEle {
      value = typeof (value) === 'string' ? this.sanitizeHelper(value) : value;
      let templateFn: Function;
      let tempVar: HTEle;
      let tmpArray: HTEle[];
      let templateProps: string;
      let templateValue: string;
      let blazorContain: string[] = Object.keys(window) as string[];
      if (ele.classList.contains(TITLE)) {
        templateProps = this.element.id + 'title';
      } else if (ele.classList.contains(CONTENT)) {
        templateProps = this.element.id + 'content';
      } else {
        templateProps = this.element.id + 'template';
      }
      prob === 'content' ? tempVar = this.contentTemplate : tempVar = this.toastTemplate;
      if (!isNOU(tempVar)) {
        ele.appendChild(tempVar.cloneNode(true));
        return ele; }
      try {
        if (document.querySelectorAll(value).length > 0) {
          let elem: HTEle = null;
          if (prob !== 'title') {
            elem = <HTEle>document.querySelector(value);
            ele.appendChild(elem);
            elem.style.display = '';
          }
          let clo: HTEle = isNOU(<HTEle>elem) ? tempVar : <HTEle>elem.cloneNode(true);
          prob === 'content' ? this.contentTemplate = clo : this.toastTemplate = clo;
        }
      } catch (e) {
        templateFn = templateCompiler(value);
        templateValue = value;
      }
      if (!isNOU(templateFn)) {
        if (!isBlazor()) {
          tmpArray = templateFn({}, this, prob, null, true);
        } else {
          let isString: boolean = (blazorContain.indexOf('ejsInterop') !== -1 &&
                !this.isStringTemplate && (templateValue).indexOf('<div>Blazor') === 0 ) ?
                this.isStringTemplate : true;
          tmpArray = templateFn({}, this, prob, templateProps, isString);
        }
      }
      if (!isNOU(tmpArray) && tmpArray.length > 0 && !(isNOU(tmpArray[0].tagName) && tmpArray.length === 1) ) {
        [].slice.call(tmpArray).forEach((el: HTEle): void => {
          if (!isNOU(el.tagName)) {
            el.style.display = '';
          }
          ele.appendChild(el);
        });
        if (blazorContain.indexOf('ejsInterop') !== -1 && !this.isStringTemplate && templateValue.indexOf('<div>Blazor') === 0) {
          this.blazorTemplate(templateProps);
        }
      } else if (ele.childElementCount === 0) {
          ele.innerHTML = value;
      }
      return ele;
    }

    private blazorTemplate(templateProps: string): void {
        if (templateProps === this.element.id + 'title') {
          updateBlazorTemplate(templateProps, 'Title', this, false);
        } else if (templateProps === this.element.id + 'content') {
          updateBlazorTemplate(templateProps, 'Content', this, false);
        } else {
          updateBlazorTemplate(templateProps, 'Template', this, false);
        }
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
      if (!isNOU(this.contentTemplate)) {
        this.clearContentTemplate(); }
      if (!isNOU(this.toastTemplate)) {
        this.clearToastTemplate(); }
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

    private destroyToast(toastEle: HTEle): void {
      let toastObj: CollectionToast;
      for (let i: number = 0; i < this.toastCollection.length; i++) {
        if (this.toastCollection[i].element[0] === toastEle) {
          toastObj = this.toastCollection[i];
          this.toastCollection.splice(i, 1);
        }
      }
      let toastClose: ToastCloseArgs = isBlazor() ? {
        options: toastObj,
        toastContainer: this.toastContainer } : {
          options: toastObj,
          toastContainer: this.toastContainer,
          toastObj: this,
        };
      if (!isNOU(this.isDestroy) && this.isDestroy) {
        if (!toastEle.querySelector('.blazor-inner-template')) { detach(toastEle); }
        if (this.toastContainer.childElementCount === 0) { this.clearContainerPos(); }
      } else {
        let hideAnimate: ToastAnimationsModel = this.animation.hide;
        let animate: AnimationModel = {
          duration : hideAnimate.duration, name: hideAnimate.effect, timingFunction: hideAnimate.easing
        };
        let intervalId: number = parseInt(toastEle.id.split('toast_')[1], 10);
        if (!isNOU(this.progressObj[intervalId]) && !isNOU(toastEle.querySelector('.' + PROGRESS)) ) {
          this.progressObj[intervalId].progressEle.style.width = '0%'; }
        animate.end = () => {
          this.clearProgress(intervalId);
          if (!toastEle.querySelector('.blazor-inner-template')) { detach(toastEle); }
          this.trigger('close', toastClose);
          if (this.toastContainer.childElementCount === 0) { this.clearContainerPos(); }
        };
        new Animation({}).animate(toastEle, animate);
      }
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
       if (!isNaN(parseFloat(pos.X as string)) || !isNaN(parseFloat(pos.Y as string))) {
         setStyleAttribute(this.toastContainer , { 'left' : formatUnit(pos.X), 'top': formatUnit(pos.Y)});
         this.customPosition = true;
       } else {
       this.toastContainer.classList.add(ROOT + '-' + pos.Y.toString().toLowerCase() + '-' + pos.X.toString().toLowerCase()); }
    }

    private setCloseButton(): void {
     if (!this.showCloseButton) { return; }
     let localeText: object = { close: 'Close' };
     this.l10n = new L10n('toast', localeText, this.locale);
     this.l10n.setLocale(this.locale);
     let closeIconTitle: string = this.l10n.getConstant('close');
     let closeBtn: HTEle = this.createElement (
     'div' , {className : CLOSEBTN + ' e-icons ', attrs: { tabindex: '0', 'aria-label': closeIconTitle }});
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
        if ((ele.children.length > 0 || isContent) && !(ele.firstElementChild && ele.firstElementChild.classList.contains(ROOT)) ) {
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

    private appendToTarget(toastObj?: ToastModel): void {
      let toastBeforeOpen: ToastBeforeOpenArgs = isBlazor() ? {
        options: toastObj,
        element: this.toastEle,
        cancel: false } : {
          options: toastObj,
          toastObj: this,
          element: this.toastEle,
          cancel: false
        };
      this.trigger('beforeOpen', toastBeforeOpen, (toastBeforeOpenArgs: ToastBeforeOpenArgs) => {
        if (!toastBeforeOpenArgs.cancel) {
          this.toastEle.style.display = 'none';
          if (this.newestOnTop && this.toastContainer.childElementCount !== 0) {
            this.toastContainer.insertBefore(this.toastEle, this.toastContainer.children[0]);
          } else {
            this.toastContainer.appendChild(this.toastEle); }
          EventHandler.add(this.toastEle, 'click', this.clickHandler, this);
          EventHandler.add(this.toastEle, 'keydown', this.keyDownHandler, this);
          this.toastContainer.style.zIndex = getZindexPartial(this.toastContainer) + '';
          this.displayToast(this.toastEle, toastObj);
        }
      });
    }

    private clickHandler(e: Event): void {
      if (!isBlazor()) { e.stopPropagation(); }
      let target: HTEle = e.target as HTEle;
      let toastEle: HTEle = closest(target , '.' + ROOT) as HTEle;
      let clickArgs: ToastClickEventArgs = isBlazor() ? {
        element: toastEle, cancel: false, clickToClose: false, originalEvent: e } : {
          element: toastEle, cancel: false, clickToClose: false, originalEvent: e, toastObj: this
        };
      let isCloseIcon: boolean = target.classList.contains(CLOSEBTN);
      this.trigger('click', clickArgs, (toastClickArgs: ToastClickEventArgs) => {
        if ((isCloseIcon && !toastClickArgs.cancel ) || toastClickArgs.clickToClose) {
          this.destroyToast(toastEle); }
      });
    }

    private keyDownHandler(e: Event): void {
      if (((e as KeyboardEventArgs).target as HTMLElement).classList.contains(CLOSEBTN) &&
      ((e as KeyboardEventArgs).keyCode === 13 || (e as KeyboardEventArgs).keyCode === 32)) {
        let target: HTEle = e.target as HTEle;
        let toastEle: HTEle = closest(target , '.' + ROOT) as HTEle;
        this.destroyToast(toastEle);
      }
    }

    private displayToast(toastEle: HTEle, toastObj?: ToastModel): void {
      let showAnimate: ToastAnimationsModel = this.animation.show;
      let animate: AnimationModel = {
        duration : showAnimate.duration, name: showAnimate.effect, timingFunction: showAnimate.easing
       };
      let toastOpen: ToastOpenArgs = isBlazor() ? {
        options: toastObj,
        element: this.toastEle } : {
          options: toastObj,
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
