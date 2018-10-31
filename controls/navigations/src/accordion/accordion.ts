import { Component, EventHandler, Property, Event, EmitType, AnimationModel, KeyboardEvents, rippleEffect } from '@syncfusion/ej2-base';
import { KeyboardEventArgs, BaseEventArgs, Effect, getUniqueID, compile as templateCompiler } from '@syncfusion/ej2-base';
import { addClass, isVisible, closest, attributes, classList, detach, select } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, Collection, Animation } from '@syncfusion/ej2-base';
import { setStyleAttribute as setStyle, Complex  } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, formatUnit, selectAll } from '@syncfusion/ej2-base';
import { AccordionModel, AccordionItemModel, AccordionAnimationSettingsModel, AccordionActionSettingsModel } from './accordion-model';

/**
 * Specifies the option to expand single or multiple panel at a time.
 */
export type ExpandMode  = 'Single' | 'Multiple';

type HTEle = HTMLElement;
type Str = string;

const CLS_ACRDN_ROOT: Str = 'e-acrdn-root';
const CLS_ROOT: Str = 'e-accordion';
const CLS_ITEM: Str = 'e-acrdn-item';
const CLS_ITEMFOCUS: Str = 'e-item-focus';
const CLS_ITEMHIDE: Str = 'e-hide';
const CLS_HEADER: Str = 'e-acrdn-header';
const CLS_HEADERICN: Str = 'e-acrdn-header-icon';
const CLS_HEADERCTN: Str = 'e-acrdn-header-content';
const CLS_CONTENT: Str = 'e-acrdn-panel';
const CLS_CTENT: Str = 'e-acrdn-content';
const CLS_TOOGLEICN: Str = 'e-toggle-icon';
const CLS_COLLAPSEICN: Str = 'e-tgl-collapse-icon e-icons';
const CLS_EXPANDICN: Str = 'e-expand-icon';
const CLS_RTL: Str = 'e-rtl';
const CLS_CTNHIDE: Str = 'e-content-hide';
const CLS_SLCT: Str = 'e-select';
const CLS_SLCTED: Str = 'e-selected';
const CLS_ACTIVE: Str = 'e-active';
const CLS_ANIMATE: Str = 'e-animate';
const CLS_DISABLE: Str = 'e-overlay';
const CLS_TOGANIMATE: Str = 'e-toggle-animation';
const CLS_NEST: Str = 'e-nested';
const CLS_EXPANDSTATE: Str = 'e-expand-state';

export interface AccordionClickArgs extends BaseEventArgs {
  /** Defines the current Accordion Item Object. */
  item?: AccordionItemModel;
  /** Defines the current Event arguments. */
  originalEvent?: Event;
}
export interface ExpandEventArgs extends BaseEventArgs {
  /** Defines the current Accordion Item Object. */
  item?: AccordionItemModel;
  /** Defines the current Accordion Item Element. */
  element?: HTMLElement;
  /** Defines the expand/collapse state. */
  isExpanded?: boolean;
  /** Defines the prevent action. */
  cancel?: boolean;
}

export class AccordionActionSettings extends ChildProperty<AccordionActionSettings> {
  /**
   * Specifies the type of animation.
   * @default : 'SlideDown'
   * @aspType string
   */
  @Property('SlideDown')
  public effect: 'None' | Effect;
  /**
   * Specifies the duration to animate.
   * @default : 400
   */
  @Property(400)
  public duration: number;
  /**
   * Specifies the animation timing function.
   * @default : 'linear'
   */
  @Property('linear')
  public easing: string;
}

export class AccordionAnimationSettings extends ChildProperty<AccordionAnimationSettings> {
  /**
   * Specifies the animation to appear while collapsing the Accordion item.
   * @default { effect: 'SlideDown', duration: 400, easing: 'linear' }
   */
  @Complex<AccordionActionSettingsModel>({ effect: 'SlideUp', duration: 400, easing: 'linear' }, AccordionActionSettings)
  public collapse: AccordionActionSettingsModel;
  /**
   * Specifies the animation to appear while expanding the Accordion item.
   * @default { effect: 'SlideDown', duration: 400, easing: 'linear' }
   */
  @Complex<AccordionActionSettingsModel>({ effect: 'SlideDown', duration: 400, easing: 'linear' }, AccordionActionSettings)
  public expand: AccordionActionSettingsModel;
}
/**
 * An item object that is used to configure Accordion items.
 */
