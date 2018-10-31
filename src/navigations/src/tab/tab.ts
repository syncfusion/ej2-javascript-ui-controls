import { Component, Property, Event, EmitType, closest, Collection, Complex, attributes, detach } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, AnimationOptions, select, isVisible } from '@syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs, MouseEventArgs, Effect, Browser, formatUnit, DomElements, L10n } from '@syncfusion/ej2-base';
import { setStyleAttribute as setStyle, isNullOrUndefined as isNOU, selectAll } from '@syncfusion/ej2-base';
import { EventHandler, rippleEffect, Touch, SwipeEventArgs, compile, Animation, AnimationModel, BaseEventArgs } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Toolbar, OverflowMode, ClickEventArgs } from '../toolbar/toolbar';
import { TabModel, TabItemModel, HeaderModel, TabActionSettingsModel, TabAnimationSettingsModel } from './tab-model';

type HTEle = HTMLElement;
type Str = string;

/**
 * Options to set the orientation of Tab header.
 */
export type HeaderPosition = 'Top' | 'Bottom';
/**
 * Options to set the content element height adjust modes.
 */
export type HeightStyles = 'None' | 'Auto' | 'Content' | 'Fill';

const CLS_TAB: string = 'e-tab';
const CLS_HEADER: string = 'e-tab-header';
const CLS_CONTENT: string = 'e-content';
const CLS_NEST: string = 'e-nested';
const CLS_ITEMS: string = 'e-items';
const CLS_ITEM: string = 'e-item';
const CLS_TEMPLATE: string = 'e-template';
const CLS_RTL: string = 'e-rtl';
const CLS_ACTIVE: string = 'e-active';
const CLS_DISABLE: string = 'e-disable';
const CLS_HIDDEN: string = 'e-hidden';
const CLS_FOCUS: string = 'e-focused';
const CLS_ICONS: string = 'e-icons';
const CLS_ICON: string = 'e-icon';
const CLS_ICON_CLOSE: string = 'e-close-icon';
const CLS_CLOSE_SHOW: string = 'e-close-show';
const CLS_TEXT: string = 'e-tab-text';
const CLS_INDICATOR: string = 'e-indicator';
const CLS_WRAP: string = 'e-tab-wrap';
const CLS_TEXT_WRAP: string = 'e-text-wrap';
const CLS_TAB_ICON: string = 'e-tab-icon';
const CLS_TB_ITEMS: string = 'e-toolbar-items';
const CLS_TB_ITEM: string = 'e-toolbar-item';
const CLS_TB_POP: string = 'e-toolbar-pop';
const CLS_TB_POPUP: string = 'e-toolbar-popup';
const CLS_POPUP_OPEN: string = 'e-popup-open';
const CLS_POPUP_CLOSE: string = 'e-popup-close';
const CLS_PROGRESS: string = 'e-progress';
const CLS_IGNORE: string = 'e-ignore';
const CLS_OVERLAY: string = 'e-overlay';

export interface SelectEventArgs extends BaseEventArgs {
    /** Defines the previous Tab item element. */
    previousItem: HTMLElement;
    /** Defines the previous Tab item index. */
    previousIndex: number;
    /** Defines the selected Tab item element. */
    selectedItem: HTMLElement;
    /** Defines the selected Tab item index. */
    selectedIndex: number;
    /** Defines the content selection done through swiping. */
    isSwiped: boolean;
    /** Defines the prevent action. */
    cancel?: boolean;
}
export interface SelectingEventArgs extends SelectEventArgs {
    /** Defines the selecting Tab item element. */
    selectingItem: HTMLElement;
    /** Defines the selecting Tab item index. */
    selectingIndex: number;
}
export interface RemoveEventArgs extends BaseEventArgs {
    /** Defines the removed Tab item element. */
    removedItem: HTMLElement;
    /** Defines the removed Tab item index. */
    removedIndex: number;
}
export class TabActionSettings extends ChildProperty<TabActionSettings> {
    /**
     * Specifies the animation effect for displaying Tab content.
     * @default : 'SlideLeftIn'
     * @aspType string
     */
    @Property('SlideLeftIn')
    public effect: 'None' | Effect;
    /**
     * Specifies the time duration to transform content.
     * @default : 600
     */
    @Property(600)
    public duration: number;
    /**
     * Specifies easing effect applied while transforming content.
     * @default : 'ease'
     */
    @Property('ease')
    public easing: string;
}
export class TabAnimationSettings extends ChildProperty<TabAnimationSettings> {
    /**
     * Specifies the animation to appear while moving to previous Tab content.
     * @default { effect: 'SlideLeftIn', duration: 600, easing: 'ease' }
     */
    @Complex<TabActionSettingsModel>({ effect: 'SlideLeftIn', duration: 600, easing: 'ease' }, TabActionSettings)
    public previous: TabActionSettingsModel;
    /**
     * Specifies the animation to appear while moving to next Tab content.
     * @default { effect: 'SlideRightIn', duration: 600, easing: 'ease' }
     */
    @Complex<TabActionSettingsModel>({ effect: 'SlideRightIn', duration: 600, easing: 'ease' }, TabActionSettings)
    public next: TabActionSettingsModel;
  }
/**
 * Objects used for configuring the Tab item header properties.
 */
export class Header extends ChildProperty<Header> {
    /**
     * Specifies the display text of the Tab item header.
     * @default ''
     */
    @Property('')
    public text: string | HTMLElement;
    /**
     * Specifies the icon class that is used to render an icon in the Tab header.
     * @default ''
     */
    @Property('')
    public iconCss: string;
    /**
     * Options for positioning the icon in the Tab item header. This property depends on `iconCss` property.
     * The possible values are:
     * - Left: Places the icon to the `left` of the item.
     * - Top: Places the icon on the `top` of the item.
     * - Right: Places the icon to the `right` end of the item.
     * - Bottom: Places the icon at the `bottom` of the item.
     * @default 'left'
     */
    @Property('left')
    public iconPosition: string;
}
/**
 * An array of object that is used to configure the Tab.
 */
