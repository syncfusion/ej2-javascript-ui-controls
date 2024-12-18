/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventHandler, Property, Event, EmitType, AnimationModel, KeyboardEvents, rippleEffect, animationMode } from '@syncfusion/ej2-base';
import { KeyboardEventArgs, BaseEventArgs, Effect, getUniqueID, compile as templateCompiler } from '@syncfusion/ej2-base';
import { isVisible, closest, attributes, detach, select, addClass, removeClass, append } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, Collection, Animation } from '@syncfusion/ej2-base';
import { setStyleAttribute as setStyle, Complex } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, formatUnit, selectAll, SanitizeHtmlHelper, isRippleEnabled } from '@syncfusion/ej2-base';
import { AccordionModel, AccordionItemModel, AccordionAnimationSettingsModel, AccordionActionSettingsModel } from './accordion-model';

/**
 * Specifies the option to expand single or multiple panel at a time.
 * ```props
 * Single :- Only one Accordion item can be expanded at a time.
 * Multiple :- Multiple Accordion items can be expanded simultaneously.
 * ```
 */
export type ExpandMode = 'Single' | 'Multiple';

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
const CLS_CONTAINER: Str = 'e-accordion-container';

interface AcrdnTemplateRef {
    elementRef: AcrdnElementRef
}

interface AcrdnElementRef {
    nativeElement: AcrdnElementComment
}

interface AcrdnElementComment {
    childNodes?: NodeList
    firstChild?: HTMLElement
    lastChild?: HTMLElement
    nextElementSibling?: HTMLElement
    parentElement?: HTMLElement
    propName?: HTMLElement
    data?: string
}

/** An interface that holds options to control the accordion click action. */
export interface AccordionClickArgs extends BaseEventArgs {
    /** Defines the current Accordion Item Object. */
    item?: AccordionItemModel
    /**
     * Defines the current Event arguments.
     */
    originalEvent?: Event
    /**
     * Defines whether to cancel the Accordion click action.
     * When set to `true`, the default click behavior will be prevented,
     * preventing any action associated with the Accordion item click (such as expanding or collapsing the item).
     * When set to `false` or omitted, the default click behavior will proceed as normal.
     */
    cancel?: boolean;
}
/** An interface that holds options to control the expanding item action. */
export interface ExpandEventArgs extends BaseEventArgs {
    /** Defines the current Accordion Item Object. */
    item?: AccordionItemModel
    /** Defines the current Accordion Item Element. */
    element?: HTMLElement
    /** Defines the expand/collapse state. */
    isExpanded?: boolean
    /** Defines the prevent action. */
    cancel?: boolean
    /** Defines the Accordion Item Index */
    index?: number
    /** Defines the Accordion Item Content */
    content?: HTMLElement
}

/** An interface that holds options to control the expanded item action. */
export interface ExpandedEventArgs extends BaseEventArgs {
    /** Defines the current Accordion Item Object. */
    item?: AccordionItemModel
    /** Defines the current Accordion Item Element. */
    element?: HTMLElement
    /** Defines the expand/collapse state. */
    isExpanded?: boolean
    /** Defines the Accordion Item Index */
    index?: number
    /** Defines the Accordion Item Content */
    content?: HTMLElement
}

/**
 * Objects used for configuring the Accordion expanding item action properties.
 */
export class AccordionActionSettings extends ChildProperty<AccordionActionSettings> {
    /**
     * Specifies the type of animation.
     *
     * @default 'SlideDown'
     * @aspType string
     */
    @Property('SlideDown')
    public effect: 'None' | Effect;
    /**
     * Specifies the duration to animate.
     *
     * @default 400
     */
    @Property(400)
    public duration: number;
    /**
     * Specifies the animation timing function.
     *
     * @default 'linear'
     */
    @Property('linear')
    public easing: string;
}

/**
 * Objects used for configuring the Accordion animation properties.
 */
export class AccordionAnimationSettings extends ChildProperty<AccordionAnimationSettings> {
    /**
     * Specifies the animation to appear while collapsing the Accordion item.
     *
     * @default { effect: 'SlideDown', duration: 400, easing: 'linear' }
     */
    @Complex<AccordionActionSettingsModel>({ effect: 'SlideUp', duration: 400, easing: 'linear' }, AccordionActionSettings)
    public collapse: AccordionActionSettingsModel;
    /**
     * Specifies the animation to appear while expanding the Accordion item.
     *
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
     *        items: [
     *          { header: 'Accordion Header', content: 'Accordion Content' },
     *          { header: '<div>Accordion Header</div>', content: '<div>Accordion Content</div>' },
     *          { header: '#headerContent', content: '#panelContent' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```
     *
     * @default null
     */
    @Property(null)
    public content: string;
    /**
     * Sets the header text to be displayed for the Accordion item.
     * You can set the title of the Accordion item using `header` property.
     * It also supports to include the title as `HTML element`, `string`, or `query selector`.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( {
     *        items: [
     *          { header: 'Accordion Header', content: 'Accordion Content' },
     *          { header: '<div>Accordion Header</div>', content: '<div>Accordion Content</div>' },
     *          { header: '#headerContent', content: '#panelContent' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```
     *
     * @default null
     */
    @Property(null)
    public header: string;
    /**
     * Defines single/multiple classes (separated by a space) are to be used for Accordion item customization.
     *
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Defines an icon with the given custom CSS class that is to be rendered before the header text.
     * Add the css classes to the `iconCss` property and write the css styles to the defined class to set images/icons.
     * Adding icon is applicable only to the header.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( {
     *        items: [
     *          { header: 'Accordion Header', iconCss: 'e-app-icon' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```
     * ```css
     * .e-app-icon::before {
     *   content: "\e710";
     * }
     * ```
     *
     * @default null
     */
    @Property(null)
    public iconCss: string;
    /**
     * Sets the expand (true) or collapse (false) state of the Accordion item. By default, all the items are in a collapsed state.
     *
     * @default false
     */
    @Property(false)
    public expanded: boolean;
    /**
     * Sets false to hide an accordion item.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;
    /**
     * Sets true to disable an accordion item.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;
    /**
     * Sets unique ID to accordion item.
     *
     * @default null
     */
    @Property()
    public id: string;

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
    private initExpand: number[];
    private isNested: boolean;
    private isDestroy: boolean;
    private templateEle: string[];
    private headerTemplateFn: Function;
    private itemTemplateFn: Function;
    private removeRippleEffect: () => void;
    /**
     * Contains the keyboard configuration of the Accordion.
     */
    private keyConfigs: { [key: string]: Str } = {
        moveUp: 'uparrow',
        moveDown: 'downarrow',
        enter: 'enter',
        space: 'space',
        home: 'home',
        end: 'end'
    };

