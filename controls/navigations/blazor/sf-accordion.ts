import { BlazorDotnetObject, closest, KeyboardEvents, EventHandler, rippleEffect, attributes } from '@syncfusion/ej2-base';
import { KeyboardEventArgs, select, isVisible, Effect, selectAll } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, isRippleEnabled, addClass, removeClass } from '@syncfusion/ej2-base';
import { setStyleAttribute as setStyle, Animation, AnimationModel } from '@syncfusion/ej2-base';
import { ExpandEventArgs, AccordionAnimationSettingsModel } from '../src/accordion';

type ExpandMode = 'Single' | 'Multiple';
type HTEle = HTMLElement;

const CLS_ACRDN_ROOT: string = 'e-acrdn-root';
const CLS_ROOT: string = 'e-accordion';
const CLS_ITEM: string = 'e-acrdn-item';
const CLS_ITEMFOCUS: string = 'e-item-focus';
const CLS_ITEMHIDE: string = 'e-hide';
const CLS_HEADER: string = 'e-acrdn-header';
const CLS_CONTENT: string = 'e-acrdn-panel';
const CLS_TOOGLEICN: string = 'e-toggle-icon';
const CLS_EXPANDICN: string = 'e-expand-icon';
const CLS_CTNHIDE: string = 'e-content-hide';
const CLS_SLCT: string = 'e-select';
const CLS_SLCTED: string = 'e-selected';
const CLS_ACTIVE: string = 'e-active';
const CLS_ANIMATE: string = 'e-animate';
const CLS_DISABLE: string = 'e-overlay';
const CLS_TOGANIMATE: string = 'e-toggle-animation';
const CLS_NEST: string = 'e-nested';
const CLS_EXPANDSTATE: string = 'e-expand-state';
const CLS_SCOPE: string = 'scope';
const CLS_RTL: string = 'e-rtl';