export class TabItem extends ChildProperty<TabItem> {
    /**
     * The object used for configuring the Tab item header properties.
     * @default {}
     */
    @Complex<HeaderModel>({}, Header)
    public header: HeaderModel;
    /**
     * Specifies the content of Tab item, that is displayed when concern item header is selected.
     * @default ''
     */
    @Property('')
    public content: string | HTMLElement;
    /**
     * Sets the CSS classes to the Tab item to customize its styles.
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Sets true to disable user interactions of the Tab item.
     * @default false
     */
    @Property(false)
    public disabled: boolean;
}
/**
 * Tab is a content panel to show multiple contents in a single space, one at a time.
 * Each Tab item has an associated content, that will be displayed based on the active Tab header item.
 * ```html
 * <div id="tab"></div>
 * <script>
 *   var tabObj = new Tab();
 *   tab.appendTo("#tab");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Tab extends Component<HTMLElement> implements INotifyPropertyChanged {
    private hdrEle: HTEle;
    private cntEle: HTEle;
    private tbObj: Toolbar;
    private tbItems: HTEle;
    private tbItem: HTEle [];
    private tbPop: HTEle;
    private isTemplate: boolean;
    private isPopup: boolean;
    private isReplace: boolean;
    private prevIndex: number;
    private prevItem: HTEle;
    private popEle: DomElements;
    private actEleId: string;
    private bdrLine: HTEle;
    private popObj: Popup;
    private btnCls: HTEle;
    private cnt: string;
    private show: object = { name: 'SlideDown', duration: 100 };
    private hide: object = { name: 'SlideUp', duration: 100 };
    private enableAnimation: boolean;
    private keyModule: KeyboardEvents;
    private tabKeyModule: KeyboardEvents;
    private touchModule: Touch;
    private animateOptions: AnimationOptions = {};
    private animObj: Animation = new Animation(this.animateOptions);
    private maxHeight: number = 0;
    private title: Str = 'Close';
    private initRender: boolean;
    private prevActiveEle: string;
    private lastIndex: number = 0;
    private isSwipeed: boolean;
    private isNested: boolean;
    private itemIndexArray: string[];
    private templateEle: string[];
    /**
     * Contains the keyboard configuration of the Tab.
     */
    private keyConfigs: { [key: string]: Str } = {
        tab: 'tab',
        home: 'home',
        end: 'end',
        enter: 'enter',
        space: 'space',
        delete: 'delete',
        moveLeft: 'leftarrow',
        moveRight: 'rightarrow',
        moveUp: 'uparrow',
        moveDown: 'downarrow'
    };
    /**
     * An array of object that is used to configure the Tab component.
     * ```typescript
     *   let tabObj: Tab = new Tab( {
     *     items: [
     *       { header: { text: 'TabItem1' }, content: 'Tab Item1 Content' },
     *       { header: { text: 'TabItem2' }, content: 'Tab Item2 Content' }
     *     ]
     *   });
     *   tabObj.appendTo('#tab');
     * ```
     * @default []
     */
    @Collection<TabItemModel>([], TabItem)
    public items: TabItemModel[];
    /**
     * Specifies the width of the Tab component. Default, Tab width sets based on the width of its parent.
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Specifies the height of the Tab component. By default, Tab height is set based on the height of its parent.
     * To use height property, heightAdjustMode must be set to 'None'.
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;
    /**
     * Sets the CSS classes to root element of the Tab that helps to customize component styles.
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Specifies the index for activating the current Tab item.
     * ```typescript
     *   let tabObj: Tab = new Tab( {
     *     selectedItem: 1,
     *     items: [
     *       { header: { text: 'TabItem1' }, content: 'Tab Item1 Content' },
     *       { header: { text: 'TabItem2' }, content: 'Tab Item2 Content' }
     *     ]
     *   });
     *   tabObj.appendTo('#tab');
     * ```
     * @default 0
     */
    @Property(0)
    public selectedItem: number;
    /**
     * Specifies the orientation of Tab header.
     * The possible values are:
     * - Top: Places the Tab header on the top.
     * - Bottom: Places the Tab header at the bottom.
     * @default 'Top'
     */
    @Property('Top')
    public headerPlacement: HeaderPosition;
    /**
     * Specifies the height style for Tab content.
     * The possible values are:
     * - None: Based on the given height property, the content panel height is set.
     * - Auto: Tallest panel height of a given Tab content is set to all the other panels.
     * - Content: Based on the corresponding content height, the content panel height is set.
     * - Fill: Based on the parent height, the content panel hight is set.
     * @default 'Content'
     */
    @Property('Content')
    public heightAdjustMode: HeightStyles;
    /**
     * Specifies the Tab display mode when Tab content exceeds the viewing area.
     * The possible modes are:
     * - Scrollable: All the elements are displayed in a single line with horizontal scrolling enabled.
     * - Popup: Tab container holds the items that can be placed within the available space and rest of the items are moved to the popup.
     * If the popup content overflows the height of the page, the rest of the elements can be viewed by scrolling the popup.
     * @default 'Scrollable'
     */
    @Property('Scrollable')
    public overflowMode: OverflowMode;
    /**
     * Specifies the direction of the Tab. For the culture like Arabic, direction can be switched as right-to-left.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * Enable or disable persisting component's state between page reloads. 
     * If enabled, following list of states will be persisted.
     * 1. selectedItem
     * @default false.
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Specifies whether to show the close button for header items to remove the item from the Tab.
     * @default false
     */
    @Property(false)
    public showCloseButton: boolean;
    /**
     * Specifies the animation configuration settings while showing the content of the Tab.
     * @default 
     * { previous: { effect: 'SlideLeftIn', duration: 600, easing: 'ease' },
     *   next: { effect: 'SlideRightIn', duration: 600, easing: 'ease' } }
     */
    @Complex<TabAnimationSettingsModel>({}, TabAnimationSettings)
    public animation: TabAnimationSettingsModel;
    /**
     * The event will be fired once the component rendering is completed.
     * @event
     */
    @Event()
    public created: EmitType<Event>;
    /**
     * The event will be fired before adding the item to the Tab.
     * @event
     */
    @Event()
    public adding: EmitType<Event>;
    /**
     * The event will be fired after adding the item to the Tab.
     * @event
     */
    @Event()
    public added: EmitType<Event>;
    /**
     * The event will be fired before the item gets selected.
     * @event
     */
    @Event()
    public selecting: EmitType<SelectingEventArgs>;
    /**
     * The event will be fired after the item gets selected.
     * @event
     */
    @Event()
    public selected: EmitType<SelectEventArgs>;
    /**
     * The event will be fired before removing the item from the Tab.
     * @event
     */
    @Event()
    public removing: EmitType<RemoveEventArgs>;
    /**
     * The event will be fired after removing the item from the Tab.
     * @event
     */
    @Event()
    public removed: EmitType<RemoveEventArgs>;
    /**
     * The event will be fired when the component gets destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Event>;
    /**
     * Removes the component from the DOM and detaches all its related event handlers, attributes and classes.
     * @returns void
     */
    public destroy(): void {
        if (!isNOU(this.tbObj)) {
            this.tbObj.destroy();
        }
        this.unWireEvents();
        ['role', 'aria-disabled', 'aria-activedescendant', 'tabindex', 'aria-orientation'].forEach((val: string): void => {
            this.element.removeAttribute(val);
        });
        this.expTemplateContent();
        if (!this.isTemplate) {
            this.element.innerHTML = '';
        } else {
            let cntEle: Element = select('.' + CLS_TAB + ' > .' + CLS_CONTENT, this.element);
            this.element.classList.remove(CLS_TEMPLATE);
            if (!isNOU(cntEle)) { cntEle.innerHTML = this.cnt; }
        }
        super.destroy();
        this.trigger('destroyed');
    }
    /**
     * Initialize component
     * @private
     */
    protected preRender(): void {
        let nested: Element = closest(this.element, '.' + CLS_CONTENT);
        this.prevIndex = 0;
        this.isNested = false;
        this.isPopup = false;
        this.initRender = true;
        this.isSwipeed = false;
        this.itemIndexArray = [];
        this.templateEle = [];
        if (!isNOU(nested)) {
            nested.parentElement.classList.add(CLS_NEST);
            this.isNested = true;
        }
        let name: Str = Browser.info.name;
        let css: Str = (name === 'msie') ? 'e-ie' : (name === 'edge') ? 'e-edge' : (name === 'safari') ? 'e-safari' : '';
        setStyle(this.element, { 'width': formatUnit(this.width), 'height': formatUnit(this.height) });
        this.setCssClass(this.element, this.cssClass, true);
        attributes(this.element, { role: 'tablist', 'aria-disabled': 'false', 'aria-activedescendant': '' });
        this.setCssClass(this.element, css, true);
    }
    /**
     * Initializes a new instance of the Tab class.
     * @param options  - Specifies Tab model properties as options.
     * @param element  - Specifies the element that is rendered as a Tab.
     */
    constructor(options?: TabModel, element?: string | HTMLElement) {
        super(options, <HTEle | Str>element);
    }
    /**
     * Initialize the component rendering
     * @private
     */
    protected render(): void {
        this.btnCls = this.createElement('span', { className: CLS_ICONS + ' ' + CLS_ICON_CLOSE, attrs: { title: this.title} });
        this.renderContainer();
        this.wireEvents();
        this.initRender = false;
    }
    private renderContainer(): void {
        let ele: HTEle = this.element;
        if (this.items.length > 0 && ele.children.length === 0) {
            ele.appendChild(this.createElement('div', { className: CLS_CONTENT }));
            this.setOrientation(this.headerPlacement, this.createElement('div', { className: CLS_HEADER }));
            this.isTemplate = false;
        } else if (this.element.children.length > 0) {
            this.isTemplate = true;
            ele.classList.add(CLS_TEMPLATE);
            let header: HTEle = <HTEle>ele.querySelector('.' + CLS_HEADER);
            if (header && this.headerPlacement === 'Bottom') {
                this.setOrientation(this.headerPlacement, header); }
        }
        if (!isNOU(select('.' + CLS_HEADER, this.element)) && !isNOU(select('.' + CLS_CONTENT, this.element))) {
            this.renderHeader();
            this.tbItems = <HTEle> select('.' + CLS_HEADER + ' .' +  CLS_TB_ITEMS, this.element);
            if (!isNOU(this.tbItems)) { rippleEffect(this.tbItems, { selector: '.e-tab-wrap' }); }
            this.renderContent();
            if (selectAll('.' + CLS_TB_ITEM, this.element).length > 0) {
                this.tbItems = <HTEle> select('.' + CLS_HEADER + ' .' +  CLS_TB_ITEMS, this.element);
                this.bdrLine = this.createElement('div', { className: CLS_INDICATOR + ' ' + CLS_HIDDEN + ' ' + CLS_IGNORE });
                let scrCnt: HTEle = <HTEle> select('.e-hscroll-content', this.tbItems);
                if (!isNOU(scrCnt)) {
                    scrCnt.insertBefore(this.bdrLine, scrCnt.firstChild);
                } else {
                    this.tbItems.insertBefore(this.bdrLine, this.tbItems.firstChild);
                }
                this.setContentHeight(true);
                this.select(this.selectedItem);
            }
            this.setRTL(this.enableRtl);
        }
    }
    private renderHeader(): void {
        let tabItems: Object[] = [];
        this.hdrEle = <HTEle> select('.' + CLS_HEADER, this.element);
        if (!this.isTemplate) {
            tabItems = this.parseObject(this.items, 0);
        } else {
            let count: number = this.hdrEle.children.length;
            let hdrItems: string[] = [];
            for (let i: number = 0; i < count; i++) {
                hdrItems.push(this.hdrEle.children.item(i).innerHTML);
            }
            if (count > 0) {
                this.hdrEle.innerHTML = '';
                this.hdrEle.appendChild(this.createElement('div', {className: CLS_ITEMS}));
                hdrItems.forEach((item: string, index: number) => {
                    this.lastIndex = index;
                    let attr: object = {
                        className: CLS_ITEM, id: CLS_ITEM + '_' + index,
                        attrs: { role: 'tab', 'aria-controls': CLS_CONTENT + '_' + index, 'aria-selected': 'false' }
                    };
                    let txt: Str = this.createElement('span', {
                        className: CLS_TEXT, innerHTML: item, attrs: { 'role': 'presentation' }
                    }).outerHTML;
                    let cont: Str = this.createElement('div', {
                        className: CLS_TEXT_WRAP, innerHTML: txt + this.btnCls.outerHTML
                    }).outerHTML;
                    let wrap: HTEle = this.createElement('div', { className: CLS_WRAP, innerHTML: cont, attrs: { tabIndex: '-1' } });
                    select('.' + CLS_ITEMS, this.element).appendChild(this.createElement('div', attr));
                    selectAll('.' + CLS_ITEM, this.element)[index].appendChild(wrap);
                });
            }
        }
        this.tbObj = new Toolbar({
            width: '100%',
            overflowMode: this.overflowMode,
            items: (tabItems.length !== 0) ? tabItems : [],
            clicked: this.clickHandler.bind(this)
        });
        this.tbObj.createElement = this.createElement;
        this.tbObj.appendTo(<HTEle> this.hdrEle);
        attributes(this.element, { 'aria-orientation' : 'horizontal' });
        this.setCloseButton(this.showCloseButton);
        this.setProperties({ headerPlacement: (this.element.children.item(0).classList.contains(CLS_HEADER)) ? 'Top' : 'Bottom' }, true);
    }
    private renderContent(): void {
        this.cntEle = <HTEle> select('.' + CLS_CONTENT, this.element);
        let hdrItem: HTEle[] = selectAll('.' + CLS_TB_ITEM, this.element);
        if (this.isTemplate) {
            this.cnt = (this.cntEle.children.length > 0) ? this.cntEle.innerHTML : '';
            let contents: HTMLCollection = this.cntEle.children;
            for (let i: number = 0; i < hdrItem.length; i++) {
                if (contents.length - 1 >= i) {
                    contents.item(i).className += CLS_ITEM;
                    attributes(contents.item(i), {'role': 'tabpanel', 'aria-labelledby': CLS_ITEM + '_' + i });
                    contents.item(i).id = CLS_CONTENT + '_' + i;
                }
            }
        }
    }
    private reRenderItems(): void {
        this.renderContainer();
        if (!isNOU(this.cntEle)) {
            this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) });
        }
    }
    private parseObject(items: TabItemModel[], index: number): object[] {
        let tbCount: number = selectAll('.' + CLS_TB_ITEM, this.element).length;
        let tItems: Object[] = [];
        let txtWrapEle: HTEle;
        items.forEach((item: { [key: string]: Header }, i: number) => {
            if (isNOU(item.header) || isNOU(item.header.text)) {
                this.items.splice(i, 0);
                return;
            }
            let pos: Str = (isNOU(item.header.iconPosition)) ? '' : item.header.iconPosition;
            let css: Str = (isNOU(item.header.iconCss)) ? '' : item.header.iconCss;
            let txt: Str | HTEle = item.header.text;
            this.lastIndex = ((tbCount === 0) ? i : ((this.isReplace) ? (index + i) : (this.lastIndex + 1)));
            let disabled: Str = (item.disabled) ? ' ' + CLS_DISABLE + ' ' + CLS_OVERLAY : '';
            txtWrapEle = this.createElement('div', { className: CLS_TEXT, attrs: { 'role': 'presentation' }});
            let tHtml: Str = ((txt instanceof Object) ? (<HTEle> txt).outerHTML : txt);
            let txtEmpty: boolean = (!isNOU(tHtml) && tHtml !== '');
            if (!isNOU((<HTEle>txt).tagName)) {
              txtWrapEle.appendChild(txt as HTEle);
            } else {
              this.headerTextCompile(txtWrapEle, txt as string); }
            let tEle: HTEle;
            let icon: HTEle = this.createElement('span', {
                className: CLS_ICONS + ' ' + CLS_TAB_ICON + ' ' + CLS_ICON + '-' + pos + ' ' + css
            });
            let tCont: HTEle = this.createElement('div', { className: CLS_TEXT_WRAP});
            tCont.appendChild(txtWrapEle);
            if ((txt === '' || txt === undefined) && css === '') {
                return;
            } else {
                if ((txt !== '' && txt !== undefined) && css !== '') {
                    if ((pos === 'left' || pos === 'top')) {
                        tCont.insertBefore(icon, tCont.firstElementChild);
                    } else {
                        tCont.appendChild(icon);
                    }
                    tEle = txtWrapEle;
                } else {
                    tEle = ((css === '') ? txtWrapEle : icon);
                    if (tEle === icon) {
                      detach(txtWrapEle);
                      tCont.appendChild(icon);
                    }
                }
            }
            let wrapAttrs: { [key: string]: string } = (item.disabled) ? {} : { tabIndex: '-1' };
            tCont.appendChild(this.btnCls.cloneNode(true));
            let wrap: HTEle = this.createElement('div', { className: CLS_WRAP, attrs: wrapAttrs });
            wrap.appendChild(tCont);
            if (this.itemIndexArray === []) {
                this.itemIndexArray.push(CLS_ITEM + '_' + this.lastIndex);
            } else {
                this.itemIndexArray.splice((index + i), 0, CLS_ITEM + '_' + this.lastIndex);
            }
            let attrObj: Object = {
                id : CLS_ITEM + '_' + this.lastIndex, role: 'tab', 'aria-selected': 'false'
            };
            let tItem: { [key: string]: {}} = { htmlAttributes: attrObj, template: wrap };
            tItem.cssClass = item.cssClass + ' ' + disabled + ' ' + ((css !== '') ? 'e-i' + pos : '') + ' ' + ((!txtEmpty) ? CLS_ICON : '');
            if (pos === 'top' || pos === 'bottom') { this.element.classList.add('e-vertical-icon'); }
            tItems.push(tItem);
        });
        return tItems;
    }
    private removeActiveClass(id: string): void {
        let hdrActEle: HTEle = <HTEle> selectAll(':root .' + CLS_HEADER + ' .' + CLS_TB_ITEM + '.' + CLS_ACTIVE, this.element)[0];
        if (this.headerPlacement === 'Bottom') {
            hdrActEle = <HTEle> selectAll(':root .' + CLS_HEADER + ' .' + CLS_TB_ITEM + '.' + CLS_ACTIVE, this.element.children[1])[0];
        }
        if (!isNOU(hdrActEle)) {
            hdrActEle.classList.remove(CLS_ACTIVE);
            let no: Str = this.extIndex(hdrActEle.id);
            let trg: HTEle = this.findEle(select('.' + CLS_CONTENT, this.element).children, CLS_CONTENT + '_' + no);
        }
    }
    private checkPopupOverflow(ele: HTEle): boolean {
        this.tbPop = <HTEle> select('.' +  CLS_TB_POP, this.element);
        let popIcon: HTEle = (<HTEle> select('.e-hor-nav', this.element));
        let tbrItems: HTEle = (<HTEle> select('.' + CLS_TB_ITEMS, this.element));
        if ((this.enableRtl && ((popIcon.offsetLeft + popIcon.offsetWidth) > tbrItems.offsetLeft))
        || (!this.enableRtl && popIcon.offsetLeft < tbrItems.offsetWidth)) {
            ele.classList.add(CLS_TB_POPUP);
            this.tbPop.insertBefore(<Node> ele.cloneNode(true), selectAll('.' +  CLS_TB_POPUP, this.tbPop)[0]);
            ele.outerHTML = '';
        }
        return true;
    }
    private popupHandler(target: HTEle): number {
        let ripEle: HTEle = <HTEle> target.querySelector('.e-ripple-element');
        if (!isNOU(ripEle)) {
            ripEle.outerHTML = '';
            target.querySelector('.' + CLS_WRAP).classList.remove('e-ripple');
        }
        this.tbItem = selectAll('.' + CLS_TB_ITEMS + ' .' + CLS_TB_ITEM, this.hdrEle);
        let lastChild: HTEle = <HTEle> this.tbItem[this.tbItem.length - 1];
        if (this.tbItem.length !== 0) {
            target.classList.remove(CLS_TB_POPUP);
            this.tbItems.appendChild(target.cloneNode(true));
            this.actEleId = target.id;
            target.outerHTML = '';
            if (this.checkPopupOverflow(lastChild)) {
                let prevEle: HTEle = <HTEle> (<HTEle>this.tbItems.lastChild).previousElementSibling;
                this.checkPopupOverflow(prevEle);
            }
            this.isPopup = true;
        }
        return selectAll('.' + CLS_TB_ITEM, this.tbItems).length - 1;
    }
    private setCloseButton(val: boolean): void {
        let trg: Element = select('.' + CLS_HEADER, this.element);
        (val === true) ? trg.classList.add(CLS_CLOSE_SHOW) : trg.classList.remove(CLS_CLOSE_SHOW);
        this.tbObj.refreshOverflow();
        this.refreshActElePosition();
    }
    private prevCtnAnimation(prev: number, current: number): AnimationModel {
        let animation: AnimationModel;
        let checkRTL: boolean = this.enableRtl || this.element.classList.contains(CLS_RTL);
        if (this.isPopup || prev <= current) {
            if (this.animation.previous.effect === 'SlideLeftIn') {
                animation = { name: 'SlideLeftOut',
                 duration: this.animation.previous.duration, timingFunction: this.animation.previous.easing };
            } else {
                animation = null;
            }
            } else {
                if (this.animation.next.effect === 'SlideRightIn') {
                animation = { name: 'SlideRightOut',
                   duration: this.animation.next.duration, timingFunction: this.animation.next.easing };
               } else { animation = null; }
             }
        return animation;
    }
    private triggerPrevAnimation(oldCnt: HTEle, prevIndex: number): void {
        let animateObj: AnimationModel = this.prevCtnAnimation(prevIndex, this.selectedItem);
        if (!isNOU(animateObj)) {
        animateObj.begin = () => {
            setStyle(oldCnt , { 'position': 'absolute' });
            oldCnt.classList.add(CLS_PROGRESS);
            oldCnt.classList.add('e-view');
        };
        animateObj.end = () => {
            oldCnt.style.display = 'none';
            oldCnt.classList.remove(CLS_ACTIVE);
            oldCnt.classList.remove(CLS_PROGRESS);
            oldCnt.classList.remove('e-view');
            setStyle(oldCnt , { 'display': '' , 'position': '' });
            if (oldCnt.childNodes.length === 0 && !this.isTemplate) {
                detach(oldCnt);
            }
        };
        new Animation(animateObj).animate(oldCnt);
    } else {
        oldCnt.classList.remove(CLS_ACTIVE); }
    }
    private triggerAnimation(id: Str, value: boolean): void {
        let prevIndex : number = this.prevIndex;
        let itemCollection: HTMLElement[] = [].slice.call(this.element.querySelector('.' + CLS_CONTENT).children);
        let oldCnt: HTEle;
        itemCollection.forEach((item: HTEle) => {
            if (item.id === this.prevActiveEle) {
              oldCnt = item; }
        });
        let prevEle: HTEle = this.tbItem[prevIndex];
        let no: Str = this.extIndex(this.tbItem[this.selectedItem].id);
        let newCnt: HTEle = this.getTrgContent(this.cntEle, no);
        if (isNOU(oldCnt) && !isNOU(prevEle)) {
            let idNo: Str = this.extIndex(prevEle.id);
            oldCnt = this.getTrgContent(this.cntEle, idNo);
        }
        this.prevActiveEle = newCnt.id;
        if (this.initRender || value === false || this.animation === {} || isNOU(this.animation)) {
            if (oldCnt && oldCnt !== newCnt) { oldCnt.classList.remove(CLS_ACTIVE); }
            return; }
        let cnt: HTEle = <HTEle> select('.' + CLS_CONTENT, this.element);
        let animateObj: AnimationModel;
        if (this.prevIndex > this.selectedItem && !this.isPopup) {
            let openEff: Effect = <Effect> this.animation.previous.effect;
            animateObj = {
                name: <Effect> ((openEff === <Effect> 'None') ? '' : ((openEff !== <Effect> 'SlideLeftIn') ? openEff : 'SlideLeftIn')),
                duration: this.animation.previous.duration,
                timingFunction: this.animation.previous.easing
            };
        } else if (this.isPopup || this.prevIndex < this.selectedItem  || this.prevIndex === this.selectedItem) {
            let clsEff: Effect = <Effect> this.animation.next.effect;
            animateObj = {
                name: <Effect> ((clsEff === <Effect> 'None') ? '' : ((clsEff !== <Effect> 'SlideRightIn') ? clsEff : 'SlideRightIn')),
                duration: this.animation.next.duration,
                timingFunction: this.animation.next.easing
            };
        }
        animateObj.progress = () => {
            cnt.classList.add(CLS_PROGRESS); this.setActiveBorder();
        };
        animateObj.end = () => {
            cnt.classList.remove(CLS_PROGRESS);
            newCnt.classList.add(CLS_ACTIVE);
        };
        if (!this.initRender && !isNOU(oldCnt)) {
          this.triggerPrevAnimation(oldCnt, prevIndex); }
        this.isPopup = false;
        if (animateObj.name === <Effect>'') {
          newCnt.classList.add(CLS_ACTIVE);
        } else {
          new Animation(animateObj).animate(newCnt); }
    }
    private keyPressed(trg: HTEle): void {
        let trgParent: HTEle = <HTEle> closest(trg, '.' + CLS_HEADER + ' .' + CLS_TB_ITEM);
        let trgIndex: number = this.getEleIndex(trgParent);
        if (!isNOU(this.popEle) && trg.classList.contains('e-hor-nav')) {
            (this.popEle.classList.contains(CLS_POPUP_OPEN)) ? this.popObj.hide(this.hide) : this.popObj.show(this.show);
        } else if (trg.classList.contains('e-scroll-nav')) {
            trg.click();
        } else {
            if (!isNOU(trgParent) && trgParent.classList.contains(CLS_ACTIVE) === false) {
                this.select(trgIndex);
                if (!isNOU(this.popEle)) {
                    this.popObj.hide(this.hide);
                }
            }
        }
    }
    private getEleIndex(item: HTEle): number {
        return Array.prototype.indexOf.call(selectAll('.' + CLS_HEADER + ' .' + CLS_TB_ITEM, this.element), item);
    }
    private extIndex(id: string): string {
        return id.replace(CLS_ITEM + '_', '');
    }
    private expTemplateContent(): void {
        this.templateEle.forEach((eleStr: Str): void => {
            if (!isNOU(this.element.querySelector(eleStr))) {
                (<HTEle>document.body.appendChild(this.element.querySelector(eleStr))).style.display = 'none';
            }
        });
    }
    private templateCompile(ele: HTEle, cnt: Str): void {
        let tempEle: HTEle = this.createElement('div');
        this.compileElement(tempEle, cnt, 'content');
        if (tempEle.childNodes.length !== 0) {
          ele.appendChild(tempEle); }
    }
    private compileElement(ele: HTEle, val: string, prop: string): void {
      if (typeof val === 'string') {
        val = val.trim(); }
      let templateFn: Function = compile(val);
      let templateFUN: HTMLElement[];
      if (!isNOU(templateFn)) {
        templateFUN = templateFn({}, this, prop); }
      if (!isNOU(templateFn) && templateFUN.length > 0) {
        [].slice.call(templateFUN).forEach((el: HTEle): void => {
          ele.appendChild(el);
        });
      }
    }
    private headerTextCompile (element: HTEle, text: string): void {
      this.compileElement(element, text, 'headerText');
    }
    private getContent(ele: HTEle, cnt: Str | HTEle, callType: string): void {
        let eleStr: Str;
        if (typeof cnt === 'string' || isNOU((<HTEle>cnt).innerHTML)) {
            if ((<Str>cnt)[0] === '.' || (<Str>cnt)[0] === '#') {
                if (document.querySelectorAll(<string>cnt).length) {
                    let eleVal: HTEle = <HTEle> document.querySelector(<string>cnt);
                    eleStr = eleVal.outerHTML.trim();
                    if (callType === 'clone') {
                        ele.appendChild(eleVal.cloneNode(true));
                    } else {
                        ele.appendChild(eleVal);
                        eleVal.style.display = '';
                    }
                } else {
                    this.templateCompile(ele, <Str>cnt);
                }
            } else {
                this.templateCompile(ele, <Str>cnt);
            }
        } else {
            ele.appendChild(cnt);
        }
        if (!isNOU(eleStr)) {
            if (this.templateEle.indexOf(cnt.toString()) === -1) {
                this.templateEle.push(cnt.toString());
            }
        }
    }
    private getTrgContent(cntEle: HTEle, no: Str): HTEle {
        let ele: HTEle;
        if (this.element.classList.contains(CLS_NEST)) {
            ele = <HTEle>select('.' + CLS_NEST + '> .' + CLS_CONTENT + ' > #' + CLS_CONTENT + '_' + no, this.element);
        } else { ele = this.findEle(cntEle.children, CLS_CONTENT + '_' + no); }
        return ele;
    }
    private findEle(items: HTMLCollection, key: Str): HTEle {
        let ele: HTEle;
        for (let i: number = 0; i < items.length; i++) {
            if (items[i].id === key) { ele = <HTEle> items[i]; break; }
        }
        return ele;
    }
    private setOrientation(place: Str, ele: HTEle): void {
        (place === 'Bottom') ? this.element.appendChild(ele) : this.element.insertBefore(ele, select('.' +  CLS_CONTENT, this.element));
    }
    private setCssClass(ele: HTEle, cls: Str, val: boolean): void {
        if (cls === '') { return; }
        let list: Str[] = cls.split(' ');
        for (let i: number = 0; i < list.length; i++) {
            if (val) {
                ele.classList.add(list[i]);
            } else {
                ele.classList.remove(list[i]);
            }
        }
    }
    private setContentHeight(val: boolean): void {
        if (isNOU(this.cntEle)) { return; }
        let height: number;
        let hdrEle: HTEle = <HTEle> select('.' + CLS_HEADER, this.element);
        if (this.heightAdjustMode === 'None') {
            if (this.height === 'auto') {
                return;
            } else {
                setStyle(this.cntEle, { 'height': (this.element.offsetHeight - hdrEle.offsetHeight) + 'px' });
            }
        } else if (this.heightAdjustMode === 'Fill') {
            setStyle(this.element, { 'height': '100%' });
            setStyle(this.cntEle, { 'height': 'auto' });
        } else if (this.heightAdjustMode === 'Auto') {
            let cnt: HTEle[] = selectAll('.' + CLS_CONTENT + ' > .' + CLS_ITEM, this.element);
            if (this.isTemplate === true) {
                for (let i: number = 0; i < cnt.length; i++) {
                    cnt[i].setAttribute('style', 'display:block; visibility: visible');
                    this.maxHeight = Math.max(this.maxHeight, this.getHeight(cnt[i]));
                    cnt[i].style.removeProperty('display');
                    cnt[i].style.removeProperty('visibility');
                }
            } else {
                this.cntEle = <HTEle>select('.' + CLS_CONTENT, this.element);
                if (val === true) {
                    this.cntEle.appendChild(this.createElement('div', {
                        id: (CLS_CONTENT + '_' + 0), className: CLS_ITEM + ' ' + CLS_ACTIVE,
                        attrs: {'role': 'tabpanel', 'aria-labelledby': CLS_ITEM + '_' + 0 }
                    }));
                }
                let ele: HTEle = <HTEle> this.cntEle.children.item(0);
                for (let i: number = 0; i < this.items.length; i++) {
                    this.getContent(ele, this.items[i].content, 'clone');
                    this.maxHeight = Math.max(this.maxHeight, this.getHeight(ele));
                    while (ele.firstChild) { ele.removeChild(ele.firstChild); }
                }
                this.templateEle = [];
                this.getContent(ele, this.items[0].content, 'render');
                ele.classList.remove(CLS_ACTIVE);
            }
            setStyle(this.cntEle, { 'height': this.maxHeight + 'px' });
        } else {
            setStyle(this.cntEle, { 'height': 'auto' });
        }
    }
    private getHeight(ele: HTEle): number {
        let cs: CSSStyleDeclaration = window.getComputedStyle(ele);
        return ele.offsetHeight + parseFloat(cs.getPropertyValue('padding-top')) + parseFloat(cs.getPropertyValue('padding-bottom')) +
            parseFloat(cs.getPropertyValue('margin-top')) + parseFloat(cs.getPropertyValue('margin-bottom'));
    }
    private setActiveBorder(): void {
        let trg: HTEle = <HTEle> select('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE, this.element);
        if (this.headerPlacement === 'Bottom') {
            trg = <HTEle> select('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE, this.element.children[1]);
        }
        if (trg === null) { return; }
        let root: HTEle = <HTEle>closest(trg, '.' + CLS_TAB);
        if (this.element !== root) {return; }
        let hsCnt: HTEle = <HTEle> select('.' + CLS_HEADER + ' .' + CLS_TB_ITEMS + ' .e-hscroll-content', this.element.children[0]);
        this.tbItems = <HTEle> select('.' + CLS_HEADER + ' .' + CLS_TB_ITEMS, this.element);
        let bar: HTEle = <HTEle> select('.' + CLS_HEADER + ' .' + CLS_INDICATOR, this.element);
        if (this.headerPlacement === 'Bottom') {
            hsCnt = <HTEle> select('.' + CLS_HEADER + ' .' + CLS_TB_ITEMS + ' .e-hscroll-content', this.element.children[1]); }
        let tbWidth: number = (isNOU(hsCnt)) ? this.tbItems.offsetWidth : hsCnt.offsetWidth;
        if (tbWidth !== 0) {
          setStyle(bar, {'left': trg.offsetLeft + 'px', 'right': tbWidth - (trg.offsetLeft + trg.offsetWidth) + 'px'});
        } else {
          setStyle(bar, {'left': 'auto', 'right': 'auto'});
        }
        if (!isNOU(this.bdrLine)) {
          this.bdrLine.classList.remove(CLS_HIDDEN); }
    }
    private setActive(value: number): void {
        this.tbItem = selectAll('.' + CLS_HEADER + ' .' + CLS_TB_ITEM, this.element);
        let trg: HTEle = this.tbItem[value];
        if (value >= 0) { this.setProperties({ selectedItem: value }, true); }
        if (value < 0 || isNaN(value) || this.tbItem.length === 0 ) { return; }
        if ( trg.classList.contains(CLS_ACTIVE)) {
            this.setActiveBorder();
            return; }
        if (!this.isTemplate) {
            let prev: HTEle = this.tbItem[this.prevIndex];
            if (!isNOU(prev)) { prev.removeAttribute('aria-controls'); }
            attributes(trg, { 'aria-controls': CLS_CONTENT + '_' + value }); }
        let id: Str = trg.id;
        this.removeActiveClass(id);
        trg.classList.add(CLS_ACTIVE);
        trg.setAttribute('aria-selected', 'true');
        let no: number = Number(this.extIndex(id));
        if (isNOU(this.prevActiveEle)) {
            this.prevActiveEle = CLS_CONTENT + '_' + no;
        }
        attributes(this.element, { 'aria-activedescendant': id });
        if (this.isTemplate) {
            if (select('.' + CLS_CONTENT, this.element).children.length > 0) {
                let trg: HTEle = this.findEle(select('.' + CLS_CONTENT, this.element).children, CLS_CONTENT + '_' + no);
                if (!isNOU(trg)) { trg.classList.add(CLS_ACTIVE); }
                this.triggerAnimation(id, this.enableAnimation);
            }
        } else {
            this.cntEle = <HTEle> select('.' + CLS_TAB + ' > .' + CLS_CONTENT, this.element);
            let item: HTEle = this.getTrgContent(this.cntEle, this.extIndex(id));
            if (isNOU(item)) {
                this.cntEle.appendChild(this.createElement('div', {
                    id: CLS_CONTENT + '_' + this.extIndex(id), className: CLS_ITEM + ' ' + CLS_ACTIVE,
                    attrs: { role: 'tabpanel', 'aria-labelledby': CLS_ITEM + '_' + this.extIndex(id) }
                }));
                let eleTrg: HTEle = this.getTrgContent(this.cntEle, this.extIndex(id));
                let itemIndex: number = Array.prototype.indexOf.call(this.itemIndexArray, trg.id);
                this.getContent(eleTrg, this.items[itemIndex].content, 'render');
            } else {
                item.classList.add(CLS_ACTIVE);
            }
            this.triggerAnimation(id, this.enableAnimation);
        }
        this.setActiveBorder();
        let curActItem: HTEle = <HTEle> select('.' + CLS_HEADER + ' #' + id, this.element);
        this.refreshItemVisibility(curActItem);
        (<HTEle> curActItem.firstChild).focus();
        let eventArg: SelectEventArgs = {
            previousItem: this.prevItem,
            previousIndex: this.prevIndex,
            selectedItem: trg,
            selectedIndex: value,
            isSwiped: this.isSwipeed
        };
        if (!this.initRender || this.selectedItem !== 0 ) {
          this.trigger('selected', eventArg); }
    }
    private setItems(items: object[]): void {
        this.isReplace = true;
        this.tbItems = <HTEle> select('.' + CLS_HEADER + ' .' +  CLS_TB_ITEMS, this.element);
        this.tbObj.items = this.parseObject(items, 0);
        this.tbObj.dataBind();
        this.isReplace = false;
    }
    private setRTL(value: boolean): void {
        this.tbObj.enableRtl = value;
        this.tbObj.dataBind();
        this.setCssClass(this.element, CLS_RTL, value);
        this.refreshActiveBorder();
    }
    private refreshActiveBorder(): void {
        if (!isNOU(this.bdrLine)) { this.bdrLine.classList.add(CLS_HIDDEN); }
        this.setActiveBorder();
    }
    private wireEvents(): void {
        window.addEventListener('resize', this.refreshActElePosition.bind(this));
        EventHandler.add(this.element, 'mouseover', this.hoverHandler, this);
        EventHandler.add(this.element, 'keydown', this.spaceKeyDown , this);
        if (!isNOU(this.cntEle)) { this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) }); }
        this.keyModule = new KeyboardEvents(this.element, { keyAction: this.keyHandler.bind(this), keyConfigs: this.keyConfigs });
        this.tabKeyModule = new KeyboardEvents(this.element, {
            keyAction: this.keyHandler.bind(this),
            keyConfigs: { openPopup: 'shift+f10', tab: 'tab', shiftTab: 'shift+tab' },
            eventName: 'keydown'
        });
    }
    private unWireEvents(): void {
        this.keyModule.destroy();
        this.tabKeyModule.destroy();
        if (!isNOU(this.cntEle)) { this.touchModule.destroy(); }
        window.removeEventListener('resize', this.refreshActElePosition.bind(this));
        this.element.removeEventListener('mouseover', this.hoverHandler.bind(this));
    }
    private clickHandler(args: ClickEventArgs): void {
        this.element.classList.remove(CLS_FOCUS);
        let trg: HTEle = <HTEle> args.originalEvent.target;
        let trgParent: HTEle = <HTEle> closest(trg, '.' + CLS_TB_ITEM);
        let trgIndex: number = this.getEleIndex(trgParent);
        if (trg.classList.contains(CLS_ICON_CLOSE)) {
            this.removeTab(trgIndex);
        } else {
            this.isPopup = false;
            if (!isNOU(trgParent) && trgIndex !== this.selectedItem) { this.select(trgIndex); }
        }
    }
    private swipeHandler(e: SwipeEventArgs): void {
        if (e.velocity < 3 && isNOU(e.originalEvent.changedTouches)) { return; }
        this.isSwipeed = true;
        if (e.swipeDirection === 'Right' && this.selectedItem !== 0) {
            for (let k: number = this.selectedItem - 1; k >= 0; k--) {
                if (!this.tbItem[k].classList.contains('e-hidden')) {
                    this.select(k);
                    break;
                }
            }
        } else if (e.swipeDirection === 'Left' && (this.selectedItem !== selectAll('.' + CLS_TB_ITEM, this.element).length - 1)) {
            for (let i: number = this.selectedItem + 1; i < this.tbItem.length; i++) {
                if (!this.tbItem[i].classList.contains('e-hidden')) {
                    this.select(i);
                    break;
                }
            }
        }
        this.isSwipeed = false;
    }
    private spaceKeyDown(e: KeyboardEvent): void {
        if ((e.keyCode === 32 && e.which === 32) || (e.keyCode === 35 && e.which === 35)) {
            let clstHead: HTEle = <HTEle>closest(<Element>e.target, '.' + CLS_HEADER);
            if (!isNOU(clstHead)) {
            e.preventDefault(); } }
    }
    private keyHandler(e: KeyboardEventArgs): void {
        if (this.element.classList.contains(CLS_DISABLE)) { return; }
        this.element.classList.add(CLS_FOCUS);
        let trg: HTEle = <HTEle> e.target;
        let actEle: HTEle = <HTEle> select('.' + CLS_HEADER + ' .' + CLS_ACTIVE, this.element);
        let tabItem: HTEle[] = selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_TB_POPUP + ')', this.element);
        this.popEle = <DomElements> select('.' + CLS_HEADER + ' .' + CLS_TB_POP, this.element);
        if (!isNOU(this.popEle)) { this.popObj = <Popup> this.popEle.ej2_instances[0]; }
        switch (e.action) {
            case 'space':
            case 'enter':
                if (trg.parentElement.classList.contains(CLS_DISABLE)) { return; }
                if (e.action === 'enter' && trg.classList.contains('e-hor-nav')) { break; }
                this.keyPressed(trg);
                break;
            case 'tab':
            case 'shiftTab':
                if (trg.classList.contains(CLS_WRAP)
                    && (<HTEle> closest(trg, '.' + CLS_TB_ITEM)).classList.contains(CLS_ACTIVE) === false) {
                    trg.setAttribute('tabindex', '-1');
                }
                if (this.popObj && isVisible(this.popObj.element)) {
                    this.popObj.hide(this.hide);
                }
                actEle.children.item(0).setAttribute('tabindex', '0');
                break;
            case 'moveLeft':
            case 'moveRight':
                let item: HTEle = <HTEle> closest(document.activeElement, '.' + CLS_TB_ITEM);
                if (!isNOU(item)) { this.refreshItemVisibility(item); }
                break;
            case 'openPopup':
                e.preventDefault();
                if (!isNOU(this.popEle) && this.popEle.classList.contains(CLS_POPUP_CLOSE)) { this.popObj.show(this.show); }
                break;
            case 'delete':
                let trgParent: HTEle = <HTEle> closest(trg, '.' + CLS_TB_ITEM);
                if (this.showCloseButton === true && !isNOU(trgParent)) {
                    let nxtSib: HTEle = <HTEle> trgParent.nextSibling;
                    if (!isNOU(nxtSib) && nxtSib.classList.contains(CLS_TB_ITEM)) { (<HTEle> nxtSib.firstChild).focus(); }
                    this.removeTab(this.getEleIndex(trgParent));
                }
                this.setActiveBorder();
                break;
        }
    }
    private refreshActElePosition(): void {
        let activeEle: Element = select('.' + CLS_TB_ITEM + '.' + CLS_TB_POPUP + '.' + CLS_ACTIVE, this.element);
        if (!isNOU(activeEle)) {
            this.select(this.getEleIndex(<HTEle> activeEle));
        }
        this.refreshActiveBorder();
    }
    private refreshItemVisibility(target: HTEle): void {
        let scrCnt: HTEle = <HTEle> select('.e-hscroll-content', this.tbItems);
        if (!isNOU(scrCnt)) {
            let scrBar: HTEle = <HTEle> select('.e-hscroll-bar', this.tbItems);
            let scrStart: number = scrBar.scrollLeft;
            let scrEnd: number = scrStart + scrBar.offsetWidth;
            let eleStart: number = target.offsetLeft;
            let eleWidth: number = target.offsetWidth;
            let eleEnd: number = target.offsetLeft + target.offsetWidth;
            if ((scrStart < eleStart) && (scrEnd < eleEnd)) {
                let eleViewRange: number = scrEnd - eleStart;
                scrBar.scrollLeft = scrStart + (eleWidth - eleViewRange);
            } else {
                if ((scrStart > eleStart) && (scrEnd > eleEnd)) {
                    let eleViewRange: number = eleEnd - scrStart;
                    scrBar.scrollLeft = scrStart - (eleWidth - eleViewRange);
                }
            }
        } else { return; }
    }
    private hoverHandler(e: MouseEventArgs): void {
        let trg: HTEle = <HTEle> e.target;
        if (!isNOU(trg.classList) &&  trg.classList.contains(CLS_ICON_CLOSE)) {
            trg.setAttribute('title', new L10n('tab', { closeButtonTitle: this.title }, this.locale).getConstant('closeButtonTitle'));
        }
    }
    /**
     * Enables or disables the specified Tab item. On passing value as `false`, the item will be disabled.
     * @param  {number} index - Index value of target Tab item.
     * @param  {boolean} value - Boolean value that determines whether the command should be enabled or disabled.
     * By default, isEnable is true.
     * @returns void.
     */
    public enableTab(index: number, value: boolean): void {
        let tbItems: HTEle = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNOU(tbItems)) { return; }
        if (value === true) {
            tbItems.classList.remove(CLS_DISABLE, CLS_OVERLAY);
            (<HTEle>tbItems.firstChild).setAttribute('tabindex', '-1');
        } else {
            tbItems.classList.add(CLS_DISABLE, CLS_OVERLAY);
            (<HTEle>tbItems.firstChild).removeAttribute('tabindex');
            if (tbItems.classList.contains(CLS_ACTIVE)) { this.select(index + 1); }
        }
        if ( !isNOU(this.items[index])) {
            this.items[index].disabled = !value;
            this.dataBind(); }
        tbItems.setAttribute('aria-disabled', (value === true) ? 'false' : 'true');
    }
    /**
     * Adds new items to the Tab that accepts an array as Tab items.
     * @param  {TabItemsModel[]} items - An array of item that is added to the Tab.
     * @param  {number} index - Number value that determines where the items to be added. By default, index is 0.
     * @returns void.
     */
    public addTab(items: TabItemModel[], index?: number): void {
        let lastEleIndex: number = 0;
        if (!this.isReplace) {
        this.trigger('adding', { addedItems: items }); }
        this.hdrEle = <HTEle> select('.' + CLS_HEADER, this.element);
        if (isNOU(this.hdrEle)) {
            this.items = items;
            this.reRenderItems();
            return;
        }
        let itemsCount: number = selectAll('.' + CLS_TB_ITEM, this.element).length;
        if (itemsCount !== 0) { lastEleIndex = this.lastIndex + 1; }
        if (isNOU(index)) { index = itemsCount - 1; }
        if (itemsCount < index || index < 0 || isNaN(index)) { return; }
        if (itemsCount === 0 && !isNOU(this.hdrEle)) { this.hdrEle.style.display = ''; }
        if (!isNOU(this.bdrLine)) { this.bdrLine.classList.add(CLS_HIDDEN); }
        this.tbItems = <HTEle> select('.' + CLS_HEADER + ' .' +  CLS_TB_ITEMS, this.element);
        let tabItems: object[] = this.parseObject(items, index);
        items.forEach((item: TabItemModel, place: number) => {
            this.items.splice((index + place), 0, item);
            if (this.isTemplate && !isNOU(item.header) && !isNOU(item.header.text)) {
                let no: number = lastEleIndex + place;
                let ele: HTEle = this.createElement('div', {
                    id: CLS_CONTENT + '_' + no, className: CLS_ITEM, attrs: { role: 'tabpanel', 'aria-labelledby': CLS_ITEM + '_' + no }
                });
                this.cntEle.insertBefore(ele, this.cntEle.children[(index + place)]);
                let eleTrg: HTEle = this.getTrgContent(this.cntEle, no.toString());
                this.getContent(eleTrg, item.content, 'render');
            }
        });
        this.tbObj.addItems(tabItems, index);
        if (!this.isReplace) {
        this.trigger('added', { addedItems: items }); }
        if (this.selectedItem === index) { this.select(index); } else { this.setActiveBorder(); }
    }
    /**
     * Removes the items in the Tab from the specified index.
     * @param  {number} index - Index of target item that is going to be removed.
     * @returns void.
     */
    public removeTab(index: number): void {
        let trg: HTEle = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        let removeArgs: RemoveEventArgs = { removedItem: trg, removedIndex: index };
        this.trigger('removing', removeArgs);
        if (isNOU(trg)) { return; }
        this.tbObj.removeItems(index);
        this.items.splice(index, 1);
        this.itemIndexArray.splice(index, 1);
        this.refreshActiveBorder();
        let cntTrg: HTEle = <HTEle>select('#' + CLS_CONTENT + '_' + this.extIndex(trg.id), select('.' + CLS_CONTENT, this.element));
        if (!isNOU(cntTrg)) { detach(cntTrg); }
        this.trigger('removed', removeArgs);
        if (trg.classList.contains(CLS_ACTIVE)) {
            index = (index > selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_TB_POPUP + ')', this.element).length - 1) ? index - 1 : index;
            this.enableAnimation = false;
            this.selectedItem = index;
            this.select(index);
        }
        if (selectAll('.' + CLS_TB_ITEM, this.element).length === 0) { this.hdrEle.style.display = 'none'; }
        this.enableAnimation = true;
    }
    /**
     * Shows or hides the Tab that is in the specified index.
     * @param  {number} index - Index value of target item.
     * @param  {boolean} value - Based on this Boolean value, item will be hide (false) or show (true). By default, value is true.
     * @returns void.
     */
    public hideTab(index: number, value?: boolean): void {
        let items: HTMLElement[];
        let item: HTEle = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNOU(item)) { return; }
        if (isNOU(value)) { value = true; }
        this.bdrLine.classList.add(CLS_HIDDEN);
        if (value === true) {
            item.classList.add(CLS_HIDDEN);
            items = selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_HIDDEN + ')', this.tbItems);
            if (items.length !== 0 && item.classList.contains(CLS_ACTIVE)) {
                if (index !== 0) {
                    for (let i: number = index - 1; i >= 0; i--) {
                        if (!this.tbItem[i].classList.contains('e-hidden')) {
                            this.select(i);
                            break;
                        } else if (i === 0) {
                            for (let k: number = index + 1; k < this.tbItem.length; k++) {
                                if (!this.tbItem[k].classList.contains('e-hidden')) {
                                    this.select(k);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    for (let k: number = index + 1; k < this.tbItem.length; k++) {
                        if (!this.tbItem[k].classList.contains('e-hidden')) {
                            this.select(k);
                            break;
                        }
                    }
                }
            } else if (items.length === 0) {
                this.element.classList.add(CLS_HIDDEN);
            }
        } else {
            this.element.classList.remove(CLS_HIDDEN);
            items = selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_HIDDEN + ')', this.tbItems);
            if (items.length === 0) { this.select(index); }
            item.classList.remove(CLS_HIDDEN);
        }
        this.setActiveBorder();
        item.setAttribute('aria-hidden', '' + value);
    }
    /**
     * Specifies the index or HTMLElement to select an item from the Tab.
     * @param  {number | HTMLElement} args - Index or DOM element is used for selecting an item from the Tab.
     * @returns void.
     */
    public select(args: number | HTMLElement): void {
        this.tbItems = <HTEle> select('.' + CLS_HEADER + ' .' +  CLS_TB_ITEMS, this.element);
        this.tbItem = selectAll('.' + CLS_HEADER + ' .' +  CLS_TB_ITEM, this.element);
        this.prevItem = this.tbItem[this.prevIndex];
        let trg: HTEle = this.tbItem[args as number];
        if (!isNOU(this.prevItem) && !this.prevItem.classList.contains(CLS_DISABLE)) {
            this.prevItem.children.item(0).setAttribute('tabindex', '-1'); }
        let eventArg: SelectingEventArgs = {
            previousItem: this.prevItem,
            previousIndex: this.prevIndex,
            selectedItem: this.tbItem[this.selectedItem],
            selectedIndex: this.selectedItem,
            selectingItem: trg,
            selectingIndex: args as number,
            isSwiped: this.isSwipeed
        };
        if (!this.initRender || this.selectedItem !== 0 ) {
        this.trigger('selecting', eventArg); }
        if (eventArg.cancel) { return; }
        if (typeof args === 'number') {
            if (!isNOU(this.tbItem[args]) && this.tbItem[<number>args].classList.contains(CLS_DISABLE)) {
                for (let i: number = <number>args + 1; i < this.items.length; i++) {
                    if (this.items[i].disabled === false) { args = i; break;
                    } else { args = 0; }
                }
            }
            if (this.tbItem.length > args && args >= 0 && !isNaN(args)) {
                this.prevIndex = this.selectedItem;
                if (this.tbItem[args].classList.contains(CLS_TB_POPUP)) {
                    this.setActive(this.popupHandler(this.tbItem[args]));
                } else {
                    this.setActive(args);
                }
            } else {
                this.setActive(0);
            }
        } else if (args instanceof (HTMLElement)) {
            this.setActive(this.getEleIndex(args));
        }
    }
    /**
     * Specifies the value to disable/enable the Tab component.
     * When set to `true`, the component will be disabled.
     * @param  {boolean} value - Based on this Boolean value, Tab will be enabled (false) or disabled (true).
     * @returns void.
     */
    public disable(value: boolean): void {
        this.setCssClass(this.element, CLS_DISABLE, value);
        this.element.setAttribute('aria-disabled', '' + value);
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    protected getPersistData(): string {
        return this.addOnPersist(['selectedItem', 'actEleId']);
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    protected getModuleName(): string {
        return 'tab';
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     * @param  {TabModel} newProp
     * @param  {TabModel} oldProp
     * @returns void
     * @private
     */
    public onPropertyChanged(newProp: TabModel, oldProp: TabModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    setStyle(this.element, { width: formatUnit(newProp.width) });
                    break;
                case 'height':
                    setStyle(this.element, { height: formatUnit(newProp.height) });
                    this.setContentHeight(false);
                    break;
                case 'cssClass':
                    this.setCssClass(this.element, newProp.cssClass, true);
                    break;
                case 'items':
                    if (!(newProp.items instanceof Array && oldProp.items instanceof Array)) {
                        let changedProp: Object[] = Object.keys(newProp.items);
                        for (let i : number = 0; i < changedProp.length; i++) {
                            let index: number =  parseInt(Object.keys(newProp.items)[i], 10);
                            let property: Str = Object.keys(newProp.items[index])[0];
                            let oldVal: Str = Object(oldProp.items[index])[property];
                            let newVal: Str | Object = Object(newProp.items[index])[property];
                            let hdrItem: HTEle = <HTEle> select('.' + CLS_TB_ITEMS + ' #' +  CLS_ITEM + '_' + index, this.element);
                            let cntItem: HTEle = <HTEle> select('.' + CLS_CONTENT + ' #' +  CLS_CONTENT + '_' + index, this.element);
                            if (property === 'header') {
                                let arr: Object[] = [];
                                arr.push(<TabItemModel>this.items[index]);
                                this.items.splice(index, 1);
                                this.itemIndexArray.splice(index, 1);
                                this.tbObj.items.splice(index, 1);
                                let isHiddenEle: Boolean = hdrItem.classList.contains(CLS_HIDDEN);
                                detach(hdrItem);
                                this.isReplace = true;
                                this.addTab(arr, index);
                                if (isHiddenEle) { this.hideTab(index); }
                                this.isReplace = false;
                            }
                            if (property === 'content' && !isNOU(cntItem)) {
                                let strVal: Boolean = typeof newVal === 'string' || isNOU((<HTEle>newVal).innerHTML);
                                if (strVal && ((<Str>newVal)[0] === '.' || (<Str>newVal)[0] === '#') && (<Str>newVal).length) {
                                    let eleVal: HTEle = <HTEle>document.querySelector(<Str>newVal);
                                    cntItem.appendChild(eleVal);
                                    eleVal.style.display = '';
                                } else if (newVal === '' && oldVal[0] === '#') {
                                    (<HTEle>document.body.appendChild(this.element.querySelector(oldVal))).style.display = 'none';
                                    cntItem.innerHTML = <Str>newVal;
                                } else { cntItem.innerHTML = <Str>newVal; }
                            }
                            if (property === 'cssClass') {
                                if (!isNOU(hdrItem)) {
                                    hdrItem.classList.remove(oldVal);
                                    hdrItem.classList.add(<Str>newVal);
                                }
                                if (!isNOU(cntItem)) {
                                    cntItem.classList.remove(oldVal);
                                    cntItem.classList.add(<Str>newVal);
                                }
                            }
                            if (property === 'disabled') { this.enableTab(index, ((newVal === true) ? false : true)); }
                        }
                    } else {
                        this.lastIndex = 0;
                        if (isNOU(this.tbObj)) {
                            this.reRenderItems();
                        } else {
                            this.setItems(<TabItemModel[]>newProp.items);
                            if (this.templateEle.length > 0) { this.expTemplateContent(); }
                            this.templateEle = [];
                            select('.' + CLS_TAB + ' > .' + CLS_CONTENT, this.element).innerHTML = '';
                            this.select(this.selectedItem);
                        }
                    }
                    break;
                case 'showCloseButton':
                    this.setCloseButton(newProp.showCloseButton);
                    break;
                case 'selectedItem':
                    this.selectedItem = oldProp.selectedItem;
                    this.select(newProp.selectedItem);
                    break;
                case 'headerPlacement':
                    let tempHdrEle: HTEle = <HTEle> select('.' + CLS_HEADER, this.element);
                    this.setOrientation(newProp.headerPlacement, tempHdrEle);
                    this.select(this.selectedItem);
                    break;
                case 'enableRtl':
                    this.setRTL(newProp.enableRtl);
                    break;
                case 'overflowMode':
                    this.tbObj.overflowMode = newProp.overflowMode;
                    this.tbObj.dataBind();
                    this.refreshActElePosition();
                    break;
                case 'heightAdjustMode':
                    this.setContentHeight(false);
                    this.select(this.selectedItem);
                    break;
            }
        }
    }
}