    /**
     * An array of item that is used to specify Accordion items.
     * ```typescript
     *   let accordionObj: Accordion = new Accordion( {
     *        items: [
     *          { header: 'Accordion Header', content: 'Accordion Content' }]
     *        });
     *   accordionObj.appendTo('#accordion');
     * ```
     *
     * @default []
     */
    @Collection<AccordionItemModel>([], AccordionItem)
    public items: AccordionItemModel[];
    /**
     * Specifies the datasource for the accordion items.
     *
     * @isdatamanager false
     * @default []
     */
    @Property([])
    public dataSource: Object[];
    /**
     * Specifies the template option for accordion items.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public itemTemplate: string | Function;
    /**
     * Specifies the header title template option for accordion items.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public headerTemplate: string | Function;
    /**
     * Specifies the width of the Accordion in pixels/number/percentage. Number value is considered as pixels.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Specifies the height of the Accordion in pixels/number/percentage. Number value is considered as pixels.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;
    /**
     * Specifies the expanded items at initial load.
     *
     * @default []
     */
    @Property([])
    public expandedIndices: number[];
    /**
     * Specifies the options to expand single or multiple panel at a time.
     * The possible values are:
     * * `Single`: Sets to expand only one Accordion item at a time.
     * * `Multiple`: Sets to expand more than one Accordion item at a time.
     *
     * @default 'Multiple'
     */
    @Property('Multiple')
    public expandMode: ExpandMode;
    /**
     * Specifies whether to enable the rendering of untrusted HTML values in the Accordion component.
     * When this property is enabled, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;
    /**
     * Specifies the animation configuration settings for expanding and collapsing the panel.
     *
     * @default { expand: { effect: 'SlideDown', duration: 400, easing: 'linear' },
     * collapse: { effect: 'SlideUp', duration: 400, easing: 'linear' }}
     */
    @Complex<AccordionAnimationSettingsModel>({}, AccordionAnimationSettings)
    public animation: AccordionAnimationSettingsModel;
    /**
     * The event will be fired while clicking anywhere within the Accordion.
     *
     * @event clicked
     */
    @Event()
    public clicked: EmitType<AccordionClickArgs>;
    /**
     * The event will be fired before the item gets collapsed/expanded.
     *
     * @event expanding
     */
    @Event()
    public expanding: EmitType<ExpandEventArgs>;
    /**
     * The event will be fired after the item gets collapsed/expanded.
     *
     * @event expanded
     */
    @Event()
    public expanded: EmitType<ExpandedEventArgs>;
    /**
     * The event will be fired once the control rendering is completed.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;
    /**
     * The event will be fired when the control gets destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Event>;

    /**
     * Initializes a new instance of the Accordion class.
     *
     * @param {AccordionModel} options  - Specifies Accordion model properties as options.
     * @param {string | HTMLElement} element  - Specifies the element that is rendered as an Accordion.
     */
    public constructor(options?: AccordionModel, element?: string | HTMLElement) {
        super(options, <HTEle | Str>element);
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isReact || this.isAngular || this.isVue) {
            this.clearTemplate();
        }
        const ele: HTEle = this.element;
        super.destroy();
        this.unWireEvents();
        this.isDestroy = true;
        this.restoreContent(null);
        [].slice.call(ele.children).forEach((el: HTEle) => {
            ele.removeChild(el);
        });
        if (this.trgtEle) {
            this.trgtEle = null;
            while (this.ctrlTem.firstElementChild) {
                ele.appendChild(this.ctrlTem.firstElementChild);
            }
            this.ctrlTem = null;
        }
        ele.classList.remove(CLS_ACRDN_ROOT);
        ele.removeAttribute('style');
        this.element.removeAttribute('data-ripple');
        if (!this.isNested && isRippleEnabled) {
            this.removeRippleEffect();
        }
    }
    protected preRender(): void {
        const nested: Element = closest(this.element, '.' + CLS_CONTENT);
        this.isNested = false;
        this.templateEle = [];
        if (!this.isDestroy) {
            this.isDestroy = false;
        }
        if (nested && nested.firstElementChild && nested.firstElementChild.firstElementChild) {
            if (nested.firstElementChild.firstElementChild.classList.contains(CLS_ROOT)) {
                nested.classList.add(CLS_NEST);
                this.isNested = true;
            }
        } else {
            this.element.classList.add(CLS_ACRDN_ROOT);
        }
        if (this.enableRtl) {
            this.add(this.element, CLS_RTL);
        }
    }
    private add(ele: HTEle, val: Str): void {
        ele.classList.add(val);
    }
    private remove(ele: HTEle, val: Str): void {
        ele.classList.remove(val);
    }
    /**
     * To initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.initializeHeaderTemplate();
        this.initializeItemTemplate();
        this.initialize();
        this.renderControl();
        this.wireEvents();
        this.renderComplete();
    }
    private initialize(): void {
        const width: Str = formatUnit(this.width);
        const height: Str = formatUnit(this.height);
        setStyle(this.element, { 'width': width, 'height': height });
        if (isNOU(this.initExpand)) {
            this.initExpand = [];
        }
        if (!isNOU(this.expandedIndices) && this.expandedIndices.length > 0) {
            this.initExpand = this.expandedIndices;
        }
    }
    private renderControl(): void {
        this.trgtEle = (this.element.children.length > 0) ? <HTEle>select('div', this.element) : null;
        this.renderItems();
        this.initItemExpand();
    }
    private wireFocusEvents(): void {
        const acrdItem: HTEle[] = [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM));
        for (const item of acrdItem) {
            const headerEle: Element = item.querySelector('.' + CLS_HEADER);
            if (item.childElementCount > 0 && headerEle) {
                EventHandler.clearEvents(headerEle);
                EventHandler.add(headerEle, 'focus', this.focusIn, this);
                EventHandler.add(headerEle, 'blur', this.focusOut, this);
            }
        }
    }
    private unWireEvents(): void {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        if (!isNOU(this.keyModule)) {
            this.keyModule.destroy();
        }
    }
    private wireEvents(): void {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
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
    private templateParser(template: string | Function): (template: string | Function) => NodeList | undefined {
        if (template) {
            try {
                if (typeof template !== 'function' && document.querySelectorAll(template).length) {
                    return templateCompiler(document.querySelector(template).innerHTML.trim());
                } else {
                    return templateCompiler(template);
                }
            } catch (error) {
                return templateCompiler(template);
            }
        }
        return undefined;
    }
    private initializeHeaderTemplate(): void {
        if (this.headerTemplate) {
            this.headerTemplateFn = this.templateParser(this.headerTemplate);
        }
    }
    private initializeItemTemplate(): void {
        if (this.itemTemplate) {
            this.itemTemplateFn = this.templateParser(this.itemTemplate);
        }
    }
    private getHeaderTemplate(): Function {
        return this.headerTemplateFn;
    }
    private getItemTemplate(): Function {
        return this.itemTemplateFn;
    }
    private focusIn(e: FocusEvent): void {
        (<HTEle>e.target).parentElement.classList.add(CLS_ITEMFOCUS);
    }
    private focusOut(e: FocusEvent): void {
        (<HTEle>e.target).parentElement.classList.remove(CLS_ITEMFOCUS);
    }
    private ctrlTemplate(): void {
        this.ctrlTem = <HTEle>this.element.cloneNode(true);
        let innerEles: HTMLCollection;
        const rootEle: HTMLElement = <HTMLElement>select('.' + CLS_CONTAINER, this.element);
        if (rootEle) {
            innerEles = rootEle.children as HTMLCollection;
        } else {
            innerEles = this.element.children as HTMLCollection;
        }
        const items: AccordionItemModel[] = [];
        [].slice.call(innerEles).forEach((el: HTEle) => {
            items.push({
                header: (el.childElementCount > 0 && el.children[0]) ? (el.children[0]) as any : '',
                content: (el.childElementCount > 1 && el.children[1]) ? (el.children[1]) as any : ''
            });
            el.parentNode.removeChild(el);
        });
        if (rootEle) {
            this.element.removeChild(rootEle);
        }
        this.setProperties({ items: items }, true);
    }
    private toggleIconGenerate(): HTEle {
        const tglIcon: HTEle = this.createElement('div', { className: CLS_TOOGLEICN });
        const hdrColIcon: HTEle = this.createElement('span', { className: CLS_COLLAPSEICN });
        tglIcon.appendChild(hdrColIcon);
        return tglIcon;
    }
    private initItemExpand(): void {
        const len: number = this.initExpand.length;
        if (len === 0) {
            return;
        }
        if (this.expandMode === 'Single') {
            this.expandItem(true, this.initExpand[len - 1]);
        } else {
            for (let i: number = 0; i < len; i++) {
                this.expandItem(true, this.initExpand[parseInt(i.toString(), 10)]);
            }
        }
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    private renderItems(): void {
        const ele: HTEle = this.element;
        let innerItem: HTEle;
        let innerDataSourceItem: HTEle;
        if (!isNOU(this.trgtEle)) {
            this.ctrlTemplate();
        }
        if (!isNOU(this.dataSource) && this.dataSource.length > 0) {
            this.dataSource.forEach((item: object, index: number) => {
                innerDataSourceItem = this.renderInnerItem(item, index);
                ele.appendChild(innerDataSourceItem);
                if (innerDataSourceItem.childElementCount > 0) {
                    EventHandler.add(innerDataSourceItem.querySelector('.' + CLS_HEADER), 'focus', this.focusIn, this);
                    EventHandler.add(innerDataSourceItem.querySelector('.' + CLS_HEADER), 'blur', this.focusOut, this);
                }
            });
        } else {
            const items: AccordionItem[] = <AccordionItem[]>this.items;
            if (ele && items.length > 0) {
                items.forEach((item: AccordionItem, index: number) => {
                    innerItem = this.renderInnerItem(item, index);
                    ele.appendChild(innerItem);
                    if (innerItem.childElementCount > 0) {
                        EventHandler.add(innerItem.querySelector('.' + CLS_HEADER), 'focus', this.focusIn, this);
                        EventHandler.add(innerItem.querySelector('.' + CLS_HEADER), 'blur', this.focusOut, this);
                    }
                });
            }
        }
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    private clickHandler(e: Event): void {
        const trgt: HTEle = <HTEle>e.target;
        const items: Object[] = this.getItems();
        const eventArgs: AccordionClickArgs = {};
        let tglIcon: HTEle;
        const acrdEle: HTEle = <HTEle>closest(trgt, '.' + CLS_ROOT);
        if (acrdEle !== this.element) {
            return;
        }
        trgt.classList.add('e-target');
        const acrdnItem: HTEle = <HTEle>closest(trgt, '.' + CLS_ITEM);
        let acrdnHdr: HTEle = <HTEle>closest(trgt, '.' + CLS_HEADER);
        let acrdnCtn: HTEle = <HTEle>closest(trgt, '.' + CLS_CONTENT);
        if (acrdnItem && (isNOU(acrdnHdr) || isNOU(acrdnCtn))) {
            acrdnHdr = <HTEle>acrdnItem.children[0];
            acrdnCtn = <HTEle>acrdnItem.children[1];
        }
        if (acrdnHdr) {
            tglIcon = <HTEle>select('.' + CLS_TOOGLEICN, acrdnHdr);
        }
        let acrdnCtnItem: HTEle;
        if (acrdnHdr) {
            acrdnCtnItem = <HTEle>closest(acrdnHdr, '.' + CLS_ITEM);
        } else if (acrdnCtn) {
            acrdnCtnItem = <HTEle>closest(acrdnCtn, '.' + CLS_ITEM);
        }
        const index: number = this.getIndexByItem(acrdnItem);
        if (acrdnCtnItem) {
            eventArgs.item = items[this.getIndexByItem(acrdnCtnItem)];
        }
        eventArgs.originalEvent = e;
        const ctnCheck: boolean = !isNOU(tglIcon) && acrdnItem.childElementCount <= 1;
        if (ctnCheck && (isNOU(acrdnCtn) || !isNOU(select('.' + CLS_HEADER + ' .' + CLS_TOOGLEICN, acrdnCtnItem)))) {
            acrdnItem.appendChild(this.contentRendering(index));
            this.ariaAttrUpdate(acrdnItem);
            this.afterContentRender(trgt, eventArgs, acrdnItem, acrdnHdr, acrdnCtn, acrdnCtnItem);
        } else {
            this.afterContentRender(trgt, eventArgs, acrdnItem, acrdnHdr, acrdnCtn, acrdnCtnItem);
        }
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    private afterContentRender(
        trgt: HTEle, eventArgs: AccordionClickArgs, acrdnItem: HTEle, acrdnHdr: HTEle, acrdnCtn: HTEle, acrdnCtnItem: HTEle): void {
        const acrdActive: HTEle[] = [];
        this.trigger('clicked', eventArgs, (eventArgs: AccordionClickArgs) => {
            if (eventArgs.cancel) {
                return;
            }
            let cntclkCheck: boolean = (acrdnCtn && !isNOU(select('.e-target', acrdnCtn)));
            const inlineAcrdnSel: string = '.' + CLS_CONTENT + ' .' + CLS_ROOT;
            const inlineEleAcrdn: boolean = acrdnCtn && !isNOU(select('.' + CLS_ROOT, acrdnCtn)) && isNOU(closest(trgt, inlineAcrdnSel));
            const nestContCheck: boolean = acrdnCtn && isNOU(select('.' + CLS_ROOT, acrdnCtn)) || !(closest(trgt, '.' + CLS_ROOT) === this.element);
            cntclkCheck = cntclkCheck && (inlineEleAcrdn || nestContCheck);
            trgt.classList.remove('e-target');
            if (trgt.classList.contains(CLS_CONTENT) || trgt.classList.contains(CLS_CTENT) || cntclkCheck) {
                return;
            }
            const acrdcontainer: HTMLElement = <HTMLElement>this.element.querySelector('.' + CLS_CONTAINER);
            const acrdnchild: HTMLCollection = (acrdcontainer) ? acrdcontainer.children : this.element.children;
            [].slice.call(acrdnchild).forEach((el: HTEle) => {
                if (el.classList.contains(CLS_ACTIVE)) {
                    acrdActive.push(el);
                }
            });
            const acrdAniEle: HTEle[] = [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM + ' [' + CLS_ANIMATE + ']'));
            if (acrdAniEle.length > 0) {
                for (const el of acrdAniEle) {
                    acrdActive.push(el.parentElement);
                }
            }
            const sameContentCheck: boolean = acrdActive.indexOf(acrdnCtnItem) !== -1 && acrdnCtn.getAttribute('e-animate') === 'true';
            let sameHeader: boolean = false;
            if (!isNOU(acrdnItem) && !isNOU(acrdnHdr)) {
                const acrdnCtn: HTEle = <HTEle>select('.' + CLS_CONTENT, acrdnItem);
                const acrdnRoot: HTEle = <HTEle>closest(acrdnItem, '.' + CLS_ACRDN_ROOT);
                const expandState: HTEle = <HTEle>acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
                if (isNOU(acrdnCtn)) {
                    return;
                }
                sameHeader = (expandState === acrdnItem);
                if (isVisible(acrdnCtn) && (!sameContentCheck || acrdnCtnItem.classList.contains(CLS_SLCTED))) {
                    this.collapse(acrdnCtn);
                } else {
                    if ((acrdActive.length > 0) && this.expandMode === 'Single' && !sameContentCheck) {
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
        });
    }
    private eleMoveFocus(action: Str, root: HTEle, trgt: HTEle): void {
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
        const trgt: HTEle = <HTEle>e.target;
        const header: HTEle = <HTEle>closest(e.target as HTEle, CLS_HEADER);
        if (isNOU(header) && !trgt.classList.contains(CLS_ROOT) && !trgt.classList.contains(CLS_HEADER)) {
            return;
        }
        let clst: HTEle;
        const root: HTEle = this.element;
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
                    trgt.click();
                }
            } else {
                trgt.click();
            }
            e.preventDefault();
            break;
        case 'home':
        case 'end':
            clst = e.action === 'home' ? <HTEle>root.firstElementChild.children[0] : <HTEle>root.lastElementChild.children[0];
            clst.focus();
            e.preventDefault();
            break;
        }
    }
    private headerEleGenerate(): HTEle {
        const header: HTEle = this.createElement('div', { className: CLS_HEADER, id: getUniqueID('acrdn_header') });
        const ariaAttr: { [key: string]: Str } = {
            'tabindex': '0', 'role': 'button', 'aria-disabled': 'false', 'aria-expanded': 'false'
        };
        attributes(header, ariaAttr);
        return header;
    }
    private renderInnerItem(item: AccordionItemModel, index: number): HTEle {
        const innerEle: HTEle = this.createElement('div', {
            className: CLS_ITEM, id: item.id || getUniqueID('acrdn_item')
        });
        if (this.headerTemplate) {
            const ctnEle: HTEle = this.headerEleGenerate();
            const hdrEle: HTEle = this.createElement('div', { className: CLS_HEADERCTN });
            ctnEle.appendChild(hdrEle);
            append(this.getHeaderTemplate()(item, this, 'headerTemplate', this.element.id + '_headerTemplate', false), hdrEle);
            innerEle.appendChild(ctnEle);
            ctnEle.appendChild(this.toggleIconGenerate());
            this.add(innerEle, CLS_SLCT);
            return innerEle;
        }
        if (item.header && this.angularnativeCondiCheck(item, 'header')) {
            let header: string = item.header;
            if (this.enableHtmlSanitizer && typeof (item.header) === 'string') {
                header = SanitizeHtmlHelper.sanitize(item.header);
            }
            const ctnEle: HTEle = this.headerEleGenerate();
            const hdrEle: HTEle = this.createElement('div', { className: CLS_HEADERCTN });
            ctnEle.appendChild(hdrEle);
            ctnEle.appendChild(this.fetchElement(hdrEle, header, index));
            innerEle.appendChild(ctnEle);
        }
        let hdr: HTEle = <HTEle>select('.' + CLS_HEADER, innerEle);
        if (item.expanded && !isNOU(index) && (!this.enablePersistence)) {
            if (this.initExpand.indexOf(index) === -1) {
                this.initExpand.push(index);
            }
        }
        if (item.cssClass) {
            addClass([innerEle], item.cssClass.split(' '));
        }
        if (item.disabled) {
            addClass([innerEle], CLS_DISABLE);
        }
        if (item.visible === false) {
            addClass([innerEle], CLS_ITEMHIDE);
        }
        if (item.iconCss) {
            const hdrIcnEle: HTEle = this.createElement('div', { className: CLS_HEADERICN });
            const icon: HTEle = this.createElement('span', { className: item.iconCss + ' e-icons' });
            hdrIcnEle.appendChild(icon);
            if (isNOU(hdr)) {
                hdr = this.headerEleGenerate();
                hdr.appendChild(hdrIcnEle);
                innerEle.appendChild(hdr);
            } else {
                hdr.insertBefore(hdrIcnEle, hdr.childNodes[0]);
            }
        }
        if (item.content && this.angularnativeCondiCheck(item, 'content')) {
            const hdrIcon: HTEle = this.toggleIconGenerate();
            if (isNOU(hdr)) {
                hdr = this.headerEleGenerate();
                innerEle.appendChild(hdr);
            }
            hdr.appendChild(hdrIcon);
            this.add(innerEle, CLS_SLCT);
        }
        return innerEle;
    }

    private angularnativeCondiCheck(item: AccordionItemModel, prop: string): boolean {
        const property: string = prop === 'content' ? item.content : item.header;
        const content: AcrdnTemplateRef = (property as Object) as AcrdnTemplateRef;
        if (this.isAngular && !isNOU(content.elementRef)) {
            const data: string = content.elementRef.nativeElement.data;
            if (isNOU(data) || data === '' || (data.indexOf('bindings=') === -1)) {
                return true;
            }
            const parseddata: { [key: string]: string } = JSON.parse(content.elementRef.nativeElement.data.replace('bindings=', ''));
            if (!isNOU(parseddata) && parseddata['ng-reflect-ng-if'] === 'false') {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    private fetchElement(ele: HTEle, value: Str, index: number): HTEle {
        let templateFn: Function;
        let temString: Str;
        try {
            if (document.querySelectorAll(value).length && value !== 'Button') {
                const eleVal: HTEle = <HTEle>document.querySelector(value);
                temString = eleVal.outerHTML.trim();
                ele.appendChild(eleVal);
                eleVal.style.display = '';
            } else {
                templateFn = templateCompiler(value);
            }
        } catch (e) {
            if (typeof (value) === 'string') {
                ele.innerHTML = this.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(value) : value;
            } else if ((value as any) instanceof (HTMLElement)) {
                ele.appendChild(value as HTMLElement);
                if (this.trgtEle) {
                    (<HTMLElement>ele.firstElementChild).style.display = '';
                }
            } else {
                templateFn = templateCompiler(value);
            }
        }
        let tempArray: HTEle[];
        if (!isNOU(templateFn)) {
            if (this.isReact) {
                this.renderReactTemplates();
            }
            let templateProps: string;
            let templateName: string;
            if (ele.classList.contains(CLS_HEADERCTN)) {
                templateProps = this.element.id + index + '_header';
                templateName = 'header';
            } else if (ele.classList.contains(CLS_CTENT)) {
                templateProps = this.element.id + index + '_content';
                templateName = 'content';
            }
            tempArray = templateFn({}, this, templateName, templateProps, this.isStringTemplate);
        }
        if (!isNOU(tempArray) && tempArray.length > 0 && !(isNOU(tempArray[0].tagName) && tempArray.length === 1)) {
            [].slice.call(tempArray).forEach((el: HTEle): void => {
                if (!isNOU(el.tagName)) {
                    el.style.display = '';
                }
                ele.appendChild(el);
            });
        } else if (ele.childElementCount === 0) {
            ele.innerHTML = this.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(value) : value;
        }
        if (!isNOU(temString)) {
            if (this.templateEle.indexOf(value) === -1) {
                this.templateEle.push(value);
            }
        }
        return ele;
    }
    private ariaAttrUpdate(itemEle: HTEle): void {
        const header: Element = select('.' + CLS_HEADER, itemEle);
        const content: Element = select('.' + CLS_CONTENT, itemEle);
        header.setAttribute('aria-controls', content.id);
        content.setAttribute('aria-labelledby', header.id);
        content.setAttribute('role', 'region');
    }
    private contentRendering(index: number): HTEle {
        const itemcnt: HTEle = this.createElement('div', { className: CLS_CONTENT + ' ' + CLS_CTNHIDE, id: getUniqueID('acrdn_panel') });
        attributes(itemcnt, { 'aria-hidden': 'true' });
        const ctn: HTEle = this.createElement('div', { className: CLS_CTENT });
        if (!isNOU(this.dataSource) && this.dataSource.length > 0) {
            if (this.isReact) {
                this.renderReactTemplates();
            }
            append(this.getItemTemplate()(this.dataSource[parseInt(index.toString(), 10)], this, 'itemTemplate', this.element.id + '_itemTemplate', false), ctn);
            itemcnt.appendChild(ctn);
        } else {
            let content: string = this.items[parseInt(index.toString(), 10)].content;
            if (this.enableHtmlSanitizer && typeof (content) === 'string') {
                content = SanitizeHtmlHelper.sanitize(content);
            }
            itemcnt.appendChild(this.fetchElement(ctn, content, index));
        }
        return itemcnt;
    }
    private expand(trgt: HTEle): void {
        const items: Object[] = this.getItems();
        const trgtItemEle: HTEle = <HTEle>closest(trgt, '.' + CLS_ITEM);
        if (isNOU(trgt) || (isVisible(trgt) && trgt.getAttribute('e-animate') !== 'true') || trgtItemEle.classList.contains(CLS_DISABLE)) {
            return;
        }
        const acrdnRoot: HTEle = <HTEle>closest(trgtItemEle, '.' + CLS_ACRDN_ROOT);
        const expandState: HTEle = <HTEle>acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
        const animation: AnimationModel = {
            name: <Effect>this.animation.expand.effect,
            duration: this.animation.expand.duration,
            timingFunction: this.animation.expand.easing
        };
        const icon: HTEle = <HTEle>select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
        const eventArgs: ExpandEventArgs = {
            element: trgtItemEle,
            item: items[this.getIndexByItem(trgtItemEle)],
            index: this.getIndexByItem(trgtItemEle),
            content: trgtItemEle.querySelector('.' + CLS_CONTENT),
            isExpanded: true
        };
        this.trigger('expanding', eventArgs, (expandArgs: ExpandEventArgs) => {
            if (!expandArgs.cancel) {
                icon.classList.add(CLS_TOGANIMATE);
                this.expandedItemsPush(trgtItemEle);
                if (!isNOU(expandState)) {
                    expandState.classList.remove(CLS_EXPANDSTATE);
                }
                trgtItemEle.classList.add(CLS_EXPANDSTATE);
                if ((animation.name === <Effect>'None' && animationMode !== 'Enable') || (animationMode === 'Disable')) {
                    this.expandProgress('begin', icon, trgt, trgtItemEle, expandArgs);
                    this.expandProgress('end', icon, trgt, trgtItemEle, expandArgs);
                } else {
                    this.expandAnimation(animation.name, icon, trgt, trgtItemEle, animation, expandArgs);
                }
            }
        });
    }
    private expandAnimation(ef: Str, icn: HTEle, trgt: HTEle, trgtItemEle: HTEle, animate: AnimationModel, args: ExpandEventArgs): void {
        if (ef === 'None' && animationMode === 'Enable'){
            ef = 'SlideDown';
            animate.name = 'SlideDown';
        }
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
        this.remove(trgt, CLS_CTNHIDE);
        this.add(trgtItemEle, CLS_SLCTED);
        this.add(icon, CLS_EXPANDICN);
        if (progress === 'end') {
            this.add(trgtItemEle, CLS_ACTIVE);
            trgt.setAttribute('aria-hidden', 'false');
            attributes(trgt.previousElementSibling, { 'aria-expanded': 'true'  });
            icon.classList.remove(CLS_TOGANIMATE);
            this.trigger('expanded', eventArgs);
        }
    }
    private expandedItemsPush(item: HTEle): void {
        const index: number = this.getIndexByItem(item);
        if (this.expandedIndices.indexOf(index) === -1) {
            const temp: number[] = [].slice.call(this.expandedIndices);
            temp.push(index);
            this.setProperties({ expandedIndices: temp }, true);
        }
    }
    private getIndexByItem(item: HTEle): number {
        const itemEle: HTEle[] = this.getItemElements();
        return [].slice.call(itemEle).indexOf(item);
    }
    private getItemElements(): HTEle[] {
        const itemEle: HTEle[] = [];
        const itemCollection: HTMLCollection = this.element.children;
        [].slice.call(itemCollection).forEach((el: HTEle) => {
            if (el.classList.contains(CLS_ITEM)) {
                itemEle.push(el);
            }
        });
        return itemEle;
    }
    private expandedItemsPop(item: HTEle): void {
        const index: number = this.getIndexByItem(item);
        const temp: number[] = [].slice.call(this.expandedIndices);
        temp.splice(temp.indexOf(index), 1);
        this.setProperties({ expandedIndices: temp }, true);
    }
    private collapse(trgt: HTEle): void {
        if (isNOU(trgt)) { return; }
        const items: Object[] = this.getItems();
        const trgtItemEle: HTEle = <HTEle>closest(trgt, '.' + CLS_ITEM);
        if (!isVisible(trgt) || trgtItemEle.classList.contains(CLS_DISABLE)) {
            return;
        }
        const animation: AnimationModel = {
            name: <Effect>this.animation.collapse.effect,
            duration: this.animation.collapse.duration,
            timingFunction: this.animation.collapse.easing
        };
        const icon: HTEle = <HTEle>select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
        const eventArgs: ExpandEventArgs = {
            element: trgtItemEle,
            item: items[this.getIndexByItem(trgtItemEle)],
            index: this.getIndexByItem(trgtItemEle),
            content: trgtItemEle.querySelector('.' + CLS_CONTENT),
            isExpanded: false
        };
        this.trigger('expanding', eventArgs, (expandArgs: ExpandEventArgs) => {
            if (!expandArgs.cancel) {
                this.expandedItemsPop(trgtItemEle);
                trgtItemEle.classList.remove(CLS_EXPANDSTATE);
                icon.classList.add(CLS_TOGANIMATE);
                if ((animation.name === <Effect>'None' && animationMode !== 'Enable') || (animationMode === 'Disable')) {
                    this.collapseProgress('begin', icon, trgt, trgtItemEle, expandArgs);
                    this.collapseProgress('end', icon, trgt, trgtItemEle, expandArgs);
                } else {
                    this.collapseAnimation(animation.name, trgt, trgtItemEle, icon, animation, expandArgs);
                }
            }
        });
    }
    private collapseAnimation(ef: Str, trgt: HTEle, trgtItEl: HTEle, icn: HTEle, animate: AnimationModel, args: ExpandEventArgs): void {
        if (ef === 'None' && animationMode === 'Enable') {
            ef = 'SlideUp';
            animate.name = 'SlideUp';
        }
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
        this.remove(icon, CLS_EXPANDICN);
        this.remove(trgtItemEle, CLS_SLCTED);
        if (progress === 'end') {
            this.add(trgt, CLS_CTNHIDE);
            icon.classList.remove(CLS_TOGANIMATE);
            this.remove(trgtItemEle, CLS_ACTIVE);
            trgt.setAttribute('aria-hidden', 'true');
            attributes(trgt.previousElementSibling, { 'aria-expanded': 'false' });
            this.trigger('expanded', eventArgs);
        }
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    protected getModuleName(): string {
        return 'accordion';
    }
    private getItems(): Object[] {
        let items: AccordionItemModel[] | Object[];
        if (this.itemTemplate && this.headerTemplate) {
            items = this.dataSource;
        } else {
            items = this.items;
        }
        return items;
    }
    /**
     * Adds new item to the Accordion with the specified index of the Accordion.
     *
     * @param  {AccordionItemModel | AccordionItemModel[] | Object | Object[]} item - Item array that is to be added to the Accordion.
     * @param  {number} index - Number value that determines where the item should be added.
     * By default, item is added at the last index if the index is not specified.
     * @returns {void}
     */
    public addItem(item: AccordionItemModel | AccordionItemModel[] | Object | Object[], index?: number): void {
        const ele: HTEle = this.element;
        const itemEle: HTEle[] = this.getItemElements();
        const items: Object[] = this.getItems();
        if (isNOU(index)) {
            index = items.length;
        }
        if (ele.childElementCount >= index) {
            const addItems: AccordionItemModel[] = (item instanceof Array) ? item : [item];
            addItems.forEach((addItem: AccordionItemModel, i: number) => {
                const itemIndex: number = index + i;
                items.splice(itemIndex, 0, addItem);
                const innerItemEle: HTEle = this.renderInnerItem(addItem, itemIndex);
                if (ele.childElementCount === itemIndex) {
                    ele.appendChild(innerItemEle);
                } else {
                    ele.insertBefore(innerItemEle, itemEle[parseInt(itemIndex.toString(), 10)]);
                }
                EventHandler.add(innerItemEle.querySelector('.' + CLS_HEADER), 'focus', this.focusIn, this);
                EventHandler.add(innerItemEle.querySelector('.' + CLS_HEADER), 'blur', this.focusOut, this);
                this.expandedIndices = [];
                this.expandedItemRefresh();
                if (addItem && (addItem as AccordionItemModel).expanded) {
                    this.expandItem(true, itemIndex);
                }
            });
        }
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    private expandedItemRefresh(): void {
        const itemEle: HTEle[] = this.getItemElements();
        [].slice.call(itemEle).forEach((el: HTEle) => {
            if (el.classList.contains(CLS_SLCTED)) {
                this.expandedItemsPush(el);
            }
        });
    }
    /**
     * Dynamically removes item from Accordion.
     *
     * @param  {number} index - Number value that determines which item should be removed.
     * @returns {void}.
     */
    public removeItem(index: number): void {
        if (this.isReact || this.isAngular) {
            const item: HTEle = <HTEle>selectAll('.' + CLS_ITEM, this.element)[parseInt(index.toString(), 10)];
            const header: HTEle = <HTEle>select('.' + CLS_HEADERCTN, item);
            const content: HTEle = <HTEle>select('.' + CLS_CTENT, item);
            this.clearAccordionTemplate(header, this.dataSource.length > 0 ? 'headerTemplate' : 'header', CLS_HEADERCTN);
            this.clearAccordionTemplate(content, this.dataSource.length > 0 ? 'itemTemplate' : 'content', CLS_CTENT);
        }
        const itemEle: HTEle[] = this.getItemElements();
        const ele: HTEle = <HTEle>itemEle[parseInt(index.toString(), 10)];
        const items: Object[] = this.getItems();
        if (isNOU(ele)) {
            return;
        }
        this.restoreContent(index);
        detach(ele);
        items.splice(index, 1);
        this.expandedIndices = [];
        this.expandedItemRefresh();
    }
    /**
     * Sets focus to the specified index item header in Accordion.
     *
     * @param  {number} index - Number value that determines which item should be focused.
     * @returns {void}.
     */
    public select(index: number): void {
        const itemEle: HTEle[] = this.getItemElements();
        const ele: HTEle = <HTEle>itemEle[parseInt(index.toString(), 10)];
        if (isNOU(ele) || isNOU(select('.' + CLS_HEADER, ele))) {
            return;
        }
        (<HTEle>ele.children[0]).focus();
    }
    /**
     * Shows or hides the specified item from Accordion.
     *
     * @param  {number} index - Number value that determines which item should be hidden/shown.
     * @param  {boolean} isHidden - Boolean value that determines the action either hide (true) or show (false). Default value is false.
     * If the `isHidden` value is false, the item is shown or else item it is hidden.
     * @returns {void}.
     */
    public hideItem(index: number, isHidden?: boolean): void {
        const itemEle: HTEle[] = this.getItemElements();
        const ele: HTEle = <HTEle>itemEle[parseInt(index.toString(), 10)];
        if (isNOU(ele)) {
            return;
        }
        if (isNOU(isHidden)) {
            isHidden = true;
        }
        if (isHidden) {
            this.add(ele, CLS_ITEMHIDE);
        } else {
            this.remove(ele, CLS_ITEMHIDE);
        }
    }
    /**
     * Enables/Disables the specified Accordion item.
     *
     * @param  {number} index - Number value that determines which item should be enabled/disabled.
     * @param  {boolean} isEnable - Boolean value that determines the action as enable (true) or disable (false).
     * If the `isEnable` value is true, the item is enabled or else it is disabled.
     * @returns {void}.
     */
    public enableItem(index: number, isEnable: boolean): void {
        const itemEle: HTEle[] = this.getItemElements();
        const ele: HTEle = <HTEle>itemEle[parseInt(index.toString(), 10)];
        if (isNOU(ele)) {
            return;
        }
        const eleHeader: HTEle = <HTEle>ele.firstElementChild;
        if (isEnable) {
            this.remove(ele, CLS_DISABLE);
            attributes(eleHeader, { 'tabindex': '0', 'aria-disabled': 'false' });
            eleHeader.focus();
        } else {
            if (ele.classList.contains(CLS_ACTIVE)) {
                this.expandItem(false, index);
                this.eleMoveFocus('movedown', this.element, eleHeader);
            }
            this.add(ele, CLS_DISABLE);
            eleHeader.setAttribute('aria-disabled', 'true');
            eleHeader.removeAttribute('tabindex');
        }
    }
    /**
     * Expands/Collapses the specified Accordion item.
     *
     * @param  {boolean} isExpand - Boolean value that determines the action as expand or collapse.
     * @param  {number} index - Number value that determines which item should be expanded/collapsed.`index` is optional parameter.
     * Without Specifying index, based on the `isExpand` value all Accordion item can be expanded or collapsed.
     * @returns {void}.
     */
    public expandItem(isExpand: boolean, index?: number): void {
        const itemEle: HTEle[] = this.getItemElements();
        if (isNOU(index)) {
            if (this.expandMode === 'Single' && isExpand) {
                const ele: HTEle = <HTEle>itemEle[itemEle.length - 1];
                this.itemExpand(isExpand, ele, this.getIndexByItem(ele));
            } else {
                const item: HTMLElement = <HTMLElement>select('#' + this.lastActiveItemId, this.element);
                [].slice.call(itemEle).forEach((el: HTEle) => {
                    this.itemExpand(isExpand, el, this.getIndexByItem(el));
                    el.classList.remove(CLS_EXPANDSTATE);
                });
                const expandedItem: Element = select('.' + CLS_EXPANDSTATE, this.element);
                if (expandedItem) {
                    expandedItem.classList.remove(CLS_EXPANDSTATE);
                }
                if (item) {
                    item.classList.add(CLS_EXPANDSTATE);
                }
            }
        } else {
            const ele: HTEle = <HTEle>itemEle[parseInt(index.toString(), 10)];
            if (isNOU(ele) || !ele.classList.contains(CLS_SLCT) || (ele.classList.contains(CLS_ACTIVE) && isExpand)) {
                return;
            } else {
                if (this.expandMode === 'Single') {
                    this.expandItem(false);
                }
                this.itemExpand(isExpand, ele, index);
            }
        }
    }
    private itemExpand(isExpand: boolean, ele: HTEle, index: number): void {
        let ctn: HTEle = <HTEle>ele.children[1];
        if (ele.classList.contains(CLS_DISABLE)) {
            return;
        }
        if (isNOU(ctn) && isExpand) {
            ctn = this.contentRendering(index);
            ele.appendChild(ctn);
            this.ariaAttrUpdate(ele);
            this.expand(ctn);
        } else if (!isNOU(ctn)) {
            if (isExpand) {
                this.expand(ctn);
            } else {
                this.collapse(ctn);
            }
        }
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    private destroyItems(): void {
        this.restoreContent(null);
        if (this.isReact || this.isAngular || this.isVue) {
            this.clearTemplate();
        }
        [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM)).forEach((el: HTEle) => {
            detach(el);
        });
    }
    private restoreContent(index: number): void {
        let ctnElePos: HTMLElement;
        if (isNOU(index)) {
            ctnElePos = this.element;
        } else {
            ctnElePos = <HTMLElement>this.element.querySelectorAll('.' + CLS_ITEM)[parseInt(index.toString(), 10)];
        }
        this.templateEle.forEach((eleStr: Str): void => {
            if (!isNOU(ctnElePos.querySelector(eleStr))) {
                (<HTEle>document.body.appendChild(ctnElePos.querySelector(eleStr))).style.display = 'none';
            }
        });
    }
    private updateItem(item: HTEle, index: number): void {
        if (!isNOU(item)) {
            const items: Object[] = this.getItems();
            const itemObj: Object = items[parseInt(index.toString(), 10)];
            items.splice(index, 1);
            this.restoreContent(index);
            const header: HTEle = <HTEle>select('.' + CLS_HEADERCTN, item);
            const content: HTEle = <HTEle>select('.' + CLS_CTENT, item);
            if (this.isReact || this.isAngular) {
                this.clearAccordionTemplate(header, 'header', CLS_HEADERCTN);
                this.clearAccordionTemplate(content, 'content', CLS_CTENT);
            }
            detach(item);
            this.addItem(itemObj, index);
        }
    }
    private setTemplate(template: string | HTMLElement, toElement: HTMLElement, index: number): void {
        this.fetchElement(toElement, template as string, index);
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    private clearAccordionTemplate(templateEle: HTMLElement, templateName: string, className: string): void {
        if ((this as Record<string, any>).registeredTemplate && (this as Record<string, any>).registeredTemplate[`${templateName}`]) {
            const registeredTemplates: Record<string, any> = (this as Record<string, any>).registeredTemplate;
            for (let index: number = 0; index < registeredTemplates[`${templateName}`].length; index++) {
                const registeredItem: Element = registeredTemplates[`${templateName}`][parseInt(index.toString(), 10)].rootNodes[0];
                const closestItem: Element = closest(registeredItem, '.' + className);
                if (!isNOU(closestItem) && closestItem === templateEle || isNOU(registeredItem.parentNode)) {
                    this.clearTemplate([templateName], [registeredTemplates[`${templateName}`][parseInt(index.toString(), 10)]]);
                    break;
                }
            }
        } else if ((this as Record<string, any>).portals && (this as Record<string, any>).portals.length > 0) {
            const portals: Record<string, any>[] = (this as Record<string, any>).portals;
            for (let index: number = 0; index < portals.length; index++) {
                const portalItem: Record<string, any> = portals[parseInt(index.toString(), 10)];
                const closestItem: Element = closest(portalItem.containerInfo, '.' + className);
                if (!isNOU(closestItem) && closestItem === templateEle) {
                    this.clearTemplate([templateName], index);
                    break;
                }
            }
        }
    }
    protected getPersistData(): string {
        const keyEntity: string[] = ['expandedIndices'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     *
     * @param  {AccordionModel} newProp - It contains the new value of data.
     * @param  {AccordionModel} oldProp - It contains the old value of data.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: AccordionModel, oldProp: AccordionModel): void {
        const acrdn: HTEle = this.element;
        let isRefresh: boolean = false;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'items':
                if (!(newProp.items instanceof Array && oldProp.items instanceof Array)) {
                    const changedProp: Object[] = Object.keys(newProp.items);
                    for (let j: number = 0; j < changedProp.length; j++) {
                        const index: number = parseInt(Object.keys(newProp.items)[parseInt(j.toString(), 10)], 10);
                        const property: Str[] = Object.keys(newProp.items[parseInt(index.toString(), 10)]);
                        for (let k: number = 0; k < property.length; k++) {
                            const item: HTEle = <HTEle>selectAll('.' + CLS_ITEM, this.element)[parseInt(index.toString(), 10)];
                            const oldVal: Str = Object(oldProp.items[parseInt(index.toString(), 10)])[`${property[parseInt(k.toString(), 10)]}`];
                            const newVal: Str = Object(newProp.items[parseInt(index.toString(), 10)])[`${property[parseInt(k.toString(), 10)]}`];
                            const temp: Str = property[parseInt(k.toString(), 10)];
                            const content: HTEle = <HTEle>select('.' + CLS_CTENT, item);
                            if (temp === 'header' || temp === 'iconCss' || temp === 'expanded' || ((temp === 'content') && (oldVal === ''))) {
                                this.updateItem(item, index);
                            }
                            if (property[parseInt(k.toString(), 10)] === 'cssClass' && !isNOU(item)) {
                                if (oldVal) { removeClass([item], oldVal.split(' ')); }
                                if (newVal) { addClass([item], newVal.split(' ')); }
                            }
                            if (property[parseInt(k.toString(), 10)] === 'visible' && !isNOU(item)) {
                                if (Object(newProp.items[parseInt(index.toString(), 10)])[`${property[parseInt(k.toString(), 10)]}`] === false) {
                                    item.classList.add(CLS_ITEMHIDE);
                                } else {
                                    item.classList.remove(CLS_ITEMHIDE);
                                }
                            }
                            if (property[parseInt(k.toString(), 10)] === 'disabled' && !isNOU(item)) {
                                this.enableItem(index, !newVal);
                            }
                            if (property.indexOf('header') < 0 && property[parseInt(k.toString(), 10)] === 'content'
                                && !isNOU(item) && item.children.length === 2) {
                                if (typeof newVal === 'function') {
                                    if (this.isAngular || this.isReact) {
                                        this.clearAccordionTemplate(content, property[parseInt(k.toString(), 10)], CLS_CTENT);
                                    }
                                    const activeContent: HTEle = item.querySelector('.' + CLS_CTENT);
                                    activeContent.innerHTML = '';
                                    this.setTemplate(newVal, activeContent, index);
                                } else {
                                    if (item.classList.contains(CLS_SLCTED)) {
                                        this.expandItem(false, index);
                                    }
                                    detach(item.querySelector('.' + CLS_CONTENT));
                                }
                            }
                        }
                    }
                } else {
                    isRefresh = true;
                }
                break;
            case 'dataSource':
            case 'expandedIndices':
                if (this.expandedIndices === null) {
                    this.expandedIndices = [];
                }
                isRefresh = true;
                break;
            case 'headerTemplate':
                this.initializeHeaderTemplate();
                isRefresh = true;
                break;
            case 'itemTemplate':
                this.initializeItemTemplate();
                isRefresh = true;
                break;
            case 'enableRtl':
                if (newProp.enableRtl) {
                    this.add(acrdn, CLS_RTL);
                } else {
                    this.remove(acrdn, CLS_RTL);
                }
                break;
            case 'height':
                setStyle(this.element, { 'height': formatUnit(newProp.height) });
                break;
            case 'width':
                setStyle(this.element, { 'width': formatUnit(newProp.width) });
                break;
            case 'expandMode':
                if (newProp.expandMode === 'Single' && !isNOU(this.expandedIndices) && this.expandedIndices.length > 1) {
                    this.expandItem(false);
                }
                break;
            }
        }
        if (isRefresh) {
            this.initExpand = [];
            if (!isNOU(this.expandedIndices) && this.expandedIndices.length > 0) {
                this.initExpand = this.expandedIndices;
            }
            this.destroyItems();
            this.renderItems();
            this.initItemExpand();
        }
    }
}