export class AccordionItem extends ChildProperty<AccordionItem>  {
    /**
     * Sets the text content to be displayed for the Accordion item.
     * You can set the content of the Accordion item using `content` property.
     * It also supports to include the title as `HTML element`, `string`, or `query selector`.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( { 
     *        items : [ 
     *          { header: 'Accordion Header', content: 'Accordion Content' },
     *          { header: '<div>Accordion Header</div>', content: '<div>Accordion Content</div' },
     *          { header: '#headerContent', content: '#panelContent' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```
     * @default undefined
     */
    @Property(undefined)
    public content : string;
    /**
     * Sets the header text to be displayed for the Accordion item.
     * You can set the title of the Accordion item using `header` property.
     * It also supports to include the title as `HTML element`, `string`, or `query selector`.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( { 
     *        items : [ 
     *          { header: 'Accordion Header', content: 'Accordion Content' },
     *          { header: '<div>Accordion Header</div>', content: '<div>Accordion Content</div' },
     *          { header: '#headerContent', content: '#panelContent' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```
     * @default undefined
     */
    @Property(undefined)
    public header : string;
    /**
     * Defines single/multiple classes (separated by a space) are to be used for Accordion item customization.
     * @default undefined
     */
    @Property(undefined)
    public cssClass: string;
    /**
     * Defines an icon with the given custom CSS class that is to be rendered before the header text.
     * Add the css classes to the `iconCss` property and write the css styles to the defined class to set images/icons.
     * Adding icon is applicable only to the header.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( { 
     *        items : [ 
     *          { header: 'Accordion Header', iconCss: 'e-app-icon' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```
     * ```css
     * .e-app-icon::before {
     *   content: "\e710";
     * }
     * ```
     * @default undefined
     */
    @Property(undefined)
    public iconCss : string;
    /**
     * Sets the expand (true) or collapse (false) state of the Accordion item. By default, all the items are in a collapsed state.
     * @default 'false'
     */
    @Property(false)
    public expanded  : Boolean;
}


