/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventHandler, Property, Event, EmitType, BaseEventArgs } from '@syncfusion/ej2-base';
import { addClass, removeClass, isVisible, closest, attributes, detach, classList, KeyboardEvents } from '@syncfusion/ej2-base';
import { selectAll, setStyleAttribute as setStyle, KeyboardEventArgs, select } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, getUniqueID, formatUnit, Collection, compile as templateCompiler } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, Browser, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { calculatePosition } from '@syncfusion/ej2-popups';
import { Button, IconPosition } from '@syncfusion/ej2-buttons';
import { HScroll } from '../common/h-scroll';
import { VScroll } from '../common/v-scroll';
import { ToolbarModel, ItemModel } from './toolbar-model';
/**
 * Specifies the options for supporting element types of Toolbar command.
 * ```props
 * Button :- Creates the Button control with its given properties like text, prefixIcon, etc.
 * Separator :- Adds a horizontal line that separates the Toolbar commands.
 * Input :- Creates an input element that is applicable to template rendering with Syncfusion controls like DropDownList, AutoComplete, etc.
 * ```
 */
export type ItemType = 'Button' | 'Separator' | 'Input';
/**
 * Specifies the options of where the text will be displayed in popup mode of the Toolbar.
 * ```props
 * Toolbar :-  Text will be displayed on Toolbar only.
 * Overflow :- Text will be displayed only when content overflows to popup.
 * Both :- Text will be displayed on popup and Toolbar.
 * ```
 */
export type DisplayMode = 'Both' | 'Overflow' | 'Toolbar';
/**
 * Specifies the options of the Toolbar item display area when the Toolbar content overflows to available space.Applicable to `popup` mode.
 * ```props
 * Show :- Always shows the item as the primary priority on the *Toolbar*.
 * Hide :- Always shows the item as the secondary priority on the *popup*.
 * None :- No priority for display, and as per normal order moves to popup when content exceeds.
 * ```
 */
export type OverflowOption = 'None' | 'Show' | 'Hide';
/**
 * Specifies the options of Toolbar display mode. Display option is considered when Toolbar content exceeds the available space.
 * ```props
 * Scrollable :- All the elements are displayed in a single line with horizontal scrolling enabled.
 * Popup :- Prioritized elements are displayed on the Toolbar and the rest of elements are moved to the popup.
 * MultiRow :- Displays the overflow toolbar items as an in-line of a toolbar.
 * Extended :- Hide the overflowing toolbar items in the next row. Show the overflowing toolbar items when you click the expand icons, if the popup content overflows the height of the page, the rest of the elements will be hidden.
 * ```
 */
export type OverflowMode = 'Scrollable' |'Popup' | 'MultiRow' | 'Extended';

type HTEle = HTMLElement;
type Str = string;
type ItmAlign = 'lefts' | 'centers' | 'rights';

/**
 * Specifies the options for aligning the Toolbar items.
 * ```props
 * Left :- To align commands to the left side of the Toolbar.
 * Center :- To align commands at the center of the Toolbar.
 * Right :- To align commands to the right side of the Toolbar.
 * ```
 */
export type ItemAlign = 'Left' | 'Center' | 'Right';

const CLS_VERTICAL: Str = 'e-vertical';
const CLS_ITEMS: Str = 'e-toolbar-items';
const CLS_ITEM: Str = 'e-toolbar-item';
const CLS_RTL: Str = 'e-rtl';
const CLS_SEPARATOR: Str = 'e-separator';
const CLS_POPUPICON: Str = 'e-popup-up-icon';
const CLS_POPUPDOWN: Str = 'e-popup-down-icon';
const CLS_POPUPOPEN: Str = 'e-popup-open';
const CLS_TEMPLATE: Str = 'e-template';
const CLS_DISABLE: Str = 'e-overlay';
const CLS_POPUPTEXT: Str = 'e-toolbar-text';
const CLS_TBARTEXT: Str = 'e-popup-text';
const CLS_TBAROVERFLOW: Str = 'e-overflow-show';
const CLS_POPOVERFLOW: Str = 'e-overflow-hide';
const CLS_TBARBTN: Str = 'e-tbar-btn';
const CLS_TBARNAV: Str = 'e-hor-nav';
const CLS_TBARSCRLNAV: Str = 'e-scroll-nav';
const CLS_TBARRIGHT: Str = 'e-toolbar-right';
const CLS_TBARLEFT: Str = 'e-toolbar-left';
const CLS_TBARCENTER: Str = 'e-toolbar-center';
const CLS_TBARPOS: Str = 'e-tbar-pos';
const CLS_HSCROLLCNT: Str = 'e-hscroll-content';
const CLS_VSCROLLCNT: Str = 'e-vscroll-content';
const CLS_HSCROLLBAR: Str = 'e-hscroll-bar';
const CLS_POPUPNAV: Str = 'e-hor-nav';
const CLS_POPUPCLASS: Str = 'e-toolbar-pop';
const CLS_POPUP: Str = 'e-toolbar-popup';
const CLS_TBARBTNTEXT: Str = 'e-tbar-btn-text';
const CLS_TBARNAVACT: Str = 'e-nav-active';
const CLS_TBARIGNORE: Str = 'e-ignore';
const CLS_POPPRI: Str = 'e-popup-alone';
const CLS_HIDDEN: string = 'e-hidden';
const CLS_MULTIROW: string = 'e-toolbar-multirow';
const CLS_MULTIROWPOS: string = 'e-multirow-pos';
const CLS_MULTIROW_SEPARATOR: string = 'e-multirow-separator';
const CLS_EXTENDABLE_SEPARATOR: string = 'e-extended-separator';
const CLS_EXTEANDABLE_TOOLBAR: Str = 'e-extended-toolbar';
const CLS_EXTENDABLECLASS: Str = 'e-toolbar-extended';
const CLS_EXTENDPOPUP: Str = 'e-expended-nav';
const CLS_EXTENDEDPOPOPEN: Str = 'e-tbar-extended';

interface Template {
    appendTo: (elemnt: HTMLElement) => void
}

interface ToolbarItemAlignIn {
    lefts: HTMLElement[]
    centers: HTMLElement[]
    rights: HTMLElement[]
}
/** An interface that holds options to control the toolbar clicked action. */
export interface ClickEventArgs extends BaseEventArgs {
    /** Defines the current Toolbar Item Object. */
    item: ItemModel
    /**
     * Defines the current Event arguments.
     */
    originalEvent: Event
    /** Defines the prevent action. */
    cancel?: boolean
}

/** An interface that holds options to control before the toolbar create. */
export interface BeforeCreateArgs extends BaseEventArgs {
    /** Enable or disable the popup collision. */
    enableCollision: boolean
    /** Specifies the scrolling distance in scroller. */
    scrollStep: number
}
/** @hidden */
interface EJ2Instance extends HTMLElement {
    // eslint-disable-next-line camelcase
    ej2_instances: Object[]
}

/**
 * An item object that is used to configure Toolbar commands.
 */