class SfAccordion {
  private lastActiveItemId: string;
  private keyModule: KeyboardEvents;
  private isNested: Boolean;
  private isDestroy: Boolean;
  private accItem: HTEle[];
  private removeRippleEffect: Function;
  private keyConfigs: { [key: string]: string } = {
    moveUp: 'uparrow',
    moveDown: 'downarrow',
    enter: 'enter',
    space: 'space',
    home: 'home',
    end: 'end',
  };
  public element: BlazorAccordionElement;
  public dotNetRef: BlazorDotnetObject;
  public options: IAccordionOptions;
  constructor(element: BlazorAccordionElement, options: IAccordionOptions, dotnetRef: BlazorDotnetObject) {
    this.element = element;
    this.element.blazor__instance = this;
    this.dotNetRef = dotnetRef;
    this.options = options;
  }
  public destroy(): void {
    let ele: HTEle = this.element;
    this.unwireEvents();
    this.isDestroy = true;
    ele.classList.remove(CLS_ACRDN_ROOT);
    if (!this.isNested && isRippleEnabled) {
      this.removeRippleEffect();
    }
  }
  public render(): void {
    let nested: Element = closest(this.element, '.' + CLS_CONTENT);
    this.isNested = false;
    if (!this.isDestroy) {
      this.isDestroy = false;
    }
    if (!isNOU(nested)) {
      nested.classList.add(CLS_NEST);
      this.isNested = true;
    } else {
      this.element.classList.add(CLS_ACRDN_ROOT);
    }
    this.wireFocusEvents();
    this.wireEvents();
  }
  public wireFocusEvents(): void {
    let acrdItem: HTEle[] = [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM));
    for (let item of acrdItem) {
      let headerEle: Element = item.querySelector('.' + CLS_HEADER);
      if (item.childElementCount > 0 && headerEle) {
        EventHandler.clearEvents(headerEle);
        EventHandler.add(headerEle, 'focus', this.focusIn, this);
        EventHandler.add(headerEle, 'blur', this.focusOut, this);
      }
    }
  }
  private unwireEvents(): void {
    if (!isNOU(this.keyModule)) {
      this.keyModule.destroy();
    }
  }
  private wireEvents(): void {
    if (!this.isNested && !this.isDestroy) {
      this.removeRippleEffect = rippleEffect(this.element, { selector: '.' + CLS_HEADER });
    }
    if (!this.isNested) {
      this.keyModule = new KeyboardEvents(
        this.element,
        {
          keyAction: this.keyActionHandler.bind(this),
          keyConfigs: this.keyConfigs,
          eventName: 'keydown'
        });
    }
  }
  private focusIn(e: FocusEvent): void {
    (<HTEle>e.target).parentElement.classList.add(CLS_ITEMFOCUS);
  }
  private focusOut(e: FocusEvent): void {
    (<HTEle>e.target).parentElement.classList.remove(CLS_ITEMFOCUS);
  }
  /**
   * To perform expand and collapse action while clicking the item
   */
  public afterContentRender(targetEle: HTEle): void {
    let acrdActive: HTEle[] = [];
    let acrdnItem: HTEle = targetEle;
    let acrdnHdr: HTEle = <HTEle>acrdnItem.children[0];
    let acrdnCtn: HTEle = <HTEle>acrdnItem.children[1];
    let acrdnCtnItem: HTEle;
    if (acrdnHdr) {
      acrdnCtnItem = <HTEle>closest(acrdnHdr, '.' + CLS_ITEM);
    } else if (acrdnCtn) {
      acrdnCtnItem = <HTEle>closest(acrdnCtn, '.' + CLS_ITEM);
    }
    let acrdnchild: HTMLCollection = this.element.children;
    [].slice.call(acrdnchild).forEach((el: HTEle) => {
      if (el.classList.contains(CLS_ACTIVE)) { acrdActive.push(el); }
    });
    let acrdAniEle: HTEle[] = [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM + ' [' + CLS_ANIMATE + ']'));
    if (acrdAniEle.length > 0) {
      for (let el of acrdAniEle) {
        acrdActive.push(el.parentElement);
      }
    }
    let sameContentCheck: boolean = acrdActive.indexOf(acrdnCtnItem) !== -1 && acrdnCtn.getAttribute('e-animate') === 'true';
    let sameHeader: boolean = false;
    if (!isNOU(acrdnItem) && !isNOU(acrdnHdr)) {
      let acrdnCtn: HTEle = <HTEle>select('.' + CLS_CONTENT, acrdnItem);
      let acrdnRoot: HTEle = <HTEle>closest(acrdnItem, '.' + CLS_ACRDN_ROOT);
      let expandState: HTEle = <HTEle>acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
      if (isNOU(acrdnCtn)) {
        return;
      }
      sameHeader = (expandState === acrdnItem);
      if (isVisible(acrdnCtn) && (!sameContentCheck || acrdnCtnItem.classList.contains(CLS_SLCTED))) {
        this.collapse(acrdnCtn);
      } else {
        if ((acrdActive.length > 0) && this.options.expandMode === 'Single' && !sameContentCheck) {
          acrdActive.forEach((el: HTEle) => {
            this.collapse(<HTEle>select('.' + CLS_CONTENT, el));
            el.classList.remove(CLS_EXPANDSTATE);
          });
        }
        this.expand(acrdnCtn);
      }
      if (!isNOU(expandState) && !sameHeader) {
        expandState.classList.remove(CLS_EXPANDSTATE);
      }
    }
  }
  private eleMoveFocus(action: string, root: HTEle, trgt: HTEle): void {
    let clst: HTEle;
    let clstItem: HTEle = <HTEle>closest(trgt, '.' + CLS_ITEM);
    if (trgt === root) {
      clst = <HTEle>((action === 'moveUp' ? trgt.lastElementChild : trgt).querySelector('.' + CLS_HEADER));
    } else if (trgt.classList.contains(CLS_HEADER)) {
      clstItem = <HTEle>(action === 'moveUp' ? clstItem.previousElementSibling : clstItem.nextElementSibling);
      if (clstItem) {
        clst = <HTEle>select('.' + CLS_HEADER, clstItem);
      }
    }
    if (clst) {
      clst.focus();
    }
  }
  private keyActionHandler(e: KeyboardEventArgs): void {
    let trgt: HTEle = <HTEle>e.target;
    let header: HTEle = <HTEle>closest(e.target as HTEle, CLS_HEADER);
    if (isNOU(header) && !trgt.classList.contains(CLS_ROOT) && !trgt.classList.contains(CLS_HEADER)) {
      return;
    }
    let clst: HTEle;
    let root: HTEle = this.element;
    let content: HTEle;
    switch (e.action) {
      case 'moveUp' || 'moveDown':
        this.eleMoveFocus(e.action, root, trgt);
        break;
      case 'space':
      case 'enter':
        content = trgt.nextElementSibling as HTEle;
        if (!isNOU(content) && content.classList.contains(CLS_CONTENT)) {
          if (content.getAttribute('e-animate') !== 'true') {
            trgt.click();
          }
        } else {
          trgt.click();
        }
        break;
      case 'home':
      case 'end':
        clst = e.action === 'home' ? <HTEle>root.firstElementChild.children[0] : <HTEle>root.lastElementChild.children[0];
        clst.focus();
        break;
    }
  }
  private expand(trgt: HTEle): void {
    let trgtItemEle: HTEle = <HTEle>closest(trgt, '.' + CLS_ITEM);
    if (isNOU(trgt) || (isVisible(trgt) && trgt.getAttribute('e-animate') !== 'true') || trgtItemEle.classList.contains(CLS_DISABLE)) {
      return;
    }
    this.dotNetRef.invokeMethodAsync('TriggerExpandingEvent', this.getIndexByItem(trgtItemEle));
  }
  private expandAnimation(ef: string, icn: HTEle, trgt: HTEle, trgtItemEle: HTEle, animate: AnimationModel, args: ExpandEventArgs): void {
    let height: number;
    this.lastActiveItemId = trgtItemEle.id;
    if (ef === 'SlideDown') {
      animate.begin = () => {
        this.expandProgress('begin', icn, trgt, trgtItemEle, args);
        trgt.style.position = 'absolute';
        height = trgtItemEle.offsetHeight;
        trgt.style.maxHeight = (trgt.offsetHeight) + 'px';
        trgtItemEle.style.maxHeight = '';
      };
      animate.progress = () => {
        trgtItemEle.style.minHeight = (height + trgt.offsetHeight) + 'px';
      };
      animate.end = () => {
        setStyle(trgt, { 'position': '', 'maxHeight': '' });
        trgtItemEle.style.minHeight = '';
        this.expandProgress('end', icn, trgt, trgtItemEle, args);
      };
    } else {
      animate.begin = () => {
        this.expandProgress('begin', icn, trgt, trgtItemEle, args);
      };
      animate.end = () => {
        this.expandProgress('end', icn, trgt, trgtItemEle, args);
      };
    }
    new Animation(animate).animate(trgt);
  }
  private expandProgress(progress: string, icon: HTEle, trgt: HTEle, trgtItemEle: HTEle, eventArgs: ExpandEventArgs): void {
    removeClass([trgt], CLS_CTNHIDE);
    addClass([trgtItemEle], CLS_SLCTED);
    addClass([icon], CLS_EXPANDICN);
    if (progress === 'end') {
      addClass([trgtItemEle], CLS_ACTIVE);
      trgt.setAttribute('aria-hidden', 'false');
      attributes(trgtItemEle, { 'aria-expanded': 'true' });
      attributes(trgt.previousElementSibling, { 'aria-selected': 'true' });
      icon.classList.remove(CLS_TOGANIMATE);
      this.dotNetRef.invokeMethodAsync('TriggerExpandedEvent', eventArgs);
    }
  }
  private expandedItemsPush(item: HTEle): void {
    let index: number = this.getIndexByItem(item);
    if (this.options.expandedIndices.indexOf(index) === -1) {
      let temp: number[] = [].slice.call(this.options.expandedIndices);
      temp.push(index);
      this.options.expandedIndices = temp;
    }
  }
  private getIndexByItem(item: HTEle): number {
    let itemEle: HTEle[] = this.getItemElements();
    return [].slice.call(itemEle).indexOf(item);
  }
  private getItemElements(): HTEle[] {
    let itemEle: HTEle[] = [];
    let itemCollection: HTMLCollection = this.element.children;
    [].slice.call(itemCollection).forEach((el: HTEle) => {
      if (el.classList.contains(CLS_ITEM)) { itemEle.push(el); }
    });
    return itemEle;
  }
  private expandedItemsPop(item: HTEle): void {
    let index: number = this.getIndexByItem(item);
    let temp: number[] = [].slice.call(this.options.expandedIndices);
    temp.splice(temp.indexOf(index), 1);
    this.options.expandedIndices = temp;
  }
  private collapse(trgt: HTEle): void {
    let trgtItemEle: HTEle = <HTEle>closest(trgt, '.' + CLS_ITEM);
    if (isNOU(trgt) || !isVisible(trgt) || trgtItemEle.classList.contains(CLS_DISABLE)) { return; }
    this.dotNetRef.invokeMethodAsync('TriggerCollapsingEvent', this.getIndexByItem(trgtItemEle));
  }
  private collapseAnimation(ef: string, trgt: HTEle, trgtItEl: HTEle, icn: HTEle, animate: AnimationModel, args: ExpandEventArgs): void {
    let height: number;
    let trgtHeight: number;
    let itemHeight: number;
    let remain: number;
    this.lastActiveItemId = trgtItEl.id;
    if (ef === 'SlideUp') {
      animate.begin = () => {
        itemHeight = trgtItEl.offsetHeight;
        trgtItEl.style.minHeight = itemHeight + 'px';
        trgt.style.position = 'absolute';
        height = trgtItEl.offsetHeight;
        trgtHeight = trgt.offsetHeight;
        trgt.style.maxHeight = trgtHeight + 'px';
        this.collapseProgress('begin', icn, trgt, trgtItEl, args);
      };
      animate.progress = () => {
        remain = ((height - (trgtHeight - trgt.offsetHeight)));
        if (remain < itemHeight) {
          trgtItEl.style.minHeight = remain + 'px';
        }
      };
      animate.end = () => {
        trgt.style.display = 'none';
        this.collapseProgress('end', icn, trgt, trgtItEl, args);
        trgtItEl.style.minHeight = '';
        setStyle(trgt, { 'position': '', 'maxHeight': '', 'display': '' });
      };
    } else {
      animate.begin = () => {
        this.collapseProgress('begin', icn, trgt, trgtItEl, args);
      };
      animate.end = () => {
        this.collapseProgress('end', icn, trgt, trgtItEl, args);
      };
    }
    new Animation(animate).animate(trgt);
  }
  private collapseProgress(progress: string, icon: HTEle, trgt: HTEle, trgtItemEle: HTEle, eventArgs: ExpandEventArgs): void {
    removeClass([icon], CLS_EXPANDICN);
    removeClass([trgtItemEle], CLS_SLCTED);
    if (progress === 'end') {
      addClass([trgt], CLS_CTNHIDE);
      icon.classList.remove(CLS_TOGANIMATE);
      removeClass([trgtItemEle], CLS_ACTIVE);
      trgt.setAttribute('aria-hidden', 'true');
      attributes(trgtItemEle, { 'aria-expanded': 'false' });
      attributes(trgt.previousElementSibling, { 'aria-selected': 'false' });
      this.dotNetRef.invokeMethodAsync('TriggerCollapsedEvent', eventArgs);
    }
  }
  public expandingItem(expandArgs: ExpandEventArgs): void {
    this.accItem = selectAll(':' + CLS_SCOPE + ' > .' + CLS_ITEM, this.element);
    let trgtItemEle: HTEle = this.getElementByIndex(expandArgs.index);
    let trgt: HTEle = <HTEle>select('.' + CLS_CONTENT, trgtItemEle);
    let acrdnRoot: HTEle = <HTEle>closest(trgtItemEle, '.' + CLS_ACRDN_ROOT);
    let icon: HTEle = <HTEle>select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
    let expandState: HTEle = <HTEle>acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
    let animation: AnimationModel = {
      name: <Effect>this.options.animation.expand.effect,
      duration: this.options.animation.expand.duration,
      timingFunction: this.options.animation.expand.easing
    };
    icon.classList.add(CLS_TOGANIMATE);
    this.expandedItemsPush(trgtItemEle);
    if (!isNOU(expandState)) {
      expandState.classList.remove(CLS_EXPANDSTATE);
    }
    trgtItemEle.classList.add(CLS_EXPANDSTATE);
    if ((animation.name === <Effect>'None')) {
      this.expandProgress('begin', icon, trgt, trgtItemEle, expandArgs);
      this.expandProgress('end', icon, trgt, trgtItemEle, expandArgs);
    } else {
      this.expandAnimation(animation.name, icon, trgt, trgtItemEle, animation, expandArgs);
    }
  }
  private getElementByIndex(index: number): HTEle {
    if (this.accItem[index]) {
      return this.accItem[index];
    }
    return null;
  }
  public collapsingItem(expandArgs: ExpandEventArgs): void {
    this.accItem = selectAll(':' + CLS_SCOPE + ' > .' + CLS_ITEM, this.element);
    let trgtItemEle: HTEle = this.getElementByIndex(expandArgs.index);
    let trgt: HTEle = <HTEle>select('.' + CLS_CONTENT, trgtItemEle);
    let icon: HTEle = <HTEle>select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
    let animation: AnimationModel = {
      name: <Effect>this.options.animation.collapse.effect,
      duration: this.options.animation.collapse.duration,
      timingFunction: this.options.animation.collapse.easing,
    };
    this.expandedItemsPop(trgtItemEle);
    trgtItemEle.classList.add(CLS_EXPANDSTATE);
    icon.classList.add(CLS_TOGANIMATE);
    if ((animation.name === <Effect>'None')) {
      this.collapseProgress('begin', icon, trgt, trgtItemEle, expandArgs);
      this.collapseProgress('end', icon, trgt, trgtItemEle, expandArgs);
    } else {
      this.collapseAnimation(animation.name, trgt, trgtItemEle, icon, animation, expandArgs);
    }
  }
  public select(index: number): void {
    let itemEle: HTEle[] = this.getItemElements();
    let ele: HTEle = <HTEle>itemEle[index];
    if (isNOU(ele) || isNOU(select('.' + CLS_HEADER, ele))) {
      return;
    }
    (<HTEle>ele.children[0]).focus();
  }
  public hideItem(index: number, isHidden?: Boolean): void {
    let itemEle: HTEle[] = this.getItemElements();
    let ele: HTEle = <HTEle>itemEle[index];
    if (isNOU(ele)) {
      return;
    }
    if (isNOU(isHidden)) {
      isHidden = true;
    }
    isHidden ? addClass([ele], CLS_ITEMHIDE) : removeClass([ele], CLS_ITEMHIDE);
  }
  public enableItem(index: number, isEnable: boolean): void {
    let itemEle: HTEle[] = this.getItemElements();
    let ele: HTEle = <HTEle>itemEle[index];
    if (isNOU(ele)) {
      return;
    }
    let eleHeader: HTEle = <HTEle>ele.firstElementChild;
    if (isEnable) {
      removeClass([ele], CLS_DISABLE);
      attributes(eleHeader, { 'tabindex': '0', 'aria-disabled': 'false' });
      eleHeader.focus();
    } else {
      if (ele.classList.contains(CLS_ACTIVE)) {
        this.expandItem(false, index);
        this.eleMoveFocus('movedown', this.element, eleHeader);
      }
      addClass([ele], CLS_DISABLE);
      eleHeader.setAttribute('aria-disabled', 'true');
      eleHeader.removeAttribute('tabindex');
    }
  }
  public expandItem(isExpand: boolean, index?: number): void {
    let itemEle: HTEle[] = this.getItemElements();
    if (isNOU(index)) {
      if (this.options.expandMode === 'Single' && isExpand) {
        let ele: HTEle = <HTEle>itemEle[itemEle.length - 1];
        this.itemExpand(isExpand, ele, this.getIndexByItem(ele));
      } else {
        let item: HTMLElement = <HTMLElement>select('#' + this.lastActiveItemId, this.element);
        [].slice.call(itemEle).forEach((el: HTEle) => {
          this.itemExpand(isExpand, el, this.getIndexByItem(el));
          el.classList.remove(CLS_EXPANDSTATE);
        });
        let expandedItem: Element = select('.' + CLS_EXPANDSTATE, this.element);
        if (expandedItem) { expandedItem.classList.remove(CLS_EXPANDSTATE); }
        if (item) { item.classList.add(CLS_EXPANDSTATE); }
      }
    } else {
      let ele: HTEle = <HTEle>itemEle[index];
      if (isNOU(ele) || !ele.classList.contains(CLS_SLCT) || (ele.classList.contains(CLS_ACTIVE) && isExpand)) {
        return;
      } else {
        if (this.options.expandMode === 'Single') {
          this.expandItem(false);
        }
        this.itemExpand(isExpand, ele, index);
      }
    }
  }
  private itemExpand(isExpand: Boolean, ele: HTEle, index: number): void {
    let ctn: HTEle = <HTEle>ele.children[1];
    if (ele.classList.contains(CLS_DISABLE)) {
      return;
    }
    if (isNOU(ctn) && isExpand) {
      let id: string = ele.id;
      // tslint:disable-next-line:no-any
      (this as any).dotNetRef.invokeMethodAsync('OnAccordionClick', index, id).then(() => {
        ctn = <HTEle>ele.children[1];
        this.expand(ctn);
      });
    } else if (!isNOU(ctn)) {
      isExpand ? this.expand(ctn) : this.collapse(ctn);
    }
  }
}

