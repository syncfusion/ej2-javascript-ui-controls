import { Effect, closest, removeClass, extend, detach, Touch, Browser, Animation, createElement } from '@syncfusion/ej2-base';
import { EventHandler, SwipeEventArgs, BlazorDotnetObject, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { AnimationModel, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ToastAnimationsModel, ToastAnimationSettingsModel } from '../src/toast/toast-model';
import { getZindexPartial } from '@syncfusion/ej2-popups';

const CREATED_EVENT: string = 'CreatedEvent';
const CLOSE_EVENT: string = 'CloseEvent';
const OPEN_EVENT: string = 'OpenEvent';
const DESTROY_TIMER: string = 'DestroyTimer';
const MOUSEOVER_EVENT: string = 'MouseoverEvent';
const CLOSEBTN: string = 'e-toast-close-icon';
const ROOT: string = 'e-toast';
const TOAST_BLAZOR_HIDDEN: string = 'e-blazor-toast-hidden';
const PROGRESS: string = 'e-toast-progress';
const HUN_PERCENT: string = '100%';
const DEFAULT_WIDTH: string = '300px';
const FULL_WIDTH: string = 'e-toast-full-width';
const STRING: string = 'string';
const RELATIVE: string = 'relative';
const BODY: string = 'BODY';
const RIGHT: string = 'Right';
const LEFT: string = 'Left';
const ELEMENT: string = 'element';
const ALL: string = 'All';
const ENTER_KEY: number = 13;
const SPACE_KEY: number = 32;
const TOAST_PRE: string = 'e-toast';
const TOAST_CONTAINER: string = 'e-toast-container';
const KEYDOWN: string = 'keydown';
const FIXED: string = 'fixed';
const ABSOLUTE: string = 'absolute';
const MOUSE_OVER: string = 'mouseover';
const MOUSE_LEAVE: string = 'mouseleave';
const TOAST_ID: string = 'toast_';
const MIN_SCREEN_WIDTH: number = 768;
const TOAST_REF_ELEMENT: string = 'e-toast-ref-element';

interface Progressbar {
  maxHideTime: number;
  intervalId: number;
  timeOutId: number;
  hideEta: number;
  element: HTMLElement;
  progressEle: HTMLElement;
}

class SfToast {
    private element: BlazorToastElement;
    private dotNetRef: BlazorDotnetObject;
    private target: HTMLElement | string;
    private toastContainer : HTMLElement;
    public animation: ToastAnimationSettingsModel;
    private showAnimation : ToastAnimationsModel;
    private hideAnimation : ToastAnimationsModel;
    private newestOnTop : boolean;
    private isDevice: Boolean;
    private width: string;
    private progressObj: Progressbar[] = [];
    private extendedTimeout : number;
    private refElement: HTMLElement;

    constructor(element: BlazorToastElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(options);
        this.element.blazor__instance = this;
    }

    public initialize(element : HTMLElement): void {
      this.refElement = createElement('div', { className: TOAST_REF_ELEMENT });
      this.toastContainer = element;
      let parentEle: HTMLElement = element.parentElement;
      parentEle.insertBefore(this.refElement, element);
      this.isDevice = Browser.isDevice;
      if (this.width === DEFAULT_WIDTH) {
        this.width = (this.isDevice && screen.width < MIN_SCREEN_WIDTH) ? HUN_PERCENT : DEFAULT_WIDTH;
        this.toastContainer.classList.add(FULL_WIDTH);
      }
      if (this.isDevice && screen.width < MIN_SCREEN_WIDTH) {
        new Touch(this.element, { swipe: this.swipeHandler.bind(this) });
      }
      this.dotNetRef.invokeMethodAsync(CREATED_EVENT, null);
    }

    public show(options: { [key: string]: Object }): void {
      this.setAnimation(options);
      let target: HTMLElement = typeof (this.target) === STRING ? <HTMLElement>document.querySelector(this.target as string) :
        <HTMLElement>document.body;
      (options.rootElement as HTMLElement).style.zIndex = getZindexPartial(options.rootElement as HTMLElement) + '';
      if (isNullOrUndefined(target)) {
        return;
      }
      if (target.tagName === BODY) {
       this.toastContainer.style.position = FIXED;
     } else {
       this.toastContainer.style.position = ABSOLUTE;
       (target as HTMLElement).style.position = RELATIVE;
     }
      target.appendChild(this.toastContainer);
      this.appendToast(options.element as HTMLElement);
      let id: number = parseInt((options.element as HTMLElement).id.split(TOAST_ID)[1], 10);
      this.progressObj[id] = { hideEta: null, intervalId: null, maxHideTime: null, element: null, timeOutId: null, progressEle: null };
      this.progressObj[id].element = options.element as HTMLElement;
      if (this.extendedTimeout > 0) {
        EventHandler.add(options.element as HTMLElement, MOUSE_OVER, this.toastHoverAction.bind(this, id));
        EventHandler.add(options.element as HTMLElement, MOUSE_LEAVE, this.delayedToastProgress.bind(this, id));
      }
      if (options.showProgressBar) {
        this.progressObj[id].progressEle = (options.element as HTMLElement).querySelector('.' + PROGRESS);
      }
      EventHandler.add(options.element as HTMLElement, KEYDOWN , this.keyDownHandler, this);
    }

    private getDomObject(value: string, element: HTMLElement): string {
      if (element != null) {
          // tslint:disable-next-line
          return (<any>window).sfBlazor.getDomObject(value, element);
      } else {
          return null;
      }
    }

    private swipeHandler(e: SwipeEventArgs): void {
      let toastEle: HTMLElement = <HTMLElement>closest(<Element>e.originalEvent.target, '.' + TOAST_PRE + ':not(.' + TOAST_CONTAINER + ')');
      let animation: Effect = this.hideAnimation.effect;
      if (!isNullOrUndefined(toastEle)) {
        if (e.swipeDirection === RIGHT) {
          this.hideAnimation.effect = 'SlideRightOut';
          this.hide(toastEle);
        } else if (e.swipeDirection === LEFT) {
          this.hideAnimation.effect = 'SlideLeftOut';
          this.hide(toastEle);
        }
        this.hideAnimation.effect =  animation;
      }
    }

    private delayedToastProgress(id: number): void {
      let progress: Progressbar = this.progressObj[id];
      let toastEle: HTMLElement = progress.element;
      progress.timeOutId = window.setTimeout(this.destroyToast.bind(this, toastEle), this.extendedTimeout);
      progress.maxHideTime = parseFloat(this.extendedTimeout + '');
      progress.hideEta = new Date().getTime() + progress.maxHideTime;
      if (!isNullOrUndefined(toastEle.querySelector('.' + PROGRESS))) {
        progress.intervalId = setInterval(this.updateProgressBar.bind(this, progress), 10);
      }
    }

    private toastHoverAction(id: number): void {
      this.dotNetRef.invokeMethodAsync('ClearTimeout', id);
      clearTimeout(this.progressObj[id].timeOutId);
      clearInterval(this.progressObj[id].intervalId);
      this.progressObj[id].hideEta = 0;
      let toastEle: HTMLElement = this.progressObj[id].element;
      if (!isNullOrUndefined(toastEle.querySelector('.' + PROGRESS))) {
        this.progressObj[id].progressEle.style.width = '0%';
      }
      this.dotNetRef.invokeMethodAsync(MOUSEOVER_EVENT, id);
    }

    private updateProgressBar(progressObj: Progressbar): void {
      let percentage: number = ((progressObj.hideEta - (new Date().getTime())) / progressObj.maxHideTime) * 100;
      progressObj.progressEle.style.width = percentage + '%';
    }

    public appendToast(toastElement: HTMLElement): void {
      if (this.newestOnTop && this.toastContainer.childElementCount !== 0) {
        this.toastContainer.insertBefore(toastElement, this.toastContainer.children[0]);
      }
      removeClass([toastElement], TOAST_BLAZOR_HIDDEN);
    }

     private setAnimation(toastObj: { [key: string]: Object }): void {
       let proxy: SfToast = this;
       let showAnimate: ToastAnimationsModel = this.showAnimation;
       let animate: AnimationModel = { duration: showAnimate.duration, name: showAnimate.effect, timingFunction: showAnimate.easing };
       animate.begin = () => { (toastObj.element as HTMLElement).style.display = ''; };
       animate.end = () => {
         proxy.dotNetRef.invokeMethodAsync(OPEN_EVENT, toastObj.index, this.getDomObject(ELEMENT, toastObj.element as HTMLElement));
       };
       new Animation(animate).animate(toastObj.element as HTMLElement);
      }

      public hide(element?: HTMLElement | Element | string): void {
        if (isNullOrUndefined(this.toastContainer) || this.toastContainer.childElementCount === 0) { return; }
        if (typeof element === STRING && element === ALL) {
          for (let i: number = 0; i < this.toastContainer.childElementCount; i++) {
            this.destroyToast(this.toastContainer.children[i] as HTMLElement);
          }
          return;
        } else if (typeof element === STRING && element !== ALL) {
          let ele : HTMLElement = this.toastContainer.querySelector('#toast_' + element);
          if (ele) {
            this.destroyToast(ele as HTMLElement);
            this.dotNetRef.invokeMethodAsync(DESTROY_TIMER, parseInt(element as string, 10));
          }
        }
        if (isNullOrUndefined(element)) {
          element = <HTMLElement>(this.newestOnTop ? this.toastContainer.lastElementChild : this.toastContainer.firstElementChild);
        }
        this.destroyToast(element as HTMLElement);
        let id : number = parseInt((element as HTMLElement).id.split('toast_')[1], 10);
        this.dotNetRef.invokeMethodAsync(DESTROY_TIMER, id );
      }

     public destroyToast(element : HTMLElement): void {
       let proxy: SfToast = this;
       let hideAnimate: ToastAnimationsModel = this.hideAnimation;
       let animate: AnimationModel = {
         duration: hideAnimate.duration, name: hideAnimate.effect, timingFunction: hideAnimate.easing
       };
       animate.end = () => {
        let id : number = parseInt((element as HTMLElement).id.split('toast_')[1], 10);
        detach(element);
        proxy.dotNetRef.invokeMethodAsync(CLOSE_EVENT, id);
       };
       new Animation({}).animate(element, animate);
     }

     public destroy(): void {
      while (this.toastContainer.attributes.length > 0) {
          this.toastContainer.removeAttribute(this.toastContainer.attributes[0].name);
      }
      let splitNodes: HTMLCollection = this.toastContainer.children;
      for (let i: number = splitNodes.length - 1; i >= 0; i--) {
          detach(splitNodes[i]);
      }
      if (!isNullOrUndefined(this.refElement) && !isNullOrUndefined(this.refElement.parentElement)) {
        this.refElement.parentElement.insertBefore(this.toastContainer, this.refElement);
        detach(this.refElement);
        this.refElement = undefined;
      }
  }

  private keyDownHandler(e: Event): void {
    if (((e as KeyboardEventArgs).target as HTMLElement).classList.contains(CLOSEBTN) &&
      ((e as KeyboardEventArgs).keyCode === ENTER_KEY || (e as KeyboardEventArgs).keyCode === SPACE_KEY)) {
      let target: HTMLElement = e.target as HTMLElement;
      let toastEle: HTMLElement = closest(target, '.' + ROOT) as HTMLElement;
      this.destroyToast(toastEle);
    }
  }

      public updateContext(toastObj: { [key: string]: Object }): void {
         extend(this, this, toastObj);
     }
 }

// tslint:disable-next-line
let Toast: object = {
    initialize(element: BlazorToastElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject): void {
        if (!isNullOrUndefined(element)) {
          new SfToast(element, options, dotnetRef);
          element.blazor__instance.initialize(element);
        }
    },
    show(toastObj: { [key: string]: Object }): void {
      if (!isNullOrUndefined(toastObj.rootElement)) {
      (toastObj.rootElement as BlazorToastElement).blazor__instance.updateContext(toastObj);
      (toastObj.rootElement as BlazorToastElement).blazor__instance.show(toastObj);
      }
    },
    hide(element: BlazorToastElement, toastElement: HTMLElement, toastObj: { [key: string]: Object }): void {
      if (!isNullOrUndefined(element)) {
        element.blazor__instance.updateContext(toastObj);
        element.blazor__instance.hide(toastElement);
      }
    },
    appendToast(element: BlazorToastElement, toastElement : HTMLElement ): void {
      if (!isNullOrUndefined(element)) {
        element.blazor__instance.appendToast(toastElement);
      }
  },
    destroy(element: BlazorToastElement): void {
      if (!isNullOrUndefined(element)) {
        element.blazor__instance.destroy();
      }
    }
};

interface BlazorToastElement extends HTMLElement {
    blazor__instance: SfToast;
}

export default Toast;