export class Item extends ChildProperty<Item>  {
    /**
     * Specifies the unique ID to be used with button or input element of Toolbar items.
     *
     * @default ""
     */
    @Property('')
    public id: string;
    /**
     * Specifies the text to be displayed on the Toolbar button.
     *
     * @default ""
     */
    @Property('')
    public text: string;
    /**
     * Specifies the width of the Toolbar button commands.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: number | string;
    /**
     * Defines single/multiple classes (separated by space) to be used for customization of commands.
     *
     * @default ""
     */
    @Property('')
    public cssClass: string;
    /**
     * Defines the priority of items to display it in popup always.
     * It allows to maintain toolbar item on popup always but it does not work for toolbar priority items.
     *
     * @default false
     */
    @Property(false)
    public showAlwaysInPopup: boolean;
    /**
     * Specifies whether an item should be disabled or not.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;
    /**
     * Defines single/multiple classes separated by space used to specify an icon for the button.
     * The icon will be positioned before the text content if text is available, otherwise the icon alone will be rendered.
     *
     * @default ""
     */
    @Property('')
    public prefixIcon: string;
    /**
     * Defines single/multiple classes separated by space used to specify an icon for the button.
     * The icon will be positioned after the text content if text is available.
     *
     * @default ""
     */
    @Property('')
    public suffixIcon: string;
    /**
     * Specifies whether an item should be hidden or not.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;
    /**
     * Specifies the Toolbar command display area when an element's content is too large to fit available space.
     * This is applicable only to `popup` mode. The possible values for this property as follows
     * * `Show`:  Always shows the item as the primary priority on the *Toolbar*.
     * * `Hide`: Always shows the item as the secondary priority on the *popup*.
     * * `None`: No priority for display, and as per normal order moves to popup when content exceeds.
     *
     * @default 'None'
     */
    @Property('None')
    public overflow: OverflowOption;
    /**
     * Specifies the HTML element/element ID as a string that can be added as a Toolbar command.
     * ```
     * E.g - items: [{ template: '<input placeholder="Search"/>' },{ template: '#checkbox1' }]
     * ```
     *
     * @default ""
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public template: string | Object | Function;
    /**
     * Specifies the types of command to be rendered in the Toolbar.
     * Supported types are:
     * * `Button`: Creates the Button control with its given properties like text, prefixIcon, etc.
     * * `Separator`: Adds a horizontal line that separates the Toolbar commands.
     * * `Input`: Creates an input element that is applicable to template rendering with Syncfusion controls like DropDownList,
     * AutoComplete, etc.
     *
     * @default 'Button'
     */
    @Property('Button')
    public type: ItemType;
    /**
     * Specifies where the button text will be displayed on *popup mode* of the Toolbar.
     * The possible values for this property as follows
     * * `Toolbar`:  Text will be displayed on *Toolbar* only.
     * * `Overflow`: Text will be displayed only when content overflows to *popup*.
     * * `Both`: Text will be displayed on *popup* and *Toolbar*.
     *
     * @default 'Both'
     */
    @Property('Both')
    public showTextOn: DisplayMode;
    /**
     * Defines htmlAttributes used to add custom attributes to Toolbar command.
     * Supports HTML attributes such as style, class, etc.
     *
     * @default null
     */
    @Property(null)
    public htmlAttributes: { [key: string]: string };
    /**
     * Specifies the text to be displayed on hovering the Toolbar button.
     *
     * @default ""
     */
    @Property('')
    public tooltipText: string;
    /**
     * Specifies the location for aligning Toolbar items on the Toolbar. Each command will be aligned according to the `align` property.
     * The possible values for this property as follows
     * * `Left`: To align commands to the left side of the Toolbar.
     * * `Center`: To align commands at the center of the Toolbar.
     * * `Right`: To align commands to the right side of the Toolbar.
     * ```html
     * <div id="element"> </div>
     * ```
     * ```typescript
     * let toolbar: Toolbar = new Toolbar({
     *     items: [
     *         { text: "Home" },
     *         { text: "My Home Page" , align: 'Center' },
     *         { text: "Search", align: 'Right' }
     *         { text: "Settings", align: 'Right' }
     *     ]
     * });
     * toolbar.appendTo('#element');
     * ```
     *
     * @default "Left"
     * @aspPopulateDefaultValue
     */
    @Property('Left')
    public align: ItemAlign;
    /**
     * Event triggers when `click` the toolbar item.
     *
     * @event click
     */
    @Event()
    public click: EmitType<ClickEventArgs>;
    /**
     * Specifies the tab order of the Toolbar items. When positive values assigned, it allows to switch focus to the next/previous toolbar items with Tab/ShiftTab keys.
     * By default, user can able to switch between items only via arrow keys.
     * If the value is set to 0 for all tool bar items, then tab switches based on element order.
     *
     * @default -1
     */
    @Property(-1)
    public tabIndex: number;
}
/**
 * The Toolbar control contains a group of commands that are aligned horizontally.
 * ```html
 * <div id="toolbar"/>
 * <script>
 *   var toolbarObj = new Toolbar();
 *   toolbarObj.appendTo("#toolbar");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Toolbar extends Component<HTMLElement> implements INotifyPropertyChanged {
    private trgtEle: HTEle;
    private ctrlTem: HTEle;
    private popObj: Popup;
    private tbarEle: HTMLElement[];
    private tbarAlgEle: ToolbarItemAlignIn;
    private tbarAlign: boolean;
    private tbarEleMrgn: number;
    private tbResize: boolean;
    private offsetWid: number;
    private keyModule: KeyboardEvents;
    private scrollModule: HScroll | VScroll;
    private activeEle: HTEle;
    private popupPriCount: number;
    private tbarItemsCol: ItemModel[];
    private isVertical: boolean;
    private tempId: string[];
    private isExtendedOpen: boolean;
    private clickEvent: EventListenerOrEventListenerObject;
    private scrollEvent: EventListenerOrEventListenerObject;
    private resizeContext: EventListenerObject = this.resize.bind(this);
    private orientationChangeContext: EventListenerObject = this.orientationChange.bind(this);

    /**
     * Contains the keyboard configuration of the Toolbar.
     */
    private keyConfigs: { [key: string]: Str } = {
        moveLeft: 'leftarrow',
        moveRight: 'rightarrow',
        moveUp: 'uparrow',
        moveDown: 'downarrow',
        popupOpen: 'enter',
        popupClose: 'escape',
        tab: 'tab',
        home: 'home',
        end: 'end'
    };
    /**
     * An array of items that is used to configure Toolbar commands.
     *
     * @default []
     */
    @Collection<ItemModel>([], Item)
    public items: ItemModel[];
    /**
     * Specifies the width of the Toolbar in pixels/numbers/percentage. Number value is considered as pixels.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;
    /**
     * Specifies the height of the Toolbar in pixels/number/percentage. Number value is considered as pixels.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;
    /**
     * Sets the CSS classes to root element of the Tab that helps to customize component styles.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Specifies the Toolbar display mode when Toolbar content exceeds the viewing area.
     * The possible values for this property as follows
     * - Scrollable: All the elements are displayed in a single line with horizontal scrolling enabled.
     * - Popup: Prioritized elements are displayed on the Toolbar and the rest of elements are moved to the *popup*.
     * - MultiRow: Displays the overflow toolbar items as an in-line of a toolbar.
     * - Extended: Hide the overflowing toolbar items in the next row.  Show the overflowing toolbar items when you click the expand icons.
     * If the popup content overflows the height of the page, the rest of the elements will be hidden.
     *
     * @default 'Scrollable'
     */
    @Property('Scrollable')
    public overflowMode: OverflowMode;
    /**
     * Specifies the scrolling distance in scroller.
     * The possible values for this property as follows
     * * Scrollable - All the elements are displayed in a single line with horizontal scrolling enabled.
     * * Popup - Prioritized elements are displayed on the Toolbar and the rest of elements are moved to the *popup*.
     * * MultiRow - Displays the overflow toolbar items as an in-line of a toolbar.
     * * Extended - Hide the overflowing toolbar items in the next row.  Show the overflowing toolbar items when you click the expand icons.
     * * If the popup content overflows the height of the page, the rest of the elements will be hidden.
     *
     * {% codeBlock src='toolbar/scrollStep/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property()
    public scrollStep: number;
    /**
     * Enable or disable the popup collision.
     *
     * @default true
     */
    @Property(true)
    public enableCollision: boolean;
    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;
    /**
     * When this property is set to true, it allows the keyboard interaction in toolbar.
     *
     * @default true
     */
    @Property(true)
    public allowKeyboard: boolean;

    /**
     * The event will be fired on clicking the Toolbar elements.
     *
     * @event clicked
     */
    @Event()
    public clicked: EmitType<ClickEventArgs>;
    /**
     * The event will be fired when the control is rendered.
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
     * The event will be fired before the control is rendered on a page.
     *
     * @event beforeCreate
     */
    @Event()
    public beforeCreate: EmitType<BeforeCreateArgs>;
    /**
     * Removes the control from the DOM and also removes all its related events.
     *
     * @returns {void}.
     */
    public destroy(): void {
        if ((this as any).isReact || (this as any).isAngular) {
            this.clearTemplate();
        }
        const btnItems: NodeList = this.element.querySelectorAll('.e-control.e-btn');
        [].slice.call(btnItems).forEach((el: EJ2Instance) => {
            if (!isNOU(el) && !isNOU(el.ej2_instances) && !isNOU(el.ej2_instances[0]) && !((el.ej2_instances[0] as Button).isDestroyed)) {
                (el.ej2_instances[0] as Button).destroy();
            }
        });
        this.unwireEvents();
        this.tempId.forEach((ele: Str): void => {
            if (!isNOU(this.element.querySelector(ele))) {
                (<HTEle>document.body.appendChild(this.element.querySelector(ele))).style.display = 'none';
            }
        });
        this.destroyItems();
        while (this.element.lastElementChild) {
            this.element.removeChild(this.element.lastElementChild);
        }
        if (this.trgtEle) {
            this.element.appendChild(this.ctrlTem);
            this.trgtEle = null;
            this.ctrlTem = null;
        }
        if (this.popObj) {
            this.popObj.destroy();
            detach(this.popObj.element);
        }
        if (this.activeEle) {
            this.activeEle = null;
        }
        this.popObj = null;
        this.tbarAlign = null;
        this.tbarItemsCol = [];
        this.remove(this.element, 'e-toolpop');
        if (this.cssClass) {
            removeClass([this.element], this.cssClass.split(' '));
        }
        this.element.removeAttribute('style');
        ['aria-disabled', 'aria-orientation', 'role'].forEach((attrb: string): void =>
            this.element.removeAttribute(attrb));
        super.destroy();
    }
    /**
     * Initialize the event handler
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        const eventArgs: BeforeCreateArgs = { enableCollision: this.enableCollision, scrollStep: this.scrollStep };
        this.trigger('beforeCreate', eventArgs);
        this.enableCollision = eventArgs.enableCollision;
        this.scrollStep = eventArgs.scrollStep;
        this.scrollModule = null;
        this.popObj = null;
        this.tempId = [];
        this.tbarItemsCol = this.items;
        this.isVertical = this.element.classList.contains(CLS_VERTICAL) ? true : false;
        this.isExtendedOpen = false;
        this.popupPriCount = 0;
        if (this.enableRtl) {
            this.add(this.element, CLS_RTL);
        }
    }
    /**
     * Initializes a new instance of the Toolbar class.
     *
     * @param {ToolbarModel} options  - Specifies Toolbar model properties as options.
     * @param { string | HTMLElement} element  - Specifies the element that is rendered as a Toolbar.
     */
    public constructor(options?: ToolbarModel, element?: string | HTMLElement) {
        super(options, <HTEle | Str>element);
    }
    private wireEvents(): void {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        window.addEventListener('resize', this.resizeContext);
        window.addEventListener('orientationchange', this.orientationChangeContext);
        if (this.allowKeyboard) {
            this.wireKeyboardEvent();
        }
    }
    private wireKeyboardEvent(): void {
        this.keyModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs
        });
        EventHandler.add(this.element, 'keydown', this.docKeyDown, this);
        this.updateTabIndex('0');
    }

    private updateTabIndex(tabIndex: string): void {
        const ele: HTEle = <HTEle>this.element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_DISABLE + ' ):not(.' + CLS_SEPARATOR + ' ):not(.' + CLS_HIDDEN + ' )');
        if (!isNOU(ele) && !isNOU(ele.firstElementChild)) {
            const dataTabIndex: string = ele.firstElementChild.getAttribute('data-tabindex');
            if (dataTabIndex && dataTabIndex === '-1' && ele.firstElementChild.tagName !== 'INPUT') {
                ele.firstElementChild.setAttribute('tabindex', tabIndex);
            }
        }
    }

    private unwireKeyboardEvent(): void {
        if (this.keyModule) {
            EventHandler.remove(this.element, 'keydown', this.docKeyDown);
            this.keyModule.destroy();
            this.keyModule = null;
        }
    }
    private docKeyDown(e: KeyboardEvent): void {
        if ((<HTEle>e.target).tagName === 'INPUT') {
            return;
        }
        const popCheck: boolean = !isNOU(this.popObj) && isVisible(this.popObj.element) && this.overflowMode !== 'Extended';
        if (e.keyCode === 9 && (<HTEle>e.target).classList.contains('e-hor-nav') === true && popCheck) {
            this.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
        const keyCheck: boolean = (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 35 || e.keyCode === 36);
        if (keyCheck) {
            e.preventDefault();
        }
    }
    private unwireEvents(): void {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        this.destroyScroll();
        this.unwireKeyboardEvent();
        window.removeEventListener('resize', this.resizeContext);
        window.removeEventListener('orientationchange', this.orientationChangeContext);
        document.removeEventListener('scroll', this.clickEvent);
        document.removeEventListener('click', this.scrollEvent);
        this.scrollEvent = null;
        this.clickEvent = null;
    }
    private clearProperty(): void {
        this.tbarEle = [];
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
    }
    private docEvent(e: Event): void {
        const popEle: Element = closest(<Element>e.target, '.e-popup');
        if (this.popObj && isVisible(this.popObj.element) && !popEle && this.overflowMode === 'Popup') {
            this.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
    }
    private destroyScroll(): void {
        if (this.scrollModule) {
            if (this.tbarAlign) {
                this.add(this.scrollModule.element, CLS_TBARPOS);
            }
            this.scrollModule.destroy(); this.scrollModule = null;
        }
    }
    private destroyItems(): void {
        if (this.element) {
            [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM)).forEach((el: HTEle) => { detach(el); });
        }
        if (this.tbarAlign) {
            const tbarItems: HTEle = <HTEle>this.element.querySelector('.' + CLS_ITEMS);
            [].slice.call(tbarItems.children).forEach((el: HTEle) => {
                detach(el);
            });
            this.tbarAlign = false;
            this.remove(tbarItems, CLS_TBARPOS);
        }
        this.clearProperty();
    }
    private destroyMode(): void {
        if (this.scrollModule) {
            this.remove(this.scrollModule.element, CLS_RTL);
            this.destroyScroll();
        }
        this.remove(this.element, CLS_EXTENDEDPOPOPEN);
        this.remove(this.element, CLS_EXTEANDABLE_TOOLBAR);
        const tempEle: HTMLElement = this.element.querySelector('.e-toolbar-multirow');
        if (tempEle) {
            this.remove(tempEle, CLS_MULTIROW);
        }
        if (this.popObj) {
            this.popupRefresh(this.popObj.element, true);
        }
    }
    private add(ele: HTEle, val: Str): void {
        ele.classList.add(val);
    }
    private remove(ele: HTEle, val: Str): void {
        ele.classList.remove(val);
    }
    private elementFocus(ele: HTEle): void {
        const fChild: HTEle = <HTEle>ele.firstElementChild;
        if (fChild) {
            fChild.focus();
            this.activeEleSwitch(ele);
        } else {
            ele.focus();
        }
    }
    private clstElement(tbrNavChk: boolean, trgt: HTEle): HTEle {
        let clst: HTEle;
        if (tbrNavChk && this.popObj && isVisible(this.popObj.element)) {
            clst = <HTEle>this.popObj.element.querySelector('.' + CLS_ITEM);
        } else if (this.element === trgt || tbrNavChk) {
            clst = <HTEle>this.element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_DISABLE + ' ):not(.' + CLS_SEPARATOR + ' ):not(.' + CLS_HIDDEN + ' )');
        } else {
            clst = <HTEle>closest(trgt, '.' + CLS_ITEM);
        }
        return clst;
    }
    private keyHandling(clst: HTEle, e: KeyboardEventArgs, trgt: HTEle, navChk: boolean, scrollChk: boolean): void {
        const popObj: Popup = this.popObj;
        const rootEle: HTEle = this.element;
        const popAnimate: Object = { name: 'FadeOut', duration: 100 };
        const value: Str = e.action === 'moveUp' ? 'previous' : 'next';
        let ele: HTEle;
        let nodes: NodeList;
        switch (e.action) {
        case 'moveRight':
            if (this.isVertical) {
                return;
            }
            if (rootEle === trgt) {
                this.elementFocus(clst);
            } else if (!navChk) {
                this.eleFocus(clst, 'next');
            }
            break;
        case 'moveLeft':
            if (this.isVertical) {
                return;
            }
            if (!navChk) {
                this.eleFocus(clst, 'previous');
            }
            break;
        case 'home':
        case 'end':
            if (clst) {
                let popupCheck: HTEle = <HTEle>closest(clst, '.e-popup');
                const extendedPopup: HTEle = this.element.querySelector('.' + CLS_EXTENDABLECLASS);
                if (this.overflowMode === 'Extended' && extendedPopup && extendedPopup.classList.contains('e-popup-open')) {
                    popupCheck = e.action === 'end' ? extendedPopup : null;
                }
                if (popupCheck) {
                    if (isVisible(this.popObj.element)) {
                        nodes = [].slice.call(popupCheck.children);
                        if (e.action === 'home') {
                            ele = this.focusFirstVisibleEle(nodes);
                        } else {
                            ele = this.focusLastVisibleEle(nodes);
                        }
                    }
                } else {
                    nodes = this.element.querySelectorAll('.' + CLS_ITEMS + ' .' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + ')');
                    if (e.action === 'home') {
                        ele = this.focusFirstVisibleEle(nodes);
                    } else {
                        ele = this.focusLastVisibleEle(nodes);
                    }
                }
                if (ele) {
                    this.elementFocus(ele);
                }
            }
            break;
        case 'moveUp':
        case 'moveDown':
            if (!this.isVertical) {
                if (popObj && closest(trgt, '.e-popup')) {
                    const popEle: HTEle = popObj.element;
                    const popFrstEle: HTEle = popEle.firstElementChild as HTEle;
                    if ((value === 'previous' && popFrstEle === clst)) {
                        (<HTEle>popEle.lastElementChild.firstChild).focus();
                    } else if (value === 'next' && popEle.lastElementChild === clst) {
                        (<HTEle>popFrstEle.firstChild).focus();
                    } else {
                        this.eleFocus(clst, value);
                    }
                } else if (e.action === 'moveDown' && popObj && isVisible(popObj.element)) {
                    this.elementFocus(clst);
                }
            } else {
                if (e.action === 'moveUp') {
                    this.eleFocus(clst, 'previous');
                } else {
                    this.eleFocus(clst, 'next');
                }
            }
            break;
        case 'tab':
            if (!scrollChk && !navChk) {
                const ele: HTEle = (<HTEle>clst.firstElementChild);
                if (rootEle === trgt) {
                    if (this.activeEle) {
                        this.activeEle.focus();
                    } else {
                        this.activeEleRemove(ele);
                        ele.focus();
                    }
                }
            }
            break;
        case 'popupClose':
            if (popObj && this.overflowMode !== 'Extended') {
                popObj.hide(popAnimate);
            }
            break;
        case 'popupOpen':
            if (!navChk) {
                return;
            }
            if (popObj && !isVisible(popObj.element)) {
                popObj.element.style.top = rootEle.offsetHeight + 'px';
                popObj.show({ name: 'FadeIn', duration: 100 });
            } else {
                popObj.hide(popAnimate);
            }
            break;
        }
    }
    private keyActionHandler(e: KeyboardEventArgs): void {
        const trgt: HTEle = <HTEle>e.target;
        if (trgt.tagName === 'INPUT' || trgt.tagName === 'TEXTAREA' || this.element.classList.contains(CLS_DISABLE)) {
            return;
        }
        e.preventDefault();
        const tbrNavChk: boolean = trgt.classList.contains(CLS_TBARNAV);
        const tbarScrollChk: boolean = trgt.classList.contains(CLS_TBARSCRLNAV);
        const clst: HTEle = this.clstElement(tbrNavChk, trgt);
        if (clst || tbarScrollChk) {
            this.keyHandling(clst, e, trgt, tbrNavChk, tbarScrollChk);
        }
    }
    /**
     * Specifies the value to disable/enable the Toolbar component.
     * When set to `true`, the component will be disabled.
     *
     * @param  {boolean} value - Based on this Boolean value, Toolbar will be enabled (false) or disabled (true).
     * @returns {void}.
     */
    public disable(value: boolean): void {
        const rootEle: HTMLElement = this.element;
        if (value) {
            rootEle.classList.add(CLS_DISABLE);
        } else {
            rootEle.classList.remove(CLS_DISABLE);
        }
        if (this.activeEle) {
            this.activeEle.setAttribute('tabindex', this.activeEle.getAttribute('data-tabindex'));
        }
        if (this.scrollModule) {
            this.scrollModule.disable(value);
        }
        if (this.popObj) {
            if (isVisible(this.popObj.element) && this.overflowMode !== 'Extended') {
                this.popObj.hide();
            }
            rootEle.querySelector('#' + rootEle.id + '_nav').setAttribute('tabindex', !value ? '0' : '-1');
        }
    }
    private eleContains(el: HTEle): string | boolean {
        return el.classList.contains(CLS_SEPARATOR) || el.classList.contains(CLS_DISABLE) || el.getAttribute('disabled') || el.classList.contains(CLS_HIDDEN) || !isVisible(el) || !el.classList.contains(CLS_ITEM);
    }
    private focusFirstVisibleEle(nodes: NodeList): HTMLElement {
        let element: HTMLElement;
        let index: number = 0;
        while (index < nodes.length) {
            const ele: HTMLElement = nodes[parseInt(index.toString(), 10)] as HTMLElement;
            if (!ele.classList.contains(CLS_HIDDEN) && !ele.classList.contains(CLS_DISABLE)) {
                return ele;
            }
            index++;
        }
        return element;
    }
    private focusLastVisibleEle(nodes: NodeList): HTMLElement {
        let element: HTMLElement;
        let index: number = nodes.length - 1;
        while (index >= 0) {
            const ele: HTMLElement = nodes[parseInt(index.toString(), 10)] as HTMLElement;
            if (!ele.classList.contains(CLS_HIDDEN) && !ele.classList.contains(CLS_DISABLE)) {
                return ele;
            }
            index--;
        }
        return element;
    }
    private eleFocus(closest: HTEle, pos: Str): void {
        const sib: HTEle = Object(closest)[pos + 'ElementSibling'];
        if (sib) {
            const skipEle: string | boolean = this.eleContains(sib);
            if (skipEle) {
                this.eleFocus(sib, pos); return;
            }
            this.elementFocus(sib);
        } else if (this.tbarAlign) {
            let elem: HTEle = Object(closest.parentElement)[pos + 'ElementSibling'] as HTEle;
            if (!isNOU(elem) && elem.children.length === 0) {
                elem = Object(elem)[pos + 'ElementSibling'] as HTEle;
            }
            if (!isNOU(elem) && elem.children.length > 0) {
                if (pos === 'next') {
                    const el: HTEle = <HTEle>elem.querySelector('.' + CLS_ITEM);
                    if (this.eleContains(el)) {
                        this.eleFocus(el, pos);
                    } else {
                        (<HTEle>el.firstElementChild).focus();
                        this.activeEleSwitch(el);
                    }
                } else {
                    const el: HTEle = <HTEle>elem.lastElementChild;
                    if (this.eleContains(el)) {
                        this.eleFocus(el, pos);
                    } else {
                        this.elementFocus(el);
                    }
                }
            }
        } else if (!isNOU(closest)) {
            const tbrItems: NodeList = this.element.querySelectorAll('.' + CLS_ITEMS + ' .' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + ')' + ':not(.' + CLS_DISABLE + ')' + ':not(.' + CLS_HIDDEN + ')');
            if (pos === 'next' && tbrItems) {
                this.elementFocus(tbrItems[0] as HTMLElement);
            } else if (pos === 'previous' && tbrItems) {
                this.elementFocus(tbrItems[tbrItems.length - 1] as HTMLElement);
            }
        }
    }
    private clickHandler(e: Event): void {
        const trgt: HTEle = <HTEle>e.target;
        const ele: HTEle = this.element;
        const isPopupElement: boolean = !isNOU(closest(trgt, '.' + CLS_POPUPCLASS));
        let clsList: DOMTokenList = trgt.classList;
        let popupNav: HTEle = <HTEle>closest(trgt, ('.' + CLS_TBARNAV));
        if (!popupNav) {
            popupNav = trgt;
        }
        if (!ele.children[0].classList.contains('e-hscroll') && !ele.children[0].classList.contains('e-vscroll')
            && (clsList.contains(CLS_TBARNAV))) {
            clsList = trgt.querySelector('.e-icons').classList;
        }
        if (clsList.contains(CLS_POPUPICON) || clsList.contains(CLS_POPUPDOWN)) {
            this.popupClickHandler(ele, popupNav, CLS_RTL);
        }
        let itemObj: ItemModel;
        const clst: HTEle = <HTEle>closest(<Node>e.target, '.' + CLS_ITEM);
        if ((isNOU(clst) || clst.classList.contains(CLS_DISABLE)) && !popupNav.classList.contains(CLS_TBARNAV)) {
            return;
        }
        if (clst) {
            const tempItem: ItemModel = this.items[this.tbarEle.indexOf(clst)];
            itemObj = tempItem;
        }
        const eventArgs: ClickEventArgs = { originalEvent: e, item: itemObj };
        const isClickBinded: boolean = itemObj && !isNOU(itemObj.click) && typeof itemObj.click == 'object' ?
            !isNOU((itemObj as any).click.observers) && (itemObj as any).click.observers.length > 0 :
            !isNOU(itemObj) && !isNOU(itemObj.click);
        if (isClickBinded) {
            this.trigger('items[' + this.tbarEle.indexOf(clst) + '].click', eventArgs);
        }
        if (!eventArgs.cancel) {
            this.trigger('clicked', eventArgs, (clickedArgs: ClickEventArgs) => {
                if (!isNOU(this.popObj) && isPopupElement && !clickedArgs.cancel && this.overflowMode === 'Popup' &&
                    clickedArgs.item && clickedArgs.item.type !== 'Input') {
                    this.popObj.hide({ name: 'FadeOut', duration: 100 });
                }
            });
        }
    }

    private popupClickHandler(ele: HTMLElement, popupNav: HTMLElement, CLS_RTL: Str): void {
        const popObj: Popup = this.popObj;
        if (isVisible(popObj.element)) {
            popupNav.classList.remove(CLS_TBARNAVACT);
            popObj.hide({ name: 'FadeOut', duration: 100 });
        } else {
            if (ele.classList.contains(CLS_RTL)) {
                popObj.enableRtl = true;
                popObj.position = { X: 'left', Y: 'top' };
            }
            if (popObj.offsetX === 0 && !ele.classList.contains(CLS_RTL)) {
                popObj.enableRtl = false;
                popObj.position = { X: 'right', Y: 'top' };
            }
            if (this.overflowMode === 'Extended') {
                popObj.element.style.minHeight = '0px';
                popObj.width = this.getToolbarPopupWidth(this.element);
            }
            popObj.dataBind();
            popObj.refreshPosition();
            popObj.element.style.top = this.getElementOffsetY() + 'px';
            popupNav.classList.add(CLS_TBARNAVACT);
            popObj.show({ name: 'FadeIn', duration: 100 });
        }
    }

    private getToolbarPopupWidth(ele: HTMLElement): number {
        const eleStyles: CSSStyleDeclaration = window.getComputedStyle(ele);
        return parseFloat(eleStyles.width) + ((parseFloat(eleStyles.borderRightWidth)) * 2);
    }

    /**
     * To Initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.initialize();
        this.renderControl();
        this.wireEvents();
        this.clickEvent = this.docEvent.bind(this);
        this.scrollEvent = this.docEvent.bind(this);
        this.renderComplete();
        if ((this as any).isReact && (this as Record<string, any>).portals && (this as Record<string, any>).portals.length > 0) {
            this.renderReactTemplates(() => {
                this.refreshOverflow();
            });
        }
    }
    private initialize(): void {
        const width: Str = formatUnit(this.width);
        const height: Str = formatUnit(this.height);
        if (Browser.info.name !== 'msie' || this.height !== 'auto' || this.overflowMode === 'MultiRow') {
            setStyle(this.element, { 'height': height });
        }
        setStyle(this.element, { 'width': width });
        const ariaAttr: { [key: string]: Str } = {
            'role': 'toolbar', 'aria-disabled': 'false',
            'aria-orientation': !this.isVertical ? 'horizontal' : 'vertical'
        };
        attributes(this.element, ariaAttr);
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
    }
    private renderControl(): void {
        const ele: HTEle = this.element;
        this.trgtEle = (ele.children.length > 0) ? <HTEle>ele.querySelector('div') : null;
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
        this.renderItems();
        this.renderLayout();
    }

    private renderLayout(): void {
        this.renderOverflowMode();
        if (this.tbarAlign) {
            this.itemPositioning();
        }
        if (this.popObj && this.popObj.element.childElementCount > 1 && this.checkPopupRefresh(this.element, this.popObj.element)) {
            this.popupRefresh(this.popObj.element, false);
        }
        this.separator();
    }

    private itemsAlign(items: ItemModel[], itemEleDom: HTEle): void {
        let innerItem: HTEle;
        let innerPos: HTEle;
        if (!this.tbarEle) {
            this.tbarEle = [];
        }
        for (let i: number = 0; i < items.length; i++) {
            innerItem = this.renderSubComponent(items[parseInt(i.toString(), 10)], i);
            if (this.tbarEle.indexOf(innerItem) === -1) {
                this.tbarEle.push(innerItem);
            }
            if (!this.tbarAlign) {
                this.tbarItemAlign(items[parseInt(i.toString(), 10)], itemEleDom, i);
            }
            innerPos = <HTEle>itemEleDom.querySelector('.e-toolbar-' + items[parseInt(i.toString(), 10)].align.toLowerCase());
            if (innerPos) {
                if (!(items[parseInt(i.toString(), 10)].showAlwaysInPopup && items[parseInt(i.toString(), 10)].overflow !== 'Show')) {
                    this.tbarAlgEle[(items[parseInt(i.toString(), 10)].align + 's').toLowerCase() as ItmAlign].push(innerItem);
                }
                innerPos.appendChild(innerItem);
            } else {
                itemEleDom.appendChild(innerItem);
            }
        }
        if ((this as any).isReact) {
            const portals: string = 'portals';
            this.notify('render-react-toolbar-template', (this as any)[`${portals}`]);
            this.renderReactTemplates();
        }
    }

    /**
     * @hidden
     * @returns {void}
     */
    public changeOrientation(): void {
        const ele: HTEle = this.element;
        if (this.isVertical) {
            ele.classList.remove(CLS_VERTICAL);
            this.isVertical = false;
            if (this.height === 'auto' || this.height === '100%') {
                ele.style.height = this.height;
            }
            ele.setAttribute('aria-orientation', 'horizontal');
        } else {
            ele.classList.add(CLS_VERTICAL);
            this.isVertical = true;
            ele.setAttribute('aria-orientation', 'vertical');
            setStyle(this.element, { 'height': formatUnit(this.height), 'width': formatUnit(this.width) });
        }
        this.destroyMode();
        this.refreshOverflow();
    }
    private initScroll(element: HTEle, innerItems: NodeList): void {
        if (!this.scrollModule && this.checkOverflow(element, <HTEle>innerItems[0])) {
            if (this.tbarAlign) {
                this.element.querySelector('.' + CLS_ITEMS + ' .' + CLS_TBARCENTER).removeAttribute('style');
            }
            if (this.isVertical) {
                this.scrollModule = new VScroll({ scrollStep: this.scrollStep, enableRtl: this.enableRtl }, <HTEle>innerItems[0]);
            } else {
                this.scrollModule = new HScroll({ scrollStep: this.scrollStep, enableRtl: this.enableRtl }, <HTEle>innerItems[0]);
            }
            if (this.cssClass) {
                addClass([<HTEle>innerItems[0]], this.cssClass.split(' '));
            }
            const scrollEle: Element = this.scrollModule.element.querySelector('.' + CLS_HSCROLLBAR + ', .' + 'e-vscroll-bar');
            if (scrollEle) {
                scrollEle.removeAttribute('tabindex');
            }
            this.remove(this.scrollModule.element, CLS_TBARPOS);
            setStyle(this.element, { overflow: 'hidden' });
        }
    }
    private itemWidthCal(items: HTEle): number {
        let width: number = 0;
        let style: CSSStyleDeclaration;
        [].slice.call(selectAll('.' + CLS_ITEM, items)).forEach((el: HTEle) => {
            if (isVisible(el)) {
                style = window.getComputedStyle(el);
                width += this.isVertical ? el.offsetHeight : el.offsetWidth;
                width += parseFloat(this.isVertical ? style.marginTop : style.marginRight);
                width += parseFloat(this.isVertical ? style.marginBottom : style.marginLeft);
            }
        });
        return width;
    }
    private getScrollCntEle(innerItem: HTEle): HTEle {
        const trgClass: Str = (this.isVertical) ? '.e-vscroll-content' : '.e-hscroll-content';
        return <HTEle>innerItem.querySelector(trgClass);
    }
    private checkOverflow(element: HTEle, innerItem: HTEle): boolean {
        if (isNOU(element) || isNOU(innerItem) || !isVisible(element)) {
            return false;
        }
        const eleWidth: number = this.isVertical ? element.offsetHeight : element.offsetWidth;
        let itemWidth: number = this.isVertical ? innerItem.offsetHeight : innerItem.offsetWidth;
        if (this.tbarAlign || this.scrollModule || (eleWidth === itemWidth)) {
            itemWidth = this.itemWidthCal(this.scrollModule ? this.getScrollCntEle(innerItem) : innerItem);
        }
        const popNav: HTEle = <HTEle>element.querySelector('.' + CLS_TBARNAV);
        const scrollNav: HTEle = <HTEle>element.querySelector('.' + CLS_TBARSCRLNAV);
        let navEleWidth: number = 0;
        if (popNav) {
            navEleWidth = this.isVertical ? popNav.offsetHeight : popNav.offsetWidth;
        } else if (scrollNav) {
            navEleWidth = this.isVertical ? (scrollNav.offsetHeight * (2)) : (scrollNav.offsetWidth * 2);
        }
        if (itemWidth > eleWidth - navEleWidth) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * Refresh the whole Toolbar component without re-rendering.
     * - It is used to manually refresh the Toolbar overflow modes such as scrollable, popup, multi row, and extended.
     * - It will refresh the Toolbar component after loading items dynamically.
     *
     * @returns {void}.
     */
    public refreshOverflow(): void {
        this.resize();
    }
    private toolbarAlign(innerItems: HTEle): void {
        if (this.tbarAlign) {
            this.add(innerItems, CLS_TBARPOS);
            this.itemPositioning();
        }
    }
    private renderOverflowMode(): void {
        const ele: HTEle = this.element;
        const innerItems: HTEle = <HTEle>ele.querySelector('.' + CLS_ITEMS);
        const priorityCheck: boolean = this.popupPriCount > 0;
        if (ele && ele.children.length > 0) {
            this.offsetWid = ele.offsetWidth;
            this.remove(this.element, 'e-toolpop');
            if (Browser.info.name === 'msie' && this.height === 'auto') {
                ele.style.height = '';
            }
            switch (this.overflowMode) {
            case 'Scrollable':
                if (isNOU(this.scrollModule)) {
                    this.initScroll(ele, [].slice.call(ele.getElementsByClassName(CLS_ITEMS)));
                }
                break;
            case 'Popup':
                this.add(this.element, 'e-toolpop');
                if (this.tbarAlign) {
                    this.removePositioning();
                }
                if (this.checkOverflow(ele, innerItems) || priorityCheck) {
                    this.setOverflowAttributes(ele);
                }
                this.toolbarAlign(innerItems);
                break;
            case 'MultiRow':
                this.add(innerItems, CLS_MULTIROW);
                if (this.checkOverflow(ele, innerItems) && this.tbarAlign) {
                    this.removePositioning();
                    this.add(innerItems, CLS_MULTIROWPOS);
                }
                if (ele.style.overflow === 'hidden') {
                    ele.style.overflow = '';
                }
                if (Browser.info.name === 'msie' || ele.style.height !== 'auto') {
                    ele.style.height = 'auto';
                }
                break;
            case 'Extended':
                this.add(this.element, CLS_EXTEANDABLE_TOOLBAR);
                if (this.checkOverflow(ele, innerItems) || priorityCheck) {
                    if (this.tbarAlign) {
                        this.removePositioning();
                    }
                    this.setOverflowAttributes(ele);
                }
                this.toolbarAlign(innerItems);
            }
        }
    }

    private setOverflowAttributes(ele: HTMLElement): void {
        this.createPopupEle(ele, [].slice.call(selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, ele)));
        const ariaAttr: { [key: string]: Str } = {
            'tabindex': '0', 'role': 'button', 'aria-haspopup' : 'true',
            'aria-label': 'overflow'
        };
        attributes(this.element.querySelector('.' + CLS_TBARNAV), ariaAttr);
    }

    private separator(): void {
        const element: HTEle = this.element;
        const eleItem: HTEle[] = [].slice.call(element.querySelectorAll('.' + CLS_SEPARATOR));
        const multiVar: HTEle = element.querySelector('.' + CLS_MULTIROW_SEPARATOR) as HTEle;
        const extendVar: HTEle = element.querySelector('.' + CLS_EXTENDABLE_SEPARATOR) as HTEle;
        const eleInlineItem: HTEle = this.overflowMode === 'MultiRow' ? multiVar : extendVar;
        if (eleInlineItem !== null) {
            if (this.overflowMode === 'MultiRow') {
                eleInlineItem.classList.remove(CLS_MULTIROW_SEPARATOR);
            } else if (this.overflowMode === 'Extended') {
                eleInlineItem.classList.remove(CLS_EXTENDABLE_SEPARATOR);
            }
        }
        for (let i: number = 0; i <= eleItem.length - 1; i++) {
            if (eleItem[parseInt(i.toString(), 10)].offsetLeft < 30 && eleItem[parseInt(i.toString(), 10)].offsetLeft !== 0) {
                if (this.overflowMode === 'MultiRow') {
                    eleItem[parseInt(i.toString(), 10)].classList.add(CLS_MULTIROW_SEPARATOR);
                } else if (this.overflowMode === 'Extended') {
                    eleItem[parseInt(i.toString(), 10)].classList.add(CLS_EXTENDABLE_SEPARATOR);
                }
            }
        }
    }

    private createPopupEle(ele: HTMLElement, innerEle: HTMLElement[]): void {
        let innerNav: HTEle = <HTEle>ele.querySelector('.' + CLS_TBARNAV);
        const vertical: boolean = this.isVertical;
        if (!innerNav) {
            this.createPopupIcon(ele);
        }
        innerNav = <HTEle>ele.querySelector('.' + CLS_TBARNAV);
        const innerNavDom: number = (vertical ? innerNav.offsetHeight : innerNav.offsetWidth);
        const eleWidth: number = ((vertical ? ele.offsetHeight : ele.offsetWidth) - (innerNavDom));
        this.element.classList.remove('e-rtl');
        setStyle(this.element, { direction: 'initial' });
        this.checkPriority(ele, innerEle, eleWidth, true);
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        this.element.style.removeProperty('direction');
        this.createPopup();
    }
    private pushingPoppedEle(tbarObj: Toolbar, popupPri: Element[], ele: HTEle, eleHeight: number, sepHeight: number): void {
        const element: HTEle = tbarObj.element;
        const poppedEle: HTEle[] = [].slice.call(selectAll('.' + CLS_POPUP, element.querySelector('.' + CLS_ITEMS)));
        let nodes: HTEle[] = selectAll('.' + CLS_TBAROVERFLOW, ele);
        let nodeIndex: number = 0;
        let nodePri: number = 0;
        poppedEle.forEach((el: HTEle, index: number) => {
            nodes = selectAll('.' + CLS_TBAROVERFLOW, ele);
            if (el.classList.contains(CLS_TBAROVERFLOW) && nodes.length > 0) {
                if (tbarObj.tbResize && nodes.length > index) {
                    ele.insertBefore(el, nodes[parseInt(index.toString(), 10)]); ++nodePri;
                } else {
                    ele.insertBefore(el, ele.children[nodes.length]); ++nodePri;
                }
            } else if (el.classList.contains(CLS_TBAROVERFLOW)) {
                ele.insertBefore(el, ele.firstChild); ++nodePri;
            } else if (tbarObj.tbResize && el.classList.contains(CLS_POPOVERFLOW) && ele.children.length > 0 && nodes.length === 0) {
                ele.insertBefore(el, ele.firstChild); ++nodePri;
            } else if (el.classList.contains(CLS_POPOVERFLOW)) {
                popupPri.push(el);
            } else if (tbarObj.tbResize) {
                ele.insertBefore(el, ele.childNodes[nodeIndex + nodePri]);
                ++nodeIndex;
            } else {
                ele.appendChild(el);
            }
            if (el.classList.contains(CLS_SEPARATOR)) {
                setStyle(el, { display: '', height: sepHeight + 'px' });
            } else {
                setStyle(el, { display: '', height: eleHeight + 'px' });
            }
        });
        popupPri.forEach((el: Element) => {
            ele.appendChild(el);
        });
        const tbarEle: HTEle[] = selectAll('.' + CLS_ITEM, element.querySelector('.' + CLS_ITEMS));
        for (let i: number = tbarEle.length - 1; i >= 0; i--) {
            const tbarElement: HTEle = tbarEle[parseInt(i.toString(), 10)];
            if (tbarElement.classList.contains(CLS_SEPARATOR) && this.overflowMode !== 'Extended') {
                setStyle(tbarElement, { display: 'none' });
            } else {
                break;
            }
        }
    }
    private createPopup(): void {
        const element: HTEle = this.element;
        let sepHeight: number;
        let sepItem: Element;
        if (this.overflowMode === 'Extended') {
            sepItem = element.querySelector('.' + CLS_SEPARATOR);
            sepHeight =
                (element.style.height === 'auto' || element.style.height === '') ? null : (sepItem && (sepItem as HTEle).offsetHeight);
        }
        const eleItem: Element = element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + '):not(.' + CLS_POPUP + ')');
        const eleHeight: number =
            (element.style.height === 'auto' || element.style.height === '') ? null : (eleItem && (eleItem as HTEle).offsetHeight);
        let ele: HTEle;
        const popupPri: Element[] = [];
        if (select('#' + element.id + '_popup.' + CLS_POPUPCLASS, element)) {
            ele = <HTEle>select('#' + element.id + '_popup.' + CLS_POPUPCLASS, element);
        } else {
            const extendEle: HTEle = this.createElement('div', {
                id: element.id + '_popup', className: CLS_POPUPCLASS + ' ' + CLS_EXTENDABLECLASS
            });
            const popupEle: HTEle = this.createElement('div', { id: element.id + '_popup', className: CLS_POPUPCLASS });
            ele = this.overflowMode === 'Extended' ? extendEle : popupEle;
        }
        this.pushingPoppedEle(this, popupPri, ele, eleHeight, sepHeight);
        this.popupInit(element, ele);
    }
    private getElementOffsetY(): number {
        return (this.overflowMode === 'Extended' && window.getComputedStyle(this.element).getPropertyValue('box-sizing') === 'border-box' ?
            this.element.clientHeight : this.element.offsetHeight);
    }
    private popupInit(element: HTEle, ele: HTEle): void {
        if (!this.popObj) {
            element.appendChild(ele);
            if (this.cssClass) {
                addClass([ele], this.cssClass.split(' '));
            }
            setStyle(this.element, { overflow: '' });
            const popup: Popup = new Popup(null, {
                relateTo: this.element,
                offsetY: (this.isVertical) ? 0 : this.getElementOffsetY(),
                enableRtl: this.enableRtl,
                open: this.popupOpen.bind(this),
                close: this.popupClose.bind(this),
                collision: { Y: this.enableCollision ? 'flip' : 'none' },
                position: this.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }
            });
            if (this.overflowMode === 'Extended') {
                popup.width = this.getToolbarPopupWidth(this.element);
                popup.offsetX = 0;
            }
            popup.appendTo(ele);
            document.addEventListener('scroll', this.clickEvent);
            document.addEventListener('click', this.scrollEvent);
            if (this.overflowMode !== 'Extended') {
                popup.element.style.maxHeight = popup.element.offsetHeight + 'px';
            }
            if (this.isVertical) {
                popup.element.style.visibility = 'hidden';
            }
            if (this.isExtendedOpen) {
                const popupNav: HTEle = this.element.querySelector('.' + CLS_TBARNAV);
                popupNav.classList.add(CLS_TBARNAVACT);
                classList(popupNav.firstElementChild, [CLS_POPUPICON], [CLS_POPUPDOWN]);
                this.element.querySelector('.' + CLS_EXTENDABLECLASS).classList.add(CLS_POPUPOPEN);
            } else {
                popup.hide();
            }
            this.popObj = popup;
        } else if (this.overflowMode !== 'Extended') {
            const popupEle: HTEle = this.popObj.element;
            setStyle(popupEle, { maxHeight: '', display: 'block' });
            setStyle(popupEle, { maxHeight: popupEle.offsetHeight + 'px', display: '' });
        }
    }
    private tbarPopupHandler(isOpen: boolean): void {
        if (this.overflowMode === 'Extended') {
            if (isOpen) {
                this.add(this.element, CLS_EXTENDEDPOPOPEN);
            } else {
                this.remove(this.element, CLS_EXTENDEDPOPOPEN);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private popupOpen(e: Event): void {
        const popObj: Popup = this.popObj;
        if (!this.isVertical) {
            popObj.offsetY = this.getElementOffsetY();
            popObj.dataBind();
        }
        const popupEle: HTEle = this.popObj.element;
        const toolEle: HTEle = this.popObj.element.parentElement;
        const popupNav: HTEle = <HTEle>toolEle.querySelector('.' + CLS_TBARNAV);
        popupNav.setAttribute('aria-expanded', 'true');
        if (this.overflowMode === 'Extended') {
            popObj.element.style.minHeight = '';
        } else {
            setStyle(popObj.element, { height: 'auto', maxHeight: '' });
            popObj.element.style.maxHeight = popObj.element.offsetHeight + 'px';
        }
        const popupElePos: number = popupEle.offsetTop + popupEle.offsetHeight + calculatePosition(toolEle).top;
        const popIcon: Element = (popupNav.firstElementChild as Element);
        popupNav.classList.add(CLS_TBARNAVACT);
        classList(popIcon, [CLS_POPUPICON], [CLS_POPUPDOWN]);
        this.tbarPopupHandler(true);
        const scrollVal: number = isNOU(window.scrollY) ? 0 : window.scrollY;
        if (!this.isVertical && ((window.innerHeight + scrollVal) < popupElePos) && (this.element.offsetTop < popupEle.offsetHeight)) {
            let overflowHeight: number = (popupEle.offsetHeight - ((popupElePos - window.innerHeight - scrollVal) + 5));
            popObj.height = overflowHeight + 'px';
            for (let i: number = 0; i <= popupEle.childElementCount; i++) {
                const ele: HTEle = <HTEle>popupEle.children[parseInt(i.toString(), 10)];
                if (ele.offsetTop + ele.offsetHeight > overflowHeight) {
                    overflowHeight = ele.offsetTop;
                    break;
                }
            }
            if (this.overflowMode !== 'Extended') {
                setStyle(popObj.element, { maxHeight: overflowHeight + 'px' });
            }
        } else if (this.isVertical && this.overflowMode !== 'Extended') {
            const tbEleData: ClientRect = this.element.getBoundingClientRect();
            setStyle(popObj.element, { maxHeight: (tbEleData.top + this.element.offsetHeight) + 'px', bottom: 0, visibility: '' });
        }
        if (popObj) {
            const popupOffset: ClientRect = popupEle.getBoundingClientRect();
            if (popupOffset.right > document.documentElement.clientWidth && popupOffset.width > toolEle.getBoundingClientRect().width) {
                popObj.collision = { Y: 'none' };
                popObj.dataBind();
            }
            popObj.refreshPosition();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private popupClose(e: Event): void {
        const element: HTEle = this.element;
        const popupNav: HTEle = <HTEle>element.querySelector('.' + CLS_TBARNAV);
        popupNav.setAttribute('aria-expanded', 'false');
        const popIcon: Element = (popupNav.firstElementChild as Element);
        popupNav.classList.remove(CLS_TBARNAVACT);
        classList(popIcon, [CLS_POPUPDOWN], [CLS_POPUPICON]);
        this.tbarPopupHandler(false);
    }
    private checkPriority(ele: HTEle, inEle: HTEle[], eleWidth: number, pre: boolean): void {
        const popPriority: boolean = this.popupPriCount > 0;
        const len: number = inEle.length;
        const eleWid: number = eleWidth;
        let eleOffset: number;
        let checkoffset: boolean;
        let sepCheck: number = 0; let itemCount: number = 0; let itemPopCount: number = 0;
        const checkClass: (ele: HTEle, val: Str[]) => boolean = (ele: HTEle, val: Str[]) => {
            let rVal: boolean = false;
            val.forEach((cls: string) => {
                if (ele.classList.contains(cls)) {
                    rVal = true;
                }
            });
            return rVal;
        };
        for (let i: number = len - 1; i >= 0; i--) {
            let mrgn: number;
            const compuStyle: CSSStyleDeclaration = window.getComputedStyle(inEle[parseInt(i.toString(), 10)]);
            if (this.isVertical) {
                mrgn = parseFloat((compuStyle).marginTop);
                mrgn += parseFloat((compuStyle).marginBottom);
            } else {
                mrgn = parseFloat((compuStyle).marginRight);
                mrgn += parseFloat((compuStyle).marginLeft);
            }
            const fstEleCheck: boolean = inEle[parseInt(i.toString(), 10)] === this.tbarEle[0];
            if (fstEleCheck) {
                this.tbarEleMrgn = mrgn;
            }
            eleOffset = this.isVertical ? inEle[parseInt(i.toString(), 10)].offsetHeight : inEle[parseInt(i.toString(), 10)].offsetWidth;
            const eleWid: number = fstEleCheck ? (eleOffset + mrgn) : eleOffset;
            if (checkClass(inEle[parseInt(i.toString(), 10)], [CLS_POPPRI]) && popPriority) {
                inEle[parseInt(i.toString(), 10)].classList.add(CLS_POPUP);
                if (this.isVertical) {
                    setStyle(inEle[parseInt(i.toString(), 10)], { display: 'none', minHeight: eleWid + 'px' });
                } else {
                    setStyle(inEle[parseInt(i.toString(), 10)], { display: 'none', minWidth: eleWid + 'px' });
                }
                itemPopCount++;
            }
            if (this.isVertical) {
                checkoffset =
                    (inEle[parseInt(i.toString(), 10)].offsetTop + inEle[parseInt(i.toString(), 10)].offsetHeight + mrgn) > eleWidth;
            } else {
                checkoffset =
                    (inEle[parseInt(i.toString(), 10)].offsetLeft + inEle[parseInt(i.toString(), 10)].offsetWidth + mrgn) > eleWidth;
            }
            if (checkoffset) {
                if (inEle[parseInt(i.toString(), 10)].classList.contains(CLS_SEPARATOR)) {
                    if (this.overflowMode === 'Extended') {
                        const sepEle: HTEle = (inEle[parseInt(i.toString(), 10)] as HTEle);
                        if (checkClass(sepEle, [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                            inEle[parseInt(i.toString(), 10)].classList.add(CLS_POPUP);
                            itemPopCount++;
                        }
                        itemCount++;
                    } else if (this.overflowMode === 'Popup') {
                        if (sepCheck > 0 && itemCount === itemPopCount) {
                            const sepEle: HTEle = (inEle[i + itemCount + (sepCheck - 1)] as HTEle);
                            if (checkClass(sepEle, [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                                setStyle(sepEle, { display: 'none' });
                            }
                        }
                        sepCheck++; itemCount = 0; itemPopCount = 0;
                    }
                } else {
                    itemCount++;
                }
                if (inEle[parseInt(i.toString(), 10)].classList.contains(CLS_TBAROVERFLOW) && pre) {
                    eleWidth -= ((this.isVertical ? inEle[parseInt(i.toString(), 10)].offsetHeight :
                        inEle[parseInt(i.toString(), 10)].offsetWidth) + (mrgn));
                } else if (!checkClass(inEle[parseInt(i.toString(), 10)], [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                    inEle[parseInt(i.toString(), 10)].classList.add(CLS_POPUP);
                    if (this.isVertical) {
                        setStyle(inEle[parseInt(i.toString(), 10)], { display: 'none', minHeight: eleWid + 'px' });
                    } else {
                        setStyle(inEle[parseInt(i.toString(), 10)], { display: 'none', minWidth: eleWid + 'px' });
                    }
                    itemPopCount++;
                } else {
                    eleWidth -= ((this.isVertical ? inEle[parseInt(i.toString(), 10)].offsetHeight :
                        inEle[parseInt(i.toString(), 10)].offsetWidth) + (mrgn));
                }
            }
        }
        if (pre) {
            const popedEle: HTEle[] = selectAll('.' + CLS_ITEM + ':not(.' + CLS_POPUP + ')', this.element);
            this.checkPriority(ele, popedEle, eleWid, false);
        }
    }

    private createPopupIcon(element: HTEle): void {
        const id: Str = element.id.concat('_nav');
        let className: Str = 'e-' + element.id.concat('_nav ' + CLS_POPUPNAV);
        className = this.overflowMode === 'Extended' ? className + ' ' + CLS_EXTENDPOPUP : className;
        const nav: HTEle = this.createElement('div', { id: id, className: className });
        if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
            nav.classList.add('e-ie-align');
        }
        const navItem: HTEle = this.createElement('div', { className: CLS_POPUPDOWN + ' e-icons' });
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        nav.setAttribute('role', 'button');
        element.appendChild(nav);
    }

    // eslint-disable-next-line max-len
    private tbarPriRef(inEle: HTEle, indx: number, sepPri: number, el: HTEle, des: boolean, elWid: number, wid: number, ig: number, eleStyles: Record<string, any>): void {
        const ignoreCount: number = ig;
        const popEle: HTEle = this.popObj.element;
        const query: Str = '.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + '):not(.' + CLS_TBAROVERFLOW + ')';
        const priEleCnt: number = selectAll('.' + CLS_POPUP + ':not(.' + CLS_TBAROVERFLOW + ')', popEle).length;
        const checkClass: (ele: HTEle, val: Str) => boolean = (ele: HTEle, val: Str) => {
            return ele.classList.contains(val);
        };
        if (selectAll(query, inEle).length === 0) {
            const eleSep: HTEle = inEle.children[indx - (indx - sepPri) - 1] as HTEle;
            const ignoreCheck: boolean = (!isNOU(eleSep) && checkClass(eleSep, CLS_TBARIGNORE));
            if ((!isNOU(eleSep) && checkClass(eleSep, CLS_SEPARATOR) && !isVisible(eleSep)) || ignoreCheck) {
                eleSep.style.display = 'unset';
                const eleSepWidth: number = eleSep.offsetWidth + (parseFloat(window.getComputedStyle(eleSep).marginRight) * 2);
                const prevSep: HTEle = eleSep.previousElementSibling as HTEle;
                if ((elWid + eleSepWidth) < wid || des) {
                    inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - (indx - sepPri)]);
                    if (!isNOU(prevSep)) {
                        prevSep.style.display = '';
                    }
                } else {
                    setStyle(el, eleStyles);
                    if (prevSep.classList.contains(CLS_SEPARATOR)) {
                        prevSep.style.display = 'none';
                    }
                }
                eleSep.style.display = '';
            } else {
                inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - (indx - sepPri)]);
            }
        } else {
            inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - priEleCnt]);
        }
    }

    private popupRefresh(popupEle: HTMLElement, destroy: boolean): void {
        const ele: HTEle = this.element;
        const isVer: boolean = this.isVertical;
        const innerEle: HTEle = <HTEle>ele.querySelector('.' + CLS_ITEMS);
        let popNav: HTEle = <HTEle>ele.querySelector('.' + CLS_TBARNAV);
        if (isNOU(popNav)) {
            return;
        }
        innerEle.removeAttribute('style');
        popupEle.style.display = 'block';
        let dimension: number;
        if (isVer) {
            dimension = ele.offsetHeight - (popNav.offsetHeight + innerEle.offsetHeight);
        } else {
            dimension = ele.offsetWidth - (popNav.offsetWidth + innerEle.offsetWidth);
        }
        let popupEleWidth: number = 0;
        [].slice.call(popupEle.children).forEach((el: HTMLElement): void => {
            popupEleWidth += this.popupEleWidth(el);
            setStyle(el, { 'position': '' });
        });
        if ((dimension + (isVer ? popNav.offsetHeight : popNav.offsetWidth)) > (popupEleWidth) && this.popupPriCount === 0) {
            destroy = true;
        }
        this.popupEleRefresh(dimension, popupEle, destroy);
        popupEle.style.display = '';
        if (popupEle.children.length === 0 && popNav && this.popObj) {
            detach(popNav);
            popNav = null;
            this.popObj.destroy();
            detach(this.popObj.element);
            this.popObj = null;
        }
    }
    private ignoreEleFetch(index: number, innerEle: HTEle): number {
        const ignoreEle: HTEle[] = [].slice.call(innerEle.querySelectorAll('.' + CLS_TBARIGNORE));
        const ignoreInx: number[] = [];
        let count: number = 0;
        if (ignoreEle.length > 0) {
            ignoreEle.forEach((ele: HTEle): void => {
                ignoreInx.push([].slice.call(innerEle.children).indexOf(ele));
            });
        } else {
            return 0;
        }
        ignoreInx.forEach((val: number): void => {
            if (val <= index) {
                count++;
            }
        });
        return count;
    }
    private checkPopupRefresh(root: HTEle, popEle: HTEle): boolean {
        popEle.style.display = 'block';
        const elWid: number = this.popupEleWidth(<HTEle>popEle.firstElementChild);
        (<HTEle>popEle.firstElementChild).style.removeProperty('Position');
        const tbarWidth: number = root.offsetWidth - (<HTEle>root.querySelector('.' + CLS_TBARNAV)).offsetWidth;
        const tbarItemsWid: number = (<HTEle>root.querySelector('.' + CLS_ITEMS)).offsetWidth;
        popEle.style.removeProperty('display');
        if (tbarWidth > (elWid + tbarItemsWid)) {
            return true;
        }
        return false;
    }
    private popupEleWidth(el: HTEle): number {
        el.style.position = 'absolute';
        let elWidth: number = this.isVertical ? el.offsetHeight : el.offsetWidth;
        const btnText: HTEle = <HTEle>el.querySelector('.' + CLS_TBARBTNTEXT);
        if (el.classList.contains('e-tbtn-align') || el.classList.contains(CLS_TBARTEXT)) {
            const btn: HTEle = <HTEle>el.children[0];
            if (!isNOU(btnText) && el.classList.contains(CLS_TBARTEXT)) {
                btnText.style.display = 'none';
            } else if (!isNOU(btnText) && el.classList.contains(CLS_POPUPTEXT)) {
                btnText.style.display = 'block';
            }
            btn.style.minWidth = '0%';
            elWidth = parseFloat(!this.isVertical ? el.style.minWidth : el.style.minHeight);
            btn.style.minWidth = '';
            btn.style.minHeight = '';
            if (!isNOU(btnText)) {
                btnText.style.display = '';
            }
        }
        return elWidth;
    }
    private popupEleRefresh(width: number, popupEle: HTEle, destroy: boolean): void {
        const popPriority: boolean = this.popupPriCount > 0;
        let eleSplice: HTEle[] = this.tbarEle;
        let priEleCnt: number;
        let index: number;
        let innerEle: HTEle = <HTEle>this.element.querySelector('.' + CLS_ITEMS);
        let ignoreCount: number = 0;
        for (const el of [].slice.call(popupEle.children)) {
            if (el.classList.contains(CLS_POPPRI) && popPriority && !destroy) {
                continue;
            }
            let elWidth: number = this.popupEleWidth(el);
            if (el === this.tbarEle[0]) {
                elWidth += this.tbarEleMrgn;
            }
            el.style.position = '';
            if (elWidth < width || destroy) {
                const inlineStyles: Record<string, any> = {
                    minWidth: el.style.minWidth, height: el.style.height,
                    minHeight: el.style.minHeight
                };
                setStyle(el, { minWidth: '', height: '', minHeight: '' });
                if (!el.classList.contains(CLS_POPOVERFLOW)) {
                    el.classList.remove(CLS_POPUP);
                }
                index = this.tbarEle.indexOf(el);
                if (this.tbarAlign) {
                    const pos: ItemAlign = this.items[parseInt(index.toString(), 10)].align;
                    index = this.tbarAlgEle[(pos + 's').toLowerCase() as ItmAlign].indexOf(el);
                    eleSplice = this.tbarAlgEle[(pos + 's').toLowerCase() as ItmAlign];
                    innerEle = <HTEle>this.element.querySelector('.' + CLS_ITEMS + ' .' + 'e-toolbar-' + pos.toLowerCase());
                }
                let sepBeforePri: number = 0;
                if (this.overflowMode !== 'Extended') {
                    eleSplice.slice(0, index).forEach((el: HTEle) => {
                        if (el.classList.contains(CLS_TBAROVERFLOW) || el.classList.contains(CLS_SEPARATOR)) {
                            if (el.classList.contains(CLS_SEPARATOR)) {
                                el.style.display = '';
                                width -= el.offsetWidth;
                            }
                            sepBeforePri++;
                        }
                    });
                }
                ignoreCount = this.ignoreEleFetch(index, innerEle);
                if (el.classList.contains(CLS_TBAROVERFLOW)) {
                    this.tbarPriRef(innerEle, index, sepBeforePri, el, destroy, elWidth, width, ignoreCount, inlineStyles);
                    width -= el.offsetWidth;
                } else if (index === 0) {
                    innerEle.insertBefore(el, innerEle.firstChild);
                    width -= el.offsetWidth;
                } else {
                    priEleCnt = selectAll('.' + CLS_TBAROVERFLOW, this.popObj.element).length;
                    innerEle.insertBefore(el, innerEle.children[(index + ignoreCount) - priEleCnt]);
                    width -= el.offsetWidth;
                }
                el.style.height = '';
            } else {
                break;
            }
        }
        const checkOverflow: boolean = this.checkOverflow(this.element, this.element.getElementsByClassName(CLS_ITEMS)[0] as HTEle);
        if (checkOverflow && !destroy) {
            this.renderOverflowMode();
        }
    }
    private removePositioning(): void {
        const item: HTEle = this.element.querySelector('.' + CLS_ITEMS) as HTEle;
        if (isNOU(item) || !item.classList.contains(CLS_TBARPOS)) {
            return;
        }
        this.remove(item, CLS_TBARPOS);
        const innerItem: HTEle[] = [].slice.call(item.childNodes);
        innerItem[1].removeAttribute('style');
        innerItem[2].removeAttribute('style');
    }
    private refreshPositioning(): void {
        const item: HTEle = this.element.querySelector('.' + CLS_ITEMS) as HTEle;
        this.add(item, CLS_TBARPOS);
        this.itemPositioning();
    }
    private itemPositioning(): void {
        const item: HTEle = this.element.querySelector('.' + CLS_ITEMS) as HTEle;
        let margin: number;
        if (isNOU(item) || !item.classList.contains(CLS_TBARPOS)) {
            return;
        }
        const popupNav: HTEle = <HTEle>this.element.querySelector('.' + CLS_TBARNAV);
        let innerItem: HTEle[];
        if (this.scrollModule) {
            const trgClass: Str = (this.isVertical) ? CLS_VSCROLLCNT : CLS_HSCROLLCNT;
            innerItem = [].slice.call(item.querySelector('.' + trgClass).children);
        } else {
            innerItem = [].slice.call(item.childNodes);
        }
        if (this.isVertical) {
            margin = innerItem[0].offsetHeight + innerItem[2].offsetHeight;
        } else {
            margin = innerItem[0].offsetWidth + innerItem[2].offsetWidth;
        }
        let tbarWid: number = this.isVertical ? this.element.offsetHeight : this.element.offsetWidth;
        if (popupNav) {
            tbarWid -= (this.isVertical ? popupNav.offsetHeight : popupNav.offsetWidth);
            const popWid: string = (this.isVertical ? popupNav.offsetHeight : popupNav.offsetWidth) + 'px';
            innerItem[2].removeAttribute('style');
            if (this.isVertical) {
                if (this.enableRtl) {
                    innerItem[2].style.top = popWid;
                } else {
                    innerItem[2].style.bottom = popWid;
                }
            } else {
                if (this.enableRtl) {
                    innerItem[2].style.left = popWid;
                } else {
                    innerItem[2].style.right = popWid;
                }
            }
        }
        if (tbarWid <= margin) {
            return;
        }
        const value: number = (((tbarWid - margin)) - (!this.isVertical ? innerItem[1].offsetWidth : innerItem[1].offsetHeight)) / 2;
        innerItem[1].removeAttribute('style');
        const mrgn: Str = ((!this.isVertical ? innerItem[0].offsetWidth : innerItem[0].offsetHeight) + value) + 'px';
        if (this.isVertical) {
            if (this.enableRtl) {
                innerItem[1].style.marginBottom = mrgn;
            } else {
                innerItem[1].style.marginTop = mrgn;
            }
        } else {
            if (this.enableRtl) {
                innerItem[1].style.marginRight = mrgn;
            } else {
                innerItem[1].style.marginLeft = mrgn;
            }
        }
    }
    private tbarItemAlign(item: ItemModel, itemEle: HTEle, pos: number): void {
        if (item.showAlwaysInPopup && item.overflow !== 'Show') {
            return;
        }
        const alignDiv: HTMLElement[] = [];
        alignDiv.push(this.createElement('div', { className: CLS_TBARLEFT }));
        alignDiv.push(this.createElement('div', { className: CLS_TBARCENTER }));
        alignDiv.push(this.createElement('div', { className: CLS_TBARRIGHT }));
        if (pos === 0 && item.align !== 'Left') {
            alignDiv.forEach((ele: HTEle) => {
                itemEle.appendChild(ele);
            });
            this.tbarAlign = true;
            this.add(itemEle, CLS_TBARPOS);
        } else if (item.align !== 'Left') {
            const alignEle: NodeList = itemEle.childNodes;
            const leftAlign: HTEle = alignDiv[0];
            [].slice.call(alignEle).forEach((el: HTEle) => {
                this.tbarAlgEle.lefts.push(el);
                leftAlign.appendChild(el);
            });
            itemEle.appendChild(leftAlign);
            itemEle.appendChild(alignDiv[1]);
            itemEle.appendChild(alignDiv[2]);
            this.tbarAlign = true;
            this.add(itemEle, CLS_TBARPOS);
        }
    }
    private ctrlTemplate(): void {
        this.ctrlTem = <HTEle>this.trgtEle.cloneNode(true);
        this.add(this.trgtEle, CLS_ITEMS);
        this.tbarEle = [];
        const innerEle: HTEle[] = [].slice.call(this.trgtEle.children);
        innerEle.forEach((ele: HTEle) => {
            if (ele.tagName === 'DIV') {
                this.tbarEle.push(ele);
                if (!isNOU(ele.firstElementChild)) {
                    ele.firstElementChild.setAttribute('aria-disabled', 'false');
                }
                this.add(ele, CLS_ITEM);
            }
        });
    }
    private renderItems(): void {
        const ele: HTEle = this.element;
        const items: Item[] = <Item[]>this.items;
        if (this.trgtEle != null) {
            this.ctrlTemplate();
        } else if (ele && items.length > 0) {
            let itemEleDom: HTEle;
            if (ele && ele.children.length > 0) {
                itemEleDom = <HTEle>ele.querySelector('.' + CLS_ITEMS);
            }
            if (!itemEleDom) {
                itemEleDom = this.createElement('div', { className: CLS_ITEMS });
            }
            this.itemsAlign(items, itemEleDom);
            ele.appendChild(itemEleDom);
        }
    }
    private setAttr(attr: { [key: string]: Str }, element: HTEle): void {
        const key: Object[] = Object.keys(attr);
        let keyVal: Str;
        for (let i: number = 0; i < key.length; i++) {
            keyVal = key[parseInt(i.toString(), 10)] as Str;
            if (keyVal === 'class') {
                this.add(element, attr[`${keyVal}`]);
            } else {
                element.setAttribute(keyVal, attr[`${keyVal}`]);
            }
        }
    }
    /**
     * Enables or disables the specified Toolbar item.
     *
     * @param  {number|HTMLElement|NodeList} items - DOM element or an array of items to be enabled or disabled.
     * @param  {boolean} isEnable  - Boolean value that determines whether the command should be enabled or disabled.
     * By default, `isEnable` is set to true.
     * @returns {void}.
     */
    public enableItems(items: number | HTMLElement | NodeList, isEnable?: boolean): void {
        const elements: NodeList = <NodeList>items;
        const len: number = elements.length;
        let ele: HTEle | number;
        if (isNOU(isEnable)) {
            isEnable = true;
        }
        const enable: (isEnable: boolean, ele: HTEle) => void = (isEnable: boolean, ele: HTEle) => {
            if (isEnable) {
                ele.classList.remove(CLS_DISABLE);
                if (!isNOU(ele.firstElementChild)) {
                    ele.firstElementChild.setAttribute('aria-disabled', 'false');
                }
            } else {
                ele.classList.add(CLS_DISABLE);
                if (!isNOU(ele.firstElementChild)) {
                    ele.firstElementChild.setAttribute('aria-disabled', 'true');
                }
            }
        };
        if (!isNOU(len) && len >= 1) {
            for (let a: number = 0, element: HTEle[] = [].slice.call(elements); a < len; a++) {
                const itemElement: HTEle = element[parseInt(a.toString(), 10)];
                if (typeof (itemElement) === 'number') {
                    ele = this.getElementByIndex(itemElement);
                    if (isNOU(ele)) {
                        return;
                    } else {
                        elements[parseInt(a.toString(), 10)] = ele;
                    }
                } else {
                    ele = itemElement;
                }
                enable(isEnable, ele);
            }
            if (isEnable) {
                removeClass(elements, CLS_DISABLE);
            } else {
                addClass(elements, CLS_DISABLE);
            }
        } else {
            if (typeof (elements) === 'number') {
                ele = this.getElementByIndex(elements);
                if (isNOU(ele)) {
                    return;
                }
            } else {
                ele = <HTEle>items;
            }
            enable(isEnable, ele);
        }
    }
    private getElementByIndex(index: number): HTEle {
        if (this.tbarEle[parseInt(index.toString(), 10)]) {
            return this.tbarEle[parseInt(index.toString(), 10)];
        }
        return null;
    }
    /**
     * Adds new items to the Toolbar that accepts an array as Toolbar items.
     *
     * @param  {ItemModel[]} items - DOM element or an array of items to be added to the Toolbar.
     * @param  {number} index - Number value that determines where the command is to be added. By default, index is 0.
     * @returns {void}.
     */
    public addItems(items: ItemModel[], index?: number): void {
        let innerItems: HTEle[];
        this.extendedOpen();
        const itemsDiv: HTEle = <HTEle>this.element.querySelector('.' + CLS_ITEMS);
        if (isNOU(itemsDiv)) {
            this.itemsRerender(items);
            return;
        }
        let innerEle: HTEle;
        let itemAgn: Str = 'Left';
        if (isNOU(index)) {
            index = 0;
        }
        items.forEach((e: ItemModel) => {
            if (!isNOU(e.align) && e.align !== 'Left' && itemAgn === 'Left') {
                itemAgn = e.align;
            }
        });
        for (const item of items) {
            if (isNOU(item.type)) {
                item.type = 'Button';
            }
            innerItems = selectAll('.' + CLS_ITEM, this.element);
            item.align = <ItemAlign>itemAgn;
            innerEle = this.renderSubComponent(item, index);
            if (this.tbarEle.length >= index && innerItems.length >= 0) {
                if (isNOU(this.scrollModule)) {
                    this.destroyMode();
                }
                const algIndex: number = item.align[0] === 'L' ? 0 : item.align[0] === 'C' ? 1 : 2;
                let ele: Element;
                if (!this.tbarAlign && itemAgn !== 'Left') {
                    this.tbarItemAlign(item, itemsDiv, 1);
                    this.tbarAlign = true;
                    ele = closest(innerItems[0], '.' + CLS_ITEMS).children[parseInt(algIndex.toString(), 10)];
                    ele.appendChild(innerEle);
                    this.tbarAlgEle[(item.align + 's').toLowerCase() as ItmAlign].push(innerEle);
                    this.refreshPositioning();
                } else if (this.tbarAlign) {
                    ele = closest(innerItems[0], '.' + CLS_ITEMS).children[parseInt(algIndex.toString(), 10)];
                    ele.insertBefore(innerEle, ele.children[parseInt(index.toString(), 10)]);
                    this.tbarAlgEle[(item.align + 's').toLowerCase() as ItmAlign].splice(index, 0, innerEle);
                    this.refreshPositioning();
                } else if (innerItems.length === 0) {
                    innerItems = selectAll('.' + CLS_ITEMS, this.element);
                    innerItems[0].appendChild(innerEle);
                } else {
                    innerItems[0].parentNode.insertBefore(innerEle, innerItems[parseInt(index.toString(), 10)]);
                }
                this.items.splice(index, 0, item);
                if (item.template) {
                    this.tbarEle.splice(this.tbarEle.length - 1, 1);
                }
                this.tbarEle.splice(index, 0, innerEle);
                index++;
                this.offsetWid = itemsDiv.offsetWidth;
            }
        }
        itemsDiv.style.width = '';
        this.renderOverflowMode();
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }
    /**
     * Removes the items from the Toolbar. Acceptable arguments are index of item/HTMLElement/node list.
     *
     * @param  {number|HTMLElement|NodeList|HTMLElement[]} args
     * Index or DOM element or an Array of item which is to be removed from the Toolbar.
     * @returns {void}.
     */
    public removeItems(args: number | HTMLElement | NodeList | Element | HTMLElement[]): void {
        const elements: NodeList = <NodeList>args;
        let index: number;
        let innerItems: HTEle[] = [].slice.call(selectAll('.' + CLS_ITEM, this.element));
        if (typeof (elements) === 'number') {
            index = parseInt(args.toString(), 10);
            this.removeItemByIndex(index, innerItems);
        } else {
            if (elements && elements.length > 1) {
                for (const ele of [].slice.call(elements)) {
                    index = this.tbarEle.indexOf(ele);
                    this.removeItemByIndex(index, innerItems);
                    innerItems = selectAll('.' + CLS_ITEM, this.element);
                }
            } else {
                const ele: HTEle = (elements && elements.length && elements.length === 1) ? <HTEle>elements[0] : <HTEle>args;
                index = innerItems.indexOf(ele);
                this.removeItemByIndex(index, innerItems);
            }
        }
        this.resize();
    }
    private removeItemByIndex(index: number, innerItems: HTEle[]): void {
        if (this.tbarEle[parseInt(index.toString(), 10)] && innerItems[parseInt(index.toString(), 10)]) {
            const eleIdx: number = this.tbarEle.indexOf(innerItems[parseInt(index.toString(), 10)]);
            if (this.tbarAlign) {
                const indexAgn: number =
                    this.tbarAlgEle[(this.items[parseInt(eleIdx.toString(), 10)].align + 's').toLowerCase() as ItmAlign].indexOf(this.tbarEle[parseInt(eleIdx.toString(), 10)]);
                this.tbarAlgEle[(this.items[parseInt(eleIdx.toString(), 10)].align + 's').toLowerCase() as ItmAlign].splice(parseInt(indexAgn.toString(), 10), 1);
            }
            if ((this as any).isReact) {
                this.clearToolbarTemplate(innerItems[parseInt(index.toString(), 10)]);
            }
            const btnItem: EJ2Instance = innerItems[parseInt(index.toString(), 10)].querySelector('.e-control.e-btn');
            if (!isNOU(btnItem) && !isNOU(btnItem.ej2_instances[0]) && !((btnItem.ej2_instances[0] as Button).isDestroyed)) {
                (btnItem.ej2_instances[0] as Button).destroy();
            }
            detach(innerItems[parseInt(index.toString(), 10)]);
            this.items.splice(eleIdx, 1);
            this.tbarEle.splice(eleIdx, 1);
        }
    }
    private templateRender(templateProp: Object | Str, innerEle: HTEle, item: ItemModel, index: number): void {
        const itemType: Str = item.type;
        const eleObj: Template = <Template>templateProp;
        let isComponent: boolean;
        if (typeof (templateProp) === 'object') {
            isComponent = typeof (eleObj.appendTo) === 'function';
        }
        if (typeof (templateProp) === 'string' || !isComponent) {
            let templateFn: Function;
            let val: Str = <Str>templateProp;
            const regEx: RegExp = new RegExp(/<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i);
            val = (typeof (templateProp) === 'string') ? <Str>templateProp.trim() : <Str>templateProp;
            try {
                if (typeof (templateProp) === 'object' && !isNOU((templateProp as HTEle).tagName)) {
                    innerEle.appendChild(templateProp as HTEle);
                } else if (typeof (templateProp) === 'string' && regEx.test(val)) {
                    innerEle.innerHTML = val;
                } else if (document.querySelectorAll(val).length) {
                    const ele: Element = document.querySelector(val);
                    const tempStr: Str = ele.outerHTML.trim();
                    innerEle.appendChild(ele);
                    (<HTMLElement>ele).style.display = '';
                    if (!isNOU(tempStr)) {
                        this.tempId.push(val);
                    }
                } else {
                    templateFn = templateCompiler(val);
                }
            } catch (e) {
                templateFn = templateCompiler(val);
            }
            let tempArray: HTEle[];
            if (!isNOU(templateFn)) {
                const toolbarTemplateID: string = this.element.id + index + '_template';
                tempArray = templateFn({}, this, 'template', toolbarTemplateID, this.isStringTemplate, undefined, undefined, this.root);
            }
            if (!isNOU(tempArray) && tempArray.length > 0) {
                [].slice.call(tempArray).forEach((ele: HTEle): void => {
                    if (!isNOU(ele.tagName)) {
                        ele.style.display = '';
                    }
                    innerEle.appendChild(ele);
                });
            }
        } else if (itemType === 'Input') {
            const ele: HTEle = this.createElement('input');
            if (item.id) {
                ele.id = item.id;
            } else {
                ele.id = getUniqueID('tbr-ipt');
            }
            innerEle.appendChild(ele);
            eleObj.appendTo(ele);
        }
        this.add(innerEle, CLS_TEMPLATE);
        const firstChild: HTMLElement = innerEle.firstElementChild as HTMLElement;
        if (!isNOU(firstChild)) {
            firstChild.setAttribute('tabindex', isNOU(firstChild.getAttribute('tabIndex')) ? '-1' : this.getDataTabindex(firstChild));
            firstChild.setAttribute('data-tabindex', isNOU(firstChild.getAttribute('tabIndex')) ? '-1' : this.getDataTabindex(firstChild));
        }
        this.tbarEle.push(innerEle);
    }
    private buttonRendering(item: ItemModel, innerEle: HTEle): HTEle {
        const dom: HTEle = this.createElement('button', { className: CLS_TBARBTN });
        dom.setAttribute('type', 'button');
        const textStr: Str = item.text;
        let iconCss: Str;
        let iconPos: Str;
        if (item.id) {
            dom.id = item.id;
        } else {
            dom.id = getUniqueID('e-tbr-btn');
        }
        const btnTxt: HTEle = this.createElement('span', { className: 'e-tbar-btn-text' });
        if (textStr) {
            btnTxt.innerHTML = this.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(textStr) : textStr;
            dom.appendChild(btnTxt);
            dom.classList.add('e-tbtn-txt');
        } else {
            this.add(innerEle, 'e-tbtn-align');
        }
        if (item.prefixIcon || item.suffixIcon) {
            if ((item.prefixIcon && item.suffixIcon) || item.prefixIcon) {
                iconCss = item.prefixIcon + ' e-icons';
                iconPos = 'Left';
            } else {
                iconCss = item.suffixIcon + ' e-icons';
                iconPos = 'Right';
            }
        }
        const btnObj: Button = new Button({ iconCss: iconCss, iconPosition: <IconPosition>iconPos });
        btnObj.createElement = this.createElement;
        btnObj.appendTo(dom as HTMLButtonElement);
        if (item.width) {
            setStyle(dom, { 'width': formatUnit(item.width) });
        }
        return dom;
    }
    private renderSubComponent(item: ItemModel, index: number): HTEle {
        let dom: HTEle;
        const innerEle: HTEle = this.createElement('div', { className: CLS_ITEM });
        const tempDom: HTEle = this.createElement('div', {
            innerHTML: this.enableHtmlSanitizer && !isNOU(item.tooltipText) ?
                SanitizeHtmlHelper.sanitize(item.tooltipText) : item.tooltipText
        });
        if (!this.tbarEle) {
            this.tbarEle = [];
        }
        if (item.htmlAttributes) {
            this.setAttr(item.htmlAttributes, innerEle);
        }
        if (item.tooltipText) {
            innerEle.setAttribute('title', tempDom.textContent);
        }
        if (item.cssClass) {
            innerEle.className = innerEle.className + ' ' + item.cssClass;
        }
        if (item.template) {
            this.templateRender(item.template, innerEle, item, index);
        } else {
            switch (item.type) {
            case 'Button':
                dom = this.buttonRendering(item, innerEle);
                dom.setAttribute('tabindex', isNOU(item.tabIndex) ? '-1' : item.tabIndex.toString());
                dom.setAttribute('data-tabindex', isNOU(item.tabIndex) ? '-1' : item.tabIndex.toString());
                dom.setAttribute('aria-label', (item.text || item.tooltipText));
                dom.setAttribute('aria-disabled', 'false');
                innerEle.appendChild(dom);
                innerEle.addEventListener('click', this.itemClick.bind(this));
                break;
            case 'Separator':
                this.add(innerEle, CLS_SEPARATOR);
                break;
            }
        }
        if (item.showTextOn) {
            const sTxt: Str = item.showTextOn;
            if (sTxt === 'Toolbar') {
                this.add(innerEle, CLS_POPUPTEXT);
                this.add(innerEle, 'e-tbtn-align');
            } else if (sTxt === 'Overflow') {
                this.add(innerEle, CLS_TBARTEXT);
            }
        }
        if (item.overflow) {
            const overflow: Str = item.overflow;
            if (overflow === 'Show') {
                this.add(innerEle, CLS_TBAROVERFLOW);
            } else if (overflow === 'Hide') {
                if (!innerEle.classList.contains(CLS_SEPARATOR)) {
                    this.add(innerEle, CLS_POPOVERFLOW);
                }
            }
        }
        if (item.overflow !== 'Show' && item.showAlwaysInPopup && !innerEle.classList.contains(CLS_SEPARATOR)) {
            this.add(innerEle, CLS_POPPRI);
            this.popupPriCount++;
        }
        if (item.disabled) {
            this.add(innerEle, CLS_DISABLE);
        }
        if (item.visible === false) {
            this.add(innerEle, CLS_HIDDEN);
        }
        return innerEle;
    }

    private getDataTabindex(ele: HTEle): string {
        return isNOU(ele.getAttribute('data-tabindex')) ? '-1' : ele.getAttribute('data-tabindex');
    }
    private itemClick(e: Event): void {
        this.activeEleSwitch(<HTEle>e.currentTarget);
    }
    private activeEleSwitch(ele: HTEle): void {
        this.activeEleRemove(<HTEle>ele.firstElementChild);
        this.activeEle.focus();
    }
    private activeEleRemove(curEle: HTEle): void {
        let previousEle: HTEle = <HTEle>this.element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_DISABLE + ' ):not(.' + CLS_SEPARATOR + ' ):not(.' + CLS_HIDDEN + ' )');
        if (!isNOU(this.activeEle)) {
            this.activeEle.setAttribute('tabindex', this.getDataTabindex(this.activeEle));
            if (previousEle) {
                previousEle.removeAttribute('tabindex');
            }
            previousEle = this.activeEle;
        }
        this.activeEle = curEle;
        if (this.getDataTabindex(this.activeEle) === '-1') {
            if (isNOU(this.trgtEle) && !(<HTEle>curEle.parentElement).classList.contains(CLS_TEMPLATE)) {
                if (!isNOU(this.element.querySelector('.e-hor-nav')) && this.element.querySelector('.e-hor-nav').classList.contains('e-nav-active')) {
                    this.updateTabIndex('0');
                    const tabindexValue: string = this.getDataTabindex(previousEle) === '-1' ? '0' : this.getDataTabindex(previousEle);
                    previousEle.setAttribute('tabindex', tabindexValue);
                }
                else {
                    this.updateTabIndex('-1');
                }
                curEle.removeAttribute('tabindex');
            } else {
                const tabIndex: number = parseInt(this.getDataTabindex(this.activeEle), 10) + 1;
                this.activeEle.setAttribute('tabindex', tabIndex.toString());
            }
        }
    }
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - Returns the module name as string.
     * @private
     */
    protected getModuleName(): string {
        return 'toolbar';
    }
    private itemsRerender(newProp: ItemModel[]): void {
        this.items = this.tbarItemsCol;
        if ((this as any).isReact || (this as any).isAngular) {
            this.clearTemplate();
        }
        this.destroyMode();
        this.destroyItems();
        this.items = newProp;
        this.tbarItemsCol = this.items;
        this.renderItems();
        this.renderOverflowMode();
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }
    private resize(): void {
        const ele: HTEle = this.element;
        this.tbResize = true;
        if (this.tbarAlign) {
            this.itemPositioning();
        }
        if (this.popObj && this.overflowMode === 'Popup') {
            this.popObj.hide();
        }
        const checkOverflow: boolean = this.checkOverflow(ele, ele.getElementsByClassName(CLS_ITEMS)[0] as HTEle);
        if (!checkOverflow) {
            this.destroyScroll();
            const multirowele: HTEle = ele.querySelector('.' + CLS_ITEMS);
            if (!isNOU(multirowele)) {
                this.remove(multirowele, CLS_MULTIROWPOS);
                if (this.tbarAlign) {
                    this.add(multirowele, CLS_TBARPOS);
                }
            }
        }
        if (checkOverflow && this.scrollModule && (this.offsetWid === ele.offsetWidth)) {
            return;
        }
        if (this.offsetWid > ele.offsetWidth || checkOverflow) {
            this.renderOverflowMode();
        }
        if (this.popObj) {
            if (this.overflowMode === 'Extended') {
                this.popObj.width = this.getToolbarPopupWidth(this.element);
            }
            if (this.tbarAlign) {
                this.removePositioning();
            }
            this.popupRefresh(this.popObj.element, false);
            if (this.tbarAlign) {
                this.refreshPositioning();
            }
        }
        if (this.element.querySelector('.' + CLS_HSCROLLBAR)) {
            this.scrollStep = (this.element.querySelector('.' + CLS_HSCROLLBAR) as HTMLElement).offsetWidth;
        }
        this.offsetWid = ele.offsetWidth;
        this.tbResize = false;
        this.separator();
    }

    private orientationChange(): void {
        setTimeout(() => {
            this.resize();
        }, 500);
    }

    private extendedOpen(): void {
        const sib: HTEle = this.element.querySelector('.' + CLS_EXTENDABLECLASS) as HTEle;
        if (this.overflowMode === 'Extended' && sib) {
            this.isExtendedOpen = sib.classList.contains(CLS_POPUPOPEN);
        }
    }

    private updateHideEleTabIndex(ele: HTMLElement, isHidden: boolean, isElement: boolean, eleIndex: number, innerItems: HTEle[]): void {
        if (isElement) {
            eleIndex = innerItems.indexOf(ele);
        }
        let nextEle: HTEle = innerItems[++eleIndex];
        while (nextEle) {
            const skipEle: string | boolean = this.eleContains(nextEle);
            if (!skipEle) {
                const dataTabIndex: string = nextEle.firstElementChild.getAttribute('data-tabindex');
                if (isHidden && dataTabIndex === '-1') {
                    nextEle.firstElementChild.setAttribute('tabindex', '0');
                } else if (dataTabIndex !== nextEle.firstElementChild.getAttribute('tabindex')) {
                    nextEle.firstElementChild.setAttribute('tabindex', dataTabIndex);
                }
                break;
            }
            nextEle = innerItems[++eleIndex];
        }
    }

    private clearToolbarTemplate(templateEle: HTMLElement): void {
        if ((this as Record<string, any>).registeredTemplate && (this as Record<string, any>).registeredTemplate[`${'template'}`]) {
            const registeredTemplates: Record<string, any> = (this as Record<string, any>).registeredTemplate;
            for (let index: number = 0; index < registeredTemplates[`${'template'}`].length; index++) {
                const registeredItem: any = registeredTemplates[`${'template'}`][parseInt(index.toString(), 10)].rootNodes[0] as any;
                const closestItem: Element = closest(registeredItem, '.' + CLS_ITEM);
                if (!isNOU(closestItem) && closestItem === templateEle) {
                    this.clearTemplate(['template'], [registeredTemplates[`${'template'}`][parseInt(index.toString(), 10)]]);
                    break;
                }
            }
        } else if ((this as Record<string, any>).portals && (this as Record<string, any>).portals.length > 0) {
            const portals: Record<string, any>[] = (this as Record<string, any>).portals;
            for (let index: number = 0; index < portals.length; index++) {
                const portalItem: Record<string, any> = portals[parseInt(index.toString(), 10)];
                const closestItem: Element = closest(portalItem.containerInfo, '.' + CLS_ITEM);
                if (!isNOU(closestItem) && closestItem === templateEle) {
                    this.clearTemplate(['template'], index);
                    break;
                }
            }
        }
    }

    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     *
     * @param  {ToolbarModel} newProp - It contains new value of the data.
     * @param  {ToolbarModel} oldProp - It contains old value of the data.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: ToolbarModel, oldProp: ToolbarModel): void {
        const tEle: HTEle = this.element;
        this.extendedOpen();
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'items':
                if (!(newProp.items instanceof Array && oldProp.items instanceof Array)) {
                    const changedProb: Object[] = Object.keys(newProp.items);
                    for (let i: number = 0; i < changedProb.length; i++) {
                        const index: number = parseInt(Object.keys(newProp.items)[parseInt(i.toString(), 10)], 10);
                        const property: Str = Object.keys(newProp.items[parseInt(index.toString(), 10)])[0];
                        const newProperty: Str = Object(newProp.items[parseInt(index.toString(), 10)])[`${property}`];
                        if (this.tbarAlign || property === 'align') {
                            this.refresh();
                            this.trigger('created');
                            break;
                        }
                        const popupPriCheck: boolean = property === 'showAlwaysInPopup' && !newProperty;
                        const booleanCheck: boolean = property === 'overflow' && this.popupPriCount !== 0;
                        if ((popupPriCheck) || (this.items[parseInt(index.toString(), 10)].showAlwaysInPopup) && booleanCheck) {
                            --this.popupPriCount;
                        }
                        if (isNOU(this.scrollModule)) {
                            this.destroyMode();
                        }
                        const itemCol: HTEle[] = [].slice.call(selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, tEle));
                        if ((this as any).isReact && this.items[parseInt(index.toString(), 10)].template) {
                            this.clearToolbarTemplate(itemCol[parseInt(index.toString(), 10)]);
                        }
                        detach(itemCol[parseInt(index.toString(), 10)]);
                        this.tbarEle.splice(index, 1);
                        this.addItems([this.items[parseInt(index.toString(), 10)]], index);
                        this.items.splice(index, 1);
                        if (this.items[parseInt(index.toString(), 10)].template) {
                            this.tbarEle.splice(this.items.length, 1);
                        }
                    }
                } else {
                    this.itemsRerender(newProp.items);
                }
                break;
            case 'width':
                setStyle(tEle, { 'width': formatUnit(newProp.width) });
                this.refreshOverflow();
                break;
            case 'height':
                setStyle(this.element, { 'height': formatUnit(newProp.height) });
                break;
            case 'overflowMode':
                this.destroyMode();
                this.renderOverflowMode();
                if (this.enableRtl) {
                    this.add(tEle, CLS_RTL);
                }
                this.refreshOverflow();
                break;
            case 'enableRtl':
                if (newProp.enableRtl) {
                    this.add(tEle, CLS_RTL);
                } else {
                    this.remove(tEle, CLS_RTL);
                }
                if (!isNOU(this.scrollModule)) {
                    if (newProp.enableRtl) {
                        this.add(this.scrollModule.element, CLS_RTL);
                    } else {
                        this.remove(this.scrollModule.element, CLS_RTL);
                    }
                }
                if (!isNOU(this.popObj)) {
                    if (newProp.enableRtl) {
                        this.add(this.popObj.element, CLS_RTL);
                    } else {
                        this.remove(this.popObj.element, CLS_RTL);
                    }
                }
                if (this.tbarAlign) {
                    this.itemPositioning();
                }
                break;
            case 'scrollStep':
                if (this.scrollModule) {
                    this.scrollModule.scrollStep = this.scrollStep;
                }
                break;
            case 'enableCollision':
                if (this.popObj) {
                    this.popObj.collision = { Y: this.enableCollision ? 'flip' : 'none' };
                }
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.element], oldProp.cssClass.split(' '));
                }
                if (newProp.cssClass) {
                    addClass([this.element], newProp.cssClass.split(' '));
                }
                break;
            case 'allowKeyboard':
                this.unwireKeyboardEvent();
                if (newProp.allowKeyboard) {
                    this.wireKeyboardEvent();
                }
                break;
            }
        }
    }
    /**
     * Shows or hides the Toolbar item that is in the specified index.
     *
     * @param  {number | HTMLElement} index - Index value of target item or DOM element  of items to be hidden or shown.
     * @param  {boolean} value - Based on this Boolean value, item will be hide (true) or show (false). By default, value is false.
     * @returns {void}.
     */
    public hideItem(index: number | HTMLElement | Element, value?: boolean): void {
        const isElement: boolean = (typeof (index) === 'object') ? true : false;
        const eleIndex: number = index as number;
        let ele: HTMLElement;
        if (!isElement && isNOU(eleIndex)) {
            return;
        }
        const innerItems: HTEle[] = [].slice.call(selectAll('.' + CLS_ITEM, this.element));
        if (isElement) {
            ele = (index as HTMLElement);
        } else if (this.tbarEle[parseInt(eleIndex.toString(), 10)]) {
            const innerItems: HTEle[] = [].slice.call(selectAll('.' + CLS_ITEM, this.element));
            ele = innerItems[parseInt(eleIndex.toString(), 10)];
        }
        if (ele) {
            if (value) {
                ele.classList.add(CLS_HIDDEN);
                if (!ele.classList.contains(CLS_SEPARATOR)) {
                    if (isNOU(ele.firstElementChild.getAttribute('tabindex')) ||
                        ele.firstElementChild.getAttribute('tabindex') !== '-1') {
                        this.updateHideEleTabIndex(ele, value, isElement, eleIndex, innerItems);
                    }
                }
            } else {
                ele.classList.remove(CLS_HIDDEN);
                if (!ele.classList.contains(CLS_SEPARATOR)) {
                    this.updateHideEleTabIndex(ele, value, isElement, eleIndex, innerItems);
                }
            }
            this.refreshOverflow();
        }
    }
}