/**
 * The Accordion is a vertically collapsible content panel that displays one or more panels at a time within the available space.
 * ```html
 * <div id='accordion'/>
 * <script>
 *   var accordionObj = new Accordion();
 *   accordionObj.appendTo('#accordion');
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Accordion extends Component<HTMLElement> implements INotifyPropertyChanged {
    private lastActiveItemId: string;
    private trgtEle: HTEle;
    private ctrlTem: HTEle;
    private keyModule: KeyboardEvents;
    private expandedItems: number[];
    private initExpand: number[];
    private isNested: Boolean;
    private isDestroy: Boolean;
    private templateEle: string[];
    /**
     * Contains the keyboard configuration of the Accordion.
     */
    private keyConfigs: { [key: string]: Str } = {
        moveUp: 'uparrow',
        moveDown: 'downarrow',
        enter: 'enter',
        space: 'space',
        home: 'home',
        end: 'end',
    };

    /**
     * An array of item that is used to specify Accordion items.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( { 
     *        items : [ 
     *          { header: 'Accordion Header', content: 'Accordion Content' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```
     * @default []
     */
    @Collection<AccordionItemModel>([], AccordionItem)
    public items: AccordionItemModel[];
    /**
     * Specifies the width of the Accordion in pixels/number/percentage. Number value is considered as pixels.
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Specifies the height of the Accordion in pixels/number/percentage. Number value is considered as pixels.
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;
    /**
     * Specifies the options to expand single or multiple panel at a time.
     * The possible values are:
     * - Single: Sets to expand only one Accordion item at a time.
     * - Multiple: Sets to expand more than one Accordion item at a time.
     * @default 'Multiple'
     */
    @Property('Multiple')
    public expandMode : ExpandMode;
    /**
     * Specifies the animation configuration settings for expanding and collapsing the panel.
     * @default { expand: { effect: 'SlideDown', duration: 400, easing: 'linear' },
     * collapse: { effect: 'SlideUp', duration: 400, easing: 'linear' }}
     */
    @Complex<AccordionAnimationSettingsModel>({}, AccordionAnimationSettings)
    public animation: AccordionAnimationSettingsModel;
    /**
     * The event will be fired while clicking on the Accordion headers.
     * @event
     */
    @Event()
    public clicked: EmitType<AccordionClickArgs>;
    /**
     * The event will be fired before the item gets collapsed/expanded.
     * @event
     */
    @Event()
    public expanding: EmitType<ExpandEventArgs>;
    /**
     * The event will be fired after the item gets collapsed/expanded.
     * @event
     */
    @Event()
    public expanded: EmitType<ExpandEventArgs>;
    /**
     * The event will be fired once the control rendering is completed.
     * @event
     */
    @Event()
    public created: EmitType<Event>;
    /**
     * The event will be fired when the control gets destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Event>;

    /**
     * Initializes a new instance of the Accordion class.
     * @param options  - Specifies Accordion model properties as options.
     * @param element  - Specifies the element that is rendered as an Accordion.
     */
    constructor(options?: AccordionModel, element?: string | HTMLElement) {
        super(options, <HTEle | Str>element);
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    public destroy(): void {
      let ele: HTEle = this.element;
      super.destroy();
      this.unwireEvents();
      this.isDestroy = true;
      this.templateEle.forEach((eleStr: Str): void => {
        if (!isNOU(this.element.querySelector(eleStr))) {
          (<HTEle>document.body.appendChild(this.element.querySelector(eleStr))).style.display = 'none'; }
      });
      while (ele.firstChild) {
        ele.removeChild(ele.firstChild); }
      if (this.trgtEle) {
        while (this.ctrlTem.firstChild) {
          ele.appendChild(this.ctrlTem.firstChild); } }
      ele.removeAttribute('style');
      ['aria-disabled', 'aria-multiselectable', 'role'].forEach((attrb: string): void => {
        this.element.removeAttribute(attrb);
    });
    }
    protected preRender(): void {
        let nested: Element = closest(this.element, '.' + CLS_CONTENT);
        this.isNested = false;
        this.templateEle = [];
        if (!this.isDestroy) {
          this.isDestroy = false; }
        if (!isNOU(nested)) {
           nested.classList.add(CLS_NEST);
           this.isNested = true;
          } else {
            this.element.classList.add(CLS_ACRDN_ROOT);
          }
        if (this.enableRtl) {
            this.add(this.element, CLS_RTL);
        }
        if (!this.enablePersistence || isNOU(this.expandedItems)) {
          this.expandedItems = []; }
    }
    private add(ele: HTEle, val : Str): void {
      ele.classList.add(val);
    }
    private remove(ele: HTEle, val : Str): void {
      ele.classList.remove(val);
    }
    /**
     * To initialize the control rendering
     * @private
     */
    protected render(): void {
        this.initialize();
        this.renderControl();
        this.wireEvents();
    }
    private initialize(): void {
        let width: Str = formatUnit(this.width);
        let  height: Str = formatUnit(this.height);
        setStyle(this.element, {'width': width, 'height': height});
        let ariaAttr: { [key: string]: Str } = {
            'aria-disabled': 'false', 'role': 'presentation', 'aria-multiselectable' : 'true'
        };
        if (this.expandedItems.length > 0 ) {
        this.initExpand = this.expandedItems;
        }
        attributes(this.element, ariaAttr);
        if (this.expandMode === 'Single') {
         this.element.setAttribute('aria-multiselectable', 'false');
        }
    }
    private renderControl(): void {
      this.trgtEle = (this.element.children.length > 0) ? <HTEle>select('div', this.element) : null;
      this.renderItems();
      this.initItemExpand();
    }
    private unwireEvents(): void {
      EventHandler.remove(this.element, 'click', this.clickHandler);
      if (!isNOU(this.keyModule)) {
         this.keyModule.destroy(); }
    }
    private wireEvents(): void {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        if (!this.isNested && !this.isDestroy) {
          rippleEffect(this.element, { selector: '.' + CLS_HEADER}); }
        if (!this.isNested) {
        this.keyModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            }); }
    }
    private focusIn(e: FocusEvent): void {
     (<HTEle>e.target).parentElement.classList.add(CLS_ITEMFOCUS);
    }
    private focusOut(e: FocusEvent): void {
      (<HTEle>e.target).parentElement.classList.remove(CLS_ITEMFOCUS);
    }
    private ctrlTemplate(): void {
       this.ctrlTem = <HTEle>this.element.cloneNode(true);
       let innerEles: HTMLCollection = this.element.children as HTMLCollection;
       let content: HTEle;
       addClass([].slice.call(innerEles), [CLS_ITEM]);
       [].slice.call(innerEles).forEach((el: HTEle) => {
         el.id = getUniqueID('acrdn_item');
         if (el.children.length > 0) {
           this.add(<HTEle>el.children[0], CLS_HEADER);
           let header: Element = el.children[0];
           attributes(header, {'tabindex': '0', 'role': 'heading', 'aria-level': innerEles.length.toString() });
           header.id = getUniqueID('acrdn_header');
           EventHandler.add(header, 'focus', this.focusIn, this);
           EventHandler.add(header, 'blur', this.focusOut, this);
           let headerEle: HTEle = <HTEle>header.firstElementChild;
           if (headerEle) {
             headerEle.classList.add(CLS_HEADERCTN);
           }
           content = <HTEle>el.children[1];
           if (content) {
               content.id = getUniqueID('acrdn_panel');
               header.setAttribute('aria-controls', content.id);
               content.style.display = '';
               el.classList.add(CLS_SLCT);
               el.children[0].appendChild(this.toggleIconGenerate());
               classList(content, [CLS_CONTENT, CLS_CTNHIDE], []);
               attributes(content, {'aria-labelledby': header.id, 'aria-hidden': 'true' });
               content = <HTEle>content.firstElementChild;
               if (content) {
                 content.classList.add(CLS_CTENT);
                 content.style.display = ''; }
           }
         }
       });
    }
    private toggleIconGenerate(): HTEle {
      let tglIcon: HTEle = this.createElement('div', {className: CLS_TOOGLEICN});
      let hdrColIcon: HTEle = this.createElement('span', {className: CLS_COLLAPSEICN });
      tglIcon.appendChild(hdrColIcon);
      return tglIcon;
    }
    private initItemExpand(): void {
     let len: number = this.initExpand.length;
     if (len === 0 ) {
       return; }
     if (this.expandMode === 'Single') {
      this.expandItem(true, this.initExpand[len - 1]);
     } else {
     for (let i: number = 0; i < len; i++) {
       this.expandItem(true, this.initExpand[i]); } }
    }
    private renderItems(): void {
        let ele: HTEle = this.element;
        let innerItem: HTEle;
        if (isNOU(this.initExpand)) {
          this.initExpand = []; }
        let items: AccordionItem[] = <AccordionItem[]>this.items;
        if (!isNOU(this.trgtEle)) {
          this.ctrlTemplate();
        } else  if (ele && items.length > 0) {
            items.forEach( (item : AccordionItem, index: number) =>  {
              innerItem = this.renderInnerItem(item, index);
              ele.appendChild(innerItem);
              if (innerItem.childElementCount > 0) {
                EventHandler.add(innerItem.querySelector('.' + CLS_HEADER), 'focus', this.focusIn, this);
                EventHandler.add(innerItem.querySelector('.' + CLS_HEADER), 'blur', this.focusOut, this);
              }
            } );
        }
    }
    private clickHandler(e: Event): void {
     let trgt: HTEle = <HTEle>e.target;
     let eventArgs: AccordionClickArgs = { };
     let index: number;
     let tglIcon: HTEle;
     let acrdEle: HTEle = <HTEle>closest(trgt, '.' + CLS_ROOT);
     if (acrdEle !== this.element) {
       return; }
     trgt.classList.add('e-target');
     let acrdnItem: HTEle = <HTEle>closest(trgt, '.' + CLS_ITEM);
     let acrdnHdr: HTEle = <HTEle>closest(trgt, '.' + CLS_HEADER);
     let acrdnCtn: HTEle = <HTEle>closest(trgt, '.' + CLS_CONTENT);
     if (acrdnItem && (isNOU(acrdnHdr) || isNOU(acrdnCtn))) {
       acrdnHdr = <HTEle>acrdnItem.children[0];
       acrdnCtn = <HTEle>acrdnItem.children[1]; }
     if (acrdnHdr) {
       tglIcon = <HTEle> select('.' + CLS_TOOGLEICN, acrdnHdr); }
     let acrdnCtnItem: HTEle;
     if (acrdnCtn) {
       acrdnCtnItem = <HTEle>closest(acrdnCtn, '.' + CLS_ITEM); }
     let acrdActive: HTEle[] = [];
     index = this.getIndexByItem(acrdnItem);
     if (acrdnCtnItem) {
       eventArgs.item = this.items[this.getIndexByItem(acrdnCtnItem)]; }
     eventArgs.originalEvent = e;
     let ctnCheck: Boolean = !isNOU(tglIcon) && isNOU(this.trgtEle) && acrdnItem.childElementCount <= 1;
     if (ctnCheck && (isNOU(acrdnCtn) || !isNOU(select('.' + CLS_HEADER + ' .' + CLS_TOOGLEICN, acrdnCtnItem )))) {
       acrdnItem.appendChild(this.contentRendering(index));
       this.ariaAttrUpdate(acrdnItem);
     }
     this.trigger('clicked', eventArgs);
     let cntclkCheck: boolean = (acrdnCtn && !isNOU(select('.e-target', acrdnCtn)));
     cntclkCheck = cntclkCheck  && (isNOU(select('.' + CLS_ROOT, acrdnCtn)) || !(closest(trgt , '.' + CLS_ROOT) === this.element));
     trgt.classList.remove('e-target');
     if (trgt.classList.contains(CLS_CONTENT) || trgt.classList.contains(CLS_CTENT) || cntclkCheck) {
      return; }
     [].slice.call(this.element.children).forEach((el: HTEle) => {
      if (el.classList.contains(CLS_ACTIVE)) {
        acrdActive.push(el); }
     });
     let acrdAniEle: HTEle[] = [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM + ' [' + CLS_ANIMATE + ']'));
     if (acrdAniEle.length > 0) {
       for (let el of acrdAniEle) {
           acrdActive.push(el.parentElement);
       }
     }
     let sameContentCheck: boolean = acrdActive.indexOf(acrdnCtnItem) !== -1 && acrdnCtn.getAttribute('e-animate') === 'true';
     let sameHeader: boolean = false;
     if (!isNOU(acrdnItem) && !isNOU(acrdnHdr) ) {
         let acrdnCtn: HTEle = <HTEle>select('.' + CLS_CONTENT, acrdnItem);
         let acrdnRoot: HTEle = <HTEle>closest(acrdnItem, '.' + CLS_ACRDN_ROOT);
         let expandState: HTEle = <HTEle>acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
         if (isNOU(acrdnCtn) ) {
           return; }
         sameHeader = (expandState === acrdnItem);
         if (isVisible(acrdnCtn) && (!sameContentCheck || acrdnCtnItem.classList.contains(CLS_SLCTED))) {
           this.collapse(acrdnCtn);
         } else {
             if ((acrdActive.length > 0) && this.expandMode === 'Single' && !sameContentCheck) {
               acrdActive.forEach( (el: HTEle) => {
                  this.collapse(<HTEle>select('.' + CLS_CONTENT, el));
                  el.classList.remove(CLS_EXPANDSTATE);
               });
            }
             this.expand(acrdnCtn);
         }
         if (!isNOU(expandState) && !sameHeader ) {
          expandState.classList.remove(CLS_EXPANDSTATE); }
     }
    }
    private eleMoveFocus(action: Str, root: HTEle, trgt: HTEle): void {
      let clst: HTEle;
      let clstItem: HTEle = <HTEle>closest(trgt, '.' + CLS_ITEM);
      if (trgt === root) {
        clst = <HTEle>((action === 'moveUp' ? trgt.lastElementChild : trgt).querySelector('.' + CLS_HEADER));
      } else if (trgt.classList.contains(CLS_HEADER)) {
        clstItem = <HTEle>(action === 'moveUp' ? clstItem.previousElementSibling : clstItem.nextElementSibling );
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
        return; }
      let clst: HTEle;
      let root: HTEle = this.element;
      let content: HTEle;
      switch (e.action) {
        case 'moveUp':
            this.eleMoveFocus(e.action, root, trgt);
            break;
        case 'moveDown':
            this.eleMoveFocus(e.action, root, trgt);
            break;
        case 'space':
        case 'enter':
            content = trgt.nextElementSibling as HTEle;
            if (!isNOU(content) && content.classList.contains(CLS_CONTENT)) {
            if (content.getAttribute('e-animate') !== 'true') {
              trgt.click(); }} else {
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
    private headerEleGenerate(): HTEle {
      let header: HTEle = this.createElement('div', { className: CLS_HEADER, id: getUniqueID('acrdn_header') });
      let ariaAttr: { [key: string]: Str } = {
        'tabindex': '0', 'role': 'heading', 'aria-expanded': 'false', 'aria-selected': 'false',
         'aria-disabled': 'false', 'aria-level': this.items.length.toString()
      };
      attributes(header, ariaAttr);
      return header;
    }
    private renderInnerItem(item: AccordionItemModel, index: number): HTEle {
      let innerEle: HTEle;
      innerEle = this.createElement('div', { className: CLS_ITEM });
      innerEle.id = getUniqueID('acrdn_item');
      if (item.header) {
        let ctnEle: HTEle = this.headerEleGenerate();
        let hdrEle: HTEle = this.createElement('div', { className: CLS_HEADERCTN});
        ctnEle.appendChild(hdrEle);
        ctnEle.appendChild(this.fetchElement(hdrEle, item.header, index, true));
        innerEle.appendChild(ctnEle);
      }
      let hdr: HTEle = <HTEle>select('.' + CLS_HEADER, innerEle);
      if (item.expanded && !isNOU(index) && (!this.enablePersistence) ) {
        if (this.initExpand.indexOf(index) === -1) {
        this.initExpand.push(index); }
      }
      if (item.cssClass) {
        innerEle.classList.add(item.cssClass);
      }
      if (item.iconCss) {
         let hdrIcnEle: HTEle = this.createElement('div', { className: CLS_HEADERICN });
         let icon: HTEle = this.createElement('span', { className: item.iconCss + ' e-icons' });
         hdrIcnEle.appendChild(icon);
         if (isNOU(hdr)) {
          hdr = this.headerEleGenerate();
          hdr.appendChild(hdrIcnEle);
          innerEle.appendChild(hdr);
         } else {
            hdr.insertBefore(hdrIcnEle, hdr.childNodes[0]); }
      }
      if (item.content) {
        let hdrIcon: HTEle = this.toggleIconGenerate();
        if (isNOU(hdr)) {
          hdr = this.headerEleGenerate();
          innerEle.appendChild(hdr);
         }
        hdr.appendChild(hdrIcon);
        this.add(innerEle, CLS_SLCT);
     }
      return innerEle;
    }
    private fetchElement(ele: HTEle, value: Str, index: number, isHeader: boolean): HTEle {
      let templateFn: Function;
      let temString: Str;
      try {
        if (document.querySelectorAll(value).length) {
          let eleVal: HTEle = <HTEle>document.querySelector(value);
          temString = eleVal.outerHTML.trim();
          ele.appendChild(eleVal);
          eleVal.style.display = '';
        }
      } catch (e) {
        templateFn = templateCompiler(value);
      }
      let tempArray: HTEle[];
      if (!isNOU(templateFn)) {
          tempArray = templateFn();
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
      if (!isNOU(temString)) {
        this.templateEle.push(value);
      }
      return ele;
    }
    private ariaAttrUpdate(itemEle: HTEle): void {
      let header: Element = select('.' + CLS_HEADER, itemEle);
      let content: Element = select('.' + CLS_CONTENT, itemEle);
      header.setAttribute('aria-controls', content.id);
      content.setAttribute('aria-labelledby', header.id);
    }
    private contentRendering(index: number): HTEle {
      let content: Str = this.items[index].content;
      let itemcnt: HTEle = this.createElement('div', { className: CLS_CONTENT + ' ' + CLS_CTNHIDE, id: getUniqueID('acrdn_panel') });
      attributes(itemcnt, { 'aria-hidden': 'true' });
      let ctn: HTEle = this.createElement('div', { className: CLS_CTENT });
      itemcnt.appendChild(this.fetchElement(ctn, content, index, false));
      return itemcnt;
    }
    private expand(trgt: HTEle): void {
      let eventArgs: ExpandEventArgs;
      let trgtItemEle: HTEle = <HTEle>closest(trgt, '.' + CLS_ITEM);
      if (isNOU(trgt) || (isVisible(trgt) && trgt.getAttribute('e-animate') !== 'true' ) || trgtItemEle.classList.contains(CLS_DISABLE)) {
          return; }
      let acrdnRoot: HTEle = <HTEle>closest(trgtItemEle, '.' + CLS_ACRDN_ROOT);
      let expandState: HTEle = <HTEle>acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
      let animation: AnimationModel = {
        name: <Effect>this.animation.expand.effect,
        duration: this.animation.expand.duration,
        timingFunction: this.animation.expand.easing
         };
      let icon: HTEle = <HTEle>select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
      eventArgs = { element: trgtItemEle,
                    item: this.items[this.getIndexByItem(trgtItemEle)],
                    isExpanded: true };
      let eff: string = animation.name;
      this.trigger('expanding', eventArgs);
      if (eventArgs.cancel) {
        return; }
      icon.classList.add(CLS_TOGANIMATE);
      this.expandedItemsPush(trgtItemEle);
      if (!isNOU(expandState)) {
        expandState.classList.remove(CLS_EXPANDSTATE); }
      trgtItemEle.classList.add(CLS_EXPANDSTATE);
      if ((animation.name === <Effect>'None')) {
        this.expandProgress('begin', icon, trgt, trgtItemEle, eventArgs);
        this.expandProgress('end', icon, trgt, trgtItemEle, eventArgs);
        return;
      }
      this.expandAnimation(eff, icon, trgt, trgtItemEle, animation, eventArgs);
    }
    private expandAnimation (ef: Str, icn: HTEle, trgt: HTEle, trgtItemEle: HTEle, animate: AnimationModel, args: ExpandEventArgs ): void {
      let height: number;
      let trgtHgt: number;
      this.lastActiveItemId = trgtItemEle.id;
      if (ef === 'SlideDown') {
        animate.begin = () => {
          this.expandProgress('begin', icn, trgt, trgtItemEle, args);
          trgt.style.position = 'absolute';
          height = trgtItemEle.offsetHeight;
          trgtHgt = trgt.offsetHeight;
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
          this.expandProgress('begin', icn, trgt, trgtItemEle, args); };
        animate.end = () => {
          this.expandProgress('end', icn, trgt, trgtItemEle, args); };
      }
      new Animation(animate).animate(trgt);
    }
    private expandProgress(progress: string, icon: HTEle, trgt: HTEle, trgtItemEle: HTEle, eventArgs: ExpandEventArgs  ): void {
      this.remove(trgt, CLS_CTNHIDE);
      this.add(trgtItemEle, CLS_SLCTED);
      this.add(icon , CLS_EXPANDICN);
      if (progress === 'end') {
        this.add(trgtItemEle, CLS_ACTIVE);
        trgt.setAttribute('aria-hidden', 'false');
        attributes (trgt.previousElementSibling, { 'aria-selected': 'true', 'aria-expanded': 'true'});
        icon.classList.remove(CLS_TOGANIMATE);
        this.trigger('expanded' , eventArgs);
      }
    }
    private expandedItemsPush(item: HTEle): void {
      let index: number = this.getIndexByItem(item);
      if (this.expandedItems.indexOf(index) === -1) {
        this.expandedItems.push (index);  }
    }
    private getIndexByItem(item: HTEle): number {
      return [].slice.call(this.element.children).indexOf(item);
    }
    private expandedItemsPop(item: HTEle): void {
      let index: number = this.getIndexByItem(item);
      this.expandedItems.splice(this.expandedItems.indexOf(index), 1);
    }
    private collapse(trgt: HTEle): void {
      let eventArgs: ExpandEventArgs;
      let trgtItemEle: HTEle = <HTEle>closest(trgt, '.' + CLS_ITEM);
      if (isNOU(trgt) || !isVisible(trgt) || trgtItemEle.classList.contains(CLS_DISABLE)) { return; }
      let animation: AnimationModel =  {
        name: <Effect>this.animation.collapse.effect,
        duration: this.animation.collapse.duration,
        timingFunction: this.animation.collapse.easing,
       };
      let icon: HTEle = <HTEle>select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
      eventArgs = { element: trgtItemEle,
                    item: this.items[this.getIndexByItem(trgtItemEle)],
                    isExpanded: false };
      let eff: string = animation.name;
      this.trigger('expanding' , eventArgs);
      if (eventArgs.cancel) {
        return; }
      this.expandedItemsPop(trgtItemEle);
      trgtItemEle.classList.add(CLS_EXPANDSTATE);
      icon.classList.add(CLS_TOGANIMATE);
      if ((animation.name === <Effect>'None')) {
        this.collapseProgress('begin', icon, trgt, trgtItemEle, eventArgs);
        this.collapseProgress('end', icon, trgt, trgtItemEle, eventArgs);
        return;
      }
      this.collapseAnimation(eff, trgt, trgtItemEle, icon, animation, eventArgs);
    }
    private collapseAnimation (ef: Str, trgt: HTEle, trgtItEl: HTEle, icn: HTEle, animate: AnimationModel, args: ExpandEventArgs ): void {
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
          trgtItEl.style.minHeight = remain + 'px'; }
        };
        animate.end = () => {
          trgt.style.display = 'none';
          this.collapseProgress('end', icn, trgt, trgtItEl, args);
          trgtItEl.style.minHeight = '';
          setStyle(trgt, { 'position': '', 'maxHeight': '', 'display': '' });
        };
      } else {
        animate.begin = () => {
         this.collapseProgress('begin', icn, trgt, trgtItEl, args); };
        animate.end = () => {
         this.collapseProgress('end', icn, trgt, trgtItEl, args);  };
      }
      new Animation(animate).animate(trgt);
    }
    private collapseProgress(progress: string, icon: HTEle, trgt: HTEle, trgtItemEle: HTEle, eventArgs: ExpandEventArgs  ): void {
      this.remove(icon , CLS_EXPANDICN);
      this.remove(trgtItemEle, CLS_SLCTED);
      if (progress === 'end') {
        this.add(trgt, CLS_CTNHIDE);
        icon.classList.remove(CLS_TOGANIMATE);
        this.remove(trgtItemEle, CLS_ACTIVE);
        trgt.setAttribute('aria-hidden', 'true');
        attributes (trgt.previousElementSibling, { 'aria-selected': 'false', 'aria-expanded': 'false' });
        this.trigger('expanded' , eventArgs);
      }
    }
   /**
    * Returns the current module name.
    * @returns string
    * @private
    */
    protected getModuleName(): string {
        return 'accordion';
    }
    private itemAttribUpdate(): void {
      let itemEle: HTEle[] = [].slice.call(this.element.children);
      let itemLen: number = this.items.length;
      itemEle.forEach((ele: HTEle): void => {
        select('.' + CLS_HEADER, ele).setAttribute('aria-level', '' + itemLen);
      });
    }
    /**
     * Adds new item to the Accordion with the specified index of the Accordion.
     * @param  {AccordionItemModel} item - Item array that is to be added to the Accordion.
     * @param  {number} index - Number value that determines where the item should be added.
     * By default, item is added at the last index if the index is not specified.
     * @returns void
     */
    public addItem (item: AccordionItemModel, index?: number): void {
      let ele: HTEle = this.element;
      if (isNOU(index)) {
        index = this.items.length; }
      if (ele.childElementCount >= index) {
        this.items.splice(index, 0, item);
        let innerItemEle: HTEle = this.renderInnerItem(item, index);
        if (ele.childElementCount === index) {
          ele.appendChild(innerItemEle);
        } else {
          ele.insertBefore(innerItemEle, ele.children[index]);
        }
        EventHandler.add(innerItemEle.querySelector('.' + CLS_HEADER), 'focus', this.focusIn, this);
        EventHandler.add(innerItemEle.querySelector('.' + CLS_HEADER), 'blur', this.focusOut, this);
        this.itemAttribUpdate();
            }
      this.expandedItems = [];
      this.expandedItemRefresh(ele);
      if (item.expanded) {
        this.expandItem(true, index);
      }
    }
    private expandedItemRefresh(ele: HTEle): void {
      [].slice.call(ele.children).forEach( (el: HTEle) => {
        if (el.classList.contains(CLS_SLCTED)) {
          this.expandedItemsPush(el);
        }
      });
    }
    /**
     * Dynamically removes item from Accordion.
     * @param  {number} index - Number value that determines which item should be removed.
     * @returns void.
     */
    public removeItem(index: number): void {
      let ele: HTEle = <HTEle>this.element.children[index];
      if (isNOU(ele)) {
           return; }
      detach(ele);
      this.items.splice(index, 1);
      this.itemAttribUpdate();
      this.expandedItems = [];
      this.expandedItemRefresh(this.element);
    }
    /**
     * Sets focus to the specified index item header in Accordion.
     * @param  {number} index - Number value that determines which item should be focused.
     * @returns void.
     */
    public select(index: number): void {
      let ele: HTEle = <HTEle>this.element.children[index];
      if (isNOU(ele) || isNOU(select('.' + CLS_HEADER, ele))) {
           return; }
      (<HTEle>ele.children[0]).focus();
    }
    /**
     * Shows or hides the specified item from Accordion.
     * @param  {number} index - Number value that determines which item should be hidden/shown.
     * @param  {Boolean} isHidden - Boolean value that determines the action either hide (true) or show (false). Default value is false.
     *  If the `isHidden` value is false, the item is shown or else item it is hidden.
     * @returns void.
     */
    public hideItem(index: number, isHidden?: Boolean): void {
      let ele: HTEle = <HTEle>this.element.children[index];
      if (isNOU(ele)) {
           return; }
      if (isNOU(isHidden)) {
           isHidden = true; }
      isHidden ? this.add(ele, CLS_ITEMHIDE ) : this.remove(ele, CLS_ITEMHIDE );
    }
    /**
     * Enables/Disables the specified Accordion item.
     * @param  {number} index - Number value that determines which item should be enabled/disabled.
     * @param  {boolean} isEnable - Boolean value that determines the action as enable (true) or disable (false).
     * If the `isEnable` value is true, the item is enabled or else it is disabled.
     * @returns void.
     */
    public  enableItem(index: number,  isEnable: boolean): void {
      let ele: HTEle = <HTEle>this.element.children[index];
      if (isNOU(ele)) {
           return; }
      let eleHeader: HTEle = <HTEle>ele.firstElementChild;
      if (isEnable) {
        this.remove(ele, CLS_DISABLE );
        attributes(eleHeader, {'tabindex': '0', 'aria-disabled': 'false'});
        eleHeader.focus();
      } else {
        if (ele.classList.contains(CLS_ACTIVE)) {
          this.expandItem(false, index);
          this.eleMoveFocus('movedown', this.element, eleHeader); }
        this.add(ele, CLS_DISABLE );
        eleHeader.setAttribute('aria-disabled', 'true');
        eleHeader.removeAttribute('tabindex');
      }
    }
    /**
     * Expands/Collapses the specified Accordion item.
     * @param  {boolean} isExpand - Boolean value that determines the action as expand or collapse.
     * @param  {number} index - Number value that determines which item should be expanded/collapsed.`index` is optional parameter.
     *  Without Specifying index, based on the `isExpand` value all Accordion item can be expanded or collapsed.
     * @returns void.
     */
    public expandItem(isExpand: boolean, index?: number): void {
      let root: HTEle = this.element;
      if (isNOU(index)) {
       if (this.expandMode === 'Single' && isExpand) {
        let ele: HTEle = <HTEle>root.children[root.childElementCount - 1];
        this.itemExpand(isExpand, ele, this.getIndexByItem(ele));
       } else {
        let item: HTMLElement = <HTMLElement>select('#' + this.lastActiveItemId, this.element);
        [].slice.call(this.element.children).forEach( (el: HTEle) => {
          this.itemExpand(isExpand, el, this.getIndexByItem(el));
          el.classList.remove(CLS_EXPANDSTATE);
        });
        let expandedItem: Element = select('.' + CLS_EXPANDSTATE, this.element);
        if (expandedItem) { expandedItem.classList.remove(CLS_EXPANDSTATE); }
        if (item) { item.classList.add(CLS_EXPANDSTATE); }
      }
      } else {
      let ele: HTEle = <HTEle>this.element.children[index];
      if (isNOU(ele) || !ele.classList.contains(CLS_SLCT) || (ele.classList.contains(CLS_ACTIVE) && isExpand)) {
           return; } else {
            if (this.expandMode === 'Single') {
              this.expandItem(false); }
            this.itemExpand(isExpand, ele, index);
           }
      }
    }
    private itemExpand(isExpand: Boolean , ele: HTEle, index: number): void {
      let ctn: HTEle = <HTEle>ele.children[1];
      if (ele.classList.contains(CLS_DISABLE)) {
        return; }
      if (isNOU(ctn) && isExpand) {
        ctn = this.contentRendering(index);
        ele.appendChild(ctn);
        this.ariaAttrUpdate(ele);
      } else if (isNOU(ctn)) {
        return;
      }
      isExpand ? this.expand(ctn) : this.collapse(ctn);
    }
    private destroyItems(): void {
      [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM)).forEach ((el: HTEle) => { detach(el); });
    }
    private updateItem(item: HTEle, index: number): void {
      if (!isNOU(item)) {
        let itemObj: Object = this.items[index];
        this.items.splice(index, 1);
        detach(item);
        this.addItem(itemObj, index);
      }
    }
    protected getPersistData(): string {
        let keyEntity: string[] = ['expandedItems'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     * @param  {AccordionModel} newProp
     * @param  {AccordionModel} oldProp
     * @returns void
     * @private
     */
    public onPropertyChanged(newProp: AccordionModel, oldProp: AccordionModel): void {
      let acrdn: HTEle = this.element;
      for (let prop of Object.keys(newProp)) {
        switch (prop) {
          case 'items':
            if (!(newProp.items instanceof Array && oldProp.items instanceof Array)) {
              let changedProp: Object[] = Object.keys(newProp.items);
              for (let j : number = 0; j < changedProp.length; j++) {
                let index: number =  parseInt(Object.keys(newProp.items)[j], 10);
                let property: Str = Object.keys(newProp.items[index])[0];
                let item: HTEle = <HTEle> selectAll('.' + CLS_ITEM, this.element)[index];
                let oldVal: Str = Object(oldProp.items[index])[property];
                let newVal: Str = Object(newProp.items[index])[property];
                if (property === 'header' || property === 'iconCss' || property === 'expanded') { this.updateItem(item, index); }
                if (property === 'cssClass' && !isNOU(item)) {
                  item.classList.remove(oldVal);
                  item.classList.add(newVal);
                }
                if (property === 'content' && !isNOU(item) && item.children.length === 2) {
                  if (item.classList.contains(CLS_SLCTED)) { this.expandItem(false, index); }
                  detach(item.querySelector('.' + CLS_CONTENT));
                }
              }
            } else {
              this.destroyItems();
              this.renderItems();
              this.initItemExpand();
            }
            break;
          case 'enableRtl':
            newProp.enableRtl ? this.add(acrdn, CLS_RTL) : this.remove(acrdn, CLS_RTL);
            break;
          case 'height':
            setStyle(this.element, { 'height': formatUnit(newProp.height) });
            break;
          case 'width':
            setStyle(this.element, { 'width': formatUnit(newProp.width) });
            break;
          case 'expandMode':
            if (newProp.expandMode === 'Single') {
              this.element.setAttribute('aria-multiselectable', 'false');
              if (this.expandedItems.length > 1) {
               this.expandItem(false); }
            } else {
              this.element.setAttribute('aria-multiselectable', 'true');
            }
            break;
        }
      }
    }
}