interface IAccordionOptions {
  animation: AccordionAnimationSettingsModel;
  expandMode: ExpandMode;
  expandedIndices: number[];
  enablePersistence: boolean;
}

interface BlazorAccordionElement extends HTEle {
  blazor__instance: SfAccordion;
}

// tslint:disable
let Accordion: object = {
  initialize(element: BlazorAccordionElement, options: IAccordionOptions, dotnetRef: BlazorDotnetObject): void {
    if (element) {
      if (options.expandedIndices === null) {
        options.expandedIndices = [];
      }
      let instance: SfAccordion = new SfAccordion(element, options, dotnetRef);
      instance.render();
      instance.dotNetRef.invokeMethodAsync('CreatedEvent', null);
    }
  },
  expandingItem(element: BlazorAccordionElement, args: ExpandEventArgs): void {
    if (element && element.blazor__instance) {
      element.blazor__instance.expandingItem(args);
    }
  },
  collapsingItem(element: BlazorAccordionElement, args: ExpandEventArgs): void {
    if (element && element.blazor__instance) {
      element.blazor__instance.collapsingItem(args);
    }
  },
  enableItem(element: BlazorAccordionElement, index: number, isEnable: boolean): void {
    if (element && element.blazor__instance) {
      element.blazor__instance.enableItem(index, isEnable);
    }
  },
  expandItem(element: BlazorAccordionElement, isExpand: boolean, index: number): void {
    if (element && element.blazor__instance) {
      element.blazor__instance.expandItem(isExpand, index);
    }
  },
  hideItem(element: BlazorAccordionElement, index: number, isHidden: boolean): void {
    if (element && element.blazor__instance) {
      element.blazor__instance.hideItem(index, isHidden);
    }
  },
  select(element: BlazorAccordionElement, index: number): void {
    if (element && element.blazor__instance) {
      element.blazor__instance.select(index);
    }
  },
  destroy(element: BlazorAccordionElement, elementId: string, expandedIndices: string): void {
    if (element && element.blazor__instance) {
      if (element.blazor__instance.options.enablePersistence) {
        window.localStorage.setItem(elementId, expandedIndices);
      }
      element.blazor__instance.destroy();
    }
  },
  setExpandModeAndRTL(element: BlazorAccordionElement, enableRtl: boolean, expandMode: ExpandMode, isRtlChanged: boolean, isExpandModeChanged: boolean): void {
    if (element && element.blazor__instance) {
      if (isRtlChanged) {
        enableRtl ? addClass([element], CLS_RTL) : removeClass([element], CLS_RTL);
      }
      if (isExpandModeChanged) {
        element.blazor__instance.options.expandMode = expandMode;
        if (expandMode === 'Single') {
          element.setAttribute('aria-multiselectable', 'false');
          if (element.blazor__instance.options.expandedIndices.length > 1) {
            element.blazor__instance.expandItem(false);
          }
        } else {
          element.setAttribute('aria-multiselectable', 'true');
        }
      }
    }
  },
  itemChanged(element: BlazorAccordionElement): void {
    if (element && element.blazor__instance) {
      element.blazor__instance.wireFocusEvents();
    }
  },
  refresh(element: BlazorAccordionElement, options: IAccordionOptions): void {
    if (options.expandedIndices === null) {
      options.expandedIndices = [];
    }
    if (element && element.blazor__instance) {
      element.blazor__instance.options = options;
    }
  },
  afterContentRender(element: BlazorAccordionElement, targetEle: HTEle, animation: AccordionAnimationSettingsModel): void {
    if (element && element.blazor__instance) {
      element.blazor__instance.options.animation = animation;
      element.blazor__instance.afterContentRender(targetEle);
    }
  }
};

export default Accordion;
